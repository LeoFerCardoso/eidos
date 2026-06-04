import * as React from 'react';
// Eidos — atomic display helpers used across the system:
// Sparkline · Counter · Avatar · TierBadge · LangBadge · Empty · StatusDot …
// (Message + AICaret now live in core/ai/message.tsx)
import { Icons } from './icons';
import { MOCKS } from './mocks';
import { Pill, Chip } from './badge';

// Sparkline helper
const Sparkline = ({
  data,
  w = 120,
  h = 32,
  color = 'var(--ember)',
  fill = true,
}: {
  data: number[];
  w?: number;
  h?: number;
  color?: string;
  fill?: boolean;
}) => {
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v,i) => [ (i/(data.length-1))*w, h - ((v-min)/range)*(h-4) - 2 ]);
  const path = points.map((p,i) => (i===0?'M':'L') + p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
  const fillPath = path + ` L ${w},${h} L 0,${h} Z`;
  return (
    <svg width={w} height={h} className="sparkline" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
      {fill && <path d={fillPath} fill={color} opacity="0.12"/>}
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
      {points.map((p,i)=> i===points.length-1 && <circle key={i} cx={p[0]} cy={p[1]} r="2" fill={color}/>)}
    </svg>
  );
};

// ── CountUp ──────────────────────────────────────────────────────────────
// Canonical name. Animates from `from` (default 0) → `to` using a cubic
// ease-out once the element enters the viewport (IntersectionObserver,
// threshold 0.4). Fires exactly once — callers reset by changing React key.
// Under prefers-reduced-motion the duration collapses to 0 so the final
// value paints immediately with no tick.
export interface CountUpProps {
  /** Target value. Animation eases to this number once visible. */
  to: number;
  /** Starting value. Useful for partial-progress reads (e.g. 50→80%). */
  from?: number;
  /** Static string appended after the figure (e.g. "%", " / mo"). */
  suffix?: string;
  /** Static string rendered before the animated figure (e.g. "$"). */
  prefix?: string;
  /** Duration in ms. Collapses to 0 automatically under prefers-reduced-motion. */
  dur?: number;
  /** Number of decimal places. Defaults to integer. */
  decimals?: number;
  /** Extra class names appended to the host span. */
  className?: string;
  /** Inline style override for the host span. */
  style?: React.CSSProperties;
}
const CountUp = ({
  to,
  from = 0,
  suffix = '',
  prefix = '',
  dur = 1200,
  decimals = 0,
  className = '',
  style,
}: CountUpProps) => {
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const effectiveDur = reducedMotion ? 0 : dur;
  const [v, setV] = React.useState(from);
  const ref = React.useRef<HTMLSpanElement>(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setSeen(true); },
      { threshold: 0.4 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  React.useEffect(() => {
    if (!seen) return;
    if (effectiveDur === 0) { setV(to); return; }
    const start = performance.now();
    const range = to - from;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / effectiveDur);
      const ease = 1 - Math.pow(1 - t, 3);
      setV(from + range * ease);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [seen, to, from, effectiveDur]);
  const cls = ['t-mono', className].filter(Boolean).join(' ');
  return (
    <span ref={ref} className={cls} style={style}>
      {prefix}{v.toFixed(decimals)}{suffix}
    </span>
  );
};

/** @deprecated use CountUp */
const Counter = CountUp;

/** Size presets: xs=18 · sm=22 · md=28 (default) · lg=36 · xl=48 */
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const AVATAR_PRESET: Record<AvatarSize, number> = {
  xs: 18, sm: 22, md: 28, lg: 36, xl: 48,
};

/** Compute up-to-2-letter initials from a full name ("Ana Silva" → "AS"). */
function initials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return (words[0][0] ?? '').toUpperCase();
  return ((words[0][0] ?? '') + (words[words.length - 1][0] ?? '')).toUpperCase();
}

