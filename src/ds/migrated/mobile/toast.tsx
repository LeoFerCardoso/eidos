'use client';
// Forge Mobile — Toast / snackbar (scaffold). A transient message that rises above the
// bottom edge (over the tab bar / home indicator) with an optional single action.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono } from '@/ds/core';

const TOAST_MS = 3200;
type Toast = { msg: string; tone: 'neutral' | 'success' | 'danger' };

function ToastScreen() {
  const [toast, setToast] = React.useState<Toast | null>({ msg: 'Deploy rolled back', tone: 'success' });
  const [shown, setShown] = React.useState(false);     // drives the rise-and-settle transition
  const [fill, setFill] = React.useState(0);           // 0→100% timer-bar width
  const [paused, setPaused] = React.useState(false);   // focus / hover holds the timer
  const reduce = React.useRef(false);
  const deadline = React.useRef(0);                    // ms timestamp the toast self-clears at
  const remaining = React.useRef(TOAST_MS);            // ms left when paused
  const tick = React.useRef<number>(0);

  React.useEffect(() => {
    reduce.current = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  }, []);

  // run the countdown + timer-fill whenever a toast is live and not paused
  React.useEffect(() => {
    if (!toast) return;
    if (paused) { window.clearInterval(tick.current); return; }
    deadline.current = Date.now() + remaining.current;
    const step = () => {
      const left = deadline.current - Date.now();
      remaining.current = Math.max(0, left);
      setFill(Math.min(100, (1 - left / TOAST_MS) * 100));
      if (left <= 0) { window.clearInterval(tick.current); dismiss(); }
    };
    tick.current = window.setInterval(step, 50);
    return () => window.clearInterval(tick.current);
  }, [toast, paused]);

  const dismiss = () => {
    setShown(false);
    window.setTimeout(() => setToast(null), reduce.current ? 0 : 200);
  };
  const fire = (msg: string, tone: Toast['tone']) => {
    window.clearInterval(tick.current);
    remaining.current = TOAST_MS;
    setFill(0);
    setToast({ msg, tone });
    setShown(false);
    // next frame: flip `shown` so the bar transitions up from below
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => setShown(true)));
  };

  // danger demands attention now → assertive alert; the rest announce politely
  const assertive = toast?.tone === 'danger';
  const dotColor = toast?.tone === 'success' ? 'var(--success)' : toast?.tone === 'danger' ? 'var(--danger)' : 'var(--fg-muted)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ height: 50, flex: '0 0 auto' }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <button className="btn" onClick={() => fire('Saved to library', 'neutral')}>Show toast</button>
        <button className="btn ember" onClick={() => fire('Deploy rolled back', 'success')}>Show success</button>
        <button className="btn" onClick={() => fire('Couldn’t reach the API', 'danger')}>Show error</button>
      </div>
      {toast && (
        <div
          role={assertive ? 'alert' : 'status'}
          aria-live={assertive ? 'assertive' : 'polite'}
          aria-atomic="true"
          tabIndex={0}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          style={{ position: 'absolute', insetInline: 14, bottom: 24, display: 'flex', flexDirection: 'column', gap: 8,
            padding: '12px 14px', borderRadius: 'var(--radius-xl)', background: 'var(--bg-elevated)',
            border: '1px solid var(--border-strong)', boxShadow: 'var(--shadow-4)', overflow: 'hidden',
            opacity: shown ? 1 : 0,
            transform: shown ? 'translateY(0)' : 'translateY(8px)',
            transition: reduce.current ? 'none' : 'opacity var(--dur) var(--ease), transform var(--dur) var(--ease)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, flex: '0 0 auto', background: dotColor }} />
            <span style={{ flex: 1, fontSize: 'var(--text-sm)' }}>{toast.msg}</span>
            <button className="btn ghost sm" style={{ paddingInline: 8 }} onClick={dismiss}>Undo</button>
          </div>
          {/* timer-fill bar — drains toward dismiss; pauses on focus/hover; hidden under reduced-motion */}
          <span aria-hidden="true" style={{ position: 'absolute', insetInline: 0, insetBlockEnd: 0, blockSize: 2,
            inlineSize: reduce.current ? '0%' : `${fill}%`, background: dotColor, opacity: paused ? 0.5 : 0.85,
            transition: reduce.current ? 'none' : 'inline-size 60ms linear, opacity var(--dur-fast) var(--ease)' }} />
        </div>
      )}
    </div>
  );
}

