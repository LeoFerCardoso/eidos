import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup } from '@eidos/ui';

const ROLLOUT = [
  { label: 'All at once', value: 'all' },
  { label: 'Canary 10%', value: 'canary' },
  { label: 'Blue / green', value: 'blue' },
];

const meta = {
  title: 'Forms/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A mutually-exclusive choice from a known set. Native radios bound to one name — keyboard arrow navigation and form submission work natively. Always a group; a lone radio is an anti-pattern.' } },
  },
  args: { options: ROLLOUT, defaultValue: 'canary', ariaLabel: 'Rollout strategy' },
  argTypes: {
    inline: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** With per-option descriptions (stacked layout). */
export const WithDescriptions: Story = {
  args: {
    defaultValue: 'canary',
    options: [
      { label: 'All at once', value: 'all', description: 'Fastest, highest blast radius.' },
      { label: 'Canary 10%', value: 'canary', description: 'Route a slice of traffic first, then ramp.' },
      { label: 'Blue / green', value: 'blue', description: 'Stand up a parallel fleet and cut over.' },
    ],
  },
};

/** Inline (row) layout. */
export const Inline: Story = { args: { inline: true } };

/** A disabled option among enabled ones. */
export const WithDisabledOption: Story = {
  args: {
    defaultValue: 'all',
    options: [
      { label: 'All at once', value: 'all' },
      { label: 'Canary 10%', value: 'canary' },
      { label: 'Blue / green (needs 2× capacity)', value: 'blue', disabled: true },
    ],
  },
};

/** Controlled — shows the live selection. */
export const Controlled: Story = {
  render: () => {
    function Demo() {
      const [v, setV] = React.useState('canary');
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <RadioGroup options={ROLLOUT} value={v} onChange={setV} ariaLabel="Rollout strategy" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)' }}>selected: {v}</span>
        </div>
      );
    }
    return <Demo />;
  },
};
