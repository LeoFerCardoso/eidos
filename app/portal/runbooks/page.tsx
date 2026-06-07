'use client';
// Forge — Runbook catalog, built for SRE / on-call. Every operational runbook,
// led by automation level, success rate, run frequency and the incidents each
// one resolves.
//
// Brief — Persona: SRE / on-call. Question: what can I run when something
// breaks, how reliable is it, is it automated, and when did it last run? Data:
// RUNBOOKS (src/portal/data/runbooks.ts). Primary action: run a runbook /
// automate a manual one. Distinctive move: automation coverage + a needs-
// attention list (low success / stale), with a Forge AI read on the best
// automation candidate.
//
// Composes only Eidos DS + .fp-* classes.
import * as React from 'react';
import Link from 'next/link';
import { Button, Icons, Pill, Select } from '@/ds/core';
import { FPageHeader, FSearch, FSection } from '@/portal/shell/portal-shell';
import { AiBanner } from '@/portal/shell/ai-pattern';
import {
  AI_READ,
  AUTOMATION_META,
  AUTOMATION_MIX,
  CATEGORIES,
  KPIS,
  NEEDS_ATTENTION,
  RUNBOOKS,
  TRIGGER_META,
  successColor,
  type Automation,
  type RbCategory,
} from '@/portal/data/runbooks';

const CAT_OPTS = [{ value: 'all', label: 'All categories' }, ...CATEGORIES.map((c) => ({ value: c, label: c }))];
const AUTO_OPTS = [
  { value: 'all', label: 'All automation' },
  { value: 'automated', label: 'Automated' },
  { value: 'semi', label: 'Semi-auto' },
  { value: 'manual', label: 'Manual' },
];

export default function RunbooksPage() {
  const [query, setQuery] = React.useState('');
  const [cat, setCat] = React.useState('all');
  const [auto, setAuto] = React.useState('all');

  const filtered = React.useMemo(() => {
    let list = RUNBOOKS;
    if (cat !== 'all') list = list.filter((r) => r.category === (cat as RbCategory));
    if (auto !== 'all') list = list.filter((r) => r.automation === (auto as Automation));
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((r) => r.title.toLowerCase().includes(q) || r.service.toLowerCase().includes(q) || r.owner.toLowerCase().includes(q));
    }
    return list;
  }, [query, cat, auto]);

  return (
    <>
      <FPageHeader
        eyebrow="Delivery"
        title="Runbooks"
        subtitle={`${RUNBOOKS.length} runbooks · ${Math.round((RUNBOOKS.filter((r) => r.automation === 'automated').length / RUNBOOKS.length) * 100)}% automated`}
        actions={
          <>
            <Button variant="ghost"><Icons.download size={13} /> Export</Button>
            <Button variant="ember"><Icons.plus size={13} /> New runbook</Button>
          </>
        }
      />

      <AiBanner title={AI_READ.title} action="Draft automation">
        <span className="fp-aip-hl">Reprocess stuck recovery cases</span> sits at <span className="fp-aip-hl">79%</span> success, fully manual, last run 5 weeks ago on <span className="fp-aip-hl mono">recovery-comms</span>. Scripting the drain-and-reprocess step is the best automation candidate.
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

      <div className="fp-grid fp-grid-2" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div className="fp-card">
          <div className="fp-card-head"><div className="fp-card-title">Automation coverage</div></div>
          <ul className="fp-engine-list">
            {AUTOMATION_MIX.map((a) => (
              <li key={a.automation} className="fp-engine">
                <span className="fp-engine-name"><span className="fp-mix-dot" style={{ background: a.color }} /> {a.label}</span>
                <span className="fp-engine-bar"><span className="fp-engine-fill" style={{ inlineSize: `${a.pct}%`, background: a.color }} /></span>
                <span className="fp-engine-val mono">{a.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="fp-card">
          <div className="fp-card-head">
            <div className="fp-card-title">Needs attention</div>
            <Pill tone="warning">{NEEDS_ATTENTION.length}</Pill>
          </div>
          <ul className="fp-signals">
            {NEEDS_ATTENTION.map((r) => (
              <li key={r.id} className="fp-signal">
                <div className="fp-signal-id">
                  <span className="fp-signal-label">{r.title}</span>
                  <span className="fp-signal-detail">{r.service} · {AUTOMATION_META[r.automation].label} · last {r.lastRun}</span>
                </div>
                <span className="mono" style={{ color: successColor(r.success), fontSize: 'var(--text-sm)' }}>{r.success}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="fp-toolbar" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div style={{ flex: 1, minWidth: 240, maxWidth: 420, display: 'flex' }}>
          <FSearch value={query} onChange={setQuery} placeholder="Search runbooks, services, owners…" aria-label="Search runbooks" className="fluid" />
        </div>
        <span className="fp-filter-select">
          <Select value={cat} onValueChange={setCat} options={CAT_OPTS} width="160px" />
        </span>
        <span className="fp-filter-select">
          <Select value={auto} onValueChange={setAuto} options={AUTO_OPTS} width="150px" />
        </span>
      </div>

      <FSection title="Runbooks" style={{ marginBlockStart: 'var(--fp-filter-gap, 14px)' }}>
        <div className="fp-card" style={{ padding: 0 }}>
          <div className="tbl-wrap">
            <table className="tbl" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>Runbook</th>
                  <th>Service</th>
                  <th>Automation</th>
                  <th>Trigger</th>
                  <th style={{ textAlign: 'end' }}>Success</th>
                  <th style={{ textAlign: 'end' }}>Runs</th>
                  <th style={{ textAlign: 'end' }}>Last run</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const am = AUTOMATION_META[r.automation];
                  const tm = TRIGGER_META[r.trigger];
                  return (
                    <tr key={r.id}>
                      <td>
                        <span style={{ fontWeight: 600 }}>{r.title}</span>
                        <span className="fp-cell-sub">{r.category} · resolves {r.incidents} incidents · {r.avg} avg</span>
                      </td>
                      <td><Link href={`/portal/catalog/${r.service}`} className="u-link mono">{r.service}</Link></td>
                      <td><Pill tone={am.tone}>{am.label}</Pill></td>
                      <td><Pill tone={tm.tone}>{tm.label}</Pill></td>
                      <td className="mono" style={{ textAlign: 'end', color: successColor(r.success) }}>{r.success}%</td>
                      <td className="mono" style={{ textAlign: 'end' }}>{r.runs}</td>
                      <td className="mono" style={{ textAlign: 'end', color: 'var(--fg-muted)', whiteSpace: 'nowrap' }}>{r.lastRun}</td>
                      <td style={{ textAlign: 'end' }}>
                        <Button variant="outline" size="sm"><Icons.play size={11} /> Run</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </FSection>

      {filtered.length === 0 && (
        <div className="fp-empty" style={{ marginBlockStart: 16 }}>
          <Icons.search size={18} />
          <span>No runbooks match this filter.</span>
        </div>
      )}
    </>
  );
}
