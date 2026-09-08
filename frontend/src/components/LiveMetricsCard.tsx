import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

export interface MetricCardProps {
  id: string;
  title: string;
  value: number | string;
  unit: string;
  status: 'NOMINAL' | 'ALERT' | 'CRITICAL';
  delta?: number;
  deltaLabel?: string;
  lastUpdated: string;
  isLive?: boolean;
  minThreshold?: number;
  maxThreshold?: number;
  description?: string;
  onClick?: () => void;
}

export const LiveMetricsCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  status,
  delta = 0,
  deltaLabel,
  lastUpdated,
  isLive = true,
  minThreshold,
  maxThreshold,
  description,
  onClick,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'CRITICAL':
        return 'var(--color-error)';
      case 'ALERT':
        return 'var(--color-warning)';
      case 'NOMINAL':
      default:
        return 'var(--color-success)';
    }
  };

  const getStatusBg = () => {
    switch (status) {
      case 'CRITICAL':
        return 'var(--color-error-bg)';
      case 'ALERT':
        return 'var(--color-warning-bg)';
      case 'NOMINAL':
      default:
        return 'var(--color-success-bg)';
    }
  };

  return (
    <motion.div
      onClick={onClick}
      className="card live-metrics-card"
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: `4px solid ${getStatusColor()}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: 180,
      }}
    >
      {/* Top row: Title and Status badge */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '0.5rem',
          marginBottom: '0.75rem',
        }}>
          <div>
            <h3 style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              margin: 0,
            }}>
              {title}
            </h3>
            {description && (
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                {description}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span
              className={`badge badge-${status.toLowerCase()}`}
              style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
            >
              {status}
            </span>
            {onClick && (
              <span title="Click for telemetry inspection" style={{ color: 'var(--color-text-muted)' }}>
                <Info size={14} />
              </span>
            )}
          </div>
        </div>

        {/* Center: Metric Value */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', margin: '0.5rem 0' }}>
          <motion.div
            key={String(value)}
            initial={{ opacity: 0.7, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            style={{
              fontSize: '2.1rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-text-primary)',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
            }}
          >
            {typeof value === 'number' ? (Number.isInteger(value) ? value : value.toFixed(1)) : value}
          </motion.div>
          <span style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--color-text-secondary)'
          }}>
            {unit}
          </span>
        </div>
      </div>

      {/* Bottom row: Delta & Timestamp */}
      <div style={{
        marginTop: '0.75rem',
        paddingTop: '0.65rem',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
      }}>
        {/* Trend delta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {delta > 0 ? (
            <TrendingUp size={14} color="var(--color-success)" />
          ) : delta < 0 ? (
            <TrendingDown size={14} color="var(--color-error)" />
          ) : (
            <Minus size={14} color="var(--color-text-muted)" />
          )}
          <span style={{
            fontWeight: 600,
            color: delta > 0 ? 'var(--color-success)' : delta < 0 ? 'var(--color-error)' : 'var(--color-text-muted)'
          }}>
            {delta > 0 ? `+${delta.toFixed(1)}` : delta < 0 ? delta.toFixed(1) : '0.0'}
            {deltaLabel ? ` ${deltaLabel}` : ''}
          </span>
        </div>

        {/* Last updated */}
        <div style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span>Updated {new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>
      </div>
    </motion.div>
  );
};
