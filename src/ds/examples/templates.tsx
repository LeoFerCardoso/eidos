'use client';
import * as React from 'react';
import { Counter, Icons, LangBadge, MOCKS, OwnerPill, RelativeTime } from '@/ds/core';
import { FPageHeader, FShell } from './example-shell';
// Eidos IDP — Example: Templates gallery (Backstage-style scaffolders).

  
  
  
  
  const PEOPLE = MOCKS.PEOPLE || [];

  const personByPrefix = (prefix) =>
    PEOPLE.find(p => p.name && p.name.startsWith(prefix)) || PEOPLE[0];

  // 12 templates — superset of MOCKS.TEMPLATES with more variety
  const TEMPLATES = [
    { id: 'go-grpc-svc',       name: 'go-grpc-svc',       desc: 'Production-grade Go service with gRPC + REST, sqlc + pgx, canary-ready Helm chart. Pre-wired to Eidos quality gates.',  lang: 'Go',          framework: ['gRPC','Helm','sqlc'],     maturity: 'Stable',       maintainer: personByPrefix('Rafael'),  usage: 96,  version: '3.2.0', featured: true },
    { id: 'nestjs-microservice',name: 'nestjs-microservice', desc: 'NestJS microservice scaffold · gRPC + REST · OTLP traces · pre-wired SAST + risk gates · zero-config CI.',  lang: 'TypeScript',  framework: ['NestJS','gRPC','OTLP'],   maturity: 'Stable',       maintainer: personByPrefix('Camila'),  usage: 142, version: '2.8.1', featured: true },
    { id: 'nextjs-app',        name: 'nextjs-app',        desc: 'Next.js 15 App Router · Tailwind · Eidos auth shim · server actions · type-safe API contracts.',  lang: 'TypeScript',  framework: ['Next.js 15','Tailwind'],  maturity: 'Stable',       maintainer: personByPrefix('Diego'),   usage: 84,  version: '4.0.2' },
    { id: 'data-pipeline',     name: 'data-pipeline',     desc: 'Dagster pipeline · ClickHouse sink · per-asset cost guardrails · partition-aware retries.',  lang: 'Python',      framework: ['Dagster','ClickHouse'],   maturity: 'Stable',       maintainer: personByPrefix('Larissa'), usage: 38,  version: '1.6.0' },
    { id: 'ml-model-svc',      name: 'ml-model-svc',      desc: 'FastAPI · model registry · drift alarms · ABACUS sampling · ONNX export by default.',  lang: 'Python',      framework: ['FastAPI','MLflow'],       maturity: 'Stable',       maintainer: personByPrefix('Beatriz'), usage: 27,  version: '0.9.3' },
    { id: 'rust-edge-svc',     name: 'rust-edge-svc',     desc: 'Rust edge service · axum + tonic · zero-copy serialization · cgroup-aware autoscale.',  lang: 'Rust',        framework: ['axum','tonic'],           maturity: 'Beta',         maintainer: personByPrefix('Diego'),   usage: 14,  version: '0.4.1' },
    { id: 'eidos-agent',       name: 'eidos-agent',       desc: 'Eidos AI agent · MCP server scaffold · streaming responses · tool-calling boilerplate · OpenTelemetry traces.',  lang: 'TypeScript',  framework: ['MCP','AI SDK'],           maturity: 'Beta',         maintainer: personByPrefix('Camila'),  usage: 22,  version: '0.7.0' },
    { id: 'java-spring-svc',   name: 'java-spring-svc',   desc: 'Spring Boot 3 · Java 21 · OTLP · Resilience4j circuit breakers · containerized with jlink slim image.',  lang: 'Java',        framework: ['Spring Boot 3'],          maturity: 'Stable',       maintainer: personByPrefix('Thiago'),  usage: 58,  version: '5.1.0' },
    { id: 'event-handler',     name: 'event-handler',     desc: 'Event-driven consumer · Kafka or SQS · idempotency keys · DLQ replay tooling pre-baked.',  lang: 'Go',          framework: ['Kafka','SQS'],            maturity: 'Stable',       maintainer: personByPrefix('Larissa'), usage: 44,  version: '2.3.4' },
    { id: 'cron-job',          name: 'cron-job',          desc: 'Scheduled batch job · cost-aware concurrency · SLO-aware retries · Slack notifications on long runs.',  lang: 'Python',      framework: ['k8s CronJob'],            maturity: 'Stable',       maintainer: personByPrefix('Mariana'), usage: 31,  version: '1.4.2' },
    { id: 'edge-gateway',      name: 'edge-gateway',      desc: 'BFF gateway · API stitching · rate-limit + per-tenant quotas · WAF rules layer.',  lang: 'TypeScript',  framework: ['Hono','Envoy'],           maturity: 'Experimental', maintainer: personByPrefix('Diego'),   usage: 6,   version: '0.2.0' },
    { id: 'cli-tool',          name: 'cli-tool',          desc: 'Eidos CLI plugin scaffold · oclif · auto-publish to internal registry · drift-tested binaries.',  lang: 'TypeScript',  framework: ['oclif'],                  maturity: 'Beta',         maintainer: personByPrefix('Leonardo'),usage: 18,  version: '0.6.1' },
  ];

  const FEATURED = TEMPLATES.filter(t => t.featured || ['nextjs-app','eidos-agent'].includes(t.id)).slice(0, 3);

  const RECENT = [
    { id: 'go-grpc-svc',         when: '4h ago' },
    { id: 'nestjs-microservice', when: 'yesterday' },
    { id: 'eidos-agent',         when: '3d ago' },
    { id: 'data-pipeline',       when: '1w ago' },
    { id: 'java-spring-svc',     when: '2w ago' },
  ];

  const MATURITY_TONES = { Stable: 'status-done', Beta: 'ember', Experimental: 'severity-p2' };

  const HERO = TEMPLATES.find(t => t.id === 'go-grpc-svc');

  const App = () => {
    const [query, setQuery] = React.useState('');
    const [lang, setLang] = React.useState(null);
    const [maturity, setMaturity] = React.useState(null);

    const filtered = TEMPLATES.filter(t => {
      if (query && !t.name.toLowerCase().includes(query.toLowerCase()) && !t.desc.toLowerCase().includes(query.toLowerCase())) return false;
      if (lang && t.lang !== lang) return false;
      if (maturity && t.maturity !== maturity) return false;
      return true;
    });

    return (
      <FShell
        nav="templates"
        crumbs={[{ label: 'Eidos', href: '/example/ai-insights' }, 'Templates']}>

        <FPageHeader
          title="Templates"
          subtitle="18 templates · owned, opinionated scaffolds — every template ships with Eidos quality gates pre-wired."
          actions={
            <>
              <button className="btn ghost"><Icons.book size={13}/> Authoring guide</button>
              <button className="btn ghost"><Icons.download size={13}/> Export</button>
              <button className="btn ember"><Icons.plus size={13}/> New template</button>
            </>
          }/>

        {/* Hero / latest */}
        <div className="fp-card fp-card--ember-hero" style={{
          padding: 20,
          display: 'flex',
          gap: 20,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          <span style={{
            width: 52, height: 52, borderRadius: 'var(--radius-2xl)',
            background: 'var(--ember)',
            color: 'var(--bg)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icons.package size={26}/>
          </span>
          <div style={{flex: 1, minWidth: 320}}>
            <div style={{display:'inline-flex', alignItems:'center', gap: 10, marginBottom: 4}}>
              <span style={{fontSize: 'var(--text-xs)', color:'var(--ember)', fontFamily:'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em'}}>Latest release</span>
              <span className="pill ember">v{HERO.version}</span>
            </div>
            <div style={{fontSize: 'var(--text-xl)', fontWeight: 700, fontFamily: 'var(--font-mono)'}}>{HERO.name}</div>
            <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', marginTop: 6, lineHeight: 1.55, maxWidth: 600}}>{HERO.desc}</div>
            <div style={{display:'flex', gap: 12, marginTop: 12, alignItems:'center', flexWrap:'wrap'}}>
              <OwnerPill person={HERO.maintainer} role="Maintainer"/>
              <span style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>
                <span className="mono" style={{color:'var(--fg)'}}>{HERO.usage}</span> scaffolds this quarter
              </span>
            </div>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap: 8}}>
            <button className="btn outline"><Icons.rocket size={13}/> Use template</button>
            <button className="btn ghost sm"><Icons.book size={11}/> Read changelog</button>
          </div>
        </div>

        {/* Search + filters */}
        <div style={{display:'flex', gap: 10, margin: '18px 0 16px', alignItems:'center', flexWrap:'wrap'}}>
          <div className="in-group sm" style={{flex: 1, minWidth: 280, maxWidth: 460}}>
            <span className="in-addon icon"><Icons.search size={13}/></span>
            <input className="in-control" placeholder="Filter by name, framework, language..."
                   value={query} onChange={(e) => setQuery(e.target.value)}/>
          </div>
          <details style={{position:'relative'}}>
            <summary className="btn ghost sm" style={{listStyle:'none', cursor:'pointer'}}>
              <Icons.filter size={12}/>
              Language{lang ? ' · ' + lang : ''}
              <Icons.chevronDown size={11}/>
            </summary>
            <div className="menu" style={{position:'absolute', top:'100%', insetInlineStart: 0, marginTop: 4, zIndex: 10}}>
              <button className="menu-item" onClick={(e) => { setLang(null); e.currentTarget.closest('details').open = false; }}>All</button>
              {['TypeScript','Go','Python','Java','Rust'].map(l => (
                <button key={l} className={'menu-item' + (lang === l ? ' is-active' : '')}
                        onClick={(e) => { setLang(l); e.currentTarget.closest('details').open = false; }}>
                  {lang === l && <Icons.check size={11}/>}
                  {l}
                </button>
              ))}
            </div>
          </details>
          <details style={{position:'relative'}}>
            <summary className="btn ghost sm" style={{listStyle:'none', cursor:'pointer'}}>
              <Icons.filter size={12}/>
              Framework
              <Icons.chevronDown size={11}/>
            </summary>
            <div className="menu" style={{position:'absolute', top:'100%', insetInlineStart: 0, marginTop: 4, zIndex: 10}}>
              {['NestJS','Next.js 15','gRPC','Spring Boot 3','Dagster','FastAPI','Hono','axum'].map(f => (
                <button key={f} className="menu-item">{f}</button>
              ))}
            </div>
          </details>
          <details style={{position:'relative'}}>
            <summary className="btn ghost sm" style={{listStyle:'none', cursor:'pointer'}}>
              <Icons.filter size={12}/>
              Maturity{maturity ? ' · ' + maturity : ''}
              <Icons.chevronDown size={11}/>
            </summary>
            <div className="menu" style={{position:'absolute', top:'100%', insetInlineStart: 0, marginTop: 4, zIndex: 10}}>
              <button className="menu-item" onClick={(e) => { setMaturity(null); e.currentTarget.closest('details').open = false; }}>All</button>
              {['Stable','Beta','Experimental'].map(m => (
                <button key={m} className={'menu-item' + (maturity === m ? ' is-active' : '')}
                        onClick={(e) => { setMaturity(m); e.currentTarget.closest('details').open = false; }}>
                  {maturity === m && <Icons.check size={11}/>}
                  {m}
                </button>
              ))}
            </div>
          </details>
          <span style={{marginInlineStart:'auto', fontSize: 'var(--text-sm)', color:'var(--fg-muted)'}}>
            {filtered.length} of {TEMPLATES.length} templates
          </span>
        </div>

        {/* Body: 2x1 */}
        <div className="fp-grid fp-grid-2x1" style={{alignItems:'start', gap: 18}}>
          {/* Cards grid */}
          <div className="fp-grid fp-grid-auto">
            {filtered.map(t => (
              <div key={t.id} className="fp-card" style={{display:'flex', flexDirection:'column', gap: 10, cursor:'pointer'}}
                   onClick={() => { window.location.href = '/example/service-scaffold?template=' + t.id; }}>
                <div style={{display:'flex', alignItems:'center', gap: 10}}>
                  <span style={{
                    width: 36, height: 36, borderRadius: 'var(--radius-2xl)',
                    background: 'var(--surface-strong)',
                    color: 'var(--ember)',
                    display: 'inline-flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <Icons.package size={16}/>
                  </span>
                  <div style={{flex: 1, minWidth: 0}}>
                    <div style={{fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 'var(--text-base)'}}>{t.name}</div>
                    <div style={{fontSize: 'var(--text-xs)', color:'var(--fg-faint)', fontFamily:'var(--font-mono)'}}>v{t.version}</div>
                  </div>
                  <span className={'pill ' + (MATURITY_TONES[t.maturity] || 'neutral')} style={{fontSize: 'var(--text-xs)'}}>{t.maturity}</span>
                </div>
                <div style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--fg-muted)',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>{t.desc}</div>
                <div style={{display:'flex', gap: 6, flexWrap:'wrap', alignItems:'center'}}>
                  <LangBadge lang={t.lang}/>
                  {t.framework.slice(0, 2).map(f => <span key={f} className="chip" style={{fontSize: 'var(--text-xs)'}}>{f}</span>)}
                  {t.framework.length > 2 && <span className="chip" style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>+{t.framework.length - 2}</span>}
                </div>
                <div style={{
                  display:'flex', alignItems:'center', justifyContent:'space-between',
                  borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 4,
                }}>
                  <OwnerPill person={t.maintainer}/>
                  <span style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)', display:'inline-flex', alignItems:'center', gap: 4}}>
                    <Icons.rocket size={11}/>
                    <Counter to={t.usage}/>
                  </span>
                </div>
                <button className="btn outline sm" style={{marginTop: 4}}
                        onClick={(e) => { e.stopPropagation(); window.location.href = '/example/service-scaffold?template=' + t.id; }}>
                  <Icons.rocket size={11}/> Use
                </button>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div style={{display:'flex', flexDirection:'column', gap: 14}}>
            {/* Featured */}
            <div className="fp-card">
              <div className="fp-card-head">
                <div className="fp-card-title">Featured templates</div>
                <span className="pill ember">curated</span>
              </div>
              <ul style={{listStyle:'none', padding: 0, margin: 0, display:'flex', flexDirection:'column', gap: 12}}>
                {FEATURED.map(t => (
                  <li key={t.id} style={{display:'flex', alignItems:'flex-start', gap: 10}}>
                    <span style={{width: 28, height: 28, borderRadius: 'var(--radius-2xl)', background:'var(--surface-strong)', display:'inline-flex', alignItems:'center', justifyContent:'center', color:'var(--ember)'}}>
                      <Icons.package size={14}/>
                    </span>
                    <div style={{flex: 1, display:'flex', flexDirection:'column', gap: 2}}>
                      <span style={{fontWeight: 600, fontSize: 'var(--text-sm)', fontFamily:'var(--font-mono)'}}>{t.name}</span>
                      <span style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)', lineHeight: 1.4}}>
                        {t.desc.split('·')[0].trim()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recently used */}
            <div className="fp-card">
              <div className="fp-card-head">
                <div className="fp-card-title">Recently used by me</div>
              </div>
              <ul style={{listStyle:'none', padding: 0, margin: 0, display:'flex', flexDirection:'column', gap: 10}}>
                {RECENT.map(r => {
                  const tpl = TEMPLATES.find(t => t.id === r.id);
                  if (!tpl) return null;
                  return (
                    <li key={r.id} style={{display:'flex', alignItems:'center', gap: 10}}>
                      <Icons.package size={12}/>
                      <span style={{fontWeight: 600, fontSize: 'var(--text-sm)', fontFamily:'var(--font-mono)', flex: 1}}>{tpl.name}</span>
                      <span style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>{r.when}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Help / docs */}
            <div className="fp-card">
              <div className="fp-card-head">
                <div className="fp-card-title">Authoring</div>
              </div>
              <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', lineHeight: 1.55, margin: 0}}>
                Every template is owned by a maintainer team. To propose a new template, open a PR against the
                {' '}<span className="mono" style={{color:'var(--ember)'}}>eidos/templates</span> repo using the meta-template.
              </p>
              <a href="#" className="btn ghost sm" style={{marginTop: 10, alignSelf:'flex-start'}}>
                <Icons.book size={11}/> Authoring guide
              </a>
            </div>
          </div>
        </div>
      </FShell>
    );
  };

  
  export default App;
