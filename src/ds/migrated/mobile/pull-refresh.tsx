'use client';
// Eidos Mobile — Pull to refresh. Drag the list down past the threshold to reload.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono } from '@/ds/core';

const THRESHOLD = 64;

function PullScreen() {
  const [pull, setPull] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const [settled, setSettled] = React.useState(false);
  const drag = React.useRef<{ y: number } | null>(null);
  const scroller = React.useRef<HTMLDivElement>(null);

  const onDown = (e: React.PointerEvent) => {
    if ((scroller.current?.scrollTop ?? 0) <= 0 && !refreshing) drag.current = { y: e.clientY };
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dy = e.clientY - drag.current.y;
    if (dy > 0) { setPull(Math.min(96, dy * 0.5)); }
  };
  const onUp = () => {
    if (!drag.current) return;
    drag.current = null;
    if (pull >= THRESHOLD) {
      setRefreshing(true); setSettled(false); setPull(THRESHOLD);
      window.setTimeout(() => {
        setRefreshing(false); setSettled(true); setPull(0);
        window.setTimeout(() => setSettled(false), 1400);
      }, 1300);
    } else setPull(0);
  };

  const ready = pull >= THRESHOLD;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ height: 44, flex: '0 0 auto' }} />
      <div style={{ padding: '4px 16px 12px', fontSize: 'var(--text-xl)', fontWeight: 700, letterSpacing: '-0.02em' }}>Activity</div>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        {/* refresh indicator behind the list */}
        <div style={{ position: 'absolute', insetInline: 0, top: 0, height: THRESHOLD, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, color: 'var(--fg-muted)' }}>
          {settled
            ? <Icons.check size={17} color="var(--success)" aria-hidden="true" />
            : <Icons.refresh size={17} className={refreshing ? 'ds-spin' : undefined} style={refreshing ? undefined : { transform: `rotate(${pull * 3}deg)` }} color={ready || refreshing ? 'var(--ember)' : 'var(--fg-faint)'} aria-hidden="true" />}
          <span role="status" aria-live="polite" style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em', color: settled ? 'var(--success)' : ready || refreshing ? 'var(--ember)' : undefined }}>{settled ? 'Updated · 6 items' : refreshing ? 'Refreshing…' : ready ? 'Release to refresh' : 'Pull to refresh'}</span>
        </div>
        {/* the list — translated down by the pull */}
        <div ref={scroller} style={{ height: '100%', overflow: 'auto', transform: `translateY(${pull}px)`, transition: drag.current ? 'none' : 'transform 240ms var(--ease)' }}>
          {['Deploy succeeded · identity-svc', 'Canary advanced to 50% · pix-router', 'SLO budget 38% · fraud-scorer', 'PR merged · payments-api', 'Incident resolved · pix-router', 'New version v4.19 · identity-svc'].map((t, i) => (
            <div key={i} style={{ padding: '13px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 7, height: 7, borderRadius: 999, background: i === 0 ? 'var(--ember)' : 'var(--fg-faint)', flex: '0 0 auto' }} />
              <span style={{ fontSize: 'var(--text-sm)' }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MobilePullRefresh() {
  return (
    <Section id="pull-refresh" num="01" title="Pull to refresh"
      desc="Drag the list down to reload — the gesture every handset user already knows. Use it on the primary scrolling list of a screen whose content changes over time.">
      <SubHead meta="interactive · drag the list down">Usage</SubHead>
      <Lede>The indicator rotates with the pull and flips to ember at the threshold. It only arms when the list is already scrolled to the top — a mid-list drag does nothing.</Lede>
      <Frame label="pull the list past the line" center>
        <DeviceFrame initial="iphone-se"><PullScreen /></DeviceFrame>
      </Frame>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 300 }} aria-hidden="true">
              <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: 'var(--bg)' }}>
                <div style={{ height: THRESHOLD, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  <Icons.refresh size={17} color="var(--ember)" />
                  <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em', color: 'var(--ember)' }}>Release to refresh</span>
                </div>
                <div style={{ borderTop: '1px dashed var(--border-strong)' }} />
                <div style={{ padding: '13px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--ember)', flex: '0 0 auto' }} />
                  <span style={{ fontSize: 'var(--text-sm)' }}>Deploy succeeded · identity-svc</span>
                </div>
                <div style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--fg-faint)', flex: '0 0 auto' }} />
                  <span style={{ fontSize: 'var(--text-sm)' }}>Canary advanced to 50% · pix-router</span>
                </div>
              </div>
              <span className="lead h" style={{ top: 22, left: -28, width: 24 }} />
              <span className="lead h" style={{ top: 44, left: -28, width: 24 }} />
              <span className="lead h" style={{ top: THRESHOLD, right: -28, width: 24 }} />
              <span className="lead h" style={{ bottom: 26, right: -28, width: 24 }} />
              <span className="lead v" style={{ top: -22, left: '50%', height: 18, transform: 'translateX(-50%)' }} />
              <div className="pin" style={{ top: 13, left: -52 }}>1</div>
              <div className="pin" style={{ top: 35, left: -52 }}>2</div>
              <div className="pin" style={{ top: THRESHOLD - 9, right: -52 }}>3</div>
              <div className="pin" style={{ bottom: 17, right: -52 }}>4</div>
              <div className="pin" style={{ top: -42, left: '50%', transform: 'translateX(-50%)' }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Indicator.</b> A refresh glyph behind the list that rotates in proportion to the pull distance.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Status label.</b> Mono caption reading Pull to refresh → Release to refresh → Refreshing….</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Threshold.</b> The trip point (~64px); crossing it flips the glyph to ember and arms the reload.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>List.</b> Translates down by the pull with rubber-band damping; snaps back on release.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Spinner → confirm.</b> The glyph spins while loading, then resolves to a green check and an <i>Updated · 6 items</i> count before the list settles to rest.</span>
          </div>
        </div>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Touch targets</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The whole list top is the pull region, so there's no small target to find. List rows beneath stay 44px tall and fully tappable once the gesture settles.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>VoiceOver / TalkBack</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The status label is a <code style={{fontFamily:'var(--font-mono)'}}>role="status" aria-live="polite"</code> region announcing <Mono>Refreshing…</Mono> then <Mono>Updated · 6 items</Mono> on settle, so a screen-reader user knows the reload finished without seeing the spinner.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Gesture has a fallback</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Pull is a shortcut, not the only way to reload: pair it with a visible Refresh control (an app-bar action or menu item) so anyone who can't perform the drag can still update the list.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Under <code style={{fontFamily:'var(--font-mono)'}}>prefers-reduced-motion</code> the spin is swapped for a calm opacity pulse (no rotation) — the <Mono>Refreshing…</Mono> label carries the state. The glyph and label keep AA contrast; the threshold cue is backed by the changing text, not the ember colour alone.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — a vertical gesture: only the row text and status copy align to the start'} center code={`<div dir="rtl">
  {/* pull is vertical, so the gesture itself is direction-agnostic */}
  <Indicator aria-live="polite" />
  <ul>…</ul>
</div>`} lang="tsx">
        <DeviceFrame initial="iphone-se"><div dir="rtl" style={{ height: '100%' }}><PullScreen /></div></DeviceFrame>
      </Frame>
      <Lede>Pull-to-refresh is a <b style={{ color: 'var(--fg)' }}>vertical</b> gesture, so the layout is largely direction-agnostic — there is no leading/trailing edge to flip and nothing needs <Mono>scaleX(-1)</Mono>. Only the centered indicator's caption and each row's text align to the start (now the right); the dot leads via logical spacing.</Lede>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — arm only at the top</div>
          <div className="body" style={{flexDirection:'column', gap:6, color:'var(--fg-muted)'}}>
            <Icons.refresh size={18} color="var(--ember)"/>
            <span style={{fontSize:'var(--text-xs)', fontFamily:'var(--font-mono)', fontVariantNumeric:'tabular-nums', letterSpacing:'0.02em'}}>Release to refresh</span>
          </div>
          <div className="note">Only engage when the list is scrolled to the very top, so mid-list scrolling never triggers a reload.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — hijack every scroll</div>
          <div className="body" style={{flexDirection:'column', gap:6, color:'var(--fg-faint)'}}>
            <Icons.refresh size={18} style={{transform:'rotate(40deg)'}}/>
            <span style={{fontSize:'var(--text-xs)', fontFamily:'var(--font-mono)', fontVariantNumeric:'tabular-nums', letterSpacing:'0.02em'}}>pulling… mid-list</span>
          </div>
          <div className="note">Firing the gesture from anywhere fights normal scrolling and reloads by accident. Gate on scrollTop 0.</div>
        </div>
      </div>

      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock label="pull to refresh" lang="tsx" code={`const [pull, setPull] = useState(0);
// arm only at scrollTop 0; on release, if pull >= THRESHOLD → refresh()
// states: pull → ready → refreshing → settled ('Updated · N items')
<div onPointerMove={onMove} onPointerUp={onRelease}>
  <Indicator state={state} role="status" aria-live="polite" />
  <ul style={{ transform: \`translateY(\${pull}px)\` }}>…</ul>
</div>
// also expose a visible Refresh action as a non-gesture fallback`} />
    </Section>
  );
}
