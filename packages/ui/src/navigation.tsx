import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from './lib/utils';
import { Icons } from './icons';

// Forge DS — Navigation Menu
//
// Horizontal site navigation bar with optional dropdown content panels per
// top-level item. Top items form a roving tab-stop list; ArrowLeft / Right
// move between them, ArrowDown / Enter opens a panel, Escape closes and
// returns focus to the trigger. When a panel is open, focus moves to the
// first panel link; Tab/Shift+Tab cycle within the panel; Escape returns
// focus to the trigger.
//
// Opens on hover AND keyboard (with a configurable intent delay). Only one
// panel can be open at a time.
//
// ARIA model: the <nav> landmark contains a plain <ul> (no role="menubar").
// Triggers have aria-expanded + aria-controls pointing at the region panel.
// The panel is role="region" with an aria-label. No menu/menuitem semantics —
// panel links are plain <a> elements.
//
// Panel positioning: position:fixed + getBoundingClientRect(). The start/end
// placement is direction-aware — reads the closest [dir] attribute and swaps
// start ↔ end under RTL so panels never overflow the wrong edge.
//
// CSS classes live in packages/ui/styles/ds.css (.nm-* block).
// No <style> block here — emit className strings only.

// ── Types ────────────────────────────────────────────────────────────────────

export interface NavigationMenuProps extends React.HTMLAttributes<HTMLElement> {
  /** Delay in ms before a hovered item opens its content panel. Default 200. */
  delayDuration?: number;
  /** Controlled open item id. Pair with onValueChange. */
  value?: string;
  /** Fires when the open item changes (empty string = closed). */
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export interface NavigationMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
  /** Unique id used for roving focus and panel association. */
  id?: string;
  children: React.ReactNode;
  className?: string;
}

export interface NavigationMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Matches the NavigationMenuItem id it belongs to. */
  itemId?: string;
  children: React.ReactNode;
  className?: string;
}

export interface NavigationMenuLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Marks the current page — sets aria-current="page" and the active style. */
  active?: boolean;
  /** Leading icon node (16px). */
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

// ── Context ───────────────────────────────────────────────────────────────────

interface NavCtx {
  openId: string;
  setOpenId: (id: string) => void;
  delayDuration: number;
  triggerRefs: React.MutableRefObject<Map<string, HTMLButtonElement | null>>;
  panelPos: { top: number; left: number } | null;
  setPanelPos: (pos: { top: number; left: number } | null) => void;
  // For roving tabindex across items
  itemIds: React.MutableRefObject<string[]>;
  focusedId: string;
  setFocusedId: (id: string) => void;
}

const NavContext = React.createContext<NavCtx>({
  openId: '',
  setOpenId: () => {},
  delayDuration: 200,
  triggerRefs: { current: new Map() },
  panelPos: null,
  setPanelPos: () => {},
  itemIds: { current: [] },
  focusedId: '',
  setFocusedId: () => {},
});

// ── NavigationMenu ────────────────────────────────────────────────────────────

