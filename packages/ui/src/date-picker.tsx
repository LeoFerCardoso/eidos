import * as React from 'react';
import { Icons } from './icons';
import { Calendar } from './calendar';

// Eidos DS — DatePicker.
//
// A field-like trigger button that shows the selected date (or placeholder)
// with a leading calendar icon and a trailing chevron. Clicking opens a
// position:fixed popover panel containing the unified Calendar in single
// selection mode. Selecting a day closes the panel, updates the trigger
// display, and fires onValueChange.
//
// Fully controlled (value + onValueChange) or uncontrolled (defaultValue).
// Escapes parent overflow:hidden via getBoundingClientRect() + position:fixed.
// ARIA: trigger aria-haspopup="dialog" + aria-expanded; panel role="dialog";
// Esc closes + restores focus; click-outside dismiss; focus trap inside panel.
// RTL: chevron mirrors; calendar grid mirrors automatically.
//
// CSS re-uses .dp-* / .cal-* from tokens.css — no per-file <style>.

// ── Types ────────────────────────────────────────────────────────────────────

export interface DatePickerProps {
  /** Controlled selected date. */
  value?: Date;
  /** Called when the user picks a day. The popover closes automatically. */
  onValueChange?: (date: Date) => void;
  /** Uncontrolled initial date. */
  defaultValue?: Date;
  /** Earliest selectable date (disables earlier cells + locks prev-month nav). */
  min?: Date;
  /** Latest selectable date (disables later cells + locks next-month nav). */
  max?: Date;
  /** BCP-47 locale for month label, weekday names, and trigger display. Default 'en-US'. */
  locale?: string;
  /** Week start: 0 = Sunday, 1 = Monday (ISO, default). */
  weekStartsOn?: 0 | 1;
  /** Trigger size: sm = 28px, md = 36px (default), lg = 44px. */
  size?: 'sm' | 'md' | 'lg';
  /** Locks the trigger. */
  disabled?: boolean;
  /** Paints the trigger border + ring with --danger. */
  invalid?: boolean;
  /** Faint label shown when no date is selected. */
  placeholder?: string;
  /** Accessible label for the field (also sets label element when provided). */
  label?: React.ReactNode;
  /** HTML id for the trigger button. */
  id?: string;
  /** Extra class names merged onto the root element. */
  className?: string;
  /**
   * Format the selected date for display in the trigger.
   * Defaults to a locale-aware `toLocaleDateString` call.
   */
  format?: (date: Date) => string;
}

// ── Default formatter ─────────────────────────────────────────────────────────

