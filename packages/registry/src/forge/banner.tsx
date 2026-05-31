import * as React from 'react';
import { Icons } from '@/components/forge/icons';

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

export { Banner };
