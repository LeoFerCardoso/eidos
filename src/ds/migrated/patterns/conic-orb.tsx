'use client';
import { Section, SubHead, Frame, PropsTable, Icons, Mono, Lede } from '@/ds/core';


export default function ConicOrbPage() {
  return (
    <Section
      id="pat-conic-orb"
      num="04"
      title="Conic orb"
      desc="A blurred conic-gradient sphere used as a decorative accent. Reads as 'energy' or 'compute' depending on palette. Position it bleeding off an edge so it acts as glow, not a logo."
    >
      <SubHead meta="default · ember">Default orb</SubHead>
      <Lede up>
        A single <Mono>&lt;div className="pat-conic-orb"&gt;</Mono> — pure CSS, no DOM children, always
        <Mono>aria-hidden</Mono>. Absolutely positioned and bled off an edge by 100–150px so only the
        soft tail reads as atmosphere and the brightest core sits just outside the frame.
      </Lede>
      <Frame label=".pat-conic-orb">
        <div className="pat-demo is-tall" style={{position:'relative', overflow:'hidden'}}>
          <div className="pat-conic-orb" aria-hidden="true"/>
          <div className="t-mono-label" style={{position:'relative', fontVariantNumeric:'tabular-nums'}}>conic orb · 280px · blur 28px</div>
        </div>
      </Frame>

      <SubHead meta="three sizes · two palettes · animated">Variants</SubHead>
      <Frame label="is-sm · default · is-lg · is-ice · is-spin">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 12, width:'100%'}}>
          <div className="pat-demo is-short" style={{position:'relative', overflow:'hidden'}}>
            <div className="pat-conic-orb is-sm" aria-hidden="true"/>
            <span className="t-mono-label" style={{position:'relative', fontVariantNumeric:'tabular-nums'}}>is-sm · 160px</span>
          </div>
          <div className="pat-demo is-short" style={{position:'relative', overflow:'hidden'}}>
            <div className="pat-conic-orb" aria-hidden="true"/>
            <span className="t-mono-label" style={{position:'relative', fontVariantNumeric:'tabular-nums'}}>default · 280px</span>
          </div>
          <div className="pat-demo is-short" style={{position:'relative', overflow:'hidden'}}>
            <div className="pat-conic-orb is-lg" aria-hidden="true"/>
            <span className="t-mono-label" style={{position:'relative', fontVariantNumeric:'tabular-nums'}}>is-lg · 420px</span>
          </div>
          <div className="pat-demo is-short" style={{position:'relative', overflow:'hidden'}}>
            <div className="pat-conic-orb is-ice" aria-hidden="true"/>
            <span className="t-mono-label" style={{position:'relative'}}>is-ice</span>
          </div>
          <div className="pat-demo is-short" style={{position:'relative', overflow:'hidden'}}>
            <div className="pat-conic-orb is-spin" aria-hidden="true"/>
            <span className="t-mono-label" style={{position:'relative', fontVariantNumeric:'tabular-nums'}}>is-spin · 30s loop</span>
          </div>
          <div className="pat-demo is-short" style={{position:'relative', overflow:'hidden'}}>
            <div className="pat-conic-orb is-ice is-spin is-lg" aria-hidden="true"/>
            <span className="t-mono-label" style={{position:'relative'}}>combine modifiers</span>
          </div>
        </div>
      </Frame>

      <SubHead meta="real applications">In context</SubHead>
      <Lede up>
        The orb earns its place as <strong>atmosphere behind labelled content</strong> — a marketing hero,
        an AI splash, the glow on an otherwise empty premium card. In every case the meaning lives in the copy
        and the control; the orb only sets a mood.
      </Lede>
      <Frame label="Marketing hero — orb bled top-trailing">
        <div className="pat-dot-grid" style={{position:'relative', overflow:'hidden', padding: 32, border:'1px solid var(--border)', borderRadius: 'var(--radius-2xl)', minHeight: 220}}>
          <div className="pat-conic-orb is-lg" aria-hidden="true" style={{top: -140, insetInlineEnd: -140}}/>
          <div style={{position:'relative', maxWidth: '60%'}}>
            <div className="ds-h-eyebrow" style={{marginBottom: 8}}>Forge AI</div>
            <div style={{fontSize: 'var(--text-2xl)', fontWeight: 600, letterSpacing:'-0.02em', lineHeight: 1.15}}>An agent for every loop in your platform.</div>
            <p style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', maxWidth: '40ch', marginTop: 12, lineHeight: 1.55}}>Open a drawer, ask, ship. The orb is on the right; the proposition is on the left.</p>
            <button className="btn ember sm" style={{marginTop: 14}}>Try Forge AI <Icons.sparkle size={12}/></button>
          </div>
        </div>
      </Frame>
      <Frame label="Empty premium card — glow carries warmth, copy carries meaning">
        <div style={{position:'relative', overflow:'hidden', border:'1px solid var(--border)', borderRadius: 'var(--radius-2xl)', minHeight: 200}}>
          <div className="pat-conic-orb is-sm is-ice" aria-hidden="true" style={{top: -70, insetInlineStart: '50%', transform:'translateX(-50%)'}}/>
          <div className="empty accent" style={{position:'relative'}}>
            <div className="empty-icon" aria-hidden="true"><Icons.sparkle size={18}/></div>
            <div className="empty-text">
              <div className="empty-title">No agents yet</div>
              <div className="empty-desc">The empty state still reads without the glow — kill the orb and the heading, icon and CTA carry it.</div>
            </div>
            <div className="empty-actions">
              <button className="btn ember sm">Create your first agent <Icons.plus size={12}/></button>
            </div>
          </div>
        </div>
      </Frame>

      <SubHead meta="a11y">Accessibility</SubHead>
      <Lede up>
        The orb is a glow, never a logo or a status light. It is a purely decorative layer: it must carry
        <Mono>aria-hidden="true"</Mono>, it sets <Mono>pointer-events: none</Mono>, and it is never the only
        carrier of meaning — that always lives in the labelled copy and controls beside it.
      </Lede>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 8}}>Keyboard &amp; focus</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55, marginBottom: 10}}>
            The orb has no interactions and no key bindings — it adds <strong>zero tab stops</strong>. Focus tracks the
            visible reading order of the content layered above it.
          </div>
          <div style={{display:'grid', gridTemplateColumns:'auto 1fr', gap:'6px 12px', fontSize:'var(--text-base)'}}>
            <kbd className="kbd">Tab</kbd><span style={{color:'var(--fg-muted)', lineHeight: 1.4}}>skips the orb entirely; lands on the next real control (e.g. the hero CTA).</span>
            <kbd className="kbd">Enter</kbd><span style={{color:'var(--fg-muted)', lineHeight: 1.4}}>activates that control — never the orb, which is not focusable.</span>
          </div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 8}}>ARIA contract</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>
            Every <Mono>.pat-conic-orb</Mono> ships <Mono>aria-hidden="true"</Mono> so assistive tech ignores it, and
            the class sets <Mono>pointer-events: none</Mono> so it never intercepts a click or hover. It has no role,
            no label, and no DOM children — there is nothing for a screen reader to announce.
          </div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 8}}>Contrast over texture</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>
            Because the brightest core sits outside the frame at <Mono>opacity 0.65</Mono> + blur, text lands over the
            faint tail and keeps AA contrast. Keep copy off the orb's centre, or carry it on a solid <Mono>--surface</Mono>
            card so legibility never depends on where the orb sits.
          </div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 8}}>Reduced motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>
            The <Mono>is-spin</Mono> rotation is gated behind <Mono>prefers-reduced-motion: reduce</Mono> — when a visitor
            opts out of motion the animation is dropped and only the static glow remains. Treat the 30s spin as a flourish,
            never as a progress signal.
          </div>
        </div>
      </div>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <Lede up>
        Four layers make the orb read as glow rather than a circle. The brightest core (1) is positioned to bleed
        past the frame edge (4); inside the frame the eye only catches the conic sweep (2) and its blurred tail (3).
      </Lede>
      <Frame label="conic orb — the four layers">
        <div className="ana" style={{display:'flex', justifyContent:'center', paddingBlock: 24}}>
          <div className="stage" style={{position:'relative', width: 220, height: 160, overflow:'hidden', borderRadius:'var(--r-md, 10px)', border:'1px solid var(--border)', background:'var(--surface)'}} aria-hidden="true">
            <div className="pat-conic-orb is-sm" aria-hidden="true" style={{top: -70, insetInlineEnd: -70}}/>
            {/* leaders */}
            <span className="lead h" style={{top: 18, insetInlineEnd: 28, width: 40}}/>
            <span className="lead h" style={{top: 56, insetInlineEnd: 64, width: 44}}/>
            <span className="lead h" style={{top: 104, insetInlineEnd: 96, width: 48}}/>
            <span className="lead v" style={{top: 0, insetInlineEnd: 14, height: 28}}/>
            {/* pins */}
            <div className="pin" style={{top: 9, insetInlineEnd: 64}}>1</div>
            <div className="pin" style={{top: 47, insetInlineEnd: 104}}>2</div>
            <div className="pin" style={{top: 95, insetInlineEnd: 140}}>3</div>
            <div className="pin" style={{top: -8, insetInlineEnd: 8}}>4</div>
          </div>
        </div>
        <div className="ana-list" style={{maxWidth: 560, margin:'8px auto 0'}}>
          <span className="num">1</span><span><strong>Core</strong> — the brightest point of the conic gradient, kept just outside the frame so it never reads as a dot.</span>
          <span className="num">2</span><span><strong>Conic sweep</strong> — ember rotating through a soft ice arc (<Mono>is-ice</Mono> swaps to ice → violet).</span>
          <span className="num">3</span><span><strong>Blurred tail</strong> — <Mono>blur(28px)</Mono> + <Mono>opacity 0.65</Mono> dissolve the edge into atmosphere.</span>
          <span className="num">4</span><span><strong>Bleed edge</strong> — the container's <Mono>overflow: hidden</Mono> clips the orb; offset by 100–150px.</span>
        </div>
      </Frame>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — bleed off an edge</div>
          <div className="body" style={{padding: 0}}>
            <div className="pat-demo" style={{width:'100%', position:'relative', overflow:'hidden'}}>
              <div className="pat-conic-orb is-sm" aria-hidden="true" style={{top: -60, insetInlineEnd: -60}}/>
              <span className="t-mono-label" style={{position:'relative'}}>orb bleeds top-trailing</span>
            </div>
          </div>
          <div className="note">The core sits outside the frame; only the soft glow reads. Reads as 'this surface has a vibe', not 'there's a circle here'.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — center it like a logo</div>
          <div className="body" style={{padding: 0}}>
            <div className="pat-demo" style={{width:'100%', position:'relative', overflow:'hidden'}}>
              <div className="pat-conic-orb is-sm" aria-hidden="true"/>
              <span className="t-mono-label" style={{position:'relative'}}>orb dead-centered</span>
            </div>
          </div>
          <div className="note">Centered, it competes with content and looks like a (bad) logo. Always offset.</div>
        </div>
      </div>

      <SubHead meta="modifier classes">API reference</SubHead>
      <PropsTable
        label=".pat-conic-orb — modifiers"
        rows={[
          { prop: 'pat-conic-orb', type: 'class', description: 'Base orb — 280px, ember→ice conic gradient, blur 28px, opacity 0.65, pointer-events:none. Always pair with aria-hidden="true".' },
          { prop: 'is-sm / is-lg', type: 'class', description: 'Override the default 280px to 160px or 420px (blur scales with it).' },
          { prop: 'is-ice',  type: 'class', description: 'Swap the ember+ice gradient for ice+violet.' },
          { prop: 'is-spin', type: 'class', description: 'Rotate 360° over 30s; held still under prefers-reduced-motion. Composable with other modifiers.' },
        ]}
      />
    </Section>
  );
}
