import * as React from 'react';
import { Icons } from '@/components/forge/icons';

interface CitationSource {
  id: number;
  domain: string;
  title: string;
  url: string;
  snippet: string;
  /** Human-formatted freshness string, e.g. "14:01 · 18s ago" */
  fetched?: string;
}

const PER_PAGE = 5;

const Sources = ({
  sources,
  title = 'Sources',
  collapsible = true,
  defaultOpen = true,
  onSelect,
  perPage = PER_PAGE,
  countNoun = 'findings',
}: {
  /** Ordered array of source objects. Array position IS the rank — index 0 → rank [1], etc. */
  sources: CitationSource[];
  /** Panel header label. Localize for RTL or any language. */
  title?: string;
  /** Renders the list behind a disclosure button. Use for compact contexts where vertical space is scarce. */
  collapsible?: boolean;
  /** When collapsible=true, controls the initial open state. */
  defaultOpen?: boolean;
  /** When provided, intercepts link clicks and calls the handler with the source object instead of opening the URL. */
  onSelect?: (source: CitationSource) => void;
  /** Number of sources shown per page before pagination kicks in. */
  perPage?: number;
  /** Plural noun appended after the count: "{title} · {n} {countNoun}". Default "findings". */
  countNoun?: string;
}) => {
  const [open, setOpen] = React.useState(defaultOpen);
  const [page, setPage] = React.useState(0);

  const paginated = sources.length > perPage;
  const totalPages = Math.max(1, Math.ceil(sources.length / perPage));
  const safePage = Math.min(page, totalPages - 1);
  const visible = paginated
    ? sources.slice(safePage * perPage, safePage * perPage + perPage)
    : sources;

  const list = (
    <ol className="ai-cite-panel-list" role={onSelect ? 'listbox' : undefined} aria-label={onSelect ? 'Select a source' : undefined}>
      {visible.map(s => (
        <li key={s.id}>
          <span className="rank">{s.id}</span>
          <a
            className="title"
            href={onSelect ? undefined : s.url}
            target={onSelect ? undefined : '_blank'}
            rel="noreferrer"
            onClick={onSelect ? (e) => { e.preventDefault(); onSelect(s); } : undefined}
            role={onSelect ? 'option' : undefined}
            aria-selected={onSelect ? false : undefined}
          >
            <span>{s.title}</span>
            <span className="url">
              <Icons.link size={10}/> {s.domain}
            </span>
          </a>
          <span className="snip">{s.snippet}</span>
          {s.fetched && (
            <span className="meta">
              <Icons.clock size={10}/> retrieved {s.fetched}
            </span>
          )}
        </li>
      ))}
    </ol>
  );

  const pagination = paginated && open && (
    <div className="ai-cite-panel-pager" role="navigation" aria-label="Sources pagination">
      <button
        className="ai-cite-panel-pager-btn"
        onClick={() => setPage((p) => Math.max(0, p - 1))}
        disabled={safePage === 0}
        aria-label="Previous page"
      ><Icons.chevronLeft size={13}/></button>
      <span className="ai-cite-panel-pager-pos">
        {safePage * perPage + 1}–{Math.min((safePage + 1) * perPage, sources.length)}
        <span className="of"> of </span>
        {sources.length}
      </span>
      <button
        className="ai-cite-panel-pager-btn"
        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
        disabled={safePage >= totalPages - 1}
        aria-label="Next page"
      ><Icons.chevronRight size={13}/></button>
    </div>
  );

  // Header — same chevron pattern as ChainOfThought: label + count + chevron
  // at the END. "{title} · {n} {countNoun} ⌄"
  const headInner = (
    <>
      <span className="label">{title}</span>
      <span className="count">{sources.length} {countNoun}</span>
      <Icons.chevronDown size={13} className="chev"/>
    </>
  );

  return (
    <div className="ai-cite-panel" data-open={open ? 'true' : 'false'}>
      {collapsible
        ? <button className="ai-cite-panel-head" onClick={() => setOpen((v) => !v)} aria-expanded={open}>{headInner}</button>
        : <div className="ai-cite-panel-head">{headInner}</div>}
      {open && list}
      {pagination}
    </div>
  );
};

export { Sources };
