'use client';
// Forge — Scorecards · production readiness, security and docs, continuously
// measured, PAIRED with the initiatives that close the gaps.
//
// Brief — Persona: Tech Manager / EM + Platform. Question: is my estate
// production-ready / secure / documented, where are the gaps, and which
// initiative closes them? Data: per-service pillar scores per scorecard +
// time-bound initiatives (src/portal/data/scorecards.ts). Primary action:
// switch scorecard / open a failing service / track an initiative. Distinctive
// move: scorecards paired with Initiatives (campaigns with progress + due
// dates), plus a Forge AI read naming the first gap to close.
//
// Composes only Eidos DS + .fp-* classes. No tier; product, not tribe.
import * as React from 'react';
import { Button, Icons, LangBadge, Pill, Progress, ScoreGauge, Select, Sparkline, Trend } from '@/ds/core';
import { FPageHeader, FSection } from '@/portal/shell/portal-shell';
import {
  AI_READ,
  INITIATIVE_TONE,
  INITIATIVES,
  SCORECARDS,
  bandTone,
  buildScorecard,
  pillarTone,
  type ScoreRow,
  type ScorecardId,
} from '@/portal/data/scorecards';

type RowFilter = 'All' | 'At risk' | 'Failing' | 'Improving';
const FILTERS: RowFilter[] = ['All', 'At risk', 'Failing', 'Improving'];

const PROG_STATUS = { 'on-track': 'success', 'at-risk': 'warning', behind: 'danger' } as const;

