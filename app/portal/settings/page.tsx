'use client';
// Forge · Settings. One screen that shows everything the platform offers, split
// into a sticky section nav (Account · Workspace) and a content panel. Sections:
// General, Notifications, API keys · Members, Roles & permissions, Integrations,
// Security, Billing, Audit log. Composed from @/ds/core primitives + .fp-* classes.
import * as React from 'react';
import { useTheme } from 'next-themes';
import { Button, Icons, Input, Pill, Select, Switch, ToggleGroup, ToggleGroupItem } from '@/ds/core';
import { FPageHeader, FKpi, FSearch, FRows, FRow, Sub, PersonAvatar } from '@/portal/shell/portal-shell';
import { usePersistentState } from '@/portal/shell/use-persistent-state';
import { useColorTheme, type ColorTheme } from '@/components/color-theme-provider';
import {
  PROFILE, TIMEZONES, LANGUAGES,
  ROLE_DEFS, ROLE_TONE,
  MEMBERS, MEMBER_STATS,
  INTEGRATIONS, INTEGRATION_STATUS_TONE,
  NOTIF_PREFS,
  API_KEYS,
  SECURITY, SESSIONS,
  BILLING, INVOICES,
  AUDIT_EVENTS,
  SETTINGS_SECTIONS,
  type SettingsSectionId,
  type MemberRole,
} from '@/portal/data/settings';

// A reusable section header inside a panel.

function PanelHead({ title, desc, action }: { title: string; desc: string; action?: React.ReactNode }) {
  return (
    <div className="fp-card-head" style={{ alignItems: 'flex-start' }}>
      <div>
        <div className="fp-card-title" style={{ fontSize: 'var(--text-md)' }}>{title}</div>
        <Sub muted>{desc}</Sub>
      </div>
      {action}
    </div>
  );
}

function Bar({ pct }: { pct: number }) {
  return (
    <span style={{ display: 'block', blockSize: 6, borderRadius: 999, background: 'var(--surface-raised)', overflow: 'hidden' }}>
      <span style={{ display: 'block', blockSize: '100%', inlineSize: `${Math.round(pct * 100)}%`, background: 'var(--ember)' }} />
    </span>
  );
}

// ── General ─────────────────────────────────────────────────────────────────

function GeneralSection() {
  const [tz, setTz] = React.useState(PROFILE.timezone);
  const [lang, setLang] = React.useState(PROFILE.language);
  return (
    <>
      <section className="fp-section">
        <PanelHead title="Profile" desc="How you appear across Forge." action={<Button variant="ember" size="sm">Save changes</Button>} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBlockEnd: 18 }}>
          <PersonAvatar initials={PROFILE.initials} size={56} />
          <div>
            <div style={{ fontWeight: 600 }}>{PROFILE.name}</div>
            <Sub muted>{PROFILE.jobTitle}</Sub>
          </div>
          <Button variant="outline" size="sm" style={{ marginInlineStart: 'auto' }}>Change avatar</Button>
        </div>
        <div className="fp-grid fp-grid-2">
          <Input label="Full name" defaultValue={PROFILE.name} />
          <Input label="Email" defaultValue={PROFILE.email} type="email" />
          <Input label="Job title" defaultValue={PROFILE.jobTitle} />
          <div>
            <label className="t-mono-label" style={{ display: 'block', marginBlockEnd: 6, color: 'var(--fg-muted)' }}>Default workspace</label>
            <Input defaultValue={PROFILE.workspace} readOnly />
          </div>
        </div>
      </section>

      <section className="fp-section">
        <PanelHead title="Localization" desc="Timezone and language for dates, digests and the UI." />
        <div className="fp-grid fp-grid-2">
          <div>
            <label className="t-mono-label" style={{ display: 'block', marginBlockEnd: 6, color: 'var(--fg-muted)' }}>Timezone</label>
            <Select value={tz} onValueChange={setTz} options={TIMEZONES.map((t) => ({ value: t, label: t }))} width="100%" />
          </div>
          <div>
            <label className="t-mono-label" style={{ display: 'block', marginBlockEnd: 6, color: 'var(--fg-muted)' }}>Language</label>
            <Select value={lang} onValueChange={setLang} options={LANGUAGES.map((l) => ({ value: l, label: l }))} width="100%" />
          </div>
        </div>
        <div style={{ marginBlockStart: 14, display: 'flex', alignItems: 'center', gap: 10, padding: 12, borderRadius: 'var(--radius-md)', background: 'var(--surface-hover)' }}>
          <Icons.palette size={16} style={{ color: 'var(--ember)' } as React.CSSProperties} />
          <Sub muted>Theme and accent (dark/light + color) live in the account menu, under Appearance · open it from your avatar, top-right.</Sub>
        </div>
      </section>
    </>
  );
}

