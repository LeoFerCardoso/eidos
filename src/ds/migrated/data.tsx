'use client';
// Eidos DS — Components / Data display
// The numeric layer of the system: KPI tiles, deltas, stat groups, sparklines,
// bar / line / area / stacked / donut / heatmap / bullet / funnel / gauge.
// All charts are pure SVG so they render without dependencies and inherit DS
// tokens for color, type, and spacing.
import * as React from 'react';
import { Sparkline, Counter, Icons, Frame, Section, SubHead, TabbedCode, PropsTable, installTabs, Lede, Mono, Spinner } from '@/ds/core';


  const USAGE_CODE = `import { Metric, MetricHead, MetricLabel, MetricValue, Delta, Sparkline } from "@/components/forge/data"

export function Demo() {
  return (
    <Metric variant="ember">
      <MetricHead>
        <MetricLabel>Deploys today</MetricLabel>
        <Delta value={+12.4}/>
      </MetricHead>
      <MetricValue>+147</MetricValue>
      <Sparkline data={trend} color="var(--ember)"/>
    </Metric>
  )
}`;

  // ──────────────────────────────────────────────────────────────────────
  // Local chart primitives (private to this page; exported via window so
  // the dashboard composition section can reference them too).
  // ──────────────────────────────────────────────────────────────────────

  // SparkBars — bar variant of the sparkline. Use when each value is a
  // discrete count (deploys/day, errors/day) rather than a continuous metric.
  const SparkBars = ({ data, w = 240, h = 36, color = 'var(--ember)' }) => {
    const max = Math.max(...data, 1);
    const bw = (w / data.length) * 0.7;
    const gap = (w / data.length) - bw;
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
        {data.map((v, i) => {
          const bh = Math.max(2, (v / max) * (h - 2));
          const x = i * (bw + gap) + gap / 2;
          const y = h - bh;
          return <rect key={i} x={x} y={y} width={bw} height={bh} fill={color} rx="1" />;
        })}
      </svg>
    );
  };

  // SparkWinLoss — symmetric +/- sparkline for binary outcomes (build pass/fail).
  const SparkWinLoss = ({ data, w = 240, h = 36 }) => {
    const bw = (w / data.length) * 0.7;
    const gap = (w / data.length) - bw;
    const ch = (h - 4) / 2;
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
        <line x1="0" y1={h / 2} x2={w} y2={h / 2} stroke="var(--border)" strokeDasharray="2 3" />
        {data.map((v, i) => {
          const x = i * (bw + gap) + gap / 2;
          const isWin = v > 0;
          const y = isWin ? h / 2 - ch + 1 : h / 2 + 1;
          return <rect key={i} x={x} y={y} width={bw} height={ch - 1} rx="1"
            fill={isWin ? 'var(--success)' : 'var(--danger)'} />;
        })}
      </svg>
    );
  };

  // Delta — small trend chip (▲ +12.4%). Use anywhere a number needs context.
  const Delta = ({ value, suffix = '%', invert = false }) => {
    const dir = value === 0 ? 'flat' : (value > 0 ? 'up' : 'down');
    const tone = invert ? (dir === 'up' ? 'down' : dir === 'down' ? 'up' : 'flat') : dir;
    const arrow = dir === 'up' ? '▲' : dir === 'down' ? '▼' : '—';
    const v = Math.abs(value).toFixed(value % 1 ? 1 : 0);
    return (
      <span className={'delta ' + tone}>
        <span className="arrow">{arrow}</span>
        {v}{suffix}
      </span>
    );
  };

  // BarChart — vertical bars with Y axis ticks, gridlines, optional X labels.
  const BarChart = ({ data, w = 520, h = 200, color = 'var(--ember)', labels, gridY = 4, suffix = '' }) => {
    const max = Math.max(...data, 1);
    const niceMax = Math.ceil(max / 10) * 10;
    const padL = 36, padR = 12, padT = 12, padB = labels ? 24 : 12;
    const cw = w - padL - padR;
    const ch = h - padT - padB;
    const bw = (cw / data.length) * 0.66;
    const gap = (cw / data.length) - bw;
    return (
      <svg className="chart" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: 'auto' }}>
        {Array.from({ length: gridY + 1 }).map((_, i) => {
          const y = padT + (ch * i) / gridY;
          const v = Math.round(niceMax * (1 - i / gridY));
          return (
            <g key={i}>
              <line className="grid-line" x1={padL} y1={y} x2={w - padR} y2={y} />
              <text className="axis-tick" x={padL - 6} y={y + 3} textAnchor="end">{v}{suffix}</text>
            </g>
          );
        })}
        {data.map((v, i) => {
          const x = padL + i * (bw + gap) + gap / 2;
          const bh = (v / niceMax) * ch;
          const y = padT + (ch - bh);
          return (
            <g key={i}>
              <rect className="bar" x={x} y={y} width={bw} height={bh} fill={color} rx="1.5">
                <title>{labels && labels[i] ? labels[i] + ': ' : ''}{v}{suffix}</title>
              </rect>
              {labels && labels[i] && (
                <text className="axis-tick" x={x + bw / 2} y={h - 8} textAnchor="middle">{labels[i]}</text>
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  // LineChart — multi-series, Y-axis with ticks + gridlines, hover dot via <title>.
  const LineChart = ({ series, w = 520, h = 220, gridY = 4, suffix = '', labels }) => {
    const all = series.flatMap(s => s.data);
    const max = Math.max(...all, 1);
    const niceMax = Math.ceil(max / 10) * 10 || 1;
    const padL = 40, padR = 12, padT = 12, padB = labels ? 28 : 16;
    const cw = w - padL - padR;
    const ch = h - padT - padB;
    const N = series[0].data.length;
    const sx = (i) => padL + (i / (N - 1)) * cw;
    const sy = (v) => padT + ch - (v / niceMax) * ch;

    return (
      <svg className="chart" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: 'auto' }}>
        {Array.from({ length: gridY + 1 }).map((_, i) => {
          const y = padT + (ch * i) / gridY;
          const v = Math.round(niceMax * (1 - i / gridY));
          return (
            <g key={i}>
              <line className="grid-line" x1={padL} y1={y} x2={w - padR} y2={y} />
              <text className="axis-tick" x={padL - 6} y={y + 3} textAnchor="end">{v}{suffix}</text>
            </g>
          );
        })}
        {labels && labels.map((lab, i) => (
          <text key={i} className="axis-tick" x={sx(i)} y={h - 10} textAnchor="middle">{lab}</text>
        ))}
        {series.map((s, si) => {
          const path = s.data.map((v, i) => (i === 0 ? 'M' : 'L') + sx(i).toFixed(1) + ',' + sy(v).toFixed(1)).join(' ');
          return (
            <g key={si}>
              <path d={path} fill="none" stroke={s.color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
              {s.data.map((v, i) => (
                <circle key={i} cx={sx(i)} cy={sy(v)} r="2.4" fill={s.color}>
                  <title>{s.name}: {v}{suffix}</title>
                </circle>
              ))}
            </g>
          );
        })}
      </svg>
    );
  };

  // AreaChart — single-series area with linear-gradient fill.
  const AreaChart = ({ data, color = 'var(--ember)', w = 520, h = 160, gridY = 3, suffix = '', labels }) => {
    const max = Math.max(...data, 1);
    const niceMax = Math.ceil(max / 10) * 10 || 1;
    const padL = 40, padR = 12, padT = 12, padB = labels ? 28 : 16;
    const cw = w - padL - padR; const ch = h - padT - padB;
    const N = data.length;
    const sx = (i) => padL + (i / (N - 1)) * cw;
    const sy = (v) => padT + ch - (v / niceMax) * ch;
    const path = data.map((v, i) => (i === 0 ? 'M' : 'L') + sx(i).toFixed(1) + ',' + sy(v).toFixed(1)).join(' ');
    const fill = path + ` L ${sx(N - 1).toFixed(1)},${(padT + ch).toFixed(1)} L ${sx(0).toFixed(1)},${(padT + ch).toFixed(1)} Z`;
    const id = 'g' + Math.abs(data.reduce((s, v) => s + v, 0)) + N;
    return (
      <svg className="chart" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: 'auto' }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.34" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: gridY + 1 }).map((_, i) => {
          const y = padT + (ch * i) / gridY;
          const v = Math.round(niceMax * (1 - i / gridY));
          return (
            <g key={i}>
              <line className="grid-line" x1={padL} y1={y} x2={w - padR} y2={y} />
              <text className="axis-tick" x={padL - 6} y={y + 3} textAnchor="end">{v}{suffix}</text>
            </g>
          );
        })}
        {labels && labels.map((lab, i) => (
          <text key={i} className="axis-tick" x={sx(i)} y={h - 10} textAnchor="middle">{lab}</text>
        ))}
        <path d={fill} fill={`url(#${id})`} />
        <path d={path} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
        {data.map((v, i) => (
          <circle key={i} cx={sx(i)} cy={sy(v)} r="2" fill={color} opacity="0">
            <title>{(labels && labels[i]) || ''}: {v}{suffix}</title>
          </circle>
        ))}
      </svg>
    );
  };

  // StackedBar — categorical breakdown (e.g. requests by status code).
  const StackedBar = ({ data, w = 520, h = 220, suffix = '' }) => {
    const totals = data.map(d => d.segments.reduce((s, seg) => s + seg.value, 0));
    const max = Math.max(...totals, 1);
    const niceMax = Math.ceil(max / 100) * 100 || max;
    const padL = 40, padR = 12, padT = 12, padB = 28;
    const cw = w - padL - padR, ch = h - padT - padB;
    const bw = (cw / data.length) * 0.6;
    const gap = (cw / data.length) - bw;
    return (
      <svg className="chart" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: 'auto' }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const y = padT + (ch * i) / 4;
          const v = Math.round(niceMax * (1 - i / 4));
          return (
            <g key={i}>
              <line className="grid-line" x1={padL} y1={y} x2={w - padR} y2={y} />
              <text className="axis-tick" x={padL - 6} y={y + 3} textAnchor="end">{v}{suffix}</text>
            </g>
          );
        })}
        {data.map((d, i) => {
          let acc = 0;
          const x = padL + i * (bw + gap) + gap / 2;
          return (
            <g key={i}>
              {d.segments.map((seg, si) => {
                const sh = (seg.value / niceMax) * ch;
                const y = padT + ch - acc - sh;
                acc += sh;
                return (
                  <rect key={si} className="bar" x={x} y={y} width={bw} height={sh} fill={seg.color}
                    rx={si === d.segments.length - 1 ? 1.5 : 0}>
                    <title>{d.label} · {seg.name}: {seg.value}{suffix}</title>
                  </rect>
                );
              })}
              <text className="axis-tick" x={x + bw / 2} y={h - 10} textAnchor="middle">{d.label}</text>
            </g>
          );
        })}
      </svg>
    );
  };

  // Donut — composition. Renders an inner counter with the total via children.
  // Dash convention: dasharray = "len, c" (rest of cycle invisible), dashoffset
  // = -acc (negative shift = pattern moves forward by `acc` units). Stable and
  // well-known; avoids the offset-modulo-cycle pitfalls of `c - acc`.
  const Donut = ({ data, size = 160, thickness = 14, children = undefined }: { data: any; size?: number; thickness?: number; children?: any }) => {
    const total = data.reduce((s, d) => s + d.value, 0);
    const r = (size - thickness) / 2;
    const c = 2 * Math.PI * r;
    let acc = 0;
    return (
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-active)" strokeWidth={thickness} />
          {data.map((d, i) => {
            const len = (d.value / total) * c;
            const off = -acc;
            acc += len;
            return (
              <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke={d.color} strokeWidth={thickness}
                strokeDasharray={`${len} ${c}`} strokeDashoffset={off}
                strokeLinecap="butt"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}>
                <title>{d.label}: {d.value} ({((d.value / total) * 100).toFixed(1)}%)</title>
              </circle>
            );
          })}
        </svg>
        {children && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 0,
          }}>
            {children}
          </div>
        )}
      </div>
    );
  };

  // Gauge — half-circle radial. Good for SLO, capacity utilization, score.
  // Math: arc goes from angle π (left) → 2π (right), opening upward.
  //   cx = size/2, cy = bottom-of-arc baseline. r tracks size.
  //   The svg height is exactly r + 2*pad so there is no dead space below.
  const Gauge = ({
    value, max = 100, size = 180, thickness = 14,
    color = 'var(--ember)', track = 'var(--surface-active)', label = '',
    valueSize = undefined, // optional override for the big number
  }: { value: any; max?: number; size?: number; thickness?: number; color?: string; track?: string; label?: string; valueSize?: any }) => {
    const pct = Math.min(1, Math.max(0, value / max));
    const pad = thickness / 2 + 2;          // breathing room around the stroke
    const r = (size - pad * 2) / 2;
    const cx = size / 2;
    const cy = pad + r;                     // baseline sits at top + r
    const h = Math.ceil(cy + pad);          // svg ends just past the baseline

    // Half-circle: span is in [0, 1] mapping to [0°, 180°]. Large-arc-flag is
    // ALWAYS 0 — the arc never exceeds 180°. Sweep=1 traces the upper
    // semicircle (clockwise in SVG y-down: 9→12→3 o'clock).
    const arc = (start, end) => {
      const a0 = Math.PI + start * Math.PI;
      const a1 = Math.PI + end * Math.PI;
      const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
      const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
    };

    // Label band: visual center of the half-circle is roughly cy - r*0.45.
    // Put the big value just above that midpoint, the unit label just below.
    const vSize = valueSize || Math.round(size * 0.16);
    const subSize = Math.max(9, Math.round(vSize * 0.42));
    const valY = cy - r * 0.32;
    const subY = valY + Math.round(vSize * 0.78);

    return (
      <svg width={size} height={h} viewBox={`0 0 ${size} ${h}`} role="img"
        aria-label={`${value}${label} of ${max}${label}`}>
        <path d={arc(0, 1)} fill="none" stroke={track}
          strokeWidth={thickness} strokeLinecap="round" />
        <path d={arc(0, pct)} fill="none" stroke={color}
          strokeWidth={thickness} strokeLinecap="round" />
        <text x={cx} y={valY} textAnchor="middle" fill="var(--fg)"
          fontFamily="var(--font-sans)" fontSize={vSize} fontWeight="600"
          dominantBaseline="middle"
          style={{ fontFeatureSettings: '"tnum"' }}>
          {value.toFixed(value % 1 ? 1 : 0)}{label}
        </text>
        <text x={cx} y={subY} textAnchor="middle" fill="var(--fg-subtle)"
          fontFamily="var(--font-mono)" fontSize={subSize} letterSpacing="0.08em"
          dominantBaseline="middle">
          / {max}{label}
        </text>
      </svg>
    );
  };

  // HeatCalendar — GitHub-style activity calendar. 7 rows × N weeks.
  // Pattern is deterministic via a tiny LCG so the demo is stable.
  const heatCells = (weeks, seed = 12345) => {
    let s = seed;
    const r = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
    return Array.from({ length: 7 * weeks }).map((_, i) => {
      const wk = Math.floor(i / 7);
      // Recent weeks tilted heavier
      const recencyBoost = wk / weeks;
      const base = r();
      const v = Math.min(0.99, base * 0.6 + recencyBoost * 0.5);
      if (v < 0.18) return 0;
      if (v < 0.40) return 1;
      if (v < 0.62) return 2;
      if (v < 0.82) return 3;
      return 4;
    });
  };

  const HeatCalendar = ({ weeks = 26, seed = undefined }: { weeks?: number; seed?: any }) => {
    const cells = React.useMemo(() => heatCells(weeks, seed), [weeks, seed]);
    return (
      <div className="heat" aria-hidden="true">
        {cells.map((v, i) => (
          <span key={i} className={'cell' + (v > 0 ? ' l' + v : '')} title={v ? v + ' contributions' : 'no activity'} />
        ))}
      </div>
    );
  };

  // Bullet chart — value vs target. Width is value%; vertical line is target%.
  const Bullet = ({ value, target, max = 100, color = 'var(--ember)' }) => {
    const v = Math.min(100, (value / max) * 100);
    const t = Math.min(100, (target / max) * 100);
    return (
      <div className="bullet">
        <div className="bullet-fill" style={{ width: v + '%', background: color }} />
        <div className="bullet-target" style={{ insetInlineStart: t + '%' }} title={`Target: ${target}`} />
      </div>
    );
  };

  // Funnel chart — stages with width proportional to value.
  const Funnel = ({ data, color = 'var(--ember)' }) => {
    const top = data[0].value;
    return (
      <div className="funnel">
        {data.map((stage, i) => {
          const pct = (stage.value / top) * 100;
          return (
            <div className="stage" key={i}>
              <span className="label">{stage.label}</span>
              <div className="track">
                <div className="fill" style={{ width: pct + '%', background: color }} />
              </div>
              <span className="val">{stage.value.toLocaleString()} <span className="pct">{pct.toFixed(0)}%</span></span>
            </div>
          );
        })}
      </div>
    );
  };

  // ──────────────────────────────────────────────────────────────────────
  // Page
  // ──────────────────────────────────────────────────────────────────────

  // Demo data (kept stable across renders so motion only fires once).
  const tDeploys = [5, 8, 6, 11, 9, 14, 12, 18, 16, 22, 20, 28, 32, 40];
  const tLatency = [180, 175, 168, 160, 155, 150, 148, 145, 142, 140, 142, 140, 142, 138];
  const tUptime  = [99.80, 99.85, 99.90, 99.92, 99.94, 99.93, 99.94];
  const tBuilds  = [1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1];

  const dailyTraffic = [12, 18, 22, 19, 28, 36, 32, 41, 38, 44, 51, 48, 56, 60, 58, 64, 70, 68, 74, 78, 82, 90, 88, 94];
  const weekdayDeploys = [12, 18, 24, 22, 28, 6, 4];
  const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const lineSeries = [
    { name: 'Production', color: 'var(--ember)',  data: [42, 48, 55, 51, 60, 68, 72, 78, 82, 88, 94, 98] },
    { name: 'Staging',    color: 'var(--accent-2)',    data: [22, 28, 30, 32, 36, 38, 40, 44, 46, 50, 52, 56] },
    { name: 'Preview',    color: 'var(--accent-3)', data: [10, 12, 14, 15, 18, 22, 24, 28, 32, 30, 36, 40] },
  ];

  const stackedData = [
    { label: 'Mon', segments: [{ name: '2xx', value: 920, color: 'var(--success)' }, { name: '3xx', value: 80, color: 'var(--accent-2)' }, { name: '4xx', value: 32, color: 'var(--warning)' }, { name: '5xx', value: 6, color: 'var(--danger)' }] },
    { label: 'Tue', segments: [{ name: '2xx', value: 1080, color: 'var(--success)' }, { name: '3xx', value: 92, color: 'var(--accent-2)' }, { name: '4xx', value: 28, color: 'var(--warning)' }, { name: '5xx', value: 4, color: 'var(--danger)' }] },
    { label: 'Wed', segments: [{ name: '2xx', value: 1240, color: 'var(--success)' }, { name: '3xx', value: 110, color: 'var(--accent-2)' }, { name: '4xx', value: 42, color: 'var(--warning)' }, { name: '5xx', value: 11, color: 'var(--danger)' }] },
    { label: 'Thu', segments: [{ name: '2xx', value: 1310, color: 'var(--success)' }, { name: '3xx', value: 120, color: 'var(--accent-2)' }, { name: '4xx', value: 36, color: 'var(--warning)' }, { name: '5xx', value: 7, color: 'var(--danger)' }] },
    { label: 'Fri', segments: [{ name: '2xx', value: 1420, color: 'var(--success)' }, { name: '3xx', value: 138, color: 'var(--accent-2)' }, { name: '4xx', value: 30, color: 'var(--warning)' }, { name: '5xx', value: 5, color: 'var(--danger)' }] },
    { label: 'Sat', segments: [{ name: '2xx', value: 720,  color: 'var(--success)' }, { name: '3xx', value: 60,  color: 'var(--accent-2)' }, { name: '4xx', value: 12, color: 'var(--warning)' }, { name: '5xx', value: 2, color: 'var(--danger)' }] },
    { label: 'Sun', segments: [{ name: '2xx', value: 580,  color: 'var(--success)' }, { name: '3xx', value: 48,  color: 'var(--accent-2)' }, { name: '4xx', value: 14, color: 'var(--warning)' }, { name: '5xx', value: 1, color: 'var(--danger)' }] },
  ];

  const browsers = [
    { label: 'Chrome',  value: 64, color: 'var(--ember)' },
    { label: 'Safari',  value: 19, color: 'var(--accent-2)' },
    { label: 'Firefox', value: 8,  color: 'var(--accent-3)' },
    { label: 'Edge',    value: 6,  color: 'var(--success)' },
    { label: 'Other',   value: 3,  color: 'var(--warning)' },
  ];

  const funnelData = [
    { label: 'Visitors',   value: 24380 },
    { label: 'Sign-up',    value: 12640 },
    { label: 'Activated',  value:  8920 },
    { label: 'Subscribed', value:  3120 },
    { label: 'Renewed',    value:  2240 },
  ];

  // ──────────────────────────────────────────────────────────────────────

