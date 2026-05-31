import type { Meta, StoryObj } from '@storybook/react-vite';
import { Mono } from '@eidos/ui';

const meta = {
  title: 'Docs/Mono',
  component: Mono,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'An inline monospace code reference rendered in ember (`var(--ember)`). ' +
          'Use it for token names, prop names, class names, or any short identifier within prose — ' +
          'never hand-roll `font-family: var(--font-mono)` inline.',
      },
    },
  },
  args: { children: '--ember' },
  argTypes: {
    children: { control: 'text', description: 'The code identifier or token name to display.' },
  },
} satisfies Meta<typeof Mono>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Single token name inline. */
export const Default: Story = {};

/** Inside a prose sentence — the expected usage context. */
export const InProse: Story = {
  render: () => (
    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', lineHeight: 1.6 }}>
      Use <Mono>variant="primary"</Mono> for the main call to action.
      The accent color is <Mono>var(--accent)</Mono> — sourced from <Mono>--ember</Mono>.
    </p>
  ),
};

/** Token references — the most common use in the Tokens section. */
export const TokenRefs: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {['--ember', '--accent', '--bg', '--fg', '--fg-muted', '--fg-faint', '--radius', '--font-mono', '--font-sans'].map((t) => (
        <span key={t}><Mono>{t}</Mono></span>
      ))}
    </div>
  ),
};
