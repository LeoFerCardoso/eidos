import{i as e}from"./preload-helper-xPQekRTU.js";import{ir as t,t as n}from"./src-DgoylXRw.js";var r,i,a,o,s;e((()=>{n(),r={title:`AI/ToolInput`,component:t,tags:[`autodocs`],parameters:{docs:{description:{component:`The input section of a tool-call block. Renders the JSON args as a syntax-highlighted code block when settled, or a shimmer skeleton while params are still streaming. Pair with ToolOutput inside a Tool wrapper.`}}},args:{params:{service:`fraud-engine`,since:`2026-05-28T00:00:00Z`,limit:50,filters:{risk_level:`high`,status:`open`}},streaming:!1,paramsHint:`4 args`},argTypes:{streaming:{control:`boolean`},paramsHint:{control:`text`}}},i={},a={args:{streaming:!0,paramsHint:`streaming…`}},o={args:{params:{user_id:`usr_4f9a2c`},paramsHint:void 0}},i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{}`,...i.parameters?.docs?.source},description:{story:`Settled input — JSON is visible and syntax-highlighted.`,...i.parameters?.docs?.description}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    streaming: true,
    paramsHint: 'streaming…'
  }
}`,...a.parameters?.docs?.source},description:{story:`Streaming — skeleton shimmer while args are still arriving from the model.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    params: {
      user_id: 'usr_4f9a2c'
    },
    paramsHint: undefined
  }
}`,...o.parameters?.docs?.source},description:{story:`Minimal — single-arg params, no hint.`,...o.parameters?.docs?.description}}},s=[`Default`,`Streaming`,`Minimal`]}))();export{i as Default,o as Minimal,a as Streaming,s as __namedExportsOrder,r as default};