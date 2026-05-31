import * as React from 'react';

const Suggestion = ({
  icon,
  children,
  size = 'md',
  pressed,
  onClick,
}: {
  /** Optional 11–13px leading icon. */
  icon?: React.ReactNode;
  /** Label text. Sentence case, up to 8 words. */
  children: React.ReactNode;
  /** Chip size. sm for inline mid-thread; lg for empty state hero rows. */
  size?: 'sm' | 'md' | 'lg';
  /** Locks the ember-soft fill — use for already-picked filters. */
  pressed?: boolean;
  /** Fires when the chip is activated (click or Enter/Space). */
  onClick?: () => void;
}) => (
  <button
    className={'sg ' + (size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : '') + (pressed ? ' is-on' : '')}
    aria-pressed={pressed}
    onClick={onClick}
  >
    {icon && <span className="ico" aria-hidden="true">{icon}</span>}
    <span>{children}</span>
  </button>
);

export { Suggestion };
