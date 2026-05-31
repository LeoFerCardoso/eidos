import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{Da as r,t as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u,d,f,p;e((()=>{t(),i(),a=n(),o={title:`Primitives/HealthBadge`,component:r,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:'Operational health pill for services, agents, and cloud resources. Wraps `.pill.health-*` with an explicit status dot and short label. Use for at-a-glance health status in service catalogs, incident dashboards, and deployment pipelines. Keep labels short: "Up", "Degraded", "Down", "Unknown". Pass `pulse` to animate the dot during active investigation of a degraded state.'}}},args:{state:`up`,pulse:!1},argTypes:{state:{control:`inline-radio`,options:[`up`,`degraded`,`down`,`unknown`]},pulse:{control:`boolean`},label:{control:`text`}}},s={args:{state:`up`}},c={render:()=>(0,a.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:12,alignItems:`center`},children:[(0,a.jsx)(r,{state:`up`}),(0,a.jsx)(r,{state:`degraded`}),(0,a.jsx)(r,{state:`down`}),(0,a.jsx)(r,{state:`unknown`})]})},l={render:()=>(0,a.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:12,alignItems:`center`},children:[(0,a.jsx)(r,{state:`degraded`,pulse:!0}),(0,a.jsx)(r,{state:`degraded`,pulse:!0,label:`Degraded · P1 active`})]})},u={render:()=>(0,a.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:12,alignItems:`center`},children:[(0,a.jsx)(r,{state:`up`,label:`Healthy`}),(0,a.jsx)(r,{state:`degraded`,label:`High latency`}),(0,a.jsx)(r,{state:`down`,label:`Outage`}),(0,a.jsx)(r,{state:`unknown`,label:`No data`})]})},d={render:()=>(0,a.jsx)(`div`,{className:`surface`,style:{borderRadius:10,overflow:`hidden`,maxWidth:560},children:(0,a.jsxs)(`table`,{className:`tbl`,style:{width:`100%`},children:[(0,a.jsx)(`thead`,{children:(0,a.jsxs)(`tr`,{children:[(0,a.jsx)(`th`,{children:`Service`}),(0,a.jsx)(`th`,{children:`Region`}),(0,a.jsx)(`th`,{children:`Health`}),(0,a.jsx)(`th`,{style:{textAlign:`end`},children:`Latency (p95)`})]})}),(0,a.jsx)(`tbody`,{children:[{name:`forge-api`,region:`us-east-1`,state:`up`,latency:`42 ms`},{name:`auth-gateway`,region:`eu-west-1`,state:`degraded`,latency:`380 ms`,pulse:!0},{name:`ingest-worker`,region:`us-west-2`,state:`down`,latency:`—`},{name:`metrics-collector`,region:`ap-southeast-1`,state:`unknown`,latency:`—`},{name:`deploy-runner`,region:`us-east-1`,state:`up`,latency:`18 ms`}].map(e=>(0,a.jsxs)(`tr`,{children:[(0,a.jsx)(`td`,{style:{fontFamily:`var(--font-mono)`,fontSize:`var(--text-sm)`},children:e.name}),(0,a.jsx)(`td`,{style:{color:`var(--fg-muted)`,fontSize:`var(--text-sm)`},children:e.region}),(0,a.jsx)(`td`,{children:(0,a.jsx)(r,{state:e.state,pulse:`pulse`in e?e.pulse:!1})}),(0,a.jsx)(`td`,{style:{textAlign:`end`,fontFamily:`var(--font-mono)`,fontSize:`var(--text-sm)`,color:`var(--fg-muted)`},children:e.latency})]},e.name))})]})})},f={render:()=>(0,a.jsxs)(`div`,{dir:`rtl`,style:{display:`flex`,flexDirection:`column`,gap:16},children:[(0,a.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:12,alignItems:`center`},children:[(0,a.jsx)(r,{state:`up`}),(0,a.jsx)(r,{state:`degraded`,pulse:!0}),(0,a.jsx)(r,{state:`down`}),(0,a.jsx)(r,{state:`unknown`})]}),(0,a.jsxs)(`div`,{className:`surface`,style:{padding:`10px 14px`,borderRadius:8,display:`flex`,alignItems:`center`,justifyContent:`space-between`,maxWidth:360},children:[(0,a.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:`var(--text-sm)`},children:`forge-api`}),(0,a.jsx)(r,{state:`up`,label:`يعمل`})]})]})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    state: 'up'
  }
}`,...s.parameters?.docs?.source},description:{story:`Default — a healthy service reporting "Up".`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center'
  }}>
      <HealthBadge state="up" />
      <HealthBadge state="degraded" />
      <HealthBadge state="down" />
      <HealthBadge state="unknown" />
    </div>
}`,...c.parameters?.docs?.source},description:{story:`All four states side by side — the full health state matrix.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center'
  }}>
      <HealthBadge state="degraded" pulse />
      <HealthBadge state="degraded" pulse label="Degraded · P1 active" />
    </div>
}`,...l.parameters?.docs?.source},description:{story:`Pulsing dot — used while an incident is actively being investigated.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center'
  }}>
      <HealthBadge state="up" label="Healthy" />
      <HealthBadge state="degraded" label="High latency" />
      <HealthBadge state="down" label="Outage" />
      <HealthBadge state="unknown" label="No data" />
    </div>
}`,...u.parameters?.docs?.source},description:{story:`Custom labels — override the default text for context-specific messaging.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    const services = [{
      name: 'forge-api',
      region: 'us-east-1',
      state: 'up' as const,
      latency: '42 ms'
    }, {
      name: 'auth-gateway',
      region: 'eu-west-1',
      state: 'degraded' as const,
      latency: '380 ms',
      pulse: true
    }, {
      name: 'ingest-worker',
      region: 'us-west-2',
      state: 'down' as const,
      latency: '—'
    }, {
      name: 'metrics-collector',
      region: 'ap-southeast-1',
      state: 'unknown' as const,
      latency: '—'
    }, {
      name: 'deploy-runner',
      region: 'us-east-1',
      state: 'up' as const,
      latency: '18 ms'
    }];
    return <div className="surface" style={{
      borderRadius: 10,
      overflow: 'hidden',
      maxWidth: 560
    }}>
        <table className="tbl" style={{
        width: '100%'
      }}>
          <thead>
            <tr>
              <th>Service</th>
              <th>Region</th>
              <th>Health</th>
              <th style={{
              textAlign: 'end'
            }}>Latency (p95)</th>
            </tr>
          </thead>
          <tbody>
            {services.map(svc => <tr key={svc.name}>
                <td style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)'
            }}>{svc.name}</td>
                <td style={{
              color: 'var(--fg-muted)',
              fontSize: 'var(--text-sm)'
            }}>{svc.region}</td>
                <td>
                  <HealthBadge state={svc.state} pulse={'pulse' in svc ? svc.pulse : false} />
                </td>
                <td style={{
              textAlign: 'end',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
              color: 'var(--fg-muted)'
            }}>
                  {svc.latency}
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>;
  }
}`,...d.parameters?.docs?.source},description:{story:`In context — service catalog rows showing mixed health across a deployment.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div dir="rtl" style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  }}>
      <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 12,
      alignItems: 'center'
    }}>
        <HealthBadge state="up" />
        <HealthBadge state="degraded" pulse />
        <HealthBadge state="down" />
        <HealthBadge state="unknown" />
      </div>
      <div className="surface" style={{
      padding: '10px 14px',
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      maxWidth: 360
    }}>
        <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-sm)'
      }}>forge-api</span>
        <HealthBadge state="up" label="يعمل" />
      </div>
    </div>
}`,...f.parameters?.docs?.source},description:{story:`RTL — badge layout mirrors correctly under right-to-left direction.`,...f.parameters?.docs?.description}}},p=[`Default`,`AllStates`,`Pulsing`,`CustomLabels`,`InContext`,`RTL`]}))();export{c as AllStates,u as CustomLabels,s as Default,d as InContext,l as Pulsing,f as RTL,p as __namedExportsOrder,o as default};