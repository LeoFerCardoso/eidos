import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./jsx-runtime-CaZkqeYb.js";import{Wa as n,ri as r,t as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u,d,f;e((()=>{i(),a=t(),o={title:`Forms/Input`,component:r,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:`The everyday text-entry control: label + group (optional addons + native input) + helper/error row. A real <input> under the hood, so validation, form submission, and screen readers work for free.`}}},args:{label:`Service name`,placeholder:`identity-svc`,help:`Lowercase, hyphen-separated.`},argTypes:{label:{control:`text`},help:{control:`text`},error:{control:`text`},disabled:{control:`boolean`}}},s={},c={args:{label:`Repository`,prefix:(0,a.jsx)(n.search,{size:14}),suffix:`.git`,placeholder:`forge/design-system`,help:void 0}},l={args:{label:`Service name`,value:`Identity SVC`,error:`Use lowercase letters and hyphens only.`}},u={args:{label:`Service name`,value:`identity-svc`,disabled:!0,help:void 0}},d={render:()=>(0,a.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:16,maxWidth:360},children:[(0,a.jsx)(r,{label:`Email`,type:`email`,placeholder:`you@equifax.com`,prefix:(0,a.jsx)(n.inbox,{size:14})}),(0,a.jsx)(r,{label:`Password`,type:`password`,placeholder:`••••••••`,help:`At least 12 characters.`})]})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Repository',
    prefix: <Icons.search size={14} />,
    suffix: '.git',
    placeholder: 'forge/design-system',
    help: undefined
  }
}`,...c.parameters?.docs?.source},description:{story:`With leading + trailing addons.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Service name',
    value: 'Identity SVC',
    error: 'Use lowercase letters and hyphens only.'
  }
}`,...l.parameters?.docs?.source},description:{story:`Error state — danger ring + message, aria-invalid set.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Service name',
    value: 'identity-svc',
    disabled: true,
    help: undefined
  }
}`,...u.parameters?.docs?.source},description:{story:`Disabled.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    maxWidth: 360
  }}>
      <Input label="Email" type="email" placeholder="you@equifax.com" prefix={<Icons.inbox size={14} />} />
      <Input label="Password" type="password" placeholder="••••••••" help="At least 12 characters." />
    </div>
}`,...d.parameters?.docs?.source},description:{story:`A small login fragment, as on a real form.`,...d.parameters?.docs?.description}}},f=[`Default`,`WithAddons`,`Invalid`,`Disabled`,`InContext`]}))();export{s as Default,u as Disabled,d as InContext,l as Invalid,c as WithAddons,f as __namedExportsOrder,o as default};