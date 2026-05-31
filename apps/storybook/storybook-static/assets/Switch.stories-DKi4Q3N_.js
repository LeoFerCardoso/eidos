import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{t as i,ui as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m;e((()=>{o=t(n(),1),i(),s=r(),c={title:`Forms/Switch`,component:a,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:'A binary setting that takes effect immediately — a native checkbox with `role="switch"` and the Forge toggle visual. Use for instant on/off, not for form submission choices (use Checkbox there).'}}},args:{label:`Auto-deploy on merge`,size:`md`},argTypes:{label:{control:`text`},description:{control:`text`},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]},invalid:{control:`boolean`},disabled:{control:`boolean`},defaultChecked:{control:`boolean`}}},l={args:{defaultChecked:!0}},u={args:{label:`Require signed commits`,description:`Reject pushes whose commits are not GPG-signed.`,defaultChecked:!0}},d={render:()=>(0,s.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:12},children:[`sm`,`md`,`lg`].map(e=>(0,s.jsx)(a,{size:e,label:`Size ${e}`,defaultChecked:!0},e))})},f={render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:12},children:[(0,s.jsx)(a,{label:`Disabled, on`,defaultChecked:!0,disabled:!0}),(0,s.jsx)(a,{label:`Disabled, off`,disabled:!0})]})},p={render:()=>{function e(){let[e,t]=o.useState(!0);return(0,s.jsx)(a,{label:`Auto-deploy is ${e?`on`:`off`}`,checked:e,onChange:e=>t(e.target.checked)})}return(0,s.jsx)(e,{})}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    defaultChecked: true
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Require signed commits',
    description: 'Reject pushes whose commits are not GPG-signed.',
    defaultChecked: true
  }
}`,...u.parameters?.docs?.source},description:{story:`With a description (stacked layout).`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  }}>
      {(['sm', 'md', 'lg'] as const).map(s => <Switch key={s} size={s} label={\`Size \${s}\`} defaultChecked />)}
    </div>
}`,...d.parameters?.docs?.source},description:{story:`Sizes.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  }}>
      <Switch label="Disabled, on" defaultChecked disabled />
      <Switch label="Disabled, off" disabled />
    </div>
}`,...f.parameters?.docs?.source},description:{story:`Disabled (on + off).`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    function Demo() {
      const [on, setOn] = React.useState(true);
      return <Switch label={\`Auto-deploy is \${on ? 'on' : 'off'}\`} checked={on} onChange={e => setOn(e.target.checked)} />;
    }
    return <Demo />;
  }
}`,...p.parameters?.docs?.source},description:{story:`Controlled — flips live.`,...p.parameters?.docs?.description}}},m=[`Default`,`WithDescription`,`Sizes`,`Disabled`,`Controlled`]}))();export{p as Controlled,l as Default,f as Disabled,d as Sizes,u as WithDescription,m as __namedExportsOrder,c as default};