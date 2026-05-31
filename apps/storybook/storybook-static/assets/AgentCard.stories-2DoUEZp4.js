import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./jsx-runtime-CaZkqeYb.js";import{Ui as n,t as r}from"./src-DgoylXRw.js";var i,a,o,s,c,l,u,d,f,p,m,h;e((()=>{r(),i=t(),a=Date.now(),o=e=>new Date(a-e),s=[{name:`Risk Analyst`,model:`claude-sonnet-4-6`,status:`up`,summary:`Evaluates change risk scores for every pull request, checking blast radius, complexity, and SAST findings against policy thresholds.`,capabilities:[`risk-scoring`,`sast`,`blast-radius`,`policy-gate`],calls:12847,successRate:98,lastRun:o(840*1e3)},{name:`Fraud Detector`,model:`claude-opus-4`,status:`degraded`,summary:`Real-time transaction scoring using behavioural signals, device fingerprints, and velocity checks.`,capabilities:[`tx-scoring`,`device-fp`,`velocity`,`ml-features`],calls:48291,successRate:94,lastRun:o(180*1e3)},{name:`SRE Responder`,model:`claude-haiku-4`,status:`up`,summary:`Triages alerts, drafts runbook steps, and links related incidents from the last 30 days.`,capabilities:[`alert-triage`,`runbook`,`incident-link`,`rca`],calls:2391,successRate:96,lastRun:o(2820*1e3)},{name:`KYC Orchestrator`,model:`claude-sonnet-4-6`,status:`down`,summary:`Coordinates document validation, biometric checks, and bureau lookups for new account onboarding.`,capabilities:[`doc-validation`,`biometric`,`bureau-lookup`],calls:7104,successRate:91,lastRun:o(10800*1e3)}],c={title:`Elements/AgentCard`,component:n,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:`A catalog tile for an AI agent: ember avatar with bot glyph, name, model, health badge, a 2-line summary, capability chips (up to 5), and a footer with run count, success rate, and relative time of the last run.`}}},args:{agent:s[0]},argTypes:{}},l={},u={args:{agent:s[1]}},d={args:{agent:s[3]}},f={args:{agent:{name:`Data Classifier`,model:`claude-haiku-4`,status:`unknown`,summary:`Classifies data sensitivity levels for the data-export pipeline. Not yet active in production.`,capabilities:[`classification`,`pii-detection`]}}},p={render:()=>(0,i.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(280px, 1fr))`,gap:16},children:s.map(e=>(0,i.jsx)(n,{agent:e,onOpen:()=>{}},e.name))})},m={render:()=>(0,i.jsx)(`div`,{style:{maxWidth:340},children:(0,i.jsx)(n,{agent:s[0],onOpen:()=>{}})})},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source},description:{story:`Healthy agent with strong run metrics.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    agent: AGENTS[1]
  }
}`,...u.parameters?.docs?.source},description:{story:`Degraded agent — health badge reflects the impaired status.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    agent: AGENTS[3]
  }
}`,...d.parameters?.docs?.source},description:{story:`Agent that is fully down.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    agent: {
      name: 'Data Classifier',
      model: 'claude-haiku-4',
      status: 'unknown',
      summary: 'Classifies data sensitivity levels for the data-export pipeline. Not yet active in production.',
      capabilities: ['classification', 'pii-detection']
    }
  }
}`,...f.parameters?.docs?.source},description:{story:`Agent with no run stats yet (new / uncalled).`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 16
  }}>
      {AGENTS.map(agent => <AgentCard key={agent.name} agent={agent} onOpen={() => {}} />)}
    </div>
}`,...p.parameters?.docs?.source},description:{story:`Grid of agent tiles as seen in the AI agent catalog.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    maxWidth: 340
  }}>
      <AgentCard agent={AGENTS[0]} onOpen={() => {}} />
    </div>
}`,...m.parameters?.docs?.source},description:{story:`Clickable tile in a command palette–style agent picker.`,...m.parameters?.docs?.description}}},h=[`Default`,`Degraded`,`Down`,`NoStats`,`Grid`,`InContext`]}))();export{l as Default,u as Degraded,d as Down,p as Grid,m as InContext,f as NoStats,h as __namedExportsOrder,c as default};