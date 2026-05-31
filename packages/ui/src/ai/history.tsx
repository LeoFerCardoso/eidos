import * as React from 'react';
// Forge AI — conversation history rail.
//
// History (HistoryShell alias): the 280px sidebar rail with New Chat pinned
// at top, a search field, and threads bucketed by recency. Inline rename
// and delete on hover.
//
// Exports:
//   History      (canonical)    — the full shell
//   HistoryShell               — alias for backward-compat
//   HistoryItem  (Item alias)   — single thread row
//   HistoryGroup (Group alias)  — date-bucket group
//
// Accessibility: the list region is a `role="listbox"` and each row a
// `role="option"` with `aria-selected` driven by the active thread. Rows are
// roving-focusable (↑/↓ move focus, Enter/Space activate, F2 enters rename),
// and the per-row rename/delete actions are revealed on focus — not only on
// hover — so they are reachable by keyboard. Each HistoryGroup is a
// `role="group"` labelled by its bucket header. The search field is a real
// labelled input wired to `onSearch`, paired with an `aria-live="polite"`
// result-count region.
//
// Empty state uses the `.ai-hist-empty` CSS block (not the Core <Empty/>
// atom) because the markup is tightly coupled to `.ai-hist` CSS — it sits
// inside the list scroll area and must be styled as a rail-child, not a
// standalone empty-state card. TODO: revisit when ai.css is refactored.
//
// Timestamps are not rendered by this component (thread rows show title +
// preview only); the host app passes `updatedAt` for grouping but the rail
// itself only renders the group label (Today / Yesterday / etc.). Therefore
// RelativeTime is not used here.
//
// Styles live in src/styles/ai.css under the `.ai-hist-*` block.
import { Icons } from '../icons';

// ── Types ─────────────────────────────────────────────────────────────────────

/** A single conversation thread displayed in the history rail. */
export interface HistoryThread {
  id: string;
  title: string;
  preview: string;
  /** ISO date string used for recency grouping. */
  updatedAt?: string;
  starred?: boolean;
  active?: boolean;
  /** Associates the thread with a project when groupBy="project". */
  projectId?: string;
}

/** A named project used for folder-style grouping when groupBy="project". */
export interface HistoryProject {
  id: string;
  name: string;
  /** Pill colour token, e.g. "ember", "warning", "ice". */
  color?: string;
}

// ── HistoryItem (Item) ────────────────────────────────────────────────────────
// One thread row. Highlights the query substring in the title when `query`
// is set.

/** Props for the HistoryItem single-thread row. */
export interface HistoryItemProps {
  /** The thread data to render. */
  thread: HistoryThread;
  /** Called when the row is clicked or activated via keyboard. */
  onActivate?: () => void;
  /** Active search query; matching substrings in the title are highlighted in ember. */
  query?: string;
  /** When provided, F2 (or the rename action) enters rename for this row. */
  onRename?: () => void;
  /** When provided, the delete action removes this row. */
  onDelete?: () => void;
  /**
   * Roving-tabindex flag. The owning list keeps exactly one focusable row
   * (`tabIndex={0}`); the rest are `tabIndex={-1}` and reached with ↑/↓.
   * Defaults to focusable so a standalone HistoryItem stays keyboard-usable.
   */
  rovingFocusable?: boolean;
}

