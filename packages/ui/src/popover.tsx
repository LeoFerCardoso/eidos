import * as React from 'react';
import { cn } from './lib/utils';
import { Icons } from './icons';

// Eidos DS — Popover.
//
// Trigger element + anchored floating panel. Placement: top|bottom|start|end
// (logical) with viewport flip. Uses position:fixed + getBoundingClientRect
// to escape parent overflow:hidden (e.g. .ds-frame).
//
// Keyboard: Enter/Space opens; Esc + click-outside dismiss; focus moves into
// the panel on open and restores to the trigger on close.
//
// CSS lives in packages/ui/styles/tokens.css (.pop-* block).
// No <style> tag here — only className strings.

// ── Types ────────────────────────────────────────────────────────────────────

/** Logical placement — 'start' and 'end' follow the inline direction. */
export type PopoverSide = 'top' | 'bottom' | 'start' | 'end';

/** Alignment along the chosen side. */
export type PopoverAlign = 'start' | 'center' | 'end';

export interface PopoverProps {
  /** Controlled open state. */
  open?: boolean;
  /** Called when open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Initial open state for uncontrolled use. */
  defaultOpen?: boolean;
  /**
   * The trigger element. Receives ref, onClick, aria-expanded, aria-controls,
   * aria-haspopup automatically. Must be a DOM element (not a React fragment).
   */
  trigger: React.ReactElement;
  /** Logical side the panel appears on. Flips when it would overflow the viewport. */
  side?: PopoverSide;
  /** Alignment along the chosen side. */
  align?: PopoverAlign;
  /** Pixel gap between trigger edge and panel. */
  sideOffset?: number;
  /** Render a small indicator arrow pointing toward the trigger. */
  showArrow?: boolean;
  /**
   * Panel content. If a function, receives `{ close }` so child controls can
   * dismiss the popover (e.g. a Cancel button inside a footer).
   */
  children?: React.ReactNode | ((bag: { close: () => void }) => React.ReactNode);
  /** Extra classes on the panel. */
  className?: string;
  /**
   * Accessible name for headerless panels (no PopoverHeader).
   * When a PopoverHeader is present its title is used automatically via
   * aria-labelledby. Pass aria-label only for panels that have no header.
   */
  'aria-label'?: string;
}

// ── Geometry helpers ─────────────────────────────────────────────────────────

type Rect = { top: number; left: number; width: number; height: number };

/** Resolved logical side → visual side, accounting for dir="rtl". */
function resolveVisualSide(side: PopoverSide, isRtl: boolean): 'top' | 'bottom' | 'left' | 'right' {
  if (side === 'top') return 'top';
  if (side === 'bottom') return 'bottom';
  if (side === 'start') return isRtl ? 'right' : 'left';
  /* end */ return isRtl ? 'left' : 'right';
}

/** Flip the visual side when the panel would overflow the viewport on that edge. */
function flipIfNeeded(
  visual: 'top' | 'bottom' | 'left' | 'right',
  rect: Rect,
  panelW: number,
  panelH: number,
  gap: number,
): 'top' | 'bottom' | 'left' | 'right' {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (visual === 'bottom' && rect.top + rect.height + gap + panelH > vh && rect.top - gap - panelH > 0) return 'top';
  if (visual === 'top'    && rect.top - gap - panelH < 0 && rect.top + rect.height + gap + panelH < vh) return 'bottom';
  if (visual === 'right'  && rect.left + rect.width + gap + panelW > vw && rect.left - gap - panelW > 0) return 'left';
  if (visual === 'left'   && rect.left - gap - panelW < 0 && rect.left + rect.width + gap + panelW < vw) return 'right';
  return visual;
}

interface PanelPos {
  top: number;
  left: number;
  arrowTop?: number;
  arrowLeft?: number;
  arrowSide: 'top' | 'bottom' | 'left' | 'right';
}

