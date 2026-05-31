import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToolStatus } from '@eidos/ui';

const meta = {
  title: 'AI/ToolStatus',
  component: ToolStatus,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A compact status pill that represents the four run-states of an agent tool call: ' +
          'Pending (input streaming), Running (input available, executing), Done (output arrived), ' +
          'and Error (output error). Composes the Eidos Pill primitive so semantic tones and ' +
          'live-region announcements are handled by the design system — never colour alone.',
      },
    },
    layout: 'padded',
  },
  args: {
    state: 'output-available',
  },
  argTypes: {
    state: {
      control: 'select',
      options: ['input-streaming', 'input-available', 'output-available', 'output-error'],
      description: 'Run-state key; drives the tone, label, icon, and live-region behaviour.',
    },
  },
} satisfies Meta<typeof ToolStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: tool call completed successfully — Done pill in success tone. */
export const Default: Story = {
  args: { state: 'output-available' },
};

/** All four run-states side by side — covers the full Pending → Running → Done → Error matrix. */
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      <ToolStatus state="input-streaming" />
      <ToolStatus state="input-available" />
      <ToolStatus state="output-available" />
      <ToolStatus state="output-error" />
    </div>
  ),
};

/** In context — pills paired with realistic tool names as they appear inside a Tool block header. */
export const InContext: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        maxWidth: 460,
        fontFamily: 'var(--font-sans)',
        fontSize: 13,
        color: 'var(--fg)',
      }}
    >
      {(
        [
          { tool: 'eidos.ai.lookup_user',        state: 'input-streaming'  },
          { tool: 'eidos.ai.search_incidents',   state: 'input-available'  },
          { tool: 'eidos.infra.get_deploy_info', state: 'output-available' },
          { tool: 'eidos.ai.assess_risk_score',  state: 'output-error'     },
        ] as { tool: string; state: string }[]
      ).map(({ tool, state }) => (
        <div
          key={tool}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            padding: '6px 10px',
            borderRadius: 6,
            background: 'var(--surface-raised)',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)' }}>
            {tool}
          </span>
          <ToolStatus state={state} />
        </div>
      ))}
    </div>
  ),
};
