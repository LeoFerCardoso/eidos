'use client';
// Eidos Mobile — Foundations / Layout. Safe areas, side margins, vertical rhythm, targets.
import { Section, SubHead, Frame, CodeBlock, SpecRow, DeviceFrame, Icons, Lede, Mono } from '@/ds/core';

const guide = { position: 'absolute', insetBlock: 0, width: 1, background: 'var(--ember)', opacity: 0.4, pointerEvents: 'none' } as const;
const band = (label: string) => ({ background: 'var(--ember-soft)', borderBlock: '1px dashed color-mix(in srgb, var(--ember) 40%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ember)', letterSpacing: '0.04em' } as const);

function LayoutScreen() {
  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* side-margin guides (decorative — skipped by AT) */}
      <span aria-hidden="true" style={{ ...guide, insetInlineStart: 16 }} />
      <span aria-hidden="true" style={{ ...guide, insetInlineEnd: 16 }} />
      {/* top safe area */}
      <div style={{ ...band('safe-top'), height: 50, flex: '0 0 auto' }}>status bar · 50</div>
      <div style={{ flex: 1, paddingInline: 16, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ height: 16 }} />
        <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.03em' }}>Title</div>
        <div style={{ height: 20 }} />
        <div className="surface" style={{ padding: 16, boxShadow: 'var(--elev-1)', fontSize: 14, color: 'var(--fg-muted)' }}>Content sits inside 16px side margins.</div>
        <div style={{ height: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-faint)' }}>gap 12</span></div>
        <div className="surface" style={{ padding: 16, boxShadow: 'var(--elev-1)', fontSize: 14, color: 'var(--fg-muted)' }}>Cards stack with a 12px gap.</div>
        <div style={{ flex: 1 }} />
      </div>
      {/* bottom safe area / home indicator */}
      <div style={{ ...band('safe-bottom'), height: 34, flex: '0 0 auto' }}>home indicator · 34</div>
    </div>
  );
}

