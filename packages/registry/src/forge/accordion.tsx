import * as React from 'react';
import { cn } from '@/lib/utils';

interface AccordionCtx {
  type: 'single' | 'multiple';
  collapsible: boolean;
  openValues: Set<string>;
  toggle: (value: string) => void;
  /** Stable list of registered trigger refs for roving focus */
  triggerRefs: React.MutableRefObject<Map<string, HTMLButtonElement>>;
  itemValues: React.MutableRefObject<string[]>;
}

const AccordionContext = React.createContext<AccordionCtx | null>(null);

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether only one item or multiple items can be open at once. */
  type?: 'single' | 'multiple';
  /**
   * Uncontrolled initial value(s).
   * Pass a string for type="single", string[] for type="multiple".
   */
  defaultValue?: string | string[];
  /**
   * Controlled open value(s).
   * Pass a string for type="single", string[] for type="multiple".
   */
  value?: string | string[];
  /** Fires when the open set changes. */
  onValueChange?: (value: string | string[]) => void;
  /**
   * For type="single" — allow collapsing the currently-open item
   * (clicking its trigger again closes it). Default false.
   */
  collapsible?: boolean;
  /** Visual variant. "ghost" removes the outer border and pads flush. */
  variant?: 'default' | 'ghost';
  children?: React.ReactNode;
  className?: string;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      type = 'single',
      defaultValue,
      value: valueProp,
      onValueChange,
      collapsible = false,
      variant = 'default',
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const isControlled = valueProp !== undefined;

    const [internalOpen, setInternalOpen] = React.useState<Set<string>>(() => {
      if (defaultValue === undefined) return new Set();
      if (Array.isArray(defaultValue)) return new Set(defaultValue);
      return new Set([defaultValue]);
    });

    const openValues = isControlled
      ? (() => {
          if (valueProp === undefined || valueProp === null) return new Set<string>();
          if (Array.isArray(valueProp)) return new Set(valueProp);
          return new Set([valueProp as string]);
        })()
      : internalOpen;

    const triggerRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());
    const itemValues = React.useRef<string[]>([]);

    const toggle = React.useCallback(
      (itemValue: string) => {
        let next: Set<string>;
        if (type === 'single') {
          if (openValues.has(itemValue)) {
            next = collapsible ? new Set() : openValues;
          } else {
            next = new Set([itemValue]);
          }
        } else {
          next = new Set(openValues);
          if (next.has(itemValue)) {
            next.delete(itemValue);
          } else {
            next.add(itemValue);
          }
        }
        if (!isControlled) setInternalOpen(next);
        const arr = Array.from(next);
        onValueChange?.(type === 'single' ? (arr[0] ?? '') : arr);
      },
      [type, collapsible, openValues, isControlled, onValueChange],
    );

    const ctx: AccordionCtx = React.useMemo(
      () => ({ type, collapsible, openValues, toggle, triggerRefs, itemValues }),
      [type, collapsible, openValues, toggle],
    );

    return (
      <AccordionContext.Provider value={ctx}>
        <div
          ref={ref}
          className={cn('acc', variant === 'ghost' && 'ghost', className)}
          {...rest}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  },
);

export { Accordion };
