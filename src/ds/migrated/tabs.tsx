'use client';
// Forge DS — Components / Tabs.
// Compound API: Tabs · TabsList · TabsTrigger · TabsContent.
// Full ARIA (tablist/tab/tabpanel), roving tabindex, keyboard navigation,
// RTL-aware directional arrow keys, and prefers-reduced-motion support.
import * as React from 'react';
import {
  AutoPropsTable,
  Icons,
  Frame,
  Section,
  SubHead,
  TabbedCode,
  PropsTable,
  installTabs,
  Lede,
  Mono,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/ds/core';

const USAGE_CODE = `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/forge/tabs"

export function Demo() {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="deploys">Deploys</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">High-signal summary of the service.</TabsContent>
      <TabsContent value="deploys">Recent release timeline.</TabsContent>
    </Tabs>
  )
}`;

const PANELS: Record<string, string> = {
  overview: 'High-signal summary of the service. Owner, region, last deploy, current SLO burn.',
  deploys: 'A timeline of every release that touched this service in the last 30 days, with the GMUD it shipped under.',
  runbooks: 'Linked runbooks. Each one is a single-page playbook with role, severity, and the exact commands to run.',
  settings: 'Service-level configuration: alert routes, on-call rotation, dependency map.',
};

const PANELS_AR: Record<string, string> = {
  overview: 'ملخّص عالي الإشارة للخدمة. المالك، المنطقة، آخر نشر، استهلاك SLO الحالي.',
  deploys: 'الجدول الزمني لكل إصدار لمس هذه الخدمة في آخر ٣٠ يومًا، مع رقم النشر الذي صدر تحته.',
  runbooks: 'كتب التشغيل المرتبطة. كل واحد منها دليل من صفحة واحدة بالدور والخطورة والأوامر الدقيقة.',
  settings: 'إعدادات على مستوى الخدمة: مسارات التنبيه، دورة المناوبة، خريطة التبعيات.',
};

const PANELS_AR_RANGE: Record<string, string> = {
  day:   'البيانات لآخر ٢٤ ساعة.',
  week:  'البيانات لآخر ٧ أيام، مجمّعة بالساعة.',
  month: 'البيانات لآخر ٣٠ يومًا، مجمّعة باليوم.',
  year:  'البيانات لآخر ١٢ شهرًا، مجمّعة بالأسبوع.',
};

export default function TabsPage() {
  return (
    <Section
      id="tabs"
      num="10"
      title="Tabs"
      desc="Switch between sibling views without reloading the page. Line (underline) by default; pills when the tab strip needs to feel like a control instead of a header; enclosed for toolbars and code viewers."
    >
      {/* ── 1. INSTALLATION ──────────────────────────────────────────────── */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('tabs')} ariaLabel="package manager"/>
      <Lede>
        Full keyboard support (Arrow keys, Home/End, automatic activation) and the WAI-ARIA{' '}
        <Mono>tablist</Mono>/<Mono>tab</Mono>/<Mono>tabpanel</Mono> roles are built in — plain
        React over the Forge CSS layer, no Radix runtime. Pick the <em>Manual</em> tab to
        paste the source files instead.
      </Lede>

      {/* ── 2. USAGE ─────────────────────────────────────────────────────── */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="basic" code={USAGE_CODE}>
        <Tabs defaultValue="overview" style={{width:'100%'}}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deploys">Deploys</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">{PANELS.overview}</TabsContent>
          <TabsContent value="deploys">{PANELS.deploys}</TabsContent>
        </Tabs>
      </Frame>

      {/* ── 3. VARIANTS ──────────────────────────────────────────────────── */}
      <div style={{
        marginTop: 36, marginBottom: 6,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--fg-faint)',
        }}>Variants</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      {/* Line (default) */}
      <SubHead meta="default">Line</SubHead>
      <Frame
        label="page-level navigation"
        code={`<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">
      <Icons.gauge size={13} style={{marginInlineEnd:6}}/>Overview
    </TabsTrigger>
    <TabsTrigger value="deploys">
      Deploys <span className="count">12</span>
    </TabsTrigger>
    <TabsTrigger value="runbooks">Runbooks <span className="count">4</span></TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">{PANELS.overview}</TabsContent>
  {/* … */}
</Tabs>`}
      >
        <Tabs defaultValue="overview" style={{width:'100%'}}>
          <TabsList>
            <TabsTrigger value="overview">
              <Icons.gauge size={13} style={{marginInlineEnd:6, verticalAlign:'middle'}}/>Overview
            </TabsTrigger>
            <TabsTrigger value="deploys">
              Deploys <span className="count">12</span>
            </TabsTrigger>
            <TabsTrigger value="runbooks">
              Runbooks <span className="count">4</span>
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">{PANELS.overview}</TabsContent>
          <TabsContent value="deploys">{PANELS.deploys}</TabsContent>
          <TabsContent value="runbooks">{PANELS.runbooks}</TabsContent>
          <TabsContent value="settings">{PANELS.settings}</TabsContent>
        </Tabs>
      </Frame>

      {/* Pills */}
      <SubHead meta="pills">Pills</SubHead>
      <Frame
        label="control-style tab strip"
        code={`<Tabs defaultValue="week" variant="pills">
  <TabsList>
    <TabsTrigger value="day">Day</TabsTrigger>
    <TabsTrigger value="week">Week</TabsTrigger>
    <TabsTrigger value="month">Month</TabsTrigger>
    <TabsTrigger value="year">Year</TabsTrigger>
  </TabsList>
  <TabsContent value="day">Last 24 hours.</TabsContent>
  {/* … */}
</Tabs>`}
      >
        <Tabs defaultValue="week" variant="pills" style={{width:'100%'}}>
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
          <TabsContent value="day">Data for the last 24 hours.</TabsContent>
          <TabsContent value="week">Data for the last 7 days, hourly aggregation.</TabsContent>
          <TabsContent value="month">Data for the last 30 days, daily aggregation.</TabsContent>
          <TabsContent value="year">Data for the last 12 months, weekly aggregation.</TabsContent>
        </Tabs>
      </Frame>

      {/* Enclosed */}
      <SubHead meta="enclosed">Enclosed</SubHead>
      <Frame
        label="toolbar-style tab strip"
        code={`<Tabs defaultValue="preview" variant="enclosed">
  <TabsList>
    <TabsTrigger value="preview">Preview</TabsTrigger>
    <TabsTrigger value="code">Code</TabsTrigger>
    <TabsTrigger value="tokens">Tokens</TabsTrigger>
  </TabsList>
  <TabsContent value="preview">Live preview area.</TabsContent>
  {/* … */}
</Tabs>`}
      >
        <Tabs defaultValue="preview" variant="enclosed" style={{width:'100%'}}>
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">Live component preview area.</TabsContent>
          <TabsContent value="code">Source code snippet.</TabsContent>
          <TabsContent value="tokens">Design token values.</TabsContent>
        </Tabs>
      </Frame>

      {/* Vertical */}
      <SubHead meta="vertical">Vertical</SubHead>
      <Frame
        label="vertical orientation"
        code={`<Tabs defaultValue="overview" orientation="vertical">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="deploys">Deploys</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">{PANELS.overview}</TabsContent>
  <TabsContent value="deploys">{PANELS.deploys}</TabsContent>
</Tabs>`}
      >
        <Tabs defaultValue="overview" orientation="vertical" style={{width:'100%'}}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deploys">Deploys</TabsTrigger>
            <TabsTrigger value="runbooks">Runbooks</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">{PANELS.overview}</TabsContent>
          <TabsContent value="deploys">{PANELS.deploys}</TabsContent>
          <TabsContent value="runbooks">{PANELS.runbooks}</TabsContent>
          <TabsContent value="settings">{PANELS.settings}</TabsContent>
        </Tabs>
      </Frame>

      {/* ── 4. STATES ────────────────────────────────────────────────────── */}
      <SubHead meta="states">Disabled triggers</SubHead>
      <Frame
        label="disabled triggers — skipped by keyboard"
        code={`<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="deploys" disabled>Deploys</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  {/* … */}
</Tabs>`}
      >
        <Tabs defaultValue="overview" style={{width:'100%'}}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deploys" disabled>Deploys (disabled)</TabsTrigger>
            <TabsTrigger value="runbooks">Runbooks</TabsTrigger>
            <TabsTrigger value="settings" disabled>Settings (disabled)</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">ArrowRight skips disabled triggers.</TabsContent>
          <TabsContent value="deploys">Cannot reach.</TabsContent>
          <TabsContent value="runbooks">Runbooks panel.</TabsContent>
          <TabsContent value="settings">Cannot reach.</TabsContent>
        </Tabs>
      </Frame>

      {/* ── 5. ACCESSIBILITY ─────────────────────────────────────────────── */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{marginTop: 12}}>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>
            The tab strip uses roving <code>tabindex</code>: one Tab stop reaches the active tab,
            then Arrow Left / Right (Up / Down when vertical) move between triggers, with Home / End
            jumping to first / last. Activation is automatic on focus move; a second Tab moves into
            the panel. Disabled triggers are skipped.
          </div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>
            The strip is <code>role=&quot;tablist&quot;</code>, each trigger is <code>role=&quot;tab&quot;</code>{' '}
            with <code>aria-selected</code> and <code>aria-controls</code> pointing at its{' '}
            <code>role=&quot;tabpanel&quot;</code>; the panel carries{' '}
            <code>aria-labelledby</code> back to its trigger. Inactive panels use{' '}
            <code>hidden</code> so their content is skipped by assistive technology.
          </div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>
            The focused trigger shows the ember focus ring (<Mono>--ring</Mono>). Active state is
            communicated via more than colour alone: an underline (line variant), filled pill (pills),
            or tinted segment (enclosed). Label text meets AA (4.5:1) for both active and inactive
            in both themes.
          </div>
        </div>
        <div className="surface" style={{padding: 18}}>
          <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
          <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>
            Trigger colour transitions are eased with <Mono>--ease</Mono>. Under{' '}
            <code>prefers-reduced-motion</code> transitions are suppressed and panels swap
            without a fade.
          </div>
        </div>
      </div>

      {/* ── 6. RTL ───────────────────────────────────────────────────────── */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame
        label='dir="rtl" — first tab lands on the right, arrow keys mirror'
        code={`<div dir="rtl">
  <Tabs defaultValue="overview">
    <TabsList>
      <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
      <TabsTrigger value="deploys">عمليات النشر <span className="count">١٢</span></TabsTrigger>
      <TabsTrigger value="runbooks">كتب التشغيل <span className="count">٤</span></TabsTrigger>
      <TabsTrigger value="settings">الإعدادات</TabsTrigger>
    </TabsList>
    <TabsContent value="overview">…</TabsContent>
  </Tabs>
</div>`}
      >
        <div dir="rtl" style={{width:'100%'}}>
          <Tabs defaultValue="overview">
            <TabsList aria-label="أقسام الخدمة">
              <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
              <TabsTrigger value="deploys">
                عمليات النشر <span className="count">١٢</span>
              </TabsTrigger>
              <TabsTrigger value="runbooks">
                كتب التشغيل <span className="count">٤</span>
              </TabsTrigger>
              <TabsTrigger value="settings">الإعدادات</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">{PANELS_AR.overview}</TabsContent>
            <TabsContent value="deploys">{PANELS_AR.deploys}</TabsContent>
            <TabsContent value="runbooks">{PANELS_AR.runbooks}</TabsContent>
            <TabsContent value="settings">{PANELS_AR.settings}</TabsContent>
          </Tabs>
          <div style={{marginTop: 20}}>
            <Tabs defaultValue="week" variant="pills">
              <TabsList>
                <TabsTrigger value="day">يوم</TabsTrigger>
                <TabsTrigger value="week">أسبوع</TabsTrigger>
                <TabsTrigger value="month">شهر</TabsTrigger>
                <TabsTrigger value="year">سنة</TabsTrigger>
              </TabsList>
              <TabsContent value="day">{PANELS_AR_RANGE.day}</TabsContent>
              <TabsContent value="week">{PANELS_AR_RANGE.week}</TabsContent>
              <TabsContent value="month">{PANELS_AR_RANGE.month}</TabsContent>
              <TabsContent value="year">{PANELS_AR_RANGE.year}</TabsContent>
            </Tabs>
          </div>
        </div>
      </Frame>
      <Lede>
        The flex tablist mirrors automatically — the first tab lands on the right. The active
        indicator uses logical <Mono>inset-inline: 0</Mono> so the underline spans the full
        trigger width regardless of direction. Arrow keys also mirror: ArrowLeft advances in RTL
        contexts.
      </Lede>

      {/* ── 7. ANATOMY ───────────────────────────────────────────────────── */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{padding: '72px 36px 56px'}}>
          <div className="ana" style={{display:'flex', justifyContent:'center'}}>
            <div className="stage" style={{position:'relative', width: 480}} aria-hidden="true">
              {/* Render a real compound instance but aria-hidden for anatomy purposes */}
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">
                    <Icons.gauge size={13} style={{marginInlineEnd:6, verticalAlign:'middle'}}/>
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="deploys">Deploys<span className="count">12</span></TabsTrigger>
                  <TabsTrigger value="runbooks">Runbooks</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
              </Tabs>
              <span className="lead v" style={{top: -28, left: 56, height: 22}}/>
              <span className="lead v" style={{top: -28, left: 20, height: 22}}/>
              <span className="lead v" style={{bottom: -28, left: 56, height: 24}}/>
              <span className="lead v" style={{top: -28, left: 190, height: 22}}/>
              <span className="lead h" style={{bottom: 0, right: -36, width: 32}}/>
              <div className="pin" style={{top: -52, left: 20, transform:'translateX(-50%)'}}>1</div>
              <div className="pin" style={{top: -52, left: 56, transform:'translateX(-50%)'}}>5</div>
              <div className="pin" style={{bottom: -52, left: 56, transform:'translateX(-50%)'}}>2</div>
              <div className="pin" style={{top: -52, left: 190, transform:'translateX(-50%)'}}>3</div>
              <div className="pin" style={{bottom: -8, right: -60}}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
            <span className="num">1</span>
            <span><b style={{color:'var(--fg)'}}>Trigger label.</b> 13px Geist 500. One or two words — the tab strip is a table of contents, not prose. Sentence case.</span>
            <span className="num">2</span>
            <span><b style={{color:'var(--fg)'}}>Active indicator.</b> 2px ember bar at <Mono>bottom: -1px</Mono>, full trigger width via logical <Mono>inset-inline: 0</Mono>. Only the selected trigger paints it (line variant).</span>
            <span className="num">3</span>
            <span><b style={{color:'var(--fg)'}}>Inactive tone.</b> Idle triggers use <Mono>--fg-muted</Mono>; hover lifts to <Mono>--fg</Mono>. Active reads as <Mono>--fg</Mono> + indicator — never bold.</span>
            <span className="num">4</span>
            <span><b style={{color:'var(--fg)'}}>Hairline.</b> 1px <Mono>--border</Mono> baseline under the strip — the indicator sits one pixel below it, so the active trigger visually "owns" that segment.</span>
            <span className="num">5</span>
            <span><b style={{color:'var(--fg)'}}>Leading icon.</b> Optional 13px glyph with <Mono>marginInlineEnd: 6</Mono>. Use only when icons exist for every tab — never mix labeled and icon-only triggers.</span>
          </div>
        </div>
      </div>

      {/* ── 8. DO / DON'T ────────────────────────────────────────────────── */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — short, scannable labels</div>
          <div className="body">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="deploys">Deploys</TabsTrigger>
                <TabsTrigger value="runbooks">Runbooks</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="note">One- or two-word labels. The tab strip is a table of contents — long labels turn it into prose.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — sentence-as-tab</div>
          <div className="body">
            <Tabs defaultValue="a">
              <TabsList>
                <TabsTrigger value="a">Service overview</TabsTrigger>
                <TabsTrigger value="b">Recent deploys (last 30d)</TabsTrigger>
                <TabsTrigger value="c">Linked runbooks &amp; alerts</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="note">If a tab needs a sentence, you're describing a section — promote it to its own page.</div>
        </div>
      </div>

      {/* ── 9. API REFERENCE ─────────────────────────────────────────────── */}
      <SubHead meta="TabsProps">API reference</SubHead>
      <AutoPropsTable component="Tabs" label="<Tabs />" />
      <PropsTable
        label="<TabsList />"
        rows={[
          { prop: 'aria-label', type: 'string', default: undefined, description: 'Accessible label for the tablist. Recommended when the page has multiple tablists.' },
          { prop: 'className', type: 'string', default: undefined, description: 'Extra utility classes.' },
          { prop: 'children', type: 'ReactNode', required: true, description: 'One or more TabsTrigger elements.' },
        ]}
      />
      <PropsTable
        label="<TabsTrigger />"
        rows={[
          { prop: 'value', type: 'string', required: true, description: 'Identifier — must match the value on the corresponding TabsContent.' },
          { prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables the trigger and skips it during keyboard navigation.' },
          { prop: 'className', type: 'string', default: undefined, description: 'Extra utility classes.' },
          { prop: 'children', type: 'ReactNode', required: true, description: 'Trigger label content. May include icons or count badges.' },
        ]}
      />
      <PropsTable
        label="<TabsContent />"
        rows={[
          { prop: 'value', type: 'string', required: true, description: 'Identifier — must match the value on the corresponding TabsTrigger.' },
          { prop: 'className', type: 'string', default: undefined, description: 'Extra utility classes.' },
          { prop: 'children', type: 'ReactNode', required: true, description: 'Panel content. Hidden via the `hidden` attribute when inactive.' },
        ]}
      />
    </Section>
  );
}
