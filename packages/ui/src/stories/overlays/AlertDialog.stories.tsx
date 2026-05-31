import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertDialog } from '@forge/ui';

const meta = {
  title: 'Overlays/AlertDialog',
  component: AlertDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A blocking modal that demands an explicit answer. Unlike a Modal, the backdrop is ' +
          'inert, Escape is a no-op by default, and there is no X button. ' +
          'Initial focus lands on the safe Cancel action. Use role="alertdialog" for ' +
          'irreversible or high-stakes operations only.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['warning', 'danger', 'info'] },
    title: { control: 'text' },
    description: { control: 'text' },
    cancelLabel: { control: 'text' },
    confirmLabel: { control: 'text' },
    open: { control: 'boolean' },
  },
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Default (warning) ─────────────────────────────────────────────────────────

/**
 * Click "Delete service" to open the dialog. Cancel / Confirm close it.
 * Initial focus lands on the safe "Cancel" action (alertdialog contract).
 */
export const Default: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [result, setResult] = React.useState<string | null>(null);

    const handleConfirm = () => {
      setResult('Confirmed — service deleted.');
      setOpen(false);
    };

    const handleCancel = () => {
      setResult('Cancelled — service kept.');
      setOpen(false);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <button className="btn destructive" onClick={() => setOpen(true)}>
          Delete service
        </button>
        {result && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)', margin: 0 }}>
            {result}
          </p>
        )}
        <AlertDialog
          open={open}
          onOpenChange={setOpen}
          variant="danger"
          title="Delete forge-api?"
          description="This permanently removes the service, its deploy history, and 4 linked runbooks. There is no undo."
          cancelLabel="Cancel"
          confirmLabel="Delete service"
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      </div>
    );
  },
};

// ── Destructive variant ───────────────────────────────────────────────────────

/**
 * Click "Delete service" to open the destructive danger dialog.
 * The confirm button uses the `.btn.destructive` style — never ember for delete.
 */
export const Destructive: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [result, setResult] = React.useState<string | null>(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <button className="btn destructive" onClick={() => setOpen(true)}>
          Delete service
        </button>
        {result && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)', margin: 0 }}>
            {result}
          </p>
        )}
        <AlertDialog
          open={open}
          onOpenChange={setOpen}
          variant="danger"
          title="Delete forge-api?"
          description="This permanently removes the service, its deploy history, and 4 linked runbooks. There is no undo."
          cancelLabel="Cancel"
          confirmLabel="Delete service"
          onCancel={() => { setResult('Cancelled — service kept.'); setOpen(false); }}
          onConfirm={() => { setResult('Confirmed — service deleted.'); setOpen(false); }}
        />
      </div>
    );
  },
};

// ── Danger variant ────────────────────────────────────────────────────────────

/** Danger variant — click "Delete service" to open. Confirm button uses `.btn.destructive`. */
export const Danger: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <button className="btn destructive" onClick={() => setOpen(true)}>
          Delete service
        </button>
        <AlertDialog
          open={open}
          onOpenChange={setOpen}
          variant="danger"
          title="Delete forge-api?"
          description="This permanently removes the service, its deploy history, and 4 linked runbooks. There is no undo."
          cancelLabel="Cancel"
          confirmLabel="Delete service"
          onCancel={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
        />
      </div>
    );
  },
};

// ── Info variant ──────────────────────────────────────────────────────────────

/** Info variant — click "Restart server" to open. Not destructive; confirm is the primary action. */
export const Info: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [result, setResult] = React.useState<string | null>(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <button className="btn" onClick={() => setOpen(true)}>
          Restart server
        </button>
        {result && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)', margin: 0 }}>
            {result}
          </p>
        )}
        <AlertDialog
          open={open}
          onOpenChange={setOpen}
          variant="info"
          title="Restart required"
          description="The new Tailwind preset needs a dev-server restart to pick up the changes. Restart now or finish your changes first."
          cancelLabel="Later"
          confirmLabel="Restart now"
          onCancel={() => { setResult('Dismissed — restarting later.'); setOpen(false); }}
          onConfirm={() => { setResult('Confirmed — restarting server.'); setOpen(false); }}
        />
      </div>
    );
  },
};

// ── Controlled / interactive ──────────────────────────────────────────────────

/** Fully controlled story — click "Delete service" to open the dialog. */
export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [result, setResult] = React.useState<string | null>(null);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <button className="btn destructive" onClick={() => setOpen(true)}>
          Delete service
        </button>
        {result && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-muted)' }}>
            {result}
          </p>
        )}
        <AlertDialog
          open={open}
          onOpenChange={setOpen}
          variant="danger"
          title="Delete forge-api?"
          description="This permanently removes the service, its deploy history, and 4 linked runbooks. There is no undo."
          cancelLabel="Cancel"
          confirmLabel="Delete service"
          onCancel={() => setResult('Cancelled — service kept.')}
          onConfirm={() => {
            setResult('Confirmed — service deleted.');
            setOpen(false);
          }}
        />
      </div>
    );
  },
};

// ── RTL ───────────────────────────────────────────────────────────────────────

/** Right-to-left layout — cancel still leads, confirm stays on the trailing edge. */
export const RTL: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div dir="rtl" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <button className="btn destructive" onClick={() => setOpen(true)}>
          حذف الخدمة
        </button>
        <AlertDialog
          open={open}
          onOpenChange={setOpen}
          variant="danger"
          title="حذف forge-api؟"
          description="سيؤدي هذا إلى إزالة الخدمة بشكل دائم، وتاريخ النشر، و٤ كتب تشغيل مرتبطة. لا يمكن التراجع."
          cancelLabel="إلغاء"
          confirmLabel="حذف الخدمة"
          onCancel={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
        />
      </div>
    );
  },
};

// ── All variants ──────────────────────────────────────────────────────────────

/** All three variants — triggers shown side by side. */
export const AllVariants: Story = {
  render: () => {
    const [active, setActive] = React.useState<'warning' | 'danger' | 'info' | null>(null);

    const configs: Array<{ variant: 'warning' | 'danger' | 'info'; label: string; title: string; description: string; cancel: string; confirm: string }> = [
      {
        variant: 'warning',
        label: 'Discard',
        title: 'Discard unsaved changes?',
        description: 'You have edits to forge-api that will be lost if you leave now.',
        cancel: 'Keep editing',
        confirm: 'Discard',
      },
      {
        variant: 'danger',
        label: 'Delete',
        title: 'Delete forge-api?',
        description: 'This permanently removes the service and all linked runbooks. There is no undo.',
        cancel: 'Cancel',
        confirm: 'Delete service',
      },
      {
        variant: 'info',
        label: 'Restart',
        title: 'Restart required',
        description: 'The new preset needs a dev-server restart to take effect.',
        cancel: 'Later',
        confirm: 'Restart now',
      },
    ];

    const current = configs.find((c) => c.variant === active) ?? null;

    return (
      <div style={{ display: 'flex', gap: 12 }}>
        {configs.map((c) => (
          <button key={c.variant} className="btn outline" onClick={() => setActive(c.variant)}>
            {c.label}
          </button>
        ))}
        {current && (
          <AlertDialog
            open={true}
            onOpenChange={() => setActive(null)}
            variant={current.variant}
            title={current.title}
            description={current.description}
            cancelLabel={current.cancel}
            confirmLabel={current.confirm}
            onCancel={() => setActive(null)}
            onConfirm={() => setActive(null)}
          />
        )}
      </div>
    );
  },
};
