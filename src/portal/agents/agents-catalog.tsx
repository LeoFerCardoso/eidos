'use client';
// Forge — Agents catalog. A top-level portal page (rail item between Catalog
// and Templates). Distinguishes company-built (official, verified) agents from
// collaborator-built ones, lets the user star up to 10 for quick access, and
// presents them as a starred band + the full list with load-more, in either a
// grid or a list layout. Each card opens a fresh chat with that agent
// (/portal/chat?agent=<id>). Search collapses the bands into a single result set.
import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Button, Icons, Avatar, Pill, ToggleGroup, ToggleGroupItem,
  Carousel, CarouselSlide, CarouselControls, CarouselDots,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem,
} from '@/ds/core';
import { FPageHeader, FSearch } from '@/portal/shell/portal-shell';
import { usePersistentState } from '@/portal/shell/use-persistent-state';
import { AGENTS, ARCHIVED_AGENTS, type Agent, type ArchivedAgent } from '@/portal/data/agents';

const STAR_LIMIT = 10;
const PAGE = 8; // load-more increment for the full list

const SEED_STARRED = AGENTS.filter((a) => a.starred).map((a) => a.id);

// ── Small pieces ────────────────────────────────────────────────────────────

// Solid, coloured social-media style verified seal (Lucide badge-check).
const Verified = () => (
  <span className="fp-agents-verified" title="Official · built by Equifax" aria-label="Official agent">
    <Icons.badgeCheck size={15} />
  </span>
);

const Maker = ({ a, className }: { a: Agent; className?: string }) =>
  a.official ? (
    <span className={`fp-agents-maker is-official${className ? ` ${className}` : ''}`}>
      <Icons.shield size={11} /> Official
    </span>
  ) : (
    <span className={`fp-agents-maker${className ? ` ${className}` : ''}`}>by {a.author}</span>
  );

function StarBtn({
  on,
  disabled,
  onToggle,
}: {
  on: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className={`fp-agents-star${on ? ' is-on' : ''}`}
      aria-pressed={on}
      disabled={disabled}
      title={on ? 'Unstar' : disabled ? `Starred limit reached (${STAR_LIMIT})` : 'Star for quick access'}
      aria-label={on ? 'Unstar agent' : 'Star agent'}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      <Icons.star size={15} />
    </button>
  );
}

// Vertical card — grid + carousel.
function AgentCard({
  a,
  on,
  starDisabled,
  onToggle,
  onOpen,
}: {
  a: Agent;
  on: boolean;
  starDisabled: boolean;
  onToggle: () => void;
  onOpen: () => void;
}) {
  return (
    <div
      className="fp-agents-card"
      role="button"
      tabIndex={0}
      aria-label={`Open ${a.name}`}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      <div className="head">
        <Avatar name={a.name} size={40} />
        <div className="id">
          <div className="name">
            {a.name}
            {a.official && <Verified />}
          </div>
          <div className="role">{a.role}</div>
        </div>
        <StarBtn on={on} disabled={starDisabled} onToggle={onToggle} />
      </div>
      <div className="desc">{a.desc}</div>
      <div className="fp-agents-meta">
        <Pill tone="neutral" icon={<Icons.sparkle size={10} />} className="fp-agents-model">{a.model}</Pill>
        <Maker a={a} />
      </div>
      <div className="stats">
        <span><b>{a.tools}</b> tools</span><span className="dot">·</span>
        <span><b>{a.chats}</b> chats</span>
        <span className="updated">{a.updated}</span>
      </div>
    </div>
  );
}

