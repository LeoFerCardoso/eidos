import * as React from 'react';
import { Icons } from '@/components/forge/icons';

type Size = 'sm' | 'md' | 'lg';

interface PasswordRequirement {
  /** Human-readable label, e.g. "At least 8 characters". */
  label: string;
  /** Returns true when the password satisfies this requirement. */
  test: (value: string) => boolean;
}

const DEFAULT_PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { label: '8+ characters',        test: (v) => v.length >= 8 },
  { label: 'At least 1 uppercase', test: (v) => /[A-Z]/.test(v) },
  { label: 'At least 1 lowercase', test: (v) => /[a-z]/.test(v) },
  { label: 'At least 1 number',    test: (v) => /\d/.test(v) },
];

interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Field label rendered above the control. */
  label?: React.ReactNode;
  /** Helper text (hidden when `error` is set). */
  help?: React.ReactNode;
  /** Error message — danger ring + aria-invalid. */
  error?: React.ReactNode;
  /** Size scale: sm / md (default) / lg. */
  size?: Size;
  /** Whether the field is in an invalid state (applies danger ring). */
  invalid?: boolean;
  /**
   * Show a segmented strength bar below the field. The score is derived from
   * how many `requirements` pass (or from the default requirements if none
   * are provided).
   */
  showStrength?: boolean;
  /**
   * List of requirements to test. Each item shows a check (met) or x (unmet).
   * Defaults to DEFAULT_PASSWORD_REQUIREMENTS when showStrength is true but
   * no requirements are provided.
   */
  requirements?: PasswordRequirement[];
}

function PasswordInput({
  label,
  help,
  error,
  size = 'md',
  invalid,
  showStrength = false,
  requirements,
  id,
  value,
  defaultValue,
  onChange,
  disabled,
  className = '',
  ...rest
}: PasswordInputProps) {
  const reactId = React.useId();
  const fid = id || reactId;

  // Controlled / uncontrolled value tracking (needed for live strength feedback).
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(String(defaultValue ?? ''));
  const currentValue = isControlled ? String(value) : internal;

  const [showText, setShowText] = React.useState(false);

  // Derive requirements (use defaults when showStrength is on but none given).
  const reqs: PasswordRequirement[] = requirements ?? (showStrength ? DEFAULT_PASSWORD_REQUIREMENTS : []);
  const passingCount = currentValue.length === 0 ? 0 : reqs.filter((r) => r.test(currentValue)).length;

  // Strength: 0 = blank, 1–4 tiers.
  const totalReqs = reqs.length || 1;
  const strengthScore = currentValue.length === 0 ? 0 : Math.max(1, Math.round((passingCount / totalReqs) * 4));

  const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Strong', 'Very strong'];
  const STRENGTH_TONES  = ['', 'danger', 'warning', 'success', 'success'];

  const isInvalid = !!(error || invalid);
  const describedBy = [
    error         ? `${fid}-err`      : null,
    help && !error ? `${fid}-help`    : null,
    showStrength  ? `${fid}-strength` : null,
  ].filter(Boolean).join(' ') || undefined;

  const sizeClass = size !== 'md' ? ` ${size}` : '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternal(e.target.value);
    onChange?.(e);
  };

  return (
    <div className="in-field">
      {label && <label className="in-label" htmlFor={fid}>{label}</label>}

      {/* Input group */}
      <span
        className={`in-group${sizeClass}${isInvalid ? ' is-invalid' : ''}${disabled ? ' is-disabled' : ''}`}
        aria-invalid={isInvalid ? true : undefined}
      >
        <input
          id={fid}
          type={showText ? 'text' : 'password'}
          className={`in-control ${className}`.trim()}
          value={value}
          defaultValue={isControlled ? undefined : defaultValue}
          onChange={handleChange}
          disabled={disabled}
          aria-invalid={isInvalid ? true : undefined}
          aria-describedby={describedBy}
          autoComplete="current-password"
          {...rest}
        />
        {/* Show/hide toggle — type="button" prevents form submission */}
        <button
          type="button"
          className="in-addon btn"
          onClick={() => setShowText((s) => !s)}
          aria-label={showText ? 'Hide password' : 'Show password'}
          aria-pressed={showText}
          disabled={disabled}
          tabIndex={disabled ? -1 : 0}
        >
          {showText
            ? <Icons.eyeOff size={15} />
            : <Icons.eye    size={15} />}
        </button>
      </span>

      {/* Strength bar + requirements */}
      {showStrength && reqs.length > 0 && (
        <div className="pw-feedback">
          {/* Segmented strength bar */}
          <div className="pw-strength" aria-hidden="true">
            {[1, 2, 3, 4].map((seg) => (
              <span
                key={seg}
                className={
                  'pw-seg' +
                  (currentValue.length > 0 && seg <= strengthScore
                    ? ` pw-seg--${STRENGTH_TONES[strengthScore]}`
                    : '')
                }
              />
            ))}
          </div>

          {/* Strength label — announced politely */}
          <span
            id={`${fid}-strength`}
            className={`pw-strength-label${currentValue.length > 0 ? ` pw-tone--${STRENGTH_TONES[strengthScore]}` : ''}`}
            aria-live="polite"
            aria-atomic="true"
          >
            {currentValue.length > 0 ? STRENGTH_LABELS[strengthScore] : ''}
          </span>

          {/* Requirements checklist */}
          <ul className="pw-reqs" role="list" aria-label="Password requirements">
            {reqs.map((req) => {
              const met = currentValue.length > 0 && req.test(currentValue);
              return (
                <li
                  key={req.label}
                  className={`pw-req${met ? ' pw-req--met' : ''}`}
                >
                  <span className="pw-req-icon" aria-hidden="true">
                    {met
                      ? <Icons.check size={12} strokeWidth={2.5} />
                      : <Icons.x    size={12} strokeWidth={2}   />}
                  </span>
                  <span className="pw-req-label">{req.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Help / error row */}
      {(help || error) && (
        <span className="in-helprow">
          {error
            ? <span className="in-error" id={`${fid}-err`}>{error}</span>
            : <span className="in-help"  id={`${fid}-help`}>{help}</span>}
        </span>
      )}
    </div>
  );
}

export { PasswordInput };
