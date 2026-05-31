import * as React from 'react';
import { Kbd } from '@/components/forge/kbd';

const KbdRow = ({
  label,
  keys = [],
  meta,
}: {
  label?: React.ReactNode;
  keys?: string[];
  meta?: React.ReactNode;
}) => <Kbd label={label} keys={keys} meta={meta}/>;

export { KbdRow };
