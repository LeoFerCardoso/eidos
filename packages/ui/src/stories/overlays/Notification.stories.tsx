import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Notification, Toaster, useToast } from '@eidos/ui';
import type { ToasterPosition, ToastTone } from '@eidos/ui';

// ═══════════════════════════════════════════════════════════════════════════
// Notification — Eidos DS
//
// The doc page (src/ds/migrated/notification.tsx) documents TWO surfaces:
//   • Toaster + useToast()  — the PRIMARY surface: ephemeral portal toasts
//       (6 tones incl. loading, 6 positions, loading→terminal, imperative
//        toast(), action/Undo). Stories: Default, Tones, Positions,
//        LoadingToTerminal, WithUndo, InContext, RTL (Toaster).
//   • <Notification />       — the inline/banner counterpart (5 tones, no
//        portal, no auto-dismiss). Stories: InlineBanner, InlineAllTones,
//        InlinePersistent, InlineRTL.
//
// The story file is bound to the `Notification` export, so meta.component
// stays Notification; the Toaster surface is exercised through render-only
// stories (Toaster + useToast both ship from @eidos/ui via the same module).
// ═══════════════════════════════════════════════════════════════════════════

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Overlays/Notification',
  component: Notification,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Ephemeral toasts for actions the user just took. Mount <Toaster/> once at the app ' +
          'root, then call toast() via useToast() from anywhere — six tones (incl. loading), ' +
          'six anchoring positions, loading→terminal transitions, and an optional Undo/Retry ' +
          'action. The presentational <Notification/> banner is the inline counterpart: no ' +
          'portal, no auto-dismiss, for persistent page-level alerts.',
      },
    },
  },
  args: {
    tone: 'info',
    title: 'Scheduled maintenance window',
    description:
      'The API gateway will be read-only on 2026-06-04 02:00–04:00 UTC. No deploys will be processed during this window.',
  },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['default', 'info', 'success', 'warning', 'danger'],
    },
    title: { control: 'text' },
    description: { control: 'text' },
    dismissLabel: { control: 'text' },
  },
} satisfies Meta<typeof Notification>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared toast demo helpers ───────────────────────────────────────────────────

/** Reads the toast context inside a <Toaster> subtree and renders the trigger UI. */
function ToastConsumer({
  children,
}: {
  children: (ctx: ReturnType<typeof useToast>) => React.ReactNode;
}) {
  return <>{children(useToast())}</>;
}

/**
 * A self-contained scene: mounts <Toaster> at the given position and renders
 * trigger buttons that fire each documented tone via the imperative toast() API.
 * Note: the region is `position: fixed`, so toasts anchor to the viewport corner.
 */
