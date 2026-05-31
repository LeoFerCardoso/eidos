import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./jsx-runtime-CaZkqeYb.js";import{t as n,zt as r}from"./src-DgoylXRw.js";var i,a,o,s,c,l,u,d,f,p;e((()=>{n(),i=t(),a={title:`Primitives/ScrollArea`,component:r,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:"A bounded scrollable region with thin, auto-hiding, themeable scrollbars. Uses native browser scroll — no custom DOM track/thumb nodes. Keyboard-scrollable when `focusable` is true; RTL-correct via logical CSS."}}},args:{orientation:`vertical`,type:`hover`,maxHeight:`220px`,label:`Item list`,focusable:!0},argTypes:{orientation:{control:`inline-radio`,options:[`vertical`,`horizontal`,`both`]},type:{control:`inline-radio`,options:[`hover`,`always`,`auto`]},maxHeight:{control:`text`},maxWidth:{control:`text`},label:{control:`text`},focusable:{control:`boolean`}}},o=({n:e})=>(0,i.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:10,padding:`8px 0`,borderBottom:e<23?`1px solid var(--border)`:`none`,fontSize:`var(--text-base)`,color:`var(--fg-muted)`},children:[(0,i.jsxs)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:`var(--text-xs)`,color:`var(--fg-faint)`,flexShrink:0},children:[`#`,String(e+1).padStart(2,`0`)]}),(0,i.jsx)(`span`,{children:`Service event — region us-east-1`})]}),s={args:{maxHeight:`220px`,style:{border:`1px solid var(--border)`,borderRadius:`var(--radius-xl)`,padding:`0 12px`,background:`var(--surface)`}},render:e=>(0,i.jsx)(r,{...e,children:Array.from({length:24},(e,t)=>(0,i.jsx)(o,{n:t},t))})},c={args:{type:`always`,maxHeight:`220px`,label:`Pipeline log`,style:{border:`1px solid var(--border)`,borderRadius:`var(--radius-xl)`,padding:`0 12px`,background:`var(--surface)`}},render:e=>(0,i.jsx)(r,{...e,children:Array.from({length:24},(e,t)=>(0,i.jsx)(o,{n:t},t))})},l={args:{orientation:`horizontal`,maxHeight:void 0,maxWidth:`100%`,label:`Edge nodes`,style:{border:`1px solid var(--border)`,borderRadius:`var(--radius-xl)`,padding:`12px`,background:`var(--surface)`}},render:e=>(0,i.jsx)(r,{...e,children:(0,i.jsx)(`div`,{style:{display:`flex`,gap:10,paddingInlineEnd:4},children:Array.from({length:12},(e,t)=>(0,i.jsxs)(`div`,{style:{minWidth:160,border:`1px solid var(--border)`,borderRadius:`var(--radius-xl)`,padding:10,fontSize:`var(--text-sm)`,color:`var(--fg-muted)`},children:[(0,i.jsxs)(`div`,{style:{fontWeight:600,color:`var(--fg)`},children:[`edge-`,t+1]}),(0,i.jsx)(`div`,{children:`us-east-1`}),(0,i.jsx)(`div`,{className:`pill`,style:{marginTop:6},children:`Healthy`})]},t))})})},u={args:{orientation:`both`,maxHeight:`200px`,maxWidth:`340px`,label:`Data grid`,style:{border:`1px solid var(--border)`,borderRadius:`var(--radius-xl)`,padding:`8px`,background:`var(--surface)`}},render:e=>(0,i.jsx)(r,{...e,children:(0,i.jsx)(`div`,{style:{minWidth:600},children:Array.from({length:18},(e,t)=>(0,i.jsxs)(`div`,{style:{display:`flex`,gap:24,padding:`6px 0`,borderBottom:t<17?`1px solid var(--border)`:`none`,fontSize:`var(--text-sm)`,color:`var(--fg-muted)`,whiteSpace:`nowrap`},children:[(0,i.jsxs)(`span`,{style:{width:80,fontFamily:`var(--font-mono)`,fontSize:`var(--text-xs)`,color:`var(--fg-faint)`},children:[`row-`,String(t+1).padStart(3,`0`)]}),(0,i.jsxs)(`span`,{children:[`service-`,t+1]}),(0,i.jsxs)(`span`,{children:[`us-east-`,t%3+1]}),(0,i.jsx)(`span`,{children:`Healthy`}),(0,i.jsxs)(`span`,{children:[`99.`,90+t%9,`%`]})]},t))})})},d={args:{maxHeight:`220px`,label:`سجل الأحداث`,style:{border:`1px solid var(--border)`,borderRadius:`var(--radius-xl)`,padding:`0 12px`,background:`var(--surface)`}},render:e=>(0,i.jsx)(`div`,{dir:`rtl`,children:(0,i.jsx)(r,{...e,children:Array.from({length:24},(e,t)=>(0,i.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:10,padding:`8px 0`,borderBottom:t<23?`1px solid var(--border)`:`none`,fontSize:`var(--text-base)`,color:`var(--fg-muted)`},children:[(0,i.jsxs)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:`var(--text-xs)`,color:`var(--fg-faint)`,flexShrink:0},children:[`#`,String(t+1).padStart(2,`0`)]}),(0,i.jsx)(`span`,{children:`حدث خدمة — المنطقة us-east-1`})]},t))})})},f={render:()=>(0,i.jsxs)(`div`,{style:{display:`flex`,border:`1px solid var(--border)`,borderRadius:`var(--radius-xl)`,overflow:`hidden`,background:`var(--surface)`,width:320},children:[(0,i.jsxs)(`div`,{style:{padding:`14px 16px`,borderInlineEnd:`1px solid var(--border)`,flex:`0 0 200px`},children:[(0,i.jsx)(`div`,{style:{fontFamily:`var(--font-mono)`,fontSize:`var(--text-xs)`,letterSpacing:`0.08em`,textTransform:`uppercase`,color:`var(--fg-faint)`,marginBottom:10},children:`Filters`}),(0,i.jsx)(r,{maxHeight:`240px`,label:`Filter list`,style:{paddingInlineEnd:4},children:[`All services`,`Healthy`,`Degraded`,`Down`,`Region: us-east-1`,`Region: us-west-2`,`Region: eu-central-1`,`Tier: T1`,`Tier: T2`,`Tier: T3`,`On-call active`,`No incidents`].map((e,t)=>(0,i.jsx)(`div`,{style:{padding:`7px 0`,fontSize:`var(--text-sm)`,color:t===0?`var(--fg)`:`var(--fg-muted)`,cursor:`pointer`,fontWeight:t===0?500:400},children:e},t))})]}),(0,i.jsxs)(`div`,{style:{padding:`14px 16px`,flex:1},children:[(0,i.jsx)(`div`,{style:{fontFamily:`var(--font-mono)`,fontSize:`var(--text-xs)`,letterSpacing:`0.08em`,textTransform:`uppercase`,color:`var(--fg-faint)`,marginBottom:10},children:`Results`}),(0,i.jsx)(`div`,{style:{fontSize:`var(--text-sm)`,color:`var(--fg-muted)`},children:`Showing 3 of 12 services`})]})]})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    maxHeight: '220px',
    style: {
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      padding: '0 12px',
      background: 'var(--surface)'
    }
  },
  render: args => <ScrollArea {...args}>
      {Array.from({
      length: 24
    }, (_, i) => <Row key={i} n={i} />)}
    </ScrollArea>
}`,...s.parameters?.docs?.source},description:{story:`Vertical scroll — the most common use-case.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'always',
    maxHeight: '220px',
    label: 'Pipeline log',
    style: {
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      padding: '0 12px',
      background: 'var(--surface)'
    }
  },
  render: args => <ScrollArea {...args}>
      {Array.from({
      length: 24
    }, (_, i) => <Row key={i} n={i} />)}
    </ScrollArea>
}`,...c.parameters?.docs?.source},description:{story:`Scrollbar is always visible — for content where discoverability matters.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    orientation: 'horizontal',
    maxHeight: undefined,
    maxWidth: '100%',
    label: 'Edge nodes',
    style: {
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      padding: '12px',
      background: 'var(--surface)'
    }
  },
  render: args => <ScrollArea {...args}>
      <div style={{
      display: 'flex',
      gap: 10,
      paddingInlineEnd: 4
    }}>
        {Array.from({
        length: 12
      }, (_, i) => <div key={i} style={{
        minWidth: 160,
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: 10,
        fontSize: 'var(--text-sm)',
        color: 'var(--fg-muted)'
      }}>
            <div style={{
          fontWeight: 600,
          color: 'var(--fg)'
        }}>edge-{i + 1}</div>
            <div>us-east-1</div>
            <div className="pill" style={{
          marginTop: 6
        }}>
              Healthy
            </div>
          </div>)}
      </div>
    </ScrollArea>
}`,...l.parameters?.docs?.source},description:{story:`Horizontal scroll — for wide rows (tables, card carousels).`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    orientation: 'both',
    maxHeight: '200px',
    maxWidth: '340px',
    label: 'Data grid',
    style: {
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      padding: '8px',
      background: 'var(--surface)'
    }
  },
  render: args => <ScrollArea {...args}>
      <div style={{
      minWidth: 600
    }}>
        {Array.from({
        length: 18
      }, (_, i) => <div key={i} style={{
        display: 'flex',
        gap: 24,
        padding: '6px 0',
        borderBottom: i < 17 ? '1px solid var(--border)' : 'none',
        fontSize: 'var(--text-sm)',
        color: 'var(--fg-muted)',
        whiteSpace: 'nowrap'
      }}>
            <span style={{
          width: 80,
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          color: 'var(--fg-faint)'
        }}>
              row-{String(i + 1).padStart(3, '0')}
            </span>
            <span>service-{i + 1}</span>
            <span>us-east-{i % 3 + 1}</span>
            <span>Healthy</span>
            <span>99.{90 + i % 9}%</span>
          </div>)}
      </div>
    </ScrollArea>
}`,...u.parameters?.docs?.source},description:{story:`Both axes — useful for large data grids or maps.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    maxHeight: '220px',
    label: 'سجل الأحداث',
    style: {
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      padding: '0 12px',
      background: 'var(--surface)'
    }
  },
  render: args => <div dir="rtl">
      <ScrollArea {...args}>
        {Array.from({
        length: 24
      }, (_, i) => <div key={i} style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 0',
        borderBottom: i < 23 ? '1px solid var(--border)' : 'none',
        fontSize: 'var(--text-base)',
        color: 'var(--fg-muted)'
      }}>
            <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          color: 'var(--fg-faint)',
          flexShrink: 0
        }}>
              #{String(i + 1).padStart(2, '0')}
            </span>
            <span>حدث خدمة — المنطقة us-east-1</span>
          </div>)}
      </ScrollArea>
    </div>
}`,...d.parameters?.docs?.source},description:{story:`RTL — scrollbar moves to the inline-start edge (left in RTL).`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-xl)',
    overflow: 'hidden',
    background: 'var(--surface)',
    width: 320
  }}>
      <div style={{
      padding: '14px 16px',
      borderInlineEnd: '1px solid var(--border)',
      flex: '0 0 200px'
    }}>
        <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--fg-faint)',
        marginBottom: 10
      }}>
          Filters
        </div>
        <ScrollArea maxHeight="240px" label="Filter list" style={{
        paddingInlineEnd: 4
      }}>
          {['All services', 'Healthy', 'Degraded', 'Down', 'Region: us-east-1', 'Region: us-west-2', 'Region: eu-central-1', 'Tier: T1', 'Tier: T2', 'Tier: T3', 'On-call active', 'No incidents'].map((item, i) => <div key={i} style={{
          padding: '7px 0',
          fontSize: 'var(--text-sm)',
          color: i === 0 ? 'var(--fg)' : 'var(--fg-muted)',
          cursor: 'pointer',
          fontWeight: i === 0 ? 500 : 400
        }}>
              {item}
            </div>)}
        </ScrollArea>
      </div>
      <div style={{
      padding: '14px 16px',
      flex: 1
    }}>
        <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--fg-faint)',
        marginBottom: 10
      }}>
          Results
        </div>
        <div style={{
        fontSize: 'var(--text-sm)',
        color: 'var(--fg-muted)'
      }}>
          Showing 3 of 12 services
        </div>
      </div>
    </div>
}`,...f.parameters?.docs?.source},description:{story:`In context — a filter sidebar panel with a fixed height scroll area.`,...f.parameters?.docs?.description}}},p=[`Default`,`AlwaysVisible`,`Horizontal`,`Both`,`RTL`,`InContext`]}))();export{c as AlwaysVisible,u as Both,s as Default,l as Horizontal,f as InContext,d as RTL,p as __namedExportsOrder,a as default};