import * as React from 'react';

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

export { DEFAULT_PASSWORD_REQUIREMENTS };
