'use client';
// Forge — Home / personal digest. "What needs your attention" landing: a Forge AI
// morning summary, estate KPIs, a ranked attention feed, and an aside with my
// services, on-call and recent incidents. Composed from Eidos DS primitives.
import * as React from 'react';
import Link from 'next/link';
import {
  Avatar,
  BrandIcon,
  Button,
  ForgeMark,
  HealthBadge,
  Icons,
  Pill,
  SeverityPill,
  Sparkline,
  Trend,
} from '@/ds/core';
import { FPageHeader, FKpi, FSection, IconBubble, FCardHead, FRows, FRow, Sub } from '@/portal/shell/portal-shell';
import { SERVICES, getService } from '@/portal/data/services';

// ── Forge AI morning digest ───────────────────────────────────────────────────
const DIGEST: { tone: 'danger' | 'warning' | 'ok'; text: React.ReactNode; href: string }[] = [
  {
    tone: 'danger',
    text: (
      <>
        <strong>acerta-api</strong> p99 is up <strong>41%</strong> since v4.12.0, likely the new
        konduto-antifraud rule. I drafted a rollback.
      </>
    ),
    href: '/portal/catalog/acerta-api',
  },
  {
    tone: 'warning',
    text: (
      <>
        <strong>INC-2041</strong> is still open (p95 spike); on-call is Bruno Mendes, paged 6h ago.
      </>
    ),
    href: '/portal/catalog/acerta-api',
  },
  {
    tone: 'ok',
    text: (
      <>
        Estate health is up <strong>2 pts</strong> week-over-week; 44 deploys shipped, 0 failed gates.
      </>
    ),
    href: '/portal/catalog',
  },
];

const HEALTH_SERIES = [88, 89, 90, 89, 91, 90, 92];
const RISK_SERIES = [48, 45, 44, 42, 40, 41, 38];
const VELOCITY_SERIES = [31, 34, 36, 39, 41, 43, 44];
const COST_SERIES = [410, 430, 440, 455, 470, 480, 488];

// ── Attention feed ─────────────────────────────────────────────────────────────
const FEED: {
  id: string;
  icon: string;
  tone: 'danger' | 'warning';
  title: string;
  meta: string;
  href: string;
  badge: React.ReactNode;
}[] = [
  {
    id: 'f1',
    icon: 'server',
    tone: 'danger',
    title: 'acerta-api degraded · p99 latency over SLO',
    meta: 'Correlated with konduto-antifraud v3.1.7 · Forge AI proposed a rollback',
    href: '/portal/catalog/acerta-api',
    badge: <HealthBadge state="degraded" pulse />,
  },
  {
    id: 'f2',
    icon: 'incident',
    tone: 'danger',
    title: 'INC-2041 · p95 spike after konduto-antifraud deploy',
    meta: 'Opened 6h ago · commander Bruno Mendes · 2 services impacted',
    href: '/portal/catalog/acerta-api',
    badge: <SeverityPill level="p2" />,
  },
  {
    id: 'f3',
    icon: 'shield',
    tone: 'warning',
    title: 'konduto-antifraud false-positive rate +18%',
    meta: 'Since v3.1.7 · review the new fraud-score rule or roll back',
    href: '/portal/catalog/konduto-antifraud',
    badge: <HealthBadge state="degraded" pulse />,
  },
  {
    id: 'f4',
    icon: 'score',
    tone: 'warning',
    title: 'bureau-api scorecard slipped to B',
    meta: 'Observability · missing trace coverage on 2 endpoints',
    href: '/portal/catalog/bureau-api',
    badge: <Pill tone="warning">Grade B</Pill>,
  },
];

const MY_SERVICES = ['acerta-api', 'score-engine', 'scpc-gateway', 'consent-service'];

// Doom-fire heat-simulation tunables for the welcome-hero background. No UI
// controls — these are the knobs: lateral wind, base combustion, cooling rate
// (flame height) and the frame cadence.
const FLAME = {
  WIND: -0.35,    // lateral drift: <0 leans toward inline-start, >0 inline-end
  FUEL: 0.95,     // combustion intensity at the base (0..1)
  COOLING: 0.14,  // decay per row: higher = shorter flames, lower = taller
  FRAME_MS: 55,   // ~18fps — a calm flicker, not a strobe
};

