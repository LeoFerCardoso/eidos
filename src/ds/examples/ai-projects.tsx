'use client';
// Forge IDP — AI Chat · Projects gallery.
//
// Click "Projects" in the chat sidebar (or visit the page directly) to land
// here. Grid of project tiles, each opens its detail view. Uses ChatShell
// so the sidebar stays in place + the "Projects" row is ember-active.
//
// Improvements over the prior version: 8 projects (was 6), a richer tile
// (icon tile + name + description + 3 mono stats — chats / docs / updated),
// proper page header (eyebrow + title + subtitle + Create CTA), and a more
// balanced grid (auto-fill, 280px minimum so tiles always sit on a clean
// row at any width).
import * as React from 'react';
import { Icons } from '@/ds/core';
import { ChatShell } from './chat-shell';

interface Project {
  id: string;
  name: string;
  desc: string;
  icon: string;
  chats: number;
  docs: number;
  updated: string;
}

const PROJECTS: Project[] = [
  { id: 'pix-tribe',         name: 'Pix tribe',           desc: 'Reliability, fraud, ledger consistency — the on-call workspace for the Pix payment rail.',  icon: 'gauge',     chats: 38, docs: 22, updated: '2h ago' },
  { id: 'incident-library',  name: 'Incident library',    desc: 'Postmortems, RCA drafts and incident command runbooks since 2024.',                         icon: 'incident',  chats: 21, docs: 84, updated: '6h ago' },
  { id: 'runbooks',          name: 'Runbooks',            desc: 'Operational playbooks for every prod service — rollback, restore, throttle, replay.',       icon: 'book',      chats: 12, docs: 41, updated: 'Yesterday' },
  { id: 'kyc-flow',          name: 'KYC orchestrator',    desc: 'Ring-rollout plans, scoring + LATAM cohort migrations for the KYC orchestrator.',           icon: 'shield',    chats: 17, docs: 12, updated: '2d ago' },
  { id: 'data-platform',     name: 'Data platform',       desc: 'Schema drift, cost reviews, table ownership and freshness checks.',                         icon: 'database',  chats: 9,  docs: 18, updated: '3d ago' },
  { id: 'release-notes',     name: 'Release notes',       desc: 'Drafts and signed-off changelogs for every prod release this quarter.',                     icon: 'pipeline',  chats: 26, docs: 53, updated: '4d ago' },
  { id: 'sast-sweeps',       name: 'SAST sweeps',         desc: 'Quarterly security sweeps across the service catalog with auto-triaged findings.',          icon: 'shield',    chats: 5,  docs: 9,  updated: '6d ago' },
  { id: 'cost-reviews',      name: 'Cost reviews',        desc: 'Cloud cost analysis, reserved-instance planning, and rightsizing recommendations.',          icon: 'cloud',     chats: 11, docs: 27, updated: '1w ago' },
];

