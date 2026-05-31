import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{Ci as r,Di as i,Fi as a,Li as o,Ni as s,Ti as c,Vi as l,bi as u,ji as d,ki as f,t as p,xi as m,zi as h}from"./src-DgoylXRw.js";var g,_,v,y,b,x,S,C,w,T,E;e((()=>{t(),p(),g=n(),_=[{month:`Jan`,requests:38200,errors:420},{month:`Feb`,requests:41500,errors:310},{month:`Mar`,requests:39800,errors:380},{month:`Apr`,requests:44200,errors:290},{month:`May`,requests:47600,errors:510},{month:`Jun`,requests:52100,errors:360}],v={fontFamily:`var(--font-mono)`,fontSize:12,fontWeight:500,fill:`var(--fg-muted)`},y={title:`Charts/ForgeChart`,component:u,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:"A card-style container that wraps any Recharts composition in a Forge-themed surface with an optional title, subtitle, and meta slot. It sets up <ResponsiveContainer> internally; pass a single Recharts chart element as `children`."}}},args:{title:`API Requests`,subtitle:`Monthly volume`,height:280,padding:18},argTypes:{height:{control:`number`},padding:{control:`number`},accent:{control:`color`},title:{control:`text`},subtitle:{control:`text`},meta:{control:`text`}}},b={render:e=>(0,g.jsx)(u,{...e,children:(0,g.jsxs)(i,{data:_,children:[(0,g.jsx)(o,{stroke:`var(--viz-grid)`,vertical:!1}),(0,g.jsx)(d,{dataKey:`month`,tick:v,tickLine:!1,axisLine:{stroke:`var(--viz-axis)`}}),(0,g.jsx)(f,{tick:v,tickLine:!1,axisLine:!1}),(0,g.jsx)(l,{content:(0,g.jsx)(m,{})}),(0,g.jsx)(a,{type:`monotone`,dataKey:`requests`,stroke:`var(--viz-cat-1)`,strokeWidth:2,dot:!1})]})})},x={args:{title:`Request volume`,subtitle:`Area fill`,meta:`last 6 months`},render:e=>(0,g.jsx)(u,{...e,children:(0,g.jsxs)(r,{data:_,children:[(0,g.jsx)(`defs`,{children:(0,g.jsxs)(`linearGradient`,{id:`areaFill`,x1:`0`,y1:`0`,x2:`0`,y2:`1`,children:[(0,g.jsx)(`stop`,{offset:`5%`,stopColor:`var(--viz-cat-1)`,stopOpacity:.35}),(0,g.jsx)(`stop`,{offset:`95%`,stopColor:`var(--viz-cat-1)`,stopOpacity:0})]})}),(0,g.jsx)(o,{stroke:`var(--viz-grid)`,vertical:!1}),(0,g.jsx)(d,{dataKey:`month`,tick:v,tickLine:!1,axisLine:{stroke:`var(--viz-axis)`}}),(0,g.jsx)(f,{tick:v,tickLine:!1,axisLine:!1}),(0,g.jsx)(l,{content:(0,g.jsx)(m,{})}),(0,g.jsx)(s,{type:`monotone`,dataKey:`requests`,stroke:`var(--viz-cat-1)`,strokeWidth:2,fill:`url(#areaFill)`,dot:!1})]})})},S={args:{title:`Requests vs Errors`,subtitle:`Grouped bars`,meta:`last 6 months`},render:e=>(0,g.jsx)(u,{...e,children:(0,g.jsxs)(c,{data:_,barSize:14,barGap:4,children:[(0,g.jsx)(o,{stroke:`var(--viz-grid)`,vertical:!1}),(0,g.jsx)(d,{dataKey:`month`,tick:v,tickLine:!1,axisLine:{stroke:`var(--viz-axis)`}}),(0,g.jsx)(f,{tick:v,tickLine:!1,axisLine:!1}),(0,g.jsx)(l,{content:(0,g.jsx)(m,{})}),(0,g.jsx)(h,{dataKey:`requests`,fill:`var(--viz-cat-1)`,radius:[3,3,0,0]}),(0,g.jsx)(h,{dataKey:`errors`,fill:`var(--viz-cat-5)`,radius:[3,3,0,0]})]})})},C={args:{title:`Deploy frequency`,accent:`var(--accent)`,meta:`↑ 12%`},render:e=>(0,g.jsx)(u,{...e,children:(0,g.jsxs)(i,{data:_,children:[(0,g.jsx)(o,{stroke:`var(--viz-grid)`,vertical:!1}),(0,g.jsx)(d,{dataKey:`month`,tick:v,tickLine:!1,axisLine:{stroke:`var(--viz-axis)`}}),(0,g.jsx)(f,{tick:v,tickLine:!1,axisLine:!1}),(0,g.jsx)(l,{content:(0,g.jsx)(m,{})}),(0,g.jsx)(a,{type:`monotone`,dataKey:`requests`,stroke:`var(--chart-accent, var(--viz-cat-1))`,strokeWidth:2,dot:!1})]})})},w={args:{title:void 0,subtitle:void 0,meta:void 0,height:200},render:e=>(0,g.jsx)(u,{...e,children:(0,g.jsxs)(i,{data:_,children:[(0,g.jsx)(o,{stroke:`var(--viz-grid)`,vertical:!1}),(0,g.jsx)(d,{dataKey:`month`,tick:v,tickLine:!1,axisLine:{stroke:`var(--viz-axis)`}}),(0,g.jsx)(f,{tick:v,tickLine:!1,axisLine:!1}),(0,g.jsx)(a,{type:`monotone`,dataKey:`requests`,stroke:`var(--viz-cat-1)`,strokeWidth:2,dot:!1})]})})},T={parameters:{layout:`padded`},render:()=>(0,g.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:16},children:[(0,g.jsx)(u,{title:`API Requests`,subtitle:`Line`,meta:`6 mo`,height:220,children:(0,g.jsxs)(i,{data:_,children:[(0,g.jsx)(o,{stroke:`var(--viz-grid)`,vertical:!1}),(0,g.jsx)(d,{dataKey:`month`,tick:v,tickLine:!1,axisLine:{stroke:`var(--viz-axis)`}}),(0,g.jsx)(f,{tick:v,tickLine:!1,axisLine:!1}),(0,g.jsx)(l,{content:(0,g.jsx)(m,{})}),(0,g.jsx)(a,{type:`monotone`,dataKey:`requests`,stroke:`var(--viz-cat-1)`,strokeWidth:2,dot:!1})]})}),(0,g.jsx)(u,{title:`Error count`,subtitle:`Bar`,meta:`6 mo`,height:220,children:(0,g.jsxs)(c,{data:_,barSize:18,children:[(0,g.jsx)(o,{stroke:`var(--viz-grid)`,vertical:!1}),(0,g.jsx)(d,{dataKey:`month`,tick:v,tickLine:!1,axisLine:{stroke:`var(--viz-axis)`}}),(0,g.jsx)(f,{tick:v,tickLine:!1,axisLine:!1}),(0,g.jsx)(l,{content:(0,g.jsx)(m,{})}),(0,g.jsx)(h,{dataKey:`errors`,fill:`var(--viz-cat-5)`,radius:[3,3,0,0]})]})})]})},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: args => <ForgeChart {...args}>
      <Recharts.LineChart data={MONTHLY}>
        <Recharts.CartesianGrid stroke="var(--viz-grid)" vertical={false} />
        <Recharts.XAxis dataKey="month" tick={TICK_STYLE} tickLine={false} axisLine={{
        stroke: 'var(--viz-axis)'
      }} />
        <Recharts.YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} />
        <Recharts.Tooltip content={<ForgeTooltipContent />} />
        <Recharts.Line type="monotone" dataKey="requests" stroke="var(--viz-cat-1)" strokeWidth={2} dot={false} />
      </Recharts.LineChart>
    </ForgeChart>
}`,...b.parameters?.docs?.source},description:{story:`Default — a simple line chart of monthly API requests.`,...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Request volume',
    subtitle: 'Area fill',
    meta: 'last 6 months'
  },
  render: args => <ForgeChart {...args}>
      <Recharts.AreaChart data={MONTHLY}>
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--viz-cat-1)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--viz-cat-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Recharts.CartesianGrid stroke="var(--viz-grid)" vertical={false} />
        <Recharts.XAxis dataKey="month" tick={TICK_STYLE} tickLine={false} axisLine={{
        stroke: 'var(--viz-axis)'
      }} />
        <Recharts.YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} />
        <Recharts.Tooltip content={<ForgeTooltipContent />} />
        <Recharts.Area type="monotone" dataKey="requests" stroke="var(--viz-cat-1)" strokeWidth={2} fill="url(#areaFill)" dot={false} />
      </Recharts.AreaChart>
    </ForgeChart>
}`,...x.parameters?.docs?.source},description:{story:`Area chart — cumulative area fill emphasises growth over time.`,...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Requests vs Errors',
    subtitle: 'Grouped bars',
    meta: 'last 6 months'
  },
  render: args => <ForgeChart {...args}>
      <Recharts.BarChart data={MONTHLY} barSize={14} barGap={4}>
        <Recharts.CartesianGrid stroke="var(--viz-grid)" vertical={false} />
        <Recharts.XAxis dataKey="month" tick={TICK_STYLE} tickLine={false} axisLine={{
        stroke: 'var(--viz-axis)'
      }} />
        <Recharts.YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} />
        <Recharts.Tooltip content={<ForgeTooltipContent />} />
        <Recharts.Bar dataKey="requests" fill="var(--viz-cat-1)" radius={[3, 3, 0, 0]} />
        <Recharts.Bar dataKey="errors" fill="var(--viz-cat-5)" radius={[3, 3, 0, 0]} />
      </Recharts.BarChart>
    </ForgeChart>
}`,...S.parameters?.docs?.source},description:{story:`Bar chart — grouped columns for requests vs errors side-by-side.`,...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Deploy frequency',
    accent: 'var(--accent)',
    meta: '↑ 12%'
  },
  render: args => <ForgeChart {...args}>
      <Recharts.LineChart data={MONTHLY}>
        <Recharts.CartesianGrid stroke="var(--viz-grid)" vertical={false} />
        <Recharts.XAxis dataKey="month" tick={TICK_STYLE} tickLine={false} axisLine={{
        stroke: 'var(--viz-axis)'
      }} />
        <Recharts.YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} />
        <Recharts.Tooltip content={<ForgeTooltipContent />} />
        <Recharts.Line type="monotone" dataKey="requests" stroke="var(--chart-accent, var(--viz-cat-1))" strokeWidth={2} dot={false} />
      </Recharts.LineChart>
    </ForgeChart>
}`,...C.parameters?.docs?.source},description:{story:`Custom accent — overrides the chart-accent CSS variable to ember.`,...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    title: undefined,
    subtitle: undefined,
    meta: undefined,
    height: 200
  },
  render: args => <ForgeChart {...args}>
      <Recharts.LineChart data={MONTHLY}>
        <Recharts.CartesianGrid stroke="var(--viz-grid)" vertical={false} />
        <Recharts.XAxis dataKey="month" tick={TICK_STYLE} tickLine={false} axisLine={{
        stroke: 'var(--viz-axis)'
      }} />
        <Recharts.YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} />
        <Recharts.Line type="monotone" dataKey="requests" stroke="var(--viz-cat-1)" strokeWidth={2} dot={false} />
      </Recharts.LineChart>
    </ForgeChart>
}`,...w.parameters?.docs?.source},description:{story:`No header — bare chart surface with just the chart body, no title or meta.`,...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  parameters: {
    layout: 'padded'
  },
  render: () => <div style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16
  }}>
      <ForgeChart title="API Requests" subtitle="Line" meta="6 mo" height={220}>
        <Recharts.LineChart data={MONTHLY}>
          <Recharts.CartesianGrid stroke="var(--viz-grid)" vertical={false} />
          <Recharts.XAxis dataKey="month" tick={TICK_STYLE} tickLine={false} axisLine={{
          stroke: 'var(--viz-axis)'
        }} />
          <Recharts.YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} />
          <Recharts.Tooltip content={<ForgeTooltipContent />} />
          <Recharts.Line type="monotone" dataKey="requests" stroke="var(--viz-cat-1)" strokeWidth={2} dot={false} />
        </Recharts.LineChart>
      </ForgeChart>

      <ForgeChart title="Error count" subtitle="Bar" meta="6 mo" height={220}>
        <Recharts.BarChart data={MONTHLY} barSize={18}>
          <Recharts.CartesianGrid stroke="var(--viz-grid)" vertical={false} />
          <Recharts.XAxis dataKey="month" tick={TICK_STYLE} tickLine={false} axisLine={{
          stroke: 'var(--viz-axis)'
        }} />
          <Recharts.YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} />
          <Recharts.Tooltip content={<ForgeTooltipContent />} />
          <Recharts.Bar dataKey="errors" fill="var(--viz-cat-5)" radius={[3, 3, 0, 0]} />
        </Recharts.BarChart>
      </ForgeChart>
    </div>
}`,...T.parameters?.docs?.source},description:{story:`In context — a two-column chart grid as it would appear on a DORA dashboard.`,...T.parameters?.docs?.description}}},E=[`Default`,`AreaChart`,`BarChart`,`WithAccent`,`NoHeader`,`InContext`]}))();export{x as AreaChart,S as BarChart,b as Default,T as InContext,w as NoHeader,C as WithAccent,E as __namedExportsOrder,y as default};