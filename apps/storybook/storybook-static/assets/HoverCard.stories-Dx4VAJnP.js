import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{gn as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x;e((()=>{o=t(n(),1),a(),s=r(),c=({initials:e,size:t=40})=>(0,s.jsx)(`div`,{style:{width:t,height:t,borderRadius:`50%`,background:`linear-gradient(135deg, var(--ember), var(--ember-deep))`,color:`#08090A`,display:`flex`,alignItems:`center`,justifyContent:`center`,fontWeight:600,fontSize:t>32?15:12,flexShrink:0,fontFamily:`var(--font-mono)`},children:e}),l=()=>(0,s.jsxs)(`div`,{style:{display:`flex`,gap:12,alignItems:`flex-start`},children:[(0,s.jsx)(c,{initials:`AL`}),(0,s.jsxs)(`div`,{style:{flex:1,minWidth:0},children:[(0,s.jsx)(`div`,{style:{fontWeight:600,color:`var(--fg)`,fontSize:15},children:`Ada Lovelace`}),(0,s.jsx)(`div`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-muted)`,marginTop:2},children:`@ada · Forge Platform`}),(0,s.jsx)(`div`,{style:{fontSize:13,color:`var(--fg-muted)`,marginTop:8,lineHeight:1.5},children:`Working on the deploy pipeline. Reachable on #platform-eng.`}),(0,s.jsxs)(`div`,{style:{display:`flex`,gap:8,marginTop:10},children:[(0,s.jsx)(`span`,{className:`pill`,children:`Online`}),(0,s.jsx)(`span`,{className:`pill ember`,children:`Reviewer`})]})]})]}),u=()=>(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,gap:8,marginBottom:8},children:(0,s.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-faint)`,textTransform:`uppercase`,letterSpacing:`0.06em`},children:`docs.forge.dev`})}),(0,s.jsx)(`div`,{style:{fontWeight:600,color:`var(--fg)`,fontSize:15,marginBottom:4},children:`Deploying a service`}),(0,s.jsx)(`div`,{style:{fontSize:13,color:`var(--fg-muted)`,lineHeight:1.5},children:`Six steps from local change to production traffic — config, build, push, deploy, verify, rollback.`})]}),d={title:`Overlays/HoverCard`,component:i,tags:[`autodocs`],parameters:{layout:`centered`,docs:{description:{component:`A rich hover-triggered floating panel for previewing entities — users, links, commits, refs. Opens on hover (300ms delay) or keyboard focus; closes on mouse-leave (200ms), blur, or Escape. Positions itself below the trigger with automatic flip; passively rendered (no focus trap). For one-line hints use Tooltip; for click-triggered actions use Popover.`}}},args:{openDelay:300,closeDelay:200,side:`bottom`,align:`start`,sideOffset:8,minWidth:240},argTypes:{openDelay:{control:{type:`range`,min:0,max:1e3,step:50},description:`ms before open on hover`},closeDelay:{control:{type:`range`,min:0,max:500,step:25},description:`ms before close on leave`},side:{control:`inline-radio`,options:[`top`,`bottom`,`left`,`right`]},align:{control:`inline-radio`,options:[`start`,`center`,`end`]},sideOffset:{control:{type:`number`,min:0,max:32}},minWidth:{control:{type:`number`,min:160,max:480}}}},f={render:e=>(0,s.jsxs)(`p`,{style:{fontFamily:`var(--font)`,color:`var(--fg-muted)`,fontSize:15,lineHeight:1.7,margin:0},children:[`Just paired with`,` `,(0,s.jsx)(i,{...e,trigger:(0,s.jsx)(`button`,{type:`button`,style:{background:`none`,border:`none`,padding:0,cursor:`pointer`,color:`var(--ember)`,fontWeight:500,font:`inherit`,fontSize:15},children:`@ada`}),children:(0,s.jsx)(l,{})}),` `,`on the new pipeline.`]})},p={args:{openDelay:0,closeDelay:0},render:e=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`flex-start`,gap:8},children:[(0,s.jsx)(`p`,{style:{fontFamily:`var(--font)`,color:`var(--fg-muted)`,fontSize:13,margin:0},children:`Tab to the mention below — the card opens on focus immediately.`}),(0,s.jsxs)(`p`,{style:{fontFamily:`var(--font)`,color:`var(--fg-muted)`,fontSize:15,lineHeight:1.7,margin:0},children:[`Assigned to`,` `,(0,s.jsx)(i,{...e,trigger:(0,s.jsx)(`button`,{type:`button`,style:{background:`none`,border:`none`,padding:0,cursor:`pointer`,color:`var(--ember)`,fontWeight:500,font:`inherit`,fontSize:15},children:`@ada`}),children:(0,s.jsx)(l,{})}),` `,`for this sprint.`]})]})},m={render:e=>(0,s.jsxs)(`p`,{style:{fontFamily:`var(--font)`,color:`var(--fg-muted)`,fontSize:15,lineHeight:1.7,margin:0},children:[`The deploy guide lives at`,` `,(0,s.jsx)(i,{...e,minWidth:280,trigger:(0,s.jsx)(`a`,{href:`#`,onClick:e=>e.preventDefault(),style:{color:`var(--ember)`,textDecoration:`underline`},children:`docs.forge.dev/deploy`}),children:(0,s.jsx)(u,{})}),` `,`— hover to peek before you commit to the click.`]})},h={args:{side:`top`},render:e=>(0,s.jsx)(`div`,{style:{paddingTop:160,paddingBottom:0},children:(0,s.jsxs)(`p`,{style:{fontFamily:`var(--font)`,color:`var(--fg-muted)`,fontSize:15,lineHeight:1.7,margin:0},children:[`Assigned to`,` `,(0,s.jsx)(i,{...e,trigger:(0,s.jsx)(`a`,{href:`#`,onClick:e=>e.preventDefault(),style:{color:`var(--ember)`,textDecoration:`none`,fontWeight:500},children:`@ada`}),children:(0,s.jsx)(l,{})})]})})},g={args:{align:`center`,minWidth:280},render:e=>(0,s.jsxs)(`p`,{style:{fontFamily:`var(--font)`,color:`var(--fg-muted)`,fontSize:15,lineHeight:1.7,margin:0},children:[`Assigned to`,` `,(0,s.jsx)(i,{...e,trigger:(0,s.jsx)(`a`,{href:`#`,onClick:e=>e.preventDefault(),style:{color:`var(--ember)`,textDecoration:`none`,fontWeight:500},children:`@ada`}),children:(0,s.jsx)(l,{})})]})},_={args:{openDelay:0,closeDelay:0},render:e=>(0,s.jsxs)(`p`,{style:{fontFamily:`var(--font)`,color:`var(--fg-muted)`,fontSize:15,lineHeight:1.7,margin:0},children:[`Hover`,` `,(0,s.jsx)(i,{...e,trigger:(0,s.jsx)(`a`,{href:`#`,onClick:e=>e.preventDefault(),style:{color:`var(--ember)`,textDecoration:`none`,fontWeight:500},children:`@ada`}),children:(0,s.jsx)(l,{})}),` `,`— opens immediately.`]})},v={render:e=>{let[t,n]=o.useState(!1);return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,alignItems:`center`,gap:20},children:[(0,s.jsx)(`button`,{className:`btn`,onClick:()=>n(e=>!e),children:t?`Close card`:`Open card`}),(0,s.jsx)(i,{...e,open:t,onOpenChange:n,trigger:(0,s.jsx)(`a`,{href:`#`,onClick:e=>e.preventDefault(),style:{color:`var(--ember)`,textDecoration:`none`,fontWeight:500},children:`@ada`}),children:(0,s.jsx)(l,{})})]})}},y={render:e=>(0,s.jsx)(`div`,{dir:`rtl`,children:(0,s.jsxs)(`p`,{style:{fontFamily:`var(--font)`,color:`var(--fg-muted)`,fontSize:15,lineHeight:1.7,margin:0},children:[`أُسنِد إلى`,` `,(0,s.jsx)(i,{...e,trigger:(0,s.jsx)(`a`,{href:`#`,onClick:e=>e.preventDefault(),style:{color:`var(--ember)`,textDecoration:`none`,fontWeight:500},children:`@ada`}),children:(0,s.jsxs)(`div`,{style:{display:`flex`,gap:12,alignItems:`flex-start`},children:[(0,s.jsx)(c,{initials:`AL`}),(0,s.jsxs)(`div`,{style:{flex:1,minWidth:0},children:[(0,s.jsx)(`div`,{style:{fontWeight:600,color:`var(--fg)`,fontSize:15},children:`Ada Lovelace`}),(0,s.jsx)(`div`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-muted)`,marginTop:2},children:`@ada · Forge`}),(0,s.jsx)(`div`,{style:{fontSize:13,color:`var(--fg-muted)`,marginTop:8,lineHeight:1.5},children:`تعمل على مسار النشر. متاحة على ‎#platform-eng.`})]})]})}),` `,`في خط الأنابيب الجديد.`]})})},b={render:e=>(0,s.jsxs)(`div`,{style:{background:`var(--surface)`,border:`1px solid var(--border)`,borderRadius:10,padding:`16px 20px`,maxWidth:480,fontFamily:`var(--font)`},children:[(0,s.jsx)(`div`,{style:{fontWeight:600,color:`var(--fg)`,marginBottom:16,fontSize:13},children:`Recent activity`}),[{name:`Ada Lovelace`,handle:`@ada`,action:`approved PR #7421`,initials:`AL`,time:`2m ago`},{name:`Grace Hopper`,handle:`@grace`,action:`deployed pix-router v2.7`,initials:`GH`,time:`14m ago`},{name:`Margaret Hamilton`,handle:`@margaret`,action:`opened incident #312`,initials:`MH`,time:`1h ago`}].map(({name:t,handle:n,action:r,initials:a,time:o})=>(0,s.jsxs)(`div`,{style:{display:`flex`,alignItems:`flex-start`,gap:10,padding:`8px 0`,borderTop:`1px solid var(--border)`},children:[(0,s.jsx)(c,{initials:a,size:32}),(0,s.jsxs)(`div`,{style:{flex:1,fontSize:13,color:`var(--fg-muted)`,lineHeight:1.5},children:[(0,s.jsx)(i,{...e,trigger:(0,s.jsx)(`a`,{href:`#`,onClick:e=>e.preventDefault(),style:{color:`var(--fg)`,fontWeight:500,textDecoration:`none`},children:t}),children:(0,s.jsxs)(`div`,{style:{display:`flex`,gap:12,alignItems:`flex-start`},children:[(0,s.jsx)(c,{initials:a,size:36}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`div`,{style:{fontWeight:600,color:`var(--fg)`,fontSize:15},children:t}),(0,s.jsxs)(`div`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-muted)`,marginTop:2},children:[n,` · Forge Platform`]})]})]})}),` `,r]}),(0,s.jsx)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-faint)`,whiteSpace:`nowrap`},children:o})]},n))]})},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: args => <p style={{
    fontFamily: 'var(--font)',
    color: 'var(--fg-muted)',
    fontSize: 15,
    lineHeight: 1.7,
    margin: 0
  }}>
      Just paired with{' '}
      <HoverCard {...args} trigger={<button type="button" style={{
      background: 'none',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      color: 'var(--ember)',
      fontWeight: 500,
      font: 'inherit',
      fontSize: 15
    }}>
            @ada
          </button>}>
        <ProfileContent />
      </HoverCard>
      {' '}on the new pipeline.
    </p>
}`,...f.parameters?.docs?.source},description:{story:`Default — hover or focus the @-mention button to reveal the user card.
The trigger is a button so it is reachable by keyboard Tab and by the probe.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    openDelay: 0,
    closeDelay: 0
  },
  render: args => <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8
  }}>
      <p style={{
      fontFamily: 'var(--font)',
      color: 'var(--fg-muted)',
      fontSize: 13,
      margin: 0
    }}>
        Tab to the mention below — the card opens on focus immediately.
      </p>
      <p style={{
      fontFamily: 'var(--font)',
      color: 'var(--fg-muted)',
      fontSize: 15,
      lineHeight: 1.7,
      margin: 0
    }}>
        Assigned to{' '}
        <HoverCard {...args} trigger={<button type="button" style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        color: 'var(--ember)',
        fontWeight: 500,
        font: 'inherit',
        fontSize: 15
      }}>
              @ada
            </button>}>
          <ProfileContent />
        </HoverCard>
        {' '}for this sprint.
      </p>
    </div>
}`,...p.parameters?.docs?.source},description:{story:`Focus story — the card opens on keyboard focus (Tab to the @-mention, then
immediately visible at openDelay=0). Demonstrates that HoverCard is reachable
without a mouse. Trigger is a \`<button>\` so it is probe-testable.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: args => <p style={{
    fontFamily: 'var(--font)',
    color: 'var(--fg-muted)',
    fontSize: 15,
    lineHeight: 1.7,
    margin: 0
  }}>
      The deploy guide lives at{' '}
      <HoverCard {...args} minWidth={280} trigger={<a href="#" onClick={e => e.preventDefault()} style={{
      color: 'var(--ember)',
      textDecoration: 'underline'
    }}>
            docs.forge.dev/deploy
          </a>}>
        <LinkContent />
      </HoverCard>
      {' '}— hover to peek before you commit to the click.
    </p>
}`,...m.parameters?.docs?.source},description:{story:`Link preview — hover a URL to peek the page title and description.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    side: 'top'
  },
  render: args => <div style={{
    paddingTop: 160,
    paddingBottom: 0
  }}>
      <p style={{
      fontFamily: 'var(--font)',
      color: 'var(--fg-muted)',
      fontSize: 15,
      lineHeight: 1.7,
      margin: 0
    }}>
        Assigned to{' '}
        <HoverCard {...args} trigger={<a href="#" onClick={e => e.preventDefault()} style={{
        color: 'var(--ember)',
        textDecoration: 'none',
        fontWeight: 500
      }}>
              @ada
            </a>}>
          <ProfileContent />
        </HoverCard>
      </p>
    </div>
}`,...h.parameters?.docs?.source},description:{story:`Opens above the trigger — useful when the trigger is near the bottom of a panel.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    align: 'center',
    minWidth: 280
  },
  render: args => <p style={{
    fontFamily: 'var(--font)',
    color: 'var(--fg-muted)',
    fontSize: 15,
    lineHeight: 1.7,
    margin: 0
  }}>
      Assigned to{' '}
      <HoverCard {...args} trigger={<a href="#" onClick={e => e.preventDefault()} style={{
      color: 'var(--ember)',
      textDecoration: 'none',
      fontWeight: 500
    }}>
            @ada
          </a>}>
        <ProfileContent />
      </HoverCard>
    </p>
}`,...g.parameters?.docs?.source},description:{story:`Center aligned panel — suitable for short trigger text.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    openDelay: 0,
    closeDelay: 0
  },
  render: args => <p style={{
    fontFamily: 'var(--font)',
    color: 'var(--fg-muted)',
    fontSize: 15,
    lineHeight: 1.7,
    margin: 0
  }}>
      Hover{' '}
      <HoverCard {...args} trigger={<a href="#" onClick={e => e.preventDefault()} style={{
      color: 'var(--ember)',
      textDecoration: 'none',
      fontWeight: 500
    }}>
            @ada
          </a>}>
        <ProfileContent />
      </HoverCard>
      {' '}— opens immediately.
    </p>
}`,..._.parameters?.docs?.source},description:{story:`Zero open delay — opens immediately on hover (not recommended for production).`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [open, setOpen] = React.useState(false);
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 20
    }}>
        <button className="btn" onClick={() => setOpen(v => !v)}>
          {open ? 'Close card' : 'Open card'}
        </button>
        <HoverCard {...args} open={open} onOpenChange={setOpen} trigger={<a href="#" onClick={e => e.preventDefault()} style={{
        color: 'var(--ember)',
        textDecoration: 'none',
        fontWeight: 500
      }}>
              @ada
            </a>}>
          <ProfileContent />
        </HoverCard>
      </div>;
  }
}`,...v.parameters?.docs?.source},description:{story:`Controlled — open state driven externally.`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: args => <div dir="rtl">
      <p style={{
      fontFamily: 'var(--font)',
      color: 'var(--fg-muted)',
      fontSize: 15,
      lineHeight: 1.7,
      margin: 0
    }}>
        أُسنِد إلى{' '}
        <HoverCard {...args} trigger={<a href="#" onClick={e => e.preventDefault()} style={{
        color: 'var(--ember)',
        textDecoration: 'none',
        fontWeight: 500
      }}>
              @ada
            </a>}>
          <div style={{
          display: 'flex',
          gap: 12,
          alignItems: 'flex-start'
        }}>
            <AvatarCircle initials="AL" />
            <div style={{
            flex: 1,
            minWidth: 0
          }}>
              <div style={{
              fontWeight: 600,
              color: 'var(--fg)',
              fontSize: 15
            }}>Ada Lovelace</div>
              <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--fg-muted)',
              marginTop: 2
            }}>@ada · Forge</div>
              <div style={{
              fontSize: 13,
              color: 'var(--fg-muted)',
              marginTop: 8,
              lineHeight: 1.5
            }}>
                تعمل على مسار النشر. متاحة على ‎#platform-eng.
              </div>
            </div>
          </div>
        </HoverCard>
        {' '}في خط الأنابيب الجديد.
      </p>
    </div>
}`,...y.parameters?.docs?.source},description:{story:`RTL — the panel anchors to the start edge, which is the right in right-to-left text.`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '16px 20px',
    maxWidth: 480,
    fontFamily: 'var(--font)'
  }}>
      <div style={{
      fontWeight: 600,
      color: 'var(--fg)',
      marginBottom: 16,
      fontSize: 13
    }}>Recent activity</div>
      {[{
      name: 'Ada Lovelace',
      handle: '@ada',
      action: 'approved PR #7421',
      initials: 'AL',
      time: '2m ago'
    }, {
      name: 'Grace Hopper',
      handle: '@grace',
      action: 'deployed pix-router v2.7',
      initials: 'GH',
      time: '14m ago'
    }, {
      name: 'Margaret Hamilton',
      handle: '@margaret',
      action: 'opened incident #312',
      initials: 'MH',
      time: '1h ago'
    }].map(({
      name,
      handle,
      action,
      initials,
      time
    }) => <div key={handle} style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      padding: '8px 0',
      borderTop: '1px solid var(--border)'
    }}>
          <AvatarCircle initials={initials} size={32} />
          <div style={{
        flex: 1,
        fontSize: 13,
        color: 'var(--fg-muted)',
        lineHeight: 1.5
      }}>
            <HoverCard {...args} trigger={<a href="#" onClick={e => e.preventDefault()} style={{
          color: 'var(--fg)',
          fontWeight: 500,
          textDecoration: 'none'
        }}>
                  {name}
                </a>}>
              <div style={{
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start'
          }}>
                <AvatarCircle initials={initials} size={36} />
                <div>
                  <div style={{
                fontWeight: 600,
                color: 'var(--fg)',
                fontSize: 15
              }}>{name}</div>
                  <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--fg-muted)',
                marginTop: 2
              }}>{handle} · Forge Platform</div>
                </div>
              </div>
            </HoverCard>
            {' '}{action}
          </div>
          <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-faint)',
        whiteSpace: 'nowrap'
      }}>{time}</span>
        </div>)}
    </div>
}`,...b.parameters?.docs?.source},description:{story:`In context — inside a realistic activity-feed surface.`,...b.parameters?.docs?.description}}},x=[`Default`,`Focus`,`LinkPreview`,`SideTop`,`AlignCenter`,`NoDelay`,`Controlled`,`RTL`,`InContext`]}))();export{g as AlignCenter,v as Controlled,f as Default,p as Focus,b as InContext,m as LinkPreview,_ as NoDelay,y as RTL,h as SideTop,x as __namedExportsOrder,d as default};