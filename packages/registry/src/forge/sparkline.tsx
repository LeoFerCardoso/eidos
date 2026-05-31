import * as React from 'react';

const Sparkline = ({
  data,
  w = 120,
  h = 32,
  color = 'var(--ember)',
  fill = true,
}: {
  data: number[];
  w?: number;
  h?: number;
  color?: string;
  fill?: boolean;
}) => {
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v,i) => [ (i/(data.length-1))*w, h - ((v-min)/range)*(h-4) - 2 ]);
  const path = points.map((p,i) => (i===0?'M':'L') + p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
  const fillPath = path + ` L ${w},${h} L 0,${h} Z`;
  return (
    <svg width={w} height={h} className="sparkline" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
      {fill && <path d={fillPath} fill={color} opacity="0.12"/>}
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
      {points.map((p,i)=> i===points.length-1 && <circle key={i} cx={p[0]} cy={p[1]} r="2" fill={color}/>)}
    </svg>
  );
};

export { Sparkline };
