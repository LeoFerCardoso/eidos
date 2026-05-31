import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{Oa as r,t as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u,d,f,p,m,h;e((()=>{t(),i(),a=n(),o={title:`Primitives/Kbd`,component:r,tags:[`autodocs`],parameters:{docs:{description:{component:'Keyboard key / chord / row component. Renders a single key (`<Kbd>⌘</Kbd>` or `keys="K"`), a chord (`keys={["⌘","K"]}`), or a label+chord row (`label="…" keys={[…]}`). Composes `.kbd` / `.kbd-chord` / `.kbd-row` from tokens.css.'}}},args:{children:`⌘`},argTypes:{children:{control:`text`,description:`Key glyph (single-key mode, ignored when keys is set).`},keys:{control:`object`,description:`String or array of keys. Single string → one key; array → chord.`},label:{control:`text`,description:`Row label (start). Presence switches to row mode.`},meta:{control:`text`,description:`Muted hint between label and chord (row mode only).`},className:{control:`text`}}},s={},c={args:{keys:`Esc`,children:void 0}},l={args:{keys:[`⌘`,`K`],children:void 0}},u={args:{keys:[`⌘`,`⇧`,`P`],children:void 0}},d={args:{label:`Open command palette`,keys:[`⌘`,`K`],children:void 0},decorators:[e=>(0,a.jsx)(`div`,{style:{minWidth:320,background:`var(--surface)`,border:`1px solid var(--border)`,borderRadius:10},children:(0,a.jsx)(e,{})})]},f={args:{label:`Jump to definition`,keys:[`F12`],meta:`editor`,children:void 0},decorators:[e=>(0,a.jsx)(`div`,{style:{minWidth:320,background:`var(--surface)`,border:`1px solid var(--border)`,borderRadius:10},children:(0,a.jsx)(e,{})})]},p={render:()=>(0,a.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:6},children:[`⌘`,`⌥`,`⌃`,`⇧`,`↵`,`Esc`,`⌫`,`Tab`,`F12`,`→`,`↑`,` `].map(e=>(0,a.jsx)(r,{children:e},e))})},m={render:()=>(0,a.jsx)(`div`,{style:{background:`var(--surface)`,border:`1px solid var(--border)`,borderRadius:10,padding:`8px 0`,minWidth:320},children:[{label:`Open command palette`,keys:[`⌘`,`K`]},{label:`New deploy`,keys:[`⌘`,`D`]},{label:`Search services`,keys:[`⌘`,`/`]},{label:`Toggle dark mode`,keys:[`⌘`,`⇧`,`L`]},{label:`Go to incidents`,keys:[`G`,`I`],meta:`then`},{label:`Copy service ID`,keys:[`⌘`,`C`],meta:`focused row`}].map(({label:e,keys:t,meta:n})=>(0,a.jsx)(r,{label:e,keys:t,meta:n},e))})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source},description:{story:`Single key rendered via children.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    keys: 'Esc',
    children: undefined
  }
}`,...c.parameters?.docs?.source},description:{story:"Single key via `keys` prop (string shorthand).",...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    keys: ['⌘', 'K'],
    children: undefined
  }
}`,...l.parameters?.docs?.source},description:{story:`Chord — two-key shorthand.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    keys: ['⌘', '⇧', 'P'],
    children: undefined
  }
}`,...u.parameters?.docs?.source},description:{story:`Three-key chord.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Open command palette',
    keys: ['⌘', 'K'],
    children: undefined
  },
  decorators: [Story => <div style={{
    minWidth: 320,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10
  }}>
        <Story />
      </div>]
}`,...d.parameters?.docs?.source},description:{story:`Row mode — label + chord.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Jump to definition',
    keys: ['F12'],
    meta: 'editor',
    children: undefined
  },
  decorators: [Story => <div style={{
    minWidth: 320,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10
  }}>
        <Story />
      </div>]
}`,...f.parameters?.docs?.source},description:{story:`Row with meta hint.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6
  }}>
      {['⌘', '⌥', '⌃', '⇧', '↵', 'Esc', '⌫', 'Tab', 'F12', '→', '↑', ' '].map(k => <Kbd key={k}>{k}</Kbd>)}
    </div>
}`,...p.parameters?.docs?.source},description:{story:`All single-key glyphs for modifier + action keys.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '8px 0',
    minWidth: 320
  }}>
      {[{
      label: 'Open command palette',
      keys: ['⌘', 'K'] as string[]
    }, {
      label: 'New deploy',
      keys: ['⌘', 'D'] as string[]
    }, {
      label: 'Search services',
      keys: ['⌘', '/'] as string[]
    }, {
      label: 'Toggle dark mode',
      keys: ['⌘', '⇧', 'L'] as string[]
    }, {
      label: 'Go to incidents',
      keys: ['G', 'I'] as string[],
      meta: 'then'
    }, {
      label: 'Copy service ID',
      keys: ['⌘', 'C'] as string[],
      meta: 'focused row'
    }].map(({
      label,
      keys,
      meta
    }) => <Kbd key={label} label={label} keys={keys} meta={meta} />)}
    </div>
}`,...m.parameters?.docs?.source},description:{story:`In context — command palette shortcut sheet using row mode.`,...m.parameters?.docs?.description}}},h=[`Default`,`KeyString`,`Chord`,`ThreeKey`,`Row`,`RowWithMeta`,`AllKeys`,`InContext`]}))();export{p as AllKeys,l as Chord,s as Default,m as InContext,c as KeyString,d as Row,f as RowWithMeta,u as ThreeKey,h as __namedExportsOrder,o as default};