function computePos(
  trigger: HTMLElement,
  panel: HTMLElement,
  visual: 'top' | 'bottom' | 'left' | 'right',
  align: PopoverAlign,
  gap: number,
  isRtl = false,
): PanelPos {
  const r = trigger.getBoundingClientRect();
  const pw = panel.offsetWidth;
  const ph = panel.offsetHeight;
  let top = 0;
  let left = 0;

  // In RTL, 'start' is the inline-end (right) edge, 'end' is the inline-start (left) edge.
  const hStart = isRtl ? (r.right - pw) : r.left;
  const hEnd   = isRtl ? r.left         : (r.right - pw);

  if (visual === 'bottom') {
    top = r.bottom + gap;
    if (align === 'start')  left = hStart;
    else if (align === 'end') left = hEnd;
    else left = r.left + r.width / 2 - pw / 2;
  } else if (visual === 'top') {
    top = r.top - ph - gap;
    if (align === 'start')  left = hStart;
    else if (align === 'end') left = hEnd;
    else left = r.left + r.width / 2 - pw / 2;
  } else if (visual === 'right') {
    left = r.right + gap;
    if (align === 'start')  top = r.top;
    else if (align === 'end') top = r.bottom - ph;
    else top = r.top + r.height / 2 - ph / 2;
  } else { /* left */
    left = r.left - pw - gap;
    if (align === 'start')  top = r.top;
    else if (align === 'end') top = r.bottom - ph;
    else top = r.top + r.height / 2 - ph / 2;
  }

  // Clamp to viewport with a 8px edge margin.
  const margin = 8;
  left = Math.max(margin, Math.min(left, window.innerWidth  - pw - margin));
  top  = Math.max(margin, Math.min(top,  window.innerHeight - ph - margin));

  // Arrow — points from the panel back toward the trigger.
  const arrowSide = ({ bottom: 'top', top: 'bottom', right: 'left', left: 'right' } as const)[visual];
  let arrowTop: number | undefined;
  let arrowLeft: number | undefined;
  if (visual === 'bottom' || visual === 'top') {
    arrowLeft = Math.max(10, Math.min(r.left + r.width / 2 - left - 5, pw - 20));
  } else {
    arrowTop = Math.max(10, Math.min(r.top + r.height / 2 - top - 5, ph - 20));
  }

  return { top, left, arrowTop, arrowLeft, arrowSide };
}

// ── Component ────────────────────────────────────────────────────────────────

export const Popover = ({
  open: openProp,
  onOpenChange,
  defaultOpen = false,
  trigger,
  side = 'bottom',
  align = 'start',
  sideOffset = 8,
  showArrow = false,
  children,
  className,
  'aria-label': ariaLabel,
}: PopoverProps) => {
  const isControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = isControlled ? (openProp as boolean) : internalOpen;

  const uid = React.useId();
  const panelId = `${uid}-panel`;
  const titleId = `${uid}-title`;

  const triggerRef = React.useRef<HTMLElement>(null);
  const panelRef   = React.useRef<HTMLDivElement>(null);
  const returnFocusRef = React.useRef<HTMLElement | null>(null);
  const [pos, setPos] = React.useState<PanelPos | null>(null);
  // hasTitle: set to true by PopoverHeader on mount; drives aria-labelledby.
  const [hasTitle, setHasTitle] = React.useState(false);

  const setOpen = React.useCallback((next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);

  const close = React.useCallback(() => setOpen(false), [setOpen]);

  // ── Position the panel ──────────────────────────────────────────────────

  const placePanel = React.useCallback(() => {
    const tEl = triggerRef.current;
    const pEl = panelRef.current;
    if (!tEl || !pEl) return;

    const isRtl = getComputedStyle(tEl).direction === 'rtl';
    const visualBase = resolveVisualSide(side, isRtl);
    const r = tEl.getBoundingClientRect();
    const visual = flipIfNeeded(visualBase, r, pEl.offsetWidth, pEl.offsetHeight, sideOffset);
    const p = computePos(tEl, pEl, visual, align, sideOffset, isRtl);
    setPos(p);
  }, [side, align, sideOffset]);

  React.useEffect(() => {
    if (!open) { setPos(null); return; }

    // After the panel renders, measure + position it.
    const frame = requestAnimationFrame(placePanel);

    // Re-anchor (don't close) when an ancestor or the page scrolls. Scrolls that
    // originate inside the panel itself (e.g. a scrollable list) are ignored, so
    // wheeling through the panel content never dismisses it.
    const onScroll = (e: Event) => {
      const t = e.target as Node | null;
      if (panelRef.current && t && panelRef.current.contains(t)) return;
      placePanel();
    };
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', placePanel);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', placePanel);
    };
  }, [open, placePanel]);

  // On open: capture trigger for focus-restore, then move focus into the panel.
  // On close: restore focus to the trigger.
  React.useEffect(() => {
    if (open) {
      // Capture before focus moves (triggerRef.current may already hold focus,
      // but capturing activeElement is more robust).
      returnFocusRef.current = document.activeElement as HTMLElement | null;
      // Double-rAF: let the panel mount + position before focusing.
      let raf1: number;
      let raf2: number;
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          const panel = panelRef.current;
          if (!panel) return;
          const FOCUSABLE_SEL =
            'button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),' +
            'textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
          const first = panel.querySelector<HTMLElement>(FOCUSABLE_SEL);
          (first ?? panel).focus();
        });
      });
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    } else {
      // Restore focus to the trigger when panel closes.
      const target = returnFocusRef.current;
      if (target && typeof target.focus === 'function') {
        const t = setTimeout(() => target.focus(), 10);
        return () => clearTimeout(t);
      }
    }
    return undefined;
  }, [open]);

  // Focus trap: Tab / Shift+Tab must wrap within the panel (role="dialog").
  React.useEffect(() => {
    if (!open) return;
    const FOCUSABLE_SEL =
      'button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),' +
      'textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      // Only trap when focus is currently inside the panel.
      if (!panel.contains(document.activeElement)) return;
      const nodes = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SEL));
      if (!nodes.length) { e.preventDefault(); return; }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  // ── Click-outside + Escape ──────────────────────────────────────────────

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t)) return;
      if (panelRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, setOpen]);

  // ── Clone trigger with ARIA props ───────────────────────────────────────

  const triggerEl = React.cloneElement(trigger, {
    ref: triggerRef,
    'aria-haspopup': 'dialog',
    'aria-expanded': open,
    'aria-controls': open ? panelId : undefined,
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      setOpen(!open);
      (trigger.props as React.HTMLAttributes<HTMLElement>).onClick?.(e as never);
    },
  } as React.HTMLAttributes<HTMLElement>);

  // ── Arrow style ─────────────────────────────────────────────────────────

  const arrowStyle: React.CSSProperties | undefined = pos && showArrow ? {
    top:    pos.arrowTop  !== undefined ? pos.arrowTop  : undefined,
    left:   pos.arrowLeft !== undefined ? pos.arrowLeft : undefined,
    [pos.arrowSide]: -5,
    borderTopColor:    (pos.arrowSide === 'bottom') ? 'var(--border-strong)' : 'transparent',
    borderBottomColor: (pos.arrowSide === 'top')    ? 'var(--border-strong)' : 'transparent',
    borderLeftColor:   (pos.arrowSide === 'right')  ? 'var(--border-strong)' : 'transparent',
    borderRightColor:  (pos.arrowSide === 'left')   ? 'var(--border-strong)' : 'transparent',
  } : undefined;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {triggerEl}
      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-modal="false"
          aria-labelledby={hasTitle ? titleId : undefined}
          aria-label={hasTitle ? undefined : ariaLabel}
          className={cn('pop', className)}
          style={
            pos
              ? { position: 'fixed', top: pos.top, left: pos.left }
              : { position: 'fixed', visibility: 'hidden' }
          }
        >
          {showArrow && pos && (
            <span className="pop-arrow" style={arrowStyle} aria-hidden="true"/>
          )}
          {/* Provide titleId + setHasTitle so PopoverHeader can register itself. */}
          <PopoverContext.Provider value={{ close, titleId, setHasTitle }}>
            {typeof children === 'function' ? children({ close }) : children}
          </PopoverContext.Provider>
        </div>
      )}
    </>
  );
};

