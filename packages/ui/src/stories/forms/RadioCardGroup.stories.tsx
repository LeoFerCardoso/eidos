import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { RadioCardGroup } from '@forge/ui';

// ── Shared option sets ─────────────────────────────────────────────────────────

const ROLLOUT_OPTIONS = [
  {
    value: 'canary',
    title: 'Canary 10 %',
    description: 'Route a small traffic slice first, then ramp gradually.',
  },
  {
    value: 'blue-green',
    title: 'Blue / green',
    description: 'Stand up a parallel fleet and cut over on health check pass.',
  },
  {
    value: 'rolling',
    title: 'Rolling update',
    description: 'Replace pods one by one — zero downtime, lower resource cost.',
  },
];

const INCIDENT_ROUTING = [
  {
    value: 'auto',
    title: 'Auto-assign',
    description: 'Route to the on-call engineer using the active schedule.',
  },
  {
    value: 'team',
    title: 'Escalate to team',
    description: 'Notify the full team channel; anyone can claim the incident.',
  },
  {
    value: 'manual',
    title: 'Manual',
    description: 'Assign explicitly — no automatic paging.',
    disabled: true,
  },
];

const COMPUTE_TIER = [
  { value: 'edge', title: 'Edge', description: 'Sub-ms cold start, ~200 regions.' },
  { value: 'serverless', title: 'Serverless', description: 'Pay-per-invocation, up to 5 min.' },
  { value: 'dedicated', title: 'Dedicated', description: 'Reserved instance, predictable latency.' },
];

// ── Meta ───────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Forms/RadioCardGroup',
  component: RadioCardGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A group of selection cards backed by native radio inputs — exactly one card ' +
          'is selected at a time. Arrow keys move between cards (single tab stop); ' +
          'the selected card receives the ember-soft tint and an ember border. ' +
          'Use when the choice set is small (2–5 options) and each option benefits from ' +
          'a title + description for scannability.',
      },
    },
  },
  args: {
    options: ROLLOUT_OPTIONS,
    defaultValue: 'canary',
    ariaLabel: 'Rollout strategy',
    orientation: 'vertical',
    cardOrientation: 'horizontal',
    disabled: false,
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    cardOrientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    disabled: { control: 'boolean' },
    value: { control: false },
    defaultValue: { control: false },
    onValueChange: { action: 'valueChanged' },
    options: { control: false },
  },
} satisfies Meta<typeof RadioCardGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Default ────────────────────────────────────────────────────────────────────

/**
 * Uncontrolled — `defaultValue="canary"` pre-selects that card. Click any card
 * to move the selection; the group owns its state internally.
 */
export const Default: Story = {};

// ── Variants ──────────────────────────────────────────────────────────────────

/**
 * Layout variants side by side:
 * - **Vertical group, horizontal cards** (default) — best for 2–4 options with
 *   short descriptions.
 * - **Horizontal group, horizontal cards** — cards flow in a row; good for 2–3
 *   short-label options in a wizard step.
 * - **Horizontal group, vertical cards** — control on top, content below; use for
 *   icon-first picker layouts.
 */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <section>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--fg-faint)',
            marginBottom: 12,
          }}
        >
          Vertical group · horizontal cards (default)
        </div>
        <RadioCardGroup
          options={ROLLOUT_OPTIONS}
          defaultValue="canary"
          ariaLabel="Rollout strategy"
          orientation="vertical"
          cardOrientation="horizontal"
        />
      </section>

      <section>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--fg-faint)',
            marginBottom: 12,
          }}
        >
          Horizontal group · horizontal cards
        </div>
        <RadioCardGroup
          options={COMPUTE_TIER}
          defaultValue="serverless"
          ariaLabel="Compute tier"
          orientation="horizontal"
          cardOrientation="horizontal"
        />
      </section>

      <section>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--fg-faint)',
            marginBottom: 12,
          }}
        >
          Horizontal group · vertical cards
        </div>
        <RadioCardGroup
          options={COMPUTE_TIER}
          defaultValue="edge"
          ariaLabel="Compute tier"
          orientation="horizontal"
          cardOrientation="vertical"
        />
      </section>
    </div>
  ),
};

// ── States ────────────────────────────────────────────────────────────────────

/**
 * All interactive states in one view: normal, with a disabled individual option,
 * and the entire group disabled.
 */
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <section>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--fg-faint)',
            marginBottom: 12,
          }}
        >
          Normal — one disabled option
        </div>
        <RadioCardGroup
          options={INCIDENT_ROUTING}
          defaultValue="auto"
          ariaLabel="Incident routing"
          orientation="vertical"
          cardOrientation="horizontal"
        />
      </section>

      <section>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--fg-faint)',
            marginBottom: 12,
          }}
        >
          Entire group disabled
        </div>
        <RadioCardGroup
          options={ROLLOUT_OPTIONS}
          defaultValue="blue-green"
          ariaLabel="Rollout strategy"
          orientation="vertical"
          cardOrientation="horizontal"
          disabled
        />
      </section>
    </div>
  ),
};

// ── Controlled ────────────────────────────────────────────────────────────────

/**
 * Controlled — external state drives the selection. The selected value is echoed
 * below the group using `var(--font-mono)` so it is easy to inspect in demos.
 */
export const Controlled: Story = {
  render: (args) => {
    function Demo() {
      const [v, setV] = React.useState('canary');
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 480 }}>
          <RadioCardGroup
            {...args}
            options={ROLLOUT_OPTIONS}
            value={v}
            onValueChange={setV}
            ariaLabel="Rollout strategy"
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--fg-muted)',
            }}
          >
            selected: <span style={{ color: 'var(--accent)' }}>{v}</span>
          </span>
        </div>
      );
    }
    return <Demo />;
  },
};

// ── RTL ───────────────────────────────────────────────────────────────────────

/**
 * RTL — `dir="rtl"` mirrors card layout and radio control position. The group
 * layout CSS uses logical properties throughout.
 */
export const RTL: Story = {
  render: () => (
    <div dir="rtl" style={{ maxWidth: 440 }}>
      <RadioCardGroup
        options={[
          {
            value: 'canary',
            title: 'كناري 10٪',
            description: 'توجيه جزء صغير من الحركة أولاً، ثم الرفع التدريجي.',
          },
          {
            value: 'blue-green',
            title: 'أزرق / أخضر',
            description: 'إطلاق أسطول موازٍ والتحويل الكامل بعد اجتياز الفحص.',
          },
          {
            value: 'rolling',
            title: 'تحديث متدرج',
            description: 'استبدال الحاويات واحدة تلو الأخرى — دون توقف.',
          },
        ]}
        defaultValue="canary"
        ariaLabel="استراتيجية النشر"
        orientation="vertical"
        cardOrientation="horizontal"
      />
    </div>
  ),
};
