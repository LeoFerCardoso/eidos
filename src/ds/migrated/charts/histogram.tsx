'use client';
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, PropsTable, installTabs, ForgeChart, ForgeTooltipContent, useChartColors, forgeGridProps, forgeXAxisProps, forgeYAxisProps, Lede, Recharts, Mono, Skeleton } from '@/ds/core';
  const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Cell } = Recharts;

  // Mirrors the Eidos motion convention (see bar chart / atoms CountUp / tooltip):
  // the grow-up enter animation is gated on the user's reduced-motion preference,
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


  // Latency buckets in ms.
  const LATENCY = [
    { bucket: '0–25',    count:   40 },
    { bucket: '25–50',   count:  120 },
    { bucket: '50–75',   count:  240 },
    { bucket: '75–100',  count:  480 },
    { bucket: '100–150', count:  680 },
    { bucket: '150–200', count:  520 },
    { bucket: '200–300', count:  220 },
    { bucket: '300–500', count:   80 },
    { bucket: '500+',    count:   18 },
  ];

  // Payload sizes — KB buckets.
  const SIZES = [
    { bucket: '< 1',   count:  860 },
    { bucket: '1–4',   count: 1520 },
    { bucket: '4–16',  count: 1280 },
    { bucket: '16–64', count:  720 },
    { bucket: '64–256',count:  320 },
    { bucket: '256+',  count:   42 },
  ];

  // PR review time — hours.
  const PR = [
    { bucket: '<1h',  count:  6 },
    { bucket: '1–2',  count: 14 },
    { bucket: '2–4',  count: 22 },
    { bucket: '4–8',  count: 28 },
    { bucket: '8–24', count: 18 },
    { bucket: '1–3d', count: 11 },
    { bucket: '>3d',  count:  4 },
  ];

  const USAGE = `import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { ForgeChart, ForgeTooltipContent, useChartColors,
         forgeGridProps, forgeXAxisProps, forgeYAxisProps } from "@/charts"

// Histogram = bar chart with barCategoryGap={0} and pre-bucketed data.
export function Demo({ data }) {
  const c = useChartColors()
  // Gate the grow-up enter animation on the OS reduced-motion setting.
  const reduced = useReducedMotion()
  return (
    <ForgeChart title="Latency distribution" meta="ms" height={260}>
      <BarChart data={data} barCategoryGap={0}>
        <CartesianGrid {...forgeGridProps}/>
        <XAxis dataKey="bucket" {...forgeXAxisProps}/>
        <YAxis {...forgeYAxisProps}/>
        <Tooltip content={<ForgeTooltipContent/>}/>
        <Bar dataKey="count" fill={c[0]} stroke="var(--bg)" strokeWidth={1}
             isAnimationActive={!reduced}/>
      </BarChart>
    </ForgeChart>
  )
}`;

