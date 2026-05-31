import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Gr as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h,g,_,v,y;e((()=>{o=t(n(),1),a(),s=r(),c=[{value:`auth`,label:`auth-service`,meta:`Go`},{value:`api-gw`,label:`api-gateway`,meta:`Node`},{value:`billing`,label:`billing-service`,meta:`Python`},{value:`notify`,label:`notification-svc`,meta:`Go`},{value:`search`,label:`search-service`,meta:`Rust`},{value:`ml-infer`,label:`ml-inference`,meta:`Python`},{value:`data-pipe`,label:`data-pipeline`,meta:`Spark`},{value:`cdn`,label:`cdn-manager`,meta:`Nginx`},{value:`vault`,label:`secrets-vault`,meta:`Go`,disabled:!0}],l=[{value:`platform`,label:`Platform`},{value:`frontend`,label:`Frontend`},{value:`backend`,label:`Backend`},{value:`data`,label:`Data & ML`},{value:`security`,label:`Security`},{value:`infra`,label:`Infrastructure`},{value:`product`,label:`Product`,disabled:!0}],u=[{label:`Production`,options:[{value:`us-east-1`,label:`us-east-1`,meta:`N. Virginia`},{value:`us-west-2`,label:`us-west-2`,meta:`Oregon`},{value:`eu-west-1`,label:`eu-west-1`,meta:`Ireland`},{value:`ap-southeast-1`,label:`ap-southeast-1`,meta:`Singapore`}]},{label:`Staging`,options:[{value:`sa-east-1`,label:`sa-east-1`,meta:`São Paulo`},{value:`ap-southeast-2`,label:`ap-southeast-2`,meta:`Sydney`}]},{label:`Development`,options:[{value:`dev-local`,label:`dev-local`,meta:`Local`}]}],d={title:`Forms/Combobox`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:"Searchable single/multi-select with a fixed-position popover panel. Keyboard: arrows navigate, Enter commits, Escape closes. Multi mode shows chips below the trigger. Pass `groups` for grouped options."}}},args:{options:c,value:null,onValueChange:()=>{},placeholder:`Select a service`,size:`md`,disabled:!1,invalid:!1,multiple:!1},argTypes:{size:{control:`radio`,options:[`sm`,`md`,`lg`]},disabled:{control:`boolean`},invalid:{control:`boolean`},multiple:{control:`boolean`},full:{control:`boolean`}}},f={render:e=>{let[t,n]=o.useState(null);return(0,s.jsx)(i,{...e,value:t,onValueChange:e=>n(e)})}},p={render:e=>{let[t,n]=o.useState([`platform`,`frontend`]);return(0,s.jsx)(i,{...e,options:l,value:t,onValueChange:e=>n(e),multiple:!0,placeholder:`Choose teams`})}},m={args:{options:c,value:null,multiple:!1,placeholder:`Find a service…`}},h={args:{options:void 0,groups:u,value:null,placeholder:`Pick a region`,width:`280px`}},g={args:{value:`auth`,disabled:!0}},_={args:{value:null,invalid:!0,placeholder:`Service is required`}},v={render:()=>{let[e,t]=o.useState(null),[n,r]=o.useState([`platform`,`data`]),[a,d]=o.useState(null);return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:24,maxWidth:320},children:[(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`div`,{style:{marginBottom:6,fontSize:12,fontFamily:`var(--font-mono)`,color:`var(--fg-faint)`,textTransform:`uppercase`,letterSpacing:`0.08em`},children:`Single select`}),(0,s.jsx)(i,{options:c,value:e,onChange:e=>t(e),placeholder:`Select a service`,full:!0})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`div`,{style:{marginBottom:6,fontSize:12,fontFamily:`var(--font-mono)`,color:`var(--fg-faint)`,textTransform:`uppercase`,letterSpacing:`0.08em`},children:`Multi-select`}),(0,s.jsx)(i,{options:l,value:n,onChange:e=>r(e),placeholder:`Choose teams`,multiple:!0,full:!0})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`div`,{style:{marginBottom:6,fontSize:12,fontFamily:`var(--font-mono)`,color:`var(--fg-faint)`,textTransform:`uppercase`,letterSpacing:`0.08em`},children:`Grouped regions`}),(0,s.jsx)(i,{groups:u,value:a,onChange:e=>d(e),placeholder:`Pick a region`,full:!0})]})]})}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [value, setValue] = React.useState<string | null>(null);
    return <Combobox {...args} value={value} onValueChange={v => setValue(v as string)} />;
  }
}`,...f.parameters?.docs?.source},description:{story:`Default single-select — click to open, type to filter, click or Enter to commit.
 Wrapped in local state so selecting an option updates the trigger label live.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [value, setValue] = React.useState<string[]>(['platform', 'frontend']);
    return <Combobox {...args} options={TEAMS} value={value} onValueChange={v => setValue(v as string[])} multiple placeholder="Choose teams" />;
  }
}`,...p.parameters?.docs?.source},description:{story:`Multi-select (pass \`multiple\`) — each click toggles. Chips render below the trigger;
 the trigger label shows the selected count. Disabled options are skipped.
 Wrapped in local state so toggling chips updates live.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    options: SERVICES,
    value: null,
    multiple: false,
    placeholder: 'Find a service…'
  }
}`,...m.parameters?.docs?.source},description:{story:`Searchable single-select — the search input is always visible.
 Type to filter; arrow keys navigate; Enter commits.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    options: undefined,
    groups: GROUPED_REGIONS,
    value: null,
    placeholder: 'Pick a region',
    width: '280px'
  }
}`,...h.parameters?.docs?.source},description:{story:"Grouped options — pass `groups` instead of `options`.\n Empty groups hide automatically when the query filters them out.",...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'auth',
    disabled: true
  }
}`,...g.parameters?.docs?.source},description:{story:`Disabled state — trigger is dimmed and non-interactive.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    value: null,
    invalid: true,
    placeholder: 'Service is required'
  }
}`,..._.parameters?.docs?.source},description:{story:"Invalid state — trigger border and focus ring switch to the danger token.\n Pair with an `.in-error` helper line below the field in production.",..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [single, setSingle] = React.useState<string | null>(null);
    const [multi, setMulti] = React.useState<string[]>(['platform', 'data']);
    const [region, setRegion] = React.useState<string | null>(null);
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      maxWidth: 320
    }}>
        <div>
          <div style={{
          marginBottom: 6,
          fontSize: 12,
          fontFamily: 'var(--font-mono)',
          color: 'var(--fg-faint)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em'
        }}>Single select</div>
          <Combobox options={SERVICES} value={single} onChange={v => setSingle(v as string)} placeholder="Select a service" full />
        </div>
        <div>
          <div style={{
          marginBottom: 6,
          fontSize: 12,
          fontFamily: 'var(--font-mono)',
          color: 'var(--fg-faint)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em'
        }}>Multi-select</div>
          <Combobox options={TEAMS} value={multi} onChange={v => setMulti(v as string[])} placeholder="Choose teams" multiple full />
        </div>
        <div>
          <div style={{
          marginBottom: 6,
          fontSize: 12,
          fontFamily: 'var(--font-mono)',
          color: 'var(--fg-faint)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em'
        }}>Grouped regions</div>
          <Combobox groups={GROUPED_REGIONS} value={region} onChange={v => setRegion(v as string)} placeholder="Pick a region" full />
        </div>
      </div>;
  }
}`,...v.parameters?.docs?.source},description:{story:`Fully interactive demo with local state — try searching, selecting, and
 removing chips in both single and multi mode.`,...v.parameters?.docs?.description}}},y=[`Default`,`Multiple`,`Searchable`,`Grouped`,`Disabled`,`Invalid`,`Interactive`]}))();export{f as Default,g as Disabled,h as Grouped,v as Interactive,_ as Invalid,p as Multiple,m as Searchable,y as __namedExportsOrder,d as default};