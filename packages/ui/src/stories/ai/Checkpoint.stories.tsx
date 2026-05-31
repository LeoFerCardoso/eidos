import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkpoint } from '@forge/ui';

const meta = {
  title: 'AI/Checkpoint',
  component: Checkpoint,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A save-point marker between conversation turns — "you can restore the conversation to here". ' +
          'Rendered as a centered chip on a hairline rule. Supply onRestore to make it interactive.',
      },
    },
  },
  args: {
    label: 'Plan agreed',
    time: '14:32',
  },
  argTypes: {
    label: { control: 'text' },
    time: { control: 'text' },
  },
} satisfies Meta<typeof Checkpoint>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Checkpoint with a timestamp, no restore action. */
export const Default: Story = {};

/** With a Restore button — wired to a no-op in this story. */
export const WithRestore: Story = {
  args: { label: 'Before rollback', time: '02:15' },
  render: (args) => (
    <Checkpoint {...args} onRestore={() => alert('Restore triggered')} />
  ),
};

/** Label only — no timestamp. */
export const LabelOnly: Story = {
  args: { label: 'Start of session', time: undefined },
};

/** Multiple checkpoints in a conversation thread. */
export const InContext: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 620 }}>
      <Checkpoint label="Plan agreed" time="14:02" />
      <Checkpoint label="Before deploy" time="14:28" onRestore={() => {}} />
      <Checkpoint label="After rollback" time="14:51" onRestore={() => {}} />
    </div>
  ),
};
