import * as React from 'react';

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

interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
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

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
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

export { Tabs };
