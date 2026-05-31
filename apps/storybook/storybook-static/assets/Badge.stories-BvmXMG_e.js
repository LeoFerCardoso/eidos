import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{t as r,za as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u,d,f,p;e((()=>{t(),r(),a=n(),o={title:`Primitives/Badge`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:"Count badge — a compact ~18px inline counter that rides next to a nav label, tab title, or icon button. Three tones signal state (new, success, warning, danger) and a dot variant acts as a presence indicator without a number. Use `pushEnd` to hug the trailing edge of a flex nav row."}}},args:{tone:`neutral`,size:`md`,dot:!1,pushEnd:!1,children:`12`},argTypes:{tone:{control:`inline-radio`,options:[`neutral`,`new`,`success`,`warning`,`danger`]},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]},dot:{control:`boolean`},pushEnd:{control:`boolean`},children:{control:`text`}}},s={args:{tone:`neutral`,children:`12`}},c={name:`Variants — Tones`,render:()=>(0,a.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:12,alignItems:`center`},children:[(0,a.jsxs)(`span`,{style:{display:`inline-flex`,alignItems:`center`,gap:6},children:[(0,a.jsx)(i,{tone:`neutral`,children:`42`}),(0,a.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:`neutral`})]}),(0,a.jsxs)(`span`,{style:{display:`inline-flex`,alignItems:`center`,gap:6},children:[(0,a.jsx)(i,{tone:`new`,children:`3`}),(0,a.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:`new`})]}),(0,a.jsxs)(`span`,{style:{display:`inline-flex`,alignItems:`center`,gap:6},children:[(0,a.jsx)(i,{tone:`success`,children:`142`}),(0,a.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:`success`})]}),(0,a.jsxs)(`span`,{style:{display:`inline-flex`,alignItems:`center`,gap:6},children:[(0,a.jsx)(i,{tone:`warning`,children:`5`}),(0,a.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:`warning`})]}),(0,a.jsxs)(`span`,{style:{display:`inline-flex`,alignItems:`center`,gap:6},children:[(0,a.jsx)(i,{tone:`danger`,children:`2`}),(0,a.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:`danger`})]})]})},l={name:`Sizes`,render:()=>(0,a.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:14,alignItems:`center`},children:[(0,a.jsxs)(`span`,{style:{display:`inline-flex`,alignItems:`center`,gap:6},children:[(0,a.jsx)(i,{size:`sm`,tone:`new`,children:`99+`}),(0,a.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:`sm`})]}),(0,a.jsxs)(`span`,{style:{display:`inline-flex`,alignItems:`center`,gap:6},children:[(0,a.jsx)(i,{size:`md`,tone:`new`,children:`99+`}),(0,a.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:`md (default)`})]}),(0,a.jsxs)(`span`,{style:{display:`inline-flex`,alignItems:`center`,gap:6},children:[(0,a.jsx)(i,{size:`lg`,tone:`new`,children:`99+`}),(0,a.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:`lg`})]})]})},u={name:`Dot — Presence Indicator`,render:()=>(0,a.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:14,alignItems:`center`},children:[(0,a.jsxs)(`span`,{style:{display:`inline-flex`,alignItems:`center`,gap:6},children:[(0,a.jsx)(i,{dot:!0,tone:`new`}),(0,a.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:`new`})]}),(0,a.jsxs)(`span`,{style:{display:`inline-flex`,alignItems:`center`,gap:6},children:[(0,a.jsx)(i,{dot:!0,tone:`success`}),(0,a.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:`success`})]}),(0,a.jsxs)(`span`,{style:{display:`inline-flex`,alignItems:`center`,gap:6},children:[(0,a.jsx)(i,{dot:!0,tone:`warning`}),(0,a.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:`warning`})]}),(0,a.jsxs)(`span`,{style:{display:`inline-flex`,alignItems:`center`,gap:6},children:[(0,a.jsx)(i,{dot:!0,tone:`danger`}),(0,a.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:`danger`})]}),(0,a.jsxs)(`span`,{style:{display:`inline-flex`,alignItems:`center`,gap:6},children:[(0,a.jsx)(i,{dot:!0,tone:`neutral`}),(0,a.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:`neutral`})]})]})},d={name:`pushEnd — Nav Row`,render:()=>(0,a.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:2,width:240,padding:8,background:`var(--bg-elevated)`,border:`1px solid var(--border)`,borderRadius:10},children:[{label:`Overview`,badge:null},{label:`Alerts`,badge:{count:`5`,tone:`danger`}},{label:`Pull requests`,badge:{count:`12`,tone:`new`}},{label:`Deployments`,badge:{count:`3`,tone:`warning`}},{label:`Discussions`,badge:{count:`99+`,tone:`neutral`}},{label:`Settings`,badge:null}].map(({label:e,badge:t})=>(0,a.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,padding:`6px 8px`,borderRadius:6},children:[(0,a.jsx)(`span`,{style:{fontSize:13,color:`var(--fg)`},children:e}),t&&(0,a.jsx)(i,{tone:t.tone,pushEnd:!0,children:t.count})]},e))})},f={name:`RTL`,render:()=>(0,a.jsx)(`div`,{dir:`rtl`,children:(0,a.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:2,width:240,padding:8,background:`var(--bg-elevated)`,border:`1px solid var(--border)`,borderRadius:10},children:[{label:`نظرة عامة`,badge:null},{label:`التنبيهات`,badge:{count:`5`,tone:`danger`}},{label:`طلبات السحب`,badge:{count:`12`,tone:`new`}},{label:`النشر`,badge:{count:`3`,tone:`warning`}},{label:`المناقشات`,badge:{count:`99+`,tone:`neutral`}}].map(({label:e,badge:t})=>(0,a.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,padding:`6px 8px`,borderRadius:6},children:[(0,a.jsx)(`span`,{style:{fontSize:13,color:`var(--fg)`},children:e}),t&&(0,a.jsx)(i,{tone:t.tone,pushEnd:!0,children:t.count})]},e))})})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    tone: 'neutral',
    children: '12'
  }
}`,...s.parameters?.docs?.source},description:{story:`Default neutral badge driven by controls.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: 'Variants — Tones',
  render: () => <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center'
  }}>
      <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }}>
        <Badge tone="neutral">42</Badge>
        <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)'
      }}>neutral</code>
      </span>
      <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }}>
        <Badge tone="new">3</Badge>
        <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)'
      }}>new</code>
      </span>
      <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }}>
        <Badge tone="success">142</Badge>
        <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)'
      }}>success</code>
      </span>
      <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }}>
        <Badge tone="warning">5</Badge>
        <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)'
      }}>warning</code>
      </span>
      <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }}>
        <Badge tone="danger">2</Badge>
        <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)'
      }}>danger</code>
      </span>
    </div>
}`,...c.parameters?.docs?.source},description:{story:`All five tones at the default (md) size.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: 'Sizes',
  render: () => <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 14,
    alignItems: 'center'
  }}>
      <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }}>
        <Badge size="sm" tone="new">99+</Badge>
        <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)'
      }}>sm</code>
      </span>
      <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }}>
        <Badge size="md" tone="new">99+</Badge>
        <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)'
      }}>md (default)</code>
      </span>
      <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }}>
        <Badge size="lg" tone="new">99+</Badge>
        <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)'
      }}>lg</code>
      </span>
    </div>
}`,...l.parameters?.docs?.source},description:{story:`Three sizes — sm 14px, md 18px (default), lg 22px.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: 'Dot — Presence Indicator',
  render: () => <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 14,
    alignItems: 'center'
  }}>
      <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }}>
        <Badge dot tone="new" />
        <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)'
      }}>new</code>
      </span>
      <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }}>
        <Badge dot tone="success" />
        <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)'
      }}>success</code>
      </span>
      <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }}>
        <Badge dot tone="warning" />
        <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)'
      }}>warning</code>
      </span>
      <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }}>
        <Badge dot tone="danger" />
        <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)'
      }}>danger</code>
      </span>
      <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }}>
        <Badge dot tone="neutral" />
        <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)'
      }}>neutral</code>
      </span>
    </div>
}`,...u.parameters?.docs?.source},description:{story:`Dot variant — presence indicator with no numeric content.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: 'pushEnd — Nav Row',
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    width: 240,
    padding: 8,
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 10
  }}>
      {([{
      label: 'Overview',
      badge: null
    }, {
      label: 'Alerts',
      badge: {
        count: '5',
        tone: 'danger' as const
      }
    }, {
      label: 'Pull requests',
      badge: {
        count: '12',
        tone: 'new' as const
      }
    }, {
      label: 'Deployments',
      badge: {
        count: '3',
        tone: 'warning' as const
      }
    }, {
      label: 'Discussions',
      badge: {
        count: '99+',
        tone: 'neutral' as const
      }
    }, {
      label: 'Settings',
      badge: null
    }] as Array<{
      label: string;
      badge: {
        count: string;
        tone: 'danger' | 'new' | 'warning' | 'neutral';
      } | null;
    }>).map(({
      label,
      badge
    }) => <div key={label} style={{
      display: 'flex',
      alignItems: 'center',
      padding: '6px 8px',
      borderRadius: 6
    }}>
          <span style={{
        fontSize: 13,
        color: 'var(--fg)'
      }}>{label}</span>
          {badge && <Badge tone={badge.tone} pushEnd>
              {badge.count}
            </Badge>}
        </div>)}
    </div>
}`,...d.parameters?.docs?.source},description:{story:`pushEnd — badge hugs the trailing edge of a flex nav row via
\`margin-inline-start: auto\`. Simulates a sidebar navigation list
with counts on routes that have activity.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: 'RTL',
  render: () => <div dir="rtl">
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      width: 240,
      padding: 8,
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 10
    }}>
        {([{
        label: 'نظرة عامة',
        badge: null
      }, {
        label: 'التنبيهات',
        badge: {
          count: '5',
          tone: 'danger' as const
        }
      }, {
        label: 'طلبات السحب',
        badge: {
          count: '12',
          tone: 'new' as const
        }
      }, {
        label: 'النشر',
        badge: {
          count: '3',
          tone: 'warning' as const
        }
      }, {
        label: 'المناقشات',
        badge: {
          count: '99+',
          tone: 'neutral' as const
        }
      }] as Array<{
        label: string;
        badge: {
          count: string;
          tone: 'danger' | 'new' | 'warning' | 'neutral';
        } | null;
      }>).map(({
        label,
        badge
      }) => <div key={label} style={{
        display: 'flex',
        alignItems: 'center',
        padding: '6px 8px',
        borderRadius: 6
      }}>
            <span style={{
          fontSize: 13,
          color: 'var(--fg)'
        }}>{label}</span>
            {badge && <Badge tone={badge.tone} pushEnd>
                {badge.count}
              </Badge>}
          </div>)}
      </div>
    </div>
}`,...f.parameters?.docs?.source},description:{story:`RTL — badge flips to the logical start side in a right-to-left layout.`,...f.parameters?.docs?.description}}},p=[`Default`,`Variants`,`Sizes`,`DotVariant`,`PushEnd`,`RTL`]}))();export{s as Default,u as DotVariant,d as PushEnd,f as RTL,l as Sizes,c as Variants,p as __namedExportsOrder,o as default};