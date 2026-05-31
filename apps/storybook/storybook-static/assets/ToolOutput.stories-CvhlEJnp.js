import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{ar as r,t as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u;e((()=>{t(),i(),a=n(),o={title:`AI/ToolOutput`,component:r,tags:[`autodocs`],parameters:{docs:{description:{component:`The result section of a tool-call block. Accepts any Forge primitives as children — prose, Code, Table, or an error card. Switch label to "Error" when state is output-error.`}}},args:{label:`Output`,meta:`2 results`},argTypes:{label:{control:`text`},meta:{control:`text`}}},s={render:e=>(0,a.jsx)(r,{...e,children:(0,a.jsx)(`p`,{style:{margin:`8px 12px`,fontSize:13,color:`var(--fg-muted)`},children:`Found 2 open incidents in fraud-engine (last 24 h).`})})},c={args:{label:`Error`,meta:`404`},render:e=>(0,a.jsx)(r,{...e,children:(0,a.jsx)(`p`,{style:{margin:`8px 12px`,fontSize:13,color:`var(--fg-error, #e53e3e)`},children:`User not found: usr_4f9a2c`})})},l={args:{meta:`0 results`},render:e=>(0,a.jsx)(r,{...e,children:(0,a.jsx)(`p`,{style:{margin:`8px 12px`,fontSize:13,color:`var(--fg-muted)`},children:`No incidents found matching the query.`})})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: args => <ToolOutput {...args}>
      <p style={{
      margin: '8px 12px',
      fontSize: 13,
      color: 'var(--fg-muted)'
    }}>
        Found 2 open incidents in fraud-engine (last 24 h).
      </p>
    </ToolOutput>
}`,...s.parameters?.docs?.source},description:{story:`Normal output with a result summary.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Error',
    meta: '404'
  },
  render: args => <ToolOutput {...args}>
      <p style={{
      margin: '8px 12px',
      fontSize: 13,
      color: 'var(--fg-error, #e53e3e)'
    }}>
        User not found: usr_4f9a2c
      </p>
    </ToolOutput>
}`,...c.parameters?.docs?.source},description:{story:`Error state — relabel the section and show an error message.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    meta: '0 results'
  },
  render: args => <ToolOutput {...args}>
      <p style={{
      margin: '8px 12px',
      fontSize: 13,
      color: 'var(--fg-muted)'
    }}>
        No incidents found matching the query.
      </p>
    </ToolOutput>
}`,...l.parameters?.docs?.source},description:{story:`Empty result — tool returned successfully but with no data.`,...l.parameters?.docs?.description}}},u=[`Default`,`ErrorState`,`Empty`]}))();export{s as Default,l as Empty,c as ErrorState,u as __namedExportsOrder,o as default};