'use client';
// Forge — DORA · Engineering pulse.
//
// Brief — Persona: Tech Manager / EM (and the Director above them). Question:
// is the org shipping fast AND safely, and which product drags the DORA band
// down? Data: the four DORA metrics + per-product breakdown (src/portal/data/
// dora.ts), bureau services + people. Primary action: drill into the lagging
// product (and export the window). Distinctive move: the per-product DORA
// matrix that ranks the estate Elite -> Low, with a Forge AI read naming the
// one lever that lifts the whole org.
//
// Composes only Eidos DS + existing .fp-* classes. Ember follows the example
// screens (liberal). No tier, no per-page <style>.
import * as React from 'react';
import { Button, Icons, Pill, Select, Trend } from '@/ds/core';
import { FPageHeader, FSection } from '@/portal/shell/portal-shell';
import { AiBanner } from '@/portal/shell/ai-pattern';
import { MetricChartCard } from '@/portal/shell/viz';
import {
  AI_READ,
  DEPLOYS_PER_DAY,
  DORA_BY_PRODUCT,
  KPIS,
  LEAD_PCT,
  RECENT_DEPLOYS,
  STATUS_META,
  type DoraBand,
  type DoraKpi,
} from '@/portal/data/dora';

/* Elite = the BEST band: success, not ember (4 KPI cards would spend the whole
   warm-accent budget on a status). High stays the cooler positive. */
const BAND_TONE: Record<DoraBand, 'success' | 'ice' | 'warning' | 'danger'> = {
  Elite: 'success',
  High: 'ice',
  Medium: 'warning',
  Low: 'danger',
};

const RANGES = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
];

function BandPill({ band, dot = true }: { band: DoraBand; dot?: boolean }) {
  return (
    <Pill tone={BAND_TONE[band]} dot={dot}>
      {band}
    </Pill>
  );
}

/* T2 Pulse: each DORA metric is a composed metric+chart card — current window
   solid, prior window as the dashed ghost, the band as the badge. */
function Kpi({ kpi }: { kpi: DoraKpi }) {
  const good = kpi.inverted ? kpi.delta <= 0 : kpi.delta >= 0;
  // Deterministic prior-window ghost derived from the series (mock data).
  const prev = kpi.series.map((v, i) => Math.round(v * (0.82 + 0.04 * ((i * 7) % 3))));
  return (
    <MetricChartCard
      label={kpi.label}
      value={kpi.value}
      delta={{ label: `${kpi.delta > 0 ? '+' : ''}${kpi.delta}${kpi.unit}`, good }}
      badge={<BandPill band={kpi.band} />}
      note={kpi.note}
      series={kpi.series}
      prev={prev}
    />
  );
}

