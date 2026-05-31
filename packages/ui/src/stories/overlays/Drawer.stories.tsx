import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Drawer, MOCKS } from '@forge/ui';

const meta = {
  title: 'Overlays/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A panel that slides in from any edge of the viewport. ' +
          '`variant="overlay"` portals over the page with a scrim backdrop; ' +
          '`variant="inline"` docks as a flex column beside sibling content. ' +
          'Bottom overlay drawers support drag-to-close.',
      },
    },
  },
  args: {
    open: false,
    side: 'right',
    variant: 'overlay',
    persistent: false,
    title: 'Settings',
    desc: 'Adjust your preferences.',
  },
  argTypes: {
    open: { control: 'boolean' },
    side: { control: 'inline-radio', options: ['right', 'left', 'top', 'bottom'] },
    variant: { control: 'inline-radio', options: ['overlay', 'inline'] },
    persistent: { control: 'boolean' },
    title: { control: 'text' },
    desc: { control: 'text' },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — overlay drawer sliding from the right, toggled by a button. */
export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ minHeight: 200 }}>
        <button className="btn ember" onClick={() => setOpen(true)}>Open drawer</button>
        <Drawer
          {...args}
          open={open}
          onClose={() => setOpen(false)}
        >
          <p style={{ fontFamily: 'var(--font)', color: 'var(--fg)', fontSize: 14, margin: 0 }}>
            Drawer body content goes here.
          </p>
        </Drawer>
      </div>
    );
  },
};

/** From the right — the default edge for forms, settings, and edit panels. */
export const RightSide: Story = {
  args: { side: 'right', title: 'Workspace settings', desc: 'Changes save immediately.' },
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ minHeight: 200 }}>
        <button className="btn ember" onClick={() => setOpen(true)}>Edit workspace</button>
        <Drawer
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          footer={
            <>
              <button className="btn ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn ember" onClick={() => setOpen(false)}>Save changes</button>
            </>
          }
        >
          <p style={{ fontFamily: 'var(--font)', color: 'var(--fg-muted)', fontSize: 14, margin: 0, lineHeight: 1.6 }}>
            The right edge keeps the back gesture free for closing. Footer reads
            cancel first, primary second.
          </p>
        </Drawer>
      </div>
    );
  },
};

/** From the left — slides in from the left edge, best for navigation surfaces. */
export const LeftSide: Story = {
  args: { side: 'left', title: 'Navigation', desc: undefined },
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ minHeight: 200 }}>
        <button className="btn" onClick={() => setOpen(true)}>Open left drawer</button>
        <Drawer {...args} open={open} onClose={() => setOpen(false)}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['Dashboard', 'Services', 'Deploys', 'Incidents', 'Settings'].map((item) => (
              <a key={item} href="#" style={{ fontFamily: 'var(--font)', color: 'var(--fg)', textDecoration: 'none', fontSize: 14, padding: '6px 4px', borderRadius: 4 }}>
                {item}
              </a>
            ))}
          </nav>
        </Drawer>
      </div>
    );
  },
};

/** From the bottom — slides up from the bottom with drag-to-close, a mobile-thumb chooser. */
export const BottomSheet: Story = {
  args: { side: 'bottom', title: 'Filter', desc: 'Narrow results by tribe and tier.' },
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ minHeight: 200 }}>
        <button className="btn" onClick={() => setOpen(true)}>Open bottom sheet</button>
        <Drawer {...args} open={open} onClose={() => setOpen(false)}>
          <p style={{ fontFamily: 'var(--font)', color: 'var(--fg)', fontSize: 14, margin: 0 }}>
            Drag the handle down or tap outside to close.
          </p>
        </Drawer>
      </div>
    );
  },
};

/** From the top — slides down from the top edge, best for global search and notification panels. */
export const TopSheet: Story = {
  args: { side: 'top', title: 'Quick search', desc: 'Find anything across the workspace.' },
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ minHeight: 200 }}>
        <button className="btn" onClick={() => setOpen(true)}>Search · ⌘K</button>
        <Drawer {...args} open={open} onClose={() => setOpen(false)}>
          <div className="in-field">
            <div className="in-group lg">
              <input className="in-control" placeholder="Search files, people, settings…" autoFocus />
              <span className="in-addon text"><kbd className="kbd">⌘K</kbd></span>
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font)', color: 'var(--fg-faint)', fontSize: 13, marginTop: 14 }}>
            Type to search · ↵ to open · Esc to close
          </p>
        </Drawer>
      </div>
    );
  },
};