// ── Context for compound sub-parts ───────────────────────────────────────────

interface PopoverContextValue { close: () => void; titleId: string; setHasTitle: (v: boolean) => void; }
const PopoverContext = React.createContext<PopoverContextValue>({ close: () => {}, titleId: '', setHasTitle: () => {} });

// ── Compound sub-parts ────────────────────────────────────────────────────────

export interface PopoverHeaderProps {
  children: React.ReactNode;
  /** Whether to render a close button. Defaults to true. */
  showClose?: boolean;
  /** aria-label for the close button. */
  closeLabel?: string;
}

/** Standard header row: title + close button. Uses the parent's titleId so
 *  the panel dialog is labelled by its heading automatically. */
export const PopoverHeader = ({
  children,
  showClose = true,
  closeLabel = 'Close',
}: PopoverHeaderProps) => {
  const { close, titleId, setHasTitle } = React.useContext(PopoverContext);
  // Register this title with the parent Popover so aria-labelledby resolves.
  React.useEffect(() => { setHasTitle(true); return () => setHasTitle(false); }, [setHasTitle]);
  return (
    <div className="pop-head">
      <div id={titleId} className="pop-title">{children}</div>
      {showClose && (
        <button
          type="button"
          className="pop-close"
          aria-label={closeLabel}
          onClick={close}
        >
          <Icons.x size={14} />
        </button>
      )}
    </div>
  );
};

export interface PopoverBodyProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/** Scrollable body area — free-form content, forms, previews. */
export const PopoverBody = ({ children, className, style }: PopoverBodyProps) => (
  <div className={cn('pop-body', className)} style={style}>{children}</div>
);

export interface PopoverFooterProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/** Footer row — typically Cancel + primary action, right-aligned (trailing edge). */
export const PopoverFooter = ({ children, className, style }: PopoverFooterProps) => (
  <div className={cn('pop-foot', className)} style={style}>{children}</div>
);