// ── Appearance ────────────────────────────────────────────────────────────────
// A live theme gallery: a Light/Dark mode toggle + a card per theme. Each card
// renders a real GLIMPSE of the product in that theme's colours by scoping the
// theme tokens to the preview via data-ds-theme + data-mode (the same attribute
// selectors the whole app uses), so the preview is always pixel-accurate and
// needs no image asset. Clicking a card applies the theme; the toggle flips the
// real app mode and every preview re-renders in it.

const PREVIEW_NAV = ['Home', 'Services', 'Agents'];

function ThemePreview({ themeId, mode }: { themeId: ColorTheme; mode: string }) {
  // Scope the theme + mode to this subtree. The attribute selectors in tokens.css
  // redefine every colour token here, so the children paint in the target theme.
  return (
    <div className="fp-tp" data-ds-theme={themeId} data-mode={mode} aria-hidden="true">
      <div className="fp-tp-rail">
        <span className="fp-tp-mark" />
        {PREVIEW_NAV.map((_, i) => (
          <span key={i} className={'fp-tp-nav' + (i === 0 ? ' is-active' : '')} />
        ))}
      </div>
      <div className="fp-tp-body">
        <span className="fp-tp-line lg" />
        <span className="fp-tp-line sm" />
        <div className="fp-tp-cards">
          <span className="fp-tp-card" />
          <span className="fp-tp-card" />
        </div>
        <div className="fp-tp-row">
          <span className="fp-tp-cta" />
          <span className="fp-tp-pill" />
          <span className="fp-tp-dot dot-1" />
          <span className="fp-tp-dot dot-2" />
          <span className="fp-tp-dot dot-3" />
        </div>
        <div className="fp-tp-bars">
          <span className="fp-tp-bar b1" />
          <span className="fp-tp-bar b2" />
          <span className="fp-tp-bar b3" />
          <span className="fp-tp-bar b4" />
          <span className="fp-tp-bar b5" />
        </div>
      </div>
    </div>
  );
}

