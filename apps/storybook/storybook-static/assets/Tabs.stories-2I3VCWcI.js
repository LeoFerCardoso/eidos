import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{d as i,f as a,p as o,t as s,u as c}from"./src-DgoylXRw.js";var l,u,d,f,p,m,h,g,_,v,y;e((()=>{l=t(n(),1),s(),u=r(),d={title:`Primitives/Tabs`,component:c,tags:[`autodocs`],parameters:{docs:{description:{component:'Compound tab component. Compose `<Tabs>` → `<TabsList>` → `<TabsTrigger value="…">` + `<TabsContent value="…">`. Full ARIA (tablist/tab/tabpanel), roving tabindex, keyboard navigation (Arrow, Home, End), RTL-aware directional keys, and `prefers-reduced-motion` support.'}}}},f={render:()=>(0,u.jsxs)(c,{defaultValue:`overview`,children:[(0,u.jsxs)(a,{"aria-label":`Service sections`,children:[(0,u.jsx)(o,{value:`overview`,children:`Overview`}),(0,u.jsx)(o,{value:`deploys`,children:`Deploys`}),(0,u.jsx)(o,{value:`runbooks`,children:`Runbooks`}),(0,u.jsx)(o,{value:`settings`,children:`Settings`})]}),(0,u.jsx)(i,{value:`overview`,children:`High-signal summary of the service. Owner, region, last deploy, current SLO burn.`}),(0,u.jsx)(i,{value:`deploys`,children:`A timeline of every release that touched this service in the last 30 days.`}),(0,u.jsx)(i,{value:`runbooks`,children:`Linked runbooks — each a single-page playbook with role, severity, and exact commands.`}),(0,u.jsx)(i,{value:`settings`,children:`Service-level configuration: alert routes, on-call rotation, dependency map.`})]})},p={render:()=>(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:32},children:[(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`p`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-faint)`,marginBottom:12,textTransform:`uppercase`,letterSpacing:`0.12em`},children:`line`}),(0,u.jsxs)(c,{defaultValue:`a`,variant:`line`,children:[(0,u.jsxs)(a,{children:[(0,u.jsx)(o,{value:`a`,children:`Overview`}),(0,u.jsx)(o,{value:`b`,children:`Deploys`}),(0,u.jsx)(o,{value:`c`,children:`Settings`})]}),(0,u.jsx)(i,{value:`a`,children:`Line variant — page-level navigation.`}),(0,u.jsx)(i,{value:`b`,children:`Deploy timeline.`}),(0,u.jsx)(i,{value:`c`,children:`Settings panel.`})]})]}),(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`p`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-faint)`,marginBottom:12,textTransform:`uppercase`,letterSpacing:`0.12em`},children:`pills`}),(0,u.jsxs)(c,{defaultValue:`day`,variant:`pills`,children:[(0,u.jsxs)(a,{children:[(0,u.jsx)(o,{value:`day`,children:`Day`}),(0,u.jsx)(o,{value:`week`,children:`Week`}),(0,u.jsx)(o,{value:`month`,children:`Month`}),(0,u.jsx)(o,{value:`year`,children:`Year`})]}),(0,u.jsx)(i,{value:`day`,children:`Data for the last 24 hours.`}),(0,u.jsx)(i,{value:`week`,children:`Data for the last 7 days, hourly aggregation.`}),(0,u.jsx)(i,{value:`month`,children:`Data for the last 30 days, daily aggregation.`}),(0,u.jsx)(i,{value:`year`,children:`Data for the last 12 months, weekly aggregation.`})]})]}),(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`p`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-faint)`,marginBottom:12,textTransform:`uppercase`,letterSpacing:`0.12em`},children:`enclosed`}),(0,u.jsxs)(c,{defaultValue:`preview`,variant:`enclosed`,children:[(0,u.jsxs)(a,{children:[(0,u.jsx)(o,{value:`preview`,children:`Preview`}),(0,u.jsx)(o,{value:`code`,children:`Code`}),(0,u.jsx)(o,{value:`tokens`,children:`Tokens`})]}),(0,u.jsx)(i,{value:`preview`,children:`Live component preview area.`}),(0,u.jsx)(i,{value:`code`,children:`Source code snippet.`}),(0,u.jsx)(i,{value:`tokens`,children:`Design token values.`})]})]})]})},m={render:()=>(0,u.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:32},children:[(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`p`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-faint)`,marginBottom:12,textTransform:`uppercase`,letterSpacing:`0.12em`},children:`md (default)`}),(0,u.jsxs)(c,{defaultValue:`a`,size:`md`,children:[(0,u.jsxs)(a,{children:[(0,u.jsx)(o,{value:`a`,children:`Overview`}),(0,u.jsx)(o,{value:`b`,children:`Deploys`}),(0,u.jsx)(o,{value:`c`,children:`Settings`})]}),(0,u.jsx)(i,{value:`a`,children:`Medium-size tab strip.`}),(0,u.jsx)(i,{value:`b`,children:`Deploys content.`}),(0,u.jsx)(i,{value:`c`,children:`Settings content.`})]})]}),(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`p`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-faint)`,marginBottom:12,textTransform:`uppercase`,letterSpacing:`0.12em`},children:`sm`}),(0,u.jsxs)(c,{defaultValue:`a`,size:`sm`,children:[(0,u.jsxs)(a,{children:[(0,u.jsx)(o,{value:`a`,children:`Overview`}),(0,u.jsx)(o,{value:`b`,children:`Deploys`}),(0,u.jsx)(o,{value:`c`,children:`Settings`})]}),(0,u.jsx)(i,{value:`a`,children:`Small tab strip for dense layouts.`}),(0,u.jsx)(i,{value:`b`,children:`Deploys content.`}),(0,u.jsx)(i,{value:`c`,children:`Settings content.`})]})]})]})},h={render:()=>(0,u.jsxs)(c,{defaultValue:`overview`,orientation:`vertical`,children:[(0,u.jsxs)(a,{"aria-label":`Service sections`,children:[(0,u.jsx)(o,{value:`overview`,children:`Overview`}),(0,u.jsx)(o,{value:`deploys`,children:`Deploys`}),(0,u.jsx)(o,{value:`runbooks`,children:`Runbooks`}),(0,u.jsx)(o,{value:`settings`,children:`Settings`})]}),(0,u.jsx)(i,{value:`overview`,children:`High-signal service summary.`}),(0,u.jsx)(i,{value:`deploys`,children:`Release timeline.`}),(0,u.jsx)(i,{value:`runbooks`,children:`Linked playbooks.`}),(0,u.jsx)(i,{value:`settings`,children:`Service configuration.`})]})},g={render:()=>(0,u.jsxs)(c,{defaultValue:`overview`,children:[(0,u.jsxs)(a,{children:[(0,u.jsx)(o,{value:`overview`,children:`Overview`}),(0,u.jsx)(o,{value:`deploys`,disabled:!0,children:`Deploys (disabled)`}),(0,u.jsx)(o,{value:`runbooks`,children:`Runbooks`}),(0,u.jsx)(o,{value:`settings`,disabled:!0,children:`Settings (disabled)`})]}),(0,u.jsx)(i,{value:`overview`,children:`Overview panel — press ArrowRight to jump to Runbooks (Deploys is disabled).`}),(0,u.jsx)(i,{value:`deploys`,children:`You cannot activate this panel.`}),(0,u.jsx)(i,{value:`runbooks`,children:`Runbooks panel.`}),(0,u.jsx)(i,{value:`settings`,children:`You cannot activate this panel.`})]})},_={render:()=>{let[e,t]=l.useState(`overview`);return(0,u.jsxs)(c,{value:e,onValueChange:t,children:[(0,u.jsxs)(a,{"aria-label":`Service sections`,children:[(0,u.jsx)(o,{value:`overview`,children:`Overview`}),(0,u.jsxs)(o,{value:`deploys`,children:[`Deploys `,(0,u.jsx)(`span`,{className:`count`,children:`12`})]}),(0,u.jsxs)(o,{value:`runbooks`,children:[`Runbooks `,(0,u.jsx)(`span`,{className:`count`,children:`3`})]}),(0,u.jsx)(o,{value:`settings`,children:`Settings`})]}),Object.entries({overview:`Owner: Platform Team · Region: us-east-1 · Last deploy: 2 hours ago · SLO burn: 0.3%`,deploys:`v2.4.1 (GMUD-2841) — 2 hrs ago
v2.4.0 (GMUD-2801) — 1 day ago
v2.3.9 (GMUD-2770) — 3 days ago`,runbooks:`RB-001: On-call escalation
RB-002: Database failover
RB-003: Cache invalidation`,settings:`Alert route: PagerDuty #platform
On-call: Weekly rotation
Dependencies: postgres, redis, s3`}).map(([e,t])=>(0,u.jsx)(i,{value:e,style:{whiteSpace:`pre-line`},children:t},e))]})}},v={render:()=>(0,u.jsx)(`div`,{dir:`rtl`,children:(0,u.jsxs)(c,{defaultValue:`overview`,children:[(0,u.jsxs)(a,{"aria-label":`أقسام الخدمة`,children:[(0,u.jsx)(o,{value:`overview`,children:`نظرة عامة`}),(0,u.jsxs)(o,{value:`deploys`,children:[`عمليات النشر `,(0,u.jsx)(`span`,{className:`count`,children:`١٢`})]}),(0,u.jsxs)(o,{value:`runbooks`,children:[`كتب التشغيل `,(0,u.jsx)(`span`,{className:`count`,children:`٤`})]}),(0,u.jsx)(o,{value:`settings`,children:`الإعدادات`})]}),(0,u.jsx)(i,{value:`overview`,children:`ملخّص عالي الإشارة للخدمة. المالك، المنطقة، آخر نشر.`}),(0,u.jsx)(i,{value:`deploys`,children:`الجدول الزمني لكل إصدار في آخر ٣٠ يومًا.`}),(0,u.jsx)(i,{value:`runbooks`,children:`كتب التشغيل المرتبطة.`}),(0,u.jsx)(i,{value:`settings`,children:`إعدادات على مستوى الخدمة.`})]})})},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <Tabs defaultValue="overview">
      <TabsList aria-label="Service sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="deploys">Deploys</TabsTrigger>
        <TabsTrigger value="runbooks">Runbooks</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        High-signal summary of the service. Owner, region, last deploy, current SLO burn.
      </TabsContent>
      <TabsContent value="deploys">
        A timeline of every release that touched this service in the last 30 days.
      </TabsContent>
      <TabsContent value="runbooks">
        Linked runbooks — each a single-page playbook with role, severity, and exact commands.
      </TabsContent>
      <TabsContent value="settings">
        Service-level configuration: alert routes, on-call rotation, dependency map.
      </TabsContent>
    </Tabs>
}`,...f.parameters?.docs?.source},description:{story:`Default compound usage — line variant, automatic activation.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 32
  }}>
      {/* Line (default) */}
      <div>
        <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-faint)',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: '0.12em'
      }}>line</p>
        <Tabs defaultValue="a" variant="line">
          <TabsList>
            <TabsTrigger value="a">Overview</TabsTrigger>
            <TabsTrigger value="b">Deploys</TabsTrigger>
            <TabsTrigger value="c">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="a">Line variant — page-level navigation.</TabsContent>
          <TabsContent value="b">Deploy timeline.</TabsContent>
          <TabsContent value="c">Settings panel.</TabsContent>
        </Tabs>
      </div>

      {/* Pills */}
      <div>
        <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-faint)',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: '0.12em'
      }}>pills</p>
        <Tabs defaultValue="day" variant="pills">
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
          <TabsContent value="day">Data for the last 24 hours.</TabsContent>
          <TabsContent value="week">Data for the last 7 days, hourly aggregation.</TabsContent>
          <TabsContent value="month">Data for the last 30 days, daily aggregation.</TabsContent>
          <TabsContent value="year">Data for the last 12 months, weekly aggregation.</TabsContent>
        </Tabs>
      </div>

      {/* Enclosed */}
      <div>
        <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-faint)',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: '0.12em'
      }}>enclosed</p>
        <Tabs defaultValue="preview" variant="enclosed">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">Live component preview area.</TabsContent>
          <TabsContent value="code">Source code snippet.</TabsContent>
          <TabsContent value="tokens">Design token values.</TabsContent>
        </Tabs>
      </div>
    </div>
}`,...p.parameters?.docs?.source},description:{story:`Three visual variants side by side: line, pills, enclosed.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 32
  }}>
      <div>
        <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-faint)',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: '0.12em'
      }}>md (default)</p>
        <Tabs defaultValue="a" size="md">
          <TabsList>
            <TabsTrigger value="a">Overview</TabsTrigger>
            <TabsTrigger value="b">Deploys</TabsTrigger>
            <TabsTrigger value="c">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="a">Medium-size tab strip.</TabsContent>
          <TabsContent value="b">Deploys content.</TabsContent>
          <TabsContent value="c">Settings content.</TabsContent>
        </Tabs>
      </div>
      <div>
        <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-faint)',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: '0.12em'
      }}>sm</p>
        <Tabs defaultValue="a" size="sm">
          <TabsList>
            <TabsTrigger value="a">Overview</TabsTrigger>
            <TabsTrigger value="b">Deploys</TabsTrigger>
            <TabsTrigger value="c">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="a">Small tab strip for dense layouts.</TabsContent>
          <TabsContent value="b">Deploys content.</TabsContent>
          <TabsContent value="c">Settings content.</TabsContent>
        </Tabs>
      </div>
    </div>
}`,...m.parameters?.docs?.source},description:{story:`Size variants — md (default) and sm.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <Tabs defaultValue="overview" orientation="vertical">
      <TabsList aria-label="Service sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="deploys">Deploys</TabsTrigger>
        <TabsTrigger value="runbooks">Runbooks</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">High-signal service summary.</TabsContent>
      <TabsContent value="deploys">Release timeline.</TabsContent>
      <TabsContent value="runbooks">Linked playbooks.</TabsContent>
      <TabsContent value="settings">Service configuration.</TabsContent>
    </Tabs>
}`,...h.parameters?.docs?.source},description:{story:`Vertical orientation — tablist on the left, panel on the right.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="deploys" disabled>Deploys (disabled)</TabsTrigger>
        <TabsTrigger value="runbooks">Runbooks</TabsTrigger>
        <TabsTrigger value="settings" disabled>Settings (disabled)</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview panel — press ArrowRight to jump to Runbooks (Deploys is disabled).</TabsContent>
      <TabsContent value="deploys">You cannot activate this panel.</TabsContent>
      <TabsContent value="runbooks">Runbooks panel.</TabsContent>
      <TabsContent value="settings">You cannot activate this panel.</TabsContent>
    </Tabs>
}`,...g.parameters?.docs?.source},description:{story:`Disabled triggers are skipped during keyboard navigation.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [active, setActive] = React.useState('overview');
    const panels: Record<string, string> = {
      overview: 'Owner: Platform Team · Region: us-east-1 · Last deploy: 2 hours ago · SLO burn: 0.3%',
      deploys: 'v2.4.1 (GMUD-2841) — 2 hrs ago\\nv2.4.0 (GMUD-2801) — 1 day ago\\nv2.3.9 (GMUD-2770) — 3 days ago',
      runbooks: 'RB-001: On-call escalation\\nRB-002: Database failover\\nRB-003: Cache invalidation',
      settings: 'Alert route: PagerDuty #platform\\nOn-call: Weekly rotation\\nDependencies: postgres, redis, s3'
    };
    return <Tabs value={active} onValueChange={setActive}>
        <TabsList aria-label="Service sections">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="deploys">
            Deploys <span className="count">12</span>
          </TabsTrigger>
          <TabsTrigger value="runbooks">
            Runbooks <span className="count">3</span>
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        {Object.entries(panels).map(([v, text]) => <TabsContent key={v} value={v} style={{
        whiteSpace: 'pre-line'
      }}>
            {text}
          </TabsContent>)}
      </Tabs>;
  }
}`,..._.parameters?.docs?.source},description:{story:`Realistic IDP context — service detail tabs with count badges.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <div dir="rtl">
      <Tabs defaultValue="overview">
        <TabsList aria-label="أقسام الخدمة">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="deploys">
            عمليات النشر <span className="count">١٢</span>
          </TabsTrigger>
          <TabsTrigger value="runbooks">
            كتب التشغيل <span className="count">٤</span>
          </TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">ملخّص عالي الإشارة للخدمة. المالك، المنطقة، آخر نشر.</TabsContent>
        <TabsContent value="deploys">الجدول الزمني لكل إصدار في آخر ٣٠ يومًا.</TabsContent>
        <TabsContent value="runbooks">كتب التشغيل المرتبطة.</TabsContent>
        <TabsContent value="settings">إعدادات على مستوى الخدمة.</TabsContent>
      </Tabs>
    </div>
}`,...v.parameters?.docs?.source},description:{story:`RTL — first tab lands on the right; arrow keys mirror.`,...v.parameters?.docs?.description}}},y=[`Default`,`Variants`,`Sizes`,`Vertical`,`WithDisabled`,`InContext`,`RTL`]}))();export{f as Default,_ as InContext,v as RTL,m as Sizes,p as Variants,h as Vertical,g as WithDisabled,y as __namedExportsOrder,d as default};