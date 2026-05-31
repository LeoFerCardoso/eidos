import * as React from 'react';
import { HealthBadge } from '@/components/forge/health-badge';
import { Icons } from '@/components/forge/icons';
import { RelativeTime } from '@/components/forge/relative-time';

type AgentData = {
  name?: string;
  model?: string;
  status?: 'up' | 'degraded' | 'down' | 'unknown' | string;
  summary?: string;
  capabilities?: string[];
  calls?: number;
  successRate?: number;
  lastRun?: string | number | Date;
};

const AgentCard = ({ agent, onOpen }: {
  /** Agent record — name, model, status, summary, capabilities, calls, successRate, lastRun. */
  agent?: AgentData;
  /** Click handler. Wires the tile as a button (Enter / Space). */
  onOpen?: () => void;
}) => {
  if (!agent) return null;
  const stats = [];
  if (agent.calls != null) stats.push(<span key="c"><span className="v">{agent.calls.toLocaleString()}</span> runs</span>);
  if (agent.successRate != null) stats.push(<span key="s"><span className="v">{agent.successRate}%</span> success</span>);
  return (
    <div className="agent-card" role={onOpen ? 'button' : undefined} tabIndex={onOpen ? 0 : undefined}
         onClick={onOpen} onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && onOpen) onOpen(); }}>
      <div className="ac-head">
        <span className="ac-avatar"><Icons.agent size={20}/></span>
        <div className="ac-id">
          <span className="ac-name">{agent.name}</span>
          {agent.model && <span className="ac-model">{agent.model}</span>}
        </div>
        {agent.status && <HealthBadge state={agent.status as 'up' | 'degraded' | 'down' | 'unknown'}/>}
      </div>
      {agent.summary && <div className="ac-summary">{agent.summary}</div>}
      {agent.capabilities && agent.capabilities.length > 0 && (
        <div className="ac-caps">
          {agent.capabilities.slice(0, 5).map((c) => <span key={c} className="chip">{c}</span>)}
        </div>
      )}
      {(stats.length > 0 || agent.lastRun) && (
        <div className="ac-foot">
          <span className="ac-stats">
            {stats.map((s, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="sep">·</span>}
                {s}
              </React.Fragment>
            ))}
          </span>
          {agent.lastRun && <span className="ac-time"><RelativeTime value={agent.lastRun}/></span>}
        </div>
      )}
    </div>
  );
};

export { AgentCard };
