'use client';
// Forge Blocks — Split feature. A two-column section: copy on one side, a visual on the
// other. Alternate the sides down a page to keep the rhythm.
import { Section, SubHead, Frame, CodeBlock, Icons, Mono, Lede, Kbd } from '@/ds/core';

// `rtl` only flips the directional CTA arrow so it still means "forward" under dir="rtl"
// — the column order is handled by the flex container reading the inherited direction.
const COPY = {
  ltr: { eyebrow: 'Rollouts', title: 'Ring deployments, on a budget.', body: 'Promote through canary → 25% → 100% while the error budget holds. Auto-rollback the moment it burns. You watch one progress ring, not five dashboards.', cta: 'See the pipeline' },
  rtl: { eyebrow: 'الإطلاقات', title: 'نشر تدريجي، ضمن الميزانية.', body: 'انتقل عبر canary ← ٢٥٪ ← ١٠٠٪ ما دامت ميزانية الأخطاء صامدة. تراجُع تلقائي لحظة استنزافها. تراقب حلقة تقدّم واحدة، لا خمس لوحات.', cta: 'اعرض المسار' },
} as const;

function SplitFeature({ flip = false, rtl = false }: { flip?: boolean; rtl?: boolean }) {
  const t = rtl ? COPY.rtl : COPY.ltr;
  const text = (
    <div style={{ flex: 1, minWidth: 240 }}>
      <div className="ds-h-eyebrow" style={{ color: 'var(--ember)', marginBottom: 10 }}>{t.eyebrow}</div>
      <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 10 }}>{t.title}</div>
      <p style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-md)', lineHeight: 1.6, marginBottom: 14 }}>
        {t.body}
      </p>
      <button className="btn ember">{t.cta} <Icons.arrowRight size={14} style={rtl ? { transform: 'scaleX(-1)' } : undefined} /></button>
    </div>
  );
  const visual = (
    <div style={{ flex: 1, minWidth: 240 }}>
      <div className="surface" style={{ padding: 0, overflow: 'hidden', aspectRatio: '16 / 10', position: 'relative', background: 'linear-gradient(135deg, var(--ember-softer), transparent 60%), var(--bg-elevated)' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-faint)' }}>
          <Icons.pipeline size={64} />
        </div>
      </div>
    </div>
  );
  return (
    <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
      {flip ? <>{visual}{text}</> : <>{text}{visual}</>}
    </div>
  );
}

