import * as React from 'react';
import { Empty } from '@/components/forge/empty';

type DataTableColumn = {
  id: string;
  label?: string;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
  sortable?: boolean;
  render?: (row: any) => React.ReactNode;
};

type SortState = { col: string; dir: 'asc' | 'desc' };

const DataTable = ({
  columns = [], rows = [], onRowClick, rowKey, empty,
  sort, onSort, sticky = false, dense = false, footer,
}: {
  /** Array of column definitions — each with id, label, align, width, render, and sortable. */
  columns?: DataTableColumn[];
  /** Array of arbitrary row objects. Default cell renderer reads row[column.id]. */
  rows?: any[];
  /** Fires when a row is clicked. Rows become focusable and activatable with Enter/Space. */
  onRowClick?: (row: any) => void;
  /** Custom React key extractor. Defaults to row => row.id. */
  rowKey?: (row: any) => string | number;
  /** Override the default Empty state shown when rows is empty. */
  empty?: React.ReactNode;
  /** Current sort state. Renders the active chevron and sets aria-sort on the column header. */
  sort?: SortState;
  /** Called when a sortable column header is clicked. */
  onSort?: (colId: string) => void;
  /** Stick thead to the top of the scroll container. */
  sticky?: boolean;
  /** Tighten row padding (6px vs 10px) for denser lists. */
  dense?: boolean;
  /** Custom tfoot content (e.g. a totals row). */
  footer?: React.ReactNode;
}) => {
  const keyFn = rowKey || ((r) => r.id);
  const cls = ['tbl', 'tbl-data'];
  if (sticky) cls.push('sticky');
  if (dense) cls.push('dense');
  return (
    <div className="tbl-wrap">
      <table className={cls.join(' ')}>
        <thead>
          <tr>
            {columns.map(c => {
              const isSorted = sort && sort.col === c.id;
              return (
                <th key={c.id} style={{ textAlign: c.align || 'left', width: c.width }}
                    className={(c.sortable ? 'is-sortable ' : '') + (isSorted ? 'is-sorted ' + sort.dir : '')}
                    onClick={c.sortable && onSort ? () => onSort(c.id) : undefined}>
                  <span className="th-inner">
                    <span>{c.label}</span>
                    {c.sortable && (
                      <span className="th-chevs">
                        <span className={'chev-up ' + (isSorted && sort.dir === 'asc' ? 'on' : '')}>▲</span>
                        <span className={'chev-dn ' + (isSorted && sort.dir === 'desc' ? 'on' : '')}>▼</span>
                      </span>
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={columns.length} style={{ padding: 0 }}>{empty || <Empty title="Nothing here" desc="No rows match the current filters." size="sm"/>}</td></tr>
          )}
          {rows.map(r => (
            <tr key={keyFn(r)} onClick={onRowClick ? () => onRowClick(r) : undefined}
                className={onRowClick ? 'is-clickable' : ''}
                tabIndex={onRowClick ? 0 : undefined}>
              {columns.map(c => (
                <td key={c.id} style={{ textAlign: c.align || 'left' }}>
                  {c.render ? c.render(r) : r[c.id]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {footer && <tfoot>{footer}</tfoot>}
      </table>
    </div>
  );
};

export { DataTable };
