'use client';
// Forge IDP — AI Chat · Project detail.
//
// The page a user lands on after clicking a Pinned project in the chat
// sidebar. Reads ?project=<id> from the URL, picks the project's name +
// summary from chat-shell's PINNED list, and renders:
//
//   1. "← All projects" back link to /example/ai-projects
//   2. Project header card — folder tile + name + Private badge + star + ⋯
//   3. Canonical <PromptInput/> with the promo banner above
//   4. Two-column meta card — Project files (3 typed chips + add) +
//      Instructions preview with an edit affordance
//   5. "Chats in this project" — flat list of the project's threads
//
// Layout glue is page-local; every colour / radius / spacing comes from
// the DS tokens. Sidebar (rail + history) is the shared ChatShell so the
// Pinned row that opened this page stays ember-highlighted.
import * as React from 'react';
import {
  Icons,
  PromptInput, PromptBanner,
} from '@/ds/core';
import { ChatShell, PINNED, chatHref } from './chat-shell';

// ── File chip type → colour family ──────────────────────────────────────
// Plain tones, no skeuomorphic logos. The colour signals the file kind
// without burning the ember budget (ember stays on the page's CTAs).
type FileKind = 'xls' | 'doc' | 'pdf' | 'pptx' | 'csv';
const FILE_META: Record<FileKind, { label: string; bg: string; fg: string }> = {
  xls:  { label: 'XLS', bg: 'rgba(52, 211, 153, 0.14)', fg: '#34D399' },
  doc:  { label: 'DOC', bg: 'rgba(96, 165, 250, 0.16)', fg: '#60A5FA' },
  pdf:  { label: 'PDF', bg: 'rgba(248, 113, 113, 0.16)', fg: '#F87171' },
  pptx: { label: 'PPT', bg: 'rgba(251, 146, 60, 0.16)', fg: '#FB923C' },
  csv:  { label: 'CSV', bg: 'rgba(192, 132, 252, 0.16)', fg: '#C084FC' },
};

// ── Per-project content — files / instructions / chats ──────────────────
// One source of truth keyed by Pinned project id. Falls back to Pix tribe
// for any project not explicitly listed.
type ProjectPayload = {
  files: { kind: FileKind; name: string }[];
  instructions: string;
  chats: { id: string; title: string; preview: string; when: string }[];
};

const PROJECT_PAYLOAD: Record<string, ProjectPayload> = {
  'space-pix': {
    files: [
      { kind: 'xls', name: 'pix-rail-slos.xlsx' },
      { kind: 'pdf', name: 'incident-0421.pdf' },
      { kind: 'doc', name: 'on-call rota Q2.docx' },
    ],
    instructions:
      'Respond in a friendly, professional, and concise tone. Ground answers in the Pix tribe runbooks and prefer commands the on-call can paste.',
    chats: [
      { id: 'pix-p95',      title: 'Why is pix-router p95 climbing?',     preview: 'Looking at the last 6h of metrics…',              when: '14:01' },
      { id: 'pix-throttle', title: 'Pix throttle config — 06/04 spike',    preview: 'Add a 2s throttle on the offline path until…',   when: 'Yesterday' },
      { id: 'fraud-spike',  title: 'Fraud-engine error spike post-deploy', preview: 'The error is in the rule engine…',                when: '2d ago' },
      { id: 'merch-flag',   title: 'merchant-fee-v2 flag rollout review',  preview: 'Suggest cohort 2 (10%) for tomorrow…',           when: '3d ago' },
      { id: 'cost-pix',     title: 'Pix cost review — Q1',                 preview: 'Cloud Run accounts for 18% of the platform bill…', when: '1w ago' },
    ],
  },
  'space-incident': {
    files: [
      { kind: 'pdf', name: 'postmortem-template.pdf' },
      { kind: 'doc', name: 'incident-commander handbook.docx' },
      { kind: 'csv', name: 'incidents-2026Q1.csv' },
    ],
    instructions:
      'Draft postmortems in the Forge IC template. Keep tone neutral and blameless. Always include a timeline, contributing factors, and 3–5 corrective actions with owners.',
    chats: [
      { id: 'inc-1', title: 'Postmortem — payments outage 04/12', preview: 'Drafting timeline + corrective actions…',          when: '09:14' },
      { id: 'inc-2', title: 'Sev-1 review queue triage',           preview: 'Found 3 reviews missing owners…',                   when: 'Yesterday' },
      { id: 'inc-3', title: 'Blameless retro template polish',     preview: 'Switched "root cause" → "contributing factors"…',   when: '4d ago' },
      { id: 'inc-4', title: 'IC handoff process review',           preview: 'Documenting the explicit-confirmation step…',       when: '1w ago' },
    ],
  },
  'space-runbook': {
    files: [
      { kind: 'doc', name: 'rollback-playbook.docx' },
      { kind: 'doc', name: 'restore-from-snapshot.docx' },
      { kind: 'csv', name: 'runbook-index.csv' },
    ],
    instructions:
      'Author runbooks in the standard structure: Pre-flight → Cutover → Validation → Rollback → Post-deploy. Each step has owners + exact commands. Keep paragraphs under three sentences.',
    chats: [
      { id: 'rb-1', title: 'identity-svc → Aurora runbook',  preview: 'Drafted the migration runbook…',       when: '14:05' },
      { id: 'rb-2', title: 'kyc-orchestrator Ring 1 rollout', preview: 'Ring 1 starts with the LATAM cohort…', when: 'Yesterday' },
      { id: 'rb-3', title: 'data-export S3 restore drill',   preview: 'Drilled the restore path — 47 min…',   when: '3d ago' },
      { id: 'rb-4', title: 'ledger-svc replay procedure',    preview: 'Replay window is 24h max…',            when: '5d ago' },
    ],
  },
};

