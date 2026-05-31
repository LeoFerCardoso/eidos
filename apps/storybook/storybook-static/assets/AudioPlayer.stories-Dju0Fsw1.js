import{i as e}from"./preload-helper-xPQekRTU.js";import{B as t}from"./iframe-D7TzgJYi.js";import{t as n}from"./jsx-runtime-CaZkqeYb.js";import{t as r,ur as i}from"./src-DgoylXRw.js";var a,o,s,c,l,u,d,f,p,m,h;e((()=>{t(),r(),a=n(),o=`https://www.w3schools.com/html/horse.ogg`,s=Array.from({length:80},(e,t)=>.1+.85*Math.abs(Math.sin(t*.38+.7)*Math.cos(t*.12))),c={title:`AI/Voice/AudioPlayer`,component:i,tags:[`autodocs`],parameters:{docs:{description:{component:"A minimal play/pause/skip/scrub/speed/mute audio player backed by a real `<audio>` element. Supports an optional waveform (`peaks`) and artwork cover. Speed cycles through 0.75×, 1×, 1.25×, 1.5×, 2× on each click. All controls are keyboard-accessible."}}},args:{src:o,title:`Pix Router · Deploy review · 14 min`,subtitle:`Recorded 2026-05-29 · Ring 2 canary`,skipSeconds:10},argTypes:{src:{control:`text`},title:{control:`text`},subtitle:{control:`text`},skipSeconds:{control:`number`},duration:{control:`number`,description:`Override duration (seconds) for demo without a real file.`}}},l={},u={name:`With waveform`,args:{peaks:s,duration:847}},d={name:`With cover art`,args:{cover:(0,a.jsx)(`div`,{style:{width:48,height:48,borderRadius:6,background:`var(--accent)`,display:`flex`,alignItems:`center`,justifyContent:`center`,color:`#08090A`,fontWeight:700,fontSize:18,fontFamily:`var(--font-mono)`},children:`PR`}),peaks:s,duration:420}},f={name:`Minimal (no meta)`,args:{title:void 0,subtitle:void 0,duration:312}},p={render:()=>(0,a.jsx)(i,{src:o,title:`Bureau Gateway · Incident review`,subtitle:`2026-05-28 · 7 min`,peaks:s,duration:423,skipSeconds:15})},m={render:()=>(0,a.jsxs)(`div`,{style:{maxWidth:540,border:`1px solid var(--border)`,borderRadius:`var(--radius-lg)`,overflow:`hidden`,fontFamily:`var(--font-sans)`},children:[(0,a.jsxs)(`div`,{style:{padding:`12px 16px`,borderBottom:`1px solid var(--border)`},children:[(0,a.jsx)(`div`,{style:{fontSize:13,fontWeight:600,color:`var(--fg)`},children:`Incident debrief`}),(0,a.jsx)(`div`,{style:{fontSize:12,color:`var(--fg-muted)`,marginTop:2},children:`bureau-gateway · Ring 0 rollback · 2026-05-28`})]}),(0,a.jsx)(`div`,{style:{padding:16},children:(0,a.jsx)(i,{src:o,title:`Debrief recording`,subtitle:`Thiago Albuquerque · 7 min 3 s`,peaks:s,duration:423})})]})},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source},description:{story:`Default — title, subtitle, plain scrubber.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: 'With waveform',
  args: {
    peaks: PEAKS,
    duration: 847
  }
}`,...u.parameters?.docs?.source},description:{story:`With waveform — peaks replace the plain track bar.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: 'With cover art',
  args: {
    cover: <div style={{
      width: 48,
      height: 48,
      borderRadius: 6,
      background: 'var(--accent)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#08090A',
      fontWeight: 700,
      fontSize: 18,
      fontFamily: 'var(--font-mono)'
    }}>
        PR
      </div>,
    peaks: PEAKS,
    duration: 420
  }
}`,...d.parameters?.docs?.source},description:{story:`With cover artwork — leading image slot.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: 'Minimal (no meta)',
  args: {
    title: undefined,
    subtitle: undefined,
    duration: 312
  }
}`,...f.parameters?.docs?.source},description:{story:`No title or subtitle — controls only.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <AudioPlayer src={DEMO_SRC} title="Bureau Gateway · Incident review" subtitle="2026-05-28 · 7 min" peaks={PEAKS} duration={423} skipSeconds={15} />
}`,...p.parameters?.docs?.source},description:{story:`Interactive — real state, showing play/pause toggle.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    maxWidth: 540,
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    fontFamily: 'var(--font-sans)'
  }}>
      <div style={{
      padding: '12px 16px',
      borderBottom: '1px solid var(--border)'
    }}>
        <div style={{
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--fg)'
      }}>Incident debrief</div>
        <div style={{
        fontSize: 12,
        color: 'var(--fg-muted)',
        marginTop: 2
      }}>bureau-gateway · Ring 0 rollback · 2026-05-28</div>
      </div>
      <div style={{
      padding: 16
    }}>
        <AudioPlayer src={DEMO_SRC} title="Debrief recording" subtitle="Thiago Albuquerque · 7 min 3 s" peaks={PEAKS} duration={423} />
      </div>
    </div>
}`,...m.parameters?.docs?.source},description:{story:`In context — player inside an incident card.`,...m.parameters?.docs?.description}}},h=[`Default`,`WithWaveform`,`WithCover`,`Minimal`,`Interactive`,`InContext`]}))();export{l as Default,m as InContext,p as Interactive,f as Minimal,d as WithCover,u as WithWaveform,h as __namedExportsOrder,c as default};