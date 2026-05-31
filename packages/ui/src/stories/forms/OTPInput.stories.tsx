import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { OTPInput } from '@eidos/ui';

const meta = {
  title: 'Forms/OTPInput',
  component: OTPInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A row of single-character cells for one-time codes. Auto-advances on input, retreats on Backspace, supports arrow-key navigation, and spreads a pasted code across cells. Cells request the `one-time-code` autofill hint.' } },
  },
  args: { length: 6, groupEvery: 0, size: 'md' },
  argTypes: {
    length: { control: { type: 'number', min: 4, max: 8 } },
    groupEvery: { control: { type: 'number', min: 0, max: 4 } },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof OTPInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Six cells, no grouping — driven by the toolbar args. */
export const Default: Story = {};

/** Grouped 3 + 3 with a separator — SMS confirmation, easiest to read aloud. */
export const Grouped: Story = { args: { length: 6, groupEvery: 3 } };

/** Small (32px cells) — compact dialogs and sidesheets. */
export const Small: Story = { args: { length: 6, groupEvery: 3, size: 'sm' } };

/** Large (52px cells) — primary auth surfaces. */
export const Large: Story = { args: { length: 6, groupEvery: 3, size: 'lg' } };

/** Invalid (wrong code) — danger ring on every cell. */
export const Invalid: Story = { args: { defaultValue: '1234', invalid: true } };

/** Disabled — readonly and greyed out. */
export const Disabled: Story = { args: { defaultValue: '482915', disabled: true } };

/** Controlled — reports progress and flags a mismatch once all cells are filled. */
export const Controlled: Story = {
  render: () => {
    function Demo() {
      const [code, setCode] = React.useState('');
      const done = code.length === 6;
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <OTPInput length={6} value={code} onValueChange={setCode} invalid={done && code !== '123456'} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>
            {done ? (code === '123456' ? '✓ verified' : '✗ incorrect') : `${code.length}/6`}
          </span>
        </div>
      );
    }
    return <Demo />;
  },
};

/**
 * In context — a verify flow that auto-submits on `onComplete`, shows a verifying
 * state, and surfaces a specific error message instead of a silent reset.
 * Demo: `654321` succeeds, anything else fails.
 */
export const InContext: Story = {
  render: () => {
    function VerifyFlow() {
      const [status, setStatus] = React.useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
      const onComplete = (value: string) => {
        setStatus('verifying');
        setTimeout(() => setStatus(value === '654321' ? 'success' : 'error'), 1000);
      };
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            maxWidth: 360,
            padding: 24,
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--bg-elevated)',
          }}
        >
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Enter verification code</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>
              We sent a 6-digit code to your phone.
            </div>
          </div>
          <OTPInput layout={[3, 3]} invalid={status === 'error'} onComplete={onComplete} ariaLabel="Verification code" />
          <div style={{ minHeight: 18, fontSize: 'var(--text-sm)' }} aria-live="polite">
            {status === 'idle' && <span style={{ color: 'var(--fg-muted)' }}>Type 654321 to simulate success.</span>}
            {status === 'verifying' && <span style={{ color: 'var(--fg-muted)' }}>Verifying…</span>}
            {status === 'success' && <span style={{ color: 'var(--success)' }}>Verified</span>}
            {status === 'error' && <span style={{ color: 'var(--danger)' }}>Code expired or invalid. Request a new one.</span>}
          </div>
        </div>
      );
    }
    return <VerifyFlow />;
  },
};
