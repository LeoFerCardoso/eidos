import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  DataTable, HealthBadge, TierBadge, LangBadge, OwnerPill, SeverityPill,
  Sparkline, Trend, CopyChip, RelativeTime, Pipeline, Icons, MOCKS,
} from '@forge/ui';

// ──────────────────────────────────────────────────────────────────────────
// The bound DataTableColumn type only types `align` as the physical
// 'left' | 'center' | 'right'. The component applies `align` raw as
// `textAlign`, so the logical 'start' | 'end' values (which mirror under RTL)
// are valid at runtime. `cols()` casts a column array to `any[]` so the page's
// logical-alignment discipline (`align: 'end'`) is accepted without widening
// the core type — mirrors the doc page's own helper.
// ──────────────────────────────────────────────────────────────────────────
const cols = (c: any[]) => c;

const services = MOCKS.SERVICES;
const deploys = MOCKS.DEPLOYS;
const people = MOCKS.PEOPLE;
const matchPerson = (tribe: string) =>
  people.find((p) => p.role && p.role.includes(tribe)) || people[0];

// ──────────────────────────────────────────────────────────────────────────
// Service-catalog columns — each cell composes an existing primitive
// (TierBadge / LangBadge / HealthBadge / OwnerPill) so a status reads
// identically in a table as anywhere else on the platform. Numerics use the
// LOGICAL `align: 'end'` so they mirror correctly under RTL.
// ──────────────────────────────────────────────────────────────────────────
const SERVICE_COLUMNS = cols([
  { id: 'name', label: 'Service', sortable: true, width: '22%',
    render: (r: typeof MOCKS.SERVICES[number]) => (
      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg)' }}>{r.name}</span>
    ),
  },
  { id: 'tier', label: 'Tier', sortable: true, render: (r: typeof MOCKS.SERVICES[number]) => <TierBadge tier={r.tier} /> },
  { id: 'lang', label: 'Language', sortable: true, render: (r: typeof MOCKS.SERVICES[number]) => <LangBadge lang={r.lang} /> },
  { id: 'owner', label: 'Owner', render: (r: typeof MOCKS.SERVICES[number]) => <OwnerPill person={matchPerson(r.tribe)} role={r.tribe} /> },
  { id: 'health', label: 'Health', render: (r: typeof MOCKS.SERVICES[number]) => <HealthBadge state={r.alert ? 'degraded' : 'up'} pulse={r.alert} /> },
  { id: 'p95', label: 'p95 (ms)', sortable: true, align: 'end',
    render: (r: typeof MOCKS.SERVICES[number]) => (
      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-subtle)' }}>{r.p95}</span>
    ),
  },
  { id: 'coverage', label: 'Cov %', sortable: true, align: 'end',
    render: (r: typeof MOCKS.SERVICES[number]) => (
      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-subtle)' }}>{r.coverage}</span>
    ),
  },
  { id: 'open', label: '', align: 'end', width: 32, render: () => <Icons.chevronRight size={12} /> },
]);

const meta = {
  title: 'Blocks/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A dense, sortable-ready data table that composes existing primitives in every cell. ' +
          'Uppercase mono headers; rows opt into click-through, sticky headers, and column sort. ' +
          'Sort state is fully caller-controlled via `sort` + `onSort`; the table only paints the ' +
          'active chevron, sets `aria-sort`, and renders a built-in Empty state when `rows` is empty. ' +
          'Cells align with the LOGICAL `align: "end"` so numerics mirror under RTL.',
      },
    },
  },
  args: {
    columns: SERVICE_COLUMNS,
    rows: services.slice(0, 8),
    dense: false,
    sticky: false,
  },
  argTypes: {
    dense: { control: 'boolean' },
    sticky: { control: 'boolean' },
  },
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Service catalog — every cell composes a primitive (TierBadge, LangBadge, HealthBadge, OwnerPill, Sparkline). */
export const Default: Story = {};

/** Dense mode — tighter row padding (6px vs 10px) for information-dense lists. */
export const Dense: Story = {
  args: { dense: true },
};

/** Clickable rows — passing onRowClick makes each row focusable and activatable with Enter/Space; a trailing chevron signals navigation. */
export const ClickableRows: Story = {
  render: () => (
    <DataTable
      columns={SERVICE_COLUMNS}
      rows={services.slice(0, 6)}
      onRowClick={(row) => window.alert(`Opened: ${row.name}`)}
    />
  ),
};

