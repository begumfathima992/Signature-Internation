import { useCallback, useMemo, useRef, useState } from 'react';
import Icon from '../components/Icon.jsx';
import { ToastContext } from './toast.js';

const SHOW_FOR_MS = 4500;

// Short messages in the corner after saving. Success is announced politely; errors interrupt.
export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id) => setToasts((current) => current.filter((toast) => toast.id !== id)), []);

  const show = useCallback(
    (type, message) => {
      const id = nextId.current++;
      setToasts((current) => [...current.slice(-3), { id, type, message }]);
      setTimeout(() => dismiss(id), type === 'error' ? SHOW_FOR_MS * 2 : SHOW_FOR_MS);
    },
    [dismiss],
  );

  const value = useMemo(
    () => ({ success: (message) => show('success', message), error: (message) => show('error', message) }),
    [show],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toasts">
        <div role="status" aria-live="polite">
          {toasts
            .filter((toast) => toast.type === 'success')
            .map((toast) => (
              <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
            ))}
        </div>
        <div role="alert">
          {toasts
            .filter((toast) => toast.type === 'error')
            .map((toast) => (
              <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
            ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

function Toast({ toast, onDismiss }) {
  return (
    <div className={`toast toast--${toast.type}`}>
      <Icon name={toast.type === 'success' ? 'check' : 'close'} size={18} />
      <span>{toast.message}</span>
      <button type="button" className="toast__close" aria-label="Dismiss message" onClick={() => onDismiss(toast.id)}>
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}
