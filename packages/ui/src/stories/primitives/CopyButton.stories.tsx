import type { Meta, StoryObj } from '@storybook/react-vite';
import { CopyButton } from '@forge/ui';

const meta = {
  title: 'Primitives/CopyButton',
  component: CopyButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A small icon+label button that writes `text` to the clipboard. ' +
          'Flips to a "Copied" confirmation state for 1.4 s then resets automatically.',
      },
    },
  },
  args: { text: 'npm install @forge/ui', label: 'Copy' },
  argTypes: {
    text: { control: 'text', description: 'The string that will be written to the clipboard.' },
    label: { control: 'text', description: 'Button label — defaults to "Copy".' },
  },
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default state — idle, ready to copy. */
export const Default: Story = {};

/** Custom label — useful when copying a token name rather than code. */
export const CustomLabel: Story = {
  args: { text: '--ember', label: 'var' },
};

/** Minimal — no label prop means default label "Copy" is shown. */
export const CopyingAToken: Story = {
  args: { text: 'var(--accent)', label: 'Copy token' },
};
