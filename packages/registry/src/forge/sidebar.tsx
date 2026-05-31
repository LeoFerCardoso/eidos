import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/forge/icons';

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Collapse behaviour.
   * - "icon"       → 56 px icon rail, labels hidden, tooltip on hover (default)
   * - "offcanvas"  → slides completely off-screen; appears as an overlay with scrim
   * - "none"       → always expanded, no collapse controls rendered
   */
  collapsible?: 'icon' | 'offcanvas' | 'none';
  /**
   * Which viewport edge the rail docks to.
   * Uses `inset-inline-start` so RTL auto-flips without overrides.
   */
  side?: 'start' | 'end';
  /** Controlled open/collapsed state (false = collapsed). */
  open?: boolean;
  /** Fires when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Initial open state when uncontrolled. Defaults to true. */
  defaultOpen?: boolean;
  /** Extra classes on the root element. */
  className?: string;
  children?: React.ReactNode;
}

interface SidebarCtx {
  /** Whether the rail is currently collapsed (icon-only). */
  collapsed: boolean;
  /** Collapsible mode. */
  collapsible: 'icon' | 'offcanvas' | 'none';
  /** Toggle open/closed. */
  toggle: () => void;
}

const SidebarContext = React.createContext<SidebarCtx>({
  collapsed: false,
  collapsible: 'icon',
  toggle: () => {},
});

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  (
    {
      collapsible = 'icon',
      side = 'start',
      open: openProp,
      onOpenChange,
      defaultOpen = true,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    // ── Controlled / uncontrolled ──────────────────────────────────────────
    const isControlled = openProp !== undefined;
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const open = isControlled ? openProp! : internalOpen;
    const collapsed = collapsible !== 'none' && !open;

    const toggle = React.useCallback(() => {
      const next = !open;
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    }, [open, isControlled, onOpenChange]);

    // ── Offcanvas: focus trap + body scroll lock ───────────────────────────
    const panelRef = React.useRef<HTMLElement>(null);
    const combinedRef = (node: HTMLElement | null) => {
      (panelRef as React.MutableRefObject<HTMLElement | null>).current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
    };

    // Body scroll lock when offcanvas is open
    React.useEffect(() => {
      if (collapsible !== 'offcanvas') return;
      if (open) {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
      }
      return undefined;
    }, [collapsible, open]);

    // Capture the element that had focus before the off-canvas opened, and
    // restore focus to it when the panel closes (SB2 focus-restore).
    const triggerElementRef = React.useRef<Element | null>(null);
    const prevOpenRef = React.useRef(open);
    React.useEffect(() => {
      if (collapsible !== 'offcanvas') return;
      const wasOpen = prevOpenRef.current;
      prevOpenRef.current = open;
      if (open && !wasOpen) {
        // Panel just opened — capture the currently-focused element
        triggerElementRef.current = document.activeElement;
      } else if (!open && wasOpen) {
        // Panel just closed — restore focus to the trigger
        const el = triggerElementRef.current as HTMLElement | null;
        if (el && typeof el.focus === 'function') el.focus();
        triggerElementRef.current = null;
      }
    }, [collapsible, open]);

    // Focus trap for offcanvas
    React.useEffect(() => {
      if (collapsible !== 'offcanvas' || !open) return;
      const panel = panelRef.current;
      if (!panel) return;

      const FOCUSABLE = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(',');

      const getFocusable = () => Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));

      // Focus first element
      const first = getFocusable()[0];
      first?.focus();

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          toggle();
          return;
        }
        if (e.key !== 'Tab') return;
        const els = getFocusable();
        if (!els.length) return;
        const firstEl = els[0];
        const lastEl = els[els.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      };

      panel.addEventListener('keydown', onKeyDown);
      return () => panel.removeEventListener('keydown', onKeyDown);
    }, [collapsible, open, toggle]);

    // ── ARIA: inert siblings while offcanvas open ─────────────────────────
    React.useEffect(() => {
      if (collapsible !== 'offcanvas') return;
      if (!open) return;
      const panel = panelRef.current;
      if (!panel) return;
      const siblings = Array.from(document.body.children).filter((c) => c !== panel);
      siblings.forEach((s) => s.setAttribute('inert', ''));
      return () => siblings.forEach((s) => s.removeAttribute('inert'));
    }, [collapsible, open]);

    // ── Click-outside for offcanvas ───────────────────────────────────────
    React.useEffect(() => {
      if (collapsible !== 'offcanvas' || !open) return;
      const onDown = (e: MouseEvent) => {
        if (panelRef.current?.contains(e.target as Node)) return;
        toggle();
      };
      document.addEventListener('mousedown', onDown);
      return () => document.removeEventListener('mousedown', onDown);
    }, [collapsible, open, toggle]);

    // ── Arrow-key navigation between items ───────────────────────────────
    const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      const items = Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>('.sb-item') ?? [],
      ).filter((el) => !el.hasAttribute('disabled') && el.tabIndex !== -1);
      const idx = items.indexOf(document.activeElement as HTMLElement);
      if (idx < 0) return;
      e.preventDefault();
      const next = e.key === 'ArrowDown' ? idx + 1 : idx - 1;
      items[Math.max(0, Math.min(next, items.length - 1))]?.focus();
    };

    const ctx: SidebarCtx = { collapsed, collapsible, toggle };

    // ── Rendering ─────────────────────────────────────────────────────────
    const isOffcanvas = collapsible === 'offcanvas';

    const nav = (
      <nav
        ref={combinedRef}
        role="navigation"
        aria-label="Primary"
        data-collapsed={collapsed || undefined}
        data-side={side}
        className={cn('sb-rail', isOffcanvas && 'sb-offcanvas', collapsed && 'sb-collapsed', className)}
        onKeyDown={onKeyDown}
        {...rest}
      >
        {collapsible !== 'none' && (
          <button
            type="button"
            className="sb-toggle btn icon ghost sm"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
            onClick={toggle}
          >
            <Icons.panelLeft size={14} className={cn('sb-toggle-icon', !collapsed && 'sb-toggle-icon--open')} />
          </button>
        )}
        {children}
      </nav>
    );

    if (isOffcanvas) {
      return (
        <SidebarContext.Provider value={ctx}>
          {/* Scrim */}
          {open && (
            <div
              className="sb-scrim"
              aria-hidden="true"
              onClick={toggle}
            />
          )}
          {nav}
        </SidebarContext.Provider>
      );
    }

    return (
      <SidebarContext.Provider value={ctx}>
        {nav}
      </SidebarContext.Provider>
    );
  },
);

export { Sidebar };
