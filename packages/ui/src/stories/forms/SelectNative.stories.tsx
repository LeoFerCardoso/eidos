import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { SelectNative } from '@forge/ui';

// ── Shared fixtures ─────────────────────────────────────────────────────────────

const ENVIRONMENTS: { label: string; value: string; disabled?: boolean }[] = [
  { label: 'production',     value: 'prod' },
  { label: 'staging',        value: 'staging' },
  { label: 'preview',        value: 'preview' },
  { label: 'development',    value: 'dev' },
  { label: 'local (offline)', value: 'local', disabled: true },
];

const REGIONS: { label: string; value: string }[] = [
  { label: 'us-east-1  (N. Virginia)',  value: 'us-east-1' },
  { label: 'us-west-2  (Oregon)',        value: 'us-west-2' },
  { label: 'eu-west-1  (Ireland)',       value: 'eu-west-1' },
  { label: 'ap-southeast-1 (Singapore)', value: 'ap-southeast-1' },
  { label: 'sa-east-1  (São Paulo)',     value: 'sa-east-1' },
];

// ── Meta ────────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Forms/SelectNative',
  component: SelectNative,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '`SelectNative` is a deprecated alias for `NativeSelect` — a native `<select>` ' +
          'in the Forge field shell. Zero JavaScript: keyboard, form submission, and ' +
          'screen-reader semantics all come from the browser. Use it when the list is ' +
          'short (≤ 7 items), plain text, and system look-and-feel is acceptable. ' +
          'For icons, descriptions, or option groups use the custom `Select`. ' +
          '**Migrate to `NativeSelect`** — this alias will be removed in the next major release.',
      },
    },
  },
  args: {
    label: 'Deploy environment',
    options: ENVIRONMENTS,
    placeholder: 'Select an environment…',
    help: 'Traffic is routed to the selected environment after the deploy completes.',
  },
  argTypes: {
    label:       { control: 'text' },
    help:        { control: 'text' },
    error:       { control: 'text' },
    placeholder: { control: 'text' },
    disabled:    { control: 'boolean' },
    options:     { control: false },
    children:    { control: false },
  },
} satisfies Meta<typeof SelectNative>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Default ──────────────────────────────────────────────────────────────────────

/**
 * The minimal form shell: a label, a placeholder option, a list of environments,
 * and a helper note. Keyboard navigation and voice-over come from the browser.
 */
export const Default: Story = {};

// ── Pre-selected ──────────────────────────────────────────────────────────────────

/**
 * Pass `defaultValue` to pre-select an option without controlling the field.
 * The placeholder is omitted so the initial value is visible immediately.
 */
export const Selected: Story = {
  args: {
    defaultValue: 'staging',
    placeholder: undefined,
  },
};

// ── States ───────────────────────────────────────────────────────────────────────

/**
 * All four field states side by side — Default, Disabled, Invalid (inline error
 * replaces the help text), and Read-only (HTML `readOnly` on the underlying
 * `<select>` is not universally honoured; prefer `disabled` for locked fields).
 */
export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 260px)', gap: '24px 32px' }}>
      {/* Default */}
      <SelectNative
        label="Deploy environment"
        options={ENVIRONMENTS}
        placeholder="Select an environment…"
        help="Traffic is routed after the deploy."
      />

      {/* Pre-selected */}
      <SelectNative
        label="Deploy environment"
        options={ENVIRONMENTS}
        defaultValue="prod"
        help="Currently deploying to production."
      />

      {/* Invalid */}
      <SelectNative
        label="Deploy environment"
        options={ENVIRONMENTS}
        placeholder="Select an environment…"
        error="An environment is required to continue."
      />

      {/* Disabled */}
      <SelectNative
        label="Deploy environment"
        options={ENVIRONMENTS}
        defaultValue="staging"
        disabled
        help="Locked during active rollout."
      />
    </div>
  ),
};

// ── With option groups (children) ─────────────────────────────────────────────────

/**
 * When `options` is omitted you can render `<optgroup>` and `<option>` children
 * directly. Useful when the list has logical groupings — here, by cloud region.
 */
export const WithChildren: Story = {
  render: () => (
    <SelectNative
      label="Primary region"
      placeholder="Choose a region…"
      help="Determines where your data residency SLA is enforced."
      style={{ width: 320 }}
    >
      <optgroup label="Americas">
        {REGIONS.filter((r) => r.value.startsWith('us') || r.value.startsWith('sa')).map((r) => (
          <option key={r.value} value={r.value}>{r.label}</option>
        ))}
      </optgroup>
      <optgroup label="Europe / Middle East / Africa">
        {REGIONS.filter((r) => r.value.startsWith('eu')).map((r) => (
          <option key={r.value} value={r.value}>{r.label}</option>
        ))}
      </optgroup>
      <optgroup label="Asia Pacific">
        {REGIONS.filter((r) => r.value.startsWith('ap')).map((r) => (
          <option key={r.value} value={r.value}>{r.label}</option>
        ))}
      </optgroup>
    </SelectNative>
  ),
};

// ── Controlled ───────────────────────────────────────────────────────────────────

/**
 * Controlled variant — external state drives the selection. The selected value
 * is reflected in the status line below the field, mirroring how a deploy
 * pipeline would read the value before submitting.
 */
export const Controlled: Story = {
  render: () => {
    const [env, setEnv] = React.useState('staging');
    const chosen = ENVIRONMENTS.find((e) => e.value === env);
    return (
      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
        <SelectNative
          label="Deploy environment"
          options={ENVIRONMENTS}
          value={env}
          onChange={(e) => setEnv(e.target.value)}
          help="Changes take effect on next deploy."
          style={{ width: 260 }}
        />
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)', paddingTop: 24 }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-faint)', marginBottom: 6 }}>
            Selected
          </div>
          <span style={{ color: 'var(--accent)' }}>{chosen?.label ?? '—'}</span>
        </div>
      </div>
    );
  },
};
