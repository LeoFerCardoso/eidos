import * as React from 'react';
import { Icons } from '@/components/forge/icons';

interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'title' | 'value'> {
  /** Field label rendered above the drop zone. */
  label?: React.ReactNode;
  /** Headline inside the drop zone. */
  title?: React.ReactNode;
  /** Sub-line shown below the title (e.g. accepted types / max size). Alias: `helpText`. */
  meta?: React.ReactNode;
  /**
   * Override the auto-generated sub-line below the title.
   * Alias for `meta` — preferred in the public API.
   */
  helpText?: React.ReactNode;
  /**
   * Compact single-row layout — less vertical space, ideal for dense forms.
   * @default false
   */
  compact?: boolean;
  /** Error message — renders below the drop zone in the danger tone. */
  error?: React.ReactNode;
  /**
   * Fires when files are dropped or picked via the file dialog (FileList).
   * For the public `File[]` API use `onFilesChange`.
   */
  onFiles?: (files: FileList) => void;
  /**
   * Fires when files are added. Receives the selected files as a `File[]` array.
   * Docs-API alias — the implementation wraps `onFiles`.
   */
  onFilesChange?: (files: File[]) => void;
  /**
   * Maximum byte size per file. Files over the limit should be rejected by the
   * consumer (the component itself does not validate — wire this in `onFilesChange`).
   */
  maxSize?: number;
  /**
   * Controlled file list. Pair with `onFilesChange` for a fully controlled component.
   */
  value?: File[];
}

function FileInput({ label, title = 'Click to upload or drag & drop', meta, helpText, compact = false, error, onFiles, onFilesChange, maxSize, value: _value, id, className = '', onChange, disabled, ...rest }: FileInputProps) {
  const reactId = React.useId();
  const fid = id || reactId;
  const [dragging, setDragging] = React.useState(false);
  return (
    <div className="in-field">
      {label && <label className="in-label" htmlFor={fid}>{label}</label>}
      <label
        className={`in-drop${compact ? ' compact' : ''}${dragging ? ' is-dragging' : ''}${error ? ' is-invalid' : ''} ${className}`.trim()}
        htmlFor={fid}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); if (!disabled && e.dataTransfer.files.length) onFiles?.(e.dataTransfer.files); }}
      >
        <span className="in-drop-icon"><Icons.upload size={compact ? 16 : 18} /></span>
        <div style={{ flex: compact ? 1 : undefined }}>
          <div className="in-drop-title">{title}</div>
          {(meta ?? helpText) && <div className="in-drop-meta">{meta ?? helpText}</div>}
        </div>
        <input
          id={fid}
          type="file"
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          onChange={(e) => {
            if (e.target.files?.length) {
              onFiles?.(e.target.files);
              onFilesChange?.(Array.from(e.target.files));
            }
            onChange?.(e);
          }}
          {...rest}
        />
      </label>
      {error && <span className="in-helprow"><span className="in-error">{error}</span></span>}
    </div>
  );
}

export { FileInput };
