'use client';
// Forge — FSearch: the one canonical search field for the portal.
//
// Mirrors the Eidos Inputs doc's Search demo (the DS pattern): an `.in-group`
// shell with a leading `.in-addon.icon` magnifier and a trailing affordance
// that swaps between the ⌘K shortcut hint (empty) and a clear-✕ button (typed).
// Before this, every page (Catalog, Templates, Agents, the chat toolbars) hand-
// rolled this same markup and drifted — different icon sizes, missing clear
// buttons, divergent kbd styling. Import this instead.
//
// Sizes map to the DS `.in-group` size classes (sm 28 / md 36 / lg 44 px).
// `className` is passed through for the few call-sites that need width tweaks
// (e.g. `fp-search-hero`, `fp-agents-search`).
import * as React from 'react';
import { Icons } from '@/ds/core';

export interface FSearchProps {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  /** Shortcut hint shown while empty. Defaults to ⌘K. */
  shortcut?: string;
  /** DS input size — drives height (sm 28 / md 36 / lg 44). */
  size?: 'sm' | 'md' | 'lg';
  /** Accessible label; falls back to the placeholder. */
  'aria-label'?: string;
  className?: string;
}

export function FSearch({
  value,
  onChange,
  placeholder,
  shortcut = '⌘K',
  size = 'md',
  className,
  'aria-label': ariaLabel,
}: FSearchProps) {
  const lg = size === 'lg';
  const iconSize = lg ? 16 : 14;
  // `lg` is carried by the `.fp-search-hero` modifier (own 48px height); only
  // `sm` maps to a DS `.in-group` size class. `md` is the bare default.
  const sizeClass = size === 'sm' ? ' sm' : '';
  return (
    <div
      className={
        'in-group' +
        sizeClass +
        (lg ? ' fp-search-hero' : '') +
        (className ? ` ${className}` : '')
      }
    >
      <span className="in-addon icon">
        <Icons.search size={iconSize} />
      </span>
      <input
        className="in-control"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel ?? placeholder}
      />
      {value ? (
        <button
          type="button"
          className="in-addon btn"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <Icons.x size={lg ? 15 : 14} />
        </button>
      ) : (
        <span className="in-addon" style={{ paddingInline: 10 }}>
          <span className="kbd">{shortcut}</span>
        </span>
      )}
    </div>
  );
}
