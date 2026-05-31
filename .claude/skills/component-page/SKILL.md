---
name: component-page
description: The structure + rules a Eidos DS component documentation page must follow — live Frame previews with code, DS-standard typography, Accessibility, a required RTL example, visual Anatomy, Do/Don't, and an API reference, composed only from existing Eidos classes/primitives. Use when documenting a component or reviewing a component page for completeness. For the step-by-step "create a new page" mechanics use `new-component`; for full product screens use `idp-screen`.
allowed-tools: [Read, Edit, Write, Bash, Grep]
---

# Component Page Skill

Produces (or reviews) a Eidos DS component documentation page by **composing** existing
classes and primitives — never by writing per-page CSS and never by hand-rolling font
sizes. `src/styles/tokens.css` + `src/styles/ds.css` are already the design; your job is to
demonstrate it.

**Architecture (current — SWC, idiomatic TSX; there is NO `window.PAGES`, no `.jsx`, no
`gen-manifest`, no `shell.jsx`).** A page is one file:
`src/ds/migrated/<slug>.tsx` (core) or `src/ds/migrated/<ds>/<slug>.tsx` (sub-DS) —
`'use client'`, a **default export**, importing primitives from `@/ds/core`. It is
auto-registered into `src/ds/migrated/registry.ts` by `scripts/gen-migrated.mjs` and rendered
inside the persisted `(ds)` DocsShell by `DSPageLoader`.

## Required pre-reading
1. **`docs/DS-PAGE-STANDARD.md`** — the canonical section anatomy (§2.2), the **typography
   rules (§3.5)**, the **required RTL section (§3.6)**, and the vocabulary (§3). This is the rule.
2. **`src/ds/migrated/buttons.tsx`** — the gold-reference page. Copy its structure and its
   typography (it now uses `<Lede>` / `<Mono>` — see below).
3. `EIDOS-DS-REFERENCE.md` + `llms.txt` — catalog; confirm the class/icon already exists.
4. `.claude/design-systems/forge/DESIGN.md` — brand (ember budget, Geist, density, motion).
5. Craft: `.claude/craft/{typography,color,anti-ai-slop,accessibility-baseline,rtl-and-bidi,state-coverage}.md`.

## The route ritual (a page = TWO coordinated changes, then regen)
1. **Register the route** — add `{ id:'<slug>', label:'<Label>', href:'pages/<ds>/<slug>.html', badge }`
   to `src/ds/core/nav-config.js` in the correct `ds:`-tagged group. `id` MUST equal the file slug.
2. **Create the page** — `src/ds/migrated/<ds>/<slug>.tsx` (default export, imports from `@/ds/core`).
3. **Regenerate + restart** — `node scripts/gen-nav.mjs && node scripts/gen-migrated.mjs` (also
   auto-run by `npm run dev`/`build`). **Restart `next dev`** after nav changes — `generateStaticParams`
   is read once at start and `dynamicParams=false`, so a new route 404s until restart.
4. **Verify** — `npm run verify` (headless render sweep; `verify-routes` command).
5. **Version** — bump `DS_VERSION` in **`src/lib/site.ts`** (single source for the topbar badge)
   and add a per-DS changelog entry in `migrated/<ds>/changelog.tsx`. *(No `shell.jsx`, no two-string sync.)*

## Page structure (mirror `buttons.tsx`, in this order)
`<Section id num title desc>` (renders eyebrow + H1 + page-lede — don't hand-build the header) →

1. **Installation** (`meta="package managers"`) — `TabbedCode`/`ComponentInstall`. Mobile/Patterns: the import/`className`.
2. **Usage** (`meta="hello world"`) — smallest real example in a `<Frame label code>`.
3. **Variants / Sizes / States** (`meta="N variants"` …) — one `SubHead` per axis, each a `<Frame label code>`.
4. **In context** (optional) — the component in a realistic composition.
5. **Accessibility** (`meta="a11y"`, **required**) — keyboard map, ARIA, contrast pairs, reduced-motion, 44px on mobile.
6. **RTL** (`meta="RTL · العربية"`, **required**) — a live `dir="rtl"` `Frame` with Arabic copy + a `<Lede>`
   naming what mirrors. Directional icons (arrow/chevron/share/back) get `transform: scaleX(-1)`; static ones don't.
7. **Anatomy** (`meta="anatomy"`) — **visual**: `.ana > .stage` with numbered `.pin`s + dashed `.lead`s + a numbered `.ana-list` legend. Never a prose list.
8. **Do / Don't** (`meta="rules"`) — `.dd-grid` with `.dd-card.do`/`.dont`, each a **live UI** demo + a `.note` naming the failure + fix.
9. **API reference** (`meta="<Name>Props"`) — `PropsTable`. Patterns: rename to **CSS variables**.

Each demo is a `<Frame label code center|row>` — preview body on top, the (collapsible) code below.

## Typography — the 9-step scale, never hand-roll sizes (§3.5)
Eidos type is a **fixed 9-step scale** (72·56·36·28·20·17·15·13·11) — source of truth is
Foundations/Typography + the `.t-*` utilities. **There is no 12.5, 13.5, 14 or 16.**
- **Section intros / explainer paragraphs → `<Lede>`** (`<Lede up>` when it directly follows a
  `SubHead`). Muted 64ch paragraph at **t-body 15** (`.ds-caption`); it replaces every inline
  `const lede = {…}` / `<p style={{fontSize:…}}>` / ad-hoc `.ds-caption`.
- **Card / a11y / feature-card body → `className="t-small"`** (13, muted, lh 1.5) — **never `fontSize: 13.5`.**
- **Inline code in prose → `<Mono>`** (token names, props, classNames, 13 ember) — replaces `<code style={mono}>`.
- **Eyebrows / table column headers → `t-mono-label`** (11).
- Headings/eyebrow/page-lede come from `<Section>` / `<SubHead>` — don't restyle them.
- If you're about to type a literal `fontSize` for prose, stop: reach for `<Lede>`, `<Mono>`, a `.t-*`
  class, or a `--text-*` token. A literal `13.5/12.5/14.5/16` is **hard-blocked** by the
  `typography-scale` PreToolUse hook; other off-scale px trigger a warning.

## Hard rules
- **Never per-page `<style>`.** Compose `.btn .pill .surface .ds-frame .ds-grid .in-* .fc-*
  .cb-* .menu .tt .badge .avatar .tbl`, or extend `tokens.css`/`ds.css`.
- **No hand-rolled prose font sizes** — `<Lede>`/`<Mono>`/`--text-*` only (§3.5).
- **RTL section is required** (§3.6) — not optional.
- **Ember accent ≤2× per rendered screen.** Geist Sans (UI) + Geist Mono (numerics/captions/eyebrows).
- **Logical properties everywhere** (`inset-inline-*`, `padding-inline-*`, `margin-inline-*`,
  `text-align: start`). Only physical exception: `transform: translateX` needs a `[dir="rtl"]` mirror.
- **Contrast invariant**: any fg on a colored/elevated surface gets an explicitly contrasting color;
  on an ember fill the fg is dark ink (`--ember-fg`/`--bg`), never ember-on-ember.

## Gotchas
- Black screen → a missing `Icons.x` reference or a syntax error (the loader surfaces it; check `npm run verify`).
- Doubled focus ring → suppress on inner inputs with `box-shadow: none !important`.
- Clipped dropdown → `.ds-frame` is `overflow: hidden`; use `position: fixed` + `getBoundingClientRect()`.
- `onChange` firing twice → don't put `htmlFor` on a `<label>` that ALSO wraps the input.
- New route 404s → you didn't restart `next dev` after the nav change.
