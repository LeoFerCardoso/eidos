---
name: idp-screen
description: A complete Internal Developer Platform product screen assembled exclusively from existing Eidos components and elements — service catalog, service detail, DORA dashboard, incident room, pipeline console, score cards, feature flags, agent chat, etc. Use to build/prototype a full IDP screen. Do NOT use to document an isolated component (use component-page) nor for landing/marketing.
argument-hint: "[screen-name]"
allowed-tools: [Read, Edit, Write, Bash, Grep]
---

# IDP Screen Skill

Builds a realistic IDP product screen **only with what already exists**. The number one
rule: before creating anything, look for the screen or the block in the Examples /
Elements catalog — almost always the layout is already ready to be adapted.

## Required pre-reading

1. `../../llms.txt` **Examples** and **Elements** sections — odds are the screen already exists.
2. `../../EIDOS-DS-REFERENCE.md` — IDP blocks (Data table, Pipeline, Log viewer,
   Tree view, Timeline, Ring bar) and elements (Metric card, Service card, Score gauge).
3. The active `DESIGN.md`.

## Workflow

### Step 1 — Map the screen to existing components
Write, in one sentence, the screen as a composition: e.g. *"Service Catalog = page header
+ filter panel + service-card grid + pagination"*. Say this to the user before
building. If you are about to invent a component, stop — there is probably
an element/block that solves it.

### Step 2 — Build it in the app
A screen is either a full-screen Example (`src/ds/examples/<name>.tsx`, `'use client'`,
**default export**, auto-registered into `src/ds/examples/registry.ts`, nav leaf marked
`external: true`) or a DS page (`src/ds/migrated/<ds>/<slug>.tsx` — core pages
`src/ds/migrated/<slug>.tsx` —`'use client'`, **default export**, imports from `@/ds/core`,
auto-registered into `src/ds/migrated/registry.ts`). Add the nav entry in
`src/ds/core/nav-config.js`, then run `node scripts/gen-nav.mjs && node scripts/gen-migrated.mjs`
(+ `node scripts/gen-examples.mjs` for examples) and restart `next dev`. Compose only
existing classes/components — no per-page `<style>`.

### Step 3 — Cover the states (not just the "happy path")
Every data screen has states. Cover (see `.claude/craft/state-coverage.md`):
- **loading** (Skeleton/Spinner), **empty** (Empty state with CTA), **error** (Alert),
  **populated** (realistic data, not filler), and when there are forms, **invalid**.

### Step 4 — Realistic data
No "Service one / two / three". Use plausible service names, metrics and states
from an Equifax/Boa Vista IDP (DORA, deploy waves, incidents, scorecards). A metric without
a source = a labeled placeholder, never an invented number. Mock data lives in
`src/ds/core/mocks.js`.

### Step 5 — Self-check
Run `npm run verify` (route mounts) + the manual checklists in
`.claude/craft/anti-ai-slop.md` AND `.claude/craft/layout-and-spacing.md`. For layout,
screenshot the screen and drop a vertical guide on the title's left edge: the eyebrow,
tabs, toolbar and every list-row surface must meet it. No outer margin on rows, no rounded
list rows, no single-subject card.

## Hard rules
- **Compose, never reinvent.** If it comes out of Pill + Card + Avatar + Trend + StatusDot,
  assemble it that way.
- **Zero per-page `<style>`.**
- **Ember accent at most 2× per screen** — at dashboard density this is easy to
  violate; count the visible uses.
- **Logical properties + RTL example/test.**
- **Controlled density:** one tight section, one breathing (intentional tension),
  not perfect symmetry without rhythm.
- **Build in the repo** — add the `.tsx` module + nav entry, run `gen-nav`/`gen-migrated`
  (+ `gen-examples`), and restart `next dev`; never emit a standalone HTML document. Hand
  off to `code-reviewer` / `ux-designer` when done.
