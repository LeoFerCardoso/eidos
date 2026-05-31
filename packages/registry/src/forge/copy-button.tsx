import * as React from 'react';
import { Icons } from '@/components/forge/icons';

const CopyButton = ({ text, label = 'Copy' }: { text?: string; label?: string }) => {
  const [ok, setOk] = React.useState(false);
  const onClick = async () => {
    try { await navigator.clipboard.writeText(text); }
    catch(e) {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch(e2){}
      ta.remove();
    }
    setOk(true); setTimeout(()=>setOk(false), 1400);
  };
  return (
    <button className={'copy-btn' + (ok?' ok':'')} onClick={onClick} aria-label="Copy code">
      {ok ? <Icons.check size={12}/> : <Icons.copy size={12}/>}
      {ok ? 'Copied' : label}
    </button>
  );
};

export { CopyButton };
