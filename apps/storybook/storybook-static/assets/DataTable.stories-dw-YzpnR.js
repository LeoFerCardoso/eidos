import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Fa as i,Gi as a,Ka as o,t as s}from"./src-DgoylXRw.js";var c,l,u,d,f,p,m,h,g,_,v,y,b,x;e((()=>{c=t(n(),1),s(),l=r(),u=[{id:`name`,label:`Service`,sortable:!0,width:`22%`,render:e=>(0,l.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:12},children:e.name})},{id:`tier`,label:`Tier`,sortable:!0,width:60,align:`center`},{id:`lang`,label:`Language`,sortable:!0},{id:`p95`,label:`p95 ms`,sortable:!0,align:`right`,render:e=>(0,l.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`},children:e.p95})},{id:`coverage`,label:`Coverage`,sortable:!0,align:`right`,render:e=>(0,l.jsxs)(`span`,{style:{fontFamily:`var(--font-mono)`},children:[e.coverage,`%`]})},{id:`alert`,label:`Health`,width:80,align:`center`,render:e=>(0,l.jsx)(i,{tone:e.alert?`degraded`:`up`,pulse:e.alert,size:`sm`})},{id:`deploys`,label:`Last deploy`}],d={"in-flight":`running`,success:`done`,"rolled-back":`error`},f=[{id:`id`,label:`Deploy`,width:80,render:e=>(0,l.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11},children:e.id})},{id:`service`,label:`Service`,sortable:!0},{id:`version`,label:`Version`,width:90,render:e=>(0,l.jsxs)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11},children:[`v`,e.version]})},{id:`author`,label:`Author`,sortable:!0},{id:`stage`,label:`Stage`},{id:`progress`,label:`%`,align:`right`,width:60,render:e=>(0,l.jsxs)(`span`,{style:{fontFamily:`var(--font-mono)`},children:[e.progress,`%`]})},{id:`status`,label:`Status`,align:`center`,width:80,render:e=>(0,l.jsx)(i,{tone:d[e.status]||`pending`,pulse:e.status===`in-flight`,size:`sm`})}],p={title:`Elements/DataTable`,component:a,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:"A dense, sortable-ready data table with custom cell renderers, clickable rows, sticky header, dense mode, footer slot, and a built-in empty state. Sort state is fully caller-controlled via `sort` + `onSort`; the table only paints the active chevron and sets `aria-sort`."}}},args:{columns:u,rows:o.SERVICES.slice(0,8),dense:!1,sticky:!1},argTypes:{dense:{control:`boolean`},sticky:{control:`boolean`}}},m={},h={args:{dense:!0}},g={render:()=>(0,l.jsx)(a,{columns:u,rows:o.SERVICES.slice(0,6),onRowClick:e=>window.alert(`Opened: ${e.name}`)})},_={render:()=>{let[e,t]=c.useState({col:`name`,dir:`asc`});return(0,l.jsx)(a,{columns:u,rows:[...o.SERVICES].sort((t,n)=>{let r=t[e.col],i=n[e.col],a=String(r).localeCompare(String(i),void 0,{numeric:!0});return e.dir===`asc`?a:-a}).slice(0,10),sort:e,onSort:e=>t(t=>({col:e,dir:t.col===e&&t.dir===`asc`?`desc`:`asc`}))})}},v={args:{rows:[]}},y={args:{columns:f,rows:o.DEPLOYS}},b={render:()=>{let[e,t]=c.useState({col:`coverage`,dir:`desc`}),n=[...o.SERVICES].sort((t,n)=>{let r=t[e.col],i=n[e.col],a=String(r).localeCompare(String(i),void 0,{numeric:!0});return e.dir===`asc`?a:-a});return(0,l.jsxs)(`div`,{children:[(0,l.jsxs)(`p`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,marginBottom:8},children:[`Service catalog · `,o.SERVICES.length,` services`]}),(0,l.jsx)(a,{columns:u,rows:n,sort:e,onSort:e=>t(t=>({col:e,dir:t.col===e&&t.dir===`asc`?`desc`:`asc`})),dense:!0,sticky:!0})]})}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{}`,...m.parameters?.docs?.source},description:{story:`Service catalog — 8 rows with custom cell renderers and a health dot.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    dense: true
  }
}`,...h.parameters?.docs?.source},description:{story:`Dense mode — tighter row padding for information-dense views.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:"{\n  render: () => <DataTable columns={SERVICE_COLUMNS} rows={MOCKS.SERVICES.slice(0, 6)} onRowClick={row => window.alert(`Opened: ${row.name}`)} />\n}",...g.parameters?.docs?.source},description:{story:`Clickable rows — hover and focus ring visible.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [sort, setSort] = React.useState<{
      col: string;
      dir: 'asc' | 'desc';
    }>({
      col: 'name',
      dir: 'asc'
    });
    const sorted = [...MOCKS.SERVICES].sort((a, b) => {
      const va = a[sort.col as keyof typeof a],
        vb = b[sort.col as keyof typeof b];
      const cmp = String(va).localeCompare(String(vb), undefined, {
        numeric: true
      });
      return sort.dir === 'asc' ? cmp : -cmp;
    });
    return <DataTable columns={SERVICE_COLUMNS} rows={sorted.slice(0, 10)} sort={sort} onSort={col => setSort(prev => ({
      col,
      dir: prev.col === col && prev.dir === 'asc' ? 'desc' : 'asc'
    }))} />;
  }
}`,..._.parameters?.docs?.source},description:{story:`Controlled sort state — column header click re-renders with the new sort.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    rows: []
  }
}`,...v.parameters?.docs?.source},description:{story:`Empty state — no rows match the current filters.`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    columns: DEPLOY_COLUMNS,
    rows: MOCKS.DEPLOYS
  }
}`,...y.parameters?.docs?.source},description:{story:`Deploy history table — uses the DEPLOYS fixture.`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [sort, setSort] = React.useState<{
      col: string;
      dir: 'asc' | 'desc';
    }>({
      col: 'coverage',
      dir: 'desc'
    });
    const sorted = [...MOCKS.SERVICES].sort((a, b) => {
      const va = a[sort.col as keyof typeof a],
        vb = b[sort.col as keyof typeof b];
      const cmp = String(va).localeCompare(String(vb), undefined, {
        numeric: true
      });
      return sort.dir === 'asc' ? cmp : -cmp;
    });
    return <div>
        <p style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg-muted)',
        marginBottom: 8
      }}>
          Service catalog · {MOCKS.SERVICES.length} services
        </p>
        <DataTable columns={SERVICE_COLUMNS} rows={sorted} sort={sort} onSort={col => setSort(prev => ({
        col,
        dir: prev.col === col && prev.dir === 'asc' ? 'desc' : 'asc'
      }))} dense sticky />
      </div>;
  }
}`,...b.parameters?.docs?.source},description:{story:`Full deploy dashboard with sortable headers + dense mode.`,...b.parameters?.docs?.description}}},x=[`Default`,`Dense`,`ClickableRows`,`Sortable`,`Empty`,`Deploys`,`InContext`]}))();export{g as ClickableRows,m as Default,h as Dense,y as Deploys,v as Empty,b as InContext,_ as Sortable,x as __namedExportsOrder,p as default};