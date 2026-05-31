import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{An as r,t as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u,d,f,p,m,h,g;e((()=>{t(),i(),a=n(),o=[{id:`th-001`,title:`Diagnose Pix router latency spike`,preview:`p95 jumped to 1.8 s after the 14:02 deploy — checking circuit breakers…`,active:!0},{id:`th-002`,title:`Generate rollback script for fraud-engine v4.1`,preview:`deployctl.rollback({ service: "fraud-engine", version: "4.0.9" })`,starred:!0},{id:`th-003`,title:`Summarise INC-9812 post-mortem`,preview:`Feature store returned stale data; scoring chain retried 3× before tripping.`}],s=[{id:`th-010`,title:`Draft runbook for canary ring-0 rollout`,preview:`Step 1: validate feature flags; step 2: ship to ring-0 (1 % traffic)…`,starred:!0},{id:`th-011`,title:`Explain variance in A/B conversion metrics`,preview:`The checkout cohort shows a 2.4 % lift but the confidence interval is wide.`}],c=[{id:`th-020`,title:`Map IAM permissions for data-pipeline service account`,preview:`Needs storage.objectAdmin on gs://forge-pipeline-prod and BigQuery jobUser.`},{id:`th-021`,title:`Optimise cold-start time for auth-lambda`,preview:`Bundle size: 4.1 MB → 1.2 MB after excluding AWS SDK v2 from layer.`},{id:`th-022`,title:`Review PR #2047 — rate-limiter middleware`,preview:`Token bucket implementation looks correct; left comments on edge-case handling.`}],l=[{id:`th-030`,title:`Generate rollback script for fraud-engine v4.1`,preview:`deployctl.rollback({ service: "fraud-engine", version: "4.0.9" })`,starred:!0,active:!1},{id:`th-031`,title:`Draft runbook for canary ring-0 rollout`,preview:`Step 1: validate feature flags; step 2: ship to ring-0 (1 % traffic)…`,starred:!0}],u={title:`AI/HistoryGroup`,component:r,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:'A date-bucketed section inside the conversation-history rail. Renders a labelled header (e.g. "Today", "Yesterday") with a thread count, followed by a list of `HistoryItem` rows. Use inside `History` (the full rail) to organise threads by recency; the optional `query` prop forwards a search string to each row for in-title highlight.'}}},args:{label:`Today`,threads:o,query:``},argTypes:{label:{control:`text`},query:{control:`text`}}},d={},f={args:{label:`Today`,threads:o,query:`rollback`}},p={render:()=>(0,a.jsxs)(`div`,{style:{display:`flex`,gap:24,alignItems:`flex-start`,flexWrap:`wrap`},children:[(0,a.jsx)(`div`,{style:{width:280},children:(0,a.jsx)(r,{label:`Today`,threads:o})}),(0,a.jsx)(`div`,{style:{width:280},children:(0,a.jsx)(r,{label:`Yesterday`,threads:s})}),(0,a.jsx)(`div`,{style:{width:280},children:(0,a.jsx)(r,{label:`Last week`,threads:c})})]})},m={args:{label:`Starred`,threads:l}},h={args:{label:`Last month`,threads:[]}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{}`,...d.parameters?.docs?.source},description:{story:`A single bucket with the active thread highlighted and one starred item.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Today',
    threads: TODAY_THREADS,
    query: 'rollback'
  }
}`,...f.parameters?.docs?.source},description:{story:`Shows the in-title search highlight: the matching substring is coloured in ember.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 24,
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  }}>
      <div style={{
      width: 280
    }}>
        <HistoryGroup label="Today" threads={TODAY_THREADS} />
      </div>
      <div style={{
      width: 280
    }}>
        <HistoryGroup label="Yesterday" threads={YESTERDAY_THREADS} />
      </div>
      <div style={{
      width: 280
    }}>
        <HistoryGroup label="Last week" threads={LAST_WEEK_THREADS} />
      </div>
    </div>
}`,...p.parameters?.docs?.source},description:{story:`Three recency buckets side by side — Today / Yesterday / Last week —
demonstrating the full variant × state matrix: active row, starred row,
and plain rows across different bucket sizes.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Starred',
    threads: STARRED_THREADS
  }
}`,...m.parameters?.docs?.source},description:{story:`A "Starred" bucket with only bookmarked threads — demonstrates alternative labelling.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Last month',
    threads: []
  }
}`,...h.parameters?.docs?.source},description:{story:`Empty bucket — zero threads — renders just the header row with a 0 count.`,...h.parameters?.docs?.description}}},g=[`Default`,`WithSearchQuery`,`Variants`,`StarredBucket`,`EmptyBucket`]}))();export{d as Default,h as EmptyBucket,m as StarredBucket,p as Variants,f as WithSearchQuery,g as __namedExportsOrder,u as default};