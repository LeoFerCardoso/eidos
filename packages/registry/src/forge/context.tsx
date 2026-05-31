import * as React from 'react';

const fmtK = (n: number) =>
  n < 1000 ? String(n)
    : n < 10000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
    : Math.round(n / 1000) + 'k';

interface ContextProps {
  /** Tokens used so far in this conversation. */
  used?: number;
  /** Size of the model's context window (required). */
  total: number;
  /** Optional file count shown alongside the token numbers ("· 3 files"). */
  files?: number;
  /** Visual form of the indicator.
   *  - "gauge" (default) — radial SVG ring + token counts
   *  - "bar"             — linear progress bar + token counts
   *  - "compact"         — radial ring + percent only (no token numbers) */
  variant?: 'gauge' | 'bar' | 'compact';
  /** Radial diameter in px (gauge/compact only; default 18). */
  size?: number;
  /** Show "used / total" text beside the radial (gauge only; default true). */
  label?: boolean;
  /** Percentage [0–1] where the tone shifts from ok to mid. */
  thresholdMid?: number;
  /** Percentage [0–1] where the tone shifts from mid to warn. */
  thresholdWarn?: number;
  /** Extra class names on the root span. */
  className?: string;
  /** Inline styles on the root span. */
  style?: React.CSSProperties;
}

const Context = ({
  used = 0,
  total,
  files,
  variant = 'gauge',
  size = 18,
  label = true,
  thresholdMid = 0.6,
  thresholdWarn = 0.85,
  className,
  style,
}: ContextProps) => {
  const pct = total > 0 ? Math.max(0, Math.min(1, used / total)) : 0;
  const tone = pct >= thresholdWarn ? 'warn' : pct >= thresholdMid ? 'mid' : 'ok';
  const a11yLabel = `Context: ${used.toLocaleString()} of ${total.toLocaleString()} tokens used (${Math.round(pct * 100)}%)${files ? `, ${files} file${files === 1 ? '' : 's'}` : ''}`;

  if (variant === 'bar') {
    const cls = ['ai-ctx-bar', 'tone-' + tone, className].filter(Boolean).join(' ');
    const a11y = `Context: ${Math.round(pct * 100)}% used`;
    return (
      <span
        className={cls} style={style}
        role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct * 100)}
        aria-label={a11y} title={a11y}
      >
        <span className="ai-ctx-bar-track"><span className="ai-ctx-bar-fill" style={{ inlineSize: (pct * 100) + '%' }}/></span>
        <span className="ai-ctx-bar-label">
          <span className="used">{fmtK(used)}</span>
          <span className="of">/</span>
          <span className="total">{fmtK(total)}</span>
          {typeof files === 'number' && files > 0 && (
            <span className="files">· {files} file{files === 1 ? '' : 's'}</span>
          )}
        </span>
      </span>
    );
  }

  // gauge and compact both use the radial ring
  const isCompact = variant === 'compact';
  const r = (size - 3) / 2;
  const cx = size / 2;
  const circ = 2 * Math.PI * r;
  const dashOffset = circ * (1 - pct);
  const cls = ['ai-ctx-gauge', 'tone-' + tone, className].filter(Boolean).join(' ');

  return (
    <span
      className={cls} style={style}
      role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct * 100)}
      aria-label={a11yLabel} title={a11yLabel}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="var(--border)" strokeWidth="1.5"/>
        <circle
          cx={cx} cy={cx} r={r} fill="none" stroke="currentColor" strokeWidth="1.5"
          strokeDasharray={circ} strokeDashoffset={dashOffset} strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cx})`}
        />
      </svg>
      {isCompact ? (
        <span className="ai-ctx-gauge-label">
          <span className="pct">{Math.round(pct * 100)}%</span>
        </span>
      ) : label ? (
        <span className="ai-ctx-gauge-label">
          <span className="used">{fmtK(used)}</span>
          <span className="of">/</span>
          <span className="total">{fmtK(total)}</span>
          {typeof files === 'number' && files > 0 && (
            <span className="files">· {files} file{files === 1 ? '' : 's'}</span>
          )}
        </span>
      ) : null}
    </span>
  );
};

export { Context };
