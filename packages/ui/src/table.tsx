import * as React from 'react';
import { cn } from './lib/utils';
import { Icons } from './icons';

// ═══════════════════════════════════════════════════════════════════════════
// Table — Forge DS semantic table primitive.
//
// A thin, typed compound over the existing .tbl CSS layer. Distinct from the
// stateful DataTable block — no built-in sorting/filtering state. Props:
//   density   comfortable | compact (maps to .cozy / .dense)
//   zebra     alternate row backgrounds
//   stickyHeader  position:sticky thead inside .tbl-scroll wrapper
//   fullWidth     width: 100%
//   caption   accessible <caption> element
//
// Sortable affordance: TableHead accepts sortable + sortDirection + onSort.
// The consumer owns the sort state; TableHead renders the correct aria-sort
// and the arrow glyph — no magic state inside this primitive.
//
// RTL: text-align:start on th/td + inset-inline-start for status stripe means
// every layout property is logical. Directional arrows (sort) mirror via
// [dir="rtl"] scaleX(-1) inside CSS — no JS needed.
//
// CSS lives in packages/ui/styles/tokens.css (.tbl) + ds.css (.tbl-data etc.)
// No <style> block here.
// ═══════════════════════════════════════════════════════════════════════════

// ── Types ────────────────────────────────────────────────────────────────────

export type TableDensity = 'comfortable' | 'compact';
export type TableSortDirection = 'asc' | 'desc' | 'none';
export type TableRowStatus = 'warn' | 'danger';

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
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

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children?: React.ReactNode;
  className?: string;
}

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children?: React.ReactNode;
  className?: string;
}

export interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children?: React.ReactNode;
  className?: string;
}

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /**
   * Leading-edge colour stripe.
   * "warn" = --warning; "danger" = --danger. Uses inset-inline-start — RTL-aware.
   */
  status?: TableRowStatus;
  /**
   * Toggles the ember-soft selection background.
   */
  selected?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export interface TableHeadProps extends Omit<React.ThHTMLAttributes<HTMLTableCellElement>, 'align'> {
  /**
   * Renders a sort-direction arrow and exposes the sort affordance visually.
   * Combine with `sortDirection` and `onSort`.
   */
  sortable?: boolean;
  /**
   * Current sort direction for this column. Drives aria-sort and the arrow glyph.
   * Defaults to "none".
   */
  sortDirection?: TableSortDirection;
  /**
   * Called when the user clicks the sort trigger.
   */
  onSort?: () => void;
  /**
   * Text alignment — RTL-aware via logical CSS (text-align: start|center|end).
   */
  align?: 'start' | 'center' | 'end';
  children?: React.ReactNode;
  className?: string;
}

export interface TableCellProps extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'align'> {
  /**
   * Text alignment — RTL-aware via logical CSS.
   */
  align?: 'start' | 'center' | 'end';
  /**
   * Render as <th> instead of <td>. Useful for row header cells that need
   * proper scope semantics (e.g. the first cell in each row).
   * Default: "td".
   */
  as?: 'td' | 'th';
  /**
   * Sets the `scope` attribute. Only relevant when `as="th"`.
   * "row" marks the cell as a header for its row; "col" for its column.
   */
  scope?: 'row' | 'col';
  children?: React.ReactNode;
  className?: string;
}

export interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {
  children?: React.ReactNode;
  className?: string;
}

// ── Sort arrow glyph ─────────────────────────────────────────────────────────
// Non-directional indicator: a stacked chevron pair (unsorted) or a single
// arrow (asc/desc). The .sort-arrow opacity rule lives in CSS.

const SortArrow = ({ dir }: { dir: TableSortDirection }) => (
  // Always render the up/down pair; the active direction's triangle lights ember,
  // the other stays muted. Clicking flips which one is active.
  <span aria-hidden="true" className="sort-arrow">
    <span className="tbl-sort-pair">
      <span className={dir === 'asc' ? 'is-active' : undefined}><Icons.triangleUp size={7} /></span>
      <span className={dir === 'desc' ? 'is-active' : undefined}><Icons.triangleDown size={7} /></span>
    </span>
  </span>
);

// ── Compound components ───────────────────────────────────────────────────────

/**
 * Root table element.
 * Renders a semantic <table> with the .tbl class and optional density/zebra/sticky modifiers.
 */
