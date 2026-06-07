'use client';
// Forge — Pipelines console. Every CI/CD run across the bureau estate, with
// the golden pipeline (Build, Test, SAST, Risk gate, Canary, Promote) shown
// inline, each row a door into the run detail.
//
// Brief — Persona: SRE / on-call + the engineer who just pushed. Question:
// what is shipping right now, what failed, and where is it stuck? Data: runs +
// derived stages (src/portal/data/pipelines.ts). Primary action: open a run
// (especially the failing one). Distinctive move: the inline six-step pipeline
// trail per row, so the whole estate's delivery state reads at a glance.
//
// Composes only Eidos DS + .fp-* classes. No tier; bureau services.
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Icons, Pill, Select, StatusDot } from '@/ds/core';
import { FPageHeader, FSearch, FSection } from '@/portal/shell/portal-shell';
import { KPIS, RUNS, STATUS_META, stagesFor, type PipeRun, type RunStatus } from '@/portal/data/pipelines';

const STATUS_FILTERS = [
  { value: 'all', label: 'All runs' },
  { value: 'running', label: 'Running' },
  { value: 'error', label: 'Failed' },
  { value: 'success', label: 'Success' },
  { value: 'pending', label: 'Queued' },
];

const RISK_TONE = (v: string): 'risk-low' | 'risk-med' | 'risk-high' =>
  v === 'low' ? 'risk-low' : v === 'med' ? 'risk-med' : 'risk-high';

function StepTrail({ run }: { run: PipeRun }) {
  const stages = stagesFor(run);
  return (
    <span className="fp-steps" aria-label={`Pipeline ${run.stage}`}>
      {stages.map((s) => (
        <span key={s.id} className={`fp-step is-${s.status}`} title={`${s.label} · ${s.meta}`} />
      ))}
    </span>
  );
}

export default function PipelinesPage() {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [status, setStatus] = React.useState('all');

  const filtered = React.useMemo(() => {
    let list = RUNS;
    if (status !== 'all') list = list.filter((r) => r.status === (status as RunStatus));
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((r) => r.service.toLowerCase().includes(q) || r.sha.includes(q) || r.author.toLowerCase().includes(q));
    }
    return list;
  }, [query, status]);

  const open = (id: string) => router.push(`/portal/pipelines/${id}`);

  return (
    <>
      <FPageHeader
        eyebrow="Delivery"
        title="Pipelines"
        subtitle="Watch every deploy move through the golden pipeline, and jump into anything that stalls or fails."
        actions={
          <>
            <Button variant="ghost">
              <Icons.download size={13} /> Export
            </Button>
            <Button variant="ember">
              <Icons.play size={13} /> Run pipeline
            </Button>
          </>
        }
      />

      {/* Console KPIs */}
      <div className="fp-grid fp-grid-4">
        {KPIS.map((k) => (
          <div key={k.id} className="fp-kpi">
            <span className="label">{k.label}</span>
            <div className="value">{k.value}</div>
            <p className="fp-kpi-note">{k.note}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="fp-toolbar" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div style={{ flex: 1, minWidth: 240, maxWidth: 460, display: 'flex' }}>
          <FSearch
            value={query}
            onChange={setQuery}
            placeholder="Filter by service, commit, author…"
            aria-label="Filter runs"
            className="fluid"
          />
        </div>
        <span className="fp-filter-select">
          <Select value={status} onValueChange={setStatus} options={STATUS_FILTERS} width="150px" />
        </span>
      </div>

      <FSection title="Runs" style={{ marginBlockStart: 'var(--fp-filter-gap, 14px)' }}>
        <div className="fp-card" style={{ padding: 0 }}>
          <div className="tbl-wrap">
            <table className="tbl" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Service</th>
                  <th>Pipeline</th>
                  <th>Risk</th>
                  <th>Author</th>
                  <th style={{ textAlign: 'end' }}>Started</th>
                  <th style={{ textAlign: 'end' }}>Duration</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const s = STATUS_META[r.status];
                  return (
                    <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => open(r.id)}>
                      <td>
                        <Pill tone={s.tone} dot live={r.status === 'running'}>{s.label}</Pill>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{r.service}</span>
                        <span className="fp-cell-sub mono">{r.version} · {r.sha}</span>
                      </td>
                      <td>
                        <StepTrail run={r} />
                        <span className="fp-cell-sub">{r.stage}</span>
                      </td>
                      <td>
                        {r.status === 'pending' ? (
                          <span className="mono" style={{ color: 'var(--fg-faint)' }}>n/a</span>
                        ) : (
                          <Pill tone={RISK_TONE(r.risk.verdict)}>
                            {r.risk.score} · {r.risk.verdict}
                          </Pill>
                        )}
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>{r.author}</td>
                      <td className="mono" style={{ textAlign: 'end', color: 'var(--fg-muted)', whiteSpace: 'nowrap' }}>{r.started}</td>
                      <td className="mono" style={{ textAlign: 'end', color: 'var(--fg-muted)' }}>{r.duration}</td>
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
          <StatusDot tone="pending" />
          <span>No runs match this filter.</span>
        </div>
      )}
    </>
  );
}
