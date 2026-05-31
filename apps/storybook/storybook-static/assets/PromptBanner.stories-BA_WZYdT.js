import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Bn as i,Vn as a,t as o}from"./src-DgoylXRw.js";var s,c,l,u,d,f,p,m;e((()=>{s=t(n(),1),o(),c=r(),l={title:`AI/PromptBanner`,component:i,tags:[`autodocs`],parameters:{docs:{description:{component:"A 1-line ribbon inside the composer shell — rendered above the textarea via the `topBanner` slot. Five tones: promo (ember), info (neutral), warn, success, danger. Supports an optional CTA button and a dismiss × button."}}},args:{tone:`promo`,cta:`Upgrade`,children:`You're on the free tier — upgrade for unlimited context.`},argTypes:{tone:{control:`select`,options:[`promo`,`info`,`warn`,`success`,`danger`]},cta:{control:`text`},children:{control:`text`}}},u={render:e=>(0,c.jsx)(a,{topBanner:(0,c.jsx)(i,{...e}),placeholder:`Ask anything…`})},d={render:()=>(0,c.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:16},children:[`promo`,`info`,`warn`,`success`,`danger`].map(e=>(0,c.jsx)(a,{topBanner:(0,c.jsx)(i,{tone:e,children:e===`promo`?`Upgrade for unlimited context and longer history.`:e===`info`?`18 services loaded · context window at 42 %.`:e===`warn`?`Token budget at 80 % — response may be truncated.`:e===`success`?`Connected to Forge workspace · 3 integrations active.`:`Rate limit reached — wait 60 s before sending.`}),placeholder:`Ask anything…`},e))})},f={render:()=>{function e(){let[e,t]=s.useState(!0);return(0,c.jsx)(a,{topBanner:e?(0,c.jsx)(i,{tone:`info`,onDismiss:()=>t(!1),children:`Context loaded: pix-router service graph, 14-day incident window.`}):void 0,placeholder:`Ask anything…`})}return(0,c.jsx)(e,{})}},p={render:()=>(0,c.jsx)(a,{topBanner:(0,c.jsx)(i,{tone:`promo`,cta:`Upgrade`,onCtaClick:()=>console.log(`upgrade clicked`),onDismiss:()=>{},children:`You're on the free tier — upgrade for unlimited context.`}),placeholder:`Ask anything…`})},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <PromptInput topBanner={<PromptBanner {...args} />} placeholder="Ask anything…" />
}`,...u.parameters?.docs?.source},description:{story:`PromptBanner rendered inside a PromptInput shell (its natural home).`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  }}>
      {(['promo', 'info', 'warn', 'success', 'danger'] as const).map(tone => <PromptInput key={tone} topBanner={<PromptBanner tone={tone}>
              {tone === 'promo' ? 'Upgrade for unlimited context and longer history.' : tone === 'info' ? '18 services loaded · context window at 42 %.' : tone === 'warn' ? 'Token budget at 80 % — response may be truncated.' : tone === 'success' ? 'Connected to Forge workspace · 3 integrations active.' : 'Rate limit reached — wait 60 s before sending.'}
            </PromptBanner>} placeholder="Ask anything…" />)}
    </div>
}`,...d.parameters?.docs?.source},description:{story:`All five tones — each inside a composer shell.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => {
    function Demo() {
      const [visible, setVisible] = React.useState(true);
      return <PromptInput topBanner={visible ? <PromptBanner tone="info" onDismiss={() => setVisible(false)}>
                  Context loaded: pix-router service graph, 14-day incident window.
                </PromptBanner> : undefined} placeholder="Ask anything…" />;
    }
    return <Demo />;
  }
}`,...f.parameters?.docs?.source},description:{story:`Dismissible banner — × closes the ribbon.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <PromptInput topBanner={<PromptBanner tone="promo" cta="Upgrade" onCtaClick={() => console.log('upgrade clicked')} onDismiss={() => {}}>
          You're on the free tier — upgrade for unlimited context.
        </PromptBanner>} placeholder="Ask anything…" />
}`,...p.parameters?.docs?.source},description:{story:`With CTA button.`,...p.parameters?.docs?.description}}},m=[`Default`,`AllTones`,`Dismissible`,`WithCta`]}))();export{d as AllTones,u as Default,f as Dismissible,p as WithCta,m as __namedExportsOrder,l as default};