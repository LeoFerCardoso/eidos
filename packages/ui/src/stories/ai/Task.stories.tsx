import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Task } from '@eidos/ui';

const SUB_ITEMS = [
  { title: 'Fetch p95 latency', status: 'done' },
  { title: 'Check error rate', status: 'done' },
  { title: 'Query SLO breach log', status: 'active' },
];

const meta = {
  title: 'AI/Task',
  component: Task,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A single unit of agent work with a status mark and optional sub-steps. ' +
          'Compose several Tasks for a live to-do feed that updates as the agent progresses.',
      },
    },
  },
  args: {
    title: 'Evaluate blast radius of INC-9812',
    status: 'active',
    detail: 'Ring 0 → 2',
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['pending', 'active', 'done', 'error'],
    },
    title: { control: 'text' },
    detail: { control: 'text' },
  },
} satisfies Meta<typeof Task>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Active task — currently being worked on. */
export const Default: Story = {};

/** Pending — not yet started. */
export const Pending: Story = {
  args: { title: 'Query incident log', status: 'pending', detail: undefined },
};

/** Done — completed successfully. */
export const Done: Story = {
  args: { title: 'Fetched service health for fraud-engine', status: 'done', detail: '142 ms' },
};

/** Error — task failed. */
export const Error: Story = {
  args: { title: 'Look up user account usr_4f9a2c', status: 'error', detail: '404' },
};

/** With sub-tasks — a hierarchical breakdown of one larger goal. */
export const WithSubTasks: Story = {
  args: {
    title: 'Evaluate service health',
    status: 'active',
    detail: undefined,
    items: SUB_ITEMS,
  },
};

/** A realistic live feed of tasks in various states. */
export const InContext: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 480 }}>
      <Task title="Fetch service health for fraud-engine" status="done" detail="312 ms" />
      <Task title="Query incident log (last 24 h)" status="done" detail="2 incidents" />
      <Task
        title="Evaluate blast radius of INC-9812"
        status="active"
        detail="Ring 0 → 2"
        items={SUB_ITEMS}
      />
      <Task title="Check if incident affects usr_4f9a2c" status="pending" />
      <Task title="Produce final recommendation" status="pending" />
    </div>
  ),
};
