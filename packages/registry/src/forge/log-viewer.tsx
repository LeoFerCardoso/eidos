import * as React from 'react';
import { Icons } from '@/components/forge/icons';

const LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];

type LogLine = { id?: string | number; time?: string; level?: string; message?: string; ts?: string | number };

const LogViewer = ({
  lines = [], height = 320, follow = false, wrap = false,
  variant = 'compact', toolbar = true,
}: {
  /** Array of log line objects. Each: { id?, time?, level, message }. */
  lines?: LogLine[];
  /** Fixed height of the scroll body in pixels. */
  height?: number;
  /** Auto-scroll to the bottom when new lines are appended (streaming logs). */
  follow?: boolean;
  /** Wrap long messages instead of truncating with ellipsis. */
  wrap?: boolean;
  /** compact = no timestamp column; expanded = timestamp + severity columns; filterable = full toolbar with search and level chips. */
  variant?: 'compact' | 'expanded' | 'filterable';
  /** Show the toolbar (only applies to the filterable variant; pass false to hide on expanded). */
  toolbar?: boolean;
}) => {
  const [query, setQuery] = React.useState('');
  const [active, setActive] = React.useState(new Set(['info', 'warn', 'error', 'fatal', 'debug', 'trace']));
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (follow && ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [lines, follow]);
  const filtered = lines.filter(l => {
    const lv = (l.level || 'info').toLowerCase();
    if (!active.has(lv)) return false;
    if (!query) return true;
    return (l.message || '').toLowerCase().includes(query.toLowerCase());
  });
  const showToolbar = (variant === 'filterable') || toolbar === true;
  const expanded = variant === 'expanded' || variant === 'filterable';
  return (
    <div className={'log-viewer variant-' + variant + (wrap ? ' wrap' : '')}>
      {showToolbar && variant === 'filterable' && (
        <div className="lv-toolbar">
          <div className="lv-search">
            <Icons.search size={11}/>
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
                   placeholder="Filter messages…" aria-label="Filter logs"/>
          </div>
          <div className="lv-levels">
            {LEVELS.map(lv => (
              <button key={lv} type="button"
                      aria-pressed={active.has(lv)}
                      aria-label={'Toggle ' + lv + ' lines'}
                      className={'chip ' + (active.has(lv) ? 'lvl-' + lv + ' is-active' : '')}
                      onClick={() => {
                        const next = new Set(active);
                        if (next.has(lv)) next.delete(lv); else next.add(lv);
                        setActive(next);
                      }}>{lv.toUpperCase()}</button>
            ))}
          </div>
          <div className="lv-spacer"/>
          <span className="lv-count t-mono">{filtered.length}/{lines.length}</span>
        </div>
      )}
      <div
        className="lv-body"
        style={{ height }}
        ref={ref}
        tabIndex={0}
        role="log"
        aria-label="Log output"
        aria-live={follow ? 'polite' : 'off'}
        onKeyDown={(e) => {
          const el = ref.current;
          if (!el) return;
          const step = 24;
          if (e.key === 'ArrowDown') { el.scrollTop += step; e.preventDefault(); }
          else if (e.key === 'ArrowUp') { el.scrollTop -= step; e.preventDefault(); }
          else if (e.key === 'PageDown') { el.scrollTop += el.clientHeight; e.preventDefault(); }
          else if (e.key === 'PageUp') { el.scrollTop -= el.clientHeight; e.preventDefault(); }
          else if (e.key === 'Home') { el.scrollTop = 0; e.preventDefault(); }
          else if (e.key === 'End') { el.scrollTop = el.scrollHeight; e.preventDefault(); }
        }}
      >
        {filtered.length === 0 && <div className="lv-empty">No log output.</div>}
        {filtered.map((l, i) => {
          const level = (l.level || 'info').toLowerCase();
          return (
            <div key={l.id || i} className={'lv-line lvl-' + level}>
              {expanded && l.time && <span className="lv-time">{l.time}</span>}
              <span className={'lv-level lvl-' + level}>{level.toUpperCase()}</span>
              <span className="lv-msg">{l.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { LogViewer };
