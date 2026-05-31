import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{t as r,ua as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u,d,f,p;e((()=>{t(),r(),a=n(),o={title:`Docs/Frame`,component:i,tags:[`autodocs`],parameters:{docs:{description:{component:"The standard DS docs canvas — a labeled frame with an optional live-preview body on top and a `CollapsibleCode` block below. Use `center` to center the preview, `row` for horizontal flex layout, and `dotted` to show a dot-grid background that makes spacing visible."}}},args:{label:`Default`,code:`<button className="btn btn-primary" type="button">
  Ship it
</button>`,lang:`jsx`,center:!1,row:!1,dotted:!1},argTypes:{label:{control:`text`,description:`Text shown in the frame header bar.`},lang:{control:`select`,options:[`jsx`,`tsx`,`ts`,`js`,`css`,`html`,`bash`],description:"Language passed to `CollapsibleCode`."},code:{control:`text`,description:`Source string shown below the preview.`},center:{control:`boolean`,description:`Centers the preview body horizontally and vertically.`},row:{control:`boolean`,description:`Lays out preview children in a horizontal row.`},dotted:{control:`boolean`,description:`Shows a dot-grid background in the preview area.`},height:{control:`text`,description:`Minimum height of the preview body (CSS value or number = px).`}}},s={render:e=>(0,a.jsx)(i,{...e,children:(0,a.jsx)(`button`,{className:`btn btn-primary`,type:`button`,children:`Ship it`})})},c={args:{label:`Centered preview`,center:!0},render:e=>(0,a.jsx)(i,{...e,children:(0,a.jsx)(`button`,{className:`btn btn-primary`,type:`button`,children:`Ship it`})})},l={args:{label:`Button variants`,row:!0,center:!0,code:`<button className="btn btn-primary">Primary</button>
<button className="btn btn-ghost">Ghost</button>`},render:e=>(0,a.jsxs)(i,{...e,children:[(0,a.jsx)(`button`,{className:`btn btn-primary`,type:`button`,children:`Primary`}),(0,a.jsx)(`button`,{className:`btn btn-ghost`,type:`button`,children:`Ghost`})]})},u={args:{label:`Dotted grid`,dotted:!0,center:!0},render:e=>(0,a.jsx)(i,{...e,children:(0,a.jsx)(`button`,{className:`btn btn-primary`,type:`button`,children:`Ship it`})})},d={args:{label:`Fixed 240px canvas`,center:!0,height:240,code:`<Frame height={240} center>
  {/* your component */}
</Frame>`},render:e=>(0,a.jsx)(i,{...e,children:(0,a.jsx)(`button`,{className:`btn btn-primary`,type:`button`,children:`Ship it`})})},f={args:{label:`Preview only`,center:!0,code:void 0},render:e=>(0,a.jsx)(i,{...e,children:(0,a.jsx)(`button`,{className:`btn btn-primary`,type:`button`,children:`Ship it`})})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: args => <Frame {...args}>
      <button className="btn btn-primary" type="button">Ship it</button>
    </Frame>
}`,...s.parameters?.docs?.source},description:{story:`Single button in the default layout — label + code pane beneath.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Centered preview',
    center: true
  },
  render: args => <Frame {...args}>
      <button className="btn btn-primary" type="button">Ship it</button>
    </Frame>
}`,...c.parameters?.docs?.source},description:{story:`Centered preview — the most common variant for component demos.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Button variants',
    row: true,
    center: true,
    code: \`<button className="btn btn-primary">Primary</button>\\n<button className="btn btn-ghost">Ghost</button>\`
  },
  render: args => <Frame {...args}>
      <button className="btn btn-primary" type="button">Primary</button>
      <button className="btn btn-ghost" type="button">Ghost</button>
    </Frame>
}`,...l.parameters?.docs?.source},description:{story:`Row layout — shows multiple buttons side by side.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Dotted grid',
    dotted: true,
    center: true
  },
  render: args => <Frame {...args}>
      <button className="btn btn-primary" type="button">Ship it</button>
    </Frame>
}`,...u.parameters?.docs?.source},description:{story:`Dotted background — makes spacing and alignment visible.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Fixed 240px canvas',
    center: true,
    height: 240,
    code: \`<Frame height={240} center>\\n  {/* your component */}\\n</Frame>\`
  },
  render: args => <Frame {...args}>
      <button className="btn btn-primary" type="button">Ship it</button>
    </Frame>
}`,...d.parameters?.docs?.source},description:{story:`Fixed height — useful when the preview needs a controlled canvas.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Preview only',
    center: true,
    code: undefined
  },
  render: args => <Frame {...args}>
      <button className="btn btn-primary" type="button">Ship it</button>
    </Frame>
}`,...f.parameters?.docs?.source},description:{story:`No code prop — preview-only frame with no copy button or code pane.`,...f.parameters?.docs?.description}}},p=[`Default`,`Centered`,`RowLayout`,`DottedGrid`,`FixedHeight`,`PreviewOnly`]}))();export{c as Centered,s as Default,u as DottedGrid,d as FixedHeight,f as PreviewOnly,l as RowLayout,p as __namedExportsOrder,o as default};