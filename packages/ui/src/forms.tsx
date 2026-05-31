import * as React from 'react';
import { Icons } from './icons';
// Eidos DS — form controls.
//
// Typed React wrappers over the semantic form classes in tokens.css. Each control
// is a native, focusable element (real <input>/<select>/<textarea>, except Slider,
// which is a custom role="slider" widget), so keyboard support, form submission,
// and screen-reader semantics come for free — no Radix, no CVA.
//
// Class systems used:
//   .in-*  → text-entry shell (Input, Textarea, Select): .in-field > .in-label +
//            .in-group(.in-addon + .in-control + .in-addon) + .in-helprow.
//   .fc    → boolean controls (Checkbox, Switch, Radio): <label class="fc[ sm|lg][ block]">
//            with .fc-input + a visual box (.fc-check-box / .fc-toggle-track / .fc-radio-box)
//            + optional .fc-text(.fc-label + .fc-desc).
//   .sl-*  → Slider: a custom pointer/keyboard widget (.sl > .sl-track > .sl-range + .sl-thumb).
//
// Controlled or uncontrolled: pass value/checked to control, or defaultValue/
// defaultChecked to let the control manage its own state.

type Size = 'sm' | 'md' | 'lg';
const fcCls = (size: Size, block: boolean, invalid: boolean, extra = '') =>
  ['fc', size !== 'md' ? size : '', block ? 'block' : '', invalid ? 'invalid' : '', extra]
    .filter(Boolean).join(' ');

// ── Input ────────────────────────────────────────────────────────────────────
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /** Field label rendered above the control. */
  label?: React.ReactNode;
  /** Helper text under the control (hidden when `error` is set). */
  help?: React.ReactNode;
  /** Error message — sets aria-invalid and renders in the danger tone. */
  error?: React.ReactNode;
  /** Leading addon (text, icon, or element) inside the input group. */
  prefix?: React.ReactNode;
  /** Trailing addon inside the input group. */
  suffix?: React.ReactNode;
  /**
   * Field height — 28 / 36 / 44 px.
   * @default "md"
   */
  size?: Size;
  /**
   * Paints the danger ring on the surrounding group and sets aria-invalid.
   * @default false
   */
  invalid?: boolean;
}

export function Input({ label, help, error, prefix, suffix, id, className = '', invalid, size, ...rest }: InputProps) {
  const reactId = React.useId();
  const fid = id || reactId;
  const describedBy = error ? `${fid}-err` : help ? `${fid}-help` : undefined;
  return (
    <div className="in-field">
      {label && <label className="in-label" htmlFor={fid}>{label}</label>}
      <span className={`in-group${error ? ' is-invalid' : ''}`} aria-invalid={error ? true : undefined}>
        {prefix != null && <span className="in-addon">{prefix}</span>}
        <input
          id={fid}
          className={`in-control ${className}`.trim()}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...rest}
        />
        {suffix != null && <span className="in-addon">{suffix}</span>}
      </span>
      {(help || error) && (
        <span className="in-helprow">
          {error
            ? <span className="in-error" id={`${fid}-err`}>{error}</span>
            : <span className="in-help" id={`${fid}-help`}>{help}</span>}
        </span>
      )}
    </div>
  );
}

// ── Textarea ──────────────────────────────────────────────────────────────────
export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /** Field label rendered above the control. */
  label?: React.ReactNode;
  /** Helper text under the control (hidden when `error` is set). */
  help?: React.ReactNode;
  /** Error message — sets aria-invalid and renders in the danger tone. */
  error?: React.ReactNode;
  /** Show a live character counter (requires maxLength). */
  showCount?: boolean;
  /**
   * Padding / font-size scale — matches the .in-group size modifier.
   * @default "md"
   */
  size?: Size;
  /**
   * Paints the danger ring around the group. Pair with aria-describedby.
   * @default false
   */
  invalid?: boolean;
}

