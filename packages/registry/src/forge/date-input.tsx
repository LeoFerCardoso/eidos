import * as React from 'react';
import { Icons } from '@/components/forge/icons';

interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: React.ReactNode;
  help?: React.ReactNode;
  error?: React.ReactNode;
}

function DateInput({ label, help, error, id, className = '', ...rest }: DateInputProps) {
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

export { DateInput };
