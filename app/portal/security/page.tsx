'use client';
// Forge — Security posture & triage. The bureau's active exposure in one place:
// vulnerabilities (CVEs), policy deviations and live threats, unified into one
// findings board with a posture score.
//
// Brief — Persona: Security engineer / AppSec + Platform. Question: what is our
// active exposure, what is on fire, and what do I fix first? Data: FINDINGS +
// posture (src/portal/data/security.ts). Primary action: triage a critical /
// waive or fix a deviation. Distinctive move: vulns, deviations and threats
// unified into one severity-ranked board, with a Forge AI read naming the one
// to fix first.
//
// Composes only Eidos DS + .fp-* classes.
import * as React from 'react';
import { Button, Icons, Pill, Select, Trend } from '@/ds/core';
import { FPageHeader, FSearch, FSection } from '@/portal/shell/portal-shell';
import {
  AI_READ,
  FINDINGS,
  KPIS,
  POSTURE,
  SEVERITY_MIX,
  SEV_META,
  STATUS_META,
  THREATS,
  TYPE_ICON,
  openFindings,
  type Finding,
  type FindingType,
  type Severity,
} from '@/portal/data/security';

const TYPE_FILTERS = [
  { value: 'all', label: 'All types' },
  { value: 'Vulnerability', label: 'Vulnerabilities' },
  { value: 'Deviation', label: 'Deviations' },
  { value: 'Threat', label: 'Threats' },
];

