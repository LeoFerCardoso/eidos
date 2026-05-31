'use client';
// Eidos Blocks — Stat band. A row of headline metrics with sparklines.
import { Section, SubHead, Frame, CodeBlock, Sparkline, Trend, Lede, Mono } from '@/ds/core';


const STATS = [
  { label: 'Services', value: '142', series: [120, 124, 128, 131, 135, 139, 142], delta: 4 },
  { label: 'Deploys / week', value: '318', series: [240, 255, 270, 290, 300, 310, 318], delta: 9 },
  { label: 'Avg. DORA', value: 'Elite', series: [60, 64, 68, 72, 78, 82, 86], delta: 6 },
  { label: 'p95 latency', value: '212ms', series: [260, 250, 240, 232, 224, 218, 212], delta: -5 },
];

function StatBand() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)', width: '100%' }}>
      {STATS.map((s) => (
        <div key={s.label} className="surface" style={{ padding: 'var(--space-4)' }}>
          <div className="t-mono-label">{s.label}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', marginBlockStart: 'var(--space-1)' }}>
            <span className="t-mono" style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, letterSpacing: '-0.02em' }}>{s.value}</span>
            <Trend delta={s.delta} unit="%" />
          </div>
          <div style={{ marginBlockStart: 'var(--space-3)' }}>
            <Sparkline data={s.series} w={180} h={32} color={s.delta >= 0 ? 'var(--success)' : 'var(--danger)'} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function StatBandPage() {
  return (
    <Section
      id="stat-band"
      num="01"
      title="Stat band"
      desc="A row of headline metrics — value, trend, sparkline — for the top of a dashboard or landing. Compresses a system's pulse into one scannable band set in Geist Mono."
    >
      <SubHead meta="4-up">Stat band</SubHead>
      <Lede>One trend tone per cell — green for up, red for down. Use four cells maximum; beyond that the band loses scanability and a table section is the better choice.</Lede>
      <Frame label="auto-fit · Sparkline + Trend primitives — drag the frame narrow to watch it reflow">
        <StatBand />
      </Frame>
      <CodeBlock
        label="stat band"
        lang="tsx"
        code={`// repeat(auto-fit, minmax(180px, 1fr)) — cells reflow 4 → 2 → 1
<div className="stat-band">
  {stats.map((s) => (
    <div key={s.label} className="surface">
      <div className="t-mono-label">{s.label}</div>
      <div className="stat-value">
        <span className="t-mono">{s.value}</span> <Trend delta={s.delta} unit="%" />
      </div>
      <Sparkline data={s.series} w={180} h={32} />
    </div>
  ))}
</div>`}
      />

      {/* ====================================================================
          STATES — populated · loading · no-data
          ==================================================================== */}
      <SubHead meta="states">States</SubHead>
      <Lede>A band wired to live metrics must survive the gaps: a cell waiting on its query shows a skeleton, and a metric with no series yet reads as a calm dash — never a broken zero.</Lede>
      <Frame label="loaded · loading · no data — each cell holds its own state">
        <div className="ds-grid cols-3" style={{ width: '100%' }}>
          {/* loaded */}
          <div className="surface" style={{ padding: 'var(--space-4)' }}>
            <div className="t-mono-label">Deploys / week</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', marginBlockStart: 'var(--space-1)' }}>
              <span className="t-mono" style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, letterSpacing: '-0.02em' }}>318</span>
              <Trend delta={9} unit="%" />
            </div>
            <div style={{ marginBlockStart: 'var(--space-3)' }}><Sparkline data={[240, 255, 270, 290, 300, 310, 318]} w={180} h={32} color="var(--success)" /></div>
          </div>
          {/* loading */}
          <div className="surface" style={{ padding: 'var(--space-4)' }} aria-busy="true">
            <div className="t-mono-label">Deploys / week</div>
            <div className="sk-line" style={{ inlineSize: '52%', blockSize: 'var(--text-2xl)', marginBlockStart: 'var(--space-2)' }} />
            <div className="sk-line" style={{ inlineSize: '100%', blockSize: 32, marginBlockStart: 'var(--space-3)' }} />
            <span className="sr-only">Loading deploys per week…</span>
          </div>
          {/* no data */}
          <div className="surface" style={{ padding: 'var(--space-4)' }}>
            <div className="t-mono-label">Deploys / week</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', marginBlockStart: 'var(--space-1)' }}>
              <span className="t-mono" style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--fg-faint)' }} aria-label="No data yet">—</span>
            </div>
            <div className="t-small" style={{ color: 'var(--fg-faint)', marginBlockStart: 'var(--space-3)' }}>No data yet</div>
          </div>
        </div>
      </Frame>
      <p className="ds-caption">
        Loading swaps the value and sparkline for <Mono>.sk-line</Mono> shimmer placeholders sized to the real glyphs and marks the cell <Mono>aria-busy</Mono>; the no-data cell drops the trend and sparkline entirely and prints a muted em-dash with an <Mono>aria-label</Mono>, so a screen reader hears "No data yet" rather than a misleading zero.
      </p>

      {/* ====================================================================
          VARIANTS — trend tone (Trend delta sign)
          ==================================================================== */}
      <SubHead meta="trend tone">Variants</SubHead>
      <Frame label="positive · negative · flat — the Trend delta sign drives the tone">
        <div className="ds-grid cols-3" style={{ width: '100%' }}>
          <div className="surface" style={{ padding: 'var(--space-4)' }}>
            <div className="t-mono-label">Deploys / week</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', marginBlockStart: 'var(--space-1)' }}>
              <span className="t-mono" style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, letterSpacing: '-0.02em' }}>318</span>
              <Trend delta={9} unit="%" />
            </div>
            <div style={{ marginBlockStart: 'var(--space-3)' }}><Sparkline data={[240, 255, 270, 290, 300, 310, 318]} w={180} h={32} color="var(--success)" /></div>
          </div>
          <div className="surface" style={{ padding: 'var(--space-4)' }}>
            <div className="t-mono-label">p95 latency</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', marginBlockStart: 'var(--space-1)' }}>
              <span className="t-mono" style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, letterSpacing: '-0.02em' }}>212ms</span>
              <Trend delta={-5} unit="%" inverted />
            </div>
            <div style={{ marginBlockStart: 'var(--space-3)' }}><Sparkline data={[260, 250, 240, 232, 224, 218, 212]} w={180} h={32} color="var(--success)" /></div>
          </div>
          <div className="surface" style={{ padding: 'var(--space-4)' }}>
            <div className="t-mono-label">Error budget</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', marginBlockStart: 'var(--space-1)' }}>
              <span className="t-mono" style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, letterSpacing: '-0.02em' }}>0%</span>
              <Trend delta={0} unit="%" />
            </div>
            <div style={{ marginBlockStart: 'var(--space-3)' }}><Sparkline data={[40, 40, 40, 40, 40, 40, 40]} w={180} h={32} color="var(--fg-muted)" /></div>
          </div>
        </div>
      </Frame>
      <p className="ds-caption">
        One axis: the sign of <Mono>Trend delta</Mono> picks the tone — positive reads success-green, negative danger-red, zero stays neutral. The sparkline colour follows the same sign so the cell tells one consistent story. "Down is good" metrics like latency invert the colour deliberately, so the green/red always means better/worse, not up/down.
      </p>

      {/* ====================================================================
          ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{padding: '64px 36px 56px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative', width:'100%', maxWidth:560}} aria-hidden="true">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
                {STATS.slice(0, 3).map((s) => (
                  <div key={s.label} className="surface" style={{ padding: 'var(--space-3)' }}>
                    <div className="t-mono-label">{s.label}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', marginBlockStart: 'var(--space-1)' }}>
                      <span className="t-mono" style={{ fontSize: 'var(--text-lg)', fontWeight: 600, letterSpacing: '-0.02em' }}>{s.value}</span>
                      <Trend delta={s.delta} unit="%" />
                    </div>
                    <div style={{ marginBlockStart: 'var(--space-2)' }}>
                      <Sparkline data={s.series} w={140} h={26} color={s.delta >= 0 ? 'var(--success)' : 'var(--danger)'} />
                    </div>
                  </div>
                ))}
              </div>
              <span className="lead v" style={{top: -22, left: 22, height: 18}}/>
              <span className="lead h" style={{top: 38, left: -28, width: 24}}/>
              <span className="lead h" style={{top: 38, right: -28, width: 24}}/>
              <span className="lead v" style={{bottom: -22, left: 30, height: 18}}/>
              <div className="pin" style={{top: -42, left: 22, transform:'translateX(-50%)'}}>1</div>
              <div className="pin" style={{top: 30, left: -52}}>2</div>
              <div className="pin" style={{top: 30, right: -52}}>3</div>
              <div className="pin" style={{bottom: -42, left: 30, transform:'translateX(-50%)'}}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Label.</b> Mono caption (<Mono>t-mono-label</Mono>), one line — names the metric, never abbreviates past recognition.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Value.</b> Tabular Geist Mono via <Mono>.t-mono</Mono>, <Mono>--text-2xl</Mono>, baseline-aligned with the trend. The one thing the reader takes away.</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Trend.</b> <Mono>&lt;Trend delta unit /&gt;</Mono> — signed delta with an arrow and a tone; add <Mono>inverted</Mono> for lower-is-better metrics. Sits inline next to the value.</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Sparkline.</b> 7-point series, fixed <Mono>180×32</Mono>, <Mono>aria-hidden</Mono>, colour matched to the trend tone. Shape, not precise values.</span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          ACCESSIBILITY
          ==================================================================== */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginBlockStart: 'var(--space-3)'}}>
        <div className="surface" style={{padding: 'var(--space-4)'}}>
          <div style={{fontWeight: 600, marginBlockEnd: 'var(--space-2)'}}>Trend never relies on colour alone</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>The Trend pairs a direction arrow and a signed number with its colour, so up/down survives for colour-blind readers and in monochrome. Each Trend carries an <Mono>aria-label</Mono> of the form <Mono>"up 9%"</Mono> / <Mono>"down 5%"</Mono>; the arrow glyph itself is <Mono>aria-hidden</Mono>. The label and value are plain text, not colour-coded.</div>
        </div>
        <div className="surface" style={{padding: 'var(--space-4)'}}>
          <div style={{fontWeight: 600, marginBlockEnd: 'var(--space-2)'}}>Sparkline is decorative, not data</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>The sparkline is shorthand for a trend already stated as a number, so the SVG is rendered with <Mono>aria-hidden="true"</Mono> and is skipped by assistive tech. The value and delta are the accessible truth of the cell — never the only place a figure appears.</div>
        </div>
        <div className="surface" style={{padding: 'var(--space-4)'}}>
          <div style={{fontWeight: 600, marginBlockEnd: 'var(--space-2)'}}>Contrast &amp; reflow</div>
          <div className="t-small" style={{color: 'var(--fg-muted)'}}>Values and labels sit on the solid card surface at AA contrast in both themes. The band is a <Mono>repeat(auto-fit, minmax(180px, 1fr))</Mono> grid, so cells wrap 4 → 2 → 1 as the viewport narrows and at 200% zoom — no media query, no horizontal scroll. The cells are static; nothing animates, so there is nothing to suppress under <Mono>prefers-reduced-motion</Mono>.</div>
        </div>
        <div className="surface" style={{padding: 'var(--space-4)'}}>
          <div style={{fontWeight: 600, marginBlockEnd: 'var(--space-2)'}}>Keyboard &amp; focus order</div>
          <div className="t-small" style={{color: 'var(--fg-muted)', marginBlockEnd: 'var(--space-3)'}}>Plain stat cells carry no tab stops. When a cell links to its detail view, the whole cell is a single focusable control with the canonical focus-visible ring; focus runs in source order across the band and flips correctly under <Mono>dir="rtl"</Mono>.</div>
          <div className="kbd-row"><span className="label">Move to next / previous linked cell</span><span className="kbd-chord"><kbd className="kbd">Tab</kbd><kbd className="kbd">⇧</kbd><kbd className="kbd">Tab</kbd></span></div>
          <div className="kbd-row"><span className="label">Open the focused cell's detail view</span><span className="kbd-chord"><kbd className="kbd">↵</kbd></span></div>
        </div>
      </div>

      {/* ====================================================================
          RTL
          ==================================================================== */}
      <SubHead meta="rtl">RTL</SubHead>
      <Lede>The band is built from logical properties and a flow grid, so it mirrors wholesale: the first cell anchors to the inline-start (right) edge and the Trend arrow keeps pointing along the value's reading direction.</Lede>
      <Frame label='dir="rtl" · the band flips inline-start → inline-end'>
        <div dir="rtl" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)', width: '100%' }}>
          {STATS.slice(0, 3).map((s) => (
            <div key={s.label} className="surface" style={{ padding: 'var(--space-4)' }}>
              <div className="t-mono-label">{s.label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)', marginBlockStart: 'var(--space-1)' }}>
                <span className="t-mono" style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, letterSpacing: '-0.02em' }}>{s.value}</span>
                <Trend delta={s.delta} unit="%" />
              </div>
              <div style={{ marginBlockStart: 'var(--space-3)' }}>
                <Sparkline data={s.series} w={180} h={32} color={s.delta >= 0 ? 'var(--success)' : 'var(--danger)'} />
              </div>
            </div>
          ))}
        </div>
      </Frame>

      {/* ====================================================================
          DO / DON'T
          ==================================================================== */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head">Do — one trend tone per cell, green = better</div>
          <div className="body" style={{flexDirection:'column', alignItems:'flex-start', gap: 'var(--space-2)', padding: 'var(--space-4)'}}>
            <div className="t-mono-label">p95 latency</div>
            <div style={{display:'flex', alignItems:'baseline', gap: 'var(--space-2)'}}>
              <span className="t-mono" style={{fontSize: 'var(--text-xl)', fontWeight: 600}}>212ms</span>
              <Trend delta={-5} unit="%" inverted />
            </div>
            <Sparkline data={[260, 250, 240, 232, 224, 218, 212]} w={150} h={28} color="var(--success)" />
          </div>
          <div className="note">Latency falling is good, so <Mono>inverted</Mono> flips the tone to green and the sparkline colour matches — value, trend, and line all tell the one "improving" story.</div>
        </div>
        <div className="dd-card dont">
          <div className="head">Don't — mismatch the value, trend, and sparkline tone</div>
          <div className="body" style={{flexDirection:'column', alignItems:'flex-start', gap: 'var(--space-2)', padding: 'var(--space-4)'}}>
            <div className="t-mono-label">p95 latency</div>
            <div style={{display:'flex', alignItems:'baseline', gap: 'var(--space-2)'}}>
              <span className="t-mono" style={{fontSize: 'var(--text-xl)', fontWeight: 600, color:'var(--success)'}}>212ms</span>
              <Trend delta={5} unit="%" />
            </div>
            <Sparkline data={[212, 218, 224, 232, 240, 250, 260]} w={150} h={28} color="var(--success)" />
          </div>
          <div className="note">A green value, an up-trend, and a rising line all say "more latency is good." Pick one truth and let value, trend, and sparkline agree.</div>
        </div>
      </div>
    </Section>
  );
}
