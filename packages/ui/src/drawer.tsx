import * as React from 'react';
import * as ReactDOM from 'react-dom';
// Forge DS — Drawer.
//
// Two layouts, one component:
//
//   variant="overlay" (default)
//     Slides over the page with a backdrop, portaled to <body>. The
//     surrounding layout does not move. Use for settings, filters, nav.
//
//   variant="inline"
//     Participates in the parent layout as a docked column. When `open`
//     transitions to true, the panel slides in from the side AND occupies
//     space in the parent flex/grid, so the siblings shrink. When `open`
//     is false, the panel collapses to inline-size:0 (or the parent grid
//     column collapses) and siblings reclaim the room. Use for artifact
//     surfaces beside a chat thread.
//
// Both share the same DOM shape (header / body / footer / close), so the
// chrome is identical — only the positioning + animation differ.
//
// Styles live in src/styles/drawer.css (the .dr-* block).
import { Icons } from './icons';

type Side = 'right' | 'left' | 'top' | 'bottom';
type Variant = 'overlay' | 'inline';

export interface DrawerProps {
  /** Controlled open state. When true the panel is visible; when false it slides out and unmounts after the 320ms exit. */
  open: boolean;
  /** Edge the panel slides from. Right suits forms/edit panels, left suits navigation, bottom suits choosers/filters (also enables drag-to-dismiss), top suits global utilities like search. */
  side?: Side;
  /** Rendering strategy. `overlay` (default) portals to `<body>` with a backdrop scrim — the surrounding layout is unaffected. `inline` occupies space inside the parent flex/grid so siblings animate in/out alongside the panel. */
  variant?: Variant;
  /** When true, clicking the scrim and drag-to-dismiss (bottom variant) are disabled. The drawer can still be closed via the X button or Escape. Use for wizards or forms with unsaved state. */
  persistent?: boolean;
  /** Panel heading text or node. When provided, renders inside `.dr-header`. */
  title?: React.ReactNode;
  /** Subtitle / description shown below the title inside `.dr-header`. */
  desc?: React.ReactNode;
  /** Content pinned to the panel bottom in `.dr-footer`. Render cancel (ghost) then primary (ember) left-to-right. */
  footer?: React.ReactNode;
  /** Callback fired when the drawer requests dismissal — Escape key, scrim click, X button, or drag-to-dismiss velocity threshold. Wire to toggle your `open` state. */
  onClose?: () => void;
  /** Inline styles forwarded to the `.dr` panel element. Use CSS custom properties such as `--dr-w` (panel width) and `--dr-h` (bottom-sheet height) to resize without a className override. */
  style?: React.CSSProperties;
  /** Extra class name(s) appended to the `.dr` panel element. */
  className?: string;
  /** Panel body content rendered inside `.dr-body`, which scrolls independently of the sticky header and footer. */
  children?: React.ReactNode;
}

