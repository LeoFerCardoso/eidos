import * as React from 'react';
import { DateRange } from '@/components/forge/date-range';

interface CalendarProps {
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

export { CalendarProps };
