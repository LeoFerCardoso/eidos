'use client';
// Eidos IDP — AI Chat · Conversation with Artifacts.
//
// Same chat surface as the active thread, but the assistant produced an
// artifact (in this case a runbook document) and the side panel is docked
// open with the artifact visible. The pattern: chat on the left shrinks
// to make room when the panel opens (Drawer in inline mode); reclaims
// the space on close.
//
// The chat thread shows the canonical pattern for surfacing an artifact:
//   1. <ArtifactWidget/> chip lands in the assistant bubble
//   2. clicking the chip opens the panel (already open here for the demo)
//   3. <ArtifactPanel/> renders the artifact body next to the conversation
import * as React from 'react';
import {
  Icons,
  PromptInput,
  Message, Response, MessageActions, Prose,
  ArtifactWidget, ArtifactPanel,
} from '@/ds/core';
import { ChatShell } from './chat-shell';

// ── The artifact — a Markdown-rendered runbook ──────────────────────────
const RUNBOOK = {
  id: 'rb-identity-aurora',
  kind: 'document' as const,
  title: 'Runbook: identity-svc → Aurora migration',
  meta: '5.4 KB · markdown',
  content: '',
};

// Rendered runbook body — a richer document than the default plain-text
// fallback. Lives inline as Prose so the artifact panel doesn't have to
// import react-markdown.
const RunbookBody = () => (
  <Prose>
    <h2>Runbook: identity-svc → Aurora migration</h2>
    <p>
      <strong>Owners:</strong> identity-platform · <strong>On-call:</strong>{' '}
      <code>identity-oncall</code> · <strong>Window:</strong> Sun 02:00–03:00 UTC
    </p>

    <h3>1 · Pre-flight</h3>
    <ul>
      <li>Confirm RPO ≤ 5 min in the catalog SLO panel</li>
      <li>Take a logical backup (<code>pg_dump --format=custom</code>) → S3</li>
      <li>Drain async queues — pause <code>identity-events</code> consumer</li>
      <li>Notify <code>#release</code> 30 min before window</li>
    </ul>

    <h3>2 · Cutover</h3>
    <ol>
      <li>Snapshot the source RDS instance</li>
      <li>Restore as an Aurora cluster from the snapshot</li>
      <li>Bring up writers in eu-west-1a and eu-west-1b</li>
      <li>Update <code>identity-svc</code> secret to point at the Aurora endpoint</li>
      <li>Trigger a rolling restart (max-surge 25%, ramp 60s per shard)</li>
    </ol>

    <h3>3 · Validation</h3>
    <ul>
      <li>Replica lag &lt; 200 ms across both AZs</li>
      <li>Pool saturation under 60% at p95</li>
      <li>Synthetic token issue + verify on canary cluster</li>
      <li>Compare <code>identity-events</code> consumer offset before / after</li>
    </ul>

    <blockquote>
      <strong>If any check fails, rollback.</strong> The rollback path is faster
      than the forward path during the maintenance window.
    </blockquote>

    <h3>4 · Rollback</h3>
    <ol>
      <li>Restore the original RDS endpoint in the secret</li>
      <li>Rolling restart (same surge / ramp as cutover)</li>
      <li>Resume <code>identity-events</code> consumer</li>
      <li>File a post-mortem within 24 h</li>
    </ol>

    <h3>5 · Post-deploy checklist</h3>
    <ul>
      <li>Update the catalog database card with the new Aurora identifier</li>
      <li>Bump the cost dashboard tag from <code>rds-prod</code> to <code>aurora-prod</code></li>
      <li>Archive the snapshot after 30 days</li>
    </ul>
  </Prose>
);

