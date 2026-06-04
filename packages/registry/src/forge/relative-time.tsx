import * as React from 'react';

const fmtAbs = (d) => {
  const day = d.toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short' });
  const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  return `${day} ${time}`;
};

const fmtFull = (d) => {
  const day = d.toLocaleDateString(undefined, { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  return `${day} · ${time}`;
};

const fmtRel = (d) => {
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  const abs = Math.abs(diff);
  const future = diff < 0;
  const parts: [number, string, number?][] = [
    [60, 'sec'], [3600, 'min', 60], [86400, 'h', 3600],
    [604800, 'd', 86400], [2419200, 'w', 604800], [29030400, 'mo', 2419200],
  ];
  if (abs < 5) return 'just now';
  for (let i = 0; i < parts.length; i++) {
    const [limit, unit, div] = parts[i];
    if (abs < limit) {
      const n = Math.floor(abs / (div || 1));
      return future ? `in ${n} ${unit}` : `${n} ${unit} ago`;
    }
  }
  const years = Math.floor(abs / 29030400);
  return future ? `in ${years}y` : `${years}y ago`;
};

interface RelativeTimeProps {
  /** Date, ms timestamp, or ISO string — anything new Date(value) accepts. */
  value: Date | number | string;
  /** Show absolute alongside relative ("Mon · 3 min ago"). */
  absolute?: boolean;
  /** Wrap in .tt tooltip. Hover reveals the full date · time · seconds. */
  tooltip?: boolean;
  /** Tooltip placement when tooltip=true. */
  tooltipSide?: 'top' | 'bottom' | 'left' | 'right';
  /** Extra classes on the time element. */
  className?: string;
}

const RelativeTime = ({
  value,
  absolute = false,
  tooltip = false,
  tooltipSide = 'top',
  className = '',
}: RelativeTimeProps) => {
  const d = React.useMemo(() => value instanceof Date ? value : new Date(value), [value]);
  const [, force] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => force(n => n + 1), 60000);
    return () => clearInterval(id);
  }, []);
  const rel = fmtRel(d);
  const abs = fmtAbs(d);
  const full = fmtFull(d);
  const text = absolute ? `${abs} · ${rel}` : rel;
  const cls = ['relative-time', className].filter(Boolean).join(' ');
  if (tooltip) {
    const ttCls = ['tt', tooltipSide !== 'top' ? tooltipSide : ''].filter(Boolean).join(' ');
    return (
      <span className={ttCls} data-tt={full}>
        {/* relative text + dateTime are computed against the current clock and the
            user's locale, so they legitimately differ between SSR and the client —
            suppress the (expected) hydration mismatch. */}
        <time className={cls} dateTime={d.toISOString()} suppressHydrationWarning>{text}</time>
      </span>
    );
  }
  return (
    <time className={cls} dateTime={d.toISOString()} title={full} suppressHydrationWarning>{text}</time>
  );
};

export { RelativeTime };
