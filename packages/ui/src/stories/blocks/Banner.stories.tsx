import type { Meta, StoryObj } from '@storybook/react-vite';
import { Banner } from '@eidos/ui';

const TONES = ['info', 'success', 'warning', 'danger', 'neutral'] as const;

const meta = {
  title: 'Blocks/Banner',
  component: Banner,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A full-width attention bar for system-wide events — maintenance windows, version upgrades, ' +
          'open incidents, announcements. Five built-in tones plus a "custom" escape hatch. Danger ' +
          'banners announce as `role="alert"`; the rest are `role="status"`.',
      },
    },
  },
  args: {
    tone: 'info',
    title: 'Heads up',
    message: 'A new pipeline template is available for this service.',
    size: 'md',
  },
  argTypes: {
    tone: { control: 'inline-radio', options: [...TONES, 'custom'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    title: { control: 'text' },
    message: { control: 'text' },
  },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default info tone, driven by args. */
export const Default: Story = {};

/** Every built-in tone — info · success · warning · danger · neutral. */
export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {TONES.map((tone) => (
        <Banner key={tone} tone={tone} title={tone[0].toUpperCase() + tone.slice(1)} message={`This is a ${tone} banner.`} />
      ))}
    </div>
  ),
};

/** With a primary action and a dismiss control. */
export const WithActions: Story = {
  args: {
    tone: 'warning',
    title: 'Token expiring',
    message: 'Your registry token expires in 3 days.',
    action: 'Rotate now',
    onAction: () => {},
    onDismiss: () => {},
  },
};

/** Message-only (no title), compact `sm` size — runs the message at full weight. */
export const MessageOnly: Story = {
  args: { tone: 'neutral', title: undefined, message: 'Synced 2 minutes ago.', size: 'sm' },
};

/** Roomier `lg` size — larger tone icon and padding for top-of-page placement. */
export const LargeSize: Story = {
  args: {
    tone: 'info',
    title: 'New: Ring Deployments',
    message: 'Roll out by cohort with one click. Read the guide to wire up your service.',
    action: 'Open guide',
    onAction: () => {},
    size: 'lg',
  },
};

/** The "custom" tone disables tinted chrome so you can supply bg / fg / accent. */
export const Custom: Story = {
  args: {
    tone: 'custom',
    title: 'Ember',
    message: 'Custom surface with an ember accent border.',
    bg: 'var(--surface)',
    fg: 'var(--fg)',
    accent: 'var(--ember)',
  },
};

/** The documented placements: at the top of a page, nested inside a card, and dismissible. */
export const InContext: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Banner
        tone="info"
        title="Welcome to Forge"
        message="Take the 5-minute tour to wire your first service to the IDP."
        action="Start tour"
        onAction={() => {}}
      />
      <div style={{ padding: 14, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ fontWeight: 500, marginBottom: 10 }}>Service health · forge-api</div>
        <Banner tone="warning" message="3 of 5 SLO budgets at risk this window." />
      </div>
      <Banner
        tone="success"
        title="Service onboarded"
        message="forge-api is now indexed in the Service Catalog."
        onDismiss={() => {}}
      />
    </div>
  ),
};
