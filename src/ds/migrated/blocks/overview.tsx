'use client';
// Forge Blocks — Overview. Introduction-style landing; the hero previews a composed section.
import { DsOverview } from '@/components/docs';
import { Icons } from '@/ds/core';

function BlocksHero() {
  const feat: [string, string, string][] = [['rocket', 'Ship', 'CLI deploys'], ['server', 'Own', 'Code, not config'], ['sparkle', 'Assist', 'Agent-ready']];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', height: '100%' }}>
      <div className="surface" style={{ padding: 22, position: 'relative', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="pat-dot-grid" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />
        <div style={{ position: 'relative' }}>
          <div className="ds-h-eyebrow" style={{ fontSize: 'var(--text-xs)', marginBottom: 8 }}>Hero block</div>
          <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, letterSpacing: '-0.01em' }}>Ship Forge products.</div>
          <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', marginTop: 6 }}>Neutral chrome · the page spends its one ember on the CTA below.</div>
          <button className="btn ember sm" style={{ marginTop: 14 }}>Get started</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, flex: '0 0 auto' }}>
        {feat.map(([ic, t, d]) => {
          const I = (Icons as Record<string, any>)[ic];
          return (
            <div key={t} className="surface" style={{ padding: 16 }}>
              <span style={{ width: 32, height: 32, borderRadius: 'var(--radius-lg)', background: 'var(--surface)', color: 'var(--fg-subtle)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><I size={17} /></span>
              <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginTop: 10 }}>{t}</div>
              <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-subtle)', marginTop: 2 }}>{d}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const BLOCKS: [string, string][] = [
  ['hero', 'Hero'], ['feature-grid', 'Feature grid'], ['split-feature', 'Split feature'], ['cta-banner', 'CTA banner'], ['stat-band', 'Stat band'], ['page-headers', 'Page headers'],
];
const D: Record<string, string> = {
  hero: 'Full-bleed opener — eyebrow, title, lede, actions.', 'feature-grid': 'Three-up cards: icon, title, copy.',
  'split-feature': 'Two-column text + visual, alternating.', 'cta-banner': 'Full-width call to action on an ember band.',
  'stat-band': 'A row of headline metrics with sparklines.', 'page-headers': 'Section eyebrow, title, lede, accent stripe.',
};

export default function BlocksOverview() {
  return (
    <DsOverview
      eyebrow="Forge / Blocks"
      title="Compose the page."
      lede="The section-level recipes you assemble a real page from — heroes, feature grids, CTAs, stat bands — built entirely from core primitives and tokens. Copy a block, swap the content, ship the page."
      hero={{
        eyebrow: 'Sections · copy & own',
        heading: 'Pages, not just components.',
        subtitle: 'Sections you copy and own.',
        body: 'Components are the bricks; blocks are the walls. Each one is a documented arrangement of surfaces, headings, and buttons — the rhythm of a landing or a console section, ready to paste and edit.',
        actions: (
          <>
            <a className="btn ember" href="/blocks/hero">Browse blocks <Icons.arrowRight size={14} /></a>
            <a className="btn ghost" href="/blocks/feature-grid">Feature grid</a>
          </>
        ),
        visual: <BlocksHero />,
      }}
      principlesTitle="Principles"
      principles={[
        { t: 'Composition', d: 'A block is only core primitives arranged with intent — no new tokens, no new accent, nothing you can’t recreate by hand.' },
        { t: 'Copy & own', d: 'Paste a block into your page and edit it. Distinct from a component, a block is a starting layout, not a black box.' },
        { t: 'One rhythm', d: 'Alternate split sides, keep one ember CTA per section — a stack of blocks should read as a page, not a pile.' },
      ]}
      tilesTitle="The blocks"
      tiles={BLOCKS.map(([slug, label]) => ({ href: `/blocks/${slug}`, label, desc: D[slug] }))}
      footer={{
        title: 'Need a backdrop?',
        body: 'Pair a block with a texture from Forge Patterns for depth.',
        actions: <a className="btn" href="/patterns/overview">Forge Patterns <Icons.arrowRight size={14} /></a>,
      }}
    />
  );
}
