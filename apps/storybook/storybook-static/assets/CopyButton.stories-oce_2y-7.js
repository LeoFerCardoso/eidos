import{i as e}from"./preload-helper-xPQekRTU.js";import{la as t,t as n}from"./src-DgoylXRw.js";var r,i,a,o,s;e((()=>{n(),r={title:`Primitives/CopyButton`,component:t,tags:[`autodocs`],parameters:{docs:{description:{component:'A small icon+label button that writes `text` to the clipboard. Flips to a "Copied" confirmation state for 1.4 s then resets automatically.'}}},args:{text:`npm install @forge/ui`,label:`Copy`},argTypes:{text:{control:`text`,description:`The string that will be written to the clipboard.`},label:{control:`text`,description:`Button label — defaults to "Copy".`}}},i={},a={args:{text:`--ember`,label:`var`}},o={args:{text:`var(--accent)`,label:`Copy token`}},i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{}`,...i.parameters?.docs?.source},description:{story:`Default state — idle, ready to copy.`,...i.parameters?.docs?.description}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    text: '--ember',
    label: 'var'
  }
}`,...a.parameters?.docs?.source},description:{story:`Custom label — useful when copying a token name rather than code.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    text: 'var(--accent)',
    label: 'Copy token'
  }
}`,...o.parameters?.docs?.source},description:{story:`Minimal — no label prop means default label "Copy" is shown.`,...o.parameters?.docs?.description}}},s=[`Default`,`CustomLabel`,`CopyingAToken`]}))();export{o as CopyingAToken,a as CustomLabel,i as Default,s as __namedExportsOrder,r as default};