# eidos

Two things live in this repo:

1. **The Eidos Design System app** — the multi-page DS documentation site
   (Introduction, foundations, ~80 components, charts, elements, AI surfaces,
   patterns, and full IDP example screens), ported from the original Open Design
   project into a runnable **Next.js (App Router)** app.
2. **`.claude/`** — an engineering harness extracted from the Open Design app
   (subagents, skills, commands, hooks, and the design-systems/craft knowledge), so
   you can produce professional, structured UI artifacts from Claude Code in the
   terminal instead of the Open Design desktop app.

## Run the app

```bash
npm install
npm run dev      # regenerates the typed nav + page/example registries, then starts Next on :3000
```

Open <http://localhost:3000> — it lands on the **Introduction** page inside the DS
shell. Use the sidebar, the ⌘K palette, or the Components catalog to navigate; every
page, chart, element, AI surface, and example screen is wired up.

## Project layout

```
eidos/
├── app/                        # Next.js App Router
│   ├── layout.tsx              #   <html>, fonts, theme no-FOUC, DS stylesheets
│   ├── (ds)/layout.tsx         #   persisted two-column DocsShell (sidebar + topbar)
│   ├── (ds)/page.tsx           #   home → Introduction (DSPageLoader, route "")
│   ├── (ds)/[...slug]/page.tsx #   catch-all → DSPageLoader for every other DS route
│   ├── example/[name]/page.tsx #   standalone IDP screens (ExampleLoader, full-screen)
│   └── ai-chat/                #   reference chat-with-agents (page + api/chat route)
├── src/
│   ├── components/
│   │   ├── layout/             #   DocsShell, Sidebar, Topbar, Breadcrumb, DSPageLoader, ExampleLoader, …
│   │   └── docs/               #   doc-authoring primitives (re-export @/ds/core)
│   ├── ds/
│   │   ├── core/               #   icons, atoms, primitives, blocks, charts, mocks, nav-config (+ index barrel) — plain ES modules
│   │   ├── migrated/           #   131 idiomatic TSX DS pages (default export) + generated registry.ts
│   │   └── examples/           #   21 standalone IDP screens (TSX) + example-shell/ai-shell + generated registry.ts
│   ├── lib/                    #   nav.ts (generated typed nav) + ai/ (AI SDK v6 agent + Gateway helpers)
│   └── styles/                 #   tokens.css, ds.css, ai-shell.css, example-shell.css (verbatim)
├── .claude/                    # THE HARNESS — everything Claude Code uses (see .claude/README.md)
│   ├── agents/ · skills/ · commands/ · hooks/ · output-styles/ · settings.json
│   ├── design-systems/forge/   #   the single canonical brand
│   └── craft/                  #   8 brand-agnostic craft rulebooks
├── .claude-plugin/             # marketplace manifest (distribute the harness)
├── scripts/                    # gen-nav, gen-migrated, gen-examples, verify-render, build-plugin
├── EIDOS-DS-REFERENCE.md       # full DS catalog (tokens/classes/components/icons/pages)
├── llms.txt                    # DS catalog index (read first when authoring DS pages)
└── docs/                       # gap analysis, routines, original DS authoring notes
```

## How it renders

Every DS page is an idiomatic **`'use client'` TSX module with a `default export`**
(`src/ds/migrated/<slug>.tsx`) that imports its primitives from `@/ds/core`. The page
renders inside the persisted `(ds)` DocsShell via **`DSPageLoader`**, which resolves the
component from the generated **`MIGRATED`** registry — so navigating the sidebar only swaps
the right column (SPA; the menu keeps its scroll + selection). Standalone IDP screens are
the same idea outside the shell: `src/ds/examples/<name>.tsx` (default export), resolved by
**`ExampleLoader`** from the generated **`EXAMPLES_REG`**, full-screen at `/example/<name>`.

`src/ds/core/*` is a plain ES-module component layer (`icons`/`atoms`/`primitives`/`blocks`/
`charts`/`mocks`), with `index.ts` as a barrel (`export *`). There is **no `window` bridge
and no Babel** — the project compiles with **SWC**. Typed navigation lives in
`src/lib/nav.ts` (generated from `nav-config.js`); `package.json` is marked
`sideEffects: ["*.css"]` so the core barrel tree-shakes (recharts ships only in chart-page
chunks). The DS renders on the client; SSR shows a brief loading splash by design.

> Add or change a DS page → edit `src/ds/core/nav-config.js` + add the matching
> `src/ds/migrated/<slug>.tsx` (default export, imports from `@/ds/core`); the `dev`/`build`
> scripts regenerate `nav.ts` + the registries automatically.

## The harness

The whole engineering harness lives in **`.claude/`** — see [`.claude/README.md`](./.claude/README.md).
It gives Claude Code 8 subagents (`.claude/agents/`), workflow + AI + web/DS skills
(`.claude/skills/`, with the Open Design long-tail quiet in `_library/`), commands, hooks,
and the three knowledge axes — **skills** (artifact shape), **design-systems** (brand;
`eidos/` canonical), and **craft** (universal rules). `npm run build:plugin` packages it
for team distribution. Start a design task by invoking the matching skill.

## Credit

The DS app and the harness toolkit are adapted from the **Open Design** app. The
`.claude/craft/` files are adapted from the MIT
[refero_skill](https://github.com/referodesign/refero_skill) project.
