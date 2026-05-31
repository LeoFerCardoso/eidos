import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{_t as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h,g,_;e((()=>{o=t(n(),1),a(),s=r(),c={title:`Primitives/Resizable`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:`A drag-and-keyboard handle that lets users split two panels. Orientation horizontal or vertical; supports controlled + uncontrolled sizes, min/max constraints, and an optional collapsible first panel. Full keyboard model on the handle: Arrow keys nudge, Shift+Arrow for large steps, Home/End jump to limits, Enter toggles collapse.`}}},args:{orientation:`horizontal`,defaultSizes:[30,70],minSize:10,maxSize:90,step:1,largeStep:10,collapsible:!1,withHandle:!0,handleLabel:`Resize panels`},argTypes:{orientation:{control:`inline-radio`,options:[`horizontal`,`vertical`]},defaultSizes:{control:!1},minSize:{control:{type:`range`,min:0,max:50,step:1}},maxSize:{control:{type:`range`,min:50,max:100,step:1}},step:{control:{type:`range`,min:.5,max:10,step:.5}},largeStep:{control:{type:`range`,min:5,max:30,step:5}},collapsible:{control:`boolean`},withHandle:{control:`boolean`},handleLabel:{control:`text`}}},l=({title:e,items:t,muted:n=!1})=>(0,s.jsxs)(`div`,{style:{padding:16,height:`100%`,background:`var(--surface)`,overflow:`auto`},children:[(0,s.jsx)(`div`,{style:{fontFamily:`var(--font-mono)`,fontSize:`var(--text-xs)`,letterSpacing:`0.08em`,textTransform:`uppercase`,color:`var(--fg-faint)`,marginBottom:10},children:e}),t?t.map(e=>(0,s.jsx)(`div`,{style:{padding:`4px 6px`,fontSize:`var(--text-sm)`,color:n?`var(--fg-muted)`:`var(--fg)`,borderRadius:`var(--radius-sm)`},children:e},e)):null]}),u={render:e=>(0,s.jsx)(`div`,{style:{border:`1px solid var(--border)`,borderRadius:`var(--radius-xl)`,overflow:`hidden`,height:260},children:(0,s.jsx)(i,{...e,style:{height:`100%`},children:[(0,s.jsx)(l,{title:`Files`,items:[`index.tsx`,`config.json`,`README.md`,`styles.css`],muted:!0},`a`),(0,s.jsx)(l,{title:`Editor`,items:[`// Edit panel content renders here`]},`b`)]})})},d={args:{orientation:`vertical`,defaultSizes:[60,40]},render:e=>(0,s.jsx)(`div`,{style:{border:`1px solid var(--border)`,borderRadius:`var(--radius-xl)`,overflow:`hidden`,height:360},children:(0,s.jsx)(i,{...e,style:{height:`100%`},children:[(0,s.jsx)(l,{title:`Editor`,items:[`function deploy() {`,`  return forge.push('us-east-1');`,`}`]},`top`),(0,s.jsx)(l,{title:`Preview`,items:[`Output renders here`],muted:!0},`bottom`)]})})},f={args:{orientation:`horizontal`,defaultSizes:[30,70],collapsible:!0,collapsedSize:0},render:e=>{let[t,n]=o.useState(`drag · 30% · collapse on Enter`);return(0,s.jsxs)(`div`,{style:{border:`1px solid var(--border)`,borderRadius:`var(--radius-xl)`,overflow:`hidden`,height:260},children:[(0,s.jsx)(i,{...e,style:{height:`100%`},onSizesChange:([e])=>n(`first panel: ${Math.round(e)}%`),children:[(0,s.jsx)(l,{title:`Sidebar`,items:[`item-1`,`item-2`,`item-3`],muted:!0},`a`),(0,s.jsx)(l,{title:`Content`},`b`)]}),(0,s.jsx)(`div`,{style:{marginTop:8,fontFamily:`var(--font-mono)`,fontSize:`var(--text-xs)`,color:`var(--fg-faint)`},children:t})]})}},p={args:{orientation:`horizontal`},render:e=>{let[t,n]=o.useState([40,60]);return(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`div`,{style:{display:`flex`,gap:8,marginBottom:12},children:[[20,80],[50,50],[70,30]].map(([e,t])=>(0,s.jsxs)(`button`,{className:`btn outline sm`,onClick:()=>n([e,t]),children:[e,`/`,t]},`${e}-${t}`))}),(0,s.jsx)(`div`,{style:{border:`1px solid var(--border)`,borderRadius:`var(--radius-xl)`,overflow:`hidden`,height:240},children:(0,s.jsx)(i,{...e,sizes:t,onSizesChange:n,style:{height:`100%`},children:[(0,s.jsx)(l,{title:`Panel A — ${Math.round(t[0])}%`,muted:!0},`a`),(0,s.jsx)(l,{title:`Panel B — ${Math.round(t[1])}%`},`b`)]})})]})}},m={args:{withHandle:!1},render:e=>(0,s.jsx)(`div`,{style:{border:`1px solid var(--border)`,borderRadius:`var(--radius-xl)`,overflow:`hidden`,height:200},children:(0,s.jsx)(i,{...e,style:{height:`100%`},children:[(0,s.jsx)(l,{title:`Left`,muted:!0},`a`),(0,s.jsx)(l,{title:`Right`},`b`)]})})},h={render:e=>(0,s.jsx)(`div`,{dir:`rtl`,children:(0,s.jsx)(`div`,{style:{border:`1px solid var(--border)`,borderRadius:`var(--radius-xl)`,overflow:`hidden`,height:260},children:(0,s.jsx)(i,{...e,style:{height:`100%`},children:[(0,s.jsx)(l,{title:`الملفات`,items:[`index.tsx`,`styles.css`],muted:!0},`a`),(0,s.jsx)(l,{title:`المحرر`},`b`)]})})})},g={render:()=>(0,s.jsx)(`div`,{style:{border:`1px solid var(--border)`,borderRadius:`var(--radius-xl)`,overflow:`hidden`,height:320},children:(0,s.jsx)(i,{orientation:`horizontal`,defaultSizes:[22,78],style:{height:`100%`},children:[(0,s.jsx)(l,{title:`Explorer`,items:[`src/`,`├ app/`,`│ └ page.tsx`,`public/`,`package.json`],muted:!0},`sidebar`),(0,s.jsx)(`div`,{style:{height:`100%`,display:`flex`,flexDirection:`column`},children:(0,s.jsx)(i,{orientation:`vertical`,defaultSizes:[68,32],style:{height:`100%`},children:[(0,s.jsx)(l,{title:`Editor`,items:[`export default function Page() {`,`  return <h1>Hello Forge</h1>`,`}`]},`editor`),(0,s.jsx)(l,{title:`Terminal`,items:[`$ pnpm dev`,`> ready on http://localhost:3000`],muted:!0},`terminal`)]})},`main`)]})})},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-xl)',
    overflow: 'hidden',
    height: 260
  }}>
      <Resizable {...args} style={{
      height: '100%'
    }}>
        {[<PanelContent key="a" title="Files" items={['index.tsx', 'config.json', 'README.md', 'styles.css']} muted />, <PanelContent key="b" title="Editor" items={['// Edit panel content renders here']} />]}
      </Resizable>
    </div>
}`,...u.parameters?.docs?.source},description:{story:`Default horizontal split — drag the handle or focus it and use Arrow keys.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    orientation: 'vertical',
    defaultSizes: [60, 40]
  },
  render: args => <div style={{
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-xl)',
    overflow: 'hidden',
    height: 360
  }}>
      <Resizable {...args} style={{
      height: '100%'
    }}>
        {[<PanelContent key="top" title="Editor" items={['function deploy() {', "  return forge.push('us-east-1');", '}']} />, <PanelContent key="bottom" title="Preview" items={['Output renders here']} muted />]}
      </Resizable>
    </div>
}`,...d.parameters?.docs?.source},description:{story:`Vertical orientation — top/bottom split with a horizontal drag line.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    orientation: 'horizontal',
    defaultSizes: [30, 70],
    collapsible: true,
    collapsedSize: 0
  },
  render: args => {
    const [label, setLabel] = React.useState('drag · 30% · collapse on Enter');
    return <div style={{
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      height: 260
    }}>
        <Resizable {...args} style={{
        height: '100%'
      }} onSizesChange={([a]) => setLabel(\`first panel: \${Math.round(a)}%\`)}>
          {[<PanelContent key="a" title="Sidebar" items={['item-1', 'item-2', 'item-3']} muted />, <PanelContent key="b" title="Content" />]}
        </Resizable>
        <div style={{
        marginTop: 8,
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        color: 'var(--fg-faint)'
      }}>
          {label}
        </div>
      </div>;
  }
}`,...f.parameters?.docs?.source},description:{story:`Collapsible first panel — drag below minSize or press Enter on the handle to collapse.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    orientation: 'horizontal'
  },
  render: args => {
    const [sizes, setSizes] = React.useState<[number, number]>([40, 60]);
    const presets: [number, number][] = [[20, 80], [50, 50], [70, 30]];
    return <div>
        <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 12
      }}>
          {presets.map(([a, b]) => <button key={\`\${a}-\${b}\`} className="btn outline sm" onClick={() => setSizes([a, b])}>
              {a}/{b}
            </button>)}
        </div>
        <div style={{
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        height: 240
      }}>
          <Resizable {...args} sizes={sizes} onSizesChange={setSizes} style={{
          height: '100%'
        }}>
            {[<PanelContent key="a" title={\`Panel A — \${Math.round(sizes[0])}%\`} muted />, <PanelContent key="b" title={\`Panel B — \${Math.round(sizes[1])}%\`} />]}
          </Resizable>
        </div>
      </div>;
  }
}`,...p.parameters?.docs?.source},description:{story:`Controlled mode — parent owns the sizes and can snap or constrain them.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    withHandle: false
  },
  render: args => <div style={{
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-xl)',
    overflow: 'hidden',
    height: 200
  }}>
      <Resizable {...args} style={{
      height: '100%'
    }}>
        {[<PanelContent key="a" title="Left" muted />, <PanelContent key="b" title="Right" />]}
      </Resizable>
    </div>
}`,...m.parameters?.docs?.source},description:{story:`Handle without the grip pill — for tight UIs where the seam is
implied by the layout.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => <div dir="rtl">
      <div style={{
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      height: 260
    }}>
        <Resizable {...args} style={{
        height: '100%'
      }}>
          {[<PanelContent key="a" title="الملفات" items={['index.tsx', 'styles.css']} muted />, <PanelContent key="b" title="المحرر" />]}
        </Resizable>
      </div>
    </div>
}`,...h.parameters?.docs?.source},description:{story:`RTL — the group is a flex row so the first panel sits on the right; the handle
is drag-direction-aware (drag left to grow the right-hand pane).`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-xl)',
    overflow: 'hidden',
    height: 320
  }}>
      {/* Outer horizontal split: sidebar vs main area */}
      <Resizable orientation="horizontal" defaultSizes={[22, 78]} style={{
      height: '100%'
    }}>
        {[<PanelContent key="sidebar" title="Explorer" items={['src/', '├ app/', '│ └ page.tsx', 'public/', 'package.json']} muted />,
      // Inner vertical split: editor vs terminal
      <div key="main" style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
            <Resizable orientation="vertical" defaultSizes={[68, 32]} style={{
          height: '100%'
        }}>
              {[<PanelContent key="editor" title="Editor" items={['export default function Page() {', '  return <h1>Hello Forge</h1>', '}']} />, <PanelContent key="terminal" title="Terminal" items={['$ pnpm dev', '> ready on http://localhost:3000']} muted />]}
            </Resizable>
          </div>]}
      </Resizable>
    </div>
}`,...g.parameters?.docs?.source},description:{story:`In context — a three-column IDE layout with two nested splits.`,...g.parameters?.docs?.description}}},_=[`Default`,`Vertical`,`Collapsible`,`Controlled`,`NoGrip`,`RTL`,`InContext`]}))();export{f as Collapsible,p as Controlled,u as Default,g as InContext,m as NoGrip,h as RTL,d as Vertical,_ as __namedExportsOrder,c as default};