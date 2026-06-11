'use client';
// Forge — Incident war room (/portal/incidents/[id]). The single place to run
// an incident: severity + live status, the timeline, impact, responders,
// suggested runbooks, and the suspected deploy. Forge AI's correlation (probable
// cause + the safe move) is woven in at the top, not bolted on as a chat box.
//
// Brief — Persona: Incident Commander / on-call. Question: what is happening,
// what caused it, who is on it, and what do I run now? Data: getIncident
// (src/portal/data/incidents.ts). Primary action: resolve / page / run a
// runbook. Distinctive move: the AI correlation linking the alert to the deploy
// that caused it, with the lowest-risk mitigation named.
import * as React from 'react';
import Link from 'next/link';
import {
  Avatar,
  Banner,
  Button,
  CopyChip,
  HealthBadge,
  Icons,
  Pill,
  SeverityPill,
  StatusDot,
  Timeline,
} from '@/ds/core';
import { FPageHeader, FSection, usePageCrumb } from '@/portal/shell/portal-shell';
import { AiBanner } from '@/portal/shell/ai-pattern';
import { SOURCE_META, STATUS_META, getIncident, type Diagnosis, type Evidence, type Responder } from '@/portal/data/incidents';

const ROLE_TONE: Record<Responder['role'], 'ember' | 'neutral'> = {
  Commander: 'ember',
  IC: 'neutral',
  Comms: 'neutral',
  Responder: 'neutral',
};

const EVIDENCE_ICON: Record<Evidence['kind'], keyof typeof Icons> = {
  deploy: 'deploy',
  pr: 'gitPullRequest',
  'dep-edge': 'gitFork',
  runbook: 'folder',
  metric: 'activity',
};

const BLAST_TONE = {
  high: 'severity-p1',
  medium: 'severity-p2',
  low: 'neutral',
} as const satisfies Record<Diagnosis['remediation']['blastRadius'], string>;

/** §7.6 — the self-heal-incident run, seen from the war room: the agent's
 *  root-cause hypothesis with evidence, and its remediation behind a guardrail. */
function DiagnosisPanel({ d, resolved }: { d: Diagnosis; resolved: boolean }) {
  const r = d.remediation;
  const awaiting = r.state === 'awaiting-approval' && !resolved;
  return (
    <div className="fp-card" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
      <div className="fp-card-head">
        <div className="fp-card-title" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Icons.bot size={13} /> Agent diagnosis · {d.agent}
        </div>
        <span className="fp-card-meta mono">confidence {Math.round(d.confidence * 100)}%</span>
      </div>

      <p style={{ margin: 0, fontSize: 'var(--text-sm)', lineHeight: 1.55, color: 'var(--fg)' }}>{d.hypothesis}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBlockStart: 12 }}>
        {d.evidence.map((e) => {
          const Ic = Icons[EVIDENCE_ICON[e.kind]];
          return (
            <span
              key={e.label}
              className="fp-meta-chip mono"
              style={{ whiteSpace: 'nowrap', paddingBlock: 4, paddingInline: 10 }}
            >
              <Ic size={11} /> {e.label}
            </span>
          );
        })}
      </div>

      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
          marginBlockStart: 14, paddingBlockStart: 12, borderBlockStart: '1px solid var(--border)',
        }}
      >
        <span style={{ color: 'var(--fg-faint)', display: 'inline-flex' }}><Icons.gate size={14} /></span>
        <div style={{ flex: 1, minInlineSize: 220 }}>
          <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{r.summary}</div>
          <span className="fp-cell-sub">
            <Link href={`/portal/actions/${r.action}`} className="u-link-quiet mono">{r.action}</Link>
            {' · '}guardrail: {r.gate}{' · '}{r.blastNote}
          </span>
        </div>
        <Pill tone={BLAST_TONE[r.blastRadius]}>blast {r.blastRadius}</Pill>
        {awaiting ? (
          <span style={{ display: 'inline-flex', gap: 8 }}>
            <Button variant="outline" size="sm"><Icons.check size={11} /> Approve &amp; run</Button>
            <Button variant="ghost" size="sm">Deny</Button>
          </span>
        ) : (
          <Pill tone="status-done">{r.state === 'auto-applied' ? 'auto-applied' : r.state}</Pill>
        )}
      </div>

      {/* Quiet provenance link: ember on this card belongs to the decision
          (Approve & run), not to navigation. */}
      <div style={{ marginBlockStart: 10 }}>
        <Link href={`/portal/workflows/${d.workflow}`} className="u-link-quiet" style={{ fontSize: 'var(--text-xs)' }}>
          Part of workflow <span className="mono">{d.workflow}</span> · view runs
        </Link>
      </div>
    </div>
  );
}

