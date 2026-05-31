import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Yr as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h,g,_,v;e((()=>{o=t(n(),1),a(),s=r(),c=new Date(2026,5,15),l={title:`Forms/Calendar`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:'Unified month-grid picker. `selectionMode="single"` (default) picks one date; `selectionMode="range"` enables a two-click range with hover-preview. Controlled when `value` is passed; uncontrolled when only `defaultValue` is given. `<RangeCalendar>` is a deprecated alias for `<Calendar selectionMode="range" />`.'}}},args:{today:c,locale:`en-US`,weekStartsOn:1,selectionMode:`single`},argTypes:{selectionMode:{control:`inline-radio`,options:[`single`,`range`]},today:{control:!1},value:{control:!1},defaultValue:{control:!1},onValueChange:{action:`valueChanged`},disabled:{control:!1},minDate:{control:!1},maxDate:{control:!1},footer:{control:!1},weekStartsOn:{control:`inline-radio`,options:[0,1]},locale:{control:`text`},className:{control:`text`}}},u={},d={render:e=>{let[t,n]=o.useState(new Date(2026,5,22));return(0,s.jsxs)(`div`,{style:{display:`flex`,gap:24,alignItems:`flex-start`},children:[(0,s.jsx)(i,{...e,selectionMode:`single`,value:t,onValueChange:e=>n(e),today:c}),(0,s.jsxs)(`div`,{style:{fontFamily:`var(--font-mono)`,fontSize:13,color:`var(--fg-muted)`},children:[(0,s.jsx)(`div`,{style:{fontSize:10,textTransform:`uppercase`,letterSpacing:`0.1em`,color:`var(--fg-faint)`,marginBottom:6},children:`Selected`}),(0,s.jsx)(`span`,{style:{color:`var(--ember)`},children:t.toISOString().slice(0,10)})]})]})}},f={render:e=>{let[t,n]=o.useState({start:new Date(2026,5,8),end:new Date(2026,5,19)}),r=e=>e?.toISOString().slice(0,10)??`—`;return(0,s.jsxs)(`div`,{style:{display:`flex`,gap:24,alignItems:`flex-start`},children:[(0,s.jsx)(i,{...e,selectionMode:`range`,value:t,onValueChange:e=>n(e),today:c}),(0,s.jsxs)(`div`,{style:{fontFamily:`var(--font-mono)`,fontSize:13,color:`var(--fg-muted)`},children:[(0,s.jsx)(`div`,{style:{fontSize:10,textTransform:`uppercase`,letterSpacing:`0.1em`,color:`var(--fg-faint)`,marginBottom:8},children:`Range`}),(0,s.jsx)(`div`,{style:{color:`var(--ember)`,marginBottom:4},children:r(t.start)}),(0,s.jsx)(`div`,{style:{color:`var(--ember)`},children:r(t.end)}),(0,s.jsx)(`div`,{style:{marginTop:14,fontSize:11,color:`var(--fg-faint)`,lineHeight:1.5,maxWidth:160},children:`Hover previews the band; second click commits.`})]})]})}},p={args:{disabled:e=>e.getDay()===0||e.getDay()===6,defaultValue:new Date(2026,5,17),today:c}},m={args:{minDate:new Date(2026,5,5),maxDate:new Date(2026,5,25),defaultValue:new Date(2026,5,15),today:c}},h={render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,gap:24,flexWrap:`wrap`,alignItems:`flex-start`},children:[(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`div`,{style:{fontFamily:`var(--font-mono)`,fontSize:10,textTransform:`uppercase`,letterSpacing:`0.1em`,color:`var(--fg-faint)`,marginBottom:10},children:`en-US`}),(0,s.jsx)(i,{locale:`en-US`,weekStartsOn:0,today:c})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`div`,{style:{fontFamily:`var(--font-mono)`,fontSize:10,textTransform:`uppercase`,letterSpacing:`0.1em`,color:`var(--fg-faint)`,marginBottom:10},children:`ar-EG`}),(0,s.jsx)(i,{locale:`ar-EG`,weekStartsOn:1,today:c})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`div`,{style:{fontFamily:`var(--font-mono)`,fontSize:10,textTransform:`uppercase`,letterSpacing:`0.1em`,color:`var(--fg-faint)`,marginBottom:10},children:`ja-JP`}),(0,s.jsx)(i,{locale:`ja-JP`,weekStartsOn:0,today:c})]})]})},g={args:{weekStartsOn:0,today:c}},_={render:e=>{let[t,n]=o.useState(new Date(2026,5,22));return(0,s.jsx)(i,{...e,selectionMode:`single`,value:t,onValueChange:e=>n(e),today:c,footer:(0,s.jsx)(`button`,{type:`button`,onClick:()=>n(c),style:{width:`100%`,padding:`6px 0`,borderRadius:5,background:`var(--surface-hover)`,border:`none`,color:`var(--fg-muted)`,fontSize:12,cursor:`pointer`,fontFamily:`var(--font-mono)`,letterSpacing:`0.04em`},children:`Go to today`})})}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{}`,...u.parameters?.docs?.source},description:{story:`Default uncontrolled calendar — today is highlighted; click any day to select.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [date, setDate] = React.useState<Date>(new Date(2026, 5, 22));
    return <div style={{
      display: 'flex',
      gap: 24,
      alignItems: 'flex-start'
    }}>
        <Calendar {...args} selectionMode="single" value={date} onValueChange={d => setDate(d as Date)} today={TODAY} />
        <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        color: 'var(--fg-muted)'
      }}>
          <div style={{
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--fg-faint)',
          marginBottom: 6
        }}>
            Selected
          </div>
          <span style={{
          color: 'var(--ember)'
        }}>{date.toISOString().slice(0, 10)}</span>
        </div>
      </div>;
  }
}`,...d.parameters?.docs?.source},description:{story:`Controlled single-date — external state drives the selection. The ISO value
is shown beside the calendar.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [range, setRange] = React.useState<DateRange>({
      start: new Date(2026, 5, 8),
      end: new Date(2026, 5, 19)
    });
    const fmt = (d: Date | null) => d?.toISOString().slice(0, 10) ?? '—';
    return <div style={{
      display: 'flex',
      gap: 24,
      alignItems: 'flex-start'
    }}>
        <Calendar {...args} selectionMode="range" value={range} onValueChange={r => setRange(r as DateRange)} today={TODAY} />
        <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        color: 'var(--fg-muted)'
      }}>
          <div style={{
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--fg-faint)',
          marginBottom: 8
        }}>
            Range
          </div>
          <div style={{
          color: 'var(--ember)',
          marginBottom: 4
        }}>{fmt(range.start)}</div>
          <div style={{
          color: 'var(--ember)'
        }}>{fmt(range.end)}</div>
          <div style={{
          marginTop: 14,
          fontSize: 11,
          color: 'var(--fg-faint)',
          lineHeight: 1.5,
          maxWidth: 160
        }}>
            Hover previews the band; second click commits.
          </div>
        </div>
      </div>;
  }
}`,...f.parameters?.docs?.source},description:{story:`Range mode with hover-preview — first click anchors the start; hover shows the
band before the second click commits the end. Click when a range is complete
to start over.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: (d: Date) => d.getDay() === 0 || d.getDay() === 6,
    defaultValue: new Date(2026, 5, 17),
    today: TODAY
  }
}`,...p.parameters?.docs?.source},description:{story:"The `disabled` predicate marks individual cells as un-selectable (opacity .3,\n`tabIndex -1`). Here, all weekend days are disabled.",...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    minDate: new Date(2026, 5, 5),
    maxDate: new Date(2026, 5, 25),
    defaultValue: new Date(2026, 5, 15),
    today: TODAY
  }
}`,...m.parameters?.docs?.source},description:{story:"`minDate` and `maxDate` disable out-of-range cells AND lock the Prev/Next\nnav buttons at the month boundaries.",...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 24,
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  }}>
      <div>
        <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--fg-faint)',
        marginBottom: 10
      }}>
          en-US
        </div>
        <Calendar locale="en-US" weekStartsOn={0} today={TODAY} />
      </div>
      <div>
        <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--fg-faint)',
        marginBottom: 10
      }}>
          ar-EG
        </div>
        <Calendar locale="ar-EG" weekStartsOn={1} today={TODAY} />
      </div>
      <div>
        <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--fg-faint)',
        marginBottom: 10
      }}>
          ja-JP
        </div>
        <Calendar locale="ja-JP" weekStartsOn={0} today={TODAY} />
      </div>
    </div>
}`,...h.parameters?.docs?.source},description:{story:`Pass any BCP-47 locale string to localise month + day-of-week labels.
The calendar layout and logic are unchanged — only the display strings differ.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    weekStartsOn: 0,
    today: TODAY
  }
}`,...g.parameters?.docs?.source},description:{story:"`weekStartsOn={0}` switches to a Sunday-first grid — the DOW strip and the\nmonth-grid offset both adjust. Use for US/CA markets.",...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [date, setDate] = React.useState<Date>(new Date(2026, 5, 22));
    return <Calendar {...args} selectionMode="single" value={date} onValueChange={d => setDate(d as Date)} today={TODAY} footer={<button type="button" onClick={() => setDate(TODAY)} style={{
      width: '100%',
      padding: '6px 0',
      borderRadius: 5,
      background: 'var(--surface-hover)',
      border: 'none',
      color: 'var(--fg-muted)',
      fontSize: 12,
      cursor: 'pointer',
      fontFamily: 'var(--font-mono)',
      letterSpacing: '0.04em'
    }}>
            Go to today
          </button>} />;
  }
}`,..._.parameters?.docs?.source},description:{story:'The `footer` slot renders below the grid — use it for a "Today" shortcut,\na submit button, or a helper note.',..._.parameters?.docs?.description}}},v=[`Default`,`Single`,`Range`,`DisabledDates`,`Bounded`,`Locale`,`WeekStartsOnSunday`,`WithFooter`]}))();export{m as Bounded,u as Default,p as DisabledDates,h as Locale,f as Range,d as Single,g as WeekStartsOnSunday,_ as WithFooter,v as __namedExportsOrder,l as default};