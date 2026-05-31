import * as React from 'react';
import { Icons } from './icons';

// ─── Date helpers ─────────────────────────────────────────────────────────────

/** Returns a new Date set to the first day of the given date's month. */
export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/** Returns true when two dates represent the same calendar day. */
export function sameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  return !!a && !!b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

/** ISO 8601 date string (YYYY-MM-DD), or empty string when the value is nullish. */
export function isoDate(d: Date | null | undefined): string {
  return d ? d.toISOString().slice(0, 10) : '';
}

/**
 * Build a 6-row × 7-column array of Date objects that covers the current month
 * plus the leading/trailing days from adjacent months needed to fill the grid.
 *
 * @param cursor   - any date in the target month
 * @param weekStartsOn - 0 = Sunday, 1 = Monday (ISO default)
 */
export function monthGrid(cursor: Date, weekStartsOn: 0 | 1 = 1): Date[] {
  const first = startOfMonth(cursor);
  // For Mon-start: offset = (getDay()+6)%7  (Sun=6, Mon=0, …)
  // For Sun-start: offset = getDay()         (Sun=0, Mon=1, …)
  const offset = weekStartsOn === 1
    ? (first.getDay() + 6) % 7
    : first.getDay();
  const start = new Date(first);
  start.setDate(start.getDate() - offset);
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

/** Long month + year label, locale-aware (e.g. "June 2026"). */
export function monthLabel(d: Date, locale: string = 'en-US'): string {
  return d.toLocaleString(locale, { month: 'long', year: 'numeric' });
}

/** Returns localised day-of-week abbreviations starting from weekStartsOn. */
function buildDOW(locale: string, weekStartsOn: 0 | 1): string[] {
  // Generate Mon–Sun or Sun–Sat abbreviated day names using a known Sunday reference.
  const sunday = new Date(2023, 0, 1); // 1 Jan 2023 is a Sunday
  const result: string[] = [];
  const start = weekStartsOn === 1 ? 1 : 0; // Mon = 1 offset from Sun
  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + start + i);
    result.push(d.toLocaleString(locale, { weekday: 'short' }).slice(0, 2));
  }
  return result;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

type SingleValue = Date | undefined;
type RangeValue = DateRange | undefined;

// ─── CalendarProps — the unified prop surface ─────────────────────────────────

export interface CalendarProps {
  /**
   * Selection behaviour. 'single' (default) picks one date; 'range' picks a
   * start+end pair with hover preview. 'multiple' is reserved for a future
   * release and is not yet implemented.
   */
  selectionMode?: 'single' | 'range';

  // ── Single-mode value ──────────────────────────────────────────────────────
  /**
   * Controlled selected date (single mode). When omitted the component manages
   * its own state (uncontrolled); seed it with `defaultValue`.
   */
  value?: Date | DateRange;
  /** Uncontrolled initial value (single: Date, range: DateRange). */
  defaultValue?: Date | DateRange;
  /**
   * Called with the new value whenever the user confirms a selection.
   * - single: `(date: Date) => void`
   * - range:  `(range: DateRange) => void`
   */
  onValueChange?: ((date: Date) => void) | ((range: DateRange) => void);

  /**
   * @deprecated Use `onValueChange` instead.
   * @alias onValueChange
   */
  onChange?: ((date: Date) => void) | ((range: DateRange) => void);

  // ── Cell modifiers ─────────────────────────────────────────────────────────
  /**
   * Predicate for disabling individual cells (e.g. past dates, unavailable
   * slots). Matching cells get opacity .3, are not tabbable, and cannot be
   * selected.
   */
  disabled?: (date: Date) => boolean;
  /**
   * Cells before this date are disabled AND the Prev month button is locked
   * when the cursor is already at or before this month.
   */
  minDate?: Date;
  /**
   * Cells after this date are disabled AND the Next month button is locked
   * when the cursor is at or after this month.
   */
  maxDate?: Date;

  // ── Display ────────────────────────────────────────────────────────────────
  /**
   * The date to mark as "today" — shows an ember dot + bold weight.
   * Defaults to `new Date()`. Override for deterministic testing / SSR.
   */
  today?: Date;
  /** BCP-47 locale for month title + day-of-week abbreviations. Default 'en-US'. */
  locale?: string;
  /** Week start day: 1 = Monday (ISO, default), 0 = Sunday. */
  weekStartsOn?: 0 | 1;
  /** Optional node rendered below the calendar grid (e.g. a "Today" shortcut). */
  footer?: React.ReactNode;
  /** Extra class names merged onto the root `.cal` element. */
  className?: string;
  /** Accessible label for the calendar widget. Defaults to "Calendar". */
  'aria-label'?: string;
}

