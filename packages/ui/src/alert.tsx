import * as React from 'react';
import { cn } from './lib/utils';
import { Icons } from './icons';

// ═══════════════════════════════════════════════════════════════════════════
// Alert family — compound model
//
//   Alert             = root container (role="alert"|"status", tone classes)
//   AlertTitle        = bold one-line heading
//   AlertDescription  = muted body text
//   AlertMeta         = inline row — pills, request ids, monospace values
//   AlertExtra        = diagnostic slot — progress bar, chart, breakdown
//   AlertActions      = action row at the foot of the body
//
// CSS classes live in packages/ui/styles/ds.css (.alert* block).
// No <style> here — className strings only.
// ═══════════════════════════════════════════════════════════════════════════

// ── Types ──────────────────────────────────────────────────────────────────

export type AlertTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Semantic tone. Drives background, border, and icon color.
   * Defaults to "neutral" (no tint).
   */
  tone?: AlertTone;
  /**
   * When provided, renders a dismiss button at the trailing edge and calls
   * this callback when the user clicks it. Omit for non-dismissible alerts.
   */
  onDismiss?: () => void;
  /**
   * Accessible label for the dismiss button.
   * Defaults to "Dismiss".
   */
  dismissLabel?: string;
  /**
   * Override the auto-selected ARIA live region role.
   * - "assertive" → role="alert" (interrupts screen readers immediately)
   * - "polite"    → role="status" (reads after the current utterance)
   *
   * When omitted the component picks a sensible default: danger/warning →
   * "assertive", everything else → "polite".
   */
  assertive?: boolean;
  children: React.ReactNode;
  className?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

/** Per-tone default icon glyph. */
function DefaultIcon({ tone }: { tone: AlertTone }) {
  switch (tone) {
    case 'success': return <Icons.check size={16} aria-hidden="true" className="alert-icon" />;
    case 'warning': return <Icons.alert size={16} aria-hidden="true" className="alert-icon" />;
    case 'danger':  return <Icons.x     size={16} aria-hidden="true" className="alert-icon" />;
    case 'info':    return <Icons.alert size={16} aria-hidden="true" className="alert-icon" />;
    default:        return <Icons.alert size={16} aria-hidden="true" className="alert-icon" />;
  }
}

// ── Alert (root) ───────────────────────────────────────────────────────────

/**
 * Inline feedback box — NOT a toast. Renders in the document flow, adjacent
 * to the content it describes. Use one alert at a time; avoid stacking unless
 * each requires its own user decision.
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      tone = 'neutral',
      onDismiss,
      dismissLabel = 'Dismiss',
      assertive,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    // danger/warning default to assertive; everything else is polite.
    const isAssertive =
      assertive !== undefined
        ? assertive
        : tone === 'danger' || tone === 'warning';

    // Separate any AlertTitle/AlertDescription/AlertMeta/AlertExtra/AlertActions
    // from a leading icon child. The first <svg>/<Icons.*> child gets positioned
    // via .alert-icon; compound-slot children manage their own class.
    const childArray = React.Children.toArray(children);

    // Check whether the caller explicitly passed an icon as the first child
    // (an element whose type is a function component with displayName AlertIcon,
    // or any SVG element). If not, render the tone-default icon automatically.
    const firstChild = childArray[0];
    const hasExplicitIcon =
      React.isValidElement(firstChild) &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (firstChild.props as any)?.className?.includes?.('alert-icon');

    return (
      <div
        ref={ref}
        role={isAssertive ? 'alert' : 'status'}
        aria-live={isAssertive ? 'assertive' : 'polite'}
        aria-atomic="true"
        className={cn('alert', tone !== 'neutral' && tone, className)}
        {...rest}
      >
        {/* Leading icon — either caller-supplied or the per-tone default */}
        {hasExplicitIcon ? firstChild : <DefaultIcon tone={tone} />}

        {/* Body slot — wraps all structural sub-components */}
        <div className="alert-body">
          {hasExplicitIcon ? childArray.slice(1) : childArray}
        </div>

        {/* Dismiss button — trailing edge, only when onDismiss is provided */}
        {onDismiss && (
          <button
            type="button"
            className="alert-dismiss"
            aria-label={dismissLabel}
            onClick={onDismiss}
          >
            <Icons.x size={14} aria-hidden="true" />
          </button>
        )}
      </div>
    );
  },
);
Alert.displayName = 'Alert';

// ── AlertTitle ─────────────────────────────────────────────────────────────

export interface AlertTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Alert heading — 13 px Geist 600 (var(--text-sm)), one line, imperative or status. */
  children: React.ReactNode;
  className?: string;
}

export const AlertTitle = React.forwardRef<HTMLDivElement, AlertTitleProps>(
  ({ children, className, ...rest }, ref) => (
    <div ref={ref} className={cn('alert-title', className)} {...rest}>
      {children}
    </div>
  ),
);
AlertTitle.displayName = 'AlertTitle';

// ── AlertDescription ───────────────────────────────────────────────────────

export interface AlertDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Supporting body text — 13 px muted, one sentence. */
  children: React.ReactNode;
  className?: string;
}

export const AlertDescription = React.forwardRef<HTMLDivElement, AlertDescriptionProps>(
  ({ children, className, ...rest }, ref) => (
    <div ref={ref} className={cn('alert-desc', className)} {...rest}>
      {children}
    </div>
  ),
);
AlertDescription.displayName = 'AlertDescription';

// ── AlertMeta ──────────────────────────────────────────────────────────────

export interface AlertMetaProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Inline row beneath the description. Render status pills, request ids,
   * quota counters — anything short and monospace. Wrap monospace strings
   * in `<span className="mono"/>` for the canonical 11 px mono treatment.
   */
  children: React.ReactNode;
  className?: string;
}

export const AlertMeta = React.forwardRef<HTMLDivElement, AlertMetaProps>(
  ({ children, className, ...rest }, ref) => (
    <div ref={ref} className={cn('alert-meta', className)} {...rest}>
      {children}
    </div>
  ),
);
AlertMeta.displayName = 'AlertMeta';

// ── AlertExtra ─────────────────────────────────────────────────────────────

export interface AlertExtraProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Diagnostic slot — drop a Progress bar, a breakdown, a tiny chart, or a
   * code block. Separated from the description by a dashed divider. Pass the
   * same `tone` to any Progress child so the bar inherits the alert tone.
   */
  children: React.ReactNode;
  className?: string;
}

export const AlertExtra = React.forwardRef<HTMLDivElement, AlertExtraProps>(
  ({ children, className, ...rest }, ref) => (
    <div ref={ref} className={cn('alert-extra', className)} {...rest}>
      {children}
    </div>
  ),
);
AlertExtra.displayName = 'AlertExtra';

// ── AlertActions ───────────────────────────────────────────────────────────

export interface AlertActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Row of buttons at the foot of the alert body. Primary action first;
   * secondary next; tertiary link-style actions last.
   */
  children: React.ReactNode;
  className?: string;
}

export const AlertActions = React.forwardRef<HTMLDivElement, AlertActionsProps>(
  ({ children, className, ...rest }, ref) => (
    <div ref={ref} className={cn('alert-actions', className)} {...rest}>
      {children}
    </div>
  ),
);
AlertActions.displayName = 'AlertActions';
