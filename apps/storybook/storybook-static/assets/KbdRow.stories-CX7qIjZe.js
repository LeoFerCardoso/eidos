import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./jsx-runtime-CaZkqeYb.js";import{ka as n,t as r}from"./src-DgoylXRw.js";var i,a,o,s,c,l,u,d;e((()=>{r(),i=t(),a={title:`Primitives/KbdRow`,component:n,tags:[`autodocs`],parameters:{docs:{description:{component:"Label + keyboard chord row for menus and command palettes. Composes `.kbd` cells from tokens.css; an optional `meta` hint sits between the label and the chord."}}},args:{label:`Open command palette`,keys:[`⌘`,`K`]},argTypes:{label:{control:`text`},meta:{control:`text`,description:`Muted hint between label and chord.`},keys:{control:`object`,description:`Array of key cap strings.`}}},o={},s={args:{label:`Force push (blocked)`,keys:[`⌘`,`⇧`,`P`]}},c={args:{label:`Jump to definition`,meta:`editor`,keys:[`F12`]}},l={args:{label:`Navigation`,keys:[]}},u={render:()=>(0,i.jsx)(`div`,{style:{background:`var(--surface)`,border:`1px solid var(--border)`,borderRadius:10,padding:`8px 0`,minWidth:320},children:[{label:`Open command palette`,keys:[`⌘`,`K`]},{label:`New deploy`,keys:[`⌘`,`D`]},{label:`Search services`,keys:[`⌘`,`/`]},{label:`Toggle dark mode`,keys:[`⌘`,`⇧`,`L`]},{label:`Go to incidents`,keys:[`G`,`I`],meta:`then`},{label:`Copy service ID`,keys:[`⌘`,`C`],meta:`focused row`}].map(({label:e,keys:t,meta:r})=>(0,i.jsx)(n,{label:e,keys:t,meta:r},e))})},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source},description:{story:`Single row — command palette shortcut.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Force push (blocked)',
    keys: ['⌘', '⇧', 'P']
  }
}`,...s.parameters?.docs?.source},description:{story:`Three-key chord.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Jump to definition',
    meta: 'editor',
    keys: ['F12']
  }
}`,...c.parameters?.docs?.source},description:{story:`With a meta hint.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Navigation',
    keys: []
  }
}`,...l.parameters?.docs?.source},description:{story:`No keys — label only row (section header in a palette).`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '8px 0',
    minWidth: 320
  }}>
      {[{
      label: 'Open command palette',
      keys: ['⌘', 'K']
    }, {
      label: 'New deploy',
      keys: ['⌘', 'D']
    }, {
      label: 'Search services',
      keys: ['⌘', '/']
    }, {
      label: 'Toggle dark mode',
      keys: ['⌘', '⇧', 'L']
    }, {
      label: 'Go to incidents',
      keys: ['G', 'I'],
      meta: 'then'
    }, {
      label: 'Copy service ID',
      keys: ['⌘', 'C'],
      meta: 'focused row'
    }].map(({
      label,
      keys,
      meta
    }) => <KbdRow key={label} label={label} keys={keys} meta={meta} />)}
    </div>
}`,...u.parameters?.docs?.source},description:{story:`A realistic command palette shortcut sheet.`,...u.parameters?.docs?.description}}},d=[`Default`,`ThreeKey`,`WithMeta`,`LabelOnly`,`InContext`]}))();export{o as Default,u as InContext,l as LabelOnly,s as ThreeKey,c as WithMeta,d as __namedExportsOrder,a as default};