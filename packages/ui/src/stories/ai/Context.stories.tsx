import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Context, ContextGauge, ContextBar, PromptInput } from '@eidos/ui';

// ── Context ───────────────────────────────────────────────────────────────────
// Unified context-window usage indicator with two visual forms:
//   variant="gauge"   (default) — radial SVG ring + token counts
//   variant="bar"               — linear progress bar + token counts
//   variant="compact"           — radial ring + percent only (tight rows)
//
// ContextGauge / ContextBar are @deprecated wrappers kept for back-compat.

const meta = {
  title: 'AI/Context',
  component: Context,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Context-window usage indicator with two visual forms: ' +
          '`variant="gauge"` (default) renders a radial SVG ring + token counts; ' +
          '`variant="bar"` renders a linear progress bar; ' +
          '`variant="compact"` renders the radial + percent only for tight rows. ' +
          'Tone shifts at configurable mid and warn thresholds. ' +
          '`ContextGauge` and `ContextBar` are `@deprecated` wrappers for backward-compat.',
      },
    },
  },
  args: {
    used: 24000,
    total: 128000,
    variant: 'gauge',
    size: 18,
    label: true,
    thresholdMid: 0.6,
    thresholdWarn: 0.85,
  },
  argTypes: {
    used: { control: 'number' },
    total: { control: 'number' },
    variant: { control: 'inline-radio', options: ['gauge', 'bar', 'compact'] },
    size: { control: 'number', if: { arg: 'variant', neq: 'bar' } },
    label: { control: 'boolean', if: { arg: 'variant', eq: 'gauge' } },
    files: { control: 'number' },
    thresholdMid: { control: 'number' },
    thresholdWarn: { control: 'number' },
  },
} satisfies Meta<typeof Context>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default gauge — normal usage (ok tone). */
export const Default: Story = {};

/** All variants side by side — gauge, bar, compact. */
export const AllVariants: Story = {
  name: 'All variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 400 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', width: 80 }}>gauge</span>
        <Context used={24000} total={128000} variant="gauge" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', width: 80 }}>bar</span>
        <Context used={24000} total={128000} variant="bar" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', width: 80 }}>compact</span>
        <Context used={24000} total={128000} variant="compact" />
      </div>
    </div>
  ),
};

/** All three tones — ok / mid / warn — for each variant. */
export const AllTones: Story = {
  name: 'All tones (ok / mid / warn)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {(['gauge', 'bar', 'compact'] as const).map(v => (
        <div key={v}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-faint)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{v}</div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            <Context used={20000}  total={128000} variant={v} />
            <Context used={80000}  total={128000} variant={v} />
            <Context used={112000} total={128000} variant={v} />
          </div>
        </div>
      ))}
    </div>
  ),
};

/** Gauge — mid zone (approaching 60%). */
export const GaugeMid: Story = {
  name: 'Gauge — mid zone',
  args: { used: 80000, total: 128000, variant: 'gauge' },
};

/** Gauge — warning zone (above 85%). */
export const GaugeWarn: Story = {
  name: 'Gauge — warning zone',
  args: { used: 112000, total: 128000, variant: 'gauge' },
};

/** Gauge — large 32px radial for prominent placement. */
export const GaugeLarge: Story = {
  name: 'Gauge — large (32px)',
  args: { used: 60000, total: 128000, variant: 'gauge', size: 32 },
};

/** Gauge — with file count. */
export const GaugeWithFiles: Story = {
  name: 'Gauge — with files',
  args: { used: 24000, total: 128000, variant: 'gauge', files: 3 },
};

/** Bar — mid zone. */
export const BarMid: Story = {
  name: 'Bar — mid zone',
  args: { used: 80000, total: 128000, variant: 'bar' },
};

/** Bar — warning zone. */
export const BarWarn: Story = {
  name: 'Bar — warning zone',
  args: { used: 112000, total: 128000, variant: 'bar' },
};

/** Bar — with file count. */
export const BarWithFiles: Story = {
  name: 'Bar — with files',
  args: { used: 24000, total: 128000, variant: 'bar', files: 5 },
};

/** Compact — radial + percent only. */
export const Compact: Story = {
  name: 'Compact — percent only',
  args: { used: 60000, total: 128000, variant: 'compact' },
};

/** Near-full — 99% used. */
export const NearFull: Story = {
  name: 'Near full (99%)',
  args: { used: 127000, total: 128000, variant: 'gauge' },
};

/** Embedded in PromptInput — the canonical placement. */
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
        contextSlot={<Context used={142000} total={200000} files={3} variant="gauge" />}
        placeholder="Ask anything…"
      />
    </div>
  ),
};

/** Bar in PromptInput — horizontal variant for wide composer footers. */
export const BarInPromptInput: Story = {
  name: 'Bar in PromptInput footer',
  render: () => (
    <div style={{ maxWidth: 640 }}>
      <PromptInput
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        contextSlot={<Context used={80000} total={128000} variant="bar" />}
        placeholder="Ask anything…"
      />
    </div>
  ),
};

// ── Backward-compat aliases ───────────────────────────────────────────────────

/** ContextGauge — @deprecated wrapper. Renders identically to Context variant="gauge". */
export const ContextGaugeLegacy: Story = {
  name: 'ContextGauge (deprecated alias)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>
        ContextGauge (deprecated) — forwards to Context variant="gauge"
      </span>
      <ContextGauge used={24000} total={128000} />
    </div>
  ),
};

/** ContextBar — @deprecated wrapper. Renders identically to Context variant="bar". */
export const ContextBarLegacy: Story = {
  name: 'ContextBar (deprecated alias)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>
        ContextBar (deprecated) — forwards to Context variant="bar"
      </span>
      <ContextBar used={24000} total={128000} />
    </div>
  ),
};
