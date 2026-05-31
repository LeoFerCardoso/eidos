import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{Br as r,t as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u,d;e((()=>{t(),i(),a=n(),o={title:`AI/AgentIdentity`,component:r,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:`The canonical "who is talking" row for agent-driven surfaces. Combines an AgentAvatar, a name line, and an optional model identifier. Use it in chat meta rows, agentic step headers, and incident response feeds wherever you need to identify the acting agent at a glance.`}}},args:{agent:{name:`Forge AI`,model:`forge-ai/gpt-4o-mini`,status:`online`},size:32,label:!1},argTypes:{size:{control:`number`},label:{control:`boolean`},"agent.status":{control:`inline-radio`,options:[`online`,`away`,`offline`,`busy`]}}},s={},c={args:{agent:{name:`Deploy Agent`,model:`forge-ai/codex-v2`,status:`online`},label:!0}},l={render:()=>(0,a.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:32},children:[(0,a.jsxs)(`section`,{children:[(0,a.jsx)(`p`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,marginBottom:12,textTransform:`uppercase`,letterSpacing:`0.08em`},children:`Presence states`}),(0,a.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:24,alignItems:`center`},children:[(0,a.jsx)(r,{agent:{name:`Forge AI`,model:`forge-ai/gpt-4o-mini`,status:`online`}}),(0,a.jsx)(r,{agent:{name:`Incident Responder`,model:`forge-ai/claude-3-haiku`,status:`away`}}),(0,a.jsx)(r,{agent:{name:`Fraud Engine`,model:`forge-ai/risk-v3`,status:`busy`}}),(0,a.jsx)(r,{agent:{name:`Audit Bot`,model:`forge-ai/compliance-v1`,status:`offline`}})]})]}),(0,a.jsxs)(`section`,{children:[(0,a.jsx)(`p`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,marginBottom:12,textTransform:`uppercase`,letterSpacing:`0.08em`},children:`Sizes`}),(0,a.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:24,alignItems:`center`},children:[(0,a.jsx)(r,{agent:{name:`Deploy Agent`,model:`forge-ai/codex-v2`,status:`online`},size:24}),(0,a.jsx)(r,{agent:{name:`Deploy Agent`,model:`forge-ai/codex-v2`,status:`online`},size:32}),(0,a.jsx)(r,{agent:{name:`Deploy Agent`,model:`forge-ai/codex-v2`,status:`online`},size:40}),(0,a.jsx)(r,{agent:{name:`Deploy Agent`,model:`forge-ai/codex-v2`,status:`online`},size:48})]})]}),(0,a.jsxs)(`section`,{children:[(0,a.jsx)(`p`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,marginBottom:12,textTransform:`uppercase`,letterSpacing:`0.08em`},children:`With AI label`}),(0,a.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:24,alignItems:`center`},children:[(0,a.jsx)(r,{agent:{name:`Forge AI`,model:`forge-ai/gpt-4o-mini`,status:`online`},label:!0}),(0,a.jsx)(r,{agent:{name:`Summarisation Agent`,model:`forge-ai/claude-3-5-sonnet`,status:`away`},label:!0,size:40})]})]}),(0,a.jsxs)(`section`,{children:[(0,a.jsx)(`p`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,marginBottom:12,textTransform:`uppercase`,letterSpacing:`0.08em`},children:`Name only (no model identifier)`}),(0,a.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:24,alignItems:`center`},children:[(0,a.jsx)(r,{agent:{name:`Pix Router`,status:`online`}}),(0,a.jsx)(r,{agent:{name:`CI Pipeline Bot`,status:`busy`},label:!0}),(0,a.jsx)(r,{agent:{}})]})]})]})},u={render:()=>(0,a.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:8,padding:20,borderRadius:10,border:`1px solid var(--border)`,background:`var(--surface)`,maxWidth:440},children:[(0,a.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,a.jsx)(r,{agent:{name:`Deploy Agent`,model:`forge-ai/codex-v2`,status:`online`},label:!0}),(0,a.jsx)(`span`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`},children:`2 min ago`})]}),(0,a.jsxs)(`p`,{style:{margin:0,fontSize:13,color:`var(--fg)`,lineHeight:1.5},children:[`Rolled back `,(0,a.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:12},children:`pix-router`}),` `,`from `,(0,a.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:12},children:`v4.2.1`}),` to`,` `,(0,a.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:12},children:`v4.1.9`}),` — latency p95 returned to baseline within 90 s.`]}),(0,a.jsxs)(`div`,{style:{display:`flex`,gap:8,marginTop:4},children:[(0,a.jsx)(`span`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,background:`var(--surface-raised)`,borderRadius:4,padding:`2px 6px`},children:`ring-0`}),(0,a.jsx)(`span`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,background:`var(--surface-raised)`,borderRadius:4,padding:`2px 6px`},children:`INC-9812`})]})]})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source},description:{story:`Default — avatar + name + model line with an active presence dot.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    agent: {
      name: 'Deploy Agent',
      model: 'forge-ai/codex-v2',
      status: 'online'
    },
    label: true
  }
}`,...c.parameters?.docs?.source},description:{story:`With AI label — appends an AILabel pill after the agent name to flag AI-generated content.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 32
  }}>

      {/* Presence states */}
      <section>
        <p style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg-muted)',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: '0.08em'
      }}>
          Presence states
        </p>
        <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 24,
        alignItems: 'center'
      }}>
          <AgentIdentity agent={{
          name: 'Forge AI',
          model: 'forge-ai/gpt-4o-mini',
          status: 'online'
        }} />
          <AgentIdentity agent={{
          name: 'Incident Responder',
          model: 'forge-ai/claude-3-haiku',
          status: 'away'
        }} />
          <AgentIdentity agent={{
          name: 'Fraud Engine',
          model: 'forge-ai/risk-v3',
          status: 'busy'
        }} />
          <AgentIdentity agent={{
          name: 'Audit Bot',
          model: 'forge-ai/compliance-v1',
          status: 'offline'
        }} />
        </div>
      </section>

      {/* Sizes */}
      <section>
        <p style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg-muted)',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: '0.08em'
      }}>
          Sizes
        </p>
        <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 24,
        alignItems: 'center'
      }}>
          <AgentIdentity agent={{
          name: 'Deploy Agent',
          model: 'forge-ai/codex-v2',
          status: 'online'
        }} size={24} />
          <AgentIdentity agent={{
          name: 'Deploy Agent',
          model: 'forge-ai/codex-v2',
          status: 'online'
        }} size={32} />
          <AgentIdentity agent={{
          name: 'Deploy Agent',
          model: 'forge-ai/codex-v2',
          status: 'online'
        }} size={40} />
          <AgentIdentity agent={{
          name: 'Deploy Agent',
          model: 'forge-ai/codex-v2',
          status: 'online'
        }} size={48} />
        </div>
      </section>

      {/* With AI label */}
      <section>
        <p style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg-muted)',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: '0.08em'
      }}>
          With AI label
        </p>
        <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 24,
        alignItems: 'center'
      }}>
          <AgentIdentity agent={{
          name: 'Forge AI',
          model: 'forge-ai/gpt-4o-mini',
          status: 'online'
        }} label />
          <AgentIdentity agent={{
          name: 'Summarisation Agent',
          model: 'forge-ai/claude-3-5-sonnet',
          status: 'away'
        }} label size={40} />
        </div>
      </section>

      {/* No model line */}
      <section>
        <p style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg-muted)',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: '0.08em'
      }}>
          Name only (no model identifier)
        </p>
        <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 24,
        alignItems: 'center'
      }}>
          <AgentIdentity agent={{
          name: 'Pix Router',
          status: 'online'
        }} />
          <AgentIdentity agent={{
          name: 'CI Pipeline Bot',
          status: 'busy'
        }} label />
          <AgentIdentity agent={{}} />
        </div>
      </section>

    </div>
}`,...l.parameters?.docs?.source},description:{story:`Variants — presence states, sizes, and label flag laid out side by side.
Covers the full variant × state matrix: four presence values across two
avatar sizes, plus the AILabel variant.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: 20,
    borderRadius: 10,
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    maxWidth: 440
  }}>
      <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
        <AgentIdentity agent={{
        name: 'Deploy Agent',
        model: 'forge-ai/codex-v2',
        status: 'online'
      }} label />
        <span style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg-muted)'
      }}>
          2 min ago
        </span>
      </div>
      <p style={{
      margin: 0,
      fontSize: 13,
      color: 'var(--fg)',
      lineHeight: 1.5
    }}>
        Rolled back <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12
      }}>pix-router</code>{' '}
        from <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12
      }}>v4.2.1</code> to{' '}
        <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12
      }}>v4.1.9</code> — latency p95
        returned to baseline within 90 s.
      </p>
      <div style={{
      display: 'flex',
      gap: 8,
      marginTop: 4
    }}>
        <span style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg-muted)',
        background: 'var(--surface-raised)',
        borderRadius: 4,
        padding: '2px 6px'
      }}>
          ring-0
        </span>
        <span style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg-muted)',
        background: 'var(--surface-raised)',
        borderRadius: 4,
        padding: '2px 6px'
      }}>
          INC-9812
        </span>
      </div>
    </div>
}`,...u.parameters?.docs?.source},description:{story:`In context — identity row inside an agentic step card, as it would appear in a deploy feed.`,...u.parameters?.docs?.description}}},d=[`Default`,`WithAILabel`,`Variants`,`InContext`]}))();export{s as Default,u as InContext,l as Variants,c as WithAILabel,d as __namedExportsOrder,o as default};