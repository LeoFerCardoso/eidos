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
  Icons,
  LogViewer,
  Pill,
  Pipeline,
  StatusDot,
} from '@/ds/core';
import { FPageHeader, FSection, usePageCrumb } from '@/portal/shell/portal-shell';
import { AiBanner } from '@/portal/shell/ai-pattern';
import {
  ARTIFACTS,
  STATUS_META,
  aiReadFor,
  getRun,
  logFor,
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
          title="Auto-promote armed"
          message="Change Risk Score is 38, under the 300 auto-merge threshold. If canary health holds through the observation window, Forge promotes this run to Ring 2 with no human gate."
        />
      ) : null}

      <FSection title="Stages" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div className="fp-card" style={{ paddingBlock: 18, paddingInline: 16 }}>
          <Pipeline variant="chevron" steps={stages} />
        </div>
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