// Character-mosaic variant — faithful to the reference terminal-fire "density"
// mode: the heat field is rendered as the literal monospace ramp " ░ ▒ ▓ █"
// inside a <pre> (Geist Mono, tracking-widest, leading-none), NOT drawn squares.
// Grid (COLS×ROWS) is measured from the container + font metrics so the glyphs
// tile the whole hero. Colour is var(--ember) with a soft ember glow.
const FLAME_CHARS = [' ', '░', '▒', '▓', '█'];

function HeroFlameChars() {
  const ref = React.useRef<HTMLPreElement | null>(null);

  React.useEffect(() => {
    const pre = ref.current;
    if (!pre) return;
    const { WIND, FUEL, COOLING, FRAME_MS } = FLAME;

    let COLS = 0, ROWS = 0;
    let heat = new Float32Array(0);

    const measure = () => {
      const rect = pre.getBoundingClientRect();
      const cs = getComputedStyle(pre);
      const span = document.createElement('span');
      span.style.cssText = `position:absolute;visibility:hidden;white-space:pre;font-family:${cs.fontFamily};font-size:${cs.fontSize};letter-spacing:${cs.letterSpacing}`;
      span.textContent = '█'.repeat(50);
      document.body.appendChild(span);
      const charW = span.getBoundingClientRect().width / 50 || 8;
      document.body.removeChild(span);
      const lineH = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) || 12;
      COLS = Math.max(24, Math.floor(rect.width / charW) + 2);
      ROWS = Math.max(8, Math.floor(rect.height / lineH) + 1);
      heat = new Float32Array(COLS * (ROWS + 1));
    };

    const step = () => {
      const base = ROWS * COLS;
      for (let x = 0; x < COLS; x++) {
        heat[base + x] = Math.random() < 0.15 ? Math.random() * 0.4 + (FUEL - 0.4) : FUEL;
      }
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          let windShift = 0;
          if (WIND !== 0 && Math.random() < Math.abs(WIND)) windShift = WIND > 0 ? 1 : -1;
          const sx = (x + windShift + COLS) % COLS;
          const parent = heat[(y + 1) * COLS + sx] || 0;
          const decay = Math.random() * COOLING * 1.5;
          heat[y * COLS + x] = Math.max(0, parent - decay);
        }
      }
    };

    const render = () => {
      const n = FLAME_CHARS.length;
      let out = '';
      for (let y = 0; y < ROWS; y++) {
        let line = '';
        for (let x = 0; x < COLS; x++) {
          const idx = Math.min(n - 1, Math.floor(heat[y * COLS + x] * n * 1.1));
          line += FLAME_CHARS[idx];
        }
        out += y < ROWS - 1 ? line + '\n' : line;
      }
      pre.textContent = out;
    };

    measure();
    for (let i = 0; i < ROWS + 8; i++) step();
    render();

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0, last = 0, visible = true;
    const loop = (t: number) => {
      if (visible && t - last >= FRAME_MS) {
        last = t;
        step();
        render();
      }
      raf = requestAnimationFrame(loop);
    };
    if (!reduce) raf = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => { measure(); render(); });
    ro.observe(pre);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(pre);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <pre ref={ref} className="wh-mosaic wh-flame-chars" aria-hidden="true" />;
}

