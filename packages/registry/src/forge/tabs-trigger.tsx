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

function useTabsContext(component: string) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error(`<${component}> must be rendered inside <Tabs>`);
  return ctx;
}

interface TabsTriggerProps {
  /** Must match the value prop on the corresponding TabsContent. */
  value: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
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

export { TabsTrigger };
