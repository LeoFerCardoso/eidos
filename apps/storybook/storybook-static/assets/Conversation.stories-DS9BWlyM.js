import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Er as i,Tr as a,t as o,wr as s}from"./src-DgoylXRw.js";var c,l,u,d,f,p,m,h;e((()=>{c=t(n(),1),o(),l=r(),u={title:`AI/Conversation`,component:s,tags:[`autodocs`],parameters:{docs:{description:{component:"The thread shell: a bordered, internally-scrolling container that stacks Messages and snaps to the newest turn. Pass `title` for the header bar; `tall` for a taller viewport."}}},args:{title:`Incident · pix-router`,tall:!1},argTypes:{title:{control:`text`},tall:{control:`boolean`}}},d={args:{children:(0,l.jsxs)(`div`,{className:`conv-body`,style:{padding:`16px 0`},children:[(0,l.jsx)(a,{from:`user`,userAvatar:{initials:`LM`,name:`Leonardo Mariga`},children:`What's causing the p95 spike on pix-router?`}),(0,l.jsxs)(a,{from:`assistant`,children:[`PR #7421 introduced a synchronous call to `,(0,l.jsx)(`code`,{children:`bureau-gateway`}),` on the hot path, pushing latency past the 200 ms SLO.`]})]})}},f={args:{tall:!0,children:(0,l.jsxs)(`div`,{className:`conv-body`,style:{padding:`16px 0`},children:[(0,l.jsx)(a,{from:`user`,userAvatar:{initials:`RM`,name:`Rafael Mendonça`},children:`Is it safe to promote pix-router 2.7.0 to Ring 3?`}),(0,l.jsx)(a,{from:`assistant`,children:`Not yet — the canary at Ring 2 is showing a p99 regression of ~120 ms. Hold until the next metrics window (ETA 12 min).`}),(0,l.jsx)(a,{from:`user`,userAvatar:{initials:`RM`,name:`Rafael Mendonça`},children:`Can you watch it and notify me when it's clear?`}),(0,l.jsx)(a,{from:`assistant`,streaming:!0,children:`Watching Ring 2 canary metrics`})]})}},p={args:{title:void 0,children:(0,l.jsxs)(`div`,{className:`conv-body`,style:{padding:`16px 0`},children:[(0,l.jsx)(a,{from:`assistant`,children:`Context loaded: 18 services, 8 active incidents, 24 deploys in flight.`}),(0,l.jsx)(a,{from:`user`,userAvatar:{initials:`CT`,name:`Camila Tanaka`},children:`Summarise the top risk this week.`})]})}},m={render:()=>{function e(){let[e,t]=c.useState(null);return(0,l.jsx)(s,{title:`Forge AI · Engineering Intelligence`,children:(0,l.jsxs)(`div`,{className:`conv-body`,style:{padding:`16px 0`},children:[(0,l.jsx)(a,{from:`user`,userAvatar:{initials:`LM`,name:`Leonardo Mariga`},children:`Which T1 services are at risk of breaching SLO this week?`}),(0,l.jsxs)(a,{from:`assistant`,meta:(0,l.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:`Forge AI · Sonnet 4.6 · just now`}),actions:(0,l.jsx)(i,{vote:e,onVote:t,onCopy:()=>{},onRegen:()=>{}}),children:[`Two services are at elevated risk: `,(0,l.jsx)(`strong`,{children:`pix-router`}),` (p95 89 ms, trending up after PR #7421) and `,(0,l.jsx)(`strong`,{children:`bureau-gateway`}),` (p95 218 ms, a GMUD-gated schema migration is scheduled for Tuesday 01:00 BRT). All other T1 services are within normal operating ranges.`]}),(0,l.jsx)(a,{from:`user`,userAvatar:{initials:`LM`,name:`Leonardo Mariga`},children:`Open a risk summary for both and tag the owners.`}),(0,l.jsx)(a,{from:`assistant`,streaming:!0,children:`Drafting risk summaries for pix-router and bureau-gateway`})]})})}return(0,l.jsx)(e,{})}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    children: <div className="conv-body" style={{
      padding: '16px 0'
    }}>
        <Message from="user" userAvatar={{
        initials: 'LM',
        name: 'Leonardo Mariga'
      }}>
          What's causing the p95 spike on pix-router?
        </Message>
        <Message from="assistant">
          PR #7421 introduced a synchronous call to <code>bureau-gateway</code> on the hot path,
          pushing latency past the 200 ms SLO.
        </Message>
      </div>
  }
}`,...d.parameters?.docs?.source},description:{story:`Shell with a title header and two messages.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    tall: true,
    children: <div className="conv-body" style={{
      padding: '16px 0'
    }}>
        <Message from="user" userAvatar={{
        initials: 'RM',
        name: 'Rafael Mendonça'
      }}>
          Is it safe to promote pix-router 2.7.0 to Ring 3?
        </Message>
        <Message from="assistant">
          Not yet — the canary at Ring 2 is showing a p99 regression of ~120 ms.
          Hold until the next metrics window (ETA 12 min).
        </Message>
        <Message from="user" userAvatar={{
        initials: 'RM',
        name: 'Rafael Mendonça'
      }}>
          Can you watch it and notify me when it's clear?
        </Message>
        <Message from="assistant" streaming>
          Watching Ring 2 canary metrics
        </Message>
      </div>
  }
}`,...f.parameters?.docs?.source},description:{story:`Tall modifier — useful for longer threads.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    title: undefined,
    children: <div className="conv-body" style={{
      padding: '16px 0'
    }}>
        <Message from="assistant">
          Context loaded: 18 services, 8 active incidents, 24 deploys in flight.
        </Message>
        <Message from="user" userAvatar={{
        initials: 'CT',
        name: 'Camila Tanaka'
      }}>
          Summarise the top risk this week.
        </Message>
      </div>
  }
}`,...p.parameters?.docs?.source},description:{story:`No title — body-only shell for embedded surfaces.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    function Thread() {
      const [vote, setVote] = React.useState<'up' | 'down' | null>(null);
      return <Conversation title="Forge AI · Engineering Intelligence">
          <div className="conv-body" style={{
          padding: '16px 0'
        }}>
            <Message from="user" userAvatar={{
            initials: 'LM',
            name: 'Leonardo Mariga'
          }}>
              Which T1 services are at risk of breaching SLO this week?
            </Message>
            <Message from="assistant" meta={<span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--fg-muted)'
          }}>
                  Forge AI · Sonnet 4.6 · just now
                </span>} actions={<MessageActions vote={vote} onVote={setVote} onCopy={() => {}} onRegen={() => {}} />}>
              Two services are at elevated risk: <strong>pix-router</strong> (p95 89 ms, trending
              up after PR #7421) and <strong>bureau-gateway</strong> (p95 218 ms, a GMUD-gated
              schema migration is scheduled for Tuesday 01:00 BRT). All other T1 services are
              within normal operating ranges.
            </Message>
            <Message from="user" userAvatar={{
            initials: 'LM',
            name: 'Leonardo Mariga'
          }}>
              Open a risk summary for both and tag the owners.
            </Message>
            <Message from="assistant" streaming>
              Drafting risk summaries for pix-router and bureau-gateway
            </Message>
          </div>
        </Conversation>;
    }
    return <Thread />;
  }
}`,...m.parameters?.docs?.source},description:{story:`Full interactive thread with vote actions.`,...m.parameters?.docs?.description}}},h=[`Default`,`Tall`,`NoTitle`,`InContext`]}))();export{d as Default,m as InContext,p as NoTitle,f as Tall,h as __namedExportsOrder,u as default};