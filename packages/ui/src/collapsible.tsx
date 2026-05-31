import * as React from 'react';
import { cn } from './lib/utils';
import { Icons } from './icons';

// Forge DS — Collapsible
//
// Single disclosure: one trigger + one animated region.
// The atom beneath Accordion — use it directly when only one optional region
// is needed. For 2+ peer regions, use Accordion.
//
// Compound API:
//   <Collapsible open={open} onOpenChange={setOpen}>
//     <CollapsibleTrigger>Label</CollapsibleTrigger>
//     <CollapsibleContent>…body…</CollapsibleContent>
//   </Collapsible>
//
// Animation: grid-template-rows 0fr→1fr on .coll-body[data-state].
// CSS classes live in packages/ui/styles/ds.css (.coll-* block).
// No <style> block — emit className strings only.

// ── Context ──────────────────────────────────────────────────────────────────

interface CollapsibleCtx {
  open: boolean;
  toggle: () => void;
  disabled: boolean;
  triggerId: string;
  contentId: string;
}

const CollapsibleContext = React.createContext<CollapsibleCtx | null>(null);

function useCollapsibleCtx(who: string): CollapsibleCtx {
  const ctx = React.useContext(CollapsibleContext);
  if (!ctx) throw new Error(`<${who}> must be used inside <Collapsible>.`);
  return ctx;
}

// ── CollapsibleProps ─────────────────────────────────────────────────────────

export interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
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

// ── Collapsible (root) ───────────────────────────────────────────────────────

export const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
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
Collapsible.displayName = 'Collapsible';

// ── CollapsibleTriggerProps ──────────────────────────────────────────────────

export interface CollapsibleTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

// ── CollapsibleTrigger ───────────────────────────────────────────────────────

export const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  CollapsibleTriggerProps
>(({ className, children, onClick, ...rest }, ref) => {
  const { open, toggle, disabled, triggerId, contentId } =
    useCollapsibleCtx('CollapsibleTrigger');

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    toggle();
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      id={triggerId}
      type="button"
      className={cn('coll-trigger', className)}
      aria-expanded={open}
      aria-controls={contentId}
      disabled={disabled}
      onClick={handleClick}
      {...rest}
    >
      <span className="coll-label">{children}</span>
      <Icons.chevronDown
        size={14}
        aria-hidden="true"
        className={cn('coll-chev', open && 'coll-chev--open')}
      />
    </button>
  );
});
CollapsibleTrigger.displayName = 'CollapsibleTrigger';

// ── CollapsibleContentProps ──────────────────────────────────────────────────

export interface CollapsibleContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

// ── CollapsibleContent ───────────────────────────────────────────────────────
// The region is always mounted in the DOM so the grid-template-rows animation
// can play. When collapsed, the outer wrapper clamps to 0fr (overflow:hidden
// on the inner div), and aria-hidden + inert remove it from the a11y tree so
// screen readers never encounter collapsed content.
//
// On open, aria-hidden and inert are removed, content is tab-reachable via
// DOM order (Tab from the trigger continues into the region naturally).

export const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  CollapsibleContentProps
>(({ className, children, ...rest }, ref) => {
  const { open, triggerId, contentId } = useCollapsibleCtx('CollapsibleContent');

  return (
    // Outer: animates height via grid-template-rows. Always in DOM.
    <div
      id={contentId}
      role="region"
      aria-labelledby={triggerId}
      className="coll-body"
      data-state={open ? 'open' : 'closed'}
      aria-hidden={open ? undefined : true}
      // inert removes from tab order + a11y tree when collapsed
      {...(!open ? { inert: true } : {})}
    >
      {/* Inner: min-height:0 allows grid-template-rows to clip it cleanly. */}
      <div ref={ref} className={cn('coll-inner', className)} {...rest}>
        <div className="coll-content">{children}</div>
      </div>
    </div>
  );
});
CollapsibleContent.displayName = 'CollapsibleContent';
