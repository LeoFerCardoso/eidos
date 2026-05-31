'use client';
import * as React from 'react';
import { Avatar, Banner, HealthBadge, Icons, MOCKS, MetricCard, OwnerPill, RelativeTime, SeverityPill, Sparkline, StatusDot, Trend } from '@/ds/core';
import { FKpi, FPageHeader, FSection, FShell, IconBubble } from './example-shell';
// Eidos IDP — Example: AI Insights home (Eidos agent's daily consolidated view).
//
// This is the landing page of Eidos. The Eidos agent watches the entire tech
// estate and surfaces the 5–8 things that matter today: arch drift, risky PRs,
// cost spikes, gate violations, suggested actions. The user lands here in the
// morning instead of crawling 7 dashboards.

  
  
  
  
  
  const INSIGHTS = MOCKS.INSIGHTS || [];
  const PEOPLE = MOCKS.PEOPLE || [];
  const SERVICES = MOCKS.SERVICES || [];
  const PRS = MOCKS.PRS || [];

  // ---------- Hero stripe — Eidos agent says ---------- //
  const HERO_HEADLINE = '3 things demand attention today';
  const HERO_LINES = [
    {
      kind: 'drift',
      icon: 'gitFork',
      title: 'pix-router introduced sync coupling to bureau-gateway',
      detail: 'Violates ADR-006 (async-first). Fan-out latency +80ms p95 under peak load.',
      severity: 'P1',
      action: 'View ADR',
    },
    {
      kind: 'risk',
      icon: 'shield',
      title: 'PR #7419 (bureau-gateway refactor) — Change Risk Score 71 / 100',
      detail: 'Cyclomatic complexity 14, coverage delta -2.8%, blast Ring 0→4. Auto-blocked.',
      severity: 'P0',
      action: 'Open PR',
    },
    {
      kind: 'cost',
      icon: 'cloud',
      title: 'data-export egress +340% week-over-week',
      detail: 'New merchant nightly job is the likely cause. ~R$ 18.4k extra spend this month.',
      severity: 'P2',
      action: 'Inspect job',
    },
  ];

  // ---------- KPI row ---------- //
  const HEALTH_SERIES = [92, 90, 91, 92, 93, 92, 94];
  const RISK_SERIES = [42, 48, 51, 47, 44, 41, 38];
  const VELOCITY_SERIES = [110, 118, 125, 130, 134, 138, 142];
  const COST_SERIES = [380, 392, 408, 415, 422, 444, 488];

  // ---------- Insights feed ---------- //
  const KIND_META = {
    drift: { tone: 'severity-p2', label: 'Drift detected', icon: 'gitFork' },
    pr: { tone: 'ember', label: 'PR review', icon: 'gitPullRequest' },
    cost: { tone: 'severity-p2', label: 'Cost anomaly', icon: 'cloud' },
    incident: { tone: 'severity-p0', label: 'Incident', icon: 'alert' },
    flag: { tone: 'ice', label: 'Flag activity', icon: 'flag' },
  };

  const VERDICT_META = {
    ship: { tone: 'status-done', label: 'Ship it', dot: 'done' },
    block: { tone: 'status-error', label: 'Auto-blocked', dot: 'error' },
    revise: { tone: 'status-pending', label: 'Needs revision', dot: 'pending' },
  };

  // Curated extra insights to round out the feed
  const FEED = [
    ...INSIGHTS,
    {
      id: 'i7', kind: 'incident', when: '8m ago',
      title: 'fraud-engine p99 latency above SLO for the last 14 minutes',
      body: 'Likely correlated with ml-feature-store cache miss spike. Auto-runbook rb-fraud-replay armed.',
      service: 'fraud-engine',
    },
    {
      id: 'i8', kind: 'flag', when: '32m ago',
      title: 'Flag biometric-stepup advanced from Ring 1 to Ring 2',
      body: 'Auto-promote triggered after 30 minutes at error rate <0.05%. 4,128 users affected.',
      service: 'identity-svc',
    },
    {
      id: 'i9', kind: 'drift', when: '3h ago',
      title: 'risk-rules now imports score-engine — circular dependency forming',
      body: 'A direct call was added in PR #7402. The longer path will be hard to refactor later. Recommend extracting a shared rule schema.',
      service: 'risk-rules', adr: 'ADR-002',
    },
  ];

  const personByPrefix = (prefix) => PEOPLE.find(p => p.name && p.name.startsWith(prefix)) || PEOPLE[0];
  const serviceByName = (name) => SERVICES.find(s => s.name === name);

  // ---------- Right column — Today's priorities ---------- //
  const PRIORITIES = [
    { id: 'p1', title: 'Approve GMUD-2026-0418 · pix-router 100% rollout', meta: 'Window opens Wed 02:00 BRT', kind: 'gmud' },
    { id: 'p2', title: 'Review PR #7418 · biometric step-up (no ADR yet)', meta: 'Needs your decision', kind: 'pr' },
    { id: 'p3', title: 'Sign off ADR-007 · Eidos as system of record', meta: 'Proposed by Leonardo', kind: 'adr' },
    { id: 'p4', title: 'Triage cost spike · data-export egress +340%', meta: 'Owner notified', kind: 'cost' },
  ];

  const PRIORITY_ICONS = { gmud: 'shield', pr: 'gitPullRequest', adr: 'book', cost: 'cloud' };

  // ---------- Tribe pulse strip ---------- //
  const TRIBE_STRIP = [
    { name: 'Pix', eti: 87, delta: 3, alert: false },
    { name: 'Risk', eti: 86, delta: 2, alert: true },
    { name: 'Identity', eti: 89, delta: 4, alert: false },
    { name: 'Onboarding', eti: 81, delta: 2, alert: false },
    { name: 'Fraud', eti: 82, delta: 1, alert: false },
    { name: 'Open Finance', eti: 84, delta: 5, alert: false },
  ];

  // ---------- Component ---------- //
  const App = () => {
    return (
      <FShell
        nav="home"
        crumbs={['Eidos', 'Home']}
        onAgentChat={() => { window.location.href = '/example/agent-chat'; }}>

        <FPageHeader
          title={<><Icons.sparkle size={20} style={{color:'var(--ember)'}}/> Good morning, Leonardo</>}
          subtitle="Eidos agent has scanned 142 services, 18 tribes, 8,402 events since you last checked"
          actions={
            <>
              <button className="btn ghost"><Icons.refresh size={13}/> Refresh</button>
              <button className="btn ghost"><Icons.calendar size={13}/> Today</button>
              <a className="btn primary" href="/example/agent-chat"><Icons.sparkle size={13}/> Ask Eidos</a>
            </>
          }/>

        {/* ---------- Hero: Eidos agent summary ---------- */}
        <div className="fp-hero--ember">
          <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 14}}>
            <IconBubble icon="sparkle" size={28}/>
            <strong style={{fontSize: 'var(--text-body)', letterSpacing:'-0.005em'}}>{HERO_HEADLINE}</strong>
            <span className="pill" style={{marginInlineStart:'auto'}}>
              <Icons.clock size={11}/> updated 2m ago
            </span>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 14}}>
            {HERO_LINES.map((l, i) => {
              const Ic = Icons[l.icon] || Icons.alert;
              return (
                <div key={i} style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 14,
                }}>
                  <div style={{display:'flex', alignItems:'center', gap: 8, marginBottom: 8}}>
                    <Ic size={14} style={{color:'var(--fg-muted)'}}/>
                    <SeverityPill level={l.severity as any}/>
                  </div>
                  <div style={{fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--fg)', marginBottom: 6, lineHeight: 1.35}}>{l.title}</div>
                  <div style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', lineHeight: 1.55, marginBottom: 12}}>{l.detail}</div>
                  <button className="btn ghost" style={{fontSize: 'var(--text-xs)'}}>
                    {l.action} <Icons.arrowRight size={11}/>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---------- KPI row ---------- */}
        <div className="fp-grid fp-grid-4">
          <FKpi label="Estate health" value="92"
            sub={<Sparkline data={HEALTH_SERIES} w={200} h={32} color="var(--success)"/>}
            trendNode={<Trend delta={2} unit="pts"/>}/>
          <FKpi label="Change risk avg" value="38"
            sub={<Sparkline data={RISK_SERIES} w={200} h={32} color="var(--warning)"/>}
            trendNode={<Trend delta={-9} unit="pts" inverted/>}/>
          <FKpi label="Deploys / week" value="142"
            sub={<Sparkline data={VELOCITY_SERIES} w={200} h={32}/>}
            trendNode={<Trend delta={24} unit="%"/>}/>
          <FKpi label="Cloud spend / day" value="R$ 488"
            sub={<Sparkline data={COST_SERIES} w={200} h={32} color="var(--danger)"/>}
            trendNode={<Trend delta={28} unit="%" inverted/>}/>
        </div>

        {/* ---------- 2-column: feed + sidebar ---------- */}
        <div className="fp-grid fp-grid-2x1" style={{marginTop: 22, alignItems:'flex-start'}}>

          {/* Left — Insights feed */}
          <div>
            <FSection title="Agent insights · ranked by impact">
              <div style={{display:'flex', flexDirection:'column', gap: 10}}>
                {FEED.map((it) => {
                  const meta = KIND_META[it.kind] || KIND_META.drift;
                  const Ic = Icons[meta.icon] || Icons.alert;
                  const svc = serviceByName(it.service);
                  return (
                    <div key={it.id} className="fp-card" style={{padding: 16}}>
                      <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 10}}>
                        <span style={{
                          width: 26, height: 26, borderRadius: 'var(--radius-xl)',
                          background: 'var(--surface-active)',
                          display:'inline-flex', alignItems:'center', justifyContent:'center',
                          color:'var(--fg-muted)',
                        }}>
                          <Ic size={13}/>
                        </span>
                        <span className={'pill ' + meta.tone}>{meta.label}</span>
                        {it.service && (
                          <span className="chip mono" style={{fontSize: 'var(--text-xs)'}}>{it.service}</span>
                        )}
                        {it.adr && (
                          <span className="chip mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>
                            {it.adr}
                          </span>
                        )}
                        {it.verdict && (
                          <span className={'pill ' + (VERDICT_META[it.verdict] || {}).tone}>
                            <StatusDot tone={(VERDICT_META[it.verdict] || {}).dot} size="sm"/>
                            {(VERDICT_META[it.verdict] || {}).label}
                          </span>
                        )}
                        <span style={{marginInlineStart:'auto', fontSize: 'var(--text-xs)', color:'var(--fg-faint)', fontFamily:'var(--font-mono)'}}>
                          {it.when}
                        </span>
                      </div>
                      <div style={{fontWeight: 600, fontSize: 'var(--text-base)', marginBottom: 6, lineHeight: 1.4}}>
                        {it.title}
                      </div>
                      <div style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', lineHeight: 1.6, marginBottom: 12}}>
                        {it.body}
                      </div>
                      <div style={{display:'flex', alignItems:'center', gap: 8, paddingTop: 10, borderTop: '1px solid var(--border)'}}>
                        <button className="btn ghost" style={{fontSize: 'var(--text-xs)'}}>
                          <Icons.eye size={11}/> Open
                        </button>
                        <button className="btn ghost" style={{fontSize: 'var(--text-xs)'}}>
                          <Icons.sparkle size={11}/> Ask Eidos
                        </button>
                        <button className="btn ghost" style={{fontSize: 'var(--text-xs)'}}>
                          <Icons.check size={11}/> Mark resolved
                        </button>
                        <span style={{marginInlineStart:'auto', fontSize: 'var(--text-xs)', color:'var(--fg-faint)'}}>
                          {svc && svc.tribe ? <span className="mono">{svc.tribe}</span> : ''}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </FSection>
          </div>

          {/* Right — Today's priorities + Tribe pulse */}
          <div style={{display:'flex', flexDirection:'column', gap: 14}}>

            <div className="fp-card" style={{padding: 0}}>
              <div style={{padding:'14px 16px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                <div className="fp-card-title">Today's priorities</div>
                <span className="badge">{PRIORITIES.length}</span>
              </div>
              <div style={{padding: 8}}>
                {PRIORITIES.map((p, i) => {
                  const ic = PRIORITY_ICONS[p.kind] || 'circle';
                  const Ic = Icons[ic];
                  return (
                    <div key={p.id} style={{
                      padding: '10px 10px',
                      borderRadius: 'var(--radius-2xl)',
                      display:'flex', gap: 10,
                      alignItems:'flex-start',
                      cursor:'pointer',
                    }}>
                      <Ic size={14} style={{color:'var(--ember)', marginTop: 2}}/>
                      <div style={{flex:1, minWidth: 0}}>
                        <div style={{fontSize: 'var(--text-sm)', fontWeight: 500, lineHeight: 1.4, marginBottom: 2}}>{p.title}</div>
                        <div style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>{p.meta}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="fp-card">
              <div className="fp-card-head">
                <div className="fp-card-title">Tribe pulse</div>
                <span style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)', fontFamily:'var(--font-mono)'}}>ETI</span>
              </div>
              <div style={{display:'flex', flexDirection:'column', gap: 6}}>
                {TRIBE_STRIP.map((t) => (
                  <div key={t.name} style={{
                    display:'flex', alignItems:'center', gap: 10,
                    padding: '6px 4px',
                  }}>
                    <span style={{fontSize: 'var(--text-sm)', fontWeight: 500, minWidth: 88}}>{t.name}</span>
                    <div style={{flex: 1, height: 6, borderRadius: 'var(--radius-xs)', background: 'var(--surface-active)', overflow:'hidden'}}>
                      <div style={{
                        height: '100%',
                        width: t.eti + '%',
                        background: t.alert ? 'var(--warning)' : 'var(--ember)',
                        borderRadius: 'var(--radius-xs)',
                      }}/>
                    </div>
                    <span className="mono" style={{fontSize: 'var(--text-sm)', minWidth: 28, textAlign:'right'}}>{t.eti}</span>
                    <Trend delta={t.delta} unit="pts" variant="badge"/>
                  </div>
                ))}
              </div>
            </div>

            <div className="fp-card fp-card--ember">
              <div style={{display:'flex', alignItems:'center', gap: 8, marginBottom: 8}}>
                <Icons.sparkle size={14} style={{color:'var(--ember)'}}/>
                <strong style={{fontSize: 'var(--text-base)'}}>Eidos weekly digest</strong>
              </div>
              <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', lineHeight: 1.6, margin: 0, marginBottom: 10}}>
                MTTR is down 54% this quarter and AI Adoption crossed the 75 threshold. 38 manual gates were auto-promoted by Eidos — saving an estimated 14 engineering hours.
              </p>
              <button className="btn ghost" style={{fontSize: 'var(--text-xs)'}}>
                Read full digest <Icons.arrowRight size={11}/>
              </button>
            </div>

          </div>
        </div>

      </FShell>
    );
  };

  
  export default App;
