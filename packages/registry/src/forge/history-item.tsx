import * as React from 'react';
import { Icons } from '@/components/forge/icons';

interface HistoryThread {
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

interface HistoryItemProps {
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

const HistoryItem = ({
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

export { HistoryItem };
