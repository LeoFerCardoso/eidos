import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Mr as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p;e((()=>{o=t(n(),1),a(),s=r(),c={title:`AI/Shimmer`,component:i,tags:[`autodocs`],parameters:{docs:{description:{component:'An animated gradient sweep over a short text label — used for the "before first token" beat ("Thinking…", "Searching…"). This is a TEXT-ONLY placeholder. Image loading shimmer lives in Attachment/ImageView. The animation stops under `prefers-reduced-motion`.'}}},args:{children:`Thinking…`},argTypes:{children:{control:`text`,description:`The label behind the gradient. Keep under 4 words, end with "…".`},className:{control:`text`}}},l={},u={name:`Label variants`,render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:12},children:[(0,s.jsx)(i,{children:`Thinking…`}),(0,s.jsx)(i,{children:`Searching the codebase…`}),(0,s.jsx)(i,{children:`Analysing risk…`}),(0,s.jsx)(i,{children:`Generating response…`}),(0,s.jsx)(i,{children:`Reasoning…`})]})},d={name:`Cycling labels`,render:()=>{let e=[`Thinking…`,`Searching the codebase…`,`Generating…`,`Reasoning…`];function t(){let[t,n]=o.useState(0);return o.useEffect(()=>{let t=setInterval(()=>n(t=>(t+1)%e.length),1800);return()=>clearInterval(t)},[]),(0,s.jsx)(i,{children:e[t]})}return(0,s.jsx)(t,{})}},f={name:`RTL (Arabic)`,render:()=>(0,s.jsx)(`div`,{dir:`rtl`,children:(0,s.jsx)(i,{children:`جارٍ التفكير…`})})},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source},description:{story:`Default — "Thinking…" label shimmering.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: 'Label variants',
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  }}>
      <Shimmer>Thinking…</Shimmer>
      <Shimmer>Searching the codebase…</Shimmer>
      <Shimmer>Analysing risk…</Shimmer>
      <Shimmer>Generating response…</Shimmer>
      <Shimmer>Reasoning…</Shimmer>
    </div>
}`,...u.parameters?.docs?.source},description:{story:`Common text label variants used across AI surfaces.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: 'Cycling labels',
  render: () => {
    const LABELS = ['Thinking…', 'Searching the codebase…', 'Generating…', 'Reasoning…'];
    function Demo() {
      const [idx, setIdx] = React.useState(0);
      React.useEffect(() => {
        const t = setInterval(() => setIdx(i => (i + 1) % LABELS.length), 1800);
        return () => clearInterval(t);
      }, []);
      return <Shimmer>{LABELS[idx]}</Shimmer>;
    }
    return <Demo />;
  }
}`,...d.parameters?.docs?.source},description:{story:`Cycling labels — shows how to rotate the label during multi-stage model activity.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: 'RTL (Arabic)',
  render: () => <div dir="rtl">
      <Shimmer>جارٍ التفكير…</Shimmer>
    </div>
}`,...f.parameters?.docs?.source},description:{story:`RTL — gradient direction mirrors for right-to-left text.`,...f.parameters?.docs?.description}}},p=[`Default`,`LabelVariants`,`CyclingLabels`,`RTL`]}))();export{d as CyclingLabels,l as Default,u as LabelVariants,f as RTL,p as __namedExportsOrder,c as default};