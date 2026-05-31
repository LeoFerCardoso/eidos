import * as React from 'react';

type Size = 'sm' | 'md' | 'lg';

const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi);

const snap = (n: number, step: number) => (step > 0 ? Math.round(n / step) * step : n);

interface SliderProps {
  /**
   * Controlled value. Pass a number for a single thumb, or [lo, hi] for a range.
   * The docs API uses `number[]` — both forms are accepted.
   */
  value?: number | [number, number];
  /**
   * Uncontrolled initial value.
   * @default 0
   */
  defaultValue?: number | [number, number];
  /**
   * Lower bound.
   * @default 0
   */
  min?: number;
  /**
   * Upper bound.
   * @default 100
   */
  max?: number;
  /**
   * Increment per arrow nudge / drag snap.
   * @default 1
   */
  step?: number;
  /**
   * Greys out and stops all interaction.
   * @default false
   */
  disabled?: boolean;
  /**
   * Paints the range and thumb border in --danger.
   * @default false
   */
  invalid?: boolean;
  /**
   * Track direction.
   * @default "horizontal"
   */
  orientation?: 'horizontal' | 'vertical';
  /** Accessible label for the thumb(s). Used for aria-label. */
  label?: string;
  /**
   * Fires on every drag tick / key step. Receives the new value.
   * For docs-API compatibility also accept `onValueChange`.
   */
  onChange?: (value: number | [number, number]) => void;
  /**
   * Fires on every drag tick. Docs-API alias for `onChange`.
   * Receives the new value as a number[] so callers can use onValueChange uniformly.
   */
  onValueChange?: (value: number[]) => void;
  /**
   * Fires on pointer-up or final key press — debounced counterpart to onValueChange.
   */
  onValueCommit?: (value: number[]) => void;
  /**
   * Thumb / track footprint.
   * @default "md"
   */
  size?: Size;
  /** Extra utility classes merged onto the root element. */
  className?: string;
}

function Slider({ value, defaultValue = 0, min = 0, max = 100, step = 1, disabled = false, invalid = false, orientation = 'horizontal', label, onChange, size = 'md' }: SliderProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<number | [number, number]>(defaultValue);
  const current = isControlled ? (value as number | [number, number]) : internal;
  const values = Array.isArray(current) ? current : [current];
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [drag, setDrag] = React.useState(-1);
  const isVert = orientation === 'vertical';

  const cls = ['sl', size !== 'md' ? size : '', isVert ? 'vertical' : '', disabled ? 'is-disabled' : '', invalid ? 'is-invalid' : '']
    .filter(Boolean).join(' ');
  const pct = (v: number) => (max === min ? 0 : ((v - min) / (max - min)) * 100);

  const emit = (next: number[]) => {
    const sorted = next.length === 2 ? ([...next].sort((a, b) => a - b) as [number, number]) : next[0];
    if (!isControlled) setInternal(sorted);
    onChange?.(sorted);
  };
  const valueAtPos = (cx: number, cy: number) => {
    const el = trackRef.current;
    if (!el) return min;
    const rect = el.getBoundingClientRect();
    let raw = isVert
      ? 1 - (cy - rect.top) / rect.height
      : (cx - rect.left) / rect.width;
    if (!isVert && getComputedStyle(el).direction === 'rtl') raw = 1 - raw;
    return clamp(snap(min + clamp(raw, 0, 1) * (max - min), step), min, max);
  };
  const closest = (v: number) => {
    let idx = 0, best = Infinity;
    values.forEach((tv, i) => { const d = Math.abs(tv - v); if (d < best) { best = d; idx = i; } });
    return idx;
  };
  const updateAt = (idx: number, v: number) => { const next = values.slice(); next[idx] = v; emit(next); };

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    const v = valueAtPos(e.clientX, e.clientY);
    const idx = closest(v);
    setDrag(idx);
    updateAt(idx, v);
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => { if (drag >= 0) updateAt(drag, valueAtPos(e.clientX, e.clientY)); };
  const onPointerUp = () => setDrag(-1);
  const onKey = (idx: number, e: React.KeyboardEvent) => {
    const cur = values[idx];
    const big = (max - min) * 0.1;
    let next = cur;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = cur + step;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = cur - step;
    else if (e.key === 'PageUp') next = cur + big;
    else if (e.key === 'PageDown') next = cur - big;
    else if (e.key === 'Home') next = min;
    else if (e.key === 'End') next = max;
    else return;
    e.preventDefault();
    updateAt(idx, clamp(snap(next, step), min, max));
  };

  const lo = values.length === 2 ? Math.min(...values) : min;
  const hi = values.length === 2 ? Math.max(...values) : values[0];
  const rangeStyle: React.CSSProperties = isVert
    ? { bottom: `${pct(lo)}%`, top: `${100 - pct(hi)}%` }
    : { insetInlineStart: `${pct(lo)}%`, insetInlineEnd: `${100 - pct(hi)}%` };

  return (
    <div
      className={cls}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      aria-disabled={disabled || undefined}
      aria-invalid={invalid || undefined}
    >
      <div ref={trackRef} className="sl-track"><div className="sl-range" style={rangeStyle} /></div>
      {values.map((v, i) => (
        <span
          key={i}
          className={`sl-thumb${drag === i ? ' is-dragging' : ''}`}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={v}
          aria-label={label || (values.length === 2 ? (i === 0 ? 'Lower' : 'Upper') : 'Value')}
          aria-orientation={orientation}
          onKeyDown={(e) => onKey(i, e)}
          style={isVert ? { bottom: `${pct(v)}%`, left: '50%' } : { insetInlineStart: `${pct(v)}%`, top: '50%' }}
        />
      ))}
    </div>
  );
}

export { Slider };
