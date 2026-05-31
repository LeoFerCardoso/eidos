import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{Kn as r,t as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u,d,f,p,m,h,g,_;e((()=>{t(),i(),a=n(),o={id:1,domain:`docs.forgeplatform.io`,title:`Pix Router — Ring deployment model`,url:`https://docs.forgeplatform.io/pix-router/rings`,snippet:`The ring deployment model gates each release through a sequence of traffic slices (Ring 0–4) with automatic rollback on SLO breach.`,fetched:`14:01 · 18s ago`},s={id:2,domain:`github.com`,title:`PR #7421 · idempotency keys for retries`,url:`https://github.com/org/pix-router/pull/7421`,snippet:`Adds idempotency keys to all outbound Pix calls to prevent duplicate transactions on retry. Risk score: 34 / low.`,fetched:`14:01 · 20s ago`},c={id:3,domain:`confluence.internal`,title:`ADR-006 — async-first inter-tribe communication`,url:`https://confluence.internal/adr/006`,snippet:`All inter-tribe calls MUST be async (event-bus) unless the use case is user-facing and latency-sensitive.`,fetched:`14:02 · 1m ago`},l={id:4,domain:`grafana.internal`,title:`bureau-gateway p95 latency dashboard`,url:`https://grafana.internal/d/bureau-gw`,snippet:`p95 latency: 218 ms. SLO threshold: 250 ms. Current health: green.`,fetched:`14:02 · 1m ago`},u={id:5,domain:`runbooks.forgeplatform.io`,title:`Bureau Gateway · Provider failover`,url:`https://runbooks.forgeplatform.io/bureau-failover`,snippet:"Execute the failover by toggling the `BUREAU_PROVIDER` feature flag to the secondary endpoint."},d={title:`AI/Citation`,component:r,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:'An inline superscript chip that opens a hover/focus popover with the source domain, title, snippet, and URL. Use `tone="ember"` for grounded model claims backed by a retrieved source; use `tone="neutral"` for ungrounded or low-confidence references. Pair with the `Sources` panel — chip rank `n` must match the panel entry rank.'}}},args:{n:1,source:o,tone:`ember`},argTypes:{n:{control:`number`},tone:{control:`inline-radio`,options:[`ember`,`neutral`]},href:{control:`text`}}},f={render:e=>(0,a.jsxs)(`p`,{style:{fontFamily:`var(--font-sans)`,fontSize:14,lineHeight:1.7,color:`var(--fg)`,margin:0},children:[`The Pix Router uses a ring-based deployment model`,(0,a.jsx)(r,{...e}),` `,`that gates each release through traffic slices (Ring 0–4) with automatic SLO rollback.`]})},p={name:`Tone variants`,parameters:{docs:{description:{story:"`ember` matches the accent and signals a retrieval-grounded claim. `neutral` uses a muted treatment for unverified or low-confidence references."}}},render:()=>(0,a.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:20,fontFamily:`var(--font-sans)`,fontSize:14,lineHeight:1.7,color:`var(--fg)`},children:[(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`span`,{style:{display:`block`,fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`,marginBottom:6},children:`tone="ember" — grounded claim`}),(0,a.jsxs)(`p`,{style:{margin:0},children:[`The ring model automatically rolls back deployments that breach their SLO`,(0,a.jsx)(r,{n:1,source:o,tone:`ember`}),` `,`within one ring cycle (~8 min).`]})]}),(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`span`,{style:{display:`block`,fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`,marginBottom:6},children:`tone="neutral" — ungrounded reference`}),(0,a.jsxs)(`p`,{style:{margin:0},children:[`Based on general platform convention`,(0,a.jsx)(r,{n:2,tone:`neutral`}),` `,`cross-tribe calls should prefer the async event-bus path.`]})]}),(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`span`,{style:{display:`block`,fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`,marginBottom:6},children:`no source prop — popover silenced`}),(0,a.jsxs)(`p`,{style:{margin:0},children:[`See ADR-006`,(0,a.jsx)(r,{n:3,tone:`ember`}),` `,`for the authoritative definition of async-first inter-tribe communication.`]})]})]})},m={name:`Multiple inline chips`,parameters:{docs:{description:{story:"Shows four citation chips in one response paragraph. Each chip `n` maps to its corresponding entry in the `Sources` panel — never re-rank after grounding."}}},render:()=>(0,a.jsxs)(`p`,{style:{maxWidth:620,fontFamily:`var(--font-sans)`,fontSize:14,lineHeight:1.7,color:`var(--fg)`,margin:0},children:[`Three changes shipped together: the ring deployment model`,(0,a.jsx)(r,{n:1,source:o}),` `,`gates rollout, PR #7421 adds idempotency keys`,(0,a.jsx)(r,{n:2,source:s}),` `,`to prevent duplicate transactions, ADR-006`,(0,a.jsx)(r,{n:3,source:c}),` `,`mandates async-first calls, and bureau-gateway p95 was already at 218 ms`,(0,a.jsx)(r,{n:4,source:l}),` `,`before the retry budget change amplified load.`]})},h={name:`Source without timestamp`,args:{n:5,source:u,tone:`ember`},render:e=>(0,a.jsxs)(`p`,{style:{fontFamily:`var(--font-sans)`,fontSize:14,lineHeight:1.7,color:`var(--fg)`,margin:0},children:[`Trigger provider failover via the feature flag`,(0,a.jsx)(r,{...e}),` `,`documented in the Bureau Gateway runbook.`]})},g={name:`Custom href override`,args:{n:1,source:o,href:`https://docs.forgeplatform.io/pix-router/changelog`,tone:`ember`},render:e=>(0,a.jsxs)(`p`,{style:{fontFamily:`var(--font-sans)`,fontSize:14,lineHeight:1.7,color:`var(--fg)`,margin:0},children:[`The ring model changelog tracks every deployment decision`,(0,a.jsx)(r,{...e}),` `,`with diffable config snapshots.`]})},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <p style={{
    fontFamily: 'var(--font-sans)',
    fontSize: 14,
    lineHeight: 1.7,
    color: 'var(--fg)',
    margin: 0
  }}>
      The Pix Router uses a ring-based deployment model
      <Citation {...args} />
      {' '}that gates each release through traffic slices (Ring 0–4) with
      automatic SLO rollback.
    </p>
}`,...f.parameters?.docs?.source},description:{story:`Default — ember chip with a source popover. Hover or focus the chip to reveal the popover.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: 'Tone variants',
  parameters: {
    docs: {
      description: {
        story: '\`ember\` matches the accent and signals a retrieval-grounded claim. ' + '\`neutral\` uses a muted treatment for unverified or low-confidence references.'
      }
    }
  },
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    fontFamily: 'var(--font-sans)',
    fontSize: 14,
    lineHeight: 1.7,
    color: 'var(--fg)'
  }}>
      {/* Ember — grounded */}
      <div>
        <span style={{
        display: 'block',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)',
        marginBottom: 6
      }}>
          tone=&quot;ember&quot; — grounded claim
        </span>
        <p style={{
        margin: 0
      }}>
          The ring model automatically rolls back deployments that breach their SLO
          <Citation n={1} source={SRC_RINGS} tone="ember" />
          {' '}within one ring cycle (~8 min).
        </p>
      </div>

      {/* Neutral — ungrounded */}
      <div>
        <span style={{
        display: 'block',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)',
        marginBottom: 6
      }}>
          tone=&quot;neutral&quot; — ungrounded reference
        </span>
        <p style={{
        margin: 0
      }}>
          Based on general platform convention
          <Citation n={2} tone="neutral" />
          {' '}cross-tribe calls should prefer the async event-bus path.
        </p>
      </div>

      {/* No popover — source omitted */}
      <div>
        <span style={{
        display: 'block',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)',
        marginBottom: 6
      }}>
          no source prop — popover silenced
        </span>
        <p style={{
        margin: 0
      }}>
          See ADR-006
          <Citation n={3} tone="ember" />
          {' '}for the authoritative definition of async-first inter-tribe communication.
        </p>
      </div>
    </div>
}`,...p.parameters?.docs?.source},description:{story:`Tone variants — ember (grounded claim) vs neutral (ungrounded or low-confidence).`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: 'Multiple inline chips',
  parameters: {
    docs: {
      description: {
        story: 'Shows four citation chips in one response paragraph. Each chip \`n\` maps to its ' + 'corresponding entry in the \`Sources\` panel — never re-rank after grounding.'
      }
    }
  },
  render: () => <p style={{
    maxWidth: 620,
    fontFamily: 'var(--font-sans)',
    fontSize: 14,
    lineHeight: 1.7,
    color: 'var(--fg)',
    margin: 0
  }}>
      Three changes shipped together: the ring deployment model
      <Citation n={1} source={SRC_RINGS} />
      {' '}gates rollout, PR #7421 adds idempotency keys
      <Citation n={2} source={SRC_IDEMPOTENCY} />
      {' '}to prevent duplicate transactions, ADR-006
      <Citation n={3} source={SRC_ADR} />
      {' '}mandates async-first calls, and bureau-gateway p95 was already at 218 ms
      <Citation n={4} source={SRC_LATENCY} />
      {' '}before the retry budget change amplified load.
    </p>
}`,...m.parameters?.docs?.source},description:{story:`Multiple chips — four inline citations in a single response paragraph.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: 'Source without timestamp',
  args: {
    n: 5,
    source: SRC_NO_FETCH,
    tone: 'ember'
  },
  render: args => <p style={{
    fontFamily: 'var(--font-sans)',
    fontSize: 14,
    lineHeight: 1.7,
    color: 'var(--fg)',
    margin: 0
  }}>
      Trigger provider failover via the feature flag
      <Citation {...args} />
      {' '}documented in the Bureau Gateway runbook.
    </p>
}`,...h.parameters?.docs?.source},description:{story:"Source without fetched timestamp — `fetched` is optional; footer omits the clock row.",...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: 'Custom href override',
  args: {
    n: 1,
    source: SRC_RINGS,
    href: 'https://docs.forgeplatform.io/pix-router/changelog',
    tone: 'ember'
  },
  render: args => <p style={{
    fontFamily: 'var(--font-sans)',
    fontSize: 14,
    lineHeight: 1.7,
    color: 'var(--fg)',
    margin: 0
  }}>
      The ring model changelog tracks every deployment decision
      <Citation {...args} />
      {' '}with diffable config snapshots.
    </p>
}`,...g.parameters?.docs?.source},description:{story:`href override — link target is overridden independently of source.url.`,...g.parameters?.docs?.description}}},_=[`Default`,`Variants`,`MultipleInline`,`NoFetchedTimestamp`,`HrefOverride`]}))();export{f as Default,g as HrefOverride,m as MultipleInline,h as NoFetchedTimestamp,p as Variants,_ as __namedExportsOrder,d as default};