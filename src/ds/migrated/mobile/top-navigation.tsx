'use client';
// Eidos Mobile — Top Navigation. The bar at the top of a screen (left icon area · flexible
// title · right icon area) over the OS status bar. Modelled on LINE LDSG, rebuilt in Eidos
// tokens. Page follows the DS component standard: every example is a Frame (preview + code),
// the code is React Native usage, and previews are constrained to a handset width.
import * as React from 'react';
import { Section, SubHead, Frame, CodeBlock, Lede, Mono, PropsTable, Icons, StatusBar, PhoneTop, Skeleton, Spinner, Alert, AlertTitle, AlertDescription, type Platform } from '@/ds/core';

const DEVICE_W = 372;

/* LDSG uses a heart in the trailing area; the Eidos icon set has none, so it's drawn here. */
const Heart = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20.2s-7.2-4.6-9.4-9C1 8 2.4 4.7 5.8 4.7c2.1 0 3.4 1.3 4.2 2.5.8-1.2 2.1-2.5 4.2-2.5 3.4 0 4.8 3.3 3.2 6.5-2.2 4.6-9.4 9-9.4 9Z" />
  </svg>
);

// ── item model ───────────────────────────────────────────────────────────────
type NavItem =
  | { t: 'icon'; el: React.ReactNode; label: string; required?: boolean; disabled?: boolean }
  | { t: 'text'; text: string; emphasis?: boolean; required?: boolean; disabled?: boolean };

const IB = (el: React.ReactNode, label: string, required = false): NavItem => ({ t: 'icon', el, label, required });
const TB = (text: string, opts: { emphasis?: boolean; required?: boolean; disabled?: boolean } = {}): NavItem => ({ t: 'text', text, ...opts });

function Item({ item, side, barH }: { item: NavItem; side: 'lead' | 'trail'; barH: number }) {
  const disabled = !!item.disabled;
  if (item.t === 'icon') {
    return (
      <button type="button" aria-label={item.label} disabled={disabled}
        style={{ width: 24, height: barH, flex: 'none', display: 'grid', placeItems: 'center', border: 'none', background: 'none', padding: 0, borderRadius: 'var(--radius-sm)', color: 'var(--fg)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.38 : 1 }}>
        {item.el}
      </button>
    );
  }
  return (
    <button type="button" disabled={disabled}
      style={{ minWidth: 75, height: barH, flex: 'none', border: 'none', background: 'none', padding: 0, borderRadius: 'var(--radius-sm)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.38 : 1, textAlign: side === 'lead' ? 'start' : 'end', fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: item.emphasis ? 700 : 500, color: item.emphasis ? 'var(--accent)' : 'var(--fg)' }}>
      {item.text}
    </button>
  );
}

const ID = (el: React.ReactNode, label: string): NavItem => ({ t: 'icon', el, label, disabled: true });

// Inline keycap for the keyboard map — composed from tokens (no page-local CSS).
const Key = ({ children }: { children: React.ReactNode }) => (
  <kbd style={{ display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', lineHeight: 1.4, padding: '1px 6px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-xs)', background: 'var(--surface)', color: 'var(--fg)' }}>{children}</kbd>
);

type TitleType = 'text' | 'logo' | 'none' | 'loading';

function Logo() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <Icons.flame size={15} color="var(--accent)" />
      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, letterSpacing: '0.07em', fontSize: 14 }}>EIDOS</span>
    </span>
  );
}

// Spacing tokens from the LDSG spec (px). Edge padding, the gap from the leading
// group to the title area, the gap from the title to the trailing group, and the
// 16px gap *within* an icon group — all vary by variant exactly as documented.
function spacing(platform: Platform, al: 'center' | 'left', hasLead: boolean, hasTrail: boolean, textEdges: boolean) {
  return {
    edgeStart: textEdges ? 16 : (!hasLead && al === 'left' ? 20 : 12),
    edgeEnd: textEdges ? 16 : 12,
    // centred title sits 16 from each group; a left title sits 12 after back on Android
    // (Full-flex) and 20 after back on iOS / Sub Window.
    gapStart: al === 'center' ? 16 : (platform === 'android' ? 12 : 20),
    gapEnd: 16,
    inner: 16,
  };
}

function TopNav({ platform = 'ios', leading = [], trailing = [], title = 'Title', titleType = 'text', align }: {
  platform?: Platform; leading?: NavItem[]; trailing?: NavItem[]; title?: string; titleType?: TitleType; align?: 'center' | 'left';
}) {
  const ios = platform === 'ios';
  const barH = ios ? 44 : 56;
  const al = align ?? (ios ? 'center' : 'left');
  const hasLead = leading.length > 0;
  const hasTrail = trailing.length > 0;
  const textEdges = hasLead && hasTrail && leading.every((i) => i.t === 'text') && trailing.every((i) => i.t === 'text');
  const sp = spacing(platform, al, hasLead, hasTrail, textEdges);
  return (
    <header style={{ display: 'flex', alignItems: 'center', height: barH, paddingInlineStart: sp.edgeStart, paddingInlineEnd: sp.edgeEnd, background: 'var(--bg)', fontFamily: 'var(--font-sans)' }}>
      {hasLead && (
        <div style={{ display: 'flex', alignItems: 'center', gap: sp.inner, flex: 'none' }}>
          {leading.map((it, i) => <Item key={i} item={it} side="lead" barH={barH} />)}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0, height: 24, display: 'flex', alignItems: 'center', justifyContent: al === 'center' ? 'center' : 'flex-start', marginInlineStart: hasLead ? sp.gapStart : 0, marginInlineEnd: hasTrail ? sp.gapEnd : 0 }}>
        {titleType === 'none' ? null
          : titleType === 'logo' ? <Logo />
          : titleType === 'loading' ? <Skeleton width={120} height={12} label="Loading title" />
          : (
          <span style={{ fontSize: ios ? 16 : 17, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--fg)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{title}</span>
        )}
      </div>
      {hasTrail && (
        <div style={{ display: 'flex', alignItems: 'center', gap: sp.inner, flex: 'none' }}>
          {trailing.map((it, i) => <Item key={i} item={it} side="trail" barH={barH} />)}
        </div>
      )}
    </header>
  );
}

// A handset-width card so each example reads as a mobile surface (not a full-width bar).
function NavCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: DEVICE_W, maxWidth: '100%', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--bg)' }}>
      {children}
    </div>
  );
}

