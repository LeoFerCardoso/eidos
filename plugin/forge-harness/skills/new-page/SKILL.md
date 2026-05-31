---
name: new-page
description: |
  Create a new Forge DS page OR a full IDP example screen (service catalog, DORA
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
  Get Started, a non-`components` doc page). Registers `window.PAGES['<slug>']`.
  Read `${CLAUDE_PLUGIN_ROOT}/skills/component-page/SKILL.md`.
- **Example** = a complete, standalone IDP product screen rendered **without** the docs
  shell. Registers `window.EXAMPLES['<name>']`, lives in `src/ds/examples/<name>.jsx`,
  and its nav entry carries `external: true`. Read `${CLAUDE_PLUGIN_ROOT}/skills/idp-screen/SKILL.md`.

When unsure: if it's a real product screen built from existing blocks, it's an Example.

## 2. Pre-read

- The matching harness skill above (idp-screen or component-page).
- `${CLAUDE_PLUGIN_ROOT}/design-systems/forge/DESIGN.md` — brand invariants.
- `${CLAUDE_PLUGIN_ROOT}/craft/`: `typography.md`, `color.md`, `anti-ai-slop.md`,
  `accessibility-baseline.md`, `rtl-and-bidi.md`, `state-coverage.md`, and for screens
  with forms also `form-validation.md`.
- `llms.txt` **Examples** + **Elements** sections and `FORGE-DS-REFERENCE.md` — the
  screen or block almost always already exists; adapt before building new.
- Inspect a sibling for the exact registration pattern: examples in
  `src/ds/examples/*.jsx` (e.g. `agent-catalog.jsx`, `dora-dashboard.jsx`), pages in
  `src/ds/pages/foundations/*.jsx`.

## 3. Route ritual (same THREE-step rule as any DS route)

1. **`src/ds/core/nav-config.js`** — add the leaf in the right group.
   - Page: `{ id: '<slug>', label: '<Label>', href: 'pages/<group>/<slug>.html' }`.
   - Example: `{ id: 'ex-<name>', label: '<Label>', href: 'pages/examples/<name>.html', external: true }`.
2. **Source module**:
   - Page → `src/ds/pages/<group>/<slug>.jsx` ending in `window.PAGES['<slug>'] = C;`.
   - Example → `src/ds/examples/<name>.jsx` ending in `window.EXAMPLES['<name>'] = C;`
     (use `FShell`/`FPageHeader` from `window`, render standalone — no docs sidebar).
3. **`node scripts/gen-manifest.mjs`** (auto-run by dev/build). Confirms the route in
   `src/ds/runtime/manifest.generated.ts`.

## 4. State coverage (mandatory for screens)

Per `${CLAUDE_PLUGIN_ROOT}/craft/state-coverage.md`, design and (for examples) show every state:
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
