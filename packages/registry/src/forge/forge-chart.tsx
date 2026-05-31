import * as React from 'react';
import * as Re from 'recharts';

const ForgeChart = ({ title, subtitle, meta, height = 280, padding = 18, accent, children }: {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  meta?: React.ReactNode;
  height?: number;
  padding?: number | string;
  accent?: string;
  children?: React.ReactElement;
}) => (
  <div className="forge-chart" style={accent ? ({ '--chart-accent': accent } as React.CSSProperties) : undefined}>
    {(title || meta) && (
      <div className="fc-head">
        <div className="fc-head-text">
          {title && <span className="fc-title">{title}</span>}
          {subtitle && <span className="fc-subtitle">{subtitle}</span>}
        </div>
        {meta && <span className="fc-meta">{meta}</span>}
      </div>
    )}
    <div className="fc-body" style={{ padding }}>
      <Re.ResponsiveContainer width="100%" height={height}>
        {children}
      </Re.ResponsiveContainer>
    </div>
  </div>
);

export { ForgeChart };
