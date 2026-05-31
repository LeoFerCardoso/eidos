import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Qn as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m;e((()=>{o=t(n(),1),a(),s=r(),c={title:`AI/Confirmation`,component:i,tags:[`autodocs`],parameters:{docs:{description:{component:`An agent confirmation gate: the model asks before performing a consequential action. Pending state shows Confirm/Cancel; once resolved it collapses to a compact result line. Use tone="danger" for destructive actions.`}}},args:{title:`Roll back pix-router to v2.6.9`,message:`This will terminate the in-flight Ring 2 canary and revert all traffic to the previous version.`,tone:`default`,state:`pending`,confirmLabel:`Roll back`,cancelLabel:`Cancel`},argTypes:{tone:{control:`inline-radio`,options:[`default`,`danger`]},state:{control:`inline-radio`,options:[`pending`,`confirmed`,`cancelled`]},confirmLabel:{control:`text`},cancelLabel:{control:`text`},title:{control:`text`},message:{control:`text`}}},l={},u={args:{title:`Delete service ledger-svc`,message:`This is permanent. All data, configs, and deploy history will be removed.`,tone:`danger`,confirmLabel:`Delete service`}},d={args:{state:`confirmed`}},f={args:{state:`cancelled`}},p={render:()=>{let[e,t]=o.useState(`pending`);return(0,s.jsx)(i,{title:`Roll back pix-router to v2.6.9`,message:`This will terminate the in-flight Ring 2 canary and revert all traffic to the previous version.`,tone:`danger`,state:e,confirmLabel:`Roll back`,cancelLabel:`Cancel`,onConfirm:()=>t(`confirmed`),onCancel:()=>t(`cancelled`)})}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source},description:{story:`Pending — awaiting user decision.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Delete service ledger-svc',
    message: 'This is permanent. All data, configs, and deploy history will be removed.',
    tone: 'danger',
    confirmLabel: 'Delete service'
  }
}`,...u.parameters?.docs?.source},description:{story:`Danger tone — Confirm button uses the destructive red.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    state: 'confirmed'
  }
}`,...d.parameters?.docs?.source},description:{story:`Confirmed — collapsed to a result line.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    state: 'cancelled'
  }
}`,...f.parameters?.docs?.source},description:{story:`Cancelled — collapsed to a result line.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [state, setState] = React.useState<string>('pending');
    return <Confirmation title="Roll back pix-router to v2.6.9" message="This will terminate the in-flight Ring 2 canary and revert all traffic to the previous version." tone="danger" state={state} confirmLabel="Roll back" cancelLabel="Cancel" onConfirm={() => setState('confirmed')} onCancel={() => setState('cancelled')} />;
  }
}`,...p.parameters?.docs?.source},description:{story:`Interactive — wires state transitions with local state.`,...p.parameters?.docs?.description}}},m=[`Default`,`Danger`,`Confirmed`,`Cancelled`,`Interactive`]}))();export{f as Cancelled,d as Confirmed,u as Danger,l as Default,p as Interactive,m as __namedExportsOrder,c as default};