'use client';
// Forge Mobile — Page Controller. The horizontally swipeable paged container (UIPageViewController
// idiom) — full-width cards that users swipe through, with a Page Indicator at the bottom.
// Demos a 3-card onboarding carousel. Paging direction inverts under RTL. Cross-links to Page Indicator.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono } from '@/ds/core';

// ── Shared dot indicator (self-contained, no import from page-indicator.tsx) ─────────────────
function Dots({ total, current, onSelect }: { total: number; current: number; onSelect: (i: number) => void }) {
  return (
    <div role="group" aria-label="Slide position" style={{ display: 'flex', justifyContent: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          type="button"
          aria-current={i === current ? 'true' : undefined}
          aria-label={`Go to slide ${i + 1} of ${total}`}
          onClick={() => onSelect(i)}
          style={{ width: 44, height: 44, display: 'grid', placeItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <span
            style={{
              width: i === current ? 12 : 8,
              height: 8,
              borderRadius: 999,
              background: i === current ? 'var(--accent)' : 'var(--fg-faint)',
              display: 'block',
              transition: 'width var(--dur, 200ms) var(--ease, ease)',
            }}
          />
        </button>
      ))}
    </div>
  );
}

// ── Onboarding card data ──────────────────────────────────────────────────────────────────────
const CARDS = [
  {
    icon: 'rocket',
    title: 'Ship faster',
    body: 'Forge CI builds, tests, and deploys on every push. No YAML wrangling — your pipeline is ready the moment you push.',
    cta: 'Next',
    bg: 'var(--surface)',
  },
  {
    icon: 'shield',
    title: 'Stay safe',
    body: 'Progressive rollouts and instant rollback mean a bad deploy never becomes a bad night. Automated health checks catch regressions before users do.',
    cta: 'Next',
    bg: 'var(--surface)',
  },
  {
    icon: 'activity',
    title: 'See everything',
    body: 'Live dashboards, P99 latency, and error budgets across every service. No tab-switching, no stale data.',
    cta: 'Get started',
    bg: 'var(--surface)',
  },
];

// ── Full-screen paged carousel ────────────────────────────────────────────────────────────────
function PageControllerScreen({ rtl = false }: { rtl?: boolean }) {
  const [current, setCurrent] = React.useState(0);
  const total = CARDS.length;
  const card = CARDS[current];
  const Ic = (Icons as Record<string, React.ComponentType<{ size?: number; color?: string }>>)[card.icon];
  const headingRef = React.useRef<HTMLDivElement>(null);
  const movedRef = React.useRef(false);

  function next() {
    setCurrent((c) => Math.min(c + 1, total - 1));
    movedRef.current = true;
  }
  function prev() {
    setCurrent((c) => Math.max(c - 1, 0));
    movedRef.current = true;
  }

  // On a slide change driven by a control, move focus to the new slide heading so
  // screen-reader users hear the new content immediately (matches the a11y spec).
  React.useEffect(() => {
    if (movedRef.current) {
      headingRef.current?.focus();
      movedRef.current = false;
    }
  }, [current]);

  // In RTL, "next" swipe goes left-to-right visually, so we invert the chevron directions
  const showPrev = rtl ? current < total - 1 : current > 0;
  const showNext = rtl ? current > 0 : current < total - 1;

  return (
    <div dir={rtl ? 'rtl' : undefined} style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Status bar */}
      <div style={{ height: 44, flex: '0 0 auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 16px 6px', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', fontVariantNumeric: 'tabular-nums' }}>
        <span>9:41</span>
        <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}><Icons.activity size={12} /><Icons.battery size={13} /></span>
      </div>

      {/* Slide viewport — clipped; slide content animates by changing key */}
      <div
        role="region"
        aria-label={`Slide ${current + 1} of ${total} — ${card.title}`}
        aria-live="polite"
        style={{ flex: 1, overflow: 'hidden', position: 'relative' }}
      >
        {/* Visible card */}
        <div
          key={current}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 28px',
            gap: 20,
            animation: 'none',
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 22,
              background: 'var(--surface-active)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Ic size={36} color="var(--fg)" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div ref={headingRef} tabIndex={-1} style={{ fontSize: 'var(--text-lg)', fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 8, outline: 'none' }}>{card.title}</div>
            <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.6 }}>{card.body}</div>
          </div>
        </div>

        {/* Prev / Next tap zones */}
        {showPrev && (
          <button
            onClick={rtl ? next : prev}
            aria-label="Previous slide"
            style={{ position: 'absolute', insetBlockStart: 0, insetBlockEnd: 0, insetInlineStart: 0, width: 48, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Icons.chevronLeft size={20} color="var(--fg-faint)" />
          </button>
        )}
        {showNext && (
          <button
            onClick={rtl ? prev : next}
            aria-label="Next slide"
            style={{ position: 'absolute', insetBlockStart: 0, insetBlockEnd: 0, insetInlineEnd: 0, width: 48, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Icons.chevronRight size={20} color="var(--fg-faint)" />
          </button>
        )}
      </div>

      {/* Controls — dots + CTA */}
      <div style={{ flex: '0 0 auto', padding: '0 20px 28px', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <Dots total={total} current={rtl ? total - 1 - current : current} onSelect={(i) => setCurrent(rtl ? total - 1 - i : i)} />
        <button
          onClick={() => {
            if (current < total - 1) {
              next();
            }
          }}
          style={{
            width: '100%',
            height: 46,
            borderRadius: 'var(--radius-lg)',
            background: current === total - 1 ? 'var(--accent)' : 'var(--surface-active)',
            color: current === total - 1 ? 'var(--ember-fg)' : 'var(--fg)',
            fontWeight: 600,
            fontSize: 'var(--text-sm)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {card.cta}
        </button>
        {current > 0 && (
          <button
            onClick={prev}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}

// ── Variants: auto-advance demo ───────────────────────────────────────────────────────────────
function AutoCarouselDemo() {
  const [current, setCurrent] = React.useState(0);
  const items = ['Uptime 99.97%', 'Deployments / week: 284', 'P99 latency: 38ms'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '24px', alignItems: 'center' }}>
      <span className="t-mono-label">Manual · tap the dots</span>
      <div style={{ width: '100%', maxWidth: 320, background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 20px 4px', minHeight: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 'var(--text-md)', fontWeight: 600, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{items[current]}</span>
        </div>
        <div style={{ paddingBottom: 8 }}>
          <Dots total={items.length} current={current} onSelect={setCurrent} />
        </div>
      </div>
      <span className="t-mono-label" style={{ marginBlockStart: 8 }}>Chevron-stepped (no swipe surface)</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0} style={{ width: 36, height: 36, borderRadius: 999, border: '1px solid var(--border)', background: 'none', cursor: current === 0 ? 'default' : 'pointer', display: 'grid', placeItems: 'center', opacity: current === 0 ? 0.3 : 1 }}>
          <Icons.chevronLeft size={16} color="var(--fg)" />
        </button>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', width: 48, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{current + 1} / {items.length}</span>
        <button onClick={() => setCurrent((c) => Math.min(items.length - 1, c + 1))} disabled={current === items.length - 1} style={{ width: 36, height: 36, borderRadius: 999, border: '1px solid var(--border)', background: 'none', cursor: current === items.length - 1 ? 'default' : 'pointer', display: 'grid', placeItems: 'center', opacity: current === items.length - 1 ? 0.3 : 1 }}>
          <Icons.chevronRight size={16} color="var(--fg)" />
        </button>
      </div>
    </div>
  );
}

// ── Page export ───────────────────────────────────────────────────────────────────────────────
export default function MobilePageController() {
  return (
    <Section
      id="page-controller"
      num="01"
      title="Page Controller"
      desc="A horizontally paged container for full-width slides — the UIPageViewController pattern. Shows a Page Indicator at the bottom. Designed for onboarding, carousels, and step-by-step flows."
    >
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>Pair with the Page Indicator to show position. Use the Page Controller for sequential, full-screen content — onboarding flows, tutorials, or media carousels. For lateral navigation between app sections, use Tab bar instead.</Lede>
      <Frame label="3-page onboarding carousel — tap the chevrons or dots to advance" center>
        <DeviceFrame initial="iphone-se"><PageControllerScreen /></DeviceFrame>
      </Frame>

      <SubHead meta="variants">Variants</SubHead>
      <Frame label="Manual dot navigation · Chevron-stepped (accessible without swipe)">
        <AutoCarouselDemo />
      </Frame>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 64px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 280 }} aria-hidden="true">
              {/* Simplified screen representation */}
              <div style={{ border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', background: 'var(--bg)' }}>
                {/* Slide area */}
                <div style={{ height: 140, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, borderBlockEnd: '1px solid var(--border)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--surface-active)', display: 'grid', placeItems: 'center' }}>
                    <Icons.rocket size={22} color="var(--fg)" />
                  </div>
                  <div style={{ textAlign: 'center', padding: '0 20px' }}>
                    <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>Ship faster</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 4, lineHeight: 1.45 }}>Push to main, Forge handles the rest.</div>
                  </div>
                </div>
                {/* Controls */}
                <div style={{ padding: '10px 16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                    {[true, false, false].map((a, i) => (
                      <span key={i} style={{ width: a ? 12 : 8, height: 8, borderRadius: 999, background: a ? 'var(--accent)' : 'var(--fg-faint)', display: 'block' }} />
                    ))}
                  </div>
                  <div style={{ height: 34, borderRadius: 8, background: 'var(--surface-active)', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 600, color: 'var(--fg)' }}>Next</div>
                </div>
              </div>
              {/* Annotation leads */}
              <span className="lead h" style={{ top: 26, left: -28, width: 24 }} />
              <span className="lead v" style={{ top: -26, left: '50%', height: 22, transform: 'translateX(-50%)' }} />
              <span className="lead h" style={{ top: 140, right: -28, width: 24 }} />
              <span className="lead v" style={{ bottom: -26, left: '50%', height: 22, transform: 'translateX(-50%)' }} />
              <div className="pin" style={{ top: 14, left: -52 }}>1</div>
              <div className="pin" style={{ top: -48, left: '50%', transform: 'translateX(-50%)' }}>2</div>
              <div className="pin" style={{ top: 128, right: -52 }}>3</div>
              <div className="pin" style={{ bottom: -48, left: '50%', transform: 'translateX(-50%)' }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Tap zones.</b> 48px-wide transparent chevron buttons at the leading and trailing edges — a fallback for users who cannot swipe.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Slide viewport.</b> Full-width, overflow hidden; only one slide is visible at a time. In RTL the first slide is at the trailing (right) edge.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Page Indicator.</b> Dots (or count badge) below the viewport; the active dot is ember. See the Page Indicator component for the full spec.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>CTA.</b> A full-width action button whose label changes on the last slide ("Get started"). The last slide turns it ember-filled.</span>
          </div>
        </div>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Swipe alternative</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The 48px tap zones at each edge let users advance without a swipe gesture. Keyboard users reach them via Tab; screen-reader users trigger them with the standard activate gesture.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader — page X of N</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The slide region has <Mono>role="region"</Mono> and an <Mono>aria-label</Mono> that updates on each transition: "Slide 2 of 3 — Stay safe". VoiceOver reads the new label automatically on focus change.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard &amp; focus</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}><Mono>Tab</Mono> reaches the prev / next tap zones and the CTA; <Mono>Enter</Mono> or <Mono>Space</Mono> activates the focused control. On a slide change, focus moves to the new slide heading so the change is announced immediately.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Touch target ≥ 44px</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Tap zones are 48px wide by full screen height, far above the 44px minimum. The CTA button is 46px tall. Dots are 44 × 44px tappable regions regardless of their 8px visual diameter.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — page 1 starts at the right; swipe direction inverts'} center>
        <DeviceFrame initial="iphone-se"><PageControllerScreen rtl /></DeviceFrame>
      </Frame>
      <Lede>Under <Mono>dir="rtl"</Mono> the first slide is at the <b style={{ color: 'var(--fg)' }}>trailing (right) edge</b> and users swipe right-to-left to advance — the same direction Arabic text reads. The tap-zone chevrons swap sides automatically via <Mono>insetInlineStart/End</Mono>. The dots row mirrors so the first dot is rightmost. No <Mono>scaleX(-1)</Mono> tricks needed.</Lede>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — sequential, full-screen flow</div>
          <div className="body" style={{ flexDirection: 'column', gap: 8, color: 'var(--fg-muted)', fontSize: 'var(--text-base)' }}>
            <span><Mono>1</Mono> — What Forge does</span>
            <span><Mono>2</Mono> — How it keeps you safe</span>
            <span><Mono>3</Mono> — Get started</span>
          </div>
          <div className="note">Use the Page Controller for ordered steps where each slide builds on the last — onboarding, tutorials, wizard flows.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — use for peer navigation</div>
          <div className="body" style={{ gap: 14, color: 'var(--fg-faint)', alignItems: 'center' }}>
            <Icons.home size={20} />
            <Icons.chevronRight size={14} />
            <Icons.server size={20} />
            <Icons.chevronRight size={14} />
            <Icons.bell size={20} />
          </div>
          <div className="note">For top-level app sections users switch between freely, use Tab bar — not a pager. Swiping past a home tab should never dismiss it.</div>
        </div>
      </div>

      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock
        label="page-controller"
        lang="tsx"
        code={`function PageController({ slides }: { slides: React.ReactNode[] }) {
  const [current, setCurrent] = React.useState(0);
  return (
    <div className="m-page-controller">
      {/* Slide viewport — overflow hidden */}
      <div
        role="region"
        aria-label={\`Slide \${current + 1} of \${slides.length}\`}
        className="m-page-viewport"
      >
        {slides[current]}
      </div>

      {/* Tap zones */}
      {current > 0 && (
        <button className="m-page-tap-prev" onClick={() => setCurrent(c => c - 1)}
          aria-label="Previous slide"><Icons.chevronLeft /></button>
      )}
      {current < slides.length - 1 && (
        <button className="m-page-tap-next" onClick={() => setCurrent(c => c + 1)}
          aria-label="Next slide"><Icons.chevronRight /></button>
      )}

      {/* Page Indicator — see Page Indicator component */}
      <PageIndicator total={slides.length} current={current} onSelect={setCurrent} />
    </div>
  );
}

/* .m-page-controller   — position: relative; display: flex; flex-direction: column;
   .m-page-viewport     — flex: 1; overflow: hidden;
   .m-page-tap-prev/next — position: absolute; inset-block: 0; width: 48px;
                           inset-inline-start/end: 0 (logical — flips in RTL) */`}
      />
    </Section>
  );
}
