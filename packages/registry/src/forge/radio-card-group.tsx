import * as React from 'react';
import { RadioCard } from '@/components/forge/radio-card';

type CardOrientation = 'horizontal' | 'vertical';

interface RadioCardOption {
  value: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface RadioCardGroupProps {
  /** Options to render as RadioCards. */
  options: RadioCardOption[];
  /** Controlled selected value. */
  value?: string;
  /** Uncontrolled default selected value. */
  defaultValue?: string;
  /** Called when a card is selected. */
  onValueChange?: (value: string) => void;
  /** Shared input name (auto-generated if omitted). */
  name?: string;
  /** Group layout — `vertical` (default, column of cards) or `horizontal` (row). */
  orientation?: 'horizontal' | 'vertical';
  /** Card orientation — how each individual card lays out its control + content. */
  cardOrientation?: CardOrientation;
  /** Disable the entire group. */
  disabled?: boolean;
  /** Accessible name for the group (role="radiogroup"). */
  ariaLabel?: string;
  className?: string;
}

function RadioCardGroup({
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  orientation = 'vertical',
  cardOrientation = 'horizontal',
  disabled = false,
  ariaLabel,
  className = '',
}: RadioCardGroupProps) {
  const reactId = React.useId();
  const groupName = name || reactId;

  const [internal, setInternal] = React.useState(defaultValue ?? '');
  const isControlled = value !== undefined;
  const selected = isControlled ? value : internal;

  const handleChange = (v: string) => {
    if (!isControlled) setInternal(v);
    onValueChange?.(v);
  };

  const groupCls = [
    'sel-card-group',
    orientation === 'horizontal' ? 'sel-card-group--horizontal' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div role="radiogroup" aria-label={ariaLabel} className={groupCls}>
      {options.map((opt) => (
        <RadioCard
          key={opt.value}
          value={opt.value}
          title={opt.title}
          description={opt.description}
          icon={opt.icon}
          orientation={cardOrientation}
          checked={selected === opt.value}
          onChange={handleChange}
          name={groupName}
          disabled={disabled || opt.disabled}
        />
      ))}
    </div>
  );
}

export { RadioCardGroup };