const ICONS = {
  back: <Icons.chevronLeft size={24} />, home: <Icons.home size={22} />, star: <Icons.star size={22} />,
  close: <Icons.x size={22} />, gear: <Icons.settings size={22} />, share: <Icons.upload size={22} />, heart: <Heart size={22} />,
};

function UsagePreview() {
  const [platform, setPlatform] = React.useState<Platform>('ios');
  const ios = platform === 'ios';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div role="radiogroup" aria-label="Platform" style={{ display: 'flex', gap: 2, padding: 3, background: 'var(--surface-active)', borderRadius: 999 }}>
        {(['ios', 'android'] as Platform[]).map((p) => (
          <button key={p} role="radio" aria-checked={platform === p} onClick={() => setPlatform(p)}
            style={{ padding: '6px 16px', borderRadius: 999, border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: platform === p ? 650 : 500, fontFamily: 'var(--font-mono)', background: platform === p ? 'var(--bg-elevated)' : 'transparent', color: platform === p ? 'var(--fg)' : 'var(--fg-muted)', boxShadow: platform === p ? 'var(--shadow-1)' : 'none' }}>
            {p === 'ios' ? 'iOS' : 'Android'}
          </button>
        ))}
      </div>
      <PhoneTop platform={platform} width={DEVICE_W} peek={70}>
        <TopNav platform={platform}
          leading={ios ? [IB(ICONS.back, 'Back'), IB(ICONS.home, 'Home')] : [IB(ICONS.back, 'Back')]}
          title="Main Window"
          trailing={ios ? [IB(ICONS.star, 'Favourite'), IB(ICONS.close, 'Close', true)] : [IB(ICONS.gear, 'Settings'), IB(ICONS.star, 'Favourite'), IB(ICONS.close, 'Close', true)]} />
      </PhoneTop>
    </div>
  );
}

// Live demo of the `required` overflow contract: as the screen narrows the bar
// drops trailing actions left-to-right, but the close (required) is never dropped.
function OverflowPreview() {
  const ALL: NavItem[] = [IB(ICONS.gear, 'Settings'), IB(ICONS.share, 'Share'), IB(ICONS.star, 'Favourite'), IB(ICONS.close, 'Close', true)];
  const [room, setRoom] = React.useState(4); // how many trailing slots fit
  // Keep the required close; fill remaining slots from the front, newest dropped first.
  const required = ALL.filter((i) => i.required);
  const optional = ALL.filter((i) => !i.required);
  const shown = [...optional.slice(0, Math.max(0, room - required.length)), ...required];
  const dropped = optional.length - Math.max(0, room - required.length);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }}>
      <NavCard><TopNav leading={[IB(ICONS.back, 'Back')]} title="Notifications" trailing={shown} /></NavCard>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: DEVICE_W, maxWidth: '100%' }}>
        <label htmlFor="ovf-room" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-subtle)', flex: 'none' }}>Width</label>
        <input id="ovf-room" type="range" min={1} max={4} step={1} value={room} onChange={(e) => setRoom(Number(e.target.value))}
          aria-label="Available trailing width" style={{ flex: 1, accentColor: 'var(--accent)', cursor: 'pointer' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg)', flex: 'none', minWidth: 80, textAlign: 'end' }}>
          {dropped > 0 ? `${dropped} dropped` : 'all fit'}
        </span>
      </div>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', lineHeight: 1.55, color: 'var(--fg-muted)', maxWidth: DEVICE_W, textAlign: 'center' }}>
        Drag to narrow the bar. Settings then Share fall away first — <span style={{ color: 'var(--fg)' }}>Close never does</span>.
      </div>
    </div>
  );
}

