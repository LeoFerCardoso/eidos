import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{ra as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h;e((()=>{o=t(n(),1),a(),s=r(),c=[{id:`src`,label:`src`,children:[{id:`src/payment`,label:`payment`,children:[{id:`src/payment/payment.service.ts`,label:`payment.service.ts`,meta:`+10 −1`},{id:`src/payment/payment.dto.ts`,label:`payment.dto.ts`,meta:`+3`},{id:`src/payment/payment.spec.ts`,label:`payment.spec.ts`,meta:`+18`}]},{id:`src/ledger`,label:`ledger`,children:[{id:`src/ledger/ledger.service.ts`,label:`ledger.service.ts`},{id:`src/ledger/ledger.types.ts`,label:`ledger.types.ts`}]},{id:`src/app.module.ts`,label:`app.module.ts`}]},{id:`package.json`,label:`package.json`,meta:`+1`},{id:`tsconfig.json`,label:`tsconfig.json`}],l=[{id:`pix`,label:`Pix`,icon:`folder`,children:[{id:`pix-router`,label:`pix-router`,icon:`server`,meta:`T1`,badge:`running`},{id:`ledger-svc`,label:`ledger-svc`,icon:`server`,meta:`T1`},{id:`reconciliation`,label:`reconciliation-svc`,icon:`server`,meta:`T1`}]},{id:`risk`,label:`Risk`,icon:`folder`,children:[{id:`bureau-gateway`,label:`bureau-gateway`,icon:`server`,meta:`T1`},{id:`fraud-engine`,label:`fraud-engine`,icon:`server`,meta:`T1`},{id:`score-engine`,label:`score-engine`,icon:`server`,meta:`T1`}]},{id:`identity`,label:`Identity`,icon:`folder`,children:[{id:`identity-svc`,label:`identity-svc`,icon:`server`,meta:`T1`,badge:`alert`},{id:`session-store`,label:`session-store`,icon:`server`,meta:`T2`}]}],u={title:`Elements/TreeView`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:"An interactive collapsible tree with explicit indent guides, folder/file icons, chevron toggles, ember selection tint, and optional meta/badge slots per node. Pass `defaultExpanded` to pre-open specific branches; bind `selected` + `onSelect` for controlled single-selection."}}},args:{nodes:c,defaultExpanded:[`src`,`src/payment`],variant:`files`},argTypes:{variant:{control:`text`}}},d={},f={args:{nodes:l,defaultExpanded:[`pix`,`risk`,`identity`]}},p={render:()=>{let[e,t]=o.useState(`src/payment/payment.service.ts`);return(0,s.jsxs)(`div`,{style:{maxWidth:360},children:[(0,s.jsx)(i,{nodes:c,defaultExpanded:[`src`,`src/payment`],selected:e,onSelect:e=>t(e.id)}),(0,s.jsxs)(`p`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,marginTop:12},children:[`Selected: `,e]})]})}},m={render:()=>(0,s.jsxs)(`div`,{style:{display:`flex`,gap:24},children:[(0,s.jsxs)(`div`,{style:{width:260},children:[(0,s.jsx)(`p`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,marginBottom:8},children:`PR #7421 · 3 files changed`}),(0,s.jsx)(i,{nodes:c,defaultExpanded:[`src`,`src/payment`]})]}),(0,s.jsxs)(`div`,{style:{flex:1},children:[(0,s.jsx)(`p`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,marginBottom:8},children:`Service catalog`}),(0,s.jsx)(i,{nodes:l,defaultExpanded:[`pix`]})]})]})},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{}`,...d.parameters?.docs?.source},description:{story:`File tree with two levels pre-expanded.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    nodes: CATALOG_TREE,
    defaultExpanded: ['pix', 'risk', 'identity']
  }
}`,...f.parameters?.docs?.source},description:{story:`Service catalog tree — folders are tribes, leaves are services.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [sel, setSel] = React.useState<string>('src/payment/payment.service.ts');
    return <div style={{
      maxWidth: 360
    }}>
        <TreeView nodes={FILE_TREE} defaultExpanded={['src', 'src/payment']} selected={sel} onSelect={n => setSel(n.id)} />
        <p style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg-muted)',
        marginTop: 12
      }}>
          Selected: {sel}
        </p>
      </div>;
  }
}`,...p.parameters?.docs?.source},description:{story:`Controlled selection — click a node to highlight it.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 24
  }}>
      <div style={{
      width: 260
    }}>
        <p style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg-muted)',
        marginBottom: 8
      }}>
          PR #7421 · 3 files changed
        </p>
        <TreeView nodes={FILE_TREE} defaultExpanded={['src', 'src/payment']} />
      </div>
      <div style={{
      flex: 1
    }}>
        <p style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: 'var(--fg-muted)',
        marginBottom: 8
      }}>
          Service catalog
        </p>
        <TreeView nodes={CATALOG_TREE} defaultExpanded={['pix']} />
      </div>
    </div>
}`,...m.parameters?.docs?.source},description:{story:`File-changed tree in the sidebar of a PR review.`,...m.parameters?.docs?.description}}},h=[`Default`,`ServiceCatalog`,`WithSelection`,`InContext`]}))();export{d as Default,m as InContext,f as ServiceCatalog,p as WithSelection,h as __namedExportsOrder,u as default};