export function Textarea({ label, help, error, showCount, id, className = '', maxLength, value, defaultValue, onChange, ...rest }: TextareaProps) {
  const reactId = React.useId();
  const fid = id || reactId;
  const [len, setLen] = React.useState(String(value ?? defaultValue ?? '').length);
  const describedBy = error ? `${fid}-err` : help ? `${fid}-help` : undefined;
  return (
    <div className="in-field">
      {label && <label className="in-label" htmlFor={fid}>{label}</label>}
      <span className={`in-group${error ? ' is-invalid' : ''}`} aria-invalid={error ? true : undefined}>
        <textarea
          id={fid}
          className={`in-control ${className}`.trim()}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(e) => { setLen(e.target.value.length); onChange?.(e); }}
          {...rest}
        />
      </span>
      {(help || error || showCount) && (
        <span className="in-helprow">
          {error
            ? <span className="in-error" id={`${fid}-err`}>{error}</span>
            : <span className="in-help" id={`${fid}-help`}>{help}</span>}
          {showCount && maxLength != null && <span className="in-counter">{len}/{maxLength}</span>}
        </span>
      )}
    </div>
  );
}

// ── NativeSelect ──────────────────────────────────────────────────────────────
// Native <select> wrapper in the Eidos field shell. Prefer this on mobile-first
// surfaces or when system look-and-feel is acceptable (short lists, no icons).
// For rich custom rendering (icons, descriptions, groups) use the custom Select.
export interface NativeSelectOption { label: string; value: string; disabled?: boolean }
export interface NativeSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: React.ReactNode;
  help?: React.ReactNode;
  error?: React.ReactNode;
  /** Options to render. Omit to provide your own <option> children. */
  options?: NativeSelectOption[];
  /** Placeholder option shown first (disabled, empty value). */
  placeholder?: string;
}

export function NativeSelect({ label, help, error, options, placeholder, id, className = '', children, ...rest }: NativeSelectProps) {
  const reactId = React.useId();
  const fid = id || reactId;
  const describedBy = error ? `${fid}-err` : help ? `${fid}-help` : undefined;
  return (
    <div className="in-field">
      {label && <label className="in-label" htmlFor={fid}>{label}</label>}
      <span className={`in-group${error ? ' is-invalid' : ''}`} aria-invalid={error ? true : undefined}>
        <select
          id={fid}
          className={`in-control ${className}`.trim()}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...rest}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options
            ? options.map((o) => <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>)
            : children}
        </select>
      </span>
      {(help || error) && (
        <span className="in-helprow">
          {error
            ? <span className="in-error" id={`${fid}-err`}>{error}</span>
            : <span className="in-help" id={`${fid}-help`}>{help}</span>}
        </span>
      )}
    </div>
  );
}

/**
 * @deprecated Renamed to `NativeSelect`. This alias will be removed in the next
 * major release. Use `NativeSelect` for the native <select> or `Select` (from
 * `@eidos/ui`) for the custom dropdown.
 */
export const SelectNative = NativeSelect;

// ── Checkbox ──────────────────────────────────────────────────────────────────
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Label text rendered next to the box. */
  label?: React.ReactNode;
  /**
   * Secondary line under the label — also aliased as `description`.
   * Switches the wrapper to the two-line "block" layout.
   */
  description?: React.ReactNode;
  /**
   * Optional helper text under the label (alias for `description`).
   * Switches the wrapper to the two-line "block" layout.
   */
  desc?: React.ReactNode;
  /** Render the visual third (indeterminate) state. Does not affect `checked`. */
  indeterminate?: boolean;
  /**
   * Box footprint — 14 / 16 / 18 px.
   * @default "md"
   */
  size?: Size;
  /**
   * Uncontrolled initial checked state.
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * Fires when the user toggles the box. Convenience alias with the new state
   * value instead of requiring the caller to read `event.target.checked`.
   */
  onCheckedChange?: (checked: boolean) => void;
  /** Form-submission name. Pair with `value` in a native form. */
  name?: string;
  /** Danger-tinted invalid state — border turns red. */
  error?: boolean;
}

