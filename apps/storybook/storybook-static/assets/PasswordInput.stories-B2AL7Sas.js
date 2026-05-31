import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{c as i,o as a,s as o,t as s}from"./src-DgoylXRw.js";var c,l,u,d,f,p,m,h,g,_,v,y;e((()=>{c=t(n(),1),s(),l=r(),u={title:`Forms/PasswordInput`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:'A password field with a trailing show/hide toggle. Pass `showStrength` to add a segmented strength bar and a requirements checklist below the field. The strength score derives from how many `requirements` pass. The toggle uses `aria-pressed` and `aria-label`; the strength label uses `aria-live="polite"`.'}}},args:{label:`Password`,placeholder:`••••••••`,help:`Choose a strong password.`},argTypes:{label:{control:`text`},help:{control:`text`},error:{control:`text`},disabled:{control:`boolean`},showStrength:{control:`boolean`},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]}}},d={render:e=>{let[t,n]=c.useState(``);return(0,l.jsx)(`div`,{style:{maxWidth:380},children:(0,l.jsx)(i,{...e,value:t,onChange:e=>n(e.target.value)})})}},f={args:{showStrength:!0,help:void 0}},p={render:e=>{let[t,n]=c.useState(``);return(0,l.jsx)(`div`,{style:{maxWidth:380},children:(0,l.jsx)(i,{...e,label:`New password`,value:t,onChange:e=>n(e.target.value),showStrength:!0,requirements:a,help:void 0,placeholder:`Choose a password`})})}},m={render:()=>(0,l.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:16,maxWidth:380},children:[(0,l.jsx)(i,{label:`Small`,size:`sm`,placeholder:`••••••••`}),(0,l.jsx)(i,{label:`Medium`,size:`md`,placeholder:`••••••••`}),(0,l.jsx)(i,{label:`Large`,size:`lg`,placeholder:`••••••••`})]})},h={args:{error:`Password must be at least 8 characters.`,value:`abc`,help:void 0}},g={args:{disabled:!0,value:`my-secret`,help:void 0}},_={render:()=>(0,l.jsx)(`div`,{dir:`rtl`,style:{maxWidth:380},children:(0,l.jsx)(i,{label:`كلمة المرور`,placeholder:`••••••••`,help:`اختر كلمة مرور قوية.`,showStrength:!0,requirements:a})})},v={render:()=>{let[e,t]=c.useState(``);return(0,l.jsx)(`div`,{style:{maxWidth:380},children:(0,l.jsx)(o,{label:`Create password`,value:e,onChange:e=>t(e.target.value),placeholder:`Choose a password`})})}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [value, setValue] = React.useState('');
    return <div style={{
      maxWidth: 380
    }}>
        <PasswordInput {...args} value={value} onChange={e => setValue(e.target.value)} />
      </div>;
  }
}`,...d.parameters?.docs?.source},description:{story:`Default show/hide toggle. Uses local state so typing updates the field live.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    showStrength: true,
    help: undefined
  }
}`,...f.parameters?.docs?.source},description:{story:`With strength bar — score updates as you type.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [value, setValue] = React.useState('');
    return <div style={{
      maxWidth: 380
    }}>
        <PasswordInput {...args} label="New password" value={value} onChange={e => setValue(e.target.value)} showStrength requirements={DEFAULT_PASSWORD_REQUIREMENTS} help={undefined} placeholder="Choose a password" />
      </div>;
  }
}`,...p.parameters?.docs?.source},description:{story:`Live requirements — type to see the checklist update in real time.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    maxWidth: 380
  }}>
      <PasswordInput label="Small" size="sm" placeholder="••••••••" />
      <PasswordInput label="Medium" size="md" placeholder="••••••••" />
      <PasswordInput label="Large" size="lg" placeholder="••••••••" />
    </div>
}`,...m.parameters?.docs?.source},description:{story:`Small, medium, and large sizes.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    error: 'Password must be at least 8 characters.',
    value: 'abc',
    help: undefined
  }
}`,...h.parameters?.docs?.source},description:{story:`Invalid / error state.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    value: 'my-secret',
    help: undefined
  }
}`,...g.parameters?.docs?.source},description:{story:`Disabled — toggle is inert.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <div dir="rtl" style={{
    maxWidth: 380
  }}>
      <PasswordInput label="كلمة المرور" placeholder="••••••••" help="اختر كلمة مرور قوية." showStrength requirements={DEFAULT_PASSWORD_REQUIREMENTS} />
    </div>
}`,..._.parameters?.docs?.source},description:{story:`RTL direction.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = React.useState('');
    return <div style={{
      maxWidth: 380
    }}>
        <PasswordField label="Create password" value={value} onChange={e => setValue(e.target.value)} placeholder="Choose a password" />
      </div>;
  }
}`,...v.parameters?.docs?.source},description:{story:`PasswordField convenience composite (showStrength + defaults baked in).`,...v.parameters?.docs?.description}}},y=[`Default`,`WithStrength`,`WithRequirements`,`Sizes`,`Invalid`,`Disabled`,`RTL`,`CompositePasswordField`]}))();export{v as CompositePasswordField,d as Default,g as Disabled,h as Invalid,_ as RTL,m as Sizes,p as WithRequirements,f as WithStrength,y as __namedExportsOrder,u as default};