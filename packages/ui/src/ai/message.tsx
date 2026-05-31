import * as React from 'react';
// Eidos AI — conversation turn primitives.
// Moved out of core/atoms.tsx into the AI component layer (core/ai) so the
// chat-bubble surface lives beside the other AI components. Markup is
// unchanged; visual styles live in src/styles/ai.css under the `.msg-*`
// block. Avatar stays a general atom (imported from ../atoms); Icons come
// from ../icons.
import { Icons } from '../icons';
import { Avatar } from '../atoms';
import { Prose } from './prose';

// ── Message — one turn of a chat thread ──────────────────────────────────
// Any product surface (chat drawer, AI insight reply, conversation page)
// can compose the same canonical bubble. This component just emits the
// markup; the `.msg-*` rules paint it.
//
// Props mirror the documented API on the ai/message page:
//   from        "user" | "assistant" | "system" — role drives alignment + fill
//   variant     "bubble" | "compact" | "plain"
//   meta        ReactNode — caption row above the bubble
//   streaming   boolean — render blinking caret at body end
//   error       string — error message under bubble; bubble bg goes danger
//   attachments [{ name, size, kind: "file" | "image" }]
//   actions     ReactNode — toolbar slot under the bubble
//   avatar      boolean — default true; set false to hide
//   userAvatar  Person  — defaults to { initials: 'L', name: 'You' }
//   botAvatar   Person  — defaults to { initials: 'F', name: 'Eidos AI' }
const Message = ({
  from,
  variant,
  meta,
  streaming,
  error,
  attachments,
  actions,
  avatar,
  userAvatar,
  botAvatar,
  children,
}: {
  /** Speaker role. Drives fill, alignment, avatar, and ARIA description. */
  from?: 'user' | 'assistant' | 'system';
  /** Visual density. "compact" shrinks padding and font for dense threads; "plain" drops the bubble entirely. For long-form answers reach for Response instead. */
  variant?: 'bubble' | 'compact' | 'plain';
  /** Caption row above the bubble — typically speaker name + timestamp. Slot an AILabel here for AI-surfaced answers. */
  meta?: React.ReactNode;
  /** When true, renders the blinking caret at the end of the body. Pair with token-by-token streaming. */
  streaming?: boolean;
  /** Error message rendered under the body in danger tone. The bubble background switches to --danger-soft. */
  error?: string;
  /** Files or images to render as chips under the body. Each item: { name, size, kind: "file" | "image" }. */
  attachments?: { name: string; size: string; kind: 'file' | 'image' }[];
  /** Toolbar slot under the bubble — copy / regenerate / vote. Use MessageActions for the canonical set. */
  actions?: React.ReactNode;
  /** Set false to hide the speaker avatar in dense threads. */
  avatar?: boolean;
  /** Person object passed to the underlying Avatar atom for user turns. */
  userAvatar?: { initials?: string; name?: string };
  /** Person object passed to the underlying Avatar atom for assistant turns. ember=true. */
  botAvatar?: { initials?: string; name?: string };
  /** Body content. Supports inline code, lists, paragraphs, links, and pre blocks. */
  children?: React.ReactNode;
}) => {
  const role = from || 'assistant';
  const resolvedVariant = variant || 'bubble';
  const cls = ['msg', role];
  if (resolvedVariant !== 'bubble') cls.push(resolvedVariant);
  if (error) cls.push('is-error');

  const showAvatar = avatar !== false && resolvedVariant === 'bubble' && role !== 'system';
  const rawAvatar = role === 'user'
    ? (userAvatar || { initials: 'L', name: 'You' })
    : (botAvatar  || { initials: 'F', name: 'Eidos AI' });
  const avatarObj = { name: rawAvatar.name ?? 'User', initials: rawAvatar.initials ?? rawAvatar.name?.[0] ?? '?' };

  return (
    <div className={cls.join(' ')} role="article" aria-roledescription={`${role} message`}>
      {showAvatar && <Avatar p={avatarObj} size={28} ember={role === 'assistant'}/>}
      <div className="msg-stack">
        {meta && <div className="msg-meta">{meta}</div>}
        <div
          className="msg-bubble"
          aria-live={role === 'assistant' ? 'polite' : undefined}
          aria-busy={role === 'assistant' ? !!streaming : undefined}
        >
          {children}
          {streaming && <span className="msg-caret" aria-hidden="true"/>}
        </div>
        {attachments && attachments.length > 0 && (
          <div className="msg-att-row">
            {attachments.map((a, i) => (
              <div className="msg-att" key={i}>
                <span className="ico">
                  {a.kind === 'image' ? <Icons.image size={12}/> : <Icons.file size={12}/>}
                </span>
                <span className="name">{a.name}</span>
                <span className="sz">{a.size}</span>
              </div>
            ))}
          </div>
        )}
        {error && (
          <div className="msg-error-row" role="alert">
            <Icons.alert size={12}/> {error}
          </div>
        )}
        {actions && (
          <div className="msg-actions">{actions}</div>
        )}
      </div>
    </div>
  );
};

