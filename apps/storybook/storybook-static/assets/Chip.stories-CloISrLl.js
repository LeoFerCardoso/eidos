import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Ba as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h,g;e((()=>{o=t(n(),1),a(),s=r(),c={title:`Primitives/Chip`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:`Attribute chip — a compact 4px-radius rectangle (Geist Mono) for versions, delta values, ref names, and service-reliability tiers. Use Chip (not Pill) when the label is a fixed attribute: a semver, a git ref, a latency delta, or a tier classification. Supports trend arrows (up/down), a leading icon slot, and a removable × action.`}}},args:{tone:`neutral`,children:`v2.14.0`},argTypes:{tone:{control:`inline-radio`,options:[`neutral`,`ok`,`bad`,`warn`,`ember`,`tier-t1`,`tier-t2`,`tier-t3`]},trend:{control:`inline-radio`,options:[void 0,`up`,`down`]},onRemove:{action:`removed`}}},l={args:{tone:`neutral`,children:`v2.14.0`}},u={render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:8,alignItems:`center`},children:[(0,s.jsx)(i,{tone:`neutral`,children:`v2.14.0`}),(0,s.jsx)(i,{tone:`ok`,children:`+8 ms`}),(0,s.jsx)(i,{tone:`bad`,children:`−240 ms`}),(0,s.jsx)(i,{tone:`warn`,children:`+62 ms`}),(0,s.jsx)(i,{tone:`ember`,children:`canary`}),(0,s.jsx)(i,{tone:`tier-t1`,children:`tier-1`}),(0,s.jsx)(i,{tone:`tier-t2`,children:`tier-2`}),(0,s.jsx)(i,{tone:`tier-t3`,children:`tier-3`})]})},d={render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:8,alignItems:`center`},children:[(0,s.jsx)(i,{tone:`ok`,trend:`up`,children:`p99 42 ms`}),(0,s.jsx)(i,{tone:`bad`,trend:`down`,children:`p99 640 ms`}),(0,s.jsx)(i,{tone:`warn`,trend:`up`,children:`throughput +12%`}),(0,s.jsx)(i,{tone:`bad`,trend:`down`,children:`error rate +3.2%`}),(0,s.jsx)(i,{tone:`neutral`,trend:`up`,children:`coverage 91%`})]})},f={render:()=>{let e=[{id:`env-prod`,label:`env:prod`,tone:`ember`},{id:`region-use1`,label:`region:us-east-1`,tone:`neutral`},{id:`service-api`,label:`service:forge-api`,tone:`neutral`},{id:`severity-p1`,label:`severity:P1`,tone:`bad`}],[t,n]=o.useState(e);return(0,s.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:6,alignItems:`center`},children:[t.map(e=>(0,s.jsx)(i,{tone:e.tone,onRemove:()=>n(t=>t.filter(t=>t.id!==e.id)),removeLabel:`Remove filter ${e.label}`,children:e.label},e.id)),t.length===0&&(0,s.jsx)(`button`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-muted)`,cursor:`pointer`},onClick:()=>n(e),children:`Restore filters`})]})}},p={render:()=>(0,s.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:10},children:[{tier:`tier-t1`,label:`tier-1`,service:`forge-api`,slo:`99.99%`},{tier:`tier-t2`,label:`tier-2`,service:`forge-webhooks`,slo:`99.9%`},{tier:`tier-t3`,label:`tier-3`,service:`forge-preview`,slo:`99.5%`}].map(({tier:e,label:t,service:n,slo:r})=>(0,s.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:10},children:[(0,s.jsx)(i,{tone:e,children:t}),(0,s.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:13,color:`var(--fg)`},children:n}),(0,s.jsxs)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-muted)`},children:[`SLO `,r]})]},e))})},m={render:()=>(0,s.jsxs)(`div`,{dir:`rtl`,style:{display:`flex`,flexWrap:`wrap`,gap:8,alignItems:`center`},children:[(0,s.jsx)(i,{tone:`neutral`,children:`v2.14.0`}),(0,s.jsx)(i,{tone:`ok`,trend:`up`,children:`p99 42 ms`}),(0,s.jsx)(i,{tone:`bad`,trend:`down`,children:`معدل الخطأ +3.2%`}),(0,s.jsx)(i,{tone:`tier-t1`,children:`tier-1`}),(0,s.jsx)(i,{tone:`ember`,onRemove:()=>{},removeLabel:`إزالة الفلتر`,children:`env:prod`})]})},h={render:()=>(0,s.jsxs)(`div`,{className:`surface`,style:{padding:20,borderRadius:10,maxWidth:480,display:`flex`,flexDirection:`column`,gap:12},children:[(0,s.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`},children:[(0,s.jsx)(`span`,{style:{fontWeight:600,fontSize:`var(--text-base)`,color:`var(--fg)`},children:`forge-api`}),(0,s.jsx)(i,{tone:`tier-t1`,children:`tier-1`})]}),(0,s.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:6},children:[(0,s.jsx)(i,{tone:`neutral`,children:`v2.14.0`}),(0,s.jsx)(i,{tone:`ok`,trend:`up`,children:`p50 12 ms`}),(0,s.jsx)(i,{tone:`warn`,trend:`down`,children:`p99 420 ms`}),(0,s.jsx)(i,{tone:`neutral`,children:`us-east-1`})]}),(0,s.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:6},children:[(0,s.jsx)(i,{tone:`ember`,children:`canary`}),(0,s.jsx)(i,{tone:`neutral`,children:`main@a3f9c12`})]})]})},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    tone: 'neutral',
    children: 'v2.14.0'
  }
}`,...l.parameters?.docs?.source},description:{story:`Smallest real example — a service version attribute chip.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center'
  }}>
      <Chip tone="neutral">v2.14.0</Chip>
      <Chip tone="ok">+8 ms</Chip>
      <Chip tone="bad">−240 ms</Chip>
      <Chip tone="warn">+62 ms</Chip>
      <Chip tone="ember">canary</Chip>
      <Chip tone="tier-t1">tier-1</Chip>
      <Chip tone="tier-t2">tier-2</Chip>
      <Chip tone="tier-t3">tier-3</Chip>
    </div>
}`,...u.parameters?.docs?.source},description:{story:`All tones in a single row.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center'
  }}>
      <Chip tone="ok" trend="up">p99 42 ms</Chip>
      <Chip tone="bad" trend="down">p99 640 ms</Chip>
      <Chip tone="warn" trend="up">throughput +12%</Chip>
      <Chip tone="bad" trend="down">error rate +3.2%</Chip>
      <Chip tone="neutral" trend="up">coverage 91%</Chip>
    </div>
}`,...d.parameters?.docs?.source},description:{story:`Trend arrows — up arrow for improvement, down for regression. Arrows are semantic, not directional.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => {
    const initial = [{
      id: 'env-prod',
      label: 'env:prod',
      tone: 'ember' as const
    }, {
      id: 'region-use1',
      label: 'region:us-east-1',
      tone: 'neutral' as const
    }, {
      id: 'service-api',
      label: 'service:forge-api',
      tone: 'neutral' as const
    }, {
      id: 'severity-p1',
      label: 'severity:P1',
      tone: 'bad' as const
    }];
    const [chips, setChips] = React.useState(initial);
    return <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      alignItems: 'center'
    }}>
        {chips.map(c => <Chip key={c.id} tone={c.tone} onRemove={() => setChips(prev => prev.filter(x => x.id !== c.id))} removeLabel={\`Remove filter \${c.label}\`}>
            {c.label}
          </Chip>)}
        {chips.length === 0 && <button style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--fg-muted)',
        cursor: 'pointer'
      }} onClick={() => setChips(initial)}>
            Restore filters
          </button>}
      </div>;
  }
}`,...f.parameters?.docs?.source},description:{story:`Removable — trailing × button for filter chips and tag-style attribute lists.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  }}>
      {[{
      tier: 'tier-t1' as const,
      label: 'tier-1',
      service: 'forge-api',
      slo: '99.99%'
    }, {
      tier: 'tier-t2' as const,
      label: 'tier-2',
      service: 'forge-webhooks',
      slo: '99.9%'
    }, {
      tier: 'tier-t3' as const,
      label: 'tier-3',
      service: 'forge-preview',
      slo: '99.5%'
    }].map(({
      tier,
      label,
      service,
      slo
    }) => <div key={tier} style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }}>
          <Chip tone={tier}>{label}</Chip>
          <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        color: 'var(--fg)'
      }}>{service}</span>
          <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--fg-muted)'
      }}>SLO {slo}</span>
        </div>)}
    </div>
}`,...p.parameters?.docs?.source},description:{story:`Reliability tiers — service classification used in the incident dashboard.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div dir="rtl" style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center'
  }}>
      <Chip tone="neutral">v2.14.0</Chip>
      <Chip tone="ok" trend="up">p99 42 ms</Chip>
      <Chip tone="bad" trend="down">معدل الخطأ +3.2%</Chip>
      <Chip tone="tier-t1">tier-1</Chip>
      <Chip tone="ember" onRemove={() => {}} removeLabel="إزالة الفلتر">
        env:prod
      </Chip>
    </div>
}`,...m.parameters?.docs?.source},description:{story:`RTL — layout composes logically; trend arrows are intentionally direction-neutral (up = up).`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div className="surface" style={{
    padding: 20,
    borderRadius: 10,
    maxWidth: 480,
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  }}>
      <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
        <span style={{
        fontWeight: 600,
        fontSize: 'var(--text-base)',
        color: 'var(--fg)'
      }}>
          forge-api
        </span>
        <Chip tone="tier-t1">tier-1</Chip>
      </div>
      <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }}>
        <Chip tone="neutral">v2.14.0</Chip>
        <Chip tone="ok" trend="up">p50 12 ms</Chip>
        <Chip tone="warn" trend="down">p99 420 ms</Chip>
        <Chip tone="neutral">us-east-1</Chip>
      </div>
      <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }}>
        <Chip tone="ember">canary</Chip>
        <Chip tone="neutral">main@a3f9c12</Chip>
      </div>
    </div>
}`,...h.parameters?.docs?.source},description:{story:`In context — chips used inside a deploy summary card alongside service metadata.`,...h.parameters?.docs?.description}}},g=[`Default`,`Tones`,`WithTrend`,`Removable`,`ReliabilityTiers`,`RTL`,`InContext`]}))();export{l as Default,h as InContext,m as RTL,p as ReliabilityTiers,f as Removable,u as Tones,d as WithTrend,g as __namedExportsOrder,c as default};