import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Va as i,Wa as a,t as o}from"./src-DgoylXRw.js";var s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S;e((()=>{s=t(n(),1),o(),c=r(),l={title:`Primitives/Pill`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:"State pill — rounded capsule (22 px) for service health, deploy state, incident severity, and run status. Supports a static dot, a live pulsing ring (use only while work is in-flight), a leading icon, and a trailing remove button. Choose `tone` from the base set (neutral/ember/success/warning/danger/ice) or a semantic family (severity-*, health-*, status-*, risk-*)."}}},args:{tone:`neutral`,live:!1,dot:!1},argTypes:{tone:{control:`select`,options:[`neutral`,`ember`,`success`,`warning`,`danger`,`ice`,`severity-p0`,`severity-p1`,`severity-p2`,`severity-p3`,`health-up`,`health-degraded`,`health-down`,`health-unknown`,`status-pending`,`status-running`,`status-done`,`status-error`,`status-skipped`,`risk-low`,`risk-med`,`risk-high`,`risk-crit`]},live:{control:`boolean`},dot:{control:`boolean`},onRemove:{action:`removed`}}},u={args:{children:`Deployed`}},d={args:{tone:`health-up`,dot:!0,children:`Healthy`}},f={args:{tone:`status-running`,live:!0,children:`Deploying`}},p={render:e=>(0,c.jsx)(i,{...e,tone:`status-error`,icon:(0,c.jsx)(a.incident,{size:12}),children:`Incident open`})},m={render:()=>{let[e,t]=s.useState([`forge-api`,`us-east-1`,`production`]);return(0,c.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:6},children:[e.map(e=>(0,c.jsx)(i,{tone:`ice`,onRemove:()=>t(t=>t.filter(t=>t!==e)),removeLabel:`Remove filter ${e}`,children:e},e)),e.length===0&&(0,c.jsx)(`button`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-muted)`,cursor:`pointer`},onClick:()=>t([`forge-api`,`us-east-1`,`production`]),children:`Restore filters`})]})}},h={render:()=>(0,c.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:8},children:[(0,c.jsx)(i,{tone:`neutral`,dot:!0,children:`Neutral`}),(0,c.jsx)(i,{tone:`success`,dot:!0,children:`Success`}),(0,c.jsx)(i,{tone:`warning`,dot:!0,children:`Warning`}),(0,c.jsx)(i,{tone:`danger`,dot:!0,children:`Danger`}),(0,c.jsx)(i,{tone:`ember`,dot:!0,children:`Ember`}),(0,c.jsx)(i,{tone:`ice`,dot:!0,children:`Ice`})]})},g={render:()=>(0,c.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:8},children:[(0,c.jsx)(i,{tone:`severity-p0`,dot:!0,children:`P0 · Critical`}),(0,c.jsx)(i,{tone:`severity-p1`,dot:!0,children:`P1 · High`}),(0,c.jsx)(i,{tone:`severity-p2`,dot:!0,children:`P2 · Medium`}),(0,c.jsx)(i,{tone:`severity-p3`,dot:!0,children:`P3 · Low`})]})},_={render:()=>(0,c.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:8},children:[(0,c.jsx)(i,{tone:`health-up`,dot:!0,children:`Healthy`}),(0,c.jsx)(i,{tone:`health-degraded`,dot:!0,children:`Degraded`}),(0,c.jsx)(i,{tone:`health-down`,dot:!0,children:`Down`}),(0,c.jsx)(i,{tone:`health-unknown`,dot:!0,children:`Unknown`})]})},v={render:()=>(0,c.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:8},children:[(0,c.jsx)(i,{tone:`status-pending`,dot:!0,children:`Pending`}),(0,c.jsx)(i,{tone:`status-running`,live:!0,children:`Running`}),(0,c.jsx)(i,{tone:`status-done`,dot:!0,children:`Done`}),(0,c.jsx)(i,{tone:`status-error`,dot:!0,children:`Error`}),(0,c.jsx)(i,{tone:`status-skipped`,dot:!0,children:`Skipped`})]})},y={render:()=>(0,c.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:8},children:[(0,c.jsx)(i,{tone:`risk-low`,dot:!0,children:`Low risk`}),(0,c.jsx)(i,{tone:`risk-med`,dot:!0,children:`Medium risk`}),(0,c.jsx)(i,{tone:`risk-high`,dot:!0,children:`High risk`}),(0,c.jsx)(i,{tone:`risk-crit`,dot:!0,children:`Critical risk`})]})},b={render:()=>(0,c.jsxs)(`div`,{dir:`rtl`,style:{display:`flex`,flexWrap:`wrap`,gap:8},children:[(0,c.jsx)(i,{tone:`health-up`,dot:!0,children:`بدون مشكلة`}),(0,c.jsx)(i,{tone:`status-running`,live:!0,children:`جارٍ النشر`}),(0,c.jsx)(i,{tone:`severity-p1`,dot:!0,children:`P1 · عالٍ`}),(0,c.jsx)(i,{tone:`ice`,onRemove:()=>{},removeLabel:`إزالة us-east-1`,children:`us-east-1`})]})},x={render:()=>{let[e,t]=s.useState([]),n=e=>t(t=>t.includes(e)?t.filter(t=>t!==e):[...t,e]);return(0,c.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:16},children:[(0,c.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:8,alignItems:`center`},children:[(0,c.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`,minWidth:90},children:`base`}),(0,c.jsx)(i,{tone:`neutral`,children:`Neutral`}),(0,c.jsx)(i,{tone:`success`,dot:!0,children:`Operational`}),(0,c.jsx)(i,{tone:`warning`,dot:!0,children:`Degraded`}),(0,c.jsx)(i,{tone:`danger`,dot:!0,children:`Outage`}),(0,c.jsx)(i,{tone:`ember`,dot:!0,children:`Beta`}),(0,c.jsx)(i,{tone:`ice`,dot:!0,children:`Preview`})]}),(0,c.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:8,alignItems:`center`},children:[(0,c.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`,minWidth:90},children:`status`}),(0,c.jsx)(i,{tone:`status-pending`,dot:!0,children:`Queued`}),(0,c.jsx)(i,{tone:`status-running`,live:!0,children:`Building`}),(0,c.jsx)(i,{tone:`status-done`,dot:!0,children:`Deployed`}),(0,c.jsx)(i,{tone:`status-error`,dot:!0,children:`Failed`}),(0,c.jsx)(i,{tone:`status-skipped`,dot:!0,children:`Skipped`})]}),(0,c.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:8,alignItems:`center`},children:[(0,c.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`,minWidth:90},children:`health`}),(0,c.jsx)(i,{tone:`health-up`,dot:!0,children:`forge-api`}),(0,c.jsx)(i,{tone:`health-degraded`,dot:!0,children:`forge-auth`}),(0,c.jsx)(i,{tone:`health-down`,dot:!0,children:`forge-cdn`}),(0,c.jsx)(i,{tone:`health-unknown`,dot:!0,children:`forge-mq`})]}),(0,c.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:8,alignItems:`center`},children:[(0,c.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`,minWidth:90},children:`severity`}),(0,c.jsx)(i,{tone:`severity-p0`,icon:(0,c.jsx)(a.incident,{size:12}),children:`SEV-1 · DB write failure`}),(0,c.jsx)(i,{tone:`severity-p1`,dot:!0,children:`SEV-2 · Latency spike`}),(0,c.jsx)(i,{tone:`severity-p2`,dot:!0,children:`SEV-3 · Retry storm`}),(0,c.jsx)(i,{tone:`severity-p3`,dot:!0,children:`SEV-4 · UI lag`})]}),(0,c.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:8,alignItems:`center`},children:[(0,c.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`,minWidth:90},children:`risk`}),(0,c.jsx)(i,{tone:`risk-low`,dot:!0,children:`Low`}),(0,c.jsx)(i,{tone:`risk-med`,dot:!0,children:`Medium`}),(0,c.jsx)(i,{tone:`risk-high`,dot:!0,children:`High`}),(0,c.jsx)(i,{tone:`risk-crit`,dot:!0,children:`Critical`})]}),(0,c.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:8,alignItems:`center`},children:[(0,c.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`,minWidth:90},children:`removable`}),[`region:us-east-1`,`env:production`,`team:platform`].map(t=>e.includes(t)?null:(0,c.jsx)(i,{tone:`ice`,onRemove:()=>n(t),removeLabel:`Remove ${t}`,children:t},t)),e.length>0&&(0,c.jsx)(`button`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`,cursor:`pointer`,background:`none`,border:`none`,padding:0},onClick:()=>t([]),children:`reset`})]})]})}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Deployed'
  }
}`,...u.parameters?.docs?.source},description:{story:`Default state pill — neutral tone, no decoration.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    tone: 'health-up',
    dot: true,
    children: 'Healthy'
  }
}`,...d.parameters?.docs?.source},description:{story:"Static dot shown with `dot` prop.",...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    tone: 'status-running',
    live: true,
    children: 'Deploying'
  }
}`,...f.parameters?.docs?.source},description:{story:`Live pulsing ring — use only while a process is actively in-flight.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <Pill {...args} tone="status-error" icon={<Icons.incident size={12} />}>
      Incident open
    </Pill>
}`,...p.parameters?.docs?.source},description:{story:`Leading icon replacing the dot slot.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [tags, setTags] = React.useState(['forge-api', 'us-east-1', 'production']);
    return <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }}>
        {tags.map(tag => <Pill key={tag} tone="ice" onRemove={() => setTags(prev => prev.filter(t => t !== tag))} removeLabel={\`Remove filter \${tag}\`}>
            {tag}
          </Pill>)}
        {tags.length === 0 && <button style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--fg-muted)',
        cursor: 'pointer'
      }} onClick={() => setTags(['forge-api', 'us-east-1', 'production'])}>
            Restore filters
          </button>}
      </div>;
  }
}`,...m.parameters?.docs?.source},description:{story:`Removable pill — trailing × button with accessible label.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8
  }}>
      <Pill tone="neutral" dot>Neutral</Pill>
      <Pill tone="success" dot>Success</Pill>
      <Pill tone="warning" dot>Warning</Pill>
      <Pill tone="danger" dot>Danger</Pill>
      <Pill tone="ember" dot>Ember</Pill>
      <Pill tone="ice" dot>Ice</Pill>
    </div>
}`,...h.parameters?.docs?.source},description:{story:`All six base tones side by side.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8
  }}>
      <Pill tone="severity-p0" dot>P0 · Critical</Pill>
      <Pill tone="severity-p1" dot>P1 · High</Pill>
      <Pill tone="severity-p2" dot>P2 · Medium</Pill>
      <Pill tone="severity-p3" dot>P3 · Low</Pill>
    </div>
}`,...g.parameters?.docs?.source},description:{story:`Severity family — incident triage (P0–P3).`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8
  }}>
      <Pill tone="health-up" dot>Healthy</Pill>
      <Pill tone="health-degraded" dot>Degraded</Pill>
      <Pill tone="health-down" dot>Down</Pill>
      <Pill tone="health-unknown" dot>Unknown</Pill>
    </div>
}`,..._.parameters?.docs?.source},description:{story:`Health family — service uptime states.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8
  }}>
      <Pill tone="status-pending" dot>Pending</Pill>
      <Pill tone="status-running" live>Running</Pill>
      <Pill tone="status-done" dot>Done</Pill>
      <Pill tone="status-error" dot>Error</Pill>
      <Pill tone="status-skipped" dot>Skipped</Pill>
    </div>
}`,...v.parameters?.docs?.source},description:{story:`Status family — pipeline / run step states.`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8
  }}>
      <Pill tone="risk-low" dot>Low risk</Pill>
      <Pill tone="risk-med" dot>Medium risk</Pill>
      <Pill tone="risk-high" dot>High risk</Pill>
      <Pill tone="risk-crit" dot>Critical risk</Pill>
    </div>
}`,...y.parameters?.docs?.source},description:{story:`Risk family — change risk score.`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <div dir="rtl" style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8
  }}>
      <Pill tone="health-up" dot>بدون مشكلة</Pill>
      <Pill tone="status-running" live>جارٍ النشر</Pill>
      <Pill tone="severity-p1" dot>P1 · عالٍ</Pill>
      <Pill tone="ice" onRemove={() => {}} removeLabel="إزالة us-east-1">us-east-1</Pill>
    </div>
}`,...b.parameters?.docs?.source},description:{story:`RTL — text and remove button flip correctly under dir="rtl".`,...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [removed, setRemoved] = React.useState<string[]>([]);
    const toggle = (key: string) => setRemoved(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }}>
        {/* ── Base tones ── */}
        <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        alignItems: 'center'
      }}>
          <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--fg-muted)',
          minWidth: 90
        }}>base</span>
          <Pill tone="neutral">Neutral</Pill>
          <Pill tone="success" dot>Operational</Pill>
          <Pill tone="warning" dot>Degraded</Pill>
          <Pill tone="danger" dot>Outage</Pill>
          <Pill tone="ember" dot>Beta</Pill>
          <Pill tone="ice" dot>Preview</Pill>
        </div>

        {/* ── Status family ── */}
        <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        alignItems: 'center'
      }}>
          <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--fg-muted)',
          minWidth: 90
        }}>status</span>
          <Pill tone="status-pending" dot>Queued</Pill>
          <Pill tone="status-running" live>Building</Pill>
          <Pill tone="status-done" dot>Deployed</Pill>
          <Pill tone="status-error" dot>Failed</Pill>
          <Pill tone="status-skipped" dot>Skipped</Pill>
        </div>

        {/* ── Health family ── */}
        <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        alignItems: 'center'
      }}>
          <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--fg-muted)',
          minWidth: 90
        }}>health</span>
          <Pill tone="health-up" dot>forge-api</Pill>
          <Pill tone="health-degraded" dot>forge-auth</Pill>
          <Pill tone="health-down" dot>forge-cdn</Pill>
          <Pill tone="health-unknown" dot>forge-mq</Pill>
        </div>

        {/* ── Severity family ── */}
        <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        alignItems: 'center'
      }}>
          <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--fg-muted)',
          minWidth: 90
        }}>severity</span>
          <Pill tone="severity-p0" icon={<Icons.incident size={12} />}>SEV-1 · DB write failure</Pill>
          <Pill tone="severity-p1" dot>SEV-2 · Latency spike</Pill>
          <Pill tone="severity-p2" dot>SEV-3 · Retry storm</Pill>
          <Pill tone="severity-p3" dot>SEV-4 · UI lag</Pill>
        </div>

        {/* ── Risk family ── */}
        <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        alignItems: 'center'
      }}>
          <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--fg-muted)',
          minWidth: 90
        }}>risk</span>
          <Pill tone="risk-low" dot>Low</Pill>
          <Pill tone="risk-med" dot>Medium</Pill>
          <Pill tone="risk-high" dot>High</Pill>
          <Pill tone="risk-crit" dot>Critical</Pill>
        </div>

        {/* ── Removable (filter chips pattern) ── */}
        <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        alignItems: 'center'
      }}>
          <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--fg-muted)',
          minWidth: 90
        }}>removable</span>
          {['region:us-east-1', 'env:production', 'team:platform'].map(label => removed.includes(label) ? null : <Pill key={label} tone="ice" onRemove={() => toggle(label)} removeLabel={\`Remove \${label}\`}>
                {label}
              </Pill>)}
          {removed.length > 0 && <button style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--fg-muted)',
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          padding: 0
        }} onClick={() => setRemoved([])}>
              reset
            </button>}
        </div>
      </div>;
  }
}`,...x.parameters?.docs?.source},description:{story:`All tones laid out in a matrix: each row is a semantic family,
columns are dot / live / icon / removable variants.`,...x.parameters?.docs?.description}}},S=[`Default`,`WithDot`,`Live`,`WithIcon`,`Removable`,`BaseTones`,`SeverityFamily`,`HealthFamily`,`StatusFamily`,`RiskFamily`,`RTL`,`Variants`]}))();export{h as BaseTones,u as Default,_ as HealthFamily,f as Live,b as RTL,m as Removable,y as RiskFamily,g as SeverityFamily,v as StatusFamily,x as Variants,d as WithDot,p as WithIcon,S as __namedExportsOrder,l as default};