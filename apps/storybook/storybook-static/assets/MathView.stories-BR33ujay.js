import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{jr as r,t as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u,d,f;e((()=>{t(),i(),a=n(),o={title:`AI/MathView`,component:r,tags:[`autodocs`],parameters:{docs:{description:{component:"A styled surface for mathematical expressions inside an AI reply. Accepts pre-rendered KaTeX HTML via the `html` prop (rendered with `dangerouslySetInnerHTML`) or plain-text / React children as a fallback. Use `display={false}` (default) for inline terms within prose, and `display={true}` for standalone centred equations that occupy their own line."}},layout:`padded`},args:{display:!1,children:`risk = 0.4·complexity + 0.3·blast_radius + 0.3·coverage_delta`},argTypes:{display:{control:`boolean`},html:{control:`text`},className:{control:`text`}}},s={render:e=>(0,a.jsxs)(`p`,{style:{fontFamily:`var(--font-sans)`,fontSize:14,color:`var(--fg)`,lineHeight:1.8},children:[`The fraud risk score for each transaction is computed as`,` `,(0,a.jsx)(r,{...e}),` `,`where each term is normalised to the interval [0, 1].`]})},c={name:`Variants — inline and block`,render:()=>(0,a.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:28,fontFamily:`var(--font-sans)`,fontSize:14,color:`var(--fg)`},children:[(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`,display:`block`,marginBottom:8},children:`display=false (inline)`}),(0,a.jsxs)(`p`,{style:{lineHeight:1.8,margin:0},children:[`P99 latency is flagged when`,` `,(0,a.jsx)(r,{children:`p99 > SLO_threshold * 1.5`}),` `,`for two consecutive 5-minute windows.`]})]}),(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`,display:`block`,marginBottom:8},children:`display=true (block)`}),(0,a.jsx)(`p`,{style:{lineHeight:1.8,margin:`0 0 8px`},children:`The Engineering Throughput Index (ETI) aggregates five pillars:`}),(0,a.jsx)(r,{display:!0,children:`ETI = (velocity + quality + reliability + ai_adoption + standards) / 5`}),(0,a.jsx)(`p`,{style:{lineHeight:1.8,margin:`8px 0 0`,color:`var(--fg-muted)`},children:`Each pillar is a normalised score in [0, 100].`})]})]})},l={name:`Inline in prose`,render:()=>(0,a.jsxs)(`div`,{style:{fontFamily:`var(--font-sans)`,fontSize:14,color:`var(--fg)`,lineHeight:1.8,maxWidth:560},children:[(0,a.jsxs)(`p`,{style:{margin:`0 0 12px`},children:[`The canary rollout uses a stepped traffic model. Let`,` `,(0,a.jsx)(r,{children:`r(t)`}),` be the traffic fraction at time`,` `,(0,a.jsx)(r,{children:`t`}),`. The step function is defined as:`]}),(0,a.jsx)(r,{display:!0,children:`r(t) = min(r_max, r_0 * e^(k * t))`}),(0,a.jsxs)(`p`,{style:{margin:`12px 0 0`},children:[`We stop advancing when the p95 error rate`,` `,(0,a.jsx)(r,{children:`ε_p95`}),` exceeds`,` `,(0,a.jsx)(r,{children:`ε_baseline * 1.1`}),` `,`for more than two consecutive measurement windows.`]})]})},u={name:`With html prop (simulated KaTeX)`,render:()=>(0,a.jsxs)(`div`,{style:{fontFamily:`var(--font-sans)`,fontSize:14,color:`var(--fg)`,lineHeight:1.8},children:[(0,a.jsx)(`p`,{style:{margin:`0 0 8px`},children:`The deployment health score passed to the circuit breaker is:`}),(0,a.jsx)(r,{display:!0,html:`<span style="font-family:var(--font-mono);letter-spacing:0.02em">H = (1 − error_rate) × (1 − latency_penalty) × availability</span>`}),(0,a.jsx)(`p`,{style:{margin:`8px 0 0`,color:`var(--fg-muted)`},children:`A score below 0.85 triggers automatic ring-0 rollback.`})]})},d={name:`Children fallback (no html)`,render:()=>(0,a.jsxs)(`div`,{style:{fontFamily:`var(--font-sans)`,fontSize:14,color:`var(--fg)`,lineHeight:1.8},children:[(0,a.jsx)(`p`,{style:{margin:`0 0 8px`},children:`Blast radius estimate before KaTeX loads:`}),(0,a.jsx)(r,{display:!0,children:`blast_radius = affected_services / total_downstream_count`})]})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: args => <p style={{
    fontFamily: 'var(--font-sans)',
    fontSize: 14,
    color: 'var(--fg)',
    lineHeight: 1.8
  }}>
      The fraud risk score for each transaction is computed as{' '}
      <MathView {...args} />{' '}
      where each term is normalised to the interval [0, 1].
    </p>
}`,...s.parameters?.docs?.source},description:{story:`Inline expression — embedded in a sentence of prose inside a model reply.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: 'Variants — inline and block',
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
    fontFamily: 'var(--font-sans)',
    fontSize: 14,
    color: 'var(--fg)'
  }}>
      {/* Inline */}
      <div>
        <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)',
        display: 'block',
        marginBottom: 8
      }}>
          display=false (inline)
        </span>
        <p style={{
        lineHeight: 1.8,
        margin: 0
      }}>
          P99 latency is flagged when{' '}
          <MathView>{'p99 > SLO_threshold * 1.5'}</MathView>{' '}
          for two consecutive 5-minute windows.
        </p>
      </div>
      {/* Block */}
      <div>
        <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)',
        display: 'block',
        marginBottom: 8
      }}>
          display=true (block)
        </span>
        <p style={{
        lineHeight: 1.8,
        margin: '0 0 8px'
      }}>
          The Engineering Throughput Index (ETI) aggregates five pillars:
        </p>
        <MathView display>
          {'ETI = (velocity + quality + reliability + ai_adoption + standards) / 5'}
        </MathView>
        <p style={{
        lineHeight: 1.8,
        margin: '8px 0 0',
        color: 'var(--fg-muted)'
      }}>
          Each pillar is a normalised score in [0, 100].
        </p>
      </div>
    </div>
}`,...c.parameters?.docs?.source},description:{story:"Inline vs block — covers both `display` variants side by side.",...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: 'Inline in prose',
  render: () => <div style={{
    fontFamily: 'var(--font-sans)',
    fontSize: 14,
    color: 'var(--fg)',
    lineHeight: 1.8,
    maxWidth: 560
  }}>
      <p style={{
      margin: '0 0 12px'
    }}>
        The canary rollout uses a stepped traffic model. Let{' '}
        <MathView>{'r(t)'}</MathView> be the traffic fraction at time{' '}
        <MathView>{'t'}</MathView>. The step function is defined as:
      </p>
      <MathView display>
        {'r(t) = min(r_max, r_0 * e^(k * t))'}
      </MathView>
      <p style={{
      margin: '12px 0 0'
    }}>
        We stop advancing when the p95 error rate{' '}
        <MathView>{'ε_p95'}</MathView> exceeds{' '}
        <MathView>{'ε_baseline * 1.1'}</MathView>{' '}
        for more than two consecutive measurement windows.
      </p>
    </div>
}`,...l.parameters?.docs?.source},description:{story:`Multiple inline expressions — dense formula-rich prose from an AI analysis reply.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: 'With html prop (simulated KaTeX)',
  render: () => <div style={{
    fontFamily: 'var(--font-sans)',
    fontSize: 14,
    color: 'var(--fg)',
    lineHeight: 1.8
  }}>
      <p style={{
      margin: '0 0 8px'
    }}>
        The deployment health score passed to the circuit breaker is:
      </p>
      {/* Simulated KaTeX output — in production this comes from renderToString(). */}
      <MathView display html={'<span style="font-family:var(--font-mono);letter-spacing:0.02em">H = (1 − error_rate) × (1 − latency_penalty) × availability</span>'} />
      <p style={{
      margin: '8px 0 0',
      color: 'var(--fg-muted)'
    }}>
        A score below 0.85 triggers automatic ring-0 rollback.
      </p>
    </div>
}`,...u.parameters?.docs?.source},description:{story:"Pre-rendered HTML via `html` prop — simulates KaTeX renderToString output.",...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: 'Children fallback (no html)',
  render: () => <div style={{
    fontFamily: 'var(--font-sans)',
    fontSize: 14,
    color: 'var(--fg)',
    lineHeight: 1.8
  }}>
      <p style={{
      margin: '0 0 8px'
    }}>
        Blast radius estimate before KaTeX loads:
      </p>
      <MathView display>
        blast_radius = affected_services / total_downstream_count
      </MathView>
    </div>
}`,...d.parameters?.docs?.source},description:{story:`Children fallback — renders plain-text math when html is not available yet (e.g. KaTeX loading).`,...d.parameters?.docs?.description}}},f=[`Default`,`Variants`,`InlineInProse`,`WithHtmlProp`,`ChildrenFallback`]}))();export{d as ChildrenFallback,s as Default,l as InlineInProse,c as Variants,u as WithHtmlProp,f as __namedExportsOrder,o as default};