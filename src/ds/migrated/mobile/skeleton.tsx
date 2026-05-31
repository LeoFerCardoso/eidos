'use client';
// Eidos Mobile — Skeleton. Grey placeholders shaped like the content that's loading, with a
// soft shimmer. They hold the layout so nothing jumps when data lands, and they preview the
// real structure — never a generic spinner over a blank screen. Show them only past ~300ms.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono } from '@/ds/core';

function Skel({ w, h, r = 6, style }: { w?: number | string; h: number; r?: number; style?: React.CSSProperties }) {
  return <span className="m-skel" style={{ display: 'block', width: w ?? '100%', height: h, borderRadius: r, ...style }} aria-hidden="true" />;
}

function SkeletonRow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBlockEnd: '1px solid var(--border)' }}>
      <Skel w={40} h={40} r={999} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Skel w="58%" h={11} />
        <Skel w="34%" h={9} />
      </div>
      <Skel w={48} h={22} r={999} />
    </div>
  );
}

function SkeletonScreen({ loading }: { loading: boolean }) {
  return (
    <div
      role="status"
      aria-busy={loading}
      aria-live="polite"
      aria-label={loading ? 'Loading services' : 'Services loaded'}
      style={{ padding: '58px 18px 0', height: '100%' }}
    >
      <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBlockEnd: 8 }}>Services</div>
      {/* Visually hidden status text — the only thing a screen reader announces while the bars shimmer */}
      <span className="sr-only">{loading ? 'Loading services…' : '5 services loaded'}</span>
      {loading
        ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
        : ['payments-api', 'identity-svc', 'search-index', 'billing-worker', 'edge-gateway'].map((name, i) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBlockEnd: '1px solid var(--border)' }}>
              <span style={{ display: 'grid', placeItems: 'center', width: 40, height: 40, borderRadius: 999, background: 'var(--surface-active)' }}><Icons.server size={17} /></span>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{name}</div><div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>{i === 0 ? 'deploying' : 'healthy'}</div></div>
              <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 'var(--text-xs)', fontWeight: 600, fontVariantNumeric: 'tabular-nums', background: 'var(--success-soft)', color: 'var(--success-strong, var(--success))' }}>OK</span>
            </div>
          ))}
    </div>
  );
}

function SkeletonDemo() {
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const t = setInterval(() => setLoading((l) => !l), 2200);
    return () => clearInterval(t);
  }, []);
  return <SkeletonScreen loading={loading} />;
}

