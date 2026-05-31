import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./jsx-runtime-CaZkqeYb.js";import{Ea as n,t as r}from"./src-DgoylXRw.js";var i,a,o,s,c,l,u,d,f,p;e((()=>{r(),i=t(),a={title:`Primitives/Empty`,component:n,tags:[`autodocs`],parameters:{docs:{description:{component:"Canonical empty-state surface for tables, drawers, and hero sections. Three sizes (sm / md / lg) share the same chrome; pass `iconName` (keyed into Icons) or a ReactNode `icon`. `action` and `secondary` strings auto-render as Forge buttons."}}},args:{size:`md`,title:`No incidents found`,desc:`All systems are operating normally.`,iconName:`alert`,accent:!1,dotted:!1},argTypes:{size:{control:`inline-radio`,options:[`sm`,`md`,`lg`]},accent:{control:`boolean`,description:`Add ember accent tint to the container.`},dotted:{control:`boolean`,description:`Add a dashed border.`},title:{control:`text`},desc:{control:`text`},iconName:{control:`text`,description:`Key from the global Icons map.`},action:{control:`text`,description:`Primary CTA — string renders an ember button.`},secondary:{control:`text`,description:`Secondary CTA — string renders a ghost button.`}}},o={},s={args:{size:`sm`,title:`No results`,desc:`Try adjusting your filters.`}},c={args:{size:`lg`,title:`No services onboarded yet`,desc:`Connect your first service to start tracking quality gates and deployments.`,action:`Add service`,secondary:`Read docs`}},l={args:{title:`No deployments today`,desc:`Trigger a deploy or wait for the next scheduled ring rotation.`,action:`Trigger deploy`,secondary:`View runbook`}},u={args:{dotted:!0,title:`Drop runbook here`,desc:`YAML or JSON accepted.`,action:`Browse files`}},d={args:{accent:!0,title:`No open incidents`,desc:`Everything is healthy.`}},f={render:()=>(0,i.jsxs)(`div`,{style:{border:`1px solid var(--border)`,borderRadius:8,overflow:`hidden`},children:[(0,i.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`2fr 1fr 1fr`,padding:`8px 16px`,borderBottom:`1px solid var(--border)`,fontSize:11,color:`var(--fg-muted)`,background:`var(--surface)`},children:[(0,i.jsx)(`span`,{children:`Service`}),(0,i.jsx)(`span`,{children:`Tier`}),(0,i.jsx)(`span`,{children:`Last deploy`})]}),(0,i.jsx)(n,{size:`sm`,title:`No matching services`,desc:`Clear filters to show all services.`})]})},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source},description:{story:`Default medium empty state with icon and description.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'sm',
    title: 'No results',
    desc: 'Try adjusting your filters.'
  }
}`,...s.parameters?.docs?.source},description:{story:`Small — for table bodies and inline drawers.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'lg',
    title: 'No services onboarded yet',
    desc: 'Connect your first service to start tracking quality gates and deployments.',
    action: 'Add service',
    secondary: 'Read docs'
  }
}`,...c.parameters?.docs?.source},description:{story:`Large — for hero page-level empty states.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'No deployments today',
    desc: 'Trigger a deploy or wait for the next scheduled ring rotation.',
    action: 'Trigger deploy',
    secondary: 'View runbook'
  }
}`,...l.parameters?.docs?.source},description:{story:`With a primary action button.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    dotted: true,
    title: 'Drop runbook here',
    desc: 'YAML or JSON accepted.',
    action: 'Browse files'
  }
}`,...u.parameters?.docs?.source},description:{story:`Dotted border — used for drag-drop or upload targets.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    accent: true,
    title: 'No open incidents',
    desc: 'Everything is healthy.'
  }
}`,...d.parameters?.docs?.source},description:{story:`Accent tint — draws attention in dashboard cards.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    border: '1px solid var(--border)',
    borderRadius: 8,
    overflow: 'hidden'
  }}>
      <div style={{
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr',
      padding: '8px 16px',
      borderBottom: '1px solid var(--border)',
      fontSize: 11,
      color: 'var(--fg-muted)',
      background: 'var(--surface)'
    }}>
        <span>Service</span><span>Tier</span><span>Last deploy</span>
      </div>
      <Empty size="sm" title="No matching services" desc="Clear filters to show all services." />
    </div>
}`,...f.parameters?.docs?.source},description:{story:`In a table-body context — sm, no icon, minimal copy.`,...f.parameters?.docs?.description}}},p=[`Default`,`Small`,`Large`,`WithAction`,`Dotted`,`Accent`,`InContext`]}))();export{d as Accent,o as Default,u as Dotted,f as InContext,c as Large,s as Small,l as WithAction,p as __namedExportsOrder,a as default};