export interface AvatarProps {
  /**
   * Full name — used for the `title` tooltip and as the source for computed
   * initials when no `children` or `src` is provided.
   */
  name?: string;
  /** Size preset. xs=18 · sm=22 · md=28 (default) · lg=36 · xl=48. Also accepts a raw pixel number for legacy callers. */
  size?: AvatarSize | number;
  /** Image URL. Renders an `<img>` that falls back to initials on load error. */
  src?: string;
  /** Presence dot in the trailing-bottom corner. online · away · busy · offline. */
  status?: 'online' | 'away' | 'busy' | 'offline';
  /** Tints background with --ember-soft + ember text. Reserve for the current user / "you". */
  ember?: boolean;
  /** Override the initials — e.g. an icon for bot / system users. */
  children?: React.ReactNode;
  /** Extra utility classes merged via cn(). */
  className?: string;
  /**
   * @deprecated Pass `name` + `children` instead.
   * Legacy person descriptor — { name, initials, role? }.
   */
  p?: { name: string; initials: string; role?: string };
}

function AvatarBase({
  name: nameProp,
  size = 'md',
  src,
  status,
  ember = false,
  children,
  className,
  p,
}: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);

  // Resolution: name from explicit prop or legacy p?.name
  const resolvedName = nameProp ?? p?.name ?? '';
  // Diameter: preset string or explicit pixel number (legacy callers)
  const dia = typeof size === 'number' ? size : AVATAR_PRESET[size ?? 'md'];
  // Initials: children > legacy p?.initials > computed from name
  const resolvedInitials = children ?? p?.initials ?? (resolvedName ? initials(resolvedName) : null);

  const cls = ['avatar', ember ? 'ember' : '', className ?? ''].filter(Boolean).join(' ');

  return (
    <span
      className={cls}
      style={{ width: dia, height: dia, fontSize: dia * 0.36 }}
      title={resolvedName || undefined}
    >
      {src && !imgError
        ? <img src={src} alt={resolvedName || ''} onError={() => setImgError(true)} />
        : resolvedInitials}
      {status && (
        <span
          className={['status-dot', status !== 'online' ? status : ''].filter(Boolean).join(' ')}
          aria-hidden="true"
        />
      )}
    </span>
  );
}

// ── Avatar.Group ──────────────────────────────────────────────────────────
// Overlapping avatars rendered from Avatar ELEMENTS (not a data array).
// Slices the visible children, renders a "+N" overflow chip for extras.
//
// RTL: inline-flex + margin-inline-start reverses visual order automatically
// under dir="rtl", so the stack mirrors and the overflow chip moves to the
// logical end (visual left in RTL).
//
// A11y: each Avatar has a native title= for hover; the overflow chip has an
// aria-label listing the hidden names, and aria-hidden="true" on the counter
// text (the meaningful content is the aria-label).

export interface AvatarGroupProps {
  /** Avatar children. Direction-aware: in RTL the +N overflow lands on the left. */
  children: React.ReactNode;
  /** Maximum visible avatars before the +N overflow chip. Default: 5. */
  max?: number;
  /** Tighter overlap (−10px instead of −8px). */
  tight?: boolean;
  /** Size override passed down to the overflow chip (matches the child avatars). Default: 'md'. */
  size?: AvatarSize | number;
  /** Extra utility classes merged via cn(). */
  className?: string;
}

const AvatarGroup = ({
  children,
  max = 5,
  tight = false,
  size = 'md',
  className,
}: AvatarGroupProps) => {
  const childArray = React.Children.toArray(children);
  const visible = max != null && max < childArray.length ? childArray.slice(0, max) : childArray;
  const overflow = childArray.length - visible.length;

  // Collect hidden names from each child's name/title prop for a11y
  const hiddenNames = overflow > 0
    ? childArray.slice(visible.length).map((child) => {
        if (React.isValidElement(child)) {
          const cp = child.props as AvatarProps;
          return cp.name ?? cp.p?.name ?? '';
        }
        return '';
      }).filter(Boolean).join(', ')
    : '';

  const dia = typeof size === 'number' ? size : AVATAR_PRESET[size ?? 'md'];
  const cls = ['avatar-group', tight ? 'tight' : '', className ?? ''].filter(Boolean).join(' ');

  return (
    <span className={cls}>
      {visible}
      {overflow > 0 && (
        <span
          className="avatar-overflow"
          style={{ width: dia, height: dia, fontSize: dia * 0.33 }}
          aria-label={`${overflow} more: ${hiddenNames}`}
        >
          <span aria-hidden="true">+{overflow}</span>
        </span>
      )}
    </span>
  );
};

