'use client';
// Eidos DS — Components / File Input.
//
// Upload + manage files. Built from a drag-and-drop zone wrapping a hidden
// `<input type="file">` plus a list of selected files with thumbnails,
// progress, and remove actions.
//
// All state is in-memory — wire `onFilesChange` to your real upload pipeline
// (XHR/fetch with `FormData`, signed S3 PUT, etc.) and call back into the
// progress / status setters provided.
import * as React from 'react';
import { Icons, Frame, CodeBlock, Section, SubHead, TabbedCode, AutoPropsTable, installTabs, Lede, Mono, Spinner } from '@/ds/core';


  const USAGE_CODE = `import { FileInput } from "@/components/forge/file-input"

export function Demo() {
  return (
    <FileInput
      accept="image/*"
      maxSize={5 * 1024 * 1024}
      onFilesChange={(files) => console.log(files)}
    />
  )
}`;


  // ─── Helpers ────────────────────────────────────────────────────────────
  const formatBytes = (b) => {
    if (!b) return '0 B';
    const u = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    while (b >= 1024 && i < u.length - 1) { b /= 1024; i++; }
    return (i === 0 ? b.toFixed(0) : b.toFixed(1)) + ' ' + u[i];
  };
  const isImage = (f) => f.type && f.type.startsWith('image/');
  const fileExt = (f) => (f.name || '').split('.').pop().toLowerCase();
  const fileIcon = (f) => {
    if (isImage(f)) return Icons.image;
    const ext = fileExt(f);
    if (['mp4','mov','webm','mkv'].includes(ext)) return Icons.video;
    if (['mp3','wav','flac','m4a'].includes(ext)) return Icons.music;
    if (['zip','tar','gz','rar','7z'].includes(ext)) return Icons.folder;
    return Icons.file;
  };

  // ─── DropZone — large hero variant ──────────────────────────────────────
  const DropZone = ({ onFiles, accept, multiple=false, maxSize, helpText, compact=false }: {
    onFiles?: (files: File[]) => void;
    accept?: string;
    multiple?: boolean;
    maxSize?: number;
    helpText?: React.ReactNode;
    compact?: boolean;
  }) => {
    const [drag, setDrag] = React.useState(false);
    const inputRef = React.useRef(null);
    const onDragOver = (e) => { e.preventDefault(); setDrag(true); };
    const onDragLeave = (e) => { e.preventDefault(); setDrag(false); };
    const onDrop = (e) => {
      e.preventDefault(); setDrag(false);
      const files = Array.from(e.dataTransfer.files) as File[];
      onFiles && onFiles(files);
    };
    const onPick = (e) => {
      const files = Array.from(e.target.files || []) as File[];
      onFiles && onFiles(files);
      e.target.value = ''; // reset so same file can be picked twice
    };
    return (
      <label className={'in-drop' + (drag ? ' is-dragging' : '') + (compact ? ' compact' : '')}
        onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
      >
        <span className="in-drop-icon"><Icons.upload size={18}/></span>
        <div style={compact ? {flex: 1} : undefined}>
          <div className="in-drop-title">
            <span className="in-drop-link">Click to upload</span> or drag and drop
          </div>
          <div className="in-drop-meta">
            {helpText || (
              <>
                {accept && <>{accept.replace(/\*/g, '').replace(/[/.]/g, '').toUpperCase().split(',').filter(Boolean).slice(0,5).join(' · ') || 'Any file'}</>}
                {maxSize && <> · up to {formatBytes(maxSize)}</>}
              </>
            )}
          </div>
        </div>
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} onChange={onPick}/>
      </label>
    );
  };

  // ─── FileItem — one row in the file list ────────────────────────────────
  const FileItem = ({ file, progress, status, error, onRemove }: {
    file: File;
    progress?: number;
    status?: string;
    error?: string;
    onRemove?: () => void;
  }) => {
    // Generate object URL for image previews
    const [previewUrl, setPreviewUrl] = React.useState(null);
    React.useEffect(() => {
      if (isImage(file)) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
      }
    }, [file]);
    const Ic = fileIcon(file);
    const statusClass = status === 'error' ? ' is-error' : (status === 'success' ? ' is-success' : '');
    return (
      <div className={'in-file' + statusClass}>
        <span className="in-file-thumb">
          {status === 'uploading'
            ? <Spinner size={18} aria-label={'Uploading ' + file.name}/>
            : previewUrl ? <img src={previewUrl} alt=""/> : <Ic size={18}/>}
        </span>
        <div className="in-file-body">
          <div className="in-file-name" title={file.name}>{file.name}</div>
          <div className="in-file-meta">
            {formatBytes(file.size)}
            {status === 'uploading' && progress !== undefined && <> · {progress}%</>}
            {status === 'success' && <> · <span style={{color:'var(--success)'}}>Uploaded</span></>}
            {status === 'error' && error && <> · <span style={{color:'var(--danger)'}}>{error}</span></>}
          </div>
          {(status === 'uploading' || status === 'success' || status === 'error') && (() => {
            const pct = progress ?? (status === 'success' ? 100 : 0);
            return (
              <div className="in-file-progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={'Upload progress for ' + file.name}>
                <span style={{width: pct + '%'}}/>
              </div>
            );
          })()}
        </div>
        <button type="button" className="in-file-x" onClick={onRemove} aria-label={'Remove ' + file.name}>
          <Icons.x size={14}/>
        </button>
      </div>
    );
  };

  // ─── Single-file uploader (avatar-style) ────────────────────────────────
  const SingleFileUploader = ({ accept='image/*', maxSize=5*1024*1024 }) => {
    const [file, setFile] = React.useState(null);
    const [error, setError] = React.useState('');
    const onFiles = (files) => {
      const f = files[0];
      if (!f) return;
      if (maxSize && f.size > maxSize) {
        setError(`File too large — max ${formatBytes(maxSize)}`);
        return;
      }
      setError(''); setFile(f);
    };
    return (
      <div>
        {!file ? (
          <DropZone accept={accept} maxSize={maxSize} onFiles={onFiles}/>
        ) : (
          <FileItem file={file} status="success" onRemove={() => setFile(null)}/>
        )}
        {error && <div className="in-error" role="alert" aria-live="assertive" style={{marginBlockStart: 8}}><Icons.alert size={12}/>{error}</div>}
      </div>
    );
  };

  // ─── Multi-file uploader with simulated progress ────────────────────────
  // For demo only — onUpload fakes progress over ~2s. Wire to your real upload
  // pipeline in production.
  const MultiFileUploader = ({ accept='image/*,application/pdf', maxSize=10*1024*1024 }) => {
    const [items, setItems] = React.useState([]); // { id, file, status, progress, error }
    const [error, setError] = React.useState('');
    const [justPasted, setJustPasted] = React.useState(false);
    const idRef = React.useRef(0);
    const pasteTimer = React.useRef(null);

    const onFiles = (files) => {
      setError('');
      const accepted = [];
      const rejected = [];
      for (const f of files) {
        if (maxSize && f.size > maxSize) { rejected.push(`${f.name} too large`); continue; }
        accepted.push(f);
      }
      if (rejected.length) setError(rejected.join(' · '));
      const next = accepted.map(f => ({ id: ++idRef.current, file: f, status: 'uploading', progress: 0 }));
      setItems(prev => [...prev, ...next]);
      next.forEach(item => simulateUpload(item.id));
    };

    // Innovation: paste-to-upload. Cmd/Ctrl+V drops a clipboard image straight
    // into the list — the real product affordance for screenshots & copied art.
    const onPaste = (e) => {
      const pasted = Array.from(e.clipboardData?.files || []) as File[];
      if (pasted.length) {
        e.preventDefault();
        onFiles(pasted);
        setJustPasted(true);
        if (pasteTimer.current) clearTimeout(pasteTimer.current);
        pasteTimer.current = setTimeout(() => setJustPasted(false), 1600);
      }
    };
    React.useEffect(() => () => { if (pasteTimer.current) clearTimeout(pasteTimer.current); }, []);

    const simulateUpload = (id) => {
      let pct = 0;
      const step = () => {
        pct += 8 + Math.random() * 12;
        if (pct >= 100) pct = 100;
        setItems(prev => prev.map(it => it.id === id ? { ...it, progress: Math.round(pct) } : it));
        if (pct < 100) setTimeout(step, 140);
        else setItems(prev => prev.map(it => it.id === id ? { ...it, status: 'success', progress: 100 } : it));
      };
      setTimeout(step, 140);
    };

    const remove = (id) => setItems(prev => prev.filter(it => it.id !== id));

    const uploading = items.filter(it => it.status === 'uploading').length;
    const done = items.filter(it => it.status === 'success').length;

    return (
      <div onPaste={onPaste}>
        <DropZone accept={accept} multiple maxSize={maxSize} onFiles={onFiles}
          helpText={<>PNG, JPG, PDF up to 10 MB · or paste <span className="kbd-chord"><span className="kbd">⌘</span><span className="kbd">V</span></span></>}
        />
        {justPasted && (
          <div aria-hidden="true" style={{
            marginBlockStart: 8, fontSize:'var(--text-xs)', fontFamily:'var(--font-mono)',
            letterSpacing:'0.04em', color:'var(--ember)',
            display:'inline-flex', alignItems:'center', gap: 6,
          }}>
            <Icons.check size={11}/> Pasted from clipboard
          </div>
        )}
        {error && <div className="in-error" role="alert" aria-live="assertive" style={{marginBlockStart: 8}}><Icons.alert size={12}/>{error}</div>}
        {/* Live region: announces in-flight progress + paste without moving focus */}
        <div role="status" aria-live="polite" style={{position:'absolute', width:1, height:1, overflow:'hidden', clip:'rect(0,0,0,0)', whiteSpace:'nowrap'}}>
          {uploading > 0 ? `Uploading ${uploading} ${uploading === 1 ? 'file' : 'files'}` : done > 0 ? `${done} ${done === 1 ? 'file' : 'files'} uploaded` : ''}
        </div>
        {items.length > 0 && (
          <div className="in-files">
            {items.map(it => (
              <FileItem key={it.id} file={it.file} progress={it.progress} status={it.status} error={it.error} onRemove={() => remove(it.id)}/>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ─── Compact uploader (button-style, no dropzone) ───────────────────────
  const CompactUploader = ({ accept }: { accept?: string }) => {
    const [files, setFiles] = React.useState([]);
    const inputRef = React.useRef(null);
    const onPick = (e) => {
      const next = Array.from(e.target.files || []);
      setFiles(prev => [...prev, ...next]);
      e.target.value = '';
    };
    return (
      <div>
        <button type="button" className="btn outline" onClick={() => inputRef.current && inputRef.current.click()}>
          <Icons.paperclip size={13}/> Attach files
        </button>
        <input ref={inputRef} type="file" accept={accept} multiple style={{display:'none'}} onChange={onPick}/>
        {files.length > 0 && (
          <div className="in-files" style={{marginBlockStart: 12}}>
            {files.map((f, i) => (
              <FileItem key={i} file={f} status="success" onRemove={() => setFiles(prev => prev.filter((_, j) => j !== i))}/>
            ))}
          </div>
        )}
      </div>
    );
  };

  const CODE_BASIC = [
    `<FileInput`,
    `  accept="image/*"`,
    `  maxSize={5 * 1024 * 1024}`,
    `  helpText="PNG, JPG up to 5 MB"`,
    `  onFilesChange={(files) => upload(files)}`,
    `/>`,
    ``,
    `// Drag-and-drop + click-to-pick out of the box.`,
    `// The dropzone toggles .is-dragging on hover.`,
  ].join('\n');

  const CODE_MULTI = [
    `<FileInput`,
    `  multiple`,
    `  accept="image/*,application/pdf"`,
    `  maxSize={10 * 1024 * 1024}`,
    `  helpText="PNG, JPG, PDF up to 10 MB"`,
    `  onFilesChange={async (files) => {`,
    `    for (const f of files) {`,
    `      await upload(f, { onProgress: (p) => setProgress(f, p) })`,
    `    }`,
    `  }}`,
    `/>`,
  ].join('\n');

  // ─── Page ───────────────────────────────────────────────────────────────
  const FilePage = () => {
    return (
      <Section
        id="file-input"
        num="16"
        title="File Input"
        desc="Drag-and-drop or click-to-upload. One file or many. Inline thumbnails, per-file progress, validation, and removable items."
      >
        {/* 1. INSTALLATION */}
        <SubHead meta="package managers">Installation</SubHead>
        <TabbedCode tabs={installTabs('file-input')} ariaLabel="package manager"/>
        <Lede>
          Ships <Mono>file-input.tsx</Mono> — drag-and-drop zone, click-to-pick, accept filtering, per-file progress + remove rows. Wire <Mono>onFilesChange</Mono> to your upload pipeline.
        </Lede>

        {/* 2. USAGE */}
        <SubHead meta="hello world">Usage</SubHead>
        <Frame label="basic" code={USAGE_CODE}>
          <div style={{width:'100%', maxWidth: 460}}>
            <SingleFileUploader accept="image/*" maxSize={5*1024*1024}/>
          </div>
        </Frame>

        {/* 3. EXAMPLES */}
        <div style={{
          marginBlockStart: 40, marginBlockEnd: 8,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--fg-faint)',
          }}>Examples</span>
          <span style={{ flex: 1, blockSize: 1, background: 'var(--border)' }}/>
        </div>

        <p className="t-small" style={{color:'var(--fg-muted)', maxWidth:'72ch', marginBlockEnd: 24, lineHeight: 1.6}}>
          Built from a styled <Mono>{`<label>`}</Mono> wrapping a hidden <Mono>{`<input type="file">`}</Mono> — full keyboard / screen-reader / form-submit semantics for free, our chrome painted on top. The dropzone toggles its <Mono>.is-dragging</Mono> state on <Mono>onDragOver</Mono> / <Mono>onDrop</Mono>. Per-file progress is yours to wire — a hook into <Mono>fetch</Mono> / <Mono>XMLHttpRequest</Mono> with <Mono>FormData</Mono> + <Mono>onprogress</Mono>.
        </p>

        {/* Single-file */}
        <SubHead meta="one file · click or drop">Single file</SubHead>
        <Frame label="The simplest form — one file in, replace or remove" code={CODE_BASIC}>
          <div style={{width:'100%', maxWidth: 460}}>
            <label className="in-label" htmlFor="sf1">Avatar</label>
            <SingleFileUploader accept="image/*" maxSize={5*1024*1024}/>
            <div className="in-help" style={{marginBlockStart: 8}}>PNG or JPG, up to 5 MB. Try dropping an image to see the preview.</div>
          </div>
        </Frame>

        {/* Multi-file */}
        <SubHead meta="many files · progress">Multiple files</SubHead>
        <Frame label="Drop several at once — each gets its own row with progress" code={CODE_MULTI}>
          <div style={{width:'100%', maxWidth: 600}}>
            <label className="in-label">Attachments</label>
            <MultiFileUploader/>
            <div className="in-help" style={{marginBlockStart: 8}}>This demo simulates a 1.5–2s upload per file — drop several, or click inside and paste a screenshot with <Mono>⌘V</Mono>. Wire to your real pipeline with <Mono>fetch</Mono> + <Mono>FormData</Mono>.</div>
          </div>
        </Frame>

        {/* Compact */}
        <SubHead meta="button trigger · attach">Compact (button-style)</SubHead>
        <Frame label="When the dropzone is too prominent — chat composers, comment threads, ticket forms">
          <div style={{width:'100%', maxWidth: 600}}>
            <label className="in-label">Reply</label>
            <div style={{padding: 12, border:'1px solid var(--border)', borderRadius: 'var(--radius-xl)', background:'var(--surface)'}}>
              <textarea placeholder="Type your reply…" style={{width:'100%', border:'none', outline:'none', background:'transparent', resize:'vertical', minBlockSize: 64, color:'var(--fg)', fontFamily:'inherit', fontSize: 'var(--text-base)', lineHeight: 1.5}}/>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBlockStart: 12, paddingBlockStart: 12, borderBlockStart:'1px solid var(--border)'}}>
                <CompactUploader/>
                <button type="button" className="btn ember">Send <Icons.arrowRight size={13}/></button>
              </div>
            </div>
          </div>
        </Frame>

        {/* Compact dropzone */}
        <SubHead meta="inline · dense">Compact dropzone</SubHead>
        <Frame label="When you have less vertical space — sidesheets, dense forms">
          <div style={{width:'100%', maxWidth: 600}}>
            <label className="in-label">Logo</label>
            <DropZone compact accept="image/*" helpText="PNG / JPG / SVG · max 2 MB" onFiles={()=>{}}/>
          </div>
        </Frame>

        {/* Accept restrictions */}
        <SubHead meta="accept · MIME / extension">Type restrictions</SubHead>
        <Frame label="The accept attribute filters the picker dialog AND validates the drop">
          <div className="ds-grid cols-2" style={{width:'100%'}}>
            <div>
              <label className="in-label">Images only</label>
              <DropZone compact accept="image/*" helpText="JPG · PNG · GIF · WebP" onFiles={()=>{}}/>
            </div>
            <div>
              <label className="in-label">PDF only</label>
              <DropZone compact accept="application/pdf,.pdf" helpText="PDF only · max 25 MB" onFiles={()=>{}}/>
            </div>
            <div>
              <label className="in-label">CSV / Excel</label>
              <DropZone compact accept=".csv,.xlsx,.xls" helpText="CSV · XLSX · XLS" onFiles={()=>{}}/>
            </div>
            <div>
              <label className="in-label">Any file</label>
              <DropZone compact helpText="No restriction · max 100 MB" onFiles={()=>{}}/>
            </div>
          </div>
        </Frame>
        <p className="t-small" style={{color:'var(--fg-muted)', marginBlockStart: 16, maxWidth:'72ch', lineHeight: 1.6}}>
          <Mono>accept</Mono> takes a comma-separated list of MIME types (<Mono>image/*</Mono>, <Mono>application/pdf</Mono>) and/or extensions (<Mono>.pdf</Mono>, <Mono>.csv</Mono>). Always combine — some OS file pickers honour MIME, some honour extensions, and a few legacy clients still need extensions to filter the dialog.
        </p>

        {/* States */}
        <SubHead meta="states">States</SubHead>
        <Frame label="Empty · idle · dragging · uploading · invalid · success · error · disabled">
          <div className="ds-grid cols-2" style={{width:'100%'}}>
            <div>
              <label className="in-label">Empty (no files yet)</label>
              <div className="surface" style={{display:'flex', alignItems:'center', gap: 12, padding: 16, color:'var(--fg-faint)'}}>
                <Icons.inbox size={18}/>
                <span style={{fontSize:'var(--text-sm)'}}>No files attached</span>
              </div>
            </div>
            <div>
              <label className="in-label">Idle</label>
              <DropZone compact onFiles={()=>{}}/>
            </div>
            <div>
              <label className="in-label">Dragging (forced)</label>
              <label className="in-drop compact is-dragging">
                <span className="in-drop-icon"><Icons.upload size={18}/></span>
                <div style={{flex: 1}}>
                  <div className="in-drop-title">Drop files to upload</div>
                  <div className="in-drop-meta">Release to add to the list</div>
                </div>
              </label>
            </div>
            <div>
              <label className="in-label">Invalid (rejected on drop)</label>
              <label className="in-drop compact is-invalid">
                <span className="in-drop-icon" style={{color:'var(--danger)', borderColor:'var(--danger)'}}><Icons.alert size={18}/></span>
                <div style={{flex: 1}}>
                  <div className="in-drop-title">Wrong file type</div>
                  <div className="in-drop-meta" style={{color:'var(--danger)'}}>Accepts images only</div>
                </div>
              </label>
            </div>
            <div>
              <label className="in-label">Uploading</label>
              <div className="in-file">
                <span className="in-file-thumb"><Spinner size={18} aria-label="Uploading brand-mark-2024.png"/></span>
                <div className="in-file-body">
                  <div className="in-file-name">brand-mark-2024.png</div>
                  <div className="in-file-meta">2.3 MB · 64%</div>
                  <div className="in-file-progress" role="progressbar" aria-valuenow={64} aria-valuemin={0} aria-valuemax={100} aria-label="Upload progress for brand-mark-2024.png"><span style={{width:'64%'}}/></div>
                </div>
                <button type="button" className="in-file-x" aria-label="Cancel upload"><Icons.x size={14}/></button>
              </div>
            </div>
            <div>
              <label className="in-label">Success</label>
              <div className="in-file is-success">
                <span className="in-file-thumb"><Icons.image size={18}/></span>
                <div className="in-file-body">
                  <div className="in-file-name">brand-mark-2024.png</div>
                  <div className="in-file-meta">2.3 MB · <span style={{color:'var(--success)'}}>Uploaded</span></div>
                  <div className="in-file-progress"><span style={{width:'100%'}}/></div>
                </div>
                <button type="button" className="in-file-x" aria-label="Remove"><Icons.x size={14}/></button>
              </div>
            </div>
            <div>
              <label className="in-label">Error</label>
              <div className="in-file is-error">
                <span className="in-file-thumb"><Icons.alert size={18} color="var(--danger)"/></span>
                <div className="in-file-body">
                  <div className="in-file-name">large-export.csv</div>
                  <div className="in-file-meta">28.4 MB · <span style={{color:'var(--danger)'}}>Too large — max 10 MB</span></div>
                  <div className="in-file-progress"><span style={{width:'100%'}}/></div>
                </div>
                <button type="button" className="in-file-x" aria-label="Remove"><Icons.x size={14}/></button>
              </div>
            </div>
            <div>
              <label className="in-label">Disabled</label>
              <label className="in-drop compact" aria-disabled="true" style={{opacity: 0.5, pointerEvents:'none'}}>
                <span className="in-drop-icon"><Icons.upload size={18}/></span>
                <div style={{flex: 1}}>
                  <div className="in-drop-title">Upload disabled</div>
                  <div className="in-drop-meta">Read-only — owned upstream</div>
                </div>
              </label>
            </div>
          </div>
        </Frame>

        {/* Accessibility */}
        <SubHead meta="a11y">Accessibility</SubHead>
        <div className="surface" style={{padding: 18, marginBlockStart: 12}}>
          <div style={{fontWeight: 600, marginBlockEnd: 12}}>Keyboard map</div>
          <table style={{width:'100%', borderCollapse:'collapse', fontSize:'var(--text-base)'}}>
            <tbody>
              {[
                [['Tab'], 'Move to the dropzone, then to each remove button in DOM order'],
                [['Space'], 'Open the native file picker when the dropzone is focused'],
                [['Enter'], 'Open the native file picker (same as Space)'],
                [['Enter'], 'Remove the row when a file’s remove button is focused', 'or-space'],
                [['⌘','V'], 'Paste an image from the clipboard straight into the list'],
                [['Esc'], 'Dismiss the native picker dialog (browser-owned)'],
              ].map(([keys, action, variant], i) => (
                <tr key={i} style={{borderBlockStart: i === 0 ? 'none' : '1px solid var(--border)'}}>
                  <td style={{paddingBlock:'8px', paddingInlineEnd:'16px', whiteSpace:'nowrap', verticalAlign:'top'}}>
                    <span className="kbd-chord">
                      {(keys as string[]).map(k => <span key={k} className="kbd">{k}</span>)}
                      {variant === 'or-space' && <><span style={{color:'var(--fg-faint)', paddingInline:'4px'}}>/</span><span className="kbd">Space</span></>}
                    </span>
                  </td>
                  <td style={{paddingBlock:'8px', color:'var(--fg-muted)', lineHeight: 1.5}}>{action as string}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="ds-grid cols-2" style={{marginBlockStart: 12}}>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBlockEnd: 6}}>Roles &amp; names</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The dropzone is a real <Mono>&lt;label&gt;</Mono> wrapping a hidden <Mono>&lt;input type="file"&gt;</Mono>, so it keeps the native file role and is named by the field label plus help text. Each per-file progress bar is a <Mono>role="progressbar"</Mono> with <Mono>aria-valuenow</Mono>/<Mono>min</Mono>/<Mono>max</Mono> and a per-file <Mono>aria-label</Mono>; every remove control carries an explicit <Mono>aria-label</Mono> ("Remove <em>filename</em>"). A disabled zone sets <Mono>aria-disabled="true"</Mono>.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBlockEnd: 6}}>Live regions</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>Validation rejections render as <Mono>role="alert"</Mono> (<Mono>aria-live="assertive"</Mono>) so the specific reason is announced the moment a file is refused. Batch progress is mirrored in a visually-hidden <Mono>role="status"</Mono> (<Mono>aria-live="polite"</Mono>) that announces "Uploading <em>n</em> files" → "<em>n</em> files uploaded" without moving focus.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBlockEnd: 6}}>Focus &amp; contrast</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The dropzone (<Mono>:focus-within</Mono>) and every remove button (<Mono>:focus-visible</Mono>) show the shared offset focus ring. Drag-over, invalid, success, and error never rely on colour alone — an icon and a text label carry the same meaning — and all states clear AA against the field surface.</div>
          </div>
          <div className="surface" style={{padding: 18}}>
            <div style={{fontWeight: 600, marginBlockEnd: 6}}>Motion</div>
            <div style={{color: 'var(--fg-muted)', fontSize: 'var(--text-base)', lineHeight: 1.55}}>The progress-bar fill, the spinner, and the drag-over tint are short token transitions. Under <Mono>prefers-reduced-motion: reduce</Mono> they resolve to the final state — the bar still reflects the true value, it just stops animating.</div>
          </div>
        </div>

        {/* RTL */}
        <SubHead meta="RTL · العربية">RTL</SubHead>
        <Frame label="dir=&quot;rtl&quot; — icon, text, and remove buttons all flip">
          <div dir="rtl" style={{width:'100%', maxWidth: 600}}>
            <label className="in-label">المرفقات (Attachments)</label>
            <DropZone compact accept="image/*" helpText="PNG · JPG · حتى ٥ ميغابايت" onFiles={()=>{}}/>
            <div className="in-files">
              <div className="in-file is-success">
                <span className="in-file-thumb"><Icons.image size={18}/></span>
                <div className="in-file-body">
                  <div className="in-file-name">شعار-2024.png</div>
                  <div className="in-file-meta">٢٫٣ ميغابايت · <span style={{color:'var(--success)'}}>تم الرفع</span></div>
                  <div className="in-file-progress"><span style={{width:'100%'}}/></div>
                </div>
                <button type="button" className="in-file-x" aria-label="إزالة"><Icons.x size={14}/></button>
              </div>
            </div>
          </div>
        </Frame>

        {/* Anatomy */}
        <SubHead meta="anatomy">Anatomy</SubHead>
        <div className="ds-frame">
          <div className="ds-frame-head"><span className="label">Dropzone · file list — both share the same surface vocabulary as Input</span></div>
          <div className="ds-frame-body" style={{padding: '64px 56px 56px'}}>
            <div className="ana" style={{display:'flex', justifyContent:'center'}}>
              <div className="stage" style={{position:'relative', width: 500}} aria-hidden="true">
                <SingleFileUploader/>
                {/* Leader lines */}
                <span className="lead v" style={{top: -22, left: '20%', height: 18}}/>
                <span className="lead h" style={{top: 60, right: -40, width: 36}}/>
                <span className="lead h" style={{top: 60, left: -40, width: 36}}/>
                <span className="lead v" style={{bottom: -22, left: '50%', height: 18, transform:'translateX(-50%)'}}/>
                {/* Numbered pins overlaid */}
                <div className="pin" style={{top: -42, left: '20%', transform:'translateX(-50%)'}}>1</div>
                <div className="pin" style={{top: 52, left: -68}}>2</div>
                <div className="pin" style={{top: 52, right: -68}}>3</div>
                <div className="pin" style={{bottom: -42, left: '50%', transform:'translateX(-50%)'}}>4</div>
              </div>
            </div>
            <div className="ana-list" style={{maxWidth: 560, margin:'56px auto 0'}}>
              <span className="num">1</span><span><b style={{color:'var(--fg)'}}>Dropzone.</b> <Mono>.in-drop</Mono> styled label wrapping a hidden file input.</span>
              <span className="num">2</span><span><b style={{color:'var(--fg)'}}>Drop state.</b> <Mono>.is-dragging</Mono> ember border + soft tint on dragover.</span>
              <span className="num">3</span><span><b style={{color:'var(--fg)'}}>File row.</b> <Mono>.in-file</Mono> with thumb, name, meta, progress bar, remove.</span>
              <span className="num">4</span><span><b style={{color:'var(--fg)'}}>Status.</b> <Mono>.is-success</Mono> / <Mono>.is-error</Mono> swap progress-bar colour and the meta line.</span>
            </div>
          </div>
        </div>

        {/* Decision matrix */}
        <SubHead meta="when to reach for what">When to use</SubHead>
        <Frame label="Pick the right primitive — File Input vs URL field vs API import">
          <div className="ds-grid cols-3" style={{width:'100%'}}>
            <div className="surface" style={{padding: 16}}>
              <div style={{fontWeight: 600, marginBlockEnd: 8}}>File Input</div>
              <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', margin: 0, lineHeight: 1.55}}>
                User has the file locally and wants to upload it now. Avatars, attachments, imports, support tickets.
              </p>
            </div>
            <div className="surface" style={{padding: 16}}>
              <div style={{fontWeight: 600, marginBlockEnd: 8}}>URL field</div>
              <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', margin: 0, lineHeight: 1.55}}>
                File lives on the public web — image URL, hosted PDF, RSS feed. Pair with a "Pick from your library" link to your asset manager.
              </p>
            </div>
            <div className="surface" style={{padding: 16}}>
              <div style={{fontWeight: 600, marginBlockEnd: 8}}>API import</div>
              <p style={{fontSize: 'var(--text-sm)', color:'var(--fg-muted)', margin: 0, lineHeight: 1.55}}>
                Bulk / scheduled imports from S3, GCS, FTP — or via a Eidos integration. Manual upload doesn't scale past a few dozen files.
              </p>
            </div>
          </div>
        </Frame>

        {/* Do / Don't */}
        <SubHead meta="rules">Do / Don't</SubHead>
        <div className="dd-grid">
          <div className="dd-card do">
            <div className="head"><Icons.check size={12}/> Do — state the constraint up front</div>
            <div className="body">
              <div className="in-drop compact" style={{width:'100%', maxWidth: 280, cursor:'default'}}>
                <span className="in-drop-icon"><Icons.upload size={16}/></span>
                <div style={{flex: 1}}>
                  <div className="in-drop-title"><span className="in-drop-link">Click to upload</span> or drag and drop</div>
                  <div className="in-drop-meta">PNG · JPG · up to 5 MB</div>
                </div>
              </div>
            </div>
            <div className="note">User knows what to drag <em>before</em> they drag. Validation surprises are the most common upload failure.</div>
          </div>
          <div className="dd-card dont">
            <div className="head"><Icons.x size={12}/> Don't — reject silently after upload starts</div>
            <div className="body">
              <div className="in-file is-error" style={{width:'100%', maxWidth: 280}}>
                <span className="in-file-thumb"><Icons.image size={16}/></span>
                <div className="in-file-body">
                  <div className="in-file-name">hero-banner.png</div>
                  <div className="in-file-meta" style={{color:'var(--danger)'}}>Upload failed</div>
                </div>
              </div>
            </div>
            <div className="note">Never start an upload that will fail. Surface the specific reason ("Too large — max 5 MB") with an obvious remove.</div>
          </div>

          <div className="dd-card do">
            <div className="head"><Icons.check size={12}/> Do — show progress per file</div>
            <div className="body" style={{flexDirection:'column', gap: 8}}>
              <div className="in-file" style={{width:'100%', maxWidth: 280, paddingBlock: 8, paddingInline: 12}}>
                <span className="in-file-thumb"><Icons.image size={16}/></span>
                <div className="in-file-body">
                  <div className="in-file-name">cover.png</div>
                  <div className="in-file-meta">100%</div>
                  <div className="in-file-progress"><span style={{width:'100%', background:'var(--success)'}}/></div>
                </div>
              </div>
              <div className="in-file" style={{width:'100%', maxWidth: 280, paddingBlock: 8, paddingInline: 12}}>
                <span className="in-file-thumb"><Icons.video size={16}/></span>
                <div className="in-file-body">
                  <div className="in-file-name">demo.mp4</div>
                  <div className="in-file-meta">62% · 4.3 MB / 7.0 MB</div>
                  <div className="in-file-progress"><span style={{width:'62%'}}/></div>
                </div>
              </div>
            </div>
            <div className="note">User can see which file is slow — and remove it without aborting the whole batch.</div>
          </div>
          <div className="dd-card dont">
            <div className="head"><Icons.x size={12}/> Don't — show one aggregate progress bar</div>
            <div className="body" style={{flexDirection:'column', gap: 8}}>
              <div style={{width:'100%', maxWidth: 280, fontSize: 'var(--text-base)', color:'var(--fg-muted)', fontVariantNumeric:'tabular-nums'}}>Uploading <Mono>2</Mono> files · 62%</div>
              <div className="in-file-progress" style={{width:'100%', maxWidth: 280, blockSize: 6}}><span style={{width:'62%'}}/></div>
            </div>
            <div className="note">A single bar at "62%" hides which file is stuck. User can't intervene per-file.</div>
          </div>

          <div className="dd-card do">
            <div className="head"><Icons.check size={12}/> Do — generate previews for images</div>
            <div className="body">
              <div className="in-file" style={{width:'100%', maxWidth: 280}}>
                <span className="in-file-thumb">
                  <div style={{width:'100%', height:'100%', background:'linear-gradient(135deg, oklch(70% 0.18 35), oklch(55% 0.20 50))'}}/>
                </span>
                <div className="in-file-body">
                  <div className="in-file-name">team-photo-2024.jpg</div>
                  <div className="in-file-meta">2.3 MB · uploaded</div>
                </div>
                <button type="button" className="in-file-x" tabIndex={-1} aria-label="Remove"><Icons.x size={14}/></button>
              </div>
            </div>
            <div className="note"><Mono>URL.createObjectURL(file)</Mono> is free and confirms the user picked the right file. Revoke on unmount.</div>
          </div>
          <div className="dd-card dont">
            <div className="head"><Icons.x size={12}/> Don't — use File Input for paste-and-parse flows</div>
            <div className="body">
              <div className="in-field" style={{width:'100%', maxWidth: 280}}>
                <label className="in-label">Paste CSV rows</label>
                <div className="in-group" style={{minHeight: 80}}>
                  <textarea className="in-control" rows={3} defaultValue={"name,email\nAda,ada@x.io\n…"} readOnly style={{padding: 8, blockSize: 80, lineHeight: 1.5}}/>
                </div>
              </div>
            </div>
            <div className="note">A dropzone implies network + persistence. A paste-and-parse flow is faster — use a textarea.</div>
          </div>
        </div>

        {/* 4. API REFERENCE */}
        <SubHead meta="FileInputProps">API reference</SubHead>
        <AutoPropsTable component="FileInput" label="<FileInput />"/>
      </Section>
    );
  };

export default FilePage;
