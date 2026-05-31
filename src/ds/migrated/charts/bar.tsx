'use client';
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, PropsTable, installTabs, ForgeChart, ForgeTooltipContent, useChartColors, forgeGridProps, forgeXAxisProps, forgeYAxisProps, Lede, Recharts, Mono } from '@/ds/core';
  const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } = Recharts;

  // Mirrors the Forge motion convention (see atoms CountUp / tooltip): the
  // grow-up enter animation is gated on the user's reduced-motion preference,
  // so the Accessibility "Motion" claim is enforced in code, not just asserted.
  // SSR-safe (defaults to false), then syncs + subscribes on mount.
  const PRM = '(prefers-reduced-motion: reduce)';
  function useReducedMotion() {
    const [reduced, setReduced] = React.useState(false);
    React.useEffect(() => {
      const mq = window.matchMedia(PRM);
      const sync = () => setReduced(mq.matches);
      sync();
      mq.addEventListener('change', sync);
      return () => mq.removeEventListener('change', sync);
    }, []);
    return reduced;
  }

  // Canonical Forge legend styling, reused from the radial chart page.
  const legendStyle = { fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)' };


  // Deploys per service this week — single series.
  const DEPLOYS = [
    { svc: 'forge-api',       n: 14 },
    { svc: 'fraud-engine',    n:  9 },
    { svc: 'kyc-orchestrator',n:  7 },
    { svc: 'auth-gateway',    n:  6 },
    { svc: 'notification-svc',n:  4 },
    { svc: 'ledger',          n:  3 },
    { svc: 'reporting',       n:  2 },
  ];

  // Errors by category — horizontal, sorted desc, with highlight.
  const ERRORS = [
    { cat: '5xx · upstream',  n: 142 },
    { cat: '4xx · invalid',   n:  84 },
    { cat: 'timeout',         n:  62 },
    { cat: 'auth · expired',  n:  41 },
    { cat: 'rate-limited',    n:  18 },
  ];

  // Grouped — passing vs failing tests by service.
  const TESTS = [
    { svc: 'forge-api',  pass: 412, fail:  6 },
    { svc: 'fraud',      pass: 268, fail: 12 },
    { svc: 'kyc',        pass: 184, fail:  4 },
    { svc: 'auth',       pass: 122, fail:  2 },
    { svc: 'ledger',     pass:  96, fail:  9 },
  ];

  const USAGE = `import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { ForgeChart, ForgeTooltipContent, useChartColors,
         forgeGridProps, forgeXAxisProps, forgeYAxisProps } from "@/charts"

export function Demo({ data }) {
  const c = useChartColors()
  // Bars grow up from the baseline on enter; honour the OS setting so the
  // motion-sensitive see final heights immediately (no sweep).
  const reduced = useReducedMotion()
  return (
    <ForgeChart title="Deploys this week" height={260}>
      <BarChart data={data}>
        <CartesianGrid {...forgeGridProps}/>
        <XAxis dataKey="svc" {...forgeXAxisProps}/>
        <YAxis {...forgeYAxisProps}/>
        <Tooltip content={<ForgeTooltipContent/>}/>
        <Bar dataKey="n" fill={c[0]} radius={[3, 3, 0, 0]} isAnimationActive={!reduced}/>
      </BarChart>
    </ForgeChart>
  )
}`;

