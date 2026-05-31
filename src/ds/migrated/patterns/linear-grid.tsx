'use client';
import { Section, SubHead, Frame, PropsTable, Icons, Lede, Mono, Kbd } from '@/ds/core';


export default function LinearGridPage() {
  return (
    <Section
      id="pat-linear-grid"
      num="02"
      title="Linear grid"
      desc="Graph-paper cross-hatch as a pure-CSS background — the right texture for workflow editors, drag-and-drop canvases, and technical dashboards where nodes need a snap grid."
    >
      <SubHead meta="default · graph paper">Default</SubHead>
      <Lede>Use it sparingly: on a dense, data-heavy page the grid fights with the content's own visual structure. On a focused editor or canvas surface, it clarifies rather than competes.</Lede>
      <Frame label=".pat-linear-grid" code={`<div className="pat-linear-grid"
     style={{height: 200}} />`}>
        <div className="pat-demo is-tall pat-linear-grid">graph-paper texture · 32px cells</div>
      </Frame>
      <p className="ds-caption">
        Default cell <Mono>32px</Mono>, line <Mono>1px @ --fg 8%</Mono>. Cross-hatch on both axes by default.
      </p>

      <SubHead meta="density · axis">Variants</SubHead>
      <Frame label="dense · default · loose · horizontal-only · vertical-only · ember-tinted">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 'var(--space-3)', width:'100%'}}>
          <div className="pat-demo is-short pat-linear-grid is-dense" style={{fontVariantNumeric:'tabular-nums'}}>dense · 16px</div>
          <div className="pat-demo is-short pat-linear-grid" style={{fontVariantNumeric:'tabular-nums'}}>default · 32px</div>
          <div className="pat-demo is-short pat-linear-grid is-loose" style={{fontVariantNumeric:'tabular-nums'}}>loose · 64px</div>
          <div className="pat-demo is-short pat-linear-grid is-h-only">horizontal only</div>
          <div className="pat-demo is-short pat-linear-grid is-v-only">vertical only</div>
          <div className="pat-demo is-short pat-linear-grid is-ember">ember-tinted</div>
        </div>
      </Frame>
      <p className="ds-caption">
        Override per-instance with <Mono>--pat-line-gap</Mono>, or use the helper classes. Axis variants drop one gradient: <Mono>is-h-only</Mono> keeps rows, <Mono>is-v-only</Mono> keeps columns.
      </p>

      {/* ====================================================================
          IN CONTEXT — every state a canvas surface actually has
          ==================================================================== */}
      <SubHead meta="states · workflow canvas">In context</SubHead>
      <Lede>A canvas surface has four states, and the grid behaves through all of them. Each is shown as its own labelled demo so the texture's job is legible state by state.</Lede>

      {/* — Populated — */}
      <Frame label="Populated — nodes anchored to the grid">
        <div className="pat-linear-grid is-dense" style={{width:'100%', padding:'var(--space-6)', border:'1px solid var(--border)', borderRadius: 'var(--radius-2xl)', position:'relative', minHeight: 240}}>
          <div className="ds-h-eyebrow" style={{marginBlockEnd:'var(--space-3)'}}>Workflow editor</div>
          <div style={{display:'flex', gap:'var(--space-4)', alignItems:'center'}}>
            {['Trigger', 'Validate', 'Deploy', 'Notify'].map((s, i) => (
              <div key={i} style={{display:'flex', alignItems:'center', gap:'var(--space-4)'}}>
                <div className="surface" style={{padding:'10px 14px', borderRadius: 'var(--radius-xl)', fontSize: 'var(--text-sm)', fontWeight: 500}}>{s}</div>
                {i < 3 && <Icons.arrowRight size={14} style={{color:'var(--fg-muted)'}}/>}
              </div>
            ))}
          </div>
          <div style={{marginBlockStart:'var(--space-4)', fontSize: 'var(--text-base)', lineHeight: 1.55, color:'var(--fg-muted)', fontFamily:'var(--font-mono)'}}>The grid anchors nodes — drag-and-drop feels intentional.</div>
        </div>
      </Frame>
      <p className="ds-caption">
        Four steps snap to the dense <Mono>16px</Mono> cell. The cross-hatch reads as a snap canvas, not as data — the nodes carry every label the user must read.
      </p>

      {/* — Loading — */}
      <Frame label="Loading — layout is still resolving">
        <div className="pat-linear-grid is-dense" style={{width:'100%', padding:'var(--space-6)', border:'1px solid var(--border)', borderRadius: 'var(--radius-2xl)', position:'relative', minHeight: 240}} aria-busy="true">
          <div className="ds-h-eyebrow" style={{marginBlockEnd:'var(--space-3)'}}>Workflow editor</div>
          <div style={{display:'flex', gap:'var(--space-4)', alignItems:'center'}}>
            {[88, 104, 96].map((w, i) => (
              <div key={i} style={{display:'flex', alignItems:'center', gap:'var(--space-4)'}}>
                <div className="m-skel" style={{inlineSize: w, blockSize: 40, borderRadius: 'var(--radius-xl)'}}/>
                {i < 2 && <Icons.arrowRight size={14} style={{color:'var(--fg-faint)'}}/>}
              </div>
            ))}
          </div>
          <div style={{display:'flex', alignItems:'center', gap:'var(--space-2)', marginBlockStart:'var(--space-5)', fontSize: 'var(--text-base)', lineHeight: 1.55, color:'var(--fg-muted)', fontFamily:'var(--font-mono)'}}>
            <Icons.refresh size={13} className="pat-grid-spin" aria-hidden="true"/>
            <span style={{fontVariantNumeric:'tabular-nums'}}>Resolving layout · 4 nodes</span>
          </div>
        </div>
      </Frame>
      <p className="ds-caption">
        Skeleton chips ride the same grid as real nodes, so their footprint maps onto the snap cells before the data lands. The spinner pauses under <Mono>prefers-reduced-motion</Mono>.
      </p>

      {/* — Error — */}
      <Frame label="Error — the layout could not be drawn">
        <div className="pat-linear-grid is-dense" style={{width:'100%', padding:'var(--space-6)', border:'1px solid var(--border)', borderRadius: 'var(--radius-2xl)', position:'relative', minHeight: 240, display:'grid', placeItems:'center'}}>
          <div className="alert danger" role="alert" style={{maxInlineSize: 380}}>
            <span className="alert-icon"><Icons.alert size={16}/></span>
            <div className="alert-body">
              <div className="alert-title">Couldn't render the canvas layout</div>
              <div className="alert-desc" style={{lineHeight: 1.55}}>The grid stays visible so the surface still reads as an editor, not a blank crash. Retry rebuilds the node graph in place.</div>
              <div style={{display:'flex', gap:'var(--space-2)', marginBlockStart:'var(--space-2)'}}>
                <button className="btn outline sm"><Icons.refresh size={13}/> Retry</button>
                <span className="pill danger" style={{fontVariantNumeric:'tabular-nums'}}>error 504</span>
              </div>
            </div>
          </div>
        </div>
      </Frame>
      <p className="ds-caption">
        On failure the grid is the only thing that keeps the region legible as a canvas. The error rides a <Mono>role="alert"</Mono> danger surface — it is announced, not just drawn.
      </p>

      {/* — Empty + the snap micro-interaction — */}
      <Frame label="Empty — the grid signals “drop a node here”">
        <div className="pat-linear-grid is-dense" style={{width:'100%', border:'1px solid var(--border)', borderRadius: 'var(--radius-2xl)', position:'relative', minHeight: 200, display:'grid', placeItems:'center'}}>
          {/* Innovation: the placeholder node SNAPS to the nearest grid intersection on
              hover/focus — the crosshair leads draw the snap target, the chip eases onto
              it. Pure-CSS via .pat-grid-snap; gated by prefers-reduced-motion. */}
          <button type="button" className="surface pat-grid-snap" style={{position:'relative', padding:'12px 16px', borderRadius: 'var(--radius-xl)', textAlign:'center', boxShadow:'var(--elev-1)', border:'1px solid var(--border)', cursor:'pointer'}}>
            <span aria-hidden="true" className="pat-grid-snap-lead h"/>
            <span aria-hidden="true" className="pat-grid-snap-lead v"/>
            <Icons.plus size={16} style={{color:'var(--fg-muted)'}}/>
            <div style={{fontSize:'var(--text-sm)', fontWeight: 600, marginBlockStart:'var(--space-1)'}}>Drop a step</div>
            <div style={{fontSize:'var(--text-xs)', color:'var(--fg-muted)', fontFamily:'var(--font-mono)', marginBlockStart: 2, fontVariantNumeric:'tabular-nums'}}>snaps to 16px cell</div>
          </button>
        </div>
      </Frame>
      <p className="ds-caption">
        The empty editor is the grid's defining state: with no nodes yet, the cross-hatch is the only thing telling the user this surface is a snap canvas — a blank panel would read as broken. <b>Hover or focus the chip</b> to watch it snap to the nearest intersection.
      </p>

      {/* ====================================================================
          ACCESSIBILITY — concrete keyboard map + real ARIA/contrast/motion
          ==================================================================== */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginBlockStart:'var(--space-3)'}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBlockEnd:'var(--space-2)'}}>Decoration, not meaning</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The grid is a canvas texture, never a data grid: it sits on a CSS <Mono>background-image</Mono> with no DOM, so it is invisible to assistive tech and carries no axis, scale, or grouping meaning. The canvas region above it takes <Mono>role="application"</Mono>; the texture itself exposes nothing.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBlockEnd:'var(--space-2)'}}>Contrast over texture</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Lines hold at <Mono>--fg @ 8%</Mono> so node cards and labels keep AA contrast on top. Nodes ride a solid <Mono>--surface</Mono> chip rather than floating on bare lines, so text legibility never depends on the grid density behind it.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBlockEnd:'var(--space-2)'}}>Reduced motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The grid itself is static. The snap nudge and the loading spinner both sit behind <Mono>prefers-reduced-motion</Mono>: the chip lands instantly and the spinner freezes, so nothing animates for users who opt out.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBlockEnd:'var(--space-2)'}}>Focus order</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The decorative layer is not focusable and adds no tab stops. Nodes drawn over the grid keep their DOM order, so tabbing across a pipeline follows the inline step order the eye reads — and the empty-state chip is a real <Mono>{'<button>'}</Mono> with a focus-visible ring.</div>
        </div>
      </div>
      <div className="surface" style={{padding: 18, marginBlockStart:'var(--space-3)'}}>
        <div className="ds-h-eyebrow" style={{marginBlockEnd:'var(--space-2)'}}>Keyboard — canvas built over the grid</div>
        <div style={{display:'grid', gap: 2}}>
          <Kbd label="Move focus to the next / previous node" keys={['Tab']}/>
          <Kbd label="Nudge the selected node by one cell" meta="16px" keys={['↑', '↓', '←', '→']}/>
          <Kbd label="Nudge by a sub-cell step" meta="2px" keys={['Shift', '+', '↑']}/>
          <Kbd label="Pan the canvas" keys={['Space', '+', 'Drag']}/>
          <Kbd label="Zoom in / out" meta="snaps grid density" keys={['+', '/', '−']}/>
          <Kbd label="Add a step at the focused intersection" keys={['Enter']}/>
        </div>
      </div>

      {/* ====================================================================
          ANATOMY — the snapped node, the cell, the line
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{padding: '64px 36px 56px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage pat-linear-grid is-dense" style={{position:'relative', inlineSize: 220, blockSize: 132, borderRadius: 'var(--radius-xl)', border:'1px solid var(--border)', display:'grid', placeItems:'center'}} aria-hidden="true">
              <div className="surface" style={{padding:'10px 14px', borderRadius: 'var(--radius-xl)', fontSize:'var(--text-sm)', fontWeight: 500, boxShadow:'var(--elev-1)'}}>Validate</div>
              <span className="lead v" style={{top: -24, left: '50%', height: 20, transform:'translateX(-50%)'}}/>
              <span className="lead h" style={{top: '50%', right: -28, width: 24}}/>
              <span className="lead h" style={{bottom: 12, left: -28, width: 24}}/>
              <div className="pin" style={{top: -42, left: '50%', transform:'translateX(-50%)'}}>1</div>
              <div className="pin" style={{top: 'calc(50% - 9px)', right: -52}}>2</div>
              <div className="pin" style={{bottom: 3, left: -52}}>3</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
            <span className="num">1</span><span style={{fontVariantNumeric:'tabular-nums'}}><b style={{color:'var(--fg)'}}>Node.</b> A solid <Mono>--surface</Mono> chip on <Mono>--elev-1</Mono>. Snaps to a cell origin; never floats on a bare line.</span>
            <span className="num">2</span><span style={{fontVariantNumeric:'tabular-nums'}}><b style={{color:'var(--fg)'}}>Cell.</b> <Mono>--pat-line-gap</Mono> = 16 / 32 / 64px. The snap unit — every node origin lands on a multiple of it.</span>
            <span className="num">3</span><span style={{fontVariantNumeric:'tabular-nums'}}><b style={{color:'var(--fg)'}}>Line.</b> <Mono>--pat-line-width</Mono> 1px @ <Mono>--fg 8%</Mono>. Theme-aware; cross-hatch on both axes by default.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — pair with a single accent</div>
          <div className="body" style={{padding: 0}}>
            <div className="pat-demo pat-linear-grid is-dense" style={{width:'100%'}}>
              <div style={{padding:'6px 12px', background:'var(--ember)', color:'var(--ember-fg)', borderRadius: 'var(--radius-lg)', fontWeight: 600, fontSize: 'var(--text-xs)'}}>Active</div>
            </div>
          </div>
          <div className="note">The grid is decoration; let one ember surface be the only loud thing.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — stack on a dense data table</div>
          <div className="body" style={{padding: 0}}>
            <div className="pat-demo pat-linear-grid is-dense" style={{width:'100%', flexDirection:'column', alignItems:'stretch', justifyContent:'flex-start'}}>
              <div style={{padding:'6px 10px', borderBlockEnd:'1px solid var(--border)', fontSize: 'var(--text-xs)', color:'var(--fg-muted)', fontFamily:'var(--font-mono)', fontVariantNumeric:'tabular-nums'}}>row 1 · row 2 · row 3</div>
            </div>
          </div>
          <div className="note">Tables already have visual grid. A second one underneath fights with the rows.</div>
        </div>
      </div>

      <SubHead meta="CSS tokens">Variables</SubHead>
      <PropsTable
        label=".pat-linear-grid — custom properties"
        rows={[
          { prop: '--pat-line-color', type: '<color>', default: 'color-mix(in srgb, var(--fg) 8%, transparent)', description: 'Line color. Theme-aware via --fg.' },
          { prop: '--pat-line-gap',   type: '<length>', default: '32px', description: 'Spacing between lines.' },
          { prop: '--pat-line-width', type: '<length>', default: '1px', description: 'Line thickness.' },
        ]}
      />
    </Section>
  );
}
