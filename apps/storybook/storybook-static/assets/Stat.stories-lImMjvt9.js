import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./jsx-runtime-CaZkqeYb.js";import{t as n,ta as r}from"./src-DgoylXRw.js";var i,a,o,s,c,l,u,d,f,p;e((()=>{n(),i=t(),a={title:`Elements/Stat`,component:r,tags:[`autodocs`],parameters:{layout:`centered`,docs:{description:{component:"A compact inline KPI: a mono eyebrow label, a headline value with optional suffix, an optional period-over-period `Trend` chip, and a faint hint line. Three variants — `default`, `hero`, and `inline` — cover card tiles, page headers, and row cells respectively."}}},args:{label:`Deploy frequency`,value:142,suffix:void 0,hint:`last 30 days`,variant:`default`,align:`start`},argTypes:{variant:{control:`inline-radio`,options:[`default`,`hero`,`inline`]},align:{control:`inline-radio`,options:[`start`,`center`,`end`]},delta:{control:`number`},inverted:{control:`boolean`},value:{control:`text`},suffix:{control:`text`},hint:{control:`text`}}},o={},s={args:{label:`Deploy frequency`,value:142,delta:12,deltaUnit:`%`,hint:`vs. previous 30 days`}},c={args:{label:`MTTR`,value:24,suffix:` min`,delta:-18,inverted:!0,hint:`mean time to restore`}},l={args:{label:`Engineering throughput index`,value:88,suffix:`/100`,delta:3,variant:`hero`}},u={args:{label:`p95`,value:142,suffix:` ms`,variant:`inline`}},d={render:()=>(0,i.jsxs)(`div`,{style:{display:`flex`,gap:32,alignItems:`flex-start`,flexWrap:`wrap`},children:[(0,i.jsx)(r,{label:`Deploy freq`,value:142,delta:12,hint:`last 30 days`,variant:`default`}),(0,i.jsx)(r,{label:`ETI`,value:88,suffix:`/100`,delta:3,variant:`hero`}),(0,i.jsx)(r,{label:`p95`,value:142,suffix:` ms`,variant:`inline`})]})},f={parameters:{layout:`padded`},render:()=>(0,i.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(4, 1fr)`,gap:16},children:[(0,i.jsx)(r,{label:`Deploy frequency`,value:142,delta:12,hint:`last 30 days`}),(0,i.jsx)(r,{label:`Lead time`,value:`3.2`,suffix:` h`,delta:-22,inverted:!0,hint:`commit → prod`}),(0,i.jsx)(r,{label:`Change failure rate`,value:`7.4`,suffix:`%`,delta:-3,hint:`last 30 days`}),(0,i.jsx)(r,{label:`MTTR`,value:24,suffix:` min`,delta:-18,inverted:!0,hint:`mean time to restore`})]})},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Deploy frequency',
    value: 142,
    delta: 12,
    deltaUnit: '%',
    hint: 'vs. previous 30 days'
  }
}`,...s.parameters?.docs?.source},description:{story:`With a period-over-period trend chip (positive movement).`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'MTTR',
    value: 24,
    suffix: ' min',
    delta: -18,
    inverted: true,
    hint: 'mean time to restore'
  }
}`,...c.parameters?.docs?.source},description:{story:'"Lower is better" metric — `inverted` flips the trend chip so a negative delta reads green.',...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Engineering throughput index',
    value: 88,
    suffix: '/100',
    delta: 3,
    variant: 'hero'
  }
}`,...l.parameters?.docs?.source},description:{story:`Hero variant for page-header KPIs.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'p95',
    value: 142,
    suffix: ' ms',
    variant: 'inline'
  }
}`,...u.parameters?.docs?.source},description:{story:`Inline variant — fits inside table cells or dense rows.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 32,
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  }}>
      <Stat label="Deploy freq" value={142} delta={12} hint="last 30 days" variant="default" />
      <Stat label="ETI" value={88} suffix="/100" delta={3} variant="hero" />
      <Stat label="p95" value={142} suffix=" ms" variant="inline" />
    </div>
}`,...d.parameters?.docs?.source},description:{story:`All three variants side-by-side for comparison.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  parameters: {
    layout: 'padded'
  },
  render: () => <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16
  }}>
      <Stat label="Deploy frequency" value={142} delta={12} hint="last 30 days" />
      <Stat label="Lead time" value="3.2" suffix=" h" delta={-22} inverted hint="commit → prod" />
      <Stat label="Change failure rate" value="7.4" suffix="%" delta={-3} hint="last 30 days" />
      <Stat label="MTTR" value={24} suffix=" min" delta={-18} inverted hint="mean time to restore" />
    </div>
}`,...f.parameters?.docs?.source},description:{story:`A row of DORA-metric tiles as they'd appear on an engineering dashboard.`,...f.parameters?.docs?.description}}},p=[`Default`,`WithDelta`,`Inverted`,`Hero`,`Inline`,`Variants`,`InContext`]}))();export{o as Default,l as Hero,f as InContext,u as Inline,c as Inverted,d as Variants,s as WithDelta,p as __namedExportsOrder,a as default};