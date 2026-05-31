import * as React from 'react';
import { Icons } from '@/components/forge/icons';

const ProseCode = ({
  lang = 'bash',
  children,
}: {
  lang?: string;
  children?: React.ReactNode;
}) => {
  const [ok, setOk] = React.useState(false);
  const text = String(children);
  const onCopy = async () => {
    try { await navigator.clipboard.writeText(text); }
    catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e2) {}
      ta.remove();
    }
    setOk(true); setTimeout(() => setOk(false), 1200);
  };
  return (
    <div className="ai-code">
      <div className="ai-code-head">
        <span className="lang">{lang}</span>
        <span className="spacer"/>
        <button className="ai-code-copy" onClick={onCopy} aria-label="Copy code">
          {ok ? <Icons.check size={11}/> : <Icons.copy size={11}/>}
          {ok ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="ai-code-body">{children}</pre>
    </div>
  );
};

export { ProseCode };
