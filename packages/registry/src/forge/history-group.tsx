import * as React from 'react';
import { HistoryItem } from '@/components/forge/history-item';

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

interface HistoryGroupProps {
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

const HistoryGroup = ({
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

export { HistoryGroup };
