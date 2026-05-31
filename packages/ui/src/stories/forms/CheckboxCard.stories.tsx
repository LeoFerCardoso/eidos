import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckboxCard } from '@eidos/ui';

const meta = {
  title: 'Forms/CheckboxCard',
  component: CheckboxCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A clickable card that wraps a DS Checkbox. The entire card is the selection ' +
          'target — clicking anywhere toggles. Selected state: ember-soft tint + ember border. ' +
          'Supports horizontal (default) and vertical orientations.',
      },
    },
  },
  args: {
    title: 'Enable auto-deploy on merge',
    description: 'Automatically deploy when the PR is merged to main.',
    orientation: 'horizontal',
    disabled: false,
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof CheckboxCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Horizontal layout — control + content in a row (default). */
export const Horizontal: Story = {
  args: { defaultChecked: true },
};

/** Vertical layout — control on top, content below. */
export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    defaultChecked: true,
  },
};

/** Unchecked state — no tint, standard surface. */
export const Unchecked: Story = {
  args: { defaultChecked: false },
};

/** Disabled — pointer-events off, opacity reduced. */
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <CheckboxCard title="Disabled, checked" description="This option is unavailable." defaultChecked disabled />
      <CheckboxCard title="Disabled, unchecked" description="This option is also unavailable." disabled />
    </div>
  ),
};

/** Multi-select set — three CheckboxCards, independently toggleable. */
export const MultiSelect: Story = {
  render: () => {
    function Demo() {
      const options = [
        { value: 'canary', title: 'Canary deploys', description: 'Route a small traffic slice first, then ramp.' },
        { value: 'feature-flags', title: 'Feature flags', description: 'Toggle features independently of deploys.' },
        { value: 'rollback', title: 'Auto-rollback', description: 'Revert automatically if error rate spikes.' },
      ];
      const [selected, setSelected] = React.useState<string[]>(['canary']);
      const toggle = (v: string) =>
        setSelected((s) => s.includes(v) ? s.filter((x) => x !== v) : [...s, v]);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 400 }}>
          {options.map((o) => (
            <CheckboxCard
              key={o.value}
              title={o.title}
              description={o.description}
              checked={selected.includes(o.value)}
              onCheckedChange={() => toggle(o.value)}
            />
          ))}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)' }}>
            selected: [{selected.join(', ')}]
          </span>
        </div>
      );
    }
    return <Demo />;
  },
};

/** Multi-select set in vertical card orientation. */
export const MultiSelectVertical: Story = {
  render: () => {
    function Demo() {
      const options = [
        { value: 'canary', title: 'Canary', description: 'Route a small slice first.' },
        { value: 'flags', title: 'Feature flags', description: 'Toggle independently.' },
        { value: 'rollback', title: 'Auto-rollback', description: 'Revert on error spike.' },
      ];
      const [selected, setSelected] = React.useState<string[]>(['canary']);
      const toggle = (v: string) =>
        setSelected((s) => s.includes(v) ? s.filter((x) => x !== v) : [...s, v]);
      return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
          {options.map((o) => (
            <CheckboxCard
              key={o.value}
              orientation="vertical"
              title={o.title}
              description={o.description}
              checked={selected.includes(o.value)}
              onCheckedChange={() => toggle(o.value)}
              style={{ minWidth: 140 }}
            />
          ))}
        </div>
      );
    }
    return <Demo />;
  },
};

/** RTL — layout mirrors under right-to-left text direction. */
export const RTL: Story = {
  render: () => (
    <div dir="rtl" style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 380 }}>
      <CheckboxCard
        title="النشر التلقائي عند الدمج"
        description="نشر تلقائي عند دمج طلب السحب إلى الفرع الرئيسي."
        defaultChecked
      />
      <CheckboxCard
        title="العلامات الميزة"
        description="تبديل الميزات بشكل مستقل عن عمليات النشر."
      />
    </div>
  ),
};
