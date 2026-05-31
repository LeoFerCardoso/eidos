import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h,g,_;e((()=>{o=t(n(),1),a(),s=r(),c=[{value:`canary`,title:`Canary 10 %`,description:`Route a small traffic slice first, then ramp gradually.`},{value:`blue-green`,title:`Blue / green`,description:`Stand up a parallel fleet and cut over on health check pass.`},{value:`rolling`,title:`Rolling update`,description:`Replace pods one by one — zero downtime, lower resource cost.`}],l=[{value:`auto`,title:`Auto-assign`,description:`Route to the on-call engineer using the active schedule.`},{value:`team`,title:`Escalate to team`,description:`Notify the full team channel; anyone can claim the incident.`},{value:`manual`,title:`Manual`,description:`Assign explicitly — no automatic paging.`,disabled:!0}],u=[{value:`edge`,title:`Edge`,description:`Sub-ms cold start, ~200 regions.`},{value:`serverless`,title:`Serverless`,description:`Pay-per-invocation, up to 5 min.`},{value:`dedicated`,title:`Dedicated`,description:`Reserved instance, predictable latency.`}],d={title:`Forms/RadioCardGroup`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:`A group of selection cards backed by native radio inputs — exactly one card is selected at a time. Arrow keys move between cards (single tab stop); the selected card receives the ember-soft tint and an ember border. Use when the choice set is small (2–5 options) and each option benefits from a title + description for scannability.`}}},args:{options:c,defaultValue:`canary`,ariaLabel:`Rollout strategy`,orientation:`vertical`,cardOrientation:`horizontal`,disabled:!1},argTypes:{orientation:{control:`inline-radio`,options:[`vertical`,`horizontal`]},cardOrientation:{control:`inline-radio`,options:[`horizontal`,`vertical`]},disabled:{control:`boolean`},value:{control:!1},defaultValue:{control:!1},onValueChange:{action:`valueChanged`},options:{control:!1}}},f={},p={render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:40},children:[(0,s.jsxs)(`section`,{children:[(0,s.jsx)(`div`,{style:{fontFamily:`var(--font-mono)`,fontSize:10,textTransform:`uppercase`,letterSpacing:`0.1em`,color:`var(--fg-faint)`,marginBottom:12},children:`Vertical group · horizontal cards (default)`}),(0,s.jsx)(i,{options:c,defaultValue:`canary`,ariaLabel:`Rollout strategy`,orientation:`vertical`,cardOrientation:`horizontal`})]}),(0,s.jsxs)(`section`,{children:[(0,s.jsx)(`div`,{style:{fontFamily:`var(--font-mono)`,fontSize:10,textTransform:`uppercase`,letterSpacing:`0.1em`,color:`var(--fg-faint)`,marginBottom:12},children:`Horizontal group · horizontal cards`}),(0,s.jsx)(i,{options:u,defaultValue:`serverless`,ariaLabel:`Compute tier`,orientation:`horizontal`,cardOrientation:`horizontal`})]}),(0,s.jsxs)(`section`,{children:[(0,s.jsx)(`div`,{style:{fontFamily:`var(--font-mono)`,fontSize:10,textTransform:`uppercase`,letterSpacing:`0.1em`,color:`var(--fg-faint)`,marginBottom:12},children:`Horizontal group · vertical cards`}),(0,s.jsx)(i,{options:u,defaultValue:`edge`,ariaLabel:`Compute tier`,orientation:`horizontal`,cardOrientation:`vertical`})]})]})},m={render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:40},children:[(0,s.jsxs)(`section`,{children:[(0,s.jsx)(`div`,{style:{fontFamily:`var(--font-mono)`,fontSize:10,textTransform:`uppercase`,letterSpacing:`0.1em`,color:`var(--fg-faint)`,marginBottom:12},children:`Normal — one disabled option`}),(0,s.jsx)(i,{options:l,defaultValue:`auto`,ariaLabel:`Incident routing`,orientation:`vertical`,cardOrientation:`horizontal`})]}),(0,s.jsxs)(`section`,{children:[(0,s.jsx)(`div`,{style:{fontFamily:`var(--font-mono)`,fontSize:10,textTransform:`uppercase`,letterSpacing:`0.1em`,color:`var(--fg-faint)`,marginBottom:12},children:`Entire group disabled`}),(0,s.jsx)(i,{options:c,defaultValue:`blue-green`,ariaLabel:`Rollout strategy`,orientation:`vertical`,cardOrientation:`horizontal`,disabled:!0})]})]})},h={render:e=>{function t(){let[t,n]=o.useState(`canary`);return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:14,maxWidth:480},children:[(0,s.jsx)(i,{...e,options:c,value:t,onValueChange:n,ariaLabel:`Rollout strategy`}),(0,s.jsxs)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-muted)`},children:[`selected: `,(0,s.jsx)(`span`,{style:{color:`var(--accent)`},children:t})]})]})}return(0,s.jsx)(t,{})}},g={render:()=>(0,s.jsx)(`div`,{dir:`rtl`,style:{maxWidth:440},children:(0,s.jsx)(i,{options:[{value:`canary`,title:`كناري 10٪`,description:`توجيه جزء صغير من الحركة أولاً، ثم الرفع التدريجي.`},{value:`blue-green`,title:`أزرق / أخضر`,description:`إطلاق أسطول موازٍ والتحويل الكامل بعد اجتياز الفحص.`},{value:`rolling`,title:`تحديث متدرج`,description:`استبدال الحاويات واحدة تلو الأخرى — دون توقف.`}],defaultValue:`canary`,ariaLabel:`استراتيجية النشر`,orientation:`vertical`,cardOrientation:`horizontal`})})},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{}`,...f.parameters?.docs?.source},description:{story:'Uncontrolled — `defaultValue="canary"` pre-selects that card. Click any card\nto move the selection; the group owns its state internally.',...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 40
  }}>
      <section>
        <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--fg-faint)',
        marginBottom: 12
      }}>
          Vertical group · horizontal cards (default)
        </div>
        <RadioCardGroup options={ROLLOUT_OPTIONS} defaultValue="canary" ariaLabel="Rollout strategy" orientation="vertical" cardOrientation="horizontal" />
      </section>

      <section>
        <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--fg-faint)',
        marginBottom: 12
      }}>
          Horizontal group · horizontal cards
        </div>
        <RadioCardGroup options={COMPUTE_TIER} defaultValue="serverless" ariaLabel="Compute tier" orientation="horizontal" cardOrientation="horizontal" />
      </section>

      <section>
        <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--fg-faint)',
        marginBottom: 12
      }}>
          Horizontal group · vertical cards
        </div>
        <RadioCardGroup options={COMPUTE_TIER} defaultValue="edge" ariaLabel="Compute tier" orientation="horizontal" cardOrientation="vertical" />
      </section>
    </div>
}`,...p.parameters?.docs?.source},description:{story:`Layout variants side by side:
- **Vertical group, horizontal cards** (default) — best for 2–4 options with
  short descriptions.
