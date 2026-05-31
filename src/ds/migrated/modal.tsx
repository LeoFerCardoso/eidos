'use client';
import * as React from 'react';
import {
  Icons, Frame, Section, SubHead, ComponentInstall, AutoPropsTable,
  Lede, Mono, Modal, type ModalProps,
} from '@/ds/core';

type ModalSize = NonNullable<ModalProps['size']>;

// ── Code snippets ────────────────────────────────────────────────────────────

const USAGE_CODE = `import { useState } from "react"
import { Modal } from "@/components/forge/modal"
import { Button } from "@/components/forge/button"

export function Demo() {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <Button variant="ember" onClick={() => setOpen(true)}>Rename service</Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Rename service"
        desc="Give it a memorable handle. You can change this later."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="ember" onClick={() => setOpen(false)}>Save</Button>
          </>
        }
      >
        <div className="mdl-field">
          <label className="mdl-label" htmlFor="svc-name">Service name</label>
          <input id="svc-name" defaultValue="forge-api" />
        </div>
      </Modal>
    </>
  )
}`;

const HERO_CODE = `<Modal
  open={open}
  onOpenChange={setOpen}
  size="lg"
  hero={<div className="mdl-hero" />}
  title="Eidos 2026.06"
  desc="Cache Components, AI Gateway routing, and a faster Build Command."
  footer={…}
>
  …
</Modal>`;

const SCROLL_CODE = `<Modal
  open={open}
  onOpenChange={setOpen}
  title="Acceptable use"
  desc="Last updated 03 May 2026."
  footer={…}
>
  {/* Long body — mdl-body uses overflow-y: auto; header/footer stay pinned */}
  <p>… paragraph one …</p>
  <p>… paragraph two …</p>
</Modal>`;

const SIZE_CODE = `<Modal size="sm" …/>  {/* 380 px — quick choices, single field */}
<Modal size="md" …/>  {/* 480 px — default */}
<Modal size="lg" …/>  {/* 640 px — multi-field forms, side-by-side previews */}
<Modal size="xl" …/>  {/* 820 px — long-form previews, embedded editors */}`;

const RTL_CODE = `<div dir="rtl">
  <Modal
    open={open}
    onOpenChange={setOpen}
    title="مشاركة forge-api"
    footer={…}
  >
    …
  </Modal>
</div>`;

