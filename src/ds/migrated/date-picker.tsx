'use client';
// Eidos DS — Components / Date Picker.
// Canonical popover DatePicker (trigger + Calendar grid) as the primary component;
// DateInput (native <input type=date>) as the native alternative.
import * as React from 'react';
import {
  Icons, Frame, Section, SubHead, TabbedCode, PropsTable, AutoPropsTable,
  installTabs, Lede, Mono, DatePicker, DateInput, Calendar,
} from '@/ds/core';

const USAGE_CODE = `import { DatePicker } from "@/components/forge/date-picker"

export function Demo() {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  return (
    <DatePicker
      value={date}
      onValueChange={setDate}
      placeholder="Pick a date"
    />
  );
}`;

const DATE_INPUT_CODE = `import { DateInput } from "@/components/forge/forms"

<DateInput label="Departure date" help="No flights before today." />`;

// ─── Page ──────────────────────────────────────────────────────────────────────

const Page = () => {
  const today = new Date();
  const [single, setSingle] = React.useState<Date | undefined>(undefined);
  const [single2, setSingle2] = React.useState<Date | undefined>(
    new Date(today.getFullYear(), today.getMonth(), 12),
  );
  const [arabic, setArabic] = React.useState<Date | undefined>(undefined);

  // Bounded demo: today → today + 30 days
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30);

  return (
    <Section
      id="date-picker"
      title="Date Picker"
      desc="A trigger button that opens a calendar popover. Single date. Built on the same Calendar primitive, surfaced behind a click-to-open trigger."
    >
      {/* 1. INSTALLATION */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('date-picker')} ariaLabel="package manager" />
      <Lede>
        Composes the Eidos <Mono>Calendar</Mono> with a fixed-position popover trigger.
        Pick the <em>Manual</em> tab to copy the source files.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" code={USAGE_CODE}>
        <DatePicker value={single} onValueChange={setSingle} />
      </Frame>

      {/* 3. EXAMPLES */}
      <div className="ds-examples-rule" style={{ marginBlockStart: 36, marginBlockEnd: 6 }}>
        <span className="t-mono-label">Examples</span>
        <span className="divider" style={{ flex: 1 }} />
      </div>

      {/* Single date */}
      <SubHead meta="default">Single date</SubHead>
      <Frame
        label="click the trigger to open the calendar"
        code={`const [date, setDate] = React.useState<Date | undefined>(undefined);

<DatePicker
  value={date}
  onValueChange={setDate}
  placeholder="Pick a date"
/>`}
      >
        <DatePicker value={single} onValueChange={setSingle} />
      </Frame>
      <p className="t-body" style={{ color: 'var(--fg-muted)', marginBlockStart: 14, maxWidth: '64ch' }}>
        The trigger echoes the picked date in localized format. Click anywhere to open the calendar; click a day to commit and close. Click outside or press <kbd className="kbd">Esc</kbd> to dismiss without changing the value. Today is marked with an ember dot.
      </p>

      {/* With initial value */}
      <SubHead meta="with value">Pre-filled value</SubHead>
      <Frame
        label="value provided — calendar opens on the selected month"
        code={`<DatePicker
  value={new Date(${today.getFullYear()}, ${today.getMonth()}, 12)}
  onValueChange={setDate}
/>`}
      >
        <DatePicker value={single2} onValueChange={setSingle2} />
      </Frame>

      {/* Bounded */}
      <SubHead meta="min · max">Bounded range</SubHead>
      <Frame
        label="cells outside min/max are disabled"
        code={`<DatePicker
  value={date}
  onValueChange={setDate}
  min={today}
  max={new Date(today.getTime() + 30 * 86_400_000)}
/>`}
      >
        <DatePicker
          value={single}
          onValueChange={setSingle}
          min={minDate}
          max={maxDate}
          placeholder="Within 30 days"
        />
      </Frame>

      {/* Sizes */}
      <SubHead meta="sizes">Sizes</SubHead>
      <Frame label="sm · md (default) · lg">
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <DatePicker size="sm" placeholder="Small" />
          <DatePicker placeholder="Medium" />
          <DatePicker size="lg" placeholder="Large" />
        </div>
      </Frame>

      {/* States */}
      <SubHead meta="states">States</SubHead>
      <Frame label="default · invalid · disabled">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <DatePicker placeholder="Default" />
          <DatePicker placeholder="Invalid" invalid />
          <DatePicker placeholder="Disabled" disabled />
        </div>
      </Frame>

      {/* In a form */}
      <SubHead meta="in a form">As a form field</SubHead>
      <Frame
        label="label · trigger · helper"
        code={`<DatePicker
  value={date}
  onValueChange={setDate}
  label="Departure date"
  placeholder="Select date"
/>`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 280 }}>
          <DatePicker
            value={single}
            onValueChange={setSingle}
            label="Departure date"
            placeholder="Select date"
          />
          <span className="t-small" style={{ color: 'var(--fg-muted)' }}>
            No flights before today.
          </span>
        </div>
      </Frame>

      {/* Accessibility */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginBlockStart: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-small" style={{ fontWeight: 600, marginBlockEnd: 10 }}>Keyboard</div>
          <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 14, rowGap: 8, alignItems: 'baseline' }}>
            <dt><kbd className="kbd">Enter</kbd> <kbd className="kbd">Space</kbd></dt>
            <dd className="t-small" style={{ margin: 0, color: 'var(--fg-muted)' }}>Open the calendar popover from the trigger.</dd>
            <dt><kbd className="kbd">Tab</kbd></dt>
            <dd className="t-small" style={{ margin: 0, color: 'var(--fg-muted)' }}>Step through previous month → next month → the focused day cell.</dd>
            <dt><kbd className="kbd">←</kbd><kbd className="kbd">→</kbd><kbd className="kbd">↑</kbd><kbd className="kbd">↓</kbd></dt>
            <dd className="t-small" style={{ margin: 0, color: 'var(--fg-muted)' }}>Move day-by-day or week-by-week across the grid; crossing an edge rolls to the adjacent month.</dd>
            <dt><kbd className="kbd">Enter</kbd> <kbd className="kbd">Space</kbd></dt>
            <dd className="t-small" style={{ margin: 0, color: 'var(--fg-muted)' }}>Commit the focused day; the popover closes and the trigger updates.</dd>
            <dt><kbd className="kbd">Esc</kbd></dt>
            <dd className="t-small" style={{ margin: 0, color: 'var(--fg-muted)' }}>Close without changing the value and return focus to the trigger; a click outside also dismisses it. Disabled days are skipped and never focusable.</dd>
          </dl>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-small" style={{ fontWeight: 600, marginBlockEnd: 6 }}>Screen reader</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)' }}>
            The trigger carries <Mono>aria-haspopup="dialog"</Mono> with <Mono>aria-expanded</Mono> and reads the localized value as its label. The popover is <Mono>role="dialog"</Mono> wrapping a <Mono>role="grid"</Mono> calendar whose days expose <Mono>aria-selected</Mono>. Month buttons are labelled "Previous/Next month".
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-small" style={{ fontWeight: 600, marginBlockEnd: 6 }}>Focus &amp; contrast</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)' }}>
            The trigger shows the ember ring (<Mono>--ring</Mono>), open or focused; invalid swaps to <Mono>--ring-danger</Mono> and should pair with a helper line, not colour alone. The selected day fills ember with <Mono>--ember-fg</Mono> ink (never ember-on-ember). "Today" is doubled by an ember dot plus weight. Focus is trapped inside the panel and restored to the trigger on close.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div className="t-small" style={{ fontWeight: 600, marginBlockEnd: 6 }}>Motion</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)' }}>
            The popover fades and slides 4 px on <Mono>--dur-fast</Mono>; day-cell transitions are short. Under <Mono>prefers-reduced-motion</Mono> the global guard reduces all of these to instant, so the calendar simply appears.
          </div>
        </div>
      </div>

      {/* RTL */}
      <SubHead meta="RTL · العربية">Right-to-left</SubHead>
      <Frame
        label='dir="rtl" — trigger and calendar both mirror'
        code={`<div dir="rtl">
  <DatePicker
    value={date} onValueChange={setDate}
    placeholder="اختر التاريخ"
    locale="ar-EG"
  />
</div>`}
      >
        <div dir="rtl">
          <DatePicker value={arabic} onValueChange={setArabic} placeholder="اختر التاريخ" locale="ar-EG" />
        </div>
      </Frame>
      <p className="t-body" style={{ color: 'var(--fg-muted)', marginBlockStart: 14, maxWidth: '64ch' }}>
        The 7-column grid mirrors automatically. Chevrons flip so "previous month" still points backward in the reading direction. Pass a localized <Mono>locale</Mono> for Arabic / Hebrew month and weekday names. The popover anchors to the inline-end edge in RTL.
      </p>

      {/* Anatomy */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '56px 36px 36px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              className="dp"
              aria-hidden="true"
              style={{
                position: 'relative',
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              {/* Trigger (static mockup) */}
              <div className="dp-trigger is-open" style={{ minWidth: 240, cursor: 'default' }}>
                <span className="ico"><Icons.calendar size={14} /></span>
                <span className="label">
                  {new Date(today.getFullYear(), today.getMonth(), 12)
                    .toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
                <span className="ico"><Icons.chevronDown size={12} /></span>
              </div>
              {/* Popover (static) */}
              <div
                className="dp-pop is-open"
                style={{ position: 'static', marginBlockStart: 6, transform: 'none', transition: 'none', opacity: 1 }}
              >
                <Calendar
                  selectionMode="single"
                  value={new Date(today.getFullYear(), today.getMonth(), 12)}
                  today={new Date(today.getFullYear(), today.getMonth(), 8)}
                />
              </div>

              {/* Leader lines — logical insets so they mirror under RTL */}
              <span className="lead h" style={{ insetBlockStart: 18, insetInlineStart: -28, inlineSize: 24 }} />
              <span className="lead h" style={{ insetBlockStart: 18, insetInlineEnd: -28, inlineSize: 24 }} />
              <span className="lead h" style={{ insetBlockStart: 60, insetInlineStart: -28, inlineSize: 24 }} />
              <span className="lead h" style={{ insetBlockStart: 90, insetInlineEnd: -28, inlineSize: 24 }} />
              <span className="lead h" style={{ insetBlockStart: 200, insetInlineStart: -28, inlineSize: 24 }} />

              {/* Pins — logical insets so they mirror under RTL */}
              <div className="pin" style={{ insetBlockStart: 8, insetInlineStart: -52 }}>1</div>
              <div className="pin" style={{ insetBlockStart: 8, insetInlineEnd: -52 }}>2</div>
              <div className="pin" style={{ insetBlockStart: 50, insetInlineStart: -52 }}>3</div>
              <div className="pin" style={{ insetBlockStart: 80, insetInlineEnd: -52 }}>4</div>
              <div className="pin" style={{ insetBlockStart: 190, insetInlineStart: -52 }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 640, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Trigger.</b> Calendar icon, value (<Mono>tnum</Mono> mono) or placeholder, and a chevron. 36 px tall — matches the input system.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Open state.</b> Ember border + ember-soft 3 px ring; the chevron tints to ember to confirm the popover is mounted.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Popover.</b> Anchored 6 px below the trigger. Fixed-positioned at runtime so it escapes any <Mono>overflow:hidden</Mono> ancestor.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Month header.</b> Title plus prev / next chevrons. Mirrors automatically in RTL.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Calendar grid.</b> Same primitive as the Calendar page — ISO week, today dot, ember-filled selection.</span>
          </div>
        </div>
      </div>

      {/* Decision matrix */}
      <SubHead meta="when to use">Date Picker vs Calendar vs DateInput</SubHead>
      <div className="dd-grid">
        <div className="surface" style={{ padding: 16 }}>
          <div className="ds-h-eyebrow" style={{ marginBottom: 6 }}>DatePicker</div>
          <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.55, marginBottom: 8 }}>One value, picked rarely. The page wants its space back when the user isn't choosing.</div>
          <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-subtle)' }}>Booking · expense entry · scheduling.</div>
        </div>
        <div className="surface" style={{ padding: 16 }}>
          <div className="ds-h-eyebrow" style={{ marginBottom: 6 }}>Calendar (inline)</div>
          <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.55, marginBottom: 8 }}>The calendar IS the page — settings, filters, dashboards where dates are the primary action.</div>
          <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-subtle)' }}>Reports · admin · analytics.</div>
        </div>
        <div className="surface" style={{ padding: 16 }}>
          <div className="ds-h-eyebrow" style={{ marginBottom: 6 }}>DateInput (native)</div>
          <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-muted)', lineHeight: 1.55, marginBottom: 8 }}>Mobile-first forms. Hands the chrome to the OS — zero JS, free OS a11y, but no custom calendar grid.</div>
          <div style={{ fontSize: 'var(--text-base)', color: 'var(--fg-subtle)' }}>Account birthday · expense receipt date.</div>
        </div>
      </div>

      {/* DateInput — native alternative */}
      <SubHead meta="native alternative">DateInput — native date field</SubHead>
      <Lede>
        <Mono>DateInput</Mono> wraps a native <Mono>{'<input type="date">'}</Mono> in the Eidos field shell.
        One DS calendar icon is shown; the browser's native indicator is hidden to fix dark-mode contrast.
        Use this when the OS date picker is acceptable and you want zero JS.
      </Lede>
      <Frame label="native date input — single themed icon" code={DATE_INPUT_CODE}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <DateInput label="Departure date" help="No flights before today." />
          <DateInput label="Invalid" error="Pick a date in the future." defaultValue="2020-01-01" />
          <DateInput label="Disabled" disabled defaultValue="2026-06-01" />
        </div>
      </Frame>

      {/* Do/Don't */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — open on click</div>
          <div className="body">
            <DatePicker value={single2} onValueChange={setSingle2} />
          </div>
          <div className="note">A click on the trigger opens the calendar in place. The user expects this from every picker on the web.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don&apos;t — hide it behind a separate "Open" button</div>
          <div className="body" style={{ flexDirection: 'row', gap: 8 }}>
            <input className="in-control" defaultValue="2025-05-12" readOnly style={{ maxWidth: 140, height: 36, padding: '0 12px', background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-lg)', color: 'var(--fg)', fontFamily: 'var(--font-mono)' }} />
            <button className="btn">Open calendar</button>
          </div>
          <div className="note">Two targets, two clicks, more confusion. The trigger IS the field — keep it as one element.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — echo the chosen date in the trigger</div>
          <div className="body">
            <button className="dp-trigger" type="button">
              <span className="ico"><Icons.calendar size={14} /></span>
              <span className="label">
                {new Date(today.getFullYear(), today.getMonth(), 12)
                  .toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <span className="ico"><Icons.chevronDown size={12} /></span>
            </button>
          </div>
          <div className="note">After the user picks a date, the trigger reads the value back in localized format. No need to reopen to verify.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don&apos;t — leave the trigger generic after a pick</div>
          <div className="body">
            <button className="dp-trigger" type="button">
              <span className="ico"><Icons.calendar size={14} /></span>
              <span className="label placeholder">Date selected</span>
              <span className="ico"><Icons.chevronDown size={12} /></span>
            </button>
          </div>
          <div className="note">"Date selected" forces the user to reopen the picker to remember what they chose. Always echo the value.</div>
        </div>
      </div>

      {/* API reference */}
      <SubHead meta="DatePickerProps">API reference</SubHead>
      <AutoPropsTable component="DatePicker" label="<DatePicker />" />
      <PropsTable
        label="<DateInput />"
        rows={[
          { prop: 'label', type: 'ReactNode', description: 'Field label rendered above the control.' },
          { prop: 'help', type: 'ReactNode', description: 'Helper text under the control (hidden when error is set).' },
          { prop: 'error', type: 'ReactNode', description: 'Error message — sets aria-invalid and renders in the danger tone.' },
          { prop: '...input', type: 'InputHTMLAttributes', description: 'All native <input type="date"> attributes (min, max, defaultValue, value, onChange, disabled, …).' },
        ]}
      />
    </Section>
  );
};

export default Page;