export default function DataDisplay() {
  return (
    <Section
      id="data"
      num="14"
      title="Data display"
      desc="The numeric layer: KPI tiles, sparklines, deltas, and the chart family. Every primitive uses tabular numerals, semantic color, and currentColor — so themes, RTL, and palette swaps Just Work."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('data')} ariaLabel="package manager"/>
      <Lede>
        Installs the numeric layer — <Mono>Metric</Mono>, <Mono>Delta</Mono>, <Mono>Counter</Mono>, <Mono>Sparkline</Mono>, and the chart family (Bar, Line, Area, Stacked, Donut, Gauge, Heatmap, Bullet, Funnel). Every primitive uses tabular numerals and semantic color tokens.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" code={USAGE_CODE}>
        <div className="metric ember" style={{ maxWidth: 320 }}>
          <div className="metric-head">
            <span className="metric-label"><Icons.rocket size={11}/> Deploys today</span>
            <Delta value={+12.4}/>
          </div>
          <div className="metric-value"><Counter to={147} prefix="+"/></div>
          <div className="metric-spark"><Sparkline data={tDeploys} color="var(--ember)" w={260} h={36}/></div>
          <div className="metric-meta">vs. 131 last Tue · 14-day trend</div>
        </div>
      </Frame>

      {/* 3. EXAMPLES — divider eyebrow (composes .ds-examples-rule + .t-mono-label + .divider) */}
      <div className="ds-examples-rule" style={{ marginBlock: '36px 6px' }}>
        <span className="t-mono-label">Examples</span>
        <span className="divider" style={{ flex: 1 }}/>
      </div>

      {/* ── KPI metric tiles ─────────────────────────────────────────── */}
      <SubHead meta="canonical · 4 primitives in 1 tile">KPI metric tile</SubHead>
      <Frame label="label · value · delta · sparkline" code={`<div className="metric ember">
  <div className="metric-head">
    <span className="metric-label">Deploys today</span>
    <Delta value={+12.4}/>
  </div>
  <div className="metric-value"><Counter to={147} prefix="+"/></div>
  <Sparkline data={trend} color="var(--ember)" w={240} h={36}/>
  <div className="metric-meta">vs. 131 last Tue · 14-day trend</div>
</div>`}>
        <div className="ds-grid cols-3">
          <div className="metric ember">
            <div className="metric-head">
              <span className="metric-label"><Icons.rocket size={11}/> Deploys today</span>
              <Delta value={+12.4} />
            </div>
            <div className="metric-value"><Counter to={147} prefix="+"/></div>
            <div className="metric-spark"><Sparkline data={tDeploys} color="var(--ember)" w={260} h={36}/></div>
            <div className="metric-meta">vs. 131 last Tue · 14-day trend</div>
          </div>
          <div className="metric">
            <div className="metric-head">
              <span className="metric-label"><Icons.zap size={11}/> p95 latency</span>
              <Delta value={-3.6} invert />
            </div>
            <div className="metric-value"><Counter to={142}/><span className="unit">ms</span></div>
            <div className="metric-spark"><Sparkline data={tLatency} color="var(--accent-2)" w={260} h={36}/></div>
            <div className="metric-meta">target ≤ 150ms · 14d</div>
          </div>
          <div className="metric success">
            <div className="metric-head">
              <span className="metric-label"><Icons.shield size={11}/> SLO this month</span>
              <Delta value={+0.04} />
            </div>
            <div className="metric-value"><Counter to={99.94} decimals={2}/><span className="unit">%</span></div>
            <div className="metric-spark"><Sparkline data={tUptime} color="var(--success)" w={260} h={36}/></div>
            <div className="metric-meta">budget remaining · 7d</div>
          </div>
        </div>
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' }}>
        The label says <em>what</em>, the counter says <em>how much</em>, the delta says <em>how it moved</em>, the sparkline says <em>where it's going</em>, and the meta line gives the comparison window. Five primitives, one read. <em>This is the composition you should default to.</em>
      </p>

      {/* ── Density / sizes ─────────────────────────────────────────── */}
      <SubHead meta="3 sizes">Density</SubHead>
      <Frame label="metric.sm · default · metric.lg" code={`<div className="metric sm">…</div>
<div className="metric">…</div>
<div className="metric lg">…</div>`}>
        <div className="ds-grid cols-3">
          <div className="metric sm">
            <div className="metric-head"><span className="metric-label">MRR</span></div>
            <div className="metric-value"><Counter to={84.2} decimals={1}/><span className="unit">k</span></div>
            <div className="metric-meta">USD · monthly</div>
          </div>
          <div className="metric">
            <div className="metric-head"><span className="metric-label">MRR</span><Delta value={+5.6}/></div>
            <div className="metric-value"><Counter to={84.2} decimals={1}/><span className="unit">k USD</span></div>
            <div className="metric-spark"><Sparkline data={[60,64,68,72,76,80,84.2]} color="var(--ember)" w={260} h={36}/></div>
          </div>
          <div className="metric lg ember">
            <div className="metric-head"><span className="metric-label">Annual recurring</span><Delta value={+18.2}/></div>
            <div className="metric-value"><Counter to={1.01} decimals={2}/><span className="unit">M USD</span></div>
            <div className="metric-spark"><Sparkline data={[420,520,610,690,780,860,940,1010]} color="var(--ember)" w={300} h={42}/></div>
            <div className="metric-meta">FY trailing · 12-month</div>
          </div>
        </div>
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' }}>
        Use <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--ember)' }}>.lg</code> only for the page's headline number — the one that earns the eye-track on first paint. Two large tiles in a row cancel each other out.
      </p>

      {/* ── Stat row (horizontal grouped) ───────────────────────────── */}
      <SubHead meta="grouped · share container">Stat row</SubHead>
      <Frame label="dashboard summary band — values share a single bordered surface" code={`<div className="stat-row">
  <div className="stat">
    <div className="stat-label">Active users</div>
    <div className="stat-value">12,840 <Delta value={+4.2}/></div>
    <div className="stat-meta">last 30 days</div>
  </div>
  …
</div>`}>
        <div className="stat-row" style={{ width: '100%' }}>
          <div className="stat">
            <div className="stat-label">Active users</div>
            <div className="stat-value">12,840 <Delta value={+4.2}/></div>
            <div className="stat-meta">last 30 days</div>
          </div>
          <div className="stat">
            <div className="stat-label">Conversion</div>
            <div className="stat-value">3.42<span style={{ fontSize: 'var(--text-md)', color: 'var(--fg-muted)', fontWeight: 500 }}>%</span> <Delta value={+0.6}/></div>
            <div className="stat-meta">vs. 2.82% last period</div>
          </div>
          <div className="stat">
            <div className="stat-label">Churn</div>
            <div className="stat-value">1.18<span style={{ fontSize: 'var(--text-md)', color: 'var(--fg-muted)', fontWeight: 500 }}>%</span> <Delta value={-0.3} invert/></div>
            <div className="stat-meta">below target (1.5%)</div>
          </div>
          <div className="stat">
            <div className="stat-label">Revenue</div>
            <div className="stat-value">$84.2k <Delta value={+12.1}/></div>
            <div className="stat-meta">MTD · forecast +18%</div>
          </div>
        </div>
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' }}>
        Use a stat row when 3–5 values belong together as a summary band — usually pinned to the top of a dashboard or report. Vertical hairlines (logical-property borders) keep them legible at any width and flip cleanly under RTL.
      </p>

      {/* ── Counter primitive ───────────────────────────────────────── */}
      <SubHead meta="counter">Counter</SubHead>
      <Frame
        label="animates from 0 → target on first paint · respects prefix / suffix / decimals"
        code={`<Counter to={147} prefix="+"/>
<Counter to={99.94} suffix="%" decimals={2}/>
<Counter to={1240} suffix="/min"/>`}>
        <div style={{ display: 'flex', gap: 36, alignItems: 'baseline', flexWrap: 'wrap' }}>
          <div>
            <div className="t-mono-label">Deploys</div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, color: 'var(--ember)', fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}><Counter to={147} prefix="+"/></div>
          </div>
          <div>
            <div className="t-mono-label">SLO</div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, color: 'var(--success)', fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}><Counter to={99.94} suffix="%" decimals={2}/></div>
          </div>
          <div>
            <div className="t-mono-label">Throughput</div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}><Counter to={1240} suffix="/min"/></div>
          </div>
        </div>
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' }}>
        Counter ramps from zero to the final value over ~800ms. The motion is what catches the eye — it earns one glance, then steps out of the way. Don't loop it; don't re-trigger on every prop change.
      </p>

      {/* ── Delta primitive ─────────────────────────────────────────── */}
      <SubHead meta="trend chip">Delta</SubHead>
      <Frame
        label="up · down · flat · invert (when down is good)"
        row
        code={`<Delta value={+12.4}/>           {/* green ▲ 12.4% */}
<Delta value={-3.6}/>            {/* red ▼ 3.6% */}
<Delta value={-3.6} invert/>     {/* green ▼ 3.6% — for latency, errors */}
<Delta value={+0.4} suffix="pt"/> {/* points / bps / units */}
<Delta value={0}/>               {/* — flat */}`}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Delta value={+12.4}/>
          <Delta value={-3.6}/>
          <Delta value={-3.6} invert/>
          <Delta value={+0.4} suffix="pt"/>
          <Delta value={0}/>
        </div>
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' }}>
        Delta uses three colors: success for "good direction," danger for "bad direction," muted for flat. <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--ember)' }}>invert</code> flips the polarity for metrics where down is good (latency, error rate, churn, p95) so the user doesn't have to decode meaning per metric.
      </p>

      {/* ── Sparkline variants ──────────────────────────────────────── */}
      <SubHead meta="3 variants">Sparkline</SubHead>
      <Frame
        label="line · bars · win / loss — pick by data shape, not aesthetics"
        code={`<Sparkline    data={[5,8,11,14,18,22,28,32,40]} color="var(--ember)"/>
<SparkBars    data={[12,18,22,19,28,36,32,41]} color="var(--accent-2)"/>
<SparkWinLoss data={[1,1,-1,1,1,1,-1,1,1,1,1,-1,1,1,1]}/>`}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18, alignItems: 'end' }}>
          <div>
            <div className="t-mono-label" style={{ marginBottom: 8 }}>Line · continuous</div>
            <Sparkline data={tDeploys} color="var(--ember)" w={260} h={42}/>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>Deploys / day</div>
          </div>
          <div>
            <div className="t-mono-label" style={{ marginBottom: 8 }}>Bars · discrete counts</div>
            <SparkBars data={dailyTraffic.slice(0, 14)} color="var(--accent-2)" w={260} h={42}/>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>Sessions / day</div>
          </div>
          <div>
            <div className="t-mono-label" style={{ marginBottom: 8 }}>Win/loss · binary</div>
            <SparkWinLoss data={tBuilds} w={260} h={42}/>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>Build pass / fail</div>
          </div>
        </div>
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' }}>
        Sparklines are <em>shape</em> — direction, rhythm, polarity. Skip axes, ticks, gridlines. If the user needs to read an exact value, use a chart with axes, not a sparkline. Match line color to the metric's tone (ember = activity, ice = latency / capacity, success = headroom, danger = errors).
      </p>

      {/* ── Bar chart ────────────────────────────────────────────────── */}
      <SubHead meta="categorical">Bar chart</SubHead>
      <Frame
        label="vertical bars · Y-axis ticks · gridlines · X labels"
        code={`<BarChart
  data={[12,18,24,22,28,6,4]}
  labels={['Mon','Tue','Wed','Thu','Fri','Sat','Sun']}
  color="var(--ember)"
  suffix=" deploys"
/>`}>
        <BarChart data={weekdayDeploys} labels={weekdayLabels} color="var(--ember)" />
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' }}>
        Use bars for comparing discrete categories. Y-axis ticks always start at zero (truncating the baseline distorts the comparison). Hairline gridlines, never bold. One color per series — palette is for stacked bars.
      </p>

      {/* ── Line chart (multi-series) ───────────────────────────────── */}
      <SubHead meta="multi-series">Line chart</SubHead>
      <Frame
        label="three series · legend below · hover for exact values"
        code={`<LineChart series={[
  { name: 'Production', color: 'var(--ember)',  data: [...] },
  { name: 'Staging',    color: 'var(--accent-2)',    data: [...] },
  { name: 'Preview',    color: 'var(--accent-3)', data: [...] },
]} labels={['Jan','Feb',…,'Dec']}/>`}>
        <LineChart series={lineSeries} labels={months} />
        <div className="legend" style={{ marginTop: 12 }}>
          {lineSeries.map(s => (
            <span className="lg-item" key={s.name}>
              <span className="lg-dot line" style={{ background: s.color }}/>
              {s.name}
              <span className="lg-val">{s.data[s.data.length - 1]}</span>
            </span>
          ))}
        </div>
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' }}>
        Cap line charts at 4 series. Beyond that, the eye loses each line and the chart becomes a Rorschach. If you have more, group them (e.g. "everything below 1%" as "Other") or split into small multiples.
      </p>

      {/* ── Area chart ──────────────────────────────────────────────── */}
      <SubHead meta="single series · trend with magnitude">Area chart</SubHead>
      <Frame
        label="line + linear-gradient fill — emphasises volume, not just direction"
        code={`<AreaChart data={[42,48,55,51,60,68,72,78,82,88,94,98]} color="var(--ember)" labels={months}/>`}>
        <AreaChart data={lineSeries[0].data} labels={months} color="var(--ember)"/>
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' }}>
        Area charts emphasise <em>magnitude</em> — useful for total-volume metrics (sessions, GMV, requests). Don't stack more than two areas; the lower series visually "absorbs" the upper one and the comparison breaks.
      </p>

      {/* ── Stacked bar ─────────────────────────────────────────────── */}
      <SubHead meta="composition over time">Stacked bar</SubHead>
      <Frame
        label="status-code breakdown · semantic palette (success / ice / warning / danger)"
        code={`<StackedBar data={[
  { label: 'Mon', segments: [
    { name: '2xx', value: 920, color: 'var(--success)' },
    { name: '3xx', value:  80, color: 'var(--accent-2)' },
    { name: '4xx', value:  32, color: 'var(--warning)' },
    { name: '5xx', value:   6, color: 'var(--danger)' },
  ]},
  …
]}/>`}>
        <StackedBar data={stackedData} />
        <div className="legend" style={{ marginTop: 12 }}>
          <span className="lg-item"><span className="lg-dot" style={{ background: 'var(--success)' }}/>2xx ok</span>
          <span className="lg-item"><span className="lg-dot" style={{ background: 'var(--accent-2)' }}/>3xx redirect</span>
          <span className="lg-item"><span className="lg-dot" style={{ background: 'var(--warning)' }}/>4xx client</span>
          <span className="lg-item"><span className="lg-dot" style={{ background: 'var(--danger)' }}/>5xx server</span>
        </div>
      </Frame>

      {/* ── Donut + legend ──────────────────────────────────────────── */}
      <SubHead meta="composition · share-of-total">Donut</SubHead>
      <Frame
        label="palette by category · centered total · legend with values"
        code={`<Donut data={[
  { label: 'Chrome',  value: 64, color: 'var(--ember)' },
  { label: 'Safari',  value: 19, color: 'var(--accent-2)' },
  …
]}>
  <span className="t-mono-label">Total</span>
  <strong>100%</strong>
</Donut>`}>
        <div style={{ display: 'flex', gap: 36, alignItems: 'center', flexWrap: 'wrap' }}>
          <Donut data={browsers} size={160} thickness={16}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', color: 'var(--fg-faint)', textTransform: 'uppercase' }}>Sessions</span>
            <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, fontFeatureSettings: '"tnum"', color: 'var(--fg)' }}>24.3k</span>
          </Donut>
          <div className="legend" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 10, fontSize: 'var(--text-base)' }}>
            {browsers.map(b => (
              <span className="lg-item" key={b.label} style={{ minWidth: 200, justifyContent: 'space-between', display: 'inline-flex' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span className="lg-dot round" style={{ background: b.color }}/>
                  {b.label}
                </span>
                <span className="lg-val">{b.value}%</span>
              </span>
            ))}
          </div>
        </div>
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' }}>
        Donuts win over pies because the hole gives you a place to put the total. Cap at 6 slices — beyond that, the eye can't compare arc lengths and you should switch to a bar chart.
      </p>

      {/* ── Heatmap calendar ────────────────────────────────────────── */}
      <SubHead meta="calendar · activity">Heatmap</SubHead>
      <Frame
        label="GitHub-style activity calendar · 5 intensity steps"
        code={`<HeatCalendar weeks={26}/>`}>
        <div>
          <HeatCalendar weeks={26}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
            <div className="heat-legend">
              <span>Less</span>
              <span className="cell"/><span className="cell l1"/><span className="cell l2"/><span className="cell l3"/><span className="cell l4"/>
              <span>More</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', fontVariantNumeric: 'tabular-nums' }}>1,284 contributions · last 26 weeks</div>
          </div>
        </div>
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' }}>
        Heatmaps trade exact values for pattern legibility — perfect for "is the user active on weekends?" or "are errors clustered around deploy times?" Always pair with a discrete legend showing what each step means.
      </p>

      {/* ── Bullet chart ────────────────────────────────────────────── */}
      <SubHead meta="value vs target">Bullet</SubHead>
      <Frame
        label="bar = current · vertical line = target · use when the goal is the story"
        code={`<Bullet value={84.2} target={75} max={100} color="var(--ember)"/>`}>
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 80px', alignItems: 'center', gap: 14, rowGap: 18, width: '100%' }}>
          <div className="t-mono-label">MRR vs target</div>
          <Bullet value={84.2} target={75} max={100} color="var(--ember)"/>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontVariantNumeric: 'tabular-nums', textAlign: 'end' }}>$84.2k <span style={{ color: 'var(--success)' }}>↑</span></div>

          <div className="t-mono-label">SLO budget</div>
          <Bullet value={68} target={50} max={100} color="var(--success)"/>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontVariantNumeric: 'tabular-nums', textAlign: 'end' }}>68% left</div>

          <div className="t-mono-label">Test coverage</div>
          <Bullet value={62} target={80} max={100} color="var(--warning)"/>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontVariantNumeric: 'tabular-nums', textAlign: 'end' }}>62% / 80%</div>

          <div className="t-mono-label">Deploy cadence</div>
          <Bullet value={32} target={50} max={50} color="var(--accent-2)"/>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontVariantNumeric: 'tabular-nums', textAlign: 'end' }}>32 / 50/wk</div>
        </div>
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' }}>
        Bullet charts (Stephen Few, 2005) replace gauges in dense layouts: the same value-vs-target story in a fraction of the pixels. The vertical line is the target — never decorate it; it's the load-bearing element.
      </p>

      {/* ── Funnel ──────────────────────────────────────────────────── */}
      <SubHead meta="conversion">Funnel</SubHead>
      <Frame
        label="stages · width proportional to value · % vs first stage"
        code={`<Funnel data={[
  { label: 'Visitors',   value: 24380 },
  { label: 'Sign-up',    value: 12640 },
  { label: 'Activated',  value:  8920 },
  { label: 'Subscribed', value:  3120 },
  { label: 'Renewed',    value:  2240 },
]}/>`}>
        <Funnel data={funnelData} color="var(--ember)" />
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' }}>
        Funnels show drop-off across an ordered journey. The widest stage is always the entry; subsequent stages must be subsets. If your stages aren't strictly nested, use a bar chart instead — funnels imply funnel semantics.
      </p>

      {/* ── Gauges ──────────────────────────────────────────────────── */}
      <SubHead meta="single value · % of total">Radial gauge</SubHead>
      <Frame
        label="half-circle arc · use for SLO, capacity, score — one number that maps to a fixed range"
        code={`<Gauge value={84.2} max={100} color="var(--ember)" label="%"/>`}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <Gauge value={84.2} max={100} color="var(--ember)" label="%" />
            <div className="t-mono-label">SLO this month</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <Gauge value={62} max={100} color="var(--success)" label="%" />
            <div className="t-mono-label">CPU headroom</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <Gauge value={92} max={100} color="var(--warning)" label="%" />
            <div className="t-mono-label">Disk used</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <Gauge value={48} max={100} color="var(--accent-2)" label="" />
            <div className="t-mono-label">NPS · 30d</div>
          </div>
        </div>
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' }}>
        Gauges are heavy — they earn one per dashboard, not per metric. Use them when the value's <em>position in a fixed range</em> is the story (97% disk full reads differently than 97% of plan). For dense views, prefer Bullet.
      </p>

      <SubHead meta="thickness · stroke weight scale">Gauge thickness</SubHead>
      <Frame
        label="four weights · same radius · pick a single weight per dashboard"
        code={`<Gauge value={72} thickness={6}  /> {/* hairline */}
<Gauge value={72} thickness={10} /> {/* thin    */}
<Gauge value={72} thickness={14} /> {/* default */}
<Gauge value={72} thickness={22} /> {/* thick   */}`}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, width: '100%', alignItems: 'end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <Gauge value={72} max={100} thickness={6} color="var(--ember)" label="%" />
            <div className="t-mono-label">Hairline · 6</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <Gauge value={72} max={100} thickness={10} color="var(--ember)" label="%" />
            <div className="t-mono-label">Thin · 10</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <Gauge value={72} max={100} thickness={14} color="var(--ember)" label="%" />
            <div className="t-mono-label">Default · 14</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <Gauge value={72} max={100} thickness={22} color="var(--ember)" label="%" />
            <div className="t-mono-label">Thick · 22</div>
          </div>
        </div>
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' }}>
        Thickness changes the visual weight, not the meaning. Hairline reads as a quiet metric inside a tile; thick reads as a hero indicator. Don't mix two thicknesses on the same screen — the eye reads them as different metrics rather than the same one at different importance.
      </p>

      <SubHead meta="size + thickness · responsive scale">Gauge sizes</SubHead>
      <Frame label="small in tiles · medium in cards · large as hero">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: 24, width: '100%', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <Gauge value={84} max={100} size={96}  thickness={7}  color="var(--ember)" label="%" />
            <div className="t-mono-label">96 · in tile</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <Gauge value={84} max={100} size={140} thickness={10} color="var(--ember)" label="%" />
            <div className="t-mono-label">140 · in card</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <Gauge value={84} max={100} size={200} thickness={16} color="var(--ember)" label="%" />
            <div className="t-mono-label">200 · default</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <Gauge value={84} max={100} size={280} thickness={22} color="var(--ember)" label="%" />
            <div className="t-mono-label">280 · hero</div>
          </div>
        </div>
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' }}>
        Thickness should scale roughly linearly with size — a 96px gauge with a 22px stroke is a doughnut, not a gauge. Rule of thumb: <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--ember)' }}>thickness ≈ size / 13</code>.
      </p>

      {/* ── Composition: dashboard ──────────────────────────────────── */}
      <SubHead meta="composition · putting it together">Dashboard layout</SubHead>
      <Frame label="real-world composition: stat row · KPI tiles · area + heatmap · stacked + donut" height={620}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, width: '100%' }}>
          {/* Top stat row */}
          <div className="stat-row" style={{ width: '100%' }}>
            <div className="stat">
              <div className="stat-label">MRR</div>
              <div className="stat-value">$84.2k <Delta value={+12.1}/></div>
              <div className="stat-meta">vs. $75.1k last month</div>
            </div>
            <div className="stat">
              <div className="stat-label">Active</div>
              <div className="stat-value">12,840 <Delta value={+4.2}/></div>
              <div className="stat-meta">DAU / MAU 0.42</div>
            </div>
            <div className="stat">
              <div className="stat-label">p95</div>
              <div className="stat-value">142<span style={{ fontSize: 'var(--text-md)', color: 'var(--fg-muted)' }}>ms</span> <Delta value={-3.6} invert/></div>
              <div className="stat-meta">target ≤ 150ms</div>
            </div>
            <div className="stat">
              <div className="stat-label">SLO</div>
              <div className="stat-value">99.94<span style={{ fontSize: 'var(--text-md)', color: 'var(--fg-muted)' }}>%</span> <Delta value={+0.04}/></div>
              <div className="stat-meta">budget remaining</div>
            </div>
          </div>

          {/* Two charts row */}
          <div className="ds-grid cols-2">
            <div className="surface" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <span className="t-mono-label">Revenue · 12 months</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', fontFamily: 'var(--font-mono)' }}>USD · k</span>
              </div>
              <AreaChart data={lineSeries[0].data} labels={months} color="var(--ember)" h={180}/>
            </div>
            <div className="surface" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                <span className="t-mono-label">Activity · 26 weeks</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>1,284 events</span>
              </div>
              <div style={{ marginTop: 4 }}><HeatCalendar weeks={26} seed={9876}/></div>
              <div className="heat-legend" style={{ marginTop: 14 }}>
                <span>Less</span>
                <span className="cell"/><span className="cell l1"/><span className="cell l2"/><span className="cell l3"/><span className="cell l4"/>
                <span>More</span>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14 }}>
            <div className="surface" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <span className="t-mono-label">Requests by status</span>
                <div className="legend" style={{ fontSize: 'var(--text-xs)' }}>
                  <span className="lg-item"><span className="lg-dot" style={{ background: 'var(--success)' }}/>2xx</span>
                  <span className="lg-item"><span className="lg-dot" style={{ background: 'var(--accent-2)' }}/>3xx</span>
                  <span className="lg-item"><span className="lg-dot" style={{ background: 'var(--warning)' }}/>4xx</span>
                  <span className="lg-item"><span className="lg-dot" style={{ background: 'var(--danger)' }}/>5xx</span>
                </div>
              </div>
              <StackedBar data={stackedData} h={180}/>
            </div>
            <div className="surface" style={{ padding: 16 }}>
              <div style={{ marginBottom: 10 }}><span className="t-mono-label">Sessions by browser</span></div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 14 }}>
                <Donut data={browsers} size={130} thickness={14}>
                  <span style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--fg)', fontFeatureSettings: '"tnum"' }}>24.3k</span>
                </Donut>
                <div className="legend" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8, fontSize: 'var(--text-xs)' }}>
                  {browsers.map(b => (
                    <span className="lg-item" key={b.label}>
                      <span className="lg-dot round" style={{ background: b.color }}/>
                      {b.label} <span className="lg-val">{b.value}%</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' }}>
        Inspired by what you see on Linear, Vercel, Datadog, and Stripe dashboards: a stat-row band on top (the headline), then two-up rows of charts beneath. Each chart owns one question — never two. Headers use mono labels so they stay quiet under the data.
      </p>

      {/* ── States ──────────────────────────────────────────────────── */}
      <SubHead meta="empty · loading · error · stale">States</SubHead>
      <Frame label="every metric needs the four states beyond the happy path — each labelled and announced" row>
        {/* Empty — offers the next action */}
        <div className="metric" style={{ width: 280, alignItems: 'center', justifyContent: 'center', minHeight: 148 }}>
          <div className="metric-label" style={{ marginBottom: 12 }}>Empty · no data yet</div>
          <Icons.zap size={22} color="var(--fg-faint)"/>
          <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-subtle)', marginTop: 8, textAlign: 'center', lineHeight: 1.55 }}>Connect a source to see metrics here.</div>
          <button className="btn xs ember" style={{ marginTop: 12 }}>Connect</button>
        </div>
        {/* Loading — real Spinner (role="status") + shape-matched skeletons */}
        <div className="metric" style={{ width: 280 }} aria-busy="true">
          <div className="metric-head">
            <span className="metric-label">Loading</span>
            <Spinner size="sm" aria-label="Loading metric" style={{ color: 'var(--fg-faint)' }}/>
          </div>
          <span className="sk-line" style={{ width: 96, height: 30, marginBlockStart: 4 }}/>
          <span className="sk-line" style={{ width: '100%', height: 36, marginBlockStart: 10 }}/>
          <span className="sk-line" style={{ width: 140, height: 11, marginBlockStart: 8 }}/>
        </div>
        {/* Error — keeps the scaffold, replaces the value with em-dash, announced via role="alert" */}
        <div className="metric" role="alert" style={{ width: 280, borderColor: 'rgba(248,113,113,0.30)', background: 'var(--danger-soft)' }}>
          <div className="metric-head">
            <span className="metric-label" style={{ color: 'var(--danger)' }}><Icons.alert size={11}/> Error</span>
          </div>
          <div className="metric-value" style={{ color: 'var(--danger)' }}>—</div>
          <div className="metric-meta">Source timed out · retry in 30s</div>
          <button className="btn xs outline" style={{ marginBlockStart: 8, alignSelf: 'flex-start' }}>
            <Icons.refresh size={12}/> Retry
          </button>
        </div>
        {/* Stale — the value still renders but is flagged invalid until the source recovers */}
        <div className="metric" style={{ width: 280 }}>
          <div className="metric-head">
            <span className="metric-label" style={{ color: 'var(--warning)' }}><Icons.clock size={11}/> Stale</span>
            <Delta value={+12.4}/>
          </div>
          <div className="metric-value" style={{ color: 'var(--fg-muted)' }}>+147</div>
          <div className="alert warning" role="status" aria-live="polite" style={{ marginBlockStart: 8, padding: '8px 10px' }}>
            <span className="alert-icon"><Icons.alert size={13}/></span>
            <span className="alert-body"><span className="alert-desc">Last synced 6m ago · value may be out of date.</span></span>
          </div>
        </div>
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' }}>
        <b style={{ color: 'var(--fg)' }}>Empty</b> offers the next action ("Connect"). <b style={{ color: 'var(--fg)' }}>Loading</b> swaps the value for skeletons of the same shape (so layout doesn't jump) and exposes a <Mono>role="status"</Mono> spinner. <b style={{ color: 'var(--fg)' }}>Error</b> keeps the metric scaffold, replaces the value with an em-dash, offers a retry, and fires <Mono>role="alert"</Mono> so a screen reader is interrupted. <b style={{ color: 'var(--fg)' }}>Stale</b> keeps the last value but dims it and flags the staleness politely (<Mono>aria-live="polite"</Mono>). Never collapse the tile — that thrashes the dashboard grid.
      </p>

      {/* ── Accessibility ───────────────────────────────────────────── */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 10}}>Keyboard</div>
          <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 14, rowGap: 8, margin: 0, fontSize: 'var(--text-base)', lineHeight: 1.5 }}>
            <dt><kbd className="kbd">Tab</kbd></dt>
            <dd style={{ margin: 0, color: 'var(--fg-muted)' }}>Moves to the next interactive wrapper — a metric tile wrapped in a link, a "Connect"/"Retry" button, a drill-in chart row. A bare metric or SVG adds no stop.</dd>
            <dt><kbd className="kbd">Enter</kbd> <span style={{ color: 'var(--fg-faint)' }}>/</span> <kbd className="kbd">Space</kbd></dt>
            <dd style={{ margin: 0, color: 'var(--fg-muted)' }}>Activates the focused wrapper (open the source, retry the fetch). The focused element shows the global <Mono>:focus-visible</Mono> ember ring.</dd>
          </dl>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Decorative sparklines and heat cells carry <Mono>aria-hidden="true"</Mono>; charts that hold the data give the <Mono>&lt;svg&gt;</Mono> <Mono>role="img"</Mono> with an <Mono>aria-label</Mono> summarising the value (the gauge announces <em>"84% of 100%"</em>). Each bar/point exposes a <Mono>&lt;title&gt;</Mono> for exact figures, and metric label → value → meta read as plain text in order. The loading state exposes a <Mono>role="status"</Mono> spinner; the error tile fires <Mono>role="alert"</Mono>; the stale notice updates via <Mono>aria-live="polite"</Mono>.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Colour &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Trend never relies on hue alone: Delta pairs colour with a direction glyph (▲ ▼ —), and stacked-status segments carry a legend label. Values render in tabular numerals at <Mono>--fg</Mono> (≥ 4.5:1 on every surface); the categorical viz palette is tuned to stay perceptually distinct at small dot sizes on dark surfaces. On the ember tile the value is dark ink, never ember-on-ember.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Reduced motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The only motion is the Counter ramp (~800ms, once on first view, never looped) and the loading spinner. Under <Mono>prefers-reduced-motion: reduce</Mono> the global guard collapses the Counter so final values paint immediately, and the <Mono>.sp-ring</Mono> spinner switches from rotation to a calm opacity pulse; charts render statically throughout.</div>
        </div>
      </div>

      {/* ── RTL ─────────────────────────────────────────────────────── */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label="dir=&quot;rtl&quot; — labels, deltas, axis ticks, and stat dividers all mirror"
        code={`<div dir="rtl" className="ds-grid cols-3">
  <div className="metric ember">
    <div className="metric-head">
      <span className="metric-label">عمليات النشر اليوم</span>
      <Delta value={+12.4}/>
    </div>
    <div className="metric-value">+147</div>
    <Sparkline data={trend} color="var(--ember)"/>
    <div className="metric-meta">مقارنة بـ 131 الثلاثاء الماضي</div>
  </div>
</div>`}>
        <div dir="rtl" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* RTL stat row */}
          <div className="stat-row" style={{ width: '100%' }}>
            <div className="stat">
              <div className="stat-label">المستخدمون النشطون</div>
              <div className="stat-value">12,840 <Delta value={+4.2}/></div>
              <div className="stat-meta">آخر 30 يومًا</div>
            </div>
            <div className="stat">
              <div className="stat-label">الإيرادات</div>
              <div className="stat-value">84.2 <span style={{ fontSize: 'var(--text-md)', color: 'var(--fg-muted)', fontWeight: 500 }}>ألف</span> <Delta value={+12.1}/></div>
              <div className="stat-meta">الشهر الحالي</div>
            </div>
            <div className="stat">
              <div className="stat-label">زمن الاستجابة p95</div>
              <div className="stat-value">142<span style={{ fontSize: 'var(--text-md)', color: 'var(--fg-muted)', fontWeight: 500 }}> مللي</span> <Delta value={-3.6} invert/></div>
              <div className="stat-meta">الهدف ≤ 150</div>
            </div>
          </div>

          {/* RTL KPI tiles */}
          <div className="ds-grid cols-3">
            <div className="metric ember">
              <div className="metric-head">
                <span className="metric-label">عمليات النشر اليوم</span>
                <Delta value={+12.4}/>
              </div>
              <div className="metric-value"><Counter to={147} prefix="+"/></div>
              <div className="metric-spark"><Sparkline data={tDeploys} color="var(--ember)" w={260} h={36}/></div>
              <div className="metric-meta">مقارنة بـ 131 الثلاثاء الماضي</div>
            </div>
            <div className="metric">
              <div className="metric-head">
                <span className="metric-label">زمن الاستجابة p95</span>
                <Delta value={-3.6} invert/>
              </div>
              <div className="metric-value"><Counter to={142}/><span className="unit">مللي</span></div>
              <div className="metric-spark"><Sparkline data={tLatency} color="var(--accent-2)" w={260} h={36}/></div>
              <div className="metric-meta">الهدف ≤ 150 مللي</div>
            </div>
            <div className="metric success">
              <div className="metric-head">
                <span className="metric-label">SLO الشهر</span>
                <Delta value={+0.04}/>
              </div>
              <div className="metric-value"><Counter to={99.94} decimals={2}/><span className="unit">%</span></div>
              <div className="metric-spark"><Sparkline data={tUptime} color="var(--success)" w={260} h={36}/></div>
              <div className="metric-meta">رصيد الميزانية · 7 أيام</div>
            </div>
          </div>

          {/* RTL bar chart */}
          <div className="surface" style={{ padding: 16 }}>
            <div style={{ marginBottom: 10 }}><span className="t-mono-label">عمليات النشر · الأسبوع</span></div>
            <BarChart data={weekdayDeploys} labels={['الإث','الثل','الأر','الخم','الجم','السب','الأح']} color="var(--ember)" h={160}/>
          </div>
        </div>
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' }}>
        Numeric cells keep <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--ember)' }}>font-feature-settings: 'tnum'</code> so columns align with mixed Arabic-Indic and Latin numerals. Sparklines and chart axes are <em>geometric</em> — they don't flip, because "trending up" still points up regardless of reading direction. Stat-row dividers use <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--ember)' }}>border-inline-start</code>, so the visual order reverses correctly. Time-series data still reads left-to-right (oldest → newest); reversing the X axis would force the user to re-decode every chart they've ever seen.
      </p>

      {/* ── Anatomy ─────────────────────────────────────────────────── */}
      <SubHead meta="anatomy">Anatomy of a metric tile</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 320 }} aria-hidden="true">
              <div className="metric ember" tabIndex={-1}>
                <div className="metric-head">
                  <span className="metric-label"><Icons.rocket size={11}/> Deploys today</span>
                  <Delta value={+12.4}/>
                </div>
                <div className="metric-value">+147</div>
                <div className="metric-spark"><Sparkline data={tDeploys} color="var(--ember)" w={280} h={36}/></div>
                <div className="metric-meta">vs. 131 last Tue · 14-day trend</div>
              </div>
              {/* Pin leader lines */}
              <span className="lead h" style={{ top: 26, left: -28, width: 24 }}/>
              <span className="lead h" style={{ top: 26, right: -28, width: 24 }}/>
              <span className="lead h" style={{ top: 64, left: -28, width: 24 }}/>
              <span className="lead h" style={{ top: 122, left: -28, width: 24 }}/>
              <span className="lead h" style={{ bottom: 16, left: -28, width: 24 }}/>
              {/* Pins */}
              <div className="pin" style={{ top: 18, left: -52 }}>1</div>
              <div className="pin" style={{ top: 18, right: -52 }}>2</div>
              <div className="pin" style={{ top: 56, left: -52 }}>3</div>
              <div className="pin" style={{ top: 114, left: -52 }}>4</div>
              <div className="pin" style={{ bottom: 8, left: -52 }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 580, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Label.</b> Geist Mono 11/16, uppercase, letter-spacing 0.08em. Optional leading icon (11px).</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Delta chip.</b> Period-over-period change. Use <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--ember)' }}>invert</code> when down is good.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Value.</b> Geist 600/32, tabular numerals, line-height 1.1. Color matches the tile's tone (or <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--ember)' }}>var(--fg)</code>).</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Sparkline.</b> 240–280 × 36px, no axes. Same color as the value when tonal.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Meta.</b> Comparison context — "vs. X last week", "12-month trailing". Mono numerals.</span>
          </div>
        </div>
      </div>

      {/* ── Decision matrix ─────────────────────────────────────────── */}
      <SubHead meta="when to use what">Decision matrix</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Pick a chart</span></div>
        <table className="spec" style={{ margin: 0 }}>
          <thead><tr><th style={{ padding: '10px 12px' }}>Goal</th><th>Use</th><th>Avoid</th></tr></thead>
          <tbody>
            <tr><td>Show one number with context</td><td className="tok-name">.metric</td><td className="mono">A bare value, a gauge</td></tr>
            <tr><td>Show period-over-period change</td><td className="tok-name">Delta + Sparkline</td><td className="mono">Bar chart with two bars</td></tr>
            <tr><td>Hint at direction / rhythm only</td><td className="tok-name">Sparkline (line)</td><td className="mono">Full chart with axes</td></tr>
            <tr><td>Show discrete daily counts</td><td className="tok-name">SparkBars / BarChart</td><td className="mono">Line chart</td></tr>
            <tr><td>Compare 2–4 series over time</td><td className="tok-name">LineChart</td><td className="mono">Stacked area</td></tr>
            <tr><td>Show total volume + trend</td><td className="tok-name">AreaChart</td><td className="mono">Multi-line</td></tr>
            <tr><td>Decompose a total over time</td><td className="tok-name">StackedBar</td><td className="mono">Multiple donuts in a row</td></tr>
            <tr><td>Share-of-total at a point in time</td><td className="tok-name">Donut</td><td className="mono">3-D pie, exploded slices</td></tr>
            <tr><td>Pattern across days × hours / weeks</td><td className="tok-name">Heatmap</td><td className="mono">Many tiny line charts</td></tr>
            <tr><td>Value vs target, dense layout</td><td className="tok-name">Bullet</td><td className="mono">Gauge per metric</td></tr>
            <tr><td>One headline % of a fixed range</td><td className="tok-name">Gauge</td><td className="mono">Stacked bar of one</td></tr>
            <tr><td>Drop-off across an ordered journey</td><td className="tok-name">Funnel</td><td className="mono">Pie</td></tr>
            <tr><td>Tabular rows of records</td><td className="tok-name"><a href="/table" style={{ color: 'var(--ember)', textDecoration: 'none' }}>Table</a></td><td className="mono">A bar chart per row</td></tr>
            <tr><td>One task's % complete</td><td className="tok-name"><a href="/progress" style={{ color: 'var(--ember)', textDecoration: 'none' }}>Progress</a></td><td className="mono">Bullet</td></tr>
          </tbody>
        </table>
      </div>

      {/* ── Color usage ─────────────────────────────────────────────── */}
      <SubHead meta="palette · semantic">Color usage</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Six tokens, six meanings</span></div>
        <table className="spec" style={{ margin: 0 }}>
          <thead><tr><th style={{ padding: '10px 12px' }}>Token</th><th>Use for</th><th>Example metric</th></tr></thead>
          <tbody>
            <tr>
              <td className="tok-name"><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: 'var(--ember)', marginInlineEnd: 8, verticalAlign: 'middle' }}/>--ember</td>
              <td>Activity, primary brand metric, the one number that matters</td><td className="mono">Deploys, MRR, requests/min</td>
            </tr>
            <tr>
              <td className="tok-name"><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: 'var(--accent-2)', marginInlineEnd: 8, verticalAlign: 'middle' }}/>--accent-2</td>
              <td>Latency, capacity, neutral observational metrics</td><td className="mono">p50/p95, CPU, throughput</td>
            </tr>
            <tr>
              <td className="tok-name"><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: 'var(--success)', marginInlineEnd: 8, verticalAlign: 'middle' }}/>--success</td>
              <td>Headroom, healthy states, positive deltas</td><td className="mono">SLO, success rate, uptime</td>
            </tr>
            <tr>
              <td className="tok-name"><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: 'var(--warning)', marginInlineEnd: 8, verticalAlign: 'middle' }}/>--warning</td>
              <td>Threshold breached but not critical</td><td className="mono">4xx rate, cost spike</td>
            </tr>
            <tr>
              <td className="tok-name"><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: 'var(--danger)', marginInlineEnd: 8, verticalAlign: 'middle' }}/>--danger</td>
              <td>Errors, critical state, negative deltas (uninverted)</td><td className="mono">5xx, churn, incidents</td>
            </tr>
            <tr>
              <td className="tok-name"><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: 'var(--accent-3)', marginInlineEnd: 8, verticalAlign: 'middle' }}/>--accent-3</td>
              <td>Adjacent / experimental segment in a multi-series chart</td><td className="mono">Preview env, beta cohort</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' }}>
        Colour is semantic in this system, not decorative. Don't paint a metric green because it looks nice — paint it green because it's a healthy direction. Reserve <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--ember)' }}>--ember</code> for the page's primary metric so it doesn't have to compete with three peers.
      </p>

      {/* ── Cross-references ────────────────────────────────────────── */}
      <SubHead meta="related">Tables, progress, and pagination</SubHead>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', maxWidth: '64ch', lineHeight: 1.6 }}>
        Need to render rows? See <a href="/table" style={{ color: 'var(--ember)', textDecoration: 'none', fontWeight: 500 }}>Table</a> — basic, sortable, searchable, filterable, paginated, and selectable variants. For task progress see <a href="/progress" style={{ color: 'var(--ember)', textDecoration: 'none', fontWeight: 500 }}>Progress</a>; for footer pagers see <a href="/pagination" style={{ color: 'var(--ember)', textDecoration: 'none', fontWeight: 500 }}>Pagination</a>.
      </p>

      {/* ── Do / Don't ──────────────────────────────────────────────── */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — start Y axis at zero</div>
          <div className="body" style={{ padding: 16 }}>
            <BarChart data={[28, 30, 32, 34, 36]} labels={['Q1','Q2','Q3','Q4','Q5']} color="var(--ember)" w={300} h={140} gridY={4}/>
          </div>
          <div className="note">Honest comparison — the change is real, not exaggerated.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — truncate the baseline</div>
          <div className="body" style={{ padding: 16, position: 'relative' }}>
            <svg viewBox="0 0 300 140" style={{ width: '100%', maxWidth: 300, height: 140 }}>
              <line x1="36" y1="20" x2="296" y2="20" stroke="var(--border)" strokeDasharray="2 4"/>
              <line x1="36" y1="60" x2="296" y2="60" stroke="var(--border)" strokeDasharray="2 4"/>
              <line x1="36" y1="100" x2="296" y2="100" stroke="var(--border)" strokeDasharray="2 4"/>
              <text x="30" y="23" textAnchor="end" fill="var(--fg-faint)" fontFamily="var(--font-mono)" fontSize="10">36</text>
              <text x="30" y="63" textAnchor="end" fill="var(--fg-faint)" fontFamily="var(--font-mono)" fontSize="10">32</text>
              <text x="30" y="103" textAnchor="end" fill="var(--fg-faint)" fontFamily="var(--font-mono)" fontSize="10">28</text>
              {[28, 30, 32, 34, 36].map((v, i) => {
                const x = 50 + i * 50;
                const y = 100 - (v - 28) * 10;
                return <rect key={i} x={x} y={y} width={28} height={120 - y} fill="var(--ember)" rx="1"/>;
              })}
            </svg>
          </div>
          <div className="note">Lying with axes. A 2× tall bar implies a 2× larger value.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — one accent per surface</div>
          <div className="body" style={{ gap: 10, flexDirection: 'column', alignItems: 'stretch', padding: 16 }}>
            <div className="metric ember"><div className="metric-head"><span className="metric-label">Deploys</span><Delta value={+12}/></div><div className="metric-value">147</div></div>
            <div className="metric"><div className="metric-head"><span className="metric-label">p95</span></div><div className="metric-value">142<span className="unit">ms</span></div></div>
          </div>
          <div className="note">Ember reserves attention. The headline number, then quiet peers.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — every tile in primary</div>
          <div className="body" style={{ gap: 10, flexDirection: 'column', alignItems: 'stretch', padding: 16 }}>
            <div className="metric ember"><div className="metric-head"><span className="metric-label">Deploys</span></div><div className="metric-value">147</div></div>
            <div className="metric ember"><div className="metric-head"><span className="metric-label">p95</span></div><div className="metric-value">142<span className="unit">ms</span></div></div>
          </div>
          <div className="note">Three embers cancel each other out. None of them feel important anymore.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — invert delta when down is good</div>
          <div className="body" style={{ gap: 14, padding: 16 }}>
            <div>
              <div className="t-mono-label">p95 latency</div>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 600, marginTop: 4, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>142<span style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', marginInlineStart: 4 }}>ms</span></div>
              <div style={{ marginTop: 6 }}><Delta value={-3.6} invert/></div>
            </div>
          </div>
          <div className="note">Latency fell, so the chip is green. <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--ember)' }}>invert</code> handles the polarity.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — red for "latency down 3.6%"</div>
          <div className="body" style={{ gap: 14, padding: 16 }}>
            <div>
              <div className="t-mono-label">p95 latency</div>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 600, marginTop: 4, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>142<span style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', marginInlineStart: 4 }}>ms</span></div>
              <div style={{ marginTop: 6 }}><Delta value={-3.6}/></div>
            </div>
          </div>
          <div className="note">Reads as bad news at a glance — but lower latency is good. Forces the user to decode meaning per metric.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — donut for ≤ 6 categories</div>
          <div className="body" style={{ padding: 16 }}>
            <Donut data={browsers} size={120} thickness={12}/>
          </div>
          <div className="note">Five slices, all distinguishable. The eye can compare arc lengths.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — 12-slice pie of countries</div>
          <div className="body" style={{ padding: 16 }}>
            <Donut data={[
              { label: 'A', value: 18, color: 'var(--ember)' },
              { label: 'B', value: 14, color: 'var(--accent-2)' },
              { label: 'C', value: 12, color: 'var(--accent-3)' },
              { label: 'D', value: 10, color: 'var(--success)' },
              { label: 'E', value: 9,  color: 'var(--warning)' },
              { label: 'F', value: 8,  color: 'var(--danger)' },
              { label: 'G', value: 7,  color: 'var(--fg-subtle)' },
              { label: 'H', value: 6,  color: 'var(--viz-cat-8)' },
              { label: 'I', value: 5,  color: 'var(--viz-cat-6)' },
              { label: 'J', value: 4,  color: 'var(--success)' },
              { label: 'K', value: 4,  color: 'var(--warning)' },
              { label: 'L', value: 3,  color: 'var(--accent-3)' },
            ]} size={120} thickness={12}/>
          </div>
          <div className="note">No one can read a 12-slice pie. Switch to a sorted bar chart and let the longest bar do the work.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — tabular numerals</div>
          <div className="body" style={{ flexDirection: 'column', gap: 6, padding: 16, alignItems: 'flex-start' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-md)', fontVariantNumeric: 'tabular-nums' }}>$  84,200</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-md)', fontVariantNumeric: 'tabular-nums' }}>$ 121,400</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-md)', fontVariantNumeric: 'tabular-nums' }}>$  98,140</div>
          </div>
          <div className="note">Digits align in columns; the eye scans values without re-parsing each row.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — proportional digits in a column</div>
          <div className="body" style={{ flexDirection: 'column', gap: 6, padding: 16, alignItems: 'flex-start' }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-md)', fontVariantNumeric: 'proportional-nums' }}>$  84,200</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-md)', fontVariantNumeric: 'proportional-nums' }}>$ 121,400</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-md)', fontVariantNumeric: 'proportional-nums' }}>$  98,140</div>
          </div>
          <div className="note">Digits jitter; you have to re-read each row instead of scanning vertically.</div>
        </div>
      </div>

      {/* 6. API REFERENCE */}
      <SubHead meta="MetricProps">API reference</SubHead>
      <PropsTable
        label="<Metric />"
        rows={[
          { prop: 'variant', type: '"default" | "ember" | "success" | "danger"', default: '"default"', description: 'Accent tone for the value + border. Use ember for the page’s primary metric.' },
          { prop: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Tile padding + value type scale. lg is for the headline number only.' },
          { prop: 'children', type: 'ReactNode', required: true, description: 'Compose with MetricHead / MetricLabel / MetricValue / Sparkline / MetricMeta.' },
          { prop: 'className', type: 'string', default: undefined, description: 'Extra utility classes merged via cn().' },
        ]}
      />
      <PropsTable
        label="<Delta />"
        rows={[
          { prop: 'value', type: 'number', required: true, description: 'Signed change. Sign drives arrow + tone (positive = success, negative = danger).' },
          { prop: 'suffix', type: 'string', default: '"%"', description: 'Unit appended after the number — pt, bps, units, etc.' },
          { prop: 'invert', type: 'boolean', default: 'false', description: 'Flip polarity. Use for metrics where down is good (latency, error rate, churn).' },
        ]}
      />
      <PropsTable
        label="<Counter />"
        rows={[
          { prop: 'to', type: 'number', required: true, description: 'Final value. Animates from 0 over ~800ms on mount.' },
          { prop: 'prefix', type: 'string', default: undefined, description: 'Glyph before the number — "+", "$", "~".' },
          { prop: 'suffix', type: 'string', default: undefined, description: 'Glyph after the number — "%", "ms", "/min".' },
          { prop: 'decimals', type: 'number', default: '0', description: 'How many decimal places to show during and after the ramp.' },
        ]}
      />
      <PropsTable
        label="<Gauge /> · <Donut /> · <Bullet />"
        rows={[
          { prop: 'value', type: 'number', required: true, description: 'Current value 0–max.' },
          { prop: 'max', type: 'number', default: '100', description: 'Upper bound that anchors the visualisation.' },
          { prop: 'size', type: 'number', default: '180', description: 'Outer dimension in px. Gauge auto-shrinks vertically to the half-arc baseline.' },
          { prop: 'thickness', type: 'number', default: '14', description: 'Ring / arc stroke. Rule of thumb: thickness ≈ size / 13.' },
          { prop: 'color', type: 'string', default: '"var(--ember)"', description: 'Fill color. Any DS token works (ember, success, warning, danger, ice, violet).' },
        ]}
      />
    </Section>
  );
}
