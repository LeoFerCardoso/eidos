import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{pa as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f,p,m,h,g,_;e((()=>{o=t(n(),1),a(),s=r(),c={title:`Primitives/Pagination`,component:i,tags:[`autodocs`],parameters:{docs:{description:{component:'A fully accessible paginator — Previous / page buttons / Next with smart ellipsis for long ranges. Sizes (`sm` / `md` / `lg`), outline style, compact mode (icon-only Prev/Next), and optional First/Last jump buttons are all available. All pages carry `aria-label` and `aria-current="page"`.'}}},args:{total:10,current:5,size:`md`,outline:!1,compact:!1,showFirstLast:!1,siblings:1},argTypes:{total:{control:`number`,description:`Total number of pages.`},current:{control:`number`,description:`Currently active page (1-based).`},size:{control:`inline-radio`,options:[`sm`,`md`,`lg`],description:`Size preset.`},outline:{control:`boolean`,description:`Outline style (bordered buttons, no fill).`},compact:{control:`boolean`,description:`Hides "Previous" / "Next" text labels.`},showFirstLast:{control:`boolean`,description:`Shows First and Last jump buttons.`},siblings:{control:`number`,description:`Pages shown on each side of the current page.`}}},l={},u={render:e=>{let[t,n]=o.useState(1);return(0,s.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:16,alignItems:`flex-start`},children:[(0,s.jsx)(i,{...e,current:t,onChange:n}),(0,s.jsxs)(`span`,{style:{fontFamily:`var(--font-mono)`,fontSize:12,color:`var(--fg-muted)`},children:[`Page `,t,` of `,e.total]})]})}},d={render:()=>(0,s.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:20},children:[`sm`,`md`,`lg`].map(e=>(0,s.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:16},children:[(0,s.jsx)(`code`,{style:{fontFamily:`var(--font-mono)`,fontSize:11,color:`var(--fg-muted)`,width:20},children:e}),(0,s.jsx)(i,{total:8,current:4,size:e})]},e))})},f={args:{outline:!0,total:8,current:3}},p={args:{compact:!0,total:12,current:6}},m={args:{showFirstLast:!0,total:50,current:25}},h={args:{total:100,current:50,siblings:1}},g={args:{total:20,current:10,siblings:2}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source},description:{story:`Default — page 5 of 10, driven by controls.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [current, setCurrent] = React.useState(1);
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      alignItems: 'flex-start'
    }}>
        <Pagination {...args} current={current} onChange={setCurrent} />
        <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--fg-muted)'
      }}>
          Page {current} of {args.total}
        </span>
      </div>;
  }
}`,...u.parameters?.docs?.source},description:{story:"Interactive — `current` is wired to `useState` for real navigation.",...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 20
  }}>
      {(['sm', 'md', 'lg'] as const).map(size => <div key={size} style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }}>
          <code style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--fg-muted)',
        width: 20
      }}>{size}</code>
          <Pagination total={8} current={4} size={size} />
        </div>)}
    </div>
}`,...d.parameters?.docs?.source},description:{story:`Sizes — sm, md, and lg side by side.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    outline: true,
    total: 8,
    current: 3
  }
}`,...f.parameters?.docs?.source},description:{story:`Outline style — bordered buttons, no background fill.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    compact: true,
    total: 12,
    current: 6
  }
}`,...p.parameters?.docs?.source},description:{story:`Compact — icon-only Prev/Next, saves space in dense layouts.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    showFirstLast: true,
    total: 50,
    current: 25
  }
}`,...m.parameters?.docs?.source},description:{story:`First/Last jump buttons — for very long page ranges.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    total: 100,
    current: 50,
    siblings: 1
  }
}`,...h.parameters?.docs?.source},description:{story:`Wide range — 100 pages with smart ellipsis on both sides.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    total: 20,
    current: 10,
    siblings: 2
  }
}`,...g.parameters?.docs?.source},description:{story:`Siblings=2 — shows two pages on each side of the current.`,...g.parameters?.docs?.description}}},_=[`Default`,`Interactive`,`Sizes`,`Outline`,`Compact`,`WithFirstLast`,`WideRange`,`TwoSiblings`]}))();export{p as Compact,l as Default,u as Interactive,f as Outline,d as Sizes,g as TwoSiblings,h as WideRange,m as WithFirstLast,_ as __namedExportsOrder,c as default};