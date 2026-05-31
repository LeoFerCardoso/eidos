'use client';
import { Section, SubHead, Frame, PropsTable, Icons, Mono, Lede } from '@/ds/core';


export default function NoiseGrainPage() {
  return (
    <Section
      id="pat-noise-grain"
      num="06"
      title="Noise grain"
      desc="A subtle film-grain texture, rendered as an inline SVG turbulence. Knocks down the 'screen' feel of flat surfaces; pairs well with mesh gradients. Auto-inverts on light theme."
    >
      <SubHead meta="default · 0.85 opacity">Default grain</SubHead>
      <Lede up>The default tile sits at <Mono>opacity: 0.85</Mono> with <Mono>mix-blend-mode: screen</Mono> in dark theme — bright enough to grit the surface, never enough to fight the content layered above it.</Lede>
      <Frame label=".pat-noise — wraps a child surface">
        <div className="pat-noise pat-mesh pat-demo is-tall">
          <div style={{position:'relative', background:'var(--surface)', padding:'12px 18px', borderRadius: 'var(--radius-xl)', border:'1px solid var(--border)', fontFamily:'var(--font-mono)', fontSize: 'var(--text-sm)'}}>mesh + grain texture</div>
        </div>
      </Frame>
      <p className="ds-caption">Renders an SVG turbulence pattern as a 240×240 tile; <Mono>mix-blend-mode: screen</Mono> in dark theme, <Mono>multiply</Mono> in light.</p>

      <SubHead meta="three intensities">Variants</SubHead>
      <Lede up>Three opacity stops in dark theme, all on the same <Mono>screen</Mono> blend. Each light-theme equivalent is listed in the Variables table below.</Lede>
      <Frame label="is-subtle · default · is-strong">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 12, width:'100%'}}>
          <div className="pat-noise is-subtle pat-mesh pat-demo is-short">is-subtle · <span style={{fontVariantNumeric:'tabular-nums'}}>0.45</span></div>
          <div className="pat-noise pat-mesh pat-demo is-short">default · <span style={{fontVariantNumeric:'tabular-nums'}}>0.85</span></div>
          <div className="pat-noise is-strong pat-mesh pat-demo is-short">is-strong · <span style={{fontVariantNumeric:'tabular-nums'}}>1.0</span></div>
        </div>
      </Frame>

      <SubHead meta="real applications">In context</SubHead>
      <Frame label="Hero · onboarding splash · 'this is software, not a website'">
        <div className="pat-noise pat-mesh is-cool pat-demo is-tall" style={{padding: 24, justifyContent:'flex-start', alignItems:'flex-start', textAlign:'start'}}>
          <div style={{position:'relative'}}>
            <div className="ds-h-eyebrow" style={{marginBottom: 10}}>Welcome back, Mariana</div>
            <div style={{fontSize: 'var(--text-2xl)', fontWeight: 600, letterSpacing:'-0.02em', lineHeight: 1.2, maxWidth: '24ch'}}>3 services need your attention today.</div>
            <p style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', maxWidth: '46ch', marginTop: 10, lineHeight: 1.55}}>Two SLO burns, one PR pending Risk review. Forge prioritised them for you.</p>
            <button className="btn ember sm" style={{marginTop: 14}}>Open my inbox <Icons.arrowRight size={12}/></button>
          </div>
        </div>
      </Frame>

      <SubHead meta="theme behavior">Dark vs light</SubHead>
      <Lede up>The blend mode and the noise tile both swap with <Mono>data-theme</Mono>: a white-channel tile on <Mono>screen</Mono> for dark, a black-channel tile on <Mono>multiply</Mono> for light. No JS, no prop — set the theme attribute and the grain inverts itself.</Lede>
      <Frame label="screen blend in dark · multiply in light · auto-inverted">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12, width:'100%'}}>
          <div className="pat-noise pat-mesh pat-demo">current theme</div>
          <div data-theme="light" className="pat-noise pat-mesh pat-demo" style={{background:'var(--bg)', color:'var(--fg-muted)'}}>flip a child to light</div>
        </div>
      </Frame>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Decoration, not meaning</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Grain is pure texture — it stays <Mono>aria-hidden</Mono> / purely decorative and never carries state or grouping. Intensity (subtle vs. strong) is a tonal choice, not information, so it never needs an accessible name.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Contrast over texture</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Grain reduces local contrast, so keep it off body text and dense data — carry copy on a solid <Mono>--surface</Mono> chip so it stays AA-legible. The blend auto-inverts (<Mono>screen</Mono> dark, <Mono>multiply</Mono> light) and <Mono>is-subtle</Mono> exists precisely so text never falls below the contrast floor.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Reduced motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The grain tile is static — there is no animated/scrolling noise to gate behind <Mono>prefers-reduced-motion</Mono>, so it is safe for motion-sensitive and vestibular users by default.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus order</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The grain overlay is not focusable and adds no tab stops. The CTA on a grained hero (the "Open my inbox" button) keeps its natural DOM order, so keyboard focus matches the visible reading order.</div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — pair with mesh or solid colors</div>
          <div className="body" style={{padding: 0}}>
            <div className="pat-noise pat-mesh pat-demo" style={{width:'100%'}}>
              <span style={{fontSize: 'var(--text-xs)', fontFamily:'var(--font-mono)'}}>mesh + subtle grain</span>
            </div>
          </div>
          <div className="note">Grain dirties an otherwise too-clean surface — perfect on mesh or solid bg.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — apply on data tables or text</div>
          <div className="body" style={{padding: 0}}>
            <div className="pat-noise is-strong pat-demo" style={{width:'100%', background:'var(--surface)'}}>
              <span style={{fontSize: 'var(--text-xs)', fontFamily:'var(--font-mono)'}}>grain on dense text — illegible</span>
            </div>
          </div>
          <div className="note">Grain over body text reduces contrast and slows reading.</div>
        </div>
      </div>

      <SubHead meta="CSS tokens">Variables</SubHead>
      <Lede up>Opacity is applied to the <Mono>::before</Mono> tile, per theme. Dark theme blends on <Mono>screen</Mono>; light theme on <Mono>multiply</Mono>.</Lede>
      <PropsTable
        label=".pat-noise — modifiers"
        rows={[
          { prop: 'is-subtle', type: 'class', description: 'Opacity 0.45 (dark) / 0.18 (light) — lowest grit, keeps near-AA copy legible.' },
          { prop: 'default',   type: 'class', description: 'Opacity 0.85 (dark) / 0.32 (light) — the unmodified .pat-noise.' },
          { prop: 'is-strong', type: 'class', description: 'Opacity 1.0 (dark) / 0.5 (light) — full tile; texture only, never under text.' },
        ]}
      />
    </Section>
  );
}
