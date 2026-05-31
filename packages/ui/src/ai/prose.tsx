import * as React from 'react';
// Forge AI — the prose surface + streaming caret.
//
// `.ai-prose` is the editorial body that rendered model markdown lands in
// (headings, lists, inline code, links, tables, blockquotes, figures). The
// DS does NOT bundle a markdown renderer — pass already-rendered nodes
// (e.g. react-markdown output) as children. Styles live in src/styles/ai.css.
import { Icons } from '../icons';

// ── Streaming caret — shared by Response / custom prose ───────────────────
// `.ai-caret` from ai.css; any surface can drop the caret without re-styling.
const AICaret = () => <span className="ai-caret" aria-hidden="true"/>;

// Inject the caret as the LAST inline child of the LAST rendered block, so it
// visually trails the most recent character (the ChatGPT/Claude behaviour).
// Walks into the tail recursively so nested wrappers (li > span, pre > code)
// still land the caret at the textual edge instead of on the line below.
const injectCaret = (node: React.ReactNode): React.ReactNode => {
  if (typeof node === 'string' || typeof node === 'number') {
    return <>{node}<AICaret key="__caret"/></>;
  }
  if (!React.isValidElement(node)) return node;
  const inner = React.Children.toArray((node.props as any).children);
  if (inner.length === 0) {
    return React.cloneElement(node, { key: node.key }, <AICaret key="__caret"/>);
  }
  const lastIdx = inner.length - 1;
  const next = [...inner.slice(0, lastIdx), injectCaret(inner[lastIdx])];
  return React.cloneElement(node, { key: node.key }, ...next);
};

const withStreamingCaret = (children: React.ReactNode): React.ReactNode[] => {
  const kids = React.Children.toArray(children);
  if (kids.length === 0) return [<AICaret key="__caret-empty"/>];
  const lastIdx = kids.length - 1;
  return [...kids.slice(0, lastIdx), injectCaret(kids[lastIdx])];
};

// ── Prose — the .ai-prose editorial surface ───────────────────────────────
// The canonical wrapper for rendered model markdown. When `streaming`, marks
// the region aria-live/aria-busy and trails the caret on the live block.
//   streaming  boolean — append <AICaret/> to the tail of the last block
//   as         string  — wrapper tag (default 'div')
const Prose = ({
  streaming = false,
  as: Tag = 'div',
  className,
  children,
  ...rest
}: {
  streaming?: boolean;
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
  [x: string]: any;
}) => (
  <Tag
    className={'ai-prose' + (className ? ' ' + className : '')}
    {...(streaming ? { 'aria-live': 'polite', 'aria-busy': true } : {})}
    {...rest}
  >
    {streaming ? withStreamingCaret(children) : children}
  </Tag>
);

// ── ProseCode — a code block INSIDE .ai-prose ─────────────────────────────
// The prose-scoped code block (mono header + copy + body). For a standalone,
// documented code block outside prose, use the core <CodeBlock/> primitive.
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

export { AICaret, injectCaret, withStreamingCaret, Prose, ProseCode };