function ToasterScene({
  position = 'top-right',
  dir = 'ltr',
}: {
  position?: ToasterPosition;
  dir?: 'ltr' | 'rtl';
}) {
  const rtl = dir === 'rtl';
  const tones: Array<{ tone: ToastTone; label: string; title: string; description: string }> = rtl
    ? [
        { tone: 'default', label: 'افتراضي', title: 'تم الحفظ', description: 'ستتم المزامنة قريبًا.' },
        { tone: 'info', label: 'معلومة', title: 'إصدار جديد', description: 'الإصدار ٤.١٩.٠ متاح.' },
        { tone: 'success', label: 'نجاح', title: 'تم النشر', description: 'تم في ٤.٢ ثانية عبر كل المناطق.' },
        { tone: 'warning', label: 'تحذير', title: 'الحصة عند ٨٤٪', description: 'قم بالترقية أو انتظر منتصف الليل UTC.' },
        { tone: 'danger', label: 'خطأ', title: 'فشل النشر', description: 'جارٍ التراجع إلى ٤.١٨.٢.' },
      ]
    : [
        { tone: 'default', label: 'Default', title: 'Note saved', description: 'It will sync momentarily.' },
        { tone: 'info', label: 'Info', title: 'New release', description: 'v4.19.0 is available.' },
        { tone: 'success', label: 'Success', title: 'Published', description: 'Live in 4.2s across all regions.' },
        { tone: 'warning', label: 'Warning', title: 'Quota at 84%', description: 'Upgrade or wait until midnight UTC.' },
        { tone: 'danger', label: 'Danger', title: 'Deploy failed', description: 'Rolling back to v4.18.2.' },
      ];

  return (
    <div dir={dir} style={{ position: 'relative', minBlockSize: 220, inlineSize: '100%' }}>
      <Toaster position={position}>
        <ToastConsumer>
          {({ toast, dismiss }) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', color: 'var(--fg-muted)' }}>
                position: {position} {'·'} {dir.toUpperCase()}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {tones.map((t) => (
                  <button
                    key={t.tone}
                    className="btn xs"
                    onClick={() => toast({ tone: t.tone, title: t.title, description: t.description })}
                  >
                    {t.label}
                  </button>
                ))}
                <button
                  className="btn xs ghost"
                  onClick={() => {
                    const id = toast({
                      tone: 'loading',
                      title: rtl ? 'جاري النشر…' : 'Publishing…',
                      description: rtl ? 'يستغرق بضع ثوانٍ.' : 'Usually a few seconds.',
                      duration: 0,
                    });
                    setTimeout(() => {
                      dismiss(id);
                      toast({
                        tone: 'success',
                        title: rtl ? 'تم النشر' : 'Published',
                        description: rtl ? 'تم في ٤.٢ ثانية.' : 'Live in 4.2s.',
                      });
                    }, 1800);
                  }}
                >
                  {rtl ? 'تحميل ← تم' : 'Loading → Done'}
                </button>
                <button
                  className="btn xs outline"
                  onClick={() =>
                    toast({
                      tone: 'default',
                      title: rtl ? 'تم حذف العنصر' : 'Item deleted',
                      description: rtl ? 'يمكنك التراجع خلال ٥ ثوانٍ.' : 'Undo within 5 seconds.',
                      duration: 5000,
                      action: { label: rtl ? 'تراجع' : 'Undo', onClick: () => {} },
                    })
                  }
                >
                  + Undo
                </button>
              </div>
            </div>
          )}
        </ToastConsumer>
      </Toaster>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// PRIMARY SURFACE — Toaster + useToast()
// ════════════════════════════════════════════════════════════════════════════

/**
 * The primary surface. Mount <Toaster/> once at the app root, then fire toasts
 * from anywhere via the useToast() hook. Click a trigger to fire that tone.
 */
export const Default: Story = {
  render: () => <ToasterScene position="top-right" />,
};

/**
 * All six tones the doc page documents — default, info, success, warning, danger,
 * and loading. danger/warning are assertive (role="alert"); the rest are polite.
 * Loading shows an ember spinner and suppresses auto-dismiss.
 */
export const Tones: Story = {
  render: () => <ToasterScene position="top-right" />,
};

/**
 * The six anchoring corners. Pick one per app and keep it; logical insets
 * (inset-inline-*) mirror "top-right" to the visual top-LEFT under RTL.
 * Switch the position, then fire a toast to see where the stack anchors.
 */
export const Positions: Story = {
  render: () => {
    const positions: ToasterPosition[] = [
      'top-left',
      'top-center',
      'top-right',
      'bottom-left',
      'bottom-center',
      'bottom-right',
    ];
    const [pos, setPos] = React.useState<ToasterPosition>('bottom-right');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, inlineSize: '100%' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {positions.map((p) => (
            <button key={p} className={p === pos ? 'btn xs ember' : 'btn xs'} onClick={() => setPos(p)}>
              {p}
            </button>
          ))}
        </div>
        {/* key remounts the Toaster so the new position takes effect */}
        <ToasterScene key={pos} position={pos} />
      </div>
    );
  },
};

/**
 * Loading → terminal pattern. Fire a persistent loading toast (duration: 0),
 * resolve the async work, then dismiss it and fire the terminal success/danger.
 * Always resolve a loading toast — never leave the spinner orphaned.
 */
