import type { Meta, StoryObj } from '@storybook/react-vite';
import { KbdRow } from '@eidos/ui';

const meta = {
  title: 'Primitives/KbdRow',
  component: KbdRow,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Label + keyboard chord row for menus and command palettes. ' +
          'Composes `.kbd` cells from tokens.css; an optional `meta` hint sits between the label and the chord.',
      },
    },
  },
  args: {
    label: 'Open command palette',
    keys: ['⌘', 'K'],
  },
  argTypes: {
    label: { control: 'text' },
    meta: { control: 'text', description: 'Muted hint between label and chord.' },
    keys: { control: 'object', description: 'Array of key cap strings.' },
  },
} satisfies Meta<typeof KbdRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Single row — command palette shortcut. */
export const Default: Story = {};

/** Three-key chord. */
export const ThreeKey: Story = {
  args: { label: 'Force push (blocked)', keys: ['⌘', '⇧', 'P'] },
};

/** With a meta hint. */
export const WithMeta: Story = {
  args: { label: 'Jump to definition', meta: 'editor', keys: ['F12'] },
};

/** No keys — label only row (section header in a palette). */
export const LabelOnly: Story = {
  args: { label: 'Navigation', keys: [] },
};

/** A realistic command palette shortcut sheet. */
export const InContext: Story = {
  render: () => (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '8px 0',
        minWidth: 320,
      }}
    >
      {[
        { label: 'Open command palette', keys: ['⌘', 'K'] },
        { label: 'New deploy', keys: ['⌘', 'D'] },
        { label: 'Search services', keys: ['⌘', '/'] },
        { label: 'Toggle dark mode', keys: ['⌘', '⇧', 'L'] },
        { label: 'Go to incidents', keys: ['G', 'I'], meta: 'then' },
        { label: 'Copy service ID', keys: ['⌘', 'C'], meta: 'focused row' },
      ].map(({ label, keys, meta }) => (
        <KbdRow key={label} label={label} keys={keys} meta={meta} />
      ))}
    </div>
  ),
};
