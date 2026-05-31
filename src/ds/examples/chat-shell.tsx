'use client';
// Forge IDP — shared ChatShell for every AI Chat example.
//
// Wraps the standard FShell (rail + topbar) and adds a fixed 264px column
// of chat-history navigation BETWEEN the rail and the main content. The
// sidebar uses the canonical <History/> primitives from @/ds/core plus a
// small "New chat" CTA at the top and a "Projects · Library · Search"
// row below it (the destinations are pages of their own).
//
// Each chat example just calls:
//
//   <ChatShell side="recent" activeChat="pix-p95"> … </ChatShell>
//
// `side` is a slug for the sidebar's highlight ("new" · "projects" ·
// "library" · "search" · "recent"). When the user is in a chat, set
// side="recent" and pass the chat's id as `activeChat` so the History row
// gets the ember accent. Real navigation — every nav row + history row is
// an <a href> so clicking moves between the 5 chat example pages.
import * as React from 'react';
import { Icons } from '@/ds/core';
import { FShell } from './example-shell';

// ── Pinned + recent + yesterday data ────────────────────────────────────
// One source of truth — keeps every chat example showing the same sidebar.
// `chat` slugs map to a query-param on /example/ai-chat-active so the
// active thread page can render the right title in its crumbs.
export const PINNED = [
  { id: 'space-pix',      label: 'Pix tribe',         icon: 'folder' },
  { id: 'space-incident', label: 'Incident library',  icon: 'folder' },
  { id: 'space-runbook',  label: 'Runbooks',          icon: 'folder' },
];

export const RECENTS = [
  { id: 'pix-p95',     title: 'Why is pix-router p95 climbing?',          preview: 'Looking at the last 6h of metrics…' },
  { id: 'breaker',     title: 'Draft a circuit breaker for bureau-gw',    preview: 'Here is a Resilience4j config for…' },
  { id: 'fraud-spike', title: 'Fraud-engine error spike post-deploy',     preview: 'The error is in the rule engine…' },
];

export const YESTERDAY = [
  { id: 'kyc-flow',   title: 'kyc-orchestrator — Ring 1 rollout plan',     preview: 'Ring 1 starts with the LATAM cohort…' },
  { id: 'cost',       title: 'data-export S3 cost analysis',               preview: 'You can cut ~40% by switching to…' },
  { id: 'ledger',     title: 'ledger-svc idempotency review',              preview: 'The retry handler is missing a dedup key…' },
  { id: 'sast',       title: 'SAST findings sweep — Q2 services',          preview: '12 services have high-severity findings…' },
  { id: 'flag-merch', title: 'merchant-fee-v2 flag rollout review',        preview: 'Suggest cohort 2 (10%) for tomorrow…' },
];

export type ChatSide = 'new' | 'projects' | 'library' | 'search' | 'recent';

// Per-chat destination — most threads open in the standard active-thread
// example, but some are wired to surface-specific demos. The "breaker"
// (Draft a circuit breaker for bureau-gw) thread is the canonical example
// for the artifact docked-panel layout, so it routes there instead.
// Any chat NOT in this map falls back to /example/ai-chat-active?chat=<id>.
const CHAT_HREF_OVERRIDE: Record<string, string> = {
  breaker: '/example/ai-chat-artifacts',
};

export const chatHref = (id: string): string =>
  CHAT_HREF_OVERRIDE[id] || '/example/ai-chat-active?chat=' + id;

// ── Side nav row used by ChatShell sidebar ──────────────────────────────
const SideRow = ({
  icon, label, href, count, kbd, active,
}: {
  icon: string;
  label: string;
  href: string;
  count?: number;
  kbd?: string;
  active?: boolean;
}) => {
  const I = (Icons as any)[icon] || Icons.folder;
  return (
    <a
      href={href}
      className={'cs-side-row' + (active ? ' is-active' : '')}
      aria-current={active ? 'page' : undefined}
    >
      <I size={14}/>
      <span className="label">{label}</span>
      {typeof count === 'number' && <span className="count">{count}</span>}
      {kbd && <span className="kbd">{kbd}</span>}
    </a>
  );
};

// ── Sidebar ─────────────────────────────────────────────────────────────
// Fixed-width column with the canonical chat history. The "New chat" CTA
// is the top hero affordance; the 4 nav rows below it are the cross-page
// destinations; history is grouped Pinned / Recents / Yesterday using the
// core <HistoryGroup/> primitive (active row gets the ember accent).
// Single history row — renders as an <a> so the chat is a real link
// (the core HistoryItem uses onClick + role="button" which can't navigate).
// Reuses the existing .ai-hist-item / .body / .title / .preview classes
// from ai.css so the visual is identical to the History primitive.
const HistoryLink = ({
  href, title, preview, active,
}: {
  href: string; title: string; preview: string; active?: boolean;
}) => (
  <a
    href={href}
    className={'ai-hist-item' + (active ? ' is-active' : '')}
    style={{ textDecoration: 'none', color: 'inherit' }}
  >
    <div className="body">
      <div className="title">{title}</div>
      <div className="preview">{preview}</div>
    </div>
  </a>
);

