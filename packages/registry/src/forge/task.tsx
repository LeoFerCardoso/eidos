import * as React from 'react';
import { Icons } from '@/components/forge/icons';
import { StatusDot } from '@/components/forge/status-dot';

const taskMark = (status: string) => {
  if (status === 'done')   return <Icons.check size={11}/>;
  if (status === 'error')  return <Icons.x size={11}/>;
  if (status === 'active') return <StatusDot tone="running" size="sm" pulse/>;
  return <span className="ai-task-dot"/>;
};

const Task = ({
  title, status = 'pending', detail, items,
}: {
  /** Task goal. Plain language; full-weight when active/error, muted when pending, faint-struck when done. */
  title: React.ReactNode;
  /** Drives the status mark and title weight. Transition through states as the agent works. */
  status?: string;
  /** Right-aligned (end-aligned) metadata — tier, ring, count, short observation. Mono-faced. */
  detail?: React.ReactNode;
  /** Sub-task list. Renders as a semantic ul indented from the start edge. */
  items?: any[];
}) => (
  <div className="ai-task" data-status={status}>
    <div className="ai-task-head">
      <span className="ai-task-mark">{taskMark(status)}</span>
      <span className="ai-task-title">{title}</span>
      {detail && <span className="ai-task-detail">{detail}</span>}
    </div>
    {items && items.length > 0 && (
      <ul className="ai-task-subs">
        {items.map((s, i) => (
          <li key={i} className="ai-task-sub" data-status={s.status || 'pending'}>
            <span className="ai-task-mark sm">{taskMark(s.status || 'pending')}</span>
            <span>{s.title}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export { Task };
