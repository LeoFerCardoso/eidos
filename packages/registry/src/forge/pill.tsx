import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/forge/icons';

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

interface PillProps extends React.HTMLAttributes<HTMLSpanElement> {
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

const Pill = React.forwardRef<HTMLSpanElement, PillProps>(
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

export { Pill };
