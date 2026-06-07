'use client';
// Forge — LGPD & Audit. The bureau's data-protection posture and the PII audit
// trail: consent coverage, the data-subject requests in flight, who touched
// personal data and why, and where it lives.
//
// Brief — Persona: DPO / compliance lead + Platform. Question: are we LGPD
// compliant, which subject requests are due, and did anyone touch PII they
// should not have? Data: consent + DSRs + audit (src/portal/data/compliance.ts).
// Primary action: action a request / review a flagged access. Distinctive move:
// the audit trail that records every PII access (human, agent or service) with
// purpose, and Forge AI flags the access worth a second look.
//
// Composes only Eidos DS + .fp-* classes. CPFs masked; LGPD domain.
import * as React from 'react';
import { Button, Icons, Pill, Select, StatusDot } from '@/ds/core';
import { FPageHeader, FSection } from '@/portal/shell/portal-shell';
import {
  ACTOR_ICON,
  AI_READ,
  AUDIT,
  CONSENT_SCOPES,
  DSRS,
  DSR_STATUS_META,
  KPIS,
  RESIDENCY,
  type AuditEvent,
  type DsrStatus,
} from '@/portal/data/compliance';

const RANGES = [
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
];

const KPI_COLOR: Record<string, string | undefined> = { good: 'var(--success)', warn: 'var(--warning)', bad: 'var(--danger)' };

export default function CompliancePage() {
  const [range, setRange] = React.useState('24h');

  return (
    <>
      <FPageHeader
        eyebrow="LGPD & Audit"
        title="LGPD & Audit"
        subtitle="98.7% consent coverage · 6 open subject requests · 38.2k audit events today"
        actions={
          <>
            <span className="fp-filter-select">
              <Select value={range} onValueChange={setRange} options={RANGES} width="160px" />
            </span>
            <Button variant="ghost">
              <Icons.download size={13} /> DPIA report
            </Button>
          </>
        }
      />

      {/* Forge AI read — the access to review. */}
      <div className="fp-ai-read">
        <span className="fp-ai-read-icon" aria-hidden="true"><Icons.sparkle size={16} /></span>
        <div className="fp-ai-read-body">
          <span className="fp-ai-read-eyebrow">Forge AI · {AI_READ.title}</span>
          <p>{AI_READ.body}</p>
        </div>
        <Button variant="outline" size="sm">Review export</Button>
      </div>

      {/* KPIs */}
      <div className="fp-grid fp-grid-4">
        {KPIS.map((k) => (
          <div key={k.id} className="fp-kpi">
            <span className="label">{k.label}</span>
            <div className="value" style={{ color: KPI_COLOR[k.tone ?? ''] }}>{k.value}</div>
            <p className="fp-kpi-note">{k.note}</p>
          </div>
        ))}
      </div>

      {/* DSRs + consent/residency */}
      <div className="fp-grid fp-grid-2x1" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)', alignItems: 'start' }}>
        <FSection title="Data-subject requests">
          <div className="fp-card" style={{ padding: 0 }}>
            <div className="tbl-wrap">
              <table className="tbl" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th>Request</th>
                    <th>Type</th>
                    <th>Subject</th>
                    <th>Owner</th>
                    <th style={{ textAlign: 'end' }}>Deadline</th>
                    <th style={{ textAlign: 'end' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {DSRS.map((d) => {
                    const meta = DSR_STATUS_META[d.status as DsrStatus];
                    return (
                      <tr key={d.id}>
                        <td className="mono" style={{ fontWeight: 600 }}>{d.id}</td>
                        <td>{d.type}</td>
                        <td className="mono" style={{ color: 'var(--fg-muted)' }}>{d.subject}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>{d.owner}</td>
                        <td className="mono" style={{ textAlign: 'end', color: d.status === 'overdue' ? 'var(--danger)' : 'var(--fg-muted)', whiteSpace: 'nowrap' }}>{d.due}</td>
                        <td style={{ textAlign: 'end' }}><Pill tone={meta.tone} dot live={d.status === 'in-progress'}>{meta.label}</Pill></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </FSection>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title">Consent scopes</div>
              <span className="fp-card-meta">of all records</span>
            </div>
            <div className="fp-segbar" role="img" aria-label="Consent scope coverage">
              {CONSENT_SCOPES.map((c) => (
                <span key={c.label} className="fp-segbar-seg" style={{ inlineSize: `${c.pct}%`, background: c.color }} />
              ))}
            </div>
            <ul className="fp-mix-legend">
              {CONSENT_SCOPES.map((c) => (
                <li key={c.label} className="fp-mix-item">
                  <span className="fp-mix-key"><span className="fp-mix-dot" style={{ background: c.color }} /> {c.label}</span>
                  <span className="fp-mix-pct mono">{c.pct}%</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title">Data residency</div>
              <Pill tone="health-up" dot>In-country</Pill>
            </div>
            <ul className="fp-band-list">
              {RESIDENCY.map((r) => (
                <li key={r.region} className="fp-band">
                  <span className="fp-band-key">
                    <Icons.globe size={13} /> {r.region}
                  </span>
                  <span className="mono">{r.share}</span>
                </li>
              ))}
            </ul>
            <p className="fp-kpi-note" style={{ marginBlockStart: 10 }}>
              All personal data stays within Brazilian regions, as LGPD requires.
            </p>
          </div>
        </div>
      </div>

      {/* Audit trail — the distinctive surface. */}
      <FSection title="Audit trail" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div className="fp-card" style={{ padding: 0 }}>
          <div className="tbl-wrap">
            <table className="tbl" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>Resource</th>
                  <th>Subject</th>
                  <th>Purpose</th>
                  <th style={{ textAlign: 'end' }}>When</th>
                  <th style={{ textAlign: 'end' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {AUDIT.map((e: AuditEvent) => {
                  const Icon = (Icons as Record<string, React.FC<{ size?: number }>>)[ACTOR_ICON[e.actorKind]] ?? Icons.circle;
                  return (
                    <tr key={e.id} className={e.status === 'flagged' ? 'fp-row-flag' : undefined}>
                      <td>
                        <span className="fp-actor">
                          <span className="fp-actor-ic"><Icon size={13} /></span>
                          <span style={{ fontWeight: 600 }}>{e.actor}</span>
                        </span>
                      </td>
                      <td className="mono" style={{ color: 'var(--fg-muted)' }}>{e.action}</td>
                      <td className="mono">{e.resource}</td>
                      <td className="mono" style={{ color: 'var(--fg-muted)' }}>{e.subject}</td>
                      <td style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-sm)' }}>{e.purpose}</td>
                      <td className="mono" style={{ textAlign: 'end', color: 'var(--fg-muted)', whiteSpace: 'nowrap' }}>{e.when}</td>
                      <td style={{ textAlign: 'end' }}>
                        {e.status === 'flagged' ? (
                          <Pill tone="danger" icon={<Icons.alert size={10} />}>Flagged</Pill>
                        ) : (
                          <span className="fp-ok"><StatusDot tone="done" size="sm" /> OK</span>
                        )}
                      </td>
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
