import * as React from 'react';
// Eidos AI — Artifact.
//
// An "artifact" is a self-contained thing the model produced that has its
// own life outside the chat turn — a document, an HTML preview, a code
// file, an app/iframe. We surface it twice:
//
//   • <ArtifactWidget/> — a compact chip in the chat that names the
//     artifact, hints at its kind, and acts as the entry point to the
//     side panel.
//   • <ArtifactPanel/> — wraps the core <Drawer variant="inline"/> so it
//     DOCKS into the host layout (the chat shrinks to make room when the
//     panel opens; reclaims the space when it closes). Header carries
//     title + kind + actions + close; the body renders the artifact by
//     kind, or accepts a `children` / `tabs` override.
//
// Flat: no nested boxes. Widget = clean inline card with a hairline border.
// Panel = inherits Drawer chrome (header / body / footer) — no outer card.
import { Icons } from '../icons';
import { Drawer } from '../drawer';

// ── Types ─────────────────────────────────────────────────────────────────
export type ArtifactKind = 'document' | 'html' | 'app' | 'code';

export interface ArtifactRef {
  id: string;
  kind: ArtifactKind;
  title: string;
  /** Short subtitle / meta (e.g. "12 KB · markdown", "342 lines"). */
  meta?: string;
  /** Language id for code artifacts ("ts", "py", …). */
  lang?: string;
  /** Inline content; consumers can also handle rendering themselves. */
  content?: string;
  /** Pre-rendered HTML for kind="html" (consumer is responsible for sanitizing). */
  html?: string;
}

// Icon + casing per kind. Uses icons that exist in core/icons.tsx today.
const KIND_META: Record<ArtifactKind, { icon: string; label: string }> = {
  document: { icon: 'doc',      label: 'Document' },
  html:     { icon: 'globe',    label: 'HTML page' },
  app:      { icon: 'rocket',   label: 'App' },
  code:     { icon: 'terminal', label: 'Code' },
};

// ── ArtifactWidget ────────────────────────────────────────────────────────
// The chip that lands in a Message bubble. Click → open the side panel.
//   artifact   ArtifactRef
//   onOpen     () => void
//   className  passthrough
export const ArtifactWidget = ({
  artifact, onOpen, className,
}: { artifact: ArtifactRef; onOpen?: () => void; className?: string }) => {
  const meta = KIND_META[artifact.kind] || KIND_META.document;
  const Ico = (Icons as Record<string, any>)[meta.icon as string] || Icons.file;
  return (
    <button
      type="button"
      className={'ai-art-widget' + (className ? ' ' + className : '')}
      onClick={onOpen}
      aria-label={`Open ${meta.label.toLowerCase()}: ${artifact.title}`}
    >
      <span className="ai-art-widget-ico"><Ico size={16}/></span>
      <span className="ai-art-widget-text">
        <span className="ai-art-widget-title">{artifact.title}</span>
        <span className="ai-art-widget-meta">
          {meta.label}{artifact.meta ? <> · {artifact.meta}</> : null}
        </span>
      </span>
      <span className="ai-art-widget-action"><Icons.externalLink size={13}/></span>
    </button>
  );
};

// ── ArtifactPanel ─────────────────────────────────────────────────────────
// Wraps the core <Drawer/> in `inline` mode so it DOCKS into the host
// layout. Header carries the kind icon + title + meta + actions + close;
// body renders the artifact by kind, OR `children` (override), OR a tab
// strip with multiple views.
//   artifact   ArtifactRef
//   open       boolean
//   onClose    () => void
//   side       "right" (default) | "left"
//   actions    ReactNode — extra controls in the header (download / share)
//   tabs       optional tab spec — [{ id, label, content }]
//   children   when no tabs, override the body content
//   width      panel width in px (default 460)
export const ArtifactPanel = ({
  artifact, open = true, onClose,
  side = 'right',
  actions, tabs, children,
  width = 460,
  className,
}: {
  artifact: ArtifactRef;
  open?: boolean;
  onClose?: () => void;
  side?: 'left' | 'right';
  actions?: React.ReactNode;
  tabs?: { id: string; label: string; content: React.ReactNode }[];
  children?: React.ReactNode;
  width?: number;
  className?: string;
}) => {
  const meta = KIND_META[artifact.kind] || KIND_META.document;
  const Ico = (Icons as Record<string, any>)[meta.icon as string] || Icons.file;
  const [tabId, setTabId] = React.useState(tabs?.[0]?.id);

  const body = children
    ?? (tabs ? tabs.find(t => t.id === tabId)?.content : renderDefault(artifact));

  // Drawer's `title` is a ReactNode — we pack icon + title + meta + actions
  // into a single row that the Drawer header lays out next to its close.
  const titleNode = (
    <div className="ai-art-panel-title-row">
      <span className="ai-art-panel-ico"><Ico size={14}/></span>
      <div className="ai-art-panel-text">
        <span className="ai-art-panel-title">{artifact.title}</span>
        <span className="ai-art-panel-meta">
          {meta.label}{artifact.meta ? <> · {artifact.meta}</> : null}
        </span>
      </div>
      {actions && <div className="ai-art-panel-actions">{actions}</div>}
    </div>
  );

  return (
    <Drawer
      variant="inline"
      side={side}
      open={open}
      onClose={onClose}
      title={titleNode}
      className={'ai-art-panel' + (className ? ' ' + className : '')}
      style={{ ['--dr-w' as any]: width + 'px' }}
    >
      {tabs && tabs.length > 1 && (
        <div className="ai-art-panel-tabs" role="tablist">
          {tabs.map(t => (
            <button
              key={t.id} type="button" role="tab"
              aria-selected={t.id === tabId}
              className={'ai-art-panel-tab' + (t.id === tabId ? ' is-active' : '')}
              onClick={() => setTabId(t.id)}
            >{t.label}</button>
          ))}
        </div>
      )}
      <div className="ai-art-panel-body">{body}</div>
    </Drawer>
  );
};

// Default content rendering when no children/tabs are passed — best-effort
// fallback by kind.
function renderDefault(a: ArtifactRef): React.ReactNode {
  if (a.kind === 'document') {
    return (
      <div className="ai-art-doc">
        {a.content
          ? a.content.split(/\n\n+/).map((para, i) => <p key={i}>{para}</p>)
          : <p className="ai-art-empty">No content.</p>}
      </div>
    );
  }
  if (a.kind === 'html' && a.html) {
    return <div className="ai-art-html" dangerouslySetInnerHTML={{ __html: a.html }}/>;
  }
  if (a.kind === 'app') {
    return (
      <div className="ai-art-app-fallback">
        <Icons.rocket size={22}/>
        <p>App preview goes here — pass <code>children</code> with your iframe or live mount.</p>
      </div>
    );
  }
  if (a.kind === 'code') {
    return (
      <pre className="ai-art-code"><code>{a.content || '// empty'}</code></pre>
    );
  }
  return null;
}
