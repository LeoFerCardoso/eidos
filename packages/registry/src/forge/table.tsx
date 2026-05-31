import * as React from 'react';
import { cn } from '@/lib/utils';

type TableDensity = 'comfortable' | 'compact';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  /**
   * Vertical padding preset.
   * comfortable = 14/16 px padding (was "cozy"); compact = 6/10 px (was "dense").
   * Omit for the default (10/12 px).
   */
  density?: TableDensity;
  /**
   * Alternate row backgrounds. Off by default — hairline dividers read cleaner
   * and do not compete with hover or selection states.
   */
  zebra?: boolean;
  /**
   * Make the thead sticky when the table is inside a .tbl-scroll wrapper.
   */
  stickyHeader?: boolean;
  /**
   * Expand the table to 100% of its container.
   */
  fullWidth?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      density,
      zebra = false,
      stickyHeader = false,
      fullWidth = false,
      children,
      className,
      ...rest
    },
    ref,
  ) => (
    <table
      ref={ref}
      className={cn(
        'tbl',
        density === 'compact' && 'dense',
        density === 'comfortable' && 'cozy',
        zebra && 'tbl-zebra',
        stickyHeader && 'tbl-sticky',
        fullWidth && 'tbl-full',
        className,
      )}
      {...rest}
    >
      {children}
    </table>
  ),
);

export { Table };
