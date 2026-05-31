import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Er as i,Tr as a,t as o,wr as s}from"./src-DgoylXRw.js";var c,l,u,d,f,p,m,h,g,_,v,y,b,x,S;e((()=>{c=t(n(),1),o(),l=r(),u={title:`AI/Message`,component:a,tags:[`autodocs`],parameters:{docs:{description:{component:"One turn of a chat thread. Drives alignment, avatar, and bubble fill via the `from` role. Supports streaming, attachments, errors, and an actions toolbar slot."}}},args:{from:`assistant`,variant:`bubble`,avatar:!0,streaming:!1},argTypes:{from:{control:`inline-radio`,options:[`user`,`assistant`,`system`]},variant:{control:`inline-radio`,options:[`bubble`,`compact`,`plain`]},streaming:{control:`boolean`},avatar:{control:`boolean`},error:{control:`text`},meta:{control:`text`,description:`Caption row above the bubble.`}}},d={args:{from:`assistant`,children:`The pix-router introduced a synchronous call to bureau-gateway, which violates ADR-006 (async-first inter-tribe communication) and increases p95 latency by ~80 ms under load.`}},f={args:{from:`user`,userAvatar:{initials:`LM`,name:`Leonardo Mariga`},children:`What’s the blast radius if we roll back the ledger-svc now?`}},p={args:{from:`system`,children:`Context loaded: 18 services, 24 active deploys, incident window open.`}},m={args:{from:`assistant`,variant:`compact`,children:`Coverage delta: +1.2 %. Risk score: 34. Blast radius bounded to Ring 0→2.`}},h={args:{from:`assistant`,variant:`plain`,children:`Drift detected: fraud-engine reads from ml-feature-store without a circuit breaker.`}},g={args:{from:`assistant`,streaming:!0,children:`Analysing the decision tree refactor in PR #7419`}},_={args:{from:`assistant`,error:`Context window exceeded — try a shorter prompt.`,children:`I was unable to complete the analysis.`}},v={args:{from:`user`,userAvatar:{initials:`BO`,name:`Beatriz Okamoto`},attachments:[{name:`fraud-trace.json`,size:`2.1 KB`,kind:`file`},{name:`screenshot.png`,size:`148 KB`,kind:`image`}],children:`Anything odd in this trace?`}},y={args:{from:`assistant`,actions:(0,l.jsx)(i,{onCopy:()=>{},onRegen:()=>{},onVote:()=>{},vote:null}),children:`The consent-vault bump carries zero blast radius — Rust edition conflicts are resolved.`}},b={args:{from:`assistant`,meta:(0,l.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:`Forge AI · just now`}),children:`I found 3 ADR violations in the current sprint. Want me to open draft issues?`}},x={render:()=>{function e(){let[e,t]=c.useState(null);return(0,l.jsx)(s,{title:`Incident · pix-router p95 spike`,children:(0,l.jsxs)(`div`,{className:`conv-body`,style:{padding:`16px 0`},children:[(0,l.jsx)(a,{from:`user`,userAvatar:{initials:`LM`,name:`Leonardo Mariga`},children:`What's causing the p95 spike on pix-router? We're at 480 ms, SLO is 200 ms.`}),(0,l.jsxs)(a,{from:`assistant`,meta:(0,l.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:`Forge AI · now`}),actions:(0,l.jsx)(i,{vote:e,onVote:t,onCopy:()=>{},onRegen:()=>{}}),children:[`PR #7421 introduced a synchronous call to `,(0,l.jsx)(`code`,{children:`bureau-gateway`}),` on the hot path. Bureau's p95 is 218 ms — adding that to pix-router's baseline pushes you past the SLO. Rolling back to 2.6.9 should restore normal latency within one ring cycle (~8 min).`]}),(0,l.jsx)(a,{from:`user`,userAvatar:{initials:`LM`,name:`Leonardo Mariga`},children:`Do we have a GMUD open for that rollback?`}),(0,l.jsx)(a,{from:`assistant`,streaming:!0,children:`Checking the change management log`})]})})}return(0,l.jsx)(e,{})}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    from: 'assistant',
    children: 'The pix-router introduced a synchronous call to bureau-gateway, which violates ADR-006 (async-first inter-tribe communication) and increases p95 latency by ~80 ms under load.'
  }
}`,...d.parameters?.docs?.source},description:{story:`Default assistant bubble with body text.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    from: 'user',
    userAvatar: {
      initials: 'LM',
      name: 'Leonardo Mariga'
    },
    children: 'What’s the blast radius if we roll back the ledger-svc now?'
  }
}`,...f.parameters?.docs?.source},description:{story:`User turn — right-aligned with the user avatar.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    from: 'system',
    children: 'Context loaded: 18 services, 24 active deploys, incident window open.'
  }
}`,...p.parameters?.docs?.source},description:{story:`System message — no avatar, minimal chrome.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    from: 'assistant',
    variant: 'compact',
    children: 'Coverage delta: +1.2 %. Risk score: 34. Blast radius bounded to Ring 0→2.'
  }
}`,...m.parameters?.docs?.source},description:{story:`Compact variant — reduced padding, tighter font.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    from: 'assistant',
    variant: 'plain',
    children: 'Drift detected: fraud-engine reads from ml-feature-store without a circuit breaker.'
  }
}`,...h.parameters?.docs?.source},description:{story:`Plain variant — no bubble shell at all.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    from: 'assistant',
    streaming: true,
    children: 'Analysing the decision tree refactor in PR #7419'
  }
}`,...g.parameters?.docs?.source},description:{story:`Streaming state — blinking caret trails the body.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    from: 'assistant',
    error: 'Context window exceeded — try a shorter prompt.',
    children: 'I was unable to complete the analysis.'
  }
}`,..._.parameters?.docs?.source},description:{story:`Error state — danger-toned bubble with an error ribbon below.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    from: 'user',
    userAvatar: {
      initials: 'BO',
      name: 'Beatriz Okamoto'
    },
    attachments: [{
      name: 'fraud-trace.json',
      size: '2.1 KB',
      kind: 'file'
    }, {
      name: 'screenshot.png',
      size: '148 KB',
      kind: 'image'
    }],
    children: 'Anything odd in this trace?'
  }
}`,...v.parameters?.docs?.source},description:{story:`With file and image attachments rendered as chips.`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    from: 'assistant',
    actions: <MessageActions onCopy={() => {}} onRegen={() => {}} onVote={() => {}} vote={null} />,
    children: 'The consent-vault bump carries zero blast radius — Rust edition conflicts are resolved.'
  }
}`,...y.parameters?.docs?.source},description:{story:`With the canonical MessageActions toolbar.`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    from: 'assistant',
    meta: <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--fg-muted)'
    }}>Forge AI · just now</span>,
    children: 'I found 3 ADR violations in the current sprint. Want me to open draft issues?'
  }
}`,...b.parameters?.docs?.source},description:{story:`Meta caption row above the bubble — typically speaker name + timestamp.`,...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => {
    function Thread() {
      const [vote, setVote] = React.useState<'up' | 'down' | null>(null);
      return <Conversation title="Incident · pix-router p95 spike">
          <div className="conv-body" style={{
          padding: '16px 0'
        }}>
            <Message from="user" userAvatar={{
            initials: 'LM',
            name: 'Leonardo Mariga'
          }}>
              What's causing the p95 spike on pix-router? We're at 480 ms, SLO is 200 ms.
            </Message>
            <Message from="assistant" meta={<span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--fg-muted)'
          }}>
                  Forge AI · now
                </span>} actions={<MessageActions vote={vote} onVote={setVote} onCopy={() => {}} onRegen={() => {}} />}>
              PR #7421 introduced a synchronous call to <code>bureau-gateway</code> on
              the hot path. Bureau's p95 is 218 ms — adding that to pix-router's baseline
              pushes you past the SLO. Rolling back to 2.6.9 should restore normal latency
              within one ring cycle (~8 min).
            </Message>
            <Message from="user" userAvatar={{
            initials: 'LM',
            name: 'Leonardo Mariga'
          }}>
              Do we have a GMUD open for that rollback?
            </Message>
            <Message from="assistant" streaming>
              Checking the change management log
            </Message>
          </div>
        </Conversation>;
    }
    return <Thread />;
  }
}`,...x.parameters?.docs?.source},description:{story:`A realistic back-and-forth thread composed with Conversation.`,...x.parameters?.docs?.description}}},S=[`Default`,`UserTurn`,`SystemMessage`,`Compact`,`Plain`,`Streaming`,`WithError`,`WithAttachments`,`WithActions`,`WithMeta`,`InContext`]}))();export{m as Compact,d as Default,x as InContext,h as Plain,g as Streaming,p as SystemMessage,f as UserTurn,y as WithActions,v as WithAttachments,_ as WithError,b as WithMeta,S as __namedExportsOrder,u as default};