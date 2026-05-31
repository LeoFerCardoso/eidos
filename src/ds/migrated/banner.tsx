'use client';
// Eidos DS — Components / Banner
// Full-width attention bar. Lives at the top of a page (or inside a card)
// to surface a system-wide event — maintenance window, version upgrade,
// open incident, freeze, custom announcement. Replaces the old `AlertBar`.
import * as React from 'react';
import { AutoPropsTable, Icons, Frame, Section, SubHead, TabbedCode, installTabs, Banner, Empty, Lede, Mono } from '@/ds/core';


  const USAGE = `import { Banner } from "@/components/forge/banner"

export function Demo() {
  return (
    <Banner
      tone="warning"
      title="Deploy freeze in effect"
      message="Non-critical merges paused until Friday — mobile release cut at 18:00 UTC."
      action="View policy"
      onAction={() => …}
    />
  )
}`;

const DISMISS_CODE = `const [open, setOpen] = React.useState(true)

return open ? (
  <Banner
    tone="success"
    title="Service onboarded"
    message="eidos-api is now indexed in the Service Catalog."
    onDismiss={() => setOpen(false)}
  />
) : (
  // host decides the fallback — here, an empty state
  <Empty iconName="check" title="Banner dismissed" />
)`;

export default function BannerPage() {
  // Live demos — the dismiss control actually performs its interaction.
  const [open, setOpen] = React.useState(true);
  // Escalation demo — flips a polite status banner into an interrupting
  // role="alert" incident, the one transition Banner exists to make.
  const [escalated, setEscalated] = React.useState(false);
  return (
    <Section id="banner" title="Banner" desc="Full-width attention bar for system-wide events. Used at the top of a page (or inside a card) for maintenance windows, version upgrades, open incidents, announcements. Replaces the legacy Alert bar.">
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('banner')} ariaLabel="package manager"/>
      <Lede>Five built-in tones cover the common cases. Pass <Mono>tone="custom"</Mono> with your own <Mono>bg</Mono>, <Mono>fg</Mono>, and <Mono>accent</Mono> for branded announcements (a launch, a campaign, a sponsor).</Lede>

      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="default — info tone" code={USAGE}>
        <Banner tone="info" title="New: Ring Deployments" message="Roll out by cohort with one click. Read the guide to wire up your service." action="Open guide"/>
      </Frame>
      <Lede>Title is bold, message is muted. The CTA is a ghost button — Banners don't compete with content for primary actions.</Lede>

      <div className="ds-examples-rule" style={{ marginBlockStart: 36, marginBlockEnd: 6 }}>
        <span className="t-mono-label">Examples</span>
        <span className="divider" style={{ flex: 1 }}/>
      </div>

      <SubHead meta="5 tones">All tones</SubHead>
      <Frame label="info · success · warning · danger · neutral">
        <div style={{display:'flex', flexDirection:'column', gap: 12}}>
          <Banner tone="info"    title="Heads up"      message="Eidos CLI 4.2 is available — see what's new."/>
          <Banner tone="success" title="Promoted"      message="eidos-api v2.1.7 promoted to production. Rollback available for 24h."/>
          <Banner tone="warning" title="Freeze"        message="Non-critical merges paused until Fri 18:00 UTC."/>
          <Banner tone="danger"  title="Active incident" message="INC-4137 — fraud-engine latency p99 spiking. Status: investigating." action="Open incident"/>
          <Banner tone="neutral" title="Heads up"      message="Internal change — onboarding flow moved under /onboarding."/>
        </div>
      </Frame>
      <Lede>Tone is doubled by the leading icon and the title — never colour alone. <Mono>danger</Mono> is the only tone that interrupts (it escalates to <Mono>role="alert"</Mono>); the other four announce politely.</Lede>

      <SubHead meta="states">States</SubHead>
      <Frame label="message-only · with CTA · live dismiss → empty · escalation" code={DISMISS_CODE}>
        <div style={{display:'flex', flexDirection:'column', gap: 16}}>
          <div>
            <div className="t-mono-label" style={{ marginBlockEnd: 8 }}>Message-only (no title)</div>
            <Banner tone="neutral" message="The message runs at full weight when no title is set — use it for a single, self-evident line."/>
          </div>
          <div>
            <div className="t-mono-label" style={{ marginBlockEnd: 8 }}>With a single secondary CTA</div>
            <Banner tone="info" title="New: Ring Deployments" message="Roll out by cohort with one click." action="Open guide"/>
          </div>
          <div>
            <div className="t-mono-label" style={{ marginBlockEnd: 8 }}>Dismissible — try it</div>
            <div style={{ minBlockSize: 44 }}>
              {open ? (
                <Banner tone="success" title="Service onboarded" message="eidos-api is now indexed in the Service Catalog." onDismiss={() => setOpen(false)}/>
              ) : (
                <Empty size="sm" iconName="check" title="Banner dismissed" desc="Nothing left to announce on this surface." secondary={
                  <button type="button" className="btn ghost xs" onClick={() => setOpen(true)}>Restore banner</button>
                }/>
              )}
            </div>
          </div>
          <div>
            <div className="t-mono-label" style={{ marginBlockEnd: 8 }}>Polite → assertive — escalate, then stand down</div>
            <Banner
              key={escalated ? 'alert' : 'status'}
              tone={escalated ? 'danger' : 'neutral'}
              title={escalated ? 'Active incident — INC-4137' : 'Watching · fraud-engine'}
              message={escalated
                ? 'p99 latency past SLO for 4 min. This banner now interrupts the screen reader.'
                : 'Latency within budget. This banner is announced politely, never interrupting.'}
              action={escalated ? 'Open incident' : undefined}
              actions={
                <button type="button" className={'btn sm ' + (escalated ? 'ghost' : 'ember')} onClick={() => setEscalated(v => !v)}>
                  {escalated ? 'Stand down' : 'Escalate'}
                </button>
              }
            />
          </div>
        </div>
      </Frame>
      <Lede>Press <Mono>✕</Mono> on the success banner — it removes the node and the surface falls back to its empty state, the same flow your page sees. <b style={{ color: 'var(--fg)' }}>Escalate</b> flips the watch banner to <Mono>tone="danger"</Mono>, which is the moment a <Mono>role="status"</Mono> region becomes a <Mono>role="alert"</Mono> one and starts interrupting. A Banner only ever renders text the host already resolved, so it has no loading or invalid state to fetch or validate.</Lede>

      <SubHead meta="emphasis">Custom background (branded)</SubHead>
      <Frame label="brand campaign · accent border-inline-start" code={`<Banner
  tone="custom"
  bg="linear-gradient(135deg, #ff6b35 0%, #ff8e53 100%)"
  fg="#fff"
  accent="#fff"
  icon="rocket"
  title="Eidos 5.0 — public beta"
  message="Self-serve onboarding · workflow templates · MCP agent catalog."
  action="Read the changelog"
/>`}>
        <div style={{display:'flex', flexDirection:'column', gap: 12}}>
          <Banner tone="custom"
                  bg="linear-gradient(135deg, oklch(58% 0.16 35) 0%, oklch(65% 0.16 50) 100%)"
                  fg="#fff" accent="#fff" icon="rocket"
                  title="Eidos 5.0 — public beta"
                  message="Self-serve onboarding · workflow templates · MCP agent catalog."
                  action="Read the changelog"/>
          <Banner tone="custom"
                  bg="oklch(20% 0.04 270)" fg="#e7e6f0" accent="oklch(70% 0.18 290)"
                  icon="bot"
                  title="AI Insights are now generally available"
                  message="Daily summaries of architectural drift, risk, and cost across your fleet."
                  action="Open AI Insights"/>
        </div>
      </Frame>
      <Lede>Custom tone removes the bordered chrome and shifts to a filled surface. Use it sparingly — one branded banner per page max. Three competing brand tones turns the design into noise.</Lede>

      <SubHead meta="layout">Position</SubHead>
      <Frame label="top of page · inside a card">
        <div style={{display:'flex', flexDirection:'column', gap: 16}}>
          <div>
            <div className="t-mono-label" style={{ marginBlockEnd: 8 }}>Top of page</div>
            <Banner tone="info" title="Welcome to Eidos" message="Take the 5-minute tour to wire your first service to the IDP." action="Start tour"/>
          </div>
          <div>
            <div className="t-mono-label" style={{ marginBlockEnd: 8 }}>Inside a card</div>
            <div style={{ padding: 16, background:'var(--surface)', border:'1px solid var(--border)', borderRadius: 'var(--radius-xl)' }}>
              <div className="t-body" style={{ fontWeight: 600, color: 'var(--fg)', marginBlockEnd: 12 }}>Service health · eidos-api</div>
              <Banner tone="warning" message="3 of 5 SLO budgets at risk this window."/>
            </div>
          </div>
        </div>
      </Frame>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginBlockStart: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div className="t-body" style={{fontWeight: 600, color: 'var(--fg)', marginBlockEnd: 10}}>Keyboard</div>
          <div role="list">
            <div className="kbd-row" role="listitem"><span className="label">Move into the CTA, then the dismiss <Mono>✕</Mono></span><span className="kbd-chord trailing"><span className="kbd">Tab</span></span></div>
            <div className="kbd-row" role="listitem"><span className="label">Move back to the previous control</span><span className="kbd-chord trailing"><span className="kbd">Shift</span><span className="kbd">Tab</span></span></div>
            <div className="kbd-row" role="listitem"><span className="label">Activate the focused control</span><span className="kbd-chord trailing"><span className="kbd">Enter</span><span className="kbd">Space</span></span></div>
          </div>
          <div className="t-small" style={{color: 'var(--fg-muted)', marginBlockStart: 10}}>The title and message are read in place and are not focusable. Dismissing removes the node; focus returns to the next element in the flow.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div className="t-body" style={{fontWeight: 600, color: 'var(--fg)', marginBlockEnd: 10}}>Screen reader · roles present</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>The four informational tones render <Mono>role="status"</Mono> with <Mono>aria-live="polite"</Mono>, so the text is queued without interrupting. <Mono>tone="danger"</Mono> escalates to <Mono>role="alert"</Mono> with <Mono>aria-live="assertive"</Mono> so it interrupts the current utterance — reserve it for events that demand a decision. The tone icon is <Mono>aria-hidden</Mono> (severity is carried by the title), and the dismiss control carries <Mono>aria-label="Dismiss"</Mono>.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div className="t-body" style={{fontWeight: 600, color: 'var(--fg)', marginBlockEnd: 10}}>Focus &amp; contrast</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>The CTA shows the ember focus-visible ring (<Mono>--ember-soft</Mono>); the dismiss <Mono>✕</Mono> inherits it too. Every built-in tone pairs <Mono>--fg</Mono> ink (4.5:1+) on its soft surface. For <Mono>tone="custom"</Mono> you own the pairing: pass an <Mono>fg</Mono> that clears AA on your <Mono>bg</Mono> — the ember campaign banner uses dark-clearing white ink on the warm fill.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div className="t-body" style={{fontWeight: 600, color: 'var(--fg)', marginBlockEnd: 10}}>Reduced motion</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>Banners render statically — no slide-in, no auto-dismiss timer. The dismiss removes the node instantly rather than animating out, so there is nothing to suppress under <Mono>prefers-reduced-motion: reduce</Mono>; the only transition is the ≤120ms hover tint on the close button.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label={'dir="rtl" — leading icon flips to the right, action/close to the left'}
        code={`<div dir="rtl">
  <Banner tone="info" title="مرحبًا بك في Eidos"
    message="ابدأ الجولة لربط خدمتك الأولى." action="ابدأ الجولة" />
</div>`}
        lang="tsx"
      >
        <div dir="rtl">
          <Banner tone="info" title="مرحبًا بك في Eidos" message="ابدأ الجولة لربط خدمتك الأولى بمنصة المطوّرين الداخلية." action="ابدأ الجولة"/>
        </div>
      </Frame>
      <Lede>
        Banner is a logical flex row, so it mirrors cleanly: the leading tone icon moves to the start (now the right), the trailing CTA and the dismiss <Mono>✕</Mono> move to the end (left), and the title/message right-align. The custom-tone accent rule sits on <Mono>border-inline-start</Mono>, so it tracks the start edge automatically. The tone glyph is non-directional and is <em>not</em> mirrored — only the inline order and <Mono>inset-inline</Mono> spacing follow <Mono>dir="rtl"</Mono>; no <Mono>scaleX(-1)</Mono> is applied.
      </Lede>

      {/* ====================================================================
          ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 48px 64px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: '100%', maxWidth: 560 }} aria-hidden="true">
              <Banner tone="warning" title="Deploy freeze in effect" message="Non-critical merges paused until Fri 18:00 UTC." action="View policy" onDismiss={() => {}} />
              {/* pin 1 — tone icon */}
              <span className="lead v" style={{ top: -28, left: 18, height: 22 }} />
              <div className="pin" style={{ top: -50, left: 18, transform: 'translateX(-50%)' }}>1</div>
              {/* pin 2 — title */}
              <span className="lead v" style={{ top: -28, left: '28%', height: 22 }} />
              <div className="pin" style={{ top: -50, left: '28%', transform: 'translateX(-50%)' }}>2</div>
              {/* pin 3 — message */}
              <span className="lead v" style={{ bottom: -28, left: '40%', height: 22 }} />
              <div className="pin" style={{ bottom: -50, left: '40%', transform: 'translateX(-50%)' }}>3</div>
              {/* pin 4 — action slot */}
              <span className="lead v" style={{ bottom: -28, right: 48, height: 22 }} />
              <div className="pin" style={{ bottom: -50, right: 48, transform: 'translateX(50%)' }}>4</div>
              {/* pin 5 — dismiss */}
              <span className="lead h" style={{ top: '50%', right: -30, width: 24 }} />
              <div className="pin" style={{ top: '50%', right: -54, transform: 'translateY(-50%)' }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '60px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Tone icon.</b> Decorative glyph that reinforces severity — <Mono>aria-hidden</Mono>. Matches the tone: info=info, warning=alertTriangle, danger=incident. Overridable via <Mono>icon</Mono> prop.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Title.</b> Bold, <Mono>--text-sm</Mono>. One short phrase naming the event. Omit for message-only banners; the message then runs at full weight.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Message.</b> Muted body text. One sentence — enough context to decide whether to act. Links or inline emphasis are fine; full paragraphs are not.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Action slot.</b> Renders as a ghost button by default; replace with <Mono>actions</Mono> for custom controls. CTAs stay secondary — banners don't compete with page-level primaries.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Dismiss ×.</b> Present when <Mono>onDismiss</Mono> is provided. Removes the node immediately (no animation). Returns focus to the next element in flow.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — one banner per surface</div>
          <div className="body">
            <Banner tone="warning" title="Freeze" message="Non-critical merges paused until Fri 18:00 UTC." action="View policy"/>
          </div>
          <div className="note">Banners interrupt — the more you stack, the less each one weighs. One per page, max.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — fight for primary action</div>
          <div className="body">
            <Banner tone="info" title="Try Eidos AI" message="Get insights in one click."
                    actions={<><button className="btn ember sm">Open AI</button><button className="btn ember sm">Subscribe</button><button className="btn ember sm">Learn more</button></>}/>
          </div>
          <div className="note">Banners are <em>announcements</em>. Multiple primary CTAs turn them into ads.</div>
        </div>
      </div>

      <SubHead meta="BannerProps">API reference</SubHead>
      <AutoPropsTable component="Banner" label="<Banner />"/>
    </Section>
  );
}