export default function MobileSkeleton() {
  return (
    <Section
      id="skeleton"
      num="01"
      title="Skeleton"
      desc="Placeholders shaped like the content arriving — avatar circle, text lines, status pill — with a quiet shimmer. Reserves the exact layout so the screen does not reflow on data arrival."
    >
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>Use for first loads past ~300 ms; under that threshold show nothing. Skeleton previews real structure instead of a blank spinner, so the user knows what is coming.</Lede>
      <Frame label="Skeleton rows swap to real data on a loop · the layout never jumps" center>
        <DeviceFrame initial="iphone-se"><SkeletonDemo /></DeviceFrame>
      </Frame>

      <SubHead meta="variants">Shapes</SubHead>
      <Frame label="Lines, blocks, circles and pills — the same primitives that build a row">
        <div style={{ maxWidth: 320, margin: '0 auto', padding: '8px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Skel w={44} h={44} r={999} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}><Skel w="60%" h={11} /><Skel w="40%" h={9} /></div>
          </div>
          <Skel h={88} r={12} />
          <div style={{ display: 'flex', gap: 8 }}><Skel w={64} h={24} r={999} /><Skel w={80} h={24} r={999} /><Skel w={56} h={24} r={999} /></div>
        </div>
      </Frame>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '60px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 300 }} aria-hidden="true">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Skel w={44} h={44} r={999} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}><Skel w="62%" h={12} /><Skel w="38%" h={9} /></div>
                <Skel w={48} h={22} r={999} />
              </div>
              <span className="lead h" style={{ top: 18, left: -28, width: 24 }} />
              <span className="lead v" style={{ top: -24, left: '38%', height: 18 }} />
              <span className="lead h" style={{ top: 10, right: -28, width: 24 }} />
              <div className="pin" style={{ top: 10, left: -52 }}>1</div>
              <div className="pin" style={{ top: -46, left: '38%', transform: 'translateX(-50%)' }}>2</div>
              <div className="pin" style={{ top: 2, right: -52 }}>3</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Shape match.</b> Each placeholder mirrors a real element — a circle for the avatar, a pill for the badge — at the same size, so nothing shifts on load.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Text lines.</b> Two muted bars at title and caption heights; the second is shorter, like real metadata, not full-width.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Shimmer.</b> A slow <Mono>--fg</Mono>-tinted sweep over <Mono>--surface-active</Mono> signals "loading", not "empty". No ember in the fill itself.</span>
          </div>
        </div>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <Lede up>A skeleton is never focusable — there are no keyboard interactions to map. Its whole accessibility job is to <b style={{ color: 'var(--fg)' }}>announce the loading state once</b> and stay quiet otherwise. The live demo above ships exactly the contract described below.</Lede>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Region role &amp; attributes</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The container is <code style={{ fontFamily: 'var(--font-mono)' }}>role="status"</code> with <code style={{ fontFamily: 'var(--font-mono)' }}>aria-busy="true"</code> and an <code style={{ fontFamily: 'var(--font-mono)' }}>aria-label</code> of "Loading services"; every placeholder is <code style={{ fontFamily: 'var(--font-mono)' }}>aria-hidden</code>. So the screen reader announces "Loading services", not a stream of empty shapes.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>One polite announcement</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>An <code style={{ fontFamily: 'var(--font-mono)' }}>aria-live="polite"</code> region carries a single visually-hidden message ("Loading services…" → "5 services loaded"). It waits for a pause, so it never interrupts the user mid-sentence.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Contrast</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Placeholders are decorative, so they are exempt from text contrast. The shimmer is a low-contrast <code style={{ fontFamily: 'var(--font-mono)' }}>--fg</code> sweep — deliberately subtle, never a flash that could trigger photosensitivity.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Reduced motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Under <code style={{ fontFamily: 'var(--font-mono)' }}>prefers-reduced-motion</code> the shimmer stops and the blocks rest as a static grey — still unmistakably a loading state, with no animation.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>No layout shift</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Because the skeleton occupies the real dimensions, content replaces it in place — no jump that could move a tap target out from under a thumb.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Threshold</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Show skeletons only when a load is likely to exceed ~300ms; flashing them for instant responses is more jarring than a brief blank.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — the avatar circle moves to the right and the text bars right-align'} center code={`<div dir="rtl">
  {/* logical layout handles the mirror; nothing to flip */}
  <SkeletonRow />
</div>`} lang="tsx">
        <div dir="rtl" style={{ maxWidth: 320, margin: '0 auto', padding: '8px 16px' }}>
          <SkeletonRow />
          <SkeletonRow />
        </div>
      </Frame>
      <Lede>Because the row is laid out with flex and logical spacing, the avatar circle simply moves to the <b style={{ color: 'var(--fg)' }}>start (now the right)</b> and the two text bars right-align — no explicit mirror is needed. The shimmer sweep follows the writing direction, so no <Mono>scaleX(-1)</Mono> is applied.</Lede>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — mirror the real layout</div>
          <div className="body" style={{ flexDirection: 'column', alignItems: 'stretch' }}><SkeletonRow /></div>
          <div className="note">Same avatar, two lines, trailing pill — the row that's loading, previewed at its true size.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — a centered spinner on a blank page</div>
          <div className="body" style={{ justifyContent: 'center', minHeight: 70 }}>
            <svg className="ds-spin" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--fg-faint)" strokeWidth="2"><circle cx="12" cy="12" r="9" strokeDasharray="40" strokeLinecap="round" /></svg>
          </div>
          <div className="note">A lone spinner hides the layout, so the page jolts when content lands. Preview the structure instead.</div>
        </div>
      </div>

      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock
        label="skeleton"
        lang="tsx"
        code={`<div role="status" aria-busy={loading} aria-live="polite"
     aria-label={loading ? 'Loading services' : 'Services loaded'}>
  <span className="sr-only">
    {loading ? 'Loading services…' : \`\${services.length} services loaded\`}
  </span>
  {loading
    ? rows.map((_, i) => <SkeletonRow key={i} />)   /* each bar is aria-hidden */
    : services.map(s => <Row key={s.id} {...s} />)}
</div>

/* .m-skel = var(--surface-active) block with a ::after shimmer sweep
   (var(--fg) at 8%). Each placeholder matches a real element's size.
   shimmer halts under prefers-reduced-motion. */`}
      />
    </Section>
  );
}
