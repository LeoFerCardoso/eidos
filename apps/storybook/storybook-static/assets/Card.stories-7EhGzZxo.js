import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{B as i,G as a,H as o,K as s,U as c,V as l,W as u,t as d}from"./src-DgoylXRw.js";var f,p,m,h,g,_,v,y,b,x,S,C,w,T;e((()=>{f=t(n(),1),d(),p=r(),m={title:`Elements/Card`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:"Generic slotted surface. Compound: Card > CardMedia? + CardHeader(CardTitle + CardDescription) + CardContent + CardContent + CardFooter. Three variants (outline · elevated · ghost) and two densities (default · compact). When the whole card is interactive, pass `interactive` and wrap in an `<a>` — do NOT nest separate focusable controls inside."}}},args:{variant:`outline`,compact:!1,interactive:!1},argTypes:{variant:{control:`inline-radio`,options:[`outline`,`elevated`,`ghost`]},compact:{control:`boolean`},interactive:{control:`boolean`}}},h={render:e=>(0,p.jsxs)(i,{...e,style:{width:360},children:[(0,p.jsxs)(u,{children:[(0,p.jsx)(s,{children:`Service health`}),(0,p.jsx)(o,{children:`Uptime over the last 30 days.`})]}),(0,p.jsxs)(l,{children:[(0,p.jsx)(`strong`,{style:{color:`var(--fg)`},children:`99.94%`}),` — well within SLO. The single-minute outage on Sept 3 was during a planned migration.`]}),(0,p.jsxs)(c,{actions:!0,children:[(0,p.jsx)(`button`,{className:`btn ghost`,children:`Skip`}),(0,p.jsx)(`button`,{className:`btn ember`,children:`Open service`})]})]})},g={render:()=>(0,p.jsx)(`div`,{style:{display:`flex`,gap:20,flexWrap:`wrap`,alignItems:`flex-start`},children:[`outline`,`elevated`,`ghost`].map(e=>(0,p.jsxs)(i,{variant:e,style:{width:260},children:[(0,p.jsxs)(u,{children:[(0,p.jsx)(s,{children:e[0].toUpperCase()+e.slice(1)}),(0,p.jsxs)(o,{children:[`variant="`,e,`"`]})]}),(0,p.jsx)(l,{children:`Supplementary body text for this variant.`})]},e))})},_={render:()=>(0,p.jsx)(`div`,{style:{display:`grid`,gap:12,gridTemplateColumns:`repeat(auto-fit, minmax(160px, 1fr))`,width:`100%`,maxWidth:680},children:[{label:`Uptime`,value:`99.94%`,sub:`over 30 days`},{label:`p50 latency`,value:`12ms`,sub:`edge regions`},{label:`Deploys`,value:`12`,sub:`this month`},{label:`Active runbooks`,value:`4`,sub:`all linked`}].map(e=>(0,p.jsxs)(i,{compact:!0,children:[(0,p.jsxs)(u,{children:[(0,p.jsx)(`p`,{style:{fontFamily:`var(--font-mono)`,fontSize:`var(--text-xs)`,textTransform:`uppercase`,letterSpacing:`0.08em`,color:`var(--fg-faint)`,margin:0},children:e.label}),(0,p.jsx)(s,{as:`h3`,style:{fontSize:`var(--text-2xl)`,fontVariantNumeric:`tabular-nums`,letterSpacing:`-0.02em`,marginTop:4},children:e.value})]}),(0,p.jsx)(l,{style:{paddingTop:0,fontSize:`var(--text-base)`,color:`var(--fg-faint)`},children:e.sub})]},e.label))})},v={render:()=>(0,p.jsxs)(i,{style:{width:320},children:[(0,p.jsx)(a,{style:{height:160,background:`linear-gradient(135deg, var(--surface), var(--bg-elevated))`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontFamily:`var(--font-mono)`,fontSize:11,letterSpacing:`0.06em`,textTransform:`uppercase`,color:`var(--fg-faint)`},children:`SERVICE`}),(0,p.jsxs)(u,{children:[(0,p.jsx)(s,{children:`forge-api`}),(0,p.jsx)(o,{children:`Edge-deployed REST gateway. 4 regions.`})]}),(0,p.jsxs)(c,{children:[(0,p.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:`var(--text-base)`,color:`var(--fg-faint)`},children:`v2.14.0 · Sept 12`}),(0,p.jsx)(`button`,{className:`btn link`,style:{padding:`0 4px`},children:`Docs`})]})]})},y={render:()=>(0,p.jsx)(`div`,{style:{display:`grid`,gap:12,gridTemplateColumns:`repeat(auto-fit, minmax(200px, 1fr))`,width:`100%`,maxWidth:680},children:[{name:`forge-api`,desc:`REST gateway · 99.94% uptime`},{name:`forge-jobs`,desc:`Background workers · 12 active`},{name:`forge-ledger`,desc:`Event store · 3.2M events/day`}].map(e=>(0,p.jsx)(`a`,{href:`#`,onClick:e=>e.preventDefault(),style:{textDecoration:`none`},children:(0,p.jsx)(i,{interactive:!0,style:{height:`100%`},children:(0,p.jsxs)(u,{children:[(0,p.jsx)(s,{children:e.name}),(0,p.jsx)(o,{children:e.desc})]})})},e.name))})},b={render:()=>(0,p.jsxs)(i,{style:{width:`100%`,maxWidth:520},children:[(0,p.jsxs)(u,{row:!0,children:[(0,p.jsxs)(`div`,{children:[(0,p.jsx)(s,{children:`Recent deploys`}),(0,p.jsx)(o,{children:`Last 30 days · forge-api`})]}),(0,p.jsx)(`button`,{className:`btn xs`,children:`View all`})]}),(0,p.jsx)(l,{style:{paddingTop:4},children:(0,p.jsx)(`ul`,{style:{listStyle:`none`,padding:0,margin:0,fontSize:`var(--text-base)`,color:`var(--fg-muted)`},children:[{v:`v2.14.0`,d:`Sept 12`},{v:`v2.13.4`,d:`Sept 9`},{v:`v2.13.3`,d:`Sept 6`}].map((e,t,n)=>(0,p.jsxs)(`li`,{style:{display:`flex`,justifyContent:`space-between`,padding:`6px 0`,borderBottom:t<n.length-1?`1px solid var(--border)`:`none`},children:[(0,p.jsx)(`span`,{children:e.v}),(0,p.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,color:`var(--fg-faint)`},children:e.d})]},e.v))})})]})},x={args:{variant:`elevated`},render:e=>(0,p.jsxs)(i,{...e,style:{width:360},children:[(0,p.jsxs)(u,{children:[(0,p.jsx)(s,{children:`Incident #4821`}),(0,p.jsx)(o,{children:`forge-api · SEV-2 · Resolved`})]}),(0,p.jsx)(l,{children:`Latency spike on EU-West-1 node. Rollback deployed in 4 min.`}),(0,p.jsxs)(c,{actions:!0,children:[(0,p.jsx)(`button`,{className:`btn ghost`,children:`Archive`}),(0,p.jsx)(`button`,{className:`btn outline`,children:`View runbook`})]})]})},S={args:{variant:`ghost`},render:e=>(0,p.jsxs)(`div`,{className:`surface`,style:{padding:20,borderRadius:10,maxWidth:420},children:[(0,p.jsx)(`p`,{style:{fontFamily:`var(--font-mono)`,fontSize:`var(--text-xs)`,textTransform:`uppercase`,letterSpacing:`0.1em`,color:`var(--fg-faint)`,margin:`0 0 12px`},children:`Group`}),(0,p.jsxs)(i,{...e,children:[(0,p.jsxs)(u,{children:[(0,p.jsx)(s,{children:`forge-api`}),(0,p.jsx)(o,{children:`No extra elevation inside the group surface.`})]}),(0,p.jsx)(l,{children:`99.94% uptime · p50 12ms`})]})]})},C={render:()=>{let[e,t]=f.useState(`asc`);return(0,p.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:16,maxWidth:560},children:[(0,p.jsx)(`div`,{style:{display:`grid`,gap:12,gridTemplateColumns:`repeat(3, 1fr)`},children:[{l:`Uptime`,v:`99.94%`},{l:`p50`,v:`12ms`},{l:`Deploys`,v:`12`}].map(e=>(0,p.jsx)(i,{compact:!0,children:(0,p.jsxs)(u,{children:[(0,p.jsx)(`p`,{style:{fontFamily:`var(--font-mono)`,fontSize:`var(--text-xs)`,textTransform:`uppercase`,letterSpacing:`0.08em`,color:`var(--fg-faint)`,margin:0},children:e.l}),(0,p.jsx)(s,{style:{fontSize:`var(--text-2xl)`,fontVariantNumeric:`tabular-nums`,letterSpacing:`-0.02em`,marginTop:4},children:e.v})]})},e.l))}),(0,p.jsxs)(i,{children:[(0,p.jsxs)(u,{row:!0,children:[(0,p.jsxs)(`div`,{children:[(0,p.jsx)(s,{children:`Recent deploys`}),(0,p.jsx)(o,{children:`forge-api · last 30 days`})]}),(0,p.jsx)(`button`,{className:`btn xs outline`,onClick:()=>t(e=>e===`asc`?`desc`:`asc`),"aria-label":`Sort ${e===`asc`?`descending`:`ascending`}`,children:e===`asc`?`Oldest first`:`Newest first`})]}),(0,p.jsx)(l,{style:{paddingTop:4},children:(0,p.jsx)(`ul`,{style:{listStyle:`none`,padding:0,margin:0,fontSize:`var(--text-base)`,color:`var(--fg-muted)`},children:[{v:`v2.14.0`,d:`Sept 12`,status:`ok`},{v:`v2.13.4`,d:`Sept 9`,status:`ok`},{v:`v2.13.3`,d:`Sept 6`,status:`ok`}].sort((t,n)=>(e===`asc`?1:-1)*t.d.localeCompare(n.d)).map((e,t,n)=>(0,p.jsxs)(`li`,{style:{display:`flex`,justifyContent:`space-between`,padding:`6px 0`,borderBottom:t<n.length-1?`1px solid var(--border)`:`none`},children:[(0,p.jsx)(`span`,{children:e.v}),(0,p.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,color:`var(--fg-faint)`},children:e.d})]},e.v))})}),(0,p.jsxs)(c,{children:[(0,p.jsx)(`span`,{style:{fontSize:`var(--text-base)`,color:`var(--fg-faint)`},children:`Showing 3 of 12`}),(0,p.jsx)(`button`,{className:`btn link`,style:{padding:`0 4px`},children:`View all`})]})]})]})}},w={render:()=>(0,p.jsx)(`div`,{dir:`rtl`,style:{maxWidth:520},children:(0,p.jsxs)(i,{children:[(0,p.jsxs)(u,{row:!0,children:[(0,p.jsxs)(`div`,{children:[(0,p.jsx)(s,{children:`عمليات النشر الأخيرة`}),(0,p.jsx)(o,{children:`آخر ٣٠ يومًا · forge-api`})]}),(0,p.jsx)(`button`,{className:`btn xs`,children:`عرض الكل`})]}),(0,p.jsx)(l,{style:{paddingTop:4},children:(0,p.jsx)(`ul`,{style:{listStyle:`none`,padding:0,margin:0,fontSize:`var(--text-base)`,color:`var(--fg-muted)`},children:[{v:`v2.14.0`,d:`١٢ سبتمبر`},{v:`v2.13.4`,d:`٩ سبتمبر`},{v:`v2.13.3`,d:`٦ سبتمبر`}].map((e,t,n)=>(0,p.jsxs)(`li`,{style:{display:`flex`,justifyContent:`space-between`,padding:`6px 0`,borderBottom:t<n.length-1?`1px solid var(--border)`:`none`},children:[(0,p.jsx)(`span`,{children:e.v}),(0,p.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,color:`var(--fg-faint)`},children:e.d})]},e.v))})}),(0,p.jsxs)(c,{actions:!0,children:[(0,p.jsx)(`button`,{className:`btn ghost`,children:`إلغاء`}),(0,p.jsx)(`button`,{className:`btn ember`,children:`فتح الخدمة`})]})]})})},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <Card {...args} style={{
    width: 360
  }}>
      <CardHeader>
        <CardTitle>Service health</CardTitle>
        <CardDescription>Uptime over the last 30 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <strong style={{
        color: 'var(--fg)'
      }}>99.94%</strong> — well within SLO. The
        single-minute outage on Sept 3 was during a planned migration.
      </CardContent>
      <CardFooter actions>
        <button className="btn ghost">Skip</button>
        <button className="btn ember">Open service</button>
      </CardFooter>
    </Card>
}`,...h.parameters?.docs?.source},description:{story:`Basic card with header, body, and footer.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 20,
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  }}>
      {(['outline', 'elevated', 'ghost'] as const).map(variant => <Card key={variant} variant={variant} style={{
      width: 260
    }}>
          <CardHeader>
            <CardTitle>{variant[0].toUpperCase() + variant.slice(1)}</CardTitle>
            <CardDescription>variant="{variant}"</CardDescription>
          </CardHeader>
          <CardContent>Supplementary body text for this variant.</CardContent>
        </Card>)}
    </div>
}`,...g.parameters?.docs?.source},description:{story:`All three visual variants side by side.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gap: 12,
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    width: '100%',
    maxWidth: 680
  }}>
      {[{
      label: 'Uptime',
      value: '99.94%',
      sub: 'over 30 days'
    }, {
      label: 'p50 latency',
      value: '12ms',
      sub: 'edge regions'
    }, {
      label: 'Deploys',
      value: '12',
      sub: 'this month'
    }, {
      label: 'Active runbooks',
      value: '4',
      sub: 'all linked'
    }].map(s => <Card key={s.label} compact>
          <CardHeader>
            <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--fg-faint)',
          margin: 0
        }}>
              {s.label}
            </p>
            <CardTitle as="h3" style={{
          fontSize: 'var(--text-2xl)',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.02em',
          marginTop: 4
        }}>
              {s.value}
            </CardTitle>
          </CardHeader>
          <CardContent style={{
        paddingTop: 0,
        fontSize: 'var(--text-base)',
        color: 'var(--fg-faint)'
      }}>
            {s.sub}
          </CardContent>
        </Card>)}
    </div>
}`,..._.parameters?.docs?.source},description:{story:`Stat tiles use compact density + tabular heading.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <Card style={{
    width: 320
  }}>
      <CardMedia style={{
      height: 160,
      background: 'linear-gradient(135deg, var(--surface), var(--bg-elevated))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'var(--fg-faint)'
    }}>
        SERVICE
      </CardMedia>
      <CardHeader>
        <CardTitle>forge-api</CardTitle>
        <CardDescription>Edge-deployed REST gateway. 4 regions.</CardDescription>
      </CardHeader>
      <CardFooter>
        <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-base)',
        color: 'var(--fg-faint)'
      }}>
          v2.14.0 · Sept 12
        </span>
        <button className="btn link" style={{
        padding: '0 4px'
      }}>
          Docs
        </button>
      </CardFooter>
    </Card>
}`,...v.parameters?.docs?.source},description:{story:`CardMedia above the header — image, canvas, or a custom preview.`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gap: 12,
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    width: '100%',
    maxWidth: 680
  }}>
      {[{
      name: 'forge-api',
      desc: 'REST gateway · 99.94% uptime'
    }, {
      name: 'forge-jobs',
      desc: 'Background workers · 12 active'
    }, {
      name: 'forge-ledger',
      desc: 'Event store · 3.2M events/day'
    }].map(s => <a key={s.name} href="#" onClick={e => e.preventDefault()} style={{
      textDecoration: 'none'
    }}>
          <Card interactive style={{
        height: '100%'
      }}>
            <CardHeader>
              <CardTitle>{s.name}</CardTitle>
              <CardDescription>{s.desc}</CardDescription>
            </CardHeader>
          </Card>
        </a>)}
    </div>
}`,...y.parameters?.docs?.source},description:{story:`Whole-card link — single Tab stop, hover lift, focus ring around the entire surface.`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <Card style={{
    width: '100%',
    maxWidth: 520
  }}>
      <CardHeader row>
        <div>
          <CardTitle>Recent deploys</CardTitle>
          <CardDescription>Last 30 days · forge-api</CardDescription>
        </div>
        <button className="btn xs">View all</button>
      </CardHeader>
      <CardContent style={{
      paddingTop: 4
    }}>
        <ul style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        fontSize: 'var(--text-base)',
        color: 'var(--fg-muted)'
      }}>
          {[{
          v: 'v2.14.0',
          d: 'Sept 12'
        }, {
          v: 'v2.13.4',
          d: 'Sept 9'
        }, {
          v: 'v2.13.3',
          d: 'Sept 6'
        }].map((row, i, arr) => <li key={row.v} style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '6px 0',
          borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none'
        }}>
              <span>{row.v}</span>
              <span style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--fg-faint)'
          }}>{row.d}</span>
            </li>)}
        </ul>
      </CardContent>
    </Card>
}`,...b.parameters?.docs?.source},description:{story:`Title + description on the leading side, inline action on the trailing side.`,...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'elevated'
  },
  render: args => <Card {...args} style={{
    width: 360
  }}>
      <CardHeader>
        <CardTitle>Incident #4821</CardTitle>
        <CardDescription>forge-api · SEV-2 · Resolved</CardDescription>
      </CardHeader>
      <CardContent>Latency spike on EU-West-1 node. Rollback deployed in 4 min.</CardContent>
      <CardFooter actions>
        <button className="btn ghost">Archive</button>
        <button className="btn outline">View runbook</button>
      </CardFooter>
    </Card>
}`,...x.parameters?.docs?.source},description:{story:`Elevated variant — shadowlifted card, no visible border, for use on flat canvas.`,...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'ghost'
  },
  render: args => <div className="surface" style={{
    padding: 20,
    borderRadius: 10,
    maxWidth: 420
  }}>
      <p style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: 'var(--fg-faint)',
      margin: '0 0 12px'
    }}>
        Group
      </p>
      <Card {...args}>
        <CardHeader>
          <CardTitle>forge-api</CardTitle>
          <CardDescription>No extra elevation inside the group surface.</CardDescription>
        </CardHeader>
        <CardContent>99.94% uptime · p50 12ms</CardContent>
      </Card>
    </div>
}`,...S.parameters?.docs?.source},description:{story:`Ghost variant — no background, no border. Ideal inside an already-bounded region.`,...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      maxWidth: 560
    }}>
        {/* Stat row */}
        <div style={{
        display: 'grid',
        gap: 12,
        gridTemplateColumns: 'repeat(3, 1fr)'
      }}>
          {[{
          l: 'Uptime',
          v: '99.94%'
        }, {
          l: 'p50',
          v: '12ms'
        }, {
          l: 'Deploys',
          v: '12'
        }].map(s => <Card key={s.l} compact>
              <CardHeader>
                <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--fg-faint)',
              margin: 0
            }}>
                  {s.l}
                </p>
                <CardTitle style={{
              fontSize: 'var(--text-2xl)',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.02em',
              marginTop: 4
            }}>
                  {s.v}
                </CardTitle>
              </CardHeader>
            </Card>)}
        </div>

        {/* Deploy history */}
        <Card>
          <CardHeader row>
            <div>
              <CardTitle>Recent deploys</CardTitle>
              <CardDescription>forge-api · last 30 days</CardDescription>
            </div>
            <button className="btn xs outline" onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')} aria-label={\`Sort \${sortDir === 'asc' ? 'descending' : 'ascending'}\`}>
              {sortDir === 'asc' ? 'Oldest first' : 'Newest first'}
            </button>
          </CardHeader>
          <CardContent style={{
          paddingTop: 4
        }}>
            <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            fontSize: 'var(--text-base)',
            color: 'var(--fg-muted)'
          }}>
              {[{
              v: 'v2.14.0',
              d: 'Sept 12',
              status: 'ok'
            }, {
              v: 'v2.13.4',
              d: 'Sept 9',
              status: 'ok'
            }, {
              v: 'v2.13.3',
              d: 'Sept 6',
              status: 'ok'
            }].sort((a, b) => (sortDir === 'asc' ? 1 : -1) * a.d.localeCompare(b.d)).map((row, i, arr) => <li key={row.v} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '6px 0',
              borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none'
            }}>
                    <span>{row.v}</span>
                    <span style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--fg-faint)'
              }}>
                      {row.d}
                    </span>
                  </li>)}
            </ul>
          </CardContent>
          <CardFooter>
            <span style={{
            fontSize: 'var(--text-base)',
            color: 'var(--fg-faint)'
          }}>
              Showing 3 of 12
            </span>
            <button className="btn link" style={{
            padding: '0 4px'
          }}>
              View all
            </button>
          </CardFooter>
        </Card>
      </div>;
  }
}`,...C.parameters?.docs?.source},description:{story:`A realistic dashboard tile — stat grid + header action + footer metadata.`,...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => <div dir="rtl" style={{
    maxWidth: 520
  }}>
      <Card>
        <CardHeader row>
          <div>
            <CardTitle>عمليات النشر الأخيرة</CardTitle>
            <CardDescription>آخر ٣٠ يومًا · forge-api</CardDescription>
          </div>
          <button className="btn xs">عرض الكل</button>
        </CardHeader>
        <CardContent style={{
        paddingTop: 4
      }}>
          <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          fontSize: 'var(--text-base)',
          color: 'var(--fg-muted)'
        }}>
            {[{
            v: 'v2.14.0',
            d: '١٢ سبتمبر'
          }, {
            v: 'v2.13.4',
            d: '٩ سبتمبر'
          }, {
            v: 'v2.13.3',
            d: '٦ سبتمبر'
          }].map((row, i, arr) => <li key={row.v} style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '6px 0',
            borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none'
          }}>
                <span>{row.v}</span>
                <span style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--fg-faint)'
            }}>
                  {row.d}
                </span>
              </li>)}
          </ul>
        </CardContent>
        <CardFooter actions>
          <button className="btn ghost">إلغاء</button>
          <button className="btn ember">فتح الخدمة</button>
        </CardFooter>
      </Card>
    </div>
}`,...w.parameters?.docs?.source},description:{story:`dir="rtl" — logical padding and flex layout flip without any overrides.`,...w.parameters?.docs?.description}}},T=[`Default`,`Variants`,`Compact`,`WithMedia`,`Interactive`,`HeaderWithAction`,`ElevatedVariant`,`GhostVariant`,`InContext`,`RTL`]}))();export{_ as Compact,h as Default,x as ElevatedVariant,S as GhostVariant,b as HeaderWithAction,C as InContext,y as Interactive,w as RTL,g as Variants,v as WithMedia,T as __namedExportsOrder,m as default};