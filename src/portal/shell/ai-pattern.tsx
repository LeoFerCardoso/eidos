'use client';
// Forge — AI pattern background. A deterministic field of short, rounded line
// segments (horizontal + vertical dashes) on a regular grid, tinted by a single
// left-to-right gradient (ice -> blue -> violet -> orchid). It is the signature
// background for Forge AI surfaces, replacing the generic glow/sparkle banner
// look. Pure, SSR-stable (sin-hash, no random/Date), aria-hidden.
//
// Gradient stops read CSS vars (--aip-1..4) so a host can retheme; defaults sit
// in the .fp-aip rule in example-shell.css. The gradient id is per-instance
// (useId) so multiple patterns on one page don't collide.
import * as React from 'react';

export function AiPattern({ className }: { className?: string }) {
  const PITCH = 13;
  const COLS = 132;
  const ROWS = 16;
  const SW = 4.4;
  const W = COLS * PITCH;
  const H = ROWS * PITCH;
  const gid = 'aip-' + React.useId().replace(/[^a-zA-Z0-9_-]/g, '');

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
      className={'fp-aip' + (className ? ' ' + className : '')}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={W} y2="0">
          <stop offset="0%" style={{ stopColor: 'var(--aip-1)' }} />
          <stop offset="36%" style={{ stopColor: 'var(--aip-2)' }} />
          <stop offset="70%" style={{ stopColor: 'var(--aip-3)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--aip-4)' }} />
        </linearGradient>
      </defs>
      <g stroke={`url(#${gid})`} strokeWidth={SW} strokeLinecap="round" fill="none">
        {segs}
      </g>
    </svg>
  );
}
