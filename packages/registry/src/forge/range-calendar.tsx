import * as React from 'react';
import { Calendar } from '@/components/forge/calendar';
import { CalendarProps } from '@/components/forge/calendar-props';
import { RangeCalendarProps } from '@/components/forge/range-calendar-props';

function RangeCalendar({
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

export { RangeCalendar };
