'use client';
import * as React from 'react';
import { Icons, Frame, Section, SubHead, AutoPropsTable, Lede, History, HistoryShell, HistoryItem, HistoryGroup, Item, Group, Mono, Kbd, Skeleton, Spinner, Alert, AlertTitle, AlertDescription, AlertActions } from '@/ds/core';


  // ─── sample data ────────────────────────────────────────────────────────
  const SAMPLE = {
    today: [
      { id: 't1', title: '0421 release retrospective', preview: 'Retry budget bumped to 8, identity pool doubled, alert binding broke on rename.', starred: true, active: true },
      { id: 't2', title: 'Migration plan for billing-svc', preview: 'Dry-run, canary 10%, full roll, then verify p99 for 10 minutes.' },
      { id: 't3', title: 'Why is grpc.toml retrying so much?', preview: 'Looking at retry budget vs upstream timeout interaction.' },
    ],
    yesterday: [
      { id: 'y1', title: 'Sidebar resize behavior', preview: 'Ember accent on the divider, 240px / 320px snap points.' },
      { id: 'y2', title: 'Refactor: extract <Avatar/> atom', preview: 'Pull the disc out of every consumer, ship one canonical version.', starred: true },
    ],
    last7: [
      { id: 'l1', title: 'Postmortem: alert binding regression', preview: 'svc.latency.p99 → svc.lat.p99 silently un-bound the existing alert.' },
      { id: 'l2', title: 'Tier-1 runbook polish', preview: 'Add the rollback section, link to the canary command.' },
      { id: 'l3', title: 'Onboarding doc · new SRE', preview: 'Day 1 setup · Day 3 first on-call shadow · Day 7 first solo page.' },
    ],
    last30: [
      { id: 'm1', title: 'p99 dashboards review', preview: 'Latency by service, retries per request, pool saturation.' },
      { id: 'm2', title: 'Idea: token-budget overlay', preview: 'Overlay the prompt budget on top of the composer so the user sees the cost live.' },
    ],
    older: [
      { id: 'o1', title: 'Original design crit · Eidos DS', preview: 'Tokens, then atoms, then primitives. Theme via [data-mode].' },
    ],
  };

  // ─── frame demos ────────────────────────────────────────────────────────
  const StandardSidebar = () => (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%' }}>
      <History>
        <div className="ai-hist-list" role="listbox" aria-label="Conversation history">
          <HistoryGroup label="Today"          threads={SAMPLE.today}/>
          <HistoryGroup label="Yesterday"      threads={SAMPLE.yesterday}/>
          <HistoryGroup label="Previous 7 days" threads={SAMPLE.last7}/>
          <HistoryGroup label="Previous 30 days" threads={SAMPLE.last30}/>
          <HistoryGroup label="Older"          threads={SAMPLE.older}/>
        </div>
      </History>
    </div>
  );

  const SearchActive = () => {
    const q = 'retry';
    const filtered = (arr) => arr.filter(t => (t.title + ' ' + t.preview).toLowerCase().includes(q));
    return (
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%' }}>
        <History query={q} resultCount={filtered(SAMPLE.today).length + filtered(SAMPLE.last7).length + filtered(SAMPLE.older).length}>
          <div className="ai-hist-list" role="listbox" aria-label="Conversation history">
            <HistoryGroup label="Today"     threads={filtered(SAMPLE.today)} query={q}/>
            <HistoryGroup label="Last 7 days" threads={filtered(SAMPLE.last7)} query={q}/>
            <HistoryGroup label="Older"     threads={filtered(SAMPLE.older)} query={q}/>
          </div>
        </History>
      </div>
    );
  };

  const EmptyState = () => (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%' }}>
      <History>
        <div className="ai-hist-list">
          <div className="ai-hist-empty">
            <span className="ico"><Icons.inbox size={16}/></span>
            <div className="title">No conversations yet</div>
            <div className="sub">Start a new chat — it'll appear here as soon as the first turn lands.</div>
          </div>
        </div>
      </History>
    </div>
  );

  // loading — rail chrome stays, the list area shows skeleton rows + a labelled spinner
  const LoadingState = () => (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%' }}>
      <History>
        <div className="ai-hist-list" role="listbox" aria-label="Conversation history" aria-busy="true">
          <div className="ai-hist-group-head" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--fg-faint)' }}>
            <Spinner size="sm" aria-label="Loading conversation history"/>
            <span>Loading history…</span>
          </div>
          <div className="ai-hist-group">
            <div className="ai-hist-group-head"><span>Today</span><span><Skeleton variant="box" width={14} height={11} radius={3}/></span></div>
            {[0, 1, 2].map(i => (
              <div className="ai-hist-item" key={i} style={{ pointerEvents: 'none' }}>
                <div className="body" style={{ gap: 6 }}>
                  <Skeleton variant="line" width={i === 1 ? '58%' : '74%'}/>
                  <Skeleton variant="line" width={i === 0 ? '90%' : '66%'} height={10}/>
                </div>
              </div>
            ))}
          </div>
          <div className="ai-hist-group">
            <div className="ai-hist-group-head"><span>Yesterday</span><span><Skeleton variant="box" width={14} height={11} radius={3}/></span></div>
            {[0, 1].map(i => (
              <div className="ai-hist-item" key={i} style={{ pointerEvents: 'none' }}>
                <div className="body" style={{ gap: 6 }}>
                  <Skeleton variant="line" width={i === 0 ? '70%' : '52%'}/>
                  <Skeleton variant="line" width="84%" height={10}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </History>
    </div>
  );

  // error — the fetch failed; rail chrome stays, the list area shows a danger Alert (role="alert").
  const ErrorState = ({ retrying = false }: { retrying?: boolean }) => (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%' }}>
      <History>
        <div className="ai-hist-list">
          <Alert tone="danger" style={{ marginBlockStart: 4 }}>
            <AlertTitle>Couldn&rsquo;t load your history</AlertTitle>
            <AlertDescription>The history service didn&rsquo;t respond. New Chat and search still work — your past threads are safe.</AlertDescription>
            <AlertActions>
              <button className="btn xs ember" type="button" aria-busy={retrying || undefined} disabled={retrying}>
                {retrying ? <Spinner size="sm" aria-label="Retrying"/> : <Icons.undo size={12}/>}
                {retrying ? 'Retrying…' : 'Retry'}
              </button>
              <button className="btn xs ghost" type="button">View status</button>
            </AlertActions>
          </Alert>
        </div>
      </History>
    </div>
  );

  // grouped by project / folder
  const ByProject = () => {
    const projects = [
      { id: 'p1', name: 'Eidos — Design system', color: 'ember', threads: (SAMPLE.today.slice(0, 2) as any[]).concat(SAMPLE.yesterday.slice(0, 1)) },
      { id: 'p2', name: 'Tier-1 oncall',         color: 'warning', threads: SAMPLE.last7.slice(0, 2) },
      { id: 'p3', name: 'SRE onboarding',        color: 'ice',     threads: SAMPLE.last7.slice(2, 3) },
    ];
    return (
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%' }}>
        <History>
          <div className="ai-hist-list">
            {projects.map(p => (
              <div className="ai-hist-group" key={p.id}>
                <div className="ai-hist-group-head">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span className={'pill ' + p.color}>
                      <Icons.folder size={9}/> {p.name}
                    </span>
                  </span>
                  <span>{p.threads.length}</span>
                </div>
                {p.threads.map(t => <HistoryItem key={t.id} thread={t}/>)}
              </div>
            ))}
          </div>
        </History>
      </div>
    );
  };

  // inline rename + delete demo — the rename actually commits. Enter saves
  // (blocked + invalid while empty), Escape reverts to the title it had.
  const InlineActions = () => {
    const [titles, setTitles] = React.useState<Record<string, string>>({});
    const [editingId, setEditingId] = React.useState<string | null>('t2');
    const [draft, setDraft] = React.useState('Migration plan — billing-svc');
    const errId = React.useId();
    const invalid = draft.trim().length === 0;
    const titleOf = (t: { id: string; title: string }) => titles[t.id] ?? t.title;
    const begin = (t: { id: string; title: string }) => { setEditingId(t.id); setDraft(titleOf(t)); };
    const commit = () => {
      if (invalid || !editingId) return;
      setTitles(prev => ({ ...prev, [editingId]: draft.trim() }));
      setEditingId(null);
    };
    return (
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%' }}>
        <History>
          <div className="ai-hist-list" role="listbox" aria-label="Conversation history">
            <div className="ai-hist-group" role="group" aria-label="Today">
              <div className="ai-hist-group-head"><span>Today</span><span>{SAMPLE.today.length}</span></div>
              {SAMPLE.today.map(t => (
                t.id === editingId ? (
                  <div key={t.id}>
                    <div className="ai-hist-rename" style={invalid ? { borderColor: 'var(--danger)', boxShadow: '0 0 0 2px var(--danger-soft)' } : undefined}>
                      <input
                        autoFocus
                        aria-label="Rename conversation"
                        aria-invalid={invalid || undefined}
                        aria-describedby={invalid ? errId : undefined}
                        value={draft}
                        onChange={e => setDraft(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') { e.preventDefault(); commit(); }
                          else if (e.key === 'Escape') { e.preventDefault(); setEditingId(null); }
                        }}
                      />
                      <button className="act" aria-label="Save name" title="Save (Enter)" disabled={invalid} onClick={commit}><Icons.check size={12}/></button>
                      <button className="act" aria-label="Cancel rename" title="Cancel (Esc)" onClick={() => setEditingId(null)}><Icons.x size={12}/></button>
                    </div>
                    {invalid && <div id={errId} role="alert" className="ds-caption" style={{ color: 'var(--danger)', margin: '4px 0 0', paddingInline: 6, lineHeight: 1.55 }}>A conversation needs a name.</div>}
                  </div>
                ) : (
                  <HistoryItem key={t.id} thread={{ ...t, title: titleOf(t) }} onActivate={() => begin(t)} onRename={() => begin(t)}/>
                )
              ))}
            </div>
          </div>
        </History>
      </div>
    );
  };

  // mobile slide-out — show closed state with trigger and the open drawer
  const MobileVariant = () => {
    const [open, setOpen] = React.useState(true);
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        <div style={{ width: 340, height: '100%', position: 'relative', overflow: 'hidden', border: '1px dashed var(--border)', borderRadius: 14 }}>
          {/* simulated app bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderBlockEnd: '1px solid var(--border)', background: 'var(--surface)' }}>
            <button className="ai-hist-icon-btn" type="button" aria-label="Open conversation history" aria-expanded={open} onClick={() => setOpen(true)}><Icons.menu size={14}/></button>
            <span style={{ fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--fg)' }}>Eidos AI</span>
            <span style={{ flex: 1 }}/>
            <button className="ai-hist-icon-btn" type="button" aria-label="More options"><Icons.more size={14}/></button>
          </div>
          {/* main content placeholder */}
          <div style={{ padding: 16, color: 'var(--fg-muted)', fontSize: 'var(--text-sm)' }}>
            Tap the menu icon to open history. The drawer slides in from the leading edge and the chat dims behind it.
          </div>
          {/* drawer */}
          {open && (
            <>
              <button
                type="button"
                aria-label="Close conversation history"
                style={{
                  position: 'absolute', inset: 0, background: 'var(--scrim)', zIndex: 1,
                  cursor: 'pointer', border: 'none', padding: 0,
                }}
                onClick={() => setOpen(false)}
              />
              <div role="dialog" aria-label="Conversation history" style={{
                position: 'absolute',
                insetBlock: 0, insetInlineStart: 0,
                width: 260, zIndex: 2,
                background: 'var(--bg-elevated)',
                borderInlineEnd: '1px solid var(--border-strong)',
                display: 'flex', flexDirection: 'column',
              }}>
                <History fluid showActions={false}>
                  <div className="ai-hist-list" role="listbox" aria-label="Conversation history">
                    <HistoryGroup label="Today"     threads={SAMPLE.today.slice(0, 2)}/>
                    <HistoryGroup label="Yesterday" threads={SAMPLE.yesterday.slice(0, 1)}/>
                  </div>
                </History>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // ─── code snippets ──────────────────────────────────────────────────────
  const STD_CODE = `<History
  threads={threads}
  activeId={activeId}
  onSelect={setActiveId}
  onNewChat={createThread}
  onSearch={q => setQuery(q)}
/>`;

  const SEARCH_CODE = `<History
  threads={threads}
  query="retry"
  onSearch={setQuery}
/>
// Threads with no match for "retry" are filtered out; matching
// substrings in the title are highlighted in ember.`;

  const EMPTY_CODE = `<History threads={[]} onNewChat={createThread}/>
// Renders the empty-state card with the New Chat CTA at the top.`;

  const LOADING_CODE = `<History loading onNewChat={createThread}/>
// Rail chrome (New Chat + search) stays interactive; the list area
// shows skeleton rows. The list carries aria-busy="true" and a
// "Loading conversation history" announcement for assistive tech.`;

  const ERROR_CODE = `<History threads={[]} onNewChat={createThread}>
  {error && (
    <Alert tone="danger">           {/* role="alert" + aria-live */}
      <AlertTitle>Couldn't load your history</AlertTitle>
      <AlertDescription>The history service didn't respond…</AlertDescription>
      <AlertActions>
        <button className="btn xs ember" onClick={refetch}>Retry</button>
      </AlertActions>
    </Alert>
  )}
</History>
// New Chat + search stay live so the user is never fully blocked.`;

  const PROJECT_CODE = `<History
  groupBy="project"
  projects={projects}
  threads={threads}
/>`;

  const RENAME_CODE = `<History
  threads={threads}
  onRename={(id, title) => updateThread(id, { title })} // Enter commits
  onDelete={id => removeThread(id)}                      // toast w/ undo
/>
// Enter saves · Escape reverts · an empty name is rejected
// (aria-invalid + role="alert"), Save disabled until valid.`;

  const MOBILE_CODE = `<HistoryDrawer open={open} onOpenChange={setOpen}>
  <History threads={threads} fluid/>
</HistoryDrawer>`;

  // ─── page ────────────────────────────────────────────────────────────────
export default function HistoryPage() {
  return (
    <Section
      id="ai-history"
      num="10"
      title="History"
      desc="The conversation history rail every chat product needs — New Chat pinned at top, search beneath, then threads bucketed by recency (Today / Yesterday / Last 7 / Last 30 / Older), with rename and delete on hover."
    >
      <Lede>
        The history rail isn't a file browser — it's an entry point back into the user's last useful conversation. Every design decision below is in service of "let me get back to where I was".
      </Lede>

      {/* STANDARD */}
      <SubHead meta="default">Standard sidebar</SubHead>
      <Lede>Optimise for returning: keep the temporal grouping, and never bury New Chat behind a menu.</Lede>
      <Frame label="280px rail · New Chat at top · search · grouped by recency" code={STD_CODE} height={520}>
        <StandardSidebar/>
      </Frame>
      <p className="ds-caption">
        Five fixed groups (Today, Yesterday, Last 7, Last 30, Older). Each group disappears when empty so the list never shows hollow headers. Starred items get a small ember star at the trailing edge — they don't reorder, they just mark.
      </p>

      {/* SEARCH */}
      <SubHead meta="search · highlight matches">Search active</SubHead>
      <Frame label="typing in the search filters threads · matches highlighted in ember" code={SEARCH_CODE} height={420}>
        <SearchActive/>
      </Frame>
      <p className="ds-caption">
        Search filters the same data, never replaces it with a flat result list. Groups stay grouped so the user keeps their bearings: "this matched in Today, that one was last week".
      </p>

      {/* EMPTY */}
      <SubHead meta="zero state">Empty state</SubHead>
      <Frame label="first-run · no conversations · the New Chat CTA stays primary" code={EMPTY_CODE} height={420}>
        <EmptyState/>
      </Frame>
      <p className="ds-caption">
        Don't bury the empty state in micro-copy. Name it ("No conversations yet"), explain when it'll change ("appear here as soon as the first turn lands"), and leave the New Chat CTA exactly where it always is — the user shouldn't have to learn a different layout.
      </p>

      {/* LOADING */}
      <SubHead meta="loading">Loading state</SubHead>
      <Frame label="rail chrome stays · list area shows skeleton rows · aria-busy on the list" code={LOADING_CODE} height={420}>
        <LoadingState/>
      </Frame>
      <p className="ds-caption">
        While threads stream in, keep the rail's shape — same group heads, same row rhythm — so the layout doesn't reflow when real rows land. New Chat and search stay live: the user can start a fresh conversation before the list finishes loading. The list carries <Mono>aria-busy="true"</Mono> and announces "Loading conversation history" once.
      </p>

      {/* ERROR */}
      <SubHead meta="failed to load">Error state</SubHead>
      <Frame label="history fetch failed · danger Alert with role=&quot;alert&quot; · New Chat + search stay live" code={ERROR_CODE} height={420}>
        <ErrorState/>
      </Frame>
      <p className="ds-caption">
        When the history service fails, don&rsquo;t blank the rail — keep New Chat and search interactive and explain what broke in a <Mono>tone="danger"</Mono> <Mono>Alert</Mono> (which carries <Mono>role="alert"</Mono> so assistive tech hears it immediately). Offer a single primary Retry; the secondary &ldquo;View status&rdquo; sends power users to the incident page. Activating Retry flips the button to a labelled spinner and disables it so the request can&rsquo;t fire twice.
      </p>

      {/* BY PROJECT */}
      <SubHead meta="grouped by folder">By project</SubHead>
      <Frame label="threads grouped under named projects · pill colour distinguishes them" code={PROJECT_CODE} height={520}>
        <ByProject/>
      </Frame>
      <p className="ds-caption">
        For workspaces where conversations live inside a project (Linear, Notion-flavoured products), swap the recency groups for project pills. Same row shape, same hover actions — only the group head changes.
      </p>

      {/* INLINE RENAME / DELETE */}
      <SubHead meta="rename · delete · live">Inline actions</SubHead>
      <Frame label="this one's live — edit the name, then Enter to commit · Esc reverts · an empty name is blocked" code={RENAME_CODE} height={560}>
        <InlineActions/>
      </Frame>
      <p className="ds-caption">
        Inline rename keeps the row in place — no modal, no page jump. <Mono>Enter</Mono> commits the new title onto the row; <Mono>Escape</Mono> reverts to what it was; an empty name is rejected — the field turns danger, sets <Mono>aria-invalid</Mono>, and a <Mono>role="alert"</Mono> message ("A conversation needs a name.") names the rule while Save stays disabled. Delete uses a soft confirmation in the host app (toast with undo) rather than blocking with a dialog; the cost of an accidental delete is one click of "Undo".
      </p>

      {/* MOBILE */}
      <SubHead meta="off-canvas">Mobile slide-out</SubHead>
      <Frame label="hamburger trigger · drawer slides in from leading edge · scrim dims content" code={MOBILE_CODE} height={520}>
        <MobileVariant/>
      </Frame>
      <p className="ds-caption">
        On mobile the rail collapses behind a hamburger. Tap to open, tap the scrim or swipe to close. The list stays the same — same groups, same row shape, just <Mono>fluid</Mono> width and no panel-toggle button.
      </p>

      {/* A11Y — true to the shipped component: listbox/option + roving focus + F2 + focus-revealed actions. */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <Lede up>The keyboard map below is the contract the component <em>ships today</em>, not an aspiration. The list region is a <Mono>role="listbox"</Mono>, each thread a roving <Mono>role="option"</Mono>, and the rename/delete actions reveal on focus as well as hover — so the rail is fully operable without a pointer.</Lede>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 10}}>Keyboard</div>
          <Kbd label="Enter / step out of the rail" keys={['Tab']}/>
          <Kbd label="Move between thread rows" keys={['↑', '↓']}/>
          <Kbd label="Jump to first / last thread" keys={['Home', 'End']}/>
          <Kbd label="Open the focused thread" keys={['Enter']}/>
          <Kbd label="Open the focused thread" keys={['Space']}/>
          <Kbd label="Rename the focused thread" keys={['F2']}/>
          <p className="ds-caption" style={{margin: '12px 0 0', lineHeight: 1.55}}>Tab lands once inside the listbox (one tab stop); <Mono>↑</Mono>/<Mono>↓</Mono> rove between rows and <Mono>Home</Mono>/<Mono>End</Mono> jump to the ends. Focusing a row reveals its rename and delete buttons and makes them tab-reachable, so neither action is pointer-only.</p>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Roles &amp; state</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The scroll region carries <Mono>role="listbox"</Mono> with <Mono>aria-label="Conversation history"</Mono>; each bucket is a <Mono>role="group"</Mono> named by its head ("Today" / "Previous 7 days"); each thread is a <Mono>role="option"</Mono> whose <Mono>aria-selected</Mono> tracks the active thread — selection is not conveyed by colour alone. A single row holds <Mono>tabIndex=0</Mono> (roving); the rest are <Mono>-1</Mono>. While threads stream, the list sets <Mono>aria-busy="true"</Mono>; the search field is a labelled input paired with an <Mono>aria-live="polite"</Mono> result count ("3 conversations match …"). Delete confirms in the host toast layer with undo, never a focus-stealing dialog.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Every focusable element — New Chat, search, each row, each row action — shows the canonical ember focus ring (<Mono>--ring</Mono>). The active row fills with <Mono>--ember-soft</Mono> and titles in ember held at AA; the New Chat CTA carries dark ink (<Mono>var(--bg)</Mono>) on its ember fill; search-match highlights keep AA against the row tint.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Under <Mono>prefers-reduced-motion</Mono> the row, New Chat, and icon-button transitions are dropped (the <Mono>.ai-hist-*</Mono> block zeroes them), the mobile drawer opens and closes instantly with no slide, and the action reveal is immediate rather than a fade.</div>
        </div>
      </div>

      {/* RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — rail moves to the trailing edge automatically" height={520}>
        <div dir="rtl" style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
          <History>
            <div className="ai-hist-list">
              <div className="ai-hist-group">
                <div className="ai-hist-group-head"><span>اليوم</span><span>2</span></div>
                <HistoryItem thread={{ id: 'r1', title: 'مراجعة إصدار 0421', preview: 'تم رفع ميزانية إعادة المحاولة وتضاعف حجم التجمع.', starred: true, active: true }}/>
                <HistoryItem thread={{ id: 'r2', title: 'خطة الترحيل لـ billing-svc', preview: 'تجربة جافة، ثم نشر تدريجي 10٪، ثم النشر الكامل.' }}/>
              </div>
              <div className="ai-hist-group">
                <div className="ai-hist-group-head"><span>أمس</span><span>1</span></div>
                <HistoryItem thread={{ id: 'r3', title: 'سلوك تغيير حجم الشريط الجانبي', preview: 'لون الجمر على الفاصل، نقطتا التقاط 240/320.' }}/>
              </div>
            </div>
          </History>
        </div>
      </Frame>

      {/* ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 320 }} aria-hidden="true">
              <History>
                <div className="ai-hist-list">
                  <HistoryGroup label="Today" threads={SAMPLE.today.slice(0, 2)}/>
                </div>
              </History>
              <span className="lead h" style={{ top: 14, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 60, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 116, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 158, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 158, right: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 220, left: -32, width: 28 }}/>
              <div className="pin" style={{ top: 8,   left: -54 }}>1</div>
              <div className="pin" style={{ top: 54,  left: -54 }}>2</div>
              <div className="pin" style={{ top: 110, left: -54 }}>3</div>
              <div className="pin" style={{ top: 152, left: -54 }}>4</div>
              <div className="pin" style={{ top: 152, right: -54 }}>5</div>
              <div className="pin" style={{ top: 214, left: -54 }}>6</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 620, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>New Chat CTA.</b> The only ember-filled button in the rail. Always at the top — never moved, never hidden behind a menu, never demoted on the empty state.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Search.</b> Filters the same data structure. Active state paints an ember focus ring. The icon stays even when empty so the field reads as "search", not "input".</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Group head.</b> Mono caption (Today / Yesterday / Previous 7 / Previous 30 / Older), with the row count at the trailing edge. Empty groups don't render at all.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Thread row.</b> Title (one line, truncates) + preview (one line, fades). Active row gets <Mono>--ember-soft</Mono> + ember title — same visual contract as the active sidebar item elsewhere.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Star.</b> Marks a saved thread. Doesn't reorder — keeps the user's mental model of "where it was when I left it" intact.</span>
            <span className="num">6</span><span><b style={{ color: 'var(--fg)' }}>Row actions.</b> Rename + delete reveal on hover <em>and</em> on keyboard focus (so they're reachable without a pointer). Float over the trailing edge of the row so they never push the title.</span>
          </div>
        </div>
      </div>

      {/* DO/DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — surface the most recent + starred at top</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ width: 240, height: 220, overflow: 'hidden' }}>
              <History>
                <div className="ai-hist-list">
                  <HistoryGroup label="Today" threads={SAMPLE.today.slice(0, 2)}/>
                </div>
              </History>
            </div>
          </div>
          <div className="note">Today's thread + the starred one are one click away. The user lands and resumes.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — bury New Chat under a menu</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ width: 240, height: 220, overflow: 'hidden' }}>
              <div className="ai-hist">
                <div className="ai-hist-head">
                  <button className="ai-hist-icon-btn"><Icons.more size={14}/></button>
                  <span style={{ flex: 1, color: 'var(--fg-faint)', fontSize: 'var(--text-base)' }}>history</span>
                </div>
                <div className="ai-hist-list">
                  <HistoryGroup label="Today" threads={SAMPLE.today.slice(0, 2)}/>
                </div>
              </div>
            </div>
          </div>
          <div className="note">If New Chat takes more than one click, the user opens a new tab instead.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — keep groups when searching</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ width: 240, height: 220, overflow: 'hidden' }}>
              <History query="retry">
                <div className="ai-hist-list">
                  <HistoryGroup label="Today" threads={SAMPLE.today.slice(0, 1)} query="retry"/>
                  <HistoryGroup label="Last 7" threads={SAMPLE.last7.slice(0, 1)} query="retry"/>
                </div>
              </History>
            </div>
          </div>
          <div className="note">Group context tells the user when each match was — they keep their temporal map.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — flatten the list and lose the dates</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ width: 240, height: 220, overflow: 'hidden' }}>
              <History query="retry">
                <div className="ai-hist-list">
                  {SAMPLE.today.slice(0, 1).concat(SAMPLE.last7.slice(0, 1)).map(t => <HistoryItem key={t.id} thread={t} query="retry"/>)}
                </div>
              </History>
            </div>
          </div>
          <div className="note">Without the group head, "Today" and "two weeks ago" look identical.</div>
        </div>
      </div>

      {/* PROPS */}
      <SubHead meta="API">API reference</SubHead>
      <AutoPropsTable component="History" label="<History />"/>
      <p className="ds-caption">
        <b>Thread</b> shape: <Mono>&#123; id: string; title: string; preview: string; updatedAt: ISOString; starred?: boolean; projectId?: string &#125;</Mono>. The list does its own date grouping from <Mono>updatedAt</Mono> — the host app doesn't bucket the data.
      </p>
    </Section>
  );
}
