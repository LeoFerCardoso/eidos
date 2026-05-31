import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Calendar } from '@eidos/ui';
import type { DateRange } from '@eidos/ui';

// Fixed "today" keeps snapshots deterministic.
const TODAY = new Date(2026, 5, 15); // 15 Jun 2026

const meta = {
  title: 'Forms/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Unified month-grid picker. `selectionMode="single"` (default) picks one date; ' +
          '`selectionMode="range"` enables a two-click range with hover-preview. ' +
          'Controlled when `value` is passed; uncontrolled when only `defaultValue` is given. ' +
          '`<RangeCalendar>` is a deprecated alias for `<Calendar selectionMode="range" />`.',
      },
    },
  },
  args: {
    today: TODAY,
    locale: 'en-US',
    weekStartsOn: 1,
    selectionMode: 'single',
  },
  argTypes: {
    selectionMode: { control: 'inline-radio', options: ['single', 'range'] },
    today: { control: false },
    value: { control: false },
    defaultValue: { control: false },
    onValueChange: { action: 'valueChanged' },
    disabled: { control: false },
    minDate: { control: false },
    maxDate: { control: false },
    footer: { control: false },
    weekStartsOn: { control: 'inline-radio', options: [0, 1] },
    locale: { control: 'text' },
    className: { control: 'text' },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Single mode ────────────────────────────────────────────────────────────────

/** Default uncontrolled calendar — today is highlighted; click any day to select. */
export const Default: Story = {};

/**
 * Controlled single-date — external state drives the selection. The ISO value
 * is shown beside the calendar.
 */
export const Single: Story = {
  render: (args) => {
    const [date, setDate] = React.useState<Date>(new Date(2026, 5, 22));
    return (
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <Calendar
          {...args}
          selectionMode="single"
          value={date}
          onValueChange={(d) => setDate(d as Date)}
          today={TODAY}
        />
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-muted)' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-faint)', marginBottom: 6 }}>
            Selected
          </div>
          <span style={{ color: 'var(--ember)' }}>{date.toISOString().slice(0, 10)}</span>
        </div>
      </div>
    );
  },
};

// ── Range mode ─────────────────────────────────────────────────────────────────

/**
 * Range mode with hover-preview — first click anchors the start; hover shows the
 * band before the second click commits the end. Click when a range is complete
 * to start over.
 */
export const Range: Story = {
  render: (args) => {
    const [range, setRange] = React.useState<DateRange>({
      start: new Date(2026, 5, 8),
      end: new Date(2026, 5, 19),
    });
    const fmt = (d: Date | null) => d?.toISOString().slice(0, 10) ?? '—';
    return (
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <Calendar
          {...args}
          selectionMode="range"
          value={range}
          onValueChange={(r) => setRange(r as DateRange)}
          today={TODAY}
        />
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-muted)' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-faint)', marginBottom: 8 }}>
            Range
          </div>
          <div style={{ color: 'var(--ember)', marginBottom: 4 }}>{fmt(range.start)}</div>
          <div style={{ color: 'var(--ember)' }}>{fmt(range.end)}</div>
          <div style={{ marginTop: 14, fontSize: 11, color: 'var(--fg-faint)', lineHeight: 1.5, maxWidth: 160 }}>
            Hover previews the band; second click commits.
          </div>
        </div>
      </div>
    );
  },
};

// ── Disabled dates ─────────────────────────────────────────────────────────────

/**
 * The `disabled` predicate marks individual cells as un-selectable (opacity .3,
 * `tabIndex -1`). Here, all weekend days are disabled.
 */
export const DisabledDates: Story = {
  args: {
    disabled: (d: Date) => d.getDay() === 0 || d.getDay() === 6,
    defaultValue: new Date(2026, 5, 17),
    today: TODAY,
  },
};

// ── Bounded (min / max) ────────────────────────────────────────────────────────

/**
 * `minDate` and `maxDate` disable out-of-range cells AND lock the Prev/Next
 * nav buttons at the month boundaries.
 */
export const Bounded: Story = {
  args: {
    minDate: new Date(2026, 5, 5),
    maxDate: new Date(2026, 5, 25),
    defaultValue: new Date(2026, 5, 15),
    today: TODAY,
  },
};

// ── Locale ─────────────────────────────────────────────────────────────────────

/**
 * Pass any BCP-47 locale string to localise month + day-of-week labels.
 * The calendar layout and logic are unchanged — only the display strings differ.
 */
export const Locale: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-faint)', marginBottom: 10 }}>
          en-US
        </div>
        <Calendar locale="en-US" weekStartsOn={0} today={TODAY} />
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-faint)', marginBottom: 10 }}>
          ar-EG
        </div>
        <Calendar locale="ar-EG" weekStartsOn={1} today={TODAY} />
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-faint)', marginBottom: 10 }}>
          ja-JP
        </div>
        <Calendar locale="ja-JP" weekStartsOn={0} today={TODAY} />
      </div>
    </div>
  ),
};

// ── Week starts on Sunday ──────────────────────────────────────────────────────

/**
 * `weekStartsOn={0}` switches to a Sunday-first grid — the DOW strip and the
 * month-grid offset both adjust. Use for US/CA markets.
 */
export const WeekStartsOnSunday: Story = {
  args: {
    weekStartsOn: 0,
    today: TODAY,
  },
};

// ── With footer ────────────────────────────────────────────────────────────────

/**
 * The `footer` slot renders below the grid — use it for a "Today" shortcut,
 * a submit button, or a helper note.
 */
export const WithFooter: Story = {
  render: (args) => {
    const [date, setDate] = React.useState<Date>(new Date(2026, 5, 22));
    return (
      <Calendar
        {...args}
        selectionMode="single"
        value={date}
        onValueChange={(d) => setDate(d as Date)}
        today={TODAY}
        footer={
          <button
            type="button"
            onClick={() => setDate(TODAY)}
            style={{
              width: '100%', padding: '6px 0', borderRadius: 5,
              background: 'var(--surface-hover)', border: 'none',
              color: 'var(--fg-muted)', fontSize: 12, cursor: 'pointer',
              fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
            }}
          >
            Go to today
          </button>
        }
      />
    );
  },
};
