'use client';
// Forge — composed viz family for the T2 "Pulse" template (docs/DESIGN-GAPS.md
// §Q6). These are CARDS, not bare charts: metric + delta + chart + an optional
// Forge AI reading (always flagged with the DS AILabel) in one component.
// Built on the DS recharts layer (@eidos/ui charts re-export); fills use the
// COOL accent / viz tokens — ember never paints a series (it marks at most a
// single highlighted element per screen).
import * as React from 'react';
import { AILabel, Recharts } from '@/ds/core';

const {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  Treemap, Sankey, ScatterChart, Scatter, ReferenceLine,
} = Recharts;

// ── Shared bits ───────────────────────────────────────────────────────────────

/** Forge AI reading attached to a chart — ALWAYS flagged with the DS AILabel.
 *  The lg box (28px tile, 11px mono) keeps the DS proportions: comfortable air
 *  around the glyph, never compressed by the flex row. */
export function VizAiNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="vz-ai">
      <AILabel variant="box" size="lg" />
      <span className="vz-ai-text">{children}</span>
    </div>
  );
}

/** Static time-range control for Pulse screens (mock: presentation only). */
export function TimeRange({ value = '7d', options = ['24h', '7d', '30d'] }: { value?: string; options?: string[] }) {
  const [v, setV] = React.useState(value);
  return (
    <div className="vz-range" role="group" aria-label="Time range">
      {options.map((o) => (
        <button key={o} type="button" className={'vz-range-seg mono' + (v === o ? ' is-on' : '')} onClick={() => setV(o)}>
          {o}
        </button>
      ))}
    </div>
  );
}

// ── MetricChartCard ───────────────────────────────────────────────────────────
// KPI + delta + embedded trend with the PREVIOUS period as a ghost line — the
// "Spending card" composition. One reading per card via `ai`.

export interface MetricChartCardProps {
  label: string;
  value: string;
  delta?: { label: string; good?: boolean };
  badge?: React.ReactNode;
  note?: string;
  series: number[];
  prev?: number[];
  ai?: React.ReactNode;
}

export function MetricChartCard({ label, value, delta, badge, note, series, prev, ai }: MetricChartCardProps) {
  const data = series.map((v, i) => ({ i, v, p: prev?.[i] }));
  const gid = `vzfill-${label.replace(/\W/g, '')}`;
  return (
    <div className="fp-card vz-metric">
      <div className="vz-metric-head">
        <span className="vz-metric-label">{label}</span>
        {badge}
      </div>
      <div className="vz-metric-valrow">
        <span className="vz-metric-value mono">{value}</span>
        {delta && <span className={'vz-metric-delta mono ' + (delta.good ? 'is-up' : 'is-down')}>{delta.label}</span>}
      </div>
      <div className="vz-metric-chart" aria-hidden="true">
        <ResponsiveContainer width="100%" height={56}>
          <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-2)" stopOpacity={0.22} />
                <stop offset="100%" stopColor="var(--accent-2)" stopOpacity={0} />
              </linearGradient>
            </defs>
            {prev && (
              <Area type="monotone" dataKey="p" stroke="var(--border-strong)" strokeDasharray="3 3" fill="none" strokeWidth={1.2} isAnimationActive={false} />
            )}
            <Area type="monotone" dataKey="v" stroke="var(--accent-2)" fill={`url(#${gid})`} strokeWidth={1.6} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {note && <p className="vz-metric-note">{note}</p>}
      {ai && <VizAiNote>{ai}</VizAiNote>}
    </div>
  );
}

// ── TreemapCard ───────────────────────────────────────────────────────────────
// Area = value, colour = STATE (not category soup). Built for storage / spend
// composition where the outliers should be visible at a glance.

export type TreemapTone = 'neutral' | 'ok' | 'warn' | 'bad' | 'cold';
const TREEMAP_FILL: Record<TreemapTone, string> = {
  neutral: 'color-mix(in oklch, var(--accent-2) 22%, var(--surface))',
  ok: 'color-mix(in oklch, var(--success) 20%, var(--surface))',
  warn: 'color-mix(in oklch, var(--warning) 26%, var(--surface))',
  bad: 'color-mix(in oklch, var(--danger) 28%, var(--surface))',
  cold: 'var(--surface-active)',
};

/** Solid tone colours for the hover-legend dot (the cell fills above are
 *  surface-mixed washes; the dot needs the full-strength hue to read). */
