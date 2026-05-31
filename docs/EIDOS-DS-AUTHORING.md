# Eidos Design System — Project Notes

> **Catálogo completo do DS:** `EIDOS-DS-REFERENCE.md` (raiz do projeto). Leia esse arquivo antes de criar páginas novas ou variações — ele lista TODOS os tokens, classes CSS, componentes React, ícones, e cada página de documentação (~180 entradas). Use composição em vez de reinventar.

A multi-page design system documentation site. Entry point: `eidos-design-system/design-system.html` (the Introduction / Overview page lives at root). Every other page lives under `eidos-design-system/pages/<group>/<slug>.html`.

## Architecture

Each page is a thin HTML shell that:

1. Declares its slug: `<script>window.PAGE_SLUG = 'buttons';</script>`
2. Sets `<base href="...">` so relative paths resolve from project root regardless of page depth (root → `./`, `pages/<group>/` → `../../`)
3. Loads core scripts in this exact order:
   - `assets/css/{tokens.css, ds.css}` (verbatim — no per-page CSS)
   - `mocks.js` → `nav-config.js` → `icons.jsx` → `atoms.jsx` → `primitives.jsx` → `shell.jsx`
   - The page's JSX module: `assets/js/pages/<group>/<slug>.jsx`
   - `boot.jsx` (always last)

Each page JSX is an IIFE that registers itself: `window.PAGES['<slug>'] = MyComponent`. `boot.jsx` looks up `window.PAGES[window.PAGE_SLUG]` and renders it inside `<DSShell>`.

## Single source of truth

`assets/js/core/nav-config.js` defines the **entire navigation tree** (groups, labels, hrefs, slugs). The sidebar, the catalog page (`pages/get-started/components.html`), and `Section`'s breadcrumb all read from it. **Adding a new page = one entry in this array + matching `.jsx` + matching `.html`.**

Group order: Get Started → Layout → Components (alphabetical by label) → Foundations → Patterns → Tailwind → Resources.

## Style guarantee

`tokens.css` and `ds.css` are the design system. **Never write per-page CSS in `<style>` blocks** — use existing classes (`.surface`, `.ds-frame`, `.ds-grid`, `.btn`, `.pill`, `.in-*`, `.fc-*`, `.cb-*`, `.menu`, etc.) or extend `tokens.css` / `ds.css` if a new building block is needed. Themes (dark/light) are handled by `[data-theme="..."]` overrides in those files.

## Component page template

Every component page follows this structure (see `buttons.jsx` as canonical):

```jsx
<Section id="..." title="..." desc="...">
  <SubHead meta="...">Variant 1</SubHead>
  <Frame label="..." code={...}>{/* live demo */}</Frame>
  <p style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' }}>Caption.</p>
  ...
  {/* Always include: Anatomy, Decision matrix, Do/Don't, RTL example */}
  <SubHead meta="rules">Do / Don't</SubHead>
  <div className="dd-grid">
    <div className="dd-card do">
      <div className="head"><Icons.check size={12}/> Do — short rule</div>
      <div className="body">{/* live UI demo, NOT just text */}</div>
      <div className="note">Why this works.</div>
    </div>
    <div className="dd-card dont">…</div>
  </div>
</Section>
```

## Building-block CSS systems (in `tokens.css`)

- **`.in-*`** — Input groups: `.in-field` (label + group + helper) → `.in-group` (focus ring lives here) → `.in-control` + `.in-addon icon|text|btn|select|spinner|stepper`. Sizes via `.sm`/`.md`/`.lg`. Invalid via `.is-invalid` / `aria-invalid="true"`. Inner inputs are silent on focus (`box-shadow: none !important`) — only the group paints.
- **`.fc-*`** — Form controls (Checkbox, Radio, Switch). Real `<input>` is full-bleed but `opacity: 0`; the visible chrome (`.fc-check-box`, `.fc-radio-box`, `.fc-toggle-track`) renders below. Switch thumb uses spring `cubic-bezier(0.34, 1.56, 0.64, 1)`.
- **`.cb-*`** — Combobox.  Panel uses `position: fixed` to escape `.ds-frame`'s `overflow: hidden`; `useEffect` reads `getBoundingClientRect()` to anchor.
- **`.menu`** — Single primitive used by Menu (Button menu / Menu bar / Context menu). `min-width: 224px`, items use `white-space: nowrap` so labels never wrap.
- **`.tt`** — Tooltip via `[data-tt="..."]` works anywhere in the DS (not just on the Tooltips page).

## RTL

Every component should ship an RTL example. Use logical properties everywhere (`inset-inline-*`, `padding-inline-*`, `margin-inline-*`, `border-inline-*`, `text-align: start`). The only physical-property exception is `transform: translateX(...)` — those need `[dir="rtl"]` overrides (see Switch thumb). Mirror directional icons (chevrons, arrows) with `[dir="rtl"] .x { transform: scaleX(-1) }`. Carousel scroll math is RTL-aware (negative `scrollLeft` semantics handled in `useCarousel`).

## React + Babel pinning

Pinned versions with integrity hashes — DO NOT change them in `design-system.html` or any page entry:
- `react@18.3.1`, `react-dom@18.3.1`, `@babel/standalone@7.29.0`

Each `<script type="text/babel">` gets its own scope. Share state via `window` — that's why every primitive/component IIFE ends with `Object.assign(window, { ... })`.

## Spacing rhythm

- Caption after Frame: `marginTop: 14` (positive)
- Lede after SubHead: `marginTop: -6` (negative — attaches lede to its heading; intentional)
- Frame + Frame consecutively: `18px` via `.ds-frame + .ds-frame { margin-top: 18px }` in `ds.css`

## Verifying changes

Before declaring done, parse-check modified files with `@babel/standalone@7.29.0` (the same version the browser loads) — IIFE registration is required for the page to mount. The fallback in `boot.jsx` lists registered slugs to help diagnose registration failures.

## Common gotchas (from session history)

- **Black screen** → almost always a runtime crash from a missing `Icons.x` reference or a syntax issue in the page-specific JSX. Check `boot.jsx`'s diagnostic.
- **Doubled focus ring** → global `input:focus` rule paints a glow on every input. Suppress on inner inputs via `.cb-input:focus, .sel-search input:focus { box-shadow: none !important }`.
- **Dropdown clipped inside Frame** → `.ds-frame { overflow: hidden }` clips absolutely-positioned panels. Use `position: fixed` + `getBoundingClientRect()` (see Combobox).
- **Multi-fire onChange** → never put `htmlFor={id}` on an inner label that ALSO wraps the input. Wrapping is enough.
- **Stale browser cache after a rewrite** → append `?v=N` to the page-specific script src.
