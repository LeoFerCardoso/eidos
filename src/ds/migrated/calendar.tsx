'use client';
// Forge DS — Components / Calendar.
// Unified single-date and range picker backed by a single Calendar primitive.
// Both modes use the same 6x7 month grid; pass selectionMode="range" for the
// two-click range variant with hover-preview band.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, PropsTable, AutoPropsTable, installTabs, Lede, Mono } from '@/ds/core';
import { Calendar } from '@/ds/core';
import type { DateRange } from '@/ds/core';

const USAGE_CODE = `import { Calendar } from "@forge/ui"

export function Demo() {
  const [date, setDate] = React.useState(new Date());
  return <Calendar value={date} onValueChange={setDate} />;
}`;

const RANGE_CODE = `import { Calendar } from "@forge/ui"

export function Demo() {
  const [range, setRange] = React.useState({ start: null, end: null });
  return (
    <Calendar
      selectionMode="range"
      value={range}
      onValueChange={setRange}
    />
  );
}`;

// ─── Helpers (docs-local, for display only) ──────────────────────────────────
const fmt = (d: Date | null | undefined) =>
  d ? d.toISOString().slice(0, 10) : '—';

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Page() {
  const today = new Date();

  // Single mode state
  const [single, setSingle] = React.useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 12),
  );

  // Range mode state
  const [range, setRange] = React.useState<DateRange>({
    start: new Date(today.getFullYear(), today.getMonth(), 8),
    end: new Date(today.getFullYear(), today.getMonth(), 19),
  });

  // Bounded example
  const [bounded, setBounded] = React.useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 15),
  );

  // Locale example
  const [arDate, setArDate] = React.useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 10),
  );

  return (
    <Section
      id="calendar"
      num="19"
      title="Calendar"
      desc="A month-grid date picker. Use it inline for settings and filters, or behind a date-input trigger. Single-date by default; pass selectionMode='range' for interval selection."
    >

      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('calendar')} ariaLabel="package manager" />
      <Lede>
        Ships the inline <Mono>Calendar</Mono> grid with single and range
        selection, locale-aware labels, and disabled-date predicates. Pair with
        Popover to build a floating <Mono>DatePicker</Mono> trigger.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic single-date" code={USAGE_CODE}>
        <Calendar
          value={single}
          onValueChange={(d) => setSingle(d as Date)}
          today={today}
        />
      </Frame>

      {/* 3. VARIANTS ── selectionMode */}
      <SubHead meta="2 modes">Variants</SubHead>
      <Lede up>
        The unified <Mono>Calendar</Mono> covers both modes — pass{' '}
        <Mono>selectionMode</Mono> to switch between them.
      </Lede>

      {/* Single */}
      <Frame
        label="selectionMode='single' (default)"
        code={`const [date, setDate] = React.useState(new Date());

<Calendar
  value={date}
  onValueChange={setDate}
/>`}
      >
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <Calendar
            value={single}
            onValueChange={(d) => setSingle(d as Date)}
            today={today}
          />
          <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', minWidth: 180 }}>
            <div className="ds-h-eyebrow" style={{ marginBottom: 8 }}>Selected</div>
            <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)', fontSize: 'var(--text-base)', fontVariantNumeric: 'tabular-nums' }}>
              {fmt(single)}
            </code>
            <div style={{ marginTop: 14, fontSize: 'var(--text-sm)', lineHeight: 1.55, color: 'var(--fg-subtle)' }}>
              Click a day to select. Today is marked with an ember dot.
            </div>
          </div>
        </div>
      </Frame>

      {/* Range */}
      <Frame
        label="selectionMode='range' — hover-preview before the second click"
        code={RANGE_CODE}
      >
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <Calendar
            selectionMode="range"
            value={range}
            onValueChange={(r) => setRange(r as DateRange)}
            today={today}
          />
          <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', minWidth: 180 }}>
            <div className="ds-h-eyebrow" style={{ marginBottom: 8 }}>Range</div>
            <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)', fontSize: 'var(--text-base)', display: 'block', fontVariantNumeric: 'tabular-nums' }}>
              {fmt(range.start)}
            </code>
            <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember)', fontSize: 'var(--text-base)', display: 'block', fontVariantNumeric: 'tabular-nums' }}>
              {fmt(range.end)}
            </code>
            <div style={{ marginTop: 14, fontSize: 'var(--text-sm)', lineHeight: 1.55, color: 'var(--fg-subtle)' }}>
              First click sets start; hover previews the band; second click sets
              end. Click when a range is complete to reset.
            </div>
          </div>
        </div>
      </Frame>

      {/* Disabled + minDate/maxDate */}
      <SubHead meta="cell states">Disabled dates &amp; bounds</SubHead>
      <Lede up>
        <Mono>disabled</Mono> accepts a predicate for arbitrary cells (e.g.
        weekends). <Mono>minDate</Mono> / <Mono>maxDate</Mono> block a range
        AND lock the nav buttons at the boundary month.
      </Lede>
      <Frame
        label="disabled=(weekends) + minDate + maxDate"
        code={`const isWeekend = (d) => d.getDay() === 0 || d.getDay() === 6;

<Calendar
  value={date}
  onValueChange={setDate}
  disabled={isWeekend}
  minDate={new Date(2026, 5, 5)}
  maxDate={new Date(2026, 5, 25)}
/>`}
      >
        <Calendar
          value={bounded}
          onValueChange={(d) => setBounded(d as Date)}
          disabled={(d) => d.getDay() === 0 || d.getDay() === 6}
          minDate={new Date(today.getFullYear(), today.getMonth(), 1)}
          maxDate={new Date(today.getFullYear(), today.getMonth() + 1, 0)}
          today={today}
        />
      </Frame>

      {/* Locale + weekStartsOn */}
      <SubHead meta="locale">Locale &amp; week start</SubHead>
      <Lede up>
        Pass a BCP-47 <Mono>locale</Mono> to localise month + day-of-week
        labels. <Mono>weekStartsOn=&#123;0&#125;</Mono> switches to a
        Sunday-first grid for US / CA markets.
      </Lede>
      <Frame
        label="locale='ar-EG' · weekStartsOn={1} (ISO Mon-first) vs en-US · weekStartsOn={0} (Sun-first)"
        code={`<Calendar locale="ar-EG" weekStartsOn={1} value={date} onValueChange={setDate} />
<Calendar locale="en-US" weekStartsOn={0} value={date} onValueChange={setDate} />`}
      >
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div>
            <div className="ds-h-eyebrow" style={{ marginBottom: 8 }}>ar-EG</div>
            <Calendar
              locale="ar-EG"
              weekStartsOn={1}
              value={arDate}
              onValueChange={(d) => setArDate(d as Date)}
              today={today}
            />
          </div>
          <div>
            <div className="ds-h-eyebrow" style={{ marginBottom: 8 }}>en-US · Sun-first</div>
            <Calendar
              locale="en-US"
              weekStartsOn={0}
              value={single}
              onValueChange={(d) => setSingle(d as Date)}
              today={today}
            />
          </div>
        </div>
      </Frame>

      {/* Footer slot */}
      <SubHead meta="composition">Footer slot</SubHead>
      <Frame
        label="footer prop — 'Go to today' shortcut"
        code={`<Calendar
  value={date}
  onValueChange={setDate}
  footer={
    <button onClick={() => setDate(new Date())}>Go to today</button>
  }
/>`}
      >
        <Calendar
          value={single}
          onValueChange={(d) => setSingle(d as Date)}
          today={today}
          footer={
            <button
              type="button"
              onClick={() => setSingle(today)}
              style={{
                width: '100%', padding: '6px 0', borderRadius: 5,
                background: 'var(--surface-hover)', border: 'none',
                color: 'var(--fg-muted)', fontSize: 'var(--text-sm)', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
              }}
            >
              Go to today
            </button>
          }
        />
      </Frame>

      {/* Inline trigger */}
      <SubHead meta="trigger">As an input</SubHead>
      <Frame
        label="date input + calendar icon button"
        row
        code={`<div className="cal-input-wrap">
  <input type="text" value={fmt(date)} readOnly />
  <button className="cal-input-icon" aria-label="Open calendar">
    <Icons.calendar size={14}/>
  </button>
</div>`}
      >
        <div className="cal-input-wrap">
          <input type="text" value={fmt(single)} readOnly />
          <button className="cal-input-icon" aria-label="Open calendar">
            <Icons.calendar size={14} />
          </button>
        </div>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-subtle)' }}>
          ISO format avoids region-flip bugs. Localize at render time, not in the value.
        </span>
      </Frame>

      {/* Accessibility */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            Arrow Left/Right move a day; Up/Down move a week; PageUp/PageDown
            step a month; Home/End jump within the week. Enter or Space selects
            the focused day; in range mode Esc clears an in-progress selection
            (start set, end not yet picked). Tab reaches the prev/next month buttons.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The grid uses <Mono>role="grid"</Mono> with{' '}
            <Mono>role="columnheader"</Mono> day-of-week cells and{' '}
            <Mono>role="gridcell"</Mono> days; selected days expose{' '}
            <Mono>aria-selected</Mono>. Prev/Next buttons carry{' '}
            <Mono>aria-label="Previous month"</Mono> /
            {' "Next month"'}. Disabled cells expose{' '}
            <Mono>aria-disabled</Mono> and are removed from the tab order.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus &amp; contrast</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The focused cell shows the ember ring (<Mono>--ring</Mono>). The
            selected day fills with ember and uses <Mono>--ember-fg</Mono> ink
            (never ember-on-ember); "today" is doubled by an ember dot plus
            weight, so it does not rely on colour alone. Disabled cells drop
            opacity to 0.3 and are not focusable.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            Day-cell hover and selection use <Mono>--dur-fast</Mono> transitions;
            month changes swap the grid without animation. Under{' '}
            <Mono>prefers-reduced-motion: reduce</Mono> the component-scoped guard on
            <Mono>.cal-day</Mono> in <Mono>tokens.css</Mono> collapses those
            transitions to instant.
          </div>
        </div>
      </div>

      {/* RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label='dir="rtl" — week reads right-to-left, prev/next still points forward'
        code={`<div dir="rtl">
  <Calendar value={date} onValueChange={setDate} today={today} />
</div>`}
      >
        <div dir="rtl" style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <Calendar
            value={single}
            onValueChange={(d) => setSingle(d as Date)}
            today={today}
          />
          <Calendar
            selectionMode="range"
            value={range}
            onValueChange={(r) => setRange(r as DateRange)}
            today={today}
          />
        </div>
      </Frame>
      <Lede>
        The 7-column grid mirrors automatically — the first day of the week
        lands on the right. Chevrons flip via{' '}
        <Mono>scaleX(-1)</Mono> so &quot;previous month&quot; still points backward in
        the reading direction. Range pills use logical <Mono>border-radius</Mono>{' '}
        so the start cap stays at the inline-start edge. Pass{' '}
        <Mono>locale="ar-EG"</Mono> for Arabic month and weekday names.
      </Lede>

      {/* Anatomy */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: 36 }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div className="stage">
                <Calendar value={single} onValueChange={() => {}} today={today} />
              </div>
              {/* 1 — Header */}
              <div className="lead h" style={{ insetBlockStart: 18, insetInlineStart: -20, inlineSize: 18 }} />
              <div className="pin" style={{ insetBlockStart: 12, insetInlineStart: -22 }}>1</div>
              {/* 2 — Navigation */}
              <div className="lead h" style={{ insetBlockStart: 18, insetInlineEnd: -20, inlineSize: 18 }} />
              <div className="pin" style={{ insetBlockStart: 12, insetInlineEnd: -22 }}>2</div>
              {/* 3 — Day-of-week strip */}
              <div className="lead h" style={{ insetBlockStart: 64, insetInlineStart: -20, inlineSize: 18 }} />
              <div className="pin" style={{ insetBlockStart: 58, insetInlineStart: -22 }}>3</div>
              {/* 4 — Day cell */}
              <div className="lead h" style={{ insetBlockEnd: 28, insetInlineEnd: -20, inlineSize: 18 }} />
              <div className="pin" style={{ insetBlockEnd: 22, insetInlineEnd: -22 }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '24px auto 0' }}>
            <span className="num">1</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Header.</b> Month + year,
              13 px Geist 600. Flanked by prev/next buttons. Buttons are
              disabled at <Mono>minDate</Mono> / <Mono>maxDate</Mono> bounds.
            </span>
            <span className="num">2</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Navigation.</b> 26&times;26
              ghost buttons. Disabled when the nav bound is reached;
              chevrons flip under <Mono>dir="rtl"</Mono>.
            </span>
            <span className="num">3</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Day-of-week strip.</b> 10 px mono
              uppercase. Locale-aware order — ISO Mon-first by default; pass{' '}
              <Mono>weekStartsOn=&#123;0&#125;</Mono> for Sun-first markets.
            </span>
            <span className="num">4</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Day cell.</b> Square, 13 px
              tabular-nums. Today shows an ember dot under the number; selected
              fills with ember; disabled drops opacity to 0.3.
            </span>
          </div>
        </div>
      </div>

      {/* Do/Don't */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — disable invalid dates upfront</div>
          <div className="body" style={{ padding: 14 }}>
            <Calendar
              value={single}
              onValueChange={(d) => setSingle(d as Date)}
              disabled={(d) => d < today}
              today={today}
            />
          </div>
          <div className="note">
            Past dates disabled in a "next available" picker. The user can't
            pick a non-option — no post-click error needed.
          </div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — let users pick then reject</div>
          <div className="body" style={{ padding: 14, flexDirection: 'column', gap: 8, alignItems: 'stretch' }}>
            <div className="cal-input-wrap" style={{ alignSelf: 'center' }}>
              <input
                type="text"
                value="2024-01-04"
                readOnly
                style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
              />
              <button className="cal-input-icon"><Icons.calendar size={14} /></button>
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--danger)', textAlign: 'center' }}>
              That date is not available.
            </div>
          </div>
          <div className="note">
            A red error after the click is worse than a disabled cell. Show
            what's pickable, not what's broken.
          </div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — use range mode for intervals</div>
          <div className="body" style={{ padding: 14 }}>
            <Calendar
              selectionMode="range"
              value={range}
              onValueChange={(r) => setRange(r as DateRange)}
              today={today}
            />
          </div>
          <div className="note">
            Two-click range with hover-preview is the clearest UX for
            report filters and date intervals.
          </div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — use two single pickers for a range</div>
          <div className="body" style={{ padding: 14, flexDirection: 'column', gap: 8, alignItems: 'stretch' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Calendar
                value={new Date(today.getFullYear(), today.getMonth(), 5)}
                onValueChange={() => {}}
                today={today}
              />
              <Calendar
                value={new Date(today.getFullYear(), today.getMonth(), 20)}
                onValueChange={() => {}}
                today={today}
              />
            </div>
          </div>
          <div className="note">
            Two independent pickers can produce invalid ranges (end before start).
            Use <Mono>selectionMode="range"</Mono> — it enforces order automatically.
          </div>
        </div>
      </div>

      {/* 4. API REFERENCE */}
      <SubHead meta="CalendarProps">API reference</SubHead>
      <AutoPropsTable component="Calendar" label="<Calendar />" />
      <PropsTable
        label="DateRange"
        rows={[
          { prop: 'start', type: 'Date | null', description: 'Range start date (null when not yet picked).' },
          { prop: 'end', type: 'Date | null', description: 'Range end date (null until the second click).' },
        ]}
      />
    </Section>
  );
}