const App = () => {
  const [panelOpen, setPanelOpen] = React.useState(true);
  const [text, setText] = React.useState('');
  const [model, setModel] = React.useState('eidos-opus-4-7');

  return (
    <ChatShell
      side="recent"
      activeChat="breaker"
      crumbs={['Eidos', 'AI', 'Recents', 'Runbook draft — identity-svc']}
      // The artifact panel is the focal surface — when it's open, collapse
      // the chat-history sidebar to give the panel + conversation the full
      // horizontal room. Close the artifact and the sidebar comes back.
      sidebarCollapsed={panelOpen}
    >
      <div className="aica-shell">
        {/* Conversation column — shrinks when the panel opens */}
        <div className="aica-chat">
          <div className="msg-thread fluid">
            <Message
              from="user"
              meta={<><span className="t-mono-label">You</span> · 14:04</>}
            >
              Yes — draft the runbook. Include the rollback path and a section
              for the post-deploy validation checklist.
            </Message>

            <Message
              from="assistant"
              meta={
                <>
                  <span className="t-mono-label">Eidos AI</span> ·
                  <span style={{ color: 'var(--fg-faint)', marginInlineStart: 6 }}>Opus 4.7</span>
                  <span style={{ color: 'var(--fg-faint)', marginInlineStart: 6 }}>· 14:05</span>
                </>
              }
              actions={
                <MessageActions
                  surface="message"
                  onCopy={() => {}}
                  onRegen={() => {}}
                  vote={null}
                  onVote={() => {}}
                />
              }
            >
              <Response from="assistant">
                <p>
                  Drafted the runbook with a five-section structure (Pre-flight,
                  Cutover, Validation, Rollback, Post-deploy checklist). The
                  rollback path reuses the snapshot from step 1 and a re-pointed
                  connection secret, so the app rolls back without a code change.
                </p>
                <p>
                  Validation covers replica lag, pool saturation, a synthetic
                  identity-token issue, and the consumer offset for{' '}
                  <code>identity-events</code>.
                </p>
              </Response>

              <div style={{ marginTop: 12 }}>
                <ArtifactWidget
                  artifact={RUNBOOK}
                  onOpen={() => setPanelOpen(true)}
                />
              </div>
            </Message>

            <Message
              from="user"
              meta={<><span className="t-mono-label">You</span> · 14:07</>}
            >
              Looks good. Add a step for archiving the snapshot after 30 days,
              and let&apos;s move on to the on-call comms template.
            </Message>

            <Message
              from="assistant"
              meta={
                <>
                  <span className="t-mono-label">Eidos AI</span> ·
                  <span style={{ color: 'var(--ember)', marginInlineStart: 6 }}>updating runbook…</span>
                </>
              }
            >
              <Prose>
                <p>
                  Added the archival step to the Post-deploy checklist and bumped
                  the version meta. The on-call comms template will reuse the same
                  Slack thread format we use for the Pix tribe — want it as a
                  separate artifact?
                </p>
              </Prose>
            </Message>
          </div>

          {/* Docked composer */}
          <div className="aica-foot">
            <PromptInput
              status="ready"
              value={text}
              onChange={setText}
              onSubmit={() => setText('')}
              modelValue={model}
              onModelChange={setModel}
              placeholder="Reply…"
              actions={[
                { id: 'upload', icon: 'upload',   label: 'Upload images or files' },
                { id: 'search', icon: 'search',   label: 'Deep search' },
                { id: 'tools',  icon: 'terminal', label: 'Run a tool' },
              ]}
              footerHint={<>AI can make mistakes — please double-check important answers.</>}
            />
          </div>
        </div>

        {/* Artifact side panel — Drawer in inline mode, docked on the right */}
        <ArtifactPanel
          artifact={RUNBOOK}
          open={panelOpen}
          onClose={() => setPanelOpen(false)}
          side="right"
          width={520}
          // ↑ This is the MIN width when the viewport is tight — the
          //   .aica-shell > .dr-root override below makes the panel
          //   flex-grow into whatever space is left over after the chat's
          //   fixed mobile-width column. So on a wide screen the panel
          //   eats most of the room and the chat stays mobile-sized.
          actions={
            <>
              <button className="btn xs outline" title="Copy"><Icons.copy size={12}/> Copy</button>
              <button className="btn xs outline" title="Download"><Icons.download size={12}/></button>
              <button className="btn xs outline" title="Share"><Icons.share size={12}/></button>
            </>
          }
        >
          <RunbookBody/>
        </ArtifactPanel>

        {/* Reopen affordance when the panel is closed — pinned to the
            trailing edge so the user can pivot back without scrolling. */}
        {!panelOpen && (
          <button
            type="button"
            className="aica-reopen"
            onClick={() => setPanelOpen(true)}
            title="Open runbook artifact"
          >
            <Icons.doc size={13}/>
            <span>Runbook</span>
          </button>
        )}
      </div>

      <style>{`
        .aica-shell {
          display: flex;
          flex-direction: row;
          min-block-size: 100%;
          position: relative;
        }
        /* Chat + panel widths are driven by a SINGLE source — a CSS
           variable --chat-w that animates between 100% (panel closed) and
           520px (panel open). The chat uses --chat-w as its flex-basis;
           the panel uses flex: 1 1 0 so it claims whatever's left over.
           One width animation, two elements moving as a result — the
           classic technique: animate the cause, let the effect follow. */
        .aica-shell {
          --chat-w: 100%;
        }
        .aica-shell:has(.dr-root.variant-inline[data-state="open"]) {
          --chat-w: 520px;
        }
        .aica-chat {
          flex: 0 1 var(--chat-w);
          min-inline-size: 0;
          display: flex;
          flex-direction: column;
          transition: flex-basis 280ms cubic-bezier(0.32, 0.72, 0, 1);
        }
        /* Artifact panel — pure flex-grow distribution from a 0px basis.
           When the chat is at 100% (closed), there's no remaining space
           so the panel is 0. When the chat shrinks to 520px (open), the
           panel grows to fill the rest. The Drawer's native inline-size
           transition is disabled here because flex-basis: 0 overrides it;
           the panel's width is driven entirely by the chat's flex-basis
           animation. Single source of truth = single fluid motion. */
        .aica-shell > .dr-root.variant-inline {
          flex: 1 1 0;
          inline-size: auto;
          transition: none;
        }
        .aica-shell > .dr-root.variant-inline .dr {
          inline-size: 100%;
        }
        .aica-chat > .msg-thread {
          flex: 1 1 auto;
          inline-size: 100%;
          max-inline-size: 820px;
          margin-inline: auto;
          padding: 24px 24px 20px;
        }
        /* When the artifact panel is open the chat column shrinks to 400px;
           the thread inside must drop to the smaller padding so its bubbles
           don't get squeezed against the panel. */
        .aica-shell:has(.dr-root.variant-inline[data-state="open"]) .aica-chat > .msg-thread {
          max-inline-size: none;
          padding: 24px 18px 20px;
        }

        /* Artifact prose font — normalize to the main chat's editorial
           size + line-height so the runbook and the conversation feel
           like one document, not two. Without this override the .ai-prose
           default (15px / 1.65) reads visibly larger than the body text
           the chat side renders. */
        .aica-shell .dr-body .ai-prose {
          font-size: 13.5px;
          line-height: 1.6;
        }
        .aica-shell .dr-body .ai-prose h2 { font-size: 19px; }
        .aica-shell .dr-body .ai-prose h3 { font-size: 15px; }

        .aica-foot {
          position: sticky;
          inset-block-end: 0;
          inline-size: 100%;
          padding: 12px 14px 16px;
          background: var(--bg);
          display: flex; justify-content: center;
        }
        .aica-foot::before {
          content: '';
          position: absolute;
          inset-inline: 0;
          inset-block-end: 100%;
          block-size: 28px;
          background: linear-gradient(to top, var(--bg) 0%, transparent 100%);
          pointer-events: none;
        }
        .aica-foot > .pi-shell { max-inline-size: 760px; inline-size: 100%; }
        .aica-shell:has(.dr-root.variant-inline[data-state="open"]) .aica-foot > .pi-shell { max-inline-size: none; }

        /* Reopen pill — small ember-soft FAB on the trailing edge when the
           artifact panel is closed. Clicking it re-opens the docked panel. */
        .aica-reopen {
          position: absolute;
          inset-block-start: 22px;
          inset-inline-end: 24px;
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 10px;
          background: var(--ember-soft);
          color: var(--ember);
          border: 1px solid color-mix(in oklab, var(--ember) 25%, transparent);
          border-radius: 999px;
          font: 600 12px/1 var(--font-sans);
          cursor: pointer;
          transition: background var(--dur-fast) var(--ease);
        }
        .aica-reopen:hover { background: color-mix(in oklab, var(--ember) 25%, transparent); }
        .aica-reopen svg { color: var(--ember); }

        @media (max-width: 1080px) {
          .aica-shell { flex-direction: column; }
          .aica-reopen { inset-block-start: auto; inset-block-end: 92px; }
        }
      `}</style>
    </ChatShell>
  );
};

export default App;
