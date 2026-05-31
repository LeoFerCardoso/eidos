import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{t as r,tr as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u,d,f;e((()=>{t(),r(),a=n(),o=(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(`p`,{children:`The user asks about fraud-engine incidents in the past 24 hours. I should first check the service health status, then query the incident log with an appropriate time window.`}),(0,a.jsxs)(`p`,{children:[`Given the risk score of 74 and the KYC status of `,(0,a.jsx)(`em`,{children:`approved`}),`, the account is not under automatic hold. The two open incidents appear unrelated to this user.`]}),(0,a.jsx)(`p`,{children:`Conclusion: safe to proceed with the Pix transfer. I will surface the incident context as a note without blocking the flow.`})]}),s={title:`AI/Reasoning`,component:i,tags:[`autodocs`],parameters:{docs:{description:{component:`A collapsible thinking-trace block shown above the model answer. Auto-opens while streaming and auto-collapses when settled; the user toggle always wins.`}}},args:{streaming:!1,duration:3.2,defaultOpen:!0},argTypes:{streaming:{control:`boolean`},duration:{control:`number`},title:{control:`text`},defaultOpen:{control:`boolean`}}},c={render:e=>(0,a.jsx)(i,{streaming:e.streaming,duration:e.duration,title:e.title,defaultOpen:e.defaultOpen??!0,children:o})},l={args:{streaming:!0,duration:1.4,defaultOpen:void 0},render:e=>(0,a.jsx)(i,{...e,children:(0,a.jsx)(`p`,{children:`Analyzing the fraud-engine logs for the past 24 hours…`})})},u={args:{title:`Risk analysis`,duration:2.8},render:e=>(0,a.jsx)(i,{...e,children:o})},d={args:{defaultOpen:!1,duration:.6},render:e=>(0,a.jsx)(i,{...e,children:o})},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: args => <Reasoning streaming={args.streaming} duration={args.duration} title={args.title} defaultOpen={args.defaultOpen ?? true}>
      {TRACE_CONTENT}
    </Reasoning>
}`,...c.parameters?.docs?.source},description:{story:`Settled trace — click the header to expand/collapse. Toggle is live.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    streaming: true,
    duration: 1.4,
    defaultOpen: undefined
  },
  render: args => <Reasoning {...args}>
      <p>Analyzing the fraud-engine logs for the past 24 hours…</p>
    </Reasoning>
}`,...l.parameters?.docs?.source},description:{story:`Still streaming — verb reads "Thinking" and the block is auto-open.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Risk analysis',
    duration: 2.8
  },
  render: args => <Reasoning {...args}>{TRACE_CONTENT}</Reasoning>
}`,...u.parameters?.docs?.source},description:{story:`Custom title override — useful for specialised traces.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    defaultOpen: false,
    duration: 0.6
  },
  render: args => <Reasoning {...args}>{TRACE_CONTENT}</Reasoning>
}`,...d.parameters?.docs?.source},description:{story:`Collapsed by default — model settled without a long think.`,...d.parameters?.docs?.description}}},f=[`Default`,`Streaming`,`CustomTitle`,`CollapsedByDefault`]}))();export{d as CollapsedByDefault,u as CustomTitle,c as Default,l as Streaming,f as __namedExportsOrder,s as default};