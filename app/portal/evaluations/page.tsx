'use client';
// Forge — AI Evaluations. Offline experiments against golden datasets plus the
// online scorers grading production traces. Scores here are load-bearing: the
// pre-deploy quality gate and the autonomy ramp in Access read from this layer.
//
// Brief — Persona: agent owner + AI platform engineer. Question: is the next
// version better than what is in production, and is production quality holding?
// Data: EXPERIMENTS / SCORERS (src/portal/data/evaluations.ts). Primary action:
// open an experiment's per-case results. Distinctive move: every score shows
// its delta vs baseline, and the Forge AI read names the ROOT CAUSE of a
// regression (stale features), not just the number.
import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Icons, Pill, Select } from '@/ds/core';
import { FPageHeader, FSearch } from '@/portal/shell/portal-shell';
import { AiBanner } from '@/portal/shell/ai-pattern';
import { MetricChartCard, ScatterCard } from '@/portal/shell/viz';
import {
  AGREEMENT_AI,
  AGREEMENT_POINTS,
  AI_READ,
  EXPERIMENTS,
  FIT_TREND,
  FIT_TREND_PREV,
  KPIS,
  SCORERS,
  SCORER_KIND_META,
  STATUS_META,
  type ExperimentStatus,
} from '@/portal/data/evaluations';

const STATUS_OPTS = [
  { value: 'all', label: 'All statuses' },
  { value: 'improved', label: 'Improved' },
  { value: 'regressed', label: 'Regressed' },
  { value: 'baseline', label: 'Baseline' },
  { value: 'running', label: 'Running' },
];

const TRIGGER_OPTS = [
  { value: 'all', label: 'All triggers' },
  { value: 'pre-deploy gate', label: 'Pre-deploy gate' },
  { value: 'nightly', label: 'Nightly' },
  { value: 'manual', label: 'Manual' },
];

function Delta({ value, baseline }: { value: number; baseline: number }) {
  const d = value - baseline;
  if (Math.abs(d) < 0.005) return <span className="ev-delta is-flat mono">=</span>;
  return (
    <span className={`ev-delta mono ${d > 0 ? 'is-up' : 'is-down'}`}>
      {d > 0 ? '+' : ''}{d.toFixed(2)}
    </span>
  );
}

