import * as React from 'react';
import { Icons } from '@/components/forge/icons';

type Size = 'sm' | 'md' | 'lg';

const fcCls = (size: Size, block: boolean, invalid: boolean, extra = '') =>
  ['fc', size !== 'md' ? size : '', block ? 'block' : '', invalid ? 'invalid' : '', extra]
    .filter(Boolean).join(' ');

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
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

function Checkbox({ label, description, indeterminate = false, disabled, size = 'md', id, className = '', ...rest }: CheckboxProps) {
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

export { Checkbox };
