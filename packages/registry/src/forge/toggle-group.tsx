import * as React from 'react';
import { cn } from '@/lib/utils';

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

interface ToggleGroupProps extends React.HTMLAttributes<HTMLDivElement> {
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

const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
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

export { ToggleGroup };
