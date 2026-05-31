'use client';
import * as React from 'react';
import { Banner, CopyChip, HealthBadge, Icons, LogViewer, MOCKS, OwnerPill, Pipeline, RelativeTime, StatusDot, Tabs } from '@/ds/core';
import { FPageHeader, FShell } from './example-shell';
// Forge IDP — Example: Pipeline Console.
// Split-view operator console — pipeline runs list on the left, full live log
// of the selected run on the right, with status pipeline header + step list.

  
  
  
  
  const PEOPLE = MOCKS.PEOPLE || [];

  // --- Run list ------------------------------------------------------------
  const RUNS = [
    {
      id: 'run_8h2k9p',
      service: 'identity-svc',
      version: 'v4.18.2',
      sha: 'a91c4f0',
      status: 'running',
      author: 'Mariana Lopes',
      started: 6 * 60,
      stage: 'Deploy · canary',
      stepProgress: 4,
      stepTotal: 6,
    },
    {
      id: 'run_8h2k9n',
      service: 'fraud-engine',
      version: 'v2.7.0',
      sha: 'b21e88a',
      status: 'success',
      author: 'João Silveira',
      started: 28 * 60,
      stage: 'Done',
      stepProgress: 6,
      stepTotal: 6,
    },
    {
      id: 'run_8h2k9m',
      service: 'pix-router',
      version: 'v3.12.1',
      sha: '7e8af12',
      status: 'error',
      author: 'Rafa Castro',
      started: 41 * 60,
      stage: 'Failed · test',
      stepProgress: 3,
      stepTotal: 6,
    },
    {
      id: 'run_8h2k9l',
      service: 'kyc-orchestrator',
      version: 'v1.9.4',
      sha: '4d0b21e',
      status: 'success',
      author: 'Carla Reis',
      started: 95 * 60,
      stage: 'Done',
      stepProgress: 6,
      stepTotal: 6,
    },
    {
      id: 'run_8h2k9k',
      service: 'consent-vault',
      version: 'v0.4.1',
      sha: '9a2bf73',
      status: 'success',
      author: 'Ana Vargas',
      started: 140 * 60,
      stage: 'Done',
      stepProgress: 6,
      stepTotal: 6,
    },
    {
      id: 'run_8h2k9j',
      service: 'bureau-gateway',
      version: 'v5.2.0',
      sha: 'c012f8e',
      status: 'pending',
      author: 'João Silveira',
      started: 180 * 60,
      stage: 'Queued',
      stepProgress: 0,
      stepTotal: 6,
    },
  ];

  const STEPS = ['Build', 'Lint', 'Unit', 'Integ', 'Deploy', 'Smoke'];

  const peopleByName = (name) => PEOPLE.find(p => p.name === name) || PEOPLE[0];

  const STATUS_LABEL = {
    pending: 'Queued',
    running: 'Running',
    success: 'Success',
    error:   'Failed',
  };

  // --- Log stream ----------------------------------------------------------
  // Realistic forge-engine log for the selected run (run_8h2k9p · canary deploy).
  const RUN_LOG = [
    { time: '14:32:08.142', level: 'info', message: '$ forge deploy --service identity-svc --version v4.18.2 --stage canary' },
    { time: '14:32:08.234', level: 'info', message: 'Resolved deploy plan: 1 cluster, 1 region (us-east-1), strategy ring' },
    { time: '14:32:08.501', level: 'info', message: '[stage 1/6] build · pulling base image node:22-alpine ...' },
    { time: '14:32:11.873', level: 'info', message: '[stage 1/6] build · running pnpm install (lockfile a91c4f0)' },
    { time: '14:32:32.118', level: 'info', message: '[stage 1/6] build · pnpm done (24.3s) — 1247 packages' },
    { time: '14:32:33.504', level: 'info', message: '[stage 1/6] build · pnpm run build' },
    { time: '14:32:48.221', level: 'info', message: '[stage 1/6] build · OK (39.7s)' },
    { time: '14:32:48.402', level: 'info', message: '[stage 2/6] lint · eslint + prettier' },
    { time: '14:32:55.108', level: 'info', message: '[stage 2/6] lint · OK (6.7s) — 0 errors, 2 warnings' },
    { time: '14:32:55.401', level: 'info', message: '[stage 3/6] unit · jest --maxWorkers=4' },
    { time: '14:33:18.667', level: 'info', message: '[stage 3/6] unit · 248 passed, 0 failed, 0 skipped (23s)' },
    { time: '14:33:19.012', level: 'info', message: '[stage 4/6] integ · spinning up postgres + redis + kafka' },
    { time: '14:33:42.214', level: 'info', message: '[stage 4/6] integ · 38 passed, 0 failed (23s)' },
    { time: '14:33:42.512', level: 'info', message: '[stage 5/6] deploy · acquiring deploy lock for identity-svc' },
    { time: '14:33:42.804', level: 'info', message: '[stage 5/6] deploy · lock acquired (held 184ms)' },
    { time: '14:33:43.001', level: 'info', message: '[stage 5/6] deploy · scaling canary replica set to 1/1 (5% traffic)' },
    { time: '14:33:51.412', level: 'info', message: '[stage 5/6] deploy · canary pod ready · readinessProbe OK' },
    { time: '14:33:51.503', level: 'info', message: '[stage 5/6] deploy · routing 5% traffic to canary' },
    { time: '14:33:52.001', level: 'warn', message: '[stage 5/6] deploy · p95 latency spike — 312ms (threshold 200ms)' },
    { time: '14:33:55.224', level: 'info', message: '[stage 5/6] deploy · p95 latency normalised — 148ms' },
    { time: '14:34:12.012', level: 'info', message: '[stage 5/6] deploy · canary bake @ 5% for 5 minutes …' },
    { time: '14:38:51.405', level: 'info', message: '[stage 5/6] deploy · bake clean · 0 errors over 5m window' },
    { time: '14:38:51.602', level: 'info', message: '[stage 5/6] deploy · promoting to 25% traffic' },
    { time: '14:38:52.018', level: 'info', message: '[stage 5/6] deploy · scaling canary to 4/4 replicas' },
    { time: '14:39:01.226', level: 'info', message: '[stage 5/6] deploy · 25% slice healthy' },
    { time: '14:39:01.512', level: 'info', message: '[stage 5/6] deploy · canary bake @ 25% for 5 minutes …' },
    { time: '14:44:04.117', level: 'info', message: '[stage 5/6] deploy · bake clean · 0 errors over 5m window' },
    { time: '14:44:04.301', level: 'info', message: '[stage 5/6] deploy · promoting to 100% traffic …' },
    { time: '14:44:05.014', level: 'info', message: '[stage 5/6] deploy · 100% complete · canary retired' },
    { time: '14:44:05.221', level: 'info', message: '[stage 5/6] deploy · OK (10m23s)' },
    { time: '14:44:05.402', level: 'info', message: '[stage 6/6] smoke · running 14 prod-safe assertions' },
    { time: '14:44:18.001', level: 'info', message: '[stage 6/6] smoke · running …' },
  ];

  const fmtElapsed = (s) => {
    if (s < 60) return s + 's ago';
    if (s < 3600) return Math.floor(s / 60) + 'm ago';
    return Math.floor(s / 3600) + 'h ' + Math.floor((s % 3600) / 60) + 'm ago';
  };

  const RunRow = ({ run, selected, onClick }) => {
    const tone = run.status === 'running' ? 'running' : run.status === 'success' ? 'done' : run.status === 'error' ? 'error' : 'pending';
    return (
      <button onClick={onClick}
        style={{
          textAlign:'start', width:'100%', border: 'none', cursor:'pointer',
          padding: '12px 14px',
          background: selected ? 'color-mix(in oklch, var(--ember) 6%, var(--surface))' : 'transparent',
          borderInlineStart: '3px solid ' + (selected ? 'var(--ember)' : 'transparent'),
          borderBottom: '1px solid var(--border)',
          color:'var(--fg)', display:'flex', flexDirection:'column', gap: 6,
        }}>
        <div style={{display:'flex', alignItems:'center', gap: 8}}>
          <StatusDot tone={tone} size="sm" pulse={tone === 'running'}/>
          <span style={{fontWeight: 600, fontSize: 'var(--text-base)'}}>{run.service}</span>
          <span style={{marginInlineStart:'auto', fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>{run.version}</span>
        </div>
        <div style={{display:'flex', alignItems:'center', gap: 8, fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>
          <span className="mono">{run.id}</span>
          <span>·</span>
          <span>{run.stage}</span>
        </div>
        <div style={{display:'flex', alignItems:'center', gap: 8}}>
          <OwnerPill person={peopleByName(run.author)}/>
          <span style={{marginInlineStart:'auto', fontSize: 'var(--text-xs)', color:'var(--fg-muted)', fontFamily:'var(--font-mono)'}}>{fmtElapsed(run.started)}</span>
        </div>
        {/* Mini step strip */}
        <div style={{display:'flex', gap: 3, marginTop: 4}}>
          {STEPS.map((_, i) => (
            <span key={i} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: i < run.stepProgress ? 'var(--success)' :
                          i === run.stepProgress && tone === 'running' ? 'var(--status-running)' :
                          i === run.stepProgress && tone === 'error' ? 'var(--status-error)' :
                          'var(--border)',
            }}/>
          ))}
        </div>
      </button>
    );
  };

  const App = () => {
    const [selectedId, setSelectedId] = React.useState('run_8h2k9p');
    const [tab, setTab] = React.useState('logs');
    const [filter, setFilter] = React.useState('all');

    const selected = RUNS.find(r => r.id === selectedId) || RUNS[0];
    const person = peopleByName(selected.author);

    const filteredLog = filter === 'all' ? RUN_LOG :
                        filter === 'errors' ? RUN_LOG.filter(l => l.level === 'error' || l.level === 'warn') :
                        RUN_LOG.filter(l => l.level === filter);

    return (
      <FShell
        nav="pipelines"
        crumbs={[{ label: 'Forge', href: '/example/ai-insights' }, 'Pipelines', 'Console']}>

        <FPageHeader
          title="Pipeline console"
          subtitle="Live operator view — every run, every step, every log line."
          actions={
            <>
              <button className="btn ghost"><Icons.refresh size={13}/> Refresh</button>
              <button className="btn ghost"><Icons.filter size={13}/> Filter</button>
              <button className="btn ember"><Icons.play size={13}/> Trigger run</button>
            </>
          }/>

        {/* === Split panel ====================================================== */}
        <div style={{
          display:'grid', gridTemplateColumns:'380px 1fr', gap: 0,
          background:'var(--surface)', border:'1px solid var(--border)', borderRadius: 'var(--radius-xl)',
          overflow:'hidden', minHeight: 640, marginTop: 18,
        }}>

          {/* --- LEFT: runs list --- */}
          <aside style={{borderInlineEnd:'1px solid var(--border)', display:'flex', flexDirection:'column'}}>
            <div style={{padding:'12px 14px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap: 8, background:'var(--bg-elevated)'}}>
              <Icons.pipeline size={14} style={{color:'var(--ember)'}}/>
              <span style={{fontSize: 'var(--text-base)', fontWeight: 600}}>Recent runs</span>
              <span className="pill" style={{marginInlineStart:'auto', fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)'}}>{RUNS.length}</span>
            </div>
            <div style={{padding:'8px 10px', borderBottom:'1px solid var(--border)'}}>
              <div className="in-group" style={{display:'flex', alignItems:'center', gap: 8, padding:'6px 10px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius: 'var(--radius-xl)'}}>
                <Icons.search size={12} style={{color:'var(--fg-muted)'}}/>
                <input
                  style={{border:'none', outline:'none', background:'transparent', flex: 1, color:'var(--fg)', fontSize: 'var(--text-sm)'}}
                  placeholder="Search runs by service, sha, author..."/>
              </div>
            </div>
            <div style={{overflowY:'auto', flex: 1}}>
              {RUNS.map(r => (
                <RunRow key={r.id} run={r}
                  selected={r.id === selectedId}
                  onClick={() => setSelectedId(r.id)}/>
              ))}
            </div>
          </aside>

          {/* --- RIGHT: run detail + log --- */}
          <main style={{display:'flex', flexDirection:'column', minHeight: 0}}>
            {/* Run header */}
            <header style={{padding:'16px 20px', borderBottom:'1px solid var(--border)', background:'var(--bg-elevated)'}}>
              <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 8, flexWrap:'wrap'}}>
                {selected.status === 'running' && <span className="pill status-running"><StatusDot tone="running" size="sm" pulse/> Running</span>}
                {selected.status === 'success' && <span className="pill status-done"><StatusDot tone="done" size="sm"/> Success</span>}
                {selected.status === 'error' && <span className="pill status-error"><StatusDot tone="error" size="sm"/> Failed</span>}
                {selected.status === 'pending' && <span className="pill status-pending"><StatusDot tone="pending" size="sm"/> Queued</span>}
                <span style={{fontSize: 'var(--text-lg)', fontWeight: 600, letterSpacing:'-0.01em'}}>{selected.service}</span>
                <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-sm)', color:'var(--fg-muted)'}}>{selected.version}</span>
                <CopyChip value={selected.sha} label={selected.sha}/>
                <span style={{marginInlineStart:'auto', display:'flex', alignItems:'center', gap: 8}}>
                  <a className="btn ghost sm" href="/example/pipeline-view" title="Open full pipeline view"><Icons.maximize size={12}/> Full view</a>
                  <button className="btn ghost sm" title="Cancel run"><Icons.x size={12}/> Cancel</button>
                  <button className="btn ghost sm"><Icons.refresh size={12}/> Re-run</button>
                  <button className="btn ghost sm"><Icons.share size={12}/></button>
                </span>
              </div>
              {/* Step strip — use the shared Pipeline primitive (variant=chevron)
                  to match pipeline-view and centralise step semantics. */}
              <div style={{marginTop: 4}}>
                <Pipeline
                  variant="chevron"
                  steps={STEPS.map((s, i) => {
                    const done    = i < selected.stepProgress;
                    const current = i === selected.stepProgress && selected.status === 'running';
                    const failed  = i === selected.stepProgress && selected.status === 'error';
                    return {
                      id: s,
                      label: s,
                      status: done ? 'done' : failed ? 'error' : current ? 'running' : 'pending',
                    };
                  })}/>
              </div>
              <div style={{display:'flex', alignItems:'center', gap: 14, marginTop: 14, fontSize: 'var(--text-sm)', color:'var(--fg-muted)'}}>
                <span style={{display:'flex', alignItems:'center', gap: 6}}><Icons.user size={11}/> <OwnerPill person={person}/></span>
                <span style={{display:'flex', alignItems:'center', gap: 6}}><Icons.clock size={11}/> started <RelativeTime value={new Date(Date.now() - selected.started * 1000)}/></span>
                <span style={{display:'flex', alignItems:'center', gap: 6}}><Icons.commit size={11}/> sha <CopyChip value={selected.sha} label={selected.sha}/></span>
              </div>
            </header>

            {/* Tabs */}
            <div style={{display:'flex', gap: 0, padding: '0 20px', borderBottom:'1px solid var(--border)', background:'var(--bg)'}}>
              {[
                { id: 'logs',     label: 'Logs',     count: RUN_LOG.length },
                { id: 'artifacts', label: 'Artifacts', count: 4 },
                { id: 'tests',    label: 'Tests',    count: 286 },
                { id: 'env',      label: 'Env',      count: null },
              ].map(t => (
                <button key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    padding:'10px 16px', border:'none', background:'transparent',
                    color: tab === t.id ? 'var(--fg)' : 'var(--fg-muted)',
                    borderBottom: '2px solid ' + (tab === t.id ? 'var(--ember)' : 'transparent'),
                    fontSize: 'var(--text-sm)', fontWeight: 600, cursor:'pointer', marginTop: -1,
                  }}>
                  {t.label}{t.count !== null && <span className="pill" style={{marginInlineStart: 6, fontSize: 'var(--text-xs)', padding:'0 6px'}}>{t.count}</span>}
                </button>
              ))}
              {/* Log filter chips on the right */}
              {tab === 'logs' && (
                <div style={{marginInlineStart:'auto', display:'flex', alignItems:'center', gap: 6, padding:'6px 0'}}>
                  {['all', 'info', 'warn', 'errors'].map(f => (
                    <button key={f}
                      onClick={() => setFilter(f)}
                      className={'pill ' + (filter === f ? 'ember' : '')}
                      style={{cursor:'pointer', border:'none', fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)'}}>
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tab content */}
            {tab === 'logs' && (
              <div style={{flex: 1, padding: 14, background:'var(--bg)', overflow:'hidden', display:'flex', flexDirection:'column'}}>
                <LogViewer
                  variant="expanded"
                  lines={filteredLog}
                  height={460}
                  follow={selected.status === 'running'}/>
                {selected.status === 'running' && (
                  <div style={{marginTop: 10, padding:'8px 12px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius: 'var(--radius-xl)', display:'flex', alignItems:'center', gap: 8, fontSize: 'var(--text-sm)', color:'var(--fg-muted)'}}>
                    <StatusDot tone="running" size="sm" pulse/>
                    <span>Streaming · auto-scroll on</span>
                    <span style={{marginInlineStart:'auto', fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)'}}>{RUN_LOG.length} lines</span>
                  </div>
                )}
              </div>
            )}

            {tab === 'artifacts' && (
              <div style={{flex: 1, padding: 20, background:'var(--bg)'}}>
                {[
                  ['identity-svc.image', 'docker · 142.3 MB', 'sha256:8f4...'],
                  ['build.tar.gz',       'source bundle · 6.1 MB', '↓ download'],
                  ['junit.xml',          'test report · 84 KB',    '↓ download'],
                  ['coverage.html',      'coverage · 2.4 MB',      '↓ download'],
                ].map(([name, meta, action]) => (
                  <div key={name} style={{display:'flex', alignItems:'center', gap: 14, padding:'12px 14px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius: 'var(--radius-2xl)', marginBottom: 8}}>
                    <Icons.package size={16} style={{color:'var(--ember)'}}/>
                    <div>
                      <div style={{fontWeight: 600, fontSize: 'var(--text-base)'}}>{name}</div>
                      <div style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)', fontFamily:'var(--font-mono)'}}>{meta}</div>
                    </div>
                    <span style={{marginInlineStart:'auto', fontSize: 'var(--text-sm)', color:'var(--ember)', fontFamily:'var(--font-mono)', cursor:'pointer'}}>{action}</span>
                  </div>
                ))}
              </div>
            )}

            {tab === 'tests' && (
              <div style={{flex: 1, padding: 20, background:'var(--bg)'}}>
                <Banner
                  tone="success"
                  icon="check"
                  title="286 of 286 tests passed"
                  message="248 unit + 38 integration. 0 flakes detected over the last 30 runs."/>
              </div>
            )}

            {tab === 'env' && (
              <div style={{flex: 1, padding: 20, background:'var(--bg)'}}>
                <div className="fp-card" style={{padding: 18, marginBottom: 0}}>
                  <div className="fp-card-title" style={{marginBottom: 12}}>Effective environment</div>
                  <div style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-sm)', color:'var(--fg-muted)', lineHeight: 1.7}}>
                    NODE_ENV=production<br/>
                    DEPLOY_STAGE=canary<br/>
                    AWS_REGION=us-east-1<br/>
                    DATADOG_API_KEY=•••••••••••<br/>
                    POSTGRES_HOST=prod-db.internal<br/>
                    REDIS_HOST=prod-redis.internal<br/>
                    FEATURE_FLAGS_ENDPOINT=https://flags.forge.local<br/>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </FShell>
    );
  };

  
  export default App;
