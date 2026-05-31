import * as React from 'react';
import { cn } from '@/lib/utils';

interface NavigationMenuProps extends React.HTMLAttributes<HTMLElement> {
  /** Delay in ms before a hovered item opens its content panel. Default 200. */
  delayDuration?: number;
  /** Controlled open item id. Pair with onValueChange. */
  value?: string;
  /** Fires when the open item changes (empty string = closed). */
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

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

const NavigationMenu = React.forwardRef<HTMLElement, NavigationMenuProps>(
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

export { NavigationMenu };
