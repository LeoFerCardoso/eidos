'use client';
import * as React from 'react';
import {
  Icons, Frame, Section, SubHead, Lede, Mono,
  TabbedCode, AutoPropsTable, installTabs,
  AlertDialog,
} from '@/ds/core';

// ── Usage code ────────────────────────────────────────────────────────────────

const USAGE_CODE = `import { AlertDialog } from "@eidos/ui";

export function Demo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button className="btn destructive" onClick={() => setOpen(true)}>
        Delete service
      </button>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        variant="danger"
        title="Delete forge-api?"
        description="This permanently removes the service and all linked runbooks. There is no undo."
        cancelLabel="Cancel"
        confirmLabel="Delete service"
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          // perform delete…
          setOpen(false);
        }}
      />
    </>
  );
}`;

const VARIANT_CODE = `{/* warning — discard / leave */}
<AlertDialog
  variant="warning"
  title="Discard unsaved changes?"
  description="You have edits that will be lost."
  cancelLabel="Keep editing"
  confirmLabel="Discard"
  {/* …open/onOpenChange */}
/>

{/* danger — delete / revoke */}
<AlertDialog
  variant="danger"
  title="Delete forge-api?"
  description="4 runbooks and 12 deploys will also be removed. There is no undo."
  cancelLabel="Cancel"
  confirmLabel="Delete service"
  {/* …open/onOpenChange */}
/>

{/* info — required confirmation */}
<AlertDialog
  variant="info"
  title="Restart required"
  description="The new preset needs a dev-server restart."
  cancelLabel="Later"
  confirmLabel="Restart now"
  {/* …open/onOpenChange */}
/>`;

const RTL_CODE = `<div dir="rtl">
  <AlertDialog
    open={open}
    onOpenChange={setOpen}
    variant="danger"
    title="حذف forge-api؟"
    description="سيؤدي هذا إلى إزالة الخدمة بشكل دائم. لا يمكن التراجع."
    cancelLabel="إلغاء"
    confirmLabel="حذف الخدمة"
    onCancel={() => setOpen(false)}
    onConfirm={() => setOpen(false)}
  />
</div>`;

