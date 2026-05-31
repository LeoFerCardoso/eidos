# Eidos Harness Upgrade — Contract-First Determinism

> Paste this whole block into Claude Code at the root of `eidos`. It is the build order for evolving the harness into a deterministic, enterprise-grade DS + React + Storybook + registry/CLI system. **It hardens what already exists; it does not rebuild the stack.**

---

## 0. Mission & non-negotiable ground rules

You are upgrading the **Eidos** design-system harness. The doctrine is one sentence:

> **Anything that must be true 100% of the time becomes code — a hook, a script, a schema, a generator — fronted by ONE versioned contract. If you're explaining a rule in prose that could be a test, make it a test.**

Today Eidos already has the determinism *parts* (4 hooks, 5 check scripts, 5 generators, blocking `tsc`, a 5-job CI) but **no unifying spine**, and ~35% of the quality bar is still prose-only. Your job is to add the spine — `eidos.contract.json` — make every clause map to a deterministic verifier, aggregate them behind `npm run eidos:verify`, gate it with a `Stop` hook, and render a generated `EIDOS-HEALTH.md`.

**Respect prior decisions. These are settled; do NOT reopen them:**

- **Stack is npm workspaces + Turborepo** (`packageManager: npm@10.8.2`, `turbo.json`). Never say pnpm.
- **No shadcn primitives, no `cva`, no Tailwind-for-components.** Eidos components compose **hand-authored `.ds-*` / `.ai-*` CSS classes** defined in `packages/ui/styles/{tokens.css,ds.css,ai.css}`; color/spacing come from `var(--token)` defined **once** in `tokens.css`. A blanket "ban all hex/px" regex is **forbidden** — `tokens.css` legitimately holds `#FF6B35`, `oklch()`, px. **Note:** `class-variance-authority` is already a transitive/root dependency (it is in the **root** `package.json` but is **NOT imported by any `packages/ui/src` component** — verify before acting). Do **not** introduce `cva` *into Eidos components*; a lockfile grep alone will mislead you.
- **Tokens are authored in CSS** and **exported** to DTCG via `scripts/gen-tokens.mjs` → `tokens/forge.tokens.json`. **Do NOT invert to Style-Dictionary-as-source.** ⚠️ **Verified bug to fix first:** `gen-tokens.mjs` hardcodes `readFileSync('src/styles/tokens.css', …)`, but that path **no longer exists** post-monorepo — the only token source on disk is `packages/ui/styles/tokens.css`. So `npm run gen:tokens` currently **throws `ENOENT`** and the DTCG export is stale/dead. The `C-tokens-dtcg` clause (§1.3) + a `gen-tokens --check` mode must **repoint the source to `packages/ui/styles/tokens.css`** (and assert the regenerated output matches the committed `tokens/forge.tokens.json`) so the DTCG export tracks the shipped token source. **Do NOT invert to Style-Dictionary-as-source** — CSS stays authoritative.
- **Distribution is source-shipped** — `packages/registry` (`registry.json` → `public/r/<name>.json`) + `packages/cli` (`eidos add`) copy source into consumers. **No changesets, no published-package model.** Versioning is the single `DS_VERSION` in `src/lib/site.ts`, bumped by `/release`. (Add a git tag per release; that is the only release-governance change.)
- Single accent **ember `#FF6B35`** (`var(--accent)`), ≤2× per screen. **Geist Sans + Geist Mono.** Logical CSS properties (RTL is first-class). The theme axis is **{dark, light} × {ltr, rtl}** — NOT multi-accent.
- **No Figma linkage** (DTCG export is the only bridge).
- It's **Eidos**, not "Eidos". Name every new artifact `eidos.*` / `eidos:verify` / `EIDOS-HEALTH.md`.

**Do NOT re-propose work already done:** `tsc --noEmit` is blocking (`next.config.mjs` `ignoreBuildErrors:false` + CI `ui:typecheck`); API tables are generated (`gen-props.mjs` → `props.generated.ts` → `<AutoPropsTable>`); a11y/visual/nav/frame-code/render checks exist; nav/migrated/examples/props/tokens are generated; `protect-generated`/`typography-scale`/`format-edited`/`session-context` hooks are wired. Reuse all of it.

---

## 1. THE SPINE — `packages/registry/eidos.contract.json` (+ JSON Schema)

Author **two files** as the single machine-readable definition of "a Eidos component is Done." Everything downstream (verify, scaffold, health, Stop hook, the reviewer agent, the workflows) reads these — nothing else encodes the bar.

### 1.1 The 4 surfaces (the thing the contract makes deterministic)

Every Eidos component must exist coherently across four trees, kept in sync. **Surface parity *is* the product** — a component that exists on only 1–2 surfaces is **broken**, even if it renders, because the registry/CLI promise is "install any component, component-by-component."

| # | Surface | Path | Source of truth for |
|---|---------|------|---------------------|
| 1 | **Docs page** | `src/ds/migrated/<ds>/<slug>.tsx` (core: `src/ds/migrated/<slug>.tsx`) | the DS-PAGE-STANDARD anatomy (the canonical demo) |
| 2 | **`@eidos/ui` export** | `packages/ui/src/<comp>.tsx` (or a grouped barrel — see ⚠️ below), re-exported from `packages/ui/src/index.ts` | the component API (types → `gen-props`) |
| 3 | **Storybook story** | `packages/ui/src/stories/<group>/<Comp>.stories.tsx` (CSF3) | the isolated variant×state matrix (the *canonical demo*) |
| 4 | **Registry item** | `packages/registry/registry.json` → `public/r/<name>.json` (via `build-registry.mjs`), with a per-component source at `packages/registry/src/forge/<name>.tsx` | the `eidos add` install payload |

⚠️ **Source-mapping reality (do not assume 1:1 filenames):** many `@eidos/ui` exports do **not** live in a per-component file — `Chip`, `CountUp`, `Avatar`, etc. live inside **grouped barrel files** (`atoms.tsx`, `primitives.tsx`, `blocks.tsx`), while the registry keeps a **per-component** `src/forge/<name>.tsx` (split by `scripts/extract-registry.mjs`). Therefore the contract must bind registry↔source via an **explicit per-component mapping field** (`surfaces.exportFile`), never a filename-convention checksum. See `C-registry-sync` (§1.3) and §2.2.5 for the correct end-state.