// Faint static square-mosaic — a very low-opacity background texture (the original
// dissolve pattern), behind the fire. Seeded with Math.sin → SSR-stable.
function HeroMosaicBG() {
  const COLS = 104, ROWS = 16, CELL = 16, GAP = 2;
  const rnd = (c: number, r: number) => {
    const s = Math.sin(c * 127.1 + r * 311.7) * 43758.5453;
    return s - Math.floor(s);
  };
  const rects: React.ReactNode[] = [];
  for (let r = 0; r < ROWS; r++) {
    const rowF = r / (ROWS - 1);
    for (let c = 0; c < COLS; c++) {
      if (rnd(c, r) > rowF * 1.15 + 0.02) continue;
      const o = (0.06 + rowF * 0.4) * (0.55 + rnd(c + 13, r + 7) * 0.45);
      rects.push(<rect key={`${c}-${r}`} x={c * CELL} y={r * CELL} width={CELL - GAP} height={CELL - GAP} rx={1.5} opacity={Number(o.toFixed(3))} />);
    }
  }
  return (
    <svg className="wh-mosaic-bg" viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`} preserveAspectRatio="none" aria-hidden="true">
      {rects}
    </svg>
  );
}

// Twisted-glass swirl — a spiral fan of translucent ember "blades" treated with
// the Apple liquid-glass technique: an SVG turbulence+displacement filter drives
// a masked backdrop-filter so the FIRE behind refracts through each petal, with
// lit rims drawn on top. Big + centre-framed: petals bleed past the hero and get
// cropped (overflow:hidden); only the vortex centre (with the ForgeMark) is framed.
const SWIRL_N = 18;
const SWIRL_C = 280; // centre of the 560×560 space
// One asymmetric glass blade (inner base near centre, tip up + curving) → a
// spiralling vortex when repeated around the centre.
const SWIRL_PETAL = 'M280 236 C 246 168 248 86 302 22 C 316 60 336 156 314 226 C 306 234 294 238 280 236 Z';
const swirlTransform = (i: number) => `rotate(${(i * 360) / SWIRL_N} ${SWIRL_C} ${SWIRL_C})`;
// White petal silhouette → used as the mask that clips the glass backdrop pane.
const SWIRL_MASK =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 560"><g fill="#fff">` +
      Array.from({ length: SWIRL_N }, (_, i) => `<path d="${SWIRL_PETAL}" transform="${swirlTransform(i)}"/>`).join('') +
      `</g></svg>`,
  );

function HeroGlassSwirl() {
  return (
    <div className="wh-swirl" aria-hidden="true">
      {/* Liquid-glass distortion filter (samarkandiy technique: feTurbulence →
          blur → feDisplacementMap, driven via `filter:url()` on the glass layer). */}
      <svg className="wh-swirl-filter" aria-hidden="true">
        <filter id="wh-liquid" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="92" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
          <feDisplacementMap in="SourceGraphic" in2="blurred" scale="60" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      {/* Glass: layered like the reference — a displacement-filtered backdrop +
          a tint overlay, clipped to the petal swirl via mask. */}
      <div
        className="wh-swirl-glass"
        style={{ WebkitMaskImage: `url("${SWIRL_MASK}")`, maskImage: `url("${SWIRL_MASK}")` }}
      >
        <div className="wh-swirl-gfilter" />
        <div className="wh-swirl-goverlay" />
      </div>
      {/* Lit rims + faint body tint on top of the glass. */}
      <svg className="wh-swirl-edges" viewBox="0 0 560 560">
        <defs>
          <radialGradient id="wh-glass-grad" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.16" />
            <stop offset="0.6" stopColor="var(--ember)" stopOpacity="0.12" />
            <stop offset="1" stopColor="var(--ember-glow)" stopOpacity="0" />
          </radialGradient>
        </defs>
        {Array.from({ length: SWIRL_N }, (_, i) => (
          <path key={i} className="wh-swirl-petal" d={SWIRL_PETAL} transform={swirlTransform(i)} />
        ))}
      </svg>
      <div className="wh-swirl-core"><ForgeMark size={80} variant="outline" /></div>
    </div>
  );
}

// Rotating 3D glass icosahedron — a tiny orthographic 3D engine: the 12 vertices
// of a regular icosahedron (golden-ratio coords) are rotated each frame and the
// 20 triangular faces drawn as translucent ember glass (front faces brighter)
// with lit edges = the facets. ForgeMark glows at the centre, seen through the
// glass. Big + centre-framed: it bleeds past the hero and is cropped.
const ICO_FACES = [
  [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
  [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
  [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
  [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
];

function HeroIco() {
  const gRef = React.useRef<SVGGElement | null>(null);

  React.useEffect(() => {
    const g = gRef.current;
    if (!g) return;
    const NS = 'http://www.w3.org/2000/svg';
    const phi = (1 + Math.sqrt(5)) / 2;
    const L = Math.hypot(1, phi);
    const raw = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
    ];
    const verts = raw.map(([x, y, z]) => [x / L, y / L, z / L]); // unit sphere
    const R = 250, CX = 300, CY = 300;
    const polys = ICO_FACES.map(() => {
      const p = document.createElementNS(NS, 'polygon');
      p.setAttribute('class', 'wh-ico-face');
      g.appendChild(p);
      return p;
    });

    let ax = 0.5, ay = 0.3;
    const draw = () => {
      const cx1 = Math.cos(ax), sx = Math.sin(ax), cy1 = Math.cos(ay), sy = Math.sin(ay);
      const rv = verts.map(([x, y, z]) => {
        const X = x * cy1 + z * sy, Z = -x * sy + z * cy1;       // rotate Y
        const Y2 = y * cx1 - Z * sx, Z2 = y * sx + Z * cx1;      // rotate X
        return [X * R, Y2 * R, Z2 * R];
      });
      ICO_FACES.forEach((f, i) => {
        const a = rv[f[0]], b = rv[f[1]], c = rv[f[2]];
        const nz = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
        const front = nz < 0; // screen y is down → front faces have nz < 0
        const el = polys[i];
        el.setAttribute('points', `${CX + a[0]},${CY + a[1]} ${CX + b[0]},${CY + b[1]} ${CX + c[0]},${CY + c[1]}`);
        el.setAttribute('fill-opacity', front ? '0.10' : '0.035');
        el.setAttribute('stroke-opacity', front ? '0.24' : '0.08');
      });
    };

    draw();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let visible = true;
    const loop = () => {
      if (visible) { ax += 0.0028; ay += 0.0045; draw(); }
      raf = requestAnimationFrame(loop);
    };
    if (!reduce) raf = requestAnimationFrame(loop);
    const host = g.closest('.wh-ico') ?? g;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(host);

    return () => { cancelAnimationFrame(raf); io.disconnect(); polys.forEach((p) => p.remove()); };
  }, []);

  return (
    <div className="wh-ico" aria-hidden="true">
      {/* Liquid-glass base: a soft circular frosted disc that refracts the fire. */}
      <svg className="wh-ico-filter" aria-hidden="true">
        <filter id="wh-ico-dist" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.01 0.01" numOctaves="2" seed="42" result="n" />
          <feGaussianBlur in="n" stdDeviation="2" result="nb" />
          <feDisplacementMap in="SourceGraphic" in2="nb" scale="46" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div className="wh-ico-glass">
        <div className="gf" />
        <div className="ov" />
      </div>
      <svg className="wh-ico-svg" viewBox="0 0 600 600"><g ref={gRef} /></svg>
      <div className="wh-ico-core"><ForgeMark size={72} variant="outline" /></div>
    </div>
  );
}

// Forge-as-processor diagram for the hero's inline-end. The ForgeMark is the
// chip; six brand nodes (models + apps) wire into it via orthogonal PCB traces,
// with an ember pulse flowing node→chip. Everything is glass so the fire behind
// glows through. Pure layout math in a 420×220 viewBox; nodes/chip are HTML
// (for BrandIcon/ForgeMark) positioned by %, traces are one SVG layer beneath.
const CIRCUIT_VB = { w: 420, h: 220 };
const CIRCUIT_CHIP = { cx: 344, cy: 110 }; // chip centre in viewBox units
const CIRCUIT_PIN_X = 300; // chip's left edge in viewBox units
// Nodes authored top→bottom. With distinct, well-separated y's and a per-node
// vertical channel that DECREASES as the pin row increases, the fan-in is
// provably crossing-free and no segment ever runs through a node disc (all
// routing lives to the right of every node).
const CIRCUIT_NODES = [
  { slug: 'claude',     x: 72,  y: 30 },
  { slug: 'gemini',     x: 152, y: 62 },
  { slug: 'gpt',        x: 48,  y: 94 },
  { slug: 'kubernetes', x: 150, y: 126 },
  { slug: 'slack',      x: 92,  y: 158 },
  { slug: 'github',     x: 64,  y: 190 },
];

function HeroCircuit() {
  const pct = (v: number, axis: 'w' | 'h') => `${(v / CIRCUIT_VB[axis]) * 100}%`;
  return (
    <div className="wh-circuit" aria-hidden="true">
      <svg className="wh-circuit-svg" viewBox={`0 0 ${CIRCUIT_VB.w} ${CIRCUIT_VB.h}`} preserveAspectRatio="none">
        {CIRCUIT_NODES.map((n, i) => {
          const py = 70 + i * 16;   // pin row, top→bottom
          const ch = 270 - i * 16;  // vertical channel, decreasing → no crossings
          const d = `M ${n.x} ${n.y} H ${ch} V ${py} H ${CIRCUIT_PIN_X}`;
          return (
            <g key={n.slug}>
              <path className="trace" d={d} />
              <path className="flow" d={d} style={{ animationDelay: `${i * 0.34}s` }} />
              <circle className="via" cx={n.x} cy={n.y} r={2.4} />
              <circle className="via" cx={CIRCUIT_PIN_X} cy={py} r={2} />
            </g>
          );
        })}
      </svg>
      {CIRCUIT_NODES.map((n) => (
        <span key={n.slug} className="wh-circuit-node" style={{ left: pct(n.x, 'w'), top: pct(n.y, 'h') }}>
          <BrandIcon slug={n.slug} size={18} />
        </span>
      ))}
      <div className="wh-circuit-core" style={{ left: pct(CIRCUIT_CHIP.cx, 'w'), top: pct(CIRCUIT_CHIP.cy, 'h') }}>
        <ForgeMark size={80} variant="outline" />
      </div>
    </div>
  );
}

const TONE_ICON: Record<string, 'danger' | 'warn' | 'ember'> = {
  danger: 'danger',
  warning: 'warn',
  ok: 'ember',
};

export default function PortalHome() {
  const degraded = SERVICES.filter((s) => s.alert).length;

  return (
    <>
      <FPageHeader
        eyebrow="Home"
        leading={<Icons.sparkle size={22} style={{ color: 'var(--ember)' } as React.CSSProperties} />}
        title="Good morning, Leonardo"
        subtitle="Here's what needs your attention across the estate today."
        actions={
          <>
            <Button variant="ghost" asChild><Link href="/portal/create">
              <Icons.plus size={13} /> New service
            </Link></Button>
            <Button variant="ember">
              <Icons.sparkle size={13} /> Ask Forge AI
            </Button>
          </>
        }
      />

      {/* Welcome hero — sits directly under the header; greeting stays above.
          Background: an animated terminal-fire mosaic (density ramp " ░ ▒ ▓ █"
          rendered as monospace glyphs, var(--ember)). */}
      <section className="fp-welcome-hero page-enter">
        {/* Layered background watermarks (all behind the fire): a faint static
            mosaic texture + two ForgeMark marks at different sizes/positions. */}
        <HeroMosaicBG />
        <div className="wh-mark-bg wh-mark-bg--a" aria-hidden="true"><ForgeMark size={360} variant="outline" /></div>
        <div className="wh-mark-bg wh-mark-bg--b" aria-hidden="true"><ForgeMark size={150} variant="outline" /></div>
        <HeroFlameChars />
        <div className="wh-gradient" aria-hidden="true" />
        <span
          className="ember-glow-bg"
          aria-hidden="true"
          style={{ width: 420, height: 420, insetInlineEnd: -140, insetBlockStart: -170 } as React.CSSProperties}
        />
        {/* Directional scrim — darkens the copy column so text/buttons stay
            legible over the fire, while the flames keep breathing on the end side. */}
        <div className="wh-scrim" aria-hidden="true" />
        {/* Sparkles — same faint watermark style as the marks, spread out so they
            don't overlap the ForgeMarks. */}
        <div className="wh-sparkles" aria-hidden="true">
          {[
            { x: 13, y: 26, s: 18, d: 0 },
            { x: 30, y: 64, s: 13, d: 1.1 },
            { x: 44, y: 20, s: 22, d: 2.0 },
            { x: 58, y: 72, s: 14, d: 0.7 },
            { x: 70, y: 30, s: 16, d: 2.6 },
            { x: 90, y: 80, s: 12, d: 1.6 },
          ].map((sp, i) => (
            <span
              key={i}
              className="wh-sparkle"
              style={{ insetInlineStart: `${sp.x}%`, insetBlockStart: `${sp.y}%`, animationDelay: `${sp.d}s` } as React.CSSProperties}
            >
              <Icons.sparkle size={sp.s} />
            </span>
          ))}
        </div>
        <div className="wh-inner">
          <div className="wh-copy">
            <span className="wh-eyebrow t-mono-label">The Forge</span>
            <h2 className="wh-title">Less friction. More shipping.</h2>
            <p className="wh-sub">
              From idea to production, Forge removes the obstacles between engineers and impact.
              Standardized paths, built-in best practices and AI-powered workflows keep teams moving
              forward.
            </p>
            <div className="wh-actions">
              <Button variant="ember" asChild><Link href="/portal/create">
                <Icons.plus size={13} /> Forge a service
              </Link></Button>
              <Button variant="ghost" asChild><Link href="/portal/catalog">
                <Icons.catalog size={13} /> Explore the catalog
              </Link></Button>
            </div>
          </div>
        </div>
      </section>

      {/* Forge AI morning digest */}
      <section
        style={{
          background: 'var(--ember-softer)',
          border: '1px solid color-mix(in oklch, var(--ember) 22%, transparent)',
          borderRadius: 'var(--radius-2xl)',
          padding: '16px 18px',
          marginBlockEnd: 20,
          display: 'flex',
          gap: 14,
        }}
      >
        <IconBubble icon="sparkle" size={36} tone="ember" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBlockEnd: 8 }}>
            <strong style={{ fontSize: 'var(--text-sm)' }}>Forge AI</strong>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>
              your morning · 3 things
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {DIGEST.map((d, i) => (
              <Link
                key={i}
                href={d.href}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 9,
                  fontSize: 'var(--text-sm)',
                  lineHeight: 1.5,
                  color: 'var(--fg)',
                  textDecoration: 'none',
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    marginBlockStart: 7,
                    flexShrink: 0,
                    background:
                      d.tone === 'danger' ? 'var(--danger)' : d.tone === 'warning' ? 'var(--warning)' : 'var(--success)',
                  }}
                />
                <span>{d.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Estate KPIs */}
      <div className="fp-grid fp-grid-4" style={{ marginBlockEnd: 22 }}>
        <FKpi label="Estate health" value="92" sub={<Sparkline data={HEALTH_SERIES} w={200} h={30} color="var(--success)" />} trendNode={<Trend delta={2} unit="pts" />} />
        <FKpi label="Degraded now" value={degraded} sub={<Sub muted>of {SERVICES.length} services</Sub>} trendNode={<Trend delta={1} unit="" inverted />} />
        <FKpi label="Open incidents" value="1" sub={<Sub muted>1 P2 · 0 P1</Sub>} />
        <FKpi label="Deploys / week" value="44" sub={<Sparkline data={VELOCITY_SERIES} w={200} h={30} />} trendNode={<Trend delta={12} unit="%" />} />
      </div>

      {/* Two columns */}
      <div className="fp-grid fp-grid-2x1" style={{ alignItems: 'flex-start', gap: 18 }}>
        {/* Attention feed */}
        <FSection title="Needs attention · ranked by impact">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FEED.map((it) => (
              <div key={it.id} className="fp-card" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <IconBubble icon={it.icon} size={38} tone={TONE_ICON[it.tone]} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBlockEnd: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: 'var(--text-base)' }}>{it.title}</span>
                    {it.badge}
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', lineHeight: 1.5, margin: 0 }}>{it.meta}</p>
                  <div style={{ display: 'flex', gap: 8, marginBlockStart: 12 }}>
                    <Button variant="ghost" size="sm" asChild><Link href={it.href}>
                      View <Icons.chevronRight size={12} />
                    </Link></Button>
                    <Button variant="ghost" size="sm">
                      <Icons.sparkle size={12} /> Ask Forge AI
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FSection>

        {/* Aside */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* On-call */}
          <div className="fp-card">
            <FCardHead title="On-call · my tribe" action={<Pill tone="ember" dot>paged</Pill>} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBlockStart: 4 }}>
              <Avatar name="Bruno Mendes" size="lg" ember />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600 }}>Bruno Mendes</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>SRE · Score &amp; Risk · ends in 6h</div>
              </div>
              <Button variant="ghost" size="sm">
                <Icons.bell size={12} /> Page
              </Button>
            </div>
          </div>

          {/* My services */}
          <div className="fp-card">
            <FCardHead
              title="My services"
              action={
                <Link href="/portal/catalog" className="ds-link-inline" style={{ fontSize: 'var(--text-sm)' }}>
                  View all
                </Link>
              }
            />
            <FRows>
              {MY_SERVICES.map((id) => {
                const s = getService(id);
                if (!s) return null;
                return (
                  <FRow key={id} href={`/portal/catalog/${id}`}>
                    <span className="fp-row-main" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>{s.name}</span>
                    <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>{s.p95}ms</span>
                    <HealthBadge state={s.alert ? 'degraded' : 'up'} pulse={s.alert} />
                  </FRow>
                );
              })}
            </FRows>
          </div>

          {/* CTA */}
          <Link
            href="/portal/create"
            className="fp-card fp-card--ember-hero"
            style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'inherit' }}
          >
            <IconBubble icon="package" size={36} tone="ember" />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>Spin up a new service</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>Paved-road templates · ~3 min</div>
            </div>
            <Icons.arrowRight size={16} style={{ color: 'var(--ember)' } as React.CSSProperties} />
          </Link>
        </div>
      </div>
    </>
  );
}
