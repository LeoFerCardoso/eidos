'use client';
// Forge DS — Components / Table
// DS-PAGE-STANDARD §2.2 — Component template.
// Sections: Installation → Usage → Variants → In context → Accessibility → RTL → Anatomy → Do/Don't → API reference
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
  Icons,
  Frame,
  Section,
  SubHead,
  Lede,
  Mono,
  Empty,
  Pagination,
  MOCKS,
  TierBadge,
  LangBadge,
  AutoPropsTable,
  ComponentInstall,
} from '@/ds/core';

const { useState, useMemo } = React;

// ── Usage code snippet ────────────────────────────────────────────────────────

const USAGE_CODE = `import {
  Table, TableHeader, TableBody,
  TableRow, TableHead, TableCell,
} from "@forge/ui";

export function Demo() {
  return (
    <Table fullWidth aria-label="Services">
      <TableHeader>
        <TableRow>
          <TableHead>Service</TableHead>
          <TableHead>Tier</TableHead>
          <TableHead align="end">p95</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell style={{ fontWeight: 500 }}>identity-svc</TableCell>
          <TableCell>T1</TableCell>
          <TableCell align="end" className="t-mono">142ms</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}`;

// ── Demo helpers ──────────────────────────────────────────────────────────────

const SortableDemo = () => {
  const data = (MOCKS?.SERVICES || []).slice(0, 6);
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' }>({ key: 'p95', dir: 'asc' });
  const sorted = useMemo(() => {
    const out = [...data];
    const { key, dir } = sort;
    out.sort((a, b) => {
      const va = (a as any)[key], vb = (b as any)[key];
      if (va == null || vb == null) return 0;
      const cmp = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb));
      return dir === 'asc' ? cmp : -cmp;
    });
    return out;
  }, [data, sort]);
  const toggle = (key: string) => () =>
    setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));
  const dir = (key: string): 'asc' | 'desc' | 'none' =>
    sort.key === key ? sort.dir : 'none';
  return (
    <Table fullWidth aria-label="Services — sortable">
      <TableHeader>
        <TableRow>
          <TableHead sortable sortDirection={dir('name')} onSort={toggle('name')}>Service</TableHead>
          <TableHead sortable sortDirection={dir('tier')} onSort={toggle('tier')}>Tier</TableHead>
          <TableHead sortable sortDirection={dir('lang')} onSort={toggle('lang')}>Lang</TableHead>
          <TableHead sortable sortDirection={dir('p95')} onSort={toggle('p95')} align="end">p95</TableHead>
          <TableHead sortable sortDirection={dir('coverage')} onSort={toggle('coverage')} align="end">Coverage</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((s: any) => (
          <TableRow key={s.id}>
            <TableCell style={{ fontWeight: 500 }}>{s.name}</TableCell>
            <TableCell><TierBadge tier={s.tier}/></TableCell>
            <TableCell><LangBadge lang={s.lang}/></TableCell>
            <TableCell align="end" className="t-mono">{s.p95}ms</TableCell>
            <TableCell align="end" className="t-mono">{s.coverage}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const SelectableDemo = () => {
  const data = (MOCKS?.SERVICES || []).slice(0, 5);
  const [sel, setSel] = useState(new Set<string>([data[1]?.id, data[3]?.id].filter(Boolean) as string[]));
  const allOn = data.length > 0 && sel.size === data.length;
  const someOn = sel.size > 0 && !allOn;
  const toggleRow = (id: string) => {
    const next = new Set(sel);
    next.has(id) ? next.delete(id) : next.add(id);
    setSel(next);
  };
  const toggleAll = () => setSel(allOn ? new Set() : new Set(data.map((d: any) => d.id)));
  return (
    <Table fullWidth aria-label="Services — selectable">
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
          <TableHead>Service</TableHead>
          <TableHead>Tier</TableHead>
          <TableHead>Lang</TableHead>
          <TableHead align="end">p95</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((s: any) => (
          <TableRow
            key={s.id}
            selected={sel.has(s.id)}
            onClick={() => toggleRow(s.id)}
            style={{ cursor: 'pointer' }}
          >
            <TableCell onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={sel.has(s.id)}
                onChange={() => toggleRow(s.id)}
                aria-label={`Select ${s.name}`}
              />
            </TableCell>
            <TableCell style={{ fontWeight: 500 }}>{s.name}</TableCell>
            <TableCell><TierBadge tier={s.tier}/></TableCell>
            <TableCell><LangBadge lang={s.lang}/></TableCell>
            <TableCell align="end" className="t-mono">{s.p95}ms</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const PaginatedDemo = () => {
  const all = (MOCKS?.SERVICES || []);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * perPage;
  const rows = all.slice(start, start + perPage);
  return (
    <div>
      <Table
        fullWidth
        aria-label="Services — paginated"
        style={{ border: '1px solid var(--border)', borderRadius: '8px 8px 0 0', borderBottom: 'none' }}
      >
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>Lang</TableHead>
            <TableHead align="end">p95</TableHead>
            <TableHead align="end">Coverage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((s: any) => (
            <TableRow key={s.id}>
              <TableCell style={{ fontWeight: 500 }}>{s.name}</TableCell>
              <TableCell><TierBadge tier={s.tier}/></TableCell>
              <TableCell><LangBadge lang={s.lang}/></TableCell>
              <TableCell align="end" className="t-mono">{s.p95}ms</TableCell>
              <TableCell align="end" className="t-mono">{s.coverage}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="tbl-bottom">
        <div className="pg-bar">
          <span className="meta">
            Showing <strong>{start + 1}–{Math.min(start + perPage, total)}</strong> of <strong>{total}</strong>
          </span>
          <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
            <label htmlFor="tbl-rpp-demo" className="t-small" style={{ color: 'var(--fg-faint)' }}>Rows</label>
            <select
              id="tbl-rpp-demo"
              className="pg-select"
              aria-label="Rows per page"
              value={perPage}
              onChange={(e) => { setPerPage(+e.target.value); setPage(1); }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
            <Pagination size="sm" total={totalPages} current={safePage} onChange={setPage}/>
          </div>
        </div>
      </div>
    </div>
  );
};

// Combined in-context demo: search + sort + select + paginate
const InContextDemo = () => {
  const all = (MOCKS?.SERVICES || []).slice(0, 14);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' }>({ key: 'p95', dir: 'asc' });
  const [sel, setSel] = useState(new Set<string>());
  const [page, setPage] = useState(1);
  const perPage = 6;
  const filtered = q
    ? all.filter((s: any) =>
        s.name.toLowerCase().includes(q.toLowerCase()) ||
        s.lang.toLowerCase().includes(q.toLowerCase()))
    : all;
  const sorted = [...filtered].sort((a: any, b: any) => {
    const va = a[sort.key], vb = b[sort.key];
    const cmp = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb));
    return sort.dir === 'asc' ? cmp : -cmp;
  });
  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const safePage = Math.min(page, totalPages);
  const rows = sorted.slice((safePage - 1) * perPage, safePage * perPage);
  const toggleSort = (key: string) => () =>
    setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));
  const dir = (key: string): 'asc' | 'desc' | 'none' =>
    sort.key === key ? sort.dir : 'none';
  const allOn = rows.length > 0 && rows.every((r: any) => sel.has(r.id));
  const someOn = rows.some((r: any) => sel.has(r.id)) && !allOn;
  const toggleAll = () => {
    const next = new Set(sel);
    if (allOn) rows.forEach((r: any) => next.delete(r.id));
    else rows.forEach((r: any) => next.add(r.id));
    setSel(next);
  };
  const toggleRow = (id: string) => {
    const next = new Set(sel);
    next.has(id) ? next.delete(id) : next.add(id);
    setSel(next);
  };
  return (
    <div>
      <div className="tbl-toolbar">
        <label className="search">
          <Icons.search size={14}/>
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="Search services…"
          />
          {q && (
            <button
              onClick={() => setQ('')}
              aria-label="Clear search"
              style={{ border: 0, background: 'transparent', color: 'var(--fg-subtle)', cursor: 'pointer', padding: 0 }}
            >
              <Icons.x size={13}/>
            </button>
          )}
        </label>
        <button className="btn outline" style={{ height: 30 }}>
          <Icons.filter size={12}/> Filter
        </button>
      </div>
      <Table fullWidth aria-label="Services — combined operations">
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: 40 }}>
              <Checkbox
                checked={allOn}
                indeterminate={someOn}
                onChange={toggleAll}
                aria-label="Select all on page"
              />
            </TableHead>
            <TableHead sortable sortDirection={dir('name')} onSort={toggleSort('name')}>Service</TableHead>
            <TableHead sortable sortDirection={dir('tier')} onSort={toggleSort('tier')}>Tier</TableHead>
            <TableHead sortable sortDirection={dir('lang')} onSort={toggleSort('lang')}>Lang</TableHead>
            <TableHead sortable sortDirection={dir('p95')} onSort={toggleSort('p95')} align="end">p95</TableHead>
            <TableHead sortable sortDirection={dir('coverage')} onSort={toggleSort('coverage')} align="end">Coverage</TableHead>
            <TableHead style={{ width: 32 }}><span className="sr-only">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((s: any) => (
            <TableRow key={s.id} selected={sel.has(s.id)}>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={sel.has(s.id)}
                  onChange={() => toggleRow(s.id)}
                  aria-label={`Select ${s.name}`}
                />
              </TableCell>
              <TableCell style={{ fontWeight: 500 }}>{s.name}</TableCell>
              <TableCell><TierBadge tier={s.tier}/></TableCell>
              <TableCell><LangBadge lang={s.lang}/></TableCell>
              <TableCell align="end" className="t-mono">{s.p95}ms</TableCell>
              <TableCell align="end" className="t-mono">{s.coverage}%</TableCell>
              <TableCell>
                <span
                  className="tbl-row-actions"
                  role="button"
                  tabIndex={0}
                  aria-label={`Actions for ${s.name}`}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') e.preventDefault(); }}
                >
                  <Icons.more size={14}/>
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="tbl-bottom">
        <div className="pg-bar">
          <span className="meta">
            Showing <strong>{(safePage - 1) * perPage + 1}–{Math.min(safePage * perPage, sorted.length)}</strong> of <strong>{sorted.length}</strong>
            {sel.size > 0 && (
              <>
                {' · '}
                <span style={{ color: 'var(--ember)', fontWeight: 500 }}>{sel.size} selected</span>
              </>
            )}
          </span>
          <Pagination size="sm" total={totalPages} current={safePage} onChange={setPage}/>
        </div>
      </div>
    </div>
  );
};

// Anatomy helper — static, aria-hidden
const AnatomyTable = () => {
  const data = (MOCKS?.SERVICES || []).slice(0, 4);
  return (
    <Table fullWidth aria-hidden="true">
      <TableHeader>
        <TableRow>
          <TableHead>Service</TableHead>
          <TableHead>Tier</TableHead>
          <TableHead>Lang</TableHead>
          <TableHead align="end">p95</TableHead>
          <TableHead align="end">Coverage</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((s: any) => (
          <TableRow key={s.id}>
            <TableCell style={{ fontWeight: 500 }}>{s.name}</TableCell>
            <TableCell><TierBadge tier={s.tier}/></TableCell>
            <TableCell><LangBadge lang={s.lang}/></TableCell>
            <TableCell align="end" className="t-mono">{s.p95}ms</TableCell>
            <TableCell align="end" className="t-mono">{s.coverage}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TablePage() {
  return (
    <Section
      id="table"
      num="35"
      title="Table"
      desc="Tabular data for services, deploys, audits, and transactions. A typed compound primitive — sort, select, and paginate compose on top."
    >
      {/* 1. INSTALLATION */}
      <ComponentInstall slug="table" />

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" code={USAGE_CODE}>
        <Table fullWidth aria-label="Services">
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead align="end">p95</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell style={{ fontWeight: 500 }}>identity-svc</TableCell>
              <TableCell><TierBadge tier="T1"/></TableCell>
              <TableCell align="end" className="t-mono">142ms</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ fontWeight: 500 }}>pix-router</TableCell>
              <TableCell><TierBadge tier="T2"/></TableCell>
              <TableCell align="end" className="t-mono">89ms</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Frame>

      {/* 3. VARIANTS / SIZES / STATES */}

      {/* Density */}
      <SubHead meta="3 densities">Density</SubHead>
      <Lede>
        Three padding presets fit different contexts without changing the semantic markup.
        <Mono>density="compact"</Mono> (6/10 px) suits dense ops dashboards; the default (10/12 px) fits most lists;
        <Mono>density="comfortable"</Mono> (14/16 px) suits audit logs and billing where rows carry more weight.
      </Lede>
      <Frame
        label="density='compact' · default · density='comfortable'"
        code={`<Table density="compact">…</Table>
<Table>…</Table>
<Table density="comfortable">…</Table>`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, width: '100%' }}>
          {([
            ['compact',      'Compact — 6/10 px · ops dashboards'],
            [undefined,      'Default — 10/12 px · everywhere else'],
            ['comfortable',  'Comfortable — 14/16 px · billing, audit logs'],
          ] as const).map(([density, caption]) => (
            <div key={caption}>
              <div className="t-mono-label" style={{ marginBottom: 6 }}>{caption}</div>
              <Table density={density} fullWidth>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead align="end">p95</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(MOCKS?.SERVICES || []).slice(0, 3).map((s: any) => (
                    <TableRow key={s.id}>
                      <TableCell style={{ fontWeight: 500 }}>{s.name}</TableCell>
                      <TableCell><TierBadge tier={s.tier}/></TableCell>
                      <TableCell align="end" className="t-mono">{s.p95}ms</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      </Frame>

      {/* Sort */}
      <SubHead meta="click headers">Sort</SubHead>
      <Lede>
        Pass <Mono>sortable</Mono>, <Mono>sortDirection</Mono>, and <Mono>onSort</Mono> to <Mono>TableHead</Mono>.
        The component owns the affordance — sort state stays in the consumer.
        Keyboard: <Mono>Enter</Mono> / <Mono>Space</Mono> on a focused header toggles the direction.
      </Lede>
      <Frame label="click any column header to toggle asc / desc"
        code={`const [sort, setSort] = useState({ key: 'p95', dir: 'asc' })

const toggle = (key) => () =>
  setSort(s => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }))

<Table fullWidth>
  <TableHeader>
    <TableRow>
      <TableHead sortable sortDirection={sort.key==='name' ? sort.dir : 'none'} onSort={toggle('name')}>
        Service
      </TableHead>
      <TableHead sortable sortDirection={sort.key==='p95'  ? sort.dir : 'none'} onSort={toggle('p95')} align="end">
        p95
      </TableHead>
    </TableRow>
  </TableHeader>
  …
</Table>`}>
        <SortableDemo/>
      </Frame>

      {/* Selection */}
      <SubHead meta="row checkbox">Row selection</SubHead>
      <Lede>
        <Mono>selected</Mono> on <Mono>TableRow</Mono> applies the ember-soft highlight.
        Compose the DS <Mono>{'<Checkbox>'}</Mono> in the first column; the header checkbox uses the <Mono>indeterminate</Mono> prop
        when some but not all rows are selected.
      </Lede>
      <Frame
        label="header checkbox is tri-state — none · indeterminate · all"
        code={`const [sel, setSel] = useState(new Set())
const allOn  = sel.size === rows.length
const someOn = sel.size > 0 && !allOn

<TableRow selected={sel.has(row.id)}>
  <TableCell>
    <Checkbox checked={sel.has(row.id)} onChange={…} aria-label={…} />
  </TableCell>
  …
</TableRow>`}>
        <SelectableDemo/>
      </Frame>

      {/* Row status */}
      <SubHead meta="row tone">Row status</SubHead>
      <Frame
        label="status='warn' · status='danger' — leading-edge stripe via inset-inline-start"
        code={`<TableRow status="warn">…</TableRow>
<TableRow status="danger">…</TableRow>`}>
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
              <TableCell><TierBadge tier="T1"/></TableCell>
              <TableCell style={{ color: 'var(--success)' }}>Healthy</TableCell>
              <TableCell align="end" className="t-mono">142ms</TableCell>
            </TableRow>
            <TableRow status="warn">
              <TableCell style={{ fontWeight: 500 }}>fraud-engine</TableCell>
              <TableCell><TierBadge tier="T1"/></TableCell>
              <TableCell style={{ color: 'var(--warning)' }}>Degraded</TableCell>
              <TableCell align="end" className="t-mono" style={{ color: 'var(--warning)' }}>312ms</TableCell>
            </TableRow>
            <TableRow status="danger">
              <TableCell style={{ fontWeight: 500 }}>bureau-gateway</TableCell>
              <TableCell><TierBadge tier="T1"/></TableCell>
              <TableCell style={{ color: 'var(--danger)' }}>Failing</TableCell>
              <TableCell align="end" className="t-mono" style={{ color: 'var(--danger)' }}>2.1s</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Frame>

      {/* Pagination + sticky header */}
      <SubHead meta="footer · sticky">Pagination and sticky header</SubHead>
      <Frame
        label="rows-per-page select · range · pager · wrap in .tbl-scroll for sticky thead"
        code={`<Table fullWidth stickyHeader>…</Table>

{/* canonical footer */}
<div className="tbl-bottom">
  <div className="pg-bar">
    <span className="meta">Showing 1–5 of 24</span>
    <Pagination size="sm" total={totalPages} current={page} onChange={setPage}/>
  </div>
</div>`}>
        <PaginatedDemo/>
      </Frame>

      {/* Empty + loading states */}
      <SubHead meta="empty · loading">States</SubHead>
      <div className="ds-grid cols-2">
        <Frame label="empty state" code={`{rows.length === 0 && (
  <Empty
    icon={<Icons.search size={18}/>}
    title="No services yet"
    desc="Create your first service."
    action={<button className="btn ember">Create service</button>}
  />
)}`}>
          <div style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)' }}>
            <Empty
              size="md"
              icon={<Icons.search size={18}/>}
              title="No services yet"
              desc="Create your first service to populate this table."
              action={<button className="btn ember"><Icons.plus size={12}/> Create service</button>}
            />
          </div>
        </Frame>
        <Frame label="loading skeleton" code={`{loading && Array.from({ length: 4 }).map((_, i) => (
  <TableRow key={i}>
    <TableCell><span className="skel-cell" style={{ width: 110 }}/></TableCell>
    <TableCell><span className="skel-cell" style={{ width: 28 }}/></TableCell>
    <TableCell><span className="skel-cell" style={{ width: 52 }}/></TableCell>
  </TableRow>
))}`}>
          <Table fullWidth>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead align="end">p95</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[0,1,2,3].map((i) => (
                <TableRow key={i}>
                  <TableCell><span className="skel-cell" style={{ width: 110 + i*8 }}/></TableCell>
                  <TableCell><span className="skel-cell" style={{ width: 28 }}/></TableCell>
                  <TableCell><span className="skel-cell" style={{ width: 52 }}/></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Frame>
      </div>

      {/* 4. IN CONTEXT */}
      <SubHead meta="real surface">In context</SubHead>
      <Lede>
        The same primitive composed with search, sort, row selection, row actions, and pagination.
        No special wrapper — the <Mono>.tbl</Mono> CSS layer and the compound API handle everything.
      </Lede>
      <Frame
        label="search · sort · select · paginate · row actions — composed"
        code={`<div className="tbl-toolbar">
  <label className="search">…</label>
  <button className="btn outline">Filter</button>
</div>
<Table fullWidth>
  <TableHeader>…sortable columns…</TableHeader>
  <TableBody>
    {visible.map(s => (
      <TableRow key={s.id} selected={sel.has(s.id)}>
        …
        <TableCell><span className="tbl-row-actions">…</span></TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
<div className="tbl-bottom">
  <div className="pg-bar">…</div>
</div>`}>
        <InContextDemo/>
      </Frame>

      {/* 5. ACCESSIBILITY */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <Lede>
        Always render a real <Mono>{'<table>'}</Mono>. Add <Mono>aria-label</Mono> (or <Mono>{'<TableCaption>'}</Mono>)
        so screen readers announce the table name before navigating into it.
      </Lede>
      <div className="ds-grid cols-2" style={{ marginBottom: 20 }}>
        <div className="surface" style={{ padding: '16px 20px' }}>
          <div className="t-mono-label" style={{ color: 'var(--ember)', marginBottom: 8 }}>Keyboard model</div>
          <ul className="t-small" style={{ paddingInlineStart: '1.4em', display: 'flex', flexDirection: 'column', gap: 4, margin: 0 }}>
            <li><Mono>Tab</Mono> / <Mono>Shift+Tab</Mono> — moves between interactive cells and sortable headers</li>
            <li><Mono>Enter</Mono> / <Mono>Space</Mono> — activates a sortable <Mono>TableHead</Mono></li>
            <li><Mono>Space</Mono> — checks/unchecks a row checkbox</li>
          </ul>
        </div>
        <div className="surface" style={{ padding: '16px 20px' }}>
          <div className="t-mono-label" style={{ color: 'var(--ember)', marginBottom: 8 }}>ARIA contract</div>
          <ul className="t-small" style={{ paddingInlineStart: '1.4em', display: 'flex', flexDirection: 'column', gap: 4, margin: 0 }}>
            <li><Mono>scope="col"</Mono> on every <Mono>{'<th>'}</Mono> (set by <Mono>TableHead</Mono>)</li>
            <li><Mono>aria-sort="ascending|descending|none"</Mono> on sortable columns</li>
            <li><Mono>aria-selected</Mono> on selectable rows when using <Mono>selected</Mono> prop</li>
            <li>Row-action icon buttons need <Mono>aria-label</Mono></li>
          </ul>
        </div>
      </div>
      <Frame
        label="real <table> · scope · aria-sort · caption"
        code={`<Table aria-label="Services">
  <TableCaption>Service health overview</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead scope="col" sortable sortDirection="ascending" onSort={…}>
        Service
      </TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow aria-selected={sel.has(s.id)}>
      <TableCell as="th" scope="row">identity-svc</TableCell>
    </TableRow>
  </TableBody>
</Table>`}>
        <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.6, maxWidth: '62ch' }}>
          Always use a real <Mono>{'<table>'}</Mono>. <Mono>TableHead</Mono> automatically sets <Mono>scope="col"</Mono> and exposes <Mono>aria-sort</Mono> for sortable columns. Combine with <Mono>TableCaption</Mono> for a visible-or-hidden accessible name. Reduced-motion: sort-arrow and row-hover transitions are scoped to <Mono>@media (prefers-reduced-motion: reduce)</Mono>.
        </div>
      </Frame>

      {/* 6. RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Lede>
        <Mono>text-align: start</Mono> on headers and cells means alignment flips automatically under <Mono>dir="rtl"</Mono>.
        The status-accent border uses <Mono>inset-inline-start</Mono> so it lands on the leading edge in both directions.
        Sort arrows are non-directional (up = ascending) and do not mirror.
      </Lede>
      <Frame
        label={`dir="rtl" — headers and cells right-align; status stripe flips to the leading edge`}
        code={`<div dir="rtl">
  <Table fullWidth aria-label="الخدمات">
    <TableHeader>
      <TableRow>
        <TableHead sortable sortDirection="ascending" onSort={…}>الخدمة</TableHead>
        <TableHead>الفئة</TableHead>
        <TableHead align="end">p95</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow status="warn">
        <TableCell>fraud-engine</TableCell>
        <TableCell><TierBadge tier="T1"/></TableCell>
        <TableCell align="end" className="t-mono">٣١٢ مللي</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</div>`}>
        <div dir="rtl" style={{ width: '100%' }}>
          <Table fullWidth aria-label="الخدمات">
            <TableCaption>نظرة عامة على صحة الخدمة</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead sortable sortDirection="asc" onSort={() => {}}>الخدمة</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>اللغة</TableHead>
                <TableHead align="end">p95</TableHead>
                <TableHead align="end">التغطية</TableHead>
                <TableHead>الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell style={{ fontWeight: 500 }}>identity-svc</TableCell>
                <TableCell><TierBadge tier="T1"/></TableCell>
                <TableCell><LangBadge lang="Go"/></TableCell>
                <TableCell align="end" className="t-mono">١٤٢ مللي</TableCell>
                <TableCell align="end" className="t-mono">٩٤٪</TableCell>
                <TableCell style={{ color: 'var(--success)' }}>سليم</TableCell>
              </TableRow>
              <TableRow status="warn">
                <TableCell style={{ fontWeight: 500 }}>fraud-engine</TableCell>
                <TableCell><TierBadge tier="T1"/></TableCell>
                <TableCell><LangBadge lang="Python"/></TableCell>
                <TableCell align="end" className="t-mono" style={{ color: 'var(--warning)' }}>٣١٢ مللي</TableCell>
                <TableCell align="end" className="t-mono">٨٢٪</TableCell>
                <TableCell style={{ color: 'var(--warning)' }}>متدهور</TableCell>
              </TableRow>
              <TableRow status="danger">
                <TableCell style={{ fontWeight: 500 }}>bureau-gateway</TableCell>
                <TableCell><TierBadge tier="T1"/></TableCell>
                <TableCell><LangBadge lang="Go"/></TableCell>
                <TableCell align="end" className="t-mono" style={{ color: 'var(--danger)' }}>٢١٠٠ مللي</TableCell>
                <TableCell align="end" className="t-mono">٧٩٪</TableCell>
                <TableCell style={{ color: 'var(--danger)' }}>فاشل</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="tbl-bottom">
            <div className="pg-bar">
              <span className="meta">عرض <strong>١–٣</strong> من <strong>٢٤</strong></span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <label htmlFor="tbl-rpp-rtl" className="t-small" style={{ color: 'var(--fg-faint)' }}>صفوف</label>
                <select id="tbl-rpp-rtl" className="pg-select" aria-label="صفوف لكل صفحة" defaultValue={5}>
                  <option value={5}>٥</option>
                  <option value={10}>١٠</option>
                  <option value={25}>٢٥</option>
                </select>
                <Pagination size="sm" total={5} current={1} onChange={() => {}}/>
              </div>
            </div>
          </div>
        </div>
      </Frame>

      {/* 7. ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Table anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: '100%', maxWidth: 640 }}>
              <AnatomyTable/>
              <span className="lead h" style={{ top: 18, left: -28, width: 24 }}/>
              <span className="lead h" style={{ top: 64, left: -28, width: 24 }}/>
              <span className="lead h" style={{ top: 64, right: -28, width: 24 }}/>
              <span className="lead v" style={{ bottom: -22, left: '22%', height: 18 }}/>
              <span className="lead v" style={{ bottom: -22, left: '80%', height: 18 }}/>
              <div className="pin" style={{ top: 8, left: -52 }}>1</div>
              <div className="pin" style={{ top: 54, left: -52 }}>2</div>
              <div className="pin" style={{ top: 54, right: -52 }}>3</div>
              <div className="pin" style={{ bottom: -42, left: '22%', transform: 'translateX(-50%)' }}>4</div>
              <div className="pin" style={{ bottom: -42, left: '80%', transform: 'translateX(-50%)' }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 600, margin: '72px auto 0' }}>
            <span className="num">1</span>
            <span><b style={{ color: 'var(--fg)' }}>Header row.</b> Geist 500 · 11 px · uppercase · letter-spacing 0.06 em · color <Mono>--fg-subtle</Mono>. Quiet enough to recede; legible at a glance. <Mono>scope="col"</Mono> auto-applied by <Mono>TableHead</Mono>.</span>
            <span className="num">2</span>
            <span><b style={{ color: 'var(--fg)' }}>Primary cell.</b> Geist 500 · 13 px · color <Mono>--fg</Mono>. The entity the row is named after — service, user, transaction.</span>
            <span className="num">3</span>
            <span><b style={{ color: 'var(--fg)' }}>Numeric cell.</b> Geist Mono · 12 px · <Mono>tabular-nums</Mono>. Digits align across rows regardless of value length. Use <Mono>align="end"</Mono> and <Mono>className="t-mono"</Mono>.</span>
            <span className="num">4</span>
            <span><b style={{ color: 'var(--fg)' }}>Row.</b> 12 px vertical padding · 1 px hairline divider · transitions to <Mono>--surface-hover</Mono> on hover. <Mono>selected</Mono> applies ember-soft background.</span>
            <span className="num">5</span>
            <span><b style={{ color: 'var(--fg)' }}>Inline tokens.</b> Any Forge primitive — TierBadge, LangBadge, Pill, StatusDot — lands in a cell without wrapper surgery. The <Mono>align</Mono> prop handles RTL-aware column alignment.</span>
          </div>
        </div>
      </div>

      {/* 8. DO / DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — mono numerics with tabular-nums</div>
          <div className="body" style={{ flexDirection: 'column' }}>
            <Table fullWidth>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead align="end">p95</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow><TableCell>identity-svc</TableCell><TableCell align="end" className="t-mono">142ms</TableCell></TableRow>
                <TableRow><TableCell>pix-router</TableCell><TableCell align="end" className="t-mono">89ms</TableCell></TableRow>
                <TableRow><TableCell>bureau-gateway</TableCell><TableCell align="end" className="t-mono">218ms</TableCell></TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="note">Tabular-nums lock digits to a uniform width — columns stay aligned even as values change.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — proportional digits</div>
          <div className="body" style={{ flexDirection: 'column' }}>
            <Table fullWidth>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead align="end">p95</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow><TableCell>identity-svc</TableCell><TableCell align="end">142ms</TableCell></TableRow>
                <TableRow><TableCell>pix-router</TableCell><TableCell align="end">89ms</TableCell></TableRow>
                <TableRow><TableCell>bureau-gateway</TableCell><TableCell align="end">218ms</TableCell></TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="note">Proportional digits jitter as values update. The eye can't compare numbers it can't align.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — show empty state with intent</div>
          <div className="body" style={{ flexDirection: 'column' }}>
            <div style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)' }}>
              <Empty size="sm" icon={<Icons.plus size={16}/>} title="No services yet" desc="Create your first service to start."/>
            </div>
          </div>
          <div className="note">A blank table is hostile. Name the absence and offer the next action.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — render an empty tbody</div>
          <div className="body" style={{ flexDirection: 'column' }}>
            <Table fullWidth>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead align="end">p95</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody></TableBody>
            </Table>
          </div>
          <div className="note">A header with no rows reads as broken — the user can't distinguish "no data" from "still loading".</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — hairline dividers, no zebra by default</div>
          <div className="body" style={{ flexDirection: 'column' }}>
            <Table fullWidth>
              <TableHeader>
                <TableRow>
                  <TableHead>Tribe</TableHead>
                  <TableHead align="end">Services</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow><TableCell>Identity</TableCell><TableCell align="end" className="t-mono">4</TableCell></TableRow>
                <TableRow><TableCell>Pix</TableCell><TableCell align="end" className="t-mono">5</TableCell></TableRow>
                <TableRow><TableCell>Risk</TableCell><TableCell align="end" className="t-mono">6</TableCell></TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="note">Hairlines are enough to separate rows. Zebra striping adds visual noise and fights hover and selected states.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — alternate row backgrounds</div>
          <div className="body" style={{ flexDirection: 'column' }}>
            <Table fullWidth zebra>
              <TableHeader>
                <TableRow>
                  <TableHead>Tribe</TableHead>
                  <TableHead align="end">Services</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow><TableCell>Identity</TableCell><TableCell align="end" className="t-mono">4</TableCell></TableRow>
                <TableRow><TableCell>Pix</TableCell><TableCell align="end" className="t-mono">5</TableCell></TableRow>
                <TableRow><TableCell>Risk</TableCell><TableCell align="end" className="t-mono">6</TableCell></TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="note">Striping also conflicts with hover, selection, and status-accent rows. Reserve <Mono>zebra</Mono> for read-only reference tables where interaction is absent.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — add an aria-label or TableCaption</div>
          <div className="body" style={{ flexDirection: 'column' }}>
            <div className="t-small" style={{ color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>
              {'<Table aria-label="Services">'}<br/>
              {'  <TableCaption>Service health</TableCaption>'}<br/>
              {'  …'}<br/>
              {'</Table>'}
            </div>
          </div>
          <div className="note">Screen readers announce the table name before entering. A caption also shows visually in many contexts.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — leave the table unlabelled</div>
          <div className="body" style={{ flexDirection: 'column' }}>
            <div className="t-small" style={{ color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>
              {'<Table>'}<br/>
              {'  {/* no aria-label, no caption */}'}<br/>
              {'  …'}<br/>
              {'</Table>'}
            </div>
          </div>
          <div className="note">Without a label a screen reader reads "table, 5 columns, 10 rows" — no context for the user.</div>
        </div>
      </div>

      {/* 9. API REFERENCE */}
      <SubHead meta="TableProps">API reference</SubHead>
      <AutoPropsTable component="Table"      label="<Table />" />
      <AutoPropsTable component="TableRow"   label="<TableRow />" />
      <AutoPropsTable component="TableHead"  label="<TableHead />" />
      <AutoPropsTable component="TableCell"  label="<TableCell />" />
      <AutoPropsTable component="TableCaption" label="<TableCaption />" />
    </Section>
  );
}
