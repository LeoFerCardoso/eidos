'use client';
// Eidos DS — Components / DataTable
// Dense .tbl-data variant. Composes existing .tbl chrome. Now with sortable
// headers, sticky header, dense mode, sparkline columns, footer slot.
import * as React from 'react';
import { Alert, AlertDescription, AlertTitle, AutoPropsTable, CopyChip, DataTable, Frame, HealthBadge, Icons, LangBadge, MOCKS, Mono, OwnerPill, Pipeline, PropsTable, RelativeTime, Section, SeverityPill, Skeleton, Sparkline, Spinner, StatusDot, SubHead, TabbedCode, TierBadge, Trend, installTabs, Lede } from '@/ds/core';

const services = (MOCKS && MOCKS.SERVICES) || [];
const deploys  = (MOCKS && MOCKS.DEPLOYS)  || [];
const people   = (MOCKS && MOCKS.PEOPLE)   || [];
const M = 60_000;
const seriesFor = (i) => Array.from({length: 24}, (_, k) => 100 + 40 * Math.sin(k / 3 + i) + (k * (i % 3 === 0 ? -0.4 : 0.6)));

const matchPerson = (tribe) => people.find(p => p.role && p.role.includes(tribe)) || people[0];
// cols() casts a column array to `any[]` so that `align: 'end'` (logical CSS,
// valid at runtime) is accepted without widening the core DataTableColumn type.
const cols = (c: any[]) => c;

// ── Cell type helpers ──────────────────────────────────────────────────────
// Single source of truth for cell typography so every numeric column ships
// tabular-nums + zero-slash (var(--tnum)) and every identifier reads in mono.
// Reused across all demos — no per-cell drift, no off-scale sizes.
const numCell: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', fontFeatureSettings: 'var(--tnum)', color: 'var(--fg-subtle)' };
const idCell:  React.CSSProperties = { fontFamily: 'var(--font-mono)', color: 'var(--fg)' };
const Num = ({ children }: { children: React.ReactNode }) => <span style={numCell}>{children}</span>;

const USAGE = `import { DataTable } from "@/components/forge/data-table"

<DataTable
  columns={[
    { id: 'name',  label: 'Service' },
    { id: 'tier',  label: 'Tier' },
    { id: 'p95',   label: 'p95 (ms)', align: 'end' },
    { id: 'open',  label: '',         render: (r) => <Icons.chevronRight size={12} /> },
  ]}
  rows={services}
  onRowClick={(r) => router.push('/services/' + r.id)}
/>`;

