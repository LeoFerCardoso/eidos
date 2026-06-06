'use client';
// Forge — Software Catalog. The backbone of the IDP: every microservice the
// credit-bureau org runs, searchable and filterable, each tile a door into the
// Service-detail page. Equifax/Boa Vista domain data (src/portal/data),
// composed only from Eidos DS primitives.
import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Button,
  HealthBadge,
  Icons,
  LangBadge,
  Pill,
  Select,
  ServiceCard,
  ToggleGroup,
  ToggleGroupItem,
} from '@/ds/core';
import { FPageHeader, FSearch } from '@/portal/shell/portal-shell';
import { usePersistentState } from '@/portal/shell/use-persistent-state';
import { SERVICES, TRIBES } from '@/portal/data/services';

function initials(squad: string): string {
  return squad
    .replace(/^Squad\s+/i, '')
    .slice(0, 2)
    .toUpperCase();
}

const SAVED_VIEWS = ['All', 'Degraded now', 'PII / LGPD', 'Recently deployed'] as const;
type SavedView = (typeof SAVED_VIEWS)[number];

const PAGE_SIZE = 12;

export default function CatalogPage() {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [view, setView] = React.useState<SavedView>('All');
  const [tribe, setTribe] = React.useState<string>('All tribes');
  const [mode, setMode] = usePersistentState<'grid' | 'list'>('forge.catalog.mode', 'grid');
  const [page, setPage] = React.useState(1);

  // Reset to page 1 whenever filters change
  React.useEffect(() => {
    setPage(1);
  }, [query, view, tribe]);

  const filtered = React.useMemo(() => {
    let list = SERVICES;
    if (view === 'Degraded now') list = list.filter((s) => s.alert);
    else if (view === 'PII / LGPD') list = list.filter((s) => s.pii);
    else if (view === 'Recently deployed') list = list.filter((s) => /^[0-9]+[hm] ago/.test(s.deploys));
    if (tribe !== 'All tribes') list = list.filter((s) => s.tribe === tribe);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.tribe.toLowerCase().includes(q) ||
          s.summary.toLowerCase().includes(q),
      );
    }
    return list;
  }, [query, view, tribe]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const degraded = SERVICES.filter((s) => s.alert).length;
  const open = (id: string) => router.push(`/portal/catalog/${id}`);

  const tribeOptions = [
    { value: 'All tribes', label: 'All tribes' },
    ...TRIBES.map((t) => ({ value: t, label: t })),
  ];

  return (
    <>
      <FPageHeader
        eyebrow="Software Catalog"
        title="Catalog"
        subtitle={`${SERVICES.length} services · ${TRIBES.length} tribes · ${degraded} degraded now`}
        actions={
          <>
            <Button variant="ghost">
              <Icons.download size={13} /> Export
            </Button>
            <Button variant="ember" asChild><Link href="/portal/create">
              <Icons.plus size={13} /> New service
            </Link></Button>
          </>
        }
      />

      {/* Saved views — DS Pills (single-select row) */}
      <div
        role="group"
        aria-label="Saved views"
        style={{ display: 'flex', gap: 6, marginBlockEnd: 'var(--fp-filter-gap, 14px)', flexWrap: 'wrap' }}
      >
        {SAVED_VIEWS.map((v) => (
          <Pill
            key={v}
            tone={view === v ? 'ember' : 'neutral'}
            dot={view === v}
            role="radio"
            aria-checked={view === v}
            tabIndex={0}
            style={{ cursor: 'pointer', border: '1px solid var(--border)', fontWeight: view === v ? 600 : 500 }}
            onClick={() => setView(v)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setView(v); } }}
          >
            {v}
          </Pill>
        ))}
      </div>

      {/* Toolbar: search · tribe filter · view toggle — 12px gap, matched heights */}
      <div className="fp-toolbar">
        <div style={{ flex: 1, minWidth: 240, maxWidth: 460, display: 'flex' }}>
          <FSearch
            value={query}
            onChange={setQuery}
            placeholder="Filter by name, tribe, description…"
            aria-label="Filter services"
            className="fluid"
          />
        </div>

        {/* Tribe filter — DS Select (36px to match search + toggle) */}
        <span className="fp-filter-select">
          <Select
            value={tribe}
            onValueChange={setTribe}
            options={tribeOptions}
            width="180px"
          />
        </span>

        {/* Grid / List toggle — DS ToggleGroup (default variant, md height) */}
        <ToggleGroup
          type="single"
          variant="default"
          value={mode}
          onValueChange={(v) => v && setMode(v as 'grid' | 'list')}
          aria-label="View mode"
        >
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <Icons.grid size={12} />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <Icons.menu size={12} />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Grid */}
      {mode === 'grid' && (
        <div className="fp-grid fp-grid-auto">
          {paginated.map((svc) => (
            <ServiceCard
              key={svc.id}
              service={svc}
              variant="default"
              contributors={[{ name: svc.squad, initials: initials(svc.squad) }]}
              onOpen={() => open(svc.id)}
            />
          ))}
        </div>
      )}

      {/* List */}
      {mode === 'list' && (
        <div className="fp-card" style={{ padding: 0 }}>
          <div className="tbl-wrap">
            <table className="tbl" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Lang</th>
                  <th>Tribe</th>
                  <th>Health</th>
                  <th>P95</th>
                  <th>Coverage</th>
                  <th>Version</th>
                  <th style={{ textAlign: 'end' }}>Last deploy</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((svc) => (
                  <tr key={svc.id} style={{ cursor: 'pointer' }} onClick={() => open(svc.id)}>
                    <td style={{ fontWeight: 600 }}>{svc.name}</td>
                    <td>
                      <LangBadge lang={svc.lang} />
                    </td>
                    <td>{svc.tribe}</td>
                    <td>
                      <HealthBadge state={svc.alert ? 'degraded' : 'up'} pulse={svc.alert} />
                    </td>
                    <td className="mono">{svc.p95}ms</td>
                    <td className="mono">{svc.coverage}%</td>
                    <td className="mono">{svc.version}</td>
                    <td
                      style={{
                        textAlign: 'end',
                        color: 'var(--fg-muted)',
                        fontSize: 'var(--text-sm)',
                      }}
                    >
                      {svc.deploys}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer: count + pagination */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBlockStart: 'var(--fp-section-gap, 18px)',
          paddingBlockStart: 'var(--fp-filter-gap, 14px)',
          borderBlockStart: '1px solid var(--border)',
          fontSize: 'var(--text-sm)',
          color: 'var(--fg-muted)',
        }}
      >
        <div>
          {filtered.length} of {SERVICES.length} services
          {view !== 'All' && (
            <Pill
              tone="neutral"
              style={{ marginInlineStart: 8 }}
              onRemove={() => setView('All')}
              removeLabel="Clear filter"
            >
              {view}
            </Pill>
          )}
          {tribe !== 'All tribes' && (
            <Pill
              tone="neutral"
              style={{ marginInlineStart: 6 }}
              onRemove={() => setTribe('All tribes')}
              removeLabel="Clear tribe"
            >
              {tribe}
            </Pill>
          )}
        </div>
        {pageCount > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <Icons.chevronLeft size={12} />
            </Button>
            <span className="mono" style={{ fontSize: 'var(--text-xs)' }}>
              {page} / {pageCount}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={page === pageCount}
              aria-label="Next page"
            >
              <Icons.chevronRight size={12} />
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
