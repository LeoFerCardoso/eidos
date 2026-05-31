import * as React from 'react';

interface StatusDotProps {
  /** Semantic colour token: "pending" | "running" | "done" | "error" | "skipped" | "up" | "degraded" | "down" | "unknown" | "p0" | "p1" | "p2" | "p3". Defaults to neutral. */
  tone?: string;
  /** Dot diameter. sm = 6px, md = 8px (default), lg = 10px. Use sm when riding with mono text, lg only in hero cards. */
  size?: 'sm' | 'md' | 'lg';
  /** Radiating ring animation. Reserve for in-flight states (running, degraded, p0). */
  pulse?: boolean;
  /** Extra classes merged via cn(). */
  className?: string;
  /** Accessible title attribute shown on hover. Pair with a visible text label for full a11y. */
  title?: string;
  /** Inline style override for the dot span. */
  style?: React.CSSProperties;
}

const StatusDot = ({
  tone,
  size = 'md',
  pulse = false,
  className = '',
  title,
  style,
}: StatusDotProps) => {
  const cls = ['s-dot'];
  if (size !== 'md') cls.push(size);
  if (tone) cls.push(tone);
  if (pulse) cls.push('pulse');
  if (className) cls.push(className);
  return <span className={cls.join(' ')} aria-hidden="true" title={title} style={style}/>;
};

export { StatusDot };
