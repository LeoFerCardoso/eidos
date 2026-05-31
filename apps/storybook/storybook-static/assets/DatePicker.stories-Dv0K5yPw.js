import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{qr as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h,g,_;e((()=>{o=t(n(),1),a(),s=r(),c={title:`Forms/DatePicker`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:'A trigger button paired with a Calendar popover. Clicking the trigger opens a month-grid calendar; selecting a day closes the popover and fires `onValueChange`. Uses `position:fixed` to escape `overflow:hidden` ancestors. For the native `<input type="date">` wrapper use **Forms/DateInput** instead.'}}},argTypes:{label:{control:`text`},placeholder:{control:`text`},disabled:{control:`boolean`},invalid:{control:`boolean`},size:{control:`select`,options:[`sm`,`md`,`lg`]},locale:{control:`text`},weekStartsOn:{control:`select`,options:[0,1]},value:{control:!1},onValueChange:{action:`valueChanged`},format:{control:!1}},args:{label:`Target date`,placeholder:`Pick a date`}},l={},u={render:e=>{let[t,n]=o.useState(new Date(2026,5,15));return(0,s.jsx)(i,{...e,value:t,onValueChange:n,label:`Delivery date`})}},d={render:e=>{let[t,n]=o.useState(void 0),r=new Date,a=new Date(r);return a.setDate(r.getDate()+30),(0,s.jsx)(i,{...e,value:t,onValueChange:n,min:r,max:a,label:`Departure date`,placeholder:`Must be within 30 days`})}},f={render:e=>(0,s.jsxs)(`div`,{style:{display:`flex`,gap:12,alignItems:`flex-end`,flexWrap:`wrap`},children:[(0,s.jsx)(i,{...e,size:`sm`,placeholder:`Small`,label:`Small`}),(0,s.jsx)(i,{...e,size:`md`,placeholder:`Medium`,label:`Medium`}),(0,s.jsx)(i,{...e,size:`lg`,placeholder:`Large`,label:`Large`})]})},p={args:{invalid:!0,placeholder:`Required`}},m={args:{disabled:!0,placeholder:`Not available`}},h={render:e=>{let[t,n]=o.useState(void 0);return(0,s.jsx)(`div`,{dir:`rtl`,children:(0,s.jsx)(i,{...e,value:t,onValueChange:n,locale:`ar-EG`,placeholder:`اختر التاريخ`,label:`تاريخ الاستحقاق`})})}},g={render:e=>{let[t,n]=o.useState(void 0);return(0,s.jsxs)(`div`,{style:{maxWidth:320},children:[(0,s.jsx)(i,{...e,value:t,onValueChange:n,label:`Departure date`,placeholder:`Select date`}),(0,s.jsx)(`span`,{style:{display:`block`,marginTop:6,fontSize:`var(--text-sm)`,color:`var(--fg-muted)`},children:`No flights available before today.`})]})}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source},description:{story:`Uncontrolled — click the trigger to open the calendar grid.
Selecting a day closes the panel and echoes the formatted date in the trigger.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [date, setDate] = React.useState<Date>(new Date(2026, 5, 15)); // 15 Jun 2026
    return <DatePicker {...args} value={date} onValueChange={setDate} label="Delivery date" />;
  }
}`,...u.parameters?.docs?.source},description:{story:`Pre-filled value — the calendar opens on the selected month.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [date, setDate] = React.useState<Date | undefined>(undefined);
    const today = new Date();
    const next30 = new Date(today);
    next30.setDate(today.getDate() + 30);
    return <DatePicker {...args} value={date} onValueChange={setDate} min={today} max={next30} label="Departure date" placeholder="Must be within 30 days" />;
  }
}`,...d.parameters?.docs?.source},description:{story:`Min / max bounds — cells outside the range are disabled.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    display: 'flex',
    gap: 12,
    alignItems: 'flex-end',
    flexWrap: 'wrap'
  }}>
      <DatePicker {...args} size="sm" placeholder="Small" label="Small" />
      <DatePicker {...args} size="md" placeholder="Medium" label="Medium" />
      <DatePicker {...args} size="lg" placeholder="Large" label="Large" />
    </div>
}`,...f.parameters?.docs?.source},description:{story:`Size variants — sm (28 px), md (36 px), lg (44 px).`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    invalid: true,
    placeholder: 'Required'
  }
}`,...p.parameters?.docs?.source},description:{story:`Invalid state — trigger border + ring switch to --danger.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    placeholder: 'Not available'
  }
}`,...m.parameters?.docs?.source},description:{story:`Disabled — trigger is locked and cannot be opened.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [date, setDate] = React.useState<Date | undefined>(undefined);
    return <div dir="rtl">
        <DatePicker {...args} value={date} onValueChange={setDate} locale="ar-EG" placeholder="اختر التاريخ" label="تاريخ الاستحقاق" />
      </div>;
  }
}`,...h.parameters?.docs?.source},description:{story:`RTL layout — trigger and calendar grid both mirror.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [date, setDate] = React.useState<Date | undefined>(undefined);
    return <div style={{
      maxWidth: 320
    }}>
        <DatePicker {...args} value={date} onValueChange={setDate} label="Departure date" placeholder="Select date" />
        <span style={{
        display: 'block',
        marginTop: 6,
        fontSize: 'var(--text-sm)',
        color: 'var(--fg-muted)'
      }}>
          No flights available before today.
        </span>
      </div>;
  }
}`,...g.parameters?.docs?.source},description:{story:`In context — embedded inside an .in-field shell with helper text.`,...g.parameters?.docs?.description}}},_=[`Default`,`WithValue`,`Bounded`,`Sizes`,`Invalid`,`Disabled`,`RTL`,`InContext`]}))();export{d as Bounded,l as Default,m as Disabled,g as InContext,p as Invalid,h as RTL,f as Sizes,u as WithValue,_ as __namedExportsOrder,c as default};