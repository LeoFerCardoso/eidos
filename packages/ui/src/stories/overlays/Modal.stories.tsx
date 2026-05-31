import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal } from '@eidos/ui';

const meta = {
  title: 'Overlays/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Centered overlay panel for self-contained flows — quick edits, share dialogs, ' +
          'media previews, announcements. Three dismiss paths (X, ESC, backdrop) make it ' +
          '"forgiving." For irreversible decisions use Alert Dialog instead.',
      },
    },
  },
  args: {
    open: false,
    size: 'md',
    title: 'Rename service',
    desc: 'Give it a memorable handle. You can change this later.',
    showClose: true,
    closeOnEsc: true,
    closeOnBackdrop: true,
  },
  argTypes: {
    open: { control: 'boolean' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] },
    title: { control: 'text' },
    desc: { control: 'text' },
    showClose: { control: 'boolean' },
    closeOnEsc: { control: 'boolean' },
    closeOnBackdrop: { control: 'boolean' },
    iconTone: { control: 'inline-radio', options: ['info', 'success', 'warning', 'danger'] },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — controlled by a trigger button. Supports ESC, backdrop click, and the X. */
export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button className="btn ember" onClick={() => setOpen(true)}>Rename service</button>
        <Modal
          {...args}
          open={open}
          onOpenChange={setOpen}
          footer={
            <>
              <button className="btn ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn ember" onClick={() => setOpen(false)}>Save</button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
            <label
              style={{ fontSize: 12, fontWeight: 500, color: 'var(--fg-muted)' }}
              htmlFor="mdl-story-rename"
            >
              Service name
            </label>
            <input
              id="mdl-story-rename"
              defaultValue="forge-api"
              style={{
                background: 'var(--surface)', color: 'var(--fg)',
                border: '1px solid var(--border-strong)', borderRadius: 6,
                padding: '8px 10px', fontSize: 13,
              }}
            />
          </div>
        </Modal>
      </div>
    );
  },
};

/** Size: sm — 380 px, single-field quick choices. */
export const SizeSm: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button className="btn sm" onClick={() => setOpen(true)}>Open · sm</button>
        <Modal
          open={open}
          onOpenChange={setOpen}
          size="sm"
          title="Confirm action"
          desc="This step is reversible."
          footer={
            <>
              <button className="btn ghost sm" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn ember sm" onClick={() => setOpen(false)}>Confirm</button>
            </>
          }
        >
          <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-muted)' }}>
            The smallest size is best for a single question or confirmation where context
            is already clear from the page behind it.
          </p>
        </Modal>
      </div>
    );
  },
};

/** Size: lg — 640 px, multi-field forms and side-by-side previews. */
export const SizeLg: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button className="btn sm" onClick={() => setOpen(true)}>Open · lg</button>
        <Modal
          open={open}
          onOpenChange={setOpen}
          size="lg"
          title="Share forge-api"
          desc="Anyone with the link can view the service overview and recent deploys."
          footer={
            <>
              <button className="btn ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn ember" onClick={() => setOpen(false)}>Send invite</button>
            </>
          }
        >
          {['Invite people', 'Role', 'Note (optional)'].map((label, i) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: i < 2 ? 14 : 0 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--fg-muted)' }}>{label}</label>
              {i === 2
                ? <textarea rows={3} style={{ background: 'var(--surface)', color: 'var(--fg)', border: '1px solid var(--border-strong)', borderRadius: 6, padding: '8px 10px', fontSize: 13, resize: 'vertical' }} />
                : <input style={{ background: 'var(--surface)', color: 'var(--fg)', border: '1px solid var(--border-strong)', borderRadius: 6, padding: '8px 10px', fontSize: 13 }} />}
            </div>
          ))}
        </Modal>
      </div>
    );
  },
};

/** Hero variant — full-bleed illustration or media slot above the header. */
export const HeroVariant: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button className="btn ember" onClick={() => setOpen(true)}>See what&apos;s new</button>
        <Modal
          open={open}
          onOpenChange={setOpen}
          size="lg"
          hero={<div className="mdl-hero" />}
          title="Forge 2026.06"
          desc="Cache Components, AI Gateway routing, and a faster Build Command."
          footer={
            <>
              <button className="btn ghost" onClick={() => setOpen(false)}>Maybe later</button>
              <button className="btn ember" onClick={() => setOpen(false)}>Read the release notes</button>
            </>
          }
        >
          <p style={{ margin: '0 0 8px', fontSize: 15, color: 'var(--fg-muted)', lineHeight: 1.6 }}>
            This month we shipped three things worth opening a modal for:
          </p>
          <ul style={{ paddingInlineStart: 20, color: 'var(--fg-muted)', lineHeight: 1.7, fontSize: 14, margin: 0 }}>
            <li><strong style={{ color: 'var(--fg)' }}>Cache Components</strong> — partial prerendering on every framework.</li>
            <li><strong style={{ color: 'var(--fg)' }}>AI Gateway routing</strong> — per-token failover across providers.</li>
            <li><strong style={{ color: 'var(--fg)' }}>Build Command 2.0</strong> — 40% faster cold starts on Turbopack.</li>
          </ul>
        </Modal>
      </div>
    );
  },
};

