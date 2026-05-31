import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { PasswordField, DEFAULT_PASSWORD_REQUIREMENTS } from '@eidos/ui';
import type { PasswordRequirement } from '@eidos/ui';

const meta = {
  title: 'Forms/PasswordField',
  component: PasswordField,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '`PasswordField` is the "new password" composite: a `PasswordInput` with the ' +
          'segmented strength bar and requirements checklist always enabled. Use it on ' +
          'registration, password-reset, and API-key creation forms where guiding the user ' +
          'toward a strong credential is the primary goal. Supply custom `requirements` for ' +
          'service-specific policies (e.g., 16-char minimum for privileged service accounts). ' +
          'The strength score is derived from how many requirements pass; the `aria-live` ' +
          'label announces the score to assistive technology as the user types.',
      },
    },
  },
  args: {
    label: 'New password',
    placeholder: '••••••••',
  },
  argTypes: {
    label:        { control: 'text' },
    help:         { control: 'text' },
    error:        { control: 'text' },
    disabled:     { control: 'boolean' },
    size:         { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    requirements: { control: false },
  },
} satisfies Meta<typeof PasswordField>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Default ────────────────────────────────────────────────────────────────────

/**
 * Minimal controlled usage. Type into the field to watch the segmented bar and
 * requirements checklist update live. The strength label is announced via
 * `aria-live="polite"` on each change.
 */
export const Default: Story = {
  render: (args) => {
    const [value, setValue] = React.useState('');
    return (
      <div style={{ maxWidth: 400 }}>
        <PasswordField
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

// ── States ─────────────────────────────────────────────────────────────────────

/**
 * All meaningful states side-by-side: empty (default), partially filled (fair
 * strength), fully satisfied (very strong), error (policy mismatch on a
 * credential-reset form), and disabled (read-only service token display).
 */
export const States: Story = {
  render: () => {
    const [val, setVal] = React.useState('Eidos$2026');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 400 }}>
        {/* Empty — bar is dormant */}
        <PasswordField
          label="New password (empty)"
          placeholder="••••••••"
        />

        {/* Fair — only 2/4 requirements satisfied */}
        <PasswordField
          label="New password (fair)"
          defaultValue="abc123"
          help="Keep going — add an uppercase letter and more characters."
        />

        {/* Controlled, very strong — all 4 requirements satisfied */}
        <PasswordField
          label="New password (very strong)"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          help="Meets all deployment-key policy requirements."
        />

        {/* Error — policy violation returned from API */}
        <PasswordField
          label="New password (error)"
          defaultValue="abc123"
          error="Password was found in a breach database. Choose a different one."
        />

        {/* Disabled — shown on a locked service account */}
        <PasswordField
          label="Service account secret (disabled)"
          value="••••••••••••••••"
          disabled
        />
      </div>
    );
  },
};

// ── Sizes ──────────────────────────────────────────────────────────────────────

/**
 * Three scale steps — `sm` for compact credential panels (e.g., an inline
 * API-key rotation dialog), `md` (default) for standard registration flows,
 * and `lg` for full-page onboarding where the field is the focal element.
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 400 }}>
      <PasswordField
        label="Small — API key rotation"
        size="sm"
        placeholder="••••••••"
        help="Used in compact side-panels."
      />
      <PasswordField
        label="Medium — account registration"
        size="md"
        placeholder="••••••••"
        help="Default scale; fits standard form layouts."
      />
      <PasswordField
        label="Large — onboarding flow"
        size="lg"
        placeholder="••••••••"
        help="Draws attention on full-page setup steps."
      />
    </div>
  ),
};

// ── Custom requirements ────────────────────────────────────────────────────────

/**
 * Override the default requirements for a stricter service-account policy:
 * 16-character minimum, symbols required. Pass any `PasswordRequirement[]`
 * array to `requirements` to replace the defaults entirely.
 */
export const CustomRequirements: Story = {
  render: () => {
    const serviceAccountPolicy: PasswordRequirement[] = [
      { label: '16+ characters',          test: (v) => v.length >= 16 },
      { label: 'At least 1 uppercase',    test: (v) => /[A-Z]/.test(v) },
      { label: 'At least 1 lowercase',    test: (v) => /[a-z]/.test(v) },
      { label: 'At least 1 digit',        test: (v) => /\d/.test(v) },
      { label: 'At least 1 symbol (!@#$)', test: (v) => /[!@#$%^&*]/.test(v) },
    ];

    const [value, setValue] = React.useState('');
    return (
      <div style={{ maxWidth: 400 }}>
        <PasswordField
          label="Service account secret"
          placeholder="••••••••••••••••"
          requirements={serviceAccountPolicy}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          help="Privileged accounts require a 16-character minimum with symbols."
        />
      </div>
    );
  },
};

// ── Default requirements reference ────────────────────────────────────────────

/**
 * Explicit pass-through of `DEFAULT_PASSWORD_REQUIREMENTS` — identical to the
 * implicit default but useful in storybook controls for inspecting the built-in
 * baseline without any custom overrides.
 */
export const DefaultRequirements: Story = {
  render: (args) => {
    const [value, setValue] = React.useState('');
    return (
      <div style={{ maxWidth: 400 }}>
        <PasswordField
          {...args}
          requirements={DEFAULT_PASSWORD_REQUIREMENTS}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          help="Default policy: 8 chars, uppercase, lowercase, digit."
        />
      </div>
    );
  },
};

// ── RTL ────────────────────────────────────────────────────────────────────────

/**
 * Right-to-left layout — the show/hide toggle moves to the leading (right) edge,
 * the strength bar fills left-to-right in LTR but is mirrored visually in RTL,
 * and the requirements checklist aligns to the paragraph direction.
 * The global direction toolbar in Storybook overrides this when set to RTL.
 */
export const RTL: Story = {
  render: () => {
    const [value, setValue] = React.useState('');
    return (
      <div dir="rtl" style={{ maxWidth: 400 }}>
        <PasswordField
          label="كلمة مرور جديدة"
          placeholder="••••••••"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          help="اختر كلمة مرور قوية تفي بجميع المتطلبات."
        />
      </div>
    );
  },
};
