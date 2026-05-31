import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { cn } from './lib/utils';

// Eidos DS — HoverCard.
//
// A rich hover-triggered card for previewing entities — users, links, refs.
// Larger than Tooltip (text-only), smaller than Popover (actions via click).
//
// Behaviour:
//   - Opens on mouseenter (delay: openDelay ms) or trigger focus.
//   - Closes on mouseleave (delay: closeDelay ms), blur, or Escape.
//   - Positions itself below the trigger, flips to "top" when bottom viewport
//     is clipped; align="start" maps to the inline-start edge — right in RTL
//     (reads getComputedStyle(trigger).direction at open time).
//   - Portal to document.body via React.createPortal so it escapes
//     parent overflow:hidden (e.g. .ds-frame).
//   - The panel is passive — no focus enters it; use Popover for actions.
//   - Reduced-motion: no translate animation, opacity-only.
//
// CSS classes live in packages/ui/styles/ds.css (.hc-* block).
// No <style> block here.

// ── Types ─────────────────────────────────────────────────────────────────────

export interface HoverCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Which side of the trigger to open on.
   * @default "bottom"
   */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /**
   * Alignment along the chosen axis.
   * @default "start"
   */
  align?: 'start' | 'center' | 'end';
  /** Gap in pixels between the trigger edge and the panel. @default 8 */
  sideOffset?: number;
  /** Minimum panel width in pixels. @default 240 */
  minWidth?: number;
  children?: React.ReactNode;
  className?: string;
}

export interface HoverCardProps {
  /** Controlled open state. Leave unset for uncontrolled behaviour. */
  open?: boolean;
  /** Called when the open state changes (controlled mode). */
  onOpenChange?: (open: boolean) => void;
  /** Uncontrolled initial open state. @default false */
  defaultOpen?: boolean;
  /** Milliseconds the pointer must hover before the card opens. @default 300 */
  openDelay?: number;
  /** Milliseconds after pointer leaves before the card closes. @default 200 */
  closeDelay?: number;
  /** The trigger element — rendered as-is, with event handlers injected. */
  trigger: React.ReactElement;
  /** The content rendered inside the floating panel. */
  children: React.ReactNode;
  /** Placement configuration forwarded to the panel. */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Alignment along the chosen side. @default "start" */
  align?: 'start' | 'center' | 'end';
  /** Gap in pixels between the trigger edge and the panel. @default 8 */
  sideOffset?: number;
  /** Minimum panel width in pixels. @default 240 */
  minWidth?: number;
  /** Extra className forwarded to the panel. */
  className?: string;
}

// ── Panel (internal) ──────────────────────────────────────────────────────────

interface PanelProps extends HoverCardContentProps {
  triggerRect: DOMRect;
  panelRef: React.RefObject<HTMLDivElement | null>;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  id: string;
  isVisible: boolean;
  /** Whether the reading direction is RTL. Used to swap start/end alignment. */
  isRtl?: boolean;
}

const SIDEOFFSET_DEFAULT = 8;
const MINWIDTH_DEFAULT = 240;

