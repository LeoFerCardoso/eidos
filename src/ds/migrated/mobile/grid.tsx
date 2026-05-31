'use client';
// Forge Mobile — Foundations / Grid. A 4-column grid with 16px margins + gutters that
// every tile layout snaps to.
import { Section, SubHead, Frame, CodeBlock, SpecRow, DeviceFrame, Lede, Mono, Icons } from '@/ds/core';

function GridScreen() {
  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 50, flex: '0 0 auto' }} />
      <div style={{ padding: '4px 16px 14px', fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>Grid</div>
      <div style={{ flex: 1, position: 'relative', padding: '0 16px', minHeight: 0 }}>
        {/* 4-column overlay */}
        <div style={{ position: 'absolute', inset: '0 16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, pointerEvents: 'none' }}>
          {[0, 1, 2, 3].map((i) => <span key={i} style={{ background: 'var(--ember-soft)', borderRadius: 4 }} />)}
        </div>
        {/* example tiles snapped to the grid */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="surface" style={{ height: 56, boxShadow: 'var(--elev-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>span 4</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="surface" style={{ height: 56, boxShadow: 'var(--elev-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>span 2</div>
            <div className="surface" style={{ height: 56, boxShadow: 'var(--elev-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>span 2</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[0, 1, 2].map((i) => <div key={i} className="surface" style={{ height: 56, boxShadow: 'var(--elev-1)' }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

// SIGNATURE MOVE — the span ruler. Resolves the abstract "4 columns / 44px floor" rule
// into honest arithmetic on the family's narrowest handset (Galaxy S24, 360px logical):
// content = 360 − 2×16 margin = 328px; each gutter steals 16px. A single column is 70px
// wide — well clear of 44px — but pushing to 6 columns collapses it to ~41px, under the
// floor. The ruler MAKES that breakpoint visible, which is the whole argument of the page.
const RULER = [
  { cols: 4, span: 1, label: 'span 1', w: 70, role: 'thirds / KPI' },
  { cols: 4, span: 2, label: 'span 2', w: 156, role: 'halves' },
  { cols: 4, span: 4, label: 'span 4', w: 328, role: 'full-width' },
  { cols: 6, span: 1, label: '6-col', w: 41, role: 'too narrow', bad: true },
];

export default function MobileGrid() {
  return (
    <Section id="grid" num="01" title="Grid"
      desc="Tile layouts snap to a 4-column grid inside the 16px side margins, with a 16px gutter between columns. Most content spans all four (a full-width card); split into halves (span 2) or thirds for KPI rows and chip clusters.">

      <SubHead meta="4 columns · 16 / 16">Column grid</SubHead>
      <Lede>One grid, three spans. Four columns inside 16px margins give a full-width card (<Mono>span 4</Mono>), a clean pair of halves (<Mono>span 2</Mono>), or a thirds row for KPIs and chips — without ever crowding a handset.</Lede>
      <Frame label="ember columns = the grid · cards snap to spans" center>
        <DeviceFrame><GridScreen /></DeviceFrame>
      </Frame>
      <p className="ds-caption">Four columns is plenty for a handset — it gives full-width, halves, and thirds without crowding. Avoid 5+ columns; tap targets get too narrow to clear 44px.</p>

      <SubHead meta="the numbers">Metrics</SubHead>
      <table className="spec">
        <thead><tr><th>Metric</th><th>Value</th><th>Use</th></tr></thead>
        <tbody>
          <SpecRow token="Columns" value="4" usage="Fixed across handset widths." />
          <SpecRow token="Side margin" value="16px" usage="Grid inset from both edges." />
          <SpecRow token="Gutter" value="16px" usage="Space between columns." />
          <SpecRow token="Common spans" value="4 / 2 / 1" usage="Full-width · halves · thirds (in a 3-col sub-grid)." />
        </tbody>
      </table>

      <SubHead meta="span × tap target">The 44px floor, measured</SubHead>
      <Lede>The column count is not a taste call — it is set by the touch floor. On the family's narrowest handset (Galaxy S24, 360px), a single column is 70px wide; a sixth column would collapse to 41px, under the 44px minimum. The ruler shows exactly where the grid breaks.</Lede>
      <Frame label="resolved width per span · 360px viewport">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {RULER.map((r) => (
            <div key={r.label} style={{ display: 'grid', gridTemplateColumns: '92px 1fr 132px', gap: 14, alignItems: 'center' }}>
              <span className="t-mono-label" style={{ padding: 0 }}>{r.label}</span>
              <div style={{ position: 'relative', height: 28, background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                {/* the resolved tile width, scaled against the 328px content band */}
                <div style={{
                  position: 'absolute', insetBlock: 0, insetInlineStart: 0,
                  inlineSize: `${(r.w / 328) * 100}%`,
                  background: r.bad ? 'var(--danger-soft)' : 'var(--ember-soft)',
                  borderInlineEnd: `2px solid ${r.bad ? 'var(--danger)' : 'var(--ember)'}`,
                  display: 'flex', alignItems: 'center', paddingInline: 8,
                  fontFamily: 'var(--font-mono)', fontSize: 12, fontVariantNumeric: 'tabular-nums',
                  color: r.bad ? 'var(--danger)' : 'var(--ember-text)',
                }}>{r.w}px</div>
              </div>
              <span className="t-mono" style={{ color: r.bad ? 'var(--danger)' : 'var(--fg-subtle)', fontSize: 'var(--text-base)', whiteSpace: 'nowrap' }}>
                {r.bad ? '✕ below 44px' : r.role}
              </span>
            </div>
          ))}
        </div>
      </Frame>
      <p className="ds-caption">Read the bars against the 328px content band. Everything in the 4-column system clears 44px with padding to spare; the red bar is the 6-column case the metrics table rules out.</p>

      <SubHead meta="a11y">Accessibility &amp; pairings</SubHead>
      <Lede>A layout grid is an accessibility contract, not just an aesthetic one: it guarantees a touch floor, keeps the column guides decorative, and never animates reflow. Three guarantees hold on every handset width in the family.</Lede>
      <div className="ds-grid cols-3">
        {[
          ['44px tap-target floor', 'Every span resolves to a tile at least 44 × 44px on the narrowest supported handset (360px). A thirds tile is 70px wide; a halved tile, 156px. This floor is why the grid caps at four columns — a fifth or sixth column drops a single span under 44px and fails the touch contract.'],
          ['Grid guides are decorative', 'The ember column overlay is a design aid, not content — it carries aria-hidden and pointer-events: none, so screen readers and keyboard focus skip it entirely and read only the tiles snapped onto it. Never let a guide trap focus or announce itself.'],
          ['Reduced motion on reflow', 'When a span changes (rotation, a sheet opening, Dynamic Type bumping a row to two lines), tiles re-snap to their new columns instantly under prefers-reduced-motion — no slide or cross-fade. Layout shifts are jarring when animated and can trigger vestibular discomfort.'],
        ].map(([t, d]) => (
          <div key={t} className="surface" style={{ padding: 18 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{t}</div>
            <div className="t-small" style={{ color: 'var(--fg-muted)' }}>{d}</div>
          </div>
        ))}
      </div>
      <table className="spec" style={{ marginBlockStart: 18 }}>
        <thead><tr><th>Span</th><th>Width @ 360px</th><th>Tap floor</th><th>Guide contrast</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>span 4 (full)</td><td className="mono">328px</td><td className="mono">44px</td><td className="mono">— decorative</td><td><span className="chip ok">PASS</span></td></tr>
          <tr><td>span 2 (half)</td><td className="mono">156px</td><td className="mono">44px</td><td className="mono">— decorative</td><td><span className="chip ok">PASS</span></td></tr>
          <tr><td>span 1 (third)</td><td className="mono">70px</td><td className="mono">44px</td><td className="mono">— decorative</td><td><span className="chip ok">PASS</span></td></tr>
          <tr><td>6-column span</td><td className="mono">41px</td><td className="mono">44px</td><td className="mono">— decorative</td><td><span className="chip bad">FAIL</span></td></tr>
        </tbody>
      </table>
      <p className="t-small" style={{ color: 'var(--fg-muted)', marginBlockStart: 12, lineHeight: 1.6, maxWidth: '64ch' }}>
        The grid sets the layout, not the hit area — a control inside a narrow tile still pads out to <Mono>44 × 44px</Mono> with <Mono>min-block-size</Mono>, it never shrinks to its glyph. The overlay token <Mono>--ember-soft</Mono> is a guide only; it carries no information and clears no contrast requirement.
      </p>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — four columns, full / half / thirds</div>
          <div className="body" style={{ flexDirection: 'column', gap: 8, alignItems: 'stretch' }}>
            <div style={{ height: 24, borderRadius: 4, background: 'var(--ember-soft)', border: '1px solid var(--ember)' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[0, 1].map((i) => <div key={i} style={{ height: 24, borderRadius: 4, background: 'var(--surface-hover)', border: '1px solid var(--border)' }} />)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[0, 1, 2].map((i) => <div key={i} style={{ height: 24, borderRadius: 4, background: 'var(--surface-hover)', border: '1px solid var(--border)' }} />)}
            </div>
          </div>
          <div className="note">Spans of 4, 2 and 1 (in a 3-col sub-grid) cover every handset layout. Each tile clears the 44px touch floor.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — six narrow columns</div>
          <div className="body" style={{ alignItems: 'stretch' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 5, width: '100%' }}>
              {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{ height: 24, borderRadius: 3, background: 'var(--danger-soft)', border: '1px solid var(--danger)' }} />)}
            </div>
          </div>
          <div className="note">Six columns collapse a single span to ~41px on a 360px handset — under the 44px tap floor, so controls misfire.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — snap to whole columns</div>
          <div className="body" style={{ alignItems: 'stretch' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, width: '100%' }}>
              <div style={{ gridColumn: 'span 3', height: 24, borderRadius: 4, background: 'var(--ember-soft)', border: '1px solid var(--ember)' }} />
              <div style={{ gridColumn: 'span 1', height: 24, borderRadius: 4, background: 'var(--surface-hover)', border: '1px solid var(--border)' }} />
            </div>
          </div>
          <div className="note">A 3 + 1 split still lands on column lines. Edges align with neighbouring rows, so the page reads as one system.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — break the gutter</div>
          <div className="body" style={{ alignItems: 'stretch' }}>
            <div style={{ display: 'flex', gap: 3, width: '100%' }}>
              <div style={{ flex: 2.4, height: 24, borderRadius: 4, background: 'var(--danger-soft)', border: '1px solid var(--danger)' }} />
              <div style={{ flex: 1.6, height: 24, borderRadius: 4, background: 'var(--surface-hover)', border: '1px solid var(--border)' }} />
            </div>
          </div>
          <div className="note">Arbitrary widths (2.4 / 1.6) and a thin gutter drift off the grid — edges stop aligning and the layout looks improvised.</div>
        </div>
      </div>

      <SubHead meta="reference">CSS grid</SubHead>
      <CodeBlock label="snap to the grid" lang="css" code={`.m-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;            /* gutter */
  padding-inline: 16px; /* side margins */
}
.m-grid > .full { grid-column: span 4; }
.m-grid > .half { grid-column: span 2; }
.m-grid > .third { grid-column: span 1; }  /* in a 3-col sub-grid */`} />
    </Section>
  );
}
