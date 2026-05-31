---
name: portal-scaffold
description: |
  Scaffold a new web portal or section in the Next.js App Router, wired to the Eidos
  Design System (layout, nav registration, DS shell usage, token import). Use when the
  request is "scaffold a new portal", "add a new section/area to the app", "set up a new
  product surface in the App Router", or "wire a new route into the DS shell". Do NOT use
  to add a single doc page (use new-component / new-page).
allowed-tools: [Read, Edit, Write, Bash, Grep]
---

# portal-scaffold — new App Router section wired to Eidos DS

This repo renders the DS docs through a catch-all App Router route under the persisted
`(ds)` layout: `app/(ds)/[...slug]/page.tsx`, fed by the generated nav + migrated
registry built from `src/ds/core/nav-config.js`. A "portal/section" here means a new
top-level **nav group** (or sub-group) plus its pages — not a parallel Next.js app.

## 1. Understand the wiring (read first)

- `app/layout.tsx`, `app/globals.css`, `app/(ds)/layout.tsx`, `app/(ds)/[...slug]/page.tsx`
  — the persisted DocsShell layout + the catch-all route + global stylesheet. DS routes
  resolve via the generated `src/lib/nav.ts` + `src/ds/migrated/registry.ts`; full-screen
  examples resolve via `app/example/[name]/page.tsx` + `src/ds/examples/registry.ts`.
- `src/ds/core/index.ts` — the barrel re-exporting the component layer
  (mocks → icons → atoms → primitives → blocks → charts → device); no `window`, no
  load-order side-effects.
- `src/components/layout/docs-shell.tsx` — the `DocsShell` (sidenav, DS switcher, topbar,
  ⌘K palette). New groups render automatically from the generated nav.
- `src/styles/tokens.css` + `src/styles/ds.css` — the design system; compose these.
- `.claude/design-systems/forge/DESIGN.md` + `.claude/craft/anti-ai-slop.md`.

## 2. Register the section in nav-config.js

Add a new group object to the `groups` array in `src/ds/core/nav-config.js`, tagging it
with `ds:` (or `GROUP_DS`) for the right design system:
- FLAT: `{ group: 'My Portal', ds: '<ds>', items: [ { id, label, href }, ... ] }`
- NESTED: `{ group: 'My Portal', ds: '<ds>', subgroups: [ { subgroup: '...', items: [...] } ] }`

Each item `href` is `pages/<ds>/<slug>.html` (or `pages/examples/<name>.html` with
`external: true` for standalone full-screen examples). `id` MUST match the page slug.
Badge policy: only mark `new`/`updated` for items that actually moved this release.

## 3. Create the page modules

For each route, add `src/ds/migrated/<ds>/<slug>.tsx` (core pages
`src/ds/migrated/<slug>.tsx`) — `'use client'`, **default export**, imports primitives
from `@/ds/core` (template: the gold reference `src/ds/migrated/buttons.tsx`) — or
`src/ds/examples/<name>.tsx` (default export) for full-screen examples. Build by composing
existing primitives imported from `@/ds/core`; reuse `FShell`/`FPageHeader` for product
surfaces, and `<Lede>` / `<Mono>` for prose. Never write per-page `<style>`.

## 4. Regenerate + verify

- Run `node scripts/gen-nav.mjs && node scripts/gen-migrated.mjs` (+
  `node scripts/gen-examples.mjs` for examples) — auto-run by `npm run dev`/`build`. This
  rebuilds `src/lib/nav.ts`, `src/ds/migrated/registry.ts`, and `src/ds/examples/registry.ts`
  so every new route + sidebar entry resolves. Then RESTART `next dev` — new routes 404
  until restart. Skipping the regen = 404s and missing nav links.
- Keep Eidos invariants: single ember accent (≤2×/screen), Geist Sans + Mono, logical CSS
  properties (RTL first-class), anti-ai-slop checklist.
- Offer `npm run verify` (the `verify-routes` command) to render-check the new routes.
