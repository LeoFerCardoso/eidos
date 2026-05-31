'use client';
// Eidos Blocks — Feature grid. A three-up section of icon + title + copy cards.
import { Section, SubHead, Frame, CodeBlock, Icons, Lede, Mono, Skeleton } from '@/ds/core';


const FEATURES = [
  { icon: 'rocket', title: 'Ship faster', body: 'Scaffold a service, wire CI, and deploy across rings from one CLI.' },
  { icon: 'server', title: 'Own your infra', body: 'Every service is described in code — owners, tiers, budgets, runbooks.' },
  { icon: 'sparkle', title: 'Agent-assisted', body: 'The Eidos agent watches the estate and surfaces what matters today.' },
];

// RTL sample — the same three capabilities in Arabic. Logical CSS means the
// row, icon bubble, and copy all flip to the trailing edge with no overrides.
const FEATURES_RTL = [
  { icon: 'rocket', title: 'اشحن أسرع', body: 'هيّئ خدمة، اربط الـ CI، وانشرها عبر الحلقات من سطر أوامر واحد.' },
  { icon: 'server', title: 'تحكّم ببنيتك', body: 'كل خدمة موصوفة في الكود — المالكون، المستويات، الميزانيات.' },
  { icon: 'sparkle', title: 'بمساعدة الوكيل', body: 'يراقب وكيل Eidos المنظومة ويُبرز ما يهمّك اليوم.' },
];

// Loading state — feature copy is often config / registry-driven, so the grid
// renders skeleton cards that mirror the real anatomy (bubble + title + body)
// while the config resolves. The shimmer respects prefers-reduced-motion.
function FeatureGridSkeleton() {
  return (
    <div className="ds-grid cols-3" style={{ width: '100%' }} aria-busy="true" aria-label="Loading features">
      {[0, 1, 2].map((i) => (
        <div key={i} className="surface" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Skeleton variant="circle" size={40} radius="var(--radius-xl)" />
          <Skeleton variant="line" width="56%" height={14} />
          <Skeleton variant="line" lines={2} />
        </div>
      ))}
    </div>
  );
}

