'use client';
import * as React from 'react';
import {
  AutoPropsTable,
  Icons,
  Frame,
  Section,
  SubHead,
  TabbedCode,
  installTabs,
  Lede,
  Mono,
} from '@/ds/core';
import { HoverCard } from '@eidos/ui';

// ── Demo content helpers (shared across sections) ─────────────────────────────

const AvatarCircle = ({ initials, size = 40 }: { initials: string; size?: number }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, var(--ember), var(--ember-deep))',
      color: 'var(--ember-fg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 600,
      fontSize: size > 32 ? 'var(--text-body)' : 'var(--text-xs)',
      flexShrink: 0,
      fontFamily: 'var(--font-mono)',
      fontVariantNumeric: 'tabular-nums',
    }}
  >
    {initials}
  </div>
);

const ProfileCard = ({ name = 'Ada Lovelace', handle = '@ada', bio = 'Working on the deploy pipeline. Reachable on #platform-eng.' }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
    <AvatarCircle initials={name.split(' ').map(n => n[0]).join('')} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontWeight: 600, color: 'var(--fg)', fontSize: 'var(--text-body)' }}>{name}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', marginTop: 2 }}>
        {handle} · Eidos Platform
      </div>
      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', marginTop: 8, lineHeight: 1.5 }}>{bio}</div>
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <span className="pill">Online</span>
        <span className="pill ember">Reviewer</span>
      </div>
    </div>
  </div>
);

