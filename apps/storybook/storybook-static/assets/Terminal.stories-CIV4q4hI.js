import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{hr as r,t as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u,d,f,p,m,h,g;e((()=>{t(),i(),a=n(),o=[{kind:`note`,text:`── pix-router · Ring 2 canary ──`},{kind:`in`,text:`kubectl rollout status deployment/pix-router -n production`},{kind:`out`,text:`Waiting for deployment "pix-router" rollout to finish: 3 of 5 new replicas have been updated…`},{kind:`out`,text:`Waiting for rollout to finish: 2 old replicas are pending termination…`},{kind:`out`,text:`deployment "pix-router" successfully rolled out`},{kind:`in`,text:`kubectl get pods -n production -l app=pix-router`},{kind:`out`,text:`NAME                          READY   STATUS    RESTARTS   AGE`},{kind:`out`,text:`pix-router-7c9b8f4d9-k2pqz   1/1     Running   0          2m14s`},{kind:`out`,text:`pix-router-7c9b8f4d9-mxr7t   1/1     Running   0          2m11s`}],s=[{kind:`in`,text:`helm upgrade bureau-gateway ./charts/bureau-gateway --namespace production`},{kind:`out`,text:`Release "bureau-gateway" has been upgraded.`},{kind:`err`,text:`Error: 1 error occurred: context deadline exceeded`},{kind:`err`,text:`helm upgrade failed: deployment timed out after 300s`},{kind:`note`,text:`Rollback triggered automatically.`},{kind:`in`,text:`helm rollback bureau-gateway 0 --namespace production`},{kind:`out`,text:`Rollback was a success! Happy Helming!`}],c=[{kind:`note`,text:`── fraud-engine · SAST scan ──`},{kind:`in`,text:`semgrep scan --config auto --output semgrep-report.json`},{kind:`out`,text:`Scanning 412 files…`},{kind:`out`,text:`  [INFO] Running 312 rules across Python, TypeScript`}],l={title:`AI/Terminal`,component:r,tags:[`autodocs`],parameters:{docs:{description:{component:"A styled mono surface that pairs commands and their output — not a real emulator. Lines are typed: `in` (command with prompt), `out` (stdout), `err` (stderr, danger tone), `note` (editorial annotation). A `status` pill and optional `title` appear in the header."}}},args:{title:`session · pix-router`,status:`done`,prompt:`$`,lines:o},argTypes:{title:{control:`text`},status:{control:`inline-radio`,options:[`idle`,`running`,`done`,`error`]},prompt:{control:`text`}}},u={},d={name:`Error state`,args:{title:`session · bureau-gateway`,status:`error`,lines:s}},f={args:{title:`SAST scan · fraud-engine`,status:`running`,lines:c}},p={name:`No header`,args:{title:void 0,status:void 0,lines:[{kind:`in`,text:`git log --oneline -5`},{kind:`out`,text:`a3c1f9e feat(ledger): batch BTREE inserts`},{kind:`out`,text:`b2d4e7f fix(fraud): null user_agent`},{kind:`out`,text:`c8f2a1b chore: bump tonic 0.11`}]}},m={name:`Custom prompt (>)`,args:{title:`Python REPL`,status:`idle`,prompt:`>>>`,lines:[{kind:`in`,text:`import pandas as pd`},{kind:`in`,text:`df = pd.read_parquet("audit_log.parquet")`},{kind:`out`,text:`<DataFrame 1 024 rows × 12 columns>`},{kind:`in`,text:`df["user_agent"].isna().sum()`},{kind:`out`,text:`37`}]}},h={render:()=>(0,a.jsxs)(`div`,{style:{maxWidth:640,display:`flex`,flexDirection:`column`,gap:12,fontFamily:`var(--font-sans)`},children:[(0,a.jsx)(`p`,{style:{fontSize:13,color:`var(--fg-muted)`,margin:0},children:`The agent ran the following commands to verify the deploy:`}),(0,a.jsx)(r,{title:`session · pix-router`,status:`done`,lines:o})]})},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{}`,...u.parameters?.docs?.source},description:{story:`Successful deploy run.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: 'Error state',
  args: {
    title: 'session · bureau-gateway',
    status: 'error',
    lines: ERROR_LINES
  }
}`,...d.parameters?.docs?.source},description:{story:`Error state — failed Helm upgrade + rollback.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'SAST scan · fraud-engine',
    status: 'running',
    lines: RUNNING_LINES
  }
}`,...f.parameters?.docs?.source},description:{story:`Running — scan in progress, aria-live active.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: 'No header',
  args: {
    title: undefined,
    status: undefined,
    lines: [{
      kind: 'in',
      text: 'git log --oneline -5'
    }, {
      kind: 'out',
      text: 'a3c1f9e feat(ledger): batch BTREE inserts'
    }, {
      kind: 'out',
      text: 'b2d4e7f fix(fraud): null user_agent'
    }, {
      kind: 'out',
      text: 'c8f2a1b chore: bump tonic 0.11'
    }]
  }
}`,...p.parameters?.docs?.source},description:{story:`No header — title and status both omitted.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: 'Custom prompt (>)',
  args: {
    title: 'Python REPL',
    status: 'idle',
    prompt: '>>>',
    lines: [{
      kind: 'in',
      text: 'import pandas as pd'
    }, {
      kind: 'in',
      text: 'df = pd.read_parquet("audit_log.parquet")'
    }, {
      kind: 'out',
      text: '<DataFrame 1 024 rows × 12 columns>'
    }, {
      kind: 'in',
      text: 'df["user_agent"].isna().sum()'
    }, {
      kind: 'out',
      text: '37'
    }]
  }
}`,...m.parameters?.docs?.source},description:{story:`Custom prompt symbol — useful for PowerShell or Python REPL sessions.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    maxWidth: 640,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    fontFamily: 'var(--font-sans)'
  }}>
      <p style={{
      fontSize: 13,
      color: 'var(--fg-muted)',
      margin: 0
    }}>
        The agent ran the following commands to verify the deploy:
      </p>
      <Terminal title="session · pix-router" status="done" lines={DEPLOY_LINES} />
    </div>
}`,...h.parameters?.docs?.source},description:{story:`In context — inside an agent card in a wider layout.`,...h.parameters?.docs?.description}}},g=[`Default`,`ErrorState`,`Running`,`NoHeader`,`CustomPrompt`,`InContext`]}))();export{m as CustomPrompt,u as Default,d as ErrorState,h as InContext,p as NoHeader,f as Running,g as __namedExportsOrder,l as default};