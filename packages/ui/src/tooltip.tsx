import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { cn } from './lib/utils';

// Forge DS — Tooltip
//
// Hover + keyboard-focus triggered tooltip with:
//   - Configurable open delay (~500ms) and close delay
//   - role=tooltip + aria-describedby wiring
//   - position:fixed + getBoundingClientRect to escape overflow:hidden
//   - Placement with edge-flip (top/right/bottom/left)
//   - ESC dismissal; pointer-events:none on bubble
//   - prefers-reduced-motion: instant appear, no slide
//   - Controlled + uncontrolled mode
//
// CSS lives in packages/ui/styles/ds.css (.tip-* block) — no <style> here.

// ── Types ─────────────────────────────────────────────────────────────────────

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';
export type TooltipAlign = 'start' | 'center' | 'end';

export interface TooltipProps {
  /** Tooltip text. One short line, sentence case, no punctuation. */
  content: React.ReactNode;
  /** The trigger — typically an icon-only button or interactive element. Must be focusable. */
  children: React.ReactElement;
  /** Placement relative to the trigger. Auto-flips when the bubble clips the viewport. */
  side?: TooltipSide;
  /** Alignment along the chosen side. */
  align?: TooltipAlign;
  /** Milliseconds before the tooltip opens on hover. Default 500. */
  delayDuration?: number;
  /** Milliseconds before the tooltip closes after hover-out. Default 100. */
  closeDelayDuration?: number;
  /** Force the open state (controlled). */
  open?: boolean;
  /** Called when the controlled open state should change. */
  onOpenChange?: (open: boolean) => void;
  /** Extra CSS classes merged via cn() on the tooltip bubble. */
  className?: string;
}

// ── ID counter ────────────────────────────────────────────────────────────────

let _counter = 0;
function nextId() { return `tip-${++_counter}`; }

// ── Position math ─────────────────────────────────────────────────────────────

const VIEWPORT_MARGIN = 8;

interface BubblePos { top: number; left: number; resolvedSide: TooltipSide; }

