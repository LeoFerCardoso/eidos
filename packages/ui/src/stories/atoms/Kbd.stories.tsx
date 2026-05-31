import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kbd } from '@eidos/ui';

const meta = {
  title: 'Primitives/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Keyboard key / chord / row component. ' +
          'Renders a single key (`<Kbd>⌘</Kbd>` or `keys="K"`), ' +
          'a chord (`keys={["⌘","K"]}`), ' +
          'or a label+chord row (`label="…" keys={[…]}`). ' +
          'Composes `.kbd` / `.kbd-chord` / `.kbd-row` from tokens.css.',
      },
    },
  },
  args: {
    children: '⌘',
  },
  argTypes: {
    children: { control: 'text', description: 'Key glyph (single-key mode, ignored when keys is set).' },
    keys: { control: 'object', description: 'String or array of keys. Single string → one key; array → chord.' },
    label: { control: 'text', description: 'Row label (start). Presence switches to row mode.' },
    meta: { control: 'text', description: 'Muted hint between label and chord (row mode only).' },
    className: { control: 'text' },
  },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Single key rendered via children. */
export const Default: Story = {};

/** Single key via `keys` prop (string shorthand). */
export const KeyString: Story = {
  args: { keys: 'Esc', children: undefined },
};

/** Chord — two-key shorthand. */
export const Chord: Story = {
  args: { keys: ['⌘', 'K'], children: undefined },
};

/** Three-key chord. */
export const ThreeKey: Story = {
  args: { keys: ['⌘', '⇧', 'P'], children: undefined },
};

/** Row mode — label + chord. */
export const Row: Story = {
  args: { label: 'Open command palette', keys: ['⌘', 'K'], children: undefined },
  decorators: [
    (Story) => (
      <div style={{ minWidth: 320, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
        <Story />
      </div>
    ),
  ],
};

/** Row with meta hint. */
export const RowWithMeta: Story = {
  args: { label: 'Jump to definition', keys: ['F12'], meta: 'editor', children: undefined },
  decorators: [
    (Story) => (
      <div style={{ minWidth: 320, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
        <Story />
      </div>
    ),
  ],
};

/** All single-key glyphs for modifier + action keys. */
export const AllKeys: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {['⌘', '⌥', '⌃', '⇧', '↵', 'Esc', '⌫', 'Tab', 'F12', '→', '↑', ' '].map((k) => (
        <Kbd key={k}>{k}</Kbd>
      ))}
    </div>
  ),
};

/** In context — command palette shortcut sheet using row mode. */
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
        { label: 'Open command palette', keys: ['⌘', 'K'] as string[] },
        { label: 'New deploy', keys: ['⌘', 'D'] as string[] },
        { label: 'Search services', keys: ['⌘', '/'] as string[] },
        { label: 'Toggle dark mode', keys: ['⌘', '⇧', 'L'] as string[] },
        { label: 'Go to incidents', keys: ['G', 'I'] as string[], meta: 'then' },
        { label: 'Copy service ID', keys: ['⌘', 'C'] as string[], meta: 'focused row' },
      ].map(({ label, keys, meta }) => (
        <Kbd key={label} label={label} keys={keys} meta={meta} />
      ))}
    </div>
  ),
};
