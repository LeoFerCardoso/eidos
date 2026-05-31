import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./jsx-runtime-CaZkqeYb.js";import{ga as n,t as r}from"./src-DgoylXRw.js";var i,a,o,s,c,l;e((()=>{r(),i=t(),a={title:`Docs/SpecRow`,component:n,tags:[`autodocs`],parameters:{docs:{description:{component:"A single `<tr>` for a token/spec table — renders three cells: token name, value, and usage. Always wrap it in `<table><tbody>` in the consuming page; see the stories below for the correct table chrome that Forge docs pages use."}}},args:{token:`--ember`,value:`#FF6B35`,usage:`Brand accent — at most 2× per screen.`},argTypes:{token:{control:`text`,description:`Token name or element name shown in the first cell.`},value:{control:`text`,description:`Resolved value or size shown in the second cell.`},usage:{control:`text`,description:`Usage note shown in the third cell.`}}},o={render:e=>(0,i.jsxs)(`table`,{className:`tbl`,style:{width:`100%`},children:[(0,i.jsx)(`thead`,{children:(0,i.jsxs)(`tr`,{children:[(0,i.jsx)(`th`,{children:`Token`}),(0,i.jsx)(`th`,{children:`Value`}),(0,i.jsx)(`th`,{children:`Usage`})]})}),(0,i.jsx)(`tbody`,{children:(0,i.jsx)(n,{...e})})]})},s={render:()=>(0,i.jsxs)(`table`,{className:`tbl`,style:{width:`100%`},children:[(0,i.jsx)(`thead`,{children:(0,i.jsxs)(`tr`,{children:[(0,i.jsx)(`th`,{children:`Token`}),(0,i.jsx)(`th`,{children:`Value (dark)`}),(0,i.jsx)(`th`,{children:`Usage`})]})}),(0,i.jsxs)(`tbody`,{children:[(0,i.jsx)(n,{token:`--ember`,value:`#FF6B35`,usage:`Brand accent — at most 2× per screen.`}),(0,i.jsx)(n,{token:`--bg`,value:`#08090A`,usage:`Page background.`}),(0,i.jsx)(n,{token:`--fg`,value:`#F5F5F5`,usage:`Primary text on dark bg.`}),(0,i.jsx)(n,{token:`--fg-muted`,value:`#9CA3AF`,usage:`Secondary / caption text.`}),(0,i.jsx)(n,{token:`--fg-faint`,value:`#374151`,usage:`Decorative dividers, placeholder text.`}),(0,i.jsx)(n,{token:`--surface`,value:`#111318`,usage:`Card / panel background.`}),(0,i.jsx)(n,{token:`--border`,value:`#1F2937`,usage:`Dividers, input borders.`})]})]})},c={render:()=>(0,i.jsxs)(`table`,{className:`tbl`,style:{width:`100%`},children:[(0,i.jsx)(`thead`,{children:(0,i.jsxs)(`tr`,{children:[(0,i.jsx)(`th`,{children:`Token`}),(0,i.jsx)(`th`,{children:`Value`}),(0,i.jsx)(`th`,{children:`Usage`})]})}),(0,i.jsxs)(`tbody`,{children:[(0,i.jsx)(n,{token:`--space-1`,value:`4px`,usage:`Icon gap, compact padding.`}),(0,i.jsx)(n,{token:`--space-2`,value:`8px`,usage:`Inline gap between label and icon.`}),(0,i.jsx)(n,{token:`--space-3`,value:`12px`,usage:`Button horizontal padding (sm).`}),(0,i.jsx)(n,{token:`--space-4`,value:`16px`,usage:`Default section padding.`}),(0,i.jsx)(n,{token:`--space-6`,value:`24px`,usage:`Card internal padding.`}),(0,i.jsx)(n,{token:`--space-8`,value:`32px`,usage:`Section vertical rhythm.`})]})]})},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: args => <table className="tbl" style={{
    width: '100%'
  }}>
      <thead>
        <tr>
          <th>Token</th>
          <th>Value</th>
          <th>Usage</th>
        </tr>
      </thead>
      <tbody>
        <SpecRow {...args} />
      </tbody>
    </table>
}`,...o.parameters?.docs?.source},description:{story:`Single row — must be rendered inside a table.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <table className="tbl" style={{
    width: '100%'
  }}>
      <thead>
        <tr>
          <th>Token</th>
          <th>Value (dark)</th>
          <th>Usage</th>
        </tr>
      </thead>
      <tbody>
        <SpecRow token="--ember" value="#FF6B35" usage="Brand accent — at most 2× per screen." />
        <SpecRow token="--bg" value="#08090A" usage="Page background." />
        <SpecRow token="--fg" value="#F5F5F5" usage="Primary text on dark bg." />
        <SpecRow token="--fg-muted" value="#9CA3AF" usage="Secondary / caption text." />
        <SpecRow token="--fg-faint" value="#374151" usage="Decorative dividers, placeholder text." />
        <SpecRow token="--surface" value="#111318" usage="Card / panel background." />
        <SpecRow token="--border" value="#1F2937" usage="Dividers, input borders." />
      </tbody>
    </table>
}`,...s.parameters?.docs?.source},description:{story:`Full color-token spec table — the typical Tokens section layout.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <table className="tbl" style={{
    width: '100%'
  }}>
      <thead>
        <tr>
          <th>Token</th>
          <th>Value</th>
          <th>Usage</th>
        </tr>
      </thead>
      <tbody>
        <SpecRow token="--space-1" value="4px" usage="Icon gap, compact padding." />
        <SpecRow token="--space-2" value="8px" usage="Inline gap between label and icon." />
        <SpecRow token="--space-3" value="12px" usage="Button horizontal padding (sm)." />
        <SpecRow token="--space-4" value="16px" usage="Default section padding." />
        <SpecRow token="--space-6" value="24px" usage="Card internal padding." />
        <SpecRow token="--space-8" value="32px" usage="Section vertical rhythm." />
      </tbody>
    </table>
}`,...c.parameters?.docs?.source},description:{story:`Spacing spec table — same pattern, different column labels.`,...c.parameters?.docs?.description}}},l=[`Default`,`ColorTokenTable`,`SpacingTokenTable`]}))();export{s as ColorTokenTable,o as Default,c as SpacingTokenTable,l as __namedExportsOrder,a as default};