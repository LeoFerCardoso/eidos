import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Jn as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h,g,_,v,y;e((()=>{o=t(n(),1),a(),s=r(),c=[{id:1,domain:`docs.forge.internal`,title:`Fraud Engine — Feature Store Runbook`,url:`https://docs.forge.internal/fraud-engine/feature-store-runbook`,snippet:`The feature store serves pre-computed signals at p99 < 4 ms under normal load. When cache TTL expires during a high-throughput window, the fallback path adds ~120 ms.`,fetched:`14:01 · 18s ago`},{id:2,domain:`alerts.forge.internal`,title:`INC-9812 — High p95 Latency · Fraud Engine`,url:`https://alerts.forge.internal/incidents/INC-9812`,snippet:`Detected 14:02 BRT. Scoring chain retried 3× before circuit breaker opened. Affected 0.4 % of Pix transactions over 11 minutes.`,fetched:`14:02 · 17s ago`},{id:3,domain:`registry.forge.internal`,title:`fraud-engine v3.4.7 — Release Notes`,url:`https://registry.forge.internal/fraud-engine/releases/v3.4.7`,snippet:`Adds graceful degradation when the feature store is unavailable. Falls back to the last known good snapshot instead of retrying.`,fetched:`14:00 · 2m ago`},{id:4,domain:`dash.forge.internal`,title:`SLO Dashboard — Fraud Engine · Pix Router`,url:`https://dash.forge.internal/services/fraud-engine/slo`,snippet:`Error budget burn rate reached 3.1× for 9 consecutive minutes. Auto-rollback threshold is 4× — manual rollback was initiated.`,fetched:`14:03 · 1m ago`},{id:5,domain:`wiki.forge.internal`,title:`Circuit Breaker Configuration Reference`,url:`https://wiki.forge.internal/reliability/circuit-breaker`,snippet:`Half-open probes are sent every 30 s. Recovery is confirmed after 3 consecutive healthy probes. Tune RETRY_BUDGET for burst-sensitive services.`}],l=[{id:1,domain:`deploy.forge.internal`,title:`Canary Deploy — pix-router v4.2.1 · ring-0`,url:`https://deploy.forge.internal/pipelines/pix-router/4.2.1`,snippet:`Ring-0 shift-left at 09:15. Error rate stable at 0.02 %; no latency regression. Promoted to ring-1 at 09:45.`,fetched:`09:45 · 5m ago`},{id:2,domain:`metrics.forge.internal`,title:`pix-router — Canary vs Stable Comparison`,url:`https://metrics.forge.internal/canary/pix-router/4.2.1`,snippet:`p50 / p95 / p99 latency unchanged across both cohorts. Throughput delta < 0.1 %. Memory footprint reduced by 18 MB (GC pressure fix).`,fetched:`09:50 · 1m ago`},{id:3,domain:`changelog.forge.internal`,title:`pix-router v4.2.1 — Changelog`,url:`https://changelog.forge.internal/pix-router/4.2.1`,snippet:`Removes legacy PSP adapter. Adds idempotency key validation for duplicate-payment protection. Patches CVE-2025-11042 in the HTTP client.`}],u=[{id:1,domain:`docs.forge.internal`,title:`Agent Memory — Design Reference`,url:`https://docs.forge.internal/ai/agent-memory`,snippet:`Episodic memory is scoped per conversation turn. Semantic memory is stored in the vector index and retrieved via ANN.`,fetched:`11:30 · 4s ago`}],d={title:`AI/SourcesPanel`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:"A numbered panel listing the retrieved documents that ground a model response. Each entry shows domain, title, snippet, and optional freshness timestamp. Use it directly below the assistant message whenever the response was augmented with retrieval; pair inline `Citation` chips with the same source objects so rank numbers stay in sync."}}}},f={args:{sources:c.slice(0,3),title:`Sources`,collapsible:!0,defaultOpen:!0}},p={args:{sources:l,title:`Sources`,collapsible:!1}},m={args:{sources:c,title:`Sources`,collapsible:!0,defaultOpen:!1}},h={args:{sources:u,title:`Sources`,collapsible:!0,defaultOpen:!0}},g={args:{sources:c,title:`Sources`,collapsible:!1,perPage:3}},_={render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:32,maxWidth:560},children:[(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`p`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,marginBottom:8,letterSpacing:`0.04em`,textTransform:`uppercase`},children:`Collapsible · open`}),(0,s.jsx)(i,{sources:c.slice(0,3),title:`Sources`,collapsible:!0,defaultOpen:!0})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`p`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,marginBottom:8,letterSpacing:`0.04em`,textTransform:`uppercase`},children:`Collapsible · collapsed`}),(0,s.jsx)(i,{sources:c.slice(0,3),title:`Sources`,collapsible:!0,defaultOpen:!1})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`p`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,marginBottom:8,letterSpacing:`0.04em`,textTransform:`uppercase`},children:`Non-collapsible · custom label`}),(0,s.jsx)(i,{sources:l,title:`Deploy context`,countNoun:`references`,collapsible:!1})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`p`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,marginBottom:8,letterSpacing:`0.04em`,textTransform:`uppercase`},children:`Paginated · perPage=2`}),(0,s.jsx)(i,{sources:c,title:`Sources`,collapsible:!1,perPage:2})]})]})},v={render:()=>{let[e,t]=o.useState(null);return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:16,maxWidth:560},children:[(0,s.jsx)(i,{sources:c.slice(0,4),title:`Retrieved documents`,countNoun:`documents`,collapsible:!1,onSelect:e=>t(e.title)}),e&&(0,s.jsxs)(`p`,{style:{fontSize:13,color:`var(--fg-muted)`,fontFamily:`var(--font-mono)`},children:[`Selected: `,e]})]})}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    sources: FRAUD_SOURCES.slice(0, 3),
    title: 'Sources',
    collapsible: true,
    defaultOpen: true
  }
}`,...f.parameters?.docs?.source},description:{story:`Default — collapsible panel open with three incident-related sources.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    sources: DEPLOY_SOURCES,
    title: 'Sources',
    collapsible: false
  }
}`,...p.parameters?.docs?.source},description:{story:`Non-collapsible — panel header is a static label; ideal inside a sidebar or
a wide assistant turn where vertical space is not constrained.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    sources: FRAUD_SOURCES,
    title: 'Sources',
    collapsible: true,
    defaultOpen: false
  }
}`,...m.parameters?.docs?.source},description:{story:`Collapsed on load — use when the answer is self-contained and sources are
supplementary. The user expands on demand.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    sources: MINIMAL_SOURCES,
    title: 'Sources',
    collapsible: true,
    defaultOpen: true
  }
}`,...h.parameters?.docs?.source},description:{story:`Single source — minimal state when the model cites exactly one document.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    sources: FRAUD_SOURCES,
    title: 'Sources',
    collapsible: false,
    perPage: 3
  }
}`,...g.parameters?.docs?.source},description:{story:"Paginated — more than 5 sources triggers the built-in pager; page size can\nbe overridden via `perPage`.",...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
    maxWidth: 560
  }}>
      <div>
        <p style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg-muted)',
        marginBottom: 8,
        letterSpacing: '0.04em',
        textTransform: 'uppercase'
      }}>
          Collapsible · open
        </p>
        <SourcesPanel sources={FRAUD_SOURCES.slice(0, 3)} title="Sources" collapsible defaultOpen />
      </div>
      <div>
        <p style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg-muted)',
        marginBottom: 8,
        letterSpacing: '0.04em',
        textTransform: 'uppercase'
      }}>
          Collapsible · collapsed
        </p>
        <SourcesPanel sources={FRAUD_SOURCES.slice(0, 3)} title="Sources" collapsible defaultOpen={false} />
      </div>
      <div>
        <p style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg-muted)',
        marginBottom: 8,
        letterSpacing: '0.04em',
        textTransform: 'uppercase'
      }}>
          Non-collapsible · custom label
        </p>
        <SourcesPanel sources={DEPLOY_SOURCES} title="Deploy context" countNoun="references" collapsible={false} />
      </div>
      <div>
        <p style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg-muted)',
        marginBottom: 8,
        letterSpacing: '0.04em',
        textTransform: 'uppercase'
      }}>
          Paginated · perPage=2
        </p>
        <SourcesPanel sources={FRAUD_SOURCES} title="Sources" collapsible={false} perPage={2} />
      </div>
    </div>
}`,..._.parameters?.docs?.source},description:{story:`Variants side by side — open vs collapsed, standard vs custom label.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [selected, setSelected] = React.useState<string | null>(null);
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      maxWidth: 560
    }}>
        <SourcesPanel sources={FRAUD_SOURCES.slice(0, 4)} title="Retrieved documents" countNoun="documents" collapsible={false} onSelect={s => setSelected(s.title)} />
        {selected && <p style={{
        fontSize: 13,
        color: 'var(--fg-muted)',
        fontFamily: 'var(--font-mono)'
      }}>
            Selected: {selected}
          </p>}
      </div>;
  }
}`,...v.parameters?.docs?.source},description:{story:`Interactive — live onSelect intercept; clicking a source fires a handler
instead of opening the URL. Useful when results feed a detail drawer.`,...v.parameters?.docs?.description}}},y=[`Default`,`NonCollapsible`,`CollapsedByDefault`,`SingleSource`,`Paginated`,`Variants`,`WithSelectHandler`]}))();export{m as CollapsedByDefault,f as Default,p as NonCollapsible,g as Paginated,h as SingleSource,_ as Variants,v as WithSelectHandler,y as __namedExportsOrder,d as default};