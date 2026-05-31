import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/forge/icons';

type ChipTone =
  | 'ok' | 'bad' | 'warn' | 'ember' | 'neutral'
  // tier family (service reliability tier)
  | 'tier-t1' | 'tier-t2' | 'tier-t3';

interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Tone — maps to .chip.<tone> CSS. Defaults to neutral. */
  tone?: ChipTone;
  /**
   * Renders a leading 10px trend arrow. Does NOT mirror under dir="rtl" —
   * up always means up, down always means down.
   */
  trend?: 'up' | 'down';
  /** Leading icon node (e.g., a language colour dot). */
  icon?: React.ReactNode;
  /** Renders a trailing × remove button with the given aria-label. */
  onRemove?: () => void;
  /** Accessible label for the remove button (required when onRemove is set). */
  removeLabel?: string;
  children: React.ReactNode;
  className?: string;
}

const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  (
    {
      tone = 'neutral',
      trend,
      icon,
      onRemove,
      removeLabel = 'Remove',
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    const toneClass =
      tone === 'neutral' ? '' : tone.replace('tier-', 'tier-');

    return (
      <span
        ref={ref}
        className={cn(
          'chip',
          tone !== 'neutral' && toneClass,
          onRemove && 'removable',
          className,
        )}
        {...rest}
      >
        {trend && (
          <span aria-hidden="true" className="ch-arrow">
            {trend === 'up' ? <Icons.arrowUp size={10} /> : <Icons.arrowDown size={10} />}
          </span>
        )}
        {icon && <span aria-hidden="true">{icon}</span>}
        {children}
        {onRemove && (
          <button
            type="button"
            className="chip-x"
            aria-label={removeLabel}
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
          >
            <Icons.x size={9} />
          </button>
        )}
      </span>
    );
  },
);

export { Chip };
