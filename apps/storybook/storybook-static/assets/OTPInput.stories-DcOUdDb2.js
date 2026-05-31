import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{oi as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m;e((()=>{o=t(n(),1),a(),s=r(),c={title:`Forms/OTPInput`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:"A row of single-character cells for one-time codes. Auto-advances on input, retreats on Backspace, supports arrow-key navigation, and spreads a pasted code across cells. Cells request the `one-time-code` autofill hint."}}},args:{length:6,groupEvery:0,size:`md`},argTypes:{length:{control:{type:`number`,min:4,max:8}},groupEvery:{control:{type:`number`,min:0,max:4}},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]},invalid:{control:`boolean`},disabled:{control:`boolean`}}},l={},u={args:{length:6,groupEvery:3}},d={args:{defaultValue:`1234`,invalid:!0}},f={args:{defaultValue:`482915`,disabled:!0}},p={render:()=>{function e(){let[e,t]=o.useState(``),n=e.length===6;return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:12},children:[(0,s.jsx)(i,{length:6,value:e,onChange:t,invalid:n&&e!==`123456`}),(0,s.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:n?`var(--ember)`:`var(--fg-muted)`},children:n?e===`123456`?`✓ verified`:`✗ incorrect`:`${e.length}/6`})]})}return(0,s.jsx)(e,{})}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    length: 6,
    groupEvery: 3
  }
}`,...u.parameters?.docs?.source},description:{story:`Grouped 3 + 3 with a separator.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: '1234',
    invalid: true
  }
}`,...d.parameters?.docs?.source},description:{story:`Invalid (wrong code) state.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: '482915',
    disabled: true
  }
}`,...f.parameters?.docs?.source},description:{story:`Disabled.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    function Demo() {
      const [code, setCode] = React.useState('');
      const done = code.length === 6;
      return <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}>
          <OTPInput length={6} value={code} onChange={setCode} invalid={done && code !== '123456'} />
          <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: done ? 'var(--ember)' : 'var(--fg-muted)'
        }}>
            {done ? code === '123456' ? '✓ verified' : '✗ incorrect' : \`\${code.length}/6\`}
          </span>
        </div>;
    }
    return <Demo />;
  }
}`,...p.parameters?.docs?.source},description:{story:`Controlled — completes when all cells are filled.`,...p.parameters?.docs?.description}}},m=[`Default`,`Grouped`,`Invalid`,`Disabled`,`Controlled`]}))();export{p as Controlled,l as Default,f as Disabled,u as Grouped,d as Invalid,m as __namedExportsOrder,c as default};