- **Horizontal group, horizontal cards** — cards flow in a row; good for 2–3
  short-label options in a wizard step.
- **Horizontal group, vertical cards** — control on top, content below; use for
  icon-first picker layouts.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 40
  }}>
      <section>
        <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--fg-faint)',
        marginBottom: 12
      }}>
          Normal — one disabled option
        </div>
        <RadioCardGroup options={INCIDENT_ROUTING} defaultValue="auto" ariaLabel="Incident routing" orientation="vertical" cardOrientation="horizontal" />
      </section>

      <section>
        <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--fg-faint)',
        marginBottom: 12
      }}>
          Entire group disabled
        </div>
        <RadioCardGroup options={ROLLOUT_OPTIONS} defaultValue="blue-green" ariaLabel="Rollout strategy" orientation="vertical" cardOrientation="horizontal" disabled />
      </section>
    </div>
}`,...m.parameters?.docs?.source},description:{story:`All interactive states in one view: normal, with a disabled individual option,
and the entire group disabled.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => {
    function Demo() {
      const [v, setV] = React.useState('canary');
      return <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        maxWidth: 480
      }}>
          <RadioCardGroup {...args} options={ROLLOUT_OPTIONS} value={v} onValueChange={setV} ariaLabel="Rollout strategy" />
          <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--fg-muted)'
        }}>
            selected: <span style={{
            color: 'var(--accent)'
          }}>{v}</span>
          </span>
        </div>;
    }
    return <Demo />;
  }
}`,...h.parameters?.docs?.source},description:{story:"Controlled — external state drives the selection. The selected value is echoed\nbelow the group using `var(--font-mono)` so it is easy to inspect in demos.",...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div dir="rtl" style={{
    maxWidth: 440
  }}>
      <RadioCardGroup options={[{
      value: 'canary',
      title: 'كناري 10٪',
      description: 'توجيه جزء صغير من الحركة أولاً، ثم الرفع التدريجي.'
    }, {
      value: 'blue-green',
      title: 'أزرق / أخضر',
      description: 'إطلاق أسطول موازٍ والتحويل الكامل بعد اجتياز الفحص.'
    }, {
      value: 'rolling',
      title: 'تحديث متدرج',
      description: 'استبدال الحاويات واحدة تلو الأخرى — دون توقف.'
    }]} defaultValue="canary" ariaLabel="استراتيجية النشر" orientation="vertical" cardOrientation="horizontal" />
    </div>
}`,...g.parameters?.docs?.source},description:{story:'RTL — `dir="rtl"` mirrors card layout and radio control position. The group\nlayout CSS uses logical properties throughout.',...g.parameters?.docs?.description}}},_=[`Default`,`Variants`,`States`,`Controlled`,`RTL`]}))();export{h as Controlled,f as Default,g as RTL,m as States,p as Variants,_ as __namedExportsOrder,d as default};