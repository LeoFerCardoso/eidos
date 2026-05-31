'use client';
// Eidos DS — Components / RingBar
// Horizontal cohort strip for ring-deployment rollouts. The concentric
// variant was retired in v1.5.0 — see CHANGELOG.
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, RingBar, Lede, Mono } from '@/ds/core';


const RINGS = [
  { label: 'Ring 0', audience: 'Engineers (Eidos team)',         percent: 100, status: 'done' },
  { label: 'Ring 1', audience: 'Internal dogfood (~120 ppl)',     percent: 100, status: 'done' },
  { label: 'Ring 2', audience: 'Early-access cohorts (3 squads)', percent: 100, status: 'done' },
  { label: 'Ring 3', audience: '50% of production traffic',       percent: 64,  status: 'running' },
  { label: 'Ring 4', audience: 'Everyone',                        percent: 0,   status: 'pending' },
];

const USAGE = `import { RingBar } from "@/components/forge/ring-bar"

export function Demo() {
  return (
    <RingBar
      currentRing={3}
      rings={[
        { label: "Ring 0", audience: "Engineers",         percent: 100, status: "done" },
        { label: "Ring 1", audience: "Internal dogfood",  percent: 100, status: "done" },
        { label: "Ring 2", audience: "Early access",      percent: 100, status: "done" },
        { label: "Ring 3", audience: "50% of traffic",    percent: 64,  status: "running" },
        { label: "Ring 4", audience: "Everyone",          percent: 0,   status: "pending" },
      ]}
      popoverFor={(ring) => <RingDetail ring={ring}/>}
    />
  )
}`;

