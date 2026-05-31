'use client';
// Eidos DS — Components / Pagination.
// Page navigation for tables and long lists. Numbered (compact / full),
// page-of-pages, simple prev/next, with optional page-size and "showing
// N–M of T" indicator.
import * as React from 'react';
import { Icons, Pagination, SimplePagination, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, Lede, Mono } from '@/ds/core';


  const USAGE_CODE = `import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/forge/pagination"

export function Demo() {
  const [page, setPage] = React.useState(1);
  return (
    <Pagination total={12} current={page} onChange={setPage} />
  )
}`;

// Neutral inline-code treatment for prose tokens — keeps tags like
// <nav>/aria-current in the Eidos mono type system without burning an ember
// use (that is reserved for the active page + the section eyebrows).
const codeStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--text-sm)',
  color: 'var(--fg-subtle)',
};

export default function Page() {
    const [p1, setP1] = React.useState(5);
    const [p2, setP2] = React.useState(1);
    const [p3, setP3] = React.useState(8);
    const [p4, setP4] = React.useState(2);
    const [p5, setP5] = React.useState(3);
    const [pSize, setPSize] = React.useState(20);
    const [pT, setPT] = React.useState(1);
    const [pAr, setPAr] = React.useState(2);
    const [pDemo, setPDemo] = React.useState(1);
    const total = 12;
    const totalRows = 248;

    return (
      <Section
        id="pagination"
        title="Pagination"
        desc="Page navigation for tables and long lists — use when the dataset is too large to load at once and ordering is meaningful to preserve across pages."
      >
        {/* 1. INSTALLATION */}
        <SubHead meta="package managers">Installation</SubHead>
        <TabbedCode tabs={installTabs('pagination')} ariaLabel="package manager"/>
        <Lede>
          Ships <Mono>Pagination</Mono> plus subcomponents for content, items, and prev/next links. Pair with tabular numerics to avoid layout shift as the page index changes.
        </Lede>

        {/* 2. USAGE */}
        <SubHead meta="hello world">Usage</SubHead>
        <Lede>Pair with a row count and (optionally) a page-size picker so users can land on the right density of rows per view without changing pages repeatedly.</Lede>
        <Frame label="basic" code={USAGE_CODE}>
          <div style={{padding: 12, display:'flex', justifyContent:'center'}}>
            <Pagination total={total} current={pDemo} onChange={setPDemo}/>
          </div>
        </Frame>

        {/* 3. EXAMPLES — divider eyebrow */}
        <div style={{
          marginTop: 36, marginBottom: 6,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--fg-faint)',
          }}>Examples</span>
          <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
        </div>

        {/* Default */}
        <SubHead meta="siblings=1">Default</SubHead>
        <Frame
          label="numbered with ellipses · siblings=1 by default"
          code={`<Pagination total={12} current={page} onChange={setPage} />`}
        >
          <div style={{padding: 24, display:'flex', justifyContent:'center'}}>
            <Pagination total={total} current={p1} onChange={setP1}/>
          </div>
        </Frame>
        <Lede>Shows first, last, current ± 1 sibling, with ellipses for the gap. The button row stays the same width as the user moves through pages — no layout shift.</Lede>

        {/* Compact */}
        <SubHead meta="compact">Compact (icons only)</SubHead>
        <Frame
          label="compact · prev/next show only the chevron"
          code={`<Pagination compact total={12} current={page} onChange={setPage} />`}
        >
          <div style={{padding: 24, display:'flex', justifyContent:'center'}}>
            <Pagination compact total={total} current={p3} onChange={setP3}/>
          </div>
        </Frame>

        {/* Outline */}
        <SubHead meta="variant">Outline</SubHead>
        <Frame
          label="outline · borders on every button — better for low-contrast surfaces"
          code={`<Pagination variant="outline" total={12} current={page} onChange={setPage} />`}
        >
          <div style={{padding: 24, display:'flex', justifyContent:'center'}}>
            <Pagination outline total={total} current={p5} onChange={setP5}/>
          </div>
        </Frame>

        {/* Sizes */}
        <SubHead meta="sm · md · lg">Sizes</SubHead>
        <Frame
          label="match button heights — 28 / 32 / 40"
          code={`<Pagination size="sm" total={12} current={page} onChange={setPage} />
<Pagination size="md" total={12} current={page} onChange={setPage} />
<Pagination size="lg" total={12} current={page} onChange={setPage} />`}
        >
          <div style={{padding: 24, display:'flex', flexDirection:'column', gap: 14, alignItems:'center'}}>
            <Pagination size="sm" total={total} current={p1} onChange={setP1}/>
            <Pagination total={total} current={p1} onChange={setP1}/>
            <Pagination size="lg" total={total} current={p1} onChange={setP1}/>
          </div>
        </Frame>

        {/* Simple — prev/next only */}
        <SubHead meta="simple">Simple prev/next</SubHead>
        <Frame
          label="no numbers · for keyboard-driven flows or ordered lists where the total isn't meaningful"
          code={`<SimplePagination total={12} current={page} onChange={setPage} />`}
        >
          <div style={{padding: 24, display:'flex', justifyContent:'center'}}>
            <SimplePagination total={total} current={p2} onChange={setP2}/>
          </div>
        </Frame>

        {/* Bar — table footer */}
        <SubHead meta="composition">Table footer</SubHead>
        <Frame
          label="row count · page size picker · pagination — the canonical table footer"
          code={`<div className="pg-bar">
  <span className="meta">
    Showing <strong>1–20</strong> of <strong>248</strong>
  </span>
  <Pagination total={…} current={…} onChange={…} />
</div>`}
        >
          <div style={{padding: 0, width:'100%'}}>
            <div className="surface" style={{padding: 0, borderRadius: 10, overflow:'hidden'}}>
              <div style={{padding: '24px', textAlign:'center', color:'var(--fg-faint)', fontSize: 'var(--text-base)', borderBottom:'1px dashed var(--border)'}}>
                <div style={{fontFamily:'var(--font-mono)', marginBottom: 4}}>· · · table rows · · ·</div>
                <div style={{fontVariantNumeric:'tabular-nums'}}>{Math.min((pT - 1) * pSize + 1, totalRows)}–{Math.min(pT * pSize, totalRows)} of {totalRows}</div>
              </div>
              <div className="pg-bar">
                <span className="meta">
                  Showing <strong>{Math.min((pT - 1) * pSize + 1, totalRows)}–{Math.min(pT * pSize, totalRows)}</strong> of <strong>{totalRows}</strong>
                </span>
                <div style={{display:'flex', alignItems:'center', gap: 10}}>
                  <label htmlFor="pg-rows-per-page" style={{fontSize: 'var(--text-base)', color:'var(--fg-faint)'}}>Rows</label>
                  <select
                    id="pg-rows-per-page"
                    className="pg-select"
                    aria-label="Rows per page"
                    value={pSize}
                    onChange={(e) => { setPSize(+e.target.value); setPT(1); }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <Pagination size="sm" total={Math.ceil(totalRows / pSize)} current={pT} onChange={setPT}/>
                </div>
              </div>
            </div>
          </div>
        </Frame>
        <Lede>Bar shows position ("Showing 1–20 of 248"), row size picker, and pagination together. The row count uses tabular numerics so digits stay aligned through the count change.</Lede>

        {/* Few pages */}
        <SubHead meta="zero state">Single page</SubHead>
        <Frame
          label="when total is 1, prev/next disable but the row stays for layout consistency"
          code={`<Pagination total={1} current={1} onChange={setPage} />`}
        >
          <div style={{padding: 24, display:'flex', justifyContent:'center'}}>
            <Pagination total={1} current={1} onChange={()=>{}}/>
          </div>
        </Frame>

        {/* With first/last */}
        <SubHead meta="extras">First / last buttons</SubHead>
        <Frame
          label="showFirstLast · for very large datasets where jumping to the end matters"
          code={`<Pagination showFirstLast total={50} current={page} onChange={setPage} />`}
        >
          <div style={{padding: 24, display:'flex', justifyContent:'center'}}>
            <Pagination showFirstLast total={50} current={p4} onChange={setP4}/>
          </div>
        </Frame>

        {/* Accessibility */}
        <SubHead meta="a11y">Accessibility</SubHead>
        <div className="ds-grid cols-2" style={{marginTop: 12}}>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Every page number, the prev / next controls, and the first / last buttons are real links or buttons in DOM order, reached with Tab and activated with Enter (Space for buttons). At the first page the Previous control is disabled and skipped; at the last page Next is disabled — focus never lands on a dead control.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Wrapped in a <code style={codeStyle}>&lt;nav&gt;</code> with <code style={codeStyle}>aria-label="Pagination"</code>. The current page sets <code style={codeStyle}>aria-current="page"</code>; icon-only prev / next / first / last controls carry explicit <code style={codeStyle}>aria-label</code>s, and the truncation ellipsis is <code style={codeStyle}>aria-hidden</code> so it is not announced as a page.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Focus is never suppressed without a substitute: every button and page link takes the canonical offset focus ring on <code style={codeStyle}>:focus-visible</code>, and the page-size <code style={codeStyle}>&lt;select&gt;</code> takes the matching ember ring. The current page marks itself with a filled state, not colour alone, and page numbers, the active fill, and disabled controls all clear AA contrast against the surface.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Only hover and focus-ring transitions move, both short token eases. There is no page-change animation, so <code style={codeStyle}>prefers-reduced-motion</code> has nothing to suppress.</div>
          </div>
        </div>

        {/* RTL */}
        <SubHead meta="RTL · العربية">Right-to-left</SubHead>
        <Frame
          label='dir="rtl" — chevrons mirror, page-1 sits on the right · order reverses'
          code={`<div dir="rtl">
  <Pagination total={12} current={page} onChange={setPage} />
</div>`}
        >
          <div dir="rtl" style={{padding: 24, display:'flex', justifyContent:'center'}}>
            <Pagination total={total} current={pAr} onChange={setPAr}/>
          </div>
        </Frame>

        {/* Decision matrix */}
        <SubHead meta="when to use">Pagination vs Infinite scroll vs Load more</SubHead>
        <div className="dd-grid">
          <div className="surface" style={{padding: 16}}>
            <div className="ds-h-eyebrow" style={{marginBottom: 6}}>Pagination</div>
            <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.55, marginBottom: 8}}>Order matters, users return to specific pages, totals are meaningful. Tables, search results, archives.</div>
            <div style={{fontSize: 'var(--text-base)', color:'var(--fg-subtle)'}}>Bookmarkable URLs · keyboard-friendly.</div>
          </div>
          <div className="surface" style={{padding: 16}}>
            <div className="ds-h-eyebrow" style={{marginBottom: 6}}>Infinite scroll</div>
            <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.55, marginBottom: 8}}>Browse-style flows where ranking decays — feed, gallery, social timeline. The user scans rather than navigates.</div>
            <div style={{fontSize: 'var(--text-base)', color:'var(--fg-subtle)'}}>Hard to reach the footer · skip when totals matter.</div>
          </div>
          <div className="surface" style={{padding: 16}}>
            <div className="ds-h-eyebrow" style={{marginBottom: 6}}>Load more</div>
            <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.55, marginBottom: 8}}>Hybrid — explicit user action, no scroll-jacking, footer reachable. Good for medium-length lists.</div>
            <div style={{fontSize: 'var(--text-base)', color:'var(--fg-subtle)'}}>Activity log, comments thread.</div>
          </div>
        </div>

        {/* ====================================================================
            ANATOMY
            ==================================================================== */}
        <SubHead meta="anatomy">Anatomy</SubHead>
        <div className="ds-frame">
          <div className="ds-frame-head"><span className="label">anatomy</span></div>
          <div className="ds-frame-body" style={{padding: '64px 36px 80px'}}>
            <div className="ana" style={{display:'flex', justifyContent:'center'}}>
              <div className="stage" style={{position:'relative'}} aria-hidden="true">
                <div style={{display:'flex', alignItems:'center', gap: 18}}>
                  <span style={{font:'400 var(--text-xs)/1 var(--font-mono)', color:'var(--fg-faint)', fontVariantNumeric:'tabular-nums'}}>1–20 of 248</span>
                  <nav className="pg" role="navigation" aria-label="Pagination">
                    <button className="pg-btn" tabIndex={-1} style={{cursor:'default'}}>
                      <Icons.chevronLeft size={14} className="ico-prev"/>
                      <span>Previous</span>
                    </button>
                    <button className="pg-btn" tabIndex={-1} style={{cursor:'default'}}>1</button>
                    <span className="pg-ellipsis" aria-hidden="true">…</span>
                    <button className="pg-btn" tabIndex={-1} style={{cursor:'default'}}>4</button>
                    <button className="pg-btn is-active" tabIndex={-1} style={{cursor:'default'}}>5</button>
                    <button className="pg-btn" tabIndex={-1} style={{cursor:'default'}}>6</button>
                    <span className="pg-ellipsis" aria-hidden="true">…</span>
                    <button className="pg-btn" tabIndex={-1} style={{cursor:'default'}}>12</button>
                    <button className="pg-btn" tabIndex={-1} style={{cursor:'default'}}>
                      <span>Next</span>
                      <Icons.chevronRight size={14} className="ico-next"/>
                    </button>
                  </nav>
                </div>

                {/* Lead lines + pins */}
                <span className="lead v" style={{top: -22, left: 8, height: 18}}/>
                <span className="lead v" style={{top: -22, left: 110, height: 18}}/>
                <span className="lead v" style={{bottom: -22, left: 232, height: 18}}/>
                <span className="lead v" style={{bottom: -22, left: 290, height: 18}}/>
                <span className="lead v" style={{top: -22, right: 50, height: 18}}/>

                <div className="pin" style={{top: -42, left: 8, transform:'translateX(-50%)'}}>1</div>
                <div className="pin" style={{top: -42, left: 110, transform:'translateX(-50%)'}}>2</div>
                <div className="pin" style={{bottom: -42, left: 232, transform:'translateX(-50%)'}}>3</div>
                <div className="pin" style={{bottom: -42, left: 290, transform:'translateX(-50%)'}}>4</div>
                <div className="pin" style={{top: -42, right: 50, transform:'translateX(50%)'}}>5</div>
              </div>
            </div>
            <div className="ana-list" style={{maxWidth: 560, margin:'72px auto 0'}}>
              <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Row count.</b> Optional, but recommended for tables. Mono <Mono>--fg-faint</Mono>, tabular numerics so digits don't reflow as the user pages.</span>
              <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Prev / next chevron buttons.</b> <Mono>.pg-btn</Mono> with the directional chevron. Disabled (opacity 0.35) at the boundary pages. <Mono>compact</Mono> drops the label.</span>
              <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Active page.</b> <Mono>.pg-btn.is-active</Mono>. Ember soft background, ember border, <Mono>aria-current="page"</Mono>. Only one per row.</span>
              <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Inactive page button.</b> Transparent until hover. 32×32 default — same footprint as the active state, so the row never shifts as the user moves.</span>
              <span className="num">5</span><span><b style={{color:'var(--fg)'}}>Ellipsis.</b> <Mono>.pg-ellipsis</Mono>. Non-interactive truncation. Keeps the row width constant when total &gt; 7, regardless of which page is current.</span>
            </div>
          </div>
        </div>

        {/* Do/Don't */}
        <SubHead meta="rules">Do / Don't</SubHead>
        <div className="dd-grid">
          <div className="dd-card do">
            <div className="head"><Icons.check size={12}/> Do — show row count alongside</div>
            <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap: 8}}>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                <span style={{font:'400 var(--text-xs)/1 var(--font-mono)', color:'var(--fg-faint)', fontVariantNumeric:'tabular-nums'}}>1–20 of 248</span>
                <Pagination size="sm" total={total} current={1} onChange={()=>{}}/>
              </div>
            </div>
            <div className="note">Page numbers don't tell the user how much data they're working with. "1–20 of 248" answers "am I making progress?" without leaving the table.</div>
          </div>
          <div className="dd-card dont">
            <div className="head"><Icons.x size={12}/> Don't — render every page button when total &gt; 8</div>
            <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap: 8}}>
              <div className="pg" style={{flexWrap:'wrap'}}>
                {Array.from({length: 14}, (_, i) => (
                  <button key={i} className={'pg-btn' + (i === 4 ? ' is-active' : '')}>{i + 1}</button>
                ))}
              </div>
            </div>
            <div className="note">A wall of numbers is hard to scan and impossible to fit on small surfaces. Use ellipses to keep the row constant-width.</div>
          </div>
          <div className="dd-card do">
            <div className="head"><Icons.check size={12}/> Do — keyboard the prev/next</div>
            <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap: 8}}>
              <div style={{display:'flex', gap: 6, flexWrap:'wrap', alignItems:'center'}}>
                <kbd className="kbd">←</kbd>
                <span style={{fontSize: 'var(--text-base)', color:'var(--fg-faint)'}}>previous page</span>
                <span style={{fontSize: 'var(--text-base)', color:'var(--fg-faint)', margin:'0 6px'}}>·</span>
                <kbd className="kbd">→</kbd>
                <span style={{fontSize: 'var(--text-base)', color:'var(--fg-faint)'}}>next page</span>
              </div>
            </div>
            <div className="note">For pages with a single dominant table, bind ←/→ globally. Power users move through 50 pages without touching the mouse.</div>
          </div>
          <div className="dd-card dont">
            <div className="head"><Icons.x size={12}/> Don't — reset page after every filter</div>
            <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap: 8}}>
              <div style={{display:'flex', flexDirection:'column', gap: 6, fontSize: 'var(--text-base)', color:'var(--fg-muted)'}}>
                <span>1. User on page 7 · scrolling rows</span>
                <span style={{color:'var(--danger)'}}>2. Adjusts filter → silently jumps to page 1</span>
                <span style={{color:'var(--danger)'}}>3. User loses scroll context — rage-quits the table</span>
              </div>
            </div>
            <div className="note">When filters change the result count, keep the user on a page that still exists (e.g. clamp to total). Only reset to 1 if their cursor would be out of range.</div>
          </div>
        </div>

        {/* 6. API REFERENCE */}
        <SubHead meta="PaginationProps">API reference</SubHead>
        <AutoPropsTable component="Pagination" label="<Pagination />"/>
      </Section>
    );
  }
