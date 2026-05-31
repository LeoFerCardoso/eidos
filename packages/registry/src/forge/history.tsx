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

interface HistoryProject {
  id: string;
  name: string;
  /** Pill colour token, e.g. "ember", "warning", "ice". */
  color?: string;
}

interface HistoryProps {
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
  /** When provided, hover reveals a rename action; commit fires this callback. */
  onRename?: (id: string, title: string) => void;
  /** When provided, hover reveals a delete action. Soft-confirm in your toast layer — never block with a dialog. */
  onDelete?: (id: string) => void;
  /** recency: Today / Yesterday / Previous 7 / Previous 30 / Older. project: groups by projectId, requires the projects prop. */
  groupBy?: 'recency' | 'project';
  /** Required when groupBy="project". Each: { id, name, color }. */
  projects?: HistoryProject[];
  /** When true, the rail fills its container. Use inside a slide-out drawer. */
  fluid?: boolean;
  /** Shows the panel-toggle icon button at the top right. */
  showActions?: boolean;
  /** HistoryGroup(s) + list wrapper slotted inside the rail. */
  children?: React.ReactNode;
}

const History = ({
  fluid = false,
  activeId,
  query = '',
  showActions = true,
  children,
}: HistoryProps) => (
  <div className={'ai-hist' + (fluid ? ' fluid' : '')}>
    <div className="ai-hist-head">
      <button className="ai-hist-new"><Icons.plus size={13}/> New chat</button>
      {showActions && (
        <button className="ai-hist-icon-btn" title="Open in panel">
          <Icons.panelLeft size={14}/>
        </button>
      )}
    </div>
    <div className={'ai-hist-search' + (query ? ' is-active' : '')}>
      <Icons.search size={13}/>
      <input placeholder="Search history…" defaultValue={query} readOnly/>
    </div>
    {children}
  </div>
);

export { History };
