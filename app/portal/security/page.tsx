'use client';
// Forge - Security posture, triage, and autonomous AppSec (UC-3).
// §7.7 of docs/AGENTIC-PLATFORM-VISION.md: blast-radius lens, agent-opened MRs
// linked to Quality Gates, and a policy-judge section with sign-off affordances.
//
// Composes only Eidos DS + .fp-* classes. No per-page <style>.
import * as React from 'react';
import { Button, Icons, Pill, Select, Trend } from '@/ds/core';
import { FPageHeader, FSearch, FSection } from '@/portal/shell/portal-shell';
import { AiBanner } from '@/portal/shell/ai-pattern';
import {
  AI_READ,
  FINDINGS,
  JUDGE_KPIS,
  JUDGE_META,
  KPIS,
  MR_STATUS_META,
  BLAST_LABEL,
  BLAST_TONE,
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

type Tab = 'findings' | 'judge';

const totalOpen = openFindings.length || 1;

// One compact pill per finding; the qualifiers (PII / exposure / tier) live in
// a quiet mono sub-line so the row keeps a single height and a single voice.
function blastQualifiers(b: NonNullable<Finding['blastRadius']>): string {
  return [b.pii && 'PII', b.internetFacing && 'internet-facing', b.tier]
    .filter(Boolean)
    .join(' · ');
}

export default function SecurityPage() {
  const [query, setQuery] = React.useState('');
  const [type, setType] = React.useState('all');
  const [sev, setSev] = React.useState('all');
  const [tab, setTab] = React.useState<Tab>('findings');

  const filtered = React.useMemo(() => {
    let list = FINDINGS;
    if (type !== 'all') list = list.filter((f) => f.type === (type as FindingType));
    if (sev !== 'all') list = list.filter((f) => f.severity === (sev as Severity));
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (f) =>
          f.title.toLowerCase().includes(q) ||
          f.service.toLowerCase().includes(q) ||
          f.id.toLowerCase().includes(q) ||
          (f.cve ?? '').toLowerCase().includes(q) ||
          f.owner.toLowerCase().includes(q),
      );
    }
    return list;
  }, [query, type, sev]);

  // Findings that have a judge verdict: needs-sign-off and blocked first.
  const judged = React.useMemo(
    () =>
      FINDINGS.filter((f) => !!f.judge).sort((a, b) => {
        const order: Record<string, number> = {
          'needs-sign-off': 0,
          blocked: 1,
          'accepted-risk': 2,
          'auto-fixed': 3,
        };
        return (order[a.judge!.verdict] ?? 9) - (order[b.judge!.verdict] ?? 9);
      }),
    [],
  );

  const signOffCount = FINDINGS.filter((f) => f.judge?.verdict === 'needs-sign-off').length;

  return (
    <>
      <FPageHeader
        eyebrow="Security posture"
        title="Security"
        subtitle="Find and fix the bureau's active exposure, from vulnerabilities to deviations and live threats."
        actions={
          <>
            <Button variant="ghost"><Icons.download size={13} /> Export</Button>
            <Button variant="ember"><Icons.shield size={13} /> Run scan</Button>
          </>
        }
      />

      {/* Forge AI read: MR awaiting sign-off for the top RCE exposure. */}
      <AiBanner title={AI_READ.title} action="Review MR !2841">
        <span className="fp-aip-hl mono">SEC-2041</span> is a critical{' '}
        <span className="fp-aip-hl">RCE</span> (<span className="fp-aip-hl mono">CVE-2024-7254</span>) in{' '}
        <span className="fp-aip-hl mono">score-engine</span> (tier-0, 8 deps, PII, internet-facing). Sentinel
        opened MR <span className="fp-aip-hl mono">!2841</span>. Blast-radius guardrail escalated: one human
        sign-off required before merge.
      </AiBanner>

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
              <span
                key={s.severity}
                className="fp-segbar-seg"
                style={{ inlineSize: `${(s.count / totalOpen) * 100}%`, background: s.color }}
              />
            ))}
          </div>
          <ul className="fp-mix-legend">
            {SEVERITY_MIX.map((s) => (
              <li key={s.severity} className="fp-mix-item">
                <span className="fp-mix-key">
                  <span className="fp-mix-dot" style={{ background: s.color }} /> {s.label}
                </span>
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
            <span className="fp-posture-num mono">
              {POSTURE.score}
              <span className="fp-posture-den">/100</span>
            </span>
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

      {/* ── Tab bar ────────────────────────────────────────────────────────────── */}
      <div
        className="fp-tabs"
        role="tablist"
        aria-label="Security views"
        style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}
      >
        <button
          role="tab"
          aria-selected={tab === 'findings'}
          className={'fp-tab' + (tab === 'findings' ? ' is-active' : '')}
          onClick={() => setTab('findings')}
        >
          Findings
        </button>
        <button
          role="tab"
          aria-selected={tab === 'judge'}
          className={'fp-tab' + (tab === 'judge' ? ' is-active' : '')}
          onClick={() => setTab('judge')}
        >
          Policy judge{' '}
          {signOffCount > 0 && (
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                marginInlineStart: 6, minInlineSize: 18, blockSize: 18,
                borderRadius: 9, background: 'var(--warning-soft, color-mix(in oklch, var(--warning) 18%, transparent))',
                color: 'var(--warning)', fontSize: 11, fontWeight: 700,
                paddingInline: 4, fontVariantNumeric: 'tabular-nums',
              }}
              aria-label={`${signOffCount} awaiting sign-off`}
            >
              {signOffCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Findings tab ─────────────────────────────────────────────────────── */}
      {tab === 'findings' && (
        <>
          {/* Sub-toolbar for findings filters */}
          <div className="fp-toolbar" style={{ marginBlockStart: 0 }}>
            <div style={{ flex: 1, minWidth: 240, maxWidth: 420, display: 'flex' }}>
              <FSearch
                value={query}
                onChange={setQuery}
                placeholder="Search findings, CVE, service…"
                aria-label="Search findings"
                className="fluid"
              />
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
                      <th>Blast radius</th>
                      <th>Service</th>
                      <th>Remediation MR</th>
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
                        <tr
                          key={f.id}
                          className={
                            f.severity === 'critical' && (f.status === 'open' || f.status === 'triaging')
                              ? 'fp-row-flag'
                              : undefined
                          }
                        >
                          <td>
                            <span style={{ fontWeight: 600 }}>
                              <span className="mono" style={{ color: 'var(--fg-muted)', marginInlineEnd: 8 }}>{f.id}</span>
                              {f.title}
                            </span>
                            <span className="fp-cell-sub mono">{f.cve ?? f.source}</span>
                          </td>
                          <td>
                            <span className="fp-actor">
                              <span className="fp-actor-ic"><TIcon size={13} /></span>
                              {f.type}
                            </span>
                          </td>
                          <td><Pill tone={sm.tone}>{sm.label}</Pill></td>
                          <td>
                            {f.blastRadius ? (
                              <>
                                <Pill tone={BLAST_TONE[f.blastRadius.level]}>
                                  {BLAST_LABEL[f.blastRadius.level]}
                                  {f.blastRadius.dependents > 0
                                    ? ` · ${f.blastRadius.dependents} dep${f.blastRadius.dependents > 1 ? 's' : ''}`
                                    : ''}
                                </Pill>
                                {blastQualifiers(f.blastRadius) && (
                                  <span className="fp-cell-sub mono">{blastQualifiers(f.blastRadius)}</span>
                                )}
                              </>
                            ) : (
                              <span style={{ color: 'var(--fg-faint)', fontSize: 'var(--text-xs)' }}>--</span>
                            )}
                          </td>
                          <td className="mono" style={{ color: 'var(--fg-muted)' }}>{f.service}</td>
                          <td>
                            {f.remediation ? (
                              f.remediation.qualityGate ? (
                                <a
                                  href={`/portal/quality-gates/${f.remediation.qualityGate}`}
                                  style={{ textDecoration: 'none' }}
                                  aria-label={`Open Quality Gates for MR ${f.remediation.mr}`}
                                >
                                  <Pill tone={MR_STATUS_META[f.remediation.status].tone} dot>
                                    MR {f.remediation.mr} · {MR_STATUS_META[f.remediation.status].label}
                                  </Pill>
                                </a>
                              ) : (
                                <Pill tone={MR_STATUS_META[f.remediation.status].tone} dot>
                                  MR {f.remediation.mr} · {MR_STATUS_META[f.remediation.status].label}
                                </Pill>
                              )
                            ) : (
                              <span style={{ color: 'var(--fg-faint)', fontSize: 'var(--text-xs)' }}>--</span>
                            )}
                          </td>
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
      )}

      {/* ── Policy judge tab ─────────────────────────────────────────────────── */}
      {tab === 'judge' && (
        <div style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
          {/* Judge stats: an inline row, not a second KPI strip. The page already
              spends its KPI band above the tabs; three more 190px boxes for one
              digit each would push the actual decisions below the fold. */}
          <div
            style={{
              display: 'flex', alignItems: 'baseline', gap: 24, flexWrap: 'wrap',
              marginBlockEnd: 'var(--fp-section-gap, 18px)', paddingBlock: 2,
            }}
          >
            {JUDGE_KPIS.map((k) => (
              <span key={k.id} style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8 }} title={k.note}>
                <span className="mono" style={{ fontSize: 20, fontWeight: 600 }}>{k.value}</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>{k.label}</span>
              </span>
            ))}
          </div>

          <FSection title="Policy judge decisions">
            <div className="fp-card" style={{ padding: 0 }}>
              <div className="tbl-wrap">
                <table className="tbl" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Finding</th>
                      <th>Severity</th>
                      <th>Rule fired</th>
                      <th>Verdict</th>
                      <th>Decided by</th>
                      <th>Expiry</th>
                      <th style={{ textAlign: 'end' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {judged.map((f) => {
                      const jm = JUDGE_META[f.judge!.verdict];
                      const sm = SEV_META[f.severity];
                      const isSignOff = f.judge!.verdict === 'needs-sign-off';
                      return (
                        <tr key={f.id} className={isSignOff ? 'fp-row-flag' : undefined}>
                          <td>
                            <span style={{ fontWeight: 600 }}>
                              <span className="mono" style={{ color: 'var(--fg-muted)', marginInlineEnd: 8 }}>{f.id}</span>
                              {f.title}
                            </span>
                            <span className="fp-cell-sub mono">{f.service}</span>
                          </td>
                          <td><Pill tone={sm.tone}>{sm.label}</Pill></td>
                          <td>
                            <span
                              className="mono"
                              style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}
                            >
                              {f.judge!.rule}
                            </span>
                          </td>
                          <td>
                            <Pill tone={jm.tone}>{jm.label}</Pill>
                          </td>
                          <td>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                              {f.judge!.decidedBy === 'Sentinel' && (
                                <span
                                  style={{ color: 'var(--accent)', display: 'inline-flex', alignItems: 'center' }}
                                  aria-hidden="true"
                                >
                                  <Icons.zap size={11} />
                                </span>
                              )}
                              <span style={{ fontSize: 'var(--text-sm)' }}>
                                {f.judge!.decidedBy ?? '--'}
                              </span>
                            </span>
                          </td>
                          <td>
                            {f.judge!.expiry ? (
                              <span
                                className="mono"
                                style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}
                              >
                                {f.judge!.expiry}
                              </span>
                            ) : (
                              <span style={{ color: 'var(--fg-faint)', fontSize: 'var(--text-xs)' }}>--</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'end' }}>
                            {isSignOff ? (
                              <span style={{ display: 'inline-flex', gap: 6 }}>
                                <Button variant="ghost" size="sm">Deny</Button>
                                <Button variant="outline" size="sm">Approve</Button>
                              </span>
                            ) : (
                              <span style={{ color: 'var(--fg-faint)', fontSize: 'var(--text-xs)' }}>--</span>
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
        </div>
      )}
    </>
  );
}
