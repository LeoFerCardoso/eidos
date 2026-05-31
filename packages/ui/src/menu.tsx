import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { cn } from './lib/utils';
import { Icons } from './icons';

// Forge DS — Dropdown Menu
//
// Command list (ACTIONS, not value selection). Compound: trigger + portalled
// panel. role=menu; items role=menuitem|menuitemcheckbox|menuitemradio.
//
// Keyboard model: roving tabindex (not aria-activedescendant).
//   - Down/Up  — move active item (wraps).
//   - Home/End — jump to first/last item.
//   - Type-ahead — jumps to the first item whose label starts with the typed char.
//   - Enter/Space — activates the focused item.
//   - ESC/Tab  — closes + restores focus to trigger.
//   - Checkable items keep the panel open on activation.
//
// Panel: position:fixed from getBoundingClientRect; direction-aware start/end.
// Portal: React.createPortal to document.body.
// CSS classes live in packages/ui/styles/ds.css (.dm-* block).

// ── Types ────────────────────────────────────────────────────────────────────

export type DropdownMenuAlign = 'start' | 'center' | 'end';
export type DropdownMenuSide  = 'bottom' | 'top';

export interface DropdownMenuProps {
  /** Controlled open state. */
  open?: boolean;
  /** Called when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Uncontrolled initial state. */
  defaultOpen?: boolean;
  /** Reading direction; inherits from the nearest [dir] ancestor when omitted. */
  dir?: 'ltr' | 'rtl';
  children: React.ReactNode;
}

export interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Render the wrapped child element as the trigger (Slot pattern). */
  asChild?: boolean;
  children: React.ReactNode;
}

export interface DropdownMenuContentProps {
  /** Align the panel relative to the trigger. Defaults to "start". */
  align?: DropdownMenuAlign;
  /** Which side to prefer. Defaults to "bottom" with an auto-flip. */
  side?: DropdownMenuSide;
  /** Pixel offset from the trigger. Default 4. */
  sideOffset?: number;
  /** Extra classes on the panel. */
  className?: string;
  children: React.ReactNode;
}

export interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Fires when the item is chosen. Call event.preventDefault() to keep the panel open. */
  onSelect?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** "destructive" paints red text + icon. */
  variant?: 'default' | 'destructive';
  /** Reserve the 14px leading slot so text aligns with sibling checkbox/radio items. */
  inset?: boolean;
  /** Leading icon (component, like Icons.eye). */
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  /** Trailing keyboard shortcut hint (e.g. "⌘E"). */
  shortcut?: string;
  children: React.ReactNode;
  className?: string;
}

export interface DropdownMenuCheckboxItemProps extends Omit<DropdownMenuItemProps, 'variant'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export interface DropdownMenuRadioItemProps extends Omit<DropdownMenuItemProps, 'variant'> {
  value: string;
}

export interface DropdownMenuRadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export interface DropdownMenuLabelProps {
  children: React.ReactNode;
  className?: string;
}

export interface DropdownMenuSeparatorProps {
  className?: string;
}

// ── Context ──────────────────────────────────────────────────────────────────

