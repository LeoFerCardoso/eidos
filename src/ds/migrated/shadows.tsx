'use client';
// Eidos DS — Foundations / Elevation (surfaces + borders + shadows)
import { Icons, Frame, Section, SubHead, Mono, Lede } from '@/ds/core';


/* Eight tones × two themes — the canonical ladder. Each entry is the
   semantic name, the role, and a one-line cue for when to reach for it.
   Render order intentionally mirrors visual elevation: deepest at the
   bottom, highest at the top, so reading down the table feels like
   diving into the page. */
/* Seven tiers × current theme — the canonical Eidos v1.1 ladder. */
const SURFACE_LADDER = [
  ['surface-active',  'Pressed / selected',   'Active state — clearly the lightest tier in dark mode.'],
  ['surface-overlay', 'Floating layer',       'Popover · dropdown · modal body · sidesheet.'],
  ['surface-hover',   'Hover row',            'Row hover, ghost button hover — sits above surface.'],
  ['surface',         'Default raised',       'Card · frame · panel container. The workhorse.'],
  ['bg-elevated',     'Topbar zone',          'Topbar, sidebar group, code well inside a frame.'],
  ['bg',              'Page background',     'The page itself — not pure black.'],
  ['canvas',          'Deepest',              'Only behind floating layers (modal / sidesheet backdrop).'],
];

