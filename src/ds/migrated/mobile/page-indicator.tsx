'use client';
// Eidos Mobile — Page Indicator. The iOS page-control dots that show how many slides exist and
// which is current. The active dot is ember-filled; others are muted. Three variants: dots,
// dots with a count badge for many pages, and a progress-bar style. Pairs with Page Controller.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, DeviceFrame, Icons, Lede, Mono } from '@/ds/core';

// Inline-style transitions bypass the global ds.css prefers-reduced-motion guard
// (that reset only reaches stylesheet rules), so the dot width/background and the
// progress fill must be gated by this hook to truly honor the user setting.
function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return reduced;
}

// Roving Arrow-key navigation for a role="tablist" row of dots: ArrowLeft/Right
// (direction-aware in RTL), Home/End. Selects + moves focus to the target dot.
function useRovingTablist(current: number, total: number, select: (i: number) => void) {
  return React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
      let next = current;
      if (e.key === 'ArrowRight') next = rtl ? current - 1 : current + 1;
      else if (e.key === 'ArrowLeft') next = rtl ? current + 1 : current - 1;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = total - 1;
      else return;
      e.preventDefault();
      next = (next + total) % total;
      select(next);
      const tabs = e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]');
      tabs[next]?.focus();
    },
    [current, total, select]
  );
}

// ── Dot indicator ────────────────────────────────────────────────────────────────────────────
// Touch-friendly wrapper — the dot itself is small; the tappable area is ≥44px.
// `roving` drives the roving-tabindex contract: only the active dot is in the Tab
// order; Arrow keys move between the rest (handled on the parent tablist).
function TouchDot({ active, index, total, onClick, roving = false }: { active: boolean; index: number; total: number; onClick: () => void; roving?: boolean }) {
  const reduced = useReducedMotion();
  return (
    <button
      role="tab"
      aria-selected={active}
      aria-label={`Slide ${index + 1} of ${total}`}
      tabIndex={roving ? (active ? 0 : -1) : undefined}
      onClick={onClick}
      style={{
        width: 44,
        height: 44,
        display: 'grid',
        placeItems: 'center',
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        padding: 0,
      }}
    >
      <span
        style={{
          width: active ? 12 : 8,
          height: 8,
          borderRadius: 999,
          background: active ? 'var(--accent)' : 'var(--fg-faint)',
          display: 'block',
          transition: reduced ? undefined : 'width var(--dur, 200ms) var(--ease, ease)',
        }}
      />
    </button>
  );
}

// Count badge variant for many pages (≥8 dots ⇒ switch to "2 / 12" label)
function CountBadgeIndicator({ total, current }: { total: number; current: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          fontVariantNumeric: 'tabular-nums',
          color: 'var(--fg-muted)',
          background: 'var(--surface-active)',
          borderRadius: 999,
          padding: '2px 10px',
          lineHeight: 1.8,
        }}
      >
        {current + 1} / {total}
      </span>
    </div>
  );
}

// Progress-bar variant
function ProgressBarIndicator({ total, current }: { total: number; current: number }) {
  const reduced = useReducedMotion();
  const pct = ((current + 1) / total) * 100;
  return (
    <div
      role="progressbar"
      aria-valuenow={current + 1}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Slide ${current + 1} of ${total}`}
      style={{
        width: '100%',
        maxWidth: 200,
        height: 3,
        borderRadius: 999,
        background: 'var(--fg-faint)',
        overflow: 'hidden',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${pct}%`,
          background: 'var(--accent)',
          borderRadius: 999,
          transition: reduced ? undefined : 'width var(--dur, 250ms) var(--ease, ease)',
        }}
      />
    </div>
  );
}

// ── Live demo screen ─────────────────────────────────────────────────────────────────────────
const ONBOARDING = [
  { title: 'Deploy in seconds', body: 'Push to main and Eidos CI handles the rest — no config files, no waiting.', icon: 'rocket' },
  { title: 'Monitor every service', body: 'Real-time health, P50/P99 latency, and error budgets in a single view.', icon: 'activity' },
  { title: 'Ship with confidence', body: 'Progressive rollouts with automatic rollback keep production safe.', icon: 'shield' },
];

