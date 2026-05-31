import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{Sa as r,t as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u,d,f,p,m,h,g,_,v;e((()=>{t(),i(),a=n(),o={title:`Primitives/Avatar`,component:r,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:"Identity at a glance. Initials by default (computed from `name`, or pass `children` to override); reach for an image via `src` only when the product is identity-focused. Five size presets (xs–xl), an optional presence `status` dot, an `ember` tint for the current user, and `<Avatar.Group>` for overlapping team rows."}}},args:{name:`Ana Silva`,size:`md`},argTypes:{name:{control:`text`,description:`Full name — title tooltip + computed initials fallback.`},size:{control:`inline-radio`,options:[`xs`,`sm`,`md`,`lg`,`xl`]},status:{control:`inline-radio`,options:[void 0,`online`,`away`,`busy`,`offline`]},ember:{control:`boolean`}}},s={render:e=>(0,a.jsx)(r,{...e,children:`AS`})},c={render:()=>(0,a.jsx)(`div`,{style:{display:`flex`,gap:16,alignItems:`center`},children:[`xs`,`sm`,`md`,`lg`,`xl`].map(e=>(0,a.jsx)(r,{size:e,name:`Ana Silva`,children:`AS`},e))})},l={render:()=>(0,a.jsxs)(`div`,{style:{display:`flex`,gap:16,alignItems:`center`},children:[(0,a.jsx)(r,{size:`lg`,name:`Ana — online`,status:`online`,children:`AS`}),(0,a.jsx)(r,{size:`lg`,name:`Bruno — away`,status:`away`,children:`BC`}),(0,a.jsx)(r,{size:`lg`,name:`Camila — busy`,status:`busy`,children:`CO`}),(0,a.jsx)(r,{size:`lg`,name:`Diego — offline`,status:`offline`,children:`DM`})]})},u={render:()=>(0,a.jsxs)(`div`,{style:{display:`flex`,gap:16,alignItems:`center`},children:[(0,a.jsx)(r,{size:`lg`,name:`Mariana Rossi`,src:`/avatars/Mariana-Rossi.jpg`}),(0,a.jsx)(r,{size:`lg`,name:`Broken URL`,src:`/does-not-exist.jpg`,children:`BU`})]})},d={render:()=>(0,a.jsx)(r,{size:`lg`,name:`You`,ember:!0,children:`YO`})},f={render:()=>(0,a.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:20},children:[(0,a.jsxs)(r.Group,{max:4,children:[(0,a.jsx)(r,{name:`Ana`,children:`AS`}),(0,a.jsx)(r,{name:`Bruno`,ember:!0,children:`BC`}),(0,a.jsx)(r,{name:`Camila`,children:`CO`}),(0,a.jsx)(r,{name:`Diego`,children:`DM`}),(0,a.jsx)(r,{name:`Eliane`,children:`EL`})]}),(0,a.jsx)(`div`,{dir:`rtl`,children:(0,a.jsxs)(r.Group,{max:4,children:[(0,a.jsx)(r,{name:`آنا`,children:`AS`}),(0,a.jsx)(r,{name:`برونو`,ember:!0,children:`BC`}),(0,a.jsx)(r,{name:`كاميلا`,children:`CO`}),(0,a.jsx)(r,{name:`ديغو`,children:`DM`}),(0,a.jsx)(r,{name:`إلين`,children:`EL`})]})})]})},p=[{name:`Ashley Williams`,initials:`AW`,src:`/avatars/Ashley-Williams.jpg`},{name:`Mariana Rossi`,initials:`MR`,src:`/avatars/Mariana-Rossi.jpg`},{name:`Diego Ferreira`,initials:`DF`,src:`/avatars/Diego-Ferreira.jpg`},{name:`Yuki Tanaka`,initials:`YT`,src:`/avatars/Yuki-Tanaka.jpg`},{name:`Marcus Johnson`,initials:`MJ`,src:`/avatars/Marcus-Johnson.jpg`},{name:`Emma Larsson`,initials:`EL`,src:`/avatars/Emma-Larsson.jpg`},{name:`Raj Patel`,initials:`RP`,src:`/avatars/Raj-Patel.jpg`}],m={render:()=>(0,a.jsxs)(`div`,{style:{display:`flex`,gap:16,alignItems:`center`,flexWrap:`wrap`},children:[p.map(e=>(0,a.jsx)(r,{size:`lg`,name:e.name,src:e.src,children:e.initials},e.src)),(0,a.jsx)(r,{size:`lg`,name:`Broken URL`,src:`/nope.jpg`,children:`BU`})]})},h={render:()=>(0,a.jsx)(r.Group,{max:5,children:p.map(e=>(0,a.jsx)(r,{name:e.name,src:e.src},e.src))})},g={render:()=>(0,a.jsxs)(`div`,{style:{display:`flex`,gap:16,alignItems:`center`},children:[(0,a.jsx)(r,{size:`lg`,name:`Ashley Williams`,src:`/avatars/Ashley-Williams.jpg`,status:`online`}),(0,a.jsx)(r,{size:`lg`,name:`Mariana Rossi`,src:`/avatars/Mariana-Rossi.jpg`,status:`away`}),(0,a.jsx)(r,{size:`lg`,name:`Diego Ferreira`,src:`/avatars/Diego-Ferreira.jpg`,status:`busy`})]})},_={render:()=>(0,a.jsxs)(`div`,{style:{display:`flex`,gap:16,alignItems:`center`,flexWrap:`wrap`},children:[(0,a.jsx)(r,{size:`md`,name:`Default`,children:`DE`}),(0,a.jsx)(r,{size:`md`,name:`You`,ember:!0,children:`YO`}),(0,a.jsx)(r,{size:`md`,name:`Online`,status:`online`,children:`ON`}),(0,a.jsx)(r,{size:`md`,name:`Yuki Tanaka`,src:`/avatars/Yuki-Tanaka.jpg`})]})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: args => <Avatar {...args}>AS</Avatar>
}`,...s.parameters?.docs?.source},description:{story:"Default — initials computed from `name`.",...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 16,
    alignItems: 'center'
  }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(size => <Avatar key={size} size={size} name="Ana Silva">AS</Avatar>)}
    </div>
}`,...c.parameters?.docs?.source},description:{story:`Size presets — xs 18 · sm 22 · md 28 · lg 36 · xl 48.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 16,
    alignItems: 'center'
  }}>
      <Avatar size="lg" name="Ana — online" status="online">AS</Avatar>
      <Avatar size="lg" name="Bruno — away" status="away">BC</Avatar>
      <Avatar size="lg" name="Camila — busy" status="busy">CO</Avatar>
      <Avatar size="lg" name="Diego — offline" status="offline">DM</Avatar>
    </div>
}`,...l.parameters?.docs?.source},description:{story:`Presence status — the trailing-bottom dot reads as a cutout via a 2px ring.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 16,
    alignItems: 'center'
  }}>
      <Avatar size="lg" name="Mariana Rossi" src="/avatars/Mariana-Rossi.jpg" />
      <Avatar size="lg" name="Broken URL" src="/does-not-exist.jpg">BU</Avatar>
    </div>
}`,...u.parameters?.docs?.source},description:{story:"Image with initials fallback — a broken `src` degrades to the computed initials.",...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <Avatar size="lg" name="You" ember>YO</Avatar>
}`,...d.parameters?.docs?.source},description:{story:`Ember tint — reserve for the current user / "you". Dark ink on the ember-soft fill.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 20
  }}>
      <Avatar.Group max={4}>
        <Avatar name="Ana">AS</Avatar>
        <Avatar name="Bruno" ember>BC</Avatar>
        <Avatar name="Camila">CO</Avatar>
        <Avatar name="Diego">DM</Avatar>
        <Avatar name="Eliane">EL</Avatar>
      </Avatar.Group>
      <div dir="rtl">
        <Avatar.Group max={4}>
          <Avatar name="آنا">AS</Avatar>
          <Avatar name="برونو" ember>BC</Avatar>
          <Avatar name="كاميلا">CO</Avatar>
          <Avatar name="ديغو">DM</Avatar>
          <Avatar name="إلين">EL</Avatar>
        </Avatar.Group>
      </div>
    </div>
}`,...f.parameters?.docs?.source},description:{story:`Avatar.Group — overlapping team row with a "+N" overflow chip. Mirrors under RTL.`,...f.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 16,
    alignItems: 'center',
    flexWrap: 'wrap'
  }}>
      {PHOTOS.map(p => <Avatar key={p.src} size="lg" name={p.name} src={p.src}>{p.initials}</Avatar>)}
      <Avatar size="lg" name="Broken URL" src="/nope.jpg">BU</Avatar>
    </div>
}`,...m.parameters?.docs?.source},description:{story:"With photo — pass `src` for a real headshot; initials render until it loads and on error.",...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <Avatar.Group max={5}>
      {PHOTOS.map(p => <Avatar key={p.src} name={p.name} src={p.src} />)}
    </Avatar.Group>
}`,...h.parameters?.docs?.source},description:{story:`Photo group — overlapping headshots with a "+N" overflow chip.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 16,
    alignItems: 'center'
  }}>
      <Avatar size="lg" name="Ashley Williams" src="/avatars/Ashley-Williams.jpg" status="online" />
      <Avatar size="lg" name="Mariana Rossi" src="/avatars/Mariana-Rossi.jpg" status="away" />
      <Avatar size="lg" name="Diego Ferreira" src="/avatars/Diego-Ferreira.jpg" status="busy" />
    </div>
}`,...g.parameters?.docs?.source},description:{story:`Photo + status — presence dot over a headshot.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 16,
    alignItems: 'center',
    flexWrap: 'wrap'
  }}>
      <Avatar size="md" name="Default">DE</Avatar>
      <Avatar size="md" name="You" ember>YO</Avatar>
      <Avatar size="md" name="Online" status="online">ON</Avatar>
      <Avatar size="md" name="Yuki Tanaka" src="/avatars/Yuki-Tanaka.jpg" />
    </div>
}`,..._.parameters?.docs?.source},description:{story:`Variants — the full matrix at a glance.`,..._.parameters?.docs?.description}}},v=[`Default`,`Sizes`,`Status`,`WithImage`,`Ember`,`Group`,`WithPhoto`,`PhotoGroup`,`PhotoStatus`,`Variants`]}))();export{s as Default,d as Ember,f as Group,h as PhotoGroup,g as PhotoStatus,c as Sizes,l as Status,_ as Variants,u as WithImage,m as WithPhoto,v as __namedExportsOrder,o as default};