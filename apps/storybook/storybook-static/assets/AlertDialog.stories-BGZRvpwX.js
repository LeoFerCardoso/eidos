import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Tn as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h,g;e((()=>{o=t(n(),1),a(),s=r(),c={title:`Overlays/AlertDialog`,component:i,tags:[`autodocs`],parameters:{layout:`centered`,docs:{description:{component:`A blocking modal that demands an explicit answer. Unlike a Modal, the backdrop is inert, Escape is a no-op by default, and there is no X button. Initial focus lands on the safe Cancel action. Use role="alertdialog" for irreversible or high-stakes operations only.`}}},argTypes:{variant:{control:`inline-radio`,options:[`warning`,`danger`,`info`]},title:{control:`text`},description:{control:`text`},cancelLabel:{control:`text`},confirmLabel:{control:`text`},open:{control:`boolean`}}},l={render:()=>{let[e,t]=o.useState(!1),[n,r]=o.useState(null);return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:16},children:[(0,s.jsx)(`button`,{className:`btn destructive`,onClick:()=>t(!0),children:`Delete service`}),n&&(0,s.jsx)(`p`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-muted)`,margin:0},children:n}),(0,s.jsx)(i,{open:e,onOpenChange:t,variant:`danger`,title:`Delete forge-api?`,description:`This permanently removes the service, its deploy history, and 4 linked runbooks. There is no undo.`,cancelLabel:`Cancel`,confirmLabel:`Delete service`,onCancel:()=>{r(`Cancelled — service kept.`),t(!1)},onConfirm:()=>{r(`Confirmed — service deleted.`),t(!1)}})]})}},u={render:()=>{let[e,t]=o.useState(!1),[n,r]=o.useState(null);return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:16},children:[(0,s.jsx)(`button`,{className:`btn destructive`,onClick:()=>t(!0),children:`Delete service`}),n&&(0,s.jsx)(`p`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-muted)`,margin:0},children:n}),(0,s.jsx)(i,{open:e,onOpenChange:t,variant:`danger`,title:`Delete forge-api?`,description:`This permanently removes the service, its deploy history, and 4 linked runbooks. There is no undo.`,cancelLabel:`Cancel`,confirmLabel:`Delete service`,onCancel:()=>{r(`Cancelled — service kept.`),t(!1)},onConfirm:()=>{r(`Confirmed — service deleted.`),t(!1)}})]})}},d={render:()=>{let[e,t]=o.useState(!1);return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:16},children:[(0,s.jsx)(`button`,{className:`btn destructive`,onClick:()=>t(!0),children:`Delete service`}),(0,s.jsx)(i,{open:e,onOpenChange:t,variant:`danger`,title:`Delete forge-api?`,description:`This permanently removes the service, its deploy history, and 4 linked runbooks. There is no undo.`,cancelLabel:`Cancel`,confirmLabel:`Delete service`,onCancel:()=>t(!1),onConfirm:()=>t(!1)})]})}},f={render:()=>{let[e,t]=o.useState(!1),[n,r]=o.useState(null);return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:16},children:[(0,s.jsx)(`button`,{className:`btn`,onClick:()=>t(!0),children:`Restart server`}),n&&(0,s.jsx)(`p`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-muted)`,margin:0},children:n}),(0,s.jsx)(i,{open:e,onOpenChange:t,variant:`info`,title:`Restart required`,description:`The new Tailwind preset needs a dev-server restart to pick up the changes. Restart now or finish your changes first.`,cancelLabel:`Later`,confirmLabel:`Restart now`,onCancel:()=>{r(`Dismissed — restarting later.`),t(!1)},onConfirm:()=>{r(`Confirmed — restarting server.`),t(!1)}})]})}},p={render:()=>{let[e,t]=o.useState(!1),[n,r]=o.useState(null);return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:16},children:[(0,s.jsx)(`button`,{className:`btn destructive`,onClick:()=>t(!0),children:`Delete service`}),n&&(0,s.jsx)(`p`,{style:{fontFamily:`var(--font-mono)`,fontSize:13,color:`var(--fg-muted)`},children:n}),(0,s.jsx)(i,{open:e,onOpenChange:t,variant:`danger`,title:`Delete forge-api?`,description:`This permanently removes the service, its deploy history, and 4 linked runbooks. There is no undo.`,cancelLabel:`Cancel`,confirmLabel:`Delete service`,onCancel:()=>r(`Cancelled — service kept.`),onConfirm:()=>{r(`Confirmed — service deleted.`),t(!1)}})]})}},m={render:()=>{let[e,t]=o.useState(!1);return(0,s.jsxs)(`div`,{dir:`rtl`,style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:16},children:[(0,s.jsx)(`button`,{className:`btn destructive`,onClick:()=>t(!0),children:`حذف الخدمة`}),(0,s.jsx)(i,{open:e,onOpenChange:t,variant:`danger`,title:`حذف forge-api؟`,description:`سيؤدي هذا إلى إزالة الخدمة بشكل دائم، وتاريخ النشر، و٤ كتب تشغيل مرتبطة. لا يمكن التراجع.`,cancelLabel:`إلغاء`,confirmLabel:`حذف الخدمة`,onCancel:()=>t(!1),onConfirm:()=>t(!1)})]})}},h={render:()=>{let[e,t]=o.useState(null),n=[{variant:`warning`,label:`Discard`,title:`Discard unsaved changes?`,description:`You have edits to forge-api that will be lost if you leave now.`,cancel:`Keep editing`,confirm:`Discard`},{variant:`danger`,label:`Delete`,title:`Delete forge-api?`,description:`This permanently removes the service and all linked runbooks. There is no undo.`,cancel:`Cancel`,confirm:`Delete service`},{variant:`info`,label:`Restart`,title:`Restart required`,description:`The new preset needs a dev-server restart to take effect.`,cancel:`Later`,confirm:`Restart now`}],r=n.find(t=>t.variant===e)??null;return(0,s.jsxs)(`div`,{style:{display:`flex`,gap:12},children:[n.map(e=>(0,s.jsx)(`button`,{className:`btn outline`,onClick:()=>t(e.variant),children:e.label},e.variant)),r&&(0,s.jsx)(i,{open:!0,onOpenChange:()=>t(null),variant:r.variant,title:r.title,description:r.description,cancelLabel:r.cancel,confirmLabel:r.confirm,onCancel:()=>t(null),onConfirm:()=>t(null)})]})}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [result, setResult] = React.useState<string | null>(null);
    const handleConfirm = () => {
      setResult('Confirmed — service deleted.');
      setOpen(false);
    };
    const handleCancel = () => {
      setResult('Cancelled — service kept.');
      setOpen(false);
    };
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16
    }}>
        <button className="btn destructive" onClick={() => setOpen(true)}>
          Delete service
        </button>
        {result && <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--fg-muted)',
        margin: 0
      }}>
            {result}
          </p>}
        <AlertDialog open={open} onOpenChange={setOpen} variant="danger" title="Delete forge-api?" description="This permanently removes the service, its deploy history, and 4 linked runbooks. There is no undo." cancelLabel="Cancel" confirmLabel="Delete service" onCancel={handleCancel} onConfirm={handleConfirm} />
      </div>;
  }
}`,...l.parameters?.docs?.source},description:{story:`Click "Delete service" to open the dialog. Cancel / Confirm close it.
Initial focus lands on the safe "Cancel" action (alertdialog contract).`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [result, setResult] = React.useState<string | null>(null);
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16
    }}>
        <button className="btn destructive" onClick={() => setOpen(true)}>
          Delete service
        </button>
        {result && <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--fg-muted)',
        margin: 0
      }}>
            {result}
          </p>}
        <AlertDialog open={open} onOpenChange={setOpen} variant="danger" title="Delete forge-api?" description="This permanently removes the service, its deploy history, and 4 linked runbooks. There is no undo." cancelLabel="Cancel" confirmLabel="Delete service" onCancel={() => {
        setResult('Cancelled — service kept.');
        setOpen(false);
      }} onConfirm={() => {
        setResult('Confirmed — service deleted.');
        setOpen(false);
      }} />
      </div>;
  }
}`,...u.parameters?.docs?.source},description:{story:'Click "Delete service" to open the destructive danger dialog.\nThe confirm button uses the `.btn.destructive` style — never ember for delete.',...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(false);
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16
    }}>
        <button className="btn destructive" onClick={() => setOpen(true)}>
          Delete service
        </button>
        <AlertDialog open={open} onOpenChange={setOpen} variant="danger" title="Delete forge-api?" description="This permanently removes the service, its deploy history, and 4 linked runbooks. There is no undo." cancelLabel="Cancel" confirmLabel="Delete service" onCancel={() => setOpen(false)} onConfirm={() => setOpen(false)} />
      </div>;
  }
}`,...d.parameters?.docs?.source},description:{story:'Danger variant — click "Delete service" to open. Confirm button uses `.btn.destructive`.',...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [result, setResult] = React.useState<string | null>(null);
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16
    }}>
        <button className="btn" onClick={() => setOpen(true)}>
          Restart server
        </button>
        {result && <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--fg-muted)',
        margin: 0
      }}>
            {result}
          </p>}
        <AlertDialog open={open} onOpenChange={setOpen} variant="info" title="Restart required" description="The new Tailwind preset needs a dev-server restart to pick up the changes. Restart now or finish your changes first." cancelLabel="Later" confirmLabel="Restart now" onCancel={() => {
        setResult('Dismissed — restarting later.');
        setOpen(false);
      }} onConfirm={() => {
        setResult('Confirmed — restarting server.');
        setOpen(false);
      }} />
      </div>;
  }
}`,...f.parameters?.docs?.source},description:{story:`Info variant — click "Restart server" to open. Not destructive; confirm is the primary action.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [result, setResult] = React.useState<string | null>(null);
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16
    }}>
        <button className="btn destructive" onClick={() => setOpen(true)}>
          Delete service
        </button>
        {result && <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        color: 'var(--fg-muted)'
      }}>
            {result}
          </p>}
        <AlertDialog open={open} onOpenChange={setOpen} variant="danger" title="Delete forge-api?" description="This permanently removes the service, its deploy history, and 4 linked runbooks. There is no undo." cancelLabel="Cancel" confirmLabel="Delete service" onCancel={() => setResult('Cancelled — service kept.')} onConfirm={() => {
        setResult('Confirmed — service deleted.');
        setOpen(false);
      }} />
      </div>;
  }
}`,...p.parameters?.docs?.source},description:{story:`Fully controlled story — click "Delete service" to open the dialog.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(false);
    return <div dir="rtl" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16
    }}>
        <button className="btn destructive" onClick={() => setOpen(true)}>
          حذف الخدمة
        </button>
        <AlertDialog open={open} onOpenChange={setOpen} variant="danger" title="حذف forge-api؟" description="سيؤدي هذا إلى إزالة الخدمة بشكل دائم، وتاريخ النشر، و٤ كتب تشغيل مرتبطة. لا يمكن التراجع." cancelLabel="إلغاء" confirmLabel="حذف الخدمة" onCancel={() => setOpen(false)} onConfirm={() => setOpen(false)} />
      </div>;
  }
}`,...m.parameters?.docs?.source},description:{story:`Right-to-left layout — cancel still leads, confirm stays on the trailing edge.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [active, setActive] = React.useState<'warning' | 'danger' | 'info' | null>(null);
    const configs: Array<{
      variant: 'warning' | 'danger' | 'info';
      label: string;
      title: string;
      description: string;
      cancel: string;
      confirm: string;
    }> = [{
      variant: 'warning',
      label: 'Discard',
      title: 'Discard unsaved changes?',
      description: 'You have edits to forge-api that will be lost if you leave now.',
      cancel: 'Keep editing',
      confirm: 'Discard'
    }, {
      variant: 'danger',
      label: 'Delete',
      title: 'Delete forge-api?',
      description: 'This permanently removes the service and all linked runbooks. There is no undo.',
      cancel: 'Cancel',
      confirm: 'Delete service'
    }, {
      variant: 'info',
      label: 'Restart',
      title: 'Restart required',
      description: 'The new preset needs a dev-server restart to take effect.',
      cancel: 'Later',
      confirm: 'Restart now'
    }];
    const current = configs.find(c => c.variant === active) ?? null;
    return <div style={{
      display: 'flex',
      gap: 12
    }}>
        {configs.map(c => <button key={c.variant} className="btn outline" onClick={() => setActive(c.variant)}>
            {c.label}
          </button>)}
        {current && <AlertDialog open={true} onOpenChange={() => setActive(null)} variant={current.variant} title={current.title} description={current.description} cancelLabel={current.cancel} confirmLabel={current.confirm} onCancel={() => setActive(null)} onConfirm={() => setActive(null)} />}
      </div>;
  }
}`,...h.parameters?.docs?.source},description:{story:`All three variants — triggers shown side by side.`,...h.parameters?.docs?.description}}},g=[`Default`,`Destructive`,`Danger`,`Info`,`Controlled`,`RTL`,`AllVariants`]}))();export{h as AllVariants,p as Controlled,d as Danger,l as Default,u as Destructive,f as Info,m as RTL,g as __namedExportsOrder,c as default};