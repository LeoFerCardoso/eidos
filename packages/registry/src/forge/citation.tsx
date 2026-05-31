import * as React from 'react';
import { Icons } from '@/components/forge/icons';

interface CitationSource {
  id: number;
  domain: string;
  title: string;
  url: string;
  snippet: string;
  /** Human-formatted freshness string, e.g. "14:01 · 18s ago" */
  fetched?: string;
}

const Citation = ({
  n,
  source,
  href,
  tone = 'ember',
}: {
  /** Numeric rank shown inside the chip. Must match the rank of the corresponding entry in Sources. */
  n: number;
  /** Source object used to populate the hover popover. Omit to silence the popover. */
  source?: CitationSource;
  /** Override the link target. Defaults to source.url. Opens in a new tab. */
  href?: string;
  /** ember matches the model accent; neutral is for ungrounded references. */
  tone?: 'ember' | 'neutral';
}) => {
  const [open, setOpen] = React.useState(false);
  const closeT = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const onEnter = () => { if (closeT.current) clearTimeout(closeT.current); setOpen(true); };
  const onLeave = () => { closeT.current = setTimeout(() => setOpen(false), 150); };
  const linkUrl = href || source?.url;
  // Click contract: when the popover is open and a target exists, the chip
  // navigates to the source in a new tab; otherwise it toggles the popover.
  const onClick = () => {
    if (open && linkUrl) { window.open(linkUrl, '_blank', 'noopener'); return; }
    setOpen(v => !v);
  };
  // Keyboard contract: Escape closes the popover and returns focus to the chip.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      e.stopPropagation();
      setOpen(false);
      btnRef.current?.focus();
    }
  };
  return (
    <span className="ai-cite-wrap" onMouseEnter={onEnter} onMouseLeave={onLeave} onKeyDown={onKeyDown}>
      <button
        ref={btnRef}
        className={'ai-cite-chip' + (tone === 'neutral' ? ' neutral' : '')}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={source ? `Source ${n}, ${source.domain}` : `Source ${n}`}
        onClick={onClick}
        onFocus={onEnter}
        onBlur={onLeave}
      >{n}</button>
      {open && source && (
        <span className="ai-cite-pop" role="dialog" aria-label={source.title}>
          <span className="ai-cite-pop-head">
            <span className="ai-cite-pop-dom">{source.domain}</span>
            <span className="ai-cite-pop-rank">[{n}]</span>
          </span>
          <span className="ai-cite-pop-title">{source.title}</span>
          <span className="ai-cite-pop-snip">{source.snippet}</span>
          <a
            className="ai-cite-pop-foot"
            href={linkUrl}
            target="_blank"
            rel="noreferrer"
          >
            <Icons.link size={11}/>
            <span className="url">{(linkUrl || '').replace(/^https?:\/\//, '')}</span>
          </a>
        </span>
      )}
    </span>
  );
};

export { Citation };
