import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';
import Icon from './Icon';

/** Dialog shown over the page. Closes on Escape, on the X, or by clicking outside. */
export default function Modal({ open, title, subtitle, icon, size = 'md', onClose, children, footer }) {
  const panelRef = useRef(null);
  const titleId = useId();
  // Keep the latest onClose without re-running the effect on every render.
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    const lastFocused = document.activeElement;
    const onKey = (e) => {
      if (e.key === 'Escape') closeRef.current();
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      const first = panelRef.current?.querySelector('input, select, textarea, [data-autofocus]');
      first?.focus();
    }, 30);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      lastFocused?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`modal modal-${size}`} role="dialog" aria-modal="true" aria-labelledby={titleId} ref={panelRef}>
        <header className="modal-header">
          {icon && (
            <span className="modal-icon">
              <Icon name={icon} size={20} />
            </span>
          )}
          <div className="modal-heading">
            <h2 id={titleId}>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            <Icon name="x" size={18} />
          </button>
        </header>
        <div className="modal-body">{children}</div>
        {footer && <footer className="modal-footer">{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}

/** A modal that holds a form, with Save and Cancel buttons. */
export function FormModal({ open, title, subtitle, icon, onClose, onSubmit, saveLabel = 'Save', children }) {
  const formId = useId();
  return (
    <Modal
      open={open}
      title={title}
      subtitle={subtitle}
      icon={icon}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={formId} icon="check">
            {saveLabel}
          </Button>
        </>
      }
    >
      <form
        id={formId}
        className="form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {children}
      </form>
    </Modal>
  );
}

/** "Are you sure?" dialog used before deleting something. */
export function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onClose }) {
  return (
    <Modal
      open={open}
      size="sm"
      title={title}
      icon="trash"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" icon="trash" onClick={onConfirm} data-autofocus>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="confirm-text">{message}</p>
    </Modal>
  );
}
