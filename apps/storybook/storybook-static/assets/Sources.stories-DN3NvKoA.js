import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Jn as i,Kn as a,qn as o,t as s}from"./src-DgoylXRw.js";var c,l,u,d,f,p,m,h,g,_,v,y,b,x;e((()=>{c=t(n(),1),s(),l=r(),u=[{id:1,domain:`docs.forgeplatform.io`,title:`Pix Router — Ring deployment model`,url:`https://docs.forgeplatform.io/pix-router/rings`,snippet:`The ring deployment model gates each release through a sequence of traffic slices (Ring 0–4) with automatic rollback on SLO breach.`,fetched:`14:01 · 18s ago`},{id:2,domain:`github.com`,title:`PR #7421 · idempotency keys for retries`,url:`https://github.com/org/pix-router/pull/7421`,snippet:`Adds idempotency keys to all outbound Pix calls to prevent duplicate transactions on retry. Risk score: 34 / low.`,fetched:`14:01 · 20s ago`},{id:3,domain:`confluence.internal`,title:`ADR-006 — async-first inter-tribe communication`,url:`https://confluence.internal/adr/006`,snippet:`All inter-tribe calls MUST be async (event-bus) unless the use case is user-facing and latency-sensitive.`,fetched:`14:02 · 1m ago`},{id:4,domain:`grafana.internal`,title:`bureau-gateway p95 latency dashboard`,url:`https://grafana.internal/d/bureau-gw`,snippet:`p95 latency: 218 ms. SLO threshold: 250 ms. Current health: green.`,fetched:`14:02 · 1m ago`},{id:5,domain:`runbooks.forgeplatform.io`,title:`Bureau Gateway · Provider failover`,url:`https://runbooks.forgeplatform.io/bureau-failover`,snippet:"Execute the failover by toggling the `BUREAU_PROVIDER` feature flag to the secondary endpoint.",fetched:`14:03 · 2m ago`},{id:6,domain:`docs.forgeplatform.io`,title:`Fraud Engine — null user_agent handling`,url:`https://docs.forgeplatform.io/fraud-engine/known-issues`,snippet:`When user_agent is null the scoring pipeline raises a NullPointerException. Fixed in v3.4.7.`,fetched:`14:03 · 2m ago`}],d={title:`AI/Sources`,component:o,tags:[`autodocs`],parameters:{docs:{description:{component:"A numbered sources panel rendered below an AI response, pairing with `Citation` inline chips. Supports collapsible disclosure, pagination, and an optional `onSelect` intercept. `SourcesPanel` is a backward-compat alias."}}},args:{title:`Sources`,collapsible:!0,defaultOpen:!0,countNoun:`findings`,perPage:5},argTypes:{title:{control:`text`},collapsible:{control:`boolean`},defaultOpen:{control:`boolean`},countNoun:{control:`text`},perPage:{control:`number`}}},f={render:e=>{function t(){let[t,n]=c.useState(``);return(0,l.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:8},children:[(0,l.jsx)(o,{sources:u,title:e.title,collapsible:e.collapsible??!0,defaultOpen:!1,countNoun:e.countNoun,perPage:e.perPage??3,onSelect:e=>n(e.title)}),(0,l.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`,minHeight:16},children:t?`selected: ${t}`:`click a source to select`})]})}return(0,l.jsx)(t,{})},args:{sources:u}},p={name:`Collapsed on load`,args:{sources:u,defaultOpen:!1}},m={args:{sources:u.slice(0,3),collapsible:!1}},h={args:{sources:u,perPage:3}},g={name:`SourcesPanel (alias)`,render:()=>(0,l.jsx)(i,{sources:u.slice(0,3)})},_={name:`Citation — ember (grounded)`,render:()=>(0,l.jsxs)(`p`,{style:{fontFamily:`var(--font-sans)`,fontSize:14,lineHeight:1.6,color:`var(--fg)`},children:[`The Pix Router uses a ring-based deployment model`,(0,l.jsx)(a,{n:1,source:u[0],tone:`ember`}),` `,`that gates each release through traffic slices with automatic SLO rollback.`]})},v={name:`Citation — neutral (ungrounded)`,render:()=>(0,l.jsxs)(`p`,{style:{fontFamily:`var(--font-sans)`,fontSize:14,lineHeight:1.6,color:`var(--fg)`},children:[`Based on general documentation`,(0,l.jsx)(a,{n:1,tone:`neutral`}),` `,`the recommended approach is async-first communication.`]})},y={render:()=>(0,l.jsxs)(`div`,{style:{maxWidth:640,fontFamily:`var(--font-sans)`,display:`flex`,flexDirection:`column`,gap:16},children:[(0,l.jsxs)(`p`,{style:{fontSize:14,lineHeight:1.7,color:`var(--fg)`,margin:0},children:[`The Pix Router uses a ring deployment model`,(0,l.jsx)(a,{n:1,source:u[0]}),` `,`where PR #7421 adds idempotency keys`,(0,l.jsx)(a,{n:2,source:u[1]}),` `,`to prevent duplicate transactions. This change is bounded to Ring 0→2 and respects ADR-006`,(0,l.jsx)(a,{n:3,source:u[2]}),` `,`for async-first inter-tribe communication.`]}),(0,l.jsx)(o,{sources:u,title:`Sources`})]})},b={name:`Response with inline citations`,parameters:{docs:{description:{story:`The canonical grounded-answer pattern: a Response component with inline Citation chips in its body, followed by a Sources panel. Chip numbers map directly to panel entries — never re-rank.`}}},render:()=>{function e(){let[e,t]=c.useState(null);return(0,l.jsxs)(`div`,{style:{maxWidth:680,display:`flex`,flexDirection:`column`,gap:16},children:[(0,l.jsx)(`div`,{className:`ai-resp assistant`,role:`article`,"aria-roledescription":`assistant response`,children:(0,l.jsxs)(`div`,{className:`ai-resp-stack`,children:[(0,l.jsx)(`div`,{className:`ai-resp-meta`,style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:`Forge AI · Sonnet 4.6 · just now`}),(0,l.jsxs)(`div`,{className:`ai-prose`,children:[(0,l.jsx)(`h3`,{children:`What caused the pix-router p95 spike?`}),(0,l.jsxs)(`p`,{children:[`Three things shipped together — none broke in isolation, but their interaction is why on-call paged at 02:14`,(0,l.jsx)(a,{n:1,source:u[0]}),`.`]}),(0,l.jsxs)(`ul`,{children:[(0,l.jsxs)(`li`,{children:[(0,l.jsx)(`b`,{children:`gRPC retry budget`}),` bumped from `,(0,l.jsx)(`code`,{children:`3`}),` to `,(0,l.jsx)(`code`,{children:`8`}),` in`,` `,(0,l.jsx)(`code`,{children:`config/grpc.toml`}),(0,l.jsx)(a,{n:2,source:u[1]}),`.`]}),(0,l.jsxs)(`li`,{children:[(0,l.jsx)(`b`,{children:`identity-svc pool`}),` doubled (16 → 32) to absorb the migration burst`,(0,l.jsx)(a,{n:3,source:u[2]}),`.`]}),(0,l.jsxs)(`li`,{children:[(0,l.jsx)(`b`,{children:`Datadog metric rename`}),` — old alert binding silently broke`,(0,l.jsx)(a,{n:4,source:u[3]}),`.`]})]}),(0,l.jsxs)(`p`,{children:[`Bureau gateway p95 was already at 218 ms`,(0,l.jsx)(a,{n:4,source:u[3]}),` `,`— adding the retry amplification pushed pix-router past its 200 ms SLO. Rolling back to 2.6.9 restores normal latency within one ring cycle (~8 min).`]})]}),(0,l.jsxs)(`div`,{className:`ai-resp-actions`,style:{display:`flex`,gap:4,marginTop:8},children:[(0,l.jsx)(`button`,{className:`ai-resp-action`,title:`Copy`,children:`⧉`}),(0,l.jsx)(`button`,{className:`ai-resp-action thumb-up`+(e===`up`?` is-on`:``),"aria-pressed":e===`up`,onClick:()=>t(e=>e===`up`?null:`up`),title:`Helpful`,children:`✓`}),(0,l.jsx)(`button`,{className:`ai-resp-action thumb-down`+(e===`down`?` is-on`:``),"aria-pressed":e===`down`,onClick:()=>t(e=>e===`down`?null:`down`),title:`Not helpful`,children:`✕`})]})]})}),(0,l.jsx)(o,{sources:u,title:`Sources`,defaultOpen:!0,collapsible:!0})]})}return(0,l.jsx)(e,{})}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => {
    function Demo() {
      const [selected, setSelected] = React.useState('');
      return <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}>
          <Sources sources={SOURCES} title={args.title} collapsible={args.collapsible ?? true} defaultOpen={false} countNoun={args.countNoun} perPage={args.perPage ?? 3} onSelect={s => setSelected(s.title)} />
          <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--fg-muted)',
          minHeight: 16
        }}>
            {selected ? \`selected: \${selected}\` : 'click a source to select'}
          </span>
        </div>;
    }
    return <Demo />;
  },
  args: {
    sources: SOURCES
  }
}`,...f.parameters?.docs?.source},description:{story:`Default — collapsible panel (starts closed). Click the header to expand/collapse;
 click a source row to select it. The selected title is shown below.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: 'Collapsed on load',
  args: {
    sources: SOURCES,
    defaultOpen: false
  }
}`,...p.parameters?.docs?.source},description:{story:`Collapsed on load.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    sources: SOURCES.slice(0, 3),
    collapsible: false
  }
}`,...m.parameters?.docs?.source},description:{story:`Non-collapsible — panel header is a div, not a button.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    sources: SOURCES,
    perPage: 3
  }
}`,...h.parameters?.docs?.source},description:{story:`Paginated — more sources than the perPage limit.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: 'SourcesPanel (alias)',
  render: () => <SourcesPanel sources={SOURCES.slice(0, 3)} />
}`,...g.parameters?.docs?.source},description:{story:`SourcesPanel alias — identical to Sources.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: 'Citation — ember (grounded)',
  render: () => <p style={{
    fontFamily: 'var(--font-sans)',
    fontSize: 14,
    lineHeight: 1.6,
    color: 'var(--fg)'
  }}>
      The Pix Router uses a ring-based deployment model
      <Citation n={1} source={SOURCES[0]} tone="ember" />{' '}
      that gates each release through traffic slices with automatic SLO rollback.
    </p>
}`,..._.parameters?.docs?.source},description:{story:`Citation — inline ember chip with hover popover.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: 'Citation — neutral (ungrounded)',
  render: () => <p style={{
    fontFamily: 'var(--font-sans)',
    fontSize: 14,
    lineHeight: 1.6,
    color: 'var(--fg)'
  }}>
      Based on general documentation
      <Citation n={1} tone="neutral" />{' '}
      the recommended approach is async-first communication.
    </p>
}`,...v.parameters?.docs?.source},description:{story:`Citation — neutral chip (ungrounded reference).`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    maxWidth: 640,
    fontFamily: 'var(--font-sans)',
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  }}>
      <p style={{
      fontSize: 14,
      lineHeight: 1.7,
      color: 'var(--fg)',
      margin: 0
    }}>
        The Pix Router uses a ring deployment model
        <Citation n={1} source={SOURCES[0]} />{' '}
        where PR #7421 adds idempotency keys
        <Citation n={2} source={SOURCES[1]} />{' '}
        to prevent duplicate transactions. This change is bounded to Ring 0→2 and respects
        ADR-006
        <Citation n={3} source={SOURCES[2]} />{' '}
        for async-first inter-tribe communication.
      </p>
      <Sources sources={SOURCES} title="Sources" />
    </div>
}`,...y.parameters?.docs?.source},description:{story:`In context — response prose with inline citations + panel.`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: 'Response with inline citations',
  parameters: {
    docs: {
      description: {
        story: 'The canonical grounded-answer pattern: a Response component with inline Citation ' + 'chips in its body, followed by a Sources panel. Chip numbers map directly to ' + 'panel entries — never re-rank.'
      }
    }
  },
  render: () => {
    function Demo() {
      const [vote, setVote] = React.useState<'up' | 'down' | null>(null);
      return <div style={{
        maxWidth: 680,
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>
          {/* Response with inline citations */}
          <div className="ai-resp assistant" role="article" aria-roledescription="assistant response">
            <div className="ai-resp-stack">
              <div className="ai-resp-meta" style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--fg-muted)'
            }}>
                Forge AI · Sonnet 4.6 · just now
              </div>
              <div className="ai-prose">
                <h3>What caused the pix-router p95 spike?</h3>
                <p>
                  Three things shipped together — none broke in isolation, but their interaction
                  is why on-call paged at 02:14<Citation n={1} source={SOURCES[0]} />.
                </p>
                <ul>
                  <li>
                    <b>gRPC retry budget</b> bumped from <code>3</code> to <code>8</code> in{' '}
                    <code>config/grpc.toml</code><Citation n={2} source={SOURCES[1]} />.
                  </li>
                  <li>
                    <b>identity-svc pool</b> doubled (16 → 32) to absorb the migration
                    burst<Citation n={3} source={SOURCES[2]} />.
                  </li>
                  <li>
                    <b>Datadog metric rename</b> — old alert binding silently
                    broke<Citation n={4} source={SOURCES[3]} />.
                  </li>
                </ul>
                <p>
                  Bureau gateway p95 was already at 218 ms<Citation n={4} source={SOURCES[3]} />{' '}
                  — adding the retry amplification pushed pix-router past its 200 ms SLO.
                  Rolling back to 2.6.9 restores normal latency within one ring cycle (~8 min).
                </p>
              </div>
              <div className="ai-resp-actions" style={{
              display: 'flex',
              gap: 4,
              marginTop: 8
            }}>
                <button className="ai-resp-action" title="Copy">⧉</button>
                <button className={'ai-resp-action thumb-up' + (vote === 'up' ? ' is-on' : '')} aria-pressed={vote === 'up'} onClick={() => setVote(v => v === 'up' ? null : 'up')} title="Helpful">✓</button>
                <button className={'ai-resp-action thumb-down' + (vote === 'down' ? ' is-on' : '')} aria-pressed={vote === 'down'} onClick={() => setVote(v => v === 'down' ? null : 'down')} title="Not helpful">✕</button>
              </div>
            </div>
          </div>
          {/* Sources panel */}
          <Sources sources={SOURCES} title="Sources" defaultOpen collapsible />
        </div>;
    }
    return <Demo />;
  }
}`,...b.parameters?.docs?.source},description:{story:`Response message with inline citations — the canonical grounded-answer pattern.`,...b.parameters?.docs?.description}}},x=[`Default`,`DefaultClosed`,`NotCollapsible`,`Paginated`,`SourcesPanelAlias`,`CitationEmber`,`CitationNeutral`,`InContext`,`ResponseWithCitations`]}))();export{_ as CitationEmber,v as CitationNeutral,f as Default,p as DefaultClosed,y as InContext,m as NotCollapsible,h as Paginated,b as ResponseWithCitations,g as SourcesPanelAlias,x as __namedExportsOrder,d as default};