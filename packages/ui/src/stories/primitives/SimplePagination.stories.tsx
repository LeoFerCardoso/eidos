import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SimplePagination } from '@forge/ui';

const meta = {
  title: 'Primitives/SimplePagination',
  component: SimplePagination,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A minimal two-button paginator — outlined Previous / Next buttons flanking a ' +
          '"Page X of Y" counter in mono. No page number buttons, no ellipsis. ' +
          'Ideal for long lists or detail views where only sequential navigation is needed.',
      },
    },
  },
  args: {
    total: 12,
    current: 1,
  },
  argTypes: {
    total: { control: 'number', description: 'Total number of pages.' },
    current: { control: 'number', description: 'Currently active page (1-based).' },
  },
} satisfies Meta<typeof SimplePagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — page 1 of 12, Previous disabled. */
export const Default: Story = {};

/** Middle page — both buttons enabled. */
export const MiddlePage: Story = {
  args: { total: 12, current: 6 },
};

/** Last page — Next disabled. */
export const LastPage: Story = {
  args: { total: 12, current: 12 },
};

/** Interactive — `current` is wired to `useState`. */
export const Interactive: Story = {
  render: (args) => {
    const [current, setCurrent] = React.useState(1);
    return (
      <SimplePagination
        total={args.total}
        current={current}
        onChange={setCurrent}
      />
    );
  },
};

/** Single page — both buttons disabled. */
export const SinglePage: Story = {
  args: { total: 1, current: 1 },
};