// ─── RangeCalendarProps — keep-alias surface ─────────────────────────────────

export interface RangeCalendarProps extends Omit<CalendarProps, 'selectionMode' | 'value' | 'defaultValue' | 'onValueChange' | 'onChange'> {
  /** Controlled range (uncontrolled when omitted; seed with `defaultValue`). */
  value?: DateRange;
  /** Uncontrolled initial range. */
  defaultValue?: DateRange;
  /**
   * Called after every click with the updated range object.
   *
   * Selection sequence:
   * 1. First click (or click when range is complete) → sets `start`, clears `end`.
   * 2. Second click (if after `start`) → sets `end`.
   * 3. Second click (if before `start`) → swaps so start {'<'} end.
   */
  onChange?: (range: DateRange) => void;
  /** @deprecated Use `onValueChange` instead. */
  onValueChange?: (range: DateRange) => void;
}

// ─── Shared keyboard navigation engine ───────────────────────────────────────

/**
 * Resolve the target date for a keyboard key press on a grid cell.
 * Returns null for unhandled keys (caller should not preventDefault).
 * Returns the *same* date `d` for Enter/Space so the caller can act on it.
 *
 * weekStartsOn controls Home/End row-boundary calculation:
 *   Mon-first (1): visible week is Mon–Sun.
 *   Sun-first (0): visible week is Sun–Sat.
 */
export function resolveGridKey(
  key: string,
  d: Date,
  weekStartsOn: 0 | 1,
): Date | null {
  if (key === 'ArrowRight') return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
  if (key === 'ArrowLeft') return new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1);
  if (key === 'ArrowDown') return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7);
  if (key === 'ArrowUp') return new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7);
  if (key === 'PageUp') return new Date(d.getFullYear(), d.getMonth() - 1, d.getDate());
  if (key === 'PageDown') return new Date(d.getFullYear(), d.getMonth() + 1, d.getDate());

  if (key === 'Home') {
    // Move to first day of the visible week row.
    const dow = d.getDay(); // 0=Sun, 1=Mon, …, 6=Sat
    let offset: number;
    if (weekStartsOn === 1) {
      // Mon-first: Sun wraps back 6 days to previous Monday.
      offset = dow === 0 ? -6 : -(dow - 1);
    } else {
      // Sun-first: simply back to Sunday.
      offset = -dow;
    }
    const home = new Date(d);
    home.setDate(d.getDate() + offset);
    return home;
  }

  if (key === 'End') {
    // Move to last day of the visible week row.
    const dow = d.getDay(); // 0=Sun, 1=Mon, …, 6=Sat
    let offset: number;
    if (weekStartsOn === 1) {
      // Mon-first: last column is Sunday.
      // Sun (0) is already last → offset 0; others need (7 - dow) to reach next Sunday.
      offset = dow === 0 ? 0 : 7 - dow;
    } else {
      // Sun-first: last column is Saturday.
      offset = 6 - dow;
    }
    const end = new Date(d);
    end.setDate(d.getDate() + offset);
    return end;
  }

  if (key === 'Enter' || key === ' ') return new Date(d); // sentinel — same date

  return null; // unhandled
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function isBeforeMonth(cursor: Date, date: Date): boolean {
  return cursor.getFullYear() < date.getFullYear() ||
    (cursor.getFullYear() === date.getFullYear() && cursor.getMonth() <= date.getMonth());
}

function isAfterMonth(cursor: Date, date: Date): boolean {
  return cursor.getFullYear() > date.getFullYear() ||
    (cursor.getFullYear() === date.getFullYear() && cursor.getMonth() >= date.getMonth());
}

function isCellDisabled(d: Date, disabled?: (d: Date) => boolean, minDate?: Date, maxDate?: Date): boolean {
  if (disabled && disabled(d)) return true;
  if (minDate) {
    const m = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
    const c = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (c < m) return true;
  }
  if (maxDate) {
    const m = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
    const c = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (c > m) return true;
  }
  return false;
}