const STEP_MS = 4200; // dwell per onboarding slide before auto-advance

// INNOVATION — the active dot *fills* with ember as a countdown to the next
// slide, so the indicator doesn't just report position, it previews motion.
// It auto-plays, wraps, and pauses the instant the user touches, hovers, or
// focuses the screen; prefers-reduced-motion disables auto-play entirely.
function CountdownDot({ active, fill }: { active: boolean; fill: number }) {
  return (
    <span style={{ position: 'relative', width: active ? 18 : 8, height: 8, borderRadius: 999, background: 'var(--fg-faint)', display: 'block', overflow: 'hidden', transition: 'width var(--dur) var(--ease)' }}>
      {active && (
        <span style={{ position: 'absolute', insetBlock: 0, insetInlineStart: 0, width: `${fill * 100}%`, background: 'var(--accent)', borderRadius: 999 }} />
      )}
    </span>
  );
}

function PageIndicatorScreen() {
  const [current, setCurrent] = React.useState(0);
  const [fill, setFill] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const total = ONBOARDING.length;
  const reduced = useReducedMotion();
  const last = current === total - 1;
  const onKeyDown = useRovingTablist(current, total, setCurrent);
  const page = ONBOARDING[current];
  const Ic = (Icons as Record<string, React.ComponentType<{ size?: number; color?: string }>>)[page.icon];

  // Auto-advance loop: rAF-driven fill, paused on interaction / last slide /
  // reduced-motion. Restarts cleanly whenever `current` changes.
  const playing = !paused && !reduced && !last;
  React.useEffect(() => {
    setFill(0);
    if (!playing) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / STEP_MS, 1);
      setFill(p);
      if (p >= 1) setCurrent((c) => (c + 1) % total);
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [current, playing, total]);

  const pick = (i: number) => { setPaused(true); setCurrent(i); };

  return (
    <div
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      onPointerDown={() => setPaused(true)}
      onMouseEnter={() => setPaused(true)}
      onFocusCapture={() => setPaused(true)}
    >
      {/* Status bar */}
      <div style={{ height: 44, flex: '0 0 auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 16px 6px', fontFamily: 'var(--font-mono)', fontSize: 11, fontVariantNumeric: 'tabular-nums', color: 'var(--fg-muted)' }}>
        <span>9:41</span>
        <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}><Icons.activity size={12} /><Icons.battery size={13} /></span>
      </div>

      {/* Content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 20 }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: 'var(--surface-active)', display: 'grid', placeItems: 'center' }}>
          <Ic size={32} color="var(--fg)" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 8 }}>{page.title}</div>
          <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.55 }}>{page.body}</div>
        </div>
        {/* Announce slide changes to assistive tech without stealing focus */}
        <span role="status" aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>{`Slide ${current + 1} of ${total}: ${page.title}`}</span>
      </div>

      {/* Navigation row */}
      <div style={{ flex: '0 0 auto', padding: '0 16px 28px', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
        <div role="tablist" aria-label="Slide position" onKeyDown={onKeyDown} style={{ display: 'flex', justifyContent: 'center', gap: 6, minHeight: 44, alignItems: 'center' }}>
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`Slide ${i + 1} of ${total}`}
              tabIndex={i === current ? 0 : -1}
              onClick={() => pick(i)}
              style={{ width: 44, height: 44, display: 'grid', placeItems: 'center', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
            >
              <CountdownDot active={i === current} fill={i === current ? (playing ? fill : 1) : 0} />
            </button>
          ))}
        </div>
        <button
          onClick={() => { setPaused(true); setCurrent((c) => Math.min(c + 1, total - 1)); }}
          style={{
            width: '100%',
            height: 46,
            borderRadius: 'var(--radius-lg)',
            background: last ? 'var(--accent)' : 'var(--surface-active)',
            color: last ? 'var(--ember-fg)' : 'var(--fg)',
            fontWeight: 600,
            fontSize: 'var(--text-sm)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {last ? 'Get started' : 'Next'}
        </button>
      </div>
    </div>
  );
}

// ── Variants demo ────────────────────────────────────────────────────────────────────────────
function VariantsDemo() {
  const [dotPage, setDotPage] = React.useState(1);
  const [countPage, setCountPage] = React.useState(2);
  const [progPage, setProgPage] = React.useState(3);
  const onDotsKeyDown = useRovingTablist(dotPage, 5, setDotPage);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36, padding: '32px 24px' }}>
      {/* Dots */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <span className="t-mono-label">Dots — 5 pages</span>
        <div role="tablist" aria-label="Slide position" onKeyDown={onDotsKeyDown} style={{ display: 'flex', gap: 0 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <TouchDot key={i} active={i === dotPage} index={i} total={5} onClick={() => setDotPage(i)} roving />
          ))}
        </div>
      </div>
      {/* Count badge */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <span className="t-mono-label">Count badge — 12 pages</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => setCountPage((p) => Math.max(0, p - 1))} style={{ width: 28, height: 28, borderRadius: 999, border: '1px solid var(--border)', background: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
            <Icons.chevronLeft size={14} color="var(--fg)" />
          </button>
          <CountBadgeIndicator total={12} current={countPage} />
          <button onClick={() => setCountPage((p) => Math.min(11, p + 1))} style={{ width: 28, height: 28, borderRadius: 999, border: '1px solid var(--border)', background: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
            <Icons.chevronRight size={14} color="var(--fg)" />
          </button>
        </div>
      </div>
      {/* Progress bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <span className="t-mono-label">Progress bar — 6 steps</span>
        <div style={{ width: '80%' }}>
          <ProgressBarIndicator total={6} current={progPage} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setProgPage((p) => Math.max(0, p - 1))} style={{ padding: '4px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'none', cursor: 'pointer', fontSize: 'var(--text-base)', color: 'var(--fg)' }}>Back</button>
          <button onClick={() => setProgPage((p) => Math.min(5, p + 1))} style={{ padding: '4px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'none', cursor: 'pointer', fontSize: 'var(--text-base)', color: 'var(--fg)' }}>Next</button>
        </div>
      </div>
    </div>
  );
}

// ── RTL demo ─────────────────────────────────────────────────────────────────────────────────
function RtlIndicatorDemo() {
  const [page, setPage] = React.useState(0);
  const onKeyDown = useRovingTablist(page, 4, setPage);
  return (
    <div dir="rtl" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', padding: '28px 24px' }}>
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>اختر الشريحة</div>
      <div role="tablist" aria-label="موضع الشريحة" onKeyDown={onKeyDown} style={{ display: 'flex', flexDirection: 'row-reverse' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <TouchDot key={i} active={i === page} index={i} total={4} onClick={() => setPage(i)} roving />
        ))}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontVariantNumeric: 'tabular-nums', color: 'var(--fg-muted)' }}>
        الصفحة {page + 1} من 4
      </div>
    </div>
  );
}

// ── Page export ───────────────────────────────────────────────────────────────────────────────
export default function MobilePageIndicator() {
  return (
    <Section
      id="page-indicator"
      num="01"
      title="Page Indicator"
      desc="Dots, a count badge, or a progress bar that communicates which page is current and how many exist. The active dot is ember-filled; all others are muted. Pairs with Page Controller."
    >
      <SubHead meta="interactive">Usage</SubHead>
      <Lede>Place the indicator below the paged content area, never overlapping it. For 2–7 pages use dots; for 8 or more switch to the count badge to avoid a cluttered row.</Lede>
      <Frame label="3-page onboarding — auto-advances; the active dot fills as a countdown, then hands off. Tap, hover, or focus to pause and take over." center>
        <DeviceFrame initial="iphone-se"><PageIndicatorScreen /></DeviceFrame>
      </Frame>

      <SubHead meta="variants">Variants</SubHead>
      <Frame label="Dots · Count badge · Progress bar — interactive, tap to change">
        <VariantsDemo />
      </Frame>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 64px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', display: 'flex', gap: 6, alignItems: 'center' }} aria-hidden="true">
              {/* Dots row */}
              {[false, true, false, false].map((active, i) => (
                <span
                  key={i}
                  style={{
                    width: active ? 12 : 8,
                    height: 8,
                    borderRadius: 999,
                    background: active ? 'var(--accent)' : 'var(--fg-faint)',
                    display: 'block',
                  }}
                />
              ))}
              {/* Pin connectors */}
              <span className="lead v" style={{ top: -26, left: '10%', height: 22, transform: 'translateX(-50%)' }} />
              <span className="lead v" style={{ top: -26, left: '38%', height: 22, transform: 'translateX(-50%)' }} />
              <span className="lead v" style={{ bottom: -26, left: '60%', height: 22, transform: 'translateX(-50%)' }} />
              <span className="lead h" style={{ top: 0, right: -34, width: 28 }} />
              <div className="pin" style={{ top: -48, left: '10%', transform: 'translateX(-50%)' }}>1</div>
              <div className="pin" style={{ top: -48, left: '38%', transform: 'translateX(-50%)' }}>2</div>
              <div className="pin" style={{ bottom: -48, left: '60%', transform: 'translateX(-50%)' }}>3</div>
              <div className="pin" style={{ top: -4, right: -58 }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Inactive dot.</b> 8px circle in <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>--fg-faint</code> — visually quiet, still communicates page count.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Active dot.</b> Ember pill (12px wide, 8px tall), marking the current page. Transitions width on change — no jump, no scale. When auto-advancing, this pill widens and <b style={{ color: 'var(--fg)' }}>fills</b> as a countdown to the next slide.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Touch target.</b> Each dot's tappable region is ≥ 44 × 44px, regardless of the dot's visual size.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Row.</b> <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>role="tablist"</code> with <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>aria-label="Slide position"</code>; each dot is <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>role="tab" aria-selected</code>. Roving <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)' }}>tabindex</code> keeps one Tab stop; Arrow keys move between dots.</span>
          </div>
        </div>
      </div>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Swipe alternative</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Dots are tappable buttons — users who cannot perform a horizontal swipe gesture can navigate by tapping a dot directly. Never make swiping the only way to change pages.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader — page X of N</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The container is <code style={{ fontFamily: 'var(--font-mono)' }}>role="tablist"</code>; each dot is <code style={{ fontFamily: 'var(--font-mono)' }}>role="tab"</code> with <code style={{ fontFamily: 'var(--font-mono)' }}>aria-label="Slide 2 of 5"</code> and <code style={{ fontFamily: 'var(--font-mono)' }}>aria-selected</code> on the active one.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 10 }}>Keyboard — roving tablist</div>
          <div role="list" aria-label="Keyboard shortcuts" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {([
              ['Tab', 'Enter / leave the row — one stop, lands on the active dot'],
              ['→ / ←', 'Select & focus the next / previous page (mirrored under RTL)'],
              ['Home / End', 'Jump to the first / last page'],
              ['Space / Enter', 'Activate the focused dot'],
            ] as const).map(([keys, action]) => (
              <div key={keys} className="kbd-row" role="listitem">
                <span className="label" style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)' }}>{action}</span>
                <span className="kbd-chord trailing">
                  {keys.split(' / ').map((k) => <kbd key={k} className="kbd">{k}</kbd>)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Contrast — colour is never the only cue</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The ember active dot clears AA against the device surface, but it never carries the state alone: <code style={{ fontFamily: 'var(--font-mono)' }}>aria-selected</code> and the wider pill shape both encode "current", so the indicator reads for colour-blind users and assistive tech alike.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Reduced motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The dot tween, the progress-bar fill, and the onboarding auto-advance are inline transitions that bypass the global <code style={{ fontFamily: 'var(--font-mono)' }}>ds.css</code> guard. A <code style={{ fontFamily: 'var(--font-mono)' }}>useReducedMotion</code> flag drops the animations <b style={{ color: 'var(--fg)' }}>and</b> disables auto-play under <code style={{ fontFamily: 'var(--font-mono)' }}>prefers-reduced-motion: reduce</code> — slides only change when the user acts, with no countdown fill and no surprise advance.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Touch target ≥ 44px</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The visible dot is 8–12px wide, but the tappable region is always at least 44 × 44px, meeting WCAG 2.5.5 (Target Size). Use padding on the invisible button wrapper — never resize the dot itself.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — dots order mirrors; page 1 starts on the right'} center>
        <RtlIndicatorDemo />
      </Frame>
      <Lede>Under <Mono>dir="rtl"</Mono> the dot row reads right-to-left — page 1 is the rightmost dot. Use <Mono>flexDirection: 'row-reverse'</Mono> on the container rather than negating margins. The ember active dot and the width-transition animation are unchanged.</Lede>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — switch to count badge at 8+ pages</div>
          <div className="body" style={{ flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <CountBadgeIndicator total={12} current={4} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-muted)' }}>page 5 of 12</span>
          </div>
          <div className="note">More than 7 dots becomes a noisy row that's hard to scan. The count badge communicates position just as well without the clutter.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — cram a 12-dot row</div>
          <div className="body" style={{ flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} style={{ width: 6, height: 6, borderRadius: 999, background: i === 4 ? 'var(--accent)' : 'var(--fg-faint)', display: 'block' }} />
            ))}
          </div>
          <div className="note">Tiny, numerous dots are hard to tap (targets shrink below 44px) and impossible to count at a glance.</div>
        </div>
      </div>

      <SubHead meta="reference">Spec</SubHead>
      <CodeBlock
        label="page-indicator"
        lang="tsx"
        code={`function onKeyDown(e) {
  // roving Arrow-key nav — ArrowLeft/Right mirror under RTL, Home/End jump
  const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
  let next = d ? current + d : e.key === 'Home' ? 0 : e.key === 'End' ? last : current;
  if (next === current) return;
  e.preventDefault();
  next = (next + total) % total;
  setCurrent(next);
  tabsRef.current[next]?.focus(); // move focus with selection
}

<div role="tablist" aria-label="Slide position" onKeyDown={onKeyDown}>
  {pages.map((_, i) => (
    <button
      key={i}
      role="tab"
      aria-selected={i === current}
      aria-label={\`Slide \${i + 1} of \${pages.length}\`}
      tabIndex={i === current ? 0 : -1}   /* roving tabindex: one Tab stop */
      onClick={() => setCurrent(i)}
      className="m-page-dot"
    >
      {/* m-page-dot is a ≥44×44px touch target */}
      <span className={i === current ? 'dot active' : 'dot'} />
    </button>
  ))}
</div>

/* .dot        — width: 8px; height: 8px; border-radius: 999px; background: var(--fg-faint)
   .dot.active — width: 12px; background: var(--accent);
                 transition: width var(--dur) var(--ease);
   Gate that transition behind useReducedMotion() — inline transitions
   bypass the global prefers-reduced-motion reset.
   Use CountBadgeIndicator when pages.length >= 8 */

// Optional auto-advance: the active dot fills as a countdown, then hands off.
// Pause on any interaction; never auto-play under reduced motion.
const playing = !paused && !reduced && current < total - 1;
React.useEffect(() => {
  setFill(0);
  if (!playing) return;
  let raf = 0; const t0 = performance.now();
  const tick = (now) => {
    const p = Math.min((now - t0) / STEP_MS, 1);
    setFill(p);
    p >= 1 ? setCurrent((c) => (c + 1) % total) : (raf = requestAnimationFrame(tick));
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}, [current, playing, total]);`}
      />
    </Section>
  );
}