const App = () => {
  // Read ?project=<id> from URL; default to Pix tribe.
  const [projectId, setProjectId] = React.useState<string>('space-pix');
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const id = new URLSearchParams(window.location.search).get('project');
    if (id) setProjectId(id);
  }, []);

  const project = PINNED.find(p => p.id === projectId) || PINNED[0];
  const payload = PROJECT_PAYLOAD[project.id] || PROJECT_PAYLOAD['space-pix'];

  const [text, setText] = React.useState('');
  const [model, setModel] = React.useState('forge-sonnet-4-6');
  const [bannerShown, setBannerShown] = React.useState(true);
  const [starred, setStarred] = React.useState(false);

  return (
    <ChatShell
      side="recent"
      activeChat={project.id}
      crumbs={['Forge', 'AI', 'Projects', project.label]}
    >
      <div className="aipd">
        {/* Back link — pinned to the leading edge, mono caption */}
        <a className="aipd-back" href="/example/ai-projects">
          <Icons.arrowLeft size={13}/>
          <span>All projects</span>
        </a>

        {/* Project header — folder tile + title + Private badge + actions */}
        <header className="aipd-header">
          <div className="aipd-folder">
            <Icons.folder size={24}/>
          </div>
          <div className="aipd-title-block">
            <div className="title-row">
              <h1>{project.label}</h1>
              <span className="aipd-pill" aria-label="Private project">
                <Icons.lock size={11}/> Private
              </span>
            </div>
            <p className="aipd-sub">
              {payload.chats.length} {payload.chats.length === 1 ? 'chat' : 'chats'} ·{' '}
              {payload.files.length} {payload.files.length === 1 ? 'file' : 'files'} ·{' '}
              you and 4 others
            </p>
          </div>
          <div className="aipd-actions">
            <button
              type="button"
              className={'aipd-icon-btn' + (starred ? ' is-on' : '')}
              onClick={() => setStarred(v => !v)}
              aria-pressed={starred}
              aria-label="Star project"
              title={starred ? 'Unstar' : 'Star'}
            >
              <Icons.star size={15}/>
            </button>
            <button
              type="button"
              className="aipd-icon-btn"
              aria-label="More options"
              title="More"
            >
              <Icons.more size={16}/>
            </button>
          </div>
        </header>

        {/* Composer — same PromptInput used everywhere; the banner sits
            inside the field (v1.24+). Submit is the soft ember. */}
        <div className="aipd-composer">
          <PromptInput
            status="ready"
            value={text}
            onChange={setText}
            onSubmit={() => setText('')}
            modelValue={model}
            onModelChange={setModel}
            placeholder="How can I help you today?"
            elevated
            topBanner={bannerShown ? (
              <PromptBanner tone="promo" cta="Upgrade →" onDismiss={() => setBannerShown(false)}>
                Access premium models &amp; features
              </PromptBanner>
            ) : undefined}
            actions={[
              { id: 'upload', icon: 'upload',   label: 'Upload to this project' },
              { id: 'search', icon: 'search',   label: 'Deep search in catalog' },
              { id: 'tools',  icon: 'terminal', label: 'Run a tool' },
            ]}
          />
        </div>

        {/* Two-column meta — Project files + Instructions in one card */}
        <section className="aipd-meta" aria-label="Project context">
          <div className="aipd-meta-col">
            <div className="aipd-meta-head">
              <h3>Project files</h3>
              <span className="aipd-meta-count">
                {payload.files.length} {payload.files.length === 1 ? 'file' : 'files'}
              </span>
            </div>
            <div className="aipd-files">
              {payload.files.map(f => {
                const meta = FILE_META[f.kind];
                return (
                  <span
                    key={f.name}
                    className="aipd-file-chip"
                    style={{ background: meta.bg, color: meta.fg }}
                    title={f.name}
                  >
                    {meta.label}
                  </span>
                );
              })}
              <button
                type="button"
                className="aipd-file-add"
                aria-label="Add file"
                title="Add file"
              >
                <Icons.plus size={13}/>
              </button>
            </div>
          </div>

          <div className="aipd-meta-sep" role="separator"/>

          <div className="aipd-meta-col instructions">
            <div className="aipd-meta-head">
              <h3>Instructions</h3>
              <button
                type="button"
                className="aipd-icon-btn"
                aria-label="Edit instructions"
                title="Edit"
              >
                <Icons.edit size={13}/>
              </button>
            </div>
            <p className="aipd-instructions">{payload.instructions}</p>
          </div>
        </section>

        {/* Chats in this project — flat list, click → ai-chat-active */}
        <section className="aipd-chats" aria-label="Chats in this project">
          <div className="aipd-chats-head">
            <h3>Chats in this project</h3>
            <span className="aipd-meta-count">{payload.chats.length}</span>
          </div>
          <ul className="aipd-chats-list">
            {payload.chats.map(c => (
              <li key={c.id}>
                <a className="aipd-chat-row" href={chatHref(c.id)}>
                  <span className="aipd-chat-ico"><Icons.chat size={13}/></span>
                  <span className="aipd-chat-title">{c.title}</span>
                  <span className="aipd-chat-em">—</span>
                  <span className="aipd-chat-preview">{c.preview}</span>
                  <span className="aipd-chat-when">{c.when}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <style>{`
        .aipd {
          inline-size: 100%;
          max-inline-size: 880px;
          margin-inline: auto;
          padding: 24px 28px 56px;
          display: flex; flex-direction: column;
          gap: 22px;
        }

        /* Back link */
        .aipd-back {
          display: inline-flex; align-items: center; gap: 6px;
          align-self: flex-start;
          font-family: var(--font-sans); font-size: 13px; font-weight: 500;
          color: var(--fg-muted);
          text-decoration: none;
          padding: 4px 8px 4px 6px;
          border-radius: var(--radius-md);
          transition: background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);
        }
        .aipd-back:hover { background: var(--surface-hover); color: var(--fg); }
        .aipd-back svg { color: currentColor; }

        /* Header — folder tile + title + Private pill + actions */
        .aipd-header {
          display: grid;
          grid-template-columns: 48px 1fr auto;
          align-items: center;
          column-gap: 14px;
          padding-block: 8px 4px;
        }
        .aipd-folder {
          inline-size: 48px; block-size: 48px;
          display: inline-flex; align-items: center; justify-content: center;
          background: var(--ember-soft);
          color: var(--ember);
          border-radius: var(--radius-lg);
          flex: 0 0 auto;
        }
        .aipd-title-block { min-inline-size: 0; }
        .aipd-header .title-row {
          display: inline-flex; align-items: center; gap: 10px;
          flex-wrap: wrap;
        }
        .aipd-title-block h1 {
          font-size: 22px; font-weight: 600;
          color: var(--fg);
          letter-spacing: -0.01em;
          margin: 0;
        }
        .aipd-pill {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 2px 8px;
          background: var(--surface-active);
          border: 1px solid var(--border);
          border-radius: 999px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--fg-muted);
          letter-spacing: 0.04em;
        }
        .aipd-pill svg { color: var(--fg-subtle); }
        .aipd-sub {
          margin: 4px 0 0;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--fg-faint);
          letter-spacing: 0.02em;
        }
        .aipd-actions { display: inline-flex; gap: 4px; flex: 0 0 auto; }
        .aipd-icon-btn {
          inline-size: 32px; block-size: 32px;
          display: inline-flex; align-items: center; justify-content: center;
          background: transparent; border: 1px solid transparent;
          border-radius: var(--radius-md);
          color: var(--fg-subtle); cursor: pointer;
          transition: background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);
        }
        .aipd-icon-btn:hover { background: var(--surface-hover); color: var(--fg); }
        .aipd-icon-btn.is-on { color: var(--ember); }
        .aipd-icon-btn.is-on svg { fill: var(--ember); }

        /* Composer */
        .aipd-composer { display: flex; }
        .aipd-composer > .pi-shell { inline-size: 100%; max-inline-size: none; }

        /* Two-column meta card */
        .aipd-meta {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 1px minmax(0, 1fr);
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          overflow: hidden;
        }
        .aipd-meta-col { padding: 16px 18px; min-inline-size: 0; }
        .aipd-meta-sep { background: var(--border); inline-size: 1px; }
        .aipd-meta-head {
          display: flex; align-items: center; justify-content: space-between;
          gap: 8px;
          margin-block-end: 10px;
        }
        .aipd-meta-head h3 {
          font-size: 13px; font-weight: 600;
          color: var(--fg); margin: 0;
        }
        .aipd-meta-count {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--fg-faint);
          letter-spacing: 0.04em;
        }

        /* File chips */
        .aipd-files {
          display: flex; align-items: center; gap: 6px;
          flex-wrap: wrap;
        }
        .aipd-file-chip {
          inline-size: 36px; block-size: 36px;
          display: inline-flex; align-items: center; justify-content: center;
          border-radius: var(--radius-md);
          font-family: var(--font-mono);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.06em;
          cursor: default;
        }
        .aipd-file-add {
          inline-size: 36px; block-size: 36px;
          display: inline-flex; align-items: center; justify-content: center;
          background: transparent;
          border: 1px dashed var(--border-strong);
          border-radius: var(--radius-md);
          color: var(--fg-subtle); cursor: pointer;
          transition: border-color var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);
        }
        .aipd-file-add:hover { border-color: var(--ember); color: var(--ember); }

        .aipd-instructions {
          margin: 0;
          font-size: 12.5px; line-height: 1.55;
          color: var(--fg-muted);
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Chats list */
        .aipd-chats { display: flex; flex-direction: column; gap: 8px; }
        .aipd-chats-head {
          display: flex; align-items: center; gap: 8px;
          padding-inline: 4px;
        }
        .aipd-chats-head h3 {
          font-size: 13px; font-weight: 600;
          color: var(--fg); margin: 0;
        }
        .aipd-chats-list {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 2px;
        }
        .aipd-chat-row {
          display: grid;
          grid-template-columns: 28px auto auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 8px;
          padding: 12px 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          color: var(--fg);
          text-decoration: none;
          transition: background var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease);
        }
        .aipd-chat-row:hover {
          background: var(--bg-elevated);
          border-color: var(--border-strong);
        }
        .aipd-chat-ico {
          inline-size: 28px; block-size: 28px;
          display: inline-flex; align-items: center; justify-content: center;
          background: var(--ember-soft);
          color: var(--ember);
          border-radius: var(--radius-md);
        }
        .aipd-chat-title {
          font-size: 13px; font-weight: 600;
          color: var(--fg);
          white-space: nowrap;
        }
        .aipd-chat-em { color: var(--fg-faint); }
        .aipd-chat-preview {
          font-size: 12.5px;
          color: var(--fg-muted);
          min-inline-size: 0;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .aipd-chat-when {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--fg-faint);
          letter-spacing: 0.02em;
        }

        @media (max-width: 720px) {
          .aipd-meta {
            grid-template-columns: minmax(0, 1fr);
            grid-template-rows: auto 1px auto;
          }
          .aipd-meta-sep { block-size: 1px; inline-size: auto; }
          .aipd-chat-row {
            grid-template-columns: 28px 1fr auto;
            grid-template-areas:
              "ico title when"
              "ico preview preview";
            row-gap: 4px;
          }
          .aipd-chat-ico { grid-area: ico; }
          .aipd-chat-title { grid-area: title; }
          .aipd-chat-em { display: none; }
          .aipd-chat-preview { grid-area: preview; }
          .aipd-chat-when { grid-area: when; }
        }
      `}</style>
    </ChatShell>
  );
};

export default App;