export function Checkbox({ label, description, indeterminate = false, disabled, size = 'md', id, className = '', ...rest }: CheckboxProps) {
  const reactId = React.useId();
  const cid = id || reactId;
  const ref = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => { if (ref.current) ref.current.indeterminate = indeterminate; }, [indeterminate]);
  return (
    <label className={`${fcCls(size, !!description, false)} ${className}`.trim()} htmlFor={cid} aria-disabled={disabled || undefined}>
      <input
        ref={ref}
        type="checkbox"
        id={cid}
        className={`fc-input${indeterminate ? ' indeterminate' : ''}`}
        disabled={disabled}
        aria-describedby={description ? `${cid}-desc` : undefined}
        {...rest}
      />
      <span className="fc-check-box" aria-hidden="true">
        {indeterminate
          ? <span className="fc-check-dash" />
          : <span className="fc-check-icon"><Icons.check size={10} strokeWidth={3} color="currentColor" /></span>}
      </span>
      {(label || description) && (
        <span className="fc-text">
          {label && <span className="fc-label">{label}</span>}
          {description && <span className="fc-desc" id={`${cid}-desc`}>{description}</span>}
        </span>
      )}
    </label>
  );
}

// ── Switch ────────────────────────────────────────────────────────────────────
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Label text rendered next to the track. */
  label?: React.ReactNode;
  /**
   * Optional helper text under the label (alias: `desc`).
   * Write the consequence of the setting in present tense.
   */
  description?: React.ReactNode;
  /**
   * Optional helper text under the label (alias: `description`).
   * Write the consequence of the setting in present tense.
   */
  desc?: React.ReactNode;
  /**
   * Danger-tinted invalid state — danger ring on track, label in danger tone.
   * Pair with an error helper element and wire it via aria-describedby.
   * @default false
   */
  invalid?: boolean;
  /**
   * Track footprint — 32×18 / 40×22 / 48×26.
   * @default "md"
   */
  size?: Size;
  /**
   * Uncontrolled initial checked state.
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * Fires when the user flips the switch. Receives the new state.
   * Convenience alternative to the native `onChange` event handler.
   */
  onCheckedChange?: (checked: boolean) => void;
}

export function Switch({ label, description, invalid = false, disabled, size = 'md', id, className = '', ...rest }: SwitchProps) {
  const reactId = React.useId();
  const sid = id || reactId;
  return (
    <label className={`${fcCls(size, !!description, invalid)} ${className}`.trim()} htmlFor={sid} aria-disabled={disabled || undefined} aria-invalid={invalid || undefined}>
      <input
        type="checkbox"
        id={sid}
        role="switch"
        className="fc-input"
        disabled={disabled}
        aria-invalid={invalid || undefined}
        {...rest}
      />
      <span className="fc-toggle-track" aria-hidden="true"><span className="fc-toggle-thumb" /></span>
      {(label || description) && (
        <span className="fc-text">
          {label && <span className="fc-label">{label}</span>}
          {description && <span className="fc-desc">{description}</span>}
        </span>
      )}
    </label>
  );
}

// ── RadioGroup ────────────────────────────────────────────────────────────────
export interface RadioOption { label: React.ReactNode; value: string; description?: React.ReactNode; disabled?: boolean }
export interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  /** Shared input name (auto-generated if omitted). */
  name?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  /** Lay options out in a row instead of a column. */
  inline?: boolean;
  /** Accessible name for the group. */
  ariaLabel?: string;
  size?: Size;
}

