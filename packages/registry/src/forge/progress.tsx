import * as React from 'react';
import { cn } from '@/lib/utils';

type ProgressVariant = 'linear' | 'circular';

type ProgressStatus = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

type ProgressSize = 'xs' | 'sm' | 'md' | 'lg';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Visual form — linear bar (default) or circular ring.
   * @default "linear"
   */
  variant?: ProgressVariant;

  /**
   * Current progress value (0–max). Omit (or pass undefined) for indeterminate mode.
   */
  value?: number;

  /**
   * Upper bound.
   * @default 100
   */
  max?: number;

  /**
   * Status tone of the fill/ring.
   * @default "primary"
   */
  status?: ProgressStatus;

  /**
   * Track height for the linear bar.
   * xs = 2px · sm = 4px (default) · md = 6px · lg = 10px
   * @default "sm"
   */
  size?: ProgressSize;

  /**
   * Loop an animated slug across the track; drops aria-valuenow and sets aria-busy.
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Secondary fill (lighter) rendered behind the confirmed bar.
   * Use for streaming uploads where receive ≠ confirm. Linear only.
   */
  buffered?: number;

  /**
   * Diagonal stripe overlay. Use only for long-running ops where motion reassures.
   * Linear only.
   * @default false
   */
  striped?: boolean;

  /**
   * Named phase labels for a segmented stepper. When present, renders .prog-seg
   * instead of a continuous bar. Linear only.
   */
  segments?: string[];

  /**
   * Zero-based index of the active segment (used with `segments`).
   */
  activeSegment?: number;

  /**
   * Head label — verb-first ("Building", "Uploading"). Drives the visible aria-label
   * when no explicit `aria-label` is provided.
   */
  label?: string;

  /**
   * Muted sub-label shown after an em-dash in the head row. Linear only.
   */
  sub?: string;

  /**
   * Outer diameter in pixels. Circular only.
   * @default 48
   */
  circleSize?: number;

  /**
   * Ring thickness in pixels. Circular only.
   * @default 4
   */
  strokeWidth?: number;

  /**
   * Human-readable value text for screen readers (e.g. "64 of 100 steps").
   * Defaults to the integer percentage when determinate.
   */
  valueText?: string;

  className?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      variant = 'linear',
      value,
      max = 100,
      status = 'primary',
      size = 'sm',
      indeterminate: indeterminateProp,
      buffered,
      striped = false,
      segments,
      activeSegment,
      label,
      sub,
      circleSize = 48,
      strokeWidth = 4,
      valueText,
      className,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      ...rest
    },
    ref,
  ) => {
    // Treat missing value as indeterminate regardless of the prop.
    const indeterminate = indeterminateProp ?? value === undefined;

    // Clamp and compute percentage.
    const pct = indeterminate
      ? null
      : Math.max(0, Math.min(100, ((value ?? 0) / Math.max(1, max)) * 100));

    const computedAriaLabel = ariaLabel ?? label;
    const computedValueText = valueText ?? (pct !== null ? `${Math.round(pct)}%` : undefined);

    if (variant === 'circular') {
      return (
        <ProgressCircular
          ref={ref}
          value={pct}
          indeterminate={indeterminate}
          status={status}
          circleSize={circleSize}
          strokeWidth={strokeWidth}
          circLabel={label}
          valueText={computedValueText}
          aria-label={computedAriaLabel}
          aria-labelledby={ariaLabelledBy}
          className={className}
          {...rest}
        />
      );
    }

    // ── linear / segmented ────────────────────────────────────────────────

    if (segments && segments.length > 0) {
      const active = activeSegment ?? 0;
      // aria-valuenow = active+1 (1-based step), aria-valuemax = segment count.
      // Visible percent = (active+1)/length so "Step 3 of 5" == 60% == valuenow 3/5.
      const stepNow = active + 1;
      const segPct = Math.round((stepNow / Math.max(1, segments.length)) * 100);

      return (
        <div
          ref={ref}
          className={cn('prog', className)}
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : stepNow}
          aria-valuemin={0}
          aria-valuemax={segments.length}
          aria-valuetext={indeterminate ? undefined : `Step ${stepNow} of ${segments.length}`}
          aria-label={computedAriaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-busy={indeterminate || undefined}
          {...rest}
        >
          {(label || sub) && (
            <div className="prog-head">
              <span className="label">
                {label}
                {sub && <span className="sub"> — {sub}</span>}
              </span>
              <span className="pct">{indeterminate ? '…' : `${segPct}%`}</span>
            </div>
          )}
          <div className="prog-seg" role="presentation">
            {segments.map((name, i) => (
              <div
                key={name}
                className={cn(
                  'seg',
                  i < active && 'done',
                  i === active && 'active',
                )}
                aria-hidden="true"
              />
            ))}
          </div>
          {segments.length > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 6,
                fontSize: 'var(--text-xs)',
                color: 'var(--fg-subtle)',
                fontFamily: 'var(--font-mono)',
              }}
              aria-hidden="true"
            >
              {segments.map((name) => (
                <span key={name}>{name}</span>
              ))}
            </div>
          )}
        </div>
      );
    }

    // ── continuous linear bar ─────────────────────────────────────────────

    const rootCls = cn(
      'prog',
      size !== 'sm' && size,
      status !== 'primary' && status,
      buffered !== undefined && 'buffer',
      striped && 'striped',
      indeterminate && 'indeterminate',
      className,
    );

    const bufPct =
      buffered !== undefined
        ? Math.max(0, Math.min(100, (buffered / Math.max(1, max)) * 100))
        : null;

    return (
      <div
        ref={ref}
        className={rootCls}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : pct ?? undefined}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={indeterminate ? undefined : computedValueText}
        aria-label={computedAriaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-busy={indeterminate || undefined}
        {...rest}
      >
        {(label || sub) && (
          <div className="prog-head">
            <span className="label">
              {label}
              {sub && <span className="sub"> — {sub}</span>}
            </span>
            <span className="pct">
              {indeterminate ? '…' : `${Math.round(pct ?? 0)}%`}
            </span>
          </div>
        )}
        <div className="prog-track">
          {bufPct !== null && (
            <div
              className="prog-buf"
              style={{ width: `${bufPct}%` }}
              aria-hidden="true"
            />
          )}
          <div
            className="prog-fill"
            style={indeterminate ? undefined : { width: `${pct}%` }}
            aria-hidden="true"
          />
        </div>
      </div>
    );
  },
);

