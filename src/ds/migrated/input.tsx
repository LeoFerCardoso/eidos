'use client';
// Eidos DS — Components / Input.
//
// The everyday text-entry primitive. Built as composable building blocks so
// any combination of label · prefix · control · suffix · helper / error /
// counter slots into the same shell.
//
// This page covers the everyday shapes (basic, search, password, copy,
// info, affixes, autocomplete). For specialised entry types — File, Color,
// Number, OTP, Tag — each lives on its own page with its own anatomy,
// recipes, and decision matrix. Cross-links at the bottom.
//
// Building blocks (rendered straight from CSS classes — no React wrappers
// required to use them, but tiny helpers below make demos readable):
//   <Field> wraps label + group + helper row
//   <InputGroup> = .in-group flex shell — gets the focus ring
//   <Addon>      = .in-addon (text · icon · btn · spinner · select)
//   .in-control  = the bare native <input>, borderless inside a group
//
// Compose anything: <Group><Addon icon/> <input/> <Addon btn/></Group>.
import * as React from 'react';
import { Icons, Frame, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, Lede, Mono, PasswordInput as PasswordInputWidget, DEFAULT_PASSWORD_REQUIREMENTS } from '@/ds/core';


  const USAGE_CODE = `import { Input } from "@/components/forge/input"
import { Label } from "@/components/forge/label"

export function Demo() {
  return (
    <div className="grid gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@eidos.io"/>
    </div>
  )
}`;

  // ─── Inline-code styling (prose) ─────────────────────────────────────────
  // Token / class names in body copy read as quiet code, not as accent ink.
  // Ember is reserved for the focus ring, the one CTA, and the .match
  // highlight — never as the default colour of inline <code>.
  const CODE_INK: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-base)',
    color: 'var(--fg)',
  };
  // Smaller variant for the dense anatomy legend (on the xs step).
  const CODE_INK_XS: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    color: 'var(--fg)',
  };

  // ─── Tiny helpers used across the demos ──────────────────────────────────
  // (None of these are required to use the system — the .in-* CSS works on
  // its own. They just make the demo markup readable.)

  // Field wires real a11y plumbing so the demos match the prose:
  //   • help/error get stable ids, surfaced to the control via aria-describedby
  //   • the error span is an aria-live="assertive" region (announced on change)
  //   • children that are inputs are cloned to receive the wiring automatically
  const Field = ({ label, required, optional, htmlFor, error, help, counter, children, fluid=false, hasPop=false, style }: {
    label?: React.ReactNode;
    required?: boolean;
    optional?: boolean;
    htmlFor?: string;
    error?: React.ReactNode;
    help?: React.ReactNode;
    counter?: React.ReactNode;
    children?: React.ReactNode;
    fluid?: boolean;
    hasPop?: boolean;
    style?: React.CSSProperties;
  }) => {
    const helpId = htmlFor && help ? `${htmlFor}-help` : undefined;
    const errorId = htmlFor && error ? `${htmlFor}-error` : undefined;
    const describedBy = [errorId, helpId].filter(Boolean).join(' ') || undefined;
    // Forward aria-describedby/aria-invalid onto the bare <input> inside <Group>.
    const wired = htmlFor
      ? React.Children.map(children, (child) => {
          if (!React.isValidElement(child) || child.type !== Group) return child;
          const grp = child as React.ReactElement<{ children?: React.ReactNode; invalid?: boolean }>;
          const inner = React.Children.map(grp.props.children, (node) =>
            React.isValidElement(node) && node.type === 'input'
              ? React.cloneElement(node as React.ReactElement<Record<string, unknown>>, {
                  'aria-describedby': describedBy,
                  'aria-invalid': error ? 'true' : undefined,
                })
              : node
          );
          return React.cloneElement(grp, { children: inner });
        })
      : children;
    return (
      <div className={'in-field' + (fluid ? ' fluid' : '') + (hasPop ? ' has-pop' : '')} style={style}>
        {label && (
          <label className="in-label" htmlFor={htmlFor}>
            {label}
            {required && <span className="required-mark" aria-hidden="true">*</span>}
            {optional && <span className="opt">(optional)</span>}
          </label>
        )}
        {wired}
        {(help || error || counter !== undefined) && (
          <div className="in-helprow">
            {error && (
              <span id={errorId} className="in-error" role="alert" aria-live="assertive">
                <Icons.alert size={12}/>{error}
              </span>
            )}
            {!error && help && <span id={helpId} className="in-help">{help}</span>}
            {counter !== undefined && (
              <span className="in-counter">{counter}</span>
            )}
          </div>
        )}
      </div>
    );
  };

  const Group = ({ size='md', invalid, disabled, readOnly, children, style }: {
    size?: string;
    invalid?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    children?: React.ReactNode;
    style?: React.CSSProperties;
  }) => (
    <div
      className={'in-group ' + size + (invalid ? ' is-invalid' : '') + (disabled ? ' is-disabled' : '') + (readOnly ? ' is-readonly' : '')}
      aria-invalid={invalid ? 'true' : undefined}
      style={style}
    >
      {children}
    </div>
  );

  const Spin = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="8" cy="8" r="6" opacity="0.18"/>
      <path d="M8 2 a6 6 0 0 1 6 6">
        <animateTransform attributeName="transform" type="rotate" from="0 8 8" to="360 8 8" dur="0.9s" repeatCount="indefinite"/>
      </path>
    </svg>
  );

  // ─── Live-validation demo ────────────────────────────────────────────────
  // Proves the wiring is real, not documented: as you type a service slug the
  // field flips invalid → valid, the danger ring + icon + message appear, and
  // the message is announced through the aria-live="assertive" error region.
  // Empty, error, and valid states are all reachable in one control.
  const ValidationDemo = () => {
    const [val, setVal] = React.useState('Identity SVC');
    const trimmed = val.trim();
    const error =
      trimmed === '' ? 'Service name is required'
      : /[^a-z0-9-]/.test(trimmed) ? 'Use lowercase letters, numbers, and hyphens only'
      : trimmed.length < 3 ? 'At least 3 characters'
      : undefined;
    const valid = !error;
    return (
      <Field
        htmlFor="lv1"
        label="Service name" required
        error={error}
        help={valid ? 'Looks good — available.' : undefined}
      >
        <Group invalid={!!error}>
          <span className="in-addon icon"><Icons.branch size={14}/></span>
          <input
            id="lv1" className="in-control"
            value={val} onChange={(e) => setVal(e.target.value)}
            placeholder="identity-svc"
          />
          {valid && <span className="in-addon icon" aria-hidden="true" style={{color:'var(--success)'}}><Icons.check size={15}/></span>}
        </Group>
      </Field>
    );
  };

  // ─── Strength bar live demo ───────────────────────────────────────────────
  const StrengthDemo = () => {
    const [val, setVal] = React.useState('');
    return (
      <PasswordInputWidget
        label="New password"
        placeholder="Choose a password"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        showStrength
        requirements={DEFAULT_PASSWORD_REQUIREMENTS}
      />
    );
  };

  // ─── Reusable interactive components used across multiple demos ──────────

  // Password input with show/hide toggle.
  const PasswordInput = ({ id, defaultValue='', size='md', placeholder='••••••••', invalid, error, help }: {
    id?: string;
    defaultValue?: string;
    size?: string;
    placeholder?: string;
    invalid?: boolean;
    error?: React.ReactNode;
    help?: React.ReactNode;
  }) => {
    const [show, setShow] = React.useState(false);
    return (
      <Field htmlFor={id} label="Password" help={help} error={error}>
        <Group size={size} invalid={invalid}>
          <span className="in-addon icon"><Icons.shield size={14}/></span>
          <input id={id} type={show ? 'text' : 'password'} className="in-control" defaultValue={defaultValue} placeholder={placeholder}/>
          <button
            type="button" className="in-addon btn"
            onClick={() => setShow(s => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
            aria-pressed={show}
          >
            {show ? <Icons.eyeOff size={15}/> : <Icons.eye size={15}/>}
          </button>
        </Group>
      </Field>
    );
  };

  // Token / API-key field with one-shot copy.
  const CopyInput = ({ id, value, label='API key', help }: {
    id?: string;
    value?: string;
    label?: string;
    help?: React.ReactNode;
  }) => {
    const [copied, setCopied] = React.useState(false);
    const onCopy = async () => {
      try { await navigator.clipboard.writeText(value); }
      catch(e) {
        const ta = document.createElement('textarea');
        ta.value = value; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); } catch(e2){}
        ta.remove();
      }
      setCopied(true); setTimeout(() => setCopied(false), 1400);
    };
    return (
      <Field htmlFor={id} label={label} help={help}>
        <Group readOnly>
          <input id={id} className="in-control t-mono" readOnly value={value} style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-sm)'}}/>
          <button type="button" className={'in-addon btn' + (copied ? ' is-active' : '')} onClick={onCopy} aria-label="Copy">
            {copied ? <Icons.check size={15}/> : <Icons.copy size={15}/>}
          </button>
        </Group>
      </Field>
    );
  };

  // Search with optional clear-X.
  const SearchInput = ({ id, placeholder='Search…', shortcut='⌘K' }: {
    id?: string;
    placeholder?: string;
    shortcut?: string;
  }) => {
    const [v, setV] = React.useState('');
    return (
      <Group>
        <span className="in-addon icon"><Icons.search size={14}/></span>
        <input id={id} className="in-control" placeholder={placeholder} value={v} onChange={(e)=>setV(e.target.value)}/>
        {v ? (
          <button type="button" className="in-addon btn" onClick={() => setV('')} aria-label="Clear search">
            <Icons.x size={14}/>
          </button>
        ) : (
          <span className="in-addon" style={{paddingInline: 10}}>
            <span className="kbd">{shortcut}</span>
          </span>
        )}
      </Group>
    );
  };

  // Autocomplete with case-insensitive substring match — a true ARIA 1.2
  // combobox: aria-controls + aria-activedescendant track the listbox and the
  // virtually-focused option (focus stays in the textbox), and an off-screen
  // aria-live region announces the result count as the user types.
  const AutocompleteInput = ({ id='ac', options, placeholder='Search…', describedBy }: {
    id?: string;
    options: Array<{ label: string; meta?: string }>;
    placeholder?: string;
    describedBy?: string;
  }) => {
    const [v, setV] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [active, setActive] = React.useState(0);
    const listId = `${id}-list`;
    const optId = (i: number) => `${id}-opt-${i}`;
    const matches = React.useMemo(() => {
      if (!v.trim()) return [];
      const q = v.toLowerCase();
      return options.filter(o => o.label.toLowerCase().includes(q)).slice(0, 6);
    }, [v, options]);
    const isOpen = open && matches.length > 0;
    const activeId = isOpen ? optId(active) : undefined;
    const onKey = (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive(i => Math.min(i + 1, matches.length - 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(i => Math.max(i - 1, 0)); }
      else if (e.key === 'Enter' && open && matches[active]) {
        e.preventDefault(); setV(matches[active].label); setOpen(false);
      } else if (e.key === 'Escape') { setOpen(false); }
    };
    const wrapRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
      const onDoc = (e: MouseEvent) => { if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false); };
      document.addEventListener('mousedown', onDoc);
      return () => document.removeEventListener('mousedown', onDoc);
    }, []);
    const renderHighlight = (label: string) => {
      if (!v.trim()) return label;
      const idx = label.toLowerCase().indexOf(v.toLowerCase());
      if (idx < 0) return label;
      return <>{label.slice(0, idx)}<span className="match">{label.slice(idx, idx + v.length)}</span>{label.slice(idx + v.length)}</>;
    };
    // Result count announced politely for screen readers (true aria-live).
    const status = !v.trim() ? '' : matches.length === 0 ? `No matches for ${v}` : `${matches.length} suggestion${matches.length === 1 ? '' : 's'} available`;
    return (
      <div ref={wrapRef} style={{position:'relative', width:'100%'}}>
        <Group>
          <span className="in-addon icon"><Icons.search size={14}/></span>
          <input
            id={id} className="in-control"
            value={v}
            onChange={(e) => { setV(e.target.value); setOpen(true); setActive(0); }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKey}
            placeholder={placeholder}
            autoComplete="off"
            role="combobox"
            aria-expanded={isOpen}
            aria-autocomplete="list"
            aria-controls={listId}
            aria-activedescendant={activeId}
            aria-describedby={describedBy}
          />
        </Group>
        {isOpen && (
          <div className="in-pop" role="listbox" id={listId}>
            {matches.map((m, i) => (
              <button
                key={m.label} type="button" id={optId(i)}
                className={'in-pop-item' + (i === active ? ' is-active' : '')}
                onMouseEnter={() => setActive(i)}
                onClick={() => { setV(m.label); setOpen(false); }}
                role="option" aria-selected={i === active} tabIndex={-1}
              >
                <span>{renderHighlight(m.label)}</span>
                {m.meta && <span className="meta">{m.meta}</span>}
              </button>
            ))}
          </div>
        )}
        {open && v && matches.length === 0 && (
          <div className="in-pop"><div className="in-pop-empty">No matches for &quot;{v}&quot;</div></div>
        )}
        <span className="sr-only" role="status" aria-live="polite">{status}</span>
      </div>
    );
  };

  // ─── Code samples (one source — used in code panels below) ───────────────
  const CODE_BASIC = [
    `<Field label="Email" htmlFor="email" required help="We never share your email.">`,
    `  <Input id="email" type="email" placeholder="you@eidos.io"/>`,
    `</Field>`,
  ].join('\n');

  const CODE_AFFIX = [
    `<InputGroup>`,
    `  <InputGroup.Addon>https://</InputGroup.Addon>`,
    `  <Input placeholder="my-app"/>`,
    `  <InputGroup.Addon>.eidos.io</InputGroup.Addon>`,
    `</InputGroup>`,
  ].join('\n');

  const CODE_PASSWORD = [
    `const [show, setShow] = React.useState(false)`,
    ``,
    `<InputGroup>`,
    `  <InputGroup.Addon><Shield size={14}/></InputGroup.Addon>`,
    `  <Input type={show ? "text" : "password"}/>`,
    `  <InputGroup.Button`,
    `    aria-label={show ? "Hide password" : "Show password"}`,
    `    aria-pressed={show}`,
    `    onClick={() => setShow((s) => !s)}`,
    `  >`,
    `    {show ? <EyeOff/> : <Eye/>}`,
    `  </InputGroup.Button>`,
    `</InputGroup>`,
  ].join('\n');

  const CODE_AUTO = [
    `<Autocomplete value={query} onValueChange={setQuery} options={services}>`,
    `  <Autocomplete.Trigger>`,
    `    <Input placeholder="Search services…"/>`,
    `  </Autocomplete.Trigger>`,
    `  <Autocomplete.Content>`,
    `    {matches.map((m) => (`,
    `      <Autocomplete.Item key={m.label} value={m.label}>`,
    `        {m.label}`,
    `      </Autocomplete.Item>`,
    `    ))}`,
    `  </Autocomplete.Content>`,
    `</Autocomplete>`,
  ].join('\n');

  // ─── Page ────────────────────────────────────────────────────────────────
  const InputPage = () => {
    const [name, setName] = React.useState('');

    return (
      <Section
        id="input"
        num="22"
        title="Input"
        desc="The everyday text-entry primitive. Composable building blocks for label, prefix, control, suffix, helper, and error. Specialised shapes — File, Color, Number, OTP, Tag — each have a dedicated page."
      >
        {/* 1. INSTALLATION */}
        <SubHead meta="package managers">Installation</SubHead>
        <TabbedCode tabs={installTabs('input')} ariaLabel="package manager"/>
        <Lede>
          Ships <Mono>input.tsx</Mono> + the shared <Mono>.in-*</Mono> field shell (label, group, addon, helper). Mix the parts to build any field your product needs.
        </Lede>

        {/* 2. USAGE */}
        <SubHead meta="hello world">Usage</SubHead>
        <Frame label="basic" code={USAGE_CODE}>
          <div style={{width:'100%', maxWidth: 360}}>
            <Field htmlFor="usage" label="Email">
              <Group><input id="usage" type="email" className="in-control" placeholder="you@eidos.io"/></Group>
            </Field>
          </div>
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

        <p style={{color:'var(--fg-muted)', maxWidth:'72ch', marginBottom: 22}}>
          Every input on the page is built from the same three pieces — a <code style={CODE_INK}>.in-field</code> wrapper, a <code style={CODE_INK}>.in-group</code> shell that paints the focus ring, and one or more <code style={CODE_INK}>.in-addon</code> siblings around a bare <code style={CODE_INK}>.in-control</code> input. Mix-and-match to build any field your product needs.
        </p>

        {/* ─── Basic ─── */}
        <SubHead meta="single field">Basic</SubHead>
        <Frame label="The simplest possible field — label, control, helper" code={CODE_BASIC}>
          <div style={{width:'100%', maxWidth: 360}}>
            <Field htmlFor="b1" label="Email" required help="We never share your email.">
              <Group><input id="b1" type="email" className="in-control" placeholder="you@eidos.io"/></Group>
            </Field>
          </div>
        </Frame>

        <Frame label="Without label · placeholder only">
          <div style={{width:'100%', maxWidth: 360}}>
            <Group><input className="in-control" placeholder="Type to search…"/></Group>
          </div>
        </Frame>

        <Frame label="With supporting text + character counter">
          <div style={{width:'100%', maxWidth: 360}}>
            <Field
              htmlFor="b2" label="Display name"
              help="Shown across the platform."
              counter={`${name.length} / 32`}
            >
              <Group>
                <input
                  id="b2" className="in-control" maxLength={32}
                  value={name} onChange={(e)=>setName(e.target.value)}
                  placeholder="Riccardo Hernandez"
                />
              </Group>
            </Field>
          </div>
        </Frame>

        {/* ─── Sizes ─── */}
        <SubHead meta="sm · md · lg">Sizes</SubHead>
        <Frame label="28 · 36 · 44 px height — match the surrounding chrome">
          <div className="ds-grid cols-3" style={{width:'100%'}}>
            <Field label="Small (28)" htmlFor="sz1">
              <Group size="sm"><input id="sz1" className="in-control" placeholder="compact tables"/></Group>
            </Field>
            <Field label="Default (36)" htmlFor="sz2">
              <Group size="md"><input id="sz2" className="in-control" placeholder="forms & dialogs"/></Group>
            </Field>
            <Field label="Large (44)" htmlFor="sz3">
              <Group size="lg"><input id="sz3" className="in-control" placeholder="hero search"/></Group>
            </Field>
          </div>
        </Frame>

        {/* ─── States ─── */}
        <SubHead meta="states">States</SubHead>
        <Frame label="default · focus · invalid · disabled · readonly · loading">
          <div className="ds-grid cols-3" style={{width:'100%'}}>
            <Field label="Default" htmlFor="st1">
              <Group><input id="st1" className="in-control" placeholder="placeholder"/></Group>
            </Field>
            <Field label="Focus (auto)" htmlFor="st2">
              <Group><input id="st2" className="in-control" defaultValue="identity-svc" autoFocus={false}/></Group>
              <span className="in-help" style={{marginTop: 6}}>Tab into the field to see the ember ring.</span>
            </Field>
            <Field label="Invalid" htmlFor="st3" error="Must be lowercase">
              <Group invalid><input id="st3" className="in-control" defaultValue="Identity SVC"/></Group>
            </Field>
            <Field label="Disabled" htmlFor="st4">
              <Group disabled><input id="st4" className="in-control" defaultValue="locked" disabled/></Group>
            </Field>
            <Field label="Readonly" htmlFor="st5" help="Tap to copy">
              <Group readOnly><input id="st5" className="in-control" defaultValue="eidos_3f2a…" readOnly/></Group>
            </Field>
            <Field label="Loading" htmlFor="st6" help="Validating availability…">
              <Group>
                <input id="st6" className="in-control" defaultValue="checking-name"/>
                <span className="in-addon spinner" aria-hidden="true"><Spin/></span>
              </Group>
            </Field>
          </div>
        </Frame>

        {/* ─── Live validation ─── */}
        <SubHead meta="error · valid · live">Live validation</SubHead>
        <Frame label="Type to validate — the danger ring, icon, and message react live and are announced">
          <div style={{width:'100%', maxWidth: 360}}>
            <ValidationDemo />
          </div>
        </Frame>
        <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', marginTop: 14, maxWidth:'72ch'}}>
          The control carries <code style={CODE_INK}>aria-invalid</code> and <code style={CODE_INK}>aria-describedby</code> pointing at the message; the error span is a <code style={CODE_INK}>role="alert"</code> live region, so each new reason is announced without moving focus. Error never relies on colour alone — the danger border pairs with an icon and a specific sentence.
        </p>

        {/* ─── Required ─── */}
        <SubHead meta="required · optional">Required &amp; optional</SubHead>
        <Frame label="Mark every field — required with *, optional with the trailing tag">
          <div className="ds-grid cols-2" style={{width:'100%'}}>
            <Field htmlFor="rq1" label="Service name" required help="Required for all services.">
              <Group><input id="rq1" className="in-control" placeholder="identity-svc" required aria-required="true"/></Group>
            </Field>
            <Field htmlFor="rq2" label="Internal description" optional help="Visible only to your team.">
              <Group><input id="rq2" className="in-control" placeholder="Auth & user identity"/></Group>
            </Field>
          </div>
        </Frame>
        <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', marginTop: 14, maxWidth:'72ch'}}>
          Pick one convention per form and stick to it. Most forms have more required than optional fields, so marking <em>optional</em> is the lower-noise choice. The <code style={CODE_INK}>required</code> attribute on the input pairs with the visual <code style={CODE_INK}>*</code> for screen readers.
        </p>

        {/* ─── Icons ─── */}
        <SubHead meta="leading · trailing">With icons</SubHead>
        <Frame label="Decorative icons inside the field — left, right, or both">
          <div className="ds-grid cols-2" style={{width:'100%'}}>
            <Field label="Email" htmlFor="ic1">
              <Group>
                <span className="in-addon icon"><Icons.bell size={14}/></span>
                <input id="ic1" type="email" className="in-control" placeholder="you@eidos.io"/>
              </Group>
            </Field>
            <Field label="When" htmlFor="ic2">
              <Group>
                <span className="in-addon icon"><Icons.calendar size={14}/></span>
                <input id="ic2" className="in-control" placeholder="Pick a date" defaultValue="Jul 12, 2025"/>
                <span className="in-addon icon"><Icons.chevronDown size={14}/></span>
              </Group>
            </Field>
            <Field label="Repository" htmlFor="ic3">
              <Group>
                <span className="in-addon icon"><Icons.branch size={14}/></span>
                <input id="ic3" className="in-control" placeholder="eidos/identity"/>
              </Group>
            </Field>
            <Field label="Avatar URL" htmlFor="ic4">
              <Group>
                <span className="in-addon icon"><Icons.image size={14}/></span>
                <input id="ic4" className="in-control" placeholder="https://…"/>
                <span className="in-addon icon"><Icons.link size={14}/></span>
              </Group>
            </Field>
          </div>
        </Frame>

        {/* ─── Search ─── */}
        <SubHead meta="search · clear · shortcut">Search</SubHead>
        <Frame label="Empty shows the keyboard hint; type to reveal a clear-X">
          <div style={{width:'100%', maxWidth: 360}}>
            <SearchInput id="sr1" placeholder="Search services, deploys, GMUDs…"/>
          </div>
        </Frame>

        {/* ─── Password ─── */}
        <SubHead meta="show · hide · strength">Password</SubHead>
        <Frame
          label="Show / hide toggle. The eye flips and updates aria-pressed."
          code={CODE_PASSWORD}
        >
          <div style={{width:'100%', maxWidth: 360}}>
            <PasswordInput id="pw1" defaultValue="anvil-strike-7" help="At least 12 characters with one symbol."/>
          </div>
        </Frame>

        <Frame label="Validating — invalid + ember spinner while checking pwned-passwords">
          <div style={{width:'100%', maxWidth: 360}}>
            <Field label="Password" htmlFor="pw2" help="Checking against breach databases…">
              <Group>
                <span className="in-addon icon"><Icons.shield size={14}/></span>
                <input id="pw2" type="password" className="in-control" defaultValue="••••••••••"/>
                <span className="in-addon spinner" aria-hidden="true"><Spin/></span>
              </Group>
            </Field>
          </div>
        </Frame>

        <Frame label="Strength bar + requirements checklist — type to see the score update">
          <div style={{width:'100%', maxWidth: 360}}>
            <StrengthDemo />
          </div>
        </Frame>

        {/* ─── Copy ─── */}
        <SubHead meta="copy · readonly">With copy button</SubHead>
        <Frame label="Tokens, API keys, share links — readonly + one-shot copy">
          <div style={{width:'100%', maxWidth: 460}}>
            <CopyInput id="cp1" label="API key" value="sk_live_4f9a8c1d••••••••••••" help="Click the icon to copy. The action confirms with a check for 1.4s."/>
          </div>
        </Frame>

        {/* ─── Info tooltip ─── */}
        <SubHead meta="info · help-on-demand">With info button</SubHead>
        <Frame label="Inline info icon — anchors a tooltip / popover with the full explanation">
          <div className="ds-grid cols-2" style={{width:'100%'}}>
            <Field
              htmlFor="if1"
              label={<>Idle timeout <span className="tt bottom wrap" data-tt="How long an idle session waits before requiring re-authentication." tabIndex={0} aria-label="More info" style={{cursor:'help'}}><Icons.info size={13} color="var(--fg-faint)"/></span></>}
            >
              <Group>
                <input id="if1" className="in-control" defaultValue="30"/>
                <span className="in-addon text">minutes</span>
              </Group>
            </Field>
            <Field htmlFor="if2" label="Webhook URL">
              <Group>
                <input id="if2" className="in-control" placeholder="https://hooks.example.com/…"/>
                <button type="button" className="in-addon btn tt bottom wrap" data-tt="POST receives a JSON payload with event type, payload digest, and a signed header." aria-label="Webhook help">
                  <Icons.info size={14}/>
                </button>
              </Group>
            </Field>
          </div>
        </Frame>

        {/* ─── Prefix / Suffix text ─── */}
        <SubHead meta="prefix · suffix">Static text affix</SubHead>
        <Frame label="https:// scheme · domain suffix · file extension" code={CODE_AFFIX}>
          <div className="ds-grid cols-2" style={{width:'100%'}}>
            <Field label="Subdomain" htmlFor="af1">
              <Group>
                <span className="in-addon text">https://</span>
                <input id="af1" className="in-control" defaultValue="my-app"/>
                <span className="in-addon text">.eidos.io</span>
              </Group>
            </Field>
            <Field label="Filename" htmlFor="af2">
              <Group>
                <input id="af2" className="in-control" defaultValue="release-notes"/>
                <span className="in-addon text">.md</span>
              </Group>
            </Field>
            <Field label="Username" htmlFor="af3">
              <Group>
                <span className="in-addon text">@</span>
                <input id="af3" className="in-control" placeholder="rhernandez"/>
              </Group>
            </Field>
            <Field label="Volume" htmlFor="af4">
              <Group>
                <input id="af4" type="number" className="in-control" defaultValue="20"/>
                <span className="in-addon text">GB</span>
              </Group>
            </Field>
          </div>
        </Frame>

        {/* ─── Prefix / Suffix select ─── */}
        <SubHead meta="select-as-affix">Select prefix / suffix</SubHead>
        <Frame label="Phone country code · unit picker · time-zone">
          <div className="ds-grid cols-2" style={{width:'100%'}}>
            <Field label="Phone" htmlFor="ps1" help="Pick the country, then type the rest.">
              <Group>
                <select className="in-addon select" defaultValue="+1" aria-label="Country code" style={{paddingInlineEnd: 26}}>
                  <option>+1</option><option>+44</option><option>+55</option><option>+971</option><option>+81</option>
                </select>
                <input id="ps1" type="tel" className="in-control" placeholder="(415) 555-0199"/>
              </Group>
            </Field>
            <Field label="Timeout" htmlFor="ps2" help="Value with a unit picker on the trailing edge.">
              <Group>
                <input id="ps2" type="number" className="in-control" defaultValue="30"/>
                <select className="in-addon select" defaultValue="min" aria-label="Unit">
                  <option>sec</option><option>min</option><option>hr</option><option>day</option>
                </select>
              </Group>
            </Field>
          </div>
        </Frame>

        {/* ─── With button (CTA) ─── */}
        <SubHead meta="input + CTA">With trailing button</SubHead>
        <Frame label="Newsletter, invite-by-email, run-query — input + primary action">
          <div style={{display:'flex', flexDirection:'column', gap: 14, width:'100%'}}>
            <Field label="Subscribe to release notes" htmlFor="cta1" help="One email per release. Unsubscribe any time.">
              <Group size="lg" style={{paddingInlineEnd: 4}}>
                <span className="in-addon icon"><Icons.bell size={15}/></span>
                <input id="cta1" type="email" className="in-control" placeholder="you@eidos.io"/>
                <button type="button" className="btn ember" style={{alignSelf:'center'}}>
                  Subscribe <Icons.arrowRight size={13}/>
                </button>
              </Group>
            </Field>

            <Field label="Invite by email" htmlFor="cta2">
              <Group style={{paddingInlineEnd: 4}}>
                <span className="in-addon icon"><Icons.user size={14}/></span>
                <input id="cta2" type="email" className="in-control" placeholder="teammate@eidos.io"/>
                <button type="button" className="btn outline sm" style={{alignSelf:'center'}}>
                  <Icons.plus size={12}/> Invite
                </button>
              </Group>
            </Field>
          </div>
        </Frame>

        {/* ─── Autocomplete ─── */}
        <SubHead meta="typeahead · listbox">Autocomplete</SubHead>
        <Frame
          label="Type to filter · ↑/↓ to move · Enter to commit · Esc to dismiss"
          code={CODE_AUTO}
        >
          <div style={{width:'100%', maxWidth: 420}}>
            <Field label="Service" htmlFor="ac1" hasPop help="Try “ide…” or “bil…”">
              <AutocompleteInput
                id="ac1"
                describedBy="ac1-help"
                placeholder="Search services…"
                options={[
                  { label: 'identity-svc',     meta: 'T1' },
                  { label: 'identity-gateway', meta: 'T1' },
                  { label: 'billing-svc',      meta: 'T2' },
                  { label: 'billing-export',   meta: 'T2' },
                  { label: 'notifications',    meta: 'T2' },
                  { label: 'observability',    meta: 'T1' },
                  { label: 'metering',         meta: 'T2' },
                  { label: 'reporting-svc',    meta: 'T3' },
                ]}
              />
            </Field>
          </div>
        </Frame>
        <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', marginTop: 14, maxWidth:'72ch'}}>
          Use Autocomplete when typing is faster than scanning a list (≥10 options, deep catalog). For a fixed shortlist of options, prefer <a href="/select" style={{color:'var(--ember)'}}>Select</a>; for free-entry + multi-select with chips, prefer <a href="/combobox" style={{color:'var(--ember)'}}>Combobox</a>.
        </p>

        {/* ─── Specialized inputs — see-also pages ─── */}
        <SubHead meta="dedicated pages">Specialized inputs</SubHead>
        <p style={{fontSize: 'var(--text-base)', color:'var(--fg-muted)', maxWidth:'72ch', marginBottom: 14}}>
          The shapes below ship the same building blocks (group · control · addon) but each adds enough domain logic to deserve its own page — anatomy, recipes, decision matrix, and do/don't.
        </p>
        <Frame label="Each tile links to the dedicated component page">
          <div className="ds-grid cols-3" style={{width:'100%'}}>
            <a href="/number-input" className="comp-tile" style={{textDecoration:'none', color:'inherit'}}>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                <span className="name">Number Input</span>
                <Icons.arrowRight size={14} color="var(--fg-faint)"/>
              </div>
              <p className="desc">Currency, percent, units, ports, replicas. Stepper opt-in.</p>
            </a>
            <a href="/otp-input" className="comp-tile" style={{textDecoration:'none', color:'inherit'}}>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                <span className="name">OTP Input</span>
                <Icons.arrowRight size={14} color="var(--fg-faint)"/>
              </div>
              <p className="desc">One-time codes — auto-advance, paste, SMS autofill.</p>
            </a>
            <a href="/tag-input" className="comp-tile" style={{textDecoration:'none', color:'inherit'}}>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                <span className="name">Tag Input</span>
                <Icons.arrowRight size={14} color="var(--fg-faint)"/>
              </div>
              <p className="desc">Free-entry list with chips, autocomplete, validation.</p>
            </a>
            <a href="/file-input" className="comp-tile" style={{textDecoration:'none', color:'inherit'}}>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                <span className="name">File Input</span>
                <Icons.arrowRight size={14} color="var(--fg-faint)"/>
              </div>
              <p className="desc">Drag-and-drop upload with previews and progress.</p>
            </a>
            <a href="/color-input" className="comp-tile" style={{textDecoration:'none', color:'inherit'}}>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                <span className="name">Color Input</span>
                <Icons.arrowRight size={14} color="var(--fg-faint)"/>
              </div>
              <p className="desc">H/S/V picker with hex, RGB, alpha, and swatches.</p>
            </a>
            <a href="/combobox" className="comp-tile" style={{textDecoration:'none', color:'inherit'}}>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                <span className="name">Combobox</span>
                <Icons.arrowRight size={14} color="var(--fg-faint)"/>
              </div>
              <p className="desc">Multi-select picker — typeahead, free entry, groups.</p>
            </a>
          </div>
        </Frame>

        {/* ─── Composing recipes ─── */}
        <SubHead meta="real-world combos">Composing recipes</SubHead>
        <Frame label="Mix and match — four production-ready combinations">
          <div className="ds-grid cols-2" style={{width:'100%'}}>
            <Field label="Hostname + port" htmlFor="rc1" help="Bind two related values into one field.">
              <Group>
                <input id="rc1" className="in-control" defaultValue="api.eidos.io" style={{flex: '1 1 auto'}}/>
                <span className="in-addon" style={{padding: 0, alignSelf:'stretch', width: 1, background:'var(--border)'}} aria-hidden="true"/>
                <input className="in-control" type="number" defaultValue="443" style={{flex: '0 0 80px', textAlign:'center'}}/>
              </Group>
            </Field>

            <Field label="Time window" htmlFor="rc2" help="Two time inputs joined visually as one field — useful for SLO windows, maintenance slots.">
              <Group>
                <span className="in-addon icon" aria-hidden="true"><Icons.clock size={14}/></span>
                <input id="rc2" type="text" className="in-control t-mono" defaultValue="08:00" style={{flex: '1 1 0', fontFamily:'var(--font-mono)', textAlign:'center'}}/>
                <span className="in-addon" aria-hidden="true" style={{padding:'0 6px', color:'var(--fg-faint)'}}>
                  <Icons.arrowRight size={13}/>
                </span>
                <input type="text" className="in-control t-mono" defaultValue="18:00" style={{flex: '1 1 0', fontFamily:'var(--font-mono)', textAlign:'center'}}/>
                <span className="in-addon text">UTC</span>
              </Group>
            </Field>

            <Field label="URL with method" htmlFor="rc3" help="HTTP method picker on the leading edge — common in API testers.">
              <Group>
                <select className="in-addon select" defaultValue="POST" aria-label="HTTP method" style={{fontWeight: 600, fontFamily:'var(--font-mono)', fontSize: 'var(--text-sm)'}}>
                  <option>GET</option><option>POST</option><option>PUT</option><option>PATCH</option><option>DELETE</option>
                </select>
                <input id="rc3" className="in-control t-mono" defaultValue="https://api.eidos.io/v1/services" style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-sm)'}}/>
              </Group>
            </Field>

            <Field label="Quantity stepper" htmlFor="rc4" help="±1 buttons on either side, value in the middle.">
              <Group style={{width: 160}}>
                <button type="button" className="in-addon btn" aria-label="Decrease" onClick={(e) => { const i = e.currentTarget.parentElement.querySelector('input'); i.stepDown(); }}><Icons.minus size={12}/></button>
                <input id="rc4" type="number" inputMode="numeric" className="in-control" defaultValue="3" min="0" style={{textAlign:'center'}}/>
                <button type="button" className="in-addon btn" aria-label="Increase" onClick={(e) => { const i = e.currentTarget.parentElement.querySelector('input'); i.stepUp(); }}><Icons.plus size={12}/></button>
              </Group>
            </Field>
          </div>
        </Frame>

        {/* ─── Accessibility ─── */}
        <SubHead meta="a11y">Accessibility</SubHead>
        <div className="ds-grid cols-2" style={{marginTop: 12}}>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Keyboard</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55, marginBottom: 10}}>
              The control is a native <code style={CODE_INK}>&lt;input&gt;</code> — Tab focuses it, typing edits, Enter submits the form. Trailing affordances (clear, copy, reveal, info) are real buttons reached by Tab. The autocomplete keeps focus in the textbox and moves a virtual cursor:
            </div>
            <div role="list">
              <div className="kbd-row" role="listitem"><span className="label">Move active suggestion</span><span className="kbd-chord trailing"><span className="kbd">↓</span><span className="kbd">↑</span></span></div>
              <div className="kbd-row" role="listitem"><span className="label">Commit the active suggestion</span><span className="kbd-chord trailing"><span className="kbd">Enter</span></span></div>
              <div className="kbd-row" role="listitem"><span className="label">Dismiss the listbox</span><span className="kbd-chord trailing"><span className="kbd">Esc</span></span></div>
              <div className="kbd-row" role="listitem"><span className="label">Reveal / hide password</span><span className="kbd-chord trailing"><span className="kbd">Enter</span><span className="kbd">Space</span></span></div>
            </div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Screen reader</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The field is named by a real <code style={CODE_INK}>&lt;label htmlFor&gt;</code>. Helper text and errors are wired with <code style={CODE_INK}>aria-describedby</code>; an invalid field sets <code style={CODE_INK}>aria-invalid</code> and announces its message through a <code style={CODE_INK}>role="alert"</code> live region. Prefix / suffix affixes are described, not focusable. The autocomplete is an ARIA combobox — <code style={CODE_INK}>role="combobox"</code> with <code style={CODE_INK}>aria-expanded</code>, <code style={CODE_INK}>aria-controls</code> on its listbox, and <code style={CODE_INK}>aria-activedescendant</code> tracking the option; a polite live region counts the matches as you type.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Focus &amp; contrast</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Focus rings the field shell; embedded buttons get their own ring when tabbed to. Error state pairs the red border with an icon and message so it never depends on colour alone, and placeholder, helper, and error text all clear AA contrast on the field surface.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBottom: 6}}>Motion</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Focus-ring fades, the password strength bar, and the autocomplete open are short token transitions. Under <code>prefers-reduced-motion: reduce</code> they resolve instantly to the final state.</div>
          </div>
        </div>

        {/* ─── RTL ─── */}
        <SubHead meta="RTL · العربية">RTL</SubHead>
        <Frame label="dir=&quot;rtl&quot; — affixes, icons, helpers, errors all flip via logical properties">
          <div dir="rtl" className="ds-grid cols-2" style={{width:'100%'}}>
            <Field label="البريد الإلكتروني" htmlFor="rtl1" required help="لن نشارك بريدك الإلكتروني.">
              <Group>
                <span className="in-addon icon"><Icons.bell size={14}/></span>
                <input id="rtl1" type="email" className="in-control" placeholder="you@eidos.io"/>
              </Group>
            </Field>
            <Field label="اسم النطاق" htmlFor="rtl2" help="سيظهر هذا الاسم على رابط النشر.">
              <Group>
                <span className="in-addon text">https://</span>
                <input id="rtl2" className="in-control" defaultValue="my-app"/>
                <span className="in-addon text">.eidos.io</span>
              </Group>
            </Field>
            <Field label="كلمة المرور" htmlFor="rtl3" help="على الأقل ١٢ حرفًا.">
              <PasswordInput id="rtl3-i" defaultValue="anvil-strike-7"/>
            </Field>
            <Field label="بحث" htmlFor="rtl4">
              <SearchInput placeholder="ابحث عن الخدمات…"/>
            </Field>
            <Field label="الاسم" htmlFor="rtl5" error="يجب أن يكون بأحرف صغيرة">
              <Group invalid><input id="rtl5" className="in-control" defaultValue="Identity SVC"/></Group>
            </Field>
            <Field label="مفتاح API" htmlFor="rtl6" help="انقر لنسخ المفتاح إلى الحافظة.">
              <Group readOnly>
                <input id="rtl6" className="in-control t-mono" readOnly value="sk_live_4f9a8c1d••••" style={{fontFamily:'var(--font-mono)', fontSize: 'var(--text-sm)'}}/>
                <button type="button" className="in-addon btn" aria-label="نسخ"><Icons.copy size={14}/></button>
              </Group>
            </Field>
          </div>
        </Frame>
        <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', marginTop: 14, maxWidth:'72ch'}}>
          Logical properties (<code style={CODE_INK}>border-inline-start</code>, <code style={CODE_INK}>padding-inline</code>) do all the mirroring work — affix order, helper alignment, and counter position adapt without per-direction rules. Latin tokens like <code style={CODE_INK}>USD</code> and <code style={CODE_INK}>identity-svc</code> are auto-isolated by the browser inside RTL flow.
        </p>

        {/* ─── Anatomy ─── */}
        <SubHead meta="anatomy">Anatomy</SubHead>
        <div className="ds-frame">
          <div className="ds-frame-head"><span className="label">Field structure — label · group · helpers + counter</span></div>
          <div className="ds-frame-body" style={{padding: '64px 36px 56px'}}>
            <div className="ana" style={{display:'flex', justifyContent:'center'}}>
              <div className="stage" style={{position:'relative', width: 460}} aria-hidden="true">
                <Field
                  htmlFor="ana"
                  label="Project name" required
                  help="Lowercase, hyphenated. 3–32 chars."
                  counter="13 / 32"
                >
                  <Group>
                    <span className="in-addon icon"><Icons.folder size={14}/></span>
                    <input id="ana" className="in-control" defaultValue="identity-svc" tabIndex={-1} style={{cursor:'default'}}/>
                    <button type="button" className="in-addon btn" aria-label="Field info" tabIndex={-1} style={{cursor:'default'}}>
                      <Icons.info size={14}/>
                    </button>
                  </Group>
                </Field>
                {/* Leader lines */}
                <span className="lead v" style={{top: -22, left: 40, height: 18}}/>
                <span className="lead v" style={{top: 4, left: '50%', height: 18}}/>
                <span className="lead h" style={{top: 44, right: -28, width: 24}}/>
                <span className="lead h" style={{top: 44, left: -28, width: 24}}/>
                <span className="lead v" style={{bottom: -22, left: '50%', height: 18, transform:'translateX(-50%)'}}/>
                {/* Numbered pins overlaid */}
                <div className="pin" style={{top: -42, left: 40, transform:'translateX(-50%)'}}>1</div>
                <div className="pin" style={{top: -22, left: '50%', transform:'translateX(-50%)'}}>2</div>
                <div className="pin" style={{top: 36, left: -52}}>3</div>
                <div className="pin" style={{top: 36, right: -52}}>4</div>
                <div className="pin" style={{bottom: -42, left: '50%', transform:'translateX(-50%)'}}>5</div>
              </div>
            </div>
            <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
              <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Label.</b> <code style={CODE_INK_XS}>.in-label</code> with optional <code style={CODE_INK_XS}>.required-mark</code> or <code style={CODE_INK_XS}>.opt</code>.</span>
              <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Group shell.</b> <code style={CODE_INK_XS}>.in-group</code> houses every part. The whole shell lights up on focus.</span>
              <span className="num">3</span><span><b style={{color:'var(--fg)'}}>Addons.</b> <code style={CODE_INK_XS}>.in-addon</code> with modifier (<code style={CODE_INK_XS}>icon · text · btn · select · spinner</code>) on either side.</span>
              <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Control.</b> <code style={CODE_INK_XS}>.in-control</code> is a borderless, ring-less <code style={CODE_INK_XS}>&lt;input&gt;</code>. Group paints chrome.</span>
              <span className="num">5</span><span><b style={{color:'var(--fg)'}}>Helper row.</b> <code style={CODE_INK_XS}>.in-help</code> / <code style={CODE_INK_XS}>.in-error</code> on the start, optional <code style={CODE_INK_XS}>.in-counter</code> on the end.</span>
            </div>
          </div>
        </div>
        <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', marginTop: 14, maxWidth:'72ch'}}>
          The group is what gets the focus ring — the inner <code style={CODE_INK}>&lt;input&gt;</code> stays silent. That keeps every variant on this page visually consistent: a single ember outline around the whole composition, no matter how many addons live inside.
        </p>

        {/* ─── Decision matrix ─── */}
        <SubHead meta="when to reach for what">When to use</SubHead>
        <Frame label="Pick the right primitive — Input vs neighbours">
          <div className="ds-grid cols-2" style={{width:'100%'}}>
            <div className="surface" style={{padding: 14}}>
              <div style={{fontWeight: 600, marginBottom: 6}}>Input</div>
              <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', margin: 0, lineHeight: 1.55}}>
                Free text, numbers, codes, and URLs. The default for any value the user types from scratch.
              </p>
            </div>
            <div className="surface" style={{padding: 14}}>
              <div style={{fontWeight: 600, marginBottom: 6}}>Select</div>
              <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', margin: 0, lineHeight: 1.55}}>
                A short, fixed list (≤ 10) where scanning is faster than typing — tiers, statuses, units.
              </p>
            </div>
            <div className="surface" style={{padding: 14}}>
              <div style={{fontWeight: 600, marginBottom: 6}}>Combobox</div>
              <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', margin: 0, lineHeight: 1.55}}>
                Long list, multi-select with chips, free entry, or grouped options. The high-density picker.
              </p>
            </div>
            <div className="surface" style={{padding: 14}}>
              <div style={{fontWeight: 600, marginBottom: 6}}>Textarea</div>
              <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', margin: 0, lineHeight: 1.55}}>
                Multi-line content — descriptions, summaries, change notes. See <a href="/forms" style={{color:'var(--ember)'}}>Forms</a>.
              </p>
            </div>
          </div>
        </Frame>

        {/* Do / Don't */}
        <SubHead meta="rules">Do / Don't</SubHead>
        <div className="dd-grid">
          <div className="dd-card do">
            <div className="head"><Icons.check size={12}/> Do — label every field above the input</div>
            <div className="body">
              <div className="in-field" style={{width: 220}}>
                <label className="in-label">Email</label>
                <div className="in-group"><input className="in-control" placeholder="you@company.com" readOnly/></div>
              </div>
            </div>
            <div className="note">Persistent labels stay visible while typing. Pair every field with a real <code style={{fontFamily:'var(--font-mono)', color:'var(--fg-muted)'}}>&lt;label&gt;</code>.</div>
          </div>
          <div className="dd-card dont">
            <div className="head"><Icons.x size={12}/> Don't — use placeholder as the only label</div>
            <div className="body">
              <div className="in-field" style={{width: 220}}>
                <div className="in-group"><input className="in-control" placeholder="Email" readOnly/></div>
              </div>
            </div>
            <div className="note">Label disappears the moment the user types. Screen readers may not announce it.</div>
          </div>

          <div className="dd-card do">
            <div className="head"><Icons.check size={12}/> Do — match type + inputMode to the data</div>
            <div className="body" style={{flexDirection:'column', gap: 8}}>
              <div className="in-field" style={{width: 220}}>
                <label className="in-label">Email</label>
                <div className="in-group"><input className="in-control" type="email" inputMode="email" placeholder="you@company.com" readOnly/></div>
              </div>
              <div className="in-field" style={{width: 220}}>
                <label className="in-label">Verification code</label>
                <div className="in-group"><input className="in-control" inputMode="numeric" pattern="[0-9]*" placeholder="123456" readOnly/></div>
              </div>
            </div>
            <div className="note">Mobile keyboards adapt; native validation works; password managers can autofill.</div>
          </div>
          <div className="dd-card dont">
            <div className="head"><Icons.x size={12}/> Don't — default everything to type="text"</div>
            <div className="body" style={{flexDirection:'column', gap: 8}}>
              <div className="in-field" style={{width: 220}}>
                <label className="in-label">Email</label>
                <div className="in-group"><input className="in-control" type="text" placeholder="you@company.com" readOnly/></div>
              </div>
              <div className="in-field" style={{width: 220}}>
                <label className="in-label">Verification code</label>
                <div className="in-group"><input className="in-control" type="text" placeholder="123456" readOnly/></div>
              </div>
            </div>
            <div className="note">Mobile users get QWERTY for a 4-digit code; forms lose free validation; managers can't autofill.</div>
          </div>

          <div className="dd-card do">
            <div className="head"><Icons.check size={12}/> Do — wire autoComplete for known fields</div>
            <div className="body" style={{flexDirection:'column', gap: 8}}>
              <div className="in-field" style={{width: 220}}>
                <label className="in-label">Full name</label>
                <div className="in-group"><input className="in-control" autoComplete="name" placeholder="Ada Lovelace" readOnly/></div>
              </div>
              <div className="in-field" style={{width: 220}}>
                <label className="in-label">Password</label>
                <div className="in-group"><input className="in-control" type="password" autoComplete="current-password" placeholder="••••••••" readOnly/></div>
              </div>
            </div>
            <div className="note">"name", "email", "current-password", "one-time-code" — the browser fills them safely.</div>
          </div>
          <div className="dd-card dont">
            <div className="head"><Icons.x size={12}/> Don't — blanket autoComplete="off" on every field</div>
            <div className="body" style={{flexDirection:'column', gap: 8}}>
              <div className="in-field" style={{width: 220}}>
                <label className="in-label">Full name</label>
                <div className="in-group"><input className="in-control" autoComplete="off" placeholder="Ada Lovelace" readOnly/></div>
              </div>
              <div className="in-field" style={{width: 220}}>
                <label className="in-label">Password</label>
                <div className="in-group"><input className="in-control" type="password" autoComplete="off" placeholder="••••••••" readOnly/></div>
              </div>
            </div>
            <div className="note">Hostile to password-manager users; breaks autofill. Use "off" only for one-shot security values.</div>
          </div>

          <div className="dd-card do">
            <div className="head"><Icons.check size={12}/> Do — anchor the focus ring to the group</div>
            <div className="body">
              <div className="in-field" style={{width: 240}}>
                <label className="in-label">Domain</label>
                <div className="in-group is-focused">
                  <span className="in-addon text">https://</span>
                  <input className="in-control" defaultValue="acme" tabIndex={-1} readOnly/>
                  <span className="in-addon text">.io</span>
                </div>
              </div>
            </div>
            <div className="note">The whole composition lights up as one — addons and control read as a single unit.</div>
          </div>
          <div className="dd-card dont">
            <div className="head"><Icons.x size={12}/> Don't — paint two rings (group + control)</div>
            <div className="body">
              <div className="in-field" style={{width: 240}}>
                <label className="in-label">Domain</label>
                <div className="in-group is-focused">
                  <span className="in-addon text">https://</span>
                  <input className="in-control" defaultValue="acme" tabIndex={-1} readOnly style={{boxShadow:'0 0 0 2px var(--ember-soft)', borderRadius: 'var(--radius-sm)'}}/>
                  <span className="in-addon text">.io</span>
                </div>
              </div>
            </div>
            <div className="note">Doubles the visual noise on focus. Suppress sub-component rings; the group's ring is canonical.</div>
          </div>

          <div className="dd-card do">
            <div className="head"><Icons.check size={12}/> Do — show errors next to the field, with a specific reason</div>
            <div className="body">
              <div className="in-field" style={{width: 280}}>
                <label className="in-label">Domain</label>
                <div className="in-group is-invalid">
                  <input className="in-control" defaultValue="acme.com" readOnly/>
                </div>
                <div className="in-helprow"><span className="in-error"><Icons.alert size={11}/> Domain must end in .io</span></div>
              </div>
            </div>
            <div className="note">Inline error + danger ring tells the user exactly where to look and why.</div>
          </div>
          <div className="dd-card dont">
            <div className="head"><Icons.x size={12}/> Don't — hide validation in a top banner</div>
            <div className="body" style={{flexDirection:'column', gap: 10}}>
              <div className="alert danger" style={{width: 280}}>
                <div className="alert-body"><span style={{fontWeight: 500}}>Invalid input</span></div>
              </div>
              <div className="in-field" style={{width: 280}}>
                <label className="in-label">Domain</label>
                <div className="in-group"><input className="in-control" defaultValue="acme.com" readOnly/></div>
              </div>
            </div>
            <div className="note">User must scan the form, then guess what's wrong. Generic "Invalid" tells them nothing.</div>
          </div>

          <div className="dd-card do">
            <div className="head"><Icons.check size={12}/> Do — pick one mark convention per form</div>
            <div className="body" style={{flexDirection:'column', gap: 8}}>
              <div className="in-field" style={{width: 220}}>
                <label className="in-label">Email <span className="required-mark">*</span></label>
                <div className="in-group"><input className="in-control" placeholder="you@company.com" readOnly/></div>
              </div>
              <div className="in-field" style={{width: 220}}>
                <label className="in-label">Password <span className="required-mark">*</span></label>
                <div className="in-group"><input className="in-control" type="password" placeholder="••••••••" readOnly/></div>
              </div>
            </div>
            <div className="note">Either mark required with <code style={{fontFamily:'var(--font-mono)', color:'var(--fg-muted)'}}>*</code> or optional with <em>(optional)</em>. Pick the rarer one.</div>
          </div>
          <div className="dd-card dont">
            <div className="head"><Icons.x size={12}/> Don't — mix required and optional marks</div>
            <div className="body" style={{flexDirection:'column', gap: 8}}>
              <div className="in-field" style={{width: 220}}>
                <label className="in-label">Email <span className="required-mark">*</span></label>
                <div className="in-group"><input className="in-control" placeholder="you@company.com" readOnly/></div>
              </div>
              <div className="in-field" style={{width: 220}}>
                <label className="in-label">Phone <span className="opt">(optional)</span></label>
                <div className="in-group"><input className="in-control" placeholder="+1 555 123 4567" readOnly/></div>
              </div>
            </div>
            <div className="note">Forces users to scan every field. Mixed conventions visually compete.</div>
          </div>
        </div>

        {/* 4. API REFERENCE */}
        <SubHead meta="InputProps">API reference</SubHead>
        <AutoPropsTable component="Input" label="<Input />"/>
      </Section>
    );
  };

export default InputPage;