export const HistoryItem = ({
  thread,
  onActivate,
  query = '',
  onRename,
  onDelete,
  rovingFocusable = true,
}: HistoryItemProps) => {
  // Reveal the per-row actions on keyboard focus (CSS only reveals on hover),
  // so rename/delete are reachable without a pointer.
  const [focused, setFocused] = React.useState(false);
  const renderTitle = () => {
    if (!query) return thread.title;
    const lower = thread.title.toLowerCase();
    const q = query.toLowerCase();
    const i = lower.indexOf(q);
    if (i < 0) return thread.title;
    return (
      <>
        {thread.title.slice(0, i)}
        <span className="hl">{thread.title.slice(i, i + q.length)}</span>
        {thread.title.slice(i + q.length)}
      </>
    );
  };
  return (
    <div
      className={'ai-hist-item' + (thread.active ? ' is-active' : '')}
      onClick={onActivate}
      role="option"
      aria-selected={!!thread.active}
      tabIndex={rovingFocusable ? 0 : -1}
      onFocus={() => setFocused(true)}
      onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false); }}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onActivate?.(); }
        else if (e.key === 'F2' && onRename) { e.preventDefault(); onRename(); }
      }}
    >
      <div className="body">
        <div className="title">{renderTitle()}</div>
        <div className="preview">{thread.preview}</div>
      </div>
      {thread.starred && <Icons.star className="star" size={12}/>}
      <span
        className="actions"
        // CSS hides .actions until row :hover; reveal on focus for keyboard.
        style={focused ? { display: 'inline-flex' } : undefined}
        onClick={e => e.stopPropagation()}
      >
        <button
          className="act"
          type="button"
          aria-label={`Rename ${thread.title}`}
          title="Rename (F2)"
          tabIndex={focused ? 0 : -1}
          onClick={e => { e.stopPropagation(); onRename?.(); }}
        >
          <Icons.edit size={11}/>
        </button>
        <button
          className="act danger"
          type="button"
          aria-label={`Delete ${thread.title}`}
          title="Delete"
          tabIndex={focused ? 0 : -1}
          onClick={e => { e.stopPropagation(); onDelete?.(); }}
        >
          <Icons.trash size={11}/>
        </button>
      </span>
    </div>
  );
};

// Item alias for backward-compat
export const Item = HistoryItem;

// ── HistoryGroup (Group) ──────────────────────────────────────────────────────
// One date-bucket header + its thread rows.

/** Props for the HistoryGroup date-bucket section. */
export interface HistoryGroupProps {
  /** Bucket label displayed in the group header, e.g. "Today", "Yesterday". */
  label: string;
  /** The threads belonging to this bucket. */
  threads: HistoryThread[];
  /** Active search query forwarded to each HistoryItem for highlight. */
  query?: string;
  /** Forwarded to each row — F2 / rename action enters rename for that thread. */
  onRename?: (id: string) => void;
  /** Forwarded to each row — delete action removes that thread. */
  onDelete?: (id: string) => void;
  /** Forwarded to each row — click / Enter / Space activates that thread. */
  onSelect?: (id: string) => void;
}

export const HistoryGroup = ({
  label,
  threads,
  query = '',
  onRename,
  onDelete,
  onSelect,
}: HistoryGroupProps) => {
  // Roving focus within the group: ↑/↓ move between rows, keeping a single
  // tab stop. Home/End jump to the first/last row.
  const groupRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(0);
  const move = (next: number) => {
    const rows = groupRef.current?.querySelectorAll<HTMLElement>('[role="option"]');
    if (!rows || rows.length === 0) return;
    const clamped = Math.max(0, Math.min(next, rows.length - 1));
    setActive(clamped);
    rows[clamped]?.focus();
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(active - 1); }
    else if (e.key === 'Home') { e.preventDefault(); move(0); }
    else if (e.key === 'End') { e.preventDefault(); move(threads.length - 1); }
  };
  return (
    <div
      className="ai-hist-group"
      ref={groupRef}
      role="group"
      aria-label={label}
      onKeyDown={onKeyDown}
    >
      <div className="ai-hist-group-head">
        <span>{label}</span>
        <span>{threads.length}</span>
      </div>
      {threads.map((t, i) => (
        <HistoryItem
          key={t.id}
          thread={t}
          query={query}
          rovingFocusable={i === active}
          onActivate={() => { setActive(i); onSelect?.(t.id); }}
          onRename={onRename ? () => onRename(t.id) : undefined}
          onDelete={onDelete ? () => onDelete(t.id) : undefined}
        />
      ))}
    </div>
  );
};

// Group alias for backward-compat
export const Group = HistoryGroup;

// ── HistoryList ─────────────────────────────────────────────────────────────
// The scrollable list region. Carries `role="listbox"` so the HistoryItem
// rows (role="option") and HistoryGroup sections (role="group") form a valid
// composite-widget tree. Optional — a raw `<div className="ai-hist-list">`
// still works for existing consumers; use this wrapper to get the listbox role
// and label for free.

