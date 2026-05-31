import type { Meta, StoryObj } from '@storybook/react-vite';
import { ServiceCard, MOCKS } from '@forge/ui';

// 24h latency shape (ms-scale), so the detailed sparkline reads like p95 over time
// rather than an abstract ramp.
const SPARK = [89, 92, 88, 95, 91, 88, 87, 86, 88, 90, 89, 89];

const PIX_ROUTER = MOCKS.SERVICES.find((s) => s.id === 'pix-router')!;
const IDENTITY   = MOCKS.SERVICES.find((s) => s.id === 'identity-svc')!;

const CONTRIBUTORS = [
  { name: 'Rafael Mendonça', initials: 'RM', ember: true },
  { name: 'Larissa Fontana', initials: 'LF' },
  { name: 'Diego Vasquez',   initials: 'DV' },
  { name: 'Camila Tanaka',   initials: 'CT' },
];

const meta = {
  title: 'Blocks/ServiceCard',
  component: ServiceCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A catalog tile for a microservice: server icon, name, version + deploy timestamp, ' +
          'a `HealthBadge`, a contributor avatar group, and a language badge in the footer. ' +
          'Three variants: `compact` for slim catalog rows, `default` for grids, and `detailed` ' +
          'for the service-detail surface (adds a latency sparkline + p95). Set `onOpen` to make ' +
          'the whole tile a single `role="button"` Tab stop activated by Enter/Space.',
      },
    },
  },
  args: {
    service: PIX_ROUTER,
    contributors: CONTRIBUTORS,
    variant: 'default',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['compact', 'default', 'detailed'] },
  },
} satisfies Meta<typeof ServiceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default grid tile — healthy service, no sparkline. Driven by args. */
export const Default: Story = {};

/** Degraded health — the `alert` flag swaps the HealthBadge to "Degraded" (label + dot, not colour alone). */
export const Degraded: Story = {
  args: { service: { ...PIX_ROUTER, alert: true } },
};

/** Compact variant — header-only slim row (no footer) for dense catalog lists, search palettes and dependency drawers. */
export const Compact: Story = {
  args: { variant: 'compact' },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 420 }}>
      {MOCKS.SERVICES.slice(0, 4).map((svc) => (
        <ServiceCard key={svc.id} {...args} service={svc} />
      ))}
    </div>
  ),
};

/** Detailed variant — adds the latency sparkline with the p95 readout, for the service-detail surface. */
export const Detailed: Story = {
  args: { variant: 'detailed', sparkSeries: SPARK, service: { ...PIX_ROUTER, p95: 89 } },
};

/** Default variant in the catalog grid (3-up) — sparkline-free tiles for a 30+ service catalog. */
export const Grid: Story = {
  render: (args) => (
    <div className="ds-grid cols-3" style={{ maxWidth: 720 }}>
      {MOCKS.SERVICES.slice(0, 6).map((svc) => (
        <ServiceCard
          key={svc.id}
          {...args}
          service={svc}
          contributors={CONTRIBUTORS.slice(0, 3)}
        />
      ))}
    </div>
  ),
};

/** Up · degraded — the same surface, one healthy and one alerting service side by side. */
export const HealthStates: Story = {
  render: (args) => (
    <div className="ds-grid cols-2" style={{ maxWidth: 560 }}>
      <ServiceCard {...args} service={IDENTITY} />
      <ServiceCard {...args} service={{ ...PIX_ROUTER, alert: true }} />
    </div>
  ),
};

/**
 * RTL — `dir="rtl"`. Logical properties throughout: the name + version line anchor to the
 * inline-start (right), the HealthBadge and LangBadge flip to the inline-end (left). The
 * sparkline is decorative and does not mirror.
 */
export const RTL: Story = {
  args: { variant: 'detailed', sparkSeries: SPARK },
  render: (args) => (
    <div dir="rtl" className="ds-grid cols-2" style={{ maxWidth: 560 }}>
      <ServiceCard {...args} service={IDENTITY} variant="default" />
      <ServiceCard {...args} service={{ ...PIX_ROUTER, alert: true, p95: 89 }} />
    </div>
  ),
};

/**
 * In context — an interactive detailed tile in the service-detail panel. `onOpen` wires the
 * whole tile as one `role="button"` Tab stop (Enter/Space activate); the inner badges, owner
 * pill and avatar group are not separate stops.
 */
export const InContext: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <ServiceCard
        service={{ ...IDENTITY, p95: 142 }}
        contributors={CONTRIBUTORS}
        sparkSeries={SPARK}
        variant="detailed"
        onOpen={() => {}}
      />
    </div>
  ),
};
