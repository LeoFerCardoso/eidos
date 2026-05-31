'use client';
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, PropsTable, installTabs, ForgeChart, ForgeTooltipContent, ChartLegend, useChartColors, forgeGridProps, forgeXAxisProps, forgeYAxisProps, Recharts, Lede, Mono } from '@/ds/core';
  const { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } = Recharts;

// Tracks prefers-reduced-motion so the area draw animation can be disabled,
// matching the Accessibility "Motion" claim. SSR-safe: starts false, syncs on mount.
function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return reduced;
}


  // Cumulative incidents created per week — single series.
  const INC = Array.from({ length: 12 }, (_, w) => ({
    week: 'w' + (w + 1),
    open: Math.round(4 + w * 1.6 + Math.sin(w) * 2),
  }));

  // Request mix per service over a week — stacked.
  const MIX = Array.from({ length: 7 }, (_, d) => ({
    day:  'd' + (d + 1),
    api:  140 + d * 8 + Math.round(Math.sin(d) * 12),
    auth: 80  + d * 4 + Math.round(Math.cos(d) * 6),
    kyc:  40  + d * 2 + Math.round(Math.sin(d / 2) * 4),
  }));

  // Active workflows per hour — gradient fill.
  const WF = Array.from({ length: 24 }, (_, h) => ({
    hour: String(h).padStart(2, '0'),
    wf:   Math.round(30 + 20 * Math.sin(h / 4) + 10 * Math.sin(h)),
  }));

  const USAGE = `import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { ForgeChart, ForgeTooltipContent, useChartColors,
         forgeGridProps, forgeXAxisProps, forgeYAxisProps } from "@/charts"

export function Demo({ data }) {
  const c = useChartColors()
  return (
    <ForgeChart title="Open incidents" meta="12 weeks" height={260}>
      <AreaChart data={data}>
        <CartesianGrid {...forgeGridProps}/>
        <XAxis dataKey="week" {...forgeXAxisProps}/>
        <YAxis {...forgeYAxisProps}/>
        <Tooltip content={<ForgeTooltipContent/>}/>
        <Area type="monotone" dataKey="open" stroke={c[0]} fill={c[0]} fillOpacity={0.18}/>
      </AreaChart>
    </ForgeChart>
  )
}`;

