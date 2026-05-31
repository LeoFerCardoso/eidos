import * as React from 'react';
import { cn } from './lib/utils';
import { Icons } from './icons';

// ═══════════════════════════════════════════════════════════════════════════
// Badge family — TRIO model (Consolidation Case 2)
//
//   Pill   = STATE        — rounded capsule, 22px, dot/icon/remove
//   Chip   = ATTRIBUTE    — 4px-radius rectangle, mono, arrow/remove
//   Badge  = COUNT        — ~18px square, mono, nav use
//
// Each is polymorphic in its own role. CSS lives in tokens.css + ds.css.
// ═══════════════════════════════════════════════════════════════════════════

// ── PillTone ────────────────────────────────────────────────────────────────
// The 6 base tones map directly to .pill.<tone> in tokens.css.
// The semantic families (severity-*, health-*, status-*, risk-*) power
// the SeverityPill / HealthBadge presets in atoms.tsx.
type PillTone =
  | 'ember' | 'success' | 'warning' | 'danger' | 'ice' | 'neutral'
  // severity family (incident triage)
  | 'severity-p0' | 'severity-p1' | 'severity-p2' | 'severity-p3'
  // health family (service uptime)
  | 'health-up' | 'health-degraded' | 'health-down' | 'health-unknown'
  // status family (run/pipeline step)
  | 'status-pending' | 'status-running' | 'status-done' | 'status-error' | 'status-skipped'
  // risk family (change risk score)
  | 'risk-low' | 'risk-med' | 'risk-high' | 'risk-crit';

export interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Semantic tone — maps directly to .pill.<tone> CSS. */
  tone?: PillTone;
  /** Swap the static dot for a pulsing ring. Use only while work is in flight. */
  live?: boolean;
  /** Show a static status dot. Suppressed when `icon` is provided. */
  dot?: boolean;
  /** Leading icon node (12px). Suppresses the dot automatically. */
  icon?: React.ReactNode;
  /** Renders a trailing × remove button with the given aria-label. */
  onRemove?: () => void;
  /** Accessible label for the remove button (required when onRemove is set). */
  removeLabel?: string;
  children: React.ReactNode;
  className?: string;
}

/** State pill — capsule shape for service health, deploy state, run state. */
export const Pill = React.forwardRef<HTMLSpanElement, PillProps>(
  (
    {
      tone = 'neutral',
      live = false,
      dot = false,
      icon,
      onRemove,
      removeLabel = 'Remove',
      children,
      className,
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    const showDot = !icon && (dot || live);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
      if (onRemove && (e.key === 'Backspace' || e.key === 'Delete')) {
        e.preventDefault();
        onRemove();
      }
      onKeyDown?.(e);
    };

    return (
      <span
        ref={ref}
        className={cn('pill', tone !== 'neutral' && tone, className)}
        onKeyDown={onRemove ? handleKeyDown : onKeyDown}
        {...rest}
      >
        {icon && <span aria-hidden="true" className="pill-icon">{icon}</span>}
        {showDot && (
          <span aria-hidden="true" className={live ? 'ldot' : 'dot'} />
        )}
        {children}
        {onRemove && (
          <button
            type="button"
            className="pl-x"
            aria-label={removeLabel}
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
          >
            <Icons.x size={10} />
          </button>
        )}
      </span>
    );
  },
);
Pill.displayName = 'Pill';

// ── ChipTone ────────────────────────────────────────────────────────────────
type ChipTone =
  | 'ok' | 'bad' | 'warn' | 'ember' | 'neutral'
  // tier family (service reliability tier)
  | 'tier-t1' | 'tier-t2' | 'tier-t3';

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Tone — maps to .chip.<tone> CSS. Defaults to neutral. */
  tone?: ChipTone;
  /**
   * Renders a leading 10px trend arrow. Does NOT mirror under dir="rtl" —
   * up always means up, down always means down.
   */
  trend?: 'up' | 'down';
  /** Leading icon node (e.g., a language colour dot). */
  icon?: React.ReactNode;
  /** Renders a trailing × remove button with the given aria-label. */
  onRemove?: () => void;
  /** Accessible label for the remove button (required when onRemove is set). */
  removeLabel?: string;
  children: React.ReactNode;
  className?: string;
}

/** Attribute chip — 4px-radius rectangle for versions, deltas, refs. */
export const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  (
    {
      tone = 'neutral',
      trend,
      icon,
      onRemove,
      removeLabel = 'Remove',
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const toneClass =
      tone === 'neutral' ? '' : tone.replace('tier-', 'tier-');

    return (
      <span
        ref={ref}
        className={cn(
          'chip',
          tone !== 'neutral' && toneClass,
          onRemove && 'removable',
          className,
        )}
        {...rest}
      >
        {trend && (
          <span aria-hidden="true" className="ch-arrow">
            {trend === 'up' ? <Icons.arrowUp size={10} /> : <Icons.arrowDown size={10} />}
          </span>
        )}
        {icon && <span aria-hidden="true">{icon}</span>}
        {children}
        {onRemove && (
          <button
            type="button"
            className="chip-x"
            aria-label={removeLabel}
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
          >
            <Icons.x size={9} />
          </button>
        )}
      </span>
    );
  },
);
Chip.displayName = 'Chip';

// ── BadgeTone ────────────────────────────────────────────────────────────────
type BadgeTone = 'neutral' | 'new' | 'ice' | 'success' | 'warning' | 'danger';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Tone — maps to .badge.<tone> CSS. Defaults to neutral. */
  tone?: BadgeTone;
  /** Size — sm 14px / md 18px / lg 22px. Defaults to md. */
  size?: 'sm' | 'md' | 'lg';
  /** Renders the dot variant (presence indicator, no text). */
  dot?: boolean;
  /** Hugs the trailing edge of a flex nav row (margin-inline-start: auto). */
  pushEnd?: boolean;
  children?: React.ReactNode;
  className?: string;
}

/** Count badge — integer riding next to a nav label or tab. */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { tone = 'neutral', size, dot = false, pushEnd = false, children, className, ...rest },
    ref,
  ) => (
    <span
      ref={ref}
      className={cn(
        'badge',
        tone !== 'neutral' && tone,
        size && size !== 'md' && size,
        dot && 'dot',
        pushEnd && 'push-end',
        className,
      )}
      {...rest}
    >
      {!dot && children}
    </span>
  ),
);
Badge.displayName = 'Badge';
