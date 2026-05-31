import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { History, HistoryGroup, HistoryItem, HistoryShell, Icons } from '@eidos/ui';

// ── Fixtures ─────────────────────────────────────────────────────────────────

const TODAY_THREADS = [
  { id: 't1', title: 'Summarise pix-router deploy risk', preview: 'The Ring 2 canary shows a p95 spike…', active: true },
  { id: 't2', title: 'Draft a GMUD for bureau-gateway', preview: 'Change window: Wed 02:00–04:00 BRT.' },
  { id: 't3', title: 'Blast radius for ADR-006 violation?', preview: 'The sync call added in PR #7421…', starred: true },
];

const YESTERDAY_THREADS = [
  { id: 't4', title: 'KYC doc validation parallelism', preview: 'You can run validations concurrently if…' },
  { id: 't5', title: 'Fraud score null pointer root cause', preview: 'user_agent was not sanitised before…' },
];

const OLDER_THREADS = [
  { id: 't6', title: 'ADR-002 — async-first rationale', preview: 'The decision was driven by the need to…' },
  { id: 't7', title: 'Canary rollback playbook review', preview: 'Step 1: kubectl rollout undo…' },
  { id: 't8', title: 'ClickHouse schema for audit trail', preview: 'Recommended partition key is `event_date`…' },
];

const meta = {
  title: 'AI/History',
  component: History,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A 280 px sidebar rail for conversation history. Renders a "New chat" CTA, a search ' +
          'field, and date-bucketed thread groups (Today / Yesterday / Older). Inline rename and ' +
          'delete are exposed on hover via `HistoryItem`. `HistoryShell` is a backward-compat alias.',
      },
    },
  },
  args: {
    fluid: false,
    query: '',
    showActions: true,
  },
  argTypes: {
    fluid: { control: 'boolean', description: 'Fill container width — use inside slide-out drawers.' },
    query: { control: 'text', description: 'Pre-populate the search field and highlight matches.' },
    showActions: { control: 'boolean', description: 'Show the panel-toggle icon button.' },
  },
} satisfies Meta<typeof History>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default rail with three date buckets. */
export const Default: Story = {
  render: (args) => (
    <History {...args}>
      <HistoryGroup label="Today" threads={TODAY_THREADS} />
      <HistoryGroup label="Yesterday" threads={YESTERDAY_THREADS} />
      <HistoryGroup label="Last 7 days" threads={OLDER_THREADS} />
    </History>
  ),
};

/** Empty state — no threads yet. */
export const Empty: Story = {
  render: (args) => <History {...args} />,
};

/** Fluid — for a slide-out panel or full-page layout. */
export const Fluid: Story = {
  args: { fluid: true },
  render: (args) => (
    <div style={{ width: 320 }}>
      <History {...args}>
        <HistoryGroup label="Today" threads={TODAY_THREADS} />
        <HistoryGroup label="Yesterday" threads={YESTERDAY_THREADS} />
      </History>
    </div>
  ),
};

/** With a search query active — the matched substring is highlighted in ember. */
export const WithSearch: Story = {
  args: { query: 'bureau' },
  render: (args) => (
    <History {...args}>
      <HistoryGroup label="Today" threads={TODAY_THREADS} query={args.query} />
      <HistoryGroup label="Yesterday" threads={YESTERDAY_THREADS} query={args.query} />
      <HistoryGroup label="Last 7 days" threads={OLDER_THREADS} query={args.query} />
    </History>
  ),
};

/** HistoryShell — canonical alias, identical rendering. */
export const ShellAlias: Story = {
  name: 'HistoryShell (alias)',
  render: () => (
    <HistoryShell>
      <HistoryGroup label="Today" threads={TODAY_THREADS} />
    </HistoryShell>
  ),
};