/** Persistent — Escape key and backdrop clicks do not close it; an explicit close button is required. */
export const Persistent: Story = {
  args: { persistent: true, title: 'Review PR #7421', desc: 'Must be explicitly dismissed.' },
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ minHeight: 200 }}>
        <button className="btn" onClick={() => setOpen(true)}>Open persistent drawer</button>
        <Drawer {...args} open={open} onClose={() => setOpen(false)}>
          <p style={{ fontFamily: 'var(--font)', color: 'var(--fg)', fontSize: 14, margin: 0 }}>
            Clicking the backdrop or pressing Escape has no effect when <code>persistent</code> is set.
          </p>
        </Drawer>
      </div>
    );
  },
};

/** With footer — drawer with a sticky action bar pinned to the bottom; cancel (ghost) leads, primary (ember) trails. */
export const WithFooter: Story = {
  args: {
    title: 'Deploy to Ring 2',
    desc: 'pix-router v2.7.0',
    footer: (
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button className="btn ghost">Cancel</button>
        <button className="btn ember">Confirm deploy</button>
      </div>
    ),
  },
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ minHeight: 200 }}>
        <button className="btn ember" onClick={() => setOpen(true)}>Open with footer</button>
        <Drawer {...args} open={open} onClose={() => setOpen(false)}>
          <p style={{ fontFamily: 'var(--font)', color: 'var(--fg)', fontSize: 14, margin: 0 }}>
            Review the deployment plan before confirming.
          </p>
        </Drawer>
      </div>
    );
  },
};

/** Inline variant — the drawer occupies space in a flex row rather than overlaying; siblings contract when it opens. */
export const Inline: Story = {
  args: { variant: 'inline', side: 'right', title: 'Detail panel', desc: 'Inline variant.' },
  render: (args) => {
    const [open, setOpen] = React.useState(true);
    return (
      <div style={{ display: 'flex', height: 300, border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ flex: 1, padding: 24, fontFamily: 'var(--font)', color: 'var(--fg)', fontSize: 14 }}>
          <button className="btn" style={{ marginBottom: 16 }} onClick={() => setOpen((v) => !v)}>
            {open ? 'Hide panel' : 'Show panel'}
          </button>
          <p style={{ margin: 0 }}>Main content — siblings contract when the panel opens.</p>
        </div>
        <Drawer {...args} open={open} onClose={() => setOpen(false)}>
          <p style={{ fontFamily: 'var(--font)', color: 'var(--fg)', fontSize: 13, margin: 0 }}>
            Artifact detail or a chat thread can live here.
          </p>
        </Drawer>
      </div>
    );
  },
};

/** In context — a right-edge edit panel opened from a service row, composed with MOCKS data and a sticky footer. */
export const InContext: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const svc = MOCKS.SERVICES[1];
    return (
      <div style={{ minHeight: 280, maxWidth: 520 }}>
        <div className="surface" style={{ padding: 0, overflow: 'hidden' }}>
          {MOCKS.SERVICES.slice(0, 4).map((s) => (
            <div
              key={s.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                borderBottom: '1px solid var(--border)', fontFamily: 'var(--font)',
              }}
            >
              <span style={{ flex: 1, color: 'var(--fg)', fontSize: 14 }}>{s.name}</span>
              <span className="pill" style={{ fontSize: 'var(--text-xs)' }}>{s.tier}</span>
              <span style={{ color: 'var(--fg-faint)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)' }}>{s.lang}</span>
              {s.id === svc.id && (
                <button className="btn ghost xs" onClick={() => setOpen(true)}>Edit</button>
              )}
            </div>
          ))}
        </div>
        <Drawer
          open={open}
          side="right"
          title={`${svc.name} settings`}
          desc={`Owner · ${svc.owner} · v${svc.version}`}
          onClose={() => setOpen(false)}
          footer={
            <>
              <button className="btn ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn ember" onClick={() => setOpen(false)}>Save changes</button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: 'var(--font)', color: 'var(--fg-muted)', fontSize: 14 }}>
            <div className="in-field">
              <label className="in-label">Service name</label>
              <div className="in-group"><input className="in-control" defaultValue={svc.name} /></div>
            </div>
            <div className="in-field">
              <label className="in-label">Tier</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <span className="pill ember">{svc.tier}</span>
                <span className="pill">T2</span>
                <span className="pill">T3</span>
              </div>
            </div>
            <p style={{ margin: 0, lineHeight: 1.6 }}>
              The catalog stays visible behind the scrim, so the user keeps their
              place in the list while editing.
            </p>
          </div>
        </Drawer>
      </div>
    );
  },
};
