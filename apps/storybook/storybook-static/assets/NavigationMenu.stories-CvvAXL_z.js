import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Dt as i,Et as a,Ot as o,Tt as s,t as c}from"./src-DgoylXRw.js";var l,u,d,f,p,m,h,g,_;e((()=>{l=t(n(),1),c(),u=r(),d={title:`Elements/NavigationMenu`,component:s,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:`Horizontal site navigation bar with optional dropdown content panels. Top items form a single roving tab-stop (plain list, no menubar role). ArrowLeft/Right navigate between items; ArrowDown/Enter opens a panel; focus moves to the first panel link. Tab/Shift+Tab cycle within the panel. Escape closes the panel and returns focus to the trigger.`}}}},f={render:()=>(0,u.jsxs)(s,{children:[(0,u.jsx)(i,{children:(0,u.jsx)(o,{href:`#`,active:!0,children:`Home`})}),(0,u.jsx)(i,{children:(0,u.jsx)(o,{href:`#`,children:`Catalog`})}),(0,u.jsx)(i,{children:(0,u.jsx)(o,{href:`#`,children:`Deploys`})}),(0,u.jsx)(i,{children:(0,u.jsx)(o,{href:`#`,children:`Runbooks`})})]})},p={render:()=>{let[e,t]=l.useState(``);return(0,u.jsx)(`div`,{style:{minHeight:260},children:(0,u.jsxs)(s,{value:e,onValueChange:t,children:[(0,u.jsxs)(i,{id:`platform`,children:[(0,u.jsx)(o,{href:`#`,children:`Platform`}),(0,u.jsx)(a,{children:(0,u.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:4,padding:12,minWidth:320},children:[[`Catalog`,`Browse all services`],[`Deploys`,`Recent pipeline runs`],[`Runbooks`,`Incident playbooks`],[`SLOs`,`Reliability targets`]].map(([e,t])=>(0,u.jsxs)(`a`,{href:`#`,className:`nm-panel-item`,onClick:e=>e.preventDefault(),children:[(0,u.jsx)(`span`,{className:`nm-panel-item-label`,children:e}),(0,u.jsx)(`span`,{className:`nm-panel-item-desc`,children:t})]},e))})})]}),(0,u.jsxs)(i,{id:`ops`,children:[(0,u.jsx)(o,{href:`#`,children:`Operations`}),(0,u.jsx)(a,{children:(0,u.jsx)(`div`,{style:{padding:12,minWidth:200},children:[`GMUDs`,`Incidents`,`On-call`,`Alerts`].map(e=>(0,u.jsx)(`a`,{href:`#`,className:`nm-panel-item`,onClick:e=>e.preventDefault(),children:(0,u.jsx)(`span`,{className:`nm-panel-item-label`,children:e})},e))})})]}),(0,u.jsx)(i,{children:(0,u.jsx)(o,{href:`#`,active:!0,children:`Home`})})]})})}},m={render:()=>{let[e,t]=l.useState(``);return(0,u.jsx)(`div`,{style:{minHeight:180},children:(0,u.jsxs)(s,{value:e,onValueChange:t,delayDuration:0,children:[(0,u.jsxs)(i,{id:`fast-platform`,children:[(0,u.jsx)(o,{href:`#`,children:`Platform`}),(0,u.jsx)(a,{children:(0,u.jsx)(`div`,{style:{padding:12,minWidth:200},children:[`Catalog`,`Deploys`,`Runbooks`].map(e=>(0,u.jsx)(`a`,{href:`#`,className:`nm-panel-item`,onClick:e=>e.preventDefault(),children:(0,u.jsx)(`span`,{className:`nm-panel-item-label`,children:e})},e))})})]}),(0,u.jsx)(i,{children:(0,u.jsx)(o,{href:`#`,children:`Docs`})})]})})}},h={render:()=>{let[e,t]=l.useState(``);return(0,u.jsx)(`div`,{dir:`rtl`,style:{minHeight:180},children:(0,u.jsxs)(s,{value:e,onValueChange:t,children:[(0,u.jsx)(i,{id:`rtl-platform`,children:(0,u.jsx)(o,{href:`#`,active:!0,children:`الرئيسية`})}),(0,u.jsxs)(i,{id:`rtl-ops`,children:[(0,u.jsx)(o,{href:`#`,children:`المنصّة`}),(0,u.jsx)(a,{children:(0,u.jsx)(`div`,{style:{padding:12,minWidth:200},children:[`الكتالوج`,`عمليات النشر`,`كتب التشغيل`].map(e=>(0,u.jsx)(`a`,{href:`#`,className:`nm-panel-item`,onClick:e=>e.preventDefault(),children:(0,u.jsx)(`span`,{className:`nm-panel-item-label`,children:e})},e))})})]}),(0,u.jsx)(i,{children:(0,u.jsx)(o,{href:`#`,children:`العمليات`})})]})})}},g={render:()=>{let[e,t]=l.useState(`home`);return(0,u.jsxs)(`div`,{style:{background:`var(--bg-elevated)`,border:`1px solid var(--border)`,borderRadius:8,overflow:`hidden`},children:[(0,u.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,padding:`0 16px`,height:44,borderBottom:`1px solid var(--border)`,gap:8},children:[(0,u.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontWeight:700,fontSize:`var(--text-sm)`,color:`var(--ember)`,marginInlineEnd:12},children:`Forge`}),(0,u.jsx)(s,{children:[{id:`home`,label:`Home`},{id:`catalog`,label:`Catalog`},{id:`deploys`,label:`Deploys`},{id:`runbooks`,label:`Runbooks`}].map(n=>(0,u.jsx)(i,{children:(0,u.jsx)(o,{href:`#`,active:e===n.id,onClick:e=>{e.preventDefault(),t(n.id)},children:n.label})},n.id))}),(0,u.jsx)(`span`,{style:{marginInlineStart:`auto`,fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-subtle)`,padding:`2px 6px`,background:`var(--surface)`,border:`1px solid var(--border)`,borderRadius:4},children:`⌘K`})]}),(0,u.jsxs)(`div`,{style:{padding:`20px 16px`,color:`var(--fg-muted)`,fontSize:`var(--text-sm)`},children:[`Active: `,(0,u.jsx)(`strong`,{style:{color:`var(--fg)`},children:e})]})]})}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <NavigationMenu>
      <NavigationMenuItem>
        <NavigationMenuLink href="#" active>
          Home
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#">Catalog</NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#">Deploys</NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="#">Runbooks</NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenu>
}`,...f.parameters?.docs?.source},description:{story:`Basic top-level link bar with an active item.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState('');
    return <div style={{
      minHeight: 260
    }}>
        <NavigationMenu value={open} onValueChange={setOpen}>
          <NavigationMenuItem id="platform">
            <NavigationMenuLink href="#">Platform</NavigationMenuLink>
            <NavigationMenuContent>
              <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 4,
              padding: 12,
              minWidth: 320
            }}>
                {[['Catalog', 'Browse all services'], ['Deploys', 'Recent pipeline runs'], ['Runbooks', 'Incident playbooks'], ['SLOs', 'Reliability targets']].map(([label, desc]) => <a key={label} href="#" className="nm-panel-item" onClick={e => e.preventDefault()}>
                    <span className="nm-panel-item-label">{label}</span>
                    <span className="nm-panel-item-desc">{desc}</span>
                  </a>)}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem id="ops">
            <NavigationMenuLink href="#">Operations</NavigationMenuLink>
            <NavigationMenuContent>
              <div style={{
              padding: 12,
              minWidth: 200
            }}>
                {['GMUDs', 'Incidents', 'On-call', 'Alerts'].map(label => <a key={label} href="#" className="nm-panel-item" onClick={e => e.preventDefault()}>
                    <span className="nm-panel-item-label">{label}</span>
                  </a>)}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink href="#" active>
              Home
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenu>
      </div>;
  }
}`,...p.parameters?.docs?.source},description:{story:`Items with dropdown content panels — hover or ArrowDown to open.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState('');
    return <div style={{
      minHeight: 180
    }}>
        <NavigationMenu value={open} onValueChange={setOpen} delayDuration={0}>
          <NavigationMenuItem id="fast-platform">
            <NavigationMenuLink href="#">Platform</NavigationMenuLink>
            <NavigationMenuContent>
              <div style={{
              padding: 12,
              minWidth: 200
            }}>
                {['Catalog', 'Deploys', 'Runbooks'].map(label => <a key={label} href="#" className="nm-panel-item" onClick={e => e.preventDefault()}>
                    <span className="nm-panel-item-label">{label}</span>
                  </a>)}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#">Docs</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenu>
      </div>;
  }
}`,...m.parameters?.docs?.source},description:{story:`No delay — panel opens instantly on hover.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState('');
    return <div dir="rtl" style={{
      minHeight: 180
    }}>
        <NavigationMenu value={open} onValueChange={setOpen}>
          <NavigationMenuItem id="rtl-platform">
            <NavigationMenuLink href="#" active>
              الرئيسية
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem id="rtl-ops">
            <NavigationMenuLink href="#">المنصّة</NavigationMenuLink>
            <NavigationMenuContent>
              <div style={{
              padding: 12,
              minWidth: 200
            }}>
                {['الكتالوج', 'عمليات النشر', 'كتب التشغيل'].map(label => <a key={label} href="#" className="nm-panel-item" onClick={e => e.preventDefault()}>
                    <span className="nm-panel-item-label">{label}</span>
                  </a>)}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#">العمليات</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenu>
      </div>;
  }
}`,...h.parameters?.docs?.source},description:{story:`RTL — panels anchor to the correct edge; the bar reads right-to-left.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [active, setActive] = React.useState('home');
    return <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      overflow: 'hidden'
    }}>
        {/* Topbar */}
        <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        height: 44,
        borderBottom: '1px solid var(--border)',
        gap: 8
      }}>
          <span style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          fontSize: 'var(--text-sm)',
          color: 'var(--ember)',
          marginInlineEnd: 12
        }}>
            Forge
          </span>
          <NavigationMenu>
            {[{
            id: 'home',
            label: 'Home'
          }, {
            id: 'catalog',
            label: 'Catalog'
          }, {
            id: 'deploys',
            label: 'Deploys'
          }, {
            id: 'runbooks',
            label: 'Runbooks'
          }].map(item => <NavigationMenuItem key={item.id}>
                <NavigationMenuLink href="#" active={active === item.id} onClick={e => {
              e.preventDefault();
              setActive(item.id);
            }}>
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>)}
          </NavigationMenu>
          <span style={{
          marginInlineStart: 'auto',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--fg-subtle)',
          padding: '2px 6px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 4
        }}>
            ⌘K
          </span>
        </div>
        {/* Page content placeholder */}
        <div style={{
        padding: '20px 16px',
        color: 'var(--fg-muted)',
        fontSize: 'var(--text-sm)'
      }}>
          Active: <strong style={{
          color: 'var(--fg)'
        }}>{active}</strong>
        </div>
      </div>;
  }
}`,...g.parameters?.docs?.source},description:{story:`In context — navigation bar inside a minimal app shell header.`,...g.parameters?.docs?.description}}},_=[`Default`,`WithDropdownPanels`,`NoDelay`,`RTL`,`InContext`]}))();export{f as Default,g as InContext,m as NoDelay,h as RTL,p as WithDropdownPanels,_ as __namedExportsOrder,d as default};