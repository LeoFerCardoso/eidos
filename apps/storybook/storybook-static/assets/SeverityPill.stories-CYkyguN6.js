import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{Na as r,t as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u,d,f,p;e((()=>{t(),i(),a=n(),o={title:`Primitives/SeverityPill`,component:r,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:`Compact pill that communicates incident / alert / change-risk severity. Follows the Forge P0–P3 convention: P0 = Critical (highest), P3 = Notice (lowest). Use in incident tables, alert feeds, change-management queues, and SLO dashboards wherever a glanceable severity level is required.`}}},args:{level:`p1`,icon:!0},argTypes:{level:{control:`inline-radio`,options:[`p0`,`p1`,`p2`,`p3`]},icon:{control:`boolean`},label:{control:`text`}}},s={render:e=>(0,a.jsx)(r,{...e})},c={render:()=>(0,a.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:10,alignItems:`center`},children:[(0,a.jsx)(r,{level:`p0`}),(0,a.jsx)(r,{level:`p1`}),(0,a.jsx)(r,{level:`p2`}),(0,a.jsx)(r,{level:`p3`})]})},l={render:()=>(0,a.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:10,alignItems:`center`},children:[(0,a.jsx)(r,{level:`p0`,icon:!1}),(0,a.jsx)(r,{level:`p1`,icon:!1}),(0,a.jsx)(r,{level:`p2`,icon:!1}),(0,a.jsx)(r,{level:`p3`,icon:!1})]})},u={render:()=>(0,a.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:10,alignItems:`center`},children:[(0,a.jsx)(r,{level:`p0`,label:`SEV-1 · Full outage`}),(0,a.jsx)(r,{level:`p1`,label:`SEV-2 · Partial degradation`}),(0,a.jsx)(r,{level:`p2`,label:`SEV-3 · Single-region`}),(0,a.jsx)(r,{level:`p3`,label:`SEV-4 · Informational`})]})},d={render:()=>(0,a.jsxs)(`div`,{className:`surface`,style:{borderRadius:10,overflow:`hidden`,maxWidth:560},children:[(0,a.jsx)(`div`,{style:{padding:`10px 16px`,fontWeight:600,fontSize:`var(--text-sm)`,color:`var(--fg-muted)`,borderBottom:`1px solid var(--border)`},children:`Active incidents`}),[{id:`INC-4821`,title:`Auth service unavailable — us-east-1`,level:`p0`,age:`8 min ago`},{id:`INC-4819`,title:`Elevated latency — payments API`,level:`p1`,age:`34 min ago`},{id:`INC-4815`,title:`CDN cache miss rate above threshold`,level:`p2`,age:`2 h ago`},{id:`INC-4802`,title:`Non-critical config drift detected`,level:`p3`,age:`1 d ago`}].map(e=>(0,a.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:12,padding:`10px 16px`,borderBottom:`1px solid var(--border)`},children:[(0,a.jsx)(r,{level:e.level}),(0,a.jsx)(`span`,{style:{flex:1,fontSize:`var(--text-sm)`,color:`var(--fg)`},children:e.title}),(0,a.jsxs)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`,whiteSpace:`nowrap`},children:[e.id,` · `,e.age]})]},e.id))]})},f={render:()=>(0,a.jsxs)(`div`,{dir:`rtl`,style:{display:`flex`,flexDirection:`column`,gap:12},children:[(0,a.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:10,alignItems:`center`},children:[(0,a.jsx)(r,{level:`p0`}),(0,a.jsx)(r,{level:`p1`}),(0,a.jsx)(r,{level:`p2`}),(0,a.jsx)(r,{level:`p3`})]}),(0,a.jsx)(`div`,{className:`surface`,style:{borderRadius:8,overflow:`hidden`,maxWidth:480},children:[{id:`INC-4821`,title:`خدمة المصادقة غير متاحة`,level:`p0`},{id:`INC-4819`,title:`زمن استجابة مرتفع — واجهة المدفوعات`,level:`p1`}].map(e=>(0,a.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:12,padding:`10px 16px`,borderBottom:`1px solid var(--border)`},children:[(0,a.jsx)(r,{level:e.level}),(0,a.jsx)(`span`,{style:{flex:1,fontSize:`var(--text-sm)`,color:`var(--fg)`},children:e.title}),(0,a.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:e.id})]},e.id))})]})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: args => <SeverityPill {...args} />
}`,...s.parameters?.docs?.source},description:{story:`Default — P1 Major with alert icon, as it appears in an incident feed.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'center'
  }}>
      <SeverityPill level="p0" />
      <SeverityPill level="p1" />
      <SeverityPill level="p2" />
      <SeverityPill level="p3" />
    </div>
}`,...c.parameters?.docs?.source},description:{story:`All four severity levels side by side — P0 Critical through P3 Notice.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'center'
  }}>
      <SeverityPill level="p0" icon={false} />
      <SeverityPill level="p1" icon={false} />
      <SeverityPill level="p2" icon={false} />
      <SeverityPill level="p3" icon={false} />
    </div>
}`,...l.parameters?.docs?.source},description:{story:`Icon suppressed — use in dense tables where the dot-only tint carries the signal.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'center'
  }}>
      <SeverityPill level="p0" label="SEV-1 · Full outage" />
      <SeverityPill level="p1" label="SEV-2 · Partial degradation" />
      <SeverityPill level="p2" label="SEV-3 · Single-region" />
      <SeverityPill level="p3" label="SEV-4 · Informational" />
    </div>
}`,...u.parameters?.docs?.source},description:{story:`Custom label — override the default text for a specific incident context.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div className="surface" style={{
    borderRadius: 10,
    overflow: 'hidden',
    maxWidth: 560
  }}>
      <div style={{
      padding: '10px 16px',
      fontWeight: 600,
      fontSize: 'var(--text-sm)',
      color: 'var(--fg-muted)',
      borderBottom: '1px solid var(--border)'
    }}>
        Active incidents
      </div>
      {[{
      id: 'INC-4821',
      title: 'Auth service unavailable — us-east-1',
      level: 'p0' as const,
      age: '8 min ago'
    }, {
      id: 'INC-4819',
      title: 'Elevated latency — payments API',
      level: 'p1' as const,
      age: '34 min ago'
    }, {
      id: 'INC-4815',
      title: 'CDN cache miss rate above threshold',
      level: 'p2' as const,
      age: '2 h ago'
    }, {
      id: 'INC-4802',
      title: 'Non-critical config drift detected',
      level: 'p3' as const,
      age: '1 d ago'
    }].map(inc => <div key={inc.id} style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 16px',
      borderBottom: '1px solid var(--border)'
    }}>
          <SeverityPill level={inc.level} />
          <span style={{
        flex: 1,
        fontSize: 'var(--text-sm)',
        color: 'var(--fg)'
      }}>
            {inc.title}
          </span>
          <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)',
        whiteSpace: 'nowrap'
      }}>
            {inc.id} · {inc.age}
          </span>
        </div>)}
    </div>
}`,...d.parameters?.docs?.source},description:{story:`In context — severity pills used inside an incident list surface.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div dir="rtl" style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  }}>
      <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10,
      alignItems: 'center'
    }}>
        <SeverityPill level="p0" />
        <SeverityPill level="p1" />
        <SeverityPill level="p2" />
        <SeverityPill level="p3" />
      </div>
      <div className="surface" style={{
      borderRadius: 8,
      overflow: 'hidden',
      maxWidth: 480
    }}>
        {[{
        id: 'INC-4821',
        title: 'خدمة المصادقة غير متاحة',
        level: 'p0' as const
      }, {
        id: 'INC-4819',
        title: 'زمن استجابة مرتفع — واجهة المدفوعات',
        level: 'p1' as const
      }].map(inc => <div key={inc.id} style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 16px',
        borderBottom: '1px solid var(--border)'
      }}>
            <SeverityPill level={inc.level} />
            <span style={{
          flex: 1,
          fontSize: 'var(--text-sm)',
          color: 'var(--fg)'
        }}>
              {inc.title}
            </span>
            <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--fg-muted)'
        }}>
              {inc.id}
            </span>
          </div>)}
      </div>
    </div>
}`,...f.parameters?.docs?.source},description:{story:`RTL — pills reverse glyph and text direction under dir="rtl".`,...f.parameters?.docs?.description}}},p=[`Default`,`AllLevels`,`WithoutIcon`,`CustomLabel`,`InContext`,`RTL`]}))();export{c as AllLevels,u as CustomLabel,s as Default,d as InContext,f as RTL,l as WithoutIcon,p as __namedExportsOrder,o as default};