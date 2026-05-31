'use client';
import { Section, SubHead, Frame, PropsTable, Icons, Mono, Lede, Kbd, Empty, Alert, Skeleton, Spinner } from '@/ds/core';


const HeroDemo = () => (
  <div className="pat-demo is-tall pat-dot-grid" style={{position:'relative'}}>
    <div className="pat-ember-glow is-lg" style={{top: -120, insetInlineEnd: -120}}/>
    <div style={{position:'relative', textAlign:'center'}}>
      <div className="ds-h-eyebrow" style={{marginBottom: 8}}>Eidos / 2026</div>
      <div style={{fontSize:'var(--text-2xl)', lineHeight:1.2, fontWeight: 600, letterSpacing:'-0.02em'}}>
        Ship safely. <span style={{color:'var(--fg-muted)'}}>Faster.</span>
      </div>
      <div className="t-mono-label" style={{
        marginTop: 12, display:'inline-flex', alignItems:'center', gap: 8,
        fontVariantNumeric:'tabular-nums',
      }}>
        <span aria-hidden="true" style={{width: 6, height: 6, borderRadius:'50%', background:'var(--fg-subtle)'}}/>
        gap 20px · dot 1.5px
      </div>
    </div>
  </div>
);

export default function DotGridPage() {
  return (
    <Section
      id="pat-dot-grid"
      num="01"
      title="Dot grid"
      desc="A pure-CSS grid of dots used as a background texture. Reads as 'precision' or 'blueprint' without being loud."
    >
      <Lede>
        Zero markup, one element: a radial-gradient tile that repeats across any surface. It pairs
        with an ember glow for marketing heroes, or stays quiet on its own for product chrome — and
        it is purely decorative, so it never carries meaning or takes a tab stop.
      </Lede>

      <SubHead meta="default · the marketing texture">Default</SubHead>
      <Frame label=".pat-dot-grid" code={`<div className="pat-dot-grid"
     style={{height: 200}} />`}>
        <HeroDemo/>
      </Frame>
      <p className="ds-caption">
        Default cell: <Mono>--pat-dot-gap: 20px</Mono>, <Mono>--pat-dot-size: 1.5px</Mono>, color is <Mono>--fg @ 12%</Mono>. Drops to <Mono>--fg @ 5%</Mono> automatically in light theme.
      </p>

      <SubHead meta="density">Density variants</SubHead>
      <Frame label="is-dense (12px) · default (20px) · is-loose (32px)">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 'var(--space-3)', width:'100%'}}>
          <div className="pat-demo is-short pat-dot-grid is-dense" style={{fontVariantNumeric:'tabular-nums'}}>dense · 12px</div>
          <div className="pat-demo is-short pat-dot-grid" style={{fontVariantNumeric:'tabular-nums'}}>default · 20px</div>
          <div className="pat-demo is-short pat-dot-grid is-loose" style={{fontVariantNumeric:'tabular-nums'}}>loose · 32px</div>
        </div>
      </Frame>
      <p className="ds-caption">Override per-instance with <Mono>--pat-dot-gap</Mono> or use the helper classes.</p>

      <SubHead meta="ember accent">Ember tint</SubHead>
      <Frame label=".pat-dot-grid.is-ember — for branded hero surfaces">
        <div className="pat-demo is-tall pat-dot-grid is-ember" style={{position:'relative'}}>
          <div className="pat-ember-glow is-pulse" style={{top:'50%', insetInlineStart:'50%', transform:'translate(-50%, -50%)'}}/>
          <div style={{position:'relative', textAlign:'center'}}>
            <div className="ds-h-eyebrow">Eidos / brand surface</div>
            <div style={{fontSize:'var(--text-xl)', lineHeight:1.3, fontWeight: 600, marginTop: 8, letterSpacing:'-0.015em'}}>Engineered. Visible.</div>
          </div>
        </div>
      </Frame>
      <p className="ds-caption">One ember tint per surface — the dots warm to <Mono>--ember @ 22%</Mono> and the glow respects <Mono>prefers-reduced-motion</Mono>.</p>

      {/* ====================================================================
          STATES — the texture under real product moments
          ==================================================================== */}
      <SubHead meta="empty · loading · misuse">States</SubHead>
      <p className="ds-caption" style={{marginTop: 0}}>
        The grid is a backdrop, so its &quot;states&quot; are the content layered on it — the texture
        stays identical while the surface above moves through empty, loading and error.
      </p>
      <Frame label="Empty · Loading · Invalid contrast (caught)">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 'var(--space-4)', width:'100%', alignItems:'stretch'}}>

          {/* EMPTY — texture behind, content on a solid surface */}
          <div className="pat-dot-grid" style={{padding:'var(--space-5)', border:'1px solid var(--border)', borderRadius: 'var(--radius-lg)', display:'flex', flexDirection:'column'}}>
            <div className="t-mono-label" style={{marginBottom:'var(--space-3)'}}>Empty</div>
            <div className="surface" style={{borderRadius:'var(--radius-lg)', flex:1}}>
              <Empty
                size="sm"
                iconName="inbox"
                title="No services yet"
                desc="Scaffold your first from a template."
                action={<button className="btn ember sm">Browse templates</button>}
              />
            </div>
          </div>

          {/* LOADING — Skeleton on a solid card over the grid + a live status */}
          <div className="pat-dot-grid is-dense" style={{padding:'var(--space-5)', border:'1px solid var(--border)', borderRadius: 'var(--radius-lg)', display:'flex', flexDirection:'column'}}>
            <div className="t-mono-label" style={{marginBottom:'var(--space-3)'}}>Loading</div>
            <div className="surface" style={{padding:'var(--space-4)', borderRadius:'var(--radius-lg)', flex:1}}>
              <Skeleton variant="line" lines={3} label="Loading services" />
              <div style={{display:'inline-flex', alignItems:'center', gap:'var(--space-2)', marginTop:'var(--space-4)', color:'var(--fg-muted)', fontSize:'var(--text-sm)', lineHeight:1.5}}>
                <Spinner size="sm" aria-label="Loading services"/> Fetching…
              </div>
            </div>
          </div>

          {/* INVALID — the contrast guard, surfaced as a real alert */}
          <div className="pat-dot-grid is-ember" style={{padding:'var(--space-5)', border:'1px solid var(--border)', borderRadius: 'var(--radius-lg)', display:'flex', flexDirection:'column'}}>
            <div className="t-mono-label" style={{marginBottom:'var(--space-3)'}}>Invalid contrast</div>
            <div style={{flex:1, display:'flex', alignItems:'center'}}>
              <Alert tone="danger">
                Body copy placed directly on the grid drops below AA. Move it onto a solid <Mono>--surface</Mono>.
              </Alert>
            </div>
          </div>

        </div>
      </Frame>
      <p className="ds-caption">
        Empty and Loading isolate their content on an opaque <Mono>--surface</Mono>; the danger Alert (<Mono>role=&quot;alert&quot;</Mono>) is what your contrast lint surfaces when text floats on the texture.
      </p>

      <SubHead meta="real applications">In context</SubHead>
      <Frame label="Hero · empty state · onboarding splash" code={`<div className="pat-dot-grid"
     style={{padding: 40, borderRadius: 10, border: '1px solid var(--border)'}}>
  {/* ... hero content ... */}
</div>`}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 'var(--space-4)', width:'100%'}}>
          <div className="pat-dot-grid" style={{padding:'var(--space-6)', border:'1px solid var(--border)', borderRadius: 'var(--radius-lg)'}}>
            <div className="ds-h-eyebrow" style={{marginBottom: 8}}>Welcome to Eidos</div>
            <div style={{fontSize:'var(--text-lg)', lineHeight:1.3, fontWeight: 600}}>No services yet</div>
            <div style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', marginTop: 6, lineHeight: 1.55}}>Scaffold your first one from a template — takes 2 minutes.</div>
            <button className="btn ember sm" style={{marginTop: 12}}>Browse templates</button>
          </div>
          <div className="pat-dot-grid is-dense is-ember" style={{padding:'var(--space-6)', border:'1px solid var(--border)', borderRadius: 'var(--radius-lg)', textAlign:'center'}}>
            <Icons.sparkle size={18} style={{color:'var(--ember)'}}/>
            <div style={{fontSize: 'var(--text-md)', fontWeight: 600, marginTop: 8}}>Agent suggestion ready</div>
            <div style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', marginTop: 6, lineHeight: 1.55}}>3 services match this scaffold.</div>
          </div>
        </div>
      </Frame>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 'var(--space-3)'}}>
        <div className="surface" style={{padding: 'var(--space-5)'}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Decoration, not meaning</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The dot grid is a background texture — it carries no information, so it stays <Mono>aria-hidden</Mono> / purely decorative. Never encode state, grouping, or hierarchy in the dots; the content above them is the only carrier of meaning and keeps AA contrast on its own surface.</div>
        </div>
        <div className="surface" style={{padding: 'var(--space-5)'}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Contrast over texture</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Body copy never sits directly on the grid: a solid <Mono>--surface</Mono> card (or a scrim) carries the text so it stays AA-legible regardless of dot density. The grid auto-drops to <Mono>--fg @ 5%</Mono> in light theme so it never approaches the contrast floor of text near it.</div>
        </div>
        <div className="surface" style={{padding: 'var(--space-5)'}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Reduced motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The dot grid itself is static — there is nothing to gate behind <Mono>prefers-reduced-motion</Mono>. The paired glow (<Mono>is-pulse</Mono>) stops breathing under that query, holding as a steady halo; the dots never animate.</div>
        </div>
        <div className="surface" style={{padding: 'var(--space-5)'}}>
          <div style={{fontWeight: 600, marginBottom: 'var(--space-3)'}}>Keyboard &amp; focus order</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55, marginBottom: 'var(--space-3)'}}>The decorative layer is never focusable and adds no tab stops. Controls placed over the grid keep their natural DOM order, so focus tracks the visible reading order and shows the standard ring.</div>
          <div style={{display:'grid', gap:'var(--space-2)'}}>
            <Kbd label="Tab" keys={['Tab']} meta="moves to the next control over the grid — the dots are skipped" />
            <Kbd label="Enter / Space" keys={['Enter', 'Space']} meta="activates the focused CTA in a hero" />
          </div>
        </div>
      </div>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{padding:'56px 36px 48px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative'}} aria-hidden="true">
              <div className="pat-dot-grid" style={{width: 200, height: 120, borderRadius:'var(--radius-lg)', border:'1px solid var(--border)'}}/>
              {/* gap pin — between two columns */}
              <span className="lead v" style={{top: -22, insetInlineStart: 60, height: 18}}/>
              {/* dot-size pin — onto a single dot */}
              <span className="lead v" style={{top: -22, insetInlineEnd: 50, height: 18}}/>
              {/* color pin — the field */}
              <span className="lead v" style={{bottom: -22, insetInlineStart: '50%', height: 18, transform:'translateX(-50%)'}}/>
              {/* surface pin — the host element */}
              <span className="lead h" style={{top: 50, insetInlineEnd: -28, width: 24}}/>
              <div className="pin" style={{top: -42, insetInlineStart: 60, transform:'translateX(-50%)'}}>1</div>
              <div className="pin" style={{top: -42, insetInlineEnd: 50, transform:'translateX(50%)'}}>2</div>
              <div className="pin" style={{bottom: -42, insetInlineStart: '50%', transform:'translateX(-50%)'}}>3</div>
              <div className="pin" style={{top: 42, insetInlineEnd: -52}}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Gap.</b> <Mono>--pat-dot-gap</Mono> sets the tile in both axes — 12 / 20 / 32px via <Mono>is-dense</Mono> / default / <Mono>is-loose</Mono>.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Dot.</b> <Mono>--pat-dot-size</Mono> is the radius — 1.5px default. A single <Mono>radial-gradient</Mono>, no markup.</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Color.</b> <Mono>--pat-dot-color</Mono> = <Mono>--fg @ 12%</Mono>, theme-aware (drops to 5% in light).</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Host surface.</b> Any element — set <Mono>position: relative</Mono> to anchor a glow or scrim above it.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — under content, never on top</div>
          <div className="body" style={{padding: 0}}>
            <div className="pat-demo pat-dot-grid" style={{width:'100%'}}>
              <div style={{padding:'8px 12px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius: 'var(--radius-lg)', fontFamily:'var(--font-body)', color:'var(--fg)', fontSize: 'var(--text-base)'}}>Real content sits on a solid surface</div>
            </div>
          </div>
          <div className="note">The grid is decoration. Keep cards, text and inputs on opaque surfaces so the grid is felt, not read.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — text directly on the grid</div>
          <div className="body" style={{padding: 0}}>
            <div className="pat-demo pat-dot-grid" style={{width:'100%'}}>
              <div style={{fontSize: 'var(--text-base)', color:'var(--fg)', padding:'8px 12px'}}>Body copy floating on dots is hard to read.</div>
            </div>
          </div>
          <div className="note">Body copy on a grid creates micro-vibration. Always isolate text on a solid background.</div>
        </div>
      </div>

      <SubHead meta="CSS tokens">Variables</SubHead>
      <PropsTable
        label=".pat-dot-grid — custom properties"
        rows={[
          { prop: '--pat-dot-color', type: '<color>', default: 'color-mix(in srgb, var(--fg) 12%, transparent)', description: 'Dot color. Theme-aware via --fg.' },
          { prop: '--pat-dot-size',  type: '<length>', default: '1.5px', description: 'Radius of each dot.' },
          { prop: '--pat-dot-gap',   type: '<length>', default: '20px', description: 'Spacing between dots in both axes.' },
        ]}
      />
    </Section>
  );
}
