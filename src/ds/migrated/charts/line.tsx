'use client';
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, PropsTable, installTabs, EidosChart, EidosTooltipContent, useChartColors, eidosGridProps, eidosXAxisProps, eidosYAxisProps, Lede, Recharts, Mono } from '@/ds/core';
  const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } = Recharts;

  // Honour prefers-reduced-motion: when set, the line renders fully drawn
  // instead of tracing in left-to-right. Wired into every <Line> below via
  // isAnimationActive so the docs' "Motion" claim is true to the rendered chart.
  function usePrefersReducedMotion() {
    const [reduced, setReduced] = React.useState(false);
    React.useEffect(() => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      const update = () => setReduced(mq.matches);
      update();
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    }, []);
    return reduced;
  }


  // RPS over a 24h window — single series.
  const RPS = Array.from({ length: 24 }, (_, h) => ({
    hour: String(h).padStart(2, '0') + ':00',
    rps:  Math.round(180 + 60 * Math.sin(h / 3) + 30 * Math.sin(h)),
  }));

  // Latency p50/p95/p99 by minute — multi-series.
  const LAT = Array.from({ length: 30 }, (_, m) => ({
    t: 'm' + (m + 1),
    p50: Math.round(40 + 6 * Math.sin(m / 4)),
    p95: Math.round(120 + 20 * Math.sin(m / 3)),
    p99: Math.round(260 + 40 * Math.sin(m / 2)),
  }));

  // Build success rate vs SLO target.
  const RATE = Array.from({ length: 14 }, (_, d) => ({
    day: 'd' + (d + 1),
    pct: 98.4 + Math.sin(d) * 0.6 - (d === 9 ? 1.4 : 0),
  }));

  const USAGE = `import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { EidosChart, EidosTooltipContent, useChartColors,
         eidosGridProps, eidosXAxisProps, eidosYAxisProps } from "@/charts"

export function Demo({ data }) {
  const c = useChartColors()
  return (
    <EidosChart title="Requests / minute" meta="last 24h" height={280}>
      <LineChart data={data}>
        <CartesianGrid {...eidosGridProps}/>
        <XAxis dataKey="hour" {...eidosXAxisProps}/>
        <YAxis {...eidosYAxisProps}/>
        <Tooltip content={<EidosTooltipContent/>}/>
        <Line type="monotone" dataKey="rps" stroke={c[0]} strokeWidth={2} dot={false}/>
      </LineChart>
    </EidosChart>
  )
}`;

