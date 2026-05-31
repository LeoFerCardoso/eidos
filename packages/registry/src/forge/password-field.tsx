import * as React from 'react';
import { PasswordInput } from '@/components/forge/password-input';

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

interface PasswordFieldProps extends Omit<PasswordInputProps, 'showStrength'> {
  /** Override the default set of requirements. */
  requirements?: PasswordRequirement[];
}

function PasswordField({ requirements = DEFAULT_PASSWORD_REQUIREMENTS, ...rest }: PasswordFieldProps) {
  return <PasswordInput showStrength requirements={requirements} {...rest} />;
}

export { PasswordField };
