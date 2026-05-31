import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{Di as r,Fi as i,Li as a,Vi as o,bi as s,ji as c,ki as l,t as u,yi as d}from"./src-DgoylXRw.js";var f,p,m,h,g,_,v,y,b,x;e((()=>{t(),u(),f=n(),p=[{label:`Requests`,color:`var(--viz-cat-1)`},{label:`Errors`,color:`var(--viz-cat-5)`},{label:`Latency`,color:`var(--viz-cat-3)`}],m=[{month:`Jan`,requests:38200,errors:420,latency:142},{month:`Feb`,requests:41500,errors:310,latency:131},{month:`Mar`,requests:39800,errors:380,latency:138},{month:`Apr`,requests:44200,errors:290,latency:125},{month:`May`,requests:47600,errors:510,latency:156},{month:`Jun`,requests:52100,errors:360,latency:118}],h={fontFamily:`var(--font-mono)`,fontSize:12,fontWeight:500,fill:`var(--fg-muted)`},g={title:`Charts/ChartLegend`,component:d,tags:[`autodocs`],parameters:{layout:`centered`,docs:{description:{component:`A horizontal row of colour-swatch + label pairs for labelling chart series. Intended for use above or below a <ForgeChart> when the built-in Recharts legend does not match Forge typography.`}}},args:{items:p},argTypes:{items:{control:`object`}}},_={},v={args:{items:[{label:`P95 latency`,color:`var(--viz-cat-1)`},{label:`P50 latency`,color:`var(--viz-cat-2)`}]}},y={args:{items:[{label:`Series A`},{label:`Series B`},{label:`Series C`}]}},b={parameters:{layout:`padded`},render:()=>(0,f.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:8},children:[(0,f.jsx)(d,{items:p}),(0,f.jsx)(s,{title:`Service health`,height:240,children:(0,f.jsxs)(r,{data:m,children:[(0,f.jsx)(a,{stroke:`var(--viz-grid)`,vertical:!1}),(0,f.jsx)(c,{dataKey:`month`,tick:h,tickLine:!1,axisLine:{stroke:`var(--viz-axis)`}}),(0,f.jsx)(l,{tick:h,tickLine:!1,axisLine:!1}),(0,f.jsx)(o,{}),(0,f.jsx)(i,{type:`monotone`,dataKey:`requests`,stroke:`var(--viz-cat-1)`,strokeWidth:2,dot:!1}),(0,f.jsx)(i,{type:`monotone`,dataKey:`errors`,stroke:`var(--viz-cat-5)`,strokeWidth:2,dot:!1}),(0,f.jsx)(i,{type:`monotone`,dataKey:`latency`,stroke:`var(--viz-cat-3)`,strokeWidth:2,dot:!1})]})})]})},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{}`,..._.parameters?.docs?.source},description:{story:`Default — three series swatches using viz-cat tokens.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      label: 'P95 latency',
      color: 'var(--viz-cat-1)'
    }, {
      label: 'P50 latency',
      color: 'var(--viz-cat-2)'
    }]
  }
}`,...v.parameters?.docs?.source},description:{story:`Two-item legend for a simpler single-comparison chart.`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      label: 'Series A'
    }, {
      label: 'Series B'
    }, {
      label: 'Series C'
    }]
  }
}`,...y.parameters?.docs?.source},description:{story:`Without explicit colours — swatches fall back to the browser default.`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  parameters: {
    layout: 'padded'
  },
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  }}>
      <ChartLegend items={ITEMS} />
      <ForgeChart title="Service health" height={240}>
        <Recharts.LineChart data={MONTHLY}>
          <Recharts.CartesianGrid stroke="var(--viz-grid)" vertical={false} />
          <Recharts.XAxis dataKey="month" tick={TICK_STYLE} tickLine={false} axisLine={{
          stroke: 'var(--viz-axis)'
        }} />
          <Recharts.YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} />
          <Recharts.Tooltip />
          <Recharts.Line type="monotone" dataKey="requests" stroke="var(--viz-cat-1)" strokeWidth={2} dot={false} />
          <Recharts.Line type="monotone" dataKey="errors" stroke="var(--viz-cat-5)" strokeWidth={2} dot={false} />
          <Recharts.Line type="monotone" dataKey="latency" stroke="var(--viz-cat-3)" strokeWidth={2} dot={false} />
        </Recharts.LineChart>
      </ForgeChart>
    </div>
}`,...b.parameters?.docs?.source},description:{story:`In context — legend paired with a ForgeChart multi-series line chart.`,...b.parameters?.docs?.description}}},x=[`Default`,`TwoSeries`,`NoColor`,`InContext`]}))();export{_ as Default,b as InContext,y as NoColor,v as TwoSeries,x as __namedExportsOrder,g as default};