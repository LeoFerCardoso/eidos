import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{ei as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h;e((()=>{o=t(n(),1),a(),s=r(),c={title:`Forms/Checkbox`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:"A native checkbox with the Forge `.fc` visual box. Supports a label, a stacked description, sizes, and a visual indeterminate state."}}},args:{label:`Enable auto-deploy on merge`,size:`md`},argTypes:{label:{control:`text`},description:{control:`text`},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]},indeterminate:{control:`boolean`},disabled:{control:`boolean`},defaultChecked:{control:`boolean`}}},l={args:{defaultChecked:!0}},u={args:{label:`Require approval`,description:`A second reviewer must approve before this can merge.`,defaultChecked:!0}},d={render:()=>(0,s.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:12},children:[`sm`,`md`,`lg`].map(e=>(0,s.jsx)(i,{size:e,label:`Size ${e}`,defaultChecked:!0},e))})},f={args:{label:`Select all services`,indeterminate:!0}},p={render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:12},children:[(0,s.jsx)(i,{label:`Disabled, checked`,defaultChecked:!0,disabled:!0}),(0,s.jsx)(i,{label:`Disabled, unchecked`,disabled:!0})]})},m={render:()=>{function e(){let e=[`identity-svc`,`pix-router`,`bureau-gateway`],[t,n]=o.useState([`pix-router`]),r=t.length===e.length;return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:10},children:[(0,s.jsx)(i,{label:`All services`,checked:r,indeterminate:t.length>0&&!r,onChange:t=>n(t.target.checked?e.slice():[])}),(0,s.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:8,paddingInlineStart:24},children:e.map(e=>(0,s.jsx)(i,{label:e,checked:t.includes(e),onChange:t=>n(n=>t.target.checked?[...n,e]:n.filter(t=>t!==e))},e))})]})}return(0,s.jsx)(e,{})}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    defaultChecked: true
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Require approval',
    description: 'A second reviewer must approve before this can merge.',
    defaultChecked: true
  }
}`,...u.parameters?.docs?.source},description:{story:`With a secondary description line (stacked layout).`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  }}>
      {(['sm', 'md', 'lg'] as const).map(s => <Checkbox key={s} size={s} label={\`Size \${s}\`} defaultChecked />)}
    </div>
}`,...d.parameters?.docs?.source},description:{story:`The three sizes.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Select all services',
    indeterminate: true
  }
}`,...f.parameters?.docs?.source},description:{story:`Indeterminate — the "some selected" parent state.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  }}>
      <Checkbox label="Disabled, checked" defaultChecked disabled />
      <Checkbox label="Disabled, unchecked" disabled />
    </div>
}`,...p.parameters?.docs?.source},description:{story:`Disabled (checked + unchecked).`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    function Demo() {
      const items = ['identity-svc', 'pix-router', 'bureau-gateway'];
      const [checked, setChecked] = React.useState<string[]>(['pix-router']);
      const all = checked.length === items.length;
      const some = checked.length > 0 && !all;
      return <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}>
          <Checkbox label="All services" checked={all} indeterminate={some} onChange={e => setChecked(e.target.checked ? items.slice() : [])} />
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          paddingInlineStart: 24
        }}>
            {items.map(it => <Checkbox key={it} label={it} checked={checked.includes(it)} onChange={e => setChecked(c => e.target.checked ? [...c, it] : c.filter(x => x !== it))} />)}
          </div>
        </div>;
    }
    return <Demo />;
  }
}`,...m.parameters?.docs?.source},description:{story:`A "select all" parent driving children — the canonical indeterminate use.`,...m.parameters?.docs?.description}}},h=[`Default`,`WithDescription`,`Sizes`,`Indeterminate`,`Disabled`,`SelectAll`]}))();export{l as Default,p as Disabled,f as Indeterminate,m as SelectAll,d as Sizes,u as WithDescription,h as __namedExportsOrder,c as default};