'use client';
// Eidos Blocks — CTA banner. A full-width call-to-action band that closes a page.
import { Section, SubHead, Frame, CodeBlock, Icons, Mono, Lede, Spinner, Skeleton, Alert, AlertTitle, AlertDescription, AlertActions } from '@/ds/core';


function CtaBanner() {
  return (
    <div
      style={{
        width: '100%', position: 'relative', overflow: 'hidden',
        borderRadius: 'var(--radius-2xl)', border: '1px solid color-mix(in oklch, var(--ember) 24%, var(--border))',
        background: 'linear-gradient(135deg, var(--ember-softer), transparent 70%), var(--bg-elevated)',
        padding: '34px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap',
      }}
    >
      <div style={{ maxWidth: '52ch' }}>
        <div className="ds-h-eyebrow" style={{ color: 'var(--ember)', marginBottom: 8 }}>Ready when you are</div>
        <h2 style={{ margin: 0, fontSize: 'var(--text-2xl)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.15 }}>Ship your first Eidos service today.</h2>
        <p style={{ color: 'var(--fg-muted)', marginTop: 8, marginBottom: 0, fontSize: 'var(--text-md)', lineHeight: 1.55 }}>Scaffold, wire CI, and roll out across rings — without leaving the platform.</p>
      </div>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button className="btn ember cta-arrow">Scaffold a service <Icons.arrowRight size={14} /></button>
        <button className="btn ghost">Read the docs</button>
      </div>
    </div>
  );
}

export default function CtaBannerPage() {
  return (
    <Section
      id="cta-banner"
      num="01"
      title="CTA banner"
      desc="The band that closes a page: one eyebrow, one headline, one primary action (ember) plus a quiet secondary. A faint ember gradient anchors it without becoming a second accent."
    >
      <SubHead meta="full-width">CTA banner</SubHead>
      <Frame label="ember-softer gradient · one primary action">
        <CtaBanner />
      </Frame>
      <CodeBlock
        label="cta banner"
        lang="tsx"
        code={`<div className="cta-banner">
  <div>
    <div className="ds-h-eyebrow">Ready when you are</div>
    <h2>Ship your first Eidos service today.</h2>
    <p>Scaffold, wire CI, and roll out across rings.</p>
  </div>
  <div className="actions">
    <button className="btn ember cta-arrow">Scaffold a service</button>
    <button className="btn ghost">Read the docs</button>
  </div>
</div>`}
      />

      {/* ====================================================================
          STATES
          ==================================================================== */}
      <SubHead meta="states">States</SubHead>
      <Lede up>Beyond the default, the band has four states that map to the lifecycle of its one action: <b style={{color:'var(--fg)'}}>submitting</b> while the click is in flight, <b style={{color:'var(--fg)'}}>gated</b> when a prerequisite is missing, <b style={{color:'var(--fg)'}}>error</b> when the action fails, and a <b style={{color:'var(--fg)'}}>loading</b> placeholder while the copy itself streams in. In every state the band names what to do next so it is never a dead end.</Lede>

      <Frame label="submitting — primary busy, ember surface stays active">
        <div
          style={{
            width: '100%', position: 'relative', overflow: 'hidden',
            borderRadius: 'var(--radius-2xl)', border: '1px solid color-mix(in oklch, var(--ember) 24%, var(--border))',
            background: 'linear-gradient(135deg, var(--ember-softer), transparent 70%), var(--bg-elevated)',
            padding: '34px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap',
          }}
        >
          <div style={{ maxWidth: '52ch' }}>
            <div className="ds-h-eyebrow" style={{ color: 'var(--ember)', marginBottom: 8 }}>Ready when you are</div>
            <h2 style={{ margin: 0, fontSize: 'var(--text-2xl)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.15 }}>Ship your first Eidos service today.</h2>
            <p style={{ color: 'var(--fg-muted)', marginTop: 8, marginBottom: 0, fontSize: 'var(--text-md)', lineHeight: 1.55 }}>Scaffold, wire CI, and roll out across rings — without leaving the platform.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }} aria-busy="true">
            <button className="btn ember" disabled>
              <Spinner size={14} color="var(--ember-fg)" aria-label="Scaffolding your service" /> Scaffolding…
            </button>
            <button className="btn ghost" disabled>Read the docs</button>
          </div>
        </div>
      </Frame>
      <Lede>While the request is in flight the primary swaps its label for a <Mono>Spinner</Mono> (a <Mono>role="status"</Mono> with the accessible name <Mono tone="subtle">Scaffolding your service</Mono>) and both controls go <Mono>disabled</Mono>; the action cluster carries <Mono>aria-busy</Mono> so the wait is announced. The ember surface stays lit because the action is still active, not paused.</Lede>

      <Frame label="gated — prerequisite missing, primary disabled, surface relaxes">
        <div
          style={{
            width: '100%', position: 'relative', overflow: 'hidden',
            borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border)',
            background: 'var(--bg-elevated)',
            padding: '34px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap',
          }}
        >
          <div style={{ maxWidth: '52ch' }}>
            <div className="ds-h-eyebrow" style={{ color: 'var(--fg-subtle)', marginBottom: 8 }}>Connect a repository first</div>
            <h2 style={{ margin: 0, fontSize: 'var(--text-2xl)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.15 }}>Ship your first Eidos service today.</h2>
            <p style={{ color: 'var(--fg-muted)', marginTop: 8, marginBottom: 0, fontSize: 'var(--text-md)', lineHeight: 1.55 }}>Link a Git provider to unlock scaffolding — it takes about a minute.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button className="btn ember" disabled>Scaffold a service <Icons.arrowRight size={14} /></button>
            <button className="btn ghost">Connect a repo</button>
          </div>
        </div>
      </Frame>
      <Lede>When the prerequisite is missing the primary carries <Mono>disabled</Mono> — dropping out of the tab order — and the ember gradient relaxes to a plain <Mono>--bg-elevated</Mono> surface so the band reads as paused, not active. The eyebrow and support line name the blocker, and the secondary becomes the live path forward (the only focusable control).</Lede>

      <Frame label='error — danger Alert, role="alert", retry path'>
        <div
          style={{
            width: '100%', position: 'relative', overflow: 'hidden',
            borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border)',
            background: 'var(--bg-elevated)',
            padding: '34px 32px', display: 'flex', flexDirection: 'column', gap: 18,
          }}
        >
          <div style={{ maxWidth: '52ch' }}>
            <div className="ds-h-eyebrow" style={{ color: 'var(--fg-subtle)', marginBottom: 8 }}>That didn’t go through</div>
            <h2 style={{ margin: 0, fontSize: 'var(--text-2xl)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.15 }}>Ship your first Eidos service today.</h2>
          </div>
          <Alert tone="danger">
            <AlertTitle>Scaffolding failed</AlertTitle>
            <AlertDescription>
              The platform couldn’t reach the Git provider (request{' '}
              <span style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>req_9f3a2c</span>). Nothing was created — your repo is untouched.
            </AlertDescription>
            <AlertActions>
              <button className="btn ember sm cta-arrow">Try again <Icons.arrowRight size={13} /></button>
              <button className="btn ghost sm">View status</button>
            </AlertActions>
          </Alert>
        </div>
      </Frame>
      <Lede>A failed action surfaces an inline <Mono>Alert tone="danger"</Mono> — a real <Mono>role="alert"</Mono> live region, so the failure is announced the moment it renders. It states what failed, echoes the <Mono tone="subtle">req_9f3a2c</Mono> id in tabular Geist Mono for support, reassures that nothing was created, and offers a retry — the band recovers rather than dead-ends.</Lede>

      <Frame label="loading — content streaming in, Skeleton placeholder">
        <div
          style={{
            width: '100%', position: 'relative', overflow: 'hidden',
            borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border)',
            background: 'var(--bg-elevated)',
            padding: '34px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap',
          }}
          aria-busy="true"
        >
          <div style={{ maxWidth: '52ch', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
            <Skeleton variant="line" width={120} height={11} label="Loading call to action" />
            <Skeleton variant="line" width="62%" height={22} />
            <Skeleton variant="line" lines={2} />
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <Skeleton variant="box" width={148} height={32} radius={6} />
            <Skeleton variant="box" width={104} height={32} radius={6} />
          </div>
        </div>
      </Frame>
      <Lede>When the band’s own copy is still resolving — a personalized headline, a remote feature flag — it renders as a <Mono>Skeleton</Mono> matching the eyebrow / headline / two body lines and the two action slots. The container carries <Mono>aria-busy</Mono>; the topmost skeleton owns the single <Mono>role="status"</Mono> announcement, and every shape is <Mono>aria-hidden</Mono>. Under <Mono>prefers-reduced-motion</Mono> the shimmer rests as a flat tint.</Lede>

      {/* ====================================================================
          ACCESSIBILITY
          ==================================================================== */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Heading & roles</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The headline ships as one real <Mono>{'<h2>'}</Mono> for the band (not a styled <Mono>{'<div>'}</Mono>), so it lands in the document outline; both actions are native <Mono>{'<button>'}</Mono> controls with an accessible name from their visible label. The eyebrow is decorative copy, not a heading level.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Live regions</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The submitting <Mono>Spinner</Mono> is a <Mono>role="status"</Mono> carrying its own label, and the action cluster sets <Mono>aria-busy</Mono> while in flight. A failure renders an <Mono>Alert tone="danger"</Mono> as a <Mono>role="alert"</Mono> region so it is announced immediately; the loading skeleton announces once via a single <Mono>role="status"</Mono>.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Contrast over texture</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Headline, support line, and ember-tinted eyebrow all sit on the solid <Mono>--bg-elevated</Mono> band, so they stay AA-legible over the faint ember gradient. On the ember fill the button label and spinner are dark ink (<Mono>--ember-fg</Mono>), never ember-on-ember.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Reduced motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The band is static — nothing auto-advances. The <Mono>.cta-arrow</Mono> hover nudge and the skeleton shimmer are both behind a <Mono>prefers-reduced-motion: no-preference</Mono> guard, so they rest flat; the spinner ring slows to a calmer pace. The only baseline motion is the button hover lift, a sub-pixel transform.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 10}}>Keyboard</div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
            <div style={{display: 'flex', alignItems: 'baseline', gap: 12}}>
              <span className="kbd-chord" style={{flexShrink: 0}}><kbd className="kbd">Tab</kbd></span>
              <span style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5}}>Move to the primary CTA, then the secondary — focus order matches the visual order and flips under <Mono>dir="rtl"</Mono>.</span>
            </div>
            <div style={{display: 'flex', alignItems: 'baseline', gap: 12}}>
              <span className="kbd-chord" style={{flexShrink: 0}}><kbd className="kbd">Shift</kbd><kbd className="kbd">Tab</kbd></span>
              <span style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5}}>Step back through the action cluster.</span>
            </div>
            <div style={{display: 'flex', alignItems: 'baseline', gap: 12}}>
              <span className="kbd-chord" style={{flexShrink: 0}}><kbd className="kbd">Enter</kbd><kbd className="kbd">Space</kbd></span>
              <span style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5}}>Activate the focused button — each control shows the canonical ember <Mono>:focus-visible</Mono> ring.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          RTL
          ==================================================================== */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label={'dir="rtl" — eyebrow/headline right-align, the action cluster moves to the trailing (left) edge'}
        code={`<div dir="rtl">
  <div className="cta-banner">
    <div>
      <div className="ds-h-eyebrow">جاهزون متى كنت مستعدًا</div>
      <h2>أطلق خدمتك الأولى على Eidos اليوم.</h2>
      <p>هيّئ الخدمة، اربط الـ CI، وانشرها عبر الحلقات.</p>
    </div>
    <div className="actions">
      <button className="btn ember">هيّئ خدمة</button>
      <button className="btn ghost">اقرأ الوثائق</button>
    </div>
  </div>
</div>`}
        lang="tsx"
      >
        <div dir="rtl">
          <div
            style={{
              width: '100%', position: 'relative', overflow: 'hidden',
              borderRadius: 'var(--radius-2xl)', border: '1px solid color-mix(in oklch, var(--ember) 24%, var(--border))',
              background: 'linear-gradient(135deg, var(--ember-softer), transparent 70%), var(--bg-elevated)',
              padding: '34px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap',
            }}
          >
            <div style={{ maxWidth: '52ch' }}>
              <div className="ds-h-eyebrow" style={{ color: 'var(--ember)', marginBottom: 8 }}>جاهزون متى كنت مستعدًا</div>
              <h2 style={{ margin: 0, fontSize: 'var(--text-2xl)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.15 }}>أطلق خدمتك الأولى على Eidos اليوم.</h2>
              <p style={{ color: 'var(--fg-muted)', marginTop: 8, marginBottom: 0, fontSize: 'var(--text-md)', lineHeight: 1.55 }}>هيّئ الخدمة، اربط الـ CI، وانشرها عبر الحلقات — دون مغادرة المنصة.</p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button className="btn ember"><Icons.arrowRight size={14} style={{ transform: 'scaleX(-1)' }} /> هيّئ خدمة</button>
              <button className="btn ghost">اقرأ الوثائق</button>
            </div>
          </div>
        </div>
      </Frame>
      <Lede>
        The band is a single logical flex row, so it mirrors without overrides: the eyebrow, headline, and support line right-align, and the action cluster moves to the trailing (now left) edge — focus order is unchanged because DOM order is preserved. The symmetric <Mono>padding</Mono> and the <Mono>gap</Mono> between actions are direction-agnostic. The only non-text glyph, the arrow on the primary CTA, points toward the reading direction, so it is mirrored with <Mono>transform: scaleX(-1)</Mono>; the ember gradient anchors the leading edge in both directions.
      </Lede>

      {/* ====================================================================
          ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{padding: '64px 36px 56px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative', width:'100%', maxWidth:560}} aria-hidden="true">
              <div
                style={{
                  width: '100%', position: 'relative', overflow: 'hidden',
                  borderRadius: 'var(--radius-xl)', border: '1px solid color-mix(in oklch, var(--ember) 24%, var(--border))',
                  background: 'linear-gradient(135deg, var(--ember-softer), transparent 70%), var(--bg-elevated)',
                  padding: '22px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
                }}
              >
                <div style={{ maxWidth: '32ch' }}>
                  <div className="ds-h-eyebrow" style={{ color: 'var(--ember)', marginBottom: 6 }}>Ready when you are</div>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.15 }}>Ship your first service today.</div>
                  <p style={{ color: 'var(--fg-muted)', marginTop: 6, fontSize: 'var(--text-base)' }}>Scaffold, wire CI, roll out across rings.</p>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button className="btn ember sm cta-arrow" tabIndex={-1} style={{cursor:'default'}}>Scaffold <Icons.arrowRight size={13} /></button>
                  <button className="btn ghost sm" tabIndex={-1} style={{cursor:'default'}}>Docs</button>
                </div>
              </div>
              <span className="lead v" style={{top: -22, left: 30, height: 18}}/>
              <span className="lead h" style={{top: 38, left: -28, width: 24}}/>
              <span className="lead h" style={{top: 62, left: -28, width: 24}}/>
              <span className="lead v" style={{bottom: -22, right: 60, height: 18}}/>
              <div className="pin" style={{top: -42, left: 30, transform:'translateX(-50%)'}}>1</div>
              <div className="pin" style={{top: 30, left: -52}}>2</div>
              <div className="pin" style={{top: 54, left: -52}}>3</div>
              <div className="pin" style={{bottom: -42, right: 60, transform:'translateX(50%)'}}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Eyebrow.</b> Mono, ember-tinted, one line. Sets the moment — Ready when you are, not a heading.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Headline.</b> Geist 600, <Mono>--text-2xl</Mono>, capped near 52ch so it reads in one breath.</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Support line.</b> One muted sentence on what happens after the click. Optional.</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Action cluster.</b> One ember primary (<Mono>.cta-arrow</Mono> — the trailing arrow nudges toward the reading direction on hover) + one ghost. The faint ember gradient is texture, not a second accent.</span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          DO / DON'T
          ==================================================================== */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — one ember primary, one quiet secondary</div>
          <div className="body" style={{flexDirection:'column', alignItems:'flex-start', gap: 10, padding: 18}}>
            <div className="ds-h-eyebrow" style={{color:'var(--ember)'}}>Ready when you are</div>
            <h3 style={{margin: 0, fontSize: 'var(--text-lg)', fontWeight: 600, letterSpacing:'-0.015em', lineHeight: 1.2}}>Ship your first Eidos service.</h3>
            <div style={{display:'flex', gap: 8}}>
              <button className="btn ember sm">Scaffold a service</button>
              <button className="btn ghost sm">Read the docs</button>
            </div>
          </div>
          <div className="note">One ask carries the band. The ghost lets people opt out without competing with the primary.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — stack competing CTAs</div>
          <div className="body" style={{flexDirection:'column', alignItems:'flex-start', gap: 10, padding: 18}}>
            <div className="ds-h-eyebrow" style={{color:'var(--ember)'}}>Ready when you are</div>
            <h3 style={{margin: 0, fontSize: 'var(--text-lg)', fontWeight: 600, letterSpacing:'-0.015em', lineHeight: 1.2}}>Ship your first Eidos service.</h3>
            <div style={{display:'flex', gap: 8}}>
              <button className="btn ember sm">Scaffold</button>
              <button className="btn ember sm">Book a demo</button>
              <button className="btn ember sm">Talk to sales</button>
            </div>
          </div>
          <div className="note">Three embers cancel out and the band loses its job. A closing CTA has exactly one ask.</div>
        </div>
      </div>
    </Section>
  );
}
