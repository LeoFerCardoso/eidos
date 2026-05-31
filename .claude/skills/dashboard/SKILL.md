---
name: dashboard
description: |
  Build a Eidos IDP dashboard screen — a single product view with KPI/metric
  cards, one or two charts, and a supporting table or activity list, assembled
  from existing Eidos components. Use when the request is "dashboard", "DORA
  dashboard", "analytics overview", "ops dashboard", or "control panel". For a
  full multi-region IDP screen (catalog, incident room, pipeline console),
  defer to `idp-screen`. For docs of one component, use `component-page`.
allowed-tools: Read, Edit, Write, Bash, Grep, Glob
---

# Dashboard Skill

Build a Eidos IDP dashboard as a real screen in the app — composing existing
Eidos components, never writing per-page `<style>`. This is a specialization of
`idp-screen`; read that skill first and follow its compose-never-reinvent rule.
The system (`src/styles/tokens.css` + `src/styles/ds.css`) is already the
design; your job is to arrange it.

## Required pre-reading

1. `idp-screen` SKILL — the parent pattern for assembling screens from the
   catalog. A dashboard is one shape of IDP screen.
2. `../../FORGE-DS-REFERENCE.md` + `../../llms.txt` — confirm the metric card,
   chart, data-table, and status components you need already exist. Check the
   **Examples** group first; a dashboard layout is often already built.
3. `../../design-systems/forge/DESIGN.md` — color, type, density, anti-patterns.
4. `../../craft/{anti-ai-slop,state-coverage,accessibility-baseline,color,typography}.md`.

## Workflow

1. **Map the screen to existing components** in one sentence before building,
   e.g. *"DORA dashboard = page header + 4 metric cards (`.fc-*` / metric
   element) + 1 deploy-frequency chart (the Eidos chart primitives from
   `@/ds/core`) + a recent-deploys `.tbl` table"*. If you are about to invent a
   component, stop — there is almost certainly an element/block for it.
2. **Classify** what the dashboard monitors (deploys, DORA, incidents, usage,
   cost) from the request. Generate specific, plausible names and values — no
   "Metric A / Metric B". A number without a source is a labeled placeholder
   (`—` / `Sample`), never an invented stat.
3. **Lay out** the regions, each a composed Eidos block:
   - **Page header** — title + short description, optional date-range control.
   - **Metric row** — 3–4 metric/KPI cards: label + tabular-nums value + a
     muted delta vs. prior period. Compose from the metric element, not bespoke
     divs.
   - **Primary chart** — full-width or 2/3, via the Eidos chart primitives
     imported from `@/ds/core` (`src/ds/core/charts.*`). Real-looking series,
     lightly labeled axes.
   - **Secondary** — a `.tbl` table (recent events / top items) or an activity
     list.
4. **Cover the states** (see `craft/state-coverage.md`): loading (skeleton),
   empty (empty state + CTA), error (alert), populated (realistic data). Don't
   ship only the happy path.

## The route ritual (registering the page)

A dashboard usually lives as a full-screen Example, not a doc page. To register it:
1. Add the `{ id, label, href: 'pages/examples/<slug>.html', external: true }` entry
   in `src/ds/core/nav-config.js` (correct group / order).
2. Create `src/ds/examples/<slug>.tsx` — `'use client'`, **default export**, imports
   from `@/ds/core`, auto-registered into `src/ds/examples/registry.ts` (model on an
   existing example such as `cloud-inventory.tsx`). If documenting it as a DS page
   instead, create `src/ds/migrated/<ds>/<slug>.tsx` (core pages
   `src/ds/migrated/<slug>.tsx`), default export, auto-registered into
   `src/ds/migrated/registry.ts`.
3. Regenerate with `node scripts/gen-nav.mjs && node scripts/gen-migrated.mjs` (+
   `node scripts/gen-examples.mjs` for examples) — auto-run by `npm run dev`/`build` —
   then RESTART `next dev` (new routes 404 until restart).

## Hard rules

- **Compose, never reinvent.** Metric card, chart, table, status dot, trend —
  all exist. Assemble them.
- **Zero per-page `<style>`.** Style with `.btn .pill .surface .ds-frame
  .ds-grid .in-* .fc-* .cb-* .menu .tt .badge .avatar .tbl` + tokens. Extend
  `tokens.css`/`ds.css` only if a real gap exists.
- **Ember `#FF6B35` / `var(--accent)` at most 2× per screen** — at dashboard
  density this is easy to violate; count visible uses (one active nav + one
  chart highlight is the canonical budget).
- **Geist Sans for UI, Geist Mono for numerics / captions / eyebrows.** KPI
  values use `font-variant-numeric: tabular-nums`.
- **Logical CSS properties everywhere** (`inset-inline-*`, `padding-inline-*`,
  `text-align: start`); include an RTL check.
- **Controlled density** — one tight section, one breathing, not flat
  symmetry. Run the anti-ai-slop P0 list before calling it done.
