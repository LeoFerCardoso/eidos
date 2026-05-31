import type { Meta, StoryObj } from '@storybook/react-vite';
import { CollapsibleCode } from '@forge/ui';

// A short snippet — under the 8-line threshold; renders plain with no toggle.
const SHORT_CODE = `import { Button } from '@forge/ui';\n\n<Button variant="primary">Ship it</Button>`;

// A long snippet — over 8 lines; clipped initially with a "Show code" toggle.
const LONG_CODE = `import * as React from 'react';\nimport { Button, Frame, Code } from '@forge/ui';\n\n// Forge pattern: Frame wraps the live preview + CollapsibleCode\n// so long examples do not dominate the page rhythm.\nexport function ButtonDemo() {\n  const [loading, setLoading] = React.useState(false);\n  const handleClick = async () => {\n    setLoading(true);\n    await new Promise((r) => setTimeout(r, 1200));\n    setLoading(false);\n  };\n  return (\n    <Frame label="Loading state" center>\n      <Button variant="primary" disabled={loading} onClick={handleClick}>\n        {loading ? 'Shipping…' : 'Ship it'}\n      </Button>\n    </Frame>\n  );\n}`;

const meta = {
  title: 'Primitives/CollapsibleCode',
  component: CollapsibleCode,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A smart code display that clips snippets longer than 8 lines to ~6 visible lines ' +
          'with a fade overlay and a "Show code" / "Hide code" toggle. Short snippets render as a ' +
          'plain `Code` block with no toggle. Used inside `Frame` to prevent long examples from ' +
          'dominating page rhythm.',
      },
    },
  },
  args: {
    lang: 'jsx',
    code: LONG_CODE,
  },
  argTypes: {
    lang: {
      control: 'select',
      options: ['jsx', 'tsx', 'ts', 'js', 'css', 'html', 'bash'],
      description: 'Language hint passed to the tokenizer.',
    },
    code: { control: 'text', description: 'Source string to display.' },
  },
} satisfies Meta<typeof CollapsibleCode>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Long snippet — clipped initially; "Show code" toggle appears at the bottom. */
export const Default: Story = {};

/** Short snippet — under the 8-line threshold; renders as a plain code block with no toggle. */
export const ShortSnippet: Story = {
  args: { code: SHORT_CODE, lang: 'jsx' },
};

/** CSS snippet — shows the CSS tokenizer through the collapse chrome. */
export const LongCss: Story = {
  args: {
    lang: 'css',
    code: `.btn {\n  display: inline-flex;\n  align-items: center;\n  gap: var(--space-2);\n  border: 1px solid transparent;\n  border-radius: var(--radius);\n  padding: var(--space-1-5) var(--space-3);\n  font-weight: 500;\n  font-size: var(--text-sm);\n  line-height: 1;\n  cursor: pointer;\n  transition: background 120ms, color 120ms, box-shadow 120ms;\n}\n\n.btn-primary {\n  background: var(--accent);\n  color: var(--bg);\n}\n\n.btn-ghost {\n  background: transparent;\n  color: var(--fg);\n}\n\n.btn:disabled {\n  opacity: 0.4;\n  cursor: not-allowed;\n}`,
  },
};