export function RadioGroup({ options, value, defaultValue, name, onChange, disabled = false, inline = false, ariaLabel, size = 'md' }: RadioGroupProps) {
  const reactId = React.useId();
  const groupName = name || reactId;
  const [internal, setInternal] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const val = isControlled ? value : internal;
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      style={{ display: 'flex', flexDirection: inline ? 'row' : 'column', gap: inline ? 18 : 10, flexWrap: inline ? 'wrap' : 'nowrap' }}
    >
      {options.map((opt) => {
        const oid = `${groupName}-${opt.value}`;
        const odisabled = disabled || opt.disabled;
        return (
          <label key={opt.value} className={fcCls(size, !!opt.description, false)} htmlFor={oid} aria-disabled={odisabled || undefined}>
            <input
              type="radio"
              id={oid}
              className="fc-input"
              name={groupName}
              value={opt.value}
              checked={val === opt.value}
              disabled={odisabled}
              onChange={() => { if (!isControlled) setInternal(opt.value); onChange?.(opt.value); }}
            />
            <span className="fc-radio-box" aria-hidden="true"><span className="fc-radio-dot" /></span>
            {(opt.label || opt.description) && (
              <span className="fc-text">
                {opt.label && <span className="fc-label">{opt.label}</span>}
                {opt.description && <span className="fc-desc">{opt.description}</span>}
              </span>
            )}
          </label>
        );
      })}
    </div>
  );
}

// ── Slider ────────────────────────────────────────────────────────────────────
// Custom pointer + keyboard widget (the thumb is role="slider"). Supports a single
// value or a [lo, hi] range, horizontal/vertical orientation, and RTL.
const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi);
const snap = (n: number, step: number) => (step > 0 ? Math.round(n / step) * step : n);

export interface SliderProps {
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
   * Maps a raw value to a human-readable string for `aria-valuetext`
   * (e.g. currency, percent, time). When omitted, no aria-valuetext is set
   * and assistive tech falls back to `aria-valuenow`.
   */
  formatValue?: (value: number) => string;
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

export function Slider({ value, defaultValue = 0, min = 0, max = 100, step = 1, disabled = false, invalid = false, orientation = 'horizontal', label, formatValue, onChange, onValueChange, onValueCommit, size = 'md' }: SliderProps) {
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

  const normalize = (next: number[]) =>
    next.length === 2 ? ([...next].sort((a, b) => a - b) as [number, number]) : next[0];
  const asArray = (v: number | [number, number]) => (Array.isArray(v) ? v : [v]);
  const emit = (next: number[]) => {
    const sorted = normalize(next);
    if (!isControlled) setInternal(sorted);
    onChange?.(sorted);
    onValueChange?.(asArray(sorted));
  };
  const commit = (next: number[]) => onValueCommit?.(asArray(normalize(next)));
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
  const onPointerUp = () => {
    if (drag >= 0) commit(values.slice());
    setDrag(-1);
  };
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
    const committed = clamp(snap(next, step), min, max);
    updateAt(idx, committed);
    const after = values.slice();
    after[idx] = committed;
    commit(after);
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
          aria-valuetext={formatValue ? formatValue(v) : undefined}
          aria-label={label || (values.length === 2 ? (i === 0 ? 'Minimum' : 'Maximum') : 'Value')}
          aria-orientation={orientation}
          onKeyDown={(e) => onKey(i, e)}
          style={isVert ? { bottom: `${pct(v)}%`, left: '50%' } : { insetInlineStart: `${pct(v)}%`, top: '50%' }}
        />
      ))}
    </div>
  );
}

