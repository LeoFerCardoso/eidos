import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{jn as r,t as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u,d,f,p,m,h,g,_,v;e((()=>{t(),i(),a=n(),o={id:`thread-001`,title:`Fraud engine latency investigation`,preview:`Analysed p95 spike in scoring chain — root cause: stale feature store data.`},s={id:`thread-002`,title:`Deploy rollback — pix-router v4.1.2`,preview:`Canary rolled back after error rate exceeded 2% threshold on ring-0.`,active:!0},c={id:`thread-003`,title:`Incident INC-9812 post-mortem`,preview:`ML feature store returned stale vectors; circuit breaker opened at 14:07 BRT.`,starred:!0},l={id:`thread-004`,title:`Agent scaffolding for billing-svc`,preview:`Generated OpenAPI client + retry policy config for billing-svc v2 endpoints.`,starred:!0,active:!0},u={id:`thread-005`,title:`Refactor auth-gateway rate-limit middleware to use sliding window algorithm`,preview:`Compared token-bucket vs sliding-window; sliding-window chosen for burst tolerance.`},d={title:`AI/HistoryItem`,component:r,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:`A single conversation thread row in the history rail. Renders the thread title and a one-line preview, highlights a search query substring in ember, and exposes inline rename / delete actions on hover. Use inside a HistoryGroup or directly in a custom rail.`}}},args:{thread:o}},f={},p={args:{thread:s}},m={args:{thread:c}},h={render:()=>(0,a.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,width:280,gap:2},children:[(0,a.jsx)(r,{thread:o}),(0,a.jsx)(r,{thread:s}),(0,a.jsx)(r,{thread:c}),(0,a.jsx)(r,{thread:l})]})},g={args:{thread:o,query:`latency`}},_={render:()=>(0,a.jsx)(`div`,{style:{width:280},children:(0,a.jsx)(r,{thread:u})})},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{}`,...f.parameters?.docs?.source},description:{story:`Default thread row — no active or starred state.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    thread: THREAD_ACTIVE
  }
}`,...p.parameters?.docs?.source},description:{story:`Active thread — the currently selected conversation is highlighted.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    thread: THREAD_STARRED
  }
}`,...m.parameters?.docs?.source},description:{story:`Starred thread — a star icon appears at the trailing edge.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    width: 280,
    gap: 2
  }}>
      <HistoryItem thread={THREAD_DEFAULT} />
      <HistoryItem thread={THREAD_ACTIVE} />
      <HistoryItem thread={THREAD_STARRED} />
      <HistoryItem thread={THREAD_STARRED_ACTIVE} />
    </div>
}`,...h.parameters?.docs?.source},description:{story:`State matrix — default, active, starred, and starred+active laid out
side-by-side inside a fixed-width rail column so spacing is representative.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    thread: THREAD_DEFAULT,
    query: 'latency'
  }
}`,...g.parameters?.docs?.source},description:{story:`Search highlight — the query substring is highlighted in ember
(var(--accent)) inside the title.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    width: 280
  }}>
      <HistoryItem thread={THREAD_LONG_TITLE} />
    </div>
}`,..._.parameters?.docs?.source},description:{story:`Long title — verifies single-line truncation at rail width (280 px).`,..._.parameters?.docs?.description}}},v=[`Default`,`Active`,`Starred`,`States`,`SearchHighlight`,`LongTitle`]}))();export{p as Active,f as Default,_ as LongTitle,g as SearchHighlight,m as Starred,h as States,v as __namedExportsOrder,d as default};