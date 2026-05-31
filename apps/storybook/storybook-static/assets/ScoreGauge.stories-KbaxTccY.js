import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./jsx-runtime-CaZkqeYb.js";import{$i as n,t as r}from"./src-DgoylXRw.js";var i,a,o,s,c,l,u,d,f,p,m;e((()=>{r(),i=t(),a={title:`Elements/ScoreGauge`,component:n,tags:[`autodocs`],parameters:{layout:`centered`,docs:{description:{component:'An automotive-style risk gauge with three density variants: `speedo` (hero dial with needle + colored arc), `compact` (96px card ring), and `linear` (horizontal bar for table cells). Palette: green (low) → ember (caution) → amber (high) → red (critical). Pass `inverted` for "higher is better" metrics like Health or Reliability Index.'}}},args:{variant:`speedo`,value:340,min:0,max:1e3,label:`Change Risk Score`,ticks:!0,labels:!1,inverted:!1},argTypes:{variant:{control:`inline-radio`,options:[`speedo`,`compact`,`linear`]},value:{control:`number`},min:{control:`number`},max:{control:`number`},label:{control:`text`},ticks:{control:`boolean`},labels:{control:`boolean`},inverted:{control:`boolean`},size:{control:`number`},thickness:{control:`number`}}},o={},s={args:{value:820,label:`Change Risk Score`}},c={args:{value:500,labels:!0,label:`Change Risk Score`}},l={args:{variant:`compact`,value:88,max:100,label:`ETI`}},u={args:{variant:`linear`,value:340,max:1e3,label:`Change Risk Score`}},d={args:{value:820,max:1e3,label:`Reliability Index`,inverted:!0}},f={parameters:{layout:`padded`},render:()=>(0,i.jsxs)(`div`,{style:{display:`flex`,gap:32,alignItems:`flex-end`,flexWrap:`wrap`},children:[(0,i.jsx)(n,{variant:`speedo`,value:340,max:1e3,label:`Change Risk Score`,ticks:!0,labels:!0}),(0,i.jsx)(n,{variant:`compact`,value:340,max:1e3,label:`CRS`}),(0,i.jsx)(`div`,{style:{flex:`1 1 200px`},children:(0,i.jsx)(n,{variant:`linear`,value:340,max:1e3,label:`Change Risk Score`})})]})},p={parameters:{layout:`padded`},render:()=>(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`p`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,marginBottom:16},children:`pix-router · PR #7421`}),(0,i.jsxs)(`div`,{style:{display:`flex`,gap:32,alignItems:`flex-end`,flexWrap:`wrap`},children:[(0,i.jsx)(n,{variant:`speedo`,value:340,max:1e3,label:`Change Risk Score`,ticks:!0,labels:!0}),(0,i.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:12},children:[(0,i.jsx)(n,{variant:`compact`,value:88,max:100,label:`ETI`,inverted:!0}),(0,i.jsx)(n,{variant:`compact`,value:87,max:100,label:`Coverage`,inverted:!0})]}),(0,i.jsxs)(`div`,{style:{flex:`1 1 220px`,display:`flex`,flexDirection:`column`,gap:8},children:[(0,i.jsx)(n,{variant:`linear`,value:8,max:20,label:`Complexity`}),(0,i.jsx)(n,{variant:`linear`,value:11,max:30,label:`Cognitive`}),(0,i.jsx)(n,{variant:`linear`,value:64,max:100,label:`Maintainability`,inverted:!0})]})]})]})},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source},description:{story:`Speedo dial — healthy score in the green band.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    value: 820,
    label: 'Change Risk Score'
  }
}`,...s.parameters?.docs?.source},description:{story:`High-risk score — needle swings into the red band.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    value: 500,
    labels: true,
    label: 'Change Risk Score'
  }
}`,...c.parameters?.docs?.source},description:{story:`Speedo with segment labels (LOW / MED / CRIT).`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'compact',
    value: 88,
    max: 100,
    label: 'ETI'
  }
}`,...l.parameters?.docs?.source},description:{story:`Compact ring — fits inside a KPI card (96px).`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'linear',
    value: 340,
    max: 1000,
    label: 'Change Risk Score'
  }
}`,...u.parameters?.docs?.source},description:{story:`Linear bar — for table cells and inline contexts.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    value: 820,
    max: 1000,
    label: 'Reliability Index',
    inverted: true
  }
}`,...d.parameters?.docs?.source},description:{story:"`inverted` flips the palette so green is on the high end (Health Index).",...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  parameters: {
    layout: 'padded'
  },
  render: () => <div style={{
    display: 'flex',
    gap: 32,
    alignItems: 'flex-end',
    flexWrap: 'wrap'
  }}>
      <ScoreGauge variant="speedo" value={340} max={1000} label="Change Risk Score" ticks labels />
      <ScoreGauge variant="compact" value={340} max={1000} label="CRS" />
      <div style={{
      flex: '1 1 200px'
    }}>
        <ScoreGauge variant="linear" value={340} max={1000} label="Change Risk Score" />
      </div>
    </div>
}`,...f.parameters?.docs?.source},description:{story:`Three variants side-by-side for a single service's risk score.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  parameters: {
    layout: 'padded'
  },
  render: () => <div>
      <p style={{
      fontSize: 11,
      fontFamily: 'var(--font-mono)',
      color: 'var(--fg-muted)',
      marginBottom: 16
    }}>
        pix-router · PR #7421
      </p>
      <div style={{
      display: 'flex',
      gap: 32,
      alignItems: 'flex-end',
      flexWrap: 'wrap'
    }}>
        <ScoreGauge variant="speedo" value={340} max={1000} label="Change Risk Score" ticks labels />
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}>
          <ScoreGauge variant="compact" value={88} max={100} label="ETI" inverted />
          <ScoreGauge variant="compact" value={87} max={100} label="Coverage" inverted />
        </div>
        <div style={{
        flex: '1 1 220px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}>
          <ScoreGauge variant="linear" value={8} max={20} label="Complexity" />
          <ScoreGauge variant="linear" value={11} max={30} label="Cognitive" />
          <ScoreGauge variant="linear" value={64} max={100} label="Maintainability" inverted />
        </div>
      </div>
    </div>
}`,...p.parameters?.docs?.source},description:{story:`Service-detail panel — hero dial above compact cards for each dimension.`,...p.parameters?.docs?.description}}},m=[`Default`,`HighRisk`,`WithLabels`,`Compact`,`Linear`,`Inverted`,`AllVariants`,`InContext`]}))();export{f as AllVariants,l as Compact,o as Default,s as HighRisk,p as InContext,d as Inverted,u as Linear,c as WithLabels,m as __namedExportsOrder,a as default};