export default function Page() {
    const c = useChartColors();
    const reduced = useReducedMotion();
    return (
      <Section id="chart-bar" title="Bar chart" desc="Encodes a value as rectangle length along a shared baseline — the most accurate visual channel the eye can read. Reach for it when comparing discrete categories: deploys per service, errors by type, pass/fail counts.">
        <SubHead meta="package managers">Installation</SubHead>
        <TabbedCode tabs={installTabs('chart-bar')} ariaLabel="package manager"/>
        <Lede>Sort bars by value (descending) unless the category order is meaningful (days, severities, releases). A rounded top (<Mono>radius={'{['}3,3,0,0{']}'}</Mono>) keeps the chart feeling soft without losing precision.</Lede>

        <SubHead meta="hello world">Usage</SubHead>
        <Lede>Prefer a line chart when the X axis is continuous time and trend matters more than any individual value. The value axis must start at zero — bars encode proportion by length, and a truncated baseline makes a small difference look large.</Lede>
        <Frame label="vertical · deploys per service" code={USAGE}>
          <ForgeChart title="Deploys this week" subtitle="forge fleet" meta="count" height={260}>
            <BarChart data={DEPLOYS} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
              <CartesianGrid {...forgeGridProps}/>
              <XAxis dataKey="svc" {...forgeXAxisProps} interval={0} angle={-20} textAnchor="end" height={50}/>
              <YAxis {...forgeYAxisProps} allowDecimals={false}/>
              <Tooltip content={<ForgeTooltipContent/>}/>
              <Bar dataKey="n" name="deploys" fill={c[0]} radius={[3, 3, 0, 0]} maxBarSize={32} isAnimationActive={!reduced}/>
            </BarChart>
          </ForgeChart>
        </Frame>
        <Lede>Bar length is an <em>approximate</em> read, so the same data ships beside the chart as a visually-hidden <Mono>.sr-only</Mono> <Mono>&lt;table&gt;</Mono>: sighted users hover for the exact value, screen-reader users get every count from the table — same numbers, two channels.</Lede>
        <table className="sr-only">
          <caption>Deploys this week, by service</caption>
          <thead><tr><th scope="col">Service</th><th scope="col">Deploys</th></tr></thead>
          <tbody>
            {DEPLOYS.map((d) => (
              <tr key={d.svc}><th scope="row">{d.svc}</th><td>{d.n}</td></tr>
            ))}
          </tbody>
        </table>

        <SubHead meta="3 variants">Variants</SubHead>
        <Frame label="horizontal · long category labels">
          <ForgeChart title="Errors by category" subtitle="last 1h" meta="count" height={240}>
            <BarChart data={ERRORS} layout="vertical" margin={{ top: 8, right: 12, left: 16, bottom: 0 }}>
              <CartesianGrid {...forgeGridProps} horizontal={false} vertical={true}/>
              <XAxis type="number" {...forgeXAxisProps}/>
              <YAxis type="category" dataKey="cat" {...forgeYAxisProps} width={130} tickFormatter={undefined}/>
              <Tooltip content={<ForgeTooltipContent/>}/>
              <Bar dataKey="n" name="errors" radius={[0, 3, 3, 0]} maxBarSize={20} isAnimationActive={!reduced}>
                {ERRORS.map((e, i) => (
                  <Cell key={i} fill={i === 0 ? 'var(--danger)' : c[1]}/>
                ))}
              </Bar>
            </BarChart>
          </ForgeChart>
        </Frame>
        <Lede>Use a horizontal layout when labels are long. Highlight the dominant bar with a status colour to draw attention without a separate annotation.</Lede>

        <Frame label="grouped · two series side-by-side">
          <ForgeChart title="Test results" subtitle="ci-runner" meta="pass / fail" height={260}>
            <BarChart data={TESTS} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
              <CartesianGrid {...forgeGridProps}/>
              <XAxis dataKey="svc" {...forgeXAxisProps}/>
              <YAxis {...forgeYAxisProps}/>
              <Tooltip content={<ForgeTooltipContent/>}/>
              <Legend iconSize={8} wrapperStyle={legendStyle}/>
              <Bar dataKey="pass" name="pass" fill="var(--success)" radius={[3, 3, 0, 0]} maxBarSize={20} isAnimationActive={!reduced}/>
              <Bar dataKey="fail" name="fail" fill="var(--danger)"  radius={[3, 3, 0, 0]} maxBarSize={20} isAnimationActive={!reduced}/>
            </BarChart>
          </ForgeChart>
        </Frame>

        <Frame label="stacked · composition per service">
          <ForgeChart title="Test results · stacked" subtitle="ci-runner" meta="pass / fail" height={240}>
            <BarChart data={TESTS} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
              <CartesianGrid {...forgeGridProps}/>
              <XAxis dataKey="svc" {...forgeXAxisProps}/>
              <YAxis {...forgeYAxisProps}/>
              <Tooltip content={<ForgeTooltipContent/>}/>
              <Legend iconSize={8} wrapperStyle={legendStyle}/>
              <Bar dataKey="pass" name="pass" stackId="1" fill="var(--success)" maxBarSize={32} isAnimationActive={!reduced}/>
              <Bar dataKey="fail" name="fail" stackId="1" fill="var(--danger)"  maxBarSize={32} radius={[3, 3, 0, 0]} isAnimationActive={!reduced}/>
            </BarChart>
          </ForgeChart>
        </Frame>

        <SubHead meta="a11y">Accessibility</SubHead>
        <div className="ds-grid cols-2" style={{marginTop: 12}}>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Colour is never the only signal</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Bar length already carries the value, so colour is secondary — but a highlighted bar (the dominant error category, a failing series) must also be named in the axis label, legend, or an inline annotation so colour-blind readers see the same emphasis.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Palette</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Grouped and stacked bars draw from the categorical <Mono>--viz-cat-*</Mono> ramp, tuned for distinct luminance. Cap a stack at ~5 segments so adjacent fills stay distinguishable; beyond that, split into small multiples.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard &amp; tooltip</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The tooltip is reachable and dismissable; because bar length is only an approximate read, the underlying counts ship as an accessible <Mono>&lt;table&gt;</Mono> fallback — the one under the first demo above is real (<Mono>.sr-only</Mono>), giving a screen reader every exact value the bars only approximate.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Every demo here reads <Mono>prefers-reduced-motion</Mono> and passes <Mono>isAnimationActive={'{'}!reduced{'}'}</Mono> to each <Mono>&lt;Bar&gt;</Mono>: with the OS setting on, bars paint at their final height instantly instead of sweeping up from the baseline. Toggle your system Reduce-motion preference and reload — the grow-up enter disappears.</div>
          </div>
        </div>

        <SubHead meta="RTL · العربية">RTL</SubHead>
        <Frame label='dir="rtl" — axis labels and legend flow right-to-left; bar lengths read correctly in either direction'>
          <div dir="rtl" style={{width: '100%'}}>
            <ForgeChart title="عمليات النشر هذا الأسبوع" subtitle="أسطول فورج" meta="عدد" height={240}>
              <BarChart data={DEPLOYS} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                <CartesianGrid {...forgeGridProps}/>
                <XAxis dataKey="svc" {...forgeXAxisProps} interval={0} angle={-20} textAnchor="end" height={50}/>
                <YAxis {...forgeYAxisProps} allowDecimals={false}/>
                <Tooltip content={<ForgeTooltipContent/>}/>
                <Bar dataKey="n" name="نشر" fill={c[0]} radius={[3, 3, 0, 0]} maxBarSize={32} isAnimationActive={!reduced}/>
              </BarChart>
            </ForgeChart>
          </div>
        </Frame>
        <Lede>Under <Mono>dir="rtl"</Mono> the chart title and tooltip text align to the right. The category axis and bar lengths are not mirrored — bar charts encode value as length, a magnitude that does not change with reading direction.</Lede>

        <SubHead meta="anatomy">Anatomy</SubHead>
        <div className="ds-frame">
          <div className="ds-frame-head"><span className="label">anatomy</span></div>
          <div className="ds-frame-body" style={{padding: '64px 36px 56px'}}>
            <div className="ana" style={{display:'flex', justifyContent:'center'}}>
              <div className="stage" style={{position:'relative'}} aria-hidden="true">
                <div style={{width:340, height:180}}>
                  <ForgeChart height={180}>
                    <BarChart data={DEPLOYS} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                      <CartesianGrid {...forgeGridProps}/>
                      <XAxis dataKey="svc" {...forgeXAxisProps} tick={false}/>
                      <YAxis {...forgeYAxisProps} allowDecimals={false}/>
                      <Bar dataKey="n" fill={c[0]} radius={[3, 3, 0, 0]} maxBarSize={26} isAnimationActive={!reduced}/>
                    </BarChart>
                  </ForgeChart>
                </div>
                <span className="lead v" style={{top: -22, left: 80, height: 18}}/>
                <span className="lead h" style={{top: 110, left: -28, width: 24}}/>
                <span className="lead v" style={{bottom: -22, left: '50%', height: 18, transform:'translateX(-50%)'}}/>
                <span className="lead h" style={{top: 50, right: -28, width: 24}}/>
                <div className="pin" style={{top: -42, left: 80, transform:'translateX(-50%)'}}>1</div>
                <div className="pin" style={{top: 102, left: -52}}>2</div>
                <div className="pin" style={{bottom: -42, left: '50%', transform:'translateX(-50%)'}}>3</div>
                <div className="pin" style={{top: 42, right: -52}}>4</div>
              </div>
            </div>
            <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
              <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Bars.</b> Filled with <Mono>--viz-cat-1</Mono> for a single series; a status token (<Mono>--danger</Mono>, <Mono>--success</Mono>) highlights one bar. Grouped/stacked series step through the <Mono>--viz-cat-*</Mono> ramp.</span>
              <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Value axis &amp; gridlines.</b> Starts at zero, always. The light <Mono>--viz-grid</Mono> rules let the eye read each bar's height without tracing back to the axis.</span>
              <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Category axis.</b> The X axis (or Y, when horizontal) names each bucket — one tick per bar. Rotate or switch to a horizontal layout when labels collide.</span>
              <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Tooltip &amp; legend.</b> Hover surfaces the category label and the exact value; a legend is required once you have more than one series, mapping each <Mono>--viz-*</Mono> hue back to its name.</span>
            </div>
          </div>
        </div>

        <SubHead meta="rules">Do / Don't</SubHead>
        <div className="dd-grid">
          <div className="dd-card do">
            <div className="head"><Icons.check size={12}/> Do — start the Y axis at zero</div>
            <div className="body">
              <ForgeChart height={140} padding={8}>
                <BarChart data={DEPLOYS.slice(0, 5)} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid {...forgeGridProps}/>
                  <XAxis dataKey="svc" {...forgeXAxisProps} interval={0} hide/>
                  <YAxis {...forgeYAxisProps}/>
                  <Bar dataKey="n" fill={c[0]} radius={[3, 3, 0, 0]} maxBarSize={20} isAnimationActive={!reduced}/>
                </BarChart>
              </ForgeChart>
            </div>
            <div className="note">Bar length only reads as proportion when the axis starts at zero. If you need to highlight small differences around a baseline, switch to a line chart with a <Mono>ReferenceLine</Mono>.</div>
          </div>
          <div className="dd-card dont">
            <div className="head"><Icons.x size={12}/> Don't — clip the axis to exaggerate</div>
            <div className="body">
              <ForgeChart height={140} padding={8}>
                <BarChart data={DEPLOYS.slice(0, 5)} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid {...forgeGridProps}/>
                  <XAxis dataKey="svc" {...forgeXAxisProps} interval={0} hide/>
                  <YAxis {...forgeYAxisProps} domain={[5, 'dataMax']}/>
                  <Bar dataKey="n" fill={c[0]} radius={[3, 3, 0, 0]} maxBarSize={20} isAnimationActive={!reduced}/>
                </BarChart>
              </ForgeChart>
            </div>
            <div className="note">A 3-deploy service looks like a rounding error next to one with 14 — but only because the baseline lies. Clipped axes turn small differences into dramatic ones, which is misleading at best, dishonest at worst.</div>
          </div>
        </div>

        <SubHead meta="props">API reference</SubHead>
        <PropsTable
          label="<Bar />"
          rows={[
            { prop: 'dataKey',    type: 'string',                description: 'Field plotted as bar value.' },
            { prop: 'layout',     type: '"horizontal" | "vertical"', default: '"horizontal"', description: 'Bars on Y axis or X axis. Set on the parent BarChart.' },
            { prop: 'fill',       type: 'CSS color',             description: 'Bar fill. Use useChartColors() or a status token.' },
            { prop: 'radius',     type: '[tl, tr, br, bl]',      default: '0', description: 'Corner radius — [3,3,0,0] for vertical, [0,3,3,0] for horizontal.' },
            { prop: 'stackId',    type: 'string',                description: 'Bars sharing an id stack.' },
            { prop: 'maxBarSize', type: 'number',                default: '32', description: 'Caps bar thickness so wide charts don\'t turn into blocks.' },
            { prop: 'isAnimationActive', type: 'boolean',        default: 'true', description: 'Grow-up enter animation. Gate on prefers-reduced-motion: isAnimationActive={!reduced}.' },
          ]}
        />
      </Section>
    );
}
