import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from '@eidos/ui';

const meta = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A native checkbox with the Eidos `.fc` visual box. Supports a label, a stacked description, sizes (sm/md/lg), a visual indeterminate state, disabled, and a danger-tinted error state.' } },
  },
  args: { label: 'Enable auto-deploy on merge', size: 'md' },
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — a single labelled box driven by args. */
export const Default: Story = { args: { defaultChecked: true } };

/** With a secondary description line (stacked "block" layout). */
export const WithDescription: Story = {
  args: { label: 'Require approval', description: 'A second reviewer must approve before this can merge.', defaultChecked: true },
};

/** The three sizes — 14 / 16 / 18 px box. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(['sm', 'md', 'lg'] as const).map((s) => <Checkbox key={s} size={s} label={`Size ${s}`} defaultChecked />)}
    </div>
  ),
};

/** Indeterminate — the "some selected" parent state (aria-checked="mixed"). */
export const Indeterminate: Story = { args: { label: 'Select all services', indeterminate: true } };

/** Disabled (checked + unchecked) — skipped in the tab order. */
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Checkbox label="Disabled, checked" defaultChecked disabled />
      <Checkbox label="Disabled, unchecked" disabled />
    </div>
  ),
};

/**
 * Error — the invalid state. Danger-tinted label via the `invalid` class, with
 * `aria-invalid` on the input and a `.fc-error` message so the failure is
 * signalled by text, not colour alone.
 */
export const Error: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Checkbox className="invalid" label="Accept the data-processing terms" aria-invalid aria-describedby="terms-err" />
      <span id="terms-err" className="fc-error">You must accept the terms to continue.</span>
    </div>
  ),
};

/** A "select all" parent driving children — the canonical indeterminate use. */
export const SelectAll: Story = {
  render: () => {
    function Demo() {
      const items = ['identity-svc', 'pix-router', 'bureau-gateway'];
      const [checked, setChecked] = React.useState<string[]>(['pix-router']);
      const all = checked.length === items.length;
      const some = checked.length > 0 && !all;
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Checkbox
            label="All services"
            checked={all}
            indeterminate={some}
            onChange={(e) => setChecked(e.target.checked ? items.slice() : [])}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingInlineStart: 24 }}>
            {items.map((it) => (
              <Checkbox
                key={it}
                label={it}
                checked={checked.includes(it)}
                onChange={(e) => setChecked((c) => (e.target.checked ? [...c, it] : c.filter((x) => x !== it)))}
              />
            ))}
          </div>
        </div>
      );
    }
    return <Demo />;
  },
};

/**
 * In context — checkboxes grouped under a fieldset/legend with per-item helper
 * descriptions and a group-level hint, mirroring the doc page's "Inside a form".
 */
export const InContext: Story = {
  render: () => {
    function Form() {
      const [opts, setOpts] = React.useState({ smoke: true, e2e: false, perf: false });
      const flip = (k: keyof typeof opts) => setOpts((o) => ({ ...o, [k]: !o[k] }));
      return (
        <fieldset style={{ border: 'none', padding: 0, margin: 0, width: '100%', maxWidth: 420 }}>
          <legend className="t-mono-label" style={{ padding: 0, marginBottom: 10 }}>Test stages</legend>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Checkbox checked={opts.smoke} onChange={() => flip('smoke')} label="Smoke" description="≈ 30 seconds, runs on every push." />
            <Checkbox checked={opts.e2e} onChange={() => flip('e2e')} label="End-to-end" description="≈ 8 minutes, runs on the merge queue." />
            <Checkbox checked={opts.perf} onChange={() => flip('perf')} label="Performance" description="≈ 22 minutes, runs nightly on main." />
          </div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-subtle)', marginTop: 12 }}>Pick at least one. Leaving all unchecked blocks the deploy.</div>
        </fieldset>
      );
    }
    return <Form />;
  },
};
