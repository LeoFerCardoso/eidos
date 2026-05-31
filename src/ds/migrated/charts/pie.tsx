'use client';
import { Icons, Frame, Section, SubHead, TabbedCode, PropsTable, installTabs, EidosChart, EidosTooltipContent, useChartColors, Lede, Recharts, Mono } from '@/ds/core';
  const { PieChart, Pie, Cell, Tooltip, Legend } = Recharts;


  // Request distribution by service — 5 slices.
  const MIX = [
    { name: 'eidos-api',        value: 4280 },
    { name: 'auth-gateway',     value: 2140 },
    { name: 'fraud-engine',     value: 1620 },
    { name: 'kyc-orchestrator', value:  980 },
    { name: 'reporting',        value:  420 },
  ];

  // Storage by tier.
  const STORAGE = [
    { name: 'hot',  value: 64 },
    { name: 'warm', value: 22 },
    { name: 'cold', value: 14 },
  ];

  // Build outcome — half donut.
  const BUILDS = [
    { name: 'passed',  value: 188 },
    { name: 'failed',  value:   6 },
    { name: 'skipped', value:  14 },
  ];

  const USAGE = `import { PieChart, Pie, Cell, Tooltip } from "recharts"
import { EidosChart, EidosTooltipContent, useChartColors } from "@/charts"

export function Demo({ data }) {
  const c = useChartColors()
  return (
    <EidosChart title="Requests by service" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={90}>
          {data.map((_, i) => <Cell key={i} fill={c[i % c.length]}/>)}
        </Pie>
        <Tooltip content={<EidosTooltipContent/>}/>
      </PieChart>
    </EidosChart>
  )
}`;

