import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Hn as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p;e((()=>{o=t(n(),1),a(),s=r(),c={title:`AI/PromptSubmit`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:`Status-aware submit button for the AI prompt composer footer. Renders four distinct states — ready (arrow-up), submitted (spinner), streaming (stop square), and error (retry) — so the affordance always matches the current agent lifecycle phase. Drop it into any .pi-foot toolbar or compose it standalone in a custom input shell.`}}},args:{status:`ready`,hasText:!0},argTypes:{status:{control:`inline-radio`,options:[`ready`,`submitted`,`streaming`,`error`]},hasText:{control:`boolean`}}},l={args:{status:`ready`,hasText:!0,onClick:()=>{}}},u={args:{status:`ready`,hasText:!1}},d={render:()=>(0,s.jsx)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:32,alignItems:`flex-start`},children:[{label:`ready · no text`,status:`ready`,hasText:!1},{label:`ready · has text`,status:`ready`,hasText:!0},{label:`submitted`,status:`submitted`},{label:`streaming`,status:`streaming`},{label:`error`,status:`error`}].map(({label:e,status:t,hasText:n})=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:8},children:[(0,s.jsx)(i,{status:t,hasText:n,onClick:()=>{}}),(0,s.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`,whiteSpace:`nowrap`},children:e})]},e))})},f={render:()=>{let[e,t]=o.useState(`ready`),[n,r]=o.useState(``);return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:16,maxWidth:480},children:[(0,s.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:8,border:`1px solid var(--border)`,borderRadius:8,padding:`8px 12px`,background:`var(--surface)`},children:[(0,s.jsx)(`input`,{style:{flex:1,background:`transparent`,border:`none`,outline:`none`,color:`var(--fg)`,fontFamily:`var(--font-sans)`,fontSize:14},placeholder:`Describe the deploy failure or paste a trace…`,value:n,onChange:e=>r(e.target.value),disabled:e===`submitted`||e===`streaming`}),(0,s.jsx)(i,{status:e,hasText:n.trim().length>0,onClick:()=>{e===`ready`&&n.trim()?(t(`submitted`),setTimeout(()=>t(`streaming`),900),setTimeout(()=>t(`ready`),2800)):(e===`streaming`||e===`error`)&&t(`ready`)}})]}),(0,s.jsxs)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:[`status: `,(0,s.jsx)(`strong`,{style:{color:`var(--accent)`},children:e}),e===`ready`&&!n.trim()&&` — type to enable submit`,e===`streaming`&&` — click stop square to abort`]})]})}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'ready',
    hasText: true,
    onClick: () => {}
  }
}`,...l.parameters?.docs?.source},description:{story:`Ready state with text present — submit is enabled and shows the arrow-up icon.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'ready',
    hasText: false
  }
}`,...u.parameters?.docs?.source},description:{story:`Ready state with no text — submit is disabled, signalling the composer is empty.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    const items: Array<{
      label: string;
      status: 'ready' | 'submitted' | 'streaming' | 'error';
      hasText?: boolean;
    }> = [{
      label: 'ready · no text',
      status: 'ready',
      hasText: false
    }, {
      label: 'ready · has text',
      status: 'ready',
      hasText: true
    }, {
      label: 'submitted',
      status: 'submitted'
    }, {
      label: 'streaming',
      status: 'streaming'
    }, {
      label: 'error',
      status: 'error'
    }];
    return <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 32,
      alignItems: 'flex-start'
    }}>
        {items.map(({
        label,
        status,
        hasText
      }) => <div key={label} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8
      }}>
            <PromptSubmit status={status} hasText={hasText} onClick={() => {}} />
            <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--fg-muted)',
          whiteSpace: 'nowrap'
        }}>
              {label}
            </span>
          </div>)}
      </div>;
  }
}`,...d.parameters?.docs?.source},description:{story:`All four status states rendered side by side.
Covers the full status × hasText matrix so reviewers can compare the visual
variants in one glance.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [status, setStatus] = React.useState<'ready' | 'submitted' | 'streaming' | 'error'>('ready');
    const [text, setText] = React.useState('');
    const handleClick = () => {
      if (status === 'ready' && text.trim()) {
        setStatus('submitted');
        // Simulate network round-trip before streaming begins
        setTimeout(() => setStatus('streaming'), 900);
        // Simulate stream completing
        setTimeout(() => setStatus('ready'), 2800);
      } else if (status === 'streaming') {
        setStatus('ready');
      } else if (status === 'error') {
        setStatus('ready');
      }
    };
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      maxWidth: 480
    }}>
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '8px 12px',
        background: 'var(--surface)'
      }}>
          <input style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: 'var(--fg)',
          fontFamily: 'var(--font-sans)',
          fontSize: 14
        }} placeholder="Describe the deploy failure or paste a trace…" value={text} onChange={e => setText(e.target.value)} disabled={status === 'submitted' || status === 'streaming'} />
          <PromptSubmit status={status} hasText={text.trim().length > 0} onClick={handleClick} />
        </div>
        <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)'
      }}>
          status: <strong style={{
          color: 'var(--accent)'
        }}>{status}</strong>
          {status === 'ready' && !text.trim() && ' — type to enable submit'}
          {status === 'streaming' && ' — click stop square to abort'}
        </span>
      </div>;
  }
}`,...f.parameters?.docs?.source},description:{story:`Interactive demo — click Submit to cycle through the lifecycle:
ready → submitted → streaming → ready. Click again while streaming to stop.`,...f.parameters?.docs?.description}}},p=[`Default`,`ReadyEmpty`,`States`,`Interactive`]}))();export{l as Default,f as Interactive,u as ReadyEmpty,d as States,p as __namedExportsOrder,c as default};