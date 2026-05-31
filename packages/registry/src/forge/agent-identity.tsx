import * as React from 'react';
import { AILabel } from '@/components/forge/ai-label';
import { AgentAvatar } from '@/components/forge/agent-avatar';

const AgentIdentity = ({
  agent = {},
  size = 32,
  label = false,
  className,
  style,
}: {
  /** Agent descriptor — name, model id, and optional presence status. */
  agent?: { name?: string; model?: string; status?: 'online' | 'away' | 'offline' | 'busy' };
  /** Avatar diameter in px. Controls the AgentAvatar inside this row. */
  size?: number;
  /** When true, appends an AILabel pill after the agent name. */
  label?: boolean;
  /** Extra class names applied to the root span. */
  className?: string;
  /** Inline styles merged onto the root span. */
  style?: React.CSSProperties;
}) => (
  <span className={'ai-agent-id' + (className ? ' ' + className : '')} style={style}>
    <AgentAvatar size={size} status={agent.status} name={agent.name}/>
    <span className="ai-agent-id-text">
      <span className="ai-agent-id-name">
        {agent.name || 'Eidos AI'}
        {label && <AILabel variant="pill" size="sm">AI</AILabel>}
      </span>
      {agent.model && <span className="ai-agent-id-model">{agent.model}</span>}
    </span>
  </span>
);

export { AgentIdentity };
