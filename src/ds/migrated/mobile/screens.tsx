'use client';
// Eidos Mobile — Example screens. Full handset screens with the generous mobile typography
// of a real app: a task Board and an Activity feed, on the --bg canvas with lifted cards.
//
// Reuse policy (compose, never reinvent): the OS strip is the shared, platform-aware
// <StatusBar/> from @eidos/ui (tabular clock + pixel-aligned signal/wifi/battery glyphs that
// adapt iOS↔Android per device), not a hand-rolled local copy. Avatars / pills / surfaces
// are core atoms. Raw px inside the device screens is intentional — real mobile type rides
// larger than the docs scale so the canvas reads at arm's length.
import { Section, SubHead, Frame, Lede, Mono, DeviceFrame, StatusBar, platformOf, Icons } from '@/ds/core';

const round = { width: 38, height: 38, borderRadius: 999, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--elev-1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-muted)', flex: '0 0 auto', cursor: 'pointer' } as const;
const avatar = (initials: string, tone: string) => (
  <span style={{ width: 38, height: 38, borderRadius: 999, background: tone, color: 'var(--bg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flex: '0 0 auto' }}>{initials}</span>
);
const card = { padding: 18, borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--elev-1)' } as const;
// Date / time strings are numeric metrics → always tabular-nums so columns of digits align.
const numeric = { fontVariantNumeric: 'tabular-nums' } as const;

function BoardScreen({ device = 'iphone-15-pro' }: { device?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <StatusBar platform={platformOf(device)} />
      <div style={{ display: 'flex', alignItems: 'center', padding: '6px 20px 14px' }}>
        <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.03em' }}>Board</span>
        <span style={{ marginInlineStart: 'auto', display: 'inline-flex', gap: 10 }}>
          <button type="button" style={round} aria-label="Filter board"><Icons.filter size={17} /></button>
          <button type="button" style={round} aria-label="More options"><Icons.more size={17} /></button>
        </span>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 2px 12px' }}>
          <Icons.star size={18} color="var(--warning)" />
          <span style={{ fontSize: 19, fontWeight: 600 }}>New</span>
        </div>
        <div className="surface" style={card}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
            <div>
              <div style={{ fontSize: 21, fontWeight: 700, letterSpacing: '-0.02em', ...numeric }}>21 Apr · 10:15</div>
              <div style={{ fontSize: 14, color: 'var(--fg-subtle)', marginTop: 2 }}>identity-svc · prod</div>
            </div>
            <span className="pill danger" style={{ fontSize: 13, fontWeight: 600 }}>Urgent</span>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.5, color: 'var(--fg)', marginTop: 12 }}>p95 latency broke the 200ms SLO; the error budget is burning. On-call paged to investigate the gateway.</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            {[['barChart', 'var(--ember-soft)', 'var(--ember-text)'], ['activity', 'var(--accent-2-soft)', 'var(--accent-2)'], ['server', 'var(--surface-active)', 'var(--fg-muted)']].map(([ic, bg, fg], i) => {
              const I = (Icons as Record<string, any>)[ic as string];
              return <span key={i} style={{ width: 54, height: 54, borderRadius: 'var(--radius-lg)', background: bg as string, color: fg as string, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><I size={22} /></span>;
            })}
            <span style={{ width: 54, height: 54, borderRadius: 'var(--radius-lg)', background: 'var(--surface-active)', color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600, ...numeric }}>+2</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: 15, color: 'var(--fg-muted)' }}>Assign to</span>
            <span style={{ display: 'inline-flex', marginInlineStart: 'auto' }}>
              {[['MT', 'var(--ember)'], ['SS', 'var(--accent-2)'], ['DC', 'var(--accent-3)']].map(([in_, tone], i) => (
                <span key={i} style={{ marginInlineStart: i ? -10 : 0, border: '2px solid var(--surface)', borderRadius: 999 }}>{avatar(in_ as string, tone as string)}</span>
              ))}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '20px 2px 12px' }}>
          <Icons.check size={18} color="var(--success)" />
          <span style={{ fontSize: 19, fontWeight: 600 }}>Completed</span>
        </div>
        <div className="surface" style={card}>
          <div style={{ fontSize: 21, fontWeight: 700, letterSpacing: '-0.02em', ...numeric }}>20 Apr · 16:40</div>
          <div style={{ fontSize: 14, color: 'var(--fg-subtle)', marginTop: 2 }}>pix-router · canary</div>
        </div>
      </div>
    </div>
  );
}

