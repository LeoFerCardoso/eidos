import * as React from 'react';
import { cn } from '@/lib/utils';

type CardVariant = 'outline' | 'elevated' | 'ghost';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Visual style.
   * - `outline`  — bordered surface (default). Use for forms, settings, content blocks.
   * - `elevated` — shadowlifted, no border. Use for tiles on flat canvas.
   * - `ghost`    — transparent, no border. Use for grouped items inside an already-bounded region.
   */
  variant?: CardVariant;
  /**
   * Tighter padding for grid lists and stat tiles.
   */
  compact?: boolean;
  /**
   * Adds hover lift + cursor:pointer. Apply when the whole card is interactive
   * (the Card renders as-is; wrap it in an `<a>` or give `onClick` + role="button").
   * Do NOT nest separate focusable controls inside an interactive card.
   */
  interactive?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'outline',
      compact = false,
      interactive = false,
      children,
      className,
      ...rest
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        'card-x',
        variant !== 'outline' && variant,
        compact && 'compact',
        interactive && 'interactive',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  ),
);

export { Card };
