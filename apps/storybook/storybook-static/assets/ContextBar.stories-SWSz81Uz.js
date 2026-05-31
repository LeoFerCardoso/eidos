import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{Vn as r,t as i,xr as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m;e((()=>{t(),i(),o=n(),s={title:`AI/ContextBar`,component:a,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:'**Deprecated wrapper** — `ContextBar` renders a linear progress bar showing how much of the model context window has been consumed. It forwards all props to `<Context variant="bar" />` and is kept for backward-compat. Use it to surface token usage in PromptInput footers or status rows where a horizontal bar fits better than the radial gauge. Tone shifts automatically: ok → mid at `thresholdMid` (default 60%), mid → warn at `thresholdWarn` (default 85%).'}}},args:{used:32e3,total:128e3},argTypes:{used:{control:`number`},total:{control:`number`},files:{control:`number`},thresholdMid:{control:{type:`range`,min:0,max:1,step:.05}},thresholdWarn:{control:{type:`range`,min:0,max:1,step:.05}}}},c={},l={name:`With files`,args:{used:48e3,total:128e3,files:4}},u={name:`Tones (ok / mid / warn)`,render:()=>(0,o.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:20,maxWidth:440},children:[{label:`ok`,used:32e3,total:128e3},{label:`mid`,used:82e3,total:128e3},{label:`warn`,used:114e3,total:128e3}].map(({label:e,used:t,total:n})=>(0,o.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:12},children:[(0,o.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-faint)`,width:36,flexShrink:0},children:e}),(0,o.jsx)(a,{used:t,total:n})]},e))})},d={name:`In PromptInput footer`,render:()=>(0,o.jsx)(`div`,{style:{maxWidth:640},children:(0,o.jsx)(r,{value:``,onChange:()=>{},onSubmit:()=>{},modelValue:`forge-sonnet-4-6`,onModelChange:()=>{},contextSlot:(0,o.jsx)(a,{used:82e3,total:2e5,files:3}),placeholder:`Describe the incident or paste a log trace…`})})},f={name:`Near full (92%)`,args:{used:118e3,total:128e3}},p={name:`Custom thresholds (32k window)`,render:()=>(0,o.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:20,maxWidth:440},children:[{label:`ok`,used:12e3},{label:`mid`,used:22e3},{label:`warn`,used:3e4}].map(({label:e,used:t})=>(0,o.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:12},children:[(0,o.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-faint)`,width:36,flexShrink:0},children:e}),(0,o.jsx)(a,{used:t,total:32e3,thresholdMid:.5,thresholdWarn:.8})]},e))})},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{}`,...c.parameters?.docs?.source},description:{story:`Default bar — forge-sonnet-4-6 session, 32k of 128k tokens consumed (ok tone).`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: 'With files',
  args: {
    used: 48000,
    total: 128000,
    files: 4
  }
}`,...l.parameters?.docs?.source},description:{story:`With attached files — token count plus a file badge in the label row.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: 'Tones (ok / mid / warn)',
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    maxWidth: 440
  }}>
      {([{
      label: 'ok',
      used: 32000,
      total: 128000
    }, {
      label: 'mid',
      used: 82000,
      total: 128000
    }, {
      label: 'warn',
      used: 114000,
      total: 128000
    }] as const).map(({
      label,
      used,
      total
    }) => <div key={label} style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }}>
          <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-faint)',
        width: 36,
        flexShrink: 0
      }}>
            {label}
          </span>
          <ContextBar used={used} total={total} />
        </div>)}
    </div>
}`,...u.parameters?.docs?.source},description:{story:`All three tones side by side — ok / mid / warn — at representative fill levels.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: 'In PromptInput footer',
  render: () => <div style={{
    maxWidth: 640
  }}>
      <PromptInput value="" onChange={() => {}} onSubmit={() => {}} modelValue="forge-sonnet-4-6" onModelChange={() => {}} contextSlot={<ContextBar used={82000} total={200000} files={3} />} placeholder="Describe the incident or paste a log trace…" />
    </div>
}`,...d.parameters?.docs?.source},description:{story:`Embedded in PromptInput — the primary usage site for ContextBar.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: 'Near full (92%)',
  args: {
    used: 118000,
    total: 128000
  }
}`,...f.parameters?.docs?.source},description:{story:`Near-full — 118k of 128k tokens consumed; warn tone triggers at 85%.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: 'Custom thresholds (32k window)',
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    maxWidth: 440
  }}>
      {([{
      label: 'ok',
      used: 12000
    }, {
      label: 'mid',
      used: 22000
    }, {
      label: 'warn',
      used: 30000
    }] as const).map(({
      label,
      used
    }) => <div key={label} style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }}>
          <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-faint)',
        width: 36,
        flexShrink: 0
      }}>
            {label}
          </span>
          <ContextBar used={used} total={32000} thresholdMid={0.5} thresholdWarn={0.8} />
        </div>)}
    </div>
}`,...p.parameters?.docs?.source},description:{story:`Custom thresholds — useful when a model has a smaller effective window (e.g. 32k).`,...p.parameters?.docs?.description}}},m=[`Default`,`WithFiles`,`Tones`,`InPromptInput`,`NearFull`,`CustomThresholds`]}))();export{p as CustomThresholds,c as Default,d as InPromptInput,f as NearFull,u as Tones,l as WithFiles,m as __namedExportsOrder,s as default};