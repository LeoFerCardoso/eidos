import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { RangeCalendar } from '@eidos/ui';
import type { DateRange } from '@eidos/ui';

// Fixed "today" keeps snapshots deterministic.
const TODAY = new Date(2026, 5, 15); // 15 Jun 2026

const meta = {
  title: 'Forms/RangeCalendar',
  component: RangeCalendar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '`RangeCalendar` is a two-click date-range picker with hover-preview band. ' +
          'First click anchors the start date; hovering previews the selection band; ' +
          'second click commits the end. Clicking again resets and starts a new range. ' +
          'It is a keep-alias for `<Calendar selectionMode="range" />` — use the deprecated ' +
          'API during a migration window, then switch to the unified `Calendar` component. ' +
          'Ideal for incident windows, sprint planning, deployment freeze periods, and ' +
          'service downtime scheduling.',
      },
    },
  },
  args: {
    today: TODAY,
    locale: 'en-US',
    weekStartsOn: 1,
  },
  argTypes: {
    today: { control: false },
    value: { control: false },
    defaultValue: { control: false },
    onChange: { action: 'rangeChanged' },
    onValueChange: { action: 'rangeChanged' },
    disabled: { control: false },
    minDate: { control: false },
    maxDate: { control: false },
    footer: { control: false },
    weekStartsOn: { control: 'inline-radio', options: [0, 1] },
    locale: { control: 'text' },
    className: { control: 'text' },
  },
} satisfies Meta<typeof RangeCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Default (uncontrolled) ─────────────────────────────────────────────────────

/**
 * Uncontrolled range calendar — today is highlighted with the ember dot. Click
 * any day to anchor the start, hover to preview the band, then click again to
 * commit the end. A third click resets and starts a new range.
 */
export const Default: Story = {};

// ── Controlled with incident window ───────────────────────────────────────────

/**
 * Controlled range — external state drives the selection. The current incident
 * window (start/end) is shown beside the calendar. Use this pattern in an
 * incident-management UI where the date range must sync with form state.
 */
export const IncidentWindow: Story = {
  render: (args) => {
    const [range, setRange] = React.useState<DateRange>({
      start: new Date(2026, 5, 8),
      end: new Date(2026, 5, 14),
    });
    const fmt = (d: Date | null) => d?.toISOString().slice(0, 10) ?? '—';
    const duration =
      range.start && range.end
        ? Math.round(
            (range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24),
          ) + 1
        : null;

    return (
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <RangeCalendar
          {...args}
          value={range}
          onValueChange={(r) => setRange(r)}
          today={TODAY}
        />
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            color: 'var(--fg-muted)',
            minWidth: 180,
          }}
        >
          <div
            style={{
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--fg-faint)',
              marginBottom: 10,
            }}
          >
            Incident Window
          </div>

          <div style={{ marginBottom: 4 }}>
            <span style={{ color: 'var(--fg-faint)', fontSize: 11 }}>Start</span>
          </div>
          <div style={{ color: 'var(--accent)', marginBottom: 10 }}>{fmt(range.start)}</div>

          <div style={{ marginBottom: 4 }}>
            <span style={{ color: 'var(--fg-faint)', fontSize: 11 }}>End</span>
          </div>
          <div style={{ color: 'var(--accent)', marginBottom: 14 }}>{fmt(range.end)}</div>

          {duration !== null && (
            <div
              style={{
                fontSize: 11,
                color: 'var(--fg-faint)',
                lineHeight: 1.5,
                borderTop: '1px solid var(--border)',
                paddingTop: 10,
              }}
            >
              Duration: <span style={{ color: 'var(--fg)' }}>{duration} day{duration !== 1 ? 's' : ''}</span>
            </div>
          )}

          {range.start && !range.end && (
            <div
              style={{
                marginTop: 10,
                fontSize: 11,
                color: 'var(--fg-faint)',
                lineHeight: 1.5,
                maxWidth: 160,
              }}
            >
              Hover previews the band; click again to commit.
            </div>
          )}
        </div>
      </div>
    );
  },
};

// ── States ─────────────────────────────────────────────────────────────────────

