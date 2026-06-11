'use client';
// Forge · Workflows. The composite orchestration level: each workflow SEQUENCES
// Actions (with branches, guardrails and triggers) toward an outcome. The three
// Port flagship use-cases ship here as templates. A workflow does no work itself
// (see the domain model); it orchestrates Actions, and instantiates as Runs.
//
// Brief · Persona: platform owner + any agent owner. Question: what end-to-end
// flows run on this platform, who owns them, and how reliable are they? Data:
// WORKFLOWS (src/portal/data/workflows.ts). Primary action: open a workflow to
// see its graph + runs. Distinctive move: the detail renders the actual Action
// graph in React Flow, so the orchestration is visible, not described.
//
// Composes only Eidos DS + .fp-* classes.
import * as React from 'react';
import Link from 'next/link';
import { Button, Icons, Pill } from '@/ds/core';
import { FPageHeader, FSearch } from '@/portal/shell/portal-shell';
import { WORKFLOWS, KPIS, type Workflow } from '@/portal/data/workflows';
import { ARCHETYPE_META, type AgentArchetype } from '@/portal/data/agents';
import { TRIGGER_META } from '@/portal/data/actions';

const ICON = (k: string, size = 13) => {
  const C = (Icons as Record<string, React.FC<{ size?: number }>>)[k] ?? Icons.zap;
  return <C size={size} />;
};

function RoleBadge({ role }: { role: AgentArchetype }) {
  const m = ARCHETYPE_META[role];
  return <span className="fp-wfc-role">{ICON(m.icon, 12)} {m.label}</span>;
}

/* Mini DAG thumbnail: the workflow's hand-laid node positions scaled into a
   small constellation, so each card shows the SHAPE of the orchestration
   instead of reading as a text rectangle. Guardrails warm, terminals green. */
const DAG_FILL: Record<string, string> = {
  trigger: 'var(--accent-2)',
  guardrail: 'var(--warning)',
  escalate: 'var(--warning)',
  done: 'var(--success)',
};
function DagThumb({ w }: { w: Workflow }) {
  const xs = w.nodes.map((n) => n.x);
  const ys = w.nodes.map((n) => n.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const W = 220, H = 56, PAD = 8;
  const sx = (x: number) => PAD + ((x - minX) / Math.max(1, maxX - minX)) * (W - PAD * 2);
  const sy = (y: number) => PAD + ((y - minY) / Math.max(1, maxY - minY)) * (H - PAD * 2);
  const pos = new Map(w.nodes.map((n) => [n.id, { x: sx(n.x), y: sy(n.y) }]));
  return (
    <svg className="fp-wfc-dag" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      {w.edges.map((e) => {
        const a = pos.get(e.from); const b = pos.get(e.to);
        if (!a || !b) return null;
        return <line key={e.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--border-strong)" strokeWidth={1} />;
      })}
      {w.nodes.map((n) => (
        <circle key={n.id} cx={pos.get(n.id)!.x} cy={pos.get(n.id)!.y} r={3} fill={DAG_FILL[n.kind] ?? 'var(--fg-faint)'} />
      ))}
    </svg>
  );
}

function WfCard({ w }: { w: Workflow }) {
  const trig = TRIGGER_META[w.trigger.kind];
  const steps = w.nodes.filter((n) => n.kind === 'action' || n.kind === 'verify').length;
  return (
    <Link href={`/portal/workflows/${w.id}`} className="fp-wfc">
      <div className="fp-wfc-top">
        <span className="fp-wfc-name">{w.name}</span>
        <Pill tone={w.status === 'published' ? 'neutral' : 'warning'} dot={w.status === 'draft'}>
          {w.status}
        </Pill>
      </div>
      <p className="fp-wfc-desc">{w.desc}</p>
      <DagThumb w={w} />
      <div className="fp-wfc-meta">
        <RoleBadge role={w.ownerRole} />
        <span className="fp-wfc-trig">{ICON(trig.icon, 12)} {w.trigger.label}</span>
      </div>
      <div className="fp-wfc-foot">
        <span className="fp-wfc-stat"><b>{steps}</b> actions</span>
        <span className="dot">·</span>
        <span className="fp-wfc-stat"><b>{w.successRate}%</b> success</span>
        <span className="fp-wfc-runs mono">{w.runsWeek}/wk</span>
      </div>
    </Link>
  );
}

export default function WorkflowsPage() {
  const [query, setQuery] = React.useState('');

  const filtered = React.useMemo(() => {
    if (!query) return WORKFLOWS;
    const q = query.toLowerCase();
    return WORKFLOWS.filter(
      (w) => w.name.toLowerCase().includes(q) || w.desc.toLowerCase().includes(q) || w.ownerRole.includes(q),
    );
  }, [query]);

  return (
    <>
      <FPageHeader
        eyebrow="Delivery"
        title="Workflows"
        subtitle="Composite orchestrations that sequence Actions toward an outcome. Each one carries its trigger, its guardrails, and the agent role that owns it. Open one to see the live Action graph."
        actions={
          <>
            <Button variant="ghost"><Icons.book size={13} /> Author guide</Button>
            <Button variant="ember"><Icons.plus size={13} /> New workflow</Button>
          </>
        }
      />

      <div className="fp-grid fp-grid-4">
        {KPIS.map((k) => (
          <div key={k.id} className="fp-kpi">
            <span className="label">{k.label}</span>
            <div className="value">{k.value}</div>
            <p className="fp-kpi-note">{k.note}</p>
          </div>
        ))}
      </div>

      <div className="fp-toolbar" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div style={{ flex: 1, minInlineSize: 240, maxInlineSize: 460, display: 'flex' }}>
          <FSearch value={query} onChange={setQuery} placeholder="Search workflows…" aria-label="Search workflows" className="fluid" />
        </div>
        <span className="fp-agents-count">{filtered.length} {filtered.length === 1 ? 'workflow' : 'workflows'}</span>
      </div>

      <div className="fp-grid fp-grid-auto" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        {filtered.map((w) => <WfCard key={w.id} w={w} />)}
      </div>

      {filtered.length === 0 && (
        <div className="fp-empty" style={{ marginBlockStart: 16 }}>
          <Icons.search size={18} />
          <span>No workflows match this filter.</span>
        </div>
      )}
    </>
  );
}
