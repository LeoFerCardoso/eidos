import{i as e}from"./preload-helper-xPQekRTU.js";import{t,ti as n}from"./src-DgoylXRw.js";var r,i,a,o,s,c,l;e((()=>{t(),r={title:`Forms/DateInput`,component:n,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:'Styled native `<input type="date">` in the Forge field shell. One DS calendar icon replaces the browser\'s native dark indicator. For a custom popover calendar grid use **DatePicker** instead.'}}},args:{label:`Target date`,help:`When this rollout should complete.`},argTypes:{label:{control:`text`},help:{control:`text`},error:{control:`text`},disabled:{control:`boolean`}}},i={},a={args:{defaultValue:`2026-06-01`,help:void 0}},o={args:{min:`2026-01-01`,max:`2026-12-31`,help:`Must fall within 2026.`}},s={args:{defaultValue:`2025-12-31`,error:`Pick a date in the future.`,help:void 0}},c={args:{defaultValue:`2026-06-01`,disabled:!0,help:void 0}},i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{}`,...i.parameters?.docs?.source},description:{story:`Default — single themed calendar icon, no browser double-icon.`,...i.parameters?.docs?.description}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: '2026-06-01',
    help: undefined
  }
}`,...a.parameters?.docs?.source},description:{story:`Pre-filled value.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    min: '2026-01-01',
    max: '2026-12-31',
    help: 'Must fall within 2026.'
  }
}`,...o.parameters?.docs?.source},description:{story:`Bounded with min/max.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: '2025-12-31',
    error: 'Pick a date in the future.',
    help: undefined
  }
}`,...s.parameters?.docs?.source},description:{story:`Error state.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: '2026-06-01',
    disabled: true,
    help: undefined
  }
}`,...c.parameters?.docs?.source},description:{story:`Disabled.`,...c.parameters?.docs?.description}}},l=[`Default`,`WithValue`,`Bounded`,`Invalid`,`Disabled`]}))();export{o as Bounded,i as Default,c as Disabled,s as Invalid,a as WithValue,l as __namedExportsOrder,r as default};