const MentionLink = ({ label = '@ada', ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { label?: string }) => (
  <a
    href="#"
    onClick={(e) => e.preventDefault()}
    style={{ color: 'var(--ember)', textDecoration: 'none', fontWeight: 500 }}
    {...props}
  >
    {label}
  </a>
);

// ── Code samples ──────────────────────────────────────────────────────────────

const USAGE_CODE = `import { HoverCard } from "@/components/forge/hover-card"

export function Demo() {
  return (
    <HoverCard
      trigger={<a href="/users/ada">@ada</a>}
    >
      {/* rich preview content */}
      <ProfileCard name="Ada Lovelace" handle="@ada" />
    </HoverCard>
  );
}`;

const LINK_PREVIEW_CODE = `<HoverCard
  minWidth={280}
  trigger={<a href="https://docs.forge.dev/deploy">docs.forge.dev/deploy</a>}
>
  <div>
    <p className="t-mono-label">docs.forge.dev</p>
    <strong>Deploying a service</strong>
    <p>Six steps from local change to production traffic.</p>
  </div>
</HoverCard>`;

const RTL_CODE = `<div dir="rtl">
  {/* Panel anchors to insetInlineStart: 0, so it opens
      aligned to the anchor's start edge — the right in RTL.
      Content text right-aligns automatically. */}
  <HoverCard trigger={<a href="/users/ada">@ada</a>}>
    <ProfileCard name="Ada Lovelace" handle="@ada" />
  </HoverCard>
</div>`;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HoverCardPage() {
  return (
    <Section
      id="hover-card"
      title="Hover Card"
      desc="A rich preview that opens on hover or focus. Larger than a Tooltip, smaller than a Popover, never for actions."
    >
      {/* ── 1. INSTALLATION ─────────────────────────────────────────────── */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('hover-card')} ariaLabel="package manager" />
      <Lede>
        The CLI copies <Mono>hover-card.tsx</Mono> and its CSS into your repo so you can edit them directly — Eidos is source-shipped, not a black-box dependency. Pick the <em>Manual</em> tab to copy the source files instead.
      </Lede>

      {/* ── 2. USAGE ────────────────────────────────────────────────────── */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="hover or focus @ada — card appears after 300ms" code={USAGE_CODE}>
        <div style={{ padding: '20px 24px', fontSize: 'var(--text-body)', lineHeight: 1.6, color: 'var(--fg-muted)' }}>
          Just paired with{' '}
          <HoverCard trigger={<MentionLink />}>
            <ProfileCard />
          </HoverCard>
          {' '}on the new pipeline.
        </div>
      </Frame>
      <Lede>
        Pass the trigger as a <Mono>trigger</Mono> prop and the rich preview as <Mono>children</Mono>. The card opens 300ms after the pointer enters and 200ms after it leaves — long enough to ignore a passing cursor, short enough to feel responsive. Keyboard users get the same affordance: focusing the trigger opens the card; blurring or pressing <Mono>Escape</Mono> closes it.
      </Lede>

      {/* ── EXAMPLES divider ─────────────────────────────────────────────── */}
      <div style={{ marginTop: 36, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      {/* ── Profile card ─────────────────────────────────────────────────── */}
      <SubHead meta="profile preview">Profile card</SubHead>
      <Frame label="@-mention · avatar + name + bio + status pills" code={`<HoverCard trigger={<a href="#">@ada</a>}>
  <ProfileCard name="Ada Lovelace" handle="@ada" />
</HoverCard>`}>
        <div style={{ padding: '24px', fontSize: 'var(--text-body)', lineHeight: 1.6, color: 'var(--fg-muted)' }}>
          Just paired with{' '}
          <HoverCard trigger={<MentionLink />}>
            <ProfileCard />
          </HoverCard>
          {' '}on the new pipeline. Hover the name to see her card.
        </div>
      </Frame>

      {/* ── Link preview ─────────────────────────────────────────────────── */}
      <SubHead meta="link preview">Link preview</SubHead>
      <Frame label="inline link · peek title + description before clicking" code={LINK_PREVIEW_CODE}>
        <div style={{ padding: '16px 24px', fontSize: 'var(--text-body)', lineHeight: 1.6, color: 'var(--fg-muted)' }}>
          The deploy guide lives at{' '}
          <HoverCard
            minWidth={280}
            trigger={
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{ color: 'var(--ember)', textDecoration: 'underline' }}
              >
                docs.forge.dev/deploy
              </a>
            }
          >
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                docs.forge.dev
              </div>
              <div style={{ fontWeight: 600, color: 'var(--fg)', fontSize: 'var(--text-body)', marginBottom: 4 }}>Deploying a service</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', lineHeight: 1.5 }}>
                Six steps from local change to production traffic — config, build, push, deploy, verify, rollback.
              </div>
            </div>
          </HoverCard>
          {' '}— hover to peek before you commit to the click.
        </div>
      </Frame>

      {/* ── 3. IN CONTEXT ───────────────────────────────────────────────── */}
      <SubHead meta="real surface">In context</SubHead>
      <Frame label="activity feed — multiple @-mentions in a realistic card">
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '16px 20px',
            maxWidth: 480,
            margin: '0 auto',
            fontFamily: 'var(--font)',
          }}
        >
          <div style={{ fontWeight: 600, color: 'var(--fg)', marginBottom: 16, fontSize: 'var(--text-sm)' }}>Recent activity</div>
          {[
            { name: 'Ada Lovelace', handle: '@ada', action: 'approved PR #7421', initials: 'AL', time: '2m ago' },
            { name: 'Grace Hopper', handle: '@grace', action: 'deployed pix-router v2.7', initials: 'GH', time: '14m ago' },
            { name: 'Margaret Hamilton', handle: '@margaret', action: 'opened incident #312', initials: 'MH', time: '1h ago' },
          ].map(({ name, handle, action, initials, time }) => (
            <div
              key={handle}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderTop: '1px solid var(--border)' }}
            >
              <AvatarCircle initials={initials} size={32} />
              <div style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', lineHeight: 1.5 }}>
                <HoverCard
                  trigger={
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      style={{ color: 'var(--fg)', fontWeight: 500, textDecoration: 'none' }}
                    >
                      {name}
                    </a>
                  }
                >
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <AvatarCircle initials={initials} size={36} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--fg)', fontSize: 'var(--text-body)' }}>{name}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', marginTop: 2 }}>{handle} · Eidos Platform</div>
                    </div>
                  </div>
                </HoverCard>
                {' '}{action}
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-faint)', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{time}</span>
            </div>
          ))}
        </div>
      </Frame>

      {/* ── Decision matrix ─────────────────────────────────────────────── */}
      <SubHead meta="when to use">Hover Card vs Tooltip vs Popover</SubHead>
      <Lede>
        All three float above the page, but they serve different jobs. Match the trigger type and the content complexity to the right primitive.
      </Lede>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">Pick the right primitive</span></div>
        <table className="spec" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ padding: '10px 12px' }}>Pattern</th>
              <th>Trigger</th>
              <th>Content</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="tok-name">Tooltip</td>
              <td>Any element (hover / focus)</td>
              <td>One-line hint — "Bold ⌘B"</td>
            </tr>
            <tr>
              <td className="tok-name">Hover Card</td>
              <td>Link, @-mention, ref (hover / focus)</td>
              <td>Rich preview — avatar, bio, stats</td>
            </tr>
            <tr>
              <td className="tok-name">Popover</td>
              <td>Button (click)</td>
              <td>Form, filter, actions</td>
            </tr>
            <tr>
              <td className="tok-name">Dropdown Menu</td>
              <td>Button (click)</td>
              <td>Action list with keyboard nav</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── 5. ACCESSIBILITY ────────────────────────────────────────────── */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Keyboard</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The trigger is focusable (a link or button); tabbing onto it opens the card after the same delay as hover. Blurring or pressing <Mono>Escape</Mono> closes it immediately. Because the card is a passive preview with no interactive content, focus never moves into it — anything requiring a click belongs in a Popover instead.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The panel has <Mono>role="tooltip"</Mono> and the trigger carries <Mono>aria-describedby</Mono> pointing at the panel while it is open, so a reader can pull in the supplementary content on demand. It is never a focus trap and never moves the reading position.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Focus {'&'} contrast</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The trigger shows the shared offset focus ring (<Mono>--ring</Mono>) at ≥3:1 against the surface. The panel floats on <Mono>--bg-elevated</Mono> with a border and shadow so its edge is always visible against any background, and its text and metadata maintain AA contrast on that elevated surface.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div className="t-small" style={{ color: 'var(--fg-muted)', lineHeight: 1.55 }}>
            The open and close transitions use an opacity + translate combination. Under <Mono>prefers-reduced-motion: reduce</Mono> the translate is suppressed — the card appears and disappears with opacity only, with no spatial movement.
          </div>
        </div>
      </div>

      {/* ── 6. RTL ──────────────────────────────────────────────────────── */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label={'dir="rtl" — panel anchors to start edge (the right in RTL)'}
        code={RTL_CODE}
        lang="tsx"
      >
        <div dir="rtl" style={{ padding: '24px', fontSize: 'var(--text-body)', lineHeight: 1.6, color: 'var(--fg-muted)' }}>
          أُسنِد إلى{' '}
          <HoverCard
            trigger={
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{ color: 'var(--ember)', textDecoration: 'none', fontWeight: 500 }}
              >
                @ada
              </a>
            }
          >
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <AvatarCircle initials="AL" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: 'var(--fg)', fontSize: 'var(--text-body)' }}>Ada Lovelace</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', marginTop: 2 }}>@ada · Eidos Platform</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', marginTop: 8, lineHeight: 1.5 }}>
                  تعمل على مسار النشر. متاحة على ‎#platform-eng.
                </div>
              </div>
            </div>
          </HoverCard>
          {' '}في خط الأنابيب الجديد.
        </div>
      </Frame>
      <Lede>
        The panel reads <Mono>getComputedStyle(trigger).direction</Mono> at open time and swaps
        the <Mono>align="start"</Mono> anchor to the inline-start (right) edge in RTL, so the card
        opens on the same visual side it would in LTR. Content text right-aligns automatically
        because it inherits the writing direction. No glyphs in this component are directional.
      </Lede>

      {/* ── 7. ANATOMY ──────────────────────────────────────────────────── */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative' }} aria-hidden="true">
              {/* Trigger line + static card preview */}
              <div style={{ fontSize: 'var(--text-body)', color: 'var(--fg-muted)', marginBottom: 10 }}>
                Just paired with <span style={{ color: 'var(--ember)', fontWeight: 500 }}>@ada</span> on the new pipeline.
              </div>
              <div className="hc-panel hc-visible" style={{ position: 'static', width: 280 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <AvatarCircle initials="AL" size={36} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: 'var(--fg)', fontSize: 'var(--text-body)' }}>Ada Lovelace</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', marginTop: 2 }}>@ada · Eidos</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-muted)', marginTop: 6, lineHeight: 1.5 }}>Working on the deploy pipeline.</div>
                    <div style={{ marginTop: 8 }}>
                      <button className="btn xs ember" tabIndex={-1} style={{ cursor: 'default' }}>Follow</button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Leader lines */}
              <span className="lead v" style={{ top: -22, left: 90, height: 18 }} />
              <span className="lead h" style={{ top: 60, right: -28, width: 24 }} />
              <span className="lead h" style={{ top: 84, left: -28, width: 24 }} />
              <span className="lead h" style={{ top: 130, right: -28, width: 24 }} />
              <span className="lead v" style={{ bottom: -22, left: '50%', height: 18, transform: 'translateX(-50%)' }} />
              {/* Pins */}
              <div className="pin" style={{ top: -42, left: 90, transform: 'translateX(-50%)' }}>1</div>
              <div className="pin" style={{ top: 50, right: -52 }}>2</div>
              <div className="pin" style={{ top: 74, left: -52 }}>3</div>
              <div className="pin" style={{ top: 120, right: -52 }}>4</div>
              <div className="pin" style={{ bottom: -42, left: '50%', transform: 'translateX(-50%)' }}>5</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '56px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Trigger.</b> A link, @-mention, or avatar — never a plain button. The user expects click on a button, not hover.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Card panel.</b> 240–320px wide. Anchored 8px below the trigger; elevated chrome, border, and shadow.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Avatar / header.</b> Identity at a glance — name, handle, role. Keep it to two lines.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Body.</b> Bio, meta, status pills. Keep it scannable — max 3–4 lines of copy.</span>
            <span className="num">5</span><span><b style={{ color: 'var(--fg)' }}>Timing.</b> Open delay 200–300ms, close delay 100–200ms — long enough to ignore a passing pointer.</span>
          </div>
        </div>
      </div>

      {/* ── 8. DO / DON'T ───────────────────────────────────────────────── */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — open on keyboard focus too</div>
          <div className="body" style={{ padding: 20 }}>
            <a href="#" onClick={(e) => e.preventDefault()} tabIndex={0} style={{ color: 'var(--ember)', fontSize: 'var(--text-body)' }}>@ada</a>
            <span style={{ marginInlineStart: 12, color: 'var(--fg-faint)', fontSize: 'var(--text-body)' }}>Tab onto the link — the card opens.</span>
          </div>
          <div className="note">Keyboard users deserve the same affordance as mouse users. Open on hover OR focus; close on blur or Escape.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — put click targets inside the card</div>
          <div className="body" style={{ padding: 16 }}>
            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 12, background: 'var(--surface)', fontSize: 'var(--text-sm)' }}>
              "Click Edit to update profile" — but moving toward the button closes the card.
              <div style={{ marginTop: 8 }}>
                <button className="btn xs">Edit</button>
                {' '}
                <button className="btn xs">Delete</button>
              </div>
            </div>
          </div>
          <div className="note">Hover cards close when the pointer leaves the trigger area. For actions, use a Popover triggered by a click.</div>
        </div>
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — use a link or @-mention as the trigger</div>
          <div className="body" style={{ padding: 20 }}>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--ember)', fontWeight: 500, textDecoration: 'none', fontSize: 'var(--text-body)' }}>@grace</a>
            <span style={{ color: 'var(--fg-faint)', marginInlineStart: 8, fontSize: 'var(--text-body)' }}>inline text trigger</span>
          </div>
          <div className="note">Links and @-mentions signal "preview on hover". Triggers should be inline-level and navigable.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — replace a Tooltip with a Hover Card for short hints</div>
          <div className="body" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="btn xs outline">Bold</button>
            <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '8px 10px', background: 'var(--surface)', fontSize: 'var(--text-sm)', color: 'var(--fg-muted)' }}>
              Make the selected text <strong>bold</strong> — shortcut: ⌘B. Use sparingly.
            </div>
          </div>
          <div className="note">One-line hints belong in a Tooltip. A Hover Card's rich panel is overkill for a keyboard shortcut label.</div>
        </div>
      </div>

      {/* ── 9. API REFERENCE ────────────────────────────────────────────── */}
      <SubHead meta="HoverCardProps">API reference</SubHead>
      <AutoPropsTable component="HoverCard" label="<HoverCard />" />
    </Section>
  );
}
