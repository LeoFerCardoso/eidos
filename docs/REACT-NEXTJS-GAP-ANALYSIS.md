# React + Next.js Architecture — Gap Analysis & Re-architecture Proposal

> Assessment of the current forge-ds app against modern React + Next.js (App Router)
> best practices, with a concrete re-architecture of the DS site (file/folder structure,
> navigation, components, and the two-column page layout → reusable primitives).
> Date: 2026-05-20.

## TL;DR

> **Status update (2026-05-21): the migration described below is DONE through Phase 3.**
> The `window`-global bridge has been fully removed. Every DS page (131) and standalone
> example (21) is now an idiomatic **`'use client'` TSX module with a default export**
> importing from `@/ds/core`, resolved via generated registries (`MIGRATED`, `EXAMPLES_REG`)
> and rendered through Next nested layouts + reusable React primitives (`components/layout/*`,
> `components/docs/*`). `core/*` is a plain ES-module component layer (barrel `index.ts`).
> **SWC is on (no `.babelrc`)**; typed nav lives in `src/lib/nav.ts`. Remaining: Phase 4
> quality (type core props → blocking typecheck + lint, tests, `next/font`). The historical
> analysis below is kept for context.

The app **worked and rendered** as a deliberate **"pragmatic port"** of a browser-Babel
design system — that porting shortcut was the opposite of idiomatic Next.js. The whole DS
ran as **`window`-global IIFE modules** registered into a `window.PAGES` registry, loaded by
a **client-only runtime** through a **generated import manifest**, compiled with
**`next/babel`** (SWC disabled), in **`.jsx` with no types**. SSR/RSC, file-system routing,
type safety, and component modularity were all bypassed.

The good news: the design tokens, CSS, and visual system are excellent and the registry
pattern was salvageable. The work was to **lift the DS from "ported HTML app embedded in
Next" to "idiomatic App Router app"** — starting from the two-column shell, which became
**Next nested layouts + reusable React primitives** rather than a `window`-global IIFE.

Severity: **P0** = blocks calling this a professional Next.js codebase · **P1** = needed
for maintainability/scale · **P2** = polish.

---

## 1. Current architecture (honest snapshot)

| Aspect | Today |
|---|---|
| Routing | `app/page.tsx` + `app/[...slug]/page.tsx` → one client `DSRuntime` that reads a route key, dynamically imports the matching page module, renders it inside `window.DSShell`. **Not** file-system routing. |
| Rendering | 100% client-side. SSR emits a "Loading Forge…" splash; everything hydrates then imports core + page. No RSC, no streaming, no SSG. |
| Modules | `window.PAGES['slug'] = Comp`, `window.EXAMPLES`, `Object.assign(window,{Icons,DSShell,…})`. Shared code passed via `window`, not imports. `install-globals.ts` puts React/ReactDOM/Recharts on `window`. |
| Language | **162 `.jsx`/`.js`** vs **5 `.ts/.tsx`** in `src/ds`. No prop types, no typed nav, no typed registry. |
| Compiler | `next/babel` (`.babelrc`) — SWC disabled — because the ported JSX has constructs SWC rejects (e.g. a bare `>` in JSX text). Loses SWC speed + some Next features. |
| Components | Monolithic core: `blocks.jsx` 1053 lines, `primitives.jsx` 697, `atoms.jsx` 435, `shell.jsx` 305 — many components per file, all IIFE. |
| Layout | `DSShell` (one IIFE) builds the whole two-column app: `.ds-app` → `SideNav` (brand+search+nav+footer) + `.ds-main` → `Topbar` (breadcrumb + version pill + theme toggle) + `.ds-main-inner` (page). Re-mounts on every navigation (keyed by slug). |
| Styling | `ds.css` 3905 lines + `tokens.css` 1672 + `ai-shell.css` + `example-shell.css`, all global. Pages also use heavy **inline styles** (`style={{fontSize:12.5,...}}`). |
| Navigation | `nav-config.js` sets `window.SECTIONS`; `scripts/gen-manifest.mjs` turns it into `manifest.generated.ts`; links are `<a href=".../x.html">` intercepted by a document click handler → `router.push`. |
| Theme | Managed by hand inside `DSShell` (`documentElement.dataset.theme` + `localStorage`) + a no-FOUC inline script in `layout.tsx`. |
| State on navigate | Whole shell re-mounts per route (sidebar scroll, palette, theme state all re-init). |
| Tests / Storybook | None. |

