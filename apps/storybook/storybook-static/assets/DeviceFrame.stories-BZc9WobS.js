import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{_i as r,gi as i,hi as a,t as o}from"./src-DgoylXRw.js";var s,c,l,u,d,f,p,m;e((()=>{t(),o(),s=n(),c={title:`Device/DeviceFrame`,component:a,tags:[`autodocs`],parameters:{layout:`centered`,docs:{description:{component:"A realistic handset bezel for previewing mobile surfaces at true device dimensions. A device-picker toolbar lets you switch between presets (iPhone 15 Pro, iPhone 16 Pro Max, iPhone SE, Pixel 8, Galaxy S24). Pass `bare` to hide the toolbar for static hero visuals."}}},args:{initial:`iphone-15-pro`,maxHeight:600,bare:!1},argTypes:{initial:{control:`select`,options:[`iphone-15-pro`,`iphone-16-pro-max`,`iphone-se`,`pixel-8`,`galaxy-s24`]},maxHeight:{control:`number`},bare:{control:`boolean`}}},l={render:e=>(0,s.jsx)(a,{...e,children:(0,s.jsx)(`div`,{style:{width:`100%`,height:`100%`,background:`var(--bg)`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontFamily:`var(--font)`,color:`var(--fg)`,fontSize:14},children:`Your app here`})})},u={args:{bare:!0},render:e=>(0,s.jsx)(a,{...e,children:(0,s.jsxs)(`div`,{style:{width:`100%`,height:`100%`,background:`linear-gradient(135deg, var(--surface) 0%, var(--bg) 100%)`,display:`flex`,flexDirection:`column`,gap:12,alignItems:`center`,justifyContent:`center`,fontFamily:`var(--font)`,color:`var(--fg)`},children:[(0,s.jsx)(r,{platform:`ios`}),(0,s.jsx)(`span`,{style:{fontSize:18,fontWeight:600},children:`Bare frame`})]})})},d={args:{initial:`pixel-8`},render:e=>(0,s.jsx)(a,{...e,children:(0,s.jsx)(`div`,{style:{width:`100%`,height:`100%`,background:`var(--bg)`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontFamily:`var(--font)`,color:`var(--fg)`,fontSize:14},children:`Android preview`})})},f={args:{initial:`iphone-se`,maxHeight:500},render:e=>(0,s.jsx)(a,{...e,children:(0,s.jsx)(`div`,{style:{width:`100%`,height:`100%`,background:`var(--bg)`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontFamily:`var(--font)`,color:`var(--fg)`,fontSize:13},children:`iPhone SE — no notch`})})},p={parameters:{layout:`padded`},render:()=>(0,s.jsx)(a,{initial:`iphone-15-pro`,maxHeight:600,children:(0,s.jsxs)(`div`,{style:{width:`100%`,height:`100%`,background:`var(--bg)`,display:`flex`,flexDirection:`column`},children:[(0,s.jsx)(i,{platform:`ios`,time:`9:41`,width:393,peek:120,frameless:!0,children:(0,s.jsx)(`div`,{style:{padding:`12px 18px`,fontFamily:`var(--font)`,fontSize:17,fontWeight:600,color:`var(--fg)`},children:`Forge Mobile`})}),(0,s.jsx)(`div`,{style:{flex:1,display:`flex`,alignItems:`center`,justifyContent:`center`,color:`var(--fg-muted)`,fontSize:13},children:`App content`})]})})},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <DeviceFrame {...args}>
      <div style={{
      width: '100%',
      height: '100%',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font)',
      color: 'var(--fg)',
      fontSize: 14
    }}>
        Your app here
      </div>
    </DeviceFrame>
}`,...l.parameters?.docs?.source},description:{story:`Default — iPhone 15 Pro with the device-picker toolbar visible.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    bare: true
  },
  render: args => <DeviceFrame {...args}>
      <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, var(--surface) 0%, var(--bg) 100%)',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font)',
      color: 'var(--fg)'
    }}>
        <StatusBar platform="ios" />
        <span style={{
        fontSize: 18,
        fontWeight: 600
      }}>Bare frame</span>
      </div>
    </DeviceFrame>
}`,...u.parameters?.docs?.source},description:{story:`Bare — no toolbar; the bezel alone, intended for static hero visuals.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    initial: 'pixel-8'
  },
  render: args => <DeviceFrame {...args}>
      <div style={{
      width: '100%',
      height: '100%',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font)',
      color: 'var(--fg)',
      fontSize: 14
    }}>
        Android preview
      </div>
    </DeviceFrame>
}`,...d.parameters?.docs?.source},description:{story:`Android device — Pixel 8 with a punch-hole cutout.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    initial: 'iphone-se',
    maxHeight: 500
  },
  render: args => <DeviceFrame {...args}>
      <div style={{
      width: '100%',
      height: '100%',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font)',
      color: 'var(--fg)',
      fontSize: 13
    }}>
        iPhone SE — no notch
      </div>
    </DeviceFrame>
}`,...f.parameters?.docs?.source},description:{story:`Small device — iPhone SE (375×667) with no notch.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  parameters: {
    layout: 'padded'
  },
  render: () => <DeviceFrame initial="iphone-15-pro" maxHeight={600}>
      <div style={{
      width: '100%',
      height: '100%',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column'
    }}>
        <PhoneTop platform="ios" time="9:41" width={393} peek={120} frameless>
          <div style={{
          padding: '12px 18px',
          fontFamily: 'var(--font)',
          fontSize: 17,
          fontWeight: 600,
          color: 'var(--fg)'
        }}>
            Forge Mobile
          </div>
        </PhoneTop>
        <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--fg-muted)',
        fontSize: 13
      }}>
          App content
        </div>
      </div>
    </DeviceFrame>
}`,...p.parameters?.docs?.source},description:{story:`In context — a PhoneTop composited inside the frame, showing an app header.`,...p.parameters?.docs?.description}}},m=[`Default`,`Bare`,`Android`,`SmallDevice`,`InContext`]}))();export{d as Android,u as Bare,l as Default,p as InContext,f as SmallDevice,m as __namedExportsOrder,c as default};