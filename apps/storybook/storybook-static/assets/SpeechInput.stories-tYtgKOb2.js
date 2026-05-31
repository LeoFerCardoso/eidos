import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{fr as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h,g,_,v;e((()=>{o=t(n(),1),a(),s=r(),c=Array.from({length:24},(e,t)=>.12+.8*Math.abs(Math.sin(t*.52+.8))),l={title:`AI/Voice/SpeechInput`,component:i,tags:[`autodocs`],parameters:{docs:{description:{component:"Mic button with state and optional waveform/transcript preview. Two shapes: full (dedicated voice screen, mic + waveform + hint) and compact (`compact=true`, icon-only button that slots into `PromptInput` footerTools)."}}},args:{state:`idle`,compact:!1,transcript:``},argTypes:{state:{control:`inline-radio`,options:[`idle`,`listening`,`processing`,`error`]},compact:{control:`boolean`},transcript:{control:`text`}}},u={},d={render:()=>{let[e,t]=o.useState(`idle`);return(0,s.jsx)(i,{state:e,onToggle:()=>t(e=>e===`idle`?`listening`:`idle`),levels:e===`listening`?c:void 0,transcript:e===`processing`?`What is the p95 for pix-router?`:void 0})}},f={args:{state:`listening`,levels:c}},p={args:{state:`processing`,transcript:`What is the p95 for pix-router right now?`}},m={args:{state:`error`}},h={args:{compact:!0,state:`idle`}},g={name:`Compact — listening`,args:{compact:!0,state:`listening`}},_={render:()=>(0,s.jsxs)(`div`,{style:{display:`inline-flex`,alignItems:`center`,gap:4,border:`1px solid var(--border)`,borderRadius:`var(--radius)`,padding:`4px 8px`,background:`var(--surface)`},children:[(0,s.jsx)(i,{compact:!0,state:`idle`}),(0,s.jsx)(`div`,{style:{width:1,height:18,background:`var(--border)`}}),(0,s.jsx)(`span`,{style:{fontSize:13,color:`var(--fg-muted)`,padding:`0 4px`},children:`Ask about your services…`})]})},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{}`,...u.parameters?.docs?.source},description:{story:`Full variant — idle state.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [state, setState] = React.useState<'idle' | 'listening' | 'processing' | 'error'>('idle');
    const toggle = () => setState(s => s === 'idle' ? 'listening' : 'idle');
    return <SpeechInput state={state} onToggle={toggle} levels={state === 'listening' ? LEVELS : undefined} transcript={state === 'processing' ? 'What is the p95 for pix-router?' : undefined} />;
  }
}`,...d.parameters?.docs?.source},description:{story:`Interactive — toggle listening state with real useState.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    state: 'listening',
    levels: LEVELS
  }
}`,...f.parameters?.docs?.source},description:{story:`Listening — waveform bars visible.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    state: 'processing',
    transcript: 'What is the p95 for pix-router right now?'
  }
}`,...p.parameters?.docs?.source},description:{story:`Processing — showing live transcript.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    state: 'error'
  }
}`,...m.parameters?.docs?.source},description:{story:`Error state — mic unavailable.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    compact: true,
    state: 'idle'
  }
}`,...h.parameters?.docs?.source},description:{story:`Compact — icon-only variant for prompt footer.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: 'Compact — listening',
  args: {
    compact: true,
    state: 'listening'
  }
}`,...g.parameters?.docs?.source},description:{story:`Compact — listening state.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '4px 8px',
    background: 'var(--surface)'
  }}>
      <SpeechInput compact state="idle" />
      <div style={{
      width: 1,
      height: 18,
      background: 'var(--border)'
    }} />
      <span style={{
      fontSize: 13,
      color: 'var(--fg-muted)',
      padding: '0 4px'
    }}>
        Ask about your services…
      </span>
    </div>
}`,..._.parameters?.docs?.source},description:{story:`In context — compact button alongside other prompt-footer tools.`,..._.parameters?.docs?.description}}},v=[`Default`,`Interactive`,`Listening`,`Processing`,`Error`,`Compact`,`CompactListening`,`InContext`]}))();export{h as Compact,g as CompactListening,u as Default,m as Error,_ as InContext,d as Interactive,f as Listening,p as Processing,v as __namedExportsOrder,l as default};