function AppearanceSection() {
  const { theme, setTheme, themes } = useColorTheme();
  const { resolvedTheme, setTheme: setMode } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const mode = mounted ? resolvedTheme ?? 'dark' : 'dark';

  return (
    <>
      <section className="fp-section">
        <PanelHead
          title="Mode"
          desc="Light or dark. Applies across Forge and the previews below."
          action={
            <ToggleGroup
              type="single"
              variant="default"
              value={mode}
              onValueChange={(v) => { if (typeof v === 'string' && v) setMode(v); }}
              aria-label="Color mode"
            >
              <ToggleGroupItem value="light" aria-label="Light mode"><Icons.sun size={13} /> Light</ToggleGroupItem>
              <ToggleGroupItem value="dark" aria-label="Dark mode"><Icons.moon size={13} /> Dark</ToggleGroupItem>
            </ToggleGroup>
          }
        />
      </section>

      <section className="fp-section">
        <PanelHead title="Theme" desc={`Pick a theme. Each preview shows it in ${mode === 'dark' ? 'dark' : 'light'} mode. Every theme works in both.`} />
        <div className="fp-theme-grid">
          {themes.map((t) => {
            const selected = t.id === theme;
            return (
              <button
                key={t.id}
                type="button"
                className={'fp-theme-card' + (selected ? ' is-selected' : '')}
                aria-pressed={selected}
                onClick={() => setTheme(t.id as ColorTheme)}
              >
                <ThemePreview themeId={t.id} mode={mode} />
                <span className="fp-theme-foot">
                  <span className="fp-theme-swatch" style={{ background: t.swatch }} aria-hidden="true" />
                  <span className="fp-theme-meta">
                    <span className="fp-theme-name">{t.label}</span>
                    <span className="fp-theme-hint">{t.hint}</span>
                  </span>
                  {selected
                    ? <Pill tone="ember">Active</Pill>
                    : <span className="fp-theme-pick">Apply</span>}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}

// ── Notifications ─────────────────────────────────────────────────────────────

function NotificationsSection() {
  const [state, setState] = React.useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const p of NOTIF_PREFS) {
      init[`${p.id}.inApp`] = p.channels.inApp;
      init[`${p.id}.email`] = p.channels.email;
      init[`${p.id}.slack`] = p.channels.slack;
    }
    return init;
  });
  const toggle = (k: string) => setState((s) => ({ ...s, [k]: !s[k] }));

  return (
    <section className="fp-section">
      <PanelHead title="Notifications" desc="Choose where each kind of event reaches you." />
      <div className="fp-card" style={{ padding: 0 }}>
        <div className="tbl-wrap">
          <table className="tbl" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th>Event</th>
                <th style={{ textAlign: 'center' }}>In-app</th>
                <th style={{ textAlign: 'center' }}>Email</th>
                <th style={{ textAlign: 'center' }}>Slack</th>
              </tr>
            </thead>
            <tbody>
              {NOTIF_PREFS.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{p.label}</div>
                    <Sub muted>{p.desc}</Sub>
                  </td>
                  {(['inApp', 'email', 'slack'] as const).map((ch) => (
                    <td key={ch} style={{ textAlign: 'center' }}>
                      <Switch
                        checked={!!state[`${p.id}.${ch}`]}
                        onChange={() => toggle(`${p.id}.${ch}`)}
                        aria-label={`${p.label} · ${ch}`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ── API keys ─────────────────────────────────────────────────────────────────

function KeysSection() {
  return (
    <section className="fp-section">
      <PanelHead
        title="API keys"
        desc="Programmatic access for CI, the CLI and exporters. Treat keys like passwords."
        action={<Button variant="ember" size="sm"><Icons.plus size={13} /> Create key</Button>}
      />
      <div className="fp-card" style={{ padding: 0 }}>
        <div className="tbl-wrap">
          <table className="tbl" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Token</th>
                <th>Scopes</th>
                <th>Last used</th>
                <th style={{ textAlign: 'end' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {API_KEYS.map((k) => (
                <tr key={k.id}>
                  <td style={{ fontWeight: 600 }}>{k.name}<Sub muted>Created {k.created}</Sub></td>
                  <td className="mono" style={{ color: 'var(--fg-muted)' }}>{k.prefix}</td>
                  <td>
                    <div className="fp-tags">
                      {k.scopes.map((s) => <Pill key={s} tone="neutral" style={{ border: '1px solid var(--border)' }}>{s}</Pill>)}
                    </div>
                  </td>
                  <td className="mono" style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-xs)' }}>{k.lastUsed}</td>
                  <td style={{ textAlign: 'end' }}>
                    <Pill tone={k.status === 'active' ? 'health-up' : 'neutral'}>{k.status}</Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ── Members ─────────────────────────────────────────────────────────────────

function MembersSection() {
  const [q, setQ] = React.useState('');
  const rows = MEMBERS.filter(
    (m) => !q || m.name.toLowerCase().includes(q.toLowerCase()) || m.email.toLowerCase().includes(q.toLowerCase()) || m.role.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <section className="fp-section">
      <PanelHead
        title="Members"
        desc={`${MEMBER_STATS.humans} humans · ${MEMBER_STATS.agents} agents · ${MEMBER_STATS.invited} pending invite`}
        action={<Button variant="ember" size="sm"><Icons.plus size={13} /> Invite member</Button>}
      />
      <div className="fp-toolbar" style={{ marginBlockEnd: 14 }}>
        <div style={{ flex: 1, minWidth: 240, maxWidth: 420, display: 'flex' }}>
          <FSearch value={q} onChange={setQ} placeholder="Filter by name, email, role…" aria-label="Filter members" className="fluid" />
        </div>
      </div>
      <div className="fp-card" style={{ padding: 0 }}>
        <div className="tbl-wrap">
          <table className="tbl" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th>Member</th>
                <th>Type</th>
                <th>Role</th>
                <th style={{ textAlign: 'center' }}>MFA</th>
                <th>Last active</th>
                <th style={{ textAlign: 'end' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <PersonAvatar initials={m.initials} size={30} title={m.name} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{m.name}</div>
                        <Sub muted>{m.email}</Sub>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Pill tone={m.type === 'agent' ? 'ember' : 'neutral'} style={m.type === 'human' ? { border: '1px solid var(--border)' } : undefined}>
                      {m.type === 'agent' ? <><Icons.agent size={10} /> Agent</> : 'Human'}
                    </Pill>
                  </td>
                  <td><Pill tone={ROLE_TONE[m.role]}>{m.role}</Pill></td>
                  <td style={{ textAlign: 'center' }}>
                    {m.mfa
                      ? <Icons.check size={15} style={{ color: 'var(--success, var(--ember))' } as React.CSSProperties} />
                      : <Icons.alert size={15} style={{ color: 'var(--danger)' } as React.CSSProperties} />}
                  </td>
                  <td className="mono" style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-xs)' }}>{m.lastActive}</td>
                  <td style={{ textAlign: 'end' }}>
                    <Pill tone={m.status === 'active' ? 'health-up' : m.status === 'invited' ? 'ice' : 'warning'}>{m.status}</Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Sub muted>{rows.length} of {MEMBERS.length} members</Sub>
    </section>
  );
}

// ── Roles & permissions ─────────────────────────────────────────────────────

function RolesSection() {
  const countFor = (role: MemberRole) => MEMBERS.filter((m) => m.role === role).length;
  return (
    <section className="fp-section">
      <PanelHead title="Roles & permissions" desc="What each role can do. Roles apply to humans and agent principals alike." />
      <div className="fp-grid fp-grid-2">
        {ROLE_DEFS.map((r) => (
          <div key={r.role} className="fp-card" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Pill tone={ROLE_TONE[r.role]}>{r.role}</Pill>
              <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)' }}>{countFor(r.role)} members</span>
            </div>
            <Sub muted>{r.desc}</Sub>
            <div className="fp-tags">
              {r.scopes.map((s) => <Pill key={s} tone="neutral" style={{ border: '1px solid var(--border)' }}>{s}</Pill>)}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              {r.canApprove
                ? <><Icons.check size={12} style={{ color: 'var(--ember)' } as React.CSSProperties} /> Can approve guardrail escalations</>
                : <><Icons.minus size={12} /> Cannot approve escalations</>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Integrations ──────────────────────────────────────────────────────────────

function IntegrationsSection() {
  const connected = INTEGRATIONS.filter((i) => i.status === 'connected').length;
  const forAgents = INTEGRATIONS.filter((i) => i.use !== 'humans').length;
  return (
    <section className="fp-section">
      <PanelHead title="Integrations" desc="Third-party apps connected to the platform for people and agents to use." />
      <div className="fp-grid fp-grid-3" style={{ marginBlockEnd: 18 }}>
        <FKpi label="Connected" value={connected} sub={<Sub muted>of {INTEGRATIONS.length} available</Sub>} />
        <FKpi label="Agent-enabled" value={forAgents} sub={<Sub muted>usable by agents</Sub>} />
        <FKpi label="Needs attention" value={INTEGRATIONS.filter((i) => i.status === 'error').length} sub={<Sub muted>connection errors</Sub>} />
      </div>
      <div className="fp-grid fp-grid-3">
        {INTEGRATIONS.map((it) => (
          <div key={it.id} className="fp-card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="fp-int-tile" style={{ background: it.brand, color: it.fg }}>{it.monogram}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{it.name}</div>
                <Sub muted>{it.category}</Sub>
              </div>
              <Pill tone={INTEGRATION_STATUS_TONE[it.status]} dot={it.status === 'connected'}>{it.status}</Pill>
            </div>
            <Sub muted>{it.desc}</Sub>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBlockStart: 'auto', paddingBlockStart: 8, borderBlockStart: '1px solid var(--border)' }}>
              <Pill tone="neutral" style={{ border: '1px solid var(--border)' }}>
                {it.use === 'both' ? <><Icons.user size={10} /> + <Icons.agent size={10} /> Both</> : it.use === 'agents' ? <><Icons.agent size={10} /> Agents</> : <><Icons.user size={10} /> Humans</>}
              </Pill>
              <Button variant={it.status === 'connected' ? 'outline' : 'ember'} size="sm">
                {it.status === 'connected' ? 'Manage' : it.status === 'error' ? 'Reconnect' : 'Connect'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Security ────────────────────────────────────────────────────────────────

function SecuritySection() {
  const noMfa = MEMBERS.filter((m) => !m.mfa).length;
  return (
    <>
      <section className="fp-section">
        <PanelHead title="Authentication" desc="Single sign-on and multi-factor policy for the workspace." />
        <div className="fp-card">
          <dl className="fp-kv">
            <div className="fp-kv-row"><dt>Single sign-on</dt><dd style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>{SECURITY.sso.provider} <Pill tone="health-up" dot>{SECURITY.sso.enforced ? 'Enforced' : 'Enabled'}</Pill></dd></div>
            <div className="fp-kv-row"><dt>Multi-factor auth</dt><dd style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>{SECURITY.mfa.policy} <Pill tone={noMfa ? 'warning' : 'health-up'}>{Math.round(SECURITY.mfa.coverage * 100)}% covered</Pill></dd></div>
            <div className="fp-kv-row"><dt>Session timeout</dt><dd>{SECURITY.sessionTimeout}</dd></div>
          </dl>
          {noMfa > 0 && (
            <div className="on-accent-soft" style={{ marginBlockStart: 14, display: 'flex', alignItems: 'center', gap: 10, padding: 12, borderRadius: 'var(--radius-md)', background: 'var(--ember-soft)' }}>
              <Icons.alert size={16} style={{ color: 'var(--ember)' } as React.CSSProperties} />
              <Sub muted>{noMfa} member{noMfa === 1 ? '' : 's'} have not enrolled MFA. They will be prompted on next sign-in.</Sub>
            </div>
          )}
        </div>
      </section>

      <section className="fp-section">
        <PanelHead title="Active sessions" desc="Where your account is currently signed in." action={<Button variant="outline" size="sm">Sign out all others</Button>} />
        <FRows>
          {SESSIONS.map((s) => (
            <FRow key={s.id}>
              <Icons.globe size={16} style={{ color: 'var(--fg-muted)', flexShrink: 0 } as React.CSSProperties} />
              <div className="fp-row-main">
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{s.device}{s.current && <Pill tone="ember" style={{ marginInlineStart: 8 }}>This device</Pill>}</div>
                <Sub muted>{s.location} · {s.lastActive}</Sub>
              </div>
              {!s.current && <Button variant="ghost" size="sm">Revoke</Button>}
            </FRow>
          ))}
        </FRows>
      </section>
    </>
  );
}

// ── Billing ────────────────────────────────────────────────────────────────

function BillingSection() {
  return (
    <>
      <section className="fp-section">
        <PanelHead title="Plan & usage" desc="Your subscription, seats and AI credit consumption." action={<Button variant="ember" size="sm">Manage plan</Button>} />
        <div className="fp-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div><div style={{ fontWeight: 600, fontSize: 'var(--text-md)' }}>{BILLING.plan}</div><Sub muted>{BILLING.renews}</Sub></div>
            <Pill tone="ember" dot>Active</Pill>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', marginBlockEnd: 6 }}>
              <span style={{ color: 'var(--fg-muted)' }}>Seats</span>
              <span className="mono">{BILLING.seats.used} / {BILLING.seats.total}</span>
            </div>
            <Bar pct={BILLING.seats.used / BILLING.seats.total} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', marginBlockEnd: 6 }}>
              <span style={{ color: 'var(--fg-muted)' }}>AI credits · {BILLING.aiCredits.unit}</span>
              <span className="mono">{(BILLING.aiCredits.used / 1000).toFixed(1)}k / {(BILLING.aiCredits.total / 1000)}k</span>
            </div>
            <Bar pct={BILLING.aiCredits.used / BILLING.aiCredits.total} />
          </div>
        </div>
      </section>

      <section className="fp-section">
        <PanelHead title="Invoices" desc="Recent billing history." />
        <div className="fp-card" style={{ padding: 0 }}>
          <div className="tbl-wrap">
            <table className="tbl" style={{ margin: 0 }}>
              <thead><tr><th>Period</th><th>Amount</th><th>Status</th><th style={{ textAlign: 'end' }}></th></tr></thead>
              <tbody>
                {INVOICES.map((inv) => (
                  <tr key={inv.id}>
                    <td style={{ fontWeight: 600 }}>{inv.period}</td>
                    <td className="mono">{inv.amount}</td>
                    <td><Pill tone={inv.status === 'paid' ? 'health-up' : 'warning'}>{inv.status}</Pill></td>
                    <td style={{ textAlign: 'end' }}><Button variant="ghost" size="sm"><Icons.download size={13} /> PDF</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}

// ── Audit log ─────────────────────────────────────────────────────────────────

const AUDIT_ICON: Record<string, keyof typeof Icons> = {
  member: 'user', role: 'badgeCheck', integration: 'plug', security: 'lock', key: 'key',
};

function AuditSection() {
  return (
    <section className="fp-section">
      <PanelHead title="Audit log" desc="Every settings change, by a human or an agent. Immutable." action={<Button variant="ghost" size="sm"><Icons.download size={13} /> Export</Button>} />
      <FRows>
        {AUDIT_EVENTS.map((e) => {
          const Icon = (Icons as Record<string, React.FC<{ size?: number }>>)[AUDIT_ICON[e.kind]] ?? Icons.circle;
          return (
            <FRow key={e.id}>
              <span style={{ display: 'inline-flex', inlineSize: 30, blockSize: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)', background: 'var(--surface-hover)', color: 'var(--fg-muted)', flexShrink: 0 }}>
                <Icon size={14} />
              </span>
              <div className="fp-row-main">
                <div style={{ fontSize: 'var(--text-sm)' }}>{e.action}</div>
                <Sub muted>{e.actor}</Sub>
              </div>
              <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-faint)' }}>{e.when}</span>
            </FRow>
          );
        })}
      </FRows>
    </section>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

const SECTION_RENDER: Record<SettingsSectionId, () => React.ReactElement> = {
  general: GeneralSection,
  appearance: AppearanceSection,
  notifications: NotificationsSection,
  keys: KeysSection,
  members: MembersSection,
  roles: RolesSection,
  integrations: IntegrationsSection,
  security: SecuritySection,
  billing: BillingSection,
  audit: AuditSection,
};

export default function SettingsPage() {
  const [active, setActive] = usePersistentState<SettingsSectionId>('forge.settings.section', 'general');
  // Deep-link support: /portal/settings?section=appearance opens that section
  // (used by the "More themes" link in the avatar Appearance submenu). Read from
  // the URL on the client to avoid pulling the page into useSearchParams' Suspense.
  React.useEffect(() => {
    const s = new URLSearchParams(window.location.search).get('section');
    if (s && SETTINGS_SECTIONS.some((x) => x.id === s)) setActive(s as SettingsSectionId);
  }, [setActive]);
  const groups = Array.from(new Set(SETTINGS_SECTIONS.map((s) => s.group)));
  const Active = SECTION_RENDER[active] ?? GeneralSection;

  return (
    <>
      <FPageHeader
        eyebrow="Account"
        title="Settings"
        subtitle="Your profile, the workspace, its members and everything connected to it."
      />

      <div className="fp-set">
        <nav className="fp-set-nav" aria-label="Settings sections">
          {groups.map((g) => (
            <div key={g} className="fp-set-group">
              <span className="t-mono-label fp-set-grouplabel">{g}</span>
              {SETTINGS_SECTIONS.filter((s) => s.group === g).map((s) => {
                const Icon = (Icons as Record<string, React.FC<{ size?: number }>>)[s.icon] ?? Icons.circle;
                return (
                  <button
                    key={s.id}
                    type="button"
                    className={'fp-set-link' + (active === s.id ? ' is-active' : '')}
                    aria-current={active === s.id ? 'page' : undefined}
                    onClick={() => setActive(s.id)}
                  >
                    <Icon size={15} />
                    {s.label}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="fp-set-panel">
          <Active />
        </div>
      </div>
    </>
  );
}
