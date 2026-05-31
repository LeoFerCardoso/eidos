import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{gi as r,t as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u,d;e((()=>{t(),i(),a=n(),o={title:`Device/PhoneTop`,component:r,tags:[`autodocs`],parameters:{layout:`centered`,docs:{description:{component:`Shows only the upper slice of a handset — status bar and an anchored top region — at a comfortable preview size without rendering the full device. Rounded top corners, the platform's camera cutout, and a fade hint signal that more content exists below.`}}},args:{platform:`ios`,time:`9:41`,width:360,peek:96,frameless:!1},argTypes:{platform:{control:`inline-radio`,options:[`ios`,`android`]},time:{control:`text`},width:{control:`number`},peek:{control:`number`},frameless:{control:`boolean`}}},s={render:e=>(0,a.jsx)(r,{...e,children:(0,a.jsx)(`div`,{style:{padding:`12px 18px`,fontFamily:`var(--font)`,fontSize:17,fontWeight:600,color:`var(--fg)`,borderBlockEnd:`1px solid var(--border)`},children:`Inbox`})})},c={args:{platform:`android`},render:e=>(0,a.jsx)(r,{...e,children:(0,a.jsx)(`div`,{style:{padding:`10px 16px`,fontFamily:`var(--font)`,fontSize:16,fontWeight:600,color:`var(--fg)`,borderBlockEnd:`1px solid var(--border)`},children:`Home`})})},l={args:{frameless:!0},render:e=>(0,a.jsx)(`div`,{style:{background:`var(--bg)`,borderRadius:8,overflow:`hidden`,border:`1px solid var(--border)`},children:(0,a.jsx)(r,{...e,children:(0,a.jsx)(`div`,{style:{padding:`12px 18px`,fontFamily:`var(--font)`,fontSize:17,fontWeight:600,color:`var(--fg)`},children:`Frameless mode`})})})},u={render:()=>(0,a.jsx)(`div`,{style:{display:`flex`,gap:24,flexWrap:`wrap`,alignItems:`flex-start`},children:[`ios`,`android`].map(e=>(0,a.jsx)(r,{platform:e,time:`9:41`,width:320,children:(0,a.jsx)(`div`,{style:{padding:`12px 18px`,fontFamily:`var(--font)`,fontSize:16,fontWeight:600,color:`var(--fg)`,borderBlockEnd:`1px solid var(--border)`},children:e===`ios`?`iOS`:`Android`})},e))})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: args => <PhoneTop {...args}>
      <div style={{
      padding: '12px 18px',
      fontFamily: 'var(--font)',
      fontSize: 17,
      fontWeight: 600,
      color: 'var(--fg)',
      borderBlockEnd: '1px solid var(--border)'
    }}>
        Inbox
      </div>
    </PhoneTop>
}`,...s.parameters?.docs?.source},description:{story:`Default — iOS PhoneTop with a dynamic island and status bar.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    platform: 'android'
  },
  render: args => <PhoneTop {...args}>
      <div style={{
      padding: '10px 16px',
      fontFamily: 'var(--font)',
      fontSize: 16,
      fontWeight: 600,
      color: 'var(--fg)',
      borderBlockEnd: '1px solid var(--border)'
    }}>
        Home
      </div>
    </PhoneTop>
}`,...c.parameters?.docs?.source},description:{story:`Android platform — punch-hole cutout, lighter status bar typography.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    frameless: true
  },
  render: args => <div style={{
    background: 'var(--bg)',
    borderRadius: 8,
    overflow: 'hidden',
    border: '1px solid var(--border)'
  }}>
      <PhoneTop {...args}>
        <div style={{
        padding: '12px 18px',
        fontFamily: 'var(--font)',
        fontSize: 17,
        fontWeight: 600,
        color: 'var(--fg)'
      }}>
          Frameless mode
        </div>
      </PhoneTop>
    </div>
}`,...l.parameters?.docs?.source},description:{story:`Frameless — no border or shadow; for embedding inside DeviceFrame.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 24,
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  }}>
      {(['ios', 'android'] as const).map(p => <PhoneTop key={p} platform={p} time="9:41" width={320}>
          <div style={{
        padding: '12px 18px',
        fontFamily: 'var(--font)',
        fontSize: 16,
        fontWeight: 600,
        color: 'var(--fg)',
        borderBlockEnd: '1px solid var(--border)'
      }}>
            {p === 'ios' ? 'iOS' : 'Android'}
          </div>
        </PhoneTop>)}
    </div>
}`,...u.parameters?.docs?.source},description:{story:`Both platforms at once — useful for spec documentation.`,...u.parameters?.docs?.description}}},d=[`Default`,`AndroidPlatform`,`Frameless`,`BothPlatforms`]}))();export{c as AndroidPlatform,u as BothPlatforms,s as Default,l as Frameless,d as __namedExportsOrder,o as default};