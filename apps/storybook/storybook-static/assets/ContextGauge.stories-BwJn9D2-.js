import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Sr as i,Vn as a,t as o}from"./src-DgoylXRw.js";var s,c,l,u,d,f,p,m,h,g,_,v;e((()=>{s=t(n(),1),o(),c=r(),l={title:`AI/ContextGauge`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:'`ContextGauge` is a radial SVG ring that shows how much of a model\'s context window is consumed. It accepts `used` (tokens used) and `total` (window size) and shifts tone from **ok → mid → warn** at configurable thresholds. Use `compact` to show only the ring + percent in tight rows (e.g. the PromptInput footer). **Deprecated:** prefer `<Context variant="gauge" />` in new code — this wrapper forwards all props unchanged.'}}},args:{used:28500,total:128e3,size:18,label:!0,compact:!1,thresholdMid:.6,thresholdWarn:.85},argTypes:{used:{control:`number`},total:{control:`number`},size:{control:`number`},label:{control:`boolean`},compact:{control:`boolean`},files:{control:`number`},thresholdMid:{control:`number`},thresholdWarn:{control:`number`}}},u={},d={name:`Variants — tones × modes`,render:()=>(0,c.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:24,maxWidth:560},children:(0,c.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`96px 1fr 1fr`,gap:`8px 24px`,alignItems:`center`},children:[(0,c.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:10,color:`var(--fg-faint)`,textTransform:`uppercase`,letterSpacing:`0.08em`},children:`tone`}),(0,c.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:10,color:`var(--fg-faint)`,textTransform:`uppercase`,letterSpacing:`0.08em`},children:`gauge (label)`}),(0,c.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:10,color:`var(--fg-faint)`,textTransform:`uppercase`,letterSpacing:`0.08em`},children:`compact`}),[{label:`ok    (22%)`,used:28500,total:128e3},{label:`mid   (66%)`,used:84480,total:128e3},{label:`warn  (91%)`,used:116480,total:128e3}].map(({label:e,used:t,total:n})=>(0,c.jsxs)(s.Fragment,{children:[(0,c.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:e}),(0,c.jsx)(i,{used:t,total:n,size:18,label:!0}),(0,c.jsx)(i,{used:t,total:n,size:18,compact:!0})]},e))]})})},f={name:`With file count`,args:{used:54e3,total:128e3,files:4}},p={name:`Large (32px)`,args:{used:54e3,total:128e3,size:32}},m={name:`Warning zone (91%)`,args:{used:116480,total:128e3}},h={name:`Near full (99%)`,args:{used:127e3,total:128e3}},g={name:`In PromptInput footer`,render:()=>(0,c.jsx)(`div`,{style:{maxWidth:640},children:(0,c.jsx)(a,{value:``,onChange:()=>{},onSubmit:()=>{},modelValue:`forge-sonnet-4-6`,onModelChange:()=>{},contextSlot:(0,c.jsx)(i,{used:54e3,total:128e3,files:2}),placeholder:`Ask about the fraud-engine incident…`})})},_={name:`Custom thresholds (mid 50%, warn 75%)`,render:()=>(0,c.jsxs)(`div`,{style:{display:`flex`,gap:24,alignItems:`center`,flexWrap:`wrap`},children:[(0,c.jsx)(i,{used:38400,total:128e3,thresholdMid:.5,thresholdWarn:.75}),(0,c.jsx)(i,{used:76800,total:128e3,thresholdMid:.5,thresholdWarn:.75}),(0,c.jsx)(i,{used:102400,total:128e3,thresholdMid:.5,thresholdWarn:.75})]})},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{}`,...u.parameters?.docs?.source},description:{story:`Default — low usage (ok tone), radial ring + token counts.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: 'Variants — tones × modes',
  render: () => {
    const rows: {
      label: string;
      used: number;
      total: number;
    }[] = [{
      label: 'ok    (22%)',
      used: 28500,
      total: 128000
    }, {
      label: 'mid   (66%)',
      used: 84480,
      total: 128000
    }, {
      label: 'warn  (91%)',
      used: 116480,
      total: 128000
    }];
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      maxWidth: 560
    }}>
        <div style={{
        display: 'grid',
        gridTemplateColumns: '96px 1fr 1fr',
        gap: '8px 24px',
        alignItems: 'center'
      }}>
          {/* Header row */}
          <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--fg-faint)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em'
        }}>
            tone
          </span>
          <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--fg-faint)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em'
        }}>
            gauge (label)
          </span>
          <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--fg-faint)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em'
        }}>
            compact
          </span>

          {/* Data rows */}
          {rows.map(({
          label,
          used,
          total
        }) => <React.Fragment key={label}>
              <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--fg-muted)'
          }}>
                {label}
              </span>
              <ContextGauge used={used} total={total} size={18} label />
              <ContextGauge used={used} total={total} size={18} compact />
            </React.Fragment>)}
        </div>
      </div>;
  }
}`,...d.parameters?.docs?.source},description:{story:`All tonal states and both display modes side by side.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: 'With file count',
  args: {
    used: 54000,
    total: 128000,
    files: 4
  }
}`,...f.parameters?.docs?.source},description:{story:`With file count — shows the "· N files" annotation beside token numbers.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: 'Large (32px)',
  args: {
    used: 54000,
    total: 128000,
    size: 32
  }
}`,...p.parameters?.docs?.source},description:{story:`Large radial (32px) — for prominent placements like session headers.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: 'Warning zone (91%)',
  args: {
    used: 116480,
    total: 128000
  }
}`,...m.parameters?.docs?.source},description:{story:`Warning zone — approaching context limit triggers the warn tone.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: 'Near full (99%)',
  args: {
    used: 127000,
    total: 128000
  }
}`,...h.parameters?.docs?.source},description:{story:`Near-full — 99% consumed, context limit imminent.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: 'In PromptInput footer',
  render: () => <div style={{
    maxWidth: 640
  }}>
      <PromptInput value="" onChange={() => {}} onSubmit={() => {}} modelValue="forge-sonnet-4-6" onModelChange={() => {}} contextSlot={<ContextGauge used={54000} total={128000} files={2} />} placeholder="Ask about the fraud-engine incident…" />
    </div>
}`,...g.parameters?.docs?.source},description:{story:`Embedded in PromptInput — the canonical placement in the composer footer.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: 'Custom thresholds (mid 50%, warn 75%)',
  render: () => <div style={{
    display: 'flex',
    gap: 24,
    alignItems: 'center',
    flexWrap: 'wrap'
  }}>
      <ContextGauge used={38400} total={128000} thresholdMid={0.5} thresholdWarn={0.75} />
      <ContextGauge used={76800} total={128000} thresholdMid={0.5} thresholdWarn={0.75} />
      <ContextGauge used={102400} total={128000} thresholdMid={0.5} thresholdWarn={0.75} />
    </div>
}`,..._.parameters?.docs?.source},description:{story:`All three tones at custom thresholds — mid at 50%, warn at 75%.`,..._.parameters?.docs?.description}}},v=[`Default`,`Variants`,`WithFiles`,`Large`,`WarnZone`,`NearFull`,`InPromptInput`,`CustomThresholds`]}))();export{_ as CustomThresholds,u as Default,g as InPromptInput,p as Large,h as NearFull,d as Variants,m as WarnZone,f as WithFiles,v as __namedExportsOrder,l as default};