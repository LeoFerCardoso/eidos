'use client';
// Forge Mobile — Foundations / Typography. The mobile type scale: larger than the desktop
// docs because a handset is read at arm's length and tapped, not pointed at.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, StatusBar, Icons, Lede, Mono } from '@/ds/core';

type Row = { name: string; use: string; size: number; weight: number; ls: string; lh: number; mono?: boolean };
const SCALE: Row[] = [
  { name: 'Large title', use: 'Screen title — one per screen', size: 30, weight: 700, ls: '-0.03em', lh: 1.1 },
  { name: 'Title', use: 'Card headline, sheet title', size: 22, weight: 700, ls: '-0.02em', lh: 1.15 },
  { name: 'Headline', use: 'Section head, list-group label', size: 19, weight: 600, ls: '-0.01em', lh: 1.25 },
  { name: 'Body', use: 'Primary reading text', size: 16, weight: 400, ls: '0', lh: 1.5 },
  { name: 'Callout', use: 'Emphasised row, secondary action', size: 15, weight: 500, ls: '0', lh: 1.45 },
  { name: 'Subhead', use: 'Supporting copy under a title', size: 14, weight: 400, ls: '0', lh: 1.45 },
  { name: 'Footnote', use: 'Timestamps, metadata', size: 13, weight: 500, ls: '0.02em', lh: 1.4, mono: true },
  { name: 'Caption', use: 'Pills, eyebrows, tab labels', size: 12, weight: 600, ls: '0.04em', lh: 1.3, mono: true },
];

// Drive the in-practice demo straight off the scale so the composition is the spec,
// not a re-typed copy — and so no literal off-scale font-size appears in the source.
const BY_NAME: Record<string, Row> = Object.fromEntries(SCALE.map((r) => [r.name, r]));
function roleStyle(name: string, extra?: React.CSSProperties): React.CSSProperties {
  const r = BY_NAME[name];
  return {
    fontFamily: r.mono ? 'var(--font-mono)' : 'var(--font-sans)',
    fontSize: r.size,
    fontWeight: r.weight,
    letterSpacing: r.ls,
    lineHeight: r.lh,
    color: 'var(--fg)',
    ...extra,
  };
}

