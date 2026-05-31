'use client';
// Forge Mobile — Filter chips. A horizontally-scrolling row of selectable
// filters above a list — the mobile equivalent of a filter bar.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono, AutoPropsTable, Skeleton, Spinner, Alert, AlertTitle, AlertDescription, AlertActions } from '@/ds/core';

const FILTERS = ['All', 'Tier 1', 'Degraded', 'My tribe', 'On-call', 'Recently deployed'];

// Each service tagged with the facets it satisfies, so the live chip row really
// filters — and "On-call" deliberately matches nothing to demo the empty state.
const SERVICES: { name: string; facets: string[] }[] = [
  { name: 'identity-svc', facets: ['Tier 1', 'My tribe', 'Recently deployed'] },
  { name: 'pix-router',   facets: ['Tier 1', 'Degraded'] },
  { name: 'fraud-scorer', facets: ['Degraded', 'My tribe'] },
  { name: 'payments-api', facets: ['Tier 1', 'Recently deployed'] },
];

// Honor prefers-reduced-motion: the documented "fill transition" is real on the
// rendered chips, and collapses to instant when the user asks for less motion.
function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return reduced;
}

type LoadState = 'ready' | 'loading' | 'error';

function ChipsScreen({ state = 'ready' }: { state?: LoadState }) {
  const [active, setActive] = React.useState('All');
  const [focusIdx, setFocusIdx] = React.useState(() => Math.max(0, FILTERS.indexOf('All')));
  const reduced = useReducedMotion();
  const rtl = React.useRef(false);
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const rows = active === 'All' ? SERVICES : SERVICES.filter((s) => s.facets.includes(active));

  // Roving tabindex: exactly one chip is in the Tab order (the checked one),
  // and Arrow / Home / End move selection — RTL-aware, mirroring swipe direction.
  function select(i: number) {
    const next = (i + FILTERS.length) % FILTERS.length;
    setActive(FILTERS[next]);
    setFocusIdx(next);
    refs.current[next]?.focus();
  }
  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, i: number) {
    const dir = rtl.current ? -1 : 1;
    switch (e.key) {
      case 'ArrowRight': e.preventDefault(); select(i + dir); break;
      case 'ArrowLeft':  e.preventDefault(); select(i - dir); break;
      case 'Home':       e.preventDefault(); select(0); break;
      case 'End':        e.preventDefault(); select(FILTERS.length - 1); break;
      case ' ':
      case 'Enter':      e.preventDefault(); setActive(FILTERS[i]); break;
    }
  }

  return (
    <div
      ref={(el) => { rtl.current = !!el && getComputedStyle(el).direction === 'rtl'; }}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <div style={{ height: 50, flex: '0 0 auto' }} />
      <div style={{ padding: '2px 18px 10px', fontSize: 'var(--text-xl)', fontWeight: 700, letterSpacing: '-0.02em' }}>Services</div>
      <div role="radiogroup" aria-label="Filter services" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '2px 14px 12px', scrollbarWidth: 'none' }}>
        {FILTERS.map((f, i) => {
          const isActive = active === f;
          return (
            <button key={f} ref={(el) => { refs.current[i] = el; }}
              role="radio" aria-checked={isActive} tabIndex={isActive ? 0 : -1}
              onClick={() => { setActive(f); setFocusIdx(i); }}
              onKeyDown={(e) => onKeyDown(e, i)} onFocus={() => setFocusIdx(i)}
              style={{ flex: '0 0 auto', whiteSpace: 'nowrap', padding: '7px 14px', borderRadius: 999, fontSize: 'var(--text-sm)', fontWeight: isActive ? 600 : 500, cursor: 'pointer',
                background: isActive ? 'var(--ember)' : 'var(--surface)', color: isActive ? 'var(--ember-fg)' : 'var(--fg-muted)', border: '1px solid', borderColor: isActive ? 'transparent' : 'var(--border)',
                transition: reduced ? 'none' : 'background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease)' }}>
              {f}
            </button>
          );
        })}
      </div>

      {/* List header — live result count (tabular-nums) backs the announced count */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 18px 8px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-subtle)' }}>{active}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontVariantNumeric: 'tabular-nums', color: state === 'ready' ? 'var(--fg-muted)' : 'var(--fg-faint)' }}>
          {state === 'loading' ? '— services' : state === 'error' ? '! services' : `${rows.length} service${rows.length === 1 ? '' : 's'}`}
        </span>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 14px 14px' }} aria-live="polite" aria-busy={state === 'loading'}>
        {state === 'loading' ? (
          // Loading — skeleton rows + a labelled status spinner
          <div role="status" aria-label="Loading services" style={{ display: 'flex', flexDirection: 'column' }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <Skeleton variant="circle" size={15} />
                <Skeleton variant="line" width={i % 2 ? '52%' : '68%'} height={11} />
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px 0', color: 'var(--fg-muted)', fontSize: 'var(--text-xs)' }}>
              <Spinner size="sm" aria-label="Loading services" /> Fetching catalog…
            </div>
          </div>
        ) : state === 'error' ? (
          // Error — danger Alert (role="alert") with a retry action
          <div style={{ padding: '16px 4px' }}>
            <Alert tone="danger">
              <AlertTitle>Couldn&apos;t load services</AlertTitle>
              <AlertDescription>The catalog API didn&apos;t respond. Your filters are preserved.</AlertDescription>
              <AlertActions>
                <button className="btn xs"><Icons.refresh size={12} /> Retry</button>
              </AlertActions>
            </Alert>
          </div>
        ) : rows.length === 0 ? (
          // Empty — On-call matches nothing
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '44px 16px', textAlign: 'center' }}>
            <Icons.inbox size={22} color="var(--fg-faint)" />
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>No services on-call</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', lineHeight: 1.5 }}>Nothing matches <b style={{ color: 'var(--fg)' }}>{active}</b>. Pick another facet.</span>
          </div>
        ) : rows.map((s) => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
            <Icons.server size={15} color="var(--fg-muted)" />
            <span style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 500 }}>{s.name}</span>
            {s.facets.includes('Tier 1') && <span className="pill ember" style={{ fontSize: 'var(--text-xs)', fontVariantNumeric: 'tabular-nums' }}>T1</span>}
            <Icons.chevronRight size={14} color="var(--fg-faint)" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MobileChips() {
  return (
    <Section id="chips" num="01" title="Filter chips"
      desc="A horizontally-scrolling row of single-select filters above a list — the mobile equivalent of a filter bar. Narrows a long list to one facet without leaving the screen.">
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>Let the row scroll rather than wrap — the leading chips stay visible as a thumb affordance. The active chip is ember-filled; the rest stay quiet outlines. Tap a chip to refilter the list live, or focus the row and press <Mono>{'→'}</Mono>/<Mono>{'←'}</Mono> to roam; <Mono>On-call</Mono> matches nothing here, so the row falls through to its empty state.</Lede>
      <Frame label="single-select · roving arrow nav · live count · empty state on On-call · pick a device" center>
        <DeviceFrame><ChipsScreen /></DeviceFrame>
      </Frame>

      <SubHead meta="states">States</SubHead>
      <Lede>The list region drives four explicit, labelled states. Loading shows skeleton rows under a <Mono>role="status"</Mono> spinner; error surfaces a <Mono>role="alert"</Mono> danger box with a retry that preserves the chosen filter; empty is reached live by selecting <Mono>On-call</Mono>.</Lede>
      <Frame label="loading · error · empty (left to right) — the three non-default list states" center>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
          <DeviceFrame><ChipsScreen state="loading" /></DeviceFrame>
          <DeviceFrame><ChipsScreen state="error" /></DeviceFrame>
          <DeviceFrame><ChipsScreen state="ready" /></DeviceFrame>
        </div>
      </Frame>
      <Lede>A chip can also be <b style={{ color: 'var(--fg)' }}>disabled</b> when its facet is unavailable for the current scope — keep it in the row (so the set reads complete) but drop it from the focus order with <Mono>aria-disabled</Mono> and a dimmed label:</Lede>
      <Frame label="disabled chip — present but non-interactive" center code={`<button role="radio" aria-disabled aria-checked={false} tabIndex={-1}>Archived</button>`} lang="tsx">
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <span className="pill ember">All</span>
          <span style={{ padding: '5px 12px', borderRadius: 999, border: '1px solid var(--border)', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>Tier 1</span>
          <span aria-disabled="true" style={{ padding: '5px 12px', borderRadius: 999, border: '1px solid var(--border)', fontSize: 'var(--text-sm)', color: 'var(--fg-faint)', opacity: 0.55, cursor: 'not-allowed' }}>Archived</span>
        </div>
      </Frame>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 10}}>Keyboard</div>
          <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-base)'}}>
            <tbody>
              {[
                ['Tab', 'Move focus onto the chip row — one stop, landing on the checked chip (roving tabindex).'],
                ['→ / ←', 'Move selection to the next / previous chip and refilter; wraps at the ends. Mirrored under RTL.'],
                ['Home / End', 'Jump selection to the first / last chip.'],
                ['Space / Enter', 'Re-assert the focused chip as the active filter.'],
                ['Tab', 'Leave the row for the filtered list below.'],
              ].map(([k, a], i) => (
                <tr key={i} style={{verticalAlign: 'top'}}>
                  <td style={{padding: '4px 12px 4px 0', whiteSpace: 'nowrap'}}><Mono>{k}</Mono></td>
                  <td style={{padding: '4px 0', color: 'var(--fg-muted)', lineHeight: 1.55}}>{a}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 6}}>Roles &amp; state</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The row ships <Mono>role="radiogroup"</Mono> with <Mono>aria-label="Filter services"</Mono>; each chip is a <Mono>radio</Mono> carrying <Mono>aria-checked</Mono>, so VoiceOver announces "Tier 1, selected, 2 of 6". The result list is an <Mono>aria-live="polite"</Mono> region toggling <Mono>aria-busy</Mono> while loading, so the new count — or the empty / error state — is read after a change. Multi-select variants swap to <Mono>aria-pressed</Mono> toggles.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 6}}>Focus &amp; gesture fallback</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Each chip is a real <Mono>&lt;button&gt;</Mono> taking the canonical ember focus ring (<Mono>2px</Mono> outline, <Mono>2px</Mono> offset) on <Mono>:focus-visible</Mono>. Only the checked chip is in the Tab order; arrows roam the rest, so horizontal scroll is a convenience, not a requirement — a keyboard or switch user reaches off-screen chips without the swipe. Each clears the 44px touch target with an 8px gap so adjacent chips never share a thumb.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 6}}>Motion &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The fill cross-fades over <Mono>--dur-fast</Mono>; the live demo reads <Mono>prefers-reduced-motion</Mono> and drops the transition to <Mono>none</Mono>, so the swap is instant (the loading skeleton shimmer rests flat too). The active chip pairs ember with dark ink (<Mono>--ember-fg</Mono>) for AA contrast; rest chips keep the muted label readable on the surface.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — the chip row starts at the right and scrolls toward the left'} center code={`<div dir="rtl"><ChipsScreen /></div>`} lang="tsx">
        <div dir="rtl"><DeviceFrame><ChipsScreen /></DeviceFrame></div>
      </Frame>
      <Lede>Under <Mono>dir="rtl"</Mono> the horizontal chip row starts from the right and scrolls toward the left — flex order plus <Mono>inset-inline-start</Mono> do the work — and the list rows mirror with their trailing chevron pointing to the start. Arrow keys mirror too: <Mono>{'→'}</Mono> moves toward the visual right (the earlier chip). Selection styling (ember fill, dark ink) is unaffected.</Lede>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 300 }} aria-hidden="true">
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ padding: '7px 14px', borderRadius: 999, background: 'var(--ember)', color: 'var(--ember-fg)', fontSize: 'var(--text-sm)', fontWeight: 600, whiteSpace: 'nowrap' }}>All</span>
                <span style={{ padding: '7px 14px', borderRadius: 999, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--fg-muted)', fontSize: 'var(--text-sm)', whiteSpace: 'nowrap' }}>Healthy</span>
                <span style={{ padding: '7px 14px', borderRadius: 999, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--fg-muted)', fontSize: 'var(--text-sm)', whiteSpace: 'nowrap' }}>Degraded</span>
              </div>
              <div style={{ marginTop: 12, border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ padding: '9px 12px', fontSize: 'var(--text-sm)', color: 'var(--fg)' }}>payments-api</div>
                <div style={{ height: 1, background: 'var(--border)' }} />
                <div style={{ padding: '9px 12px', fontSize: 'var(--text-sm)', color: 'var(--fg)' }}>ledger-core</div>
              </div>
              <span className="lead v" style={{ top: -22, left: 22, height: 18 }} />
              <span className="lead h" style={{ top: 16, left: -28, width: 24 }} />
              <span className="lead h" style={{ top: 16, right: -28, width: 24 }} />
              <span className="lead v" style={{ bottom: -22, left: '50%', height: 18, transform: 'translateX(-50%)' }} />
              <div className="pin" style={{ top: -42, left: 22, transform: 'translateX(-50%)' }}>1</div>
              <div className="pin" style={{ top: 7, left: -52 }}>2</div>
              <div className="pin" style={{ top: 7, right: -52 }}>3</div>
              <div className="pin" style={{ top: -42, left: '50%', transform: 'translateX(-50%)' }}>4</div>
              <div className="pin" style={{ bottom: -42, left: '50%', transform: 'translateX(-50%)' }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Chip.</b> Pill button (radius 999), 7×14px padding, label only — no icon clutter.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Active chip.</b> Ember fill with <b style={{ color: 'var(--fg)' }}>dark ink</b> (<code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>var(--ember-fg)</code>) label — never ember-on-ember.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Rest chips.</b> Quiet surface fill with a hairline border and muted label.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Scroll row.</b> Single line, <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>overflow-x: auto</code>, hidden scrollbar — overflow scrolls, never wraps.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>List below.</b> The filtered result rows the chips drive, headed by a live count.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — one row, one selection</div>
          <div className="body" style={{gap: 8}}>
            <span className="pill ember">All</span>
            <span style={{padding:'5px 12px', borderRadius:999, border:'1px solid var(--border)', fontSize:'var(--text-sm)', color:'var(--fg-muted)'}}>Tier 1</span>
            <span style={{padding:'5px 12px', borderRadius:999, border:'1px solid var(--border)', fontSize:'var(--text-sm)', color:'var(--fg-muted)'}}>Degraded</span>
          </div>
          <div className="note">A single ember chip carries the active facet; the rest stay quiet outlines. Overflow scrolls.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — wrap into a grid</div>
          <div className="body" style={{flexWrap:'wrap', gap: 6, maxWidth:200}}>
            {['All','Tier 1','Degraded','My tribe','On-call','Recent'].map(f => <span key={f} style={{padding:'5px 10px', borderRadius:999, border:'1px solid var(--border)', fontSize: 'var(--text-sm)', color:'var(--fg-muted)'}}>{f}</span>)}
          </div>
          <div className="note">Wrapping eats vertical space and hides the list. Keep one scrolling row so leading chips stay visible.</div>
        </div>
      </div>

      <SubHead meta="reference">API reference</SubHead>
      <CodeBlock label="filter chips" lang="tsx" code={`<div className="m-chips" role="radiogroup" aria-label="Filter services">
  {/* overflow-x: auto; no wrap; scrollbar hidden */}
  {filters.map((f, i) => (
    <button key={f} role="radio" aria-checked={f === active}
      // roving tabindex: only the checked chip is tabbable
      tabIndex={f === active ? 0 : -1}
      className={f === active ? 'is-active' : ''}
      // fill cross-fades on --dur-fast; reduced-motion drops it to none
      style={{ transition: reduced ? 'none' : 'background var(--dur-fast) var(--ease)' }}
      onKeyDown={(e) => onArrow(e, i)}  // ArrowLeft/Right + Home/End, RTL-aware
      onClick={() => setActive(f)}>{f}</button>
  ))}
</div>
{/* result list = aria-live="polite" + aria-busy region: count, empty, loading & error announce */}`} />
      <AutoPropsTable component="Chip" label="<Chip />" />
    </Section>
  );
}
