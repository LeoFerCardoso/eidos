import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{Fr as r,Pr as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m;e((()=>{t(),a(),o=n(),s={title:`AI/Prose`,component:i,tags:[`autodocs`],parameters:{docs:{description:{component:"The `.ai-prose` editorial surface for rendered model markdown — headings, lists, inline code, links, tables, blockquotes. Pass already-rendered ReactNodes as children (e.g. react-markdown output). When `streaming`, the component marks the region `aria-live/aria-busy` and trails an animated caret on the last block."}}},args:{streaming:!1},argTypes:{streaming:{control:`boolean`,description:`Append a streaming caret and set aria-live.`},as:{control:`text`,description:`Wrapper element tag (default "div").`}}},c={render:e=>(0,o.jsxs)(i,{...e,children:[(0,o.jsx)(`h2`,{children:`Pix Router — Ring 2 canary assessment`}),(0,o.jsxs)(`p`,{children:[`The current p95 latency is `,(0,o.jsx)(`code`,{children:`89 ms`}),`, which is`,` `,(0,o.jsx)(`strong`,{children:`well within`}),` the 250 ms SLO threshold. The canary is at 62% production traffic with no error-rate anomaly.`]}),(0,o.jsx)(`h3`,{children:`Key observations`}),(0,o.jsxs)(`ul`,{children:[(0,o.jsx)(`li`,{children:`Idempotency keys added in PR #7421 prevent duplicate Pix transactions on retry.`}),(0,o.jsxs)(`li`,{children:[`Blast radius is bounded to Ring 0→2; Ring 3 and 4 remain on `,(0,o.jsx)(`code`,{children:`v2.6.1`}),`.`]}),(0,o.jsx)(`li`,{children:`No SAST findings in the new changeset.`})]}),(0,o.jsxs)(`p`,{children:[`Recommendation: proceed to Ring 3 unless p95 exceeds`,` `,(0,o.jsx)(`code`,{children:`180 ms`}),` in the next 10 minutes.`]})]})},l={args:{streaming:!0},render:e=>(0,o.jsx)(i,{...e,children:(0,o.jsxs)(`p`,{children:[`The bureau-gateway p95 is currently at `,(0,o.jsx)(`code`,{children:`218 ms`}),`, approaching the SLO limit`]})})},u={name:`With ProseCode block`,render:e=>(0,o.jsxs)(i,{...e,children:[(0,o.jsx)(`p`,{children:`To roll back the bureau-gateway deployment, run:`}),(0,o.jsx)(r,{lang:`bash`,children:`helm rollback bureau-gateway 0 --namespace production
kubectl rollout status deployment/bureau-gateway -n production`}),(0,o.jsx)(`p`,{children:`The rollback should complete in under 60 seconds.`})]})},d={name:`ProseCode — standalone`,render:()=>(0,o.jsx)(r,{lang:`typescript`,children:`async function deployRing(ring: number, service: string): Promise<void> {
  await k8s.rollout({ service, ring, canary: ring < 3 });
}`})},f={name:`ProseCode — languages`,render:()=>(0,o.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:12},children:[(0,o.jsx)(r,{lang:`bash`,children:`kubectl get pods -n production -l app=pix-router`}),(0,o.jsx)(r,{lang:`json`,children:`{
  "service": "pix-router",
  "ring": 2,
  "p95": 89,
  "slo": 250
}`}),(0,o.jsx)(r,{lang:`python`,children:`df["user_agent"].isna().sum()  # → 37`})]})},p={render:()=>(0,o.jsx)(`div`,{style:{maxWidth:560,border:`1px solid var(--border)`,borderRadius:`var(--radius-lg)`,padding:`14px 16px`,fontFamily:`var(--font-sans)`,background:`var(--surface)`},children:(0,o.jsxs)(i,{children:[(0,o.jsxs)(`p`,{children:[`Based on the current telemetry, `,(0,o.jsx)(`strong`,{children:`pix-router`}),` is healthy. The canary reached Ring 2 with p95 `,(0,o.jsx)(`code`,{children:`89 ms`}),`.`]}),(0,o.jsx)(r,{lang:`bash`,children:`kubectl rollout status deployment/pix-router -n production`}),(0,o.jsx)(`p`,{children:`Proceed to Ring 3 when ready.`})]})})},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: args => <Prose {...args}>
      <h2>Pix Router — Ring 2 canary assessment</h2>
      <p>
        The current p95 latency is <code>89 ms</code>, which is{' '}
        <strong>well within</strong> the 250 ms SLO threshold.
        The canary is at 62% production traffic with no error-rate anomaly.
      </p>
      <h3>Key observations</h3>
      <ul>
        <li>Idempotency keys added in PR #7421 prevent duplicate Pix transactions on retry.</li>
        <li>Blast radius is bounded to Ring 0→2; Ring 3 and 4 remain on <code>v2.6.1</code>.</li>
        <li>No SAST findings in the new changeset.</li>
      </ul>
      <p>
        Recommendation: proceed to Ring 3 unless p95 exceeds{' '}
        <code>180 ms</code> in the next 10 minutes.
      </p>
    </Prose>
}`,...c.parameters?.docs?.source},description:{story:`Typical model response with headings, list, and inline code.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    streaming: true
  },
  render: args => <Prose {...args}>
      <p>
        The bureau-gateway p95 is currently at <code>218 ms</code>, approaching the SLO limit
      </p>
    </Prose>
}`,...l.parameters?.docs?.source},description:{story:`Streaming — caret trails the last rendered character.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: 'With ProseCode block',
  render: args => <Prose {...args}>
      <p>To roll back the bureau-gateway deployment, run:</p>
      <ProseCode lang="bash">
        {\`helm rollback bureau-gateway 0 --namespace production\\nkubectl rollout status deployment/bureau-gateway -n production\`}
      </ProseCode>
      <p>The rollback should complete in under 60 seconds.</p>
    </Prose>
}`,...u.parameters?.docs?.source},description:{story:`With a ProseCode block — mono header, copy button, pre body.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: 'ProseCode — standalone',
  render: () => <ProseCode lang="typescript">
      {\`async function deployRing(ring: number, service: string): Promise<void> {\\n  await k8s.rollout({ service, ring, canary: ring < 3 });\\n}\`}
    </ProseCode>
}`,...d.parameters?.docs?.source},description:{story:`ProseCode standalone — with copy button.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: 'ProseCode — languages',
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  }}>
      <ProseCode lang="bash">{'kubectl get pods -n production -l app=pix-router'}</ProseCode>
      <ProseCode lang="json">{'{\\n  "service": "pix-router",\\n  "ring": 2,\\n  "p95": 89,\\n  "slo": 250\\n}'}</ProseCode>
      <ProseCode lang="python">{'df["user_agent"].isna().sum()  # → 37'}</ProseCode>
    </div>
}`,...f.parameters?.docs?.source},description:{story:`ProseCode — multiple languages.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    maxWidth: 560,
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '14px 16px',
    fontFamily: 'var(--font-sans)',
    background: 'var(--surface)'
  }}>
      <Prose>
        <p>
          Based on the current telemetry, <strong>pix-router</strong> is healthy.
          The canary reached Ring 2 with p95 <code>89 ms</code>.
        </p>
        <ProseCode lang="bash">{'kubectl rollout status deployment/pix-router -n production'}</ProseCode>
        <p>Proceed to Ring 3 when ready.</p>
      </Prose>
    </div>
}`,...p.parameters?.docs?.source},description:{story:`In context — prose inside a chat bubble.`,...p.parameters?.docs?.description}}},m=[`Default`,`Streaming`,`WithCodeBlock`,`ProseCodeStandalone`,`ProseCodeLanguages`,`InContext`]}))();export{c as Default,p as InContext,f as ProseCodeLanguages,d as ProseCodeStandalone,l as Streaming,u as WithCodeBlock,m as __namedExportsOrder,s as default};