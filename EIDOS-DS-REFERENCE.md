# Eidos Design System — LLM Reference

> **Para o LLM:** este é o catálogo completo do Eidos DS — tokens, classes CSS, componentes React, ícones, e cada página de documentação. Use-o antes de criar qualquer página, telas de exemplo, ou variação. **Nunca reinvente** algo que já existe aqui — composição é a regra.
>
> Arquivos canônicos relacionados:
> - `CLAUDE.md` — regras de autoria curtas (versão TL;DR deste documento)
> - `eidos-design-system/assets/js/core/nav-config.js` — single source of truth da navegação
> - `eidos-design-system/assets/css/tokens.css` — todos os tokens CSS
> - `eidos-design-system/assets/css/ds.css` — sistema de classes (componentes)
> - `eidos-design-system/assets/js/core/{atoms,primitives,blocks,icons,charts,shell}.jsx` — React core
> - `BACKLOG.md` — itens em aberto

---

## 1. Como a estrutura do projeto funciona

### 1.1 Entry point
- `eidos-design-system/design-system.html` — página "Introduction" (raiz)
- Todas as outras páginas vivem em `eidos-design-system/pages/<group>/<slug>.html`

### 1.2 Padrão de cada página HTML
Toda página é uma casca fina que:

1. Declara o slug: `<script>window.PAGE_SLUG = 'buttons';</script>`
2. Define `<base href="...">` (raiz → `./`, `pages/<group>/` → `../../`)
3. Carrega scripts NESTA ORDEM exata:
   ```
   assets/css/tokens.css
   assets/css/ds.css
   assets/js/core/mocks.js
   assets/js/core/nav-config.js
   assets/js/core/icons.jsx
   assets/js/core/atoms.jsx
   assets/js/core/primitives.jsx
   assets/js/core/blocks.jsx
   assets/js/core/charts.jsx          ← apenas em páginas que usam charts
   assets/js/core/shell.jsx
   assets/js/pages/<group>/<slug>.jsx ← a página em si
   assets/js/core/boot.jsx            ← SEMPRE por último
   ```

### 1.3 Padrão de cada arquivo JSX de página
```jsx
(() => {
  const { Section, SubHead, Frame, ... } = window;

  function MyPage() {
    return (
      <Section id="my-slug" title="My Component" desc="…">
        <SubHead meta="default">Default</SubHead>
        <Frame label="…" code={`…`}>{/* live demo */}</Frame>
        {/* … Anatomy, Decision matrix, Do/Don't, RTL example */}
      </Section>
    );
  }

  window.PAGES = window.PAGES || {};
  window.PAGES['my-slug'] = MyPage;
})();
```

`boot.jsx` resolve `window.PAGES[window.PAGE_SLUG]` e monta dentro de `<DSShell>`.

### 1.4 Adicionar uma nova página = 3 ações coordenadas
1. Adicionar `{ id, label, href }` em `nav-config.js` no (sub)grupo correto
2. Criar `pages/<group>/<slug>.html` (copiar `pages/_template.html`)
3. Criar `assets/js/pages/<group>/<slug>.jsx` registrando `window.PAGES['<slug>']`

### 1.5 React / Babel pinning (NUNCA mexer)
- `react@18.3.1`
- `react-dom@18.3.1`
- `@babel/standalone@7.29.0`

Cada `<script type="text/babel">` tem seu próprio escopo. Compartilhar componentes é via `Object.assign(window, { ... })` no fim de cada IIFE.

### 1.6 Versionamento
- Versão atual: **v1.7.12** (visível na sidebar como sub-text e no badge ember do topbar)
- `window.EIDOS_VERSION` em `nav-config.js` controla o cache busting (`?v=...` nas páginas)
- **Sempre bump em dois lugares ao mesmo tempo:** sidebar sub-text + topbar badge

---

## 2. Design tokens (resumo)

### 2.1 Cores — superfície e foreground

**Dark (default)**
```
--bg              #08090A
--bg-elevated     #0F1011
--surface         #141517
--surface-hover   #1A1B1E
--surface-active  #1F2024
--border          rgba(255,255,255,0.06)
--border-strong   rgba(255,255,255,0.12)
--border-stronger rgba(255,255,255,0.18)
--fg              #EDEDED
--fg-muted        #A1A1A6
--fg-subtle       #6B6B70
--fg-faint        #4A4A4F
```

**Light** (via `[data-theme="light"]`)
```
--bg              #FAFAFA
--bg-elevated     #FFFFFF
--surface         #FFFFFF
--surface-hover   #F4F4F5
--surface-active  #ECECEE
--fg              #0A0A0B
--fg-muted        #52525B
```

### 2.2 Cores — acentos

```
--ember        #FF6B35   ← cor de marca (única acent saturada)
--ember-glow   #FF8C42
--ember-deep   #E04E1A
--ember-soft   rgba(255,107,53,0.12)
--ice          #7DD3FC   ← cool accent
--ice-soft     rgba(125,211,252,0.12)
--success      #34D399
--warning      #FBBF24
--danger       #F87171
--violet       #A78BFA
```

### 2.3 Tipografia
```
--font-sans  'Geist', 'Inter', system-ui, sans-serif
--font-mono  'Geist Mono', 'JetBrains Mono', ui-monospace, monospace

--text-xs     11px   /* mono label uppercase */
--text-sm     12.5px /* helper, captions */
--text-base   13px   /* table body, controls */
--text-md     14px   /* btn lg, fc-row label */
--text-body   15px   /* default body */
--text-lg     17px   /* lede */
--text-xl     20px   /* h3 */
--text-2xl    28px   /* h2 / page header */
--text-3xl    36px   /* h1 */
--text-display     56px
--text-display-xl  72px
```

Utility classes: `.t-display-xl`, `.t-display-lg`, `.t-h1`, `.t-h2`, `.t-h3`, `.t-body-lg`, `.t-body`, `.t-small`, `.t-mono`, `.t-mono-label`.

### 2.4 Spacing & radius

```
Spacing: --space-0/px/1(4px)/2(8)/3(12)/4(16)/5(20)/6(24)/8(32)/10(40)/12(48)/16(64)/24(96)

--radius-xs   3px   /* code chips, kbd */
--radius-sm   4px   /* tags */
--radius-md   5px   /* nav items */
--radius-lg   6px   /* DEFAULT — surface, button, input */
--radius-xl   8px   /* toolbar, fc-card, frame */
--radius-2xl  12px  /* modal, drawer, sidesheet, hero */
--radius-full 9999px /* pill, dot */
```

Prose widths: `--prose-narrow: 56ch`, `--prose-default: 64ch`, `--prose-wide: 72ch`.

Breakpoints (alinhados a Tailwind): `--bp-sm 640`, `--bp-md 768`, `--bp-lg 1024`, `--bp-xl 1280`, `--bp-2xl 1536`.

### 2.5 Motion
```
--ease           cubic-bezier(0.16, 1, 0.3, 1)         /* ease-out (default) */
--ease-out       (same)
--ease-in        cubic-bezier(0.7, 0, 0.84, 0)
--ease-spring    cubic-bezier(0.34, 1.56, 0.64, 1)    /* used by switch thumb ONLY */
--dur-xs         80ms
--dur-fast       120ms
--dur            220ms                                /* default */
--dur-slow       360ms
--dur-stagger    60ms                                 /* gap between siblings */
```

