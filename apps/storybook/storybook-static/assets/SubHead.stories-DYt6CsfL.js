import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./jsx-runtime-CaZkqeYb.js";import{_a as n,t as r}from"./src-DgoylXRw.js";var i,a,o,s,c,l,u;e((()=>{r(),i=t(),a={title:`Docs/SubHead`,component:n,tags:[`autodocs`],parameters:{docs:{description:{component:'A semantic `<h2>` section heading that forms the page outline (TOC + screen readers). String children automatically get a slug `id` and a hover anchor `#` for deep-linking. An optional `meta` badge (e.g. "a11y", "rtl") appears to the right of the label.'}}},args:{children:`Usage`,meta:void 0},argTypes:{children:{control:`text`,description:`Section title (string recommended for auto-slug + anchor).`},meta:{control:`text`,description:`Optional badge label shown to the right — e.g. "a11y" or "rtl".`}}},o={},s={args:{children:`Accessibility`,meta:`a11y`}},c={args:{children:`Right-to-left`,meta:`rtl`}},l={render:()=>(0,i.jsxs)(`div`,{children:[(0,i.jsx)(n,{children:`Installation`}),(0,i.jsx)(n,{children:`Usage`}),(0,i.jsx)(n,{children:`Variants`}),(0,i.jsx)(n,{children:`States`}),(0,i.jsx)(n,{meta:`a11y`,children:`Accessibility`}),(0,i.jsx)(n,{meta:`rtl`,children:`Right-to-left`}),(0,i.jsx)(n,{children:`Anatomy`}),(0,i.jsx)(n,{children:`Do / Don't`}),(0,i.jsx)(n,{children:`API reference`})]})},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source},description:{story:`Plain section heading with a hover anchor.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Accessibility',
    meta: 'a11y'
  }
}`,...s.parameters?.docs?.source},description:{story:`With a meta badge — used for Accessibility and RTL sections.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Right-to-left',
    meta: 'rtl'
  }
}`,...c.parameters?.docs?.source},description:{story:`RTL meta badge variant.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div>
      <SubHead>Installation</SubHead>
      <SubHead>Usage</SubHead>
      <SubHead>Variants</SubHead>
      <SubHead>States</SubHead>
      <SubHead meta="a11y">Accessibility</SubHead>
      <SubHead meta="rtl">Right-to-left</SubHead>
      <SubHead>Anatomy</SubHead>
      <SubHead>{'Do / Don\\'t'}</SubHead>
      <SubHead>API reference</SubHead>
    </div>
}`,...l.parameters?.docs?.source},description:{story:`Multiple headings showing the page outline structure.`,...l.parameters?.docs?.description}}},u=[`Default`,`WithMeta`,`RtlBadge`,`PageOutline`]}))();export{o as Default,l as PageOutline,c as RtlBadge,s as WithMeta,u as __namedExportsOrder,a as default};