'use client';
import * as React from 'react';
import { Banner, Code, CopyChip, HealthBadge, Icons, MOCKS, OwnerPill, Pipeline, StatusDot } from '@/ds/core';
import { FPageHeader, FSection, FShell, useQueryParam } from './example-shell';
// Forge IDP — Example: Service Scaffold wizard.
// Multi-step flow for spinning up a new service from a Forge template:
// 1. Template   → choose a scaffold
// 2. Repository → name + visibility + owners
// 3. CI / CD    → pipeline + ring strategy
// 4. Observability → SLO targets + dashboards
// 5. Review     → diff of generated artifacts + ship

  
  
  
  
  const PEOPLE: any[] = MOCKS.PEOPLE || [];

  const STEPS = [
    { id: 'template', label: 'Template',      desc: 'Pick a scaffold' },
    { id: 'repo',     label: 'Repository',    desc: 'Code & owners' },
    { id: 'cicd',     label: 'CI / CD',       desc: 'Pipeline & rings' },
    { id: 'observ',   label: 'Observability', desc: 'SLO & dashboards' },
    { id: 'review',   label: 'Review',        desc: 'Confirm and scaffold' },
  ];

  const TEMPLATES = [
    {
      id: 'typescript-api', tier: 'T1',
      title: 'TypeScript HTTP service',
      desc: 'Fastify · Zod · drizzle-orm · Postgres. Gold standard for new HTTP services. SLO templates + dashboards included.',
      lang: 'TypeScript', stack: ['Node 22', 'Fastify', 'Postgres'], featured: true,
    },
    {
      id: 'python-worker', tier: 'T2',
      title: 'Python async worker',
      desc: 'Async consumer for SQS + Kafka. Built-in dead-letter + retry policy. Ideal for ETL and webhooks.',
      lang: 'Python', stack: ['Python 3.13', 'aiokafka', 'arq'],
    },
    {
      id: 'go-grpc', tier: 'T1',
      title: 'Go gRPC service',
      desc: 'Bi-di streaming. mTLS by default. Health endpoint wired to your service registry.',
      lang: 'Go', stack: ['Go 1.23', 'gRPC', 'OpenTelemetry'],
    },
    {
      id: 'rust-router', tier: 'T1',
      title: 'Rust edge router',
      desc: 'For latency-sensitive routing. Custom; talk to platform-eng before scaffolding.',
      lang: 'Rust', stack: ['Rust 1.79', 'axum', 'tokio'], warning: true,
    },
  ];

  const App = () => {
    // Pre-select from ?template= when it matches a known scaffold id. The gallery
    // and the wizard maintain independent template lists (gallery is curated
    // marketing, wizard is the canonical 4 scaffolds); we only pick up an exact
    // hit so deep-links from agent-catalog still work without surprising mismatches.
    const q = useQueryParam ? useQueryParam() : () => null;
    const requested = q('template');
    const initialTemplate = TEMPLATES.find(t => t.id === requested) ? requested : 'typescript-api';

    const [step, setStep] = React.useState('template');
    const [template, setTemplate] = React.useState(initialTemplate);
    const [repoName, setRepoName] = React.useState('payments-receipts');
    const [visibility, setVisibility] = React.useState('internal');
    const [tribe, setTribe] = React.useState('payments');
    const [pipeline, setPipeline] = React.useState('standard');
    const [rings, setRings] = React.useState(true);
    const [slo, setSlo] = React.useState('99.9');

    const stepIdx = STEPS.findIndex(s => s.id === step);
    const canBack = stepIdx > 0;
    const canNext = stepIdx < STEPS.length - 1;
    const isReview = step === 'review';

    const goNext = () => canNext && setStep(STEPS[stepIdx + 1].id);
    const goBack = () => canBack && setStep(STEPS[stepIdx - 1].id);

    const owner = PEOPLE.find(p => p.team === 'payments') || PEOPLE[0];

    return (
      <FShell
        nav="templates"
        crumbs={[
          { label: 'Forge', href: '/example/ai-insights' },
          { label: 'Templates', href: '/example/templates' },
          'Scaffold service',
        ]}>

        <FPageHeader
          title="Scaffold a new service"
          subtitle="Generate a production-ready repo, pipeline, dashboards and on-call rotation — about 90 seconds."
          actions={
            <>
              <button className="btn ghost">Save draft</button>
              <button className="btn ghost">View past scaffolds</button>
            </>
          }/>

        {/* === Stepper (horizontal Pipeline pattern) === */}
        <div className="fp-card" style={{padding: '20px 24px', marginTop: 18, marginBottom: 18}}>
          <div className="pipeline pipeline-stepper" style={{justifyContent:'flex-start', gap: 18, flexWrap:'wrap'}}>
            {STEPS.map((s, i) => {
              const done = i < stepIdx;
              const current = i === stepIdx;
              const cls = 'pipeline-step' + (done ? ' is-done' : '') + (current ? ' is-current' : '');
              return (
                <button key={s.id} className={cls} onClick={() => setStep(s.id)} style={{background:'transparent', border:'none', cursor:'pointer'}}>
                  <span className="pin">
                    {done ? <Icons.check size={12}/> : <span style={{fontFamily:'var(--font-mono)', fontWeight: 600, fontSize: 'var(--text-xs)'}}>{i + 1}</span>}
                  </span>
                  <span className="label" style={{textAlign:'start'}}>
                    <span style={{fontWeight: 600}}>{s.label}</span>
                    <span style={{display:'block', fontSize: 'var(--text-xs)', color:'var(--fg-muted)', fontWeight: 400, marginTop: 2}}>{s.desc}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* === STEP 1 — TEMPLATE === */}
        {step === 'template' && (
          <FSection title="01 — Choose a template">
            <p style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', maxWidth:'62ch', marginBottom: 14, lineHeight: 1.55}}>
              Templates are versioned per tribe. The <strong style={{color:'var(--fg)'}}>typescript-api</strong> scaffold is the most-used in the company (84% of new services). Custom templates require platform-eng approval.
            </p>
            <div className="fp-grid fp-grid-2x1" style={{gap: 14}}>
              {TEMPLATES.map(t => {
                const sel = t.id === template;
                return (
                  <button key={t.id}
                    onClick={() => setTemplate(t.id)}
                    className={'fp-card' + (sel ? ' is-selected' : '')}
                    style={{
                      textAlign:'start', cursor:'pointer', position:'relative',
                      borderColor: sel ? 'var(--ember)' : 'var(--border)',
                      boxShadow: sel ? '0 0 0 1px var(--ember)' : 'none',
                      background: sel ? 'color-mix(in oklch, var(--ember) 5%, var(--surface))' : 'var(--surface)',
                    }}>
                    <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 10}}>
                      <span className="pill ember">{t.tier}</span>
                      <span style={{fontWeight: 600, fontSize: 'var(--text-md)', color:'var(--fg)'}}>{t.title}</span>
                      {t.featured && <span className="pill success">Gold standard</span>}
                      {t.warning && <span className="pill warning">Approval needed</span>}
                    </div>
                    <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', margin: 0, lineHeight: 1.55}}>{t.desc}</p>
                    <div style={{display:'flex', gap: 6, marginTop: 12, flexWrap:'wrap'}}>
                      <span className="pill" style={{fontFamily:'var(--font-mono)'}}>{t.lang}</span>
                      {t.stack.map(s => <span key={s} className="pill" style={{fontSize: 'var(--text-xs)'}}>{s}</span>)}
                    </div>
                    {sel && <div style={{position:'absolute', top: 12, insetInlineEnd: 12, color:'var(--ember)'}}><Icons.check size={16}/></div>}
                  </button>
                );
              })}
            </div>
            <div style={{marginTop: 18}}>
              <Banner
                tone="info"
                icon="info"
                title="Don't see what you need?"
                message="Open a custom template request — the platform-eng team will review and either point you to an existing scaffold or build a new one."/>
            </div>
          </FSection>
        )}

        {/* === STEP 2 — REPOSITORY === */}
        {step === 'repo' && (
          <FSection title="02 — Repository">
            <div className="fp-grid fp-grid-2x1" style={{gap: 18}}>
              <div className="fp-card" style={{padding: 22}}>
                <div className="fp-card-title" style={{marginBottom: 12}}>Identity</div>
                <div style={{display:'flex', flexDirection:'column', gap: 14}}>
                  <div>
                    <label className="t-mono-label" style={{display:'block', marginBottom: 6}}>Repo name</label>
                    <div className="in-group">
                      <span className="in-addon text" style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-sm)'}}>forge-platform/</span>
                      <input className="in-control" value={repoName} onChange={(e) => setRepoName(e.target.value)}/>
                    </div>
                    <div style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)', marginTop: 6}}>Lowercase, hyphenated. Pattern <code style={{fontFamily:'var(--font-mono)', color:'var(--ember)'}}>{'{domain}-{noun}'}</code>.</div>
                  </div>
                  <div>
                    <label className="t-mono-label" style={{display:'block', marginBottom: 6}}>Visibility</label>
                    <div style={{display:'flex', gap: 8, flexWrap:'wrap'}}>
                      {['internal', 'restricted', 'public'].map(v => (
                        <button key={v} onClick={() => setVisibility(v)}
                          className={'pill ' + (visibility === v ? 'ember' : '')}
                          style={{cursor:'pointer', border:'none'}}>
                          {visibility === v && <Icons.check size={10}/>} {v}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="t-mono-label" style={{display:'block', marginBottom: 6}}>Tribe</label>
                    <div style={{display:'flex', gap: 8, flexWrap:'wrap'}}>
                      {['payments', 'identity', 'core', 'platform'].map(t => (
                        <button key={t} onClick={() => setTribe(t)}
                          className={'pill ' + (tribe === t ? 'ember' : '')}
                          style={{cursor:'pointer', border:'none'}}>
                          {tribe === t && <Icons.check size={10}/>} {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="fp-card" style={{padding: 22}}>
                <div className="fp-card-title" style={{marginBottom: 12}}>Owners</div>
                <div style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', marginBottom: 14, lineHeight: 1.55}}>
                  Owners receive PR review requests, on-call escalations, and SLO burns. At least 2 required.
                </div>
                <div style={{display:'flex', flexDirection:'column', gap: 8}}>
                  {(PEOPLE.slice(0, 4)).map(p => (
                    <div key={p.name} style={{display:'flex', alignItems:'center', gap: 10, padding: 8, borderRadius: 'var(--radius-xl)', background:'var(--bg)', border:'1px solid var(--border)'}}>
                      <OwnerPill person={p}/>
                      <span style={{marginInlineStart:'auto', fontSize: 'var(--text-sm)', color:'var(--fg-muted)', fontFamily:'var(--font-mono)'}}>{p.team}</span>
                      <button className="btn ghost sm">remove</button>
                    </div>
                  ))}
                  <button className="btn ghost" style={{marginTop: 4}}><Icons.plus size={12}/> Add owner</button>
                </div>
              </div>
            </div>
          </FSection>
        )}

        {/* === STEP 3 — CI / CD === */}
        {step === 'cicd' && (
          <FSection title="03 — CI / CD">
            <div className="fp-grid fp-grid-2x1" style={{gap: 18}}>
              <div className="fp-card" style={{padding: 22}}>
                <div className="fp-card-title" style={{marginBottom: 12}}>Pipeline shape</div>
                <div style={{display:'flex', flexDirection:'column', gap: 10}}>
                  {[
                    { id: 'standard', label: 'Standard', desc: 'Build → test → lint → deploy. The default; covers 90% of services.' },
                    { id: 'extended', label: 'Extended', desc: 'Adds load testing, security scan and ADR gates.' },
                    { id: 'custom',   label: 'Custom',  desc: 'Wire your own — opens a pipeline-edit drawer on the next page.' },
                  ].map(o => {
                    const sel = pipeline === o.id;
                    return (
                      <button key={o.id}
                        onClick={() => setPipeline(o.id)}
                        style={{
                          padding: '12px 14px', borderRadius: 'var(--radius-2xl)', cursor:'pointer', border: '1px solid',
                          borderColor: sel ? 'var(--ember)' : 'var(--border)',
                          background: sel ? 'color-mix(in oklch, var(--ember) 6%, var(--bg))' : 'var(--bg)',
                          color:'var(--fg)', textAlign:'start',
                        }}>
                        <div style={{display:'flex', alignItems:'center', gap: 8, marginBottom: 4}}>
                          <StatusDot tone={sel ? 'done' : 'pending'} size="sm"/>
                          <span style={{fontWeight: 600, fontSize: 'var(--text-base)'}}>{o.label}</span>
                          {sel && <span className="pill ember" style={{marginInlineStart:'auto'}}>Selected</span>}
                        </div>
                        <div style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', lineHeight: 1.5}}>{o.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="fp-card" style={{padding: 22}}>
                <div className="fp-card-title" style={{marginBottom: 12}}>Ring strategy</div>
                <div style={{display:'flex', alignItems:'center', gap: 12, padding: 12, background:'var(--bg)', borderRadius: 'var(--radius-2xl)', border:'1px solid var(--border)', marginBottom: 14}}>
                  <label style={{display:'flex', alignItems:'center', gap: 10, cursor:'pointer'}}>
                    <span className="fc-check" style={{position:'relative', width: 18, height: 18, display:'inline-flex'}}>
                      <input type="checkbox" checked={rings} onChange={(e) => setRings(e.target.checked)} style={{opacity: 0, position:'absolute', inset: 0}}/>
                      <span className="fc-check-box" style={{
                        width: 18, height: 18, borderRadius: 'var(--radius-lg)', border:'1.5px solid var(--border)',
                        background: rings ? 'var(--ember)' : 'transparent',
                        borderColor: rings ? 'var(--ember)' : 'var(--border)',
                        display:'inline-flex', alignItems:'center', justifyContent:'center',
                      }}>
                        {rings && <Icons.check size={11} style={{color:'var(--ember-fg)'}}/>}
                      </span>
                    </span>
                    <div>
                      <div style={{fontSize: 'var(--text-base)', fontWeight: 500}}>Enable ring deployment</div>
                      <div style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)', marginTop: 2}}>Canary → 5% → 25% → 100% with 20m bake between stages.</div>
                    </div>
                  </label>
                </div>
                <div style={{display:'flex', gap: 4, alignItems:'center', flexWrap:'wrap', opacity: rings ? 1 : 0.4}}>
                  {['Canary', '5%', '25%', '100%'].map((r, i) => (
                    <React.Fragment key={r}>
                      <span className="pill" style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)'}}>{r}</span>
                      {i < 3 && <Icons.arrowRight size={11} style={{color:'var(--fg-muted)'}}/>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </FSection>
        )}

        {/* === STEP 4 — OBSERVABILITY === */}
        {step === 'observ' && (
          <FSection title="04 — Observability">
            <div className="fp-grid fp-grid-2x1" style={{gap: 18}}>
              <div className="fp-card" style={{padding: 22}}>
                <div className="fp-card-title" style={{marginBottom: 12}}>SLO target</div>
                <div style={{display:'flex', flexDirection:'column', gap: 6}}>
                  {[
                    { v: '99.99', name: 'Mission critical', desc: 'For T1 user-facing services. 4.3min/month error budget.' },
                    { v: '99.9',  name: 'Standard',         desc: 'Most production services. 43min/month error budget.' },
                    { v: '99.0',  name: 'Internal',         desc: 'Internal tools. 7.2h/month error budget.' },
                  ].map(o => {
                    const sel = slo === o.v;
                    return (
                      <button key={o.v}
                        onClick={() => setSlo(o.v)}
                        style={{
                          padding: '12px 14px', borderRadius: 'var(--radius-2xl)', cursor:'pointer', border:'1px solid',
                          borderColor: sel ? 'var(--ember)' : 'var(--border)',
                          background: sel ? 'color-mix(in oklch, var(--ember) 6%, var(--bg))' : 'var(--bg)',
                          textAlign:'start', display:'flex', gap: 12, alignItems:'center',
                        }}>
                        <div style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xl)', fontWeight: 700, color: sel ? 'var(--ember)' : 'var(--fg)', minWidth: 64}}>{o.v}%</div>
                        <div>
                          <div style={{fontSize: 'var(--text-base)', fontWeight: 600}}>{o.name}</div>
                          <div style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)', marginTop: 2}}>{o.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="fp-card" style={{padding: 22}}>
                <div className="fp-card-title" style={{marginBottom: 12}}>Auto-provision</div>
                <div style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', marginBottom: 14, lineHeight: 1.55}}>
                  Forge will create these resources from the chosen template. Toggle any off if your service doesn't need them.
                </div>
                {[
                  ['Datadog service · APM', true, 'apm'],
                  ['Grafana dashboard', true, 'dashboard'],
                  ['PagerDuty rotation', true, 'oncall'],
                  ['SLO + error budget burn alerts', true, 'slo'],
                  ['Cost breakdown · BigQuery', false, 'cost'],
                ].map(([name, def, id]) => (
                  <label key={id as string} style={{display:'flex', alignItems:'center', gap: 10, padding: '6px 4px', cursor:'pointer'}}>
                    <span style={{
                      width: 28, height: 18, borderRadius: 9, position:'relative',
                      background: def ? 'var(--ember)' : 'var(--bg-elevated)',
                      border:'1px solid var(--border)',
                      transition: 'background .2s ease',
                    }}>
                      <span style={{
                        position:'absolute', top: 2, [def ? 'right' : 'left']: 2,
                        width: 12, height: 12, borderRadius: '50%',
                        background: def ? 'var(--fg)' : 'var(--fg-muted)',
                        transition: 'all .2s ease',
                      }}/>
                    </span>
                    <span style={{fontSize: 'var(--text-sm)'}}>{name}</span>
                  </label>
                ))}
              </div>
            </div>
          </FSection>
        )}

        {/* === STEP 5 — REVIEW === */}
        {step === 'review' && (
          <>
            <Banner
              tone="success"
              icon="check"
              title="Ready to scaffold"
              message={`Forge will generate 23 files, open a PR, create the pipeline, register the SLO at ${slo}%, and set up the on-call rotation. Estimated 90 seconds.`}
            />
            <FSection title="05 — Review and ship" style={{marginTop: 18}}>
              <div className="fp-grid fp-grid-2x1" style={{gap: 18}}>
                {/* Summary */}
                <div className="fp-card" style={{padding: 22}}>
                  <div className="fp-card-title" style={{marginBottom: 14}}>Summary</div>
                  <div style={{display:'flex', flexDirection:'column', gap: 14}}>
                    <Row label="Template"   value={<><span className="pill ember">{TEMPLATES.find(t => t.id === template).tier}</span> <span style={{fontWeight: 600}}>{TEMPLATES.find(t => t.id === template).title}</span></>}/>
                    <Row label="Repository" value={<span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-sm)', color:'var(--ember)'}}>forge-platform/{repoName}</span>}/>
                    <Row label="Visibility" value={<span className="pill ">{visibility}</span>}/>
                    <Row label="Tribe"      value={<span className="pill ice">{tribe}</span>}/>
                    <Row label="Pipeline"   value={<><span className={'pill ' + (pipeline === 'standard' ? 'success' : 'warning')}>{pipeline}</span> {rings && <span className="pill ember">rings on</span>}</>}/>
                    <Row label="SLO target" value={<span style={{fontFamily:'var(--font-mono)', color:'var(--fg)'}}>{slo}%</span>}/>
                    <Row label="Owners"     value={<div style={{display:'flex', gap: 6, flexWrap:'wrap'}}>{PEOPLE.slice(0, 3).map(p => <OwnerPill key={p.name} person={p}/>)}</div>}/>
                  </div>
                </div>
                {/* Files preview */}
                <div className="fp-card" style={{padding: 22}}>
                  <div className="fp-card-title" style={{marginBottom: 14}}>Files Forge will create</div>
                  <div style={{display:'flex', flexDirection:'column', gap: 4, fontFamily:'var(--font-mono)', fontSize: 'var(--text-sm)', color:'var(--fg-muted)'}}>
                    {[
                      '+ src/index.ts',
                      '+ src/routes/health.ts',
                      '+ src/db/migrate.ts',
                      '+ test/health.test.ts',
                      '+ Dockerfile',
                      '+ .forge/pipeline.yaml',
                      '+ .forge/slo.yaml',
                      '+ .forge/oncall.yaml',
                      '+ .forge/dashboards/api.json',
                      '+ README.md',
                      '+ … 13 more',
                    ].map((line, i) => (
                      <div key={i} style={{display:'flex', alignItems:'center', gap: 6}}>
                        <span style={{color:'var(--success)', fontWeight: 700}}>+</span>
                        <span>{line.slice(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop: 16, padding: 12, background:'var(--bg)', borderRadius: 'var(--radius-xl)', border:'1px solid var(--border)'}}>
                    <div className="t-mono-label" style={{marginBottom: 6}}>Estimated cost</div>
                    <div style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', lineHeight: 1.55}}>
                      ~$28 / mo at expected baseline traffic. Forge bills are itemized on the service detail page after first deploy.
                    </div>
                  </div>
                </div>
              </div>

              <div className="fp-card" style={{padding: 22, marginTop: 18}}>
                <div className="fp-card-title" style={{marginBottom: 14}}>What happens next</div>
                <div style={{display:'flex', gap: 24, flexWrap:'wrap'}}>
                  {[
                    ['1', 'PR opened', 'On forge-platform/' + repoName + ' for the initial scaffold commit.'],
                    ['2', 'CI green', 'First build runs against the template smoke tests. Expected 90s.'],
                    ['3', 'On-call set', 'Rotation created in PagerDuty with the 4 owners on rotation weekly.'],
                    ['4', 'Ready', 'Service appears in the catalog. You can deploy to canary immediately.'],
                  ].map(([n, ttl, d]) => (
                    <div key={n} style={{flex: '1 1 200px', minWidth: 200}}>
                      <span className="pill ember" style={{marginBottom: 6}}>{n}</span>
                      <div style={{fontSize: 'var(--text-base)', fontWeight: 600, marginTop: 4}}>{ttl}</div>
                      <div style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', marginTop: 3, lineHeight: 1.55}}>{d}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FSection>
          </>
        )}

        {/* === Footer · navigation === */}
        <div className="fp-card" style={{padding: 14, marginTop: 18, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', bottom: 16}}>
          <button className="btn ghost" disabled={!canBack} onClick={goBack}>
            <Icons.arrowLeft size={13}/> Back
          </button>
          <span style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', fontFamily:'var(--font-mono)'}}>
            Step {stepIdx + 1} of {STEPS.length} — {STEPS[stepIdx].label}
          </span>
          {isReview ? (
            <button className="btn ember">
              <Icons.sparkle size={13}/> Scaffold service
            </button>
          ) : (
            <button className="btn ember" onClick={goNext} disabled={!canNext}>
              Next <Icons.arrowRight size={13}/>
            </button>
          )}
        </div>

      </FShell>
    );
  };

  const Row = ({ label, value }) => (
    <div style={{display:'flex', alignItems:'center', gap: 14}}>
      <span className="t-mono-label" style={{minWidth: 110}}>{label}</span>
      <span style={{flex: 1, display:'flex', alignItems:'center', gap: 6, flexWrap:'wrap'}}>{value}</span>
    </div>
  );

  
  export default App;
