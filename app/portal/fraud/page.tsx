'use client';
// Forge — Fraud & Risk control room. How the bureau's anti-fraud defense is
// performing right now: what it caught, what it cost in false positives, which
// konduto rules are firing, and the live risk signals.
//
// Brief — Persona: Anti-Fraud engineer + Risk lead. Question: are we catching
// fraud without blocking good customers, which rule is mispriced, and what is
// spiking now? Data: fraud KPIs + rule performance + risk signals
// (src/portal/data/fraud.ts). Primary action: tune the costly rule / chase a
// signal. Distinctive move: the rule-performance table that prices each rule
// (catch rate vs false-positive cost), with a Forge AI read on the one to tune.
//
// Composes only Eidos DS + .fp-* classes. Bureau domain; BRL currency.
import * as React from 'react';
import { Button, Icons, Pill, Select, Sparkline, Trend } from '@/ds/core';
import { FPageHeader, FSection } from '@/portal/shell/portal-shell';
import { AiBanner } from '@/portal/shell/ai-pattern';
import {
  AI_READ,
  BLOCKED_PER_HOUR,
  DECISION_MIX,
  KPIS,
  RISK_SIGNALS,
  RULES,
  RULE_STATUS_META,
  type FraudKpi,
  type RiskSignal,
} from '@/portal/data/fraud';

const RANGES = [
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
];

const SIGNAL_TONE: Record<RiskSignal['tone'], 'danger' | 'warning' | 'neutral'> = {
  danger: 'danger',
  warning: 'warning',
  neutral: 'neutral',
};

function Kpi({ kpi }: { kpi: FraudKpi }) {
  return (
    <div className="fp-kpi">
      <span className="label">{kpi.label}</span>
      <div className="fp-kpi-row">
        <div className="value">{kpi.value}</div>
        <Trend delta={kpi.delta} unit={kpi.unit} inverted={kpi.inverted} />
      </div>
      <Sparkline data={kpi.series} w={240} h={32} color={kpi.color} />
      <p className="fp-kpi-note">{kpi.note}</p>
    </div>
  );
}

export default function FraudPage() {
  const [range, setRange] = React.useState('24h');
  const maxHour = Math.max(...BLOCKED_PER_HOUR.map((h) => h.n));

  return (
    <>
      <FPageHeader
        eyebrow="Anti-Fraud & Risk"
        title="Fraud & Risk"
        subtitle="Hold the line between catching fraud and blocking good customers, and chase what's spiking now."
        actions={
          <>
            <span className="fp-filter-select">
              <Select value={range} onValueChange={setRange} options={RANGES} width="160px" />
            </span>
            <Button variant="ghost">
              <Icons.download size={13} /> Export
            </Button>
          </>
        }
      />

      {/* Forge AI read — the rule to tune. */}
      <AiBanner title={AI_READ.title} action="Tune Geo mismatch">
        <span className="fp-aip-hl">Geo mismatch</span> fires <span className="fp-aip-hl">938x/day</span> at a <span className="fp-aip-hl">5.8%</span> false-positive rate, 3x the average, yet saves only <span className="fp-aip-hl">R$ 420k</span>. Narrowing it to high-value sessions cuts false positives ~<span className="fp-aip-hl">40%</span> at no cost to catch rate.
      </AiBanner>

      {/* KPIs */}
      <div className="fp-grid fp-grid-4">
        {KPIS.map((k) => (
          <Kpi key={k.id} kpi={k} />
        ))}
      </div>

      {/* Blocked per hour + decision mix / risk signals */}
      <div className="fp-grid fp-grid-2x1" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div className="fp-card">
          <div className="fp-card-head">
            <div className="fp-card-title">Blocked attempts per hour</div>
            <div className="fp-legend">
              <span className="fp-legend-item"><span className="fp-legend-dot" style={{ background: 'var(--ember)' }} /> blocked</span>
              <span className="fp-legend-item"><span className="fp-legend-dot" style={{ background: 'var(--ember-glow, var(--ember))' }} /> peak</span>
            </div>
          </div>
          <div className="fp-bars">
            {BLOCKED_PER_HOUR.map((h, i) => (
              <div key={i} className="fp-bar-col">
                <span className="fp-bar-val">{h.n}</span>
                <div
                  className={'fp-bar' + (h.peak ? ' is-peak' : '')}
                  style={{ blockSize: `${Math.max(4, (h.n / maxHour) * 168)}px` }}
                />
                <span className="fp-bar-label">{h.h}h</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title">Decision mix</div>
              <span className="fp-card-meta">Last {range === '24h' ? '24h' : range}</span>
            </div>
            <div className="fp-segbar" role="img" aria-label="Decision mix">
              {DECISION_MIX.map((d) => (
                <span key={d.label} className="fp-segbar-seg" style={{ inlineSize: `${d.pct}%`, background: d.color }} />
              ))}
            </div>
            <ul className="fp-mix-legend">
              {DECISION_MIX.map((d) => (
                <li key={d.label} className="fp-mix-item">
                  <span className="fp-mix-key"><span className="fp-mix-dot" style={{ background: d.color }} /> {d.label}</span>
                  <span className="fp-mix-pct mono">{d.pct}%</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title">Risk signals</div>
              <Pill tone="ember">{RISK_SIGNALS.length} live</Pill>
            </div>
            <ul className="fp-signals">
              {RISK_SIGNALS.map((s) => (
                <li key={s.label} className="fp-signal">
                  <div className="fp-signal-id">
                    <span className="fp-signal-label">{s.label}</span>
                    <span className="fp-signal-detail">{s.detail}</span>
                  </div>
                  <Pill tone={SIGNAL_TONE[s.tone]} dot={s.tone !== 'neutral'}>{s.value}</Pill>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Rule performance — the distinctive surface. */}
      <FSection title="Rule performance" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div className="fp-card" style={{ padding: 0 }}>
          <div className="tbl-wrap">
            <table className="tbl" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>Rule</th>
                  <th style={{ textAlign: 'end' }}>Fires / day</th>
                  <th style={{ textAlign: 'end' }}>Catch rate</th>
                  <th style={{ textAlign: 'end' }}>False positive</th>
                  <th style={{ textAlign: 'end' }}>Blocked</th>
                  <th style={{ textAlign: 'end' }}>7d</th>
                  <th style={{ textAlign: 'end' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {RULES.map((r) => {
                  const meta = RULE_STATUS_META[r.status];
                  const fprHot = r.fpr >= 4;
                  return (
                    <tr key={r.id}>
                      <td>
                        <span style={{ fontWeight: 600 }}>{r.name}</span>
                        <span className="fp-cell-sub">{r.category}</span>
                      </td>
                      <td className="mono" style={{ textAlign: 'end' }}>{r.firesPerDay.toLocaleString('en-US')}</td>
                      <td className="mono" style={{ textAlign: 'end', color: 'var(--success)' }}>{r.catchRate}%</td>
                      <td className="mono" style={{ textAlign: 'end', color: fprHot ? 'var(--danger)' : 'var(--fg)' }}>{r.fpr}%</td>
                      <td className="mono" style={{ textAlign: 'end' }}>{r.brlSaved}</td>
                      <td style={{ textAlign: 'end' }}><Trend delta={r.trend} unit="%" /></td>
                      <td style={{ textAlign: 'end' }}><Pill tone={meta.tone}>{meta.label}</Pill></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </FSection>
    </>
  );
}
