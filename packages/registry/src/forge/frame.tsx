import * as React from 'react';
import { CollapsibleCode } from '@/components/forge/collapsible-code';
import { CopyButton } from '@/components/forge/copy-button';

const Frame = ({ label, children, code, lang='jsx', center=false, row=false, dotted=false, height }: {
  label?: React.ReactNode;
  children?: React.ReactNode;
  code?: string;
  lang?: string;
  center?: boolean;
  row?: boolean;
  dotted?: boolean;
  height?: number | string;
}) => (
  <div className="ds-frame">
    <div className="ds-frame-head">
      <span className="label">{label}</span>
      <div className="actions">
        {code && <CopyButton text={code}/>}
      </div>
    </div>
    <div
      className={'ds-frame-body' + (center?' center':'') + (row?' row':'') + (dotted?' dotted':'')}
      style={height ? {minHeight: height} : undefined}
    >
      {children}
    </div>
    {code && <CollapsibleCode code={code} lang={lang}/>}
  </div>
);

export { Frame };
