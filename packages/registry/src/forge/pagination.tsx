import * as React from 'react';
import { Icons } from '@/components/forge/icons';

const pageRange = (current, total, siblings = 1) => {
  const out = [];
  const start = Math.max(2, current - siblings);
  const end = Math.min(total - 1, current + siblings);
  out.push(1);
  if (start > 2) out.push('left-ellipsis');
  for (let i = start; i <= end; i++) out.push(i);
  if (end < total - 1) out.push('right-ellipsis');
  if (total > 1) out.push(total);
  return out;
};

interface PaginationProps {
  /** Total number of pages. */
  total?: number;
  /** Active page (1-based). Clamped to [1, total]. */
  current?: number;
  /** Fires when the user clicks a page button or prev/next. */
  onChange?: (page: number) => void;
  /** How many page buttons to show on each side of current before collapsing to an ellipsis. */
  siblings?: number;
  /** Button footprint. Match the surrounding table density. */
  size?: 'sm' | 'md' | 'lg';
  /** Draws a border around every button — better on low-contrast surfaces. */
  outline?: boolean;
  /** Hide the prev/next labels — show only the chevron. */
  compact?: boolean;
  /** Add double-chevron buttons for jumping to the first and last page. */
  showFirstLast?: boolean;
}

const Pagination = (props: PaginationProps) => {
  const total = props.total || 1;
  const current = Math.min(Math.max(props.current || 1, 1), total);
  const onChange = props.onChange || (() => {});
  const siblings = props.siblings ?? 1;
  const showFirstLast = props.showFirstLast || false;
  const cls = ['pg']
    .concat(props.size && props.size !== 'md' ? [props.size] : [])
    .concat(props.outline ? ['outline'] : [])
    .join(' ');
  const range = pageRange(current, total, siblings);
  const go = (n: number) => onChange(Math.min(Math.max(n, 1), total));
  return (
    <nav className={cls} role="navigation" aria-label="Pagination">
      {showFirstLast && (
        <button className="pg-btn" onClick={() => go(1)} disabled={current === 1} aria-label="First page">
          <Icons.chevronLeft size={12} className="ico-prev"/><Icons.chevronLeft size={12} className="ico-prev"/>
        </button>
      )}
      <button className="pg-btn" onClick={() => go(current - 1)} disabled={current === 1} aria-label="Previous page">
        <Icons.chevronLeft size={14} className="ico-prev"/>
        {props.compact ? null : <span>Previous</span>}
      </button>
      {range.map((p, i) =>
        typeof p === 'string'
          ? <span key={p + i} className="pg-ellipsis" aria-hidden="true">…</span>
          : <button key={p} className={'pg-btn' + (p === current ? ' is-active' : '')} onClick={() => go(p)} aria-current={p === current ? 'page' : undefined} aria-label={`Page ${p}`}>{p}</button>
      )}
      <button className="pg-btn" onClick={() => go(current + 1)} disabled={current === total} aria-label="Next page">
        {props.compact ? null : <span>Next</span>}
        <Icons.chevronRight size={14} className="ico-next"/>
      </button>
      {showFirstLast && (
        <button className="pg-btn" onClick={() => go(total)} disabled={current === total} aria-label="Last page">
          <Icons.chevronRight size={12} className="ico-next"/><Icons.chevronRight size={12} className="ico-next"/>
        </button>
      )}
    </nav>
  );
};

export { Pagination };
