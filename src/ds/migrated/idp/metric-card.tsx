'use client';
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, MetricCard, Trend, Sparkline, Skeleton, Spinner, Empty, Lede, Mono } from '@/ds/core';


const USAGE = `import { MetricCard } from "@/components/forge/metric-card"

export function Demo() {
  return (
    <MetricCard
      label="Deploys / day"
      value={24}
      delta={4}
      series={[12, 14, 13, 16, 18, 20, 24]}
      foot="vs. last 7 days"
    />
  )
}`;

const sDeploy = [12, 14, 13, 16, 18, 20, 24];
const sLead   = [3.1, 2.9, 2.6, 2.4, 2.2, 2.1, 2.1];
const sMttr   = [52, 48, 44, 42, 40, 39, 38];
const sCfr    = [5.1, 4.8, 4.6, 4.5, 4.3, 4.2, 4.2];
const sLatHero = [128, 132, 141, 139, 145, 142, 137, 138, 142, 140, 138, 142];

const SKELETON_CODE = `function MetricCardSkeleton() {
  return (
    <div className="metric-card" aria-hidden="true">
      <div className="mc-head"><Skeleton width="52%"/></div>
      <Skeleton variant="box" width="46%" height={28} radius={6}/>
      <Skeleton variant="box" width={180} height={32} radius={6}/>
      <div className="mc-foot" style={{ borderBlockStart: 0 }}>
        <Skeleton width="60%"/>
      </div>
    </div>
  );
}`;

// MetricCardSkeleton — mirrors the real .metric-card slots (label · value ·
// spark · foot) so a 4-up grid never reflows when the KPI query resolves.
function MetricCardSkeleton() {
  return (
    <div className="metric-card" aria-hidden="true">
      <div className="mc-head"><Skeleton width="52%"/></div>
      <Skeleton variant="box" width="46%" height={28} radius={6}/>
      <Skeleton variant="box" width={180} height={32} radius={6}/>
      <div className="mc-foot" style={{ borderBlockStart: 0 }}>
        <Skeleton width="60%"/>
      </div>
    </div>
  );
}