// ── React Native usage snippets ──────────────────────────────────────────────
const IMPORT = `import { TopNavigation } from '@eidos/mobile';
import { ChevronLeft, Home, Star, Settings, Close, Heart, Share } from '@eidos/mobile/icons';`;

const RN_USAGE = `${IMPORT}

export function MainWindowHeader({ platform }) {
  return (
    <TopNavigation
      platform={platform}                // "ios" | "android"
      title="Main Window"
      leading={[
        { icon: ChevronLeft, label: 'Back', onPress: goBack },
        { icon: Home,        label: 'Home', onPress: goHome },   // iOS pairs back + home
      ]}
      trailing={[
        { icon: Star,  label: 'Favourite', onPress: toggleFavourite },
        { icon: Close, label: 'Close', required: true, onPress: dismiss },
      ]}
    />
  );
}`;

const RN_IOS = `<TopNavigation
  platform="ios"                         // centred title, back + home
  title="Main Window"
  leading={[{ icon: ChevronLeft, label: 'Back' }, { icon: Home, label: 'Home' }]}
  trailing={[{ icon: Star, label: 'Favourite' }, { icon: Close, label: 'Close', required: true }]}
/>`;

const RN_ANDROID = `<TopNavigation
  platform="android"                     // left-aligned title, overflow inline
  title="Main Window"
  leading={[{ icon: ChevronLeft, label: 'Back' }]}
  trailing={[
    { icon: Settings, label: 'Settings' },
    { icon: Star, label: 'Favourite' },
    { icon: Close, label: 'Close', required: true },
  ]}
/>`;

const RN_TITLE_TEXT = `<TopNavigation
  titleType="text"            // default — truncates with an ellipsis
  title="FullFlex"
  leading={[{ icon: ChevronLeft, label: 'Back' }]}
  trailing={[{ icon: Star, label: 'Favourite' }, { icon: Close, label: 'Close', required: true }]}
/>`;

const RN_TITLE_LOGO = `<TopNavigation
  titleType="logo"            // renders <Logo /> in the title area
  logo={<EidosWordmark />}
  leading={[{ icon: ChevronLeft, label: 'Back' }]}
  trailing={[{ icon: Star, label: 'Favourite' }, { icon: Close, label: 'Close', required: true }]}
/>`;

const RN_TITLE_NONE = `<TopNavigation
  titleType="none"            // empty title area
  leading={[{ icon: ChevronLeft, label: 'Back' }]}
  trailing={[{ icon: Star, label: 'Favourite' }, { icon: Close, label: 'Close', required: true }]}
/>`;

const RN_SUB_RIGHT_ICON = `<TopNavigation
  variant="subWindow"
  title="Sub Window"
  leading={[{ icon: ChevronLeft, label: 'Back' }, { icon: Home, label: 'Home' }]}
  trailing={[{ icon: Star, label: 'Favourite' }, { icon: Close, label: 'Close', required: true }]}
/>`;

const RN_SUB_RIGHT_TEXT = `<TopNavigation
  variant="subWindow"
  title="Sub Window"
  leading={[{ icon: ChevronLeft, label: 'Back' }, { icon: Home, label: 'Home' }]}
  trailing={[{ text: 'Close', required: true, onPress: dismiss }]}   // text close button (min-width 75)
/>`;

const RN_SUB_LEFT_ICON = `<TopNavigation
  variant="subWindow"
  title="Sub Window"
  leading={[{ icon: Close, label: 'Close', required: true }, { icon: Home, label: 'Home' }]}  // close moves to the leading edge
  trailing={[{ icon: Star, label: 'Favourite' }, { icon: Home, label: 'Home' }]}
/>`;

const RN_SUB_LEFT_TITLE = `<TopNavigation
  variant="subWindow"
  title="Sub Window"
  titleAlign="left"
  leading={[{ icon: ChevronLeft, label: 'Back' }]}
  trailing={[{ icon: Heart, label: 'Like' }, { icon: Share, label: 'Share' }, { icon: Close, label: 'Close', required: true }]}
/>`;

