import * as React from 'react';

type Size = 'sm' | 'md' | 'lg';

const fcCls = (size: Size, block: boolean, invalid: boolean, extra = '') =>
  ['fc', size !== 'md' ? size : '', block ? 'block' : '', invalid ? 'invalid' : '', extra]
    .filter(Boolean).join(' ');

interface RadioOption { label: React.ReactNode; value: string; description?: React.ReactNode; disabled?: boolean }

interface RadioGroupProps {
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

function RadioGroup({ options, value, defaultValue, name, onChange, disabled = false, inline = false, ariaLabel, size = 'md' }: RadioGroupProps) {
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

export { RadioGroup };
