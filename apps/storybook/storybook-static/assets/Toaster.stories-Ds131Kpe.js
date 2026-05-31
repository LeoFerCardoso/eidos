import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Gt as i,Jt as a,Kt as o,t as s}from"./src-DgoylXRw.js";function c({position:e=`bottom-right`}){let{toast:t}=a();return(0,u.jsxs)(`div`,{style:{display:`flex`,gap:8,flexWrap:`wrap`},children:[(0,u.jsx)(`button`,{className:`btn ember`,onClick:()=>t({tone:`success`,title:`Published`,description:`Live in 4.2s across all regions.`}),children:`Publish`}),(0,u.jsx)(`button`,{className:`btn outline`,onClick:()=>t({tone:`info`,title:`Deployed`,description:`New version is live.`}),children:`Deploy`})]})}var l,u,d,f,p,m,h,g,_,v,y;e((()=>{l=t(n(),1),s(),u=r(),d={title:`Overlays/Toaster`,component:o,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:`Ephemeral stacked toasts for actions the user just took. Wrap your subtree with <Toaster>, then call toast() via useToast() anywhere inside. Auto-dismiss pauses on hover/focus; ESC dismisses the focused toast; F6 jumps keyboard focus into the region.`}}},args:{position:`bottom-right`},argTypes:{position:{control:`select`,options:[`top-left`,`top-center`,`top-right`,`bottom-left`,`bottom-center`,`bottom-right`]}}},f={render:e=>(0,u.jsx)(o,{position:e.position,children:(0,u.jsx)(c,{})})},p={render:e=>{function t(){let{toast:e,dismiss:t}=a();return(0,u.jsxs)(`div`,{style:{display:`flex`,gap:8,flexWrap:`wrap`},children:[(0,u.jsx)(`button`,{className:`btn`,onClick:()=>e({tone:`default`,title:`Note saved`,description:`It will sync momentarily.`}),children:`Default`}),(0,u.jsx)(`button`,{className:`btn`,onClick:()=>e({tone:`info`,title:`New release`,description:`v4.19.0 is available.`}),children:`Info`}),(0,u.jsx)(`button`,{className:`btn`,onClick:()=>e({tone:`success`,title:`Published`,description:`Live in 4.2s.`}),children:`Success`}),(0,u.jsx)(`button`,{className:`btn`,onClick:()=>e({tone:`warning`,title:`Quota at 84%`,description:`Upgrade or wait until midnight UTC.`}),children:`Warning`}),(0,u.jsx)(`button`,{className:`btn`,onClick:()=>e({tone:`danger`,title:`Deploy failed`,description:`Rolling back to v4.18.2.`}),children:`Danger`}),(0,u.jsxs)(`button`,{className:`btn`,onClick:()=>{let n=e({tone:`loading`,title:`Publishing…`,description:`Usually a few seconds.`,duration:0});setTimeout(()=>{t(n),e({tone:`success`,title:`Published`,description:`Live in 4.2s.`})},2e3)},children:[`Loading `,`->`,` Success`]})]})}return(0,u.jsx)(o,{position:e.position,children:(0,u.jsx)(t,{})})}},m={render:e=>{function t(){let{toast:e}=a();return(0,u.jsx)(`button`,{className:`btn outline`,onClick:()=>e({tone:`default`,title:`Item deleted`,description:`You can undo for 5 seconds.`,duration:5e3,action:{label:`Undo`,onClick:()=>{}}}),children:`Delete item`})}return(0,u.jsx)(o,{position:e.position,children:(0,u.jsx)(t,{})})}},h={render:()=>{let[e,t]=l.useState(`top-right`),n=[`top-left`,`top-center`,`top-right`,`bottom-left`,`bottom-center`,`bottom-right`];function r(){let{toast:t}=a();return(0,u.jsxs)(`button`,{className:`btn`,onClick:()=>t({tone:`success`,title:`Region: `+e,description:`Toast anchored to the selected corner.`}),children:[`Fire toast at `,e]})}return(0,u.jsx)(o,{position:e,children:(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:12},children:[(0,u.jsx)(`div`,{style:{display:`flex`,gap:6,flexWrap:`wrap`},children:n.map(n=>(0,u.jsx)(`button`,{className:e===n?`btn ember`:`btn outline`,onClick:()=>t(n),children:n},n))}),(0,u.jsx)(r,{})]})})}},g={render:e=>{function t(){let{toast:e}=a();return(0,u.jsxs)(`div`,{dir:`rtl`,style:{display:`flex`,gap:8,flexWrap:`wrap`},children:[(0,u.jsx)(`button`,{className:`btn`,onClick:()=>e({tone:`success`,title:`تم النشر`,description:`تم النشر في ۴.۲ ثانية.`}),children:`نجاح`}),(0,u.jsx)(`button`,{className:`btn`,onClick:()=>e({tone:`danger`,title:`فشل النشر`,description:`جارٍ التراجع.`}),children:`خطأ`}),(0,u.jsx)(`button`,{className:`btn outline`,onClick:()=>e({tone:`default`,title:`تم حذف العنصر`,description:`يمكنك التراجع لمدة ۵ ثوانٍ.`,duration:5e3,action:{label:`تراجع`,onClick:()=>{}}}),children:`مع إجراء`})]})}return(0,u.jsx)(o,{position:e.position,children:(0,u.jsx)(t,{})})}},_={render:()=>{let[e,t]=l.useState(new Set);return(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:10,maxWidth:540},children:[[`default`,`info`,`success`,`warning`,`danger`].filter(t=>!e.has(t)).map(e=>(0,u.jsx)(i,{tone:e,title:e.charAt(0).toUpperCase()+e.slice(1),description:`This is a ${e} inline notification.`,onDismiss:()=>t(t=>new Set([...t,e]))},e)),e.size>0&&(0,u.jsx)(`button`,{className:`btn ghost`,onClick:()=>t(new Set),children:`Reset`})]})}},v={render:e=>{function t(){let{toast:e}=a();return(0,u.jsxs)(`div`,{className:`surface`,style:{padding:20,borderRadius:8,border:`1px solid var(--border-strong)`,maxWidth:420},children:[(0,u.jsx)(`div`,{style:{fontWeight:600,marginBottom:4},children:`Deploy pipeline`}),(0,u.jsxs)(`div`,{style:{color:`var(--fg-muted)`,fontSize:13,marginBottom:16},children:[`Target: production `,`·`,` Region: us-east-1`]}),(0,u.jsxs)(`div`,{style:{display:`flex`,gap:8},children:[(0,u.jsx)(`button`,{className:`btn ember`,onClick:()=>e({tone:`loading`,title:`Deploying…`,description:`Usually takes ~90s.`,duration:0}),children:`Deploy`}),(0,u.jsx)(`button`,{className:`btn outline`,onClick:()=>e({tone:`warning`,title:`Rollback triggered`,description:`Reverting to v4.18.2.`}),children:`Rollback`})]})]})}return(0,u.jsx)(o,{position:e.position,children:(0,u.jsx)(t,{})})}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <Toaster position={args.position}>
      <ToastTriggers />
    </Toaster>
}`,...f.parameters?.docs?.source},description:{story:`Basic success toast fired from a trigger button.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => {
    function AllTriggers() {
      const {
        toast,
        dismiss
      } = useToast();
      return <div style={{
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap'
      }}>
          <button className="btn" onClick={() => toast({
          tone: 'default',
          title: 'Note saved',
          description: 'It will sync momentarily.'
        })}>Default</button>
          <button className="btn" onClick={() => toast({
          tone: 'info',
          title: 'New release',
          description: 'v4.19.0 is available.'
        })}>Info</button>
          <button className="btn" onClick={() => toast({
          tone: 'success',
          title: 'Published',
          description: 'Live in 4.2s.'
        })}>Success</button>
          <button className="btn" onClick={() => toast({
          tone: 'warning',
          title: 'Quota at 84%',
          description: 'Upgrade or wait until midnight UTC.'
        })}>Warning</button>
          <button className="btn" onClick={() => toast({
          tone: 'danger',
          title: 'Deploy failed',
          description: 'Rolling back to v4.18.2.'
        })}>Danger</button>
          <button className="btn" onClick={() => {
          const id = toast({
            tone: 'loading',
            title: 'Publishing…',
            description: 'Usually a few seconds.',
            duration: 0
          });
          setTimeout(() => {
            dismiss(id);
            toast({
              tone: 'success',
              title: 'Published',
              description: 'Live in 4.2s.'
            });
          }, 2000);
        }}>Loading {'->'} Success</button>
        </div>;
    }
    return <Toaster position={args.position}>
        <AllTriggers />
      </Toaster>;
  }
}`,...p.parameters?.docs?.source},description:{story:`All six tones: default, info, success, warning, danger, and loading.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => {
    function ActionTrigger() {
      const {
        toast
      } = useToast();
      return <button className="btn outline" onClick={() => toast({
        tone: 'default',
        title: 'Item deleted',
        description: 'You can undo for 5 seconds.',
        duration: 5000,
        action: {
          label: 'Undo',
          onClick: () => {}
        }
      })}>
          Delete item
        </button>;
    }
    return <Toaster position={args.position}>
        <ActionTrigger />
      </Toaster>;
  }
}`,...m.parameters?.docs?.source},description:{story:`Toast with an optional CTA (Undo, Open, Retry).`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [pos, setPos] = React.useState<React.ComponentProps<typeof Toaster>['position']>('top-right');
    const positions = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'] as const;
    function PosTrigger() {
      const {
        toast
      } = useToast();
      return <button className="btn" onClick={() => toast({
        tone: 'success',
        title: 'Region: ' + pos,
        description: 'Toast anchored to the selected corner.'
      })}>
          Fire toast at {pos}
        </button>;
    }
    return <Toaster position={pos}>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}>
          <div style={{
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap'
        }}>
            {positions.map(p => <button key={p} className={pos === p ? 'btn ember' : 'btn outline'} onClick={() => setPos(p)}>
                {p}
              </button>)}
          </div>
          <PosTrigger />
        </div>
      </Toaster>;
  }
}`,...h.parameters?.docs?.source},description:{story:`Cycles through all six positioning corners.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => {
    function RTLTriggers() {
      const {
        toast
      } = useToast();
      return <div dir="rtl" style={{
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap'
      }}>
          <button className="btn" onClick={() => toast({
          tone: 'success',
          title: 'تم النشر',
          description: 'تم النشر في ۴.۲ ثانية.'
        })}>{'نجاح'}</button>
          <button className="btn" onClick={() => toast({
          tone: 'danger',
          title: 'فشل النشر',
          description: 'جارٍ التراجع.'
        })}>{'خطأ'}</button>
          <button className="btn outline" onClick={() => toast({
          tone: 'default',
          title: 'تم حذف العنصر',
          description: 'يمكنك التراجع لمدة ۵ ثوانٍ.',
          duration: 5000,
          action: {
            label: 'تراجع',
            onClick: () => {}
          }
        })}>{'مع إجراء'}</button>
        </div>;
    }
    return <Toaster position={args.position}>
        <RTLTriggers />
      </Toaster>;
  }
}`,...g.parameters?.docs?.source},description:{story:`RTL — the region mirrors to the opposite edge via inset-inline-*.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [dismissed, setDismissed] = React.useState<Set<string>>(new Set());
    const tones = ['default', 'info', 'success', 'warning', 'danger'] as const;
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      maxWidth: 540
    }}>
        {tones.filter(t => !dismissed.has(t)).map(tone => <Notification key={tone} tone={tone} title={tone.charAt(0).toUpperCase() + tone.slice(1)} description={\`This is a \${tone} inline notification.\`} onDismiss={() => setDismissed(s => new Set([...s, tone]))} />)}
        {dismissed.size > 0 && <button className="btn ghost" onClick={() => setDismissed(new Set())}>
            Reset
          </button>}
      </div>;
  }
}`,..._.parameters?.docs?.source},description:{story:`Presentational Notification banners — inline, no portal, all tones.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: args => {
    function PipelineCard() {
      const {
        toast
      } = useToast();
      return <div className="surface" style={{
        padding: 20,
        borderRadius: 8,
        border: '1px solid var(--border-strong)',
        maxWidth: 420
      }}>
          <div style={{
          fontWeight: 600,
          marginBottom: 4
        }}>Deploy pipeline</div>
          <div style={{
          color: 'var(--fg-muted)',
          fontSize: 13,
          marginBottom: 16
        }}>
            Target: production {'·'} Region: us-east-1
          </div>
          <div style={{
          display: 'flex',
          gap: 8
        }}>
            <button className="btn ember" onClick={() => toast({
            tone: 'loading',
            title: 'Deploying…',
            description: 'Usually takes ~90s.',
            duration: 0
          })}>
              Deploy
            </button>
            <button className="btn outline" onClick={() => toast({
            tone: 'warning',
            title: 'Rollback triggered',
            description: 'Reverting to v4.18.2.'
          })}>
              Rollback
            </button>
          </div>
        </div>;
    }
    return <Toaster position={args.position}>
        <PipelineCard />
      </Toaster>;
  }
}`,...v.parameters?.docs?.source},description:{story:`Toast triggered inside a realistic deploy-pipeline card.`,...v.parameters?.docs?.description}}},y=[`Default`,`AllTones`,`WithAction`,`Positions`,`RTL`,`InlineNotification`,`InContext`]}))();export{p as AllTones,f as Default,v as InContext,_ as InlineNotification,h as Positions,g as RTL,m as WithAction,y as __namedExportsOrder,d as default};