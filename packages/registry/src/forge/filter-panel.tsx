import * as React from 'react';
import { Empty } from '@/components/forge/empty';
import { Icons } from '@/components/forge/icons';

type FilterItem = { value: string; label?: string; count?: number };

type FilterGroup = {
  id?: string;
  title?: string;
  items: FilterItem[];
  multi?: boolean;
  selected?: Set<string>;
  onToggle?: (value: string) => void;
};

const FilterPanel = ({ groups = [], onClear, query, onQueryChange, placeholder = 'Filter…' }: {
  /** Array of facet groups — each with a title, items, controlled selected Set, and onToggle. */
  groups?: FilterGroup[];
  /** When provided, renders a "Clear all" ghost button that resets all selections. */
  onClear?: () => void;
  /** Controlled search query that scopes the visible facets in real time. */
  query?: string;
  /** Callback fired when the search input changes. */
  onQueryChange?: (value: string) => void;
  /** Placeholder text for the search input. */
  placeholder?: string;
}) => {
  const q = (query || '').trim().toLowerCase();
  const match = (label) => !q || String(label).toLowerCase().includes(q);
  // When a search query filters every facet out of every group, show one quiet
  // Empty region instead of a blank column (fp-head + fp-search stay visible).
  const anyVisible = groups.some(g => g.items.some(it => match(it.label)));
  const showEmpty = q !== '' && !anyVisible;
  return (
    <aside className="filter-panel" aria-label="Filters">
      <div className="fp-head">
        <span className="fp-title">Filters</span>
        {onClear && <button type="button" className="fp-clear" onClick={onClear}>Clear all</button>}
      </div>
      <div className="fp-search">
        <Icons.search size={12}/>
        <input type="search" value={query || ''} onChange={(e) => onQueryChange && onQueryChange(e.target.value)}
               placeholder={placeholder} aria-label="Filter facets"/>
      </div>
      {showEmpty
        ? <Empty size="sm" title="No facets match" desc="Try a shorter or different search."/>
        : groups.map((g, gi) => {
        const visible = g.items.filter(it => match(it.label));
        if (visible.length === 0) return null;
        const titleId = `fp-grp-${g.id || gi}`;
        const radioName = `fp-${g.id || gi}`;
        return (
          <div key={g.id || gi} className="fp-group" role="group" aria-labelledby={titleId}>
            <div className="fp-group-title" id={titleId}>{g.title}</div>
            <ul className="fp-list">
              {visible.map(it => {
                const isSel = g.selected ? g.selected.has(it.value) : false;
                const inputType = g.multi ? 'checkbox' : 'radio';
                const boxCls = g.multi ? 'fc-check-box' : 'fc-radio-box';
                return (
                  <li key={it.value}>
                    <label className={'fc-control fp-row' + (isSel ? ' is-on' : '')}>
                      <input type={inputType} className="fc-input" checked={isSel}
                             name={g.multi ? undefined : radioName}
                             onChange={() => g.onToggle && g.onToggle(it.value)}/>
                      <span className={boxCls} aria-hidden="true">
                        {g.multi
                          ? <span className="fc-check-icon"><Icons.check size={10} strokeWidth={3} color="#08090A"/></span>
                          : <span className="fc-radio-dot"/>}
                      </span>
                      <span className="fp-label">{it.label}</span>
                      {it.count != null && <span className="fp-count">{it.count}</span>}
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </aside>
  );
};

export { FilterPanel };
