import * as React from 'react';
import { cn } from '@/lib/utils';

interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Layout axis.
   * - "horizontal" (default): ArrowLeft/Right navigate; ArrowUp/Down are ignored.
   * - "vertical": ArrowUp/Down navigate; ArrowLeft/Right are ignored.
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * When true (default), focus wraps from the last item back to the first and
   * vice versa when using arrow keys.
   */
  loop?: boolean;
  /**
   * Accessible label for the toolbar widget. Required when there is more than
   * one toolbar on the page, or when the purpose is not obvious from context.
   */
  'aria-label'?: string;
  /**
   * ID of an element that labels this toolbar — alternative to aria-label.
   */
  'aria-labelledby'?: string;
  /** Extra utility classes merged via cn(). */
  className?: string;
  children: React.ReactNode;
}

function getFocusableItems(container: HTMLElement): HTMLElement[] {
  const candidates = container.querySelectorAll<HTMLElement>(
    'button:not([disabled]), [role="button"]:not([aria-disabled="true"]), ' +
    'a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), ' +
    '[tabindex]:not([tabindex="-1"]):not([disabled])',
  );
  return Array.from(candidates).filter(
    (el) =>
      !el.closest('[aria-disabled="true"]') &&
      getComputedStyle(el).display !== 'none' &&
      getComputedStyle(el).visibility !== 'hidden',
  );
}

function getDirection(el: HTMLElement): 'ltr' | 'rtl' {
  // Walk ancestors for an explicit [dir] before falling back to computed style.
  let node: HTMLElement | null = el;
  while (node) {
    const dir = node.getAttribute('dir');
    if (dir === 'rtl') return 'rtl';
    if (dir === 'ltr') return 'ltr';
    node = node.parentElement;
  }
  return getComputedStyle(el).direction === 'rtl' ? 'rtl' : 'ltr';
}

const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  (
    {
      orientation = 'horizontal',
      loop = true,
      className,
      children,
      onKeyDown,
      ...rest
    },
    forwardedRef,
  ) => {
    // Internal ref for DOM access — always available.
    const innerRef = React.useRef<HTMLDivElement>(null);

    // Forward the ref to the caller while keeping innerRef for our own use.
    React.useImperativeHandle(forwardedRef, () => innerRef.current as HTMLDivElement);

    // Alias for clarity inside this component.
    const toolbarRef = innerRef;

    // Index of the currently "roving" item (owns tabindex="0").
    const [activeIdx, setActiveIdx] = React.useState(0);

    // Sync tabindex attributes on every render.
    React.useLayoutEffect(() => {
      const container = toolbarRef.current;
      if (!container) return;
      const items = getFocusableItems(container);
      items.forEach((el, i) => {
        el.setAttribute('tabindex', i === activeIdx ? '0' : '-1');
      });
    });

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const container = toolbarRef.current;
      if (!container) return;

      const items = getFocusableItems(container);
      if (!items.length) return;

      const isHorizontal = orientation === 'horizontal';
      const isVertical = orientation === 'vertical';
      const dir = getDirection(container);
      const isRtl = dir === 'rtl';

      // Resolve logical prev/next keys based on orientation and direction.
      let nextKey: string;
      let prevKey: string;

      if (isHorizontal) {
        // In RTL, ArrowRight means "backward" (toward start) — swap keys.
        nextKey = isRtl ? 'ArrowLeft' : 'ArrowRight';
        prevKey = isRtl ? 'ArrowRight' : 'ArrowLeft';
      } else if (isVertical) {
        nextKey = 'ArrowDown';
        prevKey = 'ArrowUp';
      } else {
        onKeyDown?.(e);
        return;
      }

      // Find the index of the currently focused element.
      const focused = document.activeElement as HTMLElement | null;
      const currentIdx = focused ? items.indexOf(focused) : activeIdx;
      const count = items.length;

      let newIdx = currentIdx;

      if (e.key === nextKey) {
        e.preventDefault();
        newIdx = loop
          ? (currentIdx + 1) % count
          : Math.min(currentIdx + 1, count - 1);
      } else if (e.key === prevKey) {
        e.preventDefault();
        newIdx = loop
          ? (currentIdx - 1 + count) % count
          : Math.max(currentIdx - 1, 0);
      } else if (e.key === 'Home') {
        e.preventDefault();
        newIdx = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        newIdx = count - 1;
      } else {
        onKeyDown?.(e);
        return;
      }

      setActiveIdx(newIdx);
      items[newIdx]?.focus();
      onKeyDown?.(e);
    };

    return (
      <div
        ref={innerRef}
        role="toolbar"
        aria-orientation={orientation}
        className={cn('toolbar', className)}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

export { Toolbar };
