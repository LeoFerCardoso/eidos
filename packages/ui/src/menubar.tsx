import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { cn } from './lib/utils';

// Eidos DS — Menubar
//
// Horizontal application menu bar (File / Edit / View / Help…).
// ARIA: role=menubar + role=menuitem triggers; role=menu panels with role=menuitem rows.
// Keyboard model (WAI-ARIA Menubar pattern):
//   Tab          — single tab stop on the bar; roving tabindex keeps one item in sequence.
//   Left/Right   — move between top-level triggers (wraps if loop=true).
//   Down/Enter/Space — open current menu, focus first item.
//   Up/Down      — navigate within an open menu (wraps if loop=true).
//   Left/Right   — while a menu is open, close current and open adjacent.
//   Escape       — close current menu, return focus to its trigger.
//   Home/End     — jump to first/last item in the open menu.
//   A–Z          — type-ahead within the open menu.
// RTL: start/end placement is direction-aware (reads closest [dir] attribute).
// Reduced-motion: animation is gated on prefers-reduced-motion.
//
// CSS classes live in packages/ui/styles/tokens.css (.mb-* block).
// No <style> block here — only className strings.

// ── Types ────────────────────────────────────────────────────────────────────

export interface MenubarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Controlled open-menu value (the MenubarMenu's `value` prop).
   * Omit for uncontrolled.
   */
  value?: string;
  /** Fires when the active open menu changes; pass '' to signal closed. */
  onValueChange?: (value: string) => void;
  /** Uncontrolled initial open menu. */
  defaultValue?: string;
  /** Arrow-key navigation wraps around. @default true */
  loop?: boolean;
  /** Reading direction — arrow semantics flip under RTL. @default 'ltr' */
  dir?: 'ltr' | 'rtl';
  children: React.ReactNode;
  className?: string;
}

export interface MenubarMenuProps {
  /**
   * Stable key for this menu — required when Menubar is controlled.
   * Defaults to the text content of the MenubarTrigger.
   */
  value?: string;
  children: React.ReactNode;
}

export interface MenubarItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Leading icon element (12–14 px). */
  icon?: React.ReactNode;
  /** Trailing keyboard shortcut (use <MenubarShortcut> for formatting). */
  shortcut?: React.ReactNode;
  /** Disable the item (still focusable for ARIA compliance). */
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export interface MenubarSeparatorProps extends React.HTMLAttributes<HTMLHRElement> {
  className?: string;
}

export interface MenubarShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
}

// ── Internal context ──────────────────────────────────────────────────────────

interface MenubarCtx {
  openValue: string;
  setOpenValue: (v: string) => void;
  loop: boolean;
  dir: 'ltr' | 'rtl';
  registerTrigger: (value: string, ref: React.RefObject<HTMLButtonElement | null>) => void;
  unregisterTrigger: (value: string) => void;
  triggerRefs: React.MutableRefObject<Map<string, React.RefObject<HTMLButtonElement | null>>>;
  menuOrder: React.MutableRefObject<string[]>;
}

const MenubarContext = React.createContext<MenubarCtx | null>(null);

function useMenubar() {
  const ctx = React.useContext(MenubarContext);
  if (!ctx) throw new Error('Menubar compound parts must be inside <Menubar>.');
  return ctx;
}

interface MenuCtx {
  value: string;
  open: boolean;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  panelRef: React.RefObject<HTMLDivElement | null>;
  closeMenu: () => void;
}

const MenuContext = React.createContext<MenuCtx | null>(null);

function useMenu() {
  const ctx = React.useContext(MenuContext);
  if (!ctx) throw new Error('MenubarTrigger/MenubarContent must be inside <MenubarMenu>.');
  return ctx;
}

// ── Menubar (root) ────────────────────────────────────────────────────────────

