'use client';
// Forge — MCP server catalog. Every Model Context Protocol server the internal
// teams have built, exposing bureau systems as tools agents can call.
//
// Brief — Persona: engineers building or operating agents. Question: what MCP
// servers exist, who maintains them, what tools do they expose, and how widely
// are they adopted? Data: SERVERS (src/portal/data/mcp.ts). Primary action:
// inspect a server's tools / connect it to an agent. Distinctive move: agent
// adoption and tool count per server, so the most-used internal servers stand
// out.
//
// Composes only Eidos DS + .fp-* classes (reuses the marketplace card grid).
import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Icons, Pill, Select } from '@/ds/core';
import { FPageHeader, FSearch } from '@/portal/shell/portal-shell';
import { KPIS, SERVERS, STATUS_META, TEAMS, type McpServer } from '@/portal/data/mcp';

const TEAM_OPTS = [{ value: 'all', label: 'All teams' }, ...TEAMS.map((t) => ({ value: t, label: t }))];
const TRANSPORT_OPTS = [
  { value: 'all', label: 'All transports' },
  { value: 'HTTP', label: 'HTTP' },
  { value: 'SSE', label: 'SSE' },
  { value: 'stdio', label: 'stdio' },
];

function ServerCard({ s }: { s: McpServer }) {
  const Icon = (Icons as Record<string, React.FC<{ size?: number }>>)[s.icon] ?? Icons.server;
  const st = STATUS_META[s.status];
  const router = useRouter();
  return (
    <div
      className="fp-skill"
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      aria-label={`Open ${s.name} details`}
      onClick={() => router.push(`/portal/mcp-servers/${s.id}`)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(`/portal/mcp-servers/${s.id}`); } }}
    >
      <div className="fp-skill-top">
        <span className={'fp-skill-ic' + (s.status === 'live' ? '' : ' is-muted')} aria-hidden="true"><Icon size={18} /></span>
        <Pill tone={st.tone} dot={s.status === 'live'}>{st.label}</Pill>
      </div>
      <span className="fp-skill-name mono">{s.name}</span>
      <p className="fp-skill-desc">{s.desc}</p>
      <div className="fp-skill-foot">
        <span className="fp-skill-meta">
          <Icons.toolCall size={12} /> {s.tools} tools
          <span className="fp-skill-dot">·</span>
          {s.agents} agents
        </span>
        <span className="fp-skill-cat">{s.transport}</span>
      </div>
      <div className="fp-skill-actions">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => e.stopPropagation()}
          asChild
        >
          <Link href={`/portal/mcp-servers/${s.id}`}><Icons.plus size={12} /> Connect</Link>
        </Button>
        <span className="fp-skill-ver">{s.team}</span>
      </div>
    </div>
  );
}

export default function McpServersPage() {
  const [query, setQuery] = React.useState('');
  const [team, setTeam] = React.useState('all');
  const [transport, setTransport] = React.useState('all');

  const filtered = React.useMemo(() => {
    let list = SERVERS;
    if (team !== 'all') list = list.filter((s) => s.team === team);
    if (transport !== 'all') list = list.filter((s) => s.transport === transport);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q) || s.team.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => b.agents - a.agents);
  }, [query, team, transport]);

  return (
    <>
      <FPageHeader
        eyebrow="Catalog"
        title="MCP servers"
        subtitle="Find the MCP servers your teams built and wire their tools into your agents."
        actions={
          <>
            <Button variant="ghost"><Icons.book size={13} /> Build guide</Button>
            <Button variant="ember"><Icons.plus size={13} /> Register server</Button>
          </>
        }
      />

      <div className="fp-grid fp-grid-4">
        {KPIS.map((k) => (
          <div key={k.id} className="fp-kpi">
            <span className="label">{k.label}</span>
            <div className="value">{k.value}</div>
            <p className="fp-kpi-note">{k.note}</p>
          </div>
        ))}
      </div>

      <div className="fp-toolbar" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        <div style={{ flex: 1, minWidth: 240, maxWidth: 420, display: 'flex' }}>
          <FSearch value={query} onChange={setQuery} placeholder="Search servers, teams…" aria-label="Search MCP servers" className="fluid" />
        </div>
        <span className="fp-filter-select">
          <Select value={team} onValueChange={setTeam} options={TEAM_OPTS} width="170px" />
        </span>
        <span className="fp-filter-select">
          <Select value={transport} onValueChange={setTransport} options={TRANSPORT_OPTS} width="150px" />
        </span>
      </div>

      <div className="fp-grid fp-grid-auto" style={{ marginBlockStart: 'var(--fp-section-gap, 18px)' }}>
        {filtered.map((s) => (
          <ServerCard key={s.id} s={s} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="fp-empty" style={{ marginBlockStart: 16 }}>
          <Icons.search size={18} />
          <span>No servers match this filter.</span>
        </div>
      )}
    </>
  );
}
