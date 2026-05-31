import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{_r as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h,g,_,v;e((()=>{o=t(n(),1),a(),s=r(),c={id:`art-doc`,kind:`document`,title:`Incident Report — INC-9812`,meta:`4 KB · markdown`,content:`## Summary

High p95 latency spike in fraud-engine detected at 14:02 BRT.

## Root cause

The ML feature store returned stale data, causing the scoring chain to retry three times before the circuit breaker opened.

## Resolution

Feature store cache invalidated and canary rolled back to v3.4.6.`},l={id:`art-code`,kind:`code`,title:`rollback.ts`,meta:`22 lines · TypeScript`,lang:`ts`,content:`import { deployctl } from '@forge/infra';

async function rollback(service: string, version: string) {
  await deployctl.rollback({ service, version, ring: 0 });
}`},u={id:`art-tab`,kind:`document`,title:`Pix Router Analysis`,meta:`2 views`},d={title:`AI/ArtifactPanel`,component:i,tags:[`autodocs`],parameters:{docs:{description:{component:`A docked inline panel (wrapping the Forge Drawer in inline mode) that shows a model-produced artifact alongside the chat. Renders document, code, HTML, or app content by kind; supports a tab strip when multiple views are needed.`}},layout:`fullscreen`},args:{artifact:c,open:!0,side:`right`,width:460},argTypes:{open:{control:`boolean`},side:{control:`inline-radio`,options:[`right`,`left`]},width:{control:`number`}}},f={},p={args:{artifact:l}},m={args:{side:`left`}},h={args:{open:!1}},g={args:{artifact:u},render:e=>(0,s.jsx)(i,{...e,tabs:[{id:`summary`,label:`Summary`,content:(0,s.jsx)(`p`,{style:{padding:`12px 16px`,color:`var(--fg-muted)`},children:`Risk score delta: +12 over the past 7 days.`})},{id:`raw`,label:`Raw data`,content:(0,s.jsx)(`pre`,{style:{padding:`12px 16px`,fontSize:12},children:`{ "risk_delta": 12, "period": "7d" }`})}]})},_={parameters:{layout:`fullscreen`},render:()=>{let[e,t]=o.useState(!0);return(0,s.jsxs)(`div`,{style:{display:`flex`,height:`100vh`},children:[(0,s.jsxs)(`div`,{style:{flex:1,padding:24},children:[(0,s.jsx)(`button`,{className:`btn sm`,onClick:()=>t(e=>!e),children:e?`Close panel`:`Open panel`}),(0,s.jsx)(`p`,{style:{marginTop:16,color:`var(--fg-muted)`,fontSize:14},children:`The artifact panel docks inline — this column shrinks when the panel opens.`})]}),(0,s.jsx)(i,{artifact:c,open:e,onClose:()=>t(!1),width:420})]})}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{}`,...f.parameters?.docs?.source},description:{story:`Document artifact — renders paragraph content from ArtifactRef.content.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    artifact: CODE_ARTIFACT
  }
}`,...p.parameters?.docs?.source},description:{story:`Code artifact — renders a pre/code block.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    side: 'left'
  }
}`,...m.parameters?.docs?.source},description:{story:`Panel docked on the left side.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    open: false
  }
}`,...h.parameters?.docs?.source},description:{story:`Closed — panel is collapsed, space is reclaimed by siblings.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    artifact: TAB_ARTIFACT
  },
  render: args => <ArtifactPanel {...args} tabs={[{
    id: 'summary',
    label: 'Summary',
    content: <p style={{
      padding: '12px 16px',
      color: 'var(--fg-muted)'
    }}>Risk score delta: +12 over the past 7 days.</p>
  }, {
    id: 'raw',
    label: 'Raw data',
    content: <pre style={{
      padding: '12px 16px',
      fontSize: 12
    }}>{\`{ "risk_delta": 12, "period": "7d" }\`}</pre>
  }]} />
}`,...g.parameters?.docs?.source},description:{story:`With a tab strip — two named views inside the same panel.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  parameters: {
    layout: 'fullscreen'
  },
  render: () => {
    const [open, setOpen] = React.useState(true);
    return <div style={{
      display: 'flex',
      height: '100vh'
    }}>
        <div style={{
        flex: 1,
        padding: 24
      }}>
          <button className="btn sm" onClick={() => setOpen(v => !v)}>
            {open ? 'Close panel' : 'Open panel'}
          </button>
          <p style={{
          marginTop: 16,
          color: 'var(--fg-muted)',
          fontSize: 14
        }}>
            The artifact panel docks inline — this column shrinks when the panel opens.
          </p>
        </div>
        <ArtifactPanel artifact={DOC_ARTIFACT} open={open} onClose={() => setOpen(false)} width={420} />
      </div>;
  }
}`,..._.parameters?.docs?.source},description:{story:`Interactive — toggle open/closed with a button beside the panel.`,..._.parameters?.docs?.description}}},v=[`Default`,`CodeKind`,`LeftSide`,`Closed`,`WithTabs`,`Interactive`]}))();export{h as Closed,p as CodeKind,f as Default,_ as Interactive,m as LeftSide,g as WithTabs,v as __namedExportsOrder,d as default};