### 1.2 `eidos.contract.schema.json` (JSON Schema, draft 2020-12) — author this

The contract is a list of **clauses** + a list of **components** with their surface bindings and **waivers**.

```jsonc
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://eidos.dev/eidos.contract.schema.json",
  "title": "Eidos component contract",
  "type": "object",
  "required": ["version", "clauses", "components"],
  "additionalProperties": false,
  "properties": {
    "version":   { "type": "string", "description": "Contract semver. Bumped when a clause is added/changed." },
    "dsVersion": { "type": "string", "description": "Mirror of DS_VERSION (src/lib/site.ts) at author time. check-contract asserts equality." },
    "surfaces":  { "type": "array", "items": { "enum": ["docs","export","story","registry","cross","tokens"] } },
    "clauses": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["id", "title", "surface", "verifier", "gate", "rule"],
        "properties": {
          "id":      { "type": "string", "pattern": "^C-[a-z0-9-]+$" },
          "title":   { "type": "string" },
          "surface": { "enum": ["docs","export","story","registry","cross","tokens"] },
          "rule":    { "type": "string", "description": "One-line plain statement of the invariant." },
          "verifier":{ "type": "string", "description": "Verifier id or EXT:<npm-script>. See §2." },
          "gate":    { "enum": ["block","advisory"], "description": "block = exits CI/Stop nonzero on fail; advisory = reported only, never gates." },
          "appliesTo": { "type": "array", "items": { "enum": ["component","foundation","ai","example","overview"] }, "default": ["component"] },
          "since":   { "type": "string" },
          "adr":     { "type": "string", "description": "Optional docs/adr/NNNN slug citing the settled decision." }
        }
      }
    },
    "components": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["name", "kind", "surfaces"],
        "properties": {
          "name":   { "type": "string" },
          "kind":   { "enum": ["component","foundation","ai","example","overview"] },
          "ds":     { "enum": ["core","charts","ai","idp","patterns","mobile","blocks"] },
          "surfaces": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "docs":       { "type": "string", "description": "src/ds/migrated path, or '' if N/A." },
              "export":     { "type": "string", "description": "@eidos/ui export name (e.g. 'Chip')." },
              "exportFile": { "type": "string", "description": "Actual file the export lives in (e.g. 'packages/ui/src/atoms.tsx'). REQUIRED for grouped barrels." },
              "story":      { "type": "string", "description": "stories path." },
              "registry":   { "type": "string", "description": "registry item name → public/r/<name>.json." },
              "registrySrc":{ "type": "string", "description": "packages/registry/src/forge/<name>.tsx path." }
            }
          }
        }
      }
    },
    "waivers": {
      "type": "array",
      "description": "Explicit, reviewed exceptions. A clause failure with a matching, NON-EXPIRED waiver resolves to status 'waived' — NEVER silently 'pass'/green.",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["component", "clause", "reason"],
        "properties": {
          "component": { "type": "string" },
          "clause":    { "type": "string", "pattern": "^C-[a-z0-9-]+$" },
          "reason":    { "type": "string", "minLength": 1, "description": "Non-empty justification. Required." },
          "expires":   { "type": "string", "format": "date", "description": "Optional ISO date; after it, the waiver no longer applies and the clause fails normally." }
        }
      }
    }
  }
}
```

**Waiver semantics (graft from C2 — enforce exactly):** when a clause for a component **fails**, `eidos:verify` checks `waivers[]` for a matching `{component, clause}` whose `expires` (if present) is in the future. If found → the clause status is **`waived`** (a distinct column/value in `reports/state.json` and `EIDOS-HEALTH.md`), with the reason surfaced. A waived clause does **not** count as a `block` fail, but it is **never** rendered as a green pass. No waiver, no skip.

### 1.3 `eidos.contract.json` (the authored contract) — clause skeleton

Each clause maps to a verifier that **reuses an existing script** or names a **new** one (§2 lists which are new). A `verifier` value of `EXT:<npm-script>` means "shell out to that workspace npm script and parse its exit code/JSON" (graft from C2 — use it to delegate typecheck/CLI-e2e instead of reimplementing them). Author exactly these clauses:

