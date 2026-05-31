import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{$ as i,J as a,Q as o,X as s,Y as c,Z as l,ei as u,et as d,t as f,tt as p}from"./src-DgoylXRw.js";var m,h,g,_,v,y,b,x,S,C,w,T,E,D;e((()=>{m=t(n(),1),f(),h=r(),g=[{id:`s1`,name:`identity-svc`,tier:`T1`,lang:`Go`,p95:142,coverage:94},{id:`s2`,name:`pix-router`,tier:`T2`,lang:`TypeScript`,p95:89,coverage:87},{id:`s3`,name:`fraud-engine`,tier:`T1`,lang:`Python`,p95:312,coverage:82},{id:`s4`,name:`bureau-gateway`,tier:`T1`,lang:`Go`,p95:218,coverage:91},{id:`s5`,name:`ledger-svc`,tier:`T2`,lang:`Rust`,p95:24,coverage:97}],_={title:`Primitives/Table`,component:a,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:`Semantic HTML table primitive over the .tbl CSS layer. Compound API: Table · TableHeader · TableBody · TableFooter · TableRow · TableHead · TableCell · TableCaption. Density, zebra stripes, sticky headers, row status, and sortable columns via aria-sort + arrow glyph. RTL-aware via logical CSS.`}}},argTypes:{density:{control:`inline-radio`,options:[void 0,`comfortable`,`compact`]},zebra:{control:`boolean`},stickyHeader:{control:`boolean`},fullWidth:{control:`boolean`}},args:{fullWidth:!0,zebra:!1,stickyHeader:!1}},v={render:e=>(0,h.jsxs)(a,{...e,"aria-label":`Services`,children:[(0,h.jsx)(s,{children:`Service health overview`}),(0,h.jsx)(d,{children:(0,h.jsxs)(p,{children:[(0,h.jsx)(i,{children:`Service`}),(0,h.jsx)(i,{children:`Tier`}),(0,h.jsx)(i,{children:`Language`}),(0,h.jsx)(i,{align:`end`,children:`p95`}),(0,h.jsx)(i,{align:`end`,children:`Coverage`})]})}),(0,h.jsx)(c,{children:g.map(e=>(0,h.jsxs)(p,{children:[(0,h.jsx)(l,{style:{fontWeight:500},children:e.name}),(0,h.jsx)(l,{children:e.tier}),(0,h.jsx)(l,{children:e.lang}),(0,h.jsxs)(l,{align:`end`,style:{fontFamily:`var(--font-mono)`,fontVariantNumeric:`tabular-nums`},children:[e.p95,`ms`]}),(0,h.jsxs)(l,{align:`end`,style:{fontFamily:`var(--font-mono)`,fontVariantNumeric:`tabular-nums`},children:[e.coverage,`%`]})]},e.id))})]})},y={render:()=>{let e=g.slice(0,3),t=({density:t,label:n})=>(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`div`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,textTransform:`uppercase`,letterSpacing:`0.06em`,color:`var(--fg-faint)`,marginBottom:8},children:n}),(0,h.jsxs)(a,{density:t,fullWidth:!0,children:[(0,h.jsx)(d,{children:(0,h.jsxs)(p,{children:[(0,h.jsx)(i,{children:`Service`}),(0,h.jsx)(i,{children:`Tier`}),(0,h.jsx)(i,{align:`end`,children:`p95`})]})}),(0,h.jsx)(c,{children:e.map(e=>(0,h.jsxs)(p,{children:[(0,h.jsx)(l,{style:{fontWeight:500},children:e.name}),(0,h.jsx)(l,{children:e.tier}),(0,h.jsxs)(l,{align:`end`,style:{fontFamily:`var(--font-mono)`},children:[e.p95,`ms`]})]},e.id))})]})]});return(0,h.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:24},children:[(0,h.jsx)(t,{density:`compact`,label:`compact — 6/10 px · ops dashboards`}),(0,h.jsx)(t,{density:void 0,label:`default — 10/12 px · standard lists`}),(0,h.jsx)(t,{density:`comfortable`,label:`comfortable — 14/16 px · audit / billing`})]})}},b={render:()=>{let[e,t]=m.useState({key:`p95`,dir:`asc`}),n=e=>()=>{t(t=>({key:e,dir:t.key===e&&t.dir===`asc`?`desc`:`asc`}))},r=[...g].sort((t,n)=>{let r=t[e.key],i=n[e.key],a=typeof r==`number`?r-i:String(r).localeCompare(String(i));return e.dir===`asc`?a:-a}),o=t=>e.key===t?e.dir:`none`;return(0,h.jsxs)(a,{fullWidth:!0,"aria-label":`Services — sortable`,children:[(0,h.jsx)(d,{children:(0,h.jsxs)(p,{children:[(0,h.jsx)(i,{sortable:!0,sortDirection:o(`name`),onSort:n(`name`),children:`Service`}),(0,h.jsx)(i,{sortable:!0,sortDirection:o(`tier`),onSort:n(`tier`),children:`Tier`}),(0,h.jsx)(i,{sortable:!0,sortDirection:o(`lang`),onSort:n(`lang`),children:`Language`}),(0,h.jsx)(i,{sortable:!0,sortDirection:o(`p95`),onSort:n(`p95`),align:`end`,children:`p95`}),(0,h.jsx)(i,{sortable:!0,sortDirection:o(`coverage`),onSort:n(`coverage`),align:`end`,children:`Coverage`})]})}),(0,h.jsx)(c,{children:r.map(e=>(0,h.jsxs)(p,{children:[(0,h.jsx)(l,{style:{fontWeight:500},children:e.name}),(0,h.jsx)(l,{children:e.tier}),(0,h.jsx)(l,{children:e.lang}),(0,h.jsxs)(l,{align:`end`,style:{fontFamily:`var(--font-mono)`,fontVariantNumeric:`tabular-nums`},children:[e.p95,`ms`]}),(0,h.jsxs)(l,{align:`end`,style:{fontFamily:`var(--font-mono)`,fontVariantNumeric:`tabular-nums`},children:[e.coverage,`%`]})]},e.id))})]})}},x={render:()=>(0,h.jsxs)(a,{fullWidth:!0,"aria-label":`Services with status`,children:[(0,h.jsx)(d,{children:(0,h.jsxs)(p,{children:[(0,h.jsx)(i,{children:`Service`}),(0,h.jsx)(i,{children:`Tier`}),(0,h.jsx)(i,{children:`Status`}),(0,h.jsx)(i,{align:`end`,children:`p95`})]})}),(0,h.jsxs)(c,{children:[(0,h.jsxs)(p,{children:[(0,h.jsx)(l,{style:{fontWeight:500},children:`identity-svc`}),(0,h.jsx)(l,{children:`T1`}),(0,h.jsx)(l,{style:{color:`var(--success)`},children:`Healthy`}),(0,h.jsx)(l,{align:`end`,style:{fontFamily:`var(--font-mono)`},children:`142ms`})]}),(0,h.jsxs)(p,{status:`warn`,children:[(0,h.jsx)(l,{style:{fontWeight:500},children:`fraud-engine`}),(0,h.jsx)(l,{children:`T1`}),(0,h.jsx)(l,{style:{color:`var(--warning)`},children:`Degraded`}),(0,h.jsx)(l,{align:`end`,style:{fontFamily:`var(--font-mono)`,color:`var(--warning)`},children:`312ms`})]}),(0,h.jsxs)(p,{status:`danger`,children:[(0,h.jsx)(l,{style:{fontWeight:500},children:`bureau-gateway`}),(0,h.jsx)(l,{children:`T1`}),(0,h.jsx)(l,{style:{color:`var(--danger)`},children:`Failing`}),(0,h.jsx)(l,{align:`end`,style:{fontFamily:`var(--font-mono)`,color:`var(--danger)`},children:`2100ms`})]}),(0,h.jsxs)(p,{children:[(0,h.jsx)(l,{style:{fontWeight:500},children:`ledger-svc`}),(0,h.jsx)(l,{children:`T2`}),(0,h.jsx)(l,{style:{color:`var(--success)`},children:`Healthy`}),(0,h.jsx)(l,{align:`end`,style:{fontFamily:`var(--font-mono)`},children:`24ms`})]})]})]})},S={render:()=>{let[e,t]=m.useState(new Set([`s2`,`s4`])),n=e=>()=>{t(t=>{let n=new Set(t);return n.has(e)?n.delete(e):n.add(e),n})};return(0,h.jsxs)(a,{fullWidth:!0,"aria-label":`Services — selectable`,children:[(0,h.jsx)(d,{children:(0,h.jsxs)(p,{children:[(0,h.jsx)(i,{style:{width:40},children:`Sel`}),(0,h.jsx)(i,{children:`Service`}),(0,h.jsx)(i,{children:`Tier`}),(0,h.jsx)(i,{align:`end`,children:`p95`})]})}),(0,h.jsx)(c,{children:g.map(t=>(0,h.jsxs)(p,{selected:e.has(t.id),onClick:n(t.id),style:{cursor:`pointer`},"aria-selected":e.has(t.id),children:[(0,h.jsx)(l,{onClick:e=>e.stopPropagation(),children:(0,h.jsx)(u,{checked:e.has(t.id),onChange:n(t.id),"aria-label":`Select ${t.name}`})}),(0,h.jsx)(l,{style:{fontWeight:500},children:t.name}),(0,h.jsx)(l,{children:t.tier}),(0,h.jsxs)(l,{align:`end`,style:{fontFamily:`var(--font-mono)`},children:[t.p95,`ms`]})]},t.id))})]})}},C={render:()=>(0,h.jsxs)(a,{fullWidth:!0,zebra:!0,"aria-label":`Services — striped`,children:[(0,h.jsx)(d,{children:(0,h.jsxs)(p,{children:[(0,h.jsx)(i,{children:`Service`}),(0,h.jsx)(i,{children:`Tier`}),(0,h.jsx)(i,{align:`end`,children:`p95`})]})}),(0,h.jsx)(c,{children:g.map(e=>(0,h.jsxs)(p,{children:[(0,h.jsx)(l,{style:{fontWeight:500},children:e.name}),(0,h.jsx)(l,{children:e.tier}),(0,h.jsxs)(l,{align:`end`,style:{fontFamily:`var(--font-mono)`},children:[e.p95,`ms`]})]},e.id))})]})},w={render:()=>{let e=Math.round(g.reduce((e,t)=>e+t.p95,0)/g.length),t=Math.round(g.reduce((e,t)=>e+t.coverage,0)/g.length);return(0,h.jsxs)(a,{fullWidth:!0,"aria-label":`Services with summary footer`,children:[(0,h.jsx)(d,{children:(0,h.jsxs)(p,{children:[(0,h.jsx)(i,{children:`Service`}),(0,h.jsx)(i,{children:`Tier`}),(0,h.jsx)(i,{align:`end`,children:`p95`}),(0,h.jsx)(i,{align:`end`,children:`Coverage`})]})}),(0,h.jsx)(c,{children:g.map(e=>(0,h.jsxs)(p,{children:[(0,h.jsx)(l,{style:{fontWeight:500},children:e.name}),(0,h.jsx)(l,{children:e.tier}),(0,h.jsxs)(l,{align:`end`,style:{fontFamily:`var(--font-mono)`},children:[e.p95,`ms`]}),(0,h.jsxs)(l,{align:`end`,style:{fontFamily:`var(--font-mono)`},children:[e.coverage,`%`]})]},e.id))}),(0,h.jsx)(o,{children:(0,h.jsxs)(p,{children:[(0,h.jsx)(l,{colSpan:2,style:{fontWeight:600,color:`var(--fg-subtle)`,fontSize:11,textTransform:`uppercase`,letterSpacing:`0.05em`,fontFamily:`var(--font-mono)`},children:`Averages`}),(0,h.jsxs)(l,{align:`end`,style:{fontFamily:`var(--font-mono)`,fontWeight:600},children:[e,`ms`]}),(0,h.jsxs)(l,{align:`end`,style:{fontFamily:`var(--font-mono)`,fontWeight:600},children:[t,`%`]})]})})]})}},T={render:()=>(0,h.jsx)(`div`,{dir:`rtl`,children:(0,h.jsxs)(a,{fullWidth:!0,"aria-label":`الخدمات`,children:[(0,h.jsx)(s,{children:`نظرة عامة على صحة الخدمة`}),(0,h.jsx)(d,{children:(0,h.jsxs)(p,{children:[(0,h.jsx)(i,{children:`الخدمة`}),(0,h.jsx)(i,{children:`الفئة`}),(0,h.jsx)(i,{children:`الحالة`}),(0,h.jsx)(i,{align:`end`,children:`p95`})]})}),(0,h.jsxs)(c,{children:[(0,h.jsxs)(p,{children:[(0,h.jsx)(l,{style:{fontWeight:500},children:`identity-svc`}),(0,h.jsx)(l,{children:`T1`}),(0,h.jsx)(l,{style:{color:`var(--success)`},children:`سليم`}),(0,h.jsx)(l,{align:`end`,style:{fontFamily:`var(--font-mono)`},children:`١٤٢ مللي`})]}),(0,h.jsxs)(p,{status:`warn`,children:[(0,h.jsx)(l,{style:{fontWeight:500},children:`fraud-engine`}),(0,h.jsx)(l,{children:`T1`}),(0,h.jsx)(l,{style:{color:`var(--warning)`},children:`متدهور`}),(0,h.jsx)(l,{align:`end`,style:{fontFamily:`var(--font-mono)`,color:`var(--warning)`},children:`٣١٢ مللي`})]}),(0,h.jsxs)(p,{status:`danger`,children:[(0,h.jsx)(l,{style:{fontWeight:500},children:`bureau-gateway`}),(0,h.jsx)(l,{children:`T1`}),(0,h.jsx)(l,{style:{color:`var(--danger)`},children:`فاشل`}),(0,h.jsx)(l,{align:`end`,style:{fontFamily:`var(--font-mono)`,color:`var(--danger)`},children:`٢١٠٠ مللي`})]})]})]})})},E={render:()=>{let[e,t]=m.useState({key:`name`,dir:`asc`}),[n,r]=m.useState(new Set),o=e=>()=>r(t=>{let n=new Set(t);return n.has(e)?n.delete(e):n.add(e),n}),s=()=>r(n.size===g.length?new Set:new Set(g.map(e=>e.id))),f=n.size===g.length,_=n.size>0&&!f,v=e=>()=>t(t=>({key:e,dir:t.key===e&&t.dir===`asc`?`desc`:`asc`})),y=t=>e.key===t?e.dir:`none`,b=[...g].sort((t,n)=>{let r=t[e.key],i=n[e.key],a=typeof r==`number`?r-i:String(r).localeCompare(String(i));return e.dir===`asc`?a:-a});return(0,h.jsxs)(`div`,{children:[n.size>0&&(0,h.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:10,padding:`8px 12px`,background:`var(--ember-soft)`,border:`1px solid rgba(255,107,53,0.35)`,borderBottom:`none`,borderRadius:`8px 8px 0 0`},children:[(0,h.jsxs)(`span`,{style:{color:`var(--ember)`,fontWeight:600,fontSize:13},children:[n.size,` selected`]}),(0,h.jsx)(`span`,{style:{width:1,height:16,background:`rgba(255,107,53,0.3)`}}),(0,h.jsx)(`button`,{className:`btn ghost`,style:{height:26,padding:`0 8px`,fontSize:12},children:`Tag`}),(0,h.jsx)(`button`,{className:`btn ghost`,style:{height:26,padding:`0 8px`,fontSize:12,color:`var(--danger)`},children:`Archive`}),(0,h.jsx)(`button`,{onClick:()=>r(new Set),style:{marginInlineStart:`auto`,border:0,background:`transparent`,color:`var(--fg-muted)`,fontSize:12,cursor:`pointer`,padding:`4px 8px`,borderRadius:4},children:`Clear`})]}),(0,h.jsxs)(a,{fullWidth:!0,"aria-label":`Services — search, sort, select`,style:n.size>0?{borderRadius:`0 0 8px 8px`}:void 0,children:[(0,h.jsx)(d,{children:(0,h.jsxs)(p,{children:[(0,h.jsx)(i,{style:{width:40},children:(0,h.jsx)(u,{checked:f,indeterminate:_,onChange:s,"aria-label":`Select all rows`})}),(0,h.jsx)(i,{sortable:!0,sortDirection:y(`name`),onSort:v(`name`),children:`Service`}),(0,h.jsx)(i,{sortable:!0,sortDirection:y(`tier`),onSort:v(`tier`),children:`Tier`}),(0,h.jsx)(i,{sortable:!0,sortDirection:y(`lang`),onSort:v(`lang`),children:`Language`}),(0,h.jsx)(i,{sortable:!0,sortDirection:y(`p95`),onSort:v(`p95`),align:`end`,children:`p95`})]})}),(0,h.jsx)(c,{children:b.map(e=>(0,h.jsxs)(p,{selected:n.has(e.id),onClick:o(e.id),style:{cursor:`pointer`},children:[(0,h.jsx)(l,{onClick:e=>e.stopPropagation(),children:(0,h.jsx)(u,{checked:n.has(e.id),onChange:o(e.id),"aria-label":`Select ${e.name}`})}),(0,h.jsx)(l,{style:{fontWeight:500},children:e.name}),(0,h.jsx)(l,{children:e.tier}),(0,h.jsx)(l,{children:e.lang}),(0,h.jsxs)(l,{align:`end`,style:{fontFamily:`var(--font-mono)`,fontVariantNumeric:`tabular-nums`},children:[e.p95,`ms`]})]},e.id))})]})]})}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: args => <Table {...args} aria-label="Services">
      <TableCaption>Service health overview</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Service</TableHead>
          <TableHead>Tier</TableHead>
          <TableHead>Language</TableHead>
          <TableHead align="end">p95</TableHead>
          <TableHead align="end">Coverage</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {SERVICES.map(s => <TableRow key={s.id}>
            <TableCell style={{
          fontWeight: 500
        }}>{s.name}</TableCell>
            <TableCell>{s.tier}</TableCell>
            <TableCell>{s.lang}</TableCell>
            <TableCell align="end" style={{
          fontFamily: 'var(--font-mono)',
          fontVariantNumeric: 'tabular-nums'
        }}>{s.p95}ms</TableCell>
            <TableCell align="end" style={{
          fontFamily: 'var(--font-mono)',
          fontVariantNumeric: 'tabular-nums'
        }}>{s.coverage}%</TableCell>
          </TableRow>)}
      </TableBody>
    </Table>
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => {
    const rows = SERVICES.slice(0, 3);
    const SimpleTable = ({
      density,
      label
    }: {
      density?: 'comfortable' | 'compact';
      label: string;
    }) => <div>
        <div style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: 'var(--fg-faint)',
        marginBottom: 8
      }}>{label}</div>
        <Table density={density} fullWidth>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead align="end">p95</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(s => <TableRow key={s.id}>
                <TableCell style={{
              fontWeight: 500
            }}>{s.name}</TableCell>
                <TableCell>{s.tier}</TableCell>
                <TableCell align="end" style={{
              fontFamily: 'var(--font-mono)'
            }}>{s.p95}ms</TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </div>;
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }}>
        <SimpleTable density="compact" label="compact — 6/10 px · ops dashboards" />
        <SimpleTable density={undefined} label="default — 10/12 px · standard lists" />
        <SimpleTable density="comfortable" label="comfortable — 14/16 px · audit / billing" />
      </div>;
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [sort, setSort] = React.useState<{
      key: keyof typeof SERVICES[0];
      dir: 'asc' | 'desc';
    }>({
      key: 'p95',
      dir: 'asc'
    });
    const toggle = (key: keyof typeof SERVICES[0]) => () => {
      setSort(s => ({
        key,
        dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc'
      }));
    };
    const sorted = [...SERVICES].sort((a, b) => {
      const va = a[sort.key];
      const vb = b[sort.key];
      const cmp = typeof va === 'number' ? (va as number) - (vb as number) : String(va).localeCompare(String(vb));
      return sort.dir === 'asc' ? cmp : -cmp;
    });
    const dir = (key: keyof typeof SERVICES[0]) => sort.key === key ? sort.dir : 'none' as const;
    return <Table fullWidth aria-label="Services — sortable">
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection={dir('name')} onSort={toggle('name')}>Service</TableHead>
            <TableHead sortable sortDirection={dir('tier')} onSort={toggle('tier')}>Tier</TableHead>
            <TableHead sortable sortDirection={dir('lang')} onSort={toggle('lang')}>Language</TableHead>
            <TableHead sortable sortDirection={dir('p95')} onSort={toggle('p95')} align="end">p95</TableHead>
            <TableHead sortable sortDirection={dir('coverage')} onSort={toggle('coverage')} align="end">Coverage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map(s => <TableRow key={s.id}>
              <TableCell style={{
            fontWeight: 500
          }}>{s.name}</TableCell>
              <TableCell>{s.tier}</TableCell>
              <TableCell>{s.lang}</TableCell>
              <TableCell align="end" style={{
            fontFamily: 'var(--font-mono)',
            fontVariantNumeric: 'tabular-nums'
          }}>{s.p95}ms</TableCell>
              <TableCell align="end" style={{
            fontFamily: 'var(--font-mono)',
            fontVariantNumeric: 'tabular-nums'
          }}>{s.coverage}%</TableCell>
            </TableRow>)}
        </TableBody>
      </Table>;
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <Table fullWidth aria-label="Services with status">
      <TableHeader>
        <TableRow>
          <TableHead>Service</TableHead>
          <TableHead>Tier</TableHead>
          <TableHead>Status</TableHead>
          <TableHead align="end">p95</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell style={{
          fontWeight: 500
        }}>identity-svc</TableCell>
          <TableCell>T1</TableCell>
          <TableCell style={{
          color: 'var(--success)'
        }}>Healthy</TableCell>
          <TableCell align="end" style={{
          fontFamily: 'var(--font-mono)'
        }}>142ms</TableCell>
        </TableRow>
        <TableRow status="warn">
          <TableCell style={{
          fontWeight: 500
        }}>fraud-engine</TableCell>
          <TableCell>T1</TableCell>
          <TableCell style={{
          color: 'var(--warning)'
        }}>Degraded</TableCell>
          <TableCell align="end" style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--warning)'
        }}>312ms</TableCell>
        </TableRow>
        <TableRow status="danger">
          <TableCell style={{
          fontWeight: 500
        }}>bureau-gateway</TableCell>
          <TableCell>T1</TableCell>
          <TableCell style={{
          color: 'var(--danger)'
        }}>Failing</TableCell>
          <TableCell align="end" style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--danger)'
        }}>2100ms</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{
          fontWeight: 500
        }}>ledger-svc</TableCell>
          <TableCell>T2</TableCell>
          <TableCell style={{
          color: 'var(--success)'
        }}>Healthy</TableCell>
          <TableCell align="end" style={{
          fontFamily: 'var(--font-mono)'
        }}>24ms</TableCell>
        </TableRow>
      </TableBody>
    </Table>
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [sel, setSel] = React.useState(new Set(['s2', 's4']));
    const toggle = (id: string) => () => {
      setSel(prev => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    };
    return <Table fullWidth aria-label="Services — selectable">
        <TableHeader>
          <TableRow>
            <TableHead style={{
            width: 40
          }}>Sel</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead align="end">p95</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {SERVICES.map(s => <TableRow key={s.id} selected={sel.has(s.id)} onClick={toggle(s.id)} style={{
          cursor: 'pointer'
        }} aria-selected={sel.has(s.id)}>
              <TableCell onClick={e => e.stopPropagation()}>
                <Checkbox checked={sel.has(s.id)} onChange={toggle(s.id)} aria-label={\`Select \${s.name}\`} />
              </TableCell>
              <TableCell style={{
            fontWeight: 500
          }}>{s.name}</TableCell>
              <TableCell>{s.tier}</TableCell>
              <TableCell align="end" style={{
            fontFamily: 'var(--font-mono)'
          }}>{s.p95}ms</TableCell>
            </TableRow>)}
        </TableBody>
      </Table>;
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <Table fullWidth zebra aria-label="Services — striped">
      <TableHeader>
        <TableRow>
          <TableHead>Service</TableHead>
          <TableHead>Tier</TableHead>
          <TableHead align="end">p95</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {SERVICES.map(s => <TableRow key={s.id}>
            <TableCell style={{
          fontWeight: 500
        }}>{s.name}</TableCell>
            <TableCell>{s.tier}</TableCell>
            <TableCell align="end" style={{
          fontFamily: 'var(--font-mono)'
        }}>{s.p95}ms</TableCell>
          </TableRow>)}
      </TableBody>
    </Table>
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => {
    const avgP95 = Math.round(SERVICES.reduce((s, r) => s + r.p95, 0) / SERVICES.length);
    const avgCov = Math.round(SERVICES.reduce((s, r) => s + r.coverage, 0) / SERVICES.length);
    return <Table fullWidth aria-label="Services with summary footer">
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead align="end">p95</TableHead>
            <TableHead align="end">Coverage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {SERVICES.map(s => <TableRow key={s.id}>
              <TableCell style={{
            fontWeight: 500
          }}>{s.name}</TableCell>
              <TableCell>{s.tier}</TableCell>
              <TableCell align="end" style={{
            fontFamily: 'var(--font-mono)'
          }}>{s.p95}ms</TableCell>
              <TableCell align="end" style={{
            fontFamily: 'var(--font-mono)'
          }}>{s.coverage}%</TableCell>
            </TableRow>)}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2} style={{
            fontWeight: 600,
            color: 'var(--fg-subtle)',
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontFamily: 'var(--font-mono)'
          }}>Averages</TableCell>
            <TableCell align="end" style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 600
          }}>{avgP95}ms</TableCell>
            <TableCell align="end" style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 600
          }}>{avgCov}%</TableCell>
          </TableRow>
        </TableFooter>
      </Table>;
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => <div dir="rtl">
      <Table fullWidth aria-label="الخدمات">
        <TableCaption>نظرة عامة على صحة الخدمة</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>الخدمة</TableHead>
            <TableHead>الفئة</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead align="end">p95</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell style={{
            fontWeight: 500
          }}>identity-svc</TableCell>
            <TableCell>T1</TableCell>
            <TableCell style={{
            color: 'var(--success)'
          }}>سليم</TableCell>
            <TableCell align="end" style={{
            fontFamily: 'var(--font-mono)'
          }}>١٤٢ مللي</TableCell>
          </TableRow>
          <TableRow status="warn">
            <TableCell style={{
            fontWeight: 500
          }}>fraud-engine</TableCell>
            <TableCell>T1</TableCell>
            <TableCell style={{
            color: 'var(--warning)'
          }}>متدهور</TableCell>
            <TableCell align="end" style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--warning)'
          }}>٣١٢ مللي</TableCell>
          </TableRow>
          <TableRow status="danger">
            <TableCell style={{
            fontWeight: 500
          }}>bureau-gateway</TableCell>
            <TableCell>T1</TableCell>
            <TableCell style={{
            color: 'var(--danger)'
          }}>فاشل</TableCell>
            <TableCell align="end" style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--danger)'
          }}>٢١٠٠ مللي</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [sort, setSort] = React.useState<{
      key: keyof typeof SERVICES[0];
      dir: 'asc' | 'desc';
    }>({
      key: 'name',
      dir: 'asc'
    });
    const [sel, setSel] = React.useState(new Set<string>());
    const toggleRow = (id: string) => () => setSel(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    const toggleAll = () => setSel(sel.size === SERVICES.length ? new Set() : new Set(SERVICES.map(s => s.id)));
    const allOn = sel.size === SERVICES.length;
    const someOn = sel.size > 0 && !allOn;
    const toggleSort = (key: keyof typeof SERVICES[0]) => () => setSort(s => ({
      key,
      dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc'
    }));
    const dir = (key: keyof typeof SERVICES[0]) => sort.key === key ? sort.dir : 'none' as const;
    const rows = [...SERVICES].sort((a, b) => {
      const va = a[sort.key];
      const vb = b[sort.key];
      const cmp = typeof va === 'number' ? (va as number) - (vb as number) : String(va).localeCompare(String(vb));
      return sort.dir === 'asc' ? cmp : -cmp;
    });
    return <div>
        {sel.size > 0 && <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 12px',
        background: 'var(--ember-soft)',
        border: '1px solid rgba(255,107,53,0.35)',
        borderBottom: 'none',
        borderRadius: '8px 8px 0 0'
      }}>
            <span style={{
          color: 'var(--ember)',
          fontWeight: 600,
          fontSize: 13
        }}>{sel.size} selected</span>
            <span style={{
          width: 1,
          height: 16,
          background: 'rgba(255,107,53,0.3)'
        }} />
            <button className="btn ghost" style={{
          height: 26,
          padding: '0 8px',
          fontSize: 12
        }}>Tag</button>
            <button className="btn ghost" style={{
          height: 26,
          padding: '0 8px',
          fontSize: 12,
          color: 'var(--danger)'
        }}>Archive</button>
            <button onClick={() => setSel(new Set())} style={{
          marginInlineStart: 'auto',
          border: 0,
          background: 'transparent',
          color: 'var(--fg-muted)',
          fontSize: 12,
          cursor: 'pointer',
          padding: '4px 8px',
          borderRadius: 4
        }}>
              Clear
            </button>
          </div>}
        <Table fullWidth aria-label="Services — search, sort, select" style={sel.size > 0 ? {
        borderRadius: '0 0 8px 8px'
      } : undefined}>
          <TableHeader>
            <TableRow>
              <TableHead style={{
              width: 40
            }}>
                <Checkbox checked={allOn} indeterminate={someOn} onChange={toggleAll} aria-label="Select all rows" />
              </TableHead>
              <TableHead sortable sortDirection={dir('name')} onSort={toggleSort('name')}>Service</TableHead>
              <TableHead sortable sortDirection={dir('tier')} onSort={toggleSort('tier')}>Tier</TableHead>
              <TableHead sortable sortDirection={dir('lang')} onSort={toggleSort('lang')}>Language</TableHead>
              <TableHead sortable sortDirection={dir('p95')} onSort={toggleSort('p95')} align="end">p95</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(s => <TableRow key={s.id} selected={sel.has(s.id)} onClick={toggleRow(s.id)} style={{
            cursor: 'pointer'
          }}>
                <TableCell onClick={e => e.stopPropagation()}>
                  <Checkbox checked={sel.has(s.id)} onChange={toggleRow(s.id)} aria-label={\`Select \${s.name}\`} />
                </TableCell>
                <TableCell style={{
              fontWeight: 500
            }}>{s.name}</TableCell>
                <TableCell>{s.tier}</TableCell>
                <TableCell>{s.lang}</TableCell>
                <TableCell align="end" style={{
              fontFamily: 'var(--font-mono)',
              fontVariantNumeric: 'tabular-nums'
            }}>{s.p95}ms</TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </div>;
  }
}`,...E.parameters?.docs?.source}}},D=[`Default`,`Density`,`Sortable`,`RowStatus`,`Selected`,`Zebra`,`WithFooter`,`RTL`,`InContext`]}))();export{v as Default,y as Density,E as InContext,T as RTL,x as RowStatus,S as Selected,b as Sortable,w as WithFooter,C as Zebra,D as __namedExportsOrder,_ as default};