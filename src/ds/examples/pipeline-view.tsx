'use client';
import * as React from 'react';
import { Avatar, Banner, CopyChip, HealthBadge, Icons, LogViewer, MOCKS, OwnerPill, Pipeline, RelativeTime, StatusDot } from '@/ds/core';
import { FPageHeader, FSection, FShell, IconBubble } from './example-shell';
// Eidos IDP — Example: Pipeline / deploy run view.

  
  
  
  
  
  const PEOPLE = MOCKS.PEOPLE || [];

  const author = PEOPLE.find(p => p.name && p.name.startsWith('Camila')) || PEOPLE[1];
  const approver1 = PEOPLE.find(p => p.name && p.name.startsWith('Thiago')) || PEOPLE[4];
  const approver2 = PEOPLE.find(p => p.name && p.name.startsWith('Leonardo')) || PEOPLE[0];

  const STAGES = [
    { id: 'build', label: 'Build', status: 'done', meta: '42s' },
    { id: 'test', label: 'Test', status: 'done', meta: '2m 14s · 4,182 tests' },
    { id: 'sast', label: 'SAST', status: 'done', meta: '0 criticals' },
    { id: 'risk', label: 'Risk gate', status: 'done', meta: 'score 38 · low' },
    { id: 'canary', label: 'Canary', status: 'running', meta: 'ring 1 · 42%' },
    { id: 'ring', label: 'Ring 2 → 4', status: 'pending', meta: '—' },
  ];

  const NOW = Date.now();
  const t = (sec) => {
    const d = new Date(NOW - sec * 1000);
    return d.toTimeString().slice(0, 8);
  };

  const LINES = [
    { id: 1, time: t(240), level: 'info', message: '→ forge-runner v4.18.2 acquired token for identity-svc' },
    { id: 2, time: t(238), level: 'info', message: 'Cloning git@forge:identity/identity-svc.git @ refs/heads/main' },
    { id: 3, time: t(231), level: 'debug', message: 'commit f7a1c2b — Camila Tanaka — feat: biometric step-up for high-risk auth' },
    { id: 4, time: t(225), level: 'info', message: 'Starting build · target=node20 · arch=arm64' },
    { id: 5, time: t(199), level: 'info', message: 'Build complete · artifact identity-svc-4.18.2.tgz (28.4 MiB)' },
    { id: 6, time: t(198), level: 'info', message: 'Running test suite: 4,182 specs in 6 workers' },
    { id: 7, time: t(124), level: 'warn', message: '  test/auth/biometric.spec.ts — slow test took 1.8s (threshold 1.0s)' },
    { id: 8, time: t(94), level: 'info', message: 'Tests passed: 4,182 / 4,182 · coverage 87.4% (Δ +0.9pp)' },
    { id: 9, time: t(82), level: 'info', message: 'SAST · trivy + codeql scan starting' },
    { id: 10, time: t(56), level: 'info', message: 'SAST done · 0 criticals · 2 low (allowlisted)' },
    { id: 11, time: t(52), level: 'info', message: 'Risk gate · score 38/100 · verdict: low · blast radius Ring 0→2' },
    { id: 12, time: t(40), level: 'info', message: '✓ All quality gates green — proceeding to canary' },
    { id: 13, time: t(38), level: 'info', message: 'Canary: deploying to ring 0 (internal · 8 pods)' },
    { id: 14, time: t(12), level: 'info', message: 'Canary: shifting 1% of production traffic to v4.18.2' },
    { id: 15, time: t(2), level: 'debug', message: 'Health window: error rate 0.18% · p95 138ms · within SLO' },
  ];

  const ARTIFACTS = [
    { name: 'identity-svc-4.18.2.tgz', kind: 'package', size: '28.4 MiB' },
    { name: 'sbom.spdx.json', kind: 'compliance', size: '184 KiB' },
    { name: 'coverage/lcov.info', kind: 'doc', size: '912 KiB' },
    { name: 'trivy-report.json', kind: 'shield', size: '46 KiB' },
  ];

  const App = () => (
    <FShell
      nav="pipelines"
      crumbs={[
        { label: 'Eidos', href: '/example/ai-insights' },
        { label: 'Pipelines', href: '/example/pipeline-console' },
        'identity-svc',
        '#9384',
      ]}
      >

      <FPageHeader
        eyebrow="Pipeline / Identity"
        title="Deploy run #9384"
        status={<span className="pill ember"><StatusDot tone="running" size="sm" pulse/> Running</span>}
        subtitle="Promoting identity-svc v4.18.2 from staging to production. Canary observation window opens at Ring 2."
        meta={
          <>
            <CopyChip value="git@forge:identity/identity-svc@f7a1c2b" label="f7a1c2b"/>
            <OwnerPill person={author} role="Identity"/>
            <span className="chip">Started <RelativeTime value={new Date(NOW - 4 * 60 * 1000)}/></span>
            <span className="chip ok">→ production</span>
          </>
        }
        actions={
          <>
            <button className="btn ghost" style={{color:'var(--danger)'}}><Icons.x size={13}/> Cancel</button>
            <button className="btn outline"><Icons.refresh size={13}/> Retry from here</button>
            <button className="btn ember"><Icons.deploy size={13}/> Promote</button>
          </>
        }/>

      <Banner
        tone="info"
        icon="sparkle"
        title="Eidos auto-promote enabled"
        message="If canary health holds for 8 more minutes, this run will promote to Ring 2 automatically. No human gate required at this risk score."/>

      {/* Stage strip */}
      <FSection title="Stages" style={{marginTop: 18}}>
        <div className="fp-card" style={{padding: '18px 16px'}}>
          <Pipeline variant="chevron" steps={STAGES}/>
        </div>
      </FSection>

      {/* Body 2:1 */}
      <div className="fp-grid fp-grid-2x1" style={{alignItems:'start', marginTop: 18}}>
        {/* MAIN — Logs */}
        <div className="fp-card" style={{padding: 0}}>
          <div className="fp-card-head" style={{padding: '12px 14px', borderBottom: '1px solid var(--border)'}}>
            <div className="fp-card-title" style={{display:'inline-flex', alignItems:'center', gap: 8}}>
              <Icons.terminal size={13}/> Logs · canary
            </div>
            <div style={{display:'inline-flex', gap: 6}}>
              <button className="btn ghost sm"><Icons.download size={11}/> Download</button>
              <button className="btn ghost sm"><Icons.copy size={11}/> Copy</button>
              <button className="btn ghost sm"><Icons.maximize size={11}/></button>
            </div>
          </div>
          <LogViewer lines={LINES} variant="filterable" height={460}/>
        </div>

        {/* ASIDE */}
        <div style={{display:'flex', flexDirection:'column', gap: 14}}>
          {/* Run summary */}
          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title">Run summary</div>
              <HealthBadge state="up" label="Healthy"/>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap: 8, fontSize: 'var(--text-sm)'}}>
              <div style={{display:'flex', justifyContent:'space-between'}}><span style={{color:'var(--fg-muted)'}}>Trigger</span><span>Push to <span className="mono" style={{color:'var(--ember)'}}>main</span></span></div>
              <div style={{display:'flex', justifyContent:'space-between'}}><span style={{color:'var(--fg-muted)'}}>Commit</span><span className="mono">f7a1c2b</span></div>
              <div style={{display:'flex', justifyContent:'space-between'}}><span style={{color:'var(--fg-muted)'}}>Risk score</span><span className="mono" style={{color:'var(--success)'}}>38 · low</span></div>
              <div style={{display:'flex', justifyContent:'space-between'}}><span style={{color:'var(--fg-muted)'}}>Coverage Δ</span><span className="mono" style={{color:'var(--success)'}}>+0.9pp</span></div>
              <div style={{display:'flex', justifyContent:'space-between'}}><span style={{color:'var(--fg-muted)'}}>Blast radius</span><span>Ring 0 → 2</span></div>
              <div style={{display:'flex', justifyContent:'space-between'}}><span style={{color:'var(--fg-muted)'}}>Region</span><span>br-se-1 · br-ne-1</span></div>
              <div style={{display:'flex', justifyContent:'space-between'}}><span style={{color:'var(--fg-muted)'}}>Pods</span><span className="mono">42 / 42</span></div>
            </div>
          </div>

          {/* Approvers */}
          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title">Approvers</div>
              <span style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>2 of 2 required</span>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap: 10}}>
              <div style={{display:'flex', alignItems:'center', gap: 10}}>
                <Avatar p={approver1} size={26}/>
                <div style={{flex:1, minWidth: 0}}>
                  <div style={{fontSize: 'var(--text-sm)', fontWeight: 500}}>{approver1.name}</div>
                  <div style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>{approver1.role}</div>
                </div>
                <span className="pill status-done"><StatusDot tone="done" size="sm"/> Approved</span>
              </div>
              <div style={{display:'flex', alignItems:'center', gap: 10}}>
                <Avatar p={approver2} size={26}/>
                <div style={{flex:1, minWidth: 0}}>
                  <div style={{fontSize: 'var(--text-sm)', fontWeight: 500}}>{approver2.name}</div>
                  <div style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>{approver2.role}</div>
                </div>
                <span className="pill status-done"><StatusDot tone="done" size="sm"/> Approved</span>
              </div>
            </div>
          </div>

          {/* Artifacts */}
          <div className="fp-card">
            <div className="fp-card-head">
              <div className="fp-card-title">Artifacts</div>
              <button className="btn ghost sm"><Icons.download size={11}/> All</button>
            </div>
            <div style={{display:'flex', flexDirection:'column'}}>
              {ARTIFACTS.map((a, i) => {
                const Icon = Icons[a.kind] || Icons.file;
                return (
                  <div key={i} style={{display:'flex', alignItems:'center', gap: 10, padding: '8px 0', borderTop: i === 0 ? 'none' : '1px solid var(--border)'}}>
                    <span style={{color:'var(--fg-muted)'}}><Icon size={13}/></span>
                    <span style={{flex:1, fontSize: 'var(--text-sm)', fontFamily:'var(--font-mono)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{a.name}</span>
                    <span style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)', fontFamily:'var(--font-mono)'}}>{a.size}</span>
                    <button className="btn ghost sm"><Icons.download size={11}/></button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </FShell>
  );

  
  export default App;
