---
name: docs-page
description: |
  Build a documentation page in the Forge DS docs site — a prose/guide page
  (concepts, getting-started, foundations, API reference, tutorial) rendered in
  the DS shell with inline-start nav and an inline-end "On this page" TOC. Use
  when the request is "docs page", "documentation", "guide", "API reference", or
  "tutorial". To document a single component with live demos, use
  `component-page` instead.
allowed-tools: Read, Edit, Write, Bash, Grep, Glob
---

# Docs Page Skill

Build a documentation page as a real page in the Forge DS site, composing the
DS shell and prose primitives — never per-page `<style>`. The page registers
itself in `window.PAGES['<slug>']` like every other DS page.

## Required pre-reading

1. `component-page` SKILL — the 3-file ritual, JSX page structure, and the
   shared hard rules. A docs page is the prose sibling of a component page.
2. `../../FORGE-DS-REFERENCE.md` + `../../llms.txt` — confirm the prose, code,
   callout/alert, and table classes you'll use already exist.
3. `../../design-systems/forge/DESIGN.md` and
   `../../craft/{typography,rtl-and-bidi,accessibility-baseline,color}.md`.
4. An existing page under `src/ds/pages/get-started/` or
   `src/ds/pages/foundations/` as a template for prose-heavy layout.

## The 3-file ritual (registering the page)

1. Append `{ id, label, href }` in `src/ds/core/nav-config.js` — correct group
   (Get Started / Foundations / Resources for prose), correct order. `id` MUST
   match the page slug.
2. Create `src/ds/pages/<group>/<slug>.jsx` that registers
   `window.PAGES['<slug>'] = Component` (model on an existing page IIFE).
3. Run `npm run gen:manifest` so the route map regenerates.

## Page structure

Express the layout on the **inline axis** so it flips correctly under
`dir="rtl"`:

- **Inline-start nav** — provided by the DS shell; your page only adds its own
  nav entry (step 1). Current page is marked with an inline-start accent edge.
- **Article body** (max-width ~68–72ch / 60–75 chars per line): H1, a lede
  paragraph, H2/H3 sections with anchor IDs, code blocks, callouts (note /
  warning), inline links, lists, at least one table.
- **Inline-end TOC** ("On this page") — H2/H3 anchors, current section
  highlighted on scroll. Use the DS TOC pattern if one exists; otherwise compose
  a sticky list.

## Prose quality

- Write real, believable docs — concrete API/command names, plausible
  parameters, at least one shell command, one code snippet (5–15 lines), one
  callout, one table. No generic placeholder copy.
- **Code blocks** use the DS mono token (Geist Mono via `var(--font-mono)`),
  a soft surface fill, and a copy affordance — not generic `monospace`.
- Body wraps at the DS line-length sweet spot; accent is restrained (active nav
  item, links, one callout border) — never on body text.

## Hard rules

- **Never per-page `<style>`.** Compose `.surface .ds-frame .badge .tbl .menu`
  + prose/code classes + tokens; extend `tokens.css`/`ds.css` only for a real
  gap.
- **Ember `#FF6B35` / `var(--accent)` ≤ 2× per screen.**
- **Geist Sans for prose, Geist Mono for code/captions/eyebrows.**
- **Logical CSS properties everywhere** (`margin-inline-start`,
  `border-inline-start`, `inset-inline-end`, `text-align: start`) so the rails
  and accent edge flip under `dir="rtl"`. Include an RTL check.
- Page is readable at 1280w and collapses gracefully below ~900w (TOC drops,
  nav becomes a drawer). Run the anti-ai-slop P0 list before finishing.