function Panel({
  triggerRect,
  panelRef,
  onMouseEnter,
  onMouseLeave,
  id,
  isVisible,
  isRtl = false,
  side = 'bottom',
  align = 'start',
  sideOffset = SIDEOFFSET_DEFAULT,
  minWidth = MINWIDTH_DEFAULT,
  children,
  className,
  ...rest
}: PanelProps) {
  const [rect, setRect] = React.useState<{ top: number; left: number } | null>(null);
  const [resolvedSide, setResolvedSide] = React.useState(side);

  React.useLayoutEffect(() => {
    // Calculate position based on trigger rect
    const panelEl = panelRef.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Panel estimated dimensions
    const panelW = Math.max(minWidth, panelEl ? panelEl.offsetWidth : minWidth);
    const panelH = panelEl ? panelEl.offsetHeight : 200;

    let top = 0;
    let left = 0;
    let actualSide = side;

    // In RTL, 'start' is the inline-end (right) edge; 'end' is the inline-start (left) edge.
    const hStart = isRtl ? (triggerRect.right - panelW) : triggerRect.left;
    const hEnd   = isRtl ? triggerRect.left              : (triggerRect.right - panelW);

    if (side === 'bottom' || side === 'top') {
      // Decide vertical side
      const spaceBelow = vh - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
      if (side === 'bottom') {
        if (spaceBelow < panelH + sideOffset && spaceAbove > spaceBelow) {
          actualSide = 'top';
        } else {
          actualSide = 'bottom';
        }
      } else {
        if (spaceAbove < panelH + sideOffset && spaceBelow > spaceAbove) {
          actualSide = 'bottom';
        } else {
          actualSide = 'top';
        }
      }

      top = actualSide === 'bottom'
        ? triggerRect.bottom + sideOffset
        : triggerRect.top - sideOffset - panelH;

      // Horizontal alignment — direction-aware
      if (align === 'start') {
        left = hStart;
      } else if (align === 'end') {
        left = hEnd;
      } else {
        left = triggerRect.left + triggerRect.width / 2 - panelW / 2;
      }
    } else if (side === 'left' || side === 'right') {
      if (side === 'right') {
        const spaceRight = vw - triggerRect.right;
        const spaceLeft = triggerRect.left;
        actualSide = spaceRight < panelW + sideOffset && spaceLeft > spaceRight ? 'left' : 'right';
      } else {
        const spaceLeft = triggerRect.left;
        const spaceRight = vw - triggerRect.right;
        actualSide = spaceLeft < panelW + sideOffset && spaceRight > spaceLeft ? 'right' : 'left';
      }
      left = actualSide === 'right'
        ? triggerRect.right + sideOffset
        : triggerRect.left - sideOffset - panelW;

      if (align === 'start') {
        top = triggerRect.top;
      } else if (align === 'end') {
        top = triggerRect.bottom - panelH;
      } else {
        top = triggerRect.top + triggerRect.height / 2 - panelH / 2;
      }
    }

    // Clamp to viewport with 8px margin
    left = Math.max(8, Math.min(left, vw - panelW - 8));
    top = Math.max(8, top);

    setResolvedSide(actualSide);
    setRect({ top, left });
  }, [triggerRect, side, align, sideOffset, minWidth, panelRef]);

  const sideAttr = `hc-side-${resolvedSide}`;

  return (
    <div
      ref={panelRef}
      id={id}
      role="tooltip"
      data-side={resolvedSide}
      className={cn('hc-panel', sideAttr, isVisible && 'hc-visible', className)}
      style={{
        position: 'fixed',
        top: rect ? rect.top : -9999,
        left: rect ? rect.left : -9999,
        minWidth,
        // Use --z-popover level (60) — hover cards sit above content, below modals.
        zIndex: 60,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...rest}
    >
      {children}
    </div>
  );
}

// ── HoverCard ─────────────────────────────────────────────────────────────────

/**
 * HoverCard — rich hover-triggered panel for previewing an entity.
 *
 * Use for: @-mention previews, link previews, commit/ref previews.
 * Do not use for: actions (use Popover), one-line hints (use Tooltip).
 *
 * @example
 * <HoverCard trigger={<a href="/users/ada">@ada</a>}>
 *   <AvatarCard name="Ada Lovelace" handle="@ada" />
 * </HoverCard>
 */
export const HoverCard = React.forwardRef<HTMLSpanElement, HoverCardProps>(
  (
    {
      open: openProp,
      onOpenChange,
      defaultOpen = false,
      openDelay = 300,
      closeDelay = 200,
      trigger,
      children,
      side = 'bottom',
      align = 'start',
      sideOffset = SIDEOFFSET_DEFAULT,
      minWidth = MINWIDTH_DEFAULT,
      className,
    },
    ref,
  ) => {
    const isControlled = openProp !== undefined;
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const open = isControlled ? openProp! : internalOpen;

    const openTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const triggerRef = React.useRef<HTMLElement>(null);
    const panelRef = React.useRef<HTMLDivElement>(null);
    const [triggerRect, setTriggerRect] = React.useState<DOMRect | null>(null);
    const [mounted, setMounted] = React.useState(false);
    const [visible, setVisible] = React.useState(false);
    const [isRtl, setIsRtl] = React.useState(false);

    const panelId = React.useId();

    const setOpen = React.useCallback(
      (next: boolean) => {
        if (!isControlled) setInternalOpen(next);
        onOpenChange?.(next);
      },
      [isControlled, onOpenChange],
    );

    const scheduleOpen = React.useCallback(() => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      openTimerRef.current = setTimeout(() => {
        if (triggerRef.current) {
          setTriggerRect(triggerRef.current.getBoundingClientRect());
          // Read direction once at open time so Panel knows how to align.
          setIsRtl(getComputedStyle(triggerRef.current).direction === 'rtl');
        }
        setMounted(true);
        setOpen(true);
        // Defer visibility so browser can measure panel before fade-in
        requestAnimationFrame(() => setVisible(true));
      }, openDelay);
    }, [openDelay, setOpen]);

    const scheduleClose = React.useCallback(() => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      closeTimerRef.current = setTimeout(() => {
        setVisible(false);
        // Unmount after transition (180ms)
        setTimeout(() => {
          setMounted(false);
          setOpen(false);
        }, 180);
      }, closeDelay);
    }, [closeDelay, setOpen]);

    // Cancel timers on unmount
    React.useEffect(
      () => () => {
        if (openTimerRef.current) clearTimeout(openTimerRef.current);
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      },
      [],
    );

    // Sync controlled state
    React.useEffect(() => {
      if (!isControlled) return;
      if (openProp) {
        if (triggerRef.current) {
          setTriggerRect(triggerRef.current.getBoundingClientRect());
          setIsRtl(getComputedStyle(triggerRef.current).direction === 'rtl');
        }
        setMounted(true);
        requestAnimationFrame(() => setVisible(true));
      } else {
        setVisible(false);
        setTimeout(() => setMounted(false), 180);
      }
    }, [isControlled, openProp]);

    // Close on Escape
    React.useEffect(() => {
      if (!open) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          scheduleClose();
          // Immediate for Escape
          if (openTimerRef.current) clearTimeout(openTimerRef.current);
          if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
          setVisible(false);
          setTimeout(() => {
            setMounted(false);
            setOpen(false);
          }, 180);
        }
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }, [open, scheduleClose, setOpen]);

    // Update triggerRect on scroll/resize
    React.useEffect(() => {
      if (!open) return;
      const update = () => {
        if (triggerRef.current) {
          setTriggerRect(triggerRef.current.getBoundingClientRect());
        }
      };
      window.addEventListener('scroll', update, true);
      window.addEventListener('resize', update);
      return () => {
        window.removeEventListener('scroll', update, true);
        window.removeEventListener('resize', update);
      };
    }, [open]);

    // Inject handlers onto the trigger element
    const triggerEl = React.cloneElement(trigger, {
      ref: triggerRef,
      'aria-describedby': open ? panelId : undefined,
      onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
        scheduleOpen();
        (trigger.props as React.HTMLAttributes<HTMLElement>).onMouseEnter?.(e);
      },
      onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
        scheduleClose();
        (trigger.props as React.HTMLAttributes<HTMLElement>).onMouseLeave?.(e);
      },
      onFocus: (e: React.FocusEvent<HTMLElement>) => {
        scheduleOpen();
        (trigger.props as React.HTMLAttributes<HTMLElement>).onFocus?.(e);
      },
      onBlur: (e: React.FocusEvent<HTMLElement>) => {
        // Only close if focus is not moving into the panel
        if (!panelRef.current?.contains(e.relatedTarget as Node)) {
          scheduleClose();
        }
        (trigger.props as React.HTMLAttributes<HTMLElement>).onBlur?.(e);
      },
    } as React.HTMLAttributes<HTMLElement>);

    const panel =
      mounted && triggerRect
        ? ReactDOM.createPortal(
            <Panel
              id={panelId}
              triggerRect={triggerRect}
              panelRef={panelRef}
              side={side}
              align={align}
              sideOffset={sideOffset}
              minWidth={minWidth}
              className={className}
              isVisible={visible}
              isRtl={isRtl}
              onMouseEnter={() => {
                if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
              }}
              onMouseLeave={scheduleClose}
            >
              {children}
            </Panel>,
            document.body,
          )
        : null;

    return (
      <span ref={ref} className="hc-root">
        {triggerEl}
        {panel}
      </span>
    );
  },
);

HoverCard.displayName = 'HoverCard';
