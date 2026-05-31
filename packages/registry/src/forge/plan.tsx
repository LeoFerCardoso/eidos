import * as React from 'react';
import { Icons } from '@/components/forge/icons';
import { StatusDot } from '@/components/forge/status-dot';

const Plan = ({
  title = 'Plan', items = [],
}: {
  /** Header label. Use "Plan" for the primary plan; override for named sub-plans. */
  title?: string;
  /** Ordered list of steps. Rendered as a semantic ol so screen readers announce position. */
  items?: any[];
}) => {
  const done = items.filter((i) => i.status === 'done').length;
  return (
    <div className="ai-plan">
      <div className="ai-plan-head">
        <span className="ico"><Icons.target size={13}/></span>
        <span className="label">{title}</span>
        <span className="count">{done}/{items.length}</span>
      </div>
      <ol className="ai-plan-list">
        {items.map((it, i) => (
          <li key={i} className="ai-plan-item" data-status={it.status || 'pending'}>
            <span className="ai-plan-mark">
              {it.status === 'done'
                ? <Icons.check size={11}/>
                : it.status === 'active'
                  ? <StatusDot tone="running" size="sm" pulse/>
                  : <span className="ai-plan-num">{i + 1}</span>}
            </span>
            <div className="ai-plan-content">
              <div className="ai-plan-title">{it.title}</div>
              {it.detail && <div className="ai-plan-detail">{it.detail}</div>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export { Plan };