// Attach Group as Avatar.Group so `<Avatar.Group>` works in TSX.
// TypeScript namespace merging: `namespace Avatar` augments the `Avatar` function type
// with a `.Group` sub-component. gen-props sees the function declaration above and
// generates GENERATED_PROPS["Avatar"] from AvatarBase's typed interface.
// eslint-disable-next-line @typescript-eslint/no-namespace
namespace AvatarBase { export const Group = AvatarGroup; }
// Named export alias: `const Avatar = AvatarBase` lets gen-props register
// the alias Avatar → AvatarBase → same prop rows surface under "Avatar".
const Avatar = AvatarBase;

// ── AvatarStack ───────────────────────────────────────────────────────────
// Legacy API — accepts a `people` array and renders an Avatar for each.
// Kept for backward-compat; new code should prefer Avatar.Group.
//
// Overlapping avatars using the `.avatar-group` CSS class. Supports:
//   max      — maximum number of visible avatars; extras collapse into a
//              "+N" overflow chip (`.avatar-overflow`).
//   tight    — tighter overlap (-10px instead of -8px).
//   size     — pixel diameter passed to each Avatar.
//
// RTL: inline-flex + margin-inline-start reverses visual order automatically
// under dir="rtl", so the stack mirrors and the overflow chip moves to the
// logical end (visual left in RTL).
//
// A11y: each Avatar has a native title= for hover; the overflow chip has an
// aria-label listing the hidden names, and aria-hidden="true" on the counter
// text (the meaningful content is the aria-label).
const AvatarStack = ({
  people,
  max,
  size = 28,
  tight = false,
}: {
  people: Array<{ name: string; initials: string; role?: string }>;
  /** Max visible avatars. Extras collapse into "+N". Default: show all. */
  max?: number;
  size?: number;
  tight?: boolean;
}) => {
  const visible = max != null && max < people.length ? people.slice(0, max) : people;
  const overflow = max != null ? people.length - visible.length : 0;
  const hiddenNames = overflow > 0 ? people.slice(visible.length).map(pp => pp.name).join(', ') : '';
  const cls = ['avatar-group', tight ? 'tight' : ''].filter(Boolean).join(' ');
  return (
    <span className={cls}>
      {visible.map((pp) => (
        <Avatar key={pp.name} p={pp} size={size} />
      ))}
      {overflow > 0 && (
        <span
          className="avatar-overflow"
          style={{ width: size, height: size, fontSize: size * 0.33 }}
          aria-label={`${overflow} more: ${hiddenNames}`}
        >
          <span aria-hidden="true">+{overflow}</span>
        </span>
      )}
    </span>
  );
};

/** @deprecated Use `<Chip tone="tier-t1|tier-t2|tier-t3">` directly. Kept for one-release back-compat. */
const TierBadge = ({
  tier,
  className,
}: {
  tier?: string;
  className?: string;
}) => {
  const toneMap: Record<string, 'tier-t1' | 'tier-t2' | 'tier-t3'> = {
    T1: 'tier-t1',
    T2: 'tier-t2',
    T3: 'tier-t3',
  };
  const tone = toneMap[tier ?? ''] ?? 'tier-t3';
  return <Chip tone={tone} className={className}>{tier}</Chip>;
};

const LangBadge = ({
  lang,
  className,
}: {
  lang?: string;
  className?: string;
}) => (
  <Chip
    icon={
      <span
        aria-hidden="true"
        style={{ display: 'inline-block', flex: '0 0 auto', width: 7, height: 7, borderRadius: '50%', background: MOCKS.LANGS[lang] || 'var(--fg-subtle)' }}
      />
    }
    className={className}
  >
    {lang}
  </Chip>
);

// NOTE: AICaret and Message moved to core/ai/message.tsx (the AI component
// layer). Avatar stays here as a general atom; core/ai imports it.

