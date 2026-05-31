import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./jsx-runtime-CaZkqeYb.js";import{La as n,t as r}from"./src-DgoylXRw.js";var i,a,o,s,c,l,u,d,f,p,m;e((()=>{r(),i=t(),a=[`arrow`,`triangle`,`badge`,`bar`],o={title:`Primitives/Trend`,component:n,tags:[`autodocs`],parameters:{docs:{description:{component:"Up/down/flat trend indicator with delta. Four variants control the glyph and chrome; `inverted` flips the colour mapping for metrics where down is good (latency, error rate)."}}},args:{delta:12,unit:`%`,inverted:!1,variant:`arrow`,showZero:!0},argTypes:{delta:{control:`number`,description:`Numeric delta — positive = up, negative = down, 0 = flat.`},unit:{control:`text`,description:`Appended unit string ("%", "ms", "").`},inverted:{control:`boolean`,description:`Flip green/red — for latency, error-rate metrics.`},variant:{control:`inline-radio`,options:a},showZero:{control:`boolean`,description:`Render a flat indicator when delta is 0.`}}},s={},c={args:{delta:-8,unit:`%`}},l={args:{delta:0,unit:`%`}},u={args:{delta:-23,unit:` ms`,inverted:!0}},d={render:()=>(0,i.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:20,alignItems:`center`},children:a.map(e=>(0,i.jsxs)(`span`,{style:{display:`inline-flex`,alignItems:`center`,gap:8},children:[(0,i.jsx)(n,{delta:14,unit:`%`,variant:e}),(0,i.jsx)(`code`,{style:{fontSize:11,color:`var(--fg-muted)`,fontFamily:`var(--font-mono)`},children:e})]},e))})},f={render:()=>(0,i.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:10},children:[-15,0,15].map(e=>(0,i.jsx)(`div`,{style:{display:`flex`,gap:20,alignItems:`center`},children:a.map(t=>(0,i.jsx)(n,{delta:e,unit:`%`,variant:t},t))},e))})},p={render:()=>(0,i.jsx)(`div`,{style:{display:`flex`,gap:16,flexWrap:`wrap`},children:[{label:`Deploys / wk`,value:`4 280`,delta:8,unit:`%`},{label:`P95 Latency`,value:`142 ms`,delta:-23,unit:` ms`,inverted:!0},{label:`Coverage`,value:`88.3%`,delta:2,unit:` pts`},{label:`Incidents`,value:`3`,delta:-1,inverted:!0,unit:``}].map(({label:e,value:t,delta:r,unit:a=``,inverted:o=!1})=>(0,i.jsxs)(`div`,{style:{background:`var(--surface)`,border:`1px solid var(--border)`,borderRadius:8,padding:`14px 18px`,minWidth:130},children:[(0,i.jsx)(`div`,{style:{fontSize:11,color:`var(--fg-muted)`,marginBottom:4},children:e}),(0,i.jsx)(`div`,{style:{fontSize:22,fontWeight:600,marginBottom:6},children:t}),(0,i.jsx)(n,{delta:r,unit:a,inverted:o,variant:`badge`})]},e))})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source},description:{story:`Default arrow, positive delta.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    delta: -8,
    unit: '%'
  }
}`,...c.parameters?.docs?.source},description:{story:`Negative delta — red/down direction.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    delta: 0,
    unit: '%'
  }
}`,...l.parameters?.docs?.source},description:{story:`Zero delta — flat indicator.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    delta: -23,
    unit: ' ms',
    inverted: true
  }
}`,...u.parameters?.docs?.source},description:{story:`Inverted: down is good — for latency or error rate.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 20,
    alignItems: 'center'
  }}>
      {VARIANTS.map(v => <span key={v} style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }}>
          <Trend delta={14} unit="%" variant={v} />
          <code style={{
        fontSize: 11,
        color: 'var(--fg-muted)',
        fontFamily: 'var(--font-mono)'
      }}>{v}</code>
        </span>)}
    </div>
}`,...d.parameters?.docs?.source},description:{story:`All four variants with the same positive delta.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  }}>
      {([-15, 0, 15] as const).map(delta => <div key={delta} style={{
      display: 'flex',
      gap: 20,
      alignItems: 'center'
    }}>
          {VARIANTS.map(v => <Trend key={v} delta={delta} unit="%" variant={v} />)}
        </div>)}
    </div>
}`,...f.parameters?.docs?.source},description:{story:`Directional matrix — all directions × all variants.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap'
  }}>
      {[{
      label: 'Deploys / wk',
      value: '4 280',
      delta: 8,
      unit: '%'
    }, {
      label: 'P95 Latency',
      value: '142 ms',
      delta: -23,
      unit: ' ms',
      inverted: true
    }, {
      label: 'Coverage',
      value: '88.3%',
      delta: 2,
      unit: ' pts'
    }, {
      label: 'Incidents',
      value: '3',
      delta: -1,
      inverted: true,
      unit: ''
    }].map(({
      label,
      value,
      delta,
      unit = '',
      inverted = false
    }) => <div key={label} style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '14px 18px',
      minWidth: 130
    }}>
          <div style={{
        fontSize: 11,
        color: 'var(--fg-muted)',
        marginBottom: 4
      }}>{label}</div>
          <div style={{
        fontSize: 22,
        fontWeight: 600,
        marginBottom: 6
      }}>{value}</div>
          <Trend delta={delta} unit={unit} inverted={inverted} variant="badge" />
        </div>)}
    </div>
}`,...p.parameters?.docs?.source},description:{story:`Badge variant in a metric-card context.`,...p.parameters?.docs?.description}}},m=[`Default`,`Down`,`Flat`,`Inverted`,`AllVariants`,`Matrix`,`InContext`]}))();export{d as AllVariants,s as Default,c as Down,l as Flat,p as InContext,u as Inverted,f as Matrix,m as __namedExportsOrder,o as default};