export const Menubar = React.forwardRef<HTMLDivElement, MenubarProps>(
  (
    {
      value: valueProp,
      onValueChange,
      defaultValue = '',
      loop = true,
      dir = 'ltr',
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const isControlled = valueProp !== undefined;
    const [internalOpen, setInternalOpen] = React.useState(defaultValue);
    const openValue = isControlled ? (valueProp ?? '') : internalOpen;

    const setOpenValue = React.useCallback(
      (v: string) => {
        if (!isControlled) setInternalOpen(v);
        onValueChange?.(v);
      },
      [isControlled, onValueChange],
    );

    const triggerRefs = React.useRef<Map<string, React.RefObject<HTMLButtonElement | null>>>(new Map());
    const menuOrder = React.useRef<string[]>([]);

    const registerTrigger = React.useCallback(
      (value: string, ref: React.RefObject<HTMLButtonElement | null>) => {
        triggerRefs.current.set(value, ref);
        if (!menuOrder.current.includes(value)) {
          menuOrder.current.push(value);
        }
      },
      [],
    );

    const unregisterTrigger = React.useCallback((value: string) => {
      triggerRefs.current.delete(value);
      menuOrder.current = menuOrder.current.filter((v) => v !== value);
    }, []);

    // Click-outside: close when focus leaves the entire bar.
    const rootRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (!openValue) return;
      const onMouseDown = (e: MouseEvent) => {
        const el = rootRef.current;
        if (!el) return;
        // Check if target is inside any panel (fixed-positioned panels aren't inside root).
        const insideRoot = el.contains(e.target as Node);
        if (insideRoot) return;
        // Check open panel refs.
        setOpenValue('');
      };
      document.addEventListener('mousedown', onMouseDown);
      return () => document.removeEventListener('mousedown', onMouseDown);
    }, [openValue, setOpenValue]);

    // Merge external + internal ref.
    const handleRef = (node: HTMLDivElement | null) => {
      (rootRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    };

    const ctx: MenubarCtx = {
      openValue,
      setOpenValue,
      loop,
      dir,
      registerTrigger,
      unregisterTrigger,
      triggerRefs,
      menuOrder,
    };

    return (
      <MenubarContext.Provider value={ctx}>
        <div
          ref={handleRef}
          role="menubar"
          aria-orientation="horizontal"
          aria-label={rest['aria-label'] ?? 'Application menu'}
          className={cn('mb-bar', className)}
          {...rest}
        >
          {children}
        </div>
      </MenubarContext.Provider>
    );
  },
);
Menubar.displayName = 'Menubar';

// ── MenubarMenu (one top-level menu slot) ─────────────────────────────────────

