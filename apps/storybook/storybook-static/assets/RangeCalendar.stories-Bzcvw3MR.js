import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Xr as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h,g,_;e((()=>{o=t(n(),1),a(),s=r(),c=new Date(2026,5,15),l={title:`Forms/RangeCalendar`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:'`RangeCalendar` is a two-click date-range picker with hover-preview band. First click anchors the start date; hovering previews the selection band; second click commits the end. Clicking again resets and starts a new range. It is a keep-alias for `<Calendar selectionMode="range" />` — use the deprecated API during a migration window, then switch to the unified `Calendar` component. Ideal for incident windows, sprint planning, deployment freeze periods, and service downtime scheduling.'}}},args:{today:c,locale:`en-US`,weekStartsOn:1},argTypes:{today:{control:!1},value:{control:!1},defaultValue:{control:!1},onChange:{action:`rangeChanged`},onValueChange:{action:`rangeChanged`},disabled:{control:!1},minDate:{control:!1},maxDate:{control:!1},footer:{control:!1},weekStartsOn:{control:`inline-radio`,options:[0,1]},locale:{control:`text`},className:{control:`text`}}},u={},d={render:e=>{let[t,n]=o.useState({start:new Date(2026,5,8),end:new Date(2026,5,14)}),r=e=>e?.toISOString().slice(0,10)??`—`,a=t.start&&t.end?Math.round((t.end.getTime()-t.start.getTime())/(1e3*60*60*24))+1:null;return(0,s.jsxs)(`div`,{style:{display:`flex`,gap:24,alignItems:`flex-start`},children:[(0,s.jsx)(i,{...e,value:t,onValueChange:e=>n(e),today:c}),(0,s.jsxs)(`div`,{style:{fontFamily:`var(--font-mono)`,fontSize:13,color:`var(--fg-muted)`,minWidth:180},children:[(0,s.jsx)(`div`,{style:{fontSize:10,textTransform:`uppercase`,letterSpacing:`0.1em`,color:`var(--fg-faint)`,marginBottom:10},children:`Incident Window`}),(0,s.jsx)(`div`,{style:{marginBottom:4},children:(0,s.jsx)(`span`,{style:{color:`var(--fg-faint)`,fontSize:11},children:`Start`})}),(0,s.jsx)(`div`,{style:{color:`var(--accent)`,marginBottom:10},children:r(t.start)}),(0,s.jsx)(`div`,{style:{marginBottom:4},children:(0,s.jsx)(`span`,{style:{color:`var(--fg-faint)`,fontSize:11},children:`End`})}),(0,s.jsx)(`div`,{style:{color:`var(--accent)`,marginBottom:14},children:r(t.end)}),a!==null&&(0,s.jsxs)(`div`,{style:{fontSize:11,color:`var(--fg-faint)`,lineHeight:1.5,borderTop:`1px solid var(--border)`,paddingTop:10},children:[`Duration: `,(0,s.jsxs)(`span`,{style:{color:`var(--fg)`},children:[a,` day`,a===1?``:`s`]})]}),t.start&&!t.end&&(0,s.jsx)(`div`,{style:{marginTop:10,fontSize:11,color:`var(--fg-faint)`,lineHeight:1.5,maxWidth:160},children:`Hover previews the band; click again to commit.`})]})]})}},f={render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,gap:32,flexWrap:`wrap`,alignItems:`flex-start`},children:[(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`div`,{style:{fontFamily:`var(--font-mono)`,fontSize:10,textTransform:`uppercase`,letterSpacing:`0.1em`,color:`var(--fg-faint)`,marginBottom:10},children:`Empty (no selection)`}),(0,s.jsx)(i,{today:c})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`div`,{style:{fontFamily:`var(--font-mono)`,fontSize:10,textTransform:`uppercase`,letterSpacing:`0.1em`,color:`var(--fg-faint)`,marginBottom:10},children:`Partial (awaiting end)`}),(0,s.jsx)(i,{today:c,defaultValue:{start:new Date(2026,5,10),end:null}})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`div`,{style:{fontFamily:`var(--font-mono)`,fontSize:10,textTransform:`uppercase`,letterSpacing:`0.1em`,color:`var(--fg-faint)`,marginBottom:10},children:`Complete (sprint window)`}),(0,s.jsx)(i,{today:c,defaultValue:{start:new Date(2026,5,2),end:new Date(2026,5,13)}})]})]})},p={render:e=>(0,s.jsxs)(`div`,{style:{display:`flex`,gap:24,alignItems:`flex-start`},children:[(0,s.jsx)(i,{...e,today:c,minDate:new Date(2026,5,3),maxDate:new Date(2026,5,27),defaultValue:{start:new Date(2026,5,10),end:new Date(2026,5,20)},"aria-label":`Deployment freeze window`}),(0,s.jsxs)(`div`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-muted)`,maxWidth:200,lineHeight:1.6},children:[(0,s.jsx)(`div`,{style:{fontSize:10,textTransform:`uppercase`,letterSpacing:`0.1em`,color:`var(--fg-faint)`,marginBottom:8},children:`Eligible window`}),(0,s.jsx)(`div`,{style:{color:`var(--fg)`},children:`03 Jun – 27 Jun 2026`}),(0,s.jsx)(`div`,{style:{marginTop:10,fontSize:11,color:`var(--fg-faint)`},children:`Dates outside the freeze window are disabled. Nav arrows lock at boundaries.`})]})]})},m={args:{disabled:e=>e.getDay()===0||e.getDay()===6,defaultValue:{start:new Date(2026,5,8),end:new Date(2026,5,12)},today:c,"aria-label":`Business days only — weekends disabled`}},h={args:{weekStartsOn:0,locale:`en-US`,today:c,defaultValue:{start:new Date(2026,5,7),end:new Date(2026,5,14)}}},g={render:e=>{let[t,n]=o.useState({start:new Date(2026,5,8),end:new Date(2026,5,14)}),r=[{label:`Last 7 days`,start:new Date(2026,5,8),end:new Date(2026,5,14)},{label:`Last 14 days`,start:new Date(2026,5,1),end:new Date(2026,5,14)},{label:`This month`,start:new Date(2026,5,1),end:new Date(2026,5,30)}];return(0,s.jsx)(i,{...e,value:t,onValueChange:e=>n(e),today:c,footer:(0,s.jsx)(`div`,{style:{display:`flex`,gap:6},children:r.map(e=>(0,s.jsx)(`button`,{type:`button`,onClick:()=>n({start:e.start,end:e.end}),style:{flex:1,padding:`5px 0`,borderRadius:5,background:`var(--surface-hover)`,border:`none`,color:`var(--fg-muted)`,fontSize:11,cursor:`pointer`,fontFamily:`var(--font-mono)`,letterSpacing:`0.03em`,whiteSpace:`nowrap`},children:e.label},e.label))})})}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{}`,...u.parameters?.docs?.source},description:{story:`Uncontrolled range calendar — today is highlighted with the ember dot. Click
any day to anchor the start, hover to preview the band, then click again to
commit the end. A third click resets and starts a new range.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [range, setRange] = React.useState<DateRange>({
      start: new Date(2026, 5, 8),
      end: new Date(2026, 5, 14)
    });
    const fmt = (d: Date | null) => d?.toISOString().slice(0, 10) ?? '—';
    const duration = range.start && range.end ? Math.round((range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24)) + 1 : null;
    return <div style={{
      display: 'flex',
      gap: 24,
      alignItems: 'flex-start'
    }}>
        <RangeCalendar {...args} value={range} onValueChange={r => setRange(r)} today={TODAY} />
        <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        color: 'var(--fg-muted)',
        minWidth: 180
      }}>
          <div style={{
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--fg-faint)',
          marginBottom: 10
        }}>
            Incident Window
          </div>

          <div style={{
          marginBottom: 4
        }}>
            <span style={{
            color: 'var(--fg-faint)',
            fontSize: 11
          }}>Start</span>
          </div>
          <div style={{
          color: 'var(--accent)',
          marginBottom: 10
        }}>{fmt(range.start)}</div>

          <div style={{
          marginBottom: 4
        }}>
            <span style={{
            color: 'var(--fg-faint)',
            fontSize: 11
          }}>End</span>
          </div>
          <div style={{
          color: 'var(--accent)',
          marginBottom: 14
        }}>{fmt(range.end)}</div>

          {duration !== null && <div style={{
          fontSize: 11,
          color: 'var(--fg-faint)',
          lineHeight: 1.5,
          borderTop: '1px solid var(--border)',
          paddingTop: 10
        }}>
              Duration: <span style={{
            color: 'var(--fg)'
          }}>{duration} day{duration !== 1 ? 's' : ''}</span>
            </div>}

          {range.start && !range.end && <div style={{
          marginTop: 10,
          fontSize: 11,
          color: 'var(--fg-faint)',
          lineHeight: 1.5,
          maxWidth: 160
        }}>
              Hover previews the band; click again to commit.
            </div>}
        </div>
      </div>;
  }
}`,...d.parameters?.docs?.source},description:{story:`Controlled range — external state drives the selection. The current incident
window (start/end) is shown beside the calendar. Use this pattern in an
incident-management UI where the date range must sync with form state.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 32,
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  }}>
      {/* ── Empty ── */}
      <div>
        <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--fg-faint)',
        marginBottom: 10
      }}>
          Empty (no selection)
        </div>
        <RangeCalendar today={TODAY} />
      </div>

      {/* ── Partial (start set, no end) ── */}
      <div>
        <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--fg-faint)',
        marginBottom: 10
      }}>
          Partial (awaiting end)
        </div>
        <RangeCalendar today={TODAY} defaultValue={{
        start: new Date(2026, 5, 10),
        end: null
      }} />
      </div>

      {/* ── Complete range ── */}
      <div>
        <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--fg-faint)',
        marginBottom: 10
      }}>
          Complete (sprint window)
        </div>
        <RangeCalendar today={TODAY} defaultValue={{
        start: new Date(2026, 5, 2),
        end: new Date(2026, 5, 13)
      }} />
      </div>
    </div>
}`,...f.parameters?.docs?.source},description:{story:`Side-by-side state matrix: empty (no selection), partial (start-only, awaiting
end), and complete (committed range). Covers the three phases of a range
selection as they appear in a deployment scheduling or sprint planning context.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    display: 'flex',
    gap: 24,
    alignItems: 'flex-start'
  }}>
      <RangeCalendar {...args} today={TODAY} minDate={new Date(2026, 5, 3)} maxDate={new Date(2026, 5, 27)} defaultValue={{
      start: new Date(2026, 5, 10),
      end: new Date(2026, 5, 20)
    }} aria-label="Deployment freeze window" />
      <div style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--fg-muted)',
      maxWidth: 200,
      lineHeight: 1.6
    }}>
        <div style={{
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--fg-faint)',
        marginBottom: 8
      }}>
          Eligible window
        </div>
        <div style={{
        color: 'var(--fg)'
      }}>03 Jun – 27 Jun 2026</div>
        <div style={{
        marginTop: 10,
        fontSize: 11,
        color: 'var(--fg-faint)'
      }}>
          Dates outside the freeze window are disabled. Nav arrows lock at boundaries.
        </div>
      </div>
    </div>
}`,...p.parameters?.docs?.source},description:{story:"`minDate` and `maxDate` constrain the selectable window — cells outside the\nbounds are disabled and the Prev/Next nav buttons lock at the month boundaries.\nModels a deployment freeze period where only certain days are eligible.",...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: (d: Date) => d.getDay() === 0 || d.getDay() === 6,
    defaultValue: {
      start: new Date(2026, 5, 8),
      end: new Date(2026, 5, 12)
    },
    today: TODAY,
    'aria-label': 'Business days only — weekends disabled'
  }
}`,...m.parameters?.docs?.source},description:{story:`The \`disabled\` predicate marks individual cells as un-selectable. Here, all
weekend days are blocked — appropriate for business-hours-only scheduling
(e.g. on-call rotations, business day SLAs).`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    weekStartsOn: 0,
    locale: 'en-US',
    today: TODAY,
    defaultValue: {
      start: new Date(2026, 5, 7),
      end: new Date(2026, 5, 14)
    }
  }
}`,...h.parameters?.docs?.source},description:{story:`Pass a BCP-47 locale string and \`weekStartsOn={0}\` to localise labels and
switch to a Sunday-first grid. Useful for US/CA markets or region-aware
incident dashboards.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [range, setRange] = React.useState<DateRange>({
      start: new Date(2026, 5, 8),
      end: new Date(2026, 5, 14)
    });
    const presets: {
      label: string;
      start: Date;
      end: Date;
    }[] = [{
      label: 'Last 7 days',
      start: new Date(2026, 5, 8),
      end: new Date(2026, 5, 14)
    }, {
      label: 'Last 14 days',
      start: new Date(2026, 5, 1),
      end: new Date(2026, 5, 14)
    }, {
      label: 'This month',
      start: new Date(2026, 5, 1),
      end: new Date(2026, 5, 30)
    }];
    return <RangeCalendar {...args} value={range} onValueChange={r => setRange(r)} today={TODAY} footer={<div style={{
      display: 'flex',
      gap: 6
    }}>
            {presets.map(p => <button key={p.label} type="button" onClick={() => setRange({
        start: p.start,
        end: p.end
      })} style={{
        flex: 1,
        padding: '5px 0',
        borderRadius: 5,
        background: 'var(--surface-hover)',
        border: 'none',
        color: 'var(--fg-muted)',
        fontSize: 11,
        cursor: 'pointer',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.03em',
        whiteSpace: 'nowrap'
      }}>
                {p.label}
              </button>)}
          </div>} />;
  }
}`,...g.parameters?.docs?.source},description:{story:'The `footer` slot renders below the grid — use it for quick-select presets\nsuch as "Last 7 days" or "This month" shortcuts in analytics date filters.',...g.parameters?.docs?.description}}},_=[`Default`,`IncidentWindow`,`States`,`DeploymentFreeze`,`DisabledWeekends`,`SundayFirstLocale`,`WithQuickPresets`]}))();export{u as Default,p as DeploymentFreeze,m as DisabledWeekends,d as IncidentWindow,f as States,h as SundayFirstLocale,g as WithQuickPresets,_ as __namedExportsOrder,l as default};