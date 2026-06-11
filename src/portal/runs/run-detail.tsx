'use client';
// Forge · Run detail (/portal/runs/[run]). The instance view: a step timeline
// where every step carries its status, its guardrail verdict (inline), and a
// per-step rollback. Right rail: the context the agent consumed + artifacts +
// roll-back-all. Composes Eidos DS + .fp-* classes.

import * as React from 'react';
import Link from 'next/link';
import { Icons, Pill, Button, Avatar } from '@/ds/core';
import { usePageCrumb } from '@/portal/shell/portal-shell';
import {
  getRun, stepsFor, contextFor, STEP_STATUS_META, type RunStep,
} from '@/portal/data/runs';
import { RUN_STATUS_META } from '@/portal/data/workflows';

const MARKER_ICON: Record<RunStep['status'], string> = {
  done: 'check', running: 'play', pending: 'clock',
  escalated: 'alert', 'rolled-back': 'undo', skipped: 'minus', failed: 'alert',
};

const ICON = (k: string, size = 12) => {
  const C = (Icons as Record<string, React.FC<{ size?: number }>>)[k] ?? Icons.clock;
  return <C size={size} />;
};

function Step({ s, last }: { s: RunStep; last: boolean }) {
  const meta = STEP_STATUS_META[s.status];
  return (
    <div className={`fp-rt-step is-${s.status}`}>
      <div className="fp-rt-rail">
        <span className="fp-rt-marker" aria-hidden="true">{ICON(MARKER_ICON[s.status], 12)}</span>
        {!last && <span className="fp-rt-line" aria-hidden="true" />}
      </div>
      <div className="fp-rt-body">
        <div className="fp-rt-top">
          <span className="fp-rt-label">{s.label}</span>
          {s.verdict && <Pill tone={s.verdict.tone} dot>{s.verdict.label}</Pill>}
          {/* Status pill only for states the marker alone does not make obvious;
              done / pending / skipped read from the marker + dimming. */}
          {(s.status === 'running' || s.status === 'escalated' || s.status === 'rolled-back' || s.status === 'failed') && (
            <Pill tone={meta.tone} dot={s.status === 'running'} className="fp-rt-status">{meta.label}</Pill>
          )}
          {s.duration && <span className="fp-rt-dur mono">{s.duration}</span>}
        </div>
        {s.sublabel && <div className="fp-rt-sub">{s.sublabel}</div>}
        <div className="fp-rt-acts">
          {s.actionId && (
            <Link href={`/portal/actions/${s.actionId}`} className="fp-rt-link">
              <Icons.command size={11} /> {s.actionId} <Icons.chevronRight size={11} />
            </Link>
          )}
          {s.reversible && s.status === 'done' && (
            <button type="button" className="fp-rt-rollback"><Icons.undo size={11} /> Roll back</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RunDetail({ id }: { id: string }) {
  const run = getRun(id);
  const { setCrumb } = usePageCrumb();

  React.useEffect(() => {
    if (run) setCrumb({ label: run.id, replace: true });
    return () => setCrumb(null);
  }, [run, setCrumb]);

  if (!run) {
    return (
      <div className="fp-agents-empty" style={{ padding: '64px 0' }}>
        <Icons.clock size={28} />
        <p>No run with id &ldquo;{id}&rdquo;.</p>
        <Button variant="ghost" asChild>
          <Link href="/portal/runs"><Icons.chevronLeft size={13} /> Back to runs</Link>
        </Button>
      </div>
    );
  }

  const steps = stepsFor(run);
  const ctx = contextFor(run);
  const st = RUN_STATUS_META[run.status];
  const awaitingHuman = run.status === 'escalated' || steps.some((s) => s.status === 'escalated');

  return (
    <div className="fp-rund">
      <div className="fp-agentd-topbar">
        <Link href="/portal/runs" className="fp-back-eyebrow" style={{ marginBlockEnd: 0 }}><Icons.arrowLeft size={11} /> Runs</Link>
        <div className="fp-agentd-topbar-actions">
          <Button variant="ghost" asChild>
            <Link href={`/portal/workflows/${run.workflowId}`}><Icons.share size={14} /> View workflow</Link>
          </Button>
          <Button variant="outline"><Icons.undo size={14} /> Roll back all</Button>
        </div>
      </div>

      <div className="fp-rund-head">
        <h1 className="mono">{run.id}</h1>
        <Pill tone={st.tone} dot={run.status === 'running'}>{st.label}</Pill>
      </div>
      <div className="fp-rund-facts">
        <Link href={`/portal/workflows/${run.workflowId}`} className="fp-rund-wf"><Icons.share size={12} /> {run.workflowName}</Link>
        <span className="fp-rund-fact"><Avatar name={run.agent} size={18} /> {run.agent} <span className="role">· {run.agentRole}</span></span>
        <span className="fp-rund-fact mono">trigger: {run.trigger}</span>
        <span className="fp-rund-fact">{run.when} · {run.duration}</span>
      </div>

      <div className="fp-rund-grid">
        {/* Step timeline */}
        <div className="fp-rt">
          {steps.map((s, i) => <Step key={s.id} s={s} last={i === steps.length - 1} />)}
        </div>

        {/* Context rail */}
        <aside className="fp-rund-rail">
          <section className="fp-agentd-sec">
            <div className="fp-agentd-sec-head"><span className="t">Context consumed</span></div>
            <div className="fp-rund-chips">
              {ctx.consumed.map((c) => <span key={c} className="fp-rund-chip mono">{c}</span>)}
            </div>
          </section>

          <section className="fp-agentd-sec">
            <div className="fp-agentd-sec-head"><span className="t">Guardrails</span></div>
            <dl className="fp-agentd-props">
              <dt>Gates fired</dt><dd className="mono">{ctx.guardrails}</dd>
              <dt>Approver</dt><dd>{ctx.approver ?? 'none required'}</dd>
            </dl>
          </section>

          <section className="fp-agentd-sec">
            <div className="fp-agentd-sec-head"><span className="t">Artifacts</span><span className="fp-agentd-sec-count">{ctx.artifacts.length}</span></div>
            <div className="fp-rund-arts">
              {ctx.artifacts.map((a) => (
                <span key={a.label} className="fp-rund-art"><Icons.link size={11} /> {a.label}</span>
              ))}
            </div>
          </section>

          {awaitingHuman && (
            <div className="fp-rund-cta">
              <Icons.alert size={14} />
              <span>This run is waiting on a human. Approve the escalated step to continue.</span>
              <Button variant="ember" size="sm">Review in Decide</Button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