// ─── Calendar — unified month-grid picker ────────────────────────────────────

/**
 * Eidos Calendar — unified single/range month-grid picker.
 *
 * - `selectionMode="single"` (default): picks one date.
 * - `selectionMode="range"`: two-click range with hover-preview band.
 *
 * Fully controlled when `value` is provided; uncontrolled otherwise
 * (seed with `defaultValue`).
 *
 * CSS classes (all in tokens.css / ds.css):
 * `.cal`, `.cal-head`, `.cal-title`, `.cal-btn`, `.cal-grid`, `.cal-dow`,
 * `.cal-day` (+ `.outside`, `.today`, `.selected`, `.disabled`,
 * `.in-range`, `.range-start`, `.range-end`).
 */
export function Calendar({
  selectionMode = 'single',
  value,
  defaultValue,
  onValueChange,
  onChange,
  disabled,
  minDate,
  maxDate,
  today,
  locale = 'en-US',
  weekStartsOn = 1,
  footer,
  className,
  'aria-label': ariaLabel,
}: CalendarProps) {
  const todayDate = today ?? new Date();
  // onValueChange takes priority; onChange is the deprecated alias.
  const emit = onValueChange ?? onChange;

  if (selectionMode === 'range') {
    return (
      <CalendarRange
        value={value as DateRange | undefined}
        defaultValue={defaultValue as DateRange | undefined}
        emit={emit as ((r: DateRange) => void) | undefined}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        todayDate={todayDate}
        locale={locale}
        weekStartsOn={weekStartsOn}
        footer={footer}
        className={className}
        ariaLabel={ariaLabel ?? 'Calendar — date range'}
      />
    );
  }

  return (
    <CalendarSingle
      value={value as Date | undefined}
      defaultValue={defaultValue as Date | undefined}
      emit={emit as ((d: Date) => void) | undefined}
      disabled={disabled}
      minDate={minDate}
      maxDate={maxDate}
      todayDate={todayDate}
      locale={locale}
      weekStartsOn={weekStartsOn}
      footer={footer}
      className={className}
      ariaLabel={ariaLabel ?? 'Calendar'}
    />
  );
}

// ─── Single-mode implementation ───────────────────────────────────────────────

