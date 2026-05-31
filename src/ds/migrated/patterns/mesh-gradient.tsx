'use client';
import { Section, SubHead, Frame, PropsTable, Icons, Mono } from '@/ds/core';


export default function MeshGradientPage() {
  return (
    <Section
      id="pat-mesh-gradient"
      num="03"
      title="Mesh gradient"
      desc="Multiple radial gradients blended into a soft, organic backdrop. Use on AI surfaces, premium states, and any place that benefits from atmosphere without specificity."
    >
      <SubHead meta="default · ember + ice">Default mesh</SubHead>
      <Frame label=".pat-mesh" code={`<div className="pat-mesh"
     style={{height: 240}} />`}>
        <div className="pat-demo is-tall pat-mesh" style={{position:'relative'}}>
          <div className="t-mono-label" style={{position:'relative', background:'var(--surface)', padding:'10px 16px', borderRadius: 'var(--radius-xl)', border:'1px solid var(--border)', color:'var(--fg)'}}>.pat-mesh — default</div>
        </div>
      </Frame>
      <p className="ds-caption">Three blended radial gradients (ember + ice + ember). Color values come from <Mono>--ember</Mono> and <Mono>--accent-2</Mono> tokens so theme switching works automatically.</p>

      <SubHead meta="three palettes">Variants</SubHead>
      <Frame label="default · is-cool · is-warm · is-subtle">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12, width:'100%'}}>
          <div className="pat-demo pat-mesh">default · ember + ice</div>
          <div className="pat-demo pat-mesh is-cool">is-cool · ice + violet</div>
          <div className="pat-demo pat-mesh is-warm">is-warm · ember + warning</div>
          <div className="pat-demo pat-mesh is-subtle">is-subtle · 50% opacity</div>
        </div>
      </Frame>

      <SubHead meta="real applications">In context</SubHead>
      <Frame label="AI surface · premium tier card · empty hero">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 14, width:'100%'}}>
          <div className="pat-mesh is-cool" style={{padding: 24, border:'1px solid var(--border)', borderRadius: 'var(--radius-xl)', minHeight: 160}}>
            <div className="ds-h-eyebrow" style={{marginBottom: 10}}>AI · Insight</div>
            <div className="t-h3">3 services drifted from their gold standard</div>
            <div className="t-small" style={{color:'var(--fg-muted)', marginTop: 6, maxWidth: '40ch'}}>The agent reviewed <Mono>142</Mono> PRs this week and found <Mono>2</Mono> that introduced new patterns worth promoting.</div>
            <button className="btn ghost sm" style={{marginTop: 12}}>Review findings <Icons.arrowRight size={12}/></button>
          </div>
          <div className="pat-mesh is-warm" style={{padding: 24, border:'1px solid var(--border)', borderRadius: 'var(--radius-xl)', minHeight: 160, position:'relative'}}>
            <span className="pill ember push-end" style={{position:'absolute', insetBlockStart: 16, insetInlineEnd: 16}}>Premium</span>
            <div className="ds-h-eyebrow" style={{marginBottom: 10}}>Tier · Enterprise</div>
            <div className="t-h3">Unlimited deploys.<br/>Audit-ready receipts.</div>
          </div>
        </div>
      </Frame>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Decoration, not meaning</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>The mesh is atmosphere only — it stays <Mono>aria-hidden</Mono> / purely decorative and is never the sole carrier of state. Don't use the warm vs. cool palette to signal status; pair it with a pill or label so the meaning survives without colour.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Contrast over texture</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>The blend is soft and low-contrast by design, but it varies across the surface — so text rides a solid <Mono>--surface</Mono> card or a scrim layer, not the bare mesh, to stay AA-legible wherever the gradient peaks. <Mono>is-subtle</Mono> halves opacity for the busiest copy.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Reduced motion</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>The mesh is static — it does not animate, so there is nothing to gate behind <Mono>prefers-reduced-motion</Mono>. If you layer a pulsing glow or a spinning orb on top, that companion respects reduced-motion on its own.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus order</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>The mesh layer is not focusable and adds no tab stops. Controls placed on a mesh card (the "Review findings" CTA) keep their natural DOM order, so keyboard focus matches the visible reading order.</div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — use as background, content on solid surface</div>
          <div className="body" style={{padding: 0}}>
            <div className="pat-demo pat-mesh" style={{width:'100%'}}>
              <div className="surface" style={{padding: 10, borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-sm)'}}>Content reads cleanly</div>
            </div>
          </div>
          <div className="note">The mesh adds atmosphere. Real content goes on a solid surface above it.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — overlap two mesh surfaces</div>
          <div className="body" style={{padding: 0}}>
            <div className="pat-demo pat-mesh" style={{width:'100%'}}>
              <div className="pat-mesh is-warm" style={{padding: 10, borderRadius: 'var(--radius-lg)', border:'1px solid var(--border)'}}>nested mesh on mesh</div>
            </div>
          </div>
          <div className="note">Stacked meshes muddy each other. Pick one per surface.</div>
        </div>
      </div>

      <SubHead meta="CSS tokens">Variables</SubHead>
      <PropsTable
        label=".pat-mesh — variants"
        rows={[
          { prop: 'default',  type: 'class', description: 'Ember + ice blend. The default brand mesh.' },
          { prop: 'is-cool',  type: 'class', description: 'Ice + violet — for AI / data surfaces.' },
          { prop: 'is-warm',  type: 'class', description: 'Ember + warning — for premium / energy surfaces.' },
          { prop: 'is-subtle', type: 'class', description: 'Halves opacity — for atmospheric backgrounds.' },
        ]}
      />
    </Section>
  );
}
