import{i as e}from"./preload-helper-xPQekRTU.js";import{di as t,t as n}from"./src-DgoylXRw.js";var r,i,a,o,s,c;e((()=>{n(),r={title:`Forms/Textarea`,component:t,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:`Multi-line text entry — a native <textarea> with the Forge field shell, optional helper/error, and a live character counter.`}}},args:{label:`Incident summary`,placeholder:`What happened, impact, and current status…`,rows:4},argTypes:{label:{control:`text`},help:{control:`text`},error:{control:`text`},showCount:{control:`boolean`}}},i={},a={args:{label:`Commit message`,maxLength:140,showCount:!0,defaultValue:`fix(pix-router): drop sync call to bureau-gateway`,rows:3}},o={args:{label:`Postmortem`,error:`A postmortem is required for P0/P1 incidents.`,rows:4}},s={args:{label:`Notes`,defaultValue:`Read-only context from the incident bot.`,disabled:!0,rows:3}},i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Commit message',
    maxLength: 140,
    showCount: true,
    defaultValue: 'fix(pix-router): drop sync call to bureau-gateway',
    rows: 3
  }
}`,...a.parameters?.docs?.source},description:{story:`With a live character counter.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Postmortem',
    error: 'A postmortem is required for P0/P1 incidents.',
    rows: 4
  }
}`,...o.parameters?.docs?.source},description:{story:`Error state.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Notes',
    defaultValue: 'Read-only context from the incident bot.',
    disabled: true,
    rows: 3
  }
}`,...s.parameters?.docs?.source},description:{story:`Disabled.`,...s.parameters?.docs?.description}}},c=[`Default`,`WithCounter`,`Invalid`,`Disabled`]}))();export{i as Default,s as Disabled,o as Invalid,a as WithCounter,c as __namedExportsOrder,r as default};