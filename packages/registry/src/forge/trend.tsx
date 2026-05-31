import * as React from 'react';

const TREND_GLYPHS = {
  arrow:    { up: '↑', down: '↓', flat: '—' },
  triangle: { up: '▲', down: '▼', flat: '◆' },
  badge:    { up: '↑', down: '↓', flat: '—' },
  bar:      { up: '↑', down: '↓', flat: '—' },
};

interface TrendProps {
  /** Magnitude + sign. Negative renders down/red; positive up/green; zero flat/muted. */
  delta?: number;
  /** Unit string appended after the magnitude (use "" for unitless). */
  unit?: string;
  /** Flip colour mapping. Green for down, red for up. Use for latency, error rate, MTTR. */
  inverted?: boolean;
  /** Override the default `${Math.abs(delta)}${unit}` display string. */
  format?: (delta: number) => string;
  /** Visual chrome. All variants share the same colour mapping. */
  variant?: 'arrow' | 'triangle' | 'badge' | 'bar';
  /** Render flat row when delta === 0. Pass false to hide zero-delta rows. */
  showZero?: boolean;
  /** Extra class names merged on the outermost span. */
  className?: string;
}

const Trend = ({
  delta = 0,
  unit = '%',
  inverted = false,
  format,
  variant = 'arrow',
  showZero = true,
  className = '',
}: TrendProps) => {
  const sign = delta > 0 ? 1 : delta < 0 ? -1 : 0;
  if (!showZero && sign === 0) return null;
  const goodSign = inverted ? -1 : 1;
  const tone = sign === 0 ? 'flat' : (sign === goodSign ? 'up' : 'down');
  const glyph = (TREND_GLYPHS[variant] || TREND_GLYPHS.arrow)[tone];
  const text = format ? format(delta) : `${Math.abs(delta)}${unit}`;
  const cls = ['trend', 'variant-' + variant, tone, className].filter(Boolean).join(' ');
  if (variant === 'bar') {
    const mag = Math.min(1, Math.abs(delta) / 50);
    return (
      <span className={cls} aria-label={`${tone} ${text}`}>
        <span className="arrow" aria-hidden="true">{glyph}</span>
        <span>{text}</span>
        <span className="trend-bar" aria-hidden="true">
          <span className="trend-bar-fill" style={{ transform: `scaleX(${mag})` }}/>
        </span>
      </span>
    );
  }
  return (
    <span className={cls} aria-label={`${tone} ${text}`}>
      <span className="arrow" aria-hidden="true">{glyph}</span>
      <span>{text}</span>
    </span>
  );
};

export { Trend };
