'use client';
import * as React from 'react';
import { Banner, DataTable, Icons, MOCKS, OwnerPill, RelativeTime, Sparkline, StatusDot, Trend } from '@/ds/core';
import { FPageHeader, FSection, FShell } from './example-shell';
// Forge IDP — Example: Feature flag console.

  
  
  
  
  
  const PEOPLE = MOCKS.PEOPLE || [];

  const NOW = Date.now();
  const ago = (mins) => new Date(NOW - mins * 60 * 1000);
  const byName = (n) => PEOPLE.find(p => p.name === n) || PEOPLE[0];

  // 10 flags
  const FLAGS = [
    { key: 'identity.biometric_step_up', desc: 'Biometric step-up for high-risk auth (>520 risk).', type: 'boolean', state: 'on', rollout: [0, 12, 18, 35, 42, 56, 80, 100], modified: ago(8), author: byName('Camila Tanaka'), env: 'production' },
    { key: 'pix.idempotency_keys',        desc: 'Idempotent retries for PIX router.', type: 'percent', state: 'rolling', rollout: [0, 0, 5, 12, 22, 35, 55, 72], modified: ago(14), author: byName('Rafael Mendonça'), env: 'production', ring: true },
    { key: 'fraud.experimental_model_v9', desc: 'Trial of v9 fraud model in shadow mode.', type: 'multivariate', variants: ['v8', 'v9-shadow', 'v9-active'], state: 'multivariate', rollout: [0, 0, 0, 4, 10, 18, 22, 28], modified: ago(46), author: byName('Beatriz Okamoto'), env: 'production' },
    { key: 'bureau.circuit_breaker',      desc: 'Fail-open circuit breaker on bureau provider.', type: 'boolean', state: 'on', rollout: [60, 80, 90, 100, 100, 100, 100, 100], modified: ago(120), author: byName('Thiago Albuquerque'), env: 'production' },
    { key: 'open_finance.consent_v2',     desc: 'New consent revocation webhook receiver.', type: 'percent', state: 'rolling', rollout: [0, 0, 0, 0, 8, 15, 24, 35], modified: ago(180), author: byName('Diego Vasquez'), env: 'staging' },
    { key: 'onboarding.kyc_parallel',     desc: 'Parallel document validation pipeline.', type: 'percent', state: 'rolling', rollout: [0, 0, 0, 6, 12, 18, 24, 30], modified: ago(240), author: byName('Mariana Castelli'), env: 'production' },
    { key: 'identity.dark_mode_default',  desc: 'Dark theme by default for new accounts.', type: 'boolean', state: 'off', rollout: [0, 0, 0, 0, 0, 0, 0, 0], modified: ago(600), author: byName('Leonardo Mariga'), env: 'production' },
    { key: 'ledger.btree_batching',       desc: 'BTREE-batched inserts for settlement.', type: 'boolean', state: 'on', rollout: [10, 30, 50, 70, 85, 95, 100, 100], modified: ago(1440), author: byName('Rafael Mendonça'), env: 'production' },
    { key: 'fraud.scoring_replay',        desc: 'Replay scoring decisions from event-bus.', type: 'percent', state: 'rolling', rollout: [0, 4, 8, 12, 18, 24, 30, 38], modified: ago(2880), author: byName('Beatriz Okamoto'), env: 'production' },
    { key: 'telemetry.cost_alerts_v2',    desc: 'Cost alerting on egress + storage spikes.', type: 'multivariate', variants: ['off', 'soft', 'hard'], state: 'multivariate', rollout: [0, 0, 12, 28, 42, 58, 72, 88], modified: ago(4320), author: byName('Larissa Fontana'), env: 'production' },
  ];

  const STATE_PILL = {
    on:           { cls: 'health-up',       label: 'On',          tone: 'done' },
    off:          { cls: 'status-skipped',  label: 'Off',         tone: 'skipped' },
    rolling:      { cls: 'status-running',  label: 'Rolling out', tone: 'running' },
    multivariate: { cls: 'ember',           label: 'Multivariate', tone: 'running' },
  };

  const TYPE_LABEL = {
    boolean:      'boolean',
    percent:      'percent rollout',
    multivariate: 'multivariate',
  };

  const App = () => {
    const [query, setQuery] = React.useState('');
    const [env, setEnv] = React.useState('all');
    const [status, setStatus] = React.useState('all');
    const [rows, setRows] = React.useState(FLAGS);

    const toggle = (key) => {
      setRows(prev => prev.map(r => {
        if (r.key !== key || r.type !== 'boolean') return r;
        return { ...r, state: r.state === 'on' ? 'off' : 'on' };
      }));
    };

    const filtered = React.useMemo(() => rows.filter(r => {
      if (env !== 'all' && r.env !== env) return false;
      if (status !== 'all' && r.state !== status) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!r.key.toLowerCase().includes(q) && !r.desc.toLowerCase().includes(q)) return false;
      }
      return true;
    }), [rows, query, env, status]);

    const COLUMNS = [
      {
        id: 'key', label: 'Flag', width: '28%',
        render: (r) => {
          const isRing = !!r.ring;
          return (
            <div>
              <div style={{display:'flex', alignItems:'center', gap: 8}}>
                <span className="mono" style={{fontWeight: 600, color:'var(--fg)'}}>{r.key}</span>
                {isRing && (
                  <a href="/example/ring-deployment" className="pill ember" style={{cursor:'pointer', fontSize: 'var(--text-xs)', padding: '1px 6px'}}>
                    <Icons.ring size={9}/> ring-rollout
                  </a>
                )}
              </div>
              <div style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)', marginTop: 2, maxWidth: '40ch', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{r.desc}</div>
            </div>
          );
        },
      },
      {
        id: 'type', label: 'Type',
        render: (r) => (
          <span className="chip" style={{textTransform: 'capitalize'}}>{TYPE_LABEL[r.type]}</span>
        ),
      },
      {
        id: 'state', label: 'Status',
        render: (r) => {
          const s = STATE_PILL[r.state] || STATE_PILL.off;
          return <span className={'pill ' + s.cls}><StatusDot tone={s.tone} size="sm" pulse={s.tone === 'running'}/> {s.label}</span>;
        },
      },
      {
        id: 'rollout', label: 'Targeting', width: 160,
        render: (r) => {
          const pct = r.rollout[r.rollout.length - 1] || 0;
          const max = Math.max(1, ...r.rollout);
          return (
            <div>
              <div style={{display:'flex', alignItems:'center', gap: 8}}>
                <Sparkline data={r.rollout} w={80} h={20} color={pct > 0 ? 'var(--ember)' : 'var(--fg-faint)'}/>
                <span className="mono" style={{fontSize: 'var(--text-sm)', color: pct > 0 ? 'var(--fg)' : 'var(--fg-muted)'}}>{pct}%</span>
              </div>
            </div>
          );
        },
      },
      {
        id: 'modified', label: 'Last modified',
        render: (r) => <RelativeTime value={r.modified}/>,
      },
      {
        id: 'author', label: 'Author',
        render: (r) => <OwnerPill person={r.author}/>,
      },
      {
        id: 'toggle', label: '', width: 56, align: 'right' as const,
        render: (r) => {
          if (r.type !== 'boolean') {
            return <button className="btn ghost sm" onClick={(e) => e.stopPropagation()} aria-label={'Open ' + r.key}><Icons.more size={11}/></button>;
          }
          const on = r.state === 'on';
          return (
            <button
              type="button"
              className="fc-toggle-track"
              role="switch"
              aria-checked={on}
              onClick={(e) => { e.stopPropagation(); toggle(r.key); }}
              style={{
                display: 'inline-flex',
                width: 34,
                height: 20,
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border)',
                background: on ? 'var(--ember)' : 'var(--surface-active)',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 180ms var(--ease)',
                padding: 0,
              }}>
              <span style={{
                position: 'absolute',
                top: 1,
                insetInlineStart: on ? 15 : 1,
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: 'var(--surface)',
                transition: 'inset-inline-start 220ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: 'var(--elev-1)',
              }}/>
            </button>
          );
        },
      },
    ];

    return (
      <FShell
        nav="flags"
        crumbs={[{ label: 'Forge', href: '/example/ai-insights' }, 'Feature flags']}>

        <FPageHeader
          title="Feature flags"
          subtitle={<span>142 active · 38 archived · 18 owners · <span style={{color:'var(--ember)'}}>3 in rollout right now</span></span>}
          actions={
            <>
              <button className="btn ghost"><Icons.download size={13}/> Export</button>
              <button className="btn ghost"><Icons.book size={13}/> Docs</button>
              <button className="btn ember"><Icons.plus size={13}/> New flag</button>
            </>
          }/>

        <Banner
          tone="info"
          icon="flag"
          title="Forge auto-targets to rings"
          message="Flags marked with the ring-rollout chip inherit traffic targeting from the active ring deployment. Click the chip to open the rollout."
          onDismiss={() => {}}/>

        {/* Toolbar */}
        <div style={{display:'flex', gap: 10, marginTop: 18, marginBottom: 14, alignItems:'center', flexWrap:'wrap'}}>
          <div className="in-group sm" style={{flex: 1, maxWidth: 420}}>
            <span className="in-addon icon"><Icons.search size={13}/></span>
            <input className="in-control" placeholder="Filter by key or description..."
                   value={query} onChange={(e) => setQuery(e.target.value)}/>
          </div>
          <div style={{display:'inline-flex', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border)', overflow:'hidden'}}>
            {['all', 'production', 'staging'].map(opt => (
              <button key={opt}
                      className="btn ghost sm"
                      onClick={() => setEnv(opt)}
                      style={{
                        borderRadius: 0,
                        background: env === opt ? 'var(--bg-elevated)' : 'transparent',
                        border: 'none',
                        borderInlineEnd: opt !== 'staging' ? '1px solid var(--border)' : 'none',
                        textTransform: 'capitalize',
                        color: env === opt ? 'var(--fg)' : 'var(--fg-muted)',
                      }}>
                {opt}
              </button>
            ))}
          </div>
          <div style={{display:'inline-flex', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border)', overflow:'hidden'}}>
            {[
              { id: 'all', label: 'All' },
              { id: 'on', label: 'On' },
              { id: 'off', label: 'Off' },
              { id: 'rolling', label: 'Rolling' },
              { id: 'multivariate', label: 'Multi' },
            ].map((opt, i, arr) => (
              <button key={opt.id}
                      className="btn ghost sm"
                      onClick={() => setStatus(opt.id)}
                      style={{
                        borderRadius: 0,
                        background: status === opt.id ? 'var(--bg-elevated)' : 'transparent',
                        border: 'none',
                        borderInlineEnd: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                        color: status === opt.id ? 'var(--fg)' : 'var(--fg-muted)',
                      }}>
                {opt.label}
              </button>
            ))}
          </div>
          <button className="btn ghost sm"><Icons.filter size={11}/> More</button>
        </div>

        {/* Table */}
        <div className="fp-card" style={{padding: 0}}>
          <DataTable
            columns={COLUMNS}
            rows={filtered}
            rowKey={(r) => r.key}
            onRowClick={(r) => {
              // Ring-rollout flags drill into the ring-deployment console;
              // other flag types are read-only previews in this example.
              if (r.ring) { window.location.href = '/example/ring-deployment'; }
            }}/>
        </div>

        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--border)', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)'}}>
          <div>{filtered.length} of {FLAGS.length} flags shown</div>
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
