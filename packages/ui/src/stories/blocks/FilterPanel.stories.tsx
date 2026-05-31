import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilterPanel, MOCKS } from '@forge/ui';

// Build facet groups from the real SERVICES fixture
const ALL_TRIBES = [...new Set(MOCKS.SERVICES.map((s) => s.tribe))].sort();
const ALL_LANGS  = Object.keys(MOCKS.LANGS).sort();
const ALL_TIERS  = ['T1', 'T2', 'T3'];

const makeGroups = (selected: { tribes: Set<string>; langs: Set<string>; tiers: Set<string> }, onToggle: (g: string, v: string) => void) => [
  {
    id: 'tribe',
    title: 'Tribe',
    multi: true,
    selected: selected.tribes,
    onToggle: (v: string) => onToggle('tribes', v),
    items: ALL_TRIBES.map((t) => ({
      value: t,
      label: t,
      count: MOCKS.SERVICES.filter((s) => s.tribe === t).length,
    })),
  },
  {
    id: 'lang',
    title: 'Language',
    multi: true,
    selected: selected.langs,
    onToggle: (v: string) => onToggle('langs', v),
    items: ALL_LANGS.map((l) => ({
      value: l,
      label: l,
      count: MOCKS.SERVICES.filter((s) => s.lang === l).length,
    })),
  },
  {
    // Tier is single-select (radios) — the doc page documents `multi=false`.
    id: 'tier',
    title: 'Tier',
    multi: false,
    selected: selected.tiers,
    onToggle: (v: string) => onToggle('tiers', v),
    items: ALL_TIERS.map((t) => ({
      value: t,
      label: t,
      count: MOCKS.SERVICES.filter((s) => s.tier === t).length,
    })),
  },
];

// Static snapshot of groups for the uncontrolled stories
const STATIC_GROUPS = makeGroups(
  { tribes: new Set(['Pix', 'Risk']), langs: new Set(['Go']), tiers: new Set() },
  () => {},
);

const meta = {
  // Folder is stories/blocks/ and the doc page frames FilterPanel as a block
  // (faceted sidebar composed of search + groups), so the group is Blocks.
  title: 'Blocks/FilterPanel',
  component: FilterPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A grouped facets sidebar: a search input that scopes visible items in real time, ' +
          'grouped checkbox (multi-select) or radio (single-select) facets with optional counts, ' +
          'and a "Clear all" ghost button. The component is fully controlled — ' +
          'the caller owns `selected` Set and `onToggle`.',
      },
    },
  },
  args: {
    groups: STATIC_GROUPS,
    placeholder: 'Filter…',
  },
  argTypes: {
    placeholder: { control: 'text' },
  },
} satisfies Meta<typeof FilterPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Static snapshot — two tribes + one language pre-selected, multi-select counts shown. */
export const Default: Story = {};

/** Multi-select (checkboxes): `multi=true` renders checkbox facets that toggle independently. */
export const MultiSelect: Story = {
  args: {
    groups: makeGroups(
      { tribes: new Set(['Pix', 'Identity']), langs: new Set(['Go', 'Python']), tiers: new Set() },
      () => {},
    ).filter((g) => g.multi),
  },
};

/**
 * Single-select (radios): `multi=false` renders radio facets — the doc page's
 * "Radio (single-select) group" section. Only one value per group can be active.
 */
export const SingleSelect: Story = {
  render: () => {
    const [env, setEnv] = React.useState('prod');
    return (
      <div style={{ width: 220 }}>
        <FilterPanel
          groups={[
            {
              id: 'env',
              title: 'Environment',
              multi: false,
              selected: new Set([env]),
              onToggle: (v) => setEnv(v),
              items: [
                { value: 'dev', label: 'Development', count: 1 },
                { value: 'stage', label: 'Staging', count: 1 },
                { value: 'prod', label: 'Production', count: 1 },
              ],
            },
          ]}
        />
      </div>
    );
  },
};

/** With a "Clear all" button (provide `onClear`) — appears in the panel header. */
export const WithClear: Story = {
  args: { onClear: () => {} },
};

/**
 * Search scoping with no match: the query filters visible facets in real time,
 * and a group with zero matching items collapses out — the doc page's
 * search/empty behavior. Type to widen the result set.
 */
export const SearchNoMatch: Story = {
  render: () => {
    const [query, setQuery] = React.useState('zzz-no-such-facet');
    return (
      <div style={{ width: 220 }}>
        <FilterPanel
          groups={makeGroups(
            { tribes: new Set(), langs: new Set(), tiers: new Set() },
            () => {},
          )}
          query={query}
          onQueryChange={setQuery}
          placeholder="Filter facets…"
        />
      </div>
    );
  },
};

