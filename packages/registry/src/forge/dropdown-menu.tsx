import * as React from 'react';

interface DropdownMenuProps {
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

const DropdownMenu: React.FC<DropdownMenuProps> = ({
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

export { DropdownMenu };