// ── MessageActions — canonical reply toolbar ──────────────────────────────
// One toolbar for both surfaces (replaces the per-page AssistantActions /
// ResponseActions clones): copy · regenerate · 👍 · 👎 · (share). `surface`
// switches the class family + hit-target size; vote is a controlled toggle.
//   surface  "message" | "response"  (default "message")
//   onCopy/onRegen/onShare  handlers
//   vote     "up" | "down" | null     onVote(next)
//   extra    ReactNode — appended buttons
const MessageActions = ({
  surface = 'message',
  onCopy,
  onRegen,
  onShare,
  vote,
  onVote,
  extra,
}: {
  /** Switch between .msg-action (message) and .ai-resp-action (response) chrome. */
  surface?: 'message' | 'response';
  /** Copy handler fired when the copy button is clicked. */
  onCopy?: () => void;
  /** Regenerate handler fired when the regenerate button is clicked. */
  onRegen?: () => void;
  /** Share handler shown only when surface="response". */
  onShare?: () => void;
  /** Controlled vote state — "up", "down", or null (none). */
  vote?: 'up' | 'down' | null;
  /** Called with the toggled vote value when a vote button is clicked. */
  onVote?: (next: 'up' | 'down' | null) => void;
  /** Extra ReactNode appended after the canonical buttons. */
  extra?: React.ReactNode;
}) => {
  const base = surface === 'response' ? 'ai-resp-action' : 'msg-action';
  const sz = surface === 'response' ? 14 : 13;
  return (
    <>
      <button className={base} title="Copy" onClick={onCopy}><Icons.copy size={sz}/></button>
      <button className={base} title="Regenerate" onClick={onRegen}><Icons.refresh size={sz}/></button>
      <button
        className={base + ' thumb-up' + (vote === 'up' ? ' is-on' : '')}
        title="Helpful" aria-pressed={vote === 'up'}
        onClick={() => onVote && onVote(vote === 'up' ? null : 'up')}
      ><Icons.check size={sz}/></button>
      <button
        className={base + ' thumb-down' + (vote === 'down' ? ' is-on' : '')}
        title="Not helpful" aria-pressed={vote === 'down'}
        onClick={() => onVote && onVote(vote === 'down' ? null : 'down')}
      ><Icons.x size={sz}/></button>
      {surface === 'response' && (
        <button className={base} title="Share" style={{ marginInlineStart: 6 }} onClick={onShare}>
          <Icons.share size={sz}/>
        </button>
      )}
      {extra}
    </>
  );
};

