import * as React from 'react';
import { Attachment } from '@/components/forge/attachment';
import { Icons } from '@/components/forge/icons';
import { ModelSelector } from '@/components/forge/model-selector';
import { PromptSubmit } from '@/components/forge/prompt-submit';

interface AttachmentFile {
  name: string;
  size: string;
  kind: 'file' | 'image';
  url?: string;
  hue?: number;
}

const DragDropOverlay = ({
  onDrop,
  modelValue = 'forge-sonnet-4-6',
  onModelChange,
  initialFiles = [],
  placeholder,
}: {
  onDrop?: (files: FileList) => void;
  modelValue?: string;
  onModelChange?: (id: string) => void;
  initialFiles?: (AttachmentFile & { id: string })[];
  placeholder?: string;
}) => {
  const [drag, setDrag] = React.useState(false);
  const [files, setFiles] = React.useState(initialFiles);
  return (
    <div
      className={'pi' + (drag ? ' is-dragging' : '')}
      style={{ position: 'relative' }}
      onDragEnter={e => { e.preventDefault(); setDrag(true); }}
      onDragOver={e => { e.preventDefault(); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => {
        e.preventDefault();
        setDrag(false);
        if (onDrop) onDrop(e.dataTransfer.files);
        setFiles(f => f.concat({
          id: 'f' + Date.now(),
          name: 'pasted-trace.json',
          size: '2.1 KB',
          kind: 'file',
        }));
      }}
    >
      {files.length > 0 && (
        <div className="pi-head">
          {files.map(f => (
            <Attachment
              key={f.id}
              file={f}
              onRemove={() => setFiles(arr => arr.filter(x => x.id !== f.id))}
            />
          ))}
        </div>
      )}
      <div className="pi-body">
        <textarea
          className="pi-textarea"
          placeholder={placeholder || 'Drag a file anywhere on this composer…'}
          rows={2}
          readOnly
          defaultValue="Have a look — anything jump out from the trace?"
        />
      </div>
      <div className="pi-foot">
        <button className="pi-tool"><Icons.paperclip size={15}/></button>
        {onModelChange && <ModelSelector value={modelValue} onChange={onModelChange}/>}
        <span className="spacer"/>
        <PromptSubmit status="ready" hasText={true} onClick={() => {}}/>
      </div>
      {drag && (
        <div className="pi-drop-overlay">
          <Icons.upload size={22}/>
          <span>Drop to attach</span>
          <span className="sub">images · PDFs · logs · up to 20 MB</span>
        </div>
      )}
    </div>
  );
};

export { DragDropOverlay };
