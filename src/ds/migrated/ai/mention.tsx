'use client';
// Eidos DS — AI / Mention
// An inline @-mention pill with a HoverCard profile preview.
// Page layout:
//   1. Installation     (TabbedCode)
//   2. Usage            (Frame: minimal render)
//   3. Variants/States  (pill states, status dots, in a chat bubble)
//   4. Accessibility    (keyboard map, ARIA, contrast, motion)
//   5. RTL              (dir=rtl Frame)
//   6. Anatomy          (.ana block with numbered pins)
//   7. Do / Don't       (.dd-grid)
//   8. API reference    (AutoPropsTable)
import * as React from 'react';
import {
  Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable,
  HoverCard, Avatar, installTabs, Lede, Mono,
} from '@/ds/core';

// ── Sample data (mirrors forge-ai-chat.tsx constants) ───────────────────────
const COMMANDER = {
  name: 'Marcus Johnson',
  src: '/avatars/Marcus-Johnson.jpg',
  role: 'Staff SRE',
  tribe: 'Score & Risk',
  status: 'busy' as const,
  presence: 'On-call now · paged 6h ago',
  bio: 'SRE on the Score & Risk platform. Owns the on-call rotation and the konduto rollback runbooks. Ask me about incident response and SLOs.',
  region: 'São Paulo · Brazil',
  email: 'marcus.johnson@equifax.com',
  phone: '+55 11 99876-5432',
  joined: 'Joined Mar 2021',
  chatHref: 'https://chat.google.com/',
  href: '#',
};

const BACKUP = {
  name: 'Diego Ferreira',
  src: '/avatars/Diego-Ferreira.jpg',
  role: 'Platform Eng',
  tribe: 'Score & Risk',
  status: 'online' as const,
  presence: 'Available · backup on-call',
  bio: 'Platform engineer on Score & Risk. Secondary pager this week. Owns the Ignite feature-store wiring.',
  region: 'Rio de Janeiro · Brazil',
  email: 'diego.ferreira@equifax.com',
  phone: '+55 21 98123-4567',
  joined: 'Joined Aug 2022',
  chatHref: 'https://chat.google.com/',
  href: '#',
};

// ── Inline Mention component (self-contained for the docs page) ──────────────
// The DS component lives in packages/ui/src/ai/mention.tsx — exported via
// @eidos/ui. This local alias renders identically to keep the page fully
// self-contained without a circular import.

interface MentionPerson {
  name: string;
  src?: string;
  role?: string;
  tribe?: string;
  status?: 'online' | 'away' | 'busy' | 'offline';
  presence?: string;
  bio?: string;
  region?: string;
  email?: string;
  phone?: string;
  joined?: string;
  chatHref?: string;
  href?: string;
}

function Mention({ person }: { person: MentionPerson }) {
  const profile = person.href ?? '#';
  const mailHref = person.email
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(person.email)}`
    : undefined;
  const telHref = person.phone
    ? `tel:${person.phone.replace(/[^\d+]/g, '')}`
    : undefined;

  return (
    <HoverCard
      openDelay={150}
      side="top"
      align="start"
      minWidth={320}
      className="mention-hc"
      trigger={
        <a href={profile} className="mention">@{person.name}</a>
      }
    >
      <div className="mention-card">
        <div className="mention-cover" aria-hidden="true" />
        <span className="mention-av">
          <Avatar name={person.name} src={person.src} size={64} />
        </span>
        <div className="mention-body">
          <div className="mention-name">
            <span>{person.name}</span>
            {person.status && (
              <span
                className="mention-dot"
                data-status={person.status}
                title={person.presence}
                aria-label={`${person.name} is ${person.status}${person.presence ? `: ${person.presence}` : ''}`}
              />
            )}
          </div>
          {(person.role || person.tribe) && (
            <div className="mention-role">
              {[person.role, person.tribe].filter(Boolean).join(' · ')}
            </div>
          )}
          {person.bio && <p className="mention-bio">{person.bio}</p>}
          {(person.region || person.email || person.phone) && (
            <div className="mention-rows">
              {person.region && (
                <p className="mention-row">
                  <Icons.region size={13} aria-hidden="true" /> {person.region}
                </p>
              )}
              {person.email && mailHref && (
                <a
                  className="mention-row mention-link"
                  href={mailHref}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Email ${person.name}`}
                >
                  <Icons.mail size={13} aria-hidden="true" /> <span>{person.email}</span>
                </a>
              )}
              {person.phone && telHref && (
                <a
                  className="mention-row mention-link"
                  href={telHref}
                  aria-label={`Call ${person.name}`}
                >
                  <Icons.phone size={13} aria-hidden="true" /> <span>{person.phone}</span>
                </a>
              )}
            </div>
          )}
        </div>
        <div className="mention-foot">
          {person.joined && (
            <span className="mention-joined">{person.joined}</span>
          )}
          <span className="mention-actions">
            <a href={profile} className="btn ghost sm">
              <Icons.user size={13} aria-hidden="true" /> Profile
            </a>
            <a
              href={person.chatHref ?? 'https://chat.google.com/'}
              target="_blank"
              rel="noreferrer"
              className="btn ember sm"
              aria-label={`Message ${person.name} on Google Chat`}
            >
              <Icons.chat size={13} aria-hidden="true" /> Message
            </a>
          </span>
        </div>
      </div>
    </HoverCard>
  );
}

