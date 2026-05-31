import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{Br as r,Lr as i,Rr as a,t as o,zr as s}from"./src-DgoylXRw.js";var c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C;e((()=>{t(),o(),c=n(),l={title:`AI/Identity/AILabel`,component:i,tags:[`autodocs`],parameters:{docs:{description:{component:'Flags AI-generated content in four visual flavors: `box` (22 px tile), `mark` (text + sparkle), `pill` (tinted background), `dot` (icon-only). One colour (ember), one label ("AI"). `interactive` promotes it to a button with a focus ring.'}}},args:{variant:`mark`,size:`md`,revoked:!1,interactive:!1},argTypes:{variant:{control:`inline-radio`,options:[`box`,`mark`,`pill`,`dot`]},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]},revoked:{control:`boolean`},interactive:{control:`boolean`}}},u={},d={name:`All variants`,render:()=>(0,c.jsx)(`div`,{style:{display:`flex`,gap:16,alignItems:`center`,flexWrap:`wrap`},children:[`box`,`mark`,`pill`,`dot`].map(e=>(0,c.jsxs)(`span`,{style:{display:`inline-flex`,alignItems:`center`,gap:8},children:[(0,c.jsx)(i,{variant:e}),(0,c.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:e})]},e))})},f={render:()=>(0,c.jsx)(`div`,{style:{display:`flex`,gap:16,alignItems:`center`},children:[`sm`,`md`,`lg`].map(e=>(0,c.jsxs)(`span`,{style:{display:`inline-flex`,alignItems:`center`,gap:8},children:[(0,c.jsx)(i,{variant:`pill`,size:e}),(0,c.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:e})]},e))})},p={args:{revoked:!0,variant:`pill`}},m={args:{interactive:!0,variant:`pill`}},h={name:`Custom label`,render:()=>(0,c.jsxs)(`div`,{style:{display:`flex`,gap:12,alignItems:`center`},children:[(0,c.jsx)(i,{variant:`pill`,children:`Beta`}),(0,c.jsx)(i,{variant:`pill`,children:`ML`}),(0,c.jsx)(i,{variant:`mark`,children:`GPT-4o`})]})},g={name:`AILabelWithPopover`,render:()=>(0,c.jsxs)(`div`,{style:{padding:32,fontFamily:`var(--font-sans)`,display:`inline-flex`,gap:16,alignItems:`center`},children:[(0,c.jsx)(`span`,{style:{fontSize:13,color:`var(--fg)`},children:`Risk score: 34`}),(0,c.jsx)(a,{variant:`pill`,size:`sm`,label:`AI risk score`,model:`forge-ai/gpt-4o-mini`,ts:`2 min ago`,confidence:.92,children:`Computed from blast radius, cyclomatic complexity, and coverage delta.`})]})},_={name:`AgentAvatar — default`,render:()=>(0,c.jsxs)(`div`,{style:{display:`flex`,gap:16,alignItems:`center`,flexWrap:`wrap`},children:[(0,c.jsx)(s,{size:24}),(0,c.jsx)(s,{size:32}),(0,c.jsx)(s,{size:40}),(0,c.jsx)(s,{size:48})]})},v={name:`AgentAvatar — with presence`,render:()=>(0,c.jsx)(`div`,{style:{display:`flex`,gap:16,alignItems:`center`,flexWrap:`wrap`},children:[`online`,`away`,`offline`,`busy`].map(e=>(0,c.jsxs)(`span`,{style:{display:`inline-flex`,alignItems:`center`,gap:8},children:[(0,c.jsx)(s,{size:32,status:e,name:`Forge AI`}),(0,c.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:e})]},e))})},y={name:`AgentAvatar — initials`,render:()=>(0,c.jsxs)(`div`,{style:{display:`flex`,gap:12,alignItems:`center`},children:[(0,c.jsx)(s,{size:32,initials:`FA`,name:`Forge AI`}),(0,c.jsx)(s,{size:32,initials:`RZ`,ember:!1,name:`Risk Agent`})]})},b={name:`AgentIdentity — default`,render:()=>(0,c.jsx)(r,{agent:{name:`Forge AI`,model:`forge-ai/gpt-4o`,status:`online`}})},x={name:`AgentIdentity — with AILabel`,render:()=>(0,c.jsx)(r,{agent:{name:`Risk Analyst`,model:`forge-ai/gpt-4o-mini`,status:`online`},label:!0})},S={name:`AgentIdentity — in context (message header)`,render:()=>(0,c.jsxs)(`div`,{style:{maxWidth:480,border:`1px solid var(--border)`,borderRadius:`var(--radius-lg)`,overflow:`hidden`,fontFamily:`var(--font-sans)`},children:[(0,c.jsxs)(`div`,{style:{padding:`10px 14px`,borderBottom:`1px solid var(--border)`,display:`flex`,alignItems:`center`,justifyContent:`space-between`},children:[(0,c.jsx)(r,{agent:{name:`Forge AI`,model:`gpt-4o`,status:`online`},label:!0}),(0,c.jsx)(`span`,{style:{fontSize:11,color:`var(--fg-muted)`,fontFamily:`var(--font-mono)`},children:`14:01`})]}),(0,c.jsx)(`div`,{style:{padding:`12px 14px`,fontSize:13,color:`var(--fg)`,lineHeight:1.6},children:`The pix-router p95 is 89 ms, within SLO. The Ring 2 canary is at 62% traffic.`})]})},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{}`,...u.parameters?.docs?.source},description:{story:`Default — mark variant, md size.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: 'All variants',
  render: () => <div style={{
    display: 'flex',
    gap: 16,
    alignItems: 'center',
    flexWrap: 'wrap'
  }}>
      {(['box', 'mark', 'pill', 'dot'] as const).map(v => <span key={v} style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }}>
          <AILabel variant={v} />
          <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)'
      }}>{v}</code>
        </span>)}
    </div>
}`,...d.parameters?.docs?.source},description:{story:`All four variants side by side.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 16,
    alignItems: 'center'
  }}>
      {(['sm', 'md', 'lg'] as const).map(sz => <span key={sz} style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }}>
          <AILabel variant="pill" size={sz} />
          <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)'
      }}>{sz}</code>
        </span>)}
    </div>
}`,...f.parameters?.docs?.source},description:{story:`Three sizes — sm, md, lg.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    revoked: true,
    variant: 'pill'
  }
}`,...p.parameters?.docs?.source},description:{story:`Revoked — strikethrough, muted color.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    interactive: true,
    variant: 'pill'
  }
}`,...m.parameters?.docs?.source},description:{story:`Interactive — button role, keyboard + focus ring.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: 'Custom label',
  render: () => <div style={{
    display: 'flex',
    gap: 12,
    alignItems: 'center'
  }}>
      <AILabel variant="pill">Beta</AILabel>
      <AILabel variant="pill">ML</AILabel>
      <AILabel variant="mark">GPT-4o</AILabel>
    </div>
}`,...h.parameters?.docs?.source},description:{story:`Custom label — short token override ("Beta", "ML").`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: 'AILabelWithPopover',
  render: () => <div style={{
    padding: 32,
    fontFamily: 'var(--font-sans)',
    display: 'inline-flex',
    gap: 16,
    alignItems: 'center'
  }}>
      <span style={{
      fontSize: 13,
      color: 'var(--fg)'
    }}>Risk score: 34</span>
      <AILabelWithPopover variant="pill" size="sm" label="AI risk score" model="forge-ai/gpt-4o-mini" ts="2 min ago" confidence={0.92}>
        Computed from blast radius, cyclomatic complexity, and coverage delta.
      </AILabelWithPopover>
    </div>
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: 'AgentAvatar — default',
  render: () => <div style={{
    display: 'flex',
    gap: 16,
    alignItems: 'center',
    flexWrap: 'wrap'
  }}>
      <AgentAvatar size={24} />
      <AgentAvatar size={32} />
      <AgentAvatar size={40} />
      <AgentAvatar size={48} />
    </div>
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: 'AgentAvatar — with presence',
  render: () => <div style={{
    display: 'flex',
    gap: 16,
    alignItems: 'center',
    flexWrap: 'wrap'
  }}>
      {(['online', 'away', 'offline', 'busy'] as const).map(status => <span key={status} style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }}>
          <AgentAvatar size={32} status={status} name="Forge AI" />
          <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)'
      }}>{status}</code>
        </span>)}
    </div>
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: 'AgentAvatar — initials',
  render: () => <div style={{
    display: 'flex',
    gap: 12,
    alignItems: 'center'
  }}>
      <AgentAvatar size={32} initials="FA" name="Forge AI" />
      <AgentAvatar size={32} initials="RZ" ember={false} name="Risk Agent" />
    </div>
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: 'AgentIdentity — default',
  render: () => <AgentIdentity agent={{
    name: 'Forge AI',
    model: 'forge-ai/gpt-4o',
    status: 'online'
  }} />
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: 'AgentIdentity — with AILabel',
  render: () => <AgentIdentity agent={{
    name: 'Risk Analyst',
    model: 'forge-ai/gpt-4o-mini',
    status: 'online'
  }} label />
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: 'AgentIdentity — in context (message header)',
  render: () => <div style={{
    maxWidth: 480,
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    fontFamily: 'var(--font-sans)'
  }}>
      <div style={{
      padding: '10px 14px',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
        <AgentIdentity agent={{
        name: 'Forge AI',
        model: 'gpt-4o',
        status: 'online'
      }} label />
        <span style={{
        fontSize: 11,
        color: 'var(--fg-muted)',
        fontFamily: 'var(--font-mono)'
      }}>14:01</span>
      </div>
      <div style={{
      padding: '12px 14px',
      fontSize: 13,
      color: 'var(--fg)',
      lineHeight: 1.6
    }}>
        The pix-router p95 is 89 ms, within SLO. The Ring 2 canary is at 62% traffic.
      </div>
    </div>
}`,...S.parameters?.docs?.source}}},C=[`Default`,`AllVariants`,`Sizes`,`Revoked`,`Interactive`,`CustomLabel`,`WithPopover`,`AgentAvatarDefault`,`AgentAvatarWithStatus`,`AgentAvatarInitials`,`AgentIdentityDefault`,`AgentIdentityWithLabel`,`AgentIdentityInContext`]}))();export{_ as AgentAvatarDefault,y as AgentAvatarInitials,v as AgentAvatarWithStatus,b as AgentIdentityDefault,S as AgentIdentityInContext,x as AgentIdentityWithLabel,d as AllVariants,h as CustomLabel,u as Default,m as Interactive,p as Revoked,f as Sizes,g as WithPopover,C as __namedExportsOrder,l as default};