export default function Page() {
    const c = useChartColors();
    const reduced = usePrefersReducedMotion();
    const anim = !reduced; // isAnimationActive — off under prefers-reduced-motion
    return (
      <Section id="chart-line" title="Line chart" desc="Connects ordered points to show how a continuous value moves over time — slope is the message. Reach for it when trend and rate of change matter most: RPS, latency percentiles, queue depth, SLO compliance.">
        <SubHead meta="package managers">Installation</SubHead>
        <TabbedCode tabs={installTabs('chart-line')} ariaLabel="package manager"/>
        <Lede>Wrap a Recharts <Mono>&lt;LineChart&gt;</Mono> in <Mono>&lt;EidosChart&gt;</Mono> to get the Eidos card chrome (header, padding, ResponsiveContainer). Spread <Mono>eidosGridProps</Mono>, <Mono>eidosXAxisProps</Mono>, <Mono>eidosYAxisProps</Mono> for sensible defaults.</Lede>

        <SubHead meta="hello world">Usage</SubHead>
        <Lede>Prefer a bar chart for comparing discrete categories. The Y domain may be clipped to reveal small movements — a line communicates change, not proportion — but label the axis bounds clearly so a tight wobble is not mistaken for a cliff.</Lede>
        <Frame label="single series · requests-per-minute · 24h" code={USAGE}>
          <EidosChart title="Requests / minute" subtitle="eidos-api" meta="last 24h" height={260}>
            <LineChart data={RPS} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
              <CartesianGrid {...eidosGridProps}/>
              <XAxis dataKey="hour" {...eidosXAxisProps} interval={3}/>
              <YAxis {...eidosYAxisProps}/>
              <Tooltip content={<EidosTooltipContent/>}/>
              <Line type="monotone" dataKey="rps" name="rps" stroke={c[0]} strokeWidth={2} dot={false} isAnimationActive={anim}/>
            </LineChart>
          </EidosChart>
        </Frame>
        <Lede>Hide individual dots (<Mono>dot={'{'}false{'}'}</Mono>) when you have more than ~20 points — the line itself tells the story.</Lede>

        <SubHead meta="3 variants">Variants</SubHead>
        <Frame label="multi-series · p50 / p95 / p99 latency">
          <EidosChart title="Latency percentiles" subtitle="eidos-api" meta="ms" height={260}>
            <LineChart data={LAT} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
              <CartesianGrid {...eidosGridProps}/>
              <XAxis dataKey="t" {...eidosXAxisProps} interval={4}/>
              <YAxis {...eidosYAxisProps}/>
              <Tooltip content={<EidosTooltipContent/>}/>
              <Line type="monotone" dataKey="p50" stroke={c[1]} strokeWidth={2} dot={false} isAnimationActive={anim}/>
              <Line type="monotone" dataKey="p95" stroke={c[2]} strokeWidth={2} dot={false} isAnimationActive={anim}/>
              <Line type="monotone" dataKey="p99" stroke={c[0]} strokeWidth={2} dot={false} isAnimationActive={anim}/>
            </LineChart>
          </EidosChart>
        </Frame>

        <Frame label="reference line · SLO target at 99%">
          <EidosChart title="Build success rate" subtitle="ci-runner" meta="14 days" height={260}>
            <LineChart data={RATE} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
              <CartesianGrid {...eidosGridProps}/>
              <XAxis dataKey="day" {...eidosXAxisProps}/>
              <YAxis {...eidosYAxisProps} domain={[96, 100]}/>
              <Tooltip content={<EidosTooltipContent/>}/>
              <ReferenceLine y={99} stroke="var(--warning)" strokeDasharray="4 4" label={{ value: 'SLO 99%', fill: 'var(--warning)', fontSize: 10, position: 'insideTopRight' }}/>
              <Line type="monotone" dataKey="pct" stroke={c[0]} strokeWidth={2} dot={{ r: 3, fill: c[0] }} isAnimationActive={anim}/>
            </LineChart>
          </EidosChart>
        </Frame>

        <Frame label="dashed · forecast or projection">
          <EidosChart title="Active workflows" subtitle="forecast" meta="next 14d" height={220}>
            <LineChart data={RATE.map((d, i) => ({ day: d.day, actual: i < 7 ? d.pct * 10 : null, forecast: i >= 6 ? d.pct * 10 + 2 : null }))} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
              <CartesianGrid {...eidosGridProps}/>
              <XAxis dataKey="day" {...eidosXAxisProps}/>
              <YAxis {...eidosYAxisProps}/>
              <Tooltip content={<EidosTooltipContent/>}/>
              <Line type="monotone" dataKey="actual" stroke={c[0]} strokeWidth={2} dot={false} isAnimationActive={anim}/>
              <Line type="monotone" dataKey="forecast" stroke={c[1]} strokeWidth={2} strokeDasharray="4 4" dot={false} isAnimationActive={anim}/>
            </LineChart>
          </EidosChart>
        </Frame>

        <SubHead meta="a11y">Accessibility</SubHead>
        <div className="ds-grid cols-2" style={{marginTop: 12}}>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Colour is never the only signal</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Multiple percentile or service lines are distinguished by hue alone — pair each <Mono>--viz-*</Mono> line with a direct label or legend, and reinforce meaningful lines with shape (a dashed stroke for forecasts) so the distinction survives in greyscale.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Palette</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The categorical <Mono>--viz-cat-*</Mono> ramp is tuned for distinct luminance; cap a chart at ~4 lines so adjacent strokes stay distinguishable where they cross or run parallel.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard &amp; tooltip</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}><b style={{fontWeight: 600, color: 'var(--fg)'}}>Tab</b> moves to the tooltip trigger; <b style={{fontWeight: 600, color: 'var(--fg)'}}>Esc</b> dismisses it. Because a clipped Y domain makes exact reads off the gridlines unreliable, the same series is shipped as an accessible <Mono>&lt;table&gt;</Mono> fallback.</div>
            <details className="surface" style={{marginBlockStart: 12, padding: '10px 12px'}}>
              <summary style={{cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--fg-muted)'}}>Data table — requests / minute</summary>
              <table className="spec" style={{marginBlockStart: 10}}>
                <caption style={{captionSide: 'top', textAlign: 'start', color: 'var(--fg-faint)', fontSize: 'var(--text-xs)', marginBlockEnd: 8}}>eidos-api · requests per minute, last 24h (every 3rd hour)</caption>
                <thead>
                  <tr>
                    <th scope="col">Hour</th>
                    <th scope="col" style={{textAlign: 'end'}}>Req / min</th>
                  </tr>
                </thead>
                <tbody>
                  {RPS.filter((_, i) => i % 3 === 0).map((row) => (
                    <tr key={row.hour}>
                      <th scope="row" className="mono" style={{fontWeight: 500, color: 'var(--fg)'}}>{row.hour}</th>
                      <td className="mono" style={{textAlign: 'end', color: 'var(--fg)', fontVariantNumeric: 'tabular-nums'}}>{row.rps}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The left-to-right line-draw respects <Mono>prefers-reduced-motion</Mono>: under it every <Mono>&lt;Line&gt;</Mono> gets <Mono>isAnimationActive={'{false}'}</Mono>, so the full line renders instantly rather than tracing in.</div>
          </div>
        </div>

        <SubHead meta="RTL · العربية">RTL</SubHead>
        <Frame label='dir="rtl" — title, legend and tooltip align right; time still flows left to right'>
          <div dir="rtl" style={{width: '100%'}}>
            <EidosChart title="الطلبات في الدقيقة" subtitle="eidos-api" meta="آخر ٢٤ ساعة" height={240}>
              <LineChart data={RPS} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                <CartesianGrid {...eidosGridProps}/>
                <XAxis dataKey="hour" {...eidosXAxisProps} interval={3}/>
                <YAxis {...eidosYAxisProps}/>
                <Tooltip content={<EidosTooltipContent/>}/>
                <Line type="monotone" dataKey="rps" name="طلبات/دقيقة" stroke={c[0]} strokeWidth={2} dot={false} isAnimationActive={anim}/>
              </LineChart>
            </EidosChart>
          </div>
        </Frame>
        <Lede>Under <Mono>dir="rtl"</Mono> the chart title, subtitle, and tooltip rows align to the right. The time axis does not mirror — time flows left to right regardless of locale, and reversing it would make trends unreadable.</Lede>

        <SubHead meta="anatomy">Anatomy</SubHead>
        <div className="ds-frame">
          <div className="ds-frame-head"><span className="label">anatomy</span></div>
          <div className="ds-frame-body" style={{padding: '64px 36px 56px'}}>
            <div className="ana" style={{display:'flex', justifyContent:'center'}}>
              <div className="stage" style={{position:'relative'}} aria-hidden="true">
                <div style={{width:340, height:180}}>
                  <EidosChart height={180}>
                    <LineChart data={LAT} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                      <CartesianGrid {...eidosGridProps}/>
                      <XAxis dataKey="t" {...eidosXAxisProps} interval={4}/>
                      <YAxis {...eidosYAxisProps}/>
                      <ReferenceLine y={120} stroke="var(--warning)" strokeDasharray="4 4"/>
                      <Line type="monotone" dataKey="p50" stroke={c[1]} strokeWidth={2} dot={false} isAnimationActive={anim}/>
                      <Line type="monotone" dataKey="p95" stroke={c[2]} strokeWidth={2} dot={false} isAnimationActive={anim}/>
                      <Line type="monotone" dataKey="p99" stroke={c[0]} strokeWidth={2} dot={false} isAnimationActive={anim}/>
                    </LineChart>
                  </EidosChart>
                </div>
                <span className="lead v" style={{bottom: -22, left: '50%', height: 18, transform:'translateX(-50%)'}}/>
                <span className="lead h" style={{top: 100, left: -28, width: 24}}/>
                <span className="lead v" style={{top: -22, left: 110, height: 18}}/>
                <span className="lead h" style={{top: 50, right: -28, width: 24}}/>
                <div className="pin" style={{bottom: -42, left: '50%', transform:'translateX(-50%)'}}>1</div>
                <div className="pin" style={{top: 92, left: -52}}>2</div>
                <div className="pin" style={{top: -42, left: 110, transform:'translateX(-50%)'}}>3</div>
                <div className="pin" style={{top: 42, right: -52}}>4</div>
              </div>
            </div>
            <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
              <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Time axis.</b> The X axis is an ordered, usually continuous interval; <Mono>interval</Mono> thins the ticks so dense windows don't crowd.</span>
              <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Value axis &amp; gridlines.</b> The <Mono>--viz-grid</Mono> rules carry the eye horizontally to a value. The domain may be clipped to surface small movements — label the bounds.</span>
              <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Lines.</b> 2px strokes; a single series uses <Mono>--viz-cat-1</Mono>, multiple series step through the <Mono>--viz-cat-*</Mono> ramp. A dashed stroke marks a forecast or projection. Dots are dropped past ~20 points; the tooltip and legend carry exact values.</span>
              <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Reference line.</b> An optional dashed marker (an SLO target, a threshold) in a status token, labelled inline so the line has context.</span>
            </div>
          </div>
        </div>

        <SubHead meta="rules">Do / Don't</SubHead>
        <div className="dd-grid">
          <div className="dd-card do">
            <div className="head"><Icons.check size={12}/> Do — drop dots past 20 points</div>
            <div className="body">
              <EidosChart height={140} padding={8}>
                <LineChart data={RPS} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid {...eidosGridProps}/>
                  <XAxis dataKey="hour" {...eidosXAxisProps} interval={5}/>
                  <YAxis {...eidosYAxisProps}/>
                  <Line type="monotone" dataKey="rps" stroke={c[0]} strokeWidth={2} dot={false} isAnimationActive={anim}/>
                </LineChart>
              </EidosChart>
            </div>
            <div className="note">The line carries the shape — dots above 20 points cover it. Set <Mono>dot={'{false}'}</Mono> for dense series and bring them back as <Mono>activeDot</Mono> for hover only.</div>
          </div>
          <div className="dd-card dont">
            <div className="head"><Icons.x size={12}/> Don't — dot every sample on a dense series</div>
            <div className="body">
              <EidosChart height={140} padding={8}>
                <LineChart data={RPS} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid {...eidosGridProps}/>
                  <XAxis dataKey="hour" {...eidosXAxisProps} interval={5}/>
                  <YAxis {...eidosYAxisProps}/>
                  <Line type="monotone" dataKey="rps" stroke={c[0]} strokeWidth={2} dot={{ r: 3, fill: c[0] }} isAnimationActive={anim}/>
                </LineChart>
              </EidosChart>
            </div>
            <div className="note">24 dots stacked on one line — readers see speckle, not trend. The line itself communicates the shape; dots draw the eye away from it.</div>
          </div>
        </div>

        <SubHead meta="props">API reference</SubHead>
        <PropsTable
          label="<EidosChart /> + Recharts <Line />"
          rows={[
            { prop: 'title',    type: 'string', description: 'Header label on the chart card.' },
            { prop: 'subtitle', type: 'string', description: 'Secondary label below the title.' },
            { prop: 'meta',     type: 'string', description: 'Right-aligned monospace caption (period, unit).' },
            { prop: 'height',   type: 'number', default: '280', description: 'ResponsiveContainer height in px.' },
            { prop: 'dataKey',  type: 'string', description: 'Recharts <Line> field to plot from each row.' },
            { prop: 'stroke',   type: 'CSS color', description: 'Use a value from useChartColors() — never hard-code hex.' },
            { prop: 'type',     type: '"monotone" | "linear" | "step"', default: '"monotone"', description: 'Interpolation. Monotone keeps the line smooth without overshoot.' },
            { prop: 'dot',      type: 'boolean | object', default: 'false', description: 'Disable for >20 points; pass { r, fill } for emphasis.' },
          ]}
        />
      </Section>
    );
}
