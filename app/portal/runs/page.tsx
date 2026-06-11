'use client';
// Forge · Runs. The instance level: every Workflow EXECUTION, globally. Each row
// drills into a step timeline with guardrail verdicts inline and per-step
// rollback. Runs are derived from the workflow definitions, so this is the live
// history of the orchestration layer. See docs/AGENTIC-PLATFORM-VISION.md §7.4.
//
// Brief · Persona: platform owner / on-call. Question: what is the fleet doing
// right now, what needs me, and what rolled back? Data: RUNS (src/portal/data/
// runs.ts). Primary action: open a run / approve an escalated one. Distinctive
// move: a global, auditable, reversible view of every agent execution.
//
// Composes only Eidos DS + .fp-* classes.
import * as React from 'react';
import Link from 'next/link';
import { Button, Icons, Pill, Select, Avatar } from '@/ds/core';
import { FPageHeader, FSearch } from '@/portal/shell/portal-shell';
import { RUNS, KPIS, type Run, type RunStatus } from '@/portal/data/runs';
import { RUN_STATUS_META, WORKFLOWS } from '@/portal/data/workflows';

const STATUSES: { value: RunStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'running', label: 'Running' },
  { value: 'verified', label: 'Verified' },
  { value: 'escalated', label: 'Escalated' },
  { value: 'rolled-back', label: 'Rolled back' },
];

function RunRow({ r }: { r: Run }) {
  const st = RUN_STATUS_META[r.status];
  return (
    <Link href={`/portal/runs/${r.id}`} className="fp-run-row">
      <span className="rn-id mono">{r.id}</span>
      <span className="rn-agent">
        <Avatar name={r.agent} size={24} />
        <span className="a">{r.agent}</span>
      </span>
      <span className="rn-wf">{r.workflowName}</span>
      <span className="rn-svc">{r.service}</span>
      <span className="rn-trig mono">{r.trigger}</span>
      <span className="rn-status"><Pill tone={st.tone} dot={r.status === 'running'}>{st.label}</Pill></span>
      <span className="rn-when mono" title={`${r.when} · ${r.duration}`}>{r.when} · {r.duration}</span>
      <Icons.chevronRight size={13} className="rn-go" />
    </Link>
  );
}

export default function RunsPage() {
  const [status, setStatus] = React.useState<RunStatus | 'all'>('all');
  const [wf, setWf] = React.useState('all');
  const [query, setQuery] = React.useState('');

  const filtered = React.useMemo(() => {
    let list = RUNS;
    if (status !== 'all') list = list.filter((r) => r.status === status);
    if (wf !== 'all') list = list.filter((r) => r.workflowId === wf);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((r) => r.id.includes(q) || r.agent.toLowerCase().includes(q) || r.service.toLowerCase().includes(q) || r.workflowName.toLowerCase().includes(q));
    }
    return list;
  }, [status, wf, query]);

  const wfOptions = [{ value: 'all', label: 'All workflows' }, ...WORKFLOWS.map((w) => ({ value: w.id, label: w.name }))];

  return (
    <>
      <FPageHeader
        eyebrow="Delivery"
        title="Runs"
        subtitle="Every workflow execution, live. Each run is an auditable, reversible step timeline: the actions taken, the guardrail verdicts, and a rollback at every step. This is the history of the agentic fleet."
        actions={
          <>
            <Button variant="ghost"><Icons.download size={13} /> Export</Button>
            <Button variant="ember" asChild><Link href="/portal/workflows"><Icons.share size={13} /> Workflows</Link></Button>
          </>
        }
      />

      <div className="fp-grid fp-grid-4">
        {KPIS.map((k) => (
          <div key={k.id} className="fp-kpi">
            <span className="label">{k.label}</span>
            <div className="value" style={k.id === 'awaiting' ? { color: 'var(--warning)' } : undefined}>{k.value}</div>
            <p className="fp-kpi-note">{k.note}</p>
          </div>
        ))}
      </div>

      <div className="fp-toolbar" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div role="radiogroup" aria-label="Status" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {STATUSES.map((s) => (
            <Pill
              key={s.value}
              tone={status === s.value ? 'ember' : 'neutral'}
              dot={status === s.value}
              role="radio"
              aria-checked={status === s.value}
              tabIndex={0}
              style={{ cursor: 'pointer', border: '1px solid var(--border)', fontWeight: status === s.value ? 600 : 500 }}
              onClick={() => setStatus(s.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setStatus(s.value); } }}
            >
              {s.label}
            </Pill>
          ))}
        </div>
        <span className="fp-filter-select">
          <Select value={wf} onValueChange={setWf} options={wfOptions} width="190px" />
        </span>
        <div style={{ flex: 1, minInlineSize: 180, maxInlineSize: 300, display: 'flex' }}>
          <FSearch value={query} onChange={setQuery} placeholder="Search runs…" aria-label="Search runs" className="fluid" />
        </div>
        <span className="fp-agents-count">{filtered.length} runs</span>
      </div>

      <div className="fp-run-list">
        {/* Column header — same grid as the rows so the columns read as a table */}
        <div className="fp-run-head" role="presentation">
          <span>Run</span>
          <span>Agent</span>
          <span>Workflow</span>
          <span>Service</span>
          <span>Trigger</span>
          <span>Status</span>
          <span className="rn-when-hd">When</span>
          <span />
        </div>
        {filtered.map((r) => <RunRow key={r.id} r={r} />)}
        {filtered.length === 0 && (
          <div className="fp-empty" style={{ marginBlockStart: 16 }}>
            <Icons.search size={18} /><span>No runs match this filter.</span>
          </div>
        )}
      </div>
    </>
  );
}
