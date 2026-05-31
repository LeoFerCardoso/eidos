---
name: eidos-health
description: Render the Eidos DS health wall (EIDOS-HEALTH.md) from the contract gate and surface the prioritized debt — block-fails first, then advisory — with the fewest-clauses-to-green ranking.
allowed-tools: [Bash, Read]
---

# /eidos-health — the health wall

Generates `EIDOS-HEALTH.md` from `reports/state.json` (per-component, per-clause status
across docs · export · story · registry · cross · tokens) — the "health wall" of the DS.

## Steps

1. Sync the contract bindings if needed: `npm run gen:contract`.
2. Run the full sweep and render the wall:
   ```
   npm run eidos:verify -- --all
   npm run eidos:health
   ```
   (Add `--heavy` to `eidos:verify` to include the route-level a11y/visual/render gates.)
3. Read `EIDOS-HEALTH.md`.

## Report

Lead with the headline (`N / total done · block-fails · waived · advisory`). Then surface:
- **Per-surface coverage** (docs / export / story / registry %), so the operator sees which
  surface is the weakest link.
- **The debt table**, block-fails first, grouped so the components closest to green
  (fewest failing clauses) are actionable first. For each cluster, name the builder skill
  that closes it (`promote-batch` for missing components/stories, `restructure-component`
  for a single component's three surfaces, `ds-a11y-rtl-review` for a11y/RTL, the doc
  section sweep for structure clauses).
- Any **waivers** that are expiring within 30 days.
