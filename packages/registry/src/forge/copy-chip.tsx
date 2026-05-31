import * as React from 'react';
import { Icons } from '@/components/forge/icons';

interface CopyChipProps {
  /** String written to clipboard on click. Always the canonical / full version. */
  value: string;
  /** Display label. Truncate or alias the value so it stays scannable (e.g. 7-char SHA). Defaults to value. */
  label?: React.ReactNode;
  /** Chip colour variant. Use ember for primary identifiers (service ref), ice for secondaries. */
  tone?: 'default' | 'ember' | 'ice';
}

const CopyChip = ({
  value,
  label,
  tone = 'default',
}: CopyChipProps) => {
  const [copied, setCopied] = React.useState(false);
  const onClick = async () => {
    try { await navigator.clipboard.writeText(value); }
    catch (e) {
      const ta = document.createElement('textarea');
      ta.value = value; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e2) {}
      ta.remove();
    }
    setCopied(true); setTimeout(() => setCopied(false), 1400);
  };
  const cls = ['chip', 'copy-chip'];
  if (tone !== 'default') cls.push(tone);
  if (copied) cls.push('is-copied');
  return (
    <>
      <button type="button" className={cls.join(' ')} onClick={onClick}
              aria-label={`Copy ${value}`} title={copied ? 'Copied' : `Copy ${value}`}>
        <span>{label || value}</span>
        {copied ? <Icons.check size={10}/> : <Icons.copy size={10}/>}
      </button>
      {/* Visually-hidden live region: announces the success transition once,
          satisfying the documented role="status" aria-live="polite" SR contract.
          Empty while idle so AT only speaks on the copied → true transition. */}
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? `Copied ${value}` : ''}
      </span>
    </>
  );
};

export { CopyChip };
