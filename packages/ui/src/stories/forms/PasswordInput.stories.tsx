import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PasswordInput, PasswordField, DEFAULT_PASSWORD_REQUIREMENTS } from '@eidos/ui';

const meta = {
  title: 'Forms/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A password field with a trailing show/hide toggle. ' +
          'Pass `showStrength` to add a segmented strength bar and a requirements checklist below the field. ' +
          'The strength score derives from how many `requirements` pass. ' +
          'The toggle uses `aria-pressed` and `aria-label`; the strength label uses `aria-live="polite"`.',
      },
    },
  },
  args: {
    label: 'Password',
    placeholder: '••••••••',
    help: 'Choose a strong password.',
  },
  argTypes: {
    label:        { control: 'text' },
    help:         { control: 'text' },
    error:        { control: 'text' },
    disabled:     { control: 'boolean' },
    showStrength: { control: 'boolean' },
    size:         { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default show/hide toggle. Uses local state so typing updates the field live. */
export const Default: Story = {
  render: (args) => {
    const [value, setValue] = React.useState('');
    return (
      <div style={{ maxWidth: 380 }}>
        <PasswordInput
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

/** With strength bar — score updates as you type. */
export const WithStrength: Story = {
  args: { showStrength: true, help: undefined },
};

/** Live requirements — type to see the checklist update in real time. */
export const WithRequirements: Story = {
  render: (args) => {
    const [value, setValue] = React.useState('');
    return (
      <div style={{ maxWidth: 380 }}>
        <PasswordInput
          {...args}
          label="New password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          showStrength
          requirements={DEFAULT_PASSWORD_REQUIREMENTS}
          help={undefined}
          placeholder="Choose a password"
        />
      </div>
    );
  },
};

/** Small, medium, and large sizes. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 380 }}>
      <PasswordInput label="Small"  size="sm" placeholder="••••••••" />
      <PasswordInput label="Medium" size="md" placeholder="••••••••" />
      <PasswordInput label="Large"  size="lg" placeholder="••••••••" />
    </div>
  ),
};

/** Invalid / error state. */
export const Invalid: Story = {
  args: { error: 'Password must be at least 8 characters.', value: 'abc', help: undefined },
};

/** Disabled — toggle is inert. */
export const Disabled: Story = {
  args: { disabled: true, value: 'my-secret', help: undefined },
};

/** RTL direction. */
export const RTL: Story = {
  render: () => (
    <div dir="rtl" style={{ maxWidth: 380 }}>
      <PasswordInput
        label="كلمة المرور"
        placeholder="••••••••"
        help="اختر كلمة مرور قوية."
        showStrength
        requirements={DEFAULT_PASSWORD_REQUIREMENTS}
      />
    </div>
  ),
};

/** PasswordField convenience composite (showStrength + defaults baked in). */
export const CompositePasswordField: Story = {
  render: () => {
    const [value, setValue] = React.useState('');
    return (
      <div style={{ maxWidth: 380 }}>
        <PasswordField
          label="Create password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Choose a password"
        />
      </div>
    );
  },
};
