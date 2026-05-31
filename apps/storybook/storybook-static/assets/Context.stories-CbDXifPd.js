import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{Sr as r,Vn as i,br as a,t as o,xr as s}from"./src-DgoylXRw.js";var c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E;e((()=>{t(),o(),c=n(),l={title:`AI/Context`,component:a,tags:[`autodocs`],parameters:{docs:{description:{component:'Context-window usage indicator with two visual forms: `variant="gauge"` (default) renders a radial SVG ring + token counts; `variant="bar"` renders a linear progress bar; `variant="compact"` renders the radial + percent only for tight rows. Tone shifts at configurable mid and warn thresholds. `ContextGauge` and `ContextBar` are `@deprecated` wrappers for backward-compat.'}}},args:{used:24e3,total:128e3,variant:`gauge`,size:18,label:!0,thresholdMid:.6,thresholdWarn:.85},argTypes:{used:{control:`number`},total:{control:`number`},variant:{control:`inline-radio`,options:[`gauge`,`bar`,`compact`]},size:{control:`number`,if:{arg:`variant`,neq:`bar`}},label:{control:`boolean`,if:{arg:`variant`,eq:`gauge`}},files:{control:`number`},thresholdMid:{control:`number`},thresholdWarn:{control:`number`}}},u={},d={name:`All variants`,render:()=>(0,c.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:20,maxWidth:400},children:[(0,c.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:12},children:[(0,c.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`,width:80},children:`gauge`}),(0,c.jsx)(a,{used:24e3,total:128e3,variant:`gauge`})]}),(0,c.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:12},children:[(0,c.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`,width:80},children:`bar`}),(0,c.jsx)(a,{used:24e3,total:128e3,variant:`bar`})]}),(0,c.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:12},children:[(0,c.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`,width:80},children:`compact`}),(0,c.jsx)(a,{used:24e3,total:128e3,variant:`compact`})]})]})},f={name:`All tones (ok / mid / warn)`,render:()=>(0,c.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:24},children:[`gauge`,`bar`,`compact`].map(e=>(0,c.jsxs)(`div`,{children:[(0,c.jsx)(`div`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-faint)`,marginBottom:8,textTransform:`uppercase`,letterSpacing:`0.08em`},children:e}),(0,c.jsxs)(`div`,{style:{display:`flex`,gap:20,alignItems:`center`,flexWrap:`wrap`},children:[(0,c.jsx)(a,{used:2e4,total:128e3,variant:e}),(0,c.jsx)(a,{used:8e4,total:128e3,variant:e}),(0,c.jsx)(a,{used:112e3,total:128e3,variant:e})]})]},e))})},p={name:`Gauge — mid zone`,args:{used:8e4,total:128e3,variant:`gauge`}},m={name:`Gauge — warning zone`,args:{used:112e3,total:128e3,variant:`gauge`}},h={name:`Gauge — large (32px)`,args:{used:6e4,total:128e3,variant:`gauge`,size:32}},g={name:`Gauge — with files`,args:{used:24e3,total:128e3,variant:`gauge`,files:3}},_={name:`Bar — mid zone`,args:{used:8e4,total:128e3,variant:`bar`}},v={name:`Bar — warning zone`,args:{used:112e3,total:128e3,variant:`bar`}},y={name:`Bar — with files`,args:{used:24e3,total:128e3,variant:`bar`,files:5}},b={name:`Compact — percent only`,args:{used:6e4,total:128e3,variant:`compact`}},x={name:`Near full (99%)`,args:{used:127e3,total:128e3,variant:`gauge`}},S={name:`In PromptInput footer`,render:()=>(0,c.jsx)(`div`,{style:{maxWidth:640},children:(0,c.jsx)(i,{value:``,onChange:()=>{},onSubmit:()=>{},modelValue:`forge-sonnet-4-6`,onModelChange:()=>{},contextSlot:(0,c.jsx)(a,{used:142e3,total:2e5,files:3,variant:`gauge`}),placeholder:`Ask anything…`})})},C={name:`Bar in PromptInput footer`,render:()=>(0,c.jsx)(`div`,{style:{maxWidth:640},children:(0,c.jsx)(i,{value:``,onChange:()=>{},onSubmit:()=>{},contextSlot:(0,c.jsx)(a,{used:8e4,total:128e3,variant:`bar`}),placeholder:`Ask anything…`})})},w={name:`ContextGauge (deprecated alias)`,render:()=>(0,c.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:8},children:[(0,c.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:`ContextGauge (deprecated) — forwards to Context variant="gauge"`}),(0,c.jsx)(r,{used:24e3,total:128e3})]})},T={name:`ContextBar (deprecated alias)`,render:()=>(0,c.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:8},children:[(0,c.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:`ContextBar (deprecated) — forwards to Context variant="bar"`}),(0,c.jsx)(s,{used:24e3,total:128e3})]})},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{}`,...u.parameters?.docs?.source},description:{story:`Default gauge — normal usage (ok tone).`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: 'All variants',
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    maxWidth: 400
  }}>
      <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }}>
        <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)',
        width: 80
      }}>gauge</span>
        <Context used={24000} total={128000} variant="gauge" />
      </div>
      <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }}>
        <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)',
        width: 80
      }}>bar</span>
        <Context used={24000} total={128000} variant="bar" />
      </div>
      <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }}>
        <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)',
        width: 80
      }}>compact</span>
        <Context used={24000} total={128000} variant="compact" />
      </div>
    </div>
}`,...d.parameters?.docs?.source},description:{story:`All variants side by side — gauge, bar, compact.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: 'All tones (ok / mid / warn)',
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 24
  }}>
      {(['gauge', 'bar', 'compact'] as const).map(v => <div key={v}>
          <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-faint)',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: '0.08em'
      }}>{v}</div>
          <div style={{
        display: 'flex',
        gap: 20,
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
            <Context used={20000} total={128000} variant={v} />
            <Context used={80000} total={128000} variant={v} />
            <Context used={112000} total={128000} variant={v} />
          </div>
        </div>)}
    </div>
}`,...f.parameters?.docs?.source},description:{story:`All three tones — ok / mid / warn — for each variant.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: 'Gauge — mid zone',
  args: {
    used: 80000,
    total: 128000,
    variant: 'gauge'
  }
}`,...p.parameters?.docs?.source},description:{story:`Gauge — mid zone (approaching 60%).`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: 'Gauge — warning zone',
  args: {
    used: 112000,
    total: 128000,
    variant: 'gauge'
  }
}`,...m.parameters?.docs?.source},description:{story:`Gauge — warning zone (above 85%).`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: 'Gauge — large (32px)',
  args: {
    used: 60000,
    total: 128000,
    variant: 'gauge',
    size: 32
  }
}`,...h.parameters?.docs?.source},description:{story:`Gauge — large 32px radial for prominent placement.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: 'Gauge — with files',
  args: {
    used: 24000,
    total: 128000,
    variant: 'gauge',
    files: 3
  }
}`,...g.parameters?.docs?.source},description:{story:`Gauge — with file count.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: 'Bar — mid zone',
  args: {
    used: 80000,
    total: 128000,
    variant: 'bar'
  }
}`,..._.parameters?.docs?.source},description:{story:`Bar — mid zone.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: 'Bar — warning zone',
  args: {
    used: 112000,
    total: 128000,
    variant: 'bar'
  }
}`,...v.parameters?.docs?.source},description:{story:`Bar — warning zone.`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: 'Bar — with files',
  args: {
    used: 24000,
    total: 128000,
    variant: 'bar',
    files: 5
  }
}`,...y.parameters?.docs?.source},description:{story:`Bar — with file count.`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: 'Compact — percent only',
  args: {
    used: 60000,
    total: 128000,
    variant: 'compact'
  }
}`,...b.parameters?.docs?.source},description:{story:`Compact — radial + percent only.`,...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: 'Near full (99%)',
  args: {
    used: 127000,
    total: 128000,
    variant: 'gauge'
  }
}`,...x.parameters?.docs?.source},description:{story:`Near-full — 99% used.`,...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: 'In PromptInput footer',
  render: () => <div style={{
    maxWidth: 640
  }}>
      <PromptInput value="" onChange={() => {}} onSubmit={() => {}} modelValue="forge-sonnet-4-6" onModelChange={() => {}} contextSlot={<Context used={142000} total={200000} files={3} variant="gauge" />} placeholder="Ask anything…" />
    </div>
}`,...S.parameters?.docs?.source},description:{story:`Embedded in PromptInput — the canonical placement.`,...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  name: 'Bar in PromptInput footer',
  render: () => <div style={{
    maxWidth: 640
  }}>
      <PromptInput value="" onChange={() => {}} onSubmit={() => {}} contextSlot={<Context used={80000} total={128000} variant="bar" />} placeholder="Ask anything…" />
    </div>
}`,...C.parameters?.docs?.source},description:{story:`Bar in PromptInput — horizontal variant for wide composer footers.`,...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: 'ContextGauge (deprecated alias)',
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  }}>
      <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--fg-muted)'
    }}>
        ContextGauge (deprecated) — forwards to Context variant="gauge"
      </span>
      <ContextGauge used={24000} total={128000} />
    </div>
}`,...w.parameters?.docs?.source},description:{story:`ContextGauge — @deprecated wrapper. Renders identically to Context variant="gauge".`,...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: 'ContextBar (deprecated alias)',
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  }}>
      <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--fg-muted)'
    }}>
        ContextBar (deprecated) — forwards to Context variant="bar"
      </span>
      <ContextBar used={24000} total={128000} />
    </div>
}`,...T.parameters?.docs?.source},description:{story:`ContextBar — @deprecated wrapper. Renders identically to Context variant="bar".`,...T.parameters?.docs?.description}}},E=[`Default`,`AllVariants`,`AllTones`,`GaugeMid`,`GaugeWarn`,`GaugeLarge`,`GaugeWithFiles`,`BarMid`,`BarWarn`,`BarWithFiles`,`Compact`,`NearFull`,`InPromptInput`,`BarInPromptInput`,`ContextGaugeLegacy`,`ContextBarLegacy`]}))();export{f as AllTones,d as AllVariants,C as BarInPromptInput,_ as BarMid,v as BarWarn,y as BarWithFiles,b as Compact,T as ContextBarLegacy,w as ContextGaugeLegacy,u as Default,h as GaugeLarge,p as GaugeMid,m as GaugeWarn,g as GaugeWithFiles,S as InPromptInput,x as NearFull,E as __namedExportsOrder,l as default};