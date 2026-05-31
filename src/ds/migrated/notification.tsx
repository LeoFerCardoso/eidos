'use client';
// Forge DS — Components / Notification
// Section order: Installation → Usage → Variants → Positions → In context →
//   Accessibility → RTL → Anatomy → Do/Don't → API reference
import * as React from 'react';
import {
  Icons, Frame, Section, SubHead, Lede, Mono,
  ComponentInstall, AutoPropsTable,
  Toaster, useToast, Notification,
} from '@/ds/core';

// ── Tiny self-contained demo helpers (no <style>) ────────────────────────────

// ToasterConsumer reads context set up by the <Toaster> portal above
function ToasterConsumer({
  children,
}: {
  children: (ctx: ReturnType<typeof useToast>) => React.ReactNode;
}) {
  const ctx = useToast();
  return <>{children(ctx)}</>;
}

function ToasterScene({ position = 'top-right', dir = 'ltr', minHeight = 320 }: {
  position?: React.ComponentProps<typeof Toaster>['position'];
  dir?: 'ltr' | 'rtl';
  minHeight?: number;
}) {
  const isRTL = dir === 'rtl';
  const lbl = isRTL
    ? { def: 'افتراضي', info: 'معلومة', success: 'نجاح', warning: 'تحذير', danger: 'خطأ', loading: 'جاري التحميل' }
    : { def: 'Default', info: 'Info', success: 'Success', warning: 'Warning', danger: 'Danger', loading: 'Loading → Done' };

  return (
    <div dir={dir} style={{ position: 'relative', minHeight, width: '100%' }}>
      <Toaster position={position} />
      <ToasterConsumer>
        {({ toast, dismiss }) => (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            minHeight, gap: 12,
          }}>
            <span className="t-mono-label">POSITION · {position} · {dir.toUpperCase()}</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 520 }}>
              <button className="btn xs" onClick={() =>
                toast({ tone: 'default', title: isRTL ? 'تم الحفظ' : 'Note saved', description: isRTL ? 'ستتم المزامنة قريبًا.' : 'It will sync momentarily.' })
              }>{lbl.def}</button>
              <button className="btn xs" onClick={() =>
                toast({ tone: 'info', title: isRTL ? 'إصدار جديد' : 'New release', description: isRTL ? 'الإصدار ٤.١٩.٠ متاح.' : 'v4.19.0 is available.' })
              }>{lbl.info}</button>
              <button className="btn xs" onClick={() =>
                toast({ tone: 'success', title: isRTL ? 'تم النشر' : 'Published', description: isRTL ? 'تم النشر في ٤.٢ ثانية.' : 'Live in 4.2s across all regions.' })
              }>{lbl.success}</button>
              <button className="btn xs" onClick={() =>
                toast({ tone: 'warning', title: isRTL ? 'تحذير الحصة' : 'Quota at 84%', description: isRTL ? 'قم بالترقية أو الانتظار.' : 'Upgrade or wait until midnight UTC.' })
              }>{lbl.warning}</button>
              <button className="btn xs" onClick={() =>
                toast({ tone: 'danger', title: isRTL ? 'فشل النشر' : 'Deploy failed', description: isRTL ? 'جارٍ التراجع.' : 'Rolling back to v4.18.2.' })
              }>{lbl.danger}</button>
              <button className="btn xs ghost" onClick={() => {
                const id = toast({ tone: 'loading', title: isRTL ? 'جاري النشر…' : 'Publishing…', description: isRTL ? 'يستغرق عادة بضع ثوانٍ.' : 'Usually a few seconds.', duration: 0 });
                setTimeout(() => {
                  dismiss(id);
                  toast({ tone: 'success', title: isRTL ? 'تم النشر' : 'Published', description: isRTL ? 'تم في ٤.٢ ثانية.' : 'Live in 4.2s.' });
                }, 1800);
              }}>{lbl.loading}</button>
              <button className="btn xs outline" onClick={() =>
                toast({
                  tone: 'default',
                  title: isRTL ? 'تم الحذف' : 'Item deleted',
                  description: isRTL ? 'يمكنك التراجع لمدة ٥ ثوانٍ.' : 'Undo within 5 seconds.',
                  duration: 5000,
                  action: { label: isRTL ? 'تراجع' : 'Undo', onClick: () => {} },
                })
              }>+ Action</button>
            </div>
          </div>
        )}
      </ToasterConsumer>
    </div>
  );
}

const USAGE_CODE = `// 1. Mount <Toaster/> once at your app root
import { Toaster } from "@/components/forge/notification"

export default function RootLayout({ children }) {
  return (
    <html><body>
      {children}
      <Toaster position="bottom-right" />
    </body></html>
  )
}

// 2. Fire toasts from anywhere
import { useToast } from "@/components/forge/notification"

export function PublishButton() {
  const { toast } = useToast()
  return (
    <button onClick={() =>
      toast({ tone: "success", title: "Published", description: "Live in 4.2s." })
    }>Publish</button>
  )
}`;

