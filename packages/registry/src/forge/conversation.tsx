import * as React from 'react';

interface ConversationProps {
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
    {/* .conv-body carries the scroll + the L/R padding that keeps avatars off the edges */}
    <div className="conv-body">{children}</div>
  </div>
);

export { Conversation };
