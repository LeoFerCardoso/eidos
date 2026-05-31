'use client';
// Eidos IDP — AI Chat · Search chat history.
//
// The "Search chats" row in the chat sidebar lands here. A big search input
// at the top, a "Recent searches" chip row, and a results list grouped by
// time bucket (Today / This week / Earlier). Each result row mirrors the
// canonical .ai-hist-item layout: title (with the matching substring
// highlighted in ember) + a one-line preview + a meta line (project · time).
//
// The page deliberately reuses the chat sidebar so the user can pivot
// between "Search" and a specific chat without losing context.
import * as React from 'react';
import { Icons } from '@/ds/core';
import { ChatShell, RECENTS, YESTERDAY, chatHref } from './chat-shell';

// ── Searchable corpus ───────────────────────────────────────────────────
// Same threads the sidebar shows, plus a few "older" buckets so the
// search results have richer time bucketing. Each row carries a project
// tag + a snippet so the result rendering matches real chat search UIs.
type Result = {
  id: string;
  title: string;
  snippet: string;
  project: string;
  when: string;
  bucket: 'today' | 'week' | 'earlier';
};

const CORPUS: Result[] = [
  ...RECENTS.map((r, i) => ({ id: r.id, title: r.title, snippet: r.preview, project: ['Pix tribe','Incident library','Runbooks'][i % 3], when: i === 0 ? '14:01' : i === 1 ? '11:24' : '09:08', bucket: 'today' as const })),
  ...YESTERDAY.map((r, i) => ({ id: r.id, title: r.title, snippet: r.preview, project: ['Runbooks','Data platform','Release notes','SAST sweeps','Pix tribe'][i % 5], when: ['Yesterday','Yesterday','2d ago','3d ago','4d ago'][i % 5], bucket: i < 2 ? ('week' as const) : ('earlier' as const) })),
  // A handful of older results so the "Earlier" bucket has signal.
  { id: 'pix-throttle',   title: 'Pix throttle config — 06/04 spike',         snippet: 'Add a 2s throttle on the offline path until…',                 project: 'Pix tribe',   when: '2w ago', bucket: 'earlier' },
  { id: 'cost-rev-prev',  title: 'Q4 cost review — Cloud Run rightsizing',    snippet: 'Cloud Run accounts for 18% of the platform bill…',           project: 'Cost reviews', when: '3w ago', bucket: 'earlier' },
];

const RECENT_QUERIES = [
  'p95 spike', 'circuit breaker', 'rollback runbook', 'SAST findings', 'cost review',
];

// Highlight the matching substring in ember. Case-insensitive.
const highlight = (text: string, q: string): React.ReactNode => {
  if (!q) return text;
  const lower = text.toLowerCase();
  const ql = q.toLowerCase();
  const i = lower.indexOf(ql);
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + ql.length)}</mark>
      {text.slice(i + ql.length)}
    </>
  );
};

