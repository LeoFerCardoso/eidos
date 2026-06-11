'use client';
// Forge · Architecture / Diagram detail (/portal/architecture/[id]).
//
// Opened when a diagram card is clicked. Three states:
//   1. Inline-rendered diagram (hasView) — e.g. "Credit consultation, end to end"
//      renders the live C4 container view.
//   2. External (LucidChart) — shows an interstitial; the open action warns the
//      user (AlertDialog) before leaving Forge for the external tool.
//   3. Source-only stub — the diagram exists in a source format we don't render
//      inline yet; offer to open it in its editor.
import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Icons, Pill, Button, AlertDialog,
} from '@/ds/core';
import { usePageCrumb } from '@/portal/shell/portal-shell';
import { getDiagram, DIAGRAM_ICON, type Diagram } from '@/portal/data/architecture-records';
import CreditSolutionDiagram from '@/portal/architecture/credit-solution-diagram';

function MetaItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="fp-diagram-meta-item">
      <span className="k">{label}</span>
      <span className="v">{value}</span>
    </div>
  );
}

export default function DiagramDetail({ id }: { id: string }) {
  const router = useRouter();
  const { setCrumb } = usePageCrumb();
  const diagram = getDiagram(id);
  const [leaving, setLeaving] = React.useState(false);

  React.useEffect(() => {
    if (diagram) setCrumb({ label: diagram.title, replace: true });
    return () => setCrumb(null);
  }, [diagram, setCrumb]);

  if (!diagram) {
    return (
      <div className="fp-diagram">
        <Link href="/portal/architecture" className="fp-diagram-back">
          <Icons.chevronLeft size={14} /> Back to Architecture
        </Link>
        <div className="fp-diagram-empty">
          <span className="ic"><Icons.alert size={20} /></span>
          <p>No diagram matches <span className="mono">{id}</span>.</p>
        </div>
      </div>
    );
  }

  const TypeIcon =
    (Icons as Record<string, React.FC<{ size?: number }>>)[DIAGRAM_ICON[diagram.type]] ?? Icons.layers;

  return (
    <div className="fp-diagram">
      <Link href="/portal/architecture" className="fp-diagram-back">
        <Icons.chevronLeft size={14} /> Back to Architecture
      </Link>

      <header className="fp-diagram-head">
        <span className="fp-diagram-ic" aria-hidden="true"><TypeIcon size={20} /></span>
        <div className="fp-diagram-head-tx">
          <div className="fp-diagram-titlerow">
            <h1 className="fp-diagram-title">{diagram.title}</h1>
            <Pill tone="neutral">{diagram.type}</Pill>
            {diagram.external && (
              <Pill tone="ice">
                <Icons.externalLink size={11} /> {diagram.external.provider}
              </Pill>
            )}
          </div>
          <div className="fp-diagram-meta">
            <MetaItem label="Scope" value={diagram.scope} />
            <MetaItem label="Format" value={diagram.format} />
            <MetaItem label="Owner" value={diagram.owner} />
            <MetaItem label="Updated" value={diagram.updated} />
          </div>
        </div>
        <div className="fp-diagram-head-actions">
          {diagram.external ? (
            <Button variant="ember" onClick={() => setLeaving(true)}>
              <Icons.externalLink size={13} /> Open in {diagram.external.provider}
            </Button>
          ) : (
            <Button variant="ghost"><Icons.download size={13} /> Export</Button>
          )}
        </div>
      </header>

      <DiagramBody diagram={diagram} onOpenExternal={() => setLeaving(true)} />

      {/* Leaving-Forge warning — only reachable for external (LucidChart) diagrams. */}
      {diagram.external && (
        <AlertDialog
          open={leaving}
          onOpenChange={(o) => !o && setLeaving(false)}
          variant="info"
          title={`Open this diagram in ${diagram.external.provider}?`}
          description={`"${diagram.title}" is hosted in ${diagram.external.provider}, outside Forge. The link opens in a new tab and is not governed by Forge access controls.`}
          cancelLabel="Stay in Forge"
          confirmLabel={`Open in ${diagram.external.provider}`}
          onConfirm={() => {
            window.open(diagram.external!.url, '_blank', 'noopener,noreferrer');
            setLeaving(false);
          }}
        />
      )}
    </div>
  );
}

function DiagramBody({ diagram, onOpenExternal }: { diagram: Diagram; onOpenExternal: () => void }) {
  // 1 · Inline-rendered diagram.
  if (diagram.hasView && diagram.id === 'd-credit-solution') {
    return <CreditSolutionDiagram />;
  }

  // 2 · External (LucidChart) — interstitial with the warning-gated open action.
  if (diagram.external) {
    return (
      <div className="fp-diagram-ext">
        <span className="fp-diagram-ext-ic" aria-hidden="true"><Icons.externalLink size={26} /></span>
        <h2>Hosted in {diagram.external.provider}</h2>
        <p>
          This diagram is maintained in {diagram.external.provider}, outside the Forge portal.
          Opening it leaves Forge and continues in a new browser tab.
        </p>
        <Button variant="ember" onClick={onOpenExternal}>
          <Icons.externalLink size={13} /> Open in {diagram.external.provider}
        </Button>
        <span className="fp-diagram-ext-url mono">{diagram.external.url}</span>
      </div>
    );
  }

  // 3 · Source-only stub (a format we don't render inline yet).
  return (
    <div className="fp-diagram-ext">
      <span className="fp-diagram-ext-ic" aria-hidden="true"><Icons.layers size={26} /></span>
      <h2>Inline preview not available yet</h2>
      <p>
        This {diagram.type.toLowerCase()} diagram is authored in {diagram.format}. An inline
        renderer for {diagram.format} sources is on the roadmap, open it in its editor for now.
      </p>
      <Button variant="outline"><Icons.maximize size={13} /> Open in {diagram.format} editor</Button>
    </div>
  );
}