Honrar `prefers-reduced-motion: reduce` (todas as animações devem ter override).

### 2.6 Sombras (6 níveis)
- `--shadow-0`: none
- `--shadow-1..5`: composite key + ambient. Use:
  - **1** chip / row hover
  - **2** popover / hover-card
  - **3** dropdown / select panel
  - **4** modal / drawer / sidesheet
  - **5** elevated hero / splash only

### 2.7 Paleta de visualização (charts)

12 cores categóricas — usar SEMPRE via `var(--viz-cat-N)`:
```
--viz-cat-1  ember       --viz-cat-2  ice         --viz-cat-3  violet
--viz-cat-4  success     --viz-cat-5  warning     --viz-cat-6  pink
--viz-cat-7  teal        --viz-cat-8  indigo      --viz-cat-9  lime
--viz-cat-10 rose        --viz-cat-11 cyan        --viz-cat-12 yellow
```

Sequencial: `--viz-seq-low/mid/high`. Divergente: `--viz-div-neg/zero/pos`. Grid/axis: `--viz-grid`, `--viz-axis`, `--viz-tooltip-bg`.

### 2.8 Tokens semânticos IDP (4 famílias)

```
Severity (incidents, P0–P3):
  --severity-p0  #DC2626  P0 critical
  --severity-p1  #F97316  P1 high
  --severity-p2  #FBBF24  P2 medium
  --severity-p3  #7DD3FC  P3 info
  (+ --severity-pN-soft para backgrounds)

Run status (pipelines, jobs):
  --status-pending  --status-running  --status-done
  --status-error    --status-skipped
  (+ -soft variants)

Service health:
  --health-up  --health-degraded  --health-down  --health-unknown

Change Risk Score / Quality Gate:
  --risk-low  --risk-med  --risk-high  --risk-crit
```

**Convenção**: P0 é o pior (mais grave). `--severity-p0` é intencionalmente mais escuro que `--danger`.

### 2.9 AI surface tokens
```
--ai-bg, --ai-surface, --ai-fg, --ai-fg-muted, --ai-border,
--ai-accent (= --ember), --ai-streaming-caret
```

### 2.10 Z-index
```
--z-base 0, --z-sticky 20, --z-dropdown 40, --z-popover 60,
--z-modal 100, --z-toast 200, --z-tooltip 300
```

---

## 3. Sistemas de classes CSS (organizados por prefixo)

### 3.1 Utilidades atômicas
- `.surface` — superfície bordada (bg + border + radius 6px)
- `.hairline` — borda fina, sem fundo
- `.divider`, `.divider-v` — divisores 1px
- `.focus-ring:focus-visible` — anel ember 2px
- `.dot-grid` — fundo pontilhado decorativo
- `.row-hover:hover` — fundo `surface-hover`
- `.hide-sb` — esconde scrollbar (cross-browser)
- `.fade-in` — animação `fade-in` (translate + opacity)
- `.ember-pulse`, `.ember-glow-bg` — efeitos brand
- `.tilt-3` — perspectiva 3deg
- `.page-enter` — animação de entrada da página

### 3.2 `.in-*` — Input building blocks
Sistema único para todos os campos de texto/número/select.

```
.in-field    contêiner: label + group + helper/error
.in-group    casca bordada onde mora o focus ring (sm | md | lg | is-invalid | is-disabled | is-readonly)
.in-control  o <input>/<select> nativo (silencioso no focus: box-shadow:none !important)
.in-addon    addon dentro do .in-group:
  .in-addon.icon    ícone à esquerda/direita
  .in-addon.text    label de texto (cantos divididos por hairline)
  .in-addon.btn     botão (clear, eye, copy)
  .in-addon.select  <select> embutido
  .in-addon.spinner indicador de loading
  .in-addon.stepper duas chevrons verticais (number input)
.in-tags     wrapper para chips dentro do field (tag input)
.in-tag      chip removível (com .tag-x)
.in-otp / .in-otp-cell / .in-otp-sep  OTP input
.in-pop / .in-pop-item / .in-pop-empty  Autocomplete dropdown (mesma chrome de Combobox)
.in-help / .in-error / .in-counter / .in-helprow  helpers abaixo do field
.in-label .required-mark / .opt        marcadores no label
```

**Regra dura:** o foco PINTA apenas em `.in-group:focus-within`. Inputs internos têm `:focus { box-shadow: none !important }`.

### 3.3 `.fc-*` — Form controls
Checkbox, Radio, Switch (formerly Toggle).

```
.fc                 wrapper clicável (label inteiro)
.fc-input           <input> real, opacity:0, full-bleed mas hit-testable
.fc-text / .fc-label / .fc-desc  label + descrição abaixo
.fc-check-box  .fc-check-icon  .fc-check-dash    checkbox visual (suporta :indeterminate)
.fc-radio-box  .fc-radio-dot                     radio visual (spring scale)
.fc-toggle-track  .fc-toggle-thumb               switch (thumb usa --ease-spring)
.fc-card                                         radio em forma de card inteiro clicável
.fc-row                                          row de settings (label esq, control dir)
.fc-help / .fc-error                             helpers
```

Estados via `aria-invalid="true"` ou `.error`. Tamanhos `.sm` `.md` `.lg`.

**Crítico:** NÃO usar `htmlFor` num `<label>` que TAMBÉM envolve o input — onChange dispara duas vezes.

### 3.4 `.cb-*` — Combobox
Painel usa `position: fixed` (escapa do `overflow: hidden` do `.ds-frame`); ancoragem via `getBoundingClientRect()` num `useEffect`.

```
.cb / .cb-trigger / .cb-input / .cb-panel
.cb-search / .cb-list / .cb-item / .cb-group
.cb-empty / .cb-foot
```

Foco do `.cb-input` é silencioso (anel pintado apenas no painel).

### 3.5 `.menu` — Menu unificado
Um único primitive para Dropdown Menu, Menu Bar, Context Menu, Submenus.

```
.menu                 container (min-width: 224px, panel chrome)
.menu-item            item (white-space: nowrap)
.menu-label           label de seção (uppercase mono)
.menu-sep             separator hairline
.menu-check           item com checkmark à esquerda
.menu-sub             submenu (positioned)
.menu .kbd-chord      atalho à direita
```

Variações: `.menu-item.destructive`, `.menu-item:disabled`.

### 3.6 `.tt` — Tooltip
CSS-only. Atributo `data-tt="…"` em qualquer elemento (qualquer página).

```
.tt              wrapper inline-flex
[data-tt]::after o balão
.tt.bottom / .tt.left / .tt.right   posição
.tt.wrap         multi-line (220px)
```

### 3.7 Buttons & toolbar

```
.btn             base 32px alto, 12px pad-x, radius 6, gap 8
.btn.lg          40px
.btn.sm          26px
.btn.xs          22px
.btn.icon        square footprint (32×32 default; ajusta com size)
Variantes: .btn.ember (primary), .btn.outline, .btn.ghost, .btn.link, .btn.destructive
.btn-group       row visualmente colado (border-radius nos extremos)
.toolbar         row de btn-groups + separadores
.toolbar-sep
```

### 3.8 Pills, chips, badges

