import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Wa as i,Wn as a,t as o}from"./src-DgoylXRw.js";var s,c,l,u,d,f,p,m;e((()=>{s=t(n(),1),o(),c=r(),l={title:`AI/SuggestionCard`,component:a,tags:[`autodocs`],parameters:{docs:{description:{component:`High-emphasis starter-prompt tile for empty-state grids. Each card shows a small ember-soft icon, a headline question, and a supporting line.`}}},args:{icon:(0,c.jsx)(i.sparkle,{size:14}),title:`What’s the top risk this week?`,line:`Scan T1 services, open incidents, and high-risk PRs.`},argTypes:{title:{control:`text`},line:{control:`text`}}},u={render:e=>{function t(){let[t,n]=s.useState(null);return(0,c.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:12,alignItems:`flex-start`},children:[(0,c.jsx)(a,{icon:e.icon||(0,c.jsx)(i.sparkle,{size:14}),title:e.title||`What’s the top risk this week?`,line:e.line||`Scan T1 services, open incidents, and high-risk PRs.`,onClick:()=>n(e.title||`What’s the top risk this week?`)}),t&&(0,c.jsxs)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--ember)`},children:[`selected: `,t]})]})}return(0,c.jsx)(t,{})}},d={args:{line:void 0,title:`Summarise last night’s deploys`}},f=[{icon:(0,c.jsx)(i.sparkle,{size:14}),title:`What’s broken right now?`,line:`Surface failing services and open incidents.`},{icon:(0,c.jsx)(i.shield,{size:14}),title:`Security posture`,line:`Summarise SAST findings across T1 services.`},{icon:(0,c.jsx)(i.rocket,{size:14}),title:`Ready to ship?`,line:`Check deploy readiness for the release train.`}],p={parameters:{layout:`padded`},render:()=>(0,c.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(3, minmax(200px, 1fr))`,gap:12,maxWidth:720},children:f.map(e=>(0,c.jsx)(a,{icon:e.icon,title:e.title,line:e.line,onClick:()=>{}},e.title))})},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => {
    function Demo() {
      const [selected, setSelected] = React.useState<string | null>(null);
      return <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        alignItems: 'flex-start'
      }}>
          <SuggestionCard icon={args.icon || <Icons.sparkle size={14} />} title={args.title || 'What’s the top risk this week?'} line={args.line || 'Scan T1 services, open incidents, and high-risk PRs.'} onClick={() => setSelected(args.title || 'What’s the top risk this week?')} />
          {selected && <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--ember)'
        }}>
              selected: {selected}
            </span>}
        </div>;
    }
    return <Demo />;
  }
}`,...u.parameters?.docs?.source},description:{story:`A single starter-prompt card — click to select.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    line: undefined,
    title: 'Summarise last night’s deploys'
  }
}`,...d.parameters?.docs?.source},description:{story:`Without the supporting line — title only.`,...d.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  parameters: {
    layout: 'padded'
  },
  render: () => <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(200px, 1fr))',
    gap: 12,
    maxWidth: 720
  }}>
      {SUGGESTIONS.map(s => <SuggestionCard key={s.title} icon={s.icon} title={s.title} line={s.line} onClick={() => {}} />)}
    </div>
}`,...p.parameters?.docs?.source},description:{story:`The canonical empty-state grid: a row of starter prompts.`,...p.parameters?.docs?.description}}},m=[`Default`,`TitleOnly`,`Grid`]}))();export{u as Default,p as Grid,d as TitleOnly,m as __namedExportsOrder,l as default};