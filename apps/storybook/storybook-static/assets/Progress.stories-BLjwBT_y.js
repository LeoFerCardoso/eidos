import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{j as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h,g,_,v,y,b;e((()=>{o=t(n(),1),a(),s=r(),c={title:`Primitives/Progress`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:`Linear bar, circular ring, and segmented stepper. Determinate (value/max) or indeterminate (no value). All visuals live in ds.css under the .prog-* namespace so Alert, AI errors, and table footers all compose the same primitive.`}}},args:{value:64,max:100,size:`sm`,status:`primary`,label:`Building identity-svc`},argTypes:{variant:{control:`inline-radio`,options:[`linear`,`circular`]},status:{control:`inline-radio`,options:[`primary`,`success`,`warning`,`danger`,`neutral`]},size:{control:`inline-radio`,options:[`xs`,`sm`,`md`,`lg`]},value:{control:{type:`range`,min:0,max:100,step:1}},indeterminate:{control:`boolean`},striped:{control:`boolean`}}},l={},u={render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:22,maxWidth:460},children:[(0,s.jsx)(i,{value:45,size:`xs`,label:`xs · 2px`}),(0,s.jsx)(i,{value:62,size:`sm`,label:`sm · 4px (default)`}),(0,s.jsx)(i,{value:78,size:`md`,label:`md · 6px`}),(0,s.jsx)(i,{value:36,size:`lg`,label:`lg · 10px`})]})},d={render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:22,maxWidth:460},children:[(0,s.jsx)(i,{value:72,status:`primary`,label:`In progress`,sub:`default · ember`}),(0,s.jsx)(i,{value:100,status:`success`,label:`Completed`,sub:`success · all checks passed`}),(0,s.jsx)(i,{value:92,status:`warning`,label:`Approaching quota`,sub:`warning · 92% of 100 GB`}),(0,s.jsx)(i,{value:100,status:`danger`,label:`Failed at step 4`,sub:`danger · transient retry`}),(0,s.jsx)(i,{value:42,status:`neutral`,label:`Paused`,sub:`neutral · awaiting approval`})]})},f={render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:22,maxWidth:460},children:[(0,s.jsx)(i,{label:`Querying remote registry`,sub:`response time unknown`}),(0,s.jsx)(i,{size:`md`,status:`neutral`,label:`Connecting to provider`,sub:`no progress contract from upstream`})]})},p={render:()=>(0,s.jsx)(i,{value:54,buffered:78,label:`Streaming to object store`,sub:`received 78 MB · confirmed 54 MB`}),decorators:[e=>(0,s.jsx)(`div`,{style:{maxWidth:460},children:(0,s.jsx)(e,{})})]},m={args:{value:67,striped:!0,size:`md`,label:`Encrypting backup`,sub:`14 GB of 21 GB`},decorators:[e=>(0,s.jsx)(`div`,{style:{maxWidth:460},children:(0,s.jsx)(e,{})})]},h={render:()=>(0,s.jsx)(i,{segments:[`Build`,`Test`,`Canary`,`Ring 3`,`Ring 4`],activeSegment:2,label:`Deploy ring 2 · canary running`,sub:`step 3 of 5`}),decorators:[e=>(0,s.jsx)(`div`,{style:{maxWidth:460},children:(0,s.jsx)(e,{})})]},g={render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:28,flexWrap:`wrap`},children:[(0,s.jsx)(i,{variant:`circular`,value:64,"aria-label":`64% complete`}),(0,s.jsx)(i,{variant:`circular`,value:92,status:`success`,"aria-label":`92% — success`}),(0,s.jsx)(i,{variant:`circular`,value:38,status:`warning`,"aria-label":`38% — warning`}),(0,s.jsx)(i,{variant:`circular`,value:12,status:`danger`,"aria-label":`12% — danger`}),(0,s.jsx)(i,{variant:`circular`,"aria-label":`Loading`}),(0,s.jsx)(i,{variant:`circular`,value:48,circleSize:80,strokeWidth:6,"aria-label":`48% — large`})]})},_={render:()=>{let[e,t]=o.useState(0);return o.useEffect(()=>{let e,n=performance.now(),r=6e3,i=a=>{let o=(a-n)%r;t(Math.round(o/r*100)),e=requestAnimationFrame(i)};return e=requestAnimationFrame(i),()=>cancelAnimationFrame(e)},[]),(0,s.jsx)(`div`,{style:{maxWidth:460},children:(0,s.jsx)(i,{value:e,label:`Building identity-svc`,sub:`compiling Go binaries`})})}},v={render:()=>(0,s.jsxs)(`div`,{style:{maxWidth:540},children:[(0,s.jsxs)(`div`,{className:`prog-row`,children:[(0,s.jsx)(`div`,{className:`ico`,style:{width:36,height:36,borderRadius:6,background:`var(--surface-hover)`,color:`var(--fg-muted)`,display:`inline-flex`,alignItems:`center`,justifyContent:`center`},children:(0,s.jsxs)(`svg`,{width:16,height:16,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:2,children:[(0,s.jsx)(`path`,{d:`M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z`}),(0,s.jsx)(`polyline`,{points:`14 2 14 8 20 8`})]})}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`div`,{className:`name`,style:{fontSize:13,fontWeight:500},children:`contracts-2026.pdf`}),(0,s.jsx)(`div`,{className:`meta`,style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-subtle)`,marginTop:2},children:`2.4 MB · uploading…`}),(0,s.jsx)(i,{value:67,size:`xs`,style:{marginTop:6},"aria-label":`67% uploaded`})]}),(0,s.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-muted)`,fontFeatureSettings:`'tnum'`},children:`67%`})]}),(0,s.jsxs)(`div`,{className:`prog-row`,style:{marginTop:8},children:[(0,s.jsx)(`div`,{className:`ico`,style:{width:36,height:36,borderRadius:6,background:`var(--surface-hover)`,color:`var(--fg-muted)`,display:`inline-flex`,alignItems:`center`,justifyContent:`center`},children:(0,s.jsxs)(`svg`,{width:16,height:16,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:2,children:[(0,s.jsx)(`path`,{d:`M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z`}),(0,s.jsx)(`polyline`,{points:`14 2 14 8 20 8`})]})}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`div`,{className:`name`,style:{fontSize:13,fontWeight:500},children:`audit-log-q3.csv`}),(0,s.jsx)(`div`,{className:`meta`,style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-subtle)`,marginTop:2},children:`1.1 MB · uploaded`}),(0,s.jsx)(i,{value:100,size:`xs`,status:`success`,style:{marginTop:6},"aria-label":`Upload complete`})]}),(0,s.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--success)`,fontFeatureSettings:`'tnum'`},children:`100%`})]})]})},y={render:()=>(0,s.jsxs)(`div`,{dir:`rtl`,style:{maxWidth:460,display:`flex`,flexDirection:`column`,gap:22},children:[(0,s.jsx)(i,{value:64,label:`جاري بناء identity-svc`,sub:`تجميع ثنائيات Go`}),(0,s.jsx)(i,{value:92,status:`success`,label:`اكتمل النسخ الاحتياطي`,sub:`٢١ غيغابايت`}),(0,s.jsx)(i,{label:`جارٍ الاتصال بمزود الخدمة`}),(0,s.jsx)(i,{segments:[`بناء`,`اختبار`,`كناري`,`حلقة 3`,`حلقة 4`],activeSegment:2,label:`حلقة النشر ٢`,sub:`الخطوة ٣ من ٥`})]})},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source},description:{story:`Default determinate bar driven by Storybook controls.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 22,
    maxWidth: 460
  }}>
      <Progress value={45} size="xs" label="xs · 2px" />
      <Progress value={62} size="sm" label="sm · 4px (default)" />
      <Progress value={78} size="md" label="md · 6px" />
      <Progress value={36} size="lg" label="lg · 10px" />
    </div>
}`,...u.parameters?.docs?.source},description:{story:`All four sizes side by side.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 22,
    maxWidth: 460
  }}>
      <Progress value={72} status="primary" label="In progress" sub="default · ember" />
      <Progress value={100} status="success" label="Completed" sub="success · all checks passed" />
      <Progress value={92} status="warning" label="Approaching quota" sub="warning · 92% of 100 GB" />
      <Progress value={100} status="danger" label="Failed at step 4" sub="danger · transient retry" />
      <Progress value={42} status="neutral" label="Paused" sub="neutral · awaiting approval" />
    </div>
}`,...d.parameters?.docs?.source},description:{story:`Every status tone.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 22,
    maxWidth: 460
  }}>
      <Progress label="Querying remote registry" sub="response time unknown" />
      <Progress size="md" status="neutral" label="Connecting to provider" sub="no progress contract from upstream" />
    </div>
}`,...f.parameters?.docs?.source},description:{story:`Indeterminate — animated slug for unknown durations.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <Progress value={54} buffered={78} label="Streaming to object store" sub="received 78 MB · confirmed 54 MB" />,
  decorators: [Story => <div style={{
    maxWidth: 460
  }}><Story /></div>]
}`,...p.parameters?.docs?.source},description:{story:`Buffer layer — received vs. confirmed (streaming uploads).`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    value: 67,
    striped: true,
    size: 'md',
    label: 'Encrypting backup',
    sub: '14 GB of 21 GB'
  },
  decorators: [Story => <div style={{
    maxWidth: 460
  }}><Story /></div>]
}`,...m.parameters?.docs?.source},description:{story:`Striped fill — motion cue for long-running uploads.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <Progress segments={['Build', 'Test', 'Canary', 'Ring 3', 'Ring 4']} activeSegment={2} label="Deploy ring 2 · canary running" sub="step 3 of 5" />,
  decorators: [Story => <div style={{
    maxWidth: 460
  }}><Story /></div>]
}`,...h.parameters?.docs?.source},description:{story:`Segmented stepper — discrete named phases.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 28,
    flexWrap: 'wrap'
  }}>
      <Progress variant="circular" value={64} aria-label="64% complete" />
      <Progress variant="circular" value={92} status="success" aria-label="92% — success" />
      <Progress variant="circular" value={38} status="warning" aria-label="38% — warning" />
      <Progress variant="circular" value={12} status="danger" aria-label="12% — danger" />
      <Progress variant="circular" aria-label="Loading" />
      <Progress variant="circular" value={48} circleSize={80} strokeWidth={6} aria-label="48% — large" />
    </div>
}`,...g.parameters?.docs?.source},description:{story:`Circular determinate — compact for tiles and dashboards.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [pct, setPct] = React.useState(0);
    React.useEffect(() => {
      let raf: number;
      let start = performance.now();
      const duration = 6000;
      const tick = (t: number) => {
        const elapsed = (t - start) % duration;
        const next = Math.round(elapsed / duration * 100);
        setPct(next);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, []);
    return <div style={{
      maxWidth: 460
    }}>
        <Progress value={pct} label="Building identity-svc" sub="compiling Go binaries" />
      </div>;
  }
}`,..._.parameters?.docs?.source},description:{story:`Live counter — simulates polling/websocket updates.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    maxWidth: 540
  }}>
      <div className="prog-row">
        <div className="ico" style={{
        width: 36,
        height: 36,
        borderRadius: 6,
        background: 'var(--surface-hover)',
        color: 'var(--fg-muted)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
        </div>
        <div>
          <div className="name" style={{
          fontSize: 13,
          fontWeight: 500
        }}>contracts-2026.pdf</div>
          <div className="meta" style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--fg-subtle)',
          marginTop: 2
        }}>2.4 MB · uploading…</div>
          <Progress value={67} size="xs" style={{
          marginTop: 6
        }} aria-label="67% uploaded" />
        </div>
        <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--fg-muted)',
        fontFeatureSettings: "'tnum'"
      }}>67%</span>
      </div>
      <div className="prog-row" style={{
      marginTop: 8
    }}>
        <div className="ico" style={{
        width: 36,
        height: 36,
        borderRadius: 6,
        background: 'var(--surface-hover)',
        color: 'var(--fg-muted)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
        </div>
        <div>
          <div className="name" style={{
          fontSize: 13,
          fontWeight: 500
        }}>audit-log-q3.csv</div>
          <div className="meta" style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--fg-subtle)',
          marginTop: 2
        }}>1.1 MB · uploaded</div>
          <Progress value={100} size="xs" status="success" style={{
          marginTop: 6
        }} aria-label="Upload complete" />
        </div>
        <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--success)',
        fontFeatureSettings: "'tnum'"
      }}>100%</span>
      </div>
    </div>
}`,...v.parameters?.docs?.source},description:{story:`File uploader — composed context row.`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <div dir="rtl" style={{
    maxWidth: 460,
    display: 'flex',
    flexDirection: 'column',
    gap: 22
  }}>
      <Progress value={64} label="جاري بناء identity-svc" sub="تجميع ثنائيات Go" />
      <Progress value={92} status="success" label="اكتمل النسخ الاحتياطي" sub="٢١ غيغابايت" />
      <Progress label="جارٍ الاتصال بمزود الخدمة" />
      <Progress segments={['بناء', 'اختبار', 'كناري', 'حلقة 3', 'حلقة 4']} activeSegment={2} label="حلقة النشر ٢" sub="الخطوة ٣ من ٥" />
    </div>
}`,...y.parameters?.docs?.source},description:{story:`RTL — bar fills from the trailing (right-to-left) edge.`,...y.parameters?.docs?.description}}},b=[`Default`,`Sizes`,`StatusTones`,`Indeterminate`,`Buffer`,`Striped`,`Segmented`,`Circular`,`LiveUpdates`,`InContext`,`RTL`]}))();export{p as Buffer,g as Circular,l as Default,v as InContext,f as Indeterminate,_ as LiveUpdates,y as RTL,h as Segmented,u as Sizes,d as StatusTones,m as Striped,b as __namedExportsOrder,c as default};