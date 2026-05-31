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
  const [openIdx, setOpenIdx] = React.useState(null);
  return (
    <div className="ring-bar">
      {rings.map((r, i) => {
        const tone = i < currentRing ? 'done' : i === currentRing ? (r.status || 'running') : 'pending';
        const pct = r.percent != null ? r.percent : tone === 'done' ? 100 : 0;
        const isCurrent = i === currentRing;
        return (
          <div key={r.label || i}
               className={'ring-cell ' + tone + (isCurrent ? ' is-current' : '') + (openIdx === i ? ' has-pop' : '') + (popoverFor ? ' is-interactive' : '')}
               onClick={() => popoverFor && setOpenIdx(openIdx === i ? null : i)}
               role={popoverFor ? 'button' : undefined}
               tabIndex={popoverFor ? 0 : undefined}>
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
              <div className="ring-pop" role="dialog" onClick={(e) => e.stopPropagation()}>
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
