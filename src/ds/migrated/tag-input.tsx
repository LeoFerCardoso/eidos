'use client';
// Eidos DS — Components / Tag Input
//
// Page standard (DS-PAGE-STANDARD §2.2):
//   1. Installation    (TabbedCode)
//   2. Usage           (Frame + code)
//   3. Variants        (Basic · Sizes · Validation · States)
//   4. In context      (pipeline-filter form)
//   5. Accessibility   (keyboard / ARIA / contrast / motion)
//   6. RTL             (dir="rtl" live Frame)
//   7. Anatomy         (visual diagram)
//   8. Do / Don't      (dd-grid)
//   9. API reference   (AutoPropsTable)
import * as React from 'react';
import {
  Icons,
  Frame,
  Section,
  SubHead,
  Lede,
  Mono,
  PropsTable,
  TagInput,
} from '@/ds/core';
import { ComponentInstall } from '@/ds/core';

// ==========================================================================
// 2. USAGE — the minimal "hello world" of <TagInput>
// ==========================================================================
const USAGE_CODE = `import { TagInput } from "@/components/forge/tag-input"

export function Demo() {
  const [tags, setTags] = React.useState<string[]>([])
  return (
    <TagInput
      value={tags}
      onValueChange={setTags}
      placeholder="Add tag…"
    />
  )
}`;

const CODE_VALIDATION = `<TagInput
  value={emails}
  onValueChange={setEmails}
  placeholder="Add an email…"
  maxTags={5}
  validate={(t) =>
    /^[^@\\s]+@[^@\\s.]+\\.[^@\\s]+$/.test(t)
      ? null
      : "Not a valid email address"
  }
/>`;