// One bucket header + its rows. Same .ai-hist-group / .ai-hist-group-head
// shape as the core HistoryGroup, but the rows are <a>s instead of clicky
// divs. Side-effect-free.
const HistoryBucket = ({
  label, items, side, activeChat,
}: {
  label: string;
  items: typeof RECENTS;
  side: ChatSide;
  activeChat?: string;
}) => (
  <div className="ai-hist-group">
    <div className="ai-hist-group-head">
      <span>{label}</span>
      <span>{items.length}</span>
    </div>
    {items.map(t => (
      <HistoryLink
        key={t.id}
        href={chatHref(t.id)}
        title={t.title}
        preview={t.preview}
        active={side === 'recent' && activeChat === t.id}
      />
    ))}
  </div>
);

export const ChatHistorySidebar = ({
  side,
  activeChat,
}: {
  side: ChatSide;
  activeChat?: string;
}) => (
  <aside className="cs-side" aria-label="AI Chat navigation">
    <a
      href="/example/ai-chat"
      className={'cs-newchat' + (side === 'new' ? ' is-active' : '')}
    >
      <Icons.plus size={14}/>
      <span>New chat</span>
    </a>

    <nav className="cs-side-nav" aria-label="Primary">
      <SideRow icon="folder" label="Projects"     href="/example/ai-projects"     count={PINNED.length} active={side === 'projects'}/>
      <SideRow icon="book"   label="Library"      href="/example/ai-chat-library" active={side === 'library'}/>
      <SideRow icon="search" label="Search chats" href="/example/ai-chat-search"  kbd="⌘K"              active={side === 'search'}/>
    </nav>

    <div className="cs-side-sep" role="separator"/>

    <div className="cs-side-group">Pinned</div>
    <nav className="cs-side-nav" aria-label="Pinned projects">
      {PINNED.map(p => {
        const I = (Icons as any)[p.icon] || Icons.folder;
        return (
          <a
            key={p.id}
            href={'/example/ai-project-detail?project=' + p.id}
            className={'cs-side-row' + (activeChat === p.id ? ' is-active' : '')}
          >
            <I size={14}/>
            <span className="label">{p.label}</span>
          </a>
        );
      })}
    </nav>

    <div className="cs-side-sep" role="separator"/>

    <HistoryBucket label="Recents"   items={RECENTS}   side={side} activeChat={activeChat}/>
    <HistoryBucket label="Yesterday" items={YESTERDAY} side={side} activeChat={activeChat}/>
  </aside>
);

