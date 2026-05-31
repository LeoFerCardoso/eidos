import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{o as i,s as a,t as o}from"./src-DgoylXRw.js";var s,c,l,u,d,f,p,m,h,g;e((()=>{s=t(n(),1),o(),c=r(),l={title:`Forms/PasswordField`,component:a,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:'`PasswordField` is the "new password" composite: a `PasswordInput` with the segmented strength bar and requirements checklist always enabled. Use it on registration, password-reset, and API-key creation forms where guiding the user toward a strong credential is the primary goal. Supply custom `requirements` for service-specific policies (e.g., 16-char minimum for privileged service accounts). The strength score is derived from how many requirements pass; the `aria-live` label announces the score to assistive technology as the user types.'}}},args:{label:`New password`,placeholder:`••••••••`},argTypes:{label:{control:`text`},help:{control:`text`},error:{control:`text`},disabled:{control:`boolean`},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]},requirements:{control:!1}}},u={render:e=>{let[t,n]=s.useState(``);return(0,c.jsx)(`div`,{style:{maxWidth:400},children:(0,c.jsx)(a,{...e,value:t,onChange:e=>n(e.target.value)})})}},d={render:()=>{let[e,t]=s.useState(`Forge$2026`);return(0,c.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:32,maxWidth:400},children:[(0,c.jsx)(a,{label:`New password (empty)`,placeholder:`••••••••`}),(0,c.jsx)(a,{label:`New password (fair)`,defaultValue:`abc123`,help:`Keep going — add an uppercase letter and more characters.`}),(0,c.jsx)(a,{label:`New password (very strong)`,value:e,onChange:e=>t(e.target.value),help:`Meets all deployment-key policy requirements.`}),(0,c.jsx)(a,{label:`New password (error)`,defaultValue:`abc123`,error:`Password was found in a breach database. Choose a different one.`}),(0,c.jsx)(a,{label:`Service account secret (disabled)`,value:`••••••••••••••••`,disabled:!0})]})}},f={render:()=>(0,c.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:32,maxWidth:400},children:[(0,c.jsx)(a,{label:`Small — API key rotation`,size:`sm`,placeholder:`••••••••`,help:`Used in compact side-panels.`}),(0,c.jsx)(a,{label:`Medium — account registration`,size:`md`,placeholder:`••••••••`,help:`Default scale; fits standard form layouts.`}),(0,c.jsx)(a,{label:`Large — onboarding flow`,size:`lg`,placeholder:`••••••••`,help:`Draws attention on full-page setup steps.`})]})},p={render:()=>{let e=[{label:`16+ characters`,test:e=>e.length>=16},{label:`At least 1 uppercase`,test:e=>/[A-Z]/.test(e)},{label:`At least 1 lowercase`,test:e=>/[a-z]/.test(e)},{label:`At least 1 digit`,test:e=>/\d/.test(e)},{label:`At least 1 symbol (!@#$)`,test:e=>/[!@#$%^&*]/.test(e)}],[t,n]=s.useState(``);return(0,c.jsx)(`div`,{style:{maxWidth:400},children:(0,c.jsx)(a,{label:`Service account secret`,placeholder:`••••••••••••••••`,requirements:e,value:t,onChange:e=>n(e.target.value),help:`Privileged accounts require a 16-character minimum with symbols.`})})}},m={render:e=>{let[t,n]=s.useState(``);return(0,c.jsx)(`div`,{style:{maxWidth:400},children:(0,c.jsx)(a,{...e,requirements:i,value:t,onChange:e=>n(e.target.value),help:`Default policy: 8 chars, uppercase, lowercase, digit.`})})}},h={render:()=>{let[e,t]=s.useState(``);return(0,c.jsx)(`div`,{dir:`rtl`,style:{maxWidth:400},children:(0,c.jsx)(a,{label:`كلمة مرور جديدة`,placeholder:`••••••••`,value:e,onChange:e=>t(e.target.value),help:`اختر كلمة مرور قوية تفي بجميع المتطلبات.`})})}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [value, setValue] = React.useState('');
    return <div style={{
      maxWidth: 400
    }}>
        <PasswordField {...args} value={value} onChange={e => setValue(e.target.value)} />
      </div>;
  }
}`,...u.parameters?.docs?.source},description:{story:`Minimal controlled usage. Type into the field to watch the segmented bar and
requirements checklist update live. The strength label is announced via
\`aria-live="polite"\` on each change.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [val, setVal] = React.useState('Forge$2026');
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 32,
      maxWidth: 400
    }}>
        {/* Empty — bar is dormant */}
        <PasswordField label="New password (empty)" placeholder="••••••••" />

        {/* Fair — only 2/4 requirements satisfied */}
        <PasswordField label="New password (fair)" defaultValue="abc123" help="Keep going — add an uppercase letter and more characters." />

        {/* Controlled, very strong — all 4 requirements satisfied */}
        <PasswordField label="New password (very strong)" value={val} onChange={e => setVal(e.target.value)} help="Meets all deployment-key policy requirements." />

        {/* Error — policy violation returned from API */}
        <PasswordField label="New password (error)" defaultValue="abc123" error="Password was found in a breach database. Choose a different one." />

        {/* Disabled — shown on a locked service account */}
        <PasswordField label="Service account secret (disabled)" value="••••••••••••••••" disabled />
      </div>;
  }
}`,...d.parameters?.docs?.source},description:{story:`All meaningful states side-by-side: empty (default), partially filled (fair
strength), fully satisfied (very strong), error (policy mismatch on a
credential-reset form), and disabled (read-only service token display).`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
    maxWidth: 400
  }}>
      <PasswordField label="Small — API key rotation" size="sm" placeholder="••••••••" help="Used in compact side-panels." />
      <PasswordField label="Medium — account registration" size="md" placeholder="••••••••" help="Default scale; fits standard form layouts." />
      <PasswordField label="Large — onboarding flow" size="lg" placeholder="••••••••" help="Draws attention on full-page setup steps." />
    </div>
}`,...f.parameters?.docs?.source},description:{story:"Three scale steps — `sm` for compact credential panels (e.g., an inline\nAPI-key rotation dialog), `md` (default) for standard registration flows,\nand `lg` for full-page onboarding where the field is the focal element.",...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    const serviceAccountPolicy: PasswordRequirement[] = [{
      label: '16+ characters',
      test: v => v.length >= 16
    }, {
      label: 'At least 1 uppercase',
      test: v => /[A-Z]/.test(v)
    }, {
      label: 'At least 1 lowercase',
      test: v => /[a-z]/.test(v)
    }, {
      label: 'At least 1 digit',
      test: v => /\\d/.test(v)
    }, {
      label: 'At least 1 symbol (!@#$)',
      test: v => /[!@#$%^&*]/.test(v)
    }];
    const [value, setValue] = React.useState('');
    return <div style={{
      maxWidth: 400
    }}>
        <PasswordField label="Service account secret" placeholder="••••••••••••••••" requirements={serviceAccountPolicy} value={value} onChange={e => setValue(e.target.value)} help="Privileged accounts require a 16-character minimum with symbols." />
      </div>;
  }
}`,...p.parameters?.docs?.source},description:{story:"Override the default requirements for a stricter service-account policy:\n16-character minimum, symbols required. Pass any `PasswordRequirement[]`\narray to `requirements` to replace the defaults entirely.",...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [value, setValue] = React.useState('');
    return <div style={{
      maxWidth: 400
    }}>
        <PasswordField {...args} requirements={DEFAULT_PASSWORD_REQUIREMENTS} value={value} onChange={e => setValue(e.target.value)} help="Default policy: 8 chars, uppercase, lowercase, digit." />
      </div>;
  }
}`,...m.parameters?.docs?.source},description:{story:`Explicit pass-through of \`DEFAULT_PASSWORD_REQUIREMENTS\` — identical to the
implicit default but useful in storybook controls for inspecting the built-in
baseline without any custom overrides.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = React.useState('');
    return <div dir="rtl" style={{
      maxWidth: 400
    }}>
        <PasswordField label="كلمة مرور جديدة" placeholder="••••••••" value={value} onChange={e => setValue(e.target.value)} help="اختر كلمة مرور قوية تفي بجميع المتطلبات." />
      </div>;
  }
}`,...h.parameters?.docs?.source},description:{story:`Right-to-left layout — the show/hide toggle moves to the leading (right) edge,
the strength bar fills left-to-right in LTR but is mirrored visually in RTL,
and the requirements checklist aligns to the paragraph direction.
The global direction toolbar in Storybook overrides this when set to RTL.`,...h.parameters?.docs?.description}}},g=[`Default`,`States`,`Sizes`,`CustomRequirements`,`DefaultRequirements`,`RTL`]}))();export{p as CustomRequirements,u as Default,m as DefaultRequirements,h as RTL,f as Sizes,d as States,g as __namedExportsOrder,l as default};