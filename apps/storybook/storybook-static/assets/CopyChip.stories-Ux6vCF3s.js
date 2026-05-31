import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{Ca as r,t as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u,d,f,p,m;e((()=>{t(),i(),a=n(),o=[`default`,`ember`,`ice`],s={title:`Primitives/CopyChip`,component:r,tags:[`autodocs`],parameters:{docs:{description:{component:'Click-to-copy chip — displays a value (commit SHA, namespace, service ref) and copies it to the clipboard on click. Shows a brief "Copied" checkmark affordance for 1.4 s. Three tones via `.chip` variants.'}}},args:{value:`a3f9c2d`,tone:`default`},argTypes:{value:{control:`text`,description:"Text to copy (also displayed unless `label` overrides)."},label:{control:`text`,description:`Display label — use for shortened SHAs or aliases.`},tone:{control:`inline-radio`,options:o}}},c={},l={args:{value:`identity-svc@4.18.2`,tone:`ember`}},u={args:{value:`prod-us-east-1`,tone:`ice`}},d={args:{value:`a3f9c2d8e1b57f0943ac2d1e84f6b7c0938572ad`,label:`a3f9c2d`}},f={render:()=>(0,a.jsx)(`div`,{style:{display:`flex`,gap:10,flexWrap:`wrap`,alignItems:`center`},children:o.map(e=>(0,a.jsx)(r,{value:`ref-${e}`,tone:e},e))})},p={render:()=>(0,a.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:10,padding:16,background:`var(--surface)`,border:`1px solid var(--border)`,borderRadius:8,maxWidth:440},children:[{label:`Namespace`,value:`pix-router-prod`,tone:`ice`},{label:`Commit SHA`,value:`a3f9c2d8e1b57f09`,displayLabel:`a3f9c2d`,tone:`default`},{label:`Image tag`,value:`pix-router:2.7.0-canary`,tone:`ember`}].map(({label:e,value:t,displayLabel:n,tone:i})=>(0,a.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`},children:[(0,a.jsx)(`span`,{style:{fontSize:12,color:`var(--fg-muted)`},children:e}),(0,a.jsx)(r,{value:t,label:n,tone:i})]},e))})},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{}`,...c.parameters?.docs?.source},description:{story:`Default chip with a commit SHA.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'identity-svc@4.18.2',
    tone: 'ember'
  }
}`,...l.parameters?.docs?.source},description:{story:`Ember-tinted — for primary identifiers in a header.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'prod-us-east-1',
    tone: 'ice'
  }
}`,...u.parameters?.docs?.source},description:{story:`Ice-tinted — for namespaces or environment refs.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'a3f9c2d8e1b57f0943ac2d1e84f6b7c0938572ad',
    label: 'a3f9c2d'
  }
}`,...d.parameters?.docs?.source},description:{story:`With a shortened label that hides the full value visually.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    alignItems: 'center'
  }}>
      {TONES.map(tone => <CopyChip key={tone} value={\`ref-\${tone}\`} tone={tone} />)}
    </div>
}`,...f.parameters?.docs?.source},description:{story:`All three tones.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: 16,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    maxWidth: 440
  }}>
      {[{
      label: 'Namespace',
      value: 'pix-router-prod',
      tone: 'ice' as const
    }, {
      label: 'Commit SHA',
      value: 'a3f9c2d8e1b57f09',
      displayLabel: 'a3f9c2d',
      tone: 'default' as const
    }, {
      label: 'Image tag',
      value: 'pix-router:2.7.0-canary',
      tone: 'ember' as const
    }].map(({
      label,
      value,
      displayLabel,
      tone
    }) => <div key={label} style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
          <span style={{
        fontSize: 12,
        color: 'var(--fg-muted)'
      }}>{label}</span>
          <CopyChip value={value} label={displayLabel} tone={tone} />
        </div>)}
    </div>
}`,...p.parameters?.docs?.source},description:{story:`In a service detail row — K8s namespace + deploy SHA.`,...p.parameters?.docs?.description}}},m=[`Default`,`Ember`,`Ice`,`WithLabel`,`AllTones`,`InContext`]}))();export{f as AllTones,c as Default,l as Ember,u as Ice,p as InContext,d as WithLabel,m as __namedExportsOrder,s as default};