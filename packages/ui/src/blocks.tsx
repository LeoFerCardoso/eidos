import * as React from 'react';
// Forge DS — building blocks & IDP recipes (Phase 3 + Phase 3-rework).
//
// Mid-level React helpers that COMPOSE existing atoms (Pill, StatusDot,
// Trend, Avatar, Sparkline, Card, Icons). Page chrome lives in ds.css under
// the block-specific class. No new tokens, no inline CSS.
//
// AUTHORING RULES (do NOT regress):
//   1. Every block is a named `export` consumed via `import { … } from '@/ds/core'`.
//      No `window` registry — the core barrel re-exports each block.
//   2. Compose, don't reinvent. Reach for Pill/Card/Avatar/StatusDot/Trend
//      before inventing a new visual.
import { Icons } from './icons';
import {
  StatusDot, Trend, HealthBadge, SeverityPill, TierBadge, LangBadge,
  OwnerPill, CountUp, RelativeTime, Sparkline, Avatar, Empty,
} from './atoms';

// ═════════════════════════════════════════════════════════════════════════
// Banner — full-width attention bar at the top of a page (or inside a card).
// Used for maintenance windows, version upgrades, new-feature announcements,
// incident notices. Replaces the old `AlertBar`.
//
// Props:
//   tone        "info" | "success" | "warning" | "danger" | "neutral" | "custom"
//   icon        Icons key (string)
//   title       string
//   message     ReactNode
//   action      string label of the primary CTA
//   onAction    () => void
//   actions     ReactNode — fully custom CTA slot (overrides action/onAction)
//   onDismiss   () => void
//   bg, fg, accent  CSS colours when tone === "custom" — bg surface, fg text,
//                   accent for icon + CTA accent border
//   icon        Icons key — override default tone icon
//   size        "sm" | "md" (default) | "lg"
// ═════════════════════════════════════════════════════════════════════════
const BANNER_DEFAULT_ICON = { info: 'info', success: 'check', warning: 'alert', danger: 'alert', neutral: 'info' };
const Banner = ({
  tone = 'info', icon, title, message,
  action, onAction, actions, onDismiss,
  bg, fg, accent, size = 'md', children,
}: {
  /** Built-in palettes. "custom" disables tinted chrome and uses your bg / fg / accent. */
  tone?: 'info' | 'success' | 'warning' | 'danger' | 'neutral' | 'custom';
  /** Override the default tone icon (Icons key). */
  icon?: string;
  /** Bold lead text. Omit for message-only banners. */
  title?: string;
  /** Muted body text. Keep it short — one sentence. */
  message?: React.ReactNode;
  /** Label of the primary CTA (renders as a ghost button). */
  action?: string;
  /** Click handler for the action button. */
  onAction?: () => void;
  /** Custom action slot. Overrides action/onAction. */
  actions?: React.ReactNode;
  /** When provided, renders an × dismiss button. */
  onDismiss?: () => void;
  /** Surface color when tone === "custom". */
  bg?: string;
  /** Text color when tone === "custom". */
  fg?: string;
  /** Inline-start accent border color when tone === "custom". */
  accent?: string;
  /** Visual density — affects icon size and padding. */
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}) => {
  const isCustom = tone === 'custom';
  const IconName = icon || BANNER_DEFAULT_ICON[tone] || 'info';
  const IconComp = Icons[IconName] || Icons.info;
  const style = isCustom ? {
    background: bg,
    color: fg,
    ...(accent ? { borderInlineStart: `3px solid ${accent}` } : {}),
  } : undefined;
  const accentStyle = accent ? { '--banner-accent': accent } : undefined;
  const cls = ['banner', 'tone-' + tone, 'size-' + size].join(' ');
  return (
    <div className={cls} role={tone === 'danger' ? 'alert' : 'status'} aria-live={tone === 'danger' ? 'assertive' : 'polite'} style={{ ...style, ...accentStyle }}>
      <span className="banner-icon" aria-hidden="true">
        <IconComp size={size === 'lg' ? 18 : 14}/>
      </span>
      <div className="banner-text">
        {title && <span className="banner-title">{title}</span>}
        {message && <span className="banner-message">{message}</span>}
        {children}
      </div>
      <div className="banner-actions">
        {actions ? actions : (action && (
          <button type="button" className="btn ghost sm banner-cta" onClick={onAction}>{action}</button>
        ))}
        {onDismiss && (
          <button type="button" className="banner-close" onClick={onDismiss} aria-label="Dismiss">
            <Icons.x size={12}/>
          </button>
        )}
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════
// Pipeline — v1.6.0. Visual primitive for build → test → deploy stages.
// Two variants share one step model:
//
//   stepper    horizontal cards on a baseline rail — Linear / Vercel feel
//   chevron    nested right-pointing arrows (GitHub Actions style)
//
// (gantt / ring / vertical were removed in v1.6.0 — vertical's job is now
// done by `<Timeline />`, which is purpose-built for sequenced events.)
//
// Steps: { id, label, status, meta?, duration?, percent? }
//   status: "done" | "running" | "pending" | "error" | "skipped"
//
// currentIndex (optional) forces which step reads as in-flight; otherwise
// the first `running` step is treated as current.
// ═════════════════════════════════════════════════════════════════════════
const PIPE_STATUS = { ok: 'done', pass: 'done', running: 'running', pending: 'pending', fail: 'error', skip: 'skipped' };
const pipeIcon = (tone) => {
  if (tone === 'done')    return Icons.check;
  if (tone === 'error')   return Icons.x;
  if (tone === 'skipped') return Icons.minus;
  return null;
};

// Stepper — each step is a small card with a dot + label/meta. Cards are
// joined by a dotted line that sits at the dot's centerline.
type PipeStep = { id?: string; label?: string; status?: string; meta?: string; duration?: string; percent?: number };
const PipelineStepper = ({ steps, currentIndex, compact }: { steps: PipeStep[]; currentIndex?: number; compact?: boolean }) => (
  <ol className={'pipeline pipeline-stepper' + (compact ? ' compact' : '')}>
    {steps.map((s, i) => {
      const tone = PIPE_STATUS[s.status] || s.status || 'pending';
      const isCurrent = currentIndex !== undefined ? i === currentIndex : tone === 'running';
      const Icn = pipeIcon(tone);
      const a11yName = [s.label, tone].filter(Boolean).join(', ');
      return (
        <li key={s.id || s.label || i} className={'pipe-step ' + tone + (isCurrent ? ' is-current' : '')}
            aria-current={isCurrent ? 'step' : undefined}>
          <span className="pipe-dot" aria-hidden="true">
            {isCurrent && <span className="pipe-halo"/>}
            {Icn ? <Icn size={11}/> : <span className="pipe-bullet"/>}
          </span>
          {/* Status glyph is colour-only/aria-hidden, so name the step for SR; */}
          {/* announce the in-flight step politely as the run advances.        */}
          <span className="sr-only" aria-live={isCurrent ? 'polite' : undefined}>{a11yName}</span>
          {!compact && (
            <div className="pipe-text">
              <span className="pipe-label">{s.label}</span>
              {s.meta && <span className="pipe-meta">{s.meta}</span>}
            </div>
          )}
        </li>
      );
    })}
  </ol>
);

// Chevron — each cell is a wedge with a right-pointing tail that locks
// into the next cell's notched left side. The shape is a pure CSS
// clip-path so we never have to drag SVG arrows around.
const PipelineChevron = ({ steps, currentIndex }: { steps: PipeStep[]; currentIndex?: number }) => (
  <ol className="pipeline pipeline-chevron">
    {steps.map((s, i) => {
      const tone = PIPE_STATUS[s.status] || s.status || 'pending';
      const isCurrent = currentIndex !== undefined ? i === currentIndex : tone === 'running';
      const Icn = pipeIcon(tone);
      const positionCls = i === 0 ? ' chev-first' : i === steps.length - 1 ? ' chev-last' : '';
      const a11yName = [s.label, tone].filter(Boolean).join(', ');
      return (
        <li key={s.id || i} className={'chev-step ' + tone + (isCurrent ? ' is-current' : '') + positionCls}
            aria-current={isCurrent ? 'step' : undefined}>
          <span className="chev-inner">
            <span className="chev-glyph" aria-hidden="true">
              {Icn ? <Icn size={11}/> : <StatusDot tone={tone} pulse={tone === 'running'} size="sm"/>}
            </span>
            {/* Glyph conveys status by colour only — name the step for SR and  */}
            {/* announce the in-flight step politely as the run advances.       */}
            <span className="sr-only" aria-live={isCurrent ? 'polite' : undefined}>{a11yName}</span>
            <span className="chev-text">
              <span className="chev-label">{s.label}</span>
              {s.meta && <span className="chev-meta">{s.meta}</span>}
            </span>
          </span>
        </li>
      );
    })}
  </ol>
);

const Pipeline = ({
  variant = 'stepper', steps, currentIndex, compact,
}: {
  /** Visual layout. Step model is shared between variants. */
  variant?: 'stepper' | 'chevron';
  /** Ordered steps — each: { id, label, status, meta?, duration?, percent? }. */
  steps?: PipeStep[];
  /** Force which step reads as in-flight. Default: first running step. */
  currentIndex?: number;
  /** Stepper-only — collapse labels for table-cell density. */
  compact?: boolean;
}) => {
  if (variant === 'chevron') return <PipelineChevron steps={steps || []} currentIndex={currentIndex}/>;
  return <PipelineStepper steps={steps || []} currentIndex={currentIndex} compact={compact}/>;
};

// ═════════════════════════════════════════════════════════════════════════
// Timeline — vertical sequence of events. v1.6.0 dropped the horizontal
// variant; for left-to-right "stages" use <Pipeline variant="stepper"/>
// or <Pipeline variant="chevron"/> instead.
// Each item: { id, title, meta, at, person, icon, tone, current, done, children }
//
// The CURRENT step is the load-bearing visual moment: (a) ember tinted pin
// background, (b) ember halo ring around the pin, (c) ember title color,
// (d) ember-tinted card body so the eye lands before reading. Done steps
// go quiet green; pending stay neutral.
// ═════════════════════════════════════════════════════════════════════════
type TimelineItem = {
  id?: string;
  title?: React.ReactNode;
  meta?: React.ReactNode;
  at?: string | number | Date;
  person?: { name: string; initials: string; role?: string };
  icon?: string;
  tone?: string;
  current?: boolean;
  done?: boolean;
  children?: React.ReactNode;
};
const Timeline = ({ items = [], compact = false }: {
  /** Ordered event items — each: { id, title, meta?, at?, person?, icon?, tone?, children?, current?, done? }. */
  items?: TimelineItem[];
  /** Tighten density for sidesheets, drawers. */
  compact?: boolean;
}) => {
  return (
    <ol className={'timeline tl-v' + (compact ? ' compact' : '')}>
      {items.map((it, i) => {
        const Icon = it.icon && Icons[it.icon];
        const isCurrent = !!it.current;
        const isDone = !!it.done;
        const cls = ['tl-item'];
        if (isCurrent) cls.push('is-current');
        if (isDone) cls.push('is-done');
        return (
          <li key={it.id || i} className={cls.join(' ')} aria-current={isCurrent ? 'true' : undefined}>
            <span className={'tl-pin ' + (it.tone || 'default')} aria-hidden="true">
              {isCurrent && <span className="tl-halo" aria-hidden="true"/>}
              {it.person ? <Avatar p={it.person} size={22}/> :
               Icon ? <Icon size={11}/> :
               <span className="tl-dot"/>}
            </span>
            <div className="tl-body">
              <div className="tl-row">
                <span className="tl-title">{it.title}</span>
                {it.at && <RelativeTime value={it.at}/>}
              </div>
              {it.meta && <div className="tl-meta">{it.meta}</div>}
              {it.children && <div className="tl-child">{it.children}</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
};

// ═════════════════════════════════════════════════════════════════════════
// RingBar — visualises a ring-deployment rollout as a horizontal cohort
// strip. The concentric variant was removed in v1.5.0 (the SVG read as a
// bullseye, not a journey; the goal here is "left → right = expanding
// exposure").
//
// Each ring: { label, audience, percent, status, count? }
// ═════════════════════════════════════════════════════════════════════════
type RingItem = { label?: string; audience?: string; percent?: number; status?: string; count?: number };
const RingBar = ({ rings = [], currentRing = 0, popoverFor }: {
  /** Ordered ring definitions — each: { label, audience?, percent, status? }. Status: "done" | "running" | "pending" | "error". */
  rings?: RingItem[];
  /** Index of the cell that is in flight — highlighted with ember tint and pulse. */
  currentRing?: number;
  /** Render prop returning the popover body for a cell. Cells become clickable buttons. */
  popoverFor?: (ring: RingItem, index: number) => React.ReactNode;
}) => {
  const [openIdx, setOpenIdx] = React.useState<number | null>(null);
  const cellRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const popRef = React.useRef<HTMLDivElement | null>(null);
  const close = (returnFocus = true) => {
    const idx = openIdx;
    setOpenIdx(null);
    if (returnFocus && idx != null) cellRefs.current[idx]?.focus();
  };
  // Move focus into the popover when it opens.
  React.useEffect(() => {
    if (openIdx != null) popRef.current?.focus();
  }, [openIdx]);
  return (
    <div className="ring-bar">
      {rings.map((r, i) => {
        const tone = i < currentRing ? 'done' : i === currentRing ? (r.status || 'running') : 'pending';
        const pct = r.percent != null ? r.percent : tone === 'done' ? 100 : 0;
        const isCurrent = i === currentRing;
        const cellName = [r.label, r.audience, pct + '%', tone].filter(Boolean).join(', ');
        const popId = `ring-pop-${i}`;
        return (
          <div key={r.label || i}
               ref={(el) => { cellRefs.current[i] = el; }}
               className={'ring-cell ' + tone + (isCurrent ? ' is-current' : '') + (openIdx === i ? ' has-pop' : '') + (popoverFor ? ' is-interactive' : '')}
               onClick={() => popoverFor && setOpenIdx(openIdx === i ? null : i)}
               role={popoverFor ? 'button' : undefined}
               tabIndex={popoverFor ? 0 : undefined}
               aria-label={cellName}
               aria-current={isCurrent ? 'step' : undefined}
               aria-haspopup={popoverFor ? 'dialog' : undefined}
               aria-expanded={popoverFor ? openIdx === i : undefined}
               onKeyDown={popoverFor ? (e) => {
                 if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenIdx(openIdx === i ? null : i); }
                 else if (e.key === 'Escape' && openIdx === i) { e.preventDefault(); close(); }
               } : undefined}>
            <div className="ring-head">
              <span className="ring-label">
                <StatusDot tone={tone} pulse={tone === 'running'}/>
                <span className="ring-label-text">{r.label}</span>
              </span>
              <span className="ring-pct">{pct}%</span>
            </div>
            {r.audience && <div className="ring-aud">{r.audience}</div>}
            <div className="ring-track">
              <span className="ring-fill" style={{ width: pct + '%' }}/>
            </div>
            {popoverFor && openIdx === i && (
              <div className="ring-pop" role="dialog" aria-label={cellName} tabIndex={-1}
                   ref={popRef}
                   onClick={(e) => e.stopPropagation()}
                   onKeyDown={(e) => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); } }}>
                {popoverFor(r, i)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════
// ScoreGauge — automotive gauge for Change Risk Score, Reliability Index, etc.
// Variants:
//   "speedo"   default — 0-1000 sweep, green→amber→red gradient, ticks
//   "compact"  small 96px circle (for cards), grade letter inside
//   "linear"   horizontal bar (for table cells)
//   "ringed"   classic 0-100 ring (legacy)
//
// Props:
//   value     number — current value
//   max       number — upper bound (default 1000)
//   min       number — lower bound (default 0)
//   ticks     boolean — show ticks (default true for speedo)
//   labels    boolean — show segment labels (default false)
//   inverted  boolean — flip green/red mapping (high = good)
//   label     string — caption below
//   size      number — px (default 240 for speedo, 96 for compact)
//   thickness number — stroke (default 16 for speedo, 8 for compact)
// ═════════════════════════════════════════════════════════════════════════
const lerp = (a, b, t) => a + (b - a) * t;
// CRS bands · aligned with the "under 300 is healthy" copy on the
// Quality-gates fleet gauge. Lower risk → green, higher risk → red.
//   < 30%  healthy   (success / green)
//   < 55%  caution   (ember)
//   < 80%  high      (warning)
//   ≥ 80% critical   (danger / red)
const ringTone = (n, inverted) => {
  const x = inverted ? 1 - n : n;
  if (x < 0.30) return 'var(--success)';
  if (x < 0.55) return 'var(--ember)';
  if (x < 0.80) return 'var(--warning)';
  return 'var(--danger)';
};
const ScoreGaugeSpeedo = ({ value, min, max, ticks, labels, inverted, label, size, thickness }: {
  value: number;
  min: number;
  max: number;
  ticks?: boolean;
  labels?: boolean;
  inverted?: boolean;
  label?: string;
  size?: number;
  thickness?: number;
}) => {
  const w = size || 240;
  const h = w * 0.7;
  const r = (w - thickness) / 2 - 8;
  const cx = w / 2, cy = h - 12;
  const sweep = Math.PI; // 180° arc
  const startA = Math.PI; // left side
  const norm = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const angle = startA + norm * sweep;
  const px = (a) => cx + r * Math.cos(a);
  const py = (a) => cy + r * Math.sin(a);
  const arcPath = (a0, a1) => {
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M${px(a0)},${py(a0)} A${r},${r} 0 ${large} 1 ${px(a1)},${py(a1)}`;
  };
  const segs = [
    { from: 0.00, to: 0.30, color: inverted ? 'var(--danger)'  : 'var(--success)' },
    { from: 0.30, to: 0.55, color: inverted ? 'var(--warning)' : 'var(--ember)'  },
    { from: 0.55, to: 0.80, color: inverted ? 'var(--ember)'   : 'var(--warning)' },
    { from: 0.80, to: 1.00, color: inverted ? 'var(--success)' : 'var(--danger)' },
  ];
  const tickCount = 10;
  return (
    <div className="score-speedo" style={{ width: w }}
         role="meter" aria-label={label}
         aria-valuenow={Math.round(value)} aria-valuemin={min} aria-valuemax={max}
         aria-valuetext={`${Math.round(value)} of ${max}`}>
      <svg width={w} height={h + 8} viewBox={`0 0 ${w} ${h + 8}`} aria-hidden="true">
        {segs.map((s, i) => (
          <path key={i} d={arcPath(startA + s.from * sweep, startA + s.to * sweep)}
                fill="none" stroke={s.color} strokeWidth={thickness} strokeLinecap="butt" opacity="0.32"/>
        ))}
        <path className="ss-arc" d={arcPath(startA, angle)} fill="none" stroke={ringTone(norm, inverted)} strokeWidth={thickness} strokeLinecap="round"/>
        {ticks !== false && Array.from({ length: tickCount + 1 }).map((_, i) => {
          const t = i / tickCount;
          const a = startA + t * sweep;
          const r1 = r - thickness / 2 - 2;
          const r2 = r - thickness / 2 - (i % 5 === 0 ? 10 : 6);
          return (
            <line key={i}
                  x1={cx + r1 * Math.cos(a)} y1={cy + r1 * Math.sin(a)}
                  x2={cx + r2 * Math.cos(a)} y2={cy + r2 * Math.sin(a)}
                  stroke="var(--fg-faint)" strokeWidth={i % 5 === 0 ? 1.2 : 0.8}/>
          );
        })}
        {labels && (
          <>
            <text x={cx + (r - thickness - 18) * Math.cos(startA)} y={cy + (r - thickness - 18) * Math.sin(startA) + 4}
                  textAnchor="middle" fill="var(--fg-faint)" fontSize="10" fontFamily="var(--font-mono)">LOW</text>
            <text x={cx} y={14}
                  textAnchor="middle" fill="var(--fg-faint)" fontSize="10" fontFamily="var(--font-mono)">MED</text>
            <text x={cx + (r - thickness - 18) * Math.cos(startA + sweep)} y={cy + (r - thickness - 18) * Math.sin(startA + sweep) + 4}
                  textAnchor="middle" fill="var(--fg-faint)" fontSize="10" fontFamily="var(--font-mono)">CRIT</text>
          </>
        )}
        {/* Needle */}
        <g className="ss-needle">
          <line x1={cx} y1={cy} x2={px(angle)} y2={py(angle)}
                stroke="var(--fg)" strokeWidth="2" strokeLinecap="round"/>
          <circle cx={cx} cy={cy} r="6" fill="var(--surface-strong)" stroke="var(--fg-muted)" strokeWidth="1.2"/>
        </g>
      </svg>
      <div className="ss-readout">
        <span className="ss-value" style={{ color: ringTone(norm, inverted) }}>
          {Math.round(value)}<span className="ss-max">/{max}</span>
        </span>
        {label && <span className="ss-label">{label}</span>}
      </div>
    </div>
  );
};
const ScoreGaugeCompact = ({ value, min, max, label, size = 96, thickness = 8, inverted }: {
  value: number;
  min: number;
  max: number;
  label?: string;
  size?: number;
  thickness?: number;
  inverted?: boolean;
}) => {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const norm = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return (
    <div className="score-compact" style={{ width: size, height: size }}
         role="meter" aria-label={label}
         aria-valuenow={Math.round(value)} aria-valuemin={min} aria-valuemax={max}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={thickness}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={ringTone(norm, inverted)} strokeWidth={thickness}
                strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - norm)}
                transform={`rotate(-90 ${size/2} ${size/2})`}/>
      </svg>
      <div className="sc-text">
        <span className="sc-value">{Math.round(value)}</span>
        {label && <span className="sc-label">{label}</span>}
      </div>
    </div>
  );
};
const ScoreGaugeLinear = ({ value, min, max, label, inverted }: {
  value: number;
  min: number;
  max: number;
  label?: string;
  inverted?: boolean;
}) => {
  const norm = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return (
    <div className="score-linear"
         role="meter" aria-label={label}
         aria-valuenow={Math.round(value)} aria-valuemin={min} aria-valuemax={max}>
      <div className="sl-row">
        {label && <span className="sl-label">{label}</span>}
        <span className="sl-value" style={{ color: ringTone(norm, inverted) }}>{Math.round(value)}<span className="sl-max">/{max}</span></span>
      </div>
      <div className="sl-track">
        <span className="sl-segs"/>
        <span className="sl-fill" style={{ width: (norm * 100) + '%', background: ringTone(norm, inverted) }}/>
        <span className="sl-marker" style={{ left: 'calc(' + (norm * 100) + '% - 2px)' }}/>
      </div>
    </div>
  );
};
const ScoreGauge = ({
  variant = 'speedo', value, min, max, label, inverted, ticks, labels, size, thickness,
}: {
  /** Density. Speedo is the hero, compact rides inside cards, linear inside rows. */
  variant?: 'speedo' | 'compact' | 'linear' | 'ringed';
  /** Current value. Clamped to [min, max] internally. */
  value?: number;
  /** Lower bound of the scale. */
  min?: number;
  /** Upper bound. Use 100 for percentage-like scores; 1000 for Change Risk. */
  max?: number;
  /** Caption printed under the gauge. */
  label?: string;
  /** Flip the palette so green sits on the high side. Use for Health / Reliability. */
  inverted?: boolean;
  /** Show tick marks (speedo only). */
  ticks?: boolean;
  /** Show "LOW / MED / CRIT" segment labels (speedo only). */
  labels?: boolean;
  /** Pixel width (default 240 speedo / 96 compact). */
  size?: number;
  /** Stroke width (default 16 speedo / 8 compact). */
  thickness?: number;
}) => {
  const resolvedMin = min != null ? min : 0;
  const resolvedMax = max != null ? max : 1000;
  const common = { value: value || 0, min: resolvedMin, max: resolvedMax, label, inverted };
  if (variant === 'compact') return <ScoreGaugeCompact {...common} size={size} thickness={thickness}/>;
  if (variant === 'linear')  return <ScoreGaugeLinear  {...common}/>;
  return <ScoreGaugeSpeedo {...common}
                           ticks={ticks}
                           labels={labels}
                           size={size}
                           thickness={thickness || 16}/>;
};

// ═════════════════════════════════════════════════════════════════════════
// MetricCard — KPI tile. Composition of Card + Trend + Sparkline.
// ═════════════════════════════════════════════════════════════════════════
const fmtValue = (v) => {
  if (typeof v !== 'number' || !isFinite(v)) return v;
  if (Number.isInteger(v)) return v.toLocaleString();
  return v.toLocaleString(undefined, { maximumFractionDigits: 2 });
};
const MetricCard = ({
  label, value, suffix, unit, prefix,
  delta, deltaUnit = '%', inverted = false,
  series, sparkColor,
  foot, tone, size = 'md',
}: {
  /** Metric name, shown as the uppercase mono eyebrow. */
  label?: React.ReactNode;
  /** The headline number (auto-formatted with locale grouping). */
  value?: number | string;
  /** Appended directly after the value (e.g. "%"). */
  suffix?: React.ReactNode;
  /** Unit shown beside the value in muted type (e.g. "ms"). */
  unit?: React.ReactNode;
  /** Rendered before the value (e.g. "$"). */
  prefix?: React.ReactNode;
  /** Period-over-period change; renders a colored Trend chip. */
  delta?: number;
  /** Unit for the delta chip. */
  deltaUnit?: string;
  /** For "lower is better" metrics (lead time, MTTR) — flips the trend color so it follows the verdict, not the sign. */
  inverted?: boolean;
  /** Sparkline data points under the value. */
  series?: number[];
  /** Sparkline stroke color (defaults to the ember accent). */
  sparkColor?: string;
  /** Footer line — comparison window or SLO context. */
  foot?: React.ReactNode;
  /** Surface tone modifier. */
  tone?: string;
  /** Card density. */
  size?: 'sm' | 'md' | 'lg';
}) => {
  const cls = ['metric-card', 'size-' + size];
  if (tone) cls.push('tone-' + tone);
  return (
    <div className={cls.join(' ')}>
      <div className="mc-head">
        <span className="mc-label">{label}</span>
        {typeof delta === 'number' && <Trend delta={delta} unit={deltaUnit} inverted={inverted}/>}
      </div>
      <div className="mc-value-row">
        <span className="mc-value">
          {prefix ? <span className="mc-affix">{prefix}</span> : null}
          <span>{fmtValue(value)}</span>
          {suffix ? <span className="mc-affix">{suffix}</span> : null}
        </span>
        {unit ? <span className="mc-unit">{unit}</span> : null}
      </div>
      {series && series.length > 0 && (
        <div className="mc-spark">
          <Sparkline data={series} w={size === 'lg' ? 240 : 180} h={size === 'lg' ? 40 : 32} color={sparkColor}/>
        </div>
      )}
      {foot ? <div className="mc-foot">{foot}</div> : null}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════
// Stat — small inline KPI. label + value + hint + optional delta.
// Variants:  "default"  "hero"  "inline"
// ═════════════════════════════════════════════════════════════════════════
const Stat = ({ label, value, suffix, hint, delta, deltaUnit = '%', inverted,
                align = 'start', variant = 'default' }: {
  label?: React.ReactNode;
  value?: React.ReactNode;
  suffix?: React.ReactNode;
  hint?: React.ReactNode;
  delta?: number;
  deltaUnit?: string;
  inverted?: boolean;
  align?: 'start' | 'center' | 'end';
  variant?: 'default' | 'hero' | 'inline';
}) => (
  <div className={'stat stat-' + variant + ' align-' + align}>
    <span className="stat-label">{label}</span>
    <span className="stat-value">
      {value}
      {suffix ? <span className="stat-suffix">{suffix}</span> : null}
    </span>
    {(hint || typeof delta === 'number') && (
      <span className="stat-foot">
        {typeof delta === 'number' && <Trend delta={delta} unit={deltaUnit} inverted={inverted} variant="triangle"/>}
        {hint && <span className="stat-hint">{hint}</span>}
      </span>
    )}
  </div>
);

// ═════════════════════════════════════════════════════════════════════════
// ServiceCard — catalog tile for a microservice. v1.8.2 — major recipe
// rework after team feedback:
//
//   • Header right: HealthBadge (was TierBadge / T1). Status is the
//     thing the on-call eye actually scans for first; tier is a static
//     classification that lives in the service-detail page.
//   • Title block: "v2.7.0 · 14m ago" — version + deploy timestamp on
//     one mono micro-label line. Deploy moved out of the footer.
//   • Tags row removed — its content (lang dot + health) is redistributed
//     into the header (health) and footer (lang).
//   • Footer left: AvatarGroup with contributors. Up to 3 avatars + a
//     "+N" counter for the overflow. Replaces the single OwnerPill so the
//     card reads as a TEAM artifact, not a one-owner page.
//   • Footer right: LangBadge (lang dot + name). The lang lives at the
//     bottom edge now so a grid of cards reads its silhouette by colour
//     at a glance.
//
// Variants stay the same — compact / default / detailed.
// ═════════════════════════════════════════════════════════════════════════
type ServiceData = {
  name?: string;
  version?: string;
  deploys?: string;
  alert?: boolean;
  lang?: string;
  p95?: number | string;
};
type Contributor = { name: string; initials?: string; ember?: boolean };
const ServiceCard = ({
  service, contributors, sparkSeries, onOpen,
  variant = 'default',
}: {
  /** Service record — name, tier, lang, version, p95, deploys, alert. */
  service?: ServiceData;
  /** Team avatars in the footer. Shows up to 3 + a "+N" overflow counter. */
  contributors?: Contributor[];
  /** Sparkline data. Only rendered in the detailed variant. */
  sparkSeries?: number[];
  /** Click handler. Wires the tile as a button (with keyboard handling). */
  onOpen?: () => void;
  /** Visual layout — compact for slim rows, default for grids, detailed for the service-detail surface. */
  variant?: 'compact' | 'default' | 'detailed';
}) => {
  if (!service) return null;
  const health = service.alert ? 'degraded' : 'up';
  const showSpark = variant === 'detailed' && sparkSeries && sparkSeries.length > 0;
  const team = contributors || [];
  const teamShown = team.slice(0, 3);
  const teamExtra = Math.max(0, team.length - teamShown.length);
  const showFoot = (variant !== 'compact') && (team.length > 0 || service.lang != null);

  return (
    <div
      className={'service-card variant-' + variant}
      role={onOpen ? 'button' : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onClick={onOpen}
      onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && onOpen) onOpen(); }}
    >
      <header className="sc-head">
        <span className="sc-avatar" aria-hidden="true">
          <Icons.server size={20}/>
        </span>
        <div className="sc-id">
          <span className="sc-name">{service.name}</span>
          {(service.version || service.deploys) && (
            <span className="sc-version">
              {service.version && <>v{service.version}</>}
              {service.version && service.deploys && <span className="sc-version-sep"> · </span>}
              {service.deploys && <>{service.deploys}</>}
            </span>
          )}
        </div>
        <HealthBadge state={health} pulse={health === 'degraded'}/>
      </header>

      {showSpark && (
        <div className="sc-spark">
          <div className="sc-spark-head">
            <span className="sc-spark-lab">Latency · last 24h</span>
            {service.p95 != null && (
              <span className="sc-spark-val">
                <span className="lbl">p95</span>
                <span className="v">{service.p95}<span className="unit">ms</span></span>
              </span>
            )}
          </div>
          <Sparkline data={sparkSeries} w={260} h={32}/>
        </div>
      )}

      {showFoot && (
        <footer className="sc-foot">
          <div className="sc-foot-team">
            {teamShown.length > 0 && (
              <div className="avatar-group">
                {teamShown.map((p) => (
                  <span
                    key={p.name}
                    className={'avatar' + (p.ember ? ' ember' : '')}
                    title={p.name}
                  >{p.initials}</span>
                ))}
                {teamExtra > 0 && (
                  <span className="avatar" title={`${teamExtra} more`}>
                    +{teamExtra}
                  </span>
                )}
              </div>
            )}
          </div>
          {service.lang && (
            <span className="sc-foot-lang">
              <LangBadge lang={service.lang}/>
            </span>
          )}
        </footer>
      )}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════
// AgentCard — catalog tile for an AI agent. Rebuilt v1.8.0.
//   head: avatar (ember-soft + bot glyph) · name + model · health pill
//   body: 2-line summary clamp
//   caps: capability chips (model is NOT mixed in — it lives in head)
//   foot: divider + inline stats "1,247 runs · 96%" + relative time
// ═════════════════════════════════════════════════════════════════════════
type AgentData = {
  name?: string;
  model?: string;
  status?: 'up' | 'degraded' | 'down' | 'unknown' | string;
  summary?: string;
  capabilities?: string[];
  calls?: number;
  successRate?: number;
  lastRun?: string | number | Date;
};
const AgentCard = ({ agent, onOpen }: {
  /** Agent record — name, model, status, summary, capabilities, calls, successRate, lastRun. */
  agent?: AgentData;
  /** Click handler. Wires the tile as a button (Enter / Space). */
  onOpen?: () => void;
}) => {
  if (!agent) return null;
  const stats = [];
  if (agent.calls != null) stats.push(<span key="c"><span className="v">{agent.calls.toLocaleString()}</span> runs</span>);
  if (agent.successRate != null) stats.push(<span key="s"><span className="v">{agent.successRate}%</span> success</span>);
  return (
    <div className="agent-card" role={onOpen ? 'button' : undefined} tabIndex={onOpen ? 0 : undefined}
         onClick={onOpen} onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && onOpen) onOpen(); }}>
      <div className="ac-head">
        <span className="ac-avatar"><Icons.agent size={20}/></span>
        <div className="ac-id">
          <span className="ac-name">{agent.name}</span>
          {agent.model && <span className="ac-model">{agent.model}</span>}
        </div>
        {agent.status && <HealthBadge state={agent.status as 'up' | 'degraded' | 'down' | 'unknown'}/>}
      </div>
      {agent.summary && <div className="ac-summary">{agent.summary}</div>}
      {agent.capabilities && agent.capabilities.length > 0 && (
        <div className="ac-caps">
          {agent.capabilities.slice(0, 5).map((c) => <span key={c} className="chip">{c}</span>)}
        </div>
      )}
      {(stats.length > 0 || agent.lastRun) && (
        <div className="ac-foot">
          <span className="ac-stats">
            {stats.map((s, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="sep">·</span>}
                {s}
              </React.Fragment>
            ))}
          </span>
          {agent.lastRun && <span className="ac-time"><RelativeTime value={agent.lastRun}/></span>}
        </div>
      )}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════
// LogViewer — terminal-style log. New variants:
//   compact (default)   light row
//   expanded            timestamp column + severity column
//   filterable          toolbar with severity chips + search
//
// Props:
//   lines      [{ id, time, level, message, ts? }]
//   variant    "compact" | "expanded" | "filterable"
//   height     number   — px container height
//   follow     boolean  — auto-scroll on new lines
//   wrap       boolean  — wrap long messages
//   search     boolean  — show inline search (filterable)
//   onSearch   (q) => void
// ═════════════════════════════════════════════════════════════════════════
const LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];
type LogLine = { id?: string | number; time?: string; level?: string; message?: string; ts?: string | number };
const LogViewer = ({
  lines = [], height = 320, follow = false, wrap = false,
  variant = 'compact', toolbar = true,
}: {
  /** Array of log line objects. Each: { id?, time?, level, message }. */
  lines?: LogLine[];
  /** Fixed height of the scroll body in pixels. */
  height?: number;
  /** Auto-scroll to the bottom when new lines are appended (streaming logs). */
  follow?: boolean;
  /** Wrap long messages instead of truncating with ellipsis. */
  wrap?: boolean;
  /** compact = no timestamp column; expanded = timestamp + severity columns; filterable = full toolbar with search and level chips. */
  variant?: 'compact' | 'expanded' | 'filterable';
  /** Show the toolbar (only applies to the filterable variant; pass false to hide on expanded). */
  toolbar?: boolean;
}) => {
  const [query, setQuery] = React.useState('');
  const [active, setActive] = React.useState(new Set(['info', 'warn', 'error', 'fatal', 'debug', 'trace']));
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (follow && ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [lines, follow]);
  const filtered = lines.filter(l => {
    const lv = (l.level || 'info').toLowerCase();
    if (!active.has(lv)) return false;
    if (!query) return true;
    return (l.message || '').toLowerCase().includes(query.toLowerCase());
  });
  const showToolbar = (variant === 'filterable') || toolbar === true;
  const expanded = variant === 'expanded' || variant === 'filterable';
  return (
    <div className={'log-viewer variant-' + variant + (wrap ? ' wrap' : '')}>
      {showToolbar && variant === 'filterable' && (
        <div className="lv-toolbar">
          <div className="lv-search">
            <Icons.search size={11}/>
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
                   placeholder="Filter messages…" aria-label="Filter logs"/>
          </div>
          <div className="lv-levels">
            {LEVELS.map(lv => (
              <button key={lv} type="button"
                      aria-pressed={active.has(lv)}
                      aria-label={'Toggle ' + lv + ' lines'}
                      className={'chip ' + (active.has(lv) ? 'lvl-' + lv + ' is-active' : '')}
                      onClick={() => {
                        const next = new Set(active);
                        if (next.has(lv)) next.delete(lv); else next.add(lv);
                        setActive(next);
                      }}>{lv.toUpperCase()}</button>
            ))}
          </div>
          <div className="lv-spacer"/>
          <span className="lv-count t-mono">{filtered.length}/{lines.length}</span>
        </div>
      )}
      <div
        className="lv-body"
        style={{ height }}
        ref={ref}
        tabIndex={0}
        role="log"
        aria-label="Log output"
        aria-live={follow ? 'polite' : 'off'}
        onKeyDown={(e) => {
          const el = ref.current;
          if (!el) return;
          const step = 24;
          if (e.key === 'ArrowDown') { el.scrollTop += step; e.preventDefault(); }
          else if (e.key === 'ArrowUp') { el.scrollTop -= step; e.preventDefault(); }
          else if (e.key === 'PageDown') { el.scrollTop += el.clientHeight; e.preventDefault(); }
          else if (e.key === 'PageUp') { el.scrollTop -= el.clientHeight; e.preventDefault(); }
          else if (e.key === 'Home') { el.scrollTop = 0; e.preventDefault(); }
          else if (e.key === 'End') { el.scrollTop = el.scrollHeight; e.preventDefault(); }
        }}
      >
        {filtered.length === 0 && <div className="lv-empty">No log output.</div>}
        {filtered.map((l, i) => {
          const level = (l.level || 'info').toLowerCase();
          return (
            <div key={l.id || i} className={'lv-line lvl-' + level}>
              {expanded && l.time && <span className="lv-time">{l.time}</span>}
              <span className={'lv-level lvl-' + level}>{level.toUpperCase()}</span>
              <span className="lv-msg">{l.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════
// DiffViewer — Linear/Stripe-like unified or split diff.
//
//   files: [{ path, additions, deletions, hunks: [{ header, lines: [{
//     type: "add" | "del" | "ctx", old, new, code }] }] }]
//   variant: "unified" | "split"
//   wrap: boolean
// ═════════════════════════════════════════════════════════════════════════
type DiffLine = { type?: 'add' | 'del' | 'ctx'; old?: number | null; new?: number | null; code?: string };
type DiffHunk = { header?: string; lines: DiffLine[] };
type DiffFile = { path?: string; additions?: number; deletions?: number; hunks: DiffHunk[] };
const DiffUnified = ({ hunks, wrap }: { hunks: DiffHunk[]; wrap?: boolean }) => (
  <pre className={'diff-body diff-unified' + (wrap ? ' wrap' : '')} aria-label="Diff">
    {hunks.map((h, hi) => (
      <React.Fragment key={hi}>
        {h.header && (
          <div className="diff-hunk">
            <span className="diff-marker"/>
            <span className="diff-no"/>
            <span className="diff-no"/>
            <span className="diff-code">{h.header}</span>
          </div>
        )}
        {h.lines.map((l, li) => (
          <div key={li} className={'diff-line ' + (l.type || 'ctx')}>
            <span className="diff-marker">{l.type === 'add' ? '+' : l.type === 'del' ? '−' : ' '}</span>
            <span className="diff-no">{l.old != null ? l.old : ''}</span>
            <span className="diff-no">{l.new != null ? l.new : ''}</span>
            <span className="diff-code">{l.code}</span>
          </div>
        ))}
      </React.Fragment>
    ))}
  </pre>
);
const DiffSplit = ({ hunks, wrap }: { hunks: DiffHunk[]; wrap?: boolean }) => {
  // Convert unified hunks into pairs of (left, right) lines
  const pairs = [];
  hunks.forEach((h, hi) => {
    if (h.header) pairs.push({ header: h.header });
    let i = 0;
    while (i < h.lines.length) {
      const l = h.lines[i];
      if (l.type === 'del') {
        // Look ahead for matching add
        let j = i + 1;
        const dels = [l];
        while (j < h.lines.length && h.lines[j].type === 'del') { dels.push(h.lines[j]); j++; }
        const adds = [];
        while (j < h.lines.length && h.lines[j].type === 'add') { adds.push(h.lines[j]); j++; }
        const max = Math.max(dels.length, adds.length);
        for (let k = 0; k < max; k++) {
          pairs.push({ left: dels[k] || null, right: adds[k] || null });
        }
        i = j;
      } else if (l.type === 'add') {
        pairs.push({ left: null, right: l });
        i++;
      } else {
        pairs.push({ left: l, right: l });
        i++;
      }
    }
  });
  return (
    <div className={'diff-body diff-split' + (wrap ? ' wrap' : '')} aria-label="Diff (split view)">
      {pairs.map((p, i) => {
        if (p.header) return (
          <div key={i} className="diff-row diff-hunk-row">
            <div className="diff-side"><span className="diff-code">{p.header}</span></div>
            <div className="diff-side"><span className="diff-code">{p.header}</span></div>
          </div>
        );
        const left = p.left, right = p.right;
        return (
          <div key={i} className="diff-row">
            <div className={'diff-side ' + (left ? (left.type === 'del' ? 'del' : 'ctx') : 'empty')}>
              <span className="diff-no">{left && left.old != null ? left.old : ''}</span>
              <span className="diff-marker">{left ? (left.type === 'del' ? '−' : ' ') : ''}</span>
              <span className="diff-code">{left ? left.code : ''}</span>
            </div>
            <div className={'diff-side ' + (right ? (right.type === 'add' ? 'add' : 'ctx') : 'empty')}>
              <span className="diff-no">{right && right.new != null ? right.new : ''}</span>
              <span className="diff-marker">{right ? (right.type === 'add' ? '+' : ' ') : ''}</span>
              <span className="diff-code">{right ? right.code : ''}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
const DiffViewer = ({ files, hunks, variant = 'unified', wrap = false }: {
  /** Array of diff file objects — each with path, additions, deletions, and hunks. */
  files?: DiffFile[];
  /** Single-file shorthand: pass hunks directly (renders as a single unnamed file). */
  hunks?: DiffHunk[];
  /** Single-column unified view or side-by-side split view. */
  variant?: 'unified' | 'split';
  /** Wrap long lines instead of enabling horizontal scroll. */
  wrap?: boolean;
}) => {
  // Single-file shorthand: pass hunks directly
  const list = files || (hunks ? [{ path: 'change', hunks }] : []);
  return (
    <div className="diff-viewer">
      {list.map((f, fi) => {
        const adds = f.additions != null ? f.additions
          : f.hunks.reduce((m, h) => m + h.lines.filter(l => l.type === 'add').length, 0);
        const dels = f.deletions != null ? f.deletions
          : f.hunks.reduce((m, h) => m + h.lines.filter(l => l.type === 'del').length, 0);
        return (
          <div key={fi} className="diff-file">
            <div className="diff-file-head">
              <Icons.file size={12}/>
              <span className="diff-path">{f.path}</span>
              <span className="diff-counts">
                <span className="add">+{adds}</span>
                <span className="del">−{dels}</span>
              </span>
            </div>
            {variant === 'split'
              ? <DiffSplit hunks={f.hunks} wrap={wrap}/>
              : <DiffUnified hunks={f.hunks} wrap={wrap}/>}
          </div>
        );
      })}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════
// TreeView — trees.software-inspired: explicit indent guides, folder/file
// icons, chevron toggle, smooth expand, selection.
// ═════════════════════════════════════════════════════════════════════════
type TreeNodeData = { id: string; label?: React.ReactNode; icon?: string; meta?: React.ReactNode; badge?: React.ReactNode; children?: TreeNodeData[] };
const TreeNode = ({ node, level, expanded, toggle, selected, onSelect }: {
  node: TreeNodeData;
  level: number;
  expanded: Record<string, boolean>;
  toggle: (id: string) => void;
  selected?: string;
  onSelect?: (node: TreeNodeData) => void;
}) => {
  const has = node.children && node.children.length > 0;
  const isOpen = expanded[node.id];
  const IconComp = node.icon && Icons[node.icon];
  const isSel = selected === node.id;
  return (
    <li className={'tree-node lvl-' + level + (isSel ? ' is-selected' : '') + (isOpen ? ' is-open' : '')}>
      <div className="tree-row"
           onClick={() => { onSelect && onSelect(node); if (has) toggle(node.id); }}
           role={onSelect || has ? 'button' : undefined} tabIndex={onSelect || has ? 0 : undefined}>
        <div className="tree-rails" aria-hidden="true">
          {Array.from({ length: level }).map((_, i) => <span key={i} className="tree-rail"/>)}
        </div>
        <span className="tree-toggle" aria-label={has ? (isOpen ? 'Collapse' : 'Expand') : undefined}
              aria-expanded={has ? isOpen : undefined}
              onClick={(e) => { if (has) { e.stopPropagation(); toggle(node.id); } }}>
          {has && <span className={'chev' + (isOpen ? ' rot' : '')} aria-hidden="true"><Icons.chevronRight size={11}/></span>}
        </span>
        <span className="tree-icon">
          {IconComp
            ? <IconComp size={13}/>
            : (has ? <Icons.folder size={13}/> : <Icons.file size={13}/>)}
        </span>
        <span className="tree-label">{node.label}</span>
        {node.meta != null && <span className="tree-meta">{node.meta}</span>}
        {node.badge && <span className="tree-badge">{node.badge}</span>}
      </div>
      {has && isOpen && (
        <ul className="tree-children" role="group">
          {node.children.map(c => (
            <TreeNode key={c.id} node={c} level={level + 1}
                      expanded={expanded} toggle={toggle}
                      selected={selected} onSelect={onSelect}/>
          ))}
        </ul>
      )}
    </li>
  );
};
const TreeView = ({ nodes = [], defaultExpanded = [], selected, onSelect, variant = 'files' }: {
  /** Root-level tree nodes. Each node may contain nested children. */
  nodes?: TreeNodeData[];
  /** IDs of nodes that start expanded. */
  defaultExpanded?: string[];
  /** ID of the currently-selected node. Applies the ember selection tint and aria-selected. */
  selected?: string;
  /** Fires when the user clicks a node row. */
  onSelect?: (node: TreeNodeData) => void;
  /** Visual variant for the tree (e.g. "files" for a file-tree layout). */
  variant?: string;
}) => {
  const init = React.useMemo(() => {
    const o = {}; defaultExpanded.forEach(id => { o[id] = true; }); return o;
  }, [defaultExpanded.join('|')]);
  const [expanded, setExpanded] = React.useState(init);
  const toggle = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }));
  return (
    <ul className={'tree-view variant-' + variant} role="tree">
      {nodes.map(n => (
        <TreeNode key={n.id} node={n} level={0}
                  expanded={expanded} toggle={toggle}
                  selected={selected} onSelect={onSelect}/>
      ))}
    </ul>
  );
};

// ═════════════════════════════════════════════════════════════════════════
// JSONInspector — keys ember, strings green, numbers cyan, bool magenta.
// ═════════════════════════════════════════════════════════════════════════
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
// Build the toggle's accessible name from the branch key, state and item count
// so a screen reader announces e.g. "deploy.rings, collapsed, 3 items".
const branchLabel = (keyLabel, open, count, kind) => {
  const noun = kind === 'array' ? (count === 1 ? 'item' : 'items') : (count === 1 ? 'key' : 'keys');
  const head = keyLabel ? `${keyLabel}, ` : '';
  return `${head}${open ? 'expanded' : 'collapsed'}, ${count} ${noun}`;
};
const renderValue = (v, path, expanded, toggle, depth, keyLabel?) => {
  if (v === null) return <span className="json-null">null</span>;
  if (typeof v === 'string') return <span className="json-str">"{v}"</span>;
  if (typeof v === 'number') return <span className="json-num">{String(v)}</span>;
  if (typeof v === 'boolean') return <span className="json-bool">{String(v)}</span>;
  if (Array.isArray(v)) {
    const open = expanded[path] !== false;
    if (v.length === 0) return <span className="json-bracket">[]</span>;
    return (
      <>
        <button type="button" className="json-toggle" onClick={() => toggle(path)}
                aria-expanded={open} aria-label={branchLabel(keyLabel, open, v.length, 'array')}>
          <span className="json-bracket">{open ? '[' : `[ … ${v.length} ]`}</span>
        </button>
        {open && (
          <ul className="json-list">
            {v.map((item, i) => (
              <li key={i}><span className="json-key">{i}:</span> {renderValue(item, path + '.' + i, expanded, toggle, depth + 1, String(i))}</li>
            ))}
          </ul>
        )}
        {open && <span className="json-bracket">]</span>}
      </>
    );
  }
  if (isObj(v)) {
    const keys = Object.keys(v);
    const open = expanded[path] !== false;
    if (keys.length === 0) return <span className="json-bracket">{'{}'}</span>;
    return (
      <>
        <button type="button" className="json-toggle" onClick={() => toggle(path)}
                aria-expanded={open} aria-label={branchLabel(keyLabel, open, keys.length, 'object')}>
          <span className="json-bracket">{open ? '{' : `{ … ${keys.length} }`}</span>
        </button>
        {open && (
          <ul className="json-list">
            {keys.map(k => (
              <li key={k}><span className="json-key">"{k}":</span> {renderValue(v[k], path + '.' + k, expanded, toggle, depth + 1, k)}</li>
            ))}
          </ul>
        )}
        {open && <span className="json-bracket">{'}'}</span>}
      </>
    );
  }
  return <span>{String(v)}</span>;
};
const JSONInspector = ({ data, defaultCollapsedPaths = [] }: {
  /** JSON-serializable value to render (object, array, or primitive). */
  data?: any;
  /** Paths that start collapsed. Syntax: $.deploy.rings — use to hide verbose branches on load. */
  defaultCollapsedPaths?: string[];
}) => {
  const init = React.useMemo(() => {
    const o = {}; defaultCollapsedPaths.forEach(p => { o[p] = false; }); return o;
  }, [defaultCollapsedPaths.join('|')]);
  const [expanded, setExpanded] = React.useState(init);
  const toggle = (p) => setExpanded(prev => ({ ...prev, [p]: !(prev[p] !== false) }));
  return (
    <div className="json-inspector">
      {renderValue(data, '$', expanded, toggle, 0)}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════
// FilterPanel — grouped facets sidebar (used by Service / Agent catalogs).
// ═════════════════════════════════════════════════════════════════════════
type FilterItem = { value: string; label?: string; count?: number };
type FilterGroup = {
  id?: string;
  title?: string;
  items: FilterItem[];
  multi?: boolean;
  selected?: Set<string>;
  onToggle?: (value: string) => void;
};
const FilterPanel = ({ groups = [], onClear, query, onQueryChange, placeholder = 'Filter…' }: {
  /** Array of facet groups — each with a title, items, controlled selected Set, and onToggle. */
  groups?: FilterGroup[];
  /** When provided, renders a "Clear all" ghost button that resets all selections. */
  onClear?: () => void;
  /** Controlled search query that scopes the visible facets in real time. */
  query?: string;
  /** Callback fired when the search input changes. */
  onQueryChange?: (value: string) => void;
  /** Placeholder text for the search input. */
  placeholder?: string;
}) => {
  const q = (query || '').trim().toLowerCase();
  const match = (label) => !q || String(label).toLowerCase().includes(q);
  // When a search query filters every facet out of every group, show one quiet
  // Empty region instead of a blank column (fp-head + fp-search stay visible).
  const anyVisible = groups.some(g => g.items.some(it => match(it.label)));
  const showEmpty = q !== '' && !anyVisible;
  return (
    <aside className="filter-panel" aria-label="Filters">
      <div className="fp-head">
        <span className="fp-title">Filters</span>
        {onClear && <button type="button" className="fp-clear" onClick={onClear}>Clear all</button>}
      </div>
      <div className="fp-search">
        <Icons.search size={12}/>
        <input type="search" value={query || ''} onChange={(e) => onQueryChange && onQueryChange(e.target.value)}
               placeholder={placeholder} aria-label="Filter facets"/>
      </div>
      {showEmpty
        ? <Empty size="sm" title="No facets match" desc="Try a shorter or different search."/>
        : groups.map((g, gi) => {
        const visible = g.items.filter(it => match(it.label));
        if (visible.length === 0) return null;
        const titleId = `fp-grp-${g.id || gi}`;
        const radioName = `fp-${g.id || gi}`;
        return (
          <div key={g.id || gi} className="fp-group" role="group" aria-labelledby={titleId}>
            <div className="fp-group-title" id={titleId}>{g.title}</div>
            <ul className="fp-list">
              {visible.map(it => {
                const isSel = g.selected ? g.selected.has(it.value) : false;
                const inputType = g.multi ? 'checkbox' : 'radio';
                const boxCls = g.multi ? 'fc-check-box' : 'fc-radio-box';
                return (
                  <li key={it.value}>
                    <label className={'fc-control fp-row' + (isSel ? ' is-on' : '')}>
                      <input type={inputType} className="fc-input" checked={isSel}
                             name={g.multi ? undefined : radioName}
                             onChange={() => g.onToggle && g.onToggle(it.value)}/>
                      <span className={boxCls} aria-hidden="true">
                        {g.multi
                          ? <span className="fc-check-icon"><Icons.check size={10} strokeWidth={3} color="#08090A"/></span>
                          : <span className="fc-radio-dot"/>}
                      </span>
                      <span className="fp-label">{it.label}</span>
                      {it.count != null && <span className="fp-count">{it.count}</span>}
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </aside>
  );
};

// ═════════════════════════════════════════════════════════════════════════
// DataTable — dense, sortable-ready table. Now supports footer / dense /
// sticky-header. Sort handled by the caller; we just paint a chevron when
// `sort = { col, dir }` is provided.
// ═════════════════════════════════════════════════════════════════════════
type DataTableColumn = {
  id: string;
  label?: string;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
  sortable?: boolean;
  render?: (row: any) => React.ReactNode;
};
type SortState = { col: string; dir: 'asc' | 'desc' };
const DataTable = ({
  columns = [], rows = [], onRowClick, rowKey, empty,
  sort, onSort, sticky = false, dense = false, footer,
}: {
  /** Array of column definitions — each with id, label, align, width, render, and sortable. */
  columns?: DataTableColumn[];
  /** Array of arbitrary row objects. Default cell renderer reads row[column.id]. */
  rows?: any[];
  /** Fires when a row is clicked. Rows become focusable and activatable with Enter/Space. */
  onRowClick?: (row: any) => void;
  /** Custom React key extractor. Defaults to row => row.id. */
  rowKey?: (row: any) => string | number;
  /** Override the default Empty state shown when rows is empty. */
  empty?: React.ReactNode;
  /** Current sort state. Renders the active chevron and sets aria-sort on the column header. */
  sort?: SortState;
  /** Called when a sortable column header is clicked. */
  onSort?: (colId: string) => void;
  /** Stick thead to the top of the scroll container. */
  sticky?: boolean;
  /** Tighten row padding (6px vs 10px) for denser lists. */
  dense?: boolean;
  /** Custom tfoot content (e.g. a totals row). */
  footer?: React.ReactNode;
}) => {
  const keyFn = rowKey || ((r) => r.id);
  const cls = ['tbl', 'tbl-data'];
  if (sticky) cls.push('sticky');
  if (dense) cls.push('dense');
  return (
    <div className="tbl-wrap">
      <table className={cls.join(' ')}>
        <thead>
          <tr>
            {columns.map(c => {
              const isSorted = sort && sort.col === c.id;
              const chevs = c.sortable && (
                <span className="th-chevs" aria-hidden="true">
                  <span className={'chev-up ' + (isSorted && sort.dir === 'asc' ? 'on' : '')}>▲</span>
                  <span className={'chev-dn ' + (isSorted && sort.dir === 'desc' ? 'on' : '')}>▼</span>
                </span>
              );
              return (
                <th key={c.id} scope="col" style={{ textAlign: c.align || 'left', width: c.width }}
                    className={(c.sortable ? 'is-sortable ' : '') + (isSorted ? 'is-sorted ' + sort.dir : '')}
                    aria-sort={isSorted ? (sort.dir === 'asc' ? 'ascending' : 'descending') : (c.sortable ? 'none' : undefined)}>
                  {c.sortable && onSort ? (
                    <button type="button" className="th-btn" onClick={() => onSort(c.id)}>
                      <span className="th-inner">
                        <span>{c.label}</span>
                        {chevs}
                      </span>
                    </button>
                  ) : (
                    <span className="th-inner">
                      <span>{c.label}</span>
                      {chevs}
                    </span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={columns.length} style={{ padding: 0 }}>{empty || <Empty title="Nothing here" desc="No rows match the current filters." size="sm"/>}</td></tr>
          )}
          {rows.map(r => (
            <tr key={keyFn(r)} onClick={onRowClick ? () => onRowClick(r) : undefined}
                className={onRowClick ? 'is-clickable' : ''}
                tabIndex={onRowClick ? 0 : undefined}
                role={onRowClick ? 'button' : undefined}
                aria-label={onRowClick ? 'Open row ' + String(keyFn(r)) : undefined}
                onKeyDown={onRowClick ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onRowClick(r); }
                } : undefined}>
              {columns.map(c => (
                <td key={c.id} style={{ textAlign: c.align || 'left' }}>
                  {c.render ? c.render(r) : r[c.id]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {footer && <tfoot>{footer}</tfoot>}
      </table>
    </div>
  );
};

// WorkflowCanvas was removed in v1.5.0 — it never reached the polish bar
// we set for it. If/when we ship a DAG primitive, it'll start from a clean
// ReactFlow integration, not the hand-rolled SVG we had.

export {
  Banner,
  MetricCard, Stat, Pipeline, Timeline, RingBar, ScoreGauge,
  LogViewer, DiffViewer, TreeView, JSONInspector,
  ServiceCard, AgentCard, FilterPanel,
  DataTable,
};
