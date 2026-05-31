'use client';
import * as React from 'react';
import { Icons, ForgeMark, Frame, Section, SubHead, TabbedCode, PropsTable, AutoPropsTable, Message, Empty, installTabs, Lede, Conversation, PromptInput, Suggestion, Mono, Skeleton, Spinner, Alert, AlertTitle, AlertDescription, AlertActions } from '@/ds/core';


  // Phase 1 DEF-01 — page uses the canonical <Message/> via a tiny wrapper
  // so the existing <M from="…"/> call sites stay as-is. The wrapper just
  // pins variant="compact" because the conversation thread is denser than
  // the standalone Message documentation surface.
  const M = (props) => <Message variant="compact" {...props}/>;

  // ─── live demos ─────────────────────────────────────────────────────────
  // DemoThread and other helpers are page-only — they use .conv-* markup
  // directly for flexibility in demo layouts and are not exported from core.
  const DemoThread = () => (
    <div className="conv">
      <div className="conv-head">
        <ForgeMark size={16}/>
        <span className="title">Incident replay · 0421</span>
        <span className="conv-count">3 turns</span>
        <span className="spacer"/>
        <button className="btn xs ghost" aria-label="Export thread"><Icons.download size={13}/></button>
      </div>
      <div className="conv-body" tabIndex={0} role="log" aria-live="polite" aria-relevant="additions" aria-label="Incident replay · 0421">
        <M from="system">Session opened · forge-ai/sonnet-4-6</M>
        <M from="user">Where do I find the Tier-1 incident runbooks?</M>
        <M from="assistant" meta={<>Eidos AI · 14:02</>}>
          In <code>docs/runbooks/tier-1/</code> — each service has its own Markdown file with the on-call rotation, dashboards, and rollback steps for the last three releases.
        </M>
        <M from="user">And for the last deploy diff?</M>
        <M from="assistant" meta={<>Eidos AI · 14:02</>}>
          <code>git log -p --since="3 days" -- services/identity-svc</code> shows the diff for that window scoped to the service.
        </M>
      </div>
    </div>
  );

  const EmptyThread = () => (
    <div className="conv" style={{ height: 340 }}>
      <div className="conv-head">
        <ForgeMark size={16}/>
        <span className="title">New chat</span>
        <span className="spacer"/>
      </div>
      <Empty
        accent
        size="sm"
        icon={<Icons.sparkle size={16}/>}
        title="Start with anything"
        desc="Ask about an incident, a service, or a deploy diff. The model has read-only access to your Datadog and GitHub orgs."
      >
        <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          <span className="pill">What changed in the last 24h?</span>
          <span className="pill">Why is identity-svc paging?</span>
          <span className="pill">Tier-1 runbooks for billing</span>
        </div>
      </Empty>
    </div>
  );

  // Interactive conversation with auto-scroll behaviour + jump-to-latest pill.
  // Demonstrates the BURST pattern — two consecutive assistant turns at the
  // start; the avatar collapses to the last bubble and the meta row only
  // appears above the first of the burst.
  const LiveConversation = () => {
    const [turns, setTurns] = React.useState<Array<{ id: number; from: 'user' | 'assistant' | 'system'; body: string; meta?: React.ReactNode }>>([
      { id: 0, from: 'system',    body: 'Session opened · forge-ai/sonnet-4-6' },
      { id: 1, from: 'user',      body: 'Stuck on grpc retries — anything jump out?' },
      { id: 2, from: 'assistant', meta: <>Eidos AI · 14:02</>, body: 'Retry budget on grpc.toml was bumped from 3 to 8 in the last deploy.' },
      { id: 3, from: 'assistant', body: 'That can mask a downstream timeout — billing-svc looks like the suspect.' },
    ]);
    const [unread, setUnread] = React.useState(0);
    // Pure "not at the bottom" — independent of new-message count, so the
    // jump button stays visible whenever the user is reading history (as
    // a bare arrow if there are no new messages, as a count pill when
    // there are).
    const [notAtBottom, setNotAtBottom] = React.useState(false);
    const bodyRef = React.useRef<HTMLDivElement>(null);

    // "At bottom" if within 24px of the bottom.
    const isAtBottom = () => {
      const el = bodyRef.current;
      if (!el) return true;
      return el.scrollHeight - el.scrollTop - el.clientHeight < 24;
    };
    const scrollToBottom = (smooth = true) => {
      const el = bodyRef.current;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
    };

    React.useEffect(() => { scrollToBottom(false); }, []);

    React.useEffect(() => {
      const el = bodyRef.current;
      if (!el) return;
      const onScroll = () => {
        const atBottom = isAtBottom();
        setNotAtBottom(!atBottom);
        if (atBottom) setUnread(0);
      };
      el.addEventListener('scroll', onScroll);
      return () => el.removeEventListener('scroll', onScroll);
    }, []);

    React.useEffect(() => {
      const sample: any[] = [
        { from: 'user',      body: 'And what about the deploy after?' },
        { from: 'assistant', meta: <>Eidos AI · 14:04</>, body: 'That one only touched the migration runner — safe to roll back independently.' },
        { from: 'user',      body: 'Got it.' },
        { from: 'user',      body: 'Anything else worth checking?' },
        { from: 'assistant', meta: <>Eidos AI · 14:06</>, body: 'Watch the p99 on identity-svc — the same retry-bump cascades there too.' },
        { from: 'assistant', body: 'And re-bind the Datadog alert before next deploy.' },
      ];
      let i = 0;
      const id = setInterval(() => {
        const t = sample[i % sample.length]; i += 1;
        setTurns(prev => {
          const wasAtBottom = isAtBottom();
          const next = [...prev, { id: prev.length, from: t.from, body: t.body, meta: t.meta }];
          if (wasAtBottom) {
            requestAnimationFrame(() => scrollToBottom(true));
          } else {
            setUnread(n => n + 1);
          }
          return next;
        });
      }, 4500);
      return () => clearInterval(id);
    }, []);

    return (
      <div className="conv tall">
        <div className="conv-head">
          <ForgeMark size={16}/>
          <span className="title">Live thread (auto-scroll demo)</span>
          <span className="conv-count">{turns.length} turns</span>
          <span className="spacer"/>
          <button className="btn xs ghost" aria-label="Export"><Icons.download size={13}/></button>
        </div>
        <div
          className="conv-body"
          ref={bodyRef}
          tabIndex={0}
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          aria-label="Live thread (auto-scroll demo)"
        >
          {turns.map((t, i) => (
            <Message
              key={t.id}
              from={t.from}
              meta={(t as any).meta}
              streaming={t.from === 'assistant' && i === turns.length - 1}
            >
              {(t as any).body}
            </Message>
          ))}
        </div>
        {notAtBottom && (
          unread > 0 ? (
            <button className="conv-jump" onClick={() => { scrollToBottom(true); setUnread(0); }} aria-label={`Jump to latest — ${unread} new ${unread === 1 ? 'message' : 'messages'}`}>
              <span className="n">{unread}</span>
              <span>new</span>
              <Icons.arrowDown size={12}/>
            </button>
          ) : (
            <button className="conv-jump is-bare" onClick={() => scrollToBottom(true)} aria-label="Jump to latest">
              <Icons.arrowDown size={14}/>
            </button>
          )
        )}
      </div>
    );
  };

  // ─── full chat surface demo ─────────────────────────────────────────────
  // Conversation (header + thread) on top, Suggestions row, then a real
  // <PromptInput/> docked at the bottom — all inside the same .conv chrome,
  // so the prompt input is part of the chat, not floating below it.
  const FullChatDemo = () => {
    const [text, setText] = React.useState('');
    const [pending, setPending] = React.useState(false);
    const [turns, setTurns] = React.useState<Array<{ id: number; from: string; meta?: React.ReactNode; body: React.ReactNode; streaming?: boolean }>>([
      { id: 0, from: 'system',    body: 'Session opened · forge-ai/sonnet-4-6' },
      { id: 1, from: 'user',      body: 'What changed in the 0421 release?' },
      { id: 2, from: 'assistant', meta: <>Eidos AI · 14:02</>, body: <>Three migrations were promoted in the 0421 release — none of them touched the retry budget directly, but one bumped <code>identity-svc</code>'s default pool size from 8 to 32.</> },
      { id: 3, from: 'assistant', body: <>The retry-budget bump masked a downstream timeout in <code>billing-svc</code>. Because the alert rename silently un-bound the alert, the page didn't fire until error rate hit 4%.</> },
      { id: 4, from: 'user',      body: 'Got it. Anything to monitor for 0422?' },
      { id: 5, from: 'assistant', meta: <>Eidos AI · 14:08</>, body: <>Watch <code>identity-svc</code> p99 — the same retry-bump cascades there. I'd also re-bind the Datadog alert before next deploy.</> },
    ]);
    const bodyRef = React.useRef<HTMLDivElement>(null);
    const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);
    React.useEffect(() => { const el = bodyRef.current; if (el) el.scrollTop = el.scrollHeight; }, [turns.length]);
    React.useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);
    // The documented round-trip: send → assistant streams a placeholder
    // (visible LOADING state) → the answer resolves. The composer is disabled
    // while a reply is pending so a second prompt can't race the first.
    const send = (raw?: string) => {
      const value = (raw ?? text).trim();
      if (!value || pending) return;
      setText('');
      setPending(true);
      setTurns(prev => ([
        ...prev,
        { id: prev.length,     from: 'user',      body: value },
        { id: prev.length + 1, from: 'assistant', meta: <>Eidos AI · 14:09</>, body: 'Pulling the deploy diff and the alert bindings…', streaming: true },
      ]));
      timers.current.push(setTimeout(() => {
        setTurns(prev => prev.map((t, i) =>
          i === prev.length - 1
            ? { ...t, body: <>Checked the 0421 manifest — that change is contained to the migration runner, so it's safe to roll back on its own without touching the retry budget.</>, streaming: false }
            : t
        ));
        setPending(false);
      }, 1400));
    };
    return (
      <div className="conv tall" style={{ height: 640, maxWidth: 720 }}>
        <div className="conv-head">
          <ForgeMark size={16}/>
          <span className="title">Incident replay · 0421</span>
          <span className="spacer"/>
          <button className="btn xs ghost" aria-label="Export"><Icons.download size={13}/></button>
        </div>
        <div className="conv-body" ref={bodyRef} tabIndex={0} role="log" aria-live="polite" aria-relevant="additions" aria-busy={pending} aria-label="Incident replay · 0421">
          {turns.map(t => (
            <M
              key={t.id}
              from={t.from}
              meta={(t as any).meta}
              streaming={(t as any).streaming}
            >
              {(t as any).body}
            </M>
          ))}
        </div>
        {/* Suggestions row + Prompt Input docked inside the conv container */}
        <div className="conv-foot">
          <div className="conv-sgg">
            <button type="button" className="sg sm" disabled={pending} onClick={() => send('Show me that migration')}>Show me that migration</button>
            <button type="button" className="sg sm" disabled={pending} onClick={() => send('Why was the pool size bumped?')}>Why was the pool size bumped?</button>
            <button type="button" className="sg sm" disabled={pending} onClick={() => send('Roll back 0421 safely')}>Roll back 0421 safely</button>
          </div>
          <PromptInput
            value={text}
            onChange={setText}
            onSubmit={() => send()}
            placeholder={pending ? 'Eidos AI is replying…' : 'Ask anything about the 0421 release…'}
            status={pending ? 'submitted' : 'ready'}
            disabled={pending}
          />
        </div>
      </div>
    );
  };

  // ─── thread states ──────────────────────────────────────────────────────
  // A Conversation is never just "has turns". These three are the states a
  // real chat surface must show: the model is thinking, a turn failed, and
  // the composer is locked (offline / over quota). Each is a LABELLED,
  // visible demo — not prose.

  // LOADING — the assistant turn is in flight. The bubble streams a caret
  // (Message streaming) and a Skeleton stands in for the unwritten lines, so
  // the height doesn't jump when text lands.
  const LoadingThread = () => (
    <div className="conv" style={{ height: 300, maxWidth: 420 }}>
      <div className="conv-head">
        <ForgeMark size={16}/>
        <span className="title">Incident replay · 0421</span>
        <span className="spacer"/>
        <span className="conv-state" aria-live="polite"><Spinner size="sm" aria-label="Eidos AI is thinking"/> thinking…</span>
      </div>
      <div className="conv-body" tabIndex={0} role="log" aria-live="polite" aria-relevant="additions" aria-busy="true" aria-label="Incident replay · 0421">
        <M from="user">Roll back 0421 safely — what's the order?</M>
        <Message from="assistant" meta={<>Eidos AI · 14:09</>} streaming>
          <Skeleton lines={2} width="100%"/>
        </Message>
      </div>
    </div>
  );

  // ERROR — the turn failed. The danger Alert carries role="alert" so an SR
  // announces it; the retry action is a real focusable button.
  const ErrorThread = () => (
    <div className="conv" style={{ height: 300, maxWidth: 420 }}>
      <div className="conv-head">
        <ForgeMark size={16}/>
        <span className="title">Incident replay · 0421</span>
        <span className="spacer"/>
      </div>
      <div className="conv-body" tabIndex={0} role="log" aria-live="polite" aria-relevant="additions" aria-label="Incident replay · 0421">
        <M from="user">Roll back 0421 safely — what's the order?</M>
        <div style={{ alignSelf: 'stretch' }}>
          <Alert tone="danger" assertive>
            <AlertTitle>Couldn&rsquo;t reach the model</AlertTitle>
            <AlertDescription>The request to <Mono>forge-ai/sonnet-4-6</Mono> timed out after 30 s. Your prompt is kept in the composer.</AlertDescription>
            <AlertActions>
              <button className="btn sm"><Icons.refresh size={13}/> Retry</button>
            </AlertActions>
          </Alert>
        </div>
      </div>
    </div>
  );

  // OFFLINE / DISABLED — the composer is locked (lost connection or over
  // quota). A status banner explains why; the PromptInput is fully disabled
  // so a queued send can't silently drop.
  const OfflineThread = () => (
    <div className="conv" style={{ height: 300, maxWidth: 420 }}>
      <div className="conv-head">
        <ForgeMark size={16}/>
        <span className="title">Incident replay · 0421</span>
        <span className="spacer"/>
        <span className="conv-state is-off">offline</span>
      </div>
      <div className="conv-body" tabIndex={0} role="log" aria-label="Incident replay · 0421">
        <M from="user">Roll back 0421 safely — what's the order?</M>
        <M from="assistant" meta={<>Eidos AI · 14:09</>}>Reverting the migration runner first keeps the retry budget untouched.</M>
      </div>
      <div className="conv-foot">
        <PromptInput
          value=""
          onChange={() => {}}
          onSubmit={() => {}}
          placeholder="Reconnecting to Eidos AI…"
          status="error"
          disabled
        />
      </div>
    </div>
  );

  // document-mode demo (ChatGPT-style)
  const DocThread = () => (
    <div className="conv mode-document" style={{ height: 720 }}>
      <div className="conv-head">
        <ForgeMark size={16}/>
        <span className="title">Release post-mortem · 0421</span>
        <span className="conv-count">document mode</span>
        <span className="spacer"/>
        <button className="btn xs ghost" aria-label="Export"><Icons.download size={13}/></button>
      </div>
      <div className="conv-body">
        <div className="conv-doc-q">
          <div className="conv-doc-q-bubble">
            Walk me through the 0421 release post-mortem — what changed, what broke, and what we should monitor in 0422.
          </div>
        </div>
        <div>
          <div className="conv-doc-a-meta">
            <span className="name">Eidos AI</span>
            <span className="dot"/>
            <span>14:02 · gpt-5</span>
          </div>
          <div className="ai-prose">
            <h2>What changed in 0421</h2>
            <p>Three things shipped together — none of them broke in isolation, but their interaction is why the on-call paged at 02:14.</p>
            <ol>
              <li><b>grpc retry budget</b> bumped from <code>3</code> to <code>8</code> in <code>config/grpc.toml</code>.</li>
              <li><b>identity-svc pool size</b> doubled (16 → 32) to absorb the migration burst.</li>
              <li><b>Datadog metric rename</b> — <code>svc.latency.p99</code> → <code>svc.lat.p99</code>. Old alerts still bound to the old name.</li>
            </ol>

            <h2>What broke</h2>
            <p>The retry-budget bump masked a downstream timeout in <code>billing-svc</code>. Because the alert rename silently un-bound the alert, the page didn't fire until error rate hit 4%.</p>

            <blockquote>
              02:14 — error_rate spike on <code>billing-svc</code>, no alert until 02:31. <cite>incident-0421.log</cite>
            </blockquote>

            <h2>What to watch in 0422</h2>
            <table>
              <thead>
                <tr><th>Metric</th><th>Owner</th><th className="num">Threshold</th></tr>
              </thead>
              <tbody>
                <tr><td><code>billing-svc</code> p99</td><td>payments</td><td className="num">&lt; 220 ms</td></tr>
                <tr><td><code>identity-svc</code> pool sat.</td><td>identity</td><td className="num">&lt; 70%</td></tr>
                <tr><td>grpc retries / req</td><td>infra</td><td className="num">&lt; 1.2</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Second turn — user follow-up + assistant answer. Document mode
            shines when the answer is multi-block; show that here. */}
        <div className="conv-doc-q">
          <div className="conv-doc-q-bubble">
            Draft the rollback plan if we have to revert 0421 in production.
          </div>
        </div>
        <div>
          <div className="conv-doc-a-meta">
            <span className="name">Eidos AI</span>
            <span className="dot"/>
            <span>14:08 · gpt-5</span>
          </div>
          <div className="ai-prose">
            <h2>Rollback plan · 0421</h2>
            <p>The pool-size bump and the metric rename are the load-bearing changes — roll those back first; the alert can be re-bound at leisure.</p>
            <ol>
              <li><b>Revert the migration runner</b> to <code>migrations/0420-final.sql</code>.</li>
              <li><b>Drop the retry budget</b> back to <code>3</code> in <code>config/grpc.toml</code> and re-deploy.</li>
              <li><b>Re-bind the alert</b> by renaming the metric back to <code>svc.latency.p99</code> in Datadog.</li>
            </ol>
            <h3>Validation</h3>
            <p>Hold the rollback for 30 minutes and watch:</p>
            <ul>
              <li><code>billing-svc</code> p99 → should drop below 200 ms within 5 min.</li>
              <li><code>identity-svc</code> pool saturation → back under 60% (was 78% during the incident).</li>
              <li>PagerDuty alert binding restored on <code>svc.latency.p99</code>.</li>
            </ul>
            <blockquote>
              Roll forward only after the alert binding test fires green on a synthetic spike. <cite>runbook-rollback-0421.md</cite>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );

  // ─── code snippets ──────────────────────────────────────────────────────
  const USAGE_CODE = `<Conversation>
  <ConversationHeader title="Incident replay · 0421"/>
  <ConversationContent>
    <Message from="system">Session opened</Message>
    <Message from="user">Where are the runbooks?</Message>
    <Message from="assistant">In docs/runbooks/tier-1/ …</Message>
  </ConversationContent>
  <ConversationJumpToLatest/>
</Conversation>`;

  const DOC_CODE = `<Conversation mode="document">
  <ConversationHeader title="Release post-mortem · 0421"/>
  <ConversationContent>
    {/* User question — compact bubble on the trailing edge */}
    <Message from="user" variant="compact">
      Walk me through the 0421 release post-mortem…
    </Message>
    {/* Assistant turn — full Response (long-form prose) */}
    <Response meta={<>Eidos AI · 14:02 · gpt-5</>}>
      <h2>What changed in 0421</h2>
      <p>Three things shipped together…</p>
      <Table>…</Table>
    </Response>
  </ConversationContent>
</Conversation>`;

  const EMPTY_CODE = `<Conversation>
  <ConversationHeader title="New chat"/>
  <ConversationEmptyState
    icon={<Icons.sparkle size={18}/>}
    title="Start with anything"
    desc="Ask about an incident, a service, or a deploy diff."
    suggestions={["Why is identity-svc paging?", "Tier-1 runbooks for billing"]}
  />
</Conversation>`;

  const LIVE_CODE = `<Conversation autoScroll>
  <ConversationHeader title="Live thread" tools={<ExportButton/>}/>
  <ConversationContent>
    {turns.map(t => <Message key={t.id} from={t.from}>{t.body}</Message>)}
  </ConversationContent>
  {/* The jump-to-latest pill auto-appears when the user is scrolled up. */}
  <ConversationJumpToLatest unread={unread}/>
</Conversation>`;

  // ─── page ────────────────────────────────────────────────────────────────
export default function ConversationPage() {
  return (
    <Section
      id="ai-conversation"
      num="02"
      title="Conversation"
      desc="The thread surface that hosts a chat — fixed-height, internally scrolling, snaps to the newest turn, and surfaces a floating jump-pill when the reader has scrolled up into history."
    >
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('ai-conversation')} ariaLabel="package manager"/>
      <Lede>The load-bearing rule is scroll discipline — auto-follow only when the user is already at the bottom; never yank them down when they&rsquo;ve scrolled up to read.</Lede>
      <Lede>
        Ships <Mono>Conversation</Mono> plus <Mono>ConversationHeader</Mono>, <Mono>ConversationContent</Mono>, <Mono>ConversationEmptyState</Mono>, and <Mono>ConversationJumpToLatest</Mono>. Composes the <a href="/ai/message" style={{ color: 'var(--ember)' }}>Message</a> primitive — never re-styles it.
      </Lede>

      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="three turns + header" code={USAGE_CODE} height={460}>
        <DemoThread/>
      </Frame>

      <div style={{ marginTop: 36, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      <SubHead meta="new chat · no turns">Empty state</SubHead>
      <Frame label="composition · uses the Empty State pattern" code={EMPTY_CODE} height={380}>
        <EmptyThread/>
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' }}>
        The empty state composes the existing <a href="/empty" style={{ color: 'var(--ember)' }}>Empty State</a> pattern — small ember tile, title, lede, and 1–3 starter pills. Don't show the prompt input here, push the user to the suggestions first.
      </p>

      <SubHead meta="auto-scroll · jump pill">Live thread</SubHead>
      <Frame label="messages arrive every 4.5s — scroll up to see the floating pill" height={560}>
        <LiveConversation/>
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' }}>
        If the reader is at the bottom, new turns snap into view. If they've scrolled up to read history, the thread does <i>not</i> yank them — instead a small "n new ↓" pill appears in the bottom-trailing corner. Click jumps back to live.
      </p>

      {/* ── STATES ──────────────────────────────────────────────────────── */}
      <SubHead meta="loading · error · offline">States</SubHead>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, marginBottom: 18, lineHeight: 1.6, maxWidth: '68ch' }}>
        A thread is never just &ldquo;has turns.&rdquo; These are the three states a live chat surface must render explicitly — the model thinking, a turn that failed, and a composer that&rsquo;s locked.
      </p>
      <div className="ds-grid cols-3" style={{ gap: 18 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-faint)', marginBottom: 8 }}>Loading</div>
          <LoadingThread/>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', marginTop: 10, lineHeight: 1.55 }}>
            <Mono>streaming</Mono> caret + a <Mono>Skeleton</Mono> placeholder; the header shows a spinner with <Mono>aria-live</Mono>.
          </p>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-faint)', marginBottom: 8 }}>Error</div>
          <ErrorThread/>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', marginTop: 10, lineHeight: 1.55 }}>
            A danger <Mono>Alert</Mono> (<Mono>role=&quot;alert&quot;</Mono>) replaces the failed turn; the prompt is preserved and Retry is a real button.
          </p>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-faint)', marginBottom: 8 }}>Offline / disabled</div>
          <OfflineThread/>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', marginTop: 10, lineHeight: 1.55 }}>
            The composer is fully <Mono>disabled</Mono> so a queued send can&rsquo;t silently drop while the connection is down.
          </p>
        </div>
      </div>

      {/* Document mode */}
      <SubHead meta="mode=&quot;document&quot; · ChatGPT-style">Document mode</SubHead>
      <Frame label="user question is a compact bubble · assistant turn is a full Response" code={DOC_CODE} height={780}>
        <DocThread/>
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '68ch' }}>
        When the model routinely answers with headings, tables, diagrams, and multi-block markdown, swap <Mono>mode</Mono> from <Mono>"chat"</Mono> to <Mono>"document"</Mono>. The shell widens to 940px, gap goes to 32px, and assistant turns render as <a href="/ai/response" style={{ color: 'var(--ember)' }}>Response</a> instead of <Mono>Message</Mono>. User questions stay as compact bubbles on the trailing edge so the boundary between turns is still legible.
      </p>

      {/* Composition with full chat stack */}
      <SubHead meta="composition · Conversation + Suggestion + Prompt Input">Full chat surface</SubHead>
      <Frame label="full chat — thread + suggestions + prompt input, all inside the conv container" height={720}>
        <FullChatDemo/>
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' }}>
        See the dedicated pages for <a href="/ai/suggestion" style={{ color: 'var(--ember)' }}>Suggestion</a> and <a href="/ai/prompt-input" style={{ color: 'var(--ember)' }}>Prompt Input</a> — Conversation just hosts them.
      </p>

      {/* ── SPACING SCALE ──────────────────────────────────────────────────── */}
      <SubHead meta="how the chat breathes">Spacing scale</SubHead>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 14, marginBottom: 18, lineHeight: 1.6, maxWidth: '68ch' }}>
        Both <Mono>.msg-thread</Mono> and the conversation
        scroll body (<Mono>.conv-body</Mono>) share one
        set of CSS custom properties for spacing. Hosts can override any token to tighten or loosen a specific surface —
        a compact insight reply shrinks <Mono>--ai-thread-pad-inline</Mono>;
        a docked artifact host bumps it for breathing room from the drawer edge.
      </p>

      <Frame label="thread padding · turn gap · follow-up gap · avatar gap" height={520}>
        <div className="msg-thread" style={{ width: '100%', maxWidth: 520, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <Message from="user">Generate a service health card component.</Message>
          <Message from="assistant" meta={<><span className="name">Eidos AI</span><span className="dot"/><span>14:02</span></>}>
            Here is a compact health card. Click to preview:
          </Message>
          <Message from="assistant">
            I included error budget, p95 latency, and the last deploy SHA.
          </Message>
          <Message from="user">Add a sparkline of the last hour too.</Message>
        </div>
      </Frame>
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 12, marginBottom: 18, lineHeight: 1.6, maxWidth: '68ch' }}>
        In the demo above, the two consecutive assistant turns collapse to a 6px follow-up gap (a "burst"); the user→assistant
        and assistant→user transitions widen to a 24px turn gap. Avatars sit 24px from the container edges (no longer touching
        a docked artifact drawer), and 12px from their bubble.
      </p>

      <div className="surface" style={{ padding: 14, marginBottom: 24, overflowX: 'auto' }}>
        <table className="tbl" style={{ margin: 0, minWidth: 720 }}>
          <thead>
            <tr>
              <th style={{ width: 230 }}>Token</th>
              <th style={{ width: 90 }}>Default</th>
              <th>What it controls</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><Mono>--ai-thread-pad-block</Mono></td><td style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-muted)' }}>24px</td><td>Top/bottom padding of the thread / scroll body.</td></tr>
            <tr><td><Mono>--ai-thread-pad-inline</Mono></td><td style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-muted)' }}>24px</td><td>Leading/trailing padding — keeps avatars off container edges (especially against a docked artifact drawer).</td></tr>
            <tr><td><Mono>--ai-turn-gap</Mono></td><td style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-muted)' }}>24px</td><td>Vertical gap between turns from <b>different</b> speakers (user → assistant or vice-versa).</td></tr>
            <tr><td><Mono>--ai-turn-gap-follow</Mono></td><td style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-muted)' }}>6px</td><td>Vertical gap between consecutive turns from the <b>same</b> speaker — a compact burst, e.g. an assistant that follows up its own answer.</td></tr>
            <tr><td><Mono>--ai-avatar-gap</Mono></td><td style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-muted)' }}>12px</td><td>Horizontal gap between the avatar and the bubble inside a single turn.</td></tr>
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginTop: 12, marginBottom: 24, lineHeight: 1.6, maxWidth: '68ch' }}>
        Two more constants don't get tokens because they should not vary across surfaces: bubble corners are{' '}
        <Mono>12px</Mono> with a 4px tail on the speaker's
        corner (top-right on user, top-left on assistant); the bubble's <Mono>max-width</Mono> is{' '}
        <Mono>78%</Mono> of the row — long messages keep a
        readable measure and never fill the entire chat width.
      </p>

      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 10}}>Keyboard</div>
          <div role="table" aria-label="Conversation keyboard map" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div className="kbd-row" role="row"><span className="label" role="cell">Move focus through header actions, body, then jump-pill</span><span className="kbd-chord" role="cell"><kbd className="kbd">Tab</kbd></span></div>
            <div className="kbd-row" role="row"><span className="label" role="cell">Scroll the focused thread body line-by-line</span><span className="kbd-chord" role="cell"><kbd className="kbd">↑</kbd><kbd className="kbd">↓</kbd></span></div>
            <div className="kbd-row" role="row"><span className="label" role="cell">Page through history</span><span className="kbd-chord" role="cell"><kbd className="kbd">PgUp</kbd><kbd className="kbd">PgDn</kbd></span></div>
            <div className="kbd-row" role="row"><span className="label" role="cell">Jump to oldest / newest turn</span><span className="kbd-chord" role="cell"><kbd className="kbd">Home</kbd><kbd className="kbd">End</kbd></span></div>
            <div className="kbd-row" role="row"><span className="label" role="cell">Activate the focused jump-pill (scroll to latest, clear count)</span><span className="kbd-chord" role="cell"><kbd className="kbd">Enter</kbd><kbd className="kbd">Space</kbd></span></div>
          </div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55, marginTop: 10}}>The body is a focusable region (<code style={{fontFamily:'var(--font-mono)'}}>tabindex=&quot;0&quot;</code>); header actions and the jump-pill are normal Tab stops. New turns never move focus.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The body is a <code style={{fontFamily:'var(--font-mono)'}}>role="log"</code> with <code style={{fontFamily:'var(--font-mono)'}}>aria-live="polite"</code> and <code style={{fontFamily:'var(--font-mono)'}}>aria-relevant="additions"</code> so each arriving turn — including a streaming assistant reply — is announced once, in order, without re-reading the backlog. The scroll region carries <code style={{fontFamily:'var(--font-mono)'}}>aria-label</code> from the thread title, and the jump-pill's unread count is exposed as text ("3 new messages") rather than a bare numeral.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>New turns never steal focus — auto-scroll moves the viewport, not the focus ring. The jump-pill shows a visible focus ring, and its ember count badge uses dark <code style={{fontFamily:'var(--font-mono)'}}>--ember-fg</code> ink on the ember fill for an AA contrast pair (never ember-on-ember). Header meta on <code style={{fontFamily:'var(--font-mono)'}}>--fg-muted</code> clears AA on the elevated tab strip.</div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Under <code style={{fontFamily:'var(--font-mono)'}}>prefers-reduced-motion</code> the smooth auto-scroll becomes an instant jump, the jump-pill appears without its slide/lift transition, and any streaming caret on the latest assistant turn falls back to instant text.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — header reads from start, bubbles flip alignment" height={420}>
        <div dir="rtl" style={{ width: '100%' }}>
          <div className="conv" style={{ height: 320 }}>
            <div className="conv-head">
              <ForgeMark size={16}/>
              <span className="title">حادثة 0421</span>
              <span className="spacer"/>
              <button className="btn xs ghost"><Icons.download size={13}/></button>
            </div>
            <div className="conv-body">
              <M from="user">أين أجد كتيبات الحوادث؟</M>
              <M from="assistant" meta={<>Eidos AI · 14:02</>}>
                في <code>docs/runbooks/tier-1/</code> — لكل خدمة ملف Markdown خاص بها.
              </M>
            </div>
          </div>
        </div>
      </Frame>

      {/* ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 440 }} aria-hidden="true">
              <div className="conv" style={{ height: 240, maxWidth: 440 }}>
                <div className="conv-head">
                  <ForgeMark size={16}/>
                  <span className="title">Thread</span>
                  <span className="spacer"/>
                  <button className="btn xs ghost"><Icons.download size={13}/></button>
                </div>
                <div className="conv-body">
                  <M from="user">Where are the runbooks?</M>
                  <M from="assistant" meta={<>Eidos AI</>}>In <code>docs/runbooks/tier-1/</code>.</M>
                </div>
                <button className="conv-jump"><span className="n">2</span><span>new</span></button>
              </div>
              <span className="lead h" style={{ top: 18, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 80, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 160, left: -32, width: 28 }}/>
              <span className="lead h" style={{ top: 200, right: -32, width: 28 }}/>
              <div className="pin" style={{ top: 12, left: -54 }}>1</div>
              <div className="pin" style={{ top: 74, left: -54 }}>2</div>
              <div className="pin" style={{ top: 154, left: -54 }}>3</div>
              <div className="pin" style={{ top: 194, right: -54 }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 600, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Header.</b> Surface tab with thread title, turn count, and right-aligned actions (export, share). Uses <Mono>--bg-elevated</Mono> so it reads as a tab strip, not a banner.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Body.</b> <Mono>overflow-y: auto</Mono> with smooth scroll. 18px gap between turns. The scrollbar is themed by tokens — no extra styling per page.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Turn rows.</b> Each is a <a href="/ai/message" style={{ color: 'var(--ember)' }}>Message</a> primitive. Conversation never re-styles them — only spaces them and clips overflow at the body edge.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Jump pill.</b> Floats at <Mono>bottom: 14px; inset-inline-end: 14px</Mono>. Only appears when scrolled up + unread count {'>'} 0. Click = smooth scroll to bottom, clears the count.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — let the bubble carry the boundary</div>
          <div className="body" style={{ padding: 14 }}>
            <div className="conv" style={{ height: 180, maxWidth: 320 }}>
              <div className="conv-body">
                <M from="user">Ping?</M>
                <M from="assistant" meta={<>Eidos AI</>}>Pong.</M>
                <M from="user">Again?</M>
                <M from="assistant" meta={<>Eidos AI</>}>Pong.</M>
              </div>
            </div>
          </div>
          <div className="note">Bubble + gap is enough — no row dividers required.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — yank the user down on every new turn</div>
          <div className="body" style={{ padding: 14, flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', textAlign: 'center' }}>
              User is reading turn 3 of 20 — a new turn arrives and the thread jumps to the bottom.
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--danger)', fontFamily: 'var(--font-mono)' }}>scrollTop = scrollHeight</span>
          </div>
          <div className="note">If the user has scrolled up, show the jump pill — never auto-snap. They came up here on purpose.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — bound the thread in a container</div>
          <div className="body" style={{ padding: 14, justifyContent: 'center' }}>
            <div className="conv" style={{ height: 180, maxWidth: 320 }}>
              <div className="conv-head">
                <ForgeMark size={16}/>
                <span className="title">Bounded</span>
                <span className="spacer"/>
              </div>
              <div className="conv-body"><M from="user">…</M><M from="assistant" meta={<>Eidos</>}>…</M></div>
            </div>
          </div>
          <div className="note">A fixed-height shell with internal scroll. The page scrolls past the thread, not through it.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — let the thread eat the whole page</div>
          <div className="body" style={{ padding: 14, justifyContent: 'flex-start', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)' }}>Page <Mono>&lt;body&gt;</Mono> scroll = thread scroll. After 50 turns, the rest of the app is unreachable.</span>
          </div>
          <div className="note">Always size the Conversation explicitly. Nested scroll inside, page scroll outside.</div>
        </div>
      </div>

      <SubHead meta="ConversationProps">API reference</SubHead>
      <AutoPropsTable component="Conversation" label="<Conversation />"/>
      <PropsTable
        label="<ConversationEmptyState />"
        rows={[
          { prop: 'icon',        type: 'ReactNode', default: '<Icons.sparkle/>', description: 'Small tile shown above the title — same shape as the Empty State pattern.' },
          { prop: 'title',       type: 'string', required: true, description: 'One-line headline. ~30 chars max.' },
          { prop: 'desc',        type: 'string', default: undefined, description: 'Supporting lede under the title. Keep under ~80 chars.' },
          { prop: 'suggestions', type: 'string[]', default: '[]', description: 'Up to 3 starter prompts. Render as Suggestion pills under the lede.' },
        ]}
      />
    </Section>
  );
}
