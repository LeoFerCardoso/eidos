import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Bn as i,Vn as a,t as o}from"./src-DgoylXRw.js";var s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C;e((()=>{s=t(n(),1),o(),c=r(),l={title:`AI/PromptInput`,component:a,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:`Composite prompt-input shell: auto-sizing textarea, attachment header, and a footer toolbar (attach · model · submit). Covers all states (ready / submitted / streaming / error / disabled / invalid) and supports an optional top banner ribbon, footer hint, and elevated lift.`}}},decorators:[e=>(0,c.jsx)(`div`,{style:{width:680,maxWidth:`100%`},children:(0,c.jsx)(e,{})})],args:{status:`ready`,disabled:!1,invalid:!1,placeholder:`Ask Forge AI anything…`,elevated:!1},argTypes:{status:{control:`select`,options:[`ready`,`submitted`,`streaming`,`error`]},disabled:{control:`boolean`},invalid:{control:`boolean`},elevated:{control:`boolean`},placeholder:{control:`text`}}},u={},d={render:()=>{function e(){let[e,t]=s.useState(``),[n,r]=s.useState(`forge-sonnet-4-6`),[i,o]=s.useState(`ready`);return(0,c.jsx)(a,{status:i,value:e,onChange:t,onSubmit:e=>{o(`submitted`),setTimeout(()=>o(`streaming`),600),setTimeout(()=>{o(`ready`),t(``)},2200),console.log(`submit:`,e)},onStop:()=>o(`ready`),modelValue:n,onModelChange:r,placeholder:`Ask Forge AI anything…`})}return(0,c.jsx)(e,{})}},f={args:{status:`submitted`}},p={args:{status:`streaming`}},m={name:`Error`,args:{status:`error`}},h={args:{disabled:!0}},g={args:{invalid:!0,placeholder:`Message cannot be empty`}},_={render:()=>{function e(){let[e,t]=s.useState(`forge-sonnet-4-6`);return(0,c.jsx)(a,{modelValue:e,onModelChange:t,placeholder:`Select a model and ask anything…`})}return(0,c.jsx)(e,{})}},v={render:()=>{function e(){let[e,t]=s.useState([{id:`a1`,name:`fraud-trace.json`,size:`2.1 KB`,kind:`file`},{id:`a2`,name:`screenshot.png`,size:`148 KB`,kind:`image`,hue:200}]);return(0,c.jsx)(a,{attachments:e,onRemoveAttachment:e=>t(t=>t.filter(t=>t.id!==e)),placeholder:`What do you see in these files?`})}return(0,c.jsx)(e,{})}},y={render:()=>(0,c.jsx)(a,{topBanner:(0,c.jsx)(i,{tone:`promo`,cta:`Upgrade`,onCtaClick:()=>{},onDismiss:()=>{},children:`You're on the free tier — upgrade for unlimited context.`}),placeholder:`Ask anything…`})},b={args:{footerHint:`AI can make mistakes — please double-check important decisions.`}},x={args:{elevated:!0,placeholder:`Elevated composer…`}},S={render:()=>{function e(){let[e,t]=s.useState(``);return(0,c.jsx)(a,{value:e,onChange:t,placeholder:`Use + to attach context…`,actions:[{id:`file`,label:`Attach file`,description:`PDF, JSON, CSV, logs`,icon:`file`},{id:`image`,label:`Attach image`,description:`PNG, JPG, WebP · up to 20 MB`,icon:`image`},{id:`div`,label:``,divider:!0},{id:`snapshot`,label:`Take snapshot`,description:`Capture current service state`,icon:`camera`},{id:`clear`,label:`Clear conversation`,destructive:!0,icon:`trash`}],onActionSelect:e=>console.log(`action:`,e)})}return(0,c.jsx)(e,{})}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{}`,...u.parameters?.docs?.source},description:{story:`Default ready state — controlled by the Controls panel.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    function Demo() {
      const [text, setText] = React.useState('');
      const [model, setModel] = React.useState('forge-sonnet-4-6');
      const [status, setStatus] = React.useState<'ready' | 'submitted' | 'streaming' | 'error'>('ready');
      const handleSubmit = (value: string) => {
        setStatus('submitted');
        setTimeout(() => setStatus('streaming'), 600);
        setTimeout(() => {
          setStatus('ready');
          setText('');
        }, 2200);
        console.log('submit:', value);
      };
      return <PromptInput status={status} value={text} onChange={setText} onSubmit={handleSubmit} onStop={() => setStatus('ready')} modelValue={model} onModelChange={setModel} placeholder="Ask Forge AI anything…" />;
    }
    return <Demo />;
  }
}`,...d.parameters?.docs?.source},description:{story:`Interactive controlled input with value, model selector, and submit.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'submitted'
  }
}`,...f.parameters?.docs?.source},description:{story:`Submitted — spinner shown; textarea locked.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'streaming'
  }
}`,...p.parameters?.docs?.source},description:{story:`Streaming — stop button replaces submit.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: 'Error',
  args: {
    status: 'error'
  }
}`,...m.parameters?.docs?.source},description:{story:`Error — retry button replaces submit.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...h.parameters?.docs?.source},description:{story:`Disabled — entire composer locked (e.g. waiting for attachment upload).`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    invalid: true,
    placeholder: 'Message cannot be empty'
  }
}`,...g.parameters?.docs?.source},description:{story:`Invalid — danger border + ring for validation failure.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => {
    function Demo() {
      const [model, setModel] = React.useState('forge-sonnet-4-6');
      return <PromptInput modelValue={model} onModelChange={setModel} placeholder="Select a model and ask anything…" />;
    }
    return <Demo />;
  }
}`,..._.parameters?.docs?.source},description:{story:`With model selector in the footer.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => {
    function Demo() {
      const [files, setFiles] = React.useState([{
        id: 'a1',
        name: 'fraud-trace.json',
        size: '2.1 KB',
        kind: 'file' as const
      }, {
        id: 'a2',
        name: 'screenshot.png',
        size: '148 KB',
        kind: 'image' as const,
        hue: 200
      }]);
      return <PromptInput attachments={files} onRemoveAttachment={id => setFiles(f => f.filter(x => x.id !== id))} placeholder="What do you see in these files?" />;
    }
    return <Demo />;
  }
}`,...v.parameters?.docs?.source},description:{story:`With file attachments in the header row.`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <PromptInput topBanner={<PromptBanner tone="promo" cta="Upgrade" onCtaClick={() => {}} onDismiss={() => {}}>
          You're on the free tier — upgrade for unlimited context.
        </PromptBanner>} placeholder="Ask anything…" />
}`,...y.parameters?.docs?.source},description:{story:`With a promo top-banner ribbon inside the shell.`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    footerHint: 'AI can make mistakes — please double-check important decisions.'
  }
}`,...b.parameters?.docs?.source},description:{story:`With a legal footer hint below the shell.`,...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    elevated: true,
    placeholder: 'Elevated composer…'
  }
}`,...x.parameters?.docs?.source},description:{story:`Elevated — soft shadow lift for floating composer surfaces.`,...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => {
    function Demo() {
      const [text, setText] = React.useState('');
      return <PromptInput value={text} onChange={setText} placeholder="Use + to attach context…" actions={[{
        id: 'file',
        label: 'Attach file',
        description: 'PDF, JSON, CSV, logs',
        icon: 'file'
      }, {
        id: 'image',
        label: 'Attach image',
        description: 'PNG, JPG, WebP · up to 20 MB',
        icon: 'image'
      }, {
        id: 'div',
        label: '',
        divider: true
      }, {
        id: 'snapshot',
        label: 'Take snapshot',
        description: 'Capture current service state',
        icon: 'camera'
      }, {
        id: 'clear',
        label: 'Clear conversation',
        destructive: true,
        icon: 'trash'
      }]} onActionSelect={id => console.log('action:', id)} />;
    }
    return <Demo />;
  }
}`,...S.parameters?.docs?.source},description:{story:`With a custom actions menu instead of the paperclip.`,...S.parameters?.docs?.description}}},C=[`Default`,`Interactive`,`Submitted`,`Streaming`,`ErrorState`,`Disabled`,`Invalid`,`WithModelSelector`,`WithAttachments`,`WithTopBanner`,`WithFooterHint`,`Elevated`,`WithActionsMenu`]}))();export{u as Default,h as Disabled,x as Elevated,m as ErrorState,d as Interactive,g as Invalid,p as Streaming,f as Submitted,S as WithActionsMenu,v as WithAttachments,b as WithFooterHint,_ as WithModelSelector,y as WithTopBanner,C as __namedExportsOrder,l as default};