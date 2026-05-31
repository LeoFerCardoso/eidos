import{i as e}from"./preload-helper-xPQekRTU.js";import{oa as t,t as n}from"./src-DgoylXRw.js";var r,i,a,o,s;e((()=>{n(),r={title:`Primitives/CodeBlock`,component:t,tags:[`autodocs`],parameters:{docs:{description:{component:"A labeled code-only display panel — a headed frame with a copy button and highlighted body, but no preview area. Use it for terminal output, config recipes, or any snippet that stands alone without a live preview (reach for `Frame` when you need a preview + code pair)."}}},args:{label:`snippet`,lang:`jsx`,code:`import { Button } from '@forge/ui';

<Button variant="primary" size="md">Ship it</Button>`},argTypes:{label:{control:`text`,description:`Heading shown in the frame bar.`},lang:{control:`select`,options:[`jsx`,`tsx`,`ts`,`js`,`css`,`html`,`bash`],description:`Language hint for the tokenizer.`},code:{control:`text`,description:`Raw source string to highlight and offer for copy.`}}},i={},a={args:{label:`terminal`,lang:`bash`,code:`pnpm dlx forge-ui@latest add button`}},o={args:{label:`tokens.css`,lang:`css`,code:`:root {
  --ember: #FF6B35;
  --accent: var(--ember);
  --bg: #08090A;
  --fg: #F5F5F5;
  --fg-muted: #9CA3AF;
  --radius: 6px;
}`}},i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{}`,...i.parameters?.docs?.source},description:{story:`Default — JSX snippet with a label and copy button.`,...i.parameters?.docs?.description}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'terminal',
    lang: 'bash',
    code: \`pnpm dlx forge-ui@latest add button\`
  }
}`,...a.parameters?.docs?.source},description:{story:`Terminal / bash — the common installation-step pattern.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'tokens.css',
    lang: 'css',
    code: \`:root {\\n  --ember: #FF6B35;\\n  --accent: var(--ember);\\n  --bg: #08090A;\\n  --fg: #F5F5F5;\\n  --fg-muted: #9CA3AF;\\n  --radius: 6px;\\n}\`
  }
}`,...o.parameters?.docs?.source},description:{story:`CSS config — showing a tokens file excerpt.`,...o.parameters?.docs?.description}}},s=[`Default`,`BashInstall`,`CssConfig`]}))();export{a as BashInstall,o as CssConfig,i as Default,s as __namedExportsOrder,r as default};