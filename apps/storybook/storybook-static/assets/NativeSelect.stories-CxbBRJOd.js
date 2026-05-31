import{i as e}from"./preload-helper-xPQekRTU.js";import{ii as t,t as n}from"./src-DgoylXRw.js";var r,i,a,o,s,c;e((()=>{n(),r={title:`Forms/NativeSelect`,component:t,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:"A native `<select>` in the Forge field shell. Zero JS — keyboard support, form submission, and screen-reader semantics come from the browser. Use when the list is short (≤ 7 items), plain text, and system look-and-feel is acceptable. For icons, descriptions, or groups, use the custom `Select`."}}},args:{label:`Service tier`,options:[{label:`T1 — Critical`,value:`t1`},{label:`T2 — Important`,value:`t2`},{label:`T3 — Standard`,value:`t3`}],placeholder:`Choose a tier…`,help:`Drives SLOs and on-call policy.`},argTypes:{label:{control:`text`},help:{control:`text`},error:{control:`text`},disabled:{control:`boolean`}}},i={},a={args:{defaultValue:`t1`,placeholder:void 0}},o={args:{error:`Pick a tier to continue.`,help:void 0}},s={args:{defaultValue:`t2`,placeholder:void 0,disabled:!0,help:void 0}},i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{}`,...i.parameters?.docs?.source},description:{story:`Default — browser native picker, zero JS.`,...i.parameters?.docs?.description}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: 't1',
    placeholder: undefined
  }
}`,...a.parameters?.docs?.source},description:{story:`Pre-selected value.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    error: 'Pick a tier to continue.',
    help: undefined
  }
}`,...o.parameters?.docs?.source},description:{story:`Error state.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: 't2',
    placeholder: undefined,
    disabled: true,
    help: undefined
  }
}`,...s.parameters?.docs?.source},description:{story:`Disabled.`,...s.parameters?.docs?.description}}},c=[`Default`,`Selected`,`Invalid`,`Disabled`]}))();export{i as Default,s as Disabled,o as Invalid,a as Selected,c as __namedExportsOrder,r as default};