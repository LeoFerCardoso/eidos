import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./jsx-runtime-CaZkqeYb.js";import{Xi as n,t as r}from"./src-DgoylXRw.js";var i,a,o,s,c,l,u,d,f,p;e((()=>{r(),i=t(),a=[12,18,15,22,19,28,24,31,27,35,30,38],o={title:`Elements/MetricCard`,component:n,tags:[`autodocs`],parameters:{layout:`centered`,docs:{description:{component:"A KPI card: mono eyebrow label, a headline value, an optional period-over-period `Trend` chip, an optional sparkline, and a footer for SLO/comparison context."}}},args:{label:`Deploy frequency`,value:142,delta:12,deltaUnit:`%`,size:`md`,foot:`vs. previous 30 days`},argTypes:{size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]},value:{control:`text`},delta:{control:`number`},inverted:{control:`boolean`}}},s={},c={args:{label:`Requests / min`,value:`38.2`,unit:`k`,series:a,delta:9}},l={args:{label:`MTTR`,value:24,unit:`min`,delta:-18,inverted:!0,foot:`Mean time to restore`}},u={args:{label:`Change failure rate`,value:`7.4`,suffix:`%`,delta:-3}},d={render:()=>(0,i.jsx)(`div`,{style:{display:`flex`,gap:16,alignItems:`flex-start`,flexWrap:`wrap`},children:[`sm`,`md`,`lg`].map(e=>(0,i.jsx)(n,{label:`Size ${e}`,value:142,delta:12,size:e,series:a},e))})},f={parameters:{layout:`padded`},render:()=>(0,i.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(3, minmax(180px, 1fr))`,gap:16},children:[(0,i.jsx)(n,{label:`Deploy frequency`,value:142,delta:12,series:a,foot:`last 30 days`}),(0,i.jsx)(n,{label:`Lead time`,value:3.2,unit:`h`,delta:-22,inverted:!0,series:a,foot:`commit → prod`}),(0,i.jsx)(n,{label:`Change failure rate`,value:`7.4`,suffix:`%`,delta:-3,foot:`last 30 days`})]})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Requests / min',
    value: '38.2',
    unit: 'k',
    series: SERIES,
    delta: 9
  }
}`,...c.parameters?.docs?.source},description:{story:`With a sparkline under the value.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'MTTR',
    value: 24,
    unit: 'min',
    delta: -18,
    inverted: true,
    foot: 'Mean time to restore'
  }
}`,...l.parameters?.docs?.source},description:{story:'A "lower is better" metric — `inverted` flips the trend color so the chip\n follows the verdict (a drop in MTTR is good → green).',...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Change failure rate',
    value: '7.4',
    suffix: '%',
    delta: -3
  }
}`,...u.parameters?.docs?.source},description:{story:`Negative movement on a normal metric reads red.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 16,
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  }}>
      {(['sm', 'md', 'lg'] as const).map(size => <MetricCard key={size} label={\`Size \${size}\`} value={142} delta={12} size={size} series={SERIES} />)}
    </div>
}`,...d.parameters?.docs?.source},description:{story:`The three densities.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  parameters: {
    layout: 'padded'
  },
  render: () => <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))',
    gap: 16
  }}>
      <MetricCard label="Deploy frequency" value={142} delta={12} series={SERIES} foot="last 30 days" />
      <MetricCard label="Lead time" value={3.2} unit="h" delta={-22} inverted series={SERIES} foot="commit → prod" />
      <MetricCard label="Change failure rate" value="7.4" suffix="%" delta={-3} foot="last 30 days" />
    </div>
}`,...f.parameters?.docs?.source},description:{story:`A row of cards as they'd sit on a DORA dashboard.`,...f.parameters?.docs?.description}}},p=[`Default`,`WithSparkline`,`InvertedMetric`,`NegativeDelta`,`Sizes`,`InContext`]}))();export{s as Default,f as InContext,l as InvertedMetric,u as NegativeDelta,d as Sizes,c as WithSparkline,p as __namedExportsOrder,o as default};