export default function Elevation() {
  return (
    <Section id="shadows" num="05" title="Elevation" desc="Depth via surface tones, border weights, and shadow tiers — not drop-shadow soup. Lift with tone and a hairline first; reserve real shadow for surfaces that genuinely float.">
      <Lede wide>
        <b style={{color:'var(--fg)'}}>Elevation in Eidos is a recipe, not a token.</b> Every raised layer
        combines three things — a <b style={{color:'var(--fg)'}}>surface tone</b>, a <b style={{color:'var(--fg)'}}>border</b>, and an optional <b style={{color:'var(--fg)'}}>shadow</b>. The
        canvas is a soft dark grey (never pure black), so a card lifting one
        notch above it reads as <i>on the page</i>, not floating. Floating is
        reserved for things that truly leave the page surface — popovers,
        modals, sheets. The ladder below covers both themes; the same
        semantic tokens produce theme-appropriate values automatically.
      </Lede>

      {/* Philosophy */}
      <div className="ds-grid cols-3" style={{marginBottom: 28}}>
        {[
          ['Surface tone does the lifting', 'A 2–3% lightness step is enough to separate a card from the canvas. The eye reads tonal contrast faster than a halo.'],
          ['Hairlines define the edge', '6–18% borders carry the silhouette in both themes. The shadow tells you the layer floats — the hairline tells you where it ends.'],
          ['Shadows mean float, not decoration', 'A shadow promises the element is above the page. Use it only when that promise is true — popovers, modals, sheets.'],
        ].map(([t,d]) => (
          <div key={t} className="surface" style={{padding: 16}}>
            <div className="ds-h-eyebrow" style={{marginBottom: 6}}>{t}</div>
            <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.55}}>{d}</div>
          </div>
        ))}
      </div>

      {/* ────────────────────────────────────────────────────────────────────
          SURFACES — the tonal ladder
          ─────────────────────────────────────────────────────────────────── */}
      <SubHead meta="7 tones · dark + light">Surfaces</SubHead>
      <Lede wide up>
        The previous palette anchored the canvas at <Mono>#08090A</Mono> — essentially pure
        black. Cards on top of it read as floating popovers, and modals had
        nowhere left to climb. The new ladder lifts the canvas into the
        oklch(0.18) family — a soft cool-neutral dark grey, the same tone
        terminals and code editors use for chrome — and gives every raised
        tone a perceptible 2–3% step above it. <Mono>bg-elevated</Mono> drops <i>below</i> the
        canvas for inset wells like code blocks inside a card.
      </Lede>

      {/* Side-by-side ladder — both themes share the same row labels */}
      {/* Surfaces ladder — one stack, theme-aware. Each row IS the swatch —
          the row's background paints the actual surface tone at full width,
          so the depth ladder reads as a single cross-section of the page.
          Sunken is offset below the divider to communicate "below canvas." */}
      <div style={{
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-2xl)',
        padding: 20,
      }}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 16}}>
          <div className="t-mono-label" style={{padding: 0}}>Surface ladder · cross-section</div>
          <div className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-subtle)'}}>same tokens · theme-aware · switch via the topbar pill</div>
        </div>

        {/* Above-canvas tones — stacked top-down so highest elevation reads first */}
        <div style={{display:'flex', flexDirection:'column', gap: 0, border:'1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow:'hidden'}}>
          {SURFACE_LADDER.filter(([n]) => n !== 'bg' && n !== 'canvas').map(([name, role, cue]) => (
            <div key={name} style={{
              display:'grid',
              gridTemplateColumns: '180px 160px 1fr',
              alignItems:'center', gap: 16,
              padding: '14px 18px',
              background: `var(--${name})`,
              borderBottom: '1px solid var(--border)',
            }}>
              <span className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-subtle)'}}>--{name}</span>
              <span style={{fontSize: 'var(--text-base)', color:'var(--fg)', fontWeight: 500}}>{role}</span>
              <span style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', lineHeight: 1.5}}>{cue}</span>
            </div>
          ))}
          {/* bg — the row whose tone matches the wrapper. Reads as the "page line." */}
          {(() => {
            const [name, role, cue] = SURFACE_LADDER.find(([n]) => n === 'bg');
            return (
              <div style={{
                display:'grid',
                gridTemplateColumns: '180px 160px 1fr',
                alignItems:'center', gap: 16,
                padding: '14px 18px',
                background: `var(--${name})`,
                borderTop: '1px dashed var(--border-strong)',
                borderBottom: '1px dashed var(--border-strong)',
              }}>
                <span className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-subtle)'}}>--{name}</span>
                <span style={{fontSize: 'var(--text-base)', color:'var(--fg)', fontWeight: 500}}>{role}</span>
                <span style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', lineHeight: 1.5}}>{cue}  <span style={{color:'var(--fg-subtle)'}}>← page line</span></span>
              </div>
            );
          })()}
        </div>

        {/* Below-page tone — visually separated so the "sunk in" relationship is obvious */}
        <div style={{marginTop: 8, paddingInlineStart: 18}}>
          {(() => {
            const [name, role, cue] = SURFACE_LADDER.find(([n]) => n === 'canvas');
            return (
              <div style={{
                display:'grid',
                gridTemplateColumns: '180px 160px 1fr',
                alignItems:'center', gap: 16,
                padding: '14px 18px',
                background: `var(--${name})`,
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
              }}>
                <span className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-subtle)'}}>--{name}</span>
                <span style={{fontSize: 'var(--text-base)', color:'var(--fg)', fontWeight: 500}}>{role}</span>
                <span style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', lineHeight: 1.5}}>{cue}  <span style={{color:'var(--fg-subtle)'}}>← behind modals</span></span>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Tiers, layered — pure visual demo of the depth ladder. Five nested
          cards step UP one tier each. The eye watches each child rise above
          its parent purely by tone + a 1px hairline. No shadow needed at
          this scale — depth is doing the work. */}
      <SubHead meta="stacked demo">The tiers, layered</SubHead>
      <Lede wide up>
        The core idea of Eidos v1.1: <b style={{color:'var(--fg)'}}>depth in dark mode is real</b>. Each elevation is a combination of (1) a lighter surface tier, (2) a 1px inset highlight on the top edge, and (3) a soft drop shadow underneath. The inset highlight is what tells the eye "this is above the surface" without resorting to thick borders. Toggle the topbar pill to verify the same layering reads in light.
      </Lede>
      <Frame label="canvas → bg → bg-elevated → surface → surface-hover">
        {(() => {
          const tiers = [
            ['--canvas',        'Z-0'],
            ['--bg',            'Z-1, elev-1'],
            ['--bg-elevated',   'Z-2, elev-2'],
            ['--surface',       'Z-3, elev-2'],
            ['--surface-hover', 'Z-4, elev-3'],
          ];
          const render = (i) => {
            const [tok, label] = tiers[i];
            const isLast = i === tiers.length - 1;
            return (
              <div style={{
                background: `var(${tok})`,
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: isLast ? '20px 24px' : '20px 24px 24px',
                width: '100%',
                boxShadow: i === 0 ? 'none' : `var(--elev-${Math.min(i, 3)})`,
              }}>
                <div style={{
                  fontFamily:'var(--font-mono)', fontFeatureSettings:"'tnum','zero'", fontSize: 'var(--text-xs)', letterSpacing: '0.08em', textTransform: 'uppercase',
                  padding: 0, marginBottom: isLast ? 0 : 14,
                  color:'var(--fg-muted)',
                  display:'flex', alignItems:'baseline', gap: 10,
                }}>
                  <span style={{color:'var(--fg)'}}>{tok}</span>
                  <span style={{color:'var(--fg-faint)'}}>({label})</span>
                </div>
                {!isLast && render(i + 1)}
              </div>
            );
          };
          return render(0);
        })()}
      </Frame>
      <p className="ds-caption">Five nested cards, each one tier higher on the surface ladder and one tier higher on the elevation ladder. The lift comes from <i>both</i> a lighter tone AND a soft shadow — never one alone.</p>

      {/* Stack diagram — show a real composition: canvas → base → sunken (code) → overlay (modal) */}
      <SubHead meta="composition">A typical surface stack</SubHead>
      <Lede wide up>
        A real page is rarely just two layers. A dashboard tile (base) holds a
        code well (sunken). Hovering it lifts to (hover). Opening a modal
        floats (overlay) over a backdrop. Every token in this stack swaps
        cleanly when the theme flips.
      </Lede>
      <Frame label="canvas → bg → bg-elevated → surface → hover → overlay">
        <div style={{padding: 28, background:'var(--bg)', borderRadius: 10, width:'100%', position:'relative', overflow:'hidden'}}>
          <div className="t-mono-label" style={{padding:0, marginBottom: 10}}>--bg (page)</div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 16}}>
            <div style={{padding: 16, background:'var(--surface)', borderRadius: 'var(--radius-xl)', border:'1px solid var(--border)', boxShadow:'var(--elev-1)'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 12}}>
                <span style={{fontSize: 'var(--text-base)', color:'var(--fg)', fontWeight: 600}}>checkout-api</span>
                <span className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-subtle)'}}>--surface</span>
              </div>
              <pre style={{
                margin: 0, padding: 12,
                background:'var(--bg-elevated)',
                border:'1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                fontFamily:'var(--font-mono)', fontFeatureSettings:"'tnum','zero'", fontSize: 'var(--text-xs)',
                color:'var(--fg-muted)', lineHeight: 1.6,
              }}>
                <div className="t-mono-label" style={{padding:0, marginBottom: 4}}>--bg-elevated</div>
                forge deploy --canary=10
              </pre>
            </div>
            <div style={{padding: 16, background:'var(--surface-hover)', borderRadius: 'var(--radius-xl)', border:'1px solid var(--border)', boxShadow:'var(--elev-2)'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 8}}>
                <span style={{fontSize: 'var(--text-base)', color:'var(--fg)', fontWeight: 600}}>identity-svc</span>
                <span className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-subtle)'}}>--surface-hover</span>
              </div>
              <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)'}}>Card on hover — lifted with elev-2.</div>
            </div>
          </div>
          <div style={{
            marginTop: 16,
            padding: 14,
            background:'var(--surface-overlay)',
            borderRadius: 'var(--radius-xl)',
            border:'1px solid var(--border-strong)',
            boxShadow:'var(--elev-3)',
            maxWidth: 360,
          }}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 4}}>
              <span style={{fontSize: 'var(--text-base)', color:'var(--fg)', fontWeight: 600}}>Confirm deploy?</span>
              <span className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-subtle)'}}>--surface-overlay</span>
            </div>
            <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.5}}>Floats above the page on elev-3 + border-strong.</div>
          </div>
        </div>
      </Frame>

      {/* ────────────────────────────────────────────────────────────────────
          BORDERS — kept from the previous page
          ─────────────────────────────────────────────────────────────────── */}
      <SubHead meta="3 weights">Borders</SubHead>
      <Lede up>
        Three opacities of pure white (dark) / slate ink (light). <Mono>--border</Mono> is the
        everyday hairline; <Mono>--border-strong</Mono> wraps inputs and divides major regions;
        <Mono> --border-stronger</Mono> only shows on hovered borders and inside the focus halo.
      </Lede>
      <div className="ds-grid cols-3">
        {[
          {
            name: '--border',
            pct: '6%',
            val: 'rgba(255,255,255,0.06)',
            where: 'card · row · panel divider',
            sample: (
              <div style={{display:'flex', flexDirection:'column', gap: 0, background:'var(--surface)', borderRadius: 'var(--radius-lg)', overflow:'hidden', border:'1px solid rgba(255,255,255,0.06)'}}>
                {['forge-api', 'forge-web', 'forge-worker'].map((s, i) => (
                  <div key={s} style={{padding:'8px 12px', fontSize: 'var(--text-base)', color:'var(--fg)', borderTop: i ? '1px solid rgba(255,255,255,0.06)' : 'none', display:'flex', justifyContent:'space-between'}}>
                    <span>{s}</span>
                    <span className="t-mono" style={{color:'var(--fg-subtle)', fontSize: 'var(--text-xs)'}}>healthy</span>
                  </div>
                ))}
              </div>
            ),
          },
          {
            name: '--border-strong',
            pct: '12%',
            val: 'rgba(255,255,255,0.12)',
            where: 'input · button outline · region divider',
            sample: (
              <div style={{display:'flex', flexDirection:'column', gap: 8}}>
                <div style={{height: 30, padding:'0 10px', display:'flex', alignItems:'center', borderRadius: 'var(--radius-lg)', background:'var(--surface)', border:'1px solid rgba(255,255,255,0.12)', fontSize: 'var(--text-base)', color:'var(--fg-muted)', fontVariantNumeric:'tabular-nums'}}>v4.18.0</div>
                <button tabIndex={-1} style={{height: 28, padding:'0 12px', borderRadius: 'var(--radius-lg)', background:'transparent', border:'1px solid rgba(255,255,255,0.12)', color:'var(--fg)', fontSize: 'var(--text-base)', alignSelf:'flex-start', cursor:'default'}}>Cancel</button>
              </div>
            ),
          },
          {
            name: '--border-stronger',
            pct: '18%',
            val: 'rgba(255,255,255,0.18)',
            where: 'hover state · focus halo',
            sample: (
              <div style={{display:'flex', flexDirection:'column', gap: 8}}>
                <div style={{height: 30, padding:'0 10px', display:'flex', alignItems:'center', borderRadius: 'var(--radius-lg)', background:'var(--surface)', border:'1px solid rgba(255,255,255,0.18)', fontSize: 'var(--text-base)', color:'var(--fg)', fontVariantNumeric:'tabular-nums'}}>v4.18.0 <span className="t-mono" style={{marginInlineStart:'auto', color:'var(--fg-subtle)', fontSize: 'var(--text-xs)'}}>:hover</span></div>
                <button tabIndex={-1} style={{height: 28, padding:'0 12px', borderRadius: 'var(--radius-lg)', background:'transparent', border:'1px solid rgba(255,255,255,0.18)', color:'var(--fg)', fontSize: 'var(--text-base)', alignSelf:'flex-start', cursor:'default'}}>Cancel <span className="t-mono" style={{marginInlineStart: 6, color:'var(--fg-subtle)', fontSize: 'var(--text-xs)'}}>:hover</span></button>
              </div>
            ),
          },
        ].map(({name, pct, val, where, sample}) => (
          <div key={name} className="surface" style={{padding: 16, position:'relative', overflow:'hidden'}}>
            <div aria-hidden="true" style={{
              position:'absolute', top: 12, insetInlineEnd: 12,
              width: 56, height: 56, borderRadius: 'var(--radius-lg)',
              background:'var(--bg)', border:'1px solid var(--border)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <div style={{
                width: 36, height: 6, borderRadius: 1,
                background: val,
                boxShadow:`0 0 0 1px ${val}`,
              }}/>
            </div>
            <div style={{paddingInlineEnd: 76, marginBottom: 14, minHeight: 76, display:'flex', alignItems:'center'}}>
              <div style={{flex: 1, minWidth: 0}}>{sample}</div>
            </div>
            <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: 4, gap: 8, flexWrap:'wrap'}}>
              <span className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-subtle)'}}>{name}</span>
              <span className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-subtle)'}}>{pct} white</span>
            </div>
            <div style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', lineHeight: 1.5}}>{where}</div>
          </div>
        ))}
      </div>

      {/* SHADOWS — single column, theme-aware. Each tile rests on the
          canvas with surface fill so the halo reads against a real
          page surface, not a fake preview. */}
      <SubHead meta="5 tiers + 1 ember">Shadows</SubHead>
      <Lede wide up>
        Five elevation tiers plus one ember halo. In dark mode each tier composites a <b style={{color:'var(--fg)'}}>1px inset highlight</b> on the top edge with a soft drop shadow — that highlight is what tells the eye "this is above the surface" without resorting to thick borders. Light mode drops the inset (a white line on white surfaces reads as a grey shadow) and leans on tinted slate-ink drops. <Mono>--elev-ember</Mono> is the only coloured halo allowed in chrome — reserve it for the primary CTA when it must demand attention.
      </Lede>
      <div style={{
        background:'var(--bg)',
        border:'1px solid var(--border)',
        borderRadius: 10,
        padding: 28,
      }}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 20}}>
          {[
            ['elev-0',     'flush',          'No elevation. Flush with the parent.'],
            ['elev-1',     'cards · inputs', 'Cards, inputs, default frames. Inset highlight + 1px drop.'],
            ['elev-2',     'hover',          'Hover state, prominent cards.'],
            ['elev-3',     'popover · sheet','Sidesheet, popover, dropdown.'],
            ['elev-4',     'modal',          'Modal. The highest tier.'],
            ['elev-ember', 'CTA glow',       'Active CTA halo. Use sparingly.'],
          ].map(([name, role, cue]) => (
            <div key={name} style={{display:'flex', flexDirection:'column', gap: 10}}>
              <div style={{
                height: 92, borderRadius: 'var(--radius-xl)',
                background:'var(--surface)',
                border: name === 'elev-ember' ? '1px solid var(--ember)' : '1px solid var(--border)',
                boxShadow: `var(--${name})`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:'var(--font-mono)', fontFeatureSettings:"'tnum','zero'", fontSize: 'var(--text-xs)',
                color: name === 'elev-ember' ? 'var(--ember)' : 'var(--fg-muted)',
                letterSpacing:'0.04em',
              }}>{name}</div>
              <div style={{display:'flex', flexDirection:'column', gap: 2}}>
                <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', gap: 8}}>
                  <span className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-subtle)'}}>--{name}</span>
                  <span className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-subtle)'}}>{role}</span>
                </div>
                <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', lineHeight: 1.5}}>{cue}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recipe table */}
      <SubHead meta="recipes">Elevation recipe per tier</SubHead>
      <table className="spec">
        <thead><tr><th>Token</th><th>Recipe (dark)</th><th>Recipe (light)</th></tr></thead>
        <tbody>
          <tr><td className="tok-name">--elev-0</td><td className="mono" colSpan={2} style={{color:'var(--fg-subtle)'}}>none — flush with the surface</td></tr>
          <tr><td className="tok-name">--elev-1</td><td className="mono">inset 0 1px 0 / 4% white · 0 1px 2px / 30% black</td><td className="mono">0 1px 1px / 4% · 0 1px 2px / 5% slate</td></tr>
          <tr><td className="tok-name">--elev-2</td><td className="mono">inset 0 1px 0 / 6% · 0 2px 6px / 36%</td><td className="mono">0 1px 2px / 5% · 0 2px 6px / 6%</td></tr>
          <tr><td className="tok-name">--elev-3</td><td className="mono">inset 0 1px 0 / 7% · 0 8px 24px / 42% · 0 2px 6px / 28%</td><td className="mono">0 2px 4px / 6% · 0 6px 14px / 8% · 0 16px 32px / 6%</td></tr>
          <tr><td className="tok-name">--elev-4</td><td className="mono">inset 0 1px 0 / 8% · 0 24px 48px / 50% · 0 8px 16px / 30%</td><td className="mono">0 4px 8px / 7% · 0 12px 28px / 10% · 0 32px 64px / 10%</td></tr>
          <tr><td className="tok-name">--elev-ember</td><td className="mono" colSpan={2}>1px ember outline · 4px ember-soft halo · 24px ember drop</td></tr>
        </tbody>
      </table>

      {/* ────────────────────────────────────────────────────────────────────
          ELEVATION RECIPES — the canonical "surface + border + shadow" table
          ─────────────────────────────────────────────────────────────────── */}
      <SubHead meta="recipe">Elevation = surface + border + shadow</SubHead>
      <Lede wide up>
        Every interactive surface in Eidos picks one row from this table.
        Reading left-to-right: <i>what is it</i> → <i>which tone</i> → <i>which hairline</i> → <i>which halo</i>. The
        further down the table, the more genuinely the element floats.
      </Lede>
      <table className="spec">
        <thead><tr><th>Surface</th><th>Tone</th><th>Border</th><th>Elevation</th><th>Why</th></tr></thead>
        <tbody>
          <tr><td className="tok-name">Card / panel (static)</td><td className="mono">surface</td><td className="mono">--border</td><td className="mono">elev-1</td><td>Lives on the page — inset highlight + 1px drop is enough.</td></tr>
          <tr><td className="tok-name">Card / panel (interactive)</td><td className="mono">surface → surface-hover</td><td className="mono">--border</td><td className="mono">elev-1 → elev-2</td><td>Resting lift; hover bumps one tier on both axes.</td></tr>
          <tr><td className="tok-name">Input / button (rest)</td><td className="mono">surface</td><td className="mono">--border-strong</td><td className="mono">elev-0</td><td>Border weight signals interactivity, not shadow.</td></tr>
          <tr><td className="tok-name">Inset well (code · scrollback)</td><td className="mono">bg-elevated</td><td className="mono">--border</td><td className="mono">elev-0</td><td>Sunken inside a card — looks pressed in, not lifted.</td></tr>
          <tr><td className="tok-name">Sticky header / toolbar</td><td className="mono">bg-elevated</td><td className="mono">--border bottom</td><td className="mono">elev-2</td><td>Soft halo promises the page slides under it.</td></tr>
          <tr><td className="tok-name">Tooltip</td><td className="mono">surface-overlay</td><td className="mono">none</td><td className="mono">elev-2</td><td>Tiny, transient — minimal lift, no border.</td></tr>
          <tr><td className="tok-name">Popover / dropdown / menu</td><td className="mono">surface-overlay</td><td className="mono">--border-strong</td><td className="mono">elev-3</td><td>Anchored layer above content.</td></tr>
          <tr><td className="tok-name">Toast / snackbar</td><td className="mono">surface-overlay</td><td className="mono">--border-strong</td><td className="mono">elev-3</td><td>Free-floating in a page corner.</td></tr>
          <tr><td className="tok-name">Sidesheet / drawer</td><td className="mono">surface-overlay</td><td className="mono">--border-strong</td><td className="mono">elev-3</td><td>Slides over content; carries its own weight.</td></tr>
          <tr><td className="tok-name">Modal / command palette</td><td className="mono">surface-overlay</td><td className="mono">--border-strong</td><td className="mono">elev-4</td><td>Demands attention; longest halo in the system.</td></tr>
          <tr><td className="tok-name">Primary CTA (active)</td><td className="mono">ember</td><td className="mono">ember outline</td><td className="mono">elev-ember</td><td>The one coloured halo allowed in chrome — sparingly.</td></tr>
        </tbody>
      </table>

      {/* Gradation strip */}
      <SubHead meta="ramp">Stepping through the ramp</SubHead>
      <Frame label="elev-0 → elev-4 · same card at each tier">
        <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap: 14, padding:'18px 6px 32px'}}>
          {[0,1,2,3,4].map(n => (
            <div key={n} style={{
              padding: 14,
              background:'var(--surface)',
              border:'1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: `var(--elev-${n})`,
              minHeight: 88,
              display:'flex', flexDirection:'column', justifyContent:'space-between',
            }}>
              <div style={{fontSize: 'var(--text-sm)', color:'var(--fg)', fontWeight: 500}}>Card</div>
              <div className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-subtle)'}}>elev-{n}</div>
            </div>
          ))}
        </div>
      </Frame>

      {/* Hairline vs shadow visual comparison */}
      <SubHead meta="separation">Hairline vs shadow — same job, different cost</SubHead>
      <Frame label="hairlines separate without competing · shadows compete unless they're floating">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 18}}>
          <div>
            <div className="t-mono-label" style={{padding: 0, marginBottom: 10}}>Hairlines (preferred for chrome)</div>
            <div style={{display:'flex', flexDirection:'column', gap: 12}}>
              {[1,2,3].map(i => (
                <div key={i} style={{padding: 14, background:'var(--surface)', border:'1px solid var(--border)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-base)', color:'var(--fg)'}}>
                  Card {i} — clean, no halo
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="t-mono-label" style={{padding: 0, marginBottom: 10}}>Shadows (avoid on chrome)</div>
            <div style={{display:'flex', flexDirection:'column', gap: 12}}>
              {[1,2,3].map(i => (
                <div key={i} style={{padding: 14, background:'var(--surface)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-base)', color:'var(--fg)', boxShadow:'0 4px 12px rgba(0,0,0,0.4)'}}>
                  Card {i} — competing halos
                </div>
              ))}
            </div>
          </div>
        </div>
      </Frame>

      {/* Focus ring */}
      <SubHead meta="ember">Ember focus ring</SubHead>
      <Lede up>
        The focus halo is the only ember "glow" allowed on chrome. One recipe — <Mono>border-color: var(--ember)</Mono> + <Mono>box-shadow: 0 0 0 3px var(--ember-soft)</Mono> — for every focusable element. Keyboard-only — <Mono>:focus-visible</Mono> never fires from a click.
      </Lede>
      <Frame label="focus ring · same recipe everywhere" code={`/* the canonical focus ring */
.element:focus-visible {
  outline: none;
  border-color: var(--ember);
  box-shadow: 0 0 0 3px var(--ember-soft);
}`}>
        <div style={{display:'flex', gap: 16, alignItems:'center', flexWrap:'wrap'}}>
          <button className="btn ember" style={{boxShadow:'0 0 0 3px var(--ember-soft)'}}>Focused button</button>
          <input style={{height: 36, padding:'0 12px', borderRadius: 'var(--radius-lg)', background:'var(--surface)', border:'1px solid var(--ember)', color:'var(--fg)', fontSize: 'var(--text-base)', boxShadow:'0 0 0 3px var(--ember-soft)'}} defaultValue="Focused input"/>
          <span className="pill ember ember-pulse"><span className="dot"/>live</span>
        </div>
      </Frame>

      {/* Anatomy of a floating modal — kept from the previous page */}
      <SubHead meta="composition">Anatomy of a floating surface</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Modal — surface-overlay + border-strong + shadow-5</span></div>
        <div className="ds-frame-body" style={{padding: '64px 36px 56px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative', width: 360}} aria-hidden="true">
              <div style={{padding: 0, background:'var(--surface-overlay)', borderRadius: 'var(--radius-2xl)', border:'1px solid var(--border-strong)', boxShadow:'var(--elev-4)', overflow:'hidden'}}>
                <div style={{padding: 18}}>
                  <div style={{color:'var(--fg)', fontWeight: 600, fontSize: 'var(--text-body)', marginBottom: 4}}>Confirm deploy?</div>
                  <div style={{color:'var(--fg-muted)', fontSize: 'var(--text-base)'}}>This will roll out v4.18 to production.</div>
                </div>
                <div style={{padding:'12px 18px', background:'var(--surface-overlay)', borderTop:'1px solid var(--border)', display:'flex', justifyContent:'flex-end', gap: 8}}>
                  <button className="btn xs ghost" tabIndex={-1}>Cancel</button>
                  <button className="btn xs ember" tabIndex={-1}>Deploy</button>
                </div>
              </div>
              <span className="lead h" style={{top: 22, insetInlineStart: -28, width: 24}}/>
              <span className="lead h" style={{top: 0, insetInlineEnd: -28, width: 24}}/>
              <span className="lead h" style={{bottom: 22, insetInlineStart: -28, width: 24}}/>
              <span className="lead h" style={{bottom: -8, insetInlineEnd: -28, width: 24}}/>
              <div className="pin" style={{top: 14, insetInlineStart: -52}}>1</div>
              <div className="pin" style={{top: -8, insetInlineEnd: -52}}>2</div>
              <div className="pin" style={{bottom: 14, insetInlineStart: -52}}>3</div>
              <div className="pin" style={{bottom: -16, insetInlineEnd: -52}}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 600, margin:'56px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Surface.</b> <Mono>--surface-overlay</Mono> — the highest static tone, lifts the modal cleanly above the canvas without any shadow doing the work alone.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Border.</b> <Mono>--border-strong</Mono> (12% white) defines the shape — even with a heavy shadow, the edge needs a hairline to read crisp.</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Footer tint.</b> <Mono>--surface-overlay</Mono> background separates the action row visually without a divider.</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Shadow.</b> <Mono>--elev-4</Mono> — composite key (8/16) + ambient (24/48). Long, soft, well below the surface. Promises the modal is genuinely floating.</span>
          </div>
        </div>
      </div>

      {/* Accessibility & pairings */}
      <SubHead meta="a11y">Accessibility &amp; pairings</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Depth is never the only cue</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>A shadow is invisible to many low-vision users and vanishes in high-contrast modes. So every elevated surface also carries a hairline border and a tone step — the layer is legible even with shadows stripped away.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Border contrast (AA)</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Because the border does the structural work, it must clear AA non-text contrast (3:1) against both the surface behind it and the one it bounds. On busy surfaces step from <Mono>--border</Mono> up to <Mono>--border-strong</Mono>.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus over elevation</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The ember focus ring (<Mono>--ring</Mono>) and the ember focus shadow sit above every tier so a focused control on a floating surface is always visible. Don&apos;t let a heavy shadow swallow the ring.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Hover-lift and shadow-deepen transitions ease with <Mono>--ease</Mono>. Under <Mono>prefers-reduced-motion</Mono> drop the lift and let the border / tone state convey the change instead.</div>
        </div>
      </div>

      {/* Do/Don't — kept */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — lift with tone first</div>
          <div className="body">
            <div style={{padding: 14, background:'var(--surface)', border:'1px solid var(--border)', borderRadius: 'var(--radius-lg)', width: 200, fontSize: 'var(--text-base)', color:'var(--fg)'}}>
              Card · surface + hairline
            </div>
          </div>
          <div className="note">The 2% tonal step + hairline separates the card. No shadow needed.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — drop-shadow every card</div>
          <div className="body">
            <div style={{padding: 14, background:'var(--surface)', borderRadius: 'var(--radius-lg)', width: 200, fontSize: 'var(--text-base)', color:'var(--fg)', boxShadow:'0 8px 16px rgba(0,0,0,0.5)'}}>
              Card · halo on a static surface
            </div>
          </div>
          <div className="note">Static cards aren't floating. The shadow lies about elevation.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — pure black sits on canvas</div>
          <div className="body" style={{flexDirection:'column', gap: 8}}>
            <div style={{padding: 14, background:'var(--bg)', border:'1px solid var(--border)', borderRadius: 'var(--radius-lg)', width: 220, fontSize: 'var(--text-base)', color:'var(--fg)'}}>
              Page background · canvas
            </div>
            <span className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-subtle)'}}>oklch(0.18 ...) — soft dark</span>
          </div>
          <div className="note">A real surface, not a void. Cards on top read as on the page, not floating.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — pure black canvas</div>
          <div className="body" style={{flexDirection:'column', gap: 8}}>
            <div style={{padding: 14, background:'rgba(0,0,0,1)', border:'1px solid var(--border)', borderRadius: 'var(--radius-lg)', width: 220, fontSize: 'var(--text-base)', color:'var(--fg)'}}>
              Page background · #000
            </div>
            <span className="t-mono" style={{fontSize: 'var(--text-xs)', color:'var(--fg-subtle)'}}>reads as a void, not a surface</span>
          </div>
          <div className="note">Pure black erases the bottom of the elevation ladder — every card looks like a popover.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — shadow on truly floating layers</div>
          <div className="body">
            <div style={{padding: 14, background:'var(--surface-overlay)', borderRadius: 'var(--radius-lg)', width: 220, fontSize: 'var(--text-base)', color:'var(--fg)', boxShadow:'var(--elev-3)', border:'1px solid var(--border-strong)'}}>
              <div style={{fontWeight: 600, marginBottom: 4}}>Popover</div>
              <div style={{color:'var(--fg-muted)', fontSize: 'var(--text-base)'}}>Anchored to a trigger, dismisses on click-away.</div>
            </div>
          </div>
          <div className="note">Popovers, modals, palettes earn their halo — they actually float above the page.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — coloured halos</div>
          <div className="body">
            <div style={{padding: 14, background:'var(--surface)', borderRadius: 'var(--radius-lg)', width: 200, fontSize: 'var(--text-base)', color:'var(--fg)', boxShadow:'0 8px 24px rgba(255,107,53,0.6)', border:'1px solid var(--ember)'}}>
              Ember halo on chrome
            </div>
          </div>
          <div className="note">Ember is for action and focus, not marketing-style "lift". Save it for the things you want clicked.</div>
        </div>
      </div>
    </Section>
  );
}
