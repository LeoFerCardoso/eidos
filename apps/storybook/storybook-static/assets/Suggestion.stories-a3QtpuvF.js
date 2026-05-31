import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Un as i,Wa as a,t as o}from"./src-DgoylXRw.js";var s,c,l,u,d,f,p,m,h,g,_;e((()=>{s=t(n(),1),o(),c=r(),l={title:`AI/Suggestion`,component:i,tags:[`autodocs`],parameters:{docs:{description:{component:"A clickable pill for starter prompts and filters. Three sizes (sm / md / lg). The `pressed` state locks an ember-soft fill for already-picked selections."}}},args:{children:`Show top risk this week`,size:`md`,pressed:!1},argTypes:{size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]},pressed:{control:`boolean`},children:{control:`text`}}},u={render:e=>{let t=[`Show top risk this week`,`Summarise last night's deploys`,`Open incidents`];function n(){let[n,r]=s.useState(``);return(0,c.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:12,alignItems:`flex-start`},children:[(0,c.jsx)(`div`,{style:{display:`flex`,gap:8,flexWrap:`wrap`},children:t.map(t=>(0,c.jsx)(i,{size:e.size,pressed:n===t,onClick:()=>r(e=>e===t?``:t),children:t},t))}),(0,c.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`,minHeight:16},children:n?`selected: ${n}`:`click a chip to select`})]})}return(0,c.jsx)(n,{})}},d={args:{icon:(0,c.jsx)(a.sparkle,{size:12}),children:`Summarise the sprint`}},f={args:{pressed:!0,children:`High-risk only`}},p={render:()=>(0,c.jsx)(`div`,{style:{display:`flex`,gap:10,alignItems:`center`},children:[`sm`,`md`,`lg`].map(e=>(0,c.jsx)(i,{size:e,icon:(0,c.jsx)(a.zap,{size:e===`sm`?10:e===`lg`?14:12}),children:e===`sm`?`Top risk`:e===`lg`?`Show me the top risk this week`:`Top risk this week`},e))})},m={render:()=>{function e(){let e=[`T1 only`,`High risk`,`In-flight deploys`,`Open incidents`],[t,n]=s.useState(new Set),r=e=>n(t=>{let n=new Set(t);return n.has(e)?n.delete(e):n.add(e),n});return(0,c.jsx)(`div`,{style:{display:`flex`,gap:8,flexWrap:`wrap`},children:e.map(e=>(0,c.jsx)(i,{pressed:t.has(e),onClick:()=>r(e),children:e},e))})}return(0,c.jsx)(e,{})}},h={render:()=>(0,c.jsxs)(`div`,{style:{display:`flex`,gap:8,flexWrap:`wrap`},children:[(0,c.jsx)(i,{icon:(0,c.jsx)(a.sparkle,{size:12}),children:`Summarise the sprint`}),(0,c.jsx)(i,{icon:(0,c.jsx)(a.zap,{size:12}),children:`Top risk this week`}),(0,c.jsx)(i,{icon:(0,c.jsx)(a.search,{size:12}),children:`Find ADR violations`}),(0,c.jsx)(i,{icon:(0,c.jsx)(a.cpu,{size:12}),children:`Show T1 service health`})]})},g={name:`SuggestionList — unified set`,render:()=>{let e=[{icon:(0,c.jsx)(a.sparkle,{size:12}),label:`Summarise the sprint`},{icon:(0,c.jsx)(a.zap,{size:12}),label:`Top risk this week`},{icon:(0,c.jsx)(a.search,{size:12}),label:`Find ADR violations`},{icon:(0,c.jsx)(a.cpu,{size:12}),label:`Show T1 service health`},{icon:(0,c.jsx)(a.shield,{size:12}),label:`Security posture`}];function t(){let[t,n]=s.useState(null);return(0,c.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:12,alignItems:`flex-start`},children:[(0,c.jsx)(`div`,{style:{display:`flex`,gap:8,flexWrap:`wrap`},children:e.map(({icon:e,label:r})=>(0,c.jsx)(i,{icon:e,pressed:t===r,onClick:()=>n(e=>e===r?null:r),children:r},r))}),(0,c.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`,minHeight:16},children:t?`selected: ${t}`:`click a chip to select`})]})}return(0,c.jsx)(t,{})}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => {
    const CHIPS = ['Show top risk this week', 'Summarise last night\\'s deploys', 'Open incidents'];
    function Demo() {
      const [selected, setSelected] = React.useState('');
      return <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        alignItems: 'flex-start'
      }}>
          <div style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap'
        }}>
            {CHIPS.map(label => <Suggestion key={label} size={args.size} pressed={selected === label} onClick={() => setSelected(prev => prev === label ? '' : label)}>
                {label}
              </Suggestion>)}
          </div>
          <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--fg-muted)',
          minHeight: 16
        }}>
            {selected ? \`selected: \${selected}\` : 'click a chip to select'}
          </span>
        </div>;
    }
    return <Demo />;
  }
}`,...u.parameters?.docs?.source},description:{story:`Default — click a suggestion chip to select it. The selected label is shown below.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    icon: <Icons.sparkle size={12} />,
    children: 'Summarise the sprint'
  }
}`,...d.parameters?.docs?.source},description:{story:`With a leading icon.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    pressed: true,
    children: 'High-risk only'
  }
}`,...f.parameters?.docs?.source},description:{story:`Pressed — ember-soft fill, locked state.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 10,
    alignItems: 'center'
  }}>
      {(['sm', 'md', 'lg'] as const).map(size => <Suggestion key={size} size={size} icon={<Icons.zap size={size === 'sm' ? 10 : size === 'lg' ? 14 : 12} />}>
          {size === 'sm' ? 'Top risk' : size === 'lg' ? 'Show me the top risk this week' : 'Top risk this week'}
        </Suggestion>)}
    </div>
}`,...p.parameters?.docs?.source},description:{story:`All three sizes.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    function Demo() {
      const chips = ['T1 only', 'High risk', 'In-flight deploys', 'Open incidents'] as const;
      const [active, setActive] = React.useState<Set<string>>(new Set());
      const toggle = (label: string) => setActive(prev => {
        const next = new Set(prev);
        next.has(label) ? next.delete(label) : next.add(label);
        return next;
      });
      return <div style={{
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap'
      }}>
          {chips.map(c => <Suggestion key={c} pressed={active.has(c)} onClick={() => toggle(c)}>
              {c}
            </Suggestion>)}
        </div>;
    }
    return <Demo />;
  }
}`,...m.parameters?.docs?.source},description:{story:`Interactive toggle — pressing locks the chip.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap'
  }}>
      <Suggestion icon={<Icons.sparkle size={12} />}>Summarise the sprint</Suggestion>
      <Suggestion icon={<Icons.zap size={12} />}>Top risk this week</Suggestion>
      <Suggestion icon={<Icons.search size={12} />}>Find ADR violations</Suggestion>
      <Suggestion icon={<Icons.cpu size={12} />}>Show T1 service health</Suggestion>
    </div>
}`,...h.parameters?.docs?.source},description:{story:`A row of starter-prompt chips typical for an empty-state thread.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: 'SuggestionList — unified set',
  render: () => {
    const PROMPTS = [{
      icon: <Icons.sparkle size={12} />,
      label: 'Summarise the sprint'
    }, {
      icon: <Icons.zap size={12} />,
      label: 'Top risk this week'
    }, {
      icon: <Icons.search size={12} />,
      label: 'Find ADR violations'
    }, {
      icon: <Icons.cpu size={12} />,
      label: 'Show T1 service health'
    }, {
      icon: <Icons.shield size={12} />,
      label: 'Security posture'
    }];
    function SuggestionListDemo() {
      const [selected, setSelected] = React.useState<string | null>(null);
      return <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        alignItems: 'flex-start'
      }}>
          <div style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap'
        }}>
            {PROMPTS.map(({
            icon,
            label
          }) => <Suggestion key={label} icon={icon} pressed={selected === label} onClick={() => setSelected(prev => prev === label ? null : label)}>
                {label}
              </Suggestion>)}
          </div>
          <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--fg-muted)',
          minHeight: 16
        }}>
            {selected ? \`selected: \${selected}\` : 'click a chip to select'}
          </span>
        </div>;
    }
    return <SuggestionListDemo />;
  }
}`,...g.parameters?.docs?.source},description:{story:`Unified SuggestionList — a set of suggestion chips rendered together in a
 flex-wrap row. Clicking any chip registers a selection. This is the
 canonical empty-state starter-prompt pattern.`,...g.parameters?.docs?.description}}},_=[`Default`,`WithIcon`,`Pressed`,`Sizes`,`Interactive`,`InContext`,`SuggestionList`]}))();export{u as Default,h as InContext,m as Interactive,f as Pressed,p as Sizes,g as SuggestionList,d as WithIcon,_ as __namedExportsOrder,l as default};