import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { DatePicker } from '@eidos/ui';

const meta = {
  title: 'Forms/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A trigger button paired with a Calendar popover. Clicking the trigger opens a month-grid calendar; selecting a day closes the popover and fires `onValueChange`. ' +
          'Uses `position:fixed` to escape `overflow:hidden` ancestors. ' +
          'For the native `<input type="date">` wrapper use **Forms/DateInput** instead.',
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    locale: { control: 'text' },
    weekStartsOn: { control: 'select', options: [0, 1] },
    value: { control: false },
    onValueChange: { action: 'valueChanged' },
    format: { control: false },
  },
  args: {
    label: 'Target date',
    placeholder: 'Pick a date',
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Uncontrolled — click the trigger to open the calendar grid.
 * Selecting a day closes the panel and echoes the formatted date in the trigger.
 */
export const Default: Story = {};

/** Pre-filled value — the calendar opens on the selected month. */
export const WithValue: Story = {
  render: (args) => {
    const [date, setDate] = React.useState<Date>(new Date(2026, 5, 15)); // 15 Jun 2026
    return (
      <DatePicker
        {...args}
        value={date}
        onValueChange={setDate}
        label="Delivery date"
      />
    );
  },
};

/** Min / max bounds — cells outside the range are disabled. */
export const Bounded: Story = {
  render: (args) => {
    const [date, setDate] = React.useState<Date | undefined>(undefined);
    const today = new Date();
    const next30 = new Date(today);
    next30.setDate(today.getDate() + 30);
    return (
      <DatePicker
        {...args}
        value={date}
        onValueChange={setDate}
        min={today}
        max={next30}
        label="Departure date"
        placeholder="Must be within 30 days"
      />
    );
  },
};

/** Size variants — sm (28 px), md (36 px), lg (44 px). */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
      <DatePicker {...args} size="sm" placeholder="Small" label="Small" />
      <DatePicker {...args} size="md" placeholder="Medium" label="Medium" />
      <DatePicker {...args} size="lg" placeholder="Large" label="Large" />
    </div>
  ),
};

/** Invalid state — trigger border + ring switch to --danger. */
export const Invalid: Story = {
  args: { invalid: true, placeholder: 'Required' },
};

/** Disabled — trigger is locked and cannot be opened. */
export const Disabled: Story = {
  args: { disabled: true, placeholder: 'Not available' },
};

/** RTL layout — trigger and calendar grid both mirror. */
export const RTL: Story = {
  render: (args) => {
    const [date, setDate] = React.useState<Date | undefined>(undefined);
    return (
      <div dir="rtl">
        <DatePicker
          {...args}
          value={date}
          onValueChange={setDate}
          locale="ar-EG"
          placeholder="اختر التاريخ"
          label="تاريخ الاستحقاق"
        />
      </div>
    );
  },
};

/** In context — embedded inside an .in-field shell with helper text. */
export const InContext: Story = {
  render: (args) => {
    const [date, setDate] = React.useState<Date | undefined>(undefined);
    return (
      <div style={{ maxWidth: 320 }}>
        <DatePicker
          {...args}
          value={date}
          onValueChange={setDate}
          label="Departure date"
          placeholder="Select date"
        />
        <span
          style={{
            display: 'block',
            marginTop: 6,
            fontSize: 'var(--text-sm)',
            color: 'var(--fg-muted)',
          }}
        >
          No flights available before today.
        </span>
      </div>
    );
  },
};