export const Table = React.forwardRef<HTMLTableElement, TableProps>(
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
Table.displayName = 'Table';

/**
 * <thead> wrapper.
 */
export const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ children, className, ...rest }, ref) => (
    <thead ref={ref} className={cn(className)} {...rest}>
      {children}
    </thead>
  ),
);
TableHeader.displayName = 'TableHeader';

/**
 * <tbody> wrapper.
 */
export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ children, className, ...rest }, ref) => (
    <tbody ref={ref} className={cn(className)} {...rest}>
      {children}
    </tbody>
  ),
);
TableBody.displayName = 'TableBody';

/**
 * <tfoot> wrapper.
 */
export const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ children, className, ...rest }, ref) => (
    <tfoot ref={ref} className={cn(className)} {...rest}>
      {children}
    </tfoot>
  ),
);
TableFooter.displayName = 'TableFooter';

/**
 * <tr> wrapper. Accepts `status` (warn | danger) and `selected` modifiers.
 * When `selected` is truthy, emits `aria-selected="true"` for proper selection
 * semantics in assistive technology (ARIA Practices grid/row selection pattern).
 */
export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ status, selected = false, children, className, ...rest }, ref) => (
    <tr
      ref={ref}
      aria-selected={selected ? true : undefined}
      className={cn(
        status === 'warn' && 'row-warn',
        status === 'danger' && 'row-danger',
        selected && 'selected',
        className,
      )}
      {...rest}
    >
      {children}
    </tr>
  ),
);
TableRow.displayName = 'TableRow';

/**
 * <th> header cell. Accepts `sortable`, `sortDirection`, `onSort`, and `align`.
 * When `sortable` is true it renders as a button trigger so click and Enter/Space
 * both fire `onSort`, satisfying keyboard accessibility.
 *
 * aria-sort is set on the <th> (not on the inner button) — this is the correct
 * ARIA pattern for sortable column headers.
 */
export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  (
    {
      sortable = false,
      sortDirection = 'none',
      onSort,
      align = 'start',
      children,
      className,
      onClick,
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    const ariaSortMap: Record<TableSortDirection, React.AriaAttributes['aria-sort']> = {
      asc: 'ascending',
      desc: 'descending',
      none: 'none',
    };

    const handleClick = (e: React.MouseEvent<HTMLTableCellElement>) => {
      if (sortable) onSort?.();
      onClick?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTableCellElement>) => {
      if (sortable && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onSort?.();
      }
      onKeyDown?.(e);
    };

    return (
      <th
        ref={ref}
        scope="col"
        aria-sort={sortable ? ariaSortMap[sortDirection] : undefined}
        tabIndex={sortable ? 0 : undefined}
        className={cn(
          sortable && 'sortable',
          sortable && sortDirection !== 'none' && 'sorted',
          align !== 'start' && `tbl-align-${align}`,
          className,
        )}
        style={align !== 'start' ? { textAlign: align } : undefined}
        onClick={sortable ? handleClick : onClick}
        onKeyDown={sortable ? handleKeyDown : onKeyDown}
        {...rest}
      >
        {sortable ? (
          <>
            {children}
            <SortArrow dir={sortDirection} />
          </>
        ) : (
          children
        )}
      </th>
    );
  },
);
TableHead.displayName = 'TableHead';

/**
 * <td> data cell. Accepts `align`, `as`, and `scope`.
 * Pass `as="th" scope="row"` to render the cell as a row-header <th> — useful
 * for tables where the first column identifies each row (e.g. name, ID).
 * Default renders as <td> for backward compatibility.
 */
export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ align = 'start', as: Tag = 'td', scope, children, className, style, ...rest }, ref) => (
    <Tag
      ref={ref}
      scope={scope}
      className={cn(className)}
      style={align !== 'start' ? { textAlign: align, ...style } : style}
      {...rest}
    >
      {children}
    </Tag>
  ),
);
TableCell.displayName = 'TableCell';

/**
 * <caption> element — visually hidden by default but announced by screen readers.
 * Provide a descriptive label for assistive technology.
 */
export const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ children, className, ...rest }, ref) => (
    <caption
      ref={ref}
      className={cn('tbl-caption', className)}
      {...rest}
    >
      {children}
    </caption>
  ),
);
TableCaption.displayName = 'TableCaption';
