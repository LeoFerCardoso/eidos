import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ContextGauge, PromptInput } from '@eidos/ui';

// ── ContextGauge ──────────────────────────────────────────────────────────────
// @deprecated backward-compat export. Prefer <Context variant="gauge"> for new code.
// ContextGauge forwards all props to <Context> and supports the same tonal states
// (ok / mid / warn) triggered at configurable thresholds.

const meta = {
  title: 'AI/ContextGauge',
  component: ContextGauge,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '`ContextGauge` is a radial SVG ring that shows how much of a model\'s context ' +
          'window is consumed. It accepts `used` (tokens used) and `total` (window size) and ' +
          'shifts tone from **ok → mid → warn** at configurable thresholds. Use `compact` to ' +
          'show only the ring + percent in tight rows (e.g. the PromptInput footer). ' +
          '**Deprecated:** prefer `<Context variant="gauge" />` in new code — this wrapper ' +
          'forwards all props unchanged.',
      },
    },
  },
  args: {
    used: 28500,
    total: 128000,
    size: 18,
    label: true,
    compact: false,
    thresholdMid: 0.6,
    thresholdWarn: 0.85,
  },
  argTypes: {
    used: { control: 'number' },
    total: { control: 'number' },
    size: { control: 'number' },
    label: { control: 'boolean' },
    compact: { control: 'boolean' },
    files: { control: 'number' },
    thresholdMid: { control: 'number' },
    thresholdWarn: { control: 'number' },
  },
} satisfies Meta<typeof ContextGauge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — low usage (ok tone), radial ring + token counts. */
export const Default: Story = {};

/** All tonal states and both display modes side by side. */
export const Variants: Story = {
  name: 'Variants — tones × modes',
  render: () => {
    const rows: { label: string; used: number; total: number }[] = [
      { label: 'ok    (22%)',  used: 28500,  total: 128000 },
      { label: 'mid   (66%)',  used: 84480,  total: 128000 },
      { label: 'warn  (91%)',  used: 116480, total: 128000 },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 560 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '96px 1fr 1fr',
            gap: '8px 24px',
            alignItems: 'center',
          }}
        >
          {/* Header row */}
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--fg-faint)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            tone
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--fg-faint)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            gauge (label)
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--fg-faint)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            compact
          </span>

          {/* Data rows */}
          {rows.map(({ label, used, total }) => (
            <React.Fragment key={label}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--fg-muted)',
                }}
              >
                {label}
              </span>
              <ContextGauge used={used} total={total} size={18} label />
              <ContextGauge used={used} total={total} size={18} compact />
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  },
};

/** With file count — shows the "· N files" annotation beside token numbers. */
export const WithFiles: Story = {
  name: 'With file count',
  args: { used: 54000, total: 128000, files: 4 },
};

/** Large radial (32px) — for prominent placements like session headers. */
export const Large: Story = {
  name: 'Large (32px)',
  args: { used: 54000, total: 128000, size: 32 },
};

/** Warning zone — approaching context limit triggers the warn tone. */
export const WarnZone: Story = {
  name: 'Warning zone (91%)',
  args: { used: 116480, total: 128000 },
};

/** Near-full — 99% consumed, context limit imminent. */
export const NearFull: Story = {
  name: 'Near full (99%)',
  args: { used: 127000, total: 128000 },
};

/** Embedded in PromptInput — the canonical placement in the composer footer. */
export const InPromptInput: Story = {
  name: 'In PromptInput footer',
  render: () => (
    <div style={{ maxWidth: 640 }}>
      <PromptInput
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        modelValue="forge-sonnet-4-6"
        onModelChange={() => {}}
        contextSlot={<ContextGauge used={54000} total={128000} files={2} />}
        placeholder="Ask about the fraud-engine incident…"
      />
    </div>
  ),
};

/** All three tones at custom thresholds — mid at 50%, warn at 75%. */
export const CustomThresholds: Story = {
  name: 'Custom thresholds (mid 50%, warn 75%)',
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
      <ContextGauge used={38400}  total={128000} thresholdMid={0.5} thresholdWarn={0.75} />
      <ContextGauge used={76800}  total={128000} thresholdMid={0.5} thresholdWarn={0.75} />
      <ContextGauge used={102400} total={128000} thresholdMid={0.5} thresholdWarn={0.75} />
    </div>
  ),
};
