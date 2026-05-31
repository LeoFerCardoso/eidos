import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{na as r,t as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u,d,f,p,m,h;e((()=>{t(),i(),a=n(),o=Date.now(),s=e=>new Date(o-e),c=[{id:`e1`,title:`Deploy queued`,meta:`pix-router v2.7.0 · Rafael Mendonça`,at:s(840*1e3),icon:`clock`,done:!0},{id:`e2`,title:`Build passed`,meta:`1m 12s · 142 artifacts`,at:s(780*1e3),icon:`check`,done:!0},{id:`e3`,title:`Tests passed`,meta:`4m 38s · 1,847 specs`,at:s(540*1e3),icon:`check`,done:!0},{id:`e4`,title:`Risk gate: low (34)`,meta:`Blast radius Ring 0→2`,at:s(480*1e3),icon:`shield`,done:!0},{id:`e5`,title:`Canary active`,meta:`Ring 0 · 62% healthy`,at:s(120*1e3),icon:`flame`,current:!0},{id:`e6`,title:`Full rollout`,meta:`Pending canary completion`,icon:`server`}],l=[{id:`i1`,title:`P0 opened`,meta:`pix-router — elevated error rate (4.2%)`,at:s(5700*1e3),tone:`danger`,icon:`alert`,done:!0},{id:`i2`,title:`ACK · Rafael Mendonça`,at:s(5280*1e3),done:!0,person:{name:`Rafael Mendonça`,initials:`RM`,role:`Tech Lead · Pix`}},{id:`i3`,title:`Hypothesis: idempotency key collision on retry`,meta:`Added to #pix-incident`,at:s(4800*1e3),icon:`info`,done:!0},{id:`i4`,title:`Fix deployed — D-9182`,meta:`v2.7.1 to canary (Ring 0)`,at:s(1320*1e3),icon:`check`,current:!0,tone:`success`},{id:`i5`,title:`Monitoring window active`,meta:`Error rate stable at 0.1%`,icon:`clock`},{id:`i6`,title:`Post-mortem scheduled`,meta:`Thu 15:00 BRT`,icon:`edit`}],u={title:`Elements/Timeline`,component:r,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:"A vertical sequence of events with ember-tinted current step, quiet-green done steps, and neutral pending steps. Items can carry an avatar, an icon, a tone, and arbitrary child content. Use `compact` in sidesheets and drawers."}}},args:{items:c,compact:!1},argTypes:{compact:{control:`boolean`}}},d={},f={args:{items:l}},p={args:{compact:!0}},m={render:()=>(0,a.jsxs)(`div`,{style:{maxWidth:420},children:[(0,a.jsx)(`p`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,marginBottom:12},children:`pix-router · D-9182 · in flight`}),(0,a.jsx)(r,{items:c})]})},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{}`,...d.parameters?.docs?.source},description:{story:`A deploy lifecycle with the canary step in flight (ember).`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    items: INCIDENT_EVENTS
  }
}`,...f.parameters?.docs?.source},description:{story:`With person avatars in the pins (incident ACK flow).`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    compact: true
  }
}`,...p.parameters?.docs?.source},description:{story:`Compact density — tighter rows for sidesheets and drawers.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    maxWidth: 420
  }}>
      <p style={{
      fontSize: 11,
      fontFamily: 'var(--font-mono)',
      color: 'var(--fg-muted)',
      marginBottom: 12
    }}>
        pix-router · D-9182 · in flight
      </p>
      <Timeline items={DEPLOY_EVENTS} />
    </div>
}`,...m.parameters?.docs?.source},description:{story:`Deploy timeline in a card at realistic width.`,...m.parameters?.docs?.description}}},h=[`Default`,`WithAvatars`,`Compact`,`InContext`]}))();export{p as Compact,d as Default,m as InContext,f as WithAvatars,h as __namedExportsOrder,u as default};