const App = () => {
  const [q, setQ] = React.useState('p95');

  const matches = CORPUS.filter(r =>
    !q
      || r.title.toLowerCase().includes(q.toLowerCase())
      || r.snippet.toLowerCase().includes(q.toLowerCase())
  );

  const buckets: { key: 'today' | 'week' | 'earlier'; label: string }[] = [
    { key: 'today',   label: 'Today' },
    { key: 'week',    label: 'This week' },
    { key: 'earlier', label: 'Earlier' },
  ];

  return (
    <ChatShell side="search" crumbs={['Eidos', 'AI', 'Search chats']}>
      <div className="aic-search">

        <header className="aic-search-head">
          <span className="eyebrow">Eidos AI · Search</span>
          <h1>Search your chat history</h1>
          <p className="lede">
            Find an answer the assistant already gave, or jump back into a thread.
            Searches across every chat across every project.
          </p>
        </header>

        <div className="aic-search-field">
          <span className="ic"><Icons.search size={16}/></span>
          <input
            type="search"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search chats, messages, citations…"
            aria-label="Search chats"
            autoFocus
          />
          {q && (
            <button
              type="button"
              className="clear"
              onClick={() => setQ('')}
              aria-label="Clear search"
            >
              <Icons.x size={12}/>
            </button>
          )}
          <span className="kbd">esc</span>
        </div>

        <div className="aic-search-recent">
          <span className="aic-search-recent-label">Recent</span>
          <div className="aic-search-recent-chips">
            {RECENT_QUERIES.map(rq => (
              <button
                key={rq}
                className={'aic-search-chip' + (q === rq ? ' is-active' : '')}
                onClick={() => setQ(rq)}
              >
                <Icons.clock size={11}/>
                {rq}
              </button>
            ))}
          </div>
        </div>

        <div className="aic-search-summary">
          {matches.length === 0
            ? <>No matches for <code>{q}</code></>
            : <><b>{matches.length}</b> {matches.length === 1 ? 'result' : 'results'} for <code>{q}</code></>}
        </div>

        {/* Grouped results — Today / This week / Earlier. */}
        {buckets.map(b => {
          const rows = matches.filter(r => r.bucket === b.key);
          if (rows.length === 0) return null;
          return (
            <section key={b.key} className="aic-search-bucket">
              <div className="aic-search-bucket-head">
                <span>{b.label}</span>
                <span>{rows.length}</span>
              </div>
              <ul className="aic-search-rows">
                {rows.map(r => (
                  <li key={r.id}>
                    <a className="aic-search-row" href={chatHref(r.id)}>
                      <span className="row-icon"><Icons.chat size={13}/></span>
                      <div className="row-body">
                        <div className="row-title">{highlight(r.title, q)}</div>
                        <div className="row-snippet">{highlight(r.snippet, q)}</div>
                        <div className="row-meta">
                          <span>{r.project}</span>
                          <span className="dot">·</span>
                          <span>{r.when}</span>
                        </div>
                      </div>
                      <Icons.arrowUp size={12} className="row-chev"/>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        {matches.length === 0 && (
          <div className="aic-search-empty">
            <Icons.search size={28}/>
            <p>No matches in your chat history.</p>
            <p className="hint">Try a different keyword or remove filters.</p>
          </div>
        )}
      </div>

      <style>{`
        .aic-search {
          inline-size: 100%;
          max-inline-size: 920px;
          margin-inline: auto;
          padding: 32px 28px 48px;
        }

        .aic-search-head { margin-block-end: 22px; }
        .aic-search-head .eyebrow {
          font-family: var(--font-mono);
          font-size: 10.5px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--ember);
        }
        .aic-search-head h1 {
          font-size: 24px; font-weight: 600;
          color: var(--fg);
          letter-spacing: -0.015em;
          margin: 6px 0 6px;
        }
        .aic-search-head .lede {
          font-size: 13.5px; line-height: 1.55;
          color: var(--fg-muted);
          margin: 0;
          max-inline-size: 64ch;
        }

        /* Big search field — the focal point of the page. Uses the DS
           ring tokens for focus, matches input chrome elsewhere. */
        .aic-search-field {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px;
          background: var(--surface);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-xl);
          transition: outline-color var(--dur-fast) var(--ease);
          margin-block-end: 14px;
        }
        .aic-search-field:focus-within {
          outline: var(--ring-width) solid var(--ring);
          outline-offset: var(--ring-offset);
        }
        .aic-search-field .ic { color: var(--fg-subtle); flex: 0 0 auto; }
        .aic-search-field input {
          flex: 1 1 auto;
          background: transparent; border: 0; outline: none;
          color: var(--fg);
          font: 400 15px/1.4 var(--font-sans);
        }
        .aic-search-field input::placeholder { color: var(--fg-faint); }
        /* Hide the browser's native search-input clear × so it doesn't
           double-up with our themed .clear button. Covers WebKit / Blink
           (Chrome, Safari, Edge); Firefox doesn't render a clear button
           on type="search" so nothing extra is needed there. */
        .aic-search-field input::-webkit-search-cancel-button,
        .aic-search-field input::-webkit-search-decoration { -webkit-appearance: none; appearance: none; display: none; }
        .aic-search-field .clear {
          background: transparent; border: 0;
          inline-size: 22px; block-size: 22px;
          display: inline-flex; align-items: center; justify-content: center;
          border-radius: 4px;
          color: var(--fg-subtle); cursor: pointer;
        }
        .aic-search-field .clear:hover { background: var(--surface-hover); color: var(--fg); }
        .aic-search-field .kbd {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--fg-faint);
          padding: 2px 6px;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: 4px;
        }

        /* Recent chips */
        .aic-search-recent {
          display: flex; align-items: center; gap: 10px;
          flex-wrap: wrap;
          margin-block-end: 18px;
        }
        .aic-search-recent-label {
          font-family: var(--font-mono);
          font-size: 10.5px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--fg-faint);
        }
        .aic-search-recent-chips {
          display: flex; gap: 6px; flex-wrap: wrap;
        }
        .aic-search-chip {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 10px;
          background: transparent;
          border: 1px solid var(--border-strong);
          border-radius: 999px;
          color: var(--fg-muted);
          font: 500 12px/1 var(--font-sans);
          cursor: pointer;
          transition: background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);
        }
        .aic-search-chip:hover { color: var(--fg); background: var(--surface-hover); }
        .aic-search-chip.is-active {
          background: var(--ember-soft);
          border-color: color-mix(in oklab, var(--ember) 25%, transparent);
          color: var(--ember);
        }
        .aic-search-chip svg { color: currentColor; }

        .aic-search-summary {
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--fg-muted);
          letter-spacing: 0.02em;
          margin-block-end: 14px;
        }
        .aic-search-summary code {
          color: var(--ember);
          font-family: var(--font-mono);
        }

        /* Result buckets */
        .aic-search-bucket { margin-block-end: 22px; }
        .aic-search-bucket-head {
          display: flex; align-items: center; justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 10.5px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--fg-faint);
          padding-block: 6px;
          border-block-end: 1px solid var(--border);
          margin-block-end: 6px;
        }
        .aic-search-rows { list-style: none; padding: 0; margin: 0; }
        .aic-search-row {
          display: grid;
          grid-template-columns: 28px 1fr auto;
          gap: 14px;
          align-items: start;
          padding: 12px 12px;
          background: transparent;
          border-radius: var(--radius-md);
          color: var(--fg);
          text-decoration: none;
          transition: background var(--dur-fast) var(--ease);
        }
        .aic-search-row:hover { background: var(--surface-hover); }
        .row-icon {
          display: inline-flex; align-items: center; justify-content: center;
          inline-size: 28px; block-size: 28px;
          background: var(--ember-soft);
          color: var(--ember);
          border-radius: var(--radius-md);
          margin-block-start: 1px;
        }
        .row-title {
          font-size: 13.5px; font-weight: 500;
          color: var(--fg);
          margin-block-end: 3px;
        }
        .row-title mark, .row-snippet mark {
          background: var(--ember-soft);
          color: var(--ember);
          padding: 0 2px;
          border-radius: 2px;
          font-weight: 600;
        }
        .row-snippet {
          font-size: 12.5px;
          color: var(--fg-muted);
          line-height: 1.5;
          margin-block-end: 4px;
        }
        .row-snippet mark { font-weight: 500; }
        .row-meta {
          display: inline-flex; gap: 6px; align-items: center;
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--fg-faint);
        }
        .row-meta .dot { color: var(--fg-faint); }
        .row-chev {
          color: var(--fg-faint);
          transform: rotate(45deg);
          margin-block-start: 4px;
        }
        .aic-search-row:hover .row-chev { color: var(--ember); }

        /* Empty state */
        .aic-search-empty {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 6px;
          padding: 56px 0;
          color: var(--fg-faint);
        }
        .aic-search-empty p { margin: 0; }
        .aic-search-empty .hint { font-size: 12px; }
      `}</style>
    </ChatShell>
  );
};

export default App;
