import * as React from 'react';
import * as ReactDOM from 'react-dom';
// Eidos AI — inline citation chip + sources panel.
//
// Citation: an inline superscript chip that opens a hover/focus popover with
// the source domain, title, snippet, and URL. Markup uses `.ai-cite-*` CSS.
//
// Sources (SourcesPanel alias): a numbered list of retrieved documents below
// the response. The retrieved-at timestamp is human-formatted in the data
// ("14:01 · 18s ago") rather than a Date object — freshness is a judgment,
// not a sort key. Therefore RelativeTime is not used here (the consumer
// provides a pre-formatted string in source.fetched).
//
// Styles live in src/styles/ai.css under the `.ai-cite-*` block.
import { Icons } from '../icons';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CitationSource {
  id: number;
  domain: string;
  title: string;
  url: string;
  snippet: string;
  /** Human-formatted freshness string, e.g. "14:01 · 18s ago" */
  fetched?: string;
}

// ── Citation — inline chip + hover popover ────────────────────────────────────
// Props:
//   n       number         — numeric rank shown in the chip; must match panel entry
//   source  CitationSource — source object for the hover popover (omit to silence)
//   href    string         — override link target; defaults to source.url
//   tone    "ember" | "neutral" — ember for grounded claims; neutral for ungrounded
export const Citation = ({
  n,
  source,
  href,
  tone = 'ember',
}: {
  /** Numeric rank shown inside the chip. Must match the rank of the corresponding entry in Sources. */
  n: number;
  /** Source object used to populate the hover popover. Omit to silence the popover. */
  source?: CitationSource;
  /** Override the link target. Defaults to source.url. Opens in a new tab. */
  href?: string;
  /** ember matches the model accent; neutral is for ungrounded references. */
  tone?: 'ember' | 'neutral';
}) => {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [pos, setPos] = React.useState<{ top: number; left: number } | null>(null);
  const closeT = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const popRef = React.useRef<HTMLSpanElement>(null);
  React.useEffect(() => setMounted(true), []);
  const onEnter = () => { if (closeT.current) clearTimeout(closeT.current); setOpen(true); };
  const onLeave = () => { closeT.current = setTimeout(() => setOpen(false), 150); };
  const linkUrl = href || source?.url;
  // Click contract: when the popover is open and a target exists, the chip
  // navigates to the source in a new tab; otherwise it toggles the popover.
  const onClick = () => {
    if (open && linkUrl) { window.open(linkUrl, '_blank', 'noopener'); return; }
    setOpen(v => !v);
  };
  // Keyboard contract: Escape closes the popover and returns focus to the chip.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      e.stopPropagation();
      setOpen(false);
      btnRef.current?.focus();
    }
  };

  // Position the popover relative to the chip. It is PORTALLED to <body> (below)
  // so it escapes the `isolation: isolate` stacking context that every .ds-frame
  // establishes — otherwise the popover is trapped inside the frame and the
  // sticky page chrome (the on-this-page TOC) bleeds over it. Fixed positioning,
  // anchored above the chip (flips below when there isn't room); RTL anchors the
  // popover's inline-end edge to the chip.
  const place = React.useCallback(() => {
    const chip = btnRef.current;
    if (!chip) return;
    const r = chip.getBoundingClientRect();
    const popW = popRef.current?.offsetWidth || 280;
    const popH = popRef.current?.offsetHeight || 140;
    const gap = 8;
    const rtl = getComputedStyle(chip).direction === 'rtl';
    let left = rtl ? r.right - popW : r.left;
    left = Math.max(8, Math.min(left, window.innerWidth - popW - 8));
    const above = r.top - gap - popH;
    const top = above >= 8 ? above : r.bottom + gap;
    setPos({ top, left });
  }, []);

  React.useLayoutEffect(() => {
    if (!open || !source) { setPos(null); return; }
    place();
  }, [open, source, place]);

  React.useEffect(() => {
    if (!open) return;
    const update = () => place();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, place]);

  const popover = open && source && mounted
    ? ReactDOM.createPortal(
        <span
          ref={popRef}
          className="ai-cite-pop"
          role="dialog"
          aria-label={source.title}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          style={{
            position: 'fixed',
            top: pos ? pos.top : -9999,
            left: pos ? pos.left : -9999,
            bottom: 'auto',
          }}
        >
          <span className="ai-cite-pop-head">
            <span className="ai-cite-pop-dom">{source.domain}</span>
            <span className="ai-cite-pop-rank">[{n}]</span>
          </span>
          <span className="ai-cite-pop-title">{source.title}</span>
          <span className="ai-cite-pop-snip">{source.snippet}</span>
          <a className="ai-cite-pop-foot" href={linkUrl} target="_blank" rel="noreferrer">
            <Icons.link size={11}/>
            <span className="url">{(linkUrl || '').replace(/^https?:\/\//, '')}</span>
          </a>
        </span>,
        document.body,
      )
    : null;

  return (
    <span className="ai-cite-wrap" onMouseEnter={onEnter} onMouseLeave={onLeave} onKeyDown={onKeyDown}>
      <button
        ref={btnRef}
        className={'ai-cite-chip' + (tone === 'neutral' ? ' neutral' : '')}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={source ? `Source ${n}, ${source.domain}` : `Source ${n}`}
        onClick={onClick}
        onFocus={onEnter}
        onBlur={onLeave}
      >{n}</button>
      {popover}
    </span>
  );
};

// ── Sources — numbered sources panel ─────────────────────────────────────────
// Props:
//   sources     CitationSource[] — ordered array; index+1 is the rank
//   title       string           — panel header label (default "Sources")
//   collapsible boolean          — render behind a disclosure (for compact contexts)
//   onSelect    (source) => void — optional intercept instead of following the link
// PER_PAGE — when sources.length > this, pagination kicks in.
const PER_PAGE = 5;

export const Sources = ({
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

// Alias: SourcesPanel → Sources (backward-compat for any existing call sites)
export const SourcesPanel = Sources;
