import * as React from 'react';

const ringTone = (n, inverted) => {
  const x = inverted ? 1 - n : n;
  if (x < 0.30) return 'var(--success)';
  if (x < 0.55) return 'var(--ember)';
  if (x < 0.80) return 'var(--warning)';
  return 'var(--danger)';
};

const ScoreGaugeSpeedo = ({ value, min, max, ticks, labels, inverted, label, size, thickness }: {
  value: number;
  min: number;
  max: number;
  ticks?: boolean;
  labels?: boolean;
  inverted?: boolean;
  label?: string;
  size?: number;
  thickness?: number;
}) => {
  const w = size || 240;
  const h = w * 0.7;
  const r = (w - thickness) / 2 - 8;
  const cx = w / 2, cy = h - 12;
  const sweep = Math.PI; // 180° arc
  const startA = Math.PI; // left side
  const norm = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const angle = startA + norm * sweep;
  const px = (a) => cx + r * Math.cos(a);
  const py = (a) => cy + r * Math.sin(a);
  const arcPath = (a0, a1) => {
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M${px(a0)},${py(a0)} A${r},${r} 0 ${large} 1 ${px(a1)},${py(a1)}`;
  };
  const segs = [
    { from: 0.00, to: 0.30, color: inverted ? 'var(--danger)'  : 'var(--success)' },
    { from: 0.30, to: 0.55, color: inverted ? 'var(--warning)' : 'var(--ember)'  },
    { from: 0.55, to: 0.80, color: inverted ? 'var(--ember)'   : 'var(--warning)' },
    { from: 0.80, to: 1.00, color: inverted ? 'var(--success)' : 'var(--danger)' },
  ];
  const tickCount = 10;
  return (
    <div className="score-speedo" style={{ width: w }}>
      <svg width={w} height={h + 8} viewBox={`0 0 ${w} ${h + 8}`}>
        {segs.map((s, i) => (
          <path key={i} d={arcPath(startA + s.from * sweep, startA + s.to * sweep)}
                fill="none" stroke={s.color} strokeWidth={thickness} strokeLinecap="butt" opacity="0.32"/>
        ))}
        <path d={arcPath(startA, angle)} fill="none" stroke={ringTone(norm, inverted)} strokeWidth={thickness} strokeLinecap="round"
              style={{ transition: 'all 600ms var(--ease)' }}/>
        {ticks !== false && Array.from({ length: tickCount + 1 }).map((_, i) => {
          const t = i / tickCount;
          const a = startA + t * sweep;
          const r1 = r - thickness / 2 - 2;
          const r2 = r - thickness / 2 - (i % 5 === 0 ? 10 : 6);
          return (
            <line key={i}
                  x1={cx + r1 * Math.cos(a)} y1={cy + r1 * Math.sin(a)}
                  x2={cx + r2 * Math.cos(a)} y2={cy + r2 * Math.sin(a)}
                  stroke="var(--fg-faint)" strokeWidth={i % 5 === 0 ? 1.2 : 0.8}/>
          );
        })}
        {labels && (
          <>
            <text x={cx + (r - thickness - 18) * Math.cos(startA)} y={cy + (r - thickness - 18) * Math.sin(startA) + 4}
                  textAnchor="middle" fill="var(--fg-faint)" fontSize="10" fontFamily="var(--font-mono)">LOW</text>
            <text x={cx} y={14}
                  textAnchor="middle" fill="var(--fg-faint)" fontSize="10" fontFamily="var(--font-mono)">MED</text>
            <text x={cx + (r - thickness - 18) * Math.cos(startA + sweep)} y={cy + (r - thickness - 18) * Math.sin(startA + sweep) + 4}
                  textAnchor="middle" fill="var(--fg-faint)" fontSize="10" fontFamily="var(--font-mono)">CRIT</text>
          </>
        )}
        {/* Needle */}
        <g style={{ transition: 'transform 600ms var(--ease)' }}>
          <line x1={cx} y1={cy} x2={px(angle)} y2={py(angle)}
                stroke="var(--fg)" strokeWidth="2" strokeLinecap="round"/>
          <circle cx={cx} cy={cy} r="6" fill="var(--surface-strong)" stroke="var(--fg-muted)" strokeWidth="1.2"/>
        </g>
      </svg>
      <div className="ss-readout">
        <span className="ss-value" style={{ color: ringTone(norm, inverted) }}>
          {Math.round(value)}<span className="ss-max">/{max}</span>
        </span>
        {label && <span className="ss-label">{label}</span>}
      </div>
    </div>
  );
};

const ScoreGaugeCompact = ({ value, min, max, label, size = 96, thickness = 8, inverted }: {
  value: number;
  min: number;
  max: number;
  label?: string;
  size?: number;
  thickness?: number;
  inverted?: boolean;
}) => {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const norm = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return (
    <div className="score-compact" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={thickness}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={ringTone(norm, inverted)} strokeWidth={thickness}
                strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - norm)}
                transform={`rotate(-90 ${size/2} ${size/2})`}/>
      </svg>
      <div className="sc-text">
        <span className="sc-value">{Math.round(value)}</span>
        {label && <span className="sc-label">{label}</span>}
      </div>
    </div>
  );
};

const ScoreGaugeLinear = ({ value, min, max, label, inverted }: {
  value: number;
  min: number;
  max: number;
  label?: string;
  inverted?: boolean;
}) => {
  const norm = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return (
    <div className="score-linear">
      <div className="sl-row">
        {label && <span className="sl-label">{label}</span>}
        <span className="sl-value" style={{ color: ringTone(norm, inverted) }}>{Math.round(value)}<span className="sl-max">/{max}</span></span>
      </div>
      <div className="sl-track">
        <span className="sl-segs"/>
        <span className="sl-fill" style={{ width: (norm * 100) + '%', background: ringTone(norm, inverted) }}/>
        <span className="sl-marker" style={{ left: 'calc(' + (norm * 100) + '% - 2px)' }}/>
      </div>
    </div>
  );
};

const ScoreGauge = ({
  variant = 'speedo', value, min, max, label, inverted, ticks, labels, size, thickness,
}: {
  /** Density. Speedo is the hero, compact rides inside cards, linear inside rows. */
  variant?: 'speedo' | 'compact' | 'linear' | 'ringed';
  /** Current value. Clamped to [min, max] internally. */
  value?: number;
  /** Lower bound of the scale. */
  min?: number;
  /** Upper bound. Use 100 for percentage-like scores; 1000 for Change Risk. */
  max?: number;
  /** Caption printed under the gauge. */
  label?: string;
  /** Flip the palette so green sits on the high side. Use for Health / Reliability. */
  inverted?: boolean;
  /** Show tick marks (speedo only). */
  ticks?: boolean;
  /** Show "LOW / MED / CRIT" segment labels (speedo only). */
  labels?: boolean;
  /** Pixel width (default 240 speedo / 96 compact). */
  size?: number;
  /** Stroke width (default 16 speedo / 8 compact). */
  thickness?: number;
}) => {
  const resolvedMin = min != null ? min : 0;
  const resolvedMax = max != null ? max : 1000;
  const common = { value: value || 0, min: resolvedMin, max: resolvedMax, label, inverted };
  if (variant === 'compact') return <ScoreGaugeCompact {...common} size={size} thickness={thickness}/>;
  if (variant === 'linear')  return <ScoreGaugeLinear  {...common}/>;
  return <ScoreGaugeSpeedo {...common}
                           ticks={ticks}
                           labels={labels}
                           size={size}
                           thickness={thickness || 16}/>;
};

export { ScoreGauge };
