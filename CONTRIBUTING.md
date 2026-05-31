# Contributing to Eidos DS

Eidos is a **family of design systems** on one token base (core + charts · ai · idp · patterns ·
mobile · blocks). This repo holds the runnable docs app and the `.claude/` engineering harness.
Read **`CLAUDE.md`** (session rules) and **`docs/DS-PAGE-STANDARD.md`** (page anatomy) first.

## Adding or changing a page / component

1. **Use the skill.** New component page → the `new-component` skill; full screen → `new-page`;
   polish → `refine`/`tweaks`. They encode the route ritual and the page standard.
2. **Route ritual.** Add the entry to the right DS section in `src/ds/core/nav-config.js`, then
   add `src/ds/migrated/<slug>.tsx` (core) or `src/ds/migrated/<ds>/<slug>.tsx` (sub-DS) —
   `'use client'`, default export, primitives from `@/ds/core`. The gen scripts auto-run on
   `dev`/`build`. **Restart `next dev` after nav/DS changes** (`generateStaticParams` is read once).
3. **Follow the page standard** (`docs/DS-PAGE-STANDARD.md`): header lede ≤ 2 lines; sections in
   order (Installation → Usage → Variants/States → Accessibility → RTL → Anatomy → Do/Don't →
   API reference); **visual Anatomy** (numbered pins + legend), a real **Accessibility** section,
   and an RTL frame. API tables use **`<AutoPropsTable component="X"/>`** (generated from the typed
   props) for real core components.
4. **Compose, never reinvent.** Reuse core primitives/atoms; sub-DSs only add domain components.
   Tokens, the ember accent, and primitives always come from core.

## Invariants (non-negotiable)

- **Contrast:** any foreground on a colored/elevated surface gets an explicitly contrasting color;
  on ember fills the ink is dark (`--ember-fg`/`--bg`), never ember-on-ember.
- Single ember accent (`--accent`), ≤ 2×/screen. Geist Sans/Mono. Logical CSS properties (RTL).
- No per-page `<style>`; compose existing classes or extend `tokens.css`/`ds.css`.
- Type scale is fixed (11·13·15·17·20·28·36·56·72) — no hand-rolled font sizes in page chrome.
- Anti-AI-slop checklist (`.claude/craft/anti-ai-slop.md`).

## Gates (all must pass before merge)

| Command | Checks |
|---|---|
| `npm run build` | Compiles every route (SWC) **and type-checks** (`tsc` is blocking — keep it 0). |
| `npm run typecheck` | TypeScript across the repo. |
| `npm run verify -- <routes>` | Headless render: shell present, no exceptions, no console errors. |
| `npm run check:nav` | Every nav link resolves to a page; no orphaned pages (CI `--strict`). |
| `npm run check:frames` | Frame/CodeBlock snippets parse as valid TSX (advisory). |
| `npm run check:a11y` | axe-core WCAG 2.1 A/AA (structural gates `--strict`; contrast advisory). |
| `npm run check:visual` | Pixel-diff vs baselines (`--update` to reseed after intended changes). |

CI runs these in `.github/workflows/ci.yml`. Tokens: `npm run gen:tokens`. Props table data:
`npm run gen:props` (after changing a component's prop types or JSDoc).

## Releases

`/release [major|minor|patch]` bumps `DS_VERSION` (`src/lib/site.ts`) + the changelog. See
`docs/DISTRIBUTION.md` for the source-shipped distribution model.
