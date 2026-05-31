import * as React from 'react';
import { CalendarProps } from '@/components/forge/calendar-props';
import { DateRange } from '@/components/forge/date-range';
import { Icons } from '@/components/forge/icons';
import { isoDate } from '@/components/forge/iso-date';
import { monthGrid } from '@/components/forge/month-grid';
import { monthLabel } from '@/components/forge/month-label';
import { sameDay } from '@/components/forge/same-day';
import { startOfMonth } from '@/components/forge/start-of-month';

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

function resolveGridKey(
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

function Calendar({
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

export { Calendar };
