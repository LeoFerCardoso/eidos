import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./jsx-runtime-CaZkqeYb.js";import{fa as n,t as r}from"./src-DgoylXRw.js";var i,a,o,s,c,l;e((()=>{r(),i=t(),a={title:`Docs/Mono`,component:n,tags:[`autodocs`],parameters:{docs:{description:{component:"An inline monospace code reference rendered in ember (`var(--ember)`). Use it for token names, prop names, class names, or any short identifier within prose — never hand-roll `font-family: var(--font-mono)` inline."}}},args:{children:`--ember`},argTypes:{children:{control:`text`,description:`The code identifier or token name to display.`}}},o={},s={render:()=>(0,i.jsxs)(`p`,{style:{fontFamily:`var(--font-sans)`,fontSize:`var(--text-sm)`,color:`var(--fg-muted)`,lineHeight:1.6},children:[`Use `,(0,i.jsx)(n,{children:`variant="primary"`}),` for the main call to action. The accent color is `,(0,i.jsx)(n,{children:`var(--accent)`}),` — sourced from `,(0,i.jsx)(n,{children:`--ember`}),`.`]})},c={render:()=>(0,i.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:8},children:[`--ember`,`--accent`,`--bg`,`--fg`,`--fg-muted`,`--fg-faint`,`--radius`,`--font-mono`,`--font-sans`].map(e=>(0,i.jsx)(`span`,{children:(0,i.jsx)(n,{children:e})},e))})},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source},description:{story:`Single token name inline.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <p style={{
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--text-sm)',
    color: 'var(--fg-muted)',
    lineHeight: 1.6
  }}>
      Use <Mono>variant="primary"</Mono> for the main call to action.
      The accent color is <Mono>var(--accent)</Mono> — sourced from <Mono>--ember</Mono>.
    </p>
}`,...s.parameters?.docs?.source},description:{story:`Inside a prose sentence — the expected usage context.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  }}>
      {['--ember', '--accent', '--bg', '--fg', '--fg-muted', '--fg-faint', '--radius', '--font-mono', '--font-sans'].map(t => <span key={t}><Mono>{t}</Mono></span>)}
    </div>
}`,...c.parameters?.docs?.source},description:{story:`Token references — the most common use in the Tokens section.`,...c.parameters?.docs?.description}}},l=[`Default`,`InProse`,`TokenRefs`]}))();export{o as Default,s as InProse,c as TokenRefs,l as __namedExportsOrder,a as default};