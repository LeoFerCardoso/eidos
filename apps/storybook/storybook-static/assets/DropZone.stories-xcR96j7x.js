import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{In as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d;e((()=>{o=t(n(),1),a(),s=r(),c={title:`AI/DropZone`,component:i,tags:[`autodocs`],parameters:{docs:{description:{component:"A basic drag-and-drop composer wrapper. Renders the `.pi` shell with a footer drop hint that appears when files are dragged over it. Children override the default textarea slot."}}},args:{modelValue:`forge-sonnet-4-6`},argTypes:{modelValue:{control:`text`}}},l={render:()=>{function e(){let[e,t]=o.useState(`forge-sonnet-4-6`);return(0,s.jsx)(i,{modelValue:e,onModelChange:t,onDrop:e=>console.log(`dropped:`,e)})}return(0,s.jsx)(e,{})}},u={args:{modelValue:void 0,onModelChange:void 0}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => {
    function Demo() {
      const [model, setModel] = React.useState('forge-sonnet-4-6');
      return <DropZone modelValue={model} onModelChange={setModel} onDrop={files => console.log('dropped:', files)} />;
    }
    return <Demo />;
  }
}`,...l.parameters?.docs?.source},description:{story:`Default drop zone with a model selector in the footer.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    modelValue: undefined,
    onModelChange: undefined
  }
}`,...u.parameters?.docs?.source},description:{story:`Without the model selector — simpler footer.`,...u.parameters?.docs?.description}}},d=[`Default`,`NoModelSelector`]}))();export{l as Default,u as NoModelSelector,d as __namedExportsOrder,c as default};