import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Wa as i,cn as a,dn as o,fn as s,ln as c,mn as l,on as u,pn as d,sn as f,t as p,un as m}from"./src-DgoylXRw.js";var h,g,_,v,y,b,x,S,C,w,T,E;e((()=>{h=t(n(),1),p(),g=r(),_={title:`Overlays/DropdownMenu`,component:u,tags:[`autodocs`],parameters:{layout:`centered`,docs:{description:{component:`A portalled command list anchored to any trigger. role=menu with roving tabindex, type-ahead, direction-aware positioning — no Radix, no CVA.`}}}},v={render:()=>(0,g.jsxs)(u,{children:[(0,g.jsx)(l,{className:`btn`,children:`Actions`}),(0,g.jsxs)(a,{align:`start`,children:[(0,g.jsx)(c,{children:`Open`}),(0,g.jsx)(c,{children:`Rename`}),(0,g.jsx)(c,{children:`Duplicate`}),(0,g.jsx)(d,{}),(0,g.jsx)(c,{variant:`destructive`,children:`Delete`})]})]})},y={render:()=>(0,g.jsxs)(u,{children:[(0,g.jsx)(l,{className:`btn`,children:`File actions`}),(0,g.jsxs)(a,{align:`start`,children:[(0,g.jsx)(c,{icon:i.eye,shortcut:`↩`,children:`Open`}),(0,g.jsx)(c,{icon:i.edit,shortcut:`⌘E`,children:`Rename`}),(0,g.jsx)(c,{icon:i.copy,shortcut:`⌘D`,children:`Duplicate`}),(0,g.jsx)(d,{}),(0,g.jsx)(c,{icon:i.download,shortcut:`⌘S`,children:`Download`}),(0,g.jsx)(c,{icon:i.link,shortcut:`⌘⇧C`,children:`Copy link`}),(0,g.jsx)(d,{}),(0,g.jsx)(c,{icon:i.trash,variant:`destructive`,shortcut:`⌫`,children:`Delete`})]})]})},b={render:()=>(0,g.jsxs)(u,{children:[(0,g.jsxs)(l,{className:`btn`,children:[(0,g.jsx)(i.user,{size:13}),` Ana Silva `,(0,g.jsx)(i.chevronDown,{size:12})]}),(0,g.jsxs)(a,{align:`end`,children:[(0,g.jsx)(m,{children:`Account`}),(0,g.jsx)(c,{icon:i.settings,shortcut:`⌘,`,children:`Settings`}),(0,g.jsx)(c,{icon:i.bell,children:`Notifications`}),(0,g.jsx)(d,{}),(0,g.jsx)(m,{children:`Theme`}),(0,g.jsx)(c,{icon:i.sun,children:`Light`}),(0,g.jsx)(c,{icon:i.moon,children:`Dark`}),(0,g.jsx)(d,{}),(0,g.jsx)(c,{icon:i.x,variant:`destructive`,shortcut:`⌘⇧Q`,children:`Sign out`})]})]})},x={render:()=>{let[e,t]=h.useState({grid:!0,ruler:!1,lines:!0});return(0,g.jsxs)(u,{children:[(0,g.jsx)(l,{className:`btn`,children:`View`}),(0,g.jsxs)(a,{align:`start`,children:[(0,g.jsx)(m,{children:`Display`}),(0,g.jsx)(f,{checked:e.grid,onCheckedChange:e=>t(t=>({...t,grid:e})),children:`Grid`}),(0,g.jsx)(f,{checked:e.ruler,onCheckedChange:e=>t(t=>({...t,ruler:e})),children:`Ruler`}),(0,g.jsx)(f,{checked:e.lines,onCheckedChange:e=>t(t=>({...t,lines:e})),children:`Guidelines`})]})]})}},S={render:()=>{let[e,t]=h.useState(`name-asc`);return(0,g.jsxs)(u,{children:[(0,g.jsx)(l,{className:`btn`,children:`Sort by`}),(0,g.jsxs)(a,{align:`start`,children:[(0,g.jsx)(m,{children:`Sort order`}),(0,g.jsxs)(o,{value:e,onValueChange:t,children:[(0,g.jsx)(s,{value:`name-asc`,children:`Name (A → Z)`}),(0,g.jsx)(s,{value:`name-desc`,children:`Name (Z → A)`}),(0,g.jsx)(s,{value:`date-desc`,children:`Date modified`}),(0,g.jsx)(s,{value:`size-desc`,children:`File size`})]})]})]})}},C={render:()=>(0,g.jsxs)(u,{children:[(0,g.jsx)(l,{className:`btn`,children:`Actions`}),(0,g.jsxs)(a,{align:`start`,children:[(0,g.jsx)(c,{icon:i.eye,children:`Open`}),(0,g.jsx)(c,{icon:i.edit,children:`Rename`}),(0,g.jsx)(c,{icon:i.copy,disabled:!0,children:`Duplicate (unavailable)`}),(0,g.jsx)(d,{}),(0,g.jsx)(c,{icon:i.trash,variant:`destructive`,children:`Delete`})]})]})},w={render:()=>{let[e,t]=h.useState(`date-desc`);return(0,g.jsxs)(`div`,{className:`surface`,style:{padding:`12px 16px`,display:`flex`,alignItems:`center`,justifyContent:`space-between`,borderRadius:8,gap:12,minWidth:360},children:[(0,g.jsx)(`span`,{style:{fontSize:13,fontWeight:500,color:`var(--fg)`},children:`my-project / src`}),(0,g.jsxs)(`div`,{style:{display:`flex`,gap:8,alignItems:`center`},children:[(0,g.jsxs)(u,{children:[(0,g.jsxs)(l,{className:`btn sm outline`,children:[`Sort `,(0,g.jsx)(i.chevronDown,{size:11})]}),(0,g.jsxs)(a,{align:`end`,children:[(0,g.jsx)(m,{children:`Sort order`}),(0,g.jsxs)(o,{value:e,onValueChange:t,children:[(0,g.jsx)(s,{value:`name-asc`,children:`Name (A → Z)`}),(0,g.jsx)(s,{value:`date-desc`,children:`Date modified`}),(0,g.jsx)(s,{value:`size-desc`,children:`File size`})]})]})]}),(0,g.jsxs)(u,{children:[(0,g.jsx)(l,{className:`btn sm icon`,children:(0,g.jsx)(i.more,{size:14})}),(0,g.jsxs)(a,{align:`end`,children:[(0,g.jsx)(c,{icon:i.download,children:`Download`}),(0,g.jsx)(c,{icon:i.link,children:`Copy link`}),(0,g.jsx)(d,{}),(0,g.jsx)(c,{icon:i.trash,variant:`destructive`,children:`Delete`})]})]})]})]})}},T={render:()=>(0,g.jsx)(`div`,{dir:`rtl`,children:(0,g.jsxs)(u,{dir:`rtl`,children:[(0,g.jsxs)(l,{className:`btn`,children:[`الإجراءات `,(0,g.jsx)(i.chevronDown,{size:12})]}),(0,g.jsxs)(a,{align:`start`,children:[(0,g.jsx)(c,{icon:i.eye,shortcut:`↩`,children:`فتح`}),(0,g.jsx)(c,{icon:i.edit,shortcut:`⌘E`,children:`إعادة تسمية`}),(0,g.jsx)(c,{icon:i.copy,shortcut:`⌘D`,children:`تكرار`}),(0,g.jsx)(d,{}),(0,g.jsx)(c,{icon:i.trash,variant:`destructive`,shortcut:`⌫`,children:`حذف`})]})]})})},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <DropdownMenu>
      <DropdownMenuTrigger className="btn">Actions</DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem>Open</DropdownMenuItem>
        <DropdownMenuItem>Rename</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <DropdownMenu>
      <DropdownMenuTrigger className="btn">File actions</DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem icon={Icons.eye} shortcut="↩">Open</DropdownMenuItem>
        <DropdownMenuItem icon={Icons.edit} shortcut="⌘E">Rename</DropdownMenuItem>
        <DropdownMenuItem icon={Icons.copy} shortcut="⌘D">Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={Icons.download} shortcut="⌘S">Download</DropdownMenuItem>
        <DropdownMenuItem icon={Icons.link} shortcut="⌘⇧C">Copy link</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={Icons.trash} variant="destructive" shortcut="⌫">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <DropdownMenu>
      <DropdownMenuTrigger className="btn">
        <Icons.user size={13} /> Ana Silva <Icons.chevronDown size={12} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuItem icon={Icons.settings} shortcut="⌘,">Settings</DropdownMenuItem>
        <DropdownMenuItem icon={Icons.bell}>Notifications</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuItem icon={Icons.sun}>Light</DropdownMenuItem>
        <DropdownMenuItem icon={Icons.moon}>Dark</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={Icons.x} variant="destructive" shortcut="⌘⇧Q">Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [view, setView] = React.useState({
      grid: true,
      ruler: false,
      lines: true
    });
    return <DropdownMenu>
        <DropdownMenuTrigger className="btn">View</DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Display</DropdownMenuLabel>
          <DropdownMenuCheckboxItem checked={view.grid} onCheckedChange={v => setView(s => ({
          ...s,
          grid: v
        }))}>
            Grid
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={view.ruler} onCheckedChange={v => setView(s => ({
          ...s,
          ruler: v
        }))}>
            Ruler
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={view.lines} onCheckedChange={v => setView(s => ({
          ...s,
          lines: v
        }))}>
            Guidelines
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>;
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [sort, setSort] = React.useState('name-asc');
    return <DropdownMenu>
        <DropdownMenuTrigger className="btn">Sort by</DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Sort order</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
            <DropdownMenuRadioItem value="name-asc">Name (A → Z)</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="name-desc">Name (Z → A)</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="date-desc">Date modified</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="size-desc">File size</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>;
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <DropdownMenu>
      <DropdownMenuTrigger className="btn">Actions</DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem icon={Icons.eye}>Open</DropdownMenuItem>
        <DropdownMenuItem icon={Icons.edit}>Rename</DropdownMenuItem>
        <DropdownMenuItem icon={Icons.copy} disabled>Duplicate (unavailable)</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={Icons.trash} variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [sort, setSort] = React.useState('date-desc');
    return <div className="surface" style={{
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 8,
      gap: 12,
      minWidth: 360
    }}>
        <span style={{
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--fg)'
      }}>
          my-project / src
        </span>
        <div style={{
        display: 'flex',
        gap: 8,
        alignItems: 'center'
      }}>
          <DropdownMenu>
            <DropdownMenuTrigger className="btn sm outline">
              Sort <Icons.chevronDown size={11} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort order</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                <DropdownMenuRadioItem value="name-asc">Name (A → Z)</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="date-desc">Date modified</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="size-desc">File size</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className="btn sm icon">
              <Icons.more size={14} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem icon={Icons.download}>Download</DropdownMenuItem>
              <DropdownMenuItem icon={Icons.link}>Copy link</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem icon={Icons.trash} variant="destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>;
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => <div dir="rtl">
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger className="btn">
          الإجراءات <Icons.chevronDown size={12} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem icon={Icons.eye} shortcut="↩">فتح</DropdownMenuItem>
          <DropdownMenuItem icon={Icons.edit} shortcut="⌘E">إعادة تسمية</DropdownMenuItem>
          <DropdownMenuItem icon={Icons.copy} shortcut="⌘D">تكرار</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem icon={Icons.trash} variant="destructive" shortcut="⌫">حذف</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
}`,...T.parameters?.docs?.source}}},E=[`Default`,`WithIconsAndShortcuts`,`AccountMenu`,`CheckboxItems`,`RadioItems`,`WithDisabled`,`InContext`,`RTL`]}))();export{b as AccountMenu,x as CheckboxItems,v as Default,w as InContext,T as RTL,S as RadioItems,C as WithDisabled,y as WithIconsAndShortcuts,E as __namedExportsOrder,_ as default};