export default function Page() {
  return (
    <Section id="data-table" title="Data table" desc="Dense, composable table for service registries, deploy queues, and incident lists. Uppercase mono headers; rows opt into click-through, sticky headers, and column sort. Compose existing primitives in every cell.">
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('data-table')} ariaLabel="package manager"/>
      <Lede>DataTable is pure markup. Pagination, sort and filters live in the consuming page (use <Mono>Pagination</Mono> and <Mono>FilterPanel</Mono> as companions).</Lede>

      <SubHead meta="hello world">Usage — service catalog</SubHead>
      <Lede>Each cell composes an existing primitive — TierBadge, LangBadge, HealthBadge, OwnerPill, Sparkline — so the same status reads identically in a table as it does anywhere else on the platform.</Lede>
      <Frame label="6 columns · clickable rows" code={USAGE}>
        <DataTable
          rows={services.slice(0, 8)}
          onRowClick={(r) => console.log('open', r.id)}
          columns={cols([
            { id:'name',  label:'Service',  render: (r) => <span style={idCell}>{r.name}</span> },
            { id:'tier',  label:'Tier',     render: (r) => <TierBadge tier={r.tier}/> },
            { id:'lang',  label:'Lang',     render: (r) => <LangBadge lang={r.lang}/> },
            { id:'owner', label:'Owner',    render: (r) => <OwnerPill person={matchPerson(r.tribe)} role={r.tribe}/> },
            { id:'health',label:'Health',   render: (r) => <HealthBadge state={r.alert?'degraded':'up'} pulse={r.alert}/> },
            { id:'p95',   label:'p95',  align:'end', render: (r) => <Num>{r.p95}ms</Num> },
            { id:'open',  label:'',      align:'end', width: 32, render: () => <Icons.chevronRight size={12}/> },
          ])}
        />
      </Frame>

      <SubHead meta="deploys">Deploys with pipeline column</SubHead>
      <Frame label="composes Pipeline + StatusDot + Trend inline">
        <DataTable
          rows={deploys}
          columns={cols([
            { id:'id',       label:'Deploy',  render: (r) => <span style={idCell}>{r.id}</span> },
            { id:'service',  label:'Service', render: (r) => <span style={{color:'var(--fg-subtle)'}}>{r.service}</span> },
            { id:'pipeline', label:'Pipeline', render: (r) => <Pipeline compact steps={[
              {label:'Build', status: r.stages.build},
              {label:'Test',  status: r.stages.test},
              {label:'SAST',  status: r.stages.sast},
              {label:'Risk',  status: r.stages.risk},
              {label:'Canary',status: r.stages.canary},
              {label:'Full',  status: r.stages.full},
            ]}/> },
            { id:'progress', label:'Progress', align:'end', render: (r) => <Num>{r.progress}%</Num> },
            { id:'status',   label:'Status', render: (r) => <span style={{display:'inline-flex',alignItems:'center',gap:'var(--space-2)'}}><StatusDot tone={r.status === 'success' ? 'done' : r.status === 'in-flight' ? 'running' : 'error'} pulse={r.status === 'in-flight'}/>{r.status}</span> },
          ])}
        />
      </Frame>

      <div style={{ marginTop: 36, marginBottom: 6, display:'flex', alignItems:'center', gap: 12 }}>
        <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--fg-faint)'}}>IDP examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      <SubHead meta="trend chip + sparkline">Service health</SubHead>
      <Frame label="latency trend, delta vs baseline, p95 — compose any primitive in render(row)">
        <DataTable
          rows={services.slice(0, 6).map((s, i) => ({ ...s, series: seriesFor(i), delta: i % 2 === 0 ? -3.2 - i : 4.2 + i }))}
          columns={cols([
            { id:'name',  label:'Service',  render: (r) => <span style={idCell}>{r.name}</span> },
            { id:'tier',  label:'Tier',     render: (r) => <TierBadge tier={r.tier}/> },
            { id:'spark', label:'p95 · 24h', width: 160, render: (r) => <Sparkline data={r.series} w={130} h={24}/> },
            { id:'p95',   label:'p95',  align:'end', render: (r) => <Num>{r.p95}ms</Num> },
            { id:'delta', label:'Δ vs 30d', align:'end', render: (r) => <Trend delta={r.delta} unit="ms" inverted variant="triangle"/> },
            { id:'health',label:'Health',   render: (r) => <HealthBadge state={r.alert?'degraded':'up'} pulse={r.alert}/> },
          ])}
        />
      </Frame>
      <Lede>Sparkline + triangle Trend reads at a glance. The triangle is the dense-table workhorse for delta because it doesn't compete with mono numerics for hierarchy.</Lede>

      <SubHead meta="incidents">Incident inventory</SubHead>
      <Frame label="SeverityPill + CopyChip + RelativeTime composition">
        <DataTable
          rows={[
            { id:'INC-4137', svc:'fraud-engine',     sev:'p1', commander:people[0], at: new Date(Date.now() - 27 * M), state:'investigating' },
            { id:'INC-4138', svc:'kyc-orchestrator', sev:'p2', commander:people[1], at: new Date(Date.now() - 3 * 60 * M), state:'monitoring' },
            { id:'INC-4136', svc:'identity-svc',     sev:'p0', commander:people[2], at: new Date(Date.now() - 14 * 60 * M), state:'resolved' },
            { id:'INC-4135', svc:'pix-router',       sev:'p3', commander:people[0], at: new Date(Date.now() - 26 * 60 * M), state:'resolved' },
          ]}
          columns={[
            { id:'id',  label:'Incident', render: (r) => <CopyChip value={r.id}/> },
            { id:'svc', label:'Service',  render: (r) => <span style={{fontFamily:'var(--font-mono)', color:'var(--fg-subtle)'}}>{r.svc}</span> },
            { id:'sev', label:'Severity', render: (r) => <SeverityPill level={r.sev}/> },
            { id:'cmd', label:'Commander', render: (r) => <OwnerPill person={r.commander} role="IC"/> },
            { id:'at',  label:'Opened',   render: (r) => <RelativeTime value={r.at} tooltip/> },
            { id:'state',label:'State', render: (r) => <span className={'pill ' + (r.state === 'resolved' ? 'status-done' : r.state === 'monitoring' ? 'status-running' : 'severity-p1')}>{r.state}</span> },
          ]}
        />
      </Frame>

      <SubHead meta="sortable · sticky · dense">Sortable & sticky</SubHead>
      <Frame label="click a header chevron to sort · sticky thead inside a scroll container">
        {(() => {
          const [sort, setSort] = React.useState<{ col: string; dir: 'asc' | 'desc' }>({ col: 'p95', dir: 'asc' });
          const onSort = (col) => setSort(s => s && s.col === col ? { col, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { col, dir: 'asc' });
          const rows = [...services].sort((a, b) => {
            const av = a[sort.col], bv = b[sort.col];
            const cmp = typeof av === 'number' ? (av - bv) : String(av).localeCompare(String(bv));
            return sort.dir === 'asc' ? cmp : -cmp;
          });
          return (
            <div style={{ maxHeight: 260, overflow: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)' }}>
              <DataTable sticky dense sort={sort} onSort={onSort}
                rows={rows}
                columns={cols([
                  { id:'name',     label:'Service',    sortable: true, render: (r) => <span style={idCell}>{r.name}</span> },
                  { id:'tier',     label:'Tier',       sortable: true, render: (r) => <TierBadge tier={r.tier}/> },
                  { id:'p95',      label:'p95 (ms)',   sortable: true, align: 'end', render: (r) => <Num>{r.p95}</Num> },
                  { id:'coverage', label:'Cov %',      sortable: true, align: 'end', render: (r) => <Num>{r.coverage}</Num> },
                ])}/>
            </div>
          );
        })()}
      </Frame>

      <div style={{ marginTop: 36, marginBottom: 6, display:'flex', alignItems:'center', gap: 12 }}>
        <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--fg-faint)'}}>States</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      <SubHead meta="loading">Loading</SubHead>
      <Lede>While the registry query is in flight, render Skeleton bars inside real <Mono>{'<td>'}</Mono> cells — same column count, same alignment — so the layout never reflows when data lands. The skeleton group carries one <Mono>role="status"</Mono> label, not one per bar.</Lede>
      <Frame label='Skeleton rows · one role="status" announcement · column shape preserved'>
        <DataTable
          rows={[0, 1, 2, 3]}
          rowKey={(r) => r}
          columns={cols([
            { id:'name', label:'Service',          render: () => <Skeleton width={132} label="Loading services" /> },
            { id:'tier', label:'Tier',             render: () => <Skeleton variant="box" width={34} height={18} radius={9} /> },
            { id:'p95',  label:'p95 (ms)', align:'end', render: () => <Skeleton width={44} style={{ marginInlineStart: 'auto' }} /> },
          ])}
        />
      </Frame>

      <SubHead meta="error">Error</SubHead>
      <Lede>When the fetch fails, the table body is replaced by a danger <Mono>Alert</Mono> (<Mono>role="alert"</Mono>) carrying a retry action — never a silent blank body and never a half-rendered table. Pass it through the <Mono>empty</Mono> prop so the header still frames the columns.</Lede>
      <Frame label='empty prop = danger Alert with role="alert" + retry'>
        <DataTable
          rows={[]}
          columns={cols([
            { id:'name', label:'Service' },
            { id:'tier', label:'Tier' },
            { id:'p95',  label:'p95 (ms)', align:'end' },
          ])}
          empty={
            <div style={{ padding: 'var(--space-4)' }}>
              <Alert tone="danger">
                <AlertTitle>Couldn't reach the service registry</AlertTitle>
                <AlertDescription>The catalog API returned 503. Rows shown may be stale.</AlertDescription>
                <div style={{ marginBlockStart: 'var(--space-3)' }}>
                  <button className="btn outline xs"><Icons.refresh size={12}/> Retry</button>
                </div>
              </Alert>
            </div>
          }
        />
      </Frame>

      <SubHead meta="empty">Empty</SubHead>
      <Lede>With <Mono>rows={'{[]}'}</Mono> and no <Mono>empty</Mono> override, the table renders the embedded <Mono>Empty</Mono> primitive — real text inside <Mono>role="status"</Mono>, so a screen reader announces the state instead of skipping a blank body.</Lede>
      <Frame label="rows=[] renders the embedded Empty primitive">
        <DataTable
          rows={[]}
          columns={[
            { id:'name',  label:'Service' },
            { id:'tier',  label:'Tier' },
            { id:'lang',  label:'Lang' },
          ]}
        />
      </Frame>

      <SubHead meta="disabled · read-only">Disabled rows</SubHead>
      <Lede>A read-only table omits <Mono>onRowClick</Mono> — rows leave the tab order and show no pointer affordance or hover. Decommissioned services additionally dim to <Mono>--fg-faint</Mono> so the muted state reads without relying on colour alone (the <Mono>Archived</Mono> label travels with the tint).</Lede>
      <Frame label="no onRowClick → not focusable · archived row dimmed + labelled">
        <DataTable
          rows={services.slice(0, 3).map((s, i) => ({ ...s, archived: i === 2 }))}
          columns={cols([
            { id:'name',  label:'Service', render: (r) => <span style={{ ...idCell, color: r.archived ? 'var(--fg-faint)' : 'var(--fg)' }}>{r.name}</span> },
            { id:'tier',  label:'Tier',    render: (r) => <TierBadge tier={r.tier}/> },
            { id:'p95',   label:'p95 (ms)', align:'end', render: (r) => <span style={{ ...numCell, color: r.archived ? 'var(--fg-faint)' : 'var(--fg-subtle)' }}>{r.p95}ms</span> },
            { id:'st',    label:'Status', align:'end', render: (r) => r.archived
              ? <span className="pill" style={{ color: 'var(--fg-muted)' }}>Archived</span>
              : <HealthBadge state={r.alert ? 'degraded' : 'up'} pulse={r.alert}/> },
          ])}
        />
      </Frame>

      <SubHead meta="live · poll registry">In context — live refresh</SubHead>
      <Lede>The realistic flow: a registry list that polls. Hit <Mono>Poll registry</Mono> to watch the <em>same</em> table swap to skeleton rows and back — no layout shift, the announcement fires once, and the <Mono>aria-busy</Mono> on the table is honoured by assistive tech.</Lede>
      <Frame label="loading ⇄ loaded · in-place, no reflow · aria-busy">
        {(() => {
          const [loading, setLoading] = React.useState(false);
          const poll = () => { setLoading(true); window.setTimeout(() => setLoading(false), 1400); };
          const liveRows = services.slice(0, 4);
          return (
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:'var(--space-3)', marginBlockEnd:'var(--space-3)' }}>
                <button className="btn ember xs" onClick={poll} disabled={loading} aria-busy={loading || undefined}>
                  {loading
                    ? <><Spinner size="sm" aria-label="Polling registry"/> Polling registry…</>
                    : <><Icons.refresh size={12}/> Poll registry</>}
                </button>
                <span style={{ fontFamily:'var(--font-mono)', fontSize:'var(--text-xs)', color:'var(--fg-faint)', fontVariantNumeric:'tabular-nums', fontFeatureSettings:'var(--tnum)' }}>
                  {loading ? 'fetching…' : liveRows.length + ' services · updated just now'}
                </span>
              </div>
              <div aria-busy={loading || undefined}>
                <DataTable
                  rows={loading ? [0, 1, 2, 3] : liveRows}
                  rowKey={(r) => (loading ? 'sk-' + r : r.id)}
                  columns={cols([
                    { id:'name', label:'Service', render: (r) => loading ? <Skeleton width={132} label="Refreshing services"/> : <span style={idCell}>{r.name}</span> },
                    { id:'tier', label:'Tier',    render: (r) => loading ? <Skeleton variant="box" width={34} height={18} radius={9}/> : <TierBadge tier={r.tier}/> },
                    { id:'health', label:'Health', render: (r) => loading ? <Skeleton width={56}/> : <HealthBadge state={r.alert ? 'degraded' : 'up'} pulse={r.alert}/> },
                    { id:'p95',  label:'p95 (ms)', align:'end', render: (r) => loading ? <Skeleton width={44} style={{ marginInlineStart: 'auto' }}/> : <Num>{r.p95}ms</Num> },
                  ])}
                />
              </div>
            </div>
          );
        })()}
      </Frame>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 8}}>Keyboard</div>
          <table className="spec" style={{ margin: 0 }}>
            <tbody>
              <tr><td className="mono" style={{ whiteSpace: 'nowrap' }}>Tab</td><td>Move to the next sortable header button or clickable row.</td></tr>
              <tr><td className="mono" style={{ whiteSpace: 'nowrap' }}>Enter / Space</td><td>On a header: toggle ascending → descending. On a row: activate <Mono>onRowClick</Mono>.</td></tr>
              <tr><td className="mono" style={{ whiteSpace: 'nowrap' }}>Shift + Tab</td><td>Move focus backwards through the same sequence.</td></tr>
            </tbody>
          </table>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55, marginTop: 10}}>Non-interactive cells stay out of the tab order — only sortable headers (real <Mono>{'<button>'}</Mono>s) and rows that received <Mono>onRowClick</Mono> are reachable. Inside a scroll container the sticky <Mono>thead</Mono> stays pinned, so the column you are sorting never scrolls out of view.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>ARIA &amp; roles</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>A native <Mono>{'<table>'}</Mono> with <Mono>{'<th scope="col">'}</Mono> headers. Sortable columns set <Mono>aria-sort="ascending | descending | none"</Mono> on the <Mono>{'<th>'}</Mono>, mirroring the live state. A clickable row is <Mono>role="button"</Mono> with an <Mono>aria-label="Open row …"</Mono>. The empty body is <Mono>role="status"</Mono>; the error body is a danger Alert with <Mono>role="alert"</Mono>; the loading region sets <Mono>aria-busy</Mono> and the Skeleton group announces once via <Mono>role="status"</Mono>.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Status, not colour alone</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Health, severity and run-status cells render a HealthBadge / SeverityPill / StatusDot that always pairs the tone with a text label (Up, P1, success) — never a bare coloured swatch. The archived row dims to <Mono>--fg-faint</Mono> but keeps its <Mono>Archived</Mono> label. All cell text meets AA contrast (≥4.5:1) against the row surface, including muted numerics on <Mono>--fg-subtle</Mono>.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Both sortable header buttons and clickable rows show an inset ember focus ring (<Mono>--ember-soft</Mono>, ≥3:1) on <Mono>:focus-visible</Mono> — drawn inside the cell so dense mode (6px padding) never clips it. The poll Spinner and any live HealthBadge pulse stop animating under <Mono>prefers-reduced-motion: reduce</Mono>, while <Mono>aria-busy</Mono> still carries the busy state to assistive tech.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label='dir="rtl" — column headers, cell text, and row chevron align to the reading direction'>
        <div dir="rtl">
          <DataTable
            rows={services.slice(0, 3)}
            columns={cols([
              { id: 'name',   label: 'الخدمة',  render: (r) => <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg)' }}>{r.name}</span> },
              { id: 'tier',   label: 'الطبقة',   render: (r) => <TierBadge tier={r.tier}/> },
              { id: 'health', label: 'الصحة',    render: (r) => <HealthBadge state={r.alert ? 'degraded' : 'up'} pulse={r.alert}/> },
              { id: 'p95',    label: 'p95',       align: 'end', render: (r) => <span style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-subtle)' }}>{r.p95}ms</span> },
              { id: 'open',   label: '',           align: 'start', width: 32, render: () => <Icons.chevronRight size={12} style={{ transform: 'scaleX(-1)' }}/> },
            ])}
          />
        </div>
      </Frame>
      <Lede>
        The table uses logical CSS throughout — column labels align to <Mono>inline-start</Mono>, so headers, cell text, and the click-through chevron all flip with the reading direction. Numeric values retain their alignment logic (<Mono>align="end"</Mono> = right in RTL). The trailing navigation chevron gets a <Mono>scaleX(-1)</Mono> mirror so it points in the correct direction.
      </Lede>

      {/* ====================================================================
          ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 460 }} aria-hidden="true">
              <DataTable
                sticky
                sort={{ col: 'p95', dir: 'asc' }}
                onSort={() => {}}
                rows={services.slice(0, 3)}
                columns={cols([
                  { id: 'name',   label: 'Service',  render: (r) => <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg)' }}>{r.name}</span> },
                  { id: 'tier',   label: 'Tier',     render: (r) => <TierBadge tier={r.tier}/> },
                  { id: 'health', label: 'Health',   render: (r) => <HealthBadge state={r.alert ? 'degraded' : 'up'} pulse={r.alert}/> },
                  { id: 'p95',    label: 'p95 (ms)', sortable: true, align: 'end', render: (r) => <span style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-subtle)' }}>{r.p95}ms</span> },
                  { id: 'open',   label: '',         align: 'end', width: 32, render: () => <Icons.chevronRight size={12}/> },
                ])}
              />
              {/* Pin 1 — header row */}
              <span className="lead v" style={{ top: -24, left: 60, height: 20 }}/>
              <div className="pin" style={{ top: -46, left: 60, transform: 'translateX(-50%)' }}>1</div>
              {/* Pin 2 — sortable column chevron */}
              <span className="lead v" style={{ top: -24, right: 76, height: 20 }}/>
              <div className="pin" style={{ top: -46, right: 76, transform: 'translateX(50%)' }}>2</div>
              {/* Pin 3 — cell with primitive (HealthBadge) */}
              <span className="lead h" style={{ top: 55, right: -30, width: 26 }}/>
              <div className="pin" style={{ top: 43, right: -54 }}>3</div>
              {/* Pin 4 — row click-through chevron */}
              <span className="lead h" style={{ top: 83, right: -30, width: 26 }}/>
              <div className="pin" style={{ top: 71, right: -54 }}>4</div>
              {/* Pin 5 — sticky header */}
              <span className="lead v" style={{ bottom: -24, left: '50%', height: 20, transform: 'translateX(-50%)' }}/>
              <div className="pin" style={{ bottom: -46, left: '50%', transform: 'translateX(-50%)' }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Header row.</b> Uppercase Geist Mono, <Mono>--text-xs</Mono>, letter-spacing 0.18em. Column labels never wrap — truncate with ellipsis at the column boundary.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Sortable chevron.</b> A <Mono>{'<button>'}</Mono> wrapping the label. Active direction sets <Mono>aria-sort</Mono> and flips the chevron glyph. Pair with the <Mono>sort</Mono> + <Mono>onSort</Mono> props on the parent.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Primitive cell.</b> Any core primitive — <Mono>HealthBadge</Mono>, <Mono>StatusDot</Mono>, <Mono>TierBadge</Mono>, <Mono>Sparkline</Mono> — renders inside a cell unchanged. Status is never a bare colour; the text label travels with the tint.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Click-through row.</b> Passing <Mono>onRowClick</Mono> makes the row focusable and activatable via <Mono>Enter</Mono>/<Mono>Space</Mono>. The trailing <Mono>ChevronRight</Mono> at 12px signals navigation.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Sticky header.</b> <Mono>sticky</Mono> keeps <Mono>{'<thead>'}</Mono> pinned to the scroll container top so the active column label stays visible when sorting a long list.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — align numbers right</div>
          <div className="body" style={{padding:0}}>
            <DataTable rows={services.slice(0,3)} columns={cols([
              {id:'name',label:'Service', render:(r)=><span style={idCell}>{r.name}</span>},
              {id:'p95',label:'p95', align:'end', render:(r)=><Num>{r.p95}ms</Num>},
              {id:'cov',label:'Coverage', align:'end', render:(r)=><Num>{r.coverage}%</Num>},
            ])}/>
          </div>
          <div className="note">Numbers compare visually only when right-aligned with tabular nums.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — wrap long mono identifiers</div>
          <div className="body" style={{padding:0, maxWidth: 200}}>
            <DataTable rows={[{id:'a',name:'urn:forge:svc:identity:auth-handler:v4.18.2:rev-9182'}]} columns={[{id:'name',label:'ID', render:(r)=><span style={{fontFamily:'var(--font-mono)', whiteSpace:'normal', wordBreak:'break-all'}}>{r.name}</span>}]}/>
          </div>
          <div className="note">Use a CopyChip with the full value tucked away, or keep the default <Mono>white-space: nowrap</Mono>.</div>
        </div>
      </div>

      <SubHead meta="DataTableProps">API reference</SubHead>
      <AutoPropsTable component="DataTable" label="<DataTable />"/>
      <PropsTable
        label="Column"
        rows={[
          { prop: 'id',       type: 'string',  description: 'Stable column id; doubles as row-data lookup when render is omitted.' },
          { prop: 'label',    type: 'string',  description: 'Header label.' },
          { prop: 'align',    type: '"start" | "center" | "end"', default: '"start"', description: 'Cell text alignment.' },
          { prop: 'width',    type: 'string | number', description: 'CSS width applied to the <th>.' },
          { prop: 'render',   type: '(row) => ReactNode', description: 'Custom cell renderer. Default reads row[column.id].' },
          { prop: 'sortable', type: 'boolean', description: 'Mark the header as sortable. Pair with the parent\'s sort + onSort.' },
        ]}
      />
    </Section>
  );
}
