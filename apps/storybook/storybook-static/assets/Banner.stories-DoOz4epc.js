import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./jsx-runtime-CaZkqeYb.js";import{Wi as n,t as r}from"./src-DgoylXRw.js";var i,a,o,s,c,l,u,d,f;e((()=>{r(),i=t(),a=[`info`,`success`,`warning`,`danger`,`neutral`],o={title:`Elements/Banner`,component:n,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:'An inline message bar with a tone palette, a leading icon, optional CTA/dismiss, and a "custom" escape hatch. Danger banners announce as `role="alert"`; the rest are `role="status"`.'}}},args:{tone:`info`,title:`Heads up`,message:`A new pipeline template is available for this service.`,size:`md`},argTypes:{tone:{control:`inline-radio`,options:[...a,`custom`]},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]},title:{control:`text`},message:{control:`text`}}},s={},c={render:()=>(0,i.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:12},children:a.map(e=>(0,i.jsx)(n,{tone:e,title:e[0].toUpperCase()+e.slice(1),message:`This is a ${e} banner.`},e))})},l={args:{tone:`warning`,title:`Token expiring`,message:`Your registry token expires in 3 days.`,action:`Rotate now`,onAction:()=>{},onDismiss:()=>{}}},u={args:{tone:`neutral`,title:void 0,message:`Synced 2 minutes ago.`,size:`sm`}},d={args:{tone:`custom`,title:`Ember`,message:`Custom surface with an ember accent border.`,bg:`var(--surface)`,fg:`var(--fg)`,accent:`var(--ember)`}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  }}>
      {TONES.map(tone => <Banner key={tone} tone={tone} title={tone[0].toUpperCase() + tone.slice(1)} message={\`This is a \${tone} banner.\`} />)}
    </div>
}`,...c.parameters?.docs?.source},description:{story:`Every built-in tone.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    tone: 'warning',
    title: 'Token expiring',
    message: 'Your registry token expires in 3 days.',
    action: 'Rotate now',
    onAction: () => {},
    onDismiss: () => {}
  }
}`,...l.parameters?.docs?.source},description:{story:`With a primary action and a dismiss control.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    tone: 'neutral',
    title: undefined,
    message: 'Synced 2 minutes ago.',
    size: 'sm'
  }
}`,...u.parameters?.docs?.source},description:{story:`Message-only (no title), compact size.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    tone: 'custom',
    title: 'Ember',
    message: 'Custom surface with an ember accent border.',
    bg: 'var(--surface)',
    fg: 'var(--fg)',
    accent: 'var(--ember)'
  }
}`,...d.parameters?.docs?.source},description:{story:`The "custom" tone disables tinted chrome so you can supply bg / fg / accent.`,...d.parameters?.docs?.description}}},f=[`Default`,`AllTones`,`WithActions`,`MessageOnly`,`Custom`]}))();export{c as AllTones,d as Custom,s as Default,u as MessageOnly,l as WithActions,f as __namedExportsOrder,o as default};