// ==========================================================================
// PAGE
// ==========================================================================
export default function TagInputPage() {
  // Controlled state for live demos
  const [topics, setTopics] = React.useState(['identity', 'auth', 'sessions']);
  const [emails, setEmails] = React.useState(['lead@forge.io']);
  const [teams, setTeams] = React.useState(['platform', 'identity']);
  const [envs, setEnvs] = React.useState(['prod-east-1']);
  const [rtlTags, setRtlTags] = React.useState(['الهوية', 'المصادقة', 'الجلسات']);

  // "Paste to split" demo — performs the documented paste behaviour live.
  // SAMPLE is the raw string a user would paste; splitTags mirrors the
  // component's own comma/newline parser so the chips appear for real.
  const SAMPLE = 'analytics, billing, search-api\ndeploy-bot';
  const [pasted, setPasted] = React.useState<string[]>([]);
  const splitTags = (raw: string) =>
    Array.from(
      new Set(
        raw
          .split(/[,\n]+/)
          .map((s) => s.trim())
          .filter(Boolean),
      ),
    );

  return (
    <Section
      id="tag-input"
      num="36"
      title="Tag Input"
      desc="Free-entry list field. Type + Enter or comma to add a tag chip; Backspace on empty removes the last. Paste splits on comma or newline."
    >
      {/* ==================================================================
          1. INSTALLATION
          ================================================================== */}
      <ComponentInstall slug="tag-input" />

      {/* ==================================================================
          2. USAGE
          ================================================================== */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" code={USAGE_CODE}>
        <div style={{ width: '100%', maxWidth: 460 }}>
          <TagInput
            value={topics}
            onValueChange={setTopics}
            placeholder="Add topic…"
          />
        </div>
      </Frame>
      <Lede>
        The field sits inside the standard <Mono>.in-group</Mono> shell so it shares the same focus ring and baseline as every other Eidos input. Chips wrap naturally; clicking anywhere in the field focuses the bare input.
      </Lede>

      {/* ------------------------------------------------------------------
          Paste-to-split — the signature behaviour, performed live. The page
          documents that paste splits on comma / newline; this lets the reader
          watch it happen. splitTags mirrors the component's own parser so the
          demo is true to the shipped code, not a re-implementation.
          ------------------------------------------------------------------ */}
      <Frame label="paste a comma / newline list — watch it become chips">
        <div style={{ width: '100%', maxWidth: 540 }}>
          <div
            className="surface"
            style={{
              padding: 12,
              marginBlockEnd: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <code
              className="t-small"
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--fg-muted)',
                whiteSpace: 'pre-wrap',
                flex: '1 1 200px',
                minInlineSize: 0,
              }}
            >
              {SAMPLE.replace(/\n/g, ' ⏎ ')}
            </code>
            <button
              type="button"
              className="btn ember sm"
              onClick={() => setPasted(splitTags(SAMPLE))}
            >
              <Icons.clipboard size={13} /> Paste sample
            </button>
            {pasted.length > 0 && (
              <button
                type="button"
                className="btn link sm"
                onClick={() => setPasted([])}
              >
                Reset
              </button>
            )}
          </div>
          <TagInput
            label="Pasted services"
            value={pasted}
            onValueChange={setPasted}
            placeholder="…or paste a list here yourself"
          />
        </div>
      </Frame>
      <Lede>
        One paste, four chips — the field splits on every comma and newline,
        trims each value, and drops blanks and duplicates, so a clipboard dump
        from a spreadsheet column lands clean. The same parser runs whether you
        use the Paste-sample button or paste into the field directly.
      </Lede>

      {/* ==================================================================
          3. VARIANTS / SIZES / STATES — examples divider
          ================================================================== */}
      <div
        className="ds-examples-rule"
        style={{ marginBlockStart: 36, marginBlockEnd: 6 }}
      >
        <span className="t-mono-label">Examples</span>
        <span className="divider" style={{ flex: 1 }} />
      </div>

      {/* ---- Sizes ---- */}
      <SubHead meta="sm · md · lg">Sizes</SubHead>
      <Frame label="Match the surrounding form chrome">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            width: '100%',
            maxWidth: 540,
          }}
        >
          <div>
            <div
              className="t-small"
              style={{ color: 'var(--fg-muted)', marginBottom: 6 }}
            >
              Small <Mono>28px</Mono>
            </div>
            <TagInput
              defaultValue={['react', 'vue', 'svelte']}
              size="sm"
              placeholder="Add tag…"
            />
          </div>
          <div>
            <div
              className="t-small"
              style={{ color: 'var(--fg-muted)', marginBottom: 6 }}
            >
              Default <Mono>36px</Mono>
            </div>
            <TagInput
              defaultValue={['react', 'vue', 'svelte']}
              size="md"
              placeholder="Add tag…"
            />
          </div>
          <div>
            <div
              className="t-small"
              style={{ color: 'var(--fg-muted)', marginBottom: 6 }}
            >
              Large <Mono>44px</Mono>
            </div>
            <TagInput
              defaultValue={['react', 'vue', 'svelte']}
              size="lg"
              placeholder="Add tag…"
            />
          </div>
        </div>
      </Frame>

      {/* ---- Validation ---- */}
      <SubHead meta="validate · maxTags">Validation</SubHead>
      <Frame
        label="Reject malformed values at commit time; cap the total"
        code={CODE_VALIDATION}
      >
        <div style={{ width: '100%', maxWidth: 540 }}>
          <label className="in-label" htmlFor="tg-em">
            Recipients <span className="opt">(max 5 emails)</span>
          </label>
          <TagInput
            id="tg-em"
            value={emails}
            onValueChange={setEmails}
            placeholder="Add an email…"
            maxTags={5}
            validate={(t) =>
              /^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(t)
                ? null
                : 'Not a valid email address'
            }
            help={`Try typing ${String.fromCharCode(8220)}not-an-email${String.fromCharCode(8221)} to see the inline error.`}
          />
        </div>
      </Frame>
      <Lede>
        The validator fires at commit time, not on every keystroke — flagging input mid-type feels nagging. Pass a function that returns <Mono>null</Mono> for valid or an error message string for invalid. <Mono>maxTags</Mono> caps the count and surfaces a live counter.
      </Lede>

      {/* ---- States ---- */}
      <SubHead meta="empty · default · invalid · duplicate · at-max · disabled · readonly">
        States
      </SubHead>
      <Frame label="Every state the field renders — populated, empty, error, duplicate, capped, locked">
        <div className="ds-grid cols-2" style={{ width: '100%' }}>
          <div>
            <label className="in-label">Empty</label>
            <TagInput defaultValue={[]} placeholder="Add tag…" />
          </div>
          <div>
            <label className="in-label">Default</label>
            <TagInput defaultValue={['react']} placeholder="Add tag…" />
          </div>
          <div>
            <label className="in-label">Invalid (committed error)</label>
            {/* Static render of the committed-error state: .in-group.is-invalid
                + .in-error, exactly what the live component emits on a failed
                commit. Read-only so the docs preview is stable. */}
            <div className="in-field">
              <div className="in-group is-invalid">
                <div className="in-tags">
                  <span className="in-tag">
                    ada@x.io{' '}
                    <button
                      type="button"
                      className="tag-x"
                      tabIndex={-1}
                      aria-label="Remove ada@x.io"
                    >
                      <Icons.x size={11} />
                    </button>
                  </span>
                  <input
                    className="in-control"
                    defaultValue="not-an-email"
                    aria-invalid="true"
                    readOnly
                  />
                </div>
              </div>
              <div className="in-helprow">
                <span className="in-error" role="alert">
                  <Icons.alert size={12} />
                  Not a valid email address
                </span>
              </div>
            </div>
          </div>
          <div>
            <label className="in-label">Duplicate rejected</label>
            {/* The component rejects a repeat on commit: the input keeps the
                duplicate text and an "Already added" error shows — exactly the
                behaviour the Don't card warns against allowing. */}
            <div className="in-field">
              <div className="in-group is-invalid">
                <div className="in-tags">
                  <span className="in-tag">
                    urgent{' '}
                    <button
                      type="button"
                      className="tag-x"
                      tabIndex={-1}
                      aria-label="Remove urgent"
                    >
                      <Icons.x size={11} />
                    </button>
                  </span>
                  <input
                    className="in-control"
                    defaultValue="urgent"
                    aria-invalid="true"
                    readOnly
                  />
                </div>
              </div>
              <div className="in-helprow">
                <span className="in-error" role="alert">
                  <Icons.alert size={12} />
                  Already added
                </span>
              </div>
            </div>
          </div>
          <div>
            <label className="in-label">At max (3 / 3)</label>
            <TagInput
              defaultValue={['a', 'b', 'c']}
              maxTags={3}
              placeholder="No more tags"
            />
          </div>
          <div>
            <label className="in-label">Disabled</label>
            <TagInput defaultValue={['locked', 'readonly']} disabled />
          </div>
          <div>
            <label className="in-label">Readonly</label>
            <TagInput
              defaultValue={['prod-east-1', 'prod-west-2']}
              readOnly
            />
          </div>
        </div>
      </Frame>
      <Lede>
        The <Mono>invalid</Mono> and <Mono>duplicate</Mono> cells mirror what the
        live field emits on a failed commit: the group flips to{' '}
        <Mono>.is-invalid</Mono> (danger ring), the offending text stays in the
        input, and a <Mono>role="alert"</Mono> <Mono>.in-error</Mono> row names the
        reason — a rejected validator says why, a repeat says <Mono>Already added</Mono>.
        At the cap, the input is disabled and the <Mono>n / max</Mono> counter reads
        its ceiling.
      </Lede>

      {/* ==================================================================
          4. IN CONTEXT
          ================================================================== */}
      <SubHead meta="real surface">In context</SubHead>
      <Lede up>
        Tag Input inside a pipeline-filter form — one field for team slugs, one capped at 4 environment names.
      </Lede>
      <Frame label="pipeline filter">
        <div
          className="surface"
          style={{ padding: 20, inlineSize: '100%', maxInlineSize: 480 }}
        >
          <div className="t-mono-label" style={{ marginBlockEnd: 16 }}>
            Pipeline filter
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="in-label" htmlFor="ctx-teams">
                Teams
              </label>
              <TagInput
                id="ctx-teams"
                value={teams}
                onValueChange={setTeams}
                placeholder="Add team…"
                help="Filter runs by owning team."
              />
            </div>
            <div>
              <label className="in-label" htmlFor="ctx-envs">
                Environments
              </label>
              <TagInput
                id="ctx-envs"
                value={envs}
                onValueChange={setEnvs}
                placeholder="Add environment…"
                maxTags={4}
              />
            </div>
          </div>
        </div>
      </Frame>

      {/* ==================================================================
          5. ACCESSIBILITY
          ================================================================== */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 12 }}>Keyboard</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {(
              [
                { keys: ['Enter'], alt: [','], act: 'Commit the typed text as a chip.' },
                { keys: ['Backspace'], act: 'On an empty caret, remove the last chip.' },
                { keys: ['←'], act: 'From the empty input, focus the last chip’s remove button.' },
                { keys: ['←', '→'], act: 'Move focus between chip remove buttons; → past the last returns to the input.' },
                { keys: ['Enter'], alt: ['Space', 'Delete'], act: 'On a focused remove button, delete that chip and shift focus.' },
              ] as { keys: string[]; alt?: string[]; act: string }[]
            ).map((r, i) => (
              <div className="kbd-row" key={i} style={{ paddingInline: 0 }}>
                <span className="kbd-chord">
                  {r.keys.map((k) => (
                    <kbd className="kbd" key={k}>
                      {k}
                    </kbd>
                  ))}
                  {r.alt && (
                    <>
                      <span
                        className="t-small"
                        style={{ color: 'var(--fg-faint)', marginInline: 2 }}
                      >
                        /
                      </span>
                      {r.alt.map((k) => (
                        <kbd className="kbd" key={k}>
                          {k}
                        </kbd>
                      ))}
                    </>
                  )}
                </span>
                <span
                  className="label t-small"
                  style={{ color: 'var(--fg-muted)' }}
                >
                  {r.act}
                </span>
              </div>
            ))}
          </div>
          <div
            className="t-small"
            style={{ color: 'var(--fg-faint)', marginTop: 10, lineHeight: 1.55 }}
          >
            Paste splits on comma and newline automatically; the input keeps a
            min-width of 80&nbsp;px so it stays reachable when chips fill multiple
            rows.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div
            className="t-small"
            style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}
          >
            The wrapper is a <Mono>role="group"</Mono> labelled by its{' '}
            <Mono>label</Mono> prop or an outer <Mono>htmlFor</Mono> link. Each
            chip&apos;s remove button carries an explicit{' '}
            <Mono>aria-label</Mono> ("Remove identity"). A visually-hidden{' '}
            <Mono>aria-live="polite"</Mono> region announces every change as
            "Added&nbsp;identity" / "Removed&nbsp;identity", and the{' '}
            <Mono>n / max</Mono> counter is polite too. Errors are wired via{' '}
            <Mono>aria-describedby</Mono> and <Mono>aria-invalid</Mono>.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus &amp; contrast</div>
          <div
            className="t-small"
            style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}
          >
            The <Mono>.in-group</Mono> shell shows the ember focus ring (
            <Mono>--ring</Mono>) when any child receives focus. Each chip&apos;s
            remove button shows its own ember ring on keyboard navigation. Chip
            text is <Mono>var(--fg)</Mono> on <Mono>var(--surface-hover)</Mono> —
            both pairs meet WCAG AA (4.5:1).
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div
            className="t-small"
            style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}
          >
            Chips are added and removed instantly — there is no enter/leave
            animation, so a screen full of tags never lurches. The only
            transitions are the remove button’s hover/focus colour (
            <Mono>--dur-fast</Mono>, eased by <Mono>--ease</Mono>) and the
            group’s focus ring. Under{' '}
            <Mono>prefers-reduced-motion: reduce</Mono> the <Mono>.in-group</Mono>{' '}
            transition is set to <Mono>none</Mono>, so the ring snaps in with no
            fade.
          </div>
        </div>
      </div>

      {/* ==================================================================
          6. RTL
          ================================================================== */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label='dir="rtl" — chips wrap right-to-left; remove button stays on the trailing edge'
        row
      >
        <div dir="rtl" style={{ width: '100%', maxWidth: 540 }}>
          <label className="in-label" htmlFor="tg-rtl">
            المواضيع (Topics)
          </label>
          <TagInput
            id="tg-rtl"
            value={rtlTags}
            onValueChange={setRtlTags}
            placeholder="أضف موضوعًا…"
          />
        </div>
      </Frame>
      <Lede>
        The chip strip uses <Mono>flex-wrap</Mono> with no explicit direction. Under <Mono>dir="rtl"</Mono> the first chip lands at the visual right and new chips wrap to the next row&apos;s right edge automatically. The remove button stays on the chip&apos;s trailing side via the chip&apos;s own internal flex — no directional overrides needed. Logical CSS properties (<Mono>padding-inline</Mono>, <Mono>inset-inline</Mono>) handle the rest.
      </Lede>

      {/* ==================================================================
          7. ANATOMY
          ================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head">
          <span className="label">
            Group · chip strip · bare input — all in one shared focus ring
          </span>
        </div>
        <div className="ds-frame-body" style={{ padding: '64px 56px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              className="stage"
              style={{ position: 'relative', width: 460 }}
              aria-hidden="true"
            >
              <TagInput
                value={['identity', 'auth']}
                onValueChange={() => {}}
                placeholder="Add topic…"
              />
              {/* Leader lines */}
              <span
                className="lead h"
                style={{
                  top: '50%',
                  left: -28,
                  width: 24,
                  transform: 'translateY(-50%)',
                }}
              />
              <span
                className="lead v"
                style={{ top: -22, left: '22%', height: 18 }}
              />
              <span
                className="lead v"
                style={{ top: -22, left: '55%', height: 18 }}
              />
              <span
                className="lead v"
                style={{ top: -22, right: 60, height: 18 }}
              />
              <span
                className="lead v"
                style={{
                  bottom: -22,
                  left: '50%',
                  height: 18,
                  transform: 'translateX(-50%)',
                }}
              />
              {/* Numbered pins */}
              <div
                className="pin"
                style={{
                  top: '50%',
                  left: -52,
                  transform: 'translateY(-50%)',
                }}
              >
                1
              </div>
              <div
                className="pin"
                style={{ top: -42, left: '22%', transform: 'translateX(-50%)' }}
              >
                2
              </div>
              <div
                className="pin"
                style={{ top: -42, left: '55%', transform: 'translateX(-50%)' }}
              >
                3
              </div>
              <div
                className="pin"
                style={{ top: -42, right: 60, transform: 'translateX(50%)' }}
              >
                4
              </div>
              <div
                className="pin"
                style={{
                  bottom: -42,
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              >
                5
              </div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Group.</b>{' '}
              <Mono>.in-group</Mono> shell renders the border and shared focus
              ring. Clicking anywhere inside focuses the bare input.
            </span>
            <span className="num">2</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Tag strip.</b>{' '}
              <Mono>.in-tags</Mono> — a flex-wrap row that holds chips + input
              together.
            </span>
            <span className="num">3</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Chip.</b> <Mono>.in-tag</Mono>{' '}
              with an embedded <Mono>.tag-x</Mono> remove button carrying an
              explicit <Mono>aria-label</Mono>.
            </span>
            <span className="num">4</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Input.</b> Bare{' '}
              <Mono>.in-control</Mono> — no chrome of its own. Grows with
              content; min-width 80 px so it stays reachable.
            </span>
            <span className="num">5</span>
            <span>
              <b style={{ color: 'var(--fg)' }}>Keys.</b>{' '}
              <Mono>Enter</Mono> / <Mono>,</Mono> commits;{' '}
              <Mono>Backspace</Mono> on empty removes the last chip; paste splits
              on comma / newline.
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================================
          8. DO / DON'T
          ================================================================== */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        {/* DO: validate at commit */}
        <div className="dd-card do">
          <div className="head">
            <Icons.check size={12} /> Do — validate at commit, not on every keystroke
          </div>
          <div className="body">
            <div className="in-field" style={{ width: 280 }}>
              <label className="in-label">Recipients</label>
              <div className="in-group">
                <div className="in-tags">
                  <span className="in-tag">
                    ada@x.io{' '}
                    <button
                      type="button"
                      className="tag-x"
                      tabIndex={-1}
                      aria-label="Remove ada@x.io"
                    >
                      <Icons.x size={10} />
                    </button>
                  </span>
                  <input
                    className="in-control"
                    defaultValue="bob@"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="note">
            User is still typing — flagging before they finish feels nagging. Validate on Enter, then surface the reason clearly.
          </div>
        </div>

        {/* DON'T: allow duplicates */}
        <div className="dd-card dont">
          <div className="head">
            <Icons.x size={12} /> Don&apos;t — allow duplicate tags
          </div>
          <div className="body">
            <div className="in-field" style={{ width: 280 }}>
              <label className="in-label">Labels</label>
              <div className="in-group">
                <div className="in-tags">
                  <span className="in-tag">
                    urgent{' '}
                    <button
                      type="button"
                      className="tag-x"
                      tabIndex={-1}
                      aria-label="Remove urgent"
                    >
                      <Icons.x size={10} />
                    </button>
                  </span>
                  <span className="in-tag">
                    urgent{' '}
                    <button
                      type="button"
                      className="tag-x"
                      tabIndex={-1}
                      aria-label="Remove urgent"
                    >
                      <Icons.x size={10} />
                    </button>
                  </span>
                  <input
                    className="in-control"
                    placeholder="Add label…"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="note">
            Two chips with the same value is always a bug. Catch on commit, show "Already added", clear the input. Trim whitespace before comparing.
          </div>
        </div>

        {/* DO: make every chip removable */}
        <div className="dd-card do">
          <div className="head">
            <Icons.check size={12} /> Do — make every chip individually removable
          </div>
          <div className="body">
            <div className="in-field" style={{ width: 280 }}>
              <label className="in-label">Skills</label>
              <div className="in-group">
                <div className="in-tags">
                  {['React', 'TypeScript', 'CSS'].map((s) => (
                    <span key={s} className="in-tag">
                      {s}{' '}
                      <button
                        type="button"
                        className="tag-x"
                        tabIndex={-1}
                        aria-label={`Remove ${s}`}
                      >
                        <Icons.x size={10} />
                      </button>
                    </span>
                  ))}
                  <input className="in-control" placeholder="Add…" readOnly />
                </div>
              </div>
            </div>
          </div>
          <div className="note">
            A <Mono>×</Mono> on each chip plus Backspace on empty for keyboard users. Both paths matter.
          </div>
        </div>

        {/* DON'T: use Tag Input for fixed-set selection */}
        <div className="dd-card dont">
          <div className="head">
            <Icons.x size={12} /> Don&apos;t — use Tag Input for a fixed option set
          </div>
          <div className="body">
            <div className="in-field" style={{ width: 280 }}>
              <label className="in-label">Status (fixed set)</label>
              <div className="in-group">
                <div className="in-tags">
                  <span className="in-tag">
                    Active{' '}
                    <button
                      type="button"
                      className="tag-x"
                      tabIndex={-1}
                      aria-label="Remove Active"
                    >
                      <Icons.x size={10} />
                    </button>
                  </span>
                  <input
                    className="in-control"
                    placeholder="Pending / Cancelled / …"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="note">
            If the user can only pick from a known list, reach for Combobox or a Checkbox group. Tag Input promises free entry — honouring that contract is the point.
          </div>
        </div>

        {/* DO: cap total when it matters */}
        <div className="dd-card do">
          <div className="head">
            <Icons.check size={12} /> Do — show a counter when the cap matters
          </div>
          <div className="body">
            <div className="in-field" style={{ width: 280 }}>
              <label className="in-label">Recipients</label>
              <div className="in-group">
                <div className="in-tags">
                  {['ada@x.io', 'bob@x.io', 'cher@x.io'].map((e) => (
                    <span key={e} className="in-tag">
                      {e}{' '}
                      <button
                        type="button"
                        className="tag-x"
                        tabIndex={-1}
                        aria-label={`Remove ${e}`}
                      >
                        <Icons.x size={10} />
                      </button>
                    </span>
                  ))}
                  <input className="in-control" placeholder="Add…" readOnly />
                </div>
              </div>
              <div className="in-helprow">
                <span className="in-help">Up to 5 recipients</span>
                <span className="in-counter">3 / 5</span>
              </div>
            </div>
          </div>
          <div className="note">
            A live counter (<Mono>3 / 5</Mono>) sets the ceiling so the user knows how close they are without guessing.
          </div>
        </div>

        {/* DON'T: hide input when chips fill row */}
        <div className="dd-card dont">
          <div className="head">
            <Icons.x size={12} /> Don&apos;t — clip the input when chips fill the row
          </div>
          <div className="body">
            <div className="in-field" style={{ width: 280 }}>
              <label className="in-label">Labels</label>
              <div className="in-group" style={{ maxHeight: 38, overflow: 'hidden' }}>
                <div className="in-tags" style={{ flexWrap: 'nowrap' }}>
                  {['urgent', 'backend', 'api', 'infra'].map((t) => (
                    <span key={t} className="in-tag">
                      {t}{' '}
                      <button
                        type="button"
                        className="tag-x"
                        tabIndex={-1}
                        aria-label={`Remove ${t}`}
                      >
                        <Icons.x size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="note">
            The input must always be reachable. Use <Mono>flex-wrap</Mono> so chips wrap and the input stays at the trailing edge.
          </div>
        </div>
      </div>

      {/* ==================================================================
          9. API REFERENCE
          ================================================================== */}
      <SubHead meta="TagInputProps">API reference</SubHead>
      <PropsTable
        label="<TagInput />"
        rows={[
          { prop: 'value', type: 'string[]', description: 'Controlled tag list. Pair with onValueChange.' },
          { prop: 'defaultValue', type: 'string[]', description: 'Uncontrolled initial list. Ignored when value is provided.' },
          { prop: 'onValueChange', type: '(tags: string[]) => void', description: 'Fires when tags are added or removed.' },
          { prop: 'placeholder', type: 'string', default: '"Add tag…"', description: 'Input placeholder shown only when the tag list is empty.' },
          { prop: 'maxTags', type: 'number', description: 'Hard cap on the total count. Shows a n / max counter. Disables input once reached.' },
          { prop: 'validate', type: '(tag: string) => string | null', description: 'Commit-time validator. Return null for valid; return an error string for invalid.' },
          { prop: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Group height: sm = 28 px, md = 36 px, lg = 44 px.' },
          { prop: 'disabled', type: 'boolean', default: 'false', description: 'Locks the field — no input, no remove.' },
          { prop: 'readOnly', type: 'boolean', default: 'false', description: 'Shows tags but prevents editing or removal.' },
          { prop: 'label', type: 'string', description: 'Accessible label for the role="group" wrapper. If omitted, use an outer <label htmlFor>.' },
          { prop: 'id', type: 'string', description: 'ID applied to the inner <input>. Connect an outer <label htmlFor>.' },
          { prop: 'help', type: 'string', description: 'Helper text shown below the field when there is no error.' },
          { prop: 'className', type: 'string', description: 'Extra classes merged onto the root wrapper via cn().' },
        ]}
      />
    </Section>
  );
}
