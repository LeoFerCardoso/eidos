import * as React from 'react';

const ChartLegend = ({ items }: { items: { label: string; color?: string }[] }) => (
  <ul className="forge-legend">
    {items.map((it, i) => (
      <li key={i}>
        <span className="legend-dot" style={{ background: it.color }}/>
        <span className="legend-label">{it.label}</span>
      </li>
    ))}
  </ul>
);

export { ChartLegend };
