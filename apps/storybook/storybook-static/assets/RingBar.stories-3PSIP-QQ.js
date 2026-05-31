import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{Qi as r,t as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u,d,f,p,m,h;e((()=>{t(),i(),a=n(),o=[{label:`Ring 0`,audience:`Internal · 100 nodes`,percent:100,status:`done`},{label:`Ring 1`,audience:`Canary · 1% traffic`,percent:100,status:`done`},{label:`Ring 2`,audience:`10% traffic`,percent:62,status:`running`},{label:`Ring 3`,audience:`50% traffic`,percent:0,status:`pending`},{label:`Ring 4`,audience:`100% traffic`,percent:0,status:`pending`}],s=[{label:`Ring 0`,audience:`Internal · 100 nodes`,percent:100,status:`done`},{label:`Ring 1`,audience:`Canary · 1% traffic`,percent:100,status:`done`},{label:`Ring 2`,audience:`10% traffic`,percent:100,status:`done`},{label:`Ring 3`,audience:`50% traffic`,percent:100,status:`done`},{label:`Ring 4`,audience:`100% traffic`,percent:100,status:`done`}],c=[{label:`Ring 0`,audience:`Internal · 100 nodes`,percent:100,status:`done`},{label:`Ring 1`,audience:`Canary · 1% traffic`,percent:42,status:`error`},{label:`Ring 2`,audience:`10% traffic`,percent:0,status:`pending`},{label:`Ring 3`,audience:`50% traffic`,percent:0,status:`pending`},{label:`Ring 4`,audience:`100% traffic`,percent:0,status:`pending`}],l={title:`Elements/RingBar`,component:r,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:"A horizontal cohort strip that visualises a ring-deployment rollout. Cells to the left of `currentRing` are fully done; the active ring carries an ember tint and pulsing status dot; future rings are neutral. Pass `popoverFor` to make cells clickable with a popover body."}}},args:{rings:o,currentRing:2},argTypes:{currentRing:{control:`number`}}},u={},d={args:{rings:s,currentRing:4}},f={args:{rings:c,currentRing:1}},p={render:()=>(0,a.jsx)(r,{rings:o,currentRing:2,popoverFor:e=>(0,a.jsxs)(`div`,{style:{padding:`8px 0`,minWidth:180},children:[(0,a.jsx)(`p`,{style:{fontSize:12,fontWeight:600,margin:`0 0 4px`},children:e.label}),(0,a.jsx)(`p`,{style:{fontSize:11,color:`var(--fg-muted)`,margin:0},children:e.audience}),(0,a.jsxs)(`p`,{style:{fontSize:11,margin:`6px 0 0`,fontFamily:`var(--font-mono)`},children:[e.percent,`% complete`]})]})})},m={render:()=>(0,a.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:20},children:[(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`p`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,marginBottom:8},children:`pix-router · D-9182 · in flight`}),(0,a.jsx)(r,{rings:o,currentRing:2})]}),(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`p`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,marginBottom:8},children:`identity-svc · D-9180 · complete`}),(0,a.jsx)(r,{rings:s,currentRing:4})]}),(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`p`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,marginBottom:8},children:`bureau-gateway · D-9179 · canary error`}),(0,a.jsx)(r,{rings:c,currentRing:1})]})]})},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{}`,...u.parameters?.docs?.source},description:{story:`Ring 2 in flight — the active cell pulses with ember tint.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    rings: RINGS_DONE,
    currentRing: 4
  }
}`,...d.parameters?.docs?.source},description:{story:`All rings completed successfully.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    rings: RINGS_FAILED,
    currentRing: 1
  }
}`,...f.parameters?.docs?.source},description:{story:`Canary (Ring 1) errored — rollout is blocked.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <RingBar rings={RINGS_INFLIGHT} currentRing={2} popoverFor={ring => <div style={{
    padding: '8px 0',
    minWidth: 180
  }}>
          <p style={{
      fontSize: 12,
      fontWeight: 600,
      margin: '0 0 4px'
    }}>{ring.label}</p>
          <p style={{
      fontSize: 11,
      color: 'var(--fg-muted)',
      margin: 0
    }}>{ring.audience}</p>
          <p style={{
      fontSize: 11,
      margin: '6px 0 0',
      fontFamily: 'var(--font-mono)'
    }}>
            {ring.percent}% complete
          </p>
        </div>} />
}`,...p.parameters?.docs?.source},description:{story:`With a popover render prop — each cell becomes a clickable button.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 20
  }}>
      <div>
        <p style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg-muted)',
        marginBottom: 8
      }}>pix-router · D-9182 · in flight</p>
        <RingBar rings={RINGS_INFLIGHT} currentRing={2} />
      </div>
      <div>
        <p style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg-muted)',
        marginBottom: 8
      }}>identity-svc · D-9180 · complete</p>
        <RingBar rings={RINGS_DONE} currentRing={4} />
      </div>
      <div>
        <p style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg-muted)',
        marginBottom: 8
      }}>bureau-gateway · D-9179 · canary error</p>
        <RingBar rings={RINGS_FAILED} currentRing={1} />
      </div>
    </div>
}`,...m.parameters?.docs?.source},description:{story:`Two simultaneous deploys — realistic dashboard row.`,...m.parameters?.docs?.description}}},h=[`Default`,`Complete`,`Failed`,`WithPopover`,`InContext`]}))();export{d as Complete,u as Default,f as Failed,m as InContext,p as WithPopover,h as __namedExportsOrder,l as default};