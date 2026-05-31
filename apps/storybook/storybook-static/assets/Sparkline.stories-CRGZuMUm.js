import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./jsx-runtime-CaZkqeYb.js";import{Pa as n,t as r}from"./src-DgoylXRw.js";var i,a,o,s,c,l,u,d,f,p,m,h,g;e((()=>{r(),i=t(),a=[76,79,82,85,88,87,90],o=[72,74,77,79,81,80,83],s=[142,138,155,148,136,141,134],c=[5,4,6,3,2,4,1],l={title:`Primitives/Sparkline`,component:n,tags:[`autodocs`],parameters:{docs:{description:{component:"Minimal SVG line chart for inline trend display — no axes, no labels, just the shape of the data. The final point is marked with a dot; `fill` adds a translucent area under the curve."}}},args:{data:a,w:120,h:32,color:`var(--ember)`,fill:!0},argTypes:{data:{control:`object`,description:`Array of numbers — the raw series to plot.`},w:{control:`number`,description:`Width in px.`},h:{control:`number`,description:`Height in px.`},color:{control:`text`,description:`Stroke + fill colour (CSS value or custom property).`},fill:{control:`boolean`,description:`Show translucent area fill under the line.`}}},u={},d={args:{data:o,fill:!1}},f={args:{data:s.map(e=>-e).map(e=>e+160),color:`var(--success)`,fill:!0}},p={args:{data:a,w:240,h:56,fill:!0}},m={args:{data:c,w:64,h:20,color:`var(--danger)`,fill:!1}},h={render:()=>(0,i.jsx)(`div`,{style:{display:`flex`,gap:20,flexWrap:`wrap`},children:[{name:`Velocity`,data:a,delta:`+3`,color:`var(--ember)`},{name:`Quality`,data:o,delta:`+2`,color:`var(--success)`},{name:`Latency`,data:s,delta:`-8 ms`,color:`var(--info)`},{name:`Incidents`,data:c,delta:`-2`,color:`var(--danger)`}].map(({name:e,data:t,delta:r,color:a})=>(0,i.jsxs)(`div`,{style:{background:`var(--surface)`,border:`1px solid var(--border)`,borderRadius:8,padding:`12px 14px`,display:`flex`,flexDirection:`column`,gap:8,minWidth:140},children:[(0,i.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,i.jsx)(`span`,{style:{fontSize:11,color:`var(--fg-muted)`},children:e}),(0,i.jsx)(`span`,{style:{fontSize:10,fontFamily:`var(--font-mono)`,color:r.startsWith(`-`)&&e!==`Incidents`?`var(--danger)`:`var(--success)`},children:r})]}),(0,i.jsx)(n,{data:t,w:120,h:28,color:a,fill:!0})]},e))})},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{}`,...u.parameters?.docs?.source},description:{story:`Default — ember sparkline, fill on.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    data: QUALITY,
    fill: false
  }
}`,...d.parameters?.docs?.source},description:{story:`No fill — line only.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    data: LATENCY.map(v => -v).map(v => v + 160),
    color: 'var(--success)',
    fill: true
  }
}`,...f.parameters?.docs?.source},description:{story:`Custom colour — green for a healthy latency trend.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    data: VELOCITY,
    w: 240,
    h: 56,
    fill: true
  }
}`,...p.parameters?.docs?.source},description:{story:`Wide + tall — for a card with more space.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    data: INCIDENTS,
    w: 64,
    h: 20,
    color: 'var(--danger)',
    fill: false
  }
}`,...m.parameters?.docs?.source},description:{story:`Narrow + short — for a compact table cell.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    const pillars = [{
      name: 'Velocity',
      data: VELOCITY,
      delta: '+3',
      color: 'var(--ember)'
    }, {
      name: 'Quality',
      data: QUALITY,
      delta: '+2',
      color: 'var(--success)'
    }, {
      name: 'Latency',
      data: LATENCY,
      delta: '-8 ms',
      color: 'var(--info)'
    }, {
      name: 'Incidents',
      data: INCIDENTS,
      delta: '-2',
      color: 'var(--danger)'
    }];
    return <div style={{
      display: 'flex',
      gap: 20,
      flexWrap: 'wrap'
    }}>
        {pillars.map(({
        name,
        data,
        delta,
        color
      }) => <div key={name} style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        minWidth: 140
      }}>
            <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
              <span style={{
            fontSize: 11,
            color: 'var(--fg-muted)'
          }}>{name}</span>
              <span style={{
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            color: delta.startsWith('-') && name !== 'Incidents' ? 'var(--danger)' : 'var(--success)'
          }}>
                {delta}
              </span>
            </div>
            <Sparkline data={data} w={120} h={28} color={color} fill />
          </div>)}
      </div>;
  }
}`,...h.parameters?.docs?.source},description:{story:`ETI pillars row — four sparklines with labels, matching a real dashboard tile.`,...h.parameters?.docs?.description}}},g=[`Default`,`LineOnly`,`GreenLatency`,`Large`,`Tiny`,`InContext`]}))();export{u as Default,f as GreenLatency,h as InContext,p as Large,d as LineOnly,m as Tiny,g as __namedExportsOrder,l as default};