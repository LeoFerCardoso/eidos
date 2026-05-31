import * as React from 'react';
import { CopyButton } from '@/components/forge/copy-button';

const TokenSwatch = ({ name, value, lightValue, varName }: {
  name?: string;
  value?: string;
  lightValue?: string;
  varName?: string;
}) => (
  <div className="tok">
    <div className="swatch" style={{ background: `var(${varName})` }}/>
    <div className="meta">
      <span className="name">{name}</span>
      <span className="val">{varName}</span>
      <span className="val" style={{color:'var(--fg-faint)'}}>
        {lightValue ? <>dark · {value}<br/>light · {lightValue}</> : value}
      </span>
    </div>
    <CopyButton text={varName} label="var"/>
  </div>
);

export { TokenSwatch };
