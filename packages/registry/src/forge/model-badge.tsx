import * as React from 'react';
import { Chip } from '@/components/forge/chip';

const ModelBadge = ({ short = 'S' }: { short?: string }) => (
  <Chip
    style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700, padding: '1px 5px' }}
  >
    {short}
  </Chip>
);

export { ModelBadge };
