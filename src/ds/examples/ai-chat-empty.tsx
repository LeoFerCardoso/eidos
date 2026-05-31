'use client';
import * as React from 'react';
import { ForgeMark, Icons, Message } from '@/ds/core';
import { FShell } from './example-shell';
// Eidos IDP — Example: AI · New chat (empty state).
//
// The "AI" entry in the product rail opens this surface. It is intentionally
// the *empty* new-chat state — there is no conversation yet, no second header,
// no right side panel. Just two things on the page:
//
//   1. A quiet, centred hero (brand mark + greeting + CTA prompt)
//   2. The canonical Eidos Prompt Input, constrained to a comfortable width
//
// The left sidebar is preserved and "New chat" is its active row, since this
// IS the new-chat surface. Historical chats in the sidebar remain present as
// destinations but are non-active here.

  
  

  // Sidebar lists — same content as before, minus any "active" thread state.
  const PINNED = [
    { id: 'space-pix',      label: 'Pix tribe',         icon: 'folder' },
    { id: 'space-incident', label: 'Incident library',  icon: 'folder' },
    { id: 'space-runbook',  label: 'Runbooks',          icon: 'folder' },
  ];
  const RECENTS = [
    { id: 'pix-p95',     title: 'Why is pix-router p95 climbing?' },
    { id: 'breaker',     title: 'Draft a circuit breaker for bureau-gw' },
    { id: 'fraud-spike', title: 'Fraud-engine error spike post-deploy' },
  ];
  const YESTERDAY = [
    { id: 'kyc-flow',   title: 'kyc-orchestrator — Ring 1 rollout plan' },
    { id: 'cost',       title: 'data-export S3 cost analysis' },
    { id: 'ledger',     title: 'ledger-svc idempotency review' },
    { id: 'sast',       title: 'SAST findings sweep — Q2 services' },
    { id: 'flag-merch', title: 'merchant-fee-v2 flag rollout review' },
  ];

  // ── Composer helpers — mirrors of the spec-page primitives in
  //    pages/ai/prompt-input.jsx. Render identical .pi-* markup so the
  //    canonical CSS in ds.css gives both surfaces the same chrome. Kept
  //    local because each <script type="text/babel"> has its own scope.
  const MODELS = [
    { id: 'forge-sonnet-4-6', short: 'S', name: 'Sonnet 4.6', cost: '$3 / 1M' },
    { id: 'forge-opus-4-7',   short: 'O', name: 'Opus 4.7',   cost: '$15 / 1M' },
    { id: 'forge-haiku-4-5',  short: 'H', name: 'Haiku 4.5',  cost: '$1 / 1M' },
  ];

  const ModelBadge = ({ short }) => (
    <span className="badge" style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 700 }}>
      {short}
    </span>
  );

  const ModelPicker = ({ value, onChange }) => {
    const [open, setOpen] = React.useState(false);
    const [pos, setPos]   = React.useState(null);
    const ref     = React.useRef(null);
    const btnRef  = React.useRef(null);
    const menuRef = React.useRef(null);

    const reposition = React.useCallback(() => {
      const btn = btnRef.current; if (!btn) return;
      const r = btn.getBoundingClientRect();
      setPos({ bottom: window.innerHeight - r.top + 6, left: r.left });
    }, []);

    React.useEffect(() => {
      if (!open) return;
      reposition();
      const onDoc = (e) => {
        if (menuRef.current && menuRef.current.contains(e.target)) return;
        if (ref.current     && ref.current.contains(e.target))     return;
        setOpen(false);
      };
      const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
      document.addEventListener('mousedown', onDoc);
      document.addEventListener('keydown', onKey);
      window.addEventListener('scroll', reposition, true);
      window.addEventListener('resize', reposition);
      return () => {
        document.removeEventListener('mousedown', onDoc);
        document.removeEventListener('keydown', onKey);
        window.removeEventListener('scroll', reposition, true);
        window.removeEventListener('resize', reposition);
      };
    }, [open, reposition]);

    const current = MODELS.find(m => m.id === value) || MODELS[0];
    return (
      <div style={{ position: 'relative' }} ref={ref}>
        <button ref={btnRef} className="pi-model" type="button" onClick={() => setOpen(v => !v)} aria-haspopup="menu" aria-expanded={open}>
          <ModelBadge short={current.short}/>
          <span className="name">{current.name}</span>
          <Icons.chevronDown size={11}/>
        </button>
        {open && pos && (
          <div
            ref={menuRef}
            className="pi-menu"
            style={{ bottom: pos.bottom, left: pos.left }}
            role="menu"
          >
            {MODELS.map(m => (
              <div
                key={m.id}
                role="menuitem"
                className={'pi-menu-item' + (m.id === current.id ? ' is-active' : '')}
                onClick={() => { onChange && onChange(m.id); setOpen(false); }}
              >
                <ModelBadge short={m.short}/>
                <span>{m.name}</span>
                <span className="sub">{m.cost}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const SubmitBtn = ({ status, hasText, onClick }) => {
    if (status === 'submitted') return (
      <button className="pi-submit is-submitted" type="button" disabled aria-label="Submitting">
        <span className="pi-submit-spin"/>
      </button>
    );
    if (status === 'streaming') return (
      <button className="pi-submit is-streaming" type="button" onClick={onClick} aria-label="Stop generating">
        <span style={{ width: 11, height: 11, background: 'currentColor', borderRadius: 2 }}/>
      </button>
    );
    if (status === 'error') return (
      <button className="pi-submit is-error" type="button" onClick={onClick} aria-label="Retry">
        <Icons.alert size={14}/>
      </button>
    );
    return (
      <button className="pi-submit" type="button" onClick={onClick} disabled={!hasText} aria-label="Send">
        <Icons.arrowUp size={14}/>
      </button>
    );
  };

  const App = () => {
    const [draft, setDraft]   = React.useState('');
    const [model, setModel]   = React.useState('forge-sonnet-4-6');
    const [banner, setBanner] = React.useState(true);
    const taRef = React.useRef(null);

    // Autosize textarea — grows up to .pi-textarea's max-height ceiling.
    React.useEffect(() => {
      const el = taRef.current;
      if (!el) return;
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 220) + 'px';
    }, [draft]);

    const onSubmit = () => {
      // No-op in this prototype — the surface stays in the empty state so the
      // user can keep exploring the composer. Real product would push to thread.
      if (!draft.trim()) return;
      setDraft('');
    };

    return (
      <FShell nav="ai" crumbs={['Eidos', 'AI', 'New chat']} fullBleed>
        <div className="ai-ex-app">
          {/* ─── Left column · AI sidebar ────────────────────────────────── */}
          <aside className="ai-ex-side" aria-label="AI Chat navigation">
            <div className="ai-ex-side-cta">
              <button className="btn ember ai-ex-newchat" type="button" aria-current="page">
                <Icons.plus size={13}/> New chat
              </button>
            </div>

            <nav className="ai-ex-side-nav" aria-label="AI sections">
              <button type="button" className="ai-ex-side-row">
                <Icons.folder size={14}/>
                <span>Projects</span>
                <span className="ai-ex-side-count">6</span>
              </button>
              <button type="button" className="ai-ex-side-row">
                <Icons.book size={14}/>
                <span>Library</span>
              </button>
              <button type="button" className="ai-ex-side-row">
                <Icons.search size={14}/>
                <span>Search chats</span>
                <span className="ai-ex-side-kbd">⌘K</span>
              </button>
            </nav>

            <div className="ai-ex-side-sep" role="separator"/>

            <div className="ai-ex-side-group">Pinned</div>
            <nav className="ai-ex-side-nav" aria-label="Pinned spaces">
              {PINNED.map(p => {
                const I = Icons[p.icon] || Icons.folder;
                return (
                  <button key={p.id} type="button" className="ai-ex-side-row">
                    <I size={14}/>
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="ai-ex-side-sep" role="separator"/>

            <div className="ai-ex-side-group">Recents</div>
            <nav className="ai-ex-side-nav" aria-label="Recent chats">
              {RECENTS.map(c => (
                <button key={c.id} type="button" className="ai-ex-side-row" title={c.title}>
                  <span>{c.title}</span>
                </button>
              ))}
            </nav>

            <div className="ai-ex-side-group">Yesterday</div>
            <nav className="ai-ex-side-nav" aria-label="Yesterday's chats" style={{ paddingBottom: 16 }}>
              {YESTERDAY.map(c => (
                <button key={c.id} type="button" className="ai-ex-side-row" title={c.title}>
                  <span>{c.title}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* ─── Centre · empty state · hero + composer ───────────────── */}
          <main className="ai-ex-empty">
            {/* Hero — quiet brand mark + greeting + CTA copy */}
            <div className="ai-ex-empty-hero">
              <div className="ai-ex-mark" aria-hidden="true">
                <ForgeMark size={56} variant="outline" color="currentColor" strokeWidth={1.6} />
              </div>
              <h1 className="ai-ex-empty-title">Hello, Leonardo</h1>
              <p className="ai-ex-empty-sub">What can Eidos AI help you with today?</p>
            </div>

            {/* Composer — canonical Eidos Prompt Input. Markup matches the
                spec page (pages/ai/prompt-input.html · Minimal example) so
                both surfaces share the .pi-* CSS in ds.css. The .pi-tab
                banner peeks above as a tab; .pi keeps full 4-corner radius. */}
            <div className="ai-ex-composer-wrap">
              <div className="pi-wrap">
                {banner && (
                  <div className="pi-tab" role="note">
                    <span className="chip" aria-hidden="true">
                      <ForgeMark size={14} color="currentColor"/>
                    </span>
                    <span className="msg">
                      <b>Access premium models &amp; agents</b> — Opus 4.7 and image generation on the Pro plan.
                    </span>
                    <a href="#" onClick={(e) => e.preventDefault()}>Upgrade</a>
                    <button
                      type="button"
                      className="close"
                      onClick={() => setBanner(false)}
                      aria-label="Dismiss banner"
                    >
                      <Icons.x size={11}/>
                    </button>
                  </div>
                )}

                <div className="pi">
                  <div className="pi-body">
                    <textarea
                      ref={taRef}
                      className="pi-textarea"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSubmit(); }
                      }}
                      placeholder="What do you want to ship today?"
                      aria-label="Message Eidos AI"
                      rows={2}
                      style={{ fontSize: 15 }}
                    />
                  </div>
                  <div className="pi-foot">
                    <button className="pi-tool" type="button" title="Attach" aria-label="Attach">
                      <Icons.paperclip size={15}/>
                    </button>
                    <ModelPicker value={model} onChange={setModel}/>
                    <span className="spacer"/>
                    <SubmitBtn
                      status="ready"
                      hasText={draft.trim().length > 0}
                      onClick={onSubmit}
                    />
                  </div>
                </div>
              </div>

              <p className="pi-caption">
                Eidos AI is grounded in your service catalog — double-check before acting on production. <a href="#" onClick={(e) => e.preventDefault()}>Learn more</a>
              </p>
            </div>
          </main>
        </div>

        {/* Page-local styling — only structural, all colours via DS tokens */}
        <style>{`
          .ai-ex-app {
            display: grid;
            grid-template-columns: 260px minmax(0, 1fr);
            min-height: calc(100vh - 48px);
          }
          @media (max-width: 720px) {
            .ai-ex-app { grid-template-columns: minmax(0, 1fr); }
            .ai-ex-side { display: none; }
          }

          /* ── Left sidebar — attached to the product rail ───────────────
             Shares background with .fp-rail so the two surfaces read as
             one continuous strip. Divider only on its right edge. */
          .ai-ex-side {
            background: var(--bg-elevated);
            border-inline-end: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            min-height: 100%;
            overflow-y: auto;
          }
          .ai-ex-side-cta { padding: 14px 12px 8px; }
          .ai-ex-newchat {
            width: 100%;
            justify-content: flex-start;
            gap: 8px;
            font-weight: 600;
          }
          .ai-ex-side-nav {
            display: flex;
            flex-direction: column;
            gap: 1px;
            padding: 2px 8px;
          }
          .ai-ex-side-row {
            display: flex;
            align-items: center;
            gap: 10px;
            width: 100%;
            min-height: 32px;
            padding: 6px 10px;
            border: none;
            background: transparent;
            color: var(--fg);
            font-family: inherit;
            font-size: 13px;
            font-weight: 500;
            text-align: start;
            border-radius: 6px;
            cursor: pointer;
            transition: background .12s ease, color .12s ease;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            position: relative;
          }
          .ai-ex-side-row > span:first-of-type {
            flex: 1;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .ai-ex-side-row svg { color: var(--fg-muted); flex: none; }
          .ai-ex-side-row:hover { background: var(--surface); }
          .ai-ex-side-count {
            font-family: var(--font-mono);
            font-size: 10.5px;
            color: var(--fg-muted);
            padding: 1px 6px;
            border-radius: 999px;
            background: var(--surface);
            border: 1px solid var(--border);
          }
          .ai-ex-side-kbd {
            font-family: var(--font-mono);
            font-size: 10px;
            color: var(--fg-muted);
            padding: 1px 5px;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 4px;
          }
          .ai-ex-side-sep {
            height: 1px;
            background: var(--border);
            margin: 8px 14px;
          }
          .ai-ex-side-group {
            font-family: var(--font-mono);
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: var(--fg-faint);
            padding: 6px 18px 4px;
          }

          /* ── Centre · empty state ─────────────────────────────────────
             Two-row layout: hero anchored near vertical centre (slightly
             above), composer docked near the bottom with breathing room. */
          .ai-ex-empty {
            display: grid;
            grid-template-rows: 1fr auto;
            min-height: calc(100vh - 48px);
            background: var(--bg);
            padding: 24px 24px 40px;
          }

          .ai-ex-empty-hero {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 14px;
            text-align: center;
            /* Bias slightly above true centre — feels more inviting */
            padding-bottom: 6vh;
          }
          .ai-ex-mark {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: var(--fg-faint);
            opacity: 0.9;
          }
          .ai-ex-mark svg { display: block; }
          .ai-ex-empty-title {
            font-size: 22px;
            font-weight: 600;
            color: var(--fg);
            margin: 4px 0 0;
            letter-spacing: -0.01em;
          }
          .ai-ex-empty-sub {
            font-size: 14px;
            color: var(--fg-muted);
            margin: 0;
            max-width: 44ch;
            line-height: 1.5;
          }

          /* ── Composer wrap — width-constrained, dock near bottom.
              The actual composer (.pi-wrap > .pi-tab + .pi · plus the
              trailing .pi-caption) is the canonical Eidos Prompt Input
              from ds.css. This wrap just constrains its width and centres
              it on the page. */
          .ai-ex-composer-wrap {
            width: 100%;
            max-width: 720px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
          }
          .ai-ex-composer-wrap > .pi-wrap { max-width: none; }
        `}</style>
      </FShell>
    );
  };

  
  export default App;
