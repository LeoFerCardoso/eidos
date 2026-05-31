# Eidos Design System

> Category: Developer Platform
> Design system that powers Equifax/Boa Vista's Internal Developer Platform (IDP). CSS-first (Tailwind v4 + tokens in CSS variables), framework-agnostic at the class layer, with reference React components to copy and paste. There is no npm package — you own your copy of each component.

## 1. Visual Theme & Atmosphere

Eidos is an operations tool, not a landing page. The atmosphere is that of a
well-lit engineering terminal: neutral, information-dense surfaces, a calm
typographic hierarchy, and a single warm accent — ember — used sparingly
to signal action and state, never to decorate. The system assumes screens for
prolonged work (dashboards, service catalogs, incident rooms), so it prioritizes
legibility, stable dark/light contrast, and controlled density over visual
spectacle.

The signature is restraint: lots of neutral gray with subtle layers (`bg` → `surface` →
`border`), Geist typography in a disciplined scale, and ember appearing at most
twice per screen. Where most AI dashboards overdo gradients and
neon, Eidos looks like software that a platform team trusts at 3am
during an incident.

**Key Characteristics:**
- Single accent: **ember `#FF6B35`** — use at most 2× per screen
- Typography **Geist Sans + Geist Mono**; numerics, captions and eyebrows in mono
- Cool, stable neutrals, with `bg`/`surface`/`border` layers via tokens
- Logical properties everywhere (RTL is a first-class requirement)
- IDP density: tables, pipelines, logs, trees — no decorative ornament
- Sober motion: `cubic-bezier(0.16, 1, 0.3, 1)`, durations 120/220/360ms

## 2. Color Palette & Roles

### Primary
- **Ember** (`#FF6B35`): the brand accent. Primary CTAs, action focus, brand moment.
  Strict budget: **at most 2 visible uses per screen**.

### Secondary & Accent
- **Ice**: cool secondary accent for links/informational highlights when ember has already
  been spent.
- **Violet**: tertiary accent for categorization (e.g.: AI/agent tagging).

### Status
- **info / success / warning / danger / critical**: mapped to dedicated tokens and
  reflected in the status `.pill`. Severity is semantic — see the *Severity &
  state* page; never pick a raw red, use the token.

### Surface & Background
- Layers via token: `--bg` (canvas) → `--surface` (elevated cards/containers) →
  `--border` (alpha borders). Dark/light via `[data-theme="..."]` in `tokens.css`.
- Foregrounds: `--fg`, `--fg-muted` for secondary text/captions.

> Never hardcode hex outside of `:root`. The six (or more) tokens in `tokens.css` are the
> truth — map the brand onto them.

## 3. Typography

- **Families:** Geist Sans (UI/body), Geist Mono (numerics, captions, eyebrows,
  labels, kbd, code).
- **Scale:** from `display-xl` (page heros) down to `mono-label` (microtext). Use the
  scale tokens, not arbitrary sizes.
- **Display:** Geist Sans at the weight and tracking defined by the tokens — do not introduce
  Inter/Roboto/`system-ui`.
- **Tracking rule:** ALL CAPS / eyebrows in mono always with tracking ≥ `0.06em`
  (see `craft/typography.md`).
- Body line: 60–75 characters.

## 4. Spacing & Layout

- Base scale of **4px**. Compositions use the system's rhythm, not magic numbers.
- Rhythm inherited from the doc pages: caption after Frame `marginTop: 14`; lede after
  SubHead `marginTop: -6` (negative, intentional — it sticks the lede to the heading); consecutive
  Frames separated by `18px`.
- Layout via existing classes (`.surface`, `.ds-frame`, `.ds-grid`) — never
  per-page `<style>`.

## 5. Radius & Elevation

- **Radius:** `xs (3px)` up to `2xl (12px)` via token.
- **Shadows:** elevation 1/2/3 + alpha border tokens. Depth is subtle; prefer
  border+surface layer over heavy shadows.

## 6. Iconography

- **window.Icons**: 95+ icons, sizes 12–20px, **stroke 1.5px**, `currentColor`.
- **Never emoji as a feature icon.** Always monoline SVG (see
  `craft/anti-ai-slop.md`).
- Directional icons (chevrons, arrows) mirror in RTL via `[dir="rtl"] .x { transform: scaleX(-1) }`.

## 7. Motion

- Default easing: `cubic-bezier(0.16, 1, 0.3, 1)`.
- Durations: `fast 120ms`, `normal 220ms`, `slow 360ms`.
- Spring exception: the Switch thumb uses `cubic-bezier(0.34, 1.56, 0.64, 1)`.
- Motion serves state and feedback, not decoration (see `craft/animation-discipline.md`).

## 8. Components & Building Blocks

Compose from what already exists. Core class systems (in `ds.css`/`tokens.css`):

- **`.btn`** — primary / ghost / ember; sizes sm/md/lg.
- **`.in-*`** — input groups: `.in-field` → `.in-group` (the focus ring lives here) →
  `.in-control` + `.in-addon`. Inner inputs silence the focus (`box-shadow: none !important`).
- **`.fc-*`** — checkbox/radio/switch: real `<input>` at `opacity:0`, visible chrome
  below. Wrap the label, do not use `htmlFor` on the inner.
- **`.cb-*`** — combobox: `position: fixed` panel + `getBoundingClientRect()` to
  escape the `overflow: hidden` of the `.ds-frame`.
- **`.menu`** — single primitive for Menu/Menubar/Context menu (`min-width: 224px`).
- **`.tt`** — tooltip via `[data-tt="..."]` on any element.
- **`.pill` / `.chip` / `.badge` / `.avatar` / `.tbl`** — status, selection, count,
  identity, tables.
- **IDP blocks:** Data table, Pipeline, Log viewer, Tree view, Timeline, Ring bar.

## 9. Voice & Anti-slop

- Product copy, not marketing: "Start tracking" > "Get started". No invented metrics,
  no lorem ipsum, no "trust" purple→blue gradient.
- ~80% proven patterns + ~20% distinctive choice (one typographic decision, one
  memorable microinteraction, one detail that only someone who has used the IDP would add).
- If a reviewer recognizes the screen as Eidos/IDP from the photo, it has soul. If it looks
  like a generic dashboard template, redo it. See `craft/anti-ai-slop.md`.
