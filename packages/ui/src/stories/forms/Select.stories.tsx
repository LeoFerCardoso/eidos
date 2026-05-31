import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Select, Icons } from '@forge/ui';

// ── Realistic demo data ───────────────────────────────────────────────────────

const STATUS_OPTS = [
  { value: 'open',     label: 'Open',        icon: Icons.eye,    description: 'Available for assignment' },
  { value: 'inprog',   label: 'In progress', icon: Icons.zap },
  { value: 'review',   label: 'Review',      icon: Icons.check },
  { value: 'archived', label: 'Archived',    icon: Icons.folder, disabled: true },
];

const TZ_OPTS = [
  { value: 'sao', label: 'São Paulo · GMT−3' },
  { value: 'nyc', label: 'New York · GMT−5'  },
  { value: 'lon', label: 'London · GMT+0'    },
  { value: 'mad', label: 'Madrid · GMT+1'    },
  { value: 'ber', label: 'Berlin · GMT+1'    },
  { value: 'ist', label: 'Istanbul · GMT+3'  },
  { value: 'jak', label: 'Jakarta · GMT+7'   },
  { value: 'syd', label: 'Sydney · GMT+11'   },
];

const TEAM_GROUPS = [
  { label: 'Product', options: [
    { value: 'platform', label: 'Platform engineering', icon: Icons.cpu,     description: '12 members · São Paulo' },
    { value: 'design',   label: 'Design',               icon: Icons.sparkle, description: '8 members · São Paulo + NYC' },
    { value: 'data',     label: 'Data',                 icon: Icons.gauge,   description: '6 members · remote' },
  ]},
  { label: 'Go-to-market', options: [
    { value: 'sales', label: 'Sales',            icon: Icons.trending },
    { value: 'mktg',  label: 'Marketing',        icon: Icons.flame },
    { value: 'cs',    label: 'Customer success', icon: Icons.shield },
  ]},
  { label: 'Operations', options: [
    { value: 'finance', label: 'Finance', icon: Icons.book },
    { value: 'people',  label: 'People',  icon: Icons.user, disabled: true },
  ]},
];

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Forms/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Custom single-value picker from a closed set. Supports leading icons, per-option ' +
          'icons and descriptions, option groups, and an optional typeahead search. ' +
          'Panel uses `position:fixed` to escape parent `overflow:hidden`. ' +
          'Use `NativeSelect` for short lists where system look-and-feel is acceptable.',
      },
    },
  },
  args: {
    options: STATUS_OPTS,
    placeholder: 'Choose a status…',
    size: 'md',
    disabled: false,
    invalid: false,
    searchable: false,
  },
  argTypes: {
    size:      { control: 'radio', options: ['sm', 'md', 'lg'] },
    disabled:  { control: 'boolean' },
    invalid:   { control: 'boolean' },
    searchable: { control: 'boolean' },
    full:      { control: 'boolean' },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Stories ───────────────────────────────────────────────────────────────────

/** Default — click to open, click an option to commit, Escape or click-away to dismiss. */
export const Default: Story = {};

/** Pre-selected value — trigger shows the label and leading icon. */
export const Selected: Story = {
  args: { value: 'open', placeholder: undefined },
};

/** Leading icon on the trigger — use when the field category benefits from a quick visual cue. */
export const WithIcon: Story = {
  args: { value: 'inprog', leadingIcon: Icons.zap, placeholder: undefined },
};

/** Per-option icons and descriptions — use when labels alone are ambiguous. */
export const WithOptionIcons: Story = {
  args: { options: STATUS_OPTS, value: undefined },
};

/** Grouped options — pass `groups` instead of `options` to add labelled clusters. */
export const Grouped: Story = {
  args: { options: undefined, groups: TEAM_GROUPS, placeholder: 'Pick a team' },
};

/** Searchable — renders a filter input above the list.
 *  Recommended when the list has more than ~10 items. */
export const Searchable: Story = {
  args: { options: TZ_OPTS, searchable: true, placeholder: 'Choose a timezone' },
};

/** All three sizes: sm · md · lg — heights match the .btn family (26 / 32 / 40 px). */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 280 }}>
      <Select size="sm" options={STATUS_OPTS} placeholder="Small" />
      <Select           options={STATUS_OPTS} placeholder="Medium (default)" />
      <Select size="lg" options={STATUS_OPTS} placeholder="Large" />
    </div>
  ),
};

/** Invalid state — trigger border and focus ring switch to the danger token. */
export const Invalid: Story = {
  args: { invalid: true, error: 'Status is required.', placeholder: 'Choose a status…' },
};

/** Disabled — trigger is dimmed and non-interactive. */
export const Disabled: Story = {
  args: { value: 'open', disabled: true },
};

/** Right-to-left layout — chevron and value cluster auto-flip via logical CSS. */
export const RTL: Story = {
  render: () => (
    <div dir="rtl" style={{ maxWidth: 320 }}>
      <Select
        options={[
          { value: 'open',   label: 'مفتوح',       icon: Icons.eye,    description: 'متاح للتعيين' },
          { value: 'inprog', label: 'قيد التنفيذ', icon: Icons.zap },
          { value: 'review', label: 'مراجعة',      icon: Icons.check },
        ]}
        placeholder="اختر الحالة"
      />
    </div>
  ),
};

/** Fully interactive demo with local state — label, value, error, and helper text. */
export const InContext: Story = {
  render: () => {
    const [status, setStatus] = React.useState<string | undefined>('open');
    const [tz, setTz] = React.useState<string | undefined>(undefined);
    const [team, setTeam] = React.useState<string | undefined>('platform');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 320 }}>
        <Select
          label="Status"
          value={status}
          onValueChange={setStatus}
          options={STATUS_OPTS}
          help="Pick the work state for this item."
        />
        <Select
          label="Timezone"
          value={tz}
          onValueChange={setTz}
          options={TZ_OPTS}
          searchable
          placeholder="Choose a timezone"
          help="Type to filter all 8 supported zones."
        />
        <Select
          label="Team"
          value={team}
          onValueChange={setTeam}
          groups={TEAM_GROUPS}
          searchable
          placeholder="Pick a team"
        />
      </div>
    );
  },
};