export default function Page() {
    const c = useChartColors();
    const total = STORAGE.reduce((a, b) => a + b.value, 0);
    const mixTotal = MIX.reduce((a, b) => a + b.value, 0);
    return (
      <Section id="chart-pie" title="Pie chart" desc="Encodes each category's share as an arc angle — best when parts sum to 100% and one or two slices dominate. Cap at 5–6 slices; switch to a horizontal bar when ranking or fine comparison is needed.">
        <SubHead meta="package managers">Installation</SubHead>
        <TabbedCode tabs={installTabs('chart-pie')} ariaLabel="package manager"/>
        <Lede>Donuts beat pies in dense layouts — the hole gives you somewhere to put the total. Always include a legend or labels: a slice's name is half the message, the percent is the other half.</Lede>

        <SubHead meta="hello world">Usage</SubHead>
        <Lede>Only use a pie when segments are mutually exclusive parts of one total — never plot unrelated quantities or values that do not add up. The eye reads arc angle far less precisely than bar length, so reserve the pie for the "at a glance, is one slice big?" question.</Lede>
        <Frame label="pie · request distribution by service" code={USAGE}>
          <EidosChart title="Requests by service" subtitle="eidos fleet" meta="last 1h" height={260}>
            <PieChart>
              <Pie data={MIX} dataKey="value" nameKey="name" outerRadius={90} stroke="var(--bg)" strokeWidth={2}>
                {MIX.map((_, i) => <Cell key={i} fill={c[i % c.length]}/>)}
              </Pie>
              <Tooltip content={<EidosTooltipContent/>}/>
            </PieChart>
          </EidosChart>
        </Frame>
        <Lede>A 2-px stroke matching the background creates a hairline gap between slices — keeps the categories from blurring into each other.</Lede>

        <SubHead meta="3 variants">Variants</SubHead>
        <Frame label="donut · with center total">
          <EidosChart title="Storage by tier" subtitle="object store" meta="TB" height={260}>
            <PieChart>
              <Pie data={STORAGE} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} stroke="var(--bg)" strokeWidth={2}>
                {STORAGE.map((_, i) => <Cell key={i} fill={c[i % c.length]}/>)}
              </Pie>
              <Tooltip content={<EidosTooltipContent/>}/>
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" style={{ fill: 'var(--fg)', fontFamily: 'var(--font-mono)', fontSize: 18, fontVariantNumeric: 'tabular-nums' }}>
                {total} TB
              </text>
              <text x="50%" y="50%" dy={22} textAnchor="middle" dominantBaseline="middle" style={{ fill: 'var(--fg-faint)', fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                total
              </text>
            </PieChart>
          </EidosChart>
        </Frame>

        <Frame label="half donut · build outcome">
          <EidosChart title="Build outcomes" subtitle="last 24h" meta="208 runs" height={220}>
            <PieChart>
              <Pie data={BUILDS} dataKey="value" nameKey="name" startAngle={180} endAngle={0} innerRadius={56} outerRadius={86} cy="70%" stroke="var(--bg)" strokeWidth={2}>
                <Cell fill="var(--success)"/>
                <Cell fill="var(--danger)"/>
                <Cell fill="var(--fg-faint)"/>
              </Pie>
              <Tooltip content={<EidosTooltipContent/>}/>
            </PieChart>
          </EidosChart>
        </Frame>
        <Lede>Half donuts read like a gauge — perfect for "X of Y" stories at the top of a dashboard.</Lede>

        <Frame label="data-table fallback · the exact numbers a colour-blind or screen-reader user reads instead of the arc">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(280px, 360px)', gap: 24, alignItems: 'center' }}>
            <EidosChart height={240} padding={8}>
              <PieChart>
                <Pie data={MIX} dataKey="value" nameKey="name" innerRadius={52} outerRadius={82} stroke="var(--bg)" strokeWidth={2}>
                  {MIX.map((_, i) => <Cell key={i} fill={c[i % c.length]}/>)}
                </Pie>
                <Tooltip content={<EidosTooltipContent/>}/>
              </PieChart>
            </EidosChart>
            <table className="tbl tbl-data" aria-label="Requests by service — name, value and share">
              <caption className="t-mono-label" style={{ textAlign: 'start', color: 'var(--fg-faint)', paddingBottom: 8 }}>requests by service</caption>
              <thead>
                <tr>
                  <th scope="col">Service</th>
                  <th scope="col" style={{ textAlign: 'end' }}>Requests</th>
                  <th scope="col" style={{ textAlign: 'end' }}>Share</th>
                </tr>
              </thead>
              <tbody>
                {MIX.map((m, i) => (
                  <tr key={m.name}>
                    <th scope="row" style={{ fontWeight: 500, color: 'var(--fg)' }}>
                      <span className="legend-dot" style={{ background: c[i % c.length], display: 'inline-block', marginInlineEnd: 8, verticalAlign: 'middle' }}/>
                      {m.name}
                    </th>
                    <td style={{ textAlign: 'end', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>{m.value.toLocaleString()}</td>
                    <td style={{ textAlign: 'end', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-muted)' }}>{(m.value / mixTotal * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>Total</td>
                  <td style={{ textAlign: 'end', fontVariantNumeric: 'tabular-nums' }}>{mixTotal.toLocaleString()}</td>
                  <td style={{ textAlign: 'end', fontVariantNumeric: 'tabular-nums' }}>100.0%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Frame>
        <Lede>Every donut should ship with — or link to — this table. It is the encoding the chart only approximates: a screen reader reads the exact <Mono>name → value → share</Mono>, and a colour-blind reader gets the share as a number, not a hue. Mono numerals are <Mono>tabular-nums</Mono> so the columns align to the same baseline.</Lede>

        <SubHead meta="loading · empty · error">States</SubHead>
        <Lede>A distribution is never instantaneous and is rarely guaranteed to return data — a pie that only knows how to draw slices is a pie that flashes empty or throws on the unhappy path. <Mono>{'<EidosChart>'}</Mono> ships these three as first-class props (<Mono>state="loading"</Mono>, <Mono>state="empty"</Mono>, or a <Mono>fallback</Mono> node) so the surface, header and live-region announcement stay identical to the ready chart below.</Lede>
        <div className="ds-grid cols-3" style={{marginTop: 12}}>
          <Frame label="loading · skeleton">
            <EidosChart title="Requests by service" subtitle="eidos fleet" meta="last 1h" height={220} state="loading" fallback={
              <div role="status" aria-busy="true" aria-label="Loading request distribution" style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap: 14, minBlockSize: 220}}>
                <span className="sk-line" aria-hidden="true" style={{inlineSize: 132, blockSize: 132, borderRadius: '50%'}}/>
                <span className="sk-line" aria-hidden="true" style={{inlineSize: 96, blockSize: 10}}/>
                <span style={{position:'absolute', inlineSize: 1, blockSize: 1, overflow:'hidden', clip: 'rect(0,0,0,0)'}}>Loading request distribution</span>
              </div>
            }/>
          </Frame>
          <Frame label="empty · no events in range">
            <EidosChart title="Requests by service" subtitle="eidos fleet" meta="last 1h" height={220} fallback={
              <div className="empty sm">
                <span className="empty-icon"><Icons.pieChart size={18}/></span>
                <div className="empty-text">
                  <div className="empty-title">No requests in range</div>
                  <div className="empty-desc">Nothing routed to the fleet in the last hour. Widen the window or check the ingest pipeline.</div>
                </div>
              </div>
            }/>
          </Frame>
          <Frame label='error · role="alert"'>
            <EidosChart title="Requests by service" subtitle="eidos fleet" meta="last 1h" height={220} fallback={
              <div style={{display:'flex', alignItems:'center', minBlockSize: 220}}>
                <div className="alert danger" role="alert" aria-live="assertive" style={{inlineSize: '100%'}}>
                  <Icons.alert size={16} aria-hidden="true" className="alert-icon"/>
                  <div className="alert-body">
                    <div className="alert-title">Couldn't load distribution</div>
                    <div className="alert-desc">The metrics query timed out. <Mono tone="subtle">req 8f2a1c</Mono></div>
                    <div className="alert-actions"><button type="button" className="btn xs outline"><Icons.refresh size={12}/> Retry</button></div>
                  </div>
                </div>
              </div>
            }/>
          </Frame>
        </div>
        <Lede>Each state owns the right semantics: loading sets <Mono>aria-busy</Mono> on a <Mono>role="status"</Mono> region, empty offers the next action, and error is a <Mono>role="alert"</Mono> danger surface with the failing <Mono>request id</Mono> and a Retry. Slices, not text, are the only thing that changes between them — the chart never collapses its frame.</Lede>

        <SubHead meta="a11y">Accessibility</SubHead>
        <div className="ds-grid cols-2" style={{marginTop: 12}}>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Colour is never the only signal</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>A slice is identified purely by its <Mono>--viz-*</Mono> hue, so a legend or direct slice label is mandatory — without it, a colour-blind reader can't tell "auth-gateway" from "fraud-engine". Order slices consistently (largest first) to reinforce the mapping.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Palette</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The categorical <Mono>--viz-cat-*</Mono> ramp is tuned for distinct luminance; capping at 5–6 slices keeps adjacent fills — and the thin gaps between them — clearly distinguishable.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Table fallback &amp; keyboard</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Angle is a coarse encoding, so every donut ships the values and shares as the accessible <Mono>&lt;table&gt;</Mono> shown above — <Mono>&lt;caption&gt;</Mono>, <Mono>scope="col"</Mono>/<Mono>scope="row"</Mono> headers, and a <Mono>&lt;tfoot&gt;</Mono> total — the screen-reader path, since the SVG arcs carry no semantics.</div>
            <ul style={{ listStyle: 'none', margin: 'var(--space-2) 0 0', padding: 0, display: 'grid', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>
              <li><kbd className="kbd">Tab</kbd> <span style={{ marginInlineStart: 'var(--space-1)' }}>move into the chart, then onward to the readout table</span></li>
              <li><kbd className="kbd">Tab</kbd> / <kbd className="kbd">Shift</kbd>+<kbd className="kbd">Tab</kbd> <span style={{ marginInlineStart: 'var(--space-1)' }}>step across the value / share cells</span></li>
              <li><kbd className="kbd">Esc</kbd> <span style={{ marginInlineStart: 'var(--space-1)' }}>dismiss the open hover tooltip</span></li>
            </ul>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The sweep-in animation respects <Mono>prefers-reduced-motion</Mono> — slices render at their final angles instantly rather than rotating into place.</div>
          </div>
        </div>

        <SubHead meta="RTL · العربية">RTL</SubHead>
        <Frame label='dir="rtl" — title and tooltip labels align right; the donut is radially symmetric and does not mirror'>
          <div dir="rtl" style={{width: '100%'}}>
            <EidosChart title="الطلبات حسب الخدمة" subtitle="أسطول فورج" meta="آخر ساعة" height={260}>
              <PieChart>
                <Pie data={MIX} dataKey="value" nameKey="name" innerRadius={52} outerRadius={82} stroke="var(--bg)" strokeWidth={2}>
                  {MIX.map((_, i) => <Cell key={i} fill={c[i % c.length]}/>)}
                </Pie>
                <Tooltip content={<EidosTooltipContent/>}/>
              </PieChart>
            </EidosChart>
          </div>
        </Frame>
        <Lede>Under <Mono>dir="rtl"</Mono> the chart title and tooltip rows align to the right and the legend reads right-to-left. The pie itself is radially symmetric — angle encodes proportion, not direction — so the slices do not mirror.</Lede>

        <SubHead meta="anatomy">Anatomy</SubHead>
        <div className="ds-frame">
          <div className="ds-frame-head"><span className="label">anatomy</span></div>
          <div className="ds-frame-body" style={{padding: '64px 36px 56px'}}>
            <div className="ana" style={{display:'flex', justifyContent:'center'}}>
              <div className="stage" style={{position:'relative'}} aria-hidden="true">
                <div style={{width:200, height:180}}>
                  <EidosChart height={180} padding={0}>
                    <PieChart>
                      <Pie data={STORAGE} dataKey="value" nameKey="name" innerRadius={48} outerRadius={76} stroke="var(--bg)" strokeWidth={2}>
                        {STORAGE.map((_, i) => <Cell key={i} fill={c[i % c.length]}/>)}
                      </Pie>
                      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" style={{ fill: 'var(--fg)', fontFamily: 'var(--font-mono)', fontSize: 15, fontVariantNumeric: 'tabular-nums' }}>
                        {total} TB
                      </text>
                    </PieChart>
                  </EidosChart>
                </div>
                <span className="lead h" style={{top: 40, right: -28, width: 24}}/>
                <span className="lead v" style={{top: -22, left: 60, height: 18}}/>
                <span className="lead h" style={{top: 90, left: -28, width: 24}}/>
                <span className="lead v" style={{bottom: -22, left: '50%', height: 18, transform:'translateX(-50%)'}}/>
                <div className="pin" style={{top: 32, right: -52}}>1</div>
                <div className="pin" style={{top: -42, left: 60, transform:'translateX(-50%)'}}>2</div>
                <div className="pin" style={{top: 82, left: -52}}>3</div>
                <div className="pin" style={{bottom: -42, left: '50%', transform:'translateX(-50%)'}}>4</div>
              </div>
            </div>
            <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
              <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Slices.</b> Each arc's angle is its share of the total; fills step through the categorical <Mono>--viz-cat-*</Mono> ramp, or status tokens for outcome donuts (pass/fail/skip).</span>
              <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Hairline gap.</b> A 2px stroke in <Mono>--bg</Mono> separates adjacent slices so categories don't blur into one another.</span>
              <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Centre (donut).</b> Set <Mono>innerRadius</Mono> {'>'} 0 to open a hole — the room for a total label, which turns the chart into an "X of Y" headline.</span>
              <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Legend &amp; tooltip.</b> Effectively required: a slice's name is half the message, its share the other half. Hover surfaces the name, raw value, and percentage — the exact read the arc only approximates.</span>
            </div>
          </div>
        </div>

        <SubHead meta="rules">Do / Don't</SubHead>
        <div className="dd-grid">
          <div className="dd-card do">
            <div className="head"><Icons.check size={12}/> Do — stop at 6 slices</div>
            <div className="body">
              <EidosChart height={160} padding={8}>
                <PieChart>
                  <Pie data={MIX} dataKey="value" nameKey="name" innerRadius={36} outerRadius={66} stroke="var(--bg)" strokeWidth={2}>
                    {MIX.map((_, i) => <Cell key={i} fill={c[i % c.length]}/>)}
                  </Pie>
                </PieChart>
              </EidosChart>
            </div>
            <div className="note">Five slices are the practical max — arc angles smaller than ~30° become indistinguishable. If you have an "Other" bucket, lump rare categories into it instead of slivering them out.</div>
          </div>
          <div className="dd-card dont">
            <div className="head"><Icons.x size={12}/> Don't — 12 micro-slices</div>
            <div className="body">
              <EidosChart height={160} padding={8}>
                <PieChart>
                  <Pie
                    data={Array.from({ length: 12 }, (_, i) => ({ name: 's' + (i + 1), value: 1 + (i % 4) }))}
                    dataKey="value" innerRadius={36} outerRadius={66} stroke="var(--bg)" strokeWidth={2}>
                    {Array.from({ length: 12 }).map((_, i) => <Cell key={i} fill={c[i % c.length]}/>)}
                  </Pie>
                </PieChart>
              </EidosChart>
            </div>
            <div className="note">12 slivers = 12 questions, none of which a pie can answer. A horizontal bar chart (sorted descending) reads in a glance — the eye compares lengths far better than angles.</div>
          </div>
        </div>

        <SubHead meta="props">API reference</SubHead>
        <PropsTable
          label="<Pie />"
          rows={[
            { prop: 'data',        type: 'object[]',  description: 'Each row needs the dataKey + nameKey fields.' },
            { prop: 'dataKey',     type: 'string',    description: 'Field with the numeric slice value.' },
            { prop: 'nameKey',     type: 'string',    default: '"name"', description: 'Field with the label shown in tooltip / legend.' },
            { prop: 'innerRadius', type: 'number',    default: '0', description: 'Set > 0 for a donut. Center room for a total label.' },
            { prop: 'outerRadius', type: 'number',    description: 'Outer arc radius in px (or % of chart size).' },
            { prop: 'startAngle / endAngle', type: 'number', description: 'Sweep range. Use 180 / 0 for a half donut.' },
          ]}
        />
        <PropsTable
          label="<EidosChart /> — distribution states"
          rows={[
            { prop: 'state',    type: '"loading" | "empty" | "ready"', default: '"ready"', description: 'Renders the built-in loading / empty fallback inside the chart body — same surface, header and aria-live region as the ready chart.' },
            { prop: 'fallback', type: 'ReactNode', description: 'Custom non-chart body (skeleton donut, empty CTA, or a role="alert" error). Takes precedence over state.' },
            { prop: 'title / subtitle / meta', type: 'ReactNode', description: 'Header text; stays mounted across every state so the frame never collapses.' },
            { prop: 'height',   type: 'number', default: '280', description: 'Body height in px; the fallback fills the same box so layout does not shift between states.' },
          ]}
        />
      </Section>
    );
}
