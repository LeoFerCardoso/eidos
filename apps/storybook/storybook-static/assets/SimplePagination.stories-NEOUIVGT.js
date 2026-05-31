import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{ha as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m;e((()=>{o=t(n(),1),a(),s=r(),c={title:`Primitives/SimplePagination`,component:i,tags:[`autodocs`],parameters:{docs:{description:{component:`A minimal two-button paginator — outlined Previous / Next buttons flanking a "Page X of Y" counter in mono. No page number buttons, no ellipsis. Ideal for long lists or detail views where only sequential navigation is needed.`}}},args:{total:12,current:1},argTypes:{total:{control:`number`,description:`Total number of pages.`},current:{control:`number`,description:`Currently active page (1-based).`}}},l={},u={args:{total:12,current:6}},d={args:{total:12,current:12}},f={render:e=>{let[t,n]=o.useState(1);return(0,s.jsx)(i,{total:e.total,current:t,onChange:n})}},p={args:{total:1,current:1}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source},description:{story:`Default — page 1 of 12, Previous disabled.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    total: 12,
    current: 6
  }
}`,...u.parameters?.docs?.source},description:{story:`Middle page — both buttons enabled.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    total: 12,
    current: 12
  }
}`,...d.parameters?.docs?.source},description:{story:`Last page — Next disabled.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [current, setCurrent] = React.useState(1);
    return <SimplePagination total={args.total} current={current} onChange={setCurrent} />;
  }
}`,...f.parameters?.docs?.source},description:{story:"Interactive — `current` is wired to `useState`.",...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    total: 1,
    current: 1
  }
}`,...p.parameters?.docs?.source},description:{story:`Single page — both buttons disabled.`,...p.parameters?.docs?.description}}},m=[`Default`,`MiddlePage`,`LastPage`,`Interactive`,`SinglePage`]}))();export{l as Default,f as Interactive,d as LastPage,u as MiddlePage,p as SinglePage,m as __namedExportsOrder,c as default};