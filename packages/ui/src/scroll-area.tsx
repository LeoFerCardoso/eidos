import * as React from 'react';
import { cn } from './lib/utils';

// Eidos DS — Scroll Area.
//
// A bounded scrollable region with thin, auto-hiding, themeable scrollbars.
// Uses native browser scroll — no custom scrollbar track/thumb DOM nodes.
// CSS classes live in packages/ui/styles/tokens.css (.sa-* block).
// No <style> block here — emit className strings only.
//
// Keyboard (when focusable=true): Arrow keys scroll by a small step, Page Up/Down
// scroll by one clientHeight, Home/End jump to the start/end of the scroll axis.
// Arrow keys are orientation-aware (vertical axis: Up/Down; horizontal axis:
// Left/Right) and RTL-aware (in RTL ArrowLeft increases scrollLeft, ArrowRight
// decreases it — matching the browser's logical scroll direction convention).
// This is implemented via an explicit onKeyDown rather than relying on browser
// default behaviour, which only works for generic divs in Firefox.
//
// RTL: the browser moves the scrollbar to the inline-start edge automatically
// when dir="rtl" is set on the viewport or an ancestor. No per-element flip
// needed — logical CSS handles the rest.

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ScrollAreaProps {
  /**
   * Which axis can scroll.
   * @default "vertical"
   */
  orientation?: 'vertical' | 'horizontal' | 'both';

  /**
   * When the scrollbar is visible.
   *   - "hover"  — hidden at rest, reveals on pointer-enter / scroll (default)
   *   - "always" — always visible (thin, themed)
   *   - "auto"   — browser-native: appears when content overflows, hides when not
   * @default "hover"
   */
  type?: 'hover' | 'always' | 'auto';

  /**
   * Maximum height of the viewport. Pass a CSS length string ("320px", "50vh").
   * Required for vertical scrolling — if the content is already bounded by a
   * parent, omit this and let the parent constrain height.
   */
  maxHeight?: React.CSSProperties['maxHeight'];

  /**
   * Maximum width of the viewport. Pass a CSS length string.
   * Required for horizontal scrolling.
   */
  maxWidth?: React.CSSProperties['maxWidth'];

  /**
   * Accessible label for the scrollable region. Required when `role="region"` is
   * applied (i.e. when `tabIndex` ≥ 0 or `asRegion` is true).
   * Describe the content: "Event log", "Filter list", etc.
   */
  label?: string;

  /**
   * Force the viewport to accept keyboard focus so Arrow / Page / Home / End
   * keys drive the scroll offset. Set to `false` if children are entirely
   * focusable themselves and scrolling-into-view is sufficient.
   * @default true when content may overflow, false otherwise
   */
  focusable?: boolean;

  /** Extra class names on the viewport element. Merged via cn(). */
  className?: string;

  /** Extra inline styles on the viewport element. */
  style?: React.CSSProperties;

  /** The scrollable content. */
  children: React.ReactNode;

  /** Forward-ref target is the scroll container (the element that actually scrolls). */
  ref?: React.Ref<HTMLDivElement>;
}

// ── Component ─────────────────────────────────────────────────────────────────

// Small step for Arrow key scrolling (matches typical browser line-height).
const ARROW_STEP = 40;

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      orientation = 'vertical',
      type = 'hover',
      maxHeight,
      maxWidth,
      label,
      focusable = true,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    const overflowX =
      orientation === 'horizontal' || orientation === 'both' ? 'auto' : 'hidden';
    const overflowY =
      orientation === 'vertical' || orientation === 'both' ? 'auto' : 'hidden';

    const typeClass =
      type === 'always' ? 'sa-always' : type === 'auto' ? 'sa-auto' : '';

    // aria: if the region is keyboard-focusable it should carry role + label.
    const ariaProps =
      focusable
        ? ({
            role: 'region' as const,
            'aria-label': label,
            tabIndex: 0,
          } as React.HTMLAttributes<HTMLDivElement>)
        : {};

    // ── Keyboard scroll handler ─────────────────────────────────────────────
    // Implements cross-browser Arrow/Page/Home/End scrolling for focusable
    // regions. Generic divs only scroll via keyboard natively in Firefox;
    // this handler makes the behaviour consistent across all browsers.
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const el = e.currentTarget;

        // Resolve reading direction from the nearest [dir] ancestor.
        let isRtl = false;
        let node: HTMLElement | null = el;
        while (node) {
          const d = node.getAttribute('dir');
          if (d === 'rtl') { isRtl = true; break; }
          if (d === 'ltr') break;
          node = node.parentElement;
        }

        const canScrollV = orientation === 'vertical' || orientation === 'both';
        const canScrollH = orientation === 'horizontal' || orientation === 'both';

        switch (e.key) {
          case 'ArrowDown':
            if (!canScrollV) return;
            e.preventDefault();
            el.scrollTop += ARROW_STEP;
            break;
          case 'ArrowUp':
            if (!canScrollV) return;
            e.preventDefault();
            el.scrollTop -= ARROW_STEP;
            break;
          case 'ArrowRight':
            if (!canScrollH) return;
            e.preventDefault();
            // In RTL, ArrowRight moves toward the logical start (less positive scrollLeft).
            el.scrollLeft += isRtl ? -ARROW_STEP : ARROW_STEP;
            break;
          case 'ArrowLeft':
            if (!canScrollH) return;
            e.preventDefault();
            el.scrollLeft += isRtl ? ARROW_STEP : -ARROW_STEP;
            break;
          case 'PageDown':
            if (!canScrollV) return;
            e.preventDefault();
            el.scrollTop += el.clientHeight;
            break;
          case 'PageUp':
            if (!canScrollV) return;
            e.preventDefault();
            el.scrollTop -= el.clientHeight;
            break;
          case 'Home':
            e.preventDefault();
            if (canScrollV) el.scrollTop = 0;
            if (canScrollH) el.scrollLeft = isRtl ? el.scrollWidth : 0;
            break;
          case 'End':
            e.preventDefault();
            if (canScrollV) el.scrollTop = el.scrollHeight;
            if (canScrollH) el.scrollLeft = isRtl ? 0 : el.scrollWidth;
            break;
          default:
            return;
        }
      },
      [orientation],
    );

    const viewportStyle: React.CSSProperties = {
      overflowX,
      overflowY,
      ...(maxHeight !== undefined ? { maxHeight } : {}),
      ...(maxWidth !== undefined ? { maxWidth } : {}),
      ...style,
    };

    return (
      <div
        ref={ref}
        className={cn('sa', typeClass, className)}
        style={viewportStyle}
        {...ariaProps}
        onKeyDown={focusable ? handleKeyDown : undefined}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

ScrollArea.displayName = 'ScrollArea';
