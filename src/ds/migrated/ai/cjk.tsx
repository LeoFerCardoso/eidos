'use client';
// Forge AI — CJK (Chinese / Japanese / Korean) text handling in AI surfaces
// (§2.2 component-page standard). No new component — this documents how Prose
// and Message handle CJK via the :lang() rules already in ai.css: looser
// line-height (1.85), line-break: strict, overflow-wrap: anywhere, and a
// system CJK font stack. Set `lang="ja|zh|ko"` on the wrapper so the CSS
// rules apply and screen readers switch to the correct voice.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, PropsTable, installTabs, TabbedCode, Lede, Prose, Message, Mono } from '@/ds/core';

// AI-page inline style convention

// ── Sample content ─────────────────────────────────────────────────────────────

// Japanese
const JA_PROSE = {
  heading: 'サービスのデプロイ手順',
  para1: '「forge deploy」コマンドを使用して、カナリアリングから段階的にサービスをデプロイします。各リングでエラーバジェットを確認してから次に進んでください。',
  list: [
    'カナリアリング（5%）で15分間トラフィックを監視する',
    '異常なし: 25%リングに昇格する',
    '異常あり: 自動ロールバックが実行される',
  ],
  blockquote: 'ヒント: --hold フラグを使用すると、自動昇格を一時停止できます。',
  code: 'forge deploy --service identity-svc --ring canary --hold',
};

// Chinese (Simplified)
const ZH_PROSE = {
  heading: '服务部署流程',
  para1: '使用 `forge deploy` 命令将服务逐步部署到各个环，从金丝雀环开始，依次升级至 25% 和 100%。每个阶段都需要验证错误预算。',
  list: [
    '金丝雀环（5%）运行 15 分钟，观察指标',
    '指标正常：升级至 25% 环',
    '指标异常：触发自动回滚',
  ],
  blockquote: '提示：使用 --hold 标志可暂停自动升级流程。',
};

// Korean
const KO_PROSE = {
  heading: '서비스 배포 절차',
  para1: '`forge deploy` 명령어를 사용하여 카나리 링부터 점진적으로 서비스를 배포합니다. 각 링에서 에러 버짓을 확인한 후 다음 단계로 진행하세요.',
  list: [
    '카나리 링(5%)에서 15분간 트래픽 모니터링',
    '정상: 25% 링으로 승격',
    '이상: 자동 롤백 실행',
  ],
};

// Mixed CJK + Latin + code (no mid-word breaking of Latin/code runs)
const MIXED_CONTENT = {
  ja: 'identity-svc のデプロイで `forge deploy --service identity-svc --ring canary` コマンドを使用し、p95 レイテンシが 400ms 以下であることを確認してください。',
  zh: '运行 `forge deploy` 后，检查 `error_budget_remaining` 的值，确保大于 5% 再继续升级 identity-svc。',
  ko: '`identity-svc` 배포 시 p95 지연 시간이 400ms 미만인지 확인하세요. `forge deploy --service identity-svc` 명령어를 실행하십시오.',
};

// CJK + Arabic bidi
const BIDI_CONTENT = {
  ja: 'サービスの状態を確認してください。',
  ar: 'يُرجى التحقق من حالة الخدمة.',
};

// Code snippet showing lang usage
const USAGE_CODE = `// Set lang on the Prose wrapper — the :lang() rules in ai.css apply
<Prose lang="ja">
  <h2>サービスのデプロイ手順</h2>
  <p>
    「forge deploy」コマンドを使用して、
    カナリアリングから段階的にデプロイします。
  </p>
</Prose>

// Same for Message bubbles:
<Message from="assistant" lang="zh">
  服务部署流程：使用 forge deploy 逐步升级。
</Message>`;

