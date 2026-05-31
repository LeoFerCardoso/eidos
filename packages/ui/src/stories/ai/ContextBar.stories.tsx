import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ContextBar, PromptInput } from '@eidos/ui';

// ── ContextBar ────────────────────────────────────────────────────────────────
// @deprecated preset — forwards all props to <Context variant="bar" />.
// Preserved for back-compat; prefer <Context variant="bar"> in new code.

const meta = {
  title: 'AI/ContextBar',
  component: ContextBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '**Deprecated wrapper** — `ContextBar` renders a linear progress bar showing ' +
          'how much of the model context window has been consumed. It forwards all props ' +
          'to `<Context variant="bar" />` and is kept for backward-compat. ' +
          'Use it to surface token usage in PromptInput footers or status rows where a ' +
          'horizontal bar fits better than the radial gauge. ' +
          'Tone shifts automatically: ok → mid at `thresholdMid` (default 60%), ' +
          'mid → warn at `thresholdWarn` (default 85%).',
      },
    },
  },
  args: {
    used: 32000,
    total: 128000,
  },
  argTypes: {
    used: { control: 'number' },
    total: { control: 'number' },
    files: { control: 'number' },
    thresholdMid: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    thresholdWarn: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
  },
} satisfies Meta<typeof ContextBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default bar — eidos-sonnet-4-6 session, 32k of 128k tokens consumed (ok tone). */
export const Default: Story = {};

/** With attached files — token count plus a file badge in the label row. */
export const WithFiles: Story = {
  name: 'With files',
  args: { used: 48000, total: 128000, files: 4 },
};

/** All three tones side by side — ok / mid / warn — at representative fill levels. */
export const Tones: Story = {
  name: 'Tones (ok / mid / warn)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 440 }}>
      {(
        [
          { label: 'ok',   used: 32000,  total: 128000 },
          { label: 'mid',  used: 82000,  total: 128000 },
          { label: 'warn', used: 114000, total: 128000 },
        ] as const
      ).map(({ label, used, total }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--fg-faint)',
              width: 36,
              flexShrink: 0,
            }}
          >
            {label}
          </span>
          <ContextBar used={used} total={total} />
        </div>
      ))}
    </div>
  ),
};

/** Embedded in PromptInput — the primary usage site for ContextBar. */
export const InPromptInput: Story = {
  name: 'In PromptInput footer',
  render: () => (
    <div style={{ maxWidth: 640 }}>
      <PromptInput
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        modelValue="eidos-sonnet-4-6"
        onModelChange={() => {}}
        contextSlot={<ContextBar used={82000} total={200000} files={3} />}
        placeholder="Describe the incident or paste a log trace…"
      />
    </div>
  ),
};

/** Near-full — 118k of 128k tokens consumed; warn tone triggers at 85%. */
export const NearFull: Story = {
  name: 'Near full (92%)',
  args: { used: 118000, total: 128000 },
};

/** Custom thresholds — useful when a model has a smaller effective window (e.g. 32k). */
export const CustomThresholds: Story = {
  name: 'Custom thresholds (32k window)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 440 }}>
      {(
        [
          { label: 'ok',   used: 12000 },
          { label: 'mid',  used: 22000 },
          { label: 'warn', used: 30000 },
        ] as const
      ).map(({ label, used }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--fg-faint)',
              width: 36,
              flexShrink: 0,
            }}
          >
            {label}
          </span>
          <ContextBar
            used={used}
            total={32000}
            thresholdMid={0.5}
            thresholdWarn={0.8}
          />
        </div>
      ))}
    </div>
  ),
};
