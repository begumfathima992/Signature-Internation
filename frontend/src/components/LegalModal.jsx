import { useEffect, useRef } from 'react';
import { legal } from '../data/legal.js';
import Icon from './Icon.jsx';

// Native <dialog> keeps focus inside the modal and closes on Escape.
export default function LegalModal({ doc, onClose }) {
  const dialogRef = useRef(null);
  const content = doc ? legal[doc] : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (doc && !dialog.open) dialog.showModal();
    if (!doc && dialog.open) dialog.close();
  }, [doc]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby="modal-title"
      onClose={onClose}
      onClick={(event) => event.target === dialogRef.current && onClose()}
    >
      {content && (
        <div className="modal__panel">
          <header className="modal__header">
            <h2 id="modal-title">{content.title}</h2>
            <button type="button" className="icon-button" onClick={onClose} aria-label="Close">
              <Icon name="close" />
            </button>
          </header>
          <div className="modal__body">
            {content.sections.map((section) => (
              <section key={section.heading}>
                <h3>{section.heading}</h3>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
        </div>
      )}
    </dialog>
  );
}
