import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { cn } from './lib/utils';
import { Icons } from './icons';

// Eidos DS — Alert Dialog
//
// A blocking modal that demands an explicit answer. Unlike Modal:
//   - The backdrop is inert — clicking outside does NOT close the dialog.
//   - Escape key triggers the Cancel (safe) action by default (pass
//     onEscapeKeyDown to override for truly custom workflows).
//   - There is no X close button.
//   - Initial focus lands on the CANCEL/safe action, not the destructive one.
//   - The confirm button can be destructive (danger) or confirming (ember).
//
// ARIA: role="alertdialog", aria-modal="true", aria-labelledby, aria-describedby.
// Focus management: trap on open, restore on close.
//
// CSS lives in packages/ui/styles/ds.css (.adlg-* block).
// No <style> block here — emit className strings only.

// ── Types ─────────────────────────────────────────────────────────────────────

export type AlertDialogVariant = 'warning' | 'danger' | 'info';

export interface AlertDialogProps {
  /** Controlled open state. */
  open: boolean;
  /** Called when the dialog requests to close (always from a button press). */
  onOpenChange?: (open: boolean) => void;
  /** Semantic variant — drives the icon tile colour and default confirm style. */
  variant?: AlertDialogVariant;
  /** The question to ask the user. Keep it specific ("Delete eidos-api?"). */
  title: React.ReactNode;
  /**
   * The consequence — what happens and whether it's reversible.
   * One short paragraph.
   */
  description?: React.ReactNode;
  /** Label for the cancel / safe action. Receives initial focus. */
  cancelLabel?: string;
  /** Label for the confirm / primary action. */
  confirmLabel?: string;
  /**
   * Called when the user clicks the confirm button (or presses Enter while
   * that button is focused). The dialog does NOT auto-close — call
   * onOpenChange(false) inside your handler when the operation completes.
   */
  onConfirm?: () => void;
  /**
   * Called when the user clicks the cancel button. The dialog closes
   * automatically (onOpenChange(false) is also fired).
   */
  onCancel?: () => void;
  /**
   * Override the default no-op Escape handler. The alert-dialog contract
   * requires that Escape does NOT close by default — only provide this when
   * you have a specific "treat Escape as cancel" workflow.
   */
  onEscapeKeyDown?: (e: KeyboardEvent) => void;
  /** Extra classes merged onto the panel element. */
  className?: string;
}

// ── Focus trap utility ────────────────────────────────────────────────────────

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

