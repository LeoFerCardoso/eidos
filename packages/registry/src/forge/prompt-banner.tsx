import * as React from 'react';
import { Icons } from '@/components/forge/icons';

type PromptBannerTone = 'promo' | 'info' | 'warn' | 'success' | 'danger';

const TONE_ICON: Record<PromptBannerTone, string> = {
  promo:   'sparkle',
  info:    'info',
  warn:    'alert',
  success: 'check',
  danger:  'alert',
};

const PromptBanner = ({
  tone = 'promo',
  icon,
  cta,
  onCtaClick,
  onDismiss,
  children,
}: {
  /** Tints the icon + CTA. Default "promo" (ember). */
  tone?: PromptBannerTone;
  /** Override the tone-default icon. Pass an `Icons.*` name. */
  icon?: string;
  /** Trailing CTA label (rendered ember). Omit for a message-only ribbon. */
  cta?: string;
  /** CTA click handler. */
  onCtaClick?: () => void;
  /** When set, shows a × dismiss button after the CTA. */
  onDismiss?: () => void;
  /** Banner message. */
  children: React.ReactNode;
}) => {
  const iconName = icon || TONE_ICON[tone];
  const IconCmp = (Icons as Record<string, any>)[iconName];
  const toneCls = ' tone-' + tone;
  // Render as a Fragment so the icon / text / CTA / × become direct flex
  // children of the `.pi-banner` slot (no extra wrapper div). Tone is set on
  // each child independently so the icon + CTA can pick up the right tint.
  return (
    <>
      {IconCmp && (
        <span className={'pi-banner-icon' + toneCls} aria-hidden="true">
          <IconCmp size={13}/>
        </span>
      )}
      <span className="pi-banner-text">{children}</span>
      {cta && (
        <button
          type="button"
          className={'pi-banner-cta' + toneCls}
          onClick={onCtaClick}
        >
          {cta}
        </button>
      )}
      {onDismiss && (
        <button
          type="button"
          className="pi-banner-x"
          onClick={onDismiss}
          aria-label="Dismiss banner"
        >
          <Icons.x size={11}/>
        </button>
      )}
    </>
  );
};

export { PromptBanner };