export default function DoraPage() {
  const [range, setRange] = React.useState('7d');
  const maxDay = Math.max(...DEPLOYS_PER_DAY.map((d) => d.n));

  return (
    <>
      <FPageHeader
        eyebrow="Engineering pulse"
        title="DORA"
        subtitle="See how fast and how safely the org ships, and the one product dragging the band down."
        actions={
          <>
            <span className="fp-filter-select">
              <Select value={range} onValueChange={setRange} options={RANGES} width="150px" />
            </span>
            <Button variant="ghost">
              <Icons.download size={13} /> Export
            </Button>
          </>
        }
      />

      {/* Forge AI read — the one lever, woven in (not a chat box). */}
      <AiBanner title={AI_READ.title} action="Open Recovery">
        <span className="fp-aip-hl">Recovery</span> is the only product below the <span className="fp-aip-hl">High</span> band: <span className="fp-aip-hl">16%</span> change-fail and <span className="fp-aip-hl">2.4h</span> restore drag the average. Ring-based rollout there lifts the org to <span className="fp-aip-hl">Elite</span> on all four metrics.
      </AiBanner>

      {/* 4 DORA metrics */}
      <div className="fp-grid fp-grid-4">
        {KPIS.map((k) => (
          <Kpi key={k.id} kpi={k} />
        ))}
      </div>

      {/* Cadence + lead-time distribution */}
      <div className="fp-grid fp-grid-2x1" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div className="fp-card">
          <div className="fp-card-head">
            <div className="fp-card-title">Deploys per day</div>
            <div className="fp-legend">
              <span className="fp-legend-item">
                <span className="fp-legend-dot" style={{ background: 'var(--accent-2)' }} /> weekday
              </span>
              <span className="fp-legend-item">
                <span className="fp-legend-dot" style={{ background: 'var(--surface-active)' }} /> weekend
              </span>
            </div>
          </div>
          <div className="fp-bars">
            {DEPLOYS_PER_DAY.map((d, i) => (
              <div key={i} className="fp-bar-col">
                <span className="fp-bar-val">{d.n}</span>
                <div
                  className={'fp-bar' + (d.weekend ? ' is-muted' : '')}
                  style={{ blockSize: `${Math.max(4, (d.n / maxDay) * 168)}px` }}
                />
                <span className="fp-bar-label">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="fp-card fp-lead">
          <div className="fp-card-head">
            <div className="fp-card-title">Lead time</div>
            <BandPill band="Elite" />
          </div>
          <div className="fp-lead-hero">
            <span className="fp-lead-value">3.2h</span>
            <span className="fp-lead-cap">P95, PR open to production</span>
          </div>
          <p className="fp-lead-copy">
            95% of changes ship in under <strong>3 hours 12 minutes</strong>. The slowest tail is gated by
            risk reviews on bureau-critical services, which is expected. This puts the org in the{' '}
            <strong className="u-good">Elite</strong> DORA band.
          </p>
          <dl className="fp-lead-pcts">
            {LEAD_PCT.map((p) => (
              <div key={p.p} className="fp-lead-pct">
                <dt>{p.p}</dt>
                <dd className="mono">{p.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* DORA by product — the matrix (distinctive move) */}
      <FSection title="DORA by product" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div className="fp-card" style={{ padding: 0 }}>
          <div className="tbl-wrap">
            <table className="tbl" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th style={{ textAlign: 'end' }}>Deploys / wk</th>
                  <th style={{ textAlign: 'end' }}>Lead time</th>
                  <th style={{ textAlign: 'end' }}>Change-fail</th>
                  <th style={{ textAlign: 'end' }}>Restore</th>
                  <th style={{ textAlign: 'end' }}>30d trend</th>
                  <th style={{ textAlign: 'end' }}>Band</th>
                </tr>
              </thead>
              <tbody>
                {DORA_BY_PRODUCT.map((p) => (
                  <tr key={p.product}>
                    <td style={{ fontWeight: 600 }}>
                      {p.product}
                      <span className="fp-cell-sub">{p.services} services</span>
                    </td>
                    <td className="mono" style={{ textAlign: 'end' }}>{p.deploys}</td>
                    <td className="mono" style={{ textAlign: 'end' }}>{p.lead}</td>
                    <td className="mono" style={{ textAlign: 'end' }}>{p.cfr}</td>
                    <td className="mono" style={{ textAlign: 'end' }}>{p.mttr}</td>
                    <td style={{ textAlign: 'end' }}>
                      <Trend delta={p.trend} unit="%" />
                    </td>
                    <td style={{ textAlign: 'end' }}>
                      <BandPill band={p.band} dot={false} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FSection>

      {/* Recent deploys */}
      <FSection title="Recent deploys" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div className="fp-card" style={{ padding: 0 }}>
          <div className="tbl-wrap">
            <table className="tbl" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>Run</th>
                  <th>Service</th>
                  <th>Version</th>
                  <th>Stage</th>
                  <th>Author</th>
                  <th style={{ textAlign: 'end' }}>Status</th>
                  <th style={{ textAlign: 'end' }}>Started</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_DEPLOYS.map((d) => {
                  const s = STATUS_META[d.status];
                  return (
                    <tr key={d.id}>
                      <td className="mono" style={{ fontWeight: 600 }}>{d.id}</td>
                      <td className="mono" style={{ color: 'var(--fg-muted)' }}>{d.service}</td>
                      <td className="mono" style={{ color: 'var(--fg-muted)' }}>{d.version}</td>
                      <td>{d.stage}</td>
                      <td>{d.author}</td>
                      <td style={{ textAlign: 'end' }}>
                        <Pill tone={`status-${s.dot}` as 'status-done'} dot live={s.dot === 'running'}>
                          {s.label}
                        </Pill>
                      </td>
                      <td className="mono" style={{ textAlign: 'end', color: 'var(--fg-muted)' }}>{d.started}</td>
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
