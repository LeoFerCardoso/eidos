import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Skeleton } from '@forge/ui';

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Primitives/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'General-purpose loading placeholder. Three shape variants (line / box / circle), ' +
          'flexible sizing, and a multi-line mode for streaming-content placeholders. ' +
          'Skeletons are decorative (aria-hidden); add `label` for a screen-reader announcement. ' +
          'The shimmer sweep stops under `prefers-reduced-motion`.',
      },
    },
  },
  args: {
    variant: 'line',
    width: 220,
  },
  argTypes: {
    variant:  { control: 'inline-radio', options: ['line', 'box', 'circle'] },
    width:    { control: 'text' },
    height:   { control: 'text' },
    size:     { control: 'number' },
    lines:    { control: 'number' },
    radius:   { control: 'text' },
    label:    { control: 'text' },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Stories ───────────────────────────────────────────────────────────────────

/** Default — a single line shimmer at 220 px. */
export const Default: Story = {};

/** Three variants side by side: line, box, circle. */
export const Variants: Story = {
  name: 'Variants',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
      <div>
        <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', display: 'block', marginBottom: 8 }}>
          variant="line"
        </code>
        <Skeleton variant="line" width={280} />
      </div>
      <div>
        <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', display: 'block', marginBottom: 8 }}>
          variant="box" width={200} height={120}
        </code>
        <Skeleton variant="box" width={200} height={120} />
      </div>
      <div>
        <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', display: 'block', marginBottom: 8 }}>
          variant="circle" size={40}
        </code>
        <Skeleton variant="circle" size={40} />
      </div>
    </div>
  ),
};

/** Multi-line mode — N stacked bars, last one shorter (covers AI streaming placeholder). */
export const Lines: Story = {
  name: 'Lines (multi-line)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 480 }}>
      {([2, 3, 5] as const).map((n) => (
        <div key={n}>
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', display: 'block', marginBottom: 8 }}>
            lines={n}
          </code>
          <Skeleton variant="line" lines={n} />
        </div>
      ))}
    </div>
  ),
};

/** Custom sizes — any width × height combination. */
export const Sizes: Story = {
  name: 'Sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
      <Skeleton variant="line" width="80%" height={24} />
      <Skeleton variant="line" width={140} />
      <Skeleton variant="box" width={64} height={64} />
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {[20, 32, 48, 64].map((s) => (
          <Skeleton key={s} variant="circle" size={s} />
        ))}
      </div>
    </div>
  ),
};

/** In context — a card + profile placeholder showing the skeleton matching the eventual layout. */
export const InContext: Story = {
  name: 'In context — card placeholder',
  render: () => {
    const [loaded, setLoaded] = React.useState(false);
    const reload = () => {
      setLoaded(false);
      setTimeout(() => setLoaded(true), 1800);
    };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
        <button
          className="btn sm"
          onClick={reload}
          style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          ↺ Reload
        </button>
        <div
          className="surface"
          style={{ padding: 16, borderRadius: 10, border: '1px solid var(--border)' }}
          aria-live="polite"
          aria-busy={!loaded}
        >
          {loaded ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="avatar md ember">LF</span>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--fg)', fontSize: 'var(--text-base)' }}>Layla Faraj</div>
                  <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-sm)' }}>Lead designer · Forge core</div>
                </div>
              </div>
              <p style={{ margin: 0, color: 'var(--fg-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                Owns the token layer and the chart primitives. Last pushed 2 h ago.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Skeleton variant="circle" size={40} label="Loading profile" />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <Skeleton variant="line" width={140} />
                  <Skeleton variant="line" width={200} />
                </div>
              </div>
              <Skeleton variant="line" lines={3} />
            </div>
          )}
        </div>
      </div>
    );
  },
};

/** RTL — flex direction and logical gap handle mirroring; shimmer gradient is direction-neutral. */
export const RTL: Story = {
  name: 'RTL',
  render: () => (
    <div dir="rtl" style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 420 }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Skeleton variant="circle" size={36} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Skeleton variant="line" width={140} />
            <Skeleton variant="line" width={220} />
          </div>
          <Skeleton variant="line" width={56} height={20} />
        </div>
      ))}
    </div>
  ),
};

/** Reduced motion — shimmer stops; placeholder rests as a flat tinted block.
 *  Storybook wraps the story in a `prefers-reduced-motion: reduce` media query
 *  when the "Reduced motion" addon is enabled. */
export const ReducedMotion: Story = {
  name: 'Reduced motion',
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}
    >
      <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>
        @media (prefers-reduced-motion: reduce) → animation: none
      </code>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Skeleton variant="circle" size={40} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Skeleton variant="line" width={180} />
          <Skeleton variant="line" width={120} />
        </div>
      </div>
      <Skeleton variant="line" lines={3} />
      <Skeleton variant="box" width="100%" height={80} />
    </div>
  ),
  parameters: {
    chromatic: { prefersReducedMotion: 'reduce' },
  },
};
