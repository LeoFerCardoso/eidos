import * as React from 'react';
import { StatusDot } from '@/components/forge/status-dot';

type RingItem = { label?: string; audience?: string; percent?: number; status?: string; count?: number };

const RingBar = ({ rings = [], currentRing = 0, popoverFor }: {
  /** Ordered ring definitions — each: { label, audience?, percent, status? }. Status: "done" | "running" | "pending" | "error". */
  rings?: RingItem[];
  /** Index of the cell that is in flight — highlighted with ember tint and pulse. */
  currentRing?: number;
  /** Render prop returning the popover body for a cell. Cells become clickable buttons. */
  popoverFor?: (ring: RingItem, index: number) => React.ReactNode;
}) => {
  const [openIdx, setOpenIdx] = React.useState<number | null>(null);
  const cellRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const popRef = React.useRef<HTMLDivElement | null>(null);
  const close = (returnFocus = true) => {
    const idx = openIdx;
    setOpenIdx(null);
    if (returnFocus && idx != null) cellRefs.current[idx]?.focus();
  };
  // Move focus into the popover when it opens.
  React.useEffect(() => {
    if (openIdx != null) popRef.current?.focus();
  }, [openIdx]);
  return (
    <div className="ring-bar">
      {rings.map((r, i) => {
        const tone = i < currentRing ? 'done' : i === currentRing ? (r.status || 'running') : 'pending';
        const pct = r.percent != null ? r.percent : tone === 'done' ? 100 : 0;
        const isCurrent = i === currentRing;
        const cellName = [r.label, r.audience, pct + '%', tone].filter(Boolean).join(', ');
        const popId = `ring-pop-${i}`;
        return (
          <div key={r.label || i}
               ref={(el) => { cellRefs.current[i] = el; }}
               className={'ring-cell ' + tone + (isCurrent ? ' is-current' : '') + (openIdx === i ? ' has-pop' : '') + (popoverFor ? ' is-interactive' : '')}
               onClick={() => popoverFor && setOpenIdx(openIdx === i ? null : i)}
               role={popoverFor ? 'button' : undefined}
               tabIndex={popoverFor ? 0 : undefined}
               aria-label={cellName}
               aria-current={isCurrent ? 'step' : undefined}
               aria-haspopup={popoverFor ? 'dialog' : undefined}
               aria-expanded={popoverFor ? openIdx === i : undefined}
               onKeyDown={popoverFor ? (e) => {
                 if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenIdx(openIdx === i ? null : i); }
                 else if (e.key === 'Escape' && openIdx === i) { e.preventDefault(); close(); }
               } : undefined}>
            <div className="ring-head">
              <span className="ring-label">
                <StatusDot tone={tone} pulse={tone === 'running'}/>
                <span className="ring-label-text">{r.label}</span>
              </span>
              <span className="ring-pct">{pct}%</span>
            </div>
            {r.audience && <div className="ring-aud">{r.audience}</div>}
            <div className="ring-track">
              <span className="ring-fill" style={{ width: pct + '%' }}/>
            </div>
            {popoverFor && openIdx === i && (
              <div className="ring-pop" role="dialog" aria-label={cellName} tabIndex={-1}
                   ref={popRef}
                   onClick={(e) => e.stopPropagation()}
                   onKeyDown={(e) => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); } }}>
                {popoverFor(r, i)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export { RingBar };