const App = () => {
  const [q, setQ] = React.useState('');
  const filtered = PROJECTS.filter(p =>
    !q || p.name.toLowerCase().includes(q.toLowerCase())
       || p.desc.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <ChatShell side="projects" crumbs={['Forge', 'AI', 'Projects']}>
      <div className="aic-projects">
        {/* Page header — eyebrow + title + lede + CTA. Eyebrow uses the
            mono caption convention from the DS so the page locates itself
            in the IA without a big breadcrumb-style bar. */}
        <header className="aic-projects-head">
          <div className="head-left">
            <span className="eyebrow">Forge AI · Projects</span>
            <h1>Your project workspaces</h1>
            <p className="lede">
              Group conversations, docs and runbooks by scope. Each project keeps its
              own context so the assistant grounds its answers in only the right
              files for that workspace.
            </p>
          </div>
          <button className="btn ember aic-projects-create">
            <Icons.plus size={13}/> Create project
          </button>
        </header>

        {/* Toolbar — search on leading edge, sort on trailing edge. */}
        <div className="aic-projects-toolbar">
          <div className="in-group aic-projects-search">
            <span className="in-addon"><Icons.search size={13}/></span>
            <input
              className="in-control"
              type="search"
              placeholder="Search projects…"
              value={q}
              onChange={e => setQ(e.target.value)}
              aria-label="Search projects"
            />
          </div>
          <div className="aic-projects-toolbar-end">
            <span className="aic-projects-count">
              {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
            </span>
            <button className="btn sm outline">
              <span style={{ color: 'var(--fg-muted)' }}>Sort:</span>
              <span>Recent activity</span>
              <Icons.chevronDown size={11}/>
            </button>
          </div>
        </div>

        {/* Tile grid — clicking a tile routes to /example/ai-project-detail
            with the matching pinned-project id, so the sidebar's Pinned row
            stays in sync with what the user just opened. Projects without a
            pinned equivalent fall back to the default project context. */}
        <div className="aic-projects-grid">
          {filtered.map(p => {
            const I = (Icons as any)[p.icon] || Icons.folder;
            // Map tile id → pinned-project id so the sidebar highlights
            // the matching row when the detail page renders.
            const TILE_TO_PROJECT: Record<string, string> = {
              'pix-tribe':         'space-pix',
              'incident-library':  'space-incident',
              'runbooks':          'space-runbook',
            };
            const projectId = TILE_TO_PROJECT[p.id];
            const href = projectId
              ? '/example/ai-project-detail?project=' + projectId
              : '/example/ai-project-detail';
            return (
              <a key={p.id} className="aic-projects-card" href={href}>
                <span className="ic"><I size={16}/></span>
                <div className="title">{p.name}</div>
                <div className="desc">{p.desc}</div>
                <div className="stats">
                  <span><b>{p.chats}</b> chats</span>
                  <span className="dot">·</span>
                  <span><b>{p.docs}</b> docs</span>
                  <span className="dot">·</span>
                  <span className="updated">{p.updated}</span>
                </div>
              </a>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="aic-projects-empty">
            <Icons.folder size={28}/>
            <p>No projects match <code>{q}</code>.</p>
          </div>
        )}
      </div>

      <style>{`
        .aic-projects {
          inline-size: 100%;
          max-inline-size: 1120px;
          margin-inline: auto;
          padding: 32px 28px 48px;
        }

        /* Header — title block + create CTA on a single row. The CTA is the
           ONLY ember on this page (count budget). */
        .aic-projects-head {
          display: flex;
          align-items: flex-start;
          gap: 18px;
          margin-block-end: 24px;
        }
        .aic-projects-head .head-left { flex: 1 1 auto; min-inline-size: 0; }
        .aic-projects-head .eyebrow {
          font-family: var(--font-mono);
          font-size: 10.5px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--ember);
        }
        .aic-projects-head h1 {
          font-size: 24px; font-weight: 600;
          color: var(--fg);
          letter-spacing: -0.015em;
          margin: 6px 0 6px;
        }
        .aic-projects-head .lede {
          font-size: 13.5px; line-height: 1.55;
          color: var(--fg-muted);
          margin: 0;
          max-inline-size: 64ch;
        }
        .aic-projects-create {
          flex: 0 0 auto;
          align-self: center;
        }

        /* Toolbar */
        .aic-projects-toolbar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-block-end: 20px;
        }
        .aic-projects-search { flex: 1 1 auto; max-inline-size: 360px; }
        .aic-projects-toolbar-end {
          display: flex; align-items: center; gap: 10px;
          margin-inline-start: auto;
        }
        .aic-projects-count {
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--fg-muted);
        }

        /* Tile grid — auto-fill so cards sit on clean rows at any width. */
        .aic-projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 14px;
        }
        .aic-projects-card {
          display: grid;
          grid-template-rows: auto auto 1fr auto;
          gap: 6px;
          padding: 18px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          color: var(--fg);
          text-decoration: none;
          transition: background var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease);
          min-block-size: 152px;
        }
        .aic-projects-card:hover {
          background: var(--bg-elevated);
          border-color: var(--border-strong);
          transform: translateY(-1px);
        }
        .aic-projects-card .ic {
          display: inline-flex; align-items: center; justify-content: center;
          inline-size: 32px; block-size: 32px;
          background: var(--ember-soft);
          color: var(--ember);
          border-radius: var(--radius-md);
          margin-block-end: 4px;
        }
        .aic-projects-card .title {
          font-size: 14px; font-weight: 600;
          color: var(--fg);
        }
        .aic-projects-card .desc {
          font-size: 12.5px; line-height: 1.5;
          color: var(--fg-muted);
          align-self: start;
        }
        .aic-projects-card .stats {
          display: flex; align-items: center; gap: 6px;
          padding-block-start: 8px;
          margin-block-start: auto;
          border-block-start: 1px solid var(--border);
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--fg-faint);
          letter-spacing: 0.02em;
        }
        .aic-projects-card .stats b {
          color: var(--fg);
          font-weight: 600;
        }
        .aic-projects-card .stats .dot { color: var(--fg-faint); }
        .aic-projects-card .stats .updated {
          margin-inline-start: auto;
          color: var(--fg-faint);
        }

        .aic-projects-empty {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 10px;
          padding: 48px 0;
          color: var(--fg-faint);
        }
        .aic-projects-empty code {
          color: var(--fg-muted);
          font-family: var(--font-mono);
          font-size: 12px;
        }
      `}</style>
    </ChatShell>
  );
};

export default App;
