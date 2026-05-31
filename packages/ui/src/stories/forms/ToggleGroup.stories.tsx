import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToggleGroup, ToggleGroupItem } from '@eidos/ui';
import { Icons } from '@eidos/ui';

const meta = {
  title: 'Forms/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A segmented group of toggle buttons. `type="single"` acts as a radio group ' +
          '(one-or-none active, roving tabindex + Arrow keys); `type="multiple"` is a ' +
          'group of independent toggle buttons (Space/Enter each). Supports `ghost` and ' +
          '`outline` variants, three sizes, horizontal/vertical orientation, and is ' +
          'fully direction-aware (logical border-radius mirrors under `dir="rtl"`).',
      },
    },
  },
  args: {
    type: 'single',
    variant: 'default',
    size: 'md',
    orientation: 'horizontal',
    disabled: false,
  },
  argTypes: {
    type: { control: 'inline-radio', options: ['single', 'multiple'] },
    variant: { control: 'inline-radio', options: ['default', 'outline'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => {
    const [view, setView] = React.useState<string | null>('grid');
    return (
      <ToggleGroup
        {...args}
        value={view}
        onValueChange={(v) => setView(v as string | null)}
        aria-label="View mode"
      >
        <ToggleGroupItem value="grid">
          <Icons.grid size={14} /> Grid
        </ToggleGroupItem>
        <ToggleGroupItem value="list">
          <Icons.menu size={14} /> List
        </ToggleGroupItem>
        <ToggleGroupItem value="kanban">
          <Icons.layers size={14} /> Kanban
        </ToggleGroupItem>
      </ToggleGroup>
    );
  },
};

// ── Single mode ───────────────────────────────────────────────────────────────

/** Radio-group semantics: Tab into the group, Arrow keys move and select. */
export const SingleMode: Story = {
  render: () => {
    const [range, setRange] = React.useState<string | null>('week');
    return (
      <ToggleGroup
        type="single"
        value={range}
        onValueChange={(v) => setRange(v as string | null)}
        aria-label="Date range"
      >
        <ToggleGroupItem value="day">Day</ToggleGroupItem>
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
        <ToggleGroupItem value="month">Month</ToggleGroupItem>
        <ToggleGroupItem value="year">Year</ToggleGroupItem>
      </ToggleGroup>
    );
  },
};

// ── Multiple mode ─────────────────────────────────────────────────────────────

/** Independent toggle buttons — text-formatting bar. */
export const MultipleMode: Story = {
  render: () => {
    const [marks, setMarks] = React.useState<string[]>(['bold']);
    return (
      <ToggleGroup
        type="multiple"
        value={marks}
        onValueChange={(v) => setMarks(v as string[])}
        aria-label="Text formatting"
      >
        <ToggleGroupItem value="bold" aria-label="Bold">
          <Icons.bold size={14} />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <Icons.italic size={14} />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <Icons.underline size={14} />
        </ToggleGroupItem>
      </ToggleGroup>
    );
  },
};

// ── Outline variant ───────────────────────────────────────────────────────────

/** Joined border seams — useful on busy surfaces. */
export const OutlineVariant: Story = {
  render: () => {
    const [v, setV] = React.useState<string | null>('week');
    return (
      <ToggleGroup
        type="single"
        variant="outline"
        value={v}
        onValueChange={(val) => setV(val as string | null)}
        aria-label="Date range"
      >
        <ToggleGroupItem value="day">Day</ToggleGroupItem>
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
        <ToggleGroupItem value="month">Month</ToggleGroupItem>
        <ToggleGroupItem value="year">Year</ToggleGroupItem>
      </ToggleGroup>
    );
  },
};

// ── Sizes ─────────────────────────────────────────────────────────────────────

/** All three sizes — sm 24px / md 30px / lg 36px. */
export const Sizes: Story = {
  render: () => {
    const [v, setV] = React.useState<string | null>('b');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <div key={size} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)', width: 28 }}>{size}</code>
            <ToggleGroup
              type="single"
              size={size}
              value={v}
              onValueChange={(val) => setV(val as string | null)}
              aria-label={`Size ${size}`}
            >
              <ToggleGroupItem value="a">A</ToggleGroupItem>
              <ToggleGroupItem value="b">B</ToggleGroupItem>
              <ToggleGroupItem value="c">C</ToggleGroupItem>
            </ToggleGroup>
          </div>
        ))}
      </div>
    );
  },
};

// ── Vertical orientation ──────────────────────────────────────────────────────

