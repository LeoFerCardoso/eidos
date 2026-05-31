import{i as e}from"./preload-helper-xPQekRTU.js";import{Xn as t,t as n}from"./src-DgoylXRw.js";var r,i,a,o,s,c,l,u,d;e((()=>{n(),r=[{kind:`think`,label:`Identify the affected service`,status:`done`},{kind:`search`,label:`Query incident log for fraud-engine (last 24 h)`,status:`done`,detail:`Found 2 open incidents (INC-9812, INC-9813).`},{kind:`observe`,label:`Check p95 latency for fraud-engine`,status:`done`,detail:`p95 = 312 ms — within SLO (< 500 ms).`},{kind:`plan`,label:`Determine whether to surface incidents to user`,status:`done`},{kind:`done`,label:`Conclude: safe to proceed, attach incident context`,status:`done`}],i=r.slice(0,3),a={title:`AI/ChainOfThought`,component:t,tags:[`autodocs`],parameters:{docs:{description:{component:`A collapsible multi-step reasoning trace. Each step carries a kind (think / search / observe / plan / done / read), a label, and optional detail. Append steps as they stream in.`}}},args:{title:`Chain of thought`,defaultOpen:!0,steps:r},argTypes:{title:{control:`text`},defaultOpen:{control:`boolean`}}},o={},s={args:{steps:i}},c={args:{title:`Search trace`,steps:[{kind:`search`,label:`Query: fraud-engine incidents, last 24 h`,status:`done`,detail:`2 results`},{kind:`read`,label:`Read INC-9812 detail`,status:`done`},{kind:`read`,label:`Read INC-9813 detail`,status:`done`},{kind:`observe`,label:`Neither incident correlates with user account`,status:`done`}]}},l={args:{defaultOpen:!1}},u={args:{steps:[]}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source},description:{story:`Full settled trace — all 5 steps done.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    steps: PARTIAL_STEPS
  }
}`,...s.parameters?.docs?.source},description:{story:`Partial — trace still building (3 of 5 steps arrived).`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Search trace',
    steps: [{
      kind: 'search',
      label: 'Query: fraud-engine incidents, last 24 h',
      status: 'done',
      detail: '2 results'
    }, {
      kind: 'read',
      label: 'Read INC-9812 detail',
      status: 'done'
    }, {
      kind: 'read',
      label: 'Read INC-9813 detail',
      status: 'done'
    }, {
      kind: 'observe',
      label: 'Neither incident correlates with user account',
      status: 'done'
    }]
  }
}`,...c.parameters?.docs?.source},description:{story:`Custom title for a specialised trace.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    defaultOpen: false
  }
}`,...l.parameters?.docs?.source},description:{story:`Collapsed initially — model settled without surfacing the trace.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    steps: []
  }
}`,...u.parameters?.docs?.source},description:{story:`Empty steps list — renders the header with "0 steps".`,...u.parameters?.docs?.description}}},d=[`Default`,`Partial`,`SearchTrace`,`CollapsedByDefault`,`Empty`]}))();export{l as CollapsedByDefault,o as Default,u as Empty,s as Partial,c as SearchTrace,d as __namedExportsOrder,a as default};