import * as React from 'react';
import { cn } from './lib/utils';

// Eidos DS — Toolbar
//
// A single-tab-stop row of controls (buttons, toggle buttons, groups, separators)
// with roving tabindex and full ARIA toolbar keyboard model.
//
// Keyboard contract:
//   ArrowRight/ArrowLeft (horizontal) or ArrowDown/ArrowUp (vertical):
//     Move focus to the next/previous focusable control, skipping disabled ones.
//   Home / End: jump to first / last focusable control.
//   Enter / Space: activate the currently focused control (native button behaviour).
//   Tab: leave the toolbar entirely (next/previous Tab stop in the page).
//
// RTL: arrow direction flips — ArrowRight moves "forward" (toward the end in
//   reading direction) and ArrowLeft moves "backward". Computed from the toolbar
//   element's computed direction or an ancestor [dir] attribute.
//
// CSS classes: .toolbar  .toolbar-sep  — defined in packages/ui/styles/tokens.css.
// No <style> block here — emit className strings only.

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
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

export interface ToolbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Whether this button behaves as a toggle. When true the button exposes
   * aria-pressed and can be styled with the pressed variant.
   */
  pressed?: boolean;
  /**
   * Called when the button is activated in toggle mode.
   * Receives the new pressed state.
   */
  onPressedChange?: (pressed: boolean) => void;
  /** Extra utility classes merged via cn(). */
  className?: string;
  children: React.ReactNode;
}

export interface ToolbarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Extra utility classes merged via cn(). */
  className?: string;
  children: React.ReactNode;
}

export interface ToolbarSeparatorProps {
  /** Extra utility classes merged via cn(). */
  className?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Collect all non-disabled focusable interactive elements inside the toolbar. */
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

/** Read the effective text direction of an element. */
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

// ── Toolbar ────────────────────────────────────────────────────────────────────

/**
 * Toolbar — a single-tab-stop container of action controls.
 *
 * Implements the WAI-ARIA Toolbar Pattern:
 *   https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
 *
 * - role="toolbar" with aria-orientation.
 * - Roving tabindex: only ONE child has tabindex="0" at a time; the rest are
 *   tabindex="-1". Arrow keys move focus within the bar.
 * - Focus wraps (configurable via `loop`).
 * - Skips disabled controls automatically.
 */
export const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
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
Toolbar.displayName = 'Toolbar';

// ── ToolbarButton ─────────────────────────────────────────────────────────────

/**
 * ToolbarButton — a single action or toggle inside a Toolbar.
 *
 * In toggle mode (`pressed` prop): exposes aria-pressed and calls
 * onPressedChange when clicked.
 *
 * Always rendered as a native <button> for consistent keyboard + AT support.
 * The tabindex is managed by the parent Toolbar roving-focus logic.
 */
export const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  (
    {
      pressed,
      onPressedChange,
      className,
      children,
      onClick,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const isToggle = pressed !== undefined;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isToggle && !disabled) {
        onPressedChange?.(!pressed);
      }
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'btn icon ghost',
          isToggle && pressed && 'is-pressed',
          className,
        )}
        aria-pressed={isToggle ? pressed : undefined}
        disabled={disabled}
        onClick={handleClick}
        // tabindex managed by Toolbar; default to -1 (Toolbar resets on layout)
        tabIndex={-1}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
ToolbarButton.displayName = 'ToolbarButton';

// ── ToolbarGroup ──────────────────────────────────────────────────────────────

/**
 * ToolbarGroup — a visually-connected cluster of ToolbarButtons.
 *
 * Renders as a .btn-group div; items share borders and have no inter-item gap.
 * Groups are purely visual — they do not affect the roving tabindex order.
 */
export const ToolbarGroup = React.forwardRef<HTMLDivElement, ToolbarGroupProps>(
  ({ className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn('btn-group', className)}
      {...rest}
    >
      {children}
    </div>
  ),
);
ToolbarGroup.displayName = 'ToolbarGroup';

// ── ToolbarSeparator ──────────────────────────────────────────────────────────

/**
 * ToolbarSeparator — a 1-px hairline that visually separates toolbar clusters.
 *
 * Renders as a <span> with role="separator" and aria-orientation="vertical"
 * so screen readers announce it as a structural boundary between groups.
 *
 * CSS: .toolbar-sep — defined in packages/ui/styles/tokens.css.
 */
export const ToolbarSeparator = React.forwardRef<HTMLSpanElement, ToolbarSeparatorProps & React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...rest }, ref) => (
    <span
      ref={ref}
      role="separator"
      aria-orientation="vertical"
      className={cn('toolbar-sep', className)}
      {...rest}
    />
  ),
);
ToolbarSeparator.displayName = 'ToolbarSeparator';
