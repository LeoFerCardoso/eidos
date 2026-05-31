import * as React from 'react';
import { cn } from './lib/utils';
import { Icons } from './icons';

// Eidos DS — Accordion
//
// Compound API: <Accordion> wraps <AccordionItem value>, which wraps
// <AccordionTrigger> and <AccordionContent>.
//
// Controlled (value/onValueChange) + uncontrolled (defaultValue).
// type="single" allows one item open at a time (+ collapsible to allow toggling closed).
// type="multiple" allows any combination.
//
// Keyboard: ArrowDown/Up between triggers, Home/End first/last, Enter/Space toggle.
// ARIA: trigger is a <button> with aria-expanded + aria-controls; panel is
//       role="region" with aria-labelledby back to its trigger.
//
// CSS lives in packages/ui/styles/tokens.css (.acc-* block).
// No <style> block here — className strings only.

// ── Context ──────────────────────────────────────────────────────────────────

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

function useAccordion(): AccordionCtx {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) throw new Error('<AccordionItem> must be inside <Accordion>');
  return ctx;
}

// ── ItemContext — carries the item value + heading id down to Trigger/Content ─

interface ItemCtx {
  value: string;
  triggerId: string;
  panelId: string;
}

const ItemContext = React.createContext<ItemCtx | null>(null);

function useItem(): ItemCtx {
  const ctx = React.useContext(ItemContext);
  if (!ctx) throw new Error('<AccordionTrigger> / <AccordionContent> must be inside <AccordionItem>');
  return ctx;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
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

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Unique value identifying this item in the accordion. */
  value: string;
  children?: React.ReactNode;
  className?: string;
}

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
}

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

// ── Accordion root ────────────────────────────────────────────────────────────

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
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
Accordion.displayName = 'Accordion';

// ── AccordionItem ─────────────────────────────────────────────────────────────

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, children, className, ...rest }, ref) => {
    const prefix = React.useId();
    const triggerId = `${prefix}-trigger`;
    const panelId = `${prefix}-panel`;

    // Register this item's value for roving tabindex ordering.
    const { itemValues } = useAccordion();
    React.useEffect(() => {
      if (!itemValues.current.includes(value)) {
        itemValues.current.push(value);
      }
      return () => {
        itemValues.current = itemValues.current.filter((v) => v !== value);
      };
    }, [value, itemValues]);

    const itemCtx: ItemCtx = React.useMemo(
      () => ({ value, triggerId, panelId }),
      [value, triggerId, panelId],
    );

    return (
      <ItemContext.Provider value={itemCtx}>
        <div ref={ref} className={cn('acc-row', className)} {...rest}>
          {children}
        </div>
      </ItemContext.Provider>
    );
  },
);
AccordionItem.displayName = 'AccordionItem';

// ── AccordionTrigger ──────────────────────────────────────────────────────────

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, className, onClick, onKeyDown, ...rest }, ref) => {
    const { openValues, toggle, triggerRefs, itemValues } = useAccordion();
    const { value, triggerId, panelId } = useItem();

    const isOpen = openValues.has(value);

    // Register this trigger element for roving focus management.
    const internalRef = React.useRef<HTMLButtonElement>(null);
    const mergedRef = useMergedRef(ref, internalRef);

    React.useEffect(() => {
      if (internalRef.current) {
        triggerRefs.current.set(value, internalRef.current);
      }
      return () => {
        triggerRefs.current.delete(value);
      };
    }, [value, triggerRefs]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      toggle(value);
      onClick?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      // Derive order from DOM position at keydown time (compareDocumentPosition)
      // so ArrowUp/Down always match visual order regardless of registration order.
      const allTriggers = Array.from(triggerRefs.current.values()).filter(
        (el): el is HTMLButtonElement => !!el && !el.disabled,
      );
      allTriggers.sort((a, b) =>
        a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
      );
      const orderedTriggers = allTriggers;

      const currentIdx = orderedTriggers.indexOf(internalRef.current!);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = orderedTriggers[currentIdx + 1] ?? orderedTriggers[0];
        next?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = orderedTriggers[currentIdx - 1] ?? orderedTriggers[orderedTriggers.length - 1];
        prev?.focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        orderedTriggers[0]?.focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        orderedTriggers[orderedTriggers.length - 1]?.focus();
      }

      onKeyDown?.(e);
    };

    return (
      <h3 className="acc-heading">
        <button
          ref={mergedRef}
          type="button"
          id={triggerId}
          className={cn('acc-trigger', className)}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          {...rest}
        >
          <span className="acc-trigger-label">{children}</span>
          <Icons.chevronDown size={16} className="acc-chev" aria-hidden="true" />
        </button>
      </h3>
    );
  },
);
AccordionTrigger.displayName = 'AccordionTrigger';

// ── AccordionContent ──────────────────────────────────────────────────────────
// The outer wrapper (.acc-panel) is always in the DOM so the grid-template-rows
// animation (0fr → 1fr) can play.  When collapsed, aria-hidden + inert keep
// the content out of the AT tree and tab order WITHOUT using the `hidden`
// attribute (which would set display:none and block the animation).

export const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, className, ...rest }, ref) => {
    const { openValues } = useAccordion();
    const { value, triggerId, panelId } = useItem();

    const isOpen = openValues.has(value);

    return (
      // Outer: animates height via grid-template-rows. Always mounted in DOM.
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className={cn('acc-panel', isOpen && 'is-open')}
        data-state={isOpen ? 'open' : 'closed'}
        aria-hidden={isOpen ? undefined : true}
        {...(!isOpen ? { inert: true } : {})}
      >
        {/* Middle: min-height:0 + overflow:hidden — the grid child that collapses to 0.
            Must have NO padding of its own so the grid row truly reaches 0px. */}
        <div className="acc-panel-inner">
          {/* Innermost: carries the visual padding so collapsing doesn't strip spacing when open */}
          <div ref={ref} className={cn('acc-content', className)} {...rest}>
            {children}
          </div>
        </div>
      </div>
    );
  },
);
AccordionContent.displayName = 'AccordionContent';

// ── Utility: merge refs ───────────────────────────────────────────────────────

function useMergedRef<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return React.useCallback(
    (node: T) => {
      refs.forEach((r) => {
        if (!r) return;
        if (typeof r === 'function') r(node);
        else (r as React.MutableRefObject<T>).current = node;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs,
  );
}
