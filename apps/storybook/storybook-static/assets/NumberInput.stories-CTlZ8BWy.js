import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{ai as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x;e((()=>{o=t(n(),1),a(),s=r(),c={title:`Forms/NumberInput`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:'A native `<input type="number">` in the Forge field shell. The browser spinner is hidden; an explicit stepper is the affordance. Supports a `stacked` (default) or `split` layout. A `meter` prop renders a thin progress bar below the field within [min, max].'}}},args:{label:`Replicas`,defaultValue:3,min:0,max:20,step:1,help:`Pods to run for this service.`},argTypes:{label:{control:`text`},help:{control:`text`},error:{control:`text`},stepper:{control:`boolean`},layout:{control:`inline-radio`,options:[`stacked`,`split`]},meter:{control:`boolean`},step:{control:`number`},disabled:{control:`boolean`},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]}}},l={},u={render:()=>{let[e,t]=o.useState(3);return(0,s.jsx)(`div`,{style:{maxWidth:260},children:(0,s.jsx)(i,{label:`Quantity`,value:e,min:0,max:99,step:1,layout:`split`,help:`Horizontal ± buttons — value is the focal point.`,onChange:e=>t(Number(e.target.value))})})}},d={render:()=>{let[e,t]=o.useState(25),[n,r]=o.useState(50);return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:20,maxWidth:340},children:[(0,s.jsx)(i,{label:`CPU allocation (step 5)`,value:e,min:0,max:100,step:5,suffix:`%`,help:`Steps by 5 — use ↑/↓ keys or the stepper.`,onChange:e=>t(Number(e.target.value))}),(0,s.jsx)(i,{label:`Memory burst (step 10)`,value:n,min:0,max:200,step:10,suffix:` MB`,help:`Steps by 10.`,onChange:e=>r(Number(e.target.value))})]})}},f={render:()=>{let[e,t]=o.useState(40),[n,r]=o.useState(20);return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:24,maxWidth:340},children:[(0,s.jsx)(i,{label:`Discount`,value:e,min:0,max:100,step:1,suffix:`%`,meter:!0,help:`Bar reflects current percentage.`,onChange:e=>t(Number(e.target.value))}),(0,s.jsx)(i,{label:`Volume (GB)`,value:n,min:0,max:100,step:5,meter:!0,help:`Bar fills proportionally from 0 to 100 GB.`,onChange:e=>r(Number(e.target.value))})]})}},p={render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:20,maxWidth:340},children:[(0,s.jsx)(i,{label:`Small (28px)`,defaultValue:3,min:0,max:20,size:`sm`}),(0,s.jsx)(i,{label:`Default (36px)`,defaultValue:3,min:0,max:20,size:`md`}),(0,s.jsx)(i,{label:`Large (44px)`,defaultValue:3,min:0,max:20,size:`lg`})]})},m={render:()=>{let[e,t]=o.useState(3),n=e<1||e>10;return(0,s.jsx)(`div`,{style:{maxWidth:260},children:(0,s.jsx)(i,{label:`Retry count`,value:e,min:1,max:10,step:1,meter:!0,error:n?`Must be between 1 and 10`:void 0,help:n?void 0:`Allowed range: 1–10`,onChange:e=>t(Number(e.target.value))})})}},h={args:{stepper:!1,help:void 0}},g={args:{label:`Memory`,defaultValue:512,step:128,suffix:`MB`,help:void 0}},_={args:{label:`Replicas`,defaultValue:99,error:`Max is 20 for this tier.`,help:void 0}},v={args:{defaultValue:3,disabled:!0,help:void 0}},y={render:()=>(0,s.jsxs)(`div`,{dir:`rtl`,style:{maxWidth:340,display:`flex`,flexDirection:`column`,gap:20},children:[(0,s.jsx)(i,{label:`عدد المثيلات (Replicas)`,defaultValue:3,min:1,max:99,step:1,layout:`stacked`,help:`المحرك يصطف على الحافة المتأخرة`}),(0,s.jsx)(i,{label:`الكمية (Quantity)`,defaultValue:5,min:0,max:99,step:1,layout:`split`,help:`الأزرار تنقلب في RTL`})]})},b={render:()=>{function e(){let[e,t]=o.useState(3);return(0,s.jsx)(i,{label:`Replicas: ${e}`,value:e,min:0,max:20,onChange:e=>t(Number(e.target.value))})}return(0,s.jsx)(e,{})}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source},description:{story:`Default — stacked stepper on the trailing edge.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [n, setN] = React.useState(3);
    return <div style={{
      maxWidth: 260
    }}>
        <NumberInput label="Quantity" value={n} min={0} max={99} step={1} layout="split" help="Horizontal ± buttons — value is the focal point." onChange={e => setN(Number(e.target.value))} />
      </div>;
  }
}`,...u.parameters?.docs?.source},description:{story:`Split layout — "−" button on the leading edge, "+" on the trailing edge.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [a, setA] = React.useState(25);
    const [b, setB] = React.useState(50);
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      maxWidth: 340
    }}>
        <NumberInput label="CPU allocation (step 5)" value={a} min={0} max={100} step={5} suffix="%" help="Steps by 5 — use ↑/↓ keys or the stepper." onChange={e => setA(Number(e.target.value))} />
        <NumberInput label="Memory burst (step 10)" value={b} min={0} max={200} step={10} suffix=" MB" help="Steps by 10." onChange={e => setB(Number(e.target.value))} />
      </div>;
  }
}`,...d.parameters?.docs?.source},description:{story:`Custom steps — step=5 and step=10.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [pct, setPct] = React.useState(40);
    const [vol, setVol] = React.useState(20);
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      maxWidth: 340
    }}>
        <NumberInput label="Discount" value={pct} min={0} max={100} step={1} suffix="%" meter help="Bar reflects current percentage." onChange={e => setPct(Number(e.target.value))} />
        <NumberInput label="Volume (GB)" value={vol} min={0} max={100} step={5} meter help="Bar fills proportionally from 0 to 100 GB." onChange={e => setVol(Number(e.target.value))} />
      </div>;
  }
}`,...f.parameters?.docs?.source},description:{story:`With progress meter reflecting value within [min, max].`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    maxWidth: 340
  }}>
      <NumberInput label="Small (28px)" defaultValue={3} min={0} max={20} size="sm" />
      <NumberInput label="Default (36px)" defaultValue={3} min={0} max={20} size="md" />
      <NumberInput label="Large (44px)" defaultValue={3} min={0} max={20} size="lg" />
    </div>
}`,...p.parameters?.docs?.source},description:{story:`Three sizes — sm / md / lg.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [n, setN] = React.useState(3);
    const invalid = n < 1 || n > 10;
    return <div style={{
      maxWidth: 260
    }}>
        <NumberInput label="Retry count" value={n} min={1} max={10} step={1} meter error={invalid ? 'Must be between 1 and 10' : undefined} help={!invalid ? 'Allowed range: 1–10' : undefined} onChange={e => setN(Number(e.target.value))} />
      </div>;
  }
}`,...m.parameters?.docs?.source},description:{story:`Enforced min / max — shows constraint in help text.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    stepper: false,
    help: undefined
  }
}`,...h.parameters?.docs?.source},description:{story:`Without the stepper buttons — type-only.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Memory',
    defaultValue: 512,
    step: 128,
    suffix: 'MB',
    help: undefined
  }
}`,...g.parameters?.docs?.source},description:{story:`With a prefix/suffix addon.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Replicas',
    defaultValue: 99,
    error: 'Max is 20 for this tier.',
    help: undefined
  }
}`,..._.parameters?.docs?.source},description:{story:`Error state.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: 3,
    disabled: true,
    help: undefined
  }
}`,...v.parameters?.docs?.source},description:{story:`Disabled.`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <div dir="rtl" style={{
    maxWidth: 340,
    display: 'flex',
    flexDirection: 'column',
    gap: 20
  }}>
      <NumberInput label="عدد المثيلات (Replicas)" defaultValue={3} min={1} max={99} step={1} layout="stacked" help="المحرك يصطف على الحافة المتأخرة" />
      <NumberInput label="الكمية (Quantity)" defaultValue={5} min={0} max={99} step={1} layout="split" help="الأزرار تنقلب في RTL" />
    </div>
}`,...y.parameters?.docs?.source},description:{story:`RTL — affixes and steppers flip, numerals stay LTR.`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => {
    function Demo() {
      const [n, setN] = React.useState(3);
      return <NumberInput label={\`Replicas: \${n}\`} value={n} min={0} max={20} onChange={e => setN(Number(e.target.value))} />;
    }
    return <Demo />;
  }
}`,...b.parameters?.docs?.source},description:{story:`Controlled.`,...b.parameters?.docs?.description}}},x=[`Default`,`Split`,`Steps`,`WithMeter`,`Sizes`,`MinMax`,`NoStepper`,`WithAffix`,`Invalid`,`Disabled`,`RTL`,`Controlled`]}))();export{b as Controlled,l as Default,v as Disabled,_ as Invalid,m as MinMax,h as NoStepper,y as RTL,p as Sizes,u as Split,d as Steps,g as WithAffix,f as WithMeter,x as __namedExportsOrder,c as default};