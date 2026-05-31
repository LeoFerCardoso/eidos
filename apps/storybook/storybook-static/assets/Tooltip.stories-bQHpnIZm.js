import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{t as i,vn as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h,g;e((()=>{o=t(n(),1),i(),s=r(),c={title:`Overlays/Tooltip`,component:a,tags:[`autodocs`],parameters:{layout:`centered`,docs:{description:{component:'Short contextual hint shown on hover or keyboard focus of its trigger. Uses `role="tooltip"` + `aria-describedby` so screen readers read the hint as supplementary text. ESC dismisses; pointer-events:none on the bubble; prefers-reduced-motion removes the fade/slide animation.'}}},args:{content:`Search (⌘K)`,side:`top`,align:`center`,delayDuration:500,closeDelayDuration:100},argTypes:{side:{control:`inline-radio`,options:[`top`,`right`,`bottom`,`left`]},align:{control:`inline-radio`,options:[`start`,`center`,`end`]},delayDuration:{control:`number`,description:`Open delay in ms.`},closeDelayDuration:{control:`number`,description:`Close delay in ms.`},open:{control:`boolean`,description:`Force open (controlled).`},content:{control:`text`}}},l={render:e=>(0,s.jsx)(a,{...e,children:(0,s.jsx)(`button`,{className:`btn icon`,"aria-label":`Search`,children:(0,s.jsxs)(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,"aria-hidden":`true`,children:[(0,s.jsx)(`circle`,{cx:`11`,cy:`11`,r:`8`}),(0,s.jsx)(`line`,{x1:`21`,y1:`21`,x2:`16.65`,y2:`16.65`})]})})})},u={render:()=>(0,s.jsx)(`div`,{style:{display:`flex`,gap:32,alignItems:`center`,padding:`48px 32px`},children:[`top`,`right`,`bottom`,`left`].map(e=>(0,s.jsx)(a,{content:`${e[0].toUpperCase()}${e.slice(1)} placement`,side:e,delayDuration:0,children:(0,s.jsx)(`button`,{className:`btn outline`,style:{minWidth:80},children:e})},e))})},d={render:()=>(0,s.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:16,padding:`48px 24px`,width:280},children:[`start`,`center`,`end`].map(e=>(0,s.jsx)(a,{content:`Aligned ${e}`,side:`top`,align:e,delayDuration:0,children:(0,s.jsxs)(`button`,{className:`btn`,style:{width:`100%`},children:[`align="`,e,`"`]})},e))})},f={render:()=>{let[e,t]=o.useState(!1);return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:24,padding:32},children:[(0,s.jsxs)(`label`,{style:{display:`flex`,alignItems:`center`,gap:8,fontFamily:`var(--font)`,fontSize:13,color:`var(--fg)`},children:[(0,s.jsx)(`input`,{type:`checkbox`,checked:e,onChange:e=>t(e.target.checked)}),`Force tooltip open`]}),(0,s.jsx)(a,{content:`Controlled tooltip`,open:e,onOpenChange:t,delayDuration:0,children:(0,s.jsx)(`button`,{className:`btn ember`,children:`Hover or control me`})})]})}},p={args:{content:`Instant`,delayDuration:0},render:e=>(0,s.jsx)(a,{...e,children:(0,s.jsx)(`button`,{className:`btn icon`,"aria-label":`Settings`,children:(0,s.jsxs)(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,"aria-hidden":`true`,children:[(0,s.jsx)(`circle`,{cx:`12`,cy:`12`,r:`3`}),(0,s.jsx)(`path`,{d:`M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z`})]})})})},m={render:()=>(0,s.jsx)(`div`,{style:{display:`inline-flex`,alignItems:`center`,gap:4,padding:`6px 10px`,background:`var(--surface)`,border:`1px solid var(--border)`,borderRadius:8},children:[{label:`Search`,key:`⌘K`},{label:`Filter`,key:void 0},{label:`Download`,key:void 0},{label:`Settings`,key:void 0}].map(({label:e,key:t})=>(0,s.jsx)(a,{content:t?`${e} (${t})`:e,side:`top`,delayDuration:200,children:(0,s.jsx)(`button`,{className:`btn icon ghost`,"aria-label":e,style:{width:32,height:32},children:(0,s.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:10,color:`var(--fg-muted)`},children:e.slice(0,2)})})},e))})},h={render:()=>(0,s.jsxs)(`div`,{dir:`rtl`,style:{display:`flex`,gap:24,alignItems:`center`,padding:`48px 32px`},children:[(0,s.jsx)(a,{content:`بحث (⌘K)`,side:`top`,delayDuration:0,children:(0,s.jsx)(`button`,{className:`btn icon`,"aria-label":`بحث`,children:(0,s.jsxs)(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,"aria-hidden":`true`,children:[(0,s.jsx)(`circle`,{cx:`11`,cy:`11`,r:`8`}),(0,s.jsx)(`line`,{x1:`21`,y1:`21`,x2:`16.65`,y2:`16.65`})]})})}),(0,s.jsx)(a,{content:`فلتر`,side:`bottom`,delayDuration:0,children:(0,s.jsx)(`button`,{className:`btn icon ghost`,"aria-label":`فلتر`,children:(0,s.jsxs)(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,"aria-hidden":`true`,children:[(0,s.jsx)(`line`,{x1:`4`,y1:`6`,x2:`20`,y2:`6`}),(0,s.jsx)(`line`,{x1:`8`,y1:`12`,x2:`16`,y2:`12`}),(0,s.jsx)(`line`,{x1:`11`,y1:`18`,x2:`13`,y2:`18`})]})})}),(0,s.jsx)(a,{content:`الإعدادات`,side:`right`,delayDuration:0,children:(0,s.jsx)(`button`,{className:`btn icon outline`,"aria-label":`الإعدادات`,children:(0,s.jsx)(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,"aria-hidden":`true`,children:(0,s.jsx)(`circle`,{cx:`12`,cy:`12`,r:`3`})})})})]})},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <Tooltip {...args}>
      <button className="btn icon" aria-label="Search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </Tooltip>
}`,...l.parameters?.docs?.source},description:{story:`Default — icon-only button trigger, top placement, 500ms open delay.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 32,
    alignItems: 'center',
    padding: '48px 32px'
  }}>
      {(['top', 'right', 'bottom', 'left'] as const).map(side => <Tooltip key={side} content={\`\${side[0].toUpperCase()}\${side.slice(1)} placement\`} side={side} delayDuration={0}>
          <button className="btn outline" style={{
        minWidth: 80
      }}>
            {side}
          </button>
        </Tooltip>)}
    </div>
}`,...u.parameters?.docs?.source},description:{story:`All four placements — hover each button to see the tooltip flip.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    padding: '48px 24px',
    width: 280
  }}>
      {(['start', 'center', 'end'] as const).map(align => <Tooltip key={align} content={\`Aligned \${align}\`} side="top" align={align} delayDuration={0}>
          <button className="btn" style={{
        width: '100%'
      }}>
            align=&quot;{align}&quot;
          </button>
        </Tooltip>)}
    </div>
}`,...d.parameters?.docs?.source},description:{story:`Alignment variants along the top side — start, center (default), end.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(false);
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 24,
      padding: 32
    }}>
        <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: 'var(--font)',
        fontSize: 13,
        color: 'var(--fg)'
      }}>
          <input type="checkbox" checked={open} onChange={e => setOpen(e.target.checked)} />
          Force tooltip open
        </label>
        <Tooltip content="Controlled tooltip" open={open} onOpenChange={setOpen} delayDuration={0}>
          <button className="btn ember">Hover or control me</button>
        </Tooltip>
      </div>;
  }
}`,...f.parameters?.docs?.source},description:{story:`Controlled — open state is driven externally by a checkbox.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    content: 'Instant',
    delayDuration: 0
  },
  render: args => <Tooltip {...args}>
      <button className="btn icon" aria-label="Settings">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>
    </Tooltip>
}`,...p.parameters?.docs?.source},description:{story:`No delay — instant open, useful for icon-dense toolbars.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const tools = [{
      label: 'Search',
      key: '⌘K'
    }, {
      label: 'Filter',
      key: undefined
    }, {
      label: 'Download',
      key: undefined
    }, {
      label: 'Settings',
      key: undefined
    }];
    return <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '6px 10px',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 8
    }}>
        {tools.map(({
        label,
        key
      }) => <Tooltip key={label} content={key ? \`\${label} (\${key})\` : label} side="top" delayDuration={200}>
            <button className="btn icon ghost" aria-label={label} style={{
          width: 32,
          height: 32
        }}>
              <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--fg-muted)'
          }}>
                {label.slice(0, 2)}
              </span>
            </button>
          </Tooltip>)}
      </div>;
  }
}`,...m.parameters?.docs?.source},description:{story:`In context — tooltip in a realistic icon toolbar (no delay for toolbar density).`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div dir="rtl" style={{
    display: 'flex',
    gap: 24,
    alignItems: 'center',
    padding: '48px 32px'
  }}>
      <Tooltip content="بحث (⌘K)" side="top" delayDuration={0}>
        <button className="btn icon" aria-label="بحث">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </Tooltip>
      <Tooltip content="فلتر" side="bottom" delayDuration={0}>
        <button className="btn icon ghost" aria-label="فلتر">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
          </svg>
        </button>
      </Tooltip>
      <Tooltip content="الإعدادات" side="right" delayDuration={0}>
        <button className="btn icon outline" aria-label="الإعدادات">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </Tooltip>
    </div>
}`,...h.parameters?.docs?.source},description:{story:`RTL — tooltip placement stays visually correct under dir=rtl.`,...h.parameters?.docs?.description}}},g=[`Default`,`Placements`,`Alignment`,`Controlled`,`NoDelay`,`InContext`,`RTL`]}))();export{d as Alignment,f as Controlled,l as Default,m as InContext,p as NoDelay,u as Placements,h as RTL,g as __namedExportsOrder,c as default};