interface MenuCtx {
  open: boolean;
  setOpen: (v: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  dir: 'ltr' | 'rtl';
  // Roving tabindex — only one item owns tabindex=0 at a time.
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}

const MenuContext = React.createContext<MenuCtx | null>(null);

const useMenu = () => {
  const ctx = React.useContext(MenuContext);
  if (!ctx) throw new Error('Dropdown sub-component used outside <DropdownMenu>');
  return ctx;
};

// RadioGroup context so DropdownMenuRadioItem can read the current value.
interface RadioCtx {
  value?: string;
  onValueChange?: (v: string) => void;
}
const RadioContext = React.createContext<RadioCtx>({});

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Determine reading direction from nearest [dir] ancestor. */
const resolveDir = (el: HTMLElement | null): 'ltr' | 'rtl' => {
  let node: HTMLElement | null = el;
  while (node) {
    const d = node.getAttribute('dir');
    if (d === 'rtl') return 'rtl';
    if (d === 'ltr') return 'ltr';
    node = node.parentElement;
  }
  return 'ltr';
};

// Stable item id — used for roving tabindex targeting.
let _idCount = 0;
const nextId = () => `dm-item-${++_idCount}`;

// ── Root ─────────────────────────────────────────────────────────────────────

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  open: openProp,
  onOpenChange,
  defaultOpen = false,
  dir: dirProp,
  children,
}) => {
  const isControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = isControlled ? openProp! : internalOpen;

  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [dir, setDir] = React.useState<'ltr' | 'rtl'>(dirProp ?? 'ltr');

  React.useLayoutEffect(() => {
    if (!dirProp && triggerRef.current) {
      setDir(resolveDir(triggerRef.current));
    } else if (dirProp) {
      setDir(dirProp);
    }
  }, [dirProp]);

  const setOpen = React.useCallback(
    (v: boolean) => {
      if (!isControlled) setInternalOpen(v);
      onOpenChange?.(v);
    },
    [isControlled, onOpenChange],
  );

  return (
    <MenuContext.Provider value={{ open, setOpen, triggerRef, dir, activeId, setActiveId }}>
      {children}
    </MenuContext.Provider>
  );
};
DropdownMenu.displayName = 'DropdownMenu';

// ── Trigger ───────────────────────────────────────────────────────────────────

