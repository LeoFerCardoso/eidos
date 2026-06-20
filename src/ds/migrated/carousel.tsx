'use client';
// Eidos DS — Components / Carousel
// Page layout:
//   1. Installation  (ComponentInstall / TabbedCode)
//   2. Usage         (Frame: minimal render)
//   3. Variants      (Default cards · Hero · Autoplay)
//   4. In context    (product feed)
//   5. Accessibility (keyboard · screen reader · focus · motion)
//   6. RTL           (dir="rtl" frame + lede)
//   7. Anatomy       (labelled parts)
//   8. Do / Don't    (dd-grid)
//   9. API reference (AutoPropsTable)
import * as React from 'react';
import {
  Icons,
  Frame,
  Section,
  SubHead,
  ComponentInstall,
  AutoPropsTable,
  PropsTable,
  Lede,
  Mono,
  Carousel,
  CarouselSlide,
  CarouselPrev,
  CarouselNext,
  CarouselDots,
  CarouselControls,
} from '@/ds/core';

// ==========================================================================
// 2.  USAGE
// ==========================================================================
const USAGE_CODE = `import {
  Carousel, CarouselSlide,
  CarouselPrev, CarouselNext, CarouselDots,
} from "@/components/forge/carousel"

export function Demo() {
  return (
    <Carousel label="Feature highlights">
      {features.map((f) => (
        <CarouselSlide key={f.id} width="240px">…</CarouselSlide>
      ))}
      <CarouselPrev />
      <CarouselNext />
      <CarouselDots />
    </Carousel>
  )
}`;

// ==========================================================================
// Slide data
// ==========================================================================
const FEATURES = [
  { tag: 'NEW',    title: 'Fluid type scale',  desc: 'clamp() across every heading, defined once in tokens.' },
  { tag: 'UPDATE', title: 'Dark mode tokens',  desc: 'Six surface levels + automatic chrome contrast.' },
  { tag: 'NEW',    title: 'Typed Layout', desc: 'Box/Stack/Inline/Grid — token props, zero raw markup.' },
  { tag: 'NEW',    title: 'Framer Motion 11',  desc: 'Pre-tuned motion variants per surface.' },
  { tag: 'UPDATE', title: 'Accessible focus',  desc: 'Ember rings everywhere — bye, browser blue.' },
  { tag: 'NEW',    title: 'RTL contract',      desc: 'Logical properties throughout. Flip with one attribute.' },
];

const HEROES = [
  { tag: 'RELEASE',  title: 'Eidos 1.1',         desc: '7 new components, full alphabetical sort.' },
  { tag: 'GUIDE',    title: 'Typed Layout guide',  desc: 'Token props, the as polymorphic prop, eslint gate.' },
  { tag: 'ROADMAP',  title: 'Coming next',        desc: 'Combobox, command palette, and a chart kit.' },
];

const FEATURES_AR = [
  { tag: 'جديد',  title: 'مقياس الخط المرن', desc: 'clamp() لكل عنوان، يُعرَّف مرة في الرموز.' },
  { tag: 'تحديث', title: 'رموز الوضع الداكن', desc: 'ست طبقات سطح + تباين تلقائي للواجهة.' },
  { tag: 'جديد',  title: 'التخطيط المكتوب', desc: 'Box/Stack/Inline/Grid — خصائص الرمز، بدون علامات HTML مباشرة.' },
  { tag: 'جديد',  title: 'Framer Motion 11',  desc: 'متغيرات حركة مضبوطة لكل سطح.' },
];

// ==========================================================================
// Slide helpers (inline tokens for demo renders)
// ==========================================================================
const slideStyle: React.CSSProperties = {
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

const thumbStyle: React.CSSProperties = {
  aspectRatio: '4 / 3',
  background:
    'linear-gradient(135deg, color-mix(in oklab, var(--ember) 22%, transparent), color-mix(in oklab, #A78BFA 18%, transparent)), var(--surface)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--fg-muted)',
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--text-xs)',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  borderBottom: '1px solid var(--border)',
};

const bodyStyle: React.CSSProperties = {
  padding: '12px 14px',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

function Slide({ tag, title, desc }: { tag: string; title: string; desc: string }) {
  return (
    <div style={slideStyle}>
      <div style={thumbStyle}>{tag}</div>
      <div style={bodyStyle}>
        <span style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--fg)' }}>{title}</span>
        <span style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.5 }}>{desc}</span>
      </div>
    </div>
  );
}

