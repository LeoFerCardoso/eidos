'use client';
// Forge · Actions registry. The ATOMIC executable units of the platform: the
// codified, parameterized operations that humans (self-service) AND agents/
// workflows call. The spine between Skills (capability) and MCP (transport).
//
// Brief · Persona: any engineer + platform owner. Question: what can be run on
// this platform, who/what can run it, and what guardrail fires first? Data:
// ACTIONS (src/portal/data/actions.ts). Primary action: open an action to see
// its schema + guardrail, or run it. Distinctive move: every action shows its
// guardrail gate, its runner (human / agent / both) and its triggers up front.
// An action is NOT a cron job and NOT a workflow (see the domain model).
//
// Composes only Eidos DS + .fp-* classes.
import * as React from 'react';
import Link from 'next/link';
import { Button, Icons, Pill, Select } from '@/ds/core';
import { FPageHeader, FSearch } from '@/portal/shell/portal-shell';
import { AiBanner } from '@/portal/shell/ai-pattern';
import {
  ACTIONS,
  ACTION_CATEGORIES,
  GATE_META,
  RUNNER_META,
  TRIGGER_META,
  KPIS,
  AI_READ,
  type Action,
  type RunnableBy,
} from '@/portal/data/actions';

const Ico = (key: string, size = 14) => {
  const C = (Icons as Record<string, React.FC<{ size?: number }>>)[key] ?? Icons.zap;
  return <C size={size} />;
};

const RUNNERS: { value: RunnableBy | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'human', label: 'Human-run' },
  { value: 'agent', label: 'Agent-run' },
  { value: 'both', label: 'Human + agent' },
];

function ActionCard({ a }: { a: Action }) {
  const gate = GATE_META[a.gate];
  const runner = RUNNER_META[a.runnableBy];
  return (
    <Link href={`/portal/actions/${a.id}`} className="fp-action">
      <div className="fp-action-top">
        <span className="fp-action-ic" aria-hidden="true">{Ico(a.icon, 18)}</span>
        <Pill tone={gate.tone} dot>{gate.label}</Pill>
      </div>
      <span className="fp-action-name">
        {a.name}
        {a.deprecated && <Pill tone="neutral" className="fp-action-dep">deprecated</Pill>}
      </span>
      <p className="fp-action-desc">{a.desc}</p>

      <div className="fp-action-tags">
        <span className="fp-action-runner">{Ico(runner.icon, 12)} {runner.label}</span>
        <span className="fp-action-triggers" aria-label="Triggers">
          {a.triggers.map((t) => (
            <span key={t} className="fp-action-trig" title={`Trigger: ${TRIGGER_META[t].label}`}>
              {Ico(TRIGGER_META[t].icon, 11)}
            </span>
          ))}
        </span>
      </div>

      <div className="fp-action-foot">
        <span className="fp-action-links">
          {a.skill && <span className="fp-action-link" title="Wired skill"><Icons.zap size={11} /> {a.skill}</span>}
          {a.mcp && <span className="fp-action-link" title="MCP transport"><Icons.plug size={11} /> {a.mcp}-mcp</span>}
          {!a.governed && <span className="fp-action-warn" title="No guardrail policy attached"><Icons.alert size={11} /> Ungoverned</span>}
        </span>
        <span className="fp-action-runs mono">{a.runsWeek}/wk</span>
      </div>
    </Link>
  );
}

export default function ActionsPage() {
  const [query, setQuery] = React.useState('');
  const [runner, setRunner] = React.useState<RunnableBy | 'all'>('all');
  const [cat, setCat] = React.useState('all');

  const filtered = React.useMemo(() => {
    let list = ACTIONS;
    if (runner !== 'all') list = list.filter((a) => a.runnableBy === runner);
    if (cat !== 'all') list = list.filter((a) => a.category === cat);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.desc.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          (a.skill ?? '').includes(q) ||
          (a.mcp ?? '').includes(q),
      );
    }
    return list;
  }, [query, runner, cat]);

  const catOptions = [{ value: 'all', label: 'All categories' }, ...ACTION_CATEGORIES.map((c) => ({ value: c, label: c }))];

  return (
    <>
      <FPageHeader
        eyebrow="Platform"
        title="Actions"
        subtitle="The atomic, codified operations on the platform. Every one carries an input schema and a guardrail, and can be run by a human, an agent, or sequenced inside a workflow."
        actions={
          <>
            <Button variant="ghost"><Icons.book size={13} /> Author guide</Button>
            <Button variant="ember"><Icons.plus size={13} /> New action</Button>
          </>
        }
      />

      <AiBanner title={AI_READ.title} action="Review ungoverned">
        One action, <span className="fp-aip-hl mono">post-status-update</span>, runs{' '}
        <span className="fp-aip-hl">26×/week</span> with <span className="fp-aip-hl">no guardrail</span> attached.
        Meanwhile <span className="fp-aip-hl mono">purge-pii</span> is correctly blocked by default: irreversible,
        two approvers plus a DPO ticket. Attach a policy to the ungoverned one before an agent reaches for it.
      </AiBanner>

      <div className="fp-grid fp-grid-4">
        {KPIS.map((k) => (
          <div key={k.id} className="fp-kpi">
            <span className="label">{k.label}</span>
            <div className="value">{k.value}</div>
            <p className="fp-kpi-note">{k.note}</p>
          </div>
        ))}
      </div>

      {/* Runner facet */}
      <div
        role="radiogroup"
        aria-label="Runner"
        style={{ display: 'flex', gap: 6, marginBlockStart: 'var(--fp-section-gap, 18px)', flexWrap: 'wrap' }}
      >
        {RUNNERS.map((r) => (
          <Pill
            key={r.value}
            tone={runner === r.value ? 'ember' : 'neutral'}
            dot={runner === r.value}
            role="radio"
            aria-checked={runner === r.value}
            tabIndex={0}
            style={{ cursor: 'pointer', border: '1px solid var(--border)', fontWeight: runner === r.value ? 600 : 500 }}
            onClick={() => setRunner(r.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setRunner(r.value); } }}
          >
            {r.label}
          </Pill>
        ))}
      </div>

      {/* Toolbar */}
      <div className="fp-toolbar" style={{ marginBlockStart: 'var(--fp-filter-gap, 14px)' }}>
        <div style={{ flex: 1, minInlineSize: 240, maxInlineSize: 460, display: 'flex' }}>
          <FSearch value={query} onChange={setQuery} placeholder="Search actions, skills, MCP…" aria-label="Search actions" className="fluid" />
        </div>
        <span className="fp-filter-select">
          <Select value={cat} onValueChange={setCat} options={catOptions} width="170px" />
        </span>
        <span className="fp-agents-count">{filtered.length} {filtered.length === 1 ? 'action' : 'actions'}</span>
      </div>

      <div className="fp-grid fp-grid-auto" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        {filtered.map((a) => <ActionCard key={a.id} a={a} />)}
      </div>

      {filtered.length === 0 && (
        <div className="fp-empty" style={{ marginBlockStart: 16 }}>
          <Icons.search size={18} />
          <span>No actions match this filter.</span>
        </div>
      )}
    </>
  );
}