export default function EvaluationsPage() {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [status, setStatus] = React.useState('all');
  const [trigger, setTrigger] = React.useState('all');

  const filtered = React.useMemo(() => {
    let list = EXPERIMENTS;
    if (status !== 'all') list = list.filter((e) => e.status === (status as ExperimentStatus));
    if (trigger !== 'all') list = list.filter((e) => e.trigger === trigger);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((e) => e.name.toLowerCase().includes(q) || e.agent.toLowerCase().includes(q) || e.dataset.includes(q));
    }
    return list;
  }, [query, status, trigger]);

  return (
    <>
      <FPageHeader
        eyebrow="AI"
        title="Evaluations"
        subtitle="Experiments against golden datasets, online scorers on production traces, and the deltas that gate a promotion."
        actions={
          <>
            <Button variant="ghost" asChild>
              <Link href="/portal/traces"><Icons.branch size={13} /> Traces</Link>
            </Button>
            <Button variant="ember"><Icons.plus size={13} /> New experiment</Button>
          </>
        }
      />

      <AiBanner title={AI_READ.title} action="Open trace">
        v2.4 regressed groundedness <span className="fp-aip-hl">0.81 to 0.74</span> on{' '}
        <span className="fp-aip-hl mono">golden-credit-50</span> while answer-fit held, and the
        pre-deploy gate blocked promotion. The 3 failing cases share the thin-file cohort:{' '}
        <span className="fp-aip-hl mono">feature-store.lookup</span> returned 26h-old vectors.
        Fix the Ignite refresh, not the prompt.
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

      <div className="fp-grid fp-grid-2x1" style={{ alignItems: 'start', marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        {/* ── Experiments ── */}
        <div>
          <div className="fp-toolbar">
            <div style={{ flex: 1, minInlineSize: 180, maxInlineSize: 320, display: 'flex' }}>
              <FSearch value={query} onChange={setQuery} placeholder="Search experiments, datasets..." aria-label="Search experiments" className="fluid" />
            </div>
            <span className="fp-filter-select"><Select value={status} onValueChange={setStatus} options={STATUS_OPTS} width="140px" /></span>
            <span className="fp-filter-select"><Select value={trigger} onValueChange={setTrigger} options={TRIGGER_OPTS} width="160px" /></span>
          </div>

          <div className="fp-ev-list">
            {filtered.map((e) => {
              const st = STATUS_META[e.status];
              return (
                <button key={e.id} type="button" className="fp-ev-row" onClick={() => router.push(`/portal/evaluations/${e.id}`)}>
                  <div className="ev-main">
                    <div className="ev-title">
                      {e.name}
                      <Pill tone={st.tone} dot={e.status === 'running'} live={e.status === 'running'}>{st.label}</Pill>
                    </div>
                    <span className="ev-sub">
                      {e.agent} · <span className="mono">{e.dataset}</span> · {e.candidate} vs {e.baseline} · {e.trigger}
                    </span>
                  </div>
                  <div className="ev-scores">
                    {e.status === 'running' ? (
                      <span className="ev-running mono">{e.cases} cases queued</span>
                    ) : (
                      <>
                        {e.scores.slice(0, 3).map((s) => (
                          <span key={s.scorer} className="ev-score" title={`${s.scorer}: ${s.value.toFixed(2)} vs baseline ${s.baseline.toFixed(2)}`}>
                            <span className="nm mono">{s.scorer}</span>
                            <span className="val mono">{s.value.toFixed(2)}</span>
                            <Delta value={s.value} baseline={s.baseline} />
                          </span>
                        ))}
                        <span className="ev-cases mono">{e.passed}/{e.cases} pass · {e.when}</span>
                      </>
                    )}
                  </div>
                  <Icons.chevronRight size={13} className="ev-go" />
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="fp-empty" style={{ marginBlockStart: 16 }}>
                <Icons.search size={18} />
                <span>No experiments match this filter.</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Right rail: quality over time + judge agreement + online scorers ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <MetricChartCard
          label="Fleet answer-fit · 30d"
          value="0.84"
          delta={{ label: '-0.02 wk', good: false }}
          note="Online, all agents. Prior month as the dashed ghost."
          series={FIT_TREND}
          prev={FIT_TREND_PREV}
          ai={
            <>
              The dip on days 19-21 tracks the scpc-gateway-mcp degradation: stale
              lookups dragged Bureau Assistant answers, not the prompts.
            </>
          }
        />
        <ScatterCard
          title="Judge vs human"
          meta="sampled pairs · 7d"
          points={AGREEMENT_POINTS}
          xLabel="answer-fit (judge)"
          yLabel="human review"
          height={180}
          ai={AGREEMENT_AI}
        />
        {/* ── Online scorers ── */}
        <div className="fp-card">
          <div className="fp-card-head">
            <div className="fp-card-title" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Icons.score size={13} /> Online scorers
            </div>
            <span className="fp-card-meta">production · trailing 7d</span>
          </div>
          <ul className="fp-ev-scorers">
            {SCORERS.map((s) => (
              <li key={s.id} className="fp-ev-scorer">
                <div className="sc-id">
                  <span className="nm mono">{s.name}</span>
                  <span className="kind">{SCORER_KIND_META[s.kind].label} · {s.onlinePerDay.toLocaleString('en-US')}/day</span>
                </div>
                <span className="sc-avg mono">{s.avg.toFixed(s.avg >= 0.99 ? 3 : 2)}</span>
                <span className={`sc-trend mono ${s.trend > 0 ? 'is-up' : s.trend < 0 ? 'is-down' : 'is-flat'}`}>
                  {s.trend > 0 ? `+${s.trend.toFixed(2)}` : s.trend < 0 ? s.trend.toFixed(2) : '='}
                </span>
              </li>
            ))}
          </ul>
          <p className="fp-ev-note">
            Verified success from these scorers feeds the autonomy ramp in{' '}
            <Link href="/portal/access" className="u-link-quiet">Access control</Link> and the{' '}
            <Link href="/portal/quality-gates" className="u-link-quiet">pre-deploy gate</Link>.
          </p>
        </div>
        </div>
      </div>
    </>
  );
}
