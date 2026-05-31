'use client';
// Eidos Mobile — Snackbar. A transient bottom message bar with a single inline action
// (e.g. Undo), anchored above the safe area and auto-dismissed after ~4s. Distinct
// from Toast (Eidos Mobile: Toast = brief status confirmation, no required action,
// status-dot carries tone). Snackbar = a message describing what happened PLUS one
// required-but-optional action the user can take — the action is the whole point.
// The bar uses a full-width pill, slightly taller than a Toast, with the action in
// ember so it reads as a clear affordance without a second control element.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono, Spinner } from '@/ds/core';

// ─── Single Snackbar bar ──────────────────────────────────────────────────────
function SnackbarBar({
  message,
  action,
  icon,
  onAction,
  onDismiss,
  onPause,
  onResume,
  countdown,
  paused,
  loading = false,
  disabled = false,
  assertive = false,
  dismissOnAction = true,
  style: extraStyle,
}: {
  message: string;
  action?: string;
  icon?: React.ReactNode;
  onAction?: () => void;
  onDismiss?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  // When true (default) firing the action also dismisses the bar. Set false for an
  // action that stays on screen to show its own in-flight → confirm transition.
  dismissOnAction?: boolean;
  // 0 → 1 fraction of the auto-dismiss window remaining; when present, a depleting
  // ember rail is shown along the leading edge and freezes while `paused` is true.
  countdown?: number;
  paused?: boolean;
  // The action is in flight: swap its label for a Spinner, mark it aria-busy,
  // and disable it so the user can't fire it twice.
  loading?: boolean;
  // The action is unavailable (e.g. the undo window has lapsed but the bar lingers).
  disabled?: boolean;
  // Time-critical / failure case → assertive live region (role="alert") so the
  // message interrupts. Reserved for errors the user must hear immediately.
  assertive?: boolean;
  style?: React.CSSProperties;
}) {
  const actionDisabled = loading || disabled;
  return (
    <div
      role={assertive ? 'alert' : 'status'}
      aria-live={assertive ? 'assertive' : 'polite'}
      aria-atomic="true"
      onMouseEnter={onPause}
      onMouseLeave={onResume}
      style={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        paddingBlock: 13,
        paddingInlineStart: icon ? 12 : 14,
        paddingInlineEnd: 6,
        borderRadius: 'var(--radius-xl)',
        background: 'var(--snackbar-bg)',   // fixed dark inverse surface in BOTH themes
        color: 'var(--snackbar-fg)',        // warm-white text reads on it in both themes
        boxShadow: '0 4px 20px rgba(0,0,0,0.32)',
        ...extraStyle,
      }}
    >
      {/* Countdown rail — the auto-dismiss window made visible. Depletes left→trailing
          over the 4 s; transition freezes the instant `paused` flips true (action
          focus / pointer over the bar), so the a11y "timer pauses" claim is on screen
          and falsifiable. Reuses the SAME ember as the action — one accent, not two. */}
      {typeof countdown === 'number' && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            insetBlockEnd: 0,
            insetInlineStart: 0,
            blockSize: 2,
            inlineSize: '100%',
            transformOrigin: 'inline-start',
            transform: `scaleX(${countdown})`,
            background: 'var(--accent)',
            opacity: paused ? 0.45 : 0.85,
            transition: paused ? 'none' : 'transform 200ms linear, opacity 150ms linear',
          }}
        />
      )}
      {icon && (
        <span style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', color: assertive ? 'var(--danger)' : 'var(--snackbar-fg)', opacity: assertive ? 1 : 0.7 }}>
          {icon}
        </span>
      )}
      <span style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 500, lineHeight: 1.4, color: 'var(--snackbar-fg)' }}>
        {message}
      </span>
      {action && (
        <button
          onClick={() => { if (actionDisabled) return; onAction?.(); if (dismissOnAction) onDismiss?.(); }}
          onFocus={onPause}
          onBlur={onResume}
          disabled={actionDisabled}
          aria-busy={loading || undefined}
          aria-disabled={actionDisabled || undefined}
          style={{
            flexShrink: 0,
            height: 44,
            paddingInline: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'transparent',
            border: 'none',
            cursor: actionDisabled ? 'not-allowed' : 'pointer',
            // The single ember accent — the only ember on this surface. The bar is a
            // fixed dark inverse surface (--snackbar-bg) in both themes, so ember keeps
            // AA contrast everywhere (≈6.9:1 dark / ≈4.7:1 light). Disabled / in-flight
            // drops the action to the bar's own muted fg so it can't be mistaken for live.
            color: actionDisabled ? 'var(--snackbar-fg)' : 'var(--accent)',
            opacity: actionDisabled ? 0.45 : 1,
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            letterSpacing: '0.01em',
            borderRadius: 'var(--radius-lg)',
            minWidth: 44,
          }}
          aria-label={loading ? `${action} (in progress)` : action}
        >
          {loading && <Spinner size="sm" color="var(--snackbar-fg)" aria-label={`${action} in progress`} />}
          {action}
        </button>
      )}
      {!action && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          style={{
            width: 44,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--snackbar-fg)',
            opacity: 0.5,
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <Icons.x size={14} />
        </button>
      )}
    </div>
  );
}

