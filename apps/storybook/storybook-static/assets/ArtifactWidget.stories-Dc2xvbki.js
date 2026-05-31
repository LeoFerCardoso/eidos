import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{t as r,vr as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u,d,f,p,m,h,g;e((()=>{t(),r(),a=n(),o={id:`art-001`,kind:`document`,title:`Incident Report — INC-9812`,meta:`4 KB · markdown`},s={id:`art-002`,kind:`code`,title:`rollback.ts`,meta:`84 lines · TypeScript`,lang:`ts`},c={id:`art-003`,kind:`html`,title:`Risk Dashboard Preview`,meta:`12 KB`},l={id:`art-004`,kind:`app`,title:`Latency Explorer`},u={title:`AI/ArtifactWidget`,component:i,tags:[`autodocs`],parameters:{docs:{description:{component:`A compact chip that lands in a message bubble to represent a model-produced artifact (document, code file, HTML page, or live app). Click to open the artifact in the side panel.`}}},args:{artifact:o},argTypes:{className:{control:`text`}}},d={},f={args:{artifact:s}},p={args:{artifact:c}},m={args:{artifact:l}},h={render:()=>(0,a.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:8,maxWidth:400},children:[o,s,c,l].map(e=>(0,a.jsx)(i,{artifact:e,onOpen:()=>{}},e.id))})},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{}`,...d.parameters?.docs?.source},description:{story:`Document artifact chip — default kind.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    artifact: CODE_ARTIFACT
  }
}`,...f.parameters?.docs?.source},description:{story:`Code artifact chip with language meta.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    artifact: HTML_ARTIFACT
  }
}`,...p.parameters?.docs?.source},description:{story:`HTML page artifact chip.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    artifact: APP_ARTIFACT
  }
}`,...m.parameters?.docs?.source},description:{story:`App artifact chip — no meta.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    maxWidth: 400
  }}>
      {[DOC_ARTIFACT, CODE_ARTIFACT, HTML_ARTIFACT, APP_ARTIFACT].map(a => <ArtifactWidget key={a.id} artifact={a} onOpen={() => {}} />)}
    </div>
}`,...h.parameters?.docs?.source},description:{story:`All four kinds side by side.`,...h.parameters?.docs?.description}}},g=[`Default`,`CodeArtifact`,`HtmlArtifact`,`AppArtifact`,`AllKinds`]}))();export{h as AllKinds,m as AppArtifact,f as CodeArtifact,d as Default,p as HtmlArtifact,g as __namedExportsOrder,u as default};