// ── Empty — canonical empty-state surface ────────────────────────────────
// Promoted from page-local clones in ai/conversation.jsx (.conv-empty) and
// components/table.jsx (.tbl-empty) in Phase 1 (Gap Analysis DEF-04). Three
// sizes drive the same chrome: sm (inline / table / drawer), md (page),
// lg (hero). Pass either an `icon` ReactNode or `iconName` string keyed
// into the global Icons map. Markup is intentionally minimal — children
// can be appended below the actions row for suggestion chips, etc.
export interface EmptyProps {
  /** Size variant. sm = inline/table, md = page section, lg = hero. */
  size?: 'sm' | 'md' | 'lg';
  /** Apply the ember accent tint to the icon tile. */
  accent?: boolean;
  /** Apply the dotted background pattern to the frame body. */
  dotted?: boolean;
  /** Quiet illustrative cue (an icon, not an emoji). Renders inside a tile. */
  icon?: React.ReactNode;
  /** Icon name keyed into the global Icons map. Used when passing a ReactNode is inconvenient. */
  iconName?: string;
  /** One-line heading. State what is missing — "No projects yet". */
  title?: React.ReactNode;
  /** Short sentence explaining the state and pointing the user to the next step. */
  desc?: React.ReactNode;
  /** Primary action. Pass a ReactNode (Button) or a string for a default ember button. */
  action?: React.ReactNode | string;
  /** Optional secondary action. Pass a ReactNode or a string for a default ghost button. */
  secondary?: React.ReactNode | string;
  /** Extra content rendered below the actions row — suggestion chips, etc. */
  children?: React.ReactNode;
}
const Empty = ({
  size,
  accent,
  dotted,
  icon,
  iconName,
  title,
  desc,
  action,
  secondary,
  children,
}: EmptyProps) => {
  const sz = size || 'md';
  const cls = ['empty', sz];
  if (accent) cls.push('accent');
  if (dotted) cls.push('dotted');

  let iconNode = icon;
  if (!iconNode && iconName && Icons && Icons[iconName]) {
    const I = Icons[iconName];
    iconNode = <I size={sz === 'lg' ? 22 : sz === 'sm' ? 16 : 18}/>;
  }

  return (
    <div className={cls.join(' ')} role="status">
      {iconNode && <div className="empty-icon">{iconNode}</div>}
      <div className="empty-text">
        {title && <div className="empty-title">{title}</div>}
        {desc && <div className="empty-desc">{desc}</div>}
      </div>
      {(action || secondary) && (
        <div className="empty-actions">
          {secondary && (typeof secondary === 'string'
            ? <button className="btn ghost">{secondary}</button>
            : secondary)}
          {action && (typeof action === 'string'
            ? <button className="btn ember">{action}</button>
            : action)}
        </div>
      )}
      {children}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════
// Phase 2 atoms — Gap Analysis §8.1
// Each one composes existing primitives (Pill, Avatar, Icons, Kbd) and
// surfaces a single semantic. CSS for each lives under the `Atoms — Phase 2`
// block in ds.css so any product surface can drop these in without paint
// re-derivation.
// ═════════════════════════════════════════════════════════════════════════

// ── StatusDot ────────────────────────────────────────────────────────────
// Generic 8px coloured dot. NOT the avatar presence dot (that one is
// scoped under .avatar .status-dot in tokens.css). Use this anywhere you
// need to put a single-glance state next to a label — pipeline steps,
// health rows, ring deployment cohorts, log severities.
//
//   tone     "pending" | "running" | "done" | "error" | "skipped"
//            | "up" | "degraded" | "down" | "unknown"
//            | "p0" | "p1" | "p2" | "p3"
//   size     "sm" | "md" | "lg"  (default md = 8px)
//   pulse    boolean — radiating ring (for "running", "degraded")
export interface StatusDotProps {
  /** Semantic colour token: "pending" | "running" | "done" | "error" | "skipped" | "up" | "degraded" | "down" | "unknown" | "p0" | "p1" | "p2" | "p3". Defaults to neutral. */
  tone?: string;
  /** Dot diameter. sm = 6px, md = 8px (default), lg = 10px. Use sm when riding with mono text, lg only in hero cards. */
  size?: 'sm' | 'md' | 'lg';
  /** Radiating ring animation. Reserve for in-flight states (running, degraded, p0). */
  pulse?: boolean;
  /** Extra classes merged via cn(). */
  className?: string;
  /** Accessible title attribute shown on hover. Pair with a visible text label for full a11y. */
  title?: string;
  /** Inline style override for the dot span. */
  style?: React.CSSProperties;
}
const StatusDot = ({
  tone,
  size = 'md',
  pulse = false,
  className = '',
  title,
  style,
}: StatusDotProps) => {
  const cls = ['s-dot'];
  if (size !== 'md') cls.push(size);
  if (tone) cls.push(tone);
  if (pulse) cls.push('pulse');
  if (className) cls.push(className);
  return <span className={cls.join(' ')} aria-hidden="true" title={title} style={style}/>;
};

// ── Trend ────────────────────────────────────────────────────────────────
// Tiny up/down/flat indicator with delta. Variants control the glyph and
// chrome — the colour mapping (up=green, down=red, flat=muted) is shared.
//
//   delta     number   — printed (use `format` for custom display)
//   unit      "%" | "ms" | "" | string
//   inverted  boolean  — green for down, red for up (latency, error rate)
//   format    fn(delta) — override default `${Math.abs(delta)}${unit}` string
//   variant   "arrow"     default — ↑ ↓ — (lightweight, inline)
//             "triangle"  ▲ ▼ ◆     — typographic, used in dense tables
//             "badge"     pill with bg tint — feature rows, headline cards
//             "bar"       arrow + tiny delta bar — sparkline neighbour
//   showZero  boolean — render flat row even when delta is 0
const TREND_GLYPHS = {
  arrow:    { up: '↑', down: '↓', flat: '—' },
  triangle: { up: '▲', down: '▼', flat: '◆' },
  badge:    { up: '↑', down: '↓', flat: '—' },
  bar:      { up: '↑', down: '↓', flat: '—' },
};
export interface TrendProps {
  /** Magnitude + sign. Negative renders down/red; positive up/green; zero flat/muted. */
  delta?: number;
  /** Unit string appended after the magnitude (use "" for unitless). */
  unit?: string;
  /** Flip colour mapping. Green for down, red for up. Use for latency, error rate, MTTR. */
  inverted?: boolean;
  /** Override the default `${Math.abs(delta)}${unit}` display string. */
  format?: (delta: number) => string;
  /** Visual chrome. All variants share the same colour mapping. */
  variant?: 'arrow' | 'triangle' | 'badge' | 'bar';
  /** Render flat row when delta === 0. Pass false to hide zero-delta rows. */
  showZero?: boolean;
  /** Extra class names merged on the outermost span. */
  className?: string;
}
const Trend = ({
  delta = 0,
  unit = '%',
  inverted = false,
  format,
  variant = 'arrow',
  showZero = true,
  className = '',
}: TrendProps) => {
  const sign = delta > 0 ? 1 : delta < 0 ? -1 : 0;
  if (!showZero && sign === 0) return null;
  const goodSign = inverted ? -1 : 1;
  const tone = sign === 0 ? 'flat' : (sign === goodSign ? 'up' : 'down');
  const glyph = (TREND_GLYPHS[variant] || TREND_GLYPHS.arrow)[tone];
  const text = format ? format(delta) : `${Math.abs(delta)}${unit}`;
  const cls = ['trend', 'variant-' + variant, tone, className].filter(Boolean).join(' ');
  if (variant === 'bar') {
    const mag = Math.min(1, Math.abs(delta) / 50);
    return (
      <span className={cls} aria-label={`${tone} ${text}`}>
        <span className="arrow" aria-hidden="true">{glyph}</span>
        <span>{text}</span>
        <span className="trend-bar" aria-hidden="true">
          <span className="trend-bar-fill" style={{ transform: `scaleX(${mag})` }}/>
        </span>
      </span>
    );
  }
  return (
    <span className={cls} aria-label={`${tone} ${text}`}>
      <span className="arrow" aria-hidden="true">{glyph}</span>
      <span>{text}</span>
    </span>
  );
};

// ── HealthBadge ──────────────────────────────────────────────────────────
// Pill that shows operational health for a service / agent / cloud
// resource. Wraps `.pill.health-*` from tokens.css with an explicit dot
// and label. Keep labels short ("Up", "Degraded", "Down", "Unknown").
//
//   state   "up" | "degraded" | "down" | "unknown"
//   label   string — override default state label
//   pulse   boolean — pulses the dot (e.g. degraded mid-investigation)
const HEALTH_LABELS = { up: 'Up', degraded: 'Degraded', down: 'Down', unknown: 'Unknown' };
const HealthBadge = ({
  state = 'unknown',
  label,
  pulse = false,
}: {
  state?: 'up' | 'degraded' | 'down' | 'unknown';
  label?: string;
  pulse?: boolean;
}) => (
  <Pill
    tone={`health-${state}` as any}
    dot
    live={pulse && state === 'degraded'}
    role="status"
    aria-label={`Health: ${label || HEALTH_LABELS[state]}`}
  >
    {label || HEALTH_LABELS[state]}
  </Pill>
);

// ── SeverityPill ─────────────────────────────────────────────────────────
// Incident / alert / change-risk severity. Wraps `.pill.severity-*` from
// tokens.css. The Eidos convention is P0 = highest (worst), P3 = lowest.
//
//   level   "p0" | "p1" | "p2" | "p3"
//   label   string — override default "P0 — Critical" / "P1 — Major" / etc.
//   icon    boolean — prepend alert glyph (default true)
const SEVERITY_LABELS = { p0: 'P0 · Critical', p1: 'P1 · Major', p2: 'P2 · Minor', p3: 'P3 · Notice' };
const SeverityPill = ({
  level = 'p2',
  label,
  icon = true,
}: {
  level?: 'p0' | 'p1' | 'p2' | 'p3';
  label?: string;
  icon?: boolean;
}) => (
  <Pill
    tone={`severity-${level}` as any}
    icon={icon ? <Icons.alert size={10} /> : undefined}
    role="status"
    aria-label={`Severity: ${label || SEVERITY_LABELS[level]}`}
  >
    {label || SEVERITY_LABELS[level]}
  </Pill>
);

// ── Kbd ──────────────────────────────────────────────────────────────────
// Unified keyboard key / chord / row component.
//
//   <Kbd keys="K"/>                    — single key (string shorthand)
//   <Kbd>⌘</Kbd>                       — single key (children)
//   <Kbd keys={['⌘','K']}/>           — chord: renders joined cells
//   <Kbd label="Open" keys={['⌘','K']}/>  — row: label + trailing chord
//   <Kbd label="Save" keys={['⌘','S']} meta="all files"/>
//
//   className  — extra classes on the outermost element
//
// Single-key and chord variants render inline (<kbd>/<span>).
// When `label` is provided the component renders a `.kbd-row` block.
export interface KbdProps {
  /** Single key string → one keycap; string array with 2+ items → chord. Providing label triggers row mode. */
  keys?: string | string[];
  /** Row mode: left-hand label. Presence switches rendering from inline to .kbd-row block. */
  label?: React.ReactNode;
  /** Row mode only: muted hint rendered between the label and the chord. */
  meta?: React.ReactNode;
  /** Extra utility classes merged on the outermost element. */
  className?: string;
  /** Key glyph or text (single-key mode). Ignored when keys is provided. */
  children?: React.ReactNode;
}
const Kbd = ({
  keys,
  label,
  meta,
  className = '',
  children,
}: KbdProps) => {
  const keyArr = Array.isArray(keys) ? keys : (keys ? [keys] : []);

  // Row mode — label is present
  if (label !== undefined) {
    return (
      <div className={['kbd-row', className].filter(Boolean).join(' ')}>
        <span className="label">{label}</span>
        {meta && <span style={{ fontSize: 11.5, color: 'var(--fg-faint)' }}>{meta}</span>}
        {keyArr.length > 0 && (
          <span className="kbd-chord">{keyArr.map((k, i) => <kbd className="kbd" key={i}>{k}</kbd>)}</span>
        )}
      </div>
    );
  }

  // Chord mode — multiple keys
  if (keyArr.length > 1) {
    return (
      <span className={['kbd-chord', className].filter(Boolean).join(' ')}>
        {keyArr.map((k, i) => <kbd className="kbd" key={i}>{k}</kbd>)}
      </span>
    );
  }

  // Single-key mode — one key string or children
  const key = keyArr[0] ?? children;
  return <kbd className={['kbd', className].filter(Boolean).join(' ')}>{key}</kbd>;
};

// ── KbdRow ───────────────────────────────────────────────────────────────
/** @deprecated Use `<Kbd label="…" keys={[…]}/>` instead. Thin alias kept for back-compat. */
const KbdRow = ({
  label,
  keys = [],
  meta,
}: {
  label?: React.ReactNode;
  keys?: string[];
  meta?: React.ReactNode;
}) => <Kbd label={label} keys={keys} meta={meta}/>;

// ── CopyChip ─────────────────────────────────────────────────────────────
// .chip + click-to-copy. Hover hints with the copy icon; on click shows
// a brief "Copied" affordance. The chip itself reads exactly like the
// value (commit SHA, k8s namespace, service ref) — ideal for catalogs
// where every row exposes one identifier you'll paste somewhere else.
//
//   value     string — text to copy (also the displayed label by default)
//   label     string | ReactNode — override display (e.g. shortened SHA)
//   tone      "default" | "ember" | "ice" — passes through .chip variant
export interface CopyChipProps {
  /** String written to clipboard on click. Always the canonical / full version. */
  value: string;
  /** Display label. Truncate or alias the value so it stays scannable (e.g. 7-char SHA). Defaults to value. */
  label?: React.ReactNode;
  /** Chip colour variant. Use ember for primary identifiers (service ref), ice for secondaries. */
  tone?: 'default' | 'ember' | 'ice';
}
const CopyChip = ({
  value,
  label,
  tone = 'default',
}: CopyChipProps) => {
  const [copied, setCopied] = React.useState(false);
  const onClick = async () => {
    try { await navigator.clipboard.writeText(value); }
    catch (e) {
      const ta = document.createElement('textarea');
      ta.value = value; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e2) {}
      ta.remove();
    }
    setCopied(true); setTimeout(() => setCopied(false), 1400);
  };
  const cls = ['chip', 'copy-chip'];
  if (tone !== 'default') cls.push(tone);
  if (copied) cls.push('is-copied');
  return (
    <>
      <button type="button" className={cls.join(' ')} onClick={onClick}
              aria-label={`Copy ${value}`} title={copied ? 'Copied' : `Copy ${value}`}>
        <span>{label || value}</span>
        {copied ? <Icons.check size={10}/> : <Icons.copy size={10}/>}
      </button>
      {/* Visually-hidden live region: announces the success transition once,
          satisfying the documented role="status" aria-live="polite" SR contract.
          Empty while idle so AT only speaks on the copied → true transition. */}
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? `Copied ${value}` : ''}
      </span>
    </>
  );
};

