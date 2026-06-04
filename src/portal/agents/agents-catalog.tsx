'use client';
// Forge — Agents catalog. A top-level portal page (rail item between Catalog
// and Templates), following the external-page format: FPageHeader + the padded
// content column + the DS .fp-grid auto grid. Each card opens a fresh chat with
// that agent (/portal/chat?agent=<id>). Mirrors the DS agent-catalog example.
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Icons, Avatar, Pill } from '@/ds/core';
import { FPageHeader } from '@/portal/shell/portal-shell';
import { AGENTS } from '@/portal/data/agents';

export default function AgentsCatalog() {
  const router = useRouter();
  const [q, setQ] = React.useState('');
  const open = (id: string) => router.push('/portal/chat?agent=' + id);

  const filtered = AGENTS.filter((a) => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return (
      a.name.toLowerCase().includes(s) ||
      a.role.toLowerCase().includes(s) ||
      a.desc.toLowerCase().includes(s) ||
      a.model.toLowerCase().includes(s)
    );
  });

  return (
    <>
      <FPageHeader
        eyebrow="Platform"
        title="Agents"
        subtitle="Pre-built assistants scoped to a domain — each ships its own tools, instructions and model. Open one to start a chat already grounded in its context."
        actions={
          <>
            <button type="button" className="btn ghost"><Icons.book size={13} /> Docs</button>
            <button type="button" className="btn ember"><Icons.plus size={13} /> New agent</button>
          </>
        }
      />

      {/* Toolbar — the canonical DS search field (⌘K hint / clear-✕). */}
      <div className="fp-agents-toolbar">
        <div className="in-group fp-agents-search">
          <span className="in-addon icon"><Icons.search size={13} /></span>
          <input
            className="in-control"
            placeholder="Filter by name, role, model…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Filter agents"
          />
          {q ? (
            <button type="button" className="in-addon btn" onClick={() => setQ('')} aria-label="Clear search">
              <Icons.x size={13} />
            </button>
          ) : (
            <span className="in-addon" style={{ paddingInline: 10 }}><span className="kbd">⌘K</span></span>
          )}
        </div>
        <span className="fp-agents-count">{filtered.length} {filtered.length === 1 ? 'agent' : 'agents'}</span>
      </div>

      <div className="fp-grid fp-grid-auto">
        {filtered.map((a) => (
          <button key={a.id} type="button" className="fp-agents-card" onClick={() => open(a.id)} aria-label={`Open ${a.name}`}>
            <div className="head">
              <Avatar name={a.name} size={40} />
              <div className="id">
                <div className="name">{a.name}</div>
                <div className="role">{a.role}</div>
              </div>
              <Pill tone="neutral" icon={<Icons.sparkle size={10} />} className="fp-agents-model">{a.model}</Pill>
            </div>
            <div className="desc">{a.desc}</div>
            <div className="stats">
              <span><b>{a.tools}</b> tools</span><span className="dot">·</span>
              <span><b>{a.chats}</b> chats</span>
              <span className="updated">{a.updated}</span>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="fp-agents-empty" style={{ gridColumn: '1 / -1' }}>
            <Icons.sparkle size={28} />
            <p>No agents match &ldquo;{q.trim()}&rdquo;.</p>
          </div>
        )}
      </div>
    </>
  );
}
