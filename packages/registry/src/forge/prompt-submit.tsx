import * as React from 'react';
import { Icons } from '@/components/forge/icons';

const PromptSubmit = ({
  status,
  hasText,
  onClick,
}: {
  status: 'ready' | 'submitted' | 'streaming' | 'error';
  hasText?: boolean;
  onClick?: () => void;
}) => {
  if (status === 'submitted') return (
    <button className="pi-submit is-submitted" disabled>
      <span className="pi-submit-spin"/>
    </button>
  );
  if (status === 'streaming') return (
    <button className="pi-submit is-streaming" onClick={onClick} aria-label="Stop generating">
      <span style={{ width: 11, height: 11, background: 'currentColor', borderRadius: 2 }}/>
    </button>
  );
  if (status === 'error') return (
    <button className="pi-submit is-error" onClick={onClick} aria-label="Retry">
      <Icons.alert size={14}/>
    </button>
  );
  return (
    <button className="pi-submit" onClick={onClick} disabled={!hasText} aria-label="Send">
      <Icons.arrowUp size={14}/>
    </button>
  );
};

export { PromptSubmit };
