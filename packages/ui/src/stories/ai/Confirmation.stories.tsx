import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Confirmation } from '@eidos/ui';

const meta = {
  title: 'AI/Confirmation',
  component: Confirmation,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'An agent confirmation gate: the model asks before performing a consequential action. ' +
          'Pending state shows Confirm/Cancel; once resolved it collapses to a compact result line. ' +
          'Use tone="danger" for destructive actions.',
      },
    },
  },
  args: {
    title: 'Roll back pix-router to v2.6.9',
    message: 'This will terminate the in-flight Ring 2 canary and revert all traffic to the previous version.',
    tone: 'default',
    state: 'pending',
    confirmLabel: 'Roll back',
    cancelLabel: 'Cancel',
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['default', 'danger'] },
    state: { control: 'inline-radio', options: ['pending', 'confirmed', 'cancelled'] },
    confirmLabel: { control: 'text' },
    cancelLabel: { control: 'text' },
    title: { control: 'text' },
    message: { control: 'text' },
  },
} satisfies Meta<typeof Confirmation>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pending — awaiting user decision. */
export const Default: Story = {};

/** Danger tone — Confirm button uses the destructive red. */
export const Danger: Story = {
  args: {
    title: 'Delete service ledger-svc',
    message: 'This is permanent. All data, configs, and deploy history will be removed.',
    tone: 'danger',
    confirmLabel: 'Delete service',
  },
};

/** Confirmed — collapsed to a result line. */
export const Confirmed: Story = {
  args: { state: 'confirmed' },
};

/** Cancelled — collapsed to a result line. */
export const Cancelled: Story = {
  args: { state: 'cancelled' },
};

/** Interactive — wires state transitions with local state. */
export const Interactive: Story = {
  render: () => {
    const [state, setState] = React.useState<string>('pending');
    return (
      <Confirmation
        title="Roll back pix-router to v2.6.9"
        message="This will terminate the in-flight Ring 2 canary and revert all traffic to the previous version."
        tone="danger"
        state={state}
        confirmLabel="Roll back"
        cancelLabel="Cancel"
        onConfirm={() => setState('confirmed')}
        onCancel={() => setState('cancelled')}
      />
    );
  },
};
