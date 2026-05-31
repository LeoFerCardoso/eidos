import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { cn } from './lib/utils';
import { Icons } from './icons';
// Forge DS — Modal.
//
// A centered overlay panel for self-contained flows the user can back out of:
// quick edits, share dialogs, attachments, media previews, announcements.
//
// Key behaviours:
//   • Portals to document.body — escapes any parent overflow:hidden.
//   • Enter/exit animation (opacity + scale) collapses to opacity-only under
//     prefers-reduced-motion.
//   • Full focus trap: Tab / Shift+Tab cycle only within the panel; focus
//     returns to the trigger element on close.
//   • ESC closes (configurable via closeOnEsc).
//   • Backdrop click closes (configurable via closeOnBackdrop).
//   • Body scroll-lock while open.
//   • role=dialog aria-modal=true with aria-labelledby / aria-describedby wired
//     to title / desc.
//   • Sizes: sm (380px) · md (480px, default) · lg (640px) · xl (820px).
//   • Hero slot: full-bleed media/illustration above the header.
//   • Logical CSS properties throughout → RTL-correct by default.
//
// CSS classes live in the shared stylesheet (.mdl-* block).
// No <style> block here — emit className strings only.

// ── Types ────────────────────────────────────────────────────────────────────

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';
export type ModalIconTone = 'info' | 'success' | 'warning' | 'danger';

export interface ModalProps {
  /** Controlled open state. */
  open: boolean;
  /** Called when the modal requests to close (ESC, backdrop, X button). */
  onOpenChange: (open: boolean) => void;
  /** Panel width preset. Defaults to "md" (480 px). */
  size?: ModalSize;
  /** Title text — wired to aria-labelledby on the panel. */
  title?: React.ReactNode;
  /** Optional subtitle / description below the title. */
  desc?: React.ReactNode;
  /**
   * Leading icon component (e.g. Icons.alert). Renders a 36×36 tinted square
   * beside the title. Suppressed when `hero` is provided.
   */
  icon?: React.ComponentType<{ size?: number }>;
  /** Semantic tone for the icon badge. Defaults to "info". */
  iconTone?: ModalIconTone;
  /**
   * Full-bleed slot rendered above the header. Pass a <div className="mdl-hero"/>
   * or any React node. The X button floats over it when set.
   */
  hero?: React.ReactNode;
  /** Show the X close button. Defaults to true. */
  showClose?: boolean;
  /** Close when the user clicks the backdrop. Defaults to true. */
  closeOnBackdrop?: boolean;
  /** Close when the user presses ESC. Defaults to true. */
  closeOnEsc?: boolean;
  /**
   * Footer slot — pinned to the bottom of the panel, tinted with --surface.
   * Pass your Cancel / primary action buttons here.
   */
  footer?: React.ReactNode;
  /** Panel body. */
  children?: React.ReactNode;
  /** Extra classes merged onto the panel root (.mdl). */
  className?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Returns all focusable elements inside a container, in DOM order. */
function getFocusable(root: HTMLElement): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),' +
      'textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => !el.closest('[aria-hidden="true"]'));
}

