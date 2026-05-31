'use client';
import * as React from 'react';
import { Section, SubHead, Frame, PropsTable, Icons, Mono } from '@/ds/core';


export default function RadialSpotlightPage() {
  // Signature move: the spotlight's whole job is to direct the eye, so let the
  // hero demo's focal point follow the pointer — driven into the documented
  // --pat-spot-x / --pat-spot-y custom properties, gated by reduced-motion
  // exactly as the Accessibility section prescribes.
  const [spot, setSpot] = React.useState<{ x: string; y: string }>({ x: '50%', y: '50%' });
  const [follow, setFollow] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setFollow(!mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!follow) return;
    const r = e.currentTarget.getBoundingClientRect();
    setSpot({
      x: `${Math.round(((e.clientX - r.left) / r.width) * 100)}%`,
      y: `${Math.round(((e.clientY - r.top) / r.height) * 100)}%`,
    });
  };
  const resetSpot = () => setSpot({ x: '50%', y: '50%' });

  return (
    <Section
      id="pat-radial-spotlight"
      num="05"
      title="Radial spotlight"
      desc="A vignette that fades the edges of a surface, focusing attention on the center (or a corner). Pure CSS, theme-aware via --bg. Stack on top of patterns, charts, or photos to direct the eye."
    >
      <SubHead meta="default · follows the pointer">Default spotlight</SubHead>
      <Frame label={follow ? 'move the pointer over the grid — the beam tracks it' : '.pat-spotlight wraps a child surface (motion paused — reduced-motion)'} code={`<div className="pat-spotlight">
  {/* content */}
</div>`}>
        <div
          className="pat-spotlight pat-linear-grid pat-demo is-tall"
          style={{'--pat-spot-x': spot.x, '--pat-spot-y': spot.y} as React.CSSProperties}
          onPointerMove={onMove}
          onPointerLeave={resetSpot}
        >
          <div style={{position:'relative', background:'var(--surface)', padding:'12px 18px', borderRadius: 'var(--radius-xl)', border:'1px solid var(--border)', fontFamily:'var(--font-mono)', fontSize: 'var(--text-sm)', color:'var(--fg)', display:'flex', alignItems:'center', gap:'var(--space-3)'}}>
            <span>focal point — corners fade out</span>
            <span style={{color:'var(--fg-faint)', fontVariantNumeric:'tabular-nums'}}>{spot.x} / {spot.y}</span>
          </div>
        </div>
      </Frame>
      <p className="ds-caption">The spotlight is rendered as an absolute <Mono>::after</Mono> overlay above the background, below the content (children get <Mono>z-index: 1</Mono>). Here the focal point is bound to the pointer via <Mono>--pat-spot-x / --pat-spot-y</Mono> and the follow is disabled under <Mono>prefers-reduced-motion</Mono>.</p>

      <SubHead meta="position · strength">Variants</SubHead>
      <Frame label="default centered · is-corner (top-right) · is-strong (tighter beam)">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 12, width:'100%'}}>
          <div className="pat-spotlight pat-dot-grid pat-demo is-short">centered</div>
          <div className="pat-spotlight is-corner pat-dot-grid pat-demo is-short">is-corner</div>
          <div className="pat-spotlight is-strong pat-dot-grid pat-demo is-short">is-strong</div>
        </div>
      </Frame>
      <p className="ds-caption">Custom position: set inline <Mono>--pat-spot-x / --pat-spot-y</Mono> (defaults 50% / 50%).</p>

      <SubHead meta="custom position">Custom focal point</SubHead>
      <Frame label="--pat-spot-x: 20% · --pat-spot-y: 80%">
        <div className="pat-spotlight pat-linear-grid pat-demo is-tall" style={{'--pat-spot-x':'20%', '--pat-spot-y':'80%'} as React.CSSProperties}>
          <div style={{position:'absolute', insetInlineStart: 28, bottom: 36, padding:'12px 16px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius: 'var(--radius-xl)', fontSize: 'var(--text-base)', fontWeight: 600}}>
            Newly deployed
            <div style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)', fontFamily:'var(--font-mono)', fontVariantNumeric: 'tabular-nums', marginBlockStart: 'var(--space-1)'}}>v4.18.2 · 6 min ago</div>
          </div>
        </div>
      </Frame>

      <SubHead meta="real applications">In context</SubHead>
      <Frame label="Drawing eye to a deployed service · highlighting an alert">
        <div className="pat-spotlight is-corner pat-mesh pat-demo is-tall" style={{position:'relative', padding: 0}}>
          <div style={{position:'absolute', insetBlockStart: 24, insetInlineEnd: 24, padding: 'var(--space-4)', background:'var(--surface)', border:'1px solid var(--border)', borderRadius: 'var(--radius-xl)', minWidth: 240}}>
            <div style={{display:'flex', alignItems:'center', gap: 'var(--space-2)', marginBlockEnd: 'var(--space-2)'}}>
              <span className="pill severity-p1"><span className="dot"/> P1</span>
              <span style={{fontSize: 'var(--text-xs)', color:'var(--fg-muted)', fontFamily:'var(--font-mono)', fontVariantNumeric: 'tabular-nums'}}>2m ago</span>
            </div>
            <div style={{fontSize: 'var(--text-md)', fontWeight: 600, lineHeight: 1.35}}>p95 latency above 200ms</div>
            <div style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', fontVariantNumeric: 'tabular-nums', marginBlockStart: 'var(--space-1)'}}>identity-svc · 4 min sustained</div>
          </div>
        </div>
      </Frame>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginBlockStart: 'var(--space-3)'}}>
        <div className="surface" style={{padding: 'var(--space-5)'}}>
          <div style={{fontWeight: 600, fontSize: 'var(--text-md)', marginBlockEnd: 'var(--space-2)'}}>Decoration, not meaning</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The vignette directs the sighted eye but stays <Mono>aria-hidden</Mono> / purely decorative — it is never the only thing marking what matters. The focal item also reads first in the DOM and carries its own label or pill, so the emphasis survives without the spotlight.</div>
        </div>
        <div className="surface" style={{padding: 'var(--space-5)'}}>
          <div style={{fontWeight: 600, fontSize: 'var(--text-md)', marginBlockEnd: 'var(--space-2)'}}>Contrast over texture</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The spotlight darkens the edges and can only raise contrast for centred content, never lower it — but corner-anchored copy still rides a solid <Mono>--surface</Mono> card so it stays AA-legible regardless of where the beam falls. It sits below content (children get <Mono>z-index: 1</Mono>), so it never dims the text itself.</div>
        </div>
        <div className="surface" style={{padding: 'var(--space-5)'}}>
          <div style={{fontWeight: 600, fontSize: 'var(--text-md)', marginBlockEnd: 'var(--space-2)'}}>Reduced motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The spotlight is a static overlay — nothing animates, so there is nothing to gate behind <Mono>prefers-reduced-motion</Mono>. If you bind the focal point to the cursor, debounce it and disable the follow when reduced-motion is set.</div>
        </div>
        <div className="surface" style={{padding: 'var(--space-5)'}}>
          <div style={{fontWeight: 600, fontSize: 'var(--text-md)', marginBlockEnd: 'var(--space-2)'}}>Focus order</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The overlay is not focusable and adds no tab stops. The spotlit alert card and its controls keep their natural DOM order, so keyboard focus reaches the highlighted item in the order the eye reads it.</div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — strengthen busy backgrounds</div>
          <div className="body" style={{padding: 0}}>
            <div className="pat-spotlight pat-linear-grid is-dense pat-demo" style={{width:'100%'}}>
              <span className="surface" style={{padding:'6px 12px', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-xs)'}}>foreground stands out</span>
            </div>
          </div>
          <div className="note">A spotlight calms a noisy grid or mesh so the foreground can land.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — apply on a plain surface</div>
          <div className="body" style={{padding: 0}}>
            <div className="pat-spotlight pat-demo" style={{width:'100%', background:'var(--surface)'}}>
              <span style={{fontSize: 'var(--text-xs)', fontFamily:'var(--font-mono)', color:'var(--fg-muted)'}}>nothing to focus from</span>
            </div>
          </div>
          <div className="note">No texture underneath means the fade looks accidental — just dimmer corners.</div>
        </div>
      </div>

      <SubHead meta="CSS tokens">Variables</SubHead>
      <PropsTable
        label=".pat-spotlight — custom properties + modifiers"
        rows={[
          { prop: '--pat-spot-x', type: '<percentage>', default: '50%', description: 'Horizontal focal point.' },
          { prop: '--pat-spot-y', type: '<percentage>', default: '50%', description: 'Vertical focal point.' },
          { prop: 'is-corner',    type: 'class', description: 'Shortcut for top-right focus (100% / 0%).' },
          { prop: 'is-strong',    type: 'class', description: 'Tighter beam — fades more aggressively.' },
        ]}
      />
    </Section>
  );
}
