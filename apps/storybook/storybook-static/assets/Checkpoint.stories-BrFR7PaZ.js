import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{Zn as r,t as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u,d;e((()=>{t(),i(),a=n(),o={title:`AI/Checkpoint`,component:r,tags:[`autodocs`],parameters:{docs:{description:{component:`A save-point marker between conversation turns — "you can restore the conversation to here". Rendered as a centered chip on a hairline rule. Supply onRestore to make it interactive.`}}},args:{label:`Plan agreed`,time:`14:32`},argTypes:{label:{control:`text`},time:{control:`text`}}},s={},c={args:{label:`Before rollback`,time:`02:15`},render:e=>(0,a.jsx)(r,{...e,onRestore:()=>alert(`Restore triggered`)})},l={args:{label:`Start of session`,time:void 0}},u={render:()=>(0,a.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:16,maxWidth:620},children:[(0,a.jsx)(r,{label:`Plan agreed`,time:`14:02`}),(0,a.jsx)(r,{label:`Before deploy`,time:`14:28`,onRestore:()=>{}}),(0,a.jsx)(r,{label:`After rollback`,time:`14:51`,onRestore:()=>{}})]})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source},description:{story:`Checkpoint with a timestamp, no restore action.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Before rollback',
    time: '02:15'
  },
  render: args => <Checkpoint {...args} onRestore={() => alert('Restore triggered')} />
}`,...c.parameters?.docs?.source},description:{story:`With a Restore button — wired to a no-op in this story.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Start of session',
    time: undefined
  }
}`,...l.parameters?.docs?.source},description:{story:`Label only — no timestamp.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    maxWidth: 620
  }}>
      <Checkpoint label="Plan agreed" time="14:02" />
      <Checkpoint label="Before deploy" time="14:28" onRestore={() => {}} />
      <Checkpoint label="After rollback" time="14:51" onRestore={() => {}} />
    </div>
}`,...u.parameters?.docs?.source},description:{story:`Multiple checkpoints in a conversation thread.`,...u.parameters?.docs?.description}}},d=[`Default`,`WithRestore`,`LabelOnly`,`InContext`]}))();export{s as Default,u as InContext,l as LabelOnly,c as WithRestore,d as __namedExportsOrder,o as default};