const TREEMAP_DOT: Record<TreemapTone, string> = {
  neutral: 'var(--accent-2)',
  ok: 'var(--success)',
  warn: 'var(--warning)',
  bad: 'var(--danger)',
  cold: 'var(--fg-faint)',
};

export interface TreemapItem { name: string; value: number; caption?: string; state?: string; tone?: TreemapTone }

/** Hover legend in the DS chart-tooltip pattern — same .eidos-tooltip bubble
 *  the @eidos/ui charts render (ft-label header, dot + name + mono value row). */
function TreemapTip({ active, payload }: { active?: boolean; payload?: { payload?: TreemapItem }[] }) {
  const d = payload?.[0]?.payload;
  if (!active || !d?.name) return null;
  return (
    <div className="eidos-tooltip">
      <div className="ft-label">{d.name}</div>
      <div className="ft-rows">
        <div className="ft-row">
          <span className="ft-dot" style={{ background: TREEMAP_DOT[d.tone ?? 'neutral'] }} />
          <span className="ft-name">{d.state ?? 'Share'}</span>
          <span className="ft-value">{d.caption ?? d.value.toLocaleString('en-US')}</span>
        </div>
      </div>
    </div>
  );
}

function TreemapNode(props: { x?: number; y?: number; width?: number; height?: number; name?: string; caption?: string; tone?: TreemapTone }) {
  const { x = 0, y = 0, width = 0, height = 0, name, caption, tone = 'neutral' } = props;
  if (width <= 0 || height <= 0) return null;
  const showLabel = width > 76 && height > 34;
  const showCap = showLabel && height > 52 && Boolean(caption);
  return (
    <g>
      <rect x={x + 1} y={y + 1} width={width - 2} height={height - 2} rx={4} fill={TREEMAP_FILL[tone]} stroke="var(--bg)" strokeWidth={2} />
      {showLabel && (
        <text x={x + 9} y={y + 19} fill="var(--fg)" fontSize={11.5} fontWeight={600} fontFamily="var(--font-mono)">
          {name}
        </text>
      )}
      {showCap && (
        <text x={x + 9} y={y + 34} fill="var(--fg-muted)" fontSize={10} fontFamily="var(--font-mono)">
          {caption}
        </text>
      )}
    </g>
  );
}

export function TreemapCard({ title, meta, items, height = 240, ai }: {
  title: React.ReactNode;
  meta?: React.ReactNode;
  items: TreemapItem[];
  height?: number;
  ai?: React.ReactNode;
}) {
  return (
    <div className="fp-card">
      <div className="fp-card-head">
        <div className="fp-card-title">{title}</div>
        {meta && <span className="fp-card-meta">{meta}</span>}
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <Treemap data={items} dataKey="value" nameKey="name" isAnimationActive={false} content={<TreemapNode />}>
          <Tooltip content={<TreemapTip />} cursor={false} isAnimationActive={false} />
        </Treemap>
      </ResponsiveContainer>
      {ai && <VizAiNote>{ai}</VizAiNote>}
    </div>
  );
}

// ── SankeyCard ────────────────────────────────────────────────────────────────
// Flow composition (FinOps: account → product → service). Node + link colours
// come from tokens; labels render beside each node.

export interface SankeyData {
  nodes: { name: string }[];
  links: { source: number; target: number; value: number }[];
}

function SankeyNode(props: { x?: number; y?: number; width?: number; height?: number; payload?: { name: string }; containerWidth?: number }) {
  const { x = 0, y = 0, width = 0, height = 0, payload, containerWidth = 0 } = props;
  const isOut = x + width + 8 > containerWidth - 90;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={2} fill="var(--accent-2)" fillOpacity={0.85} />
      <text
        x={isOut ? x - 8 : x + width + 8}
        y={y + height / 2 + 4}
        textAnchor={isOut ? 'end' : 'start'}
        fill="var(--fg-muted)"
        fontSize={10.5}
        fontFamily="var(--font-mono)"
      >
        {payload?.name}
      </text>
    </g>
  );
}