export default function AiCJK() {
  return (
    <Section
      id="cjk"
      num="10"
      title="CJK"
      desc="How Prose and Message handle CJK text in AI replies. No new component — set lang on the wrapper so the ai.css :lang() rules activate: looser line-height, strict line-break, system CJK font stack."
    >
      {/* 1. INSTALLATION / USAGE — no install, usage pattern */}
      <SubHead meta="package managers">Installation</SubHead>
      <TabbedCode tabs={installTabs('ai-prose')} ariaLabel="package manager"/>
      <Lede>Latin and code runs inside CJK text never break mid-word — the bidi and break rules are all handled in ai.css.</Lede>
      <Lede>
        No new package. CJK support is built into <Mono>Prose</Mono> and <Mono>Message</Mono> via <Mono>:lang()</Mono> rules in <Mono>ai.css</Mono>. Set the HTML <Mono>lang</Mono> attribute on the wrapper element — the browser propagates it to all descendants and the CSS rules activate automatically.
      </Lede>

      {/* 2. USAGE */}
      <SubHead meta="hello world">Usage</SubHead>
      <Frame label="Prose lang=&quot;ja&quot; — Japanese reply with heading, list, blockquote, and code" height={360}>
        <div lang="ja" style={{ width: '100%', maxWidth: 600 }}>
          <Prose>
            <h2>{JA_PROSE.heading}</h2>
            <p>{JA_PROSE.para1}</p>
            <ul>
              {JA_PROSE.list.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
            <blockquote>{JA_PROSE.blockquote}</blockquote>
            <pre><code>{JA_PROSE.code}</code></pre>
          </Prose>
        </div>
      </Frame>
      <Lede>
        Set <Mono>lang="ja"</Mono> on the wrapping <Mono>{'<div>'}</Mono> (or directly on <Mono>{'<Prose>'}</Mono> via the DOM attribute) so the <Mono>:lang(ja)</Mono> selector in <Mono>ai.css</Mono> activates the loose line-height and strict line-break rules. The code block inside keeps Latin characters and the shell command intact without breaking.
      </Lede>
      <Frame label="lang usage pattern — set on the Prose or a wrapper div" code={USAGE_CODE}>
        <Prose lang="ja" style={{ maxWidth: 480 }}>
          <p>「forge deploy」コマンドを使用して、カナリアリングから段階的にデプロイします。</p>
        </Prose>
      </Frame>

      {/* EXAMPLES EYEBROW */}
      <div style={{ marginTop: 36, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-faint)' }}>Examples</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
      </div>

      {/* CHINESE */}
      <SubHead meta="zh — Chinese">Chinese (Simplified)</SubHead>
      <Frame label="lang=&quot;zh&quot; — Prose with heading, paragraph, list, blockquote" height={340}>
        <div lang="zh" style={{ width: '100%', maxWidth: 600 }}>
          <Prose>
            <h2>{ZH_PROSE.heading}</h2>
            <p>{ZH_PROSE.para1}</p>
            <ul>
              {ZH_PROSE.list.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
            <blockquote>{ZH_PROSE.blockquote}</blockquote>
          </Prose>
        </div>
      </Frame>
      <Lede>
        Chinese text uses <Mono>line-break: strict</Mono> to prevent breaks at punctuation positions that would be invalid in Chinese typography. The line-height of 1.85 gives each character enough breathing room — Chinese glyphs are square and need more vertical space than Latin letterforms.
      </Lede>

      {/* KOREAN */}
      <SubHead meta="ko — Korean">Korean</SubHead>
      <Frame label="lang=&quot;ko&quot; — Prose with heading, paragraph, list" height={300}>
        <div lang="ko" style={{ width: '100%', maxWidth: 600 }}>
          <Prose>
            <h2>{KO_PROSE.heading}</h2>
            <p>{KO_PROSE.para1}</p>
            <ul>
              {KO_PROSE.list.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </Prose>
        </div>
      </Frame>
      <Lede>
        Korean (Hangul) has different word-spacing rules from Chinese — words are space-separated and <Mono>overflow-wrap: anywhere</Mono> ensures long compound words or URLs can break, while <Mono>word-break: keep-all</Mono> keeps syllable blocks intact when wrapping.
      </Lede>

      {/* MIXED CJK + LATIN + CODE */}
      <SubHead meta="mixed content">Mixed CJK + Latin + code</SubHead>
      <Frame label="CJK text embedding Latin identifiers and code — no mid-word Latin breaking" height={420}>
        <div style={{ width: '100%', maxWidth: 620, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div lang="ja">
            <Prose>
              <p>{MIXED_CONTENT.ja}</p>
            </Prose>
          </div>
          <div lang="zh">
            <Prose>
              <p>{MIXED_CONTENT.zh}</p>
            </Prose>
          </div>
          <div lang="ko">
            <Prose>
              <p>{MIXED_CONTENT.ko}</p>
            </Prose>
          </div>
        </div>
      </Frame>
      <Lede>
        Latin words, code identifiers, and command strings embedded in CJK prose never break mid-word. The <Mono>overflow-wrap: anywhere</Mono> rule only triggers for the CJK character stream, not for Latin runs. This is the correct behaviour for platform documentation that mixes product names, command syntax, and natural language.
      </Lede>

      {/* MESSAGE BUBBLE WITH CJK */}
      <SubHead meta="Message bubble">CJK in Message</SubHead>
      <Frame label="Message from=&quot;assistant&quot; with Japanese — bubble inherits lang rules" height={280}>
        <div style={{ width: '100%', maxWidth: 580, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div lang="ja">
            <Message from="user">
              identity-svc のデプロイ状況を教えてください。
            </Message>
          </div>
          <div lang="ja">
            <Message from="assistant" meta={<><span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>Forge AI</span></>}>
              identity-svc はカナリアリングで正常に動作しています。p95 レイテンシは 142ms で、エラーバジェットは 94% 残っています。25% リングへの昇格を推奨します。
            </Message>
          </div>
        </div>
      </Frame>
      <Lede>
        Wrap the <Mono>Message</Mono> (or its container) in <Mono>lang="ja|zh|ko"</Mono>. The <Mono>.msg-bubble</Mono> inherits the CJK line-break and line-height from the ancestor <Mono>:lang()</Mono> rule — no per-component prop needed.
      </Lede>

      {/* BIDI: CJK + ARABIC */}
      <SubHead meta="bidi — CJK + Arabic">Bidi (CJK + Arabic)</SubHead>
      <Frame label="Japanese and Arabic side by side — each segment in its own lang + dir wrapper" height={280}>
        <div style={{ width: '100%', maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div lang="ja">
            <Prose>
              <p>{BIDI_CONTENT.ja}</p>
            </Prose>
          </div>
          <div dir="rtl" lang="ar">
            <Prose>
              <p>{BIDI_CONTENT.ar}</p>
            </Prose>
          </div>
          {/* Mixed: same message, two language segments */}
          <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
            <span className="t-mono-label">same message, two language segments:</span>
            <p style={{ fontSize: 'var(--text-body)', lineHeight: 1.75 }}>
              <span lang="ja">{BIDI_CONTENT.ja}</span>
              {' '}
              <span dir="rtl" lang="ar" style={{ unicodeBidi: 'isolate', display: 'inline-block' }}>{BIDI_CONTENT.ar}</span>
            </p>
          </div>
        </div>
      </Frame>
      <Lede>
        When a single reply mixes CJK and RTL (Arabic, Hebrew) content, wrap each segment in a <Mono>lang</Mono> + <Mono>dir</Mono> element and add <Mono>{'unicode-bidi: isolate'}</Mono> so the bidirectional algorithm does not bleed between the two runs. CJK text is always LTR; do not set <Mono>dir="rtl"</Mono> on a CJK container.
      </Lede>

      {/* ACCESSIBILITY */}
      <SubHead meta="a11y">Accessibility</SubHead>
      <div className="ds-grid cols-2" style={{ marginTop: 12 }}>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>lang attribute</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The <code style={{ fontFamily: 'var(--font-mono)' }}>lang</code> attribute on the wrapper tells screen readers which voice synthesis engine to use — a Japanese TTS voice for <code style={{ fontFamily: 'var(--font-mono)' }}>ja</code>, a Mandarin engine for <code style={{ fontFamily: 'var(--font-mono)' }}>zh</code>, a Korean engine for <code style={{ fontFamily: 'var(--font-mono)' }}>ko</code>. Without it, a Japanese reply is read aloud with an English engine, producing unintelligible output. This is the most important accessibility requirement for CJK content.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Line-break rationale</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            <code style={{ fontFamily: 'var(--font-mono)' }}>line-break: strict</code> prevents breaks at punctuation characters (Japanese <em>kinsoku</em> rules). <code style={{ fontFamily: 'var(--font-mono)' }}>overflow-wrap: anywhere</code> allows breaking at any character position for the CJK stream, while <code style={{ fontFamily: 'var(--font-mono)' }}>word-break: keep-all</code> (Korean) prevents breaking inside syllable blocks. These are not cosmetic — incorrect line-breaking changes meaning in Japanese and makes Korean text harder to parse.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Contrast &amp; font stack</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The DS CJK font stack uses the platform's system CJK fonts (Hiragino Kaku Gothic Pro, PingFang SC, Malgun Gothic). These are hinted for their respective scripts at typical screen sizes. Body text at 15px/1.85lh clears AA contrast on the <code style={{ fontFamily: 'var(--font-mono)' }}>--surface</code> background in both light and dark modes — verify if you customise the surface colour.
          </div>
        </div>
        <div className="surface" style={{ padding: 18 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Letter-spacing</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55 }}>
            The <code style={{ fontFamily: 'var(--font-mono)' }}>:lang(ja|zh|ko)</code> rules reset letter-spacing to <code style={{ fontFamily: 'var(--font-mono)' }}>0</code>. CJK glyphs are inherently full-width — adding Latin-style letter-spacing between characters is a typographic error that disrupts reading flow. Never apply <code style={{ fontFamily: 'var(--font-mono)' }}>letter-spacing</code> to CJK text.
          </div>
        </div>
      </div>

      {/* RTL */}
      <SubHead meta="RTL · العربية">RTL</SubHead>
      <Frame label="dir=&quot;rtl&quot; — Prose in Arabic alongside Japanese content for comparison" height={340}>
        <div style={{ width: '100%', maxWidth: 620, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div dir="rtl" lang="ar">
            <Prose>
              <h3>نشر الخدمات</h3>
              <p>استخدم أمر <code>forge deploy</code> لنشر الخدمات تدريجيًا من القناة التجريبية إلى 25% ثم 100%.</p>
            </Prose>
          </div>
          <div lang="ja">
            <Prose>
              <h3>サービスのデプロイ</h3>
              <p>カナリアから25%、100%へと段階的にデプロイします。</p>
            </Prose>
          </div>
        </div>
      </Frame>
      <Lede>
        CJK is always LTR regardless of the page direction. Arabic is RTL. When both appear in the same thread, scope <Mono>dir="rtl"</Mono> to the Arabic segment, not the whole page, and <Mono>lang="ja"</Mono> to the Japanese segment. The <Mono>blockquote</Mono> ember border switches to the correct inline-end edge in each segment automatically via logical CSS.
      </Lede>

      {/* ANATOMY */}
      <SubHead meta="anatomy">Anatomy</SubHead>
      <div className="ds-frame">
        <div className="ds-frame-head"><span className="label">anatomy</span></div>
        <div className="ds-frame-body" style={{ padding: '72px 36px 60px' }}>
          <div className="ana" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="stage" style={{ position: 'relative', width: 520 }} aria-hidden="true">
              <div lang="ja">
                <Prose style={{ maxWidth: 520 }}>
                  <h2>サービスのデプロイ手順</h2>
                  <p>「forge deploy」コマンドを使用して、p95 レイテンシが <code>400ms</code> 以下であることを確認してください。</p>
                  <ul>
                    <li>カナリアリングで15分間監視する</li>
                    <li>異常なし: 25%リングに昇格する</li>
                  </ul>
                </Prose>
              </div>
              {/* pins */}
              <span className="lead v" style={{ top: -22, left: 80, height: 18 }}/>
              <span className="lead h" style={{ top: 52, right: -32, width: 28 }}/>
              <span className="lead v" style={{ bottom: -22, left: 40, height: 18 }}/>
              <span className="lead h" style={{ top: 110, left: -32, width: 28 }}/>
              <div className="pin" style={{ top: -42, left: 80, transform: 'translateX(-50%)' }}>1</div>
              <div className="pin" style={{ top: 44, right: -56 }}>2</div>
              <div className="pin" style={{ bottom: -42, left: 40, transform: 'translateX(-50%)' }}>3</div>
              <div className="pin" style={{ top: 102, left: -56 }}>4</div>
            </div>
          </div>
          <div className="ana-list" style={{ maxWidth: 600, margin: '64px auto 0' }}>
            <span className="num">1</span><span><b style={{ color: 'var(--fg)' }}>lang attribute.</b> Set on the Prose wrapper or a parent div. Activates the <Mono>:lang(ja|zh|ko)</Mono> rules in <Mono>ai.css</Mono> and tells AT which voice to use. This is the single required change.</span>
            <span className="num">2</span><span><b style={{ color: 'var(--fg)' }}>Line-height (1.85).</b> CJK glyphs are full-width squares — they need more vertical breathing room than Latin. The <Mono>:lang()</Mono> rule overrides the default 1.65 for CJK prose.</span>
            <span className="num">3</span><span><b style={{ color: 'var(--fg)' }}>line-break: strict.</b> Prevents breaks at Japanese punctuation positions (kinsoku rules). Without it, a line may end with an opening parenthesis or begin with a closing one.</span>
            <span className="num">4</span><span><b style={{ color: 'var(--fg)' }}>System CJK font stack.</b> Hiragino (macOS) → PingFang (iOS/macOS) → Malgun Gothic (Windows) → Noto CJK (Linux). Latin and code runs keep Geist Sans/Mono — the font stack only switches for CJK code-points.</span>
          </div>
        </div>
      </div>

      {/* DO / DON'T */}
      <SubHead meta="rules">Do / Don't</SubHead>
      <div className="dd-grid">
        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — set lang on the wrapper</div>
          <div className="body" style={{ padding: 14 }}>
            <div lang="ja" style={{ fontSize: 'var(--text-base)', lineHeight: 1.85 }}>
              サービスの p95 レイテンシを確認してください。<code>identity-svc</code> は 142ms です。
            </div>
          </div>
          <div className="note">lang="ja" activates correct line-break rules, line-height, and font fallback. Screen readers switch to the Japanese voice.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — force Latin letter-spacing on CJK text</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ fontSize: 'var(--text-base)', lineHeight: 1.65, letterSpacing: '0.06em' }}>
              サービスの p95 レイテンシを確認してください。
            </div>
          </div>
          <div className="note">CJK glyphs are inherently full-width. Adding letter-spacing widens every character by the same amount, disrupting the visual rhythm and making the text harder to read.</div>
        </div>

        <div className="dd-card do">
          <div className="head"><Icons.check size={12}/> Do — keep lang scoped to the CJK segment</div>
          <div className="body" style={{ padding: 14 }}>
            <div style={{ fontSize: 'var(--text-base)', lineHeight: 1.6 }}>
              <span>Service health: </span>
              <span lang="ja">サービスは正常です。</span>
            </div>
          </div>
          <div className="note">Scoping lang to the CJK segment prevents the CJK line-height and font rules from leaking into the surrounding English UI.</div>
        </div>
        <div className="dd-card dont">
          <div className="head"><Icons.x size={12}/> Don't — break CJK text with hyphenation</div>
          <div className="body" style={{ padding: 14 }}>
            <div lang="ja" style={{ fontSize: 'var(--text-base)', lineHeight: 1.85, hyphens: 'auto', wordBreak: 'break-word' }}>
              サービスのデプロイ手順について説明します。
              <span style={{ color: 'var(--danger)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', display: 'block', marginTop: 6 }}>hyphens: auto + word-break: break-word ← wrong</span>
            </div>
          </div>
          <div className="note">hyphens: auto and word-break: break-word are for Latin text. Applying them to CJK breaks characters at wrong positions. Use line-break: strict and overflow-wrap: anywhere instead.</div>
        </div>
      </div>

      {/* API REFERENCE */}
      <SubHead meta="lang handling">API reference</SubHead>
      <PropsTable
        label="<Prose /> — CJK lang handling"
        rows={[
          { prop: 'lang', type: 'string', default: undefined, description: 'Standard HTML lang attribute. Set to "ja", "zh", "ko" (or variants like "zh-TW") to activate the :lang() rules in ai.css: line-height 1.85, line-break strict, overflow-wrap anywhere, CJK font fallback, letter-spacing 0.' },
          { prop: 'dir', type: '"ltr" | "rtl"', default: '"ltr"', description: 'CJK is always LTR. Do not set dir="rtl" on CJK prose — use it only for Arabic/Hebrew segments within the same thread.' },
        ]}
      />
      <PropsTable
        label="<Message /> — CJK lang handling"
        rows={[
          { prop: 'lang', type: 'string', default: undefined, description: 'Propagates to the msg-bubble via the DOM. Same as Prose — set "ja"/"zh"/"ko" so the :lang() rules apply inside the bubble.' },
          { prop: 'dir', type: '"ltr" | "rtl"', default: '"ltr"', description: 'For CJK messages keep LTR. For RTL-language replies (Arabic) wrap the Message in a dir="rtl" container.' },
        ]}
      />
      <Lede>
        <b>CSS rules activated by <Mono>:lang(ja|zh|ko)</Mono>:</b> <Mono>{'line-height: 1.85'}</Mono> · <Mono>{'line-break: strict'}</Mono> · <Mono>{'overflow-wrap: anywhere'}</Mono> · <Mono>{'letter-spacing: 0'}</Mono> · system CJK font stack (Hiragino → PingFang → Malgun Gothic → Noto CJK). For Korean only: <Mono>{'word-break: keep-all'}</Mono>. These rules are in <Mono>src/styles/ai.css</Mono> and apply to any element with the matching <Mono>lang</Mono> ancestor.
      </Lede>
    </Section>
  );
}
