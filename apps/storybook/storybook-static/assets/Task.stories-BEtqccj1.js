import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{nr as r,t as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u,d,f,p,m;e((()=>{t(),i(),a=n(),o=[{title:`Fetch p95 latency`,status:`done`},{title:`Check error rate`,status:`done`},{title:`Query SLO breach log`,status:`active`}],s={title:`AI/Task`,component:r,tags:[`autodocs`],parameters:{docs:{description:{component:`A single unit of agent work with a status mark and optional sub-steps. Compose several Tasks for a live to-do feed that updates as the agent progresses.`}}},args:{title:`Evaluate blast radius of INC-9812`,status:`active`,detail:`Ring 0 → 2`},argTypes:{status:{control:`select`,options:[`pending`,`active`,`done`,`error`]},title:{control:`text`},detail:{control:`text`}}},c={},l={args:{title:`Query incident log`,status:`pending`,detail:void 0}},u={args:{title:`Fetched service health for fraud-engine`,status:`done`,detail:`142 ms`}},d={args:{title:`Look up user account usr_4f9a2c`,status:`error`,detail:`404`}},f={args:{title:`Evaluate service health`,status:`active`,detail:void 0,items:o}},p={render:()=>(0,a.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:4,maxWidth:480},children:[(0,a.jsx)(r,{title:`Fetch service health for fraud-engine`,status:`done`,detail:`312 ms`}),(0,a.jsx)(r,{title:`Query incident log (last 24 h)`,status:`done`,detail:`2 incidents`}),(0,a.jsx)(r,{title:`Evaluate blast radius of INC-9812`,status:`active`,detail:`Ring 0 → 2`,items:o}),(0,a.jsx)(r,{title:`Check if incident affects usr_4f9a2c`,status:`pending`}),(0,a.jsx)(r,{title:`Produce final recommendation`,status:`pending`})]})},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{}`,...c.parameters?.docs?.source},description:{story:`Active task — currently being worked on.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Query incident log',
    status: 'pending',
    detail: undefined
  }
}`,...l.parameters?.docs?.source},description:{story:`Pending — not yet started.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Fetched service health for fraud-engine',
    status: 'done',
    detail: '142 ms'
  }
}`,...u.parameters?.docs?.source},description:{story:`Done — completed successfully.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Look up user account usr_4f9a2c',
    status: 'error',
    detail: '404'
  }
}`,...d.parameters?.docs?.source},description:{story:`Error — task failed.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Evaluate service health',
    status: 'active',
    detail: undefined,
    items: SUB_ITEMS
  }
}`,...f.parameters?.docs?.source},description:{story:`With sub-tasks — a hierarchical breakdown of one larger goal.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    maxWidth: 480
  }}>
      <Task title="Fetch service health for fraud-engine" status="done" detail="312 ms" />
      <Task title="Query incident log (last 24 h)" status="done" detail="2 incidents" />
      <Task title="Evaluate blast radius of INC-9812" status="active" detail="Ring 0 → 2" items={SUB_ITEMS} />
      <Task title="Check if incident affects usr_4f9a2c" status="pending" />
      <Task title="Produce final recommendation" status="pending" />
    </div>
}`,...p.parameters?.docs?.source},description:{story:`A realistic live feed of tasks in various states.`,...p.parameters?.docs?.description}}},m=[`Default`,`Pending`,`Done`,`Error`,`WithSubTasks`,`InContext`]}))();export{c as Default,u as Done,d as Error,p as InContext,l as Pending,f as WithSubTasks,m as __namedExportsOrder,s as default};