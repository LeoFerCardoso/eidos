import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from '@eidos/ui';

const meta = {
  title: 'Primitives/Separator',
  component: Separator,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A 1-px hairline divider. Decorative by default (aria-hidden); pass ' +
          '`decorative={false}` for structural boundaries announced by screen readers. ' +
          'Supports horizontal/vertical orientation and solid/dashed variants.',
      },
    },
  },
  args: {
    orientation: 'horizontal',
    variant: 'solid',
    decorative: true,
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    variant: { control: 'inline-radio', options: ['solid', 'dashed'] },
    decorative: { control: 'boolean' },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default horizontal solid separator, full width. */
export const Default: Story = {
  render: (args) => (
    <div style={{ width: 320 }}>
      <div style={{ padding: '10px 0', color: 'var(--fg-muted)', fontSize: 'var(--text-base)' }}>Profile</div>
      <Separator {...args} />
      <div style={{ padding: '10px 0', color: 'var(--fg-muted)', fontSize: 'var(--text-base)' }}>Account</div>
    </div>
  ),
};

/** Dashed variant — for soft, non-structural breaks (date dividers, optional sections). */
export const Dashed: Story = {
  args: { variant: 'dashed' },
  render: (args) => (
    <div style={{ width: 320 }}>
      <div style={{ padding: '12px 0', color: 'var(--fg-muted)', fontSize: 'var(--text-base)' }}>Today</div>
      <Separator {...args} />
      <div style={{ padding: '12px 0', color: 'var(--fg-muted)', fontSize: 'var(--text-base)' }}>Yesterday</div>
    </div>
  ),
};

/** Vertical separator between siblings in a flex row. */
export const Vertical: Story = {
  args: { orientation: 'vertical', decorative: true },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', background: 'var(--surface)', width: 'fit-content' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>Workspace</div>
        <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginTop: 2 }}>Forge Cloud</div>
      </div>
      <Separator {...args} />
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>Region</div>
        <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginTop: 2 }}>us-east-1</div>
      </div>
      <Separator {...args} />
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>Plan</div>
        <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginTop: 2 }}>Team · 24 seats</div>
      </div>
    </div>
  ),
};

/** Semantic separator (decorative=false) — announced by screen readers as a structural boundary. */
export const Semantic: Story = {
  args: { decorative: false },
  render: (args) => (
    <div style={{ width: 320 }}>
      <nav aria-label="Settings sections">
        <div role="group" aria-label="User" style={{ padding: '8px 0', color: 'var(--fg-muted)', fontSize: 'var(--text-base)' }}>User preferences</div>
        <Separator {...args} />
        <div role="group" aria-label="Team" style={{ padding: '8px 0', color: 'var(--fg-muted)', fontSize: 'var(--text-base)' }}>Team settings</div>
        <Separator {...args} />
        <div role="group" aria-label="Billing" style={{ padding: '8px 0', color: 'var(--fg-muted)', fontSize: 'var(--text-base)' }}>Billing &amp; plans</div>
      </nav>
    </div>
  ),
};

/** All variants at a glance — horizontal solid, dashed; vertical solid. */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: 360 }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-faint)', marginBottom: 12 }}>Horizontal · solid</div>
        <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', padding: '8px 0' }}>Section A</div>
        <Separator orientation="horizontal" variant="solid" />
        <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', padding: '8px 0' }}>Section B</div>
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-faint)', marginBottom: 12 }}>Horizontal · dashed</div>
        <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', padding: '8px 0' }}>Today</div>
        <Separator orientation="horizontal" variant="dashed" />
        <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', padding: '8px 0' }}>Yesterday</div>
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-faint)', marginBottom: 12 }}>Vertical · solid</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
          <span style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)' }}>Forge Cloud</span>
          <Separator orientation="vertical" decorative />
          <span style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)' }}>us-east-1</span>
        </div>
      </div>
    </div>
  ),
};

/** RTL — the rule itself is mirror-symmetric; items pack from the right. */
export const RTL: Story = {
  render: () => (
    <div dir="rtl" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', background: 'var(--surface)', width: 'fit-content' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>مساحة العمل</div>
        <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginTop: 2 }}>فورج كلاود</div>
      </div>
      <Separator orientation="vertical" decorative />
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>المنطقة</div>
        <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginTop: 2 }}>us-east-1</div>
      </div>
    </div>
  ),
};

/** In context — inside a settings page layout. */
export const InContext: Story = {
  render: () => (
    <div style={{ width: 360, border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: 'var(--bg)' }}>
      <div style={{ padding: '16px 20px' }}>
        <div style={{ fontWeight: 600, fontSize: 'var(--text-md)', marginBottom: 4 }}>Forge Cloud</div>
        <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>Manage your workspace settings</div>
      </div>
      <Separator orientation="horizontal" />
      <div style={{ padding: '16px 20px' }}>
        <div style={{ fontWeight: 600, fontSize: 'var(--text-base)', marginBottom: 4 }}>Team</div>
        <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>24 members · Pro plan</div>
      </div>
      <Separator orientation="horizontal" />
      <div style={{ padding: '16px 20px' }}>
        <div style={{ fontWeight: 600, fontSize: 'var(--text-base)', marginBottom: 4 }}>Billing</div>
        <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>Next renewal: June 1, 2026</div>
      </div>
    </div>
  ),
};