export const LoadingToTerminal: Story = {
  render: () => (
    <Toaster position="top-right">
      <ToastConsumer>
        {({ toast, dismiss }) => (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              className="btn xs ghost"
              onClick={() => {
                const id = toast({ tone: 'loading', title: 'Publishing…', description: 'Usually a few seconds.', duration: 0 });
                setTimeout(() => {
                  dismiss(id);
                  toast({ tone: 'success', title: 'Published', description: 'Live in 4.2s across all regions.' });
                }, 1800);
              }}
            >
              Publish (resolves OK)
            </button>
            <button
              className="btn xs ghost"
              onClick={() => {
                const id = toast({ tone: 'loading', title: 'Deploying…', description: 'Rolling out to us-east-1.', duration: 0 });
                setTimeout(() => {
                  dismiss(id);
                  toast({ tone: 'danger', title: 'Deploy failed', description: 'Rolling back to v4.18.2.' });
                }, 1800);
              }}
            >
              Deploy (resolves error)
            </button>
          </div>
        )}
      </ToastConsumer>
    </Toaster>
  ),
};

/**
 * A toast with an inline action — Undo / Retry / Open. Low-stakes only; never
 * route an irreversible operation through a toast action. Here a 5s window
 * lets the user undo a delete before the toast auto-dismisses.
 */
export const WithUndo: Story = {
  render: () => (
    <Toaster position="bottom-right">
      <ToastConsumer>
        {({ toast }) => (
          <button
            className="btn xs"
            onClick={() =>
              toast({
                tone: 'default',
                title: 'Item deleted',
                description: 'eidos-api/deploy.md moved to trash.',
                duration: 5000,
                action: { label: 'Undo', onClick: () => {} },
              })
            }
          >
            Delete item
          </button>
        )}
      </ToastConsumer>
    </Toaster>
  ),
};

/**
 * In context — a deploy console where the imperative toast() API confirms each
 * step. The toast is the receipt for an action that just completed; the page
 * never blocks while it shows.
 */
export const InContext: Story = {
  render: () => (
    <Toaster position="bottom-right">
      <ToastConsumer>
        {({ toast, dismiss }) => (
          <div
            className="surface"
            style={{
              padding: 24,
              borderRadius: 8,
              border: '1px solid var(--border-strong)',
              maxInlineSize: 540,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>eidos-api</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)' }}>
                us-east-1 {'·'} node20 {'·'} v4.18.2
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                className="btn xs ember"
                onClick={() => {
                  const id = toast({ tone: 'loading', title: 'Deploying…', description: 'Building image.', duration: 0 });
                  setTimeout(() => {
                    dismiss(id);
                    toast({ tone: 'success', title: 'Published', description: 'Live in 4.2s.' });
                  }, 1600);
                }}
              >
                Deploy
              </button>
              <button
                className="btn xs"
                onClick={() => toast({ tone: 'info', title: 'Config saved', description: 'Environment synced to 3 regions.' })}
              >
                Save config
              </button>
              <button
                className="btn xs"
                onClick={() => toast({ tone: 'warning', title: 'Quota at 84%', description: 'Upgrade before the next deploy.' })}
              >
                Check quota
              </button>
            </div>
          </div>
        )}
      </ToastConsumer>
    </Toaster>
  ),
};

/**
 * RTL — pass dir="rtl" to an ancestor. The region uses inset-inline-end/start,
 * so "top-right" becomes the visual top-LEFT corner. No call-site changes.
 */
export const RTL: Story = {
  render: () => <ToasterScene position="top-right" dir="rtl" />,
};

// ════════════════════════════════════════════════════════════════════════════
// SECONDARY SURFACE — inline <Notification /> banner
// ════════════════════════════════════════════════════════════════════════════

/**
 * The inline counterpart: a dismissible banner that lives in the page flow —
 * no portal, no auto-dismiss. Use for persistent page-level alerts.
 * Driven by args; toggle Reset to restore after dismissing.
 */
export const InlineBanner: Story = {
  render: (args) => {
    const [visible, setVisible] = React.useState(true);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxInlineSize: 560 }}>
        {visible ? (
          <Notification
            {...args}
            action={{ label: 'View schedule', onClick: () => {} }}
            onDismiss={() => setVisible(false)}
          />
        ) : (
          <button className="btn ghost" onClick={() => setVisible(true)}>
            Reset
          </button>
        )}
      </div>
    );
  },
};

