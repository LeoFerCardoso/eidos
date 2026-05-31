'use client';
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, PropsTable, installTabs, ForgeChart, ForgeTooltipContent, useChartColors, Recharts, Lede, Mono } from '@/ds/core';
  const { RadialBarChart, RadialBar, PolarAngleAxis, Tooltip, Legend } = Recharts;

// Tracks prefers-reduced-motion so the arc sweep-in animation can be disabled,
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


  // 4 quarterly goals — each its own arc.
  const QUARTERLY = [
    { name: 'Onboarding',    value: 92, fill: 'var(--viz-cat-1)' },
    { name: 'Activation',    value: 76, fill: 'var(--viz-cat-2)' },
    { name: 'Reliability',   value: 64, fill: 'var(--viz-cat-3)' },
    { name: 'Cost / unit',   value: 48, fill: 'var(--viz-cat-4)' },
  ];

  // Single arc — % complete.
  const SINGLE = [{ name: 'progress', value: 72, fill: 'var(--ember)' }];

  // 3 fleet metrics.
  const FLEET = [
    { name: 'Coverage', value: 84, fill: 'var(--viz-cat-1)' },
    { name: 'Uptime',   value: 99, fill: 'var(--viz-cat-2)' },
    { name: 'Cadence',  value: 58, fill: 'var(--viz-cat-3)' },
  ];

  const USAGE = `import { RadialBarChart, RadialBar, PolarAngleAxis, Tooltip, Legend } from "recharts"
import { ForgeChart, ForgeTooltipContent } from "@/charts"

export function Demo({ data }) {
  return (
    <ForgeChart title="Quarterly goals" height={280}>
      <RadialBarChart data={data} innerRadius="20%" outerRadius="100%"
                      startAngle={90} endAngle={-270} barSize={14}>
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false}/>
        <RadialBar dataKey="value" background cornerRadius={8}/>
        <Tooltip content={<ForgeTooltipContent/>}/>
        <Legend/>
      </RadialBarChart>
    </ForgeChart>
  )
}`;

