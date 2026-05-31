import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{si as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h;e((()=>{o=t(n(),1),a(),s=r(),c=[{label:`All at once`,value:`all`},{label:`Canary 10%`,value:`canary`},{label:`Blue / green`,value:`blue`}],l={title:`Forms/RadioGroup`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:`A mutually-exclusive choice from a known set. Native radios bound to one name — keyboard arrow navigation and form submission work natively. Always a group; a lone radio is an anti-pattern.`}}},args:{options:c,defaultValue:`canary`,ariaLabel:`Rollout strategy`},argTypes:{inline:{control:`boolean`},disabled:{control:`boolean`},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]}}},u={},d={args:{defaultValue:`canary`,options:[{label:`All at once`,value:`all`,description:`Fastest, highest blast radius.`},{label:`Canary 10%`,value:`canary`,description:`Route a slice of traffic first, then ramp.`},{label:`Blue / green`,value:`blue`,description:`Stand up a parallel fleet and cut over.`}]}},f={args:{inline:!0}},p={args:{defaultValue:`all`,options:[{label:`All at once`,value:`all`},{label:`Canary 10%`,value:`canary`},{label:`Blue / green (needs 2× capacity)`,value:`blue`,disabled:!0}]}},m={render:()=>{function e(){let[e,t]=o.useState(`canary`);return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:12},children:[(0,s.jsx)(i,{options:c,value:e,onChange:t,ariaLabel:`Rollout strategy`}),(0,s.jsxs)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-muted)`},children:[`selected: `,e]})]})}return(0,s.jsx)(e,{})}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: 'canary',
    options: [{
      label: 'All at once',
      value: 'all',
      description: 'Fastest, highest blast radius.'
    }, {
      label: 'Canary 10%',
      value: 'canary',
      description: 'Route a slice of traffic first, then ramp.'
    }, {
      label: 'Blue / green',
      value: 'blue',
      description: 'Stand up a parallel fleet and cut over.'
    }]
  }
}`,...d.parameters?.docs?.source},description:{story:`With per-option descriptions (stacked layout).`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    inline: true
  }
}`,...f.parameters?.docs?.source},description:{story:`Inline (row) layout.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: 'all',
    options: [{
      label: 'All at once',
      value: 'all'
    }, {
      label: 'Canary 10%',
      value: 'canary'
    }, {
      label: 'Blue / green (needs 2× capacity)',
      value: 'blue',
      disabled: true
    }]
  }
}`,...p.parameters?.docs?.source},description:{story:`A disabled option among enabled ones.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    function Demo() {
      const [v, setV] = React.useState('canary');
      return <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}>
          <RadioGroup options={ROLLOUT} value={v} onChange={setV} ariaLabel="Rollout strategy" />
          <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--fg-muted)'
        }}>selected: {v}</span>
        </div>;
    }
    return <Demo />;
  }
}`,...m.parameters?.docs?.source},description:{story:`Controlled — shows the live selection.`,...m.parameters?.docs?.description}}},h=[`Default`,`WithDescriptions`,`Inline`,`WithDisabledOption`,`Controlled`]}))();export{m as Controlled,u as Default,f as Inline,d as WithDescriptions,p as WithDisabledOption,h as __namedExportsOrder,l as default};