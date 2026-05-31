'use client';
import * as React from 'react';
import { FilterPanel, HealthBadge, Icons, LangBadge, MOCKS, OwnerPill, ServiceCard, Sparkline, Tabs, TierBadge } from '@/ds/core';
import { FPageHeader, FSection, FShell } from './example-shell';
// Forge IDP — Example: Service catalog (Backstage-style).
// Standalone page. Uses only existing Forge primitives.

  
  
  
  
  
  const SERVICES = MOCKS.SERVICES || [];

  // Demo: spark data per service (latency proxy)
  const sparkFor = (svc, i) => {
    const base = svc.p95 || 120;
    const arr = [];
    for (let n = 0; n < 24; n++) {
      const drift = Math.sin((i + n) / 3) * (base * 0.18);
      const spike = svc.alert && n > 18 ? base * 0.5 : 0;
      arr.push(Math.max(20, Math.round(base + drift + spike)));
    }
    return arr;
  };

  const personByTribe = (tribe) => {
    const PEOPLE = MOCKS.PEOPLE || [];
    return PEOPLE.find(p => p.role && p.role.includes(tribe)) || PEOPLE[0] || { name: tribe, initials: tribe.slice(0, 2).toUpperCase() };
  };

  const TABS = [
    { key: 'services',  label: 'Services',     count: SERVICES.length },
    { key: 'agents',    label: 'Agents',       count: 24 },
    { key: 'mcp',       label: 'MCP servers',  count: 7 },
    { key: 'templates', label: 'Templates',    count: 18 },
    { key: 'apis',      label: 'APIs',         count: 41 },
  ];

  const SAVED_VIEWS = ['All services', 'My tribe · Identity', 'Tier 1', 'Degraded right now', 'Recently deployed'];

  const App = () => {
    const [activeTab, setActiveTab] = React.useState('services');
    const [activeView, setActiveView] = React.useState(SAVED_VIEWS[0]);
    const [query, setQuery] = React.useState('');
    const [viewMode, setViewMode] = React.useState('grid');

    const filtered = React.useMemo(() => {
      if (!query) return SERVICES;
      const q = query.toLowerCase();
      return SERVICES.filter(s => s.name.toLowerCase().includes(q) || (s.tribe || '').toLowerCase().includes(q));
    }, [query]);

    return (
      <FShell
        nav="services"
        crumbs={[{ label: 'Forge', href: '/example/ai-insights' }, 'Catalog']}>

        <FPageHeader
          title="Catalog"
          subtitle={`${SERVICES.length} services · 18 tribes · ${TABS.reduce((s, t) => s + t.count, 0)} entities total`}
          actions={
            <>
              <button className="btn ghost"><Icons.download size={13}/> Export</button>
              <button className="btn ember"><Icons.plus size={13}/> New service</button>
            </>
          }/>

        {/* Tabs */}
        <div className="fp-tabs">
          {TABS.map(t => (
            <button key={t.key}
                    className={'fp-tab' + (activeTab === t.key ? ' is-active' : '')}
                    onClick={() => setActiveTab(t.key)}>
              {t.label}
              <span style={{
                marginInlineStart: 8,
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: 'var(--fg-muted)',
              }}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Saved views row */}
        <div style={{display:'flex', gap: 6, marginBottom: 14, flexWrap:'wrap'}}>
          {SAVED_VIEWS.map(v => (
            <button key={v}
                    onClick={() => setActiveView(v)}
                    className={'pill ' + (activeView === v ? 'ember' : 'neutral')}
                    style={{cursor:'pointer', border:'1px solid var(--border)', fontWeight: activeView === v ? 600 : 500}}>
              {activeView === v && <span className="dot"/>}
              {v}
            </button>
          ))}
          <button className="pill neutral" style={{cursor:'pointer', border:'1px dashed var(--border)', color:'var(--fg-muted)'}}>
            <Icons.plus size={11}/> Save current view
          </button>
        </div>

        {/* Toolbar */}
        <div style={{display:'flex', gap: 10, marginBottom: 16, alignItems:'center'}}>
          <div className="in-group sm" style={{flex: 1, maxWidth: 480}}>
            <span className="in-addon icon"><Icons.search size={13}/></span>
            <input className="in-control" placeholder="Filter by name, tribe, language..."
                   value={query} onChange={(e) => setQuery(e.target.value)}/>
            <span className="in-addon" style={{padding:'0 8px'}}>
              <span className="kbd" style={{fontSize: 'var(--text-xs)'}}>⌘K</span>
            </span>
          </div>
          <button className="btn ghost sm">
            <Icons.filter size={12}/>
            Tier · Lang · Health · Owner
          </button>
          <div style={{display:'inline-flex', borderRadius: 'var(--radius-2xl)', border:'1px solid var(--border)', overflow:'hidden'}}>
            <button
              className="btn ghost sm"
              style={{borderRadius: 0, background: viewMode === 'grid' ? 'var(--bg-elevated)' : 'transparent', border:'none', borderInlineEnd:'1px solid var(--border)'}}
              onClick={() => setViewMode('grid')}>
              <Icons.grid size={12}/>
            </button>
            <button
              className="btn ghost sm"
              style={{borderRadius: 0, background: viewMode === 'list' ? 'var(--bg-elevated)' : 'transparent', border:'none'}}
              onClick={() => setViewMode('list')}>
              <Icons.menu size={12}/>
            </button>
          </div>
          <button className="btn ghost sm" title="More filters"><Icons.more size={12}/></button>
        </div>

        {/* Grid */}
        {activeTab === 'services' && viewMode === 'grid' && (
          <div className="fp-grid fp-grid-auto">
            {filtered.map((svc, i) => (
              <ServiceCard
                key={svc.id}
                service={svc}
                contributors={[personByTribe(svc.tribe)].filter(Boolean)}
                sparkSeries={sparkFor(svc, i)}
                onOpen={() => { window.location.href = `/example/service-detail?id=${svc.id}`; }}/>
            ))}
          </div>
        )}

        {/* List view */}
        {activeTab === 'services' && viewMode === 'list' && (
          <div className="fp-card" style={{padding: 0}}>
            <div className="tbl-wrap">
            <table className="tbl" style={{margin: 0}}>
              <thead>
                <tr>
                  <th>Service</th><th>Tier</th><th>Lang</th><th>Tribe</th><th>Health</th>
                  <th>P95</th><th>Coverage</th><th>Version</th><th style={{textAlign:'end'}}>Last deploy</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(svc => (
                  <tr key={svc.id} style={{cursor:'pointer'}} onClick={() => window.location.href = `/example/service-detail?id=${svc.id}`}>
                    <td style={{fontWeight: 600}}>{svc.name}</td>
                    <td><TierBadge tier={svc.tier}/></td>
                    <td><LangBadge lang={svc.lang}/></td>
                    <td>{svc.tribe}</td>
                    <td><HealthBadge state={svc.alert ? 'degraded' : 'up'} pulse={svc.alert}/></td>
                    <td className="mono">{svc.p95}ms</td>
                    <td className="mono">{svc.coverage}%</td>
                    <td className="mono">{svc.version}</td>
                    <td style={{textAlign:'end', color:'var(--fg-muted)', fontSize: 'var(--text-sm)'}}>{svc.deploys}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        )}

        {activeTab !== 'services' && (
          <div className="fp-card">
            <div className="fp-empty">
              <div style={{fontWeight: 600, color:'var(--fg)', marginBottom: 6}}>The {activeTab} catalog is a separate example</div>
              <div>Click <a href={activeTab === 'agents' ? '/example/agent-catalog' : activeTab === 'mcp' ? '/example/mcp-detail' : activeTab === 'templates' ? '/example/templates' : '#'}
                            className="ds-link-inline">{activeTab}</a> to navigate.</div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--border)', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)'}}>
          <div>{filtered.length} of {SERVICES.length} services · view <code style={{fontFamily:'var(--font-mono)', color:'var(--ember)'}}>?view={(activeView).toLowerCase().replace(/\s+/g, '-')}</code></div>
          <div style={{display: 'flex', alignItems:'center', gap: 6}}>
            <button className="btn ghost sm" disabled><Icons.chevronLeft size={12}/></button>
            <span style={{padding: '0 12px'}}>1 / 1</span>
            <button className="btn ghost sm" disabled><Icons.chevronRight size={12}/></button>
          </div>
        </div>
      </FShell>
    );
  };

  
  export default App;
