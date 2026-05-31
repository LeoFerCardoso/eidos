import{i as e}from"./preload-helper-xPQekRTU.js";import{sa as t,t as n}from"./src-DgoylXRw.js";var r,i,a,o,s;e((()=>{n(),r={title:`Primitives/CodeTree`,component:t,tags:[`autodocs`],parameters:{docs:{description:{component:`A VS Code-style multi-file viewer with a collapsible folder tree on the left and a syntax-highlighted code pane on the right. Selecting a file in the tree swaps the code pane; the active file's copy button always targets the visible content.`}}},args:{files:[{path:`components/Button/Button.tsx`,code:`import * as React from 'react';
import { cva } from 'class-variance-authority';

const buttonVariants = cva('btn', {
  variants: {
    variant: { primary: 'btn-primary', ghost: 'btn-ghost' },
    size:    { sm: 'sm', md: '', lg: 'lg' },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});

export const Button = ({ variant, size, children, ...props }) => (
  <button className={buttonVariants({ variant, size })} {...props}>
    {children}
  </button>
);`,lang:`tsx`},{path:`components/Button/Button.stories.tsx`,code:`import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
  title: 'Primitives/CodeTree',
  component: Button,
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: 'Ship it' } };`,lang:`tsx`},{path:`components/Button/index.ts`,code:`export { Button } from './Button';`,lang:`ts`},{path:`styles/button.css`,code:`.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  border-radius: var(--radius);
  font-weight: 500;
  cursor: pointer;
}

.btn-primary {
  background: var(--accent);
  color: var(--bg);
}`,lang:`css`}],defaultIndex:0,label:void 0},argTypes:{label:{control:`text`,description:`Optional frame label; defaults to the active file path.`},defaultIndex:{control:`number`,description:`Index of the initially selected file (0-based).`}}},i={},a={args:{defaultIndex:3,label:`button component`}},o={args:{label:`token files`,files:[{path:`tokens/dark.css`,code:`:root {
  --bg: #08090A;
  --fg: #F5F5F5;
  --ember: #FF6B35;
}`,lang:`css`},{path:`tokens/light.css`,code:`:root {
  --bg: #FFFFFF;
  --fg: #08090A;
  --ember: #FF6B35;
}`,lang:`css`}],defaultIndex:0}},i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{}`,...i.parameters?.docs?.source},description:{story:`Four-file component package — TSX, story, index, and CSS pane.`,...i.parameters?.docs?.description}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    defaultIndex: 3,
    label: 'button component'
  }
}`,...a.parameters?.docs?.source},description:{story:`Opens with the CSS file active to show style-pane highlighting.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'token files',
    files: [{
      path: 'tokens/dark.css',
      code: \`:root {\\n  --bg: #08090A;\\n  --fg: #F5F5F5;\\n  --ember: #FF6B35;\\n}\`,
      lang: 'css'
    }, {
      path: 'tokens/light.css',
      code: \`:root {\\n  --bg: #FFFFFF;\\n  --fg: #08090A;\\n  --ember: #FF6B35;\\n}\`,
      lang: 'css'
    }],
    defaultIndex: 0
  }
}`,...o.parameters?.docs?.source},description:{story:`Minimal two-file example — component + types.`,...o.parameters?.docs?.description}}},s=[`Default`,`OpenOnCss`,`TwoFiles`]}))();export{i as Default,a as OpenOnCss,o as TwoFiles,s as __namedExportsOrder,r as default};