// Horizontal row — list mode.
function AgentRow({
  a,
  on,
  starDisabled,
  onToggle,
  onOpen,
}: {
  a: Agent;
  on: boolean;
  starDisabled: boolean;
  onToggle: () => void;
  onOpen: () => void;
}) {
  return (
    <div
      className="fp-agents-row"
      role="button"
      tabIndex={0}
      aria-label={`Open ${a.name}`}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      <Avatar name={a.name} size={36} />
      <div className="row-id">
        <span className="name">
          {a.name}
          {a.official && <Verified />}
        </span>
        <span className="role">{a.role}</span>
      </div>
      <div className="row-desc">{a.desc}</div>
      <Pill tone="neutral" icon={<Icons.sparkle size={10} />} className="fp-agents-model">{a.model}</Pill>
      <Maker a={a} className="row-maker" />
      <span className="row-updated">{a.updated}</span>
      <StarBtn on={on} disabled={starDisabled} onToggle={onToggle} />
    </div>
  );
}

function SectionHead({
  icon,
  title,
  count,
  right,
}: {
  icon?: React.ReactNode;
  title: string;
  count: number;
  right?: React.ReactNode;
}) {
  return (
    <div className="fp-agents-section-head">
      <span className="fp-agents-section-title">{icon}{title}</span>
      <span className="fp-agents-section-count">{count}</span>
      {right && <div className="fp-agents-section-tools">{right}</div>}
    </div>
  );
}

const SOURCE_OPTIONS = [
  { value: 'all', label: 'All sources' },
  { value: 'official', label: 'Official' },
  { value: 'collab', label: 'Collaborator' },
];

