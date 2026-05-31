import type { Meta, StoryObj } from '@storybook/react-vite';
import { Empty } from '@eidos/ui';

const meta = {
  title: 'Primitives/Empty',
  component: Empty,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Canonical empty-state surface for tables, drawers, and hero sections. ' +
          'Three sizes (sm / md / lg) share the same chrome; pass `iconName` (keyed into Icons) ' +
          'or a ReactNode `icon`. `action` and `secondary` strings auto-render as Forge buttons.',
      },
    },
  },
  args: {
    size: 'md',
    title: 'No incidents found',
    desc: 'All systems are operating normally.',
    iconName: 'alert',
    accent: false,
    dotted: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    accent: { control: 'boolean', description: 'Add ember accent tint to the container.' },
    dotted: { control: 'boolean', description: 'Add a dashed border.' },
    title: { control: 'text' },
    desc: { control: 'text' },
    iconName: { control: 'text', description: 'Key from the global Icons map.' },
    action: { control: 'text', description: 'Primary CTA — string renders an ember button.' },
    secondary: { control: 'text', description: 'Secondary CTA — string renders a ghost button.' },
  },
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default medium empty state with icon and description. */
export const Default: Story = {};

/** Small — for table bodies and inline drawers. */
export const Small: Story = {
  args: { size: 'sm', title: 'No results', desc: 'Try adjusting your filters.' },
};

/** Large — for hero page-level empty states. */
export const Large: Story = {
  args: {
    size: 'lg',
    title: 'No services onboarded yet',
    desc: 'Connect your first service to start tracking quality gates and deployments.',
    action: 'Add service',
    secondary: 'Read docs',
  },
};

/** With a primary action button. */
export const WithAction: Story = {
  args: {
    title: 'No deployments today',
    desc: 'Trigger a deploy or wait for the next scheduled ring rotation.',
    action: 'Trigger deploy',
    secondary: 'View runbook',
  },
};

/** Dotted border — used for drag-drop or upload targets. */
export const Dotted: Story = {
  args: {
    dotted: true,
    title: 'Drop runbook here',
    desc: 'YAML or JSON accepted.',
    action: 'Browse files',
  },
};

/** Accent tint — draws attention in dashboard cards. */
export const Accent: Story = {
  args: {
    accent: true,
    title: 'No open incidents',
    desc: 'Everything is healthy.',
  },
};

/** In a table-body context — sm, no icon, minimal copy. */
export const InContext: Story = {
  render: () => (
    <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          padding: '8px 16px',
          borderBottom: '1px solid var(--border)',
          fontSize: 11,
          color: 'var(--fg-muted)',
          background: 'var(--surface)',
        }}
      >
        <span>Service</span><span>Tier</span><span>Last deploy</span>
      </div>
      <Empty size="sm" title="No matching services" desc="Clear filters to show all services." />
    </div>
  ),
};
