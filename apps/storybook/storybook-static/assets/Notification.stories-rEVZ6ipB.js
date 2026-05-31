import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Gt as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h;e((()=>{o=t(n(),1),a(),s=r(),c={title:`Overlays/Notification`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:`Presentational inline notification banner — renders in the normal document flow rather than a portal. Use it for persistent page-level alerts (quota warnings, degraded-service notices, required-action prompts). For ephemeral feedback tied to a user action, prefer Toaster + useToast() instead.`}}},argTypes:{tone:{control:`inline-radio`,options:[`default`,`info`,`success`,`warning`,`danger`]},title:{control:`text`},description:{control:`text`},dismissLabel:{control:`text`}}},l={render:()=>{let[e,t]=o.useState(!0);return(0,s.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:12,maxWidth:560},children:e?(0,s.jsx)(i,{tone:`info`,title:`Scheduled maintenance window`,description:`The API gateway will be read-only on 2026-06-04 02:00–04:00 UTC. No deploys will be processed during this window.`,action:{label:`View schedule`,onClick:()=>{}},onDismiss:()=>t(!1)}):(0,s.jsx)(`button`,{className:`btn ghost`,onClick:()=>t(!0),children:`Reset`})})}},u={render:()=>{let[e,t]=o.useState(new Set);return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:10,maxWidth:600},children:[[{tone:`default`,title:`Runbook updated`,description:`forge-api/deploy.md was last edited by lee@example.com 3 minutes ago.`},{tone:`info`,title:`New agent runtime available`,description:`Forge Agent Runtime v2.4.0 ships reduced cold-start latency. Opt in under Settings → Runtime.`},{tone:`success`,title:`Certificate renewed`,description:`TLS certificate for api.forge.internal renewed. Expires 2027-05-30.`},{tone:`warning`,title:`Quota at 91%`,description:`Your org has consumed 91 of 100 seat licences. Upgrade or remove inactive members.`},{tone:`danger`,title:`Webhook delivery failures`,description:`12 webhook events to orders.internal have failed in the last hour. Check endpoint health.`}].filter(t=>!e.has(t.tone)).map(e=>(0,s.jsx)(i,{tone:e.tone,title:e.title,description:e.description,onDismiss:()=>t(t=>new Set([...t,e.tone]))},e.tone)),e.size>0&&(0,s.jsx)(`button`,{className:`btn ghost`,onClick:()=>t(new Set),children:`Reset all`})]})}},d={render:()=>{let[e,t]=o.useState(null),[n,r]=o.useState(!0);return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:12,maxWidth:580},children:[n&&(0,s.jsx)(i,{tone:`warning`,title:`Deploy pipeline paused`,description:`The staging pipeline has been paused due to 3 consecutive test failures. Review the error log before resuming.`,action:{label:`View logs`,onClick:()=>t(`Navigating to deploy logs…`)},onDismiss:()=>r(!1)}),e&&(0,s.jsx)(`p`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-muted)`,margin:0},children:e}),!n&&(0,s.jsx)(`button`,{className:`btn ghost`,onClick:()=>{r(!0),t(null)},children:`Reset`})]})}},f={render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:10,maxWidth:580},children:[(0,s.jsx)(i,{tone:`danger`,title:`Billing suspended — service is read-only`,description:`Payment for the Pro plan failed on 2026-05-28. Update your payment method to restore write access.`,action:{label:`Update payment`,onClick:()=>{}}}),(0,s.jsx)(i,{tone:`warning`,title:`MFA not configured`,description:`Your organisation requires MFA for all members. You have 48 hours to set it up before access is restricted.`,action:{label:`Enable MFA`,onClick:()=>{}}})]})},p={render:()=>{let[e,t]=o.useState(!1);return(0,s.jsxs)(`div`,{className:`surface`,style:{padding:24,borderRadius:8,border:`1px solid var(--border-strong)`,maxWidth:540,display:`flex`,flexDirection:`column`,gap:20},children:[(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`div`,{style:{fontWeight:600,fontSize:16,marginBottom:2},children:`Service settings`}),(0,s.jsxs)(`div`,{style:{color:`var(--fg-muted)`,fontSize:13},children:[`forge-api `,`·`,` Region: us-east-1 `,`·`,` Runtime: node20`]})]}),!e&&(0,s.jsx)(i,{tone:`warning`,title:`Environment variable missing`,description:`FORGE_API_SECRET is referenced in 3 runbooks but not set for the production environment.`,action:{label:`Add variable`,onClick:()=>{}},onDismiss:()=>t(!0)}),(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:12},children:[(0,s.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`div`,{style:{fontSize:14,fontWeight:500},children:`Auto-deploy`}),(0,s.jsx)(`div`,{style:{fontSize:12,color:`var(--fg-muted)`},children:`Push to main triggers a deploy`})]}),(0,s.jsx)(`div`,{className:`badge success`,style:{fontFamily:`var(--font-mono)`,fontSize:11},children:`enabled`})]}),(0,s.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`div`,{style:{fontSize:14,fontWeight:500},children:`Health checks`}),(0,s.jsx)(`div`,{style:{fontSize:12,color:`var(--fg-muted)`},children:`GET /health every 30 s`})]}),(0,s.jsx)(`div`,{className:`badge success`,style:{fontFamily:`var(--font-mono)`,fontSize:11},children:`passing`})]})]}),e&&(0,s.jsx)(`button`,{className:`btn ghost`,style:{alignSelf:`flex-start`},onClick:()=>t(!1),children:`Reset notification`})]})}},m={render:()=>{let[e,t]=o.useState(new Set);return(0,s.jsxs)(`div`,{dir:`rtl`,style:{display:`flex`,flexDirection:`column`,gap:10,maxWidth:600},children:[[{tone:`success`,title:`تم نشر التحديث`,description:`الإصدار ۴.۱۹.۰ متاح الآن في جميع المناطق.`},{tone:`warning`,title:`الحصة وصلت إلى ۸۴٪`,description:`قم بالترقية أو انتظر حتى منتصف الليل (توقيت UTC) لإعادة الضبط.`,action:`ترقية الخطة`},{tone:`danger`,title:`فشل نشر الكود`,description:`جارٍ التراجع إلى الإصدار ۴.۱۸.۲ بسبب ۳ اختبارات فاشلة.`,action:`عرض السجلات`}].filter(t=>!e.has(t.tone)).map(e=>(0,s.jsx)(i,{tone:e.tone,title:e.title,description:e.description,action:e.action?{label:e.action,onClick:()=>{}}:void 0,onDismiss:()=>t(t=>new Set([...t,e.tone]))},e.tone)),e.size>0&&(0,s.jsx)(`button`,{className:`btn ghost`,onClick:()=>t(new Set),children:`إعادة الضبط`})]})}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [visible, setVisible] = React.useState(true);
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      maxWidth: 560
    }}>
        {visible ? <Notification tone="info" title="Scheduled maintenance window" description="The API gateway will be read-only on 2026-06-04 02:00–04:00 UTC. No deploys will be processed during this window." action={{
        label: 'View schedule',
        onClick: () => {}
      }} onDismiss={() => setVisible(false)} /> : <button className="btn ghost" onClick={() => setVisible(true)}>
            Reset
          </button>}
      </div>;
  }
}`,...l.parameters?.docs?.source},description:{story:`A dismissible info banner shown inline in a settings panel.
Click "Dismiss" to remove it; click "Reset" to restore it.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [dismissed, setDismissed] = React.useState<Set<string>>(new Set());
    const configs: Array<{
      tone: React.ComponentProps<typeof Notification>['tone'];
      title: string;
      description: string;
    }> = [{
      tone: 'default',
      title: 'Runbook updated',
      description: 'forge-api/deploy.md was last edited by lee@example.com 3 minutes ago.'
    }, {
      tone: 'info',
      title: 'New agent runtime available',
      description: 'Forge Agent Runtime v2.4.0 ships reduced cold-start latency. Opt in under Settings → Runtime.'
    }, {
      tone: 'success',
      title: 'Certificate renewed',
      description: 'TLS certificate for api.forge.internal renewed. Expires 2027-05-30.'
    }, {
      tone: 'warning',
      title: 'Quota at 91%',
      description: 'Your org has consumed 91 of 100 seat licences. Upgrade or remove inactive members.'
    }, {
      tone: 'danger',
      title: 'Webhook delivery failures',
      description: '12 webhook events to orders.internal have failed in the last hour. Check endpoint health.'
    }];
    const visible = configs.filter(c => !dismissed.has(c.tone as string));
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      maxWidth: 600
    }}>
        {visible.map(c => <Notification key={c.tone} tone={c.tone} title={c.title} description={c.description} onDismiss={() => setDismissed(s => new Set([...s, c.tone as string]))} />)}
        {dismissed.size > 0 && <button className="btn ghost" onClick={() => setDismissed(new Set())}>
            Reset all
          </button>}
      </div>;
  }
}`,...u.parameters?.docs?.source},description:{story:`All five tones rendered side by side — default, info, success, warning, danger.
Each banner is independently dismissible; click "Reset" to restore all.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [status, setStatus] = React.useState<string | null>(null);
    const [visible, setVisible] = React.useState(true);
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      maxWidth: 580
    }}>
        {visible && <Notification tone="warning" title="Deploy pipeline paused" description="The staging pipeline has been paused due to 3 consecutive test failures. Review the error log before resuming." action={{
        label: 'View logs',
        onClick: () => setStatus('Navigating to deploy logs…')
      }} onDismiss={() => setVisible(false)} />}
        {status && <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--fg-muted)',
        margin: 0
      }}>
            {status}
          </p>}
        {!visible && <button className="btn ghost" onClick={() => {
        setVisible(true);
        setStatus(null);
      }}>
            Reset
          </button>}
      </div>;
  }
}`,...d.parameters?.docs?.source},description:{story:`Notifications may include a single inline CTA — "Upgrade", "Retry", "View logs".
The action should be low-stakes: never use it for irreversible or destructive operations.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    maxWidth: 580
  }}>
      <Notification tone="danger" title="Billing suspended — service is read-only" description="Payment for the Pro plan failed on 2026-05-28. Update your payment method to restore write access." action={{
      label: 'Update payment',
      onClick: () => {}
    }} />
      <Notification tone="warning" title="MFA not configured" description="Your organisation requires MFA for all members. You have 48 hours to set it up before access is restricted." action={{
      label: 'Enable MFA',
      onClick: () => {}
    }} />
    </div>
}`,...f.parameters?.docs?.source},description:{story:`Omitting onDismiss renders a non-dismissible banner — appropriate for
required-action alerts that must not be silenced until the underlying
issue is resolved.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [dismissed, setDismissed] = React.useState(false);
    return <div className="surface" style={{
      padding: 24,
      borderRadius: 8,
      border: '1px solid var(--border-strong)',
      maxWidth: 540,
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }}>
        <div>
          <div style={{
          fontWeight: 600,
          fontSize: 16,
          marginBottom: 2
        }}>Service settings</div>
          <div style={{
          color: 'var(--fg-muted)',
          fontSize: 13
        }}>
            forge-api {'·'} Region: us-east-1 {'·'} Runtime: node20
          </div>
        </div>

        {!dismissed && <Notification tone="warning" title="Environment variable missing" description="FORGE_API_SECRET is referenced in 3 runbooks but not set for the production environment." action={{
        label: 'Add variable',
        onClick: () => {}
      }} onDismiss={() => setDismissed(true)} />}

        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}>
          <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
            <div>
              <div style={{
              fontSize: 14,
              fontWeight: 500
            }}>Auto-deploy</div>
              <div style={{
              fontSize: 12,
              color: 'var(--fg-muted)'
            }}>Push to main triggers a deploy</div>
            </div>
            <div className="badge success" style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11
          }}>enabled</div>
          </div>
          <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
            <div>
              <div style={{
              fontSize: 14,
              fontWeight: 500
            }}>Health checks</div>
              <div style={{
              fontSize: 12,
              color: 'var(--fg-muted)'
            }}>GET /health every 30 s</div>
            </div>
            <div className="badge success" style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11
          }}>passing</div>
          </div>
        </div>

        {dismissed && <button className="btn ghost" style={{
        alignSelf: 'flex-start'
      }} onClick={() => setDismissed(false)}>
            Reset notification
          </button>}
      </div>;
  }
}`,...p.parameters?.docs?.source},description:{story:`A realistic settings page layout: a persistent danger notice at the top of
the panel, followed by normal form content. Shows how the banner integrates
with surrounding surfaces without custom styling.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [dismissed, setDismissed] = React.useState<Set<string>>(new Set());
    const configs: Array<{
      tone: React.ComponentProps<typeof Notification>['tone'];
      title: string;
      description: string;
      action?: string;
    }> = [{
      tone: 'success',
      title: 'تم نشر التحديث',
      description: 'الإصدار ۴.۱۹.۰ متاح الآن في جميع المناطق.'
    }, {
      tone: 'warning',
      title: 'الحصة وصلت إلى ۸۴٪',
      description: 'قم بالترقية أو انتظر حتى منتصف الليل (توقيت UTC) لإعادة الضبط.',
      action: 'ترقية الخطة'
    }, {
      tone: 'danger',
      title: 'فشل نشر الكود',
      description: 'جارٍ التراجع إلى الإصدار ۴.۱۸.۲ بسبب ۳ اختبارات فاشلة.',
      action: 'عرض السجلات'
    }];
    return <div dir="rtl" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      maxWidth: 600
    }}>
        {configs.filter(c => !dismissed.has(c.tone as string)).map(c => <Notification key={c.tone} tone={c.tone} title={c.title} description={c.description} action={c.action ? {
        label: c.action,
        onClick: () => {}
      } : undefined} onDismiss={() => setDismissed(s => new Set([...s, c.tone as string]))} />)}
        {dismissed.size > 0 && <button className="btn ghost" onClick={() => setDismissed(new Set())}>
            إعادة الضبط
          </button>}
      </div>;
  }
}`,...m.parameters?.docs?.source},description:{story:`Right-to-left layout — icon, body, action, and dismiss button mirror correctly
via logical CSS properties (margin-inline-*, padding-inline-*).`,...m.parameters?.docs?.description}}},h=[`Default`,`AllTones`,`WithAction`,`Persistent`,`InContext`,`RTL`]}))();export{u as AllTones,l as Default,p as InContext,f as Persistent,m as RTL,d as WithAction,h as __namedExportsOrder,c as default};