function ActivityScreen({ device = 'pixel-8' }: { device?: string }) {
  const entry = (initials: string, tone: string, name: string, status: string, statusTone: string, body: string, when: string, icon: string) => {
    const I = (Icons as Record<string, any>)[icon] || Icons.server;
    return (
      <div style={{ display: 'flex', gap: 14, padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {avatar(initials, tone)}
            <span style={{ fontSize: 15, lineHeight: 1.35 }}><b style={{ fontWeight: 700 }}>{name}</b> → <span className={'pill ' + statusTone} style={{ fontSize: 12 }}>{status}</span></span>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.5, color: 'var(--fg-muted)', marginTop: 10 }}>{body}</p>
          <div style={{ fontSize: 13, color: 'var(--fg-faint)', fontFamily: 'var(--font-mono)', marginTop: 8, ...numeric }}>{when}</div>
        </div>
        <span style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)', background: 'var(--surface)', color: 'var(--fg-faint)', boxShadow: 'var(--elev-1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><I size={22} /></span>
      </div>
    );
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <StatusBar platform={platformOf(device)} />
      <div style={{ display: 'flex', alignItems: 'center', padding: '6px 20px 14px' }}>
        <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.03em' }}>Activity</span>
        <span style={{ marginInlineStart: 'auto', display: 'inline-flex', gap: 10 }}>
          <button type="button" style={round} aria-label="Notifications"><Icons.bell size={17} /></button>
          <button type="button" style={round} aria-label="More options"><Icons.more size={17} /></button>
        </span>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 16px' }}>
        <div style={{ fontSize: 19, fontWeight: 600, padding: '6px 0 2px' }}>Today</div>
        {entry('MT', 'var(--ember)', 'Marcus Thorne', 'Completed', 'success', 'Rolled back deploy #9384 — identity-svc is healthy again and p95 is back under target.', 'Today · 14:20', 'rocket')}
        {entry('SS', 'var(--accent-2)', 'Sophia Sterling', 'In Progress', 'warning', 'On the gateway: tuning the connection pool to bring p95 down. Budget freeze in place.', 'Today · 11:45', 'server')}
        <div style={{ fontSize: 19, fontWeight: 600, padding: '14px 0 2px' }}>Yesterday</div>
        {entry('DC', 'var(--accent-3)', 'David Chen', 'New', 'ice', 'Opened P2 — intermittent 5xx from the pix-router queue under burst load.', 'Yesterday · 16:30', 'pipeline')}
      </div>
    </div>
  );
}

