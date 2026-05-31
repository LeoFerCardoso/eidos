import * as React from 'react';
import { cn } from '@/lib/utils';

interface MenubarProps extends React.HTMLAttributes<HTMLDivElement> {
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

const Menubar = React.forwardRef<HTMLDivElement, MenubarProps>(
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

export { Menubar };
