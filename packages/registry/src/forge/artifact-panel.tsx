import * as React from 'react';
import { Drawer } from '@/components/forge/drawer';
import { Icons } from '@/components/forge/icons';

type ArtifactKind = 'document' | 'html' | 'app' | 'code';

interface ArtifactRef {
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

const KIND_META: Record<ArtifactKind, { icon: string; label: string }> = {
  document: { icon: 'doc',      label: 'Document' },
  html:     { icon: 'globe',    label: 'HTML page' },
  app:      { icon: 'rocket',   label: 'App' },
  code:     { icon: 'terminal', label: 'Code' },
};

const ArtifactPanel = ({
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

export { ArtifactPanel };
