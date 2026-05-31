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

This repo renders the whole DS through a single catch-all App Router route:
`app/[[...slug]]/page.tsx`, fed by the manifest generated from
`src/ds/core/nav-config.js`. A "portal/section" here means a new top-level **nav group**
(or sub-group) plus its pages — not a parallel Next.js app.

## 1. Understand the wiring (read first)

- `app/layout.tsx`, `app/globals.css`, `app/[[...slug]]/page.tsx` — the catch-all route
  + global stylesheet. DS routes resolve via `src/ds/runtime/manifest.generated.ts`.
- `src/ds/core/index.ts` — core load order
  (install-globals → mocks → nav-config → icons → atoms → primitives → blocks → charts → shell).
- `src/ds/core/shell.jsx` — the `DSShell`, sidenav (`NavGroup`/`NavLink`), topbar, ⌘K
  palette. New groups render automatically from `SECTIONS.groups`.
- `src/styles/tokens.css` + `src/styles/ds.css` — the design system; compose these.
- `${CLAUDE_PLUGIN_ROOT}/design-systems/forge/DESIGN.md` + `${CLAUDE_PLUGIN_ROOT}/craft/anti-ai-slop.md`.

## 2. Register the section in nav-config.js

Add a new group object to `window.SECTIONS.groups` in `src/ds/core/nav-config.js`:
- FLAT: `{ group: 'My Portal', items: [ { id, label, href }, ... ] }`
- NESTED: `{ group: 'My Portal', subgroups: [ { subgroup: '...', items: [...] } ] }`

Each item `href` is `pages/<group-slug>/<slug>.html` (or `pages/examples/<name>.html`
with `external: true` for standalone screens). `id` MUST match the registry key the
page module uses. Badge policy: only mark `new`/`updated` for items that actually moved
this release.

## 3. Create the page modules

For each route, add `src/ds/pages/<group-slug>/<slug>.jsx` that registers
`window.PAGES['<slug>'] = Component;` (template: `src/ds/pages/components/buttons.jsx`),
or `src/ds/examples/<name>.jsx` registering `window.EXAMPLES['<name>']` for shell-less
screens. Build by composing existing primitives pulled from `window`; reuse
`FShell`/`FPageHeader` for product surfaces. Never write per-page `<style>`.

## 4. Regenerate + verify

- Run `node scripts/gen-manifest.mjs` (auto-run by `npm run dev`/`build`) — this rebuilds
  `manifest.generated.ts` so every new route + its sidebar entry resolves. Skipping it =
  404s and missing nav links.
- Keep Eidos invariants: single ember accent (≤2×/screen), Geist Sans + Mono, logical CSS
  properties (RTL first-class), anti-ai-slop checklist.
- Offer `npm run verify` (the `verify-routes` command) to render-check the new routes.
