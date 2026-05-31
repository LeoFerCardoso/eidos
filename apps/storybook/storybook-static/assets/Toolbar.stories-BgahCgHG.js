import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{At as i,Mt as a,Nt as o,Wa as s,jt as c,t as l}from"./src-DgoylXRw.js";var u,d,f,p,m,h,g,_,v,y,b;e((()=>{u=t(n(),1),l(),d=r(),f={title:`Primitives/Toolbar`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:`A single-tab-stop row of controls — buttons, toggle buttons, groups, and separators. Implements the WAI-ARIA Toolbar Pattern with roving tabindex: ArrowLeft/Right (or Up/Down when vertical) navigate between controls; Home/End jump to ends; Tab leaves the bar entirely.`}}},args:{orientation:`horizontal`,loop:!0},argTypes:{orientation:{control:`inline-radio`,options:[`horizontal`,`vertical`]},loop:{control:`boolean`}}},p={render:e=>(0,d.jsxs)(i,{...e,"aria-label":`Text formatting`,children:[(0,d.jsx)(c,{"aria-label":`Bold`,children:(0,d.jsx)(s.bold,{size:14})}),(0,d.jsx)(c,{"aria-label":`Italic`,children:(0,d.jsx)(s.italic,{size:14})}),(0,d.jsx)(o,{}),(0,d.jsx)(c,{"aria-label":`Insert link`,children:(0,d.jsx)(s.link,{size:14})})]})},m={render:function(e){let[t,n]=u.useState(!1),[r,a]=u.useState(!1),[o,l]=u.useState(!1);return(0,d.jsxs)(i,{...e,"aria-label":`Text style`,children:[(0,d.jsx)(c,{"aria-label":`Bold`,pressed:t,onPressedChange:n,children:(0,d.jsx)(s.bold,{size:14})}),(0,d.jsx)(c,{"aria-label":`Italic`,pressed:r,onPressedChange:a,children:(0,d.jsx)(s.italic,{size:14})}),(0,d.jsx)(c,{"aria-label":`Underline`,pressed:o,onPressedChange:l,children:(0,d.jsx)(s.underline,{size:14})})]})}},h={render:e=>(0,d.jsxs)(i,{...e,"aria-label":`Text formatting and alignment`,children:[(0,d.jsxs)(a,{children:[(0,d.jsx)(c,{"aria-label":`Bold`,children:(0,d.jsx)(s.bold,{size:14})}),(0,d.jsx)(c,{"aria-label":`Italic`,children:(0,d.jsx)(s.italic,{size:14})}),(0,d.jsx)(c,{"aria-label":`Underline`,children:(0,d.jsx)(s.underline,{size:14})})]}),(0,d.jsx)(o,{}),(0,d.jsxs)(a,{children:[(0,d.jsx)(c,{"aria-label":`Align left`,children:(0,d.jsx)(s.alignLeft,{size:14})}),(0,d.jsx)(c,{"aria-label":`Align center`,children:(0,d.jsx)(s.alignCenter,{size:14})}),(0,d.jsx)(c,{"aria-label":`Align right`,children:(0,d.jsx)(s.alignRight,{size:14})})]})]})},g={render:e=>(0,d.jsx)(`div`,{style:{width:`100%`,maxWidth:640},children:(0,d.jsxs)(i,{...e,"aria-label":`Table controls`,style:{display:`flex`,justifyContent:`space-between`,width:`100%`},children:[(0,d.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:4},children:[(0,d.jsxs)(a,{children:[(0,d.jsx)(c,{"aria-label":`Undo`,children:(0,d.jsx)(s.undo,{size:14})}),(0,d.jsx)(c,{"aria-label":`Redo`,children:(0,d.jsx)(s.redo,{size:14})})]}),(0,d.jsx)(o,{}),(0,d.jsxs)(`button`,{className:`btn outline sm`,tabIndex:-1,children:[(0,d.jsx)(s.filter,{size:12}),` Filter`]}),(0,d.jsxs)(`button`,{className:`btn outline sm`,tabIndex:-1,children:[(0,d.jsx)(s.sort,{size:12}),` Sort`]})]}),(0,d.jsxs)(`button`,{className:`btn ember sm`,tabIndex:-1,children:[(0,d.jsx)(s.plus,{size:12}),` New record`]})]})})},_={render:e=>(0,d.jsxs)(i,{...e,"aria-label":`Editor actions`,children:[(0,d.jsx)(c,{"aria-label":`Bold`,children:(0,d.jsx)(s.bold,{size:14})}),(0,d.jsx)(c,{"aria-label":`Italic`,disabled:!0,children:(0,d.jsx)(s.italic,{size:14})}),(0,d.jsx)(c,{"aria-label":`Underline`,children:(0,d.jsx)(s.underline,{size:14})}),(0,d.jsx)(o,{}),(0,d.jsx)(c,{"aria-label":`Insert link`,disabled:!0,children:(0,d.jsx)(s.link,{size:14})}),(0,d.jsx)(c,{"aria-label":`Insert image`,children:(0,d.jsx)(s.image,{size:14})})]})},v={args:{orientation:`vertical`},render:e=>(0,d.jsxs)(i,{...e,"aria-label":`Canvas tools`,style:{flexDirection:`column`,width:`fit-content`,height:`auto`,display:`inline-flex`},children:[(0,d.jsx)(c,{"aria-label":`Edit`,children:(0,d.jsx)(s.edit,{size:14})}),(0,d.jsx)(c,{"aria-label":`Search`,children:(0,d.jsx)(s.search,{size:14})}),(0,d.jsx)(o,{}),(0,d.jsx)(c,{"aria-label":`Zoom in`,children:(0,d.jsx)(s.plus,{size:14})}),(0,d.jsx)(c,{"aria-label":`Zoom out`,children:(0,d.jsx)(s.minus,{size:14})})]})},y={render:function(e){let[t,n]=u.useState(!1),[r,a]=u.useState(!1);return(0,d.jsx)(`div`,{dir:`rtl`,children:(0,d.jsxs)(i,{...e,"aria-label":`تنسيق النص`,children:[(0,d.jsx)(c,{"aria-label":`عريض`,pressed:t,onPressedChange:n,children:(0,d.jsx)(s.bold,{size:14})}),(0,d.jsx)(c,{"aria-label":`مائل`,pressed:r,onPressedChange:a,children:(0,d.jsx)(s.italic,{size:14})}),(0,d.jsx)(o,{}),(0,d.jsx)(c,{"aria-label":`رابط`,children:(0,d.jsx)(s.link,{size:14})}),(0,d.jsx)(c,{"aria-label":`قائمة`,children:(0,d.jsx)(s.list,{size:14})})]})})}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <Toolbar {...args} aria-label="Text formatting">
      <ToolbarButton aria-label="Bold">
        <Icons.bold size={14} />
      </ToolbarButton>
      <ToolbarButton aria-label="Italic">
        <Icons.italic size={14} />
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton aria-label="Insert link">
        <Icons.link size={14} />
      </ToolbarButton>
    </Toolbar>
}`,...p.parameters?.docs?.source},description:{story:`Default formatting toolbar — bold, italic, separator, link.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: function ToggleDemo(args) {
    const [bold, setBold] = React.useState(false);
    const [italic, setItalic] = React.useState(false);
    const [underline, setUnderline] = React.useState(false);
    return <Toolbar {...args} aria-label="Text style">
        <ToolbarButton aria-label="Bold" pressed={bold} onPressedChange={setBold}>
          <Icons.bold size={14} />
        </ToolbarButton>
        <ToolbarButton aria-label="Italic" pressed={italic} onPressedChange={setItalic}>
          <Icons.italic size={14} />
        </ToolbarButton>
        <ToolbarButton aria-label="Underline" pressed={underline} onPressedChange={setUnderline}>
          <Icons.underline size={14} />
        </ToolbarButton>
      </Toolbar>;
  }
}`,...m.parameters?.docs?.source},description:{story:`Toggle buttons — aria-pressed reflects selection state.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <Toolbar {...args} aria-label="Text formatting and alignment">
      <ToolbarGroup>
        <ToolbarButton aria-label="Bold"><Icons.bold size={14} /></ToolbarButton>
        <ToolbarButton aria-label="Italic"><Icons.italic size={14} /></ToolbarButton>
        <ToolbarButton aria-label="Underline"><Icons.underline size={14} /></ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <ToolbarButton aria-label="Align left"><Icons.alignLeft size={14} /></ToolbarButton>
        <ToolbarButton aria-label="Align center"><Icons.alignCenter size={14} /></ToolbarButton>
        <ToolbarButton aria-label="Align right"><Icons.alignRight size={14} /></ToolbarButton>
      </ToolbarGroup>
    </Toolbar>
}`,...h.parameters?.docs?.source},description:{story:`ToolbarGroup visually clusters related controls with shared borders.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    width: '100%',
    maxWidth: 640
  }}>
      <Toolbar {...args} aria-label="Table controls" style={{
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%'
    }}>
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4
      }}>
          <ToolbarGroup>
            <ToolbarButton aria-label="Undo"><Icons.undo size={14} /></ToolbarButton>
            <ToolbarButton aria-label="Redo"><Icons.redo size={14} /></ToolbarButton>
          </ToolbarGroup>
          <ToolbarSeparator />
          <button className="btn outline sm" tabIndex={-1}>
            <Icons.filter size={12} /> Filter
          </button>
          <button className="btn outline sm" tabIndex={-1}>
            <Icons.sort size={12} /> Sort
          </button>
        </div>
        <button className="btn ember sm" tabIndex={-1}>
          <Icons.plus size={12} /> New record
        </button>
      </Toolbar>
    </div>
}`,...g.parameters?.docs?.source},description:{story:`Workspace-level toolbar — actions left, primary CTA right.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: args => <Toolbar {...args} aria-label="Editor actions">
      <ToolbarButton aria-label="Bold"><Icons.bold size={14} /></ToolbarButton>
      <ToolbarButton aria-label="Italic" disabled><Icons.italic size={14} /></ToolbarButton>
      <ToolbarButton aria-label="Underline"><Icons.underline size={14} /></ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton aria-label="Insert link" disabled><Icons.link size={14} /></ToolbarButton>
      <ToolbarButton aria-label="Insert image"><Icons.image size={14} /></ToolbarButton>
    </Toolbar>
}`,..._.parameters?.docs?.source},description:{story:`Disabled controls are skipped by roving focus and show visual muted state.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    orientation: 'vertical'
  },
  render: args => <Toolbar {...args} aria-label="Canvas tools" style={{
    flexDirection: 'column',
    width: 'fit-content',
    height: 'auto',
    display: 'inline-flex'
  }}>
      <ToolbarButton aria-label="Edit"><Icons.edit size={14} /></ToolbarButton>
      <ToolbarButton aria-label="Search"><Icons.search size={14} /></ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton aria-label="Zoom in"><Icons.plus size={14} /></ToolbarButton>
      <ToolbarButton aria-label="Zoom out"><Icons.minus size={14} /></ToolbarButton>
    </Toolbar>
}`,...v.parameters?.docs?.source},description:{story:`Vertical orientation — ArrowDown/Up navigate; the bar stacks controls.`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: function RtlDemo(args) {
    const [bold, setBold] = React.useState(false);
    const [italic, setItalic] = React.useState(false);
    return <div dir="rtl">
        <Toolbar {...args} aria-label="تنسيق النص">
          <ToolbarButton aria-label="عريض" pressed={bold} onPressedChange={setBold}>
            <Icons.bold size={14} />
          </ToolbarButton>
          <ToolbarButton aria-label="مائل" pressed={italic} onPressedChange={setItalic}>
            <Icons.italic size={14} />
          </ToolbarButton>
          <ToolbarSeparator />
          <ToolbarButton aria-label="رابط">
            <Icons.link size={14} />
          </ToolbarButton>
          <ToolbarButton aria-label="قائمة">
            <Icons.list size={14} />
          </ToolbarButton>
        </Toolbar>
      </div>;
  }
}`,...y.parameters?.docs?.source},description:{story:`RTL — clusters reverse order; arrow keys swap direction.`,...y.parameters?.docs?.description}}},b=[`Default`,`ToggleButtons`,`WithGroups`,`InContext`,`WithDisabled`,`Vertical`,`RTL`]}))();export{p as Default,g as InContext,y as RTL,m as ToggleButtons,v as Vertical,_ as WithDisabled,h as WithGroups,b as __namedExportsOrder,f as default};