const VARIANTS_CODE = `const { toast, dismiss } = useToast()

// All tones
toast({ tone: "default",  title: "Note saved",    description: "It will sync momentarily." })
toast({ tone: "info",     title: "New release",   description: "v4.19.0 is available." })
toast({ tone: "success",  title: "Published",     description: "Live in 4.2s." })
toast({ tone: "warning",  title: "Quota at 84%",  description: "Upgrade or wait until midnight UTC." })
toast({ tone: "danger",   title: "Deploy failed", description: "Rolling back to v4.18.2." })

// Loading → terminal
const id = toast({ tone: "loading", title: "Publishing…", duration: 0 })
publish().then(
  ()  => { dismiss(id); toast({ tone: "success", title: "Published" }) },
  (e) => { dismiss(id); toast({ tone: "danger",  title: "Publish failed", description: e.message }) },
)

// With action
toast({
  tone: "default",
  title: "Item deleted",
  duration: 5000,
  action: { label: "Undo", onClick: () => restore(item) },
})`;

const POSITIONING_CODE = `// Six anchoring corners — all use logical CSS (inset-inline-*)
// so "top-right" becomes the visual top-LEFT under dir="rtl".
<Toaster position="top-right" />     // ← default for most product UIs
<Toaster position="bottom-center" /> // ← suits marketing / splash screens`;

const INLINE_CODE = `import { Notification } from "@/components/forge/notification"

<Notification
  tone="warning"
  title="Token expiring"
  description="Your registry token expires in 3 days."
  action={{ label: "Rotate now", onClick: rotateToken }}
  onDismiss={() => setVisible(false)}
/>`;

