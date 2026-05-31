'use client';
import { ChangelogView, type ChangelogEntry } from '@/components/docs';

const CHANGELOG: ChangelogEntry[] = [
  // ─── v1.11.0 — Charts on Storybook + the contract harness (2026-05-30) ──────
  { version: 'v1.11.0', date: '2026-05-30', type: 'feat', scope: 'charts', title: 'Charts join the Storybook + registry surfaces',
    summary: 'EidosChart and ChartLegend ship Storybook stories and registry items, and a Charts group joined the Storybook sort order. Chart pages are verified against the eidos:verify contract (a11y, anatomy, four-surface parity).' },

  // ─── v1.10.0 — Page standard (2026-05-22) ──────
  { version: 'v1.10.0', date: '2026-05-22', type: 'feat', scope: 'colors', title: 'Colors — the data-viz palette moved here from core',
    summary: 'New /charts/colors foundation page: the categorical (12 hues), sequential, and diverging --viz-* ramps plus the grid/axis/tooltip chrome — relocated out of the core Color page so the palette lives with the charts that use it. Includes an Accessibility section (colour-is-never-the-only-signal, distinct luminance, table fallback) and Do/Don\'t.' },
  { version: 'v1.10.0', date: '2026-05-22', type: 'docs', scope: 'charts', title: 'Anatomy + Accessibility on every chart',
    summary: 'All 11 chart pages were brought to the component standard: a sharpened lede, a new Anatomy section (visual — the chart rendered with numbered pins on its axes / gridlines / series / legend + a numbered legend), and an Accessibility section covering colour-is-never-the-only-signal, the --viz-* palette, keyboard/tooltip + table fallback, and prefers-reduced-motion for the draw animation.' },

  // ─── v1.9.0 — Charts becomes its own sub-DS (2026-05-21) ──────
  { version: 'v1.9.0', date: '2026-05-21', type: 'feat', scope: 'charts', title: 'Eidos Charts split into its own sub-DS at /charts',
    summary: 'The 11 chart types moved out of the core Components group into a dedicated Charts sub-DS, route-prefixed at /charts. It inherits the core tokens, mono axis font and the --viz-* palette; the sidebar DS switcher jumps straight to it.' },
  { version: 'v1.9.0', date: '2026-05-21', type: 'feat', scope: 'overview', title: 'Overview rebuilt — real charts in the hero',
    summary: 'New Introduction-style Overview whose hero shows live charts instead of stat cards: a "Deploys / week" area sparkline with a Trend delta, a "By tribe" bar chart, and a DORA score gauge — so the landing reads as data viz, not a spec sheet.' },
  { version: 'v1.8.1', date: '2026-05-17', type: 'fix', scope: 'radar', title: 'Radar polar grid soft — driven by props, no !important',
    summary: 'The outermost ring rendered at the Recharts default stroke (heavier than the inner rings), so the hexagon read as a hard frame. Replaced every per-chart CSS rule with one gridProps object (stroke --fg @14%, dasharray 3 4, width 1) passed to every PolarGrid — all rings now render as identical soft dashed hairlines.' },
  { version: 'v1.8.1', date: '2026-05-17', type: 'feat', scope: 'tooltip', title: 'Chart tooltip restyled — bigger label, larger dot, calmer type',
    summary: 'Header label switched from uppercase mono micro-label to sentence-case --fg semibold at --text-md. Series dot grew from an 8px circle to a 12px rounded square (matches the legend swatch); value is --fg semibold tabular-nums. Row/column gaps opened up so adjacent series breathe.' },
  { version: 'v1.6.0', date: '2026-05-16', type: 'fix', scope: 'charts', title: 'Chart titles, legend + heatmap popover legibility',
    summary: 'fc-title 14→15px, fc-subtitle 12→13px / weight 500, legend text 13→13.5px, cartesian ticks 11.5→12px / 500, polar ticks 12.5px / --fg. Heatmap popover title 13→14px with tightened tracking.' },
  { version: 'v1.6.0', date: '2026-05-16', type: 'fix', scope: 'charts', title: 'Do / Don\'t live demos rendered empty',
    summary: '.dd-card .body is a flex-center wrapper, so block-level chart children collapsed to 0 width and ResponsiveContainer emitted nothing. Added explicit width:100% on .eidos-chart inside Do/Don\'t bodies so all live demos render at full width.' },
  { version: 'v1.5.0', date: '2026-05-16', type: 'feat', scope: 'gauge', title: 'Gauge rewritten from scratch (plain SVG)',
    summary: 'The PieChart-based gauge mis-centered inside ResponsiveContainer. Replaced with a 30-line SVG primitive: semi / three-quarter / full variants, explicit polar math, centered tabular-nums readout, and a Change-Risk-Score recipe tinted green/amber/red.' },
  { version: 'v1.5.0', date: '2026-05-16', type: 'fix', scope: 'sankey', title: 'Sankey rendered empty — fixed the link renderer',
    summary: 'EidosLink read props.d, but Recharts Sankey passes sourceX/targetX/… and expects the renderer to build the path. Rewrote it to construct the cubic bezier; ribbons now appear with palette-indexed colours and stroke-opacity 0.28→0.6 on hover.' },
  { version: 'v1.3.0', date: '2026-05-16', type: 'feat', scope: 'charts', title: '11 chart types — Recharts themed with Eidos tokens',
    summary: 'Bar, line, area, histogram, pie, gauge, composed, radar, radial, sankey, heatmap. Each page documents 2–4 variants on a real IDP-shaped dataset. New <EidosChart>, <EidosTooltipContent>, useChartColors helpers.' },
];

export default function ChartsChangelog() {
  return (
    <ChangelogView
      entries={CHANGELOG}
      title="Changelog"
      desc="Every change to Eidos Charts — searchable, filterable, scoped per chart."
      dsName="Eidos Charts"
    />
  );
}
