import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{Ta as r,t as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u,d,f;e((()=>{t(),i(),a=n(),o={title:`Primitives/Counter`,component:r,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:"`Counter` is the back-compat alias for `CountUp`. Use `CountUp` in new code; `Counter` is kept for one-release compatibility and resolves to the identical implementation. Animates a numeric value from `from` (default 0) to `to` using a cubic ease-out, triggered once when the element enters the viewport (IntersectionObserver, threshold 0.4). Under `prefers-reduced-motion` the duration collapses to 0 and the final value renders immediately."}}},args:{to:99,from:0,suffix:``,prefix:``,dur:1200,decimals:0},argTypes:{to:{control:`number`,description:`Target numeric value.`},from:{control:`number`,description:`Start value (default 0).`},suffix:{control:`text`,description:`String appended after the number.`},prefix:{control:`text`,description:`String prepended before the number.`},dur:{control:`number`,description:`Animation duration in ms (0 = instant).`},decimals:{control:`number`,description:`Decimal places to display.`}}},s={args:{to:99,suffix:``}},c={render:()=>(0,a.jsx)(`div`,{style:{display:`flex`,gap:16,flexWrap:`wrap`},children:[{label:`Build Count`,to:3712,prefix:``,suffix:``,decimals:0,dur:1e3},{label:`Test Coverage`,to:94.7,prefix:``,suffix:`%`,decimals:1,dur:900},{label:`P95 Latency`,to:237,prefix:``,suffix:` ms`,decimals:0,dur:800},{label:`Error Rate`,to:.38,prefix:``,suffix:`%`,decimals:2,dur:1e3},{label:`Uptime SLA`,to:99.95,prefix:``,suffix:`%`,decimals:2,dur:1200}].map(({label:e,to:t,prefix:n,suffix:i,decimals:o,dur:s})=>(0,a.jsxs)(`div`,{style:{background:`var(--surface)`,border:`1px solid var(--border)`,borderRadius:8,padding:`16px 20px`,minWidth:148},children:[(0,a.jsx)(`div`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,marginBottom:6,textTransform:`uppercase`,letterSpacing:`0.04em`},children:e}),(0,a.jsx)(`div`,{style:{fontSize:26,fontWeight:600,color:`var(--fg)`,lineHeight:1},children:(0,a.jsx)(r,{to:t,prefix:n,suffix:i,decimals:o,dur:s})})]},e))})},l={args:{to:3712,dur:0},parameters:{docs:{description:{story:"When `dur` is 0 the final value paints on first render with no animation frame. This mirrors the automatic `prefers-reduced-motion: reduce` behaviour."}}}},u={render:()=>(0,a.jsxs)(`div`,{style:{background:`var(--surface)`,border:`1px solid var(--border)`,borderRadius:10,padding:24,maxWidth:480,display:`flex`,flexDirection:`column`,gap:20},children:[(0,a.jsx)(`div`,{style:{fontWeight:600,fontSize:`var(--text-base)`,color:`var(--fg)`},children:`Incident · INC-4182`}),(0,a.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(3, 1fr)`,gap:12},children:[{label:`Affected services`,to:7,suffix:``,decimals:0,dur:700},{label:`Events ingested`,to:41203,suffix:``,decimals:0,dur:1100},{label:`Avg TTD`,to:18,suffix:` s`,decimals:0,dur:800}].map(({label:e,to:t,suffix:n,decimals:i,dur:o})=>(0,a.jsxs)(`div`,{style:{background:`var(--bg)`,border:`1px solid var(--border)`,borderRadius:6,padding:`12px 14px`},children:[(0,a.jsx)(`div`,{style:{fontSize:10,fontFamily:`var(--font-mono)`,color:`var(--fg-faint)`,textTransform:`uppercase`,letterSpacing:`0.05em`,marginBottom:4},children:e}),(0,a.jsx)(`div`,{style:{fontSize:22,fontWeight:600,color:`var(--fg)`},children:(0,a.jsx)(r,{to:t,suffix:n,decimals:i,dur:o})})]},e))}),(0,a.jsx)(`div`,{style:{fontSize:`var(--text-sm)`,color:`var(--fg-muted)`,fontFamily:`var(--font-mono)`},children:`Commander: sre-on-call · opened 23 min ago · region us-east-1`})]})},d={render:()=>(0,a.jsx)(`div`,{dir:`rtl`,style:{display:`flex`,gap:16,flexWrap:`wrap`},children:[{label:`عمليات النشر`,to:3712,suffix:``,decimals:0},{label:`تغطية الاختبار`,to:94.7,suffix:`%`,decimals:1},{label:`وقت التشغيل`,to:99.9,suffix:`%`,decimals:1}].map(({label:e,to:t,suffix:n,decimals:i})=>(0,a.jsxs)(`div`,{style:{background:`var(--surface)`,border:`1px solid var(--border)`,borderRadius:8,padding:`16px 20px`,minWidth:148,textAlign:`start`},children:[(0,a.jsx)(`div`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,marginBottom:6},children:e}),(0,a.jsx)(`div`,{style:{fontSize:26,fontWeight:600,color:`var(--fg)`},children:(0,a.jsx)(r,{to:t,suffix:n,decimals:i,dur:900})})]},e))})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    to: 99,
    suffix: ''
  }
}`,...s.parameters?.docs?.source},description:{story:`Smallest real example — a single deployment-count figure.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap'
  }}>
      {[{
      label: 'Build Count',
      to: 3712,
      prefix: '',
      suffix: '',
      decimals: 0,
      dur: 1000
    }, {
      label: 'Test Coverage',
      to: 94.7,
      prefix: '',
      suffix: '%',
      decimals: 1,
      dur: 900
    }, {
      label: 'P95 Latency',
      to: 237,
      prefix: '',
      suffix: ' ms',
      decimals: 0,
      dur: 800
    }, {
      label: 'Error Rate',
      to: 0.38,
      prefix: '',
      suffix: '%',
      decimals: 2,
      dur: 1000
    }, {
      label: 'Uptime SLA',
      to: 99.95,
      prefix: '',
      suffix: '%',
      decimals: 2,
      dur: 1200
    }].map(({
      label,
      to,
      prefix,
      suffix,
      decimals,
      dur
    }) => <div key={label} style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '16px 20px',
      minWidth: 148
    }}>
          <div style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg-muted)',
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: '0.04em'
      }}>
            {label}
          </div>
          <div style={{
        fontSize: 26,
        fontWeight: 600,
        color: 'var(--fg)',
        lineHeight: 1
      }}>
            <Counter to={to} prefix={prefix} suffix={suffix} decimals={decimals} dur={dur} />
          </div>
        </div>)}
    </div>
}`,...c.parameters?.docs?.source},description:{story:`Variant matrix — every combination of prefix / suffix / decimals
representative of IDP and DevEx dashboard tiles:
build count, coverage, p95 latency, error rate, uptime SLA.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    to: 3712,
    dur: 0
  },
  parameters: {
    docs: {
      description: {
        story: 'When \`dur\` is 0 the final value paints on first render with no animation frame. ' + 'This mirrors the automatic \`prefers-reduced-motion: reduce\` behaviour.'
      }
    }
  }
}`,...l.parameters?.docs?.source},description:{story:`Instant render (dur=0) — simulates the prefers-reduced-motion path or
server-side hydration where animation must not run.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: 24,
    maxWidth: 480,
    display: 'flex',
    flexDirection: 'column',
    gap: 20
  }}>
      <div style={{
      fontWeight: 600,
      fontSize: 'var(--text-base)',
      color: 'var(--fg)'
    }}>
        Incident · INC-4182
      </div>

      <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 12
    }}>
        {[{
        label: 'Affected services',
        to: 7,
        suffix: '',
        decimals: 0,
        dur: 700
      }, {
        label: 'Events ingested',
        to: 41203,
        suffix: '',
        decimals: 0,
        dur: 1100
      }, {
        label: 'Avg TTD',
        to: 18,
        suffix: ' s',
        decimals: 0,
        dur: 800
      }].map(({
        label,
        to,
        suffix,
        decimals,
        dur
      }) => <div key={label} style={{
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: 6,
        padding: '12px 14px'
      }}>
            <div style={{
          fontSize: 10,
          fontFamily: 'var(--font-mono)',
          color: 'var(--fg-faint)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: 4
        }}>
              {label}
            </div>
            <div style={{
          fontSize: 22,
          fontWeight: 600,
          color: 'var(--fg)'
        }}>
              <Counter to={to} suffix={suffix} decimals={decimals} dur={dur} />
            </div>
          </div>)}
      </div>

      <div style={{
      fontSize: 'var(--text-sm)',
      color: 'var(--fg-muted)',
      fontFamily: 'var(--font-mono)'
    }}>
        Commander: sre-on-call · opened 23 min ago · region us-east-1
      </div>
    </div>
}`,...u.parameters?.docs?.source},description:{story:`Agent throughput card — incident-response dashboard context.
Shows how Counter fits alongside status labels on a dark surface.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div dir="rtl" style={{
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap'
  }}>
      {[{
      label: 'عمليات النشر',
      to: 3712,
      suffix: '',
      decimals: 0
    }, {
      label: 'تغطية الاختبار',
      to: 94.7,
      suffix: '%',
      decimals: 1
    }, {
      label: 'وقت التشغيل',
      to: 99.9,
      suffix: '%',
      decimals: 1
    }].map(({
      label,
      to,
      suffix,
      decimals
    }) => <div key={label} style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '16px 20px',
      minWidth: 148,
      textAlign: 'start'
    }}>
          <div style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg-muted)',
        marginBottom: 6
      }}>
            {label}
          </div>
          <div style={{
        fontSize: 26,
        fontWeight: 600,
        color: 'var(--fg)'
      }}>
            <Counter to={to} suffix={suffix} decimals={decimals} dur={900} />
          </div>
        </div>)}
    </div>
}`,...d.parameters?.docs?.source},description:{story:`RTL layout — numeric value and surrounding label reverse correctly.`,...d.parameters?.docs?.description}}},f=[`Default`,`Variants`,`ReducedMotion`,`InContext`,`RTL`]}))();export{s as Default,u as InContext,d as RTL,l as ReducedMotion,c as Variants,f as __namedExportsOrder,o as default};