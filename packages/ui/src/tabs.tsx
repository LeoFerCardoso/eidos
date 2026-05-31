'use client';
/**
 * Forge DS — Compound Tabs
 *
 * Exports: Tabs · TabsList · TabsTrigger · TabsContent
 *
 * Features
 * - Controlled (value/onValueChange) + uncontrolled (defaultValue)
 * - orientation: horizontal | vertical
 * - variant: line | pills | enclosed
 * - size: sm | md
 * - manualActivation: true → arrow keys focus only (not activate)
 * - Full ARIA: tablist/tab/tabpanel + aria-selected + aria-controls + aria-labelledby
 * - Roving tabindex: only the active tab is in the tab stop
 * - Keyboard: ArrowLeft/Right (or Up/Down vertical), Home, End; skip disabled
 * - RTL: directional arrow keys mirror automatically
 * - prefers-reduced-motion: transitions disabled
 */
import * as React from 'react';

// ── Context ──────────────────────────────────────────────────────────────────

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  orientation: 'horizontal' | 'vertical';
  variant: 'line' | 'pills' | 'enclosed';
  size: 'sm' | 'md';
  manualActivation: boolean;
  /** id prefix — all ids are `${uid}-tab-${value}` / `${uid}-panel-${value}` */
  uid: string;
  /** ordered list of trigger values (registered in DOM order by TabsTrigger) */
  registerTrigger: (value: string, disabled: boolean) => void;
  unregisterTrigger: (value: string) => void;
  triggerList: React.MutableRefObject<{ value: string; disabled: boolean }[]>;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext(component: string) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error(`<${component}> must be rendered inside <Tabs>`);
  return ctx;
}

// ── Tabs (root) ──────────────────────────────────────────────────────────────

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Initial active value (uncontrolled). */
  defaultValue?: string;
  /** Controlled active value. Pair with onValueChange. */
  value?: string;
  /** Fires on tab change. */
  onValueChange?: (value: string) => void;
  /** Tablist orientation. Affects arrow-key direction. */
  orientation?: 'horizontal' | 'vertical';
  /** Visual flavor. */
  variant?: 'line' | 'pills' | 'enclosed';
  /** Trigger size. */
  size?: 'sm' | 'md';
  /**
   * When true, arrow keys only move focus — the user must press Space/Enter
   * to activate. Default false (automatic activation on focus move).
   */
  manualActivation?: boolean;
}

let uidCounter = 0;

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      defaultValue,
      value: controlledValue,
      onValueChange,
      orientation = 'horizontal',
      variant = 'line',
      size = 'md',
      manualActivation = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const [uid] = React.useState(() => `forge-tabs-${++uidCounter}`);
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');
    const isControlled = controlledValue !== undefined;
    const activeValue = isControlled ? controlledValue : internalValue;

    const handleChange = React.useCallback(
      (v: string) => {
        if (!isControlled) setInternalValue(v);
        onValueChange?.(v);
      },
      [isControlled, onValueChange],
    );

    // Ordered trigger registry — kept in a ref so registration doesn't cause
    // re-renders; read synchronously on keyboard events.
    const triggerList = React.useRef<{ value: string; disabled: boolean }[]>([]);

    const registerTrigger = React.useCallback((v: string, disabled: boolean) => {
      const existing = triggerList.current.findIndex((t) => t.value === v);
      if (existing >= 0) {
        triggerList.current[existing].disabled = disabled;
      } else {
        triggerList.current.push({ value: v, disabled });
      }
    }, []);

    const unregisterTrigger = React.useCallback((v: string) => {
      triggerList.current = triggerList.current.filter((t) => t.value !== v);
    }, []);

    const ctx: TabsContextValue = React.useMemo(
      () => ({
        value: activeValue,
        onValueChange: handleChange,
        orientation,
        variant,
        size,
        manualActivation,
        uid,
        registerTrigger,
        unregisterTrigger,
        triggerList,
      }),
      [activeValue, handleChange, orientation, variant, size, manualActivation, uid, registerTrigger, unregisterTrigger],
    );

    const classes = [
      'forge-tabs',
      orientation === 'vertical' ? 'forge-tabs--vertical' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <TabsContext.Provider value={ctx}>
        <div ref={ref} className={classes} {...rest}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  },
);
Tabs.displayName = 'Tabs';

