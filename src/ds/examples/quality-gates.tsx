'use client';
import * as React from 'react';
import { Banner, DataTable, Icons, MOCKS, OwnerPill, RelativeTime, ScoreGauge, SeverityPill, Stat, StatusDot } from '@/ds/core';
import { FPageHeader, FSection, FShell } from './example-shell';
// Forge IDP — Example: Quality gates + Change risk score (pre-merge view).

  
  
  
  
  
  const PRS = MOCKS.PRS || [];
  const PEOPLE = MOCKS.PEOPLE || [];

  const peopleByName = (name) => PEOPLE.find(p => p.name === name) || PEOPLE[0];

  // Gate config — 5 P0 gates per row
  const GATE_DEFS = [
    { id: 'cov', label: 'Coverage' },
    { id: 'lint', label: 'Lint' },
    { id: 'sast', label: 'SAST' },
    { id: 'sbom', label: 'SBOM' },
    { id: 'perf', label: 'Performance' },
  ];

  // Deterministic gate state per PR
  const gateStateFor = (pr, gid) => {
    if (pr.blocked && (gid === 'cov' || gid === 'sast')) return 'error';
    const seed = (pr.id + gid.charCodeAt(0)) % 7;
    if (pr.risk >= 60) return seed === 0 ? 'warning' : 'error';
    if (pr.risk >= 40) return seed % 3 === 0 ? 'warning' : 'done';
    return 'done';
  };

  const GATE_TONE_TO_DOT = { done: 'done', warning: 'warning', error: 'error' };

  const COLUMNS: any[] = [
    {
      id: 'pr', label: 'PR',
      render: (r) => (
        <span style={{display:'inline-flex', alignItems:'center', gap: 8}}>
          <span className="mono" style={{color:'var(--ember)', fontWeight: 600}}>#{r.id}</span>
          <span style={{color:'var(--fg)', fontWeight: 500, maxWidth: 320, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{r.title}</span>
        </span>
      ),
    },
    {
      id: 'author', label: 'Author',
      render: (r) => <OwnerPill person={peopleByName(r.author)}/>,
    },
    {
      id: 'risk', label: 'Risk', width: 140,
      render: (r) => (
        <div style={{width: 130}}>
          <ScoreGauge variant="linear" value={r.risk * 10} min={0} max={1000}/>
        </div>
      ),
    },
    {
      id: 'gates',
      label: (
        <span style={{display:'inline-grid', gridTemplateColumns:'repeat(5, 24px)', gap: 8, justifyItems:'center', fontFamily:'var(--font-mono)', fontSize: 10}}>
          <span>COV</span><span>LINT</span><span>SAST</span><span>SBOM</span><span>PERF</span>
        </span>
      ),
      width: 200,
      render: (r) => (
        <span style={{display:'inline-grid', gridTemplateColumns:'repeat(5, 24px)', gap: 8, justifyItems:'center', alignItems:'center'}}>
          {GATE_DEFS.map(g => {
            const st = gateStateFor(r, g.id);
            return <StatusDot key={g.id} tone={GATE_TONE_TO_DOT[st]} size="sm" title={`${g.label}: ${st}`}/>;
          })}
        </span>
      ),
    },
    {
      id: 'status', label: 'Status',
      render: (r) => {
        if (r.blocked) return <span className="pill status-error"><StatusDot tone="error" size="sm"/> Blocked</span>;
        if (r.verdict === 'high') return <span className="pill status-warning"><StatusDot tone="warning" size="sm"/> Needs review</span>;
        if (r.verdict === 'med') return <span className="pill status-running"><StatusDot tone="running" size="sm" pulse/> In review</span>;
        return <span className="pill status-done"><StatusDot tone="done" size="sm"/> Cleared</span>;
      },
    },
    {
      id: 'action', label: '', align: 'right' as const,
      render: (r) => (
        r.blocked
          ? <button className="btn ghost sm" style={{color: 'var(--danger)'}}><Icons.x size={12}/> Block</button>
          : <button className="btn ghost sm"><Icons.check size={12}/> Approve</button>
      ),
    },
  ];

  // 12 configured gates by environment
  const CONFIGURED_GATES = [
    { env: 'production', name: 'Coverage', threshold: '≥ 80%', enforced: true },
    { env: 'production', name: 'SAST findings', threshold: '0 critical', enforced: true },
    { env: 'production', name: 'Lint clean', threshold: '0 errors', enforced: true },
    { env: 'production', name: 'Cyclomatic complexity', threshold: '≤ 12', enforced: true },
    { env: 'production', name: 'SBOM signed', threshold: 'cosign attested', enforced: true },
    { env: 'production', name: 'Performance budget', threshold: 'p95 within 10%', enforced: true },
    { env: 'staging', name: 'Coverage', threshold: '≥ 70%', enforced: true },
    { env: 'staging', name: 'Lint clean', threshold: '0 errors', enforced: true },
    { env: 'staging', name: 'SAST findings', threshold: '≤ 2 high', enforced: false },
    { env: 'staging', name: 'Smoke tests', threshold: '100% pass', enforced: true },
    { env: 'dev', name: 'Lint clean', threshold: 'warn only', enforced: false },
    { env: 'dev', name: 'Unit tests', threshold: '≥ 60%', enforced: false },
  ];

  // Recent gate overrides
  const OVERRIDES = [
    { id: 'OV-218', pr: 7419, gate: 'Coverage', actor: 'Thiago Albuquerque', reason: 'Refactor — adding tests next PR', at: '12m ago', severity: 'p1' },
    { id: 'OV-217', pr: 7411, gate: 'Performance', actor: 'Camila Tanaka', reason: 'Known regression — fix in 4.18.3', at: '2h ago', severity: 'p2' },
    { id: 'OV-216', pr: 7404, gate: 'SAST', actor: 'Beatriz Okamoto', reason: 'False positive — suppressor added', at: '14h ago', severity: 'p2' },
    { id: 'OV-215', pr: 7398, gate: 'Coverage', actor: 'Mariana Castelli', reason: 'Generated client — exempt', at: '1d ago', severity: 'p3' },
    { id: 'OV-214', pr: 7392, gate: 'SBOM signed', actor: 'Rafael Mendonça', reason: 'Hot patch — re-signed in follow-up', at: '2d ago', severity: 'p1' },
    { id: 'OV-213', pr: 7388, gate: 'Lint clean', actor: 'Diego Vasquez', reason: 'Pre-existing warnings — sweep in flight', at: '3d ago', severity: 'p3' },
  ];

  const App = () => (
    <FShell
      nav="gates"
      crumbs={[{ label: 'Forge', href: '/example/ai-insights' }, 'Quality gates']}>

      <FPageHeader
        title="Quality gates · pre-merge · 24 hours"
        subtitle="142 PRs evaluated · 5 P0 gates · 6 overrides this week"
        actions={
          <>
            <button className="btn ghost"><Icons.settings size={13}/> Configure gates</button>
            <button className="btn ghost"><Icons.download size={13}/> Export audit</button>
            <button className="btn ember"><Icons.plus size={13}/> New gate</button>
          </>
        }/>

      <Banner
        tone="success"
        icon="shield"
        title="All Tier-1 PRs passing all P0 gates this week"
        message="No Tier-1 service has shipped with a gate override in the last 7 days. Coverage band stayed above 80% across the fleet."/>

      {/* TOP ROW — score gauge (left) + 6 KPI tiles in a 2×3 grid (right) */}
      <div className="fp-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', marginTop: 18, gap: 14}}>
        <div className="fp-card" style={{display:'flex', flexDirection:'column', alignItems:'center', gap: 8, minWidth: 0}}>
          <div className="fp-card-head" style={{width:'100%'}}>
            <div className="fp-card-title">Change risk score · fleet</div>
            <span className="pill ember">last 24h</span>
          </div>
          <div style={{width: '100%', maxWidth: 380, display:'flex', justifyContent:'center'}}>
            <ScoreGauge variant="speedo" value={284} min={0} max={1000} ticks labels size={360} label="Aggregate risk · all open PRs"/>
          </div>
          <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', lineHeight: 1.6, textAlign:'center', maxWidth: 460, margin: 0}}>
            Risk under 300 is the <strong style={{color:'var(--success)'}}>healthy</strong> band. Forge auto-merges PRs under 200 if all P0 gates pass — 38 merges saved manual review this week.
          </p>
        </div>

        <div className="fp-grid fp-grid-2" style={{gap: 14, alignContent: 'stretch'}}>
          <div className="fp-card" style={{display:'flex', flexDirection:'column'}}>
            <Stat label="Tests · last 24h" value="2,418" suffix=" runs" hint="142 PRs · 17 / PR" delta={12} variant="hero"/>
          </div>
          <div className="fp-card" style={{display:'flex', flexDirection:'column'}}>
            <Stat label="Coverage" value="83.2" suffix="%" hint="target ≥ 80%" delta={1.4} variant="hero"/>
          </div>
          <div className="fp-card" style={{display:'flex', flexDirection:'column'}}>
            <Stat label="Pass rate" value="91" suffix="%" hint="all P0 gates cleared" delta={2.1} variant="hero"/>
          </div>
          <div className="fp-card" style={{display:'flex', flexDirection:'column'}}>
            <Stat label="SAST findings" value="2" hint="0 critical · 2 high" delta={-3} inverted variant="hero"/>
          </div>
          <div className="fp-card" style={{display:'flex', flexDirection:'column'}}>
            <Stat label="Auto-merges" value="38" hint="saved manual review" delta={18} variant="hero"/>
          </div>
          <div className="fp-card" style={{display:'flex', flexDirection:'column'}}>
            <Stat label="Time to merge" value="4m 12s" hint="PR open → merged · p50" delta={-12} inverted variant="hero"/>
          </div>
        </div>
      </div>

      {/* PR TABLE */}
      <FSection title="Pre-merge pull requests" style={{marginTop: 18}}>
        <div className="fp-card" style={{padding: 0}}>
          <DataTable columns={COLUMNS} rows={PRS} rowKey={(r) => r.id}/>
        </div>
      </FSection>

      {/* BOTTOM ROW */}
      <div className="fp-grid fp-grid-2" style={{marginTop: 18}}>
        <div className="fp-card">
          <div className="fp-card-head">
            <div className="fp-card-title">Quality gates configured</div>
            <span className="pill neutral">12 gates · 3 environments</span>
          </div>
          <div className="tbl-wrap">
            <table className="tbl" style={{margin: 0}}>
              <thead>
                <tr>
                  <th>Environment</th>
                  <th>Gate</th>
                  <th>Threshold</th>
                  <th style={{textAlign:'end'}}>Enforced</th>
                </tr>
              </thead>
              <tbody>
                {CONFIGURED_GATES.map((g, i) => (
                  <tr key={i}>
                    <td><span className={'pill ' + (g.env === 'production' ? 'ember' : g.env === 'staging' ? 'neutral' : 'ice')}>{g.env}</span></td>
                    <td>{g.name}</td>
                    <td className="mono" style={{color:'var(--fg-muted)', fontSize: 'var(--text-sm)'}}>{g.threshold}</td>
                    <td style={{textAlign:'end'}}>
                      {g.enforced
                        ? <span className="pill status-done"><StatusDot tone="done" size="sm"/> Enforced</span>
                        : <span className="pill neutral"><StatusDot tone="pending" size="sm"/> Warn-only</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="fp-card">
          <div className="fp-card-head">
            <div className="fp-card-title">Recent overrides · last 7 days</div>
            <span className="pill neutral">{OVERRIDES.length} entries</span>
          </div>
          <div className="tbl-wrap">
            <table className="tbl" style={{margin: 0}}>
              <thead>
                <tr>
                  <th>Override</th>
                  <th>PR · gate</th>
                  <th>Actor</th>
                  <th>Reason</th>
                  <th style={{textAlign:'end'}}>When</th>
                </tr>
              </thead>
              <tbody>
                {OVERRIDES.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <span style={{display:'inline-flex', alignItems:'center', gap: 6}}>
                        <span className="mono" style={{color:'var(--fg-muted)', fontSize: 'var(--text-sm)'}}>{o.id}</span>
                        <SeverityPill level={o.severity as any} icon={false}/>
                      </span>
                    </td>
                    <td>
                      <span className="mono" style={{color:'var(--ember)'}}>#{o.pr}</span>
                      <span style={{color:'var(--fg-muted)'}}> · </span>
                      <span>{o.gate}</span>
                    </td>
                    <td><OwnerPill person={peopleByName(o.actor)}/></td>
                    <td className="cell-truncate" title={o.reason}
                        style={{color:'var(--fg-muted)', fontSize: 'var(--text-sm)', maxWidth: 260}}>{o.reason}</td>
                    <td style={{textAlign:'end', color:'var(--fg-muted)', fontSize: 'var(--text-sm)'}}>{o.at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--border)', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)'}}>
        <div>Risk model · <code style={{fontFamily:'var(--font-mono)', color:'var(--ember)'}}>v3.2.1</code> — calibrated against 7d of merge outcomes</div>
        <div style={{display:'flex', alignItems:'center', gap: 8}}>
          <Icons.shield size={12}/>
          Auto-merge under <strong style={{color:'var(--success)'}}>risk 200</strong>
        </div>
      </div>
    </FShell>
  );

  
  export default App;
