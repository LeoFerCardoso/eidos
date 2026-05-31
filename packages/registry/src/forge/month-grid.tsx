import * as React from 'react';
import { startOfMonth } from '@/components/forge/start-of-month';

function monthGrid(cursor: Date, weekStartsOn: 0 | 1 = 1): Date[] {
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

export { monthGrid };
