'use client';
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, ScoreGauge, Lede, Mono } from '@/ds/core';


const USAGE = `import { ScoreGauge } from "@/components/forge/score-gauge"

export function Demo() {
  return (
    <ScoreGauge
      variant="speedo"
      value={247}
      min={0}
      max={1000}
      label="Change Risk Score"
      ticks
      labels
    />
  )
}`;

const colStyle: React.CSSProperties = { display:'flex', flexDirection:'column', alignItems:'center', gap: 10 };
const colLabel: React.CSSProperties = { fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-faint)', textTransform:'uppercase', letterSpacing:'0.08em' };

export default function ScoreGaugePage() {
  return (
    <Section id="el-score-gauge" title="Score gauge" desc="Automotive-style gauge for risk and health scores — hero Change Risk on a PR, health dial in a service card, reliability bar in a table row. Three densities: speedo, compact, linear.">
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('score-gauge')} ariaLabel="package manager"/>
      <Lede>The gauge maps a normalized value (0–1) onto a four-stop palette. For "high = good" metrics (Reliability Index, Service Health) set <Mono>inverted</Mono> — the palette flips so green sits on the right side of the dial.</Lede>

      <SubHead meta="hello world">Usage</SubHead>
      <Lede>ScoreGauge owns the green → ember → amber → red ramp — never re-derive your own stops. A <Mono>247</Mono> that reads amber on one surface and green on another erodes trust. Set <Mono>inverted</Mono> for &ldquo;high = good&rdquo; metrics (Health, Reliability) so green sits on the high side of the dial.</Lede>
      <Frame label="speedo · Change Risk Score 247 / 1000" code={USAGE}>
        <ScoreGauge variant="speedo" value={247} min={0} max={1000} label="Change Risk Score" ticks labels/>
      </Frame>
      <Lede>Read the ticks bottom-up: low scores sweep the green-to-ember arc, medium scores hit ember-to-amber, anything past 750 sits in the red. The needle and the readout share the same colour at every value.</Lede>

      <div style={{ marginTop: 36, marginBottom: 6, display:'flex', alignItems:'center', gap: 12 }}>
        <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--fg-faint)'}}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      <SubHead meta="0–1000 · low / medium / critical">Change Risk Score</SubHead>
      <Frame label="three speedos side-by-side · the canonical PR risk display" code={`<ScoreGauge variant="speedo" value={147} min={0} max={1000} label="PR #7417 · low" ticks labels/>
<ScoreGauge variant="speedo" value={487} min={0} max={1000} label="PR #7418 · medium" ticks labels/>
<ScoreGauge variant="speedo" value={812} min={0} max={1000} label="PR #7419 · critical" ticks labels/>`}>
        <div style={{display:'flex', gap: 24, flexWrap:'wrap', justifyContent:'center'}}>
          <div style={colStyle}>
            <ScoreGauge variant="speedo" value={147} min={0} max={1000} label="PR #7417 · low" ticks labels/>
          </div>
          <div style={colStyle}>
            <ScoreGauge variant="speedo" value={487} min={0} max={1000} label="PR #7418 · medium" ticks labels/>
          </div>
          <div style={colStyle}>
            <ScoreGauge variant="speedo" value={812} min={0} max={1000} label="PR #7419 · critical" ticks labels/>
          </div>
        </div>
      </Frame>
      <Lede>The 0–1000 scale earns its width by giving rules engines room. A PR that lands at 487 vs. 512 is a meaningful step; on a 0–100 scale, both round to "medium" and the signal vanishes.</Lede>

      <SubHead meta="0–100 · inverted · compact">Service Health Score</SubHead>
      <Frame label="compact gauge · sits inside a service card or a tribe row" code={`<ScoreGauge
  variant="compact"
  value={87}
  min={0}
  max={100}
  label="Health"
  inverted
/>`}>
        <div style={{display:'flex', gap: 32, flexWrap:'wrap', justifyContent:'center', alignItems:'center'}}>
          <div style={colStyle}>
            <ScoreGauge variant="compact" value={92} min={0} max={100} label="Health" inverted/>
            <span style={colLabel}>pix-router</span>
          </div>
          <div style={colStyle}>
            <ScoreGauge variant="compact" value={87} min={0} max={100} label="Health" inverted/>
            <span style={colLabel}>fraud-engine</span>
          </div>
          <div style={colStyle}>
            <ScoreGauge variant="compact" value={64} min={0} max={100} label="Health" inverted/>
            <span style={colLabel}>data-export</span>
          </div>
          <div style={colStyle}>
            <ScoreGauge variant="compact" value={38} min={0} max={100} label="Health" inverted/>
            <span style={colLabel}>bureau-gateway</span>
          </div>
        </div>
      </Frame>

      <SubHead meta="0–100 · inverted · linear">Reliability Index</SubHead>
      <Frame label="linear gauge · slots into a table cell or a dense list" code={`<ScoreGauge
  variant="linear"
  value={92}
  min={0}
  max={100}
  label="Reliability"
  inverted
/>`}>
        <div style={{display:'flex', flexDirection:'column', gap: 14, maxWidth: 360}}>
          <ScoreGauge variant="linear" value={92} min={0} max={100} label="Reliability · Identity" inverted/>
          <ScoreGauge variant="linear" value={87} min={0} max={100} label="Reliability · Pix" inverted/>
          <ScoreGauge variant="linear" value={78} min={0} max={100} label="Reliability · Risk" inverted/>
          <ScoreGauge variant="linear" value={62} min={0} max={100} label="Reliability · Onboarding" inverted/>
          <ScoreGauge variant="linear" value={41} min={0} max={100} label="Reliability · DataLab" inverted/>
        </div>
      </Frame>

      <SubHead meta="3 variants">Side-by-side comparison</SubHead>
      <Frame label="speedo · compact · linear — pick the variant that matches the density">
        <div style={{display:'flex', gap: 36, alignItems:'center', flexWrap:'wrap', justifyContent:'center'}}>
          <div style={colStyle}>
            <ScoreGauge variant="speedo" value={487} min={0} max={1000} label="Change Risk" ticks/>
            <span style={colLabel}>speedo · hero</span>
          </div>
          <div style={colStyle}>
            <ScoreGauge variant="compact" value={87} min={0} max={100} label="Health" inverted/>
            <span style={colLabel}>compact · card</span>
          </div>
          <div style={{...colStyle, gap: 12, minWidth: 240}}>
            <ScoreGauge variant="linear" value={87} min={0} max={100} label="Reliability" inverted/>
            <span style={colLabel}>linear · row</span>
          </div>
        </div>
      </Frame>
      <Lede>Pick by density. Speedo earns a whole tile, compact rides inside a card, linear inside a table cell. The colour stops are the same across all three so a 487 / 1000 reads the same as a 49 / 100.</Lede>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The gauge is a read-only meter, not a slider — there is nothing to drag, so it stays out of the tab order. When it links to the underlying score breakdown (a PR risk page, a service health view), only that wrapping link is a single <Mono>Tab</Mono> stop activated by <Mono>Enter</Mono>.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The gauge exposes <Mono>role="meter"</Mono> with <Mono>aria-valuenow</Mono> / <Mono>aria-valuemin</Mono> / <Mono>aria-valuemax</Mono> and the caption as its label, so it announces &ldquo;Change Risk Score, 247 of 1000&rdquo; rather than a silent SVG. The numeric readout is real text, and the LOW / MED / CRIT segment labels read alongside the value.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Status, not colour alone</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The needle position and the printed numeric readout convey the score independently of the green/ember/amber/red ramp, so the gauge reads with colour-blindness or in greyscale; the speedo's tick marks and segment labels reinforce the bands. The readout shares the value's colour and meets AA against the dial surface.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Density &amp; focus</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The three sizes change scale, not legibility — the numeric readout stays above a readable size even in the compact dial and the linear row. A linked gauge keeps a visible focus ring around its footprint, and the needle's sweep-to-value animation is suppressed under <Mono>prefers-reduced-motion</Mono> (snaps to position).</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label='dir="rtl" — caption label and segment labels align right; the arc and needle are rotationally symmetric'>
        <div dir="rtl" style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={colStyle}>
            <ScoreGauge variant="speedo" value={247} min={0} max={1000} label="درجة المخاطرة" ticks labels/>
          </div>
          <div style={colStyle}>
            <ScoreGauge variant="compact" value={87} min={0} max={100} label="الصحة" inverted/>
          </div>
          <div style={{ ...colStyle, minWidth: 240 }}>
            <ScoreGauge variant="linear" value={87} min={0} max={100} label="الموثوقية" inverted/>
          </div>
        </div>
      </Frame>
      <Lede>
        The caption label, segment labels (<Mono>LOW / MED / CRIT</Mono>), and the linear bar label all respect <Mono>dir="rtl"</Mono> — text aligns from the right. The speedo arc is a rotationally symmetric SVG: the colour ramp spans the same arc in both directions, so the needle reading is identical. The linear bar fill starts from the inline-start edge and fills toward the inline-end, matching the reading direction.
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
              <ScoreGauge variant="speedo" value={487} min={0} max={1000} label="Change Risk Score" ticks labels/>
              {/* pin 1 — colour-ramp arc segments */}
              <span className="lead v" style={{ top: -26, left: 28, height: 22 }} />
              <div className="pin" style={{ top: -48, left: 28, transform: 'translateX(-50%)' }}>1</div>
              {/* pin 2 — active sweep (filled arc) */}
              <span className="lead v" style={{ top: -26, left: '50%', height: 22 }} />
              <div className="pin" style={{ top: -48, left: '50%', transform: 'translateX(-50%)' }}>2</div>
              {/* pin 3 — needle */}
              <span className="lead v" style={{ top: -26, right: 36, height: 22 }} />
              <div className="pin" style={{ top: -48, right: 36, transform: 'translateX(50%)' }}>3</div>
              {/* pin 4 — numeric readout */}
              <span className="lead h" style={{ bottom: 32, right: -30, width: 24 }} />
              <div className="pin" style={{ bottom: 22, right: -52 }}>4</div>
              {/* pin 5 — caption label */}
              <span className="lead v" style={{ bottom: -26, left: '50%', height: 22 }} />
              <div className="pin" style={{ bottom: -48, left: '50%', transform: 'translateX(-50%)' }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Colour-ramp arc.</b> Four segments — green (0–30%), ember (30–55%), amber (55–80%), red (80–100%) — at 32% opacity as the track. Set <Mono>inverted</Mono> to flip the palette for "high = good" metrics so green sits on the right side.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Active sweep.</b> The filled portion of the arc drawn up to the current value. Its colour matches the segment the value lands in — green, ember, amber, or red — keeping the needle and readout visually consistent.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Needle.</b> A 2px line from the pivot at the arc's midpoint. Animates over 600ms via <Mono>--ease</Mono>; snaps instantly under <Mono>prefers-reduced-motion</Mono>. The pivot circle separates it from the track.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Numeric readout.</b> Current value in tabular Geist Mono, coloured to match the active segment. Tinted <Mono>/max</Mono> suffix provides the scale at a glance. This is the accessible text value behind <Mono>role="meter"</Mono>.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Caption label.</b> Names the metric below the readout in <Mono>--text-xs</Mono> uppercase mono. Also used as the <Mono>aria-label</Mono> for the meter role — keep it unique per page if multiple gauges appear.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — set `inverted` for "high = good" metrics</div>
          <div className="body">
            <ScoreGauge variant="compact" value={87} min={0} max={100} label="Health" inverted/>
          </div>
          <div className="note">Health Score, Reliability, Coverage — all higher-is-better. Without <Mono>inverted</Mono>, the dial paints 87 red as if it were a risk.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — invent your own colour stops</div>
          <div className="body">
            <span style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', textAlign:'center', maxWidth: 240}}>
              ScoreGauge owns the green → ember → amber → red ramp.
            </span>
          </div>
          <div className="note">If a gauge on one surface reads "8 is red" and on another "8 is green", the IDP loses its trust. Use the variants — don't re-derive the palette.</div>
        </div>
      </div>

      <SubHead meta="ScoreGaugeProps">API reference</SubHead>
      {/* Generated from the typed ScoreGauge props (scripts/gen-props.mjs) — can't drift from the component. */}
      <AutoPropsTable component="ScoreGauge" label="<ScoreGauge />"/>
    </Section>
  );
}
