'use client';
// Eidos DS — Foundations / Spacing & Radius
import { Icons, Section, SubHead, Frame } from '@/ds/core';

export default function Spacing() {
  const scale = [
    ['space-0','0','0px','—'],
    ['space-1','4px','0.25rem','Hairline gaps inside controls (icon → label).'],
    ['space-2','8px','0.5rem','Inline gaps in pills, chips, button rows.'],
    ['space-3','12px','0.75rem','Card padding (sm), input internal gap.'],
    ['space-4','16px','1rem','Default card / panel padding.'],
    ['space-5','20px','1.25rem','Section gap inside cards.'],
    ['space-6','24px','1.5rem','Gap between cards, default form-row gap.'],
    ['space-8','32px','2rem','Gap between content sections.'],
    ['space-10','40px','2.5rem','Heading → next section gap.'],
    ['space-12','48px','3rem','Page section break.'],
    ['space-16','64px','4rem','Hero section padding (top/bottom).'],
    ['space-24','96px','6rem','Marketing section break.'],
  ];
  const radii = [
    ['radius-xs','3px','kbd, micro chips, faint UI hints'],
    ['radius-sm','4px','chips, badges, small pills'],
    ['radius-md','5px','nav items, menu items'],
    ['radius-lg','6px','buttons, cards, inputs — the default'],
    ['radius-xl','8px','frames, sidesheets, panels'],
    ['radius-2xl','12px','hero, modals, splash surfaces'],
    ['radius-full','9999px','pills, avatars, rounded thumbs'],
  ];
  return (
    <Section id="spacing" num="04" title="Spacing & Radius" desc="A 4px base unit and a 6px radius rhythm — every gap, pad, and corner snaps to the scale so density reads as intentional. Logical properties keep the rhythm correct under RTL.">
      <p style={{color:'var(--fg-muted)', maxWidth:'68ch', marginBottom: 22, lineHeight: 1.6}}>
        Eidos uses a 4px base unit. Component padding lands on a 6/8/12/16 rhythm; section gaps on 24/32/40/56. Radii cap at 12px — there are no soft, marketing-y curves anywhere in the product chrome. The system is built for density: every gap exists because the eye needs to separate content, not for decoration.
      </p>

      {/* Philosophy */}
      <div className="ds-grid cols-3" style={{marginBottom: 24}}>
        {[
          ['4px base', 'Every spacing token is a multiple of 4. Eye-friendly, math-friendly, never breaks the grid.'],
          ['Density first', 'Eidos is a tool, not a marketing site. Padding is calibrated for information per square inch.'],
          ['Capped radii', 'Max radius 12px. Pills are the only element allowed to be fully round.'],
        ].map(([t,d]) => (
          <div key={t} className="surface" style={{padding: 16}}>
            <div className="ds-h-eyebrow" style={{marginBottom: 6}}>{t}</div>
            <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.55}}>{d}</div>
          </div>
        ))}
      </div>

      {/* Spacing scale */}
      <SubHead meta="12 steps">Spacing scale</SubHead>
      <div className="surface" style={{padding: 18, display:'flex', flexDirection:'column', gap: 8}}>
        {scale.map(([name,px,rem,usage]) => (
          <div key={name} style={{display:'grid', gridTemplateColumns:'140px 64px 110px 1fr', columnGap: 24, alignItems:'center'}}>
            <span className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg)'}}>{name}</span>
            <span className="t-mono" style={{fontSize: 'var(--text-base)', color:'var(--fg-subtle)', fontVariantNumeric:'tabular-nums'}}>{px}</span>
            <div className="spacer-bar" style={{width: px}}/>
            <span style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', lineHeight: 1.5, paddingInlineStart: 8}}>{usage}</span>
          </div>
        ))}
      </div>

      {/* Padding rhythm */}
      <SubHead meta="rhythm">Padding rhythm by surface</SubHead>
      <p style={{marginTop: -6, marginBottom: 14, fontSize: 'var(--text-body)', color:'var(--fg-muted)', maxWidth:'68ch', lineHeight: 1.6}}>
        Pick padding by what the surface holds — not by what looks "right". A button's padding is calibrated for the cap-height of Geist 500/13; a card's for breathing space around dense content.
      </p>
      <table className="spec">
        <thead><tr><th>Surface</th><th>Padding</th><th>Gap (children)</th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td className="tok-name">Button (md)</td><td className="mono">0 12px</td><td className="mono">space-2</td><td>32px tall, icon → label = 6px</td></tr>
          <tr><td className="tok-name">Button (sm)</td><td className="mono">0 10px</td><td className="mono">space-1</td><td>26px tall</td></tr>
          <tr><td className="tok-name">Input</td><td className="mono">0 12px</td><td className="mono">space-2</td><td>36px tall, icon → input = 8px</td></tr>
          <tr><td className="tok-name">Card</td><td className="mono">space-4</td><td className="mono">space-3</td><td>head and body share padding</td></tr>
          <tr><td className="tok-name">Section</td><td className="mono">space-6 to space-10</td><td className="mono">space-6</td><td>between cards</td></tr>
          <tr><td className="tok-name">Page</td><td className="mono">space-8 vertical</td><td className="mono">space-12</td><td>between sections</td></tr>
          <tr><td className="tok-name">Modal</td><td className="mono">space-5</td><td className="mono">space-4</td><td>head/body/foot use the same horizontal padding</td></tr>
          <tr><td className="tok-name">Sidesheet</td><td className="mono">space-5</td><td className="mono">space-3</td><td>tighter than modal — column wants density</td></tr>
          <tr><td className="tok-name">Tooltip</td><td className="mono">6px 8px</td><td className="mono">—</td><td>extra-tight — text only</td></tr>
        </tbody>
      </table>

      {/* Padding visualization */}
      <SubHead meta="visualisation">Padding in the wild</SubHead>
      <Frame label="card · button · input — padding bands highlighted">
        <div style={{display:'flex', flexDirection:'column', gap: 18, width:'100%', maxWidth: 560, margin:'0 auto'}}>
          {/* Card with padding shown */}
          <div style={{position:'relative', background:'var(--surface)', border:'1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 16}}>
            <div style={{position:'absolute', inset: 0, padding: 16, pointerEvents:'none'}}>
              <div style={{width:'100%', height:'100%', border:'1px dashed color-mix(in srgb, var(--ember) 40%, transparent)', borderRadius: 'var(--radius-sm)'}}/>
            </div>
            <div style={{color:'var(--fg)', fontWeight: 600, marginBottom: 4}}>Card · padding space-4 (16px)</div>
            <div style={{color:'var(--fg-muted)', fontSize: 'var(--text-base)'}}>The dashed line shows the padding boundary.</div>
          </div>
          {/* Button with padding shown */}
          <div style={{display:'flex', alignItems:'center', gap: 18}}>
            <button className="btn ember" style={{position:'relative', overflow:'visible'}}>
              Deploy <Icons.rocket size={14}/>
            </button>
            <span className="t-mono" style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)'}}>padding 0 12px · gap 6px · 32px tall</span>
          </div>
          {/* Input with padding shown */}
          <div style={{display:'flex', alignItems:'center', gap: 18}}>
            <input style={{height: 36, padding:'0 12px', borderRadius: 'var(--radius-lg)', background:'var(--surface)', border:'1px solid var(--border-strong)', color:'var(--fg)', fontSize: 'var(--text-base)', width: 200}} defaultValue="eidos-api"/>
            <span className="t-mono" style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)'}}>padding 0 12px · 36px tall</span>
          </div>
        </div>
      </Frame>

      {/* Border radius */}
      <SubHead meta="7 steps">Border radius</SubHead>
      <p style={{marginTop: -6, marginBottom: 14, fontSize: 'var(--text-body)', color:'var(--fg-muted)', maxWidth:'68ch', lineHeight: 1.6}}>
        Seven canonical radii. The default is <code style={{fontFamily:'var(--font-mono)', color:'var(--ember)'}}>radius-lg</code> (6px) — the value behind every button, card, and input. Larger radii are for the rare moments a surface should read as elevated; <code style={{fontFamily:'var(--font-mono)', color:'var(--fg)'}}>radius-full</code> is reserved for pills, avatars, and the slider thumb.
      </p>
      <div className="ds-grid cols-4">
        {radii.map(([name,px,use]) => (
          <div key={name} className="surface" style={{padding: 14, display:'flex', flexDirection:'column', gap: 8}}>
            <div style={{height: 64, borderRadius: px, background: 'var(--ember-soft)', border: '1px solid color-mix(in srgb, var(--ember) 25%, transparent)'}}/>
            <div className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg)'}}>{name}</div>
            <div className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-subtle)', fontVariantNumeric:'tabular-nums'}}>{px}</div>
            <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.5}}>{use}</div>
          </div>
        ))}
      </div>

      {/* Radius nesting */}
      <SubHead meta="nesting">Radius nesting</SubHead>
      <p style={{marginTop: -6, marginBottom: 14, fontSize: 'var(--text-body)', color:'var(--fg-muted)', maxWidth:'68ch', lineHeight: 1.6}}>
        Nested surfaces step down one radius level. A modal (12px) holds a card (8px) which holds a button (6px). The eye reads the concentric radii as depth — the same trick a paper folder uses.
      </p>
      <Frame label="modal → card → button">
        <div style={{padding: 24, background:'var(--bg-elevated)', borderRadius: 'var(--radius-2xl)', border:'1px solid var(--border)', maxWidth: 480, width:'100%'}}>
          <div className="t-mono-label" style={{padding: 0, marginBottom: 8}}>radius-2xl · 12px (modal)</div>
          <div style={{padding: 16, background:'var(--surface)', borderRadius: 'var(--radius-xl)', border:'1px solid var(--border)', marginBottom: 14}}>
            <div className="t-mono-label" style={{padding: 0, marginBottom: 8}}>radius-xl · 8px (panel)</div>
            <div style={{padding: 12, background:'var(--bg)', borderRadius: 'var(--radius-lg)', border:'1px solid var(--border-strong)'}}>
              <div className="t-mono-label" style={{padding: 0, marginBottom: 6}}>radius-lg · 6px (card)</div>
              <div style={{display:'flex', gap: 8}}>
                <button className="btn xs ghost" style={{borderRadius: 'var(--radius-lg)'}}>Cancel</button>
                <button className="btn xs ember" style={{borderRadius: 'var(--radius-lg)'}}>Apply</button>
              </div>
            </div>
          </div>
        </div>
      </Frame>

      {/* Anatomy of a card's padding */}
      <SubHead meta="composition">Anatomy of a padded card</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Padding & gap labelled</span></div>
        <div className="ds-frame-body" style={{padding: 56}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative', width: 360}} aria-hidden="true">
              <div style={{background:'var(--surface)', border:'1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 16, position:'relative'}}>
                <div style={{position:'absolute', inset: 16, border:'1px dashed color-mix(in srgb, var(--ember) 30%, transparent)', borderRadius: 'var(--radius-sm)', pointerEvents:'none'}}/>
                <div style={{color:'var(--fg)', fontWeight: 600, marginBottom: 4, fontSize: 'var(--text-md)'}}>Service health</div>
                <div style={{color:'var(--fg-muted)', fontSize: 'var(--text-sm)', marginBottom: 12}}>Uptime over the last 30 days.</div>
                <div style={{color:'var(--fg)', fontSize: 'var(--text-md)'}}>99.94% — within SLO.</div>
              </div>
              <span className="lead h" style={{top: 18, left: -28, width: 24}}/>
              <span className="lead h" style={{top: 56, left: -28, width: 24}}/>
              <span className="lead h" style={{bottom: 18, left: -28, width: 24}}/>
              <span className="lead h" style={{top: 18, right: -28, width: 24}}/>
              <div className="pin" style={{top: 10, left: -52}}>1</div>
              <div className="pin" style={{top: 48, left: -52}}>2</div>
              <div className="pin" style={{bottom: 10, left: -52}}>3</div>
              <div className="pin" style={{top: 10, right: -52}}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 600, margin:'48px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Outer padding.</b> <code style={{fontFamily:'var(--font-mono)', color:'var(--fg)'}}>space-4</code> (16px) all around. The dashed line marks the padding boundary.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Title → desc gap.</b> 4px (~space-1). Description sits visually attached to the title above it.</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Desc → body gap.</b> 12px (<code style={{fontFamily:'var(--font-mono)', color:'var(--fg)'}}>space-3</code>). The asymmetric gap binds the desc to its title and separates from the body.</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Radius.</b> <code style={{fontFamily:'var(--font-mono)', color:'var(--fg)'}}>radius-xl</code> (8px) — one step softer than buttons inside, one step harder than the modal that contains it.</span>
          </div>
        </div>
      </div>

      {/* Vertical rhythm */}
      <SubHead meta="page rhythm">Vertical rhythm</SubHead>
      <p style={{marginTop: -6, marginBottom: 14, fontSize: 'var(--text-body)', color:'var(--fg-muted)', maxWidth:'68ch', lineHeight: 1.6}}>
        Asymmetric gaps bind related blocks. Heading-to-lede is small (~10px); lede-to-content is medium (~24px); section-to-section is large (~40–64px). The asymmetry makes the visual hierarchy obvious without resorting to dividers.
      </p>
      <Frame label="title (10px) · lede (24px) · next section (40px)">
        <div style={{display:'flex', flexDirection:'column', maxWidth: 480, margin:'0 auto'}}>
          <div style={{fontSize: 'var(--text-xl)', fontWeight:600, letterSpacing:'-0.02em', marginBottom: 10}}>Open GMUDs</div>
          <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', marginBottom: 24}}>Three queued, two awaiting approval, one in flight.</div>
          <div style={{padding: 14, background:'var(--surface)', borderRadius: 'var(--radius-lg)', border:'1px solid var(--border)', fontSize: 'var(--text-base)', color:'var(--fg-muted)', marginBottom: 40}}>
            <span style={{color:'var(--fg)', fontWeight: 500}}>GMUD-2148</span> — Promote v4.18 to production
          </div>
          <div style={{fontSize: 'var(--text-xl)', fontWeight:600, letterSpacing:'-0.02em', marginBottom: 10}}>Recent deploys</div>
          <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)'}}>21 in the last 24 hours, all green.</div>
        </div>
      </Frame>

      {/* Touch targets */}
      <SubHead meta="hit targets">Touch & click targets</SubHead>
      <p style={{marginTop: -6, marginBottom: 14, fontSize: 'var(--text-body)', color:'var(--fg-muted)', maxWidth:'68ch', lineHeight: 1.6}}>
        Mobile and pen surfaces require a minimum 44×44 hit area, even when the visual element is smaller. We expand the click region with padding (not size) so the visual stays compact.
      </p>
      <Frame label="visible 24×24 · hit-area 44×44">
        <div style={{display:'flex', gap: 16, alignItems:'center'}}>
          <button style={{position:'relative', width: 44, height: 44, padding: 0, background:'transparent', border:'none', cursor:'pointer'}}>
            <span style={{position:'absolute', inset: 10, background:'var(--surface-active)', borderRadius: 'var(--radius-sm)', display:'flex', alignItems:'center', justifyContent:'center'}}>
              <Icons.x size={14}/>
            </span>
          </button>
          <span className="t-mono" style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)'}}>visible 24×24 · padded to 44×44</span>
        </div>
      </Frame>

      {/* Breakpoints — Phase 1 (Gap Analysis DEF-07) ───────────────────── */}
      <SubHead meta="5 steps · Tailwind-aligned">Breakpoints</SubHead>
      <p style={{marginTop: -6, marginBottom: 14, fontSize: 'var(--text-body)', color:'var(--fg-muted)', maxWidth:'68ch', lineHeight: 1.6}}>
        Five named breakpoints exposed as CSS variables on <code style={{fontFamily:'var(--font-mono)', color:'var(--fg)'}}>:root</code>. Aligned with the Tailwind ladder so contributors moving between systems don't need a mental conversion. Use these in <code style={{fontFamily:'var(--font-mono)', color:'var(--fg)'}}>@media (min-width: var(--bp-md))</code> queries or read them from JS via <code style={{fontFamily:'var(--font-mono)', color:'var(--fg)'}}>getComputedStyle(document.documentElement)</code>.
      </p>
      <table className="spec">
        <thead><tr><th>Token</th><th>Value</th><th>Threshold for</th></tr></thead>
        <tbody>
          {[
            ['--bp-sm',  '640px',  'Phones in landscape. Tight layouts start breathing.'],
            ['--bp-md',  '768px',  'Tablets / small laptops. The default IDP layout (sidebar + content) starts holding shape.'],
            ['--bp-lg',  '1024px', 'Laptops. Multi-column dashboards become useful.'],
            ['--bp-xl',  '1280px', 'Desktop. Three-pane editor / catalog + filters + detail.'],
            ['--bp-2xl', '1536px', 'Wide desktop. Reserve for screens that genuinely need a fourth column.'],
          ].map(([tok, val, desc]) => (
            <tr key={tok}>
              <td className="tok-name">{tok}</td>
              <td className="mono" style={{fontVariantNumeric:'tabular-nums'}}>{val}</td>
              <td>{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Frame label="usage — gate a grid on --bp-lg">
        <pre style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-sm)', color:'var(--fg-muted)', margin: 0, lineHeight: 1.6, width:'100%', textAlign:'start'}}>
{`.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
@media (min-width: 1024px) {       /* var(--bp-lg) */
  .dashboard-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}`}
        </pre>
      </Frame>

      {/* Density — Phase 1 (Gap Analysis DEF-02) ────────────────────────── */}
      <SubHead meta="3 tiers · cascading attribute">Density</SubHead>
      <p style={{marginTop: -6, marginBottom: 14, fontSize: 'var(--text-body)', color:'var(--fg-muted)', maxWidth:'68ch', lineHeight: 1.6}}>
        Three density tiers, declared as an attribute on any container. Every Card / Table / Toolbar inside picks up the matching padding, gap, and font. Replaces per-page <code style={{fontFamily:'var(--font-mono)', color:'var(--fg)'}}>.sm</code> / <code style={{fontFamily:'var(--font-mono)', color:'var(--fg)'}}>.lg</code> modifiers and inline padding overrides.
      </p>
      <Frame label="same table, three density attributes">
        <div style={{display:'flex', flexDirection:'column', gap: 16, width:'100%'}}>
          {[
            ['compact',     'Dense data surfaces — DataTable in a dashboard, sidesheet toolbar, inline grids.'],
            ['comfortable', 'Default. The everyday balance. Equivalent to no [data-density] attribute at all.'],
            ['spacious',    'Marketing / editorial / hero surfaces — onboarding, brand pages, dashboards with screen real estate.'],
          ].map(([d, desc]) => (
            <div key={d} data-density={d} style={{border:'1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow:'hidden'}}>
              <div style={{padding:'8px 14px', background:'var(--bg-elevated)', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap: 10}}>
                <span className="pill"><span className="dot"/> data-density="{d}"</span>
                <span style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)'}}>{desc}</span>
              </div>
              <table className="tbl" style={{width:'100%'}}>
                <thead><tr><th>Service</th><th>Tier</th><th>p95</th><th>Health</th></tr></thead>
                <tbody>
                  <tr><td>eidos-api</td><td><span className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg)'}}>T1</span></td><td className="t-mono" style={{fontVariantNumeric:'tabular-nums'}}>14ms</td><td><span className="pill health-up">Up</span></td></tr>
                  <tr><td>identity-svc</td><td><span className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg)'}}>T1</span></td><td className="t-mono" style={{fontVariantNumeric:'tabular-nums'}}>22ms</td><td><span className="pill health-degraded">Degraded</span></td></tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </Frame>
      <Frame label="usage — drop the attribute on any container">
        <pre style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-sm)', color:'var(--fg-muted)', margin: 0, lineHeight: 1.6, width:'100%', textAlign:'start'}}>
{`<div data-density="compact">
  <Card>...</Card>
  <Toolbar>...</Toolbar>
  <table className="tbl">...</table>
</div>`}
        </pre>
      </Frame>

      {/* RTL */}
      <SubHead meta="bidi">RTL — logical properties</SubHead>
      <p style={{marginTop: -6, marginBottom: 14, fontSize: 'var(--text-body)', color:'var(--fg-muted)', maxWidth:'68ch', lineHeight: 1.6}}>
        Use logical properties (<code style={{fontFamily:'var(--font-mono)', color:'var(--fg)'}}>padding-inline-start</code>, <code style={{fontFamily:'var(--font-mono)', color:'var(--fg)'}}>margin-inline-end</code>) so layout flips automatically under RTL. Physical properties (<code style={{fontFamily:'var(--font-mono)', color:'var(--fg)'}}>padding-left</code>, <code style={{fontFamily:'var(--font-mono)', color:'var(--fg)'}}>padding-right</code>) are forbidden in product code.
      </p>
      <Frame label="logical = correct in both dirs · physical = broken in RTL">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 14}}>
          <div>
            <div className="t-mono-label" style={{padding: 0, marginBottom: 8}}>LTR</div>
            <div style={{padding:'8px 12px 8px 28px', background:'var(--ember-soft)', borderInlineStart:'2px solid var(--ember)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-base)', color:'var(--fg)'}}>
              paddingInlineStart: 28px
            </div>
          </div>
          <div dir="rtl">
            <div className="t-mono-label" style={{padding: 0, marginBottom: 8, fontFamily:'var(--font-mono)'}}>RTL</div>
            <div style={{padding:'8px 12px 8px 28px', background:'var(--ember-soft)', borderInlineStart:'2px solid var(--ember)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-base)', color:'var(--fg)'}}>
              مساحة بادئة: 28 بكسل
            </div>
          </div>
        </div>
      </Frame>

      {/* Accessibility & pairings */}
      <SubHead meta="a11y">Accessibility &amp; pairings</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Target size</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Interactive targets stay at least 44×44px (WCAG 2.5.5 / AAA) — or 24×24px with clear spacing as the AA floor. Where the visible control is smaller, the spacing scale provides the padding or an invisible hit area to reach the target without crowding its neighbours.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Spacing as grouping</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Whitespace conveys relationships — items closer together read as a group. That visual cue is reinforced, not replaced, by semantic structure (headings, <code>fieldset</code>/<code>legend</code>, lists) so a screen reader hears the same grouping a sighted user sees.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Reflow &amp; zoom</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Because spacing is token-based (rem-derived), it scales with the user&apos;s text size and survives 200% zoom and 320px reflow (WCAG 1.4.10) without targets overlapping or padding collapsing.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Logical &amp; RTL</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Spacing uses logical properties (<code>margin-inline</code>, <code>padding-block</code>), so the rhythm mirrors correctly under RTL with no per-direction overrides — layout stays predictable for users in either reading direction.</div>
        </div>
      </div>

      {/* Do/Don't */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — multiples of 4</div>
          <div className="body" style={{flexDirection:'column', gap: 12, alignItems:'flex-start', padding: 16}}>
            <div style={{display:'flex', gap: 8, alignItems:'center'}}><div className="spacer-bar" style={{width: 4}}/><span className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>4</span></div>
            <div style={{display:'flex', gap: 8, alignItems:'center'}}><div className="spacer-bar" style={{width: 8}}/><span className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>8</span></div>
            <div style={{display:'flex', gap: 8, alignItems:'center'}}><div className="spacer-bar" style={{width: 12}}/><span className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>12</span></div>
            <div style={{display:'flex', gap: 8, alignItems:'center'}}><div className="spacer-bar" style={{width: 16}}/><span className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>16</span></div>
          </div>
          <div className="note">Every gap is on the 4-grid. Eye and code agree.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — invent values</div>
          <div className="body" style={{flexDirection:'column', gap: 12, alignItems:'flex-start', padding: 16}}>
            <div style={{display:'flex', gap: 8, alignItems:'center'}}><div className="spacer-bar" style={{width: 7}}/><span className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>7</span></div>
            <div style={{display:'flex', gap: 8, alignItems:'center'}}><div className="spacer-bar" style={{width: 13}}/><span className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>13</span></div>
            <div style={{display:'flex', gap: 8, alignItems:'center'}}><div className="spacer-bar" style={{width: 19}}/><span className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)'}}>19</span></div>
          </div>
          <div className="note">Off-grid values mean every component drifts. Stick to the scale.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — radius nesting</div>
          <div className="body">
            <div style={{padding: 12, background:'var(--surface)', borderRadius: 'var(--radius-xl)', border:'1px solid var(--border)'}}>
              <button className="btn xs ember" style={{borderRadius: 'var(--radius-lg)'}}>Deploy</button>
            </div>
          </div>
          <div className="note">Container 8px → button 6px. The two radii sit concentrically.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — square hole, round peg</div>
          <div className="body">
            <div style={{padding: 12, background:'var(--surface)', borderRadius: 0, border:'1px solid var(--border)'}}>
              <button className="btn xs ember" style={{borderRadius: 16}}>Deploy</button>
            </div>
          </div>
          <div className="note">A round button inside a square card looks like an accident, not a decision.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — logical properties</div>
          <div className="body" style={{padding: 16}}>
            <pre style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-sm)', color:'var(--fg-muted)', margin: 0}}>
{`padding-inline: 12px;
margin-inline-end: 8px;`}
            </pre>
          </div>
          <div className="note">Layout flips automatically under <code style={{fontFamily:'var(--font-mono)'}}>dir="rtl"</code> with zero override.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — physical left/right</div>
          <div className="body" style={{padding: 16}}>
            <pre style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-sm)', color:'var(--fg-muted)', margin: 0}}>
{`padding-left: 12px;
margin-right: 8px;`}
            </pre>
          </div>
          <div className="note">Breaks under RTL — every screen needs a per-component override.</div>
        </div>
      </div>
    </Section>
  );
}