function computePosition(
  trigger: DOMRect,
  bw: number,
  bh: number,
  side: TooltipSide,
  align: TooltipAlign,
  gap = 6,
  isRtl = false,
): BubblePos {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cx = trigger.left + trigger.width / 2;
  const cy = trigger.top + trigger.height / 2;

  // RTL: 'start' is the inline-end (right) edge; 'end' is the inline-start (left) edge.
  const hAlign = () => {
    if (align === 'start') return isRtl ? (trigger.right - bw) : trigger.left;
    if (align === 'end')   return isRtl ? trigger.left          : (trigger.right - bw);
    return cx - bw / 2;
  };
  const vAlign = () => {
    // Block-axis alignment is not affected by RTL.
    if (align === 'start') return trigger.top;
    if (align === 'end') return trigger.bottom - bh;
    return cy - bh / 2;
  };

  let resolvedSide = side;
  let top = 0;
  let left = 0;

  if (side === 'top' || side === 'bottom') {
    if (side === 'top' && trigger.top - bh - gap < VIEWPORT_MARGIN && trigger.bottom + bh + gap < vh - VIEWPORT_MARGIN) {
      resolvedSide = 'bottom';
    } else if (side === 'bottom' && trigger.bottom + bh + gap > vh - VIEWPORT_MARGIN && trigger.top - bh - gap > VIEWPORT_MARGIN) {
      resolvedSide = 'top';
    }
    top = resolvedSide === 'top' ? trigger.top - bh - gap : trigger.bottom + gap;
    left = Math.max(VIEWPORT_MARGIN, Math.min(hAlign(), vw - bw - VIEWPORT_MARGIN));
  } else {
    if (side === 'left' && trigger.left - bw - gap < VIEWPORT_MARGIN && trigger.right + bw + gap < vw - VIEWPORT_MARGIN) {
      resolvedSide = 'right';
    } else if (side === 'right' && trigger.right + bw + gap > vw - VIEWPORT_MARGIN && trigger.left - bw - gap > VIEWPORT_MARGIN) {
      resolvedSide = 'left';
    }
    left = resolvedSide === 'left' ? trigger.left - bw - gap : trigger.right + gap;
    top = Math.max(VIEWPORT_MARGIN, Math.min(vAlign(), vh - bh - VIEWPORT_MARGIN));
  }

  return { top, left, resolvedSide };
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Tooltip — short contextual hint shown on hover or keyboard focus.
 *
 * ```tsx
 * <Tooltip content="Search (⌘K)">
 *   <button className="btn icon" aria-label="Search">
 *     <Icons.search size={14} />
 *   </button>
 * </Tooltip>
 * ```
 */
export const Tooltip = ({
  content,
  children,
  side = 'top',
  align = 'center',
  delayDuration = 500,
  closeDelayDuration = 100,
  open: openProp,
  onOpenChange,
  className,
}: TooltipProps): React.ReactElement => {
  const id = React.useRef(nextId()).current;
  const isControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = isControlled ? (openProp as boolean) : internalOpen;

  const [pos, setPos] = React.useState<BubblePos | null>(null);

  const triggerRef = React.useRef<HTMLElement | null>(null);
  const bubbleRef = React.useRef<HTMLDivElement | null>(null);
  const openTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = React.useRef(false);

  // Track prefers-reduced-motion
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => { reducedMotion.current = e.matches; };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const setOpen = React.useCallback((next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);

  // ── Position ──────────────────────────────────────────────────────────────

  const recalc = React.useCallback(() => {
    if (!triggerRef.current || !bubbleRef.current) return;
    const tr = triggerRef.current.getBoundingClientRect();
    const bw = bubbleRef.current.offsetWidth || 1;
    const bh = bubbleRef.current.offsetHeight || 1;
    const isRtl = getComputedStyle(triggerRef.current).direction === 'rtl';
    setPos(computePosition(tr, bw, bh, side, align, 6, isRtl));
  }, [side, align]);

  React.useLayoutEffect(() => {
    if (!open) { setPos(null); return; }
    // One frame to let the bubble mount
    const raf = requestAnimationFrame(recalc);
    return () => cancelAnimationFrame(raf);
  }, [open, recalc]);

  // Re-position on scroll/resize while open
  React.useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('scroll', close, { capture: true, passive: true });
    window.addEventListener('resize', close, { passive: true });
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open, setOpen]);

  // ESC dismissal
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); setOpen(false); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  // Cleanup timers on unmount
  React.useEffect(() => () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  // ── Timer helpers ─────────────────────────────────────────────────────────

  const clearTimers = () => {
    if (openTimer.current) { clearTimeout(openTimer.current); openTimer.current = null; }
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
  };

  const scheduleOpen = () => {
    clearTimers();
    if (reducedMotion.current || delayDuration === 0) {
      setOpen(true);
    } else {
      openTimer.current = setTimeout(() => setOpen(true), delayDuration);
    }
  };

  const scheduleClose = () => {
    clearTimers();
    if (closeDelayDuration === 0) {
      setOpen(false);
    } else {
      closeTimer.current = setTimeout(() => setOpen(false), closeDelayDuration);
    }
  };

  // ── Clone trigger with events + ARIA ──────────────────────────────────────

  const child = React.Children.only(children);

  const trigger = React.cloneElement(child as React.ReactElement<
    React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }
  >, {
    ref: (node: HTMLElement | null) => {
      (triggerRef as React.MutableRefObject<HTMLElement | null>).current = node;
      const childRef = (child as unknown as { ref?: React.Ref<HTMLElement> }).ref;
      if (typeof childRef === 'function') childRef(node);
      else if (childRef && typeof childRef === 'object') {
        (childRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    },
    'aria-describedby': open ? id : (child.props as Record<string, unknown>)['aria-describedby'] as string | undefined,
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      scheduleOpen();
      (child.props as React.HTMLAttributes<HTMLElement>).onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      scheduleClose();
      (child.props as React.HTMLAttributes<HTMLElement>).onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      clearTimers();
      setOpen(true);
      (child.props as React.HTMLAttributes<HTMLElement>).onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      scheduleClose();
      (child.props as React.HTMLAttributes<HTMLElement>).onBlur?.(e);
    },
  });

  // ── Bubble ────────────────────────────────────────────────────────────────

  const bubble = (
    <div
      ref={bubbleRef}
      id={id}
      role="tooltip"
      className={cn(
        'tip-bubble',
        pos ? 'tip-visible' : 'tip-measuring',
        reducedMotion.current ? 'tip-instant' : '',
        className,
      )}
      style={pos ? { top: pos.top, left: pos.left } : undefined}
      // WCAG 1.4.13 — hoverable: entering the bubble cancels close, leaving reschedules.
      onMouseEnter={() => {
        if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
      }}
      onMouseLeave={() => {
        scheduleClose();
      }}
    >
      {content}
    </div>
  );

  return (
    <>
      {trigger}
      {open && typeof document !== 'undefined'
        ? ReactDOM.createPortal(bubble, document.body)
        : null}
    </>
  ) as React.ReactElement;
};

Tooltip.displayName = 'Tooltip';
