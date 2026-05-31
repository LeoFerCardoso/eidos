'use client';
// Eidos Mobile — Search (scaffold). A full-width search field with leading icon and an
// inline Cancel, over recent queries and live results.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono } from '@/ds/core';

const ALL = ['identity-svc', 'identity-gateway', 'payments-api', 'pix-router', 'fraud-scorer', 'onboarding-bff'];

function SearchScreen() {
  const [q, setQ] = React.useState('');
  const results = q ? ALL.filter((s) => s.includes(q.toLowerCase())) : [];
  // The aria-live region must mirror what VoiceOver/TalkBack would say.
  const count = q ? `${results.length} ${results.length === 1 ? 'service' : 'services'}` : '';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ height: 50, flex: '0 0 auto' }} />
      <div role="search" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 14px 12px' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 999, paddingInline: 12, minBlockSize: 36 }}>
          <Icons.search size={15} color="var(--fg-muted)" aria-hidden="true" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search services" autoFocus
            role="searchbox" type="search" aria-label="Search services" aria-controls="m-search-results"
            style={{ flex: 1, minWidth: 0, background: 'transparent', border: 0, color: 'var(--fg)', fontSize: 'var(--text-sm)', paddingBlock: 8 }} />
          {q && (
            <button type="button" onClick={() => setQ('')} aria-label="Clear search"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minInlineSize: 44, minBlockSize: 44, marginInlineEnd: -10, background: 'transparent', border: 0, cursor: 'pointer' }}>
              <Icons.x size={15} color="var(--fg-muted)" />
            </button>
          )}
        </div>
        <button className="btn ghost sm" type="button" onClick={() => setQ('')} style={{ minBlockSize: 44 }}>Cancel</button>
      </div>
      <div aria-live="polite" className="sr-only">{count}</div>
      <div id="m-search-results" style={{ flex: 1, overflow: 'auto', padding: '0 14px' }}>
        {!q && (
          <>
            <div className="t-mono-label" style={{ padding: '4px 0 8px' }}>Recent</div>
            {['pix-router', 'fraud-scorer'].map((r) => (
              <button key={r} type="button" style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 10, minBlockSize: 44, paddingBlock: 10, background: 'transparent', border: 0, borderBottom: '1px solid var(--border)', color: 'var(--fg)', cursor: 'pointer', textAlign: 'start' }}>
                <Icons.search size={14} color="var(--fg-faint)" aria-hidden="true" />
                <span style={{ flex: 1, fontSize: 'var(--text-sm)' }}>{r}</span>
                <Icons.arrowUp size={13} color="var(--fg-faint)" aria-hidden="true" style={{ transform: 'rotate(-45deg)' }} />
              </button>
            ))}
          </>
        )}
        {q && (
          <div aria-hidden="true" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBlock: '6px 4px' }}>
            <span className="t-mono-label">Services</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', fontVariantNumeric: 'tabular-nums' }}>{count}</span>
          </div>
        )}
        {q && results.map((r) => (
          <button key={r} type="button" style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 10, minBlockSize: 44, paddingBlock: 10, background: 'transparent', border: 0, borderBottom: '1px solid var(--border)', color: 'var(--fg)', cursor: 'pointer', textAlign: 'start' }}>
            <Icons.server size={14} color="var(--fg-muted)" aria-hidden="true" />
            <span style={{ flex: 1, fontSize: 'var(--text-sm)' }}>{r}</span>
            <Icons.chevronRight size={14} color="var(--fg-faint)" aria-hidden="true" />
          </button>
        ))}
        {q && results.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: 'var(--fg-muted)', fontSize: 'var(--text-sm)' }}>No services match “{q}”.</div>}
      </div>
    </div>
  );
}

