'use client';
// Forge Mobile — Image Grid. A gap-tight grid of square thumbnails in the Photos-app
// idiom. Supports 3-up and 4-up column counts, an optional overflow "+N" tile, and a
// lead/hero tile that spans two columns. Use for screenshots, asset galleries, attachment
// grids, and media pickers. Tiles never use real <img> — placeholder gradients with a
// glyph keep the demo realistic without broken image links.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono } from '@/ds/core';

// ─── Placeholder tile colours (warm-neutral palette, no real photos) ──────────
const TILE_GRADIENTS = [
  'linear-gradient(135deg, oklch(0.32 0.02 60) 0%, oklch(0.26 0.015 50) 100%)',
  'linear-gradient(135deg, oklch(0.29 0.025 220) 0%, oklch(0.22 0.02 210) 100%)',
  'linear-gradient(150deg, oklch(0.30 0.02 80) 0%, oklch(0.24 0.018 70) 100%)',
  'linear-gradient(120deg, oklch(0.28 0.03 160) 0%, oklch(0.22 0.025 150) 100%)',
  'linear-gradient(140deg, oklch(0.31 0.022 300) 0%, oklch(0.24 0.018 290) 100%)',
  'linear-gradient(135deg, oklch(0.30 0.028 30) 0%, oklch(0.23 0.022 20) 100%)',
  'linear-gradient(130deg, oklch(0.27 0.018 100) 0%, oklch(0.21 0.014 95) 100%)',
  'linear-gradient(145deg, oklch(0.33 0.016 240) 0%, oklch(0.26 0.012 235) 100%)',
  'linear-gradient(135deg, oklch(0.29 0.032 10) 0%, oklch(0.22 0.028 5) 100%)',
];

const Tile = React.forwardRef<
  HTMLButtonElement,
  {
    index: number;
    hero?: boolean;
    columns: 3 | 4;
    overflow?: number;
    label?: string;
    tabIndex: number;
    onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
    onFocus: () => void;
  }
>(function Tile({ index, hero, columns, overflow, label, tabIndex, onKeyDown, onFocus }, ref) {
  // Each tile is 1fr; hero spans 2 columns
  const colSpan = hero ? 2 : 1;
  const grad = TILE_GRADIENTS[index % TILE_GRADIENTS.length];

  return (
    <button
      ref={ref}
      type="button"
      role="listitem"
      className="focus-ring"
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      style={{
        gridColumn: `span ${colSpan}`,
        aspectRatio: hero ? `${colSpan} / 1` : '1 / 1',
        // Transparent 44px-min tap target so dense 4-up tiles stay activatable on narrow screens
        minInlineSize: 44,
        minBlockSize: 44,
        borderRadius: 2,
        background: grad,
        border: 'none',
        padding: 0,
        margin: 0,
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
      aria-label={label ?? `Photo ${index + 1}`}
    >
      {/* Subtle glyph so the tile reads as "image placeholder" not "broken" */}
      <Icons.image size={hero ? 22 : columns === 3 ? 16 : 13} color="rgba(255,255,255,0.18)" />
      {overflow != null && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(10,9,7,0.62)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: columns === 3 ? 17 : 15,
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            fontVariantNumeric: 'tabular-nums',
            color: 'var(--fg)',
            letterSpacing: '-0.01em',
          }}
        >
          +{overflow}
        </span>
      )}
    </button>
  );
});