const RN_TEXT_BUTTONS = `<TopNavigation
  title="Title"
  leading={[{ text: 'Close', required: true, onPress: dismiss }]}   // text buttons are min-width 75
  trailing={[{ text: 'Freetexts', onPress: onAction }]}
/>`;

const RN_EMPHASIS = `<TopNavigation
  title="Edit profile"
  leading={[{ icon: Close, label: 'Cancel', required: true }]}
  trailing={[{ text: 'Done', emphasis: true, onPress: save }]}      // emphasis = accent colour
/>`;

const RN_OVERFLOW = `<TopNavigation
  title="Notifications"
  leading={[{ icon: ChevronLeft, label: 'Back' }]}
  trailing={[
    { icon: Settings, label: 'Settings' },
    { icon: Share,    label: 'Share' },
    { icon: Star,     label: 'Favourite' },
    { icon: Close,    label: 'Close', required: true },   // never dropped on overflow
  ]}
/>`;

const RN_LOADING = `<TopNavigation
  titleType="loading"          // skeleton title while the screen resolves
  leading={[{ icon: ChevronLeft, label: 'Back' }]}
  trailing={[{ icon: Star, label: 'Favourite', disabled: true }, { icon: Close, label: 'Close', required: true }]}
/>`;

const RN_DISABLED = `<TopNavigation
  title="Draft"
  leading={[{ icon: ChevronLeft, label: 'Back' }]}
  trailing={[{ text: 'Publish', emphasis: true, disabled: true }, { icon: Close, label: 'Close', required: true }]}
/>`;  // emphasis action dims + sets aria-disabled until the draft is valid

const RN_IN_CONTEXT = `<Screen>
  <TopNavigation
    title="Activity"
    leading={[{ icon: ChevronLeft, label: 'Back' }, { icon: Home, label: 'Home' }]}
    trailing={[{ icon: Star, label: 'Favourite' }, { icon: Close, label: 'Close', required: true }]}
  />
  <ScrollView>{/* the screen's content scrolls under the pinned bar */}</ScrollView>
</Screen>`;

// A short activity list rendered under the bar so the component reads as a real screen.
const FEED: [string, string, string][] = [
  ['Deploy succeeded', 'api-gateway · production', '2m'],
  ['Review requested', 'eidos-ds #214', '18m'],
  ['Incident resolved', 'checkout latency', '1h'],
];

const PROPS = [
  { prop: 'platform', type: '"ios" | "android"', default: '"ios"', description: 'iOS centres the title and pairs back + home; Android left-aligns the title and keeps overflow actions inline.' },
  { prop: 'variant', type: '"fullFlex" | "subWindow"', default: '"fullFlex"', description: 'Main Window bar vs Sub Window header. Sub Window allows a leading close.' },
  { prop: 'title', type: 'string', default: '—', description: 'Title text. Truncates with an ellipsis when it overflows the flexible title area (min-width 136).' },
  { prop: 'titleType', type: '"text" | "logo" | "none" | "loading"', default: '"text"', description: 'What the title area holds: text, a logo node, nothing, or a role="status" skeleton while the screen resolves.' },
  { prop: 'titleAlign', type: '"center" | "left"', default: 'platform default', description: 'Override the platform default alignment of the title.' },
  { prop: 'leading', type: 'NavAction[]', default: '[]', description: 'Left icon area. Each action is { icon, label } or { text }, plus optional required / disabled — 24px glyphs spaced 16.' },
  { prop: 'trailing', type: 'NavAction[]', default: '[]', description: 'Right icon area. A required action (the close) is never dropped on overflow; a disabled action dims and sets aria-disabled.' },
  { prop: 'logo', type: 'ReactNode', default: '—', description: 'Rendered in the title area when titleType="logo".' },
];