// ── TabsList ─────────────────────────────────────────────────────────────────

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Accessible label for the tablist. */
  'aria-label'?: string;
}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, 'aria-label': ariaLabel, ...rest }, ref) => {
    const { orientation, variant } = useTabsContext('TabsList');

    const classes = [
      'forge-tablist',
      `forge-tablist--${variant}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        role="tablist"
        aria-orientation={orientation}
        aria-label={ariaLabel}
        className={classes}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
TabsList.displayName = 'TabsList';

// ── TabsTrigger ───────────────────────────────────────────────────────────────

export interface TabsTriggerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  /** Must match the value prop on the corresponding TabsContent. */
  value: string;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, disabled = false, className, children, ...rest }, ref) => {
    const {
      value: activeValue,
      onValueChange,
      orientation,
      size,
      manualActivation,
      uid,
      registerTrigger,
      unregisterTrigger,
      triggerList,
    } = useTabsContext('TabsTrigger');

    const isSelected = activeValue === value;

    // Register into the ordered list so keyboard nav can find siblings.
    React.useEffect(() => {
      registerTrigger(value, disabled);
      return () => unregisterTrigger(value);
    }, [value, disabled, registerTrigger, unregisterTrigger]);

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLButtonElement>) => {
        const list = triggerList.current.filter((t) => !t.disabled);
        const currentIdx = list.findIndex((t) => t.value === value);
        if (currentIdx < 0) return;

        // Directional keys depend on orientation AND reading direction.
        const isRtl =
          (e.currentTarget.closest('[dir="rtl"]') !== null) ||
          document.documentElement.dir === 'rtl';

        const isHorizontal = orientation === 'horizontal';

        // Next / prev key detection accounting for RTL flip
        const nextKey = isHorizontal
          ? isRtl
            ? 'ArrowLeft'
            : 'ArrowRight'
          : 'ArrowDown';
        const prevKey = isHorizontal
          ? isRtl
            ? 'ArrowRight'
            : 'ArrowLeft'
          : 'ArrowUp';

        let targetIdx: number | null = null;

        if (e.key === nextKey) {
          e.preventDefault();
          targetIdx = (currentIdx + 1) % list.length;
        } else if (e.key === prevKey) {
          e.preventDefault();
          targetIdx = (currentIdx - 1 + list.length) % list.length;
        } else if (e.key === 'Home') {
          e.preventDefault();
          targetIdx = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          targetIdx = list.length - 1;
        }

        if (targetIdx !== null) {
          const target = list[targetIdx];
          // Focus the target button via its id
          const el = document.getElementById(`${uid}-tab-${target.value}`) as HTMLButtonElement | null;
          el?.focus();
          if (!manualActivation) {
            onValueChange(target.value);
          }
        }
      },
      [triggerList, value, orientation, uid, manualActivation, onValueChange],
    );

    const classes = [
      'forge-tab',
      size === 'sm' ? 'forge-tab--sm' : '',
      isSelected ? 'forge-tab--active' : '',
      disabled ? 'forge-tab--disabled' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        id={`${uid}-tab-${value}`}
        type="button"
        role="tab"
        aria-selected={isSelected}
        aria-controls={`${uid}-panel-${value}`}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        tabIndex={isSelected ? 0 : -1}
        className={classes}
        onClick={() => !disabled && onValueChange(value)}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
TabsTrigger.displayName = 'TabsTrigger';

// ── TabsContent ───────────────────────────────────────────────────────────────

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Must match the value prop on the corresponding TabsTrigger. */
  value: string;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, className, children, ...rest }, ref) => {
    const { value: activeValue, uid } = useTabsContext('TabsContent');
    const isActive = activeValue === value;

    const classes = ['forge-tabpanel', className].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        id={`${uid}-panel-${value}`}
        role="tabpanel"
        aria-labelledby={`${uid}-tab-${value}`}
        hidden={!isActive}
        tabIndex={isActive ? 0 : -1}
        className={classes}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
TabsContent.displayName = 'TabsContent';