// ── Code snippets ─────────────────────────────────────────────────────────────

const USAGE_CODE = `import { Mention } from "@eidos/ui"

const MARCUS = {
  name: 'Marcus Johnson',
  role: 'Staff SRE',
  tribe: 'Score & Risk',
  status: 'busy',
  presence: 'On-call now · paged 6h ago',
  email: 'marcus.johnson@equifax.com',
  joined: 'Joined Mar 2021',
  href: '/users/marcus',
}

export function Demo() {
  return (
    <p>
      Incident commander: <Mention person={MARCUS} />
    </p>
  )
}`;

const VARIANTS_CODE = `// Full profile — all fields
<Mention person={COMMANDER} />

// Minimal — name only
<Mention person={{ name: 'Ana Silva', role: 'Engineer' }} />`;

const STATUS_CODE = `// Online — success green
<Mention person={{ name: 'Diego', status: 'online', presence: 'Available' }} />

// Away — warning amber
<Mention person={{ name: 'Priya', status: 'away', presence: 'In a meeting until 15:00' }} />

// Busy — danger red
<Mention person={{ name: 'Marcus', status: 'busy', presence: 'On-call now' }} />

// Offline — fg-faint neutral
<Mention person={{ name: 'Rafael', status: 'offline' }} />`;

const BUBBLE_CODE = `<div className="msg-thread">
  <div className="msg assistant">
    <div className="msg-stack">
      <div className="msg-bubble">
        <p>
          Incident commander is <Mention person={MARCUS} />.
          Backup is <Mention person={DIEGO} />.
        </p>
      </div>
    </div>
  </div>
</div>`;

const RTL_CODE = `<p dir="rtl">
  قائد الحادثة هو <Mention person={{ name: 'مارك', role: 'مهندس', status: 'online' }} />
</p>`;