function ImageGrid({
  columns = 3,
  hero = false,
  overflow,
  count = 9,
}: {
  columns?: 3 | 4;
  hero?: boolean;
  overflow?: number;
  count?: number;
}) {
  const tiles = Array.from({ length: count }, (_, i) => i);
  const rest = tiles.slice(hero ? 1 : 0);

  // Roving tabindex: only the active tile is in the tab order; arrow keys move focus.
  const [active, setActive] = React.useState(0);
  const btnRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  // Total focusable tiles = hero (if any) + the rest. The hero counts as one cell
  // that visually spans two columns, but for grid navigation we treat it as a single stop.
  const total = (hero ? 1 : 0) + rest.length;

  const focusTile = React.useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(total - 1, next));
    setActive(clamped);
    btnRefs.current[clamped]?.focus();
  }, [total]);

  const handleKeyDown = React.useCallback(
    (idx: number) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
      // RTL-aware: ArrowRight/Left map to inline-next/prev via the resolved direction.
      const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          focusTile(idx + (rtl ? -1 : 1));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          focusTile(idx + (rtl ? 1 : -1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          focusTile(idx + columns);
          break;
        case 'ArrowUp':
          e.preventDefault();
          focusTile(idx - columns);
          break;
        case 'Home':
          e.preventDefault();
          focusTile(0);
          break;
        case 'End':
          e.preventDefault();
          focusTile(total - 1);
          break;
        // Enter / Space activate natively on <button>; no handler needed.
      }
    },
    [columns, focusTile, total],
  );

  let cell = 0; // running index across all focusable tiles
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 2,
      }}
      role="list"
      aria-label="Photo grid"
    >
      {hero &&
        (() => {
          const idx = cell++;
          return (
            <Tile
              key="hero"
              index={0}
              hero
              columns={columns}
              label="Hero photo — spans two columns"
              ref={(el) => { btnRefs.current[idx] = el; }}
              tabIndex={active === idx ? 0 : -1}
              onKeyDown={handleKeyDown(idx)}
              onFocus={() => setActive(idx)}
            />
          );
        })()}
      {rest.map((i, pos) => {
        const isLast = pos === rest.length - 1;
        const showOverflow = isLast && overflow != null;
        const idx = cell++;
        return (
          <Tile
            key={i}
            index={i}
            columns={columns}
            overflow={showOverflow ? overflow : undefined}
            label={showOverflow ? `${overflow} more photos` : `Screenshot ${i + 1}`}
            ref={(el) => { btnRefs.current[idx] = el; }}
            tabIndex={active === idx ? 0 : -1}
            onKeyDown={handleKeyDown(idx)}
            onFocus={() => setActive(idx)}
          />
        );
      })}
    </div>
  );
}

