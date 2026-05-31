import * as React from 'react';

const fmtNumber = (n, unit) => {
  if (n == null || Number.isNaN(n)) return '';
  const t = typeof n === 'number' ? n.toLocaleString(undefined, { maximumFractionDigits: 2 }) : String(n);
  return unit ? `${t} ${unit}` : t;
};

type TooltipPayloadItem = {
  name?: string;
  dataKey?: string;
  value?: number | string;
  unit?: string;
  color?: string;
  fill?: string;
  stroke?: string;
};

type EidosTooltipContentProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: React.ReactNode;
  [key: string]: any;
};

const EidosTooltipContent = (props: EidosTooltipContentProps) => {
  if (!props.active || !props.payload || props.payload.length === 0) return null;
  const items = props.payload;
  return (
    <div className="eidos-tooltip">
      {props.label != null && <div className="ft-label">{props.label}</div>}
      <div className="ft-rows">
        {items.map((it, i) => (
          <div key={i} className="ft-row">
            <span className="ft-dot" style={{ background: it.color || it.fill || it.stroke || 'var(--ember)' }}/>
            <span className="ft-name">{it.name || it.dataKey}</span>
            <span className="ft-value t-mono">{fmtNumber(it.value, it.unit)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export { EidosTooltipContent };
