'use client';
// Forge · Workflow detail (/portal/workflows/[id]). The definition view: the
// Action graph rendered in React Flow, a legend, and the runs of this workflow.
// Composes Eidos DS + .fp-* classes; the graph is the WorkflowGraph component.

import * as React from 'react';
import Link from 'next/link';
import { Icons, Pill, Button } from '@/ds/core';
import { usePageCrumb } from '@/portal/shell/portal-shell';
import WorkflowGraph from './workflow-graph';
import { getWorkflow, RUN_STATUS_META } from '@/portal/data/workflows';
import { ARCHETYPE_META } from '@/portal/data/agents';
import { TRIGGER_META } from '@/portal/data/actions';

const ICON = (k: string, size = 13) => {
  const C = (Icons as Record<string, React.FC<{ size?: number }>>)[k] ?? Icons.zap;
  return <C size={size} />;
};

const LEGEND_NODES: { kind: string; label: string }[] = [
  { kind: 'trigger', label: 'Trigger' },
  { kind: 'action', label: 'Action' },
  { kind: 'guardrail', label: 'Guardrail' },
  { kind: 'reason', label: 'Agent reasoning' },
  { kind: 'escalate', label: 'Human escalation' },
  { kind: 'done', label: 'Terminal' },
];

export default function WorkflowDetail({ id }: { id: string }) {
  const workflow = getWorkflow(id);
  const { setCrumb } = usePageCrumb();

  React.useEffect(() => {
    if (workflow) setCrumb({ label: workflow.name, replace: true });
    return () => setCrumb(null);
  }, [workflow, setCrumb]);

  if (!workflow) {
    return (
      <div className="fp-agents-empty" style={{ padding: '64px 0' }}>
        <Icons.pipeline size={28} />
        <p>No workflow with id &ldquo;{id}&rdquo;.</p>
        <Button variant="ghost" asChild>
          <Link href="/portal/workflows"><Icons.chevronLeft size={13} /> Back to workflows</Link>
        </Button>
      </div>
    );
  }

  const role = ARCHETYPE_META[workflow.ownerRole];
  const trig = TRIGGER_META[workflow.trigger.kind];

  return (
    <div className="fp-wfd">
      <div className="fp-agentd-topbar">
        <Link href="/portal/workflows" className="fp-back-eyebrow" style={{ marginBlockEnd: 0 }}><Icons.arrowLeft size={11} /> Workflows</Link>
        <div className="fp-agentd-topbar-actions">
          <Button variant="ghost"><Icons.edit size={14} /> Edit</Button>
          <Button variant="ember"><Icons.play size={14} /> Run workflow</Button>
        </div>
      </div>

      <div className="fp-wfd-head">
        <h1>{workflow.name}</h1>
        <Pill tone={workflow.status === 'published' ? 'neutral' : 'warning'} dot={workflow.status === 'draft'}>
          {workflow.status}
        </Pill>
      </div>
      <p className="fp-wfd-summary">{workflow.desc}</p>

      <div className="fp-wfd-facts">
        <span className="fp-wfc-role">{ICON(role.icon, 12)} {role.label}</span>
        <span className="fp-wfd-fact">{ICON(trig.icon, 12)} {workflow.trigger.label}</span>
        <span className="fp-wfd-fact">{ICON('gauge', 12)} {workflow.successRate}% success</span>
        <span className="fp-wfd-fact mono">{workflow.runsWeek} runs/wk</span>
      </div>

      {/* The Action graph */}
      <div className="fp-wfd-sec-head" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <span><Icons.share size={14} /> Orchestration</span>
        <span className="fp-wfd-hint">Click an Action node to open it in the registry</span>
      </div>
      <WorkflowGraph workflow={workflow} />

      {/* Legend */}
      <div className="fp-wf-legend" aria-label="Legend">
        {LEGEND_NODES.map((l) => (
          <span key={l.kind} className="fp-wf-leg">
            <span className={`fp-wf-swatch fp-wf-${l.kind}`} aria-hidden="true" />
            {l.label}
          </span>
        ))}
        <span className="fp-wf-leg"><span className="fp-wf-edge-swatch is-deny" aria-hidden="true" /> Escalation path</span>
      </div>

      {/* Runs of this workflow */}
      <div className="fp-wfd-sec-head" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <span><Icons.clock size={14} /> Runs of this workflow</span>
        <span className="fp-wfd-count mono">{workflow.runs.length}</span>
      </div>
      <div className="fp-wfd-runs">
        {workflow.runs.map((r) => {
          const st = RUN_STATUS_META[r.status];
          return (
            <Link key={r.id} href={`/portal/runs/${r.id}`} className="fp-wfd-run">
              <span className="id mono">{r.id}</span>
              <span className="svc">{r.service}</span>
              <span className="trig mono">{r.trigger}</span>
              <span className="when">{r.when}</span>
              <Pill tone={st.tone} dot={r.status === 'running'}>{st.label}</Pill>
              <Icons.chevronRight size={13} className="go" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
