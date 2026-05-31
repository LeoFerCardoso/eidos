import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MessageActions } from '@eidos/ui';

const meta = {
  title: 'AI/MessageActions',
  component: MessageActions,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Canonical reply toolbar: copy, regenerate, thumbs-up/down, and an optional share button. ' +
          'Switch between `message` and `response` surfaces to adjust icon size and layout chrome.',
      },
    },
  },
  args: {
    surface: 'message',
    vote: null,
  },
  argTypes: {
    surface: { control: 'inline-radio', options: ['message', 'response'] },
    vote: { control: 'inline-radio', options: ['up', 'down', null] },
  },
} satisfies Meta<typeof MessageActions>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default toolbar driven by controls. */
export const Default: Story = {};

/** Response surface — slightly larger hit-targets and a share button. */
export const ResponseSurface: Story = {
  args: { surface: 'response', onShare: () => {} },
};

/** Voted up — thumbs-up button is active (ember fill). */
export const VotedUp: Story = {
  args: { vote: 'up' },
};

/** Voted down — thumbs-down button is active. */
export const VotedDown: Story = {
  args: { vote: 'down' },
};

/** Controlled interactive — vote state toggles on click. */
export const Interactive: Story = {
  render: () => {
    function Demo() {
      const [vote, setVote] = React.useState<'up' | 'down' | null>(null);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <MessageActions
            vote={vote}
            onVote={setVote}
            onCopy={() => {}}
            onRegen={() => {}}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>
            vote: {vote ?? 'null'}
          </span>
        </div>
      );
    }
    return <Demo/>;
  },
};
