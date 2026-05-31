'use client';
// Eidos DS — Components / Trend
// Tiny delta indicator. 4 visual variants share the same colour mapping.
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, Trend, Lede, Mono } from '@/ds/core';

  const row  = { display: 'flex', alignItems: 'center', gap: 12 };

  const USAGE = `import { Trend } from "@/components/forge/trend"

<Trend delta={12.4}/>          {/* arrow,  up   */}
<Trend delta={-3.2} unit="%" inverted/>   {/* arrow,  good (latency) */}
<Trend delta={8.1} variant="triangle"/>
<Trend delta={-4.2} variant="badge"/>
<Trend delta={12} variant="bar"/>`;

export default function TrendPage() {
  return (
    <Section id="trend" title="Trend" desc={<>Tiny delta indicator. Four visual variants — arrow, triangle, badge, bar — share the same colour mapping (up = green, down = red, flat = muted). Use <Mono>inverted</Mono> for lower-is-better metrics like latency or error rate.</>}>
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('trend')} ariaLabel="package manager"/>
      <Lede>Sign is inferred from <Mono>delta</Mono>. Positive is up, negative is down, zero is flat. The variant changes the chrome — the colour rule is invariant.</Lede>

      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="default · arrow variant" row code={USAGE}>
        <span style={row}><Trend delta={12.4}/><span style={{color:'var(--fg-faint)'}}>requests vs last week</span></span>
      </Frame>

      <div style={{ marginBlockStart: 36, marginBlockEnd: 6, display:'flex', alignItems:'center', gap: 12 }}>
        <span className="t-mono-label">Variants</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      <SubHead meta="↑ ↓ — · lightweight inline">Arrow</SubHead>
      <Frame label="positive · negative · flat" row>
        <span style={row}><Trend delta={12.4} variant="arrow"/><Trend delta={-3.2} variant="arrow"/><Trend delta={0} variant="arrow"/></span>
      </Frame>

      <SubHead meta="▲ ▼ ◆ · typographic, dense tables">Triangle</SubHead>
      <Frame label="ideal next to mono numerics in tables" row>
        <span style={row}><Trend delta={12.4} variant="triangle"/><Trend delta={-3.2} variant="triangle"/><Trend delta={0} variant="triangle"/></span>
      </Frame>

      <SubHead meta="pill chrome · feature rows / headline cards">Badge</SubHead>
      <Frame label="bg-tinted pill — visually separates the delta from surrounding type" row>
        <span style={row}><Trend delta={12.4} variant="badge"/><Trend delta={-3.2} variant="badge"/><Trend delta={0} variant="badge"/></span>
      </Frame>

      <SubHead meta="arrow + delta bar · neighbour of a sparkline">Bar</SubHead>
      <Frame label="bar magnitude scales with |delta| / 50" row>
        <span style={row}><Trend delta={48} variant="bar"/><Trend delta={-12} variant="bar"/><Trend delta={3.2} variant="bar"/></span>
      </Frame>

      <SubHead meta="lower is better">Inverted</SubHead>
      <Frame label="latency / error rate / p95 — falling is good" row>
        <span style={row}>
          <Trend delta={-12.4} unit="ms" inverted/>
          <Trend delta={ 4.2} unit="ms" inverted/>
          <Trend delta={-0.3} unit="%"  inverted variant="triangle"/>
        </span>
      </Frame>
      <Lede>The colour mapping inverts but the arrow stays factual — a falling latency still renders a <Mono>↓</Mono>, just painted green.</Lede>

      <SubHead meta="in context">In context</SubHead>
      <Frame label="DORA grid · 4 metrics, 4 variants — Trend rides inline beside each value">
        <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 14}}>
          {[
            { lab: 'deploy freq',   v: '142', d:  18.2, inv: false },
            { lab: 'lead time',     v: '3.4h', d: -8.1, inv: true },
            { lab: 'MTTR',          v: '24m',  d: -22,  inv: true },
            { lab: 'change fail %', v: '4.2%', d:  1.2, inv: true },
          ].map((m) => (
            <div key={m.lab} className="metric sm">
              <div className="metric-label">{m.lab}</div>
              <div className="metric-value" style={{ gap: 10 }}>
                <span>{m.v}</span>
                <Trend delta={m.d} unit="%" inverted={m.inv} variant="triangle"/>
              </div>
            </div>
          ))}
        </div>
      </Frame>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBlockEnd: 6}}>Keyboard</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>A trend is a static read-out with no focus or key bindings — there is no role and no tab stop. When it labels an interactive metric card, that card owns the focus ring and the trend rides along inside it.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBlockEnd: 6}}>Screen reader</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>The delta number is real text, but direction is conveyed by colour and glyph — so give the indicator a text alternative that names it (&quot;up 12 percent&quot; / &quot;down 0.4 percent&quot;). Mark the decorative arrow / triangle glyph <Mono>aria-hidden</Mono> so the value isn&apos;t read twice.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBlockEnd: 6}}>Focus &amp; contrast</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>Direction is never colour alone — the arrow / triangle shape carries it too, so red-green colour-blind users still read up vs down. Up (<Mono>--success</Mono>), down (<Mono>--danger</Mono>) and flat (muted) each meet AA (4.5:1) against the card surface in both themes.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBlockEnd: 6}}>Motion</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>The arrow, triangle and badge variants are static — the glyph and value swap instantly with no motion. The <Mono>bar</Mono> variant is the exception: its fill is a <Mono>scaleX</Mono> transform that tweens over 240ms, so the bar sweeps to its new magnitude when the delta changes. That sweep is the one piece of motion here, and it is disabled under <Mono>prefers-reduced-motion: reduce</Mono> — the fill then jumps straight to its final width.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label={'dir="rtl" — value/label align to the start; the vertical delta arrows do NOT flip'}
        row
        code={`<div dir="rtl">
  <span className="row">
    <Trend delta={12.4} />
    <span>الطلبات مقابل الأسبوع الماضي</span>
  </span>
</div>`}
        lang="tsx"
      >
        <div dir="rtl">
          <span style={row}><Trend delta={12.4}/><span style={{color:'var(--fg-faint)'}}>الطلبات مقابل الأسبوع الماضي</span></span>
        </div>
      </Frame>
      <Lede>
        Trend is direction-agnostic at the glyph level: the up/down arrows and triangles are <em>vertical</em> (<Mono>↑</Mono> / <Mono>↓</Mono> / <Mono>▲</Mono> / <Mono>▼</Mono>), so they must <em>not</em> be horizontally mirrored — applying <Mono>scaleX(-1)</Mono> would be wrong and is deliberately omitted. Under <Mono>dir="rtl"</Mono> only the inline layout moves: the value, unit and trailing label align to the start (now the right), driven by logical flex order. The <Mono>bar</Mono> variant's fill grows from the start edge automatically.
      </Lede>

      {/* ====================================================================
          ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 48px 64px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative' }} aria-hidden="true">
              <Trend delta={12.4} variant="badge" />
              {/* pin 1 — direction arrow */}
              <span className="lead v" style={{ top: -28, left: 8, height: 22 }} />
              <div className="pin" style={{ top: -50, left: 8, transform: 'translateX(-50%)' }}>1</div>
              {/* pin 2 — delta value */}
              <span className="lead v" style={{ top: -28, left: '52%', height: 22 }} />
              <div className="pin" style={{ top: -50, left: '52%', transform: 'translateX(-50%)' }}>2</div>
              {/* pin 3 — colour mapping / fill */}
              <span className="lead v" style={{ bottom: -28, left: '50%', height: 22 }} />
              <div className="pin" style={{ bottom: -50, left: '50%', transform: 'translateX(-50%)' }}>3</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '60px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Direction arrow.</b> <Mono>↑</Mono> or <Mono>↓</Mono> (arrow/triangle variants) — vertical glyphs that convey direction without relying on colour alone. Marked <Mono>aria-hidden</Mono>; the text alternative names direction in prose.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Delta value.</b> Tabular mono figures so digits don't jitter when a row of metrics refreshes. Absolute magnitude (<Mono>Math.abs(delta)</Mono>) with the configured unit appended (<Mono>%</Mono> by default).</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Colour mapping / chrome.</b> Up = success green; down = danger red; flat = muted. <Mono>inverted</Mono> swaps green/red for lower-is-better metrics (latency, error rate). The <Mono>badge</Mono> variant adds a tinted pill; <Mono>bar</Mono> scales a fill to <Mono>|delta|/50</Mono>.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — invert lower-is-better metrics</div>
          <div className="body"><span style={row}><Trend delta={-12} unit="ms" inverted variant="triangle"/><span style={{color:'var(--fg-faint)'}}>p95 latency</span></span></div>
          <div className="note">A falling p95 should read green. Without <Mono>inverted</Mono>, the visual screams &quot;warning&quot; while the trend is healthy.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — mix three variants on the same surface</div>
          <div className="body"><span style={row}><Trend delta={12} variant="arrow"/><Trend delta={-3} variant="badge"/><Trend delta={4} variant="bar"/></span></div>
          <div className="note">Pick one variant per surface. Mixing reads as inconsistency, not intentionality.</div>
        </div>
      </div>

      <SubHead meta="TrendProps">API reference</SubHead>
      <AutoPropsTable component="Trend" label="<Trend />"/>
    </Section>
  );
}
