'use client';
// Forge DS — Components / OTP Input.
//
// One-time codes — six-digit auth, SMS confirmation, email recovery, MFA.
// Auto-advance forward on input, backward on Backspace, paste-fills-all,
// numeric keyboard on mobile, full keyboard navigation (arrows + Tab).
//
// The component is layout-aware: pass `layout={[6]}` for one block, `[3,3]`
// for SMS-style, `[2,2,2]` for backup recovery — separators render between
// each group automatically.
import * as React from 'react';
import { Icons, Frame, CodeBlock, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, Lede, Mono, Spinner } from '@/ds/core';



  const USAGE_CODE = `import { OTPInput } from "@/components/forge/otp-input"

export function Demo() {
  return (
    <OTPInput
      layout={[3, 3]}
      onComplete={(code) => verify(code)}
    />
  )
}`;

  // ─── Core OTP component (the one feature on this page) ──────────────────
  const OTP = ({ id, layout=[6], size='md', invalid, disabled=false, onComplete, autoFocus=false }: {
    id?: string;
    layout?: number[];
    size?: string;
    invalid?: boolean;
    disabled?: boolean;
    onComplete?: (code: string) => void;
    autoFocus?: boolean;
  }) => {
    const total = layout.reduce((a, b) => a + b, 0);
    const [vals, setVals] = React.useState(() => Array(total).fill(''));
    const refs = React.useRef<(HTMLInputElement | null)[]>([]);

    React.useEffect(() => {
      if (autoFocus && refs.current[0]) refs.current[0].focus();
    }, [autoFocus]);

    React.useEffect(() => {
      if (vals.every(v => v) && onComplete) onComplete(vals.join(''));
    }, [vals, onComplete]);

    const setAt = (i, val) => {
      const next = [...vals]; next[i] = val.slice(-1); setVals(next);
      if (val && i < total - 1) refs.current[i + 1] && refs.current[i + 1].focus();
    };
    const onKey = (e, i) => {
      if (e.key === 'Backspace' && !vals[i] && i > 0) {
        refs.current[i - 1] && refs.current[i - 1].focus();
      } else if (e.key === 'ArrowLeft' && i > 0) {
        refs.current[i - 1] && refs.current[i - 1].focus();
      } else if (e.key === 'ArrowRight' && i < total - 1) {
        refs.current[i + 1] && refs.current[i + 1].focus();
      }
    };
    const onPaste = (e) => {
      const text = (e.clipboardData.getData('text') || '').replace(/\D/g, '');
      if (!text) return;
      e.preventDefault();
      const next = Array(total).fill('');
      for (let i = 0; i < Math.min(text.length, total); i++) next[i] = text[i];
      setVals(next);
      const focusIdx = Math.min(text.length, total - 1);
      refs.current[focusIdx] && refs.current[focusIdx].focus();
    };

    const reset = () => { setVals(Array(total).fill('')); refs.current[0] && refs.current[0].focus(); };

    const cells = [];
    let idx = 0;
    layout.forEach((groupLen, gi) => {
      for (let k = 0; k < groupLen; k++, idx++) {
        const cellIdx = idx;
        cells.push(
          <input
            key={cellIdx}
            ref={(el) => { refs.current[cellIdx] = el; }}
            id={cellIdx === 0 ? id : undefined}
            className={'in-otp-cell' + (invalid ? ' is-invalid' : '')}
            inputMode="numeric" pattern="[0-9]*" maxLength={1}
            autoComplete="one-time-code"
            value={vals[cellIdx]}
            disabled={disabled}
            onChange={(e) => setAt(cellIdx, e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => onKey(e, cellIdx)}
            onPaste={onPaste}
            aria-label={'Digit ' + (cellIdx + 1) + ' of ' + total}
            aria-invalid={invalid || undefined}
          />
        );
      }
      if (gi < layout.length - 1) {
        cells.push(<span key={'sep' + gi} className="in-otp-sep" aria-hidden="true">–</span>);
      }
    });
    return (
      <div className="otp-wrap" style={{display:'inline-flex', alignItems:'center', gap: 12}}>
        <div className={'in-otp ' + size} role="group" aria-label="Verification code" aria-invalid={invalid || undefined}>{cells}</div>
        {vals.some(v => v) && !disabled && (
          <button type="button" onClick={reset} className="btn ghost xs" aria-label="Clear code">
            <Icons.x size={11}/> Clear
          </button>
        )}
      </div>
    );
  };

  // ─── Disabled, value-committed display (real `disabled` attr, not readonly) ──
  const DisabledOTP = () => (
    <div className="in-otp md" role="group" aria-label="Verification code (disabled)">
      <input className="in-otp-cell" defaultValue="6" disabled aria-label="Digit 1 of 6"/>
      <input className="in-otp-cell" defaultValue="5" disabled aria-label="Digit 2 of 6"/>
      <input className="in-otp-cell" defaultValue="4" disabled aria-label="Digit 3 of 6"/>
      <span className="in-otp-sep" aria-hidden="true">–</span>
      <input className="in-otp-cell" defaultValue="3" disabled aria-label="Digit 4 of 6"/>
      <input className="in-otp-cell" defaultValue="2" disabled aria-label="Digit 5 of 6"/>
      <input className="in-otp-cell" defaultValue="1" disabled aria-label="Digit 6 of 6"/>
    </div>
  );

  // ─── Loading-verifying wrapper ──────────────────────────────────────────
  const VerifyOTP = () => {
    const [status, setStatus] = React.useState('idle'); // idle | verifying | success | error
    const onComplete = (code) => {
      setStatus('verifying');
      setTimeout(() => {
        // demo: 654321 succeeds, anything else fails
        setStatus(code === '654321' ? 'success' : 'error');
      }, 1200);
    };
    return (
      <div style={{display:'flex', flexDirection:'column', gap: 10}}>
        <OTP layout={[6]} onComplete={onComplete} invalid={status === 'error'}/>
        <div
          role="status"
          aria-live="polite"
          style={{minHeight: 18, display:'flex', alignItems:'center', gap: 6, fontSize: 'var(--text-sm)'}}
        >
          {status === 'idle' && <span style={{color:'var(--fg-muted)'}}>Try <Mono>654321</Mono> to simulate success.</span>}
          {status === 'verifying' && <><Spinner size={13} aria-hidden color="var(--fg-muted)"/><span style={{color:'var(--fg-muted)'}}>Verifying…</span></>}
          {status === 'success' && <><Icons.check size={13} color="var(--success)"/><span style={{color:'var(--success)'}}>Verified</span></>}
          {status === 'error' && <><Icons.alert size={13} color="var(--danger)"/><span style={{color:'var(--danger)'}}>Code expired or invalid. Request a new one.</span></>}
        </div>
      </div>
    );
  };

  const CODE_BASIC = [
    `<OTPInput layout={[6]}/>            // single block`,
    `<OTPInput layout={[3, 3]}/>         // 3 + 3`,
    `<OTPInput layout={[2, 2, 2]}/>      // 2 + 2 + 2`,
    `<OTPInput layout={[4, 4]}/>         // 4 + 4 (recovery)`,
    ``,
    `// Auto-advance forward on input, backward on Backspace.`,
    `// Pasting a 6-digit code fills every cell at once.`,
    `// autoComplete="one-time-code" → iOS / Android offer to autofill from SMS.`,
  ].join('\n');

  const CODE_VERIFY = [
    `const [status, setStatus] = React.useState("idle")`,
    ``,
    `<OTPInput`,
    `  layout={[6]}`,
    `  invalid={status === "error"}`,
    `  onComplete={(code) => {`,
    `    setStatus("verifying")`,
    `    api.verify(code)`,
    `       .then(() => setStatus("success"))`,
    `       .catch(() => setStatus("error"))`,
    `  }}`,
    `/>`,
  ].join('\n');

  // ─── Page ───────────────────────────────────────────────────────────────
export default function OTPPage() {
    return (
      <Section
        id="otp-input"
        num="32"
        title="OTP Input"
        desc="One-time-code entry — auth, SMS confirmation, email recovery. Auto-advance, paste-friendly, numeric keyboard on mobile, autofill on iOS / Android."
      >
        {/* 1. INSTALLATION */}
        <SubHead meta="package managers">Installation</SubHead>
        <TabbedCode tabs={installTabs('otp-input')} ariaLabel="package manager"/>
        <Lede>
          Ships <Mono>otp-input.tsx</Mono> — layout-aware cells, auto-advance, paste-fills-all, SMS-autofill via <Mono>autoComplete="one-time-code"</Mono>.
        </Lede>

        {/* 2. USAGE */}
        <SubHead meta="hello world">Usage</SubHead>
        <Frame label="basic" code={USAGE_CODE}>
          <div style={{padding: 12}}><OTP layout={[3, 3]}/></div>
        </Frame>

        {/* 3. EXAMPLES */}
        <div style={{
          marginTop: 36, marginBottom: 6,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--fg-faint)',
          }}>Examples</span>
          <span style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
        </div>

        <Lede wide>
          One prop drives the whole shape: pass <Mono>{`[6]`}</Mono> for a single block, <Mono>{`[3, 3]`}</Mono> for SMS-style, or <Mono>{`[2, 2, 2]`}</Mono> for recovery codes — the separators render between each group automatically, and the sum is the digit count.
        </Lede>

        {/* Layouts */}
        <SubHead meta="6 · 3+3 · 2+2+2 · 4+4">Layouts</SubHead>
        <Frame label="Pick the layout that matches the code's natural grouping" code={CODE_BASIC}>
          <div style={{display:'flex', flexDirection:'column', gap: 22, width:'100%'}}>
            <div>
              <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', marginBottom: 8}}>Single block — six digits</div>
              <OTP layout={[6]}/>
            </div>
            <div>
              <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', marginBottom: 8}}>3 + 3 — SMS confirmation, easiest to read aloud</div>
              <OTP layout={[3, 3]}/>
            </div>
            <div>
              <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', marginBottom: 8}}>2 + 2 + 2 — backup-recovery flows</div>
              <OTP layout={[2, 2, 2]}/>
            </div>
            <div>
              <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', marginBottom: 8}}>4 + 4 — long codes from email recovery</div>
              <OTP layout={[4, 4]}/>
            </div>
          </div>
        </Frame>
        <Lede wide>
          The layout doesn&apos;t change validation — pasting a 6-digit code into a <Mono>{`[3, 3]`}</Mono> field still fills all six cells across both groups. Pick whatever&apos;s easiest for the user to verbalise — <em>&ldquo;two-three-five, eight-one-four&rdquo;</em> is harder to mis-state than <em>&ldquo;235814&rdquo;</em>.
        </Lede>

        {/* Sizes */}
        <SubHead meta="sm · md · lg">Sizes</SubHead>
        <Frame label="Cell size scales with the surrounding form">
          <div style={{display:'flex', flexDirection:'column', gap: 16, width:'100%'}}>
            <div>
              <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', marginBottom: 8}}>Small (32×38) — compact dialogs, sidesheets</div>
              <OTP layout={[3, 3]} size="sm"/>
            </div>
            <div>
              <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', marginBottom: 8}}>Default (40×48) — most flows</div>
              <OTP layout={[3, 3]} size="md"/>
            </div>
            <div>
              <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', marginBottom: 8}}>Large (52×60) — primary auth surfaces</div>
              <OTP layout={[3, 3]} size="lg"/>
            </div>
          </div>
        </Frame>

        {/* States */}
        <SubHead meta="states">States</SubHead>
        <Frame label="Default · invalid · disabled — focus moves through cells with arrow keys">
          <div className="ds-grid cols-2" style={{width:'100%'}}>
            <div>
              <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', marginBottom: 8}}>Default — empty cells</div>
              <OTP layout={[3, 3]}/>
            </div>
            <div>
              <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', marginBottom: 8}}>Invalid — danger ring on every cell</div>
              <OTP layout={[3, 3]} invalid/>
            </div>
            <div>
              <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', marginBottom: 8}}>Disabled — cells set <Mono>disabled</Mono>, not focusable</div>
              <DisabledOTP/>
            </div>
            <div>
              <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', marginBottom: 8}}>Filled — value committed, ready to submit</div>
              <div className="in-otp md" role="group" aria-label="Verification code">
                <input className="in-otp-cell" defaultValue="6" readOnly aria-label="Digit 1 of 6"/>
                <input className="in-otp-cell" defaultValue="5" readOnly aria-label="Digit 2 of 6"/>
                <input className="in-otp-cell" defaultValue="4" readOnly aria-label="Digit 3 of 6"/>
                <span className="in-otp-sep" aria-hidden="true">–</span>
                <input className="in-otp-cell" defaultValue="3" readOnly aria-label="Digit 4 of 6"/>
                <input className="in-otp-cell" defaultValue="2" readOnly aria-label="Digit 5 of 6"/>
                <input className="in-otp-cell" defaultValue="1" readOnly aria-label="Digit 6 of 6"/>
              </div>
            </div>
          </div>
        </Frame>

        {/* Auto-submit on complete */}
        <SubHead meta="auto-submit">Verifying on complete</SubHead>
        <Frame
          label="Wire onComplete to fire as soon as the last cell is filled — no Submit button needed"
          code={CODE_VERIFY}
        >
          <div style={{width:'100%', maxWidth: 460}}>
            <VerifyOTP/>
          </div>
        </Frame>
        <Lede wide>
          Auto-submit feels instant — but always show a clear loading state and a clear error message. If the code is wrong, the user needs to know <em>why</em> (expired? mistyped? wrong account?) and what to do next (request a new code) — never a silent reset.
        </Lede>

        {/* Paste */}
        <SubHead meta="paste · iOS / Android autofill">Paste behavior</SubHead>
        <Frame label="Paste a 6-digit code anywhere — it fills every cell at once and lands focus on the last cell">
          <div style={{display:'flex', flexDirection:'column', gap: 14, width:'100%', maxWidth: 460}}>
            <OTP layout={[3, 3]}/>
            <div style={{padding: 10, background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-base)', color:'var(--fg-muted)', display:'flex', alignItems:'center', gap: 8}}>
              <Icons.copy size={13} color="var(--fg-faint)"/>
              <span>Try pasting <Mono>123456</Mono> into any cell</span>
            </div>
          </div>
        </Frame>
        <Lede wide>
          On iOS and Android, the <Mono>autoComplete=&quot;one-time-code&quot;</Mono> attribute lets the OS auto-fill the value straight from the SMS notification — no copy/paste needed. Make sure the SMS message includes the magic <Mono>@your-domain.com #123456</Mono> footer so iOS recognises it.
        </Lede>

        {/* Accessibility */}
        <SubHead meta="a11y">Accessibility</SubHead>
        <div className="ds-grid cols-2" style={{marginTop: 12}}>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Typing a digit fills the focused cell and auto-advances to the next; Backspace clears the current cell and steps back to the previous one. Arrow Left / Right move between cells by DOM order, and a paste of the full code distributes one digit per cell. The whole group is a single tab stop.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Each cell is an <code>&lt;input&gt;</code> with <code>inputmode="numeric"</code>, <code>autocomplete="one-time-code"</code>, and an <code>aria-label</code> stating its position — <Mono>Digit 1 of 6</Mono>. The cells sit inside a <code>role="group"</code> labelled <Mono>Verification code</Mono>, each carries <code>aria-invalid</code> when the code fails, and the verify status is announced through a <code>role="status"</code> <code>aria-live="polite"</code> region.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The active cell shows the offset focus ring; only one cell holds focus at a time as it auto-advances. Filled, error, and success states pair colour with border weight and message text, and the cell borders and digits clear AA contrast on the field surface.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The only animation is the cell&apos;s border-colour and focus-ring fade as focus auto-advances — a single <Mono>--dur-fast</Mono> transition. There is no error shake: an invalid code is shown by the danger ring, <Mono>aria-invalid</Mono>, and the live status message, which also reads cleanly under <code>prefers-reduced-motion: reduce</code>.</div>
          </div>
        </div>

        {/* RTL */}
        <SubHead meta="RTL · العربية">RTL</SubHead>
        <Frame label="dir=&quot;rtl&quot; — first cell lands on the right; cell-to-cell flow follows the document direction">
          <div dir="rtl" style={{display:'flex', flexDirection:'column', gap: 14, width:'100%'}}>
            <div>
              <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', marginBottom: 8, textAlign:'start'}}>أدخل الرمز المكوّن من ٦ أرقام (Enter the 6-digit code)</div>
              <OTP layout={[3, 3]}/>
            </div>
            <div>
              <div style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', marginBottom: 8, textAlign:'start'}}>رمز الاسترداد (Recovery code) — 2+2+2</div>
              <OTP layout={[2, 2, 2]}/>
            </div>
          </div>
        </Frame>
        <Lede wide>
          Numeric digits stay LTR even in RTL flow — that&apos;s the W3C bidi algorithm doing its job (digits 0-9 are <em>weakly</em> directional). What flips is the <em>cell order</em>: cell #1 lands on the visual right and arrow-right moves to cell #2 on its left. The <Mono>ArrowLeft / ArrowRight</Mono> handlers stay direction-agnostic — they navigate by DOM order, not visual position.
        </Lede>

        {/* Anatomy */}
        <SubHead meta="anatomy">Anatomy</SubHead>
        <div className="ds-frame">
          <div className="ds-frame-head"><span className="label">Cells, optional separators, and the layout array that drives both</span></div>
          <div className="ds-frame-body" style={{padding: '64px 36px 56px'}}>
            <div className="ana" style={{display:'flex', justifyContent:'center'}}>
              <div className="stage" style={{position:'relative'}} aria-hidden="true">
                <OTP id="ana" layout={[3, 3]}/>
                {/* Leader lines */}
                <span className="lead v" style={{top: -22, left: '12%', height: 18}}/>
                <span className="lead v" style={{top: -22, left: '50%', height: 18}}/>
                <span className="lead v" style={{top: -22, right: '12%', height: 18}}/>
                <span className="lead v" style={{bottom: -22, left: '50%', height: 18, transform:'translateX(-50%)'}}/>
                {/* Numbered pins overlaid */}
                <div className="pin" style={{top: -42, left: '12%', transform:'translateX(-50%)'}}>1</div>
                <div className="pin" style={{top: -42, left: '50%', transform:'translateX(-50%)'}}>2</div>
                <div className="pin" style={{top: -42, right: '12%', transform:'translateX(50%)'}}>3</div>
                <div className="pin" style={{bottom: -42, left: '50%', transform:'translateX(-50%)'}}>4</div>
              </div>
            </div>
            <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
              <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Cell.</b> Single-digit <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--ember)'}}>.in-otp-cell</code> with <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--ember)'}}>inputMode="numeric"</code> + <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--ember)'}}>maxLength=1</code>.</span>
              <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Separator.</b> <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--ember)'}}>.in-otp-sep</code> rendered <em>between</em> groups; not between every cell.</span>
              <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Layout array.</b> <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--ember)'}}>[3, 3]</code> = 3 cells, separator, 3 cells. Sum is the total digit count.</span>
              <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Autofill bridge.</b> Every cell sets <code style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--ember)'}}>autoComplete="one-time-code"</code> for SMS-pull on iOS / Android.</span>
            </div>
          </div>
        </div>

        {/* Decision matrix */}
        <SubHead meta="when to reach for what">When to use</SubHead>
        <Frame label="Pick the right primitive for the job">
          <div className="ds-grid cols-3" style={{width:'100%'}}>
            <div className="surface" style={{padding: 14}}>
              <div style={{fontWeight: 600, marginBottom: 6}}>OTP Input</div>
              <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', margin: 0, lineHeight: 1.55}}>
                One-time codes from SMS, email, or authenticator. Numeric. 4–8 digits. Single use.
              </p>
            </div>
            <div className="surface" style={{padding: 14}}>
              <div style={{fontWeight: 600, marginBottom: 6}}>Masked input</div>
              <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', margin: 0, lineHeight: 1.55}}>
                Phone numbers, credit cards, IBANs — long values with a fixed format that benefit from inline masking, not boxed cells.
              </p>
            </div>
            <div className="surface" style={{padding: 14}}>
              <div style={{fontWeight: 600, marginBottom: 6}}>Plain Input</div>
              <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', margin: 0, lineHeight: 1.55}}>
                Long codes (license keys, recovery hashes), or anything where the format isn't a tidy multiple-of-N digits.
              </p>
            </div>
          </div>
        </Frame>

        {/* Do / Don't */}
        <SubHead meta="rules">Do / Don't</SubHead>
        <div className="dd-grid">
          <div className="dd-card do">
            <div className="head"><Icons.check size={12}/> Do — wire autoComplete="one-time-code"</div>
            <div className="body">
              <div className="in-otp" role="group" aria-label="Verification code">
                {[2,3,5,8,1,4].map((n,i) => (
                  <input key={i} className="in-otp-cell" defaultValue={String(n)} readOnly autoComplete="one-time-code" aria-label={'Digit ' + (i + 1) + ' of 6'}/>
                ))}
              </div>
            </div>
            <div className="note">iOS and Android offer to autofill the SMS code. Without it, user copy-pastes manually — a regression vs expectation.</div>
          </div>
          <div className="dd-card dont">
            <div className="head"><Icons.x size={12}/> Don't — use OTP cells for passwords or PINs</div>
            <div className="body">
              <div className="in-otp" aria-hidden="true">
                {Array(6).fill(0).map((_,i) => (
                  <input key={i} className="in-otp-cell" defaultValue="•" readOnly tabIndex={-1}/>
                ))}
              </div>
            </div>
            <div className="note">OTP cells are visible by design — you&apos;re showing what was typed. Passwords need <Mono>type=&quot;password&quot;</Mono> with hide-by-default.</div>
          </div>

          <div className="dd-card do">
            <div className="head"><Icons.check size={12}/> Do — support paste anywhere fills all cells</div>
            <div className="body" style={{flexDirection:'column', gap: 10}}>
              <div className="in-otp" role="group" aria-label="Verification code">
                {[2,3,5,8,1,4].map((n,i) => (
                  <input key={i} className="in-otp-cell" defaultValue={String(n)} readOnly aria-label={'Digit ' + (i + 1) + ' of 6'}/>
                ))}
              </div>
              <div style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-faint)'}}>paste &ldquo;235814&rdquo; into cell #3 {'->'} all six fill</div>
            </div>
            <div className="note">Code lives in notification panel, password manager, or email. Don&apos;t force the user to land on cell #1.</div>
          </div>
          <div className="dd-card dont">
            <div className="head"><Icons.x size={12}/> Don't — add separators between every cell</div>
            <div className="body">
              <div className="in-otp" style={{gap: 0}} aria-hidden="true">
                {[2,3,5,8,1,4].map((n,i) => (
                  <React.Fragment key={i}>
                    <input className="in-otp-cell" defaultValue={String(n)} readOnly tabIndex={-1} style={{marginInline: 4}}/>
                    {i < 5 && <span className="in-otp-sep">−</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="note"><Mono>1-2-3-4-5-6</Mono> reads worse than <Mono>123-456</Mono>. One separator between groups, not between every digit.</div>
          </div>

          <div className="dd-card do">
            <div className="head"><Icons.check size={12}/> Do — match the layout to the SMS format</div>
            <div className="body" style={{flexDirection:'column', gap: 10}}>
              <div className="in-otp" role="group" aria-label="Verification code">
                <input className="in-otp-cell" defaultValue="2" readOnly aria-label="Digit 1 of 6"/>
                <input className="in-otp-cell" defaultValue="3" readOnly aria-label="Digit 2 of 6"/>
                <input className="in-otp-cell" defaultValue="5" readOnly aria-label="Digit 3 of 6"/>
                <span className="in-otp-sep" aria-hidden="true">·</span>
                <input className="in-otp-cell" defaultValue="8" readOnly aria-label="Digit 4 of 6"/>
                <input className="in-otp-cell" defaultValue="1" readOnly aria-label="Digit 5 of 6"/>
                <input className="in-otp-cell" defaultValue="4" readOnly aria-label="Digit 6 of 6"/>
              </div>
              <div style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-faint)'}}>SMS: &ldquo;Your code: 235 814&rdquo;</div>
            </div>
            <div className="note">Visual chunking should mirror verbal chunking. <Mono>{`[3, 3]`}</Mono> for &ldquo;235 814&rdquo;, not <Mono>{`[6]`}</Mono>.</div>
          </div>
          <div className="dd-card dont">
            <div className="head"><Icons.x size={12}/> Don't — reset silently on a bad code</div>
            <div className="body" style={{flexDirection:'column', gap: 10}}>
              <div className="in-otp" aria-hidden="true">
                {Array(6).fill(0).map((_,i) => (
                  <input key={i} className="in-otp-cell" defaultValue="" readOnly tabIndex={-1}/>
                ))}
              </div>
              <div style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-xs)', color:'var(--fg-faint)'}}>(cleared with no message)</div>
            </div>
            <div className="note">Clearing without a message looks like a bug. Pair reset with the danger ring + a specific reason (&ldquo;Code expired&rdquo;).</div>
          </div>
        </div>

        {/* 4. API REFERENCE */}
        <SubHead meta="OTPInputProps">API reference</SubHead>
        <AutoPropsTable component="OTPInput" label="<OTPInput />"/>
      </Section>
    );
  }
