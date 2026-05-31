import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from '@eidos/ui';

const meta = {
  title: 'Forms/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A native <label> wrapper that focuses/toggles its associated control on click. ' +
          'Adds an ember required asterisk, an optional muted suffix, sm/md size variants, ' +
          'and disabled styling. Use htmlFor + matching id to bind to the control.',
      },
    },
  },
  args: {
    children: 'Email address',
    size: 'md',
    required: false,
    optional: false,
    disabled: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    required: { control: 'boolean' },
    optional: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
    htmlFor: { control: 'text' },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default md label wired to an input via htmlFor. */
export const Default: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 320 }}>
      <Label htmlFor="demo-email" {...args} />
      <div className="in-group">
        <input id="demo-email" className="in-control" placeholder="you@eidos.com" />
      </div>
    </div>
  ),
};

/** Required field — ember asterisk + sr-only "required". */
export const Required: Story = {
  args: { children: 'Full name', required: true },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 320 }}>
      <Label htmlFor="demo-name" {...args} />
      <div className="in-group">
        <input id="demo-name" className="in-control" placeholder="Ada Lovelace" />
      </div>
    </div>
  ),
};

/** Optional field — muted "(optional)" suffix. */
export const Optional: Story = {
  args: { children: 'Pronoun', optional: true },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 320 }}>
      <Label htmlFor="demo-pronoun" {...args} />
      <div className="in-group">
        <input id="demo-pronoun" className="in-control" placeholder="e.g. she/her" />
      </div>
    </div>
  ),
};

/** Small size — compact label for nested or dense forms. */
export const Small: Story = {
  args: { children: 'API key', size: 'sm' },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 320 }}>
      <Label htmlFor="demo-apikey" {...args} />
      <div className="in-group sm">
        <input id="demo-apikey" className="in-control" placeholder="sk_live_••••" />
      </div>
    </div>
  ),
};

/** Disabled — label dims to match the disabled control. */
export const Disabled: Story = {
  args: { children: 'Billing email', disabled: true },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 320 }}>
      <Label htmlFor="demo-billing" {...args} />
      <div className="in-group is-disabled">
        <input id="demo-billing" className="in-control" value="billing@acme.com" disabled readOnly />
      </div>
    </div>
  ),
};

/** All marker variants side by side for quick comparison. */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Label htmlFor="av-plain">Plain label (no marker)</Label>
        <div className="in-group"><input id="av-plain" className="in-control" placeholder="value" /></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Label htmlFor="av-req" required>Required label</Label>
        <div className="in-group"><input id="av-req" className="in-control" placeholder="value" /></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Label htmlFor="av-opt" optional>Optional label</Label>
        <div className="in-group"><input id="av-opt" className="in-control" placeholder="value" /></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Label htmlFor="av-sm" size="sm">Small label</Label>
        <div className="in-group sm"><input id="av-sm" className="in-control" placeholder="value" /></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Label htmlFor="av-dis" disabled>Disabled label</Label>
        <div className="in-group is-disabled"><input id="av-dis" className="in-control" value="locked" disabled readOnly /></div>
      </div>
    </div>
  ),
};

/** In context — a complete sign-in form fragment with required + helper text. */
export const InContext: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
      <div className="in-field">
        <Label htmlFor="ctx-email" required>Email</Label>
        <div className="in-group">
          <input id="ctx-email" className="in-control" type="email" placeholder="you@equifax.com" />
        </div>
      </div>
      <div className="in-field">
        <Label htmlFor="ctx-pw" required>Password</Label>
        <div className="in-group">
          <input id="ctx-pw" className="in-control" type="password" placeholder="••••••••" />
        </div>
        <p className="in-help">Minimum 12 characters.</p>
      </div>
      <div className="in-field">
        <Label htmlFor="ctx-org" optional>Organisation</Label>
        <div className="in-group">
          <input id="ctx-org" className="in-control" placeholder="Acme Corp" />
        </div>
      </div>
    </div>
  ),
};

/** RTL — label and markers flip with reading direction. */
export const RTL: Story = {
  render: () => (
    <div dir="rtl" style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
      <div className="in-field">
        <Label htmlFor="rtl-email" required>البريد الإلكتروني</Label>
        <div className="in-group">
          <input id="rtl-email" className="in-control" placeholder="you@eidos.com" />
        </div>
        <p className="in-help">يستخدم لتسجيل الدخول.</p>
      </div>
      <div className="in-field">
        <Label htmlFor="rtl-org" optional>المنظمة</Label>
        <div className="in-group">
          <input id="rtl-org" className="in-control" placeholder="شركة المثال" />
        </div>
      </div>
    </div>
  ),
};