export default function ScorecardsPage() {
  const [scId, setScId] = React.useState<ScorecardId>('readiness');
  const [filter, setFilter] = React.useState<RowFilter>('All');

  const view = React.useMemo(() => buildScorecard(scId), [scId]);
  const { scorecard, rows, summary } = view;

  const filtered = React.useMemo(() => {
    if (filter === 'At risk') return rows.filter((r) => r.overall >= 60 && r.overall < 80);
    if (filter === 'Failing') return rows.filter((r) => r.overall < 60);
    if (filter === 'Improving') return rows.filter((r) => r.trend > 0);
    return rows;
  }, [rows, filter]);

  const sorted = [...filtered].sort((a, b) => b.overall - a.overall);
  const movers = [...rows].sort((a, b) => Math.abs(b.trend) - Math.abs(a.trend)).slice(0, 4);

  const bands = [
    { label: 'Excellent · 90+', color: 'var(--success)', n: rows.filter((r) => r.overall >= 90).length },
    { label: 'Compliant · 80-89', color: 'var(--ember)', n: rows.filter((r) => r.overall >= 80 && r.overall < 90).length },
    { label: 'At risk · 60-79', color: 'var(--warning)', n: rows.filter((r) => r.overall >= 60 && r.overall < 80).length },
    { label: 'Critical · under 60', color: 'var(--danger)', n: rows.filter((r) => r.overall < 60).length },
  ];

  return (
    <>
      <FPageHeader
        eyebrow="Quality scorecards"
        title="Scorecards"
        subtitle={`${scorecard.desc} · ${rows.length} services · ${summary.passing}% passing`}
        actions={
          <>
            <span className="fp-filter-select">
              <Select
                value={scId}
                onValueChange={(v) => setScId(v as ScorecardId)}
                options={SCORECARDS.map((s) => ({ value: s.id, label: s.name }))}
                width="190px"
              />
            </span>
            <Button variant="ghost">
              <Icons.download size={13} /> Export
            </Button>
            <Button variant="ember">
              <Icons.plus size={13} /> New check
            </Button>
          </>
        }
      />

      {/* Forge AI read — the first gap to close. */}
      <div className="fp-ai-read">
        <span className="fp-ai-read-icon" aria-hidden="true">
          <Icons.sparkle size={16} />
        </span>
        <div className="fp-ai-read-body">
          <span className="fp-ai-read-eyebrow">Forge AI · {AI_READ.title}</span>
          <p>{AI_READ.body}</p>
        </div>
        <Button variant="outline" size="sm">
          Open recovery-comms
        </Button>
      </div>

      {/* Summary KPIs */}
      <div className="fp-grid fp-grid-4">
        <div className="fp-kpi">
          <span className="label">Average score</span>
          <div className="value">{summary.average}</div>
          <p className="fp-kpi-note">Mean across {rows.length} services.</p>
        </div>
        <div className="fp-kpi">
          <span className="label">Passing · 80+</span>
          <div className="value u-good">{summary.passing}%</div>
          <p className="fp-kpi-note">Meet or beat the bar.</p>
        </div>
        <div className="fp-kpi">
          <span className="label">At risk · 60-79</span>
          <div className="value" style={{ color: 'var(--warning)' }}>{summary.atRisk}%</div>
          <p className="fp-kpi-note">One pillar short of passing.</p>
        </div>
        <div className="fp-kpi">
          <span className="label">Failing · under 60</span>
          <div className="value" style={{ color: 'var(--danger)' }}>{summary.failing}%</div>
          <p className="fp-kpi-note">Need an initiative.</p>
        </div>
      </div>

      {/* Filter chips */}
      <div
        role="group"
        aria-label="Filter services"
        style={{ display: 'flex', gap: 6, marginBlock: '16px 0', flexWrap: 'wrap' }}
      >
        {FILTERS.map((f) => (
          <Pill
            key={f}
            tone={filter === f ? 'ember' : 'neutral'}
            dot={filter === f}
            role="radio"
            aria-checked={filter === f}
            tabIndex={0}
            style={{ cursor: 'pointer', border: '1px solid var(--border)', fontWeight: filter === f ? 600 : 500 }}
            onClick={() => setFilter(f)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFilter(f); } }}
          >
            {f}
          </Pill>
        ))}
      </div>

      <div className="fp-grid fp-grid-2x1" style={{ marginBlockStart: 'var(--fp-filter-gap, 14px)' }}>
        {/* Scorecard table */}
        <FSection title={scorecard.name}>
          <div className="fp-card" style={{ padding: 0 }}>
            <div className="tbl-wrap">
              <table className="tbl" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th style={{ minWidth: 132 }}>Overall</th>
                    {scorecard.pillars.map((p) => (
                      <th key={p} style={{ textAlign: 'center' }}>{p}</th>
                    ))}
                    <th style={{ textAlign: 'end' }}>30d</th>
                    <th>Owner</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((r: ScoreRow) => (
                    <tr key={r.id}>
                      <td>
                        <span style={{ fontWeight: 600 }}>{r.name}</span>
                        <span className="fp-cell-sub" style={{ display: 'inline-flex', gap: 6, alignItems: 'center', marginBlockStart: 3 }}>
                          <LangBadge lang={r.lang} /> {r.product}
                        </span>
                      </td>
                      <td>
                        <div style={{ inlineSize: 120 }}>
                          <ScoreGauge variant="linear" value={r.overall} min={0} max={100} inverted />
                        </div>
                      </td>
                      {scorecard.pillars.map((p) => (
                        <td key={p} style={{ textAlign: 'center' }}>
                          <Pill tone={pillarTone(r.pillarScores[p])} className="fp-scorechip">
                            {r.pillarScores[p]}
                          </Pill>
                        </td>
                      ))}
                      <td style={{ textAlign: 'end' }}>
                        <Trend delta={r.trend} unit="" variant="triangle" />
                      </td>
                      <td style={{ color: 'var(--fg-muted)', whiteSpace: 'nowrap' }}>{r.owner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FSection>

        {/* Right column — Initiatives (distinctive) + bands + movers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title">Initiatives</div>
              <Button variant="ghost" size="sm">
                <Icons.plus size={12} /> New
              </Button>
            </div>
            <ul className="fp-init-list">
              {INITIATIVES.map((it) => {
                const meta = INITIATIVE_TONE[it.status];
                return (
                  <li key={it.id} className="fp-init">
                    <div className="fp-init-top">
                      <span className="fp-init-name">{it.name}</span>
                      <Pill tone={meta.tone} dot>{meta.label}</Pill>
                    </div>
                    <p className="fp-init-desc">{it.desc}</p>
                    <Progress value={it.progress} max={100} status={PROG_STATUS[it.status]} size="sm" />
                    <div className="fp-init-foot">
                      <span>{it.done}/{it.scope} services</span>
                      <span>Due {it.due}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title">Top movers · 30d</div>
            </div>
            <ul className="fp-mover-list">
              {movers.map((r) => (
                <li key={r.id} className="fp-mover">
                  <div className="fp-mover-id">
                    <span className="fp-mover-name">{r.name}</span>
                    <span className="fp-mover-sub">{r.product}</span>
                  </div>
                  <span className="fp-mover-spark">
                    <Sparkline data={r.series} w={72} h={24} color={r.trend >= 0 ? 'var(--success)' : 'var(--danger)'} />
                  </span>
                  <Trend delta={r.trend} unit="" variant="triangle" />
                </li>
              ))}
            </ul>
          </div>

          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title">Score bands</div>
            </div>
            <ul className="fp-band-list">
              {bands.map((b) => (
                <li key={b.label} className="fp-band">
                  <span className="fp-band-key">
                    <span className="fp-band-dot" style={{ background: b.color }} />
                    {b.label}
                  </span>
                  <span className="mono">{b.n}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