```jsonc
{
  "version": "1.0.0",
  "dsVersion": "1.28.1",
  "surfaces": ["docs", "export", "story", "registry", "cross", "tokens"],
  "clauses": [
    // ── Surface 1 · DOCS PAGE (DS-PAGE-STANDARD.md is the prose; this is its executable form) ──
    { "id": "C-docs-exists",     "surface": "docs",  "gate": "block", "appliesTo": ["component","foundation","ai","example"],
      "rule": "A migrated page exists at the bound path, default-exports, imports primitives from @/ds/core, and headless-renders with no thrown error / React console.error.",
      "verifier": "verify-render" },                                              // EXISTING (npm run verify)
    { "id": "C-docs-sections",   "surface": "docs",  "gate": "block", "appliesTo": ["component","ai"],
      "rule": "<SubHead meta> order matches docs/ds-page-standard.json: Installation → Usage → Variants/Sizes/States → [In context] → Accessibility → RTL → Anatomy → Do/Don't → API reference.",
      "verifier": "check-ds-page-structure" },                                    // NEW
    { "id": "C-a11y-section",    "surface": "docs",  "gate": "block", "appliesTo": ["component","ai"],
      "rule": "Page has <SubHead meta=\"a11y\"> mentioning keyboard + ARIA + contrast + reduced-motion.",
      "verifier": "check-ds-page-structure" },                                    // NEW (same script)
    { "id": "C-rtl-frame",       "surface": "docs",  "gate": "block", "appliesTo": ["component","ai"],
      "rule": "Page has a live <Frame dir=\"rtl\"> with Arabic copy, OR a matching waiver (foundations).",
      "verifier": "check-ds-page-structure" },                                    // NEW
    { "id": "C-anatomy",         "surface": "docs",  "gate": "block", "appliesTo": ["component","ai"],
      "rule": "Anatomy is rendered: .ana > .stage with numbered .pin + .lead connectors + numbered .ana-list legend (never a prose list).",
      "verifier": "check-ds-page-structure" },                                    // NEW
    { "id": "C-do-dont",         "surface": "docs",  "gate": "block", "appliesTo": ["component","ai","foundation"],
      "rule": "Do/Don't uses .dd-grid.",
      "verifier": "check-ds-page-structure" },                                    // NEW
    { "id": "C-autopropstable",  "surface": "docs",  "gate": "block", "appliesTo": ["component","ai"],
      "rule": "API reference uses <AutoPropsTable component=\"<export>\"/>; no hand-authored <table>/<PropsTable> for a real export.",
      "verifier": "check-ds-page-structure" },                                    // NEW
    { "id": "C-lede",            "surface": "docs",  "gate": "block", "appliesTo": ["component","foundation","ai"],
      "rule": "Header lede ≤220 chars, plain text (no markup).",
      "verifier": "check-ds-page-structure" },                                    // NEW (elevates the warn-only hook)
    { "id": "C-no-page-style",   "surface": "docs",  "gate": "block", "appliesTo": ["component","foundation","ai","example"],
      "rule": "No <style> block and no inline style={{ color|fontSize|padding|margin|background }} in migrated pages; compose .ds-* + var(--token).",
      "verifier": "check-no-page-style" },                                        // NEW
    { "id": "C-frame-parses",    "surface": "docs",  "gate": "block", "appliesTo": ["component","ai","example"],
      "rule": "Every Frame/CodeBlock/TabbedCode snippet TS-parses; a // @eidos-frame:<storyId> Frame must equal its source story (no structural drift).",
      "verifier": "check-frame-code" },                                           // EXISTING (extended, §7.6)
    { "id": "C-no-slop",         "surface": "docs",  "gate": "advisory", "appliesTo": ["component","ai","example"],
      "rule": "No emoji feature-icons, no invented metrics ('10× faster', '99.9% uptime'), no filler ('lorem ipsum'), no placeholder CDNs (unsplash/placehold/picsum), no hardcoded font-family outside var(--font-*).",
      "verifier": "check-slop" },                                                 // NEW (consolidated lint)
    { "id": "C-links-resolve",   "surface": "cross", "gate": "block", "appliesTo": ["component","foundation","ai","example"],
      "rule": "Every nav href resolves to a page/example; every page (except overview) is in nav; in-body <a href> resolve; PAGE_SLUG == nav-config id.",
      "verifier": "check-nav" },                                                  // EXISTING (extend to body links + PAGE_SLUG)

    // ── Surface 2 · @eidos/ui EXPORT ──
    { "id": "C-export",          "surface": "export","gate": "block", "appliesTo": ["component","ai"],
      "rule": "Component is exported from packages/ui/src/index.ts barrel (resolved via surfaces.exportFile).",
      "verifier": "check-4-surface-parity" },                                     // NEW (parity)
    { "id": "C-typecheck",       "surface": "export","gate": "block", "appliesTo": ["component","ai"],
      "rule": "tsc --noEmit clean for @eidos/ui and the docs app.",
      "verifier": "EXT:ui:typecheck" },                                           // EXISTING (blocking; also EXT:typecheck for docs app)

    // ── Surface 3 · STORYBOOK STORY (the story is the canonical demo) ──
    { "id": "C-story",           "surface": "story", "gate": "block", "appliesTo": ["component","ai"],
      "rule": "A CSF3 story exists; meta.title prefix ∈ preview.ts storySort.order AND matches its folder group; tags include 'autodocs'.",
      "verifier": "check-stories" },                                              // NEW
    { "id": "C-story-matrix",    "surface": "story", "gate": "advisory", "appliesTo": ["component"],
      "rule": "≥1 story per documented variant×state (incl. a States story); story renders in {dark,light}×{ltr,rtl} via the existing decorators.",
      "verifier": "check-stories" },                                              // NEW
    { "id": "C-story-a11y",      "surface": "story", "gate": "advisory", "appliesTo": ["component","ai"],
      "rule": "@storybook/addon-a11y / test-runner reports no critical/serious violations for the story.",
      "verifier": "EXT:sb:test" },                                                // NEW (test-runner)

    // ── Surface 4 · REGISTRY ITEM (eidos add) ──
    { "id": "C-registry",        "surface": "registry","gate": "block", "appliesTo": ["component","ai"],
      "rule": "A registry item exists; public/r/<name>.json builds; $schema valid; registryDependencies acyclic and all present; files[].source paths exist.",
      "verifier": "check-registry" },                                             // NEW (validation; build is EXISTING)
    { "id": "C-registry-sync",   "surface": "registry","gate": "block", "appliesTo": ["component","ai"],
      "rule": "Registry source (surfaces.registrySrc) matches its bound @eidos/ui source (surfaces.exportFile) — no drift. Per the explicit mapping, NOT a filename convention.",
      "verifier": "check-registry" },                                             // NEW
    { "id": "C-cli-install",     "surface": "registry","gate": "block", "appliesTo": ["component","ai"],
      "rule": "eidos add <name> resolves the FULL transitive registryDependency graph and refuses to write if any dep is missing.",
      "verifier": "EXT:cli:test" },                                               // EXISTING e2e + NEW guard (§9)

    // ── Cross / visual / tokens ──
    { "id": "C-visual",          "surface": "cross", "gate": "advisory", "appliesTo": ["component","foundation","ai","example"],
      "rule": "No unexplained pixel drift vs tests/visual-baselines.",
      "verifier": "check-visual" },                                               // EXISTING
    { "id": "C-contrast-fill",   "surface": "cross", "gate": "block", "appliesTo": ["component","ai"],
      "rule": "Any foreground on an accent/elevated FILL is explicitly contrasting (dark ink on ember; light on dark; ≥4.5:1 body / 3:1 UI). Token tertiary tiers (--fg-subtle/--fg-faint) remain advisory by design.",
      "verifier": "check-contrast-fill" },                                        // NEW (targeted; NOT blanket axe contrast)
    { "id": "C-a11y-axe",        "surface": "cross", "gate": "block", "appliesTo": ["component","foundation","ai","example"],
      "rule": "axe-core WCAG A/AA structural rules pass (color-contrast stays advisory per design decision).",
      "verifier": "check-a11y" },                                                 // EXISTING (--strict, structural)
    { "id": "C-tokens-dtcg",     "surface": "tokens","gate": "block", "appliesTo": ["all"],
      "rule": "tokens/forge.tokens.json is regenerated and in sync with the CANONICAL packages/ui/styles/tokens.css (CSS is source; DTCG is export). gen-tokens source path must be repointed off the legacy src/styles/tokens.css.",
      "verifier": "gen-tokens-check" },                                           // EXISTING (add --check mode + repoint source)
    { "id": "C-contract-valid",  "surface": "cross", "gate": "block", "appliesTo": ["all"],
      "rule": "eidos.contract.json validates against eidos.contract.schema.json; dsVersion == src/lib/site.ts DS_VERSION; every clause names a known verifier.",
      "verifier": "check-contract" }                                             // NEW
  ],
  "components": [ /* one entry per component, generated by `eidos gen contract --sync` (§4.2) */ ],
  "waivers": [
    // explicit, reviewed exceptions — each REQUIRES a reason. Example:
    { "component": "tree-view", "clause": "C-autopropstable", "reason": "external wrapper; gen-props cannot type it; hand table reviewed", "expires": "2026-09-30" }
  ]
}
```

