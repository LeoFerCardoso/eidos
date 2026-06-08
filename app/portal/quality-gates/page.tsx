'use client';
// Forge — Quality Gates board. Every PR scored 0 to 1000 by the PR-analysis
// agent (Change Risk Score), with the human-approval gate driven by that score.
//
// Brief — Persona: any engineer shipping a change + the reviewer + EM. Question:
// what is in the merge queue, how risky is each change, and what gate does it
// face? Data: PRS (src/portal/data/quality-gates.ts). Primary action: open a PR
// to approve or split it. Distinctive move: the Change Risk Score and its gate
// ladder (auto-merge -> 1 -> 2 -> blocked) made the spine of the page.
//
// Composes only Eidos DS + .fp-* classes.
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Icons, Pill, ScoreGauge, Select, Stat, StatusDot } from '@/ds/core';
import { FPageHeader, FSearch, FSection } from '@/portal/shell/portal-shell';
import { FLEET, GATES, PRS, PR_STATUS_META, gateFor, type PrStatus } from '@/portal/data/quality-gates';

const FILTERS = [
  { value: 'all', label: 'All PRs' },
  { value: 'awaiting', label: 'Awaiting approval' },
  { value: 'in-review', label: 'In review' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'merged', label: 'Merged' },
];

export default function QualityGatesPage() {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [status, setStatus] = React.useState('all');
  // The speedo gauge draws SVG arcs with Math.cos/sin (last-ULP differences
  // between Node and the browser trip hydration), so render it post-mount only.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const filtered = React.useMemo(() => {
    let list = PRS;
    if (status !== 'all') list = list.filter((p) => p.status === (status as PrStatus));
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((p) => String(p.id).includes(q) || p.title.toLowerCase().includes(q) || p.service.toLowerCase().includes(q) || p.author.name.toLowerCase().includes(q));
    }
    return list;
  }, [query, status]);

  const open = (id: number) => router.push(`/portal/quality-gates/${id}`);

  return (
    <>
      <FPageHeader
        eyebrow="Change management"
        title="Quality Gates"
        subtitle="Let low-risk changes merge themselves, and route the risky ones to the right approvers."
        actions={
          <Button variant="ghost"><Icons.download size={13} /> Export</Button>
        }
      />

      {/* Fleet overview — the change-risk gauge + headline checks (chart cards). */}
      <div className="fp-qg-overview">
        <div className="fp-card fp-qg-gauge">
          <div className="fp-card-head">
            <div className="fp-card-title">Change Risk Score · fleet</div>
            <Pill tone="neutral">last 24h</Pill>
          </div>
          <div className="fp-qg-gauge-body">
            {mounted ? (
              <ScoreGauge variant="speedo" value={FLEET.crs} min={0} max={1000} ticks labels size={260} label="Aggregate risk · open PRs" />
            ) : (
              <div style={{ inlineSize: 260, blockSize: 184 }} aria-hidden="true" />
            )}
          </div>
          <p className="fp-qg-gauge-note">
            Under <strong style={{ color: 'var(--success)' }}>300</strong> is the healthy band. Forge auto-merges PRs under 300 once every P0 gate passes.
          </p>
        </div>
        <div className="fp-grid fp-grid-3 fp-qg-stats">
          {FLEET.stats.map((s) => (
            <div key={s.id} className="fp-card">
              <Stat label={s.label} value={s.value} suffix={s.suffix} hint={s.hint} delta={s.delta} inverted={s.inverted} variant="hero" />
            </div>
          ))}
        </div>
      </div>

      {/* Gate ladder — the CRS rule, made the spine of the page. */}
      <FSection title="The gate ladder" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div className="fp-gates">
          {GATES.map((g) => (
            <div key={g.key} className={`fp-gate is-${g.key}`}>
              <div className="fp-gate-top">
                <span className="fp-gate-range mono">{g.range}</span>
                <Pill tone={g.tone}>{g.label}</Pill>
              </div>
              <p className="fp-gate-blurb">{g.blurb}</p>
            </div>
          ))}
        </div>
      </FSection>

      {/* Toolbar */}
      <div className="fp-toolbar" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div style={{ flex: 1, minWidth: 240, maxWidth: 460, display: 'flex' }}>
          <FSearch value={query} onChange={setQuery} placeholder="Search by PR number, title, service, author…" aria-label="Search pull requests" className="fluid" />
        </div>
        <span className="fp-filter-select">
          <Select value={status} onValueChange={setStatus} options={FILTERS} width="180px" />
        </span>
      </div>

      <FSection title="Pull requests" style={{ marginBlockStart: 'var(--fp-filter-gap, 14px)' }}>
        <div className="fp-card" style={{ padding: 0 }}>
          <div className="tbl-wrap">
            <table className="tbl" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>Pull request</th>
                  <th>Author</th>
                  <th style={{ textAlign: 'end' }}>Change Risk Score</th>
                  <th style={{ textAlign: 'end' }}>Gate</th>
                  <th style={{ textAlign: 'end' }}>Approvals</th>
                  <th style={{ textAlign: 'end' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const gate = gateFor(p.crs);
                  const st = PR_STATUS_META[p.status];
                  const approved = p.approvers.filter((a) => a.status === 'approved').length;
                  return (
                    <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => open(p.id)}>
                      <td>
                        <span style={{ fontWeight: 600 }}>
                          <span className="mono" style={{ color: 'var(--fg-muted)', marginInlineEnd: 8 }}>#{p.id}</span>
                          {p.title}
                        </span>
                        <span className="fp-cell-sub mono" style={{ color: 'var(--ember)' }}>{p.service}</span>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>{p.author.name}</td>
                      <td style={{ textAlign: 'end' }}>
                        <span className="fp-crs">
                          <span className="fp-crs-bar" aria-hidden="true">
                            <span className={`fp-crs-fill tone-${gate.tone}`} style={{ inlineSize: `${(p.crs / 1000) * 100}%` }} />
                          </span>
                          <Pill tone={gate.tone}>{p.crs}</Pill>
                        </span>
                      </td>
                      <td style={{ textAlign: 'end' }}>
                        <span style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-sm)', whiteSpace: 'nowrap' }}>{gate.label}</span>
                      </td>
                      <td className="mono" style={{ textAlign: 'end', color: 'var(--fg-muted)' }}>
                        {gate.approvals === 0 ? 'auto' : `${approved}/${gate.approvals}`}
                      </td>
                      <td style={{ textAlign: 'end' }}>
                        <Pill tone={st.tone} dot live={p.status === 'in-review'}>{st.label}</Pill>
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
          <StatusDot tone="pending" />
          <span>No pull requests match this filter.</span>
        </div>
      )}
    </>
  );
}
