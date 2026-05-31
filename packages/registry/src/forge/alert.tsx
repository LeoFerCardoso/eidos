import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/forge/icons';

type AlertTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
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

function DefaultIcon({ tone }: { tone: AlertTone }) {
  switch (tone) {
    case 'success': return <Icons.check size={16} aria-hidden="true" className="alert-icon" />;
    case 'warning': return <Icons.alert size={16} aria-hidden="true" className="alert-icon" />;
    case 'danger':  return <Icons.x     size={16} aria-hidden="true" className="alert-icon" />;
    case 'info':    return <Icons.alert size={16} aria-hidden="true" className="alert-icon" />;
    default:        return <Icons.alert size={16} aria-hidden="true" className="alert-icon" />;
  }
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
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

export { Alert };
