'use client';
import * as React from 'react';
import { Avatar, Banner, CopyChip, HealthBadge, Icons, MOCKS, OwnerPill, RelativeTime, SeverityPill, StatusDot, Timeline } from '@/ds/core';
import { FKpi, FPageHeader, FSection, FShell, IconBubble } from './example-shell';
// Eidos IDP — Example: Incident war-room (P1 active incident).

  
  
  
  
  
  const PEOPLE = MOCKS.PEOPLE || [];
  const RUNBOOKS = MOCKS.RUNBOOKS || [];

  const NOW = Date.now();
  const at = (mins) => new Date(NOW - mins * 60 * 1000);

  const personByPrefix = (prefix) =>
    PEOPLE.find(p => p.name && p.name.startsWith(prefix)) || PEOPLE[0];

  const commander = personByPrefix('Rafael');
  const ic        = personByPrefix('Larissa');
  const comms     = personByPrefix('Mariana');
  const deployAuthor = personByPrefix('Rafael');

  const TIMELINE = [
    { id: 't1', title: 'Alert fired · pix-router p95 > 600ms',
      meta: 'Prometheus rule "pix-router-p95-sustained" · severity P1',
      at: at(14), icon: 'alert', tone: 'error' },
    { id: 't2', title: 'PagerDuty paged on-call tier-1 (Pix)',
      meta: 'Auto-escalation after 90s no-ack',
      at: at(13), icon: 'bell', tone: 'pending' },
    { id: 't3', title: 'Rafael Mendonça acknowledged page',
      meta: 'Acked from mobile · ETA at console < 60s',
      at: at(12), person: commander, tone: 'running' },
    { id: 't4', title: 'War-room opened in Slack #inc-1247',
      meta: 'comms · runbooks · responders pinned',
      at: at(11), icon: 'inbox', tone: 'pending' },
    { id: 't5', title: 'Status page updated — investigating',
      meta: 'Public message · BR-pix · "We are investigating elevated latency"',
      at: at(9), icon: 'globe', tone: 'pending' },
    { id: 't6', title: 'Root cause suspected — deploy D-9182 (v2.7.0)',
      meta: '3x fan-out to bureau-gateway · auto-scaler 2m behind demand',
      at: at(6), icon: 'sparkle', tone: 'running' },
    { id: 't7', title: 'Mitigation: rollback to v2.6.9 initiated',
      meta: 'Runbook rb-pix-rollback · automated · ETA 2m',
      at: at(3), icon: 'rollback', tone: 'running' },
    { id: 't8', title: 'Canary observed — p95 dropping (612ms → 188ms)',
      meta: 'Continuing to monitor for the next 4 minutes',
      at: at(1), icon: 'pulse', tone: 'running' },
  ];

  const AFFECTED = [
    { svc: 'pix-router', customers: '~8.2k', region: 'br-se-1', state: 'degraded' },
    { svc: 'bureau-gateway', customers: '~3.1k', region: 'br-se-1', state: 'degraded' },
    { svc: 'ledger-svc', customers: '~720', region: 'br-se-1 / br-ne-1', state: 'up' },
  ];

  const SLACK = [
    { who: commander, when: '12m ago', text: "I see it. p95 is hitting 612ms across br-se-1. We deployed v2.7.0 14 min ago — that's the prime suspect. Rolling forward debug logs to confirm." },
    { who: ic, when: '8m ago', text: 'SLO error budget for pix-router is at 38%. We have headroom for one more soft mitigation before paging cap-room.' },
    { who: comms, when: '4m ago', text: "Status page updated. I'll post a customer-facing update at the 30-min mark unless mitigated by then." },
  ];

  const SUGGESTED_RUNBOOKS = RUNBOOKS.filter(r => r.id === 'rb-pix-rollback' || r.id === 'rb-pix-circuit' || r.id === 'rb-bureau-failover').slice(0, 3);

  const App = () => (
    <FShell
      nav="incidents"
      crumbs={[
        { label: 'Eidos', href: '/example/ai-insights' },
        'Incidents',
        'INC-1247',
      ]}>

      <FPageHeader
        eyebrow="Incidents / Pix"
        title="INC-1247 — pix-router p95 spike"
        status={
          <>
            <SeverityPill level="p1"/>
            <span className="pill status-running"><StatusDot tone="running" size="sm" pulse/> Mitigating</span>
          </>
        }
        subtitle="Sustained p95 above 600ms across br-se-1. Three services impacted while rollback to v2.6.9 is in flight."
        meta={
          <>
            <span className="chip">Started <RelativeTime value={at(14)}/></span>
            <span className="chip">3 services</span>
            <span className="chip">~12k customers</span>
            <span className="chip">br-se-1</span>
          </>
        }
        actions={
          <>
            <button className="btn ghost"><Icons.refresh size={13}/> Update status</button>
            <button className="btn outline" style={{color:'var(--ember)'}}><Icons.bell size={13}/> Page on-call</button>
            <button className="btn ember"><Icons.check size={13}/> Resolve</button>
          </>
        }/>

      <Banner
        tone="warning"
        icon="flame"
        title="Mitigation in progress"
        message="Rollback to v2.6.9 underway — ETA 2 min. p95 trending down from 612ms to 188ms. Hold comms until canary observation window closes."/>

      <div className="fp-grid fp-grid-4" style={{marginTop: 18}}>
        <FKpi label="Duration" value="14m"
              sub={<span style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>Started <RelativeTime value={at(14)}/></span>}/>
        <FKpi label="Affected services" value="3"
              sub={<span style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>pix-router · bureau-gateway · ledger-svc</span>}/>
        <FKpi label="Affected customers" value="~12k"
              sub={<span style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>Concentrated in br-se-1</span>}/>
        <FKpi label="TTR target"
              value={<span><span style={{color:'var(--ember)'}}>16m</span><span style={{fontSize: 'var(--text-md)', color:'var(--fg-muted)', fontWeight: 500}}> / 30m</span></span>}
              sub={<span style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>SLO budget: 38% remaining</span>}/>
      </div>

      <div className="fp-grid fp-grid-2x1" style={{alignItems:'start', marginTop: 18, gap: 18}}>
        {/* MAIN COLUMN */}
        <div style={{display:'flex', flexDirection:'column', gap: 14}}>
          {/* Active page card */}
          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title" style={{display:'inline-flex', alignItems:'center', gap: 8, color:'var(--danger)'}}>
                <Icons.alert size={13}/> Active alert
              </div>
              <span className="pill severity-p1"><Icons.alert size={10}/> firing · 14m</span>
            </div>
            <div style={{fontWeight: 600, fontSize: 'var(--text-md)'}}>pix-router · p95 sustained &gt; 600ms across br-se-1</div>
            <p style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.55, marginTop: 8, marginBottom: 12}}>
              Prometheus rule <span className="mono" style={{color:'var(--ember)'}}>pix-router-p95-sustained</span> fired
              after p95 latency held above 600ms for 90 consecutive seconds in <span className="mono">br-se-1</span>.
              Error budget burn rate is <span className="mono" style={{color:'var(--warning)'}}>4.2× normal</span>.
            </p>
            <div style={{display:'flex', gap: 8, flexWrap:'wrap'}}>
              <a className="btn ghost sm" href="#"><Icons.lineChart size={11}/> Open Grafana dashboard</a>
              <a className="btn ghost sm" href="#"><Icons.bell size={11}/> Open alert in PagerDuty</a>
              <a className="btn ghost sm" href="#"><Icons.file size={11}/> Snooze for 1h</a>
            </div>
          </div>

          {/* Timeline */}
          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title" style={{display:'inline-flex', alignItems:'center', gap: 8}}>
                <Icons.clock size={13}/> Timeline · 8 events
              </div>
              <button className="btn ghost sm"><Icons.download size={11}/> Export</button>
            </div>
            <Timeline items={TIMELINE}/>
          </div>

          {/* Impact */}
          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title">Impact</div>
              <span className="pill neutral">3 services · ~12k customers</span>
            </div>
            <div className="tbl-wrap">
              <table className="tbl" style={{margin: 0}}>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Customers</th>
                    <th>Region</th>
                    <th style={{textAlign:'end'}}>Health</th>
                  </tr>
                </thead>
                <tbody>
                  {AFFECTED.map((a) => (
                    <tr key={a.svc}>
                      <td className="mono" style={{color:'var(--ember)'}}>{a.svc}</td>
                      <td className="mono">{a.customers}</td>
                      <td style={{color:'var(--fg-muted)', fontSize: 'var(--text-sm)'}}>{a.region}</td>
                      <td style={{textAlign:'end'}}><HealthBadge state={a.state as any} pulse={a.state === 'degraded'}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ASIDE */}
        <div style={{display:'flex', flexDirection:'column', gap: 14}}>
          {/* Responders */}
          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title">Responders</div>
              <span style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>3 engaged</span>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap: 12}}>
              <div style={{display:'flex', alignItems:'center', gap: 10}}>
                <Avatar p={commander} size={28} ember/>
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{fontSize: 'var(--text-base)', fontWeight: 600}}>{commander.name}</div>
                  <div style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>{commander.role}</div>
                </div>
                <span className="pill ember">Commander</span>
              </div>
              <div style={{display:'flex', alignItems:'center', gap: 10}}>
                <Avatar p={ic} size={28}/>
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{fontSize: 'var(--text-base)', fontWeight: 600}}>{ic.name}</div>
                  <div style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>{ic.role}</div>
                </div>
                <span className="pill neutral">IC</span>
              </div>
              <div style={{display:'flex', alignItems:'center', gap: 10}}>
                <Avatar p={comms} size={28}/>
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{fontSize: 'var(--text-base)', fontWeight: 600}}>{comms.name}</div>
                  <div style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>{comms.role}</div>
                </div>
                <span className="pill neutral">Comms</span>
              </div>
            </div>
          </div>

          {/* Comms */}
          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title" style={{display:'inline-flex', alignItems:'center', gap: 8}}>
                <Icons.inbox size={13}/> Slack · #inc-1247
              </div>
              <a href="#" className="btn ghost sm"><Icons.share size={11}/> Open</a>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap: 12}}>
              {SLACK.map((m, i) => (
                <div key={i} style={{display:'flex', alignItems:'flex-start', gap: 10}}>
                  <Avatar p={m.who} size={26}/>
                  <div style={{flex: 1, minWidth: 0}}>
                    <div style={{display:'flex', alignItems:'baseline', gap: 8}}>
                      <span style={{fontWeight: 600, fontSize: 'var(--text-sm)'}}>{m.who.name}</span>
                      <span style={{fontSize: 'var(--text-xs)', color:'var(--fg-faint)'}}>{m.when}</span>
                    </div>
                    <div style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', lineHeight: 1.5, marginTop: 2}}>{m.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Linked deploy */}
          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title" style={{display:'inline-flex', alignItems:'center', gap: 8}}>
                <Icons.deploy size={13}/> Suspected deploy
              </div>
              <span className="pill severity-p1"><Icons.alert size={10}/> high suspicion</span>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap: 8}}>
              <div style={{display:'flex', alignItems:'center', gap: 8, fontWeight: 600, fontSize: 'var(--text-base)'}}>
                <span className="mono">D-9182</span>
                <span style={{color:'var(--fg-faint)'}}>·</span>
                <span className="mono" style={{color:'var(--ember)'}}>pix-router</span>
                <span style={{color:'var(--fg-faint)'}}>·</span>
                <span className="mono" style={{color:'var(--fg-muted)'}}>v2.7.0</span>
              </div>
              <div style={{display:'flex', alignItems:'center', gap: 8, flexWrap:'wrap', fontSize: 'var(--text-sm)', color:'var(--fg-muted)'}}>
                Started <RelativeTime value={at(14)}/> by <OwnerPill person={deployAuthor} role="Pix"/>
              </div>
              <CopyChip value="git@forge:pix/pix-router@a91f2dc" label="a91f2dc"/>
              <a href="/example/pipeline-view" className="btn ghost sm" style={{alignSelf:'flex-start', marginTop: 4}}>
                <Icons.pipeline size={11}/> Open in pipeline
              </a>
            </div>
          </div>

          {/* Runbooks */}
          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title" style={{display:'inline-flex', alignItems:'center', gap: 8}}>
                <Icons.runbook size={13}/> Suggested runbooks
              </div>
              <span className="pill ember">3 matched</span>
            </div>
            <div style={{display:'flex', flexDirection:'column'}}>
              {SUGGESTED_RUNBOOKS.map((r, i) => (
                <div key={r.id} style={{
                  display:'flex', alignItems:'center', gap: 10,
                  padding: '10px 0',
                  borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                }}>
                  <span style={{color:'var(--fg-muted)'}}><Icons.folder size={13}/></span>
                  <div style={{flex: 1, minWidth: 0}}>
                    <div style={{fontSize: 'var(--text-sm)', fontWeight: 600}}>{r.title}</div>
                    <div style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>
                      <span className="mono">{r.success}% success</span> · {r.executions} runs · last <RelativeTime value={new Date(NOW - 24 * 3600 * 1000)}/>
                    </div>
                  </div>
                  <button className="btn outline sm"><Icons.play size={11}/> Run</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FShell>
  );

  
  export default App;
