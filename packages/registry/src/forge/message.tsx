import * as React from 'react';
import { Avatar } from '@/components/forge/avatar';
import { Icons } from '@/components/forge/icons';

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

export { Message };
