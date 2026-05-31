---
name: live-dashboard
description: |
  Build a Eidos dashboard screen wired to LIVE / streaming data inside the
  Next.js app — KPIs, a sparkline/trend, an activity feed, and a data table
  that refresh from real sources (App Router route handlers / the app's data
  layer) instead of static mocks. Use when the request is "live dashboard",
  "real-time dashboard", "streaming metrics", or "wire the dashboard to real
  data". For a static dashboard, use `dashboard`; for a full IDP screen, use
  `idp-screen`.
allowed-tools: Read, Edit, Write, Bash, Grep, Glob
---

# Live Dashboard Skill

A Eidos dashboard whose numbers actually move: it fetches from a real data
source on mount and on demand, shows honest live/stale state, and degrades to
seeded data when the source is unavailable so the screen never looks broken.

Start from the `dashboard` skill for layout and component composition — this
skill adds only the live-data wiring. The data path is the App Router's own
mechanism (route handlers / server actions / the `src/lib` data layer); there
is no separate CLI or daemon.

## Required pre-reading

1. `dashboard` SKILL — layout, metric/chart/table composition, the 3-file
   ritual, and the accent/state rules. Don't repeat that work here.
2. `../../FORGE-DS-REFERENCE.md` + `../../llms.txt` — metric, chart (Eidos chart
   primitives from `@/ds/core`), table, status-dot, badge components.
3. `../../design-systems/forge/DESIGN.md` and
   `../../craft/{anti-ai-slop,state-coverage,animation-discipline,color,typography}.md`.
4. `src/lib/` — the app's data layer; route handlers / server actions are where
   real fetches belong, not inline `fetch` strings in a single HTML file.

## Build order

1. **Lay out the static shell first** (per `dashboard`): page header, KPI row,
   a trend/sparkline card + activity-feed card two-up, and a data table. Get it
   right with seeded data before wiring anything live.
2. **Live-state indicator.** Add a small status pill near the title with three
   honest states: `Live · synced` (calm dot), `Syncing…` (accent, transient),
   `Stale · <ago>` (warning, after a staleness threshold). Compose from
   `.badge` / `.pill` + a status dot — no bespoke component.
3. **KPI grid.** Numbers `font-variant-numeric: tabular-nums`, weight 600. Each
   KPI carries a muted delta line (`↑ 6 vs last week`). No accent on the
   numbers, no decorative progress bars under them — the delta is enough.
4. **Trend card.** Hand the series to the Eidos chart primitives from `@/ds/core`
   (or an inline SVG sparkline) — a 2px stroke with a faint accent fill. No
   external chart libs beyond what the DS already loads.
5. **Activity feed + table.** New rows prepend; on refresh, briefly highlight
   changed rows (respect `prefers-reduced-motion` — see
   `craft/animation-discipline.md`). Status pills use the DS status set.

## Wiring real data

- Put the fetch behind the app's data layer: an App Router **route handler**
  (`src/app/api/.../route.ts`) or **server action** that returns typed JSON,
  consumed by the screen. The component does not embed provider URLs or tokens.
- **Refresh semantics:** fetch once on mount, expose a Refresh control, and
  poll on an interval only when a user-controlled "Auto" toggle is on. Animate
  the KPI value change between old and new on refresh.
- **Staleness:** after N seconds without a successful fetch, flip the pill to
  `Stale · <ago>`.
- **Graceful failure:** on error, fall back to the seeded snapshot so the
  screen still renders; surface the error as a quiet muted hint, never a red
  banner. Honor the full state set in `craft/state-coverage.md`
  (loading / empty / error / populated).

## Honesty rules (most-violated)

- **No invented metric.** Every number comes from the data source or is labeled
  `—` / `Sample`. No "10× faster" / "99.99% uptime" / "join 50,000+" unless the
  source literally returned it.
- **Sample-data badge** — when running on seeded/mock data, say so in the live
  pill or a callout, so a screenshot is never mistaken for real telemetry.
- **Plausible ranges** — deltas, counts, and totals must be internally
  consistent (done-this-week ≤ total, active ≤ team size).

## Register the page

Same route ritual as `dashboard`: edit `src/ds/core/nav-config.js` → add the
`src/ds/examples/<slug>.tsx` (`'use client'`, default export, nav leaf marked
`external: true`) or `src/ds/migrated/<ds>/<slug>.tsx` (core pages
`src/ds/migrated/<slug>.tsx`, default export, imports from `@/ds/core`) → run
`node scripts/gen-nav.mjs && node scripts/gen-migrated.mjs` (+
`node scripts/gen-examples.mjs` for examples) → RESTART `next dev`.

## Hard rules

- **Zero per-page `<style>`** — compose `.surface .ds-frame .badge .pill .tbl
  .fc-*` + tokens.
- **Ember accent ≤ 2× per screen** — Refresh affordance + one chart stroke is
  the canonical budget; KPI numbers stay neutral.
- **Geist Sans UI / Geist Mono numerics.** **Logical CSS properties + RTL
  check.** Run the anti-ai-slop P0 list before finishing.
