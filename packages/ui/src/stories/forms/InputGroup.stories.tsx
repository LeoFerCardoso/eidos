import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { InputGroup, InputAddon, Icons } from '@eidos/ui';

const meta = {
  title: 'Forms/InputGroup',
  component: InputGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A horizontal cluster — input, button, select, and optional text addons — sharing one bordered shell. ' +
          'Composes the existing .in-group / .in-addon / .in-control CSS system. ' +
          'Use InputAddon (kind text|icon|button|select) to compose each segment. ' +
          'Pass an id to text addons and reference it from the input via aria-describedby.',
      },
    },
  },
  args: {
    size: 'md',
    invalid: false,
    disabled: false,
    full: true,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    full: { control: 'boolean' },
  },
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: leading icon + input + primary (ember) action button. */
export const Default: Story = {
  render: (args) => (
    <InputGroup {...args} style={{ maxWidth: 460 }}>
      <InputAddon kind="icon"><Icons.search size={14} /></InputAddon>
      <input className="in-control" placeholder="Search projects, files, people…" />
      <InputAddon kind="button" accent>Search</InputAddon>
    </InputGroup>
  ),
};

/** Leading text affix — URL scheme prefix wired via aria-describedby. */
export const LeadingText: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <InputGroup {...args} style={{ maxWidth: 460 }}>
        <InputAddon kind="text" id="sb-scheme-1">https://</InputAddon>
        <input className="in-control" aria-describedby="sb-scheme-1" defaultValue="forge.example.com/team" />
      </InputGroup>
      <InputGroup {...args} style={{ maxWidth: 460 }}>
        <InputAddon kind="text" id="sb-at-1">@</InputAddon>
        <input className="in-control" aria-describedby="sb-at-1" placeholder="username" />
      </InputGroup>
    </div>
  ),
};

/** Trailing text affix — unit suffix. */
export const TrailingText: Story = {
  render: (args) => (
    <InputGroup {...args} style={{ maxWidth: 320 }}>
      <input className="in-control" placeholder="42" aria-describedby="sb-unit-1" />
      <InputAddon kind="text" id="sb-unit-1">USD / month</InputAddon>
    </InputGroup>
  ),
};

/** Leading icon addon (non-interactive decorative affordance). */
export const LeadingIcon: Story = {
  render: (args) => (
    <InputGroup {...args} style={{ maxWidth: 460 }}>
      <InputAddon kind="icon"><Icons.inbox size={14} /></InputAddon>
      <input className="in-control" placeholder="you@example.com" type="email" />
    </InputGroup>
  ),
};

/** Trailing primary (ember) button — the canonical search pattern. */
export const TrailingPrimaryButton: Story = {
  render: (args) => (
    <InputGroup {...args} style={{ maxWidth: 460 }}>
      <input className="in-control" placeholder="Search repositories…" />
      <InputAddon kind="button" accent>Search</InputAddon>
    </InputGroup>
  ),
};

/** Icon-only action button — copy, send, clear. */
export const IconOnlyButton: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <InputGroup {...args} style={{ maxWidth: 460 }}>
        <InputAddon kind="icon"><Icons.link size={14} /></InputAddon>
        <input className="in-control" readOnly defaultValue="https://forge-ds.com/invites/3f4-9k2-x8q" />
        <InputAddon kind="button" aria-label="Copy link"><Icons.copy size={14} /></InputAddon>
      </InputGroup>
      <InputGroup {...args} style={{ maxWidth: 460 }}>
        <input className="in-control" placeholder="Reply to thread…" />
        <InputAddon kind="button" accent aria-label="Send"><Icons.arrowRight size={14} /></InputAddon>
      </InputGroup>
    </div>
  ),
};

/** Trailing native select addon — currency picker. */
export const TrailingSelect: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <InputGroup {...args} style={{ maxWidth: 460 }}>
        <InputAddon kind="select" defaultValue="USD">
          <option>USD</option>
          <option>EUR</option>
          <option>BRL</option>
          <option>JPY</option>
        </InputAddon>
        <input className="in-control" placeholder="0.00" />
        <InputAddon kind="text" id="sb-per-mo">/ month</InputAddon>
      </InputGroup>
      <InputGroup {...args} style={{ maxWidth: 460 }}>
        <InputAddon kind="select" defaultValue="+1">
          <option>+1</option>
          <option>+44</option>
          <option>+55</option>
          <option>+81</option>
        </InputAddon>
        <input className="in-control" placeholder="(415) 555 0182" />
      </InputGroup>
    </div>
  ),
};

