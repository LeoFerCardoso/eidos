import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Ct as i,St as a,Ua as o,Wa as s,bt as c,t as l,xt as u,yt as d}from"./src-DgoylXRw.js";var f,p,m,h,g,_,v,y,b,x,S,C,w;e((()=>{f=t(n(),1),l(),p=r(),m={title:`Elements/Sidebar`,component:d,tags:[`autodocs`],parameters:{layout:`centered`,docs:{description:{component:`Collapsible vertical navigation rail for app shells. Supports icon-only collapse (56 px rail with tooltips), off-canvas overlay mode, collapsible section groups, trailing count badges, and a pinned footer slot. All positioning uses logical CSS props so RTL layouts flip automatically.`}}},args:{collapsible:`icon`,side:`start`,defaultOpen:!0},argTypes:{collapsible:{control:`inline-radio`,options:[`icon`,`offcanvas`,`none`]},side:{control:`inline-radio`,options:[`start`,`end`]},defaultOpen:{control:`boolean`}}},h=({children:e,width:t=600,height:n=400,dir:r=`ltr`})=>(0,p.jsx)(`div`,{dir:r,style:{display:`flex`,alignItems:`stretch`,border:`1px solid var(--border)`,borderRadius:10,overflow:`hidden`,width:t,height:n,background:`var(--bg)`,position:`relative`},children:e}),g=({children:e})=>(0,p.jsx)(`div`,{style:{flex:1,padding:24,borderInlineStart:`1px solid var(--border)`,display:`flex`,flexDirection:`column`,gap:10},children:e}),_={render:()=>{let[e,t]=f.useState(!0);return(0,p.jsxs)(h,{children:[(0,p.jsxs)(d,{collapsible:`icon`,open:e,onOpenChange:t,style:{height:`100%`},children:[(0,p.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:10,padding:`12px 10px 18px`},children:[(0,p.jsx)(o,{size:20}),e&&(0,p.jsx)(`span`,{style:{fontWeight:700,fontSize:`var(--text-md)`,letterSpacing:`-0.01em`},children:`Forge Studio`})]}),(0,p.jsxs)(i,{label:`Workspace`,children:[(0,p.jsx)(a,{icon:(0,p.jsx)(s.home,{size:14}),active:!0,href:`#`,children:`Home`}),(0,p.jsx)(a,{icon:(0,p.jsx)(s.cpu,{size:14}),badge:12,href:`#`,children:`Services`}),(0,p.jsx)(a,{icon:(0,p.jsx)(s.rocket,{size:14}),badge:3,href:`#`,children:`Deployments`}),(0,p.jsx)(a,{icon:(0,p.jsx)(s.doc,{size:14}),href:`#`,children:`Logs`}),(0,p.jsx)(a,{icon:(0,p.jsx)(s.bell,{size:14}),badge:7,href:`#`,children:`Alerts`})]}),(0,p.jsxs)(i,{label:`Account`,children:[(0,p.jsx)(a,{icon:(0,p.jsx)(s.settings,{size:14}),href:`#`,children:`Settings`}),(0,p.jsx)(a,{icon:(0,p.jsx)(s.user,{size:14}),href:`#`,children:`Team`})]}),(0,p.jsx)(c,{children:(0,p.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:10,padding:`4px 8px`},children:[(0,p.jsx)(`div`,{style:{width:28,height:28,borderRadius:`50%`,background:`linear-gradient(135deg, var(--ember), var(--ember-deep))`,color:`var(--ember-fg)`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontWeight:700,fontSize:11,flexShrink:0},children:`AL`}),e&&(0,p.jsxs)(`div`,{style:{minWidth:0,flex:1},children:[(0,p.jsx)(`div`,{style:{fontSize:`var(--text-sm)`,fontWeight:600,overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`},children:`Ada Lovelace`}),(0,p.jsx)(`div`,{style:{fontSize:`var(--text-xs)`,color:`var(--fg-faint)`,fontFamily:`var(--font-mono)`},children:`ada@forge`})]})]})})]}),(0,p.jsxs)(g,{children:[(0,p.jsx)(`span`,{style:{fontSize:`var(--text-lg)`,fontWeight:600},children:`Home`}),(0,p.jsx)(`span`,{style:{color:`var(--fg-muted)`,fontSize:`var(--text-base)`,lineHeight:1.6},children:`Click the toggle at the bottom of the rail to collapse to icon-only mode. Badges remain visible in both states.`})]})]})}},v={render:()=>{let[e,t]=f.useState(!1);return(0,p.jsxs)(h,{children:[(0,p.jsxs)(d,{collapsible:`icon`,open:e,onOpenChange:t,style:{height:`100%`},children:[(0,p.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`center`,padding:`12px 0 18px`},children:(0,p.jsx)(o,{size:20})}),(0,p.jsxs)(i,{label:`Workspace`,children:[(0,p.jsx)(a,{icon:(0,p.jsx)(s.home,{size:14}),active:!0,tooltip:`Home`,href:`#`}),(0,p.jsx)(a,{icon:(0,p.jsx)(s.cpu,{size:14}),badge:12,tooltip:`Services`,href:`#`}),(0,p.jsx)(a,{icon:(0,p.jsx)(s.rocket,{size:14}),badge:3,tooltip:`Deployments`,href:`#`}),(0,p.jsx)(a,{icon:(0,p.jsx)(s.doc,{size:14}),tooltip:`Logs`,href:`#`}),(0,p.jsx)(a,{icon:(0,p.jsx)(s.bell,{size:14}),badge:7,tooltip:`Alerts`,href:`#`})]}),(0,p.jsxs)(i,{label:`Account`,children:[(0,p.jsx)(a,{icon:(0,p.jsx)(s.settings,{size:14}),tooltip:`Settings`,href:`#`}),(0,p.jsx)(a,{icon:(0,p.jsx)(s.user,{size:14}),tooltip:`Team`,href:`#`})]}),(0,p.jsx)(c,{children:(0,p.jsx)(`div`,{style:{display:`flex`,justifyContent:`center`,padding:`4px 0`},children:(0,p.jsx)(`div`,{style:{width:28,height:28,borderRadius:`50%`,background:`linear-gradient(135deg, var(--ember), var(--ember-deep))`,color:`var(--ember-fg)`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontWeight:700,fontSize:11,cursor:`pointer`},title:`Ada Lovelace`,children:`AL`})})})]}),(0,p.jsxs)(g,{children:[(0,p.jsx)(`span`,{style:{fontSize:`var(--text-lg)`,fontWeight:600},children:`Icon rail`}),(0,p.jsx)(`span`,{style:{color:`var(--fg-muted)`,fontSize:`var(--text-base)`,lineHeight:1.6},children:`Hover over any icon to see its tooltip label. The active item (Home) keeps its ember accent. Click the expand button to restore full labels.`})]})]})}},y={render:()=>{let[e,t]=f.useState(!0);return(0,p.jsxs)(h,{height:460,children:[(0,p.jsxs)(d,{collapsible:`icon`,open:e,onOpenChange:t,style:{height:`100%`},children:[(0,p.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:10,padding:`12px 10px 18px`},children:[(0,p.jsx)(o,{size:20}),e&&(0,p.jsx)(`span`,{style:{fontWeight:700,fontSize:`var(--text-md)`},children:`Forge Studio`})]}),(0,p.jsxs)(i,{label:`Platform`,children:[(0,p.jsxs)(u,{label:`Infrastructure`,children:[(0,p.jsx)(a,{icon:(0,p.jsx)(s.cpu,{size:14}),active:!0,href:`#`,children:`Services`}),(0,p.jsx)(a,{icon:(0,p.jsx)(s.rocket,{size:14}),badge:3,href:`#`,children:`Deployments`}),(0,p.jsx)(a,{icon:(0,p.jsx)(s.layers,{size:14}),href:`#`,children:`Environments`})]}),(0,p.jsxs)(u,{label:`Observability`,defaultCollapsed:!0,children:[(0,p.jsx)(a,{icon:(0,p.jsx)(s.doc,{size:14}),href:`#`,children:`Logs`}),(0,p.jsx)(a,{icon:(0,p.jsx)(s.bell,{size:14}),badge:7,href:`#`,children:`Alerts`}),(0,p.jsx)(a,{icon:(0,p.jsx)(s.activity,{size:14}),href:`#`,children:`Metrics`})]}),(0,p.jsxs)(u,{label:`Security`,children:[(0,p.jsx)(a,{icon:(0,p.jsx)(s.shield,{size:14}),href:`#`,children:`Policies`}),(0,p.jsx)(a,{icon:(0,p.jsx)(s.lock,{size:14}),href:`#`,children:`Secrets`})]})]}),(0,p.jsx)(i,{label:`Admin`,children:(0,p.jsx)(a,{icon:(0,p.jsx)(s.settings,{size:14}),href:`#`,children:`Settings`})}),(0,p.jsx)(c,{children:(0,p.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:10,padding:`4px 8px`},children:[(0,p.jsx)(`div`,{style:{width:28,height:28,borderRadius:`50%`,background:`linear-gradient(135deg, var(--ember), var(--ember-deep))`,color:`var(--ember-fg)`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontWeight:700,fontSize:11,flexShrink:0},children:`AL`}),e&&(0,p.jsxs)(`div`,{style:{minWidth:0,flex:1},children:[(0,p.jsx)(`div`,{style:{fontSize:`var(--text-sm)`,fontWeight:600},children:`Ada Lovelace`}),(0,p.jsx)(`div`,{style:{fontSize:`var(--text-xs)`,color:`var(--fg-faint)`,fontFamily:`var(--font-mono)`},children:`ada@forge`})]})]})})]}),(0,p.jsxs)(g,{children:[(0,p.jsx)(`span`,{style:{fontSize:`var(--text-lg)`,fontWeight:600},children:`Platform`}),(0,p.jsx)(`span`,{style:{color:`var(--fg-muted)`,fontSize:`var(--text-base)`,lineHeight:1.6},children:`Groups collapse independently. "Observability" starts closed — click its label to expand. Collapsing the rail collapses all group labels and shows icons only.`})]})]})}},b={render:()=>{let[e,t]=f.useState(!0);return(0,p.jsxs)(h,{height:420,children:[(0,p.jsxs)(d,{collapsible:`icon`,open:e,onOpenChange:t,style:{height:`100%`},children:[(0,p.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:10,padding:`12px 10px 18px`},children:[(0,p.jsx)(o,{size:20}),e&&(0,p.jsx)(`span`,{style:{fontWeight:700,fontSize:`var(--text-md)`},children:`Forge Studio`})]}),(0,p.jsxs)(i,{label:`Workspace`,children:[(0,p.jsx)(a,{icon:(0,p.jsx)(s.home,{size:14}),active:!0,href:`#`,children:`Home`}),(0,p.jsx)(a,{icon:(0,p.jsx)(s.cpu,{size:14}),badge:12,href:`#`,children:`Services`}),(0,p.jsx)(a,{icon:(0,p.jsx)(s.rocket,{size:14}),href:`#`,children:`Deployments`})]}),(0,p.jsxs)(i,{label:`Account`,children:[(0,p.jsx)(a,{icon:(0,p.jsx)(s.settings,{size:14}),href:`#`,children:`Settings`}),(0,p.jsx)(a,{icon:(0,p.jsx)(s.user,{size:14}),href:`#`,children:`Team`})]}),(0,p.jsx)(c,{children:(0,p.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:10,padding:`6px 8px`,cursor:`pointer`,borderRadius:6,transition:`background var(--dur-fast) var(--ease)`},onMouseEnter:e=>{e.currentTarget.style.background=`var(--surface-hover)`},onMouseLeave:e=>{e.currentTarget.style.background=`transparent`},children:[(0,p.jsx)(`div`,{style:{width:32,height:32,borderRadius:`50%`,background:`linear-gradient(135deg, #6366f1, #8b5cf6)`,color:`#fff`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontWeight:700,fontSize:12,flexShrink:0},children:`RF`}),e&&(0,p.jsxs)(`div`,{style:{minWidth:0,flex:1},children:[(0,p.jsx)(`div`,{style:{fontSize:`var(--text-sm)`,fontWeight:600,overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`},children:`Rafael Mendonça`}),(0,p.jsx)(`div`,{style:{fontSize:`var(--text-xs)`,color:`var(--fg-faint)`,fontFamily:`var(--font-mono)`,overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`},children:`acme-workspace`})]})]})})]}),(0,p.jsxs)(g,{children:[(0,p.jsx)(`span`,{style:{fontSize:`var(--text-lg)`,fontWeight:600},children:`Services`}),(0,p.jsx)(`span`,{style:{color:`var(--fg-muted)`,fontSize:`var(--text-base)`,lineHeight:1.6},children:`The footer is pinned regardless of content height. In icon-only mode only the avatar is shown. The footer item is a hover-tinted button for account menus.`})]})]})}},x={render:()=>{let[e,t]=f.useState(!1);return(0,p.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,width:480,height:400,border:`1px solid var(--border)`,borderRadius:10,overflow:`hidden`,background:`var(--bg)`,position:`relative`},children:[(0,p.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:12,padding:`0 16px`,height:44,borderBottom:`1px solid var(--border)`,background:`var(--bg-elevated)`,flexShrink:0},children:[(0,p.jsx)(`button`,{className:`btn icon ghost sm`,"aria-label":`Open navigation`,onClick:()=>t(!0),children:(0,p.jsx)(s.menu,{size:14})}),(0,p.jsx)(o,{size:18}),(0,p.jsx)(`span`,{style:{fontWeight:600,fontSize:`var(--text-md)`},children:`App Shell`})]}),(0,p.jsxs)(`div`,{style:{flex:1,padding:20,color:`var(--fg-muted)`,fontSize:`var(--text-base)`,lineHeight:1.6,position:`relative`},children:[`Click the menu icon in the topbar to open the off-canvas sidebar. A scrim covers this area and clicking it closes the panel.`,(0,p.jsxs)(d,{collapsible:`offcanvas`,open:e,onOpenChange:t,style:{height:`100%`},children:[(0,p.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`,padding:`12px 10px 18px`},children:(0,p.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:10},children:[(0,p.jsx)(o,{size:20}),(0,p.jsx)(`span`,{style:{fontWeight:700,fontSize:`var(--text-md)`},children:`Forge Studio`})]})}),(0,p.jsxs)(i,{label:`Workspace`,children:[(0,p.jsx)(a,{icon:(0,p.jsx)(s.home,{size:14}),active:!0,href:`#`,onClick:()=>t(!1),children:`Home`}),(0,p.jsx)(a,{icon:(0,p.jsx)(s.cpu,{size:14}),badge:12,href:`#`,onClick:()=>t(!1),children:`Services`}),(0,p.jsx)(a,{icon:(0,p.jsx)(s.rocket,{size:14}),badge:3,href:`#`,onClick:()=>t(!1),children:`Deployments`}),(0,p.jsx)(a,{icon:(0,p.jsx)(s.doc,{size:14}),href:`#`,onClick:()=>t(!1),children:`Logs`}),(0,p.jsx)(a,{icon:(0,p.jsx)(s.bell,{size:14}),badge:7,href:`#`,onClick:()=>t(!1),children:`Alerts`})]}),(0,p.jsx)(i,{label:`Account`,children:(0,p.jsx)(a,{icon:(0,p.jsx)(s.settings,{size:14}),href:`#`,onClick:()=>t(!1),children:`Settings`})}),(0,p.jsx)(c,{children:(0,p.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:10,padding:`4px 8px`},children:[(0,p.jsx)(`div`,{style:{width:28,height:28,borderRadius:`50%`,background:`linear-gradient(135deg, var(--ember), var(--ember-deep))`,color:`var(--ember-fg)`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontWeight:700,fontSize:11},children:`AL`}),(0,p.jsxs)(`div`,{style:{minWidth:0,flex:1},children:[(0,p.jsx)(`div`,{style:{fontSize:`var(--text-sm)`,fontWeight:600},children:`Ada Lovelace`}),(0,p.jsx)(`div`,{style:{fontSize:`var(--text-xs)`,color:`var(--fg-faint)`,fontFamily:`var(--font-mono)`},children:`ada@forge`})]})]})})]})]})]})}},S={render:()=>{let[e,t]=f.useState(!0);return(0,p.jsxs)(h,{dir:`rtl`,children:[(0,p.jsxs)(d,{collapsible:`icon`,open:e,onOpenChange:t,style:{height:`100%`},children:[(0,p.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:10,padding:`12px 10px 18px`},children:[(0,p.jsx)(o,{size:20}),e&&(0,p.jsx)(`span`,{style:{fontWeight:700,fontSize:`var(--text-md)`},children:`Forge Studio`})]}),(0,p.jsxs)(i,{label:`مساحة العمل`,children:[(0,p.jsx)(a,{icon:(0,p.jsx)(s.home,{size:14}),active:!0,href:`#`,children:`الرئيسية`}),(0,p.jsx)(a,{icon:(0,p.jsx)(s.cpu,{size:14}),badge:12,href:`#`,children:`الخدمات`}),(0,p.jsx)(a,{icon:(0,p.jsx)(s.rocket,{size:14}),badge:3,href:`#`,children:`عمليات النشر`}),(0,p.jsx)(a,{icon:(0,p.jsx)(s.doc,{size:14}),href:`#`,children:`السجلات`})]}),(0,p.jsxs)(i,{label:`الحساب`,children:[(0,p.jsx)(a,{icon:(0,p.jsx)(s.settings,{size:14}),href:`#`,children:`الإعدادات`}),(0,p.jsx)(a,{icon:(0,p.jsx)(s.user,{size:14}),href:`#`,children:`الفريق`})]}),(0,p.jsx)(c,{children:(0,p.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:10,padding:`4px 8px`},children:[(0,p.jsx)(`div`,{style:{width:28,height:28,borderRadius:`50%`,background:`linear-gradient(135deg, var(--ember), var(--ember-deep))`,color:`var(--ember-fg)`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontWeight:700,fontSize:11,flexShrink:0},children:`ن م`}),e&&(0,p.jsxs)(`div`,{style:{minWidth:0,flex:1},children:[(0,p.jsx)(`div`,{style:{fontSize:`var(--text-sm)`,fontWeight:600,overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`},children:`نور محمد`}),(0,p.jsx)(`div`,{style:{fontSize:`var(--text-xs)`,color:`var(--fg-faint)`,fontFamily:`var(--font-mono)`},children:`nour@forge`})]})]})})]}),(0,p.jsxs)(g,{children:[(0,p.jsx)(`span`,{style:{fontSize:`var(--text-lg)`,fontWeight:600},children:`الرئيسية`}),(0,p.jsx)(`span`,{style:{color:`var(--fg-muted)`,fontSize:`var(--text-base)`,lineHeight:1.6},children:`اتجاه RTL — يرسو الرصيف على الحافة اليمنى تلقائياً بفضل الخصائص المنطقية. لا تعديلات يدوية مطلوبة.`})]})]})}},C={render:()=>{let[e,t]=f.useState(!0),[n,r]=f.useState(`Home`),l=[{label:`Home`,icon:(0,p.jsx)(s.home,{size:14}),badge:void 0},{label:`Services`,icon:(0,p.jsx)(s.cpu,{size:14}),badge:12},{label:`Deployments`,icon:(0,p.jsx)(s.rocket,{size:14}),badge:3},{label:`Logs`,icon:(0,p.jsx)(s.doc,{size:14}),badge:void 0},{label:`Alerts`,icon:(0,p.jsx)(s.bell,{size:14}),badge:7}];return(0,p.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,width:680,height:440,border:`1px solid var(--border)`,borderRadius:10,overflow:`hidden`,background:`var(--bg)`},children:[(0,p.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:12,padding:`0 16px`,height:44,borderBottom:`1px solid var(--border)`,background:`var(--bg-elevated)`,flexShrink:0},children:[(0,p.jsx)(`button`,{className:`btn icon ghost sm`,"aria-label":`Toggle sidebar`,onClick:()=>t(e=>!e),children:(0,p.jsx)(s.panelLeft,{size:14})}),(0,p.jsx)(o,{size:18}),(0,p.jsx)(`span`,{style:{fontWeight:600,fontSize:`var(--text-md)`},children:`Forge Studio`}),(0,p.jsxs)(`div`,{style:{marginInlineStart:`auto`,display:`flex`,gap:8},children:[(0,p.jsx)(`button`,{className:`btn icon ghost sm`,"aria-label":`Search`,children:(0,p.jsx)(s.search,{size:14})}),(0,p.jsx)(`button`,{className:`btn icon ghost sm`,"aria-label":`Notifications`,children:(0,p.jsx)(s.bell,{size:14})})]})]}),(0,p.jsxs)(`div`,{style:{display:`flex`,flex:1,overflow:`hidden`},children:[(0,p.jsxs)(d,{collapsible:`icon`,open:e,onOpenChange:t,style:{height:`100%`},children:[(0,p.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,gap:10,padding:`12px 10px 16px`},children:e&&(0,p.jsx)(`span`,{style:{fontWeight:700,fontSize:`var(--text-sm)`,color:`var(--fg-faint)`,fontFamily:`var(--font-mono)`,textTransform:`uppercase`,letterSpacing:`0.08em`},children:`Workspace`})}),(0,p.jsx)(i,{children:l.map(e=>(0,p.jsx)(a,{icon:e.icon,active:n===e.label,badge:e.badge,href:`#`,tooltip:e.label,onClick:t=>{t.preventDefault(),r(e.label)},children:e.label},e.label))}),(0,p.jsx)(i,{label:`Admin`,children:(0,p.jsx)(a,{icon:(0,p.jsx)(s.settings,{size:14}),tooltip:`Settings`,href:`#`,children:`Settings`})}),(0,p.jsx)(c,{children:(0,p.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:10,padding:`4px 8px`},children:[(0,p.jsx)(`div`,{style:{width:28,height:28,borderRadius:`50%`,background:`linear-gradient(135deg, var(--ember), var(--ember-deep))`,color:`var(--ember-fg)`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontWeight:700,fontSize:11,flexShrink:0},children:`AL`}),e&&(0,p.jsxs)(`div`,{style:{minWidth:0,flex:1},children:[(0,p.jsx)(`div`,{style:{fontSize:`var(--text-sm)`,fontWeight:600,overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`},children:`Ada Lovelace`}),(0,p.jsx)(`div`,{style:{fontSize:`var(--text-xs)`,color:`var(--fg-faint)`,fontFamily:`var(--font-mono)`},children:`ada@forge`})]})]})})]}),(0,p.jsxs)(`main`,{style:{flex:1,padding:24,borderInlineStart:`1px solid var(--border)`,display:`flex`,flexDirection:`column`,gap:8,overflow:`auto`},children:[(0,p.jsx)(`h2`,{style:{margin:0,fontSize:`var(--text-xl)`,fontWeight:700},children:n}),(0,p.jsx)(`p`,{style:{margin:0,color:`var(--fg-muted)`,fontSize:`var(--text-base)`,lineHeight:1.6},children:`Topbar toggle and the rail's own button share state — either collapses the sidebar. Click nav items to change the active state.`})]})]})]})}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(true);
    return <Shell>
        <Sidebar collapsible="icon" open={open} onOpenChange={setOpen} style={{
        height: '100%'
      }}>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 10px 18px'
        }}>
            <ForgeMark size={20} />
            {open && <span style={{
            fontWeight: 700,
            fontSize: 'var(--text-md)',
            letterSpacing: '-0.01em'
          }}>Forge Studio</span>}
          </div>

          <SidebarSection label="Workspace">
            <SidebarItem icon={<Icons.home size={14} />} active href="#">
              Home
            </SidebarItem>
            <SidebarItem icon={<Icons.cpu size={14} />} badge={12} href="#">
              Services
            </SidebarItem>
            <SidebarItem icon={<Icons.rocket size={14} />} badge={3} href="#">
              Deployments
            </SidebarItem>
            <SidebarItem icon={<Icons.doc size={14} />} href="#">
              Logs
            </SidebarItem>
            <SidebarItem icon={<Icons.bell size={14} />} badge={7} href="#">
              Alerts
            </SidebarItem>
          </SidebarSection>

          <SidebarSection label="Account">
            <SidebarItem icon={<Icons.settings size={14} />} href="#">
              Settings
            </SidebarItem>
            <SidebarItem icon={<Icons.user size={14} />} href="#">
              Team
            </SidebarItem>
          </SidebarSection>

          <SidebarFooter>
            <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '4px 8px'
          }}>
              <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--ember), var(--ember-deep))',
              color: 'var(--ember-fg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 11,
              flexShrink: 0
            }}>
                AL
              </div>
              {open && <div style={{
              minWidth: 0,
              flex: 1
            }}>
                  <div style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                    Ada Lovelace
                  </div>
                  <div style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--fg-faint)',
                fontFamily: 'var(--font-mono)'
              }}>
                    ada@forge
                  </div>
                </div>}
            </div>
          </SidebarFooter>
        </Sidebar>

        <MainArea>
          <span style={{
          fontSize: 'var(--text-lg)',
          fontWeight: 600
        }}>Home</span>
          <span style={{
          color: 'var(--fg-muted)',
          fontSize: 'var(--text-base)',
          lineHeight: 1.6
        }}>
            Click the toggle at the bottom of the rail to collapse to icon-only mode.
            Badges remain visible in both states.
          </span>
        </MainArea>
      </Shell>;
  }
}`,..._.parameters?.docs?.source},description:{story:`Expanded rail — 232 px wide, showing icons, labels, and a trailing badge count.
The active item is highlighted. Sections use muted mono headings to organise
items into named groups. Collapse the rail with the toggle button.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(false);
    return <Shell>
        <Sidebar collapsible="icon" open={open} onOpenChange={setOpen} style={{
        height: '100%'
      }}>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px 0 18px'
        }}>
            <ForgeMark size={20} />
          </div>

          <SidebarSection label="Workspace">
            <SidebarItem icon={<Icons.home size={14} />} active tooltip="Home" href="#" />
            <SidebarItem icon={<Icons.cpu size={14} />} badge={12} tooltip="Services" href="#" />
            <SidebarItem icon={<Icons.rocket size={14} />} badge={3} tooltip="Deployments" href="#" />
            <SidebarItem icon={<Icons.doc size={14} />} tooltip="Logs" href="#" />
            <SidebarItem icon={<Icons.bell size={14} />} badge={7} tooltip="Alerts" href="#" />
          </SidebarSection>

          <SidebarSection label="Account">
            <SidebarItem icon={<Icons.settings size={14} />} tooltip="Settings" href="#" />
            <SidebarItem icon={<Icons.user size={14} />} tooltip="Team" href="#" />
          </SidebarSection>

          <SidebarFooter>
            <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '4px 0'
          }}>
              <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--ember), var(--ember-deep))',
              color: 'var(--ember-fg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 11,
              cursor: 'pointer'
            }} title="Ada Lovelace">
                AL
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <MainArea>
          <span style={{
          fontSize: 'var(--text-lg)',
          fontWeight: 600
        }}>Icon rail</span>
          <span style={{
          color: 'var(--fg-muted)',
          fontSize: 'var(--text-base)',
          lineHeight: 1.6
        }}>
            Hover over any icon to see its tooltip label. The active item (Home) keeps its ember accent.
            Click the expand button to restore full labels.
          </span>
        </MainArea>
      </Shell>;
  }
}`,...v.parameters?.docs?.source},description:{story:`Icon rail (collapsed) — 56 px. Labels are hidden; hover over any item to see
the tooltip. Badges are suppressed to reduce clutter. The active item retains
its ember accent. Toggle to expand.`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(true);
    return <Shell height={460}>
        <Sidebar collapsible="icon" open={open} onOpenChange={setOpen} style={{
        height: '100%'
      }}>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 10px 18px'
        }}>
            <ForgeMark size={20} />
            {open && <span style={{
            fontWeight: 700,
            fontSize: 'var(--text-md)'
          }}>Forge Studio</span>}
          </div>

          <SidebarSection label="Platform">
            <SidebarGroup label="Infrastructure">
              <SidebarItem icon={<Icons.cpu size={14} />} active href="#">Services</SidebarItem>
              <SidebarItem icon={<Icons.rocket size={14} />} badge={3} href="#">Deployments</SidebarItem>
              <SidebarItem icon={<Icons.layers size={14} />} href="#">Environments</SidebarItem>
            </SidebarGroup>
            <SidebarGroup label="Observability" defaultCollapsed>
              <SidebarItem icon={<Icons.doc size={14} />} href="#">Logs</SidebarItem>
              <SidebarItem icon={<Icons.bell size={14} />} badge={7} href="#">Alerts</SidebarItem>
              <SidebarItem icon={<Icons.activity size={14} />} href="#">Metrics</SidebarItem>
            </SidebarGroup>
            <SidebarGroup label="Security">
              <SidebarItem icon={<Icons.shield size={14} />} href="#">Policies</SidebarItem>
              <SidebarItem icon={<Icons.lock size={14} />} href="#">Secrets</SidebarItem>
            </SidebarGroup>
          </SidebarSection>

          <SidebarSection label="Admin">
            <SidebarItem icon={<Icons.settings size={14} />} href="#">Settings</SidebarItem>
          </SidebarSection>

          <SidebarFooter>
            <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '4px 8px'
          }}>
              <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--ember), var(--ember-deep))',
              color: 'var(--ember-fg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 11,
              flexShrink: 0
            }}>AL</div>
              {open && <div style={{
              minWidth: 0,
              flex: 1
            }}><div style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 600
              }}>Ada Lovelace</div><div style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--fg-faint)',
                fontFamily: 'var(--font-mono)'
              }}>ada@forge</div></div>}
            </div>
          </SidebarFooter>
        </Sidebar>

        <MainArea>
          <span style={{
          fontSize: 'var(--text-lg)',
          fontWeight: 600
        }}>Platform</span>
          <span style={{
          color: 'var(--fg-muted)',
          fontSize: 'var(--text-base)',
          lineHeight: 1.6
        }}>
            Groups collapse independently. "Observability" starts closed — click its label to expand.
            Collapsing the rail collapses all group labels and shows icons only.
          </span>
        </MainArea>
      </Shell>;
  }
}`,...y.parameters?.docs?.source},description:{story:`Collapsible groups — sections can contain named groups that collapse
independently. "Observability" starts collapsed; click its header to expand.
Groups become icon-passthrough in collapsed rail mode.`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(true);
    return <Shell height={420}>
        <Sidebar collapsible="icon" open={open} onOpenChange={setOpen} style={{
        height: '100%'
      }}>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 10px 18px'
        }}>
            <ForgeMark size={20} />
            {open && <span style={{
            fontWeight: 700,
            fontSize: 'var(--text-md)'
          }}>Forge Studio</span>}
          </div>

          <SidebarSection label="Workspace">
            <SidebarItem icon={<Icons.home size={14} />} active href="#">Home</SidebarItem>
            <SidebarItem icon={<Icons.cpu size={14} />} badge={12} href="#">Services</SidebarItem>
            <SidebarItem icon={<Icons.rocket size={14} />} href="#">Deployments</SidebarItem>
          </SidebarSection>

          <SidebarSection label="Account">
            <SidebarItem icon={<Icons.settings size={14} />} href="#">Settings</SidebarItem>
            <SidebarItem icon={<Icons.user size={14} />} href="#">Team</SidebarItem>
          </SidebarSection>

          <SidebarFooter>
            <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 8px',
            cursor: 'pointer',
            borderRadius: 6,
            transition: 'background var(--dur-fast) var(--ease)'
          }} onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.background = 'var(--surface-hover)';
          }} onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.background = 'transparent';
          }}>
              <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 12,
              flexShrink: 0
            }}>
                RF
              </div>
              {open && <div style={{
              minWidth: 0,
              flex: 1
            }}>
                  <div style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                    Rafael Mendonça
                  </div>
                  <div style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--fg-faint)',
                fontFamily: 'var(--font-mono)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                    acme-workspace
                  </div>
                </div>}
            </div>
          </SidebarFooter>
        </Sidebar>

        <MainArea>
          <span style={{
          fontSize: 'var(--text-lg)',
          fontWeight: 600
        }}>Services</span>
          <span style={{
          color: 'var(--fg-muted)',
          fontSize: 'var(--text-base)',
          lineHeight: 1.6
        }}>
            The footer is pinned regardless of content height. In icon-only mode only the avatar is shown.
            The footer item is a hover-tinted button for account menus.
          </span>
        </MainArea>
      </Shell>;
  }
}`,...b.parameters?.docs?.source},description:{story:`With user footer — pinned footer slot showing the signed-in user's avatar,
name, and workspace handle. Stays pinned as content grows. The footer adapts
to icon-only mode: only the avatar is shown when collapsed.`,...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(false);
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: 480,
      height: 400,
      border: '1px solid var(--border)',
      borderRadius: 10,
      overflow: 'hidden',
      background: 'var(--bg)',
      position: 'relative'
    }}>
        {/* Topbar */}
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 16px',
        height: 44,
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-elevated)',
        flexShrink: 0
      }}>
          <button className="btn icon ghost sm" aria-label="Open navigation" onClick={() => setOpen(true)}>
            <Icons.menu size={14} />
          </button>
          <ForgeMark size={18} />
          <span style={{
          fontWeight: 600,
          fontSize: 'var(--text-md)'
        }}>App Shell</span>
        </div>

        {/* Body */}
        <div style={{
        flex: 1,
        padding: 20,
        color: 'var(--fg-muted)',
        fontSize: 'var(--text-base)',
        lineHeight: 1.6,
        position: 'relative'
      }}>
          Click the menu icon in the topbar to open the off-canvas sidebar.
          A scrim covers this area and clicking it closes the panel.

          <Sidebar collapsible="offcanvas" open={open} onOpenChange={setOpen} style={{
          height: '100%'
        }}>
            <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 10px 18px'
          }}>
              <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
                <ForgeMark size={20} />
                <span style={{
                fontWeight: 700,
                fontSize: 'var(--text-md)'
              }}>Forge Studio</span>
              </div>
            </div>

            <SidebarSection label="Workspace">
              <SidebarItem icon={<Icons.home size={14} />} active href="#" onClick={() => setOpen(false)}>Home</SidebarItem>
              <SidebarItem icon={<Icons.cpu size={14} />} badge={12} href="#" onClick={() => setOpen(false)}>Services</SidebarItem>
              <SidebarItem icon={<Icons.rocket size={14} />} badge={3} href="#" onClick={() => setOpen(false)}>Deployments</SidebarItem>
              <SidebarItem icon={<Icons.doc size={14} />} href="#" onClick={() => setOpen(false)}>Logs</SidebarItem>
              <SidebarItem icon={<Icons.bell size={14} />} badge={7} href="#" onClick={() => setOpen(false)}>Alerts</SidebarItem>
            </SidebarSection>

            <SidebarSection label="Account">
              <SidebarItem icon={<Icons.settings size={14} />} href="#" onClick={() => setOpen(false)}>Settings</SidebarItem>
            </SidebarSection>

            <SidebarFooter>
              <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '4px 8px'
            }}>
                <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--ember), var(--ember-deep))',
                color: 'var(--ember-fg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 11
              }}>AL</div>
                <div style={{
                minWidth: 0,
                flex: 1
              }}>
                  <div style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600
                }}>Ada Lovelace</div>
                  <div style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--fg-faint)',
                  fontFamily: 'var(--font-mono)'
                }}>ada@forge</div>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>
        </div>
      </div>;
  }
}`,...x.parameters?.docs?.source},description:{story:`Off-canvas / mobile — the sidebar slides in from the start edge as a full-height
overlay. A scrim covers the content area. Clicking the scrim or pressing Escape
closes the drawer. Typically triggered by a hamburger button in the topbar.`,...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(true);
    return <Shell dir="rtl">
        <Sidebar collapsible="icon" open={open} onOpenChange={setOpen} style={{
        height: '100%'
      }}>
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 10px 18px'
        }}>
            <ForgeMark size={20} />
            {open && <span style={{
            fontWeight: 700,
            fontSize: 'var(--text-md)'
          }}>Forge Studio</span>}
          </div>

          <SidebarSection label="مساحة العمل">
            <SidebarItem icon={<Icons.home size={14} />} active href="#">الرئيسية</SidebarItem>
            <SidebarItem icon={<Icons.cpu size={14} />} badge={12} href="#">الخدمات</SidebarItem>
            <SidebarItem icon={<Icons.rocket size={14} />} badge={3} href="#">عمليات النشر</SidebarItem>
            <SidebarItem icon={<Icons.doc size={14} />} href="#">السجلات</SidebarItem>
          </SidebarSection>

          <SidebarSection label="الحساب">
            <SidebarItem icon={<Icons.settings size={14} />} href="#">الإعدادات</SidebarItem>
            <SidebarItem icon={<Icons.user size={14} />} href="#">الفريق</SidebarItem>
          </SidebarSection>

          <SidebarFooter>
            <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '4px 8px'
          }}>
              <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--ember), var(--ember-deep))',
              color: 'var(--ember-fg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 11,
              flexShrink: 0
            }}>ن م</div>
              {open && <div style={{
              minWidth: 0,
              flex: 1
            }}>
                  <div style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>نور محمد</div>
                  <div style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--fg-faint)',
                fontFamily: 'var(--font-mono)'
              }}>nour@forge</div>
                </div>}
            </div>
          </SidebarFooter>
        </Sidebar>

        <MainArea>
          <span style={{
          fontSize: 'var(--text-lg)',
          fontWeight: 600
        }}>الرئيسية</span>
          <span style={{
          color: 'var(--fg-muted)',
          fontSize: 'var(--text-base)',
          lineHeight: 1.6
        }}>
            اتجاه RTL — يرسو الرصيف على الحافة اليمنى تلقائياً بفضل الخصائص المنطقية. لا تعديلات يدوية مطلوبة.
          </span>
        </MainArea>
      </Shell>;
  }
}`,...S.parameters?.docs?.source},description:{story:`RTL layout — \`dir="rtl"\` on the shell. The rail docks to the inline-end
(right) edge. Section headings, item labels, and badges mirror. All achieved
via logical CSS properties with zero overrides.`,...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(true);
    const [active, setActive] = React.useState('Home');
    const navItems = [{
      label: 'Home',
      icon: <Icons.home size={14} />,
      badge: undefined as number | undefined
    }, {
      label: 'Services',
      icon: <Icons.cpu size={14} />,
      badge: 12
    }, {
      label: 'Deployments',
      icon: <Icons.rocket size={14} />,
      badge: 3
    }, {
      label: 'Logs',
      icon: <Icons.doc size={14} />,
      badge: undefined
    }, {
      label: 'Alerts',
      icon: <Icons.bell size={14} />,
      badge: 7
    }];
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: 680,
      height: 440,
      border: '1px solid var(--border)',
      borderRadius: 10,
      overflow: 'hidden',
      background: 'var(--bg)'
    }}>
        {/* Topbar */}
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 16px',
        height: 44,
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-elevated)',
        flexShrink: 0
      }}>
          <button className="btn icon ghost sm" aria-label="Toggle sidebar" onClick={() => setOpen(o => !o)}>
            <Icons.panelLeft size={14} />
          </button>
          <ForgeMark size={18} />
          <span style={{
          fontWeight: 600,
          fontSize: 'var(--text-md)'
        }}>Forge Studio</span>
          <div style={{
          marginInlineStart: 'auto',
          display: 'flex',
          gap: 8
        }}>
            <button className="btn icon ghost sm" aria-label="Search"><Icons.search size={14} /></button>
            <button className="btn icon ghost sm" aria-label="Notifications"><Icons.bell size={14} /></button>
          </div>
        </div>
        {/* Body */}
        <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden'
      }}>
          <Sidebar collapsible="icon" open={open} onOpenChange={setOpen} style={{
          height: '100%'
        }}>
            <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 10px 16px'
          }}>
              {open && <span style={{
              fontWeight: 700,
              fontSize: 'var(--text-sm)',
              color: 'var(--fg-faint)',
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>Workspace</span>}
            </div>

            <SidebarSection>
              {navItems.map(item => <SidebarItem key={item.label} icon={item.icon} active={active === item.label} badge={item.badge} href="#" tooltip={item.label} onClick={e => {
              e.preventDefault();
              setActive(item.label);
            }}>
                  {item.label}
                </SidebarItem>)}
            </SidebarSection>

            <SidebarSection label="Admin">
              <SidebarItem icon={<Icons.settings size={14} />} tooltip="Settings" href="#">Settings</SidebarItem>
            </SidebarSection>

            <SidebarFooter>
              <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '4px 8px'
            }}>
                <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--ember), var(--ember-deep))',
                color: 'var(--ember-fg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 11,
                flexShrink: 0
              }}>AL</div>
                {open && <div style={{
                minWidth: 0,
                flex: 1
              }}>
                    <div style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>Ada Lovelace</div>
                    <div style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--fg-faint)',
                  fontFamily: 'var(--font-mono)'
                }}>ada@forge</div>
                  </div>}
              </div>
            </SidebarFooter>
          </Sidebar>
          {/* Content */}
          <main style={{
          flex: 1,
          padding: 24,
          borderInlineStart: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          overflow: 'auto'
        }}>
            <h2 style={{
            margin: 0,
            fontSize: 'var(--text-xl)',
            fontWeight: 700
          }}>{active}</h2>
            <p style={{
            margin: 0,
            color: 'var(--fg-muted)',
            fontSize: 'var(--text-base)',
            lineHeight: 1.6
          }}>
              Topbar toggle and the rail's own button share state — either collapses the sidebar.
              Click nav items to change the active state.
            </p>
          </main>
        </div>
      </div>;
  }
}`,...C.parameters?.docs?.source},description:{story:`In-context app shell — topbar + sidebar + content area. The topbar toggle
button and the rail's own toggle both share state so either can collapse
the sidebar. Realistic product layout.`,...C.parameters?.docs?.description}}},w=[`Expanded`,`Collapsed`,`CollapsibleGroups`,`WithFooter`,`OffCanvas`,`RTL`,`InContext`]}))();export{v as Collapsed,y as CollapsibleGroups,_ as Expanded,C as InContext,x as OffCanvas,S as RTL,b as WithFooter,w as __namedExportsOrder,m as default};