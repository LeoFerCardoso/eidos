# Forge DS — Backlog

Items deferred from earlier phases. Address before declaring the DS production-ready.

---

## Phase 3 — Building Blocks: REWORK REQUIRED

**Status:** Considered FAILED by user on 2026-05-15. Many components are poorly executed.

**What shipped (still in repo, marked `new` in nav):**

| Block | File | Known concerns |
|---|---|---|
| MetricCard       | `pages/components/metric-card.{jsx,html}`   | Initial version had `value`→`to` prop mismatch (fixed). Visual density and label hierarchy need audit. |
| Stat             | `pages/components/stat.{jsx,html}`          | — |
| Pipeline         | `pages/components/pipeline.{jsx,html}`      | — |
| Timeline         | `pages/components/timeline.{jsx,html}`      | Initial version read `window.PEOPLE/DEPLOYS` instead of `window.MOCKS.*` (fixed). |
| RingBar          | `pages/components/ring-bar.{jsx,html}`      | — |
| ScoreGauge       | `pages/components/score-gauge.{jsx,html}`   | — |
| LogViewer        | `pages/components/log-viewer.{jsx,html}`    | — |
| DiffViewer       | `pages/components/diff-viewer.{jsx,html}`   | — |
| TreeView         | `pages/components/tree-view.{jsx,html}`     | — |
| JSONInspector    | `pages/components/json-inspector.{jsx,html}`| — |
| ServiceCard      | `pages/components/service-card.{jsx,html}`  | Initial version read `window.SERVICES` (fixed). |
| AgentCard        | `pages/components/agent-card.{jsx,html}`    | — |
| AlertBar         | `pages/components/alert-bar.{jsx,html}`     | — |
| FilterPanel      | `pages/components/filter-panel.{jsx,html}`  | — |
| DataTable        | `pages/components/data-table.{jsx,html}`    | Resolves DEF-10. Composes Empty (Phase 1). |
| WorkflowCanvas   | `pages/components/workflow-canvas.{jsx,html}` | SVG DAG renderer — needs design review. |
| Heatmap          | `pages/components/heatmap.{jsx,html}`       | — |

**Plus:** `assets/js/core/blocks.jsx` (~640 lines, single IIFE), block CSS in `ds.css` under comment marker `/* PHASE 3 — BUILDING BLOCKS */`.

**Rework scope (to be planned later):**

1. Visual audit each of the 17 blocks against a Figma-style reference (alignment, spacing rhythm, density, type hierarchy, color use).
2. Add the missing P0 sections per the canonical component template (Anatomy, Decision matrix, Do/Don't pairs, RTL example).
3. Replace inline mock arrays with shared `window.MOCKS.*` keys to keep data shape consistent across pages.
4. Verify composition reuse — confirm each block actually pulls from primitives/atoms (no duplicated CSS).
5. After visual audit, downgrade some blocks back to `wip` or remove if they don't earn their slot.

**How to find them:** `nav-config.js` sub-group `IDP Blocks` under Components, plus the 8 P0/P1 blocks scattered across other Components sub-groups.

---

## Phase 6 Lote E — Backlog examples (deferred)

Per user direction, do AFTER Lotes A–D land:

- EX-17 Cost Explorer
- EX-18 API Catalog
- EX-19 Runbook Viewer
- EX-20 Observability Home
- EX-21 Onboarding Wizard
- EX-22 PR Review

---

## Process learning — avoid these traps

1. **`...rest` destructuring at param level in `<script type="text/babel">` files.** Babel emits `const _excluded = [...]` at script-top scope, which becomes global. A second script doing the same collides with `SyntaxError: Identifier '_excluded' has already been declared`. Pass explicit props instead.
2. **Mock data shape consistency.** All mock arrays live at `window.MOCKS.*` — never read from bare `window.SERVICES`/`window.PEOPLE`.
3. **CountUp vs static number.** `CountUp` expects `to=`, not `value=`. For grids of 4+ KPIs prefer plain `toLocaleString()` to avoid load-time animation noise.
4. **Browser cache.** Every JSX/JS change requires bumping `FORGE_VERSION` and `?v=` query in all HTMLs. The asset-cache step is non-negotiable.
