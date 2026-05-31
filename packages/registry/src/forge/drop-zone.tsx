import * as React from 'react';
import { Icons } from '@/components/forge/icons';
import { ModelSelector } from '@/components/forge/model-selector';
import { PromptSubmit } from '@/components/forge/prompt-submit';

const DropZone = ({
  onDrop,
  modelValue = 'forge-sonnet-4-6',
  onModelChange,
  children,
}: {
  onDrop?: (files: FileList) => void;
  modelValue?: string;
  onModelChange?: (id: string) => void;
  children?: React.ReactNode;
}) => {
  const [drag, setDrag] = React.useState(false);
  return (
    <div
      className={'pi' + (drag ? ' is-dragging' : '')}
      onDragEnter={e => { e.preventDefault(); setDrag(true); }}
      onDragOver={e => { e.preventDefault(); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => {
        e.preventDefault();
        setDrag(false);
        if (onDrop) onDrop(e.dataTransfer.files);
      }}
    >
      {children || (
        <div className="pi-body">
          <textarea className="pi-textarea" placeholder="Drag a file anywhere on this composer…" rows={2}/>
        </div>
      )}
      {drag ? (
        <div className="pi-drop-hint">
          <Icons.upload size={14}/> Drop to attach
        </div>
      ) : (
        <div className="pi-foot">
          <button className="pi-tool"><Icons.paperclip size={15}/></button>
          {onModelChange && (
            <ModelSelector value={modelValue} onChange={onModelChange}/>
          )}
          <span className="spacer"/>
          <PromptSubmit status="ready" hasText={false} onClick={() => {}}/>
        </div>
      )}
    </div>
  );
};

export { DropZone };
