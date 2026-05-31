import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Ft as i,Wa as a,t as o}from"./src-DgoylXRw.js";var s,c,l,u,d,f,p,m,h,g,_,v,y,b;e((()=>{s=t(n(),1),o(),c=r(),l=[{label:`Services`,href:`#`},{label:`forge-api`,href:`#`},{label:`Deploys`,href:`#`},{label:`v2.14.0`}],u=[{label:`Services`,href:`#`},{label:`forge-api`,href:`#`},{label:`Environments`,href:`#`},{label:`Production`,href:`#`},{label:`Deploys`,href:`#`},{label:`v2.14.0`}],d={title:`Primitives/Breadcrumb`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:'A hierarchical trail of links from the root to the current page. Wraps a semantic `<nav aria-label="Breadcrumb">` > `<ol>` > `<li>` structure. Supports four separator variants (chevron, slash, dot, arrow), overflow collapse via DropdownMenu, compact size, and full RTL parity.'}}},args:{items:l,separator:`chevron`,size:`md`},argTypes:{separator:{control:`inline-radio`,options:[`chevron`,`slash`,`dot`,`arrow`]},size:{control:`inline-radio`,options:[`sm`,`md`]},maxItems:{control:`number`},label:{control:`text`}}},f={},p={render:()=>(0,c.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:20},children:[`chevron`,`slash`,`dot`,`arrow`].map(e=>(0,c.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:16},children:[(0,c.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`,minWidth:72},children:e}),(0,c.jsx)(i,{items:[{label:`Services`,href:`#`},{label:`forge-api`,href:`#`},{label:`Settings`}],separator:e})]},e))})},m={args:{size:`sm`,items:[{label:`Services`,href:`#`},{label:`forge-api`,href:`#`},{label:`Settings`}]}},h={args:{items:u,maxItems:3}},g={render:()=>(0,c.jsx)(i,{items:[{label:`Services`,href:`#`,icon:(0,c.jsx)(a.home,{size:13})},{label:`forge-api`,href:`#`},{label:`Deploys`}]})},_={render:()=>{let[e,t]=s.useState(`—`);return(0,c.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:16},children:[(0,c.jsx)(i,{items:[{label:`Services`,onClick:()=>t(`Services`)},{label:`forge-api`,onClick:()=>t(`forge-api`)},{label:`Deploys`}]}),(0,c.jsxs)(`p`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`,margin:0},children:[`Last clicked: `,e]})]})}},v={render:()=>(0,c.jsx)(`div`,{dir:`rtl`,style:{display:`flex`,flexDirection:`column`,gap:20,padding:`8px 0`},children:[`chevron`,`arrow`,`slash`,`dot`].map(e=>(0,c.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:16,justifyContent:`flex-start`},children:[(0,c.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`,minWidth:72,direction:`ltr`},children:e}),(0,c.jsx)(i,{items:[{label:`الخدمات`,href:`#`},{label:`forge-api`,href:`#`},{label:`عمليات النشر`}],separator:e,label:`مسار التنقّل`})]},e))})},y={render:()=>(0,c.jsxs)(`div`,{style:{width:`100%`,padding:`24px 28px`,border:`1px solid var(--border)`,borderRadius:`var(--radius-xl)`,background:`var(--bg-elevated)`},children:[(0,c.jsx)(i,{size:`sm`,items:[{label:`Services`,href:`#`},{label:`forge-api`,href:`#`},{label:`Settings`}],style:{marginBottom:14}}),(0,c.jsx)(`h2`,{style:{fontSize:`var(--text-2xl)`,fontWeight:600,letterSpacing:`-0.02em`,margin:`0 0 6px`,color:`var(--fg)`},children:`Settings`}),(0,c.jsx)(`p`,{style:{fontSize:`var(--text-md)`,color:`var(--fg-muted)`,margin:0},children:`Manage alert routes, on-call rotation, and the dependency map for forge-api.`})]})},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{}`,...f.parameters?.docs?.source},description:{story:`Default chevron separator, medium size, four crumbs.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 20
  }}>
      {(['chevron', 'slash', 'dot', 'arrow'] as const).map(sep => <div key={sep} style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }}>
          <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)',
        minWidth: 72
      }}>
            {sep}
          </code>
          <Breadcrumb items={[{
        label: 'Services',
        href: '#'
      }, {
        label: 'forge-api',
        href: '#'
      }, {
        label: 'Settings'
      }]} separator={sep} />
        </div>)}
    </div>
}`,...p.parameters?.docs?.source},description:{story:`All four separator variants side-by-side.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'sm',
    items: [{
      label: 'Services',
      href: '#'
    }, {
      label: 'forge-api',
      href: '#'
    }, {
      label: 'Settings'
    }]
  }
}`,...m.parameters?.docs?.source},description:{story:`Small size for use inside page-header bars next to the topbar.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    items: LONG_ITEMS,
    maxItems: 3
  }
}`,...h.parameters?.docs?.source},description:{story:`When items exceed maxItems the middle collapses into an ellipsis DropdownMenu.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => {
    // We import Icons inline so the story is self-contained.
    return <Breadcrumb items={[{
      label: 'Services',
      href: '#',
      icon: <Icons.home size={13} />
    }, {
      label: 'forge-api',
      href: '#'
    }, {
      label: 'Deploys'
    }]} />;
  }
}`,...g.parameters?.docs?.source},description:{story:`Leading icon on the first crumb (home).`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [last, setLast] = React.useState('—');
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }}>
        <Breadcrumb items={[{
        label: 'Services',
        onClick: () => setLast('Services')
      }, {
        label: 'forge-api',
        onClick: () => setLast('forge-api')
      }, {
        label: 'Deploys'
      }]} />
        <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)',
        margin: 0
      }}>
          Last clicked: {last}
        </p>
      </div>;
  }
}`,..._.parameters?.docs?.source},description:{story:`Items can use onClick (e.g. in an SPA router) instead of href.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <div dir="rtl" style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    padding: '8px 0'
  }}>
      {(['chevron', 'arrow', 'slash', 'dot'] as const).map(sep => <div key={sep} style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      justifyContent: 'flex-start'
    }}>
          <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)',
        minWidth: 72,
        direction: 'ltr'
      }}>
            {sep}
          </code>
          <Breadcrumb items={[{
        label: 'الخدمات',
        href: '#'
      }, {
        label: 'forge-api',
        href: '#'
      }, {
        label: 'عمليات النشر'
      }]} separator={sep} label="مسار التنقّل" />
        </div>)}
    </div>
}`,...v.parameters?.docs?.source},description:{story:`Under dir="rtl" the chevron/arrow separators mirror with scaleX(-1)
so they always point to the next (more specific) segment.
Slash and dot separators are non-directional and do not mirror.`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    width: '100%',
    padding: '24px 28px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-xl)',
    background: 'var(--bg-elevated)'
  }}>
      <Breadcrumb size="sm" items={[{
      label: 'Services',
      href: '#'
    }, {
      label: 'forge-api',
      href: '#'
    }, {
      label: 'Settings'
    }]} style={{
      marginBottom: 14
    } as React.CSSProperties} />
      <h2 style={{
      fontSize: 'var(--text-2xl)',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      margin: '0 0 6px',
      color: 'var(--fg)'
    }}>
        Settings
      </h2>
      <p style={{
      fontSize: 'var(--text-md)',
      color: 'var(--fg-muted)',
      margin: 0
    }}>
        Manage alert routes, on-call rotation, and the dependency map for forge-api.
      </p>
    </div>
}`,...y.parameters?.docs?.source},description:{story:`Breadcrumb above a page title — the typical in-app placement.`,...y.parameters?.docs?.description}}},b=[`Default`,`Separators`,`Compact`,`WithCollapse`,`WithIcon`,`WithOnClick`,`RTL`,`InContext`]}))();export{m as Compact,f as Default,y as InContext,v as RTL,p as Separators,h as WithCollapse,g as WithIcon,_ as WithOnClick,b as __namedExportsOrder,d as default};