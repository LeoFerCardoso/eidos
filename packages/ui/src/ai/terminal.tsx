import * as React from 'react';
// Eidos AI — Terminal.
//
// A focused command surface for showing what the agent ran and what came
// back. NOT a real terminal emulator: it's a styled mono container with
// prompt lines, output lines, and status markers (running / done / error).
// For raw streamed logs, prefer the core `LogViewer` (blocks.tsx); use
// Terminal when the lines are paired commands + outputs.
//
// Lines are typed:
//   { kind: 'in',   text }        ← command typed (with $ / > prompt)
//   { kind: 'out',  text }        ← command output (regular mono)
//   { kind: 'err',  text }        ← stderr / failure output (danger tone)
//   { kind: 'note', text }        ← editorial annotation between blocks
//
// Styles live in src/styles/ai.css under the `.ai-term*` block.
import { Icons } from '../icons';

export interface TerminalLine {
  kind: 'in' | 'out' | 'err' | 'note';
  text: string;
}

export interface TerminalProps {
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

// Terminal — a self-contained mono command surface.
export const Terminal = ({
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
