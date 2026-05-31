import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./jsx-runtime-CaZkqeYb.js";import{Vt as n,t as r}from"./src-DgoylXRw.js";var i,a,o,s,c,l,u,d,f,p;e((()=>{r(),i=t(),a={title:`Primitives/AspectRatio`,component:n,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:"A zero-dependency layout wrapper that locks children to a fixed width/height ratio. Uses the CSS `aspect-ratio` property (supported since 2021). Eliminates CLS by reserving space before the asset arrives. Adds no ARIA role or focus stop — interactive children behave normally."}}},args:{ratio:`16/9`,radius:`var(--radius-md)`},argTypes:{ratio:{control:`select`,options:[`16/9`,`4/3`,`3/2`,`1/1`,`3/4`,`9/16`,`21/9`],description:`Numeric ratio or named preset (width ÷ height).`},radius:{control:`text`,description:`Border-radius CSS value.`}}},o={render:e=>(0,i.jsx)(`div`,{style:{maxWidth:480},children:(0,i.jsxs)(n,{...e,children:[(0,i.jsx)(`div`,{className:`ar-fill warm`}),(0,i.jsx)(`div`,{className:`ar-label`,children:String(e.ratio)})]})})},s={name:`Common ratios`,render:()=>(0,i.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(3, minmax(0,1fr))`,gap:12},children:[[`16/9`,``,`16 : 9 — video`],[`4/3`,` warm`,`4 : 3 — classic`],[`3/2`,` cool`,`3 : 2 — DSLR`],[`1/1`,` warm`,`1 : 1 — square`],[`3/4`,` cool`,`3 : 4 — portrait`],[`9/16`,``,`9 : 16 — story`]].map(([e,t,r])=>(0,i.jsxs)(n,{ratio:e,children:[(0,i.jsx)(`div`,{className:`ar-fill${t}`}),(0,i.jsx)(`div`,{className:`ar-label`,children:r})]},e))})},c={name:`Numeric ratio prop`,args:{ratio:16/9},render:e=>(0,i.jsx)(`div`,{style:{maxWidth:400},children:(0,i.jsxs)(n,{...e,children:[(0,i.jsx)(`div`,{className:`ar-fill cool`}),(0,i.jsxs)(`div`,{className:`ar-label`,children:[`ratio=`,`{16 / 9}`]})]})})},l={render:()=>(0,i.jsx)(`div`,{style:{maxWidth:200},children:(0,i.jsxs)(n,{ratio:`9/16`,children:[(0,i.jsx)(`div`,{className:`ar-fill warm`}),(0,i.jsx)(`div`,{className:`ar-label`,children:`9 : 16`})]})})},u={render:()=>(0,i.jsxs)(n,{ratio:`21/9`,radius:`var(--radius-lg)`,children:[(0,i.jsx)(`div`,{className:`ar-fill cool`}),(0,i.jsx)(`div`,{className:`ar-label`,children:`21 : 9 — banner`})]})},d={name:`In context — card`,render:()=>(0,i.jsxs)(`div`,{className:`surface`,style:{padding:0,overflow:`hidden`,maxWidth:320},children:[(0,i.jsxs)(n,{ratio:`16/9`,radius:`0`,children:[(0,i.jsx)(`div`,{className:`ar-fill warm`}),(0,i.jsx)(`div`,{className:`ar-label`,children:`cover.jpg`})]}),(0,i.jsxs)(`div`,{style:{padding:16},children:[(0,i.jsx)(`div`,{style:{fontWeight:600,marginBottom:4},children:`The forge that ships`}),(0,i.jsx)(`div`,{style:{fontSize:`var(--text-sm)`,color:`var(--fg-muted)`,lineHeight:1.55},children:`Architecture notes from the platform team.`})]})]})},f={name:`RTL — direction-agnostic`,render:()=>(0,i.jsxs)(`div`,{dir:`rtl`,style:{display:`grid`,gridTemplateColumns:`repeat(2, minmax(0,1fr))`,gap:12},children:[(0,i.jsxs)(n,{ratio:`16/9`,children:[(0,i.jsx)(`div`,{className:`ar-fill warm`}),(0,i.jsx)(`div`,{className:`ar-label`,children:`١٦ : ٩ — هيرو`})]}),(0,i.jsxs)(n,{ratio:`1/1`,children:[(0,i.jsx)(`div`,{className:`ar-fill cool`}),(0,i.jsx)(`div`,{className:`ar-label`,children:`١ : ١ — أفتار`})]})]})},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    maxWidth: 480
  }}>
      <AspectRatio {...args}>
        <div className="ar-fill warm" />
        <div className="ar-label">{String(args.ratio)}</div>
      </AspectRatio>
    </div>
}`,...o.parameters?.docs?.source},description:{story:`Default — 16:9, driven by the controls panel.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: 'Common ratios',
  render: () => <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
    gap: 12
  }}>
      {([['16/9', '', '16 : 9 — video'], ['4/3', ' warm', '4 : 3 — classic'], ['3/2', ' cool', '3 : 2 — DSLR'], ['1/1', ' warm', '1 : 1 — square'], ['3/4', ' cool', '3 : 4 — portrait'], ['9/16', '', '9 : 16 — story']] as const).map(([ratio, fillMod, label]) => <AspectRatio key={ratio} ratio={ratio}>
          <div className={\`ar-fill\${fillMod}\`} />
          <div className="ar-label">{label}</div>
        </AspectRatio>)}
    </div>
}`,...s.parameters?.docs?.source},description:{story:`Seven common ratios side by side.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: 'Numeric ratio prop',
  args: {
    ratio: 16 / 9
  },
  render: args => <div style={{
    maxWidth: 400
  }}>
      <AspectRatio {...args}>
        <div className="ar-fill cool" />
        <div className="ar-label">ratio={'{16 / 9}'}</div>
      </AspectRatio>
    </div>
}`,...c.parameters?.docs?.source},description:{story:"Numeric ratio — pass `ratio={16 / 9}` directly.",...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    maxWidth: 200
  }}>
      <AspectRatio ratio="9/16">
        <div className="ar-fill warm" />
        <div className="ar-label">9 : 16</div>
      </AspectRatio>
    </div>
}`,...l.parameters?.docs?.source},description:{story:`Portrait / vertical — 9:16 story format.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <AspectRatio ratio="21/9" radius="var(--radius-lg)">
      <div className="ar-fill cool" />
      <div className="ar-label">21 : 9 — banner</div>
    </AspectRatio>
}`,...u.parameters?.docs?.source},description:{story:`Cinematic — 21:9 banner.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: 'In context — card',
  render: () => <div className="surface" style={{
    padding: 0,
    overflow: 'hidden',
    maxWidth: 320
  }}>
      <AspectRatio ratio="16/9" radius="0">
        <div className="ar-fill warm" />
        <div className="ar-label">cover.jpg</div>
      </AspectRatio>
      <div style={{
      padding: 16
    }}>
        <div style={{
        fontWeight: 600,
        marginBottom: 4
      }}>The forge that ships</div>
        <div style={{
        fontSize: 'var(--text-sm)',
        color: 'var(--fg-muted)',
        lineHeight: 1.55
      }}>
          Architecture notes from the platform team.
        </div>
      </div>
    </div>
}`,...d.parameters?.docs?.source},description:{story:`In context — card with a locked-ratio thumbnail.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: 'RTL — direction-agnostic',
  render: () => <div dir="rtl" style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
    gap: 12
  }}>
      <AspectRatio ratio="16/9">
        <div className="ar-fill warm" />
        <div className="ar-label">١٦ : ٩ — هيرو</div>
      </AspectRatio>
      <AspectRatio ratio="1/1">
        <div className="ar-fill cool" />
        <div className="ar-label">١ : ١ — أفتار</div>
      </AspectRatio>
    </div>
}`,...f.parameters?.docs?.source},description:{story:`RTL — ratio box is direction-agnostic; the caption label lands in the trailing corner.`,...f.parameters?.docs?.description}}},p=[`Default`,`CommonRatios`,`NumericRatio`,`Portrait`,`Cinematic`,`InContext`,`RTL`]}))();export{u as Cinematic,s as CommonRatios,o as Default,d as InContext,c as NumericRatio,l as Portrait,f as RTL,p as __namedExportsOrder,a as default};