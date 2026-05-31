import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{ci as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h,g;e((()=>{o=t(n(),1),a(),s=r(),c=[{label:`production`,value:`prod`},{label:`staging`,value:`staging`},{label:`preview`,value:`preview`},{label:`development`,value:`dev`},{label:`local (offline)`,value:`local`,disabled:!0}],l=[{label:`us-east-1  (N. Virginia)`,value:`us-east-1`},{label:`us-west-2  (Oregon)`,value:`us-west-2`},{label:`eu-west-1  (Ireland)`,value:`eu-west-1`},{label:`ap-southeast-1 (Singapore)`,value:`ap-southeast-1`},{label:`sa-east-1  (São Paulo)`,value:`sa-east-1`}],u={title:`Forms/SelectNative`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:"`SelectNative` is a deprecated alias for `NativeSelect` — a native `<select>` in the Forge field shell. Zero JavaScript: keyboard, form submission, and screen-reader semantics all come from the browser. Use it when the list is short (≤ 7 items), plain text, and system look-and-feel is acceptable. For icons, descriptions, or option groups use the custom `Select`. **Migrate to `NativeSelect`** — this alias will be removed in the next major release."}}},args:{label:`Deploy environment`,options:c,placeholder:`Select an environment…`,help:`Traffic is routed to the selected environment after the deploy completes.`},argTypes:{label:{control:`text`},help:{control:`text`},error:{control:`text`},placeholder:{control:`text`},disabled:{control:`boolean`},options:{control:!1},children:{control:!1}}},d={},f={args:{defaultValue:`staging`,placeholder:void 0}},p={render:()=>(0,s.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(2, 260px)`,gap:`24px 32px`},children:[(0,s.jsx)(i,{label:`Deploy environment`,options:c,placeholder:`Select an environment…`,help:`Traffic is routed after the deploy.`}),(0,s.jsx)(i,{label:`Deploy environment`,options:c,defaultValue:`prod`,help:`Currently deploying to production.`}),(0,s.jsx)(i,{label:`Deploy environment`,options:c,placeholder:`Select an environment…`,error:`An environment is required to continue.`}),(0,s.jsx)(i,{label:`Deploy environment`,options:c,defaultValue:`staging`,disabled:!0,help:`Locked during active rollout.`})]})},m={render:()=>(0,s.jsxs)(i,{label:`Primary region`,placeholder:`Choose a region…`,help:`Determines where your data residency SLA is enforced.`,style:{width:320},children:[(0,s.jsx)(`optgroup`,{label:`Americas`,children:l.filter(e=>e.value.startsWith(`us`)||e.value.startsWith(`sa`)).map(e=>(0,s.jsx)(`option`,{value:e.value,children:e.label},e.value))}),(0,s.jsx)(`optgroup`,{label:`Europe / Middle East / Africa`,children:l.filter(e=>e.value.startsWith(`eu`)).map(e=>(0,s.jsx)(`option`,{value:e.value,children:e.label},e.value))}),(0,s.jsx)(`optgroup`,{label:`Asia Pacific`,children:l.filter(e=>e.value.startsWith(`ap`)).map(e=>(0,s.jsx)(`option`,{value:e.value,children:e.label},e.value))})]})},h={render:()=>{let[e,t]=o.useState(`staging`),n=c.find(t=>t.value===e);return(0,s.jsxs)(`div`,{style:{display:`flex`,gap:32,alignItems:`flex-start`},children:[(0,s.jsx)(i,{label:`Deploy environment`,options:c,value:e,onChange:e=>t(e.target.value),help:`Changes take effect on next deploy.`,style:{width:260}}),(0,s.jsxs)(`div`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-muted)`,paddingTop:24},children:[(0,s.jsx)(`div`,{style:{fontSize:10,textTransform:`uppercase`,letterSpacing:`0.1em`,color:`var(--fg-faint)`,marginBottom:6},children:`Selected`}),(0,s.jsx)(`span`,{style:{color:`var(--accent)`},children:n?.label??`—`})]})]})}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{}`,...d.parameters?.docs?.source},description:{story:`The minimal form shell: a label, a placeholder option, a list of environments,
and a helper note. Keyboard navigation and voice-over come from the browser.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: 'staging',
    placeholder: undefined
  }
}`,...f.parameters?.docs?.source},description:{story:"Pass `defaultValue` to pre-select an option without controlling the field.\nThe placeholder is omitted so the initial value is visible immediately.",...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 260px)',
    gap: '24px 32px'
  }}>
      {/* Default */}
      <SelectNative label="Deploy environment" options={ENVIRONMENTS} placeholder="Select an environment…" help="Traffic is routed after the deploy." />

      {/* Pre-selected */}
      <SelectNative label="Deploy environment" options={ENVIRONMENTS} defaultValue="prod" help="Currently deploying to production." />

      {/* Invalid */}
      <SelectNative label="Deploy environment" options={ENVIRONMENTS} placeholder="Select an environment…" error="An environment is required to continue." />

      {/* Disabled */}
      <SelectNative label="Deploy environment" options={ENVIRONMENTS} defaultValue="staging" disabled help="Locked during active rollout." />
    </div>
}`,...p.parameters?.docs?.source},description:{story:"All four field states side by side — Default, Disabled, Invalid (inline error\nreplaces the help text), and Read-only (HTML `readOnly` on the underlying\n`<select>` is not universally honoured; prefer `disabled` for locked fields).",...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <SelectNative label="Primary region" placeholder="Choose a region…" help="Determines where your data residency SLA is enforced." style={{
    width: 320
  }}>
      <optgroup label="Americas">
        {REGIONS.filter(r => r.value.startsWith('us') || r.value.startsWith('sa')).map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
      </optgroup>
      <optgroup label="Europe / Middle East / Africa">
        {REGIONS.filter(r => r.value.startsWith('eu')).map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
      </optgroup>
      <optgroup label="Asia Pacific">
        {REGIONS.filter(r => r.value.startsWith('ap')).map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
      </optgroup>
    </SelectNative>
}`,...m.parameters?.docs?.source},description:{story:"When `options` is omitted you can render `<optgroup>` and `<option>` children\ndirectly. Useful when the list has logical groupings — here, by cloud region.",...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [env, setEnv] = React.useState('staging');
    const chosen = ENVIRONMENTS.find(e => e.value === env);
    return <div style={{
      display: 'flex',
      gap: 32,
      alignItems: 'flex-start'
    }}>
        <SelectNative label="Deploy environment" options={ENVIRONMENTS} value={env} onChange={e => setEnv(e.target.value)} help="Changes take effect on next deploy." style={{
        width: 260
      }} />
        <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--fg-muted)',
        paddingTop: 24
      }}>
          <div style={{
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--fg-faint)',
          marginBottom: 6
        }}>
            Selected
          </div>
          <span style={{
          color: 'var(--accent)'
        }}>{chosen?.label ?? '—'}</span>
        </div>
      </div>;
  }
}`,...h.parameters?.docs?.source},description:{story:`Controlled variant — external state drives the selection. The selected value
is reflected in the status line below the field, mirroring how a deploy
pipeline would read the value before submitting.`,...h.parameters?.docs?.description}}},g=[`Default`,`Selected`,`States`,`WithChildren`,`Controlled`]}))();export{h as Controlled,d as Default,f as Selected,p as States,m as WithChildren,g as __namedExportsOrder,u as default};