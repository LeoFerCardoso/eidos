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

The authoritative catalog is `EIDOS-DS-REFERENCE.md` + `llms.txt` (root) and
`docs/EIDOS-DS-AUTHORING.md`. This is the quick map; read those for detail.

## How a page exists (current — idiomatic TSX, SWC; NO Babel, NO `window` registry)

There is **no `.babelrc`**, no `window.PAGES`, no `gen-manifest`, no `manifest.generated.ts`.
A page is real when **both** are true:
1. A leaf in `src/ds/core/nav-config.js` (`{ id, label, href:'pages/<ds>/<slug>.html', badge }`
   in the correct `ds:`-tagged group). `id` == file slug.
2. A module `src/ds/migrated/<ds>/<slug>.tsx` (core: `src/ds/migrated/<slug>.tsx`) — `'use client'`,
   **default export**, imports from `@/ds/core`. Auto-registered into `src/ds/migrated/registry.ts`
   by `scripts/gen-migrated.mjs` (examples: `src/ds/examples/<name>.tsx` → `examples/registry.ts`
   via `gen-examples`, nav leaf marked `external: true`).

Regen with `node scripts/gen-nav.mjs && node scripts/gen-migrated.mjs` (auto on `dev`/`build`),
then **restart `next dev`** — new routes 404 until restart. `src/ds/core/index.ts` is a plain
barrel (`export *`): mocks · icons · atoms · primitives · blocks · charts · device. No load-order
side effects, no `window`.

## Class systems (compose, never reinvent)

`.btn` buttons · `.pill` status pills · `.surface` layered panels · `.ds-frame` doc
preview frames (preview + collapsible code) · `.ds-grid` layout · `.in-*` input groups
(`.in-field` → `.in-group` (focus ring lives here) → `.in-control` + `.in-addon`) ·
`.fc-*` form controls · `.cb-*` combobox · `.menu` · `.tt` tooltip · `.badge` · `.avatar`
· `.tbl` data tables. Tokens + classes live in `src/styles/tokens.css` + `ds.css` — those
two files ARE the system. Extend them only for a genuinely new building block.

## Eidos invariants

- Single accent ember `#FF6B35` (`var(--accent)`/`var(--ember)`), at most **2×/screen**; dark ink on every ember fill.
- Geist Sans (UI/body) + Geist Mono (numerics, captions, eyebrows).
- **Typography: never hand-roll prose font sizes.** Section intros → `<Lede>`, inline code → `<Mono>`,
  header/headings → `<Section>`/`<SubHead>`; sizes come from `--text-*` tokens (`DS-PAGE-STANDARD.md` §3.5).
- **RTL section is required on every component page** (§3.6) — logical CSS properties everywhere; RTL is first-class.
- Anti-AI-slop is a mandatory checklist (`.claude/craft/anti-ai-slop.md`).

## Known gotchas (from docs/EIDOS-DS-AUTHORING.md)

- **Black screen** → runtime crash, almost always a missing `Icons.x` reference or a
  syntax error in the page JSX. Check the boot diagnostic.
- **Doubled focus ring** → the global `input:focus` glow paints on inner inputs;
  suppress with `.cb-input:focus, .sel-search input:focus { box-shadow: none !important }`.
  Only the `.in-group` shell should paint the ring.
- **Dropdown clipped inside a Frame** → `.ds-frame { overflow: hidden }` clips absolutely
  positioned panels. Use `position: fixed` + `getBoundingClientRect()` (see Combobox).
- **Multi-fire onChange** → never put `htmlFor={id}` on a `<label>` that ALSO wraps the
  input; wrapping alone is enough, or onChange fires twice.

## Version bump — ONE source of truth

When cutting a release, update `DS_VERSION` in **`src/lib/site.ts`** (it feeds the
`VersionBadge` in the DocsShell topbar — `src/components/layout/version-badge.tsx`). Add a
per-DS changelog entry in `migrated/<ds>/changelog.tsx`, and sweep `new`/`updated` badges in
`nav-config.js` so they reflect only what actually moved. *(There is no `shell.jsx` and no
two-string sync anymore.)* See the `release` command for the full flow.
