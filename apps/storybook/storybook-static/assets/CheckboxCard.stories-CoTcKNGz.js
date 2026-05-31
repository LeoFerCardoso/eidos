import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{n as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h,g;e((()=>{o=t(n(),1),a(),s=r(),c={title:`Forms/CheckboxCard`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:`A clickable card that wraps a DS Checkbox. The entire card is the selection target — clicking anywhere toggles. Selected state: ember-soft tint + ember border. Supports horizontal (default) and vertical orientations.`}}},args:{title:`Enable auto-deploy on merge`,description:`Automatically deploy when the PR is merged to main.`,orientation:`horizontal`,disabled:!1},argTypes:{orientation:{control:`inline-radio`,options:[`horizontal`,`vertical`]},disabled:{control:`boolean`}}},l={args:{defaultChecked:!0}},u={args:{orientation:`vertical`,defaultChecked:!0}},d={args:{defaultChecked:!1}},f={render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:10},children:[(0,s.jsx)(i,{title:`Disabled, checked`,description:`This option is unavailable.`,defaultChecked:!0,disabled:!0}),(0,s.jsx)(i,{title:`Disabled, unchecked`,description:`This option is also unavailable.`,disabled:!0})]})},p={render:()=>{function e(){let e=[{value:`canary`,title:`Canary deploys`,description:`Route a small traffic slice first, then ramp.`},{value:`feature-flags`,title:`Feature flags`,description:`Toggle features independently of deploys.`},{value:`rollback`,title:`Auto-rollback`,description:`Revert automatically if error rate spikes.`}],[t,n]=o.useState([`canary`]),r=e=>n(t=>t.includes(e)?t.filter(t=>t!==e):[...t,e]);return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:8,maxWidth:400},children:[e.map(e=>(0,s.jsx)(i,{title:e.title,description:e.description,checked:t.includes(e.value),onCheckedChange:()=>r(e.value)},e.value)),(0,s.jsxs)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-muted)`},children:[`selected: [`,t.join(`, `),`]`]})]})}return(0,s.jsx)(e,{})}},m={render:()=>{function e(){let e=[{value:`canary`,title:`Canary`,description:`Route a small slice first.`},{value:`flags`,title:`Feature flags`,description:`Toggle independently.`},{value:`rollback`,title:`Auto-rollback`,description:`Revert on error spike.`}],[t,n]=o.useState([`canary`]),r=e=>n(t=>t.includes(e)?t.filter(t=>t!==e):[...t,e]);return(0,s.jsx)(`div`,{style:{display:`flex`,flexDirection:`row`,gap:10,flexWrap:`wrap`},children:e.map(e=>(0,s.jsx)(i,{orientation:`vertical`,title:e.title,description:e.description,checked:t.includes(e.value),onCheckedChange:()=>r(e.value),style:{minWidth:140}},e.value))})}return(0,s.jsx)(e,{})}},h={render:()=>(0,s.jsxs)(`div`,{dir:`rtl`,style:{display:`flex`,flexDirection:`column`,gap:8,maxWidth:380},children:[(0,s.jsx)(i,{title:`النشر التلقائي عند الدمج`,description:`نشر تلقائي عند دمج طلب السحب إلى الفرع الرئيسي.`,defaultChecked:!0}),(0,s.jsx)(i,{title:`العلامات الميزة`,description:`تبديل الميزات بشكل مستقل عن عمليات النشر.`})]})},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    defaultChecked: true
  }
}`,...l.parameters?.docs?.source},description:{story:`Horizontal layout — control + content in a row (default).`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    orientation: 'vertical',
    defaultChecked: true
  }
}`,...u.parameters?.docs?.source},description:{story:`Vertical layout — control on top, content below.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    defaultChecked: false
  }
}`,...d.parameters?.docs?.source},description:{story:`Unchecked state — no tint, standard surface.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  }}>
      <CheckboxCard title="Disabled, checked" description="This option is unavailable." defaultChecked disabled />
      <CheckboxCard title="Disabled, unchecked" description="This option is also unavailable." disabled />
    </div>
}`,...f.parameters?.docs?.source},description:{story:`Disabled — pointer-events off, opacity reduced.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    function Demo() {
      const options = [{
        value: 'canary',
        title: 'Canary deploys',
        description: 'Route a small traffic slice first, then ramp.'
      }, {
        value: 'feature-flags',
        title: 'Feature flags',
        description: 'Toggle features independently of deploys.'
      }, {
        value: 'rollback',
        title: 'Auto-rollback',
        description: 'Revert automatically if error rate spikes.'
      }];
      const [selected, setSelected] = React.useState<string[]>(['canary']);
      const toggle = (v: string) => setSelected(s => s.includes(v) ? s.filter(x => x !== v) : [...s, v]);
      return <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        maxWidth: 400
      }}>
          {options.map(o => <CheckboxCard key={o.value} title={o.title} description={o.description} checked={selected.includes(o.value)} onCheckedChange={() => toggle(o.value)} />)}
          <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--fg-muted)'
        }}>
            selected: [{selected.join(', ')}]
          </span>
        </div>;
    }
    return <Demo />;
  }
}`,...p.parameters?.docs?.source},description:{story:`Multi-select set — three CheckboxCards, independently toggleable.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    function Demo() {
      const options = [{
        value: 'canary',
        title: 'Canary',
        description: 'Route a small slice first.'
      }, {
        value: 'flags',
        title: 'Feature flags',
        description: 'Toggle independently.'
      }, {
        value: 'rollback',
        title: 'Auto-rollback',
        description: 'Revert on error spike.'
      }];
      const [selected, setSelected] = React.useState<string[]>(['canary']);
      const toggle = (v: string) => setSelected(s => s.includes(v) ? s.filter(x => x !== v) : [...s, v]);
      return <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap'
      }}>
          {options.map(o => <CheckboxCard key={o.value} orientation="vertical" title={o.title} description={o.description} checked={selected.includes(o.value)} onCheckedChange={() => toggle(o.value)} style={{
          minWidth: 140
        }} />)}
        </div>;
    }
    return <Demo />;
  }
}`,...m.parameters?.docs?.source},description:{story:`Multi-select set in vertical card orientation.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div dir="rtl" style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    maxWidth: 380
  }}>
      <CheckboxCard title="النشر التلقائي عند الدمج" description="نشر تلقائي عند دمج طلب السحب إلى الفرع الرئيسي." defaultChecked />
      <CheckboxCard title="العلامات الميزة" description="تبديل الميزات بشكل مستقل عن عمليات النشر." />
    </div>
}`,...h.parameters?.docs?.source},description:{story:`RTL — layout mirrors under right-to-left text direction.`,...h.parameters?.docs?.description}}},g=[`Horizontal`,`Vertical`,`Unchecked`,`Disabled`,`MultiSelect`,`MultiSelectVertical`,`RTL`]}))();export{f as Disabled,l as Horizontal,p as MultiSelect,m as MultiSelectVertical,h as RTL,d as Unchecked,u as Vertical,g as __namedExportsOrder,c as default};