/** Single HistoryItem — active + starred state. */
export const ItemActiveStarred: Story = {
  name: 'HistoryItem — active + starred',
  render: () => (
    <div style={{ width: 280, border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
      <HistoryItem thread={{ id: 't1', title: 'Biometric step-up auth flow', preview: 'High-risk auth requires…', active: true, starred: true }} />
      <HistoryItem thread={{ id: 't2', title: 'Ledger batching performance', preview: 'BTREE batch inserts improved p95…' }} />
    </div>
  ),
};

/** Single HistoryGroup — date-bucket header + rows. */
export const GroupStandalone: Story = {
  name: 'HistoryGroup — standalone',
  render: () => (
    <div style={{ width: 280, border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
      <HistoryGroup label="Today" threads={TODAY_THREADS} />
    </div>
  ),
};

/** In context — simulates the full AI sidebar layout. */
export const InContext: Story = {
  render: () => (
    <div style={{ display: 'flex', height: 520, fontFamily: 'var(--font-sans)' }}>
      <History showActions>
        <HistoryGroup label="Today" threads={TODAY_THREADS} />
        <HistoryGroup label="Yesterday" threads={YESTERDAY_THREADS} />
        <HistoryGroup label="Last 7 days" threads={OLDER_THREADS} />
      </History>
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--fg-muted)', fontSize: 'var(--text-sm)',
        borderInlineStart: '1px solid var(--border)',
      }}>
        Chat area
      </div>
    </div>
  ),
};

/** By project — folder-style grouping (groupBy="project") with a coloured pill per project head. */
export const ByProject: Story = {
  name: 'By project (groupBy)',
  render: () => {
    const projects = [
      { id: 'p1', name: 'pix-router', color: 'ember', threads: TODAY_THREADS.slice(0, 2) },
      { id: 'p2', name: 'bureau-gateway', color: 'warning', threads: YESTERDAY_THREADS },
      { id: 'p3', name: 'audit-trail', color: 'ice', threads: OLDER_THREADS.slice(0, 1) },
    ];
    return (
      <History>
        <div className="ai-hist-list">
          {projects.map((p) => (
            <div className="ai-hist-group" key={p.id}>
              <div className="ai-hist-group-head">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span className={'pill ' + p.color}>
                    <Icons.folder size={9} /> {p.name}
                  </span>
                </span>
                <span>{p.threads.length}</span>
              </div>
              {p.threads.map((t) => (
                <HistoryItem key={t.id} thread={t} />
              ))}
            </div>
          ))}
        </div>
      </History>
    );
  },
};

/** Inline rename — clicking a row swaps it for a labelled rename input; Enter/Esc commit or abandon (useState-driven). */
export const InlineRename: Story = {
  name: 'Inline rename / delete',
  render: () => {
    const [editingId, setEditingId] = React.useState<string | null>('t2');
    const [draft, setDraft] = React.useState('Draft a GMUD — bureau-gateway');
    return (
      <History>
        <div className="ai-hist-list">
          <div className="ai-hist-group">
            <div className="ai-hist-group-head">
              <span>Today</span>
              <span>{TODAY_THREADS.length}</span>
            </div>
            {TODAY_THREADS.map((t) =>
              t.id === editingId ? (
                <div key={t.id} className="ai-hist-rename">
                  <input
                    autoFocus
                    aria-label="Rename thread"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === 'Escape') setEditingId(null);
                    }}
                  />
                  <button className="act" title="Save" onClick={() => setEditingId(null)}>
                    <Icons.check size={12} />
                  </button>
                  <button className="act" title="Cancel" onClick={() => setEditingId(null)}>
                    <Icons.x size={12} />
                  </button>
                </div>
              ) : (
                <HistoryItem key={t.id} thread={t} onActivate={() => setEditingId(t.id)} />
              ),
            )}
          </div>
        </div>
      </History>
    );
  },
};

/** Mobile slide-out — the rail collapses behind a hamburger; tap to open the drawer, tap the scrim to close (useState-driven). */
export const MobileDrawer: Story = {
  name: 'Mobile slide-out',
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <div style={{ width: 340, height: 520, position: 'relative', overflow: 'hidden', border: '1px dashed var(--border)', borderRadius: 14 }}>
        {/* simulated app bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderBlockEnd: '1px solid var(--border)', background: 'var(--surface)' }}>
          <button className="ai-hist-icon-btn" title="Open history" onClick={() => setOpen(true)}>
            <Icons.menu size={14} />
          </button>
          <span style={{ fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--fg)' }}>Eidos AI</span>
          <span style={{ flex: 1 }} />
          <button className="ai-hist-icon-btn" title="More">
            <Icons.more size={14} />
          </button>
        </div>
        {/* main content placeholder */}
        <div style={{ padding: 16, color: 'var(--fg-muted)', fontSize: 'var(--text-sm)' }}>
          Tap the menu icon to open history. The drawer slides in from the leading edge and the chat dims behind it.
        </div>
        {/* drawer */}
        {open && (
          <>
            <div
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1, cursor: 'pointer' }}
              onClick={() => setOpen(false)}
            />
            <div
              style={{
                position: 'absolute',
                insetBlock: 0,
                insetInlineStart: 0,
                width: 260,
                zIndex: 2,
                background: 'var(--bg-elevated)',
                borderInlineEnd: '1px solid var(--border-strong)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <History fluid showActions={false}>
                <div className="ai-hist-list">
                  <HistoryGroup label="Today" threads={TODAY_THREADS.slice(0, 2)} />
                  <HistoryGroup label="Yesterday" threads={YESTERDAY_THREADS.slice(0, 1)} />
                </div>
              </History>
            </div>
          </>
        )}
      </div>
    );
  },
};
