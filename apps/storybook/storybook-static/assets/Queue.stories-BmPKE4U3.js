import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{er as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h;e((()=>{o=t(n(),1),a(),s=r(),c=[`What is the p95 latency trend for ledger-svc this week?`,`Show me all PRs that modified fraud-engine in the last 30 days.`,`Generate a GMUD draft for the bureau-gateway schema migration.`],l={title:`AI/Queue`,component:i,tags:[`autodocs`],parameters:{docs:{description:{component:`An ordered list of prompts the user has lined up while the agent is busy. Items are removable when onRemove is provided; rendered in arrival order.`}}},args:{title:`Queued`,items:c},argTypes:{title:{control:`text`}}},u={},d={args:{items:[]}},f={render:()=>{let[e,t]=o.useState(c);return(0,s.jsx)(i,{title:`Queued`,items:e,onRemove:e=>t(t=>t.filter((t,n)=>n!==e))})}},p={args:{title:`Next up`,items:c.slice(0,2)}},m={args:{items:[`What is the current deploy status of fraud-engine?`]}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{}`,...u.parameters?.docs?.source},description:{story:`Queue with three items, no remove capability.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    items: []
  }
}`,...d.parameters?.docs?.source},description:{story:`Empty queue — shows "0" count with an empty list.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [items, setItems] = React.useState(SAMPLE_ITEMS);
    return <Queue title="Queued" items={items} onRemove={i => setItems(prev => prev.filter((_, idx) => idx !== i))} />;
  }
}`,...f.parameters?.docs?.source},description:{story:`With remove buttons — interactive; items can be dismissed.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Next up',
    items: SAMPLE_ITEMS.slice(0, 2)
  }
}`,...p.parameters?.docs?.source},description:{story:`Custom title — for product-voice variants.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    items: ['What is the current deploy status of fraud-engine?']
  }
}`,...m.parameters?.docs?.source},description:{story:`Single item — confirms the layout still reads well.`,...m.parameters?.docs?.description}}},h=[`Default`,`Empty`,`Removable`,`CustomTitle`,`SingleItem`]}))();export{p as CustomTitle,u as Default,d as Empty,f as Removable,m as SingleItem,h as __namedExportsOrder,l as default};