import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Qr as i,Wa as a,t as o}from"./src-DgoylXRw.js";var s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w;e((()=>{s=t(n(),1),o(),c=r(),l=[{value:`open`,label:`Open`,icon:a.eye,description:`Available for assignment`},{value:`inprog`,label:`In progress`,icon:a.zap},{value:`review`,label:`Review`,icon:a.check},{value:`archived`,label:`Archived`,icon:a.folder,disabled:!0}],u=[{value:`sao`,label:`São Paulo · GMT−3`},{value:`nyc`,label:`New York · GMT−5`},{value:`lon`,label:`London · GMT+0`},{value:`mad`,label:`Madrid · GMT+1`},{value:`ber`,label:`Berlin · GMT+1`},{value:`ist`,label:`Istanbul · GMT+3`},{value:`jak`,label:`Jakarta · GMT+7`},{value:`syd`,label:`Sydney · GMT+11`}],d=[{label:`Product`,options:[{value:`platform`,label:`Platform engineering`,icon:a.cpu,description:`12 members · São Paulo`},{value:`design`,label:`Design`,icon:a.sparkle,description:`8 members · São Paulo + NYC`},{value:`data`,label:`Data`,icon:a.gauge,description:`6 members · remote`}]},{label:`Go-to-market`,options:[{value:`sales`,label:`Sales`,icon:a.trending},{value:`mktg`,label:`Marketing`,icon:a.flame},{value:`cs`,label:`Customer success`,icon:a.shield}]},{label:`Operations`,options:[{value:`finance`,label:`Finance`,icon:a.book},{value:`people`,label:`People`,icon:a.user,disabled:!0}]}],f={title:`Forms/Select`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:"Custom single-value picker from a closed set. Supports leading icons, per-option icons and descriptions, option groups, and an optional typeahead search. Panel uses `position:fixed` to escape parent `overflow:hidden`. Use `NativeSelect` for short lists where system look-and-feel is acceptable."}}},args:{options:l,placeholder:`Choose a status…`,size:`md`,disabled:!1,invalid:!1,searchable:!1},argTypes:{size:{control:`radio`,options:[`sm`,`md`,`lg`]},disabled:{control:`boolean`},invalid:{control:`boolean`},searchable:{control:`boolean`},full:{control:`boolean`}}},p={},m={args:{value:`open`,placeholder:void 0}},h={args:{value:`inprog`,leadingIcon:a.zap,placeholder:void 0}},g={args:{options:l,value:void 0}},_={args:{options:void 0,groups:d,placeholder:`Pick a team`}},v={args:{options:u,searchable:!0,placeholder:`Choose a timezone`}},y={render:()=>(0,c.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:12,maxWidth:280},children:[(0,c.jsx)(i,{size:`sm`,options:l,placeholder:`Small`}),(0,c.jsx)(i,{options:l,placeholder:`Medium (default)`}),(0,c.jsx)(i,{size:`lg`,options:l,placeholder:`Large`})]})},b={args:{invalid:!0,error:`Status is required.`,placeholder:`Choose a status…`}},x={args:{value:`open`,disabled:!0}},S={render:()=>(0,c.jsx)(`div`,{dir:`rtl`,style:{maxWidth:320},children:(0,c.jsx)(i,{options:[{value:`open`,label:`مفتوح`,icon:a.eye,description:`متاح للتعيين`},{value:`inprog`,label:`قيد التنفيذ`,icon:a.zap},{value:`review`,label:`مراجعة`,icon:a.check}],placeholder:`اختر الحالة`})})},C={render:()=>{let[e,t]=s.useState(`open`),[n,r]=s.useState(void 0),[a,o]=s.useState(`platform`);return(0,c.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:20,maxWidth:320},children:[(0,c.jsx)(i,{label:`Status`,value:e,onValueChange:t,options:l,help:`Pick the work state for this item.`}),(0,c.jsx)(i,{label:`Timezone`,value:n,onValueChange:r,options:u,searchable:!0,placeholder:`Choose a timezone`,help:`Type to filter all 8 supported zones.`}),(0,c.jsx)(i,{label:`Team`,value:a,onValueChange:o,groups:d,searchable:!0,placeholder:`Pick a team`})]})}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{}`,...p.parameters?.docs?.source},description:{story:`Default — click to open, click an option to commit, Escape or click-away to dismiss.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'open',
    placeholder: undefined
  }
}`,...m.parameters?.docs?.source},description:{story:`Pre-selected value — trigger shows the label and leading icon.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'inprog',
    leadingIcon: Icons.zap,
    placeholder: undefined
  }
}`,...h.parameters?.docs?.source},description:{story:`Leading icon on the trigger — use when the field category benefits from a quick visual cue.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    options: STATUS_OPTS,
    value: undefined
  }
}`,...g.parameters?.docs?.source},description:{story:`Per-option icons and descriptions — use when labels alone are ambiguous.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    options: undefined,
    groups: TEAM_GROUPS,
    placeholder: 'Pick a team'
  }
}`,..._.parameters?.docs?.source},description:{story:"Grouped options — pass `groups` instead of `options` to add labelled clusters.",..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    options: TZ_OPTS,
    searchable: true,
    placeholder: 'Choose a timezone'
  }
}`,...v.parameters?.docs?.source},description:{story:`Searchable — renders a filter input above the list.
 Recommended when the list has more than ~10 items.`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    maxWidth: 280
  }}>
      <Select size="sm" options={STATUS_OPTS} placeholder="Small" />
      <Select options={STATUS_OPTS} placeholder="Medium (default)" />
      <Select size="lg" options={STATUS_OPTS} placeholder="Large" />
    </div>
}`,...y.parameters?.docs?.source},description:{story:`All three sizes: sm · md · lg — heights match the .btn family (26 / 32 / 40 px).`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    invalid: true,
    error: 'Status is required.',
    placeholder: 'Choose a status…'
  }
}`,...b.parameters?.docs?.source},description:{story:`Invalid state — trigger border and focus ring switch to the danger token.`,...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'open',
    disabled: true
  }
}`,...x.parameters?.docs?.source},description:{story:`Disabled — trigger is dimmed and non-interactive.`,...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <div dir="rtl" style={{
    maxWidth: 320
  }}>
      <Select options={[{
      value: 'open',
      label: 'مفتوح',
      icon: Icons.eye,
      description: 'متاح للتعيين'
    }, {
      value: 'inprog',
      label: 'قيد التنفيذ',
      icon: Icons.zap
    }, {
      value: 'review',
      label: 'مراجعة',
      icon: Icons.check
    }]} placeholder="اختر الحالة" />
    </div>
}`,...S.parameters?.docs?.source},description:{story:`Right-to-left layout — chevron and value cluster auto-flip via logical CSS.`,...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [status, setStatus] = React.useState<string | undefined>('open');
    const [tz, setTz] = React.useState<string | undefined>(undefined);
    const [team, setTeam] = React.useState<string | undefined>('platform');
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      maxWidth: 320
    }}>
        <Select label="Status" value={status} onValueChange={setStatus} options={STATUS_OPTS} help="Pick the work state for this item." />
        <Select label="Timezone" value={tz} onValueChange={setTz} options={TZ_OPTS} searchable placeholder="Choose a timezone" help="Type to filter all 8 supported zones." />
        <Select label="Team" value={team} onValueChange={setTeam} groups={TEAM_GROUPS} searchable placeholder="Pick a team" />
      </div>;
  }
}`,...C.parameters?.docs?.source},description:{story:`Fully interactive demo with local state — label, value, error, and helper text.`,...C.parameters?.docs?.description}}},w=[`Default`,`Selected`,`WithIcon`,`WithOptionIcons`,`Grouped`,`Searchable`,`Sizes`,`Invalid`,`Disabled`,`RTL`,`InContext`]}))();export{p as Default,x as Disabled,_ as Grouped,C as InContext,b as Invalid,S as RTL,v as Searchable,m as Selected,y as Sizes,h as WithIcon,g as WithOptionIcons,w as __namedExportsOrder,f as default};