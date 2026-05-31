import * as React from 'react';
import { cn } from '@/lib/utils';
import * as ReactDOM from 'react-dom';
import { Command } from '@/components/forge/command';

interface CommandProps {
  /** Grouped item list (required for any real usage). */
  groups: CommandGroup[];
  /** Controlled search query. Pass with `onQueryChange` for controlled mode. */
  query?: string;
  /** Called when the search input changes. */
  onQueryChange?: (query: string) => void;
  /** Uncontrolled default search query. */
  defaultQuery?: string;
  /**
   * Called when an item is selected (Enter or click).
   * Receives the CommandItem.id. Close the palette from this callback.
   */
  onSelect?: (id: string) => void;
  /** Placeholder string for the search input. */
  placeholder?: string;
  /**
   * Content rendered inside the footer bar.
   * Defaults to the standard Up/Down/Enter/Esc key hints.
   */
  footer?: React.ReactNode;
  /** Extra classes merged onto the root wrapper. */
  className?: string;
}

interface CommandDialogProps extends CommandProps {
  /** Controls visibility of the dialog. */
  open: boolean;
  /** Called when the dialog requests to close (ESC or backdrop click). */
  onOpenChange: (open: boolean) => void;
  /** Accessible dialog title — announced to screen readers. Defaults to "Command palette". */
  title?: string;
}

function getFocusable(root: HTMLElement): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),' +
        'textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
    ),
  );
}

const CommandDialog = ({
  open,
  onOpenChange,
  title = 'Command palette',
  ...commandProps
}: CommandDialogProps) => {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<Element | null>(null);
  const uid = React.useId();
  const titleId = `${uid}-dlg-title`;

  // ── Store trigger + body scroll lock ──────────────────────────────────────

  React.useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Restore focus to the element that opened the palette.
      const el = triggerRef.current;
      if (el && typeof (el as HTMLElement).focus === 'function') {
        requestAnimationFrame(() => (el as HTMLElement).focus());
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // ── ESC + click-outside ────────────────────────────────────────────────────

  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onOpenChange(false);
        return;
      }
      // Focus trap: Tab / Shift+Tab wrap within the panel.
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = getFocusable(panelRef.current);
        if (focusable.length === 0) { e.preventDefault(); return; }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [open, onOpenChange]);

  // ── Inert sibling roots while open ────────────────────────────────────────

  React.useEffect(() => {
    if (!open) return;
    const roots = Array.from(document.body.children).filter(
      (el) => el !== panelRef.current?.closest('[data-cmd-portal]'),
    );
    roots.forEach((el) => el.setAttribute('inert', ''));
    return () => roots.forEach((el) => el.removeAttribute('inert'));
  }, [open]);

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onOpenChange(false);
  };

  const handleSelect = (id: string) => {
    commandProps.onSelect?.(id);
    // Typically the caller closes after onSelect, but this ensures close.
    onOpenChange(false);
  };

  return ReactDOM.createPortal(
    <div
      className="cmd-backdrop"
      onClick={handleBackdropClick}
      data-cmd-portal="true"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="cmd-dialog"
      >
        {/* Visually hidden title for screen readers */}
        <span id={titleId} className="sr-only">
          {title}
        </span>
        <Command
          {...commandProps}
          onSelect={handleSelect}
        />
      </div>
    </div>,
    document.body,
  );
};

interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Mono uppercase group heading. */
  heading: string;
  children: React.ReactNode;
}

const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(
  ({ heading, className, children, ...rest }, ref) => (
    <div ref={ref} role="group" aria-label={heading} className={cn('cmd-group', className)} {...rest}>
      <div className="cmd-group-label" aria-hidden="true">
        {heading}
      </div>
      {children}
    </div>
  ),
);

export { CommandDialog };
