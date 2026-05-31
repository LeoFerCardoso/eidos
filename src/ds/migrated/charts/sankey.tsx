'use client';
import { Icons, Frame, Section, SubHead, TabbedCode, PropsTable, installTabs, ForgeChart, ForgeTooltipContent, ChartLegend, Lede, Recharts, Mono } from '@/ds/core';
  const { Sankey, Tooltip, Layer, Rectangle } = Recharts;


  // Traffic flow: forge-api -> downstream services -> outcomes.
  const TRAFFIC = {
    nodes: [
      { name: 'forge-api' },
      { name: 'fraud-engine' },
      { name: 'kyc-orchestrator' },
      { name: 'auth-gateway' },
      { name: 'success' },
      { name: 'retried' },
      { name: 'dropped' },
    ],
    links: [
      { source: 0, target: 1, value: 4200 },
      { source: 0, target: 2, value: 2800 },
      { source: 0, target: 3, value: 5600 },
      { source: 1, target: 4, value: 3600 },
      { source: 1, target: 5, value:  480 },
      { source: 1, target: 6, value:  120 },
      { source: 2, target: 4, value: 2400 },
      { source: 2, target: 5, value:  320 },
      { source: 2, target: 6, value:   80 },
      { source: 3, target: 4, value: 5300 },
      { source: 3, target: 5, value:  240 },
      { source: 3, target: 6, value:   60 },
    ],
  };

  // CI / CD pipeline outcomes.
  const CI = {
    nodes: [
      { name: 'commits' },
      { name: 'lint' },
      { name: 'tests' },
      { name: 'security' },
      { name: 'merged' },
      { name: 'failed' },
      { name: 'reverted' },
    ],
    links: [
      { source: 0, target: 1, value: 320 },
      { source: 1, target: 2, value: 296 },
      { source: 1, target: 5, value:  24 },
      { source: 2, target: 3, value: 270 },
      { source: 2, target: 5, value:  26 },
      { source: 3, target: 4, value: 254 },
      { source: 3, target: 5, value:  16 },
      { source: 4, target: 6, value:   8 },
    ],
  };

  // Forge node renderer — gives every block a Forge-toned rectangle + label.
  const PALETTE = ['var(--viz-cat-1)','var(--viz-cat-2)','var(--viz-cat-3)','var(--viz-cat-4)','var(--success)','var(--warning)','var(--danger)'];
  const ForgeNode = (props) => {
    const x = props.x, y = props.y, width = props.width, height = props.height;
    const payload = props.payload || {};
    const idx = props.index || 0;
    const fill = PALETTE[idx % PALETTE.length];
    return (
      <Layer>
        <Rectangle x={x} y={y} width={width} height={height} fill={fill} fillOpacity={0.95}/>
        <text x={x + width + 6} y={y + height / 2} textAnchor="start" dominantBaseline="middle"
              style={{ fill: 'var(--fg)', fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 500 }}>
          {payload.name}
        </text>
      </Layer>
    );
  };

  // Correct link renderer — receives sourceX/targetX/sourceY/targetY +
  // sourceControlX/targetControlX from Recharts Sankey. We build the path
  // ourselves so the ribbon stretches between source and target nodes.
  const ForgeLink = (props) => {
    const {
      sourceX, targetX, sourceY, targetY,
      sourceControlX, targetControlX, linkWidth, index,
    } = props;
    if (sourceX == null || targetX == null) return null;
    const d = `M${sourceX},${sourceY}
               C${sourceControlX},${sourceY}
                ${targetControlX},${targetY}
                ${targetX},${targetY}`;
    const color = PALETTE[index % PALETTE.length];
    return (
      <path d={d}
            stroke={color}
            strokeOpacity={0.28}
            strokeWidth={Math.max(1, linkWidth)}
            fill="none"
            className="forge-sankey-link"/>
    );
  };

  const USAGE = `import { Sankey, Tooltip } from "recharts"
import { ForgeChart, ForgeTooltipContent } from "@/charts"

// The link path is rendered by a function that receives sourceX/targetX/
// sourceY/targetY/sourceControlX/targetControlX + linkWidth.
function ForgeLink({ sourceX, targetX, sourceY, targetY,
                    sourceControlX, targetControlX, linkWidth, index }) {
  const d = \`M\${sourceX},\${sourceY} C\${sourceControlX},\${sourceY}\` +
            \` \${targetControlX},\${targetY} \${targetX},\${targetY}\`
  return <path d={d} stroke={"var(--viz-cat-" + ((index % 7) + 1) + ")"}
               strokeOpacity={0.28}
               strokeWidth={Math.max(1, linkWidth)} fill="none"/>
}

export function Demo({ data }) {
  return (
    <ForgeChart title="Traffic flow" height={320}>
      <Sankey data={data}
              nodePadding={24} nodeWidth={10}
              node={<ForgeNode/>} link={<ForgeLink/>}>
        <Tooltip content={<ForgeTooltipContent/>}/>
      </Sankey>
    </ForgeChart>
  )
}`;

