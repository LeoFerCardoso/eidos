'use client';
import { Section, SubHead, Frame, PropsTable, Icons, Mono } from '@/ds/core';


export default function EmberGlowPage() {
  return (
    <Section
      id="pat-ember-glow"
      num="07"
      title="Ember glow"
      desc="A soft radial halo in brand ember (or ice). Already used internally by Pipeline / RingBar / Timeline to mark the active step. Surface it here as a reusable utility so you can drop it on any card, hero or button."
    >
      <SubHead meta="default · 280px ember">Default glow</SubHead>
      <Frame label=".pat-ember-glow">
        <div className="pat-demo is-tall" style={{position:'relative', overflow:'hidden'}}>
          <div className="pat-ember-glow" aria-hidden="true" style={{top:'50%', insetInlineStart:'50%', transform:'translate(-50%, -50%)'}}/>
          <div style={{position:'relative', fontFamily:'var(--font-mono)', fontSize: 'var(--text-base)', color:'var(--ember)'}}>ember halo</div>
        </div>
      </Frame>
      <p className="ds-caption">Position absolutely; the parent needs <Mono>position: relative</Mono> and <Mono>overflow: hidden</Mono>. Use <Mono>top / insetInlineStart</Mono> to anchor.</p>

      <SubHead meta="size · palette · animation">Variants</SubHead>
      <Frame label="is-sm · default · is-lg · is-ice · is-pulse">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 12, width:'100%'}}>
          <div className="pat-demo is-short" style={{position:'relative', overflow:'hidden'}}>
            <div className="pat-ember-glow is-sm" aria-hidden="true" style={{top:'50%', insetInlineStart:'50%', transform:'translate(-50%, -50%)'}}/>
            <span style={{position:'relative', fontSize: 'var(--text-xs)', fontFamily:'var(--font-mono)', fontVariantNumeric:'tabular-nums'}}>is-sm · 160px</span>
          </div>
          <div className="pat-demo is-short" style={{position:'relative', overflow:'hidden'}}>
            <div className="pat-ember-glow" aria-hidden="true" style={{top:'50%', insetInlineStart:'50%', transform:'translate(-50%, -50%)'}}/>
            <span style={{position:'relative', fontSize: 'var(--text-xs)', fontFamily:'var(--font-mono)', fontVariantNumeric:'tabular-nums'}}>default · 280px</span>
          </div>
          <div className="pat-demo is-short" style={{position:'relative', overflow:'hidden'}}>
            <div className="pat-ember-glow is-lg" aria-hidden="true" style={{top:'50%', insetInlineStart:'50%', transform:'translate(-50%, -50%)'}}/>
            <span style={{position:'relative', fontSize: 'var(--text-xs)', fontFamily:'var(--font-mono)', fontVariantNumeric:'tabular-nums'}}>is-lg · 480px</span>
          </div>
          <div className="pat-demo is-short" style={{position:'relative', overflow:'hidden'}}>
            <div className="pat-ember-glow is-ice" aria-hidden="true" style={{top:'50%', insetInlineStart:'50%', transform:'translate(-50%, -50%)'}}/>
            <span style={{position:'relative', fontSize: 'var(--text-xs)', fontFamily:'var(--font-mono)', color:'var(--ice)'}}>is-ice</span>
          </div>
          <div className="pat-demo is-short" style={{position:'relative', overflow:'hidden'}}>
            <div className="pat-ember-glow is-pulse" aria-hidden="true" style={{top:'50%', insetInlineStart:'50%', transform:'translate(-50%, -50%)'}}/>
            <span style={{position:'relative', fontSize: 'var(--text-xs)', fontFamily:'var(--font-mono)', fontVariantNumeric:'tabular-nums'}}>is-pulse (3s)</span>
          </div>
          <div className="pat-demo is-short" style={{position:'relative', overflow:'hidden'}}>
            <div className="pat-ember-glow is-ice is-pulse is-lg" aria-hidden="true" style={{top:'50%', insetInlineStart:'50%', transform:'translate(-50%, -50%)'}}/>
            <span style={{position:'relative', fontSize: 'var(--text-xs)', fontFamily:'var(--font-mono)', color:'var(--ice)'}}>combine</span>
          </div>
        </div>
      </Frame>

      <SubHead meta="real applications">In context</SubHead>
      <Frame label="Active deploy step · 'new feature' card · attention spike">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 14, width:'100%'}}>
          <div className="surface" style={{position:'relative', padding: 18, overflow:'hidden', borderRadius: 10}}>
            <div className="pat-ember-glow is-pulse" aria-hidden="true" style={{top: -80, insetInlineEnd: -80}}/>
            <div style={{position:'relative'}}>
              <div className="ds-h-eyebrow" style={{marginBottom: 8}}>Active deploy</div>
              <div style={{fontSize: 'var(--text-lg)', fontWeight: 600, letterSpacing:'-0.015em'}}>identity-svc <span style={{fontFamily:'var(--font-mono)', fontVariantNumeric:'tabular-nums'}}>v4.18.2</span></div>
              <div style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', marginTop: 4}}><span style={{fontFamily:'var(--font-mono)', fontVariantNumeric:'tabular-nums'}}>2 of 5</span> rings · canary stable</div>
              <div style={{marginTop: 12, display:'flex', gap: 6}}>
                <span className="pill status-running"><span className="dot"/>Running</span>
                <span className="pill ember">canary · 1%</span>
              </div>
            </div>
          </div>
          <div className="surface" style={{position:'relative', padding: 18, overflow:'hidden', borderRadius: 10}}>
            <div className="pat-ember-glow is-ice is-lg" aria-hidden="true" style={{top: -120, insetInlineStart: -100}}/>
            <div style={{position:'relative'}}>
              <span className="pill ice">NEW</span>
              <div style={{fontSize: 'var(--text-lg)', fontWeight: 600, letterSpacing:'-0.015em', marginTop: 10}}>Workflow templates v2</div>
              <div style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', marginTop: 4, lineHeight: 1.5}}>Multi-step DAGs, conditional branches, retries.</div>
            </div>
          </div>
        </div>
      </Frame>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Decoration, not meaning</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>When the halo marks an "active" step it reinforces a state that is also shown with a pill or label — it stays <Mono>aria-hidden</Mono> / purely decorative and never the only carrier of that meaning. A screen-reader user gets "Running" from the pill, not from the glow.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Contrast over texture</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The halo is positioned to bleed off an edge so it sits behind content, not under it — text keeps AA contrast against the solid surface rather than washing out in the brightest part of the glow. Centre it on a card and copy loses contrast, which is exactly the failure the Do/Don't below calls out.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Reduced motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The <Mono>is-pulse</Mono> opacity loop is gated behind <Mono>prefers-reduced-motion</Mono>: visitors who opt out get a steady glow, no breathing. Reserve the pulse for genuine attention spikes and never as the sole indicator of a live/changing value.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus order</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The glow layer is not focusable and adds no tab stops. The controls on a glow card (pills, links) keep their natural DOM order, so keyboard focus matches the visible reading order.</div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — partially bleed off the surface</div>
          <div className="body" style={{padding: 0}}>
            <div className="surface" style={{width:'100%', position:'relative', height: 80, overflow:'hidden', borderRadius: 'var(--radius-lg)'}}>
              <div className="pat-ember-glow is-sm" aria-hidden="true" style={{top: -40, insetInlineEnd: -40}}/>
              <span style={{position:'relative', padding: 10, fontSize: 'var(--text-xs)', fontFamily:'var(--font-mono)'}}>halo bleeds top-right</span>
            </div>
          </div>
          <div className="note">The halo creates atmosphere from outside; content stays clean.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — block content with a centered halo</div>
          <div className="body" style={{padding: 0}}>
            <div className="surface" style={{width:'100%', position:'relative', height: 80, overflow:'hidden', borderRadius: 'var(--radius-lg)'}}>
              <div className="pat-ember-glow is-sm" aria-hidden="true" style={{top:'50%', insetInlineStart:'50%', transform:'translate(-50%, -50%)'}}/>
              <span style={{position:'relative', padding: 10, fontSize: 'var(--text-xs)', fontFamily:'var(--font-mono)', textAlign:'center', display:'block'}}>halo over content — washed out</span>
            </div>
          </div>
          <div className="note">Center-positioned, the halo overlays content; copy fights with the glow.</div>
        </div>
      </div>

      <SubHead meta="CSS tokens">Variables</SubHead>
      <PropsTable
        label=".pat-ember-glow — modifiers"
        rows={[
          { prop: '--pat-glow-size', type: '<length>', default: '280px', description: 'Diameter of the halo.' },
          { prop: 'is-sm / is-lg',   type: 'class', description: 'Shortcuts for 160px / 480px.' },
          { prop: 'is-ice',          type: 'class', description: 'Swap ember for ice palette.' },
          { prop: 'is-pulse',        type: 'class', description: 'Opacity pulse — 3s ease loop. Use sparingly.' },
        ]}
      />
    </Section>
  );
}