export const Drawer = (props: DrawerProps) => {
  const {
    open, side = 'right', variant = 'overlay', persistent,
    title, desc, footer, onClose, style, className, children,
  } = props;

  const [mounted, setMounted] = React.useState(open);
  const [state, setState] = React.useState<'open' | 'closed'>(open ? 'open' : 'closed');
  const panelRef = React.useRef<HTMLDivElement>(null);
  const dragRef = React.useRef({ active: false, startY: 0, startT: 0, dy: 0 });
  // Remember what had focus before the drawer opened so we can restore it on close.
  const restoreFocusRef = React.useRef<HTMLElement | null>(null);

  const baseId = React.useId();
  const titleId = `${baseId}-title`;
  const descId = `${baseId}-desc`;

  React.useEffect(() => {
    if (open) {
      setMounted(true);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setState('open'));
      });
      return () => cancelAnimationFrame(id);
    } else {
      setState('closed');
      const t = window.setTimeout(() => setMounted(false), 320);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  React.useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !persistent) onClose && onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mounted, persistent, onClose]);

  // ── Focus management + focus trap (overlay variant) ────────────────────
  // On open: capture the previously-focused element, then move focus into the
  // panel. While open: trap Tab/Shift+Tab so it cycles within `.dr`. On close
  // (unmount): restore focus to the opener. Inline drawers dock into the page
  // flow and do not own focus, so this is scoped to the overlay variant.
  React.useEffect(() => {
    if (!mounted || variant !== 'overlay') return;
    const panel = panelRef.current;
    if (!panel) return;

    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const focusableSelector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const getFocusable = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );

    // Move focus into the panel — first focusable, else the panel itself.
    const first = getFocusable()[0];
    if (first) first.focus();
    else panel.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = getFocusable();
      if (focusable.length === 0) {
        e.preventDefault();
        panel.focus();
        return;
      }
      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey) {
        if (active === firstEl || !panel.contains(active)) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (active === lastEl || !panel.contains(active)) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    panel.addEventListener('keydown', onKeyDown);

    return () => {
      panel.removeEventListener('keydown', onKeyDown);
      const toRestore = restoreFocusRef.current;
      if (toRestore && typeof toRestore.focus === 'function') toRestore.focus();
      restoreFocusRef.current = null;
    };
  }, [mounted, variant]);

  // ── Drag-to-close (bottom drawer, overlay variant only) ────────────────
  const isBottom = side === 'bottom';
  const setPanelTransform = (dy: number, withTransition: boolean) => {
    const el = panelRef.current; if (!el) return;
    el.style.setProperty('transition', withTransition
      ? 'transform 240ms cubic-bezier(0.32, 0.72, 0, 1)'
      : 'none', 'important');
    el.style.setProperty('transform', `translate3d(0, ${dy}px, 0)`, 'important');
  };
  const clearPanelTransform = () => {
    const el = panelRef.current; if (!el) return;
    el.style.removeProperty('transform');
    el.style.removeProperty('transition');
  };
  const onPointerDown = (e: React.PointerEvent) => {
    if (variant !== 'overlay' || !isBottom || persistent) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragRef.current = { active: true, startY: e.clientY, startT: Date.now(), dy: 0 };
    (e.currentTarget as any).setPointerCapture && (e.currentTarget as any).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dy = Math.max(0, e.clientY - dragRef.current.startY);
    dragRef.current.dy = dy;
    setPanelTransform(dy, false);
  };
  const onPointerUp = () => {
    if (!dragRef.current.active) return;
    const { startT, dy } = dragRef.current;
    dragRef.current.active = false;
    const dt = Math.max(1, Date.now() - startT);
    const velocity = dy / dt;
    const h = panelRef.current ? panelRef.current.offsetHeight : 360;
    const shouldClose = !persistent && (dy > h * 0.3 || velocity > 0.6);
    if (shouldClose) {
      setPanelTransform(h, true);
      window.setTimeout(() => onClose && onClose(), 200);
    } else {
      setPanelTransform(0, true);
      window.setTimeout(clearPanelTransform, 240);
    }
  };

  if (!mounted) return null;

  const headerNode = (title || desc || onClose) ? (
    <div className="dr-header">
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div className="dr-title" id={titleId}>{title}</div>}
        {desc && <div className="dr-desc" id={descId}>{desc}</div>}
      </div>
      {onClose && (
        <button className="dr-close" type="button" onClick={() => onClose && onClose()} aria-label="Close drawer">
          <Icons.x size={16}/>
        </button>
      )}
    </div>
  ) : null;

  const cls = ['dr', side, 'variant-' + variant, className].filter(Boolean).join(' ');

  const panel = (
    <div
      ref={panelRef}
      className={cls}
      role="dialog"
      aria-modal={variant === 'overlay'}
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={desc ? descId : undefined}
      tabIndex={-1}
      style={style}
    >
      {variant === 'overlay' && isBottom ? (
        <div
          className="dr-drag"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          aria-label="Drag down to close"
        >
          <div className="dr-grip"><span className="bar"/></div>
          {headerNode}
        </div>
      ) : headerNode}
      <div className="dr-body">{children}</div>
      {footer && <div className="dr-footer">{footer}</div>}
    </div>
  );

  // INLINE — render in place, no portal, no overlay. Parent layout takes
  // care of giving it width via flex/grid.
  if (variant === 'inline') {
    return (
      <div className="dr-root variant-inline" data-state={state}>
        {panel}
      </div>
    );
  }

  // OVERLAY — portal to body to escape any flex parent that would shift.
  return ReactDOM.createPortal(
    <div className="dr-root variant-overlay" data-state={state}>
      <div className="dr-overlay" onClick={() => !persistent && onClose && onClose()}/>
      {panel}
    </div>,
    document.body,
  );
};
