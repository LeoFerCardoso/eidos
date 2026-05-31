'use client';
// Forge Mobile — Overview. Introduction-style landing; the hero is a real DeviceFrame
// whose service widget cycles through the lifecycle states a mobile health surface
// actually has — loading → degraded → down — so the preview performs, not just poses.
import * as React from 'react';
import { DsOverview } from '@/components/docs';
import {
  DeviceFrame, ForgeMark, CountUp, Spinner, Skeleton,
  Alert, AlertTitle, AlertDescription,
  useChartColors, Recharts, Icons,
} from '@/ds/core';

const { AreaChart, Area, ResponsiveContainer } = Recharts;

// 24h p95 latency, sampled every 3h — fed to the DS area chart.
const DATA = [
  { t: '00', ms: 232 }, { t: '03', ms: 250 }, { t: '06', ms: 268 }, { t: '09', ms: 240 },
  { t: '12', ms: 258 }, { t: '15', ms: 230 }, { t: '18', ms: 286 }, { t: '21', ms: 274 },
];

// The three states the service widget walks through. Each is a real mobile state:
// a skeletoned fetch, a degraded-but-up read, and a full outage (role="alert").
type Phase = 'loading' | 'degraded' | 'down';
const PHASES: Phase[] = ['loading', 'degraded', 'down'];
const PHASE_LABEL: Record<Phase, string> = {
  loading: 'Loading service health',
  degraded: 'identity-svc degraded — p95 274ms',
  down: 'identity-svc down — no response',
};

// Honour prefers-reduced-motion in JS: the CSS guard only freezes CSS animation,
// not our setInterval. When reduced motion is requested we settle on the steady
// "degraded" frame statically — no cycling, no perpetual re-fetch.
function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  return reduced;
}

