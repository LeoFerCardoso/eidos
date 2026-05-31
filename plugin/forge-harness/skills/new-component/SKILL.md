---
name: new-component
description: |
  Create a new Forge DS component documentation page (a page under
  src/ds/pages/components|elements|charts|ai|patterns). Use when the request is
  "document component X", "new component page", "add X to the design system", or
  "create a doc page for Y". Encodes the mandatory 3-file route ritual + the
  buttons.jsx template + required doc sections + gen-manifest. Do NOT use for full
  product screens (use new-page) nor for editing existing component CSS.
argument-hint: "[component-name]"
allowed-tools: [Read, Edit, Write, Bash, Grep]
---

# new-component — author a Forge DS component doc page

The design system (`src/styles/tokens.css` + `src/styles/ds.css`) IS the product.
Your job is to **demonstrate existing classes/primitives by composition** — never
write per-page `<style>` and never reinvent a class that already exists.

## 1. Pre-read (do not skip)

- `${CLAUDE_PLUGIN_ROOT}/skills/component-page/SKILL.md` — the canonical content workflow + checklist.
- `${CLAUDE_PLUGIN_ROOT}/design-systems/forge/DESIGN.md` — brand: ember budget, Geist, density, motion.
- `${CLAUDE_PLUGIN_ROOT}/craft/` required for this artifact:
  `typography.md`, `color.md`, `anti-ai-slop.md`, `accessibility-baseline.md`,
  `rtl-and-bidi.md`, `state-coverage.md`.
- `FORGE-DS-REFERENCE.md` + `llms.txt` (root) — confirm every class/icon you'll use
  already exists. `docs/FORGE-DS-AUTHORING.md` — class systems + gotchas.
- `src/ds/pages/components/buttons.jsx` — the canonical page template. Read it fully;
  mirror its structure.

## 2. The 3-file ritual (a DS page = THREE coordinated changes)

For component slug `<slug>` in group `components` (or `elements`/`charts`/`ai`/`patterns`):

1. **Register the route** — edit `src/ds/core/nav-config.js`. Add
   `{ id: '<slug>', label: '<Label>', href: 'pages/components/<slug>.html' }` into the
   correct (sub)group. Items inside a sub-section are sorted alphabetically by label —
   insert in order. `id` MUST equal the slug used in `window.PAGES`.
2. **Create the page module** — `src/ds/pages/components/<slug>.jsx`. Wrap in an IIFE,
   pull primitives from `window` (`const { Icons, Frame, TabbedCode, PropsTable, Section, SubHead } = window;`),
   build the page, and end with:
   `window.PAGES = window.PAGES || {}; window.PAGES['<slug>'] = <Component>;`
3. **Regenerate the manifest** — run `node scripts/gen-manifest.mjs` (also auto-run by
   `npm run dev`/`build`, or `npm run gen:manifest`). This emits
   `src/ds/runtime/manifest.generated.ts`. Skipping it = a 404 route.

## 3. Required doc sections (follow buttons.jsx ordering)

1. **Installation** — `TabbedCode` (pnpm · npm · yarn · bun · Manual).
2. **Usage** — minimal `<Frame>` with import + render.
3. **Examples** — variants/sizes/states **with live UI**, plus an explicit **RTL**
   example (set `dir="rtl"` on a wrapper and prove logical properties hold).
4. **Anatomy** — labelled parts.
5. **Decision matrix** — when to use this vs. neighbours (table or `PropsTable`).
6. **Do / Don't** — each with a **live rendered** good vs. bad sample, not just prose.
7. **API reference** — `PropsTable`.

Cover all relevant states (default/hover/focus/disabled/loading/invalid/empty/error)
per `state-coverage.md`.

## 4. Compose, don't invent

Use the existing class systems: `.btn .pill .surface .ds-frame .ds-grid .in-* .fc-*
.cb-* .menu .tt .badge .avatar .tbl`. Only extend `tokens.css`/`ds.css` if a genuinely
new building block is needed — and say so explicitly.

## 5. Verify before finishing

- Run the component-page checklist from the harness skill **including anti-ai-slop**.
- Ember used at most 2×/screen; no Tailwind indigo; no emoji feature icons.
- Confirm gen-manifest ran and the new route appears in `manifest.generated.ts`.
- Sanity-check the gotchas in `docs/FORGE-DS-AUTHORING.md` apply to your component:
  black screen (missing `Icons.x`), doubled focus ring, dropdown clipped by
  `.ds-frame{overflow:hidden}` (use `position:fixed` + `getBoundingClientRect()`),
  multi-fire onChange (never `htmlFor` on a label that also wraps the input).
- Offer `npm run verify` (DS route render check) — see the `verify-routes` command.