const RTL_CODE = `// No change at call site — pass dir="rtl" to the nearest ancestor.
// The Toaster region uses inset-inline-end/start so corners mirror.
<div dir="rtl">
  <Toaster position="top-right" />
</div>

toast({ tone: "success", title: "تم النشر", description: "تم في ٤.٢ ثانية." })`;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NotificationPage() {
  const [dismissedTones, setDismissedTones] = React.useState<Set<string>>(new Set());
  const [pos, setPos] = React.useState<React.ComponentProps<typeof Toaster>['position']>('top-right');
  const positions = ['top-left','top-center','top-right','bottom-left','bottom-center','bottom-right'] as const;

  return (
    <Section
      id="notification"
      num="20"
      title="Notification"
      desc="Ephemeral toasts for actions the user just took. Use sparingly — every toast costs attention. Distinct from Alert (inline) and Alert Dialog (modal, blocking)."
    >
      {/* ── 1. INSTALLATION ──────────────────────────────────────────────── */}
      <ComponentInstall slug="notification" />
      <Lede>
        The CLI copies <Mono>notification.tsx</Mono> into your repo — no black-box dependency.
        Mount <Mono>&lt;Toaster/&gt;</Mono> once at the app root, then call <Mono>toast()</Mono> via
        the <Mono>useToast()</Mono> hook from any component in the tree. For inline persistent
        banners, use the <Mono>&lt;Notification/&gt;</Mono> presentational component directly.
      </Lede>

      {/* ── 2. USAGE ─────────────────────────────────────────────────────── */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="mount once · call from anywhere" code={USAGE_CODE}>
        <ToasterScene position="top-right" minHeight={200} />
      </Frame>

      {/* ── EXAMPLES divider ─────────────────────────────────────────────── */}
      <div style={{ marginTop: 36, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="t-mono-label" style={{ letterSpacing: '0.18em' }}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      {/* ── 3. VARIANTS ──────────────────────────────────────────────────── */}
      <SubHead meta="6 tones">Variants</SubHead>
      <Lede up>
        Six tones cover the full feedback spectrum. <Mono>danger</Mono> and <Mono>warning</Mono> announce assertively; the rest are polite. <Mono>loading</Mono> shows an ember spinner and suppresses auto-dismiss — always resolve it to a terminal state.
      </Lede>
      <Frame
        label="default · info · success · warning · danger · loading + action"
        code={VARIANTS_CODE}
      >
        <ToasterScene position="top-right" minHeight={300} />
      </Frame>

      {/* ── POSITIONS ────────────────────────────────────────────────────── */}
      <SubHead meta="6 positions">Positioning</SubHead>
      <Lede up>
        Pick one position per app and keep it. Mixing corners turns toasts into a guessing game.
        Bottom-right is the safe default for product UIs; top-center reads more strongly for
        marketing surfaces.
      </Lede>
      <Frame label="pick a corner — logical insets mirror under RTL" code={POSITIONING_CODE}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {positions.map((p) => (
              <button key={p} className={pos === p ? 'btn xs ember' : 'btn xs'} onClick={() => setPos(p)}>{p}</button>
            ))}
          </div>
          <ToasterScene position={pos} minHeight={320} />
        </div>
      </Frame>

      {/* ── 4. IN CONTEXT ────────────────────────────────────────────────── */}
      <SubHead meta="real surface">In context</SubHead>
      <Lede up>
        The <Mono>&lt;Notification/&gt;</Mono> component is the inline counterpart — no portal, no
        auto-dismiss. Use it for persistent banners that live inside the page flow.
      </Lede>
      <Frame label="inline Notification banners — all tones" code={INLINE_CODE}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 520 }}>
          {(['default','info','success','warning','danger'] as const)
            .filter((t) => !dismissedTones.has(t))
            .map((tone) => (
              <Notification
                key={tone}
                tone={tone}
                title={tone.charAt(0).toUpperCase() + tone.slice(1)}
                description={`This is a ${tone} inline notification.`}
                onDismiss={() => setDismissedTones((s) => new Set([...s, tone]))}
              />
            ))}
          {dismissedTones.size > 0 && (
            <button className="btn xs ghost" onClick={() => setDismissedTones(new Set())}>
              Reset
            </button>
          )}
        </div>
      </Frame>

      {/* ── 5. ACCESSIBILITY ─────────────────────────────────────────────── */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-body" style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            Toasts never steal focus on appearance. Press <Mono>F6</Mono> to jump focus into the
            region, then <Mono>Tab</Mono> to reach the action or dismiss button.
            <Mono>Esc</Mono> dismisses the currently focused toast. Auto-dismiss
            pauses while any toast or its region holds focus or pointer hover.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-body" style={{ fontWeight: 600, marginBottom: 6 }}>Live regions</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            Each toast carries its own <Mono>role</Mono> and <Mono>aria-live</Mono>:
            <Mono>role="status" aria-live="polite"</Mono> for default / info / success,
            and <Mono>role="alert" aria-live="assertive"</Mono> for danger and warning.
            <Mono>aria-atomic="true"</Mono> ensures the full message is read as a unit.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-body" style={{ fontWeight: 600, marginBottom: 6 }}>Focus &amp; contrast</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            Action and dismiss buttons show the offset focus ring. Each tone pairs its accent
            icon with a text title so meaning never rests on colour alone. Title, description,
            action, and icon all clear AA contrast on the toast surface in both dark and light
            themes.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-body" style={{ fontWeight: 600, marginBottom: 6 }}>Reduced motion</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            Under <Mono>prefers-reduced-motion: reduce</Mono>, the slide-in, scale, and exit
            animations are replaced with a simple opacity fade. The loading spinner also stops
            rotating — tone and title communicate the state instead.
          </div>
        </div>
      </div>

      {/* aria-live table */}
      <div className="ds-frame" style={{ marginTop: 16 }}>
        <div className="ds-frame-head"><span className="label">aria-live contract — politeness by tone</span></div>
        <table className="spec" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ padding: '10px 12px' }}>Tone</th>
              <th>role</th>
              <th>aria-live</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['default / info / success', 'status',  'polite',    'Non-blocking confirmation; announced when SR is idle.'],
              ['warning',                  'alert',   'assertive', 'Urgent warning the user must act on; interrupts current SR speech.'],
              ['danger',                   'alert',   'assertive', 'Failure the user must act on; interrupts current SR speech.'],
              ['loading',                  'status',  'polite',    'Progress signal; only the terminal state warrants assertive.'],
            ].map(([tone, role, live, why]) => (
              <tr key={String(tone)}>
                <td className="tok-name">{tone}</td>
                <td className="mono">{role}</td>
                <td className="mono">{live}</td>
                <td className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.5 }}>{why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── 6. RTL ───────────────────────────────────────────────────────── */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Lede up>
        The region uses <Mono>inset-inline-end</Mono> / <Mono>inset-inline-start</Mono> so
        "top-right" becomes the visual top-LEFT corner under <Mono>dir="rtl"</Mono>. No
        call-site changes needed — just set direction on a parent element. The dismiss icon
        is decorative (non-directional) and does not mirror.
      </Lede>
      <Frame
        label='dir="rtl" — inset-inline-* mirrors the corner automatically'
        code={RTL_CODE}
      >
        <ToasterScene position="top-right" dir="rtl" minHeight={300} />
      </Frame>

      {/* ── 7. ANATOMY ───────────────────────────────────────────────────── */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: 36 }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: 380 }}>
              {/* Static anatomy toast — no animation */}
              <div className="tst success" style={{ animation: 'none', width: '100%' }}>
                <Icons.check size={16} className="tst-icon" />
                <div className="tst-body">
                  <div className="tst-title">Published</div>
                  <div className="tst-desc">Live in 4.2 seconds across all regions.</div>
                </div>
                <button className="tst-action" type="button">Open</button>
                <button className="tst-close" aria-label="Dismiss" type="button">
                  <Icons.x size={14} />
                </button>
              </div>
              <div className="pin" style={{ top: 6,   insetInlineStart: -22 }}>1</div>
              <div className="pin" style={{ top: 6,   insetInlineStart: 42  }}>2</div>
              <div className="pin" style={{ bottom: -10, insetInlineStart: 42 }}>3</div>
              <div className="pin" style={{ top: 6,   insetInlineEnd: 90   }}>4</div>
              <div className="pin" style={{ top: 6,   insetInlineEnd: -22  }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 600, margin: '24px auto 0' }}>
            <span className="num">1</span>
            <span><b style={{ color: 'var(--fg)' }}>Status icon.</b> 16 px, colour = tone. Loading renders an ember CSS spinner instead.</span>
            <span className="num">2</span>
            <span><b style={{ color: 'var(--fg)' }}>Title.</b> 13 px Geist 600. Past tense, present state — "Published", not "Publish succeeded".</span>
            <span className="num">3</span>
            <span><b style={{ color: 'var(--fg)' }}>Description.</b> 13 px muted, optional. One line. Prefer the precise number over "soon".</span>
            <span className="num">4</span>
            <span><b style={{ color: 'var(--fg)' }}>Action.</b> Optional ember text button. Undo, Open, Retry. Never primary-destructive.</span>
            <span className="num">5</span>
            <span><b style={{ color: 'var(--fg)' }}>Dismiss.</b> 14 px ×. Always present. Auto-dismisses after 4.5 s; loading and decisive errors are persistent.</span>
          </div>
        </div>
      </div>

      {/* Decision matrix */}
      <SubHead meta="when to use">Toast vs Alert vs Alert Dialog</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Decision matrix</span></div>
        <table className="spec" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ padding: '10px 12px' }}>Use</th>
              <th>Persistence</th>
              <th>Blocking</th>
              <th>Best for</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="tok-name">Notification (toast)</td>
              <td className="mono">~4.5 s, auto</td>
              <td className="mono">no</td>
              <td className="t-small" style={{ lineHeight: 1.5 }}>Confirmation of an action just completed; transient async events.</td>
            </tr>
            <tr>
              <td className="tok-name">Alert (inline)</td>
              <td className="mono">until dismissed</td>
              <td className="mono">no</td>
              <td className="t-small" style={{ lineHeight: 1.5 }}>Persistent page-level state needing attention: quota, deprecation, feature flag.</td>
            </tr>
            <tr>
              <td className="tok-name">Alert Dialog</td>
              <td className="mono">modal</td>
              <td className="mono">yes</td>
              <td className="t-small" style={{ lineHeight: 1.5 }}>Decisive, irreversible action — confirm delete, billing change.</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── 8. DO / DON'T ────────────────────────────────────────────────── */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — confirm what just happened</div>
          <div className="body" style={{ padding: 14 }}>
            <div className="tst success" style={{ animation: 'none', width: '100%' }}>
              <Icons.check size={16} className="tst-icon" />
              <div className="tst-body">
                <div className="tst-title">Published</div>
                <div className="tst-desc">Live in 4.2 seconds.</div>
              </div>
              <button className="tst-action" type="button">Open</button>
            </div>
          </div>
          <div className="note">A toast is the receipt for a completed action — past tense, specific number, optional next-step CTA.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — block on a critical decision</div>
          <div className="body" style={{ padding: 14 }}>
            <div className="tst danger" style={{ animation: 'none', width: '100%' }}>
              <Icons.x size={16} className="tst-icon" />
              <div className="tst-body">
                <div className="tst-title">Delete this account?</div>
                <div className="tst-desc">All workspaces will be wiped.</div>
              </div>
              <button className="tst-action" style={{ color: 'var(--danger)' }} type="button">Confirm</button>
            </div>
          </div>
          <div className="note">Destructive confirmations belong in an Alert Dialog — toasts are dismissed by walking away, not deciding.</div>
        </div>
      </div>

      {/* ── 9. API REFERENCE ─────────────────────────────────────────────── */}
      <SubHead meta="ToasterProps">API reference</SubHead>
      <AutoPropsTable component="Toaster" />
      <AutoPropsTable component="ToastProps" label="ToastProps" />
      <AutoPropsTable component="Notification" label="NotificationProps" />
    </Section>
  );
}
