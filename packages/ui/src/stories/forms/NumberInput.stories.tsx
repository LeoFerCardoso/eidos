import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { NumberInput } from '@forge/ui';

const meta = {
  title: 'Forms/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A native `<input type="number">` in the Forge field shell. The browser spinner is hidden; ' +
          'an explicit stepper is the affordance. Supports a `stacked` (default) or `split` layout. ' +
          'A `meter` prop renders a thin progress bar below the field within [min, max].',
      },
    },
  },
  args: {
    label: 'Replicas',
    defaultValue: 3,
    min: 0,
    max: 20,
    step: 1,
    help: 'Pods to run for this service.',
  },
  argTypes: {
    label: { control: 'text' },
    help: { control: 'text' },
    error: { control: 'text' },
    stepper: { control: 'boolean' },
    layout: { control: 'inline-radio', options: ['stacked', 'split'] },
    meter: { control: 'boolean' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — stacked stepper on the trailing edge. */
export const Default: Story = {};

/** Split layout — "−" button on the leading edge, "+" on the trailing edge. */
export const Split: Story = {
  render: () => {
    const [n, setN] = React.useState(3);
    return (
      <div style={{ maxWidth: 260 }}>
        <NumberInput
          label="Quantity"
          value={n}
          min={0}
          max={99}
          step={1}
          layout="split"
          help="Horizontal ± buttons — value is the focal point."
          onChange={(e) => setN(Number(e.target.value))}
        />
      </div>
    );
  },
};

/** Custom steps — step=5 and step=10. */
export const Steps: Story = {
  render: () => {
    const [a, setA] = React.useState(25);
    const [b, setB] = React.useState(50);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 340 }}>
        <NumberInput
          label="CPU allocation (step 5)"
          value={a}
          min={0}
          max={100}
          step={5}
          suffix="%"
          help="Steps by 5 — use ↑/↓ keys or the stepper."
          onChange={(e) => setA(Number(e.target.value))}
        />
        <NumberInput
          label="Memory burst (step 10)"
          value={b}
          min={0}
          max={200}
          step={10}
          suffix=" MB"
          help="Steps by 10."
          onChange={(e) => setB(Number(e.target.value))}
        />
      </div>
    );
  },
};

/** With progress meter reflecting value within [min, max]. */
export const WithMeter: Story = {
  render: () => {
    const [pct, setPct] = React.useState(40);
    const [vol, setVol] = React.useState(20);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 340 }}>
        <NumberInput
          label="Discount"
          value={pct}
          min={0}
          max={100}
          step={1}
          suffix="%"
          meter
          help="Bar reflects current percentage."
          onChange={(e) => setPct(Number(e.target.value))}
        />
        <NumberInput
          label="Volume (GB)"
          value={vol}
          min={0}
          max={100}
          step={5}
          meter
          help="Bar fills proportionally from 0 to 100 GB."
          onChange={(e) => setVol(Number(e.target.value))}
        />
      </div>
    );
  },
};

/** Three sizes — sm / md / lg. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 340 }}>
      <NumberInput label="Small (28px)" defaultValue={3} min={0} max={20} size="sm" />
      <NumberInput label="Default (36px)" defaultValue={3} min={0} max={20} size="md" />
      <NumberInput label="Large (44px)" defaultValue={3} min={0} max={20} size="lg" />
    </div>
  ),
};

/** Enforced min / max — shows constraint in help text. */
export const MinMax: Story = {
  render: () => {
    const [n, setN] = React.useState(3);
    const invalid = n < 1 || n > 10;
    return (
      <div style={{ maxWidth: 260 }}>
        <NumberInput
          label="Retry count"
          value={n}
          min={1}
          max={10}
          step={1}
          meter
          error={invalid ? 'Must be between 1 and 10' : undefined}
          help={!invalid ? 'Allowed range: 1–10' : undefined}
          onChange={(e) => setN(Number(e.target.value))}
        />
      </div>
    );
  },
};

/** Without the stepper buttons — type-only. */
export const NoStepper: Story = { args: { stepper: false, help: undefined } };

/** With a prefix/suffix addon. */
export const WithAffix: Story = {
  args: { label: 'Memory', defaultValue: 512, step: 128, suffix: 'MB', help: undefined },
};

/** Error state. */
export const Invalid: Story = {
  args: { label: 'Replicas', defaultValue: 99, error: 'Max is 20 for this tier.', help: undefined },
};

/** Disabled. */
export const Disabled: Story = { args: { defaultValue: 3, disabled: true, help: undefined } };

/** RTL — affixes and steppers flip, numerals stay LTR. */
export const RTL: Story = {
  render: () => (
    <div dir="rtl" style={{ maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <NumberInput
        label="عدد المثيلات (Replicas)"
        defaultValue={3}
        min={1}
        max={99}
        step={1}
        layout="stacked"
        help="المحرك يصطف على الحافة المتأخرة"
      />
      <NumberInput
        label="الكمية (Quantity)"
        defaultValue={5}
        min={0}
        max={99}
        step={1}
        layout="split"
        help="الأزرار تنقلب في RTL"
      />
    </div>
  ),
};

/** Controlled. */
export const Controlled: Story = {
  render: () => {
    function Demo() {
      const [n, setN] = React.useState(3);
      return (
        <NumberInput
          label={`Replicas: ${n}`}
          value={n}
          min={0}
          max={20}
          onChange={(e) => setN(Number(e.target.value))}
        />
      );
    }
    return <Demo />;
  },
};