// ─── Interactive DeviceFrame screen ───────────────────────────────────────────
const SNACK_DURATION = 4000; // ms — the auto-dismiss window

type Snack = {
  message: string;
  action?: string;
  icon?: React.ReactNode;
  assertive?: boolean;  // error / time-critical → role="alert"
  loading?: boolean;    // the action is in flight
};

function SnackbarScreen() {
  const [snack, setSnack] = React.useState<Snack | null>(null);
  // Monotonic id so each fire REPLACES the prior bar (the docs claim "one at a
  // time — if a second fires, replace the first"); React remounts on key change.
  const [seq, setSeq] = React.useState(0);
  // Fraction (1 → 0) of the window remaining, drives the countdown rail.
  const [progress, setProgress] = React.useState(1);
  const [paused, setPaused] = React.useState(false);

  // Deadline-based timer so pause/resume bank the true remaining time rather than
  // restarting the full 4 s. `remainingRef` holds ms left while paused.
  const dismissTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const raf = React.useRef<number | null>(null);
  const deadlineRef = React.useRef<number>(0);
  const remainingRef = React.useRef<number>(SNACK_DURATION);

  // Reduced motion: no animated rail (it would imply motion it can't show); the
  // pause logic still runs, the rail just sits at full and skips the tween.
  const reduceMotion = React.useRef(false);
  React.useEffect(() => {
    reduceMotion.current =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const tick = React.useCallback(() => {
    const left = Math.max(0, deadlineRef.current - Date.now());
    setProgress(left / SNACK_DURATION);
    if (left > 0) raf.current = requestAnimationFrame(tick);
  }, []);

  const clearTimers = React.useCallback(() => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    if (raf.current) cancelAnimationFrame(raf.current);
    dismissTimer.current = null;
    raf.current = null;
  }, []);

  const arm = React.useCallback((ms: number) => {
    clearTimers();
    deadlineRef.current = Date.now() + ms;
    dismissTimer.current = setTimeout(() => { clearTimers(); setSnack(null); }, ms);
    if (!reduceMotion.current) raf.current = requestAnimationFrame(tick);
    else setProgress(ms / SNACK_DURATION);
  }, [clearTimers, tick]);

  // Pause: bank the time left and stop the clock + rail. Resume: re-arm with it.
  const pause = React.useCallback(() => {
    if (!dismissTimer.current) return; // already paused / no snack
    remainingRef.current = Math.max(0, deadlineRef.current - Date.now());
    clearTimers();
    setPaused(true);
  }, [clearTimers]);

  const resume = React.useCallback(() => {
    if (!snack || dismissTimer.current) return;
    setPaused(false);
    arm(remainingRef.current || SNACK_DURATION);
  }, [snack, arm]);

  function show(next: Snack) {
    setSnack(next);
    setSeq((n) => n + 1);   // remount → replaces any bar already on screen
    setPaused(false);
    setProgress(1);
    remainingRef.current = SNACK_DURATION;
    arm(SNACK_DURATION);
  }

  function dismiss() {
    clearTimers();
    setPaused(false);
    setSnack(null);
  }

  // Undo runs through a real in-flight state before confirming, so the loading
  // state is observable in the live demo rather than only documented.
  function runUndo() {
    clearTimers();
    setPaused(true);                                   // hold the bar while we "save"
    setSnack((s) => (s ? { ...s, action: 'Undo', loading: true } : s));
    window.setTimeout(() => show({ message: 'Restore complete', icon: <Icons.check size={15} /> }), 900);
  }

  React.useEffect(() => clearTimers, [clearTimers]);

  // Esc dismisses the live bar without acting — the keyboard map promises it, so
  // the demo performs it. Only armed while a bar is showing.
  React.useEffect(() => {
    if (!snack) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [snack]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      {/* Nav */}
      <div style={{ height: 50, flex: '0 0 auto', display: 'flex', alignItems: 'center', paddingInline: 14, borderBlockEnd: '1px solid var(--border)' }}>
        <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Incidents</span>
      </div>
      {/* Body — simulated list items with actions */}
      <div style={{ flex: 1, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {[
          { label: 'DB latency · P2', sub: 'Assigned to you · 14m ago', fail: false },
          { label: 'API 5xx spike · P1', sub: 'On-call: sarah · 2h ago', fail: false },
          { label: 'CDN cert expiry · P3', sub: 'Locked · read-only', fail: true },
        ].map(({ label, sub, fail }) => (
          <div
            key={label}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px', borderRadius: 'var(--radius-md)', background: 'var(--surface)' }}
          >
            <Icons.incident size={16} color="var(--danger)" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 550, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', marginTop: 2 }}>{sub}</div>
            </div>
            <button
              onClick={() =>
                fail
                  ? show({ message: 'Couldn’t archive — incident is locked', action: 'Retry', icon: <Icons.alert size={15} />, assertive: true })
                  : show({ message: 'Incident archived', action: 'Undo' })
              }
              style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)', borderRadius: 'var(--radius-md)' }}
              aria-label={`Archive ${label}`}
            >
              <Icons.trash size={15} />
            </button>
          </div>
        ))}
        <button
          className="btn"
          style={{ marginTop: 10 }}
          onClick={() => show({ message: '3 alerts muted for 1 hour', action: 'Manage' })}
        >
          Mute all alerts
        </button>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-subtle)', marginTop: 6, fontFamily: 'var(--font-mono)', lineHeight: 1.5 }}>
          Archive the locked row → error (alert) · Undo → in-flight, then confirm · fire twice → the second replaces the first.
        </div>
      </div>
      {/* Snackbar anchored above safe area */}
      {snack && (
        <div style={{ position: 'absolute', insetInline: 12, bottom: 20, zIndex: 40 }}>
          <SnackbarBar
            key={seq}
            message={snack.message}
            action={snack.action}
            icon={snack.icon as React.ReactNode | undefined}
            assertive={snack.assertive}
            loading={snack.loading}
            onAction={() => { if (snack.action === 'Undo' && !snack.assertive) runUndo(); }}
            dismissOnAction={snack.action !== 'Undo'}
            onDismiss={dismiss}
            onPause={pause}
            onResume={resume}
            countdown={progress}
            paused={paused}
          />
        </div>
      )}
    </div>
  );
}

// ─── Compact variant / state demo ───────────────────────────────────────────────
function VariantBar({
  message,
  action,
  icon,
  loading,
  disabled,
  assertive,
}: {
  message: string;
  action?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  assertive?: boolean;
}) {
  return (
    <div style={{ maxWidth: 340, width: '100%' }}>
      <SnackbarBar message={message} action={action} icon={icon} loading={loading} disabled={disabled} assertive={assertive} />
    </div>
  );
}

// A labelled state cell — eyebrow names the state, the bar shows it for real.
function StateCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--fg-subtle)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</span>
      {children}
    </div>
  );
}

