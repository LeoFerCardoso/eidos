'use client';
import { Icons, Frame, Section, SubHead, TabbedCode, PropsTable, installTabs, EidosChart, EidosTooltipContent, useChartColors, eidosPolarTick, Lede, Recharts, Mono } from '@/ds/core';
  const { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, Legend } = Recharts;


  // ── Spoke-label scale ──────────────────────────────────────────────────
  // Two intentional polar-tick sizes, both mono (the axis name IS the metric),
  // so the ad-hoc 9 / 9.5 / 10 / 12 values across this page collapse to one
  // pair. `angleTick` labels the full-size charts; `miniTick` labels the
  // thumbnail-scale ones (small multiples, anatomy, do/don't cards).
  const angleTick = { fill: 'var(--fg)',       fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 500 };
  const miniTick  = { fill: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500 };

  // ── Chart margins ──────────────────────────────────────────────────────
  // One inset for full-size radars (room for the perimeter labels), one for
  // thumbnails — replaces the per-Frame literal margin objects.
  const chartMargin = { top: 12, right: 24, bottom: 12, left: 24 };
  const miniMargin  = { top: 6,  right: 14, bottom: 6,  left: 14 };

  // Polar grid styling — applied per-chart via props (not CSS) so Recharts'
  // own defaults can't out-specificity us. stroke is fg at 14% (matches a
  // hairline border), dashed 3/4 for the soft "radar-screen" look, thin.
  const gridProps = {
    gridType: 'polygon',
    radialLines: false,
    stroke: 'var(--fg)',
    strokeOpacity: 0.14,
    strokeWidth: 1,
    strokeDasharray: '3 4',
  } as any;

  // SLO compliance across 6 dimensions.
  const SLO = [
    { dim: 'Availability', score: 99 },
    { dim: 'Latency p95',  score: 92 },
    { dim: 'Errors',       score: 84 },
    { dim: 'Saturation',   score: 78 },
    { dim: 'Coverage',     score: 88 },
    { dim: 'Deploy freq',  score: 70 },
  ];

  // Two services compared.
  const COMPARE = [
    { dim: 'Avail',      'eidos-api': 99, 'fraud': 96 },
    { dim: 'Latency',    'eidos-api': 92, 'fraud': 70 },
    { dim: 'Errors',     'eidos-api': 84, 'fraud': 92 },
    { dim: 'Saturation', 'eidos-api': 78, 'fraud': 88 },
    { dim: 'Coverage',   'eidos-api': 88, 'fraud': 64 },
    { dim: 'Cadence',    'eidos-api': 70, 'fraud': 82 },
  ];

  // Quality scorecard — 8 dimensions.
  const QUAL = [
    { dim: 'Tests',      score: 88 },
    { dim: 'Coverage',   score: 78 },
    { dim: 'Docs',       score: 60 },
    { dim: 'Security',   score: 92 },
    { dim: 'A11y',       score: 70 },
    { dim: 'Perf',       score: 85 },
    { dim: 'Lint',       score: 95 },
    { dim: 'Bus factor', score: 50 },
  ];

  const USAGE = `import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from "recharts"
import { EidosChart, EidosTooltipContent, useChartColors } from "@/charts"

// One mono spoke-label style + one margin, reused across every radar.
const angleTick   = { fill: "var(--fg)", fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 500 }
const chartMargin = { top: 12, right: 24, bottom: 12, left: 24 }

export function Demo({ data }) {
  const c = useChartColors()
  return (
    <EidosChart title="SLO compliance" height={300}>
      <RadarChart data={data} outerRadius="78%" margin={chartMargin}>
        <PolarGrid {...gridProps}/>
        <PolarAngleAxis dataKey="dim" tick={angleTick}/>
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false}/>
        <Tooltip content={<EidosTooltipContent/>}/>
        <Radar dataKey="score"
               stroke={c[0]} strokeWidth={1.25}
               fill={c[0]} fillOpacity={0.18}
               dot={{ r: 2.5, fill: c[0], stroke: "var(--surface)", strokeWidth: 1 }}/>
      </RadarChart>
    </EidosChart>
  )
}`;

