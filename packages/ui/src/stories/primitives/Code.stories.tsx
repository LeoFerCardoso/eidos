import type { Meta, StoryObj } from '@storybook/react-vite';
import { Code } from '@forge/ui';

const meta = {
  title: 'Primitives/Code',
  component: Code,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A `<pre>` block with Forge\'s single-pass syntax highlighter. ' +
          'Supports `jsx`/`ts`/`tsx`/`js`, `css`, `html`, `bash`/`shell` — ' +
          'auto-detects HTML when the first non-space character is `<` with no obvious JS at the top level.',
      },
    },
  },
  args: {
    lang: 'jsx',
    children: `import { Button } from '@forge/ui';\n\nexport default function App() {\n  return <Button variant="primary">Ship it</Button>;\n}`,
  },
  argTypes: {
    lang: {
      control: 'select',
      options: ['jsx', 'tsx', 'ts', 'js', 'css', 'html', 'bash'],
      description: 'Language hint for the tokenizer.',
    },
    children: { control: 'text', description: 'The raw source string to display.' },
  },
} satisfies Meta<typeof Code>;

export default meta;
type Story = StoryObj<typeof meta>;

/** JSX / TSX snippet — the most common use case. */
export const Default: Story = {};

/** CSS — highlights custom properties, at-rules, values with units. */
export const CssSnippet: Story = {
  args: {
    lang: 'css',
    children: `:root {\n  --ember: #FF6B35;\n  --bg: #08090A;\n  --fg: #F5F5F5;\n}\n\n@media (prefers-color-scheme: light) {\n  :root {\n    --bg: #FFFFFF;\n    --fg: #08090A;\n  }\n}`,
  },
};

/** Bash / shell commands — highlights comments, strings, variables. */
export const BashSnippet: Story = {
  args: {
    lang: 'bash',
    children: `# Install the Forge UI library\npnpm dlx forge-ui@latest add button\n\n# Start the dev server\nnpm run dev`,
  },
};

/** HTML — state-machine highlighter marks tag names, attributes, values. */
export const HtmlSnippet: Story = {
  args: {
    lang: 'html',
    children: `<!DOCTYPE html>\n<html lang="en" dir="ltr">\n  <head>\n    <meta charset="UTF-8">\n    <title>Forge DS</title>\n  </head>\n  <body>\n    <button class="btn btn-primary" type="button">Ship it</button>\n  </body>\n</html>`,
  },
};
