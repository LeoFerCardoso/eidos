import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{Wa as r,t as i,zr as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m;e((()=>{t(),i(),o=n(),s={title:`AI/AgentAvatar`,component:a,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:`The visual mark for an AI agent in the Forge platform. Renders a circular avatar with the canonical ember tint, an optional presence dot, and either the default agent glyph, a custom icon, or two-letter initials. Use it anywhere an agent needs to be identified — chat headers, run logs, agentic pipeline cards, and incident-response threads.`}}},args:{size:32,ember:!0,name:`Forge AI`},argTypes:{size:{control:{type:`number`,min:16,max:80,step:4}},ember:{control:`boolean`},status:{control:`inline-radio`,options:[void 0,`online`,`away`,`busy`,`offline`]},initials:{control:`text`},name:{control:`text`}}},c={args:{size:32,name:`Deploy Agent`}},l={render:()=>(0,o.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:16},children:[(0,o.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:6},children:[(0,o.jsx)(a,{size:36,status:`online`,name:`Incident Responder`}),(0,o.jsx)(`span`,{style:{fontSize:11,color:`var(--fg-muted)`,fontFamily:`var(--font-mono)`},children:`online`})]}),(0,o.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:6},children:[(0,o.jsx)(a,{size:36,status:`away`,name:`Canary Watcher`}),(0,o.jsx)(`span`,{style:{fontSize:11,color:`var(--fg-muted)`,fontFamily:`var(--font-mono)`},children:`away`})]}),(0,o.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:6},children:[(0,o.jsx)(a,{size:36,status:`busy`,name:`Fraud Scorer`}),(0,o.jsx)(`span`,{style:{fontSize:11,color:`var(--fg-muted)`,fontFamily:`var(--font-mono)`},children:`busy`})]}),(0,o.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:6},children:[(0,o.jsx)(a,{size:36,status:`offline`,name:`Log Analyzer`}),(0,o.jsx)(`span`,{style:{fontSize:11,color:`var(--fg-muted)`,fontFamily:`var(--font-mono)`},children:`offline`})]})]})},u={render:()=>(0,o.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,gap:12},children:[20,28,32,40,48,64].map(e=>(0,o.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:6},children:[(0,o.jsx)(a,{size:e,name:`Agent ${e}px`,status:`online`}),(0,o.jsx)(`span`,{style:{fontSize:11,color:`var(--fg-muted)`,fontFamily:`var(--font-mono)`},children:e})]},e))})},d={render:()=>(0,o.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:16},children:[(0,o.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:6},children:[(0,o.jsx)(a,{size:36,initials:`DA`,name:`Deploy Agent`}),(0,o.jsx)(`span`,{style:{fontSize:11,color:`var(--fg-muted)`},children:`Deploy Agent`})]}),(0,o.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:6},children:[(0,o.jsx)(a,{size:36,initials:`IR`,name:`Incident Responder`,status:`online`}),(0,o.jsx)(`span`,{style:{fontSize:11,color:`var(--fg-muted)`},children:`Incident Responder`})]}),(0,o.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:6},children:[(0,o.jsx)(a,{size:36,initials:`FS`,name:`Fraud Scorer`,status:`busy`}),(0,o.jsx)(`span`,{style:{fontSize:11,color:`var(--fg-muted)`},children:`Fraud Scorer`})]})]})},f={render:()=>(0,o.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:16},children:[(0,o.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:6},children:[(0,o.jsx)(a,{size:36,glyph:(0,o.jsx)(r.terminal,{size:18}),name:`Shell Agent`}),(0,o.jsx)(`span`,{style:{fontSize:11,color:`var(--fg-muted)`},children:`Shell Agent`})]}),(0,o.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:6},children:[(0,o.jsx)(a,{size:36,glyph:(0,o.jsx)(r.search,{size:18}),name:`Search Agent`,status:`online`}),(0,o.jsx)(`span`,{style:{fontSize:11,color:`var(--fg-muted)`},children:`Search Agent`})]}),(0,o.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:6},children:[(0,o.jsx)(a,{size:36,glyph:(0,o.jsx)(r.barChart,{size:18}),name:`Analytics Agent`,status:`away`}),(0,o.jsx)(`span`,{style:{fontSize:11,color:`var(--fg-muted)`},children:`Analytics Agent`})]})]})},p={args:{size:36,ember:!1,initials:`LC`,name:`Leo Cardoso (human)`}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    size: 32,
    name: 'Deploy Agent'
  }
}`,...c.parameters?.docs?.source},description:{story:`Default agent avatar — 32 px, ember tint, agent glyph, no presence dot.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 16
  }}>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6
    }}>
        <AgentAvatar size={36} status="online" name="Incident Responder" />
        <span style={{
        fontSize: 11,
        color: 'var(--fg-muted)',
        fontFamily: 'var(--font-mono)'
      }}>online</span>
      </div>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6
    }}>
        <AgentAvatar size={36} status="away" name="Canary Watcher" />
        <span style={{
        fontSize: 11,
        color: 'var(--fg-muted)',
        fontFamily: 'var(--font-mono)'
      }}>away</span>
      </div>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6
    }}>
        <AgentAvatar size={36} status="busy" name="Fraud Scorer" />
        <span style={{
        fontSize: 11,
        color: 'var(--fg-muted)',
        fontFamily: 'var(--font-mono)'
      }}>busy</span>
      </div>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6
    }}>
        <AgentAvatar size={36} status="offline" name="Log Analyzer" />
        <span style={{
        fontSize: 11,
        color: 'var(--fg-muted)',
        fontFamily: 'var(--font-mono)'
      }}>offline</span>
      </div>
    </div>
}`,...l.parameters?.docs?.source},description:{story:`All four presence statuses side by side.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 12
  }}>
      {([20, 28, 32, 40, 48, 64] as const).map(s => <div key={s} style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6
    }}>
          <AgentAvatar size={s} name={\`Agent \${s}px\`} status="online" />
          <span style={{
        fontSize: 11,
        color: 'var(--fg-muted)',
        fontFamily: 'var(--font-mono)'
      }}>{s}</span>
        </div>)}
    </div>
}`,...u.parameters?.docs?.source},description:{story:`Size scale — 20, 28, 32, 40, 48, 64 px.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 16
  }}>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6
    }}>
        <AgentAvatar size={36} initials="DA" name="Deploy Agent" />
        <span style={{
        fontSize: 11,
        color: 'var(--fg-muted)'
      }}>Deploy Agent</span>
      </div>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6
    }}>
        <AgentAvatar size={36} initials="IR" name="Incident Responder" status="online" />
        <span style={{
        fontSize: 11,
        color: 'var(--fg-muted)'
      }}>Incident Responder</span>
      </div>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6
    }}>
        <AgentAvatar size={36} initials="FS" name="Fraud Scorer" status="busy" />
        <span style={{
        fontSize: 11,
        color: 'var(--fg-muted)'
      }}>Fraud Scorer</span>
      </div>
    </div>
}`,...d.parameters?.docs?.source},description:{story:`Initials variant — used for named personas (e.g. "Deploy Agent" → DA).`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 16
  }}>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6
    }}>
        <AgentAvatar size={36} glyph={<Icons.terminal size={18} />} name="Shell Agent" />
        <span style={{
        fontSize: 11,
        color: 'var(--fg-muted)'
      }}>Shell Agent</span>
      </div>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6
    }}>
        <AgentAvatar size={36} glyph={<Icons.search size={18} />} name="Search Agent" status="online" />
        <span style={{
        fontSize: 11,
        color: 'var(--fg-muted)'
      }}>Search Agent</span>
      </div>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6
    }}>
        <AgentAvatar size={36} glyph={<Icons.barChart size={18} />} name="Analytics Agent" status="away" />
        <span style={{
        fontSize: 11,
        color: 'var(--fg-muted)'
      }}>Analytics Agent</span>
      </div>
    </div>
}`,...f.parameters?.docs?.source},description:{story:`Custom glyph — override the default agent icon with any ReactNode.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    size: 36,
    ember: false,
    initials: 'LC',
    name: 'Leo Cardoso (human)'
  }
}`,...p.parameters?.docs?.source},description:{story:`Non-ember — used when distinguishing a human user avatar from an agent in the same thread.`,...p.parameters?.docs?.description}}},m=[`Default`,`PresenceStates`,`SizeScale`,`WithInitials`,`CustomGlyph`,`NonEmber`]}))();export{f as CustomGlyph,c as Default,p as NonEmber,l as PresenceStates,u as SizeScale,d as WithInitials,m as __namedExportsOrder,s as default};