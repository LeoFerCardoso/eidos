'use client';
// Forge — Teams. The org structure for a region: Alliance → Tribe → Squad →
// People. A person can belong to more than one squad, so the People tab is a
// flat roster (each person carries their squad membership as pills), while the
// Structure tab walks the hierarchy. Squad ↔ service ownership is derived from
// services.ts, so Teams and the Catalog speak one vocabulary.
import * as React from 'react';
import {
  Button,
  Icons,
  Pill,
  Select,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/ds/core';
import {
  FPageHeader,
  FKpi,
  FSearch,
  FRows,
  FRow,
  Sub,
  PersonAvatar,
  AvatarStack,
} from '@/portal/shell/portal-shell';
import { usePersistentState } from '@/portal/shell/use-persistent-state';
import {
  ALLIANCES,
  SQUADS,
  PEOPLE,
  REGIONS,
  ORG_STATS,
  getPerson,
  getSquad,
  peopleInSquad,
  peopleInSquads,
  squadsInTribe,
  squadIdsInAlliance,
  servicesInSquad,
  type Person,
} from '@/portal/data/teams';

// ── People roster row ─────────────────────────────────────────────────────────

function PersonRow({ person }: { person: Person }) {
  return (
    <FRow>
      <PersonAvatar initials={person.initials} size={32} title={person.name} />
      <div className="fp-row-main">
        <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{person.name}</div>
        <Sub muted>{person.role}</Sub>
      </div>
      <div className="fp-tags" style={{ justifyContent: 'flex-end' }}>
        {person.squads.map((sid) => {
          const sq = getSquad(sid);
          return sq ? (
            <Pill key={sid} tone="neutral" style={{ border: '1px solid var(--border)' }}>
              {sq.name.replace(/^Squad\s+/, '')}
            </Pill>
          ) : null;
        })}
      </div>
      <span
        className="mono"
        style={{ color: 'var(--fg-faint)', fontSize: 'var(--text-xs)', minInlineSize: 200, textAlign: 'end' }}
      >
        {person.email}
      </span>
    </FRow>
  );
}

// ── Squad row (expandable to its roster) ────────────────────────────────────────

function SquadRow({ squadId }: { squadId: string }) {
  const [open, setOpen] = React.useState(false);
  const squad = getSquad(squadId);
  if (!squad) return null;
  const members = peopleInSquad(squadId);
  const lead = getPerson(squad.leadId);
  const svc = servicesInSquad(squadId);

  return (
    <div>
      <FRow
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{ cursor: 'pointer' }}
      >
        <Icons.chevronRight
          size={14}
          style={{
            color: 'var(--fg-faint)',
            transform: open ? 'rotate(90deg)' : 'none',
            transition: 'transform .14s ease',
            flexShrink: 0,
          } as React.CSSProperties}
        />
        <div className="fp-row-main">
          <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{squad.name}</div>
          <Sub muted>{squad.mission}</Sub>
        </div>
        {lead && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, minInlineSize: 150 }}>
            <PersonAvatar initials={lead.initials} size={22} title={lead.name} />
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>
              {lead.name.split(' ')[0]} · lead
            </span>
          </span>
        )}
        <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', minInlineSize: 72, textAlign: 'end' }}>
          {svc} svc
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minInlineSize: 132, justifyContent: 'flex-end' }}>
          <AvatarStack people={members.map((m) => ({ initials: m.initials, name: m.name }))} max={4} size={22} />
          <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)' }}>
            {members.length}
          </span>
        </span>
      </FRow>

      {open && (
        <ul className="fp-resp" style={{ padding: '4px 0 12px 28px' }}>
          {members.map((m) => (
            <li key={m.id} className="fp-resp-row">
              <PersonAvatar initials={m.initials} size={26} title={m.name} />
              <span className="fp-resp-id">
                <span className="fp-resp-name">{m.name}</span>
                <span className="fp-resp-role">{m.role} · {m.email}</span>
              </span>
              <div className="fp-tags" style={{ justifyContent: 'flex-end', flexShrink: 0 }}>
                {m.id === squad.leadId && <Pill tone="ember">Lead</Pill>}
                {m.squads.length > 1 && (
                  <Pill tone="neutral" style={{ border: '1px solid var(--border)' }}>
                    <Icons.network size={10} /> {m.squads.length} squads
                  </Pill>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

const ROLES = ['All roles', ...Array.from(new Set(PEOPLE.map((p) => p.role)))];

export default function TeamsPage() {
  const [wsIndex] = usePersistentState('forge.workspace', 0);
  const [regionId, setRegionId] = React.useState(() => REGIONS[wsIndex]?.id ?? REGIONS[0].id);
  const region = REGIONS.find((r) => r.id === regionId) ?? REGIONS[0];

  const [query, setQuery] = React.useState('');
  const [role, setRole] = React.useState('All roles');

  const roster = React.useMemo(() => {
    let list = PEOPLE;
    if (role !== 'All roles') list = list.filter((p) => p.role === role);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.role.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.squads.some((sid) => getSquad(sid)?.name.toLowerCase().includes(q)),
      );
    }
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }, [query, role]);

  const regionOptions = REGIONS.map((r) => ({ value: r.id, label: `${r.name} · ${r.location}` }));

  return (
    <>
      <FPageHeader
        eyebrow="Organization"
        title="Teams"
        subtitle={
          region.modelled
            ? `${region.name} · ${region.location} · ${ORG_STATS.people} people across ${ORG_STATS.squads} squads`
            : `${region.name} · ${region.location}`
        }
        actions={
          <span className="fp-filter-select">
            <Select value={regionId} onValueChange={setRegionId} options={regionOptions} width="280px" />
          </span>
        }
      />

      {!region.modelled ? (
        <div className="fp-empty" style={{ marginBlockStart: 24 }}>
          <Icons.network size={22} />
          <div style={{ fontWeight: 600, marginBlockStart: 8 }}>Structure managed locally</div>
          <div style={{ color: 'var(--fg-muted)', maxInlineSize: 420, marginInlineStart: 'auto', marginInlineEnd: 'auto' }}>
            The org chart for {region.name} is owned by its regional platform team and is not
            mirrored into this workspace. Switch to Equifax BVS to explore the Latam structure.
          </div>
          <Button variant="outline" style={{ marginBlockStart: 14 }} onClick={() => setRegionId('bvs')}>
            View Equifax BVS
          </Button>
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="fp-grid fp-grid-4">
            <FKpi label="Alliances" value={ORG_STATS.alliances} sub={<Sub muted>business lines</Sub>} />
            <FKpi label="Tribes" value={ORG_STATS.tribes} sub={<Sub muted>domain areas</Sub>} />
            <FKpi label="Squads" value={ORG_STATS.squads} sub={<Sub muted>delivery teams</Sub>} />
            <FKpi label="People" value={ORG_STATS.people} sub={<Sub muted>engineers, PMs, SREs</Sub>} />
          </div>

          <div style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
            <Tabs defaultValue="structure" className="fp-flat-tabs">
              <TabsList>
                <TabsTrigger value="structure">Structure</TabsTrigger>
                <TabsTrigger value="people">People</TabsTrigger>
              </TabsList>

              {/* Structure — Alliance → Tribe → Squad → (expand) People */}
              <TabsContent value="structure">
                {ALLIANCES.map((alliance) => {
                  const lead = getPerson(alliance.leadId);
                  const sqIds = squadIdsInAlliance(alliance);
                  const headcount = peopleInSquads(sqIds).length;
                  return (
                    <section key={alliance.id} className="fp-section">
                      <div className="fp-card-head" style={{ alignItems: 'flex-start' }}>
                        <div>
                          <div className="fp-card-title">{alliance.name}</div>
                          <Sub muted>{alliance.mission}</Sub>
                        </div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                          {lead && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                              <PersonAvatar initials={lead.initials} size={24} title={lead.name} />
                              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>
                                {lead.name} · alliance lead
                              </span>
                            </span>
                          )}
                          <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)' }}>
                            {alliance.tribes.length} tribes · {sqIds.length} squads · {headcount} people
                          </span>
                        </span>
                      </div>

                      {alliance.tribes.map((tribe) => (
                        <div key={tribe} style={{ marginBlockStart: 12 }}>
                          <div
                            className="t-mono-label"
                            style={{ color: 'var(--fg-muted)', marginBlockEnd: 6, display: 'flex', alignItems: 'center', gap: 8 }}
                          >
                            <Icons.layers size={12} /> {tribe}
                          </div>
                          <FRows>
                            {squadsInTribe(tribe).map((sq) => (
                              <SquadRow key={sq.id} squadId={sq.id} />
                            ))}
                          </FRows>
                        </div>
                      ))}
                    </section>
                  );
                })}
              </TabsContent>

              {/* People — flat searchable roster */}
              <TabsContent value="people">
                <div className="fp-toolbar" style={{ marginBlockStart: 4 }}>
                  <div style={{ flex: 1, minWidth: 240, maxWidth: 460, display: 'flex' }}>
                    <FSearch
                      value={query}
                      onChange={setQuery}
                      placeholder="Filter by name, role, squad, email…"
                      aria-label="Filter people"
                      className="fluid"
                    />
                  </div>
                  <span className="fp-filter-select">
                    <Select
                      value={role}
                      onValueChange={setRole}
                      options={ROLES.map((r) => ({ value: r, label: r }))}
                      width="200px"
                    />
                  </span>
                </div>

                {roster.length === 0 ? (
                  <div className="fp-empty" style={{ marginBlockStart: 16 }}>
                    <Icons.user size={20} />
                    <div style={{ marginBlockStart: 8 }}>No people match your filters.</div>
                  </div>
                ) : (
                  <div style={{ marginBlockStart: 14 }}>
                    <FRows>
                      {roster.map((p) => (
                        <PersonRow key={p.id} person={p} />
                      ))}
                    </FRows>
                  </div>
                )}

                <div style={{ marginBlockStart: 12, fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>
                  {roster.length} of {PEOPLE.length} people
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </>
  );
}
