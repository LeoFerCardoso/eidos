'use client';
import * as React from 'react';
import { AgentCard, HealthBadge, Icons, RelativeTime, Sparkline } from '@/ds/core';
import { FPageHeader, FShell } from './example-shell';
// Eidos IDP — Example: Agent catalog (HF hub × GitHub repos inspired).

  
  
  
  

  // 12 agents — mixed providers, capabilities, statuses
  const AGENTS = [
    { id: 'pr-reviewer',     name: 'pr-reviewer',     summary: 'Senior staff code reviewer · explains diffs in plain English',
      provider: 'anthropic', model: 'claude-4.7-sonnet', status: 'up',
      capabilities: ['code-review','risk-score','adr-check'], pass: 92, cost: 0.18, calls: 1428, lastRun: Date.now() - 6 * 60 * 1000 },
    { id: 'incident-triage', name: 'incident-triage', summary: 'Reads logs · proposes root cause · drafts incident summary',
      provider: 'anthropic', model: 'claude-4.7-opus', status: 'up',
      capabilities: ['incident-triage','log-analysis','runbook-exec'], pass: 88, cost: 0.42, calls: 217, lastRun: Date.now() - 23 * 60 * 1000 },
    { id: 'doc-gen',         name: 'doc-gen',         summary: 'Generates ADRs and READMEs from a service folder',
      provider: 'openai',    model: 'gpt-5.1',         status: 'up',
      capabilities: ['doc-gen','adr-draft','readme'], pass: 95, cost: 0.09, calls: 942, lastRun: Date.now() - 2 * 3600 * 1000 },
    { id: 'sql-reviewer',    name: 'sql-reviewer',    summary: 'Reviews migrations · flags table-locks · suggests indexes',
      provider: 'anthropic', model: 'claude-4.6-sonnet', status: 'up',
      capabilities: ['sql-review','schema-diff','migration-risk'], pass: 90, cost: 0.14, calls: 318, lastRun: Date.now() - 4 * 3600 * 1000 },
    { id: 'fraud-co-pilot',  name: 'fraud-co-pilot',  summary: 'Investigates flagged transactions · suggests rule tweaks',
      provider: 'local',     model: 'eidos-llama-3.3', status: 'degraded',
      capabilities: ['fraud-triage','rule-tuning'], pass: 79, cost: 0.05, calls: 4218, lastRun: Date.now() - 9 * 60 * 1000 },
    { id: 'test-writer',     name: 'test-writer',     summary: 'Drafts Vitest / Jest cases from a function signature + sample input',
      provider: 'openai',    model: 'gpt-5.1-mini',    status: 'up',
      capabilities: ['test-gen','property-fuzz'], pass: 84, cost: 0.07, calls: 1102, lastRun: Date.now() - 38 * 60 * 1000 },
    { id: 'cost-watch',      name: 'cost-watch',      summary: 'Watches cloud spend · flags anomalies · proposes saving plans',
      provider: 'anthropic', model: 'claude-4.7-haiku', status: 'up',
      capabilities: ['cost-anomaly','rightsize','budget-alerts'], pass: 96, cost: 0.03, calls: 7841, lastRun: Date.now() - 90 * 1000 },
    { id: 'kyc-helper',      name: 'kyc-helper',      summary: 'Explains a flagged onboarding case · cites docs · drafts response',
      provider: 'local',     model: 'eidos-llama-3.3', status: 'up',
      capabilities: ['kyc-explain','doc-cite'], pass: 87, cost: 0.04, calls: 612, lastRun: Date.now() - 12 * 3600 * 1000 },
    { id: 'runbook-runner',  name: 'runbook-runner',  summary: 'Executes parameterized runbooks · returns transcript + diffs',
      provider: 'anthropic', model: 'claude-4.7-sonnet', status: 'up',
      capabilities: ['runbook-exec','dry-run','rollback'], pass: 99, cost: 0.22, calls: 184, lastRun: Date.now() - 7 * 3600 * 1000 },
    { id: 'release-notes',   name: 'release-notes',   summary: 'Drafts CHANGELOG and release announcement from merged PRs',
      provider: 'openai',    model: 'gpt-5.1-mini',    status: 'up',
      capabilities: ['changelog','release-notes','announce'], pass: 91, cost: 0.06, calls: 96, lastRun: Date.now() - 1 * 86400 * 1000 },
    { id: 'compliance-bot',  name: 'compliance-bot',  summary: 'Maps changes to LGPD / SOC2 controls · drafts evidence',
      provider: 'anthropic', model: 'claude-4.7-opus', status: 'up',
      capabilities: ['compliance','evidence','audit-trail'], pass: 93, cost: 0.31, calls: 41, lastRun: Date.now() - 3 * 3600 * 1000 },
    { id: 'sandbox-runner',  name: 'sandbox-runner',  summary: 'Spawns a sandboxed sibling deploy for safe experiments',
      provider: 'local',     model: 'eidos-runner',    status: 'down',
      capabilities: ['sandbox','sibling-deploy'], pass: 0, cost: 0.00, calls: 0, lastRun: Date.now() - 4 * 86400 * 1000 },
  ];

  const FILTERS = {
    Provider: ['anthropic','openai','local'],
    Capability: ['code-review','incident-triage','doc-gen','sql-review','fraud-triage','test-gen','cost-anomaly','runbook-exec'],
    Status: ['up','degraded','down'],
  };

  const FEATURED = ['pr-reviewer', 'cost-watch', 'incident-triage'];
  const TAG_CLOUD = [
    { tag: 'code-review', n: 4 }, { tag: 'incident-triage', n: 3 }, { tag: 'doc-gen', n: 3 },
    { tag: 'sql-review', n: 2 }, { tag: 'cost-anomaly', n: 2 }, { tag: 'runbook-exec', n: 2 },
    { tag: 'test-gen', n: 2 }, { tag: 'fraud-triage', n: 1 }, { tag: 'compliance', n: 1 },
    { tag: 'kyc-explain', n: 1 }, { tag: 'release-notes', n: 1 }, { tag: 'sandbox', n: 1 },
  ];

  const App = () => {
    const [query, setQuery] = React.useState('');
    const [providerFilter, setProviderFilter] = React.useState(null);
    const [capFilter, setCapFilter] = React.useState(null);
    const [statusFilter, setStatusFilter] = React.useState(null);

    const filtered = AGENTS.filter(a => {
      if (query && !a.name.toLowerCase().includes(query.toLowerCase()) && !a.summary.toLowerCase().includes(query.toLowerCase())) return false;
      if (providerFilter && a.provider !== providerFilter) return false;
      if (capFilter && !a.capabilities.includes(capFilter)) return false;
      if (statusFilter && a.status !== statusFilter) return false;
      return true;
    });

    const featured = AGENTS.filter(a => FEATURED.includes(a.id));
    const recent = AGENTS.slice().sort((a, b) => b.lastRun - a.lastRun).slice(0, 5);

    return (
      <FShell
        nav="agents"
        crumbs={[{ label: 'Eidos', href: '/example/ai-insights' }, 'Agents']}>

        <FPageHeader
          title="Agents"
          subtitle="24 agents · 7 owners · 3 providers · 18 capabilities · 23k runs this week"
          actions={
            <>
              <button className="btn ghost"><Icons.book size={13}/> Docs</button>
              <button className="btn ghost"><Icons.download size={13}/> Export</button>
              <button className="btn ember"><Icons.plus size={13}/> New agent</button>
            </>
          }/>

        {/* Toolbar */}
        <div style={{display:'flex', gap: 10, marginBottom: 14, alignItems:'center', flexWrap:'wrap'}}>
          <div className="in-group sm" style={{flex: 1, minWidth: 320, maxWidth: 460}}>
            <span className="in-addon icon"><Icons.search size={13}/></span>
            <input className="in-control" placeholder="Filter by name, capability, owner..."
                   value={query} onChange={(e) => setQuery(e.target.value)}/>
            <span className="in-addon" style={{padding:'0 8px'}}>
              <span className="kbd" style={{fontSize: 'var(--text-xs)'}}>⌘K</span>
            </span>
          </div>

          {Object.entries(FILTERS).map(([group, items]) => {
            const cur = group === 'Provider' ? providerFilter : group === 'Capability' ? capFilter : statusFilter;
            const set = group === 'Provider' ? setProviderFilter : group === 'Capability' ? setCapFilter : setStatusFilter;
            return (
              <details key={group} style={{position:'relative'}}>
                <summary className="btn ghost sm" style={{listStyle:'none', cursor:'pointer'}}>
                  <Icons.filter size={12}/>
                  {group}{cur ? ' · ' + cur : ''}
                  <Icons.chevronDown size={11}/>
                </summary>
                <div className="menu" style={{position:'absolute', top:'100%', insetInlineStart: 0, marginTop: 4, zIndex: 10}}>
                  <button className="menu-item" onClick={(e) => { set(null); e.currentTarget.closest('details').open = false; }}>All</button>
                  {items.map(it => (
                    <button key={it} className={'menu-item' + (cur === it ? ' is-active' : '')}
                            onClick={(e) => { set(it); e.currentTarget.closest('details').open = false; }}>
                      {cur === it && <Icons.check size={11}/>}
                      {it}
                    </button>
                  ))}
                </div>
              </details>
            );
          })}
        </div>

        {/* Body */}
        <div className="fp-grid fp-grid-2x1" style={{gap: 18}}>
          {/* Cards grid */}
          <div className="fp-grid fp-grid-auto">
            {filtered.map(a => (
              <AgentCard
                key={a.id}
                agent={{
                  name: a.name,
                  summary: a.summary,
                  model: a.model,
                  status: a.status,
                  capabilities: a.capabilities,
                  calls: a.calls,
                  successRate: a.pass,
                  lastRun: a.lastRun,
                }}
                onOpen={() => { window.location.href = '/example/agent-chat?agent=' + a.id; }}/>
            ))}
            {filtered.length === 0 && (
              <div className="fp-card" style={{gridColumn:'1 / -1'}}>
                <div className="fp-empty">
                  <div style={{fontWeight: 600, color:'var(--fg)', marginBottom: 6}}>No agents match</div>
                  <div>Try clearing filters or use the search above.</div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{display:'flex', flexDirection:'column', gap: 14}}>
            <div className="fp-card">
              <div className="fp-card-head">
                <div className="fp-card-title">Featured agents</div>
                <span className="pill ember">curated</span>
              </div>
              <ul style={{listStyle:'none', padding: 0, margin: 0, display:'flex', flexDirection:'column', gap: 12}}>
                {featured.map(a => (
                  <li key={a.id} style={{display:'flex', alignItems:'flex-start', gap: 10}}>
                    <span style={{width: 28, height: 28, borderRadius: 'var(--radius-2xl)', background:'var(--surface-strong)', display:'inline-flex', alignItems:'center', justifyContent:'center', color:'var(--ember)'}}>
                      <Icons.agent size={14}/>
                    </span>
                    <div style={{flex: 1, display:'flex', flexDirection:'column', gap: 2}}>
                      <span style={{fontWeight: 600, fontSize: 'var(--text-base)'}}>{a.name}</span>
                      <span style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)', lineHeight: 1.4}}>{a.summary}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="fp-card">
              <div className="fp-card-head">
                <div className="fp-card-title">Recently updated</div>
              </div>
              <ul style={{listStyle:'none', padding: 0, margin: 0, display:'flex', flexDirection:'column', gap: 10}}>
                {recent.map(a => (
                  <li key={a.id} style={{display:'flex', alignItems:'center', gap: 10}}>
                    <Icons.refresh size={12}/>
                    <span style={{fontWeight: 600, fontSize: 'var(--text-base)', flex: 1}}>{a.name}</span>
                    <HealthBadge state={a.status as any}/>
                    <span style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}><RelativeTime value={a.lastRun}/></span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="fp-card">
              <div className="fp-card-head">
                <div className="fp-card-title">By capability</div>
              </div>
              <div style={{display:'flex', flexWrap:'wrap', gap: 6}}>
                {TAG_CLOUD.map(t => (
                  <button key={t.tag}
                          onClick={() => setCapFilter(t.tag)}
                          className={'pill ' + (capFilter === t.tag ? 'ember' : 'neutral')}
                          style={{cursor:'pointer', fontWeight: capFilter === t.tag ? 600 : 500, fontSize: 'var(--text-xs)' + Math.min(2.5, t.n * 0.7)}}>
                    {t.tag}
                    <span style={{marginInlineStart: 6, color:'var(--fg-muted)', fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)'}}>{t.n}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="fp-card">
              <div className="fp-card-head">
                <div className="fp-card-title">Usage · last 24h</div>
              </div>
              <Sparkline data={[120, 142, 168, 154, 198, 240, 218, 286, 312, 298, 340, 372]} w={280} h={48}/>
              <div style={{display:'flex', justifyContent:'space-between', fontSize: 'var(--text-xs)', color:'var(--fg-muted)', marginTop: 8}}>
                <span>2,418 runs</span>
                <span className="mono" style={{color:'var(--success)'}}>+24%</span>
              </div>
            </div>
          </div>
        </div>
      </FShell>
    );
  };

  
  export default App;