export default function RingBarPage() {
  return (
    <Section id="ring-bar" title="Ring bar" desc="Progressive-rollout visualisation for ring deployments — the cohort strip on a release page showing how far a change has expanded. Done cells are green, the in-flight cell pulses ember, pending cells stay neutral.">
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('ring-bar')} ariaLabel="package manager"/>
      <Lede>Each ring carries a <Mono>label</Mono>, an <Mono>audience</Mono> (rendered legibly — never with faint type), a <Mono>percent</Mono> (traffic share), and a <Mono>status</Mono>. Cells flex to share width; the strip becomes responsive without manual breakpoints.</Lede>

      <SubHead meta="hello world">Usage</SubHead>
      <Lede>Ring rollouts are inherently left-to-right (expanding exposure) — the horizontal strip is the only variant. An optional click-to-reveal popover per cell composes any content: runbook link, abort CTA, or live stats. The old concentric SVG was retired in v1.5.0 because it read as a bullseye, not a journey.</Lede>
      <Frame label="default" code={USAGE}>
        {/* Rollout readout — a release-page header derived from RINGS (cannot drift): the cohort
            math IS the headline, ember marks only the single in-flight figure. Reframes the strip
            as a live release, not a static widget, and argues the page thesis: read the number. */}
        {(() => {
          const shipped = RINGS.filter((r) => r.status === 'done').length;
          const live = RINGS[3];
          return (
            <div style={{ display:'flex', alignItems:'baseline', flexWrap:'wrap', gap: '4px 10px', marginBlockEnd: 16,
                          fontFamily:'var(--font-mono)', fontSize:'var(--text-sm)', fontVariantNumeric:'tabular-nums', color:'var(--fg-muted)' }}>
              <span style={{ color:'var(--fg)', fontWeight: 500 }}>{shipped}/{RINGS.length} rings shipped</span>
              <span aria-hidden="true">·</span>
              <span><span style={{ color:'var(--fg-muted)' }}>{live.label.toLowerCase()} in flight at </span><span style={{ color:'var(--ember)', fontWeight: 600 }}>{live.percent}%</span></span>
            </div>
          );
        })()}
        <RingBar rings={RINGS} currentRing={3}/>
      </Frame>

      <div style={{ marginBlockStart: 36, marginBlockEnd: 6, display:'flex', alignItems:'center', gap: 12 }}>
        <span style={{ fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--fg-faint)' }}>States &amp; variations</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      <SubHead meta="three cohort journey">3 rings</SubHead>
      <Frame label="canary → 50% → everyone">
        <RingBar rings={RINGS.slice(2)} currentRing={1}/>
      </Frame>

      <SubHead meta="popover · click any cell">With detail popover</SubHead>
      <Frame label="click a ring to open the runbook / stats card">
        <RingBar rings={RINGS} currentRing={3}
                 popoverFor={(r) => (
                   <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
                     <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, color:'var(--fg)' }}>{r.label} · {r.percent}% traffic</div>
                     <div style={{ fontSize: 'var(--text-sm)', color:'var(--fg-muted)' }}>{r.audience}</div>
                     <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10, marginTop: 4, fontSize: 'var(--text-sm)' }}>
                       <div><div style={{color:'var(--fg-faint)', fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom: 2}}>p95</div><div style={{fontFamily:'var(--font-mono)', color:'var(--fg)'}}>187 ms</div></div>
                       <div><div style={{color:'var(--fg-faint)', fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom: 2}}>error</div><div style={{fontFamily:'var(--font-mono)', color:'var(--fg)'}}>0.12 %</div></div>
                     </div>
                     <div style={{ display:'flex', gap: 6, marginTop: 8 }}>
                       <button className="btn ghost sm">Open runbook</button>
                       <button className="btn ember sm">Promote</button>
                     </div>
                   </div>
                 )}/>
      </Frame>
      <Lede>Popover composition is yours — RingBar only takes a render prop. Compose anything: stat row, mini-pipeline, runbook link, abort CTA.</Lede>

      <SubHead meta="error cohort">Failure state</SubHead>
      <Frame label="ring 3 rolled back · downstream halted">
        <RingBar rings={[
          { label: 'Ring 0', audience: 'Engineers',         percent: 100, status: 'done' },
          { label: 'Ring 1', audience: 'Internal dogfood',  percent: 100, status: 'done' },
          { label: 'Ring 2', audience: 'Early access',      percent: 38,  status: 'error' },
          { label: 'Ring 3', audience: '50% of traffic',    percent: 0,   status: 'pending' },
          { label: 'Ring 4', audience: 'Everyone',          percent: 0,   status: 'pending' },
        ]} currentRing={2}/>
      </Frame>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>When <Mono>popoverFor</Mono> is set, each cell is a button reachable with <Mono>Tab</Mono> that opens its popover on <Mono>Enter</Mono> / <Mono>Space</Mono> and dismisses on <Mono>Escape</Mono>; focus moves into the popover and returns to the cell on close. Without a popover the strip is a non-interactive status display and stays out of the tab order.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Each cell's accessible name is its label, audience, traffic percent and status (<Mono>Ring 3, 50% of traffic, 64%, running</Mono>); the in-flight cell carries <Mono>aria-current="step"</Mono>. An interactive cell exposes <Mono>aria-haspopup</Mono> and <Mono>aria-expanded</Mono> for its detail popover. The percent is read as text, not inferred from cell width.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Status, not colour alone</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Cohort status never rides on tone alone: the text percent and the track fill width are the non-colour cues — a done cell reads <Mono>100%</Mono> with a full track, a pending cell reads <Mono>0%</Mono> with an empty one, regardless of the green / ember / danger colour. (The <Mono>StatusDot</Mono> itself is a decorative, <Mono>aria-hidden</Mono> tone marker, not the readout.) The audience line is rendered in legible muted type (never faint), and label / audience / percent all meet AA against the cell fill.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Density &amp; focus</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Cells flex to share width but stay roomy enough to keep the target above the minimum and the label legible; an interactive cell keeps a visible focus ring. The in-flight cell's ember pulse is suppressed under <Mono>prefers-reduced-motion</Mono> and falls back to a static ember fill.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label='dir="rtl" — ring cells read right-to-left; label, percent, and audience mirror to the inline-start'>
        <div dir="rtl">
          <RingBar rings={[
            { label: 'Ring 0', audience: 'المهندسون',             percent: 100, status: 'done' },
            { label: 'Ring 1', audience: 'الاختبار الداخلي',       percent: 100, status: 'done' },
            { label: 'Ring 2', audience: '50% من حركة المرور',    percent: 64,  status: 'running' },
            { label: 'Ring 3', audience: 'الجميع',                percent: 0,   status: 'pending' },
          ]} currentRing={2}/>
        </div>
      </Frame>
      <Lede>
        The ring strip uses logical CSS so under <Mono>dir="rtl"</Mono> cells are laid out from right to left — Ring 0 anchors at the inline-start (right) edge and exposure expands leftward. Ring label, percent value, and audience line all align from the right. The progress track fill starts from the inline-start edge as well, matching the reading direction.
      </Lede>

      {/* ====================================================================
          ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 64px' }}>
          {/* Stage pinned to an explicit inline-size (600px → the RingBar's auto-fit grid resolves
              to exactly 3 equal cells of ~193px + 2 × 10px gap), so the demo geometry is deterministic.
              Pins/leads are then anchored with LOGICAL insets (insetInlineStart / insetBlockStart|End)
              measured from that fixed inline-size — the callouts stay aligned across viewports and
              flip to track the right cells under dir="rtl" instead of drifting off a hard-coded strip. */}
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', inlineSize: 600, maxInlineSize: '100%' }} aria-hidden="true">
              <RingBar rings={[
                { label: 'Ring 1', audience: 'Internal dogfood', percent: 100, status: 'done' },
                { label: 'Ring 2', audience: '50% of traffic',   percent: 64,  status: 'running' },
                { label: 'Ring 3', audience: 'Everyone',         percent: 0,   status: 'pending' },
              ]} currentRing={1}/>
              {/* pin 1 — ring label + status dot, start of first cell (~32px in) */}
              <span className="lead v" style={{ insetBlockStart: -26, insetInlineStart: 32, height: 20 }} />
              <div className="pin" style={{ insetBlockStart: -48, insetInlineStart: 32, transform: 'translateX(-50%)' }}>1</div>
              {/* pin 2 — percent value, trailing end of first cell (~165px in) */}
              <span className="lead v" style={{ insetBlockStart: -26, insetInlineStart: 165, height: 20 }} />
              <div className="pin" style={{ insetBlockStart: -48, insetInlineStart: 165, transform: 'translateX(-50%)' }}>2</div>
              {/* pin 3 — audience line, below first cell */}
              <span className="lead v" style={{ insetBlockEnd: -26, insetInlineStart: 70, height: 20 }} />
              <div className="pin" style={{ insetBlockEnd: -48, insetInlineStart: 70, transform: 'translateX(-50%)' }}>3</div>
              {/* pin 4 — progress track/fill, centred under the second cell (cell-2 centre ≈ 300px) */}
              <span className="lead v" style={{ insetBlockEnd: -26, insetInlineStart: 300, height: 20 }} />
              <div className="pin" style={{ insetBlockEnd: -48, insetInlineStart: 300, transform: 'translateX(-50%)' }}>4</div>
              {/* pin 5 — ember current-ring tint on the running cell, anchored to the inline-end edge */}
              <span className="lead h" style={{ insetBlockStart: 20, insetInlineEnd: -32, width: 28 }} />
              <div className="pin" style={{ insetBlockStart: 12, insetInlineEnd: -56 }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 580, margin: '72px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Ring label + status dot.</b> <Mono>StatusDot</Mono> coloured by the cell's tone (<Mono>done</Mono> green, <Mono>running</Mono> ember pulse, <Mono>pending</Mono> neutral, <Mono>error</Mono> red) placed at the start of the label row. The dot is a decorative <Mono>aria-hidden</Mono> tone marker — the non-colour readout is the text percent (pin&nbsp;2) and the track fill (pin&nbsp;4), so status never rides on colour alone.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Percent value.</b> Trailing right of the label row, Geist Mono 500. Reads as text by assistive tech — the cell width is not the readout, this number is. Reads "100%" for done, "0%" for pending.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Audience line.</b> One line of muted copy below the heading row: team name, cohort size, or traffic share. Rendered in <Mono>var(--fg-muted)</Mono> — legible but quieter than the label. Never <Mono>var(--fg-faint)</Mono>.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Progress track.</b> Thin horizontal bar spanning the full cell width. The coloured fill expands to <Mono>percent%</Mono> via an inline <Mono>width</Mono> style; colour matches the cell tone via <Mono>--status-*</Mono>.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Current-ring tint.</b> The <Mono>is-current</Mono> cell receives an ember background tint and the status dot pulses. Suppressed under <Mono>prefers-reduced-motion</Mono>. When <Mono>popoverFor</Mono> is set the cell becomes a button and gains <Mono>aria-haspopup</Mono>.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — keep cells roomy, label first</div>
          <div className="body">
            <RingBar rings={RINGS.slice(0,3)} currentRing={2}/>
          </div>
          <div className="note">Big label (base / 600), legible audience (small / muted, never faint), percent in mono on the right.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — stack 8 rings into a concentric SVG</div>
          <div className="body" style={{ fontFamily:'var(--font-mono)', fontSize: 'var(--text-sm)', color:'var(--fg-faint)', textAlign:'center', padding: '14px 0' }}>
            removed in v1.5.0<br/>
            <span style={{ fontSize: 'var(--text-xs)' }}>concentric reads as a bullseye, not a journey</span>
          </div>
          <div className="note">Ring rollouts are inherently left-to-right (expanding exposure). The horizontal strip is the only variant — if you need radial visualisations, use a Gauge or Radial chart.</div>
        </div>
      </div>

      <SubHead meta="RingBarProps">API reference</SubHead>
      {/* Generated from the typed RingBar props (scripts/gen-props.mjs) — can't drift from the component. */}
      <AutoPropsTable component="RingBar" label="<RingBar />"/>
    </Section>
  );
}
