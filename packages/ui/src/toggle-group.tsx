import * as React from 'react';
import { cn } from './lib/utils';

// ═══════════════════════════════════════════════════════════════════════════
// ToggleGroup — segmented control with single-select (radiogroup) or
// multi-select (group of toggle buttons) semantics.
//
// ARIA model:
//   type="single"   → role="radiogroup" on the wrapper; items are
//                     role="radio" + aria-checked
//   type="multiple" → role="group" on the wrapper; items are
//                     role="button" + aria-pressed (toggle buttons)
//
// Keyboard (single mode — roving tabindex):
//   Tab          → one stop for the whole group (the active/first item owns tabIndex=0)
//   ArrowRight/Down → move focus + select next enabled item (wraps, skips disabled)
//   ArrowLeft/Up    → move focus + select previous enabled item (wraps, skips disabled)
//   Home         → focus + select first enabled item
//   End          → focus + select last enabled item
//
// Keyboard (multiple mode — standard tabindex):
//   Tab          → each item is its own tab stop
//   Space/Enter  → toggles the focused item
//
// CSS lives in packages/ui/styles/ds.css (.tg / .tg-btn block).
// No <style> here — only className strings.
// ═══════════════════════════════════════════════════════════════════════════

// ── Context ──────────────────────────────────────────────────────────────────

interface ToggleGroupCtx {
  type: 'single' | 'multiple';
  value: string | string[] | null | undefined;
  onItemChange: (v: string) => void;
  variant: 'default' | 'outline';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  // roving tabindex support
  focusedValue: string | null;
  setFocusedValue: (v: string | null) => void;
  itemValues: React.MutableRefObject<string[]>;
  // tracks per-item disabled state for keyboard nav
  disabledValues: React.MutableRefObject<Set<string>>;
}

const ToggleGroupContext = React.createContext<ToggleGroupCtx | null>(null);

function useToggleGroupCtx(): ToggleGroupCtx {
  const ctx = React.useContext(ToggleGroupContext);
  if (!ctx) throw new Error('<ToggleGroupItem> must be used inside <ToggleGroup>');
  return ctx;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ToggleGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Selection model.
   * "single"   → radio-group semantics, one-or-none active at a time.
   * "multiple" → independent toggle buttons, any combination active.
   */
  type: 'single' | 'multiple';
  /** Controlled value — string for single, string[] for multiple. */
  value?: string | string[] | null;
  /** Called when the user changes the selection. */
  onValueChange?: (value: string | string[] | null) => void;
  /** Uncontrolled initial value. */
  defaultValue?: string | string[];
  /** Visual variant. */
  variant?: 'default' | 'outline';
  /** Segment height — 24 / 30 / 36 px. */
  size?: 'sm' | 'md' | 'lg';
  /** Layout direction. */
  orientation?: 'horizontal' | 'vertical';
  /** Disables all items at once. */
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

// ── ToggleGroup ───────────────────────────────────────────────────────────────

export const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  (
    {
      type,
      value: valueProp,
      onValueChange,
      defaultValue,
      variant = 'default',
      size = 'md',
      orientation = 'horizontal',
      disabled = false,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const isControlled = valueProp !== undefined;
    const [internalValue, setInternalValue] = React.useState<
      string | string[] | null
    >(defaultValue ?? (type === 'multiple' ? [] : null));

    const value = isControlled ? valueProp : internalValue;

    // Roving tabindex: which item currently owns tabIndex=0.
    const [focusedValue, setFocusedValue] = React.useState<string | null>(null);

    // Registry of rendered item values (in DOM order), populated by each
    // ToggleGroupItem during its first render.
    const itemValues = React.useRef<string[]>([]);

    // Registry of which item values are currently disabled (group-level or
    // item-level). Used by the keyboard handler to skip disabled items.
    const disabledValues = React.useRef<Set<string>>(new Set());

    const onItemChange = React.useCallback(
      (v: string) => {
        // Never commit a disabled value.
        if (disabledValues.current.has(v) || disabled) return;
        let next: string | string[] | null;
        if (type === 'multiple') {
          const cur = Array.isArray(value) ? value : [];
          next = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v];
        } else {
          next = (value as string | null) === v ? null : v;
        }
        if (!isControlled) setInternalValue(next);
        onValueChange?.(next);
      },
      [type, value, isControlled, onValueChange, disabled],
    );

    // ── Roving tabindex keyboard handler (single mode only) ─────────────────
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (type !== 'single') return;

        const items = itemValues.current;
        if (!items.length) return;

        const isVertical = orientation === 'vertical';
        const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';
        const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';

        const currentIdx = focusedValue !== null ? items.indexOf(focusedValue) : 0;

        // Helper: walk the item array in direction (+1 or -1), wrapping, and
        // return the first index whose value is NOT disabled. Returns null if
        // all items are disabled (safety valve).
        const nextEnabledIdx = (startIdx: number, dir: 1 | -1): number | null => {
          const len = items.length;
          for (let step = 1; step <= len; step++) {
            const candidate = ((startIdx + dir * step) % len + len) % len;
            if (!disabledValues.current.has(items[candidate])) return candidate;
          }
          return null;
        };

        const firstEnabledIdx = (): number | null => {
          const idx = items.findIndex((v) => !disabledValues.current.has(v));
          return idx === -1 ? null : idx;
        };

        const lastEnabledIdx = (): number | null => {
          let idx = -1;
          for (let i = items.length - 1; i >= 0; i--) {
            if (!disabledValues.current.has(items[i])) { idx = i; break; }
          }
          return idx === -1 ? null : idx;
        };

        let targetIdx: number | null = null;

        if (e.key === nextKey) {
          e.preventDefault();
          targetIdx = nextEnabledIdx(currentIdx, 1);
        } else if (e.key === prevKey) {
          e.preventDefault();
          targetIdx = nextEnabledIdx(currentIdx, -1);
        } else if (e.key === 'Home') {
          e.preventDefault();
          targetIdx = firstEnabledIdx();
        } else if (e.key === 'End') {
          e.preventDefault();
          targetIdx = lastEnabledIdx();
        }

        if (targetIdx !== null) {
          const targetValue = items[targetIdx];
          setFocusedValue(targetValue);
          // Focus the button
          const groupEl = (e.currentTarget as HTMLDivElement);
          const btn = groupEl.querySelector<HTMLButtonElement>(
            `[data-tg-value="${CSS.escape(targetValue)}"]`,
          );
          btn?.focus();
          // single mode: move+select (like a native radiogroup), but only for enabled items
          onItemChange(targetValue);
        }
      },
      [type, orientation, focusedValue, onItemChange],
    );

    const cls = cn(
      'tg',
      variant === 'outline' && 'outline',
      size !== 'md' && size,
      orientation === 'vertical' && 'vertical',
      className,
    );

    return (
      <ToggleGroupContext.Provider
        value={{
          type,
          value,
          onItemChange,
          variant,
          size,
          disabled,
          focusedValue,
          setFocusedValue,
          itemValues,
          disabledValues,
        }}
      >
        <div
          ref={ref}
          className={cls}
          role={type === 'single' ? 'radiogroup' : 'group'}
          aria-orientation={orientation}
          onKeyDown={handleKeyDown}
          {...rest}
        >
          {children}
        </div>
      </ToggleGroupContext.Provider>
    );
  },
);
ToggleGroup.displayName = 'ToggleGroup';

