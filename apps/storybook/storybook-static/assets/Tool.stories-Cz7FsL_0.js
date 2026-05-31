import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{ar as r,ir as i,rr as a,t as o}from"./src-DgoylXRw.js";var s,c,l,u,d,f,p,m,h,g;e((()=>{t(),o(),s=n(),c={service:`fraud-engine`,since:`2026-05-28T00:00:00Z`,limit:50},l={user_id:`usr_4f9a2c`,fields:[`risk_score`,`kyc_status`,`last_pix`]},u={title:`AI/Tool`,component:a,tags:[`autodocs`],parameters:{docs:{description:{component:`A four-state (input-streaming → input-available → output-available → output-error) collapsible block representing one agent tool call. Compose with ToolInput and ToolOutput as children.`}}},args:{name:`search_incidents`,ns:`forge.ai`,state:`output-available`,ms:312},argTypes:{name:{control:`text`},ns:{control:`text`},state:{control:`select`,options:[`input-streaming`,`input-available`,`output-available`,`output-error`]},ms:{control:`number`},defaultOpen:{control:`boolean`}}},d={render:e=>(0,s.jsxs)(a,{...e,children:[(0,s.jsx)(i,{params:c,paramsHint:`3 args`}),(0,s.jsx)(r,{meta:`2 results`,children:(0,s.jsx)(`p`,{style:{margin:`8px 12px`,fontSize:13,color:`var(--fg-muted)`},children:`Found 2 incidents in fraud-engine matching the query window.`})})]})},f={args:{state:`input-streaming`,ms:void 0,name:`lookup_user`},render:e=>(0,s.jsx)(a,{...e,children:(0,s.jsx)(i,{params:l,streaming:!0})})},p={args:{state:`input-available`,ms:void 0,name:`lookup_user`},render:e=>(0,s.jsx)(a,{...e,children:(0,s.jsx)(i,{params:l,paramsHint:`2 args`})})},m={args:{state:`output-error`,ms:88,name:`lookup_user`},render:e=>(0,s.jsxs)(a,{...e,children:[(0,s.jsx)(i,{params:l,paramsHint:`2 args`}),(0,s.jsx)(r,{label:`Error`,meta:`404`,children:(0,s.jsx)(`p`,{style:{margin:`8px 12px`,fontSize:13,color:`var(--fg-error, #e53e3e)`},children:`User not found: usr_4f9a2c`})})]})},h={render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:8,maxWidth:620},children:[(0,s.jsxs)(a,{name:`lookup_user`,ns:`forge.ai`,state:`output-available`,ms:142,children:[(0,s.jsx)(i,{params:l,paramsHint:`2 args`}),(0,s.jsx)(r,{meta:`1 result`,children:(0,s.jsx)(`p`,{style:{margin:`8px 12px`,fontSize:13,color:`var(--fg-muted)`},children:`Risk score: 74 · KYC: approved · Last Pix: 2026-05-28`})})]}),(0,s.jsxs)(a,{name:`search_incidents`,ns:`forge.ai`,state:`output-available`,ms:312,children:[(0,s.jsx)(i,{params:c,paramsHint:`3 args`}),(0,s.jsx)(r,{meta:`2 results`,children:(0,s.jsx)(`p`,{style:{margin:`8px 12px`,fontSize:13,color:`var(--fg-muted)`},children:`2 incidents found in the fraud-engine service.`})})]}),(0,s.jsx)(a,{name:`get_service_health`,ns:`forge.infra`,state:`input-available`,ms:void 0,children:(0,s.jsx)(i,{params:{service:`fraud-engine`,region:`sa-east-1`},paramsHint:`2 args`})})]})},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <Tool {...args}>
      <ToolInput params={SEARCH_PARAMS} paramsHint="3 args" />
      <ToolOutput meta="2 results">
        <p style={{
        margin: '8px 12px',
        fontSize: 13,
        color: 'var(--fg-muted)'
      }}>
          Found 2 incidents in fraud-engine matching the query window.
        </p>
      </ToolOutput>
    </Tool>
}`,...d.parameters?.docs?.source},description:{story:`Single call, settled with both input and output visible.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    state: 'input-streaming',
    ms: undefined,
    name: 'lookup_user'
  },
  render: args => <Tool {...args}>
      <ToolInput params={LOOKUP_PARAMS} streaming />
    </Tool>
}`,...f.parameters?.docs?.source},description:{story:`Input is still streaming — JSON skeleton shimmer, no output yet.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    state: 'input-available',
    ms: undefined,
    name: 'lookup_user'
  },
  render: args => <Tool {...args}>
      <ToolInput params={LOOKUP_PARAMS} paramsHint="2 args" />
    </Tool>
}`,...p.parameters?.docs?.source},description:{story:`Input arrived but the call is still running — no output section yet.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    state: 'output-error',
    ms: 88,
    name: 'lookup_user'
  },
  render: args => <Tool {...args}>
      <ToolInput params={LOOKUP_PARAMS} paramsHint="2 args" />
      <ToolOutput label="Error" meta="404">
        <p style={{
        margin: '8px 12px',
        fontSize: 13,
        color: 'var(--fg-error, #e53e3e)'
      }}>
          User not found: usr_4f9a2c
        </p>
      </ToolOutput>
    </Tool>
}`,...m.parameters?.docs?.source},description:{story:`The tool returned an error. Output section is labeled "Error".`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    maxWidth: 620
  }}>
      <Tool name="lookup_user" ns="forge.ai" state="output-available" ms={142}>
        <ToolInput params={LOOKUP_PARAMS} paramsHint="2 args" />
        <ToolOutput meta="1 result">
          <p style={{
          margin: '8px 12px',
          fontSize: 13,
          color: 'var(--fg-muted)'
        }}>
            Risk score: 74 · KYC: approved · Last Pix: 2026-05-28
          </p>
        </ToolOutput>
      </Tool>
      <Tool name="search_incidents" ns="forge.ai" state="output-available" ms={312}>
        <ToolInput params={SEARCH_PARAMS} paramsHint="3 args" />
        <ToolOutput meta="2 results">
          <p style={{
          margin: '8px 12px',
          fontSize: 13,
          color: 'var(--fg-muted)'
        }}>
            2 incidents found in the fraud-engine service.
          </p>
        </ToolOutput>
      </Tool>
      <Tool name="get_service_health" ns="forge.infra" state="input-available" ms={undefined}>
        <ToolInput params={{
        service: 'fraud-engine',
        region: 'sa-east-1'
      }} paramsHint="2 args" />
      </Tool>
    </div>
}`,...h.parameters?.docs?.source},description:{story:`Multiple tool calls stacked — common in agentic reasoning traces.`,...h.parameters?.docs?.description}}},g=[`Default`,`InputStreaming`,`InputAvailable`,`OutputError`,`MultipleTools`]}))();export{d as Default,p as InputAvailable,f as InputStreaming,h as MultipleTools,m as OutputError,g as __namedExportsOrder,u as default};