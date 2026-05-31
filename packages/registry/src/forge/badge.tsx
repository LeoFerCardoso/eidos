import * as React from 'react';
import { cn } from '@/lib/utils';

type BadgeTone = 'neutral' | 'new' | 'ice' | 'success' | 'warning' | 'danger';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
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

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
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

export { Badge };