// ── ToggleGroupItem ──────────────────────────────────────────────────────────

export interface ToggleGroupItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Value committed to the parent when this item is on. */
  value: string;
  /** Disables this item only (overrides group-level disabled). */
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const ToggleGroupItem = React.forwardRef<
  HTMLButtonElement,
  ToggleGroupItemProps
>(({ value, disabled: itemDisabled, children, className, ...rest }, ref) => {
  const ctx = useToggleGroupCtx();
  const {
    type,
    value: groupValue,
    onItemChange,
    disabled: groupDisabled,
    focusedValue,
    setFocusedValue,
    itemValues,
    disabledValues,
  } = ctx;

  const isDisabled = groupDisabled || itemDisabled;

  // Register value in DOM order. Separately track disabled state so the
  // keyboard handler can skip disabled items without querying the DOM.
  React.useEffect(() => {
    if (!itemValues.current.includes(value)) {
      itemValues.current = [...itemValues.current, value];
    }
    return () => {
      itemValues.current = itemValues.current.filter((v) => v !== value);
    };
  }, [value, itemValues]);

  React.useEffect(() => {
    if (isDisabled) {
      disabledValues.current.add(value);
    } else {
      disabledValues.current.delete(value);
    }
    return () => {
      disabledValues.current.delete(value);
    };
  }, [value, isDisabled, disabledValues]);

  const isOn =
    type === 'multiple'
      ? Array.isArray(groupValue) && groupValue.includes(value)
      : groupValue === value;

  // Roving tabindex for single mode; every item is a stop in multiple mode.
  let tabIndex: number;
  if (type === 'single') {
    // The focused item owns 0; if nothing is focused, the active item owns 0;
    // if nothing is active, the first item will own 0 (handled by the first
    // render having an empty focusedValue and the group reading isOn).
    if (focusedValue !== null) {
      tabIndex = focusedValue === value ? 0 : -1;
    } else {
      // fall back to the active (pressed) item; if none, first item in registry
      const firstValue = itemValues.current[0] ?? value;
      tabIndex = isOn || (!groupValue && value === firstValue) ? 0 : -1;
    }
  } else {
    tabIndex = isDisabled ? -1 : 0;
  }

  const handleClick = () => {
    if (isDisabled) return;
    if (type === 'single') setFocusedValue(value);
    onItemChange(value);
  };

  // Multiple mode: Space/Enter toggle (buttons handle Enter natively;
  // we also handle Space so it doesn't scroll the page when focused).
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (type === 'multiple' && (e.key === ' ' || e.key === 'Enter')) {
      e.preventDefault();
      handleClick();
    }
    rest.onKeyDown?.(e);
  };

  const isIconOnly = !children || (typeof children === 'object' && React.Children.count(children) === 1);

  const btnCls = cn(
    'tg-btn',
    isOn && 'is-active',
    isDisabled && 'is-disabled',
    className,
  );

  // ARIA attributes differ by type
  const ariaProps =
    type === 'single'
      ? ({ role: 'radio', 'aria-checked': isOn } as const)
      : ({ role: 'button', 'aria-pressed': isOn } as const);

  return (
    <button
      ref={ref}
      type="button"
      className={btnCls}
      disabled={isDisabled}
      tabIndex={tabIndex}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={() => type === 'single' && setFocusedValue(value)}
      data-tg-value={value}
      {...ariaProps}
      {...rest}
    >
      {children}
    </button>
  );
});
ToggleGroupItem.displayName = 'ToggleGroupItem';
