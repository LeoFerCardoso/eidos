import * as React from 'react';
import { cn } from '@/lib/utils';

interface SeparatorProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Layout direction.
   * Vertical needs a sized flex-row parent (the element stretches to row height).
   * @default "horizontal"
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Render as a solid hairline (default) or dashed for softer, non-structural breaks.
   * @default "solid"
   */
  variant?: 'solid' | 'dashed';
  /**
   * When true the separator is purely decorative — hidden from assistive tech
   * (aria-hidden="true", no role).
   * When false the separator carries structural meaning: role="separator" and
   * aria-orientation are set so screen readers announce the boundary.
   * @default true
   */
  decorative?: boolean;
  /** Extra utility classes merged via cn(). */
  className?: string;
}

const Separator = React.forwardRef<HTMLElement, SeparatorProps>(
  (
    {
      orientation = 'horizontal',
      variant = 'solid',
      decorative = true,
      className,
      ...rest
    },
    ref,
  ) => {
    // Horizontal: render as <hr> (semantic default for a horizontal rule).
    // Vertical: render as <span> (a non-phrasing-content element suits inline row use).
    const Tag = orientation === 'horizontal' ? 'hr' : 'span';

    const ariaProps: React.AriaAttributes & { role?: string } = decorative
      ? { 'aria-hidden': 'true' as const }
      : {
          role: 'separator',
          'aria-orientation': orientation,
        };

    return (
      <Tag
        ref={ref as React.Ref<HTMLHRElement & HTMLSpanElement>}
        className={cn(
          'separator',
          orientation,
          variant === 'dashed' && 'dashed',
          className,
        )}
        {...ariaProps}
        {...rest}
      />
    );
  },
);

export { Separator };
