import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tool, ToolInput, ToolOutput } from '@forge/ui';

// Realistic fintech tool-call params used across stories.
const SEARCH_PARAMS = {
  service: 'fraud-engine',
  since: '2026-05-28T00:00:00Z',
  limit: 50,
};

const LOOKUP_PARAMS = {
  user_id: 'usr_4f9a2c',
  fields: ['risk_score', 'kyc_status', 'last_pix'],
};

const meta = {
  title: 'AI/Tool',
  component: Tool,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A four-state (input-streaming → input-available → output-available → output-error) ' +
          'collapsible block representing one agent tool call. Compose with ToolInput and ToolOutput as children.',
      },
    },
  },
  args: {
    name: 'search_incidents',
    ns: 'forge.ai',
    state: 'output-available',
    ms: 312,
  },
  argTypes: {
    name: { control: 'text' },
    ns: { control: 'text' },
    state: {
      control: 'select',
      options: ['input-streaming', 'input-available', 'output-available', 'output-error'],
    },
    ms: { control: 'number' },
    defaultOpen: { control: 'boolean' },
  },
} satisfies Meta<typeof Tool>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Single call, settled with both input and output visible. */
export const Default: Story = {
  render: (args) => (
    <Tool {...args}>
      <ToolInput params={SEARCH_PARAMS} paramsHint="3 args" />
      <ToolOutput meta="2 results">
        <p style={{ margin: '8px 12px', fontSize: 13, color: 'var(--fg-muted)' }}>
          Found 2 incidents in fraud-engine matching the query window.
        </p>
      </ToolOutput>
    </Tool>
  ),
};

/** Input is still streaming — JSON skeleton shimmer, no output yet. */
export const InputStreaming: Story = {
  args: { state: 'input-streaming', ms: undefined, name: 'lookup_user' },
  render: (args) => (
    <Tool {...args}>
      <ToolInput params={LOOKUP_PARAMS} streaming />
    </Tool>
  ),
};

/** Input arrived but the call is still running — no output section yet. */
export const InputAvailable: Story = {
  args: { state: 'input-available', ms: undefined, name: 'lookup_user' },
  render: (args) => (
    <Tool {...args}>
      <ToolInput params={LOOKUP_PARAMS} paramsHint="2 args" />
    </Tool>
  ),
};

/** The tool returned an error. Output section is labeled "Error". */
export const OutputError: Story = {
  args: { state: 'output-error', ms: 88, name: 'lookup_user' },
  render: (args) => (
    <Tool {...args}>
      <ToolInput params={LOOKUP_PARAMS} paramsHint="2 args" />
      <ToolOutput label="Error" meta="404">
        <p style={{ margin: '8px 12px', fontSize: 13, color: 'var(--fg-error, #e53e3e)' }}>
          User not found: usr_4f9a2c
        </p>
      </ToolOutput>
    </Tool>
  ),
};

/** Multiple tool calls stacked — common in agentic reasoning traces. */
export const MultipleTools: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 620 }}>
      <Tool name="lookup_user" ns="forge.ai" state="output-available" ms={142}>
        <ToolInput params={LOOKUP_PARAMS} paramsHint="2 args" />
        <ToolOutput meta="1 result">
          <p style={{ margin: '8px 12px', fontSize: 13, color: 'var(--fg-muted)' }}>
            Risk score: 74 · KYC: approved · Last Pix: 2026-05-28
          </p>
        </ToolOutput>
      </Tool>
      <Tool name="search_incidents" ns="forge.ai" state="output-available" ms={312}>
        <ToolInput params={SEARCH_PARAMS} paramsHint="3 args" />
        <ToolOutput meta="2 results">
          <p style={{ margin: '8px 12px', fontSize: 13, color: 'var(--fg-muted)' }}>
            2 incidents found in the fraud-engine service.
          </p>
        </ToolOutput>
      </Tool>
      <Tool name="get_service_health" ns="forge.infra" state="input-available" ms={undefined}>
        <ToolInput params={{ service: 'fraud-engine', region: 'sa-east-1' }} paramsHint="2 args" />
      </Tool>
    </div>
  ),
};
