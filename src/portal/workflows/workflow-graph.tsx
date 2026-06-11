'use client';
// Forge · Workflow graph (React Flow). Renders a Workflow's definition as an
// interactive node graph: trigger → actions → guardrails → terminals. Node
// positions are hand-laid in the data (deterministic, no layout drift). Action
// nodes link to the real Action in /portal/actions. Static by design — nodes are
// not draggable or connectable; this is a definition view, not an editor.

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  ReactFlow, Background, Controls, Handle, Position, MarkerType,
  type Node, type Edge, type NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Icons } from '@/ds/core';
import { getAction } from '@/portal/data/actions';
import type { Workflow, WfNode, WfEdgeKind } from '@/portal/data/workflows';

const KIND_ICON: Record<WfNode['kind'], string> = {
  trigger: 'zap', action: 'command', guardrail: 'shield',
  reason: 'cpu', verify: 'check', escalate: 'user', done: 'flag',
};

const ICON = (k: string, size = 14) => {
  const C = (Icons as Record<string, React.FC<{ size?: number }>>)[k] ?? Icons.command;
  return <C size={size} />;
};

// One custom node component, branching on kind. The whole WfNode is in data.
function WfNodeView({ data }: NodeProps) {
  const n = data as unknown as WfNode;
  const iconKey = n.kind === 'action' || n.kind === 'verify'
    ? (getAction(n.actionId ?? '')?.icon ?? KIND_ICON[n.kind])
    : KIND_ICON[n.kind];
  return (
    <div className={`fp-wf-node fp-wf-${n.kind}${n.actionId ? ' is-link' : ''}`}>
      <Handle type="target" position={Position.Top} className="fp-wf-handle" />
      <span className="fp-wf-ic" aria-hidden="true">{ICON(iconKey, 14)}</span>
      <span className="fp-wf-body">
        <span className="fp-wf-label">{n.label}</span>
        {n.sublabel && <span className="fp-wf-sub">{n.sublabel}</span>}
      </span>
      {n.actionId && <span className="fp-wf-go" aria-hidden="true"><Icons.chevronRight size={12} /></span>}
      <Handle type="source" position={Position.Bottom} className="fp-wf-handle" />
    </div>
  );
}

const nodeTypes = { wf: WfNodeView };

const EDGE_COLOR: Record<WfEdgeKind, string> = {
  default: 'var(--border-strong)',
  approve: 'var(--border-strong)',
  deny: 'var(--warning)',
  branch: 'var(--fg-faint)',
};

export default function WorkflowGraph({ workflow }: { workflow: Workflow }) {
  const router = useRouter();

  const nodes: Node[] = React.useMemo(
    () => workflow.nodes.map((n) => ({
      id: n.id,
      type: 'wf',
      position: { x: n.x, y: n.y },
      data: n as unknown as Record<string, unknown>,
      draggable: false,
      connectable: false,
    })),
    [workflow],
  );

  const edges: Edge[] = React.useMemo(
    () => workflow.edges.map((e) => {
      const kind = e.kind ?? 'default';
      const color = EDGE_COLOR[kind];
      return {
        id: e.id,
        source: e.from,
        target: e.to,
        label: e.label,
        type: 'smoothstep',
        animated: kind === 'approve' && e.label === 'auto',
        markerEnd: { type: MarkerType.ArrowClosed, color, width: 16, height: 16 },
        style: { stroke: color, strokeWidth: 1.5, strokeDasharray: kind === 'deny' ? '5 4' : undefined },
        labelStyle: { fill: 'var(--fg-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' },
        labelBgStyle: { fill: 'var(--surface)', fillOpacity: 0.92 },
        labelBgPadding: [4, 2] as [number, number],
        labelBgBorderRadius: 4,
      };
    }),
    [workflow],
  );

  return (
    <div className="fp-wf-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.16 }}
        nodesDraggable={false}
        nodesConnectable={false}
        zoomOnScroll={false}
        panOnScroll={false}
        preventScrolling={false}
        minZoom={0.4}
        maxZoom={1.4}
        proOptions={{ hideAttribution: true }}
        onNodeClick={(_e, node) => {
          const actionId = (node.data as unknown as WfNode).actionId;
          if (actionId) router.push(`/portal/actions/${actionId}`);
        }}
      >
        <Background gap={18} size={1} color="var(--border)" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
