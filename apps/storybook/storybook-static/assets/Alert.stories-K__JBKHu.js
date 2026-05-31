import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{F as i,I as a,L as o,N as s,P as c,R as l,t as u}from"./src-DgoylXRw.js";var d,f,p,m,h,g,_,v,y,b,x,S,C;e((()=>{d=t(n(),1),u(),f=r(),p={title:`Primitives/Alert`,component:s,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:'Inline feedback box (NOT a toast). Compound: Alert > AlertTitle + AlertDescription + optional AlertMeta / AlertExtra / AlertActions. Danger/warning use `role="alert"` (assertive); the rest use `role="status"` (polite).'}}},args:{tone:`info`},argTypes:{tone:{control:`inline-radio`,options:[`neutral`,`info`,`success`,`warning`,`danger`]},onDismiss:{action:`dismissed`}}},m={render:e=>(0,f.jsxs)(s,{...e,children:[(0,f.jsx)(l,{children:`Heads up`}),(0,f.jsx)(i,{children:`A new Tailwind preset is available. Update @forge/design-system to v1.1.`})]})},h={render:()=>(0,f.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:12},children:[(0,f.jsxs)(s,{tone:`neutral`,children:[(0,f.jsx)(l,{children:`A new component catalog page is live`}),(0,f.jsx)(i,{children:`Open it from the Get Started group in the sidebar — no new behaviour, just easier to find.`})]}),(0,f.jsxs)(s,{tone:`info`,children:[(0,f.jsx)(l,{children:`Heads up`}),(0,f.jsx)(i,{children:`A new Tailwind preset is available. Update @forge/design-system to v1.1.`})]}),(0,f.jsxs)(s,{tone:`success`,children:[(0,f.jsx)(l,{children:`Deployment succeeded`}),(0,f.jsx)(i,{children:`forge-api v2.14.0 rolled out to all regions in 4m 12s.`})]}),(0,f.jsxs)(s,{tone:`warning`,children:[(0,f.jsx)(l,{children:`Approaching quota`}),(0,f.jsx)(i,{children:`You have used 84% of this month's deploy budget.`})]}),(0,f.jsxs)(s,{tone:`danger`,children:[(0,f.jsx)(l,{children:`Rollback required`}),(0,f.jsx)(i,{children:`Health checks are failing on 3/8 instances. The deploy will revert in 90 seconds unless paused.`})]})]})},g={render:()=>{let[e,t]=d.useState(!0);return e?(0,f.jsxs)(s,{tone:`info`,onDismiss:()=>t(!1),children:[(0,f.jsx)(l,{children:`New: components catalog`}),(0,f.jsx)(i,{children:`The full list is now its own page. Open from the sidebar.`})]}):(0,f.jsx)(`button`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-muted)`,cursor:`pointer`},onClick:()=>t(!0),children:`Restore alert`})}},_={render:()=>(0,f.jsxs)(s,{tone:`warning`,children:[(0,f.jsx)(l,{children:`Unsaved changes`}),(0,f.jsx)(i,{children:`You have edits that have not been published.`}),(0,f.jsxs)(c,{children:[(0,f.jsx)(`button`,{className:`btn xs ember`,children:`Publish`}),(0,f.jsx)(`button`,{className:`btn xs ghost`,children:`Discard`})]})]})},v={render:()=>(0,f.jsxs)(s,{tone:`danger`,children:[(0,f.jsx)(l,{children:`Auth provider unavailable`}),(0,f.jsx)(i,{children:`Elevated error rates upstream. Sign-in flows are degraded.`}),(0,f.jsxs)(o,{children:[(0,f.jsxs)(`span`,{className:`pill danger`,children:[(0,f.jsx)(`span`,{className:`dot`}),`offline · 4m`]}),(0,f.jsx)(`span`,{className:`req-id`,children:`req-id: 0a9e21`})]})]})},y={render:()=>(0,f.jsxs)(s,{tone:`warning`,children:[(0,f.jsx)(l,{children:`Disk usage critical`}),(0,f.jsx)(i,{children:`Compaction will pause if free space drops below 5%.`}),(0,f.jsxs)(a,{children:[(0,f.jsxs)(`div`,{className:`prog warning`,children:[(0,f.jsxs)(`div`,{className:`prog-head`,children:[(0,f.jsx)(`span`,{className:`label`,children:`used`}),(0,f.jsx)(`span`,{className:`pct`,children:`92 / 100 GB`})]}),(0,f.jsx)(`div`,{className:`prog-track`,children:(0,f.jsx)(`div`,{className:`prog-fill`,style:{width:`92%`}})})]}),(0,f.jsxs)(`div`,{className:`breakdown`,children:[(0,f.jsx)(`span`,{children:`index: 58 GB`}),(0,f.jsx)(`span`,{children:`logs: 22 GB`}),(0,f.jsx)(`span`,{children:`snapshots: 12 GB`})]})]}),(0,f.jsxs)(c,{children:[(0,f.jsx)(`button`,{className:`btn xs ember`,children:`Run cleanup`}),(0,f.jsx)(`button`,{className:`btn xs outline`,children:`Open volume`})]})]})},b={render:()=>{let[e,t]=d.useState(38);return d.useEffect(()=>{if(e<=0)return;let n=setTimeout(()=>t(e=>e-1),1e3);return()=>clearTimeout(n)},[e]),(0,f.jsxs)(s,{tone:`warning`,children:[(0,f.jsxs)(l,{children:[`Retry in `,e,`s`]}),(0,f.jsx)(i,{children:`You have hit the per-minute prompt limit. The window resets every 60s.`}),(0,f.jsxs)(o,{children:[(0,f.jsxs)(`span`,{className:`pill warning`,children:[(0,f.jsx)(`span`,{className:`dot`}),`rate-limited`]}),(0,f.jsx)(`span`,{className:`mono`,children:`limit: 40 req/min · used 41`})]}),(0,f.jsx)(a,{children:(0,f.jsxs)(`div`,{className:`prog warning`,children:[(0,f.jsxs)(`div`,{className:`prog-head`,children:[(0,f.jsx)(`span`,{className:`label`,children:`minute window`}),(0,f.jsxs)(`span`,{className:`pct`,children:[e,`s remaining`]})]}),(0,f.jsx)(`div`,{className:`prog-track`,children:(0,f.jsx)(`div`,{className:`prog-fill`,style:{width:`${Math.round(e/60*100)}%`}})})]})}),(0,f.jsxs)(c,{children:[(0,f.jsx)(`button`,{className:`btn xs outline`,disabled:!0,children:`Retry now`}),(0,f.jsx)(`button`,{className:`btn xs ghost`,children:`Trim prompt (-1.4k tokens)`})]})]})}},x={render:()=>(0,f.jsxs)(`div`,{dir:`rtl`,style:{display:`flex`,flexDirection:`column`,gap:12},children:[(0,f.jsxs)(s,{tone:`info`,onDismiss:()=>{},children:[(0,f.jsx)(l,{children:`إعداد Tailwind جديد متاح`}),(0,f.jsx)(i,{children:`حدّث @forge/design-system إلى الإصدار 1.1 للحصول على جميع المكونات الجديدة.`})]}),(0,f.jsxs)(s,{tone:`warning`,children:[(0,f.jsx)(l,{children:`تغييرات غير محفوظة`}),(0,f.jsx)(i,{children:`لديك تعديلات لم تُنشر بعد.`}),(0,f.jsxs)(c,{children:[(0,f.jsx)(`button`,{className:`btn xs ember`,children:`نشر`}),(0,f.jsx)(`button`,{className:`btn xs ghost`,children:`تجاهل`})]})]})]})},S={render:()=>(0,f.jsxs)(`div`,{className:`surface`,style:{padding:24,borderRadius:10,maxWidth:540},children:[(0,f.jsx)(`div`,{style:{fontWeight:600,fontSize:`var(--text-base)`,marginBottom:16},children:`Deployment settings`}),(0,f.jsxs)(s,{tone:`danger`,style:{marginBottom:16},children:[(0,f.jsx)(l,{children:`Rollback required`}),(0,f.jsx)(i,{children:`Health checks are failing on 3/8 instances. The deploy will revert in 90 seconds unless paused.`}),(0,f.jsxs)(c,{children:[(0,f.jsx)(`button`,{className:`btn xs outline`,children:`Pause rollback`}),(0,f.jsx)(`button`,{className:`btn xs ghost`,children:`View logs`})]})]}),(0,f.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:10},children:[(0,f.jsx)(`div`,{className:`surface`,style:{padding:`8px 12px`,borderRadius:6,fontSize:`var(--text-sm)`,color:`var(--fg-muted)`},children:`Region: us-east-1`}),(0,f.jsx)(`div`,{className:`surface`,style:{padding:`8px 12px`,borderRadius:6,fontSize:`var(--text-sm)`,color:`var(--fg-muted)`},children:`Instance type: m5.large`})]})]})},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <Alert {...args}>
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>A new Tailwind preset is available. Update @forge/design-system to v1.1.</AlertDescription>
    </Alert>
}`,...m.parameters?.docs?.source},description:{story:`Default (info) alert with title and description.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  }}>
      <Alert tone="neutral">
        <AlertTitle>A new component catalog page is live</AlertTitle>
        <AlertDescription>Open it from the Get Started group in the sidebar — no new behaviour, just easier to find.</AlertDescription>
      </Alert>
      <Alert tone="info">
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>A new Tailwind preset is available. Update @forge/design-system to v1.1.</AlertDescription>
      </Alert>
      <Alert tone="success">
        <AlertTitle>Deployment succeeded</AlertTitle>
        <AlertDescription>forge-api v2.14.0 rolled out to all regions in 4m 12s.</AlertDescription>
      </Alert>
      <Alert tone="warning">
        <AlertTitle>Approaching quota</AlertTitle>
        <AlertDescription>You have used 84% of this month's deploy budget.</AlertDescription>
      </Alert>
      <Alert tone="danger">
        <AlertTitle>Rollback required</AlertTitle>
        <AlertDescription>Health checks are failing on 3/8 instances. The deploy will revert in 90 seconds unless paused.</AlertDescription>
      </Alert>
    </div>
}`,...h.parameters?.docs?.source},description:{story:`All five tones in a stack.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [visible, setVisible] = React.useState(true);
    return visible ? <Alert tone="info" onDismiss={() => setVisible(false)}>
        <AlertTitle>New: components catalog</AlertTitle>
        <AlertDescription>The full list is now its own page. Open from the sidebar.</AlertDescription>
      </Alert> : <button style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--fg-muted)',
      cursor: 'pointer'
    }} onClick={() => setVisible(true)}>
        Restore alert
      </button>;
  }
}`,...g.parameters?.docs?.source},description:{story:`Dismissible — renders a close button at the trailing edge.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <Alert tone="warning">
      <AlertTitle>Unsaved changes</AlertTitle>
      <AlertDescription>You have edits that have not been published.</AlertDescription>
      <AlertActions>
        <button className="btn xs ember">Publish</button>
        <button className="btn xs ghost">Discard</button>
      </AlertActions>
    </Alert>
}`,..._.parameters?.docs?.source},description:{story:`With inline action buttons.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <Alert tone="danger">
      <AlertTitle>Auth provider unavailable</AlertTitle>
      <AlertDescription>Elevated error rates upstream. Sign-in flows are degraded.</AlertDescription>
      <AlertMeta>
        <span className="pill danger"><span className="dot" />offline · 4m</span>
        <span className="req-id">req-id: 0a9e21</span>
      </AlertMeta>
    </Alert>
}`,...v.parameters?.docs?.source},description:{story:`With a status meta row (pill + request id).`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <Alert tone="warning">
      <AlertTitle>Disk usage critical</AlertTitle>
      <AlertDescription>Compaction will pause if free space drops below 5%.</AlertDescription>
      <AlertExtra>
        <div className="prog warning">
          <div className="prog-head">
            <span className="label">used</span>
            <span className="pct">92 / 100 GB</span>
          </div>
          <div className="prog-track"><div className="prog-fill" style={{
            width: '92%'
          }} /></div>
        </div>
        <div className="breakdown">
          <span>index: 58 GB</span>
          <span>logs: 22 GB</span>
          <span>snapshots: 12 GB</span>
        </div>
      </AlertExtra>
      <AlertActions>
        <button className="btn xs ember">Run cleanup</button>
        <button className="btn xs outline">Open volume</button>
      </AlertActions>
    </Alert>
}`,...y.parameters?.docs?.source},description:{story:`With a diagnostic extra slot (progress bar + breakdown).`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [seconds, setSeconds] = React.useState(38);
    React.useEffect(() => {
      if (seconds <= 0) return;
      const t = setTimeout(() => setSeconds(s => s - 1), 1000);
      return () => clearTimeout(t);
    }, [seconds]);
    return <Alert tone="warning">
        <AlertTitle>Retry in {seconds}s</AlertTitle>
        <AlertDescription>You have hit the per-minute prompt limit. The window resets every 60s.</AlertDescription>
        <AlertMeta>
          <span className="pill warning"><span className="dot" />rate-limited</span>
          <span className="mono">limit: 40 req/min · used 41</span>
        </AlertMeta>
        <AlertExtra>
          <div className="prog warning">
            <div className="prog-head">
              <span className="label">minute window</span>
              <span className="pct">{seconds}s remaining</span>
            </div>
            <div className="prog-track">
              <div className="prog-fill" style={{
              width: \`\${Math.round(seconds / 60 * 100)}%\`
            }} />
            </div>
          </div>
        </AlertExtra>
        <AlertActions>
          <button className="btn xs outline" disabled>Retry now</button>
          <button className="btn xs ghost">Trim prompt (-1.4k tokens)</button>
        </AlertActions>
      </Alert>;
  }
}`,...b.parameters?.docs?.source},description:{story:`Full composition — every slot at once.`,...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <div dir="rtl" style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  }}>
      <Alert tone="info" onDismiss={() => {}}>
        <AlertTitle>إعداد Tailwind جديد متاح</AlertTitle>
        <AlertDescription>حدّث @forge/design-system إلى الإصدار 1.1 للحصول على جميع المكونات الجديدة.</AlertDescription>
      </Alert>
      <Alert tone="warning">
        <AlertTitle>تغييرات غير محفوظة</AlertTitle>
        <AlertDescription>لديك تعديلات لم تُنشر بعد.</AlertDescription>
        <AlertActions>
          <button className="btn xs ember">نشر</button>
          <button className="btn xs ghost">تجاهل</button>
        </AlertActions>
      </Alert>
    </div>
}`,...x.parameters?.docs?.source},description:{story:`RTL — icon moves to the start (right), dismiss to the end (left).`,...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <div className="surface" style={{
    padding: 24,
    borderRadius: 10,
    maxWidth: 540
  }}>
      <div style={{
      fontWeight: 600,
      fontSize: 'var(--text-base)',
      marginBottom: 16
    }}>
        Deployment settings
      </div>
      <Alert tone="danger" style={{
      marginBottom: 16
    }}>
        <AlertTitle>Rollback required</AlertTitle>
        <AlertDescription>Health checks are failing on 3/8 instances. The deploy will revert in 90 seconds unless paused.</AlertDescription>
        <AlertActions>
          <button className="btn xs outline">Pause rollback</button>
          <button className="btn xs ghost">View logs</button>
        </AlertActions>
      </Alert>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }}>
        <div className="surface" style={{
        padding: '8px 12px',
        borderRadius: 6,
        fontSize: 'var(--text-sm)',
        color: 'var(--fg-muted)'
      }}>
          Region: us-east-1
        </div>
        <div className="surface" style={{
        padding: '8px 12px',
        borderRadius: 6,
        fontSize: 'var(--text-sm)',
        color: 'var(--fg-muted)'
      }}>
          Instance type: m5.large
        </div>
      </div>
    </div>
}`,...S.parameters?.docs?.source},description:{story:`In context — alert used inside a settings card layout.`,...S.parameters?.docs?.description}}},C=[`Default`,`AllTones`,`Dismissible`,`WithActions`,`WithMeta`,`WithExtra`,`FullComposition`,`RTL`,`InContext`]}))();export{h as AllTones,m as Default,g as Dismissible,b as FullComposition,S as InContext,x as RTL,_ as WithActions,y as WithExtra,v as WithMeta,C as __namedExportsOrder,p as default};