function defaultFormat(date: Date, locale: string): string {
  return date.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── Panel position (fixed, direction-aware) ───────────────────────────────────

interface PanelPos { top: number; left: number; }

function computePanelPos(trigger: HTMLElement): PanelPos {
  const r = trigger.getBoundingClientRect();
  const isRtl = getComputedStyle(trigger).direction === 'rtl';
  let left = isRtl ? r.right - 276 : r.left; // 276 = panel width
  const top = r.bottom + 6;
  // Clamp to viewport
  const margin = 8;
  left = Math.max(margin, Math.min(left, window.innerWidth - 276 - margin));
  return { top, left };
}

// ── Component ─────────────────────────────────────────────────────────────────

export function DatePicker({
  value: valueProp,
  onValueChange,
  defaultValue,
  min,
  max,
  locale = 'en-US',
  weekStartsOn = 1,
  size = 'md',
  disabled = false,
  invalid = false,
  placeholder = 'Pick a date',
  label,
  id,
  className = '',
  format,
}: DatePickerProps) {
  const reactId = React.useId();
  const triggerId = id || reactId;
  const panelId = `${reactId}-panel`;

  const isControlled = valueProp !== undefined;
  const [internal, setInternal] = React.useState<Date | undefined>(defaultValue);
  const value = isControlled ? valueProp : internal;

  const [open, setOpen] = React.useState(false);
  const [panelPos, setPanelPos] = React.useState<PanelPos | null>(null);

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const returnFocusRef = React.useRef<HTMLElement | null>(null);

  // ── Format the selected date for display ──────────────────────────────────

  const displayValue = value
    ? (format ? format(value) : defaultFormat(value, locale))
    : null;

  // ── Open / close ──────────────────────────────────────────────────────────

  const openPanel = () => {
    if (disabled) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  };

  const closePanel = () => {
    setOpen(false);
  };

  // ── Position the panel ────────────────────────────────────────────────────

  React.useEffect(() => {
    if (!open) { setPanelPos(null); return; }
    const place = () => {
      if (!triggerRef.current) return;
      setPanelPos(computePanelPos(triggerRef.current));
    };
    // Use rAF so the panel has mounted and we can measure it.
    const frame = requestAnimationFrame(place);
    const dismiss = () => closePanel();
    window.addEventListener('scroll', dismiss, true);
    window.addEventListener('resize', dismiss);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', dismiss, true);
      window.removeEventListener('resize', dismiss);
    };
  }, [open]);

  // ── Focus management ──────────────────────────────────────────────────────

  React.useEffect(() => {
    if (open) {
      // Move focus into the panel after positioning.
      let raf1: number;
      let raf2: number;
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          const panel = panelRef.current;
          if (!panel) return;
          const FOCUSABLE =
            'button:not([disabled]),a[href],input:not([disabled]),[tabindex]:not([tabindex="-1"])';
          const first = panel.querySelector<HTMLElement>(FOCUSABLE);
          (first ?? panel).focus();
        });
      });
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    } else {
      // Restore focus to trigger on close.
      const target = returnFocusRef.current;
      if (target && typeof target.focus === 'function') {
        const t = setTimeout(() => target.focus(), 10);
        return () => clearTimeout(t);
      }
    }
    return undefined;
  }, [open]);

  // ── Focus trap (Tab / Shift+Tab wraps within panel) ───────────────────────

  React.useEffect(() => {
    if (!open) return;
    const FOCUSABLE =
      'button:not([disabled]),a[href],input:not([disabled]),[tabindex]:not([tabindex="-1"])';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel || !panel.contains(document.activeElement)) return;
      const nodes = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
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

  // ── Click-outside + Escape ─────────────────────────────────────────────────

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t)) return;
      if (panelRef.current?.contains(t)) return;
      closePanel();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePanel();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // ── Day selection ─────────────────────────────────────────────────────────

  const handleValueChange = (date: Date) => {
    if (!isControlled) setInternal(date);
    onValueChange?.(date);
    closePanel();
  };

  // ── Classes ───────────────────────────────────────────────────────────────

  const sizeClass = size !== 'md' ? ` ${size}` : '';
  const triggerCls = [
    'dp-trigger',
    open ? 'is-open' : '',
    invalid ? 'is-invalid' : '',
    disabled ? 'is-disabled' : '',
    sizeClass.trim(),
  ].filter(Boolean).join(' ');

  const rootCls = ['dp', className].filter(Boolean).join(' ');

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className={rootCls}>
      {label && (
        <label className="in-label" htmlFor={triggerId} style={{ display: 'block', marginBottom: 6 }}>
          {label}
        </label>
      )}
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        className={triggerCls}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => (open ? closePanel() : openPanel())}
      >
        <span className="ico" aria-hidden="true"><Icons.calendar size={14} /></span>
        <span className={`label${displayValue ? '' : ' placeholder'}`}>
          {displayValue ?? placeholder}
        </span>
        <span className="ico" aria-hidden="true"><Icons.chevronDown size={12} /></span>
      </button>

      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-modal="false"
          aria-label="Date picker"
          className="dp-pop is-open"
          style={
            panelPos
              ? { position: 'fixed', top: panelPos.top, left: panelPos.left }
              : { position: 'fixed', visibility: 'hidden' }
          }
        >
          <Calendar
            selectionMode="single"
            value={value}
            onValueChange={handleValueChange as (date: Date) => void}
            minDate={min}
            maxDate={max}
            locale={locale}
            weekStartsOn={weekStartsOn}
          />
        </div>
      )}
    </div>
  );
}
