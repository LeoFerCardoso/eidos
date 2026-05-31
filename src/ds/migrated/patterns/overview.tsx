'use client';
// Forge Patterns — Overview. Introduction-style landing; the hero is a grid of textures.
import type { ReactNode } from 'react';
import { DsOverview } from '@/components/docs';
import { Icons } from '@/ds/core';

function PatternsHero() {
  const swatch = (cls: string, label: string, inner?: ReactNode) => (
    <div style={{ position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--border)', minHeight: 150 }}>
      <div className={`pat-demo ${cls}`} style={{ height: '100%' }}>{inner}</div>
      {/* Mono swatch label on the fixed scale (t-mono-label = --text-xs/11px), in --fg-muted
          over a frosted token-driven pill so it stays legible across the mesh/conic textures. */}
      <span
        className="t-mono-label"
        style={{
          position: 'absolute',
          insetInlineStart: 8,
          insetBlockEnd: 8,
          textTransform: 'none',
          color: 'var(--fg-muted)',
          padding: '3px 7px',
          borderRadius: 'var(--radius-full)',
          background: 'color-mix(in srgb, var(--bg) 62%, transparent)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        {label}
      </span>
    </div>
  );
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: '1fr', gap: 10, width: '100%', height: '100%' }}>
      {swatch('pat-dot-grid', 'dot-grid')}
      {swatch('pat-mesh', 'mesh')}
      {/* The conic-orb swatch demonstrates itself: is-spin runs the live conic sweep and
          already self-disables under prefers-reduced-motion (the static glow remains —
          motion-safe rule defined in ds.css). The orb is centered so the spin reads as a
          clean rotating light source rather than drifting from the flow corner. */}
      {swatch('', 'conic-orb', (
        <span
          className="pat-conic-orb is-sm is-spin"
          aria-hidden="true"
          style={{ position: 'absolute', insetBlockStart: '50%', insetInlineStart: '50%', marginBlockStart: -80, marginInlineStart: -80 }}
        />
      ))}
      {swatch('pat-spotlight', 'spotlight')}
    </div>
  );
}

const PATTERNS: [string, string][] = [
  ['dot-grid', 'Dot grid'], ['linear-grid', 'Linear grid'], ['mesh-gradient', 'Mesh gradient'], ['conic-orb', 'Conic orb'],
  ['radial-spotlight', 'Radial spotlight'], ['noise-grain', 'Noise grain'], ['ember-glow', 'Ember glow'], ['gradient-border', 'Gradient border'],
];
const D: Record<string, string> = {
  'dot-grid': 'Calm dotted backdrop for heroes and empty states.', 'linear-grid': 'Blueprint grid for technical surfaces.',
  'mesh-gradient': 'Soft multi-stop gradient blooms.', 'conic-orb': 'Rotating conic light source.',
  'radial-spotlight': 'Focal glow that follows the eye.', 'noise-grain': 'Subtle film grain over flat fills.',
  'ember-glow': 'The signature ember halo, used sparingly.', 'gradient-border': 'Hairline borders with an ember→ice sweep.',
};

export default function PatternsOverview() {
  return (
    <DsOverview
      eyebrow="Forge / Patterns"
      title="Texture & depth."
      lede="Decorative surfaces that lift other components — grids, gradients, glows, grain. Pure CSS and SVG painted over the same token graph; they never introduce a new accent and never become a page-level shell."
      hero={{
        eyebrow: 'CSS / SVG · token-driven',
        heading: 'The quietest layer in Forge.',
        subtitle: 'Pure CSS & SVG over the tokens.',
        body: 'Reach for a texture to anchor a hero or warm an empty state — one per screen, behind one focal element. Every pattern derives from --ember / --ice / surface tokens, so it re-tints with the theme automatically.',
        actions: (
          <>
            <a className="btn ember" href="/patterns/mesh-gradient">Browse patterns <Icons.arrowRight size={14} /></a>
            <a className="btn ghost" href="/patterns/ember-glow">Ember glow</a>
          </>
        ),
        visual: <PatternsHero />,
      }}
      principlesTitle="Principles"
      principles={[
        { t: 'Restraint', d: 'One textured surface per screen, behind one focal element. If two patterns compete, both lose.' },
        { t: 'Token-driven', d: 'Colors come from --ember/--ice/surface — never hard-coded — so a pattern flips light/dark with everything else.' },
        { t: 'Decoration, not structure', d: 'Patterns adorn; they never carry meaning or become a layout. Content sits above them, fully legible.' },
      ]}
      tilesTitle="The patterns"
      tiles={PATTERNS.map(([slug, label]) => ({ href: `/patterns/${slug}`, label, desc: D[slug] }))}
      footer={{
        title: 'Composing a landing?',
        body: 'Pair a pattern backdrop with a Hero or CTA from Forge Blocks.',
        actions: <a className="btn" href="/blocks/overview">Forge Blocks <Icons.arrowRight size={14} /></a>,
      }}
    />
  );
}
