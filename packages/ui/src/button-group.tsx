import * as React from 'react';
import { cn } from './lib/utils';

// ═══════════════════════════════════════════════════════════════════════════
// ButtonGroup — visually joined cluster of buttons
//
// Collapses the seam between adjacent buttons: inner borders become a single
// hairline, outer corners carry the shared radius. This is a layout/grouping
// primitive only — it does NOT manage selection state. For single-select or
// multi-select toggle behaviour use ToggleGroup instead.
//
// CSS lives in packages/ui/styles/tokens.css (.btn-group block).
// No <style> block — only className strings.
//
// RTL: border-inline-start collapsing and border-radius logical props in
// tokens.css automatically mirror the layout for dir="rtl" contexts.
// ═══════════════════════════════════════════════════════════════════════════

export type ButtonGroupSize = 'sm' | 'md' | 'lg';
export type ButtonGroupOrientation = 'horizontal' | 'vertical';

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
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

/**
 * ButtonGroup — wrap related action buttons so they share a border and read
 * as one composite control. Each child remains an independent focusable
 * button; Tab/Shift+Tab steps through all segments.
 *
 * Do NOT use ButtonGroup for selection. For that, reach for ToggleGroup.
 */
export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
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

ButtonGroup.displayName = 'ButtonGroup';