/**
 * All five inline tones — default, info, success, warning, danger. Each banner
 * is independently dismissible; pairs an accent icon with text so meaning never
 * rests on colour alone.
 */
export const InlineAllTones: Story = {
  render: () => {
    const [dismissed, setDismissed] = React.useState<Set<string>>(new Set());
    const configs: Array<{ tone: NonNullable<React.ComponentProps<typeof Notification>['tone']>; title: string; description: string }> = [
      { tone: 'default', title: 'Runbook updated', description: 'eidos-api/deploy.md was edited 3 minutes ago.' },
      { tone: 'info', title: 'New agent runtime available', description: 'Eidos Agent Runtime v2.4.0 reduces cold-start latency.' },
      { tone: 'success', title: 'Certificate renewed', description: 'TLS cert for api.eidos.internal renewed. Expires 2027-05-30.' },
      { tone: 'warning', title: 'Quota at 91%', description: 'Your org has consumed 91 of 100 seat licences.' },
      { tone: 'danger', title: 'Webhook delivery failures', description: '12 events to orders.internal failed in the last hour.' },
    ];
    const visible = configs.filter((c) => !dismissed.has(c.tone));
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxInlineSize: 600 }}>
        {visible.map((c) => (
          <Notification
            key={c.tone}
            tone={c.tone}
            title={c.title}
            description={c.description}
            onDismiss={() => setDismissed((s) => new Set([...s, c.tone]))}
          />
        ))}
        {dismissed.size > 0 && (
          <button className="btn ghost" onClick={() => setDismissed(new Set())}>
            Reset all
          </button>
        )}
      </div>
    );
  },
};

/**
 * Persistent (non-dismissible) — omit onDismiss for required-action banners
 * that must not be silenced until the underlying issue is resolved.
 */
export const InlinePersistent: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxInlineSize: 580 }}>
      <Notification
        tone="danger"
        title="Billing suspended — service is read-only"
        description="Payment for the Pro plan failed on 2026-05-28. Update your payment method to restore write access."
        action={{ label: 'Update payment', onClick: () => {} }}
      />
      <Notification
        tone="warning"
        title="MFA not configured"
        description="Your organisation requires MFA. You have 48 hours to set it up before access is restricted."
        action={{ label: 'Enable MFA', onClick: () => {} }}
      />
    </div>
  ),
};

/**
 * Inline banner under RTL — icon, body, action, and dismiss button mirror via
 * logical CSS properties (margin-inline-*, padding-inline-*).
 */
export const InlineRTL: Story = {
  render: () => {
    const [dismissed, setDismissed] = React.useState<Set<string>>(new Set());
    const configs: Array<{ tone: NonNullable<React.ComponentProps<typeof Notification>['tone']>; title: string; description: string; action?: string }> = [
      { tone: 'success', title: 'تم نشر التحديث', description: 'الإصدار ٤.١٩.٠ متاح الآن في جميع المناطق.' },
      { tone: 'warning', title: 'الحصة وصلت إلى ٨٤٪', description: 'قم بالترقية أو انتظر حتى منتصف الليل (UTC).', action: 'ترقية الخطة' },
      { tone: 'danger', title: 'فشل نشر الكود', description: 'جارٍ التراجع إلى الإصدار ٤.١٨.٢ بسبب ٣ اختبارات فاشلة.', action: 'عرض السجلات' },
    ];
    return (
      <div dir="rtl" style={{ display: 'flex', flexDirection: 'column', gap: 10, maxInlineSize: 600 }}>
        {configs
          .filter((c) => !dismissed.has(c.tone))
          .map((c) => (
            <Notification
              key={c.tone}
              tone={c.tone}
              title={c.title}
              description={c.description}
              action={c.action ? { label: c.action, onClick: () => {} } : undefined}
              onDismiss={() => setDismissed((s) => new Set([...s, c.tone]))}
            />
          ))}
        {dismissed.size > 0 && (
          <button className="btn ghost" onClick={() => setDismissed(new Set())}>
            إعادة الضبط
          </button>
        )}
      </div>
    );
  },
};