// ── Response — long-form, bubble-less model output ────────────────────────
// The "streamdown" surface: a frame around <Prose/> with an optional avatar,
// a mono meta row, and an actions toolbar. Content is the consumer's job —
// pass already-rendered prose nodes as children.
//   from       "assistant" | "user"   (default "assistant")
//   meta       ReactNode — mono caption row above the body
//   avatar     boolean — render the speaker avatar (default false)
//   botAvatar  Person — passed to <Avatar/> when avatar is true
//   actions    ReactNode — toolbar slot under the body (use <MessageActions surface="response"/>)
//   streaming  boolean — trail the caret on the live block
const Response = ({
  from = 'assistant',
  meta,
  avatar = false,
  botAvatar = { initials: 'F', name: 'Eidos AI' },
  actions,
  streaming = false,
  children,
}: {
  /** Speaker role. "user" is rare — for quoting user-authored docs through the prose system. */
  from?: 'assistant' | 'user';
  /** Mono caption row above the body — speaker name, timestamp, model id. Slot an AILabel here for non-chat surfaces. */
  meta?: React.ReactNode;
  /** When true, renders the speaker avatar to the leading edge. Default false — document-mode threads use the meta row alone. */
  avatar?: boolean;
  /** Person object passed to the underlying Avatar atom when avatar is true. */
  botAvatar?: { initials?: string; name?: string };
  /** Toolbar slot under the body — copy, regenerate, vote, share. Use MessageActions surface="response" for the canonical set. */
  actions?: React.ReactNode;
  /** When true, appends the streaming caret to the body tail of the last live block. */
  streaming?: boolean;
  /** Pre-rendered prose nodes — headings, paragraphs, lists, tables, code blocks, figures. */
  children?: React.ReactNode;
}) => {
  const resolvedBot = { name: botAvatar.name ?? 'Eidos AI', initials: botAvatar.initials ?? 'F' };
  return (
  <div className={'ai-resp ' + from} role="article" aria-roledescription={`${from} response`}>
    {from === 'assistant' && avatar && <Avatar p={resolvedBot} size={32} ember/>}
    <div className="ai-resp-stack">
      {meta && <div className="ai-resp-meta">{meta}</div>}
      <Prose streaming={streaming}>{children}</Prose>
      {actions && <div className="ai-resp-actions">{actions}</div>}
    </div>
  </div>
  );
};

// ── Conversation — the thread shell ──────────────────────────────────────────
// The `.conv` shell: a bordered, fixed-height, internally-scrolling container
// that stacks Messages, snaps to the newest turn, and surfaces a floating
// jump-pill when the reader has scrolled up into history.
//
// Props:
//   title      string    — thread title shown in the header
//   tall       boolean   — adds the .tall modifier for taller height
//   jumpLabel  string    — "new" label on the jump pill (default "new")
//   children   ReactNode — header + body + controls, or composed sub-parts
//
// Page-specific demo helpers (LiveConversation, DemoThread, etc.) are kept
// in the page — they're not exported from here.

export interface ConversationProps {
  /** Thread title shown in the header strip. */
  title?: string;
  /** Adds the .tall CSS modifier for a taller fixed-height shell. */
  tall?: boolean;
  /** Thread density. "chat" uses Message bubbles on both sides (720px shell). "document" widens to 940px, renders user turns as compact bubbles and assistant turns as <Response/> — for long-form model output with headings, tables, diagrams. */
  mode?: 'chat' | 'document';
  /** When true, snaps to the latest turn unless the user has scrolled up. */
  autoScroll?: boolean;
  /** Floating jump-to-latest control shown when scrolled up and new turns arrive. */
  unreadHint?: 'pill' | 'none';
  /** Inner-shell height. Pass "100%" if you control sizing from the parent. */
  height?: number | string;
  /** Conversation slots — Header, Content, EmptyState, JumpToLatest. */
  children?: React.ReactNode;
}

const Conversation = ({
  title,
  tall = false,
  children,
}: ConversationProps) => (
  <div className={'conv' + (tall ? ' tall' : '')}>
    {title && (
      <div className="conv-head">
        <span className="title">{title}</span>
        <span className="spacer"/>
      </div>
    )}
    {/* .conv-body carries the scroll + the inline padding that keeps avatars off the edges.
        It is a focusable polite live-region log so screen readers announce new turns and
        keyboard users can scroll the thread — matches the documented a11y contract. */}
    <div
      className="conv-body"
      tabIndex={0}
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      aria-label={title || 'Conversation'}
    >
      {children}
    </div>
  </div>
);

export { Message, MessageActions, Response, Conversation };
