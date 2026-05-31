import * as React from 'react';

const ForgeMark = ({
  size = 20,
  variant = 'solid',
  color = 'var(--ember)',
  strokeWidth = 1.4,
  glow = false,
}) => {
  // Lucide Flame — verbatim path from lucide-icons (24×24 native).
  const FLAME_D = "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z";

  // 4-pointed sparkle — concave-sided star centred at (0,0), unit radius 6.
  // Scales linearly via the `r/6` factor in each sparkle's transform.
  const SPARKLE_D = "M0 -6 C0.5 -2.2 2.2 -0.5 6 0 C2.2 0.5 0.5 2.2 0 6 C-0.5 2.2 -2.2 0.5 -6 0 C-2.2 -0.5 -0.5 -2.2 0 -6 Z";

  // Place Lucide's natural centre (12, 13) at (16, 17) in the 32-viewBox.
  const FLAME_TRANSFORM = 'translate(5.8 7) scale(0.85)';

  // Sparkle layout — 3 sparkles, hugging the flame edges.
  // Large top-right is the brand accent. The two smalls match radius.
  const SPARKLES = [
    { tx: 25,   ty: 10,   r: 3.0 },  // ① top-right — LARGE
    { tx: 8,    ty: 10,   r: 1.6 },  // ② top-left  — small
    { tx: 24,   ty: 23.5, r: 1.6 },  // ③ bottom-right — small
  ];

  const style = glow
    ? { filter: 'drop-shadow(0 0 10px rgba(255,107,53,0.55))' }
    : undefined;

  const sparklePath = (s, i, extra = {}) => (
    <path key={i} d={SPARKLE_D}
          transform={`translate(${s.tx} ${s.ty}) scale(${(s.r / 6).toFixed(4)})`}
          {...extra}/>
  );

  if (variant === 'outline') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none"
           stroke={color} strokeWidth={strokeWidth}
           strokeLinecap="round" strokeLinejoin="round"
           style={style} aria-label="Forge">
        <path d={FLAME_D} transform={FLAME_TRANSFORM}/>
        {SPARKLES.map((s, i) => sparklePath(s, i))}
      </svg>
    );
  }

  if (variant === 'expressive') {
    // Hero / splash. Flame in saturated ember, sparkles in ember-light
    // so the flame still anchors the composition.
    const flameFill = '#FF6B35';
    const sparkleFill = '#FFB07F';
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none"
           style={style} aria-label="Forge">
        <path d={FLAME_D} transform={FLAME_TRANSFORM} fill={flameFill}/>
        {SPARKLES.map((s, i) => sparklePath(s, i, { fill: sparkleFill }))}
      </svg>
    );
  }

  // solid (default)
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none"
         style={style} aria-label="Forge">
      <path d={FLAME_D} transform={FLAME_TRANSFORM} fill={color}/>
      {SPARKLES.map((s, i) => sparklePath(s, i, { fill: color }))}
    </svg>
  );
};

export { ForgeMark };
