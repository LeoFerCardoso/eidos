import * as React from 'react';
import { Chip } from '@/components/forge/chip';

const TierBadge = ({
  tier,
  className,
}: {
  tier?: string;
  className?: string;
}) => {
  const toneMap: Record<string, 'tier-t1' | 'tier-t2' | 'tier-t3'> = {
    T1: 'tier-t1',
    T2: 'tier-t2',
    T3: 'tier-t3',
  };
  const tone = toneMap[tier ?? ''] ?? 'tier-t3';
  return <Chip tone={tone} className={className}>{tier}</Chip>;
};

export { TierBadge };
