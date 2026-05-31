import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Lt as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h,g,_;e((()=>{o=t(n(),1),a(),s=r(),c={title:`Primitives/ButtonGroup`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:`Visually-joined cluster of action buttons. Collapses inner seam borders, rounds only the outer corners. Grouping only — for toggle/selection use ToggleGroup.`}}},args:{orientation:`horizontal`,size:`md`,"aria-label":`Time range`},argTypes:{orientation:{control:`inline-radio`,options:[`horizontal`,`vertical`]},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]}}},l={render:e=>(0,s.jsxs)(i,{...e,children:[(0,s.jsx)(`button`,{className:`btn outline`,children:`Day`}),(0,s.jsx)(`button`,{className:`btn outline`,"aria-pressed":`true`,style:{background:`var(--surface-hover)`},children:`Week`}),(0,s.jsx)(`button`,{className:`btn outline`,children:`Month`}),(0,s.jsx)(`button`,{className:`btn outline`,children:`Year`})]})},u={render:()=>(0,s.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:16,alignItems:`flex-start`},children:[`sm`,`md`,`lg`].map(e=>(0,s.jsxs)(i,{size:e,"aria-label":`${e} group`,children:[(0,s.jsx)(`button`,{className:`btn outline ${e===`md`?``:e}`,children:`Left`}),(0,s.jsx)(`button`,{className:`btn outline ${e===`md`?``:e}`,children:`Middle`}),(0,s.jsx)(`button`,{className:`btn outline ${e===`md`?``:e}`,children:`Right`})]},e))})},d={args:{orientation:`vertical`},render:e=>(0,s.jsxs)(i,{...e,"aria-label":`Text alignment`,children:[(0,s.jsx)(`button`,{className:`btn outline`,children:`Top`}),(0,s.jsx)(`button`,{className:`btn outline`,"aria-pressed":`true`,style:{background:`var(--surface-hover)`},children:`Middle`}),(0,s.jsx)(`button`,{className:`btn outline`,children:`Bottom`})]})},f={render:e=>(0,s.jsxs)(i,{...e,"aria-label":`Text alignment`,children:[(0,s.jsx)(`button`,{className:`btn icon outline`,"aria-label":`Align left`,children:(0,s.jsxs)(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,"aria-hidden":`true`,children:[(0,s.jsx)(`line`,{x1:`3`,y1:`6`,x2:`21`,y2:`6`}),(0,s.jsx)(`line`,{x1:`3`,y1:`12`,x2:`15`,y2:`12`}),(0,s.jsx)(`line`,{x1:`3`,y1:`18`,x2:`18`,y2:`18`})]})}),(0,s.jsx)(`button`,{className:`btn icon outline`,"aria-label":`Align center`,"aria-pressed":`true`,style:{background:`var(--surface-hover)`},children:(0,s.jsxs)(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,"aria-hidden":`true`,children:[(0,s.jsx)(`line`,{x1:`3`,y1:`6`,x2:`21`,y2:`6`}),(0,s.jsx)(`line`,{x1:`6`,y1:`12`,x2:`18`,y2:`12`}),(0,s.jsx)(`line`,{x1:`4`,y1:`18`,x2:`20`,y2:`18`})]})}),(0,s.jsx)(`button`,{className:`btn icon outline`,"aria-label":`Align right`,children:(0,s.jsxs)(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,"aria-hidden":`true`,children:[(0,s.jsx)(`line`,{x1:`3`,y1:`6`,x2:`21`,y2:`6`}),(0,s.jsx)(`line`,{x1:`9`,y1:`12`,x2:`21`,y2:`12`}),(0,s.jsx)(`line`,{x1:`6`,y1:`18`,x2:`21`,y2:`18`})]})})]})},p={render:e=>(0,s.jsxs)(i,{...e,"aria-label":`Deploy options`,children:[(0,s.jsx)(`button`,{className:`btn ember`,children:`Deploy`}),(0,s.jsx)(`button`,{className:`btn ember icon`,"aria-label":`More deploy options`,children:(0,s.jsx)(`svg`,{width:`14`,height:`14`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,"aria-hidden":`true`,children:(0,s.jsx)(`polyline`,{points:`6 9 12 15 18 9`})})})]})},m={render:e=>(0,s.jsxs)(`div`,{dir:`rtl`,style:{display:`flex`,gap:20,flexDirection:`column`,alignItems:`flex-start`},children:[(0,s.jsxs)(i,{...e,"aria-label":`نطاق زمني`,children:[(0,s.jsx)(`button`,{className:`btn outline`,children:`يوم`}),(0,s.jsx)(`button`,{className:`btn outline`,"aria-pressed":`true`,style:{background:`var(--surface-hover)`},children:`أسبوع`}),(0,s.jsx)(`button`,{className:`btn outline`,children:`شهر`})]}),(0,s.jsxs)(i,{...e,orientation:`vertical`,"aria-label":`محاذاة`,children:[(0,s.jsx)(`button`,{className:`btn outline`,children:`أعلى`}),(0,s.jsx)(`button`,{className:`btn outline`,children:`وسط`}),(0,s.jsx)(`button`,{className:`btn outline`,children:`أسفل`})]})]})},h={render:e=>{let[t,n]=o.useState(`week`),r=[{key:`day`,label:`Day`},{key:`week`,label:`Week`},{key:`month`,label:`Month`}];return(0,s.jsx)(i,{...e,"aria-label":`Time range`,children:r.map(({key:e,label:r})=>(0,s.jsx)(`button`,{className:`btn outline`,"aria-pressed":t===e,style:t===e?{background:`var(--surface-hover)`}:void 0,onClick:()=>n(e),children:r},e))})}},g={render:()=>(0,s.jsxs)(`div`,{className:`toolbar`,role:`toolbar`,"aria-label":`Editor toolbar`,children:[(0,s.jsxs)(i,{"aria-label":`Text style`,children:[(0,s.jsx)(`button`,{className:`btn icon ghost sm`,"aria-label":`Bold`,"aria-pressed":`true`,style:{background:`var(--surface-hover)`,fontWeight:700},children:`B`}),(0,s.jsx)(`button`,{className:`btn icon ghost sm`,"aria-label":`Italic`,style:{fontStyle:`italic`},children:`I`}),(0,s.jsx)(`button`,{className:`btn icon ghost sm`,"aria-label":`Underline`,style:{textDecoration:`underline`},children:`U`})]}),(0,s.jsx)(`span`,{className:`toolbar-sep`,role:`separator`,"aria-orientation":`vertical`}),(0,s.jsxs)(i,{"aria-label":`Text alignment`,children:[(0,s.jsx)(`button`,{className:`btn icon ghost sm`,"aria-label":`Align left`,"aria-pressed":`true`,style:{background:`var(--surface-hover)`},children:(0,s.jsxs)(`svg`,{width:`12`,height:`12`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,"aria-hidden":`true`,children:[(0,s.jsx)(`line`,{x1:`3`,y1:`6`,x2:`21`,y2:`6`}),(0,s.jsx)(`line`,{x1:`3`,y1:`12`,x2:`15`,y2:`12`}),(0,s.jsx)(`line`,{x1:`3`,y1:`18`,x2:`18`,y2:`18`})]})}),(0,s.jsx)(`button`,{className:`btn icon ghost sm`,"aria-label":`Align center`,children:(0,s.jsxs)(`svg`,{width:`12`,height:`12`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,"aria-hidden":`true`,children:[(0,s.jsx)(`line`,{x1:`3`,y1:`6`,x2:`21`,y2:`6`}),(0,s.jsx)(`line`,{x1:`6`,y1:`12`,x2:`18`,y2:`12`}),(0,s.jsx)(`line`,{x1:`4`,y1:`18`,x2:`20`,y2:`18`})]})}),(0,s.jsx)(`button`,{className:`btn icon ghost sm`,"aria-label":`Align right`,children:(0,s.jsxs)(`svg`,{width:`12`,height:`12`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,"aria-hidden":`true`,children:[(0,s.jsx)(`line`,{x1:`3`,y1:`6`,x2:`21`,y2:`6`}),(0,s.jsx)(`line`,{x1:`9`,y1:`12`,x2:`21`,y2:`12`}),(0,s.jsx)(`line`,{x1:`6`,y1:`18`,x2:`21`,y2:`18`})]})})]}),(0,s.jsx)(`span`,{className:`toolbar-sep`,role:`separator`,"aria-orientation":`vertical`}),(0,s.jsxs)(i,{"aria-label":`Deploy`,children:[(0,s.jsx)(`button`,{className:`btn ember sm`,children:`Deploy`}),(0,s.jsx)(`button`,{className:`btn ember sm icon`,"aria-label":`More deploy options`,children:(0,s.jsx)(`svg`,{width:`12`,height:`12`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,"aria-hidden":`true`,children:(0,s.jsx)(`polyline`,{points:`6 9 12 15 18 9`})})})]})]})},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <ButtonGroup {...args}>
      <button className="btn outline">Day</button>
      <button className="btn outline" aria-pressed="true" style={{
      background: 'var(--surface-hover)'
    }}>
        Week
      </button>
      <button className="btn outline">Month</button>
      <button className="btn outline">Year</button>
    </ButtonGroup>
}`,...l.parameters?.docs?.source},description:{story:`Default outline group — the most common usage.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    alignItems: 'flex-start'
  }}>
      {(['sm', 'md', 'lg'] as const).map(size => <ButtonGroup key={size} size={size} aria-label={\`\${size} group\`}>
          <button className={\`btn outline \${size !== 'md' ? size : ''}\`}>Left</button>
          <button className={\`btn outline \${size !== 'md' ? size : ''}\`}>Middle</button>
          <button className={\`btn outline \${size !== 'md' ? size : ''}\`}>Right</button>
        </ButtonGroup>)}
    </div>
}`,...u.parameters?.docs?.source},description:{story:`Three available sizes — sm for dense toolbars, lg for primary surfaces.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    orientation: 'vertical'
  },
  render: args => <ButtonGroup {...args} aria-label="Text alignment">
      <button className="btn outline">Top</button>
      <button className="btn outline" aria-pressed="true" style={{
      background: 'var(--surface-hover)'
    }}>
        Middle
      </button>
      <button className="btn outline">Bottom</button>
    </ButtonGroup>
}`,...d.parameters?.docs?.source},description:{story:`Vertical orientation — segments stack top-to-bottom.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <ButtonGroup {...args} aria-label="Text alignment">
      <button className="btn icon outline" aria-label="Align left">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="15" y2="12" /><line x1="3" y1="18" x2="18" y2="18" />
        </svg>
      </button>
      <button className="btn icon outline" aria-label="Align center" aria-pressed="true" style={{
      background: 'var(--surface-hover)'
    }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="6" y1="12" x2="18" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>
      <button className="btn icon outline" aria-label="Align right">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="9" y1="12" x2="21" y2="12" /><line x1="6" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </ButtonGroup>
}`,...f.parameters?.docs?.source},description:{story:`Icon-only segments — each cell must carry an aria-label.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <ButtonGroup {...args} aria-label="Deploy options">
      <button className="btn ember">Deploy</button>
      <button className="btn ember icon" aria-label="More deploy options">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </ButtonGroup>
}`,...p.parameters?.docs?.source},description:{story:`Split action — primary CTA + overflow chevron share the ember fill.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <div dir="rtl" style={{
    display: 'flex',
    gap: 20,
    flexDirection: 'column',
    alignItems: 'flex-start'
  }}>
      <ButtonGroup {...args} aria-label="نطاق زمني">
        <button className="btn outline">يوم</button>
        <button className="btn outline" aria-pressed="true" style={{
        background: 'var(--surface-hover)'
      }}>
          أسبوع
        </button>
        <button className="btn outline">شهر</button>
      </ButtonGroup>
      <ButtonGroup {...args} orientation="vertical" aria-label="محاذاة">
        <button className="btn outline">أعلى</button>
        <button className="btn outline">وسط</button>
        <button className="btn outline">أسفل</button>
      </ButtonGroup>
    </div>
}`,...m.parameters?.docs?.source},description:{story:`RTL — border-inline and border-radius logical props mirror automatically.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [active, setActive] = React.useState<'day' | 'week' | 'month'>('week');
    const options = [{
      key: 'day',
      label: 'Day'
    }, {
      key: 'week',
      label: 'Week'
    }, {
      key: 'month',
      label: 'Month'
    }] as const;
    return <ButtonGroup {...args} aria-label="Time range">
        {options.map(({
        key,
        label
      }) => <button key={key} className="btn outline" aria-pressed={active === key} style={active === key ? {
        background: 'var(--surface-hover)'
      } : undefined} onClick={() => setActive(key)}>
            {label}
          </button>)}
      </ButtonGroup>;
  }
}`,...h.parameters?.docs?.source},description:{story:`A stateful demo — click a segment to mark it active.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div className="toolbar" role="toolbar" aria-label="Editor toolbar">
      <ButtonGroup aria-label="Text style">
        <button className="btn icon ghost sm" aria-label="Bold" aria-pressed="true" style={{
        background: 'var(--surface-hover)',
        fontWeight: 700
      }}>B</button>
        <button className="btn icon ghost sm" aria-label="Italic" style={{
        fontStyle: 'italic'
      }}>I</button>
        <button className="btn icon ghost sm" aria-label="Underline" style={{
        textDecoration: 'underline'
      }}>U</button>
      </ButtonGroup>
      <span className="toolbar-sep" role="separator" aria-orientation="vertical" />
      <ButtonGroup aria-label="Text alignment">
        <button className="btn icon ghost sm" aria-label="Align left" aria-pressed="true" style={{
        background: 'var(--surface-hover)'
      }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="15" y2="12" /><line x1="3" y1="18" x2="18" y2="18" />
          </svg>
        </button>
        <button className="btn icon ghost sm" aria-label="Align center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="6" y1="12" x2="18" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
        <button className="btn icon ghost sm" aria-label="Align right">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="9" y1="12" x2="21" y2="12" /><line x1="6" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </ButtonGroup>
      <span className="toolbar-sep" role="separator" aria-orientation="vertical" />
      <ButtonGroup aria-label="Deploy">
        <button className="btn ember sm">Deploy</button>
        <button className="btn ember sm icon" aria-label="More deploy options">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </ButtonGroup>
    </div>
}`,...g.parameters?.docs?.source},description:{story:`In context — a compact file toolbar with mixed groups and separators.`,...g.parameters?.docs?.description}}},_=[`Default`,`Sizes`,`Vertical`,`IconOnly`,`SplitAction`,`RTL`,`StatefulDemo`,`InContext`]}))();export{l as Default,f as IconOnly,g as InContext,m as RTL,u as Sizes,p as SplitAction,h as StatefulDemo,d as Vertical,_ as __namedExportsOrder,c as default};