**Rule of authorship:** the contract is the ONLY place the bar lives. When you find an invariant restated in `CLAUDE.md`, a craft rulebook, or `DS-PAGE-STANDARD.md` that a script could check, add it as a clause and point the prose at the clause id.

---

## 2. Verifiers — reuse first, build only the gaps

### 2.1 Already done — bind clauses to these, do NOT rebuild

| Existing script / npm key | Clauses it satisfies | Change needed |
|---|---|---|
| `scripts/verify-render.mjs` (`npm run verify`) | `C-docs-exists` | add `--component <name>` filter |
| `scripts/check-frame-code.mjs` (`npm run check:frames`) | `C-frame-parses` | extend toward "snippet ≡ story source" (§7.6) |
| `scripts/check-nav.mjs` (`npm run check:nav`) | `C-links-resolve` | **extend** to crawl in-body `<a href>` and assert `PAGE_SLUG == nav-config id` |
| `scripts/check-a11y.mjs` (`npm run check:a11y`, axe) | `C-a11y-axe` | none (keep contrast advisory) |
| `scripts/check-visual.mjs` (`npm run check:visual`) | `C-visual` | optionally add per-story shots once Storybook is complete |
| `scripts/gen-props.mjs` + `<AutoPropsTable>` | backs `C-autopropstable` | none (already drift-proof) |
| `scripts/gen-tokens.mjs` (`npm run gen:tokens`) | `C-tokens-dtcg` | **repoint source to `packages/ui/styles/tokens.css`** + add `--check` (fail if regenerated output ≠ committed) |
| `packages/registry/scripts/build-registry.mjs` (`npm run registry:build`) | builds the payload for `C-registry` | end-state: inline directly from canonical source (§2.2.5) |
| `tsc` / `next.config.mjs` / `ui:typecheck` | `C-typecheck`, `C-export` | none (already blocking); reached via `EXT:ui:typecheck` |
| `packages/cli/test/e2e*.mjs` (`cli:test`) | `C-cli-install` | add the dep-completeness guard + test (§9) |

### 2.2 New verifiers to author (these close the documented gaps)

Every new script: support `--component <name>`, `--all`, `--strict`, `--json`, and **export a `run({component})` function** (graft from C3) so `eidos-verify.mjs` can aggregate **in-process** and memoize route-level checks (render/a11y/visual run **once per page**, not once per clause). Keep a thin CLI wrapper on each for back-compat.

