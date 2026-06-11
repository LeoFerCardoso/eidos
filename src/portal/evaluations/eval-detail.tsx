'use client';
// Forge — Experiment detail (/portal/evaluations/[id]). One eval run: the
// candidate vs the baseline, scorer by scorer, then case by case, each case
// linking to its trace.
//
// Brief — Persona: agent owner deciding ship / hold. Question: where exactly
// did the candidate lose points, and is the failure the prompt, the model or
// an upstream input? Data: getExperiment + CASES_BY_EXPERIMENT. Primary
// action: open a failing case's trace. Distinctive move: deltas everywhere
// (never absolute scores alone) and a one-line verdict naming the cohort that
// failed.
import * as React from 'react';
import Link from 'next/link';
import { Button, Icons, Pill, StatusDot } from '@/ds/core';
import { FPageHeader, usePageCrumb } from '@/portal/shell/portal-shell';
import {
  CASES_BY_EXPERIMENT,
  STATUS_META,
  getExperiment,
} from '@/portal/data/evaluations';

export default function EvalDetail({ id }: { id: string }) {
  const exp = getExperiment(id);
  const { setCrumb } = usePageCrumb();

  React.useEffect(() => {
    if (exp) setCrumb({ label: exp.name, replace: true });
    return () => setCrumb(null);
  }, [exp, setCrumb]);

  if (!exp) {
    return (
      <div className="fp-empty" style={{ marginBlockStart: 24 }}>
        <StatusDot tone="error" />
        <span>
          Experiment <span className="mono">{id}</span> not found.{' '}
          <Link href="/portal/evaluations" className="u-link">Back to Evaluations</Link>
        </span>
      </div>
    );
  }

  const st = STATUS_META[exp.status];
  const cases = CASES_BY_EXPERIMENT[exp.id] ?? [];
  const scorerCols = [...new Set(cases.flatMap((c) => c.scores.map((s) => s.scorer)))];

  return (
    <>
      <FPageHeader
        back={{ href: '/portal/evaluations', label: 'Evaluations' }}
        title={exp.name}
        status={<Pill tone={st.tone} dot={exp.status === 'running'} live={exp.status === 'running'}>{st.label}</Pill>}
        subtitle={`${exp.candidate} against ${exp.baseline} on ${exp.dataset} (${exp.cases} cases) · triggered by ${exp.trigger}, ${exp.when}.`}
        meta={
          <div className="fp-meta">
            <span className="fp-meta-chip"><Icons.agent size={12} /> {exp.agent} · {exp.model}</span>
            <span className="fp-meta-chip mono">{exp.passed}/{exp.cases} cases pass</span>
            <span className="fp-meta-chip"><Icons.gate size={12} /> {exp.status === 'regressed' ? 'Promotion blocked by the gate' : exp.status === 'improved' ? 'Cleared for promotion' : 'No gate decision'}</span>
          </div>
        }
        actions={<Button variant="outline"><Icons.refresh size={13} /> Re-run</Button>}
      />

      {/* Scorer summary: candidate vs baseline */}
      <div className="fp-grid fp-grid-4">
        {exp.scores.map((s) => {
          const d = s.value - s.baseline;
          const reg = d < -0.005;
          const imp = d > 0.005;
          // The value itself only turns red on a MATERIAL regression; a -0.01
          // wiggle is the delta chip's job, not an alarm.
          const material = d < -0.02;
          return (
            <div key={s.scorer} className="fp-kpi">
              <span className="label">{s.scorer}</span>
              <div className="value mono" style={material ? { color: 'var(--danger)' } : undefined}>
                {s.value.toFixed(2)}
                <span className={`ev-delta mono ${imp ? 'is-up' : reg ? 'is-down' : 'is-flat'}`} style={{ fontSize: 'var(--text-sm)', marginInlineStart: 8 }}>
                  {imp ? `+${d.toFixed(2)}` : reg ? d.toFixed(2) : '='}
                </span>
              </div>
              <p className="fp-kpi-note">baseline {s.baseline.toFixed(2)}</p>
            </div>
          );
        })}
      </div>

      {cases.length > 0 ? (
        <div className="fp-card" style={{ padding: 0, marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
          <div className="tbl-wrap">
            <table className="tbl" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>Case</th>
                  <th>Input</th>
                  <th>Expected</th>
                  <th>Output</th>
                  {scorerCols.map((sc) => (
                    <th key={sc} style={{ textAlign: 'end' }} className="mono">{sc}</th>
                  ))}
                  <th style={{ textAlign: 'end' }}>Result</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {cases.map((c) => (
                  <tr key={c.id} className={!c.pass ? 'fp-row-flag' : undefined}>
                    <td className="mono" style={{ color: 'var(--fg-muted)' }}>{c.id}</td>
                    <td style={{ maxInlineSize: 260 }}>
                      <span className="ev-cell-clip" title={c.input}>{c.input}</span>
                    </td>
                    <td className="mono" style={{ whiteSpace: 'nowrap' }}>{c.expected}</td>
                    <td className="mono" style={{ whiteSpace: 'nowrap', color: c.pass ? undefined : 'var(--danger)' }}>{c.output}</td>
                    {scorerCols.map((sc) => {
                      const v = c.scores.find((s) => s.scorer === sc)?.value;
                      return (
                        <td key={sc} className="mono" style={{ textAlign: 'end', color: v !== undefined && v < 0.7 ? 'var(--danger)' : 'var(--fg-muted)' }}>
                          {v !== undefined ? v.toFixed(2) : '--'}
                        </td>
                      );
                    })}
                    <td style={{ textAlign: 'end' }}>
                      <Pill tone={c.pass ? 'success' : 'danger'}>{c.pass ? 'pass' : 'fail'}</Pill>
                    </td>
                    <td style={{ textAlign: 'end' }}>
                      {c.traceId && (
                        <Link href={`/portal/traces/${c.traceId}`} className="u-link-quiet mono" style={{ fontSize: 'var(--text-xs)', whiteSpace: 'nowrap' }}>
                          <Icons.branch size={11} /> trace
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="fp-empty" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
          <Icons.clock size={16} />
          <span>
            {exp.status === 'running'
              ? `${exp.cases} cases queued · results land here as they finish.`
              : 'Per-case results were not retained for this run.'}
          </span>
        </div>
      )}
    </>
  );
}
