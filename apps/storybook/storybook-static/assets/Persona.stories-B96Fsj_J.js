import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{dr as r,t as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u;e((()=>{t(),i(),a=n(),Array.from({length:30},(e,t)=>.15+.75*Math.abs(Math.sin(t*.45+1.2))),o={title:`AI/Voice/Persona`,component:r,tags:[`autodocs`],parameters:{docs:{description:{component:"A circular ember orb that visualises the voice-agent conversation state: idle, listening, thinking, or speaking. The ring and orb animate via CSS; animations are suppressed under `prefers-reduced-motion`."}}},args:{state:`idle`,size:96,label:`Forge AI`},argTypes:{state:{control:`inline-radio`,options:[`idle`,`listening`,`thinking`,`speaking`]},size:{control:`number`},label:{control:`text`}}},s={},c={name:`All states`,render:()=>(0,a.jsx)(`div`,{style:{display:`flex`,gap:32,alignItems:`center`,flexWrap:`wrap`},children:[`idle`,`listening`,`thinking`,`speaking`].map(e=>(0,a.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:8},children:[(0,a.jsx)(r,{state:e,size:72,label:`Forge AI`}),(0,a.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:e})]},e))})},l={render:()=>(0,a.jsx)(`div`,{style:{display:`flex`,gap:24,alignItems:`flex-end`},children:[48,72,96,128].map(e=>(0,a.jsx)(r,{state:`speaking`,size:e,label:`Forge AI`},e))})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source},description:{story:`Single orb, driven by controls.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: 'All states',
  render: () => <div style={{
    display: 'flex',
    gap: 32,
    alignItems: 'center',
    flexWrap: 'wrap'
  }}>
      {(['idle', 'listening', 'thinking', 'speaking'] as const).map(s => <div key={s} style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8
    }}>
          <Persona state={s} size={72} label="Forge AI" />
          <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)'
      }}>{s}</code>
        </div>)}
    </div>
}`,...c.parameters?.docs?.source},description:{story:`All four states side by side.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 24,
    alignItems: 'flex-end'
  }}>
      {[48, 72, 96, 128].map(sz => <Persona key={sz} state="speaking" size={sz} label="Forge AI" />)}
    </div>
}`,...l.parameters?.docs?.source},description:{story:`Sizes — 48, 72, 96, 128 px.`,...l.parameters?.docs?.description}}},u=[`Default`,`AllStates`,`Sizes`]}))();export{c as AllStates,s as Default,l as Sizes,u as __namedExportsOrder,o as default};