export default function MobileTypography() {
  return (
    <Section id="typography" num="01" title="Typography"
      desc="A larger scale than desktop — handsets are read at arm's length. Body at 16px, screen titles at 30px. Geist Sans for UI; Geist Mono only for metadata, pills, and eyebrows.">

      <SubHead meta="8 roles">Type scale</SubHead>
      <Lede>Eight roles cover every surface: one Large Title per screen, Title for card and sheet heads, Body for reading text, and Footnote/Caption in Geist Mono for tabular metadata.</Lede>
      <Frame label="role · specimen · spec">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {SCALE.map((r, i) => (
            <div key={r.name} style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 20, alignItems: 'baseline', padding: '16px 4px', borderBottom: i < SCALE.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span className="t-mono-label" style={{ padding: 0 }}>{r.name}</span>
              <span style={{ fontFamily: r.mono ? 'var(--font-mono)' : 'var(--font-sans)', fontSize: r.size, fontWeight: r.weight, letterSpacing: r.ls, lineHeight: r.lh, color: 'var(--fg)', minWidth: 0 }}>
                {r.mono ? 'p95 · 9:41 · v4.18' : 'Build Forge products'}
              </span>
              <span className="t-mono" style={{ color: 'var(--fg-subtle)', fontSize: 'var(--text-base)', whiteSpace: 'nowrap' }}>{r.size} / {r.weight} / {r.ls}</span>
            </div>
          ))}
        </div>
      </Frame>
      <p className="ds-caption">Steps are deliberately few — eight roles cover every handset surface. Don't add sizes between them; reach for weight or colour (<Mono>--fg-muted</Mono> / <Mono>--fg-subtle</Mono>) to differentiate instead.</p>

      <SubHead meta="applied">In practice</SubHead>
      <Lede>The roles read as one hierarchy on a real screen, not a swatch list. This incident detail composes Large title, Title, Headline, Body, Callout, Subhead, Footnote and Caption together — each style driven straight off the scale above, so the demo is the spec.</Lede>
      <Frame label="incident detail — eight roles composed" center>
        <DeviceFrame maxHeight={560}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)', overflow: 'auto' }}>
            <StatusBar platform="ios" />
            {/* top nav — back affordance + Caption tab label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderBlockEnd: '1px solid var(--border)' }}>
              <Icons.chevronLeft size={20} color="var(--ember)" />
              <span style={{ ...roleStyle('Caption'), textTransform: 'uppercase', color: 'var(--fg-muted)' }}>Incidents</span>
            </div>
            <div style={{ padding: '18px 18px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Large title — one per screen */}
              <div style={roleStyle('Large title')}>Checkout latency</div>
              {/* Footnote (mono metadata) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--danger)', flex: '0 0 auto' }} />
                <span style={{ ...roleStyle('Footnote'), color: 'var(--fg-muted)' }}>SEV-2 · opened 9:41 · v4.18</span>
              </div>
              <div className="surface" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {/* Title — card headline */}
                <div style={roleStyle('Title')}>p95 response time</div>
                {/* Subhead — supporting copy */}
                <div style={{ ...roleStyle('Subhead'), color: 'var(--fg-muted)' }}>Edge gateway, last 15 minutes.</div>
                {/* Callout — emphasised metric, mono numeral */}
                <div style={roleStyle('Callout')}>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>1,840 ms</span> — above the 800 ms SLO.
                </div>
              </div>
              {/* Headline — section head */}
              <div style={roleStyle('Headline')}>Summary</div>
              {/* Body — primary reading text, never below 16 */}
              <div style={roleStyle('Body')}>
                A deploy at 09:32 added a synchronous call to the pricing service on the checkout path. Latency climbed past the SLO within three minutes and paging fired.
              </div>
            </div>
          </div>
        </DeviceFrame>
      </Frame>
      <p className="ds-caption">Hierarchy comes from the <Mono>step</Mono> between roles, not from cramming a half-dozen near sizes. One Large title, one ember signal, mono only on the metadata strip and the metric.</p>

      <SubHead meta="rules">Principles</SubHead>
      <div className="ds-grid cols-3">
        {[
          ['Body at 16px', 'Never drop reading text below 16px on a handset — smaller text forces zoom and fails legibility at arm\'s length.'],
          ['One title per screen', 'A single Large title anchors the screen; everything else is Headline or smaller. Two large titles compete.'],
          ['Mono for data', 'Geist Mono carries timestamps, metrics, IDs and pills — tabular, scannable. Prose stays Geist Sans.'],
        ].map(([t, d]) => (
          <div key={t} className="surface" style={{ padding: 18 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{t}</div>
            <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>{d}</div>
          </div>
        ))}
      </div>

      <SubHead meta="a11y">Accessibility &amp; pairings</SubHead>
      <Lede>Mobile type carries the heaviest legibility burden in the family — read at arm's length, in sunlight, by users who scale text up. Three guarantees: it scales with the OS, it never drops below 16px for reading, and every role clears contrast on the surface it sits on.</Lede>
      <div className="ds-grid cols-3">
        {[
          ['Respect Dynamic Type', 'Define roles in relative units that track the OS text-size setting (iOS Dynamic Type / Android font scale) — never lock a px size that ignores a user who scaled to 200%. Lay out with flow and wrapping, not fixed heights, so a larger setting reflows instead of clipping.'],
          ['16px floor for reading', 'Body stays at 16px and up; rows reflow rather than shrink. Below 16 forces pinch-zoom and fails at arm’s length — the whole reason the mobile scale runs larger than desktop.'],
          ['Tap target ≥ 44px', 'Type label size is independent of the touch target: a 13px Footnote link still needs a ≥ 44 × 44px hit area. Pad the control, don’t shrink the target to the glyph.'],
        ].map(([t, d]) => (
          <div key={t} className="surface" style={{ padding: 18 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{t}</div>
            <div className="t-small" style={{ color: 'var(--fg-muted)' }}>{d}</div>
          </div>
        ))}
      </div>
      <table className="spec" style={{ marginBlockStart: 18 }}>
        <thead><tr><th>Role</th><th>Foreground</th><th>On surface</th><th>Min ratio</th><th>WCAG</th></tr></thead>
        <tbody>
          <tr><td>Large title / Title</td><td className="tok-name">--fg</td><td className="mono">--bg</td><td className="mono">17.8 : 1</td><td><span className="chip ok">AAA</span></td></tr>
          <tr><td>Body</td><td className="tok-name">--fg</td><td className="mono">--surface</td><td className="mono">14.6 : 1</td><td><span className="chip ok">AAA</span></td></tr>
          <tr><td>Subhead / Footnote</td><td className="tok-name">--fg-muted</td><td className="mono">--bg</td><td className="mono">7.2 : 1</td><td><span className="chip ok">AAA</span></td></tr>
          <tr><td>Caption</td><td className="tok-name">--fg-subtle</td><td className="mono">--bg</td><td className="mono">4.8 : 1</td><td><span className="chip ok">AA</span></td></tr>
          <tr><td>Callout metric</td><td className="tok-name">--ember</td><td className="mono">--bg</td><td className="mono">5.1 : 1</td><td><span className="chip ok">AA</span></td></tr>
        </tbody>
      </table>
      <p className="t-small" style={{ color: 'var(--fg-muted)', marginBlockStart: 12, lineHeight: 1.6, maxWidth: '64ch' }}>
        Caption sits at the small-text floor — keep it at <Mono>--fg-subtle</Mono> or darker, never <Mono>--fg-faint</Mono>, which only clears large-text contrast. Switch the theme via the topbar pill to verify every pairing holds under light.
      </p>

      <SubHead meta="reference">Tokens</SubHead>
      <CodeBlock label="mobile type roles" lang="css" code={`/* Mobile roles map onto the core --text-* scale + weight. */
.m-large-title { font-size: 30px; font-weight: 700; letter-spacing: -0.03em; line-height: 1.1; }
.m-title       { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; }
.m-headline    { font-size: 19px; font-weight: 600; }
.m-body        { font-size: 16px; line-height: 1.5; }       /* never below 16 */
.m-callout     { font-size: 15px; font-weight: 500; }
.m-subhead     { font-size: 14px; color: var(--fg-muted); }
.m-footnote    { font-size: 13px; font-family: var(--font-mono); }
.m-caption     { font-size: 12px; font-weight: 600; font-family: var(--font-mono); }`} />
    </Section>
  );
}
