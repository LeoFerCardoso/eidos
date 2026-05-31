import * as React from 'react';

const Mono = ({ children }: { children?: React.ReactNode }) => (
  <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--ember)' }}>{children}</code>
);

export { Mono };
