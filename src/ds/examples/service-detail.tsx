'use client';
import * as React from 'react';
import { Avatar, Banner, CopyChip, HealthBadge, Icons, LangBadge, MOCKS, OwnerPill, Pipeline, RelativeTime, SeverityPill, Sparkline, StatusDot, Tabs, TierBadge, Timeline, Trend } from '@/ds/core';
import { FKpi, FPageHeader, FSection, FShell, IconBubble, useQueryParam } from './example-shell';
// Eidos IDP — Example: Service detail (Backstage-style entity page).

  
  
  
  
  
  const SERVICES = MOCKS.SERVICES || [];
  const PEOPLE = MOCKS.PEOPLE || [];

  // Read ?id= from the URL so service-catalog row clicks land on the right
  // entity. Falls back to identity-svc when missing or unknown.
  const q = useQueryParam();
  const requestedId = q('id');
  const svc = (requestedId && SERVICES.find(s => s.id === requestedId))
           || SERVICES.find(s => s.id === 'identity-svc')
           || SERVICES[0]
           || {
    id: 'identity-svc', name: 'identity-svc', tier: 'T1', lang: 'TypeScript',
    tribe: 'Identity', alert: false, coverage: 87.4, p95: 142, version: '4.18.2',
    deploys: '2m ago',
  };

  const owner = PEOPLE.find(p => p.role && p.role.includes(svc.tribe)) || PEOPLE[1] || PEOPLE[0];
  const onCall = PEOPLE.find(p => p.role && p.role.includes('SRE')) || PEOPLE[7] || PEOPLE[0];

  const TABS = ['Overview', 'Deploys', 'SLOs', 'Dependencies', 'Runbooks', 'Settings'];

  // Spark data: 24h latency proxy
  const latencySpark = (() => {
    const base = svc.p95 || 120;
    const arr = [];
    for (let n = 0; n < 24; n++) {
      const drift = Math.sin(n / 3) * (base * 0.16);
      arr.push(Math.max(20, Math.round(base + drift)));
    }
    return arr;
  })();
  const deploySpark = [2, 1, 3, 4, 2, 5, 7];
  const leadSpark = [3.2, 2.8, 2.5, 2.4, 2.1, 1.9, 1.8];
  const cfrSpark = [12, 10, 11, 9, 8, 7, 6];
  const mttrSpark = [42, 38, 36, 32, 30, 28, 26];

  const NOW = Date.now();
  const ago = (mins) => new Date(NOW - mins * 60 * 1000);

  const TIMELINE = [
    {
      id: 'ev1',
      icon: 'deploy',
      tone: 'done',
      title: <>Deploy <span style={{fontFamily:'var(--font-mono)', color:'var(--ember)'}}>v{svc.version}</span> promoted to Ring 4</>,
      meta: 'Canary clean — auto-promoted by Eidos gates',
      at: ago(2),
    },
    {
      id: 'ev2',
      icon: 'gitPullRequest',
      tone: 'done',
      title: <>PR #7418 merged · biometric step-up for high-risk auth</>,
      meta: 'Camila Tanaka · Risk score 52 · +0.9% coverage',
      at: ago(120),
    },
    {
      id: 'ev3',
      icon: 'alert',
      tone: 'error',
      title: <>P2 alert · p95 latency above SLO for 4 minutes</>,
      meta: 'Auto-recovered after circuit-breaker tripped on bureau-gateway',
      at: ago(360),
    },
    {
      id: 'ev4',
      icon: 'user',
      tone: 'default',
      title: <>On-call rotation handed off</>,
      meta: 'Larissa Fontana → Camila Tanaka',
      at: ago(720),
    },
    {
      id: 'ev5',
      icon: 'shield',
      tone: 'done',
      title: <>Security scan completed — 0 criticals, 2 lows triaged</>,
      meta: 'Trivy + CodeQL · scan id sec-9482',
      at: ago(1440),
    },
  ];

  const INCIDENTS = [
    { id: 'INC-1192', level: 'p2', title: 'Latency spike during bureau-gateway failover', when: ago(360), commander: PEOPLE[1] },
    { id: 'INC-1184', level: 'p3', title: 'Stale session cache in eu-west-1', when: ago(2880), commander: PEOPLE[7] },
    { id: 'INC-1177', level: 'p1', title: 'Signing key rotation paged on-call', when: ago(11520), commander: PEOPLE[1] },
  ];

  const SLOS = [
    { name: 'Availability', target: '99.95%', current: '99.97%', spark: [99.92, 99.95, 99.96, 99.95, 99.97, 99.96, 99.97] },
    { name: 'p95 latency', target: '< 180ms', current: svc.p95 + 'ms', spark: latencySpark.slice(-12) },
    { name: 'Error rate', target: '< 0.5%', current: '0.21%', spark: [0.4, 0.3, 0.5, 0.2, 0.2, 0.3, 0.21] },
  ];

  const App = () => {
    const [active, setActive] = React.useState('Overview');
    return (
      <FShell
        nav="services"
        crumbs={[
          { label: 'Eidos', href: '/example/ai-insights' },
          { label: 'Catalog', href: '/example/service-catalog' },
          'Services',
          svc.name,
        ]}
        onAgentChat={() => { window.location.href = '/example/agent-chat?service=' + svc.id; }}>

        <FPageHeader
          eyebrow={`Catalog / ${svc.tribe} tribe`}
          title={svc.name}
          status={
            <>
              <TierBadge tier={svc.tier}/>
              <HealthBadge state={svc.alert ? 'degraded' : 'up'} pulse={svc.alert}/>
            </>
          }
          subtitle={`${svc.lang} service. Owned by the ${svc.tribe} tribe.`}
          meta={
            <>
              <CopyChip value={`git@eidos:${svc.tribe.toLowerCase()}/${svc.id}`} label={`eidos/${svc.tribe.toLowerCase()}/${svc.id}`}/>
              <span className="chip">v{svc.version}</span>
              <span className="chip">{svc.lang}</span>
              <span className="chip ok">p95 {svc.p95}ms</span>
              <span className="chip">SLO 99.95%</span>
              <span className="chip">last deploy {svc.deploys}</span>
            </>
          }
          actions={
            <>
              <a className="btn ghost" href={'/example/pipeline-view?service=' + svc.id}><Icons.terminal size={13}/> Console</a>
              <a className="btn outline" href="/example/ring-deployment"><Icons.ring size={13}/> Rollout</a>
              <a className="btn ember" href={'/example/pipeline-view?service=' + svc.id}><Icons.deploy size={13}/> Deploy</a>
            </>
          }/>

        {/* Tabs */}
        <div className="fp-tabs">
          {TABS.map(t => (
            <button key={t}
                    className={'fp-tab' + (active === t ? ' is-active' : '')}
                    onClick={() => setActive(t)}>
              {t}
            </button>
          ))}
        </div>

        {/* Body grid */}
        <div className="fp-grid fp-grid-2x1" style={{alignItems:'start'}}>
          {/* MAIN */}
          <div style={{display:'flex', flexDirection:'column', gap: 18}}>
            <Banner
              tone="success"
              icon="shield"
              title="Trusted"
              message="All quality gates green · ADR conformance 100% · 0 security findings open."/>

            <div className="fp-grid fp-grid-4">
              <FKpi
                label="Deploys · 7d"
                value="7"
                sub={<Sparkline data={deploySpark} w={160} h={28}/>}
                trendNode={<Trend delta={16} unit="%"/>}/>
              <FKpi
                label="Lead time"
                value="1.8h"
                sub={<Sparkline data={leadSpark} w={160} h={28} color="var(--success)"/>}
                trendNode={<Trend delta={-21} unit="%" inverted/>}/>
              <FKpi
                label="Change-fail rate"
                value="6%"
                sub={<Sparkline data={cfrSpark} w={160} h={28} color="var(--warning)"/>}
                trendNode={<Trend delta={-2} unit="pp" inverted/>}/>
              <FKpi
                label="MTTR"
                value="26m"
                sub={<Sparkline data={mttrSpark} w={160} h={28} color="var(--ice)"/>}
                trendNode={<Trend delta={-13} unit="%" inverted/>}/>
            </div>

            <FSection title="Activity">
              <div className="fp-card">
                <Timeline items={TIMELINE}/>
              </div>
            </FSection>
          </div>

          {/* ASIDE */}
          <div style={{display:'flex', flexDirection:'column', gap: 14}}>
            {/* On-call */}
            <div className="fp-card">
              <div className="fp-card-head">
                <div className="fp-card-title">On-call · primary</div>
                <button className="btn ghost sm"><Icons.refresh size={11}/> Rotate</button>
              </div>
              <div style={{display:'flex', alignItems:'center', gap: 12, padding: '4px 0 10px'}}>
                <Avatar p={onCall} size={36} ember/>
                <div style={{flex:1, minWidth: 0}}>
                  <div style={{fontWeight: 600, fontSize: 'var(--text-base)'}}>{onCall.name}</div>
                  <div style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)'}}>{onCall.role}</div>
                </div>
                <button className="btn ghost sm" title="Page on-call"><Icons.bell size={12}/> Page</button>
              </div>
              <div style={{borderTop:'1px solid var(--border)', paddingTop: 10, display:'flex', justifyContent:'space-between', fontSize: 'var(--text-sm)', color:'var(--fg-muted)'}}>
                <span>Shift ends</span>
                <span><RelativeTime value={new Date(NOW + 6 * 3600 * 1000)}/></span>
              </div>
            </div>

            {/* SLO summary */}
            <div className="fp-card">
              <div className="fp-card-head">
                <div className="fp-card-title">SLO summary</div>
                <span className="pill health-up"><StatusDot tone="up" size="sm"/> All passing</span>
              </div>
              <div className="tbl-wrap">
              <table className="tbl" style={{margin: 0}}>
                <thead>
                  <tr><th>Indicator</th><th>Target</th><th style={{textAlign:'end'}}>Current</th><th style={{textAlign:'end'}}>Trend</th></tr>
                </thead>
                <tbody>
                  {SLOS.map(s => (
                    <tr key={s.name}>
                      <td>{s.name}</td>
                      <td className="mono" style={{color:'var(--fg-muted)'}}>{s.target}</td>
                      <td className="mono" style={{textAlign:'end'}}>{s.current}</td>
                      <td style={{textAlign:'end'}}><Sparkline data={s.spark} w={70} h={22} color="var(--success)"/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>

            {/* Recent incidents */}
            <div className="fp-card">
              <div className="fp-card-head">
                <div className="fp-card-title">Recent incidents</div>
                <a href="/example/incident-room" className="ds-link-inline" style={{fontSize: 'var(--text-sm)'}}>View all</a>
              </div>
              <div style={{display:'flex', flexDirection:'column', gap: 10}}>
                {INCIDENTS.map(inc => (
                  <a key={inc.id}
                     href="/example/incident-room"
                     style={{display:'flex', alignItems:'center', gap: 10, padding: '8px 0', borderTop:'1px solid var(--border)', textDecoration:'none', color:'inherit'}}>
                    <SeverityPill level={inc.level as any}/>
                    <div style={{flex:1, minWidth: 0}}>
                      <div style={{fontSize: 'var(--text-base)', fontWeight: 500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{inc.title}</div>
                      <div style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)', display:'flex', gap: 6}}>
                        <span className="mono">{inc.id}</span>
                        <span>·</span>
                        <RelativeTime value={inc.when}/>
                        <span>·</span>
                        <span>commander {inc.commander.initials}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FShell>
    );
  };

  
  export default App;
