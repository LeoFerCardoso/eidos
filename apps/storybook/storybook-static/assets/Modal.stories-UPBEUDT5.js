import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Dn as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h,g,_;e((()=>{o=t(n(),1),a(),s=r(),c={title:`Overlays/Modal`,component:i,tags:[`autodocs`],parameters:{layout:`centered`,docs:{description:{component:`Centered overlay panel for self-contained flows — quick edits, share dialogs, media previews, announcements. Three dismiss paths (X, ESC, backdrop) make it "forgiving." For irreversible decisions use Alert Dialog instead.`}}},args:{open:!1,size:`md`,title:`Rename service`,desc:`Give it a memorable handle. You can change this later.`,showClose:!0,closeOnEsc:!0,closeOnBackdrop:!0},argTypes:{open:{control:`boolean`},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`,`xl`]},title:{control:`text`},desc:{control:`text`},showClose:{control:`boolean`},closeOnEsc:{control:`boolean`},closeOnBackdrop:{control:`boolean`},iconTone:{control:`inline-radio`,options:[`info`,`success`,`warning`,`danger`]}}},l={render:e=>{let[t,n]=o.useState(!1);return(0,s.jsxs)(`div`,{style:{minHeight:120,display:`flex`,alignItems:`center`,justifyContent:`center`},children:[(0,s.jsx)(`button`,{className:`btn ember`,onClick:()=>n(!0),children:`Rename service`}),(0,s.jsx)(i,{...e,open:t,onOpenChange:n,footer:(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`button`,{className:`btn ghost`,onClick:()=>n(!1),children:`Cancel`}),(0,s.jsx)(`button`,{className:`btn ember`,onClick:()=>n(!1),children:`Save`})]}),children:(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:6,marginBottom:14},children:[(0,s.jsx)(`label`,{style:{fontSize:12,fontWeight:500,color:`var(--fg-muted)`},htmlFor:`mdl-story-rename`,children:`Service name`}),(0,s.jsx)(`input`,{id:`mdl-story-rename`,defaultValue:`forge-api`,style:{background:`var(--surface)`,color:`var(--fg)`,border:`1px solid var(--border-strong)`,borderRadius:6,padding:`8px 10px`,fontSize:13}})]})})]})}},u={render:()=>{let[e,t]=o.useState(!1);return(0,s.jsxs)(`div`,{style:{minHeight:120,display:`flex`,alignItems:`center`,justifyContent:`center`},children:[(0,s.jsx)(`button`,{className:`btn sm`,onClick:()=>t(!0),children:`Open · sm`}),(0,s.jsx)(i,{open:e,onOpenChange:t,size:`sm`,title:`Confirm action`,desc:`This step is reversible.`,footer:(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`button`,{className:`btn ghost sm`,onClick:()=>t(!1),children:`Cancel`}),(0,s.jsx)(`button`,{className:`btn ember sm`,onClick:()=>t(!1),children:`Confirm`})]}),children:(0,s.jsx)(`p`,{style:{margin:0,fontSize:13,color:`var(--fg-muted)`},children:`The smallest size is best for a single question or confirmation where context is already clear from the page behind it.`})})]})}},d={render:()=>{let[e,t]=o.useState(!1);return(0,s.jsxs)(`div`,{style:{minHeight:120,display:`flex`,alignItems:`center`,justifyContent:`center`},children:[(0,s.jsx)(`button`,{className:`btn sm`,onClick:()=>t(!0),children:`Open · lg`}),(0,s.jsx)(i,{open:e,onOpenChange:t,size:`lg`,title:`Share forge-api`,desc:`Anyone with the link can view the service overview and recent deploys.`,footer:(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`button`,{className:`btn ghost`,onClick:()=>t(!1),children:`Cancel`}),(0,s.jsx)(`button`,{className:`btn ember`,onClick:()=>t(!1),children:`Send invite`})]}),children:[`Invite people`,`Role`,`Note (optional)`].map((e,t)=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:6,marginBottom:t<2?14:0},children:[(0,s.jsx)(`label`,{style:{fontSize:12,fontWeight:500,color:`var(--fg-muted)`},children:e}),t===2?(0,s.jsx)(`textarea`,{rows:3,style:{background:`var(--surface)`,color:`var(--fg)`,border:`1px solid var(--border-strong)`,borderRadius:6,padding:`8px 10px`,fontSize:13,resize:`vertical`}}):(0,s.jsx)(`input`,{style:{background:`var(--surface)`,color:`var(--fg)`,border:`1px solid var(--border-strong)`,borderRadius:6,padding:`8px 10px`,fontSize:13}})]},e))})]})}},f={render:()=>{let[e,t]=o.useState(!1);return(0,s.jsxs)(`div`,{style:{minHeight:120,display:`flex`,alignItems:`center`,justifyContent:`center`},children:[(0,s.jsx)(`button`,{className:`btn ember`,onClick:()=>t(!0),children:`See what's new`}),(0,s.jsxs)(i,{open:e,onOpenChange:t,size:`lg`,hero:(0,s.jsx)(`div`,{className:`mdl-hero`}),title:`Forge 2026.06`,desc:`Cache Components, AI Gateway routing, and a faster Build Command.`,footer:(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`button`,{className:`btn ghost`,onClick:()=>t(!1),children:`Maybe later`}),(0,s.jsx)(`button`,{className:`btn ember`,onClick:()=>t(!1),children:`Read the release notes`})]}),children:[(0,s.jsx)(`p`,{style:{margin:`0 0 8px`,fontSize:15,color:`var(--fg-muted)`,lineHeight:1.6},children:`This month we shipped three things worth opening a modal for:`}),(0,s.jsxs)(`ul`,{style:{paddingInlineStart:20,color:`var(--fg-muted)`,lineHeight:1.7,fontSize:14,margin:0},children:[(0,s.jsxs)(`li`,{children:[(0,s.jsx)(`strong`,{style:{color:`var(--fg)`},children:`Cache Components`}),` — partial prerendering on every framework.`]}),(0,s.jsxs)(`li`,{children:[(0,s.jsx)(`strong`,{style:{color:`var(--fg)`},children:`AI Gateway routing`}),` — per-token failover across providers.`]}),(0,s.jsxs)(`li`,{children:[(0,s.jsx)(`strong`,{style:{color:`var(--fg)`},children:`Build Command 2.0`}),` — 40% faster cold starts on Turbopack.`]})]})]})]})}},p={render:()=>{let[e,t]=o.useState(!1);return(0,s.jsxs)(`div`,{style:{minHeight:120,display:`flex`,alignItems:`center`,justifyContent:`center`},children:[(0,s.jsx)(`button`,{className:`btn`,onClick:()=>t(!0),children:`View terms`}),(0,s.jsx)(i,{open:e,onOpenChange:t,title:`Acceptable use`,desc:`Last updated 03 May 2026.`,footer:(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`button`,{className:`btn ghost`,onClick:()=>t(!1),children:`Decline`}),(0,s.jsx)(`button`,{className:`btn ember`,onClick:()=>t(!1),children:`I agree`})]}),children:Array.from({length:8}).map((e,t)=>(0,s.jsxs)(`p`,{style:{margin:`0 0 12px`,fontSize:15,color:`var(--fg-muted)`,lineHeight:1.55},children:[(0,s.jsxs)(`strong`,{style:{color:`var(--fg)`},children:[t+1,`.`]}),` `,`Forge is a substrate for production systems — its features are intended for engineers operating real infrastructure. You agree not to use the platform to attack third parties, distribute malware, store unlawful content, or hammer the API beyond the documented per-org rate limits.`]},t))})]})}},m={render:()=>{let[e,t]=o.useState(!1);return(0,s.jsxs)(`div`,{style:{minHeight:120,display:`flex`,alignItems:`center`,justifyContent:`center`},children:[(0,s.jsx)(`button`,{className:`btn`,onClick:()=>t(!0),children:`Open persistent`}),(0,s.jsx)(i,{open:e,onOpenChange:t,closeOnBackdrop:!1,closeOnEsc:!1,title:`Unsaved changes`,desc:`You have unsaved work. Discard it or go back and save.`,footer:(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`button`,{className:`btn ghost`,onClick:()=>t(!1),children:`Discard changes`}),(0,s.jsx)(`button`,{className:`btn ember`,onClick:()=>t(!1),children:`Go back and save`})]}),children:(0,s.jsx)(`p`,{style:{margin:0,fontSize:15,color:`var(--fg-muted)`},children:`Clicking outside or pressing ESC has no effect — the user must make an explicit choice. Use sparingly, only when data loss is a real risk.`})})]})}},h={render:()=>{let[e,t]=o.useState(!1);return(0,s.jsxs)(`div`,{dir:`rtl`,style:{minHeight:120,display:`flex`,alignItems:`center`,justifyContent:`center`},children:[(0,s.jsx)(`button`,{className:`btn ember`,onClick:()=>t(!0),children:`مشاركة`}),(0,s.jsx)(`div`,{dir:`rtl`,children:(0,s.jsx)(i,{open:e,onOpenChange:t,title:`مشاركة forge-api`,desc:`يمكن لأي شخص لديه الرابط عرض الخدمة وعمليات النشر الأخيرة.`,footer:(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`button`,{className:`btn ghost`,onClick:()=>t(!1),children:`إلغاء`}),(0,s.jsx)(`button`,{className:`btn ember`,onClick:()=>t(!1),children:`إرسال الدعوة`})]}),children:(0,s.jsx)(`p`,{style:{margin:0,fontSize:15,color:`var(--fg-muted)`},children:`يظهر زر الإغلاق في الزاوية اليمنى العلوية في اتجاه من اليمين إلى اليسار.`})})})]})}},g={render:()=>{let[e,t]=o.useState(!1);return(0,s.jsxs)(`div`,{style:{width:480,padding:20,background:`var(--bg-elevated)`,border:`1px solid var(--border)`,borderRadius:12,fontFamily:`var(--font)`},children:[(0,s.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:12},children:[(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`div`,{style:{fontWeight:600,fontSize:15,color:`var(--fg)`},children:`forge-api`}),(0,s.jsx)(`div`,{style:{fontSize:12,color:`var(--fg-muted)`,marginTop:2},children:`identity-svc · production`})]}),(0,s.jsx)(`button`,{className:`btn sm`,onClick:()=>t(!0),children:`Share`})]}),(0,s.jsx)(`div`,{style:{height:1,background:`var(--border)`,marginBottom:12}}),(0,s.jsx)(`div`,{style:{fontSize:13,color:`var(--fg-subtle)`},children:`Status: healthy · 99.98% uptime · last deploy 2h ago`}),(0,s.jsxs)(i,{open:e,onOpenChange:t,title:`Share forge-api`,desc:`Anyone with the link can view the service overview and recent deploys.`,footer:(0,s.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,width:`100%`},children:[(0,s.jsxs)(`span`,{style:{fontSize:13,color:`var(--fg-subtle)`},children:[`Visible to `,(0,s.jsx)(`strong`,{style:{color:`var(--fg-muted)`},children:`acme-workspace`})]}),(0,s.jsxs)(`div`,{style:{display:`flex`,gap:8},children:[(0,s.jsx)(`button`,{className:`btn ghost`,onClick:()=>t(!1),children:`Cancel`}),(0,s.jsx)(`button`,{className:`btn ember`,onClick:()=>t(!1),children:`Send invite`})]})]}),children:[(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:6,marginBottom:14},children:[(0,s.jsx)(`label`,{style:{fontSize:12,fontWeight:500,color:`var(--fg-muted)`},children:`Invite people`}),(0,s.jsx)(`input`,{placeholder:`leo@acme.io, dani@acme.io`,style:{background:`var(--surface)`,color:`var(--fg)`,border:`1px solid var(--border-strong)`,borderRadius:6,padding:`8px 10px`,fontSize:13}})]}),(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:6},children:[(0,s.jsx)(`label`,{style:{fontSize:12,fontWeight:500,color:`var(--fg-muted)`},children:`Role`}),(0,s.jsxs)(`select`,{style:{background:`var(--surface)`,color:`var(--fg)`,border:`1px solid var(--border-strong)`,borderRadius:6,padding:`8px 10px`,fontSize:13},children:[(0,s.jsx)(`option`,{children:`Viewer — read-only`}),(0,s.jsx)(`option`,{children:`Editor — deploy & configure`}),(0,s.jsx)(`option`,{children:`Admin — manage members`})]})]})]})]})}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [open, setOpen] = React.useState(false);
    return <div style={{
      minHeight: 120,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
        <button className="btn ember" onClick={() => setOpen(true)}>Rename service</button>
        <Modal {...args} open={open} onOpenChange={setOpen} footer={<>
              <button className="btn ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn ember" onClick={() => setOpen(false)}>Save</button>
            </>}>
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          marginBottom: 14
        }}>
            <label style={{
            fontSize: 12,
            fontWeight: 500,
            color: 'var(--fg-muted)'
          }} htmlFor="mdl-story-rename">
              Service name
            </label>
            <input id="mdl-story-rename" defaultValue="forge-api" style={{
            background: 'var(--surface)',
            color: 'var(--fg)',
            border: '1px solid var(--border-strong)',
            borderRadius: 6,
            padding: '8px 10px',
            fontSize: 13
          }} />
          </div>
        </Modal>
      </div>;
  }
}`,...l.parameters?.docs?.source},description:{story:`Default — controlled by a trigger button. Supports ESC, backdrop click, and the X.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(false);
    return <div style={{
      minHeight: 120,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
        <button className="btn sm" onClick={() => setOpen(true)}>Open · sm</button>
        <Modal open={open} onOpenChange={setOpen} size="sm" title="Confirm action" desc="This step is reversible." footer={<>
              <button className="btn ghost sm" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn ember sm" onClick={() => setOpen(false)}>Confirm</button>
            </>}>
          <p style={{
          margin: 0,
          fontSize: 13,
          color: 'var(--fg-muted)'
        }}>
            The smallest size is best for a single question or confirmation where context
            is already clear from the page behind it.
          </p>
        </Modal>
      </div>;
  }
}`,...u.parameters?.docs?.source},description:{story:`Size: sm — 380 px, single-field quick choices.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(false);
    return <div style={{
      minHeight: 120,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
        <button className="btn sm" onClick={() => setOpen(true)}>Open · lg</button>
        <Modal open={open} onOpenChange={setOpen} size="lg" title="Share forge-api" desc="Anyone with the link can view the service overview and recent deploys." footer={<>
              <button className="btn ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn ember" onClick={() => setOpen(false)}>Send invite</button>
            </>}>
          {['Invite people', 'Role', 'Note (optional)'].map((label, i) => <div key={label} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          marginBottom: i < 2 ? 14 : 0
        }}>
              <label style={{
            fontSize: 12,
            fontWeight: 500,
            color: 'var(--fg-muted)'
          }}>{label}</label>
              {i === 2 ? <textarea rows={3} style={{
            background: 'var(--surface)',
            color: 'var(--fg)',
            border: '1px solid var(--border-strong)',
            borderRadius: 6,
            padding: '8px 10px',
            fontSize: 13,
            resize: 'vertical'
          }} /> : <input style={{
            background: 'var(--surface)',
            color: 'var(--fg)',
            border: '1px solid var(--border-strong)',
            borderRadius: 6,
            padding: '8px 10px',
            fontSize: 13
          }} />}
            </div>)}
        </Modal>
      </div>;
  }
}`,...d.parameters?.docs?.source},description:{story:`Size: lg — 640 px, multi-field forms and side-by-side previews.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(false);
    return <div style={{
      minHeight: 120,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
        <button className="btn ember" onClick={() => setOpen(true)}>See what&apos;s new</button>
        <Modal open={open} onOpenChange={setOpen} size="lg" hero={<div className="mdl-hero" />} title="Forge 2026.06" desc="Cache Components, AI Gateway routing, and a faster Build Command." footer={<>
              <button className="btn ghost" onClick={() => setOpen(false)}>Maybe later</button>
              <button className="btn ember" onClick={() => setOpen(false)}>Read the release notes</button>
            </>}>
          <p style={{
          margin: '0 0 8px',
          fontSize: 15,
          color: 'var(--fg-muted)',
          lineHeight: 1.6
        }}>
            This month we shipped three things worth opening a modal for:
          </p>
          <ul style={{
          paddingInlineStart: 20,
          color: 'var(--fg-muted)',
          lineHeight: 1.7,
          fontSize: 14,
          margin: 0
        }}>
            <li><strong style={{
              color: 'var(--fg)'
            }}>Cache Components</strong> — partial prerendering on every framework.</li>
            <li><strong style={{
              color: 'var(--fg)'
            }}>AI Gateway routing</strong> — per-token failover across providers.</li>
            <li><strong style={{
              color: 'var(--fg)'
            }}>Build Command 2.0</strong> — 40% faster cold starts on Turbopack.</li>
          </ul>
        </Modal>
      </div>;
  }
}`,...f.parameters?.docs?.source},description:{story:`Hero variant — full-bleed illustration or media slot above the header.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(false);
    return <div style={{
      minHeight: 120,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
        <button className="btn" onClick={() => setOpen(true)}>View terms</button>
        <Modal open={open} onOpenChange={setOpen} title="Acceptable use" desc="Last updated 03 May 2026." footer={<>
              <button className="btn ghost" onClick={() => setOpen(false)}>Decline</button>
              <button className="btn ember" onClick={() => setOpen(false)}>I agree</button>
            </>}>
          {Array.from({
          length: 8
        }).map((_, i) => <p key={i} style={{
          margin: '0 0 12px',
          fontSize: 15,
          color: 'var(--fg-muted)',
          lineHeight: 1.55
        }}>
              <strong style={{
            color: 'var(--fg)'
          }}>{i + 1}.</strong>{' '}
              Forge is a substrate for production systems — its features are intended for
              engineers operating real infrastructure. You agree not to use the platform to
              attack third parties, distribute malware, store unlawful content, or hammer the
              API beyond the documented per-org rate limits.
            </p>)}
        </Modal>
      </div>;
  }
}`,...p.parameters?.docs?.source},description:{story:`Scrollable body — header and footer stay pinned while the body overflows.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(false);
    return <div style={{
      minHeight: 120,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
        <button className="btn" onClick={() => setOpen(true)}>Open persistent</button>
        <Modal open={open} onOpenChange={setOpen} closeOnBackdrop={false} closeOnEsc={false} title="Unsaved changes" desc="You have unsaved work. Discard it or go back and save." footer={<>
              <button className="btn ghost" onClick={() => setOpen(false)}>Discard changes</button>
              <button className="btn ember" onClick={() => setOpen(false)}>Go back and save</button>
            </>}>
          <p style={{
          margin: 0,
          fontSize: 15,
          color: 'var(--fg-muted)'
        }}>
            Clicking outside or pressing ESC has no effect — the user must make an
            explicit choice. Use sparingly, only when data loss is a real risk.
          </p>
        </Modal>
      </div>;
  }
}`,...m.parameters?.docs?.source},description:{story:`Persistent — backdrop and ESC do not close it; requires an explicit button.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(false);
    return <div dir="rtl" style={{
      minHeight: 120,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
        <button className="btn ember" onClick={() => setOpen(true)}>مشاركة</button>
        <div dir="rtl">
          <Modal open={open} onOpenChange={setOpen} title="مشاركة forge-api" desc="يمكن لأي شخص لديه الرابط عرض الخدمة وعمليات النشر الأخيرة." footer={<>
                <button className="btn ghost" onClick={() => setOpen(false)}>إلغاء</button>
                <button className="btn ember" onClick={() => setOpen(false)}>إرسال الدعوة</button>
              </>}>
            <p style={{
            margin: 0,
            fontSize: 15,
            color: 'var(--fg-muted)'
          }}>
              يظهر زر الإغلاق في الزاوية اليمنى العلوية في اتجاه من اليمين إلى اليسار.
            </p>
          </Modal>
        </div>
      </div>;
  }
}`,...h.parameters?.docs?.source},description:{story:`RTL — Arabic copy with dir=&quot;rtl&quot;; the close button travels to the leading corner.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(false);
    return <div style={{
      width: 480,
      padding: 20,
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      fontFamily: 'var(--font)'
    }}>
        <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
      }}>
          <div>
            <div style={{
            fontWeight: 600,
            fontSize: 15,
            color: 'var(--fg)'
          }}>forge-api</div>
            <div style={{
            fontSize: 12,
            color: 'var(--fg-muted)',
            marginTop: 2
          }}>identity-svc · production</div>
          </div>
          <button className="btn sm" onClick={() => setOpen(true)}>Share</button>
        </div>
        <div style={{
        height: 1,
        background: 'var(--border)',
        marginBottom: 12
      }} />
        <div style={{
        fontSize: 13,
        color: 'var(--fg-subtle)'
      }}>Status: healthy · 99.98% uptime · last deploy 2h ago</div>

        <Modal open={open} onOpenChange={setOpen} title="Share forge-api" desc="Anyone with the link can view the service overview and recent deploys." footer={<div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
      }}>
              <span style={{
          fontSize: 13,
          color: 'var(--fg-subtle)'
        }}>
                Visible to <strong style={{
            color: 'var(--fg-muted)'
          }}>acme-workspace</strong>
              </span>
              <div style={{
          display: 'flex',
          gap: 8
        }}>
                <button className="btn ghost" onClick={() => setOpen(false)}>Cancel</button>
                <button className="btn ember" onClick={() => setOpen(false)}>Send invite</button>
              </div>
            </div>}>
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          marginBottom: 14
        }}>
            <label style={{
            fontSize: 12,
            fontWeight: 500,
            color: 'var(--fg-muted)'
          }}>Invite people</label>
            <input placeholder="leo@acme.io, dani@acme.io" style={{
            background: 'var(--surface)',
            color: 'var(--fg)',
            border: '1px solid var(--border-strong)',
            borderRadius: 6,
            padding: '8px 10px',
            fontSize: 13
          }} />
          </div>
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }}>
            <label style={{
            fontSize: 12,
            fontWeight: 500,
            color: 'var(--fg-muted)'
          }}>Role</label>
            <select style={{
            background: 'var(--surface)',
            color: 'var(--fg)',
            border: '1px solid var(--border-strong)',
            borderRadius: 6,
            padding: '8px 10px',
            fontSize: 13
          }}>
              <option>Viewer — read-only</option>
              <option>Editor — deploy &amp; configure</option>
              <option>Admin — manage members</option>
            </select>
          </div>
        </Modal>
      </div>;
  }
}`,...g.parameters?.docs?.source},description:{story:`In context — a share modal inside a realistic service card layout.`,...g.parameters?.docs?.description}}},_=[`Default`,`SizeSm`,`SizeLg`,`HeroVariant`,`ScrollableBody`,`Persistent`,`RTL`,`InContext`]}))();export{l as Default,f as HeroVariant,g as InContext,m as Persistent,h as RTL,p as ScrollableBody,d as SizeLg,u as SizeSm,_ as __namedExportsOrder,c as default};