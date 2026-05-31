---
name: new-component
description: |
  Create a new Eidos DS component documentation page (a page under
  src/ds/migrated/, core or sub-DS). Use when the request is "document component X",
  "new component page", "add X to the design system", or "create a doc page for Y".
  Encodes the current route ritual (migrated TSX + gen-migrated + nav-config), the
  buttons.tsx template, the required doc sections incl. RTL, and the typography rules.
  Do NOT use for full product screens (use new-page) nor for editing existing component CSS.
argument-hint: "[component-name]"
allowed-tools: [Read, Edit, Write, Bash, Grep]
---

# new-component — author a Eidos DS component doc page

The design system (`src/styles/tokens.css` + `src/styles/ds.css`) IS the product.
Your job is to **demonstrate existing classes/primitives by composition** — never
write per-page `<style>`, never reinvent a class that already exists, and never
hand-roll a font size for prose.

## 1. Pre-read (do not skip)

- `.claude/skills/component-page/SKILL.md` — the canonical content workflow + checklist.
- **`docs/DS-PAGE-STANDARD.md`** — section order (§2.2), **typography (§3.5)**, **required RTL (§3.6)**.
- `.claude/design-systems/forge/DESIGN.md` — brand: ember budget, Geist, density, motion.
- `.claude/craft/`: `typography.md`, `color.md`, `anti-ai-slop.md`, `accessibility-baseline.md`,
  `rtl-and-bidi.md`, `state-coverage.md`.
- `FORGE-DS-REFERENCE.md` + `llms.txt` — confirm every class/icon you'll use already exists.
- **`src/ds/migrated/buttons.tsx`** — the canonical page template. Read it fully; mirror its
  structure AND its typography (`<Lede>` / `<Mono>`, not inline styles).

## 2. The route ritual (current architecture — NO `window.PAGES`, NO `.jsx`, NO `gen-manifest`)

For component slug `<slug>` in design system `<ds>` (`core` is flat; sub-DS is namespaced):

1. **Register the route** — edit `src/ds/core/nav-config.js`. Add
   `{ id:'<slug>', label:'<Label>', href:'pages/<ds>/<slug>.html', badge:'new' }` into the correct
   `ds:`-tagged group. `id` MUST equal the file slug.
2. **Create the page module** — `src/ds/migrated/<ds>/<slug>.tsx` (core: `src/ds/migrated/<slug>.tsx`):
   ```tsx
   'use client';
   import { Section, SubHead, Frame, Lede, Mono, PropsTable, Icons } from '@/ds/core';
   export default function <Name>() { return ( <Section id="<slug>" num="01" title="<Label>" desc="…"> … </Section> ); }
   ```
3. **Regenerate + restart** — `node scripts/gen-nav.mjs && node scripts/gen-migrated.mjs` (also
   auto-run by `npm run dev`/`build`). Then **restart `next dev`** — new routes 404 until restart
   (`generateStaticParams` read once; `dynamicParams=false`).

## 3. Required doc sections (follow `buttons.tsx` ordering)

1. **Installation** — `TabbedCode`/`ComponentInstall` (or the import/`className` for Mobile/Patterns).
2. **Usage** — minimal `<Frame label code>` with import + render.
3. **Variants / Sizes / States** — **live UI** per axis, each a `<Frame label code>`.
4. **Accessibility** — keyboard/ARIA/contrast/reduced-motion; 44px targets on mobile. *(Required.)*
5. **RTL** — a live `dir="rtl"` `Frame` (Arabic copy) + a `<Lede>` naming what mirrors; directional
   icons get `transform: scaleX(-1)`. *(Required — §3.6.)*
6. **Anatomy** — **visual**: `.ana > .stage` with numbered `.pin`s + `.lead`s + `.ana-list` legend.
7. **Do / Don't** — `.dd-grid`, each card a **live rendered** good vs bad + a `.note` (failure → fix).
8. **API reference** — `PropsTable`.

Cover all relevant states (default/hover/focus/disabled/loading/invalid/empty/error) per `state-coverage.md`.

## 4. Typography — primitives only (§3.5)

- Section intros → `<Lede>` (`<Lede up>` right after a `SubHead`). Inline code refs → `<Mono>`.
- Page header (eyebrow + H1 + page-lede) comes from `<Section>`; section headings from `<SubHead meta>`.
- **Zero literal `font-size` for prose.** If tempted, use `<Lede>` / `<Mono>` / a `--text-*` token.

## 5. Compose, don't invent

Use existing class systems: `.btn .pill .surface .ds-frame .ds-grid .in-* .fc-* .cb-* .menu .tt
.badge .avatar .tbl`. Only extend `tokens.css`/`ds.css` for a genuinely new building block — and say so.

## 6. Verify before finishing

- Run the component-page checklist **including anti-ai-slop** and the §3.5/§3.6 typography + RTL gates.
- Ember ≤2×/screen; no Tailwind indigo; no emoji feature icons; dark ink on every ember fill.
- `npm run verify` (headless render check) returns the route with no page errors.
- Bump `DS_VERSION` in `src/lib/site.ts` + add a `migrated/<ds>/changelog.tsx` entry.
- Sanity-check gotchas in `docs/FORGE-DS-AUTHORING.md`: black screen (missing `Icons.x`), doubled
  focus ring, dropdown clipped by `.ds-frame{overflow:hidden}`, multi-fire onChange, 404 (forgot to restart dev).
