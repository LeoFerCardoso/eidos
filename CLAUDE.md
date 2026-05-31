# forge-ds — session rules (read first)

This repo holds **two** things: a runnable **Forge Design System app** (Next.js App
Router) and an LLM **engineering harness** under `.claude/`. Know which one a request
is about.

## The component contract is the bar (read this first)

A Forge component is **Done** iff `npm run forge:verify -- --component <slug> --strict`
exits 0 — the green gate beats any opinion; reviewers and builders never self-certify. The
single machine-readable definition of "Done" is **`packages/registry/forge.contract.json`**
(+ `forge.contract.schema.json`), spanning a component's **four surfaces**: the docs page
(`src/ds/migrated/**`), the `@forge/ui` export (`packages/ui/src`), the Storybook story
(`packages/ui/src/stories`), and the registry item (`packages/registry` → `forge-ui add`).
Each clause maps to a deterministic verifier in `scripts/` (the existing `check-*`/`gen-*`
plus `check-ds-page-structure`, `check-4-surface-parity`, `check-stories`, `check-registry`,
`check-no-page-style`, `check-slop`); `scripts/forge-verify.mjs` aggregates them and writes
`reports/state.json` + the generated **`FORGE-HEALTH.md`** wall. `npm run gen:contract`
re-syncs the bindings from disk.

The non-negotiables below (contrast, ember-2×, Geist, logical CSS, no per-page `<style>`,
the fixed type scale, source-shipped distribution, CSS-authored tokens) are enforced by
**hooks + verifiers** — obey, don't restate. Use judgment for what no test can decide:
voice, density, hierarchy, when to consolidate vs promote, when a new component is warranted.
Commands: `/forge-verify`, `/forge-health`. Reviewer agent: `contract-verifier`. Full upgrade
spec: `HARNESS-IMPROVED.md`.

## Running / editing the DS app

- Run: `npm install && npm run dev` → <http://localhost:3000> opens the **Introduction**.
- The DS pages are **idiomatic TSX** under `src/ds/migrated/<slug>.tsx` — each is a
  `'use client'` module with a `default export` that imports its primitives from
  `@/ds/core`. They render inside the persisted `(ds)` DocsShell via `DSPageLoader`,
  which resolves the page from the generated `MIGRATED` registry (SPA: only the right
  column swaps). Compiles with **SWC** — there is **no `.babelrc`** and no `window`
  bridge anymore. (Bodies were ported near-verbatim from the original Open Design JS;
  keep JSX text valid for SWC — escape a literal `>` as `{'>'}`.)
- **Forge is a FAMILY of design systems** sharing one base. Registry:
  `src/ds/core/design-systems.js` (`DESIGN_SYSTEMS`) — **core** (root: `/`, `/color`,
  `/buttons`), **charts** (`/charts/*`), **ai** (`/ai/*`), **idp** (`/idp/*`),
  **patterns** (`/patterns/*`), **mobile** (`/mobile/*`). The sidebar header is a **DS
  switcher**; the nav is scoped to the active DS. Sub-DSs **only add** domain components —
  tokens, primitives, and the ember accent always come from **core**.
- **Source of truth for routes** is `src/ds/core/nav-config.js` (groups tagged by DS via
  `ds:`/`GROUP_DS`; read by `scripts/gen-nav.mjs` → `src/lib/nav.ts`:
  `DESIGN_SYSTEMS`/`NAV`/`NAV_BY_DS`/`NAV_FLAT`). Adding/renaming a page: (1) add it to the
  right **DS section** in `nav-config.js`, (2) add `src/ds/migrated/<slug>.tsx` (core) or
  `src/ds/migrated/<ds>/<slug>.tsx` (sub-DS) — default export, imports from `@/ds/core`;
  the gen scripts (`gen-nav`/`gen-migrated`/`gen-examples`, recursive) auto-run on
  `dev`/`build`. **Restart `next dev` after nav/DS changes** (`generateStaticParams` is read
  once at start; `dynamicParams=false` → new routes 404 until restart). Standalone IDP
  examples live at `src/ds/examples/<name>.tsx` (default export, full-screen at
  `/example/<name>` via `ExampleLoader`).
- **Every DS page follows ONE section standard — `docs/DS-PAGE-STANDARD.md` (canonical
  anatomy + vocabulary; read before authoring/editing any page).** Component pages (Components,
  AI, IDP, Charts, Mobile): `Installation → Usage → Variants/Sizes/States → [In context] →
  Accessibility → RTL → Anatomy → Do/Don't → API reference`; Foundations use the foundation
  template (`Scale/Roles → In practice → Principles → Accessibility & pairings → Do/Don't →
  Tokens`); each sub-DS also has an Introduction-style **Overview** (`DsOverview`) + its own
  **Changelog** (`migrated/<ds>/changelog.tsx` via the shared `ChangelogView`). `buttons.tsx`
  is the **gold reference**. **Required on every page:** a sharp ≤3-line header lede; an
  **Accessibility** section (`<SubHead meta="a11y">`, real keyboard/ARIA/contrast/reduced-motion);
  a **visual Anatomy** — the component rendered in `.ana > .stage` with numbered `.pin`s + dashed
  `.lead` connectors + a numbered `.ana-list` legend (never a prose list); and **Do/Don't**
  (`.dd-grid`). New pages start from the `component-page` / `new-page` skills, which encode this.
