import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{Ia as r,t as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u;e((()=>{t(),i(),a=n(),o={title:`Primitives/TierBadge`,component:r,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:'**Deprecated** — prefer `<Chip tone="tier-t1|tier-t2|tier-t3">` directly. TierBadge renders a service reliability tier chip (T1 = highest, T3 = lowest). Use it in service catalogs, incident boards, and SLO dashboards to communicate operational tier at a glance. The component is a thin wrapper kept for one-release back-compat.'}}},args:{tier:`T1`},argTypes:{tier:{control:`inline-radio`,options:[`T1`,`T2`,`T3`]}}},s={render:e=>(0,a.jsx)(r,{...e})},c={render:()=>(0,a.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:8},children:[(0,a.jsx)(r,{tier:`T1`}),(0,a.jsx)(r,{tier:`T2`}),(0,a.jsx)(r,{tier:`T3`})]})},l={render:()=>(0,a.jsx)(`div`,{className:`surface`,style:{borderRadius:10,overflow:`hidden`,maxWidth:560},children:[{name:`payments-api`,owner:`Platform`,tier:`T1`,latency:`42 ms`,uptime:`99.98%`},{name:`notification-svc`,owner:`Messaging`,tier:`T2`,latency:`118 ms`,uptime:`99.81%`},{name:`feature-flag-proxy`,owner:`DevEx`,tier:`T3`,latency:`9 ms`,uptime:`99.40%`}].map((e,t)=>(0,a.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:12,padding:`10px 16px`,borderTop:t>0?`1px solid var(--border)`:`none`},children:[(0,a.jsx)(r,{tier:e.tier}),(0,a.jsx)(`span`,{style:{flex:1,fontSize:`var(--text-sm)`,fontFamily:`var(--font-mono)`,color:`var(--fg)`},children:e.name}),(0,a.jsx)(`span`,{style:{fontSize:`var(--text-xs)`,color:`var(--fg-muted)`,fontFamily:`var(--font-mono)`,minWidth:52,textAlign:`end`},children:e.latency}),(0,a.jsx)(`span`,{style:{fontSize:`var(--text-xs)`,color:`var(--fg-muted)`,fontFamily:`var(--font-mono)`,minWidth:56,textAlign:`end`},children:e.uptime}),(0,a.jsx)(`span`,{style:{fontSize:`var(--text-xs)`,color:`var(--fg-subtle)`,minWidth:64,textAlign:`end`},children:e.owner})]},e.name))})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: args => <TierBadge {...args} />
}`,...s.parameters?.docs?.source},description:{story:`Smallest real usage — a single T1 (mission-critical) tier chip.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 8
  }}>
      <TierBadge tier="T1" />
      <TierBadge tier="T2" />
      <TierBadge tier="T3" />
    </div>
}`,...c.parameters?.docs?.source},description:{story:`All three reliability tiers side by side — T1 (mission-critical), T2 (business-important), T3 (internal).`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="surface" style={{
    borderRadius: 10,
    overflow: 'hidden',
    maxWidth: 560
  }}>
      {[{
      name: 'payments-api',
      owner: 'Platform',
      tier: 'T1',
      latency: '42 ms',
      uptime: '99.98%'
    }, {
      name: 'notification-svc',
      owner: 'Messaging',
      tier: 'T2',
      latency: '118 ms',
      uptime: '99.81%'
    }, {
      name: 'feature-flag-proxy',
      owner: 'DevEx',
      tier: 'T3',
      latency: '9 ms',
      uptime: '99.40%'
    }].map((row, i) => <div key={row.name} style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 16px',
      borderTop: i > 0 ? '1px solid var(--border)' : 'none'
    }}>
          <TierBadge tier={row.tier} />
          <span style={{
        flex: 1,
        fontSize: 'var(--text-sm)',
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg)'
      }}>
            {row.name}
          </span>
          <span style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--fg-muted)',
        fontFamily: 'var(--font-mono)',
        minWidth: 52,
        textAlign: 'end'
      }}>
            {row.latency}
          </span>
          <span style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--fg-muted)',
        fontFamily: 'var(--font-mono)',
        minWidth: 56,
        textAlign: 'end'
      }}>
            {row.uptime}
          </span>
          <span style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--fg-subtle)',
        minWidth: 64,
        textAlign: 'end'
      }}>
            {row.owner}
          </span>
        </div>)}
    </div>
}`,...l.parameters?.docs?.source},description:{story:`In context — tier chips surfaced in a service catalog row.`,...l.parameters?.docs?.description}}},u=[`Default`,`AllTiers`,`InContext`]}))();export{c as AllTiers,s as Default,l as InContext,u as __namedExportsOrder,o as default};