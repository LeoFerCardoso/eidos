import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./jsx-runtime-CaZkqeYb.js";import{Yi as n,t as r}from"./src-DgoylXRw.js";var i,a,o,s,c,l,u,d,f,p;e((()=>{r(),i=t(),a=[{id:1,time:`02:14:01.012`,level:`info`,message:`pix-router started on :8080`},{id:2,time:`02:14:01.248`,level:`debug`,message:`Connected to ledger-svc at ledger-svc.pix.svc.cluster.local:50051`},{id:3,time:`02:14:02.001`,level:`info`,message:`Health check passed — downstream latency 9ms`},{id:4,time:`02:14:08.312`,level:`info`,message:`POST /pix/v2/payments 200 — 84ms · txn=PIX-9F3A`},{id:5,time:`02:14:08.800`,level:`debug`,message:`Idempotency key cached: PIX-9F3A ttl=300s`},{id:6,time:`02:14:09.120`,level:`info`,message:`POST /pix/v2/payments 200 — 91ms · txn=PIX-9F3B`},{id:7,time:`02:14:11.002`,level:`warn`,message:`bureau-gateway p95 elevated: 312ms (SLO: 250ms)`},{id:8,time:`02:14:11.200`,level:`info`,message:`Circuit breaker: bureau-gateway → HALF_OPEN`},{id:9,time:`02:14:14.500`,level:`error`,message:`POST /pix/v2/payments 503 — bureau-gateway unavailable`},{id:10,time:`02:14:14.501`,level:`error`,message:`Retry #1 → bureau-gateway: connect timeout after 200ms`},{id:11,time:`02:14:15.003`,level:`fatal`,message:`Circuit breaker OPEN — all traffic to bureau-gateway suspended`},{id:12,time:`02:14:15.200`,level:`warn`,message:`Fallback activated: returning cached bureau score`},{id:13,time:`02:14:18.400`,level:`info`,message:`Circuit breaker: bureau-gateway → HALF_OPEN (probe)`},{id:14,time:`02:14:19.100`,level:`info`,message:`bureau-gateway probe OK — 118ms. Closing circuit.`},{id:15,time:`02:14:19.400`,level:`info`,message:`POST /pix/v2/payments 200 — 122ms · txn=PIX-9F3C`}],o={title:`Elements/LogViewer`,component:n,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:"A terminal-style log stream with severity-colored rows. Three variants: `compact` (level badge + message only), `expanded` (timestamp + severity columns), and `filterable` (full toolbar with per-level chip toggles and text search)."}}},args:{lines:a,variant:`compact`,height:280,follow:!1,wrap:!1},argTypes:{variant:{control:`inline-radio`,options:[`compact`,`expanded`,`filterable`]},height:{control:`number`},follow:{control:`boolean`},wrap:{control:`boolean`}}},s={},c={args:{variant:`expanded`,height:300}},l={args:{variant:`filterable`,height:340}},u={args:{lines:[]}},d={args:{variant:`expanded`,wrap:!0,lines:[{id:1,time:`02:14:14.501`,level:`error`,message:`POST /pix/v2/payments 503 — Upstream bureau-gateway returned HTTP 503 after 200ms; idempotency key PIX-9F3A will be retained for 300s; retry scheduled via exponential back-off (attempt 1/3, next in 400ms).`},{id:2,time:`02:14:15.003`,level:`fatal`,message:`Circuit breaker OPEN — all outbound traffic to bureau-gateway suspended; downstream callers will receive 503 with Retry-After: 30 until probe recovers.`}]}},f={render:()=>(0,i.jsxs)(`div`,{style:{maxWidth:760},children:[(0,i.jsx)(`p`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,marginBottom:8},children:`pix-router · D-9182 · canary log`}),(0,i.jsx)(n,{lines:a,variant:`filterable`,height:360})]})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source},description:{story:`Compact view — level badge + message, no timestamp column.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'expanded',
    height: 300
  }
}`,...c.parameters?.docs?.source},description:{story:`Expanded — timestamp + severity columns.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'filterable',
    height: 340
  }
}`,...l.parameters?.docs?.source},description:{story:`Filterable — toolbar with level chip toggles and text search.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    lines: []
  }
}`,...u.parameters?.docs?.source},description:{story:`Empty state — no log output yet.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'expanded',
    wrap: true,
    lines: [{
      id: 1,
      time: '02:14:14.501',
      level: 'error',
      message: 'POST /pix/v2/payments 503 — Upstream bureau-gateway returned HTTP 503 after 200ms; idempotency key PIX-9F3A will be retained for 300s; retry scheduled via exponential back-off (attempt 1/3, next in 400ms).'
    }, {
      id: 2,
      time: '02:14:15.003',
      level: 'fatal',
      message: 'Circuit breaker OPEN — all outbound traffic to bureau-gateway suspended; downstream callers will receive 503 with Retry-After: 30 until probe recovers.'
    }]
  }
}`,...d.parameters?.docs?.source},description:{story:`Wrapped long lines instead of ellipsis truncation.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    maxWidth: 760
  }}>
      <p style={{
      fontSize: 11,
      fontFamily: 'var(--font-mono)',
      color: 'var(--fg-muted)',
      marginBottom: 8
    }}>
        pix-router · D-9182 · canary log
      </p>
      <LogViewer lines={SAMPLE_LINES} variant="filterable" height={360} />
    </div>
}`,...f.parameters?.docs?.source},description:{story:`Filterable viewer embedded in a service detail card.`,...f.parameters?.docs?.description}}},p=[`Default`,`Expanded`,`Filterable`,`Empty`,`Wrapped`,`InContext`]}))();export{s as Default,u as Empty,c as Expanded,l as Filterable,f as InContext,d as Wrapped,p as __namedExportsOrder,o as default};