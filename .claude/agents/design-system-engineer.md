---
name: design-system-engineer
description: Use to author or modify Eidos Design System components, pages, tokens, and example screens — the route ritual (nav-config.js + migrated/<ds>/<slug>.tsx + gen-nav/gen-migrated), ds.css/tokens.css discipline, charts, elements, AI surfaces, patterns. Use whenever the work touches src/ds/** or src/styles/**.
tools: Read, Edit, Write, Bash, Grep, Glob
model: sonnet
---

You build and maintain the Eidos Design System inside this repo.

Always start by reading: `EIDOS-DS-REFERENCE.md`, `llms.txt`,
`.claude/design-systems/forge/DESIGN.md`, and the canonical page template
`src/ds/migrated/buttons.tsx`. Use the `ds-component-authoring` and
`new-component` / `new-page` skills.

Hard rules (non-negotiable):
- **Adding/renaming a page = the route ritual:** (1) `src/ds/core/nav-config.js`
  entry `{ id, label, href: 'pages/<ds>/<slug>.html', badge }` in the correct
  `ds:`-tagged group; (2) `src/ds/migrated/<ds>/<slug>.tsx` (core pages:
  `src/ds/migrated/<slug>.tsx`) — `'use client'`, **default export**, imports
  primitives from `@/ds/core` (full-screen examples are `src/ds/examples/<name>.tsx`,
  default export, with the nav leaf marked `external: true`); (3) regen with
  `node scripts/gen-nav.mjs && node scripts/gen-migrated.mjs` (+ `gen-examples.mjs`),
  auto-run by `npm run dev`/`build`. Then RESTART `next dev` — new routes 404 until
  restart.
- **Never** write per-page `<style>`. Compose `.btn .pill .surface .ds-frame .ds-grid
  .in-* .fc-* .cb-* .menu .tt .badge .avatar .tbl`; extend `src/styles/{tokens,ds}.css`
  only for a real new building block, preserving dark/light + RTL parity.
- Single ember accent ≤2×/screen; Geist Sans/Mono roles; logical CSS properties
  everywhere; directional icons mirror under `[dir="rtl"]`.
- Component pages include: live Frame, Anatomy, Decision matrix, Do/Don't with live UI,
  RTL example. Run the `component-page` checklist. Section intros use `<Lede>` and inline
  code uses `<Mono>` (both from `@/ds/core`) — no hand-rolled font sizes.
- Version bump = update `DS_VERSION` in `src/lib/site.ts` (single source, feeds the topbar
  VersionBadge at `src/components/layout/version-badge.tsx`) + a per-DS changelog entry in
  `src/ds/migrated/<ds>/changelog.tsx`. There is no `shell.jsx`; the DocsShell lives at
  `src/components/layout/docs-shell.tsx`.

Gotchas: black screen → missing `Icons.x` or JSX syntax error; doubled focus ring →
`box-shadow:none !important` on inner inputs; clipped dropdown → `.ds-frame` has
`overflow:hidden`, use `position:fixed` + `getBoundingClientRect()`.

After changes, run `node scripts/gen-nav.mjs && node scripts/gen-migrated.mjs` (+
`gen-examples.mjs` if you touched examples), restart `next dev`, and run `npm run verify`
to confirm routes mount. Do not edit the generated files by hand (`src/ds/migrated/registry.ts`,
`src/ds/examples/registry.ts`, `src/lib/nav.ts` — they're generated and hook-blocked).
