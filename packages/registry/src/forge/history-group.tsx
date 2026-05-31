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
}

const HistoryGroup = ({
  label,
  threads,
  query = '',
}: HistoryGroupProps) => (
  <div className="ai-hist-group">
    <div className="ai-hist-group-head">
      <span>{label}</span>
      <span>{threads.length}</span>
    </div>
    {threads.map(t => <HistoryItem key={t.id} thread={t} query={query}/>)}
  </div>
);

export { HistoryGroup };
