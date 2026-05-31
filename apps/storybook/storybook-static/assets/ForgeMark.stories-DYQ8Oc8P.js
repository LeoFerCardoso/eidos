import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{Ua as r,t as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u,d,f,p,m,h;e((()=>{t(),i(),a=n(),o=[`solid`,`outline`,`expressive`],s={title:`Icons/ForgeMark`,component:r,tags:[`autodocs`],parameters:{layout:`centered`,docs:{description:{component:"The Forge brand mark — a Lucide flame flanked by three 4-point sparkles. Three variants: `solid` (production chrome, favicons), `outline` (editorial, spec sheets), and `expressive` (hero, splash, onboarding). On ember or accent fills the mark must use dark ink (#08090A) for contrast."}}},args:{size:32,variant:`solid`,color:`var(--ember)`,glow:!1},argTypes:{variant:{control:`inline-radio`,options:o},size:{control:`number`},color:{control:`color`},glow:{control:`boolean`}}},c={},l={render:()=>(0,a.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,gap:32},children:o.map(e=>(0,a.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:8},children:[(0,a.jsx)(r,{size:40,variant:e}),(0,a.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:e})]},e))})},u={render:()=>(0,a.jsx)(`div`,{style:{display:`flex`,alignItems:`flex-end`,gap:24},children:[16,24,32,48,64,80].map(e=>(0,a.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:8},children:[(0,a.jsx)(r,{size:e,variant:`solid`}),(0,a.jsxs)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:10,color:`var(--fg-muted)`},children:[e,`px`]})]},e))})},d={args:{glow:!0,size:48,variant:`solid`}},f={args:{variant:`expressive`,glow:!0,size:64}},p={render:()=>(0,a.jsxs)(`div`,{style:{display:`flex`,gap:16,alignItems:`center`,flexWrap:`wrap`},children:[(0,a.jsxs)(`div`,{style:{background:`var(--ember)`,borderRadius:12,padding:20,display:`flex`,flexDirection:`column`,alignItems:`center`,gap:8},children:[(0,a.jsx)(r,{size:40,variant:`solid`,color:`#08090A`}),(0,a.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:10,color:`#08090A`},children:`ember fill`})]}),(0,a.jsxs)(`div`,{style:{background:`#08090A`,borderRadius:12,padding:20,display:`flex`,flexDirection:`column`,alignItems:`center`,gap:8},children:[(0,a.jsx)(r,{size:40,variant:`solid`,color:`var(--ember)`}),(0,a.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:10,color:`var(--ember)`},children:`dark surface`})]}),(0,a.jsxs)(`div`,{style:{background:`#FFFFFF`,borderRadius:12,padding:20,border:`1px solid #E5E7EB`,display:`flex`,flexDirection:`column`,alignItems:`center`,gap:8},children:[(0,a.jsx)(r,{size:40,variant:`solid`,color:`var(--ember)`}),(0,a.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:10,color:`#374151`},children:`light surface`})]})]})},m={args:{variant:`outline`,size:48}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{}`,...c.parameters?.docs?.source},description:{story:`Default — solid variant at 32px in the ember token.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 32
  }}>
      {VARIANTS.map(v => <div key={v} style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8
    }}>
          <ForgeMark size={40} variant={v} />
          <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)'
      }}>{v}</span>
        </div>)}
    </div>
}`,...l.parameters?.docs?.source},description:{story:`All three variants side by side.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    alignItems: 'flex-end',
    gap: 24
  }}>
      {[16, 24, 32, 48, 64, 80].map(s => <div key={s} style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8
    }}>
          <ForgeMark size={s} variant="solid" />
          <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: 'var(--fg-muted)'
      }}>{s}px</span>
        </div>)}
    </div>
}`,...u.parameters?.docs?.source},description:{story:`Sizes — from favicon-scale (16px) to hero (80px).`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    glow: true,
    size: 48,
    variant: 'solid'
  }
}`,...d.parameters?.docs?.source},description:{story:`Glow — drop-shadow for splash and hero surfaces.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'expressive',
    glow: true,
    size: 64
  }
}`,...f.parameters?.docs?.source},description:{story:`Expressive with glow — the hero combination for onboarding.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 16,
    alignItems: 'center',
    flexWrap: 'wrap'
  }}>
      {/* Ember fill → dark ink foreground */}
      <div style={{
      background: 'var(--ember)',
      borderRadius: 12,
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8
    }}>
        <ForgeMark size={40} variant="solid" color="#08090A" />
        <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: '#08090A'
      }}>ember fill</span>
      </div>
      {/* Dark surface → ember mark */}
      <div style={{
      background: '#08090A',
      borderRadius: 12,
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8
    }}>
        <ForgeMark size={40} variant="solid" color="var(--ember)" />
        <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: 'var(--ember)'
      }}>dark surface</span>
      </div>
      {/* Light surface → default ember */}
      <div style={{
      background: '#FFFFFF',
      borderRadius: 12,
      padding: 20,
      border: '1px solid #E5E7EB',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8
    }}>
        <ForgeMark size={40} variant="solid" color="var(--ember)" />
        <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: '#374151'
      }}>light surface</span>
      </div>
    </div>
}`,...p.parameters?.docs?.source},description:{story:'Contrast invariant: on an ember/accent fill the mark must be dark ink.\nThis story verifies the rule — `color="#08090A"` (var(--bg)) on the\nember tile, `color="var(--ember)"` on the dark surface.',...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'outline',
    size: 48
  }
}`,...m.parameters?.docs?.source},description:{story:`Outline — editorial use, spec sheets and wireframes.`,...m.parameters?.docs?.description}}},h=[`Default`,`AllVariants`,`Sizes`,`WithGlow`,`ExpressiveGlow`,`OnColoredSurfaces`,`Outline`]}))();export{l as AllVariants,c as Default,f as ExpressiveGlow,p as OnColoredSurfaces,m as Outline,u as Sizes,d as WithGlow,h as __namedExportsOrder,s as default};