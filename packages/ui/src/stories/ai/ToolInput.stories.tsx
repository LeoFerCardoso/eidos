import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToolInput } from '@eidos/ui';

const SAMPLE_PARAMS = {
  service: 'fraud-engine',
  since: '2026-05-28T00:00:00Z',
  limit: 50,
  filters: { risk_level: 'high', status: 'open' },
};

const meta = {
  title: 'AI/ToolInput',
  component: ToolInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The input section of a tool-call block. Renders the JSON args as a syntax-highlighted ' +
          'code block when settled, or a shimmer skeleton while params are still streaming. ' +
          'Pair with ToolOutput inside a Tool wrapper.',
      },
    },
  },
  args: {
    params: SAMPLE_PARAMS,
    streaming: false,
    paramsHint: '4 args',
  },
  argTypes: {
    streaming: { control: 'boolean' },
    paramsHint: { control: 'text' },
  },
} satisfies Meta<typeof ToolInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Settled input — JSON is visible and syntax-highlighted. */
export const Default: Story = {};

/** Streaming — skeleton shimmer while args are still arriving from the model. */
export const Streaming: Story = {
  args: { streaming: true, paramsHint: 'streaming…' },
};

/** Minimal — single-arg params, no hint. */
export const Minimal: Story = {
  args: {
    params: { user_id: 'usr_4f9a2c' },
    paramsHint: undefined,
  },
};