---

## 2. Gap analysis by dimension

### A. Routing & rendering — **P0**
- **Gap:** A single catch-all + client `DSRuntime` + a hand-generated import manifest
  replaces Next's file-system router. No RSC, no SSG/ISR, no streaming, no per-route
  `metadata`/SEO, no `loading.tsx`/`error.tsx`, no nested layouts. First paint is a
  splash; the DS shell + page JS all ship to and run on the client.
- **Best practice:** One folder per route under `app/`, Server Components by default,
  Client Components only for interactivity, `generateStaticParams` for static docs,
  `metadata` per page, `loading`/`error` boundaries.
- **Recommendation:** Move to real routes (`app/(ds)/components/buttons/page.tsx`). Page
  prose/docs render as RSC (fast, SEO-able); live interactive demos are small client
  islands. Drop `DSRuntime` + the manifest generator once migrated.

### B. Module system — **P0**
- **Gap:** `window` globals for sharing components and React itself. This defeats
  tree-shaking, type-checking, IDE navigation, and SSR (window doesn't exist on server).
- **Best practice:** ES modules — `import { Button } from '@/components/ui/button'`.
- **Recommendation:** Convert core (`icons`, `atoms`, `primitives`, `blocks`, `charts`,
  `shell`) into real exported modules; delete `install-globals` and the `window` bridge.

### C. TypeScript — **P1**
- **Gap:** DS is `.jsx`/`.js`; no prop types, no typed nav tree, no typed component
  registry, `typescript.ignoreBuildErrors: true` in `next.config`.
- **Recommendation:** Author new components in `.tsx`; type the nav config and registry;
  drop `ignoreBuildErrors` for `app/` + `components/` (keep a temporary exemption only
  for not-yet-migrated legacy `src/ds/pages`).

### D. Compiler (Babel → SWC) — **P1**
- **Gap:** `.babelrc` disables SWC for the whole project (slower builds, no `next/font`,
  weaker Fast Refresh) — a workaround for ported JSX. The Forge banner even says "It
  looks like there is a custom Babel configuration that can be removed."
- **Recommendation:** Fix the source (JSX-text `>`/`<` escaping, etc.) during migration so
  SWC parses cleanly, then delete `.babelrc`.

### E. Component modularity — **P1**
- **Gap:** 1053-line `blocks.jsx`, 697-line `primitives.jsx` — dozens of components per
  file, no co-location, no per-component story/demo/test.
- **Best practice (shadcn/registry model):** one component per file under
  `components/ui/`, demos co-located, exported and typed.
- **Recommendation:** Split into `components/ui/*` (atoms/primitives) and
  `components/blocks/*` (IDP blocks), one file each, with an index barrel per folder.

### F. The two-column DS layout → reusable primitives — **P0 (your focus)**
- **Gap:** The entire two-column app (sidebar + header-with-breadcrumb/badge/theme +
  content) is a single `DSShell` IIFE that re-mounts on every navigation and reads
  `window.PAGE_SLUG`/`window.SECTIONS`. Not reusable, not composable, loses sidebar scroll
  position and palette/theme state on each navigation.
- **Best practice:** Persisted **nested layout** (`app/(ds)/layout.tsx`) that renders the
  chrome once and swaps only the page content; chrome decomposed into small, typed,
  single-responsibility components.
- **Recommendation — decompose into:**
  | Component | Responsibility | Type |
  |---|---|---|
  | `DocsLayout` (`app/(ds)/layout.tsx`) | The two-column grid; renders once, persists across nav | Server (shell) |
  | `Sidebar` | Left rail container | Client (scroll/active) |
  | `SidebarBrand` | Flame mark + name + version sub-text | Server |
  | `SidebarSearch` | ⌘K trigger | Client |
  | `NavTree` / `NavGroup` / `NavItem` | Render the typed nav config; active state via `usePathname()` | Client |
  | `Topbar` | Header row container | Server |
  | `Breadcrumb` | Derived from the route segment + nav metadata | Server (data) |
  | `VersionBadge` | The "vX · Stable" pill | Server |
  | `ThemeToggle` | Dark/light switch | Client (via `next-themes`) |
  | `CommandPalette` | ⌘K fuzzy nav | Client |
  | `TableOfContents` | Right-rail "on this page" (new) | Client |
  Breadcrumb/badge/theme become **props-driven** components fed by route metadata, not by
  `window.PAGE_SLUG`. The layout uses Next `<Link>`; active state from `usePathname()`.

### G. Styling — **P1**
- **Gap:** 3905-line global `ds.css` + pervasive inline styles in pages
  (`style={{fontSize:12.5,color:'var(--fg-muted)',marginTop:14}}`). Hard to maintain,
  no co-location, no dead-code elimination.
- **Recommendation:** Keep `tokens.css` as the design-token source of truth. Move
  component CSS to **CSS Modules co-located** with components (or adopt Tailwind v4 mapped
  to the tokens — see `vercel:shadcn`/`vercel:nextjs`). Replace repeated inline styles with
  typography/utility classes (`.t-h2`, `.ds-caption`, etc. already exist in `tokens.css`).

### H. Navigation as typed data — **P1**
- **Gap:** `nav-config.js` (untyped) → `window.SECTIONS` → a separate generated manifest;
  links are `.html` hrefs intercepted at the document level.
- **Recommendation:** A single typed `nav.ts` (`type NavItem = { slug; label; href;
  group; badge? }`) consumed directly by the Sidebar, Breadcrumb, CommandPalette, and
  `generateStaticParams`. Native Next `<Link href={item.href}>` — no click interception,
  no manifest.

### I. Folder structure — **P1**
- **Gap:** `src/ds/{core,pages,examples,runtime}` + a generated manifest is a port
  artifact, not a Next structure.
- **Recommendation (target):**
  ```
  app/
    (ds)/                      # route group: the documented design system
      layout.tsx               # the two-column DocsLayout (persisted)
      page.tsx                 # Introduction
      components/<slug>/page.tsx
      foundations/<slug>/page.tsx
      charts/… elements/… ai/… patterns/… resources/…
    examples/<slug>/page.tsx   # standalone IDP screens (own minimal layout)
    ai-chat/                   # already idiomatic — the model to follow
    layout.tsx · globals.css
  components/
    layout/                    # DocsLayout, Sidebar, Topbar, Breadcrumb, VersionBadge, ThemeToggle, CommandPalette, TableOfContents
    ui/                        # atoms + primitives (one per file)
    blocks/                    # IDP blocks (data-table, pipeline, log-viewer, …)
    charts/                    # Recharts wrappers
    docs/                      # Frame, Anatomy, DecisionMatrix, DoDont, PropsTable (the doc-page building blocks)
  lib/
    nav.ts                     # typed navigation tree (single source of truth)
    mocks.ts · utils.ts
    ai/                        # already here
  content/ or registry/        # component demos + metadata (shadcn-style registry)
  styles/                      # tokens.css (+ globals); component CSS co-located as *.module.css
  ```

### J. Theme — **P2**
- **Gap:** Hand-rolled theme in `DSShell` + a no-FOUC inline script.
- **Recommendation:** `next-themes` `ThemeProvider` (`attribute="data-theme"`,
  `disableTransitionOnChange`), keeping the tokens. Removes the manual `localStorage`/
  `dataset` juggling and the FOUC script.

### K. Content/demos model — **P1**
- **Gap:** Each page JSX hand-codes prose + live demo + code string + Do/Don't inline. No
  separation of "the component" from "its documentation".
- **Recommendation:** A **registry** (à la shadcn): `registry/<name>/{component.tsx,
  demo.tsx, meta.ts}`. Doc pages render `<ComponentPreview name="button" />` which pulls
  the live demo + source from the registry — DRY, and the same registry can power a
  future `npx forge add button` CLI.

### L. Testing & quality — **P1**
- **Gap:** No unit/component/e2e tests, no Storybook, ESLint ignored at build.
- **Recommendation:** Vitest + Testing Library for `components/ui`; Playwright smoke over
  routes (promote `scripts/verify-render.mjs`); optional Storybook for the DS. Re-enable
  ESLint/TS on `app/` + `components/`.

### M. Performance — **P2**
- **Gap:** Client loads the DS core + page per route; no RSC; fonts via raw `<link>`.
- **Recommendation:** RSC for static docs (ship less JS), `next/font` for Geist
  (self-host, no CLS), keep per-route code-splitting. See `vercel:performance-optimizer`.

---

## 3. The DS page architecture, re-designed (your example, concretely)

Today: `DSShell` (IIFE) builds `.ds-app` [ `SideNav` | `.ds-main`( `Topbar` + content ) ]
and re-mounts wholesale per navigation.

Proposed:

```
app/(ds)/layout.tsx                 ← DocsLayout: renders ONCE, persists across nav
  <div class="ds-app">
    <Sidebar>                       ← left column (persisted scroll + active state)
      <SidebarBrand version=… />
      <SidebarSearch onOpen=… />    ← opens <CommandPalette/>
      <NavTree items={nav} />       ← typed nav.ts, active via usePathname()
    </Sidebar>
    <div class="ds-main">           ← right column
      <Topbar>
        <Breadcrumb segments=… />   ← derived from route + nav metadata
        <VersionBadge/>             ← "v1.8 · Stable"
        <ThemeToggle/>              ← next-themes
      </Topbar>
      <main>{children}</main>       ← ONLY this swaps on navigation
    </div>
    <CommandPalette/>
  </div>

app/(ds)/components/buttons/page.tsx ← RSC: title + prose + <ComponentPreview name="button"/>
                                       (live demo = small client island from the registry)
```

Wins: sidebar scroll/active, theme, and palette state persist across navigation (Next
nested layout); breadcrumb/badge/theme are reusable typed components; pages become small
and declarative; static docs render on the server (fast, indexable).

---

## 4. Migration strategy (incremental — don't big-bang 160 pages)

**Strangler pattern**, so the app keeps working throughout. **Hard rule learned in P0:
never reinvent the approved visual — reuse `ds.css`/tokens + the original components; new
pages port the JSX body verbatim.**

- **Phase 0 — Idiomatic layout pilot. ✅ DONE.** `components/layout/*` (DocsShell, Sidebar,
  NavTree, Topbar, Breadcrumb, VersionBadge, ThemeToggle, CommandPalette) as real `.tsx`
  using the original `.ds-*` classes + `ForgeMark`/`Icons`; typed `lib/nav.ts`;
  `app/(ds)/layout.tsx`. **All** DS pages now render inside the **persisted** `(ds)`
  DocsShell via `app/(ds)/[...slug]` → `DSPageLoader` (original components) → **SPA nav**
  (sidebar keeps scroll + selection; only the right column swaps). Examples moved to
  standalone `/example/<name>`. Theme via `next-themes`. shadcn scaffolding removed
  (Forge is the component library); Tailwind v4 + token utilities kept for new code.
- **Phase 1 — Doc primitives + migration mechanism. ✅ DONE.** `components/docs/*` exposes
  the reusable authoring primitives as clean TSX (`Section`, `SubHead`, `Frame`,
  `PropsTable`, `TokenSwatch`, `SpecRow`, `CopyButton` real TSX; `CodeBlock`/`TabbedCode`/
  `CollapsibleCode` + `Icons` as thin wrappers over the window originals → identical, the
  highlighter is ported in P3). `src/ds/migrated/registry.ts` + `DSPageLoader` prefer an
  idiomatic TSX page when a slug is registered, else the bridge — both in the persisted
  SPA shell. **`buttons` migrated** (verbatim body, swapped to primitive imports + `Icons`
  proxy) as the proof: 13 frames, 45 `.btn`, props table, install tabs — parity held.
- **Phase 2 — Batch-migrate the rest. ✅ DONE — all 131 DS pages migrated.** All
  Foundations, Charts, Elements, Patterns, and ALL Components (Form&Input, Layout&Nav,
  Overlays, IDP-Blocks, Feedback, Display, Misc), AI, Get-Started (incl. `overview` home and
  `components-catalog`), Resources are idiomatic TSX in `src/ds/migrated/<routeKey>.tsx`
  importing from `@/ds/core`. `overview`/`components-catalog` read the typed `NAV`/`NAV_FLAT`
  from `@/lib/nav` (no more `window.SECTIONS`). Build green (157 routes); 0 render failures.
- **Phase 3 — component layer → TSX + cut the bridge. ✅ DONE.** All six core modules are
  idiomatic TSX **ES modules** (`icons`, `mocks`, `charts`, `atoms`, `primitives` incl. the
  syntax highlighter, `blocks`); `index.ts` is a pure barrel (`export *`). `charts` `import`s
  `recharts`. **The `window` bridge is gone:** removed `install-globals`, `manifest.generated`
  + `gen-manifest`, the `DSPageLoader` window branch, every `Object.assign(window, …)` and
  residual `window.MOCKS`/`window.Icons`/`window.SECTIONS` read in core, the legacy
  `src/ds/pages/**` + `src/ds/examples/*.jsx` + `core/shell.jsx`. **`.babelrc` removed → SWC
  is back on** (build green, no Babel). The 21 standalone examples are idiomatic TSX
  (`src/ds/examples/<name>.tsx`, default export) resolved via a generated `EXAMPLES_REG`;
  the two shells (`example-shell.tsx`, `ai-shell.tsx`) are ES modules importing from
  `@/ds/core`. `package.json` is marked `sideEffects: ["*.css"]` so the core barrel
  tree-shakes (recharts only in chart-page chunks). (`nav-config.js` stays JS — it is the
  build-time input to `gen-nav.mjs`.)
- **Phase 4 — Quality. ⏳ PARTIAL.** Genuine JSX parse bugs fixed (escaped `>`); `tsc`
  wired as a **non-blocking** CI job (`typecheck`) — ~1.8k missing-prop errors remain because
  the verbatim-ported core components don't yet type their props as optional (a separate,
  incremental typing pass; `next build` stays the gate via `ignoreBuildErrors`). Still TODO:
  type core component props (drive the typecheck job to zero, then make it blocking + enable
  `next lint`), Vitest + Playwright (promote `verify-render.mjs`), `next/font` for Geist.

