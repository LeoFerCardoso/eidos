import * as React from 'react';

interface KbdProps {
  /** Single key string → one keycap; string array with 2+ items → chord. Providing label triggers row mode. */
  keys?: string | string[];
  /** Row mode: left-hand label. Presence switches rendering from inline to .kbd-row block. */
  label?: React.ReactNode;
  /** Row mode only: muted hint rendered between the label and the chord. */
  meta?: React.ReactNode;
  /** Extra utility classes merged on the outermost element. */
  className?: string;
  /** Key glyph or text (single-key mode). Ignored when keys is provided. */
  children?: React.ReactNode;
}

const Kbd = ({
  keys,
  label,
  meta,
  className = '',
  children,
}: KbdProps) => {
  const keyArr = Array.isArray(keys) ? keys : (keys ? [keys] : []);

  // Row mode — label is present
  if (label !== undefined) {
    return (
      <div className={['kbd-row', className].filter(Boolean).join(' ')}>
        <span className="label">{label}</span>
        {meta && <span style={{ fontSize: 11.5, color: 'var(--fg-faint)' }}>{meta}</span>}
        {keyArr.length > 0 && (
          <span className="kbd-chord">{keyArr.map((k, i) => <kbd className="kbd" key={i}>{k}</kbd>)}</span>
        )}
      </div>
    );
  }

  // Chord mode — multiple keys
  if (keyArr.length > 1) {
    return (
      <span className={['kbd-chord', className].filter(Boolean).join(' ')}>
        {keyArr.map((k, i) => <kbd className="kbd" key={i}>{k}</kbd>)}
      </span>
    );
  }

  // Single-key mode — one key string or children
  const key = keyArr[0] ?? children;
  return <kbd className={['kbd', className].filter(Boolean).join(' ')}>{key}</kbd>;
};

export { Kbd };
