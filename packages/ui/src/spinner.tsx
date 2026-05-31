import * as React from 'react';
import { cn } from './lib/utils';

// Forge DS — Spinner
//
// Three visual flavors: ring (default), dots, bars.
// Named sizes (sm=12, md=16, lg=24) or a raw number.
// Color inherits via currentColor; override with the `color` prop.
// ARIA: role="status" wraps a visually-hidden label (default "Loading").
// The visual marks are aria-hidden so screen readers only hear the label.
// prefers-reduced-motion: slows continuous animation to a calmer pace.
//
// CSS lives in packages/ui/styles/ds.css (.sp-* block).
// No <style> here — className strings only.

// ── Types ────────────────────────────────────────────────────────────────────

export type SpinnerVariant = 'ring' | 'dots' | 'bars';
export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Visual flavor.
   * ring — circular arc (default, best for buttons/general waits)
   * dots — three pulsing dots (best inline in body text)
   * bars — four amplitude bars (media/equalizer context)
   */
  variant?: SpinnerVariant;
  /**
   * Named size: sm=12px, md=16px (default), lg=24px.
   * Alternatively pass any positive integer for a custom diameter.
   */
  size?: SpinnerSize | number;
  /**
   * Explicit CSS color. Defaults to currentColor so the spinner inherits
   * from its surrounding text without extra wrapper styling.
   */
  color?: string;
  /**
   * Label announced to assistive technology via a visually-hidden span.
   * Defaults to "Loading". Override when the wait has a specific name
   * (e.g. "Saving changes").
   */
  'aria-label'?: string;
  /** Extra classes merged via cn(). */
  className?: string;
}

// ── Size map ──────────────────────────────────────────────────────────────────

const SIZE_PX: Record<SpinnerSize, number> = { sm: 12, md: 16, lg: 24 };

function resolvePx(size: SpinnerSize | number | undefined): number {
  if (typeof size === 'number') return size;
  return SIZE_PX[size ?? 'md'];
}

// ── Visually-hidden helper ────────────────────────────────────────────────────

const srOnly: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
};

// ── Component ─────────────────────────────────────────────────────────────────

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  (
    {
      variant = 'ring',
      size = 'md',
      color,
      'aria-label': ariaLabel = 'Loading',
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const px = resolvePx(size);
    const dotPx = Math.max(3, Math.round(px / 3.5));

    const cssVars = {
      '--sp': `${px}px`,
      '--sp-dot': `${dotPx}px`,
      ...(color ? { color } : {}),
      ...style,
    } as React.CSSProperties;

    if (variant === 'dots') {
      return (
        <span
          ref={ref}
          role="status"
          aria-label={ariaLabel}
          className={cn('sp-dots', className)}
          style={cssVars}
          {...rest}
        >
          {/* Three dot segments — aria-hidden so only the label is read */}
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          {/* Visually-hidden text carries the accessible name */}
          <span style={srOnly}>{ariaLabel}</span>
        </span>
      );
    }

    if (variant === 'bars') {
      return (
        <span
          ref={ref}
          role="status"
          aria-label={ariaLabel}
          className={cn('sp-bars', className)}
          style={cssVars}
          {...rest}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span style={srOnly}>{ariaLabel}</span>
        </span>
      );
    }

    // ring (default)
    return (
      <span
        ref={ref}
        role="status"
        aria-label={ariaLabel}
        className={cn('sp-ring', className)}
        style={cssVars}
        {...rest}
      >
        <span style={srOnly}>{ariaLabel}</span>
      </span>
    );
  },
);
Spinner.displayName = 'Spinner';