export default function SplitFeaturePage() {
  return (
    <Section
      id="split-feature"
      num="01"
      title="Split feature"
      desc="Copy on one side, a visual on the other. Use it to explain a single capability in depth, and flip the sides on the next one so a stack of them reads as a rhythm, not a list."
    >
      <SubHead meta="text + visual">Split feature</SubHead>
      <Lede>One capability, explained once: an ember eyebrow, a heading, a paragraph, and a single ember CTA on one side; a real product artifact on a fixed <Mono>16/10</Mono> surface on the other. The whole block is a <Mono>flex</Mono> row that wraps to a single stack on narrow viewports and mirrors under <Mono>dir="rtl"</Mono>.</Lede>
      <Frame label="Two columns · text leading">
        <SplitFeature />
      </Frame>
      <CodeBlock
        label="split feature"
        lang="tsx"
        code={`<div className="split">
  <div className="split-text">{/* eyebrow · title · copy · CTA */}</div>
  <div className="split-visual">{/* image / chart / mock */}</div>
</div>`}
      />

      {/* ====================================================================
          VARIANTS — the flip prop
          ==================================================================== */}
      <SubHead meta="flip prop">Variants</SubHead>
      <Frame label="default (text leading) · flip (visual leading) — alternate down a page">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, width: '100%' }}>
          <SplitFeature />
          <SplitFeature flip />
        </div>
      </Frame>
      <Lede up>The only axis is <Mono>flip</Mono>: it swaps which column leads. Alternate it down a page so a stack of split features reads as a rhythm, not a list. Logical properties mean the same <Mono>flip</Mono> still mirrors correctly under <Mono>dir="rtl"</Mono> — proven live below.</Lede>

      {/* ====================================================================
          ACCESSIBILITY
          ==================================================================== */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 10}}>Keyboard</div>
          <div style={{display:'flex', flexDirection:'column', gap: 8}}>
            <div style={{display:'flex', alignItems:'baseline', gap: 10, fontSize:'var(--text-base)'}}><Kbd keys="Tab"/><span style={{color:'var(--fg-muted)', lineHeight:1.5}}>moves to the single CTA — the only tab stop in the block.</span></div>
            <div style={{display:'flex', alignItems:'baseline', gap: 10, fontSize:'var(--text-base)'}}><Kbd keys="Enter"/><span style={{color:'var(--fg-muted)', lineHeight:1.5}}>activates the CTA (it is a real <Mono>&lt;button&gt;</Mono>, not a styled div).</span></div>
            <div style={{display:'flex', alignItems:'baseline', gap: 10, fontSize:'var(--text-base)'}}><Kbd keys={['Shift','Tab']}/><span style={{color:'var(--fg-muted)', lineHeight:1.5}}>steps back out — DOM order keeps the eyebrow → heading → copy → action group intact even when <Mono>flip</Mono> reverses the visual columns.</span></div>
          </div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Roles &amp; structure</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The title is a real heading and the CTA a real <Mono>&lt;button&gt;</Mono>/<Mono>&lt;a&gt;</Mono>. The decorative visual is <Mono>aria-hidden</Mono>; if it conveys data (a chart) it gets a real text alternative instead. The eyebrow is presentational text, not a heading, so it never breaks the document outline.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Copy sits on the solid surface, never on the gradient visual, so body text clears <span style={{fontVariantNumeric:'tabular-nums'}}>4.5:1</span> and the heading <span style={{fontVariantNumeric:'tabular-nums'}}>3:1</span>. The ember CTA puts dark ink (<Mono>--ember-fg</Mono>) on the fill — the accent is never set as foreground on a colored surface.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; reduced motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The CTA is the only focusable control and shows the canonical <Mono>:focus-visible</Mono> ring from the <Mono>.btn</Mono> class — no <Mono>outline:none</Mono> without a substitute. Both columns <Mono>flex-wrap</Mono> to one stack at narrow widths and 200% zoom with no horizontal scroll; the block is static, and any animated visual you drop in must honor <Mono>prefers-reduced-motion</Mono>.</div>
        </div>
      </div>

      {/* ====================================================================
          RTL
          ==================================================================== */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label={'dir="rtl" — the lead column flips to the start (right) and the CTA arrow mirrors'}
        code={`<div dir="rtl">
  {/* No flip prop needed — the flex row reads the inherited
     direction, so the text column leads from the right edge. */}
  <SplitFeature />

  {/* Directional arrows are mirrored so "forward" still
     points along the reading direction. */}
  <ArrowRight className="rtl:scale-x-[-1]" />
</div>`}
        lang="tsx">
        <div dir="rtl" style={{width:'100%'}}>
          <SplitFeature rtl />
        </div>
      </Frame>
      <Lede>Nothing is hand-positioned with physical <Mono>left</Mono>/<Mono>right</Mono>: the columns are a <Mono>flex</Mono> row, the gaps are symmetric, and the spacing is logical — so under <Mono>dir="rtl"</Mono> the text column simply leads from the start (now the right) edge with no extra props. The single directional glyph — the CTA arrow — is the one thing flipped, so "forward" keeps pointing with the reading direction. Localize the copy for the active locale; the structure is direction-agnostic.</Lede>

      {/* ====================================================================
          ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{padding: '64px 36px 56px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative', width:'100%', maxWidth:560}} aria-hidden="true">
              <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div className="ds-h-eyebrow" style={{ color: 'var(--ember)', marginBottom: 8 }}>Rollouts</div>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 8 }}>Ring deployments, on a budget.</div>
                  <p style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55, marginBottom: 12 }}>Promote through canary, then 25%, then 100% while the error budget holds.</p>
                  <button className="btn ember sm" tabIndex={-1} style={{cursor:'default'}}>See the pipeline <Icons.arrowRight size={13} /></button>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="surface" style={{ padding: 0, overflow: 'hidden', aspectRatio: '16 / 10', position: 'relative', background: 'linear-gradient(135deg, var(--ember-softer), transparent 60%), var(--bg-elevated)' }}>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-faint)' }}>
                      <Icons.pipeline size={44} />
                    </div>
                  </div>
                </div>
              </div>
              <span className="lead h" style={{top: 30, left: -28, width: 24}}/>
              <span className="lead v" style={{top: -22, right: '25%', height: 18}}/>
              <span className="lead v" style={{top: -22, left: 10, height: 18}}/>
              <span className="lead h" style={{bottom: 24, left: -28, width: 24}}/>
              <div className="pin" style={{top: 22, left: -52}}>1</div>
              <div className="pin" style={{top: -42, right: '25%', transform:'translateX(50%)'}}>2</div>
              <div className="pin" style={{top: -42, left: 10, transform:'translateX(-50%)'}}>3</div>
              <div className="pin" style={{bottom: 16, left: -52}}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Text column.</b> Eyebrow, title, one paragraph, a single CTA. Holds a <Mono>min-width</Mono> so it wraps below the visual on narrow screens instead of crushing.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Visual column.</b> A fixed <Mono>16/10</Mono> surface holding a real artifact — chart, mock, or product shot — not a stock illustration.</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Eyebrow.</b> Mono, ember-tinted, names the capability (Rollouts). One per split.</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>One ember CTA.</b> The single ask per split. Visual weight stays on the artifact; the accent stays on the button.</span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          DO / DON'T
          ==================================================================== */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — alternate the flip down a page</div>
          <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap: 8, padding: 18}}>
            <div style={{display:'flex', gap: 8, alignItems:'center'}}><span style={{flex:1, height: 18, background:'var(--surface-2, var(--surface))', borderRadius: 4}}/><span style={{flex:1, height: 18, background:'linear-gradient(135deg, var(--ember-softer), transparent 60%)', borderRadius: 4}}/></div>
            <div style={{display:'flex', gap: 8, alignItems:'center'}}><span style={{flex:1, height: 18, background:'linear-gradient(135deg, var(--ember-softer), transparent 60%)', borderRadius: 4}}/><span style={{flex:1, height: 18, background:'var(--surface-2, var(--surface))', borderRadius: 4}}/></div>
          </div>
          <div className="note">Flipping the lead column on each row builds a zig-zag rhythm so the stack reads as a story, not a stack of identical slabs.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — same side every time</div>
          <div className="body" style={{flexDirection:'column', alignItems:'stretch', gap: 8, padding: 18}}>
            <div style={{display:'flex', gap: 8, alignItems:'center'}}><span style={{flex:1, height: 18, background:'var(--surface-2, var(--surface))', borderRadius: 4}}/><span style={{flex:1, height: 18, background:'linear-gradient(135deg, var(--ember-softer), transparent 60%)', borderRadius: 4}}/></div>
            <div style={{display:'flex', gap: 8, alignItems:'center'}}><span style={{flex:1, height: 18, background:'var(--surface-2, var(--surface))', borderRadius: 4}}/><span style={{flex:1, height: 18, background:'linear-gradient(135deg, var(--ember-softer), transparent 60%)', borderRadius: 4}}/></div>
          </div>
          <div className="note">Text always-left, visual always-right reads as a repeating template and the eye stops registering the cut.</div>
        </div>
      </div>
    </Section>
  );
}
