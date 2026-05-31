import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{at as i,it as a,ot as o,rt as s,t as c}from"./src-DgoylXRw.js";var l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E;e((()=>{l=t(n(),1),c(),u=r(),d={background:`var(--surface)`,border:`1px solid var(--border)`,borderRadius:10,overflow:`hidden`,display:`flex`,flexDirection:`column`},f={aspectRatio:`4 / 3`,background:`linear-gradient(135deg, color-mix(in oklab, #FF6B35 20%, transparent), color-mix(in oklab, #A78BFA 18%, transparent)), var(--surface)`,display:`flex`,alignItems:`center`,justifyContent:`center`,color:`var(--fg-muted)`,fontFamily:`var(--font-mono)`,fontSize:11,letterSpacing:`0.06em`,textTransform:`uppercase`,borderBottom:`1px solid var(--border)`},p={padding:`12px 14px`,display:`flex`,flexDirection:`column`,gap:4},m={fontSize:13,fontWeight:600,color:`var(--fg)`},h={fontSize:12,color:`var(--fg-muted)`,lineHeight:1.5},g=[{tag:`NEW`,title:`Fluid type scale`,desc:`clamp() across every heading, once in tokens.`},{tag:`UPDATE`,title:`Dark mode tokens`,desc:`Six surface levels + automatic contrast.`},{tag:`NEW`,title:`Tailwind v4 preset`,desc:`Drop-in @theme block. Zero config.`},{tag:`NEW`,title:`Framer Motion 11`,desc:`Pre-tuned motion variants per surface.`},{tag:`UPDATE`,title:`Accessible focus`,desc:`Ember rings everywhere — bye, browser blue.`},{tag:`NEW`,title:`RTL contract`,desc:`Logical properties throughout. One attribute.`}],_=[{tag:`RELEASE`,title:`Forge 1.1`,desc:`7 new components, full alphabetical sort.`},{tag:`GUIDE`,title:`Tailwind v4 setup`,desc:`A 90-second walkthrough of the preset.`},{tag:`ROADMAP`,title:`Coming next`,desc:`Combobox, command palette, and a chart kit.`}],v=[{tag:`جديد`,title:`مقياس الخط المرن`,desc:`clamp() لكل عنوان في الرموز.`},{tag:`تحديث`,title:`رموز الوضع الداكن`,desc:`ست طبقات سطح + تباين تلقائي.`},{tag:`جديد`,title:`إعداد Tailwind v4`,desc:`كتلة @theme بدون أي تكوين.`},{tag:`جديد`,title:`Framer Motion 11`,desc:`متغيرات حركة مضبوطة لكل سطح.`}],y={title:`Elements/Carousel`,component:s,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:`A gesture/drag/snap carousel built on embla-carousel-react. Provides prev/next arrows, dot indicators, autoplay (pauses on hover/focus/reduced-motion), full keyboard support, and RTL via Embla's direction option.`}}},args:{variant:`default`,orientation:`horizontal`,label:`Feature highlights`},argTypes:{variant:{control:`inline-radio`,options:[`default`,`hero`]},orientation:{control:`inline-radio`,options:[`horizontal`,`vertical`]},autoplayInterval:{control:{type:`number`,min:0,step:500}},label:{control:`text`}}},b={render:e=>(0,u.jsx)(`div`,{style:{width:`100%`,maxWidth:720},children:(0,u.jsxs)(s,{...e,children:[g.map(e=>(0,u.jsx)(o,{width:`240px`,children:(0,u.jsxs)(`div`,{style:d,children:[(0,u.jsx)(`div`,{style:f,children:e.tag}),(0,u.jsxs)(`div`,{style:p,children:[(0,u.jsx)(`span`,{style:m,children:e.title}),(0,u.jsx)(`span`,{style:h,children:e.desc})]})]})},e.title)),(0,u.jsx)(a,{}),(0,u.jsx)(i,{})]})})},x={args:{variant:`hero`,label:`Featured content`},render:e=>(0,u.jsx)(`div`,{style:{width:`100%`,maxWidth:720},children:(0,u.jsxs)(s,{...e,children:[_.map(e=>(0,u.jsx)(o,{style:{flex:`0 0 100%`,aspectRatio:`16 / 7`,position:`relative`,background:`var(--surface)`,borderRadius:10,overflow:`hidden`},children:(0,u.jsxs)(`div`,{style:{position:`absolute`,inset:0,padding:28,display:`flex`,flexDirection:`column`,justifyContent:`flex-end`,gap:6,background:`linear-gradient(0deg, rgba(8,9,10,0.6), transparent 60%)`},children:[(0,u.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,letterSpacing:`0.12em`,color:`#FF6B35`,textTransform:`uppercase`},children:e.tag}),(0,u.jsx)(`span`,{style:{fontSize:22,fontWeight:600,letterSpacing:`-0.015em`,color:`var(--fg)`},children:e.title}),(0,u.jsx)(`span`,{style:{fontSize:13,color:`var(--fg-muted)`},children:e.desc})]})},e.title)),(0,u.jsx)(a,{}),(0,u.jsx)(i,{})]})})},S={args:{autoplayInterval:3e3,opts:{loop:!0},label:`Auto-advancing carousel`},render:e=>(0,u.jsx)(`div`,{style:{width:`100%`,maxWidth:720},children:(0,u.jsxs)(s,{...e,children:[g.map(e=>(0,u.jsx)(o,{width:`240px`,children:(0,u.jsxs)(`div`,{style:d,children:[(0,u.jsx)(`div`,{style:f,children:e.tag}),(0,u.jsxs)(`div`,{style:p,children:[(0,u.jsx)(`span`,{style:m,children:e.title}),(0,u.jsx)(`span`,{style:h,children:e.desc})]})]})},e.title)),(0,u.jsx)(a,{}),(0,u.jsx)(i,{})]})})},C={args:{opts:{loop:!0},label:`Looping carousel`},render:e=>(0,u.jsx)(`div`,{style:{width:`100%`,maxWidth:720},children:(0,u.jsxs)(s,{...e,children:[g.map(e=>(0,u.jsx)(o,{width:`240px`,children:(0,u.jsxs)(`div`,{style:d,children:[(0,u.jsx)(`div`,{style:f,children:e.tag}),(0,u.jsxs)(`div`,{style:p,children:[(0,u.jsx)(`span`,{style:m,children:e.title}),(0,u.jsx)(`span`,{style:h,children:e.desc})]})]})},e.title)),(0,u.jsx)(a,{}),(0,u.jsx)(i,{})]})})},w={args:{label:`مزايا مميّزة`},render:e=>(0,u.jsx)(`div`,{dir:`rtl`,style:{width:`100%`,maxWidth:720},children:(0,u.jsxs)(s,{...e,children:[v.map(e=>(0,u.jsx)(o,{width:`240px`,children:(0,u.jsxs)(`div`,{style:d,children:[(0,u.jsx)(`div`,{style:f,children:e.tag}),(0,u.jsxs)(`div`,{style:p,children:[(0,u.jsx)(`span`,{style:m,children:e.title}),(0,u.jsx)(`span`,{style:h,children:e.desc})]})]})},e.title)),(0,u.jsx)(a,{}),(0,u.jsx)(i,{})]})})},T={render:()=>{let[e,t]=l.useState(!1);return(0,u.jsxs)(`div`,{style:{background:`var(--surface)`,border:`1px solid var(--border)`,borderRadius:12,padding:24,maxWidth:680,display:`flex`,flexDirection:`column`,gap:16},children:[(0,u.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`},children:[(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`div`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,letterSpacing:`0.1em`,textTransform:`uppercase`,color:`var(--fg-faint)`},children:`What's new`}),(0,u.jsx)(`div`,{style:{fontSize:15,fontWeight:600,color:`var(--fg)`,marginTop:4},children:`Forge 1.1 — release highlights`})]}),(0,u.jsx)(`button`,{type:`button`,style:{fontSize:12,color:`#FF6B35`,background:`none`,border:`none`,cursor:`pointer`,fontFamily:`inherit`},onClick:()=>t(!e),children:e?`Collapse`:`Show all`})]}),(0,u.jsxs)(s,{label:`Release highlights`,opts:{align:`start`},children:[g.slice(0,e?6:4).map(e=>(0,u.jsx)(o,{width:`200px`,children:(0,u.jsxs)(`div`,{style:d,children:[(0,u.jsx)(`div`,{style:f,children:e.tag}),(0,u.jsxs)(`div`,{style:p,children:[(0,u.jsx)(`span`,{style:m,children:e.title}),(0,u.jsx)(`span`,{style:h,children:e.desc})]})]})},e.title)),(0,u.jsx)(a,{}),(0,u.jsx)(i,{})]}),(0,u.jsx)(`div`,{style:{fontSize:12,color:`var(--fg-faint)`},children:`Forge Design System · v1.1.0 · 2026-05-30`})]})}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    width: '100%',
    maxWidth: 720
  }}>
      <Carousel {...args}>
        {FEATURES.map(s => <CarouselSlide key={s.title} width="240px">
            <div style={SLIDE_STYLE}>
              <div style={THUMB_STYLE}>{s.tag}</div>
              <div style={BODY_STYLE}>
                <span style={TITLE_STYLE}>{s.title}</span>
                <span style={DESC_STYLE}>{s.desc}</span>
              </div>
            </div>
          </CarouselSlide>)}
        <CarouselControls />
        <CarouselDots />
      </Carousel>
    </div>
}`,...b.parameters?.docs?.source},description:{story:`Standard card carousel with 6 slides, prev/next arrows, and dot indicators.`,...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'hero',
    label: 'Featured content'
  },
  render: args => <div style={{
    width: '100%',
    maxWidth: 720
  }}>
      <Carousel {...args}>
        {HEROES.map(h => <CarouselSlide key={h.title} style={{
        flex: '0 0 100%',
        aspectRatio: '16 / 7',
        position: 'relative',
        background: 'var(--surface)',
        borderRadius: 10,
        overflow: 'hidden'
      }}>
            <div style={{
          position: 'absolute',
          inset: 0,
          padding: 28,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          gap: 6,
          background: 'linear-gradient(0deg, rgba(8,9,10,0.6), transparent 60%)'
        }}>
              <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.12em',
            color: '#FF6B35',
            textTransform: 'uppercase'
          }}>{h.tag}</span>
              <span style={{
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: '-0.015em',
            color: 'var(--fg)'
          }}>{h.title}</span>
              <span style={{
            fontSize: 13,
            color: 'var(--fg-muted)'
          }}>{h.desc}</span>
            </div>
          </CarouselSlide>)}
        <CarouselControls />
        <CarouselDots />
      </Carousel>
    </div>
}`,...x.parameters?.docs?.source},description:{story:`Full-width hero carousel — each slide occupies 100% of the viewport.`,...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    autoplayInterval: 3000,
    opts: {
      loop: true
    },
    label: 'Auto-advancing carousel'
  },
  render: args => <div style={{
    width: '100%',
    maxWidth: 720
  }}>
      <Carousel {...args}>
        {FEATURES.map(s => <CarouselSlide key={s.title} width="240px">
            <div style={SLIDE_STYLE}>
              <div style={THUMB_STYLE}>{s.tag}</div>
              <div style={BODY_STYLE}>
                <span style={TITLE_STYLE}>{s.title}</span>
                <span style={DESC_STYLE}>{s.desc}</span>
              </div>
            </div>
          </CarouselSlide>)}
        <CarouselControls />
        <CarouselDots />
      </Carousel>
    </div>
}`,...S.parameters?.docs?.source},description:{story:`Autoplay at 3000ms — pauses on hover/focus; disabled under prefers-reduced-motion.`,...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    opts: {
      loop: true
    },
    label: 'Looping carousel'
  },
  render: args => <div style={{
    width: '100%',
    maxWidth: 720
  }}>
      <Carousel {...args}>
        {FEATURES.map(s => <CarouselSlide key={s.title} width="240px">
            <div style={SLIDE_STYLE}>
              <div style={THUMB_STYLE}>{s.tag}</div>
              <div style={BODY_STYLE}>
                <span style={TITLE_STYLE}>{s.title}</span>
                <span style={DESC_STYLE}>{s.desc}</span>
              </div>
            </div>
          </CarouselSlide>)}
        <CarouselControls />
        <CarouselDots />
      </Carousel>
    </div>
}`,...C.parameters?.docs?.source},description:{story:`Loop mode — arrows never disable; wraps from last to first.`,...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'مزايا مميّزة'
  },
  render: args => <div dir="rtl" style={{
    width: '100%',
    maxWidth: 720
  }}>
      <Carousel {...args}>
        {FEATURES_AR.map(s => <CarouselSlide key={s.title} width="240px">
            <div style={SLIDE_STYLE}>
              <div style={THUMB_STYLE}>{s.tag}</div>
              <div style={BODY_STYLE}>
                <span style={TITLE_STYLE}>{s.title}</span>
                <span style={DESC_STYLE}>{s.desc}</span>
              </div>
            </div>
          </CarouselSlide>)}
        <CarouselControls />
        <CarouselDots />
      </Carousel>
    </div>
}`,...w.parameters?.docs?.source},description:{story:`RTL direction — track scrolls right-to-left; chevrons mirror via CSS.
Use the trailing-start variant to verify logical anchoring.`,...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(false);
    return <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: 24,
      maxWidth: 680,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }}>
        <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
          <div>
            <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--fg-faint)'
          }}>What&apos;s new</div>
            <div style={{
            fontSize: 15,
            fontWeight: 600,
            color: 'var(--fg)',
            marginTop: 4
          }}>Forge 1.1 — release highlights</div>
          </div>
          <button type="button" style={{
          fontSize: 12,
          color: '#FF6B35',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit'
        }} onClick={() => setOpen(!open)}>
            {open ? 'Collapse' : 'Show all'}
          </button>
        </div>
        <Carousel label="Release highlights" opts={{
        align: 'start'
      }}>
          {FEATURES.slice(0, open ? 6 : 4).map(s => <CarouselSlide key={s.title} width="200px">
              <div style={SLIDE_STYLE}>
                <div style={THUMB_STYLE}>{s.tag}</div>
                <div style={BODY_STYLE}>
                  <span style={TITLE_STYLE}>{s.title}</span>
                  <span style={DESC_STYLE}>{s.desc}</span>
                </div>
              </div>
            </CarouselSlide>)}
          <CarouselControls />
          <CarouselDots />
        </Carousel>
        <div style={{
        fontSize: 12,
        color: 'var(--fg-faint)'
      }}>Forge Design System · v1.1.0 · 2026-05-30</div>
      </div>;
  }
}`,...T.parameters?.docs?.source},description:{story:`Carousel embedded in a realistic product-update feed card.`,...T.parameters?.docs?.description}}},E=[`Default`,`Hero`,`Autoplay`,`Loop`,`RTL`,`InContext`]}))();export{S as Autoplay,b as Default,x as Hero,T as InContext,C as Loop,w as RTL,E as __namedExportsOrder,y as default};