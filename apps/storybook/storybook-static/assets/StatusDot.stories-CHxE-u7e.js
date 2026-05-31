import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./jsx-runtime-CaZkqeYb.js";import{Fa as n,t as r}from"./src-DgoylXRw.js";var i,a,o,s,c,l,u,d;e((()=>{r(),i=t(),a=[`up`,`running`,`pending`,`degraded`,`down`,`error`,`done`,`skipped`,`unknown`,`p0`,`p1`,`p2`,`p3`],o={title:`Primitives/StatusDot`,component:n,tags:[`autodocs`],parameters:{docs:{description:{component:"A 1-glyph status indicator — a tinted dot keyed to a Forge status tone. Decorative by default (`aria-hidden`); pair it with a visible label or pass `title` for a tooltip."}}},args:{tone:`up`,size:`md`,pulse:!1},argTypes:{tone:{control:`select`,options:a,description:`Status tone (drives the color).`},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]},pulse:{control:`boolean`,description:`Animate a soft pulse — use sparingly for live/at-risk states.`},title:{control:`text`}}},s={},c={render:()=>(0,i.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:20,alignItems:`center`},children:a.map(e=>(0,i.jsxs)(`span`,{style:{display:`inline-flex`,alignItems:`center`,gap:8},children:[(0,i.jsx)(n,{tone:e}),(0,i.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-muted)`},children:e})]},e))})},l={render:()=>(0,i.jsx)(`div`,{style:{display:`flex`,gap:24,alignItems:`center`},children:[`sm`,`md`,`lg`].map(e=>(0,i.jsxs)(`span`,{style:{display:`inline-flex`,alignItems:`center`,gap:8},children:[(0,i.jsx)(n,{tone:`up`,size:e}),(0,i.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-muted)`},children:e})]},e))})},u={args:{tone:`running`,pulse:!0}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source},description:{story:`Single dot, driven entirely by the controls.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 20,
    alignItems: 'center'
  }}>
      {TONES.map(tone => <span key={tone} style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }}>
          <StatusDot tone={tone} />
          <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--fg-muted)'
      }}>{tone}</code>
        </span>)}
    </div>
}`,...c.parameters?.docs?.source},description:{story:`Every tone in the system, with its key.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 24,
    alignItems: 'center'
  }}>
      {(['sm', 'md', 'lg'] as const).map(size => <span key={size} style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }}>
          <StatusDot tone="up" size={size} />
          <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--fg-muted)'
      }}>{size}</code>
        </span>)}
    </div>
}`,...l.parameters?.docs?.source},description:{story:`The three sizes, side by side.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    tone: 'running',
    pulse: true
  }
}`,...u.parameters?.docs?.source},description:{story:`Pulsing — for a live or actively-degrading signal.`,...u.parameters?.docs?.description}}},d=[`Default`,`AllTones`,`Sizes`,`Pulsing`]}))();export{c as AllTones,s as Default,u as Pulsing,l as Sizes,d as __namedExportsOrder,o as default};