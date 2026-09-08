import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';
import { useToastStore, ToastItem } from '../store/toastStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  const getIcon = (type: ToastItem['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} color="var(--color-success)" />;
      case 'warning':
        return <AlertTriangle size={18} color="var(--color-warning)" />;
      case 'error':
        return <AlertOctagon size={18} color="var(--color-error)" />;
      case 'info':
      default:
        return <Info size={18} color="var(--color-info)" />;
    }
  };

  const getBorderColor = (type: ToastItem['type']) => {
    switch (type) {
      case 'success':
        return 'var(--color-success)';
      case 'warning':
        return 'var(--color-warning)';
      case 'error':
        return 'var(--color-error)';
      case 'info':
      default:
        return 'var(--color-info)';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 120,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.65rem',
      maxWidth: 380,
      width: '100%',
      pointerEvents: 'none',
    }}>
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            style={{
              pointerEvents: 'auto',
              backgroundColor: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              borderLeft: `4px solid ${getBorderColor(t.type)}`,
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
            }}
          >
            <div style={{ flexShrink: 0, marginTop: '0.1rem' }}>
              {getIcon(t.type)}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {t.title}
              </div>
              {t.message && (
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.15rem' }}>
                  {t.message}
                </div>
              )}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="btn-icon"
              aria-label="Dismiss toast"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                padding: '0.2rem',
                flexShrink: 0,
              }}
            >
              <X size={15} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
