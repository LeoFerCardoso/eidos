import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./jsx-runtime-CaZkqeYb.js";import{Zi as n,t as r}from"./src-DgoylXRw.js";var i,a,o,s,c,l,u,d,f,p,m,h;e((()=>{r(),i=t(),a=[{id:`build`,label:`Build`,status:`done`,meta:`1m 12s`},{id:`test`,label:`Test`,status:`done`,meta:`4m 38s`},{id:`sast`,label:`SAST`,status:`done`,meta:`22s`},{id:`risk`,label:`Risk`,status:`done`,meta:`8s`},{id:`canary`,label:`Canary`,status:`running`,meta:`Ring 0 · 62%`},{id:`full`,label:`Full`,status:`pending`,meta:void 0}],o=[{id:`build`,label:`Build`,status:`done`,meta:`1m 02s`},{id:`test`,label:`Test`,status:`done`,meta:`3m 11s`},{id:`sast`,label:`SAST`,status:`done`,meta:`18s`},{id:`risk`,label:`Risk`,status:`done`,meta:`9s`},{id:`canary`,label:`Canary`,status:`error`,meta:`p95 spike`},{id:`full`,label:`Full`,status:`pending`,meta:void 0}],s=[{id:`build`,label:`Build`,status:`done`,meta:`58s`},{id:`test`,label:`Test`,status:`done`,meta:`2m 44s`},{id:`sast`,label:`SAST`,status:`skipped`,meta:`cache hit`},{id:`risk`,label:`Risk`,status:`done`,meta:`7s`},{id:`canary`,label:`Canary`,status:`done`,meta:`Ring 0–2`},{id:`full`,label:`Full`,status:`done`,meta:`Ring 3–4`}],c={title:`Elements/Pipeline`,component:n,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:"A visual build pipeline composed of ordered steps with status indicators. Two variants: `stepper` (horizontal cards on a rail, linear/Vercel feel) and `chevron` (nested right-pointing arrows, GitHub Actions style). Steps carry `status`: `done | running | pending | error | skipped`."}}},args:{variant:`stepper`,steps:a},argTypes:{variant:{control:`inline-radio`,options:[`stepper`,`chevron`]},compact:{control:`boolean`},currentIndex:{control:`number`}}},l={},u={args:{variant:`chevron`}},d={args:{steps:s}},f={args:{steps:o}},p={args:{compact:!0}},m={render:()=>(0,i.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:24},children:[(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`p`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,marginBottom:8},children:`pix-router · D-9182 · stepper`}),(0,i.jsx)(n,{variant:`stepper`,steps:a})]}),(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`p`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,marginBottom:8},children:`identity-svc · D-9180 · chevron`}),(0,i.jsx)(n,{variant:`chevron`,steps:s})]}),(0,i.jsxs)(`div`,{children:[(0,i.jsx)(`p`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,marginBottom:8},children:`bureau-gateway · D-9179 · failed canary`}),(0,i.jsx)(n,{variant:`chevron`,steps:o})]})]})},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source},description:{story:`Stepper — an in-flight deploy at the canary stage.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'chevron'
  }
}`,...u.parameters?.docs?.source},description:{story:`Chevron variant — same step model, wedge layout.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    steps: SKIPPED_STEPS
  }
}`,...d.parameters?.docs?.source},description:{story:"A fully successful pipeline (all steps `done`).",...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    steps: FAILED_STEPS
  }
}`,...f.parameters?.docs?.source},description:{story:`A blocked pipeline — canary errored, full deploy never started.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    compact: true
  }
}`,...p.parameters?.docs?.source},description:{story:`Compact stepper — hides labels, suited for table cells.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 24
  }}>
      <div>
        <p style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg-muted)',
        marginBottom: 8
      }}>pix-router · D-9182 · stepper</p>
        <Pipeline variant="stepper" steps={PIPELINE_STEPS} />
      </div>
      <div>
        <p style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg-muted)',
        marginBottom: 8
      }}>identity-svc · D-9180 · chevron</p>
        <Pipeline variant="chevron" steps={SKIPPED_STEPS} />
      </div>
      <div>
        <p style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg-muted)',
        marginBottom: 8
      }}>bureau-gateway · D-9179 · failed canary</p>
        <Pipeline variant="chevron" steps={FAILED_STEPS} />
      </div>
    </div>
}`,...m.parameters?.docs?.source},description:{story:`Two variants presented together as they'd appear in a deploy dashboard.`,...m.parameters?.docs?.description}}},h=[`Default`,`Chevron`,`AllPassed`,`Failed`,`Compact`,`InContext`]}))();export{d as AllPassed,u as Chevron,p as Compact,l as Default,f as Failed,m as InContext,h as __namedExportsOrder,c as default};