// ── Helpers ───────────────────────────────────────────────────────────────────
const prose: React.CSSProperties = {
  fontSize: 'var(--text-body)',
  color: 'var(--fg)',
  lineHeight: 1.7,
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MentionPage() {
  return (
    <Section
      id="mention"
      num="AI"
      title="Mention"
      desc="Inline @-mention pill that flows with prose text and opens a rich HoverCard profile preview on hover or focus. Use in chat answers, incident commanders, and PR author lines."
    >

      {/* ====================================================================
          1. INSTALLATION
          ==================================================================== */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode
        tabs={[
          ...installTabs('mention'),
          {
            label: 'Manual',
            lang: 'bash',
            code: `# 1. Base layer (tokens + ds.css + ai.css)
npx eidos@latest init

# 2. Copy the component
npx eidos@latest add mention

# 3. Import ai.css in your app root (already done if you added any AI component)
#    import '@eidos/ui/styles/ai.css'`,
          },
        ]}
        ariaLabel="package manager"
      />
      <Lede>
        <Mono>Mention</Mono> depends on{' '}
        <Mono>Avatar</Mono>, <Mono>HoverCard</Mono>, and the CSS layer in{' '}
        <Mono>ai.css</Mono> (<Mono>.mention*</Mono> classes). The CLI pulls those
        in automatically.
      </Lede>

      {/* ====================================================================
          2. USAGE
          ==================================================================== */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="hover or focus the pill to open the profile card" code={USAGE_CODE}>
        <p style={prose}>
          Incident commander: <Mention person={COMMANDER} />
        </p>
      </Frame>

      {/* ====================================================================
          3. VARIANTS / STATES
          ==================================================================== */}
      <SubHead meta="2 variants">Variants</SubHead>
      <Lede>
        Varies only in data completeness. A minimal mention (name + role) shows
        an initials avatar and no contact rows. A full mention adds photo, bio,
        email, phone, region, and action buttons.
      </Lede>
      <Frame label="full profile · minimal profile" code={VARIANTS_CODE}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
          <p style={prose}>Full: <Mention person={COMMANDER} /></p>
          <p style={prose}>Minimal: <Mention person={{ name: 'Ana Silva', role: 'Engineer' }} /></p>
        </div>
      </Frame>

      <SubHead meta="4 states">Status dots</SubHead>
      <Lede>
        The presence dot beside the name is coloured by{' '}
        <Mono>status</Mono>: <Mono>online</Mono> (success green),{' '}
        <Mono>away</Mono> (warning amber), <Mono>busy</Mono> (danger red),{' '}
        <Mono>offline</Mono> (fg-faint). The{' '}
        <Mono>presence</Mono> string becomes its <Mono>title</Mono> tooltip and{' '}
        <Mono>aria-label</Mono>.
      </Lede>
      <Frame label="online · away · busy · offline" code={STATUS_CODE}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>
          <p style={prose}><Mention person={{ name: 'Diego Ferreira', status: 'online', presence: 'Available', href: '#' }} /></p>
          <p style={prose}><Mention person={{ name: 'Priya Nair', status: 'away', presence: 'In a meeting', href: '#' }} /></p>
          <p style={prose}><Mention person={{ name: 'Marcus Johnson', status: 'busy', presence: 'On-call now', href: '#' }} /></p>
          <p style={prose}><Mention person={{ name: 'Rafael Costa', status: 'offline', href: '#' }} /></p>
        </div>
      </Frame>

      <SubHead meta="real surface">In a chat bubble</SubHead>
      <Lede>
        Inside a <Mono>.msg-bubble</Mono> the link rule sets{' '}
        <Mono>text-decoration: underline; color: var(--ember)</Mono> on all{' '}
        <Mono>{'<a>'}</Mono> elements. The <Mono>.mention</Mono> class overrides that
        with <Mono>!important</Mono> so the pill always reads as a token, not a
        bare link.
      </Lede>
      <Frame label="mention inside .msg-bubble — no underline, ember-soft pill intact" code={BUBBLE_CODE}>
        <div className="msg-thread" style={{ width: '100%' }}>
          <div className="msg assistant">
            <div className="msg-stack">
              <div className="msg-bubble">
                <p>
                  Based on the alert timeline, <Mention person={COMMANDER} /> is the
                  current on-call commander. Backup on-call is <Mention person={BACKUP} />.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Frame>

      {/* ====================================================================
          4. ACCESSIBILITY
          ==================================================================== */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 10 }}>Keyboard</div>
          <table className="tbl" style={{ margin: 0 }}>
            <thead>
              <tr><th style={{ width: 120 }}>Key</th><th>Action</th></tr>
            </thead>
            <tbody>
              <tr><td><kbd className="kbd">Tab</kbd></td><td>Focus the <Mono tone="subtle">@mention</Mono> pill</td></tr>
              <tr><td><kbd className="kbd">Enter</kbd></td><td>Follow the profile link</td></tr>
              <tr><td><kbd className="kbd">Hover / Focus</kbd></td><td>Opens the HoverCard preview (150ms delay)</td></tr>
              <tr><td><kbd className="kbd">Esc</kbd></td><td>Closes the card; focus stays on the pill</td></tr>
              <tr><td><kbd className="kbd">Blur</kbd></td><td>Closes the card (200ms delay)</td></tr>
              <tr><td><kbd className="kbd">Tab</kbd> (inside card)</td><td>Moves through Profile link, email, phone, Message button</td></tr>
            </tbody>
          </table>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Screen reader</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The pill is a native <Mono tone="subtle">{'<a>'}</Mono> so it announces as "link, @Name". The presence dot is a <Mono tone="subtle">{'<span>'}</Mono> with an <Mono tone="subtle">aria-label</Mono> of <Mono tone="subtle">"Marcus Johnson is busy: On-call now"</Mono>. All SVG icons inside the card are <Mono tone="subtle">aria-hidden</Mono>; the email and phone links carry <Mono tone="subtle">aria-label</Mono> ("Email Marcus Johnson", "Call Marcus Johnson"). The Message button carries an explicit label too.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Contrast</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The pill uses <Mono tone="subtle">--ember-text</Mono> on <Mono tone="subtle">--ember-soft</Mono> — tuned to clear WCAG AA (4.5:1) in both dark and light modes. The cover gradient is purely decorative (no text on it). The ember Message button uses dark ink (<Mono tone="subtle">--ember-fg</Mono>) on the ember fill, per the contrast invariant.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The HoverCard entrance uses <Mono tone="subtle">var(--dur-fast)</Mono> (120ms) with an opacity + translate pop. Under <Mono tone="subtle">prefers-reduced-motion: reduce</Mono> the HoverCard switches to an opacity-only fade (no translate) and the pill&apos;s hover background change is instant.
          </div>
        </div>
      </div>

      {/* ====================================================================
          5. RTL
          ==================================================================== */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label="dir=&quot;rtl&quot; — pill and card both adapt; card anchors to the inline-end edge"
        code={RTL_CODE}
      >
        <div dir="rtl" style={{ width: '100%' }}>
          <p style={{ ...prose, textAlign: 'right' }}>
            قائد الحادثة هو{' '}
            <Mention person={{ ...COMMANDER, name: 'ماركوس', href: '#' }} />{' '}
            والاحتياطي هو{' '}
            <Mention person={{ ...BACKUP, name: 'دييغو', href: '#' }} />.
          </p>
        </div>
      </Frame>
      <Lede>
        All layout uses logical CSS properties (<Mono>inline-start</Mono>,{' '}
        <Mono>inline-end</Mono>, <Mono>block-start</Mono>). The pill mirrors without
        overrides. The HoverCard engine re-anchors to the trigger&apos;s{' '}
        <Mono>inline-end</Mono> edge when <Mono>dir="rtl"</Mono> is detected on open.
      </Lede>

      {/* ====================================================================
          6. ANATOMY
          ==================================================================== */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ana">
        <div className="stage" style={{ padding: '32px 24px', display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Pill anatomy */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <a className="mention" href="#" style={{ pointerEvents: 'none' }}>@Marcus Johnson</a>
            <span className="pin" style={{ top: -14, left: 8 }}>1</span>
          </div>

          {/* Profile card anatomy — static mock */}
          <div className="mention-card" style={{ width: 300, border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', position: 'relative', background: 'var(--bg-elevated)' }}>
            <div className="mention-cover" style={{ position: 'relative' }}>
              <span className="pin" style={{ top: 8, left: 8 }}>2</span>
            </div>
            <span className="mention-av" style={{ position: 'relative', display: 'block' }}>
              <Avatar name="Marcus Johnson" size={64} />
              <span className="pin" style={{ top: -8, left: 56 }}>3</span>
            </span>
            <div className="mention-body">
              <div className="mention-name" style={{ position: 'relative' }}>
                <span>Marcus Johnson</span>
                <span className="mention-dot" data-status="busy" title="On-call" />
                <span className="pin" style={{ top: -12, left: 90 }}>4</span>
                <span className="pin" style={{ top: -12, left: 150 }}>5</span>
              </div>
              <div className="mention-role" style={{ position: 'relative' }}>
                Staff SRE · Score & Risk
                <span className="pin" style={{ top: -10, right: 0 }}>6</span>
              </div>
              <div className="mention-rows" style={{ position: 'relative' }}>
                <p className="mention-row"><Icons.region size={13} aria-hidden="true" /> São Paulo · Brazil</p>
                <p className="mention-row mention-link"><Icons.mail size={13} aria-hidden="true" /> <span>marcus@equifax.com</span></p>
                <span className="pin" style={{ top: 0, right: 0 }}>7</span>
              </div>
            </div>
            <div className="mention-foot" style={{ position: 'relative' }}>
              <span className="mention-joined">Joined Mar 2021</span>
              <span className="mention-actions">
                <a className="btn ghost sm" href="#">Profile</a>
                <a className="btn ember sm" href="#">Message</a>
              </span>
              <span className="pin" style={{ top: -12, left: 8 }}>8</span>
              <span className="pin" style={{ top: -12, right: 8 }}>9</span>
            </div>
          </div>
        </div>
        <ol className="ana-list">
          <li><strong>Pill trigger</strong> — <Mono>{'<a className="mention">'}</Mono>: ember-soft background + ember-text. Inline, flows with prose, overrides link styles inside bubble/prose surfaces.</li>
          <li><strong>Cover banner</strong> — <Mono>.mention-cover</Mono>: 88px tall, ember gradient left→right. Decorative only.</li>
          <li><strong>Avatar</strong> — <Mono>{'<Avatar size={64}>'}</Mono> inside <Mono>.mention-av</Mono>: negative block-start margin straddles the banner edge. 3px bg-elevated border creates the ring.</li>
          <li><strong>Name</strong> — bold, <Mono>--text-md</Mono>, tracks at <Mono>-0.01em</Mono>.</li>
          <li><strong>Presence dot</strong> — <Mono>.mention-dot</Mono>: 8px circle coloured by <Mono>data-status</Mono>. Has <Mono>title</Mono> and <Mono>aria-label</Mono>.</li>
          <li><strong>Role · tribe</strong> — <Mono>.mention-role</Mono>: muted sm text joined with " · ".</li>
          <li><strong>Contact rows</strong> — <Mono>.mention-rows</Mono>: region (plain), email (Gmail compose link), phone (tel: link). Hover: ember colour + underline on text span.</li>
          <li><strong>Joined date</strong> — <Mono>.mention-joined</Mono>: mono xs, fg-faint.</li>
          <li><strong>Actions</strong> — <Mono>.mention-actions</Mono>: ghost "Profile" + ember "Message" sm buttons.</li>
        </ol>
      </div>

      {/* ====================================================================
          7. DO / DON'T
          ==================================================================== */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-do">
          <div className="dd-label">Do</div>
          <div className="dd-body">
            <p style={prose}>
              Use <Mono>{'<Mention>'}</Mono> wherever a person&apos;s name appears in prose and{' '}
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>additional context helps.</span> It is
              cheap to drop in — the card only renders when the user hovers or focuses.
            </p>
            <p style={{ ...prose, marginTop: 12 }}>
              The on-call commander is <Mention person={COMMANDER} />.
            </p>
          </div>
        </div>
        <div className="dd-dont">
          <div className="dd-label">Don&apos;t</div>
          <div className="dd-body">
            <p style={prose}>
              Don&apos;t use it for{' '}
              <span style={{ color: 'var(--danger)', fontWeight: 600 }}>machine actors</span> or service
              names — reach for a plain <Mono>{'<code>'}</Mono> or a{' '}
              <Mono>{'<Pill>'}</Mono> instead. Mention is for real people.
            </p>
            <p style={{ ...prose, marginTop: 12, color: 'var(--fg-muted)' }}>
              Degraded:{' '}
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#" className="mention" style={{ pointerEvents: 'none' }}>@acerta-api</a>{' '}
              {/* service name is wrong; use <code> */}
            </p>
          </div>
        </div>
        <div className="dd-do">
          <div className="dd-label">Do</div>
          <div className="dd-body">
            <p style={prose}>
              Provide at least <Mono>name</Mono> and a <Mono>status</Mono> when you have it.
              The dot tells readers at a glance whether the person is reachable{' '}
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>right now.</span>
            </p>
          </div>
        </div>
        <div className="dd-dont">
          <div className="dd-label">Don&apos;t</div>
          <div className="dd-body">
            <p style={prose}>
              Don&apos;t scatter more than{' '}
              <span style={{ color: 'var(--danger)', fontWeight: 600 }}>2–3 mentions</span> in a
              single sentence. Readers lose the prose thread if every other word is
              a pill.
            </p>
          </div>
        </div>
      </div>

      {/* ====================================================================
          8. API REFERENCE
          ==================================================================== */}
      <SubHead meta="MentionProps">API reference</SubHead>
      <Lede>
        <Mono>{'<Mention person={...} />'}</Mono> accepts one required prop: a{' '}
        <Mono>MentionPerson</Mono> object. All fields on the person are optional
        except <Mono>name</Mono>.
      </Lede>
      <AutoPropsTable component="Mention" />
    </Section>
  );
}
