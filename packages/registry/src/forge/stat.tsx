import * as React from 'react';
import { Trend } from '@/components/forge/trend';

const Stat = ({ label, value, suffix, hint, delta, deltaUnit = '%', inverted,
                align = 'start', variant = 'default' }: {
  label?: React.ReactNode;
  value?: React.ReactNode;
  suffix?: React.ReactNode;
  hint?: React.ReactNode;
  delta?: number;
  deltaUnit?: string;
  inverted?: boolean;
  align?: 'start' | 'center' | 'end';
  variant?: 'default' | 'hero' | 'inline';
}) => (
  <div className={'stat stat-' + variant + ' align-' + align}>
    <span className="stat-label">{label}</span>
    <span className="stat-value">
      {value}
      {suffix ? <span className="stat-suffix">{suffix}</span> : null}
    </span>
    {(hint || typeof delta === 'number') && (
      <span className="stat-foot">
        {typeof delta === 'number' && <Trend delta={delta} unit={deltaUnit} inverted={inverted} variant="triangle"/>}
        {hint && <span className="stat-hint">{hint}</span>}
      </span>
    )}
  </div>
);

export { Stat };
