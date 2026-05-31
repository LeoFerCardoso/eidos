import * as React from 'react';
import { Icons } from '@/components/forge/icons';

type Size = 'sm' | 'md' | 'lg';

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'type'> {
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

function NumberInput({
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

export { NumberInput };
