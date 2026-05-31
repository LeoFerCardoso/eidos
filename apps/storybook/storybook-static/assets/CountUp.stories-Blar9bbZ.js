import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./jsx-runtime-CaZkqeYb.js";import{t as n,wa as r}from"./src-DgoylXRw.js";var i,a,o,s,c,l,u,d,f,p;e((()=>{n(),i=t(),a={title:`Primitives/CountUp`,component:r,tags:[`autodocs`],parameters:{docs:{description:{component:"An animated counter that eases from `from` (default 0) to `to` when it scrolls into view. Uses an IntersectionObserver — the animation fires exactly once; reset by changing the React `key`. Under `prefers-reduced-motion` the duration collapses to 0 and the final value paints instantly. `Counter` is a `@deprecated` back-compat alias."}}},args:{to:4280,from:0,suffix:``,prefix:``,dur:1200,decimals:0},argTypes:{to:{control:`number`,description:`Target numeric value to count up to.`},from:{control:`number`,description:`Starting value (default 0). Useful for partial-progress reads.`},suffix:{control:`text`,description:`Appended string after the number (e.g. "%", " ms").`},prefix:{control:`text`,description:`Prepended string before the number (e.g. "$", "~").`},dur:{control:`number`,description:`Animation duration in milliseconds (collapses to 0 under prefers-reduced-motion).`},decimals:{control:`number`,description:`Number of decimal places to show.`}}},o={},s={args:{to:92.4,suffix:`%`,decimals:1,dur:900}},c={args:{to:1847320,prefix:`R$ `,decimals:0,dur:1400}},l={args:{to:142,suffix:` ms`,decimals:0,dur:800}},u={args:{from:50,to:80,suffix:`%`,decimals:0,dur:900}},d={args:{to:4280,dur:0},parameters:{docs:{description:{story:"When `dur` is 0 (or prefers-reduced-motion is active) the final value paints immediately. Use this story to verify the layout is stable with no animation."}}}},f={render:()=>(0,i.jsx)(`div`,{style:{display:`flex`,gap:16,flexWrap:`wrap`},children:[{label:`Total Deploys`,to:4280,suffix:``},{label:`Coverage`,to:88.3,suffix:`%`,decimals:1},{label:`P95 Latency`,to:142,suffix:` ms`},{label:`SAST Issues`,to:1,suffix:``}].map(({label:e,to:t,suffix:n=``,decimals:a=0})=>(0,i.jsxs)(`div`,{style:{background:`var(--surface)`,border:`1px solid var(--border)`,borderRadius:8,padding:`16px 20px`,minWidth:140},children:[(0,i.jsx)(`div`,{style:{fontSize:11,color:`var(--fg-muted)`,marginBottom:6},children:e}),(0,i.jsx)(`div`,{style:{fontSize:24,fontWeight:600},children:(0,i.jsx)(r,{to:t,suffix:n,decimals:a,dur:900})})]},e))})},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source},description:{story:`Plain integer counter — the most common use.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    to: 92.4,
    suffix: '%',
    decimals: 1,
    dur: 900
  }
}`,...s.parameters?.docs?.source},description:{story:`Percentage with a suffix — typical for coverage or success-rate cards.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    to: 1847320,
    prefix: 'R$ ',
    decimals: 0,
    dur: 1400
  }
}`,...c.parameters?.docs?.source},description:{story:`Currency prefix — for revenue or cost tiles.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    to: 142,
    suffix: ' ms',
    decimals: 0,
    dur: 800
  }
}`,...l.parameters?.docs?.source},description:{story:`Latency in milliseconds.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    from: 50,
    to: 80,
    suffix: '%',
    decimals: 0,
    dur: 900
  }
}`,...u.parameters?.docs?.source},description:{story:`Non-zero start — animate from 50 to 80 (e.g. a progress read that resumes).`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    to: 4280,
    dur: 0
  },
  parameters: {
    docs: {
      description: {
        story: 'When \`dur\` is 0 (or prefers-reduced-motion is active) the final value paints immediately. ' + 'Use this story to verify the layout is stable with no animation.'
      }
    }
  }
}`,...d.parameters?.docs?.source},description:{story:`Instant render — simulates prefers-reduced-motion by collapsing dur to 0.
In real usage this is automatic; here we force it for visual regression.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap'
  }}>
      {[{
      label: 'Total Deploys',
      to: 4280,
      suffix: ''
    }, {
      label: 'Coverage',
      to: 88.3,
      suffix: '%',
      decimals: 1
    }, {
      label: 'P95 Latency',
      to: 142,
      suffix: ' ms'
    }, {
      label: 'SAST Issues',
      to: 1,
      suffix: ''
    }].map(({
      label,
      to,
      suffix = '',
      decimals = 0
    }) => <div key={label} style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '16px 20px',
      minWidth: 140
    }}>
          <div style={{
        fontSize: 11,
        color: 'var(--fg-muted)',
        marginBottom: 6
      }}>{label}</div>
          <div style={{
        fontSize: 24,
        fontWeight: 600
      }}>
            <CountUp to={to} suffix={suffix} decimals={decimals} dur={900} />
          </div>
        </div>)}
    </div>
}`,...f.parameters?.docs?.source},description:{story:`Four metric cards as they appear in a dashboard KPI row.`,...f.parameters?.docs?.description}}},p=[`Default`,`Percentage`,`Currency`,`Latency`,`FromNonZero`,`ReducedMotion`,`InContext`]}))();export{c as Currency,o as Default,u as FromNonZero,f as InContext,l as Latency,s as Percentage,d as ReducedMotion,p as __namedExportsOrder,a as default};