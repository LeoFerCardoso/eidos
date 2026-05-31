'use client';
import * as React from 'react';
import { Banner, CopyChip, HealthBadge, Icons, MOCKS, OwnerPill, RelativeTime, RingBar, Sparkline, StatusDot, Trend } from '@/ds/core';
import { FPageHeader, FSection, FShell, IconBubble } from './example-shell';
// Forge IDP — Example: Ring deployment console.

  
  
  
  
  
  const PEOPLE = MOCKS.PEOPLE || [];

  const releaseAuthor = PEOPLE.find(p => p.name && p.name.startsWith('Camila')) || PEOPLE[1];

  // Ring state — currently on ring 3
  const CURRENT = 3;
  const RINGS = [
    { label: 'Ring 0 · Internal',  audience: 'Forge employees',          percent: 100, status: 'done',    err: '0.04%', p95: '128ms', pods: 8,   slo: 'pass' },
    { label: 'Ring 1 · 1%',         audience: 'Synthetic + dogfood',     percent: 100, status: 'done',    err: '0.11%', p95: '134ms', pods: 12,  slo: 'pass' },
    { label: 'Ring 2 · 10%',        audience: 'Early access tier',       percent: 100, status: 'done',    err: '0.18%', p95: '141ms', pods: 24,  slo: 'pass' },
    { label: 'Ring 3 · 35%',        audience: 'Standard accounts BR-SE', percent: 100, status: 'running', err: '0.22%', p95: '146ms', pods: 86,  slo: 'pass' },
    { label: 'Ring 4 · 100%',       audience: 'Global production',       percent: 0,   status: 'pending', err: '—',     p95: '—',     pods: 0,   slo: '—'   },
  ];

  const GATES = [
    { name: 'Error rate',          target: '< 0.5%',   value: '0.22%',  status: 'pass' },
    { name: 'p95 latency',         target: '< 180ms',  value: '146ms',  status: 'pass' },
    { name: 'Saturation',          target: '< 70%',    value: '52%',    status: 'pass' },
    { name: 'Dependency health',   target: 'all green', value: 'green', status: 'pass' },
    { name: 'Synthetic checks',    target: '100% pass', value: '99.4%', status: 'warn' },
  ];

  const errSpark = [0.18, 0.20, 0.19, 0.21, 0.22, 0.21, 0.22];
  const latSpark = [142, 144, 143, 145, 146, 145, 146];
  const sloSpark = [99.92, 99.94, 99.95, 99.95, 99.97, 99.96, 99.97];

  const AUDIT = [
    { time: '14:42:18', who: 'forge-bot', action: 'Ring 3 promote · auto · health window 8m clean' },
    { time: '14:34:02', who: 'forge-bot', action: 'Ring 2 → 3 promotion approved by SLO gate' },
    { time: '14:33:51', who: 'Camila Tanaka', action: 'Acknowledged synthetic check flake on br-ne-1' },
    { time: '14:21:08', who: 'forge-bot', action: 'Ring 2 promote · auto · err 0.18% ✓' },
    { time: '14:08:44', who: 'forge-bot', action: 'Ring 1 promote · auto · canary clean' },
    { time: '13:54:11', who: 'forge-bot', action: 'Ring 0 deploy · v4.18.2 · 8 internal pods' },
    { time: '13:51:02', who: 'Camila Tanaka', action: 'Started rollout · auto-promote enabled' },
  ];

  const NOW = Date.now();

  const App = () => (
    <FShell
      nav="services"
      crumbs={[
        { label: 'Forge', href: '/example/ai-insights' },
        { label: 'Services', href: '/example/service-catalog' },
        { label: 'identity-svc', href: '/example/service-detail?id=identity-svc' },
        'Ring rollout',
      ]}
      >

      <FPageHeader
        eyebrow="Rollouts / Identity"
        title="identity-svc"
        status={<span className="pill ember">Ring rollout</span>}
        subtitle="Releasing v4.18.2 through 5 traffic rings. Auto-promote engages once each ring's error budget holds for the observation window."
        meta={
          <>
            <CopyChip value="v4.18.2" label="v4.18.2"/>
            <OwnerPill person={releaseAuthor} role="Release owner"/>
            <span className="chip">Started <RelativeTime value={new Date(NOW - 51 * 60 * 1000)}/></span>
            <span className="chip ok">4 of 5 rings complete</span>
            <span className="chip">auto-promote on</span>
          </>
        }
        actions={
          <>
            <button className="btn ghost" style={{color:'var(--danger)'}}><Icons.rollback size={13}/> Roll back</button>
            <button className="btn outline"><Icons.clock size={13}/> Pause auto-promote</button>
            <button className="btn ember"><Icons.arrowRight size={13}/> Promote Ring 4</button>
          </>
        }/>

      <Banner
        tone="info"
        icon="sparkle"
        title="Ring 3 of 5"
        message={<span>Currently at <strong style={{color:'var(--fg)'}}>35% traffic</strong>. If error budget holds, Forge will auto-promote to Ring 4 (100%) in <strong style={{color:'var(--ember)'}}>18 minutes</strong>.</span>}/>

      {/* Ring visualization */}
      <FSection title="Rings" style={{marginTop: 18}}>
        <div className="fp-card" style={{padding: '18px'}}>
          <RingBar rings={RINGS.map(r => ({
            label: r.label,
            audience: r.audience,
            percent: r.percent,
            status: r.status,
          }))} currentRing={CURRENT}/>

          {/* Per-ring telemetry */}
          <div style={{marginTop: 18, borderTop: '1px solid var(--border)', paddingTop: 14}}>
            <div className="tbl-wrap">
            <table className="tbl" style={{margin: 0}}>
              <thead>
                <tr>
                  <th>Ring</th>
                  <th>Traffic</th>
                  <th>Error rate</th>
                  <th>p95</th>
                  <th>SLO</th>
                  <th style={{textAlign: 'end'}}>Pods</th>
                </tr>
              </thead>
              <tbody>
                {RINGS.map((r, i) => {
                  const tone = i < CURRENT ? 'done' : i === CURRENT ? 'running' : 'pending';
                  return (
                    <tr key={r.label}>
                      <td>
                        <span style={{display:'inline-flex', alignItems:'center', gap: 8}}>
                          <StatusDot tone={tone} size="sm" pulse={tone === 'running'}/>
                          {r.label}
                        </span>
                      </td>
                      <td className="mono">{r.percent}%</td>
                      <td className="mono" style={{color: r.err === '—' ? 'var(--fg-faint)' : 'var(--fg)'}}>{r.err}</td>
                      <td className="mono" style={{color: r.p95 === '—' ? 'var(--fg-faint)' : 'var(--fg)'}}>{r.p95}</td>
                      <td>
                        {r.slo === 'pass'
                          ? <HealthBadge state="up" label="Pass"/>
                          : <span style={{color:'var(--fg-faint)'}}>—</span>}
                      </td>
                      <td className="mono" style={{textAlign:'end'}}>{r.pods || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </FSection>

      {/* 3-col bottom grid */}
      <div className="fp-grid fp-grid-3" style={{marginTop: 18, alignItems: 'start'}}>
        {/* Health gates */}
        <div className="fp-card">
          <div className="fp-card-head">
            <div className="fp-card-title">Health gates</div>
            <span style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>4 of 5 green</span>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap: 10}}>
            {GATES.map(g => {
              const tone = g.status === 'pass' ? 'done' : g.status === 'warn' ? 'pending' : 'error';
              const Icon = g.status === 'pass' ? Icons.check : g.status === 'warn' ? Icons.alert : Icons.x;
              const color = g.status === 'pass' ? 'var(--success)' : g.status === 'warn' ? 'var(--warning)' : 'var(--danger)';
              return (
                <div key={g.name} style={{display:'flex', alignItems:'center', gap: 10, padding: '8px 0', borderTop: '1px solid var(--border)'}}>
                  <span style={{color}}><Icon size={14}/></span>
                  <div style={{flex:1, minWidth: 0}}>
                    <div style={{fontSize: 'var(--text-sm)', fontWeight: 500}}>{g.name}</div>
                    <div style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>target {g.target}</div>
                  </div>
                  <span className="mono" style={{fontSize: 'var(--text-sm)', color}}>{g.value}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live metrics */}
        <div className="fp-card">
          <div className="fp-card-head">
            <div className="fp-card-title">Live metrics</div>
            <span style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>last 7 min</span>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap: 14}}>
            <div>
              <div style={{display:'flex', justifyContent:'space-between', fontSize: 'var(--text-sm)', color:'var(--fg-muted)'}}>
                <span>Error rate</span>
                <span className="mono" style={{color:'var(--success)'}}>0.22%</span>
              </div>
              <Sparkline data={errSpark} w={260} h={36} color="var(--success)"/>
            </div>
            <div>
              <div style={{display:'flex', justifyContent:'space-between', fontSize: 'var(--text-sm)', color:'var(--fg-muted)'}}>
                <span>p95 latency</span>
                <span className="mono">146ms</span>
              </div>
              <Sparkline data={latSpark} w={260} h={36} color="var(--ember)"/>
            </div>
            <div>
              <div style={{display:'flex', justifyContent:'space-between', fontSize: 'var(--text-sm)', color:'var(--fg-muted)'}}>
                <span>SLO compliance</span>
                <span className="mono" style={{color:'var(--success)'}}>99.97%</span>
              </div>
              <Sparkline data={sloSpark} w={260} h={36} color="var(--ice)"/>
            </div>
          </div>
        </div>

        {/* Audit log */}
        <div className="fp-card">
          <div className="fp-card-head">
            <div className="fp-card-title">Audit log</div>
            <button className="btn ghost sm"><Icons.auditLog size={11}/> Full log</button>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap: 6, fontSize: 'var(--text-sm)', maxHeight: 280, overflow:'auto'}}>
            {AUDIT.map((a, i) => (
              <div key={i} style={{display:'flex', gap: 10, padding: '6px 0', borderTop: i === 0 ? 'none' : '1px solid var(--border)'}}>
                <span className="mono" style={{color:'var(--fg-faint)', fontSize: 'var(--text-xs)', whiteSpace:'nowrap'}}>{a.time}</span>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>{a.who}</div>
                  <div style={{fontSize: 'var(--text-sm)', lineHeight: 1.4}}>{a.action}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FShell>
  );

  
  export default App;
