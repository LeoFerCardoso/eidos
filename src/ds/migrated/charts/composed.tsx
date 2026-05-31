'use client';
import { Icons, Frame, Section, SubHead, TabbedCode, PropsTable, installTabs, ForgeChart, ForgeTooltipContent, useChartColors, forgeGridProps, forgeXAxisProps, forgeYAxisProps, Recharts, Lede, Mono } from '@/ds/core';

const { ComposedChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } = Recharts;

// Deploys (bar) and success rate (line) per day.
const CICD = Array.from({ length: 10 }, (_, d) => ({
  day:  'd' + (d + 1),
  runs: Math.round(28 + 6 * Math.sin(d) + d),
  pct:  Math.round(Math.max(92, 99 - (d === 5 ? 5 : Math.abs(Math.sin(d) * 3))) * 10) / 10,
}));

// Requests (area) + p95 latency (line).
const PERF = Array.from({ length: 12 }, (_, h) => ({
  hour: 'h' + (h * 2).toString().padStart(2, '0'),
  rps:  Math.round(220 + 60 * Math.sin(h / 2)),
  p95:  Math.round(110 + 14 * Math.cos(h / 2)),
}));

// Cost (bar) vs forecast (line).
const COST = Array.from({ length: 8 }, (_, w) => ({
  week:     'w' + (w + 1),
  spend:    Math.round(1800 + w * 120 + Math.sin(w) * 80),
  forecast: Math.round(1800 + w * 140),
}));

  const USAGE = `import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { ForgeChart, ForgeTooltipContent, useChartColors,
         forgeGridProps, forgeXAxisProps, forgeYAxisProps } from "@/charts"

export function Demo({ data }) {
  const c = useChartColors()
  return (
    <ForgeChart title="CI runs vs success rate" height={280}>
      <ComposedChart data={data}>
        <CartesianGrid {...forgeGridProps}/>
        <XAxis dataKey="day" {...forgeXAxisProps}/>
        <YAxis yAxisId="l" {...forgeYAxisProps}/>
        <YAxis yAxisId="r" orientation="right" {...forgeYAxisProps} domain={[80, 100]}/>
        <Tooltip content={<ForgeTooltipContent/>}/>
        <Bar  yAxisId="l" dataKey="runs" fill={c[1]} radius={[3,3,0,0]}/>
        <Line yAxisId="r" dataKey="pct"  stroke={c[0]} strokeWidth={2} dot={false}/>
      </ComposedChart>
    </ForgeChart>
  )
}`;

