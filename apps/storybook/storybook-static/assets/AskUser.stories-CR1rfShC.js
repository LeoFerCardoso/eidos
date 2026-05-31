import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{cr as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h,g;e((()=>{o=t(n(),1),a(),s=r(),c=[{id:`role`,title:`What is your primary engineering role?`,header:`Role`,options:[{id:`backend`,title:`Backend engineer`,description:`Services, APIs, data stores`},{id:`frontend`,title:`Frontend engineer`,description:`Web, design systems, UX`},{id:`platform`,title:`Platform / SRE`,description:`Infrastructure, reliability, CI/CD`},{id:`data`,title:`Data / ML engineer`,description:`Pipelines, models, analytics`},{id:`lead`,title:`Tech lead / EM`,description:`Team leadership, architecture`}]},{id:`tribe`,title:`Which tribe do you work in?`,header:`Team`,options:[{id:`identity`,title:`Identity`},{id:`pix`,title:`Pix`},{id:`risk`,title:`Risk`},{id:`fraud`,title:`Fraud`},{id:`open-finance`,title:`Open Finance`},{id:`onboarding`,title:`Onboarding`},{id:`datalab`,title:`DataLab`}],skippable:!0,allowOther:!0,otherPlaceholder:`Another tribe…`},{id:`goals`,title:`What do you want Forge to help with most?`,header:`Goals`,multiSelect:!0,options:[{id:`quality`,title:`Improve code quality`},{id:`speed`,title:`Ship faster`},{id:`incidents`,title:`Reduce incidents`},{id:`ai`,title:`Adopt AI tooling`},{id:`docs`,title:`Better documentation`}]}],l={title:`AI/AskUser`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:`A stepped single-select / multi-select questionnaire the agent uses to gather context before proceeding. Single-select auto-advances with a brief beat; multi-select and allowOther show an explicit Continue button. Full keyboard nav included.`}}},args:{questions:[c[0]],advanceDelayMs:180},argTypes:{advanceDelayMs:{control:`number`},skipLabel:{control:`text`},continueLabel:{control:`text`},finishLabel:{control:`text`},backLabel:{control:`text`}}},u={},d={args:{questions:c}},f={args:{questions:[c[2]]}},p={args:{questions:[c[1]]}},m={render:()=>{let[e,t]=o.useState(null);return(0,s.jsxs)(`div`,{style:{maxWidth:560},children:[(0,s.jsx)(i,{questions:c,onComplete:e=>t(e)}),e&&(0,s.jsx)(`pre`,{style:{marginTop:16,fontSize:12,color:`var(--fg-muted)`},children:JSON.stringify(e,null,2)})]})}},h={args:{questions:[{id:`env`,title:`Which environment do you want to inspect?`,header:`Environment`,layout:`inline`,options:[{id:`prod`,title:`Production`,description:`Live traffic`},{id:`staging`,title:`Staging`,description:`Pre-release`},{id:`dev`,title:`Development`,description:`Local + CI`}]}]}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{}`,...u.parameters?.docs?.source},description:{story:`Single question, single-select, auto-advances on click.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    questions: ONBOARDING_QUESTIONS
  }
}`,...d.parameters?.docs?.source},description:{story:`Multi-step flow — 3 questions with back nav and a progress bar.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    questions: [ONBOARDING_QUESTIONS[2]]
  }
}`,...f.parameters?.docs?.source},description:{story:`Multi-select question — requires explicit Continue.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    questions: [ONBOARDING_QUESTIONS[1]]
  }
}`,...p.parameters?.docs?.source},description:{story:`Skippable with an "Other" free-text option.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [answers, setAnswers] = React.useState<AskAnswer[] | null>(null);
    return <div style={{
      maxWidth: 560
    }}>
        <AskUser questions={ONBOARDING_QUESTIONS} onComplete={a => setAnswers(a)} />
        {answers && <pre style={{
        marginTop: 16,
        fontSize: 12,
        color: 'var(--fg-muted)'
      }}>
            {JSON.stringify(answers, null, 2)}
          </pre>}
      </div>;
  }
}`,...m.parameters?.docs?.source},description:{story:"Completion summary — pass an `onComplete` that captures answers and logs them.",...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    questions: [{
      id: 'env',
      title: 'Which environment do you want to inspect?',
      header: 'Environment',
      layout: 'inline',
      options: [{
        id: 'prod',
        title: 'Production',
        description: 'Live traffic'
      }, {
        id: 'staging',
        title: 'Staging',
        description: 'Pre-release'
      }, {
        id: 'dev',
        title: 'Development',
        description: 'Local + CI'
      }]
    }]
  }
}`,...h.parameters?.docs?.source},description:{story:`Inline layout variant for compact option rows.`,...h.parameters?.docs?.description}}},g=[`Default`,`MultiStep`,`MultiSelect`,`SkippableWithOther`,`WithCompletion`,`InlineLayout`]}))();export{u as Default,h as InlineLayout,f as MultiSelect,d as MultiStep,p as SkippableWithOther,m as WithCompletion,g as __namedExportsOrder,l as default};