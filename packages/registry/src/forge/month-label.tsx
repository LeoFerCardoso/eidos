import * as React from 'react';

function monthLabel(d: Date, locale: string = 'en-US'): string {
  return d.toLocaleString(locale, { month: 'long', year: 'numeric' });
}

export { monthLabel };
