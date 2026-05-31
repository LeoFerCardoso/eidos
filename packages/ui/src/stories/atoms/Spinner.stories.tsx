import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { Spinner } from '@eidos/ui';

const meta = {
  title: 'Primitives/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Single-purpose loading indicator. Three variants (ring, dots, bars), ' +
          'named sizes (sm/md/lg) or a raw pixel number, and color via currentColor. ' +
          'Announces with role="status" + a visually-hidden label. ' +
          'prefers-reduced-motion slows the animation to a calmer pace.',
      },
    },
  },
  args: {
    variant: 'ring',
    size: 'md',
    'aria-label': 'Loading',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['ring', 'dots', 'bars'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    color: { control: 'color' },
    'aria-label': { control: 'text' },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — ring, md, inherits color from parent. */
export const Default: Story = {};

/** Three visual variants side by side. */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
      {(['ring', 'dots', 'bars'] as const).map((variant) => (
        <span key={variant} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <Spinner variant={variant} size="md" />
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>{variant}</code>
        </span>
      ))}
    </div>
  ),
};

/** Named sizes (sm / md / lg) and a custom numeric size. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 28, alignItems: 'flex-end' }}>
      {([['sm', 12], ['md', 16], ['lg', 24], [40, 40]] as const).map(([label, s]) => (
        <span key={label} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <Spinner variant="ring" size={s as 'sm' | 'md' | 'lg' | number} />
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>
            {typeof label === 'number' ? `${label}px` : label}
          </code>
        </span>
      ))}
    </div>
  ),
};

/** Color is just currentColor — wrap in a colored span or pass the color prop. */
export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
      {[
        { name: 'ember',   v: 'var(--ember)' },
        { name: 'success', v: 'var(--success)' },
        { name: 'warning', v: 'var(--warning)' },
        { name: 'danger',  v: 'var(--danger)' },
        { name: 'ice',     v: 'var(--accent-2)' },
        { name: 'muted',   v: 'var(--fg-muted)' },
      ].map(({ name, v }) => (
        <span key={name} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <Spinner size="md" color={v} />
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>{name}</code>
        </span>
      ))}
    </div>
  ),
};

/** Dots variant — best for inline body text. */
export const Dots: Story = {
  args: { variant: 'dots', size: 'md' },
};

/** Bars variant — media / equalizer context. */
export const Bars: Story = {
  args: { variant: 'bars', size: 'md' },
};

/**
 * In context — inside a button. Click to see the loading transition.
 * The button is disabled while loading; focus is preserved.
 */
export const InContext: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [loading, setLoading] = React.useState(false);
    const trigger = () => {
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
    };
    return (
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          className="btn ember"
          disabled={loading}
          aria-busy={loading}
          onClick={trigger}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          {loading && <Spinner size={14} color="#08090A" aria-label="Deploying" />}
          {loading ? 'Deploying…' : 'Deploy'}
        </button>
        <button
          className="btn outline"
          disabled={loading}
          aria-busy={loading}
          onClick={trigger}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          {loading && <Spinner size={14} />}
          {loading ? 'Saving…' : 'Save draft'}
        </button>
        <span className="pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <Spinner size={10} variant="dots" />
          Syncing
        </span>
      </div>
    );
  },
};

/** RTL — spinners are visually symmetric; the layout around them mirrors. */
export const RTL: Story = {
  render: () => (
    <div dir="rtl" style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
      <button
        className="btn ember"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
      >
        <Spinner size={14} color="#08090A" />
        جاري النشر…
      </button>
      <span className="pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        <Spinner size={10} variant="dots" />
        قيد المزامنة
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--fg-muted)', fontSize: 'var(--text-base)' }}>
        <Spinner size={14} />
        تحميل البيانات…
      </span>
    </div>
  ),
};