interface CircularProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number | null;
  indeterminate: boolean;
  status: ProgressStatus;
  circleSize: number;
  strokeWidth: number;
  circLabel?: string;
  valueText?: string;
  className?: string;
}

const ProgressCircular = React.forwardRef<HTMLDivElement, CircularProps>(
  (
    {
      value,
      indeterminate,
      status,
      circleSize,
      strokeWidth,
      circLabel,
      valueText,
      className,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      ...rest
    },
    ref,
  ) => {
    const r = (circleSize - strokeWidth) / 2;
    const c = 2 * Math.PI * r;
    const pct = value !== null ? Math.max(0, Math.min(100, value)) : 0;
    const offset = c * (1 - pct / 100);

    return (
      <div
        ref={ref}
        className={cn(
          'prog-circ',
          status !== 'primary' && status,
          indeterminate && 'indeterminate',
          className,
        )}
        style={{ width: circleSize, height: circleSize }}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={indeterminate ? undefined : valueText}
        aria-label={ariaLabel ?? circLabel}
        aria-labelledby={ariaLabelledBy}
        aria-busy={indeterminate || undefined}
        {...rest}
      >
        <svg width={circleSize} height={circleSize} aria-hidden="true">
          <circle
            className="track"
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={r}
            strokeWidth={strokeWidth}
          />
          <circle
            className="bar"
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={r}
            strokeWidth={strokeWidth}
            strokeDasharray={c}
            strokeDashoffset={indeterminate ? c * 0.7 : offset}
          />
        </svg>
        {!indeterminate && (
          <span className="pct" aria-hidden="true">
            {Math.round(pct)}%
          </span>
        )}
      </div>
    );
  },
);

export { Progress };