// ── ChatShell ───────────────────────────────────────────────────────────
// Composes FShell (rail + topbar) with the fixed history sidebar and the
// chat main column. Pages just pass `crumbs`, `side`, optional `activeChat`,
// and their content as children.
export const ChatShell = ({
  side,
  activeChat,
  crumbs,
  /** When true, the chat-history sidebar collapses out of the layout
   *  (grid column shrinks to 0). Used by surfaces that need the full
   *  horizontal room — typically the Artifacts page binds this to its
   *  panelOpen state so the artifact panel can spread, then the sidebar
   *  comes back when the artifact closes. */
  sidebarCollapsed = false,
  children,
}: {
  side: ChatSide;
  activeChat?: string;
  crumbs?: any[];
  sidebarCollapsed?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <FShell nav="chat" crumbs={crumbs || ['Forge', 'AI', 'New chat']} fullBleed>
      <div className={'cs-app' + (sidebarCollapsed ? ' is-side-collapsed' : '')}>
        <ChatHistorySidebar side={side} activeChat={activeChat}/>
        <section className="cs-main">{children}</section>
      </div>

      {/* Geometry-only CSS — every colour / radius / spacing is tokenised.
          The chat sidebar reuses .ai-hist-* (History primitive styles from
          ai.css) for the history rows; only the layout glue lives here. */}
      <style>{`
        /* The shell takes the full available vertical space below the
           topbar (48px). Both columns get their own overflow:auto so the
           sidebar and the chat scroll INDEPENDENTLY — sidebar stays put
           while the conversation scrolls, like every modern chat UI. */
        .cs-app {
          display: grid;
          grid-template-columns: 264px minmax(0, 1fr);
          block-size: calc(100dvh - 48px);
          background: var(--bg);
          overflow: hidden;
          /* Matches the Drawer's inline-size easing + the chat column's
             max-inline-size easing so the sidebar's slide-in lands at the
             same moment as the artifact's slide-out — one fluid motion. */
          transition: grid-template-columns 280ms cubic-bezier(0.32, 0.72, 0, 1);
        }
        /* Collapsed-sidebar mode — the first grid track shrinks to 0 so
           the main area takes the full width. The .cs-side inside also
           animates its inline-size, then disappears via visibility once
           the transition settles (it's still in the DOM so the focus
           order doesn't jump). */
        .cs-app.is-side-collapsed {
          grid-template-columns: 0 minmax(0, 1fr);
        }
        @media (max-width: 880px) {
          .cs-app { grid-template-columns: minmax(0, 1fr); }
          .cs-side { display: none; }
        }

        /* Sidebar — fixed column between rail and main, independently
           scrollable. min-block-size: 0 lets it shrink inside the grid
           cell so overflow-y actually scrolls instead of overflowing the
           viewport. */
        .cs-side {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 12px 10px;
          background: var(--bg-elevated);
          border-inline-end: 1px solid var(--border);
          overflow: hidden auto;
          min-block-size: 0;
          block-size: 100%;
          /* Animate the inline-size + opacity so the collapse reads as a
             single fluid motion with the .cs-app grid track. */
          transition: opacity 200ms var(--ease), visibility 240ms;
        }
        .cs-app.is-side-collapsed > .cs-side {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        /* New chat CTA — ALWAYS primary ember across every page. The
           sidebar's job is to give the user a one-click escape into a new
           thread regardless of where they are; varying the visual weight
           per page (filled on /ai-chat, ghost everywhere else) made it
           harder to find. The Chat-icon highlight in the rail signals
           "you are in chat"; this CTA always signals "start a new one". */
        .cs-newchat {
          display: inline-flex; align-items: center; gap: 8px;
          inline-size: 100%;
          padding: 9px 12px;
          background: var(--ember);
          color: var(--ember-fg);
          border: 1px solid var(--ember);
          border-radius: var(--radius-lg);
          font: 600 13px/1 var(--font-sans);
          text-decoration: none;
          transition: background var(--dur-fast) var(--ease);
        }
        .cs-newchat:hover { background: var(--ember-glow, var(--ember)); }
        .cs-newchat > svg { color: var(--ember-fg); }

        /* Side-nav rows — flat, with hover + active states. */
        .cs-side-nav {
          display: flex; flex-direction: column;
          gap: 1px;
          padding: 2px 0;
        }
        .cs-side-row {
          display: flex; align-items: center; gap: 10px;
          inline-size: 100%;
          padding: 7px 10px;
          border-radius: var(--radius-md);
          background: transparent;
          color: var(--fg);
          text-decoration: none;
          font-size: 13px; font-weight: 500;
          transition: background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);
          white-space: nowrap;
        }
        .cs-side-row > svg { color: var(--fg-muted); flex: 0 0 auto; }
        .cs-side-row > .label {
          flex: 1 1 auto; min-inline-size: 0;
          overflow: hidden; text-overflow: ellipsis;
        }
        .cs-side-row:hover { background: var(--surface-hover); }
        .cs-side-row.is-active {
          background: var(--ember-soft);
          color: var(--ember);
        }
        .cs-side-row.is-active > svg { color: var(--ember); }
        .cs-side-row > .count {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--fg-muted);
          padding: 1px 6px;
          border-radius: 999px;
          background: var(--surface);
          border: 1px solid var(--border);
        }
        .cs-side-row > .kbd {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--fg-muted);
          padding: 1px 5px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 4px;
        }

        .cs-side-sep {
          block-size: 1px;
          background: var(--border);
          margin: 6px 6px;
        }
        .cs-side-group {
          font-family: var(--font-mono);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--fg-faint);
          padding: 8px 10px 4px;
        }

        /* Recent / Yesterday history buckets — render the canonical
           .ai-hist-group / .ai-hist-item visual but with anchor rows so
           clicking a chat navigates. */
        .cs-side .ai-hist-group { margin-block: 6px; }
        .cs-side .ai-hist-item { cursor: pointer; }

        /* Main column — fills the remaining grid track. Scrolls
           independently of the sidebar so the user can read a long chat
           without losing their place in the history list. */
        .cs-main {
          display: flex;
          flex-direction: column;
          min-block-size: 0;
          block-size: 100%;
          overflow-y: auto;
          background: var(--bg);
        }
      `}</style>
    </FShell>
  );
};

export default ChatShell;