// ── Archived agents — flat restorable list (mirrors the Chat archive) ──────────
function ArchiveView({ onBack, onOpen }: { onBack: () => void; onOpen: (id: string) => void }) {
  // Restoring un-archives an agent (rollback) — it leaves the archive list.
  const [restored, setRestored] = React.useState<Set<string>>(new Set());
  const [q, setQ] = React.useState('');
  const all = ARCHIVED_AGENTS.filter((a) => !restored.has(a.id));
  const s = q.trim().toLowerCase();
  const rows = all.filter(
    (a) => !s || a.name.toLowerCase().includes(s) || a.role.toLowerCase().includes(s) || a.desc.toLowerCase().includes(s),
  );

  return (
    <>
      <div style={{ marginBlockEnd: 'var(--space-2)' }}>
        <Button type="button" variant="ghost" onClick={onBack} style={{ marginInlineStart: -8 }}>
          <Icons.chevronLeft size={13} /> Back to agents
        </Button>
      </div>
      <FPageHeader
        title="Archived agents"
        subtitle="Agents you've put away. They're hidden from the catalog and their live channels are paused. Restore one to roll it back into Agents."
      />

      {all.length > 0 && (
        <div className="fp-toolbar">
          <FSearch value={q} onChange={setQ} placeholder="Filter archived agents…" aria-label="Filter archived agents" className="fp-agents-search" />
          <span className="fp-agents-count">{all.length} archived</span>
        </div>
      )}

      {all.length === 0 ? (
        <div className="fp-agents-empty">
          <Icons.inbox size={28} />
          <p>No archived agents.</p>
          <span className="hint">Agents you archive will collect here.</span>
        </div>
      ) : rows.length === 0 ? (
        <div className="fp-agents-empty">
          <Icons.inbox size={28} />
          <p>No archived agents match &ldquo;{q.trim()}&rdquo;.</p>
        </div>
      ) : (
        <ul className="fp-agents-arc-list">
          {rows.map((a: ArchivedAgent) => (
            <li key={a.id} className="fp-agents-arc-row">
              <Avatar name={a.name} size={36} />
              <button type="button" className="fp-agents-arc-body" onClick={() => onOpen(a.id)} aria-label={`Open ${a.name}`}>
                <span className="name">{a.name}{a.official && <Verified />}</span>
                <span className="role">{a.role}</span>
              </button>
              <Pill tone="neutral" icon={<Icons.sparkle size={10} />} className="fp-agents-model fp-agents-arc-model">{a.model}</Pill>
              <span className="fp-agents-arc-when">{a.archivedWhen}</span>
              <Button
                variant="ghost"
                className="fp-agents-arc-restore"
                onClick={() => setRestored((set) => new Set(set).add(a.id))}
                title="Restore · move back to Agents"
              >
                <Icons.undo size={13} /> Restore
              </Button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AgentsCatalog() {
  const router = useRouter();
  const [q, setQ] = React.useState('');
  // Catalog ⇄ archived list. Opens straight into the archive when the URL carries
  // ?archived=1 (the agent-detail Archive action routes here).
  const [view, setView] = React.useState<'catalog' | 'archive'>('catalog');
  React.useEffect(() => {
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('archived')) {
      setView('archive');
    }
  }, []);
  const [mode, setMode] = usePersistentState<'grid' | 'list'>('forge.agents.mode', 'grid');
  const [starredIds, setStarredIds] = usePersistentState<string[]>('forge.agents.starred', SEED_STARRED);
  const [visible, setVisible] = React.useState(PAGE);
  // Source filter — scoped to the "All agents" list (official vs collaborator).
  const [source, setSource] = React.useState<'all' | 'official' | 'collab'>('all');
  React.useEffect(() => setVisible(PAGE), [source, q]);

  const starred = React.useMemo(() => new Set(starredIds), [starredIds]);
  // Opening a card goes to the agent's detail/settings page (not straight to chat).
  const open = (id: string) => router.push('/portal/agents/' + id);

  const toggleStar = (id: string) =>
    setStarredIds((ids) => {
      if (ids.includes(id)) return ids.filter((x) => x !== id);
      if (ids.length >= STAR_LIMIT) return ids; // enforce the 10-star cap
      return [...ids, id];
    });
  const atStarLimit = starred.size >= STAR_LIMIT;

  const query = q.trim().toLowerCase();
  const matches = (a: Agent) =>
    !query ||
    a.name.toLowerCase().includes(query) ||
    a.role.toLowerCase().includes(query) ||
    a.desc.toLowerCase().includes(query) ||
    a.model.toLowerCase().includes(query) ||
    (a.author ?? '').toLowerCase().includes(query) ||
    (a.official ? 'official' : '').includes(query);

  const filtered = AGENTS.filter(matches);
  // The Starred band is a quick-access shortcut to the favourites; "All agents"
  // stays the COMPLETE list — starring a card pins it above without removing it.
  const starredList = filtered.filter((a) => starred.has(a.id)).slice(0, STAR_LIMIT);
  const allList = filtered.filter(
    (a) => source === 'all' || (source === 'official' ? a.official : !a.official),
  );
  const allShown = allList.slice(0, visible);

  const cardProps = (a: Agent) => ({
    a,
    on: starred.has(a.id),
    starDisabled: !starred.has(a.id) && atStarLimit,
    onToggle: () => toggleStar(a.id),
    onOpen: () => open(a.id),
  });

  const searching = query.length > 0;

  if (view === 'archive') {
    return (
      <ArchiveView
        onBack={() => {
          setView('catalog');
          if (typeof window !== 'undefined' && window.location.search) window.history.replaceState(null, '', '/portal/agents');
        }}
        onOpen={(id) => router.push('/portal/agents/' + id)}
      />
    );
  }

  return (
    <>
      <FPageHeader
        eyebrow="Platform"
        title="Agents"
        subtitle="Pre-built assistants scoped to a domain. Official ones are built by Equifax; the rest are shared by your teammates. Star up to 10 for quick access. Open one to start a chat already grounded in its context."
        actions={
          <>
            {/* Right→left button hierarchy: ember CTA · outline secondary · ghost tertiary. */}
            <Button type="button" variant="ghost"><Icons.book size={13} /> Docs</Button>
            <Button type="button" variant="outline" onClick={() => setView('archive')}><Icons.inbox size={13} /> Archive</Button>
            <Button type="button" variant="ember" onClick={() => router.push('/portal/agents/new')}><Icons.plus size={13} /> New agent</Button>
          </>
        }
      />

      {/* Toolbar — FSearch · grid/list toggle · count */}
      <div className="fp-toolbar">
        <FSearch
          value={q}
          onChange={setQ}
          placeholder="Filter by name, role, model, author…"
          aria-label="Filter agents"
          className="fp-agents-search"
        />
        <ToggleGroup
          type="single"
          variant="default"
          value={mode}
          onValueChange={(v) => v && setMode(v as 'grid' | 'list')}
          aria-label="View mode"
        >
          <ToggleGroupItem value="grid" aria-label="Grid view"><Icons.grid size={12} /></ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view"><Icons.list size={12} /></ToggleGroupItem>
        </ToggleGroup>
        <span className="fp-agents-count">{filtered.length} {filtered.length === 1 ? 'agent' : 'agents'}</span>
      </div>

      {/* ── Search results — a single flat set, no bands ── */}
      {searching ? (
        filtered.length === 0 ? (
          <div className="fp-agents-empty">
            <Icons.sparkle size={28} />
            <p>No agents match &ldquo;{q.trim()}&rdquo;.</p>
          </div>
        ) : mode === 'grid' ? (
          <div className="fp-grid fp-grid-auto">
            {filtered.map((a) => <AgentCard key={a.id} {...cardProps(a)} />)}
          </div>
        ) : (
          <div className="fp-agents-list">
            {filtered.map((a) => <AgentRow key={a.id} {...cardProps(a)} />)}
          </div>
        )
      ) : (
        <>
          {/* ── Starred band — carousel in grid, list in list mode ── */}
          {starredList.length > 0 && (
            <div className="fp-agents-section">
              <SectionHead icon={<Icons.star size={13} />} title="Starred" count={starredList.length} />
              {mode === 'grid' ? (
                <Carousel
                  opts={{ align: 'start', dragFree: true, containScroll: 'trimSnaps' }}
                  label="Starred agents"
                  className="fp-agents-carousel"
                >
                  {starredList.map((a) => (
                    <CarouselSlide key={a.id} width="268px">
                      <AgentCard {...cardProps(a)} />
                    </CarouselSlide>
                  ))}
                  <CarouselControls />
                  <CarouselDots />
                </Carousel>
              ) : (
                <div className="fp-agents-list">
                  {starredList.map((a) => <AgentRow key={a.id} {...cardProps(a)} />)}
                </div>
              )}
            </div>
          )}

          {/* ── The complete list (starred included) — grid or list, load-more ── */}
          <div className="fp-agents-section">
            <SectionHead
              title="All agents"
              count={allList.length}
              right={
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className="fp-agents-source" aria-label="Filter by source">
                      {SOURCE_OPTIONS.find((o) => o.value === source)?.label ?? 'All sources'}
                      <Icons.chevronDown size={13} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuRadioGroup
                      value={source}
                      onValueChange={(v) => setSource(v as 'all' | 'official' | 'collab')}
                      indicator="check"
                    >
                      {SOURCE_OPTIONS.map((o) => (
                        <DropdownMenuRadioItem key={o.value} value={o.value}>{o.label}</DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              }
            />
            {mode === 'grid' ? (
              <div className="fp-grid fp-grid-auto">
                {allShown.map((a) => <AgentCard key={a.id} {...cardProps(a)} />)}
              </div>
            ) : (
              <div className="fp-agents-list">
                {allShown.map((a) => <AgentRow key={a.id} {...cardProps(a)} />)}
              </div>
            )}
            {visible < allList.length && (
              <div className="fp-agents-more">
                <Button type="button" variant="ghost" onClick={() => setVisible((v) => v + PAGE)}>
                  <Icons.chevronDown size={13} /> Load more
                  <span className="kbd" style={{ marginInlineStart: 6 }}>{allList.length - visible}</span>
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
