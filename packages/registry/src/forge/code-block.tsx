import * as React from 'react';
import { Code } from '@/components/forge/code';
import { CopyButton } from '@/components/forge/copy-button';

interface CodeBlockProps {
  /** Eyebrow label shown in the block header, left-aligned. Name the snippet ("deploy command", "agent loop"). */
  label?: string;
  /** The raw code string. Rendered through the built-in tokenizer; copied verbatim by the copy button. */
  code: string;
  /** Language hint for the built-in tokenizer. Drives syntax colour. Pass an empty string to render plain mono. */
  lang?: string;
}

const CodeBlock = ({ label = 'snippet', code, lang = 'jsx' }: CodeBlockProps) => (
  <div className="ds-frame ds-frame-codeonly">
    <div className="ds-frame-head">
      <span className="label">{label}</span>
      <div className="actions">
        <CopyButton text={code}/>
      </div>
    </div>
    <Code lang={lang}>{code}</Code>
  </div>
);

export { CodeBlock };
