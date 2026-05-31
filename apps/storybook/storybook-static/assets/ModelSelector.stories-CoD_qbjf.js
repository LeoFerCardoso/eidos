import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Rn as i,t as a,zn as o}from"./src-DgoylXRw.js";var s,c,l,u,d,f,p,m;e((()=>{s=t(n(),1),a(),c=r(),l=[{id:`forge-sonnet-4-6`,short:`S`,name:`Sonnet 4.6`,cost:`$3 / 1M`},{id:`forge-opus-4-7`,short:`O`,name:`Opus 4.7`,cost:`$15 / 1M`},{id:`forge-haiku-4-5`,short:`H`,name:`Haiku 4.5`,cost:`$1 / 1M`}],u={title:`AI/ModelSelector`,component:o,tags:[`autodocs`],parameters:{docs:{description:{component:"Model drop-up inside the composer footer. Portals the menu to `<body>` so it escapes any container clipping. Fully keyboard-navigable (ArrowUp/Down, Enter, Escape). `ModelPicker` is an alias for backward compatibility."}}},args:{value:`forge-sonnet-4-6`,models:l},argTypes:{value:{control:`select`,options:l.map(e=>e.id)}}},d={render:e=>{function t(){let[t,n]=s.useState(e.value||`forge-sonnet-4-6`);return(0,c.jsx)(o,{value:t,onChange:n,models:e.models})}return(0,c.jsx)(t,{})}},f={render:()=>{function e(){let e=[{id:`gpt-4o`,short:`G`,name:`GPT-4o`,cost:`$5 / 1M`},{id:`gpt-4o-mini`,short:`M`,name:`GPT-4o mini`,cost:`$0.15 / 1M`},{id:`gemini-1-5-pro`,short:`P`,name:`Gemini 1.5 Pro`,cost:`$3.5 / 1M`}],[t,n]=s.useState(`gpt-4o`);return(0,c.jsx)(o,{value:t,onChange:n,models:e})}return(0,c.jsx)(e,{})}},p={render:()=>{function e(){let[e,t]=s.useState(`forge-haiku-4-5`);return(0,c.jsx)(i,{value:e,onChange:t,models:l})}return(0,c.jsx)(e,{})}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => {
    function Demo() {
      const [value, setValue] = React.useState(args.value || 'forge-sonnet-4-6');
      return <ModelSelector value={value} onChange={setValue} models={args.models} />;
    }
    return <Demo />;
  }
}`,...d.parameters?.docs?.source},description:{story:`Controlled drop-up — click to open; pick a model to update value.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => {
    function Demo() {
      const custom = [{
        id: 'gpt-4o',
        short: 'G',
        name: 'GPT-4o',
        cost: '$5 / 1M'
      }, {
        id: 'gpt-4o-mini',
        short: 'M',
        name: 'GPT-4o mini',
        cost: '$0.15 / 1M'
      }, {
        id: 'gemini-1-5-pro',
        short: 'P',
        name: 'Gemini 1.5 Pro',
        cost: '$3.5 / 1M'
      }];
      const [value, setValue] = React.useState('gpt-4o');
      return <ModelSelector value={value} onChange={setValue} models={custom} />;
    }
    return <Demo />;
  }
}`,...f.parameters?.docs?.source},description:{story:`Custom model list — swap in your own models.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    function Demo() {
      const [value, setValue] = React.useState('forge-haiku-4-5');
      return <ModelPicker value={value} onChange={setValue} models={MODELS} />;
    }
    return <Demo />;
  }
}`,...p.parameters?.docs?.source},description:{story:`ModelPicker alias — identical behaviour, legacy name.`,...p.parameters?.docs?.description}}},m=[`Default`,`CustomModels`,`ModelPickerAlias`]}))();export{f as CustomModels,d as Default,p as ModelPickerAlias,m as __namedExportsOrder,u as default};