export default function MobileLayout() {
  return (
    <Section id="layout" num="01" title="Layout"
      desc="Every screen is a safe-area-aware vertical column — status-bar inset at top, home-indicator inset at bottom, content between them in 16px side margins.">

      <SubHead meta="anatomy">Safe areas & margins</SubHead>
      <Lede>Navigation and primary actions anchor to the bottom, within thumb reach. Never paint content under the Dynamic Island or the home indicator.</Lede>
      <Frame label="ember guides = 16px side margins · soft bands = safe-area insets" center>
        <DeviceFrame initial="iphone-15-pro"><LayoutScreen /></DeviceFrame>
      </Frame>
      <p className="ds-caption">Respect the insets — never paint content under the Dynamic Island or the home indicator. The DeviceFrame reserves both; your content lives in the column between them.</p>

      <SubHead meta="the numbers">Metrics</SubHead>
      <table className="spec">
        <thead><tr><th>Metric</th><th>Value</th><th>Use</th></tr></thead>
        <tbody>
          <SpecRow token="Side margin" value="16px" usage="Content inset on both edges; 20px under a Large title header." />
          <SpecRow token="Card gap" value="12px" usage="Vertical gap between stacked cards." />
          <SpecRow token="Section gap" value="20–24px" usage="Between a section head and the next block." />
          <SpecRow token="Touch target" value="≥ 44×44px" usage="Every tappable element; pad small glyphs out to it." />
          <SpecRow token="Status-bar inset" value="50px" usage="Top safe area (notch / Dynamic Island)." />
          <SpecRow token="Home-indicator inset" value="34px" usage="Bottom safe area; tab bars add their height above it." />
        </tbody>
      </table>

      <SubHead meta="rules">Principles</SubHead>
      <div className="ds-grid cols-3">
        {[
          [Icons.smartphone, 'Bottom-anchored', 'Tab bars, sheets and primary buttons sit at the bottom — within thumb reach, never a top toolbar.'],
          [Icons.layers, 'One scroll', 'A screen is a single vertical scroll. Sticky the header / tab bar; let the content slide under it.'],
          [Icons.maximize, 'Edge-to-edge, inset-aware', 'Backgrounds and media may bleed to the edges; text and controls stay inside the 16px margins and safe areas.'],
        ].map(([Ic, t, d]) => {
          const I = Ic as any;
          return (
            <div key={t as string} className="surface" style={{ padding: 18 }}>
              <I size={18} color="var(--ember)" />
              <div style={{ fontWeight: 600, marginBlock: '8px 6px' }}>{t as string}</div>
              <div className="t-small" style={{ color: 'var(--fg-muted)' }}>{d as string}</div>
            </div>
          );
        })}
      </div>

      <SubHead meta="a11y">Accessibility &amp; pairings</SubHead>
      <Lede>The layout is the accessibility contract for every screen above it: it reserves the safe insets, guarantees a touch floor inside the side margins, and treats the column guides as decoration. Three guarantees hold on every handset in the family.</Lede>
      <div className="ds-grid cols-3">
        {[
          ['≥ 44×44px touch floor', 'Tappable controls pad out to at least 44 × 44px inside the 16px side margins — a small glyph never shrinks to its own bounds. The bottom-anchored row keeps primary actions within thumb reach, above the 34px home-indicator inset.'],
          ['Safe areas & contrast', 'Content never paints under the Dynamic Island or the home indicator: the 50px top and 34px bottom insets are reserved, so text and controls clear the notch and keep their AA contrast against the surface. Backgrounds may bleed edge-to-edge; legible content may not.'],
          ['Reduced motion on reflow', 'When the column reflows — rotation, a sheet opening, Dynamic Type bumping the title to two lines — blocks re-snap to their new positions instantly under prefers-reduced-motion, with no slide or cross-fade. Animated layout shifts can trigger vestibular discomfort.'],
        ].map(([t, d]) => (
          <div key={t} className="surface" style={{ padding: 18 }}>
            <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>{t}</div>
            <div className="t-small" style={{ color: 'var(--fg-muted)' }}>{d}</div>
          </div>
        ))}
      </div>
      <table className="spec" style={{ marginBlockStart: 18 }}>
        <thead><tr><th>Inset / target</th><th>Reserved</th><th>Contrast</th><th>Reduced motion</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>Status-bar inset</td><td className="mono">50px</td><td className="mono">— reserved</td><td className="mono">no reflow</td><td><span className="chip ok">PASS</span></td></tr>
          <tr><td>Home-indicator inset</td><td className="mono">34px</td><td className="mono">— reserved</td><td className="mono">no reflow</td><td><span className="chip ok">PASS</span></td></tr>
          <tr><td>Touch target</td><td className="mono">≥ 44×44px</td><td className="mono">AA on surface</td><td className="mono">instant snap</td><td><span className="chip ok">PASS</span></td></tr>
          <tr><td>Column guide</td><td className="mono">1px ember</td><td className="mono">— decorative</td><td className="mono">aria-hidden</td><td><span className="chip ok">PASS</span></td></tr>
        </tbody>
      </table>
      <p className="t-small" style={{ color: 'var(--fg-muted)', marginBlockStart: 12, lineHeight: 1.6, maxWidth: '64ch' }}>
        The grid sets the layout, not the hit area — a control inside the margins still pads out to <Mono>44 × 44px</Mono> with <Mono>min-block-size</Mono>. The ember side-margin guides carry <Mono>aria-hidden</Mono> and clear no contrast requirement: they are a design aid, not content, so assistive tech and keyboard focus skip them and read only the blocks snapped onto the column.
      </p>

      <SubHead meta="reference">Screen scaffold</SubHead>
      <CodeBlock label="safe-area column" lang="tsx" code={`<main className="m-screen">          {/* fills the device, flex column */}
  <StatusBar />                       {/* 50px top inset */}
  <header className="m-screen-head">  {/* 20px padding under the title */}
    <h1 className="m-large-title">Board</h1>
  </header>
  <div className="m-screen-body">…</div> {/* 16px side margins, scrolls */}
  <TabBar />                          {/* sits above the 34px home indicator */}
</main>`} />
    </Section>
  );
}
