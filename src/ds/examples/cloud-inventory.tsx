'use client';
import * as React from 'react';
import { CopyChip, DataTable, HealthBadge, Icons, MOCKS, OwnerPill, Sparkline, Trend } from '@/ds/core';
import { FKpi, FPageHeader, FShell } from './example-shell';
// Forge IDP — Example: Cloud resource inventory dashboard.

  
  
  
  
  
  const PEOPLE = MOCKS.PEOPLE || [];

  const personByPrefix = (prefix) =>
    PEOPLE.find(p => p.name && p.name.startsWith(prefix)) || PEOPLE[0];

  const PEOPLE_CAMILA = personByPrefix('Camila');
  const PEOPLE_RAFAEL = personByPrefix('Rafael');
  const PEOPLE_BEATRIZ = personByPrefix('Beatriz');
  const PEOPLE_THIAGO = personByPrefix('Thiago');
  const PEOPLE_LARISSA = personByPrefix('Larissa');
  const PEOPLE_DIEGO = personByPrefix('Diego');
  const PEOPLE_MARIANA = personByPrefix('Mariana');

  // 15 cloud resources — mixed type / region / owner
  const RESOURCES = [
    { id: 'eks-prod-pix-router-9k2f',     type: 'container', region: 'sa-east-1a', owner: PEOPLE_RAFAEL,  cost: 4218, state: 'degraded', tags: ['T1','pix','prod'] },
    { id: 'rds-ledger-primary-x71',       type: 'database',  region: 'sa-east-1a', owner: PEOPLE_RAFAEL,  cost: 3982, state: 'up',       tags: ['T1','pix','prod','multi-az'] },
    { id: 'eks-prod-identity-svc-1a8',    type: 'container', region: 'sa-east-1a', owner: PEOPLE_CAMILA,  cost: 3104, state: 'up',       tags: ['T1','identity','prod'] },
    { id: 'sqs-events-bus-fanout',        type: 'queue',     region: 'sa-east-1a', owner: PEOPLE_LARISSA, cost: 2871, state: 'up',       tags: ['T1','telemetry','prod'] },
    { id: 'rds-bureau-primary-z02',       type: 'database',  region: 'sa-east-1b', owner: PEOPLE_THIAGO,  cost: 2655, state: 'up',       tags: ['T1','risk','prod','multi-az'] },
    { id: 'eks-prod-fraud-engine-78c',    type: 'container', region: 'sa-east-1b', owner: PEOPLE_BEATRIZ, cost: 2412, state: 'up',       tags: ['T1','fraud','prod'] },
    { id: 'lambda-webhook-replay-p3',     type: 'fn',        region: 'sa-east-1a', owner: PEOPLE_DIEGO,   cost: 1840, state: 'up',       tags: ['T2','open-finance','prod'] },
    { id: 'rds-identity-replica-r4',      type: 'database',  region: 'sa-east-1b', owner: PEOPLE_CAMILA,  cost: 1764, state: 'up',       tags: ['T1','identity','prod','replica'] },
    { id: 'eks-prod-kyc-orch-2f1',        type: 'container', region: 'sa-east-1c', owner: PEOPLE_MARIANA, cost: 1582, state: 'up',       tags: ['T1','onboarding','prod'] },
    { id: 'sqs-notifications-fifo',       type: 'queue',     region: 'sa-east-1a', owner: PEOPLE_MARIANA, cost: 1241, state: 'up',       tags: ['T2','onboarding','prod','fifo'] },
    { id: 'lambda-cost-allocator-c2',     type: 'fn',        region: 'sa-east-1c', owner: PEOPLE_LARISSA, cost: 982,  state: 'up',       tags: ['T3','telemetry','batch','unt'] },
    { id: 'rds-consent-vault-w19',        type: 'database',  region: 'sa-east-1a', owner: PEOPLE_DIEGO,   cost: 924,  state: 'up',       tags: ['T1','open-finance','prod','encrypted'] },
    { id: 'eks-prod-doc-vault-d3',        type: 'container', region: 'sa-east-1b', owner: PEOPLE_MARIANA, cost: 812,  state: 'up',       tags: ['T2','onboarding','prod'] },
    { id: 'lambda-data-export-q8',        type: 'fn',        region: 'sa-east-1c', owner: PEOPLE_LARISSA, cost: 612,  state: 'degraded', tags: ['T3','datalab','batch','unt'] },
    { id: 'sqs-audit-log-stream',         type: 'queue',     region: 'sa-east-1a', owner: PEOPLE_THIAGO,  cost: 488,  state: 'up',       tags: ['T1','risk','audit','prod'] },
  ];

  const TYPE_ICONS = { container: 'container', database: 'database', queue: 'queue', fn: 'fn' };
  const TYPE_LABELS = { container: 'Container', database: 'Database', queue: 'Queue', fn: 'Function' };

  // Cost by service group — top 6
  const COST_BY_SERVICE = [
    { name: 'pix-router',     cost: 8200 },
    { name: 'identity-svc',   cost: 6850 },
    { name: 'bureau-gateway', cost: 5410 },
    { name: 'fraud-engine',   cost: 4520 },
    { name: 'consent-vault',  cost: 3180 },
    { name: 'kyc-orchestrator', cost: 2390 },
  ];
  const maxCost = Math.max(...COST_BY_SERVICE.map(c => c.cost));

  const PROVIDERS = [
    { key: 'aws',   label: 'AWS',   count: 1218 },
    { key: 'gcp',   label: 'GCP',   count: 142 },
    { key: 'azure', label: 'Azure', count: 38 },
  ];

  const FILTER_PILLS = [
    { group: 'Region',       value: 'All regions' },
    { group: 'Service type', value: 'All types' },
    { group: 'Owner',        value: 'Any owner' },
    { group: 'Cost band',    value: 'Any cost' },
  ];

  const COLUMNS = [
    {
      id: 'id', label: 'Resource ID',
      render: (r) => <CopyChip value={r.id} label={r.id}/>,
    },
    {
      id: 'type', label: 'Type',
      render: (r) => {
        const Icon = Icons[TYPE_ICONS[r.type]] || Icons.cloud;
        return (
          <span className="pill neutral" style={{display:'inline-flex', alignItems:'center', gap: 6}}>
            <Icon size={11}/> {TYPE_LABELS[r.type]}
          </span>
        );
      },
    },
    {
      id: 'region', label: 'Region',
      render: (r) => <span className="mono" style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)'}}>{r.region}</span>,
    },
    {
      id: 'owner', label: 'Owner',
      render: (r) => <OwnerPill person={r.owner}/>,
    },
    {
      id: 'cost', label: '$ / month', align: 'right' as const,
      render: (r) => <span className="mono" style={{fontWeight: 600}}>${r.cost.toLocaleString()}</span>,
    },
    {
      id: 'state', label: 'Status',
      render: (r) => <HealthBadge state={r.state} pulse={r.state === 'degraded'}/>,
    },
    {
      id: 'tags', label: 'Tags',
      render: (r) => (
        <div style={{display:'inline-flex', gap: 4, flexWrap:'wrap'}}>
          {r.tags.slice(0, 3).map(t => <span key={t} className="chip" style={{fontSize: 'var(--text-xs)'}}>{t}</span>)}
          {r.tags.length > 3 && <span className="chip" style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>+{r.tags.length - 3}</span>}
        </div>
      ),
    },
  ];

  const App = () => {
    const [provider, setProvider] = React.useState('aws');
    const [query, setQuery] = React.useState('');

    const filtered = React.useMemo(() => {
      if (!query) return RESOURCES;
      const q = query.toLowerCase();
      return RESOURCES.filter(r =>
        r.id.toLowerCase().includes(q) ||
        r.region.toLowerCase().includes(q) ||
        r.tags.some(t => t.toLowerCase().includes(q)));
    }, [query]);

    return (
      <FShell
        nav="cloud"
        crumbs={[{ label: 'Forge', href: '/example/ai-insights' }, 'Cloud', 'Inventory']}>

        <FPageHeader
          title="Cloud inventory · sa-east-1 · 1.4k resources"
          subtitle="3 providers · 24 services · monthly run-rate $42,180 · 18% untagged"
          actions={
            <>
              <button className="btn ghost"><Icons.calendar size={13}/> Last 30 days</button>
              <button className="btn ghost"><Icons.download size={13}/> Export CSV</button>
              <button className="btn ember"><Icons.refresh size={13}/> Sync now</button>
            </>
          }/>

        {/* 4 KPIs */}
        <div className="fp-grid fp-grid-4">
          <FKpi label="Total resources" value="1,398"
                sub={<span style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>Across 3 providers · 8 AZs</span>}
                trendNode={<Trend delta={4} unit="%"/>}/>
          <FKpi label="Monthly cost"
                value={<span><span style={{fontSize: 'var(--text-xl)', color:'var(--fg-muted)', fontWeight: 500}}>$</span>42,180</span>}
                sub={<span style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>Run-rate · this month</span>}
                trendNode={<Trend delta={6} unit="%" inverted/>}/>
          <FKpi label="Untagged"
                value={<span style={{color:'var(--warning)'}}>248</span>}
                sub={<span style={{fontSize: 'var(--text-xs)', color:'var(--warning)'}}><Icons.alert size={11}/> Policy violation · open tickets</span>}
                trendNode={<Trend delta={18} unit="%" inverted/>}/>
          <FKpi label="Pending right-size"
                value="32"
                sub={<span style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>~$6,420 / mo saving estimate</span>}
                trendNode={<Trend delta={-12} unit="%"/>}/>
        </div>

        {/* Provider tabs */}
        <div className="fp-tabs" style={{marginTop: 18}}>
          {PROVIDERS.map(p => (
            <button key={p.key}
                    className={'fp-tab' + (provider === p.key ? ' is-active' : '')}
                    onClick={() => setProvider(p.key)}>
              {p.label}
              <span style={{
                marginInlineStart: 8,
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: 'var(--fg-muted)',
              }}>{p.count.toLocaleString()}</span>
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{display:'flex', gap: 10, marginBottom: 16, alignItems:'center', flexWrap:'wrap'}}>
          <div className="in-group sm" style={{flex: 1, minWidth: 280, maxWidth: 460}}>
            <span className="in-addon icon"><Icons.search size={13}/></span>
            <input className="in-control" placeholder="Filter by id, region, tag..."
                   value={query} onChange={(e) => setQuery(e.target.value)}/>
            <span className="in-addon" style={{padding:'0 8px'}}>
              <span className="kbd" style={{fontSize: 'var(--text-xs)'}}>⌘K</span>
            </span>
          </div>
          {FILTER_PILLS.map(f => (
            <button key={f.group} className="pill neutral" style={{cursor:'pointer', border:'1px solid var(--border)'}}>
              <Icons.filter size={11}/>
              {f.group} <span style={{color:'var(--fg-muted)'}}>· {f.value}</span>
              <Icons.chevronDown size={10}/>
            </button>
          ))}
        </div>

        {/* Body: table 2 | cost chart 1 */}
        <div className="fp-grid fp-grid-2x1" style={{alignItems:'start', gap: 18}}>
          <div className="fp-card" style={{padding: 0}}>
            <DataTable columns={COLUMNS} rows={filtered} rowKey={(r) => r.id}/>
            <div style={{padding: '10px 14px', borderTop: '1px solid var(--border)', fontSize: 'var(--text-sm)', color:'var(--fg-muted)', display:'flex', justifyContent:'space-between'}}>
              <span>{filtered.length} of {RESOURCES.length} shown · paged from 1,218 total in AWS</span>
              <span className="mono">Σ ${filtered.reduce((s, r) => s + r.cost, 0).toLocaleString()} / mo</span>
            </div>
          </div>

          <div style={{display:'flex', flexDirection:'column', gap: 14}}>
            {/* Cost by service */}
            <div className="fp-card">
              <div className="fp-card-head">
                <div className="fp-card-title">Cost by service · top 6</div>
                <span className="pill neutral">monthly</span>
              </div>
              <div style={{display:'flex', flexDirection:'column', gap: 10}}>
                {COST_BY_SERVICE.map((s) => {
                  const pct = (s.cost / maxCost) * 100;
                  return (
                    <div key={s.name}>
                      <div style={{display:'flex', justifyContent:'space-between', fontSize: 'var(--text-sm)', marginBottom: 4}}>
                        <span className="mono" style={{color:'var(--ember)'}}>{s.name}</span>
                        <span className="mono" style={{color:'var(--fg-muted)'}}>${s.cost.toLocaleString()}</span>
                      </div>
                      <div style={{
                        height: 8,
                        background: 'var(--surface-active, var(--surface-strong))',
                        borderRadius: 'var(--radius-lg)',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          width: pct + '%',
                          height: '100%',
                          background: 'var(--ember)',
                          opacity: 0.85,
                          borderRadius: 'var(--radius-lg)',
                          transition: 'width 600ms var(--ease)',
                        }}/>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{borderTop: '1px solid var(--border)', marginTop: 12, paddingTop: 10, fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>
                These 6 services account for <span style={{color:'var(--fg)'}}>74%</span> of total cloud spend in sa-east-1.
              </div>
            </div>

            {/* Spend trend */}
            <div className="fp-card">
              <div className="fp-card-head">
                <div className="fp-card-title">Spend · 30 days</div>
                <Trend delta={6} unit="%" inverted/>
              </div>
              <Sparkline data={[38200, 39400, 38900, 40100, 40800, 41200, 41900, 42100, 41800, 42180]} w={280} h={56}/>
              <div style={{display:'flex', justifyContent:'space-between', fontSize: 'var(--text-xs)', color:'var(--fg-muted)', marginTop: 8}}>
                <span>$38.2k → $42.2k</span>
                <span className="mono" style={{color:'var(--warning)'}}>+$3,980</span>
              </div>
            </div>
          </div>
        </div>
      </FShell>
    );
  };

  
  export default App;
