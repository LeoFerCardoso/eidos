import * as React from 'react';
import * as Re from 'recharts';
// Eidos DS — Charts (Recharts wrapper).
//
// We don't replace Recharts; we wrap it with Eidos tokens. Each chart page
// imports its Recharts primitives directly from window.Recharts and embeds
// them inside <EidosChart> (size + padding + tooltip) so the page chrome
// stays consistent.
//
// AUTHORING RULES:
//   1. No ...rest at param level (Babel _excluded collision).
//   2. Use `--viz-*` tokens for ALL series colours, axis lines, grid lines,
//      tooltip surfaces. Never hardcode hex.
//   3. Default axis font is the mono token; data values get tabular-nums.
// ── Theme helpers ──────────────────────────────────────────────────────────
// Returns the Eidos categorical palette (12 hues) for series colors.
const useChartColors = () => {
  return React.useMemo(() => {
    // CSS vars resolve at runtime; we pass them through to Recharts as-is.
    return Array.from({ length: 12 }, (_, i) => `var(--viz-cat-${i + 1})`);
  }, []);
};

// ── Motion ───────────────────────────────────────────────────────────────
// Single DS-wide source of truth for the OS reduced-motion preference.
// Chart pages used to re-declare this matchMedia hook per file (bar, histogram,
// line, …); export it once here so every chart honours the Accessibility
// "Motion" claim consistently. SSR-safe (defaults to false), then syncs +
// subscribes on mount.
const REDUCE_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia(REDUCE_MOTION_QUERY);
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return reduced;
};
// Back-compat alias: chart pages that imported this under the chart-scoped
// name keep working, and new pages can use either spelling.
const useChartReducedMotion = usePrefersReducedMotion;

// Compact number formatter — keeps axis ticks short.
const fmtCompact = (n: number) => {
  if (n == null || Number.isNaN(n)) return '';
  const a = Math.abs(n);
  if (a >= 1e9) return (n / 1e9).toFixed(a < 1e10 ? 1 : 0) + 'B';
  if (a >= 1e6) return (n / 1e6).toFixed(a < 1e7 ? 1 : 0) + 'M';
  if (a >= 1e3) return (n / 1e3).toFixed(a < 1e4 ? 1 : 0) + 'k';
  if (a < 10 && !Number.isInteger(n)) return n.toFixed(1);
  return String(n);
};

const fmtNumber = (n: number | string | null | undefined, unit?: string) => {
  if (n == null || Number.isNaN(n)) return '';
  const t = typeof n === 'number' ? n.toLocaleString(undefined, { maximumFractionDigits: 2 }) : String(n);
  return unit ? `${t} ${unit}` : t;
};

