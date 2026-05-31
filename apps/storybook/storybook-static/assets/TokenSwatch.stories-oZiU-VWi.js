import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./jsx-runtime-CaZkqeYb.js";import{t as n,ya as r}from"./src-DgoylXRw.js";var i,a,o,s,c,l;e((()=>{n(),i=t(),a={title:`Docs/TokenSwatch`,component:r,tags:[`autodocs`],parameters:{docs:{description:{component:'A live token swatch that paints its color via `var(varName)` so it tracks the active theme. `value` is the dark-mode literal; `lightValue` (optional) shows both dark and light values in the meta row. Includes a "Copy var" button for quick token adoption.'}}},args:{name:`Ember / Accent`,value:`#FF6B35`,varName:`--ember`,lightValue:void 0},argTypes:{name:{control:`text`,description:`Human-readable token name.`},value:{control:`text`,description:`Dark-mode hex literal shown in the meta row.`},lightValue:{control:`text`,description:`Light-mode hex literal — when provided both values are shown.`},varName:{control:`text`,description:`CSS custom property name (e.g. "--ember").`}}},o={},s={args:{name:`Background`,value:`#08090A`,lightValue:`#FFFFFF`,varName:`--bg`}},c={render:()=>(0,i.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:4},children:[(0,i.jsx)(r,{name:`Ember / Accent`,value:`#FF6B35`,varName:`--ember`}),(0,i.jsx)(r,{name:`Background`,value:`#08090A`,lightValue:`#FFFFFF`,varName:`--bg`}),(0,i.jsx)(r,{name:`Foreground`,value:`#F5F5F5`,lightValue:`#08090A`,varName:`--fg`}),(0,i.jsx)(r,{name:`FG Muted`,value:`#9CA3AF`,lightValue:`#6B7280`,varName:`--fg-muted`}),(0,i.jsx)(r,{name:`FG Faint`,value:`#374151`,lightValue:`#D1D5DB`,varName:`--fg-faint`}),(0,i.jsx)(r,{name:`Surface`,value:`#111318`,lightValue:`#F9FAFB`,varName:`--surface`}),(0,i.jsx)(r,{name:`Surface 2`,value:`#1A1F2B`,lightValue:`#F3F4F6`,varName:`--surface2`}),(0,i.jsx)(r,{name:`Border`,value:`#1F2937`,lightValue:`#E5E7EB`,varName:`--border`}),(0,i.jsx)(r,{name:`Success`,value:`#22C55E`,varName:`--success`}),(0,i.jsx)(r,{name:`Warning`,value:`#F59E0B`,varName:`--warning`}),(0,i.jsx)(r,{name:`Error`,value:`#EF4444`,varName:`--error`})]})},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source},description:{story:`The ember accent — the single brand color used throughout the DS.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Background',
    value: '#08090A',
    lightValue: '#FFFFFF',
    varName: '--bg'
  }
}`,...s.parameters?.docs?.source},description:{story:`Dual-mode token — shows both dark and light values in the meta.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  }}>
      <TokenSwatch name="Ember / Accent" value="#FF6B35" varName="--ember" />
      <TokenSwatch name="Background" value="#08090A" lightValue="#FFFFFF" varName="--bg" />
      <TokenSwatch name="Foreground" value="#F5F5F5" lightValue="#08090A" varName="--fg" />
      <TokenSwatch name="FG Muted" value="#9CA3AF" lightValue="#6B7280" varName="--fg-muted" />
      <TokenSwatch name="FG Faint" value="#374151" lightValue="#D1D5DB" varName="--fg-faint" />
      <TokenSwatch name="Surface" value="#111318" lightValue="#F9FAFB" varName="--surface" />
      <TokenSwatch name="Surface 2" value="#1A1F2B" lightValue="#F3F4F6" varName="--surface2" />
      <TokenSwatch name="Border" value="#1F2937" lightValue="#E5E7EB" varName="--border" />
      <TokenSwatch name="Success" value="#22C55E" varName="--success" />
      <TokenSwatch name="Warning" value="#F59E0B" varName="--warning" />
      <TokenSwatch name="Error" value="#EF4444" varName="--error" />
    </div>
}`,...c.parameters?.docs?.source},description:{story:`A full palette of Forge semantic tokens.`,...c.parameters?.docs?.description}}},l=[`Default`,`DualMode`,`AllCoreTokens`]}))();export{c as AllCoreTokens,o as Default,s as DualMode,l as __namedExportsOrder,a as default};