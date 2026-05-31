import * as React from 'react';
import { Code } from '@/components/forge/code';

const ToolInput = ({
  params,
  streaming,
  paramsHint,
}: {
  /** Tool input args. Rendered as syntax-highlighted JSON. */
  params: object;
  /** When true, swap the JSON for shimmer placeholders while params stream in. */
  streaming?: boolean;
  /** Right-aligned meta text — e.g. "3 args" or "streaming…". */
  paramsHint?: string;
}) => (
  <div className="tool-section">
    <div className="tool-section-label">
      <span>Input</span>
      {paramsHint && <span className="meta">{paramsHint}</span>}
    </div>
    {streaming ? (
      <div className="tool-skel">
        <div className="ln" style={{ width: '70%' }}/>
        <div className="ln" style={{ width: '88%' }}/>
        <div className="ln" style={{ width: '56%' }}/>
      </div>
    ) : (
      <Code lang="json">{JSON.stringify(params, null, 2)}</Code>
    )}
  </div>
);

export { ToolInput };