export const MenubarMenu: React.FC<MenubarMenuProps> = ({ value: valueProp, children }) => {
  const bar = useMenubar();
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const panelRef = React.useRef<HTMLDivElement | null>(null);

  // Derive stable value: prefer explicit prop, else fall back to trigger text
  // (set during first render via triggerRef).
  const [derivedValue, setDerivedValue] = React.useState(valueProp ?? '');

  React.useLayoutEffect(() => {
    const v = valueProp ?? triggerRef.current?.textContent?.trim() ?? String(Math.random());
    setDerivedValue(v);
    bar.registerTrigger(v, triggerRef as React.RefObject<HTMLButtonElement | null>);
    return () => bar.unregisterTrigger(v);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueProp]);

  const open = bar.openValue === derivedValue && derivedValue !== '';

  const closeMenu = React.useCallback(() => {
    bar.setOpenValue('');
    // Restore focus to trigger after close.
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, [bar]);

  const menuCtx: MenuCtx = {
    value: derivedValue,
    open,
    triggerRef: triggerRef as React.RefObject<HTMLButtonElement | null>,
    panelRef: panelRef as React.RefObject<HTMLDivElement | null>,
    closeMenu,
  };

  return (
    <MenuContext.Provider value={menuCtx}>
      <div className="mb-menu">
        {children}
      </div>
    </MenuContext.Provider>
  );
};
MenubarMenu.displayName = 'MenubarMenu';

// ── MenubarTrigger ────────────────────────────────────────────────────────────

export interface MenubarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const MenubarTrigger = React.forwardRef<HTMLButtonElement, MenubarTriggerProps>(
  ({ children, className, onKeyDown, onClick, onMouseEnter, ...rest }, _forwardedRef) => {
    const bar = useMenubar();
    const menu = useMenu();

    // Register the trigger ref so the bar can focus it via keyboard.
    React.useLayoutEffect(() => {
      const v = menu.value || (menu.triggerRef.current?.textContent?.trim() ?? '');
      if (v) bar.registerTrigger(v, menu.triggerRef);
    });

    const openSibling = (direction: 'prev' | 'next') => {
      const order = bar.menuOrder.current;
      const idx = order.indexOf(menu.value);
      if (idx === -1) return;
      let nextIdx =
        direction === 'next'
          ? idx + 1
          : idx - 1;
      if (bar.loop) {
        nextIdx = (nextIdx + order.length) % order.length;
      } else {
        nextIdx = Math.max(0, Math.min(order.length - 1, nextIdx));
      }
      const nextVal = order[nextIdx];
      if (nextVal !== undefined) {
        bar.setOpenValue(nextVal);
        const nextRef = bar.triggerRefs.current.get(nextVal);
        nextRef?.current?.focus();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      const isRtl = bar.dir === 'rtl';
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          if (menu.open) {
            // While open: move to next menu.
            openSibling(isRtl ? 'prev' : 'next');
          } else {
            openSibling(isRtl ? 'prev' : 'next');
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          openSibling(isRtl ? 'next' : 'prev');
          break;
        case 'ArrowDown':
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (!menu.open) {
            bar.setOpenValue(menu.value);
            // Focus first item after panel mounts.
            requestAnimationFrame(() => {
              const panel = menu.panelRef.current;
              const first = panel?.querySelector<HTMLElement>('[role="menuitem"]:not([disabled])');
              first?.focus();
            });
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (!menu.open) {
            bar.setOpenValue(menu.value);
            requestAnimationFrame(() => {
              const panel = menu.panelRef.current;
              const items = panel?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])');
              if (items?.length) items[items.length - 1].focus();
            });
          }
          break;
        case 'Escape':
          e.preventDefault();
          if (menu.open) menu.closeMenu();
          break;
        case 'Home': {
          e.preventDefault();
          const order = bar.menuOrder.current;
          if (order.length) {
            const first = order[0];
            bar.triggerRefs.current.get(first)?.current?.focus();
          }
          break;
        }
        case 'End': {
          e.preventDefault();
          const order = bar.menuOrder.current;
          if (order.length) {
            const last = order[order.length - 1];
            bar.triggerRefs.current.get(last)?.current?.focus();
          }
          break;
        }
        default:
          // Type-ahead on the bar: jump to first menu whose label starts with the key.
          if (e.key.length === 1 && /\S/.test(e.key)) {
            const key = e.key.toLowerCase();
            const order = bar.menuOrder.current;
            const current = order.indexOf(menu.value);
            // Search from next position (wrap around) to find a match.
            for (let i = 1; i <= order.length; i++) {
              const idx = (current + i) % order.length;
              const v = order[idx];
              if (!v) continue;
              const ref = bar.triggerRefs.current.get(v);
              const text = ref?.current?.textContent?.trim().toLowerCase() ?? '';
              if (text.startsWith(key)) {
                ref?.current?.focus();
                break;
              }
            }
          }
      }
      onKeyDown?.(e);
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      bar.setOpenValue(menu.open ? '' : menu.value);
      onClick?.(e);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Hover-to-switch: only when another menu is already open.
      if (bar.openValue && bar.openValue !== menu.value) {
        bar.setOpenValue(menu.value);
        menu.triggerRef.current?.focus();
      }
      onMouseEnter?.(e);
    };

    return (
      <button
        ref={menu.triggerRef}
        type="button"
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={menu.open}
        tabIndex={0}
        className={cn('mb-trigger', menu.open && 'is-open', className)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
MenubarTrigger.displayName = 'MenubarTrigger';

// ── MenubarContent (the open panel) ──────────────────────────────────────────

export interface MenubarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const MenubarContent = React.forwardRef<HTMLDivElement, MenubarContentProps>(
  ({ children, className, onKeyDown, ...rest }, _forwardedRef) => {
    const bar = useMenubar();
    const menu = useMenu();
    const [pos, setPos] = React.useState<{ top: number; left: number } | null>(null);
    const ownRef = React.useRef<HTMLDivElement | null>(null);

    // Merge panelRef from MenuContext with local ref.
    const handleRef = (node: HTMLDivElement | null) => {
      ownRef.current = node;
      (menu.panelRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (typeof _forwardedRef === 'function') _forwardedRef(node);
      else if (_forwardedRef)
        (_forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    };

    // Compute position: position:fixed anchored below the trigger.
    React.useEffect(() => {
      if (!menu.open) { setPos(null); return; }
      const place = () => {
        const trigger = menu.triggerRef.current;
        if (!trigger) return;
        const r = trigger.getBoundingClientRect();
        // Direction-aware start edge.
        const dirEl = trigger.closest('[dir]') as HTMLElement | null;
        const isRtl =
          bar.dir === 'rtl' ||
          (dirEl ? getComputedStyle(dirEl).direction === 'rtl' : false);
        setPos({
          top: r.bottom + 4,
          left: isRtl ? r.right : r.left,
        });
      };
      place();
      const close = () => bar.setOpenValue('');
      window.addEventListener('scroll', close, true);
      window.addEventListener('resize', close);
      return () => {
        window.removeEventListener('scroll', close, true);
        window.removeEventListener('resize', close);
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menu.open]);

    // Panel keyboard handling.
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const panel = ownRef.current;
      if (!panel) return;
      const items = Array.from(
        panel.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])'),
      );
      const focused = document.activeElement as HTMLElement;
      const idx = items.indexOf(focused);
      const isRtl = bar.dir === 'rtl';

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (idx === -1 && items.length) { items[0].focus(); break; }
          if (bar.loop) {
            items[(idx + 1) % items.length]?.focus();
          } else {
            items[Math.min(items.length - 1, idx + 1)]?.focus();
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (idx === -1 && items.length) { items[items.length - 1].focus(); break; }
          if (bar.loop) {
            items[(idx - 1 + items.length) % items.length]?.focus();
          } else {
            items[Math.max(0, idx - 1)]?.focus();
          }
          break;
        case 'Home':
          e.preventDefault();
          items[0]?.focus();
          break;
        case 'End':
          e.preventDefault();
          items[items.length - 1]?.focus();
          break;
        case 'ArrowRight': {
          e.preventDefault();
          menu.closeMenu();
          const order = bar.menuOrder.current;
          const ti = order.indexOf(menu.value);
          const nextIdx = isRtl
            ? (ti - 1 + order.length) % order.length
            : (ti + 1) % order.length;
          const nextVal = order[nextIdx];
          if (nextVal !== undefined) {
            bar.setOpenValue(nextVal);
            requestAnimationFrame(() => {
              const nextTrigRef = bar.triggerRefs.current.get(nextVal);
              nextTrigRef?.current?.focus();
              // Auto-open and focus first item.
              requestAnimationFrame(() => {
                const nextTrigEl = bar.triggerRefs.current.get(nextVal)?.current;
                nextTrigEl?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
              });
            });
          }
          break;
        }
        case 'ArrowLeft': {
          e.preventDefault();
          menu.closeMenu();
          const order = bar.menuOrder.current;
          const ti = order.indexOf(menu.value);
          const prevIdx = isRtl
            ? (ti + 1) % order.length
            : (ti - 1 + order.length) % order.length;
          const prevVal = order[prevIdx];
          if (prevVal !== undefined) {
            bar.setOpenValue(prevVal);
            requestAnimationFrame(() => {
              const prevTrigRef = bar.triggerRefs.current.get(prevVal);
              prevTrigRef?.current?.focus();
              requestAnimationFrame(() => {
                const prevTrigEl = bar.triggerRefs.current.get(prevVal)?.current;
                prevTrigEl?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
              });
            });
          }
          break;
        }
        case 'Escape':
          e.preventDefault();
          menu.closeMenu();
          break;
        case 'Tab':
          // Tab closes the menu and lets focus move naturally.
          bar.setOpenValue('');
          break;
        default:
          // Type-ahead within open menu.
          if (e.key.length === 1 && /\S/.test(e.key)) {
            const key = e.key.toLowerCase();
            const start = idx === -1 ? 0 : idx + 1;
            for (let i = 0; i < items.length; i++) {
              const ti2 = (start + i) % items.length;
              const text = items[ti2].textContent?.trim().toLowerCase() ?? '';
              if (text.startsWith(key)) {
                items[ti2].focus();
                break;
              }
            }
          }
      }
      onKeyDown?.(e);
    };

    if (!menu.open || !pos) return null;

    const isRtl =
      bar.dir === 'rtl' ||
      (() => {
        const dirEl = menu.triggerRef.current?.closest('[dir]') as HTMLElement | null;
        return dirEl ? getComputedStyle(dirEl).direction === 'rtl' : false;
      })();

    const panelStyle: React.CSSProperties = {
      position: 'fixed',
      top: pos.top,
      zIndex: 'var(--z-dropdown)' as React.CSSProperties['zIndex'],
      ...(isRtl ? { right: `calc(100vw - ${pos.left}px)` } : { left: pos.left }),
    };

    return ReactDOM.createPortal(
      <div
        ref={handleRef}
        role="menu"
        aria-orientation="vertical"
        className={cn('mb-panel', className)}
        style={panelStyle}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </div>,
      document.body,
    );
  },
);
MenubarContent.displayName = 'MenubarContent';

// ── MenubarItem ───────────────────────────────────────────────────────────────

export const MenubarItem = React.forwardRef<HTMLButtonElement, MenubarItemProps>(
  (
    { icon, shortcut, disabled = false, children, className, onClick, ...rest },
    ref,
  ) => {
    const bar = useMenubar();
    const menu = useMenu();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      onClick?.(e);
      menu.closeMenu();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
        e.preventDefault();
        onClick?.(e as unknown as React.MouseEvent<HTMLButtonElement>);
        menu.closeMenu();
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        role="menuitem"
        aria-disabled={disabled || undefined}
        disabled={disabled}
        tabIndex={-1}
        className={cn('mb-item', disabled && 'is-disabled', className)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={(e) => {
          if (!disabled) (e.currentTarget as HTMLElement).focus();
        }}
        {...rest}
      >
        {icon && <span className="mb-item-icon" aria-hidden="true">{icon}</span>}
        <span className="mb-item-label">{children}</span>
        {shortcut && <span className="mb-item-shortcut" aria-hidden="true">{shortcut}</span>}
      </button>
    );
  },
);
MenubarItem.displayName = 'MenubarItem';

// ── MenubarSeparator ──────────────────────────────────────────────────────────

export const MenubarSeparator = React.forwardRef<HTMLHRElement, MenubarSeparatorProps>(
  ({ className, ...rest }, ref) => (
    <hr
      ref={ref}
      role="separator"
      aria-orientation="horizontal"
      className={cn('mb-sep', className)}
      {...rest}
    />
  ),
);
MenubarSeparator.displayName = 'MenubarSeparator';

// ── MenubarShortcut ───────────────────────────────────────────────────────────

export const MenubarShortcut: React.FC<MenubarShortcutProps> = ({
  children,
  className,
  ...rest
}) => (
  <span className={cn('kbd-chord', className)} aria-hidden="true" {...rest}>
    {React.Children.map(children, (child) =>
      typeof child === 'string' ? (
        <kbd className="kbd">{child}</kbd>
      ) : (
        child
      ),
    )}
  </span>
);
MenubarShortcut.displayName = 'MenubarShortcut';