export const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  ({ asChild = false, children, onClick, onKeyDown, ...rest }, forwardedRef) => {
    const { open, setOpen, triggerRef } = useMenu();

    const ref = React.useCallback(
      (node: HTMLButtonElement | null) => {
        (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      },
      [triggerRef, forwardedRef],
    );

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setOpen(!open);
      onClick?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(true);
      }
      onKeyDown?.(e);
    };

    if (asChild && React.isValidElement(children)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return React.cloneElement(children as React.ReactElement<any>, {
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        ...rest,
      });
    }

    return (
      <button
        ref={ref}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

// ── Content (portalled panel) ─────────────────────────────────────────────────

export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  align = 'start',
  side = 'bottom',
  sideOffset = 4,
  className,
  children,
}) => {
  const { open, setOpen, triggerRef, dir, setActiveId } = useMenu();

  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = React.useState<{
    top: number;
    left: number;
    transformOrigin: string;
  } | null>(null);

  // ── Position ──────────────────────────────────────────────────────────────
  const place = React.useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger || !panelRef.current) return;

    const tr = trigger.getBoundingClientRect();
    const pr = panelRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Side (vertical)
    let top: number;
    let originY: string;
    const belowFits = tr.bottom + sideOffset + pr.height <= vh;
    const aboveFits = tr.top - sideOffset - pr.height >= 0;
    const preferTop = side === 'top';
    const useTop = preferTop ? aboveFits || !belowFits : !belowFits && aboveFits;

    if (useTop) {
      top = tr.top - sideOffset - pr.height;
      originY = 'bottom';
    } else {
      top = tr.bottom + sideOffset;
      originY = 'top';
    }

    // Align (horizontal) — direction-aware: start/end flip in RTL.
    const isRtl = dir === 'rtl';
    const physicalAlign =
      align === 'center'
        ? 'center'
        : align === 'start'
        ? isRtl
          ? 'right'
          : 'left'
        : isRtl
        ? 'left'
        : 'right';

    let left: number;
    let originX: string;
    if (physicalAlign === 'center') {
      left = tr.left + tr.width / 2 - pr.width / 2;
      originX = 'center';
    } else if (physicalAlign === 'right') {
      left = tr.right - pr.width;
      originX = 'right';
    } else {
      left = tr.left;
      originX = 'left';
    }

    // Keep inside viewport horizontally.
    left = Math.max(8, Math.min(left, vw - pr.width - 8));

    setPos({ top, left, transformOrigin: `${originX} ${originY}` });
  }, [align, dir, side, sideOffset, triggerRef]);

  // ── Keyboard navigation ───────────────────────────────────────────────────
  const getItems = React.useCallback((): HTMLButtonElement[] => {
    if (!panelRef.current) return [];
    return Array.from(
      panelRef.current.querySelectorAll<HTMLButtonElement>('[role="menuitem"],[role="menuitemcheckbox"],[role="menuitemradio"]'),
    ).filter((el) => !el.disabled && !el.getAttribute('aria-disabled'));
  }, []);

  const focusItem = React.useCallback(
    (el: HTMLButtonElement) => {
      el.focus();
      setActiveId(el.id);
    },
    [setActiveId],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const items = getItems();
      if (!items.length) return;
      const current = document.activeElement as HTMLButtonElement | null;
      const idx = current ? items.indexOf(current) : -1;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        focusItem(items[(idx + 1) % items.length]);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        focusItem(items[(idx - 1 + items.length) % items.length]);
      } else if (e.key === 'Home') {
        e.preventDefault();
        focusItem(items[0]);
      } else if (e.key === 'End') {
        e.preventDefault();
        focusItem(items[items.length - 1]);
      } else if (e.key === 'Escape' || e.key === 'Tab') {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      } else if (e.key.length === 1) {
        // Type-ahead: find the next item after current whose label starts with the key.
        const key = e.key.toLowerCase();
        const candidates = [...items.slice(idx + 1), ...items.slice(0, idx + 1)];
        const match = candidates.find((el) => {
          const text = el.textContent?.trim().toLowerCase() ?? '';
          return text.startsWith(key);
        });
        if (match) focusItem(match);
      }
    },
    [focusItem, getItems, setOpen, triggerRef],
  );

  // ── Lifecycle: open/close ─────────────────────────────────────────────────
  React.useEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }

    // Measure panel (it's off-screen at this point via the measuring class).
    const frame = requestAnimationFrame(() => {
      place();
      // After positioning, focus the first item.
      const items = getItems();
      if (items.length) focusItem(items[0]);
    });

    const onScroll = () => {
      setOpen(false);
      triggerRef.current?.focus();
    };
    const onResize = () => {
      setOpen(false);
      triggerRef.current?.focus();
    };
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  }, [open, place, getItems, focusItem, setOpen, triggerRef]);

  // ── Click-outside ─────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t)) return;
      if (triggerRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open, setOpen, triggerRef]);

  if (!open) return null;
  if (typeof document === 'undefined') return null;

  const panel = (
    <div
      ref={panelRef}
      role="menu"
      aria-orientation="vertical"
      className={cn('dm-panel', !pos && 'dm-measuring', className)}
      style={
        pos
          ? {
              position: 'fixed',
              top: pos.top,
              left: pos.left,
              transformOrigin: pos.transformOrigin,
              zIndex: 'var(--z-dropdown, 40)' as unknown as number,
            }
          : { position: 'fixed', top: -9999, left: -9999 }
      }
      onKeyDown={handleKeyDown}
      // Prevent clicks inside the panel from bubbling to the mousedown-outside handler.
      onMouseDown={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );

  return ReactDOM.createPortal(panel, document.body);
};
DropdownMenuContent.displayName = 'DropdownMenuContent';

// ── Item ──────────────────────────────────────────────────────────────────────

export const DropdownMenuItem = React.forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  (
    {
      variant = 'default',
      inset = false,
      icon: IconComp,
      shortcut,
      children,
      className,
      onSelect,
      onClick,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const { setOpen, triggerRef } = useMenu();
    const stableId = React.useId();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      onClick?.(e);
      onSelect?.(e);
      if (!e.defaultPrevented) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    return (
      <button
        ref={ref}
        id={stableId}
        type="button"
        role="menuitem"
        tabIndex={-1}
        disabled={disabled}
        aria-disabled={disabled || undefined}
        className={cn(
          'dm-item',
          variant === 'destructive' && 'dm-item-destructive',
          inset && 'dm-item-inset',
          className,
        )}
        onClick={handleClick}
        {...rest}
      >
        <span className="dm-item-left">
          {IconComp ? (
            <IconComp size={13} className="dm-item-icon" />
          ) : inset ? null : (
            <span className="dm-item-icon-slot" aria-hidden="true" />
          )}
          <span className="dm-item-label">{children}</span>
        </span>
        {shortcut && <span className="dm-item-shortcut" aria-hidden="true">{shortcut}</span>}
      </button>
    );
  },
);
DropdownMenuItem.displayName = 'DropdownMenuItem';

