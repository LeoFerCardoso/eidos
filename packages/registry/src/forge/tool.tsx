import * as React from 'react';
import { Icons } from '@/components/forge/icons';
import { ToolStatus } from '@/components/forge/tool-status';

const Tool = ({
  name,
  ns = 'eidos.ai',
  state,
  ms,
  defaultOpen,
  children,
}: {
  /** Tool function name. Mono-rendered after the namespace prefix. */
  name: string;
  /** Namespace prefix shown dimmer than the name — reads like an import path. */
  ns?: string;
  /** Drives the status pill, the auto-open behaviour, and which sections render. */
  state: string;
  /** Call duration in ms. Shown next to the name in mono when state enters an output state. */
  ms?: number;
  /** Manual override for the initial open state. Defaults to open on output-available / output-error. */
  defaultOpen?: boolean;
  /** ToolInput + (optional) ToolOutput slots. */
  children?: React.ReactNode;
}) => {
  const autoOpen = state === 'output-available' || state === 'output-error';
  const [open, setOpen] = React.useState(defaultOpen ?? autoOpen);
  const [touched, setTouched] = React.useState(false);
  React.useEffect(() => {
    if (touched) return;
    setOpen(autoOpen);
  }, [autoOpen, touched]);
  return (
    <div className="tool" data-open={open ? 'true' : 'false'}>
      <button
        className="tool-head"
        onClick={() => { setTouched(true); setOpen(v => !v); }}
        aria-expanded={open}
      >
        <span className="ico"><Icons.zap size={13}/></span>
        <span className="name"><span className="ns">{ns}.</span>{name}</span>
        {typeof ms === 'number' && <span className="ms">{ms} ms</span>}
        <span role="status" aria-live="polite" className="tool-status-live"><ToolStatus state={state}/></span>
        <Icons.chevronDown size={13} className="chev"/>
      </button>
      <div className="tool-body" aria-hidden={!open}>
        {children}
      </div>
    </div>
  );
};

export { Tool };
