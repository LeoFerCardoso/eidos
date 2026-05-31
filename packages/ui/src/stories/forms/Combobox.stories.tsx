import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Combobox } from '@forge/ui';

// ── Realistic IDP data ────────────────────────────────────────────────────────

const SERVICES = [
  { value: 'auth',       label: 'auth-service',       meta: 'Go'         },
  { value: 'api-gw',     label: 'api-gateway',         meta: 'Node'       },
  { value: 'billing',    label: 'billing-service',     meta: 'Python'     },
  { value: 'notify',     label: 'notification-svc',   meta: 'Go'         },
  { value: 'search',     label: 'search-service',      meta: 'Rust'       },
  { value: 'ml-infer',   label: 'ml-inference',        meta: 'Python'     },
  { value: 'data-pipe',  label: 'data-pipeline',       meta: 'Spark'      },
  { value: 'cdn',        label: 'cdn-manager',         meta: 'Nginx'      },
  { value: 'vault',      label: 'secrets-vault',       meta: 'Go', disabled: true },
];

const TEAMS = [
  { value: 'platform',   label: 'Platform'            },
  { value: 'frontend',   label: 'Frontend'            },
  { value: 'backend',    label: 'Backend'             },
  { value: 'data',       label: 'Data & ML'           },
  { value: 'security',   label: 'Security'            },
  { value: 'infra',      label: 'Infrastructure'      },
  { value: 'product',    label: 'Product', disabled: true },
];

const GROUPED_REGIONS = [
  {
    label: 'Production',
    options: [
      { value: 'us-east-1',      label: 'us-east-1',      meta: 'N. Virginia'  },
      { value: 'us-west-2',      label: 'us-west-2',      meta: 'Oregon'       },
      { value: 'eu-west-1',      label: 'eu-west-1',      meta: 'Ireland'      },
      { value: 'ap-southeast-1', label: 'ap-southeast-1', meta: 'Singapore'    },
    ],
  },
  {
    label: 'Staging',
    options: [
      { value: 'sa-east-1',      label: 'sa-east-1',      meta: 'São Paulo'    },
      { value: 'ap-southeast-2', label: 'ap-southeast-2', meta: 'Sydney'       },
    ],
  },
  {
    label: 'Development',
    options: [
      { value: 'dev-local',      label: 'dev-local',      meta: 'Local'        },
    ],
  },
];

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Forms/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Searchable single/multi-select with a fixed-position popover panel. ' +
          'Keyboard: arrows navigate, Enter commits, Escape closes. ' +
          'Multi mode shows chips below the trigger. ' +
          'Pass `groups` for grouped options.',
      },
    },
  },
  args: {
    options: SERVICES,
    value: null,
    onValueChange: () => {},
    placeholder: 'Select a service',
    size: 'md',
    disabled: false,
    invalid: false,
    multiple: false,
  },
  argTypes: {
    size:     { control: 'radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    invalid:  { control: 'boolean' },
    multiple: { control: 'boolean' },
    full:     { control: 'boolean' },
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Stories ───────────────────────────────────────────────────────────────────

/** Default single-select — click to open, type to filter, click or Enter to commit.
 *  Wrapped in local state so selecting an option updates the trigger label live. */
export const Default: Story = {
  render: (args) => {
    const [value, setValue] = React.useState<string | null>(null);
    return (
      <Combobox
        {...args}
        value={value}
        onValueChange={(v) => setValue(v as string)}
      />
    );
  },
};

/** Multi-select (pass `multiple`) — each click toggles. Chips render below the trigger;
 *  the trigger label shows the selected count. Disabled options are skipped.
 *  Wrapped in local state so toggling chips updates live. */
export const Multiple: Story = {
  render: (args) => {
    const [value, setValue] = React.useState<string[]>(['platform', 'frontend']);
    return (
      <Combobox
        {...args}
        options={TEAMS}
        value={value}
        onValueChange={(v) => setValue(v as string[])}
        multiple
        placeholder="Choose teams"
      />
    );
  },
};

/** Searchable single-select — the search input is always visible.
 *  Type to filter; arrow keys navigate; Enter commits. */
export const Searchable: Story = {
  args: {
    options: SERVICES,
    value: null,
    multiple: false,
    placeholder: 'Find a service…',
  },
};

/** Grouped options — pass `groups` instead of `options`.
 *  Empty groups hide automatically when the query filters them out. */
export const Grouped: Story = {
  args: {
    options: undefined,
    groups: GROUPED_REGIONS,
    value: null,
    placeholder: 'Pick a region',
    width: '280px',
  },
};

/** Disabled state — trigger is dimmed and non-interactive. */
export const Disabled: Story = {
  args: {
    value: 'auth',
    disabled: true,
  },
};

/** Invalid state — trigger border and focus ring switch to the danger token.
 *  Pair with an `.in-error` helper line below the field in production. */
export const Invalid: Story = {
  args: {
    value: null,
    invalid: true,
    placeholder: 'Service is required',
  },
};

/** Fully interactive demo with local state — try searching, selecting, and
 *  removing chips in both single and multi mode. */
export const Interactive: Story = {
  render: () => {
    const [single, setSingle] = React.useState<string | null>(null);
    const [multi, setMulti] = React.useState<string[]>(['platform', 'data']);
    const [region, setRegion] = React.useState<string | null>(null);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 320 }}>
        <div>
          <div style={{ marginBottom: 6, fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Single select</div>
          <Combobox
            options={SERVICES}
            value={single}
            onChange={(v) => setSingle(v as string)}
            placeholder="Select a service"
            full
          />
        </div>
        <div>
          <div style={{ marginBottom: 6, fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Multi-select</div>
          <Combobox
            options={TEAMS}
            value={multi}
            onChange={(v) => setMulti(v as string[])}
            placeholder="Choose teams"
            multiple
            full
          />
        </div>
        <div>
          <div style={{ marginBottom: 6, fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Grouped regions</div>
          <Combobox
            groups={GROUPED_REGIONS}
            value={region}
            onChange={(v) => setRegion(v as string)}
            placeholder="Pick a region"
            full
          />
        </div>
      </div>
    );
  },
};