/** Stacked — for sidebars and tool palettes. */
export const Vertical: Story = {
  render: () => {
    const [v, setV] = React.useState<string | null>('week');
    return (
      <ToggleGroup
        type="single"
        orientation="vertical"
        variant="outline"
        value={v}
        onValueChange={(val) => setV(val as string | null)}
        aria-label="Date range"
      >
        <ToggleGroupItem value="day">Day</ToggleGroupItem>
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
        <ToggleGroupItem value="month">Month</ToggleGroupItem>
        <ToggleGroupItem value="year">Year</ToggleGroupItem>
      </ToggleGroup>
    );
  },
};

// ── Disabled states ───────────────────────────────────────────────────────────

/** Group-level and per-item disabled. */
export const DisabledStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
      <ToggleGroup
        type="single"
        disabled
        defaultValue="a"
        aria-label="All disabled"
      >
        <ToggleGroupItem value="a">Available</ToggleGroupItem>
        <ToggleGroupItem value="b">Pro</ToggleGroupItem>
        <ToggleGroupItem value="c">Enterprise</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup
        type="single"
        defaultValue="a"
        aria-label="Per-item disabled"
      >
        <ToggleGroupItem value="a">Available</ToggleGroupItem>
        <ToggleGroupItem value="b" disabled>Pro only</ToggleGroupItem>
        <ToggleGroupItem value="c" disabled>Enterprise</ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
};

// ── Filter chips ──────────────────────────────────────────────────────────────

/** Multiple + outline — status filter bar. */
export const FilterChips: Story = {
  render: () => {
    const [statuses, setStatuses] = React.useState<string[]>(['active']);
    return (
      <ToggleGroup
        type="multiple"
        variant="outline"
        value={statuses}
        onValueChange={(v) => setStatuses(v as string[])}
        aria-label="Status filter"
      >
        <ToggleGroupItem value="active">Active</ToggleGroupItem>
        <ToggleGroupItem value="pending">Pending</ToggleGroupItem>
        <ToggleGroupItem value="paused">Paused</ToggleGroupItem>
        <ToggleGroupItem value="archived">Archived</ToggleGroupItem>
      </ToggleGroup>
    );
  },
};

// ── Alignment icon-only ───────────────────────────────────────────────────────

/** Icon-only items — each must carry aria-label. */
export const AlignmentIconOnly: Story = {
  render: () => {
    const [align, setAlign] = React.useState<string | null>('left');
    return (
      <ToggleGroup
        type="single"
        value={align}
        onValueChange={(v) => setAlign(v as string | null)}
        aria-label="Text alignment"
      >
        <ToggleGroupItem value="left" aria-label="Align left">
          <Icons.alignLeft size={14} />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <Icons.alignCenter size={14} />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <Icons.alignRight size={14} />
        </ToggleGroupItem>
        <ToggleGroupItem value="justify" aria-label="Justify">
          <Icons.alignJustify size={14} />
        </ToggleGroupItem>
      </ToggleGroup>
    );
  },
};

// ── RTL ───────────────────────────────────────────────────────────────────────

/** Right-to-left: logical border-radius mirrors the group naturally. */
export const RTL: Story = {
  render: () => {
    const [v, setV] = React.useState<string | null>('grid');
    return (
      <div dir="rtl">
        <ToggleGroup
          type="single"
          variant="outline"
          value={v}
          onValueChange={(val) => setV(val as string | null)}
          aria-label="عرض"
        >
          <ToggleGroupItem value="grid">
            <Icons.grid size={14} /> شبكة
          </ToggleGroupItem>
          <ToggleGroupItem value="list">
            <Icons.menu size={14} /> قائمة
          </ToggleGroupItem>
          <ToggleGroupItem value="kanban">
            <Icons.layers size={14} /> كانبان
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    );
  },
};

// ── In context ────────────────────────────────────────────────────────────────

/** Realistic toolbar composition — view switcher + text formatting. */
export const InContext: Story = {
  render: () => {
    const [view, setView] = React.useState<string | null>('grid');
    const [marks, setMarks] = React.useState<string[]>(['bold']);
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 16px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 8,
        }}
      >
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(v) => setView(v as string | null)}
          aria-label="View mode"
        >
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <Icons.grid size={14} />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <Icons.menu size={14} />
          </ToggleGroupItem>
        </ToggleGroup>
        <span style={{ width: 1, height: 20, background: 'var(--border)' }} />
        <ToggleGroup
          type="multiple"
          value={marks}
          onValueChange={(v) => setMarks(v as string[])}
          aria-label="Text formatting"
        >
          <ToggleGroupItem value="bold" aria-label="Bold">
            <Icons.bold size={14} />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            <Icons.italic size={14} />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline">
            <Icons.underline size={14} />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    );
  },
};