export default function Page() {
    const c = useChartColors();
    const reduced = usePrefersReducedMotion();
    // Series labels shared between the stacked <Area>s and their legend entries,
    // so every --viz-cat-* fill is paired with a named swatch (a11y + RTL claims).
    const MIX_SERIES = [
      { key: 'api',  label: 'api',  color: c[0] },
      { key: 'auth', label: 'auth', color: c[1] },
      { key: 'kyc',  label: 'kyc',  color: c[2] },
    ];
    return (
      <Section id="chart-area" title="Area chart" desc="A line chart with the region beneath filled, so the eye reads accumulated volume rather than just trend — total traffic, cumulative incidents, spend over time. Stack series when composition over time is the story.">
        <SubHead meta="package managers">Installation</SubHead>
        <TabbedCode tabs={installTabs('chart-area')} ariaLabel="package manager"/>
        <Lede>Area is a line chart with mass. Use it when the <em>total</em> matters — incident counts, traffic volume, cumulative spend. Keep <Mono>fillOpacity</Mono> low (0.15–0.25) so the line still reads as the leading edge.</Lede>

        <SubHead meta="hello world">Usage</SubHead>
        <Frame label="single series · open incidents" code={USAGE}>
          <ForgeChart title="Open incidents" subtitle="all severities" meta="12 weeks" height={260}>
            <AreaChart data={INC} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
              <CartesianGrid {...forgeGridProps}/>
              <XAxis dataKey="week" {...forgeXAxisProps}/>
              <YAxis {...forgeYAxisProps}/>
              <Tooltip content={<ForgeTooltipContent/>}/>
              <Area type="monotone" dataKey="open" name="open" stroke={c[0]} fill={c[0]} fillOpacity={0.18} isAnimationActive={!reduced}/>
            </AreaChart>
          </ForgeChart>
        </Frame>

        <SubHead meta="3 variants">Variants</SubHead>
        <Frame label="stacked · request mix by service">
          <ForgeChart title="Requests by service" subtitle="forge fleet" meta="last 7 days" height={260}>
            <AreaChart data={MIX} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
              <CartesianGrid {...forgeGridProps}/>
              <XAxis dataKey="day" {...forgeXAxisProps}/>
              <YAxis {...forgeYAxisProps}/>
              <Tooltip content={<ForgeTooltipContent/>}/>
              {MIX_SERIES.map((s) => (
                <Area key={s.key} type="monotone" dataKey={s.key} name={s.label} stackId="1" stroke={s.color} fill={s.color} fillOpacity={0.45} isAnimationActive={!reduced}/>
              ))}
            </AreaChart>
          </ForgeChart>
          <ChartLegend items={MIX_SERIES.map((s) => ({ color: s.color, label: s.label }))}/>
        </Frame>
        <Lede>Stacked area is best when the <em>composition</em> is the story and the total is also useful. If you need to compare exact values per series, use a line chart instead.</Lede>

        <Frame label="gradient fill · single series with depth">
          <ForgeChart title="Active workflows" subtitle="forge-runner" meta="24h" height={260}>
            <AreaChart data={WF} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="forgeAreaG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stopColor={c[0]} stopOpacity={0.5}/>
                  <stop offset="95%" stopColor={c[0]} stopOpacity={0.02}/>
                </linearGradient>
              </defs>
              <CartesianGrid {...forgeGridProps}/>
              <XAxis dataKey="hour" {...forgeXAxisProps} interval={3}/>
              <YAxis {...forgeYAxisProps}/>
              <Tooltip content={<ForgeTooltipContent/>}/>
              <Area type="monotone" dataKey="wf" stroke={c[0]} strokeWidth={2} fill="url(#forgeAreaG)" isAnimationActive={!reduced}/>
            </AreaChart>
          </ForgeChart>
        </Frame>

        <Frame label="step · discrete state changes (replicas, scale)">
          <ForgeChart title="Replicas in service" subtitle="forge-api" meta="autoscaler" height={220}>
            <AreaChart data={WF.map((d, i) => ({ hour: d.hour, n: 3 + Math.floor(i / 6) + (i % 7 === 0 ? 1 : 0) }))} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
              <CartesianGrid {...forgeGridProps}/>
              <XAxis dataKey="hour" {...forgeXAxisProps} interval={3}/>
              <YAxis {...forgeYAxisProps} allowDecimals={false}/>
              <Tooltip content={<ForgeTooltipContent/>}/>
              <Area type="step" dataKey="n" stroke={c[1]} fill={c[1]} fillOpacity={0.18} isAnimationActive={!reduced}/>
            </AreaChart>
          </ForgeChart>
        </Frame>

        <SubHead meta="a11y">Accessibility</SubHead>
        <div className="ds-grid cols-2" style={{marginTop: 12}}>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Colour is never the only signal</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Stacked bands are told apart by colour alone, which excludes colour-blind readers — so the stacked example pairs each <Mono>--viz-*</Mono> fill with a named <Mono>&lt;ChartLegend&gt;</Mono> swatch and orders the stack consistently (api → auth → kyc) so band positions stay predictable.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Palette</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The categorical <Mono>--viz-cat-*</Mono> ramp is tuned for distinct luminance; because translucent fills mute that contrast, cap a stack at ~4 bands so adjacent areas stay distinguishable.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard &amp; tooltip</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The tooltip is reachable and dismissable; since stacked bands report cumulative totals rather than each series' own value, provide the per-series numbers as an accessible <Mono>&lt;table&gt;</Mono> fallback.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The left-to-right draw animation respects <Mono>prefers-reduced-motion</Mono>: the page passes <Mono>isAnimationActive={'{'}false{'}'}</Mono> to every <Mono>&lt;Area&gt;</Mono> when reduce is set, so the filled region renders at its final shape instantly instead of sweeping in.</div>
          </div>
        </div>

        <SubHead meta="RTL · العربية">RTL</SubHead>
        <Frame label='dir="rtl" — axis labels and legend flow right-to-left; the plotted series does not mirror'>
          <div dir="rtl" style={{width: '100%'}}>
            <ForgeChart title="حوادث مفتوحة" subtitle="جميع الخطورات" meta="١٢ أسبوعًا" height={240}>
              <AreaChart data={INC} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                <CartesianGrid {...forgeGridProps}/>
                <XAxis dataKey="week" {...forgeXAxisProps}/>
                <YAxis {...forgeYAxisProps}/>
                <Tooltip content={<ForgeTooltipContent/>}/>
                <Area type="monotone" dataKey="open" name="مفتوح" stroke={c[0]} fill={c[0]} fillOpacity={0.18} isAnimationActive={!reduced}/>
              </AreaChart>
            </ForgeChart>
            <ChartLegend items={[{ color: c[0], label: 'مفتوح' }]}/>
          </div>
        </Frame>
        <Lede>Under <Mono>dir="rtl"</Mono> the chart title, subtitle, and tooltip text align to the right and the legend reads right-to-left. The plotted area and its time axis do not mirror — time still flows left to right, which is the universally expected convention for temporal data.</Lede>

        <SubHead meta="anatomy">Anatomy</SubHead>
        <div className="ds-frame">
          <div className="ds-frame-head"><span className="label">anatomy</span></div>
          <div className="ds-frame-body" style={{padding: '64px 36px 56px'}}>
            <div className="ana" style={{display:'flex', justifyContent:'center'}}>
              <div className="stage" style={{position:'relative'}} aria-hidden="true">
                <div style={{width:340, height:180}}>
                  <ForgeChart height={180}>
                    <AreaChart data={INC} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                      <CartesianGrid {...forgeGridProps}/>
                      <XAxis dataKey="week" {...forgeXAxisProps}/>
                      <YAxis {...forgeYAxisProps}/>
                      <Area type="monotone" dataKey="open" stroke={c[0]} strokeWidth={2} fill={c[0]} fillOpacity={0.18}/>
                    </AreaChart>
                  </ForgeChart>
                </div>
                <span className="lead v" style={{top: -22, left: 90, height: 18}}/>
                <span className="lead h" style={{top: 60, right: -28, width: 24}}/>
                <span className="lead v" style={{bottom: -22, left: '50%', height: 18, transform:'translateX(-50%)'}}/>
                <span className="lead h" style={{top: 110, left: -28, width: 24}}/>
                <div className="pin" style={{top: -42, left: 90, transform:'translateX(-50%)'}}>1</div>
                <div className="pin" style={{top: 52, right: -52}}>2</div>
                <div className="pin" style={{bottom: -42, left: '50%', transform:'translateX(-50%)'}}>3</div>
                <div className="pin" style={{top: 102, left: -52}}>4</div>
              </div>
            </div>
            <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
              <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Stroke (leading edge).</b> The 2px line in <Mono>--viz-cat-1</Mono> is the value; it stays the visual lead even when the fill carries the volume.</span>
              <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Value axis &amp; gridlines.</b> Starts at zero so the filled mass reads as a true quantity. The <Mono>--viz-grid</Mono> rules anchor the eye to a height.</span>
              <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Time axis.</b> The X axis runs left to right over a continuous interval (weeks, hours, days); ticks thin out at <Mono>interval</Mono> so dense series stay legible.</span>
              <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Fill.</b> The region below the stroke at low <Mono>fillOpacity</Mono> (0.15–0.25), or a top-down gradient. Stacked areas step the fill through the <Mono>--viz-cat-*</Mono> ramp.</span>
            </div>
          </div>
        </div>

        <SubHead meta="rules">Do / Don't</SubHead>
        <div className="dd-grid">
          <div className="dd-card do">
            <div className="head"><Icons.check size={12}/> Do — keep the fill subtle</div>
            <div className="body">
              <ForgeChart height={140} padding={8}>
                <AreaChart data={INC} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid {...forgeGridProps}/>
                  <XAxis dataKey="week" {...forgeXAxisProps}/>
                  <YAxis {...forgeYAxisProps}/>
                  <Area type="monotone" dataKey="open" stroke={c[0]} fill={c[0]} fillOpacity={0.18}/>
                </AreaChart>
              </ForgeChart>
            </div>
            <div className="note">Fill opacity 0.15–0.22 lets the line lead while the area suggests volume. The fill is a hint, not a flood — keep it lighter than the stroke.</div>
          </div>
          <div className="dd-card dont">
            <div className="head"><Icons.x size={12}/> Don't — flood the chart with solid fill</div>
            <div className="body">
              <ForgeChart height={140} padding={8}>
                <AreaChart data={INC} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid {...forgeGridProps}/>
                  <XAxis dataKey="week" {...forgeXAxisProps}/>
                  <YAxis {...forgeYAxisProps}/>
                  <Area type="monotone" dataKey="open" stroke={c[0]} fill={c[0]} fillOpacity={0.9}/>
                </AreaChart>
              </ForgeChart>
            </div>
            <div className="note">Solid fills hide the gridlines, overpower neighboring KPIs, and make stacked series indistinguishable. If you need to emphasise volume, use a bar chart instead.</div>
          </div>
        </div>

        <SubHead meta="props">API reference</SubHead>
        <PropsTable
          label="<Area />"
          rows={[
            { prop: 'dataKey',     type: 'string',        description: 'Field plotted on Y.' },
            { prop: 'type',        type: '"monotone" | "linear" | "step"', default: '"monotone"', description: 'Interpolation.' },
            { prop: 'stroke',      type: 'CSS color',     description: 'Top edge — use useChartColors().' },
            { prop: 'fill',        type: 'CSS color',     description: 'Region fill. Match stroke for cohesion or use a gradient.' },
            { prop: 'fillOpacity', type: 'number',        default: '0.18', description: 'Keep low (0.15–0.25) so neighbours stay readable.' },
            { prop: 'stackId',     type: 'string',        description: 'Group with the same id to stack.' },
            { prop: 'isAnimationActive', type: 'boolean', default: 'true', description: 'Gate the draw animation — set false under prefers-reduced-motion.' },
          ]}
        />
      </Section>
    );
}
