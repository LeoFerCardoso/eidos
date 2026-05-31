import type { Meta, StoryObj } from '@storybook/react-vite';
import { NativeSelect } from '@eidos/ui';

const TIERS = [
  { label: 'T1 — Critical', value: 't1' },
  { label: 'T2 — Important', value: 't2' },
  { label: 'T3 — Standard', value: 't3' },
];

const meta = {
  title: 'Forms/NativeSelect',
  component: NativeSelect,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A native `<select>` in the Eidos field shell. Zero JS — keyboard support, ' +
          'form submission, and screen-reader semantics come from the browser. ' +
          'Use when the list is short (≤ 7 items), plain text, and system look-and-feel ' +
          'is acceptable. For icons, descriptions, or groups, use the custom `Select`.',
      },
    },
  },
  args: { label: 'Service tier', options: TIERS, placeholder: 'Choose a tier…', help: 'Drives SLOs and on-call policy.' },
  argTypes: { label: { control: 'text' }, help: { control: 'text' }, error: { control: 'text' }, disabled: { control: 'boolean' } },
} satisfies Meta<typeof NativeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — browser native picker, zero JS. */
export const Default: Story = {};

/** Pre-selected value. */
export const Selected: Story = {
  args: { defaultValue: 't1', placeholder: undefined },
};

/** Error state. */
export const Invalid: Story = {
  args: { error: 'Pick a tier to continue.', help: undefined },
};

/** Disabled. */
export const Disabled: Story = {
  args: { defaultValue: 't2', placeholder: undefined, disabled: true, help: undefined },
};
