import * as React from 'react';

type Size = 'sm' | 'md' | 'lg';

interface OTPInputProps {
  /**
   * Array of group sizes. E.g. [3, 3] renders 3 cells + separator + 3 cells.
   * The sum of all group sizes equals the total cell count.
   * When provided this takes precedence over `length` + `groupEvery`.
   * @default [6]
   */
  layout?: number[];
  /**
   * Total number of cells. Use `layout` for grouped layouts.
   * @default 6
   */
  length?: number;
  /**
   * Insert a separator after every N cells (e.g. 3 → "•••–•••").
   * Prefer `layout` for explicit group control.
   * @default 0 (no separators)
   */
  groupEvery?: number;
  /** Controlled value — the full concatenated string across every cell. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /**
   * Fires on every keystroke. Receives the current concatenated value.
   * Docs-API alias — native alias is `onChange`.
   */
  onValueChange?: (value: string) => void;
  /** @deprecated Use `onValueChange`. */
  onChange?: (value: string) => void;
  /**
   * Fires when every cell is filled — wire to auto-submit / verify.
   */
  onComplete?: (value: string) => void;
  /**
   * Paints the danger ring on every cell.
   * @default false
   */
  invalid?: boolean;
  /**
   * Greys out and disables every cell.
   * @default false
   */
  disabled?: boolean;
  /**
   * Cell footprint — 32 / 40 / 52 px wide.
   * @default "md"
   */
  size?: Size;
  id?: string;
  /** Accessible label for the group wrapper. */
  ariaLabel?: string;
  /**
   * Focus the first cell on mount.
   * @default false
   */
  autoFocus?: boolean;
  /** Extra utility classes on the wrapper element. */
  className?: string;
}

function deriveGroupsFromLength(length: number, every: number): number[] {
  if (every <= 0) return [length];
  const groups: number[] = [];
  let left = length;
  while (left > 0) { groups.push(Math.min(every, left)); left -= every; }
  return groups.length ? groups : [length];
}

function OTPInput({ layout, length = 6, groupEvery = 0, value, defaultValue = '', onValueChange, onChange, onComplete, invalid = false, disabled = false, size = 'md', id, ariaLabel = 'One-time code', autoFocus = false, className = '' }: OTPInputProps) {
  const reactId = React.useId();
  const gid = id || reactId;
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);
  const [internal, setInternal] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const val = (isControlled ? value : internal) || '';

  // Groups drive both the total cell count and where separators sit.
  // `layout` wins when provided; otherwise fall back to length + groupEvery.
  const groups = layout ?? (groupEvery > 0 ? deriveGroupsFromLength(length, groupEvery) : [length]);
  const total = groups.reduce((a, b) => a + b, 0);
  // Cell index → true when a separator should precede this cell (group boundary).
  const sepBefore = React.useMemo(() => {
    const set = new Set<number>();
    let acc = 0;
    for (let g = 0; g < groups.length - 1; g++) { acc += groups[g]; set.add(acc); }
    return set;
  }, [groups]);

  const cells = Array.from({ length: total }, (_, i) => val[i] || '');

  React.useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emit = (next: string) => {
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
    onChange?.(next);
    if (next.length === total && [...next].every(Boolean)) onComplete?.(next);
  };
  const setAt = (i: number, ch: string) => {
    const arr = cells.slice();
    arr[i] = ch.slice(-1);
    emit(arr.join('').slice(0, total));
  };
  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !cells[i] && i > 0) refs.current[i - 1]?.focus();
    else if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus();
    else if (e.key === 'ArrowRight' && i < total - 1) refs.current[i + 1]?.focus();
  };
  const onPaste = (i: number, e: React.ClipboardEvent) => {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, total - i);
    if (!digits) return;
    const arr = cells.slice();
    for (let k = 0; k < digits.length; k++) arr[i + k] = digits[k];
    emit(arr.join('').slice(0, total));
    refs.current[Math.min(i + digits.length, total - 1)]?.focus();
  };

  return (
    <div className={`in-otp ${size}${className ? ` ${className}` : ''}`} role="group" aria-label={ariaLabel} id={gid}>
      {cells.map((c, i) => (
        <React.Fragment key={i}>
          {sepBefore.has(i) && <span className="in-otp-sep" aria-hidden="true">–</span>}
          <input
            ref={(el) => { refs.current[i] = el; }}
            className={`in-otp-cell${invalid ? ' is-invalid' : ''}`}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            value={c}
            disabled={disabled}
            aria-invalid={invalid || undefined}
            onChange={(e) => {
              const ch = e.target.value.replace(/\D/g, '');
              setAt(i, ch);
              if (ch && i < total - 1) refs.current[i + 1]?.focus();
            }}
            onKeyDown={(e) => onKeyDown(i, e)}
            onPaste={(e) => onPaste(i, e)}
          />
        </React.Fragment>
      ))}
    </div>
  );
}

export { OTPInput };