/**
 * Side-by-side state matrix: empty (no selection), partial (start-only, awaiting
 * end), and complete (committed range). Covers the three phases of a range
 * selection as they appear in a deployment scheduling or sprint planning context.
 */
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      {/* ── Empty ── */}
      <div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--fg-faint)',
            marginBottom: 10,
          }}
        >
          Empty (no selection)
        </div>
        <RangeCalendar today={TODAY} />
      </div>

      {/* ── Partial (start set, no end) ── */}
      <div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--fg-faint)',
            marginBottom: 10,
          }}
        >
          Partial (awaiting end)
        </div>
        <RangeCalendar
          today={TODAY}
          defaultValue={{ start: new Date(2026, 5, 10), end: null }}
        />
      </div>

      {/* ── Complete range ── */}
      <div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--fg-faint)',
            marginBottom: 10,
          }}
        >
          Complete (sprint window)
        </div>
        <RangeCalendar
          today={TODAY}
          defaultValue={{
            start: new Date(2026, 5, 2),
            end: new Date(2026, 5, 13),
          }}
        />
      </div>
    </div>
  ),
};

// ── Bounded (deployment freeze) ────────────────────────────────────────────────

/**
 * `minDate` and `maxDate` constrain the selectable window — cells outside the
 * bounds are disabled and the Prev/Next nav buttons lock at the month boundaries.
 * Models a deployment freeze period where only certain days are eligible.
 */
export const DeploymentFreeze: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      <RangeCalendar
        {...args}
        today={TODAY}
        minDate={new Date(2026, 5, 3)}
        maxDate={new Date(2026, 5, 27)}
        defaultValue={{
          start: new Date(2026, 5, 10),
          end: new Date(2026, 5, 20),
        }}
        aria-label="Deployment freeze window"
      />
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--fg-muted)',
          maxWidth: 200,
          lineHeight: 1.6,
        }}
      >
        <div
          style={{
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--fg-faint)',
            marginBottom: 8,
          }}
        >
          Eligible window
        </div>
        <div style={{ color: 'var(--fg)' }}>03 Jun – 27 Jun 2026</div>
        <div
          style={{
            marginTop: 10,
            fontSize: 11,
            color: 'var(--fg-faint)',
          }}
        >
          Dates outside the freeze window are disabled. Nav arrows lock at boundaries.
        </div>
      </div>
    </div>
  ),
};

// ── With disabled weekends ─────────────────────────────────────────────────────

/**
 * The `disabled` predicate marks individual cells as un-selectable. Here, all
 * weekend days are blocked — appropriate for business-hours-only scheduling
 * (e.g. on-call rotations, business day SLAs).
 */
export const DisabledWeekends: Story = {
  args: {
    disabled: (d: Date) => d.getDay() === 0 || d.getDay() === 6,
    defaultValue: {
      start: new Date(2026, 5, 8),
      end: new Date(2026, 5, 12),
    },
    today: TODAY,
    'aria-label': 'Business days only — weekends disabled',
  },
};

// ── Locale (week starts on Sunday) ────────────────────────────────────────────

/**
 * Pass a BCP-47 locale string and `weekStartsOn={0}` to localise labels and
 * switch to a Sunday-first grid. Useful for US/CA markets or region-aware
 * incident dashboards.
 */
export const SundayFirstLocale: Story = {
  args: {
    weekStartsOn: 0,
    locale: 'en-US',
    today: TODAY,
    defaultValue: {
      start: new Date(2026, 5, 7),
      end: new Date(2026, 5, 14),
    },
  },
};

// ── With footer (quick presets) ────────────────────────────────────────────────

/**
 * The `footer` slot renders below the grid — use it for quick-select presets
 * such as "Last 7 days" or "This month" shortcuts in analytics date filters.
 */
export const WithQuickPresets: Story = {
  render: (args) => {
    const [range, setRange] = React.useState<DateRange>({
      start: new Date(2026, 5, 8),
      end: new Date(2026, 5, 14),
    });

    const presets: { label: string; start: Date; end: Date }[] = [
      {
        label: 'Last 7 days',
        start: new Date(2026, 5, 8),
        end: new Date(2026, 5, 14),
      },
      {
        label: 'Last 14 days',
        start: new Date(2026, 5, 1),
        end: new Date(2026, 5, 14),
      },
      {
        label: 'This month',
        start: new Date(2026, 5, 1),
        end: new Date(2026, 5, 30),
      },
    ];

    return (
      <RangeCalendar
        {...args}
        value={range}
        onValueChange={(r) => setRange(r)}
        today={TODAY}
        footer={
          <div style={{ display: 'flex', gap: 6 }}>
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setRange({ start: p.start, end: p.end })}
                style={{
                  flex: 1,
                  padding: '5px 0',
                  borderRadius: 5,
                  background: 'var(--surface-hover)',
                  border: 'none',
                  color: 'var(--fg-muted)',
                  fontSize: 11,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.03em',
                  whiteSpace: 'nowrap',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        }
      />
    );
  },
};
