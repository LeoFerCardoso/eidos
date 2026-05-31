import * as React from 'react';
import { Icons } from '@/components/forge/icons';
import { Pill } from '@/components/forge/pill';

const STATUS_META = {
  'input-streaming':  { tone: 'ice'     as const, live: true,  label: 'Pending', icon: undefined },
  'input-available':  { tone: 'warning' as const, live: true,  label: 'Running', icon: undefined },
  'output-available': { tone: 'success' as const, live: false, label: 'Done',    icon: <Icons.check size={10}/> },
  'output-error':     { tone: 'danger'  as const, live: false, label: 'Error',   icon: <Icons.alert size={10}/> },
};

const ToolStatus = ({
  state,
}: {
  /** Run-state key; one of the four STATUS_META entries. */
  state: string;
}) => {
  const m = STATUS_META[state as keyof typeof STATUS_META] || STATUS_META['input-streaming'];
  return (
    <Pill tone={m.tone} live={m.live} icon={m.icon} dot={!m.icon && !m.live}>
      {m.label}
    </Pill>
  );
};

export { ToolStatus };
