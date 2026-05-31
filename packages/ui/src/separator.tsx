import * as React from 'react';
import { cn } from './lib/utils';

// Forge DS — Separator
//
// A 1-px hairline divider. Supports horizontal and vertical orientation,
// solid and dashed variants, and decorative vs semantic usage.
//
// Decorative (default): aria-hidden="true", no role — purely visual.
// Semantic: role="separator" + aria-orientation for screen readers.
//
// CSS classes: .separator, .separator.horizontal, .separator.vertical,
//              .separator.dashed — defined in packages/ui/styles/tokens.css.
// No <style> block here — emit className strings only.

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SeparatorProps extends React.HTMLAttributes<HTMLElement> {
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

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Separator — 1-px hairline that groups content into bands.
 *
 * Use as a horizontal `<hr>` between stacked sections, or as an inline
 * `<span>` between siblings in a flex row (toolbar, stat row, breadcrumb).
 *
 * Accessibility:
 *  - decorative={true}  → aria-hidden, no tab stop, not announced.
 *  - decorative={false} → role="separator" + aria-orientation, announced by
 *    screen readers as a structural boundary.
 *  - Never interactive — never in the tab order.
 */
export const Separator = React.forwardRef<HTMLElement, SeparatorProps>(
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
Separator.displayName = 'Separator';
