import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toaster, useToast, Notification } from '@forge/ui';

// ── Helper wrapper ────────────────────────────────────────────────────────────
// Toaster now accepts children and provides context to them.
// Wrap trigger + useToast() consumers inside <Toaster>.

function ToastTriggers({
  position = 'bottom-right',
}: {
  position?: React.ComponentProps<typeof Toaster>['position'];
}) {
  const { toast } = useToast();
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <button
        className="btn ember"
        onClick={() =>
          toast({ tone: 'success', title: 'Published', description: 'Live in 4.2s across all regions.' })
        }
      >
        Publish
      </button>
      <button
        className="btn outline"
        onClick={() =>
          toast({ tone: 'info', title: 'Deployed', description: 'New version is live.' })
        }
      >
        Deploy
      </button>
    </div>
  );
}

// ── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Overlays/Toaster',
  component: Toaster,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Ephemeral stacked toasts for actions the user just took. ' +
          'Wrap your subtree with <Toaster>, then call toast() via useToast() anywhere inside. ' +
          'Auto-dismiss pauses on hover/focus; ESC dismisses the focused toast; ' +
          'F6 jumps keyboard focus into the region.',
      },
    },
  },
  args: { position: 'bottom-right' },
  argTypes: {
    position: {
      control: 'select',
      options: [
        'top-left', 'top-center', 'top-right',
        'bottom-left', 'bottom-center', 'bottom-right',
      ],
    },
  },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Default ───────────────────────────────────────────────────────────────────

/** Basic success toast fired from a trigger button. */
export const Default: Story = {
  render: (args) => (
    <Toaster position={args.position}>
      <ToastTriggers />
    </Toaster>
  ),
};

// ── All tones ─────────────────────────────────────────────────────────────────

/** All six tones: default, info, success, warning, danger, and loading. */
export const AllTones: Story = {
  render: (args) => {
    function AllTriggers() {
      const { toast, dismiss } = useToast();
      return (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn" onClick={() =>
            toast({ tone: 'default', title: 'Note saved', description: 'It will sync momentarily.' })
          }>Default</button>
          <button className="btn" onClick={() =>
            toast({ tone: 'info', title: 'New release', description: 'v4.19.0 is available.' })
          }>Info</button>
          <button className="btn" onClick={() =>
            toast({ tone: 'success', title: 'Published', description: 'Live in 4.2s.' })
          }>Success</button>
          <button className="btn" onClick={() =>
            toast({ tone: 'warning', title: 'Quota at 84%', description: 'Upgrade or wait until midnight UTC.' })
          }>Warning</button>
          <button className="btn" onClick={() =>
            toast({ tone: 'danger', title: 'Deploy failed', description: 'Rolling back to v4.18.2.' })
          }>Danger</button>
          <button className="btn" onClick={() => {
            const id = toast({ tone: 'loading', title: 'Publishing…', description: 'Usually a few seconds.', duration: 0 });
            setTimeout(() => {
              dismiss(id);
              toast({ tone: 'success', title: 'Published', description: 'Live in 4.2s.' });
            }, 2000);
          }}>Loading {'->'} Success</button>
        </div>
      );
    }
    return (
      <Toaster position={args.position}>
        <AllTriggers />
      </Toaster>
    );
  },
};

// ── With action ───────────────────────────────────────────────────────────────

/** Toast with an optional CTA (Undo, Open, Retry). */
export const WithAction: Story = {
  render: (args) => {
    function ActionTrigger() {
      const { toast } = useToast();
      return (
        <button
          className="btn outline"
          onClick={() =>
            toast({
              tone: 'default',
              title: 'Item deleted',
              description: 'You can undo for 5 seconds.',
              duration: 5000,
              action: { label: 'Undo', onClick: () => {} },
            })
          }
        >
          Delete item
        </button>
      );
    }
    return (
      <Toaster position={args.position}>
        <ActionTrigger />
      </Toaster>
    );
  },
};

// ── Positions ─────────────────────────────────────────────────────────────────