```
.pill            cápsula bordada inline, com .dot opcional
                 modifiers: .ember .ice .success .warning .danger
                 semantic: .severity-p0..p3, .status-pending..skipped,
                           .health-up..unknown, .risk-low..crit

.chip            tag de atributo (sem dot)
                 .removable / .ok / .warn / .bad / .ember
                 .chip-x = botão de remoção

.badge           contador numérico (min-width 18px, height 18px)
                 sizes: .sm .lg
                 tones: .new (ember) .ice .success .warning .danger
                 .badge.dot (presença sem número)
                 .badge.push-end (margin-inline-start: auto)
```

### 3.9 Avatares

```
.avatar          círculo 28px default
                 sizes: .xs (20) .sm (24) .lg (36) .xl (48)
                 .ember (current user)
.avatar > .avatar-fill   container para gradient/image
.avatar .status-dot      dot 4:30 position (.away .offline .busy)
.avatar-group            sobrepostos com ring 2px (.tight = mais sobreposto)
.owner-pill              Avatar + nome inline
```

### 3.10 Tabelas

```
.tbl                    base table (font-size 13)
.tbl th                 uppercase mono header
.tbl tbody tr:hover     surface-hover
.tbl-data               variante densa de catálogo (DataTable)
.tbl.dense              padding reduzido
.tbl.sticky             header pegajoso
.tbl-wrap               scroll container
.th-inner .th-chevs     sortable header chevrons (.is-sortable, .is-sorted asc|desc)
.tbl-empty              row de estado vazio
```

### 3.11 Outras classes notáveis (sem catálogo exaustivo — consulte `ds.css` quando em dúvida)

```
Layout/shell
  .ds-app .ds-sidenav .ds-main .ds-topbar
  .ds-section .ds-page-header .ds-ph-eyebrow .ds-ph-title .ds-ph-lede
  .ds-sub                                seção de Header (SubHead)
  .ds-frame .ds-frame-head .ds-frame-body  preview frame (Frame)
  .ds-frame.dotted / .row / .center        modifiers

Code / docs
  .ds-code .ds-tabs .ds-tab
  .ds-code-collapse .ds-code-clip .ds-code-fade .ds-code-toggle
  .ds-codetree .ds-codetree-sidebar .ds-codetree-file .ds-codetree-folder
  .ds-props-table .ds-props-frame
  .tok .tok-name .swatch                  TokenSwatch
  .copy-btn                               CopyButton (.ok state)

Pagination
  .pg .pg-btn .pg-ellipsis .pg.sm .pg.lg .pg.outline

Tabs (in-page)
  .tabs .tab .tab.active

Cards
  .card  .card.hover

Modal/drawer/sidesheet
  .backdrop .modal .drawer .sidesheet (+ .sheet-in animation)

Markdown-ish
  .md h1 .md h2 .md h3 .md p .md code .md ul .md li

Sidebar (DS shell)
  .ds-sidenav .brand .brand-mark .nav-section .nav-item
  .ds-link .ds-link-label .ds-link-ext .ds-link-badge
  .ds-section-title .ds-subsection-title

Command palette
  .cp-backdrop .cp .cp-search .cp-results .cp-row .cp-empty .cp-foot .cp-label .cp-trail

Theme
  .theme-pill (Dark/Light toggle no topbar)

Specialized blocks (consulte cada componente)
  .pipeline .pipe-step .pipe-dot .pipe-halo
  .pipeline-chevron .chev-step .chev-inner .chev-glyph .chev-text .chev-label .chev-meta
  .timeline .tl-v .tl-item .tl-pin .tl-halo .tl-body .tl-row .tl-title .tl-meta
  .ring-bar .ring-cell .ring-head .ring-label .ring-pct .ring-aud .ring-track .ring-fill .ring-pop
  .score-speedo .score-compact .score-linear .ss-readout .sc-text
  .metric-card .mc-head .mc-label .mc-value-row .mc-value .mc-unit .mc-spark .mc-foot
  .stat .stat-default .stat-hero .stat-inline .stat-label .stat-value .stat-suffix .stat-row .stat-hint
  .service-card .sc-head .sc-meta-row .sc-owner .sc-spark .sc-foot .sc-kv
  .agent-card .ac-head .ac-avatar .ac-head-text .ac-name .ac-summary .ac-row .ac-caps .ac-foot .ac-kv
  .log-viewer .lv-toolbar .lv-search .lv-levels .lv-body .lv-line .lv-empty (.lvl-trace..fatal)
  .diff-viewer .diff-file .diff-file-head .diff-path .diff-counts .diff-body
    .diff-unified .diff-split .diff-hunk .diff-line .diff-row .diff-side .diff-marker .diff-no .diff-code
    (.add .del .ctx)
  .tree-view .tree-node .tree-row .tree-rails .tree-rail .tree-toggle .tree-icon .tree-label .tree-meta .tree-badge
  .json-inspector .json-list .json-toggle .json-key .json-str .json-num .json-bool .json-null .json-bracket
  .filter-panel .fp-head .fp-title .fp-clear .fp-search .fp-group .fp-group-title .fp-list .fp-row .fp-label .fp-count
  .alert .alert-icon .alert-body .alert-title .alert-desc .alert-actions .alert-extra .alert-dismiss
  .banner .banner-icon .banner-text .banner-title .banner-message .banner-actions .banner-close (tones via .tone-*)
  .empty .empty-icon .empty-text .empty-title .empty-desc .empty-actions (sizes: .sm .md .lg + .accent .dotted)
  .prog .prog-head .prog-track .prog-fill .prog-buf .prog-circ
  .sk .sk.line .sk.circle .sk.box (shimmer animation)
  .sp-ring .sp-dots .sp-bars (size via --sp)
  .s-dot (tones idênticos a Pill)
  .trend .variant-arrow .variant-triangle .variant-badge .variant-bar (.up .down .flat) .trend-bar .trend-bar-fill
  .msg .msg-stack .msg-bubble .msg-meta .msg-actions .msg-att-row .msg-att .msg-caret .msg-error-row (.user .assistant .system + .compact .plain + .is-error)
  .ai-resp .ai-resp-q .ai-resp-stack .ai-resp-meta .ai-resp-actions .ai-resp-action .ai-prose .ai-code .ai-code-head .ai-code-body .ai-code-copy .ai-diagram .ai-wide
  .ai-cite-chip .ai-cite-pop .ai-cite-pop-head .ai-cite-pop-title .ai-cite-pop-dom .ai-cite-pop-rank .ai-cite-pop-snip .ai-cite-pop-foot .ai-cite-panel .ai-cite-panel-head .ai-cite-panel-list .ai-cite-wrap
  .ai-hist .ai-hist-head .ai-hist-new .ai-hist-search .ai-hist-list .ai-hist-group .ai-hist-group-head .ai-hist-item .ai-hist-rename .ai-hist-icon-btn .ai-hist-empty
  .tool-status .tool-head .tool-code .tool-output-table (estados pending/running/done/error)
  .rsn-trigger .rsn-body (Reasoning collapsible)
  .sg .sg-row .sg-wrap .sg-cards .sg-card (Suggestion pills, sizes sm/md/lg)
  .pi (Prompt Input) .pi-head .pi-foot .pi-submit
  .conv .conv-head .conv-body .conv-jump (Conversation)
  .hero-grid .ember-glow-bg (Hero patterns)
  .eidos-chart .fc-head .fc-head-text .fc-title .fc-subtitle .fc-meta .fc-body
  .eidos-tooltip .ft-label .ft-rows .ft-row .ft-dot .ft-name .ft-value
  .eidos-legend .legend-dot .legend-label
```

