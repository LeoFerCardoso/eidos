import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Input, Icons } from '@eidos/ui';

const meta = {
  title: 'Forms/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The everyday text-entry control: label + group (optional addons + native input) + helper/error row. ' +
          'A real <input> under the hood, so validation, form submission, and screen readers work for free.',
      },
    },
  },
  args: { label: 'Service name', placeholder: 'identity-svc', help: 'Lowercase, hyphen-separated.' },
  argTypes: {
    label: { control: 'text' },
    help: { control: 'text' },
    error: { control: 'text' },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The everyday field — label, control, and helper, driven by args (try the `size` control). */
export const Default: Story = {};

/** The three field heights — 28 / 36 / 44 px. Match the surrounding chrome. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 360 }}>
      <Input size="sm" label="Small (28)" placeholder="compact tables" />
      <Input size="md" label="Default (36)" placeholder="forms & dialogs" />
      <Input size="lg" label="Large (44)" placeholder="hero search" />
    </div>
  ),
};

/** Decorative icons inside the field — leading, trailing, or both. */
export const WithIcons: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'you@eidos.io',
    prefix: <Icons.inbox size={14} />,
    suffix: <Icons.check size={14} />,
    help: undefined,
  },
};

/** Static text affix — scheme on the leading edge, domain on the trailing edge. */
export const Affix: Story = {
  args: { label: 'Subdomain', prefix: 'https://', suffix: '.eidos.io', defaultValue: 'my-app', help: undefined },
};

/** Required field — the asterisk pairs with the `required` attribute for screen readers. */
export const Required: Story = {
  args: {
    label: 'Service name *',
    placeholder: 'identity-svc',
    required: true,
    'aria-required': true,
    help: 'Required for all services.',
  },
};

/** Optional field — mark the rarer of required/optional; here, the optional tag. */
export const Optional: Story = {
  args: { label: 'Internal description (optional)', placeholder: 'Auth & user identity', help: 'Visible only to your team.' },
};

/** Error state — danger ring + message, aria-invalid set. */
export const Invalid: Story = {
  args: { label: 'Service name', value: 'Identity SVC', error: 'Use lowercase letters and hyphens only.' },
};

/** Disabled — non-interactive, dimmed. */
export const Disabled: Story = {
  args: { label: 'Service name', value: 'identity-svc', disabled: true, help: undefined },
};

/** Readonly — value is selectable but locked from editing (tokens, IDs). */
export const Readonly: Story = {
  args: { label: 'API key', value: 'eidos_3f2a8c1d2e3b', readOnly: true, help: 'Selectable, but locked.' },
};

const Spinner = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="8" cy="8" r="6" opacity="0.18" />
    <path d="M8 2 a6 6 0 0 1 6 6">
      <animateTransform attributeName="transform" type="rotate" from="0 8 8" to="360 8 8" dur="0.9s" repeatCount="indefinite" />
    </path>
  </svg>
);

/** Loading — a trailing spinner suffix while the value is validated server-side. */
export const Loading: Story = {
  args: { label: 'Service name', defaultValue: 'checking-name', suffix: <Spinner />, help: 'Validating availability…' },
};

/** Search with a stateful clear-X that appears once the field has a value. */
export const Search: Story = {
  render: () => {
    const [value, setValue] = React.useState('');
    return (
      <div style={{ maxWidth: 360 }}>
        <Input
          label="Search"
          type="search"
          placeholder="Search services, deploys, GMUDs…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          prefix={<Icons.search size={14} />}
          suffix={
            value ? (
              <button
                type="button"
                onClick={() => setValue('')}
                aria-label="Clear search"
                style={{ display: 'inline-flex', background: 'none', border: 0, padding: 0, cursor: 'pointer', color: 'inherit' }}
              >
                <Icons.x size={14} />
              </button>
            ) : undefined
          }
        />
      </div>
    );
  },
};

/** Password with a stateful show / hide toggle — the eye flips and updates aria-pressed. */
export const Password: Story = {
  render: () => {
    const [show, setShow] = React.useState(false);
    return (
      <div style={{ maxWidth: 360 }}>
        <Input
          label="Password"
          type={show ? 'text' : 'password'}
          defaultValue="anvil-strike-7"
          help="At least 12 characters with one symbol."
          prefix={<Icons.shield size={14} />}
          suffix={
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? 'Hide password' : 'Show password'}
              aria-pressed={show}
              style={{ display: 'inline-flex', background: 'none', border: 0, padding: 0, cursor: 'pointer', color: 'inherit' }}
            >
              {show ? <Icons.eyeOff size={15} /> : <Icons.eye size={15} />}
            </button>
          }
        />
      </div>
    );
  },
};

/** A small login fragment, as on a real form. */
export const InContext: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
      <Input label="Email" type="email" placeholder="you@equifax.com" prefix={<Icons.inbox size={14} />} autoComplete="email" />
      <Input label="Password" type="password" placeholder="••••••••" help="At least 12 characters." autoComplete="current-password" />
    </div>
  ),
};
