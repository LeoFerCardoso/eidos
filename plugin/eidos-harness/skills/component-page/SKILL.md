---
name: component-page
description: The structure + rules a Eidos DS component documentation page must follow — live Frame, Anatomy, Decision matrix, Do/Don't with live UI, and an RTL example, composed only from existing Eidos classes. Use when documenting a component or reviewing a component page for completeness. For the step-by-step "create a new page" mechanics use `new-component`; for full product screens use `idp-screen`.
allowed-tools: [Read, Edit, Write, Bash, Grep]
---

# Component Page Skill

Produces (or reviews) a Eidos DS component documentation page by **composing** existing
classes and primitives — never by writing per-page CSS. `src/styles/tokens.css` +
`src/styles/ds.css` are already the design; your job is to demonstrate it. Pages render in
the Next.js app via the `window.PAGES` registry — there are no static HTML shells.

## Required pre-reading
1. `EIDOS-DS-REFERENCE.md` + `llms.txt` — catalog; confirm the class/icon already exists.
2. `src/ds/pages/components/buttons.jsx` — the canonical component-page template.
3. `${CLAUDE_PLUGIN_ROOT}/design-systems/forge/DESIGN.md` — brand (ember budget, Geist, density, motion).
4. Craft: `${CLAUDE_PLUGIN_ROOT}/craft/{typography,color,anti-ai-slop,accessibility-baseline,rtl-and-bidi,state-coverage}.md`.

## The 3-file ritual (see `new-component` for the full walkthrough)
1. Add `{ id, label, href }` to `src/ds/core/nav-config.js` (correct group; Components
   sub-groups are alphabetical by label).
2. Create `src/ds/pages/<group>/<slug>.jsx` — an IIFE that registers
   `window.PAGES['<slug>'] = Component` (mirror `buttons.jsx`).
3. Run `npm run gen:manifest`, then `npm run verify` (or open the route) to confirm it mounts.

## Page structure (mirror buttons.jsx)
In order: `<Section id title desc>` root → for each variant a `<SubHead meta>` + `<Frame
label code>` (live demo) + caption (`fontSize: 12.5`, `color: var(--fg-muted)`,
`marginTop: 14`) → **Anatomy** (named parts) → **Decision matrix** (when to use each
variant) → **Do / Don't** (`.dd-grid` with `.dd-card.do`/`.dd-card.dont`, each a *live UI*
demo + `.note` explaining why) → **RTL example** (required).

## Hard rules
- **Never per-page `<style>`.** Use `.btn .pill .surface .ds-frame .ds-grid .in-* .fc-*
  .cb-* .menu .tt .badge .avatar .tbl` or extend `tokens.css`/`ds.css`.
- **Ember accent ≤2× per screen.** Geist Sans (UI) + Geist Mono (numerics/captions/eyebrows).
- **Logical properties everywhere** (`inset-inline-*`, `padding-inline-*`, `text-align:
  start`). Only physical exception: `transform: translateX` needs a `[dir="rtl"]` override.
- Each page JSX is an IIFE that reads shared helpers from `window` (Icons, Frame, Section,
  SubHead, …) and ends by registering `window.PAGES['<slug>']`. Do not hand-edit
  `src/ds/runtime/manifest.generated.ts` (generated; hook-blocked).
- **Version bump touches two places in `src/ds/core/shell.jsx`** (sidebar sub-text + topbar
  badge) — keep them in sync.

## Gotchas
- Black screen → a missing `Icons.x` reference or a syntax error in the page JSX (the
  `DSRuntime` loader surfaces the error).
- Duplicated focus ring → suppress on inner inputs with `box-shadow: none !important`.
- Clipped dropdown → `.ds-frame` has `overflow: hidden`; use `position: fixed` +
  `getBoundingClientRect()`.
- `onChange` firing multiple times → don't put `htmlFor` on a label that ALSO wraps the input.
