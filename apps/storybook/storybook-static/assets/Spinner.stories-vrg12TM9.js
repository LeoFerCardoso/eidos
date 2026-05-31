import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{k as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h,g,_;e((()=>{o=t(n(),1),a(),s=r(),c={title:`Primitives/Spinner`,component:i,tags:[`autodocs`],parameters:{layout:`centered`,docs:{description:{component:`Single-purpose loading indicator. Three variants (ring, dots, bars), named sizes (sm/md/lg) or a raw pixel number, and color via currentColor. Announces with role="status" + a visually-hidden label. prefers-reduced-motion slows the animation to a calmer pace.`}}},args:{variant:`ring`,size:`md`,"aria-label":`Loading`},argTypes:{variant:{control:`inline-radio`,options:[`ring`,`dots`,`bars`]},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]},color:{control:`color`},"aria-label":{control:`text`}}},l={},u={render:()=>(0,s.jsx)(`div`,{style:{display:`flex`,gap:32,alignItems:`center`},children:[`ring`,`dots`,`bars`].map(e=>(0,s.jsxs)(`span`,{style:{display:`inline-flex`,flexDirection:`column`,alignItems:`center`,gap:10},children:[(0,s.jsx)(i,{variant:e,size:`md`}),(0,s.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:e})]},e))})},d={render:()=>(0,s.jsx)(`div`,{style:{display:`flex`,gap:28,alignItems:`flex-end`},children:[[`sm`,12],[`md`,16],[`lg`,24],[40,40]].map(([e,t])=>(0,s.jsxs)(`span`,{style:{display:`inline-flex`,flexDirection:`column`,alignItems:`center`,gap:10},children:[(0,s.jsx)(i,{variant:`ring`,size:t}),(0,s.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:typeof e==`number`?`${e}px`:e})]},e))})},f={render:()=>(0,s.jsx)(`div`,{style:{display:`flex`,gap:24,alignItems:`center`,flexWrap:`wrap`},children:[{name:`ember`,v:`var(--ember)`},{name:`success`,v:`var(--success)`},{name:`warning`,v:`var(--warning)`},{name:`danger`,v:`var(--danger)`},{name:`ice`,v:`var(--ice)`},{name:`muted`,v:`var(--fg-muted)`}].map(({name:e,v:t})=>(0,s.jsxs)(`span`,{style:{display:`inline-flex`,flexDirection:`column`,alignItems:`center`,gap:10},children:[(0,s.jsx)(i,{size:`md`,color:t}),(0,s.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:e})]},e))})},p={args:{variant:`dots`,size:`md`}},m={args:{variant:`bars`,size:`md`}},h={render:()=>{let[e,t]=o.useState(!1),n=()=>{t(!0),setTimeout(()=>t(!1),2e3)};return(0,s.jsxs)(`div`,{style:{display:`flex`,gap:10,alignItems:`center`,flexWrap:`wrap`},children:[(0,s.jsxs)(`button`,{className:`btn ember`,disabled:e,"aria-busy":e,onClick:n,style:{display:`inline-flex`,alignItems:`center`,gap:6},children:[e&&(0,s.jsx)(i,{size:14,color:`#08090A`,"aria-label":`Deploying`}),e?`Deploying…`:`Deploy`]}),(0,s.jsxs)(`button`,{className:`btn outline`,disabled:e,"aria-busy":e,onClick:n,style:{display:`inline-flex`,alignItems:`center`,gap:6},children:[e&&(0,s.jsx)(i,{size:14}),e?`Saving…`:`Save draft`]}),(0,s.jsxs)(`span`,{className:`pill`,style:{display:`inline-flex`,alignItems:`center`,gap:5},children:[(0,s.jsx)(i,{size:10,variant:`dots`}),`Syncing`]})]})}},g={render:()=>(0,s.jsxs)(`div`,{dir:`rtl`,style:{display:`flex`,gap:10,alignItems:`center`,flexWrap:`wrap`},children:[(0,s.jsxs)(`button`,{className:`btn ember`,style:{display:`inline-flex`,alignItems:`center`,gap:6},children:[(0,s.jsx)(i,{size:14,color:`#08090A`}),`جاري النشر…`]}),(0,s.jsxs)(`span`,{className:`pill`,style:{display:`inline-flex`,alignItems:`center`,gap:5},children:[(0,s.jsx)(i,{size:10,variant:`dots`}),`قيد المزامنة`]}),(0,s.jsxs)(`span`,{style:{display:`inline-flex`,alignItems:`center`,gap:8,color:`var(--fg-muted)`,fontSize:`var(--text-base)`},children:[(0,s.jsx)(i,{size:14}),`تحميل البيانات…`]})]})},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source},description:{story:`Default — ring, md, inherits color from parent.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 32,
    alignItems: 'center'
  }}>
      {(['ring', 'dots', 'bars'] as const).map(variant => <span key={variant} style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10
    }}>
          <Spinner variant={variant} size="md" />
          <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)'
      }}>{variant}</code>
        </span>)}
    </div>
}`,...u.parameters?.docs?.source},description:{story:`Three visual variants side by side.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 28,
    alignItems: 'flex-end'
  }}>
      {([['sm', 12], ['md', 16], ['lg', 24], [40, 40]] as const).map(([label, s]) => <span key={label} style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10
    }}>
          <Spinner variant="ring" size={s as 'sm' | 'md' | 'lg' | number} />
          <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)'
      }}>
            {typeof label === 'number' ? \`\${label}px\` : label}
          </code>
        </span>)}
    </div>
}`,...d.parameters?.docs?.source},description:{story:`Named sizes (sm / md / lg) and a custom numeric size.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 24,
    alignItems: 'center',
    flexWrap: 'wrap'
  }}>
      {[{
      name: 'ember',
      v: 'var(--ember)'
    }, {
      name: 'success',
      v: 'var(--success)'
    }, {
      name: 'warning',
      v: 'var(--warning)'
    }, {
      name: 'danger',
      v: 'var(--danger)'
    }, {
      name: 'ice',
      v: 'var(--ice)'
    }, {
      name: 'muted',
      v: 'var(--fg-muted)'
    }].map(({
      name,
      v
    }) => <span key={name} style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10
    }}>
          <Spinner size="md" color={v} />
          <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)'
      }}>{name}</code>
        </span>)}
    </div>
}`,...f.parameters?.docs?.source},description:{story:`Color is just currentColor — wrap in a colored span or pass the color prop.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'dots',
    size: 'md'
  }
}`,...p.parameters?.docs?.source},description:{story:`Dots variant — best for inline body text.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'bars',
    size: 'md'
  }
}`,...m.parameters?.docs?.source},description:{story:`Bars variant — media / equalizer context.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [loading, setLoading] = React.useState(false);
    const trigger = () => {
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
    };
    return <div style={{
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
        <button className="btn ember" disabled={loading} aria-busy={loading} onClick={trigger} style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6
      }}>
          {loading && <Spinner size={14} color="#08090A" aria-label="Deploying" />}
          {loading ? 'Deploying…' : 'Deploy'}
        </button>
        <button className="btn outline" disabled={loading} aria-busy={loading} onClick={trigger} style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6
      }}>
          {loading && <Spinner size={14} />}
          {loading ? 'Saving…' : 'Save draft'}
        </button>
        <span className="pill" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5
      }}>
          <Spinner size={10} variant="dots" />
          Syncing
        </span>
      </div>;
  }
}`,...h.parameters?.docs?.source},description:{story:`In context — inside a button. Click to see the loading transition.
The button is disabled while loading; focus is preserved.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div dir="rtl" style={{
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    flexWrap: 'wrap'
  }}>
      <button className="btn ember" style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }}>
        <Spinner size={14} color="#08090A" />
        جاري النشر…
      </button>
      <span className="pill" style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5
    }}>
        <Spinner size={10} variant="dots" />
        قيد المزامنة
      </span>
      <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      color: 'var(--fg-muted)',
      fontSize: 'var(--text-base)'
    }}>
        <Spinner size={14} />
        تحميل البيانات…
      </span>
    </div>
}`,...g.parameters?.docs?.source},description:{story:`RTL — spinners are visually symmetric; the layout around them mirrors.`,...g.parameters?.docs?.description}}},_=[`Default`,`AllVariants`,`Sizes`,`Colors`,`Dots`,`Bars`,`InContext`,`RTL`]}))();export{u as AllVariants,m as Bars,f as Colors,l as Default,p as Dots,h as InContext,g as RTL,d as Sizes,_ as __namedExportsOrder,c as default};