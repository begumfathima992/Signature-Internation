import { useEffect, useId, useLayoutEffect, useRef } from 'react';
import Icon from '../components/Icon.jsx';

// A dialog built on <dialog>, which keeps focus inside, closes on Escape and returns focus afterwards.
export default function Modal({ open, title, onClose, children, footer, size = 'md' }) {
  const ref = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // If the dialog is removed while open, close it first so focus goes back to what opened it.
  useLayoutEffect(() => {
    const dialog = ref.current;
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      className={`admin-modal admin-modal--${size}`}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      {open && (
        <div className="admin-modal__inner">
          <header className="admin-modal__header">
            <h2 id={titleId}>{title}</h2>
            <button type="button" className="icon-button" aria-label="Close" onClick={onClose}>
              <Icon name="close" size={20} />
            </button>
          </header>
          <div className="admin-modal__body">{children}</div>
          {footer && <footer className="admin-modal__footer">{footer}</footer>}
        </div>
      )}
    </dialog>
  );
}
