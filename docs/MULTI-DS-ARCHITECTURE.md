# Eidos — Multi-Design-System architecture

Eidos is a **family of design systems** that share one base. The **core** DS owns the
brand: tokens (`tokens.css`), the component primitives (`@/ds/core`), the single ember
accent, and the foundations. Every **sub-DS** inherits all of that and *only adds* its
domain components, patterns, and examples — it never forks tokens or introduces a new
accent.

```
Eidos (core)          /              Introduction · Foundations · Primitives · Resources
├─ Eidos Charts       /charts/*      data-viz components + overview
├─ Eidos AI           /ai/*          chat, streaming, markdown, tools, agents, contexts (+ examples)
├─ Eidos IDP          /idp/*         Blocks + Elements (+ IDP example screens)
├─ Eidos Patterns     /patterns/*    decorative textures & effects
└─ Eidos Mobile       /mobile/*      touch-first surfaces (scaffold)
```

## The registry

`src/ds/core/design-systems.js` (build-time data, like `nav-config.js`) exports
`DESIGN_SYSTEMS` — an ordered list of `{ id, label, tagline, basePath, icon, home,
migrated }`:

- **`basePath`** — the routed prefix. `core` is `''` (lives at the root); sub-DSs live
  under `/<basePath>/…`.
- **`home`** — the slug a switch lands on (`''` → `/` for core; `overview` for sub-DSs →
  `/<basePath>/overview`).
- **`icon`** — a key in the core `Icons` set (core renders the `ForgeMark`).
- **`migrated`** — the incremental-migration flag. While `false`, the DS stays at flat
  routes (its pages haven't moved yet); `gen-nav` only applies the `/<basePath>/` prefix
  once it's `true`. This is what let each DS migrate without ever breaking the running app.

## Navigation

`nav-config.js` holds the groups; each is assigned to a DS by an explicit `ds:` field or
the `GROUP_DS` map. `scripts/gen-nav.mjs` reads both files and emits `src/lib/nav.ts`:

- `DESIGN_SYSTEMS`, `NAV` (every group, tagged with `ds`), `NAV_BY_DS` (groups per DS),
  `NAV_FLAT` (every leaf + `ds`), `dsHref(ds)`, and `navForPath(pathname) → { item, ds, trail }`.

The **active DS** is derived from the route (`useActiveDs()` → `navForPath`). The sidebar
renders `NAV_BY_DS[activeDs]`; the breadcrumb is prefixed with the DS label; `⌘K` shows
each result's DS (search stays global).

## The switcher

`DsSwitcher` (sidebar header) shows the current DS (ember tile + name + tagline + `…`) and
opens a dropdown of the family; selecting one navigates to `dsHref(ds)` and the nav
re-scopes. The tile glyph inherits `currentColor` (= `var(--bg)`) so it flips dark/light
with the theme.

## Pages & routing

- Core pages: `src/ds/migrated/<slug>.tsx` → `/<slug>`.
- Sub-DS pages: `src/ds/migrated/<ds>/<slug>.tsx` → `/<ds>/<slug>`.
- All are `'use client'` modules with a `default export`, importing from `@/ds/core`.
- `scripts/gen-migrated.mjs` scans `migrated/**` recursively; the key is the path
  (`charts/area`). `DSPageLoader` resolves `MIGRATED[routeKey]` inside the persisted `(ds)`
  DocsShell; `app/(ds)/[...slug]` derives `generateStaticParams` from the registry.
- Standalone example screens stay flat at `/example/<name>` (`EXAMPLES_REG`); they're
  listed under whichever DS owns them.

## Adding a page / a DS

1. **Page** — add it to the right DS section in `nav-config.js` (local `id`), then drop
   `src/ds/migrated/<ds>/<slug>.tsx`. The gen scripts run on `dev`/`build`.
2. **New DS** — add an entry to `DESIGN_SYSTEMS` (with `migrated: false` until its pages
   move), add its group(s) to `nav-config.js`, create `migrated/<ds>/overview.tsx`, then
   flip `migrated: true`.
3. **Restart `next dev`** after either — `generateStaticParams` is read once at startup and
   `dynamicParams=false`, so new routes return 404 until a restart. Never run `next build`
   while `next dev` is running (they share `.next`).
