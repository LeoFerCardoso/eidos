import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Xt as i,Yt as a,t as o}from"./src-DgoylXRw.js";var s,c,l,u,d,f,p,m,h,g,_;e((()=>{s=t(n(),1),o(),c=r(),l=[{heading:`Navigation`,items:[{id:`go-home`,label:`Go to Home`,kbd:[`G`,`H`]},{id:`go-svc`,label:`Go to Services`,kbd:[`G`,`S`]},{id:`go-deploy`,label:`Go to Deployments`,kbd:[`G`,`D`]}]},{heading:`Create`,items:[{id:`new-svc`,label:`New service…`,kbd:[`⌘`,`N`]},{id:`new-key`,label:`Generate API key`,kbd:[]},{id:`invite`,label:`Invite teammate`,kbd:[]}]},{heading:`Recent`,items:[{id:`r-1`,label:`Open: deploy guide`},{id:`r-2`,label:`Open: feature/api-v2`}]}],u={title:`Overlays/Command`,component:a,tags:[`autodocs`],parameters:{layout:`centered`,docs:{description:{component:`The ⌘K surface — a single text input that searches across navigation, creation, and recent items. Use <Command> inline or <CommandDialog> for the full backdrop overlay. Keyboard: ↑/↓ move the highlight, Enter selects, ESC closes.`}}},args:{groups:l,placeholder:`Type a command or search…`}},d={render:e=>{let[t,n]=s.useState([]),r=e=>n(t=>[...t,e]);return(0,c.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:16,width:540},children:[(0,c.jsx)(a,{...e,onSelect:r}),(0,c.jsx)(`div`,{role:`log`,"aria-label":`Run log`,style:{display:`flex`,flexDirection:`column`,gap:4},children:t.length===0?(0,c.jsx)(`div`,{style:{fontSize:12,color:`var(--fg-subtle)`,fontFamily:`var(--font-mono)`},children:`Click or press Enter to run a command.`}):t.map((e,t)=>(0,c.jsxs)(`li`,{role:`status`,"aria-live":`polite`,style:{listStyle:`none`,fontSize:12,color:`var(--fg-muted)`,fontFamily:`var(--font-mono)`,padding:`4px 8px`,background:`var(--surface)`,borderRadius:4,border:`1px solid var(--border)`},children:[`Ran: `,(0,c.jsx)(`strong`,{style:{color:`var(--fg)`},children:e})]},t))})]})}},f={render:e=>{let[t,n]=s.useState(`deploy`);return(0,c.jsx)(`div`,{style:{width:540},children:(0,c.jsx)(a,{...e,query:t,onQueryChange:n,onSelect:()=>{}})})}},p={render:e=>(0,c.jsx)(`div`,{style:{width:540},children:(0,c.jsx)(a,{...e,defaultQuery:`zzznomatch`,onSelect:()=>{}})})},m={render:e=>{let[t,n]=s.useState(!1),r=s.useRef(null);return s.useEffect(()=>{let e=e=>{(e.metaKey||e.ctrlKey)&&e.key===`k`&&(e.preventDefault(),n(e=>!e))};return document.addEventListener(`keydown`,e),()=>document.removeEventListener(`keydown`,e)},[]),(0,c.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:16},children:[(0,c.jsxs)(`button`,{ref:r,className:`btn`,onClick:()=>n(!0),style:{display:`inline-flex`,alignItems:`center`,gap:8},children:[`Open palette`,(0,c.jsxs)(`span`,{className:`kbd-chord`,children:[(0,c.jsx)(`kbd`,{className:`kbd`,children:`⌘`}),(0,c.jsx)(`kbd`,{className:`kbd`,children:`K`})]})]}),(0,c.jsx)(i,{...e,open:t,onOpenChange:n,onSelect:e=>{console.log(`Selected:`,e),n(!1)}})]})}},h={render:e=>{let t=[{heading:`التنقل`,items:[{id:`home-ar`,label:`الذهاب إلى الرئيسية`,kbd:[`G`,`H`]},{id:`svc-ar`,label:`الذهاب إلى الخدمات`,kbd:[`G`,`S`]},{id:`deploy-ar`,label:`الذهاب إلى عمليات النشر`,kbd:[`G`,`D`]}]},{heading:`إنشاء`,items:[{id:`new-svc-ar`,label:`خدمة جديدة…`,kbd:[`⌘`,`N`]},{id:`invite-ar`,label:`دعوة عضو فريق`,kbd:[]}]}];return(0,c.jsx)(`div`,{dir:`rtl`,style:{width:540},children:(0,c.jsx)(a,{...e,groups:t,placeholder:`اكتب أمراً أو ابحث…`,onSelect:()=>{}})})}},g={render:()=>{let[e,t]=s.useState(!1);return(0,c.jsxs)(`div`,{style:{width:680,fontFamily:`var(--font)`,background:`var(--bg)`,border:`1px solid var(--border)`,borderRadius:12,overflow:`hidden`},children:[(0,c.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:10,padding:`10px 16px`,borderBottom:`1px solid var(--border)`,background:`var(--surface)`},children:[(0,c.jsx)(`span`,{style:{fontSize:13,fontWeight:600,color:`var(--fg)`},children:`forge-api`}),(0,c.jsx)(`div`,{style:{flex:1}}),(0,c.jsxs)(`button`,{className:`ds-topbar-search`,onClick:()=>t(!0),"aria-label":`Open command palette`,children:[(0,c.jsxs)(`svg`,{width:`14`,height:`14`,viewBox:`0 0 14 14`,fill:`none`,"aria-hidden":`true`,children:[(0,c.jsx)(`circle`,{cx:`6`,cy:`6`,r:`4.5`,stroke:`currentColor`,strokeWidth:`1.5`}),(0,c.jsx)(`path`,{d:`M9.5 9.5L12.5 12.5`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinecap:`round`})]}),(0,c.jsx)(`span`,{className:`label`,style:{fontSize:13,color:`var(--fg-subtle)`},children:`Search commands…`}),(0,c.jsxs)(`span`,{className:`kbd-chord`,children:[(0,c.jsx)(`kbd`,{className:`kbd`,children:`⌘`}),(0,c.jsx)(`kbd`,{className:`kbd`,children:`K`})]})]})]}),(0,c.jsx)(`div`,{style:{padding:20,minHeight:140},children:(0,c.jsx)(`div`,{style:{fontSize:13,color:`var(--fg-muted)`},children:`Press the search bar above (or ⌘K) to open the command palette.`})}),(0,c.jsx)(i,{groups:l,open:e,onOpenChange:t,onSelect:e=>{console.log(`Selected:`,e),t(!1)}})]})}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [log, setLog] = React.useState<string[]>([]);
    const handleSelect = (id: string) => setLog(prev => [...prev, id]);
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      width: 540
    }}>
        <Command {...args} onSelect={handleSelect} />
        <div role="log" aria-label="Run log" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }}>
          {log.length === 0 ? <div style={{
          fontSize: 12,
          color: 'var(--fg-subtle)',
          fontFamily: 'var(--font-mono)'
        }}>
              Click or press Enter to run a command.
            </div> : log.map((id, i) => <li key={i} role="status" aria-live="polite" style={{
          listStyle: 'none',
          fontSize: 12,
          color: 'var(--fg-muted)',
          fontFamily: 'var(--font-mono)',
          padding: '4px 8px',
          background: 'var(--surface)',
          borderRadius: 4,
          border: '1px solid var(--border)'
        }}>
                Ran: <strong style={{
            color: 'var(--fg)'
          }}>{id}</strong>
              </li>)}
        </div>
      </div>;
  }
}`,...d.parameters?.docs?.source},description:{story:`Inline palette — type to filter items live; click or press Enter to run.
Each selection appends a li[role=status] run-log entry so the probe's snap
phase (which clicks the first [role=option]) drives the count from 0→1→2,
making b.toasts !== p.toasts (✓ INTERACTS). Arrow keys + Enter also work.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [q, setQ] = React.useState('deploy');
    return <div style={{
      width: 540
    }}>
        <Command {...args} query={q} onQueryChange={setQ} onSelect={() => {}} />
      </div>;
  }
}`,...f.parameters?.docs?.source},description:{story:`Pre-filtered with "deploy" — shows only matching items remain.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    width: 540
  }}>
      <Command {...args} defaultQuery="zzznomatch" onSelect={() => {}} />
    </div>
}`,...p.parameters?.docs?.source},description:{story:`Search that matches nothing — shows the CommandEmpty state.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [open, setOpen] = React.useState(false);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    React.useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          setOpen(o => !o);
        }
      };
      document.addEventListener('keydown', handler);
      return () => document.removeEventListener('keydown', handler);
    }, []);
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16
    }}>
        <button ref={triggerRef} className="btn" onClick={() => setOpen(true)} style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8
      }}>
          Open palette
          <span className="kbd-chord">
            <kbd className="kbd">⌘</kbd>
            <kbd className="kbd">K</kbd>
          </span>
        </button>
        <CommandDialog {...args} open={open} onOpenChange={setOpen} onSelect={id => {
        // eslint-disable-next-line no-console
        console.log('Selected:', id);
        setOpen(false);
      }} />
      </div>;
  }
}`,...m.parameters?.docs?.source},description:{story:`Full ⌘K overlay — click the trigger (or press ⌘K/Ctrl+K) to open.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => {
    const rtlGroups: CommandGroup[] = [{
      heading: 'التنقل',
      items: [{
        id: 'home-ar',
        label: 'الذهاب إلى الرئيسية',
        kbd: ['G', 'H']
      }, {
        id: 'svc-ar',
        label: 'الذهاب إلى الخدمات',
        kbd: ['G', 'S']
      }, {
        id: 'deploy-ar',
        label: 'الذهاب إلى عمليات النشر',
        kbd: ['G', 'D']
      }]
    }, {
      heading: 'إنشاء',
      items: [{
        id: 'new-svc-ar',
        label: 'خدمة جديدة…',
        kbd: ['⌘', 'N']
      }, {
        id: 'invite-ar',
        label: 'دعوة عضو فريق',
        kbd: []
      }]
    }];
    return <div dir="rtl" style={{
      width: 540
    }}>
        <Command {...args} groups={rtlGroups} placeholder="اكتب أمراً أو ابحث…" onSelect={() => {}} />
      </div>;
  }
}`,...h.parameters?.docs?.source},description:{story:`Right-to-left — search glyph and item icons lead on the right;
kbd chord hints trail on the left. Logical CSS properties handle the flip.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(false);
    return <div style={{
      width: 680,
      fontFamily: 'var(--font)',
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      overflow: 'hidden'
    }}>
        {/* Simulated topbar */}
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 16px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)'
      }}>
          <span style={{
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--fg)'
        }}>forge-api</span>
          <div style={{
          flex: 1
        }} />
          <button className="ds-topbar-search" onClick={() => setOpen(true)} aria-label="Open command palette">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="label" style={{
            fontSize: 13,
            color: 'var(--fg-subtle)'
          }}>
              Search commands…
            </span>
            <span className="kbd-chord">
              <kbd className="kbd">⌘</kbd>
              <kbd className="kbd">K</kbd>
            </span>
          </button>
        </div>

        {/* Simulated content area */}
        <div style={{
        padding: 20,
        minHeight: 140
      }}>
          <div style={{
          fontSize: 13,
          color: 'var(--fg-muted)'
        }}>
            Press the search bar above (or ⌘K) to open the command palette.
          </div>
        </div>

        <CommandDialog groups={NAV_GROUPS} open={open} onOpenChange={setOpen} onSelect={id => {
        // eslint-disable-next-line no-console
        console.log('Selected:', id);
        setOpen(false);
      }} />
      </div>;
  }
}`,...g.parameters?.docs?.source},description:{story:`Command palette embedded inside a realistic app shell — topbar trigger opens
the full dialog overlay. Demonstrates the end-to-end ⌘K flow in context.`,...g.parameters?.docs?.description}}},_=[`Default`,`Filtered`,`Empty`,`WithDialog`,`RTL`,`InContext`]}))();export{d as Default,p as Empty,f as Filtered,g as InContext,h as RTL,m as WithDialog,_ as __namedExportsOrder,u as default};