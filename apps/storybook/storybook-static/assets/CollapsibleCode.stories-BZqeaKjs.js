import{i as e}from"./preload-helper-xPQekRTU.js";import{ca as t,t as n}from"./src-DgoylXRw.js";var r,i,a,o,s,c;e((()=>{n(),r=`import { Button } from '@forge/ui';

<Button variant="primary">Ship it</Button>`,i={title:`Primitives/CollapsibleCode`,component:t,tags:[`autodocs`],parameters:{docs:{description:{component:'A smart code display that clips snippets longer than 8 lines to ~6 visible lines with a fade overlay and a "Show code" / "Hide code" toggle. Short snippets render as a plain `Code` block with no toggle. Used inside `Frame` to prevent long examples from dominating page rhythm.'}}},args:{lang:`jsx`,code:`import * as React from 'react';
import { Button, Frame, Code } from '@forge/ui';

// Forge pattern: Frame wraps the live preview + CollapsibleCode
// so long examples do not dominate the page rhythm.
export function ButtonDemo() {
  const [loading, setLoading] = React.useState(false);
  const handleClick = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
  };
  return (
    <Frame label="Loading state" center>
      <Button variant="primary" disabled={loading} onClick={handleClick}>
        {loading ? 'Shipping…' : 'Ship it'}
      </Button>
    </Frame>
  );
}`},argTypes:{lang:{control:`select`,options:[`jsx`,`tsx`,`ts`,`js`,`css`,`html`,`bash`],description:`Language hint passed to the tokenizer.`},code:{control:`text`,description:`Source string to display.`}}},a={},o={args:{code:r,lang:`jsx`}},s={args:{lang:`css`,code:`.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  border: 1px solid transparent;
  border-radius: var(--radius);
  padding: var(--space-1-5) var(--space-3);
  font-weight: 500;
  font-size: var(--text-sm);
  line-height: 1;
  cursor: pointer;
  transition: background 120ms, color 120ms, box-shadow 120ms;
}

.btn-primary {
  background: var(--accent);
  color: var(--bg);
}

.btn-ghost {
  background: transparent;
  color: var(--fg);
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}`}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{}`,...a.parameters?.docs?.source},description:{story:`Long snippet — clipped initially; "Show code" toggle appears at the bottom.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    code: SHORT_CODE,
    lang: 'jsx'
  }
}`,...o.parameters?.docs?.source},description:{story:`Short snippet — under the 8-line threshold; renders as a plain code block with no toggle.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    lang: 'css',
    code: \`.btn {\\n  display: inline-flex;\\n  align-items: center;\\n  gap: var(--space-2);\\n  border: 1px solid transparent;\\n  border-radius: var(--radius);\\n  padding: var(--space-1-5) var(--space-3);\\n  font-weight: 500;\\n  font-size: var(--text-sm);\\n  line-height: 1;\\n  cursor: pointer;\\n  transition: background 120ms, color 120ms, box-shadow 120ms;\\n}\\n\\n.btn-primary {\\n  background: var(--accent);\\n  color: var(--bg);\\n}\\n\\n.btn-ghost {\\n  background: transparent;\\n  color: var(--fg);\\n}\\n\\n.btn:disabled {\\n  opacity: 0.4;\\n  cursor: not-allowed;\\n}\`
  }
}`,...s.parameters?.docs?.source},description:{story:`CSS snippet — shows the CSS tokenizer through the collapse chrome.`,...s.parameters?.docs?.description}}},c=[`Default`,`ShortSnippet`,`LongCss`]}))();export{a as Default,s as LongCss,o as ShortSnippet,c as __namedExportsOrder,i as default};