// ─── DeviceFrame screen ────────────────────────────────────────────────────────
function ImageGridScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* Nav bar */}
      <div
        style={{
          height: 50,
          flex: '0 0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingInline: 14,
          borderBlockEnd: '1px solid var(--border)',
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Attachments</span>
        <span style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>24 items</span>
      </div>
      {/* Section label */}
      <div
        style={{
          paddingInline: 14,
          paddingBlock: '10px 6px',
          fontSize: 'var(--text-xs)',
          fontFamily: 'var(--font-mono)',
          color: 'var(--fg-muted)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        Screenshots · Apr 2025
      </div>
      {/* 3-up grid with hero tile */}
      <div style={{ paddingInline: 14, flex: 1, overflow: 'hidden' }}>
        <ImageGrid columns={3} hero count={8} overflow={16} />
      </div>
      {/* Bottom tab bar stub */}
      <div
        style={{
          height: 52,
          flex: '0 0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          borderBlockStart: '1px solid var(--border)',
          paddingBlockEnd: 4,
        }}
      >
        {[
          { ic: <Icons.image size={20} />, label: 'Library', active: true },
          { ic: <Icons.folder size={20} />, label: 'Albums', active: false },
          { ic: <Icons.search size={20} />, label: 'Search', active: false },
        ].map(({ ic, label, active }) => (
          <button
            key={label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              background: 'transparent',
              border: 'none',
              padding: '4px 10px',
              minWidth: 44,
              minHeight: 44,
              cursor: 'pointer',
              color: active ? 'var(--accent)' : 'var(--fg-muted)',
            }}
            aria-label={label}
          >
            {ic}
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Variants ─────────────────────────────────────────────────────────────────
function VariantGrid({
  label,
  columns,
  hero,
  overflow,
  count,
}: {
  label: string;
  columns: 3 | 4;
  hero?: boolean;
  overflow?: number;
  count?: number;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', letterSpacing: '0.04em' }}>{label}</div>
      <div style={{ width: columns === 3 ? 180 : 220 }}>
        <ImageGrid columns={columns} hero={hero} overflow={overflow} count={count ?? (hero ? 6 : 9)} />
      </div>
    </div>
  );
}

export default function MobileImageGrid() {
  return (
    <Section
      id="image-grid"
      num="01"
      title="Image Grid"
      desc="A gap-tight square-tile grid for screenshots, asset galleries, and attachment pickers. 3-up or 4-up columns, an optional hero/lead tile, and an overflow badge when the set is too large to show in full."
    >
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>Keep the gap at 2px — the tight seam is the signature. Never add padding between tiles or round their corners; the flush edge is what creates the mosaic feel.</Lede>
      <Frame label="3-up grid with a hero tile and +16 overflow · tap a device to switch" center>
        <DeviceFrame initial="iphone-se"><ImageGridScreen /></DeviceFrame>
      </Frame>

      <SubHead meta="variants">Variants</SubHead>
      <Frame label="3-up · 4-up · with hero tile · with overflow badge">
        <div style={{ display: 'flex', gap: 36, flexWrap: 'wrap', justifyContent: 'center', padding: '28px 24px' }}>
          <VariantGrid label="3-up" columns={3} count={9} />
          <VariantGrid label="4-up" columns={4} count={12} />
          <VariantGrid label="3-up + hero" columns={3} hero count={7} />
          <VariantGrid label="3-up + overflow" columns={3} overflow={14} count={9} />
        </div>
      </Frame>

      <SubHead meta="a11y">Accessibility</SubHead>
      <Lede>Keyboard support, semantics, and contrast are true to the shipped grid: a roving tabindex over <Mono>role=&quot;listitem&quot;</Mono> buttons, per-tile labels, and a 44px tap floor.</Lede>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Keyboard map</div>
          <table className="t-small" style={{ width: '100%', borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums' }}>
            <tbody>
              {[
                ['Arrow ← / →', 'Move focus to the inline-prev / next tile (direction-aware)'],
                ['Arrow ↑ / ↓', 'Move focus one row up / down (jumps by column count)'],
                ['Home / End', 'Jump to the first / last tile'],
                ['Enter / Space', 'Activate the focused tile (native button)'],
                ['Tab', 'Enters the grid once, then arrows navigate (roving tabindex)'],
              ].map(([k, v]) => (
                <tr key={k} style={{ verticalAlign: 'top' }}>
                  <td style={{ paddingBlock: 4, paddingInlineEnd: 12, whiteSpace: 'nowrap' }}><Mono>{k}</Mono></td>
                  <td style={{ paddingBlock: 4, color: 'var(--fg-muted)' }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Roles &amp; screen reader</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)' }}>The container is <Mono>role=&quot;list&quot;</Mono> with <Mono>aria-label=&quot;Photo grid&quot;</Mono>; each tile is a <Mono>role=&quot;listitem&quot;</Mono> button. Every tile carries an <Mono>aria-label</Mono> describing its content — e.g. &quot;Screenshot 3&quot;. The overflow tile reads &quot;14 more photos&quot; rather than &quot;+14&quot;, and the scrim digit is <Mono>aria-hidden</Mono>.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Touch target ≥ 44px</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)' }}>In 4-up mode on narrow screens tiles may render under 44px. Each tile button carries a <Mono>min-inline-size</Mono> / <Mono>min-block-size</Mono> of 44px so the tap target stays reliable without zooming.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBlockEnd: 6 }}>Focus &amp; contrast</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)' }}>The focused tile gets the canonical ember <Mono>.focus-ring</Mono> on its boundary. The overflow badge text (<Mono>var(--fg)</Mono>) sits on a <Mono>rgba(10,9,7,0.62)</Mono> scrim for AA contrast, in tabular mono for legibility at small sizes. Static placeholder gradients carry no motion — nothing to gate behind reduced-motion.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — the grid fills from inline-start (right) and the hero tile leads from the right edge'} center>
        <div dir="rtl" style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 210 }}>
            <ImageGrid columns={3} hero count={8} overflow={16} />
          </div>
        </div>
      </Frame>
      <Lede>CSS Grid with <Mono>grid-template-columns: repeat(N, 1fr)</Mono> respects the inline flow direction automatically. In RTL the first tile is placed at the inline-start (right) edge and tiles fill row-by-row from right to left. The hero tile leads from the right, and <Mono>ArrowRight</Mono>/<Mono>ArrowLeft</Mono> swap to follow the resolved direction. No <Mono>scaleX(-1)</Mono> needed — the grid algorithm handles layout mirroring.</Lede>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 64px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 210 }} aria-hidden="true">
              {/* 3-up grid: hero + 4 regular + 1 overflow */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                {/* Hero tile */}
                <div style={{ gridColumn: 'span 2', aspectRatio: '2/1', background: TILE_GRADIENTS[1], borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.image size={18} color="rgba(255,255,255,0.18)" />
                </div>
                {/* Regular tile */}
                <div style={{ aspectRatio: '1/1', background: TILE_GRADIENTS[2], borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.image size={13} color="rgba(255,255,255,0.18)" />
                </div>
                {[3, 4, 5].map((idx, pos) => (
                  <div key={idx} style={{ aspectRatio: '1/1', borderRadius: 2, background: idx === 5 ? 'rgba(10,9,7,0.62)' : TILE_GRADIENTS[idx], display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                    {idx !== 5 && <Icons.image size={13} color="rgba(255,255,255,0.18)" />}
                    {idx === 5 && (
                      <>
                        <div style={{ position: 'absolute', inset: 0, background: TILE_GRADIENTS[idx % TILE_GRADIENTS.length] }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,9,7,0.62)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg)' }}>+9</div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              {/* Anatomy pins */}
              <span className="lead h" style={{ top: 20, left: -28, width: 24 }} />
              <span className="lead v" style={{ top: -22, left: '33%', height: 18 }} />
              <span className="lead h" style={{ top: 20, right: -28, width: 24 }} />
              <span className="lead v" style={{ bottom: -22, left: '83%', height: 18, transform: 'translateX(-50%)' }} />
              <span className="lead h" style={{ bottom: 20, left: -28, width: 24 }} />
              <div className="pin" style={{ top: 10, left: -52 }}>1</div>
              <div className="pin" style={{ top: -42, left: '33%', transform: 'translateX(-50%)' }}>2</div>
              <div className="pin" style={{ top: 10, right: -52 }}>3</div>
              <div className="pin" style={{ bottom: -42, left: '83%', transform: 'translateX(-50%)' }}>4</div>
              <div className="pin" style={{ bottom: 20, left: -52 }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Hero tile.</b> Spans 2 columns at a 2:1 aspect ratio — the lead image sets the narrative before the grid begins.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Gap.</b> A fixed 2px seam between every tile — no padding, no rounding — so tiles abut like mosaic tiles.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Regular tile.</b> 1:1 square, equal to <Mono>1fr</Mono> of the grid column width. 3-up or 4-up as needed.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Overflow badge.</b> The last visible tile shows a semi-opaque dark scrim with <Mono>+N</Mono> in tabular mono, indicating unseen items.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Tile placeholder.</b> Until a real image loads, a warm-neutral <Mono>oklch</Mono> gradient fills the slot with a faint image glyph — never a broken-image icon.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — flush tiles, 2px gap, no rounding</div>
          <div className="body" style={{ justifyContent: 'center' }}>
            <div style={{ width: 160 }}>
              <ImageGrid columns={3} count={9} />
            </div>
          </div>
          <div className="note">Tight seams and square tiles produce the iconic mosaic. Keep border-radius 0 inside the grid.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — large gaps or rounded tiles</div>
          <div className="body" style={{ justifyContent: 'center' }}>
            <div style={{ width: 160 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {Array.from({ length: 9 }, (_, i) => (
                  <div key={i} style={{ aspectRatio: '1/1', borderRadius: 10, background: TILE_GRADIENTS[i % TILE_GRADIENTS.length] }} />
                ))}
              </div>
            </div>
          </div>
          <div className="note">Wide gaps and rounded corners break the mosaic idiom — the result looks like a card list, not a photo grid.</div>
        </div>
      </div>

      <SubHead meta="ImageGrid spec">API reference</SubHead>
      <CodeBlock
        label="image-grid"
        lang="tsx"
        code={`// 3-up grid with a hero tile and +N overflow on the last slot
<div
  role="list"
  aria-label="Photo grid"
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 2,         // 2px tight seam — the mosaic signature
  }}
>
  {/* Hero: spans 2 columns, 2:1 aspect ratio */}
  <button role="listitem" style={{ gridColumn: 'span 2', aspectRatio: '2/1' }}
    aria-label="Hero photo — attachment_scan_0412.png">
    <img src={src} alt="Deployment scan · April 12" />
  </button>

  {tiles.map((tile, i) => {
    const isLast = i === tiles.length - 1 && remaining > 0;
    return (
      <button key={tile.id} role="listitem" style={{ aspectRatio: '1/1' }}
        aria-label={isLast ? \`\${remaining} more photos\` : tile.name}>
        <img src={tile.thumb} alt={isLast ? '' : tile.name} aria-hidden={isLast} />
        {isLast && (
          <span aria-hidden="true" className="m-grid-overflow">+{remaining}</span>
        )}
      </button>
    );
  })}
</div>

/* tokens: gap 2px; aspect-ratio 1/1 (tiles) 2/1 (hero); border-radius 0;
   overflow badge: background rgba(10,9,7,0.62) scrim; text var(--fg) tabular mono */`}
      />
    </Section>
  );
}
