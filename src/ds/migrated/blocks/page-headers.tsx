'use client';
import { useRef, useState } from 'react';
import { Icons, TierBadge, Frame, Section, SubHead, PropsTable, Mono } from '@/ds/core';


// ==========================================================================
// 1. STANDARD — title · lede · primary action.
// ==========================================================================
const STANDARD_CODE = `<PageHeader>
  <PageHeader.Title>Services</PageHeader.Title>
  <PageHeader.Lede>
    Every long-running thing the platform team owns —
    APIs, workers, schedulers, batch jobs.
  </PageHeader.Lede>
  <PageHeader.Actions>
    <Button variant="ghost"><Filter size={14}/> Filters</Button>
    <Button variant="ember"><Plus size={14}/> New service</Button>
  </PageHeader.Actions>
</PageHeader>`;

const StandardHeader = () => (
  <div style={{width:'100%'}}>
    <div style={{display:'flex', alignItems:'flex-start', gap: 16}}>
      <div style={{flex: 1, minWidth: 0}}>
        <h1 className="t-h1" style={{margin: 0}}>Services</h1>
        <p style={{color:'var(--fg-muted)', margin:'8px 0 0', fontSize: 'var(--text-md)', maxWidth: '60ch', lineHeight: 1.55}}>
          Every long-running thing the platform team owns — APIs, workers, schedulers, batch jobs.
        </p>
      </div>
      <div style={{display:'flex', gap: 6}}>
        <button className="btn ghost"><Icons.filter size={14}/> Filters</button>
        <button className="btn ember"><Icons.plus size={14}/> New service</button>
      </div>
    </div>
  </div>
);

// ==========================================================================
// 2. WITH BREADCRUMB — 1-level crumb above the title.
// ==========================================================================
const BREADCRUMB_CODE = `<PageHeader>
  <PageHeader.Breadcrumb>
    <a href="/catalog">Catalog</a>
    <ChevronRight size={12}/>
    <span>identity-svc</span>
  </PageHeader.Breadcrumb>
  <PageHeader.Title>Deploys</PageHeader.Title>
  <PageHeader.Lede>
    Every release, signed and reversible. Sorted newest first.
  </PageHeader.Lede>
  <PageHeader.Actions>
    <Button variant="ghost"><Refresh size={14}/></Button>
    <Button variant="ember"><Rocket size={14}/> Deploy</Button>
  </PageHeader.Actions>
</PageHeader>`;

const BreadcrumbHeader = () => (
  <div style={{width:'100%'}}>
    <nav aria-label="Breadcrumb" style={{display:'flex', alignItems:'center', gap: 6, fontSize: 'var(--text-sm)', color:'var(--fg-subtle)', marginBottom: 10}}>
      <a href="#" onClick={e => e.preventDefault()} style={{color:'var(--fg-muted)', textDecoration:'none'}}>Catalog</a>
      <Icons.chevronRight size={12}/>
      <span aria-current="page" style={{color:'var(--fg)'}}>identity-svc</span>
    </nav>
    <div style={{display:'flex', alignItems:'flex-start', gap: 16}}>
      <div style={{flex: 1, minWidth: 0}}>
        <h1 className="t-h1" style={{margin: 0}}>Deploys</h1>
        <p style={{color:'var(--fg-muted)', margin:'8px 0 0', fontSize: 'var(--text-md)', maxWidth: '60ch', lineHeight: 1.55}}>
          Every release, signed and reversible. Sorted newest first.
        </p>
      </div>
      <div style={{display:'flex', gap: 6}}>
        <button className="btn ghost icon" aria-label="Refresh"><Icons.refresh size={14}/></button>
        <button className="btn ember"><Icons.rocket size={14}/> Deploy</button>
      </div>
    </div>
  </div>
);

