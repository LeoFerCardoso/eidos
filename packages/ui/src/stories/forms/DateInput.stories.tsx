import type { Meta, StoryObj } from '@storybook/react-vite';
import { DateInput } from '@forge/ui';

/**
 * `DateInput` is the native `<input type="date">` wrapper in the Forge field
 * shell. It renders ONE calendar affordance — the native browser indicator is
 * hidden via `::-webkit-calendar-picker-indicator { opacity:0 }` and replaced
 * by a single themed DS icon in the leading `.in-addon`, solving the dark-mode
 * "double icon / low-contrast indicator" problem.
 *
 * Use `DateInput` when the OS date picker is acceptable (mobile-first forms,
 * zero JS). For a fully custom popover calendar use **Forms/DatePicker**.
 */
const meta = {
  title: 'Forms/DateInput',
  component: DateInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Styled native `<input type="date">` in the Forge field shell. One DS calendar icon replaces the browser\'s native dark indicator. ' +
          'For a custom popover calendar grid use **DatePicker** instead.',
      },
    },
  },
  args: { label: 'Target date', help: 'When this rollout should complete.' },
  argTypes: {
    label: { control: 'text' },
    help: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof DateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — single themed calendar icon, no browser double-icon. */
export const Default: Story = {};

/** Pre-filled value. */
export const WithValue: Story = { args: { defaultValue: '2026-06-01', help: undefined } };

/** Bounded with min/max. */
export const Bounded: Story = { args: { min: '2026-01-01', max: '2026-12-31', help: 'Must fall within 2026.' } };

/** Error state. */
export const Invalid: Story = { args: { defaultValue: '2025-12-31', error: 'Pick a date in the future.', help: undefined } };

/** Disabled. */
export const Disabled: Story = { args: { defaultValue: '2026-06-01', disabled: true, help: undefined } };
