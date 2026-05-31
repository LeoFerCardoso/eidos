import{i as e,s as t}from"./preload-helper-xPQekRTU.js";import{B as n}from"./iframe-D7TzgJYi.js";import{t as r}from"./jsx-runtime-CaZkqeYb.js";import{ft as i,ht as a,mt as o,pt as s,t as c}from"./src-DgoylXRw.js";var l,u,d,f,p,m,h,g,_,v,y;e((()=>{l=t(n(),1),c(),u=r(),d=[{value:`q1`,q:`Is Forge a component library or a design system?`,a:`A design system. The components are the most visible surface, but the tokens, type scale, motion curves, and copy voice are what hold it together.`},{value:`q2`,q:`Can I use Forge with my own framework?`,a:`Yes. Tokens ship as plain CSS variables; the Tailwind preset is opt-in. The React examples on this site are for demonstration — copy them into your stack of choice.`},{value:`q3`,q:`What about RTL languages?`,a:`Supported via CSS logical properties. Set dir="rtl" on a parent and the layout flips. See the RTL page in Get Started for the full contract and known gaps.`},{value:`q4`,q:`Where do I report a missing component?`,a:`Open an issue in the Forge platform repo. The catalog grows as the product grows.`}],f={title:`Primitives/Accordion`,component:i,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:`Vertically stacked expandable rows. Compound API: <Accordion> wraps <AccordionItem value>, which wraps <AccordionTrigger> and <AccordionContent>. Keyboard: ArrowDown/Up move between triggers, Home/End jump first/last, Enter/Space toggle.`}}},args:{type:`single`,collapsible:!0,variant:`default`},argTypes:{type:{control:`inline-radio`,options:[`single`,`multiple`]},collapsible:{control:`boolean`},variant:{control:`inline-radio`,options:[`default`,`ghost`]}}},p={render:e=>{let[t,n]=l.useState(`q1`);return(0,u.jsx)(i,{...e,value:t,onValueChange:e=>n(e),children:d.map(({value:e,q:t,a:n})=>(0,u.jsxs)(o,{value:e,children:[(0,u.jsx)(a,{children:t}),(0,u.jsx)(s,{children:(0,u.jsx)(`p`,{children:n})})]},e))})}},m={args:{type:`multiple`},render:e=>{let[t,n]=l.useState([`q1`,`q2`]);return(0,u.jsx)(i,{...e,value:t,onValueChange:e=>n(e),children:d.map(({value:e,q:t,a:n})=>(0,u.jsxs)(o,{value:e,children:[(0,u.jsx)(a,{children:t}),(0,u.jsx)(s,{children:(0,u.jsx)(`p`,{children:n})})]},e))})}},h={args:{variant:`ghost`},render:e=>{let[t,n]=l.useState(`q1`);return(0,u.jsx)(i,{...e,value:t,onValueChange:e=>n(e),children:d.map(({value:e,q:t,a:n})=>(0,u.jsxs)(o,{value:e,children:[(0,u.jsx)(a,{children:t}),(0,u.jsx)(s,{children:(0,u.jsx)(`p`,{children:n})})]},e))})}},g={render:()=>(0,u.jsx)(i,{type:`single`,defaultValue:`q2`,collapsible:!0,children:d.map(({value:e,q:t,a:n})=>(0,u.jsxs)(o,{value:e,children:[(0,u.jsx)(a,{children:t}),(0,u.jsx)(s,{children:(0,u.jsx)(`p`,{children:n})})]},e))})},_={render:()=>{let[e,t]=l.useState(`r1`);return(0,u.jsx)(`div`,{dir:`rtl`,children:(0,u.jsxs)(i,{type:`single`,value:e,onValueChange:e=>t(e),collapsible:!0,children:[(0,u.jsxs)(o,{value:`r1`,children:[(0,u.jsx)(a,{children:`هل فورج مكتبة مكونات أم نظام تصميم؟`}),(0,u.jsx)(s,{children:(0,u.jsx)(`p`,{children:`نظام تصميم. المكونات هي الواجهة الأكثر وضوحاً، لكن الرموز ومقاييس الخط ومنحنيات الحركة هي ما يجمعها معاً.`})})]}),(0,u.jsxs)(o,{value:`r2`,children:[(0,u.jsx)(a,{children:`هل يمكنني استخدام فورج مع إطار العمل الخاص بي؟`}),(0,u.jsx)(s,{children:(0,u.jsx)(`p`,{children:`نعم. تُشحن الرموز كمتغيرات CSS عادية، وإعداد Tailwind اختياري.`})})]}),(0,u.jsxs)(o,{value:`r3`,children:[(0,u.jsx)(a,{children:`ماذا عن لغات RTL؟`}),(0,u.jsx)(s,{children:(0,u.jsx)(`p`,{children:`مدعومة عبر خصائص CSS المنطقية. عيّن dir="rtl" على عنصر أب وستنقلب التخطيطات.`})})]})]})})}},v={render:()=>{let[e,t]=l.useState(`shipping`);return(0,u.jsxs)(`div`,{style:{maxWidth:560,background:`var(--surface)`,borderRadius:10,padding:24},children:[(0,u.jsx)(`p`,{style:{fontFamily:`var(--font-sans)`,fontSize:13,fontWeight:600,color:`var(--fg)`,marginBottom:16},children:`Shipping & delivery`}),(0,u.jsxs)(i,{type:`single`,variant:`ghost`,value:e,onValueChange:e=>t(e),collapsible:!0,children:[(0,u.jsxs)(o,{value:`shipping`,children:[(0,u.jsx)(a,{children:`Standard delivery — 3 to 5 business days`}),(0,u.jsx)(s,{children:(0,u.jsx)(`p`,{children:`Free on orders over $50. Ships from the closest fulfillment center. Tracking emailed once the carrier scans.`})})]}),(0,u.jsxs)(o,{value:`express`,children:[(0,u.jsx)(a,{children:`Express delivery — next business day`}),(0,u.jsx)(s,{children:(0,u.jsx)(`p`,{children:`Available on most orders placed before 2pm local time. $14.95 flat. Saturday delivery in metro areas.`})})]}),(0,u.jsxs)(o,{value:`international`,children:[(0,u.jsx)(a,{children:`International — 7 to 14 business days`}),(0,u.jsx)(s,{children:(0,u.jsx)(`p`,{children:`Duties and taxes are calculated at checkout. Some countries have restricted SKUs flagged at the cart level.`})})]})]})]})}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [value, setValue] = React.useState<string>('q1');
    return <Accordion {...args} value={value} onValueChange={v => setValue(v as string)}>
        {FAQ.map(({
        value: v,
        q,
        a
      }) => <AccordionItem key={v} value={v}>
            <AccordionTrigger>{q}</AccordionTrigger>
            <AccordionContent><p>{a}</p></AccordionContent>
          </AccordionItem>)}
      </Accordion>;
  }
}`,...p.parameters?.docs?.source},description:{story:`Default single-open with the first row expanded.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'multiple'
  },
  render: args => {
    const [value, setValue] = React.useState<string[]>(['q1', 'q2']);
    return <Accordion {...args} value={value} onValueChange={v => setValue(v as string[])}>
        {FAQ.map(({
        value: v,
        q,
        a
      }) => <AccordionItem key={v} value={v}>
            <AccordionTrigger>{q}</AccordionTrigger>
            <AccordionContent><p>{a}</p></AccordionContent>
          </AccordionItem>)}
      </Accordion>;
  }
}`,...m.parameters?.docs?.source},description:{story:`Multiple items can be open simultaneously.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'ghost'
  },
  render: args => {
    const [value, setValue] = React.useState<string>('q1');
    return <Accordion {...args} value={value} onValueChange={v => setValue(v as string)}>
        {FAQ.map(({
        value: v,
        q,
        a
      }) => <AccordionItem key={v} value={v}>
            <AccordionTrigger>{q}</AccordionTrigger>
            <AccordionContent><p>{a}</p></AccordionContent>
          </AccordionItem>)}
      </Accordion>;
  }
}`,...h.parameters?.docs?.source},description:{story:`Ghost variant — borderless, dividers only between rows.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <Accordion type="single" defaultValue="q2" collapsible>
      {FAQ.map(({
      value,
      q,
      a
    }) => <AccordionItem key={value} value={value}>
          <AccordionTrigger>{q}</AccordionTrigger>
          <AccordionContent><p>{a}</p></AccordionContent>
        </AccordionItem>)}
    </Accordion>
}`,...g.parameters?.docs?.source},description:{story:`Uncontrolled with defaultValue — no external state needed.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = React.useState<string>('r1');
    return <div dir="rtl">
        <Accordion type="single" value={value} onValueChange={v => setValue(v as string)} collapsible>
          <AccordionItem value="r1">
            <AccordionTrigger>هل فورج مكتبة مكونات أم نظام تصميم؟</AccordionTrigger>
            <AccordionContent>
              <p>نظام تصميم. المكونات هي الواجهة الأكثر وضوحاً، لكن الرموز ومقاييس الخط ومنحنيات الحركة هي ما يجمعها معاً.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="r2">
            <AccordionTrigger>هل يمكنني استخدام فورج مع إطار العمل الخاص بي؟</AccordionTrigger>
            <AccordionContent>
              <p>نعم. تُشحن الرموز كمتغيرات CSS عادية، وإعداد Tailwind اختياري.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="r3">
            <AccordionTrigger>ماذا عن لغات RTL؟</AccordionTrigger>
            <AccordionContent>
              <p>مدعومة عبر خصائص CSS المنطقية. عيّن dir="rtl" على عنصر أب وستنقلب التخطيطات.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>;
  }
}`,..._.parameters?.docs?.source},description:{story:`RTL — chevron flips to the leading edge (logical CSS).`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [value, setValue] = React.useState<string>('shipping');
    return <div style={{
      maxWidth: 560,
      background: 'var(--surface)',
      borderRadius: 10,
      padding: 24
    }}>
        <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--fg)',
        marginBottom: 16
      }}>
          Shipping &amp; delivery
        </p>
        <Accordion type="single" variant="ghost" value={value} onValueChange={v => setValue(v as string)} collapsible>
          <AccordionItem value="shipping">
            <AccordionTrigger>Standard delivery — 3 to 5 business days</AccordionTrigger>
            <AccordionContent>
              <p>Free on orders over $50. Ships from the closest fulfillment center. Tracking emailed once the carrier scans.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="express">
            <AccordionTrigger>Express delivery — next business day</AccordionTrigger>
            <AccordionContent>
              <p>Available on most orders placed before 2pm local time. $14.95 flat. Saturday delivery in metro areas.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="international">
            <AccordionTrigger>International — 7 to 14 business days</AccordionTrigger>
            <AccordionContent>
              <p>Duties and taxes are calculated at checkout. Some countries have restricted SKUs flagged at the cart level.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>;
  }
}`,...v.parameters?.docs?.source},description:{story:`In-context — accordion inside a settings surface.`,...v.parameters?.docs?.description}}},y=[`Default`,`Multiple`,`Ghost`,`Uncontrolled`,`RTL`,`InContext`]}))();export{p as Default,h as Ghost,v as InContext,m as Multiple,_ as RTL,g as Uncontrolled,y as __namedExportsOrder,f as default};