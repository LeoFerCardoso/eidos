import * as React from 'react';
import * as Re from 'recharts';

const REDUCE_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia(REDUCE_MOTION_QUERY);
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return reduced;
};

const EidosChart = ({ title, subtitle, meta, height = 280, padding = 18, accent, state, fallback, children }: {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  meta?: React.ReactNode;
  height?: number;
  padding?: number | string;
  accent?: string;
  state?: 'loading' | 'empty' | 'ready';
  fallback?: React.ReactNode;
  children?: React.ReactElement;
}) => {
  const reduced = usePrefersReducedMotion();
  // Gate the enter animation DS-wide: clone the chart child and force
  // isAnimationActive={false} on any series sub-element that does not already
  // set it explicitly. Recharts reads the prop off each series, so we recurse
  // one level into the chart's children.
  const body = React.useMemo(() => {
    if (!reduced || !React.isValidElement(children)) return children;
    const series = (children.props as { children?: React.ReactNode }).children;
    if (series == null) return children;
    const gated = React.Children.map(series, (node) => {
      if (!React.isValidElement(node)) return node;
      const props = node.props as { isAnimationActive?: boolean };
      if (props.isAnimationActive !== undefined) return node; // honour explicit page choice
      return React.cloneElement(node, { isAnimationActive: false } as Partial<typeof props>);
    });
    return React.cloneElement(children, undefined as never, gated);
  }, [reduced, children]);

  const showFallback = fallback != null || (state && state !== 'ready');
  return (
    <div className="eidos-chart" style={accent ? ({ '--chart-accent': accent } as React.CSSProperties) : undefined}>
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
        {showFallback ? (
          <div
            className="fc-state"
            style={{ minBlockSize: height }}
            data-state={state ?? 'custom'}
            role="status"
            aria-live="polite"
            aria-busy={state === 'loading' ? true : undefined}
          >
            {fallback ?? (state === 'loading' ? 'Loading…' : 'No data')}
          </div>
        ) : (
          <Re.ResponsiveContainer width="100%" height={height}>
            {body as React.ReactElement}
          </Re.ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export { EidosChart };
