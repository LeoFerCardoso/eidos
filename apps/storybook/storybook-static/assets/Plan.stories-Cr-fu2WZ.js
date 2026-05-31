import{i as e}from"./preload-helper-xPQekRTU.js";import{$n as t,t as n}from"./src-DgoylXRw.js";var r,i,a,o,s,c,l,u,d,f;e((()=>{n(),r=[{title:`Fetch service health for fraud-engine`,status:`done`},{title:`Query incident log for the past 24 hours`,status:`done`,detail:`2 incidents found`},{title:`Evaluate blast radius of INC-9812`,status:`active`,detail:`Ring 0 → 2`},{title:`Check if incident affects user account usr_4f9a2c`,status:`pending`},{title:`Produce final recommendation`,status:`pending`}],i=r.map(e=>({...e,status:`done`})),a=r.map(e=>({...e,status:`pending`})),o={title:`AI/Plan`,component:t,tags:[`autodocs`],parameters:{docs:{description:{component:`An ordered checklist the agent commits to at the start of a task. Steps tick off as the agent works; the header counter (done/total) updates in real time.`}}},args:{title:`Plan`,items:r},argTypes:{title:{control:`text`}}},s={},c={args:{items:i}},l={args:{items:a}},u={args:{title:`Incident triage plan`,items:r}},d={args:{items:[]}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source},description:{story:`Mixed states — some done, one active, rest pending.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    items: ITEMS_ALL_DONE
  }
}`,...c.parameters?.docs?.source},description:{story:`All steps complete.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    items: ITEMS_PENDING
  }
}`,...l.parameters?.docs?.source},description:{story:`All steps pending — plan just created.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Incident triage plan',
    items: ITEMS_MIXED
  }
}`,...u.parameters?.docs?.source},description:{story:`Custom plan title for a named sub-task.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    items: []
  }
}`,...d.parameters?.docs?.source},description:{story:`Empty plan — agent has no steps yet.`,...d.parameters?.docs?.description}}},f=[`Default`,`AllDone`,`AllPending`,`CustomTitle`,`Empty`]}))();export{c as AllDone,l as AllPending,u as CustomTitle,s as Default,d as Empty,f as __namedExportsOrder,o as default};