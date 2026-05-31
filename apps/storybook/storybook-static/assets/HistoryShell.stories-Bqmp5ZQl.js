import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{An as r,Mn as i,jn as a,t as o}from"./src-DgoylXRw.js";var s,c,l,u,d,f,p,m,h,g,_;e((()=>{t(),o(),s=n(),c=[{id:`thr-1`,title:`Pix Router latency spike — root cause`,preview:`Analyzed p95 latency regression in fraud-engine after 14:02 deploy`,active:!0,starred:!0},{id:`thr-2`,title:`Rollback strategy for payments-api v4.2.1`,preview:`Drafted staged rollback plan with ring-0 canary validation`}],l=[{id:`thr-3`,title:`Auth service token expiry edge cases`,preview:`Reviewed JWT refresh-token overlap window with 5s clock skew`,starred:!0},{id:`thr-4`,title:`INC-9812 timeline reconstruction`,preview:`Mapped alert → detection → mitigation events from runbook logs`}],u=[{id:`thr-5`,title:`Deploy pipeline for feature/risk-score-v2`,preview:`Generated GitHub Actions workflow with approval gates per ring`},{id:`thr-6`,title:`Infra cost attribution — Q2 review`,preview:`Summarised EC2 vs Fargate spend by BU for FinOps meeting`},{id:`thr-7`,title:`Observability stack for new ML endpoints`,preview:`Recommended OTEL + Prometheus scrape config for scoring service`}],d={title:`AI/HistoryShell`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:'A 280 px sidebar rail that houses the full conversation history. Renders a "New chat" CTA, a search field, and thread rows bucketed by recency (Today / Yesterday / Last week). Use it as the left rail of an AI chat layout; pass `fluid` when mounting inside a slide-out drawer so it fills the drawer width.'}}},args:{fluid:!1,query:``,showActions:!0},argTypes:{fluid:{control:`boolean`},showActions:{control:`boolean`},query:{control:`text`}}},f={render:e=>(0,s.jsx)(`div`,{style:{display:`flex`,width:280},children:(0,s.jsx)(i,{...e,children:(0,s.jsxs)(`div`,{className:`ai-hist-list`,children:[(0,s.jsx)(r,{label:`Today`,threads:c}),(0,s.jsx)(r,{label:`Yesterday`,threads:l}),(0,s.jsx)(r,{label:`Last week`,threads:u})]})})})},p={render:e=>(0,s.jsx)(`div`,{style:{display:`flex`,width:280},children:(0,s.jsx)(i,{...e,children:(0,s.jsx)(`div`,{className:`ai-hist-list`,children:(0,s.jsxs)(`div`,{className:`ai-hist-empty`,children:[(0,s.jsx)(`span`,{children:`No history yet`}),(0,s.jsx)(`span`,{children:`Start a new chat to begin`})]})})})})},m={args:{query:`rollback`},render:e=>(0,s.jsx)(`div`,{style:{display:`flex`,width:280},children:(0,s.jsx)(i,{...e,children:(0,s.jsxs)(`div`,{className:`ai-hist-list`,children:[(0,s.jsx)(r,{label:`Today`,threads:c,query:e.query}),(0,s.jsx)(r,{label:`Yesterday`,threads:l,query:e.query})]})})})},h={args:{fluid:!0},render:e=>(0,s.jsx)(`div`,{style:{display:`flex`,width:`100%`,maxWidth:360},children:(0,s.jsx)(i,{...e,children:(0,s.jsxs)(`div`,{className:`ai-hist-list`,children:[(0,s.jsx)(r,{label:`Today`,threads:c}),(0,s.jsx)(r,{label:`Yesterday`,threads:l})]})})})},g={parameters:{layout:`fullscreen`},render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,gap:24,padding:24,alignItems:`flex-start`,flexWrap:`wrap`},children:[(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`p`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,marginBottom:8,textTransform:`uppercase`,letterSpacing:`0.06em`},children:`Default`}),(0,s.jsx)(`div`,{style:{width:280},children:(0,s.jsx)(i,{children:(0,s.jsxs)(`div`,{className:`ai-hist-list`,children:[(0,s.jsx)(r,{label:`Today`,threads:c}),(0,s.jsx)(r,{label:`Yesterday`,threads:l}),(0,s.jsx)(r,{label:`Last week`,threads:u})]})})})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`p`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,marginBottom:8,textTransform:`uppercase`,letterSpacing:`0.06em`},children:`Search active`}),(0,s.jsx)(`div`,{style:{width:280},children:(0,s.jsx)(i,{query:`deploy`,children:(0,s.jsxs)(`div`,{className:`ai-hist-list`,children:[(0,s.jsx)(r,{label:`Today`,threads:c,query:`deploy`}),(0,s.jsx)(r,{label:`Last week`,threads:u,query:`deploy`})]})})})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`p`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,marginBottom:8,textTransform:`uppercase`,letterSpacing:`0.06em`},children:`showActions=false`}),(0,s.jsx)(`div`,{style:{width:280},children:(0,s.jsx)(i,{showActions:!1,children:(0,s.jsxs)(`div`,{className:`ai-hist-list`,children:[(0,s.jsx)(r,{label:`Today`,threads:c}),(0,s.jsx)(r,{label:`Yesterday`,threads:l})]})})})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`p`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,marginBottom:8,textTransform:`uppercase`,letterSpacing:`0.06em`},children:`Item states`}),(0,s.jsxs)(`div`,{style:{width:280,border:`1px solid var(--border)`,borderRadius:6,overflow:`hidden`},children:[(0,s.jsx)(a,{thread:{id:`st-1`,title:`Active — fraud-engine debug session`,preview:`Currently open thread`,active:!0}}),(0,s.jsx)(a,{thread:{id:`st-2`,title:`Starred — INC-9812 timeline`,preview:`Pinned for quick access`,starred:!0}}),(0,s.jsx)(a,{thread:{id:`st-3`,title:`Regular thread`,preview:`No special state applied`}})]})]})]})},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    display: 'flex',
    width: 280
  }}>
      <HistoryShell {...args}>
        <div className="ai-hist-list">
          <HistoryGroup label="Today" threads={TODAY_THREADS} />
          <HistoryGroup label="Yesterday" threads={YESTERDAY_THREADS} />
          <HistoryGroup label="Last week" threads={LAST_WEEK_THREADS} />
        </div>
      </HistoryShell>
    </div>
}`,...f.parameters?.docs?.source},description:{story:`Default rail — three recency buckets with realistic agent/DevEx thread titles.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    display: 'flex',
    width: 280
  }}>
      <HistoryShell {...args}>
        <div className="ai-hist-list">
          <div className="ai-hist-empty">
            <span>No history yet</span>
            <span>Start a new chat to begin</span>
          </div>
        </div>
      </HistoryShell>
    </div>
}`,...p.parameters?.docs?.source},description:{story:`Empty state — no threads yet; the rail shows only the CTA and search field.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    query: 'rollback'
  },
  render: args => <div style={{
    display: 'flex',
    width: 280
  }}>
      <HistoryShell {...args}>
        <div className="ai-hist-list">
          <HistoryGroup label="Today" threads={TODAY_THREADS} query={args.query} />
          <HistoryGroup label="Yesterday" threads={YESTERDAY_THREADS} query={args.query} />
        </div>
      </HistoryShell>
    </div>
}`,...m.parameters?.docs?.source},description:{story:`Search active — query pre-populates the search field and highlights matching substrings in thread titles.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    fluid: true
  },
  render: args => <div style={{
    display: 'flex',
    width: '100%',
    maxWidth: 360
  }}>
      <HistoryShell {...args}>
        <div className="ai-hist-list">
          <HistoryGroup label="Today" threads={TODAY_THREADS} />
          <HistoryGroup label="Yesterday" threads={YESTERDAY_THREADS} />
        </div>
      </HistoryShell>
    </div>
}`,...h.parameters?.docs?.source},description:{story:`Fluid — fills container width; use inside slide-out drawers or mobile viewports.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  parameters: {
    layout: 'fullscreen'
  },
  render: () => <div style={{
    display: 'flex',
    gap: 24,
    padding: 24,
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  }}>
      {/* Default — fixed width, panel toggle visible */}
      <div>
        <p style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg-muted)',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: '0.06em'
      }}>
          Default
        </p>
        <div style={{
        width: 280
      }}>
          <HistoryShell>
            <div className="ai-hist-list">
              <HistoryGroup label="Today" threads={TODAY_THREADS} />
              <HistoryGroup label="Yesterday" threads={YESTERDAY_THREADS} />
              <HistoryGroup label="Last week" threads={LAST_WEEK_THREADS} />
            </div>
          </HistoryShell>
        </div>
      </div>

      {/* Search active */}
      <div>
        <p style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg-muted)',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: '0.06em'
      }}>
          Search active
        </p>
        <div style={{
        width: 280
      }}>
          <HistoryShell query="deploy">
            <div className="ai-hist-list">
              <HistoryGroup label="Today" threads={TODAY_THREADS} query="deploy" />
              <HistoryGroup label="Last week" threads={LAST_WEEK_THREADS} query="deploy" />
            </div>
          </HistoryShell>
        </div>
      </div>

      {/* No panel-toggle action */}
      <div>
        <p style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg-muted)',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: '0.06em'
      }}>
          showActions=false
        </p>
        <div style={{
        width: 280
      }}>
          <HistoryShell showActions={false}>
            <div className="ai-hist-list">
              <HistoryGroup label="Today" threads={TODAY_THREADS} />
              <HistoryGroup label="Yesterday" threads={YESTERDAY_THREADS} />
            </div>
          </HistoryShell>
        </div>
      </div>

      {/* Individual HistoryItem states */}
      <div>
        <p style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg-muted)',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: '0.06em'
      }}>
          Item states
        </p>
        <div style={{
        width: 280,
        border: '1px solid var(--border)',
        borderRadius: 6,
        overflow: 'hidden'
      }}>
          <HistoryItem thread={{
          id: 'st-1',
          title: 'Active — fraud-engine debug session',
          preview: 'Currently open thread',
          active: true
        }} />
          <HistoryItem thread={{
          id: 'st-2',
          title: 'Starred — INC-9812 timeline',
          preview: 'Pinned for quick access',
          starred: true
        }} />
          <HistoryItem thread={{
          id: 'st-3',
          title: 'Regular thread',
          preview: 'No special state applied'
        }} />
        </div>
      </div>
    </div>
}`,...g.parameters?.docs?.source},description:{story:`Variants side-by-side — default rail, fluid rail with search active, and rail
without the panel-toggle action button. Covers the key prop combinations in one view.`,...g.parameters?.docs?.description}}},_=[`Default`,`Empty`,`SearchActive`,`Fluid`,`Variants`]}))();export{f as Default,p as Empty,h as Fluid,m as SearchActive,g as Variants,_ as __namedExportsOrder,d as default};