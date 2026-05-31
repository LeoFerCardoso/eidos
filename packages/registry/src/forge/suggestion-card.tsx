import * as React from 'react';

const SuggestionCard = ({
  icon,
  title,
  line,
  onClick,
}: {
  /** Small ember-soft tile icon at the top of the card. */
  icon: React.ReactNode;
  /** Headline — usually a question. Up to 12 words. */
  title: string;
  /** Supporting line under the title. Up to 15 words. */
  line: string;
  /** Fires when the tile is activated. */
  onClick?: () => void;
}) => (
  <button className="sg-card" onClick={onClick}>
    <span className="ico" aria-hidden="true">{icon}</span>
    <span className="title">{title}</span>
    <span className="line">{line}</span>
  </button>
);

export { SuggestionCard };
