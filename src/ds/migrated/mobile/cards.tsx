'use client';
// Eidos Mobile — Cards / feed. A vertical scroll of content cards: KPI, service, incident.
//
// Reuse policy (compose, never reinvent): the KPI card IS the core MetricCard recipe, so it
// composes <MetricCard/> directly rather than hand-rolling label+delta+value+sparkline. The
// service and incident rows are genuinely mobile-specific feed layouts (full-width, tappable,
// accent-edge) — they stay local but still compose core atoms (StatusDot, pills, tokens), never
// re-derived values.
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, MetricCard, Sparkline, StatusDot, Icons, Lede, Mono } from '@/ds/core';

function StatusBar() {
  return (
    <div style={{ height: 44, flex: '0 0 auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 18px 4px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg)' }}>
      <span>9:41</span>
      <span style={{ display: 'inline-flex', gap: 4, color: 'var(--fg-muted)' }}><Icons.activity size={12} /><Icons.battery size={13} /></span>
    </div>
  );
}

function FeedScreen() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <StatusBar />
      <div style={{ padding: '4px 16px 10px', fontSize: 'var(--text-xl)', fontWeight: 700, letterSpacing: '-0.02em' }}>Today</div>
      <div style={{ flex: 1, overflow: 'auto', padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* KPI card — composes the core MetricCard recipe, not a hand-rolled duplicate */}
        <MetricCard label="Deploys today" value={24} delta={12} series={[12, 16, 14, 20, 18, 22, 24]} sparkColor="var(--ember)" />
        {/* service card — the whole surface is the tap target (role=button → inherits the canonical focus-visible ring) */}
        <div className="surface" role="button" tabIndex={0} aria-label="identity-svc, degraded, p95 274 milliseconds" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <span style={{ width: 36, height: 36, borderRadius: 'var(--radius-lg)', background: 'var(--ember-soft)', color: 'var(--ember-text)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><Icons.server size={18} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>identity-svc</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}><StatusDot tone="warning" /> Degraded · p95 274ms</div>
          </div>
          <Icons.chevronRight size={15} color="var(--fg-faint)" />
        </div>
        {/* incident card */}
        <div className="surface" role="button" tabIndex={0} aria-label="P1 incident, elevated error rate, 12 minutes ago" style={{ padding: 14, borderInlineStart: '3px solid var(--danger)', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="pill danger">P1</span>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Elevated error rate</span>
            <span style={{ marginInlineStart: 'auto', fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>12m</span>
          </div>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.5, marginTop: 8 }}>pix-router 5xx above 2% for 8 minutes. On-call paged.</p>
        </div>
      </div>
    </div>
  );
}

export default function MobileCards() {
  return (
    <Section id="cards" num="01" title="Cards"
      desc="The mobile feed unit — stack content cards (KPIs, services, incidents) in a single scroll when items carry a mix of signals that a flat list row cannot hold.">
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>Lead with one strong signal per card and make the tap target the whole card — not just a label or chevron. Each card is a full-width surface with generous padding.</Lede>
      <Frame label="KPI · service · incident · pick a device" center>
        <DeviceFrame><FeedScreen /></DeviceFrame>
      </Frame>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 280 }} aria-hidden="true">
              <div className="surface" style={{ padding: 14, borderInlineStart: '3px solid var(--danger)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <span className="t-mono-label">Deploys today</span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--success)', fontWeight: 600, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>▴ 12%</span>
                </div>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>24</div>
                <div style={{ marginTop: 8 }}><Sparkline data={[12, 16, 14, 20, 18, 22, 24]} w={230} h={30} color="var(--ember)" /></div>
              </div>
              <span className="lead h" style={{ top: 22, right: -28, width: 24 }} />
              <span className="lead v" style={{ top: -22, left: 60, height: 18 }} />
              <span className="lead h" style={{ top: 56, right: -28, width: 24 }} />
              <span className="lead h" style={{ bottom: 24, right: -28, width: 24 }} />
              <span className="lead h" style={{ top: 22, left: -28, width: 24 }} />
              <div className="pin" style={{ top: 13, right: -52 }}>1</div>
              <div className="pin" style={{ top: -42, left: 60, transform: 'translateX(-50%)' }}>2</div>
              <div className="pin" style={{ top: 47, right: -52 }}>3</div>
              <div className="pin" style={{ bottom: 15, right: -52 }}>4</div>
              <div className="pin" style={{ top: 13, left: -52 }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Card surface.</b> Full-width rounded surface, 14px padding, the whole thing tappable.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Eyebrow / icon.</b> A mono caption (Deploys today) or a tinted icon tile that names the card{"'"}s subject.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Primary signal.</b> The one thing that matters — a big number, a service name, an incident title.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Secondary detail.</b> Sparkline, status line, or a short snippet supporting the signal.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Accent edge.</b> A 3px inline-start border (danger on incidents) flags severity without recolouring the card.</span>
          </div>
        </div>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Touch targets</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The entire card is the target — far past 44px — with a 12px gap to the next card so a thumb never lands between two. Padding scales from the 4-pt base.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>VoiceOver / TalkBack</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>A tappable card is one <code style={{fontFamily:'var(--font-mono)'}}>role="button"</code> (or <code style={{fontFamily:'var(--font-mono)'}}>&lt;a&gt;</code>) reading its contents as a single label — "identity-svc, Degraded, p95 274ms" — not three separate stops. Status dots carry a text twin so colour isn't the only cue.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 8}}>Keyboard &amp; gesture fallback</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Tap is the touch interaction, but each card is a real <code style={{fontFamily:'var(--font-mono)'}}>role="button"</code> — paired with an attached keyboard or switch control it takes the canonical focus ring and responds to keys.</div>
          <dl style={{margin: '10px 0 0', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 10px', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)'}}>
            <dt><Mono>Tab</Mono></dt><dd style={{margin: 0}}>move focus card → card</dd>
            <dt><Mono>Enter / Space</Mono></dt><dd style={{margin: 0}}>open the card</dd>
          </dl>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55, marginTop: 8}}>Nothing hides behind a swipe — extra actions live in a sheet the card opens.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Sparkline draw-in and press states honour <code style={{fontFamily:'var(--font-mono)'}}>prefers-reduced-motion</code>. The number, status text, and snippet all keep AA contrast on the card surface; the danger edge supplements, never replaces, the text.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — content right-aligns; the service card chevron flips side and mirrors'} center code={`<Icons.chevronRight style={{ transform: 'scaleX(-1)' }} /> {/* trailing → left edge, points back */}`} lang="tsx">
        <div dir="rtl"><DeviceFrame><FeedScreen /></DeviceFrame></div>
      </Frame>
      <Lede>Under <Mono>dir="rtl"</Mono> card content right-aligns and the leading media/icon tile moves to the right, while the service card's trailing chevron flips to the left and mirrors with <Mono>scaleX(-1)</Mono>. The incident card's accent edge follows <Mono>border-inline-start</Mono> to the right; the symmetric KPI card and its sparkline are otherwise unchanged.</Lede>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — one signal per card</div>
          <div className="body">
            <div style={{ width: '100%' }}>
              <MetricCard label="Deploys today" value={24} delta={12} series={[12, 16, 14, 20, 18, 22, 24]} sparkColor="var(--ember)" />
            </div>
          </div>
          <div className="note">Lead with the number that matters and let the sparkline support it. The whole card opens detail.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — cram four metrics in</div>
          <div className="body">
            <div className="surface" style={{padding:12, width:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, fontSize: 'var(--text-base)', color:'var(--fg-muted)', fontVariantNumeric: 'tabular-nums'}}>
              <div><b style={{color:'var(--fg)'}}>24</b> deploys</div><div><b style={{color:'var(--fg)'}}>3</b> incidents</div>
              <div><b style={{color:'var(--fg)'}}>274ms</b> p95</div><div><b style={{color:'var(--fg)'}}>38%</b> SLO</div>
            </div>
          </div>
          <div className="note">Four equal metrics make none of them the signal. Split them into separate cards or a dashboard.</div>
        </div>
      </div>

      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock label="content card" lang="tsx" code={`<article className="m-card" role="button" tabIndex={0} onClick={open}>
  <header>
    <span className="m-card-icon"><Icons.server /></span>
    <div><h3>identity-svc</h3><StatusDot tone="warning" /> Degraded</div>
    <Icons.chevronRight />
  </header>
</article>
// incident: add border-inline-start: 3px solid var(--danger)`} />
    </Section>
  );
}