export default function MetricCardPage() {
  return (
    <Section id="el-metric-card" title="Metric card" desc="KPI tile for the DORA grid, the hero metric on a service page, and period comparisons. MetricCard owns the label-row chrome, trend mapping, sparkline scale, and footer so they are never re-implemented inline.">
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('metric-card')} ariaLabel="package manager"/>
      <Lede>Every KPI on a Eidos surface flows through <Mono>&lt;MetricCard/&gt;</Mono>. The component owns the label-row chrome, the trend mapping, the sparkline scale, and the footer line — never re-implement these inline.</Lede>

      <SubHead meta="hello world">Usage</SubHead>
      <Lede>Composes Card + Trend + Sparkline. For &ldquo;lower is better&rdquo; KPIs (lead time, MTTR, latency) set <Mono>inverted</Mono> — the trend colour follows the verdict, not the sign, so a falling latency reads green instead of red.</Lede>
      <Frame label="single tile · default size" code={USAGE}>
        <div style={{maxWidth: 280}}>
          <MetricCard label="Deploys / day" value={24} delta={4} series={sDeploy} foot="vs. last 7 days"/>
        </div>
      </Frame>
      <Lede>Three slots: label (uppercase mono), value (large numeric), trend (top-right). The optional sparkline rides under the value and the footer sits at the bottom — the same rhythm reads in every grid.</Lede>

      <div style={{ marginBlockStart: 36, marginBlockEnd: 6, display:'flex', alignItems:'center', gap: 12 }}>
        <span style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--fg-faint)'}}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      <SubHead meta="4-up grid">DORA KPI row</SubHead>
      <Frame label="deploy frequency · lead time · MTTR · change failure rate" code={`<div className="ds-grid cols-4">
  <MetricCard label="Deploys / day" value={24}   delta={4}   series={[…]} foot="vs. last 7d"/>
  <MetricCard label="Lead time"     value="2.1h" delta={-18} deltaUnit="m" inverted series={[…]} foot="vs. last 7d"/>
  <MetricCard label="MTTR"          value="38m"  delta={-14} deltaUnit="m" inverted series={[…]} foot="vs. last 7d"/>
  <MetricCard label="Change failure" value="4.2%" delta={-0.6} deltaUnit="pp" inverted series={[…]} foot="vs. last 7d"/>
</div>`}>
        <div className="ds-grid cols-4">
          <MetricCard label="Deploys / day"    value={24}    delta={4}    series={sDeploy} foot="vs. last 7d"/>
          <MetricCard label="Lead time"        value="2.1h"  delta={-18}  deltaUnit="m"  inverted series={sLead}   foot="vs. last 7d"/>
          <MetricCard label="MTTR"             value="38m"   delta={-14}  deltaUnit="m"  inverted series={sMttr}   foot="vs. last 7d" sparkColor="var(--success)"/>
          <MetricCard label="Change failure"   value="4.2%"  delta={-0.6} deltaUnit="pp" inverted series={sCfr}    foot="vs. last 7d" sparkColor="var(--success)"/>
        </div>
      </Frame>
      <Lede>For "lower is better" KPIs (lead time, MTTR, change failure rate), set <Mono>inverted</Mono> on the card. The arrow still points down — the colour just stops lying about the direction.</Lede>

      <SubHead meta="single hero tile">Hero metric</SubHead>
      <Frame label="size='lg' · the single most important metric on the page" code={`<MetricCard
  size="lg"
  label="p95 latency · eidos-api"
  value={142}
  unit="ms"
  delta={-4.2}
  deltaUnit="ms"
  inverted
  series={[…]}
  foot="last 24h · SLO 200ms · budget 78%"
/>`}>
        <div style={{maxWidth: 520}}>
          <MetricCard size="lg" label="p95 latency · eidos-api" value={142} unit="ms"
                      delta={-4.2} deltaUnit="ms" inverted series={sLatHero}
                      foot="last 24h · SLO 200ms · budget 78%"
                      sparkColor="var(--success)"/>
        </div>
      </Frame>

      <SubHead meta="period comparison">Current vs. previous</SubHead>
      <Frame label="two cards side-by-side · same metric, different windows" code={`<div className="ds-grid cols-2">
  <MetricCard label="Deploys · this week"  value={48} foot="Mon–Sun"/>
  <MetricCard label="Deploys · last week"  value={44} foot="prev. Mon–Sun" tone="muted"/>
</div>`}>
        <div className="ds-grid cols-2">
          <MetricCard label="Deploys · this week" value={48} delta={9} series={[6,8,7,9,8,5,5]} foot="Mon–Sun"/>
          <MetricCard label="Deploys · last week" value={44} series={[5,7,6,8,7,5,6]} foot="prev. Mon–Sun"/>
        </div>
      </Frame>
      <Lede>Same label rhythm, same numeric scale. The reader's eye lands on the value first, the sparkline confirms the shape, the trend gives the verdict — three identical cells, two periods.</Lede>

      <SubHead meta="loading · empty · no-data">State coverage</SubHead>
      <Lede>A fetched KPI tile is never just &ldquo;populated&rdquo;. The same footprint carries its whole lifecycle — a <Mono>Skeleton</Mono> while the query is in flight, an <Mono>Empty</Mono> primitive when the metric has no series yet, and a quiet em-dash when a single window returned no data. Each state keeps the card's exact geometry so a grid never reflows as cells resolve.</Lede>
      <Frame label="one tile · four states · identical footprint" code={`{query.status === "loading" && <MetricCardSkeleton/>}
{query.status === "empty"   && <Empty size="sm" iconName="barChart" title="No data yet" desc="…"/>}
{query.status === "no-window" && <MetricCard label="Deploys / day" value="—" foot="no events in window"/>}
{query.status === "ready"   && <MetricCard label="Deploys / day" value={24} delta={4} series={[…]} foot="vs. last 7d"/>}

${SKELETON_CODE}`}>
        <div>
          <div className="ds-grid cols-4">
            {/* populated */}
            <MetricCard label="Deploys / day" value={24} delta={4} series={sDeploy} foot="vs. last 7d"/>
            {/* loading */}
            <MetricCardSkeleton/>
            {/* empty — metric has no series registered yet */}
            <div className="metric-card" style={{ justifyContent: 'center' }}>
              <Empty size="sm" iconName="barChart" title="No data yet"
                     desc="This KPI has no recorded events to chart."/>
            </div>
            {/* no-data for the selected window */}
            <MetricCard label="Deploys / day" value="—" foot="no events in window"/>
          </div>
          <div role="status" aria-live="polite" style={{ marginBlockStart: 16, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>
            <Spinner size="sm"/> Loading metrics…
          </div>
        </div>
      </Frame>
      <Lede>Reading order, left to right: <b style={{color:'var(--fg)'}}>ready</b> (the verdict tile), <b style={{color:'var(--fg)'}}>loading</b> (skeleton bars in the same slots), <b style={{color:'var(--fg)'}}>empty</b> (the <Mono>Empty</Mono> primitive, never a blank box), and <b style={{color:'var(--fg)'}}>no-window</b> (a literal <Mono>—</Mono> so the cell reads &ldquo;measured, nothing happened&rdquo; rather than &ldquo;broken&rdquo;).</Lede>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginBlockStart: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--fg)', marginBlockEnd: 10}}>Keyboard</div>
          <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-base)'}}>
            <tbody>
              <tr>
                <td style={{paddingBlock: 4, paddingInlineEnd: 14, whiteSpace: 'nowrap', verticalAlign: 'top', fontFamily: 'var(--font-mono)'}}>—</td>
                <td style={{paddingBlock: 4, color: 'var(--fg-muted)', lineHeight: 1.55}}>A bare tile is a read-only display, not a control, so it has no tab stop — a 4-up DORA grid adds zero stops.</td>
              </tr>
              <tr>
                <td style={{paddingBlock: 4, paddingInlineEnd: 14, whiteSpace: 'nowrap', verticalAlign: 'top', fontFamily: 'var(--font-mono)'}}><Mono>Tab</Mono></td>
                <td style={{paddingBlock: 4, color: 'var(--fg-muted)', lineHeight: 1.55}}>When a tile links to its full metric page, that link is a single <Mono>Tab</Mono> stop with a visible focus ring; nothing else inside the tile is focusable.</td>
              </tr>
              <tr>
                <td style={{paddingBlock: 4, paddingInlineEnd: 14, whiteSpace: 'nowrap', verticalAlign: 'top', fontFamily: 'var(--font-mono)'}}><Mono>Enter</Mono></td>
                <td style={{paddingBlock: 4, color: 'var(--fg-muted)', lineHeight: 1.55}}>Activates that link — opens the metric&rsquo;s detail page, the same path as a pointer click.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--fg)', marginBlockEnd: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The label, value (with unit/prefix), trend and footer read as a single coherent group — &ldquo;Lead time, 2.1h, down 18m, vs last 7 days&rdquo; — so the verdict is spoken, not just shown. The Trend delta carries its direction in text (&ldquo;down 18m&rdquo;), and the decorative sparkline is <Mono>aria-hidden</Mono> rather than dumped as a number list.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--fg)', marginBlockEnd: 6}}>Loading &amp; empty</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The skeleton tiles are <Mono>aria-hidden</Mono>; a single live <Mono>role=&quot;status&quot;</Mono> region beside the grid announces &ldquo;Loading metrics…&rdquo; so assistive tech hears the wait once, not four times. The empty tile is the <Mono>Empty</Mono> primitive (also <Mono>role=&quot;status&quot;</Mono>) with real text, and the no-window tile renders a literal <Mono>—</Mono> — never a silent blank cell.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--fg)', marginBlockEnd: 6}}>Status, not colour alone</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>A good-vs-bad trend is signalled by the arrow direction and the signed value as well as the success/danger tint, so it survives greyscale — and <Mono>inverted</Mono> keeps that colour honest on &lsquo;lower is better&rsquo; KPIs. The sparkline tint is a decoration, never the sole reading of the metric; value, trend and footer all meet AA against the tile.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--fg)', marginBlockEnd: 6}}>Density &amp; reduced motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The three sizes (sm / md / lg) change scale, not legibility — the value never drops below a readable size and a linked tile keeps a visible focus ring. The sparkline draws once with no looping motion, and the skeleton shimmer is suppressed under <Mono>prefers-reduced-motion</Mono>.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label='dir="rtl" — label anchors to the right, trend chip flips to the left; sparkline direction is unchanged'>
        <div dir="rtl" className="ds-grid cols-2">
          <MetricCard label="عمليات النشر / يوم" value={24} delta={4} series={sDeploy} foot="مقابل آخر 7 أيام"/>
          <MetricCard label="وقت الاستجابة" value="2.1h" delta={-18} deltaUnit="m" inverted series={sLead} foot="مقابل آخر 7 أيام"/>
        </div>
      </Frame>
      <Lede>
        The card uses logical CSS so the label row anchors to the inline-start (right in RTL), the Trend chip moves to the inline-end (left), and the footer text aligns right. The sparkline is a decorative visual — it does not mirror, which is correct: time always flows left-to-right on a spark regardless of locale.
      </Lede>

      {/* ====================================================================
          ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 48px 64px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', maxWidth: 280 }} aria-hidden="true">
              <MetricCard label="Deploys / day" value={24} delta={4} series={sDeploy} foot="vs. last 7 days"/>
              {/* pin 1 — label (top-left) */}
              <span className="lead v" style={{ top: -26, left: 16, height: 22 }} />
              <div className="pin" style={{ top: -48, left: 16, transform: 'translateX(-50%)' }}>1</div>
              {/* pin 2 — Trend chip (top-right) */}
              <span className="lead v" style={{ top: -26, right: 10, height: 22 }} />
              <div className="pin" style={{ top: -48, right: 10, transform: 'translateX(50%)' }}>2</div>
              {/* pin 3 — value (large number) */}
              <span className="lead h" style={{ top: 38, right: -30, width: 24 }} />
              <div className="pin" style={{ top: 28, right: -52 }}>3</div>
              {/* pin 4 — sparkline */}
              <span className="lead h" style={{ top: 72, right: -30, width: 24 }} />
              <div className="pin" style={{ top: 62, right: -52 }}>4</div>
              {/* pin 5 — footer */}
              <span className="lead v" style={{ bottom: -26, left: '50%', height: 22 }} />
              <div className="pin" style={{ bottom: -48, left: '50%', transform: 'translateX(-50%)' }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Label.</b> Uppercase <Mono>--font-mono</Mono> at <Mono>--text-xs</Mono> with wide letter-spacing — names the KPI and establishes the grid's scanning rhythm. Keep it short: "Deploys / day", "Lead time".</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Trend chip.</b> Signed delta + arrow. Green = improvement, red = regression; set <Mono>inverted</Mono> on "lower is better" KPIs (lead time, MTTR) so the colour follows the verdict, not just the sign.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Value.</b> The KPI in tabular Geist Mono at the card's hero size — <Mono>size="md"</Mono> ≈ 32px, <Mono>size="lg"</Mono> ≈ 48px. Integers auto-format with locale separators; strings render verbatim.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Sparkline.</b> 180 × 32px at <Mono>md</Mono> (240 × 40px at <Mono>lg</Mono>), tinted with <Mono>--accent</Mono> by default. Decorative — hidden from screen readers. Omit by not passing <Mono>series</Mono>.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Footer.</b> Comparison window and SLO context in <Mono>--text-xs</Mono> muted mono. Always pair it with the sparkline's time range — "vs. last 7d" on a 7-point spark, not a 30-day delta.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — match the trend window to the sparkline</div>
          <div className="body">
            <div style={{maxWidth: 260}}>
              <MetricCard label="Lead time" value="2.1h" delta={-18} deltaUnit="m" inverted series={sLead} foot="vs. last 7d"/>
            </div>
          </div>
          <div className="note">If the sparkline shows 7 days, the trend must read "vs. last 7d". A 30-day delta on a 7-point spark misleads at first glance.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — eidost <Mono>inverted</Mono> on latency metrics</div>
          <div className="body">
            <div style={{maxWidth: 260}}>
              <MetricCard label="p95 latency" value={142} unit="ms" delta={-4} deltaUnit="ms" series={sLead}/>
            </div>
          </div>
          <div className="note">A red ↓ on a latency drop is a lie. Set <Mono>inverted</Mono> so the colour follows the verdict, not the sign.</div>
        </div>
      </div>

      <SubHead meta="MetricCardProps">API reference</SubHead>
      {/* Generated from the typed MetricCard props (scripts/gen-props.mjs) — can't drift from the component. */}
      <AutoPropsTable component="MetricCard" label="<MetricCard />"/>
    </Section>
  );
}