// App home — a Forge header (logo + name · avatar), then a service widget that
// renders one of three real states with an animated counter and a framed DS area
// chart. `phase` is driven by the hero; `cycle` re-keys the CountUp so it re-ticks.
function MobileMini({ phase, cycle }: { phase: Phase; cycle: number }) {
  const c = useChartColors();
  const loading = phase === 'loading';
  const down = phase === 'down';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* status bar */}
      <div style={{ height: 44, flex: '0 0 auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 18px 4px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg)' }}>
        <span>9:41</span>
        <span style={{ display: 'inline-flex', gap: 4, color: 'var(--fg-muted)' }}><Icons.activity size={11} /><Icons.battery size={12} /></span>
      </div>
      {/* app header — Forge logo (solid flame, the brand mark) + name, avatar trailing */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '16px 18px 22px', flex: '0 0 auto' }}>
        <ForgeMark size={23} variant="solid" color="var(--ember)" />
        <span style={{ fontWeight: 700, letterSpacing: '-0.02em', fontSize: 'var(--text-lg)' }}>Forge</span>
        <span style={{ marginInlineStart: 'auto', width: 30, height: 30, borderRadius: 999, background: 'var(--surface)', border: '1px solid var(--border-strong)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--fg-muted)' }}>LC</span>
      </div>
      {/* service widget — distinct card that bleeds to the bottom edge of the hero */}
      <div style={{ flex: 1, minHeight: 0, margin: '8px 12px 0', padding: '16px 16px 0', background: 'var(--surface)', border: '1px solid var(--border)', borderBottom: 'none', borderRadius: '18px 18px 0 0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* service row — neutral service icon (ember reserved for the data accent + brand) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, flex: '0 0 auto' }}>
          <Icons.server size={18} color="var(--fg-muted)" />
          <span style={{ fontWeight: 600, letterSpacing: '-0.01em', fontSize: 'var(--text-md)' }}>identity-svc</span>
          {phase === 'degraded' && <span className="pill warning" style={{ marginInlineStart: 'auto' }}><span className="dot" /> Degraded</span>}
          {phase === 'down' && <span className="pill danger" style={{ marginInlineStart: 'auto' }}><span className="dot" /> Down</span>}
          {loading && <span className="pill" style={{ marginInlineStart: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6 }}><Spinner size="sm" aria-label="Loading health" /> Checking</span>}
        </div>

        {/* ── LOADING: skeleton metric + spinner over the chart well ───────────── */}
        {loading && (
          <>
            <div style={{ marginTop: 16, flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Skeleton variant="line" width="46%" height={11} />
              <Skeleton variant="line" width="62%" height={26} />
              <Skeleton variant="line" width="74%" height={11} />
            </div>
            <div style={{ flex: 1, minHeight: 0, marginTop: 16, marginInline: -16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Spinner size="lg" aria-label="Loading p95 latency" color="var(--fg-subtle)" />
            </div>
          </>
        )}

        {/* ── DOWN: real role="alert" danger box + no-data metric ──────────────── */}
        {down && (
          <>
            <div style={{ marginTop: 14, flex: '0 0 auto' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-subtle)' }}>p95 latency · 24h</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-3xl)', fontWeight: 700, lineHeight: 1, color: 'var(--fg-faint)' }}>—</span>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-subtle)' }}>no data</span>
              </div>
            </div>
            <div style={{ marginTop: 14, flex: '0 0 auto' }}>
              <Alert tone="danger">
                <AlertTitle>Service unreachable</AlertTitle>
                <AlertDescription>No response for 40s. Retrying with backoff.</AlertDescription>
              </Alert>
            </div>
            <div style={{ flex: 1, minHeight: 0, marginTop: 12, marginInline: -16, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 4 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-subtle)', fontVariantNumeric: 'tabular-nums' }}>
                <Spinner size="sm" variant="dots" aria-label="Retrying" color="var(--fg-faint)" /> retry in 8s
              </span>
            </div>
          </>
        )}

        {/* ── DEGRADED (steady state): live metric + animated DS area chart ────── */}
        {phase === 'degraded' && (
          <>
            <div style={{ marginTop: 14, flex: '0 0 auto' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-subtle)' }}>p95 latency · 24h</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                <CountUp key={cycle} to={274} dur={1100} style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }} />
                <span style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--fg-muted)' }}>ms</span>
                <span style={{ marginInlineStart: 6, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: 'var(--success)' }}>▾ 8%</span>
              </div>
              <div style={{ fontSize: 'var(--text-sm)', lineHeight: 1.5, color: 'var(--fg-muted)', marginTop: 3, fontVariantNumeric: 'tabular-nums' }}>down 24ms over the last day · target 200ms</div>
            </div>
            <div style={{ flex: 1, minHeight: 0, marginTop: 14, marginInline: -16 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DATA} margin={{ top: 6, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="m-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={c[0]} stopOpacity={0.34} />
                      <stop offset="100%" stopColor={c[0]} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="ms" name="p95" stroke={c[0]} strokeWidth={2.5} fill="url(#m-fill)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MobileHero() {
  const reduced = usePrefersReducedMotion();
  // Cycle loading → degraded → down. Under reduced motion, settle on degraded.
  const [i, setI] = React.useState<number>(reduced ? 1 : 0);
  const [cycle, setCycle] = React.useState(0);
  React.useEffect(() => {
    if (reduced) { setI(1); return; }
    const id = setInterval(() => {
      setI((v) => {
        const next = (v + 1) % PHASES.length;
        if (PHASES[next] === 'degraded') setCycle((k) => k + 1);
        return next;
      });
    }, 2400);
    return () => clearInterval(id);
  }, [reduced]);

  const phase = PHASES[i];
  return (
    <>
      {/* Bare (no device picker), anchored to the top so the stage crops the bottom —
          the phone "peeks" closer, showing only its top half. */}
      <div style={{ position: 'absolute', insetBlockStart: 0, insetInlineStart: '50%', transform: 'translateX(-50%)' }}>
        <DeviceFrame bare maxHeight={680}><MobileMini phase={phase} cycle={cycle} /></DeviceFrame>
      </div>
      {/* Announce the widget state to assistive tech without exposing the looping demo
          visually as a second focusable element. */}
      <span
        aria-live="polite"
        aria-busy={phase === 'loading'}
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}
      >
        {PHASE_LABEL[phase]}
      </span>
    </>
  );
}

const PAGES: [string, string][] = [
  ['app-bar', 'App bar'], ['tab-bar', 'Tab bar'], ['search', 'Search'], ['chips', 'Filter chips'],
  ['list', 'List'], ['segmented', 'Segmented control'], ['sheet', 'Bottom sheet'], ['toast', 'Toast'], ['screens', 'Example screens'],
];
const D: Record<string, string> = {
  'app-bar': 'Large title that collapses on scroll.', 'tab-bar': 'Bottom nav — 3–5 destinations.',
  search: 'Field + recents + live results.', chips: 'Horizontal-scroll filters.', list: 'Grouped inset rows + switches.',
  segmented: 'Pill control for switching panels.', sheet: 'Edge-anchored action sheet.', toast: 'Transient snackbar with Undo.',
  screens: 'Full handset screens in the device frame.',
};

export default function MobileOverview() {
  return (
    <DsOverview
      eyebrow="Forge / Mobile"
      title="Touch-first Forge."
      lede="The same token graph, the same ember, the same primitives — re-sized for the thumb. Larger hit targets, bottom-anchored navigation and actions, edge-to-edge sheets, safe-area aware. Previewed at true device dimensions."
      hero={{
        eyebrow: 'Handset · 44px targets · safe-area',
        heading: 'Forge, scaled for the thumb.',
        subtitle: 'Same tokens, touch-first layout.',
        body: 'Navigation and primary actions live within thumb reach — tab bars and sheets, not top toolbars. Every surface ships its real states — loading, degraded, down — previewed at true iPhone / Pixel dimensions.',
        actions: (
          <>
            <a className="btn ember" href="/mobile/tab-bar">Browse mobile <Icons.arrowRight size={14} /></a>
            <a className="btn ghost" href="/mobile/screens">Example screens</a>
          </>
        ),
        visual: <MobileHero />,
        bleed: true,
      }}
      principlesTitle="Principles"
      principles={[
        { t: '44px targets', d: 'Every tappable element clears the minimum touch target; spacing scales up from the 4-pt base.' },
        { t: 'Bottom-anchored', d: 'Navigation and primary actions sit within thumb reach — tab bars and bottom sheets, not top toolbars.' },
        { t: 'Same language', d: 'Inherits tokens.css + ds.css. No new palette, no new accent — Forge, re-laid for touch.' },
      ]}
      tilesTitle="Components"
      tiles={PAGES.map(([slug, label]) => ({ href: `/mobile/${slug}`, label, desc: D[slug] }))}
      footer={{
        title: 'Designing a screen?',
        body: 'Assemble app-bar + list + tab-bar inside the DeviceFrame and switch devices to check the layout.',
        actions: <a className="btn" href="/mobile/screens">Example screens <Icons.arrowRight size={14} /></a>,
      }}
    />
  );
}
