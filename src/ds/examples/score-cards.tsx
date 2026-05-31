'use client';
import * as React from 'react';
import { DataTable, Icons, LangBadge, MOCKS, OwnerPill, ScoreGauge, Sparkline, TierBadge, Trend } from '@/ds/core';
import { FKpi, FPageHeader, FSection, FShell } from './example-shell';
// Eidos IDP — Example: Service score cards (Backstage Tech Insights-style).

  
  
  
  
  
  const SERVICES = MOCKS.SERVICES || [];
  const PEOPLE = MOCKS.PEOPLE || [];

  const peopleByTribe = (tribe) =>
    PEOPLE.find(p => p.role && p.role.includes(tribe)) || PEOPLE[0];

  // Synthesize a deterministic score per service · pillar
  const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); };
  const scoreFor = (svc, pillar) => {
    const base = Math.round(((svc.coverage || 70) * 0.6) + ((100 - (svc.p95 || 100) / 6) * 0.3) + 10);
    const drift = (hash(svc.id + pillar) % 26) - 13;
    return Math.max(35, Math.min(99, base + drift));
  };

  const PILLARS = ['Reliability', 'Performance', 'Security', 'Maintainability', 'Observability'];

  const buildRows = () => SERVICES.slice(0, 12).map((svc) => {
    const pillarScores = PILLARS.reduce((acc, p) => { acc[p] = scoreFor(svc, p); return acc; }, {});
    const overall = Math.round(PILLARS.reduce((m, p) => m + pillarScores[p], 0) / PILLARS.length);
    const series = Array.from({ length: 12 }).map((_, i) => Math.max(30, Math.min(100, overall - 6 + ((hash(svc.id + i) % 13) - 6))));
    const trend = series[series.length - 1] - series[0];
    return { svc, pillarScores, overall, series, trend };
  });

  const ROWS = buildRows();

  const overallBand = (n) => n >= 80 ? 'ember' : n >= 60 ? 'neutral' : 'status-error';

  const COLUMNS = [
    {
      id: 'service', label: 'Service',
      render: (r) => (
        <div style={{display:'flex', flexDirection:'column', gap: 2}}>
          <span style={{fontWeight: 600}}>{r.svc.name}</span>
          <span style={{display:'inline-flex', gap: 6, alignItems:'center'}}>
            <LangBadge lang={r.svc.lang}/>
            <TierBadge tier={r.svc.tier}/>
          </span>
        </div>
      ),
    },
    {
      id: 'overall', label: 'Overall', width: 140,
      render: (r) => (
        <div style={{width: 130}}>
          <ScoreGauge variant="linear" value={r.overall} min={0} max={100}/>
        </div>
      ),
    },
    ...PILLARS.map((p) => ({
      id: p, label: p,
      render: (r) => {
        const v = r.pillarScores[p];
        const tone = v >= 80 ? 'status-done' : v >= 60 ? 'status-warning' : 'status-error';
        return <span className={'pill ' + tone} style={{minWidth: 42, justifyContent:'center'}}>{v}</span>;
      },
    })),
    {
      id: 'trend', label: 'Trend',
      render: (r) => <Trend delta={r.trend} unit="" variant="triangle"/>,
    },
    {
      id: 'owner', label: 'Owner',
      render: (r) => <OwnerPill person={peopleByTribe(r.svc.tribe)}/>,
    },
    {
      id: 'action', label: '', align: 'right' as const,
      render: () => (
        <button className="btn ghost sm">Open <Icons.chevronRight size={11}/></button>
      ),
    },
  ];

  const TOP_MOVERS = ROWS
    .slice()
    .sort((a, b) => Math.abs(b.trend) - Math.abs(a.trend))
    .slice(0, 5);

  const FILTERS = ['All', 'Tier 1 only', 'My tribe · Identity', 'Below 70', 'Trending down'];

  const App = () => {
    const [filter, setFilter] = React.useState('All');

    return (
      <FShell
        nav="scores"
        crumbs={[{ label: 'Eidos', href: '/example/ai-insights' }, 'Score cards']}>

        <FPageHeader
          title="Service score cards · 142 services · 18 tribes"
          subtitle="5 pillars · Reliability · Performance · Security · Maintainability · Observability"
          actions={
            <>
              <button className="btn ghost"><Icons.filter size={13}/> Customize pillars</button>
              <button className="btn ghost"><Icons.download size={13}/> Export</button>
              <button className="btn ember"><Icons.plus size={13}/> New check</button>
            </>
          }/>

        {/* 4-FKpi row */}
        <div className="fp-grid fp-grid-4" style={{marginTop: 18}}>
          <FKpi
            label="Average score"
            value="78"
            sub={<Sparkline data={[71, 73, 74, 75, 76, 77, 78]} w={200} h={32}/>}
            trendNode={<Trend delta={2} unit=""/>}/>
          <FKpi
            label="Compliant · ≥ 80"
            value="61%"
            sub={<Sparkline data={[51, 53, 55, 58, 59, 60, 61]} w={200} h={32} color="var(--success)"/>}
            trendNode={<Trend delta={4} unit="pp"/>}/>
          <FKpi
            label="At risk · 60–79"
            value="28%"
            sub={<Sparkline data={[36, 35, 33, 32, 31, 29, 28]} w={200} h={32} color="var(--warning)"/>}
            trendNode={<Trend delta={-3} unit="pp" inverted/>}/>
          <FKpi
            label="Critical · < 60"
            value="11%"
            sub={<Sparkline data={[15, 14, 14, 13, 12, 11, 11]} w={200} h={32} color="var(--danger)"/>}
            trendNode={<Trend delta={-2} unit="pp" inverted/>}/>
        </div>

        {/* Filter chips */}
        <div style={{display:'flex', gap: 6, marginTop: 16, marginBottom: 14, flexWrap:'wrap', alignItems:'center'}}>
          {FILTERS.map((f) => (
            <button key={f}
                    onClick={() => setFilter(f)}
                    className={'pill ' + (filter === f ? 'ember' : 'neutral')}
                    style={{cursor:'pointer', border:'1px solid var(--border)', fontWeight: filter === f ? 600 : 500}}>
              {filter === f && <span className="dot"/>}
              {f}
            </button>
          ))}
          <button className="pill neutral" style={{cursor:'pointer', border:'1px dashed var(--border)', color:'var(--fg-muted)'}}>
            <Icons.plus size={11}/> Save view
          </button>
        </div>

        <div className="fp-grid fp-grid-2x1" style={{gap: 18}}>
          <FSection title="Scorecard">
            <div className="fp-card" style={{padding: 0}}>
              <DataTable columns={COLUMNS} rows={ROWS} rowKey={(r) => r.svc.id} dense/>
            </div>
          </FSection>

          <div style={{display:'flex', flexDirection:'column', gap: 14}}>
            <div className="fp-card">
              <div className="fp-card-head">
                <div className="fp-card-title">Top movers · 30d</div>
                <span className="pill ember">±score</span>
              </div>
              <ul style={{listStyle:'none', padding: 0, margin: 0, display:'flex', flexDirection:'column', gap: 10}}>
                {TOP_MOVERS.map((r) => (
                  <li key={r.svc.id} style={{display:'flex', alignItems:'center', gap: 10}}>
                    <div style={{flex: 1, display:'flex', flexDirection:'column', gap: 2}}>
                      <span style={{fontWeight: 600, fontSize: 'var(--text-base)'}}>{r.svc.name}</span>
                      <span style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>{r.svc.tribe}</span>
                    </div>
                    <Sparkline data={r.series} w={88} h={26} color={r.trend >= 0 ? 'var(--success)' : 'var(--danger)'}/>
                    <Trend delta={r.trend} unit="" variant="triangle"/>
                  </li>
                ))}
              </ul>
            </div>

            <div className="fp-card">
              <div className="fp-card-head">
                <div className="fp-card-title">Score bands</div>
              </div>
              <ul style={{listStyle:'none', padding: 0, margin: 0, display:'flex', flexDirection:'column', gap: 10, fontSize: 'var(--text-sm)'}}>
                <li style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                  <span style={{display:'inline-flex', alignItems:'center', gap: 8}}>
                    <span style={{width: 10, height: 10, borderRadius: 'var(--radius-full)', background:'var(--success)'}}/>
                    Excellent · 90–100
                  </span>
                  <span className="mono">28 services</span>
                </li>
                <li style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                  <span style={{display:'inline-flex', alignItems:'center', gap: 8}}>
                    <span style={{width: 10, height: 10, borderRadius: 'var(--radius-full)', background:'var(--ember)'}}/>
                    Compliant · 80–89
                  </span>
                  <span className="mono">59 services</span>
                </li>
                <li style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                  <span style={{display:'inline-flex', alignItems:'center', gap: 8}}>
                    <span style={{width: 10, height: 10, borderRadius: 'var(--radius-full)', background:'var(--warning)'}}/>
                    At risk · 60–79
                  </span>
                  <span className="mono">40 services</span>
                </li>
                <li style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                  <span style={{display:'inline-flex', alignItems:'center', gap: 8}}>
                    <span style={{width: 10, height: 10, borderRadius: 'var(--radius-full)', background:'var(--danger)'}}/>
                    Critical · {'<'} 60
                  </span>
                  <span className="mono">15 services</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </FShell>
    );
  };

  
  export default App;
