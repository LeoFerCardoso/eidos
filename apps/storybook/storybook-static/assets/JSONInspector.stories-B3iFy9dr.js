import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./jsx-runtime-CaZkqeYb.js";import{Ji as n,t as r}from"./src-DgoylXRw.js";var i,a,o,s,c,l,u,d,f;e((()=>{r(),i=t(),a={id:`D-9182`,service:`pix-router`,version:`2.7.0`,author:`Rafael Mendonça`,status:`in-flight`,currentRing:2,progress:62,stages:{build:{status:`done`,duration:`1m 12s`,artifacts:142},test:{status:`done`,duration:`4m 38s`,specs:1847},sast:{status:`done`,duration:`22s`,findings:0},risk:{status:`done`,score:34,verdict:`low`,blastRadius:`Ring 0→2`},canary:{status:`running`,ring:2,percentHealth:62},full:{status:`pending`}},rings:[{ring:0,audience:`Internal`,percent:100,status:`done`},{ring:1,audience:`Canary 1%`,percent:100,status:`done`},{ring:2,audience:`10% traffic`,percent:62,status:`running`},{ring:3,audience:`50% traffic`,percent:0,status:`pending`},{ring:4,audience:`100%`,percent:0,status:`pending`}],metadata:{commitSha:`a1b2c3d4e5f6`,prNumber:7421,triggeredAt:`2026-05-29T02:14:01Z`,qualityGate:{cyclomaticComplexity:8,cognitiveComplexity:11,maintainabilityIndex:64,coverageDelta:`+1.2%`,sast:0}}},o={title:`Elements/JSONInspector`,component:n,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:'A collapsible, syntax-colored JSON tree: keys in ember, strings in green, numbers in cyan, booleans in magenta, null in muted. Nodes are expanded by default; pass `defaultCollapsedPaths` (e.g. `["$.rings"]`) to hide verbose branches on load. Supports any JSON-serializable value — object, array, or primitive.'}}},args:{data:{name:`pix-router`,tier:`T1`,lang:`Go`,p95:89,alert:!0,tags:[`pix`,`payments`,`fintech`]},defaultCollapsedPaths:[]},argTypes:{}},s={},c={args:{data:a,defaultCollapsedPaths:[`$.rings`,`$.metadata.qualityGate`]}},l={args:{data:[{ring:0,status:`done`,percent:100},{ring:1,status:`done`,percent:100},{ring:2,status:`running`,percent:62},{ring:3,status:`pending`,percent:0}]}},u={args:{data:`pix-router v2.7.0 · Ring 2 · 62% healthy`}},d={render:()=>(0,i.jsxs)(`div`,{style:{maxWidth:560},children:[(0,i.jsx)(`p`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,marginBottom:10},children:`D-9182 · raw deploy payload`}),(0,i.jsx)(n,{data:a,defaultCollapsedPaths:[`$.rings`,`$.metadata`]})]})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source},description:{story:`A simple flat object — all primitive types visible.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    data: DEPLOY_PAYLOAD,
    defaultCollapsedPaths: ['$.rings', '$.metadata.qualityGate']
  }
}`,...c.parameters?.docs?.source},description:{story:`A deeply nested deploy payload — rings branch pre-collapsed.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    data: [{
      ring: 0,
      status: 'done',
      percent: 100
    }, {
      ring: 1,
      status: 'done',
      percent: 100
    }, {
      ring: 2,
      status: 'running',
      percent: 62
    }, {
      ring: 3,
      status: 'pending',
      percent: 0
    }]
  }
}`,...l.parameters?.docs?.source},description:{story:`An array at the top level.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    data: 'pix-router v2.7.0 · Ring 2 · 62% healthy'
  }
}`,...u.parameters?.docs?.source},description:{story:`A primitive value — renders without a container object.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    maxWidth: 560
  }}>
      <p style={{
      fontSize: 11,
      fontFamily: 'var(--font-mono)',
      color: 'var(--fg-muted)',
      marginBottom: 10
    }}>
        D-9182 · raw deploy payload
      </p>
      <JSONInspector data={DEPLOY_PAYLOAD} defaultCollapsedPaths={['$.rings', '$.metadata']} />
    </div>
}`,...d.parameters?.docs?.source},description:{story:`Inspector embedded in a deploy-event sidesheet.`,...d.parameters?.docs?.description}}},f=[`Default`,`DeepNested`,`ArrayRoot`,`PrimitiveValue`,`InContext`]}))();export{l as ArrayRoot,c as DeepNested,s as Default,d as InContext,u as PrimitiveValue,f as __namedExportsOrder,o as default};