- `src/ds/core/*` is a plain ES-module component layer (`icons`/`atoms`/`primitives`/
  `blocks`/`charts`/`mocks`); `index.ts` is just a barrel (`export *`). No `window`, no
  load-order side-effects — the package is marked `sideEffects: ["*.css"]` so the barrel
  tree-shakes (recharts only ships in chart-page chunks).
- Styling: `src/styles/tokens.css` + `ds.css` are the design system. **Never** write
  per-page `<style>`; compose existing classes or extend those files.

### Forge invariants (every DS artifact)
- **Contrast is non-negotiable.** Any foreground (text, icon, brand mark, value)
  placed on a colored/elevated surface MUST get an explicitly contrasting color —
  never let it inherit or keep a color equal/near-equal to its background. On an
  **ember/accent fill** the foreground is **dark ink** (`#08090A` / `var(--bg)`),
  never ember; dark surface → light fg; light surface → dark fg. Applies to brand
  tiles, badges/pills on accent, buttons, chips, avatars, icon buttons, status dots,
  charts — everything layered on a non-default background. When unsure, verify the
  rendered result (headless screenshot) before declaring done.
- Single accent **ember `#FF6B35`** (`var(--accent)`), at most 2× per screen.
- **Geist Sans** (UI/body) + **Geist Mono** (numerics, captions, eyebrows).
- Compose, never reinvent. Logical CSS properties everywhere (RTL is first-class).
- Anti-AI-slop is a mandatory checklist (see `.claude/craft/anti-ai-slop.md`).

The full technical catalog is `FORGE-DS-REFERENCE.md` + `llms.txt` (read before
authoring DS pages). Page-section standard: `docs/DS-PAGE-STANDARD.md`. DS-family
architecture: `docs/MULTI-DS-ARCHITECTURE.md`. Colour model + roadmap:
`docs/COLOR-SYSTEM-PROPOSAL.md`. Original authoring notes: `docs/FORGE-DS-AUTHORING.md`.
**What exists today + the full timeline of decisions is in `.claude/Memory/PROJECT-LOG.md`**
(read it at the start of a new session to know the current state — what's built, the
conventions, and why). The live page inventory is `src/ds/core/nav-config.js`.

## Using the harness (designing new artifacts)

When the task is "design / build / prototype" UI (not editing the DS app itself):

1. Pick the skill in `.claude/skills/` that matches the artifact (all are Forge-native and
   on-mission; they auto-trigger).
2. Read the canonical brand: `.claude/design-systems/forge/DESIGN.md`.
3. Read only the `.claude/craft/` sections the skill needs.
4. Follow the skill's workflow (build in the repo) and run its checklist (including
   anti-ai-slop) before finishing.

There is **no daemon** here (unlike Open Design): you read these files manually, and
the "auto-checked" craft rules become a manual checklist. See `.claude/README.md`.

## The Claude Code harness (`.claude/`)

The harness lives **entirely in `.claude/`** — Claude Code discovers `agents/`, `skills/`,
`commands/`, `hooks/`, `output-styles/`; the reference content (`design-systems/forge/`,
`craft/`) sits alongside and is read by path. Map in `.claude/README.md`:

- **Subagents** (`.claude/agents/`): `web-project-lead`, `frontend-engineer`,
  `design-system-engineer`, `ux-designer`, `ai-feature-architect`, `ai-sdk-engineer`,
  `code-reviewer`, `performance-optimizer`. They auto-delegate by task; the lead plans
  and routes to specialists.
- **Skills** (`.claude/skills/`): all Forge-native, all on-mission (DS / DevEx / IDP / AI).
  DS workflow — `new-component`, `new-page`, `refine`, `portal-scaffold`,
  `ds-component-authoring`, `ds-a11y-rtl-review`; DS/IDP artifacts — `component-page`,
  `idp-screen`, `dashboard`, `live-dashboard`, `docs-page`; design process — `critique`,
  `tweaks`, `wireframe-sketch`, `design-brief`; AI platform — `ai-agent-scaffold`,
  `ai-streaming-route`, `ai-chat-ui`, `ai-generative-ui`, `ai-gateway-setup`; plus
  `_template`. All read `.claude/design-systems/forge/DESIGN.md` + `.claude/craft/*`.
  (Off-mission Open Design skills — decks, posters, social, video, marketing, mobile,
  business docs — were removed, not archived.)
- **Commands** (`.claude/commands/`): `/commit`, `/open-pr`, `/release`, `/verify-routes`.
- **Hooks** (`.claude/settings.json` + `.claude/hooks/`): SessionStart injects the Forge
  invariants; PreToolUse blocks hand-edits to the generated manifest and warns on
  `tokens.css`/`ds.css`; PostToolUse formats edited files if a local formatter exists.
- **Permissions** (`.claude/settings.json`): safe `npm`/`git`/read commands allowed; `git
  push`/`npm publish`/`gh pr create` ask; secret reads + `rm -rf` denied.
- **MCP** (`.mcp.json`): Vercel.
- **AI reference**: `app/ai-chat/` + `src/lib/ai/` — a working AI SDK v6 chat-with-agents
  (tool calling + streaming) the `ai-*` skills point to.
- **Distribution**: `npm run build:plugin` packages `.claude/` into
  `plugin/forge-harness/` (marketplace at `.claude-plugin/marketplace.json`) so teammates
  install the harness in one step.
- **Automation**: scheduled routines + loops in `docs/ROUTINES.md`; CI in
  `.github/workflows/ci.yml`.

Gap analysis & roadmap: `docs/HARNESS-GAP-ANALYSIS.md`.
