import * as React from 'react';
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

const ArtifactWidget = ({
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

export { ArtifactWidget };
