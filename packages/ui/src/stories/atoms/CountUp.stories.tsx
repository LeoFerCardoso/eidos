import type { Meta, StoryObj } from '@storybook/react-vite';
import { CountUp } from '@eidos/ui';

const meta = {
  title: 'Primitives/CountUp',
  component: CountUp,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'An animated counter that eases from `from` (default 0) to `to` when it scrolls into view. ' +
          'Uses an IntersectionObserver — the animation fires exactly once; reset by changing the React `key`. ' +
          'Under `prefers-reduced-motion` the duration collapses to 0 and the final value paints instantly. ' +
          '`Counter` is a `@deprecated` back-compat alias.',
      },
    },
  },
  args: {
    to: 4280,
    from: 0,
    suffix: '',
    prefix: '',
    dur: 1200,
    decimals: 0,
  },
  argTypes: {
    to: { control: 'number', description: 'Target numeric value to count up to.' },
    from: { control: 'number', description: 'Starting value (default 0). Useful for partial-progress reads.' },
    suffix: { control: 'text', description: 'Appended string after the number (e.g. "%", " ms").' },
    prefix: { control: 'text', description: 'Prepended string before the number (e.g. "$", "~").' },
    dur: { control: 'number', description: 'Animation duration in milliseconds (collapses to 0 under prefers-reduced-motion).' },
    decimals: { control: 'number', description: 'Number of decimal places to show.' },
  },
} satisfies Meta<typeof CountUp>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Plain integer counter — the most common use. */
export const Default: Story = {};

/** Percentage with a suffix — typical for coverage or success-rate cards. */
export const Percentage: Story = {
  args: { to: 92.4, suffix: '%', decimals: 1, dur: 900 },
};

/** Currency prefix — for revenue or cost tiles. */
export const Currency: Story = {
  args: { to: 1847320, prefix: 'R$ ', decimals: 0, dur: 1400 },
};

/** Latency in milliseconds. */
export const Latency: Story = {
  args: { to: 142, suffix: ' ms', decimals: 0, dur: 800 },
};

/** Non-zero start — animate from 50 to 80 (e.g. a progress read that resumes). */
export const FromNonZero: Story = {
  args: { from: 50, to: 80, suffix: '%', decimals: 0, dur: 900 },
};

/**
 * Formatting matrix — every knob the page documents (`from` · `prefix` ·
 * `suffix` · `decimals`) on one row: rate, multiplier, currency, percent,
 * and a partial-progress read.
 */
export const Formatting: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'baseline', fontSize: 22, color: 'var(--fg)' }}>
      <CountUp to={4214} suffix=" / mo" />
      <CountUp to={2.4} suffix="x" decimals={1} />
      <CountUp to={9999} prefix="$" />
      <CountUp to={98.6} suffix="%" decimals={1} />
      <CountUp from={50} to={80} suffix="%" />
    </div>
  ),
};

/**
 * Duration — the same target at three speeds. Default is 1200ms; slow the
 * ramp for a hero stat, speed it up for denser reads.
 */
export const Duration: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'baseline', fontSize: 22, color: 'var(--fg)' }}>
      <span>fast <CountUp to={1284} dur={600} /></span>
      <span>default <CountUp to={1284} dur={1200} /></span>
      <span>slow <CountUp to={1284} dur={2400} /></span>
    </div>
  ),
};

/**
 * Instant render — simulates prefers-reduced-motion by collapsing dur to 0.
 * In real usage this is automatic; here we force it for visual regression.
 */
export const ReducedMotion: Story = {
  args: { to: 4280, dur: 0 },
  parameters: {
    docs: {
      description: {
        story:
          'When `dur` is 0 (or prefers-reduced-motion is active) the final value paints immediately. ' +
          'Use this story to verify the layout is stable with no animation.',
      },
    },
  },
};

/** Four metric cards as they appear in a dashboard KPI row. */
export const InContext: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      {[
        { label: 'Total Deploys', to: 4280, suffix: '' },
        { label: 'Coverage',      to: 88.3, suffix: '%', decimals: 1 },
        { label: 'P95 Latency',   to: 142,  suffix: ' ms' },
        { label: 'SAST Issues',   to: 1,    suffix: '' },
      ].map(({ label, to, suffix = '', decimals = 0 }) => (
        <div
          key={label}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '16px 20px',
            minWidth: 140,
          }}
        >
          <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginBottom: 6 }}>{label}</div>
          <div style={{ fontSize: 24, fontWeight: 600 }}>
            <CountUp to={to} suffix={suffix} decimals={decimals} dur={900} />
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * RTL — the block aligns to the start edge, but the digits never mirror:
 * per the Unicode bidi algorithm a numeral run always renders left-to-right,
 * so `1284` reads `1284` in both directions. A trailing `suffix` stays
 * attached to the number; the count animation is not direction-aware.
 */
export const RTL: Story = {
  render: () => (
    <div dir="rtl" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      {[
        { label: 'عمليات النشر',   to: 1284, suffix: '',  decimals: 0 },
        { label: 'تغطية الاختبار', to: 94.7, suffix: '%', decimals: 1 },
        { label: 'وقت التشغيل',    to: 99.9, suffix: '%', decimals: 1 },
      ].map(({ label, to, suffix, decimals }) => (
        <div
          key={label}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '16px 20px',
            minWidth: 148,
            textAlign: 'start',
          }}
        >
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', marginBottom: 6 }}>
            {label}
          </div>
          <div style={{ fontSize: 26, fontWeight: 600, color: 'var(--fg)' }}>
            <CountUp to={to} suffix={suffix} decimals={decimals} dur={900} />
          </div>
        </div>
      ))}
    </div>
  ),
};
