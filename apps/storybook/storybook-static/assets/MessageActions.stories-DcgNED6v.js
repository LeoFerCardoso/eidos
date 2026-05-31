import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{Er as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m;e((()=>{o=t(n(),1),a(),s=r(),c={title:`AI/MessageActions`,component:i,tags:[`autodocs`],parameters:{docs:{description:{component:"Canonical reply toolbar: copy, regenerate, thumbs-up/down, and an optional share button. Switch between `message` and `response` surfaces to adjust icon size and layout chrome."}}},args:{surface:`message`,vote:null},argTypes:{surface:{control:`inline-radio`,options:[`message`,`response`]},vote:{control:`inline-radio`,options:[`up`,`down`,null]}}},l={},u={args:{surface:`response`,onShare:()=>{}}},d={args:{vote:`up`}},f={args:{vote:`down`}},p={render:()=>{function e(){let[e,t]=o.useState(null);return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:12},children:[(0,s.jsx)(i,{vote:e,onVote:t,onCopy:()=>{},onRegen:()=>{}}),(0,s.jsxs)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`},children:[`vote: `,e??`null`]})]})}return(0,s.jsx)(e,{})}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source},description:{story:`Default toolbar driven by controls.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    surface: 'response',
    onShare: () => {}
  }
}`,...u.parameters?.docs?.source},description:{story:`Response surface — slightly larger hit-targets and a share button.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    vote: 'up'
  }
}`,...d.parameters?.docs?.source},description:{story:`Voted up — thumbs-up button is active (ember fill).`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    vote: 'down'
  }
}`,...f.parameters?.docs?.source},description:{story:`Voted down — thumbs-down button is active.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    function Demo() {
      const [vote, setVote] = React.useState<'up' | 'down' | null>(null);
      return <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}>
          <MessageActions vote={vote} onVote={setVote} onCopy={() => {}} onRegen={() => {}} />
          <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--fg-muted)'
        }}>
            vote: {vote ?? 'null'}
          </span>
        </div>;
    }
    return <Demo />;
  }
}`,...p.parameters?.docs?.source},description:{story:`Controlled interactive — vote state toggles on click.`,...p.parameters?.docs?.description}}},m=[`Default`,`ResponseSurface`,`VotedUp`,`VotedDown`,`Interactive`]}))();export{l as Default,p as Interactive,u as ResponseSurface,f as VotedDown,d as VotedUp,m as __namedExportsOrder,c as default};