Use the harness: the `frontend-engineer` / `design-system-engineer` subagents, the
`vercel:nextjs` / `vercel:react-best-practices` skills, and update `new-component` /
`new-page` to emit the idiomatic structure (`src/ds/migrated/*` + `components/docs`).

---

## 5. Decisions to make

1. **Styling system:** keep hand-authored `ds.css` + CSS Modules, **or** adopt **Tailwind
   v4** mapped to `tokens.css` (shadcn-aligned, biggest ecosystem). Recommended: Tailwind
   v4 + tokens for new components; keep `tokens.css` as the token source.
2. **Pages as `.tsx` vs MDX:** TSX (full control, live demos) vs MDX (prose-first). Docs
   sites often go MDX + embedded components. Recommended: TSX + a registry for demos;
   revisit MDX if prose grows.
3. **Scope/pace:** incremental strangler (recommended) vs a clean-room rebuild of the DS
   site. Incremental keeps it shippable.
4. **Examples:** keep standalone (`app/examples/<slug>`) with a minimal layout, distinct
   from the docs `(ds)` group. Recommended yes.

---

## 6. Quick wins vs big rocks

- **Quick wins (low risk, high signal):** `next/font` for Geist; `next-themes`; a typed
  `lib/nav.ts`; extract `Breadcrumb` + `VersionBadge` + `ThemeToggle` as standalone `.tsx`
  used by the current shell; re-enable ESLint on `app/` + `components/`.
- **Big rocks:** file-system routing migration; killing the `window` bridge; splitting
  `ds.css`/`blocks.jsx`; the registry. These are the Phase 1–3 work above.
