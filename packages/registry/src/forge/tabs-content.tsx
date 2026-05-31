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

interface TabsContentProps {
  /** Must match the value prop on the corresponding TabsTrigger. */
  value: string;
  className?: string;
  children?: React.ReactNode;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
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

export { TabsContent };
