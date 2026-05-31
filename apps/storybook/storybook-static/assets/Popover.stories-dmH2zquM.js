import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Cn as i,Sn as a,bn as o,t as s,xn as c}from"./src-DgoylXRw.js";var l,u,d,f,p,m,h,g,_,v,y,b,x;e((()=>{l=t(n(),1),s(),u=r(),d={title:`Overlays/Popover`,component:o,tags:[`autodocs`],parameters:{layout:`centered`,docs:{description:{component:`Trigger element + anchored floating panel. Placement: top|bottom|start|end (logical) with viewport flip. Click-outside and Escape dismiss; focus moves into the panel on open and restores to the trigger on close. Distinct from Tooltip (hover, plain text) and Menu (list of actions).`}}},args:{side:`bottom`,align:`start`,sideOffset:8,showArrow:!1},argTypes:{side:{control:`inline-radio`,options:[`top`,`bottom`,`start`,`end`]},align:{control:`inline-radio`,options:[`start`,`center`,`end`]},sideOffset:{control:`number`},showArrow:{control:`boolean`}}},f={render:e=>{let[t,n]=l.useState(!1),[r,s]=l.useState(360),[d,f]=l.useState(220),[p,m]=l.useState(!0);return(0,u.jsx)(`div`,{style:{padding:80},children:(0,u.jsx)(o,{...e,open:t,onOpenChange:n,trigger:(0,u.jsx)(`button`,{className:`btn`,children:`Dimensions`}),children:({close:e})=>(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(i,{children:`Dimensions`}),(0,u.jsxs)(c,{style:{display:`flex`,flexDirection:`column`,gap:10},children:[(0,u.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:10},children:[(0,u.jsxs)(`label`,{className:`pop-label`,children:[`Width`,(0,u.jsx)(`input`,{className:`pop-input`,type:`number`,value:r,onChange:e=>s(+e.target.value)})]}),(0,u.jsxs)(`label`,{className:`pop-label`,children:[`Height`,(0,u.jsx)(`input`,{className:`pop-input`,type:`number`,value:d,onChange:e=>f(+e.target.value)})]})]}),(0,u.jsxs)(`label`,{className:`pop-label`,style:{flexDirection:`row`,alignItems:`center`,gap:8},children:[(0,u.jsx)(`input`,{type:`checkbox`,checked:p,onChange:e=>m(e.target.checked),style:{width:`auto`}}),`Maintain aspect ratio`]})]}),(0,u.jsxs)(a,{children:[(0,u.jsx)(`button`,{className:`btn xs ghost`,onClick:e,children:`Cancel`}),(0,u.jsx)(`button`,{className:`btn xs ember`,onClick:e,children:`Apply`})]})]})})})}},p=[`top`,`bottom`,`start`,`end`],m=[`start`,`center`,`end`],h={render:()=>{let[e,t]=l.useState(`bottom`),[n,r]=l.useState(`start`);return(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:16,padding:40},children:[(0,u.jsxs)(`div`,{style:{display:`flex`,gap:8,flexWrap:`wrap`,alignItems:`center`},children:[(0,u.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-muted)`,marginInlineEnd:4},children:`SIDE`}),p.map(n=>(0,u.jsx)(`button`,{className:`btn xs`+(n===e?` ember`:``),onClick:()=>t(n),children:n},n)),(0,u.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-muted)`,marginInlineStart:12,marginInlineEnd:4},children:`ALIGN`}),m.map(e=>(0,u.jsx)(`button`,{className:`btn xs`+(e===n?` ember`:``),onClick:()=>r(e),children:e},e))]}),(0,u.jsx)(`div`,{style:{padding:80,display:`flex`,justifyContent:`center`},children:(0,u.jsx)(o,{side:e,align:n,trigger:(0,u.jsx)(`button`,{className:`btn`,children:`Open popover`}),children:({close:t})=>(0,u.jsxs)(u.Fragment,{children:[(0,u.jsxs)(i,{children:[e,` · `,n]}),(0,u.jsx)(c,{children:(0,u.jsx)(`p`,{style:{color:`var(--fg-muted)`,fontSize:`var(--text-sm)`,lineHeight:1.55,margin:0},children:`Anchored using position:fixed + getBoundingClientRect. Flips when it would overflow the viewport.`})})]})},e+`-`+n)})]})}},g={render:()=>{let[e,t]=l.useState(!1);return(0,u.jsx)(`div`,{style:{padding:80},children:(0,u.jsx)(o,{open:e,onOpenChange:t,showArrow:!0,side:`bottom`,align:`center`,trigger:(0,u.jsx)(`button`,{className:`btn`,children:`Hover info`}),children:({close:e})=>(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(i,{closeLabel:`Close`,children:`Link preview`}),(0,u.jsx)(c,{children:(0,u.jsx)(`p`,{style:{color:`var(--fg-muted)`,fontSize:`var(--text-sm)`,lineHeight:1.55,margin:0},children:`Use the arrow to visually connect the panel to its trigger.`})})]})})})}},_={render:()=>{let[e,t]=l.useState(!1);return(0,u.jsx)(`div`,{style:{padding:80},children:(0,u.jsx)(o,{open:e,onOpenChange:t,side:`bottom`,align:`end`,trigger:(0,u.jsx)(`button`,{style:{cursor:`pointer`,background:`none`,border:`none`,padding:0},children:(0,u.jsx)(`span`,{className:`avatar lg ember`,title:`Ana Silva`,children:`AS`})}),children:({close:e})=>(0,u.jsxs)(u.Fragment,{children:[(0,u.jsxs)(c,{style:{display:`flex`,gap:12,alignItems:`flex-start`,padding:14},children:[(0,u.jsx)(`span`,{className:`avatar lg ember`,children:`AS`}),(0,u.jsxs)(`div`,{style:{flex:1,minWidth:0},children:[(0,u.jsx)(`div`,{style:{fontSize:`var(--text-md)`,fontWeight:600,letterSpacing:`-0.005em`},children:`Ana Silva`}),(0,u.jsx)(`div`,{style:{fontSize:`var(--text-sm)`,color:`var(--fg-muted)`,marginBottom:8},children:`Platform engineer · GMT-3`}),(0,u.jsxs)(`div`,{style:{display:`flex`,gap:6,flexWrap:`wrap`},children:[(0,u.jsxs)(`span`,{className:`pill`,children:[(0,u.jsx)(`span`,{className:`dot`}),`Online`]}),(0,u.jsx)(`span`,{className:`pill ember`,children:`Owner`})]})]})]}),(0,u.jsxs)(a,{children:[(0,u.jsx)(`button`,{className:`btn xs ghost`,onClick:e,children:`Cancel`}),(0,u.jsx)(`button`,{className:`btn xs`,children:`View profile`}),(0,u.jsx)(`button`,{className:`btn xs ember`,children:`Message`})]})]})})})}},v={render:()=>(0,u.jsx)(`div`,{style:{padding:80},children:(0,u.jsx)(o,{defaultOpen:!1,side:`bottom`,align:`start`,trigger:(0,u.jsx)(`button`,{className:`btn ghost`,children:`Filter`}),children:({close:e})=>(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(i,{children:`Filter rows`}),(0,u.jsxs)(c,{style:{display:`flex`,flexDirection:`column`,gap:10},children:[(0,u.jsxs)(`label`,{className:`pop-label`,children:[`Status`,(0,u.jsxs)(`select`,{className:`pop-input`,children:[(0,u.jsx)(`option`,{children:`Any`}),(0,u.jsx)(`option`,{children:`Active`}),(0,u.jsx)(`option`,{children:`Archived`})]})]}),(0,u.jsxs)(`label`,{className:`pop-label`,children:[`Owner`,(0,u.jsx)(`input`,{className:`pop-input`,type:`text`,placeholder:`ana@…`})]})]}),(0,u.jsxs)(a,{children:[(0,u.jsx)(`button`,{className:`btn xs ghost`,onClick:e,children:`Reset`}),(0,u.jsx)(`button`,{className:`btn xs ember`,onClick:e,children:`Apply`})]})]})})})},y={render:()=>{let[e,t]=l.useState(!1);return(0,u.jsx)(`div`,{dir:`rtl`,style:{padding:80},children:(0,u.jsx)(o,{open:e,onOpenChange:t,side:`bottom`,align:`start`,trigger:(0,u.jsx)(`button`,{className:`btn`,children:`الأبعاد`}),children:({close:e})=>(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(i,{closeLabel:`إغلاق`,children:`الأبعاد`}),(0,u.jsx)(c,{style:{display:`flex`,flexDirection:`column`,gap:10},children:(0,u.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:10},children:[(0,u.jsxs)(`label`,{className:`pop-label`,children:[`العرض`,(0,u.jsx)(`input`,{className:`pop-input`,type:`number`,defaultValue:360})]}),(0,u.jsxs)(`label`,{className:`pop-label`,children:[`الارتفاع`,(0,u.jsx)(`input`,{className:`pop-input`,type:`number`,defaultValue:220})]})]})}),(0,u.jsxs)(a,{children:[(0,u.jsx)(`button`,{className:`btn xs ghost`,onClick:e,children:`إلغاء`}),(0,u.jsx)(`button`,{className:`btn xs ember`,onClick:e,children:`تطبيق`})]})]})})})}},b={render:()=>{let[e,t]=l.useState(!1),[n,r]=l.useState(`1920×1080`);return(0,u.jsx)(`div`,{style:{padding:40,minWidth:360},children:(0,u.jsxs)(`div`,{style:{background:`var(--surface)`,border:`1px solid var(--border)`,borderRadius:10,overflow:`hidden`},children:[(0,u.jsxs)(`div`,{style:{padding:`10px 14px`,borderBottom:`1px solid var(--border)`,display:`flex`,alignItems:`center`,justifyContent:`space-between`},children:[(0,u.jsx)(`span`,{style:{fontWeight:600,fontSize:`var(--text-sm)`},children:`Export settings`}),(0,u.jsx)(o,{open:e,onOpenChange:t,side:`bottom`,align:`end`,trigger:(0,u.jsxs)(`button`,{className:`btn xs`,children:[`Resolution: `,n]}),children:({close:e})=>(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(i,{children:`Choose resolution`}),(0,u.jsx)(c,{style:{display:`flex`,flexDirection:`column`,gap:2},children:[`720×480`,`1280×720`,`1920×1080`,`3840×2160`].map(t=>(0,u.jsxs)(`button`,{className:`btn xs ghost`,style:{justifyContent:`flex-start`,fontFamily:`var(--font-mono)`,width:`100%`},onClick:()=>{r(t),e()},children:[t===n?`✓ `:`  `,t]},t))})]})})]}),(0,u.jsx)(`div`,{style:{padding:`14px`,fontSize:`var(--text-sm)`,color:`var(--fg-muted)`},children:`Output format: H.264 · Quality: High · Audio: AAC 192kbps`})]})})}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [open, setOpen] = React.useState(false);
    const [w, setW] = React.useState(360);
    const [h, setH] = React.useState(220);
    const [maintain, setMaintain] = React.useState(true);
    return <div style={{
      padding: 80
    }}>
        <Popover {...args} open={open} onOpenChange={setOpen} trigger={<button className="btn">Dimensions</button>}>
          {({
          close
        }) => <>
              <PopoverHeader>Dimensions</PopoverHeader>
              <PopoverBody style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}>
                <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10
            }}>
                  <label className="pop-label">
                    Width
                    <input className="pop-input" type="number" value={w} onChange={e => setW(+e.target.value)} />
                  </label>
                  <label className="pop-label">
                    Height
                    <input className="pop-input" type="number" value={h} onChange={e => setH(+e.target.value)} />
                  </label>
                </div>
                <label className="pop-label" style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8
            }}>
                  <input type="checkbox" checked={maintain} onChange={e => setMaintain(e.target.checked)} style={{
                width: 'auto'
              }} />
                  Maintain aspect ratio
                </label>
              </PopoverBody>
              <PopoverFooter>
                <button className="btn xs ghost" onClick={close}>Cancel</button>
                <button className="btn xs ember" onClick={close}>Apply</button>
              </PopoverFooter>
            </>}
        </Popover>
      </div>;
  }
}`,...f.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [side, setSide] = React.useState<'top' | 'bottom' | 'start' | 'end'>('bottom');
    const [align, setAlign] = React.useState<'start' | 'center' | 'end'>('start');
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      padding: 40
    }}>
        <div style={{
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
          <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--fg-muted)',
          marginInlineEnd: 4
        }}>SIDE</span>
          {SIDES.map(s => <button key={s} className={'btn xs' + (s === side ? ' ember' : '')} onClick={() => setSide(s)}>{s}</button>)}
          <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--fg-muted)',
          marginInlineStart: 12,
          marginInlineEnd: 4
        }}>ALIGN</span>
          {ALIGNS.map(a => <button key={a} className={'btn xs' + (a === align ? ' ember' : '')} onClick={() => setAlign(a)}>{a}</button>)}
        </div>
        <div style={{
        padding: 80,
        display: 'flex',
        justifyContent: 'center'
      }}>
          <Popover key={side + '-' + align} side={side} align={align} trigger={<button className="btn">Open popover</button>}>
            {({
            close
          }) => <>
                <PopoverHeader>{side} · {align}</PopoverHeader>
                <PopoverBody>
                  <p style={{
                color: 'var(--fg-muted)',
                fontSize: 'var(--text-sm)',
                lineHeight: 1.55,
                margin: 0
              }}>
                    Anchored using position:fixed + getBoundingClientRect. Flips when it would overflow the viewport.
                  </p>
                </PopoverBody>
              </>}
          </Popover>
        </div>
      </div>;
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(false);
    return <div style={{
      padding: 80
    }}>
        <Popover open={open} onOpenChange={setOpen} showArrow side="bottom" align="center" trigger={<button className="btn">Hover info</button>}>
          {({
          close
        }) => <>
              <PopoverHeader closeLabel="Close">Link preview</PopoverHeader>
              <PopoverBody>
                <p style={{
              color: 'var(--fg-muted)',
              fontSize: 'var(--text-sm)',
              lineHeight: 1.55,
              margin: 0
            }}>
                  Use the arrow to visually connect the panel to its trigger.
                </p>
              </PopoverBody>
            </>}
        </Popover>
      </div>;
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(false);
    return <div style={{
      padding: 80
    }}>
        <Popover open={open} onOpenChange={setOpen} side="bottom" align="end" trigger={<button style={{
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        padding: 0
      }}>
              <span className="avatar lg ember" title="Ana Silva">AS</span>
            </button>}>
          {({
          close
        }) => <>
              <PopoverBody style={{
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
            padding: 14
          }}>
                <span className="avatar lg ember">AS</span>
                <div style={{
              flex: 1,
              minWidth: 0
            }}>
                  <div style={{
                fontSize: 'var(--text-md)',
                fontWeight: 600,
                letterSpacing: '-0.005em'
              }}>Ana Silva</div>
                  <div style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--fg-muted)',
                marginBottom: 8
              }}>Platform engineer · GMT-3</div>
                  <div style={{
                display: 'flex',
                gap: 6,
                flexWrap: 'wrap'
              }}>
                    <span className="pill"><span className="dot" />Online</span>
                    <span className="pill ember">Owner</span>
                  </div>
                </div>
              </PopoverBody>
              <PopoverFooter>
                <button className="btn xs ghost" onClick={close}>Cancel</button>
                <button className="btn xs">View profile</button>
                <button className="btn xs ember">Message</button>
              </PopoverFooter>
            </>}
        </Popover>
      </div>;
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: 80
  }}>
      <Popover defaultOpen={false} side="bottom" align="start" trigger={<button className="btn ghost">Filter</button>}>
        {({
        close
      }) => <>
            <PopoverHeader>Filter rows</PopoverHeader>
            <PopoverBody style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }}>
              <label className="pop-label">
                Status
                <select className="pop-input"><option>Any</option><option>Active</option><option>Archived</option></select>
              </label>
              <label className="pop-label">
                Owner
                <input className="pop-input" type="text" placeholder="ana@…" />
              </label>
            </PopoverBody>
            <PopoverFooter>
              <button className="btn xs ghost" onClick={close}>Reset</button>
              <button className="btn xs ember" onClick={close}>Apply</button>
            </PopoverFooter>
          </>}
      </Popover>
    </div>
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(false);
    return <div dir="rtl" style={{
      padding: 80
    }}>
        <Popover open={open} onOpenChange={setOpen} side="bottom" align="start" trigger={<button className="btn">الأبعاد</button>}>
          {({
          close
        }) => <>
              <PopoverHeader closeLabel="إغلاق">الأبعاد</PopoverHeader>
              <PopoverBody style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}>
                <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10
            }}>
                  <label className="pop-label">العرض<input className="pop-input" type="number" defaultValue={360} /></label>
                  <label className="pop-label">الارتفاع<input className="pop-input" type="number" defaultValue={220} /></label>
                </div>
              </PopoverBody>
              <PopoverFooter>
                <button className="btn xs ghost" onClick={close}>إلغاء</button>
                <button className="btn xs ember" onClick={close}>تطبيق</button>
              </PopoverFooter>
            </>}
        </Popover>
      </div>;
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [resolution, setResolution] = React.useState('1920×1080');
    return <div style={{
      padding: 40,
      minWidth: 360
    }}>
        <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        overflow: 'hidden'
      }}>
          <div style={{
          padding: '10px 14px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
            <span style={{
            fontWeight: 600,
            fontSize: 'var(--text-sm)'
          }}>Export settings</span>
            <Popover open={open} onOpenChange={setOpen} side="bottom" align="end" trigger={<button className="btn xs">
                  Resolution: {resolution}
                </button>}>
              {({
              close
            }) => <>
                  <PopoverHeader>Choose resolution</PopoverHeader>
                  <PopoverBody style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}>
                    {['720×480', '1280×720', '1920×1080', '3840×2160'].map(r => <button key={r} className="btn xs ghost" style={{
                  justifyContent: 'flex-start',
                  fontFamily: 'var(--font-mono)',
                  width: '100%'
                }} onClick={() => {
                  setResolution(r);
                  close();
                }}>
                        {r === resolution ? '✓ ' : '  '}{r}
                      </button>)}
                  </PopoverBody>
                </>}
            </Popover>
          </div>
          <div style={{
          padding: '14px',
          fontSize: 'var(--text-sm)',
          color: 'var(--fg-muted)'
        }}>
            Output format: H.264 · Quality: High · Audio: AAC 192kbps
          </div>
        </div>
      </div>;
  }
}`,...b.parameters?.docs?.source}}},x=[`Default`,`Placements`,`WithArrow`,`ProfileCard`,`Uncontrolled`,`RTL`,`InContext`]}))();export{f as Default,b as InContext,h as Placements,_ as ProfileCard,y as RTL,v as Uncontrolled,g as WithArrow,x as __namedExportsOrder,d as default};