// ── NumberInput ───────────────────────────────────────────────────────────────
// <input type="number"> in the field shell + optional ±1 stepper addon. The
// native spinner is hidden globally; the stepper is the explicit affordance.
//
// layout="stacked" (default): up/down chevron pair stacked on the trailing edge.
// layout="split": a "−" button on the leading edge and a "+" button on the
//   trailing edge — ideal when the value itself is the focal point.
//
// meter=true: renders a thin progress bar below the field that reflects the
//   current value within [min, max]. Requires both min and max to be set.
export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'type'> {
  /** Field label rendered above the control. */
  label?: React.ReactNode;
  /** Helper text under the control (hidden when `error` is set). */
  help?: React.ReactNode;
  /** Error message — sets aria-invalid and renders in the danger tone. */
  error?: React.ReactNode;
  /** Static or interactive node on the leading edge — currency code, scheme, unit picker. */
  prefix?: React.ReactNode;
  /** Static or interactive node on the trailing edge — unit label or unit picker. */
  suffix?: React.ReactNode;
  /**
   * Show the ±1 stepper buttons in the trailing addon slot.
   * @default false
   */
  stepper?: boolean;
  /**
   * Increment per arrow press / stepper click. Use 0.01 for currency.
   * @default 1
   */
  step?: number;
  /**
   * Stepper layout:
   * - `'stacked'` (default) — up/down chevron pair on the trailing edge.
   * - `'split'` — "−" on the leading edge and "+" on the trailing edge.
   * @default "stacked"
   */
  layout?: 'stacked' | 'split';
  /**
   * Render a thin progress bar below the field reflecting the current value
   * within [min, max]. Only visible when both `min` and `max` are numeric.
   * @default false
   */
  meter?: boolean;
  /**
   * Field height — matches the .in-group size modifier.
   * @default "md"
   */
  size?: Size;
  /**
   * Mobile keyboard hint. Use `"decimal"` for currency (shows the period key).
   * @default "numeric"
   */
  inputMode?: 'numeric' | 'decimal' | 'tel' | 'none' | 'text' | 'url' | 'email' | 'search';
  /**
   * Fires on every change. Receives the new raw input string.
   * Docs-API alias — for native event access use `onChange` instead.
   */
  onValueChange?: (value: string) => void;
  /**
   * Paints the danger ring on the surrounding group.
   * @default false
   */
  invalid?: boolean;
}

