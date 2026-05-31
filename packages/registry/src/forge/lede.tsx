import * as React from 'react';

const Lede = ({ children, up = false, wide = false, narrow = false }: { children?: React.ReactNode; up?: boolean; wide?: boolean; narrow?: boolean }) => (
  <p className={'ds-caption' + (wide ? ' wide' : '') + (narrow ? ' narrow' : '')} style={{ marginBottom: 18, ...(up ? { marginTop: -6 } : null) }}>
    {children}
  </p>
);

export { Lede };