export default function IncidentRoom({ id }: { id: string }) {
  const inc = getIncident(id);
  const { setCrumb } = usePageCrumb();

  React.useEffect(() => {
    if (inc) setCrumb({ label: inc.id, replace: true });
    return () => setCrumb(null);
  }, [inc, setCrumb]);

  if (!inc) {
    return (
      <div className="fp-empty" style={{ marginBlockStart: 24 }}>
        <StatusDot tone="error" />
        <span>
          Incident <span className="mono">{id}</span> not found.{' '}
          <Link href="/portal/incidents" className="u-link">Back to Incidents</Link>
        </span>
      </div>
    );
  }

  const st = STATUS_META[inc.status];
  const resolved = inc.status === 'resolved';

  const actions = resolved ? (
    <>
      <Button variant="ghost" asChild>
        <Link href={`/portal/incidents/${inc.id}/postmortem`}><Icons.doc size={13} /> Postmortem</Link>
      </Button>
      <Button variant="outline"><Icons.refresh size={13} /> Reopen</Button>
    </>
  ) : (
    <>
      <Button variant="ghost"><Icons.refresh size={13} /> Update status</Button>
      <Button variant="outline"><Icons.bell size={13} /> Page on-call</Button>
      <Button variant="ember"><Icons.check size={13} /> Resolve</Button>
    </>
  );

  return (
    <>
      <FPageHeader
        back={{ href: '/portal/incidents', label: 'Incidents' }}
        title={`${inc.id} · ${inc.title}`}
        status={
          <>
            <SeverityPill level={inc.severity} />
            <Pill tone={st.tone} dot live={st.live}>{st.label}</Pill>
          </>
        }
        subtitle={inc.summary}
        meta={
          <div className="fp-meta">
            {(() => {
              const src = SOURCE_META[inc.source.kind];
              const SrcIcon = Icons[src.icon as keyof typeof Icons];
              return (
                <span className="fp-meta-chip" title={inc.source.detail}>
                  <SrcIcon size={12} /> {src.label} · {inc.source.detail}
                </span>
              );
            })()}
            {inc.paging && (
              <span className="fp-meta-chip" title={`Rotation ${inc.paging.rotation}`}>
                <Icons.bell size={12} /> {inc.paging.rotation} · acked in {inc.paging.ackedIn}
                {inc.paging.escalations > 0 ? ` · ${inc.paging.escalations} escalation` : ''}
              </span>
            )}
            <span className="fp-meta-chip"><Icons.clock size={12} /> Started {inc.started}</span>
            {/* Impact merged into one chip: 7 chips wrapped into a ragged two-line
                band; 4 keep the header scannable. */}
            <span className="fp-meta-chip">
              <Icons.server size={12} /> {inc.servicesAffected} services · {inc.customers} customers · {inc.region}
            </span>
          </div>
        }
        actions={actions}
      />

      {inc.diagnosis ? (
        <DiagnosisPanel d={inc.diagnosis} resolved={resolved} />
      ) : inc.ai ? (
        <AiBanner title={inc.ai.title} action={inc.suspectedDeploy ? 'View deploy' : undefined}>{inc.ai.body}</AiBanner>
      ) : resolved ? (
        <Banner
          tone="success"
          icon="check"
          title="Resolved"
          message={`${inc.title} was resolved in ${inc.duration}.${inc.postmortem ? ` A ${inc.postmortem.status} postmortem is attached.` : ''}`}
        />
      ) : null}

      {/* War-room KPIs */}
      <div className="fp-grid fp-grid-4">
        <div className="fp-kpi">
          <span className="label">Duration</span>
          <div className="value">{inc.duration}</div>
          <p className="fp-kpi-note">{resolved ? 'Time to restore.' : `Started ${inc.started}.`}</p>
        </div>
        <div className="fp-kpi">
          <span className="label">Affected services</span>
          <div className="value">{inc.servicesAffected}</div>
          <p className="fp-kpi-note">{inc.affected.map((a) => a.svc).join(' · ')}</p>
        </div>
        <div className="fp-kpi">
          <span className="label">Affected customers</span>
          <div className="value">{inc.customers}</div>
          <p className="fp-kpi-note">Concentrated in {inc.region}.</p>
        </div>
        <div className="fp-kpi">
          <span className="label">{resolved ? 'Severity' : 'TTR target'}</span>
          <div className="value" style={{ color: resolved ? undefined : 'var(--ember)' }}>
            {resolved ? inc.severity.toUpperCase() : inc.ttrTarget}
          </div>
          <p className="fp-kpi-note">{resolved ? 'Final severity.' : `Error budget: ${inc.budgetLeft} left.`}</p>
        </div>
      </div>

      <div className="fp-grid fp-grid-2x1" style={{ alignItems: 'start', marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        {/* MAIN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Icons.clock size={13} /> Timeline · {inc.timeline.length} events
              </div>
              <Button variant="ghost" size="sm"><Icons.download size={11} /> Export</Button>
            </div>
            <Timeline items={inc.timeline} />
          </div>

          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title">Impact</div>
              <Pill tone="neutral">{inc.servicesAffected} services · {inc.customers} customers</Pill>
            </div>
            <div className="tbl-wrap">
              <table className="tbl" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Customers</th>
                    <th>Region</th>
                    <th style={{ textAlign: 'end' }}>Health</th>
                  </tr>
                </thead>
                <tbody>
                  {inc.affected.map((a) => (
                    <tr key={a.svc}>
                      <td className="mono" style={{ color: 'var(--ember)' }}>{a.svc}</td>
                      <td className="mono">{a.customers}</td>
                      <td style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-sm)' }}>{a.region}</td>
                      <td style={{ textAlign: 'end' }}>
                        <HealthBadge state={a.state} pulse={a.state !== 'up'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ASIDE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title">Responders</div>
              <span className="fp-card-meta">{inc.responders.length} engaged</span>
            </div>
            <ul className="fp-resp">
              {inc.responders.map((r) => (
                <li key={r.person.name} className="fp-resp-row">
                  <Avatar p={r.person} size={28} ember={r.role === 'Commander'} />
                  <div className="fp-resp-id">
                    <span className="fp-resp-name">{r.person.name}</span>
                    <span className="fp-resp-role">{r.person.role}</span>
                  </div>
                  <Pill tone={ROLE_TONE[r.role]}>{r.role}</Pill>
                </li>
              ))}
            </ul>
          </div>

          {inc.suspectedDeploy && (
            <div className="fp-card">
              <div className="fp-card-head">
                <div className="fp-card-title" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <Icons.deploy size={13} /> Suspected deploy
                </div>
                <Pill tone="severity-p1" icon={<Icons.alert size={10} />}>high</Pill>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                  <span className="mono">{inc.suspectedDeploy.id}</span>
                  <span style={{ color: 'var(--fg-faint)' }}>·</span>
                  <span className="mono" style={{ color: 'var(--ember)' }}>{inc.suspectedDeploy.service}</span>
                  <span style={{ color: 'var(--fg-faint)' }}>·</span>
                  <span className="mono" style={{ color: 'var(--fg-muted)' }}>{inc.suspectedDeploy.version}</span>
                </div>
                <CopyChip value={`git@eidos:${inc.suspectedDeploy.service}@${inc.suspectedDeploy.sha}`} label={inc.suspectedDeploy.sha} />
                <Button variant="ghost" size="sm" asChild style={{ alignSelf: 'flex-start' }}>
                  <Link href="/portal/pipelines"><Icons.pipeline size={11} /> Open in pipeline</Link>
                </Button>
              </div>
            </div>
          )}

          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Icons.runbook size={13} /> Suggested runbooks
              </div>
              <Pill tone="ember">{inc.runbooks.length} matched</Pill>
            </div>
            <ul className="fp-rb">
              {inc.runbooks.map((rb) => (
                <li key={rb.id} className="fp-rb-row">
                  <span className="fp-rb-ic"><Icons.folder size={13} /></span>
                  <div className="fp-rb-id">
                    <span className="fp-rb-name">{rb.title}</span>
                    <span className="fp-rb-meta mono">{rb.success}% success · {rb.runs} runs · last {rb.last}</span>
                  </div>
                  {!resolved && (
                    <Button variant="outline" size="sm"><Icons.play size={11} /> Run</Button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
