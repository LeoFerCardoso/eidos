import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./jsx-runtime-CaZkqeYb.js";import{Ka as n,ea as r,t as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u,d,f,p,m,h,g,_;e((()=>{i(),a=t(),o=[12,18,14,22,20,28,24,31,27,35,42,38],s=n.SERVICES.find(e=>e.id===`pix-router`),c=n.SERVICES.find(e=>e.id===`identity-svc`),l=[{name:`Rafael Mendonça`,initials:`RM`,ember:!0},{name:`Larissa Fontana`,initials:`LF`},{name:`Diego Vasquez`,initials:`DV`},{name:`Camila Tanaka`,initials:`CT`}],u={title:`Elements/ServiceCard`,component:r,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:"A catalog tile for a microservice: server icon, name, version + deploy timestamp, a `HealthBadge`, a contributor avatar group, and a language badge in the footer. Three variants: `compact` for slim rows, `default` for grids, and `detailed` for the service-detail surface (adds a latency sparkline)."}}},args:{service:s,contributors:l,variant:`default`},argTypes:{variant:{control:`inline-radio`,options:[`compact`,`default`,`detailed`]}}},d={},f={args:{service:{...s,alert:!0}}},p={args:{variant:`compact`}},m={args:{variant:`detailed`,sparkSeries:o,service:{...s,p95:89}}},h={render:()=>(0,a.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(240px, 1fr))`,gap:16},children:n.SERVICES.slice(0,6).map(e=>(0,a.jsx)(r,{service:e,contributors:l.slice(0,2)},e.id))})},g={render:()=>(0,a.jsx)(`div`,{style:{maxWidth:360},children:(0,a.jsx)(r,{service:{...c,p95:142},contributors:l,sparkSeries:o,variant:`detailed`,onOpen:()=>{}})})},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{}`,...d.parameters?.docs?.source},description:{story:`Default grid tile — healthy service.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    service: {
      ...PIX_ROUTER,
      alert: true
    }
  }
}`,...f.parameters?.docs?.source},description:{story:"A degraded service — the `alert` flag switches the health badge to degraded.",...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'compact'
  }
}`,...p.parameters?.docs?.source},description:{story:`Compact variant — slim row for catalog lists.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'detailed',
    sparkSeries: SPARK,
    service: {
      ...PIX_ROUTER,
      p95: 89
    }
  }
}`,...m.parameters?.docs?.source},description:{story:`Detailed variant — shows the latency sparkline with p95.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: 16
  }}>
      {MOCKS.SERVICES.slice(0, 6).map(svc => <ServiceCard key={svc.id} service={svc} contributors={CONTRIBUTORS.slice(0, 2)} />)}
    </div>
}`,...h.parameters?.docs?.source},description:{story:`Grid of default tiles as seen in the service catalog.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    maxWidth: 360
  }}>
      <ServiceCard service={{
      ...IDENTITY,
      p95: 142
    }} contributors={CONTRIBUTORS} sparkSeries={SPARK} variant="detailed" onOpen={() => {}} />
    </div>
}`,...g.parameters?.docs?.source},description:{story:`Detailed tile in the service-detail panel.`,...g.parameters?.docs?.description}}},_=[`Default`,`Degraded`,`Compact`,`Detailed`,`Grid`,`InContext`]}))();export{p as Compact,d as Default,f as Degraded,m as Detailed,h as Grid,g as InContext,_ as __namedExportsOrder,u as default};