export default function MobileSearch() {
  return (
    <Section id="search" num="01" title="Search"
      desc="A full-width field with a leading magnifier and an inline Cancel. Use it when a list outgrows the screen and scanning stops working. Filter live; results are tappable list rows.">
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>Show recent queries when empty; keep the field at the top edge, within thumb reach on entry. Results are chevroned list rows — tappable, never a modal overlay.</Lede>
      <Frame label="recent → live results · pick a device" center>
        <DeviceFrame initial="iphone-se"><SearchScreen /></DeviceFrame>
      </Frame>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 300 }} aria-hidden="true">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 999, padding: '8px 12px' }}>
                  <Icons.search size={15} style={{ color: 'var(--fg-faint)' }} />
                  <span style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--fg)' }}>checkout</span>
                  <span style={{ display: 'inline-flex', width: 18, height: 18, borderRadius: 999, background: 'var(--surface-active)', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-muted)' }}><Icons.x size={11} /></span>
                </div>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', fontWeight: 500 }}>Cancel</span>
              </div>
              <div style={{ marginTop: 10, border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ padding: '9px 12px', fontSize: 'var(--text-sm)', color: 'var(--fg)' }}>checkout-service</div>
                <div style={{ height: 1, background: 'var(--border)' }} />
                <div style={{ padding: '9px 12px', fontSize: 'var(--text-sm)', color: 'var(--fg)' }}>checkout-web</div>
              </div>
              <span className="lead h" style={{ top: 16, left: -28, width: 24 }} />
              <span className="lead v" style={{ top: -22, left: 30, height: 18 }} />
              <span className="lead v" style={{ top: -22, left: '42%', height: 18, transform: 'translateX(-50%)' }} />
              <span className="lead h" style={{ top: 16, right: -28, width: 24 }} />
              <span className="lead h" style={{ bottom: 64, right: -28, width: 24 }} />
              <span className="lead v" style={{ bottom: -22, left: '40%', height: 18, transform: 'translateX(-50%)' }} />
              <div className="pin" style={{ top: 7, left: -52 }}>1</div>
              <div className="pin" style={{ top: -42, left: 30, transform: 'translateX(-50%)' }}>2</div>
              <div className="pin" style={{ top: -42, left: '42%', transform: 'translateX(-50%)' }}>3</div>
              <div className="pin" style={{ top: 7, right: -52 }}>4</div>
              <div className="pin" style={{ bottom: 55, right: -52 }}>5</div>
              <div className="pin" style={{ bottom: -42, left: '40%', transform: 'translateX(-50%)' }}>6</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Field.</b> Full-width pill control on a quiet surface; expands to fill the bar on focus.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Leading magnifier.</b> 15px search icon marking the control — decorative, not a button.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Input.</b> The query; <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>autoFocus</code> raises the keyboard on entry.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Clear button.</b> Trailing ✕, shown only while there{"'"}s text, wipes the field in place.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Cancel.</b> Inline ghost button outside the field — dismisses the keyboard and exits search.</span>
            <span className="num">6</span><span><b style={{ color: 'var(--fg)' }}>Results / Recents.</b> List rows below: recent queries when empty, live matches once typing.</span>
          </div>
        </div>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Touch targets</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Clear, Cancel, and every result row clear 44×44px; row padding scales from the 4-pt base. The clear ✕ keeps a comfortable hit area even though the glyph is 14px.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>VoiceOver / TalkBack</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The field is <code style={{fontFamily:'var(--font-mono)'}}>role="searchbox"</code> + <code style={{fontFamily:'var(--font-mono)'}}>type="search"</code> with an <code style={{fontFamily:'var(--font-mono)'}}>aria-label</code>, wrapped in <code style={{fontFamily:'var(--font-mono)'}}>role="search"</code>. Result count is announced from an <code style={{fontFamily:'var(--font-mono)'}}>aria-live="polite"</code> region ("6 services") so typing isn{"'"}t silent. The clear control is <code style={{fontFamily:'var(--font-mono)'}}>aria-label="Clear search"</code>; result icons are <code style={{fontFamily:'var(--font-mono)'}}>aria-hidden</code>.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 8}}>Keyboard — no gesture required</div>
          <div className="kbd-row" style={{paddingInline: 0}}><span className="label">Move into the field, then between rows</span><span className="kbd-chord"><span className="kbd">Tab</span></span></div>
          <div className="kbd-row" style={{paddingInline: 0}}><span className="label">Submit / open the focused row</span><span className="kbd-chord"><span className="kbd">Return</span></span></div>
          <div className="kbd-row" style={{paddingInline: 0}}><span className="label">Clear the field (native search reset)</span><span className="kbd-chord"><span className="kbd">Esc</span></span></div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.55, marginBlockStart: 8}}>No swipe to learn — Cancel is a visible button, not swipe-to-dismiss; everything is reachable in focus order.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The field-expand and Cancel slide-in honour <code style={{fontFamily:'var(--font-mono)'}}>prefers-reduced-motion</code>. Placeholder, query text, and the magnifier all keep AA contrast on the field surface.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — magnifier moves right, clear/cancel left, query right-aligns'} center code={`<div dir="rtl"><SearchScreen /></div>`} lang="tsx">
        <div dir="rtl"><DeviceFrame initial="iphone-se"><SearchScreen /></DeviceFrame></div>
      </Frame>
      <Lede>Under <Mono>dir="rtl"</Mono> the leading search icon moves to the right of the field, the clear ✕ and the Cancel button move to the left, and the query text right-aligns; the recents and results rows mirror the same way, their trailing chevron pointing toward the start.</Lede>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — recents when empty</div>
          <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap: 8, color:'var(--fg-muted)', fontSize:'var(--text-sm)'}}>
            <div className="t-mono-label">Recent</div>
            <div style={{display:'flex', gap:8, alignItems:'center'}}><Icons.search size={13}/> pix-router</div>
            <div style={{display:'flex', gap:8, alignItems:'center'}}><Icons.search size={13}/> fraud-scorer</div>
          </div>
          <div className="note">Give the empty state a head start; surface recents and let live results filter as they type.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — gate behind a submit</div>
          <div className="body" style={{gap: 8}}>
            <span className="in-control" style={{padding:'6px 10px', fontSize:'var(--text-sm)', color:'var(--fg-faint)'}}>identity</span>
            <button className="btn ember sm">Search</button>
          </div>
          <div className="note">A separate Search button adds a tap and a wait. Filter live; reserve submit for server-heavy queries.</div>
        </div>
      </div>

      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock label="search field" lang="tsx" code={`<div className="m-search" role="search">
  <Icons.search aria-hidden />
  <input role="searchbox" type="search" value={q} aria-controls="results"
    onChange={e => setQ(e.target.value)} aria-label="Search services" />
  {q && <button type="button" onClick={clear} aria-label="Clear search"><Icons.x /></button>}
</div>
<button className="btn ghost" type="button" onClick={dismiss}>Cancel</button>
{/* announce result count to SR users */}
<div id="results" aria-live="polite">{q ? \`\${results.length} services\` : ''}</div>`} />
    </Section>
  );
}
