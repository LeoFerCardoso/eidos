import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{T as i,Wa as a,t as o}from"./src-DgoylXRw.js";var s,c,l,u,d,f,p,m,h,g,_;e((()=>{s=t(n(),1),o(),c=r(),l={title:`Forms/Toggle`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:"A two-state pressed button (`aria-pressed`). Use for commands that can be active or inactive — Bold, Pin, Mute. NOT a Switch (`aria-checked`/`role=switch`): a Toggle is stateless-form-wise; it applies an action immediately and can be undone by pressing again."}}},args:{variant:`ghost`,size:`md`,disabled:!1},argTypes:{variant:{control:`inline-radio`,options:[`ghost`,`outline`,`solid`]},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]},pressed:{control:`boolean`},disabled:{control:`boolean`}}},u={render:e=>{let[t,n]=s.useState(!1);return(0,c.jsx)(i,{...e,pressed:t,onPressedChange:n,"aria-label":`Bold`,children:(0,c.jsx)(a.bold,{size:14})})}},d={render:()=>{let[e,t]=s.useState(!1),[n,r]=s.useState(!0),[o,l]=s.useState(!1),[u,d]=s.useState(!0),[f,p]=s.useState(!1),[m,h]=s.useState(!0);return(0,c.jsxs)(`div`,{style:{display:`flex`,gap:16,alignItems:`center`,flexWrap:`wrap`},children:[(0,c.jsx)(i,{variant:`ghost`,pressed:e,onPressedChange:t,"aria-label":`Bold ghost rest`,children:(0,c.jsx)(a.bold,{size:14})}),(0,c.jsx)(i,{variant:`ghost`,pressed:n,onPressedChange:r,"aria-label":`Bold ghost pressed`,children:(0,c.jsx)(a.bold,{size:14})}),(0,c.jsx)(`span`,{style:{width:1,height:24,background:`var(--border)`,margin:`0 4px`},"aria-hidden":`true`}),(0,c.jsx)(i,{variant:`outline`,pressed:o,onPressedChange:l,"aria-label":`Pin outline rest`,children:(0,c.jsx)(a.pin,{size:14})}),(0,c.jsx)(i,{variant:`outline`,pressed:u,onPressedChange:d,"aria-label":`Pin outline pressed`,children:(0,c.jsx)(a.pin,{size:14})}),(0,c.jsx)(`span`,{style:{width:1,height:24,background:`var(--border)`,margin:`0 4px`},"aria-hidden":`true`}),(0,c.jsx)(i,{variant:`solid`,pressed:f,onPressedChange:p,"aria-label":`Bell solid rest`,children:(0,c.jsx)(a.bell,{size:14})}),(0,c.jsx)(i,{variant:`solid`,pressed:m,onPressedChange:h,"aria-label":`Bell solid pressed`,children:(0,c.jsx)(a.bell,{size:14})})]})}},f={render:()=>{let[e,t]=s.useState(!1),[n,r]=s.useState(!1),[o,l]=s.useState(!1);return(0,c.jsxs)(`div`,{style:{display:`flex`,gap:12,alignItems:`center`},children:[(0,c.jsx)(i,{size:`sm`,pressed:e,onPressedChange:t,"aria-label":`Bold small`,children:(0,c.jsx)(a.bold,{size:12})}),(0,c.jsx)(i,{pressed:n,onPressedChange:r,"aria-label":`Bold medium`,children:(0,c.jsx)(a.bold,{size:14})}),(0,c.jsx)(i,{size:`lg`,pressed:o,onPressedChange:l,"aria-label":`Bold large`,children:(0,c.jsx)(a.bold,{size:16})})]})}},p={render:()=>{let[e,t]=s.useState(!1),[n,r]=s.useState(!0);return(0,c.jsxs)(`div`,{style:{display:`flex`,gap:12,alignItems:`center`,flexWrap:`wrap`},children:[(0,c.jsxs)(i,{variant:`outline`,pressed:e,onPressedChange:t,children:[(0,c.jsx)(a.pin,{size:14}),(0,c.jsx)(`span`,{children:e?`Pinned`:`Pin`})]}),(0,c.jsxs)(i,{variant:`outline`,pressed:n,onPressedChange:r,children:[(0,c.jsx)(a.star,{size:14}),(0,c.jsx)(`span`,{children:`Favourite`})]})]})}},m={render:()=>(0,c.jsxs)(`div`,{style:{display:`flex`,gap:12,alignItems:`center`},children:[(0,c.jsx)(i,{variant:`ghost`,disabled:!0,"aria-label":`Bold disabled`,children:(0,c.jsx)(a.bold,{size:14})}),(0,c.jsx)(i,{variant:`outline`,disabled:!0,"aria-label":`Pin disabled`,children:(0,c.jsx)(a.pin,{size:14})}),(0,c.jsx)(i,{variant:`solid`,disabled:!0,"aria-label":`Bell disabled`,children:(0,c.jsx)(a.bell,{size:14})})]})},h={render:()=>{let[e,t]=s.useState(!1),[n,r]=s.useState(!0),[o,l]=s.useState(!1),[u,d]=s.useState(!1),[f,p]=s.useState(!1);return(0,c.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:16,alignItems:`flex-start`},children:[(0,c.jsxs)(`div`,{style:{display:`inline-flex`,alignItems:`center`,gap:2,padding:4,background:`var(--surface)`,border:`1px solid var(--border)`,borderRadius:8},children:[(0,c.jsx)(i,{variant:`ghost`,pressed:e,onPressedChange:t,"aria-label":`Bold`,children:(0,c.jsx)(a.bold,{size:14})}),(0,c.jsx)(i,{variant:`ghost`,pressed:n,onPressedChange:r,"aria-label":`Italic`,children:(0,c.jsx)(a.italic,{size:14})}),(0,c.jsx)(i,{variant:`ghost`,pressed:o,onPressedChange:l,"aria-label":`Underline`,children:(0,c.jsx)(a.underline,{size:14})}),(0,c.jsx)(i,{variant:`ghost`,pressed:u,onPressedChange:d,"aria-label":`Strikethrough`,children:(0,c.jsx)(a.strike,{size:14})}),(0,c.jsx)(`div`,{style:{width:1,height:20,background:`var(--border)`,margin:`0 4px`},"aria-hidden":`true`}),(0,c.jsxs)(i,{variant:`outline`,pressed:f,onPressedChange:p,children:[(0,c.jsx)(a.pin,{size:14}),(0,c.jsx)(`span`,{children:f?`Pinned`:`Pin`})]})]}),(0,c.jsx)(`p`,{style:{fontStyle:n?`italic`:`normal`,fontWeight:e?700:400,textDecoration:[o&&`underline`,u&&`line-through`].filter(Boolean).join(` `)||`none`,fontSize:15,color:`var(--fg)`,margin:0,maxWidth:340,lineHeight:1.6},children:`Toggle the formatting buttons above to style this sample text.`})]})}},g={render:()=>{let[e,t]=s.useState(!0),[n,r]=s.useState(!1),[o,l]=s.useState(!1);return(0,c.jsxs)(`div`,{dir:`rtl`,style:{display:`flex`,gap:12,alignItems:`center`},children:[(0,c.jsxs)(i,{variant:`outline`,pressed:e,onPressedChange:t,children:[(0,c.jsx)(a.pin,{size:14}),(0,c.jsx)(`span`,{children:e?`مثبّت`:`تثبيت`})]}),(0,c.jsx)(i,{variant:`ghost`,pressed:n,onPressedChange:r,"aria-label":`عريض`,children:(0,c.jsx)(a.bold,{size:14})}),(0,c.jsx)(i,{variant:`ghost`,pressed:o,onPressedChange:l,"aria-label":`مائل`,children:(0,c.jsx)(a.italic,{size:14})})]})}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [pressed, setPressed] = React.useState(false);
    return <Toggle {...args} pressed={pressed} onPressedChange={setPressed} aria-label="Bold">
        <Icons.bold size={14} />
      </Toggle>;
  }
}`,...u.parameters?.docs?.source},description:{story:`Controlled by Storybook args.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [ghostRest, setGhostRest] = React.useState(false);
    const [ghostPressed, setGhostPressed] = React.useState(true);
    const [outlineRest, setOutlineRest] = React.useState(false);
    const [outlinePressed, setOutlinePressed] = React.useState(true);
    const [solidRest, setSolidRest] = React.useState(false);
    const [solidPressed, setSolidPressed] = React.useState(true);
    return <div style={{
      display: 'flex',
      gap: 16,
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
        <Toggle variant="ghost" pressed={ghostRest} onPressedChange={setGhostRest} aria-label="Bold ghost rest">
          <Icons.bold size={14} />
        </Toggle>
        <Toggle variant="ghost" pressed={ghostPressed} onPressedChange={setGhostPressed} aria-label="Bold ghost pressed">
          <Icons.bold size={14} />
        </Toggle>
        <span style={{
        width: 1,
        height: 24,
        background: 'var(--border)',
        margin: '0 4px'
      }} aria-hidden="true" />
        <Toggle variant="outline" pressed={outlineRest} onPressedChange={setOutlineRest} aria-label="Pin outline rest">
          <Icons.pin size={14} />
        </Toggle>
        <Toggle variant="outline" pressed={outlinePressed} onPressedChange={setOutlinePressed} aria-label="Pin outline pressed">
          <Icons.pin size={14} />
        </Toggle>
        <span style={{
        width: 1,
        height: 24,
        background: 'var(--border)',
        margin: '0 4px'
      }} aria-hidden="true" />
        <Toggle variant="solid" pressed={solidRest} onPressedChange={setSolidRest} aria-label="Bell solid rest">
          <Icons.bell size={14} />
        </Toggle>
        <Toggle variant="solid" pressed={solidPressed} onPressedChange={setSolidPressed} aria-label="Bell solid pressed">
          <Icons.bell size={14} />
        </Toggle>
      </div>;
  }
}`,...d.parameters?.docs?.source},description:{story:`All three variants in rest and pressed states.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [sm, setSm] = React.useState(false);
    const [md, setMd] = React.useState(false);
    const [lg, setLg] = React.useState(false);
    return <div style={{
      display: 'flex',
      gap: 12,
      alignItems: 'center'
    }}>
        <Toggle size="sm" pressed={sm} onPressedChange={setSm} aria-label="Bold small">
          <Icons.bold size={12} />
        </Toggle>
        <Toggle pressed={md} onPressedChange={setMd} aria-label="Bold medium">
          <Icons.bold size={14} />
        </Toggle>
        <Toggle size="lg" pressed={lg} onPressedChange={setLg} aria-label="Bold large">
          <Icons.bold size={16} />
        </Toggle>
      </div>;
  }
}`,...f.parameters?.docs?.source},description:{story:`Three sizes — sm · md · lg.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [pinned, setPinned] = React.useState(false);
    const [fav, setFav] = React.useState(true);
    return <div style={{
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
        <Toggle variant="outline" pressed={pinned} onPressedChange={setPinned}>
          <Icons.pin size={14} /><span>{pinned ? 'Pinned' : 'Pin'}</span>
        </Toggle>
        <Toggle variant="outline" pressed={fav} onPressedChange={setFav}>
          <Icons.star size={14} /><span>Favourite</span>
        </Toggle>
      </div>;
  }
}`,...p.parameters?.docs?.source},description:{story:`Icon + text label — outline variant with flipping label on press.
 Text is wrapped in \`<span>\` so the SVG is no longer the only element child,
 preventing the square-footprint CSS rule from applying to icon+label buttons.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 12,
    alignItems: 'center'
  }}>
      <Toggle variant="ghost" disabled aria-label="Bold disabled">
        <Icons.bold size={14} />
      </Toggle>
      <Toggle variant="outline" disabled aria-label="Pin disabled">
        <Icons.pin size={14} />
      </Toggle>
      <Toggle variant="solid" disabled aria-label="Bell disabled">
        <Icons.bell size={14} />
      </Toggle>
    </div>
}`,...m.parameters?.docs?.source},description:{story:`Disabled — no interaction, half opacity.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [bold, setBold] = React.useState(false);
    const [italic, setItalic] = React.useState(true);
    const [under, setUnder] = React.useState(false);
    const [strike, setStrike] = React.useState(false);
    const [pinned, setPinned] = React.useState(false);
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      alignItems: 'flex-start'
    }}>
        <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2,
        padding: 4,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 8
      }}>
          <Toggle variant="ghost" pressed={bold} onPressedChange={setBold} aria-label="Bold">
            <Icons.bold size={14} />
          </Toggle>
          <Toggle variant="ghost" pressed={italic} onPressedChange={setItalic} aria-label="Italic">
            <Icons.italic size={14} />
          </Toggle>
          <Toggle variant="ghost" pressed={under} onPressedChange={setUnder} aria-label="Underline">
            <Icons.underline size={14} />
          </Toggle>
          <Toggle variant="ghost" pressed={strike} onPressedChange={setStrike} aria-label="Strikethrough">
            <Icons.strike size={14} />
          </Toggle>
          <div style={{
          width: 1,
          height: 20,
          background: 'var(--border)',
          margin: '0 4px'
        }} aria-hidden="true" />
          <Toggle variant="outline" pressed={pinned} onPressedChange={setPinned}>
            <Icons.pin size={14} /><span>{pinned ? 'Pinned' : 'Pin'}</span>
          </Toggle>
        </div>
        <p style={{
        fontStyle: italic ? 'italic' : 'normal',
        fontWeight: bold ? 700 : 400,
        textDecoration: [under && 'underline', strike && 'line-through'].filter(Boolean).join(' ') || 'none',
        fontSize: 15,
        color: 'var(--fg)',
        margin: 0,
        maxWidth: 340,
        lineHeight: 1.6
      }}>
          Toggle the formatting buttons above to style this sample text.
        </p>
      </div>;
  }
}`,...h.parameters?.docs?.source},description:{story:`Formatting toolbar — a realistic in-context composition.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [p1, setP1] = React.useState(true);
    const [p2, setP2] = React.useState(false);
    const [p3, setP3] = React.useState(false);
    return <div dir="rtl" style={{
      display: 'flex',
      gap: 12,
      alignItems: 'center'
    }}>
        <Toggle variant="outline" pressed={p1} onPressedChange={setP1}>
          <Icons.pin size={14} /><span>{p1 ? 'مثبّت' : 'تثبيت'}</span>
        </Toggle>
        <Toggle variant="ghost" pressed={p2} onPressedChange={setP2} aria-label="عريض">
          <Icons.bold size={14} />
        </Toggle>
        <Toggle variant="ghost" pressed={p3} onPressedChange={setP3} aria-label="مائل">
          <Icons.italic size={14} />
        </Toggle>
      </div>;
  }
}`,...g.parameters?.docs?.source},description:{story:`RTL — leading icon swaps to the right side automatically.`,...g.parameters?.docs?.description}}},_=[`Default`,`Variants`,`Sizes`,`WithLabel`,`Disabled`,`InContext`,`RTL`]}))();export{u as Default,m as Disabled,h as InContext,g as RTL,f as Sizes,d as Variants,p as WithLabel,_ as __namedExportsOrder,l as default};