// ── Component ────────────────────────────────────────────────────────────────

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onOpenChange,
      size = 'md',
      title,
      desc,
      icon: IconComp,
      iconTone = 'info',
      hero,
      showClose = true,
      closeOnBackdrop = true,
      closeOnEsc = true,
      footer,
      children,
      className,
    },
    ref,
  ) => {
    // Mounted tracks whether the DOM tree is present (persists briefly during
    // the exit transition so the CSS animation can play out).
    const [mounted, setMounted] = React.useState(open);
    const [state, setState] = React.useState<'open' | 'closed'>(
      open ? 'open' : 'closed',
    );

    const panelRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLElement | null>(null);
    // Track the previous open value to detect true open→close transitions.
    const prevOpenRef = React.useRef<boolean>(open);

    // Merge forwarded ref with internal ref.
    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        (panelRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref],
    );

    // Unique ids for aria-labelledby / aria-describedby.
    const uid = React.useId();
    const titleId = `mdl-title-${uid}`;
    const descId = `mdl-desc-${uid}`;

    // ── Open/close lifecycle ──────────────────────────────────────────────

    React.useEffect(() => {
      if (open) {
        // Capture the element that had focus at the moment the modal opens
        // (i.e. the trigger button). Only capture on open transitions.
        if (!prevOpenRef.current) {
          triggerRef.current = document.activeElement as HTMLElement | null;
        }
        prevOpenRef.current = true;
        setMounted(true);
        // Double-rAF so the browser has committed the initial paint before the
        // open class lands and the CSS transition fires.
        const id = requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            setState('open');
            // Move focus to the first focusable inside the panel (or the panel itself).
            if (panelRef.current) {
              const first = getFocusable(panelRef.current)[0];
              (first ?? panelRef.current).focus();
            }
          }),
        );
        return () => cancelAnimationFrame(id);
      } else {
        // Only restore focus on a real open→close transition.
        if (prevOpenRef.current) {
          const target = triggerRef.current;
          if (target && typeof target.focus === 'function') {
            // Defer past the exit-animation unmount tick.
            const t = window.setTimeout(() => target.focus(), 10);
            prevOpenRef.current = false;
            setState('closed');
            const unmountT = window.setTimeout(() => setMounted(false), 260);
            return () => {
              window.clearTimeout(t);
              window.clearTimeout(unmountT);
            };
          }
        }
        prevOpenRef.current = false;
        setState('closed');
        const t = window.setTimeout(() => setMounted(false), 260);
        return () => window.clearTimeout(t);
      }
    }, [open]);

    // ── Body scroll-lock ──────────────────────────────────────────────────

    React.useEffect(() => {
      if (!mounted) return;
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }, [mounted]);

    // ── Keyboard handlers ─────────────────────────────────────────────────

    // ESC dismiss.
    React.useEffect(() => {
      if (!mounted || !closeOnEsc) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onOpenChange(false);
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }, [mounted, closeOnEsc, onOpenChange]);

    // Focus trap: Tab / Shift+Tab cycle within the panel.
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusable = getFocusable(panelRef.current);
      if (focusable.length === 0) { e.preventDefault(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    if (!mounted) return null;

    // ── ARIA ──────────────────────────────────────────────────────────────

    const hasTitle = !!title;
    const hasDesc = !!desc;

    // ── Render ────────────────────────────────────────────────────────────

    return ReactDOM.createPortal(
      <div
        className="mdl-root"
        data-state={state}
        // aria-hidden: while closed (exit animation), the whole tree is hidden from AT.
        aria-hidden={state === 'closed' ? 'true' : 'false'}
      >
        {/* Backdrop / scrim */}
        <div
          className="mdl-overlay"
          onClick={closeOnBackdrop ? () => onOpenChange(false) : undefined}
          aria-hidden="true"
        />
        {/* Stage — flex-centers the panel; click-outside on the stage itself */}
        <div
          className="mdl-stage"
          onClick={(e) => {
            if (closeOnBackdrop && e.target === e.currentTarget) onOpenChange(false);
          }}
        >
          {/* Panel */}
          <div
            ref={setRefs}
            className={cn('mdl', className)}
            data-size={size}
            role="dialog"
            aria-modal="true"
            aria-labelledby={hasTitle ? titleId : undefined}
            aria-describedby={hasDesc ? descId : undefined}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
          >
            {/* Hero (full-bleed slot above header) */}
            {hero}

            {/* Close button over hero (floats, absolute) */}
            {hero && showClose && (
              <button
                className="mdl-close over-hero"
                type="button"
                onClick={() => onOpenChange(false)}
                aria-label="Close"
              >
                <Icons.x size={16} />
              </button>
            )}

            {/* Header */}
            {(hasTitle || hasDesc || IconComp || (showClose && !hero)) && (
              <div className={cn('mdl-header', IconComp && 'with-icon')}>
                {IconComp && (
                  <span className={cn('mdl-icon', iconTone)} aria-hidden="true">
                    <IconComp size={18} />
                  </span>
                )}
                <div className="mdl-titles">
                  {hasTitle && (
                    <h2 className="mdl-title" id={titleId}>{title}</h2>
                  )}
                  {hasDesc && (
                    <p className="mdl-desc" id={descId}>{desc}</p>
                  )}
                </div>
                {showClose && !hero && (
                  <button
                    className="mdl-close"
                    type="button"
                    onClick={() => onOpenChange(false)}
                    aria-label="Close"
                  >
                    <Icons.x size={16} />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="mdl-body">{children}</div>

            {/* Footer */}
            {footer && <div className="mdl-footer">{footer}</div>}
          </div>
        </div>
      </div>,
      document.body,
    );
  },
);

Modal.displayName = 'Modal';
