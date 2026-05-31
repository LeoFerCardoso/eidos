import * as React from 'react';

function isoDate(d: Date | null | undefined): string {
  return d ? d.toISOString().slice(0, 10) : '';
}

export { isoDate };