/** Root navigation bar. Wraps a <nav> with roving focus across top-level items. */
export const NavigationMenu = React.forwardRef<HTMLElement, NavigationMenuProps>(
  (
    {
      delayDuration = 200,
      value: valueProp,
      onValueChange,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const isControlled = valueProp !== undefined;
    const [internalOpen, setInternalOpen] = React.useState('');
    const openId = isControlled ? (valueProp ?? '') : internalOpen;

    const triggerRefs = React.useRef<Map<string, HTMLButtonElement | null>>(new Map());
    const [panelPos, setPanelPos] = React.useState<{ top: number; left: number } | null>(null);
    const itemIds = React.useRef<string[]>([]);
    const [focusedId, setFocusedId] = React.useState('');

    const hoverTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const setOpenId = React.useCallback(
      (id: string) => {
        if (!isControlled) setInternalOpen(id);
        onValueChange?.(id);
      },
      [isControlled, onValueChange],
    );

    // Compute panel position when openId changes
    React.useEffect(() => {
      if (!openId) { setPanelPos(null); return; }
      const trigger = triggerRefs.current.get(openId);
      if (!trigger) { setPanelPos(null); return; }
      const r = trigger.getBoundingClientRect();
      // Direction-aware: check if we're inside an RTL context
      const dir = getComputedStyle(trigger).direction ||
        trigger.closest('[dir]')?.getAttribute('dir') || 'ltr';
      const left = dir === 'rtl' ? r.right : r.left;
      setPanelPos({ top: r.bottom + 4, left });
    }, [openId]);

    // Click-outside and Escape to close
    React.useEffect(() => {
      if (!openId) return;
      const onDown = (e: MouseEvent) => {
        const target = e.target as Node;
        // Check if click is inside any trigger or panel
        let inside = false;
        triggerRefs.current.forEach((el) => { if (el?.contains(target)) inside = true; });
        const panels = document.querySelectorAll('.nm-panel');
        panels.forEach((p) => { if (p.contains(target)) inside = true; });
        if (!inside) setOpenId('');
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setOpenId('');
          // Restore focus to the trigger that was open
          const trigger = triggerRefs.current.get(openId);
          trigger?.focus();
        }
      };
      document.addEventListener('mousedown', onDown);
      document.addEventListener('keydown', onKey);
      return () => {
        document.removeEventListener('mousedown', onDown);
        document.removeEventListener('keydown', onKey);
      };
    }, [openId, setOpenId]);

    // Cleanup hover timer on unmount
    React.useEffect(() => {
      return () => {
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      };
    }, []);

    return (
      <NavContext.Provider
        value={{
          openId,
          setOpenId,
          delayDuration,
          triggerRefs,
          panelPos,
          setPanelPos,
          itemIds,
          focusedId,
          setFocusedId,
        }}
      >
        <nav
          ref={ref}
          className={cn('nm', className)}
          aria-label="Main navigation"
          {...rest}
        >
          <ul className="nm-list" role="list">
            {children}
          </ul>
        </nav>
      </NavContext.Provider>
    );
  },
);
NavigationMenu.displayName = 'NavigationMenu';

// ── NavigationMenuItem ────────────────────────────────────────────────────────

// Internal counter for generating stable ids when none are provided
let _itemCounter = 0;

/** A single top-level menu item. May contain a NavigationMenuLink and optionally a NavigationMenuContent. */
export const NavigationMenuItem = React.forwardRef<HTMLLIElement, NavigationMenuItemProps>(
  ({ id: idProp, children, className, ...rest }, ref) => {
    const stableId = React.useId();
    const id = idProp ?? stableId;
    const { openId, setOpenId, delayDuration, triggerRefs, itemIds, focusedId, setFocusedId } =
      React.useContext(NavContext);

    const hoverTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    // Register / unregister this item's id in the ordered list
    React.useEffect(() => {
      if (!itemIds.current.includes(id)) {
        itemIds.current = [...itemIds.current, id];
      }
      return () => {
        itemIds.current = itemIds.current.filter((i) => i !== id);
      };
    }, [id, itemIds]);

    // Identify which children are a trigger (has content) vs a plain link
    const hasContent = React.Children.toArray(children).some(
      (child) => React.isValidElement(child) && child.type === NavigationMenuContent,
    );

    const isOpen = openId === id;

    const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
      const ids = itemIds.current;
      const idx = ids.indexOf(id);
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = ids[(idx + 1) % ids.length];
        const el = triggerRefs.current.get(next);
        el?.focus();
        setFocusedId(next);
        setOpenId('');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = ids[(idx - 1 + ids.length) % ids.length];
        const el = triggerRefs.current.get(prev);
        el?.focus();
        setFocusedId(prev);
        setOpenId('');
      } else if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        if (hasContent) {
          e.preventDefault();
          setOpenId(isOpen ? '' : id);
        }
      } else if (e.key === 'Escape') {
        if (isOpen) {
          e.preventDefault();
          setOpenId('');
        }
      }
    };

    const handleMouseEnter = () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      if (hasContent) {
        hoverTimerRef.current = setTimeout(() => {
          setOpenId(id);
        }, delayDuration);
      }
    };

    const handleMouseLeave = () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      if (!hasContent) return;
      hoverTimerRef.current = setTimeout(() => {
        setOpenId('');
      }, delayDuration);
    };

    // Inject the trigger button if hasContent, otherwise let the link be
    const processedChildren = React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;
      if (child.type === NavigationMenuContent) {
        return React.cloneElement(child as React.ReactElement<NavigationMenuContentProps>, {
          itemId: id,
        });
      }
      if (child.type === NavigationMenuLink && hasContent) {
        // Wrap the link label in a trigger button that also opens the panel
        return (
          <button
            ref={(el) => { triggerRefs.current.set(id, el); }}
            type="button"
            className={cn('nm-trigger', isOpen && 'is-open')}
            aria-expanded={isOpen}
            aria-controls={`nm-panel-${id}`}
            onKeyDown={handleTriggerKeyDown}
            tabIndex={focusedId === id || (focusedId === '' && itemIds.current[0] === id) ? 0 : -1}
          >
            {child}
            <span className="nm-caret" aria-hidden="true">
              <Icons.chevronDown size={12} />
            </span>
          </button>
        );
      }
      // Plain link (no panel) — still participates in roving tabindex
      if (child.type === NavigationMenuLink) {
        return React.cloneElement(child as React.ReactElement<NavigationMenuLinkProps>, {
          ref: (el: HTMLAnchorElement | null) => {
            // Store in triggerRefs for keyboard routing (cast to keep Map<string, ...>)
            triggerRefs.current.set(id, el as unknown as HTMLButtonElement);
          },
          onKeyDown: (e: React.KeyboardEvent<HTMLAnchorElement>) => {
            handleTriggerKeyDown(e as unknown as React.KeyboardEvent);
            (child.props as NavigationMenuLinkProps).onKeyDown?.(e);
          },
          tabIndex:
            focusedId === id || (focusedId === '' && itemIds.current[0] === id) ? 0 : -1,
        } as Partial<NavigationMenuLinkProps>);
      }
      return child;
    });

    return (
      <li
        ref={ref}
        className={cn('nm-item', className)}
        role="none"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...rest}
      >
        {processedChildren}
      </li>
    );
  },
);
NavigationMenuItem.displayName = 'NavigationMenuItem';

