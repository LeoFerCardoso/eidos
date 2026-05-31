import * as React from 'react';
import { Icons } from '@/components/forge/icons';

const Confirmation = ({
  title, message, tone = 'default', state = 'pending',
  confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel, children,
}: {
  /** One-line label naming the action. Also the aria-label for the group. */
  title?: React.ReactNode;
  /** Explanatory text — the consequence, scope, or caveat. Recommended for destructive actions. */
  message?: React.ReactNode;
  /** default uses an ember Confirm button; danger uses the danger red for destructive actions. */
  tone?: string;
  /** Controls what renders. pending shows the full card; confirmed/cancelled render a compact result line. */
  state?: string;
  /** Label on the primary action button. Name the action: "Drop deploy", "Delete service". */
  confirmLabel?: string;
  /** Label on the secondary action button. */
  cancelLabel?: string;
  /** Called when Confirm is clicked. Wire this to set state to "confirmed". */
  onConfirm?: () => void;
  /** Called when Cancel is clicked. Wire this to set state to "cancelled". */
  onCancel?: () => void;
  /** Rendered inside the card body below message — use for custom content (e.g. a diff, affected resources). */
  children?: React.ReactNode;
}) => (
  <div className="ai-confirm" data-state={state} data-tone={tone} role="group" aria-label={typeof title === 'string' ? title : 'Confirmation'}>
    <div className="ai-confirm-body">
      <span className="ai-confirm-ico"><Icons.alert size={14}/></span>
      <div className="ai-confirm-text">
        {title && <div className="ai-confirm-title">{title}</div>}
        {message && <div className="ai-confirm-msg">{message}</div>}
        {children}
      </div>
    </div>
    {state === 'pending' ? (
      <div className="ai-confirm-actions">
        <button className="btn xs ghost" onClick={onCancel}>{cancelLabel}</button>
        <button className={'btn xs ' + (tone === 'danger' ? 'danger' : 'ember')} onClick={onConfirm}>{confirmLabel}</button>
      </div>
    ) : (
      <div className="ai-confirm-result" data-state={state}>
        {state === 'confirmed'
          ? <><Icons.check size={12}/> {confirmLabel}</>
          : <><Icons.x size={12}/> {cancelLabel}</>}
      </div>
    )}
  </div>
);

export { Confirmation };
