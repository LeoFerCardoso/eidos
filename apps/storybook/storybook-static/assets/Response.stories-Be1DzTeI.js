import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Dr as i,Er as a,t as o}from"./src-DgoylXRw.js";var s,c,l,u,d,f,p,m,h,g;e((()=>{s=t(n(),1),o(),c=r(),l={title:`AI/Response`,component:i,tags:[`autodocs`],parameters:{docs:{description:{component:`Long-form, bubble-less model output surface. Wraps content in Prose with an optional avatar, a mono meta caption row, and an actions toolbar slot. Use for document-mode or "streamdown" AI answers.`}}},args:{from:`assistant`,avatar:!1,streaming:!1},argTypes:{from:{control:`inline-radio`,options:[`assistant`,`user`]},avatar:{control:`boolean`},streaming:{control:`boolean`}}},u={args:{children:(0,c.jsxs)(`p`,{children:[`The p95 spike on `,(0,c.jsx)(`code`,{children:`pix-router`}),` is caused by a synchronous call to`,` `,(0,c.jsx)(`code`,{children:`bureau-gateway`}),` introduced in PR #7421. Bureau's p95 sits at 218 ms; combined with pix-router's baseline that pushes you past your 200 ms SLO.`]})}},d={args:{avatar:!0,botAvatar:{initials:`F`,name:`Forge AI`},children:(0,c.jsx)(`p`,{children:`Three ADR violations were found in the current sprint. Shall I open draft issues?`})}},f={args:{meta:(0,c.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:`Forge AI · Sonnet 4.6 · just now`}),children:(0,c.jsx)(`p`,{children:`Coverage delta: +1.2 %. Risk score: 34. Blast radius bounded to Ring 0→2.`})}},p={args:{streaming:!0,children:(0,c.jsx)(`p`,{children:`Analysing the decision tree refactor in PR #7419`})}},m={render:()=>{function e(){let[e,t]=s.useState(null);return(0,c.jsxs)(i,{meta:(0,c.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:`Forge AI · Sonnet 4.6 · just now`}),actions:(0,c.jsx)(a,{surface:`response`,vote:e,onVote:t,onCopy:()=>{},onRegen:()=>{},onShare:()=>{}}),children:[(0,c.jsxs)(`p`,{children:[`Rolling back `,(0,c.jsx)(`code`,{children:`pix-router`}),` to 2.6.9 should restore normal latency within one ring cycle (~8 min). The GMUD for the rollback is pre-approved as a standard emergency procedure.`]}),(0,c.jsxs)(`ul`,{children:[(0,c.jsx)(`li`,{children:`Blast radius: Ring 0 only`}),(0,c.jsx)(`li`,{children:`Rollback time: ~8 min`}),(0,c.jsx)(`li`,{children:`Risk: low (no schema changes)`})]})]})}return(0,c.jsx)(e,{})}},h={args:{from:`user`,children:(0,c.jsxs)(`p`,{children:[`Here is the trace I captured during the incident window. The latency spike appears at the `,(0,c.jsx)(`code`,{children:`bureau-gateway`}),` call site at T+14 ms.`]})}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    children: <p>
        The p95 spike on <code>pix-router</code> is caused by a synchronous call to{' '}
        <code>bureau-gateway</code> introduced in PR #7421. Bureau's p95 sits at 218 ms;
        combined with pix-router's baseline that pushes you past your 200 ms SLO.
      </p>
  }
}`,...u.parameters?.docs?.source},description:{story:`Default assistant response with prose body.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    avatar: true,
    botAvatar: {
      initials: 'F',
      name: 'Forge AI'
    },
    children: <p>Three ADR violations were found in the current sprint. Shall I open draft issues?</p>
  }
}`,...d.parameters?.docs?.source},description:{story:`With avatar rendered to the leading edge.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    meta: <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--fg-muted)'
    }}>
        Forge AI · Sonnet 4.6 · just now
      </span>,
    children: <p>Coverage delta: +1.2 %. Risk score: 34. Blast radius bounded to Ring 0→2.</p>
  }
}`,...f.parameters?.docs?.source},description:{story:`With a mono meta caption row above the body.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    streaming: true,
    children: <p>Analysing the decision tree refactor in PR #7419</p>
  }
}`,...p.parameters?.docs?.source},description:{story:`Streaming state — trailing caret on the live block.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    function Demo() {
      const [vote, setVote] = React.useState<'up' | 'down' | null>(null);
      return <Response meta={<span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)'
      }}>
              Forge AI · Sonnet 4.6 · just now
            </span>} actions={<MessageActions surface="response" vote={vote} onVote={setVote} onCopy={() => {}} onRegen={() => {}} onShare={() => {}} />}>
          <p>
            Rolling back <code>pix-router</code> to 2.6.9 should restore normal latency
            within one ring cycle (~8 min). The GMUD for the rollback is pre-approved as a
            standard emergency procedure.
          </p>
          <ul>
            <li>Blast radius: Ring 0 only</li>
            <li>Rollback time: ~8 min</li>
            <li>Risk: low (no schema changes)</li>
          </ul>
        </Response>;
    }
    return <Demo />;
  }
}`,...m.parameters?.docs?.source},description:{story:`With the response-surface MessageActions toolbar.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    from: 'user',
    children: <p>
        Here is the trace I captured during the incident window. The latency spike appears
        at the <code>bureau-gateway</code> call site at T+14 ms.
      </p>
  }
}`,...h.parameters?.docs?.source},description:{story:`User-authored content quoted through the prose system (rare).`,...h.parameters?.docs?.description}}},g=[`Default`,`WithAvatar`,`WithMeta`,`Streaming`,`WithActions`,`UserResponse`]}))();export{u as Default,p as Streaming,h as UserResponse,m as WithActions,d as WithAvatar,f as WithMeta,g as __namedExportsOrder,l as default};