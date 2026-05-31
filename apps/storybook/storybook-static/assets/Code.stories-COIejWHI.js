import{i as e}from"./preload-helper-xPQekRTU.js";import{aa as t,t as n}from"./src-DgoylXRw.js";var r,i,a,o,s,c;e((()=>{n(),r={title:`Primitives/Code`,component:t,tags:[`autodocs`],parameters:{docs:{description:{component:"A `<pre>` block with Forge's single-pass syntax highlighter. Supports `jsx`/`ts`/`tsx`/`js`, `css`, `html`, `bash`/`shell` — auto-detects HTML when the first non-space character is `<` with no obvious JS at the top level."}}},args:{lang:`jsx`,children:`import { Button } from '@forge/ui';

export default function App() {
  return <Button variant="primary">Ship it</Button>;
}`},argTypes:{lang:{control:`select`,options:[`jsx`,`tsx`,`ts`,`js`,`css`,`html`,`bash`],description:`Language hint for the tokenizer.`},children:{control:`text`,description:`The raw source string to display.`}}},i={},a={args:{lang:`css`,children:`:root {
  --ember: #FF6B35;
  --bg: #08090A;
  --fg: #F5F5F5;
}

@media (prefers-color-scheme: light) {
  :root {
    --bg: #FFFFFF;
    --fg: #08090A;
  }
}`}},o={args:{lang:`bash`,children:`# Install the Forge UI library
pnpm dlx forge-ui@latest add button

# Start the dev server
npm run dev`}},s={args:{lang:`html`,children:`<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8">
    <title>Forge DS</title>
  </head>
  <body>
    <button class="btn btn-primary" type="button">Ship it</button>
  </body>
</html>`}},i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{}`,...i.parameters?.docs?.source},description:{story:`JSX / TSX snippet — the most common use case.`,...i.parameters?.docs?.description}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    lang: 'css',
    children: \`:root {\\n  --ember: #FF6B35;\\n  --bg: #08090A;\\n  --fg: #F5F5F5;\\n}\\n\\n@media (prefers-color-scheme: light) {\\n  :root {\\n    --bg: #FFFFFF;\\n    --fg: #08090A;\\n  }\\n}\`
  }
}`,...a.parameters?.docs?.source},description:{story:`CSS — highlights custom properties, at-rules, values with units.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    lang: 'bash',
    children: \`# Install the Forge UI library\\npnpm dlx forge-ui@latest add button\\n\\n# Start the dev server\\nnpm run dev\`
  }
}`,...o.parameters?.docs?.source},description:{story:`Bash / shell commands — highlights comments, strings, variables.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    lang: 'html',
    children: \`<!DOCTYPE html>\\n<html lang="en" dir="ltr">\\n  <head>\\n    <meta charset="UTF-8">\\n    <title>Forge DS</title>\\n  </head>\\n  <body>\\n    <button class="btn btn-primary" type="button">Ship it</button>\\n  </body>\\n</html>\`
  }
}`,...s.parameters?.docs?.source},description:{story:`HTML — state-machine highlighter marks tag names, attributes, values.`,...s.parameters?.docs?.description}}},c=[`Default`,`CssSnippet`,`BashSnippet`,`HtmlSnippet`]}))();export{o as BashSnippet,a as CssSnippet,i as Default,s as HtmlSnippet,c as __namedExportsOrder,r as default};