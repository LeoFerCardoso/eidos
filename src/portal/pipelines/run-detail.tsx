'use client';
// Forge — Pipeline run detail (/portal/pipelines/[run]). The operator view of a
// single run: stage trail, live log, run summary and artifacts. For a failed
// run, Forge AI's diagnosis is woven in at the top (not a chat box). For a
// running one, the auto-promote banner explains what happens next.
//
// Brief — Persona: SRE / on-call + the engineer who pushed. Question: where is
// this run, why did it fail, and what do I do now? Data: getRun + stagesFor +
// logFor (src/portal/data/pipelines.ts). Primary action: re-run / promote /
// rollback. Distinctive move: the failed-run AI diagnosis that says exactly
// which commit broke it and the fix, before you open the log.
import * as React from 'react';
import Link from 'next/link';
import {
  Banner,
  Button,
  CopyChip,
  HealthBadge,
  Icons,
  LogViewer,
  Pill,
  Pipeline,
  RingBar,
  Sparkline,
  StatusDot,
} from '@/ds/core';
import { FPageHeader, FSection, usePageCrumb } from '@/portal/shell/portal-shell';
import { AiBanner } from '@/portal/shell/ai-pattern';
import {
  ARTIFACTS,
  RING_HEALTH,
  RING_LIVE,
  STATUS_META,
  aiReadFor,
  getRun,
  logFor,
  ringCursor,
  ringsFor,
  stagesFor,
} from '@/portal/data/pipelines';