// ── RelativeTime ─────────────────────────────────────────────────────────
// Renders a humanised relative phrase ("3 min ago") inside a <time> element.
// Ticks every 60s so the label stays fresh without a reload. By default the
// absolute datetime is in the native `title` (browser default). Pass
// `tooltip` to render it as a Eidos `.tt` tooltip (designed bubble + caret).
//
//   value     Date | number (ms) | ISO string
//   absolute  boolean — show absolute alongside ("Mon · 3 min ago")
//   tooltip   boolean — wrap in .tt[data-tt="<full datetime>"] (default false)
//   tooltipSide  "top" | "bottom" | "left" | "right"  (default "top")
const fmtAbs = (d) => {
  const day = d.toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short' });
  const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  return `${day} ${time}`;
};
const fmtFull = (d) => {
  const day = d.toLocaleDateString(undefined, { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  return `${day} · ${time}`;
};
const fmtRel = (d) => {
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  const abs = Math.abs(diff);
  const future = diff < 0;
  const parts: [number, string, number?][] = [
    [60, 'sec'], [3600, 'min', 60], [86400, 'h', 3600],
    [604800, 'd', 86400], [2419200, 'w', 604800], [29030400, 'mo', 2419200],
  ];
  if (abs < 5) return 'just now';
  for (let i = 0; i < parts.length; i++) {
    const [limit, unit, div] = parts[i];
    if (abs < limit) {
      const n = Math.floor(abs / (div || 1));
      return future ? `in ${n} ${unit}` : `${n} ${unit} ago`;
    }
  }
  const years = Math.floor(abs / 29030400);
  return future ? `in ${years}y` : `${years}y ago`;
};
export interface RelativeTimeProps {
  /** Date, ms timestamp, or ISO string — anything new Date(value) accepts. */
  value: Date | number | string;
  /** Show absolute alongside relative ("Mon · 3 min ago"). */
  absolute?: boolean;
  /** Wrap in .tt tooltip. Hover reveals the full date · time · seconds. */
  tooltip?: boolean;
  /** Tooltip placement when tooltip=true. */
  tooltipSide?: 'top' | 'bottom' | 'left' | 'right';
  /** Extra classes on the time element. */
  className?: string;
}
const RelativeTime = ({
  value,
  absolute = false,
  tooltip = false,
  tooltipSide = 'top',
  className = '',
}: RelativeTimeProps) => {
  const d = React.useMemo(() => value instanceof Date ? value : new Date(value), [value]);
  const [, force] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => force(n => n + 1), 60000);
    return () => clearInterval(id);
  }, []);
  const rel = fmtRel(d);
  const abs = fmtAbs(d);
  const full = fmtFull(d);
  const text = absolute ? `${abs} · ${rel}` : rel;
  const cls = ['relative-time', className].filter(Boolean).join(' ');
  if (tooltip) {
    const ttCls = ['tt', tooltipSide !== 'top' ? tooltipSide : ''].filter(Boolean).join(' ');
    return (
      <span className={ttCls} data-tt={full}>
        {/* relative text + dateTime are computed against the current clock and the
            user's locale, so they legitimately differ between SSR and the client —
            suppress the (expected) hydration mismatch. */}
        <time className={cls} dateTime={d.toISOString()} suppressHydrationWarning>{text}</time>
      </span>
    );
  }
  return (
    <time className={cls} dateTime={d.toISOString()} title={full} suppressHydrationWarning>{text}</time>
  );
};

