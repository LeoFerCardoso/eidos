import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  Checkbox,
} from '@eidos/ui';

// ── Shared sample data ────────────────────────────────────────────────────────

const SERVICES = [
  { id: 's1', name: 'identity-svc',    tier: 'T1', lang: 'Go',         p95: 142, coverage: 94 },
  { id: 's2', name: 'pix-router',      tier: 'T2', lang: 'TypeScript',  p95: 89,  coverage: 87 },
  { id: 's3', name: 'fraud-engine',    tier: 'T1', lang: 'Python',      p95: 312, coverage: 82 },
  { id: 's4', name: 'bureau-gateway',  tier: 'T1', lang: 'Go',          p95: 218, coverage: 91 },
  { id: 's5', name: 'ledger-svc',      tier: 'T2', lang: 'Rust',        p95: 24,  coverage: 97 },
];

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Primitives/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Semantic HTML table primitive over the .tbl CSS layer. ' +
          'Compound API: Table · TableHeader · TableBody · TableFooter · ' +
          'TableRow · TableHead · TableCell · TableCaption. ' +
          'Density, zebra stripes, sticky headers, row status, and ' +
          'sortable columns via aria-sort + arrow glyph. RTL-aware via logical CSS.',
      },
    },
  },
  argTypes: {
    density: { control: 'inline-radio', options: [undefined, 'comfortable', 'compact'] },
    zebra: { control: 'boolean' },
    stickyHeader: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  args: {
    fullWidth: true,
    zebra: false,
    stickyHeader: false,
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <Table {...args} aria-label="Services">
      <TableCaption>Service health overview</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Service</TableHead>
          <TableHead>Tier</TableHead>
          <TableHead>Language</TableHead>
          <TableHead align="end">p95</TableHead>
          <TableHead align="end">Coverage</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {SERVICES.map((s) => (
          <TableRow key={s.id}>
            <TableCell style={{ fontWeight: 500 }}>{s.name}</TableCell>
            <TableCell>{s.tier}</TableCell>
            <TableCell>{s.lang}</TableCell>
            <TableCell align="end" style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>{s.p95}ms</TableCell>
            <TableCell align="end" style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>{s.coverage}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

// ── Density variants ──────────────────────────────────────────────────────────

export const Density: Story = {
  render: () => {
    const rows = SERVICES.slice(0, 3);
    const SimpleTable = ({ density, label }: { density?: 'comfortable' | 'compact'; label: string }) => (
      <div>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fg-faint)', marginBottom: 8 }}>{label}</div>
        <Table density={density} fullWidth>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead align="end">p95</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((s) => (
              <TableRow key={s.id}>
                <TableCell style={{ fontWeight: 500 }}>{s.name}</TableCell>
                <TableCell>{s.tier}</TableCell>
                <TableCell align="end" style={{ fontFamily: 'var(--font-mono)' }}>{s.p95}ms</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <SimpleTable density="compact"     label="compact — 6/10 px · ops dashboards" />
        <SimpleTable density={undefined}   label="default — 10/12 px · standard lists" />
        <SimpleTable density="comfortable" label="comfortable — 14/16 px · audit / billing" />
      </div>
    );
  },
};

// ── Sortable headers ──────────────────────────────────────────────────────────

export const Sortable: Story = {
  render: () => {
    const [sort, setSort] = React.useState<{ key: keyof typeof SERVICES[0]; dir: 'asc' | 'desc' }>({ key: 'p95', dir: 'asc' });

    const toggle = (key: keyof typeof SERVICES[0]) => () => {
      setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));
    };

    const sorted = [...SERVICES].sort((a, b) => {
      const va = a[sort.key];
      const vb = b[sort.key];
      const cmp = typeof va === 'number' ? (va as number) - (vb as number) : String(va).localeCompare(String(vb));
      return sort.dir === 'asc' ? cmp : -cmp;
    });

    const dir = (key: keyof typeof SERVICES[0]) =>
      sort.key === key ? sort.dir : ('none' as const);

    return (
      <Table fullWidth aria-label="Services — sortable">
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection={dir('name')}     onSort={toggle('name')}>Service</TableHead>
            <TableHead sortable sortDirection={dir('tier')}     onSort={toggle('tier')}>Tier</TableHead>
            <TableHead sortable sortDirection={dir('lang')}     onSort={toggle('lang')}>Language</TableHead>
            <TableHead sortable sortDirection={dir('p95')}      onSort={toggle('p95')}      align="end">p95</TableHead>
            <TableHead sortable sortDirection={dir('coverage')} onSort={toggle('coverage')} align="end">Coverage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((s) => (
            <TableRow key={s.id}>
              <TableCell style={{ fontWeight: 500 }}>{s.name}</TableCell>
              <TableCell>{s.tier}</TableCell>
              <TableCell>{s.lang}</TableCell>
              <TableCell align="end" style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>{s.p95}ms</TableCell>
              <TableCell align="end" style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>{s.coverage}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
};

// ── Row status (warn / danger) ────────────────────────────────────────────────

export const RowStatus: Story = {
  render: () => (
    <Table fullWidth aria-label="Services with status">
      <TableHeader>
        <TableRow>
          <TableHead>Service</TableHead>
          <TableHead>Tier</TableHead>
          <TableHead>Status</TableHead>
          <TableHead align="end">p95</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell style={{ fontWeight: 500 }}>identity-svc</TableCell>
          <TableCell>T1</TableCell>
          <TableCell style={{ color: 'var(--success)' }}>Healthy</TableCell>
          <TableCell align="end" style={{ fontFamily: 'var(--font-mono)' }}>142ms</TableCell>
        </TableRow>
        <TableRow status="warn">
          <TableCell style={{ fontWeight: 500 }}>fraud-engine</TableCell>
          <TableCell>T1</TableCell>
          <TableCell style={{ color: 'var(--warning)' }}>Degraded</TableCell>
          <TableCell align="end" style={{ fontFamily: 'var(--font-mono)', color: 'var(--warning)' }}>312ms</TableCell>
        </TableRow>
        <TableRow status="danger">
          <TableCell style={{ fontWeight: 500 }}>bureau-gateway</TableCell>
          <TableCell>T1</TableCell>
          <TableCell style={{ color: 'var(--danger)' }}>Failing</TableCell>
          <TableCell align="end" style={{ fontFamily: 'var(--font-mono)', color: 'var(--danger)' }}>2100ms</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ fontWeight: 500 }}>ledger-svc</TableCell>
          <TableCell>T2</TableCell>
          <TableCell style={{ color: 'var(--success)' }}>Healthy</TableCell>
          <TableCell align="end" style={{ fontFamily: 'var(--font-mono)' }}>24ms</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

// ── Selection ─────────────────────────────────────────────────────────────────

export const Selected: Story = {
  render: () => {
    const [sel, setSel] = React.useState(new Set(['s2', 's4']));

    const toggle = (id: string) => () => {
      setSel((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    };

    return (
      <Table fullWidth aria-label="Services — selectable">
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: 40 }}>Sel</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead align="end">p95</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {SERVICES.map((s) => (
            <TableRow
              key={s.id}
              selected={sel.has(s.id)}
              onClick={toggle(s.id)}
              style={{ cursor: 'pointer' }}
              aria-selected={sel.has(s.id)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={sel.has(s.id)}
                  onChange={toggle(s.id)}
                  aria-label={`Select ${s.name}`}
                />
              </TableCell>
              <TableCell style={{ fontWeight: 500 }}>{s.name}</TableCell>
              <TableCell>{s.tier}</TableCell>
              <TableCell align="end" style={{ fontFamily: 'var(--font-mono)' }}>{s.p95}ms</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
};

// ── Zebra stripes ─────────────────────────────────────────────────────────────

export const Zebra: Story = {
  render: () => (
    <Table fullWidth zebra aria-label="Services — striped">
      <TableHeader>
        <TableRow>
          <TableHead>Service</TableHead>
          <TableHead>Tier</TableHead>
          <TableHead align="end">p95</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {SERVICES.map((s) => (
          <TableRow key={s.id}>
            <TableCell style={{ fontWeight: 500 }}>{s.name}</TableCell>
            <TableCell>{s.tier}</TableCell>
            <TableCell align="end" style={{ fontFamily: 'var(--font-mono)' }}>{s.p95}ms</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

// ── With footer ───────────────────────────────────────────────────────────────

export const WithFooter: Story = {
  render: () => {
    const avgP95 = Math.round(SERVICES.reduce((s, r) => s + r.p95, 0) / SERVICES.length);
    const avgCov = Math.round(SERVICES.reduce((s, r) => s + r.coverage, 0) / SERVICES.length);
    return (
      <Table fullWidth aria-label="Services with summary footer">
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead align="end">p95</TableHead>
            <TableHead align="end">Coverage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {SERVICES.map((s) => (
            <TableRow key={s.id}>
              <TableCell style={{ fontWeight: 500 }}>{s.name}</TableCell>
              <TableCell>{s.tier}</TableCell>
              <TableCell align="end" style={{ fontFamily: 'var(--font-mono)' }}>{s.p95}ms</TableCell>
              <TableCell align="end" style={{ fontFamily: 'var(--font-mono)' }}>{s.coverage}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2} style={{ fontWeight: 600, color: 'var(--fg-subtle)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>Averages</TableCell>
            <TableCell align="end" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{avgP95}ms</TableCell>
            <TableCell align="end" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{avgCov}%</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );
  },
};

// ── RTL ───────────────────────────────────────────────────────────────────────

export const RTL: Story = {
  render: () => (
    <div dir="rtl">
      <Table fullWidth aria-label="الخدمات">
        <TableCaption>نظرة عامة على صحة الخدمة</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>الخدمة</TableHead>
            <TableHead>الفئة</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead align="end">p95</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell style={{ fontWeight: 500 }}>identity-svc</TableCell>
            <TableCell>T1</TableCell>
            <TableCell style={{ color: 'var(--success)' }}>سليم</TableCell>
            <TableCell align="end" style={{ fontFamily: 'var(--font-mono)' }}>١٤٢ مللي</TableCell>
          </TableRow>
          <TableRow status="warn">
            <TableCell style={{ fontWeight: 500 }}>fraud-engine</TableCell>
            <TableCell>T1</TableCell>
            <TableCell style={{ color: 'var(--warning)' }}>متدهور</TableCell>
            <TableCell align="end" style={{ fontFamily: 'var(--font-mono)', color: 'var(--warning)' }}>٣١٢ مللي</TableCell>
          </TableRow>
          <TableRow status="danger">
            <TableCell style={{ fontWeight: 500 }}>bureau-gateway</TableCell>
            <TableCell>T1</TableCell>
            <TableCell style={{ color: 'var(--danger)' }}>فاشل</TableCell>
            <TableCell align="end" style={{ fontFamily: 'var(--font-mono)', color: 'var(--danger)' }}>٢١٠٠ مللي</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};

// ── In context — combined (sort + select) ─────────────────────────────────────

export const InContext: Story = {
  render: () => {
    const [sort, setSort] = React.useState<{ key: keyof typeof SERVICES[0]; dir: 'asc' | 'desc' }>({ key: 'name', dir: 'asc' });
    const [sel, setSel] = React.useState(new Set<string>());

    const toggleRow = (id: string) => () =>
      setSel((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });

    const toggleAll = () =>
      setSel(sel.size === SERVICES.length ? new Set() : new Set(SERVICES.map((s) => s.id)));

    const allOn  = sel.size === SERVICES.length;
    const someOn = sel.size > 0 && !allOn;

    const toggleSort = (key: keyof typeof SERVICES[0]) => () =>
      setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));

    const dir = (key: keyof typeof SERVICES[0]) =>
      sort.key === key ? sort.dir : ('none' as const);

    const rows = [...SERVICES].sort((a, b) => {
      const va = a[sort.key];
      const vb = b[sort.key];
      const cmp = typeof va === 'number' ? (va as number) - (vb as number) : String(va).localeCompare(String(vb));
      return sort.dir === 'asc' ? cmp : -cmp;
    });

    return (
      <div>
        {sel.size > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 12px',
            background: 'var(--ember-soft)',
            border: '1px solid rgba(255,107,53,0.35)',
            borderBottom: 'none',
            borderRadius: '8px 8px 0 0',
          }}>
            <span style={{ color: 'var(--ember)', fontWeight: 600, fontSize: 13 }}>{sel.size} selected</span>
            <span style={{ width: 1, height: 16, background: 'rgba(255,107,53,0.3)' }} />
            <button className="btn ghost" style={{ height: 26, padding: '0 8px', fontSize: 12 }}>Tag</button>
            <button className="btn ghost" style={{ height: 26, padding: '0 8px', fontSize: 12, color: 'var(--danger)' }}>Archive</button>
            <button
              onClick={() => setSel(new Set())}
              style={{ marginInlineStart: 'auto', border: 0, background: 'transparent', color: 'var(--fg-muted)', fontSize: 12, cursor: 'pointer', padding: '4px 8px', borderRadius: 4 }}
            >
              Clear
            </button>
          </div>
        )}
        <Table
          fullWidth
          aria-label="Services — search, sort, select"
          style={sel.size > 0 ? { borderRadius: '0 0 8px 8px' } : undefined}
        >
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: 40 }}>
                <Checkbox
                  checked={allOn}
                  indeterminate={someOn}
                  onChange={toggleAll}
                  aria-label="Select all rows"
                />
              </TableHead>
              <TableHead sortable sortDirection={dir('name')} onSort={toggleSort('name')}>Service</TableHead>
              <TableHead sortable sortDirection={dir('tier')} onSort={toggleSort('tier')}>Tier</TableHead>
              <TableHead sortable sortDirection={dir('lang')} onSort={toggleSort('lang')}>Language</TableHead>
              <TableHead sortable sortDirection={dir('p95')} onSort={toggleSort('p95')} align="end">p95</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((s) => (
              <TableRow key={s.id} selected={sel.has(s.id)} onClick={toggleRow(s.id)} style={{ cursor: 'pointer' }}>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={sel.has(s.id)}
                    onChange={toggleRow(s.id)}
                    aria-label={`Select ${s.name}`}
                  />
                </TableCell>
                <TableCell style={{ fontWeight: 500 }}>{s.name}</TableCell>
                <TableCell>{s.tier}</TableCell>
                <TableCell>{s.lang}</TableCell>
                <TableCell align="end" style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>{s.p95}ms</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  },
};
