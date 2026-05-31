import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{pr as r,t as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u,d,f,p;e((()=>{t(),i(),a=n(),o=[{id:`u1`,speaker:`Leonardo`,initials:`LM`,side:`user`,text:`What is the current p95 latency for pix-router?`,time:`14:01`},{id:`a1`,speaker:`Forge AI`,initials:`AI`,side:`agent`,text:`The pix-router p95 is 89 ms, well below the 250 ms SLO threshold. Ring 2 canary is at 62% traffic.`,time:`14:01`,confidence:.97},{id:`u2`,speaker:`Leonardo`,initials:`LM`,side:`user`,text:`Any active alerts on the Pix tribe?`,time:`14:02`},{id:`a2`,speaker:`Forge AI`,initials:`AI`,side:`agent`,text:`One alert: pix-router has an anomaly flag set. No alert on ledger-svc or reconciliation-svc.`,time:`14:02`,confidence:.91},{id:`u3`,speaker:`Leonardo`,initials:`LM`,side:`user`,text:`Can you open the emergency rollback runbook for pix-router?`,time:`14:03`},{id:`a3`,speaker:`Forge AI`,initials:`AI`,side:`agent`,text:`Opening runbook rb-pix-rollback. Last successful execution was 14 days ago, 7 total runs, 100% success rate.`,time:`14:03`,confidence:.99}],s={title:`AI/Voice/Transcription`,component:r,tags:[`autodocs`],parameters:{docs:{description:{component:`Speaker-labelled turn list for a voice or audio session transcript. User turns are tinted with the ember accent; agent turns are neutral. Optionally renders per-turn timestamps and confidence percentage chips.`}}},args:{showTime:!0,showConfidence:!1},argTypes:{showTime:{control:`boolean`},showConfidence:{control:`boolean`}}},c={args:{turns:o}},l={name:`With confidence chips`,args:{turns:o,showConfidence:!0}},u={name:`No timestamps`,args:{turns:o,showTime:!1}},d={args:{turns:[]}},f={render:()=>(0,a.jsxs)(`div`,{style:{maxWidth:560,border:`1px solid var(--border)`,borderRadius:`var(--radius-lg)`,overflow:`hidden`,fontFamily:`var(--font-sans)`},children:[(0,a.jsx)(`div`,{style:{padding:`12px 16px`,borderBottom:`1px solid var(--border)`,fontSize:13,fontWeight:600,color:`var(--fg)`},children:`Voice session · 2026-05-29 14:01 BRT`}),(0,a.jsx)(`div`,{style:{padding:`4px 0`,maxHeight:360,overflowY:`auto`},children:(0,a.jsx)(r,{turns:o,showTime:!0,showConfidence:!0})})]})},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    turns: TURNS
  }
}`,...c.parameters?.docs?.source},description:{story:`Default — with timestamps, no confidence.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: 'With confidence chips',
  args: {
    turns: TURNS,
    showConfidence: true
  }
}`,...l.parameters?.docs?.source},description:{story:`With confidence — shows accuracy chips on agent turns.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: 'No timestamps',
  args: {
    turns: TURNS,
    showTime: false
  }
}`,...u.parameters?.docs?.source},description:{story:`No timestamps.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    turns: []
  }
}`,...d.parameters?.docs?.source},description:{story:`Empty — no turns yet.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    maxWidth: 560,
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    fontFamily: 'var(--font-sans)'
  }}>
      <div style={{
      padding: '12px 16px',
      borderBottom: '1px solid var(--border)',
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--fg)'
    }}>
        Voice session · 2026-05-29 14:01 BRT
      </div>
      <div style={{
      padding: '4px 0',
      maxHeight: 360,
      overflowY: 'auto'
    }}>
        <Transcription turns={TURNS} showTime showConfidence />
      </div>
    </div>
}`,...f.parameters?.docs?.source},description:{story:`In context — transcript inside an audio player card.`,...f.parameters?.docs?.description}}},p=[`Default`,`WithConfidence`,`NoTimestamps`,`Empty`,`InContext`]}))();export{c as Default,d as Empty,f as InContext,u as NoTimestamps,l as WithConfidence,p as __namedExportsOrder,s as default};