import * as React from 'react';

type Size = 'sm' | 'md' | 'lg';

const fcCls = (size: Size, block: boolean, invalid: boolean, extra = '') =>
  ['fc', size !== 'md' ? size : '', block ? 'block' : '', invalid ? 'invalid' : '', extra]
    .filter(Boolean).join(' ');

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
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

function Switch({ label, description, invalid = false, disabled, size = 'md', id, className = '', ...rest }: SwitchProps) {
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

export { Switch };