interface CalendarSingleProps {
  value?: Date;
  defaultValue?: Date;
  emit?: (d: Date) => void;
  disabled?: (d: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
  todayDate: Date;
  locale: string;
  weekStartsOn: 0 | 1;
  footer?: React.ReactNode;
  className?: string;
  ariaLabel: string;
}

function CalendarSingle({
  value,
  defaultValue,
  emit,
  disabled,
  minDate,
  maxDate,
  todayDate,
  locale,
  weekStartsOn,
  footer,
  className,
  ariaLabel,
}: CalendarSingleProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<Date | undefined>(defaultValue);
  const selected = isControlled ? value : internal;

  const [cursor, setCursor] = React.useState<Date>(
    () => startOfMonth(selected ?? todayDate),
  );

  const days = monthGrid(cursor, weekStartsOn);
  const dow = buildDOW(locale, weekStartsOn);

  const prevDisabled = !!minDate && isBeforeMonth(cursor, minDate);
  const nextDisabled = !!maxDate && isAfterMonth(cursor, maxDate);

  const prev = () => {
    if (!prevDisabled) setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
  };
  const next = () => {
    if (!nextDisabled) setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));
  };

  const handleClick = (d: Date) => {
    if (isCellDisabled(d, disabled, minDate, maxDate)) return;
    if (!isControlled) setInternal(d);
    emit?.(d);
  };

  // Keyboard navigation
  const [focusedDate, setFocusedDate] = React.useState<Date | null>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, d: Date) => {
    const next = resolveGridKey(e.key, d, weekStartsOn);
    if (next === null) return; // unhandled key

    e.preventDefault();

    if (e.key === 'Enter' || e.key === ' ') {
      handleClick(d);
      return;
    }

    setFocusedDate(next);
    // Navigate the month if needed.
    if (next.getMonth() !== cursor.getMonth() || next.getFullYear() !== cursor.getFullYear()) {
      setCursor(startOfMonth(next));
    }
  };

  // Focus the target cell after navigation
  React.useEffect(() => {
    if (!focusedDate || !gridRef.current) return;
    const iso = isoDate(focusedDate);
    const btn = gridRef.current.querySelector<HTMLButtonElement>(`[data-date="${iso}"]`);
    btn?.focus();
  }, [focusedDate, cursor]);

  const rootCls = ['cal', className].filter(Boolean).join(' ');

  return (
    <div className={rootCls} role="group" aria-label={ariaLabel}>
      <div className="cal-head">
        <button
          className="cal-btn"
          onClick={prev}
          aria-label="Previous month"
          type="button"
          disabled={prevDisabled}
        >
          <Icons.chevronLeft size={14} />
        </button>
        <span className="cal-title">{monthLabel(cursor, locale)}</span>
        <button
          className="cal-btn"
          onClick={next}
          aria-label="Next month"
          type="button"
          disabled={nextDisabled}
        >
          <Icons.chevronRight size={14} />
        </button>
      </div>
      <div className="cal-grid" role="grid" ref={gridRef}>
        {dow.map((d, i) => (
          <div key={i} className="cal-dow" role="columnheader" aria-label={d}>
            {d}
          </div>
        ))}
        {days.map((d, i) => {
          const outside = d.getMonth() !== cursor.getMonth();
          const isSel = sameDay(d, selected);
          const isToday = sameDay(d, todayDate);
          const cellDisabled = isCellDisabled(d, disabled, minDate, maxDate);
          const cls = ['cal-day'];
          if (outside) cls.push('outside');
          if (isSel) cls.push('selected');
          if (isToday) cls.push('today');

          return (
            <button
              key={i}
              role="gridcell"
              type="button"
              data-date={isoDate(d)}
              aria-selected={isSel}
              aria-disabled={cellDisabled || undefined}
              className={cls.join(' ')}
              tabIndex={cellDisabled ? -1 : 0}
              disabled={cellDisabled}
              onClick={() => handleClick(d)}
              onKeyDown={(e) => handleKeyDown(e, d)}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
      {footer && <div className="cal-footer">{footer}</div>}
    </div>
  );
}

// ─── Range-mode implementation ────────────────────────────────────────────────

interface CalendarRangeProps {
  value?: DateRange;
  defaultValue?: DateRange;
  emit?: (r: DateRange) => void;
  disabled?: (d: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
  todayDate: Date;
  locale: string;
  weekStartsOn: 0 | 1;
  footer?: React.ReactNode;
  className?: string;
  ariaLabel: string;
}

function CalendarRange({
  value,
  defaultValue,
  emit,
  disabled,
  minDate,
  maxDate,
  todayDate,
  locale,
  weekStartsOn,
  footer,
  className,
  ariaLabel,
}: CalendarRangeProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<DateRange>(
    defaultValue ?? { start: null, end: null },
  );
  const range = isControlled ? value : internal;
  const { start, end } = range;

  const [hovering, setHovering] = React.useState<Date | null>(null);

  const [cursor, setCursor] = React.useState<Date>(
    () => startOfMonth(start ?? todayDate),
  );

  const days = monthGrid(cursor, weekStartsOn);
  const dow = buildDOW(locale, weekStartsOn);

  const prevDisabled = !!minDate && isBeforeMonth(cursor, minDate);
  const nextDisabled = !!maxDate && isAfterMonth(cursor, maxDate);

  const prev = () => {
    if (!prevDisabled) setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
  };
  const next = () => {
    if (!nextDisabled) setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));
  };

  const handleClick = (d: Date) => {
    if (isCellDisabled(d, disabled, minDate, maxDate)) return;

    let next: DateRange;
    if (!start || (start && end)) {
      // No start yet, or range already complete → reset with new start.
      next = { start: d, end: null };
    } else if (d < start) {
      // Clicked before the anchored start → swap so order is preserved.
      next = { start: d, end: start };
    } else {
      // Normal case: anchor exists, clicked on/after it → set end.
      next = { start, end: d };
    }

    setHovering(null);
    if (!isControlled) setInternal(next);
    // Only emit when a full range is committed OR when resetting (start set).
    emit?.(next);
  };

  // Roving-focus state for range mode (mirrors CalendarSingle).
  const [focusedDate, setFocusedDate] = React.useState<Date | null>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);

  // Focus the target cell after navigation (same pattern as CalendarSingle).
  React.useEffect(() => {
    if (!focusedDate || !gridRef.current) return;
    const iso = isoDate(focusedDate);
    const btn = gridRef.current.querySelector<HTMLButtonElement>(`[data-date="${iso}"]`);
    btn?.focus();
  }, [focusedDate, cursor]);

  // Keyboard — full arrow/page/home/end navigation shared with single mode.
  // Esc also clears an in-progress (start-only) range.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, d: Date) => {
    if (e.key === 'Escape') {
      if (start && !end) {
        const reset: DateRange = { start: null, end: null };
        if (!isControlled) setInternal(reset);
        emit?.(reset);
      }
      return;
    }

    const next = resolveGridKey(e.key, d, weekStartsOn);
    if (next === null) return; // unhandled key

    e.preventDefault();

    if (e.key === 'Enter' || e.key === ' ') {
      handleClick(d);
      return;
    }

    setFocusedDate(next);
    // Navigate the month if needed.
    if (next.getMonth() !== cursor.getMonth() || next.getFullYear() !== cursor.getFullYear()) {
      setCursor(startOfMonth(next));
    }
  };

  const rootCls = ['cal', className].filter(Boolean).join(' ');

  return (
    <div
      className={rootCls}
      role="group"
      aria-label={ariaLabel}
      onMouseLeave={() => setHovering(null)}
    >
      <div className="cal-head">
        <button
          className="cal-btn"
          onClick={prev}
          aria-label="Previous month"
          type="button"
          disabled={prevDisabled}
        >
          <Icons.chevronLeft size={14} />
        </button>
        <span className="cal-title">{monthLabel(cursor, locale)}</span>
        <button
          className="cal-btn"
          onClick={next}
          aria-label="Next month"
          type="button"
          disabled={nextDisabled}
        >
          <Icons.chevronRight size={14} />
        </button>
      </div>
      <div className="cal-grid" role="grid" ref={gridRef}>
        {dow.map((d, i) => (
          <div key={i} className="cal-dow" role="columnheader" aria-label={d}>
            {d}
          </div>
        ))}
        {days.map((d, i) => {
          const outside = d.getMonth() !== cursor.getMonth();
          const isStart = sameDay(d, start);
          const isEnd = sameDay(d, end);
          const isToday = sameDay(d, todayDate);
          const cellDisabled = isCellDisabled(d, disabled, minDate, maxDate);

          // Hover preview: when start is set but end is not, preview the band
          // up to the hovered cell.
          const liveEnd = end || hovering;
          const inRange = !!(start && liveEnd && d > start && d < liveEnd);
          // The hovered end cap (before commit)
          const isHoverEnd = !!(start && !end && hovering && sameDay(d, hovering) && d >= start);

          const cls = ['cal-day'];
          if (outside) cls.push('outside');
          if (isToday) cls.push('today');
          if (isStart) cls.push('range-start', 'selected');
          if (isEnd) cls.push('range-end', 'selected');
          if (isHoverEnd) cls.push('range-end', 'selected');
          if (inRange) cls.push('in-range');

          return (
            <button
              key={i}
              role="gridcell"
              type="button"
              data-date={isoDate(d)}
              aria-selected={isStart || isEnd}
              aria-disabled={cellDisabled || undefined}
              className={cls.join(' ')}
              tabIndex={cellDisabled ? -1 : 0}
              disabled={cellDisabled}
              onClick={() => handleClick(d)}
              onMouseEnter={() => !cellDisabled && setHovering(d)}
              onKeyDown={(e) => handleKeyDown(e, d)}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
      {footer && <div className="cal-footer">{footer}</div>}
    </div>
  );
}

// ─── RangeCalendar — deprecated keep-alias ────────────────────────────────────

/**
 * @deprecated Use `<Calendar selectionMode="range" />` instead.
 *
 * This component is kept for one release to allow a smooth migration.
 * It forwards all props to `Calendar` with `selectionMode="range"`.
 */
export function RangeCalendar({
  value,
  defaultValue,
  onValueChange,
  onChange,
  ...rest
}: RangeCalendarProps) {
  const emit = onValueChange ?? onChange;
  return (
    <Calendar
      selectionMode="range"
      value={value}
      defaultValue={defaultValue}
      onValueChange={emit as CalendarProps['onValueChange']}
      {...rest}
    />
  );
}