export default function Page() {
    const c = useChartColors();
    return (
      <Section id="chart-composed" title="Composed chart" desc="Layers bar, line, and area on one surface to relate two metrics that share an X axis but differ in unit — volume vs rate, count vs goal. Reach for it when the pairing tells a story a single chart type cannot.">
        <SubHead meta="package managers">Installation</SubHead>
        <TabbedCode tabs={installTabs('chart-composed')} ariaLabel="package manager"/>
        <Lede>Two series with different units share a chart only when each has its own Y axis. The <Mono>yAxisId</Mono> on each series binds it to a <Mono>&lt;YAxis&gt;</Mono>; the <Mono>orientation="right"</Mono> Y axis keeps the secondary unit out of the primary's way.</Lede>

        <SubHead meta="hello world">Usage</SubHead>
        <Frame label="bar (count) + line (rate) · CI runs vs success" code={USAGE}>
          <ForgeChart title="CI runs vs success rate" subtitle="ci-runner" meta="last 10 days" height={280}>
            <ComposedChart data={CICD} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid {...forgeGridProps}/>
              <XAxis dataKey="day" {...forgeXAxisProps}/>
              <YAxis yAxisId="l" {...forgeYAxisProps}/>
              <YAxis yAxisId="r" orientation="right" {...forgeYAxisProps} domain={[80, 100]}/>
              <Tooltip content={<ForgeTooltipContent/>}/>
              <Bar  yAxisId="l" dataKey="runs" name="runs" fill={c[1]} radius={[3, 3, 0, 0]} maxBarSize={22}/>
              <Line yAxisId="r" type="monotone" dataKey="pct" name="success %" stroke={c[0]} strokeWidth={2} dot={false}/>
            </ComposedChart>
          </ForgeChart>
        </Frame>
        <Lede>Bars in the back, lines on top — readers naturally focus on the line as the "rate" story. The right axis hosts the percentage so its scale doesn't collide with raw counts.</Lede>

        <details className="surface" style={{padding: 'var(--space-5)', marginBlockStart: 'var(--space-3)'}}>
          <summary className="t-body" style={{fontWeight: 600, cursor: 'pointer'}}>Data table <span className="t-mono-label" style={{marginInlineStart: 'var(--space-2)'}}>screen-reader fallback</span></summary>
          <div className="t-small" style={{color: 'var(--fg-muted)', marginBlockStart: 'var(--space-2)'}}>The same dataset as a real <Mono>&lt;table&gt;</Mono> — the keyboard- and screen-reader-accessible path to the figures the SVG plots only visually. Numerics align in Geist Mono.</div>
          <table className="tbl" style={{marginBlockStart: 'var(--space-3)', marginBlockEnd: 0}}>
            <caption className="t-mono-label" style={{textAlign: 'start', paddingBlockEnd: 'var(--space-2)'}}>CI runs vs success rate · last 10 days</caption>
            <thead>
              <tr>
                <th style={{width: 96}}>Day</th>
                <th style={{textAlign: 'end'}}>Runs (count)</th>
                <th style={{textAlign: 'end'}}>Success (%)</th>
              </tr>
            </thead>
            <tbody>
              {CICD.map((r) => (
                <tr key={r.day}>
                  <td>{r.day}</td>
                  <td style={{textAlign: 'end', fontVariantNumeric: 'tabular-nums', fontFamily: 'var(--font-mono)'}}>{r.runs}</td>
                  <td style={{textAlign: 'end', fontVariantNumeric: 'tabular-nums', fontFamily: 'var(--font-mono)'}}>{r.pct.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>

        <SubHead meta="3 variants">Variants</SubHead>
        <Frame label="area + line · traffic vs latency">
          <ForgeChart title="Traffic vs p95 latency" subtitle="forge-api" meta="24h" height={260}>
            <ComposedChart data={PERF} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid {...forgeGridProps}/>
              <XAxis dataKey="hour" {...forgeXAxisProps}/>
              <YAxis yAxisId="l" {...forgeYAxisProps}/>
              <YAxis yAxisId="r" orientation="right" {...forgeYAxisProps}/>
              <Tooltip content={<ForgeTooltipContent/>}/>
              <Area yAxisId="l" type="monotone" dataKey="rps" name="rps" stroke={c[1]} fill={c[1]} fillOpacity={0.18}/>
              <Line yAxisId="r" type="monotone" dataKey="p95" name="p95 ms" stroke={c[0]} strokeWidth={2} dot={false}/>
            </ComposedChart>
          </ForgeChart>
        </Frame>

        <Frame label="bar + line · actual vs forecast (same unit, single axis)">
          <ForgeChart title="Spend vs forecast" subtitle="finops" meta="8 weeks · USD" height={240}>
            <ComposedChart data={COST} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
              <CartesianGrid {...forgeGridProps}/>
              <XAxis dataKey="week" {...forgeXAxisProps}/>
              <YAxis {...forgeYAxisProps}/>
              <Tooltip content={<ForgeTooltipContent/>}/>
              <Bar  dataKey="spend"    name="spend"    fill={c[1]} radius={[3, 3, 0, 0]} maxBarSize={24}/>
              <Line dataKey="forecast" name="forecast" stroke={c[0]} strokeWidth={2} strokeDasharray="4 4" dot={false}/>
            </ComposedChart>
          </ForgeChart>
        </Frame>

        <SubHead meta="a11y">Accessibility</SubHead>
        <div className="ds-grid cols-2" style={{marginBlockStart: 'var(--space-3)'}}>
          <div className="surface" style={{padding: 'var(--space-5)'}}>
            <div className="t-body" style={{fontWeight: 600, marginBlockEnd: 'var(--space-1)'}}>Colour is never the only signal</div>
            <div className="t-small" style={{color: 'var(--fg-muted)'}}>The bar/area and the line are already distinguished by shape, which helps colour-blind readers — but still pair each <Mono>--viz-*</Mono> series with a legend entry, and label each Y axis with its unit so readers know which scale a series belongs to without relying on colour.</div>
          </div>
          <div className="surface" style={{padding: 'var(--space-5)'}}>
            <div className="t-body" style={{fontWeight: 600, marginBlockEnd: 'var(--space-1)'}}>Palette</div>
            <div className="t-small" style={{color: 'var(--fg-muted)'}}>Series step through the categorical <Mono>--viz-cat-*</Mono> ramp, tuned for distinct luminance; keep a composed chart to 2–3 series so the layered marks and their colours stay legible against each other.</div>
          </div>
          <div className="surface" style={{padding: 'var(--space-5)'}}>
            <div className="t-body" style={{fontWeight: 600, marginBlockEnd: 'var(--space-1)'}}>Keyboard &amp; tooltip</div>
            <div className="t-small" style={{color: 'var(--fg-muted)'}}>The SVG plot is not itself a tab stop — Recharts renders no focusable marks. The tooltip is pointer- and touch-driven, so the keyboard path is the data <Mono>&lt;table&gt;</Mono> below.</div>
            <table className="tbl" style={{marginBlockStart: 'var(--space-3)', marginBlockEnd: 0}}>
              <thead>
                <tr><th style={{width: 132}}>Key</th><th>Action</th></tr>
              </thead>
              <tbody>
                <tr><td><Mono>Tab</Mono></td><td>Move to the next interactive element — skips the plot, lands on the table</td></tr>
                <tr><td><Mono>Arrow keys</Mono></td><td>Move cell to cell within the data table</td></tr>
                <tr><td><Mono>Esc</Mono></td><td>Dismiss the hover tooltip when a pointer raised it</td></tr>
              </tbody>
            </table>
          </div>
          <div className="surface" style={{padding: 'var(--space-5)'}}>
            <div className="t-body" style={{fontWeight: 600, marginBlockEnd: 'var(--space-1)'}}>Motion</div>
            <div className="t-small" style={{color: 'var(--fg-muted)'}}>The bar grow and line draw animations respect <Mono>prefers-reduced-motion</Mono> — both layers render in their final state instantly. Contrast: every <Mono>--viz-cat-*</Mono> series clears 3:1 against the chart surface, and axis labels clear AA against <Mono>--bg</Mono>.</div>
          </div>
        </div>

        <SubHead meta="RTL · العربية">RTL</SubHead>
        <Frame label='dir="rtl" — title, legend and tooltip labels align right; axes and series do not mirror'>
          <div dir="rtl" style={{width: '100%'}}>
            <ForgeChart title="تشغيل CI مقابل معدل النجاح" subtitle="منفذ CI" meta="آخر ١٠ أيام" height={260}>
              <ComposedChart data={CICD} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid {...forgeGridProps}/>
                <XAxis dataKey="day" {...forgeXAxisProps}/>
                <YAxis yAxisId="l" {...forgeYAxisProps}/>
                <YAxis yAxisId="r" orientation="right" {...forgeYAxisProps} domain={[80, 100]}/>
                <Tooltip content={<ForgeTooltipContent/>}/>
                <Bar  yAxisId="l" dataKey="runs" name="تشغيل" fill={c[1]} radius={[3, 3, 0, 0]} maxBarSize={22}/>
                <Line yAxisId="r" type="monotone" dataKey="pct" name="نجاح ٪" stroke={c[0]} strokeWidth={2} dot={false}/>
              </ComposedChart>
            </ForgeChart>
          </div>
        </Frame>
        <Lede>Under <Mono>dir="rtl"</Mono> the chart chrome (title, tooltip rows, legend entries) aligns to the right. The dual Y axes remain in their left/right positions — they are structural, not directional — and the plotted bars and line do not mirror.</Lede>

        <SubHead meta="anatomy">Anatomy</SubHead>
        <div className="ds-frame">
          <div className="ds-frame-head"><span className="label">anatomy</span></div>
          <div className="ds-frame-body" style={{padding: '64px 36px 56px'}}>
            <div className="ana" style={{display:'flex', justifyContent:'center'}}>
              <div className="stage" style={{position:'relative'}} aria-hidden="true">
                <div style={{width:340, height:180}}>
                  <ForgeChart height={180}>
                    <ComposedChart data={CICD} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                      <CartesianGrid {...forgeGridProps}/>
                      <XAxis dataKey="day" {...forgeXAxisProps}/>
                      <YAxis yAxisId="l" {...forgeYAxisProps}/>
                      <YAxis yAxisId="r" orientation="right" {...forgeYAxisProps} domain={[80, 100]}/>
                      <Bar  yAxisId="l" dataKey="runs" fill={c[1]} radius={[3, 3, 0, 0]} maxBarSize={18}/>
                      <Line yAxisId="r" type="monotone" dataKey="pct" stroke={c[0]} strokeWidth={2} dot={false}/>
                    </ComposedChart>
                  </ForgeChart>
                </div>
                <span className="lead h" style={{top: 90, left: -28, width: 24}}/>
                <span className="lead h" style={{top: 90, right: -28, width: 24}}/>
                <span className="lead v" style={{bottom: -22, left: '50%', height: 18, transform:'translateX(-50%)'}}/>
                <span className="lead v" style={{top: -22, left: 150, height: 18}}/>
                <div className="pin" style={{top: 82, left: -52}}>2</div>
                <div className="pin" style={{top: 82, right: -52}}>3</div>
                <div className="pin" style={{bottom: -42, left: '50%', transform:'translateX(-50%)'}}>1</div>
                <div className="pin" style={{top: -42, left: 150, transform:'translateX(-50%)'}}>4</div>
              </div>
            </div>
            <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
              <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Shared X axis.</b> Every series plots against the same categories or time interval — that shared baseline is what justifies overlaying them.</span>
              <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Left value axis.</b> Hosts the primary unit (a raw count, traffic volume), bound to the bars or area via <Mono>yAxisId</Mono>.</span>
              <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Right value axis.</b> An <Mono>orientation="right"</Mono> axis for the secondary unit (a percentage, a latency) so its scale never collides with the primary's.</span>
              <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Series layering.</b> Bars/area in <Mono>--viz-cat-2</Mono> sit in back as volume; the line in <Mono>--viz-cat-1</Mono> rides on top as the rate. A legend disambiguates the mixed series.</span>
            </div>
          </div>
        </div>

        <SubHead meta="rules">Do / Don't</SubHead>
        <div className="dd-grid">
          <div className="dd-card do">
            <div className="head"><Icons.check size={12}/> Do — bar in back, line on top</div>
            <div className="body">
              <ForgeChart height={140} padding={8}>
                <ComposedChart data={CICD} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                  <CartesianGrid {...forgeGridProps}/>
                  <XAxis dataKey="day" {...forgeXAxisProps} hide/>
                  <YAxis yAxisId="l" {...forgeYAxisProps}/>
                  <YAxis yAxisId="r" orientation="right" {...forgeYAxisProps} domain={[80, 100]}/>
                  <Bar  yAxisId="l" dataKey="runs" fill={c[1]} radius={[3, 3, 0, 0]} maxBarSize={16}/>
                  <Line yAxisId="r" dataKey="pct" stroke={c[0]} strokeWidth={2} dot={false}/>
                </ComposedChart>
              </ForgeChart>
            </div>
            <div className="note">The bar is the "volume" (left axis, raw count), the line is the "rate" (right axis, percent). Putting them on separate <Mono>yAxisId</Mono>s lets both scales breathe; the line rides above the bars instead of being crushed.</div>
          </div>
          <div className="dd-card dont">
            <div className="head"><Icons.x size={12}/> Don't — two units, one axis</div>
            <div className="body">
              <ForgeChart height={140} padding={8}>
                <ComposedChart data={CICD} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                  <CartesianGrid {...forgeGridProps}/>
                  <XAxis dataKey="day" {...forgeXAxisProps} hide/>
                  <YAxis {...forgeYAxisProps}/>
                  <Bar  dataKey="runs" fill={c[1]} radius={[3, 3, 0, 0]} maxBarSize={16}/>
                  <Line dataKey="pct" stroke={c[0]} strokeWidth={2} dot={false}/>
                </ComposedChart>
              </ForgeChart>
            </div>
            <div className="note">A 98% line flattens against a 30-count bar when forced onto one axis — both stories disappear. Always pair a Bar + Line composed chart with dual <Mono>YAxis</Mono> elements.</div>
          </div>
        </div>

        <SubHead meta="props">API reference</SubHead>
        <PropsTable
          label="<ComposedChart />"
          rows={[
            { prop: 'data',     type: 'object[]',  description: 'Shared dataset — each child series picks its dataKey from each row.' },
            { prop: 'yAxisId',  type: 'string',    description: 'Bind a series to one of multiple <YAxis> nodes. Use "l" / "r" for left/right.' },
            { prop: 'children', type: 'ReactNode', description: 'Mix <Bar>, <Line>, <Area>, <Scatter> in any combination.' },
          ]}
        />
      </Section>
    );
}
