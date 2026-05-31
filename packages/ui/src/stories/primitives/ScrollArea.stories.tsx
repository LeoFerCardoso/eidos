import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollArea } from '@forge/ui';

const meta = {
  title: 'Primitives/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A bounded scrollable region with thin, auto-hiding, themeable scrollbars. ' +
          'Uses native browser scroll — no custom DOM track/thumb nodes. ' +
          'Keyboard-scrollable when `focusable` is true; RTL-correct via logical CSS.',
      },
    },
  },
  args: {
    orientation: 'vertical',
    type: 'hover',
    maxHeight: '220px',
    label: 'Item list',
    focusable: true,
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal', 'both'] },
    type: { control: 'inline-radio', options: ['hover', 'always', 'auto'] },
    maxHeight: { control: 'text' },
    maxWidth: { control: 'text' },
    label: { control: 'text' },
    focusable: { control: 'boolean' },
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Helpers ───────────────────────────────────────────────────────────────────

const Row = ({ n }: { n: number }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 0',
      borderBottom: n < 23 ? '1px solid var(--border)' : 'none',
      fontSize: 'var(--text-base)',
      color: 'var(--fg-muted)',
    }}
  >
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        color: 'var(--fg-faint)',
        flexShrink: 0,
      }}
    >
      #{String(n + 1).padStart(2, '0')}
    </span>
    <span>Service event — region us-east-1</span>
  </div>
);

// ── Stories ───────────────────────────────────────────────────────────────────

/** Vertical scroll — the most common use-case. */
export const Default: Story = {
  args: {
    maxHeight: '220px',
    style: {
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      padding: '0 12px',
      background: 'var(--surface)',
    },
  },
  render: (args) => (
    <ScrollArea {...args}>
      {Array.from({ length: 24 }, (_, i) => (
        <Row key={i} n={i} />
      ))}
    </ScrollArea>
  ),
};

/** Scrollbar is always visible — for content where discoverability matters. */
export const AlwaysVisible: Story = {
  args: {
    type: 'always',
    maxHeight: '220px',
    label: 'Pipeline log',
    style: {
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      padding: '0 12px',
      background: 'var(--surface)',
    },
  },
  render: (args) => (
    <ScrollArea {...args}>
      {Array.from({ length: 24 }, (_, i) => (
        <Row key={i} n={i} />
      ))}
    </ScrollArea>
  ),
};

/** Horizontal scroll — for wide rows (tables, card carousels). */
export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    maxHeight: undefined,
    maxWidth: '100%',
    label: 'Edge nodes',
    style: {
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      padding: '12px',
      background: 'var(--surface)',
    },
  },
  render: (args) => (
    <ScrollArea {...args}>
      <div style={{ display: 'flex', gap: 10, paddingInlineEnd: 4 }}>
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            style={{
              minWidth: 160,
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              padding: 10,
              fontSize: 'var(--text-sm)',
              color: 'var(--fg-muted)',
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--fg)' }}>edge-{i + 1}</div>
            <div>us-east-1</div>
            <div
              className="pill"
              style={{ marginTop: 6 }}
            >
              Healthy
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

/** Both axes — useful for large data grids or maps. */
export const Both: Story = {
  args: {
    orientation: 'both',
    maxHeight: '200px',
    maxWidth: '340px',
    label: 'Data grid',
    style: {
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      padding: '8px',
      background: 'var(--surface)',
    },
  },
  render: (args) => (
    <ScrollArea {...args}>
      <div style={{ minWidth: 600 }}>
        {Array.from({ length: 18 }, (_, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 24,
              padding: '6px 0',
              borderBottom: i < 17 ? '1px solid var(--border)' : 'none',
              fontSize: 'var(--text-sm)',
              color: 'var(--fg-muted)',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ width: 80, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-faint)' }}>
              row-{String(i + 1).padStart(3, '0')}
            </span>
            <span>service-{i + 1}</span>
            <span>us-east-{(i % 3) + 1}</span>
            <span>Healthy</span>
            <span>99.{90 + (i % 9)}%</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

/** RTL — scrollbar moves to the inline-start edge (left in RTL). */
export const RTL: Story = {
  args: {
    maxHeight: '220px',
    label: 'سجل الأحداث',
    style: {
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      padding: '0 12px',
      background: 'var(--surface)',
    },
  },
  render: (args) => (
    <div dir="rtl">
      <ScrollArea {...args}>
        {Array.from({ length: 24 }, (_, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 0',
              borderBottom: i < 23 ? '1px solid var(--border)' : 'none',
              fontSize: 'var(--text-base)',
              color: 'var(--fg-muted)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: 'var(--fg-faint)',
                flexShrink: 0,
              }}
            >
              #{String(i + 1).padStart(2, '0')}
            </span>
            <span>حدث خدمة — المنطقة us-east-1</span>
          </div>
        ))}
      </ScrollArea>
    </div>
  ),
};

/** In context — a filter sidebar panel with a fixed height scroll area. */
export const InContext: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        background: 'var(--surface)',
        width: 320,
      }}
    >
      <div
        style={{
          padding: '14px 16px',
          borderInlineEnd: '1px solid var(--border)',
          flex: '0 0 200px',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--fg-faint)',
            marginBottom: 10,
          }}
        >
          Filters
        </div>
        <ScrollArea maxHeight="240px" label="Filter list" style={{ paddingInlineEnd: 4 }}>
          {[
            'All services',
            'Healthy',
            'Degraded',
            'Down',
            'Region: us-east-1',
            'Region: us-west-2',
            'Region: eu-central-1',
            'Tier: T1',
            'Tier: T2',
            'Tier: T3',
            'On-call active',
            'No incidents',
          ].map((item, i) => (
            <div
              key={i}
              style={{
                padding: '7px 0',
                fontSize: 'var(--text-sm)',
                color: i === 0 ? 'var(--fg)' : 'var(--fg-muted)',
                cursor: 'pointer',
                fontWeight: i === 0 ? 500 : 400,
              }}
            >
              {item}
            </div>
          ))}
        </ScrollArea>
      </div>
      <div style={{ padding: '14px 16px', flex: 1 }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--fg-faint)',
            marginBottom: 10,
          }}
        >
          Results
        </div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>
          Showing 3 of 12 services
        </div>
      </div>
    </div>
  ),
};
