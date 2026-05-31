import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{C as i,S as a,Wa as o,t as s}from"./src-DgoylXRw.js";var c,l,u,d,f,p,m,h,g,_,v,y,b,x,S;e((()=>{c=t(n(),1),s(),l=r(),u={title:`Forms/ToggleGroup`,component:a,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:'A segmented group of toggle buttons. `type="single"` acts as a radio group (one-or-none active, roving tabindex + Arrow keys); `type="multiple"` is a group of independent toggle buttons (Space/Enter each). Supports `ghost` and `outline` variants, three sizes, horizontal/vertical orientation, and is fully direction-aware (logical border-radius mirrors under `dir="rtl"`).'}}},args:{type:`single`,variant:`default`,size:`md`,orientation:`horizontal`,disabled:!1},argTypes:{type:{control:`inline-radio`,options:[`single`,`multiple`]},variant:{control:`inline-radio`,options:[`default`,`outline`]},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]},orientation:{control:`inline-radio`,options:[`horizontal`,`vertical`]},disabled:{control:`boolean`}}},d={render:e=>{let[t,n]=c.useState(`grid`);return(0,l.jsxs)(a,{...e,value:t,onValueChange:e=>n(e),"aria-label":`View mode`,children:[(0,l.jsxs)(i,{value:`grid`,children:[(0,l.jsx)(o.grid,{size:14}),` Grid`]}),(0,l.jsxs)(i,{value:`list`,children:[(0,l.jsx)(o.menu,{size:14}),` List`]}),(0,l.jsxs)(i,{value:`kanban`,children:[(0,l.jsx)(o.layers,{size:14}),` Kanban`]})]})}},f={render:()=>{let[e,t]=c.useState(`week`);return(0,l.jsxs)(a,{type:`single`,value:e,onValueChange:e=>t(e),"aria-label":`Date range`,children:[(0,l.jsx)(i,{value:`day`,children:`Day`}),(0,l.jsx)(i,{value:`week`,children:`Week`}),(0,l.jsx)(i,{value:`month`,children:`Month`}),(0,l.jsx)(i,{value:`year`,children:`Year`})]})}},p={render:()=>{let[e,t]=c.useState([`bold`]);return(0,l.jsxs)(a,{type:`multiple`,value:e,onValueChange:e=>t(e),"aria-label":`Text formatting`,children:[(0,l.jsx)(i,{value:`bold`,"aria-label":`Bold`,children:(0,l.jsx)(o.bold,{size:14})}),(0,l.jsx)(i,{value:`italic`,"aria-label":`Italic`,children:(0,l.jsx)(o.italic,{size:14})}),(0,l.jsx)(i,{value:`underline`,"aria-label":`Underline`,children:(0,l.jsx)(o.underline,{size:14})})]})}},m={render:()=>{let[e,t]=c.useState(`week`);return(0,l.jsxs)(a,{type:`single`,variant:`outline`,value:e,onValueChange:e=>t(e),"aria-label":`Date range`,children:[(0,l.jsx)(i,{value:`day`,children:`Day`}),(0,l.jsx)(i,{value:`week`,children:`Week`}),(0,l.jsx)(i,{value:`month`,children:`Month`}),(0,l.jsx)(i,{value:`year`,children:`Year`})]})}},h={render:()=>{let[e,t]=c.useState(`b`);return(0,l.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:14,alignItems:`flex-start`},children:[`sm`,`md`,`lg`].map(n=>(0,l.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:12},children:[(0,l.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-muted)`,width:28},children:n}),(0,l.jsxs)(a,{type:`single`,size:n,value:e,onValueChange:e=>t(e),"aria-label":`Size ${n}`,children:[(0,l.jsx)(i,{value:`a`,children:`A`}),(0,l.jsx)(i,{value:`b`,children:`B`}),(0,l.jsx)(i,{value:`c`,children:`C`})]})]},n))})}},g={render:()=>{let[e,t]=c.useState(`week`);return(0,l.jsxs)(a,{type:`single`,orientation:`vertical`,variant:`outline`,value:e,onValueChange:e=>t(e),"aria-label":`Date range`,children:[(0,l.jsx)(i,{value:`day`,children:`Day`}),(0,l.jsx)(i,{value:`week`,children:`Week`}),(0,l.jsx)(i,{value:`month`,children:`Month`}),(0,l.jsx)(i,{value:`year`,children:`Year`})]})}},_={render:()=>(0,l.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:14,alignItems:`flex-start`},children:[(0,l.jsxs)(a,{type:`single`,disabled:!0,defaultValue:`a`,"aria-label":`All disabled`,children:[(0,l.jsx)(i,{value:`a`,children:`Available`}),(0,l.jsx)(i,{value:`b`,children:`Pro`}),(0,l.jsx)(i,{value:`c`,children:`Enterprise`})]}),(0,l.jsxs)(a,{type:`single`,defaultValue:`a`,"aria-label":`Per-item disabled`,children:[(0,l.jsx)(i,{value:`a`,children:`Available`}),(0,l.jsx)(i,{value:`b`,disabled:!0,children:`Pro only`}),(0,l.jsx)(i,{value:`c`,disabled:!0,children:`Enterprise`})]})]})},v={render:()=>{let[e,t]=c.useState([`active`]);return(0,l.jsxs)(a,{type:`multiple`,variant:`outline`,value:e,onValueChange:e=>t(e),"aria-label":`Status filter`,children:[(0,l.jsx)(i,{value:`active`,children:`Active`}),(0,l.jsx)(i,{value:`pending`,children:`Pending`}),(0,l.jsx)(i,{value:`paused`,children:`Paused`}),(0,l.jsx)(i,{value:`archived`,children:`Archived`})]})}},y={render:()=>{let[e,t]=c.useState(`left`);return(0,l.jsxs)(a,{type:`single`,value:e,onValueChange:e=>t(e),"aria-label":`Text alignment`,children:[(0,l.jsx)(i,{value:`left`,"aria-label":`Align left`,children:(0,l.jsx)(o.alignLeft,{size:14})}),(0,l.jsx)(i,{value:`center`,"aria-label":`Align center`,children:(0,l.jsx)(o.alignCenter,{size:14})}),(0,l.jsx)(i,{value:`right`,"aria-label":`Align right`,children:(0,l.jsx)(o.alignRight,{size:14})}),(0,l.jsx)(i,{value:`justify`,"aria-label":`Justify`,children:(0,l.jsx)(o.alignJustify,{size:14})})]})}},b={render:()=>{let[e,t]=c.useState(`grid`);return(0,l.jsx)(`div`,{dir:`rtl`,children:(0,l.jsxs)(a,{type:`single`,variant:`outline`,value:e,onValueChange:e=>t(e),"aria-label":`عرض`,children:[(0,l.jsxs)(i,{value:`grid`,children:[(0,l.jsx)(o.grid,{size:14}),` شبكة`]}),(0,l.jsxs)(i,{value:`list`,children:[(0,l.jsx)(o.menu,{size:14}),` قائمة`]}),(0,l.jsxs)(i,{value:`kanban`,children:[(0,l.jsx)(o.layers,{size:14}),` كانبان`]})]})})}},x={render:()=>{let[e,t]=c.useState(`grid`),[n,r]=c.useState([`bold`]);return(0,l.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:12,padding:`10px 16px`,background:`var(--surface)`,border:`1px solid var(--border)`,borderRadius:8},children:[(0,l.jsxs)(a,{type:`single`,value:e,onValueChange:e=>t(e),"aria-label":`View mode`,children:[(0,l.jsx)(i,{value:`grid`,"aria-label":`Grid view`,children:(0,l.jsx)(o.grid,{size:14})}),(0,l.jsx)(i,{value:`list`,"aria-label":`List view`,children:(0,l.jsx)(o.menu,{size:14})})]}),(0,l.jsx)(`span`,{style:{width:1,height:20,background:`var(--border)`}}),(0,l.jsxs)(a,{type:`multiple`,value:n,onValueChange:e=>r(e),"aria-label":`Text formatting`,children:[(0,l.jsx)(i,{value:`bold`,"aria-label":`Bold`,children:(0,l.jsx)(o.bold,{size:14})}),(0,l.jsx)(i,{value:`italic`,"aria-label":`Italic`,children:(0,l.jsx)(o.italic,{size:14})}),(0,l.jsx)(i,{value:`underline`,"aria-label":`Underline`,children:(0,l.jsx)(o.underline,{size:14})})]})]})}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [view, setView] = React.useState<string | null>('grid');
    return <ToggleGroup {...args} value={view} onValueChange={v => setView(v as string | null)} aria-label="View mode">
        <ToggleGroupItem value="grid">
          <Icons.grid size={14} /> Grid
        </ToggleGroupItem>
        <ToggleGroupItem value="list">
          <Icons.menu size={14} /> List
        </ToggleGroupItem>
        <ToggleGroupItem value="kanban">
          <Icons.layers size={14} /> Kanban
        </ToggleGroupItem>
      </ToggleGroup>;
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [range, setRange] = React.useState<string | null>('week');
    return <ToggleGroup type="single" value={range} onValueChange={v => setRange(v as string | null)} aria-label="Date range">
        <ToggleGroupItem value="day">Day</ToggleGroupItem>
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
        <ToggleGroupItem value="month">Month</ToggleGroupItem>
        <ToggleGroupItem value="year">Year</ToggleGroupItem>
      </ToggleGroup>;
  }
}`,...f.parameters?.docs?.source},description:{story:`Radio-group semantics: Tab into the group, Arrow keys move and select.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [marks, setMarks] = React.useState<string[]>(['bold']);
    return <ToggleGroup type="multiple" value={marks} onValueChange={v => setMarks(v as string[])} aria-label="Text formatting">
        <ToggleGroupItem value="bold" aria-label="Bold">
          <Icons.bold size={14} />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <Icons.italic size={14} />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <Icons.underline size={14} />
        </ToggleGroupItem>
      </ToggleGroup>;
  }
}`,...p.parameters?.docs?.source},description:{story:`Independent toggle buttons — text-formatting bar.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [v, setV] = React.useState<string | null>('week');
    return <ToggleGroup type="single" variant="outline" value={v} onValueChange={val => setV(val as string | null)} aria-label="Date range">
        <ToggleGroupItem value="day">Day</ToggleGroupItem>
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
        <ToggleGroupItem value="month">Month</ToggleGroupItem>
        <ToggleGroupItem value="year">Year</ToggleGroupItem>
      </ToggleGroup>;
  }
}`,...m.parameters?.docs?.source},description:{story:`Joined border seams — useful on busy surfaces.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [v, setV] = React.useState<string | null>('b');
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      alignItems: 'flex-start'
    }}>
        {(['sm', 'md', 'lg'] as const).map(size => <div key={size} style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
            <code style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--fg-muted)',
          width: 28
        }}>{size}</code>
            <ToggleGroup type="single" size={size} value={v} onValueChange={val => setV(val as string | null)} aria-label={\`Size \${size}\`}>
              <ToggleGroupItem value="a">A</ToggleGroupItem>
              <ToggleGroupItem value="b">B</ToggleGroupItem>
              <ToggleGroupItem value="c">C</ToggleGroupItem>
            </ToggleGroup>
          </div>)}
      </div>;
  }
}`,...h.parameters?.docs?.source},description:{story:`All three sizes — sm 24px / md 30px / lg 36px.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [v, setV] = React.useState<string | null>('week');
    return <ToggleGroup type="single" orientation="vertical" variant="outline" value={v} onValueChange={val => setV(val as string | null)} aria-label="Date range">
        <ToggleGroupItem value="day">Day</ToggleGroupItem>
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
        <ToggleGroupItem value="month">Month</ToggleGroupItem>
        <ToggleGroupItem value="year">Year</ToggleGroupItem>
      </ToggleGroup>;
  }
}`,...g.parameters?.docs?.source},description:{story:`Stacked — for sidebars and tool palettes.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    alignItems: 'flex-start'
  }}>
      <ToggleGroup type="single" disabled defaultValue="a" aria-label="All disabled">
        <ToggleGroupItem value="a">Available</ToggleGroupItem>
        <ToggleGroupItem value="b">Pro</ToggleGroupItem>
        <ToggleGroupItem value="c">Enterprise</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" defaultValue="a" aria-label="Per-item disabled">
        <ToggleGroupItem value="a">Available</ToggleGroupItem>
        <ToggleGroupItem value="b" disabled>Pro only</ToggleGroupItem>
        <ToggleGroupItem value="c" disabled>Enterprise</ToggleGroupItem>
      </ToggleGroup>
    </div>
}`,..._.parameters?.docs?.source},description:{story:`Group-level and per-item disabled.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [statuses, setStatuses] = React.useState<string[]>(['active']);
    return <ToggleGroup type="multiple" variant="outline" value={statuses} onValueChange={v => setStatuses(v as string[])} aria-label="Status filter">
        <ToggleGroupItem value="active">Active</ToggleGroupItem>
        <ToggleGroupItem value="pending">Pending</ToggleGroupItem>
        <ToggleGroupItem value="paused">Paused</ToggleGroupItem>
        <ToggleGroupItem value="archived">Archived</ToggleGroupItem>
      </ToggleGroup>;
  }
}`,...v.parameters?.docs?.source},description:{story:`Multiple + outline — status filter bar.`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [align, setAlign] = React.useState<string | null>('left');
    return <ToggleGroup type="single" value={align} onValueChange={v => setAlign(v as string | null)} aria-label="Text alignment">
        <ToggleGroupItem value="left" aria-label="Align left">
          <Icons.alignLeft size={14} />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <Icons.alignCenter size={14} />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <Icons.alignRight size={14} />
        </ToggleGroupItem>
        <ToggleGroupItem value="justify" aria-label="Justify">
          <Icons.alignJustify size={14} />
        </ToggleGroupItem>
      </ToggleGroup>;
  }
}`,...y.parameters?.docs?.source},description:{story:`Icon-only items — each must carry aria-label.`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [v, setV] = React.useState<string | null>('grid');
    return <div dir="rtl">
        <ToggleGroup type="single" variant="outline" value={v} onValueChange={val => setV(val as string | null)} aria-label="عرض">
          <ToggleGroupItem value="grid">
            <Icons.grid size={14} /> شبكة
          </ToggleGroupItem>
          <ToggleGroupItem value="list">
            <Icons.menu size={14} /> قائمة
          </ToggleGroupItem>
          <ToggleGroupItem value="kanban">
            <Icons.layers size={14} /> كانبان
          </ToggleGroupItem>
        </ToggleGroup>
      </div>;
  }
}`,...b.parameters?.docs?.source},description:{story:`Right-to-left: logical border-radius mirrors the group naturally.`,...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [view, setView] = React.useState<string | null>('grid');
    const [marks, setMarks] = React.useState<string[]>(['bold']);
    return <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 16px',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 8
    }}>
        <ToggleGroup type="single" value={view} onValueChange={v => setView(v as string | null)} aria-label="View mode">
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <Icons.grid size={14} />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <Icons.menu size={14} />
          </ToggleGroupItem>
        </ToggleGroup>
        <span style={{
        width: 1,
        height: 20,
        background: 'var(--border)'
      }} />
        <ToggleGroup type="multiple" value={marks} onValueChange={v => setMarks(v as string[])} aria-label="Text formatting">
          <ToggleGroupItem value="bold" aria-label="Bold">
            <Icons.bold size={14} />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            <Icons.italic size={14} />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline">
            <Icons.underline size={14} />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>;
  }
}`,...x.parameters?.docs?.source},description:{story:`Realistic toolbar composition — view switcher + text formatting.`,...x.parameters?.docs?.description}}},S=[`Default`,`SingleMode`,`MultipleMode`,`OutlineVariant`,`Sizes`,`Vertical`,`DisabledStates`,`FilterChips`,`AlignmentIconOnly`,`RTL`,`InContext`]}))();export{y as AlignmentIconOnly,d as Default,_ as DisabledStates,v as FilterChips,x as InContext,p as MultipleMode,m as OutlineVariant,b as RTL,f as SingleMode,h as Sizes,g as Vertical,S as __namedExportsOrder,u as default};