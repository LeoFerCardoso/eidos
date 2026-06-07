'use client';
// Forge — AI pattern background. A deterministic field of short, rounded line
// segments (horizontal + vertical dashes) on a fine grid, tinted by a colour
// wave that flows left -> right cycling the three theme accents (ember -> ice ->
// violet). It is the signature background for Forge AI surfaces, replacing the
// generic glow/sparkle banner look. Pure, SSR-stable (sin-hash, no random/Date),
// aria-hidden. The dashes are kept small by a dense grid; the wave is a repeating
// userSpace gradient translated by one tile (SMIL), paused under
// prefers-reduced-motion.
import * as React from 'react';
import { Button } from '@/ds/core';

/**
 * Forge AI banner — the signature dash-pattern hero shared across Forge AI
 * surfaces: eyebrow + title + support (2 lines, with highlighted terms) and an
 * optional right-aligned action, over the animated pattern + accent-wave border.
 * Highlight key entities/metrics in `children` with <span className="fp-aip-hl">
 * (add `mono` for identifiers).
 */
export function AiBanner({
  title,
  action,
  eyebrow = 'Forge AI',
  children,
}: {
  title: React.ReactNode;
  action?: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="fp-aip-banner" role="note">
      <AiPattern />
      <div className="fp-aip-banner-text">
        <span className="fp-aip-banner-eyebrow">{eyebrow}</span>
        <strong className="fp-aip-banner-title">{title}</strong>
        <p className="fp-aip-banner-desc">{children}</p>
      </div>
      {action && (
        <Button variant="outline" size="md" className="fp-aip-banner-action">
          {action}
        </Button>
      )}
    </div>
  );
}

export function AiPattern({ className }: { className?: string }) {
  const PITCH = 13;
  const COLS = 180; // dense → small dashes
  const ROWS = 26;
  const SW = 4.2;
  const W = COLS * PITCH;
  const H = ROWS * PITCH;
  const TILE = PITCH * 120; // wave wavelength (one accent cycle) — long, so the accents spread out
  const gid = 'aip-' + React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const ref = React.useRef<SVGSVGElement>(null);

  // Pause the SMIL colour wave when the user prefers reduced motion.
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      const el = ref.current as unknown as { pauseAnimations?: () => void; unpauseAnimations?: () => void } | null;
      if (!el) return;
      if (mq.matches) el.pauseAnimations?.();
      else el.unpauseAnimations?.();
    };
    apply();
    mq.addEventListener?.('change', apply);
    return () => mq.removeEventListener?.('change', apply);
  }, []);

  const rnd = (c: number, r: number) => {
    const s = Math.sin(c * 127.1 + r * 311.7) * 43758.5453;
    return s - Math.floor(s);
  };

  const a = PITCH * 0.24;
  const b = PITCH * 0.76;
  const mid = PITCH * 0.5;
  const segs: React.ReactNode[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = c * PITCH;
      const y = r * PITCH;
      const roll = rnd(c, r);
      const op = (0.5 + rnd(c + 9, r + 4) * 0.5).toFixed(2);
      let seg: React.ReactNode = null;
      if (roll < 0.28) {
        seg = <line x1={x + a} y1={y + mid} x2={x + b} y2={y + mid} />; // H, 1 cell
      } else if (roll < 0.52) {
        seg = <line x1={x + mid} y1={y + a} x2={x + mid} y2={y + b} />; // V, 1 cell
      } else if (roll < 0.62) {
        seg = <line x1={x + a} y1={y + mid} x2={x + PITCH + b} y2={y + mid} />; // H, 2 cells
      } else if (roll < 0.7) {
        seg = <line x1={x + mid} y1={y + a} x2={x + mid} y2={y + PITCH + b} />; // V, 2 cells
      }
      if (seg) segs.push(<g key={`${c}-${r}`} opacity={Number(op)}>{seg}</g>);
    }
  }

  return (
    <svg
      ref={ref}
      className={'fp-aip' + (className ? ' ' + className : '')}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        {/* Colour wave: one accent cycle per TILE, repeated across the field and
            translated by exactly one tile so it loops seamlessly. Stops start and
            end on --accent so the repeat is continuous. */}
        <linearGradient
          id={gid}
          gradientUnits="userSpaceOnUse"
          spreadMethod="repeat"
          x1="0" y1="0" x2={TILE} y2="0"
        >
          <stop offset="0%" style={{ stopColor: 'var(--accent)' }} />
          <stop offset="33%" style={{ stopColor: 'var(--accent-2)' }} />
          <stop offset="66%" style={{ stopColor: 'var(--accent-3)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--accent)' }} />
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            from="0 0"
            to={`${TILE} 0`}
            dur="7s"
            repeatCount="indefinite"
          />
        </linearGradient>
      </defs>
      <g stroke={`url(#${gid})`} strokeWidth={SW} strokeLinecap="round" fill="none">
        {segs}
      </g>
    </svg>
  );
}
