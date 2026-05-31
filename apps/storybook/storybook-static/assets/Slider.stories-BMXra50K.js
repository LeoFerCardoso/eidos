import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{li as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h,g;e((()=>{o=t(n(),1),a(),s=r(),c={title:`Forms/Slider`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:`Pick a value or a range along a continuous track — drag the thumb, click the track, or use the keyboard (arrows, Page Up/Down, Home/End). The thumb is role="slider" with full ARIA value semantics; RTL and vertical orientation are supported.`}}},args:{defaultValue:40,min:0,max:100,step:1,label:`Volume`,size:`md`},argTypes:{min:{control:`number`},max:{control:`number`},step:{control:`number`},disabled:{control:`boolean`},invalid:{control:`boolean`},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]},orientation:{control:`inline-radio`,options:[`horizontal`,`vertical`]}}},l=({children:e})=>(0,s.jsx)(`div`,{style:{width:360,maxWidth:`100%`},children:e}),u={render:e=>(0,s.jsx)(l,{children:(0,s.jsx)(i,{...e})})},d={render:()=>{function e(){let[e,t]=o.useState([1500,4500]);return(0,s.jsxs)(l,{children:[(0,s.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,marginBottom:12,fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-muted)`},children:[(0,s.jsxs)(`span`,{children:[`min $`,e[0]]}),(0,s.jsxs)(`span`,{children:[`max $`,e[1]]})]}),(0,s.jsx)(i,{value:e,min:0,max:6e3,step:100,label:`Budget`,onChange:e=>t(e)})]})}return(0,s.jsx)(e,{})}},f={render:()=>(0,s.jsx)(l,{children:(0,s.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:24},children:[`sm`,`md`,`lg`].map(e=>(0,s.jsx)(i,{size:e,defaultValue:50,label:`Size ${e}`},e))})})},p={render:()=>(0,s.jsx)(`div`,{style:{height:180},children:(0,s.jsx)(i,{orientation:`vertical`,defaultValue:60,label:`Brightness`})})},m={render:()=>(0,s.jsx)(l,{children:(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:24},children:[(0,s.jsx)(i,{defaultValue:70,invalid:!0,label:`Invalid`}),(0,s.jsx)(i,{defaultValue:30,disabled:!0,label:`Disabled`})]})})},h={render:()=>{function e(){let[e,t]=o.useState(40);return(0,s.jsxs)(l,{children:[(0,s.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,marginBottom:12,fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-muted)`},children:[(0,s.jsx)(`span`,{children:`Volume`}),(0,s.jsx)(`span`,{style:{color:`var(--fg)`},children:e})]}),(0,s.jsx)(i,{value:e,onChange:e=>t(e),label:`Volume`})]})}return(0,s.jsx)(e,{})}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <Wrap><Slider {...args} /></Wrap>
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    function Demo() {
      const [v, setV] = React.useState<[number, number]>([1500, 4500]);
      return <Wrap>
          <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 12,
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--fg-muted)'
        }}>
            <span>min \${v[0]}</span><span>max \${v[1]}</span>
          </div>
          <Slider value={v} min={0} max={6000} step={100} label="Budget" onChange={x => setV(x as [number, number])} />
        </Wrap>;
    }
    return <Demo />;
  }
}`,...d.parameters?.docs?.source},description:{story:`A two-thumb range (e.g. a budget filter).`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <Wrap>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }}>
        {(['sm', 'md', 'lg'] as const).map(s => <Slider key={s} size={s} defaultValue={50} label={\`Size \${s}\`} />)}
      </div>
    </Wrap>
}`,...f.parameters?.docs?.source},description:{story:`The three sizes.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    height: 180
  }}><Slider orientation="vertical" defaultValue={60} label="Brightness" /></div>
}`,...p.parameters?.docs?.source},description:{story:`Vertical orientation.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <Wrap>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }}>
        <Slider defaultValue={70} invalid label="Invalid" />
        <Slider defaultValue={30} disabled label="Disabled" />
      </div>
    </Wrap>
}`,...m.parameters?.docs?.source},description:{story:`Invalid + disabled.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    function Demo() {
      const [v, setV] = React.useState(40);
      return <Wrap>
          <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 12,
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--fg-muted)'
        }}>
            <span>Volume</span><span style={{
            color: 'var(--fg)'
          }}>{v}</span>
          </div>
          <Slider value={v} onChange={x => setV(x as number)} label="Volume" />
        </Wrap>;
    }
    return <Demo />;
  }
}`,...h.parameters?.docs?.source},description:{story:`Controlled with a live read-out.`,...h.parameters?.docs?.description}}},g=[`Default`,`Range`,`Sizes`,`Vertical`,`States`,`Controlled`]}))();export{h as Controlled,u as Default,d as Range,f as Sizes,m as States,p as Vertical,g as __namedExportsOrder,c as default};