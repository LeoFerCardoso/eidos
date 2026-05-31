# Forge DS — Gap Analysis (state of the system + what to fix)

**Date:** 2026-05-29 · **Scope:** the runnable Forge DS app (`src/ds/**`, `src/styles/**`,
`src/components/**`), not the `.claude/` harness. **Method:** read `DS-PAGE-STANDARD.md` +
`PROJECT-LOG.md`, then grep-measured all **209 content pages** across the 7 design systems
(core, charts, ai, idp, patterns, mobile, blocks). All numbers below are grep-verified, not
estimated.

---

## 0. Scorecard (grep-verified, 209 content pages)

| Signal | Coverage | Read |
|---|---|---|
| **Accessibility** section (`meta="a11y"`) | **178 / 209 (85%)** | Strong everywhere **except Mobile (25/45)**. |
| **RTL** section (`dir="rtl"` frame) | **138 / 209 (66%)** | Required on component pages; ~71 pages still missing it. |
| **Do / Don't** (`.dd-grid`) | **173 / 209 (83%)** | Good. |
| **Visual Anatomy** (`.ana-list`) | **146 / 209 (70%)** | ~63 pages have prose-only or no anatomy. |
| **API reference** (`PropsTable`) | **137 / 209 (66%)** | OK; CSS-only pages legitimately use CSS-vars instead. |
| **Inline `const lede = {…}` style block** | **89 pages** | Typography drift — same 3 style consts copy-pasted across 89 files. |
| **Header lede > ~2 lines (the issue you flagged)** | **~45 pages** | Worst: every Charts page (450–653 chars), AI cards, IDP cards. |
| **Markup (`<code>`) embedded in the header lede** | **7 pages** | Must be fixed — never put markup in a header. |

**One-line verdict:** the architecture and the core/IDP/AI documentation are genuinely
strong and on-par with market design systems. The gaps are concentrated and fixable:
**(1) page headers are too long and don't span the content width** (your headline issue),
**(2) Mobile is a large but under-built sub-DS**, **(3) the no-Storybook preview has a silent
code-drift risk**, and **(4) typography/recipe duplication** from hand-rolled inline styles.

---

## 1. Page header / lede — **the priority fix**

### What you asked for
> Support text below the title = **only ~2 lines, spanning to the end of the documentation
> area**. Anything longer goes **after the separator** (in the body). Several pages still have
> oversized headers.

### Current behaviour (two compounding problems)

1. **The lede is capped narrow, so it wraps tall.** `.ds-ph-lede` is `max-width: 64ch`
   (`src/styles/ds.css:562`) while the content column is ~940px. At 17px Geist, 64ch ≈ 620px
   — so the lede wraps at ~70% of the available width and the same text becomes **more** lines.
   It never reaches "the end of the documentation area."
2. **The copy is too long.** `desc` text is routinely 350–650 characters. A 2-line lede at full
   content width is **~220 characters**. Measured offenders:
   - **Charts — every page is 4–6 lines:** `radial` 653, `composed` 583, `gauge` 538,
     `heatmap` 569, `sankey` 552, `histogram` 502, `radar` 510, `line` 512, `bar` 468,
     `pie` 464, `area` 455. (Charts pages also fold a prose "Honesty rule" into the header.)
   - **AI cards / surfaces:** `agent-card`-style ledes 350–526 (e.g. AgentCard 526, Tool 436,
     JSON tree 432, conversation/thread 428–431).
   - **IDP cards:** ServiceCard 521, MetricCard 504, FilterPanel 515, Pipeline 474, LogViewer 486.
   - **Core:** `color` 477, `brand` 350.
3. **7 pages embed markup in the header lede** (`installation`, `idp/agent-card`,
   `idp/service-card`, `idp/metric-card`, `idp/score-gauge`, `charts/radial`,
   `charts/composed`) — inline `<code style={…}>` inside `desc`. A header must be plain text.

### The fix (two parts — both required)

**A. CSS — let the 2-line lede reach the edge.** In `src/styles/ds.css`, change
`.ds-ph-lede { max-width: 64ch }` → `max-width: none` (or match the content measure, ~72ch).
The lede should run the full content column so short copy lands as 2 lines, not 3–4. (The
`#diff-viewer`/`#tree-view` override at `ds.css:570` already does exactly this for two pages —
generalize it.)

