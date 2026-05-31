import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from '@eidos/ui';

const meta = {
  title: 'Primitives/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A fully accessible paginator — Previous / page buttons / Next with smart ellipsis for long ranges. ' +
          'Sizes (`sm` / `md` / `lg`), outline style, compact mode (icon-only Prev/Next), and optional ' +
          'First/Last jump buttons are all available. All pages carry `aria-label` and `aria-current="page"`, ' +
          'wrapped in a `<nav aria-label="Pagination">`.',
      },
    },
  },
  args: {
    total: 12,
    current: 5,
    size: 'md',
    outline: false,
    compact: false,
    showFirstLast: false,
    siblings: 1,
  },
  argTypes: {
    total: { control: 'number', description: 'Total number of pages.' },
    current: { control: 'number', description: 'Currently active page (1-based).' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'], description: 'Size preset.' },
    outline: { control: 'boolean', description: 'Outline style (bordered buttons, no fill).' },
    compact: { control: 'boolean', description: 'Hides "Previous" / "Next" text labels.' },
    showFirstLast: { control: 'boolean', description: 'Shows First and Last jump buttons.' },
    siblings: { control: 'number', description: 'Pages shown on each side of the current page.' },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — numbered with ellipses, `siblings=1`. Shows first, last, current ± 1; the row width never shifts as the user pages. Driven by controls. */
export const Default: Story = {};

/** Interactive — `current` is wired to `useState` for real navigation. */
export const Interactive: Story = {
  render: (args) => {
    const [current, setCurrent] = React.useState(1);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
        <Pagination {...args} current={current} onChange={setCurrent} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)' }}>
          Page {current} of {args.total}
        </span>
      </div>
    );
  },
};

/** Sizes — sm / md / lg, matching button heights 28 / 32 / 40. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', width: 20 }}>{size}</code>
          <Pagination total={12} current={5} size={size} />
        </div>
      ))}
    </div>
  ),
};

/** Outline — bordered buttons, no background fill. Better on low-contrast surfaces. */
export const Outline: Story = {
  args: { outline: true, total: 12, current: 3 },
};

/** Compact — icon-only Prev/Next (no text labels), for dense layouts. */
export const Compact: Story = {
  args: { compact: true, total: 12, current: 8 },
};

/** First / last buttons — `showFirstLast` adds double-chevron jumps for very large datasets. */
export const WithFirstLast: Story = {
  args: { showFirstLast: true, total: 50, current: 25 },
};

/** Wide range — 100 pages with smart ellipsis on both sides; the row stays constant-width. */
export const WideRange: Story = {
  args: { total: 100, current: 50, siblings: 1 },
};

/** Two siblings — shows two pages on each side of the current. */
export const TwoSiblings: Story = {
  args: { total: 20, current: 10, siblings: 2 },
};

/** Single page — when `total` is 1, Prev/Next are disabled but the row stays for layout consistency. */
export const SinglePage: Story = {
  args: { total: 1, current: 1 },
};

/** Right-to-left — `dir="rtl"` mirrors the chevrons and reverses the button order; page 1 sits on the right. */
export const RTL: Story = {
  render: (args) => (
    <div dir="rtl">
      <Pagination {...args} />
    </div>
  ),
  args: { total: 12, current: 4 },
};

/**
 * In context — the canonical table footer: a row-count indicator, a page-size
 * picker (`.pg-select`), and the paginator together inside a `.pg-bar`. Tabular
 * numerics keep the "Showing N–M of T" digits aligned as the page index changes.
 */
export const TableFooter: Story = {
  render: () => {
    const totalRows = 248;
    const [pageSize, setPageSize] = React.useState(20);
    const [page, setPage] = React.useState(1);
    const totalPages = Math.ceil(totalRows / pageSize);
    const from = Math.min((page - 1) * pageSize + 1, totalRows);
    const to = Math.min(page * pageSize, totalRows);
    return (
      <div style={{ width: 560, maxWidth: '100%' }}>
        <div className="surface" style={{ padding: 0, borderRadius: 10, overflow: 'hidden' }}>
          <div
            style={{
              padding: 24,
              textAlign: 'center',
              color: 'var(--fg-faint)',
              fontSize: 'var(--text-base)',
              borderBlockEnd: '1px dashed var(--border)',
            }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', marginBlockEnd: 4 }}>· · · table rows · · ·</div>
            <div>{from}–{to} of {totalRows}</div>
          </div>
          <div className="pg-bar">
            <span className="meta">
              Showing <strong>{from}–{to}</strong> of <strong>{totalRows}</strong>
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <label htmlFor="pg-rows" style={{ fontSize: 'var(--text-base)', color: 'var(--fg-faint)' }}>
                Rows
              </label>
              <select
                id="pg-rows"
                className="pg-select"
                aria-label="Rows per page"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <Pagination size="sm" total={totalPages} current={page} onChange={setPage} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};
