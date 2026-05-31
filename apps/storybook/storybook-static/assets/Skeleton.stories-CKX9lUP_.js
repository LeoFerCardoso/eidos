import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{D as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h,g;e((()=>{o=t(n(),1),a(),s=r(),c={title:`Primitives/Skeleton`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:"General-purpose loading placeholder. Three shape variants (line / box / circle), flexible sizing, and a multi-line mode for streaming-content placeholders. Skeletons are decorative (aria-hidden); add `label` for a screen-reader announcement. The shimmer sweep stops under `prefers-reduced-motion`."}}},args:{variant:`line`,width:220},argTypes:{variant:{control:`inline-radio`,options:[`line`,`box`,`circle`]},width:{control:`text`},height:{control:`text`},size:{control:`number`},lines:{control:`number`},radius:{control:`text`},label:{control:`text`}}},l={},u={name:`Variants`,render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:24,maxWidth:400},children:[(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`,display:`block`,marginBottom:8},children:`variant="line"`}),(0,s.jsx)(i,{variant:`line`,width:280})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsxs)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`,display:`block`,marginBottom:8},children:[`variant="box" width=`,200,` height=`,120]}),(0,s.jsx)(i,{variant:`box`,width:200,height:120})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsxs)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`,display:`block`,marginBottom:8},children:[`variant="circle" size=`,40]}),(0,s.jsx)(i,{variant:`circle`,size:40})]})]})},d={name:`Lines (multi-line)`,render:()=>(0,s.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:32,maxWidth:480},children:[2,3,5].map(e=>(0,s.jsxs)(`div`,{children:[(0,s.jsxs)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`,display:`block`,marginBottom:8},children:[`lines=`,e]}),(0,s.jsx)(i,{variant:`line`,lines:e})]},e))})},f={name:`Sizes`,render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:16,maxWidth:480},children:[(0,s.jsx)(i,{variant:`line`,width:`80%`,height:24}),(0,s.jsx)(i,{variant:`line`,width:140}),(0,s.jsx)(i,{variant:`box`,width:64,height:64}),(0,s.jsx)(`div`,{style:{display:`flex`,gap:12,alignItems:`center`},children:[20,32,48,64].map(e=>(0,s.jsx)(i,{variant:`circle`,size:e},e))})]})},p={name:`In context — card placeholder`,render:()=>{let[e,t]=o.useState(!1);return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:16,maxWidth:360},children:[(0,s.jsx)(`button`,{className:`btn sm`,onClick:()=>{t(!1),setTimeout(()=>t(!0),1800)},style:{alignSelf:`flex-start`,display:`inline-flex`,alignItems:`center`,gap:6},children:`↺ Reload`}),(0,s.jsx)(`div`,{className:`surface`,style:{padding:16,borderRadius:10,border:`1px solid var(--border)`},"aria-live":`polite`,"aria-busy":!e,children:e?(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:12},children:[(0,s.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:12},children:[(0,s.jsx)(`span`,{className:`avatar md ember`,children:`LF`}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`div`,{style:{fontWeight:600,color:`var(--fg)`,fontSize:`var(--text-base)`},children:`Layla Faraj`}),(0,s.jsx)(`div`,{style:{color:`var(--fg-muted)`,fontSize:`var(--text-sm)`},children:`Lead designer · Forge core`})]})]}),(0,s.jsx)(`p`,{style:{margin:0,color:`var(--fg-muted)`,fontSize:`var(--text-sm)`,lineHeight:1.6},children:`Owns the token layer and the chart primitives. Last pushed 2 h ago.`})]}):(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:12},children:[(0,s.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:12},children:[(0,s.jsx)(i,{variant:`circle`,size:40,label:`Loading profile`}),(0,s.jsxs)(`div`,{style:{flex:1,display:`flex`,flexDirection:`column`,gap:6},children:[(0,s.jsx)(i,{variant:`line`,width:140}),(0,s.jsx)(i,{variant:`line`,width:200})]})]}),(0,s.jsx)(i,{variant:`line`,lines:3})]})})]})}},m={name:`RTL`,render:()=>(0,s.jsx)(`div`,{dir:`rtl`,style:{display:`flex`,flexDirection:`column`,gap:14,maxWidth:420},children:Array.from({length:4}).map((e,t)=>(0,s.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:12},children:[(0,s.jsx)(i,{variant:`circle`,size:36}),(0,s.jsxs)(`div`,{style:{flex:1,display:`flex`,flexDirection:`column`,gap:6},children:[(0,s.jsx)(i,{variant:`line`,width:140}),(0,s.jsx)(i,{variant:`line`,width:220})]}),(0,s.jsx)(i,{variant:`line`,width:56,height:20})]},t))})},h={name:`Reduced motion`,render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:12,maxWidth:360},children:[(0,s.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:`@media (prefers-reduced-motion: reduce) → animation: none`}),(0,s.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:12},children:[(0,s.jsx)(i,{variant:`circle`,size:40}),(0,s.jsxs)(`div`,{style:{flex:1,display:`flex`,flexDirection:`column`,gap:6},children:[(0,s.jsx)(i,{variant:`line`,width:180}),(0,s.jsx)(i,{variant:`line`,width:120})]})]}),(0,s.jsx)(i,{variant:`line`,lines:3}),(0,s.jsx)(i,{variant:`box`,width:`100%`,height:80})]}),parameters:{chromatic:{prefersReducedMotion:`reduce`}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source},description:{story:`Default — a single line shimmer at 220 px.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: 'Variants',
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    maxWidth: 400
  }}>
      <div>
        <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)',
        display: 'block',
        marginBottom: 8
      }}>
          variant="line"
        </code>
        <Skeleton variant="line" width={280} />
      </div>
      <div>
        <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)',
        display: 'block',
        marginBottom: 8
      }}>
          variant="box" width={200} height={120}
        </code>
        <Skeleton variant="box" width={200} height={120} />
      </div>
      <div>
        <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)',
        display: 'block',
        marginBottom: 8
      }}>
          variant="circle" size={40}
        </code>
        <Skeleton variant="circle" size={40} />
      </div>
    </div>
}`,...u.parameters?.docs?.source},description:{story:`Three variants side by side: line, box, circle.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: 'Lines (multi-line)',
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
    maxWidth: 480
  }}>
      {([2, 3, 5] as const).map(n => <div key={n}>
          <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)',
        display: 'block',
        marginBottom: 8
      }}>
            lines={n}
          </code>
          <Skeleton variant="line" lines={n} />
        </div>)}
    </div>
}`,...d.parameters?.docs?.source},description:{story:`Multi-line mode — N stacked bars, last one shorter (covers AI streaming placeholder).`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: 'Sizes',
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    maxWidth: 480
  }}>
      <Skeleton variant="line" width="80%" height={24} />
      <Skeleton variant="line" width={140} />
      <Skeleton variant="box" width={64} height={64} />
      <div style={{
      display: 'flex',
      gap: 12,
      alignItems: 'center'
    }}>
        {[20, 32, 48, 64].map(s => <Skeleton key={s} variant="circle" size={s} />)}
      </div>
    </div>
}`,...f.parameters?.docs?.source},description:{story:`Custom sizes — any width × height combination.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: 'In context — card placeholder',
  render: () => {
    const [loaded, setLoaded] = React.useState(false);
    const reload = () => {
      setLoaded(false);
      setTimeout(() => setLoaded(true), 1800);
    };
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      maxWidth: 360
    }}>
        <button className="btn sm" onClick={reload} style={{
        alignSelf: 'flex-start',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6
      }}>
          ↺ Reload
        </button>
        <div className="surface" style={{
        padding: 16,
        borderRadius: 10,
        border: '1px solid var(--border)'
      }} aria-live="polite" aria-busy={!loaded}>
          {loaded ? <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}>
              <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
                <span className="avatar md ember">LF</span>
                <div>
                  <div style={{
                fontWeight: 600,
                color: 'var(--fg)',
                fontSize: 'var(--text-base)'
              }}>Layla Faraj</div>
                  <div style={{
                color: 'var(--fg-muted)',
                fontSize: 'var(--text-sm)'
              }}>Lead designer · Forge core</div>
                </div>
              </div>
              <p style={{
            margin: 0,
            color: 'var(--fg-muted)',
            fontSize: 'var(--text-sm)',
            lineHeight: 1.6
          }}>
                Owns the token layer and the chart primitives. Last pushed 2 h ago.
              </p>
            </div> : <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}>
              <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
                <Skeleton variant="circle" size={40} label="Loading profile" />
                <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 6
            }}>
                  <Skeleton variant="line" width={140} />
                  <Skeleton variant="line" width={200} />
                </div>
              </div>
              <Skeleton variant="line" lines={3} />
            </div>}
        </div>
      </div>;
  }
}`,...p.parameters?.docs?.source},description:{story:`In context — a card + profile placeholder showing the skeleton matching the eventual layout.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: 'RTL',
  render: () => <div dir="rtl" style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    maxWidth: 420
  }}>
      {Array.from({
      length: 4
    }).map((_, i) => <div key={i} style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }}>
          <Skeleton variant="circle" size={36} />
          <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }}>
            <Skeleton variant="line" width={140} />
            <Skeleton variant="line" width={220} />
          </div>
          <Skeleton variant="line" width={56} height={20} />
        </div>)}
    </div>
}`,...m.parameters?.docs?.source},description:{story:`RTL — flex direction and logical gap handle mirroring; shimmer gradient is direction-neutral.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: 'Reduced motion',
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    maxWidth: 360
  }}>
      <code style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--fg-muted)'
    }}>
        @media (prefers-reduced-motion: reduce) → animation: none
      </code>
      <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }}>
        <Skeleton variant="circle" size={40} />
        <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }}>
          <Skeleton variant="line" width={180} />
          <Skeleton variant="line" width={120} />
        </div>
      </div>
      <Skeleton variant="line" lines={3} />
      <Skeleton variant="box" width="100%" height={80} />
    </div>,
  parameters: {
    chromatic: {
      prefersReducedMotion: 'reduce'
    }
  }
}`,...h.parameters?.docs?.source},description:{story:`Reduced motion — shimmer stops; placeholder rests as a flat tinted block.
 Storybook wraps the story in a \`prefers-reduced-motion: reduce\` media query
 when the "Reduced motion" addon is enabled.`,...h.parameters?.docs?.description}}},g=[`Default`,`Variants`,`Lines`,`Sizes`,`InContext`,`RTL`,`ReducedMotion`]}))();export{l as Default,p as InContext,d as Lines,m as RTL,h as ReducedMotion,f as Sizes,u as Variants,g as __namedExportsOrder,c as default};