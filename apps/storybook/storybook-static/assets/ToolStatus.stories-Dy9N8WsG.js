import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{or as r,t as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u;e((()=>{t(),i(),a=n(),o={title:`AI/ToolStatus`,component:r,tags:[`autodocs`],parameters:{docs:{description:{component:`A compact status pill that represents the four run-states of an agent tool call: Pending (input streaming), Running (input available, executing), Done (output arrived), and Error (output error). Composes the Forge Pill primitive so semantic tones and live-region announcements are handled by the design system — never colour alone.`}},layout:`padded`},args:{state:`output-available`},argTypes:{state:{control:`select`,options:[`input-streaming`,`input-available`,`output-available`,`output-error`],description:`Run-state key; drives the tone, label, icon, and live-region behaviour.`}}},s={args:{state:`output-available`}},c={render:()=>(0,a.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:12,alignItems:`center`},children:[(0,a.jsx)(r,{state:`input-streaming`}),(0,a.jsx)(r,{state:`input-available`}),(0,a.jsx)(r,{state:`output-available`}),(0,a.jsx)(r,{state:`output-error`})]})},l={render:()=>(0,a.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:8,maxWidth:460,fontFamily:`var(--font-sans)`,fontSize:13,color:`var(--fg)`},children:[{tool:`forge.ai.lookup_user`,state:`input-streaming`},{tool:`forge.ai.search_incidents`,state:`input-available`},{tool:`forge.infra.get_deploy_info`,state:`output-available`},{tool:`forge.ai.assess_risk_score`,state:`output-error`}].map(({tool:e,state:t})=>(0,a.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`,gap:12,padding:`6px 10px`,borderRadius:6,background:`var(--surface-raised)`},children:[(0,a.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`},children:e}),(0,a.jsx)(r,{state:t})]},e))})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    state: 'output-available'
  }
}`,...s.parameters?.docs?.source},description:{story:`Default: tool call completed successfully — Done pill in success tone.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center'
  }}>
      <ToolStatus state="input-streaming" />
      <ToolStatus state="input-available" />
      <ToolStatus state="output-available" />
      <ToolStatus state="output-error" />
    </div>
}`,...c.parameters?.docs?.source},description:{story:`All four run-states side by side — covers the full Pending → Running → Done → Error matrix.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    maxWidth: 460,
    fontFamily: 'var(--font-sans)',
    fontSize: 13,
    color: 'var(--fg)'
  }}>
      {([{
      tool: 'forge.ai.lookup_user',
      state: 'input-streaming'
    }, {
      tool: 'forge.ai.search_incidents',
      state: 'input-available'
    }, {
      tool: 'forge.infra.get_deploy_info',
      state: 'output-available'
    }, {
      tool: 'forge.ai.assess_risk_score',
      state: 'output-error'
    }] as {
      tool: string;
      state: string;
    }[]).map(({
      tool,
      state
    }) => <div key={tool} style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      padding: '6px 10px',
      borderRadius: 6,
      background: 'var(--surface-raised)'
    }}>
          <span style={{
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg-muted)'
      }}>
            {tool}
          </span>
          <ToolStatus state={state} />
        </div>)}
    </div>
}`,...l.parameters?.docs?.source},description:{story:`In context — pills paired with realistic tool names as they appear inside a Tool block header.`,...l.parameters?.docs?.description}}},u=[`Default`,`States`,`InContext`]}))();export{s as Default,l as InContext,c as States,u as __namedExportsOrder,o as default};