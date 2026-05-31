---
name: eidos-verify
description: Run the Eidos component contract gate (npm run eidos:verify) for one component or the whole catalog, and report clause-by-clause Done/Blocked status across the four surfaces.
argument-hint: "[<slug> | --all] [--heavy]"
allowed-tools: [Bash, Read]
---

# /eidos-verify — the contract gate

The bar is `packages/registry/forge.contract.json`. A component is **Done** iff
`npm run eidos:verify -- --component <slug> --strict` exits 0. The verifier's green beats
any opinion.

## Steps

1. If the contract may be stale vs disk (a component/story/registry item was added or
   moved), sync first: `npm run gen:contract`. (CI runs `forge-gen contract --check`.)
2. Run the gate for the requested scope:
   - one component: `npm run eidos:verify -- --component $ARGUMENTS --strict`
   - the catalog: `npm run eidos:verify -- --all` (report) — add `--strict` to gate.
   - add `--heavy` to also run the route-level gates (render, axe, visual, contrast-fill);
     these need a built/served app, so they're skipped by default.
3. Read `reports/state.json` and `EIDOS-HEALTH.md` for the per-component clause map.

## Report

Per component, list each `block` clause that is `fail` (with its `detail`) and each `waived`
clause (reviewed exception — never report a waiver as a silent pass). Name the smallest fix
per failure and the builder skill that does it (`restructure-component`, `promote-batch`,
`new-component`, `ds-a11y-rtl-review`). End with the one-line summary
(`done / total · block-fails · waived · advisory`).
