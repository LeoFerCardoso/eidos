import * as React from 'react';
import { Code } from '@/components/forge/code';
import { Icons } from '@/components/forge/icons';

const COLLAPSE_THRESHOLD = 8;

const countLines = (src) => String(src).replace(/^\n+|\s+$/g, '').split('\n').length;

const CollapsibleCode = ({ code, lang = 'jsx' }: { code?: string; lang?: string }) => {
  const collapsible = countLines(code) > COLLAPSE_THRESHOLD;
  const [expanded, setExpanded] = React.useState(false);
  if (!collapsible) return <Code lang={lang}>{code}</Code>;
  return (
    <div className="ds-code-collapse" data-expanded={expanded ? 'true' : 'false'}>
      <div className="ds-code-clip">
        <Code lang={lang}>{code}</Code>
        {!expanded && <div className="ds-code-fade" aria-hidden="true"/>}
      </div>
      <div className="ds-code-toggle-row">
        <button
          type="button"
          className="ds-code-toggle"
          onClick={() => setExpanded(v => !v)}
          aria-expanded={expanded}
        >
          {expanded ? 'Hide code' : 'Show code'}
          <Icons.chevronDown size={10}/>
        </button>
      </div>
    </div>
  );
};

export { CollapsibleCode };