export default function MobileSnackbar() {
  return (
    <Section
      id="snackbar"
      num="01"
      title="Snackbar"
      desc="A transient bottom message bar with one inline action — anchored above the safe area and auto-dismissed after 4 s. The action (Undo, Manage) is always ember; the bar is an inverted neutral fill, never coloured by tone."
    >
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>Snackbar differs from Toast: it always carries an action. Toast acknowledges silently; Snackbar invites a decision. Use one at a time — if a second fires, replace the first.</Lede>
      <Frame label="archive to fire the snackbar · rail counts down 4 s · hover or focus the action to pause · Esc dismisses · the locked row fails (alert)" center>
        <DeviceFrame initial="iphone-se"><SnackbarScreen /></DeviceFrame>
      </Frame>

      <SubHead meta="variants">Variants</SubHead>
      <Frame label="Message only (dismiss-X) · with Undo action · with icon + action">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '28px 24px', alignItems: 'center' }}>
          <VariantBar message="Deploy queued successfully" />
          <VariantBar message="Incident archived" action="Undo" />
          <VariantBar
            message="Runbook saved to drafts"
            action="View"
            icon={<Icons.doc size={15} />}
          />
        </div>
      </Frame>

      <SubHead meta="states">States</SubHead>
      <Lede>Every state the bar can hold, shown for real — not described. Default carries a live <Mono>role="status"</Mono>; the in-flight action swaps to a Spinner and goes <Mono>aria-busy</Mono>; the failure case escalates to an assertive <Mono>role="alert"</Mono>; a lapsed action reads <Mono>aria-disabled</Mono> and won't fire.</Lede>
      <Frame label='Default (status) · In-flight (aria-busy) · Error (role="alert") · Disabled (aria-disabled)'>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '28px 24px', alignItems: 'center' }}>
          <StateCell label="default · status">
            <VariantBar message="Incident archived" action="Undo" />
          </StateCell>
          <StateCell label="in-flight · aria-busy">
            <VariantBar message="Restoring incident…" action="Undo" loading />
          </StateCell>
          <StateCell label="error · role=alert">
            <VariantBar message="Couldn’t archive — incident is locked" action="Retry" icon={<Icons.alert size={15} />} assertive />
          </StateCell>
          <StateCell label="disabled · window lapsed">
            <VariantBar message="Incident archived" action="Undo" disabled />
          </StateCell>
        </div>
      </Frame>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 64px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 320 }} aria-hidden="true">
              {/* Static anatomy bar */}
              <div
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  paddingBlock: 13,
                  paddingInlineStart: 12,
                  paddingInlineEnd: 6,
                  borderRadius: 'var(--radius-xl)',
                  background: 'var(--fg)',
                  color: 'var(--bg)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.32)',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', color: 'var(--bg)', opacity: 0.7, flex: '0 0 auto' }}>
                  <Icons.auditLog size={15} />
                </span>
                <span style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--bg)' }}>Incident archived</span>
                <div style={{ height: 44, paddingInline: 12, display: 'flex', alignItems: 'center', color: 'var(--accent)', fontSize: 'var(--text-sm)', fontWeight: 700 }}>Undo</div>
                {/* Countdown rail at ~60% depleted — the auto-dismiss window made visible */}
                <span style={{ position: 'absolute', insetBlockEnd: 0, insetInlineStart: 0, blockSize: 2, inlineSize: '60%', background: 'var(--accent)', opacity: 0.85 }} />
              </div>
              {/* Pins */}
              <span className="lead v" style={{ top: -22, left: 18, height: 18 }} />
              <span className="lead h" style={{ top: '50%', left: -28, width: 24, transform: 'translateY(-50%)' }} />
              <span className="lead v" style={{ bottom: -22, left: '50%', height: 18, transform: 'translateX(-50%)' }} />
              <span className="lead v" style={{ top: -22, left: '72%', height: 18, transform: 'translateX(-50%)' }} />
              <span className="lead h" style={{ top: '50%', right: -28, width: 24, transform: 'translateY(-50%)' }} />
              <span className="lead v" style={{ bottom: -22, left: '24%', height: 18, transform: 'translateX(-50%)' }} />
              <div className="pin" style={{ top: -42, left: 18, transform: 'translateX(-50%)' }}>1</div>
              <div className="pin" style={{ top: '30%', left: -52 }}>2</div>
              <div className="pin" style={{ bottom: -42, left: '50%', transform: 'translateX(-50%)' }}>3</div>
              <div className="pin" style={{ top: -42, left: '72%', transform: 'translateX(-50%)' }}>4</div>
              <div className="pin" style={{ top: '30%', right: -52 }}>5</div>
              <div className="pin" style={{ bottom: -42, left: '24%', transform: 'translateX(-50%)' }}>6</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Optional icon.</b> A 15px glyph at 70% opacity of the bar's text colour — provides context without competing with the action.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Bar surface.</b> Inverted fill (<Mono>var(--fg)</Mono> as background) — stands out above any screen content without colour semantics. Never tinted by tone.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Anchor position.</b> <Mono>insetInline: 12px; bottom: 20px</Mono> — above the home indicator safe area, inset from the screen edges.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Message.</b> One sentence describing what happened — past tense, factual, no punctuation needed.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Action.</b> The single ember affordance. ≥44px tap target; pointer-over or keyboard focus pauses the auto-dismiss (rail freezes) and releasing it resumes from the banked time. At most one action — if two are needed, use a Dialog instead.</span>
            <span className="num">6</span><span><b style={{ color: 'var(--fg)' }}>Countdown rail.</b> A 2px ember line depleting <Mono>scaleX</Mono> over the 4 s window so the dismiss timer is visible, not guessed. It freezes while paused and is omitted under <Mono>prefers-reduced-motion</Mono>.</span>
          </div>
        </div>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Live region — <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'inherit' }}>status</code> ↔ <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'inherit' }}>alert</code></div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>By default the bar is <code style={{ fontFamily: 'var(--font-mono)' }}>role="status"</code> + <code style={{ fontFamily: 'var(--font-mono)' }}>aria-live="polite"</code> + <code style={{ fontFamily: 'var(--font-mono)' }}>aria-atomic="true"</code> — VoiceOver and TalkBack read the whole message without stealing focus. The failure case in the demo (the locked-row archive) flips to <code style={{ fontFamily: 'var(--font-mono)' }}>role="alert"</code> / <code style={{ fontFamily: 'var(--font-mono)' }}>aria-live="assertive"</code> so the error interrupts — reserved for time-critical or failed actions, never the routine "archived" confirmation.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard map</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            <span style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 10, rowGap: 4, alignItems: 'baseline' }}>
              <Mono>Tab</Mono><span>move focus to the action</span>
              <Mono>Enter / Space</Mono><span>invoke the action, then dismiss</span>
              <Mono>Esc</Mono><span>dismiss the bar without acting</span>
            </span>
            <span style={{ display: 'block', marginBlockStart: 8 }}>Focusing the action (or hovering the bar) <b style={{ color: 'var(--fg)' }}>clears the auto-dismiss timer</b> and banks the time left; blur or pointer-leave re-arms it from there, so a slow reader never loses the window.</span>
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Action states — busy &amp; disabled</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>An in-flight action sets <Mono>aria-busy="true"</Mono> and renders a labelled Spinner (the accessible name becomes "Undo in progress"); a lapsed action sets <Mono>disabled</Mono> + <Mono>aria-disabled="true"</Mono> and ignores clicks. The action always carries an explicit <Mono>aria-label</Mono> so screen readers read "Undo", not just "button". Targets are ≥44px: the action via padding (not line-height), the dismiss-X at 44×44 around a 14px glyph — and the whole bar is ≥48px tall.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Contrast, focus &amp; reduced motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The ember action sits on the snackbar's fixed dark inverse surface (<Mono>var(--accent)</Mono> on <Mono>var(--snackbar-bg)</Mono>) — a high-contrast pairing that holds in both themes (≈6.9:1 in dark, ≈4.7:1 in light). The focus ring uses the global <Mono>--ring</Mono> token (ember outline), offset 2px. Under <Mono>prefers-reduced-motion: reduce</Mono> the countdown rail does not animate — the dismiss still fires, it just isn't traced — and no slide-in transition is implied.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — message right-aligns; action moves to the trailing edge (left)'} center>
        <div dir="rtl" style={{ padding: '24px', maxWidth: 360, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SnackbarBar message="تمت أرشفة الحادثة" action="تراجع" />
          <SnackbarBar message="تم حفظ دليل التشغيل في المسودات" action="عرض" icon={<Icons.doc size={15} />} />
        </div>
      </Frame>
      <Lede>The bar uses <Mono>display:flex</Mono> with logical padding (<Mono>paddingInlineStart</Mono>, <Mono>paddingInlineEnd</Mono>), so in RTL the optional icon moves to the right, the message right-aligns, and the action button sits at the trailing edge (left). The auto-dismiss timer is directionally neutral — it still counts down in seconds regardless of locale.</Lede>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — one action, inverted bar, ember CTA</div>
          <div className="body" style={{ alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: 280 }}>
              <SnackbarBar message="Incident archived" action="Undo" />
            </div>
          </div>
          <div className="note">Single ember action on an inverted neutral bar. The message says what happened; Undo is the one available remedy.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — two actions or a coloured bar</div>
          <div className="body" style={{ alignItems: 'center', justifyContent: 'center' }}>
            <div
              style={{
                width: '100%',
                maxWidth: 280,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 10px',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--danger)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.32)',
              }}
            >
              <span style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 500, color: '#fff' }}>Could not archive</span>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#fff' }}>Retry</span>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#fff', paddingInlineStart: 4 }}>Details</span>
            </div>
          </div>
          <div className="note">A danger fill plus two actions reads as an alert dialog. Colour communicates tone; two actions need a modal. Snackbar = one action, neutral bar.</div>
        </div>
      </div>

      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock
        label="snackbar"
        lang="tsx"
        code={`const DURATION = 4000; // auto-dismiss window (ms)

// Deadline-based timer so pause/resume bank the TRUE time left, not a fresh 4 s.
const deadline = useRef(0);          // Date.now() when the bar will dismiss
const remaining = useRef(DURATION);  // ms banked while paused
const timer = useRef<ReturnType<typeof setTimeout>>();
const [progress, setProgress] = useState(1); // 1 -> 0, drives the rail

function arm(ms: number) {
  clearTimeout(timer.current);
  deadline.current = Date.now() + ms;
  timer.current = setTimeout(() => setSnack(null), ms);
  // requestAnimationFrame loop sets progress = (deadline - now) / DURATION
}

// Each fire REPLACES the prior bar (one at a time): bump a key so React remounts.
function show(s: { message: string; action?: string; assertive?: boolean }) {
  setSnack(s); setSeq(n => n + 1); setProgress(1);
  remaining.current = DURATION; arm(DURATION);
}

// Pointer-over the bar OR keyboard focus on the action => pause.
function pause()  { remaining.current = deadline.current - Date.now();
                    clearTimeout(timer.current); timer.current = undefined; }
function resume() { if (snack) arm(remaining.current || DURATION); }

// Esc dismisses the live bar without acting (armed only while a bar shows).
useEffect(() => {
  if (!snack) return;
  const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSnack(null);
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
}, [snack]);

// Bar — anchored above safe area, full-width inset 12px from edges
{snack && (
  <div
    key={seq}                                // remount → replaces any prior bar
    // Errors / time-critical actions escalate to an assertive alert; everything
    // else is a polite status that won't steal focus.
    role={snack.assertive ? 'alert' : 'status'}
    aria-live={snack.assertive ? 'assertive' : 'polite'} aria-atomic="true"
    onMouseEnter={pause} onMouseLeave={resume}
    style={{ position:'absolute', overflow:'hidden',
      insetInline: 12, bottom: 20,           // logical — works in RTL
      background:'var(--snackbar-bg)', color:'var(--snackbar-fg)', /* inverse */ }}
  >
    <span style={{ flex: 1, fontWeight: 500 }}>{snack.message}</span>
    {snack.action && (
      <button
        aria-label={loading ? \`\${snack.action} (in progress)\` : snack.action}
        aria-busy={loading || undefined}       // in-flight action
        disabled={loading || disabled}         // ignores clicks while busy/lapsed
        onFocus={pause} onBlur={resume}
        onClick={() => { onAction?.(); setSnack(null); }}
        style={{ height: 44, minWidth: 44,
          color: (loading || disabled) ? 'var(--snackbar-fg)' : 'var(--accent)' /* sole ember */ }}>
        {loading && <Spinner size="sm" color="var(--snackbar-fg)" aria-label="in progress" />}
        {snack.action}
      </button>
    )}
    {/* Countdown rail — scaleX(progress); transition:'none' while paused freezes it */}
    <span aria-hidden style={{ position:'absolute', insetBlockEnd:0, insetInlineStart:0,
      blockSize:2, inlineSize:'100%', transformOrigin:'inline-start',
      transform:\`scaleX(\${progress})\`, background:'var(--accent)' }} />
  </div>
)}`}
      />
    </Section>
  );
}