export default function Page() {
    const c = useChartColors();
    const radarBase = { strokeWidth: 1.25, fillOpacity: 0.18 };
    return (
      <Section id="chart-radar" title="Radar chart" desc="Plots scores across 5–8 shared axes radiating from a centre — the enclosed polygon reads as a profile. Use it when balance across dimensions is the story: SLO compliance, quality scorecards, capability matrices.">
        <SubHead meta="package managers">Installation</SubHead>
        <TabbedCode tabs={installTabs('chart-radar')} ariaLabel="package manager"/>
        <Lede>Radar reads as a <em>shape</em>, not a value lookup. Use it when you want the eye to compare profiles, not numbers — for exact comparison switch to a horizontal bar.</Lede>

        <SubHead meta="hello world">Usage</SubHead>
        <Lede>Switch to a sorted horizontal bar when readers need to compare exact values — the eye reads bar lengths more accurately than polygon area. All axes must share one normalized scale (e.g. 0–100); mismatched ranges encode the scaling, not the data.</Lede>
        <Frame label="single service · SLO compliance across 6 dimensions" code={USAGE}>
          <EidosChart title="SLO compliance" subtitle="eidos-api" meta="this quarter" height={320}>
            <RadarChart data={SLO} outerRadius="78%" margin={chartMargin}>
              <PolarGrid {...gridProps}/>
              <PolarAngleAxis dataKey="dim" tick={angleTick}/>
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false}/>
              <Tooltip content={<EidosTooltipContent/>}/>
              <Radar dataKey="score" name="score"
                     stroke={c[0]} fill={c[0]} {...radarBase}
                     dot={{ r: 2.5, fill: c[0], stroke: 'var(--surface)', strokeWidth: 1 }}/>
            </RadarChart>
          </EidosChart>
        </Frame>
        <p className="t-small" style={{ color: 'var(--fg-muted)', marginBlock: 'var(--space-2) var(--space-3)' }}>
          Radar shows the <em>profile</em>; the exact numbers live in the readout below it — the accessible, screen-reader-first fallback every radar should ship beside the polygon.
        </p>
        <table className="tbl dense tbl-full" aria-label="SLO compliance scores by dimension for eidos-api, this quarter">
          <caption className="tbl-caption">eidos-api · SLO compliance · this quarter · scale 0–100</caption>
          <thead>
            <tr><th scope="col">Dimension</th><th scope="col" style={{ width: '52%' }}>Score</th><th scope="col" style={{ textAlign: 'end' }}>Value</th></tr>
          </thead>
          <tbody>
            {SLO.map((d) => (
              <tr key={d.dim}>
                <th scope="row" style={{ fontWeight: 500, color: 'var(--fg)', textTransform: 'none', letterSpacing: 0 }}>{d.dim}</th>
                <td>
                  <div className="prog neutral sm" role="img" aria-label={`${d.score} of 100`}>
                    <div className="prog-track"><div className="prog-fill" style={{ width: `${d.score}%` }}/></div>
                  </div>
                </td>
                <td className="t-mono" style={{ textAlign: 'end', color: 'var(--fg)' }}>{d.score}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <SubHead meta="3 variants">Variants</SubHead>
        <Frame label="two series · service vs service">
          <EidosChart title="Service comparison" subtitle="eidos-api vs fraud-engine" meta="quality" height={340}>
            <RadarChart data={COMPARE} outerRadius="76%" margin={chartMargin}>
              <PolarGrid {...gridProps}/>
              <PolarAngleAxis dataKey="dim" tick={angleTick}/>
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false}/>
              <Tooltip content={<EidosTooltipContent/>}/>
              <Legend wrapperStyle={{ paddingTop: 8 }}/>
              <Radar dataKey="eidos-api" stroke={c[0]} fill={c[0]} {...radarBase} dot={{ r: 2.5, fill: c[0], stroke: 'var(--surface)', strokeWidth: 1 }}/>
              <Radar dataKey="fraud"     stroke={c[2]} fill={c[2]} {...radarBase} dot={{ r: 2.5, fill: c[2], stroke: 'var(--surface)', strokeWidth: 1 }}/>
            </RadarChart>
          </EidosChart>
        </Frame>
        <Lede>Two overlaid radars max — past that the shapes blur. For a fleet comparison, render small multiples instead.</Lede>

        <Frame label="quality scorecard · 8 dimensions, sparse fill">
          <EidosChart title="Quality scorecard" subtitle="repo health" meta="8 dimensions" height={340}>
            <RadarChart data={QUAL} outerRadius="76%" margin={chartMargin}>
              <PolarGrid {...gridProps}/>
              <PolarAngleAxis dataKey="dim" tick={angleTick}/>
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false}/>
              <Tooltip content={<EidosTooltipContent/>}/>
              <Radar dataKey="score" stroke={c[0]} fill={c[0]} strokeWidth={1.25} fillOpacity={0.12}
                     dot={{ r: 3, fill: c[0], stroke: 'var(--surface)', strokeWidth: 1.5 }}/>
            </RadarChart>
          </EidosChart>
        </Frame>

        <Frame label="small multiples · scan a fleet at a glance">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, width: '100%' }}>
            {['eidos-api', 'fraud-engine', 'kyc'].map((svc, i) => (
              <EidosChart key={svc} title={svc} height={200} padding={4}>
                <RadarChart data={SLO.map((d, j) => ({ ...d, score: Math.max(40, d.score - i * 7 - (j % 3) * 4) }))}
                            outerRadius="70%" margin={miniMargin}>
                  <PolarGrid {...gridProps}/>
                  <PolarAngleAxis dataKey="dim" tick={miniTick}/>
                  <Radar dataKey="score" stroke={c[i]} fill={c[i]} strokeWidth={1.2} fillOpacity={0.2}/>
                </RadarChart>
              </EidosChart>
            ))}
          </div>
        </Frame>

        <SubHead meta="a11y">Accessibility</SubHead>
        <div className="ds-grid cols-2" style={{marginTop: 12}}>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Colour is never the only signal</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>When two profiles overlay, they're told apart by their <Mono>--viz-*</Mono> fill colour — always pair each polygon with a legend entry, and rely on the labelled spokes so the per-axis story survives without colour. Small multiples (one chart per entity) sidestep the overlap entirely.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Palette</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The categorical <Mono>--viz-cat-*</Mono> ramp is tuned for distinct luminance; because translucent overlapping fills mute that contrast, cap at two series per chart so the shapes — and their colours — stay distinguishable.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard &amp; tooltip</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>
              Tab moves into the chart, then the tooltip is keyboard-reachable and dismissed with <Mono>Esc</Mono>. Because radar communicates a shape rather than precise values, the exact per-axis scores ship as the accessible <Mono>&lt;table&gt;</Mono> under the Usage chart — a <Mono>&lt;caption&gt;</Mono>-labelled, row-header grid that screen readers and keyboards read in full.
            </div>
            <ul style={{ listStyle: 'none', margin: 'var(--space-2) 0 0', padding: 0, display: 'grid', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>
              <li><kbd className="kbd">Tab</kbd> <span style={{ marginInlineStart: 'var(--space-1)' }}>enter / leave the chart region</span></li>
              <li><kbd className="kbd">Esc</kbd> <span style={{ marginInlineStart: 'var(--space-1)' }}>dismiss the open tooltip</span></li>
              <li><kbd className="kbd">Tab</kbd> <span style={{ marginInlineStart: 'var(--space-1)' }}>step through the readout table cells</span></li>
            </ul>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The polygon's expand-from-centre animation respects <Mono>prefers-reduced-motion</Mono> — the final shape renders instantly rather than growing outward.</div>
          </div>
        </div>

        <SubHead meta="RTL · العربية">RTL</SubHead>
        <Frame label='dir="rtl" — spoke labels and legend align right; the polygon shape is radially symmetric and does not mirror'>
          <div dir="rtl" style={{width: '100%'}}>
            <EidosChart title="الامتثال للـ SLO" subtitle="eidos-api" meta="هذا الربع" height={320}>
              <RadarChart data={SLO} outerRadius="78%" margin={chartMargin}>
                <PolarGrid {...gridProps}/>
                <PolarAngleAxis dataKey="dim" tick={angleTick}/>
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false}/>
                <Tooltip content={<EidosTooltipContent/>}/>
                <Radar dataKey="score" name="النتيجة"
                       stroke={c[0]} fill={c[0]} {...radarBase}
                       dot={{ r: 2.5, fill: c[0], stroke: 'var(--surface)', strokeWidth: 1 }}/>
              </RadarChart>
            </EidosChart>
          </div>
        </Frame>
        <Lede>Under <Mono>dir="rtl"</Mono> the chart title, tooltip rows, and legend align to the right. Spoke labels around the perimeter follow the locale. The polygon itself is radially symmetric — dimensions radiate from a shared centre — so the shape does not mirror with reading direction.</Lede>

        <SubHead meta="anatomy">Anatomy</SubHead>
        <div className="ds-frame">
          <div className="ds-frame-head"><span className="label">anatomy</span></div>
          <div className="ds-frame-body" style={{padding: '64px 36px 56px'}}>
            <div className="ana" style={{display:'flex', justifyContent:'center'}}>
              <div className="stage" style={{position:'relative'}} aria-hidden="true">
                <div style={{width:240, height:200}}>
                  <EidosChart height={200} padding={0}>
                    <RadarChart data={SLO} outerRadius="72%" margin={miniMargin}>
                      <PolarGrid {...gridProps}/>
                      <PolarAngleAxis dataKey="dim" tick={miniTick}/>
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false}/>
                      <Radar dataKey="score" stroke={c[0]} fill={c[0]} {...radarBase} dot={{ r: 2, fill: c[0], stroke: 'var(--surface)', strokeWidth: 1 }}/>
                    </RadarChart>
                  </EidosChart>
                </div>
                <span className="lead v" style={{top: -22, left: 60, height: 18}}/>
                <span className="lead h" style={{top: 90, right: -28, width: 24}}/>
                <span className="lead h" style={{top: 90, left: -28, width: 24}}/>
                <span className="lead v" style={{bottom: -22, left: '50%', height: 18, transform:'translateX(-50%)'}}/>
                <div className="pin" style={{top: -42, left: 60, transform:'translateX(-50%)'}}>1</div>
                <div className="pin" style={{top: 82, right: -52}}>2</div>
                <div className="pin" style={{top: 82, left: -52}}>3</div>
                <div className="pin" style={{bottom: -42, left: '50%', transform:'translateX(-50%)'}}>4</div>
              </div>
            </div>
            <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
              <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Angle axis (spokes).</b> One labelled spoke per dimension (Availability, Latency, Errors…), set in 12px mono <Mono>--fg</Mono> so the axis names stay legible around the perimeter.</span>
              <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Polar grid.</b> Concentric polygon rings in <Mono>--fg</Mono> at 14% opacity, dashed for the soft "radar-screen" look — the shared rings that let every axis read on one scale.</span>
              <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Radius scale.</b> A hidden <Mono>PolarRadiusAxis</Mono> fixes the domain (e.g. <Mono>[0, 100]</Mono>) so the centre is the floor and the outer ring the ceiling, identically on every spoke.</span>
              <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Series polygon.</b> A thin (1.25px) stroke in <Mono>--viz-cat-1</Mono> with a soft fill (opacity ~0.18) and small dots at each vertex. A second series steps to the next <Mono>--viz-cat-*</Mono> hue; a legend is required once two profiles overlay.</span>
            </div>
          </div>
        </div>

        <SubHead meta="rules">Do / Don't</SubHead>
        <div className="dd-grid">
          <div className="dd-card do">
            <div className="head"><Icons.check size={12}/> Do — 5–8 axes, soft fill</div>
            <div className="body" style={{ padding: 8 }}>
              <EidosChart height={220} padding={4}>
                <RadarChart data={SLO} outerRadius="72%" margin={miniMargin}>
                  <PolarGrid {...gridProps}/>
                  <PolarAngleAxis dataKey="dim" tick={miniTick}/>
                  <Radar dataKey="score" stroke={c[0]} fill={c[0]} strokeWidth={1.2} fillOpacity={0.2}/>
                </RadarChart>
              </EidosChart>
            </div>
            <div className="note">6 ± 2 axes is the sweet spot. Stroke 1.25, fill opacity 0.18 — the shape registers without overwhelming the labels.</div>
          </div>
          <div className="dd-card dont">
            <div className="head"><Icons.x size={12}/> Don't — 16 spiky axes with bold edges</div>
            <div className="body" style={{ padding: 8 }}>
              <EidosChart height={220} padding={4}>
                <RadarChart data={Array.from({ length: 16 }, (_, i) => ({ dim: 'd' + (i + 1), v: 40 + Math.abs(Math.sin(i)) * 50 }))}
                            outerRadius="70%" margin={miniMargin}>
                  <PolarGrid/>
                  <PolarAngleAxis dataKey="dim" tick={{ ...miniTick, fill: 'var(--fg-faint)' }}/>
                  <Radar dataKey="v" stroke={c[1]} fill={c[1]} strokeWidth={2.5} fillOpacity={0.5}/>
                </RadarChart>
              </EidosChart>
            </div>
            <div className="note">Too many axes + heavy strokes turn the shape into a starburst. Drop to 6 axes and soften — or use small multiples.</div>
          </div>
        </div>

        <SubHead meta="props">API reference</SubHead>
        <PropsTable
          label="<Radar /> + <RadarChart />"
          rows={[
            { prop: 'dataKey',      type: 'string',   description: 'Field plotted along each axis.' },
            { prop: 'stroke',       type: 'CSS color',description: 'Outline of the polygon. Keep at 1–1.5 stroke-width.' },
            { prop: 'fill',         type: 'CSS color',description: 'Filled region. Keep opacity 0.15–0.22 so overlapping series remain readable.' },
            { prop: 'fillOpacity',  type: 'number',   default: '0.18' },
            { prop: 'PolarAngleAxis tick', type: 'object', description: 'Style for axis labels. Eidos default: 12px mono / --fg / weight 500.' },
            { prop: 'PolarGrid gridType',  type: '"polygon" | "circle"', default: '"polygon"', description: 'Polygon mirrors the data shape; circle is more decorative.' },
            { prop: 'PolarRadiusAxis domain', type: '[min, max]', default: '[0, "auto"]', description: 'Force the radial scale (e.g. [0, 100] for percentages).' },
          ]}
        />
      </Section>
    );
}
