'use client';
// Forge DS — Foundations / Brand (logo, mark, lockup, voice)
import { Icons, ForgeMark, Section, SubHead, Frame } from '@/ds/core';

// Wordmark — flame-and-sparkles mark + Geist 600. The mark now carries
// negative space around the central flame (the sparkles live in the
// corners of a 32-unit viewBox), so the icon multiplier is higher than
// before — 1.5× the wordmark text size — to keep the flame visually
// matched to the cap-height of "Forge".
const Wordmark = ({ size = 24, color = 'var(--ember)', textColor = 'currentColor', variant = 'solid', weight = 600 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.3, color: textColor }}>
    <ForgeMark size={size * 1.5} color={color} variant={variant} />
    <span style={{ fontSize: size, fontWeight: weight, letterSpacing: '-0.02em' }}>Forge</span>
  </div>
);

export default function Brand() {
  return (
    <Section id="brand" num="01" title="Brand" desc="The Forge identity — flame-and-sparkles mark, wordmark lockups, sizing, clear space, and engineer-tonal voice. One rule: the flame is the single saturated mark per surface.">
      <p style={{ color: 'var(--fg-muted)', maxWidth: '68ch', marginBottom: 22, lineHeight: 1.6 }}>
        Forge is a flame and the heat around it — four marks in one composition: a single ember flame at the centre and three sparkles hugging its edges (one large on the upper-right, two small same-size sparkles balancing the other corners). The mark ships in two states: solid for chrome, favicon, and product; outline for editorial, anatomy, and wireframe surfaces. The colour is ember; the silhouette is asymmetric on purpose — the large sparkle is the brand's "ignite" accent.
      </p>

      {/* Philosophy / posture cards */}
      <div className="ds-grid cols-3" style={{ marginBottom: 24 }}>
        {[
          ['Quiet', 'No gradients, no glow on chrome, no hero illustrations.'],
          ['Engineering tonal', 'p95, p99, GMUD, runbook. The vocabulary of operators, not marketers.'],
          ['One ember', 'A single ember flame per surface — the only colour that draws the eye.'],
        ].map(([t, d]) => (
          <div key={t} className="surface" style={{ padding: 16 }}>
            <div className="ds-h-eyebrow" style={{ marginBottom: 6 }}>{t}</div>
            <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.55 }}>{d}</div>
          </div>
        ))}
      </div>

      {/* Variants — the two canonical forms */}
      <SubHead meta="solid vs. outline">Variants</SubHead>
      <p style={{ marginTop: -6, marginBottom: 14, fontSize: 'var(--text-body)', color: 'var(--fg-muted)', maxWidth: '68ch', lineHeight: 1.6 }}>
        Two states, one silhouette. Solid is the production form — chrome, favicons, splashes. Outline is the editorial form — anatomy diagrams, spec sheets, wireframes, low-fidelity surfaces where ink should be quiet. Don't mix the two states on the same surface.
      </p>
      <Frame label="solid · outline · expressive — 88px" code={`<ForgeMark variant="solid"      size={88}/>
<ForgeMark variant="outline"    size={88}/>
<ForgeMark variant="expressive" size={88}/>`}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 48, padding: '4px 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <ForgeMark size={88} variant="solid" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-subtle)' }}>solid</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <ForgeMark size={88} variant="outline" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-subtle)' }}>outline</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <ForgeMark size={88} variant="expressive" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-subtle)' }}>expressive</span>
          </div>
        </div>
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' }}>
        Both variants share the same composition: one central flame and three sparkles (one large on the upper-right, two small same-size at the remaining corners). Solid fills the silhouette in ember; outline strokes both the flame and the sparkles. Don't mix the two states on the same surface.
      </p>

      {/* Lockups */}
      <SubHead meta="primary uses">Lockups</SubHead>
      <p style={{ marginTop: -6, marginBottom: 14, fontSize: 'var(--text-body)', color: 'var(--fg-muted)', maxWidth: '68ch', lineHeight: 1.6 }}>
        Four canonical surface treatments. Pick the one whose contrast matches the underlying surface — the mark should never have to fight to stay legible.
      </p>
      <div className="ds-grid cols-4">
        <div className="brand-tile dark"><div className="canvas"><Wordmark /></div><div className="label"><span>Dark / primary</span><span>#08090A</span></div></div>
        <div className="brand-tile light"><div className="canvas"><Wordmark /></div><div className="label"><span>Light</span><span>#FAFAFA</span></div></div>
        <div className="brand-tile ember"><div className="canvas"><Wordmark color="#08090A" textColor="#08090A" /></div><div className="label"><span>Ember surface</span><span>#FF6B35</span></div></div>
        <div className="brand-tile dark"><div className="canvas"><ForgeMark size={64} glow /></div><div className="label"><span>Mark only</span><span>favicon · loaders</span></div></div>
      </div>

      {/* Sizing scale */}
      <SubHead meta="scale">Sizing</SubHead>
      <p style={{ marginTop: -6, marginBottom: 14, fontSize: 'var(--text-body)', color: 'var(--fg-muted)', maxWidth: '68ch', lineHeight: 1.6 }}>
        Five canonical mark sizes for the solid form. Below 18px the small sparkles stop resolving as distinct shapes and the composition reads as a noisy blob — use a flame-only fallback at 16/14/12px (sidebar collapsed state, favicon emboss). Above 56px, only on splash and onboarding chrome.
      </p>
      <Frame label="mark sizes — 16 · 20 · 28 · 40 · 56" code={`<ForgeMark size={16}/>
<ForgeMark size={20}/>
<ForgeMark size={28}/>
<ForgeMark size={40}/>
<ForgeMark size={56}/>`}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28, padding: '8px 0' }}>
          {[16, 20, 28, 40, 56].map(s => (
            <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <ForgeMark size={s} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-subtle)' }}>{s}px</span>
            </div>
          ))}
        </div>
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' }}>
        Sidebar uses 22px. App-shell header uses 14px wordmark + 14px mark (flame-only fallback). Favicon is 16/32 emitted from the solid path — the right sparkle carries the brand even when the smalls fall out at 16px.
      </p>

      {/* Outline scale */}
      <SubHead meta="editorial scale">Outline scale</SubHead>
      <p style={{ marginTop: -6, marginBottom: 14, fontSize: 'var(--text-body)', color: 'var(--fg-muted)', maxWidth: '68ch', lineHeight: 1.6 }}>
        Outline is calibrated for editorial surfaces — anatomy panels, spec tables, wireframes. Minimum 24px: below that, the 1.4px stroke around the small sparkles collapses into dots.
      </p>
      <Frame label="outline sizes — 24 · 32 · 48 · 64" code={`<ForgeMark variant="outline" size={24}/>
<ForgeMark variant="outline" size={32}/>
<ForgeMark variant="outline" size={48}/>
<ForgeMark variant="outline" size={64}/>`}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28, padding: '8px 0' }}>
          {[24, 32, 48, 64].map(s => (
            <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <ForgeMark size={s} variant="outline" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-subtle)' }}>{s}px</span>
            </div>
          ))}
        </div>
      </Frame>

      {/* Wordmark scale */}
      <SubHead meta="wordmark">Wordmark scale</SubHead>
      <Frame label="wordmark sizes — 14 · 18 · 24 · 32" code={`<Wordmark size={14}/>
<Wordmark size={18}/>
<Wordmark size={24}/>
<Wordmark size={32}/>`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[14, 18, 24, 32].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <Wordmark size={s} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-subtle)' }}>{s}px Geist 600 / -0.02em</span>
            </div>
          ))}
        </div>
      </Frame>

      {/* Anatomy */}
      <SubHead meta="proportions">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Mark anatomy — outline form, 32×32 viewBox</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          {/* The mark is a fixed brand glyph that must NOT mirror; the
              callout figure is locked to dir="ltr" and positioned with
              logical insets, so the diagram is RTL-correct by construction
              rather than masked with aria-hidden. The numbered legend below
              carries the same content to the AT tree. */}
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <figure dir="ltr" className="stage" style={{ position: 'relative', inlineSize: 240, blockSize: 240, margin: 0 }} role="img" aria-label="Anatomy of the Forge mark: a central flame, one large upper-right sparkle, and two small sparkles. Annotated callouts 1–3 are detailed in the legend below.">
              <ForgeMark size={240} variant="outline" strokeWidth={1.0} />
              {/* Pin anchors mapped from the 32-unit viewBox onto the 240×240
                  rendered stage. Multiplier = 240/32 = 7.5 px per unit.
                  ① flame body centre (16, 17)         → (120, 127.5)
                  ② large top-right sparkle (25, 10)   → (187.5, 75)
                  ③ small sparkles — anchored to BR (24, 23.5)
                                                        → (180, 176.25)
                  Leader lines extend OUTWARD from each anchor to a pin
                  placed beyond the stage edge. Inset is logical (inline/block)
                  so the figure inherits any document writing-mode cleanly. */}
              {/* ① flame body — leader runs toward the inline-start edge */}
              <span className="lead h" style={{ insetBlockStart: 127, insetInlineStart: -36, inlineSize: 154 }} />
              <div className="pin" style={{ insetBlockStart: 116, insetInlineStart: -62 }}>1</div>
              {/* ② large top-right sparkle — leader runs toward the inline-end edge */}
              <span className="lead h" style={{ insetBlockStart: 75, insetInlineStart: 187, inlineSize: 85 }} />
              <div className="pin" style={{ insetBlockStart: 64, insetInlineStart: 276 }}>2</div>
              {/* ③ bottom-right small sparkle — leader runs toward the inline-end edge */}
              <span className="lead h" style={{ insetBlockStart: 176, insetInlineStart: 180, inlineSize: 92 }} />
              <div className="pin" style={{ insetBlockStart: 165, insetInlineStart: 276 }}>3</div>
            </figure>
          </div>
          <div className="ana-list" style={{ maxWidth: 620, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Central flame.</b> The Lucide Flame silhouette, placed at the geometric centre of a 32×32 viewBox via <code style={{ fontFamily: 'var(--font-mono)' }}>translate(5.8 7) scale(0.85)</code>. Body spans roughly x: 9.2 → 22.8, y: 8.7 → 25.7. The upper-left curl is the path's natural detail — that small swoosh is the flame "drawing breath" and must not be normalised out. The flame is the brand's anchor; nothing in the composition outweighs it.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Large top-right sparkle.</b> A 4-pointed sparkle centred at <code style={{ fontFamily: 'var(--font-mono)' }}>(25, 10)</code> with radius 3.0 — hugging the upper-right shoulder of the flame. This is the brand's "ignite" accent and roughly 1.9× the radius of the two smalls; the asymmetry is intentional. Never resize all three sparkles to equal radii — the imbalance is the brand.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Two small sparkles.</b> Same radius (1.6), anchored at <code style={{ fontFamily: 'var(--font-mono)' }}>(8, 10)</code> (top-left) and <code style={{ fontFamily: 'var(--font-mono)' }}>(24, 23.5)</code> (bottom-right). They hug the flame edges rather than sitting at the canvas corners — the composition reads as one tight cluster of fire, not a flame with floating decorations. The two smalls share size on purpose: they are the supporting heat, the large is the spark.</span>
          </div>
        </div>
      </div>

      {/* Clear space */}
      <SubHead meta="margin">Clear space</SubHead>
      <p style={{ marginTop: -6, marginBottom: 14, fontSize: 'var(--text-body)', color: 'var(--fg-muted)', maxWidth: '68ch', lineHeight: 1.6 }}>
        The minimum margin on every side equals one-third of the mark's height. Nothing else (text, button, divider, neighbour logo) crosses into that zone.
      </p>
      <Frame label="clear space = 0.33× mark height" code={`/* never crowd the mark within ~0.33× its height */`}>
        <div style={{ position: 'relative', display: 'inline-block', padding: 32 }}>
          <div style={{ position: 'absolute', inset: 24, border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-sm)', opacity: .7 }} />
          <ForgeMark size={56} />
        </div>
      </Frame>

      {/* Color rules */}
      <SubHead meta="color">Mark on coloured surfaces</SubHead>
      <Frame label="acceptable surfaces" code={`<ForgeMark/>                           // dark surface  — flame ember
<ForgeMark/>                           // light surface — flame ember
<ForgeMark color="#08090A"/>           // ember surface — flame ink
<ForgeMark color="currentColor"/>      // greyscale (legal / paper) — flame ink`}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          <div style={{ aspectRatio: '1', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ForgeMark size={48} />
          </div>
          <div style={{ aspectRatio: '1', background: '#FAFAFA', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ForgeMark size={48} />
          </div>
          <div style={{ aspectRatio: '1', background: '#FF6B35', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ForgeMark size={48} color="#08090A" />
          </div>
          <div style={{ aspectRatio: '1', background: '#FAFAFA', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#08090A' }}>
            <ForgeMark size={48} color="currentColor" />
          </div>
        </div>
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' }}>
        On an ember surface the flame inverts to ink so the silhouette still reads. On greyscale (paper, legal, embossed) the mark renders in <code style={{ fontFamily: 'var(--font-mono)' }}>currentColor</code> — same ink as the surrounding type. Two colours in any single composition, total.
      </p>

      {/* Co-branding */}
      <SubHead meta="partners">Co-branding</SubHead>
      <p style={{ marginTop: -6, marginBottom: 14, fontSize: 'var(--text-body)', color: 'var(--fg-muted)', maxWidth: '68ch', lineHeight: 1.6 }}>
        Partner logos sit on the trailing edge after a 1px hairline divider. The divider's height equals the partner mark's cap-height. Forge always leads.
      </p>
      <Frame label="forge × partner lockup" code={`<Wordmark/> · <PartnerMark/>`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Wordmark size={22} />
          <span style={{ display: 'inline-block', width: 1, height: 22, background: 'var(--border-strong)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--fg-muted)', letterSpacing: '.02em' }}>Vercel</span>
        </div>
      </Frame>

      {/* Accessibility & pairings */}
      <SubHead meta="a11y">Accessibility &amp; pairings</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The mark and wordmark are imagery, not controls — no focus stop of their own. When the wordmark is the home link in the app shell, the surrounding anchor owns the single Tab stop and activates on Enter.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Decorative marks render aria-hidden so they are skipped. When the mark is the logo at the top of the page, give the link an accessible name ("Forge home"); the wordmark already exposes the text "Forge" to the AT tree.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The sanctioned pairings hold the line: ember flame on dark (#08090A) and on light (#FAFAFA) both clear 3:1 non-text contrast, and on an ember surface the flame inverts to ink (#08090A) — never ember-on-ember. Legal/paper uses currentColor so the mark tracks surrounding ink.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The mark is static; the optional glow on loader/splash chrome is the only animation, and it inherits the global prefers-reduced-motion guard, so it stops for users who request reduced motion.</div>
        </div>
      </div>

      {/* Do/Don't */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — keep the flame ember</div>
          <div className="body"><Wordmark /></div>
          <div className="note">The ember flame is the brand's only saturated mark. Don't desaturate it, don't shift its hue, don't substitute the colour token.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — apply marketing gradients</div>
          <div className="body" style={{ background: 'linear-gradient(135deg,#FF6B35,#7DD3FC)' }}><Wordmark color="#fff" textColor="#fff" /></div>
          <div className="note">No gradients on the mark. The product is dark and quiet — the brand should be too.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — solid on chrome, outline in editorial</div>
          <div className="body" style={{ gap: 28 }}>
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 14 }}>
              <ForgeMark size={40} variant="solid" />
            </div>
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 14 }}>
              <ForgeMark size={40} variant="outline" />
            </div>
          </div>
          <div className="note">Solid for product chrome, favicons, splash. Outline for anatomy panels, spec tables, wireframes. Each variant has one home.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — mix variants on the same surface</div>
          <div className="body" style={{ gap: 10, padding: 16 }}>
            <ForgeMark size={32} variant="solid" />
            <ForgeMark size={32} variant="outline" />
            <ForgeMark size={32} variant="solid" />
          </div>
          <div className="note">Pick one variant per surface. A row of alternating solid / outline marks reads as a logo accident, not a system.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — minimum size 18px (solid) / 24px (outline)</div>
          <div className="body" style={{ gap: 24 }}>
            <ForgeMark size={56} /><ForgeMark size={32} /><ForgeMark size={20} />
          </div>
          <div className="note">At 18px the small sparkles still resolve. The outline form needs more room — the 1.4px stroke around the smalls demands 24px minimum.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — recolour the flame on chrome</div>
          <div className="body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--fg)' }}>
              <ForgeMark size={28} color="#7DD3FC" />
              <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, letterSpacing: '-0.02em' }}>Forge</span>
            </div>
          </div>
          <div className="note">The flame is always <code style={{ fontFamily: 'var(--font-mono)' }}>#FF6B35</code> on chrome. The only sanctioned swap is on ember surfaces — and there, the flame goes ink, not into a fashionable secondary.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — let the mark inherit currentColor in legal</div>
          <div className="body" style={{ gap: 28 }}>
            <div style={{ background: '#FAFAFA', borderRadius: 'var(--radius-xl)', padding: 14, color: '#08090A' }}>
              <ForgeMark size={40} color="currentColor" />
            </div>
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 14, color: 'var(--fg)' }}>
              <ForgeMark size={40} color="currentColor" />
            </div>
          </div>
          <div className="note">In legal, paper, and embossed contexts, pass <code style={{ fontFamily: 'var(--font-mono)' }}>color=&quot;currentColor&quot;</code> so the mark tracks the surrounding ink. Ember-on-paper is for marketing, not contracts.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — paint two colours into the mark</div>
          <div className="body">
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 14 }}>
              <svg width={48} height={48} viewBox="0 0 32 32" fill="none">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
                      transform="translate(5.8 7) scale(0.85)" fill="#FF6B35"/>
                <path d="M0 -6 C0.5 -2.2 2.2 -0.5 6 0 C2.2 0.5 0.5 2.2 0 6 C-0.5 2.2 -2.2 0.5 -6 0 C-2.2 -0.5 -0.5 -2.2 0 -6 Z" transform="translate(25 10) scale(0.5)" fill="#7DD3FC"/>
                <path d="M0 -6 C0.5 -2.2 2.2 -0.5 6 0 C2.2 0.5 0.5 2.2 0 6 C-0.5 2.2 -2.2 0.5 -6 0 C-2.2 -0.5 -0.5 -2.2 0 -6 Z" transform="translate(8 10) scale(0.2667)" fill="#7DD3FC"/>
                <path d="M0 -6 C0.5 -2.2 2.2 -0.5 6 0 C2.2 0.5 0.5 2.2 0 6 C-0.5 2.2 -2.2 0.5 -6 0 C-2.2 -0.5 -0.5 -2.2 0 -6 Z" transform="translate(24 23.5) scale(0.2667)" fill="#7DD3FC"/>
              </svg>
            </div>
          </div>
          <div className="note">Flame and sparkles share one paint — both ember on chrome, both ink on ember surfaces. No duotone flame-with-blue-sparkles. The expressive variant is the only place a second tone is sanctioned, and even there both tones are warm.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — pair with engineering vocabulary</div>
          <div className="body" style={{ flexDirection: 'column', gap: 8, alignItems: 'flex-start', padding: 16 }}>
            <Wordmark size={20} />
            <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', maxWidth: 280 }}>p95 latency dropped 18% after the cache warmer rollout.</div>
          </div>
          <div className="note">The wordmark sets a tonal expectation. The copy that follows should sound like a runbook, not a brochure.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — pair with marketing-speak</div>
          <div className="body" style={{ flexDirection: 'column', gap: 8, alignItems: 'flex-start', padding: 16 }}>
            <Wordmark size={20} />
            <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', maxWidth: 280 }}>✨ Unleash the magic of seamless deploys ✨</div>
          </div>
          <div className="note">No magic, no seamless, no exclamation marks. The wordmark and the copy speak the same language.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — respect clear space</div>
          <div className="body" style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 18, border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-sm)', opacity: .5 }} />
            <Wordmark />
          </div>
          <div className="note">Roughly 0.33× the mark height of clearance on every side. Nothing crosses into that zone.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — crowd the mark</div>
          <div className="body" style={{ gap: 4 }}>
            <Wordmark />
            <span className="pill warning">Beta</span>
            <span className="pill info">v2</span>
            <button className="btn xs ghost">→</button>
          </div>
          <div className="note">If the mark is in the room, it's the only thing in the room. Place pills, badges, and CTAs at least one row away.</div>
        </div>
      </div>

      {/* Voice */}
      <SubHead meta="copy">Voice</SubHead>
      <p style={{ marginTop: -6, marginBottom: 14, fontSize: 'var(--text-body)', color: 'var(--fg-muted)', maxWidth: '68ch', lineHeight: 1.6 }}>
        The brand voice is in the smallest details — error messages, helper text, button labels. Six rules govern every word that ships.
      </p>
      <div className="ds-grid cols-3">
        {[
          ['Direct', 'We say what changed and what to do next. No filler, no exclamation.', 'Build failed in 1m24s. Fix the type error in api.ts:42.'],
          ['Engineer-tonal', 'We speak engineer. p95, GMUD, T1, runbook — not "experience" or "magic".', 'p95 latency: 142ms (within SLO).'],
          ['pt-BR first', 'Surface labels are pt-BR; tokens, identifiers, and code stay English.', 'Implantar agora · Cancelar'],
          ['Specific over generic', '"Delete forge-api?" beats "Delete this item?". Always name the noun.', 'Delete forge-api and 12 deploys?'],
          ['Cause + remedy', 'When something breaks, name the cause and what to do.', 'Token expired. Sign in to refresh.'],
          ['No marketing-speak', 'No "unlock", "magic", "seamless", "world-class", "powerful".', 'Caches reset · 4.2s.'],
        ].map(([t, d, e]) => (
          <div key={t} className="surface" style={{ padding: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 'var(--text-md)' }}>{t}</div>
            <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.55, marginBottom: 10 }}>{d}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ember)', borderTop: '1px solid var(--border)', paddingTop: 10, lineHeight: 1.5 }}>{e}</div>
          </div>
        ))}
      </div>

      {/* Voice in the wild — paired examples */}
      <SubHead meta="copy in the wild">Same situation, two voices</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — name the noun</div>
          <div className="body" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: 16, gap: 8 }}>
            <div style={{ fontWeight: 600, fontSize: 'var(--text-md)' }}>Delete forge-api?</div>
            <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>4 runbooks and 12 deploys will also be removed. There is no undo.</div>
          </div>
          <div className="note">Specific subject + specific consequence.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — generic copy</div>
          <div className="body" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: 16, gap: 8 }}>
            <div style={{ fontWeight: 600, fontSize: 'var(--text-md)' }}>Are you sure?</div>
            <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>This action cannot be undone. Continue?</div>
          </div>
          <div className="note">"Are you sure?" is the default that everyone ignores. Lead with the verb and the noun.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — actionable error</div>
          <div className="body" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: 16, gap: 8 }}>
            <div style={{ fontWeight: 600, fontSize: 'var(--text-md)', color: 'var(--danger)' }}>Token expired</div>
            <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>Sign in to refresh. Your work is saved locally.</div>
          </div>
          <div className="note">Cause, remedy, reassurance — in that order.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — blame the user</div>
          <div className="body" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: 16, gap: 8 }}>
            <div style={{ fontWeight: 600, fontSize: 'var(--text-md)', color: 'var(--danger)' }}>Authentication error</div>
            <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>Something went wrong. Please try again.</div>
          </div>
          <div className="note">Vague error + impotent advice. The user has no idea what to do next.</div>
        </div>
      </div>

      {/* Asset map */}
      <SubHead meta="resources">Where the assets live</SubHead>
      <div className="ds-grid cols-3">
        {[
          ['<ForgeMark/>', 'icons.jsx', 'The canonical SVG — Lucide Flame + three sparkles (1 large, 2 small) in a 32×32 viewBox. Pass size, variant ("solid" | "outline" | "expressive"), color, strokeWidth, glow.'],
          ['<Wordmark/>', 'this page', 'Mark + Geist 600. `color` paints the flame; `textColor` paints the text (defaults to currentColor).'],
          ['favicon-16/32', '/public/favicon.ico', 'Mark-only, solid variant. Auto-generated from the SVG.'],
        ].map(([k, where, d]) => (
          <div key={k} className="surface" style={{ padding: 16 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', color: 'var(--ember)', marginBottom: 4 }}>{k}</div>
            <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-subtle)', marginBottom: 8 }}>{where}</div>
            <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.55 }}>{d}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}
