import * as React from 'react';
import { Context } from '@/components/forge/context';

const ContextBar = ({
  used = 0, total, files, thresholdMid = 0.6, thresholdWarn = 0.85, className, style,
}: {
  /** Tokens used so far in this conversation. */
  used?: number;
  /** Size of the model's context window (required). */
  total: number;
  /** Optional file count shown alongside the token numbers. */
  files?: number;
  /** Percentage [0–1] where the tone shifts from ok to mid. */
  thresholdMid?: number;
  /** Percentage [0–1] where the tone shifts from mid to warn. */
  thresholdWarn?: number;
  /** Extra class names on the root span. */
  className?: string;
  /** Inline styles on the root span. */
  style?: React.CSSProperties;
}) => (
  <Context
    used={used}
    total={total}
    files={files}
    variant="bar"
    thresholdMid={thresholdMid}
    thresholdWarn={thresholdWarn}
    className={className}
    style={style}
  />
);

export { ContextBar };
