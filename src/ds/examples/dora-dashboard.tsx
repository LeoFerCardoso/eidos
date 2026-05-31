'use client';
import * as React from 'react';
import { Banner, DataTable, HealthBadge, Icons, MOCKS, OwnerPill, RelativeTime, Sparkline, StatusDot, Trend } from '@/ds/core';
import { FKpi, FPageHeader, FSection, FShell } from './example-shell';
// Eidos IDP — Example: DORA Engineering Pulse dashboard.

  
  
  
  
  
  const DEPLOYS = MOCKS.DEPLOYS || [];
  const PEOPLE = MOCKS.PEOPLE || [];

  const peopleByName = (name) => PEOPLE.find(p => p.name === name) || PEOPLE[0];

  // DORA KPIs — 4 series of 7 daily samples
  const deploysSeries = [12, 18, 15, 22, 19, 24, 28];
  const leadSeries = [4.1, 3.6, 3.2, 2.9, 2.5, 2.2, 1.9];
  const cfrSeries = [11, 9, 10, 8, 7, 6, 6];
  const mttrSeries = [52, 47, 41, 36, 33, 28, 24];

  // 12 day deploys-per-day chart
  const DAYS = [
    { day: 'Mon', n: 10 }, { day: 'Tue', n: 14 }, { day: 'Wed', n: 17 },
    { day: 'Thu', n: 13 }, { day: 'Fri', n: 22 }, { day: 'Sat', n: 4 },
    { day: 'Sun', n: 2 }, { day: 'Mon', n: 18 }, { day: 'Tue', n: 25 },
    { day: 'Wed', n: 19 }, { day: 'Thu', n: 24 }, { day: 'Fri', n: 28 },
  ];
  const maxN = Math.max(...DAYS.map(d => d.n));

  const STATUS_TONE = {
    success: { tone: 'status-done', label: 'Success', dot: 'done' },
    'in-flight': { tone: 'status-running', label: 'In-flight', dot: 'running' },
    'rolled-back': { tone: 'status-error', label: 'Rolled back', dot: 'error' },
  };

  const COLUMNS = [
    {
      id: 'id', label: 'Run',
      render: (r) => <span className="mono" style={{fontWeight: 600}}>{r.id}</span>,
    },
    {
      id: 'service', label: 'Service',
      render: (r) => <span className="mono" style={{color:'var(--ember)'}}>{r.service}</span>,
    },
    {
      id: 'version', label: 'Version',
      render: (r) => <span className="mono" style={{color:'var(--fg-muted)'}}>{r.version}</span>,
    },
    {
      id: 'stage', label: 'Stage',
      render: (r) => r.stage,
    },
    {
      id: 'author', label: 'Author',
      render: (r) => <OwnerPill person={peopleByName(r.author)}/>,
    },
    {
      id: 'status', label: 'Status',
      render: (r) => {
        const s = STATUS_TONE[r.status] || STATUS_TONE.success;
        return <span className={'pill ' + s.tone}><StatusDot tone={s.dot} size="sm" pulse={s.dot === 'running'}/> {s.label}</span>;
      },
    },
    {
      id: 'started', label: 'Started', align: 'right' as const,
      render: (r) => <span style={{color:'var(--fg-muted)', fontSize: 'var(--text-sm)'}}>{r.started}</span>,
    },
  ];

  const App = () => (
    <FShell
      nav="dora"
      crumbs={[{ label: 'Eidos', href: '/example/ai-insights' }, 'DORA', 'Engineering pulse']}>

      <FPageHeader
        title="DORA · Engineering pulse"
        subtitle="7 days · 24 services · 18 tribes — all 4 metrics trending toward Elite"
        actions={
          <>
            <button className="btn ghost"><Icons.calendar size={13}/> 7 days</button>
            <button className="btn ghost"><Icons.download size={13}/> Export</button>
            <button className="btn ghost"><Icons.share size={13}/> Share</button>
          </>
        }/>

      <Banner
        tone="success"
        icon="shield"
        title="Window of stability"
        message="No P0 incidents in the trailing 7 days. Deploy throughput +24%, MTTR -54%. Eidos auto-promote saved 38 manual gates."/>

      {/* 4 KPI row */}
      <div className="fp-grid fp-grid-4" style={{marginTop: 18}}>
        <FKpi
          label="Deploys / week"
          value="142"
          sub={<Sparkline data={deploysSeries} w={200} h={32}/>}
          trendNode={<Trend delta={24} unit="%"/>}/>
        <FKpi
          label="Lead time for changes"
          value="1.9h"
          sub={<Sparkline data={leadSeries} w={200} h={32} color="var(--success)"/>}
          trendNode={<Trend delta={-31} unit="%" inverted/>}/>
        <FKpi
          label="Change-fail rate"
          value="6%"
          sub={<Sparkline data={cfrSeries} w={200} h={32} color="var(--warning)"/>}
          trendNode={<Trend delta={-5} unit="pp" inverted/>}/>
        <FKpi
          label="MTTR"
          value="24m"
          sub={<Sparkline data={mttrSeries} w={200} h={32} color="var(--accent-2)"/>}
          trendNode={<Trend delta={-54} unit="%" inverted/>}/>
      </div>

      {/* Chart row */}
      <div className="fp-grid fp-grid-2x1" style={{marginTop: 18}}>
        {/* Bar chart */}
        <div className="fp-card">
          <div className="fp-card-head">
            <div className="fp-card-title">Deploys per day</div>
            <div style={{display:'inline-flex', gap: 12, fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>
              <span style={{display:'inline-flex', alignItems:'center', gap: 4}}><span style={{width: 8, height: 8, borderRadius: 2, background:'var(--ember)'}}/> deploys</span>
              <span style={{display:'inline-flex', alignItems:'center', gap: 4}}><span style={{width: 8, height: 8, borderRadius: 2, background:'var(--surface-active)'}}/> weekend</span>
            </div>
          </div>
          <div style={{display:'flex', alignItems:'flex-end', gap: 10, height: 200, padding: '12px 4px 6px', borderBottom: '1px solid var(--border)'}}>
            {DAYS.map((d, i) => {
              const isWeekend = d.day === 'Sat' || d.day === 'Sun';
              const h = (d.n / maxN) * 170;
              return (
                <div key={i} style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap: 4}}>
                  <span style={{fontSize: 'var(--text-xs)', color:'var(--fg-faint)', fontFamily:'var(--font-mono)'}}>{d.n}</span>
                  <div style={{
                    width: '100%',
                    height: Math.max(4, h),
                    background: isWeekend ? 'var(--surface-active)' : 'var(--ember)',
                    borderRadius: '4px 4px 0 0',
                    opacity: isWeekend ? 0.55 : 0.85,
                    transition: 'height 600ms var(--ease)',
                  }}/>
                </div>
              );
            })}
          </div>
          <div style={{display:'flex', gap: 10, padding: '8px 4px 0', fontSize: 'var(--text-xs)', color:'var(--fg-muted)', fontFamily:'var(--font-mono)'}}>
            {DAYS.map((d, i) => (
              <div key={i} style={{flex:1, textAlign:'center'}}>{d.day}</div>
            ))}
          </div>
        </div>

        {/* P95 lead time */}
        <div className="fp-card" style={{display:'flex', flexDirection:'column', gap: 14}}>
          <div className="fp-card-head">
            <div className="fp-card-title">P95 lead time</div>
            <HealthBadge state="up" label="Elite"/>
          </div>
          <div>
            <div style={{fontSize: 'var(--text-display)', fontWeight: 700, letterSpacing: '-0.02em', fontFamily:'var(--font-mono)', color:'var(--ember)'}}>3.2h</div>
            <div style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', marginTop: -4}}>P95 from PR open to production</div>
          </div>
          <p style={{fontSize: 'var(--text-sm)', lineHeight: 1.6, color: 'var(--fg-muted)', margin: 0}}>
            95% of changes ship in under <strong style={{color:'var(--fg)'}}>3 hours 12 minutes</strong>. The slowest 5% are gated by Risk reviews on T1 services — expected. This puts the organization in the <strong style={{color:'var(--success)'}}>Elite</strong> band of the DORA benchmark.
          </p>
          <div style={{borderTop:'1px solid var(--border)', paddingTop: 12, display:'flex', justifyContent:'space-between', fontSize: 'var(--text-sm)', color:'var(--fg-muted)'}}>
            <span>P50</span><span className="mono">1.9h</span>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', fontSize: 'var(--text-sm)', color:'var(--fg-muted)'}}>
            <span>P95</span><span className="mono">3.2h</span>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', fontSize: 'var(--text-sm)', color:'var(--fg-muted)'}}>
            <span>P99</span><span className="mono">7.4h</span>
          </div>
        </div>
      </div>

      {/* Recent deploys */}
      <FSection title="Recent deploys" style={{marginTop: 18}}>
        <div className="fp-card" style={{padding: 0}}>
          <DataTable columns={COLUMNS} rows={DEPLOYS} rowKey={(r) => r.id}/>
        </div>
      </FSection>
    </FShell>
  );

  
  export default App;