// ==========================================================================
// 3. WITH TABS — title row + integrated tab strip.
// ==========================================================================
const TABS_CODE = `<PageHeader tabs={[
    { label: 'Overview',     active: true  },
    { label: 'Deploys',      count: 12     },
    { label: 'Dependencies'                 },
    { label: 'Runbooks'                     },
    { label: 'SLOs',         count: 4      },
  ]}>
  <PageHeader.Title>identity-svc</PageHeader.Title>
  <PageHeader.Actions>
    <Button variant="ember"><Rocket size={14}/> Deploy</Button>
  </PageHeader.Actions>
</PageHeader>`;

const TAB_DEFS = [
  { label: 'Overview' },
  { label: 'Deploys', count: 12 },
  { label: 'Dependencies' },
  { label: 'Runbooks' },
  { label: 'SLOs', count: 4 },
];

const TabsHeader = () => {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const focusTab = (i: number) => { setActive(i); refs.current[i]?.focus(); };
  const onKey = (e: React.KeyboardEvent) => {
    const last = TAB_DEFS.length - 1;
    // Arrow keys are direction-aware so the demo mirrors under dir="rtl".
    const rtl = e.currentTarget.closest('[dir="rtl"]') != null;
    const fwd = rtl ? 'ArrowLeft' : 'ArrowRight';
    const back = rtl ? 'ArrowRight' : 'ArrowLeft';
    if (e.key === fwd)        { e.preventDefault(); focusTab(active === last ? 0 : active + 1); }
    else if (e.key === back)  { e.preventDefault(); focusTab(active === 0 ? last : active - 1); }
    else if (e.key === 'Home'){ e.preventDefault(); focusTab(0); }
    else if (e.key === 'End') { e.preventDefault(); focusTab(last); }
  };
  return (
    <div style={{width:'100%'}}>
      <div style={{display:'flex', alignItems:'flex-start', gap: 16}}>
        <div style={{flex: 1, minWidth: 0}}>
          <h1 className="t-h1" style={{margin: 0}}>identity-svc</h1>
          <p style={{color:'var(--fg-muted)', margin:'8px 0 0', fontSize: 'var(--text-md)', lineHeight: 1.55}}>
            Identity verification for onboarding flows.
          </p>
        </div>
        <div style={{display:'flex', gap: 6}}>
          <button className="btn ghost"><Icons.book size={14}/> Runbook</button>
          <button className="btn ember"><Icons.rocket size={14}/> Deploy</button>
        </div>
      </div>
      <div className="tabs" role="tablist" aria-label="Service sections" style={{marginTop: 22}} onKeyDown={onKey}>
        {TAB_DEFS.map((t, i) => (
          <div
            key={t.label}
            ref={el => { refs.current[i] = el; }}
            className={i === active ? 'tab active' : 'tab'}
            role="tab"
            aria-selected={i === active}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
          >
            {t.label}
            {t.count != null && (
              <span className="chip" style={{marginInlineStart: 6, padding:'1px 6px', fontVariantNumeric:'tabular-nums'}}>{t.count}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================================================
// 4. DETAIL HEADER — avatar/icon + title + status pills + actions.
// ==========================================================================
const DETAIL_CODE = `<PageHeader variant="detail">
  <PageHeader.Eyebrow>Catalog / identity</PageHeader.Eyebrow>
  <PageHeader.Title>identity-svc</PageHeader.Title>
  <PageHeader.Status>
    <TierBadge tier="T1"/>
    <Pill tone="success">healthy</Pill>
  </PageHeader.Status>
  <PageHeader.Lede>
    Identity verification for onboarding flows.
    Owned by the Identity tribe.
  </PageHeader.Lede>
  <PageHeader.Meta>
    <Chip>v4.18.2</Chip>
    <Chip>deployed 2m ago</Chip>
    <Chip tone="ok">p95 142ms</Chip>
    <Chip>87.4% coverage</Chip>
  </PageHeader.Meta>
  <PageHeader.Actions>
    <Button variant="ghost"><Book size={14}/> Runbook</Button>
    <Button><Branch size={14}/> Source</Button>
    <Button variant="ember"><Rocket size={14}/> Deploy</Button>
  </PageHeader.Actions>
</PageHeader>`;

const DetailHeader = () => (
  <div style={{width:'100%'}}>
    <div className="ds-h-eyebrow" style={{marginBottom: 6}}>Catalog / identity</div>
    <div style={{display:'flex', alignItems:'flex-start', gap: 16}}>
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 6}}>
          <h1 className="t-h1" style={{margin: 0}}>identity-svc</h1>
          <TierBadge tier="T1"/>
          <span className="pill success"><span className="dot"/>healthy</span>
        </div>
        <p style={{color:'var(--fg-muted)', margin: 0, fontSize: 'var(--text-md)', lineHeight: 1.55}}>Identity verification for onboarding flows. Owned by the Identity tribe.</p>
        <div style={{display:'flex', gap: 6, marginTop: 10, flexWrap:'wrap', fontVariantNumeric:'tabular-nums'}}>
          <span className="chip">v4.18.2</span>
          <span className="chip">deployed 2m ago</span>
          <span className="chip ok">p95 142ms</span>
          <span className="chip">87.4% coverage</span>
        </div>
      </div>
      <div style={{display:'flex', gap: 6}}>
        <button className="btn ghost"><Icons.book size={14}/> Runbook</button>
        <button className="btn"><Icons.branch size={14}/> Source</button>
        <button className="btn ember"><Icons.rocket size={14}/> Deploy</button>
      </div>
    </div>
  </div>
);

// ==========================================================================
// 5. COMPACT / DENSE — single row, no lede. Used above tables.
// ==========================================================================
const COMPACT_CODE = `<PageHeader compact>
  <PageHeader.Title size="sm">Audit log</PageHeader.Title>
  <PageHeader.Actions>
    <SearchInput size="sm" placeholder="Filter events…"/>
    <Button variant="ghost"><Download size={14}/> Export CSV</Button>
  </PageHeader.Actions>
</PageHeader>`;

const CompactHeader = () => (
  <div style={{width:'100%', display:'flex', alignItems:'center', gap: 12}}>
    <h2 style={{margin: 0, fontSize: 'var(--text-lg)', fontWeight: 600, letterSpacing:'-0.01em'}}>Audit log</h2>
    <span className="chip" style={{marginInlineStart: 4, fontVariantNumeric:'tabular-nums'}}>1,284 events</span>
    <div style={{flex: 1}}/>
    <div className="in-field" style={{width: 220, marginBottom: 0}}>
      <div className="in-group sm">
        <span className="in-addon icon"><Icons.search size={13}/></span>
        <input className="in-control" aria-label="Filter events" placeholder="Filter events…" style={{fontSize: 'var(--text-base)'}}/>
      </div>
    </div>
    <button className="btn ghost sm"><Icons.download size={13}/> Export CSV</button>
  </div>
);

// ==========================================================================
// PAGE
// ==========================================================================
export default function PageHeaders() {
  return (
    <Section
      id="page-headers"
      num="16"
      title="Page headers"
      desc="Five page-header patterns for product and admin surfaces. Pick the variant that matches the page's job — the title is a contract with the reader."
    >
      {/* ====================================================================
          1. STANDARD
          ==================================================================== */}
      <SubHead meta="01 · the default">Standard</SubHead>
      <Frame label="page header — standard" code={STANDARD_CODE}>
        <StandardHeader/>
      </Frame>
      <p className="ds-caption">
        Title + lede + a small action cluster. Default for index/list pages where the lede tells the reader what's on this screen and what they can do here.
      </p>

      {/* ====================================================================
          2. WITH BREADCRUMB
          ==================================================================== */}
      <SubHead meta="02 · with crumb">With breadcrumb</SubHead>
      <Frame label="page header — with breadcrumb" code={BREADCRUMB_CODE}>
        <BreadcrumbHeader/>
      </Frame>
      <p className="ds-caption">
        Use a 1-level crumb when the page lives inside a parent the reader needs to escape back to. Anything deeper than 2 levels means the IA is too tall — flatten the route, not the crumb.
      </p>

      {/* ====================================================================
          3. WITH TABS
          ==================================================================== */}
      <SubHead meta="03 · with tabs">With tabs</SubHead>
      <Frame label="page header — with tabs" code={TABS_CODE}>
        <TabsHeader/>
      </Frame>
      <p className="ds-caption">
        Tabs sit inside the header so the page-level identity (title + actions) and the section switcher share one block. Use when the tabs swap the body but the title stays.
      </p>

      {/* ====================================================================
          4. DETAIL HEADER
          ==================================================================== */}
      <SubHead meta="04 · entity detail">Detail header</SubHead>
      <Frame label="page header — detail (entity)" code={DETAIL_CODE}>
        <DetailHeader/>
      </Frame>
      <p className="ds-caption">
        For an entity page (a service, an incident, a customer): pair the title with status pills, an eyebrow, and a meta chip row. The reader should know health, owner, and last touch in one glance.
      </p>

      {/* ====================================================================
          5. COMPACT
          ==================================================================== */}
      <SubHead meta="05 · single row">Compact dense</SubHead>
      <Frame label="page header — compact (above-table)" code={COMPACT_CODE}>
        <CompactHeader/>
      </Frame>
      <p className="ds-caption">
        Use above a table or a stream where the screen is the data. No lede, smaller title, inline filter input + the one action that matters. Saves vertical space without losing affordance.
      </p>

      {/* ====================================================================
          DECISION MATRIX
          ==================================================================== */}
      <SubHead meta="when to use which">Decision matrix</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">variant guide</span></div>
        <table className="tbl" style={{margin: 0}}>
          <thead>
            <tr><th style={{padding:'10px 12px'}}>Variant</th><th>Use for</th><th>Lede?</th><th>Status?</th></tr>
          </thead>
          <tbody>
            <tr><td className="tok-name">standard</td><td>Index/list pages — Services, Incidents, Customers</td><td className="mono">yes</td><td className="mono">no</td></tr>
            <tr><td className="tok-name">breadcrumb</td><td>A child page reachable from a parent index</td><td className="mono">yes</td><td className="mono">no</td></tr>
            <tr><td className="tok-name">tabs</td><td>An entity page split into sections that share an identity</td><td className="mono">optional</td><td className="mono">optional</td></tr>
            <tr><td className="tok-name">detail</td><td>A single-record page — service, incident, deploy, GMUD</td><td className="mono">yes</td><td className="mono">required</td></tr>
            <tr><td className="tok-name">compact</td><td>Above a table or stream where the data is the page</td><td className="mono">no</td><td className="mono">inline</td></tr>
          </tbody>
        </table>
      </div>

      {/* ====================================================================
          ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy — detail variant</span></div>
        <div className="ds-frame-body" style={{padding: '56px 36px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative', width: 540, padding: 22, background:'var(--bg)', border:'1px solid var(--border)', borderRadius: 10}} aria-hidden="true">
              <div className="ds-h-eyebrow" style={{marginBottom: 6}}>Catalog / identity</div>
              <div style={{display:'flex', alignItems:'flex-start', gap: 16}}>
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 6}}>
                    <span style={{fontSize: 22, fontWeight: 600, letterSpacing:'-0.02em'}}>identity-svc</span>
                    <TierBadge tier="T1"/>
                    <span className="pill success"><span className="dot"/>healthy</span>
                  </div>
                  <p style={{color:'var(--fg-muted)', margin: 0, fontSize: 'var(--text-sm)', lineHeight: 1.5}}>Identity verification for onboarding flows.</p>
                  <div style={{display:'flex', gap: 6, marginTop: 10, fontVariantNumeric:'tabular-nums'}}>
                    <span className="chip">v4.18.2</span>
                    <span className="chip ok">p95 142ms</span>
                  </div>
                </div>
                <div style={{display:'flex', gap: 6}}>
                  <button className="btn ghost sm" tabIndex={-1} style={{cursor:'default'}}>Runbook</button>
                  <button className="btn ember sm" tabIndex={-1} style={{cursor:'default'}}><Icons.rocket size={12}/> Deploy</button>
                </div>
              </div>
              {/* leader pins */}
              <div className="pin" style={{top: 12, left: -28}}>1</div>
              <div className="pin" style={{top: 38, left: -28}}>2</div>
              <div className="pin" style={{top: 38, right: -28}}>5</div>
              <div className="pin" style={{top: 70, left: -28}}>3</div>
              <div className="pin" style={{bottom: 26, left: -28}}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 580, margin:'48px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Eyebrow.</b> Mono 11px. Locates the page in the IA — section / sub-section.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Title row.</b> Title + tier badge + status pill, all aligned to the same baseline.</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Lede.</b> One sentence. What the entity is, who owns it. Not a tagline.</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Meta chips.</b> Stable, scannable facts: version, last deploy, p95, coverage. Cap at 4.</span>
            <span className="num">5</span><span><b style={{color:'var(--fg)'}}>Actions.</b> Cluster on the trailing edge. Ghost → outline → ember, in that priority order. One ember.</span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          ACCESSIBILITY
          ==================================================================== */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Heading &amp; landmark order</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The title is the page's one <Mono>h1</Mono> (use the <Mono>as</Mono>/<Mono>size</Mono> props for h2 / compact). The breadcrumb is a real <Mono>&lt;nav aria-label="Breadcrumb"&gt;</Mono> with the current page marked <Mono>aria-current="page"</Mono>; tabs are a <Mono>tablist</Mono>, not styled links.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Status carries beyond colour</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Tier badge and status pills pair a dot/glyph with a text label, so "healthy" / "open" / "SEV2" survive without colour and stay AA against their fill. The detail header's state lives in pills beside the title, not in a colour alone.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Icon-only controls are labelled</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Every icon-only action (Refresh) carries an explicit <Mono>aria-label</Mono>; the sticky variant keeps the header in the document flow, so no content is hidden behind it and reduced-motion users get no scroll-jank.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus order</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Tab order runs breadcrumb → title links → tabs → action cluster, ending on the ember primary — the most important action is reached last on the title row, matching the trailing-edge visual order and flipping correctly under <Mono>dir="rtl"</Mono>.</div>
        </div>
      </div>
      <div className="ds-frame" style={{marginTop: 14}}>
        <div className="ds-frame-head"><span className="label">keyboard — tab strip</span></div>
        <table className="tbl" style={{margin: 0}}>
          <thead>
            <tr><th style={{padding:'10px 12px', width: 200}}>Key</th><th>Action</th></tr>
          </thead>
          <tbody>
            <tr><td><Mono>Tab</Mono></td><td>Move into the strip; lands on the selected tab only (roving <Mono>tabindex</Mono>), then exits to the action cluster.</td></tr>
            <tr><td><Mono>{'←'}</Mono> / <Mono>{'→'}</Mono></td><td>Move between tabs within the <Mono>tablist</Mono>; mirrored under <Mono>dir="rtl"</Mono>. Selection follows focus — the section swaps as you arrow, no second keypress.</td></tr>
            <tr><td><Mono>Home</Mono> / <Mono>End</Mono></td><td>Jump to the first / last tab.</td></tr>
            <tr><td><Mono>Click</Mono></td><td>Pointer users select a tab directly; the <Mono>With tabs</Mono> demo above is live — try arrowing or clicking it.</td></tr>
          </tbody>
        </table>
      </div>

      {/* ====================================================================
          DO / DON'T
          ==================================================================== */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — actions cluster right, ember on the primary</div>
          <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap: 10, padding: 18}}>
            <div style={{display:'flex', alignItems:'center', gap: 10}}>
              <span style={{fontSize: 'var(--text-lg)', fontWeight: 600}}>identity-svc</span>
              <TierBadge tier="T1"/>
              <span style={{flex: 1}}/>
              <button className="btn ghost sm">Runbook</button>
              <button className="btn outline sm">Source</button>
              <button className="btn ember sm">Deploy</button>
            </div>
          </div>
          <div className="note">Hierarchy reads left-to-right. The ember sits on the trailing edge so the eye lands there last.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — action row competes with the title</div>
          <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap: 10, padding: 18}}>
            <div style={{display:'flex', alignItems:'center', gap: 6, flexWrap:'wrap'}}>
              <span style={{fontSize: 'var(--text-lg)', fontWeight: 600}}>identity-svc</span>
              <button className="btn ember sm">Deploy</button>
              <button className="btn ember sm">Approve</button>
              <button className="btn destructive sm">Force rollback</button>
              <button className="btn ember sm">Promote</button>
              <button className="btn ember sm">Lock</button>
              <button className="btn ember sm">Audit</button>
            </div>
          </div>
          <div className="note">Six embers + a destructive turn the title into a rumor. Demote the rare actions into a More menu.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — status pills sit beside the title</div>
          <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap: 6, padding: 18}}>
            <div style={{display:'flex', alignItems:'center', gap: 10}}>
              <span style={{fontSize: 'var(--text-lg)', fontWeight: 600}}>incident #4218</span>
              <span className="pill danger"><span className="dot"/>open</span>
              <span className="pill warning"><span className="dot"/>SEV2</span>
            </div>
            <p style={{color:'var(--fg-muted)', margin: 0, fontSize: 'var(--text-sm)'}}>identity-svc — bureau-gateway latency above 200ms.</p>
          </div>
          <div className="note">Reader gets state in one glance. Pills earn the same baseline as the title — they ARE the title's adjective.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — bury status in a meta line below</div>
          <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap: 6, padding: 18}}>
            <div style={{fontSize: 'var(--text-lg)', fontWeight: 600}}>incident #4218</div>
            <p style={{color:'var(--fg-muted)', margin: 0, fontSize: 'var(--text-sm)'}}>identity-svc — bureau-gateway latency above 200ms.</p>
            <p style={{color:'var(--fg-subtle)', margin: 0, fontSize: 'var(--text-base)'}}>Status: open · SEV2 · 4 minutes</p>
          </div>
          <div className="note">Plain-text status reads as trivia, not state. The reader has to look twice to understand the page is on fire.</div>
        </div>
      </div>

      {/* ====================================================================
          RTL
          ==================================================================== */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label='dir="rtl" — title leads, action cluster trails (now on the left)' code={`<div dir="rtl">
  <PageHeader variant="detail">
    <PageHeader.Eyebrow>الكتالوج / الهوية</PageHeader.Eyebrow>
    <PageHeader.Title>identity-svc</PageHeader.Title>
    <PageHeader.Status>
      <TierBadge tier="T1"/>
      <Pill tone="success">سليم</Pill>
    </PageHeader.Status>
    <PageHeader.Lede>
      التحقق من الهوية لتدفقات الإعداد.
    </PageHeader.Lede>
    <PageHeader.Actions>
      <Button variant="ghost"><Book size={14}/> دليل التشغيل</Button>
      <Button variant="ember"><Rocket size={14}/> نشر</Button>
    </PageHeader.Actions>
  </PageHeader>
</div>`}>
        <div dir="rtl" style={{width:'100%'}}>
          <div className="ds-h-eyebrow" style={{marginBottom: 6}}>الكتالوج / الهوية</div>
          <div style={{display:'flex', alignItems:'flex-start', gap: 16}}>
            <div style={{flex: 1, minWidth: 0}}>
              <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 6, flexWrap:'wrap'}}>
                <h1 className="t-h1" style={{margin: 0, direction:'ltr'}}>identity-svc</h1>
                <TierBadge tier="T1"/>
                <span className="pill success"><span className="dot"/>سليم</span>
              </div>
              <p style={{color:'var(--fg-muted)', margin: 0, fontSize: 'var(--text-md)', lineHeight: 1.55}}>التحقق من الهوية لتدفقات الإعداد. مملوك لقبيلة الهوية.</p>
              <div style={{display:'flex', gap: 6, marginTop: 10, flexWrap:'wrap', fontVariantNumeric:'tabular-nums'}}>
                <span className="chip">v4.18.2</span>
                <span className="chip">نُشر منذ دقيقتين</span>
                <span className="chip ok">p95 142 مللي</span>
              </div>
            </div>
            <div style={{display:'flex', gap: 6}}>
              <button className="btn ghost"><Icons.book size={14}/> دليل التشغيل</button>
              <button className="btn ember"><Icons.rocket size={14}/> نشر</button>
            </div>
          </div>
          <div className="tabs" role="tablist" aria-label="أقسام الخدمة" style={{marginTop: 22}}>
            <div className="tab active" role="tab" aria-selected="true" tabIndex={0}>نظرة عامة</div>
            <div className="tab" role="tab" aria-selected="false" tabIndex={-1}>عمليات النشر</div>
            <div className="tab" role="tab" aria-selected="false" tabIndex={-1}>التبعيات</div>
            <div className="tab" role="tab" aria-selected="false" tabIndex={-1}>SLOs</div>
          </div>
        </div>
      </Frame>
      <p className="ds-caption">
        The whole header is built on flex + logical properties, so dir="rtl" mirrors it without overrides. Service identifiers like <Mono>identity-svc</Mono> stay LTR via <Mono>direction: ltr</Mono> on the title — code-shaped tokens never read in RTL.
      </p>

      {/* ====================================================================
          ANATOMY PROPS
          ==================================================================== */}
      <SubHead meta="PageHeaderProps">Anatomy props</SubHead>
      <PropsTable
        label="<PageHeader />"
        rows={[
          { prop: 'variant',  type: '"standard" | "detail" | "compact"', default: '"standard"', description: 'Composition. detail enables Eyebrow + Status + Meta slots; compact drops the lede slot and shrinks the title.' },
          { prop: 'compact',  type: 'boolean', default: 'false', description: 'Shorthand for variant="compact". Use above tables and streams.' },
          { prop: 'tabs',     type: 'Tab[]', description: 'Tab strip rendered below the title row. Pass an array of { label, active?, count?, href? }.' },
          { prop: 'sticky',   type: 'boolean', default: 'false', description: 'Sticks the header (and its tab strip) to the top of the scroll container while you scroll the body.' },
          { prop: 'children', type: 'ReactNode', required: true, description: 'Composition slot — Breadcrumb, Eyebrow, Title, Status, Lede, Meta, Actions.' },
        ]}
      />
      <PropsTable
        label="<PageHeader.Title />"
        rows={[
          { prop: 'as',       type: '"h1" | "h2"', default: '"h1"', description: 'Render element. Use h2 if the page already has an h1 elsewhere.' },
          { prop: 'size',     type: '"md" | "sm"', default: '"md"', description: 'md = 36px (default), sm = 17px (compact variant).' },
          { prop: 'children', type: 'ReactNode', required: true, description: 'Title text. Code-shaped identifiers (service-name, repo-slug) stay LTR even inside RTL pages.' },
        ]}
      />
      <PropsTable
        label="<PageHeader.Actions />"
        rows={[
          { prop: 'priority', type: '"trailing" | "leading"', default: '"trailing"', description: 'Where the cluster anchors. Default is trailing edge of the title row.' },
          { prop: 'children', type: 'ReactNode', required: true, description: 'One ember max. Order: ghost → outline → primary → ember, scanning toward the trailing edge.' },
        ]}
      />
    </Section>
  );
}
