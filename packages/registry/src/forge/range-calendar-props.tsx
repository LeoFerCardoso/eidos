import * as React from 'react';
import { CalendarProps } from '@/components/forge/calendar-props';
import { DateRange } from '@/components/forge/date-range';

interface RangeCalendarProps extends Omit<CalendarProps, 'selectionMode' | 'value' | 'defaultValue' | 'onValueChange' | 'onChange'> {
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

export { RangeCalendarProps };