/** Props for the HistoryList scroll region. */
export interface HistoryListProps {
  /** Accessible name for the listbox, e.g. "Conversation history". */
  label?: string;
  /** Mark the region busy while threads load (pairs with skeleton rows). */
  busy?: boolean;
  /** HistoryGroup(s) / HistoryItem(s) / empty state. */
  children?: React.ReactNode;
}

export const HistoryList = ({
  label = 'Conversation history',
  busy = false,
  children,
}: HistoryListProps) => (
  <div className="ai-hist-list" role="listbox" aria-label={label} aria-busy={busy || undefined}>
    {children}
  </div>
);

// ── History (HistoryShell) ────────────────────────────────────────────────────
// The full rail shell: New Chat CTA, panel-toggle (optional), search field,
// and a slot for HistoryGroup children.

/** Props for the History conversation-history rail. */
export interface HistoryProps {
  /** Array of conversation threads. Each thread is { id, title, preview, updatedAt, starred?, projectId? }. */
  threads?: HistoryThread[];
  /** Id of the currently-open thread. Drives the active-row highlight. */
  activeId?: string;
  /** Controlled search query. Filters threads by title + preview substring; matches are highlighted in ember. */
  query?: string;
  /** Fired on every keystroke in the search field. */
  onSearch?: (q: string) => void;
  /** Fired when a row is clicked. The host app routes to the thread. */
  onSelect?: (id: string) => void;
  /** Fired by the New Chat CTA. Should create a thread and route to it. */
  onNewChat?: () => void;
  /** When provided, hover/focus reveals a rename action; commit fires this callback. */
  onRename?: (id: string, title: string) => void;
  /** When provided, hover/focus reveals a delete action. Soft-confirm in your toast layer — never block with a dialog. */
  onDelete?: (id: string) => void;
  /** recency: Today / Yesterday / Previous 7 / Previous 30 / Older. project: groups by projectId, requires the projects prop. */
  groupBy?: 'recency' | 'project';
  /** Required when groupBy="project". Each: { id, name, color }. */
  projects?: HistoryProject[];
  /** When true, the rail fills its container. Use inside a slide-out drawer. */
  fluid?: boolean;
  /** Shows the panel-toggle icon button at the top right. */
  showActions?: boolean;
  /**
   * Result count for the `aria-live="polite"` region announced under the
   * search field. Pass the number of matching threads while a query is active.
   */
  resultCount?: number;
  /** HistoryGroup(s) + list wrapper slotted inside the rail. */
  children?: React.ReactNode;
}

export const History = ({
  fluid = false,
  query = '',
  showActions = true,
  onSearch,
  onNewChat,
  resultCount,
  children,
}: HistoryProps) => {
  const searchId = React.useId();
  return (
    <div className={'ai-hist' + (fluid ? ' fluid' : '')}>
      <div className="ai-hist-head">
        <button className="ai-hist-new" type="button" onClick={onNewChat}>
          <Icons.plus size={13}/> New chat
        </button>
        {showActions && (
          <button className="ai-hist-icon-btn" type="button" title="Open in panel" aria-label="Open in panel">
            <Icons.panelLeft size={14}/>
          </button>
        )}
      </div>
      <div className={'ai-hist-search' + (query ? ' is-active' : '')}>
        <Icons.search size={13}/>
        <label htmlFor={searchId} className="sr-only">Search conversation history</label>
        <input
          id={searchId}
          type="search"
          placeholder="Search history…"
          value={query}
          aria-label="Search conversation history"
          onChange={e => onSearch?.(e.target.value)}
        />
      </div>
      {query && typeof resultCount === 'number' && (
        <span role="status" aria-live="polite" className="sr-only">
          {resultCount === 1 ? '1 conversation' : `${resultCount} conversations`} match “{query}”
        </span>
      )}
      {children}
    </div>
  );
};

// HistoryShell alias for backward-compat
export const HistoryShell = History;