// ── EidosTooltip ───────────────────────────────────────────────────────────
// Drop-in replacement for the default Recharts <Tooltip content>. Renders a
// Eidos-styled bubble.
type TooltipPayloadItem = {
  name?: string;
  dataKey?: string;
  value?: number | string;
  unit?: string;
  color?: string;
  fill?: string;
  stroke?: string;
};
type EidosTooltipContentProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: React.ReactNode;
  [key: string]: any;
};
const EidosTooltipContent = (props: EidosTooltipContentProps) => {
  if (!props.active || !props.payload || props.payload.length === 0) return null;
  const items = props.payload;
  return (
    <div className="eidos-tooltip">
      {props.label != null && <div className="ft-label">{props.label}</div>}
      <div className="ft-rows">
        {items.map((it, i) => (
          <div key={i} className="ft-row">
            <span className="ft-dot" style={{ background: it.color || it.fill || it.stroke || 'var(--ember)' }}/>
            <span className="ft-name">{it.name || it.dataKey}</span>
            <span className="ft-value t-mono">{fmtNumber(it.value, it.unit)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Default axis tick — sets Eidos typography on every X/Y label.
// v1.6.0 bumped fontSize to 12 and fill to --fg-muted-strong (still
// secondary but clears WCAG AA on both themes against surface/bg).
const tickStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  fontWeight: 500,
  fill: 'var(--fg-muted)',
};

// Polar tick — radar / radial / pie labels. Brighter than cartesian since
// these labels ARE the data (axis name == metric name).
const polarTickStyle = {
  fontFamily: 'var(--font)',
  fontSize: 12.5,
  fontWeight: 500,
  fill: 'var(--fg)',
};

// ── EidosChart container ──────────────────────────────────────────────────
// Wraps any Recharts node in a Card-style surface with header (title + meta).
//
// Two DS-wide guarantees the per-page chrome no longer has to hand-roll:
//   • Reduced motion — when the OS asks for it, the recharts enter animation is
//     disabled for every series child (Bar/Line/Area/…); pages need not thread
//     `isAnimationActive` themselves (an explicit prop on a child is preserved).
//   • Loading / empty — `state="loading" | "empty"` (or a custom `fallback`
//     node) renders INSIDE .fc-body, bypassing ResponsiveContainer (which only
//     accepts a single chart child), so distribution states reuse the same
//     surface without bespoke markup.
const EidosChart = ({ title, subtitle, meta, height = 280, padding = 18, accent, state, fallback, children }: {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  meta?: React.ReactNode;
  height?: number;
  padding?: number | string;
  accent?: string;
  state?: 'loading' | 'empty' | 'ready';
  fallback?: React.ReactNode;
  children?: React.ReactElement;
}) => {
  const reduced = usePrefersReducedMotion();
  // Gate the enter animation DS-wide: clone the chart child and force
  // isAnimationActive={false} on any series sub-element that does not already
  // set it explicitly. Recharts reads the prop off each series, so we recurse
  // one level into the chart's children.
  const body = React.useMemo(() => {
    if (!reduced || !React.isValidElement(children)) return children;
    const series = (children.props as { children?: React.ReactNode }).children;
    if (series == null) return children;
    const gated = React.Children.map(series, (node) => {
      if (!React.isValidElement(node)) return node;
      const props = node.props as { isAnimationActive?: boolean };
      if (props.isAnimationActive !== undefined) return node; // honour explicit page choice
      return React.cloneElement(node, { isAnimationActive: false } as Partial<typeof props>);
    });
    return React.cloneElement(children, undefined as never, gated);
  }, [reduced, children]);

  const showFallback = fallback != null || (state && state !== 'ready');
  return (
    <div className="eidos-chart" style={accent ? ({ '--chart-accent': accent } as React.CSSProperties) : undefined}>
      {(title || meta) && (
        <div className="fc-head">
          <div className="fc-head-text">
            {title && <span className="fc-title">{title}</span>}
            {subtitle && <span className="fc-subtitle">{subtitle}</span>}
          </div>
          {meta && <span className="fc-meta">{meta}</span>}
        </div>
      )}
      <div className="fc-body" style={{ padding }}>
        {showFallback ? (
          <div
            className="fc-state"
            style={{ minBlockSize: height }}
            data-state={state ?? 'custom'}
            role="status"
            aria-live="polite"
            aria-busy={state === 'loading' ? true : undefined}
          >
            {fallback ?? (state === 'loading' ? 'Loading…' : 'No data')}
          </div>
        ) : (
          <Re.ResponsiveContainer width="100%" height={height}>
            {body as React.ReactElement}
          </Re.ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

// ── ChartLegend ───────────────────────────────────────────────────────────
// Horizontal swatches, Eidos-styled, for any chart that needs a manual legend.
const ChartLegend = ({ items }: { items: { label: string; color?: string }[] }) => (
  <ul className="eidos-legend">
    {items.map((it, i) => (
      <li key={i}>
        <span className="legend-dot" style={{ background: it.color }}/>
        <span className="legend-label">{it.label}</span>
      </li>
    ))}
  </ul>
);

// ── Default props for common Recharts elements ────────────────────────────
// Pass via spread:  <CartesianGrid {...gridProps} />
const gridProps = { stroke: 'var(--viz-grid)', vertical: false };
const xAxisProps = { stroke: 'var(--viz-axis)', tick: tickStyle, tickLine: false, axisLine: { stroke: 'var(--viz-axis)' } };
const yAxisProps = { stroke: 'var(--viz-axis)', tick: tickStyle, tickLine: false, axisLine: { stroke: 'var(--viz-axis)' }, tickFormatter: fmtCompact };

export {
  EidosChart,
  EidosTooltipContent,
  ChartLegend,
  useChartColors,
  usePrefersReducedMotion,
  useChartReducedMotion,
  fmtCompact,
  fmtNumber,
};
// Re-export the aliased chart helpers under the names chart pages destructure from window,
// so migrated chart pages can import them from '@/ds/core'.
export {
  Re as Recharts,
  tickStyle as eidosChartTick,
  polarTickStyle as eidosPolarTick,
  gridProps as eidosGridProps,
  xAxisProps as eidosXAxisProps,
  yAxisProps as eidosYAxisProps,
};
