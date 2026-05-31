import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{ct as i,lt as a,t as o,ut as s}from"./src-DgoylXRw.js";var c,l,u,d,f,p,m,h,g,_,v;e((()=>{c=t(n(),1),o(),l=r(),u={title:`Primitives/Collapsible`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:'Single disclosure — one trigger and one animated region. The atom beneath Accordion. Reach for Collapsible when only one optional block is involved; use Accordion for 2+ peer regions. Height animates via `grid-template-rows: 0fr → 1fr` with no DOM measuring. The trigger is `<button aria-expanded aria-controls>`; the region is `role="region" aria-labelledby`. Both IDs are wired via shared context.'}}},argTypes:{open:{control:`boolean`},defaultOpen:{control:`boolean`},disabled:{control:`boolean`}}},d={render:()=>(0,l.jsx)(`div`,{style:{width:400},children:(0,l.jsxs)(i,{children:[(0,l.jsx)(s,{children:`Advanced options`}),(0,l.jsx)(a,{children:`Force a custom region, set a TTL, or attach a side-car. Most teams never need these — open only when you do.`})]})})},f={render:()=>(0,l.jsx)(`div`,{style:{width:400},children:(0,l.jsxs)(i,{defaultOpen:!0,children:[(0,l.jsx)(s,{children:`Raw payload`}),(0,l.jsx)(a,{children:(0,l.jsx)(`pre`,{style:{margin:0,fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg)`,lineHeight:1.6},children:`{
  "id": "svc_8f3",
  "region": "us-east-1",
  "replicas": 3
}`})})]})})},p={render:()=>{let[e,t]=c.useState(!1);return(0,l.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:12,width:400},children:[(0,l.jsxs)(`div`,{style:{display:`flex`,gap:8},children:[(0,l.jsx)(`button`,{className:`btn sm outline`,onClick:()=>t(!0),children:`Open`}),(0,l.jsx)(`button`,{className:`btn sm outline`,onClick:()=>t(!1),children:`Close`})]}),(0,l.jsxs)(i,{open:e,onOpenChange:t,children:[(0,l.jsx)(s,{children:`Controlled region`}),(0,l.jsxs)(a,{children:[`This panel is driven by external state — the buttons above bypass the trigger but both paths still call `,(0,l.jsx)(`code`,{children:`onOpenChange`}),`.`]})]})]})}},m={render:()=>(0,l.jsx)(`div`,{style:{width:400},children:(0,l.jsxs)(i,{disabled:!0,children:[(0,l.jsx)(s,{children:`Locked region`}),(0,l.jsx)(a,{children:`This content is never reached when disabled.`})]})})},h={render:()=>(0,l.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:8,width:400},children:[(0,l.jsxs)(i,{children:[(0,l.jsx)(s,{children:`Advanced options`}),(0,l.jsx)(a,{children:`Force a custom region, set a TTL, or attach a side-car.`})]}),(0,l.jsxs)(i,{defaultOpen:!0,children:[(0,l.jsx)(s,{children:`Raw payload`}),(0,l.jsx)(a,{children:(0,l.jsx)(`pre`,{style:{margin:0,fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg)`},children:`{ "region": "us-east-1", "replicas": 3 }`})})]}),(0,l.jsxs)(i,{children:[(0,l.jsx)(s,{children:`Debug logs`}),(0,l.jsx)(a,{children:`No errors in the last 24 hours.`})]})]})},g={render:()=>(0,l.jsxs)(`div`,{className:`surface`,style:{padding:20,borderRadius:`var(--radius-xl)`,width:400},children:[(0,l.jsx)(`div`,{style:{fontWeight:600,fontSize:`var(--text-body)`,color:`var(--fg)`,marginBottom:4},children:`api-gateway · us-east-1`}),(0,l.jsx)(`div`,{style:{fontSize:`var(--text-sm)`,color:`var(--fg-muted)`,marginBottom:16},children:`3 replicas · healthy`}),(0,l.jsxs)(i,{children:[(0,l.jsx)(s,{children:`Advanced settings`}),(0,l.jsx)(a,{children:(0,l.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:10,paddingTop:4},children:[(0,l.jsxs)(`label`,{style:{display:`flex`,justifyContent:`space-between`,fontSize:`var(--text-sm)`,color:`var(--fg-muted)`},children:[(0,l.jsx)(`span`,{children:`TTL override`}),(0,l.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg)`},children:`3600s`})]}),(0,l.jsxs)(`label`,{style:{display:`flex`,justifyContent:`space-between`,fontSize:`var(--text-sm)`,color:`var(--fg-muted)`},children:[(0,l.jsx)(`span`,{children:`Side-car enabled`}),(0,l.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg)`},children:`true`})]})]})})]})]})},_={render:()=>(0,l.jsx)(`div`,{dir:`rtl`,style:{width:400},children:(0,l.jsxs)(i,{defaultOpen:!0,children:[(0,l.jsx)(s,{children:`خيارات متقدمة`}),(0,l.jsx)(a,{children:`افرض منطقة مخصصة، أو اضبط مدة البقاء، أو أرفق حاوية جانبية.`})]})})},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    width: 400
  }}>
      <Collapsible>
        <CollapsibleTrigger>Advanced options</CollapsibleTrigger>
        <CollapsibleContent>
          Force a custom region, set a TTL, or attach a side-car. Most teams
          never need these — open only when you do.
        </CollapsibleContent>
      </Collapsible>
    </div>
}`,...d.parameters?.docs?.source},description:{story:`Uncontrolled — starts closed. Toggle to see the region slide open.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    width: 400
  }}>
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Raw payload</CollapsibleTrigger>
        <CollapsibleContent>
          <pre style={{
          margin: 0,
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--fg)',
          lineHeight: 1.6
        }}>
            {\`{\\n  "id": "svc_8f3",\\n  "region": "us-east-1",\\n  "replicas": 3\\n}\`}
          </pre>
        </CollapsibleContent>
      </Collapsible>
    </div>
}`,...f.parameters?.docs?.source},description:{story:"Pre-opened via `defaultOpen`. Useful for settings panels open by default.",...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(false);
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      width: 400
    }}>
        <div style={{
        display: 'flex',
        gap: 8
      }}>
          <button className="btn sm outline" onClick={() => setOpen(true)}>
            Open
          </button>
          <button className="btn sm outline" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger>Controlled region</CollapsibleTrigger>
          <CollapsibleContent>
            This panel is driven by external state — the buttons above bypass
            the trigger but both paths still call <code>onOpenChange</code>.
          </CollapsibleContent>
        </Collapsible>
      </div>;
  }
}`,...p.parameters?.docs?.source},description:{story:"Controlled — `open` + `onOpenChange` let you drive the state externally.",...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    width: 400
  }}>
      <Collapsible disabled>
        <CollapsibleTrigger>Locked region</CollapsibleTrigger>
        <CollapsibleContent>
          This content is never reached when disabled.
        </CollapsibleContent>
      </Collapsible>
    </div>
}`,...m.parameters?.docs?.source},description:{story:`Disabled — the trigger is non-interactive and visually dimmed.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    width: 400
  }}>
      <Collapsible>
        <CollapsibleTrigger>Advanced options</CollapsibleTrigger>
        <CollapsibleContent>
          Force a custom region, set a TTL, or attach a side-car.
        </CollapsibleContent>
      </Collapsible>
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Raw payload</CollapsibleTrigger>
        <CollapsibleContent>
          <pre style={{
          margin: 0,
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--fg)'
        }}>
            {\`{ "region": "us-east-1", "replicas": 3 }\`}
          </pre>
        </CollapsibleContent>
      </Collapsible>
      <Collapsible>
        <CollapsibleTrigger>Debug logs</CollapsibleTrigger>
        <CollapsibleContent>
          No errors in the last 24 hours.
        </CollapsibleContent>
      </Collapsible>
    </div>
}`,...h.parameters?.docs?.source},description:{story:`Multiple Collapsibles — each is independent (no single-open constraint).`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div className="surface" style={{
    padding: 20,
    borderRadius: 'var(--radius-xl)',
    width: 400
  }}>
      <div style={{
      fontWeight: 600,
      fontSize: 'var(--text-body)',
      color: 'var(--fg)',
      marginBottom: 4
    }}>
        api-gateway · us-east-1
      </div>
      <div style={{
      fontSize: 'var(--text-sm)',
      color: 'var(--fg-muted)',
      marginBottom: 16
    }}>
        3 replicas · healthy
      </div>

      <Collapsible>
        <CollapsibleTrigger>Advanced settings</CollapsibleTrigger>
        <CollapsibleContent>
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          paddingTop: 4
        }}>
            <label style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 'var(--text-sm)',
            color: 'var(--fg-muted)'
          }}>
              <span>TTL override</span>
              <code style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--fg)'
            }}>
                3600s
              </code>
            </label>
            <label style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 'var(--text-sm)',
            color: 'var(--fg-muted)'
          }}>
              <span>Side-car enabled</span>
              <code style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--fg)'
            }}>
                true
              </code>
            </label>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
}`,...g.parameters?.docs?.source},description:{story:`In context — a service detail card with a hidden advanced section.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <div dir="rtl" style={{
    width: 400
  }}>
      <Collapsible defaultOpen>
        <CollapsibleTrigger>خيارات متقدمة</CollapsibleTrigger>
        <CollapsibleContent>
          افرض منطقة مخصصة، أو اضبط مدة البقاء، أو أرفق حاوية جانبية.
        </CollapsibleContent>
      </Collapsible>
    </div>
}`,..._.parameters?.docs?.source},description:{story:"RTL — the trigger uses `justify-content: space-between` + `text-align: start`,\nso in a right-to-left context the label right-aligns and the disclosure chevron\nrides the trailing (left) edge automatically. No override needed.",..._.parameters?.docs?.description}}},v=[`Default`,`DefaultOpen`,`Controlled`,`Disabled`,`Stacked`,`InContext`,`RTL`]}))();export{p as Controlled,d as Default,f as DefaultOpen,m as Disabled,g as InContext,_ as RTL,h as Stacked,v as __namedExportsOrder,u as default};