---
name: ds-component-authoring
description: |
  Reference + checklist for authoring Eidos DS components: the class systems, the
  registration mechanics, the known runtime gotchas, and the two-place version bump. Use
  when you need the rules of the road — "how does the Eidos page registry work", "which
  class do I compose for X", "why is my page a black screen / focus ring doubled /
  dropdown clipped / onChange firing twice", or as a pre-flight before new-component /
  refine. Knowledge skill; pair it with the action skills.
allowed-tools: [Read, Grep]
---

# ds-component-authoring — Eidos authoring rules & gotchas

The authoritative catalog is `FORGE-DS-REFERENCE.md` + `llms.txt` (root) and
`docs/FORGE-DS-AUTHORING.md`. This is the quick map; read those for detail.

## How a page exists (registry bridge)

DS pages are Babel-authored JSX run through a `window` registry (the app compiles with
`next/babel` via `.babelrc` — do not remove it). A page is real only when **all three**
are true:
1. A leaf in `src/ds/core/nav-config.js` (`{ id, label, href }`, alphabetical inside
   sub-groups). `id` == registry key.
2. A module `src/ds/pages/<group>/<slug>.jsx` ending in
   `window.PAGES['<slug>'] = Component;` (examples: `src/ds/examples/<name>.jsx` ending
   in `window.EXAMPLES['<name>']`, nav leaf marked `external: true`).
3. `node scripts/gen-manifest.mjs` ran (auto on `npm run dev`/`build`; or
   `npm run gen:manifest`) → rebuilds `src/ds/runtime/manifest.generated.ts`.

Core load order is fixed in `src/ds/core/index.ts`:
install-globals → mocks → nav-config → icons → atoms → primitives → blocks → charts → shell.

## Class systems (compose, never reinvent)

`.btn` buttons · `.pill` status pills · `.surface` layered panels · `.ds-frame` doc
preview frames (preview + collapsible code) · `.ds-grid` layout · `.in-*` input groups
(`.in-field` → `.in-group` (focus ring lives here) → `.in-control` + `.in-addon`) ·
`.fc-*` form controls · `.cb-*` combobox · `.menu` · `.tt` tooltip · `.badge` · `.avatar`
· `.tbl` data tables. Tokens + classes live in `src/styles/tokens.css` + `ds.css` — those
two files ARE the system. Extend them only for a genuinely new building block.

## Eidos invariants

- Single accent ember `#FF6B35` (`var(--accent)`/`var(--ember)`), at most **2×/screen**.
- Geist Sans (UI/body) + Geist Mono (numerics, captions, eyebrows).
- Logical CSS properties everywhere — RTL is first-class.
- Anti-AI-slop is a mandatory checklist (`${CLAUDE_PLUGIN_ROOT}/craft/anti-ai-slop.md`).

## Known gotchas (from docs/FORGE-DS-AUTHORING.md)

- **Black screen** → runtime crash, almost always a missing `Icons.x` reference or a
  syntax error in the page JSX. Check the boot diagnostic.
- **Doubled focus ring** → the global `input:focus` glow paints on inner inputs;
  suppress with `.cb-input:focus, .sel-search input:focus { box-shadow: none !important }`.
  Only the `.in-group` shell should paint the ring.
- **Dropdown clipped inside a Frame** → `.ds-frame { overflow: hidden }` clips absolutely
  positioned panels. Use `position: fixed` + `getBoundingClientRect()` (see Combobox).
- **Multi-fire onChange** → never put `htmlFor={id}` on a `<label>` that ALSO wraps the
  input; wrapping alone is enough, or onChange fires twice.

## Version bump — TWO places, must stay in sync

When cutting a release, update both strings in `src/ds/core/shell.jsx`:
1. Sidebar sub-text: `<span className="sub">Design System v<X></span>`.
2. Topbar badge: `<span className="pill ember">…v<X> · Stable</span>`.
They are currently `v1.7.13`. Also sweep `new`/`updated` badges in `nav-config.js` so they
reflect only what actually moved. (See the `release` command for the full flow.)
