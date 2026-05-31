---
name: new-page
description: |
  Create a new Eidos DS page OR a full IDP example screen (service catalog, DORA
  dashboard, incident room, pipeline console, agent chat, etc.). Use when the request
  is "build the X screen", "prototype the Y page", "add an example", or "new foundations/
  patterns page". Decides page-vs-example, then bridges the harness idp-screen /
  component-page skills with full state coverage. Do NOT use to document a single
  component (use new-component).
allowed-tools: [Read, Edit, Write, Bash, Grep]
---

# new-page — author a DS page or a full IDP example screen

## 1. Decide: PAGE or EXAMPLE

- **Page** = a docs surface that renders inside the DS shell (Foundations, Patterns,
  Get Started, a non-`components` doc page). It's idiomatic TSX at `src/ds/migrated/<slug>.tsx`
  (core) or `src/ds/migrated/<ds>/<slug>.tsx` (sub-DS) — `'use client'`, default export,
  imports from `@/ds/core`, auto-registered by `gen-migrated` (no `window.PAGES`).
  Read `.claude/skills/component-page/SKILL.md` **and follow `docs/DS-PAGE-STANDARD.md`**
  (the canonical section order + the required Accessibility + visual Anatomy + Do/Don't).
- **Example** = a complete, standalone IDP product screen rendered **without** the docs
  shell. Idiomatic TSX at `src/ds/examples/<name>.tsx` (default export), resolved by
  `EXAMPLES_REG` (`gen-examples`); its nav entry carries `external: true`. Read
  `.claude/skills/idp-screen/SKILL.md`.

When unsure: if it's a real product screen built from existing blocks, it's an Example.

## 2. Pre-read

- The matching harness skill above (idp-screen or component-page).
- `.claude/design-systems/forge/DESIGN.md` — brand invariants.
- `.claude/craft/`: `typography.md`, `color.md`, `anti-ai-slop.md`,
  `accessibility-baseline.md`, `rtl-and-bidi.md`, `state-coverage.md`, and for screens
  with forms also `form-validation.md`.
- `llms.txt` **Examples** + **Elements** sections and `FORGE-DS-REFERENCE.md` — the
  screen or block almost always already exists; adapt before building new.
- Inspect a sibling for the exact pattern: examples in `src/ds/examples/*.tsx` (e.g.
  `agent-catalog.tsx`, `dora-dashboard.tsx`), pages in `src/ds/migrated/*.tsx` /
  `src/ds/migrated/<ds>/*.tsx`. `src/ds/migrated/buttons.tsx` is the gold-reference page.

## 3. Route ritual (current architecture — idiomatic TSX; NO `window.PAGES`/`.jsx`/`gen-manifest`)

1. **`src/ds/core/nav-config.js`** — add the leaf in the right `ds:`-tagged group.
   - Page: `{ id:'<slug>', label:'<Label>', href:'pages/<ds>/<slug>.html', badge:'new' }`.
   - Example: `{ id:'ex-<name>', label:'<Label>', href:'pages/examples/<name>.html', external:true }`.
2. **Source module** (default export, `'use client'`, imports from `@/ds/core`):
   - Page → `src/ds/migrated/<ds>/<slug>.tsx` (core: `src/ds/migrated/<slug>.tsx`) →
     auto-registered into `src/ds/migrated/registry.ts` by `gen-migrated`.
   - Example → `src/ds/examples/<name>.tsx` (full-screen, no docs shell) → registered into
     `src/ds/examples/registry.ts` by `gen-examples`; use the `example-shell` helpers.
3. **Regenerate + restart** — `node scripts/gen-nav.mjs && node scripts/gen-migrated.mjs &&
   node scripts/gen-examples.mjs` (auto-run by dev/build). **Restart `next dev`** — new routes
   404 until restart. For a docs page, follow `docs/DS-PAGE-STANDARD.md` incl. **typography (§3.5,
   use `<Lede>`/`<Mono>`)** and the **required RTL section (§3.6)**.

## 4. State coverage (mandatory for screens)

Per `.claude/craft/state-coverage.md`, design and (for examples) show every state:
**loading** (skeletons), **empty** (a real first-run zero state, not filler copy),
**error** (recoverable + with a retry), and **populated** with realistic data. Never
use `lorem ipsum` or "feature one/two/three" — an empty section is a composition
problem.

## 5. Compose + verify

- Build from existing blocks/elements/classes (`.surface .ds-grid .tbl .badge .pill`,
  IDP blocks: Data table, Pipeline, Log viewer, Tree, Timeline, Ring bar, Metric/Service
  cards). Never per-page `<style>`. Logical CSS properties throughout (RTL first-class).
- Ember at most 2×/screen; Geist Sans + Geist Mono (mono for numerics/captions/eyebrows).
- Run the harness skill's checklist + **anti-ai-slop**.
- Watch the gotchas in `docs/FORGE-DS-AUTHORING.md` (black screen / focus ring /
  clipped dropdown / multi-fire onChange).
- Offer `npm run verify` afterward (the `verify-routes` command).
