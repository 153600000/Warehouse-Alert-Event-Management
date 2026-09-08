import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle2, ShieldAlert, Wrench, Clock, Activity } from 'lucide-react';

export interface AlertDetailItem {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  source: string;
  message: string;
  metric?: string;
  value?: string | number;
  threshold?: string;
  timestamp: string;
  acknowledged?: boolean;
}

interface AlertModalProps {
  isOpen: boolean;
  alert: AlertDetailItem | null;
  onClose: () => void;
  onAcknowledge?: (id: string) => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  alert,
  onClose,
  onAcknowledge,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!alert) return null;

  const getSeverityBadge = () => {
    switch (alert.severity) {
      case 'CRITICAL':
        return (
          <span className="badge badge-critical" style={{ gap: '0.4rem' }}>
            <ShieldAlert size={14} /> Critical Breach
          </span>
        );
      case 'WARNING':
        return (
          <span className="badge badge-warning" style={{ gap: '0.4rem' }}>
            <AlertTriangle size={14} /> Safety Warning
          </span>
        );
      case 'INFO':
      default:
        return (
          <span className="badge badge-info" style={{ gap: '0.4rem' }}>
            <Activity size={14} /> Operational Notice
          </span>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem',
        }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 580,
              backgroundColor: 'var(--color-bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-xl)',
              overflow: 'hidden',
              zIndex: 101,
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--color-bg-tertiary)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {getSeverityBadge()}
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {alert.id}
                </span>
              </div>
              <button
                onClick={onClose}
                className="btn btn-secondary btn-icon"
                aria-label="Close modal"
                style={{ padding: '0.35rem', borderRadius: '50%' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                  {alert.message}
                </h2>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.825rem',
                  color: 'var(--color-text-secondary)',
                }}>
                  <Clock size={15} />
                  <span>Logged on: {new Date(alert.timestamp).toLocaleString()}</span>
                </div>
              </div>

              {/* Metric Breakdown Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem',
                backgroundColor: 'var(--color-bg-primary)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Origin Facility Zone
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '0.2rem' }}>
                    {alert.source}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Monitored Metric
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '0.2rem' }}>
                    {alert.metric || 'Telemetry Channel'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Recorded Peak Value
                  </div>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    color: alert.severity === 'CRITICAL' ? 'var(--color-error)' : 'var(--color-warning)',
                    marginTop: '0.2rem'
                  }}>
                    {alert.value || 'Out of spec'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Target Safe Threshold
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, fontFamily: 'var(--font-mono)', marginTop: '0.2rem', color: 'var(--color-text-secondary)' }}>
                    {alert.threshold || 'Nominal Range'}
                  </div>
                </div>
              </div>

              {/* Suggested Resolution Protocol */}
              <div style={{
                padding: '0.85rem 1rem',
                backgroundColor: 'var(--color-info-bg)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-info-border)',
                fontSize: '0.825rem',
                color: 'var(--color-text-primary)',
                display: 'flex',
                gap: '0.75rem',
              }}>
                <Wrench size={18} color="var(--color-info)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                <div>
                  <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>Standard Operating Procedure:</div>
                  Inspect automated diverter gate pneumatic actuators and calibrate temperature sensors. Verify cold chain vapor barriers in storage aisle 4.
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div style={{
              padding: '1rem 1.5rem',
              backgroundColor: 'var(--color-bg-tertiary)',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.75rem',
            }}>
              <button
                onClick={onClose}
                className="btn btn-secondary"
              >
                Dismiss
              </button>

              {onAcknowledge && (
                <button
                  onClick={() => {
                    onAcknowledge(alert.id);
                    onClose();
                  }}
                  className="btn btn-primary"
                  style={{ gap: '0.4rem' }}
                >
                  <CheckCircle2 size={16} /> Acknowledge Alert
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
