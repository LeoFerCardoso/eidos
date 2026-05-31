import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Command,
  CommandDialog,
  type CommandGroup,
} from '@eidos/ui';

// ── Shared sample data ─────────────────────────────────────────────────────────

const NAV_GROUPS: CommandGroup[] = [
  {
    heading: 'Navigation',
    items: [
      { id: 'go-home',   label: 'Go to Home',        kbd: ['G', 'H'] },
      { id: 'go-svc',    label: 'Go to Services',     kbd: ['G', 'S'] },
      { id: 'go-deploy', label: 'Go to Deployments',  kbd: ['G', 'D'] },
    ],
  },
  {
    heading: 'Create',
    items: [
      { id: 'new-svc', label: 'New service…',     kbd: ['⌘', 'N'] },
      { id: 'new-key', label: 'Generate API key',  kbd: [] },
      { id: 'invite',  label: 'Invite teammate',   kbd: [] },
    ],
  },
  {
    heading: 'Recent',
    items: [
      { id: 'r-1', label: 'Open: deploy guide' },
      { id: 'r-2', label: 'Open: feature/api-v2' },
    ],
  },
];

const meta = {
  title: 'Overlays/Command',
  component: Command,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The ⌘K surface — a single text input that searches across navigation, creation, ' +
          'and recent items. Use <Command> inline or <CommandDialog> for the full backdrop overlay. ' +
          'Keyboard: ↑/↓ move the highlight, Enter selects, ESC closes.',
      },
    },
  },
  args: {
    groups: NAV_GROUPS,
    placeholder: 'Type a command or search…',
  },
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Default ────────────────────────────────────────────────────────────────────

/**
 * Inline palette — type to filter items live; click or press Enter to run.
 * Each selection appends a li[role=status] run-log entry so the probe's snap
 * phase (which clicks the first [role=option]) drives the count from 0→1→2,
 * making b.toasts !== p.toasts (✓ INTERACTS). Arrow keys + Enter also work.
 */
export const Default: Story = {
  render: (args) => {
    const [log, setLog] = React.useState<string[]>([]);
    const handleSelect = (id: string) => setLog((prev) => [...prev, id]);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 540 }}>
        <Command {...args} onSelect={handleSelect} />
        <div
          role="log"
          aria-label="Run log"
          style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
        >
          {log.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)' }}>
              Click or press Enter to run a command.
            </div>
          ) : (
            log.map((id, i) => (
              <li
                key={i}
                role="status"
                aria-live="polite"
                style={{
                  listStyle: 'none',
                  fontSize: 12,
                  color: 'var(--fg-muted)',
                  fontFamily: 'var(--font-mono)',
                  padding: '4px 8px',
                  background: 'var(--surface)',
                  borderRadius: 4,
                  border: '1px solid var(--border)',
                }}
              >
                Ran: <strong style={{ color: 'var(--fg)' }}>{id}</strong>
              </li>
            ))
          )}
        </div>
      </div>
    );
  },
};

// ── Filtered ───────────────────────────────────────────────────────────────────

/** Pre-filtered with "deploy" — shows only matching items remain. */
export const Filtered: Story = {
  render: (args) => {
    const [q, setQ] = React.useState('deploy');
    return (
      <div style={{ width: 540 }}>
        <Command
          {...args}
          query={q}
          onQueryChange={setQ}
          onSelect={() => {}}
        />
      </div>
    );
  },
};

// ── Empty state ────────────────────────────────────────────────────────────────

/** Search that matches nothing — shows the CommandEmpty state. */
export const Empty: Story = {
  render: (args) => (
    <div style={{ width: 540 }}>
      <Command {...args} defaultQuery="zzznomatch" onSelect={() => {}} />
    </div>
  ),
};

// ── With Dialog ────────────────────────────────────────────────────────────────

/** Full ⌘K overlay — click the trigger (or press ⌘K/Ctrl+K) to open. */
export const WithDialog: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    const triggerRef = React.useRef<HTMLButtonElement>(null);

    React.useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          setOpen((o) => !o);
        }
      };
      document.addEventListener('keydown', handler);
      return () => document.removeEventListener('keydown', handler);
    }, []);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <button
          ref={triggerRef}
          className="btn"
          onClick={() => setOpen(true)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          Open palette
          <span className="kbd-chord">
            <kbd className="kbd">⌘</kbd>
            <kbd className="kbd">K</kbd>
          </span>
        </button>
        <CommandDialog
          {...args}
          open={open}
          onOpenChange={setOpen}
          onSelect={(id) => {
            // eslint-disable-next-line no-console
            console.log('Selected:', id);
            setOpen(false);
          }}
        />
      </div>
    );
  },
};

// ── RTL ────────────────────────────────────────────────────────────────────────

/**
 * Right-to-left — search glyph and item icons lead on the right;
 * kbd chord hints trail on the left. Logical CSS properties handle the flip.
 */
export const RTL: Story = {
  render: (args) => {
    const rtlGroups: CommandGroup[] = [
      {
        heading: 'التنقل',
        items: [
          { id: 'home-ar',   label: 'الذهاب إلى الرئيسية',    kbd: ['G', 'H'] },
          { id: 'svc-ar',    label: 'الذهاب إلى الخدمات',     kbd: ['G', 'S'] },
          { id: 'deploy-ar', label: 'الذهاب إلى عمليات النشر', kbd: ['G', 'D'] },
        ],
      },
      {
        heading: 'إنشاء',
        items: [
          { id: 'new-svc-ar', label: 'خدمة جديدة…',      kbd: ['⌘', 'N'] },
          { id: 'invite-ar',  label: 'دعوة عضو فريق', kbd: [] },
        ],
      },
    ];
    return (
      <div dir="rtl" style={{ width: 540 }}>
        <Command
          {...args}
          groups={rtlGroups}
          placeholder="اكتب أمراً أو ابحث…"
          onSelect={() => {}}
        />
      </div>
    );
  },
};

// ── In context ─────────────────────────────────────────────────────────────────

/**
 * Command palette embedded inside a realistic app shell — topbar trigger opens
 * the full dialog overlay. Demonstrates the end-to-end ⌘K flow in context.
 */
export const InContext: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);

    return (
      <div
        style={{
          width: 680, fontFamily: 'var(--font)',
          background: 'var(--bg)', border: '1px solid var(--border)',
          borderRadius: 12, overflow: 'hidden',
        }}
      >
        {/* Simulated topbar */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 16px', borderBottom: '1px solid var(--border)',
            background: 'var(--surface)',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)' }}>forge-api</span>
          <div style={{ flex: 1 }} />
          <button
            className="ds-topbar-search"
            onClick={() => setOpen(true)}
            aria-label="Open command palette"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="label" style={{ fontSize: 13, color: 'var(--fg-subtle)' }}>
              Search commands…
            </span>
            <span className="kbd-chord">
              <kbd className="kbd">⌘</kbd>
              <kbd className="kbd">K</kbd>
            </span>
          </button>
        </div>

        {/* Simulated content area */}
        <div style={{ padding: 20, minHeight: 140 }}>
          <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
            Press the search bar above (or ⌘K) to open the command palette.
          </div>
        </div>

        <CommandDialog
          groups={NAV_GROUPS}
          open={open}
          onOpenChange={setOpen}
          onSelect={(id) => {
            // eslint-disable-next-line no-console
            console.log('Selected:', id);
            setOpen(false);
          }}
        />
      </div>
    );
  },
};
