import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { RadioCard } from '@forge/ui';

const meta = {
  title: 'Forms/RadioCard',
  component: RadioCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Single selection-card that wraps a native radio input — the entire card surface ' +
          'is the click target. Use inside a `RadioCardGroup` for a managed group (arrow-key ' +
          'navigation, single-tab-stop). Use standalone when you need fine-grained controlled ' +
          'state per card, e.g. a wizard step or a plan-picker with extra UI between cards. ' +
          'Selected state: ember-soft tint + ember border. Supports `horizontal` (default) and ' +
          '`vertical` card orientations.',
      },
    },
  },
  args: {
    value: 'canary',
    title: 'Canary deployment',
    description: 'Route 10 % of traffic to the new revision before full rollout.',
    orientation: 'horizontal',
    checked: false,
    disabled: false,
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onChange: { action: 'changed' },
  },
} satisfies Meta<typeof RadioCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Default ───────────────────────────────────────────────────────────────────

/** Unchecked — standard card surface, no accent treatment. */
export const Default: Story = {};

// ── Checked ───────────────────────────────────────────────────────────────────

/** Checked — ember-soft background tint + ember border; radio dot filled. */
export const Checked: Story = {
  args: { checked: true },
};

// ── Variants (state matrix) ───────────────────────────────────────────────────

/**
 * Side-by-side state matrix: unchecked, checked, and disabled. Each card is
 * independently controlled so the story is fully interactive — clicking an
 * unchecked or checked card fires `onChange`; the disabled card ignores input.
 */
export const States: Story = {
  render: () => {
    function Demo() {
      const [selected, setSelected] = React.useState<string | null>('blue-green');

      const options = [
        {
          value: 'all-at-once',
          title: 'All at once',
          description: 'Fastest deploy; highest blast radius.',
        },
        {
          value: 'blue-green',
          title: 'Blue / green',
          description: 'Stand up a parallel fleet and cut over.',
        },
        {
          value: 'rolling',
          title: 'Rolling update',
          description: 'Replace instances one by one with zero downtime.',
          disabled: true,
        },
      ];

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            maxWidth: 440,
          }}
        >
          {options.map((opt) => (
            <RadioCard
              key={opt.value}
              value={opt.value}
              title={opt.title}
              description={opt.description}
              checked={selected === opt.value}
              onChange={(v) => setSelected(v)}
              name="deploy-strategy-states"
              disabled={opt.disabled}
            />
          ))}
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--fg-muted)',
            }}
          >
            selected: {selected ?? '—'}
          </span>
        </div>
      );
    }
    return <Demo />;
  },
};

// ── Orientations ──────────────────────────────────────────────────────────────

/**
 * `orientation="vertical"` — the radio control sits above the title/description,
 * useful for option grids where each card is narrower and taller.
 */
export const Orientations: Story = {
  render: () => {
    function Demo() {
      const [selected, setSelected] = React.useState<string>('starter');

      const plans = [
        { value: 'starter', title: 'Starter', description: 'Up to 3 services' },
        { value: 'pro', title: 'Pro', description: 'Up to 20 services' },
        { value: 'enterprise', title: 'Enterprise', description: 'Unlimited' },
      ];

      return (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {plans.map((plan) => (
            <RadioCard
              key={plan.value}
              value={plan.value}
              title={plan.title}
              description={plan.description}
              orientation="vertical"
              checked={selected === plan.value}
              onChange={(v) => setSelected(v)}
              name="plan-picker"
            />
          ))}
        </div>
      );
    }
    return <Demo />;
  },
};

// ── Disabled ──────────────────────────────────────────────────────────────────

/** Disabled in both checked and unchecked states — pointer-events off, opacity reduced. */
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 440 }}>
      <RadioCard
        value="disabled-checked"
        title="Feature flags (unavailable)"
        description="Requires the Advanced add-on — contact sales."
        checked
        disabled
        name="disabled-demo"
      />
      <RadioCard
        value="disabled-unchecked"
        title="Snapshot rollback (unavailable)"
        description="Only available on Enterprise plans."
        checked={false}
        disabled
        name="disabled-demo"
      />
    </div>
  ),
};

// ── RTL ───────────────────────────────────────────────────────────────────────

/**
 * Right-to-left — the radio control, icon, and text all mirror correctly.
 * No code changes needed; CSS logical properties handle the flip automatically.
 */
export const RTL: Story = {
  render: () => {
    function Demo() {
      const [selected, setSelected] = React.useState<string>('canary-rtl');

      const options = [
        {
          value: 'canary-rtl',
          title: 'كناري 10٪',
          description: 'توجيه جزء صغير من الحركة أولاً، ثم التوسع التدريجي.',
        },
        {
          value: 'blue-green-rtl',
          title: 'أزرق / أخضر',
          description: 'إطلاق أسطول موازٍ والتحويل الفوري للحركة.',
        },
      ];

      return (
        <div dir="rtl" style={{ maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {options.map((opt) => (
            <RadioCard
              key={opt.value}
              value={opt.value}
              title={opt.title}
              description={opt.description}
              checked={selected === opt.value}
              onChange={(v) => setSelected(v)}
              name="deploy-rtl"
            />
          ))}
        </div>
      );
    }
    return <Demo />;
  },
};
