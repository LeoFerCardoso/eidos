import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{An as r,Mn as i,jn as a,kn as o,t as s}from"./src-DgoylXRw.js";var c,l,u,d,f,p,m,h,g,_,v,y,b,x;e((()=>{t(),s(),c=n(),l=[{id:`t1`,title:`Summarise pix-router deploy risk`,preview:`The Ring 2 canary shows a p95 spike…`,active:!0},{id:`t2`,title:`Draft a GMUD for bureau-gateway`,preview:`Change window: Wed 02:00–04:00 BRT.`},{id:`t3`,title:`Blast radius for ADR-006 violation?`,preview:`The sync call added in PR #7421…`,starred:!0}],u=[{id:`t4`,title:`KYC doc validation parallelism`,preview:`You can run validations concurrently if…`},{id:`t5`,title:`Fraud score null pointer root cause`,preview:`user_agent was not sanitised before…`}],d=[{id:`t6`,title:`ADR-002 — async-first rationale`,preview:`The decision was driven by the need to…`},{id:`t7`,title:`Canary rollback playbook review`,preview:`Step 1: kubectl rollout undo…`},{id:`t8`,title:`ClickHouse schema for audit trail`,preview:"Recommended partition key is `event_date`…"}],f={title:`AI/History`,component:o,tags:[`autodocs`],parameters:{docs:{description:{component:'A 280 px sidebar rail for conversation history. Renders a "New chat" CTA, a search field, and date-bucketed thread groups (Today / Yesterday / Older). Inline rename and delete are exposed on hover via `HistoryItem`. `HistoryShell` is a backward-compat alias.'}}},args:{fluid:!1,query:``,showActions:!0},argTypes:{fluid:{control:`boolean`,description:`Fill container width — use inside slide-out drawers.`},query:{control:`text`,description:`Pre-populate the search field and highlight matches.`},showActions:{control:`boolean`,description:`Show the panel-toggle icon button.`}}},p={render:e=>(0,c.jsxs)(o,{...e,children:[(0,c.jsx)(r,{label:`Today`,threads:l}),(0,c.jsx)(r,{label:`Yesterday`,threads:u}),(0,c.jsx)(r,{label:`Last 7 days`,threads:d})]})},m={render:e=>(0,c.jsx)(o,{...e})},h={args:{fluid:!0},render:e=>(0,c.jsx)(`div`,{style:{width:320},children:(0,c.jsxs)(o,{...e,children:[(0,c.jsx)(r,{label:`Today`,threads:l}),(0,c.jsx)(r,{label:`Yesterday`,threads:u})]})})},g={args:{query:`bureau`},render:e=>(0,c.jsxs)(o,{...e,children:[(0,c.jsx)(r,{label:`Today`,threads:l,query:e.query}),(0,c.jsx)(r,{label:`Yesterday`,threads:u,query:e.query}),(0,c.jsx)(r,{label:`Last 7 days`,threads:d,query:e.query})]})},_={name:`HistoryShell (alias)`,render:()=>(0,c.jsx)(i,{children:(0,c.jsx)(r,{label:`Today`,threads:l})})},v={name:`HistoryItem — active + starred`,render:()=>(0,c.jsxs)(`div`,{style:{width:280,border:`1px solid var(--border)`,borderRadius:`var(--radius)`},children:[(0,c.jsx)(a,{thread:{id:`t1`,title:`Biometric step-up auth flow`,preview:`High-risk auth requires…`,active:!0,starred:!0}}),(0,c.jsx)(a,{thread:{id:`t2`,title:`Ledger batching performance`,preview:`BTREE batch inserts improved p95…`}})]})},y={name:`HistoryGroup — standalone`,render:()=>(0,c.jsx)(`div`,{style:{width:280,border:`1px solid var(--border)`,borderRadius:`var(--radius)`},children:(0,c.jsx)(r,{label:`Today`,threads:l})})},b={render:()=>(0,c.jsxs)(`div`,{style:{display:`flex`,height:520,fontFamily:`var(--font-sans)`},children:[(0,c.jsxs)(o,{showActions:!0,children:[(0,c.jsx)(r,{label:`Today`,threads:l}),(0,c.jsx)(r,{label:`Yesterday`,threads:u}),(0,c.jsx)(r,{label:`Last 7 days`,threads:d})]}),(0,c.jsx)(`div`,{style:{flex:1,display:`flex`,alignItems:`center`,justifyContent:`center`,color:`var(--fg-muted)`,fontSize:13,borderInlineStart:`1px solid var(--border)`},children:`Chat area`})]})},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <History {...args}>
      <HistoryGroup label="Today" threads={TODAY_THREADS} />
      <HistoryGroup label="Yesterday" threads={YESTERDAY_THREADS} />
      <HistoryGroup label="Last 7 days" threads={OLDER_THREADS} />
    </History>
}`,...p.parameters?.docs?.source},description:{story:`Default rail with three date buckets.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <History {...args} />
}`,...m.parameters?.docs?.source},description:{story:`Empty state — no threads yet.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    fluid: true
  },
  render: args => <div style={{
    width: 320
  }}>
      <History {...args}>
        <HistoryGroup label="Today" threads={TODAY_THREADS} />
        <HistoryGroup label="Yesterday" threads={YESTERDAY_THREADS} />
      </History>
    </div>
}`,...h.parameters?.docs?.source},description:{story:`Fluid — for a slide-out panel or full-page layout.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    query: 'bureau'
  },
  render: args => <History {...args}>
      <HistoryGroup label="Today" threads={TODAY_THREADS} query={args.query} />
      <HistoryGroup label="Yesterday" threads={YESTERDAY_THREADS} query={args.query} />
      <HistoryGroup label="Last 7 days" threads={OLDER_THREADS} query={args.query} />
    </History>
}`,...g.parameters?.docs?.source},description:{story:`With a search query active — the matched substring is highlighted in ember.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: 'HistoryShell (alias)',
  render: () => <HistoryShell>
      <HistoryGroup label="Today" threads={TODAY_THREADS} />
    </HistoryShell>
}`,..._.parameters?.docs?.source},description:{story:`HistoryShell — canonical alias, identical rendering.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: 'HistoryItem — active + starred',
  render: () => <div style={{
    width: 280,
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)'
  }}>
      <HistoryItem thread={{
      id: 't1',
      title: 'Biometric step-up auth flow',
      preview: 'High-risk auth requires…',
      active: true,
      starred: true
    }} />
      <HistoryItem thread={{
      id: 't2',
      title: 'Ledger batching performance',
      preview: 'BTREE batch inserts improved p95…'
    }} />
    </div>
}`,...v.parameters?.docs?.source},description:{story:`Single HistoryItem — active + starred state.`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: 'HistoryGroup — standalone',
  render: () => <div style={{
    width: 280,
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)'
  }}>
      <HistoryGroup label="Today" threads={TODAY_THREADS} />
    </div>
}`,...y.parameters?.docs?.source},description:{story:`Single HistoryGroup — date-bucket header + rows.`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    height: 520,
    fontFamily: 'var(--font-sans)'
  }}>
      <History showActions>
        <HistoryGroup label="Today" threads={TODAY_THREADS} />
        <HistoryGroup label="Yesterday" threads={YESTERDAY_THREADS} />
        <HistoryGroup label="Last 7 days" threads={OLDER_THREADS} />
      </History>
      <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--fg-muted)',
      fontSize: 13,
      borderInlineStart: '1px solid var(--border)'
    }}>
        Chat area
      </div>
    </div>
}`,...b.parameters?.docs?.source},description:{story:`In context — simulates the full AI sidebar layout.`,...b.parameters?.docs?.description}}},x=[`Default`,`Empty`,`Fluid`,`WithSearch`,`ShellAlias`,`ItemActiveStarred`,`GroupStandalone`,`InContext`]}))();export{p as Default,m as Empty,h as Fluid,y as GroupStandalone,b as InContext,v as ItemActiveStarred,_ as ShellAlias,g as WithSearch,x as __namedExportsOrder,f as default};