export default function PipelineRunDetail({ runId }: { runId: string }) {
  const run = getRun(runId);
  const { setCrumb } = usePageCrumb();
  const shortId = runId.replace(/^run_/, '');

  React.useEffect(() => {
    if (run) setCrumb({ label: `${run.service} #${shortId}`, replace: true });
    return () => setCrumb(null);
  }, [run, shortId, setCrumb]);

  if (!run) {
    return (
      <div className="fp-empty" style={{ marginBlockStart: 24 }}>
        <StatusDot tone="error" />
        <span>
          Run <span className="mono">{runId}</span> not found.{' '}
          <Link href="/portal/pipelines" className="u-link">Back to Pipelines</Link>
        </span>
      </div>
    );
  }

  const s = STATUS_META[run.status];
  const stages = stagesFor(run);
  const log = logFor(run);
  const ai = aiReadFor(run);
  const rings = ringsFor(run);
  const ringIdx = ringCursor(run);
  const rolloutLive = run.status === 'running' && run.currentRing >= 1;
  const riskColor =
    run.risk.verdict === 'low' ? 'var(--success)' : run.risk.verdict === 'med' ? 'var(--warning)' : 'var(--danger)';

  const actions =
    run.status === 'running' ? (
      <>
        <Button variant="ghost"><Icons.x size={13} /> Cancel</Button>
        <Button variant="outline"><Icons.refresh size={13} /> Retry from here</Button>
        <Button variant="ember"><Icons.deploy size={13} /> Promote</Button>
      </>
    ) : run.status === 'error' ? (
      <>
        <Button variant="ghost"><Icons.doc size={13} /> Test report</Button>
        <Button variant="ember"><Icons.refresh size={13} /> Re-run</Button>
      </>
    ) : run.status === 'pending' ? (
      <Button variant="ghost"><Icons.x size={13} /> Cancel</Button>
    ) : (
      <>
        <Button variant="outline"><Icons.undo size={13} /> Rollback</Button>
        <Button variant="ember"><Icons.refresh size={13} /> Re-run</Button>
      </>
    );

  const summary: [string, React.ReactNode][] = [
    ['Trigger', run.trigger],
    ['Branch', <span className="mono" style={{ color: 'var(--ember)' }} key="b">{run.branch}</span>],
    ['Commit', <span className="mono" key="c">{run.sha}</span>],
    ['Change Risk Score', <span className="mono" style={{ color: riskColor }} key="r">{run.risk.score} · {run.risk.verdict}</span>],
    ['Coverage Δ', <span className="mono" style={{ color: run.coverageDelta.startsWith('-') ? 'var(--danger)' : 'var(--success)' }} key="cov">{run.coverageDelta}</span>],
    ['Blast radius', run.blast],
    ['Region', run.region],
  ];

  return (
    <>
      <FPageHeader
        eyebrow={`Pipeline · ${run.service}`}
        title={`Run #${shortId}`}
        status={<Pill tone={s.tone} dot live={run.status === 'running'}>{s.label}</Pill>}
        subtitle={`Shipping ${run.service} ${run.version} through the golden pipeline. ${run.stage}.`}
        meta={
          <div className="fp-meta">
            <CopyChip value={`git@eidos:${run.service}@${run.sha}`} label={run.sha} />
            <span className="fp-meta-chip"><Icons.user size={12} /> {run.author}</span>
            <span className="fp-meta-chip"><Icons.clock size={12} /> {run.started}</span>
            <span className="fp-meta-chip"><Icons.deploy size={12} /> to production</span>
          </div>
        }
        actions={actions}
      />

      {ai ? (
        <AiBanner title={ai.title} action="Open the fix">{ai.body}</AiBanner>
      ) : run.status === 'running' ? (
        <Banner
          tone="info"
          icon="sparkle"
          title={run.currentRing >= 5 ? 'GA rollout in progress' : run.currentRing >= 1 ? 'Auto-promote armed' : 'Tests running'}
          message={
            run.currentRing >= 5
              ? `Ring 5 GA is ramping at ${run.gaPercent}% traffic. If the error budget holds through the observation window, Forge promotes to 100% with no human gate.`
              : run.currentRing >= 1
                ? `Live through Ring ${run.currentRing} of 5. Auto-promote advances to the next ring once each ring's error budget holds.`
                : 'Change Risk Score is under the 300 auto-merge line. Once the canary clears, Forge begins the ring rollout automatically.'
          }
        />
      ) : null}

      <FSection title="Deployment stages" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div className="fp-card" style={{ paddingBlock: 18, paddingInline: 16 }}>
          <Pipeline variant="chevron" steps={stages} />
        </div>
      </FSection>

      {/* Ring deployment — feature activation through the five rings. */}
      <FSection title="Ring deployment" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div className="fp-card" style={{ padding: 18 }}>
          <RingBar
            rings={rings.map((r) => ({ label: r.label, audience: r.audience, percent: r.percent, status: r.status }))}
            currentRing={ringIdx}
          />
          {run.currentRing === 0 && (
            <p className="fp-kpi-note" style={{ marginBlockStart: 12 }}>
              Rollout starts after the canary clears. The first two rings are internal (Team, Internal); the last three reach end users (Alpha, Beta, GA).
            </p>
          )}
          <div style={{ marginBlockStart: 16, borderBlockStart: '1px solid var(--border)', paddingBlockStart: 14 }}>
            <div className="tbl-wrap">
              <table className="tbl" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th>Ring</th>
                    <th>Audience</th>
                    <th>Scope</th>
                    <th style={{ textAlign: 'end' }}>Traffic</th>
                    <th style={{ textAlign: 'end' }}>Error rate</th>
                    <th style={{ textAlign: 'end' }}>p95</th>
                    <th style={{ textAlign: 'end' }}>SLO</th>
                  </tr>
                </thead>
                <tbody>
                  {rings.map((r) => (
                    <tr key={r.n}>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                          <StatusDot tone={r.status === 'done' ? 'done' : r.status === 'running' ? 'running' : 'pending'} size="sm" pulse={r.status === 'running'} />
                          {r.label}
                        </span>
                      </td>
                      <td style={{ color: 'var(--fg-muted)' }}>{r.audience}</td>
                      <td><Pill tone={r.scope === 'internal' ? 'neutral' : 'ice'}>{r.scope === 'internal' ? 'Internal' : 'End users'}</Pill></td>
                      <td className="mono" style={{ textAlign: 'end' }}>{r.traffic}</td>
                      <td className="mono" style={{ textAlign: 'end', color: r.err === '-' ? 'var(--fg-faint)' : 'var(--fg)' }}>{r.err}</td>
                      <td className="mono" style={{ textAlign: 'end', color: r.p95 === '-' ? 'var(--fg-faint)' : 'var(--fg)' }}>{r.p95}</td>
                      <td style={{ textAlign: 'end' }}>
                        {r.slo === 'pass' ? <HealthBadge state="up" label="Pass" /> : r.slo === 'warn' ? <Pill tone="warning" dot>Watch</Pill> : <span style={{ color: 'var(--fg-faint)' }}>-</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {rolloutLive && (
          <div className="fp-grid fp-grid-2" style={{ marginBlockStart: 14, alignItems: 'start' }}>
            <div className="fp-card">
              <div className="fp-card-head">
                <div className="fp-card-title">Health gates</div>
                <span className="fp-card-meta">{RING_HEALTH.filter((g) => g.status === 'pass').length} of {RING_HEALTH.length} green</span>
              </div>
              <div className="fp-rb">
                {RING_HEALTH.map((g) => {
                  const tone = g.status === 'pass' ? 'var(--success)' : g.status === 'warn' ? 'var(--warning)' : 'var(--danger)';
                  const Icon = g.status === 'pass' ? Icons.check : g.status === 'warn' ? Icons.alert : Icons.x;
                  return (
                    <div key={g.name} className="fp-rb-row">
                      <span style={{ color: tone, display: 'inline-flex' }}><Icon size={14} /></span>
                      <span className="fp-rb-id">
                        <span className="fp-rb-name">{g.name}</span>
                        <span className="fp-rb-meta">target {g.target}</span>
                      </span>
                      <span className="mono" style={{ color: tone }}>{g.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="fp-card">
              <div className="fp-card-head">
                <div className="fp-card-title">Live metrics</div>
                <span className="fp-card-meta">last 7 min</span>
              </div>
              <div className="fp-rb-metrics">
                <div className="fp-rb-metric">
                  <div className="fp-rb-metric-head"><span>Error rate</span><span className="mono" style={{ color: 'var(--success)' }}>0.21%</span></div>
                  <Sparkline data={RING_LIVE.err} w={300} h={34} color="var(--success)" />
                </div>
                <div className="fp-rb-metric">
                  <div className="fp-rb-metric-head"><span>p95 latency</span><span className="mono">145ms</span></div>
                  <Sparkline data={RING_LIVE.p95} w={300} h={34} color="var(--ember)" />
                </div>
                <div className="fp-rb-metric">
                  <div className="fp-rb-metric-head"><span>SLO compliance</span><span className="mono" style={{ color: 'var(--success)' }}>99.97%</span></div>
                  <Sparkline data={RING_LIVE.slo} w={300} h={34} color="var(--accent-2)" />
                </div>
              </div>
            </div>
          </div>
        )}
      </FSection>

      <div className="fp-grid fp-grid-2x1" style={{ alignItems: 'start', marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        {/* Logs */}
        <div className="fp-card" style={{ padding: 0 }}>
          <div className="fp-card-head" style={{ paddingBlock: 12, paddingInline: 14, borderBlockEnd: '1px solid var(--border)' }}>
            <div className="fp-card-title" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Icons.terminal size={13} /> Log · {run.stage}
            </div>
            <div style={{ display: 'inline-flex', gap: 6 }}>
              <Button variant="ghost" size="sm"><Icons.download size={11} /> Download</Button>
              <Button variant="ghost" size="sm"><Icons.copy size={11} /> Copy</Button>
            </div>
          </div>
          <LogViewer lines={log} variant="filterable" height={440} follow={run.status === 'running'} />
        </div>

        {/* Aside */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title">Run summary</div>
            </div>
            <dl className="fp-kv">
              {summary.map(([k, v]) => (
                <div key={k} className="fp-kv-row">
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title">Artifacts</div>
              <Button variant="ghost" size="sm"><Icons.download size={11} /> All</Button>
            </div>
            <ul className="fp-artifacts">
              {ARTIFACTS.map((a) => {
                const Icon = (Icons as Record<string, React.FC<{ size?: number }>>)[a.kind] ?? Icons.doc;
                return (
                  <li key={a.name} className="fp-artifact">
                    <span className="fp-artifact-ic"><Icon size={13} /></span>
                    <span className="fp-artifact-name mono">{a.name}</span>
                    <span className="fp-artifact-size mono">{a.size}</span>
                    <button type="button" className="fp-artifact-dl" aria-label={`Download ${a.name}`}>
                      <Icons.download size={12} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