// ==========================================================================
// PAGE
// ==========================================================================
export default function CarouselPage() {
  return (
    <Section
      id="carousel"
      num="21"
      title="Carousel"
      desc="A horizontally-scrollable strip with controls. Reach for it when content is parallel and optional — feature cards, image galleries, onboarding steps."
    >
      {/* ====================================================================
          1. INSTALLATION
          ==================================================================== */}
      <ComponentInstall slug="carousel" peers="embla-carousel-react" />
      <Lede>
        Built on <Mono>embla-carousel-react</Mono> — gesture handling, momentum, and snap math come from Embla; Eidos adds arrow chrome, dot indicators, scoped tokens, and an RTL-aware direction adapter. The CLI copies the source file so you own it.
      </Lede>

      {/* ====================================================================
          2. USAGE
          ==================================================================== */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" code={USAGE_CODE}>
        <div style={{ width: '100%' }}>
          <Carousel label="Feature highlights">
            {FEATURES.slice(0, 3).map((s) => (
              <CarouselSlide key={s.title} width="240px">
                <Slide {...s} />
              </CarouselSlide>
            ))}
            <CarouselPrev />
            <CarouselNext />
          </Carousel>
        </div>
      </Frame>

      {/* ====================================================================
          3. VARIANTS
          ==================================================================== */}
      <div style={{
        marginTop: 36, marginBottom: 6,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--fg-faint)',
        }}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      {/* ---- Default card carousel ---- */}
      <SubHead meta="6 slides">Card carousel</SubHead>
      <Frame
        label="drag · scroll · arrows · dots"
        code={`<Carousel label="Feature highlights" opts={{ align: "start" }}>
  {features.map((s) => (
    <CarouselSlide key={s.id} width="240px">
      <Card>…</Card>
    </CarouselSlide>
  ))}
  <CarouselPrev />
  <CarouselNext />
  <CarouselDots />
</Carousel>`}
      >
        <div style={{ width: '100%' }}>
          <Carousel label="Feature highlights" opts={{ align: 'start' }}>
            {FEATURES.map((s) => (
              <CarouselSlide key={s.title} width="240px">
                <Slide {...s} />
              </CarouselSlide>
            ))}
            <CarouselControls />
            <CarouselDots />
          </Carousel>
        </div>
      </Frame>

      {/* ---- Hero variant ---- */}
      <SubHead meta="hero variant">Full-width hero</SubHead>
      <Frame
        label="one slide at a time · edge-to-edge"
        code={`<Carousel variant="hero" label="Featured content">
  {heroes.map((h) => (
    <CarouselSlide key={h.id} style={{ flex: "0 0 100%" }}>
      <HeroSlide {...h} />
    </CarouselSlide>
  ))}
  <CarouselPrev />
  <CarouselNext />
  <CarouselDots />
</Carousel>`}
      >
        <div style={{ width: '100%' }}>
          <Carousel variant="hero" label="Featured content">
            {HEROES.map((h) => (
              <CarouselSlide
                key={h.title}
                style={{
                  flex: '0 0 100%',
                  aspectRatio: '16 / 7',
                  position: 'relative',
                  background: 'var(--surface)',
                  borderRadius: 10,
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  position: 'absolute', inset: 0, padding: 28,
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 6,
                  background: 'linear-gradient(0deg, rgba(8,9,10,0.55), transparent 60%)',
                }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.12em', color: 'var(--ember)', textTransform: 'uppercase' }}>{h.tag}</span>
                  <span style={{ fontSize: 'var(--text-xl)', fontWeight: 600, letterSpacing: '-0.015em', color: 'var(--fg)' }}>{h.title}</span>
                  <span style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>{h.desc}</span>
                </div>
              </CarouselSlide>
            ))}
            <CarouselControls />
            <CarouselDots />
          </Carousel>
        </div>
      </Frame>

      {/* ---- Loop ---- */}
      <SubHead meta="loop">Loop</SubHead>
      <Frame
        label="loop: true — arrows never disable"
        code={`<Carousel opts={{ loop: true }} label="Looping">
  {…}
  <CarouselPrev />
  <CarouselNext />
  <CarouselDots />
</Carousel>`}
      >
        <div style={{ width: '100%' }}>
          <Carousel opts={{ loop: true }} label="Looping features">
            {FEATURES.map((s) => (
              <CarouselSlide key={s.title} width="240px">
                <Slide {...s} />
              </CarouselSlide>
            ))}
            <CarouselControls />
            <CarouselDots />
          </Carousel>
        </div>
      </Frame>

      {/* ====================================================================
          4. IN CONTEXT
          ==================================================================== */}
      <SubHead meta="real surface">In context</SubHead>
      <Lede up>
        A release-highlight card using the carousel as an inline content strip. The outer surface owns padding and typography; the carousel owns only the scroll logic and controls.
      </Lede>
      <Frame label="product update card">
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 24,
          maxWidth: 680,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>What&apos;s new</div>
            <div style={{ fontSize: 'var(--text-body)', fontWeight: 600, color: 'var(--fg)', marginTop: 4 }}>Eidos 1.1 — release highlights</div>
          </div>
          <Carousel label="Release highlights" opts={{ align: 'start' }}>
            {FEATURES.slice(0, 4).map((s) => (
              <CarouselSlide key={s.title} width="200px">
                <Slide {...s} />
              </CarouselSlide>
            ))}
            <CarouselControls />
            <CarouselDots />
          </Carousel>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-faint)' }}>Eidos Design System · v1.1.0</div>
        </div>
      </Frame>

      {/* ====================================================================
          5. ACCESSIBILITY
          ==================================================================== */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Tab reaches the prev/next arrows and each dot button. <Mono>Enter</Mono> / <Mono>Space</Mono> activates them. <Mono>ArrowLeft</Mono> / <Mono>ArrowRight</Mono> (or <Mono>Up</Mono> / <Mono>Down</Mono> in vertical orientation) advance slides when the region is focused. <Mono>Escape</Mono> blurs the region. Arrows disable at start/end in non-loop mode — never wrap silently.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The outer element carries <Mono>role="region"</Mono>, <Mono>aria-roledescription="carousel"</Mono>, and <Mono>aria-label</Mono>. Each slide is <Mono>role="group"</Mono> with <Mono>aria-roledescription="slide"</Mono> and an auto-generated <Mono>aria-label="N of M"</Mono>. Prev/Next are labelled "Previous slide" / "Next slide"; each dot is labelled "Page N of M".
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus &amp; contrast</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Arrow buttons show the ember focus ring (<Mono>--ring</Mono>) and hover switches the border to ember. The active dot doubles the signal with colour (ember) and shape (stretches into a pill) so the current page is never colour-only. Disabled arrows drop opacity to 0.35 — never hidden from the tab order so the boundary is predictable.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            Embla's smooth scroll is component-scoped. Under <Mono>prefers-reduced-motion: reduce</Mono> the <Mono>autoplayInterval</Mono> prop is silently ignored and scroll snap still works — the user can still navigate manually with no animation. The <Mono>.carx-dot</Mono> width transition is also gated by the component-scoped media query.
          </div>
        </div>
      </div>

      {/* ====================================================================
          6. RTL
          ==================================================================== */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label='dir="rtl" — track scrolls right-to-left, chevrons mirror'
        code={`<div dir="rtl">
  <Carousel label="مزايا مميّزة">
    {slides.map((s) => (
      <CarouselSlide key={s.id} width="240px">…</CarouselSlide>
    ))}
    <CarouselPrev />
    <CarouselNext />
    <CarouselDots />
  </Carousel>
</div>`}
      >
        <div dir="rtl" style={{ width: '100%' }}>
          <Carousel label="مزايا مميّزة">
            {FEATURES_AR.map((s) => (
              <CarouselSlide key={s.title} width="240px">
                <Slide {...s} />
              </CarouselSlide>
            ))}
            <CarouselControls />
            <CarouselDots />
          </Carousel>
        </div>
      </Frame>
      <Lede>
        The carousel reads the nearest <Mono>[dir]</Mono> ancestor and passes <Mono>direction: "rtl"</Mono> to Embla, so the track lays out right-to-left and scroll distance is computed correctly. Arrow chevrons mirror via <Mono>[dir="rtl"] .carx-arrow svg {'{'} scaleX(-1) {'}'}</Mono> — the "Previous" chevron still points toward the previous slide. Non-directional icons (close, dot) stay as-is.
      </Lede>

      {/* ====================================================================
          7. ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: 36 }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: 520 }}>
              <Carousel label="Anatomy example">
                <CarouselSlide width="220px">
                  <div style={slideStyle}>
                    <div style={thumbStyle}>SLIDE</div>
                    <div style={bodyStyle}>
                      <span style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--fg)' }}>Slide title</span>
                      <span style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>Short slide description.</span>
                    </div>
                  </div>
                </CarouselSlide>
              </Carousel>
              <div className="pin" style={{ top: 90, insetInlineStart: -22 }}>1</div>
              <div className="pin" style={{ top: 90, insetInlineEnd: -22 }}>2</div>
              <div className="pin" style={{ bottom: -10, insetInlineStart: '50%', transform: 'translateX(-50%)' }}>3</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '24px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Track.</b> Horizontal flex with <Mono>scroll-snap-type: x mandatory</Mono>. Swipe, scroll-wheel, and trackpad all snap to slide boundaries.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Arrows.</b> 36 × 36 floating circles. Disabled at the ends in non-loop mode — never wrap silently, that disorients.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Dots.</b> Buttons doubling as indicators. The active dot stretches into a pill — clearer than a colour change alone.</span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          8. DO / DON'T
          ==================================================================== */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — show 2.5 slides at the edge</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ width: 300, overflow: 'hidden', position: 'relative' }}>
              <div style={{ display: 'flex', gap: 10 }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{ flexShrink: 0, width: 130, height: 64, borderRadius: 8, background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-muted)' }}>{i}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="note">A peek at the next slide signals "more here". Users who can't see scrollbars know to swipe.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — autoplay aggressively</div>
          <div className="body" style={{ padding: 14, flexDirection: 'column', gap: 4, alignItems: 'stretch' }}>
            <div style={{ padding: 10, border: '1px solid var(--danger)', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontWeight: 600, color: 'var(--danger)', fontSize: 'var(--text-base)', fontVariantNumeric: 'tabular-nums' }}>Slide 2 of 5</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', marginTop: 2 }}>auto-advancing every 3 s</div>
            </div>
          </div>
          <div className="note">3-second autoplay punishes readers. If you must autoplay, use <Mono>autoplayInterval</Mono> with <Mono>loop</Mono> and it will pause on hover/focus automatically.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — optional parallel content</div>
          <div className="body" style={{ gap: 4 }}>
            <span style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.6 }}>Feature cards, gallery images, related posts — things the user might browse in any order.</span>
          </div>
          <div className="note">Carousels work best when skipping a slide is OK. Viewers lose slides past index 2 in critical flows.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — hide required steps</div>
          <div className="body" style={{ gap: 4 }}>
            <span style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.6 }}>Onboarding with mandatory steps, multi-step forms, or data that all users need to read.</span>
          </div>
          <div className="note">If every slide is required, use a stepper or wizard instead — carousels make slides easy to miss.</div>
        </div>
      </div>

      {/* ====================================================================
          9. API REFERENCE
          ==================================================================== */}
      <SubHead meta="CarouselProps">API reference</SubHead>
      <AutoPropsTable component="Carousel" />
      <PropsTable
        label="<CarouselSlide />"
        rows={[
          { prop: 'width', type: 'string', default: undefined, description: 'CSS flex-basis for the slide — e.g. "240px", "33.333%", "100%". Unset = content-sized.' },
          { prop: 'className', type: 'string', default: undefined, description: 'Extra classes merged via cn().' },
          { prop: 'children', type: 'ReactNode', required: true, description: 'Slide content — any node.' },
        ]}
      />
      <PropsTable
        label="<CarouselPrev /> · <CarouselNext />"
        rows={[
          { prop: 'aria-label', type: 'string', default: '"Previous/Next slide"', description: 'Override the accessible button label.' },
          { prop: 'children', type: 'ReactNode', default: 'ChevronLeft/Right', description: 'Replace the default icon.' },
          { prop: 'className', type: 'string', default: undefined, description: 'Extra classes.' },
        ]}
      />
      <PropsTable
        label="<CarouselDots />"
        rows={[
          { prop: 'labelPrefix', type: 'string', default: '"Page"', description: 'Prefix for dot aria-labels: "{labelPrefix} N of M".' },
          { prop: 'className', type: 'string', default: undefined, description: 'Extra classes on the dot row.' },
        ]}
      />
    </Section>
  );
}
