import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./jsx-runtime-CaZkqeYb.js";import{_a as n,da as r,fa as i,t as a}from"./src-DgoylXRw.js";var o,s,c,l,u,d,f;e((()=>{a(),o=t(),s={title:`Docs/Lede`,component:r,tags:[`autodocs`],parameters:{docs:{description:{component:"The muted explainer paragraph that follows every `SubHead`. Rendered as `var(--text-sm)` / `var(--fg-muted)` / `line-height 1.6` / `max-width 64ch` — never hand-roll a font size, use this for ALL section introductions."}}},args:{children:`Buttons trigger actions — form submission, navigation, or a command. Pick the variant that reflects the weight of the action in context.`,up:!1,wide:!1,narrow:!1},argTypes:{up:{control:`boolean`,description:`Tightens top margin when the lede directly follows a SubHead.`},wide:{control:`boolean`,description:`Removes the 64ch max-width cap.`},narrow:{control:`boolean`,description:`Constrains to a narrower measure.`},children:{control:`text`}}},c={},l={args:{up:!0},render:e=>(0,o.jsxs)(`div`,{children:[(0,o.jsx)(n,{children:`Usage`}),(0,o.jsxs)(r,{up:e.up,children:[`Combine `,(0,o.jsx)(i,{children:`variant`}),` and `,(0,o.jsx)(i,{children:`size`}),` props to express the visual weight and importance of each action in context.`]})]})},u={args:{wide:!0,children:`The Forge Design System is a family of interconnected systems — core tokens, component libraries for web, mobile, and AI — all sharing a single ember accent and Geist type scale.`}},d={render:()=>(0,o.jsxs)(r,{children:[`Pass `,(0,o.jsx)(i,{children:`variant="primary"`}),` for the main call to action and`,` `,(0,o.jsx)(i,{children:`variant="ghost"`}),` for secondary actions in the same surface. Use `,(0,o.jsx)(i,{children:`size="sm"`}),` inside dense table rows or toolbars.`]})},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{}`,...c.parameters?.docs?.source},description:{story:`Default — muted caption below a section heading.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    up: true
  },
  render: args => <div>
      <SubHead>Usage</SubHead>
      <Lede up={args.up}>
        Combine <Mono>variant</Mono> and <Mono>size</Mono> props to express the visual weight
        and importance of each action in context.
      </Lede>
    </div>
}`,...l.parameters?.docs?.source},description:{story:"`up` — tightens the top margin for tight SubHead + Lede pairs.",...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    wide: true,
    children: 'The Forge Design System is a family of interconnected systems — core tokens, component libraries for web, mobile, and AI — all sharing a single ember accent and Geist type scale.'
  }
}`,...u.parameters?.docs?.source},description:{story:`Wide — no max-width cap; useful for intro sections that need full column width.`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <Lede>
      Pass <Mono>variant="primary"</Mono> for the main call to action and{' '}
      <Mono>variant="ghost"</Mono> for secondary actions in the same surface.
      Use <Mono>size="sm"</Mono> inside dense table rows or toolbars.
    </Lede>
}`,...d.parameters?.docs?.source},description:{story:"With inline `Mono` references — the standard pattern for API prose.",...d.parameters?.docs?.description}}},f=[`Default`,`TightTop`,`Wide`,`WithMonoRefs`]}))();export{c as Default,l as TightTop,u as Wide,d as WithMonoRefs,f as __namedExportsOrder,s as default};