export function NumberInput({
  label, help, error,
  prefix, suffix,
  stepper = true,
  layout = 'stacked',
  meter = false,
  step = 1,
  min, max,
  id, className = '',
  value, defaultValue,
  onChange, disabled, readOnly,
  size = 'md',
  ...rest
}: NumberInputProps) {
  const reactId = React.useId();
  const fid = id || reactId;
  const ref = React.useRef<HTMLInputElement>(null);
  const describedBy = [
    error ? `${fid}-err` : null,
    help && !error ? `${fid}-help` : null,
    meter && min != null && max != null ? `${fid}-meter` : null,
  ].filter(Boolean).join(' ') || undefined;

  const nudge = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    if (dir === 1) el.stepUp(); else el.stepDown();
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  };

  // Meter: derive a 0–100 percentage from the current numeric value.
  const numMin = min != null ? Number(min) : null;
  const numMax = max != null ? Number(max) : null;
  const rawValue = value != null ? Number(value) : (defaultValue != null ? Number(defaultValue) : null);
  const [liveValue, setLiveValue] = React.useState<number | null>(rawValue);
  const meterPct = React.useMemo(() => {
    const v = value != null ? Number(value) : liveValue;
    if (v == null || numMin == null || numMax == null || numMax === numMin) return 0;
    return Math.min(100, Math.max(0, ((v - numMin) / (numMax - numMin)) * 100));
  }, [value, liveValue, numMin, numMax]);

  const showMeter = meter && numMin != null && numMax != null;
  const isSplit = stepper && layout === 'split';
  const isStacked = stepper && layout === 'stacked';

  const sizeClass = size !== 'md' ? ` ${size}` : '';

  return (
    <div className="in-field">
      {label && <label className="in-label" htmlFor={fid}>{label}</label>}
      <span className={`in-group${sizeClass}${error ? ' is-invalid' : ''}`} aria-invalid={error ? true : undefined}>
        {/* Split layout: leading "−" button */}
        {isSplit && (
          <button
            type="button"
            className="in-addon btn"
            aria-label="Decrease"
            onClick={() => nudge(-1)}
            disabled={disabled || readOnly}
          >
            <Icons.minus size={12} />
          </button>
        )}
        {prefix != null && <span className="in-addon">{prefix}</span>}
        <input
          ref={ref}
          id={fid}
          type="number"
          inputMode="numeric"
          step={step}
          min={min}
          max={max}
          className={`in-control${className ? ` ${className}` : ''}`}
          style={{ textAlign: isSplit ? 'center' : undefined }}
          value={value}
          defaultValue={defaultValue}
          onChange={(e) => {
            setLiveValue(e.target.value === '' ? null : Number(e.target.value));
            onChange?.(e);
          }}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...rest}
        />
        {suffix != null && <span className="in-addon">{suffix}</span>}
        {/* Split layout: trailing "+" button */}
        {isSplit && (
          <button
            type="button"
            className="in-addon btn"
            aria-label="Increase"
            onClick={() => nudge(1)}
            disabled={disabled || readOnly}
          >
            <Icons.plus size={12} />
          </button>
        )}
        {/* Stacked layout: chevron pair */}
        {isStacked && (
          <span className="in-addon stepper">
            <button type="button" className="step" aria-label="Increase" onClick={() => nudge(1)} disabled={disabled || readOnly}><Icons.chevronUp size={11} /></button>
            <button type="button" className="step" aria-label="Decrease" onClick={() => nudge(-1)} disabled={disabled || readOnly}><Icons.chevronDown size={11} /></button>
          </span>
        )}
      </span>
      {/* Progress meter — thin bar below the field */}
      {showMeter && (
        <div
          id={`${fid}-meter`}
          role="progressbar"
          aria-valuenow={meterPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Value progress"
          style={{
            height: 3,
            borderRadius: 2,
            background: 'var(--bg-elevated)',
            overflow: 'hidden',
            marginTop: 4,
          }}
        >
          <div
            style={{
              width: `${meterPct}%`,
              height: '100%',
              background: 'var(--ember)',
              transition: 'width var(--dur-fast) var(--ease)',
            }}
          />
        </div>
      )}
      {(help || error) && (
        <span className="in-helprow" style={{ marginTop: showMeter ? 4 : undefined }}>
          {error
            ? <span className="in-error" id={`${fid}-err`}>{error}</span>
            : <span className="in-help" id={`${fid}-help`}>{help}</span>}
        </span>
      )}
    </div>
  );
}

