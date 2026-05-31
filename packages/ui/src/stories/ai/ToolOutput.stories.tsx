import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToolOutput } from '@forge/ui';

const meta = {
  title: 'AI/ToolOutput',
  component: ToolOutput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The result section of a tool-call block. Accepts any Forge primitives as children — ' +
          'prose, Code, Table, or an error card. Switch label to "Error" when state is output-error.',
      },
    },
  },
  args: {
    label: 'Output',
    meta: '2 results',
  },
  argTypes: {
    label: { control: 'text' },
    meta: { control: 'text' },
  },
} satisfies Meta<typeof ToolOutput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Normal output with a result summary. */
export const Default: Story = {
  render: (args) => (
    <ToolOutput {...args}>
      <p style={{ margin: '8px 12px', fontSize: 13, color: 'var(--fg-muted)' }}>
        Found 2 open incidents in fraud-engine (last 24 h).
      </p>
    </ToolOutput>
  ),
};

/** Error state — relabel the section and show an error message. */
export const ErrorState: Story = {
  args: { label: 'Error', meta: '404' },
  render: (args) => (
    <ToolOutput {...args}>
      <p style={{ margin: '8px 12px', fontSize: 13, color: 'var(--fg-error, #e53e3e)' }}>
        User not found: usr_4f9a2c
      </p>
    </ToolOutput>
  ),
};

/** Empty result — tool returned successfully but with no data. */
export const Empty: Story = {
  args: { meta: '0 results' },
  render: (args) => (
    <ToolOutput {...args}>
      <p style={{ margin: '8px 12px', fontSize: 13, color: 'var(--fg-muted)' }}>
        No incidents found matching the query.
      </p>
    </ToolOutput>
  ),
};