export default function Page() {
  return (
    <Section id="chart-sankey" title="Sankey diagram" desc="Traces how a quantity flows and splits across stages — API fan-out, CI pipeline conversion, request outcomes. Link thickness encodes volume. Use it when routing or funnel shape between a few layers is the story.">
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('chart-sankey')} ariaLabel="package manager"/>
      <Lede>Sankey is best at 2–4 layers and ≤ 10 nodes per layer. Past that, every layer becomes a wall of ribbons and the flow loses meaning. The width of every link is proportional to the value flowing through it.</Lede>

      <SubHead meta="hello world">Usage</SubHead>
      <Lede up>Read it left → right: each column is a stage, ribbon width is the volume flowing between them, and a ribbon keeps its source node's hue across the whole diagram. Hover any ribbon for the exact value its thickness only approximates.</Lede>
      <Frame label="traffic flow · forge-api fan-out" code={USAGE}>
        <ForgeChart title="Request flow" subtitle="forge-api fan-out" meta="last 1h · rps" height={360}>
          <Sankey data={TRAFFIC} nodePadding={28} nodeWidth={10}
                  node={<ForgeNode/>} link={<ForgeLink/>}
                  margin={{ top: 10, right: 130, bottom: 10, left: 10 }}>
            <Tooltip content={<ForgeTooltipContent/>}/>
          </Sankey>
        </ForgeChart>
      </Frame>
      <p className="ds-caption dim" style={{ marginTop: 12, marginBottom: 18 }}>
        <span className="t-mono-label" style={{ marginInlineEnd: 8 }}>when not to</span>
        Width encodes value, so flow must conserve — what enters a node should equal what leaves it, or the widths mislead. Reach for a heatmap or a force-directed graph the moment connections turn dense or fully meshed.
      </p>

      <SubHead meta="2 variants">Variants</SubHead>
      <Frame label="CI/CD pipeline · funnel from commit to merge">
        <ForgeChart title="CI pipeline" subtitle="this week" meta="commits → merged" height={340}>
          <Sankey data={CI} nodePadding={32} nodeWidth={10}
                  node={<ForgeNode/>} link={<ForgeLink/>}
                  margin={{ top: 10, right: 120, bottom: 10, left: 10 }}>
            <Tooltip content={<ForgeTooltipContent/>}/>
          </Sankey>
        </ForgeChart>
      </Frame>

      <Frame label="dense flow · pair with legend for outcomes">
        <ForgeChart title="Traffic outcomes" subtitle="success / retried / dropped" meta="last 1h" height={340}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: 16, alignItems: 'stretch', width: '100%', height: '100%' }}>
            <Sankey data={TRAFFIC} nodePadding={20} nodeWidth={8}
                    node={<ForgeNode/>} link={<ForgeLink/>}
                    margin={{ top: 10, right: 130, bottom: 10, left: 10 }}>
              <Tooltip content={<ForgeTooltipContent/>}/>
            </Sankey>
            <div style={{ alignSelf: 'center' }}>
              <ChartLegend items={[
                { color: 'var(--success)', label: 'success' },
                { color: 'var(--warning)', label: 'retried' },
                { color: 'var(--danger)',  label: 'dropped' },
              ]}/>
            </div>
          </div>
        </ForgeChart>
      </Frame>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Colour is never the only signal</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Ribbon width already carries the volume, and every node is labelled in text — so flow can be read without colour. Where colour groups outcomes (success / retried / dropped), pair the <Mono>--viz-*</Mono> hue with a legend and the destination node's own label so the routing survives in greyscale.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Palette</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Nodes index the categorical <Mono>--viz-cat-*</Mono> ramp by position, tuned for distinct luminance; keeping to 2–4 layers and ≤10 nodes per layer caps how many hues are on screen so adjacent ribbons stay distinguishable.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard &amp; tooltip</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The ribbon tooltip is reachable and dismissable; because thickness is an approximate read, provide the source → target → value links as an accessible <Mono>&lt;table&gt;</Mono> fallback where exact volumes matter.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The ribbon draw-in animation respects <Mono>prefers-reduced-motion</Mono> — the full flow renders instantly rather than streaming from source to target.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label='dir="rtl" — node labels and tooltip align right; flow still reads left to right (directed graph convention)'>
        <div dir="rtl" style={{width: '100%'}}>
          <ForgeChart title="تدفق طلبات API" subtitle="forge-api fan-out" meta="آخر ساعة · rps" height={360}>
            <Sankey data={TRAFFIC} nodePadding={28} nodeWidth={10}
                    node={<ForgeNode/>} link={<ForgeLink/>}
                    margin={{ top: 10, right: 130, bottom: 10, left: 10 }}>
              <Tooltip content={<ForgeTooltipContent/>}/>
            </Sankey>
          </ForgeChart>
        </div>
      </Frame>
      <Lede>Under <Mono>dir="rtl"</Mono> the chart title, tooltip, and any legend text align to the right. The Sankey diagram itself reads left to right — that directionality is part of the graph's meaning (source → target), not a locale preference — so the flow is not mirrored.</Lede>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{padding: '64px 36px 56px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative'}} aria-hidden="true">
              <div style={{width:300, height:180}}>
                <ForgeChart height={180} padding={0}>
                  <Sankey data={CI} nodePadding={20} nodeWidth={9}
                          node={<ForgeNode/>} link={<ForgeLink/>}
                          margin={{ top: 8, right: 80, bottom: 8, left: 8 }}>
                  </Sankey>
                </ForgeChart>
              </div>
              <span className="lead v" style={{top: -22, left: 20, height: 18}}/>
              <span className="lead v" style={{top: -22, left: '50%', height: 18, transform:'translateX(-50%)'}}/>
              <span className="lead v" style={{bottom: -22, left: '50%', height: 18, transform:'translateX(-50%)'}}/>
              <span className="lead h" style={{top: 90, right: -28, width: 24}}/>
              <div className="pin" style={{top: -42, left: 20, transform:'translateX(-50%)'}}>1</div>
              <div className="pin" style={{top: -42, left: '50%', transform:'translateX(-50%)'}}>2</div>
              <div className="pin" style={{bottom: -42, left: '50%', transform:'translateX(-50%)'}}>3</div>
              <div className="pin" style={{top: 82, right: -52}}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
            <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Nodes.</b> Vertical blocks, one per stage entity, arranged in left-to-right layers. Each is filled from the <Mono>--viz-cat-*</Mono> palette (with <Mono>--success</Mono>/<Mono>--warning</Mono>/<Mono>--danger</Mono> reserved for outcomes) and labelled in mono just past its edge.</span>
            <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Links (ribbons).</b> Curved bands whose width is proportional to the value flowing through them; they inherit a translucent hue from their source node so a flow stays one colour across the diagram.</span>
            <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Reading direction.</b> Always left → right; the right margin reserves room for the longest node label.</span>
            <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Legend &amp; tooltip.</b> For outcome flows, an explicit legend maps the status colours; hover a ribbon for the exact volume the thickness only approximates.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — 2–4 layers, ≤ 10 nodes per layer</div>
          <div className="body" style={{ padding: 12 }}>
            <ForgeChart height={220} padding={6}>
              <Sankey data={CI} nodePadding={18} nodeWidth={8}
                      node={<ForgeNode/>} link={<ForgeLink/>}
                      margin={{ top: 8, right: 100, bottom: 8, left: 8 }}/>
            </ForgeChart>
          </div>
          <div className="note">Clean layer separation. Each ribbon's thickness tells the volume story without a tooltip.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — wire every service to every service</div>
          <div className="body" style={{ padding: 14 }}>
            <ForgeChart height={220} padding={6}>
              <Sankey data={{
                nodes: [
                  { name: 'api-a' }, { name: 'api-b' }, { name: 'api-c' }, { name: 'api-d' },
                  { name: 'svc-1' }, { name: 'svc-2' }, { name: 'svc-3' }, { name: 'svc-4' },
                ],
                links: [
                  { source: 0, target: 4, value: 100 }, { source: 0, target: 5, value: 80 }, { source: 0, target: 6, value: 60 }, { source: 0, target: 7, value: 40 },
                  { source: 1, target: 4, value: 70 },  { source: 1, target: 5, value: 90 }, { source: 1, target: 6, value: 50 }, { source: 1, target: 7, value: 30 },
                  { source: 2, target: 4, value: 60 },  { source: 2, target: 5, value: 40 }, { source: 2, target: 6, value: 85 }, { source: 2, target: 7, value: 35 },
                  { source: 3, target: 4, value: 50 },  { source: 3, target: 5, value: 30 }, { source: 3, target: 6, value: 45 }, { source: 3, target: 7, value: 70 },
                ],
              }} nodePadding={10} nodeWidth={6}
                 node={<ForgeNode/>} link={<ForgeLink/>}
                 margin={{ top: 8, right: 70, bottom: 8, left: 8 }}/>
            </ForgeChart>
          </div>
          <div className="note">Fully-connected graphs aren't Sankeys. Use a force-directed graph or a heatmap of service ↔ service traffic instead.</div>
        </div>
      </div>

      <SubHead meta="props">API reference</SubHead>
      <PropsTable
        label="<Sankey />"
        rows={[
          { prop: 'data', type: '{ nodes, links }', description: 'nodes: [{ name }] · links: [{ source, target, value }]. Source/target are indices into nodes.' },
          { prop: 'node', type: 'ReactElement', description: 'Custom node renderer. Receives { x, y, width, height, payload, index }.' },
          { prop: 'link', type: 'ReactElement', description: 'Custom link renderer. Receives { sourceX, targetX, sourceY, targetY, sourceControlX, targetControlX, linkWidth, index } — build the path yourself.' },
          { prop: 'nodePadding', type: 'number', default: '10', description: 'Vertical space between sibling nodes.' },
          { prop: 'nodeWidth',   type: 'number', default: '10', description: 'Thickness of each node block.' },
          { prop: 'margin',      type: 'object', description: 'Reserve room on the right for the longest node label.' },
        ]}
      />
    </Section>
  );
}