export default function MobileScreens() {
  return (
    <Section
      id="screens"
      num="01"
      title="Example screens"
      desc="Full handset screens with the generous type of a real app — a task Board and an Activity feed, assembled from core surfaces, pills, and avatars on the --bg canvas. Switch the device in each frame's header."
    >
      <SubHead meta="board · activity">Assembled screens</SubHead>
      <Lede>Two real screens, zero new primitives — each is the shared platform-aware <Mono>StatusBar</Mono> over core surfaces, pills, and overlapping avatars. The type ramps up for the thumb (30px titles, 19px section heads, 15px body) so the canvas reads at arm's length. Pick a device to watch the OS strip switch iOS↔Android.</Lede>
      <Frame label="lifted cards · big mobile type · pick a device" center code={`<DeviceFrame initial="iphone-15-pro">
  <StatusBar platform={platformOf(device)} />
  {/* Board — title row + grouped surface cards */}
</DeviceFrame>
<DeviceFrame initial="pixel-8">
  <StatusBar platform="android" />
  {/* Activity — avatar + status-pill feed entries */}
</DeviceFrame>`} lang="tsx">
        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
          <DeviceFrame><BoardScreen device="iphone-15-pro" /></DeviceFrame>
          <DeviceFrame initial="pixel-8"><ActivityScreen device="pixel-8" /></DeviceFrame>
        </div>
      </Frame>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">screen regions</span></div>
        <div className="ds-frame-body" style={{ padding: '56px 36px 48px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 260 }} aria-hidden="true">
              <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden', background: 'var(--bg)' }}>
                <StatusBar platform="ios" />
                <div style={{ display: 'flex', alignItems: 'center', padding: '4px 16px 12px' }}>
                  <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.03em' }}>Board</span>
                  <span style={{ marginInlineStart: 'auto', width: 28, height: 28, borderRadius: 999, background: 'var(--surface)', border: '1px solid var(--border)' }} />
                </div>
                <div style={{ padding: '0 14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 0 8px' }}><Icons.star size={13} color="var(--warning)" /><span style={{ fontSize: 13, fontWeight: 600 }}>New</span></div>
                  <div className="surface" style={{ padding: 12, boxShadow: 'var(--elev-1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 15, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>21 Apr · 10:15</span>
                      <span className="pill danger" style={{ fontSize: 11 }}>Urgent</span>
                    </div>
                    <span style={{ display: 'inline-flex', marginTop: 10 }}>
                      {['var(--ember)', 'var(--accent-2)', 'var(--accent-3)'].map((t, i) => (
                        <span key={i} style={{ width: 22, height: 22, borderRadius: 999, background: t, marginInlineStart: i ? -7 : 0, border: '2px solid var(--surface)' }} />
                      ))}
                    </span>
                  </div>
                </div>
              </div>
              <span className="lead h" style={{ top: 14, right: -28, width: 24 }} />
              <span className="lead h" style={{ top: 60, right: -28, width: 24 }} />
              <span className="lead h" style={{ top: 106, left: -28, width: 24 }} />
              <span className="lead h" style={{ top: 136, right: -28, width: 24 }} />
              <span className="lead h" style={{ bottom: 30, right: -28, width: 24 }} />
              <div className="pin" style={{ top: 5, right: -52 }}>1</div>
              <div className="pin" style={{ top: 51, right: -52 }}>2</div>
              <div className="pin" style={{ top: 97, left: -52 }}>3</div>
              <div className="pin" style={{ top: 127, right: -52 }}>4</div>
              <div className="pin" style={{ bottom: 21, right: -52 }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '48px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>OS status strip.</b> The shared <Mono>StatusBar</Mono> — a tabular clock plus signal / wifi / battery glyphs that adapt iOS↔Android per device.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Title row.</b> A 30px screen title; trailing round icon buttons pushed to the inline-end edge with <Mono>marginInlineStart: auto</Mono>.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Section head.</b> A 19px group label with a status icon (star / check) splitting the scroll into New ↔ Completed.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Content card.</b> A lifted <Mono>.surface</Mono> on <Mono>--elev-1</Mono> — a tabular date headline, body copy, and the severity pill.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Overlapping avatars.</b> Assignees stack with a negative <Mono>marginInlineStart</Mono> and a 2px surface ring; dark ink on the tone fill.</span>
          </div>
        </div>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Header controls &amp; touch targets</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Filter / notifications / more are real <Mono>{'<button>'}</Mono>s with an <Mono>aria-label</Mono> — they take the canonical focus-visible ring and a 38px round hit area. Card tap targets are the whole surface, far past 44pt.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Status is never colour-only</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Every severity carries a word — the <Mono>Urgent</Mono> / <Mono>Completed</Mono> / <Mono>In&nbsp;Progress</Mono> pill text restates what the danger / success / warning tone signals, so VoiceOver and a colour-blind reader land on the same meaning.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Keyboard / switch map</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Tap is the touch interaction; paired with an attached keyboard or switch control the header buttons and feed are fully reachable.</div>
          <dl style={{ margin: '10px 0 0', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 10px', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>
            <dt><Mono>Tab</Mono></dt><dd style={{ margin: 0 }}>move through header controls → feed</dd>
            <dt><Mono>Enter / Space</Mono></dt><dd style={{ margin: 0 }}>activate the focused control</dd>
          </dl>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Contrast &amp; reduced motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Avatar initials are dark ink (<Mono>--bg</Mono>) on the tone fill, and the ember icon tile uses <Mono>--ember-text</Mono> on <Mono>--ember-soft</Mono> — both clear AA. The device frame and card lifts are static; nothing animates against <Mono>prefers-reduced-motion</Mono>.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — titles & status strip mirror; header buttons move to the inline-start edge'} center code={`<div dir="rtl">
  <DeviceFrame><BoardScreen /></DeviceFrame>
</div>
{/* paddingInline + marginInlineStart flip automatically */}`} lang="tsx">
        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
          <div dir="rtl"><DeviceFrame><BoardScreen device="iphone-15-pro" /></DeviceFrame></div>
        </div>
      </Frame>
      <Lede>Because every offset is logical — <Mono>paddingInline</Mono>, <Mono>marginInlineStart: auto</Mono>, <Mono>borderInline</Mono> — the whole screen reflows under <Mono>dir="rtl"</Mono> with no overrides: titles right-align, the header buttons swing to the inline-start edge, and the overlapping avatars stack from the right. The status-strip clock and date stay tabular numerals.</Lede>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — let the type ramp up for the thumb</div>
          <div className="body">
            <div className="surface" style={{ padding: 14, width: '100%' }}>
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>21 Apr · 10:15</div>
              <div style={{ fontSize: 13, color: 'var(--fg-subtle)', marginTop: 2 }}>identity-svc · prod</div>
            </div>
          </div>
          <div className="note">Mobile reads at arm's length — 30px titles, 19px heads, 15px body. One clear headline per card.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — shrink desktop density onto a phone</div>
          <div className="body">
            <div className="surface" style={{ padding: 10, width: '100%' }}>
              <div style={{ fontSize: 11, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>21 Apr · 10:15</div>
              <div style={{ fontSize: 11, color: 'var(--fg-subtle)' }}>identity-svc · prod · canary · p95 274ms · budget</div>
            </div>
          </div>
          <div className="note">11px text in a cramped row forces a squint and a pinch-zoom. Don't port a table cell straight onto the handset.</div>
        </div>
      </div>

      <p className="ds-caption">
        Both screens are pure Eidos — the canvas is <Mono>--bg</Mono>, cards lift on
        {' '}<Mono>--surface</Mono> with <Mono>--elev-1</Mono>, and the type ramps up for the thumb
        (30px titles, 19px section heads, 15px body).
      </p>
    </Section>
  );
}