function trapFocus(container: HTMLElement, e: KeyboardEvent) {
  // Guard: only trap if focus is currently inside the panel.
  if (!container.contains(document.activeElement)) return;
  const nodes = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));
  if (!nodes.length) return;
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  if (e.key !== 'Tab') return;
  if (e.shiftKey) {
    if (document.activeElement === first) { e.preventDefault(); last.focus(); }
  } else {
    if (document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<AlertDialogVariant, React.ReactNode> = {
  warning: <Icons.alert size={18} />,
  danger:  <Icons.alert size={18} />,
  info:    <Icons.info  size={18} />,
};

export const AlertDialog = React.forwardRef<HTMLDivElement, AlertDialogProps>(
  (
    {
      open,
      onOpenChange,
      variant = 'warning',
      title,
      description,
      cancelLabel = 'Cancel',
      confirmLabel = 'Confirm',
      onConfirm,
      onCancel,
      onEscapeKeyDown,
      className,
    },
    ref,
  ) => {
    const panelRef = React.useRef<HTMLDivElement>(null);
    const cancelBtnRef = React.useRef<HTMLButtonElement>(null);
    const [mounted, setMounted] = React.useState(false);

    // Unique ids for ARIA wiring.
    const id = React.useId();
    const titleId = `${id}-title`;
    const descId = `${id}-desc`;

    // Save the element that triggered the dialog so we can restore focus.
    const returnFocusRef = React.useRef<Element | null>(null);

    // ── Mount / unmount lifecycle ─────────────────────────────────────────────

    React.useEffect(() => {
      if (open) {
        returnFocusRef.current = document.activeElement;
        setMounted(true);
      } else {
        setMounted(false);
        // Restore focus to the element that opened the dialog.
        const el = returnFocusRef.current as HTMLElement | null;
        if (el && typeof el.focus === 'function') {
          // Defer one tick so the portal has unmounted first.
          const t = setTimeout(() => el.focus(), 10);
          return () => clearTimeout(t);
        }
      }
      return undefined;
    }, [open]);

    // Initial focus: land on Cancel (the safe action) using double-rAF
    // to avoid the focus-before-paint race.
    React.useEffect(() => {
      if (!mounted) return undefined;
      let raf1: number;
      let raf2: number;
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          cancelBtnRef.current?.focus();
        });
      });
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }, [mounted]);

    // ── Body scroll-lock (mirrors modal.tsx) ──────────────────────────────────

    React.useEffect(() => {
      if (!mounted) return;
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }, [mounted]);

    // ── AT isolation — inert + aria-hidden on sibling roots ───────────────────
    // Mirrors modal.tsx so AT cannot navigate behind the dialog.

    React.useEffect(() => {
      if (!mounted) return;
      const siblings = Array.from(document.body.children).filter(
        (el) => el !== panelRef.current?.closest('[data-adlg-portal]'),
      ) as HTMLElement[];
      const restoreMap: Array<{ el: HTMLElement; inert: boolean; ariaHidden: string | null }> = [];
      for (const el of siblings) {
        // Don't touch the portal container itself (the overlay div is a direct body child).
        if (panelRef.current && el.contains(panelRef.current)) continue;
        restoreMap.push({ el, inert: el.inert ?? false, ariaHidden: el.getAttribute('aria-hidden') });
        el.inert = true;
        el.setAttribute('aria-hidden', 'true');
      }
      return () => {
        for (const { el, inert, ariaHidden } of restoreMap) {
          el.inert = inert;
          if (ariaHidden === null) el.removeAttribute('aria-hidden');
          else el.setAttribute('aria-hidden', ariaHidden);
        }
      };
    }, [mounted]);

    // ── Action handlers ───────────────────────────────────────────────────────
    // Defined before the keyboard effect so ESC can call handleCancel directly.

    const handleCancel = React.useCallback(() => {
      onCancel?.();
      onOpenChange?.(false);
    }, [onCancel, onOpenChange]);

    const handleConfirm = () => {
      onConfirm?.();
      // Note: we do NOT auto-close on confirm — the caller controls this after
      // the async operation resolves. If they want immediate close, they call
      // onOpenChange(false) inside onConfirm.
    };

    // ── Keyboard model ────────────────────────────────────────────────────────

    React.useEffect(() => {
      if (!mounted) return;

      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          if (onEscapeKeyDown) {
            // Caller opted in to custom ESC handling.
            onEscapeKeyDown(e);
          } else {
            // ESC = safe action (Cancel). The alert-dialog contract treats Escape
            // as equivalent to pressing Cancel — the safe, non-destructive path.
            e.preventDefault();
            handleCancel();
          }
          return;
        }
        if (e.key === 'Tab' && panelRef.current) {
          trapFocus(panelRef.current, e);
        }
      };

      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }, [mounted, onEscapeKeyDown, handleCancel]);

    // ── Render ────────────────────────────────────────────────────────────────

    if (!mounted) return null;

    const confirmClass = variant === 'danger' ? 'btn destructive' : 'btn ember';

    const panel = (
      <div
        className="adlg-overlay"
        role="presentation"
        // The overlay is intentionally inert — no onClick handler.
        aria-hidden="false"
      >
        <div
          ref={(node) => {
            panelRef.current = node as HTMLDivElement;
            if (typeof ref === 'function') ref(node as HTMLDivElement);
            else if (ref) ref.current = node as HTMLDivElement;
          }}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descId : undefined}
          className={cn('adlg', variant, className)}
        >
          {/* Header row: icon tile + title + description */}
          <div className="adlg-header">
            <span className="adlg-icon" aria-hidden="true">
              {ICON_MAP[variant]}
            </span>
            <div className="adlg-copy">
              <h2 id={titleId} className="adlg-title">{title}</h2>
              {description && (
                <p id={descId} className="adlg-desc">{description}</p>
              )}
            </div>
          </div>

          {/* Action row: safe action leads, confirm trails */}
          <div className="adlg-actions">
            <button
              ref={cancelBtnRef}
              type="button"
              className="btn ghost"
              onClick={handleCancel}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              className={confirmClass}
              onClick={handleConfirm}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    );

    // Portal to document.body — escapes any parent overflow/stacking context.
    return typeof document !== 'undefined'
      ? ReactDOM.createPortal(panel, document.body)
      : null;
  },
);

AlertDialog.displayName = 'AlertDialog';
