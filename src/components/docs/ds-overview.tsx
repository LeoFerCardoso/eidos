'use client';
// Shared overview layout — the Introduction shell, reused by every sub-DS Overview so the
// family reads consistently. The only thing each DS swaps is the hero's right column
// (`hero.visual`) — domain elements instead of the stat cards on the main Introduction.
import * as React from 'react';
import { Icons } from '@/ds/core';

export type OverviewTile = { href: string; label: string; desc: string };
export type OverviewNote = { t: string; d: string };

export function DsOverview({
  eyebrow,
  title,
  lede,
  hero,
  principlesTitle = 'Principles',
  principles,
  tilesTitle = 'Start here',
  tiles,
  footer,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede: React.ReactNode;
  hero: { eyebrow?: string; heading: React.ReactNode; subtitle?: React.ReactNode; body: React.ReactNode; actions?: React.ReactNode; visual: React.ReactNode; bleed?: boolean };
  principlesTitle?: string;
  principles?: OverviewNote[];
  tilesTitle?: string;
  tiles?: OverviewTile[];
  footer?: { title: string; body: string; actions?: React.ReactNode };
}) {
  return (
    <section className="ds-section" style={{ paddingTop: 24 }}>
      <div className="ds-h-eyebrow" style={{ color: 'var(--ember)' }}>{eyebrow}</div>
      <h1 className="ds-h1">{title}</h1>
      <p className="ds-lede">{lede}</p>

      <div className="ds-hero">
        <div className="grid" />
        <div className="glow" />
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 44, alignItems: 'stretch', minHeight: 320 }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {hero.eyebrow && <div className="ds-h-eyebrow" style={{ marginBottom: 10 }}>{hero.eyebrow}</div>}
            {/* Title + subtitle share the main Introduction hero's size & colors:
                title in --fg, subtitle in --fg-muted, both at --text-3xl. */}
            <div style={{ fontSize: 'var(--text-3xl)', lineHeight: 1.1, letterSpacing: '-0.025em', fontWeight: 600 }}>
              {hero.heading}
              {hero.subtitle && <><br /><span style={{ color: 'var(--fg-muted)' }}>{hero.subtitle}</span></>}
            </div>
            <p style={{ color: 'var(--fg-muted)', maxWidth: '48ch', lineHeight: 1.55, marginTop: 12, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{hero.body}</p>
            {hero.actions && <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap', alignItems: 'center' }}>{hero.actions}</div>}
          </div>
          <div className={'ds-hero-visual' + (hero.bleed ? ' ds-hero-visual--bleed' : '')}>{hero.visual}</div>
        </div>
      </div>

      {principles && principles.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <div className="ds-sub"><span>{principlesTitle}</span><span className="meta" style={{ fontVariantNumeric: 'tabular-nums' }}>{principles.length} axes</span></div>
          <div className={'ds-grid ' + (principles.length >= 3 ? 'cols-3' : 'cols-2')}>
            {principles.map((p) => (
              <div key={p.t} className="surface" style={{ padding: 20 }}>
                <div style={{ fontSize: 'var(--text-body)', fontWeight: 600, marginBottom: 6, letterSpacing: '-0.005em' }}>{p.t}</div>
                <div className="t-small" style={{ color: 'var(--fg-muted)' }}>{p.d}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tiles && tiles.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <div className="ds-sub"><span>{tilesTitle}</span><span className="meta" style={{ fontVariantNumeric: 'tabular-nums' }}>{tiles.length}</span></div>
          <div className="comp-grid">
            {tiles.map((t) => (
              <a key={t.href} href={t.href} className="comp-tile" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="name">{t.label}</span>
                  <Icons.arrowRight size={14} color="var(--fg-faint)" />
                </div>
                <p className="desc">{t.desc}</p>
              </a>
            ))}
          </div>
        </div>
      )}

      {footer && (
        <div style={{ marginTop: 56, padding: 24, border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, letterSpacing: '-0.01em' }}>{footer.title}</div>
            <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', marginTop: 4 }}>{footer.body}</div>
          </div>
          {footer.actions && <div style={{ display: 'flex', gap: 8 }}>{footer.actions}</div>}
        </div>
      )}
    </section>
  );
}
