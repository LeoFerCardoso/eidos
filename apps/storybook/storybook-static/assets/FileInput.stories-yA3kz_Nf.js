import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{ni as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m;e((()=>{o=t(n(),1),a(),s=r(),c={title:`Forms/FileInput`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:'A drop zone wrapping a native `<input type="file">` (overlaid at opacity 0), so click, keyboard, and drag-and-drop all work and the focus ring lands on the zone. Pass `onFiles` to receive the FileList.'}}},args:{label:`Upload artifact`,title:`Click to upload or drag & drop`,meta:`PNG, PDF, or ZIP up to 25 MB`},argTypes:{label:{control:`text`},title:{control:`text`},meta:{control:`text`},compact:{control:`boolean`},error:{control:`text`},disabled:{control:`boolean`}}},l={},u={args:{compact:!0,meta:`Drop a file or browse`}},d={args:{error:`File exceeds the 25 MB limit.`,meta:void 0}},f={args:{disabled:!0}},p={render:()=>{function e(){let[e,t]=o.useState(null);return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:12},children:[(0,s.jsx)(i,{label:`Avatar`,meta:`PNG or JPG`,onFiles:e=>t(e[0]?.name??null)}),e&&(0,s.jsxs)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-muted)`},children:[`selected: `,e]})]})}return(0,s.jsx)(e,{})}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    compact: true,
    meta: 'Drop a file or browse'
  }
}`,...u.parameters?.docs?.source},description:{story:`Compact single-row layout.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    error: 'File exceeds the 25 MB limit.',
    meta: undefined
  }
}`,...d.parameters?.docs?.source},description:{story:`Error state.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...f.parameters?.docs?.source},description:{story:`Disabled.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    function Demo() {
      const [name, setName] = React.useState<string | null>(null);
      return <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}>
          <FileInput label="Avatar" meta="PNG or JPG" onFiles={f => setName(f[0]?.name ?? null)} />
          {name && <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--fg-muted)'
        }}>selected: {name}</span>}
        </div>;
    }
    return <Demo />;
  }
}`,...p.parameters?.docs?.source},description:{story:`Wired up — shows the chosen file name.`,...p.parameters?.docs?.description}}},m=[`Default`,`Compact`,`Invalid`,`Disabled`,`WithSelection`]}))();export{u as Compact,l as Default,f as Disabled,d as Invalid,p as WithSelection,m as __namedExportsOrder,c as default};