// ── Static panel for the Anatomy section (no portal, no animation) ───────────
// Non-interactive snapshot of the panel parts so pins can target fixed points.
const StaticPanel = () => (
  <div className="mdl-static" aria-hidden="true">
    <div className="mdl-header">
      <div className="mdl-titles">
        <h2 className="mdl-title">Share forge-api</h2>
        <p className="mdl-desc">Anyone with the link can view the service overview and recent deploys.</p>
      </div>
      <button className="mdl-close" type="button" tabIndex={-1} aria-hidden="true">
        <Icons.x size={16} />
      </button>
    </div>
    <div className="mdl-body">
      <div className="mdl-field">
        <span className="mdl-label">Link</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <input readOnly value="https://forge.acme.io/s/identity-svc" />
          <button className="btn ghost sm" tabIndex={-1} type="button">
            <Icons.copy size={12} /> Copy
          </button>
        </div>
      </div>
    </div>
    <div className="mdl-footer">
      <button className="btn ghost" tabIndex={-1} type="button">Cancel</button>
      <button className="btn ember" tabIndex={-1} type="button">Share link</button>
    </div>
  </div>
);

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  const [openBasic, setOpenBasic] = React.useState(false);
  const [openShare, setOpenShare] = React.useState(false);
  const [openLong, setOpenLong] = React.useState(false);
  const [openHero, setOpenHero] = React.useState(false);
  const [openSize, setOpenSize] = React.useState<ModalSize | false>(false);
  const [openRtl, setOpenRtl] = React.useState(false);

  return (
    <Section
      id="modal"
      title="Modal"
      desc="Centered surface for self-contained flows — dialogs, quick edits, attachments, previews. Forgiving by design: the X, Escape, and the scrim all close it."
    >
      {/* 1. INSTALLATION ─────────────────────────────────────────────────── */}
      <ComponentInstall slug="modal" />
      <Lede>
        Eidos's Modal handles the focus trap, scroll lock, and portal for you — plain React
        over the Eidos CSS layer, no Radix runtime. The CLI copies <Mono>modal.tsx</Mono> into
        your repo. Pick the <em>Manual</em> tab to paste the source files yourself.
      </Lede>

      {/* 2. USAGE ────────────────────────────────────────────────────────── */}
      <SubHead meta="hello world">Usage</SubHead>
      <Lede>
        For irreversible decisions that demand an explicit answer, reach for an Alert Dialog
        instead — it removes the X, Escape, and scrim-click escape routes.
      </Lede>
      <Frame label="basic" code={USAGE_CODE}>
        <div className="mdl-trigger-row">
          <button className="btn ember" onClick={() => setOpenBasic(true)}>Rename service</button>
        </div>
        <Modal
          open={openBasic}
          onOpenChange={setOpenBasic}
          title="Rename service"
          desc="Give it a memorable handle. You can change this later."
          footer={
            <>
              <button className="btn ghost" onClick={() => setOpenBasic(false)}>Cancel</button>
              <button className="btn ember" onClick={() => setOpenBasic(false)}>Save</button>
            </>
          }
        >
          <div className="mdl-field">
            <label className="mdl-label" htmlFor="mdl-rename">Service name</label>
            <input id="mdl-rename" defaultValue="forge-api" />
          </div>
        </Modal>
      </Frame>

      {/* ── Examples divider ───────────────────────────────────────────────── */}
      <div className="ds-examples-rule" style={{ marginBlockStart: 36, marginBlockEnd: 6 }}>
        <span className="t-mono-label">Examples</span>
        <span className="divider" style={{ flex: 1 }} />
      </div>

      {/* ── Modal with form ─────────────────────────────────────────────── */}
      <SubHead meta="form">Modal with a form</SubHead>
      <Frame
        label="self-contained submission — no full-page route"
        code={`<Modal
  open={open}
  onOpenChange={setOpen}
  size="md"
  title="Share forge-api"
  desc="Anyone with the link can view the overview."
  footer={…}
>
  <div className="mdl-field">…</div>
</Modal>`}
      >
        <div className="mdl-trigger-row">
          <button className="btn" onClick={() => setOpenShare(true)}>
            <Icons.share size={14} /> Share
          </button>
        </div>
        <Modal
          open={openShare}
          onOpenChange={setOpenShare}
          title="Share forge-api"
          desc="Anyone with the link can view the service overview and recent deploys."
          footer={
            <div className="mdl-footer split" style={{ padding: 0, background: 'transparent', border: 'none', width: '100%' }}>
              <span className="mdl-helper">Visible to <b style={{ color: 'var(--fg-muted)' }}>acme-workspace</b></span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn ghost" onClick={() => setOpenShare(false)}>Cancel</button>
                <button className="btn ember" onClick={() => setOpenShare(false)}>Send invite</button>
              </div>
            </div>
          }
        >
          <div className="mdl-field">
            <label className="mdl-label" htmlFor="mdl-share-email">Invite people</label>
            <input id="mdl-share-email" placeholder="leo@acme.io, dani@acme.io" />
          </div>
          <div className="mdl-field">
            <label className="mdl-label" htmlFor="mdl-share-role">Role</label>
            <select id="mdl-share-role" defaultValue="viewer">
              <option value="viewer">Viewer — read-only</option>
              <option value="editor">Editor — deploy &amp; configure</option>
              <option value="admin">Admin — manage members</option>
            </select>
          </div>
          <div className="mdl-field">
            <label className="mdl-label" htmlFor="mdl-share-note">Note (optional)</label>
            <textarea id="mdl-share-note" rows={3} placeholder="Heads up — this is the new identity service." />
          </div>
        </Modal>
      </Frame>
      <Lede>
        The form lives inside the modal so the user never loses page context. Keep it under
        five fields — anything longer belongs in a Drawer or a route.
      </Lede>

      {/* ── Long content / scrollable body ──────────────────────────────── */}
      <SubHead meta="scrollable">Long content</SubHead>
      <Frame label="body scrolls; header + footer stay pinned" code={SCROLL_CODE}>
        <div className="mdl-trigger-row">
          <button className="btn" onClick={() => setOpenLong(true)}>View terms</button>
        </div>
        <Modal
          open={openLong}
          onOpenChange={setOpenLong}
          title="Acceptable use"
          desc="Last updated 03 May 2026."
          footer={
            <>
              <button className="btn ghost" onClick={() => setOpenLong(false)}>Decline</button>
              <button className="btn ember" onClick={() => setOpenLong(false)}>I agree</button>
            </>
          }
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <p key={i}>
              <b style={{ color: 'var(--fg)' }}>{i + 1}.</b> Eidos is a substrate for
              production systems — its features are intended for engineers operating real
              infrastructure. You agree not to use the platform to attack third parties,
              distribute malware, store unlawful content, or hammer the API beyond the
              documented per-org rate limits.
            </p>
          ))}
        </Modal>
      </Frame>
      <Lede>
        The body uses <Mono>overflow-y: auto</Mono> with <Mono>max-height: 100dvh − 48px</Mono>.
        Header and footer stay locked in place so the user can always reach the actions.
      </Lede>

      {/* ── Hero / media variant ─────────────────────────────────────────── */}
      <SubHead meta="hero">Hero variant</SubHead>
      <Frame label="full-bleed media or illustration above the header" code={HERO_CODE}>
        <div className="mdl-trigger-row">
          <button className="btn ember" onClick={() => setOpenHero(true)}>
            <Icons.sparkle size={14} /> See what&apos;s new
          </button>
        </div>
        <Modal
          open={openHero}
          onOpenChange={setOpenHero}
          size="lg"
          hero={<div className="mdl-hero" />}
          title="Eidos 2026.06"
          desc="Cache Components, AI Gateway routing, and a faster Build Command."
          footer={
            <>
              <button className="btn ghost" onClick={() => setOpenHero(false)}>Maybe later</button>
              <button className="btn ember" onClick={() => setOpenHero(false)}>Read the release notes</button>
            </>
          }
        >
          <p>This month we shipped three things worth opening a modal for:</p>
          <ul style={{ paddingInlineStart: 20, color: 'var(--fg-muted)', lineHeight: 1.7, fontSize: 'var(--text-md)', margin: '0 0 8px' }}>
            <li><b style={{ color: 'var(--fg)' }}>Cache Components</b> — partial prerendering on every framework.</li>
            <li><b style={{ color: 'var(--fg)' }}>AI Gateway routing</b> — per-token failover across providers.</li>
            <li><b style={{ color: 'var(--fg)' }}>Build Command 2.0</b> — 40% faster cold starts on Turbopack.</li>
          </ul>
        </Modal>
      </Frame>
      <Lede>
        Use the hero variant for announcements, onboarding moments, or media-led previews —
        anything that benefits from "above the fold". Keep the supporting copy short.
      </Lede>

      {/* ── Sizes ────────────────────────────────────────────────────────── */}
      <SubHead meta="4 sizes">Sizes</SubHead>
      <Frame label="sm 380 · md 480 · lg 640 · xl 820" code={SIZE_CODE}>
        <div className="mdl-trigger-row">
          {(['sm', 'md', 'lg', 'xl'] as ModalSize[]).map((sz) => (
            <button key={sz} className="btn sm" onClick={() => setOpenSize(sz)}>Open · {sz}</button>
          ))}
        </div>
        <Modal
          open={!!openSize}
          onOpenChange={(v) => setOpenSize(v ? (openSize || 'md') : false)}
          size={openSize || 'md'}
          title={'Size: ' + (openSize || 'md')}
          desc="Each size sets the panel's max-width. Body content always centers."
          footer={
            <button className="btn ember" onClick={() => setOpenSize(false)}>Close</button>
          }
        >
          <p>The same panel chrome at four widths. Pick the smallest size that lets the
            content breathe — empty horizontal space inside a modal feels like a printer error.</p>
        </Modal>
      </Frame>

      {/* ── Decision matrix ──────────────────────────────────────────────── */}
      <SubHead meta="when to use">Modal vs Alert Dialog vs Drawer vs Popover</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Decision matrix</span></div>
        <table className="spec mdl-matrix" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ padding: '10px 12px' }}>Use</th>
              <th>When</th>
              <th>Dismiss on scrim</th>
              <th>Has X button</th>
              <th>Esc closes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="tok-name">Modal</td>
              <td>Self-contained flow the user can back out of. Quick edit, share, attachment, preview.</td>
              <td className="mono">yes</td>
              <td className="mono">yes</td>
              <td className="mono">yes</td>
            </tr>
            <tr>
              <td className="tok-name"><a href="/alert-dialog" style={{ color: 'var(--ember)' }}>Alert Dialog</a></td>
              <td>Irreversible / high-stakes. Must be answered before continuing.</td>
              <td className="mono">no</td>
              <td className="mono">no</td>
              <td className="mono">no</td>
            </tr>
            <tr>
              <td className="tok-name"><a href="/drawer" style={{ color: 'var(--ember)' }}>Drawer</a></td>
              <td>Rich content (forms, filters, nav) with the page still visible.</td>
              <td className="mono">yes</td>
              <td className="mono">yes</td>
              <td className="mono">yes</td>
            </tr>
            <tr>
              <td className="tok-name"><a href="/popover" style={{ color: 'var(--ember)' }}>Popover</a></td>
              <td>Anchored, contextual, ≤ 320 px. Quick interaction next to a trigger.</td>
              <td className="mono">yes</td>
              <td className="mono">optional</td>
              <td className="mono">yes</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 5. ACCESSIBILITY ────────────────────────────────────────────────── */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            Focus moves into the panel on open and is trapped — Tab and Shift+Tab cycle only
            through the modal's controls. Esc closes the modal; focus returns to the element
            that opened it. Enter submits the panel's primary action.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The panel is <Mono>role="dialog"</Mono> with <Mono>aria-modal="true"</Mono>,
            named by its title via <Mono>aria-labelledby</Mono> and described by its
            subtitle via <Mono>aria-describedby</Mono>. The close button carries an
            explicit <Mono>aria-label</Mono>.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus &amp; contrast</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            Initial focus lands on the first focusable control (or the panel itself if
            nothing is focusable). Every control shows the offset ember focus ring. The scrim
            darkens the page so the panel edge reads clearly against all backgrounds.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The scrim fade and the panel's scale-and-rise use short token transitions. Under{' '}
            <Mono>prefers-reduced-motion: reduce</Mono> the modal appears and dismisses with
            opacity only — no scale or translate.
          </div>
        </div>
      </div>

      {/* 6. RTL ──────────────────────────────────────────────────────────── */}
      <SubHead meta="RTL · العربية">Right-to-left</SubHead>
      <Frame
        label='dir="rtl" — close button moves to the leading (top-left) edge; actions mirror'
        code={RTL_CODE}
      >
        <div dir="rtl" className="mdl-trigger-row">
          <button className="btn ember" onClick={() => setOpenRtl(true)}>
            <Icons.share size={14} /> مشاركة
          </button>
        </div>
        <Modal
          open={openRtl}
          onOpenChange={setOpenRtl}
          title="مشاركة forge-api"
          desc="يمكن لأي شخص لديه الرابط عرض الخدمة وعمليات النشر الأخيرة."
          footer={
            <>
              <button className="btn ghost" onClick={() => setOpenRtl(false)}>إلغاء</button>
              <button className="btn ember" onClick={() => setOpenRtl(false)}>إرسال الدعوة</button>
            </>
          }
        >
          <div dir="rtl">
            <div className="mdl-field">
              <label className="mdl-label">دعوة الأشخاص</label>
              <input placeholder="leo@acme.io, dani@acme.io" />
            </div>
            <div className="mdl-field">
              <label className="mdl-label">الدور</label>
              <select defaultValue="viewer">
                <option value="viewer">مشاهد — قراءة فقط</option>
                <option value="editor">محرر — نشر وتهيئة</option>
                <option value="admin">مسؤول — إدارة الأعضاء</option>
              </select>
            </div>
          </div>
        </Modal>
      </Frame>
      <Lede>
        The close button uses <Mono>inset-inline-end</Mono>, so it travels to the leading
        (top-left) corner under <Mono>dir="rtl"</Mono>. Footer actions follow with{' '}
        <Mono>justify-content: flex-end</Mono> — Cancel still leads, primary still trails.
      </Lede>

      {/* 7. ANATOMY ──────────────────────────────────────────────────────── */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: 480, maxWidth: '100%' }}>
              <StaticPanel />
              <div className="pin" style={{ top: 22, left: -28 }}>1</div>
              <div className="pin" style={{ top: 22, right: -28 }}>2</div>
              <div className="pin" style={{ top: 88, left: -28 }}>3</div>
              <div className="pin" style={{ top: 168, left: -28 }}>4</div>
              <div className="pin" style={{ bottom: 22, right: -28 }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 580, margin: '56px auto 0' }}>
            <span className="num">1</span>
            <span><b style={{ color: 'var(--fg)' }}>Header.</b> Title (16 px Geist 600) + optional one-line description (13 px muted). Title names the noun, description states the consequence or context.</span>
            <span className="num">2</span>
            <span><b style={{ color: 'var(--fg)' }}>Close button.</b> 32×32 ghost icon button anchored to the trailing-top corner via <Mono>inset-inline-end</Mono>. Mirrors automatically under RTL.</span>
            <span className="num">3</span>
            <span><b style={{ color: 'var(--fg)' }}>Body.</b> Padded 8/24/22 with <Mono>overflow-y: auto</Mono> so long content scrolls without losing the header or footer.</span>
            <span className="num">4</span>
            <span><b style={{ color: 'var(--fg)' }}>Form fields (optional).</b> Stacked label + input. Keep it under five fields — longer flows belong in a Drawer or a route.</span>
            <span className="num">5</span>
            <span><b style={{ color: 'var(--fg)' }}>Footer.</b> Tinted with <Mono>--surface</Mono>; <Mono>justify-content: flex-end</Mono>. Cancel leads, primary trails so muscle-memory clicks favour committing.</span>
          </div>
        </div>
      </div>

      {/* 8. DO / DON'T ───────────────────────────────────────────────────── */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — give the user three ways out</div>
          <div className="body">
            <div className="mdl-mini">
              <div className="mdl-header">
                <div className="mdl-titles">
                  <h2 className="mdl-title">Rename</h2>
                  <p className="mdl-desc">X · scrim · Esc all close.</p>
                </div>
                <button className="mdl-close" type="button" tabIndex={-1}><Icons.x size={14} /></button>
              </div>
              <div className="mdl-footer">
                <button className="btn ghost xs">Cancel</button>
                <button className="btn ember xs">Save</button>
              </div>
            </div>
          </div>
          <div className="note">A modal that traps the user feels broken. Three independent dismiss paths — X, scrim, Escape — guarantee no one ever feels stuck.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don&apos;t — use a modal for an irreversible action</div>
          <div className="body">
            <div className="mdl-mini">
              <div className="mdl-header with-icon">
                <span className="mdl-icon danger"><Icons.alert size={14} /></span>
                <div className="mdl-titles">
                  <h2 className="mdl-title">Delete forever</h2>
                </div>
                <button className="mdl-close" type="button" tabIndex={-1}><Icons.x size={14} /></button>
              </div>
              <div className="mdl-footer">
                <button className="btn ghost xs">Cancel</button>
                <button className="btn destructive xs">Delete</button>
              </div>
            </div>
          </div>
          <div className="note">A scrim-click that wipes data is a rage-quit waiting to happen. Anything irreversible belongs in an <a href="/alert-dialog" style={{ color: 'var(--ember)' }}>Alert Dialog</a>.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — name the noun in the title</div>
          <div className="body mdl-mini-stack">
            <div className="mdl-mini-title">Share <span style={{ color: 'var(--ember)' }}>forge-api</span></div>
            <div className="mdl-mini-title">Rename <span style={{ color: 'var(--ember)' }}>v4.18.2</span></div>
          </div>
          <div className="note">"Share forge-api" is locatable; "Share" is not. The user should know what they're acting on without reading the body.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don&apos;t — bury the form behind a modal-on-modal</div>
          <div className="body">
            <div className="mdl-mini-stacked" aria-hidden="true">
              <span className="layer" />
              <span className="layer" />
              <span className="layer bad" />
            </div>
          </div>
          <div className="note">Stacked modals confuse Escape — which one closes first? Replace, don't stack. If a sub-step is needed, push to a route or a wizard inside the same modal.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — keep the body short or scroll it</div>
          <div className="body">
            <div className="mdl-mini">
              <div className="mdl-header">
                <div className="mdl-titles"><h2 className="mdl-title">Acceptable use</h2></div>
              </div>
              <div className="mdl-mini-body scroll">
                Eidos is a substrate for production systems. You agree not to attack third parties, distribute malware, or hammer the API beyond the documented per-org rate limits…
              </div>
              <div className="mdl-footer">
                <button className="btn ghost xs">Decline</button>
                <button className="btn ember xs">Agree</button>
              </div>
            </div>
          </div>
          <div className="note">When the body is long, the actions stay visible at the bottom. The user always knows what their next move is.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don&apos;t — let the actions scroll out of view</div>
          <div className="body">
            <div className="mdl-mini clipped">
              <div className="mdl-header">
                <div className="mdl-titles"><h2 className="mdl-title">Long form</h2></div>
              </div>
              <div className="mdl-mini-body">
                Field one… field two… field three… field four… field five… field six… field seven… field eight… field nine… field ten…
              </div>
              <div className="mdl-footer mdl-footer-clipped">
                <button className="btn ghost xs">Cancel</button>
                <button className="btn ember xs">Save</button>
              </div>
            </div>
          </div>
          <div className="note">If the user has to scroll to find Save, you're using the wrong surface — push the flow to a Drawer or a route.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — keep the X visible</div>
          <div className="body">
            <div className="mdl-mini-spot">
              <button className="mdl-close" type="button" tabIndex={-1}>
                <Icons.x size={12} />
              </button>
              <div className="mdl-mini-body">X always reachable — the obvious escape hatch.</div>
            </div>
          </div>
          <div className="note">The X is the one dismissal a touch user can find without learning. Hiding it signals "you have to read all of this" — exactly the wrong vibe for a forgiving surface.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don&apos;t — use a modal for a celebration</div>
          <div className="body">
            <div className="mdl-mini mdl-mini-center">
              <span style={{ color: 'var(--success)' }}><Icons.check size={16} /></span>
              <div className="mdl-title">Saved!</div>
              <div className="mdl-desc">Your changes have been saved.</div>
            </div>
          </div>
          <div className="note">A successful save isn't a decision — the user already made it. Use a <a href="/notification" style={{ color: 'var(--ember)' }}>toast</a>; let the user keep working.</div>
        </div>
      </div>

      {/* 9. API REFERENCE ────────────────────────────────────────────────── */}
      <SubHead meta="ModalProps">API reference</SubHead>
      <AutoPropsTable component="Modal" label="<Modal />" />
    </Section>
  );
}

