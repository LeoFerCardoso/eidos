import * as React from 'react';

type Size = 'sm' | 'md' | 'lg';

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
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

function Textarea({ label, help, error, showCount, id, className = '', maxLength, value, defaultValue, onChange, ...rest }: TextareaProps) {
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

export { Textarea };
