import { useState } from 'react';
import Modal from './Modal.jsx';

// Asks before a destructive action. onConfirm may be async; the button shows progress meanwhile.
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  busyLabel = 'Deleting…',
  onConfirm,
  onClose,
}) {
  const [busy, setBusy] = useState(false);

  async function confirm() {
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open={open}
      title={title}
      onClose={busy ? () => {} : onClose}
      size="sm"
      footer={
        <>
          <button type="button" className="button button--secondary button--sm" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="button" className="button button--danger button--sm" onClick={confirm} disabled={busy}>
            {busy && <span className="spinner" aria-hidden="true" />}
            {busy ? busyLabel : confirmLabel}
          </button>
        </>
      }
    >
      <p className="admin-modal__message">{message}</p>
    </Modal>
  );
}