export default function Page() {
    const c = useChartColors();
    const reduced = useReducedMotion();
    return (
      <Section id="chart-histogram" title="Histogram" desc="Shows how a single continuous metric distributes across adjacent buckets — the gap-free silhouette reveals clustering, skew, and tail behaviour at a glance. Use it for latency, payload sizes, or review times.">
        <SubHead meta="package managers">Installation</SubHead>
        <TabbedCode tabs={installTabs('chart-histogram')} ariaLabel="package manager"/>
        <Lede>A histogram is a bar chart with <Mono>barCategoryGap={'{'}0{'}'}</Mono> and pre-bucketed data. The gap closes so the silhouette reads as a single shape — that shape <em>is</em> the distribution.</Lede>

        <SubHead meta="hello world">Usage</SubHead>
        <Lede>Reach for a categorical bar chart when the X axis is a set of discrete things (services, teams) rather than numeric ranges. Buckets must be contiguous and the count axis must start at zero — a truncated axis makes a peaked distribution look flat, or a fat tail disappear.</Lede>
        <Frame label="latency distribution · request count per ms bucket" code={USAGE}>
          <ForgeChart title="Latency distribution" subtitle="forge-api" meta="ms · last 1h" height={260}>
            <BarChart data={LATENCY} barCategoryGap={0} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
              <CartesianGrid {...forgeGridProps}/>
              <XAxis dataKey="bucket" {...forgeXAxisProps} interval={0}/>
              <YAxis {...forgeYAxisProps}/>
              <Tooltip content={<ForgeTooltipContent/>}/>
              <Bar dataKey="count" name="count" fill={c[0]} stroke="var(--bg)" strokeWidth={1} isAnimationActive={!reduced}/>
            </BarChart>
          </ForgeChart>
        </Frame>
        <Lede>The thin background-colour stroke between bars gives the eye a hairline divider while keeping the shape continuous — the trick that distinguishes a histogram from a categorical bar chart.</Lede>

        <SubHead meta="3 variants">Variants</SubHead>
        <Frame label="with p95 reference line">
          <ForgeChart title="Latency · p95 marker" subtitle="forge-api" meta="ms" height={260}>
            <BarChart data={LATENCY} barCategoryGap={0} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
              <CartesianGrid {...forgeGridProps}/>
              <XAxis dataKey="bucket" {...forgeXAxisProps} interval={0}/>
              <YAxis {...forgeYAxisProps}/>
              <Tooltip content={<ForgeTooltipContent/>}/>
              <ReferenceLine x="150–200" stroke="var(--warning)" strokeDasharray="4 4" label={{ value: 'p95', fill: 'var(--warning)', fontSize: 10, position: 'top' }}/>
              <Bar dataKey="count" fill={c[0]} stroke="var(--bg)" strokeWidth={1} isAnimationActive={!reduced}/>
            </BarChart>
          </ForgeChart>
        </Frame>

        <Frame label="payload sizes · log-style buckets">
          <ForgeChart title="Payload size distribution" subtitle="forge-api" meta="KB" height={240}>
            <BarChart data={SIZES} barCategoryGap={0} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
              <CartesianGrid {...forgeGridProps}/>
              <XAxis dataKey="bucket" {...forgeXAxisProps} interval={0}/>
              <YAxis {...forgeYAxisProps}/>
              <Tooltip content={<ForgeTooltipContent/>}/>
              <Bar dataKey="count" fill={c[1]} stroke="var(--bg)" strokeWidth={1} isAnimationActive={!reduced}/>
            </BarChart>
          </ForgeChart>
        </Frame>

        <Frame label="status-tinted · tail flagged as outliers">
          <ForgeChart title="PR review time" subtitle="forge org" meta="hours" height={240}>
            <BarChart data={PR} barCategoryGap={0} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
              <CartesianGrid {...forgeGridProps}/>
              <XAxis dataKey="bucket" {...forgeXAxisProps} interval={0}/>
              <YAxis {...forgeYAxisProps}/>
              <Tooltip content={<ForgeTooltipContent/>}/>
              <Bar dataKey="count" stroke="var(--bg)" strokeWidth={1} isAnimationActive={!reduced}>
                {PR.map((p, i) => (
                  <Cell key={i} fill={i >= 5 ? 'var(--warning)' : c[0]}/>
                ))}
              </Bar>
            </BarChart>
          </ForgeChart>
        </Frame>

        <SubHead meta="2 states">States</SubHead>
        <Lede>A distribution chart has two states besides the populated shape. While the window aggregates, hold the chart frame with a skeleton so the layout never jumps; when a window genuinely has no observations, swap the plot for an empty state rather than drawing flat bars that read as real zeros.</Lede>
        <div className="ds-grid cols-2">
          <Frame label="loading · aggregating the window">
            <div className="forge-chart">
              <div className="fc-head">
                <div className="fc-head-text"><span className="fc-title">Latency distribution</span><span className="fc-subtitle">forge-api</span></div>
                <span className="fc-meta">ms · last 1h</span>
              </div>
              <div className="fc-body">
                <div role="status" aria-busy="true" style={{display: 'flex', alignItems: 'flex-end', gap: 2, blockSize: 204, paddingBlockEnd: 28}}>
                  <span style={{position: 'absolute', inlineSize: 1, blockSize: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)'}}>Loading distribution</span>
                  {LATENCY.map((p, i) => (
                    <Skeleton key={i} variant="box" radius={3} style={{flex: 1, blockSize: `${Math.round((p.count / 680) * 100)}%`, minBlockSize: 6}}/>
                  ))}
                </div>
              </div>
            </div>
          </Frame>
          <Frame label="empty · no observations in window">
            <div className="forge-chart">
              <div className="fc-head">
                <div className="fc-head-text"><span className="fc-title">Latency distribution</span><span className="fc-subtitle">forge-api</span></div>
                <span className="fc-meta">ms · last 1h</span>
              </div>
              <div className="fc-body">
                <div className="empty sm" role="status" style={{blockSize: 204, justifyContent: 'center'}}>
                  <span className="empty-icon"><Icons.barChart size={18}/></span>
                  <div className="empty-text">
                    <div className="empty-title">No requests in this window</div>
                    <div className="empty-desc">Nothing was bucketed for the last hour. Widen the range or check that the service is receiving traffic.</div>
                  </div>
                </div>
              </div>
            </div>
          </Frame>
        </div>
        <Lede>An empty distribution is not the same as a distribution of zeros — drawing flat bars would imply observations that all landed in the lowest bucket. The empty state says <em>no data</em> unambiguously.</Lede>

        <SubHead meta="a11y">Accessibility</SubHead>
        <div className="ds-grid cols-2" style={{marginBlockStart: 'var(--space-3)'}}>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBlockEnd: 'var(--space-1)'}}>Colour is never the only signal</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>When the tail is tinted with a status hue to flag outliers, the boundary must also be readable from the bucket labels or a reference line — so a colour-blind reader sees the same "these buckets are the slow ones" without depending on the <Mono>--warning</Mono> fill.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBlockEnd: 'var(--space-1)'}}>Palette</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>A histogram is single-series by nature, so it draws one categorical hue (<Mono>--viz-cat-1</Mono>) tuned for luminance against the surface; the only second colour is a status token for the tail — keep it to that one accent so the shape stays the focus.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBlockEnd: 'var(--space-1)'}}>Keyboard &amp; tooltip</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}><Mono>Tab</Mono> moves focus to the chart region and <Mono>Esc</Mono> dismisses the open tooltip; the bubble is <Mono>pointer-events:none</Mono> so it never traps the pointer. Because a histogram trades exact counts for shape, ship the bucket boundaries and frequencies as an accessible <Mono>&lt;table&gt;</Mono> fallback so a screen-reader user gets every value the hover gives a sighted one.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBlockEnd: 'var(--space-1)'}}>Motion</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Every demo on this page reads <Mono>prefers-reduced-motion</Mono> via a <Mono>matchMedia</Mono> hook and passes <Mono>isAnimationActive={'{'}!reduced{'}'}</Mono> to each bar — so under the reduce setting the bars paint at their final heights instantly instead of growing up from the baseline, with no enter sweep.</div>
          </div>
        </div>

        <SubHead meta="RTL · العربية">RTL</SubHead>
        <Frame label='dir="rtl" — bucket labels and tooltip align right; the distribution shape does not mirror'>
          <div dir="rtl" style={{width: '100%'}}>
            <ForgeChart title="توزيع زمن الاستجابة" subtitle="forge-api" meta="مللي ثانية · آخر ساعة" height={240}>
              <BarChart data={LATENCY} barCategoryGap={0} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                <CartesianGrid {...forgeGridProps}/>
                <XAxis dataKey="bucket" {...forgeXAxisProps} interval={0}/>
                <YAxis {...forgeYAxisProps}/>
                <Tooltip content={<ForgeTooltipContent/>}/>
                <Bar dataKey="count" name="عدد" fill={c[0]} stroke="var(--bg)" strokeWidth={1} isAnimationActive={!reduced}/>
              </BarChart>
            </ForgeChart>
          </div>
        </Frame>
        <Lede>Under <Mono>dir="rtl"</Mono> the chart title and tooltip labels align to the right. The bucket axis and distribution silhouette do not mirror — the ordered ranges (0–25ms, 25–50ms…) represent a numeric magnitude, not a reading direction.</Lede>

        <SubHead meta="anatomy">Anatomy</SubHead>
        <div className="ds-frame">
          <div className="ds-frame-head"><span className="label">anatomy</span></div>
          <div className="ds-frame-body" style={{padding: '64px 36px 56px'}}>
            <div className="ana" style={{display:'flex', justifyContent:'center'}}>
              <div className="stage" style={{position:'relative'}} aria-hidden="true">
                <div style={{width:340, height:180}}>
                  <ForgeChart height={180}>
                    <BarChart data={LATENCY} barCategoryGap={0} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                      <CartesianGrid {...forgeGridProps}/>
                      <XAxis dataKey="bucket" {...forgeXAxisProps} tick={false}/>
                      <YAxis {...forgeYAxisProps}/>
                      <ReferenceLine x="150–200" stroke="var(--warning)" strokeDasharray="4 4"/>
                      <Bar dataKey="count" stroke="var(--bg)" strokeWidth={1} isAnimationActive={!reduced}>
                        {LATENCY.map((p, i) => (
                          <Cell key={i} fill={i >= 7 ? 'var(--warning)' : c[0]}/>
                        ))}
                      </Bar>
                    </BarChart>
                  </ForgeChart>
                </div>
                <span className="lead h" style={{top: 100, left: -28, width: 24}}/>
                <span className="lead v" style={{bottom: -22, left: '50%', height: 18, transform:'translateX(-50%)'}}/>
                <span className="lead v" style={{top: -22, left: 120, height: 18}}/>
                <span className="lead v" style={{top: -22, right: 220, height: 18}}/>
                <span className="lead h" style={{top: 70, right: -28, width: 24}}/>
                <div className="pin" style={{top: 92, left: -52}}>2</div>
                <div className="pin" style={{bottom: -42, left: '50%', transform:'translateX(-50%)'}}>1</div>
                <div className="pin" style={{top: -42, left: 120, transform:'translateX(-50%)'}}>3</div>
                <div className="pin" style={{top: -42, right: 220, transform:'translateX(50%)'}}>4</div>
                <div className="pin" style={{top: 62, right: -52}}>5</div>
              </div>
            </div>
            <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
              <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Bucket axis.</b> The X axis is an ordered run of value ranges (0–25ms, 25–50ms…), shown at <Mono>interval={'{0}'}</Mono> so every bucket is labelled — the order is meaningful, unlike a categorical bar chart.</span>
              <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Count axis &amp; gridlines.</b> Starts at zero; the <Mono>--viz-grid</Mono> rules let the eye read each bucket's frequency.</span>
              <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Bars + hairline.</b> Filled with <Mono>--viz-cat-1</Mono> at <Mono>barCategoryGap={'{0}'}</Mono> so they share an edge; a 1px stroke in <Mono>--bg</Mono> divides them without breaking the continuous silhouette.</span>
              <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Reference line.</b> An optional dashed marker (a p95 boundary, an SLO) in a status token, labelled inline.</span>
              <span className="num">5</span><span><b style={{color:'var(--fg)'}}>Tail tint &amp; tooltip.</b> Outlier buckets can be tinted with a status token to flag the tail; hover gives the exact count per bucket.</span>
            </div>
          </div>
        </div>

        <SubHead meta="rules">Do / Don't</SubHead>
        <div className="dd-grid">
          <div className="dd-card do">
            <div className="head"><Icons.check size={12}/> Do — zero gap, hairline stroke</div>
            <div className="body">
              <ForgeChart height={140} padding={8}>
                <BarChart data={LATENCY} barCategoryGap={0} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid {...forgeGridProps}/>
                  <XAxis dataKey="bucket" {...forgeXAxisProps} interval={0} hide/>
                  <YAxis {...forgeYAxisProps}/>
                  <Bar dataKey="count" fill={c[0]} stroke="var(--bg)" strokeWidth={1} isAnimationActive={!reduced}/>
                </BarChart>
              </ForgeChart>
            </div>
            <div className="note">Continuous silhouette = continuous variable. The reader sees the distribution shape, not 12 individual bars. Use <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)'}}>barCategoryGap={'{0}'}</code> + a hairline stroke in <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)'}}>--bg</code> color.</div>
          </div>
          <div className="dd-card dont">
            <div className="head"><Icons.x size={12}/> Don't — leave a categorical gap</div>
            <div className="body">
              <ForgeChart height={140} padding={8}>
                <BarChart data={LATENCY} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid {...forgeGridProps}/>
                  <XAxis dataKey="bucket" {...forgeXAxisProps} interval={0} hide/>
                  <YAxis {...forgeYAxisProps}/>
                  <Bar dataKey="count" fill={c[0]} radius={[3, 3, 0, 0]} maxBarSize={20} isAnimationActive={!reduced}/>
                </BarChart>
              </ForgeChart>
            </div>
            <div className="note">Gaps imply categories. If your X axis is a discrete set (services, teams, regions) use the regular Bar chart. Histograms exist specifically because the gap between buckets has no meaning.</div>
          </div>
        </div>

        <SubHead meta="props">API reference</SubHead>
        <PropsTable
          label="Histogram · convention (BarChart wrapper)"
          rows={[
            { prop: 'data',            type: 'object[]', description: 'Pre-bucketed rows: { bucket: string, count: number }.' },
            { prop: 'barCategoryGap',  type: 'number',   default: '0', description: 'Set to 0 — the gap is what makes it a histogram.' },
            { prop: 'stroke',          type: 'CSS color', default: 'var(--bg)', description: 'Background-coloured hairline between bars.' },
            { prop: 'fill',            type: 'CSS color', description: 'Bar fill. Use useChartColors() or status tokens for tail emphasis.' },
          ]}
        />
      </Section>
    );
}