/** Scrollable body — header and footer stay pinned while the body overflows. */
export const ScrollableBody: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button className="btn" onClick={() => setOpen(true)}>View terms</button>
        <Modal
          open={open}
          onOpenChange={setOpen}
          title="Acceptable use"
          desc="Last updated 03 May 2026."
          footer={
            <>
              <button className="btn ghost" onClick={() => setOpen(false)}>Decline</button>
              <button className="btn ember" onClick={() => setOpen(false)}>I agree</button>
            </>
          }
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <p key={i} style={{ margin: '0 0 12px', fontSize: 15, color: 'var(--fg-muted)', lineHeight: 1.55 }}>
              <strong style={{ color: 'var(--fg)' }}>{i + 1}.</strong>{' '}
              Forge is a substrate for production systems — its features are intended for
              engineers operating real infrastructure. You agree not to use the platform to
              attack third parties, distribute malware, store unlawful content, or hammer the
              API beyond the documented per-org rate limits.
            </p>
          ))}
        </Modal>
      </div>
    );
  },
};

/** Persistent — backdrop and ESC do not close it; requires an explicit button. */
export const Persistent: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button className="btn" onClick={() => setOpen(true)}>Open persistent</button>
        <Modal
          open={open}
          onOpenChange={setOpen}
          closeOnBackdrop={false}
          closeOnEsc={false}
          title="Unsaved changes"
          desc="You have unsaved work. Discard it or go back and save."
          footer={
            <>
              <button className="btn ghost" onClick={() => setOpen(false)}>Discard changes</button>
              <button className="btn ember" onClick={() => setOpen(false)}>Go back and save</button>
            </>
          }
        >
          <p style={{ margin: 0, fontSize: 15, color: 'var(--fg-muted)' }}>
            Clicking outside or pressing ESC has no effect — the user must make an
            explicit choice. Use sparingly, only when data loss is a real risk.
          </p>
        </Modal>
      </div>
    );
  },
};

/** RTL — Arabic copy with dir=&quot;rtl&quot;; the close button travels to the leading corner. */
export const RTL: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div dir="rtl" style={{ minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button className="btn ember" onClick={() => setOpen(true)}>مشاركة</button>
        <div dir="rtl">
          <Modal
            open={open}
            onOpenChange={setOpen}
            title="مشاركة forge-api"
            desc="يمكن لأي شخص لديه الرابط عرض الخدمة وعمليات النشر الأخيرة."
            footer={
              <>
                <button className="btn ghost" onClick={() => setOpen(false)}>إلغاء</button>
                <button className="btn ember" onClick={() => setOpen(false)}>إرسال الدعوة</button>
              </>
            }
          >
            <p style={{ margin: 0, fontSize: 15, color: 'var(--fg-muted)' }}>
              يظهر زر الإغلاق في الزاوية اليمنى العلوية في اتجاه من اليمين إلى اليسار.
            </p>
          </Modal>
        </div>
      </div>
    );
  },
};

/** In context — a share modal inside a realistic service card layout. */
export const InContext: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div
        style={{
          width: 480, padding: 20,
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          borderRadius: 12, fontFamily: 'var(--font)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--fg)' }}>forge-api</div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>identity-svc · production</div>
          </div>
          <button className="btn sm" onClick={() => setOpen(true)}>Share</button>
        </div>
        <div style={{ height: 1, background: 'var(--border)', marginBottom: 12 }} />
        <div style={{ fontSize: 13, color: 'var(--fg-subtle)' }}>Status: healthy · 99.98% uptime · last deploy 2h ago</div>

        <Modal
          open={open}
          onOpenChange={setOpen}
          title="Share forge-api"
          desc="Anyone with the link can view the service overview and recent deploys."
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <span style={{ fontSize: 13, color: 'var(--fg-subtle)' }}>
                Visible to <strong style={{ color: 'var(--fg-muted)' }}>acme-workspace</strong>
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn ghost" onClick={() => setOpen(false)}>Cancel</button>
                <button className="btn ember" onClick={() => setOpen(false)}>Send invite</button>
              </div>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--fg-muted)' }}>Invite people</label>
            <input
              placeholder="leo@acme.io, dani@acme.io"
              style={{
                background: 'var(--surface)', color: 'var(--fg)',
                border: '1px solid var(--border-strong)', borderRadius: 6,
                padding: '8px 10px', fontSize: 13,
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--fg-muted)' }}>Role</label>
            <select
              style={{
                background: 'var(--surface)', color: 'var(--fg)',
                border: '1px solid var(--border-strong)', borderRadius: 6,
                padding: '8px 10px', fontSize: 13,
              }}
            >
              <option>Viewer — read-only</option>
              <option>Editor — deploy &amp; configure</option>
              <option>Admin — manage members</option>
            </select>
          </div>
        </Modal>
      </div>
    );
  },
};
