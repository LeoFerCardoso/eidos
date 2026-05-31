import * as React from 'react';
import { cn } from '@/lib/utils';

type ButtonGroupSize = 'sm' | 'md' | 'lg';

type ButtonGroupOrientation = 'horizontal' | 'vertical';

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Passed down to every direct child button via a CSS modifier class so each
   * button can size itself consistently without props drilling.
   * Defaults to "md".
   */
  size?: ButtonGroupSize;
  /**
   * Flow direction of the segments.
   * - horizontal (default): left-to-right row; inner side borders collapse.
   * - vertical: top-to-bottom column; inner top/bottom borders collapse.
   */
  orientation?: ButtonGroupOrientation;
  /**
   * Accessible label for the group. Required when the group's purpose is not
   * already conveyed by surrounding context (e.g. standalone toolbar groups).
   */
  'aria-label'?: string;
  /** Extra utility classes merged via cn(). */
  className?: string;
  /** Button (or asChild-wrapped link) elements. */
  children: React.ReactNode;
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      size = 'md',
      orientation = 'horizontal',
      className,
      children,
      role = 'group',
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        role={role}
        className={cn(
          'btn-group',
          orientation === 'vertical' && 'vertical',
          size !== 'md' && `bg-size-${size}`,
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

export { ButtonGroup };