// ── OTPInput ──────────────────────────────────────────────────────────────────
// A row of single-character cells with auto-advance, backspace-retreat, and paste
// spreading across cells. Emits the joined value on every change.
export interface OTPInputProps {
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

/** Split a flat cell count into groups of `every` (last group holds the remainder). */
function deriveGroupsFromLength(length: number, every: number): number[] {
  if (every <= 0) return [length];
  const groups: number[] = [];
  let left = length;
  while (left > 0) { groups.push(Math.min(every, left)); left -= every; }
  return groups.length ? groups : [length];
}

export function OTPInput({ layout, length = 6, groupEvery = 0, value, defaultValue = '', onValueChange, onChange, onComplete, invalid = false, disabled = false, size = 'md', id, ariaLabel = 'One-time code', autoFocus = false, className = '' }: OTPInputProps) {
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

// ── FileInput ─────────────────────────────────────────────────────────────────
// A drop zone wrapping a native <input type="file"> (overlaid, opacity 0) so
// click, keyboard, and drag-and-drop all work. Requires the .in-drop layer
// (shipped in the Eidos base CSS).
export interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'title' | 'value'> {
  /** Field label rendered above the drop zone. */
  label?: React.ReactNode;
  /** Headline inside the drop zone. */
  title?: React.ReactNode;
  /** Sub-line shown below the title (e.g. accepted types / max size). Alias: `helpText`. */
  meta?: React.ReactNode;
  /**
   * Override the auto-generated sub-line below the title.
   * Alias for `meta` — preferred in the public API.
   */
  helpText?: React.ReactNode;
  /**
   * Compact single-row layout — less vertical space, ideal for dense forms.
   * @default false
   */
  compact?: boolean;
  /** Error message — renders below the drop zone in the danger tone. */
  error?: React.ReactNode;
  /**
   * Fires when files are dropped or picked via the file dialog (FileList).
   * For the public `File[]` API use `onFilesChange`.
   */
  onFiles?: (files: FileList) => void;
  /**
   * Fires when files are added. Receives the selected files as a `File[]` array.
   * Docs-API alias — the implementation wraps `onFiles`.
   */
  onFilesChange?: (files: File[]) => void;
  /**
   * Maximum byte size per file. Files over the limit should be rejected by the
   * consumer (the component itself does not validate — wire this in `onFilesChange`).
   */
  maxSize?: number;
  /**
   * Controlled file list. Pair with `onFilesChange` for a fully controlled component.
   */
  value?: File[];
}

export function FileInput({ label, title = 'Click to upload or drag & drop', meta, helpText, compact = false, error, onFiles, onFilesChange, maxSize, value: _value, id, className = '', onChange, disabled, ...rest }: FileInputProps) {
  const reactId = React.useId();
  const fid = id || reactId;
  const [dragging, setDragging] = React.useState(false);
  return (
    <div className="in-field">
      {label && <label className="in-label" htmlFor={fid}>{label}</label>}
      <label
        className={`in-drop${compact ? ' compact' : ''}${dragging ? ' is-dragging' : ''}${error ? ' is-invalid' : ''} ${className}`.trim()}
        htmlFor={fid}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); if (!disabled && e.dataTransfer.files.length) onFiles?.(e.dataTransfer.files); }}
      >
        <span className="in-drop-icon"><Icons.upload size={compact ? 16 : 18} /></span>
        <div style={{ flex: compact ? 1 : undefined }}>
          <div className="in-drop-title">{title}</div>
          {(meta ?? helpText) && <div className="in-drop-meta">{meta ?? helpText}</div>}
        </div>
        <input
          id={fid}
          type="file"
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          onChange={(e) => {
            if (e.target.files?.length) {
              onFiles?.(e.target.files);
              onFilesChange?.(Array.from(e.target.files));
            }
            onChange?.(e);
          }}
          {...rest}
        />
      </label>
      {error && <span className="in-helprow"><span className="in-error">{error}</span></span>}
    </div>
  );
}

// ── DateInput ────────────────────────────────────────────────────────────────
// The native date control in the Eidos field shell — full keyboard + locale
// support, zero JS. Renders ONE calendar affordance: the native browser
// indicator is hidden via ::-webkit-calendar-picker-indicator (opacity:0) and
// replaced by a single themed DS icon in an in-addon, avoiding the dark-mode
// "two icons / dark indicator" problem.
// For a fully custom popover calendar use the DatePicker component instead.
export interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: React.ReactNode;
  help?: React.ReactNode;
  error?: React.ReactNode;
}

export function DateInput({ label, help, error, id, className = '', ...rest }: DateInputProps) {
  const reactId = React.useId();
  const fid = id || reactId;
  const describedBy = error ? `${fid}-err` : help ? `${fid}-help` : undefined;
  return (
    <div className="in-field">
      {label && <label className="in-label" htmlFor={fid}>{label}</label>}
      <span className={`in-group${error ? ' is-invalid' : ''}`} aria-invalid={error ? true : undefined}>
        <span className="in-addon" aria-hidden="true"><Icons.calendar size={14} /></span>
        <input
          id={fid}
          type="date"
          className={`in-control in-date ${className}`.trim()}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...rest}
        />
      </span>
      {(help || error) && (
        <span className="in-helprow">
          {error
            ? <span className="in-error" id={`${fid}-err`}>{error}</span>
            : <span className="in-help" id={`${fid}-help`}>{help}</span>}
        </span>
      )}
    </div>
  );
}

