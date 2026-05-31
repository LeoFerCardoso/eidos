import{i as e}from"./preload-helper-xPQekRTU.js";import{ma as t,t as n}from"./src-DgoylXRw.js";var r,i,a,o,s,c,l;e((()=>{n(),r=[{prop:`variant`,type:`'primary' | 'ghost' | 'danger'`,default:`'primary'`,required:!1,description:`Visual style of the button.`},{prop:`size`,type:`'sm' | 'md' | 'lg'`,default:`'md'`,required:!1,description:`Controls padding and font size.`},{prop:`disabled`,type:`boolean`,default:`false`,required:!1,description:`Disables pointer events and lowers opacity.`},{prop:`loading`,type:`boolean`,default:`false`,required:!1,description:`Shows a spinner and disables the button.`},{prop:`onClick`,type:`(e: MouseEvent) => void`,default:void 0,required:!1,description:"Click handler forwarded to the `<button>` element."},{prop:`children`,type:`React.ReactNode`,default:void 0,required:!0,description:`Button label or icon+label pair.`},{prop:`className`,type:`string`,default:void 0,required:!1,description:`Additional class names merged onto the root element.`}],i=[{prop:`tone`,type:`'up' | 'degraded' | 'down'`,default:`'up'`,required:!1,description:`Status tone driving the dot color.`},{prop:`size`,type:`'sm' | 'md' | 'lg'`,default:`'md'`,required:!1,description:`Diameter preset.`},{prop:`pulse`,type:`boolean`,default:`false`,required:!1,description:`Animate a soft pulse for live/at-risk states.`}],a={title:`Docs/PropsTable`,component:t,tags:[`autodocs`],parameters:{docs:{description:{component:`The API reference table used at the bottom of every component docs page. Rows declare prop name, type, default, and description; required props get an asterisk. Prop / type / default cells render as inline code with Forge's semantic color system.`}}},args:{label:`props`,rows:r},argTypes:{label:{control:`text`,description:`Heading shown in the frame bar — defaults to "props".`}}},o={},s={args:{label:`StatusDot props`,rows:i}},c={args:{label:`required prop`,rows:[{prop:`children`,type:`React.ReactNode`,default:void 0,required:!0,description:`Content to render inside the component.`}]}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source},description:{story:`Full Button API table — seven props including a required one.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'StatusDot props',
    rows: SHORT_ROWS
  }
}`,...s.parameters?.docs?.source},description:{story:`Short 3-row table — for a simple component like StatusDot.`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'required prop',
    rows: [{
      prop: 'children',
      type: 'React.ReactNode',
      default: undefined,
      required: true,
      description: 'Content to render inside the component.'
    }]
  }
}`,...c.parameters?.docs?.source},description:{story:`Single required prop — verifies the asterisk renders correctly.`,...c.parameters?.docs?.description}}},l=[`Default`,`Compact`,`RequiredOnly`]}))();export{s as Compact,o as Default,c as RequiredOnly,l as __namedExportsOrder,a as default};