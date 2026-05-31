import * as React from 'react';
import { Icons } from '@/components/forge/icons';

interface TerminalLine {
  kind: 'in' | 'out' | 'err' | 'note';
  text: string;
}

interface TerminalProps {
  /** Ordered list of lines to render. Mix in/out/err/note freely. */
  lines?: TerminalLine[];
  /** Prompt prefix shown before in lines. Use ">" for PowerShell / Windows conventions. */
  prompt?: string;
  /** Session label shown in the title bar (e.g. "session · billing-svc"). */
  title?: string;
  /** Status pill in the title bar. "running" activates aria-live="polite". */
  status?: 'idle' | 'running' | 'done' | 'error';
  /** Optional footer slot rendered below the line list (e.g. a live input). */
  children?: React.ReactNode;
  /** Additional class names on the root element. */
  className?: string;
}

const Terminal = ({
  lines = [], prompt = '$', title, status, children, className,
}: TerminalProps) => (
  <div className={'ai-term' + (className ? ' ' + className : '')} role="log" aria-live={status === 'running' ? 'polite' : undefined}>
    {(title || status) && (
      <div className="ai-term-head">
        <span className="ai-term-ico" aria-hidden="true"><Icons.terminal size={14}/></span>
        {title && <span className="ai-term-title">{title}</span>}
        {status && <span className={'ai-term-status ' + status}>{status}</span>}
      </div>
    )}
    <div className="ai-term-body" dir="ltr">
      {lines.map((l, i) => {
        if (l.kind === 'in') {
          return (
            <div key={i} className="ai-term-line in">
              <span className="ai-term-prompt">{prompt}</span>
              <span className="ai-term-text">{l.text}</span>
            </div>
          );
        }
        if (l.kind === 'err') {
          return (
            <div key={i} className="ai-term-line err">
              <span className="ai-term-mark"><Icons.alert size={11}/></span>
              <span className="ai-term-text">{l.text}</span>
            </div>
          );
        }
        if (l.kind === 'note') {
          return <div key={i} className="ai-term-line note">{l.text}</div>;
        }
        return <div key={i} className="ai-term-line out"><span className="ai-term-text">{l.text}</span></div>;
      })}
      {children}
    </div>
  </div>
);

export { Terminal };
