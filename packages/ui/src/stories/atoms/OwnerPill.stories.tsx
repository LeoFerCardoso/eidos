import type { Meta, StoryObj } from '@storybook/react-vite';
import { OwnerPill, MOCKS } from '@eidos/ui';

const PEOPLE = MOCKS.PEOPLE;

const meta = {
  title: 'Primitives/OwnerPill',
  component: OwnerPill,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Avatar + name inline tag for ownership rows — service catalog, PR reviewers, incident commanders. ' +
          'Truncates long names with ellipsis; the optional `role` prop appends a muted label.',
      },
    },
  },
  args: {
    person: PEOPLE[0],
    role: PEOPLE[0].role,
    ember: false,
  },
  argTypes: {
    role: { control: 'text', description: 'Role label appended after the name in muted weight.' },
    ember: { control: 'boolean', description: 'Ember-tinted avatar (incident commander accent).' },
  },
} satisfies Meta<typeof OwnerPill>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — name + role. */
export const Default: Story = {};

/** Without role — compact, name only. */
export const NameOnly: Story = {
  args: { person: PEOPLE[1], role: undefined },
};

/** Ember-tinted — for incident commanders. */
export const Ember: Story = {
  args: { person: PEOPLE[0], role: 'Incident Commander', ember: true },
};

/** Null guard — renders nothing when person is undefined. */
export const Empty: Story = {
  args: { person: undefined },
};

/** Team ownership list. */
export const AllPeople: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {PEOPLE.map((p) => (
        <OwnerPill key={p.initials} person={p} role={p.role} />
      ))}
    </div>
  ),
};

/** In a service detail card — owner row + commander row. */
export const InContext: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: 16,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        maxWidth: 320,
      }}
    >
      {[
        { label: 'Owner', person: PEOPLE[2], role: 'Tech Lead · Pix' },
        { label: 'Commander', person: PEOPLE[7], role: 'Incident Commander', ember: true },
        { label: 'Reviewer', person: PEOPLE[3] },
      ].map(({ label, person, role, ember = false }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{label}</span>
          <OwnerPill person={person} role={role} ember={ember} />
        </div>
      ))}
    </div>
  ),
};
