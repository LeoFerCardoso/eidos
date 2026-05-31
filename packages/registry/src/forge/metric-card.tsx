import * as React from 'react';
import { Sparkline } from '@/components/forge/sparkline';
import { Trend } from '@/components/forge/trend';

const fmtValue = (v) => {
  if (typeof v !== 'number' || !isFinite(v)) return v;
  if (Number.isInteger(v)) return v.toLocaleString();
  return v.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

const MetricCard = ({
  label, value, suffix, unit, prefix,
  delta, deltaUnit = '%', inverted = false,
  series, sparkColor,
  foot, tone, size = 'md',
}: {
  /** Metric name, shown as the uppercase mono eyebrow. */
  label?: React.ReactNode;
  /** The headline number (auto-formatted with locale grouping). */
  value?: number | string;
  /** Appended directly after the value (e.g. "%"). */
  suffix?: React.ReactNode;
  /** Unit shown beside the value in muted type (e.g. "ms"). */
  unit?: React.ReactNode;
  /** Rendered before the value (e.g. "$"). */
  prefix?: React.ReactNode;
  /** Period-over-period change; renders a colored Trend chip. */
  delta?: number;
  /** Unit for the delta chip. */
  deltaUnit?: string;
  /** For "lower is better" metrics (lead time, MTTR) — flips the trend color so it follows the verdict, not the sign. */
  inverted?: boolean;
  /** Sparkline data points under the value. */
  series?: number[];
  /** Sparkline stroke color (defaults to the ember accent). */
  sparkColor?: string;
  /** Footer line — comparison window or SLO context. */
  foot?: React.ReactNode;
  /** Surface tone modifier. */
  tone?: string;
  /** Card density. */
  size?: 'sm' | 'md' | 'lg';
}) => {
  const cls = ['metric-card', 'size-' + size];
  if (tone) cls.push('tone-' + tone);
  return (
    <div className={cls.join(' ')}>
      <div className="mc-head">
        <span className="mc-label">{label}</span>
        {typeof delta === 'number' && <Trend delta={delta} unit={deltaUnit} inverted={inverted}/>}
      </div>
      <div className="mc-value-row">
        <span className="mc-value">
          {prefix ? <span className="mc-affix">{prefix}</span> : null}
          <span>{fmtValue(value)}</span>
          {suffix ? <span className="mc-affix">{suffix}</span> : null}
        </span>
        {unit ? <span className="mc-unit">{unit}</span> : null}
      </div>
      {series && series.length > 0 && (
        <div className="mc-spark">
          <Sparkline data={series} w={size === 'lg' ? 240 : 180} h={size === 'lg' ? 40 : 32} color={sparkColor}/>
        </div>
      )}
      {foot ? <div className="mc-foot">{foot}</div> : null}
    </div>
  );
};

export { MetricCard };
