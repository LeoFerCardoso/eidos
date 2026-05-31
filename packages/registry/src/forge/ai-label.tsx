import * as React from 'react';

const Spark = ({ size = 10 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M 12 1 C 12 6, 18 12, 23 12 C 18 12, 12 18, 12 23 C 12 18, 6 12, 1 12 C 6 12, 12 6, 12 1 Z" fill="currentColor"/>
  </svg>
);

const AILabel = ({
  variant = 'mark',
  size = 'md',
  revoked = false,
  interactive = false,
  onClick,
  children,
  style,
}: {
  /** Visual flavor. box=22px tile, mark=text+sparkle, pill=tinted background, dot=icon-only. */
  variant?: 'box' | 'mark' | 'pill' | 'dot';
  /** Scale. sm=18px, md=22px, lg=28px. */
  size?: 'sm' | 'md' | 'lg';
  /** When true, renders strikethrough + muted color to flag rejected AI output. */
  revoked?: boolean;
  /** Renders as a button with focus ring + keyboard support. Pair with onClick. */
  interactive?: boolean;
  /** Fires on click/Enter/Space when interactive=true. */
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
  /** Text label. Defaults to "AI"; pass any short token (Beta, ML, GPT) if needed. */
  children?: React.ReactNode;
  /** Inline styles merged onto the root span. */
  style?: React.CSSProperties;
}) => {
  const text = children || 'AI';

  const cls = ['ai-label', variant];
  if (size !== 'md') cls.push(size);
  if (revoked) cls.push('revoked');
  if (interactive) cls.push('is-trigger');

  const onKey = interactive
    ? (e: React.KeyboardEvent<HTMLSpanElement>) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (onClick) onClick(e as unknown as React.MouseEvent<HTMLSpanElement>); } }
    : undefined;

  return (
    <span
      className={cls.join(' ')}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onKey}
      aria-label={interactive ? 'AI-generated content — view source' : 'AI-generated content'}
      style={style}
    >
      <span className="ai-glyph"><Spark/></span>
      <span className="ai-text">{text}</span>
    </span>
  );
};

export { AILabel };