export function SankeyCard({ title, meta, data, height = 280, ai }: {
  title: React.ReactNode;
  meta?: React.ReactNode;
  data: SankeyData;
  height?: number;
  ai?: React.ReactNode;
}) {
  return (
    <div className="fp-card">
      <div className="fp-card-head">
        <div className="fp-card-title">{title}</div>
        {meta && <span className="fp-card-meta">{meta}</span>}
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <Sankey
          data={data}
          nodePadding={18}
          margin={{ top: 8, right: 96, bottom: 8, left: 8 }}
          node={<SankeyNode />}
          link={{ stroke: 'var(--accent-2)', strokeOpacity: 0.18 }}
        >
          <Tooltip
            formatter={(v: number) => [`R$ ${(v / 1000).toFixed(1)}k/mo`, '']}
            contentStyle={{ background: 'var(--surface-overlay)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11, fontFamily: 'var(--font-mono)' }}
          />
        </Sankey>
      </ResponsiveContainer>
      {ai && <VizAiNote>{ai}</VizAiNote>}
    </div>
  );
}

// ── ActivityHeatmap ───────────────────────────────────────────────────────────
// Hour-bucket × day grid (pure CSS — no chart lib needed) for traces / errors /
// unavailability. Intensity maps to the COOL accent; `tone="bad"` for failures.

export function ActivityHeatmap({ title, meta, rows, cols, data, tone = 'cool', ai }: {
  title: React.ReactNode;
  meta?: React.ReactNode;
  /** Row labels (e.g. hour buckets '00' '04' …). */
  rows: string[];
  /** Column labels (e.g. days 'Mon' … or dates). */
  cols: string[];
  /** data[rowIndex][colIndex] — 0..n intensity. */
  data: number[][];
  tone?: 'cool' | 'bad';
  ai?: React.ReactNode;
}) {
  const max = Math.max(1, ...data.flat());
  const base = tone === 'bad' ? 'var(--danger)' : 'var(--accent-2)';
  return (
    <div className="fp-card">
      <div className="fp-card-head">
        <div className="fp-card-title">{title}</div>
        {meta && <span className="fp-card-meta">{meta}</span>}
      </div>
      <div className="vz-heat" style={{ gridTemplateColumns: `34px repeat(${cols.length}, 1fr)` }}>
        <span />
        {cols.map((c) => <span key={c} className="vz-heat-col mono">{c}</span>)}
        {rows.map((r, ri) => (
          <React.Fragment key={r}>
            <span className="vz-heat-row mono">{r}</span>
            {cols.map((c, ci) => {
              const v = data[ri]?.[ci] ?? 0;
              const pct = Math.round((v / max) * 100);
              return (
                <span
                  key={c}
                  className="vz-heat-cell"
                  title={`${r} · ${c} · ${v}`}
                  style={{ background: v === 0 ? 'var(--surface)' : `color-mix(in oklch, ${base} ${8 + pct * 0.62}%, var(--surface))` }}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
      {ai && <VizAiNote>{ai}</VizAiNote>}
    </div>
  );
}

// ── ScatterCard ───────────────────────────────────────────────────────────────
// Agreement plot (judge score × human score) with the y=x reference — the
// Langfuse scores-analytics correlation, in one compact card.

export function ScatterCard({ title, meta, points, xLabel, yLabel, height = 200, ai }: {
  title: React.ReactNode;
  meta?: React.ReactNode;
  points: { x: number; y: number }[];
  xLabel: string;
  yLabel: string;
  height?: number;
  ai?: React.ReactNode;
}) {
  return (
    <div className="fp-card">
      <div className="fp-card-head">
        <div className="fp-card-title">{title}</div>
        {meta && <span className="fp-card-meta">{meta}</span>}
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart margin={{ top: 8, right: 10, bottom: 4, left: -18 }}>
          <XAxis type="number" dataKey="x" domain={[0, 1]} tickCount={3} tick={{ fontSize: 10, fill: 'var(--fg-faint)', fontFamily: 'var(--font-mono)' }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} name={xLabel} />
          <YAxis type="number" dataKey="y" domain={[0, 1]} tickCount={3} tick={{ fontSize: 10, fill: 'var(--fg-faint)', fontFamily: 'var(--font-mono)' }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} name={yLabel} />
          <ReferenceLine segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]} stroke="var(--border-strong)" strokeDasharray="4 4" />
          <Scatter data={points} fill="var(--accent-2)" fillOpacity={0.8} isAnimationActive={false} shape="circle" />
        </ScatterChart>
      </ResponsiveContainer>
      <div className="vz-scatter-axes mono">{xLabel} × {yLabel}</div>
      {ai && <VizAiNote>{ai}</VizAiNote>}
    </div>
  );
}