1. **`scripts/check-ds-page-structure.mjs`** — TS-parse every `src/ds/migrated/**/*.tsx`; extract `<SubHead meta=…>` order and JSX class markers; verify against the **machine-readable `docs/ds-page-standard.json`** (graft from C2 — author this as the data derivation of `DS-PAGE-STANDARD.md` so the *rules live as data, not re-encoded in the script*). Assert: (a) canonical section sequence + order, (b) `a11y` section present with keyboard/aria/contrast/motion keywords, (c) `<Frame dir="rtl">` present or waived, (d) `.ana` + `.ana-list` anatomy, (e) `.dd-grid`, (f) `<AutoPropsTable>` (no hand-table) when documenting a real export, (g) lede ≤220 chars & no markup. Honors waivers. `--strict` exits nonzero. Satisfies `C-docs-sections / C-a11y-section / C-rtl-frame / C-anatomy / C-do-dont / C-autopropstable / C-lede`.
2. **`scripts/check-no-page-style.mjs`** — grep/parse `src/ds/migrated/**` + `src/ds/examples/**` for `<style>` and inline `style={{ … }}` carrying color/size/spacing/background (skip demo renders inside `<Frame>`); also flag raw `#hex`/`rgba(`/`Npx` in `packages/ui/src/**/*.tsx`. **Whitelist `packages/ui/styles/{tokens.css,ds.css,ai.css}`** as the only place those values live. Satisfies `C-no-page-style`. (This is the *correct* Eidos form of the draft's "no-raw-values" idea; a blanket regex would break the token files.)
3. **`scripts/check-4-surface-parity.mjs`** — the keystone. For each `components[]` entry, verify all four bound surfaces resolve using the **explicit `surfaces` mapping** (docs file exists + imports `@/ds/core`; `export` name present in the barrel via `exportFile`; `story` file exists; `public/r/<name>.json` exists). Emit per-component booleans. `--strict` fails if a non-waived component is missing ≥1 surface. Satisfies `C-export` (parity half). **This is the keystone parity gate the consolidation-audit only computed read-only.**
4. **`scripts/check-stories.mjs`** — assert every `@eidos/ui` export has a CSF3 story; **READ `storySort.order` from `apps/storybook/.storybook/preview.ts`** (do NOT embed a hardcoded list — the real order is `['Introduction','Primitives','Forms','Elements','Blocks','Overlays','Device','AI','Icons','Docs']`, **no Charts group**); validate `meta.title` prefix ∈ that order AND matches the folder group; require `tags: ['autodocs']`; (advisory) count variant×state stories + a States story. Satisfies `C-story / C-story-matrix`.
5. **`scripts/check-registry.mjs`** — JSON-schema-validate `registry.json` + every `public/r/*.json` against the shadcn registry-item schema; DFS `registryDependencies` for cycles + missing refs; verify every `files[].source` resolves. For `C-registry-sync`, diff `surfaces.registrySrc` against the **bound** `surfaces.exportFile` region (NOT `ui/src/<comp>.tsx == registry/src/forge/<comp>.tsx` by filename — exports live in grouped barrels). **This checksum gate is INTERIM.** The real fix (graft from the winner's stated end-state, §2.2.5) is to make `build-registry.mjs` inline directly from the canonical `packages/ui/src` source so the `src/forge/<name>.tsx` copies disappear entirely. Satisfies `C-registry / C-registry-sync`.
6. **`scripts/check-contrast-fill.mjs`** — **targeted, not blanket axe.** Headless-screenshot each route; for elements rendered on an accent/elevated fill (`.btn`, `.pill`/`.badge` on tone, `.chip`, status dots, brand tiles, accent buttons), sample fg vs bg pixels and compute WCAG ratio; warn/fail when foreground equals/near-equals its background (the "ember-on-ember" sin) or < threshold. Keep `--fg-subtle/--fg-faint` token tiers advisory. Start advisory; graduate `gate` to `block` once clean. Satisfies `C-contrast-fill`.
7. **`scripts/check-slop.mjs`** — consolidated anti-AI-slop lint over `src/ds/**` + `packages/ui/src/**/*.tsx`: emoji feature-icons (U+1F300+ inside `<h*>/<button>/<li>/[class*=icon]`), invented-metric regex, filler strings, placeholder-CDN hosts, hardcoded `font-family` outside `var(--font-*)`. `advisory` gate (warns, doesn't block — these are review tells). Satisfies `C-no-slop`.
8. **`scripts/check-contract.mjs`** — validate `eidos.contract.json` against `eidos.contract.schema.json`; assert `dsVersion` == `src/lib/site.ts` `DS_VERSION`; assert every clause `verifier` resolves to a known script or `EXT:<npm-script>`. Satisfies `C-contract-valid`. The contract can never silently drift from the verifier set.

### 2.2.5 Registry-sync end-state (the real fix, not the checksum)

> The checksum (`C-registry-sync`) ships **first** as an interim gate. The end-state, per the settled architecture, is to **delete the manual `packages/registry/src/forge/*` copies** and have `build-registry.mjs` inline `files[].content` **directly from the canonical `@eidos/ui` source** (resolving grouped-barrel exports via `surfaces.exportFile`). When that lands, `C-registry-sync` collapses to "the inlined content equals the live source at build time," and drift becomes structurally impossible. Track this as the registry surface's exit condition.

> **Stop re-proposing:** lede length, typography scale, protect-generated, nav integrity, frame parse, tsc gate, gen-props, DTCG export, visual regression, CI jobs — **already done**. This upgrade only *aggregates* and *fills the parity/structure/story/contrast/registry gaps*.

---

## 3. The aggregate gate — `npm run eidos:verify`

Author **`scripts/eidos-verify.mjs`**, wired as `"eidos:verify": "node scripts/eidos-verify.mjs"`. It is the **single aggregation layer the harness is missing** — and the only thing that may declare "Done."

**CLI surface:**
```
eidos:verify [--component <slug> | --all] [--surface docs|export|story|registry|cross|tokens] [--clause C-id] [--strict] [--dry] [--json] [--fix]
```
- Runs `check-contract` first, then reads `eidos.contract.json`. For each in-scope component × applicable clause (`appliesTo`), it imports the clause verifier's `run({component})` and executes it **once**, memoizing per-route checks so render/a11y/visual/contrast run per page, not per clause. `EXT:<npm-script>` clauses shell out and parse exit code/JSON. `--dry` resolves & prints the plan without executing. `--fix` runs only the safe generators (`gen-*`) then re-verifies — it never edits component logic.
- Applies **waivers**: a failing clause with a matching non-expired waiver becomes status `waived` (never green).
- Emits **`reports/state.json`** keyed `component → clause → { status: pass|partial|fail|waived, gate, detail }`, plus a top-level surface roll-up.
- **Exit code: nonzero iff any `gate:"block"` clause is `fail`** (not `waived`) for an in-scope component. `advisory` failures are reported, never block.
- Regenerates **`EIDOS-HEALTH.md`** from `reports/state.json` on every full run (§5).

**Phase handoffs are `reports/state.json` slices, not prose** (graft from C3): every workflow phase and every parallel builder passes a machine-readable `state.json` slice + the per-component clause map — never an English summary. Each phase's exit gate is a **script exit code**.

**`reports/state.json` shape:**
```jsonc
{
  "contractVersion": "1.0.0",
  "dsVersion": "1.28.1",
  "commit": "<sha>",
  "generatedAt": "2026-05-30T00:00:00Z",
  "summary": { "components": 49, "done": 41, "blockFails": 0, "waived": 3, "advisoryFails": 7 },
  "surfaces": { "docs": 0.94, "export": 1.0, "story": 0.78, "registry": 0.86 },
  "components": {
    "pill": {
      "kind": "component", "ds": "core", "status": "fail",
      "clauses": {
        "C-docs-sections": { "status": "pass",   "gate": "block" },
        "C-rtl-frame":     { "status": "pass",   "gate": "block" },
        "C-story":         { "status": "fail",   "gate": "block", "detail": "no CSF3 story at stories/primitives/Pill.stories.tsx" },
        "C-autopropstable":{ "status": "waived", "gate": "block", "detail": "waiver: external wrapper, hand table reviewed (expires 2026-09-30)" },
        "C-contrast-fill": { "status": "pass",   "gate": "block" }
      }
    }
  }
}
```

A component is `done` ⇔ every applicable clause is `pass` **or** `waived`. `fail` on a surface-existence clause ⇒ `broken`; otherwise `partial`.

CI: in the existing `docs` job, replace the loose per-step checks with one blocking `npm run eidos:verify -- --all --strict` step (keep the UI / registry-CLI / Storybook jobs as-is). Then run `npm run eidos:health`. **Upload `reports/state.json` + `EIDOS-HEALTH.md` as CI artifacts** (graft from C3). Local `Stop` hook runs `--component <slug>` (§6).

---

## 4. Contract-driven scaffold — every new component starts parity-complete

### 4.1 Upgrade `.claude/skills/new-component`

Today `new-component` emits **only** the docs page. Rewrite it (and/or add `scripts/eidos-gen.mjs`) to emit **all four surfaces at once**, with slots defined by the contract:

1. `src/ds/migrated/<ds>/<slug>.tsx` — full DS-PAGE-STANDARD skeleton seeded from `buttons.tsx` (gold ref): every required `<SubHead meta>` incl. `a11y`, the RTL `<Frame dir="rtl">`, the `.ana`/`.ana-list` anatomy stub, `.dd-grid`, `<AutoPropsTable component="…"/>`.
2. `packages/ui/src/<comp>.tsx` (or insert into the correct grouped barrel) — typed stub composing `.ds-*` classes; **add to the `packages/ui/src/index.ts` barrel** (this is a shared file — use the **single-integrator pattern** from `_promote-batch.js`, never parallel barrel edits, never git-worktrees-per-component; the shared barrel/`ds.css` would conflict).
3. `packages/ui/src/stories/<group>/<Comp>.stories.tsx` — CSF3 `Meta`/`StoryObj`, `tags:['autodocs']`, one story per variant + a States story, theme + RTL decorators.
4. `packages/registry/registry.json` entry (correct `$schema`, `registryDependencies`, `files[].source→target`) + run `build-registry.mjs` → `public/r/<slug>.json`.
5. Append the component to `eidos.contract.json` `components[]` with its four `surfaces` bound (incl. `exportFile`/`registrySrc`), then run `eidos:verify --component <slug> --dry` to confirm the slots resolve.

### 4.2 `eidos gen` CLI (`scripts/eidos-gen.mjs`)

`eidos gen component <slug> --ds <core|charts|ai|idp|patterns|mobile|blocks>` → emits the 4 stubs above. `eidos gen contract --sync` → rebuilds `components[]` from what actually exists on disk (so the contract self-heals as a backstop, but the scaffold is the happy path). Keep skills (not plop/turbo gen) as the mechanism — no new codegen dependency.

### 4.3 Done = green gate (encode this everywhere)

> A component is **Done iff `npm run eidos:verify -- --component <slug> --strict` exits 0.** The verifier's green beats any agent's opinion. Reviewers and builders never self-certify.

---

## 5. `EIDOS-HEALTH.md` — the generated health wall

Generated by `eidos:verify` (and the standalone `"eidos:health": "node scripts/eidos-health.mjs"`) from `reports/state.json`; **never hand-edited** (add it to `protect-generated.mjs`). Shape:

```md
# Eidos component health  ·  contract 1.0.0  ·  DS 1.28.1  ·  <commit>  ·  generated 2026-05-30
41 / 49 done · 0 block-fails · 3 waived · 7 advisory-fails

| Component | Docs | Export | Story | Registry | A11y | RTL | Sect | Contrast | Status |
|-----------|:----:|:------:|:-----:|:--------:|:----:|:---:|:----:|:--------:|:------:|
| pill      |  ✅  |   ✅   |  ❌   |    ✅    |  ✅  | ✅  |  ✅  |    ✅    |  ✗     |
| tree-view |  ✅  |   ✅   |  ✅   |    ✅    |  ✅  | ✅  |  ✅  |   〰waived |  ✓     |
| button    |  ✅  |   ✅   |  ✅   |    ✅    |  ✅  | ✅  |  ✅  |    ✅    |  ✓     |

(✅ pass · ❌ block-fail · ⚠ advisory-fail · 〰 waived)

## Debt (block-fails first, then advisory; auto-ranked: fewest clauses to green first)
- pill · C-story (block): no CSF3 story → run `eidos gen` story stub / `restructure-component pill`
- …

## Waivers (reviewed exceptions; * = expiring within 30 days)
- tree-view · C-autopropstable — external wrapper, hand table reviewed (expires 2026-09-30)

## Per-surface coverage
docs 94% · export 100% · story 78% · registry 86%
```

---

## 6. Hooks & settings — adapt the real `.claude/settings.json`

Add the **`Stop` hook** (the genuinely missing gate) and one PreToolUse no-page-style block. **Keep the real PreToolUse matcher `Edit|Write|MultiEdit`** — do NOT narrow it to `Edit|Write` (that would weaken the existing `protect-generated` guard). Keep everything else.

```jsonc
// .claude/settings.json — additions only
"permissions": {
  "allow": [ /* …existing… */,
    "Bash(npm run eidos:verify:*)", "Bash(npm run eidos:health)",
    "Bash(npm run registry:build)", "Bash(npm run sb:build)", "Bash(npm run check:*)", "Bash(npm run gen:*)" ]
  // git push / npm publish / gh pr create stay on ASK; secret reads + rm -rf stay DENIED
},
"hooks": {
  "PreToolUse": [
    { "matcher": "Edit|Write|MultiEdit", "hooks": [
      { "type": "command", "command": "node .claude/hooks/protect-generated.mjs" },   // EXISTING — also add EIDOS-HEALTH.md, reports/state.json, public/r/* to its blocklist
      { "type": "command", "command": "node .claude/hooks/typography-scale.mjs" },    // EXISTING — lede check elevated to BLOCK (now owned by C-lede)
      { "type": "command", "command": "node .claude/hooks/no-page-style.mjs" }        // NEW — blocks <style>/inline color-size styles in src/ds/migrated/** + packages/ui/src/**/*.tsx; whitelists the 3 CSS token files
    ]}
  ],
  "Stop": [
    { "hooks": [
      { "type": "command", "command": "node .claude/hooks/verify-on-stop.mjs" }       // NEW — runs eidos:verify for touched components; non-zero blocks finishing on a red gate
    ]}
  ]
  // SessionStart (session-context) and PostToolUse (format-edited, matcher Edit|Write|MultiEdit) unchanged
}
```

- **`.claude/hooks/no-page-style.mjs`** (PreToolUse) — fast in-edit twin of `check-no-page-style.mjs`; **exit 2 blocks** when the edit introduces `<style>` or inline color/size/spacing in a migrated/ui `.tsx`. Whitelists `tokens.css`/`ds.css`/`ai.css`. Message: "Compose a `.ds-*` class or extend `tokens.css`; no per-page style." Do **not** make it a blanket hex/px ban.
- **`.claude/hooks/verify-on-stop.mjs`** (Stop) — derive touched components from the session's edited files (`git diff --name-only`), run `eidos:verify --component <each> --strict`; if any `block` clause fails, return the failing clause list so the model must fix before ending. Scope to changed components only (cheap).
- **Elevate `typography-scale.mjs`**: the lede check moves from warn-only to **block** (now formally owned by clause `C-lede`); keep the off-scale-font warning but route known offenders through the contract's waivers rather than the hardcoded BANNED set.
- **`session-context.mjs`**: stop restating enforceable invariants; instead inject "the bar is `eidos.contract.json`; a component is Done iff `eidos:verify` is green" + the current `reports/state.json` summary line.

---

## 7. Storybook → enterprise-grade (the story becomes the canonical demo)

The end-state: the **story is the single source of the live demo**, so docs-page `Frame` code-strings *derive from* stories and can't drift. Steps:

1. **Add `@storybook/addon-a11y`** to `apps/storybook/.storybook/main.ts` (component-isolation a11y, complementing route-level `check-a11y`) and the **`@storybook/test-runner`** (`sb:test`) → wire `C-story-a11y`.
2. **Autodocs everywhere**: `tags: ['autodocs']` in `preview.ts`; `check-stories.mjs` requires it; argTypes infer from the TS prop types (already the source via `gen-props`).
3. **Theme matrix = {dark, light} × {ltr, rtl}** using the existing `preview.ts` theme + RTL decorators — NOT multi-accent (single ember accent stays invariant). `check-stories.mjs` asserts a story renders in all four; `check-visual.mjs` can shoot per-story once coverage is complete.
4. **Taxonomy lock**: story `title` must match its `stories/<group>/` folder against `preview.ts` `storySort.order`, which `check-stories.mjs` **reads from `preview.ts`** (the real order: `Introduction → Primitives → Forms → Elements → Blocks → Overlays → Device → AI → Icons → Docs`; **no Charts group** — never hardcode the list). Prevents orphaned sidebar entries.
5. **N-stories-per-variant**: `C-story-matrix` (advisory) counts variant×state stories; close the gaps via `restructure-component` / `promote-batch`.
6. **Derive-don't-duplicate** (graft from C2 + C3): add `scripts/gen-frame-from-story.mjs` (or extend `gen-migrated`) so a docs `<Frame>` marked `// @eidos-frame:<storyId>` **emits its code-string from the story's source**. `check-frame-code.mjs` then upgrades from "parses" toward **"snippet ≡ story source"** (`C-frame-parses`), killing *structural* drift, not just parse drift. Make the CSF3 story the canonical demo; the docs `<Frame>` derives from it.
7. **Behavior (roadmap, not v1 contract):** Storybook `play()` interaction tests for the few logic-heavy components (Combobox, Calendar, Select) — add as a future `C-story-play` clause; do **not** introduce a blanket vitest coverage %.

---

## 8. Phases & exit gates (each gate is a script exit code, not prose)

Thread the contract through the **existing multi-agent workflows** (graft from C3) — don't invent a parallel program. Every phase handoff is a `reports/state.json` slice; every exit gate is an exit code.

| Phase | Work | Mechanism (existing/new) | **Exit gate** |
|---|---|---|---|
| **0 · Spine** | Author `eidos.contract.schema.json` + `eidos.contract.json` + `docs/ds-page-standard.json` + `check-contract`; bind existing scripts to clauses; repoint `gen-tokens` source | new files | `npm run eidos:verify -- --all --dry` resolves every clause to a runnable verifier; `check-contract` passes (`dsVersion` == `site.ts`) |
| **1 · Audit** | Build `components[]` + parity matrix | `consolidation-audit` skill → `eidos gen contract --sync` | `reports/state.json` exists; `EIDOS-HEALTH.md` renders |
| **2 · New verifiers + aggregate** | Author the 8 new scripts + 2 new hooks; refactor existing `check-*` to export `run()`; extend `check-nav`/`check-frame-code`/`gen-tokens` | §2.2, §6 | `eidos:verify --all` runs all clauses (block + advisory) and emits per-component clause results |
| **3 · Hooks & CI** | Add `no-page-style.mjs` (Pre) + `verify-on-stop.mjs` (Stop); CI `docs` job runs `eidos:verify --all --strict` + `eidos:health`, uploads artifacts; thin `CLAUDE.md` | §6 | CI green; hooks fire locally on a deliberate violation |
| **4 · Close block-fails** | Fix the ~38 structural a11y bugs (switch labels, scrollable-region focus, aria-prohibited-attr), missing RTL frames, page-style, sections | `restructure-component`, `ds-a11y-rtl-review` | `eidos:verify --all --strict` exits 0 on `block` clauses |
| **5 · 4-surface parity** | Promote docs-only patterns; add missing stories/registry items; CLI dep-guard (§9) | `promote-batch`, `restructure-component` (each ends green) | `check-4-surface-parity --strict` clean; `surfaces.story ≥ target` |
| **6 · Storybook enterprise** | addon-a11y, test-runner, autodocs, theme matrix, taxonomy lock, `gen-frame-from-story` | §7 | `check-stories --strict` clean; `sb:test` green; story-derived Frames in place |
| **7 · Registry end-state** | Inline `build-registry` from canonical source; delete `src/forge/*` copies | §2.2.5 | `C-registry-sync` collapses to build-time equality; no manual copies remain |
| **8 · Capstone** | Full adversarial audit + gate + git-tag the release | `capstone-audit` skill, `/release` (+ `git tag vX.Y.Z`) | `eidos:verify --all --strict` green; CI green; `EIDOS-HEALTH.md` ≥ target %; tag pushed |

---

## 9. Registry/CLI install made first-class

- **`check-registry.mjs`** (`C-registry`/`C-registry-sync`) — see §2.2.5; ships the interim checksum, drives toward inline-from-source.
- **CLI dep-completeness guard** (graft from C3) — in `packages/cli/src/index.mjs` `cmdAdd`, **after `resolveGraph`**, assert that all transitive `registryDependencies` are satisfied before writing files (error if `pill` is added but `icons` is absent; keep the existing cycle-detection at resolution time). Add a unit case to `packages/cli/test/`. Wired to `C-cli-install` via `EXT:cli:test`.
- **`/release`** also `git tag vX.Y.Z` after bumping `DS_VERSION` (consumer pin/diff; already recommended in `docs/DISTRIBUTION.md`) **and** sets `eidos.contract.json.dsVersion` to match (asserted by `check-contract`). **No changesets.**

---

## 10. Subagents, commands, CLAUDE.md

- **Add reviewer agent `.claude/agents/contract-verifier.md`** — clean isolated context, **runs only `eidos:verify` and reports clause-by-clause from `reports/state.json`**; never edits, never self-certifies. Builder agents (`design-system-engineer`, `frontend-engineer`) do the fixes. Bind the existing `_promote-batch` single-integrator pattern for all shared-file edits (`index.ts` barrel, `ds.css`) — do **not** use git worktrees.
- **`/verify` command** → `eidos:verify --component <slug> --strict` then prints the `EIDOS-HEALTH` row. **Update `/verify-routes`** to call `eidos:verify --surface docs`. **Add `/eidos-health`** = `eidos:verify --all` then surface the `EIDOS-HEALTH.md` debt table. **Update `/release`** per §9.
- **Thin `CLAUDE.md` (judgment only).** Remove every enforceable invariant that is now a clause (no-page-`<style>`, lede budget, section order, a11y/RTL/anatomy/Do-Don't/AutoPropsTable presence, 4-surface parity, off-scale fonts) and replace with: *"The bar is `packages/registry/eidos.contract.json`. A component is Done iff `npm run eidos:verify -- --component <slug> --strict` exits 0 — the green gate beats your opinion. Non-negotiables (contrast, ember-2×, Geist, logical CSS, source-shipped, CSS-authored tokens) are enforced by hooks + verifiers; obey, don't restate. Use judgment only for what no test can decide: voice, density, hierarchy, when to consolidate vs promote, when to add a component."* Keep the DS-family map, the dev/restart footguns, the routing ritual, and pointers to `eidos.contract.json` / `DS-PAGE-STANDARD.md` / `DESIGN.md` / `PROJECT-LOG.md`.
- **Back-fill `docs/adr/` lightly** for the big settled calls (source-shipped distribution; CSS-authored tokens; no-cva class composition; single ember accent) so contract clauses can cite an ADR — but `PROJECT-LOG.md` already records them, so this is low priority.

---

## 11. Guardrails — do NOT do these (they contradict shipped decisions)

- ❌ cva / Tailwind-for-components / shadcn primitives — Eidos composes `.ds-*`/`.ai-*` + `var(--token)`. (cva is a root/transitive dep; never import it into a component.)
- ❌ A blanket "ban all hex/px" regex — it would flag the **token source** (`tokens.css`/`ds.css`/`ai.css`). Scope checks to `migrated/**` (page chrome) and `ui/src/**/*.tsx`; whitelist the 3 CSS files.
- ❌ Style-Dictionary-as-source — tokens are **CSS-authored**, exported to DTCG by `gen-tokens`.
- ❌ Changesets / published-package model — distribution is **source-shipped**; only git-tag per `/release`.
- ❌ MDX docs, per-component `index/.tsx/.stories/.test/.mdx` folders, pnpm, the 6-package split, Figma linkage, multi-accent theming, the name "Eidos".
- ❌ Assuming `packages/registry/src/forge/<comp>.tsx == packages/ui/src/<comp>.tsx` by filename — many exports live in grouped barrels; bind via the explicit `surfaces.exportFile` mapping.
- ❌ Hardcoding the Storybook `storySort.order` list or a "Charts" story group — read it from `preview.ts`.
- ❌ Narrowing the PreToolUse matcher to `Edit|Write` — keep `Edit|Write|MultiEdit`.

---

## 12. Acceptance criteria for THIS upgrade

1. `packages/registry/eidos.contract.json` + `eidos.contract.schema.json` + `docs/ds-page-standard.json` exist; the contract validates against the schema; `dsVersion` == `site.ts`; every clause names a runnable verifier; waivers carry a non-empty reason and optional expiry.
2. `npm run eidos:verify -- --all --strict` runs all clauses (memoized per route), emits `reports/state.json` with `pass|partial|fail|waived` per clause, regenerates `EIDOS-HEALTH.md`, and exits nonzero only on `block` fails (waived ≠ fail).
3. The 8 new scripts + 2 new hooks exist and are bound to clauses; existing `check-*` export `run()`; CI's `docs` job calls `eidos:verify --all --strict` + `eidos:health` and uploads `reports/state.json` + `EIDOS-HEALTH.md`; the `Stop` hook blocks finishing on a red gate; the PreToolUse matcher remains `Edit|Write|MultiEdit`.
4. `new-component` / `eidos gen` emit all 4 surfaces so a new component starts parity-complete; the CLI dep-completeness guard + test exist.
5. `gen-tokens` reads the canonical `packages/ui/styles/tokens.css` (or asserts parity with the legacy path); the registry-sync gate binds via `surfaces.exportFile`, with the inline-from-source end-state tracked.
6. **No** cva-in-components, Style-Dictionary-as-source, changesets, MDX, pnpm, shadcn primitives, multi-accent theming, or Figma linkage was introduced. `tokens.css` remains the token source; distribution remains source-shipped.

> Build the spine first (Phase 0). Everything else derives from it. When in doubt: **if it must be true every time, make it a clause with a verifier — not a paragraph.**
