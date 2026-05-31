'use client';
import { ChangelogView, type ChangelogEntry } from '@/components/docs';

const CHANGELOG: ChangelogEntry[] = [
  // ─── v1.12.0 — IDP cards on the contract harness (2026-05-30) ──────
  { version: 'v1.12.0', date: '2026-05-30', type: 'feat', scope: 'idp', title: 'IDP cards brought to four-surface parity',
    summary: 'ServiceCard, MetricCard, AgentCard, ScoreGauge, Pipeline, Timeline, RingBar, DataTable, LogViewer, JSONInspector, FilterPanel and Banner now carry generated <AutoPropsTable> API tables, Storybook stories, and registry items, verified by the forge:verify contract harness. ServiceCard composes the canonical Avatar group.' },

  // ─── v1.11.0 — Tree view + Diff viewer rebuilt on the real Pierre engines (2026-05-27) ──────
  { version: 'v1.11.0', date: '2026-05-27', type: 'feat', scope: 'diff-viewer', title: 'Diff viewer rebuilt on the diffs.com engine (@pierre/diffs)',
    summary: 'Replaced the hand-rolled split/unified diff with Pierre’s real MultiFileDiff: Shiki syntax highlighting, word-level intra-line diffs, split + unified layouts, collapsible hunk separators ("N unmodified lines"), and annotations — driven by a live control toolbar that lives in its own bar outside the diff card. Re-skinned to Eidos through the --diffs-* custom properties only (colours + a Shiki theme mapped to the --viz-* tokens, plus typography); the diff model and layout are the library’s. Loaded via next/dynamic({ ssr:false }) so the Shiki-backed custom element ships in this page’s chunk and never runs during static generation.' },
  { version: 'v1.11.0', date: '2026-05-27', type: 'feat', scope: 'tree-view', title: 'Tree view — full trees.software surface (file types, flatten, git, search, DnD, context menu)',
    summary: 'Brought every @pierre/trees demo into the DS: per-language file-icon colours (React cyan, TS blue, CSS indigo, image pink, .gitignore vermilion…), an IDE window-chrome header (traffic lights + repo title + search / new-file actions), flattenEmptyDirectories (single-child chains collapse to one breadcrumb row), a git-status lane with a legend (A · M · D · R · U + a folder descendant dot), three fileTreeSearchMode variants (hide / collapse / expand non-matches), drag-and-drop with a canDrag-locked path, and a Eidos context menu (new file / new folder / rename / delete) wired to the model’s mutation API. The ForgeTree wrapper grew props for all of it (initialExpansion, flattenEmptyDirectories, searchMode, dragAndDrop, lockedPaths, contextMenu(+trigger), chrome, dir), seeded by a generous 31-path monorepo across the page.' },
  { version: 'v1.11.0', date: '2026-05-27', type: 'fix', scope: 'tree-view', title: 'Tree view selection, focus ring, spacing, context-menu overflow + RTL corrected',
    summary: 'The selection tint and focus ring are now ember — the --trees-*-override props fed var(--accent), which is not a Eidos token (it is --ember), so the engine silently fell back to its own default blue (#009fff); rewired to var(--ember). Added host block-padding so the first row and the search field no longer sit flush to the top edge, and the search field gets its own gap below the window-chrome header. The context menu now portals to <body> so it escapes the card’s overflow clip instead of being cut off at the right edge, and the RTL example pins the engine’s multi-segment filename label back to LTR so names stop reordering ("build" → "ldbui"). File icons intentionally keep the library’s per-language palette (the one place the tree carries colour beyond the ember accent).' },

  // ─── v1.10.0 — Page standard (2026-05-22) ──────
  { version: 'v1.10.0', date: '2026-05-22', type: 'docs', scope: 'idp', title: 'Accessibility section on every block & element',
    summary: 'All 13 IDP block/element pages got a sharpened lede and a required Accessibility section with block-specific guidance: grid keyboard model + aria-sort for the data table, role="tree"/aria-expanded for tree view, aria-live for streaming logs/pipeline status, status-not-colour-alone for health/severity, and a visible focus ring at dense row heights.' },

  // ─── v1.9.0 — IDP becomes its own sub-DS (2026-05-21) ──────
  { version: 'v1.9.0', date: '2026-05-21', type: 'feat', scope: 'idp', title: 'Eidos IDP split into its own sub-DS at /idp',
    summary: 'The platform Blocks (data table, pipeline, log/diff viewers, filter panel, JSON inspector, ring bar, timeline, tree view) and Elements (service / metric / score / agent cards) moved into a dedicated IDP sub-DS, route-prefixed at /idp.' },
  { version: 'v1.9.0', date: '2026-05-21', type: 'feat', scope: 'overview', title: 'Overview rebuilt — service card + deploy pipeline in the hero',
    summary: 'New Introduction-style Overview whose hero shows real platform surfaces: a clean ServiceCard above a Build → Test → Canary → Promote deploy pipeline — distinct from the chart-style heroes, so IDP reads as workflow.' },
  { version: 'v1.9.0', date: '2026-05-21', type: 'breaking', scope: 'blocks', title: 'Hero & Page headers left IDP for Eidos Blocks',
    summary: 'The section-level Hero and Page-headers recipes moved out of IDP Elements into the new Eidos Blocks sub-DS, where they sit alongside Feature grid / CTA banner / Stat band / Split feature.' },
  { version: 'v1.8.1', date: '2026-05-17', type: 'feat', scope: 'service-card', title: 'ServiceCard rebuilt to a 3-variant recipe',
    summary: 'compact / default / detailed variants with a 2-column footer grid (minmax(0,1fr) + auto) so contents truncate predictably. Top-right slot moved from TierBadge to HealthBadge (pulse on degraded); footer left uses an AvatarGroup (up to 3 + "+N"); footer right shows a LangBadge.' },
  { version: 'v1.8.1', date: '2026-05-17', type: 'feat', scope: 'agent-card', title: 'AgentCard rebuilt to mirror the catalog rhythm',
    summary: 'Same 4-band vertical rhythm as ServiceCard: 44px ember-soft avatar tile, model micro-label, HealthBadge flush right, 2-line summary clamp, capability chips (max 4 + "+N"), hairline-divided footer with inline stats + RelativeTime.' },
  { version: 'v1.6.0', date: '2026-05-16', type: 'fix', scope: 'metric-card', title: 'MetricCard labels align across a KPI row',
    summary: '.mc-head gained min-height = 2 lines so a wrapping label ("CHANGE FAILURE") and a single-line neighbour ("MTTR") land their big numbers at the same vertical position.' },
  { version: 'v1.6.0', date: '2026-05-16', type: 'breaking', scope: 'pipeline', title: 'Pipeline reduced to stepper + chevron',
    summary: 'Pipeline is now a strictly horizontal primitive with two variants. Top-down sequences belong to Timeline; stage-progress rings belong to RingBar / ScoreGauge.' },
  { version: 'v1.3.0', date: '2026-05-16', type: 'feat', scope: 'data-table', title: 'Data table — sortable, sticky, dense + IDP examples',
    summary: 'sort / onSort, sticky, dense, footer props. Three examples: service health row (sparkline + Trend), incident inventory (SeverityPill + RelativeTime + CopyChip), and sortable + sticky in a scroll container.' },
  { version: 'v1.3.0', date: '2026-05-16', type: 'feat', scope: 'diff-viewer', title: 'Diff viewer — split + unified',
    summary: 'Side-by-side diff with per-side line numbers, paired deletions/additions, per-file header with +N / −M counts, and a wrap prop for long lines.' },
];

export default function IdpChangelog() {
  return (
    <ChangelogView
      entries={CHANGELOG}
      title="Changelog"
      desc="Every change to Eidos IDP — searchable, filterable, scoped per block."
      dsName="Eidos IDP"
    />
  );
}
