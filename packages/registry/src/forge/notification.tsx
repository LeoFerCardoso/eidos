import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/forge/icons';

interface ToastAction {
  label: string;
  onClick?: () => void;
}

type NotificationTone = 'default' | 'info' | 'success' | 'warning' | 'danger';

interface NotificationProps {
  /** Semantic tone — icon + accent bar colour. */
  tone?: NotificationTone;
  /** Bold heading line. */
  title?: React.ReactNode;
  /** Supporting body text. */
  description?: React.ReactNode;
  /** Optional inline CTA button. */
  action?: ToastAction;
  /** Render a dismiss button. Pass the handler to make it functional. */
  onDismiss?: () => void;
  /** aria-label for the dismiss button. */
  dismissLabel?: string;
  /** Extra classes on the root element. */
  className?: string;
  children?: React.ReactNode;
}

const NTF_ICONS: Record<NotificationTone, React.ComponentType<{ size?: number; className?: string }>> = {
  default: Icons.bell,
  info:    Icons.info,
  success: Icons.check,
  warning: Icons.alert,
  danger:  Icons.x,
};

const Notification = React.forwardRef<HTMLDivElement, NotificationProps>(
  (
    {
      tone = 'default',
      title,
      description,
      action,
      onDismiss,
      dismissLabel = 'Dismiss',
      className,
      children,
    },
    ref,
  ) => {
    const Icon = NTF_ICONS[tone];
    const isAssertive = tone === 'danger' || tone === 'warning';

    return (
      <div
        ref={ref}
        className={cn('ntf', tone !== 'default' && tone, className)}
        role={isAssertive ? 'alert' : 'status'}
        aria-live={isAssertive ? 'assertive' : 'polite'}
        aria-atomic="true"
      >
        <Icon size={16} className="ntf-icon" />
        <div className="ntf-body">
          {title && <div className="ntf-title">{title}</div>}
          {description && <div className="ntf-desc">{description}</div>}
          {children}
        </div>
        {action && (
          <button
            type="button"
            className="ntf-action"
            onClick={action.onClick}
          >
            {action.label}
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            className="ntf-close"
            aria-label={dismissLabel}
            onClick={onDismiss}
          >
            <Icons.x size={14} />
          </button>
        )}
      </div>
    );
  },
);

export { Notification };