/** Cycles through all six positioning corners. */
export const Positions: Story = {
  render: () => {
    const [pos, setPos] = React.useState<React.ComponentProps<typeof Toaster>['position']>('top-right');
    const positions = [
      'top-left', 'top-center', 'top-right',
      'bottom-left', 'bottom-center', 'bottom-right',
    ] as const;

    function PosTrigger() {
      const { toast } = useToast();
      return (
        <button
          className="btn"
          onClick={() =>
            toast({ tone: 'success', title: 'Region: ' + pos, description: 'Toast anchored to the selected corner.' })
          }
        >
          Fire toast at {pos}
        </button>
      );
    }

    return (
      <Toaster position={pos}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {positions.map((p) => (
              <button
                key={p}
                className={pos === p ? 'btn ember' : 'btn outline'}
                onClick={() => setPos(p)}
              >
                {p}
              </button>
            ))}
          </div>
          <PosTrigger />
        </div>
      </Toaster>
    );
  },
};

// ── RTL ───────────────────────────────────────────────────────────────────────

/** RTL — the region mirrors to the opposite edge via inset-inline-*. */
export const RTL: Story = {
  render: (args) => {
    function RTLTriggers() {
      const { toast } = useToast();
      return (
        <div dir="rtl" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn" onClick={() =>
            toast({ tone: 'success', title: 'تم النشر', description: 'تم النشر في ۴.۲ ثانية.' })
          }>{'نجاح'}</button>
          <button className="btn" onClick={() =>
            toast({ tone: 'danger', title: 'فشل النشر', description: 'جارٍ التراجع.' })
          }>{'خطأ'}</button>
          <button className="btn outline" onClick={() =>
            toast({
              tone: 'default',
              title: 'تم حذف العنصر',
              description: 'يمكنك التراجع لمدة ۵ ثوانٍ.',
              duration: 5000,
              action: { label: 'تراجع', onClick: () => {} },
            })
          }>{'مع إجراء'}</button>
        </div>
      );
    }
    return (
      <Toaster position={args.position}>
        <RTLTriggers />
      </Toaster>
    );
  },
};

// ── Notification (inline banner) ──────────────────────────────────────────────

/** Presentational Notification banners — inline, no portal, all tones. */
export const InlineNotification: Story = {
  render: () => {
    const [dismissed, setDismissed] = React.useState<Set<string>>(new Set());
    const tones = ['default', 'info', 'success', 'warning', 'danger'] as const;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 540 }}>
        {tones.filter((t) => !dismissed.has(t)).map((tone) => (
          <Notification
            key={tone}
            tone={tone}
            title={tone.charAt(0).toUpperCase() + tone.slice(1)}
            description={`This is a ${tone} inline notification.`}
            onDismiss={() => setDismissed((s) => new Set([...s, tone]))}
          />
        ))}
        {dismissed.size > 0 && (
          <button className="btn ghost" onClick={() => setDismissed(new Set())}>
            Reset
          </button>
        )}
      </div>
    );
  },
};

// ── In context ────────────────────────────────────────────────────────────────

/** Toast triggered inside a realistic deploy-pipeline card. */
export const InContext: Story = {
  render: (args) => {
    function PipelineCard() {
      const { toast } = useToast();
      return (
        <div
          className="surface"
          style={{
            padding: 20,
            borderRadius: 8,
            border: '1px solid var(--border-strong)',
            maxWidth: 420,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Deploy pipeline</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 13, marginBottom: 16 }}>
            Target: production {'·'} Region: us-east-1
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn ember"
              onClick={() =>
                toast({ tone: 'loading', title: 'Deploying…', description: 'Usually takes ~90s.', duration: 0 })
              }
            >
              Deploy
            </button>
            <button
              className="btn outline"
              onClick={() =>
                toast({ tone: 'warning', title: 'Rollback triggered', description: 'Reverting to v4.18.2.' })
              }
            >
              Rollback
            </button>
          </div>
        </div>
      );
    }
    return (
      <Toaster position={args.position}>
        <PipelineCard />
      </Toaster>
    );
  },
};
