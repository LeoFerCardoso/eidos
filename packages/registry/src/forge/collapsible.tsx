import * as React from 'react';
import { cn } from '@/lib/utils';

interface CollapsibleCtx {
  open: boolean;
  toggle: () => void;
  disabled: boolean;
  triggerId: string;
  contentId: string;
}

const CollapsibleContext = React.createContext<CollapsibleCtx | null>(null);

interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Initial open state for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Prevents interaction. The trigger renders as disabled. */
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  (
    {
      open: openProp,
      onOpenChange,
      defaultOpen = false,
      disabled = false,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const isControlled = openProp !== undefined;
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const open = isControlled ? (openProp as boolean) : internalOpen;

    // Stable IDs shared via context so trigger ↔ content wiring always resolves.
    const reactId = React.useId();
    const triggerId = `${reactId}-trigger`;
    const contentId = `${reactId}-content`;

    const toggle = React.useCallback(() => {
      if (disabled) return;
      const next = !open;
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    }, [disabled, open, isControlled, onOpenChange]);

    const ctx: CollapsibleCtx = React.useMemo(
      () => ({ open, toggle, disabled, triggerId, contentId }),
      [open, toggle, disabled, triggerId, contentId],
    );

    return (
      <CollapsibleContext.Provider value={ctx}>
        <div
          ref={ref}
          className={cn('coll-root', className)}
          data-state={open ? 'open' : 'closed'}
          {...rest}
        >
          {children}
        </div>
      </CollapsibleContext.Provider>
    );
  },
);

export { Collapsible };