> Padrão geral: cada componente "mid-level" tem seu próprio bloco em `ds.css` com prefixo curto.

---

## 4. Componentes React do core (utilizáveis em qualquer página)

Todos exportados em `window` para uso em `<script type="text/babel">` separados.

### 4.1 `primitives.jsx` — building blocks da documentação
| Componente | Para que serve |
|---|---|
| `Section({ id, num, title, desc, autoInstall, installPeers })` | Wrapper de página: eyebrow (Group · Subgroup · Number) + h1 + lede. `autoInstall` injeta `ComponentInstall` automaticamente (Components/AI). |
| `SubHead({ children, meta })` | Sub-header de seção (variants, anatomy, do/don't, etc.). |
| `Frame({ label, code, lang, center, row, dotted, height })` | Preview + código abaixo. Long code colapsa via `CollapsibleCode`. |
| `Code({ children, lang })` | Bloco `<pre>` com highlight token-stream (single pass; suporta jsx/css/html/bash, auto-detect HTML). |
| `CodeBlock({ label, code, lang })` | Code-only (sem preview). |
| `CodeTree({ files, defaultIndex, label })` | Multi-file viewer com tree (VS Code-style). |
| `Tabs({ tabs, active, onSelect, ariaLabel })` | Tabs pill no head do Frame. |
| `TabbedCode({ tabs, defaultIndex, ariaLabel })` | Code-only com tabs (ex.: pnpm/npm/yarn/bun/Manual). |
| `CollapsibleCode({ code, lang })` | Snippets > 8 linhas colapsam com "Show code". |
| `CopyButton({ text, label })` | Botão copy com estado "Copied" (1.4s). |
| `PropsTable({ rows, label })` | Tabela de Props (Prop, Type, Default, Description). Rows: `{ prop, type, default, required?, description? }`. |
| `TokenSwatch({ name, value, varName })` | Swatch de cor + nome + var + valor + copy. |
| `SpecRow({ token, value, usage })` | Linha de spec sheet de tokens. |
| `Pagination({ total, current, onChange, siblings, showFirstLast, compact, size, outline })` | Paginação completa. |
| `SimplePagination({ total, current, onChange })` | Prev/Next com "Page X of Y". |
| `ComponentInstall({ slug, peers, label })` | Bloco de installation completo (auto-injetado por `<Section autoInstall>`). |
| `installTabs(name, peers)` | Factory das 5 tabs (pnpm/npm/yarn/bun/Manual). |

### 4.2 `atoms.jsx` — atomic helpers
| Componente | Notas |
|---|---|
| `Sparkline({ data, w, h, color, fill })` | SVG sparkline com fill + último ponto. |
| `Counter({ to, suffix, prefix, dur, decimals })` | Conta de 0 ao target quando entra no viewport. |
| `CountUp` | Alias semântico de `Counter`. |
| `Avatar({ p: {initials, name}, size, ember })` | Círculo com iniciais. |
| `TierBadge({ tier: 'T1'|'T2'|'T3' })` | Pill mono uppercase (ember/warning/neutral). |
| `LangBadge({ lang })` | Dot colorido + nome da linguagem (mapeado em `MOCKS.LANGS`). |
| `AICaret()` | Caret pulsante de streaming. |
| `Message({ from, variant, meta, streaming, error, attachments, actions, avatar, userAvatar, botAvatar, children })` | Turn de conversa (bubble/compact/plain). |
| `Empty({ size, accent, dotted, icon, iconName, title, desc, action, secondary, children })` | Empty state canônico. |
| `StatusDot({ tone, size, pulse, title, style, className })` | 8px dot, todas as semantic tones (pending/running/done/error/skipped/up/degraded/down/unknown/p0..p3). |
| `Trend({ delta, unit, inverted, format, variant, showZero, className })` | Delta indicator (arrow/triangle/badge/bar). |
| `HealthBadge({ state, label, pulse })` | Pill .health-* + StatusDot. |
| `SeverityPill({ level, label, icon })` | Pill .severity-* (P0..P3). |
| `KbdRow({ label, keys, meta })` | Label + chord de kbd. |
| `CopyChip({ value, label, tone })` | Chip click-to-copy (estado "is-copied"). |
| `RelativeTime({ value, absolute, tooltip, tooltipSide, className })` | `<time>` com phrase relativa, tick 60s, tooltip absoluto opcional. |
| `OwnerPill({ person, role, ember })` | Avatar pequeno + nome + role. |

### 4.3 `blocks.jsx` — mid-level IDP recipes
| Componente | Notas |
|---|---|
| `Banner({ tone, icon, title, message, action, onAction, actions, onDismiss, bg, fg, accent, size, children })` | Barra full-width (info/success/warning/danger/neutral/custom). |
| `Pipeline({ variant: 'stepper'|'chevron', steps, currentIndex, compact })` | Stage tracker (build→test→deploy). Steps: `{id, label, status, meta}`. |
| `Timeline({ items, compact })` | Sequência vertical. Items: `{id, title, meta, at, person, icon, tone, current, done, children}`. |
| `RingBar({ rings, currentRing, popoverFor })` | Ring deployment strip. Rings: `{label, audience, percent, status, count?}`. |
| `ScoreGauge({ variant: 'speedo'|'compact'|'linear', value, min, max, ticks, labels, inverted, label, size, thickness })` | Gauge automotivo. |
| `MetricCard({ label, value, suffix, unit, prefix, delta, deltaUnit, inverted, series, sparkColor, foot, tone, size })` | KPI tile (label + value + trend + sparkline + foot). |
| `Stat({ label, value, suffix, hint, delta, deltaUnit, inverted, align, variant: 'default'|'hero'|'inline' })` | KPI inline. |
| `ServiceCard({ service, person, sparkSeries, onOpen, variant: 'clean'|'detailed' })` | Catalog tile de serviço. |
| `AgentCard({ agent, onOpen })` | Catalog tile de agente AI. |
| `LogViewer({ lines, height, follow, wrap, variant: 'compact'|'expanded'|'filterable', toolbar })` | Terminal-style log com level chips. |
| `DiffViewer({ files, hunks, variant: 'unified'|'split', wrap })` | Code diff. |
| `TreeView({ nodes, defaultExpanded, selected, onSelect, variant: 'files'|... })` | Árvore recursiva com indent guides. |
| `JSONInspector({ data, defaultCollapsedPaths })` | JSON colorido colapsável. |
| `FilterPanel({ groups, onClear, query, onQueryChange, placeholder })` | Sidebar de facets agrupados. |
| `DataTable({ columns, rows, onRowClick, rowKey, empty, sort, onSort, sticky, dense, footer })` | Tabela dense pronta. |

### 4.4 `charts.jsx` — wrapper Recharts (Eidos tokens)
| Export | Notas |
|---|---|
| `EidosChart({ title, subtitle, meta, height, padding, accent, children })` | Card surface + ResponsiveContainer. Children = nó Recharts. |
| `EidosTooltipContent` | Replace de `<Tooltip content>` com chrome Eidos. |
| `ChartLegend({ items })` | Legenda horizontal manual. |
| `useChartColors()` | Retorna `var(--viz-cat-1..12)` (memo). |
| `fmtCompact(n)` | Formato curto (k/M/B). |
| `fmtNumber(n, unit)` | Locale + unit. |
| `eidosChartTick` / `eidosPolarTick` | Default tick styles (mono 12px, --fg-muted). |
| `eidosGridProps` / `eidosXAxisProps` / `eidosYAxisProps` | Spread props para CartesianGrid/XAxis/YAxis. |

### 4.5 `shell.jsx`
| Export | Notas |
|---|---|
| `DSShell({ children })` | Shell completo: sidebar + topbar + command palette. Lê `window.PAGE_SLUG` para active state. |
| `SideNav`, `Topbar`, `ThemeToggle`, `NavLink`, `NavGroup` | Partes individuais. |
| `usePalette()` | Hook ⌘K (Cmd/Ctrl+K toggle, Esc close). |
| `CommandPalette({ open, onClose })` | Fuzzy search em `SECTIONS.walk()`. |

### 4.6 `icons.jsx`
| Export | Notas |
|---|---|
| `Icons` | Objeto com ~95 ícones Lucide-style (24×24, stroke 1.5, currentColor). |
| `ForgeMark({ size, variant: 'solid'\|'outline'\|'expressive', color, strokeWidth, glow })` | Marca da Eidos (flame + 3 sparkles em 32×32). |

**Ícones disponíveis** (chame como `<Icons.x size={16}/>`):

- Layout: `home`, `catalog`, `rocket`, `shield`, `gauge`, `trending`, `book`, `clipboard`, `sparkle`, `layers`, `plug`
- Chevrons / arrows: `chevronRight/Left/Down/Up`, `arrowRight/Left/Up/Down`, `enter`, `cornerDownLeft`
- Inputs / actions: `check`, `x`, `plus`, `minus`, `minus2`, `more`, `copy`, `share`, `download`, `upload`, `edit`, `trash`, `refresh`, `play`, `command`, `search`, `filter`, `grid`, `menu`, `keyboard`
- Status / vis: `alert`, `info`, `bell`, `flame`, `zap`, `pulse`, `target`, `eye`, `eyeOff`, `circle`, `star`, `pin`, `bookmark`, `flag`, `inbox`
- Time / date: `calendar`, `clock`
- Media: `image`, `file`, `folder`, `link`, `externalLink`, `paperclip`, `music`, `video`, `eyedropper`
- Theme: `sun`, `moon`, `palette`, `droplet`
- Text formatting: `bold`, `italic`, `underline`, `strike`, `alignLeft/Center/Right/Justify`, `list`, `listOrdered`, `undo`, `redo`, `sort`
- Layout / panels: `panelLeft/Top/Right`, `sidebar`, `gripVertical`, `maximize`, `minimize`
- Charts: `barChart`, `lineChart`, `pieChart`, `activity`
- IDP / DevOps: `bot`, `cloud`, `database`, `terminal`, `package`, `gitFork`, `gitPullRequest`, `lockKey`, `server`, `container`, `network`, `workflow`, `cpu`, `deploy`, `rollback`, `pipeline`, `merge`, `commit`, `tag`, `gate`, `ring`, `branch`
- Cloud / infra: `fn`, `queue`, `region`, `key`, `globe`, `doc`
- Agent / AI / MCP: `agent`, `mcpServer`, `toolCall`, `prompt`, `vector`
- Governance: `incident`, `score`, `compliance`, `auditLog`, `runbook`, `slo`
- User: `user`, `settings`

---

## 5. Inventário de páginas (referência completa)

### 5.1 Get Started (6)

- **overview** — Landing/intro: filosofia, princípios, stats, FAQs. Stats vivos via getComputedStyle.
- **installation** — Dois caminhos (usar Eidos num produto vs. rodar docs local). Prerequisites (Node 20+, Tailwind v4), steps com circulos numerados, CDN pinning com SRI.
- **components-catalog** (`components.html`) — Catálogo auto-gerado via `SECTIONS.walk()`. Tile grid por group/subgroup com descrição e ícone.
- **theming** — Dark/light via `[data-theme]`, override de tokens com `oklch()`, persistência em `localStorage`.
- **tailwind** — Preset para Tailwind v4 (`@theme` block) + config v3 legacy. Inclui keyframes inline.
- **rtl** — Suporte RTL via logical properties. Auditoria de 7 components com `transform: translateX`, guidance de Intl.* para datas/moedas.

### 5.2 Foundations (8)

- **brand** — Logo, mark (`ForgeMark`), lockup, wordmark, sizing 1.5×, voice (Direct, Engineer-tonal, pt-BR first, Cause + remedy, No marketing-speak).
- **color** — 6 families (surface/foreground/border/ember/cool/status), IDP semantic palettes (severity/run-status/health/risk), accessibility, dark/light swap.
- **severity** — Decisão entre 4 famílias (Severity / Run status / Health / Risk). Vendor mappings (incident.io, PagerDuty).
- **typography** — Geist + Geist Mono, scale, tnum+zero on mono, RTL com Arabic, vertical rhythm.
- **spacing** — `--space-*` scale (4px base), `--radius-*` (7 tokens), breakpoints, `[data-density]` (compact/comfortable/spacious), touch targets 44px.
- **shadows** — 6 níveis (0..5) + 3 borders (--border, --border-strong, --border-stronger), focus ring ember.
- **iconography** — ~95 ícones (24×24, 1.5px stroke), domain groupings, RTL mirroring (`scaleX(-1)`), props (size/color/strokeWidth/className).
- **motion** — One ease + 3 durations, keyframes library, reduced-motion override, spring ease só para Switch thumb.

### 5.3 Components — Form & Input (23)

- **ai-label** — Badge marcando AI-generated content. Variants: box/mark/pill/dot, sizes sm/md/lg, revoked. Props: variant, size, revoked.
- **buttons** — `.btn` (ember/outline/ghost/link/destructive, sizes xs/sm/md/lg, icon). Props: variant, size, icon, loading, asChild.
- **button-group** — `.btn-group` horizontal/vertical, joined borders. Props: size, orientation.
- **calendar** — Month grid single + range mode. Props: mode, selected, disabled, onSelect.
- **checkbox** — `.fc-check-box` sizes sm/md/lg, indeterminate, description.
- **color-input** — HSV picker + hex/rgb/alpha + swatch palette. Modes: hex/rgb/hsv/alpha.
- **combobox** — Searchable picker single + multi-select + grouped. `.cb-*` system. Painel fixed-position.
- **date-picker** — Trigger button + Calendar popover. Single date, range, com presets.
- **file-input** — Drag-and-drop com progresso + per-file status. Single/multiple/preview.
- **forms** — Bundle de composição (Input + Label + Textarea + field states).
- **input** — Text-entry core. `.in-field` + `.in-group` + `.in-control` + addons. Sizes sm/md/lg, validation states, icons, affixes.
- **input-group** — Cluster horizontal de inputs/buttons/selects num único bordered shell. `-1px` margin overlap.
- **label** — `<label>` simples com `.required-mark` opcional e `.opt`.
- **number-input** — Numeric com stepper vertical opcional, min/max/step. `.in-addon.stepper`.
- **otp-input** — One-time code com auto-advance e paste. Layout `[3,3]` etc. Numeric keyboard.
- **pills** — Pill (state-carrying, `.pill.*`) + Chip (atributo, `.chip.removable`).
- **radio** — Sizes sm/md/lg + variante `.fc-card` (card inteiro clicável) + description.
- **select** — Custom single-select + search + grouped + icons. Fixed positioning.
- **slider** — Drag range single ou pair. RTL-aware (inset-inline). `.sl-*` system.
- **switch** — Binary toggle com thumb spring (`--ease-spring`). Sizes sm/md/lg + description.
- **tag-input** — Free-entry → chips removíveis com autocomplete. Enter/comma para adicionar, max tags.
- **textarea** — Multi-line dentro do `.in-field`/`.in-group`. Rows + char counter.
- **toolbar** — Row de btn-groups + separators + toggle-groups. Roving focus (arrow keys).

### 5.4 Components — Layout & Navigation (8)

- **accordion** — Multi-row colapsável (single-open ou allow-multiple). `.acc-row/.acc-trigger/.acc-content`.
- **breadcrumb** — Trail hierárquico (compact + ellipsis). Chevron separator. `<nav>` semântico.
- **navigation** — Documentação dos padrões de nav (sidebar/topbar/tabs/⌘K palette).
- **resizable** — Drag-to-resize panel split (vertical/horizontal). react-resizable-panels.
- **scroll-area** — Bounded scroll com thin scrollbars auto-hiding. @radix-ui/react-scroll-area.
- **separator** — Hairline divider solid/dashed, horizontal/vertical.
- **sidebar** — Collapsible vertical rail (sections, badges, footer, brand header).
- **tabs** — Underline + pill variants. Com icons + count badges. tablist/tab/tabpanel roles.

### 5.5 Components — Overlays & Dialogs (10)

- **alert-dialog** — Modal bloqueante (`<dialog>` nativo). Variants warning/danger/info. `.adlg-*`.
- **command** — ⌘K palette com search + groups + keyboard nav. `.cmd-input/.cmd-group/.cmd-item`.
- **drawer** — Sliding panel (top/bottom/left/right). Always-mounted body. `.dr-overlay/.dr-header/.dr-body/.dr-footer/.dr-grip`.
- **menu** — Dropdown único para context/button/menubar. `.menu` (224px min-width, nowrap items), icons, separators, submenus, destructive.
- **hover-card** — Rich preview (250ms open / 120ms close). `.hc-*`.
- **menubar** — Top-level menu bar (File/Edit/View). `.mbar-*` + shared menu chrome.
- **modal** — Centered dialog com scrim + focus trap + portal. Sizes sm/md/lg/xl. `.mdl-overlay/.mdl-header/.mdl-body/.mdl-footer`.
- **popover** — Click-to-open floating, 4 placements + 3 alignments + auto-flip. `.pop-head/.pop-body/.pop-foot/.pop-arrow`.
- **sidesheet** — Right-edge overlay, 5 patterns (detail/form/filters/wizard/confirmation). 360px frame.
- **tooltips** — CSS-only `.tt[data-tt="…"]`. 4 placements. RTL-aware.

### 5.6 Components — Feedback & Status (11)

- **alerts** — Inline callout (info/success/warning/danger). Dismissible. `.alert-icon/.alert-body/.alert-title/.alert-desc`.
- **badges** — TierBadge, LangBadge, `.badge` (count com .new/.success/.warning/.danger), state markers.
- **banner** — Full-width attention bar. Tones info/success/warning/danger/neutral/custom. `<Banner/>` block.
- **empty** — Empty state com title + desc + action + secondary. Sizes sm/md/lg + .accent + .dotted.
- **notification** — Sonner-style toasts. 6 positions, 6 variants, swipe-to-dismiss, action. `.toast-*`.
- **progress** — Determinate/indeterminate/segmented/circular/status-tinted. `.prog-track/.prog-fill/.prog-buf/.prog-circ`.
- **skeleton** — `.sk.line/.circle/.box` com shimmer.
- **spinner** — Ring / dots / bars. Respects reduced-motion. CSS var `--sp` para size.
- **status-dot** — 8px coloured dot. Tones idênticos a Pill semantic. Pulse opcional. `<StatusDot/>`.
- **status** — Semantic mapping doc: 6 tones (ember/success/warning/danger/ice/neutral). Escalation ladder.
- **trend** — Delta indicator. Variants arrow/triangle/badge/bar. `inverted` para "lower is better". `<Trend/>`.

### 5.7 Components — IDP Blocks (9)

- **data-table** — `.tbl-data` denso com sortable + sticky + dense + sparkline columns. `<DataTable/>`.
- **diff-viewer** — Unified + split. File header com +/− counts. Wrap mode. `<DiffViewer/>`.
- **filter-panel** — Grouped facets (checkbox/radio) + search interno + counts. `<FilterPanel/>`.
- **json-inspector** — Tree colorida (keys amber, strings green, numbers cyan, bool warm). Recursive. `<JSONInspector/>`.
- **log-viewer** — Mono log com severity prefix. Variants compact/expanded/filterable. `<LogViewer/>`.
- **pipeline** — Stage tracker. Variants stepper (dots+rail) + chevron (clip-path arrows). `<Pipeline/>`.
- **ring-bar** — Ring deployment strip esquerda→direita. Click-to-reveal popover. `<RingBar/>`.
- **timeline** — Vertical sequence com avatar/icon/title/relative-time. Compact variant. `<Timeline/>`.
- **tree-view** — Recursive hierarchy com indent guides + chevron + folder/file icons + meta + badges. `<TreeView/>`.

### 5.8 Components — Display & Media (11)

- **aspect-ratio** — Lock ratio (16:9, 4:3, 3:2, 1:1, 3:4, 9:16, 21:9). `.ar.r-16-9` etc.
- **avatars** — Initials/ember/image/icon. Sizes xs/sm/md/lg/xl. Group overlap.
- **card** — Bounded surface (`.card-x-head/.card-x-body/.card-x-foot`). `.hover` lift. `.compact`.
- **carousel** — CSS scroll-snap strip + prev/next + dots. Hero variant. RTL-aware.
- **copy-chip** — `.chip.copy-chip` click-to-copy com `.is-copied`. `<CopyChip/>`.
- **count-up** — Mono numero animado 0→target via IntersectionObserver. `<CountUp/>`.
- **data** — Layer numérico: KPIs, deltas, sparklines, bar/line/area/donut/heatmap/bullet/funnel/gauge (SVG puro).
- **kbd** — `.kbd` single key + `.kbd-chord` (sem "+"). Mono font.
- **relative-time** — `<time>` com phrase, tick 60s. Tooltip absolute opcional (`tooltip`). `<RelativeTime/>`.
- **surfaces** — Card, hairline, divider, `.code-block` primitives. Layered bg stack.
- **table** — Basic `.tbl`: sortable headers, selection, sticky, density.

### 5.9 Components — Misc (4)

- **collapsible** — Single show/hide (Accordion's atom). `<Collapsible/>` (Radix).
- **pagination** — Numbered (compact/full), page-of-pages, simple prev/next. `<Pagination/>` + `<SimplePagination/>`.
- **toggle** — Single press (bold/pin/mute). `aria-pressed`. Variants ghost/outline/solid. Sizes sm/md/lg.
- **toggle-group** — Row de toggles (segmented). type=single|multiple. `<ToggleGroup/>` + `<ToggleGroup.Item/>`.

### 5.10 Charts (12)

> Todos wrapped em `<EidosChart>` com `useChartColors()` retornando `var(--viz-cat-N)`.

- **chart-overview** — Decision matrix entre chart types. SVG previews.
- **chart-line** — `LineChart` / `Line` / `ReferenceLine`. Single + multi (p50/p95/p99) + dashed forecast.
- **chart-area** — `AreaChart` / `Area`. Single + stacked + gradient fill + step.
- **chart-bar** — `BarChart` / `Bar` / `Cell`. Vertical, horizontal, grouped, stacked.
- **chart-composed** — `ComposedChart` (Bar + Line on dual Y). CI runs vs % success, traffic vs latency.
- **chart-pie** — `PieChart` / `Pie` / `Cell`. Pie hairline, donut com total central, half-donut.
- **chart-radar** — `RadarChart` + `PolarGrid/AngleAxis/RadiusAxis`. Single + overlaid + quality scorecard + fleet small-multiples.
- **chart-radial** — `RadialBarChart` / `RadialBar`. Stacked goals, hero arc, hemisphere.
- **chart-gauge** — SVG puro (`arcPath()`). Semi (180°), three-q (270°), full ring stat-card.
- **chart-heatmap** — SVG grid + CSS Grid + popover. GitHub-style calendar (53w×7d), service×month matrix, compact sparkline-sized.
- **chart-histogram** — `BarChart` com `barCategoryGap={0}` + ReferenceLine + Cell. Latency/payload/PR-review distributions.
- **chart-sankey** — `Sankey` com custom `EidosNode` + `EidosLink`. Traffic flow, CI/CD commit→merge, dense flow + legenda.

### 5.11 Elements (7)

> "Recipes" prontos compostos APENAS de primitives existentes (sem novos componentes).

- **el-overview** — Landing grid de recipes (Metric/Score/Service/Agent).
- **el-agent-card** — `<AgentCard/>` (model + capabilities + runs + success + last-run + status).
- **el-hero** — Variants: bold + dot grid / editorial centered / split two-column / ladder (eyebrow + lede + 3 steps) / quiet. Usa `.hero-grid` + `.ember-glow-bg`.
- **el-metric-card** — `<MetricCard/>` (label + value + Trend + Sparkline + foot). Sizes sm/md/lg. Inverted prop.
- **el-page-headers** — Variants: standard / with breadcrumb / with tabs / detail (avatar + status pills) / compact.
- **el-score-gauge** — `<ScoreGauge/>` variants: speedo / compact / linear. Green→ember→amber→red ramp, inverted.
- **el-service-card** — `<ServiceCard/>` variants: clean (slim grid) / detailed (sparkline + footer com KPIs).

### 5.12 AI (10)

> Cada página compõe primitives existentes (Pill, Card, Avatar, Collapsible, Frame).

- **ai-citations** — Inline citações numeradas + sources panel. `.ai-cite-chip/.ai-cite-pop/.ai-cite-panel`. Densities low/med/high.
- **ai-conversation** — Vertical thread container. Modes: chat (720px, bubbles dois lados) / document (940px, user bubble + Response). `.conv-*`.
- **ai-errors** — 6 recipes: model down / rate-limited / refusal / context overflow / timeout / partial failure. Compõe `Alert` + `Progress`.
- **ai-history** — Rail de conversas (Today / Yesterday / Last 7/30 / Older). 280px. Search, rename inline, mobile drawer.
- **ai-message** — `<Message/>` (já atom). Variants bubble/compact/plain. Avatar + meta + actions + attachments + streaming + error.
- **ai-prompt-input** — Composer multi-line. `.pi-head` (attachments), `.pi-foot` (tools + model picker), `.pi-submit` (status), drag-drop overlay, auto-resize textarea.
- **ai-reasoning** — Collapsible thinking trace. Auto-opens streaming (shimmer + pulse icon). `.rsn-trigger` (verb + duration) + `.rsn-body` (mono prose).
- **ai-response** — Long-form bubble-less prose. `.ai-prose` (68ch) + `.ai-code-*` + `.ai-diagram` + streaming caret + actions toolbar.
- **ai-suggestion** — Starter prompt pills. Variants row (horizontal scroll) / wrap / cards (high-emphasis grid sizes sm/md/lg).
- **ai-tool** — Tool call display. 4 estados (pending/running/done/error). `.tool-status` (semantic pill) + `.tool-head` + `.tool-code` (JSON) + `.tool-output-table`.

### 5.13 Patterns (8)

> Texturas e adornos decorativos puro-CSS/SVG. NUNCA aplicar em fundo de página inteira.

- **pat-dot-grid** — Radial gradient grid. Variants: is-dense (12px) / default (20px) / is-loose (32px) / is-ember.
- **pat-linear-grid** — repeating-linear-gradient. is-dense/default/is-loose + is-h-only/is-v-only + is-ember.
- **pat-mesh-gradient** — Multiple radial gradients (AI surfaces, premium). default ember+ice / is-cool ice+violet / is-warm ember+warning / is-subtle.
- **pat-conic-orb** — conic-gradient + blur. Sizes sm/md/lg + is-ice + is-spin (30s rotation).
- **pat-radial-spotlight** — Vignette via radial-gradient mask. default centered / is-corner / is-strong / custom position via `--pat-spot-x/y`.
- **pat-noise-grain** — SVG `feTurbulence` overlay. is-subtle 25% / default 50% / is-strong 75%. Auto-inverte dark/light.
- **pat-ember-glow** — Soft halo brand. Sizes sm/md/lg + is-ice + is-pulse (3s). Composable.
- **pat-gradient-border** — Border gradient ember→ice via `mask-composite: exclude`. default 1.5px / is-thick 3px / is-spin 6s conic.

### 5.14 Examples (21 — full-product screens)

> Telas standalone (sem DS shell) que simulam o Eidos IDP. Marcadas `external: true` na nav, abrem em nova aba.

`ex-ai-chat-empty`, `ex-ai-chat-thread`, `ex-ai-projects`, `ex-ai-project-detail`, `ex-ai-insights`, `ex-agent-chat`, `ex-agent-catalog`, `ex-cloud-inventory`, `ex-dora-dashboard`, `ex-feature-flags`, `ex-incident-room`, `ex-mcp-detail`, `ex-pipeline-console`, `ex-pipeline-view`, `ex-quality-gates`, `ex-ring-deployment`, `ex-score-cards`, `ex-service-catalog`, `ex-service-detail`, `ex-service-scaffold`, `ex-templates`.

Cada exemplo usa CSS de `assets/css/{example-shell.css, ai-shell.css}` e JSX em `assets/js/examples/`.

### 5.15 Resources (2)

- **a11y** — WCAG checklist, contraste, semantic HTML, keyboard nav, ARIA patterns.
- **changelog** — Histórico de releases (v1.x.x).

---

## 6. Regras de autoria (NUNCA regredir)

### 6.1 CSS
- **NUNCA escrever `<style>` blocks per-page.** Use classes existentes ou estenda `tokens.css` / `ds.css`.
- Sempre usar logical properties (`inset-inline-*`, `padding-inline-*`, `border-inline-*`, `text-align: start`) — única exceção é `transform: translateX(...)` (precisa `[dir="rtl"]` override).
- Dark/light via `[data-theme="..."]` apenas em `tokens.css`.
- Para painéis flutuantes dentro de `.ds-frame` (que tem `overflow: hidden`): usar `position: fixed` + `getBoundingClientRect()` (ver Combobox).

### 6.2 React/JSX
- Cada arquivo JSX é uma IIFE que termina com `Object.assign(window, { ... })` (exportações compartilhadas).
- **NUNCA** usar `...rest` destructuring no parâmetro (Babel emite `const _excluded` no módulo, dois scripts colidem).
- **NUNCA** declarar `const styles = { ... }` em escopo global (colisão entre arquivos). Use `const myComponentStyles = ...` ou inline.
- Não usar `type="module"` em script tags (quebra Babel).

### 6.3 Conteúdo de cada página de componente
Template canônico (ver `buttons.jsx`):
```jsx
<Section id="..." title="..." desc="...">
  <SubHead meta="...">Variant 1</SubHead>
  <Frame label="..." code={...}>{/* live demo */}</Frame>
  <p style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 14, lineHeight: 1.6, maxWidth: '64ch' }}>Caption.</p>
  …
  {/* Always include: Anatomy, Decision matrix, Do/Don't, RTL example */}
  <SubHead meta="rules">Do / Don't</SubHead>
  <div className="dd-grid">
    <div className="dd-card do"><div className="head"><Icons.check size={12}/> Do — short rule</div><div className="body">{/* live UI demo, NOT just text */}</div><div className="note">Why this works.</div></div>
    <div className="dd-card dont">…</div>
  </div>
</Section>
```

### 6.4 Spacing rhythm (rítmica vertical)
- Caption depois do Frame: `marginTop: 14` (positivo)
- Lede depois do SubHead: `marginTop: -6` (negativo, atado à heading)
- Frame + Frame consecutivos: `18px` (já está no `ds.css`)

### 6.5 RTL
Cada componente deve enviar exemplo RTL. Espelhar chevrons/arrows com `[dir="rtl"] .x { transform: scaleX(-1) }`.

### 6.6 Composition over invention
Antes de criar uma nova classe ou componente:
1. Verifique este documento
2. Consulte `tokens.css` + `ds.css`
3. Veja se um atom/primitive/block já cobre o caso
4. Apenas se nada serve, estenda `tokens.css`/`ds.css` (não inline styles)

---

## 7. Common gotchas (do CLAUDE.md + sessões anteriores)

- **Tela preta** → quase sempre `Icons.x` faltando, syntax error em JSX da página, ou registração `window.PAGES['<slug>']` incorreta. Checar diagnóstico no `boot.jsx`.
- **Doubled focus ring** → regra global `input:focus`. Supress em inputs internos com `.cb-input:focus, .sel-search input:focus { box-shadow: none !important }`.
- **Dropdown clipado dentro do Frame** → `.ds-frame { overflow: hidden }`. Use `position: fixed` + `getBoundingClientRect()` (Combobox).
- **Multi-fire onChange** → nunca colocar `htmlFor` num `<label>` que TAMBÉM envolve o input.
- **Stale cache após rewrite** → adicione `?v=N` no src do script da página (ou rode `scripts/bump-version.sh`).
- **`scrollIntoView`** → não usar; quebra o preview embarcado. Use outros métodos DOM.

---

## 8. Mocks disponíveis (`mocks.js`)

`window.MOCKS` expõe dados de exemplo reutilizáveis (LANGS, services, agents, persons, time series, etc.) — consulte `eidos-design-system/assets/js/core/mocks.js` antes de inventar dados de mock. Usar uma struct de mock real é o que separa screenshots de catalog tiles vazios.

---

## 9. Como adicionar uma nova página (checklist)

1. **Decidir o grupo** em `nav-config.js` (Get Started / Foundations / Components→[subgrupo] / Charts / Elements / AI / Patterns / Resources).
2. **Adicionar entry** `{ id, label, href }` na ordem alfabética dentro do (sub)grupo. Adicionar `badge: 'new'` se for um lançamento de release.
3. **Criar HTML** `pages/<group>/<slug>.html` — copiar `pages/_template.html`, setar `<base href="../../">`, declarar `window.PAGE_SLUG = '<slug>'`, adicionar `?v=...` correto no script src.
4. **Criar JSX** `assets/js/pages/<group>/<slug>.jsx` com IIFE e `window.PAGES['<slug>'] = MyPage`. Começar com `<Section id="..." title="..." desc="...">`.
5. **Conteúdo mínimo**: cada variante numa SubHead + Frame; Anatomy; Decision matrix; Do/Don't grid; RTL exemplo.
6. **Verificar parse**: rodar Babel standalone 7.29.0 no arquivo (mesmo do browser).
7. **Bump cache version** se necessário (`scripts/bump-version.sh` ou edição manual de `EIDOS_VERSION` no `nav-config.js` E `<aside class="brand">` sub-text).

---

## 10. Resumo das versões pinadas

```html
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js"
        integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L"
        crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"
        integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm"
        crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"
        integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y"
        crossorigin="anonymous"></script>
```

Recharts (charts pages apenas): `recharts@2.x` via UMD.

---

## 11. Onde estão as coisas — mapa rápido

```
eidos-design-system/
├── design-system.html                ← Overview (entry)
├── assets/
│   ├── css/
│   │   ├── tokens.css                ← Todos os tokens (cores, type, spacing, etc.)
│   │   ├── ds.css                    ← Sistema de classes (componentes)
│   │   ├── example-shell.css         ← Shell dos Examples (telas standalone)
│   │   └── ai-shell.css              ← Layouts AI dos Examples
│   ├── brand/
│   │   └── forge-flame-mark.svg
│   └── js/
│       ├── core/
│       │   ├── mocks.js              ← Dados de mock
│       │   ├── nav-config.js         ← Single source of truth (navegação + EIDOS_VERSION)
│       │   ├── icons.jsx             ← Icons + ForgeMark
│       │   ├── atoms.jsx             ← Sparkline, Counter, Avatar, Message, Empty, StatusDot, Trend, HealthBadge, SeverityPill, CopyChip, RelativeTime, OwnerPill, KbdRow
│       │   ├── primitives.jsx        ← Section, SubHead, Frame, Code, CodeBlock, CodeTree, Tabs, TabbedCode, PropsTable, TokenSwatch, Pagination, ComponentInstall, installTabs
│       │   ├── blocks.jsx            ← Banner, Pipeline, Timeline, RingBar, ScoreGauge, MetricCard, Stat, ServiceCard, AgentCard, LogViewer, DiffViewer, TreeView, JSONInspector, FilterPanel, DataTable
│       │   ├── charts.jsx            ← EidosChart, EidosTooltipContent, ChartLegend
│       │   ├── shell.jsx             ← DSShell, SideNav, Topbar, ThemeToggle, CommandPalette
│       │   └── boot.jsx              ← Mounting (sempre por último na página)
│       ├── pages/
│       │   ├── get-started/          ← overview, installation, components, theming, tailwind, rtl
│       │   ├── foundations/          ← brand, color, severity, typography, spacing, shadows, iconography, motion
│       │   ├── components/           ← 80+ componentes
│       │   ├── charts/               ← 12 chart types
│       │   ├── elements/             ← 7 recipes IDP
│       │   ├── ai/                   ← 10 AI components
│       │   ├── patterns/             ← 8 visual patterns
│       │   └── resources/            ← a11y, changelog
│       └── examples/                 ← 21 standalone product screens
├── pages/                            ← HTML shells correspondentes (espelha a árvore de assets/js/pages/)
└── scripts/
    └── bump-version.sh               ← Bump EIDOS_VERSION em todos os ?v= e na sidebar
```

---

**Última atualização**: 2026-05-20 (sweep completo de v1.7.12).