export default function MobileToast() {
  return (
    <Section id="toast" num="01" title="Toast"
      desc="A transient confirmation that rises above the bottom edge and auto-dismisses. Acknowledge completed actions only — never ask a question or report something requiring action.">
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>At most one action per toast (Undo). A status dot carries tone — never colour the whole bar. Show at most one toast at a time; queue the rest.</Lede>
      <Frame label="tap a button · auto-dismisses · pick a device" center>
        <DeviceFrame><ToastScreen /></DeviceFrame>
      </Frame>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 300 }} aria-hidden="true">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 'var(--radius-xl)', background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', boxShadow: 'var(--shadow-4)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, flex: '0 0 auto', background: 'var(--success)' }} />
                <span style={{ flex: 1, fontSize: 'var(--text-sm)' }}>Deploy rolled back</span>
                <button className="btn ghost sm" tabIndex={-1} style={{ paddingInline: 8, cursor: 'default' }}>Undo</button>
              </div>
              <span className="lead h" style={{ top: 22, left: -28, width: 24 }} />
              <span className="lead v" style={{ top: -22, left: 18, height: 18 }} />
              <span className="lead v" style={{ bottom: -22, left: '42%', height: 18, transform: 'translateX(-50%)' }} />
              <span className="lead h" style={{ top: 22, right: -28, width: 24 }} />
              <span className="lead v" style={{ bottom: -22, left: '78%', height: 18, transform: 'translateX(-50%)' }} />
              <div className="pin" style={{ top: 13, left: -52 }}>1</div>
              <div className="pin" style={{ top: -42, left: 18, transform: 'translateX(-50%)' }}>2</div>
              <div className="pin" style={{ bottom: -42, left: '42%', transform: 'translateX(-50%)' }}>3</div>
              <div className="pin" style={{ top: 13, right: -52 }}>4</div>
              <div className="pin" style={{ bottom: -42, left: '78%', transform: 'translateX(-50%)' }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Bar.</b> Elevated surface inset from the screen edges, riding above the bottom safe area.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Status dot.</b> 8px dot carrying tone — success, danger, or neutral — so the bar stays neutral.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Message.</b> One line of plain confirmation text; no titles, no paragraphs.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Action.</b> At most one (Undo); a ghost button that also pauses the auto-dismiss timer.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Auto-dismiss.</b> Self-clears after ~3s; the timer extends while the toast is focused or hovered.</span>
          </div>
        </div>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Touch targets</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The Undo action clears 44×44px with padding from the 4-pt base, even though the bar is compact, so a thumb catches it before the toast fades.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>VoiceOver / TalkBack</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The bar is an <code style={{fontFamily:'var(--font-mono)'}}>aria-atomic</code> live region — <code style={{fontFamily:'var(--font-mono)'}}>role="status"</code> / <code style={{fontFamily:'var(--font-mono)'}}>aria-live="polite"</code> for neutral and success, escalating to <code style={{fontFamily:'var(--font-mono)'}}>role="alert"</code> / <code style={{fontFamily:'var(--font-mono)'}}>aria-live="assertive"</code> for errors — so the message is read on appearance without stealing focus.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Gesture has a fallback</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>No gesture is required — the toast appears and clears on its own, and Undo is a plain button. Where swipe-to-dismiss exists it's a shortcut layered on the auto-dismiss timer.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The rise-and-settle eases off under <code style={{fontFamily:'var(--font-mono)'}}>prefers-reduced-motion</code>; the timer also pauses on focus so it isn't missed. Message and Undo keep AA contrast on the elevated bar, and tone reads from the dot plus the words, not the bar colour.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — message right-aligns and the Undo action moves to the trailing edge (left)'} center code={`<div dir="rtl">{/* role=status bar */}</div>`} lang="tsx">
        <div dir="rtl"><DeviceFrame><ToastScreen /></DeviceFrame></div>
      </Frame>
      <Lede>The bar lays out with <Mono>display:flex</Mono>, so the leading status dot moves to the right, the message text right-aligns, and the trailing Undo action moves to the left (the trailing edge). The bar's edge insets use <Mono>insetInline</Mono> so they stay even, and the auto-dismiss timer bar fills from the start — right-to-left in RTL. No glyph needs <Mono>scaleX(-1)</Mono>.</Lede>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — neutral bar, dot for tone</div>
          <div className="body">
            <div style={{display:'flex', alignItems:'center', gap:10, width:'100%', padding:'10px 12px', borderRadius:'var(--radius-xl)', background:'var(--bg-elevated)', border:'1px solid var(--border-strong)'}}>
              <span style={{width:8, height:8, borderRadius:999, background:'var(--success)'}}/>
              <span style={{flex:1, fontSize:13}}>Deploy rolled back</span>
              <span style={{fontSize:13, fontWeight:600, color:'var(--fg-muted)'}}>Undo</span>
            </div>
          </div>
          <div className="note">Keep the bar neutral and let the dot carry tone. One message, one optional Undo.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — flood the bar with colour</div>
          <div className="body">
            <div style={{display:'flex', alignItems:'center', gap:10, width:'100%', padding:'10px 12px', borderRadius:'var(--radius-xl)', background:'var(--danger)', color:'var(--danger-fg)'}}>
              <span style={{flex:1, fontSize:13}}>Couldn&apos;t reach the API</span>
              <span style={{fontSize:13, fontWeight:600}}>Retry</span>
              <span style={{fontSize:13, fontWeight:600}}>Details</span>
            </div>
          </div>
          <div className="note">A full danger fill plus two actions reads as a dialog. Use a status dot and at most one action.</div>
        </div>
      </div>

      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock label="toast" lang="tsx" code={`// danger → role="alert" / aria-live="assertive"; everything else announces politely.
// The ~3.2s timer pauses on focus or hover and resumes from where it left off,
// and the rise + timer-fill are skipped under prefers-reduced-motion.
const assertive = tone === 'danger';
<div
  role={assertive ? 'alert' : 'status'}
  aria-live={assertive ? 'assertive' : 'polite'}
  aria-atomic="true"
  tabIndex={0}
  onMouseEnter={pause} onMouseLeave={resume}
  onFocus={pause} onBlur={resume}
  className="m-toast"
>
  <span className="m-toast-dot" data-tone={tone} />
  <span>{msg}</span>
  <button onClick={dismiss}>Undo</button>
  <span className="m-toast-fill" aria-hidden style={{ inlineSize: \`\${fill}%\` }} />
</div>`} />
    </Section>
  );
}