// ── CheckboxItem ──────────────────────────────────────────────────────────────

export const DropdownMenuCheckboxItem = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuCheckboxItemProps
>(
  (
    {
      checked = false,
      onCheckedChange,
      icon: IconComp,
      shortcut,
      children,
      className,
      onSelect,
      onClick,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const { setOpen, triggerRef } = useMenu();
    const stableId = React.useId();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      onClick?.(e);
      onCheckedChange?.(!checked);
      onSelect?.(e);
      // Checkable items keep the panel open by default.
      e.preventDefault();
    };

    return (
      <button
        ref={ref}
        id={stableId}
        type="button"
        role="menuitemcheckbox"
        tabIndex={-1}
        aria-checked={checked}
        disabled={disabled}
        aria-disabled={disabled || undefined}
        className={cn('dm-item', className)}
        onClick={handleClick}
        {...rest}
      >
        <span className="dm-item-left">
          <span className="dm-item-check" aria-hidden="true">
            {checked && <Icons.check size={12} />}
          </span>
          <span className="dm-item-label">{children}</span>
        </span>
        {shortcut && <span className="dm-item-shortcut" aria-hidden="true">{shortcut}</span>}
      </button>
    );
  },
);
DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem';

// ── RadioGroup + RadioItem ─────────────────────────────────────────────────────

export const DropdownMenuRadioGroup: React.FC<DropdownMenuRadioGroupProps> = ({
  value,
  onValueChange,
  children,
}) => (
  <RadioContext.Provider value={{ value, onValueChange }}>
    {children}
  </RadioContext.Provider>
);
DropdownMenuRadioGroup.displayName = 'DropdownMenuRadioGroup';

export const DropdownMenuRadioItem = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuRadioItemProps
>(
  (
    {
      value,
      icon: IconComp,
      shortcut,
      children,
      className,
      onSelect,
      onClick,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const { setOpen, triggerRef } = useMenu();
    const { value: groupValue, onValueChange } = React.useContext(RadioContext);
    const stableId = React.useId();
    const checked = groupValue === value;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      onClick?.(e);
      onValueChange?.(value);
      onSelect?.(e);
      if (!e.defaultPrevented) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    return (
      <button
        ref={ref}
        id={stableId}
        type="button"
        role="menuitemradio"
        tabIndex={-1}
        aria-checked={checked}
        disabled={disabled}
        aria-disabled={disabled || undefined}
        className={cn('dm-item', className)}
        onClick={handleClick}
        {...rest}
      >
        <span className="dm-item-left">
          <span className="dm-item-check" aria-hidden="true">
            {checked && <span className="dm-radio-dot" />}
          </span>
          <span className="dm-item-label">{children}</span>
        </span>
        {shortcut && <span className="dm-item-shortcut" aria-hidden="true">{shortcut}</span>}
      </button>
    );
  },
);
DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem';

// ── Label ─────────────────────────────────────────────────────────────────────

export const DropdownMenuLabel: React.FC<DropdownMenuLabelProps> = ({
  children,
  className,
}) => (
  <div role="presentation" className={cn('dm-label', className)}>
    {children}
  </div>
);
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

// ── Separator ─────────────────────────────────────────────────────────────────

export const DropdownMenuSeparator: React.FC<DropdownMenuSeparatorProps> = ({
  className,
}) => (
  <div role="separator" aria-orientation="horizontal" className={cn('dm-sep', className)} />
);
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';
