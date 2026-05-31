import * as React from 'react';

type Size = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
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

function Input({ label, help, error, prefix, suffix, id, className = '', invalid, size, ...rest }: InputProps) {
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

export { Input };
