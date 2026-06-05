import * as React from 'react';
import { cn } from './lib/utils';
import { Icons } from './icons';

// ═══════════════════════════════════════════════════════════════════════════
// Sidebar — Eidos DS  (packages/ui/src/sidebar.tsx)
//
// Collapsible vertical nav rail for app shells.
// Modes:
//   expanded   — 232px, icon + label + optional trailing badge
//   collapsed  — 56px icon rail, tooltip on hover
// Off-canvas — full overlay with scrim + focus trap (collapsible="offcanvas")
//
// CSS classes live in the .sb-* namespace (packages/ui/styles/tokens.css).
// Zero Tailwind, zero Radix, zero next/* — pure React + Eidos semantic classes.
// ═══════════════════════════════════════════════════════════════════════════

// ── Types ────────────────────────────────────────────────────────────────────

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
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

export interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional mono-uppercase section heading. Hidden when the rail is collapsed. */
  label?: string;
  children?: React.ReactNode;
  className?: string;
}

export interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Group label (collapsible toggle). */
  label?: string;
  /** Whether the group starts collapsed. Uncontrolled only. */
  defaultCollapsed?: boolean;
  /** Whether the rail is in icon-only mode (passed down from Sidebar context). */
  _collapsed?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export type SidebarBadge = string | number;

export interface SidebarItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Leading icon node (should be 14–16 px). */
  icon?: React.ReactNode;
  /** Marks this link as the current page. Sets aria-current="page". */
  active?: boolean;
  /** Trailing count badge. Suppressed when the rail is collapsed. */
  badge?: SidebarBadge;
  /** Tooltip label shown when the rail is in icon-only mode. Falls back to children text. */
  tooltip?: string;
  /**
   * Render the provided child element as the link instead of a bare <a>
   * (Slot pattern). Use this to compose with a framework router link —
   * e.g. `<SidebarItem asChild ...><Link href="…">Label</Link></SidebarItem>` —
   * so navigation stays client-side. The item's icon/label/badge are injected
   * as the child's content; the child keeps its own href/onClick.
   */
  asChild?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

// ── Context ───────────────────────────────────────────────────────────────────

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

const useSidebarCtx = () => React.useContext(SidebarContext);

// ── Sidebar (root) ────────────────────────────────────────────────────────────

/**
 * Collapsible vertical navigation rail.
 *
 * Compose with SidebarSection, SidebarGroup, SidebarItem, SidebarFooter.
 */
export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
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
Sidebar.displayName = 'Sidebar';

// ── SidebarSection ────────────────────────────────────────────────────────────

/**
 * A labeled section of the nav rail (e.g. "Workspace", "Account").
 * The heading is hidden when the rail is collapsed to icon-only.
 */
export const SidebarSection = React.forwardRef<HTMLDivElement, SidebarSectionProps>(
  ({ label, children, className, ...rest }, ref) => {
    const { collapsed } = useSidebarCtx();
    return (
      <div ref={ref} className={cn('sb-section', className)} {...rest}>
        {label && !collapsed && (
          <div className="sb-section-label" aria-hidden="true">{label}</div>
        )}
        {children}
      </div>
    );
  },
);
SidebarSection.displayName = 'SidebarSection';

// ── SidebarGroup ──────────────────────────────────────────────────────────────

/**
 * A collapsible group within a section.
 * Clicking the header toggles the group; pressing Enter/Space also toggles.
 */
export const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ label, defaultCollapsed = false, _collapsed, children, className, ...rest }, ref) => {
    const { collapsed: railCollapsed } = useSidebarCtx();
    const isRailCollapsed = _collapsed ?? railCollapsed;
    const [groupCollapsed, setGroupCollapsed] = React.useState(defaultCollapsed);
    const id = React.useId();

    return (
      <div ref={ref} className={cn('sb-group', className)} {...rest}>
        {label && (
          <button
            type="button"
            className="sb-group-toggle"
            aria-expanded={!groupCollapsed}
            aria-controls={id}
            onClick={() => setGroupCollapsed((c) => !c)}
          >
            {!isRailCollapsed && <span className="sb-group-label">{label}</span>}
            {!isRailCollapsed && (
              <span aria-hidden="true" className={cn('sb-group-chevron', !groupCollapsed && 'sb-group-chevron--open')}>
                <Icons.chevronRight size={12} />
              </span>
            )}
          </button>
        )}
        <div id={id} className={cn('sb-group-body', groupCollapsed && !isRailCollapsed && 'sb-group-body--hidden')}>
          {children}
        </div>
      </div>
    );
  },
);
SidebarGroup.displayName = 'SidebarGroup';

// ── SidebarItem ───────────────────────────────────────────────────────────────

/**
 * A single nav link in the rail.
 * In collapsed (icon-only) mode the label is visually hidden but readable by
 * screen readers via aria-label, and a CSS tooltip appears on hover.
 */
export const SidebarItem = React.forwardRef<HTMLAnchorElement, SidebarItemProps>(
  ({ icon, active, badge, tooltip, asChild = false, children, className, ...rest }, ref) => {
    const { collapsed } = useSidebarCtx();

    // Derive accessible label for collapsed state. With asChild the link text
    // is nested inside the slotted element (e.g. a <Link>), so unwrap one level.
    const labelNode = asChild && React.isValidElement(children)
      ? (children.props as { children?: React.ReactNode }).children
      : children;
    const childText =
      typeof labelNode === 'string'
        ? labelNode
        : React.Children.toArray(labelNode)
            .filter((c) => typeof c === 'string')
            .join('');
    const tooltipLabel = tooltip ?? childText;

    // Inner composition shared by both the bare <a> and the slotted element.
    const inner = (
      <>
        {icon && <span className="sb-item-icon" aria-hidden="true">{icon}</span>}
        {!collapsed && <span className="sb-item-label">{labelNode}</span>}
        {!collapsed && badge !== undefined && (
          <span className="sb-item-badge badge" aria-label={`${badge} items`}>{badge}</span>
        )}
      </>
    );

    const sharedProps = {
      className: cn('sb-item', active && 'sb-item--active', collapsed && 'sb-item--collapsed', className),
      'aria-current': active ? ('page' as const) : undefined,
      'aria-label': collapsed ? tooltipLabel : undefined,
      'data-tt': collapsed ? tooltipLabel : undefined,
    };

    // Slot pattern: render the consumer's element (e.g. a router <Link>) as the
    // link, merging our chrome/aria and replacing its children with `inner`.
    if (asChild && React.isValidElement(children)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const child = children as React.ReactElement<any>;
      return React.cloneElement(child, {
        ref,
        ...sharedProps,
        className: cn(sharedProps.className, child.props.className),
        ...rest,
      }, inner);
    }

    return (
      <a ref={ref} {...sharedProps} {...rest}>
        {inner}
      </a>
    );
  },
);
SidebarItem.displayName = 'SidebarItem';

// ── SidebarFooter ─────────────────────────────────────────────────────────────

/**
 * Pinned-to-bottom slot for user identity, settings link, or version info.
 */
export const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ children, className, ...rest }, ref) => (
    <div ref={ref} className={cn('sb-footer', className)} {...rest}>
      <hr className="sb-footer-hr" aria-hidden="true" />
      {children}
    </div>
  ),
);
SidebarFooter.displayName = 'SidebarFooter';