// ── NavigationMenuContent ─────────────────────────────────────────────────────

/** Dropdown content panel for a top-level item. Render inside NavigationMenuItem. */
export const NavigationMenuContent = React.forwardRef<HTMLDivElement, NavigationMenuContentProps>(
  ({ itemId, children, className, onMouseEnter, onMouseLeave, ...rest }, ref) => {
    const { openId, setOpenId, delayDuration, panelPos, triggerRefs } = React.useContext(NavContext);
    const isOpen = itemId ? openId === itemId : false;
    const panelRef = React.useRef<HTMLDivElement>(null);

    const hoverTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      hoverTimerRef.current = setTimeout(() => setOpenId(''), delayDuration);
      onMouseLeave?.(e);
    };

    React.useEffect(() => () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    }, []);

    // NV1: When the panel opens, move focus to the first focusable link inside it
    // and install a Tab trap so focus cycles within the panel. ESC closes the panel
    // and returns focus to the trigger (the global keydown handler covers ESC, but
    // we also add a local guard here for robustness).
    React.useEffect(() => {
      if (!isOpen) return;
      const panel = panelRef.current;
      if (!panel) return;

      const FOCUSABLE =
        'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])';

      const getFocusable = () => Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));

      // Move focus to the first item after a microtask so the portal is painted.
      const raf = requestAnimationFrame(() => {
        const first = getFocusable()[0];
        first?.focus();
      });

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          setOpenId('');
          if (itemId) {
            const trigger = triggerRefs.current.get(itemId);
            trigger?.focus();
          }
          return;
        }
        if (e.key !== 'Tab') return;
        const els = getFocusable();
        if (!els.length) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      panel.addEventListener('keydown', onKeyDown);
      return () => {
        cancelAnimationFrame(raf);
        panel.removeEventListener('keydown', onKeyDown);
      };
    }, [isOpen, itemId, setOpenId, triggerRefs]);

    if (!isOpen || !panelPos) return null;

    return createPortal(
      <div
        ref={(el) => {
          (panelRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }}
        id={`nm-panel-${itemId}`}
        className={cn('nm-panel', className)}
        role="region"
        aria-label="Navigation panel"
        style={{ top: panelPos.top, left: panelPos.left }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...rest}
      >
        {children}
      </div>,
      document.body,
    );
  },
);
NavigationMenuContent.displayName = 'NavigationMenuContent';

// ── NavigationMenuLink ────────────────────────────────────────────────────────

/** A navigation anchor. Inside a content panel it becomes a regular tab-stop link. */
export const NavigationMenuLink = React.forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>(
  ({ active, icon, children, className, ...rest }, ref) => (
    <a
      ref={ref}
      className={cn('nm-link', active && 'is-active', className)}
      aria-current={active ? 'page' : undefined}
      {...rest}
    >
      {icon && <span className="nm-link-icon" aria-hidden="true">{icon}</span>}
      <span className="nm-link-label">{children}</span>
    </a>
  ),
);
NavigationMenuLink.displayName = 'NavigationMenuLink';