/** All three sizes — sm (28px) / md (36px) / lg (44px). */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <InputGroup size="sm" style={{ maxWidth: 460 }}>
        <InputAddon kind="icon"><Icons.search size={12} /></InputAddon>
        <input className="in-control" placeholder="Small (28px)" />
        <InputAddon kind="button">Apply</InputAddon>
      </InputGroup>
      <InputGroup size="md" style={{ maxWidth: 460 }}>
        <InputAddon kind="icon"><Icons.search size={14} /></InputAddon>
        <input className="in-control" placeholder="Default (36px)" />
        <InputAddon kind="button" accent>Apply</InputAddon>
      </InputGroup>
      <InputGroup size="lg" style={{ maxWidth: 460 }}>
        <InputAddon kind="icon"><Icons.search size={16} /></InputAddon>
        <input className="in-control" placeholder="Large (44px)" />
        <InputAddon kind="button" accent>Subscribe</InputAddon>
      </InputGroup>
    </div>
  ),
};

/** Invalid state — danger ring on the group. */
export const Invalid: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <InputGroup {...args} invalid style={{ maxWidth: 460 }}>
        <input className="in-control" defaultValue="not-an-email" />
        <InputAddon kind="button">Submit</InputAddon>
      </InputGroup>
      <span style={{ fontSize: 12, color: 'var(--danger)' }}>Enter a valid email address.</span>
    </div>
  ),
};

/** Disabled — entire group non-interactive. */
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <InputGroup {...args} style={{ maxWidth: 460 }}>
      <InputAddon kind="icon"><Icons.search size={14} /></InputAddon>
      <input className="in-control" placeholder="Search…" disabled />
      <InputAddon kind="button">Search</InputAddon>
    </InputGroup>
  ),
};

/** RTL direction — logical properties flip segments correctly. */
export const RTL: Story = {
  render: (args) => (
    <div dir="rtl" style={{ maxWidth: 460 }}>
      <InputGroup {...args}>
        <InputAddon kind="icon"><Icons.search size={14} /></InputAddon>
        <input className="in-control" placeholder="ابحث في المشاريع…" />
        <InputAddon kind="button" accent>بحث</InputAddon>
      </InputGroup>
    </div>
  ),
};

/** URL + copy icon button (utility pattern). */
export const UrlCopy: Story = {
  render: (args) => (
    <InputGroup {...args} style={{ maxWidth: 460 }}>
      <InputAddon kind="icon"><Icons.link size={14} /></InputAddon>
      <input className="in-control" readOnly defaultValue="https://forge-ds.com/invites/3f4-9k2-x8q" />
      <InputAddon kind="button" aria-label="Copy link"><Icons.copy size={14} /></InputAddon>
    </InputGroup>
  ),
};

/** Three segments: text label + select + input + action. */
export const ThreeSegments: Story = {
  render: (args) => (
    <InputGroup {...args} style={{ maxWidth: 560 }}>
      <InputAddon kind="text" id="sb-filter">Filter</InputAddon>
      <InputAddon kind="select" defaultValue="name">
        <option value="name">name</option>
        <option value="owner">owner</option>
        <option value="tag">tag</option>
      </InputAddon>
      <input className="in-control" aria-describedby="sb-filter" placeholder="contains…" />
      <InputAddon kind="button" accent>Apply</InputAddon>
    </InputGroup>
  ),
};

/** Send-message pattern: leading attachment, trailing send. */
export const SendMessage: Story = {
  render: (args) => {
    const [value, setValue] = React.useState('');
    return (
      <InputGroup {...args} style={{ maxWidth: 560 }}>
        <InputAddon kind="button" aria-label="Add attachment">
          <Icons.paperclip size={14} />
        </InputAddon>
        <input
          className="in-control"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Reply to thread…"
        />
        <InputAddon kind="button" accent aria-label="Send">
          <Icons.arrowRight size={14} />
        </InputAddon>
      </InputGroup>
    );
  },
};

/** In context: a realistic signup-form fragment. */
export const InContext: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 480 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label
          htmlFor="invite-url"
          style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)' }}
        >
          Invite link
        </label>
        <InputGroup>
          <InputAddon kind="icon"><Icons.link size={14} /></InputAddon>
          <input
            id="invite-url"
            className="in-control"
            readOnly
            defaultValue="https://forge-ds.com/invites/3f4-9k2-x8q"
          />
          <InputAddon kind="button" aria-label="Copy link">
            <Icons.copy size={14} />
          </InputAddon>
        </InputGroup>
        <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>
          Share with anyone to grant read access.
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label
          htmlFor="budget"
          style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)' }}
        >
          Monthly budget
        </label>
        <InputGroup>
          <InputAddon kind="select" aria-label="Currency">
            <option>USD</option>
            <option>EUR</option>
            <option>GBP</option>
          </InputAddon>
          <input
            id="budget"
            className="in-control"
            type="number"
            min="0"
            placeholder="0.00"
          />
          <InputAddon kind="text" id="budget-unit">/ month</InputAddon>
        </InputGroup>
      </div>
    </div>
  ),
};
