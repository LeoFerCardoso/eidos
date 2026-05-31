import * as React from 'react';

interface CountUpProps {
  /** Target value. Animation eases to this number once visible. */
  to: number;
  /** Starting value. Useful for partial-progress reads (e.g. 50→80%). */
  from?: number;
  /** Static string appended after the figure (e.g. "%", " / mo"). */
  suffix?: string;
  /** Static string rendered before the animated figure (e.g. "$"). */
  prefix?: string;
  /** Duration in ms. Collapses to 0 automatically under prefers-reduced-motion. */
  dur?: number;
  /** Number of decimal places. Defaults to integer. */
  decimals?: number;
  /** Extra class names appended to the host span. */
  className?: string;
  /** Inline style override for the host span. */
  style?: React.CSSProperties;
}

const CountUp = ({
  to,
  from = 0,
  suffix = '',
  prefix = '',
  dur = 1200,
  decimals = 0,
  className = '',
  style,
}: CountUpProps) => {
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const effectiveDur = reducedMotion ? 0 : dur;
  const [v, setV] = React.useState(from);
  const ref = React.useRef<HTMLSpanElement>(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setSeen(true); },
      { threshold: 0.4 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  React.useEffect(() => {
    if (!seen) return;
    if (effectiveDur === 0) { setV(to); return; }
    const start = performance.now();
    const range = to - from;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / effectiveDur);
      const ease = 1 - Math.pow(1 - t, 3);
      setV(from + range * ease);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [seen, to, from, effectiveDur]);
  const cls = ['t-mono', className].filter(Boolean).join(' ');
  return (
    <span ref={ref} className={cls} style={style}>
      {prefix}{v.toFixed(decimals)}{suffix}
    </span>
  );
};

export { CountUp };
