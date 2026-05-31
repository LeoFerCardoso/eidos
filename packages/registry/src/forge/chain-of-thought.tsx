import * as React from 'react';
import { Icons } from '@/components/forge/icons';

const COT_ICON: Record<string, string> = {
  think: 'sparkle', search: 'search', observe: 'eye', plan: 'clipboard', done: 'check', read: 'book',
};

const ChainOfThought = ({
  title, steps = [], defaultOpen = true,
}: {
  /** Header label. Override for specialised traces ("Search trace", "Retrieval steps"). */
  title?: string;
  /** Ordered list of steps. Rendered as a semantic ol. Append steps as they stream in. */
  steps?: any[];
  /** Initial open state before any user toggle. Set false after the trace settles. */
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="ai-cot" data-open={open ? 'true' : 'false'}>
      <button className="ai-cot-head" onClick={() => setOpen(v => !v)} aria-expanded={open}>
        <span className="ico"><Icons.sparkle size={13} aria-hidden="true"/></span>
        <span className="label">{title || 'Chain of thought'}</span>
        <span className="count">{steps.length} steps</span>
        <Icons.chevronDown size={13} className="chev" aria-hidden="true"/>
      </button>
      <div className="ai-cot-body" aria-hidden={!open}>
        <ol className="ai-cot-steps">
          {steps.map((s, i) => {
            const Ico = (Icons as Record<string, any>)[COT_ICON[s.kind] || 'sparkle'] || Icons.sparkle;
            return (
              <li key={i} className="ai-cot-step" data-status={s.status || 'done'}>
                <span className="ai-cot-mark"><Ico size={12} aria-hidden="true"/></span>
                <div className="ai-cot-content">
                  <div className="ai-cot-label">{s.label}</div>
                  {s.detail && <div className="ai-cot-detail">{s.detail}</div>}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

export { ChainOfThought };
