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
import { STATUS_META, getIncident, type Responder } from '@/portal/data/incidents';

const ROLE_TONE: Record<Responder['role'], 'ember' | 'neutral'> = {
  Commander: 'ember',
  IC: 'neutral',
  Comms: 'neutral',
  Responder: 'neutral',
};

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
      <Button variant="ghost"><Icons.doc size={13} /> Postmortem</Button>
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
        eyebrow={`Incidents · ${inc.service}`}
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
            <span className="fp-meta-chip"><Icons.clock size={12} /> Started {inc.started}</span>
            <span className="fp-meta-chip"><Icons.server size={12} /> {inc.servicesAffected} services</span>
            <span className="fp-meta-chip"><Icons.user size={12} /> {inc.customers} customers</span>
            <span className="fp-meta-chip"><Icons.globe size={12} /> {inc.region}</span>
          </div>
        }
        actions={actions}
      />

      {inc.ai ? (
        <AiBanner title={inc.ai.title} action={inc.suspectedDeploy ? 'View deploy' : undefined}>{inc.ai.body}</AiBanner>
      ) : resolved ? (
        <Banner tone="success" icon="check" title="Resolved" message={`${inc.title} was resolved in ${inc.duration}. A postmortem is attached.`} />
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
