import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{r as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h;e((()=>{o=t(n(),1),a(),s=r(),c={title:`Forms/RadioCard`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:"Single selection-card that wraps a native radio input — the entire card surface is the click target. Use inside a `RadioCardGroup` for a managed group (arrow-key navigation, single-tab-stop). Use standalone when you need fine-grained controlled state per card, e.g. a wizard step or a plan-picker with extra UI between cards. Selected state: ember-soft tint + ember border. Supports `horizontal` (default) and `vertical` card orientations."}}},args:{value:`canary`,title:`Canary deployment`,description:`Route 10 % of traffic to the new revision before full rollout.`,orientation:`horizontal`,checked:!1,disabled:!1},argTypes:{orientation:{control:`inline-radio`,options:[`horizontal`,`vertical`]},checked:{control:`boolean`},disabled:{control:`boolean`},onChange:{action:`changed`}}},l={},u={args:{checked:!0}},d={render:()=>{function e(){let[e,t]=o.useState(`blue-green`);return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:8,maxWidth:440},children:[[{value:`all-at-once`,title:`All at once`,description:`Fastest deploy; highest blast radius.`},{value:`blue-green`,title:`Blue / green`,description:`Stand up a parallel fleet and cut over.`},{value:`rolling`,title:`Rolling update`,description:`Replace instances one by one with zero downtime.`,disabled:!0}].map(n=>(0,s.jsx)(i,{value:n.value,title:n.title,description:n.description,checked:e===n.value,onChange:e=>t(e),name:`deploy-strategy-states`,disabled:n.disabled},n.value)),(0,s.jsxs)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-muted)`},children:[`selected: `,e??`—`]})]})}return(0,s.jsx)(e,{})}},f={render:()=>{function e(){let[e,t]=o.useState(`starter`);return(0,s.jsx)(`div`,{style:{display:`flex`,gap:8,flexWrap:`wrap`},children:[{value:`starter`,title:`Starter`,description:`Up to 3 services`},{value:`pro`,title:`Pro`,description:`Up to 20 services`},{value:`enterprise`,title:`Enterprise`,description:`Unlimited`}].map(n=>(0,s.jsx)(i,{value:n.value,title:n.title,description:n.description,orientation:`vertical`,checked:e===n.value,onChange:e=>t(e),name:`plan-picker`},n.value))})}return(0,s.jsx)(e,{})}},p={render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:8,maxWidth:440},children:[(0,s.jsx)(i,{value:`disabled-checked`,title:`Feature flags (unavailable)`,description:`Requires the Advanced add-on — contact sales.`,checked:!0,disabled:!0,name:`disabled-demo`}),(0,s.jsx)(i,{value:`disabled-unchecked`,title:`Snapshot rollback (unavailable)`,description:`Only available on Enterprise plans.`,checked:!1,disabled:!0,name:`disabled-demo`})]})},m={render:()=>{function e(){let[e,t]=o.useState(`canary-rtl`);return(0,s.jsx)(`div`,{dir:`rtl`,style:{maxWidth:420,display:`flex`,flexDirection:`column`,gap:8},children:[{value:`canary-rtl`,title:`كناري 10٪`,description:`توجيه جزء صغير من الحركة أولاً، ثم التوسع التدريجي.`},{value:`blue-green-rtl`,title:`أزرق / أخضر`,description:`إطلاق أسطول موازٍ والتحويل الفوري للحركة.`}].map(n=>(0,s.jsx)(i,{value:n.value,title:n.title,description:n.description,checked:e===n.value,onChange:e=>t(e),name:`deploy-rtl`},n.value))})}return(0,s.jsx)(e,{})}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source},description:{story:`Unchecked — standard card surface, no accent treatment.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    checked: true
  }
}`,...u.parameters?.docs?.source},description:{story:`Checked — ember-soft background tint + ember border; radio dot filled.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    function Demo() {
      const [selected, setSelected] = React.useState<string | null>('blue-green');
      const options = [{
        value: 'all-at-once',
        title: 'All at once',
        description: 'Fastest deploy; highest blast radius.'
      }, {
        value: 'blue-green',
        title: 'Blue / green',
        description: 'Stand up a parallel fleet and cut over.'
      }, {
        value: 'rolling',
        title: 'Rolling update',
        description: 'Replace instances one by one with zero downtime.',
        disabled: true
      }];
      return <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        maxWidth: 440
      }}>
          {options.map(opt => <RadioCard key={opt.value} value={opt.value} title={opt.title} description={opt.description} checked={selected === opt.value} onChange={v => setSelected(v)} name="deploy-strategy-states" disabled={opt.disabled} />)}
          <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--fg-muted)'
        }}>
            selected: {selected ?? '—'}
          </span>
        </div>;
    }
    return <Demo />;
  }
}`,...d.parameters?.docs?.source},description:{story:`Side-by-side state matrix: unchecked, checked, and disabled. Each card is
independently controlled so the story is fully interactive — clicking an
unchecked or checked card fires \`onChange\`; the disabled card ignores input.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => {
    function Demo() {
      const [selected, setSelected] = React.useState<string>('starter');
      const plans = [{
        value: 'starter',
        title: 'Starter',
        description: 'Up to 3 services'
      }, {
        value: 'pro',
        title: 'Pro',
        description: 'Up to 20 services'
      }, {
        value: 'enterprise',
        title: 'Enterprise',
        description: 'Unlimited'
      }];
      return <div style={{
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap'
      }}>
          {plans.map(plan => <RadioCard key={plan.value} value={plan.value} title={plan.title} description={plan.description} orientation="vertical" checked={selected === plan.value} onChange={v => setSelected(v)} name="plan-picker" />)}
        </div>;
    }
    return <Demo />;
  }
}`,...f.parameters?.docs?.source},description:{story:'`orientation="vertical"` — the radio control sits above the title/description,\nuseful for option grids where each card is narrower and taller.',...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    maxWidth: 440
  }}>
      <RadioCard value="disabled-checked" title="Feature flags (unavailable)" description="Requires the Advanced add-on — contact sales." checked disabled name="disabled-demo" />
      <RadioCard value="disabled-unchecked" title="Snapshot rollback (unavailable)" description="Only available on Enterprise plans." checked={false} disabled name="disabled-demo" />
    </div>
}`,...p.parameters?.docs?.source},description:{story:`Disabled in both checked and unchecked states — pointer-events off, opacity reduced.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    function Demo() {
      const [selected, setSelected] = React.useState<string>('canary-rtl');
      const options = [{
        value: 'canary-rtl',
        title: 'كناري 10٪',
        description: 'توجيه جزء صغير من الحركة أولاً، ثم التوسع التدريجي.'
      }, {
        value: 'blue-green-rtl',
        title: 'أزرق / أخضر',
        description: 'إطلاق أسطول موازٍ والتحويل الفوري للحركة.'
      }];
      return <div dir="rtl" style={{
        maxWidth: 420,
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}>
          {options.map(opt => <RadioCard key={opt.value} value={opt.value} title={opt.title} description={opt.description} checked={selected === opt.value} onChange={v => setSelected(v)} name="deploy-rtl" />)}
        </div>;
    }
    return <Demo />;
  }
}`,...m.parameters?.docs?.source},description:{story:`Right-to-left — the radio control, icon, and text all mirror correctly.
No code changes needed; CSS logical properties handle the flip automatically.`,...m.parameters?.docs?.description}}},h=[`Default`,`Checked`,`States`,`Orientations`,`Disabled`,`RTL`]}))();export{u as Checked,l as Default,p as Disabled,f as Orientations,m as RTL,d as States,h as __namedExportsOrder,c as default};