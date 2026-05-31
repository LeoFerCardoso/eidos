import * as React from 'react';
import { Avatar } from '@/components/forge/avatar';
import { Prose } from '@/components/forge/prose';

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

export { Response };