const SEV_FILTERS = [
  { value: 'all', label: 'All severities' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const totalOpen = openFindings.length || 1;

export default function SecurityPage() {
  const [query, setQuery] = React.useState('');
  const [type, setType] = React.useState('all');
  const [sev, setSev] = React.useState('all');

  const filtered = React.useMemo(() => {
    let list = FINDINGS;
    if (type !== 'all') list = list.filter((f) => f.type === (type as FindingType));
    if (sev !== 'all') list = list.filter((f) => f.severity === (sev as Severity));
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((f) => f.title.toLowerCase().includes(q) || f.service.toLowerCase().includes(q) || f.id.toLowerCase().includes(q) || (f.cve ?? '').toLowerCase().includes(q) || f.owner.toLowerCase().includes(q));
    }
    return list;
  }, [query, type, sev]);

  return (
    <>
      <FPageHeader
        eyebrow="Security posture"
        title="Security"
        subtitle={`${openFindings.length} open findings · ${THREATS.length} active threats · posture ${POSTURE.score}/100`}
        actions={
          <>
            <Button variant="ghost"><Icons.download size={13} /> Export</Button>
            <Button variant="ember"><Icons.shield size={13} /> Run scan</Button>
          </>
        }
      />

      {/* Forge AI read — fix this first. */}
      <div className="fp-ai-read">
        <span className="fp-ai-read-icon" aria-hidden="true"><Icons.sparkle size={16} /></span>
        <div className="fp-ai-read-body">
          <span className="fp-ai-read-eyebrow">Forge AI · {AI_READ.title}</span>
          <p>{AI_READ.body}</p>
        </div>
        <Button variant="outline" size="sm">Open the fix</Button>
      </div>

      {/* KPIs */}
      <div className="fp-grid fp-grid-4">
        {KPIS.map((k) => (
          <div key={k.id} className="fp-kpi">
            <span className="label">{k.label}</span>
            <div className="value">{k.value}</div>
            <p className="fp-kpi-note">{k.note}</p>
          </div>
        ))}
      </div>

      {/* Severity · posture · threats */}
      <div className="fp-grid fp-grid-3" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div className="fp-card">
          <div className="fp-card-head">
            <div className="fp-card-title">Open by severity</div>
            <span className="fp-card-meta">{openFindings.length} open</span>
          </div>
          <div className="fp-segbar" role="img" aria-label="Findings by severity">
            {SEVERITY_MIX.map((s) => (
              <span key={s.severity} className="fp-segbar-seg" style={{ inlineSize: `${(s.count / totalOpen) * 100}%`, background: s.color }} />
            ))}
          </div>
          <ul className="fp-mix-legend">
            {SEVERITY_MIX.map((s) => (
              <li key={s.severity} className="fp-mix-item">
                <span className="fp-mix-key"><span className="fp-mix-dot" style={{ background: s.color }} /> {s.label}</span>
                <span className="fp-mix-pct mono">{s.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="fp-card">
          <div className="fp-card-head">
            <div className="fp-card-title">Posture score</div>
            <Pill tone="health-up">{POSTURE.label}</Pill>
          </div>
          <div className="fp-posture">
            <span className="fp-posture-num mono">{POSTURE.score}<span className="fp-posture-den">/100</span></span>
            <Trend delta={POSTURE.delta} unit="" />
          </div>
          <p className="fp-kpi-note">{POSTURE.note}</p>
        </div>

        <div className="fp-card">
          <div className="fp-card-head">
            <div className="fp-card-title" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Icons.flame size={13} /> Active threats
            </div>
            <Pill tone="danger">{THREATS.length}</Pill>
          </div>
          <ul className="fp-signals">
            {THREATS.map((t) => (
              <li key={t.id} className="fp-signal">
                <span className="fp-sev-dot" style={{ background: SEV_META[t.severity].color }} aria-hidden="true" />
                <div className="fp-signal-id">
                  <span className="fp-signal-label">{t.title}</span>
                  <span className="fp-signal-detail">{t.service} · {t.source} · {t.age}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Toolbar */}
      <div className="fp-toolbar" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div style={{ flex: 1, minWidth: 240, maxWidth: 420, display: 'flex' }}>
          <FSearch value={query} onChange={setQuery} placeholder="Search findings, CVE, service…" aria-label="Search findings" className="fluid" />
        </div>
        <span className="fp-filter-select">
          <Select value={type} onValueChange={setType} options={TYPE_FILTERS} width="160px" />
        </span>
        <span className="fp-filter-select">
          <Select value={sev} onValueChange={setSev} options={SEV_FILTERS} width="150px" />
        </span>
      </div>

      <FSection title="Findings" style={{ marginBlockStart: 'var(--fp-filter-gap, 14px)' }}>
        <div className="fp-card" style={{ padding: 0 }}>
          <div className="tbl-wrap">
            <table className="tbl" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>Finding</th>
                  <th>Type</th>
                  <th>Severity</th>
                  <th>Service</th>
                  <th>Source</th>
                  <th>Owner</th>
                  <th style={{ textAlign: 'end' }}>Age</th>
                  <th style={{ textAlign: 'end' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f: Finding) => {
                  const TIcon = (Icons as Record<string, React.FC<{ size?: number }>>)[TYPE_ICON[f.type]] ?? Icons.shield;
                  const sm = SEV_META[f.severity];
                  const st = STATUS_META[f.status];
                  return (
                    <tr key={f.id} className={f.severity === 'critical' && (f.status === 'open' || f.status === 'triaging') ? 'fp-row-flag' : undefined}>
                      <td>
                        <span style={{ fontWeight: 600 }}>
                          <span className="mono" style={{ color: 'var(--fg-muted)', marginInlineEnd: 8 }}>{f.id}</span>
                          {f.title}
                        </span>
                        <span className="fp-cell-sub mono">{f.cve ?? f.source}</span>
                      </td>
                      <td>
                        <span className="fp-actor"><span className="fp-actor-ic"><TIcon size={13} /></span>{f.type}</span>
                      </td>
                      <td><Pill tone={sm.tone}>{sm.label}</Pill></td>
                      <td className="mono" style={{ color: 'var(--ember)' }}>{f.service}</td>
                      <td style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-sm)' }}>{f.source}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{f.owner}</td>
                      <td className="mono" style={{ textAlign: 'end', color: 'var(--fg-muted)' }}>{f.age}</td>
                      <td style={{ textAlign: 'end' }}>
                        <Pill tone={st.tone} dot live={f.status === 'triaging'}>{st.label}</Pill>
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
          <Icons.search size={18} />
          <span>No findings match this filter.</span>
        </div>
      )}
    </>
  );
}
