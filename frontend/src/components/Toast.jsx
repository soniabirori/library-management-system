import { createContext, useCallback, useContext, useState } from 'react';
import Icon from './Icon';

// Short messages in the corner after an action ("Book saved successfully").
const ToastContext = createContext(() => {});

const ICONS = { success: 'check', error: 'alert', info: 'sparkles' };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const notify = useCallback(
    (message, type = 'success') => {
      const id = Date.now() + Math.random();
      setToasts((list) => [...list.slice(-2), { id, message, type }]);
      setTimeout(() => dismiss(id), 3600);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span className="toast-icon">
              <Icon name={ICONS[t.type]} size={16} strokeWidth={2.2} />
            </span>
            <p>{t.message}</p>
            <button type="button" className="toast-close" onClick={() => dismiss(t.id)} aria-label="Dismiss">
              <Icon name="x" size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** const notify = useToast(); notify('Saved'); notify('Oops', 'error'); */
export function useToast() {
  return useContext(ToastContext);
}
