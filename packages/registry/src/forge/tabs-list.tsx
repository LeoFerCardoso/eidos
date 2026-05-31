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

interface TabsListProps {
  className?: string;
  children?: React.ReactNode;
  /** Accessible label for the tablist. */
  'aria-label'?: string;
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
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

export { TabsList };
