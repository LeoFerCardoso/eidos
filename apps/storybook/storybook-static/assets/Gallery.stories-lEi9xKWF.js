import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{Wa as r,t as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u;e((()=>{t(),i(),a=n(),o={title:`Icons/Gallery`,parameters:{layout:`padded`,docs:{description:{component:"The complete Forge icon set — Lucide-style 24×24 stroke glyphs, rendered at 20px here. Each entry in the `Icons` map is a standalone React component accepting `size`, `color`, and `strokeWidth` props."}}}},s={render:()=>(0,a.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(96px, 1fr))`,gap:8,fontFamily:`var(--font-mono)`},children:Object.entries(r).map(([e,t])=>(0,a.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:6,padding:`12px 8px`,borderRadius:6,border:`1px solid var(--border)`,background:`var(--surface)`,color:`var(--fg)`},children:[(0,a.jsx)(t,{size:20}),(0,a.jsx)(`span`,{style:{fontSize:10,color:`var(--fg-muted)`,textAlign:`center`,wordBreak:`break-all`,lineHeight:1.3},children:e})]},e))})},c={render:()=>(0,a.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(80px, 1fr))`,gap:8,fontFamily:`var(--font-mono)`},children:Object.entries(r).map(([e,t])=>(0,a.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:6,padding:`16px 8px`,borderRadius:6,border:`1px solid var(--border)`,background:`var(--surface)`,color:`var(--fg)`},children:[(0,a.jsx)(t,{size:32}),(0,a.jsx)(`span`,{style:{fontSize:9,color:`var(--fg-muted)`,textAlign:`center`,wordBreak:`break-all`},children:e})]},e))})},l={render:()=>(0,a.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:16,color:`var(--fg)`},children:Object.entries(r).map(([e,t])=>(0,a.jsx)(t,{size:20,strokeWidth:1},e))})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
    gap: 8,
    fontFamily: 'var(--font-mono)'
  }}>
      {Object.entries(Icons).map(([name, IconComponent]) => <div key={name} style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      padding: '12px 8px',
      borderRadius: 6,
      border: '1px solid var(--border)',
      background: 'var(--surface)',
      color: 'var(--fg)'
    }}>
          <IconComponent size={20} />
          <span style={{
        fontSize: 10,
        color: 'var(--fg-muted)',
        textAlign: 'center',
        wordBreak: 'break-all',
        lineHeight: 1.3
      }}>
            {name}
          </span>
        </div>)}
    </div>
}`,...s.parameters?.docs?.source},description:{story:`All glyphs in a labelled grid at the default size.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
    gap: 8,
    fontFamily: 'var(--font-mono)'
  }}>
      {Object.entries(Icons).map(([name, IconComponent]) => <div key={name} style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      padding: '16px 8px',
      borderRadius: 6,
      border: '1px solid var(--border)',
      background: 'var(--surface)',
      color: 'var(--fg)'
    }}>
          <IconComponent size={32} />
          <span style={{
        fontSize: 9,
        color: 'var(--fg-muted)',
        textAlign: 'center',
        wordBreak: 'break-all'
      }}>
            {name}
          </span>
        </div>)}
    </div>
}`,...c.parameters?.docs?.source},description:{story:`Large — glyphs at 32px for anatomy and documentation use.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 16,
    color: 'var(--fg)'
  }}>
      {Object.entries(Icons).map(([name, IconComponent]) => <IconComponent key={name} size={20} strokeWidth={1} />)}
    </div>
}`,...l.parameters?.docs?.source},description:{story:`Thinner stroke — all glyphs with strokeWidth 1 for editorial contexts.`,...l.parameters?.docs?.description}}},u=[`AllIcons`,`Large`,`ThinStroke`]}))();export{s as AllIcons,c as Large,l as ThinStroke,u as __namedExportsOrder,o as default};