export default function MobileTopNavigation() {
  return (
    <Section
      id="top-navigation"
      num="01"
      title="Top Navigation"
      desc="The bar at the top of a screen — leading icon area, flexible title, trailing icon area. iOS centres the title; Android left-aligns it. Close is always present; the rest are configurable."
    >
      <SubHead meta="package managers">Installation</SubHead>
      <Lede>Top Navigation ships in <Mono>@eidos/mobile</Mono>. Import the component and the icons each screen uses.</Lede>
      <CodeBlock label="import" lang="tsx" code={IMPORT} />

      <SubHead meta="hello world">Usage</SubHead>
      <Lede>
        Import <Mono>TopNavigation</Mono> from <Mono>@eidos/mobile</Mono> and pass <Mono>leading</Mono> / <Mono>trailing</Mono> action arrays plus a <Mono>title</Mono>. The bar adapts to the <Mono>platform</Mono> automatically — toggle it below.
      </Lede>
      <Frame label="Full-flex · adapts to the platform" center code={RN_USAGE} lang="tsx">
        <UsagePreview />
      </Frame>

      {/* Examples divider */}
      <div style={{ marginTop: 36, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      <SubHead meta="platform">iOS vs Android</SubHead>
      <Lede>The same bar, two platforms: iOS centres the title with a back + home pair; Android left-aligns the title and keeps the overflow (settings) action inline before favourite and close.</Lede>
      <Frame label="iOS · centred title" center code={RN_IOS} lang="tsx">
        <NavCard><TopNav platform="ios" leading={[IB(ICONS.back, 'Back'), IB(ICONS.home, 'Home')]} title="Main Window" trailing={[IB(ICONS.star, 'Favourite'), IB(ICONS.close, 'Close', true)]} /></NavCard>
      </Frame>
      <Frame label="Android · left-aligned title" center code={RN_ANDROID} lang="tsx">
        <NavCard><TopNav platform="android" leading={[IB(ICONS.back, 'Back')]} title="Main Window" trailing={[IB(ICONS.gear, 'Settings'), IB(ICONS.star, 'Favourite'), IB(ICONS.close, 'Close', true)]} /></NavCard>
      </Frame>

      <SubHead meta="title area">Title area</SubHead>
      <Lede>A flexible-width slot between the icon areas (min&nbsp;136 / height&nbsp;24). It holds <Mono>text</Mono> (truncates with an ellipsis), a <Mono>logo</Mono>, or <Mono>nothing</Mono>.</Lede>
      <Frame label="Text" center code={RN_TITLE_TEXT} lang="tsx">
        <NavCard><TopNav leading={[IB(ICONS.back, 'Back')]} title="FullFlex" trailing={[IB(ICONS.star, 'Favourite'), IB(ICONS.close, 'Close', true)]} /></NavCard>
      </Frame>
      <Frame label="Logo" center code={RN_TITLE_LOGO} lang="tsx">
        <NavCard><TopNav leading={[IB(ICONS.back, 'Back')]} titleType="logo" trailing={[IB(ICONS.star, 'Favourite'), IB(ICONS.close, 'Close', true)]} /></NavCard>
      </Frame>
      <Frame label="None" center code={RN_TITLE_NONE} lang="tsx">
        <NavCard><TopNav leading={[IB(ICONS.back, 'Back')]} titleType="none" trailing={[IB(ICONS.star, 'Favourite'), IB(ICONS.close, 'Close', true)]} /></NavCard>
      </Frame>
      <Frame label="Text · long title truncates" center code={`<TopNavigation title="A very long screen title that will not fit" … />`} lang="tsx">
        <NavCard><TopNav leading={[IB(ICONS.back, 'Back'), IB(ICONS.home, 'Home')]} title="A very long screen title that will not fit" trailing={[IB(ICONS.star, 'Favourite'), IB(ICONS.close, 'Close', true)]} /></NavCard>
      </Frame>

      <SubHead meta="sub window">Sub Window variants</SubHead>
      <Lede>A Sub Window header can place the <Mono>close</Mono> on the right or the left, as an icon or a text button (min-width&nbsp;75). The close is <Mono>required</Mono>; everything else is configurable.</Lede>
      <Frame label="Right close — icon" center code={RN_SUB_RIGHT_ICON} lang="tsx">
        <NavCard><TopNav leading={[IB(ICONS.back, 'Back'), IB(ICONS.home, 'Home')]} title="Sub Window" trailing={[IB(ICONS.star, 'Favourite'), IB(ICONS.close, 'Close', true)]} /></NavCard>
      </Frame>
      <Frame label="Right close — text button" center code={RN_SUB_RIGHT_TEXT} lang="tsx">
        <NavCard><TopNav leading={[IB(ICONS.back, 'Back'), IB(ICONS.home, 'Home')]} title="Sub Window" trailing={[TB('Close', { required: true })]} /></NavCard>
      </Frame>
      <Frame label="Left close — icon" center code={RN_SUB_LEFT_ICON} lang="tsx">
        <NavCard><TopNav leading={[IB(ICONS.close, 'Close', true), IB(ICONS.home, 'Home')]} title="Sub Window" trailing={[IB(ICONS.star, 'Favourite'), IB(ICONS.home, 'Home')]} /></NavCard>
      </Frame>
      <Frame label="Left title — left button" center code={RN_SUB_LEFT_TITLE} lang="tsx">
        <NavCard><TopNav leading={[IB(ICONS.back, 'Back')]} title="Sub Window" align="left" trailing={[IB(ICONS.heart, 'Like'), IB(ICONS.share, 'Share'), IB(ICONS.close, 'Close', true)]} /></NavCard>
      </Frame>
      <Frame label="Left title · no leading (20px edge)" center code={`<TopNavigation
  variant="subWindow"
  title="Sub Window"
  titleAlign="left"            // no leading → title sits 20 from the edge
  trailing={[{ icon: Heart, label: 'Like' }, { icon: Share, label: 'Share' }, { icon: Close, label: 'Close', required: true }]}
/>`} lang="tsx">
        <NavCard><TopNav title="Sub Window" align="left" trailing={[IB(ICONS.heart, 'Like'), IB(ICONS.share, 'Share'), IB(ICONS.close, 'Close', true)]} /></NavCard>
      </Frame>
      <Frame label="Text buttons · Close / Freetexts (min-width 75)" center code={RN_TEXT_BUTTONS} lang="tsx">
        <NavCard><TopNav leading={[TB('Close', { required: true })]} title="Title" trailing={[TB('Freetexts')]} /></NavCard>
      </Frame>
      <Frame label="Emphasis text action · Done (accent)" center code={RN_EMPHASIS} lang="tsx">
        <NavCard><TopNav leading={[IB(ICONS.close, 'Cancel', true)]} title="Edit profile" trailing={[TB('Done', { emphasis: true })]} /></NavCard>
      </Frame>

      <SubHead meta="real surface">In context</SubHead>
      <Lede>The bar pinned above a screen's content — a back + home pair naming the view, one favourite, and the always-present close.</Lede>
      <Frame label="Sub Window · pinned over content" center code={RN_IN_CONTEXT} lang="tsx">
        <NavCard>
          <TopNav leading={[IB(ICONS.back, 'Back'), IB(ICONS.home, 'Home')]} title="Activity" trailing={[IB(ICONS.star, 'Favourite'), IB(ICONS.close, 'Close', true)]} />
          <div style={{ borderBlockStart: '1px solid var(--border)' }}>
            {FEED.map(([t, s, time], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBlockEnd: i < FEED.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span className="s-dot sm" style={{ background: 'var(--fg-faint)', flex: 'none' }} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 'var(--text-md)', lineHeight: 1.5, fontWeight: 600, color: 'var(--fg)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t}</div>
                  <div style={{ fontSize: 'var(--text-base)', lineHeight: 1.5, color: 'var(--fg-muted)' }}>{s}</div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontVariantNumeric: 'tabular-nums', color: 'var(--fg-faint)', flex: 'none' }}>{time}</span>
              </div>
            ))}
          </div>
        </NavCard>
      </Frame>

      <SubHead meta="loading · disabled · error">States</SubHead>
      <Lede>The bar carries its own states. The title can resolve from a <Mono>loading</Mono> skeleton; an action can be <Mono>disabled</Mono> (dimmed, <Mono>aria-disabled</Mono>) until its precondition is met; and an action failure surfaces inline as a danger alert beneath the bar — never silently.</Lede>
      <Frame label="Loading title — skeleton while the screen resolves" center code={RN_LOADING} lang="tsx">
        <NavCard><TopNav leading={[IB(ICONS.back, 'Back')]} titleType="loading" trailing={[ID(ICONS.star, 'Favourite'), IB(ICONS.close, 'Close', true)]} /></NavCard>
      </Frame>
      <Frame label="Disabled action — Publish dims until the draft is valid" center code={RN_DISABLED} lang="tsx">
        <NavCard><TopNav leading={[IB(ICONS.back, 'Back')]} title="Draft" trailing={[TB('Publish', { emphasis: true, disabled: true }), IB(ICONS.close, 'Close', true)]} /></NavCard>
      </Frame>
      <Frame label="Saving — spinner replaces the emphasis action" center code={`<TopNavigation title="Edit profile"
  leading={[{ icon: Close, label: 'Cancel', required: true }]}
  trailing={[{ custom: <Spinner aria-label="Saving changes" /> }]}  // in-flight, not pressable
/>`} lang="tsx">
        <NavCard>
          <TopNav leading={[IB(ICONS.close, 'Cancel', true)]} title="Edit profile"
            trailing={[IB(<span style={{ display: 'inline-flex', color: 'var(--accent)' }}><Spinner size="md" aria-label="Saving changes" /></span>, 'Saving changes')]} />
        </NavCard>
      </Frame>
      <Frame label="Action error — surfaced inline as a danger alert" center code={`// On a failed action, render an Alert (role="alert") under the bar — never fail silently.
<>
  <TopNavigation title="Edit profile"
    leading={[{ icon: Close, label: 'Cancel', required: true }]}
    trailing={[{ text: 'Retry', emphasis: true, onPress: save }]}
  />
  <Alert tone="danger">Couldn't save your changes. Check your connection and retry.</Alert>
</>`} lang="tsx">
        <NavCard>
          <TopNav leading={[IB(ICONS.close, 'Cancel', true)]} title="Edit profile" trailing={[TB('Retry', { emphasis: true })]} />
          <div style={{ borderBlockStart: '1px solid var(--border)', padding: 16 }}>
            <Alert tone="danger">
              <AlertTitle>Couldn&apos;t save changes</AlertTitle>
              <AlertDescription>Check your connection, then tap Retry.</AlertDescription>
            </Alert>
          </div>
        </NavCard>
      </Frame>

      <SubHead meta="required · live">Overflow &amp; the required close</SubHead>
      <Lede>Trailing actions degrade gracefully: as the bar narrows it sheds optional actions left-to-right, but any action marked <Mono>required</Mono> — the close — holds its place. Drag the width to watch Settings and Share fall away while Close stays.</Lede>
      <Frame label="Live · required close survives overflow" center code={RN_OVERFLOW} lang="tsx">
        <OverflowPreview />
      </Frame>

      <SubHead meta="a11y">Accessibility</SubHead>
      <Lede>On the web the bar is real <Mono>{'<button>'}</Mono>s in a <Mono>{'<header>'}</Mono> landmark; on native the equivalent <Mono>accessibilityRole</Mono>s. Either way every action is reachable, named, and focus-visible.</Lede>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBlockEnd: 8 }}>Keyboard map</div>
          <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 14px', margin: 0, fontSize: 'var(--text-base)', lineHeight: 1.5, color: 'var(--fg-muted)' }}>
            <dt><Key>Tab</Key></dt><dd style={{ margin: 0 }}>Moves through actions in reading order — leading group, then trailing — ending on the required close.</dd>
            <dt style={{ whiteSpace: 'nowrap' }}><Key>Shift</Key> <Key>Tab</Key></dt><dd style={{ margin: 0 }}>Moves focus backward through the same order.</dd>
            <dt style={{ whiteSpace: 'nowrap' }}><Key>Enter</Key> / <Key>Space</Key></dt><dd style={{ margin: 0 }}>Activates the focused action; a <Mono>disabled</Mono> action is skipped and never activatable.</dd>
            <dt><Key>Esc</Key></dt><dd style={{ margin: 0 }}>Triggers the required close on a Sub Window header.</dd>
          </dl>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBlockEnd: 8 }}>Roles &amp; names</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The bar is a <Mono>header</Mono> region; the title is the screen heading. Icon-only actions each carry an <Mono>aria-label</Mono> (Back, Home, Favourite, Close) so none announces as an unnamed button. A disabled action sets <Mono>aria-disabled</Mono>; a loading title wraps a <Mono>role="status"</Mono> skeleton; an action error renders a <Mono>role="alert"</Mono> danger box.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBlockEnd: 8 }}>Targets, focus &amp; contrast</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>Glyphs render at 24px on the LINE rhythm (12 edge / 16 gap), but each control expands its hit area to ≥44px tall, so comfortable targets never shrink the visual spacing. Every action is focusable and paints the ember focus ring (<Mono>--ring</Mono>), so back never depends on the edge-swipe alone. Title, icons and status-bar glyphs are <Mono>--fg</Mono> on <Mono>--bg</Mono> (AA in both themes); the lone <Mono>--accent</Mono> is an emphasis text action.</div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBlockEnd: 8 }}>Motion</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>The bar renders statically — no slide-in or parallax; press feedback is a brief opacity dim. Under <Mono>prefers-reduced-motion</Mono> the global guard reduces that transition to ~0.01ms, so there is nothing left to suppress.</div>
        </div>
      </div>

      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label={'dir="rtl" — the icon areas swap; the back chevron mirrors'} center code={`// React Native flips the layout when I18nManager.isRTL.
// Directional glyphs get a horizontal mirror; the rest stay as drawn.
<TopNavigation
  platform="ios"
  title="نافذة رئيسية"
  leading={[
    { icon: ChevronLeft, label: 'رجوع', mirror: true },   // mirror directional icons
    { icon: Home, label: 'الرئيسية' },
  ]}
  trailing={[{ icon: Star, label: 'المفضلة' }, { icon: Close, label: 'إغلاق', required: true }]}
/>`} lang="tsx">
        <div dir="rtl">
          <NavCard>
            <TopNav
              platform="ios"
              leading={[IB(<span style={{ display: 'inline-flex', transform: 'scaleX(-1)' }}><Icons.chevronLeft size={24} /></span>, 'رجوع'), IB(ICONS.home, 'الرئيسية')]}
              title="نافذة رئيسية"
              trailing={[IB(ICONS.star, 'المفضلة'), IB(ICONS.close, 'إغلاق', true)]}
            />
          </NavCard>
        </div>
      </Frame>
      <Lede>In <Mono>dir="rtl"</Mono> the left and right icon areas swap automatically — logical <Mono>padding-inline</Mono> and flex order do the work — so back stays on the leading (now right) edge. The back chevron is directional, so it mirrors with <Mono>scaleX(-1)</Mono>; home, star and close are non-directional and stay as drawn.</Lede>

      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body center" style={{ padding: '64px 36px 56px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: DEVICE_W }} aria-hidden="true">
              <NavCard><TopNav leading={[IB(ICONS.back, 'Back'), IB(ICONS.home, 'Home')]} title="Top Navigation" trailing={[IB(ICONS.star, 'Favourite'), IB(ICONS.close, 'Close', true)]} /></NavCard>
              <span className="lead v" style={{ top: -22, left: '26%', height: 18 }} />
              <span className="lead v" style={{ top: -22, left: '50%', height: 18, transform: 'translateX(-50%)' }} />
              <span className="lead h" style={{ top: 22, left: -28, width: 24 }} />
              <span className="lead h" style={{ top: 22, right: -28, width: 24 }} />
              <div className="pin" style={{ top: -42, left: '26%', transform: 'translateX(-50%)' }}>1</div>
              <div className="pin" style={{ top: -42, left: '50%', transform: 'translateX(-50%)' }}>3</div>
              <div className="pin" style={{ top: 13, left: -52 }}>2</div>
              <div className="pin" style={{ top: 13, right: -52 }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 560, margin: '52px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>Container.</b> A 44px (iOS) / 56px (Android) bar on <Mono>--bg</Mono>, under the status bar, with 12px inline edge padding.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Left icon area.</b> Back, optionally home; or a required close. 24px glyphs spaced 16px.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>Title area.</b> Flexible slot (min&nbsp;136 / height&nbsp;24) — text, logo, or none. iOS centres it; Android left-aligns it 20px after back. Truncates.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>Right icon area.</b> Configurable actions ending in the <b style={{ color: 'var(--fg)' }}>required</b> close.</span>
          </div>
        </div>
      </div>

      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12} /> Do — keep the close required, actions few</div>
          <div className="body" style={{ justifyContent: 'center' }}>
            <NavCard><TopNav leading={[IB(ICONS.back, 'Back'), IB(ICONS.home, 'Home')]} title="Sub Window" trailing={[IB(ICONS.star, 'Favourite'), IB(ICONS.close, 'Close', true)]} /></NavCard>
          </div>
          <div className="note">Back/home leading, one favourite, the always-present close. The title reads at a glance.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12} /> Don't — crowd both sides with icons</div>
          <div className="body" style={{ justifyContent: 'center' }}>
            <NavCard><TopNav leading={[IB(ICONS.back, 'Back'), IB(ICONS.home, 'Home')]} title="Sub Window" trailing={[IB(ICONS.heart, 'Like'), IB(ICONS.share, 'Share'), IB(ICONS.star, 'Favourite'), IB(ICONS.gear, 'Settings'), IB(ICONS.close, 'Close', true)]} /></NavCard>
          </div>
          <div className="note">Five trailing icons squeeze the title and shrink targets. Move extras behind a single Pulldown Menu.</div>
        </div>
      </div>

      <SubHead meta="measurements">Spacing</SubHead>
      <Lede>Exact LDSG values, honoured per variant: <Mono>24px</Mono> icon glyphs, a <Mono>16px</Mono> gap inside each icon group, text buttons at <Mono>min-width 75</Mono>, and a title area of <Mono>min-width 136 / height 24</Mono>.</Lede>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">measurements</span></div>
        <table className="spec" style={{ margin: 0 }}>
          <thead>
            <tr>{['Variant', 'Edge start', 'Lead → title', 'Title → trail', 'Icon gap', 'Edge end'].map((h) => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {([
              ['Full-flex · iOS', '12', '16', '16', '16', '12'],
              ['Full-flex · Android', '12', '12', '16', '16', '12'],
              ['Sub · left title + back', '12', '20', '16', '16', '12'],
              ['Sub · left title, no back', '20', '—', '16', '16', '12'],
              ['Text buttons', '16', '16', '16', '—', '16'],
            ] as const).map((r) => (
              <tr key={r[0]}>
                <td>{r[0]}</td>
                {r.slice(1).map((c, i) => <td key={i} className="mono">{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SubHead meta="TopNavigationProps">API reference</SubHead>
      <PropsTable rows={PROPS} label="TopNavigation" />
    </Section>
  );
}