// ── Inline showcase (no overlay) — used in anatomy + variants display ─────────
const InlinePanel = ({
  variant = 'warning' as 'warning' | 'danger' | 'info',
  title,
  desc,
  cancel = 'Cancel',
  confirm,
}: {
  variant?: 'warning' | 'danger' | 'info';
  title: string;
  desc: string;
  cancel?: string;
  confirm: string;
}) => {
  const icon =
    variant === 'info'
      ? <Icons.info size={18} />
      : <Icons.alert size={18} />;
  const confirmClass = variant === 'danger' ? 'btn destructive' : 'btn ember';

  return (
    <div className={`adlg ${variant}`} style={{ boxShadow: 'none' }}>
      <div className="adlg-header">
        <span className="adlg-icon" aria-hidden="true">{icon}</span>
        <div className="adlg-copy">
          <h3 className="adlg-title">{title}</h3>
          <p className="adlg-desc">{desc}</p>
        </div>
      </div>
      <div className="adlg-actions">
        <button className="btn ghost">{cancel}</button>
        <button className={confirmClass}>{confirm}</button>
      </div>
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Page() {
  const [openDanger, setOpenDanger] = React.useState(false);
  const [openWarning, setOpenWarning] = React.useState(false);
  const [openInfo, setOpenInfo] = React.useState(false);

  return (
    <Section
      id="alert-dialog"
      num="17"
      title="Alert Dialog"
      desc="A blocking modal that demands an explicit answer — no X, no scrim click. Reserve for irreversible or high-stakes actions; anything recoverable uses a Modal, Alert, or Toast."
    >
      {/* ── 1. INSTALLATION ───────────────────────────────────────────────── */}
      <SubHead meta="package managers">Installation</SubHead>
      <Lede up>
        <Mono>Escape</Mono> triggers the Cancel (safe) action by default — the dialog never closes silently.
      </Lede>
      <TabbedCode tabs={installTabs('alert-dialog')} ariaLabel="package manager" />
      <Lede>
        The CLI copies <Mono>alert-dialog.tsx</Mono> and its CSS into your repo — no black-box dependency. Pick the <em>Manual</em> tab to paste the source files by hand.
      </Lede>

      {/* ── 2. USAGE ──────────────────────────────────────────────────────── */}
      <SubHead meta="hello world">Usage</SubHead>
      <Lede up>
        Every dismissal of an <Mono>AlertDialog</Mono> is intentional — no X button, no scrim click. <Mono>Escape</Mono> triggers the Cancel (safe) action by default. Use a <Mono>Modal</Mono> for anything the user can safely cancel.
      </Lede>
      <Frame label="basic · opens in a real portal overlay" code={USAGE_CODE}>
        <button className="btn destructive" onClick={() => setOpenDanger(true)}>
          <Icons.trash size={14} /> Delete service
        </button>
        <AlertDialog
          open={openDanger}
          onOpenChange={setOpenDanger}
          variant="danger"
          title="Delete forge-api?"
          description="This permanently removes the service, its deploy history, and 4 linked runbooks. There is no undo."
          cancelLabel="Cancel"
          confirmLabel="Delete service"
          onCancel={() => setOpenDanger(false)}
          onConfirm={() => setOpenDanger(false)}
        />
      </Frame>

      {/* ── 3. VARIANTS ───────────────────────────────────────────────────── */}

      {/* divider eyebrow */}
      <div style={{
        marginTop: 36, marginBottom: 6,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--fg-faint)',
        }}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      <SubHead meta="3 variants">Variants</SubHead>
      <Lede up>
        Three semantic tones — <Mono>warning</Mono>, <Mono>danger</Mono>, and <Mono>info</Mono>. The <Mono>danger</Mono> confirm button is rendered destructive (dark ink on red fill). Inline previews shown below; click the triggers above to see them live.
      </Lede>
      <Frame
        label="warning · danger · info — shown inline; live triggers above"
        code={VARIANT_CODE}
      >
        <div style={{ display: 'grid', gap: 16, width: '100%', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
          <div className="adlg-stage">
            <InlinePanel
              variant="warning"
              title="Discard unsaved changes?"
              desc="You have edits to forge-api that will be lost if you close this tab now."
              cancel="Keep editing"
              confirm="Discard"
            />
          </div>
          <div className="adlg-stage">
            <InlinePanel
              variant="danger"
              title="Delete forge-api?"
              desc="This permanently removes the service, its deploy history, and 4 linked runbooks. There is no undo."
              cancel="Cancel"
              confirm="Delete service"
            />
          </div>
          <div className="adlg-stage">
            <InlinePanel
              variant="info"
              title="Restart required"
              desc="The new Tailwind preset needs a dev-server restart to pick up the changes."
              cancel="Later"
              confirm="Restart now"
            />
          </div>
        </div>
      </Frame>

      {/* ── 4. IN CONTEXT ─────────────────────────────────────────────────── */}
      <SubHead meta="real surface">In context</SubHead>
      <Lede up>
        An alert dialog always emerges from a user action — a delete button, a revoke link, a destructive menu item. The trigger should use <Mono>.btn.destructive</Mono> so the severity is signalled before the dialog appears.
      </Lede>
      <Frame
        label="destructive trigger · warning trigger · info trigger"
        row
        code={`<button className="btn destructive" onClick={() => setOpen(true)}>
  <Icons.trash size={14} /> Delete
</button>

<button className="btn outline" onClick={() => setOpenWarning(true)}>
  Discard draft
</button>

<button className="btn ghost" onClick={() => setOpenInfo(true)}>
  Restart server
</button>`}
      >
        <button className="btn destructive" onClick={() => setOpenDanger(true)}>
          <Icons.trash size={14} /> Delete
        </button>
        <button className="btn outline" onClick={() => setOpenWarning(true)}>
          Discard draft
        </button>
        <button className="btn ghost" onClick={() => setOpenInfo(true)}>
          Restart server
        </button>

        <AlertDialog
          open={openWarning}
          onOpenChange={setOpenWarning}
          variant="warning"
          title="Discard draft?"
          description="Your draft will be lost. You can start over but cannot recover this version."
          cancelLabel="Keep editing"
          confirmLabel="Discard"
          onCancel={() => setOpenWarning(false)}
          onConfirm={() => setOpenWarning(false)}
        />
        <AlertDialog
          open={openInfo}
          onOpenChange={setOpenInfo}
          variant="info"
          title="Restart dev server?"
          description="The new preset requires a restart to take effect. Active connections will be dropped."
          cancelLabel="Later"
          confirmLabel="Restart now"
          onCancel={() => setOpenInfo(false)}
          onConfirm={() => setOpenInfo(false)}
        />
      </Frame>

      {/* ── 5. ACCESSIBILITY ──────────────────────────────────────────────── */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            On open, focus lands on the Cancel button (the safe action) and is trapped inside the panel — <Mono>Tab</Mono> and <Mono>Shift+Tab</Mono> cycle only between Cancel and the primary action. <Mono>Escape</Mono> triggers the Cancel action (the safe path) by default; callers can override via <Mono>onEscapeKeyDown</Mono>. On close, focus returns to the trigger that opened the dialog.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The panel uses <Mono>role="alertdialog"</Mono> with <Mono>aria-modal="true"</Mono>, <Mono>aria-labelledby</Mono> on the title, and <Mono>aria-describedby</Mono> on the description. Screen readers announce the question and consequence together and treat the rest of the page as inert.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus &amp; contrast</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            Both buttons show the ember focus ring (<Mono>--ring</Mono>) against the elevated panel. The danger confirm carries dark ink on its fill; the warning confirm uses dark ink on ember. The variant icon tile sits on a tinted soft background — severity is encoded by icon and copy, not colour alone.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The scrim fades and the panel rises via <Mono>adlg-fade</Mono>/<Mono>adlg-rise</Mono> using <Mono>--dur</Mono>/<Mono>--ease</Mono>. Under <Mono>prefers-reduced-motion: reduce</Mono> the component-scoped guard on <Mono>.adlg-overlay</Mono> and <Mono>.adlg</Mono> in <Mono>ds.css</Mono> collapses these animations to instant, so the dialog appears immediately with no rise or blur sweep.
          </div>
        </div>
      </div>

      {/* ── 6. RTL ────────────────────────────────────────────────────────── */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label='dir="rtl" — Cancel still leads (right), primary on the trailing edge (left)'
        code={RTL_CODE}
      >
        <div dir="rtl" style={{ display: 'grid', gap: 16, width: '100%', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
          <div className="adlg-stage">
            <InlinePanel
              variant="danger"
              title="حذف forge-api؟"
              desc="سيؤدي هذا إلى إزالة الخدمة بشكل دائم، وتاريخ النشر، و٤ كتب تشغيل مرتبطة. لا يمكن التراجع."
              cancel="إلغاء"
              confirm="حذف الخدمة"
            />
          </div>
        </div>
      </Frame>
      <Lede>
        The action row's <Mono>justify-content: flex-end</Mono> mirrors automatically in RTL — Cancel lands on the right (the reading start) and the primary action stays at the trailing edge (left). The icon tile follows the logical start side. No explicit RTL overrides needed.
      </Lede>

      {/* ── Decision matrix ───────────────────────────────────────────────── */}
      <SubHead meta="when to use">Alert Dialog vs Modal vs Alert vs Toast</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Decision matrix</span></div>
        <table className="spec" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ padding: '10px 12px' }}>Use</th>
              <th>When</th>
              <th>Scrim closes</th>
              <th>Esc closes</th>
              <th>Has X</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="tok-name">Alert Dialog</td>
              <td>Irreversible / high-stakes. The user must answer.</td>
              <td className="mono">no</td>
              <td className="mono">no</td>
              <td className="mono">no</td>
            </tr>
            <tr>
              <td className="tok-name"><a href="/modal" style={{ color: 'var(--ember)' }}>Modal</a></td>
              <td>Self-contained flow — share, edit, attach, preview. Misclick is harmless.</td>
              <td className="mono">yes</td>
              <td className="mono">yes</td>
              <td className="mono">yes</td>
            </tr>
            <tr>
              <td className="tok-name">Alert (inline)</td>
              <td>State on the page itself, in context. No interrupt.</td>
              <td className="mono">—</td>
              <td className="mono">—</td>
              <td className="mono">—</td>
            </tr>
            <tr>
              <td className="tok-name">Toast</td>
              <td>Confirmation of a completed action — non-blocking, ephemeral.</td>
              <td className="mono">—</td>
              <td className="mono">—</td>
              <td className="mono">—</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── 7. ANATOMY ────────────────────────────────────────────────────── */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: 36 }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative' }} aria-hidden="true">
              <InlinePanel
                variant="warning"
                title="Discard unsaved changes?"
                desc="You have edits that will be lost."
                cancel="Keep editing"
                confirm="Discard"
              />
              {/* Pin connectors */}
              <span className="lead h" style={{ top: 28, insetInlineStart: -28, width: 24 }} />
              <span className="lead h" style={{ top: 28, insetInlineEnd: -28, width: 24 }} />
              <span className="lead h" style={{ top: 68, insetInlineEnd: -28, width: 24 }} />
              <span className="lead h" style={{ bottom: 22, insetInlineEnd: -28, width: 24 }} />
              <div className="pin" style={{ top: 20, insetInlineStart: -52 }}>1</div>
              <div className="pin" style={{ top: 20, insetInlineEnd: -52 }}>2</div>
              <div className="pin" style={{ top: 60, insetInlineEnd: -52 }}>3</div>
              <div className="pin" style={{ bottom: 14, insetInlineEnd: -52 }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '40px auto 0' }}>
            <span className="num">1</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Variant icon.</b> 18 px on a 36×36 tinted tile. Reinforces severity at a glance — warning, danger, or info.
            </span>
            <span className="num">2</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Title.</b> Geist 600, 15 px. A question or imperative. One line. Never generic ("Are you sure?") — always specific ("Delete forge-api?").
            </span>
            <span className="num">3</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Description.</b> 13 px muted. State the consequence and whether it is reversible. One short paragraph.
            </span>
            <span className="num">4</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Actions.</b> Cancel/secondary leads (initial focus), confirm trails. Confirm uses <Mono>.btn.destructive</Mono> for danger, <Mono>.btn.ember</Mono> otherwise.
            </span>
          </div>
        </div>
      </div>

      {/* ── 8. DO / DON'T ─────────────────────────────────────────────────── */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — name the consequence</div>
          <div className="body" style={{ padding: 14 }}>
            <InlinePanel
              variant="danger"
              title="Delete forge-api?"
              desc="4 runbooks and 12 deploys will also be removed. There is no undo."
              cancel="Cancel"
              confirm="Delete service"
            />
          </div>
          <div className="note">Specific subject + specific consequence. The user knows exactly what they are agreeing to.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — generic confirm</div>
          <div className="body" style={{ padding: 14 }}>
            <InlinePanel
              variant="warning"
              title="Are you sure?"
              desc="This action cannot be undone. Continue?"
              cancel="No"
              confirm="Yes"
            />
          </div>
          <div className="note">"Are you sure?" trains users to click through. Name the resource and what happens to it.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — safe action leads</div>
          <div className="body" style={{ padding: 14, justifyContent: 'flex-end', gap: 8 }}>
            <button className="btn ghost">Cancel</button>
            <button className="btn destructive">Delete</button>
          </div>
          <div className="note">Cancel always leads. Destructive sits on the trailing edge so muscle-memory clicks favour safety.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — every action is a dialog</div>
          <div className="body" style={{ padding: 14 }}>
            <InlinePanel
              variant="info"
              title="Settings saved"
              desc="Your changes have been saved. Click OK to dismiss."
              cancel=""
              confirm="OK"
            />
          </div>
          <div className="note">A successful save is not a decision — use a toast and let the user keep working.</div>
        </div>
      </div>

      {/* ── 9. API REFERENCE ──────────────────────────────────────────────── */}
      <SubHead meta="AlertDialogProps">API reference</SubHead>
      <AutoPropsTable component="AlertDialog" label="<AlertDialog />" />
    </Section>
  );
}
