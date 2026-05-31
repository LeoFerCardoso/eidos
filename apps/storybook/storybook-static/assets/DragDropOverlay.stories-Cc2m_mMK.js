import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Fn as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d;e((()=>{o=t(n(),1),a(),s=r(),c={title:`AI/DragDropOverlay`,component:i,tags:[`autodocs`],parameters:{docs:{description:{component:`Full-shell drag-and-drop composer with an ember overlay that covers the whole input area when files are dragged over it. Supports pre-loaded attachments (rendered as chips) and a model selector.`}}},args:{modelValue:`forge-sonnet-4-6`,placeholder:`Drag a file anywhere on this composer…`},argTypes:{modelValue:{control:`text`},placeholder:{control:`text`}}},l={render:()=>{function e(){let[e,t]=o.useState(`forge-sonnet-4-6`);return(0,s.jsx)(i,{modelValue:e,onModelChange:t,onDrop:e=>console.log(`dropped:`,e),placeholder:`Have a look — drag a file to attach it.`})}return(0,s.jsx)(e,{})}},u={render:()=>{function e(){let[e,t]=o.useState(`forge-sonnet-4-6`);return(0,s.jsx)(i,{modelValue:e,onModelChange:t,initialFiles:[{id:`f1`,name:`fraud-trace.json`,size:`2.1 KB`,kind:`file`},{id:`f2`,name:`decision-tree.png`,size:`88 KB`,kind:`image`,hue:30}],placeholder:`Anything odd in these files?`})}return(0,s.jsx)(e,{})}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => {
    function Demo() {
      const [model, setModel] = React.useState('forge-sonnet-4-6');
      return <DragDropOverlay modelValue={model} onModelChange={setModel} onDrop={files => console.log('dropped:', files)} placeholder="Have a look — drag a file to attach it." />;
    }
    return <Demo />;
  }
}`,...l.parameters?.docs?.source},description:{story:`Default overlay composer — drag a file over it to see the veil.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => {
    function Demo() {
      const [model, setModel] = React.useState('forge-sonnet-4-6');
      return <DragDropOverlay modelValue={model} onModelChange={setModel} initialFiles={[{
        id: 'f1',
        name: 'fraud-trace.json',
        size: '2.1 KB',
        kind: 'file'
      }, {
        id: 'f2',
        name: 'decision-tree.png',
        size: '88 KB',
        kind: 'image',
        hue: 30
      }]} placeholder="Anything odd in these files?" />;
    }
    return <Demo />;
  }
}`,...u.parameters?.docs?.source},description:{story:`With pre-loaded attachments in the header.`,...u.parameters?.docs?.description}}},d=[`Default`,`WithPreloadedFiles`]}))();export{l as Default,u as WithPreloadedFiles,d as __namedExportsOrder,c as default};