/** Controlled sort — clicking a sortable header calls onSort; the parent owns the sort state and re-renders with the new order. */
export const Sortable: Story = {
  render: () => {
    const [sort, setSort] = React.useState<{ col: string; dir: 'asc' | 'desc' }>({ col: 'p95', dir: 'asc' });
    const rows = [...services].sort((a, b) => {
      const av = a[sort.col as keyof typeof a], bv = b[sort.col as keyof typeof b];
      const cmp = typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sort.dir === 'asc' ? cmp : -cmp;
    });
    return (
      <DataTable
        columns={SERVICE_COLUMNS}
        rows={rows.slice(0, 10)}
        sort={sort}
        onSort={(col) => setSort((prev) => ({ col, dir: prev.col === col && prev.dir === 'asc' ? 'desc' : 'asc' }))}
      />
    );
  },
};

/** Sortable + sticky + dense inside a scroll container — the active column label stays pinned while sorting a long list. */
export const StickyDense: Story = {
  render: () => {
    const [sort, setSort] = React.useState<{ col: string; dir: 'asc' | 'desc' }>({ col: 'p95', dir: 'asc' });
    const rows = [...services].sort((a, b) => {
      const av = a[sort.col as keyof typeof a], bv = b[sort.col as keyof typeof b];
      const cmp = typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sort.dir === 'asc' ? cmp : -cmp;
    });
    return (
      <div style={{ maxHeight: 260, overflow: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)' }}>
        <DataTable
          sticky
          dense
          sort={sort}
          onSort={(col) => setSort((prev) => ({ col, dir: prev.col === col && prev.dir === 'asc' ? 'desc' : 'asc' }))}
          rows={rows}
          columns={cols([
            { id: 'name', label: 'Service', sortable: true, render: (r: typeof MOCKS.SERVICES[number]) => <span style={{ fontFamily: 'var(--font-mono)' }}>{r.name}</span> },
            { id: 'tier', label: 'Tier', sortable: true, render: (r: typeof MOCKS.SERVICES[number]) => <TierBadge tier={r.tier} /> },
            { id: 'p95', label: 'p95 (ms)', sortable: true, align: 'end', render: (r: typeof MOCKS.SERVICES[number]) => <span style={{ fontFamily: 'var(--font-mono)' }}>{r.p95}</span> },
            { id: 'coverage', label: 'Cov %', sortable: true, align: 'end', render: (r: typeof MOCKS.SERVICES[number]) => <span style={{ fontFamily: 'var(--font-mono)' }}>{r.coverage}</span> },
          ])}
        />
      </div>
    );
  },
};

/** Empty state — rows=[] renders the embedded Empty primitive (real text, announced to screen readers) rather than a blank body. */
export const Empty: Story = {
  args: { rows: [] },
};

/** Deploy queue — composes Pipeline + StatusDot/HealthBadge inline; the progress column uses logical `align: 'end'`. */
export const Deploys: Story = {
  render: () => (
    <DataTable
      rows={deploys}
      columns={cols([
        { id: 'id', label: 'Deploy', render: (r: typeof MOCKS.DEPLOYS[number]) => <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg)' }}>{r.id}</span> },
        { id: 'service', label: 'Service', render: (r: typeof MOCKS.DEPLOYS[number]) => <span style={{ color: 'var(--fg-subtle)' }}>{r.service}</span> },
        { id: 'pipeline', label: 'Pipeline', render: (r: typeof MOCKS.DEPLOYS[number]) => (
          <Pipeline compact steps={[
            { label: 'Build', status: r.stages.build },
            { label: 'Test', status: r.stages.test },
            { label: 'SAST', status: r.stages.sast },
            { label: 'Risk', status: r.stages.risk },
            { label: 'Canary', status: r.stages.canary },
            { label: 'Full', status: r.stages.full },
          ]} />
        ) },
        { id: 'progress', label: 'Progress', align: 'end', render: (r: typeof MOCKS.DEPLOYS[number]) => <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-subtle)' }}>{r.progress}%</span> },
        { id: 'status', label: 'Status', render: (r: typeof MOCKS.DEPLOYS[number]) => (
          <HealthBadge
            state={r.status === 'success' ? 'up' : r.status === 'in-flight' ? 'degraded' : 'down'}
            label={r.status}
            pulse={r.status === 'in-flight'}
          />
        ) },
      ])}
    />
  ),
};

/** Service-health table — Sparkline + a triangle Trend delta + p95, composing chart primitives in render(row). */
export const ServiceHealth: Story = {
  render: () => {
    const series = (i: number) => Array.from({ length: 24 }, (_, k) => 100 + 40 * Math.sin(k / 3 + i) + k * (i % 3 === 0 ? -0.4 : 0.6));
    const rows = services.slice(0, 6).map((s, i) => ({ ...s, series: series(i), delta: i % 2 === 0 ? -3.2 - i : 4.2 + i }));
    return (
      <DataTable
        rows={rows}
        columns={cols([
          { id: 'name', label: 'Service', render: (r: typeof rows[number]) => <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg)' }}>{r.name}</span> },
          { id: 'tier', label: 'Tier', render: (r: typeof rows[number]) => <TierBadge tier={r.tier} /> },
          { id: 'spark', label: 'p95 · 24h', width: 160, render: (r: typeof rows[number]) => <Sparkline data={r.series} w={130} h={24} /> },
          { id: 'p95', label: 'p95', align: 'end', render: (r: typeof rows[number]) => <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-subtle)' }}>{r.p95}ms</span> },
          { id: 'delta', label: 'Δ vs 30d', align: 'end', render: (r: typeof rows[number]) => <Trend delta={r.delta} unit="ms" inverted variant="triangle" /> },
          { id: 'health', label: 'Health', render: (r: typeof rows[number]) => <HealthBadge state={r.alert ? 'degraded' : 'up'} pulse={r.alert} /> },
        ])}
      />
    );
  },
};

/** Incident inventory — composes SeverityPill + CopyChip + RelativeTime + OwnerPill; status pairs a tone with a text label, never a bare swatch. */
export const Incidents: Story = {
  render: () => {
    const M = 60_000;
    return (
      <DataTable
        rows={[
          { id: 'INC-4137', svc: 'fraud-engine', sev: 'p1', commander: people[0], at: new Date(Date.now() - 27 * M), state: 'investigating' },
          { id: 'INC-4138', svc: 'kyc-orchestrator', sev: 'p2', commander: people[1], at: new Date(Date.now() - 3 * 60 * M), state: 'monitoring' },
          { id: 'INC-4136', svc: 'identity-svc', sev: 'p0', commander: people[2], at: new Date(Date.now() - 14 * 60 * M), state: 'resolved' },
          { id: 'INC-4135', svc: 'pix-router', sev: 'p3', commander: people[0], at: new Date(Date.now() - 26 * 60 * M), state: 'resolved' },
        ]}
        columns={cols([
          { id: 'id', label: 'Incident', render: (r: any) => <CopyChip value={r.id} /> },
          { id: 'svc', label: 'Service', render: (r: any) => <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-subtle)' }}>{r.svc}</span> },
          { id: 'sev', label: 'Severity', render: (r: any) => <SeverityPill level={r.sev} /> },
          { id: 'cmd', label: 'Commander', render: (r: any) => <OwnerPill person={r.commander} role="IC" /> },
          { id: 'at', label: 'Opened', render: (r: any) => <RelativeTime value={r.at} tooltip /> },
          { id: 'state', label: 'State', render: (r: any) => (
            <span className={'pill ' + (r.state === 'resolved' ? 'status-done' : r.state === 'monitoring' ? 'status-running' : 'severity-p1')}>{r.state}</span>
          ) },
        ])}
      />
    );
  },
};

/** RTL — dir="rtl" flips logical alignment: column labels and cell text align to the reading direction, numeric `align: 'end'` lands inline-start, and the trailing nav chevron is mirrored with scaleX(-1). */
export const RTL: Story = {
  render: () => (
    <div dir="rtl">
      <DataTable
        rows={services.slice(0, 3)}
        columns={cols([
          { id: 'name', label: 'الخدمة', render: (r: typeof MOCKS.SERVICES[number]) => <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg)' }}>{r.name}</span> },
          { id: 'tier', label: 'الطبقة', render: (r: typeof MOCKS.SERVICES[number]) => <TierBadge tier={r.tier} /> },
          { id: 'health', label: 'الصحة', render: (r: typeof MOCKS.SERVICES[number]) => <HealthBadge state={r.alert ? 'degraded' : 'up'} pulse={r.alert} /> },
          { id: 'p95', label: 'p95', align: 'end', render: (r: typeof MOCKS.SERVICES[number]) => <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-subtle)' }}>{r.p95}ms</span> },
          { id: 'open', label: '', align: 'start', width: 32, render: () => <Icons.chevronRight size={12} style={{ transform: 'scaleX(-1)' }} /> },
        ])}
      />
    </div>
  ),
};

/** Full service catalog — sortable + sticky + dense, the composition the page leads with as the canonical IDP table. */
export const InContext: Story = {
  render: () => {
    const [sort, setSort] = React.useState<{ col: string; dir: 'asc' | 'desc' }>({ col: 'coverage', dir: 'desc' });
    const rows = [...services].sort((a, b) => {
      const av = a[sort.col as keyof typeof a], bv = b[sort.col as keyof typeof b];
      const cmp = typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sort.dir === 'asc' ? cmp : -cmp;
    });
    return (
      <div>
        <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', marginBlockEnd: 8 }}>
          Service catalog · {services.length} services
        </p>
        <DataTable
          columns={SERVICE_COLUMNS}
          rows={rows}
          sort={sort}
          onSort={(col) => setSort((prev) => ({ col, dir: prev.col === col && prev.dir === 'asc' ? 'desc' : 'asc' }))}
          onRowClick={(row) => window.alert(`Opened: ${row.name}`)}
          dense
          sticky
        />
      </div>
    );
  },
};