export default function Page() {
    const reduced = usePrefersReducedMotion();
    return (
      <Section id="chart-radial" title="Radial bar" desc="Maps each metric to a concentric arc whose sweep encodes progress toward a fixed target — a compact way to show 3–5 independent percentage goals at once (quarterly objectives, fleet health).">
        <SubHead meta="package managers">Installation</SubHead>
        <TabbedCode tabs={installTabs('chart-radial')} ariaLabel="package manager"/>
        <Lede>A radial bar is a stack of donuts that share a centre. Each arc spans 0–360° proportional to its value. <Mono>PolarAngleAxis</Mono> with <Mono>{'domain={[0, 100]}'}</Mono> turns the sweep into a percentage scale.</Lede>

        <SubHead meta="hello world">Usage</SubHead>
        <Frame label="quarterly goals · 4 concentric arcs" code={USAGE}>
          <ForgeChart title="Quarterly goals" subtitle="Q2 progress" meta="forge org" height={300}>
            <RadialBarChart data={QUARTERLY} innerRadius="22%" outerRadius="100%" startAngle={90} endAngle={-270} barSize={14}>
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false}/>
              <RadialBar dataKey="value" background={{ fill: 'var(--viz-grid)' }} cornerRadius={8} isAnimationActive={!reduced}/>
              <Tooltip content={<ForgeTooltipContent/>}/>
              <Legend iconSize={8} wrapperStyle={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)' }}/>
            </RadialBarChart>
          </ForgeChart>
        </Frame>
        <Lede>Set <Mono>background</Mono> with the grid token so an incomplete arc still shows its full track — readers see "X out of 100%", not just "X".</Lede>

        <SubHead meta="3 variants">Variants</SubHead>
        <Frame label="single arc · headline progress">
          <ForgeChart title="Onboarding completion" subtitle="forge-api" meta="72%" height={260}>
            <RadialBarChart data={SINGLE} innerRadius="60%" outerRadius="92%" startAngle={90} endAngle={-270} barSize={22}>
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false}/>
              <RadialBar dataKey="value" background={{ fill: 'var(--viz-grid)' }} cornerRadius={12} isAnimationActive={!reduced}/>
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" style={{ fill: 'var(--fg)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xl)', fontWeight: 600 }}>72%</text>
              <text x="50%" y="50%" dy={24} textAnchor="middle" style={{ fill: 'var(--fg-faint)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>complete</text>
            </RadialBarChart>
          </ForgeChart>
        </Frame>

        <Frame label="3 fleet metrics · with legend">
          <ForgeChart title="Fleet health" subtitle="this week" meta="%" height={280}>
            <RadialBarChart data={FLEET} innerRadius="30%" outerRadius="100%" startAngle={90} endAngle={-270} barSize={16}>
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false}/>
              <RadialBar dataKey="value" background={{ fill: 'var(--viz-grid)' }} cornerRadius={8} isAnimationActive={!reduced} label={{ position: 'insideStart', fill: 'var(--fg)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}/>
              <Tooltip content={<ForgeTooltipContent/>}/>
              <Legend iconSize={8} wrapperStyle={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)' }}/>
            </RadialBarChart>
          </ForgeChart>
        </Frame>

        <Frame label="hemisphere · 180° sweep for top-of-page">
          <ForgeChart title="Sprint burndown" subtitle="this sprint" meta="64%" height={220}>
            <RadialBarChart data={[{ name: 'done', value: 64, fill: 'var(--ember)' }]} cx="50%" cy="80%" innerRadius="120%" outerRadius="170%" startAngle={180} endAngle={0} barSize={20}>
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false}/>
              <RadialBar dataKey="value" background={{ fill: 'var(--viz-grid)' }} cornerRadius={10} isAnimationActive={!reduced}/>
            </RadialBarChart>
          </ForgeChart>
        </Frame>

        <SubHead meta="a11y">Accessibility</SubHead>
        <div className="ds-grid cols-2" style={{marginTop: 12}}>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Colour is never the only signal</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Each ring is identified only by its <Mono>--viz-*</Mono> hue, so a legend or inline arc label is mandatory — without it a colour-blind reader can't tell which ring is "Coverage" versus "Reliability". An inside-arc label is the most robust mapping.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Palette</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Rings step through the categorical <Mono>--viz-cat-*</Mono> ramp, tuned for distinct luminance; capping at 3–5 rings keeps adjacent hues separated and the inner rings wide enough to register.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard &amp; tooltip</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The tooltip is reachable and dismissable; because arcs at different radii aren't directly comparable by eye, provide each metric's percentage as an accessible <Mono>&lt;table&gt;</Mono> fallback.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Every demo reads <Mono>prefers-reduced-motion</Mono> via a <Mono>matchMedia</Mono> hook and passes <Mono>isAnimationActive={'{'}!reduced{'}'}</Mono> to each <Mono>&lt;RadialBar&gt;</Mono> — so under the reduce setting each ring renders at its final fill instantly instead of winding up from 0°. Toggle your system Reduce-motion preference and reload to confirm the sweep disappears.</div>
          </div>
        </div>

        <SubHead meta="RTL · العربية">RTL</SubHead>
        <Frame label='dir="rtl" — title, legend and tooltip align right; concentric arcs are radially symmetric and do not mirror'>
          <div dir="rtl" style={{width: '100%'}}>
            <ForgeChart title="الأهداف الفصلية" subtitle="التقدم - الربع الثاني" meta="أسطول فورج" height={300}>
              <RadialBarChart data={QUARTERLY} innerRadius="22%" outerRadius="100%" startAngle={90} endAngle={-270} barSize={14}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false}/>
                <RadialBar dataKey="value" background={{ fill: 'var(--viz-grid)' }} cornerRadius={8} isAnimationActive={!reduced}/>
                <Tooltip content={<ForgeTooltipContent/>}/>
                <Legend iconSize={8} wrapperStyle={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)' }}/>
              </RadialBarChart>
            </ForgeChart>
          </div>
        </Frame>
        <Lede>Under <Mono>dir="rtl"</Mono> the chart title and legend text align to the right. The concentric arcs are radially symmetric — each sweeps 0° to 360° proportional to its value — so the encoding is directionless and the rings do not mirror.</Lede>

        <SubHead meta="anatomy">Anatomy</SubHead>
        <div className="ds-frame">
          <div className="ds-frame-head"><span className="label">anatomy</span></div>
          <div className="ds-frame-body" style={{padding: '64px 36px 56px'}}>
            <div className="ana" style={{display:'flex', justifyContent:'center'}}>
              <div className="stage" style={{position:'relative'}} aria-hidden="true">
                <div style={{width:200, height:180}}>
                  <ForgeChart height={180} padding={0}>
                    <RadialBarChart data={QUARTERLY} innerRadius="24%" outerRadius="100%" startAngle={90} endAngle={-270} barSize={11}>
                      <PolarAngleAxis type="number" domain={[0, 100]} tick={false}/>
                      <RadialBar dataKey="value" background={{ fill: 'var(--viz-grid)' }} cornerRadius={6} isAnimationActive={!reduced}/>
                    </RadialBarChart>
                  </ForgeChart>
                </div>
                <span className="lead v" style={{top: -22, left: 60, height: 18}}/>
                <span className="lead h" style={{top: 50, right: -28, width: 24}}/>
                <span className="lead h" style={{top: 90, left: -28, width: 24}}/>
                <span className="lead v" style={{bottom: -22, left: '50%', height: 18, transform:'translateX(-50%)'}}/>
                <div className="pin" style={{top: -42, left: 60, transform:'translateX(-50%)'}}>1</div>
                <div className="pin" style={{top: 42, right: -52}}>2</div>
                <div className="pin" style={{top: 82, left: -52}}>3</div>
                <div className="pin" style={{bottom: -42, left: '50%', transform:'translateX(-50%)'}}>4</div>
              </div>
            </div>
            <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
              <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Arcs.</b> One ring per metric, concentric and sharing a centre; each fills from <Mono>startAngle</Mono> proportional to its value, in a <Mono>--viz-cat-*</Mono> hue (or <Mono>--ember</Mono> for a single hero arc).</span>
              <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Background track.</b> The empty remainder of each ring in <Mono>--viz-grid</Mono>, so an incomplete arc reads as "X out of 100%" rather than just "X".</span>
              <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Angle scale.</b> A hidden <Mono>PolarAngleAxis</Mono> with <Mono>domain={'{[0,100]}'}</Mono> turns the sweep into a percentage; <Mono>cornerRadius</Mono> softens the arc ends.</span>
              <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Centre label, legend &amp; tooltip.</b> For a single arc a mono value sits in the hole as the headline; the legend maps each <Mono>--viz-*</Mono> ring back to its metric (required for multi-ring) and hover gives the exact percentage.</span>
            </div>
          </div>
        </div>

        <SubHead meta="rules">Do / Don't</SubHead>
        <div className="dd-grid">
          <div className="dd-card do">
            <div className="head"><Icons.check size={12}/> Do — 3–5 metrics max</div>
            <div className="body">
              <ForgeChart height={180} padding={4}>
                <RadialBarChart data={FLEET} innerRadius="30%" outerRadius="100%" startAngle={90} endAngle={-270} barSize={12}>
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false}/>
                  <RadialBar dataKey="value" background={{ fill: 'var(--viz-grid)' }} cornerRadius={6} isAnimationActive={!reduced}/>
                </RadialBarChart>
              </ForgeChart>
            </div>
            <div className="note">3–5 rings, each with room to breathe and a corresponding legend entry. The reader matches color → metric via the legend; if you can't fit the legend, you have too many rings.</div>
          </div>
          <div className="dd-card dont">
            <div className="head"><Icons.x size={12}/> Don't — 10 squished rings</div>
            <div className="body">
              <ForgeChart height={180} padding={4}>
                <RadialBarChart data={Array.from({ length: 10 }, (_, i) => ({ name: 'm' + i, value: 30 + i * 6, fill: `var(--viz-cat-${(i % 12) + 1})` }))} innerRadius="6%" outerRadius="100%" startAngle={90} endAngle={-270} barSize={5}>
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false}/>
                  <RadialBar dataKey="value" background={{ fill: 'var(--viz-grid)' }} isAnimationActive={!reduced}/>
                </RadialBarChart>
              </ForgeChart>
            </div>
            <div className="note">Inner rings shrink to a pixel — past 5 metrics the chart becomes a Rorschach test. Switch to a horizontal Bar chart (sorted by value) where each metric gets its own row.</div>
          </div>
        </div>

        <SubHead meta="props">API reference</SubHead>
        <PropsTable
          label="<RadialBar /> + <RadialBarChart />"
          rows={[
            { prop: 'dataKey',          type: 'string',  description: 'Numeric field per arc.' },
            { prop: 'background',       type: 'boolean | object', default: 'true', description: 'Empty-track fill. Pass {{ fill: "var(--viz-grid)" }} for the Eidos look.' },
            { prop: 'cornerRadius',     type: 'number',  default: '0', description: 'Round arc ends. 8 looks crafted, 0 reads as raw.' },
            { prop: 'innerRadius / outerRadius', type: 'string | number', description: 'Percentage of chart size. Inner ≥ 20% keeps the center readable.' },
            { prop: 'startAngle / endAngle', type: 'number', description: '90 / -270 = full ring. 180 / 0 = hemisphere.' },
            { prop: 'barSize',          type: 'number',  description: 'Arc thickness in px. 12–18 for 4 rings, 22 for a single hero arc.' },
            { prop: 'isAnimationActive', type: 'boolean', default: 'true', description: 'Arc sweep-in enter animation. Gate on prefers-reduced-motion: isAnimationActive={!reduced}.' },
          ]}
        />
      </Section>
    );
}
