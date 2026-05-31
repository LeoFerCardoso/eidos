import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Xt as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h,g,_,v;e((()=>{o=t(n(),1),a(),s=r(),c=[{heading:`Navigate`,items:[{id:`go-overview`,label:`Go to Overview`,kbd:[`G`,`O`]},{id:`go-services`,label:`Go to Services`,kbd:[`G`,`S`]},{id:`go-deployments`,label:`Go to Deployments`,kbd:[`G`,`D`]},{id:`go-pipelines`,label:`Go to Pipelines`,kbd:[`G`,`P`]},{id:`go-incidents`,label:`Go to Active Incidents`,kbd:[`G`,`I`]}]},{heading:`Create`,items:[{id:`new-service`,label:`New service…`,kbd:[`⌘`,`N`]},{id:`new-deployment`,label:`New deployment…`,kbd:[]},{id:`new-secret`,label:`Add secret / env var`,kbd:[]},{id:`invite-member`,label:`Invite team member`,kbd:[]}]},{heading:`Recent`,items:[{id:`r-forge-api`,label:`Open: forge-api (main)`,keywords:[`service`,`api`]},{id:`r-deploy-511`,label:`Open: deploy #511`,keywords:[`deploy`,`release`]},{id:`r-runbook-auth`,label:`Open: Runbook — auth outage`,keywords:[`runbook`,`incident`]}]}],l=[{heading:`AI Agents`,items:[{id:`agent-triage`,label:`Run triage agent on latest incident`,kbd:[`⌘`,`1`]},{id:`agent-review`,label:`Request PR review from forge-bot`,kbd:[`⌘`,`2`]},{id:`agent-summarise`,label:`Summarise deploy diff`,kbd:[]},{id:`agent-runbook`,label:`Generate runbook from alert payload`,kbd:[]}]},{heading:`Recent prompts`,items:[{id:`p-root-cause`,label:`Explain root cause of P1-2041`},{id:`p-migration`,label:`Scaffold DB migration for users_v3`},{id:`p-cost-report`,label:`Forecast infra cost for next quarter`}]}],u=[{heading:`Service actions`,items:[{id:`redeploy`,label:`Redeploy — forge-api (main)`,kbd:[`⌘`,`R`]},{id:`rollback`,label:`Rollback to deploy #508`,kbd:[]},{id:`scale-up`,label:`Scale: increase replica count`,kbd:[]},{id:`delete-svc`,label:`Delete service`,disabled:!0,keywords:[`remove`,`destroy`]}]},{heading:`Observability`,items:[{id:`view-logs`,label:`Open live log stream`,kbd:[`⌘`,`L`]},{id:`view-traces`,label:`Open distributed traces`,kbd:[]},{id:`view-metrics`,label:`Open metrics dashboard`,kbd:[]}]}],d={title:`Overlays/CommandDialog`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:`Full-screen ⌘K command palette — portals to document.body, locks body scroll, traps focus, restores focus on close, and dismisses on ESC or backdrop click. Use for platform-wide navigation, creation shortcuts, and quick service actions across IDP / AI / DevEx surfaces. Pair with a ⌘K keyboard listener on the page to match the expected mental model.`}}}},f={render:()=>{let[e,t]=o.useState(!1),[n,r]=o.useState(null);return o.useEffect(()=>{let e=e=>{(e.metaKey||e.ctrlKey)&&e.key===`k`&&(e.preventDefault(),t(e=>!e))};return document.addEventListener(`keydown`,e),()=>document.removeEventListener(`keydown`,e)},[]),(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:16,padding:32},children:[(0,s.jsxs)(`button`,{className:`btn`,onClick:()=>t(!0),style:{display:`inline-flex`,alignItems:`center`,gap:8},children:[`Open command palette`,(0,s.jsxs)(`span`,{className:`kbd-chord`,children:[(0,s.jsx)(`kbd`,{className:`kbd`,children:`⌘`}),(0,s.jsx)(`kbd`,{className:`kbd`,children:`K`})]})]}),n&&(0,s.jsxs)(`p`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-muted)`,margin:0},children:[`Ran: `,(0,s.jsx)(`strong`,{style:{color:`var(--fg)`},children:n})]}),(0,s.jsx)(i,{open:e,onOpenChange:t,groups:c,placeholder:`Type a command or search…`,onSelect:e=>{r(e),t(!1)}})]})}},p={render:()=>{let[e,t]=o.useState(!1),[n,r]=o.useState(null);return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:16,padding:32},children:[(0,s.jsxs)(`button`,{className:`btn`,onClick:()=>t(!0),style:{display:`inline-flex`,alignItems:`center`,gap:8},children:[`Open AI palette`,(0,s.jsxs)(`span`,{className:`kbd-chord`,children:[(0,s.jsx)(`kbd`,{className:`kbd`,children:`⌘`}),(0,s.jsx)(`kbd`,{className:`kbd`,children:`K`})]})]}),n&&(0,s.jsxs)(`p`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-muted)`,margin:0},children:[`Dispatched: `,(0,s.jsx)(`strong`,{style:{color:`var(--fg)`},children:n})]}),(0,s.jsx)(i,{open:e,onOpenChange:t,title:`AI agent palette`,groups:l,placeholder:`Ask an agent or recall a prompt…`,onSelect:e=>{r(e),t(!1)}})]})}},m={render:()=>{let[e,t]=o.useState(!1),[n,r]=o.useState(null);return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:16,padding:32},children:[(0,s.jsx)(`button`,{className:`btn`,onClick:()=>t(!0),style:{display:`inline-flex`,alignItems:`center`,gap:8},children:`Open service actions`}),n&&(0,s.jsxs)(`p`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-muted)`,margin:0},children:[`Ran: `,(0,s.jsx)(`strong`,{style:{color:`var(--fg)`},children:n})]}),(0,s.jsx)(i,{open:e,onOpenChange:t,title:`Service actions`,groups:u,placeholder:`Search service actions…`,onSelect:e=>{r(e),t(!1)}})]})}},h={render:()=>{let[e,t]=o.useState(!1),[n,r]=o.useState(`deploy`),[a,l]=o.useState(null);return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:16,padding:32},children:[(0,s.jsx)(`button`,{className:`btn`,onClick:()=>{r(`deploy`),t(!0)},children:`Search for “deploy”`}),a&&(0,s.jsxs)(`p`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-muted)`,margin:0},children:[`Ran: `,(0,s.jsx)(`strong`,{style:{color:`var(--fg)`},children:a})]}),(0,s.jsx)(i,{open:e,onOpenChange:e=>{t(e),e||r(``)},title:`Command palette`,groups:c,query:n,onQueryChange:r,placeholder:`Search commands…`,onSelect:e=>{l(e),t(!1)}})]})}},g={render:()=>{let[e,t]=o.useState(!1);return(0,s.jsxs)(`div`,{dir:`rtl`,style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:16,padding:32},children:[(0,s.jsxs)(`button`,{className:`btn`,onClick:()=>t(!0),style:{display:`inline-flex`,alignItems:`center`,gap:8},children:[`فتح لوحة الأوامر`,(0,s.jsxs)(`span`,{className:`kbd-chord`,children:[(0,s.jsx)(`kbd`,{className:`kbd`,children:`⌘`}),(0,s.jsx)(`kbd`,{className:`kbd`,children:`K`})]})]}),(0,s.jsx)(i,{open:e,onOpenChange:t,title:`لوحة الأوامر`,groups:[{heading:`التنقل`,items:[{id:`go-overview-ar`,label:`الانتقال إلى نظرة عامة`,kbd:[`G`,`O`]},{id:`go-services-ar`,label:`الانتقال إلى الخدمات`,kbd:[`G`,`S`]},{id:`go-deployments-ar`,label:`الانتقال إلى عمليات النشر`,kbd:[`G`,`D`]},{id:`go-incidents-ar`,label:`الانتقال إلى الحوادث النشطة`,kbd:[`G`,`I`]}]},{heading:`إنشاء`,items:[{id:`new-svc-ar`,label:`خدمة جديدة…`,kbd:[`⌘`,`N`]},{id:`invite-ar`,label:`دعوة عضو في الفريق`,kbd:[]}]}],placeholder:`اكتب أمراً أو ابحث…`,onSelect:()=>t(!1)})]})}},_={render:()=>{let[e,t]=o.useState(!1),[n,r]=o.useState(null);return o.useEffect(()=>{let e=e=>{(e.metaKey||e.ctrlKey)&&e.key===`k`&&(e.preventDefault(),t(e=>!e))};return document.addEventListener(`keydown`,e),()=>document.removeEventListener(`keydown`,e)},[]),(0,s.jsxs)(`div`,{style:{width:720,fontFamily:`var(--font)`,background:`var(--bg)`,border:`1px solid var(--border)`,borderRadius:12,overflow:`hidden`},children:[(0,s.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:10,padding:`10px 16px`,borderBottom:`1px solid var(--border)`,background:`var(--surface)`},children:[(0,s.jsx)(`span`,{style:{fontSize:13,fontWeight:600,color:`var(--fg)`},children:`forge-api`}),(0,s.jsx)(`span`,{className:`pill`,style:{fontSize:11,padding:`1px 6px`},children:`main`}),(0,s.jsx)(`div`,{style:{flex:1}}),(0,s.jsxs)(`button`,{className:`btn ghost`,onClick:()=>t(!0),"aria-label":`Open command palette`,style:{display:`inline-flex`,alignItems:`center`,gap:8,fontSize:13,color:`var(--fg-subtle)`,padding:`4px 10px`},children:[(0,s.jsxs)(`svg`,{width:`14`,height:`14`,viewBox:`0 0 14 14`,fill:`none`,"aria-hidden":`true`,children:[(0,s.jsx)(`circle`,{cx:`6`,cy:`6`,r:`4.5`,stroke:`currentColor`,strokeWidth:`1.5`}),(0,s.jsx)(`path`,{d:`M9.5 9.5L12.5 12.5`,stroke:`currentColor`,strokeWidth:`1.5`,strokeLinecap:`round`})]}),`Search commands…`,(0,s.jsxs)(`span`,{className:`kbd-chord`,children:[(0,s.jsx)(`kbd`,{className:`kbd`,children:`⌘`}),(0,s.jsx)(`kbd`,{className:`kbd`,children:`K`})]})]})]}),(0,s.jsxs)(`div`,{style:{padding:`20px 24px`,minHeight:160},children:[(0,s.jsxs)(`div`,{style:{fontSize:13,color:`var(--fg-muted)`,fontFamily:`var(--font-mono)`,marginBottom:12},children:[`deploy #511 — forge-api — `,(0,s.jsx)(`span`,{style:{color:`var(--fg-faint)`},children:`2 min ago`})]}),n&&(0,s.jsxs)(`div`,{className:`surface`,style:{display:`inline-flex`,alignItems:`center`,gap:8,padding:`6px 12px`,borderRadius:6,fontSize:12,fontFamily:`var(--font-mono)`,color:`var(--fg)`},children:[`Ran: `,(0,s.jsx)(`strong`,{style:{color:`var(--fg)`},children:n})]}),!n&&(0,s.jsx)(`div`,{style:{fontSize:13,color:`var(--fg-subtle)`},children:`Press the search bar (or ⌘K) to open the command palette.`})]}),(0,s.jsx)(i,{open:e,onOpenChange:t,groups:c,placeholder:`Type a command or search…`,onSelect:e=>{r(e),t(!1)}})]})}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [lastRun, setLastRun] = React.useState<string | null>(null);
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
      gap: 16,
      padding: 32
    }}>
        <button className="btn" onClick={() => setOpen(true)} style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8
      }}>
          Open command palette
          <span className="kbd-chord">
            <kbd className="kbd">⌘</kbd>
            <kbd className="kbd">K</kbd>
          </span>
        </button>
        {lastRun && <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--fg-muted)',
        margin: 0
      }}>
            Ran: <strong style={{
          color: 'var(--fg)'
        }}>{lastRun}</strong>
          </p>}
        <CommandDialog open={open} onOpenChange={setOpen} groups={PLATFORM_GROUPS} placeholder="Type a command or search…" onSelect={id => {
        setLastRun(id);
        setOpen(false);
      }} />
      </div>;
  }
}`,...f.parameters?.docs?.source},description:{story:`Click "Open command palette" (or press ⌘K / Ctrl+K) to open the overlay.
Selection is echoed in the run log below the trigger. ESC and backdrop click
both close the dialog and restore focus to the trigger button.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [lastRun, setLastRun] = React.useState<string | null>(null);
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
      padding: 32
    }}>
        <button className="btn" onClick={() => setOpen(true)} style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8
      }}>
          Open AI palette
          <span className="kbd-chord">
            <kbd className="kbd">⌘</kbd>
            <kbd className="kbd">K</kbd>
          </span>
        </button>
        {lastRun && <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--fg-muted)',
        margin: 0
      }}>
            Dispatched: <strong style={{
          color: 'var(--fg)'
        }}>{lastRun}</strong>
          </p>}
        <CommandDialog open={open} onOpenChange={setOpen} title="AI agent palette" groups={AGENT_GROUPS} placeholder="Ask an agent or recall a prompt…" onSelect={id => {
        setLastRun(id);
        setOpen(false);
      }} />
      </div>;
  }
}`,...p.parameters?.docs?.source},description:{story:`AI-scoped palette — surface only AI agent actions and recent prompts.
Demonstrates a custom placeholder and a focused group set appropriate for
an AI assistant panel or agent hub.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [lastRun, setLastRun] = React.useState<string | null>(null);
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
      padding: 32
    }}>
        <button className="btn" onClick={() => setOpen(true)} style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8
      }}>
          Open service actions
        </button>
        {lastRun && <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--fg-muted)',
        margin: 0
      }}>
            Ran: <strong style={{
          color: 'var(--fg)'
        }}>{lastRun}</strong>
          </p>}
        <CommandDialog open={open} onOpenChange={setOpen} title="Service actions" groups={IDP_GROUPS_WITH_DISABLED} placeholder="Search service actions…" onSelect={id => {
        setLastRun(id);
        setOpen(false);
      }} />
      </div>;
  }
}`,...m.parameters?.docs?.source},description:{story:`Service-action palette with a disabled item ("Delete service") — shows the
dimmed, non-interactive state that guards destructive actions behind a
permission check. Keyboard navigation skips disabled rows.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('deploy');
    const [lastRun, setLastRun] = React.useState<string | null>(null);
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
      padding: 32
    }}>
        <button className="btn" onClick={() => {
        setQuery('deploy');
        setOpen(true);
      }}>
          Search for &ldquo;deploy&rdquo;
        </button>
        {lastRun && <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--fg-muted)',
        margin: 0
      }}>
            Ran: <strong style={{
          color: 'var(--fg)'
        }}>{lastRun}</strong>
          </p>}
        <CommandDialog open={open} onOpenChange={o => {
        setOpen(o);
        if (!o) setQuery('');
      }} title="Command palette" groups={PLATFORM_GROUPS} query={query} onQueryChange={setQuery} placeholder="Search commands…" onSelect={id => {
        setLastRun(id);
        setOpen(false);
      }} />
      </div>;
  }
}`,...h.parameters?.docs?.source},description:{story:`Controlled mode — the parent owns the query string. The palette opens with
"deploy" pre-typed so only matching items are visible. Use this when you want
to pre-seed the search from a context (e.g. the user right-clicked a service
named "forge-deploy").`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(false);
    const rtlGroups: CommandGroup[] = [{
      heading: 'التنقل',
      items: [{
        id: 'go-overview-ar',
        label: 'الانتقال إلى نظرة عامة',
        kbd: ['G', 'O']
      }, {
        id: 'go-services-ar',
        label: 'الانتقال إلى الخدمات',
        kbd: ['G', 'S']
      }, {
        id: 'go-deployments-ar',
        label: 'الانتقال إلى عمليات النشر',
        kbd: ['G', 'D']
      }, {
        id: 'go-incidents-ar',
        label: 'الانتقال إلى الحوادث النشطة',
        kbd: ['G', 'I']
      }]
    }, {
      heading: 'إنشاء',
      items: [{
        id: 'new-svc-ar',
        label: 'خدمة جديدة…',
        kbd: ['⌘', 'N']
      }, {
        id: 'invite-ar',
        label: 'دعوة عضو في الفريق',
        kbd: []
      }]
    }];
    return <div dir="rtl" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
      padding: 32
    }}>
        <button className="btn" onClick={() => setOpen(true)} style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8
      }}>
          فتح لوحة الأوامر
          <span className="kbd-chord">
            <kbd className="kbd">⌘</kbd>
            <kbd className="kbd">K</kbd>
          </span>
        </button>
        <CommandDialog open={open} onOpenChange={setOpen} title="لوحة الأوامر" groups={rtlGroups} placeholder="اكتب أمراً أو ابحث…" onSelect={() => setOpen(false)} />
      </div>;
  }
}`,...g.parameters?.docs?.source},description:{story:`Right-to-left layout — Arabic labels, search icon and kbd hints mirror via
logical CSS properties. No additional style is needed; the component is
RTL-first by default.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [lastRun, setLastRun] = React.useState<string | null>(null);
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
      width: 720,
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
          <span className="pill" style={{
          fontSize: 11,
          padding: '1px 6px'
        }}>
            main
          </span>
          <div style={{
          flex: 1
        }} />
          <button className="btn ghost" onClick={() => setOpen(true)} aria-label="Open command palette" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 13,
          color: 'var(--fg-subtle)',
          padding: '4px 10px'
        }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Search commands…
            <span className="kbd-chord">
              <kbd className="kbd">⌘</kbd>
              <kbd className="kbd">K</kbd>
            </span>
          </button>
        </div>

        {/* Simulated content */}
        <div style={{
        padding: '20px 24px',
        minHeight: 160
      }}>
          <div style={{
          fontSize: 13,
          color: 'var(--fg-muted)',
          fontFamily: 'var(--font-mono)',
          marginBottom: 12
        }}>
            deploy #511 &mdash; forge-api &mdash; <span style={{
            color: 'var(--fg-faint)'
          }}>2 min ago</span>
          </div>
          {lastRun && <div className="surface" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 12px',
          borderRadius: 6,
          fontSize: 12,
          fontFamily: 'var(--font-mono)',
          color: 'var(--fg)'
        }}>
              Ran: <strong style={{
            color: 'var(--fg)'
          }}>{lastRun}</strong>
            </div>}
          {!lastRun && <div style={{
          fontSize: 13,
          color: 'var(--fg-subtle)'
        }}>
              Press the search bar (or ⌘K) to open the command palette.
            </div>}
        </div>

        <CommandDialog open={open} onOpenChange={setOpen} groups={PLATFORM_GROUPS} placeholder="Type a command or search…" onSelect={id => {
        setLastRun(id);
        setOpen(false);
      }} />
      </div>;
  }
}`,..._.parameters?.docs?.source},description:{story:`Command palette embedded in a realistic IDP topbar. The search trigger
matches the visual pattern used in service catalog and pipeline views —
the user clicks the search bar or presses ⌘K to open the full overlay.`,..._.parameters?.docs?.description}}},v=[`Default`,`AIAgentPalette`,`WithDisabledItems`,`ControlledQuery`,`RTL`,`InContext`]}))();export{p as AIAgentPalette,h as ControlledQuery,f as Default,_ as InContext,g as RTL,m as WithDisabledItems,v as __namedExportsOrder,d as default};