function FeatureGrid() {
  return (
    <div className="ds-grid cols-3" style={{ width: '100%' }}>
      {FEATURES.map((f) => {
        const Icon = (Icons as Record<string, any>)[f.icon] || Icons.circle;
        return (
          <div key={f.title} className="surface" style={{ padding: 22 }}>
            <span style={{ width: 40, height: 40, borderRadius: 'var(--radius-xl)', background: 'var(--ember-soft)', color: 'var(--ember)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBlockEnd: 14 }}>
              <Icon size={20} />
            </span>
            <div style={{ fontSize: 'var(--text-body)', fontWeight: 600, marginBlockEnd: 6, letterSpacing: '-0.005em' }}>{f.title}</div>
            <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.6 }}>{f.body}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function FeatureGridPage() {
  return (
    <Section
      id="feature-grid"
      num="01"
      title="Feature grid"
      desc="Three equal-weight cards — icon bubble, title, one line of copy. The workhorse of landings and empty states: turns a capability list into a scannable row."
    >
      <SubHead meta="3-up">Feature grid</SubHead>
      <Lede>One ember-soft icon bubble per card, never more than one accent on the surface. Keep copy to one sentence — if you need more, the card is doing too much.</Lede>
      <Frame label="cols-3 · surface cards · ember-soft icon bubbles">
        <FeatureGrid />
      </Frame>
      <CodeBlock
        label="feature grid"
        lang="tsx"
        code={`<div className="ds-grid cols-3">
  {features.map((f) => (
    <div key={f.title} className="surface" style={{ padding: 22 }}>
      {/* ember-soft icon bubble — the single accent on the card */}
      <span style={{
        width: 40, height: 40, borderRadius: 'var(--radius-xl)',
        background: 'var(--ember-soft)', color: 'var(--ember)',
        display: 'inline-flex', alignItems: 'center',
        justifyContent: 'center', marginBlockEnd: 14,
      }}>
        <Icons.rocket size={20} />
      </span>
      <div style={{
        fontSize: 'var(--text-body)', fontWeight: 600,
        marginBlockEnd: 6, letterSpacing: '-0.005em',
      }}>{f.title}</div>
      <div style={{
        color: 'var(--fg-muted)', fontSize: 'var(--text-base)',
        lineHeight: 1.6,
      }}>{f.body}</div>
    </div>
  ))}
</div>`}
      />

      {/* ====================================================================
          STATES — loading
          ==================================================================== */}
      <SubHead meta="states">Loading</SubHead>
      <Lede>Feature copy is usually config- or registry-driven. While that config resolves, render skeleton cards that mirror the real anatomy — bubble, title, two body lines — so the grid never reflows when the content lands.</Lede>
      <Frame
        label="loading — aria-busy skeleton cards, reduced-motion-safe shimmer"
        code={`function FeatureGridSkeleton() {
  return (
    <div className="ds-grid cols-3" aria-busy="true" aria-label="Loading features">
      {[0, 1, 2].map((i) => (
        <div key={i} className="surface" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Skeleton variant="circle" size={40} radius="var(--radius-xl)" />
          <Skeleton variant="line" width="56%" height={14} />
          <Skeleton variant="line" lines={2} />
        </div>
      ))}
    </div>
  );
}`}
        lang="tsx"
      >
        <FeatureGridSkeleton />
      </Frame>

      {/* ====================================================================
          RTL
          ==================================================================== */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Lede>The grid, the icon bubble, the title, and the muted body are all built from logical properties — under <Mono>dir="rtl"</Mono> the row reverses and every card right-aligns with no per-page overrides.</Lede>
      <Frame
        label={'dir="rtl" — row reverses, icon bubble + copy align to the trailing (right) edge'}
        code={`<div dir="rtl">
  <div className="ds-grid cols-3">
    {features.map((f) => (
      <div key={f.title} className="surface" style={{ padding: 22 }}>
        <span style={{
          inlineSize: 40, blockSize: 40, borderRadius: 'var(--radius-xl)',
          background: 'var(--ember-soft)', color: 'var(--ember)',
          display: 'inline-flex', alignItems: 'center',
          justifyContent: 'center', marginBlockEnd: 14,
        }}>
          <Icons.rocket size={20} />
        </span>
        <div style={{ fontSize: 'var(--text-body)', fontWeight: 600, marginBlockEnd: 6 }}>{f.title}</div>
        <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)' }}>{f.body}</div>
      </div>
    ))}
  </div>
</div>`}
        lang="tsx"
      >
        <div dir="rtl" style={{ width: '100%' }}>
          <div className="ds-grid cols-3" style={{ width: '100%' }}>
            {FEATURES_RTL.map((f) => {
              const Icon = (Icons as Record<string, any>)[f.icon] || Icons.circle;
              return (
                <div key={f.title} className="surface" style={{ padding: 22 }}>
                  <span style={{ inlineSize: 40, blockSize: 40, borderRadius: 'var(--radius-xl)', background: 'var(--ember-soft)', color: 'var(--ember)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBlockEnd: 14 }}>
                    <Icon size={20} />
                  </span>
                  <div style={{ fontSize: 'var(--text-body)', fontWeight: 600, marginBlockEnd: 6, letterSpacing: '-0.005em' }}>{f.title}</div>
                  <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.6 }}>{f.body}</div>
                </div>
              );
            })}
          </div>
        </div>
      </Frame>

      {/* ====================================================================
          ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{padding: '64px 36px 56px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative', width:'100%', maxWidth:560}} aria-hidden="true">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {FEATURES.map((f) => {
                  const Icon = (Icons as Record<string, any>)[f.icon] || Icons.circle;
                  return (
                    <div key={f.title} className="surface" style={{ padding: 16 }}>
                      <span style={{ width: 34, height: 34, borderRadius: 'var(--radius-xl)', background: 'var(--ember-soft)', color: 'var(--ember)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBlockEnd: 10 }}>
                        <Icon size={17} />
                      </span>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBlockEnd: 4, letterSpacing: '-0.005em' }}>{f.title}</div>
                      <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5 }}>{f.body}</div>
                    </div>
                  );
                })}
              </div>
              <span className="lead v" style={{bottom: -22, left: '16%', height: 18}}/>
              <span className="lead v" style={{top: -22, left: '50%', height: 18, transform:'translateX(-50%)'}}/>
              <span className="lead h" style={{top: 70, right: -28, width: 24}}/>
              <span className="lead h" style={{top: 100, right: -28, width: 24}}/>
              <div className="pin" style={{bottom: -42, left: '16%', transform:'translateX(-50%)'}}>1</div>
              <div className="pin" style={{top: -42, left: '50%', transform:'translateX(-50%)'}}>2</div>
              <div className="pin" style={{top: 62, right: -52}}>3</div>
              <div className="pin" style={{top: 92, right: -52}}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Surface card.</b> One <Mono>--surface</Mono> tile per feature. Equal width via <Mono>ds-grid cols-3</Mono>; equal padding keeps the row level.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Icon bubble.</b> 40px <Mono>--ember-soft</Mono> rounded square holding a 20px ember glyph — the single accent on the card.</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Title.</b> Geist 600, body size. A verb-led promise — Ship faster, not Shipping.</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Body.</b> One muted line, ~2 sentences. Cap the height so all three cards stay the same depth.</span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          ACCESSIBILITY
          ==================================================================== */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginBlockStart: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBlockEnd: 6}}>Decorative icons, real headings</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The icon bubbles are decorative (<Mono>aria-hidden</Mono>) — the title carries the meaning, so the icon is never the only label. Each card title is a consistent heading level, giving screen-reader users a scannable outline of the features.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBlockEnd: 6}}>Contrast over the bubble</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The glyph is explicit ember on the <Mono>--ember-soft</Mono> bubble — a contrasting pair, never ember on ember. Title and body sit on the solid card surface and clear AA in both themes.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBlockEnd: 6}}>Reflow &amp; reduced motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The grid reflows from three columns to one on narrow viewports and at 200% zoom without horizontal scroll. Loaded cards are static; the loading skeleton is the only motion and its shimmer is suppressed under <Mono>prefers-reduced-motion</Mono>, so the block is safe for motion-sensitive users.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBlockEnd: 6}}>Focus order</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>If a card links somewhere, the whole card is one focusable control (or the title link is the single tab stop) so focus runs left-to-right across the row, matching the reading and visual order — and flipping under <Mono>dir="rtl"</Mono>.</div>
        </div>
      </div>

      {/* ====================================================================
          DO / DON'T
          ==================================================================== */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — one ember-soft bubble per card</div>
          <div className="body" style={{flexDirection:'column', alignItems:'flex-start', gap: 8, padding: 18}}>
            <span style={{ width: 36, height: 36, borderRadius: 'var(--radius-xl)', background: 'var(--ember-soft)', color: 'var(--ember)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icons.rocket size={18} /></span>
            <div style={{fontSize: 'var(--text-base)', fontWeight: 600}}>Ship faster</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.5}}>Scaffold, wire CI, deploy from one CLI.</div>
          </div>
          <div className="note">The bubble is the only accent; the title and copy do the work. Equal cards read as a set.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — fill the bubble with ember and tint the text too</div>
          <div className="body" style={{flexDirection:'column', alignItems:'flex-start', gap: 8, padding: 18}}>
            <span style={{ width: 36, height: 36, borderRadius: 'var(--radius-xl)', background: 'var(--ember)', color: 'var(--ember)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icons.rocket size={18} /></span>
            <div style={{fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ember)'}}>Ship faster</div>
            <div style={{color: 'var(--ember)', fontSize: 'var(--text-base)', lineHeight: 1.5}}>Scaffold, wire CI, deploy from one CLI.</div>
          </div>
          <div className="note">Ember glyph on an ember fill disappears, and ember body copy adds a second accent. Keep the fill soft and the foreground dark.</div>
        </div>
      </div>
    </Section>
  );
}