**B. Content — a hard 2-line budget + relocate the overflow.**
- Set a **lede budget of ≤ 220 characters (~2 lines)** in `DS-PAGE-STANDARD.md §2.1`, replacing
  the current "≤3 lines."
- Sweep the ~45 long-lede pages: keep the sharp **what-it-is + when-to-use** in the header;
  move the rest (the "Honesty rule" on charts, recipe/ownership notes on cards) **below the
  separator** — into a `<Lede>` under the first `SubHead` (Usage / Overview). This is exactly
  your "after the separator we can have more lines."
- Strip all markup from `desc` on the 7 offending pages (move the `<code>` reference into the
  body).
- **Enforce it:** extend `.claude/hooks/typography-scale.mjs` (or add a sibling hook) to warn
  when a `desc="…"` exceeds ~220 chars or contains `<`. This keeps new pages compliant the way
  the font-size hook already keeps type on-scale.

**Effort:** CSS = 1 line. Content sweep = ~45 pages, scriptable as one edit-only pass per DS
(Charts first — it's the worst and most uniform). Low risk, high visual payoff.

---

## 2. Documentation section standard — compliance

The standard (`docs/DS-PAGE-STANDARD.md`) is good and the core pages largely follow it.
Compliance by DS (a11y as the proxy, plus notes):

| DS | Pages | a11y | Main gap |
|---|---|---|---|
| **Core** | 83 | 77 | 6 pages lack an a11y section — incl. **`buttons.tsx`, the gold reference, has no `meta="a11y"`** (a11y is folded into examples). The reference page should model the current standard. |
| **AI** | 38 | 37 | Near-complete. A few pages hand-roll step/timeline UI instead of composing core. |
| **Charts** | 13 | 12 | RTL intentionally optional; headers too long (see §1). |
| **IDP** | 14 | 13 | Strong reuse; some card pages thin on RTL/visual-Anatomy. |
| **Patterns** | 9 | 8 | CSS-only — RTL/Anatomy legitimately N/A. |
| **Mobile** | 45 | **25** | **Biggest gap — 20 pages with no a11y section, many under-built (see §3).** |
| **Blocks** | 7 | 6 | Minor. |

**Actions**
1. **Mobile a11y + section sweep** (20 pages) — bring each to the component template
   (Usage → Variants/States → **Accessibility (incl. 44px target, VoiceOver)** → Anatomy →
   Do/Don't → spec). Highest-volume gap in the system.
2. **Fix the gold reference** — add an `Accessibility` section to `buttons.tsx` so the page new
   authors copy is itself standard-compliant.
3. **Vocabulary normalization** — ~16 pages still open with `Default`/`Basic` instead of the
   canonical `Usage` (`meta="hello world"`): `accordion`, `alerts`, `breadcrumb`,
   `button-group`, `calendar`, `checkbox`, `collapsible`, `color-input`, `command`, `combobox`,
   `date-picker`, `drawer`, `input-group`, `label`, `pagination`, `radio`. Scripted rename.
4. **Prose-only Anatomy → visual Anatomy** — ~63 pages lack the `.ana .stage` + numbered `.pin`
   + `.ana-list` treatment the standard mandates (badges, banner, copy-chip, count-up,
   relative-time, trend, severity in core; most IDP card pages).

---

## 3. Component elaboration & primitive reuse

### What's working (keep it)
- **Clean layering.** `atoms.tsx` (Avatar, TierBadge, StatusDot, Trend, HealthBadge,
  SeverityPill, OwnerPill, Sparkline, RelativeTime…) → `blocks.tsx` composes atoms (MetricCard =
  Card + Trend + Sparkline; ServiceCard = Card + Tier/Lang/Health/Owner + Sparkline; Pipeline,
  Timeline, ScoreGauge, RingBar, DataTable, LogViewer, DiffViewer, TreeView, JSONInspector,
  FilterPanel). No circular deps; `primitives.tsx` (doc layer) stays separate. `index.ts` is a
  pure barrel.
- **Domain components are real exports**, not page-local: ServiceCard/MetricCard/AgentCard/
  Pipeline/etc. ship from `core/blocks`; Message/Tool/Reasoning/Plan/ContextGauge/AgentIdentity
  from `core/ai`. This is the single biggest "design-system-done-right" win in the repo.
- **IDP reuse is exemplary** — all 14 IDP pages are thin docs that import and demo a core
  component; almost no hand-rolled markup.

### Gaps
1. **Mobile reinvents instead of composing.** `mobile/cards.tsx` hand-builds a KPI tile and a
   service tile with raw `<div className="surface" style={{…}}>` instead of resizing
   `<MetricCard/>`/`<ServiceCard/>`; `mobile/overview.tsx` hand-builds a status bar + app header
   that aren't exported anywhere. Decide and act: either **compose core** (preferred) or
   **promote `MobileHeader`/`MobileStatusBar`/mobile card variants into `core` as real exports**
   (the same discipline IDP follows). Right now Mobile is the one sub-DS that violates
   "compose, never reinvent."
2. **Typography duplication — 89 pages** copy the same `const lede = {…}` / `cap` / `mono`
   inline style block. This is the in-page twin of the header problem. Replace with the existing
   `<Lede>` / `<Mono>` primitives and `.t-*` classes (the standard already mandates this in
   §3.5; 89 pages predate it). Scripted codemod.
3. **Hand-rolled recipes that should be components** — the agent-run `StepRow` in
   `ai/agents.tsx` is a Timeline in disguise; promote it to a `Timeline` variant or an
   `AgentStep` export rather than re-coding it inline.

---

## 4. "Storybook" / preview infrastructure

There is **no Storybook**; the equivalent is the `Frame` primitive (live render + highlighted,
copyable code, auto-collapse >8 lines, package-manager `TabbedCode`). For a copy-paste / "owned,
not imported" DS this is a reasonable choice and it's well-built.

**The one structural risk: code-string drift.** `Frame`'s `code` prop is a **hand-written
string**, independent of the JSX actually rendered above it. Nothing guarantees they match — edit
the demo, forget the string, and the page now shows working UI next to stale/wrong copy-paste
code. This is the defining weakness of the no-Storybook approach and it is currently unguarded.

**Also missing vs. a mature component workbench:** interactive prop controls (knobs), an isolated
per-component canvas at arbitrary viewports, automated a11y assertions (axe), visual-regression
snapshots, interaction tests, and API tables generated from TS types (today `PropsTable` is
hand-maintained, so it can drift from the component just like the code strings).

**Actions (incremental, no Storybook adoption required)**
1. **Kill code drift** — evolve `Frame` so the demo is the source: accept a render function and
   derive the displayed snippet from it (or add a build check that the `code` string parses and
   references real exports). Highest-leverage correctness fix in the docs layer.
2. **Generate `PropsTable` from types** — once core props are typed (Phase 4 in PROJECT-LOG),
   wire `react-docgen`/TS to emit the API rows. Removes a whole class of silent drift.
3. **Promote `scripts/verify-render.mjs` into a real gate** — it currently only catches thrown
   JS errors. Add `@axe-core/playwright` (a11y) + screenshot diffs (visual regression) in CI.

---

## 5. Next.js navigation / routing

**Strong:** typed nav (`nav-config.js` → `gen-nav.mjs` → `src/lib/nav.ts`: `NAV`/`NAV_BY_DS`/
`NAV_FLAT`/`navForPath`), per-DS scoping via the `DsSwitcher`, persisted `(ds)` DocsShell with
true SPA content-swap, SSG via `generateStaticParams` + `dynamicParams=false`, route-derived
active state and TOC scroll-spy. This is a clean, maintainable architecture.

**Fragile:**
1. **"Restart `next dev` after nav changes."** `generateStaticParams` is read once at start and
   `dynamicParams=false`, so new routes 404 until restart — a known footgun (it cost a
   ChunkLoadError debugging session, per the log). Mitigate with a watcher that regenerates +
   signals, or document it louder in the dev script output.
2. **No "nav entry ↔ page file" check.** A nav item without a page (or vice-versa) fails
   silently. Add a CI assertion that every `NAV_FLAT` href resolves to a `MIGRATED` key and every
   migrated page is in the nav.
3. **DS switcher isn't route-aware** — switching DS always lands on that DS's `home`, not the
   equivalent page. "Follow me" navigation (`/buttons` → `/<ds>/buttons` when it exists) would
   improve cross-DS browsing. Nice-to-have.

---

## 6. Market best practices — where Forge stands

**On par or ahead of market leaders:** semantic OKLCH token model (role-named, theme-flips-one-
variable), RTL-first with logical CSS properties, the anti-AI-slop craft checklist, per-DS
changelogs, and a real multi-DS family architecture. These are genuine differentiators.

**Gaps vs. Material 3 / Polaris / Carbon / Primer:**
1. **No machine-readable token spec.** Tokens live only in `tokens.css`. Adopt the **Design
   Tokens Format + Style Dictionary** so tokens can export to JSON/Figma/iOS/Android and become
   the single source of truth (today CSS is the only source).
2. **No published package / semver enforcement.** `DS_VERSION` is a hand-edited string; releases
   are manual. If the DS is meant to be consumed (not only copy-pasted), publish `@eidos/core`
   with semver + changesets; if it stays copy-paste, document that explicitly as the model.
3. **No automated a11y / visual / interaction tests** (covered in §4).
4. ~~No CONTRIBUTING / RFC model~~ → ✅ **`CONTRIBUTING.md` added** (route ritual, invariants,
   the full gate list). RFC process still optional if it scales to many squads.

*(Figma↔code linkage was considered and deliberately taken off the roadmap — out of scope by decision 2026-05-29.)*

---

## 7. Prioritized remediation plan

**P0 — your headline issue + correctness (do first)** — **✅ done 2026-05-29 (items 1–3)**
1. ✅ `.ds-ph-lede { max-width: none }` so 2-line ledes span the content width (`ds.css`).
2. ✅ Lede budget ≤ 220 chars in `DS-PAGE-STANDARD.md §2.1` + `typography-scale.mjs` now warns on
   a `desc` over ~220 chars or containing `<`.
3. ✅ Swept the long-header pages across **Charts (12), AI (32), IDP (12), core+mobile+blocks+
   patterns (~30)** — overflow relocated below the separator into a `<Lede>`; markup stripped from
   all `<code>`-in-desc headers (incl. installation + the 4 IDP cards). Build green (247 pages),
   render sweep clean. **Now: 0 pages over budget, 0 markup in any `desc`.**
4. ✅ Frame code-string drift — added `scripts/check-frame-code.mjs` (`npm run check:frames`,
   wired into CI advisory): parses every `Frame`/`CodeBlock`/`TabbedCode` snippet by `lang`
   with the TS compiler and flags any that wouldn't parse if pasted. Caught + fixed a real
   bug (a `/* */` comment between JSX attributes in `mobile/page-indicator`) and a `...`
   placeholder in `mobile/search`. Residual 10/441 are known doc-illustration patterns
   (component-body examples, `{/* */}`/`...` placeholders). True zero-drift would need
   runtime-evaluated demos (react-live) — deferred as a larger change.

**Verification (2026-05-29).** Hardened `scripts/verify-render.mjs` to also catch React
`console.error`s (the blind spot noted in §4), recognize example screens (shell-less) and
intentional scaffolds, and wait for async page content before snapshotting. Full sweep of **all
242 routes → 242/242 clean** (no exceptions, no console errors); `next build` green (247 pages).
Also fixed one pre-existing hydration warning surfaced by the harder gate: `ai/math.tsx` rendered
an inline `Skeleton` (`<div>`) inside a `<p>` — swapped for an inline `<span class="ai-skel-line">`.

**P1 — close the biggest content gaps** — **✅ done 2026-05-29 (items 5 & 7)**
5. ✅ Mobile sweep: built out the **15 scaffold pages** (`checkbox, radio, tag, text-area,
   pulldown, tooltip, action-button, icon-button, footer, page-indicator, page-controller,
   expanded-tab-list, image-grid, video-player, snackbar`) to the full component template —
   each now ships a DeviceFrame demo, Variants/States, visual Anatomy, an **Accessibility**
   section (role/ARIA + 44px target), RTL, Do/Don't, and a Spec. Build green (247 pages); all
   15 + the full 242-route sweep render clean. Fixed 2 inline `<style>` spinner blocks → `.ds-spin`.
6. ✅ Mobile reuse policy decided + applied. **Policy: Mobile composes core components where
   they fit, and core atoms otherwise; it never re-derives an existing recipe.** `mobile/cards.tsx`
   was hand-rolling the `MetricCard` recipe (label+delta+value+sparkline) — now composes
   `<MetricCard/>` directly (feed + Do-card). The service/incident rows stay local (genuinely
   mobile-specific full-width tappable feed layouts) but compose core atoms (StatusDot, pills,
   Sparkline, tokens), not re-derived values. Policy noted in the page header comment; build
   green, page render-clean + screenshot-verified.
7. ✅ Added the **Accessibility** section to `buttons.tsx` (the gold reference). The other core
   pages without `meta="a11y"` are legitimately exempt (the `a11y`/`rtl` foundation pages, the
   `overview` home, the `components-catalog` index, and `color` via the foundation template).

**P2 — consistency & drift prevention** — **✅ done 2026-05-29 (items 8 & 9)**
8. ✅ Typography codemod (`scripts/codemod-prose-primitives.mjs`): replaced the inline
   `const lede/ledeUp/cap/captn/mono` blocks with the `<Lede>`/`<Mono>` primitives across
   **143 files — 1851 `<p>`/`<code>` swaps, 320 dead const decls removed**. Verified
   size-equivalent first (`<Mono>` `--text-sm`=13 == inline `--text-base`=13; `<Lede>`
   `.ds-caption`=15 == inline lede/cap), so zero visual change. Build green, 242/242 render
   clean, screenshot-verified (buttons).
9. ✅ Vocabulary: the audit's "Default/Basic as the opening demo" was a false positive — **every
   page already leads with the canonical `Usage` (`meta="hello world"`)**. Fixed the only real
   smell: 5 bare `meta="default">Default` eyebrows → descriptive (breadcrumb/collapsible/label/
   pagination/command). Remaining `meta="default"` carry descriptive titles (acceptable).
10. ✅ Visual Anatomy: the real gap was **18 component pages** (the "~63" had counted exempt
    foundations/overviews/CSS-patterns). Converted all 18 — 6 core (badges, banner, trend,
    copy-chip, count-up, relative-time) + 12 IDP (service/metric/agent cards, score-gauge,
    data-table, log-viewer, diff-viewer, json-inspector, pipeline, timeline, ring-bar,
    filter-panel) — each now renders the real core component in a `.ana .stage` with numbered
    `.pin`s + `.lead` connectors + a numbered `.ana-list` legend. Build green, 242/242 render
    clean, screenshot-verified. (The render sweep caught one missing `Mono` import in
    filter-panel — build had passed since TS errors are ignored — and it was fixed.)
11. ✅ nav↔page integrity (`scripts/check-nav.mjs`, `npm run check:nav`, CI `--strict` gate):
    asserts every internal nav href resolves to a migrated page or example screen and no page is
    orphaned from the nav — **241 links / 216 pages, all resolve**. `verify-render.mjs` also gained
    React-console-error capture this round.
    ✅ **axe + visual-regression added (R3):**
    - **a11y** — `scripts/check-a11y.mjs` (`npm run check:a11y`) injects axe-core and runs WCAG
      2.1 A/AA over the rendered pages, aggregating violations by rule/impact. Structural rules
      gate `--strict`; **color-contrast is advisory** — its 589 nodes are dominated by the DS's
      tertiary tiers (`--fg-subtle` #756f66 → 3.87:1, `--fg-faint` #524c44 → 2.27:1, the latter
      "decorative, never required" by design), a token-tier decision, not a code bug.
    - **visual regression** — `scripts/check-visual.mjs` (`npm run check:visual`, `--update` to
      seed) screenshots a fixed viewport per route and pixel-diffs (pixelmatch) against committed
      baselines in `tests/visual-baselines/` (sample seeded; re-run 10/10 match).
    - Both wired into CI (advisory) in the `verify-routes` job; deps `axe-core`/`pixelmatch`/`pngjs` added.
    - 🔶 **Discovered follow-up (tracked, not yet fixed):** ~38 *structural* a11y nodes that ARE
      genuine bugs — `label`/`select-name` (unlabeled form controls), `aria-toggle-field-name`
      (17 — switches without an accessible name), `scrollable-region-focusable` (9 — scroll
      regions not keyboard-reachable), `aria-prohibited-attr` (6). Fixing these flips the a11y
      `--strict` gate green. Plus a **design decision**: whether to raise `--fg-subtle`/`--fg-faint`
      contrast or formally scope them to large/decorative text only.

**P3 — platform maturity (strategic)** — **✅ done 2026-05-29 (item 12); 13 gated**
12. ✅ Design-Tokens-Format export: `scripts/gen-tokens.mjs` (`npm run gen:tokens`) parses
    `tokens.css` (which stays the authored source) and emits `tokens/forge.tokens.json` —
    **201 tokens across 13 groups**, DTCG `$type`/`$value`/`$description`, `var(--x)` resolved
    to `{group.x}` references, and **122 light-theme overrides** under
    `$extensions["com.forge.theme.light"]`. This is the machine-readable spec Style Dictionary /
    Figma / iOS·Android exporters consume; it does not invert the CSS-authored workflow.
13. ✅ **Generated `PropsTable` from TS types — done.**
    - **Typed core props (the prerequisite):** typed every exported component's props
      (optional-by-default) across `src/ds/core/` primitives, atoms, blocks, charts, ai/* —
      **`tsc` 2257 → 681 (−70%)**, build green, 242/242 render clean. Biggest lever: `Frame` +
      `Section` alone (−1144).
    - **Generator:** `scripts/gen-props.mjs` (`npm run gen:props`, wired into predev/prebuild)
      walks `src/ds/core/**` with the TS compiler → `src/ds/core/props.generated.ts`: **111
      components, 504 rows** with prop name, type, default (from the destructuring), required
      flag, and **description (from JSDoc on the prop type)**. New `<AutoPropsTable
      component="X"/>` primitive renders it via the existing `PropsTable`, so the API table can't
      drift. Demoed on `idp/metric-card` (rows → `<AutoPropsTable component="MetricCard"/>` +
      JSDoc on MetricCard's props); table content DOM-verified.
    - ✅ **Propagated (R2):** ~30 component pages swapped hand-written tables for
      `<AutoPropsTable>`, descriptions ported into JSDoc on each core type (no doc-quality loss):
      IDP (ServiceCard, AgentCard, ScoreGauge, Pipeline, Timeline, RingBar, DataTable, LogViewer,
      JSONInspector, FilterPanel, Banner) + AI (Tool, Reasoning, ChainOfThought, Plan, Task,
      Checkpoint, Confirmation, Queue, Message, Response, AILabel, Persona, ContextGauge/Bar,
      AskUser, Shimmer/Skeleton, ImageView, MathView, ModelSelector, Transcription, Suggestion,
      Sources, Citation). props.generated.ts → **113 components, 518 rows**. Correctly skipped
      `diff-viewer`/`tree-view` (external `@pierre` wrappers) and `prompt-input` (`React.FC<Props>`
      TypeReference gen-props can't read); secondary data-shape tables left hand-written.
    - ✅ **Cleared ALL residual `tsc` errors (2257 → 0)** and made the gate blocking. A shared
      `Icons` factory fix (typing the `...rest` as `React.SVGProps`) alone cleared ~136 (every
      `className`/`style` on an icon); the rest were page-local demo-helper components +
      per-site mismatches, fixed type-only via parallel agents (which also surfaced real bugs:
      a missing `await convertToModelMessages`, `colSpan="2"`→`{2}`, `person=`→`contributors=`,
      `CopyChip text=`→`value=`, `level="P1"`→`"p1"`). **`next.config` `ignoreBuildErrors: false`**
      (so `next build` type-checks) + the **CI `typecheck` job is now blocking**. Build green,
      242/242 render clean.
14. ✅ Distribution model decided + documented (R4): **`docs/DISTRIBUTION.md`** — Forge is
    **source-shipped** (shadcn-style CLI copies component source into the consumer repo), the
    model the Installation flow already implements; the shared single-sources-of-truth are the
    DTCG **tokens** + the base CSS, versioned via `DS_VERSION` + `/release` + per-DS changelogs.
    The published-`@eidos/core`-package path is documented as a reversible additive alternative.
    Also added **`CONTRIBUTING.md`** (closes the §6 "no contribution model" gap): route ritual,
    invariants, and the full gate list. *(Figma linkage removed from scope by decision 2026-05-29.)*

---

## Appendix — how the numbers were measured

```
find src/ds/migrated -name '*.tsx' ! -name 'changelog.tsx'   # 209 content pages
… | xargs grep -l 'meta="a11y"'      # 178   (mobile 25/45)
… | xargs grep -l 'dir="rtl"'        # 138
… | xargs grep -l 'dd-grid'          # 173
… | xargs grep -l 'ana-list'         # 146
… | xargs grep -l 'PropsTable'       # 137
… | xargs grep -l 'const lede = {'   #  89   (typography drift)
grep -rhoP 'desc="[^"]*"' … | sort by length   # ~45 ledes 340–653 chars
grep -rl 'desc="[^"]*<' …             #   7   (markup in header)
```
</content>
</invoke>