/** Fully interactive — controlled selection (multi + single) and query state. */
export const Interactive: Story = {
  render: () => {
    const [sel, setSel] = React.useState({ tribes: new Set<string>(), langs: new Set<string>(), tiers: new Set<string>() });
    const [query, setQuery] = React.useState('');

    const toggle = (group: string, value: string) => {
      setSel((prev) => {
        const key = group as keyof typeof prev;
        // Tier is single-select: replace; tribes/langs are multi: add/remove.
        if (group === 'tiers') {
          const next = prev.tiers.has(value) ? new Set<string>() : new Set([value]);
          return { ...prev, tiers: next };
        }
        const next = new Set(prev[key]);
        if (next.has(value)) next.delete(value); else next.add(value);
        return { ...prev, [group]: next };
      });
    };

    const clear = () => setSel({ tribes: new Set(), langs: new Set(), tiers: new Set() });

    const totalActive = sel.tribes.size + sel.langs.size + sel.tiers.size;

    return (
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ width: 220 }}>
          <FilterPanel
            groups={makeGroups(sel, toggle)}
            query={query}
            onQueryChange={setQuery}
            onClear={totalActive > 0 ? clear : undefined}
          />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)' }}>
            Active filters: tribes=[{[...sel.tribes].join(', ')}] langs=[{[...sel.langs].join(', ')}] tier=[{[...sel.tiers].join(', ')}]
          </p>
        </div>
      </div>
    );
  },
};

/**
 * RTL — under `dir="rtl"` the panel mirrors via logical CSS: headings, labels,
 * counts, and the search icon all align from the inline-start (right) edge.
 */
export const RTL: Story = {
  render: () => {
    const [tiers, setTiers] = React.useState(new Set(['T1']));
    const [query, setQuery] = React.useState('');
    const toggle = (v: string) =>
      setTiers((prev) => {
        const next = new Set(prev);
        if (next.has(v)) next.delete(v); else next.add(v);
        return next;
      });
    return (
      <div dir="rtl" style={{ width: 220 }}>
        <FilterPanel
          query={query}
          onQueryChange={setQuery}
          placeholder="تصفية"
          onClear={tiers.size ? () => setTiers(new Set()) : undefined}
          groups={[
            {
              id: 'tier',
              title: 'الطبقة',
              multi: true,
              selected: tiers,
              onToggle: toggle,
              items: [
                { value: 'T1', label: 'T1 · حرج', count: 14 },
                { value: 'T2', label: 'T2 · قياسي', count: 8 },
                { value: 'T3', label: 'T3 · مجهود أفضل', count: 3 },
              ],
            },
          ]}
        />
      </div>
    );
  },
};

/** Filter panel alongside a service list — realistic catalog sidebar layout. */
export const InContext: Story = {
  render: () => {
    const [sel, setSel] = React.useState({ tribes: new Set<string>(['Pix']), langs: new Set<string>(), tiers: new Set<string>() });
    const [query, setQuery] = React.useState('');

    const toggle = (group: string, value: string) => {
      setSel((prev) => {
        const key = group as keyof typeof prev;
        if (group === 'tiers') {
          const next = prev.tiers.has(value) ? new Set<string>() : new Set([value]);
          return { ...prev, tiers: next };
        }
        const next = new Set(prev[key]);
        if (next.has(value)) next.delete(value); else next.add(value);
        return { ...prev, [group]: next };
      });
    };

    const q = query.trim().toLowerCase();
    const visibleServices = MOCKS.SERVICES.filter((s) => {
      if (sel.tribes.size > 0 && !sel.tribes.has(s.tribe)) return false;
      if (sel.langs.size  > 0 && !sel.langs.has(s.lang))   return false;
      if (sel.tiers.size  > 0 && !sel.tiers.has(s.tier))   return false;
      if (q && !s.name.toLowerCase().includes(q))          return false;
      return true;
    });

    return (
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ width: 220, flexShrink: 0 }}>
          <FilterPanel
            groups={makeGroups(sel, toggle)}
            query={query}
            onQueryChange={setQuery}
            onClear={() => setSel({ tribes: new Set(), langs: new Set(), tiers: new Set() })}
          />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', marginBottom: 8 }}>
            {visibleServices.length} services
          </p>
          {visibleServices.map((s) => (
            <div key={s.id} style={{ padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{s.name}</span>
              <span style={{ marginLeft: 8, color: 'var(--fg-muted)', fontSize: 11 }}>{s.tier} · {s.lang}</span>
            </div>
          ))}
        </div>
      </div>
    );
  },
};
