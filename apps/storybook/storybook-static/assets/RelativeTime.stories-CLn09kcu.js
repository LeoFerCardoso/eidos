import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./jsx-runtime-CaZkqeYb.js";import{Ma as n,t as r}from"./src-DgoylXRw.js";var i,a,o,s,c,l,u,d,f,p,m,h;e((()=>{r(),i=t(),a=Date.now(),o=e=>new Date(a-e*60*1e3),s=e=>new Date(a-e*3600*1e3),c=e=>new Date(a-e*86400*1e3),l={title:`Primitives/RelativeTime`,component:n,tags:[`autodocs`],parameters:{docs:{description:{component:'Humanised relative timestamp ("3 min ago") inside a `<time>` element. Ticks every 60 s to stay fresh; `absolute` mode appends the formatted date, `tooltip` wraps in a Forge `.tt` with the full datetime on hover.'}}},args:{value:o(3),absolute:!1,tooltip:!1,tooltipSide:`top`},argTypes:{absolute:{control:`boolean`,description:`Show absolute date alongside the relative phrase.`},tooltip:{control:`boolean`,description:`Wrap in a Forge tooltip showing the full datetime.`},tooltipSide:{control:`inline-radio`,options:[`top`,`bottom`,`left`,`right`]}}},u={},d={args:{value:s(2),absolute:!0}},f={args:{value:c(3),tooltip:!0,tooltipSide:`top`}},p={render:()=>(0,i.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:8},children:[{label:`Just now`,value:new Date(a-2e3)},{label:`3 min ago`,value:o(3)},{label:`47 min ago`,value:o(47)},{label:`2 h ago`,value:s(2)},{label:`3 d ago`,value:c(3)},{label:`2 w ago`,value:c(14)}].map(({label:e,value:t})=>(0,i.jsxs)(`div`,{style:{display:`flex`,gap:24,alignItems:`center`},children:[(0,i.jsx)(`span`,{style:{fontSize:11,color:`var(--fg-muted)`,width:80},children:e}),(0,i.jsx)(n,{value:t})]},e))})},m={render:()=>(0,i.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:0},children:[{service:`pix-router`,id:`D-9182`,started:o(14)},{service:`fraud-engine`,id:`D-9181`,started:o(47)},{service:`identity-svc`,id:`D-9180`,started:s(2)},{service:`bureau-gateway`,id:`D-9179`,started:s(3)},{service:`ledger-svc`,id:`D-9178`,started:s(1)}].map(({service:e,id:t,started:r})=>(0,i.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:16,padding:`8px 0`,borderBottom:`1px solid var(--border)`,fontSize:13},children:[(0,i.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,width:160},children:e}),(0,i.jsx)(`span`,{style:{color:`var(--fg-muted)`,fontFamily:`var(--font-mono)`,fontSize:11},children:t}),(0,i.jsx)(`span`,{style:{marginInlineStart:`auto`,fontSize:12,color:`var(--fg-muted)`},children:(0,i.jsx)(n,{value:r,tooltip:!0})})]},t))})},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{}`,...u.parameters?.docs?.source},description:{story:`Default — relative only, 3 minutes ago.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    value: hours(2),
    absolute: true
  }
}`,...d.parameters?.docs?.source},description:{story:`Absolute mode — shows formatted date + relative phrase.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    value: days(3),
    tooltip: true,
    tooltipSide: 'top'
  }
}`,...f.parameters?.docs?.source},description:{story:`Tooltip — hover to see full datetime.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  }}>
      {[{
      label: 'Just now',
      value: new Date(NOW - 2000)
    }, {
      label: '3 min ago',
      value: mins(3)
    }, {
      label: '47 min ago',
      value: mins(47)
    }, {
      label: '2 h ago',
      value: hours(2)
    }, {
      label: '3 d ago',
      value: days(3)
    }, {
      label: '2 w ago',
      value: days(14)
    }].map(({
      label,
      value
    }) => <div key={label} style={{
      display: 'flex',
      gap: 24,
      alignItems: 'center'
    }}>
          <span style={{
        fontSize: 11,
        color: 'var(--fg-muted)',
        width: 80
      }}>{label}</span>
          <RelativeTime value={value} />
        </div>)}
    </div>
}`,...p.parameters?.docs?.source},description:{story:`Range of time distances to verify the formatting thresholds.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const rows = [{
      service: 'pix-router',
      id: 'D-9182',
      started: mins(14)
    }, {
      service: 'fraud-engine',
      id: 'D-9181',
      started: mins(47)
    }, {
      service: 'identity-svc',
      id: 'D-9180',
      started: hours(2)
    }, {
      service: 'bureau-gateway',
      id: 'D-9179',
      started: hours(3)
    }, {
      service: 'ledger-svc',
      id: 'D-9178',
      started: hours(1)
    }];
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 0
    }}>
        {rows.map(({
        service,
        id,
        started
      }) => <div key={id} style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '8px 0',
        borderBottom: '1px solid var(--border)',
        fontSize: 13
      }}>
            <span style={{
          fontFamily: 'var(--font-mono)',
          width: 160
        }}>{service}</span>
            <span style={{
          color: 'var(--fg-muted)',
          fontFamily: 'var(--font-mono)',
          fontSize: 11
        }}>{id}</span>
            <span style={{
          marginInlineStart: 'auto',
          fontSize: 12,
          color: 'var(--fg-muted)'
        }}>
                <RelativeTime value={started} tooltip />
              </span>
          </div>)}
      </div>;
  }
}`,...m.parameters?.docs?.source},description:{story:`In a deploy log — service name + deploy ID + timestamp.`,...m.parameters?.docs?.description}}},h=[`Default`,`WithAbsolute`,`WithTooltip`,`TimeRange`,`InContext`]}))();export{u as Default,m as InContext,p as TimeRange,d as WithAbsolute,f as WithTooltip,h as __namedExportsOrder,l as default};