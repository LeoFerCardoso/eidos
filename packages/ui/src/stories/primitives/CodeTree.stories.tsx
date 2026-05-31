import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeTree } from '@eidos/ui';

// Shared fixture files used across stories.
const BUTTON_FILES = [
  {
    path: 'components/Button/Button.tsx',
    code: `import * as React from 'react';\nimport { cva } from 'class-variance-authority';\n\nconst buttonVariants = cva('btn', {\n  variants: {\n    variant: { primary: 'btn-primary', ghost: 'btn-ghost' },\n    size:    { sm: 'sm', md: '', lg: 'lg' },\n  },\n  defaultVariants: { variant: 'primary', size: 'md' },\n});\n\nexport const Button = ({ variant, size, children, ...props }) => (\n  <button className={buttonVariants({ variant, size })} {...props}>\n    {children}\n  </button>\n);`,
    lang: 'tsx',
  },
  {
    path: 'components/Button/Button.stories.tsx',
    code: `import type { Meta, StoryObj } from '@storybook/react-vite';\nimport { Button } from './Button';\n\nconst meta = {\n  title: 'Primitives/CodeTree',\n  component: Button,\n  tags: ['autodocs'],\n} satisfies Meta<typeof Button>;\n\nexport default meta;\ntype Story = StoryObj<typeof meta>;\n\nexport const Default: Story = { args: { children: 'Ship it' } };`,
    lang: 'tsx',
  },
  {
    path: 'components/Button/index.ts',
    code: `export { Button } from './Button';`,
    lang: 'ts',
  },
  {
    path: 'styles/button.css',
    code: `.btn {\n  display: inline-flex;\n  align-items: center;\n  gap: var(--space-2);\n  border-radius: var(--radius);\n  font-weight: 500;\n  cursor: pointer;\n}\n\n.btn-primary {\n  background: var(--accent);\n  color: var(--bg);\n}`,
    lang: 'css',
  },
];

const meta = {
  title: 'Primitives/CodeTree',
  component: CodeTree,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A VS Code-style multi-file viewer with a collapsible folder tree on the left and a ' +
          'syntax-highlighted code pane on the right. Selecting a file in the tree swaps the code pane; ' +
          'the active file\'s copy button always targets the visible content.',
      },
    },
  },
  args: {
    files: BUTTON_FILES,
    defaultIndex: 0,
    label: undefined,
  },
  argTypes: {
    label: { control: 'text', description: 'Optional frame label; defaults to the active file path.' },
    defaultIndex: {
      control: 'number',
      description: 'Index of the initially selected file (0-based).',
    },
  },
} satisfies Meta<typeof CodeTree>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Four-file component package — TSX, story, index, and CSS pane. */
export const Default: Story = {};

/** Opens with the CSS file active to show style-pane highlighting. */
export const OpenOnCss: Story = {
  args: { defaultIndex: 3, label: 'button component' },
};

/** Minimal two-file example — component + types. */
export const TwoFiles: Story = {
  args: {
    label: 'token files',
    files: [
      {
        path: 'tokens/dark.css',
        code: `:root {\n  --bg: #08090A;\n  --fg: #F5F5F5;\n  --ember: #FF6B35;\n}`,
        lang: 'css',
      },
      {
        path: 'tokens/light.css',
        code: `:root {\n  --bg: #FFFFFF;\n  --fg: #08090A;\n  --ember: #FF6B35;\n}`,
        lang: 'css',
      },
    ],
    defaultIndex: 0,
  },
};