// ── OwnerPill ────────────────────────────────────────────────────────────
// Avatar + name in a single inline tag. Used in service / agent catalogs
// ("owned by: …"), PR reviewers row, incident commander row. Truncates
// long names with ellipsis.
//
//   person   { name, initials, role? }
//   role     string — appended after the name in muted weight ("· SRE")
//   ember    boolean — ember-tinted avatar (matches Eidos accent)
export interface OwnerPillProps {
  /** Person descriptor. `src` (optional) renders a photo avatar with initials fallback. */
  person?: { name: string; initials: string; role?: string; src?: string };
  /** Role appended after the name in muted weight ("· SRE"). */
  role?: string;
  /** Ember-tint the avatar — reserve for the current user / "you". */
  ember?: boolean;
}
const OwnerPill = ({ person, role, ember = false }: OwnerPillProps) => {
  if (!person) return null;
  return (
    <span className="owner-pill" title={person.name + (role ? ` — ${role}` : '')}>
      <Avatar p={person} src={person.src} size={20} ember={ember}/>
      <span className="owner-pill-text">
        <span className="name">{person.name}</span>
        {role && <span className="role">· {role}</span>}
      </span>
    </span>
  );
};

export {
  Sparkline, Counter, CountUp, Avatar, AvatarGroup, AvatarStack, TierBadge, LangBadge,
  Empty,
  // Phase 2 atoms
  StatusDot, Trend, HealthBadge, SeverityPill, Kbd, KbdRow, CopyChip,
  RelativeTime, OwnerPill,
};
