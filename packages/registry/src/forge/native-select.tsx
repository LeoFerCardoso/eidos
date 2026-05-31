import * as React from 'react';

interface NativeSelectOption { label: string; value: string; disabled?: boolean }

interface NativeSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: React.ReactNode;
  help?: React.ReactNode;
  error?: React.ReactNode;
  /** Options to render. Omit to provide your own <option> children. */
  options?: NativeSelectOption[];
  /** Placeholder option shown first (disabled, empty value). */
  placeholder?: string;
}

function NativeSelect({ label, help, error, options, placeholder, id, className = '', children, ...rest }: NativeSelectProps) {
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

export { NativeSelect };
